---
layout: single
title: "2026 主流 AI 模型 API 接口格式全面调研：从 OpenAI 到 Anthropic、Gemini、Llama、Mistral"
date: 2026-03-16 09:50:00 +0000
categories: [AI]
tags: [AI, API, OpenAI, Anthropic, Google Gemini, Meta Llama, Mistral, Amazon Bedrock, Azure, OpenRouter, Chat Completions, Responses API, MCP, Agent]
author: W.ai
header:
  overlay_image: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=400&fit=crop
---

> 研究员：黄山 (wairesearch) · 日期：2026-03-16

## 执行摘要

本报告全面调研了当前主流 AI 模型提供商的 API 接口格式，覆盖 Anthropic、OpenAI、Google、Meta Llama、Mistral 以及主要代理/网关层（Amazon Bedrock、Azure OpenAI、OpenRouter）。核心发现：**行业正在从简单的补全接口向有状态、多模态、Agent 原生的 API 范式演进**。OpenAI 的 Responses API 代表了最新趋势——内置工具调用、服务端状态管理、MCP 集成。同时，OpenAI Chat Completions 格式已成为事实上的行业标准，几乎所有第三方平台和网关都兼容此格式。

---

## 1. Anthropic — Messages API

### 基本信息

| 项目 | 说明 |
|------|------|
| **端点** | `POST /v1/messages` |
| **基础 URL** | `https://api.anthropic.com` |
| **认证方式** | `x-api-key` 请求头 |
| **API 版本** | 通过 `anthropic-version` 请求头指定（当前 `2023-06-01`） |
| **SDK** | Python (`anthropic`)、TypeScript (`@anthropic-ai/sdk`) |

### 请求结构

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1024,
  "system": "You are a helpful assistant.",
  "messages": [
    {
      "role": "user",
      "content": "Hello, Claude"
    }
  ],
  "temperature": 0.7,
  "tools": [],
  "stream": false
}
```

**关键特点：**
- `system` 是顶层参数（不是 messages 中的角色）
- `content` 可以是字符串或内容块数组（支持 `text`、`image`、`document`、`tool_use`、`tool_result` 等类型）
- 消息必须是 `user` 和 `assistant` 交替出现
- 支持 `cache_control` 实现提示缓存（Prompt Caching），TTL 可选 5 分钟或 1 小时

### 响应结构

```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I help you today?"
    }
  ],
  "model": "claude-sonnet-4-20250514",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 25,
    "output_tokens": 15,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0
  }
}
```

### 支持功能

| 功能 | 支持 | 说明 |
|------|------|------|
| 流式输出 | ✅ | `stream: true`，SSE |
| 工具调用 | ✅ | `tools` 参数，返回 `tool_use` 内容块 |
| 多模态 | ✅ | 图片、PDF、音频 |
| 系统提示词 | ✅ | 顶层 `system` 参数 |
| 结构化输出 | ✅ | Beta |
| 提示缓存 | ✅ | `cache_control` 降低重复上下文成本 |
| 思维链 | ✅ | Extended Thinking（Claude 3.7+） |

### 主要模型与定价

| 模型 | 输入 ($/1M tokens) | 输出 ($/1M tokens) | 上下文 |
|------|-------------------|-------------------|--------|
| Claude Opus 4.6 | $5.00 | $25.00 | 200K |
| Claude Sonnet 4.6 | $3.00 | $15.00 | 200K |
| Claude Haiku 4.5 | $1.00 | $5.00 | 200K |

### 优缺点

**优点：** 语义清晰的 `system` 设计、提示缓存大幅降本、Extended Thinking 透明推理、内容块数组灵活

**缺点：** 与 OpenAI 格式不兼容、无服务端状态管理、无内置搜索/代码执行、模型选择相对较少

---

## 2. OpenAI — 三代 API 演进

### 2.1 Completions API（已废弃）

纯文本补全，没有角色概念，不支持多轮对话。2024 年 1 月起不再支持新模型。

```json
{
  "model": "gpt-3.5-turbo-instruct",
  "prompt": "Say this is a test",
  "max_tokens": 7
}
```

### 2.2 Chat Completions API（当前行业标准）

```json
{
  "model": "gpt-5",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ],
  "temperature": 0.7,
  "max_tokens": 1024,
  "tools": [...],
  "response_format": {"type": "json_object"}
}
```

**关键特点：**
- `system` 作为 messages 数组中的一个角色
- 响应包含 `choices` 数组
- **事实上的行业标准格式** — 几乎所有第三方服务都兼容

### 2.3 Responses API（最新推荐）

2025 年 3 月发布，代表 Agent 原生的新范式：

```json
{
  "model": "gpt-5",
  "input": "Write a bedtime story about a unicorn.",
  "instructions": "You are a creative storyteller.",
  "tools": [
    {"type": "web_search"},
    {"type": "code_interpreter"},
    {"type": "function", "name": "get_weather", ...}
  ],
  "store": true
}
```

### Chat Completions vs Responses API 关键区别

| 特性 | Chat Completions | Responses API |
|------|-----------------|---------------|
| 输入格式 | `messages` 数组 | `input`（字符串或数组） |
| 系统提示 | `role: "system"` | `instructions` 参数 |
| 状态管理 | 客户端管理 | 服务端管理 |
| 多轮对话 | 发送完整历史 | `previous_response_id` |
| 内置工具 | 无 | web_search、code_interpreter、computer_use |
| MCP 支持 | 无 | 支持远程 MCP 服务器 |

### 主要模型与定价

| 模型 | 输入 ($/1M tokens) | 输出 ($/1M tokens) | 上下文 |
|------|-------------------|-------------------|--------|
| GPT-5.2 | $1.75 | $14.00 | 128K |
| GPT-4o | $2.50 | $10.00 | 128K |
| GPT-4o-mini | $0.15 | $0.60 | 128K |
| o3 | $2.00 | $8.00 | 200K |
| o4-mini | $1.10 | $4.40 | 200K |

---

## 3. Google — Gemini API

### 请求结构

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [{"text": "Explain how AI works"}]
    }
  ],
  "systemInstruction": {
    "parts": [{"text": "You are a helpful assistant."}]
  },
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 1024
  }
}
```

**关键特点：**
- 使用 `contents`/`parts` 结构（非 `messages`/`content`）
- 助手角色称为 `model`（非 `assistant`）
- 系统提示通过 `systemInstruction` 设置
- 内置 Google Search Grounding 和代码执行
- 超大上下文窗口（1M+ tokens）

### 主要模型与定价

| 模型 | 输入 ($/1M tokens) | 输出 ($/1M tokens) | 上下文 |
|------|-------------------|-------------------|--------|
| Gemini 3.1 Pro | $2.00 | $12.00 | 1M+ |
| Gemini 2.5 Pro | $1.25 | $5.00 | 1M |
| Gemini 2.5 Flash | $0.15 | $0.60 | 1M |

**优点：** 1M+ 超长上下文、慷慨免费配额、原生多模态（文本/图片/视频/音频/PDF）

**缺点：** API 格式独特、安全过滤较激进、两套平台增加复杂度

---

## 4. Meta — Llama 开源生态

Meta 的 Llama 是**开源/开放权重**模型，不直接提供公有云 API，通过第三方平台使用：

| 平台 | API 格式 | 特点 |
|------|---------|------|
| Together AI | OpenAI 兼容 | 第三方推理 |
| Fireworks AI | OpenAI 兼容 | 高性能推理 |
| Groq | OpenAI 兼容 | 超低延迟 |
| Amazon Bedrock | Converse API | AWS 托管 |
| 本地部署 | vLLM/Ollama | OpenAI 兼容端点 |

### 定价（第三方平台）

| 平台 | 模型 | 输入 ($/1M) | 输出 ($/1M) |
|------|------|------------|------------|
| Together AI | Llama 4 Maverick | $0.27 | $0.85 |
| Groq | Llama 3.3 70B | $0.05 | $0.10 |

**优点：** 开源可控、生态丰富、价格极低、无供应商锁定

**缺点：** 依赖第三方、各平台体验不一致、本地部署需 GPU

---

## 5. Mistral — La Plateforme API

**与 OpenAI Chat Completions 格式高度兼容**，几乎可以直接替换。

```json
{
  "model": "mistral-large-latest",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Who is the best French painter?"}
  ]
}
```

### 主要模型与定价

| 模型 | 输入 ($/1M tokens) | 输出 ($/1M tokens) | 上下文 |
|------|-------------------|-------------------|--------|
| Mistral Large | $2.00 | $6.00 | 128K |
| Mistral Medium 3 | $0.40 | $2.00 | 128K |
| Mistral Small | $0.10 | $0.30 | 128K |
| Codestral | $0.30 | $0.90 | 256K |

**优点：** 与 OpenAI 兼容、欧洲合规（GDPR）、性价比高

---

## 6. 代理/网关层

### Amazon Bedrock — Converse API

统一接口访问多厂商模型（Claude、Llama、Mistral、Titan 等），AWS 原生集成。

### Azure OpenAI

与 OpenAI API **完全兼容**，URL 结构和认证方式不同，企业级 SLA。

### OpenRouter

一个 API Key 访问 **290+ 模型**，完全兼容 OpenAI 格式，模型名使用 `provider/model` 格式。

---

## 7. 综合对比

### API 格式对比

| 维度 | Anthropic | OpenAI (Chat) | OpenAI (Resp.) | Gemini | Mistral |
|------|-----------|--------------|----------------|--------|---------|
| 消息字段 | `messages` | `messages` | `input` | `contents` | `messages` |
| 系统提示 | 顶层 `system` | `role:"system"` | `instructions` | `systemInstruction` | `role:"system"` |
| 助手角色 | `assistant` | `assistant` | `assistant` | `model` | `assistant` |
| OpenAI 兼容 | ❌ | ✅（标准） | ❌（新格式） | ❌ | ✅ |

### 功能对比

| 功能 | Anthropic | OpenAI (Chat) | OpenAI (Resp.) | Gemini | Mistral |
|------|-----------|--------------|----------------|--------|---------|
| 工具调用 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 多模态 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 内置搜索 | ✅ | ❌ | ✅ | ✅ | ❌ |
| 代码执行 | ❌ | ❌ | ✅ | ✅ | ❌ |
| 状态管理 | ❌ | ❌ | ✅ | ❌ | ❌ |
| MCP 支持 | ✅ | ❌ | ✅ | ❌ | ❌ |
| 提示缓存 | ✅ | ✅ | ✅ | ✅ | ❌ |

### 价格对比（旗舰 / 中端 / 轻量）

| 层级 | Anthropic | OpenAI | Google | Mistral |
|------|-----------|--------|--------|---------|
| 旗舰 | Opus 4.6: $5/$25 | GPT-5.2: $1.75/$14 | Gemini 3.1 Pro: $2/$12 | Large: $2/$6 |
| 中端 | Sonnet 4.6: $3/$15 | GPT-4o: $2.5/$10 | Gemini 2.5 Pro: $1.25/$5 | Medium 3: $0.40/$2 |
| 轻量 | Haiku 4.5: $1/$5 | 4o-mini: $0.15/$0.60 | 2.5 Flash: $0.15/$0.60 | Small: $0.10/$0.30 |

---

## 8. 趋势分析

### OpenAI Chat Completions 成为事实标准

Mistral、Together AI、Fireworks、Groq、OpenRouter、vLLM、Ollama 等都兼容此格式。以此格式编写的代码可以最低成本切换提供商。

### 从无状态到有状态

OpenAI Responses API 代表新范式——服务端状态管理，不需要每次发送完整历史，降低 token 成本。

### Agent 原生 API

各家都在向 Agent 工作流优化：
- **OpenAI**：Responses API 内置 web_search、code_interpreter、MCP
- **Anthropic**：提出 MCP 标准，扩展工具生态
- **Google**：Grounding + Code Execution 内置

API 不再只是"生成文本"，而是"执行任务"。

### 价格持续下降

过去 2 年同等性能价格下降 **10-50 倍**。Gemini Flash / GPT-4o-mini 将"智能"推入每百万 token **$0.15** 区间。

### 推理模型兴起

OpenAI o 系列、Anthropic Extended Thinking、Google Thinking、Mistral Medium 3 — 从"快速回答"到"深度思考"的范式转变。

---

## 9. 技术决策建议

```
需要最大兼容性？ → OpenAI Chat Completions 格式
需要 Agent 能力？ → OpenAI Responses API
需要最长上下文？ → Google Gemini（1M+）
需要本地部署？   → Meta Llama（开源）
需要欧洲合规？   → Mistral
需要最低成本？   → Gemini Flash / GPT-4o-mini / Mistral Small
需要 AWS 集成？  → Amazon Bedrock Converse API
```

**推荐架构：**
1. **抽象层**：用 LiteLLM 或自建适配层统一格式
2. **内部标准**：OpenAI Chat Completions 兼容格式
3. **多提供商策略**：通过抽象层支持备选
4. **Agent 工作流**：评估 Responses API
5. **成本优化**：提示缓存 + 批量处理 + 低成本模型路由

---

## 参考来源

1. [Anthropic API Reference](https://docs.anthropic.com/en/api/messages)
2. [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
3. [OpenAI Responses API Migration Guide](https://developers.openai.com/api/docs/guides/migrate-to-responses)
4. [Google Gemini API Reference](https://ai.google.dev/api)
5. [Mistral API Documentation](https://docs.mistral.ai/api)
6. [Amazon Bedrock Converse API](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference-call.html)
7. [Azure OpenAI Service](https://learn.microsoft.com/azure/ai-services/openai/)
8. [OpenRouter Documentation](https://openrouter.ai/docs)
9. [Meta Llama](https://www.llama.com/docs/)

> **免责声明**: 本报告基于 2026 年 3 月的公开信息编写。AI 领域变化极快，建议在做最终技术决策前查阅各提供商最新官方文档。
