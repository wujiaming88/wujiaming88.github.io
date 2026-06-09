---
title: "OpenClaw Skill Workshop：让 AI Agent 自己写 SOP"
date: 2026-05-07 10:00:00 +0800
categories: [AI]
tags: [OpenClaw, Skill Workshop, Agent Memory, Procedural Learning]
toc: true
toc_sticky: true
header:
  overlay_image: /assets/images/posts/openclaw-skill-workshop-header.png
  overlay_filter: 0.3
excerpt: "Memory 记住事实，Skill 规定流程。Skill Workshop 是连接两者的桥梁——它让 Agent 从工作中自动提炼可复用的操作规程，下次遇到类似任务直接按 SOP 执行。深度解析这个实验性但极具潜力的特性。"
---

## 一个痛点：Agent 总在同一个地方摔倒

用过 AI Agent 的人都有这种体验：

> 你纠正了 Agent 一次："下次记得先验证图片是不是动图，别直接用。"
>
> 它在 Memory 里记了一笔。
>
> 但下次真遇到类似场景，它可能记住了"要验证"，却忘了具体该验证什么、怎么验证、验证后该做什么。

**问题的本质**：Memory 擅长存事实，但不擅长存流程。

"用户喜欢蓝色"是事实，存 Memory 没问题。但"拿到外部 GIF 后先验证是否真动图、再记录版权、再本地存副本、最后在产品 UI 确认渲染"——这是**程序性知识**，它需要的是一份 SOP，不是一条记忆。

## Skill Workshop：程序性记忆系统

OpenClaw 最近推出的 **Skill Workshop** 插件，正是解决这个问题的答案。

一句话定义：

> **Skill Workshop 让 Agent 从工作经验中自动提炼可复用的 SKILL.md 文件。**

| 概念 | 存什么 | 类比 |
|------|--------|------|
| Memory | 事实、偏好、上下文 | 大脑海马体 |
| Skills | 可复用的操作规程 | SOP 手册 |
| **Skill Workshop** | **从经验中生成 SOP** | 老员工带新人写操作手册 |

它的输出是标准的 `SKILL.md` 文件，存放在 `<workspace>/skills/` 目录下，和手写的 Skill 享受完全相同的加载、优先级、门控机制。

## 工作原理：三条捕获路径

### 路径一：显式调用

Agent 识别到可复用流程时，直接调用 `skill_workshop` tool：

```json
{
  "action": "suggest",
  "skillName": "animated-gif-workflow",
  "title": "Animated GIF Workflow",
  "description": "验证动图资产的完整流程",
  "body": "## Workflow\n\n- 验证 URL 返回 image/gif\n- 确认包含多帧\n- 记录版权归属\n- 本地存储副本"
}
```

这是最可控的方式，即使关闭自动捕获也能使用。

### 路径二：启发式捕获

当用户说出"纠正性语句"时，自动触发：

| 触发短语 | 示例 |
|----------|------|
| `next time` | "下次记得先跑测试" |
| `from now on` | "从现在开始用 PNG 格式" |
| `remember to` | "记得验证文件大小" |
| `make sure to` | "确保检查链接有效性" |
| `always ... verify` | "永远先验证权限" |

捕获后自动分类到对应 skill：
- GIF 相关 → `animated-gif-workflow`
- 截图相关 → `screenshot-asset-workflow`
- QA 相关 → `qa-scenario-workflow`
- GitHub PR → `github-pr-workflow`
- 其他 → `learned-workflows`

### 路径三：LLM Reviewer

这是最智能的路径。达到阈值后（默认 15 次 agent turn 或 8 次 tool call），系统启动一个嵌入式 LLM 审查器：

**输入**：
- 最近 12,000 字符的对话 transcript
- 当前 workspace 最多 12 个已有 skill（每个最多 2,000 字符）

**输出**：
- `{ "action": "none" }` — 没发现值得提炼的
- `{ "action": "create", ... }` — 创建新 skill
- `{ "action": "append", ... }` — 追加到已有 skill
- `{ "action": "replace", ... }` — 替换已有 skill 中的内容

**关键约束**：reviewer 没有任何工具权限（`disableTools: true`），只做纯文本分析，不会产生副作用。

## 安全设计：Proposal 审批制

Skill Workshop 不会直接改你的文件。每个捕获结果都经过一条安全管线：

```
捕获/提炼
    ↓
内容扫描器（检测危险模式）
    ↓
┌─────────────────────┐
│ 安全？               │
├─ ✅ safe ────→ pending（等待审批）或 auto-apply
└─ ❌ critical ─→ quarantine（隔离，无法 apply）
```

### Proposal 状态机

```
pending ──→ applied（批准写入）
   │
   └──→ rejected（拒绝）

quarantined（永不自动写入，需人工干预）
```

### 写入限制

- **目录限制**：只写入 `<workspace>/skills/<skill-name>/`
- **文件大小限制**：默认 40KB
- **支持文件**：只允许 `references/`、`templates/`、`scripts/`、`assets/` 子目录
- **名称规范化**：强制小写 + `[a-z0-9_-]`
- **去重**：相同 skill name + 相同 change payload 自动去重

## 配置指南

### 最小安全配置（推荐起步）

```json5
{
  plugins: {
    entries: {
      "skill-workshop": {
        enabled: true,
        config: {
          autoCapture: true,
          approvalPolicy: "pending",  // 人工审批
          reviewMode: "hybrid"        // 启发式 + LLM
        }
      }
    }
  }
}
```

### 四种预设 Profile

| Profile | autoCapture | approvalPolicy | reviewMode | 适用场景 |
|---------|-------------|----------------|------------|----------|
| 保守型 | `false` | `pending` | `off` | 只响应显式调用 |
| 审批型 | `true` | `pending` | `hybrid` | 推荐起步配置 |
| 自动型 | `true` | `auto` | `hybrid` | 可信个人 workspace |
| 低成本 | `true` | `pending` | `heuristic` | 不想花 LLM 调用费 |

### 关键参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `reviewInterval` | 15 | 每 N 次 turn 触发 reviewer |
| `reviewMinToolCalls` | 8 | 累计 N 次 tool call 后触发 |
| `reviewTimeoutMs` | 45000 | reviewer 超时时间 |
| `maxPending` | 50 | 最大待审/隔离 proposal 数 |
| `maxSkillBytes` | 40000 | 单文件最大字节数 |

## 实战场景

### 场景一：博客发布流程沉淀

用户多次纠正 Agent 的博客发布流程后，Skill Workshop 自动提炼：

```markdown
---
name: blog-publish-workflow
description: 博客文章发布的标准操作流程
---

## Workflow

1. 查看最近 3 张配图，确保风格不重复
2. 生成配图（禁止深蓝紫霓虹风格）
3. 文章不带内部链接
4. Front matter 必须包含 overlay_image
5. git commit & push
6. 第一时间告知用户结果
```

### 场景二：代码审查规程

```markdown
---
name: code-review-workflow
description: PR 代码审查标准流程
---

## Before Review

- Check unresolved threads
- Verify CI status
- Read linked issues

## During Review

- Focus on logic errors over style
- Check error handling paths
- Verify test coverage for changed code
```

### 场景三：调研报告规范

```markdown
---
name: research-report-workflow
description: 技术调研报告的质量标准
---

## 数据源要求

- 每个产品至少 3 种搜索策略交叉验证
- GitHub Stars/Forks/Release 频率必查
- 数据标注来源和日期
- 搜不到如实标注"未公开"

## 输出要求

- 覆盖完整赛道，主动发现未知玩家
- 有判断力，不只搬运信息
- 矛盾数据标注争议
```

## 与现有方案的对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| MEMORY.md 手写规则 | 简单直接 | 手动维护、容易臃肿 |
| self-improving-agent skill | 记录错误和学习 | 被动记录，不生成可执行规程 |
| **Skill Workshop** | 自动提炼 + 审批 + 安全扫描 | 实验性、reviewer 有额外 LLM 成本 |

Skill Workshop 的独特价值在于：它产出的是**结构化的、可直接加载的 SKILL.md**，而不是散落在 memory 文件里的经验碎片。

## 设计哲学

Skill Workshop 的设计体现了几个值得玩味的理念：

**1. 程序性记忆 ≠ 陈述性记忆**

认知科学早就区分了"知道是什么"和"知道怎么做"。Skill Workshop 是 AI Agent 领域第一个认真对待这个区分的实现。

**2. 安全优先于便利**

默认关闭、默认审批、内容扫描、隔离机制——宁可漏掉一条有用 skill，也不写入一条有害内容。

**3. 渐进式信任**

从 `pending`（人工审批）起步，观察质量稳定后才切 `auto`。不是"要么全自动要么没用"的二选一。

**4. 与 Skill 生态无缝衔接**

产出的文件和手写 Skill 完全等价，享受同样的优先级、门控、agent allowlist、ClawHub 分发。

## 风险提示

⚠️ **实验性特性**：capture 启发式和 reviewer prompt 可能随版本变化

⚠️ **LLM 成本**：`hybrid` 模式下每 15 turns 触发一次 reviewer 调用

⚠️ **不适合多人/不可信环境**：恶意输入可能触发误导性 proposal

⚠️ **不替代 Memory**：事实类信息（"用户名是 xxx"）不该走 Skill Workshop

## 总结

Skill Workshop 解决了一个长期痛点：**Agent 的流程性知识如何持久化和复用？**

它的答案是：
- 从对话中**自动捕获**可复用流程
- 通过**安全审查**过滤危险内容
- 经**人工审批**后写入标准 Skill 文件
- 下次遇到类似任务，**直接按 SOP 执行**

这让 Agent 从"每次都像新人"进化为"有经验的老员工"——而且这份经验是可审计、可编辑、可分享的。

---

*基于 OpenClaw 官方文档 [Skill Workshop Plugin](https://docs.openclaw.ai/plugins/skill-workshop) 整理分析。当前为实验性特性，API 可能变化。*
