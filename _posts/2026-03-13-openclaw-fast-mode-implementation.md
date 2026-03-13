---
layout: single
title: "深度研究：OpenClaw v2026.3.12 Fast Mode 实现原理"
date: 2026-03-13 17:07:00 +0000
categories: [AI]
tags: [AI, Agent, OpenClaw, Fast Mode, 源码分析, 架构]
author: W.ai
header:
  overlay_image: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop
---

# OpenClaw v2026.3.12 Fast Mode 实现深度研究报告

> 🔬 研究员：黄山 (wairesearch)  
> 📅 日期：2026-03-13  
> 📎 版本：OpenClaw 2026.3.12 (6472949)  
> 📎 来源：[v2026.3.12 Release](https://github.com/openclaw/openclaw/releases/tag/v2026.3.12)

---

## 执行摘要

Fast Mode 是 OpenClaw v2026.3.12 引入的**会话级低延迟模式**。通过统一的 `/fast` 指令，针对不同 Provider 自动注入低延迟优化参数。当前原生支持 OpenAI（GPT-5.4 系列）和 Anthropic（Claude 系列）两个 Provider。

核心设计采用 **Wrapper 洋葱模型**——在模型流式调用链上动态包裹 payload 修改层，不侵入核心传输逻辑，实现了良好的解耦与可扩展性。Fast Mode 的状态通过 Gateway 的 `sessions.patch` API 持久化，并在 Chat 命令、TUI、Control UI、ACP 四个入口统一暴露。

---

## 一、架构原理

### 1.1 整体流程

```
用户请求（/fast on | @fast on | Config | UI toggle）
  │
  ▼
resolveFastModeState()           ← 三层优先级：session > config > default
  │
  ▼
Agent streamFn 组装管线
  │
  ├── createAnthropicFastModeWrapper()  ← Anthropic: 注入 service_tier
  └── createOpenAIFastModeWrapper()     ← OpenAI: 注入 reasoning + text + service_tier
  │
  ▼
onPayload callback               ← 拦截并修改 API payload（发送前最后一步）
  │
  ▼
Provider API（api.openai.com / api.anthropic.com）
```

### 1.2 核心源码位置

| 编译产物 | 源码推断路径 | 内容 |
|----------|-------------|------|
| `dist/config-CmS8VEM4.js:94837` | `src/agents/fast-mode.ts` | 状态解析核心 |
| `dist/config-CmS8VEM4.js:94995` | `anthropic-stream-wrappers.ts` | Anthropic Fast Mode Wrapper |
| `dist/config-CmS8VEM4.js:95230` | `openai-stream-wrappers.ts` | OpenAI Fast Mode Wrapper |
| `dist/config-CmS8VEM4.js:95600` | Agent streamFn 组装管线 | Wrapper 注册与组装顺序 |

---

## 二、状态解析机制

### 2.1 三层优先级

Fast Mode 状态通过 `resolveFastModeState()` 函数解析，遵循严格的三层优先级：

```typescript
type FastModeState = {
    enabled: boolean;
    source: "session" | "config" | "default";
};

function resolveFastModeState(params): FastModeState {
    // 1️⃣ 最高优先级: Session 级覆盖（用户通过 /fast on 设置）
    const sessionOverride = normalizeFastMode(params.sessionEntry?.fastMode);
    if (sessionOverride !== undefined)
        return { enabled: sessionOverride, source: "session" };

    // 2️⃣ 中优先级: Config 级配置
    const configured = normalizeFastMode(resolveConfiguredFastModeRaw(params));
    if (configured !== undefined)
        return { enabled: configured, source: "config" };

    // 3️⃣ 默认: 关闭
    return { enabled: false, source: "default" };
}
```

### 2.2 值归一化

`normalizeFastMode()` 接受多种输入格式并统一转换为 `boolean | undefined`：

```typescript
function normalizeFastMode(raw) {
    if (typeof raw === "boolean") return raw;
    if (!raw) return undefined;
    const key = raw.toLowerCase();
    // false 组
    if (["off","false","no","0","disable","disabled","normal"].includes(key))
        return false;
    // true 组
    if (["on","true","yes","1","enable","enabled","fast"].includes(key))
        return true;
    return undefined;
}
```

### 2.3 Config 默认值读取

```typescript
function resolveConfiguredFastModeRaw(params) {
    const modelKey = `${params.provider}/${params.model}`;
    const modelConfig = params.cfg?.agents?.defaults?.models?.[modelKey];
    return modelConfig?.params?.fastMode ?? modelConfig?.params?.fast_mode;
}
```

支持 `camelCase` 和 `snake_case` 两种写法。

---

## 三、触发入口（6 个统一入口）

### 3.1 入口一：`/fast` 命令（Chat Surface）

```
/fast          → 显示当前状态（含来源标注）
/fast status   → 显示当前状态
/fast on       → 启用并持久化
/fast off      → 禁用并持久化
```

状态查询时会标注来源（session / config / default），方便用户理解当前生效的配置来自哪里。

### 3.2 入口二：内联指令（消息体中的 `@fast`）

用户在消息体中内嵌 `/fast on` 或 `/fast off`，无需单独发送命令。

**指令系统共享架构：** Fast Mode 的内联指令提取与 Thinking、Verbose、Elevated、Reasoning 等指令共享同一套 `extractLevelDirective` 机制：

| 指令 | 注册名 | 归一化函数 |
|------|--------|-----------|
| `/fast on` | `["fast"]` | `normalizeFastMode` |
| `/think high` | `["thinking", "think", "t"]` | `normalizeThinkLevel` |
| `/verbose on` | `["verbose", "v"]` | `normalizeVerboseLevel` |
| `/reasoning on` | `["reasoning", "reason"]` | `normalizeReasoningLevel` |

**消息流中的处理顺序：**

```
原始消息
  → extractThinkDirective()     // 提取 /think 指令
  → extractVerboseDirective()   // 提取 /verbose 指令
  → extractFastDirective()      // 提取 /fast 指令 ← 这里
  → extractElevatedDirective()  // 提取 /elevated 指令
  → extractReasoningDirective() // 提取 /reasoning 指令
  → cleaned 消息文本传递给模型
```

内联指令从消息中移除后，cleaned 文本才传递给模型。

### 3.3 入口三：Config 默认值

```json5
{
  agents: {
    defaults: {
      models: {
        "openai/gpt-5.4": { params: { fastMode: true } },
        "anthropic/claude-sonnet-4-5": { params: { fastMode: true } }
      }
    }
  }
}
```

### 3.4 入口四：TUI（Terminal UI）

TUI 通过 `client.patchSession()` 调用 Gateway 的 `sessions.patch` API 持久化 fast mode 状态。

### 3.5 入口五：ACP（Agent Communication Protocol）

ACP Bridge 将 fast mode 暴露为可配置的 session-level 选项，ACP 客户端（如 Codex、Claude Code）可以通过 ACP 协议修改 session 的 fast mode 状态。

### 3.6 入口六：Control UI（Web Dashboard）

Control UI 支持三种状态：
- `on` → `fastMode: true`
- `off` → `fastMode: false`
- 空（清除覆盖） → `fastMode: null`（回退到 config/default）

**所有入口统一路径：** `sessions.patch` API → `sessionEntry.fastMode` → 持久化到 session store

---

## 四、OpenAI Fast Mode 实现

### 4.1 Wrapper 创建

```typescript
function createOpenAIFastModeWrapper(baseStreamFn) {
    const underlying = baseStreamFn ?? streamSimple;
    return (model, context, options) => {
        // Guard: 仅限 OpenAI Responses API 和 Codex Responses API
        if (model.api !== "openai-responses" &&
            model.api !== "openai-codex-responses" ||
            model.provider !== "openai" &&
            model.provider !== "openai-codex")
            return underlying(model, context, options);  // 直接透传

        const originalOnPayload = options?.onPayload;
        return underlying(model, context, {
            ...options,
            onPayload: (payload) => {
                if (payload && typeof payload === "object")
                    applyOpenAIFastModePayloadOverrides({
                        payloadObj: payload, model
                    });
                return originalOnPayload?.(payload, model);
            }
        });
    };
}
```

### 4.2 注入参数总结

| 参数 | 值 | 注入条件 | OpenAI API 含义 |
|------|-----|---------|----------------|
| `reasoning.effort` | `"low"` | payload 未指定 reasoning | 减少推理步骤，加快响应 |
| `text.verbosity` | `"low"` | payload 未指定 text/verbosity | 减少输出冗余度 |
| `service_tier` | `"priority"` | 直连 api.openai.com | Priority Tier 优先调度 |

### 4.3 Guard 条件详解

| 条件 | 说明 |
|------|------|
| API 类型 | 仅 Responses API，不对 Chat Completions API 生效 |
| Provider | 仅 `openai` / `openai-codex`，不影响 OpenRouter 等代理 |
| Base URL | `service_tier` 仅限直连 api.openai.com |
| 不覆盖原则 | 所有参数都有 `=== undefined` 守卫 |

---

## 五、Anthropic Fast Mode 实现

### 5.1 Service Tier 映射

| Fast Mode 状态 | `service_tier` 值 | Anthropic API 含义 |
|----------------|-------------------|-------------------|
| on | `"auto"` | 允许使用 Priority Tier |
| off | `"standard_only"` | 强制仅使用标准层 |

### 5.2 Guard 条件

| 条件 | 说明 |
|------|------|
| API 类型 | 仅限 Anthropic Messages API |
| Provider | 仅 `anthropic`，不影响 Bedrock |
| Base URL | 仅限直连 api.anthropic.com |
| 认证类型 | OAuth 认证（`sk-ant-oat-*`）被排除 |

### 5.3 OpenAI vs Anthropic 对比

| 维度 | OpenAI Fast Mode | Anthropic Fast Mode |
|------|-----------------|-------------------|
| 注入参数数 | 3 个 | 1 个 |
| reasoning | `effort: "low"` | 无 |
| text verbosity | `verbosity: "low"` | 无 |
| service_tier | `"priority"` | `"auto"` / `"standard_only"` |
| OAuth 支持 | N/A | ❌ 排除 |
| API 限制 | Responses API only | Messages API only |
| 代理支持 | ❌ 仅直连 | ❌ 仅直连 |

---

## 六、Wrapper 组装管线（完整顺序）

```
基础 streamFn (streamSimple)
  │
  ├── 1. Moonshot Thinking Wrapper
  ├── 2. Anthropic Tool Payload Wrapper
  ├── 3. OpenRouter Wrapper
  ├── 4. OpenRouter System Cache Wrapper
  ├── 5. Kilocode Wrapper
  ├── 6. Bedrock NoCache Wrapper
  ├── 7. Z.AI Tool Stream Wrapper
  ├── 8. Google Thinking Wrapper
  │
  ├── 9.  🔥 Anthropic Fast Mode Wrapper
  ├── 10. 🔥 OpenAI Fast Mode Wrapper
  │
  ├── 11. OpenAI Service Tier Wrapper
  ├── 12. OpenAI Responses Context Mgmt
  └── 13. Parallel Tool Calls Wrapper
```

Fast Mode Wrapper（#9, #10）先于 Service Tier Wrapper（#11），都有 `=== undefined` 守卫，不会冲突。

---

## 七、Session 持久化机制

### 7.1 数据流

```
用户操作 → /fast on
  → sessionEntry.fastMode = true
  → persistSessionEntry() / sessions.patch API
  → Session Store（磁盘持久化）
  → 下次请求 resolveFastModeState() 读取
```

### 7.2 Session Schema

```typescript
{
    fastMode: Type.Optional(Type.Union([Type.Boolean(), Type.Null()]))
    // true → 开启
    // false → 关闭
    // null / undefined → 未设置（使用 config/default）
}
```

---

## 八、消息处理中的完整生命周期

```
用户消息: "帮我写个函数 /fast on"
  │
  ▼ [1] 指令提取
  extractFastDirective() → fastMode=true, cleaned="帮我写个函数"
  │
  ▼ [2] 状态合并
  effectiveFastMode = session > config > default
  │
  ▼ [3] Session 持久化
  sessionEntry.fastMode = true
  │
  ▼ [4] 确认消息
  "Fast mode enabled."
  │
  ▼ [5] 模型调用
  Fast Mode Wrapper 根据 session 状态注入参数
  cleaned 消息 "帮我写个函数" 发送给模型
```

---

## 九、其他模型适配指南

### 9.1 场景分类

| 场景 | 需要做什么 | 复杂度 |
|------|-----------|--------|
| 兼容 OpenAI Responses API | 配置 `params.fastMode` | ⭐ |
| 兼容 Anthropic Messages API | 配置 `params.fastMode` | ⭐ |
| 新 Provider 有自己的快速 API | 新增 Provider Wrapper | ⭐⭐⭐ |
| 本地模型（Ollama、vLLM） | 参数调优模拟 | ⭐⭐ |

### 9.2 各 Provider 适配参数参考

| Provider | 建议注入的参数 | 备注 |
|----------|---------------|------|
| **Google Gemini** | `thinkingConfig.thinkingBudget` 降低 | 无 service_tier 概念 |
| **DeepSeek** | 降低 `reasoning_effort` | R1 支持 thinking 控制 |
| **AWS Bedrock** | `inferenceConfig` 调优 | 当前已排除 Bedrock |
| **OpenRouter** | 透传底层 Provider 参数 | 取决于 OpenRouter 暴露 |
| **Ollama / vLLM** | 降低 `num_predict` / 调整 `temperature` | 纯本地，无 tier |

**核心结论：新增 Provider 支持只需实现 Wrapper + 注册，所有状态管理和 UI 入口自动继承。**

---

## 十、设计评价

### 10.1 优势

| 方面 | 评价 |
|------|------|
| **Wrapper 洋葱模型** | ✅ 解耦、可组合、不侵入核心逻辑 |
| **三层状态优先级** | ✅ session > config > default，语义明确 |
| **Guard 条件** | ✅ 只在直连公共 API 时注入 |
| **Provider 隔离** | ✅ 各 Provider 独立 wrapper，互不干扰 |
| **不覆盖原则** | ✅ 所有注入有 `=== undefined` 守卫 |
| **统一入口** | ✅ 6 个入口汇入同一状态逻辑 |
| **指令共享架构** | ✅ 与 think/verbose/elevated 共享 extractLevelDirective |

### 10.2 改进建议

| 方面 | 建议 |
|------|------|
| **可扩展性** | 抽象 `ProviderFastModeAdapter` 接口，让 Provider Plugin 自行声明 |
| **参数级别** | 引入 fast/faster/fastest 级别 |
| **反馈** | 在响应中展示实际 service_tier |
| **Bedrock** | 考虑添加独立支持 |

---

## 参考来源

1. [OpenClaw v2026.3.12 Release Notes](https://github.com/openclaw/openclaw/releases/tag/v2026.3.12)
2. 本地源码分析 — `dist/config-CmS8VEM4.js`
3. TUI 实现 — `dist/tui-jMugLuCa.js`
4. ACP Bridge — `dist/acp-cli-Bi0YMmBx.js`
5. Control UI — `dist/control-ui/assets/sessions-ecOOkBHE.js`
6. 类型定义 — `dist/plugin-sdk/agents/fast-mode.d.ts`

---

*报告完成于 2026-03-13 · 研究员：黄山 (wairesearch)*
