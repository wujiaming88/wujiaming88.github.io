---
layout: single
title: "Tool Call Stuck 一劳永逸的解决方案：分层防御架构提案"
date: 2026-04-23
categories: [ai, engineering]
tags: [OpenClaw, Tool Call, Session Stuck, Reliability, AI Agent, Engineering]
author: 五岳团队
header:
  overlay_image: /assets/images/posts/2026-04-23-toolcall-stuck-solution.png
  overlay_filter: 0.4
toc: true
toc_sticky: true
excerpt: "每个 tool_call 必须有 tool_result——这是 LLM 对话协议的铁律。一旦 result 丢失，session 就永久卡死。本文提出 Supervisor + Guard 分层防御架构，让 Tool Call Stuck 在数学上不可能发生。"
---

> **作者**：小帅（Team Commander）| **日期**：2026-04-23 | **状态**：Proposal | **优先级**：P0

---

## 问题定义

### 现象

Session 在 LLM 发出 `tool_call` 后永久卡死，无法接收新消息，用户只能手动 `/kill` 或 `/reset`。

### 协议约束

LLM 对话协议有一个**不可违反的约束**：

```
每个 tool_call 必须有且仅有一个对应的 tool_result。
缺少 tool_result 时，对话状态非法，LLM 无法继续推理。
```

一旦 tool_result 丢失，session **在协议层面就已经进入了不可恢复状态**。

### 丢失 tool_result 的 5 种根因

| # | 根因 | 触发条件 | 当前防护 |
|---|------|---------|---------|
| R1 | 工具进程崩溃/OOM kill | 大文件处理、内存不足 | ❌ 无 |
| R2 | 工具执行永不返回 | 网络挂起、死循环 | ❌ 无 |
| R3 | Gateway 执行期间重启 | 手动重启、崩溃恢复 | ❌ 无 |
| R4 | Sandbox 超时未回传 | 沙箱杀进程后 Gateway 未收到通知 | ❌ 无 |
| R5 | 格式错误致 executor 静默失败 | 非法参数、JSON 解析失败 | 部分 |

### 影响面

- **范围**：99%+ 的使用场景（几乎所有 session 都用工具）
- **体验**：session 卡死，新消息被丢弃或排队
- **数据风险**：工具可能已执行成功但 session 不知道，导致重复执行
- **连锁反应**：父 session 等子 session 的 result → 父子同时卡死

---

## 解决目标

### 核心不变量

> **每个 tool_call 在有限时间内必定收到一个 tool_result（真实的或合成的）。**

只要这个不变量成立，tool call 导致的 stuck **在数学上不可能发生**。

### 验收标准

| # | 标准 | 优先级 |
|---|------|--------|
| A1 | 任何工具失败/超时后，session 在 `timeout + 30s` 内自动恢复 | P0 |
| A2 | Gateway 重启后，所有中断的 tool call 自动恢复 | P0 |
| A3 | 合成 tool_result 包含足够信息让 LLM 自主决策 | P0 |
| A4 | 不影响正常工具执行性能（< 5ms 额外开销） | P1 |
| A5 | 支持按工具类型配置超时和重试策略 | P1 |

---

## 方案 A：Tool Execution Supervisor（主动预防型）

### 核心思路

在工具执行层包一层 Supervisor，**保证每次调用一定返回结果**：

```
Gateway → ToolSupervisor.run(call) → [保证返回]
               │
               ├── 正常完成 → 返回真实 result
               ├── 超时 → kill 进程 → 返回合成 error result
               ├── 进程崩溃 → 捕获 → 返回合成 error result
               └── 异常 → catch → 返回合成 error result
```

### 关键伪代码

```javascript
class ToolSupervisor {
  async execute(session, toolCall) {
    const timeout = this.config.getTimeout(toolCall.name) ?? 300_000;
    this.pending.set(toolCall.id, { sessionId: session.id, startedAt: Date.now() });

    try {
      return await Promise.race([
        this._executeToolCall(session, toolCall),
        this._createTimeout(toolCall, timeout)
      ]);
    } catch (error) {
      return this._synthesizeErrorResult(toolCall, error);
    } finally {
      this.pending.delete(toolCall.id);
    }
  }
}
```

### 优劣分析

| ✅ 优势 | ❌ 劣势 |
|---------|---------|
| 主动预防，不让 stuck 发生 | 改动在工具执行热路径 |
| 恢复延迟 = 配置的超时时间 | Gateway 重启后 pending 丢失 |
| 每个工具独立配置超时/重试 | 超时配置需调优 |
| 集中式 metrics 采集 | 需标注哪些工具可安全重试 |

---

## 方案 B：Conversation State Guard（协议层防御型）

### 核心思路

在对话协议层加 Guard：每次调用 LLM 前、session 加载时，**校验对话状态合法性**，发现孤立 tool_call 就自动注入合成 result：

```
对话历史 → ConversationGuard.validate() → 修复后发给 LLM
                │
                ├── 检查每个 tool_call 是否有匹配的 tool_result
                ├── 孤立的 → 注入合成 error result
                └── 返回合法的对话历史
```

### 关键伪代码

```javascript
class ConversationStateGuard {
  validate(messages) {
    const toolCallIds = new Set();
    const toolResultIds = new Set();

    for (const msg of messages) {
      if (msg.role === 'assistant' && msg.tool_calls)
        for (const tc of msg.tool_calls) toolCallIds.add(tc.id);
      if (msg.role === 'tool')
        toolResultIds.add(msg.tool_call_id);
    }

    const orphaned = [...toolCallIds].filter(id => !toolResultIds.has(id));
    if (orphaned.length === 0) return { messages, fixed: false };

    // 为每个孤立 tool_call 注入合成 result
    const fixed = [...messages];
    for (const callId of orphaned) {
      fixed.splice(this._findInsertPos(fixed, callId), 0, {
        role: 'tool', tool_call_id: callId,
        content: '⚠️ TOOL RESULT RECOVERED: No result received...',
        is_error: true, _synthetic: true
      });
    }
    return { messages: fixed, fixed: true };
  }
}
```

### 优劣分析

| ✅ 优势 | ❌ 劣势 |
|---------|---------|
| 覆盖所有场景（不管怎么丢的） | 被动恢复，需等下一个触发点 |
| 改动极小（2-3 个插入点） | stuck 期间 session 仍不可用 |
| 完全向后兼容 | 不解决工具挂起本身 |
| Gateway 重启后自动修复 | 合成 result 位置插入需精确 |

---

## 方案对比

| 维度 | 方案 A（Supervisor） | 方案 B（Guard） |
|------|---------------------|----------------|
| **防御策略** | 主动预防 | 被动修复 |
| **覆盖进程崩溃** | ✅ 直接捕获 | ✅ 下次触发时修复 |
| **覆盖永不返回** | ✅ 超时 kill | ⚠️ 需配合外部超时 |
| **覆盖 Gateway 重启** | ❌ 内存态丢失 | ✅ 启动扫描修复 |
| **恢复延迟** | 快（= 超时配置） | 慢（等触发点） |
| **代码改动量** | 中（热路径） | 小（插入点） |
| **风险** | 中（可能引入新 bug） | 低（只读 + 追加） |
| **可配置性** | 高（按工具配置） | 低（统一行为） |

---

## 推荐方案：A + B 混合（分层防御）

### 为什么需要混合？

两个方案解决的是**不同层面的问题**：

- **方案 A**：解决"工具执行中的超时和崩溃"（预防）
- **方案 B**：解决"无论什么原因导致的 result 丢失"（兜底）

单独用任何一个都有盲区。混合使用 = **两层安全网，任何一层失效，另一层兜底**。

### 混合架构

```
┌──────────────────────────────────────────────┐
│                Session Turn                   │
│                                               │
│  User Message                                 │
│       │                                       │
│       ▼                                       │
│  Layer 2: Conversation State Guard (方案 B)   │
│    校验对话状态 → 修复孤立 tool_call            │
│       │                                       │
│       ▼                                       │
│  LLM Inference → 生成 tool_call               │
│       │                                       │
│       ▼                                       │
│  Layer 1: Tool Supervisor (方案 A)            │
│    执行工具 → 超时保护 → 保证返回 result        │
│       │                                       │
│       ▼                                       │
│  Tool Result → 继续对话                        │
│                                               │
│  ═══════════════════════════════════════════  │
│  Layer 0: Gateway 启动扫描 (方案 B)           │
│    扫描所有 session → 修复中断的 tool_call      │
└──────────────────────────────────────────────┘
```

### 分阶段实施

#### Phase 1（1-2 周）：方案 B 先行 — 低风险高覆盖

1. 实现 `ConversationStateGuard.validate()`
2. 在 LLM 调用前插入校验
3. 在 Session 加载/恢复时插入校验
4. 在 Gateway 启动时全量扫描

**收益**：覆盖所有 5 种根因的事后恢复，改动最小，风险最低。

#### Phase 2（2-4 周）：方案 A 补充 — 主动预防

1. 实现 `ToolSupervisor`
2. 集成到工具执行路径
3. 按工具类型配置超时
4. 添加 metrics 采集

**收益**：将恢复时间从"等下一个触发点"缩短到"配置的超时时间"。

#### Phase 3（可选增强）

| 特性 | 说明 |
|------|------|
| 心跳机制 | 长任务定期报告 "alive"，区分"在跑"和"卡了" |
| 熔断器 | 连续失败 N 次 → 临时禁用该工具 |
| 幂等重试 | 标记为幂等的工具自动重试一次 |
| 指标看板 | 工具成功率/延迟/超时率可视化 |

---

## 边界场景处理

### 并行 tool_call

LLM 一次发出多个 tool_call，部分成功部分失败时，Guard 只为丢失的注入合成 result，保留成功的真实结果。LLM 能看到哪些成功哪些失败，自行决策。

### 工具已执行但 result 丢失

最棘手的场景。合成 result 中明确标注"执行状态未知"：

```
⚠️ Tool "write" did not return a result.
The operation MAY have completed successfully.
Please verify before retrying to avoid duplicate side effects.
```

### 合成 result 后 LLM 无限重试

Supervisor 记录重试次数，超过 `maxRetries` 返回最终错误。可选熔断器：同一工具连续失败 3 次 → 告诉 LLM "该工具暂时不可用"。

---

## 改动总影响面

| 模块 | Phase 1 | Phase 2 | 总影响 |
|------|---------|---------|--------|
| LLM 调用入口 | +1 行 validate | 无 | 🟡 小 |
| Session 加载 | +1 行 validate | 无 | 🟡 小 |
| Gateway 启动 | +扫描逻辑 | 无 | 🟡 小 |
| ToolExecutor | 无 | 包 Supervisor | 🔴 中 |
| 新增代码量 | ~200 行 | ~400 行 | **~600 行** |

---

## 总结

| 维度 | 结论 |
|------|------|
| **根本原因** | LLM 协议要求 tool_call↔tool_result 一一对应，但缺乏保证机制 |
| **解法本质** | 在协议层保证不变量：每个 tool_call 在有限时间内必得到 result |
| **推荐方案** | A + B 混合：Supervisor（主动预防）+ Guard（被动兜底） |
| **实施策略** | Phase 1 先上 Guard（低风险），Phase 2 补 Supervisor（高收益） |
| **改动量** | ~600 行核心代码，主要新增，极少修改现有逻辑 |
| **预期效果** | tool call stuck 从"不可恢复"变为"自动恢复" |

---

*本方案基于 OpenClaw 2026.4.12 版本分析。具体实现需参考 Gateway 源码确认集成点。*
