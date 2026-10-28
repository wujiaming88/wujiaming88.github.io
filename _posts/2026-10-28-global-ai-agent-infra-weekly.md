---
layout: single
title: "全球 AI Agent 基础设施研究周报（第 19 期）：更新不断线，MCP 2.x 与会话闸门同窗落地"
date: 2026-10-28 13:30:00 +0800
categories:
  - AI
tags:
  - AI Agent
  - Agent Infrastructure
  - Agent Harness
  - MCP
  - Agent Memory
bucket: agent-infra
header:
  overlay_image: /assets/images/posts/2026-10-28-global-ai-agent-infra-weekly-header.png
  overlay_filter: 0.35
  caption: "控制层在修恢复，工具层在加闸门"
excerpt: "OpenClaw 连发稳定线，MS Agent Framework / ADK / LangGraph 同期升级契约，Arcade 与 Composio 把工具入口做成可装即可拦。"
toc: true
toc_sticky: true
---

2026-10-28 发布｜覆盖 2026-10-22 ~ 2026-10-28｜第 19 期

本周基础设施很少再谈「能不能编排」。OpenClaw 连发三版稳定线，把更新后 Gateway 是否还能起来、会话被 kill 后能不能继续收消息写成发布主题；Microsoft Agent Framework、Google ADK、LangGraph / langchain-core 则在同一窗口里改 MCP 生命周期、遥测默认和工具参数流式契约。工具侧 Arcade 用插件省掉自建 MCP gateway，Composio 用 Session hooks 在执行前后把调用拦住。把这些放在一起，竞争点已经是：长任务能否不断线恢复、协议升级能否迁完、工具调用能否被治理。

事实以官方 release、文档与 changelog 为准；厂商自测数字保留其口径；AWS AgentCore 十月笔记多数无逐日日期，只作月级限述。

## 本期结论速览

1. **Agent OS 在比「更新不断线」。** OpenClaw [2026.10.6](https://github.com/openclaw/openclaw/releases/tag/v2026.10.6)（10-22）、[2026.10.7](https://github.com/openclaw/openclaw/releases/tag/v2026.10.7)（10-24）、[2026.10.8](https://github.com/openclaw/openclaw/releases/tag/v2026.10.8)（10-27）把 Doctor 失败后重启 Gateway、会话 fence 释放、exec/browser 安全默认和 MCP close 超时隔离写进稳定线；另有 [2026.10.10-beta.4](https://github.com/openclaw/openclaw/releases/tag/v2026.10.10-beta.4)。老板侧定时任务正在迁出 OpenClaw，覆盖对象仍保留，不静默删除。
2. **Harness 契约进入破坏性升级周。** [Microsoft Agent Framework python-1.23.0](https://github.com/microsoft/agent-framework/releases/tag/python-1.23.0)（10-22）迁 MCP SDK 2.x，并强制 AG-UI 声明 authorization ownership；[Google ADK 2.13.0](https://github.com/google/adk-python/releases/tag/v2.13.0) 默认 OTel GenAI v2，并给出实验级 MongoDB Session/Memory；[langchain-core 1.7.0](https://docs.langchain.com/oss/python/releases/changelog)（10-22）把工具参数流改成 `tool-call-delta`，[LangGraph 1.2.18](https://github.com/langchain-ai/langgraph/releases/tag/1.2.18)（10-26）把 DeltaChannel 全量快照默认频率从 1000 降到 100。
3. **工具入口「可装」与「可拦」同日出现。** [Arcade Plugin](https://www.arcade.dev/blog/arcade-plugin/)（10-22）让 Claude/Cursor/VS Code/Codex 等装插件即连共享 gateway；[Composio Session hooks](https://docs.composio.dev/docs/changelog/2026/10/22)（Python 0.30.0 / TS 0.27.0）可在执行前或结果返回前阻断，并返回 `blocked`。
4. **企业控制面继续降低外部 Agent 接入摩擦。** Databricks 在 [10-27](https://docs.databricks.com/aws/en/release-notes/product/2026/october) 将 ChatGPT、Codex、Claude、Claude Code、Cursor 连接 Databricks MCP 的默认 OAuth 应用推到 GA，账号管理员不必再自建 OAuth app。
5. **沙箱在补网络与幂等语义。** E2B [2.59.0](https://github.com/e2b-dev/E2B/releases)（10-22）加入 `dnsServers`，[2.60.0/2.61.0](https://github.com/e2b-dev/E2B/releases)（10-26）完善控制面重试与创建 `idempotencyKey`。

> 一句话：控制层在修恢复，协议层在换契约，工具层在加闸门——生产 Harness 的门槛从「能跑」变成「能升级、能恢复、能拦截」。

## 控制层：恢复语义与破坏性契约

长任务进入生产后，更新路径和协议生命周期开始主导控制层发版。OpenClaw 本周不再缺公开 changelog：10.6 要求 patched Node 运行时并收紧更新恢复；10.7 强调 replay-safe session recovery；10.8 把「更新后 Doctor 失败也要让 Gateway 再起来」「kill 后会话继续收消息」「沙箱子进程不能跑 host CLI」写成稳定线主题。这与上周「框架内建审批/闸门」不同，本周开源 Agent OS 的主战场是运维连续性。

框架侧则是契约迁移。Microsoft Agent Framework 1.23.0 要求 `mcp>=2.2.0,<3`，AG-UI 端点必须显式提供 `authorization_scope_resolver` 或声明 `single_user=True`，Docker shell 额外参数也改名为 `unsafe_extra_run_args`。Google ADK 2.13.0 把遥测默认切到 OpenTelemetry GenAI v2，并引入 TypeSafe/Jev 工作流分类、Live Audio barge-in，以及可跨 runner replica 共享的实验 MongoDB Session/Memory。LangChain 栈同窗要求客户端先理解 `tool-call-delta`，再让服务端升到 core 1.7.0；LangGraph 则把长线程 Delta 快照默认加密，读得更快、存得更多。

OpenAI Agents SDK 窗口内无新 tag（仍停在 10-15 的 v0.24.0）；Anthropic Agent SDK 的 per-tool permission_policy 落在 10-15/16，已出窗。二者按「无重大公开动态」记录。

## 运行时与沙箱：幂等、DNS、月级云厂笔记

E2B 把沙箱网络出口和创建幂等写进 SDK：`dnsServers` 只开防火墙、不改 resolv.conf；创建可带 idempotency key；控制面按 `Should-Retry` 与 429/5xx 重试。Browserbase、Stagehand、Daytona 本周未见可核 release。

AWS Bedrock AgentCore 的十月官方笔记继续很密——Gateway 支持 Bedrock `InvokeModel` 双向翻译与 model fallback、Step Functions MCP connector、CLI v1.0、长期记忆 TTL、短期记忆按量计费、Runtime FUSE 挂载——但条目挂在「October 2026」分区下、缺逐日日期，**不能坐实落在本周窗口**，只作月级披露。阿里云百炼、火山方舟/Coze、腾讯云 ADP 本轮公开检索未取得窗口内精确日条目。Microsoft Foundry Hosted Agents 平台页本周亦未取得新条目（媒体综述偏 10-19）。

## 工具与身份：共享网关 + 会话拦截

Arcade Plugin 回答的是冷启动：不必先搭 MCP gateway，在已有 agent 客户端里安装插件、登录即可调用；背后仍是同一套 actions runtime 与 Tool Recommendation（工具目录不进上下文）。Composio 同日把 Session hooks 做成可替换列表，阻断时返回空 data 与 `block_reason`，并把 proxy 执行的「完成 / 阻断」结果类型分开。两者合在一起，工具层的产品叙事从「接了多少 API」进一步变成「如何进入、如何拦截」。

身份侧最可核的是两处：Agent Framework 强制 AG-UI 声明授权 ownership；Databricks 为外部 coding agents 提供默认 OAuth client IDs。MCP 规范本体仍停在 2026-07-28，本周无新规范版本。

## 记忆、观测与平台控制面

记忆库厂商（OpenViking、Mem0、Letta、Zep、supermemory）窗口内未见新 release；真正落在窗口内的记忆相关动作，是 ADK 把 MongoDB Memory/Session 做成实验服务，以及 Databricks 在外部 agent OAuth GA 上打通 Unity Gateway 接入。Langfuse 于 10-22 让 blob 导出可选带上 score 的 metadata 与 provenance，方便把评分追溯到评审人或 evaluator trace。

Databricks 十月笔记在窗口内还可核：10-22 Shared Serverless for Asset Bundles / pyproject 环境，10-26~27 账户级安全能力默认可见、Unity Gateway 上架 GPT-6.1 Terra，以及上述默认 OAuth GA。Agent memory pipelines Beta 官方日期为 10-12，属窗外背景。

## 云厂能力矩阵（摘要）

| 平台 | 本周强信号 |
|---|---|
| AWS AgentCore | Gateway 推理/回退/Step Functions MCP 等十月笔记（**日戳未核，限述**） |
| Google | ADK 2.13.0（Mongo session/memory 实验 + telemetry v2） |
| Microsoft | Agent Framework 1.23.0（MCP 2.x + AG-UI auth）；Foundry 平台页无新条目 |
| 阿里云 / 火山 / 腾讯 | 本次未取得窗口内条目 |
| Databricks | 外部 AI agents 默认 OAuth GA（10-27） |

## TOP 5

1. **OpenClaw 2026.10.8（连带 10.6/10.7）** — Agent OS 把更新恢复与会话连续性做成稳定线。
2. **Microsoft Agent Framework 1.23.0** — MCP 2.x 与 AG-UI 授权 ownership 双 Breaking。
3. **Google ADK 2.13.0** — 会话/记忆服务实验化，遥测默认切换。
4. **LangGraph 1.2.18 + langchain-core 1.7.0** — 长线程快照与工具流式契约同步升级。
5. **Arcade Plugin + Composio Session hooks** — 工具入口零配置与会话可阻断同日落地。

候补：E2B 2.59–2.61；Databricks 默认 OAuth GA；Langfuse score provenance；AWS AgentCore 十月 Gateway（月级）。

## 公开局限

全文为文献取证，未做实测。AWS 十月多条无逐日日期；国内三云与部分记忆/集成厂商「本次未取得」不等于无动态；OpenClaw ECS 本机版本字符串本轮未读到；ADK「约 8x」等为官方自述。研究使用 WebSearch/WebFetch；parallel-cli 未登录。
