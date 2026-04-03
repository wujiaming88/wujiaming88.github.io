---
layout: single
title: "OpenClaw Lossless-Claw：用 DAG 摘要树实现真正的无损上下文管理"
date: 2026-04-03
categories: [AI, OpenClaw]
tags: [OpenClaw, LCM, Context Management, Agent, 插件]
header:
  overlay_image: /assets/images/posts/2026-04-03-lossless-claw-lcm.png
  overlay_filter: 0.4
  caption: "Lossless Context Management — DAG 摘要树架构"
excerpt: "用一句话：用 DAG 摘要树替代传统滑动窗口压缩，实现真正的「无消息丢失」的上下文管理。本文深入解析 Lossless-Claw 插件的核心架构、工作原理与实战配置。"
---

## 什么是 Lossless-Claw？

**用一句话**：用 DAG 摘要树替代传统滑动窗口压缩，实现真正的「无消息丢失」的上下文管理。

传统 OpenClaw 的 compaction 策略基于滑动窗口——当上下文接近限制时，早期消息被摘要成字符串，细节**永久丢失**。而 Lossless-Claw（LCM）插件彻底改变了这一模式：所有消息持久化到 SQLite，摘要以 DAG 树结构组织，随时可按需展开回溯。

---

## 核心创新对比

| 特性 | OpenClaw 原生 | LCM 插件 |
|------|--------------|---------|
| 消息持久化 | 摘要字符串 | SQLite + 完整消息 |
| 被摘要的细节 | ❌ 永久丢失 | ✅ 随时可展开回溯 |
| 搜索能力 | ❌ 无法查历史 | ✅ `lcm_grep`（全文/正则） |
| 回溯工具 | ❌ 无 | ✅ `lcm_describe`、`lcm_expand_query` |
| Safeguard Bug | ✗ 会产生假摘要 | ✓ 自身不受影响 |
| 错误恢复 | Compaction 失败会卡死 | 三层降级，总能推进 |

---

## 核心架构

### 数据模型

LCM 使用 SQLite 数据库（`~/.openclaw/lcm.db`）存储所有数据：

```
SQLite 数据库
├── conversations      — 每个 sessionKey 对应一条 conversation
├── messages           — seq、role、content、tokenCount
├── summaries（DAG）   — 深度 0 leaf → 深度 1+ condensed
└── context_items      — 当前上下文有序列表
```

### 信息流

```
用户消息
    ↓
[ingest] → SQLite 持久化 + context_items 追加
    ↓
模型处理 → 回复
    ↓
[afterTurn] → 检查 token，触发增量 compaction
    ↓
Leaf Pass（消息 → 摘要）
    ↓
Condensed Pass（摘要 → 高层摘要）
    ↓
DAG 更新，context_items 替换
```

### 核心参数

| 配置项 | 默认值 | 含义 |
|--------|--------|------|
| `freshTailCount` | 64 | 最后 64 条消息保持完整，不压缩 |
| `leafChunkTokens` | 20000 | 单个 leaf chunk 的 token 上限 |
| `contextThreshold` | 0.75 | 触发 compaction 的上下文使用率（75%） |
| `incrementalMaxDepth` | 1 | 每次 turn 后的压缩深度 |

---

## Compaction 三种模式

### 1. 增量 Compaction（每 turn 后自动）

每次对话轮次后自动检查，轻量触发，不阻塞对话。

### 2. 完整扫描（手动 `/compact` 或溢出恢复）

重复 leaf + condensed pass，直到最大化压缩率。

### 3. 三层摘要降级（保证 compaction 总能成功）

```
尝试 1: 标准摘要（温度 0.2）
  ↓ 失败
尝试 2: 激进摘要（温度 0.1，仅关键事实）
  ↓ 失败
尝试 3: 确定性截断（~512 token，标记 [Truncated]）
```

无论何种情况，**compaction 总能推进，不会卡死**。

---

## 四个 Agent 工具

LCM 为 Agent 提供四个专用工具：

### 1. `lcm_grep` — 搜索

```javascript
lcm_grep({
  pattern: "database",
  mode: "full_text",        // "regex" 或 "full_text"
  scope: "both",            // "messages" / "summaries" / "both"
  allConversations: false,  // 跨所有 session
  limit: 50
})
```

### 2. `lcm_describe` — 快速查询单个摘要

```javascript
lcm_describe({
  id: "sum_abc123"  // 摘要 ID 或 file_xxx
})
// 返回：完整内容、元数据、父/子 ID、源消息 ID
```

### 3. `lcm_expand_query` — 深度回溯

```javascript
lcm_expand_query({
  prompt: "OAuth bug 的根本原因是什么？",
  query: "OAuth authentication error",
  maxTokens: 2000
})
```

工作流：`lcm_grep` 找摘要 → 创建委托授权 → 子 agent 走 DAG → 返回焦点化答案。

### 4. `lcm_expand` — 子 agent 内部工具

仅在委托授权下供子 agent 使用，防止递归调用。

---

## 大文件处理

当消息中包含超过 25k token 的文件时，LCM 自动：

1. 生成文件 ID（`file_xxx`）
2. 存储到 `~/.openclaw/lcm-files/`
3. 生成 ~200 token 的探索摘要（结构分析、关键段落）
4. 在消息中用 `<file>` 引用替换原文件

`lcm_describe` 可随时恢复完整文件内容。

---

## 安装与配置

### 安装

```bash
openclaw plugins install @martian-engineering/lossless-claw
```

### 推荐配置

```json
{
  "plugins": {
    "slots": {
      "contextEngine": "lossless-claw"
    },
    "entries": {
      "lossless-claw": {
        "enabled": true,
        "config": {
          "freshTailCount": 64,
          "leafChunkTokens": 20000,
          "contextThreshold": 0.75,
          "incrementalMaxDepth": 1,
          "summaryModel": "anthropic/claude-haiku-4-5"
        }
      }
    }
  }
}
```

### 成本优化

```json
{
  "summaryModel": "anthropic/claude-haiku-4-5",  // 便宜摘要模型
  "leafChunkTokens": 30000,                       // 减少摘要频率
  "incrementalMaxDepth": 0                        // 仅 leaf，跳过 condensed
}
```

---

## 实际价值

你之前可能遇到的问题链：

> **contextWindow 偏高 → safeguard 假摘要 → 上下文丢失 → 会话重启**

LCM 能从根本上解决这个问题：

- ✅ 完整历史持久化，不再有永久丢失
- ✅ 智能 DAG 摘要，保留展开能力
- ✅ 按需回溯任何历史细节
- ✅ compaction 三层降级，不会卡死

---

## 已知限制

| 限制 | 缓解方案 |
|------|---------|
| SQLite 单机存储 | 定期备份 `~/.openclaw/lcm.db` |
| `lcm_expand_query` 最多 120s | 分解为多个小查询 |
| 部分 cron/subagent session 不记录 LCM | 配置 `ignoreSessionPatterns` 排除 |

---

## 参考资料

1. [GitHub: Martian-Engineering/lossless-claw](https://github.com/Martian-Engineering/lossless-claw)
2. [LCM Architecture 文档](https://github.com/Martian-Engineering/lossless-claw/blob/main/docs/architecture.md)
3. [Agent Tools 文档](https://github.com/Martian-Engineering/lossless-claw/blob/main/docs/agent-tools.md)
4. [win4r/lossless-claw-enhanced](https://github.com/win4r/lossless-claw-enhanced)（CJK 优化版）

---

*研究来源：wairesearch 团队 — 2026-04-03*
