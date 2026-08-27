---
layout: single
title: "全球 AI Agent 基础设施研究周报 · 第 11 期（2026-08-20 ~ 2026-08-26）"
date: 2026-08-27 10:00:00 +0800
bucket: agent-infra
categories: [AI]
tags: [AIAgent, AgentHarness, AgentRuntime, MCP, AgentMemory, AgentIdentity, AgentObservability]
header:
  overlay_image: /assets/images/posts/2026-08-27-agent-infra-weekly-header.png
  overlay_filter: 0.42
  caption: "AI Agent 基础设施从功能清单转向可声明、可迁移、可审计的运行边界"
excerpt: "梳理 2026 年 8 月 20 日至 26 日全球 AI Agent 基础设施动态：Runtime ABI、跨云 Sandbox、MCP 身份授权、团队 Memory 与 OTel 治理正在汇入企业控制面。"
toc: true
toc_sticky: true
---

AI Agent 基础设施本周最明显的变化，不是多出几个 builder，而是各家开始把边界写清楚：任务运行到哪里、状态如何恢复、谁可以调用什么工具、凭证在哪一跳解密、记忆怎样写入与删除、执行前后如何观测和阻断。

这意味着竞争重心正在从“功能是否存在”转向 **policy + lifecycle contract**。Runtime、Identity、Gateway、Memory、Sandbox 与 Observability 不再是彼此分离的工具，而是在企业控制面中重新组合。

> **时间窗**：2026-08-20 00:00—2026-08-26 24:00（Asia/Shanghai）。只有日期可确认落入窗口的官方公告、文档、release 或 commit 才计为本周动态；窗口外内容一律标为背景。GitHub stars/forks 为 2026-08-27 快照，不代表周增量。

## 本周先看五件事

1. **Google 把 Antigravity 纳入 Gemini Enterprise。** 8 月 21 日，coding agent 的许可证、共享配额、超额预算、sandbox/browser/MCP policy、集中审计与多 IDE 分发进入同一管理面。这不是新增一个客户端，而是开发者 Agent 被企业控制面系统性收编。[官方公告](https://cloud.google.com/blog/products/ai-machine-learning/expanding-google-antigravity-for-enterprise-customers)
2. **Microsoft 用一次不自动迁移的 backend 退场确定 Runtime ABI。** 8 月 20 日，Hosted Agents 旧 preview backend 停止支持；新模型采用每 session 独立 sandbox、跨 turn/idle 持久的文件、专属 Entra identity 与多协议 endpoint。短期迁移成本明确，长期平台边界也更清楚。[迁移文档](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/migrate-hosted-agent-preview)
3. **OpenClaw 进入可外部监管、可恢复的 Agent OS 阶段。** 8 月 24 日的 `2026.8.1-beta.3` 加入 external supervisor、verified restart handoff、SQLite backup/restore、durable channel ingress、secret host binding，并对 89 个官方 npm 插件做完整性回读。[release](https://github.com/openclaw/openclaw/releases/tag/v2026.8.1-beta.3)
4. **Claude 企业托管授权进入 GA。** Enterprise-managed authorization 通过 XAA/ID-JAG，让企业 IdP 集中批准 Claude MCP connector；用户不再逐个完成 OAuth consent，但每次危险动作仍需更细的 policy、HITL 与审计。[WorkOS 技术解读](https://workos.com/blog/enterprise-managed-auth-ga-mcp-server-builders)
5. **Memory 开始接收企业事件，并成为团队资产。** AWS AgentCore Memory 可接收最大 100 KB JSON；OpenViking 将用户级记忆策略、远程 Skills 与 durable ingestion 合流；TencentDB Agent Memory 把团队 Memory/Skill/Wiki/CodeGraph 扩到 Codex、OpenCode、DSH 和 WorkBuddy。

后文按读者问题展开：控制层如何收拢，执行环境怎样分层，工具调用如何授权，记忆如何进入长期运行，以及观测、评测和防护怎样汇成闭环。

## 控制层开始收拢

### OpenClaw：把本地 Agent OS 交给外部控制面

OpenClaw 本周的重点不是单一功能，而是运行边界。`2026.8.1-beta.2/3` 连续处理 SQLite WAL、快照、损坏恢复、Gateway 重连、session 隔离、cron lifecycle claim race 与本地 provider preflight。beta.3 进一步加入 `OPENCLAW_SUPERVISOR_MODE=external`：外部生命周期所有者可以接管 Gateway，同时保留经过验证的 restart/delay 行为，并阻断原生 service mutation 与 self-update。SQLite 备份则覆盖 create、list、verify、restore，restore 只允许 fresh target。

这套变化把 cron、sessions、Gateway、channels、plugins 和本地状态组合成长期在线 Runtime。它的优势是入口和状态面宽，短板是许多保障仍散落在 release note 中。下一步需要把 session isolation、idle/TTL、checkpoint、backup/restore、claim 语义和升级回滚写成可查询契约，而不是让企业用户从修复项拼出 SLA。beta.3 还固定 `@openai/codex@0.149.1`，并回读核验 89 个官方 npm 插件的 selector 与 tarball integrity。

### SDK Harness：恢复、后台任务与成本归因

OpenAI Agents SDK 本周没有新 release：Python `v0.22.0` 与 JS `v0.17.0` 都发布于上海时间 8 月 19 日，早于窗口。紧邻背景仍值得保留：被 output guardrail 拒绝的终端 tool output 会从 SDK 自有 replay/persisted state 中清除；如果序列化 approval checkpoint 无法证明 pending output 属于哪个 response，JS 选择 fail closed；Python 还让 non-streaming Responses 的 `failed`/`incomplete` 终态抛错，并隔离不同 `RunState` checkpoint 的 usage。它说明安全边界已进入状态层，但不能写成本周动态。[Python v0.22.0](https://github.com/openai/openai-agents-python/releases/tag/v0.22.0)

Claude Agent SDK 的本周信号更强。TypeScript 版本增加 `task_started.is_backgrounded`、`spawn_depth`、peer message 被拒绝后的 `refused` 终态、重连时 `background_tasks_changed` live snapshot，以及只停止当前 turn、保留后台 workflow 的 per-task stop。`user_message_uuid` 把输出或错误精确关联回触发消息；`modelUsage[*].costBasis` 区分 `list | managed | unknown`，host-managed provider 可提供 pricing，US-only inference 的 1.1 倍 data-residency multiplier 也进入成本。与之配套的 MCP Python SDK `2.1.0` 把 4 MiB request-body limit 扩到 SSE/OAuth endpoint，服务端异常只在本地记录 traceback，客户端获得类型化错误。[Claude SDK](https://github.com/anthropics/claude-agent-sdk-typescript/releases/tag/v0.3.238)｜[MCP Python 2.1.0](https://github.com/modelcontextprotocol/python-sdk/releases/tag/v2.1.0)

LangGraph 的 `@langchain/langgraph-sdk@1.9.31` 用 `applied_through_seq` 过滤已经解决的 interrupt，避免 reload 后旧 HITL 表单再次出现；LangChain `1.3.17` 修复 custom rejection reason framing；LangSmith 则把 thread 纳入 annotation queue 与 evaluator。这几项共同指向一个不变量：恢复不能把已经生效的审批重新变成待办，拒绝也必须留下可解释终态。[LangGraph SDK 1.9.31](https://github.com/langchain-ai/langgraphjs/releases/tag/%40langchain%2Flanggraph-sdk%401.9.31)

### Agent 与 Workflow 共用执行语义

Google ADK JS `2.0.0` 让 `BaseAgent` 直接继承 `BaseNode`。Agent 因此原生获得 retry、timeout、schema、resume、task mode、OpenTelemetry tracing，并能与 Function/Tool node、ParallelWorker、JoinNode 共用 graph runtime。传统 `SequentialAgent`、`ParallelAgent`、`LoopAgent` 开始弃用，Agent 不再需要 wrapper 才能进入 workflow。[ADK JS 2.0](https://github.com/google/adk-js/releases/tag/main-v2.0.0)

ADK Python `2.8.0` 又补 Remote A2A task mode、auth/credential、`ADK_MAX_LLM_CALLS`、live resumption handle、parallel escalation 与输出防注入。但它存在明确时间边界：release note 日期为 8 月 25 日，GitHub publish 时刻换算上海已是 8 月 27 日 07:25。本期只把它标为边界动态，不作为无争议的窗口内发布。A2A 规范本身本周静默，最新 `v1.0.1` 仍是 5 月 26 日。[A2A releases](https://github.com/a2aproject/A2A/releases)

Microsoft Agent Framework `.NET 1.19.0` 则增加 session-persisted chat client routing、Azure Blob Storage session persistence 与 Foundry Hosted state 持久化；long-running/steerable Hosted Agent、MCP Tasks extension、agent hooks、A2A streaming artifact 与 AG-UI context forwarding 同时推进。Semantic Kernel 本周无 release，AutoGen 的官方 release 更长期静默，微软重心已明显转到 Agent Framework。[MAF 1.19.0](https://github.com/microsoft/agent-framework/releases/tag/dotnet-1.19.0)

### Runtime 变成“session + identity + filesystem + endpoint”

Microsoft Hosted Agents 的迁移最能说明变化。旧 backend 8 月 20 日停止支持且不会自动迁移；新 runtime 默认 idle timeout 15 分钟，每个 session 独立，`$HOME` 与 `/files` 跨 turn 和 idle 持久，Agent 创建时获得专属 Entra identity。调用从共享 project endpoint 改为每 Agent 独立 URL，并可同时暴露 Responses、Invocations、Activity 与 A2A。最低依赖明确为 `azure-ai-projects>=2.3.0`、`azd>=1.23.0`。这不是换包，而是 Runtime ABI 重写。

Google Managed Agents 采用另一条路：Agents API 负责 Agent 定义、环境、数据源和 network allowlist，Interactions API 负责运行交互；Antigravity Agent 在独立 sandbox 中运行，默认无外部系统、网络和凭证访问。它把 harness、skills、sandbox policy 与 API 控制面打成 config-driven 资源，而不只是托管一个 SDK 包。[Managed Agents](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/managed-agents)

AWS AgentCore Runtime 本周没有同级发布。8 月 7 日的 Runtime Instances 可承载多日任务、GPU 与同机多 Agent，只作为窗口外背景。阿里云本周更强的信号来自 Agent Security Center：文档把风险拆成模型交互、知识/记忆、运行环境/工具、配置/组件、身份/凭证五域，并公开 `Alibaba Cloud Standard - OpenClaw Security Baseline`，检查 Gateway bind、强 token、shared DM isolation、sandbox、Elevated、Skills watcher 与 plugin allowlist。[ASC 文档](https://www.alibabacloud.com/help/en/asc/user-guide/agent-risk-detection-overview)

火山 Ark/Coze、腾讯智能体平台/元器/CloudBase，以及 E2B、Modal、Daytona 在 Runtime 维度都没有核到本周同量级正式发布。CrewAI、Dify 有版本活动，n8n、Flowise 也持续维护，但本期最强基础设施信号集中在 durable state、身份、sandbox 与治理，不把普通 workflow/connector 更新拔高。

| 对象 | 本周状态 | 读者要点 |
|---|---|---|
| OpenClaw | 强动态 | external supervisor、backup/restore、durable ingress、状态恢复 |
| OpenAI Agents SDK | 静默 | 最近版本在窗口前，guardrail replay safety 仅作背景 |
| Claude Agent SDK / MCP SDK | 强动态 | 后台任务、精确中断、重连快照、成本口径、4 MiB/错误脱敏 |
| LangGraph/LangSmith | 动态 | sequence cutoff 与 thread 治理 |
| Google ADK/A2A | ADK 强、A2A 静默 | Agent-as-node；Python 2.8.0 有时区边界 |
| Microsoft Agent Framework | 强动态 | session routing、state store、MCP Tasks、Hosted runtime |
| AWS Runtime | 静默 | Runtime Instances 为 8/7 背景 |
| 阿里云 | 治理动态 | ASC 将 OpenClaw 纳入安全姿态基线 |
| 火山/腾讯/E2B/Modal/Daytona | 静默 | 有存量产品，不用旧能力冒充本周新闻 |

本章的共同结论是：Harness 的焦点已从 planner 算法转向恢复、授权、重连和归因；Runtime 的锁定点也从模型调用转向状态迁移、身份、文件系统与 endpoint contract。

## 执行环境分成三层

Sandbox 市场正在分化成三种标准件：无网代码执行器、带浏览器/桌面的交互环境、内嵌 Harness 的自治 Agent sandbox。真正决定可用性的，已经不是“有没有隔离”这一项，而是网络和凭证默认权限、checkpoint/fork、文件与挂载、stream、TTL、审计，以及模型与执行器之间是否有稳定 ABI。

### Anthropic：Computer 与 Browser 成为跨云工具 ABI

8 月 20 日，Anthropic 将 `computer_toolset_20260801` 与 `browser_toolset_20260801` 带到 Google Cloud，覆盖 Fable 5、Mythos 5、Opus 5、Sonnet 5、Opus 4.8，且请求形状与 Claude API 的 `tools` entry 相同。Computer Use 在窗口前一天脱离 beta，支持单 turn 批量 action、默认 `zoom` 与 member config；Browser Use 则面向应用托管 viewport，直接操作 accessibility tree、elements、forms、tabs，并支持下载报告与 opt-in upload。

声明 Computer toolset 默认成员会增加约 4,500 input tokens；禁用 `zoom` 约减少 410 tokens。这个成本不只是模型开销，也说明 tool schema 本身会成为上下文预算的一部分。Anthropic 的路线是把模型与执行器之间的 action/config schema 版本化，并跨 Claude API 与 Google Cloud 保持一致。[release notes](https://platform.claude.com/docs/en/release-notes/overview)

### OpenAI：Assistants 状态机正式退场

OpenAI 在 8 月 26 日关闭 Assistants API，Code Interpreter 用户必须迁移到 Responses API。旧 Code Interpreter 以 thread 为 session 边界，每个 session 0.03 美元、默认活跃 1 小时，单文件最大 512 MB；stdout/stderr、图片与生成文件通过 Run Steps 暴露。迁移不能只改 endpoint，还要重新校验 session 复用、文件归属、计费和 tracing。[Code Interpreter 文档](https://developers.openai.com/api/docs/assistants/tools/code-interpreter)

对 OpenClaw 的含义很直接：长期 session、cron 与审计链不应寄存在供应商的 Assistants thread 中。Responses tool runtime 可以是执行器，但 durable state 应留在 OpenClaw 控制面，避免下一次 API 代际切换再次迁移用户状态。

### Google：高层 Agent sandbox 与低层 Code Execution 并存

Google Managed Agents 默认无外网、无外部系统、无凭证，Agents API 决定 network allowlist 与数据挂载。与之并列的 Code Execution 是模型/框架无关的无网执行器：官方称 1 秒内创建并执行，单次请求与响应总 I/O 上限 100 MB，状态最长保持 14 天且 TTL 可配置；它返回 stdout、stderr 和生成文件，但不允许自行安装库。[Code Execution](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sandbox/code-execution-overview)

这两层解决不同问题：前者给 config-defined autonomous agent，后者给任意 Harness 一个受控计算 substrate。OpenClaw 可以按网络、依赖安装、TTL 与数据驻留路由，不必把所有任务塞进同一种 sandbox。

### agent-browser：企业 CA 与 stale ref 都是生产问题

agent-browser `v0.35.0`（8 月 24 日）允许通过 `--ca-cert`、环境变量或 MCP/config 将企业私有代理 CA 导入隔离 NSS trust store，不关闭 hostname、有效期或其他 CA 验证；还提供 protected Vercel deployment 的短期 OIDC handoff。`v0.35.1`（8 月 26 日）修复 History API、fragment navigation、active-tab 切换后的 URL stream，并在 URL 变化后使 snapshot refs 失效、重置 diff ref 编号，降低旧 ref 指向新页面元素的误点击风险。快照约 41.4k stars、2.7k forks。[changelog](https://agent-browser.dev/changelog)

私有 CA 决定企业代理网络能否使用，stale-ref invalidation 决定 Agent 是否会在页面变化后点错元素。两者比普通 selector 增强更接近基础设施要求。

### SmolVM：本地 microVM 走向桌面与并行 fork

SmolVM 在一周内推进至 `v1.13.0`。`v1.10.x` 加入 S3/rclone remote volumes 与 VPN/TUN policy routing；`v1.11.x` 把远程卷贯通 ephemeral run 和 API exec；`v1.12.0` 加 virtio-gpu、host-side VNC、virtio-input 与 transactional batch fork；`v1.13.0` 再加 software WebGL、nested checkpoint、host loopback/egress 修复与 `SECURITY.md`。项目基于 Hypervisor.framework、KVM、WHP+libkrun，每 workload 独立 guest kernel，默认无网，官方自报冷启动低于 200 ms，默认 4 vCPU/8 GiB 弹性内存，但 release 尚无签名或 provenance attestation。[v1.13.0](https://github.com/smol-machines/smolvm/releases/tag/v1.13.0)

Nested checkpoint、batch fork 与 desktop/VNC 的组合，适合“准备黄金环境，再分叉多个 Agent 尝试”。接入前仍需补 checksum、镜像 provenance、host mount/SSH-agent 权限提示与资源配额。

### 静默对象不等于没有产品

E2B、Browserbase/Stagehand、Daytona、Modal、AWS AgentCore Browser/Code Interpreter、Azure Browser Automation/Playwright 都有存量执行环境，但本周没有核到同级正式发布。Stagehand v4 是 8 月 10 日背景；Browser4 的最后活动线索在 8 月 19 日，均不计入本周。

这一层的可执行结论是：OpenClaw 应把本地 browser session、远程 CDP、raw code sandbox 与持久 VM 视为不同 execution provider，统一暴露 TTL、network policy、mount、checkpoint、stream 与 audit，而不是让工具名掩盖执行环境差异。

## 工具接通之后，谁来授权

工具层本周最重要的变化，不是 connector 数量，而是协议、身份与网关开始合流。一个生产 Gateway 至少要回答四个问题：工具如何发现，长任务如何交付，用户/Agent 身份怎样穿过第二跳，policy 与审计能否理解 JSON-RPC 中的 tool、session 与 error。

### MCP 向异步消息、身份与渐进式发现推进

MCP Core Maintainers 8 月 22 日更新路线图，未来 6—12 个月聚焦五个方向：Agentic Messaging Primitives、HTTP-Native Transport、Agent Identity/Enterprise Security、Improved Primitives、SDK Developer Experience。Tasks、`subscriptions/listen`、progress notification 与 server-initiated event/webhook 将接受组合性审查；transport 探索 HTTP/2 over stdio；缓存从 `ttlMs/cacheScope` 延展到 ETag；身份路线引入 DPoP、Workload Identity Federation、ID-JAG 与 RFC 8693 token exchange；progressive discovery 则避免在连接大型 server 时一次性把全部工具 schema 塞进模型上下文。[MCP Roadmap](https://modelcontextprotocol.io/development/roadmap)

A2A 本周静默，最新协议 tag 仍是 5 月 26 日的 `v1.0.1`。MCP 偏 agent-to-tool/context，A2A 偏 opaque agent-to-agent task，短期仍互补；但随着 MCP 把 Tasks、events、streaming 和 steering 纳入路线，两者边界在靠近。Gateway 会越来越需要双协议路由、统一 identity 与 trace。

### Integration runtime 超越 connector catalog

Nango 8 月 20 日把产品边界概括为四件事：用户认证、tool calls、持续同步 RAG 数据、响应上游变化。其官方资料称覆盖 900+ APIs、6,000+ tools，tool 可经 MCP 或 REST 暴露；sync 保存 checkpoint、失败续跑、full/incremental deletion detection，最快 30 秒调度；action 在隔离 Lambda 中执行，官方称延迟低于 50 ms。模型拿到 `connection-id` 与 provider config 的引用，不接触 provider token。[Nango 对比文章](https://nango.dev/blog/best-embedded-integrations-platform-for-ai-agents/)

同一篇文章把 Pipedream Connect 描述为 3,000+ APIs、10,000+ tools，并支持 MCP、embeddable auth、proxy 与 custom component；但 RAG sync 需要用 workflow 自组。本期没有 Pipedream 自身重大公告，这些数字只作竞品侧写，不写成新品。

Composio 和 Arcade 本周也没有核到正式强发布。Composio 8 月 19 日的窗外背景说明，其价值已经从“连接 API”延伸到 identity-anchored audit、denied-call logging、credential isolation 与 SCIM；Arcade 则继续聚焦带用户授权的 tool execution。它们共同证明，connector catalog 只是 integration runtime 的一层。

### 第二跳身份是网关的胜负手

AWS AgentCore Gateway 与 JFrog 8 月 21 日联合演示 RFC 8693 OBO token exchange：Agent 用用户 JWT 调 Gateway，Gateway 验证入站 token，再换取 JFrog 短期 token，下游继续以登录用户身份记账，而不是共享 service account。`listingMode: DYNAMIC` 让 tool discovery 也携带用户 token，避免复用越权的 cached catalog；示例 token `expires_in=86,400` 秒只是配置值，不是强制默认。[联合方案](https://jfrog.com/blog/amazon-bedrock-agentcore-gateway-jfrog-artifactory/)

Microsoft Foundry Toolbox 8 月 21 日发布、24 日更新的方案，则把 Azure Container Apps Dynamic Sessions 中的自定义 Python 环境包装成版本化 MCP endpoint，并通过 `user-entra-token` 传递调用者身份。Toolbox 将 MCP、A2A、OpenAPI、Web Search、Code Interpreter、Browser Automation 与 Skills 纳入 Build/Discover/Consume/Govern 生命周期；`tool_search` 与 `call_tool` 两个 meta-tools 避免数百工具同时进入上下文。该功能仍为 Preview、无 SLA。[自定义 Code Interpreter](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/custom-code-interpreter)

Google Agent Gateway 本周没有独立更新，其存量差异化是 semantic governance、Model Armor、mTLS/DPoP 与未注册远端资源默认阻断。本期不能把 8 月 15 日 policy engine metrics 冒充本周发布。

### agentgateway：协议语义也会成为攻击面

开源 `agentgateway v1.4.0` 于 8 月 25 日发布，完整跟进 MCP 2026-07-28，支持 stateful/stateless server、subscriptions、opaque resource URI、MCP Apps、EMA/XAA/ID-JAG、RFC 8693 token exchange、JWT bearer grant、trace 与 guardrail。它同时修复 `GHSA-mvgg-jvj2-4frq`：stateful MCP session 可能跨 route 并覆盖 authorization policy，严重度 8.1 High。另一个边界是默认 2 MB body buffer；超限时 `request.body` 不可用，策略必须识别 `request.truncatedBody` 并 fail safe。MCP guardrail 拒绝会以 HTTP 200 + JSON-RPC error 返回，也要求监控不能只看 HTTP status。[agentgateway releases](https://github.com/agentgateway/agentgateway/releases)

Kuadrant MCP Gateway 0.9 的日期是 8 月 14 日，只作窗外背景。它为每次 `tools/call` 输出带 JWT subject、tool/server、request/session ID 的结构化 audit，解释了为什么 Envoy/Istio 的普通 HTTP telemetry 看不见 MCP 应用语义。[Kuadrant 0.9](https://kuadrant.io/blog/mcp-gateway-0.9/)

TrueFoundry MCP Gateway、MCPJungle、mcphub、jarvis-registry 本周未找到达到门槛的官方发布，不根据热度或 commit 噪声扩写。

### 企业身份从 token vault 上移为一等主体

Microsoft Foundry 把身份拆成 blueprint 与 instance。Blueprint 是一类 Agent 的治理模板，Agent identity 是运行实例对应的 service principal；attended 模式使用 OAuth OBO，unattended 模式使用 client credentials，按 Storage、Graph、Key Vault 等下游 audience 换 scoped token。生产 Agent 获得独立 RBAC 与 audit trail，开发阶段共享 project identity，后者也构成更大的横向权限面。推荐使用 federated credential，不保存 client secret。[Foundry Agent Identity](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-identity)

Google 则为每个 Agent 分配 SPIFFE ID 与自动托管的 24 小时 X.509 证书。直连 API 使用 mTLS，经 Agent Gateway 再叠加 DPoP；auth manager 支持 3LO、2LO、API key 与不推荐的 basic auth。用户 credential 只在 Gateway 解密，Agent 不接触 raw token；审计同时记录 Agent 与用户身份。[Google Agent Identity](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/agent-identity-overview)

### Claude EMA 与 Clerk scopes：集中开通和最小权限互补

Claude Enterprise-managed authorization 8 月 24 日 GA。企业管理员在 IdP 配置 connector 后，Claude 在用户 SSO 时获得 ID-JAG assertion，再以 JWT bearer grant 向 MCP server token endpoint 换 scoped access token。首发 IdP 是 Okta，新增 Datadog、Notion、Slack 三个 connector；WorkOS 引述 Ramp 的 2,000 名员工案例，属于厂商案例而非独立验证。

EMA 不支持 DCR，因为 assertion 写入固定 `client_id`。MCP authorization server 必须配置 trusted issuer allowlist、resource/audience binding，并用稳定 `sub` 做用户映射；JWT 签名有效不代表任意企业 IdP 都可信。EMA 解决企业集中开通与撤销，但不能自动阻止 prompt injection 驱动的危险 action。

Clerk 8 月 21 日发布 custom OAuth scopes，示例包括 `messages:read`、`tools:execute`、`resources/files:read`、`mcp_all`。它把 scope 是否可分配与是否在 OAuth metadata 中向 MCP client 公开分开配置；API 端仍需显式校验。`mcp_all` 不宜默认授予，`tools:execute` 也无法表达 workspace、金额或特定 action 等上下文条件。[Clerk changelog](https://clerk.com/changelog/2026-08-21-custom-oauth-scopes)

### 凭证托管必须与调用级授权配套

Composio 的 enterprise MCP auth 方案把 SSO user 映射到 connected account，凭证存于 AES-256 vault，只在隔离 runtime 解密并注入上游请求；action policy 可允许 Slack `post_message`、禁止 `delete_channel`，SCIM 2.0 处理入离职与 session 撤销。官方称 1,000+ integrations，并给出 11 倍、380 engineering hours、4.2M 美元 deals 的案例数字，均应标为供应商自报。[Composio 指南](https://composio.dev/content/mcp-authentication-enterprise-teams)

Nango 8 月 24 日增加 refresh failure 后的 `success:true` recovery webhook；8 月 25 日把 Management MCP 扩至 14 个 tools，除 docs 外均要求匹配 API-key scope；8 月 21 日又加入 environment 与 account API-key 管理。Management MCP 包含 integration 删除与 authenticated proxy request，本身已成为高权限控制面，需要短期 token、per-tool allowlist、HITL 与独立审计。[Nango changelog](https://nango.dev/docs/updates/changelog)

AWS AgentCore Identity、Arcade、Pipedream、Auth0、Descope、Permit.io、Aserto 本周没有核到同级身份发布。WorkOS 本周的作用是为 Claude EMA 提供协议实现交叉证据，不重复算第二条新闻。

这一章可以压缩成四层模型：**Agent workload identity、企业 IdP delegation、credential broker/vault、runtime action authorization**。OAuth/OIDC 只覆盖其中一部分。连接器“已连接”不等于每个动作已获批；凭证也不应进入 prompt、tool args、session transcript、trace 或模型可读 error。

## 记忆不再只是向量检索

Memory 本周出现三条相互连接的路线：结构化企业事件直接进入长期记忆；memory、knowledge 与 skills 合成 Context control plane；团队资产通过 scope、binding 与 ACL 跨多个 Agent 复用。竞争焦点因此从“能否召回”转向“何时写、写什么、注入什么、如何纠错、撤回和迁移”。

### AWS：业务事件直接进入长期记忆

8 月 20 日，AgentCore Memory 的 `CreateEvent` 接受 JSON payload。行为事件、活动日志和系统事件不再需要伪装成 user/assistant message；单 payload 上限 100 KB，并可进入 semantic、user preference、summarization、episodic 四种 extraction strategy。[AWS 公告](https://aws.amazon.com/about-aws/whats-new/2026/08/agentcore-memory-json-payloads/)

这让订单状态、审批结果、故障、策略执行都可能成为长期上下文，也把 provenance、PII、consent、TTL 与 deletion lineage 提升为一等治理问题。JSON schema 正确，不代表事件真实或适合永久记忆。

### OpenViking：Context Database 变成运营控制面

OpenViking `v0.4.16` 把用户级 `memory_policy`、远程 Skills、durable async ingestion、Context Compilation 与任务 telemetry 放在同一层。管理员可限制允许抽取的 Memory 类型，旧 session 在下一次 commit 继承新策略；`add-resource wait=false` 转入可持久后台任务，并保留任务归属。`viking://~` 按已认证调用方解析 user root，TOS credential 保持 request-scoped，不进入 parser/queued job；VectorDB 4xx 不再被吞掉。[v0.4.16](https://github.com/volcengine/OpenViking/releases/tag/v0.4.16)

窗口内 commit 还增加 memory extraction outcomes 指标，修复 content write 与 parser 边界。2026-08-27 快照为 33,597 stars、2,555 forks。它正从 RAG 组件走向统一 memory/resources/skills 的 Context Database，但 AGPL-3.0 集成边界和权限域合并风险必须保留。[仓库](https://github.com/volcengine/OpenViking)

### TencentDB：团队 Memory 修复真实的串场问题

TencentDB Agent Memory `v2.0.1` 于 8 月 25 日发布，新增 Codex、OpenCode、DeepSeek Harness、WorkBuddy；所有客户端经 Proxy 获取 team memory、Skill 与 knowledge。Binding 可持久化，支持按权限跨会话语义+关键字搜索；平台将资产分为 Chat Memory、Skill、Wiki、CodeGraph，并提供 private/team/restricted、User/Role/Agent ACL。[v2.0.1](https://github.com/TencentCloud/TencentDB-Agent-Memory/releases/tag/v2.0.1)

同周 commits 在 OpenClaw 启动时记录 hook-policy 状态，并修复 DSH runtime context 被误写到 L0、继而污染 L1。这个问题揭示持久记忆的核心边界：runtime snapshot、system metadata 与 user fact 必须在写入前区分。仓库快照为 24,698 stars、2,269 forks；项目自报 PersonaMem 48%→76%，属于供应商 benchmark，不作独立效果证明。[仓库](https://github.com/TencentCloud/TencentDB-Agent-Memory)

### Memory API 正嵌入 Harness 生命周期

Mem0 本周将 `mem0-strands` 接入 Strands Agents：每轮自动 recall 并注入 prompt，`add_messages()` 走服务端 extraction，`add()` 可写 verbatim fact；scope 至少包含 `user_id/agent_id/run_id/app_id` 之一。DeepSeek plugin 暴露 `search_memory`/`add_memory`，并记录 `source: DEEPSEEK_HARNESS`。快照为 64,130 stars、7,505 forks。便利性也扩大风险：自动注入必须保留 memory ID、source、scope、score 与撤销能力。[Mem0 releases](https://github.com/mem0ai/mem0/releases)

Cognee `v1.5.3.dev1` 于 8 月 26 日发布，默认检索转为 keyword+vector hybrid，并增加 config doctor、operation feed、authenticated run-subscription WebSocket、per-plugin identity、Linear/GitHub App connector；典型单文件 S3 ingestion 调用从约 13 次降到 4 次。它把图/向量/会话栈包装成 remember/recall/forget/improve，但仍是 pre-release，Postgres graph adapter 迁移也可能破坏旧配置。[Cognee releases](https://github.com/topoteretes/cognee/releases)

Letta 当前实现转移到 `letta-code`，窗口内推进到 `v0.31.0`；`v0.31.1` 换算上海已是 8 月 27 日，排除。本期变化包括等待 MemFS sync 后再执行 memory command、从 shared memory 加载 skills、reflection 前刷新、compaction 后恢复 client context。MemFS 用 git 追踪 memory、skills、prompts，说明 Memory 与 Agent identity/behavior 正汇成版本化 context filesystem；相应地，Agent 自修改系统权限、hook 或 harness 必须默认受限。[Letta releases](https://github.com/letta-ai/letta-code/releases)

### Markdown 权威源与 World Models

memsearch `v0.4.19` 于 8 月 23 日加入 DeepSeek Harness、read-only browser、skill-candidate review 与后台 `PROJECT.md/USER.md` 维护。它采用“Markdown source of truth + Milvus shadow index”：记忆可读、可编辑、可版本化，索引可以丢弃重建，并跨 Claude Code、Codex、DSH、OpenClaw、OpenCode 共享。OpenClaw 安装需分别开启 `allowConversationAccess` 与 `allowPromptInjection`；默认 ONNX bge-m3 首次约 558 MB，快照 2,515 stars。[memsearch v0.4.19](https://github.com/zilliztech/memsearch/releases/tag/v0.4.19)

memmy-agent `v1.1.0/1.1.1` 把 World Models 拆成 general rules/safety、workspace profile、project contract、domain knowledge，并增加显式纠错、重复稳定事实确认、recall evidence、可配置 retrieval layers 与 durable project binding。Transcript limit 从 8 MB 提高至 128 MB。跨 Agent shared memory 的价值很高，但默认必须按 workspace/source/user 隔离，历史导入逐源同意并可删除。[memmy-agent releases](https://github.com/MemTensor/memmy-agent/releases)

### 静默对象仍提供失败教训

supermemory 本周无正式 release；`0.0.8` 是上海 8 月 18 日的窗外版本。它修复 migration adoption 误删 pgvector columns、导致文档可见但召回归零，并用真实 vectors 验证升级存活。项目自报 95% Recall@15、99.4% context reduction、约 50 ms profile，均未独立复现。[supermemory releases](https://github.com/supermemoryai/supermemory/releases)

Zep/Graphiti 本周没有新 release，`0.29.0` 实际为 4 月 27 日；它仍提供 episode provenance 与双时间 validity 的架构背景。[Graphiti releases](https://github.com/getzep/graphiti/releases) Firecrawl 本周活跃但 `v2.11.0` 为 6 月 19 日背景，其 300万+ arXiv papers 与 recall +18% 均为官方自报。[Firecrawl releases](https://github.com/firecrawl/firecrawl/releases) Crawl4AI 最新 `v0.9.2` 标注 July 2026，窗外；其 stream-close cleanup 提醒取消必须传导到 task、queue、page 与 session。[Crawl4AI releases](https://github.com/unclecode/crawl4ai/releases)

memvid `v2.0.140` 是 5 月 27 日背景，修复 WAL 扩容后 offset 不变量与 temp directory 泄漏，说明单文件 memory capsule 仍要经过 crash、checksum、index rebuild 测试。[memvid releases](https://github.com/memvid/memvid/releases) Acontext 的候选仓库未能验证，保持获取失败，不形成事实。

这一层的共同生产契约已经清楚：写入必须标 `user|assistant|system|runtime|tool` provenance；自动注入要有证据、scope、token cost 与拒绝/删除；user fact、project contract、episodic journal、procedural skill 应分层；Markdown/git 可以做权威可审阅源，向量/图索引做可重建派生；skill distillation 只能生成候选，必须经 review/signature 才能安装。

## 观测、评测与防护合流

Agent observability 正标准化为 OTel 语义数据面，evaluation 正产品化为持续反馈环，guardrails 则下沉到 tool execution 的同步 policy plane。三者开始共用同一份 session、turn、tool 与 identity 事件，而不是三个孤立市场。

### OpenTelemetry：方向已经明确，接口尚未冻结

OpenTelemetry 将 GenAI 语义约定迁入独立 `semantic-conventions-genai` 仓库，本窗口 8 月 20、21、22 日仍有提交。Events、exceptions、metrics、model spans、agent spans 全部标为 **Development**，没有正式 release，因此生产系统应锁定 commit 与字段集，不能笼统声称“标准已 GA”。[OTel GenAI](https://opentelemetry.io/docs/specs/semconv/gen-ai/)｜[仓库 commits](https://github.com/open-telemetry/semantic-conventions-genai/commits/main/)

规范已经超越单次 LLM call，覆盖 `create_agent`、`invoke_agent`、`invoke_workflow`、`plan`、`execute_tool` 至少五类 operation。MCP 建议在 JSON-RPC `params._meta` 注入 `traceparent`、`tracestate`、`baggage`，让 client span 成为 server span 父级；如果外层已有 `execute_tool` span，MCP instrumentation 应补属性而不是重复建 span。`gen_ai.evaluation.result` 只承载 score、label、explanation 与 response correlation，OTel 本身不执行评价。输入输出、tool definitions 等内容字段是 opt-in，这一边界应保留。

### Coze Loop：评测系统也需要 SRE

Coze Loop 8 月 25 日为 sandbox-agent turn 增加 `e2e_started.counter`、`e2e_finished.counter`、`e2e_duration.timer`，`turn_id` 贯穿重试与 async callback re-entry。实现只在首次调度记 started，只在成功或最终不再重试时记 finished。它还修复把 Unix 秒当成毫秒、导致约 `1.78e12 ms` 耗时的错误；次日又补 error code，并修复 zombie/sweep 后 Processing 永远不减的问题。[commit](https://github.com/coze-dev/coze-loop/commit/c4d09670af9f5c369f63b6f61cbbb6378d00a7d2)

这些改动没有华丽界面，却决定 eval pipeline 的 SLO、容量与告警是否可信。对 cron/subagent 同样适用：attempt latency 与 logical-turn latency 必须分开，timeout/cancel/zombie 都要落终态。

### FailproofAI：同一事件既用于观察，也用于阻断

FailproofAI 本周把定位写成 “observability and enforcement for AI agent harnesses”。项目称覆盖 12 个 harness，其中包括 OpenClaw 与 Hermes；内置 40 条 policy，处理 API key、`.env`、重复 tool loop、sudo、破坏性 SQL、Terraform/Kubernetes 写操作、`rm -rf`、force push 等。Policy decision 不只有 allow/deny，还包括 `instruct(message)`；本地 dashboard 运行在 `localhost:8020`。这些数量与“zero latency”都来自项目自述，许可证是 MIT + Commons Clause，不能等同无条件 MIT。[FailproofAI](https://github.com/FailproofAI/failproofai)

它的基础设施意义在于：同一份 PreToolUse event 既进入 trace，也成为执行前 policy input。OpenClaw 可把 approval/security hook 抽象成稳定的 PreToolUse/PostToolUse contract，输出 allow/deny/instruct/review 四态；第三方可观测工具可读结构数据，但执行权仍由明确的 policy engine 持有。

### 成本字段与安全摄入进入后台竞争

Phoenix 8 月 26 日合入 `20.4.0`，并把 LiteLLM reasoning token rates 正确映射为 reasoning token prices，解决总 completion token 已计费但 thinking breakdown 错配的问题。[Phoenix 20.4.0 commit](https://github.com/Arize-ai/phoenix/commit/a015c6f69ccb23f1eb2d2a31a25097b42f9dba00)

Braintrust JS SDK 8 月 24 日将 LangChain/LangGraph 的 `UsageMetadata.output_token_details.reasoning` 映射为 `completion_reasoning_tokens`，零值也记录；项目自述 1,648 tests passed，snapshot 涉及 10 个文件、30 行，8 月 26 日又加入 AI SDK `generateImage` instrumentation。[Braintrust commit](https://github.com/braintrustdata/braintrust-sdk-javascript/commit/a47a41ef71d4f6b5639e9878dbed81ead0cb7c4a)

Langfuse 8 月 26 日修复 OTel attribute mapping 的 prototype-chain clobbering 与 nested path 冲突。OTel 互操作扩大 ingest 面，也扩大了 attribute cardinality、path collision、prototype pollution、内容脱敏与租户隔离的攻击面。[Langfuse commit](https://github.com/langfuse/langfuse/commit/1c5df63be9c5bbe6e36bd02628c538b0793bdfa9)

Helicone 仅核到 pass-through billing allowlist 的弱动态；AgentOps 本窗 commits API 为空；LangSmith 在观测模块没有独立强发布。OpenLIT 与 TraceRoot 本周活跃，但无法稳定提取足够具体的 release 事实；Laminar、Logfire 未核到强发布；agentacct 获取失败。它们均不因活跃度被扩写。

### 云厂把质量闭环并入控制面

AWS 本周将 AgentCore Gateway 的 tool access 与 AgentCore Policy、Bedrock Guardrails 连接：动作执行前按主体、tool 与条件做确定性控制，guardrail trace 与 tool-call audit 合流。强信号不是新 dashboard，而是 identity、policy、guardrail、trace 共处执行边界。[AWS Policy/Gateway](https://aws.amazon.com/blogs/machine-learning/govern-ai-agent-tool-access-with-amazon-bedrock-agentcore-gateway/)

Google 本期没有独立发布，平台基线仍包括 Cloud Trace、Logging、metrics/alerts、Evaluation Service、Example Store 与 Feedback Service。其 evaluation 支持 VPC Service Controls、CMEK、data residency at rest、HIPAA，但 Access Transparency 与 Access Approval 为 No；这是成熟度矩阵中的限制，不应省略。[Google scale/eval](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale)

Microsoft Foundry Observability 文档在 8 月 26 日更新，将能力归为 Evaluation、Monitoring、Tracing 三件套。Built-in evaluator 覆盖 coherence、groundedness、safety、tool call accuracy 与 task completion；Application Insights 提供 token、latency、error、quality dashboard；生产阶段支持 continuous/scheduled evaluation、scheduled red teaming 与 alerts。Tracing 基于 OTel，并点名 LangChain、LangGraph、OpenAI Agents SDK、Microsoft Agent Framework。Playground evaluations 默认按 consumption billing 开启，需取消 evaluator 才关闭。[Foundry Observability](https://learn.microsoft.com/en-us/azure/foundry/concepts/observability)

云厂的优势是把身份、网络、账单、审计和评测一起提供；独立工具的机会仍在跨云、开源自托管和更快适配框架。单纯 trace viewer 会越来越难独立出售。

## 七个平台，七种控制面

Managed Agent Platform 已从“模型 + builder”升级为七类资源的治理系统：Agent/session、memory event、tool/gateway、agent identity、sandbox/network、trace/eval，以及 registry/budget。下面的矩阵保留本期 7 个平台与 7 个能力列；“本周强信号”只写 8 月 20—26 日可核事件，其他格子是平台能力基线。

| 平台 | Runtime / Session | Memory / Context | Gateway / Tools | Identity / Auth | Sandbox / Browser / Code | Observability / Eval | 本周强信号 |
|---|---|---|---|---|---|---|---|
| AWS | AgentCore Harness + serverless Runtime；异步 Agent、session isolation；Runtime Instances 为持久计算背景 | short/long-term Memory，可跨 Agent 共享 | Gateway 将 API、Lambda、MCP server 统一为 MCP tools；Registry 管 agent/tool/skill | Identity 对接 Cognito、Okta、Entra、Auth0；Policy 在 Gateway 拦截 tool call | 每 Harness session 隔离 microVM；BYO image；托管 Browser；Code Interpreter | OTel-compatible Observability；session/trace/span eval；Optimization 支持 trace 建议、versioned bundle、A/B | **8/20 Memory `CreateEvent` 接受最大 100 KB JSON，并进入四类长期记忆策略** |
| Google | ADK + Agent Runtime；Managed Agents 的 Agents/Interactions API；Sessions | Memory Bank、RAG Engine/Vector Search；外部 Cloud Storage 可挂载 sandbox | Agent Gateway 代理 MCP/A2A/REST/gRPC；Registry 默认阻断未注册远端资源 | 每 Agent managed identity；IAM/IAP；mTLS、DPoP、OAuth；按 tool 与读写属性授权 | 每 Agent 独立 Linux sandbox，默认无网无凭证；Code Execution 无网、100 MB、最长 14 天 | Unified Trace Viewer；Logging/Trace；multi-turn autoraters、online eval、simulation | **8/21 Antigravity 纳入 Gemini Enterprise：license、pooled quota/overage、预算、sandbox/browser/MCP policy、集中审计** |
| Microsoft | prompt agent、Hosted agent、Responses API；新 backend 每 session 独立、自动 provision/deprovision | built-in memory；session state；可外接 AI Search/Cosmos DB | Toolboxes 将 web/file/code/MCP/OpenAPI/function 汇成版本化 managed MCP endpoint | 每 Agent 专属 Entra identity；RBAC、managed identity、OAuth OBO；Registry 分发 | VM-isolated session sandbox；HOME/files 持久；BYO VNet；Code Interpreter | end-to-end trace、metrics、eval、App Insights、Optimizer | **8/20 旧 Hosted backend 停止且不自动迁移；新 ABI 采用专属 endpoint/身份、session sandbox 与多协议** |
| 阿里云 | 百炼/Model Studio Agent；PAI-EAS；ASC 横向扫描 PAI、百炼、AgentKit、AgentRun | 知识库/RAG；ASC 检测知识/记忆投毒与过宽权限 | Model Studio/PAI tools、API、MCP；ASC 检查 HTTPS、tool poisoning、未授权调用 | RAM/AKSK/KMS；ASC 检测明文凭证、弱口令、强 token 与 identity spoofing | PAI-DSW/EAS container/GPU；公开材料未证明专用 browser control plane | ARMS/PAI 监控；ASC 五域风险与基线；独立 agent eval 公开证据较弱 | **8/21 ASC 落地五安全域，并公开 OpenClaw Security Baseline** |
| 火山/字节 | Ark/Coze runtime；OpenViking Session/VikingBot、durable async tasks、Context Compilation | OpenViking 统一 memory/resources/skills；用户级 `memory_policy` | Coze tools/plugins；OpenViking MCP、远程 Skill、TOS/Lark connector | API key/user scope；管理员按用户设置 memory policy | Coze code/plugin execution；OpenViking 不等同专用 browser；统一云 browser 证据不足 | Coze Loop trace/eval；OpenViking task/context/queue/error/read telemetry | **OpenViking v0.4.16：remote Skills、user policy、durable ingestion、Context Compilation** |
| 腾讯云 | 智能体平台/元器/CloudBase；TencentDB Agent Memory 以 Proxy 接 coding agents | Chat Memory、Skill、Wiki、CodeGraph，团队资产与 L0-L3 | 元器插件/CloudBase tools；Proxy兼容 Anthropic/OpenAI；Knowledge tools API | CAM/应用密钥；System/Team Admin、Owner；private/team/restricted与User/Role/Agent ACL | CloudBase function/container；统一 browser/code sandbox 公开证据较弱 | 平台评测/日志为存量；Memory Hub 有处理状态与用量；统一 trace/eval 证据较弱 | **8/25 v2.0.1 新增 Codex/OpenCode/DSH/WorkBuddy，持久 binding 并修复多 Agent 串场/空召回** |
| Databricks | Custom Agents on Apps；Agent Bricks Knowledge Assistant/Supervisor；Model Serving | Lakehouse/Unity Catalog、AI Search/Vector Search；Supervisor 存临时转换/checkpoint/metadata | Unity AI Gateway + MCP；managed MCP 覆盖 Genie/AI Search/SQL/UC functions | Unity Catalog grants、service principals；终端用户对每个 subagent/tool 显式授权 | locked-down serverless code sandbox，Python/SQL/shell，无公网，只读获批 UC 资产 | MLflow Tracing、Agent Evaluation、offline/online monitor、human feedback/LLM judges | **8/20 Private Link 扩到 account-level Genie One、Governance Hub、console/API/custom URL；非 Agent runtime 更新** |

### 平台信号如何解读

AWS 的新意是把 Memory 输入从 conversation 扩到 enterprise event bus。Google 的变化发生在 license、FinOps、安全和审计层：管理员可设 project budget cap，团队共享 pooled token quota并选择 overage；Gateway 单实例最多治理 5,000 个 Registry resources。[Google Agent Gateway](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/agent-gateway-overview)

Microsoft 用强制迁移消除旧 framework adapter，确定 session sandbox、durable files、per-agent identity 与 protocol server。阿里本周没有证明新的 durable runtime，但 ASC 直接扫描 OpenClaw，说明 OpenClaw 已成为云安全产品真实威胁模型中的生产资产。

火山与腾讯的强信号来自开源 Context/Memory 组件，不能外推为 Ark/Coze 或腾讯智能体平台的全量 GA。Databricks 的变化则属于企业网络控制面：8 月 20 日，Inbound Private Link Beta 扩到 account-level Genie One、account console、Governance Hub、account APIs 与 custom/stable URL；一个 shared General Access endpoint 可跨 region/workspace 承载 UI/API。它降低强隔离客户的采用阻力，但不是 Agent Bricks runtime 发布。[Databricks Private Link](https://www.databricks.com/blog/inbound-private-link-now-supports-account-level-genie-one-account-console-and-custom-urls)

Databricks 的差异化仍在 Unity Catalog、AI Gateway 与 MLflow 同企业数据面治理。Supervisor 最多可选择 50 个 agents/tools；内置 code sandbox 无公网，只读访问获批且终端用户有权限的 UC tables/volumes。[Supervisor](https://docs.databricks.com/aws/en/agents/agent-bricks/multi-agent-supervisor)｜[MCP tools](https://docs.databricks.com/aws/en/agents/mcp-tools/)

这七个平台没有收敛成同一产品，但共同关键词是“边界可声明”：AWS 声明 event 输入；Google 声明 subscription/spend/browser/MCP/audit；Microsoft 声明 Runtime ABI；火山与腾讯声明 user/team memory policy；Databricks 声明 identity/network/destination ingress。OpenClaw 的机会是保留自托管、多渠道与本地执行入口，把这些云平台当远程 worker、tool 或 data backend，而不是复制它们全部控制面。

## OpenClaw 下一步

把本期所有变化放回 OpenClaw，可以得到八项按基础设施价值排序的动作。它们不是新结论，而是前文判断的工程化落点。

1. **把 Runtime contract 产品化。** 对 session isolation、workspace/files persistence、idle/TTL、checkpoint/restore、agent endpoint/protocol version、migration status 与 cron claim 语义给出机器可读资源和健康指标。
2. **增加结构化事件记忆入口。** cron、tool call、approval、channel interaction、failure/recovery 可以 typed event 写入 Memory；每条保留 source、actor、session、consent、TTL、revision 与 deletion lineage，runtime snapshot 默认排除。
3. **把 Gateway 升级为 identity-aware policy enforcement point。** 每次调用绑定 `human_user + agent_instance + client/application`，未注册工具默认拒绝；connector 接入授权与 action/resource runtime policy 分层。
4. **补齐第二跳身份。** 外部 MCP connector 不使用共享长效密钥；支持 OBO/token exchange、短 TTL、issuer allowlist、resource/audience binding，并确保 tool catalog cache 不越过用户权限边界。
5. **让凭证对模型不可见。** Refresh/access token 只在 Gateway credential broker 解密、最后一跳注入；prompt、tool args、session transcript、trace 与模型可读 error 一律 redaction。
6. **将安全基线变成可导出的证据。** 对 Gateway bind、strong token、sandbox、shared DM isolation、Elevated、Skills watcher、plugin allowlist 等输出 baseline ID、pass/fail/evidence/remediation，并映射云 CSPM/ASC。
7. **把 Memory 做成团队边界。** 区分 user fact、project contract、episodic journal、procedural skill；支持 ownership、version、binding、policy inheritance、跨 session 删除和 team/private/restricted ACL。Skill distillation 只生成候选，经 review/signature 后安装。
8. **统一 OTel 事件与执行前 policy。** session/turn/tool/subagent/approval/cron/Gateway 映射到版本化 OTel schema；MCP 传播 W3C context；content 默认 opt-in。PreToolUse/PostToolUse 输出 allow/deny/instruct/review，评价结果与执行策略相关联但不混为一层。

## 结语

本周的共同变化可以用一句话概括：**Agent 基础设施正在把“能做什么”改写成“在什么身份、状态、网络、记忆与策略边界内做”。**

这会改变平台选择。模型仍然重要，但长期锁定越来越来自 session 与文件状态、身份对象、Gateway policy、Memory ownership、sandbox contract 和 trace/eval 数据面。OpenClaw 不必复制每个云控制面；更现实的路线是守住多渠道、自托管、本地执行、会话与审批主权，同时把云平台接成可替换的 worker、tool 和 data backend。