---
title: "OpenClaw 多 Agent 配置与通信机制深度研究"
date: 2026-03-28
categories: [AI]
tags: [OpenClaw, 多Agent, 通信机制, 架构设计, Session]
header:
  overlay_image: /assets/images/posts/multi-agent-communication-header.png
  overlay_filter: 0.4
excerpt: "从核心概念、路由机制、四种通信方式到六种架构模式，一篇吃透 OpenClaw 多 Agent 的配置与协作。"
---

> 基于 OpenClaw 最新文档和源码分析，梳理多 Agent 的配置方法、通信机制、典型架构模式。

---

## 第一章：核心概念

### 1.1 什么是"一个 Agent"

在 OpenClaw 中，一个 Agent 是一个**完全隔离的 AI 大脑**：

| 组成 | 说明 | 路径 |
|------|------|------|
| **Workspace** | 工作空间（AGENTS.md / SOUL.md / USER.md / TOOLS.md 等 7 文件） | `~/.openclaw/workspace-<agentId>` |
| **AgentDir** | 认证配置、模型注册 | `~/.openclaw/agents/<agentId>/agent/` |
| **Session Store** | 会话历史 + 路由状态 | `~/.openclaw/agents/<agentId>/sessions/` |
| **Auth Profiles** | 模型认证（API Key 等） | `~/.openclaw/agents/<agentId>/agent/auth-profiles.json` |
| **Skills** | 私有技能（`workspace/skills/`）+ 共享技能（`~/.openclaw/skills/`） | 按优先级合并 |

**关键隔离原则**：
- Auth Profiles **不**在 Agent 间共享（需手动复制）
- Session Store 完全隔离（Agent A 看不到 Agent B 的对话历史）
- Workspace 是默认 cwd，但**不是硬沙箱**（绝对路径可逃逸，除非开启 Sandbox）

### 1.2 单 Agent 模式（默认）

不做任何配置时，OpenClaw 运行单 Agent：
- `agentId` 默认为 `main`
- Session Key 为 `agent:main:main`
- Workspace 为 `~/.openclaw/workspace`

### 1.3 多 Agent 模式

通过 `agents.list[]` 声明多个 Agent，通过 `bindings[]` 路由消息：

```json5
{
  agents: {
    list: [
      { id: "main", default: true, workspace: "~/.openclaw/workspace-main" },
      { id: "sales", workspace: "~/.openclaw/workspace-sales" },
      { id: "support", workspace: "~/.openclaw/workspace-support" }
    ]
  },
  bindings: [
    { agentId: "sales", match: { channel: "telegram", peer: { kind: "group", id: "-100xxx" } } },
    { agentId: "support", match: { channel: "feishu", accountId: "support-bot" } }
  ]
}
```

---

## 第二章：路由机制（消息如何到达正确的 Agent）

### 2.1 路由优先级（从高到低）

每条入站消息，OpenClaw 按以下顺序匹配**唯一一个 Agent**：

| 优先级 | 匹配规则 | 说明 |
|--------|---------|------|
| 1 | **peer 精确匹配** | binding 中指定 `peer.kind` + `peer.id`（DM/群组/频道） |
| 2 | **parentPeer 匹配** | 线程继承父级路由 |
| 3 | **guildId + roles** | Discord 角色路由 |
| 4 | **guildId** | Discord 服务器级路由 |
| 5 | **teamId** | Slack 团队级路由 |
| 6 | **accountId** | 按渠道账号路由 |
| 7 | **channel 通配** | `accountId: "*"` 匹配该渠道所有账号 |
| 8 | **default Agent** | `agents.list[].default: true`，否则列表第一个，最终回退到 `main` |

**核心规则**：
- 同层多个 binding 匹配时，**配置顺序先者胜**
- 一个 binding 包含多个匹配字段时，**所有字段必须同时满足**（AND 语义）
- peer 绑定永远胜过 channel 通配（把 peer 绑定放在前面）

### 2.2 Session Key 格式

路由确定 Agent 后，消息落入对应的 Session：

| 场景 | Session Key 格式 |
|------|-----------------|
| DM（直接消息） | `agent:<agentId>:main` |
| 群组 | `agent:<agentId>:<channel>:group:<id>` |
| 频道 | `agent:<agentId>:<channel>:channel:<id>` |
| 话题/线程 | `agent:<agentId>:telegram:group:<chatId>:topic:<topicId>` |
| Sub-agent | `agent:<agentId>:subagent:<uuid>` |
| Cron | `cron:<jobId>:run:<uuid>` |

---

## 第三章：Agent 间通信机制

OpenClaw 提供**四种** Agent 间通信方式：

### 3.1 sessions_send（同步/异步消息传递）

**场景**：Agent A 需要 Agent B 执行一个任务并返回结果。

```
Agent A 调用 sessions_send:
  → 消息注入 Agent B 的 session
  → Agent B 执行任务
  → 结果返回 Agent A

支持同步等待（timeoutSeconds > 0）和异步（timeoutSeconds = 0）
```

**关键特性**：
- 支持**乒乓回复**：发送后双方可以多轮交互（最多 `maxPingPongTurns` 轮，默认 5）
- 回复 `REPLY_SKIP` 终止乒乓
- 消息标记 `provenance.kind = "inter_session"`，可区分 Agent 间消息和用户消息

### 3.2 sessions_spawn（派生子 Agent）

**场景**：当前 Agent 需要后台执行一个独立任务，完成后自动汇报。

```
Main Agent 调用 sessions_spawn:
  → 创建隔离 session: agent:<agentId>:subagent:<uuid>
  → 子 Agent 后台执行（非阻塞）
  → 完成后自动 announce 回父 Agent 的渠道
```

**关键特性**：
- **非阻塞**：立即返回 `{ status: "accepted", runId, childSessionKey }`
- **自动汇报**：完成后 announce 到父级渠道
- 子 Agent **默认没有 session tools**（不能 spawn 更多子 Agent）

### 3.3 嵌套 Sub-Agents（编排者模式）

**场景**：需要一个编排者 Agent 来管理多个工作者 Agent。

```
Main Agent
  └── sessions_spawn → Orchestrator (depth 1)
        ├── sessions_spawn → Worker A (depth 2)
        ├── sessions_spawn → Worker B (depth 2)
        └── sessions_spawn → Worker C (depth 2)
```

**启用**：

```json5
{
  agents: {
    defaults: {
      subagents: {
        maxSpawnDepth: 2,        // 允许嵌套（默认 1，最大 5）
        maxChildrenPerAgent: 5,  // 每个 Agent 最多 5 个子 Agent
        maxConcurrent: 8         // 全局并发上限
      }
    }
  }
}
```

**深度级别与权限**：

| 深度 | 角色 | 拥有的 Session Tools |
|------|------|---------------------|
| 0 | Main Agent | 全部 |
| 1 | 编排者（当 maxSpawnDepth ≥ 2） | `sessions_spawn`, `subagents`, `sessions_list`, `sessions_history` |
| 1 | 叶子（当 maxSpawnDepth = 1） | 无 session tools |
| 2 | 叶子工作者 | 无（永远不能再 spawn） |

### 3.4 Broadcast Groups（广播组）

**场景**：一条消息需要**多个 Agent 同时处理**（不是路由到一个，而是全部执行）。

```json5
{
  broadcast: {
    strategy: "parallel",  // 或 "sequential"
    "120363403215116621@g.us": ["code-reviewer", "security-scanner", "test-generator"]
  }
}
```

### 3.5 共享文件系统（间接通信）

Agent 可以通过文件系统间接通信：

```
Agent A 写入 → shared/data/report.json
Agent B 读取 ← shared/data/report.json
```

### 3.6 四种通信方式对比

| 方式 | 方向 | 同步/异步 | 隔离级别 | 适用场景 |
|------|------|----------|---------|---------|
| **sessions_send** | A ↔ B | 支持两种 | Session 隔离 | 任务委派 + 结果返回 |
| **sessions_spawn** | A → B（announce 回来） | 异步 | 完全隔离 | 后台任务、并行研究 |
| **嵌套 Sub-agents** | Main → 编排者 → 工作者 | 异步 | 完全隔离 | 复杂编排、多步骤任务 |
| **Broadcast** | 一对多（同时执行） | 并行/顺序 | 完全隔离 | 多视角分析、团队审查 |
| **共享文件** | 间接 | 异步 | 依赖文件权限 | 数据共享、状态传递 |

---

## 第四章：Per-Agent 安全与工具配置

### 4.1 Per-Agent Tool Policy

每个 Agent 可以有不同的工具权限：

```json5
{
  agents: {
    list: [
      {
        id: "support",
        tools: {
          allow: ["read", "message", "web_search", "web_fetch"],
          deny: ["exec", "write", "edit", "apply_patch", "browser"]
        }
      }
    ]
  }
}
```

**Tool Policy 优先级链**（逐层收窄，不能回授）：

```
1. Tool Profile        → tools.profile
2. Provider Profile    → tools.byProvider[provider].profile
3. Global Policy       → tools.allow / tools.deny
4. Provider Policy     → tools.byProvider[provider].allow/deny
5. Agent Policy        → agents.list[].tools.allow/deny
6. Sandbox Policy      → tools.sandbox.tools
7. Subagent Policy     → tools.subagents.tools
```

**Tool Groups（快捷方式）**：

| Group | 展开为 |
|-------|--------|
| `group:runtime` | exec, bash, process |
| `group:fs` | read, write, edit, apply_patch |
| `group:sessions` | sessions_list, sessions_history, sessions_send, sessions_spawn, session_status |
| `group:memory` | memory_search, memory_get |
| `group:ui` | browser, canvas |
| `group:automation` | cron, gateway |
| `group:messaging` | message |

### 4.2 Per-Agent Sandbox

```json5
{
  agents: {
    list: [
      {
        id: "public",
        sandbox: {
          mode: "all",                         // 全部 session 沙箱
          scope: "agent"                       // 每个 agent 一个容器
        },
        tools: {
          allow: ["read"],
          deny: ["exec", "write", "edit"]
        }
      }
    ]
  }
}
```

**Sandbox mode 选项**：
- `off`：不沙箱
- `non-main`：非 main session 沙箱
- `all`：所有 session 都沙箱

**Sandbox scope 选项**：
- `session`：每个 session 一个容器
- `agent`：每个 agent 一个容器
- `shared`：所有 agent 共享一个容器

---

## 第五章：典型多 Agent 架构模式

### 5.1 模式一：单入口路由（CEO 模式）

```
              用户（飞书/钉钉/Telegram）
                      │
                      ▼
              ┌───────────────┐
              │  CEO Agent    │  ← default: true
              │  (路由中枢)    │
              └───┬───┬───┬───┘
                  │   │   │
        spawn     │   │   │    spawn
        ┌─────────┘   │   └─────────┐
        ▼             ▼             ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐
   │ Sales   │  │ Support │  │ Content │
   │ Agent   │  │ Agent   │  │ Agent   │
   └─────────┘  └─────────┘  └─────────┘
```

**适用场景**：OPC 数字员工平台、个人助理团队

### 5.2 模式二：直接路由（专线模式）

```
              用户（多个群/渠道）
              │        │        │
              ▼        ▼        ▼
          飞书群A   飞书群B  Telegram
              │        │        │
              ▼        ▼        ▼
         ┌────────┐┌────────┐┌────────┐
         │ Sales  ││Support ││ Main   │
         │ Agent  ││ Agent  ││ Agent  │
         └────────┘└────────┘└────────┘
```

**适用场景**：每个 Agent 有明确的渠道/群组归属

### 5.3 模式三：编排者模式（Orchestrator）

```
              用户
                │
                ▼
         ┌─────────────┐
         │ Orchestrator │  (depth 1, 有 session tools)
         └──┬───┬───┬──┘
            │   │   │   spawn
            ▼   ▼   ▼
         ┌───┐┌───┐┌───┐
         │ W1││ W2││ W3│  (depth 2, 叶子工作者)
         └───┘└───┘└───┘
```

**适用场景**：复杂任务需要拆分为多个并行子任务

### 5.4 模式四：广播团队（Broadcast）

**适用场景**：Code Review 团队、多语言支持、多视角分析

### 5.5 模式五：按渠道分工 + 按模型分级

**适用场景**：不同渠道用不同模型（日常用 Sonnet、深度分析用 Opus）

### 5.6 模式六：混合模式（实际生产推荐）

实际生产中通常是多种模式的组合。

---

## 第六章：配置最佳实践

### 6.1 模型分级策略

```json5
{
  agents: {
    defaults: {
      model: { primary: "anthropic/claude-sonnet-4-5" },
      subagents: {
        model: "anthropic/claude-haiku-3-5"  // 子 Agent 默认便宜
      }
    },
    list: [
      { id: "ceo", model: "anthropic/claude-sonnet-4-5" },
      { id: "research", model: "anthropic/claude-opus-4-6" },
      { id: "support", model: "anthropic/claude-haiku-3-5" }
    ]
  }
}
```

### 6.2 共享 vs 隔离决策表

| 需求 | 方案 |
|------|------|
| Agent 间共享知识 | 共享目录（`shared/knowledge/`）或 `sessions_send` 传递 |
| Agent 间共享认证 | 复制 `auth-profiles.json`（不要共用 agentDir！） |
| Agent 间共享 Skills | 放到 `~/.openclaw/skills/`（全局共享目录） |
| Agent 间完全隔离 | 默认行为（不同 workspace + agentDir + session store） |
| Agent 间通信 | `sessions_send` / `sessions_spawn` |

---

## 第七章：总结

### 多 Agent 能力矩阵

| 能力 | 配置方式 | 一句话说明 |
|------|---------|----------|
| **声明 Agent** | `agents.list[]` | 每个 Agent 有独立 workspace/session/auth |
| **路由消息** | `bindings[]` | 按 peer > account > channel > default 匹配 |
| **派发任务** | `sessions_spawn` | 非阻塞，子 Agent 完成后自动汇报 |
| **同步通信** | `sessions_send` | 支持等待回复 + 乒乓多轮 |
| **嵌套编排** | `maxSpawnDepth: 2` | Main → 编排者 → 工作者 三级结构 |
| **广播处理** | `broadcast{}` | 一条消息多个 Agent 同时处理 |
| **工具权限** | `agents.list[].tools` | Per-Agent allow/deny，逐层收窄 |
| **沙箱隔离** | `agents.list[].sandbox` | Per-Agent 沙箱模式和范围 |
| **模型分级** | `agents.list[].model` | Per-Agent 不同模型（成本优化） |

### 架构选型速查

| 场景 | 推荐架构 | 理由 |
|------|---------|------|
| OPC 数字员工平台 | CEO + 直接路由混合 | CEO 处理 DM，专线处理专业群 |
| 代码审查团队 | 广播 | 多角度同时审查 |
| 复杂研究任务 | 编排者 | 拆分并行 + 汇总 |
| 多用户共享 Gateway | 直接路由 | 每人一个 Agent，按 peer 路由 |
| 生产系统 | 混合模式 | 组合多种模式 |

---

*文档由 wairesearch (黄山) 生成 | 2026-03-28*
*基于 OpenClaw 最新官方文档（v2026.3.22+）*
*来源：channel-routing.md, multi-agent.md, subagents.md, session-tool.md, broadcast-groups.md*
