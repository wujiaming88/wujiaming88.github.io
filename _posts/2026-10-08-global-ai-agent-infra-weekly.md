---
layout: single
title: "全球 AI Agent 基础设施周报 · 第 16 期：控制层收编与工程可靠性竞争（2026-10-01 ~ 2026-10-07）"
date: 2026-10-08 06:00:00 +0800
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
  overlay_image: /assets/images/posts/2026-10-08-agent-infra-cover.png
  overlay_filter: 0.35
toc: true
toc_sticky: true
---
# 全球 AI Agent 基础设施周报 · 第 16 期：控制层收编与工程可靠性竞争（2026-10-01 ~ 2026-10-07）

全球周报｜2026-10-01 ~ 2026-10-07

第 16 期（2026-10-01 00:00 ~ 10-07 24:00，Asia/Shanghai）跨 8 个模块的综合判断是：Agent 基础设施的竞争重心，已从「能不能编排」转向「长时间运行不掉线、可恢复、可审计，并以正确的身份与预算触达正确的工具与执行环境」。四股力量同向：开源 Agent OS 与开源编排把 session/state 持久化、优雅取消、人工确认做成发布主线；模型厂把浏览器与计算机执行工具及网络策略下放进 SDK；云厂把控制面与身份持续平台化，并把模型厂 Harness 收编为自家 SKU；IAM 厂商与集成平台则在抢 MCP 网关身份标准，工具层出现首个按用量结算的「Agent 钱包」。

这些变化指向同一条价值链：控制层的价值正从「编排能力」移向「运行时可靠性与治理能力」，身份、执行环境、工具结算三处被平台方同时收口。对搭方案的人而言，本周更值得读的不是新功能清单，而是各层「谁拥有状态、谁定义边界、谁掌握结算」的分工变化。

本期所有平台能力、发布与数值均为文献取证（官方发布说明、release notes、changelog、仓库元数据、厂商博客），未对任何平台做实际部署、压测或功能实测，文中的影响判断属基于已落盘证据的推理。窗口外信息一律作为背景标注，不进入本周动态判断。多处官方条目按月或按周聚合、无逐条日期，凡无法确证落在窗口内的均按「本次未取得窗口内一手证据」处理；「未查询到」不等于「不存在」。

## 本期 TOP 5 与候补信号

按对 Agent Harness 基础设施格局的信号价值排序（是否改变 Harness 与控制层竞争结构、一手证据强度、是否具跨模块外溢影响）：

1. **Modal Runtime 大会（10-01）**：一次发布把执行环境三个维度同时产品化——真机保真（VM Sandboxes）、信任边界（Sandbox Sidecars）、有状态长会话（Sticky Sessions）。三者直接对标 AWS AgentCore Runtime 的存量能力，是托管专业厂商领先云厂的窗口。
2. **OpenClaw v2026.10.1-beta.1（10-05）**：把 session/state 持久化从同步写全面转向异步 await（多条插件 API 自 10-01 起弃用告警），并处理跨 registry usage、远程 workspace 投递与 embedding 缓存有界批次迁移。是本周最可核验的 runtime 生命周期演进信号。
3. **Anthropic SDK 内置 browser/computer use 工具集（10-07）**：模型厂以 SDK 定义执行工具协议（成员工具子类化、审批回调与 URL 策略），并明确 SDK 不含浏览器实现、改列 Browserbase/Daytona/E2B 为集成伙伴；同日 `allowed_hosts` 收紧 `web_fetch` 与 `web_search`。
4. **IAM 厂商抢占 MCP 网关身份层（Okta 10-02、WorkOS 约 10-02）**：Okta 把 XAA/ID-JAG 的两步委托拍成两条拓扑，并点破用户 OIDC token 不得直接转发给下游 MCP server；WorkOS 把四家 MCP 网关状态整理为「身份/治理品类」。
5. **Composio Instant（10-07）**：工具层首次把「Agent 自主付费」产品化，可直接调用 100+ 付费工具而无需建账号、配 key 或订阅，把工具访问从「接得通」推到「按用量结算」。

候补信号（未入前五但具跨模块价值）：A2A CLI 发布（10-01）；OpenViking v0.4.23（10-02）与 Cognee v1.6.3（10-07）；Langfuse decision models 与 Arize Phoenix DECISION span（10-01~10-07）；Google ADK v2.11.0（10-01）。

## 控制层：会话与状态的可靠性成为发布主线

本周开源控制层交付的几乎都是 session/state、审计与恢复类修补，而非新范式；Harness 竞争已从「能不能编排」转向「长时间运行不掉线、可恢复、可审计」。

### OpenClaw：三连版本，异步持久化与跨 workspace 迁移

OpenClaw 本周连续交付三个版本：`v2026.8.35`（2026-10-02，非预发布）、`v2026.9.8`（2026-10-03，非预发布）与 `v2026.10.1-beta.1`（2026-10-05，预发布）。

`v2026.9.8` 的官方说明把重点放在稳定性：修复 agent 之间缺失的回复、降低同时运行大量 Codex agent 时的内存占用、修复失败更新与 Windows 启动问题，规模为 43 个 PR、12 个直接提交、8 位贡献者；具体条目含「更新恢复保留已允许与启用的插件」「Doctor 补完待确认升级」「热重载连接设置时进行中的工作可完成」，以及 `REPLY_SKIP`/`ANNOUNCE_SKIP` 不再隐藏回复。背景（非本周）：上一版 `v2026.9.7` 已引入「OpenAI Agents API」与「Sign in with ChatGPT (Beta)」。

更重的一版是 `v2026.10.1-beta.1`，Highlights 首条即 Sessions and memory：跨注册表变更保留 usage、从远程 workspace 投递 worker 附件、迁移 embedding 缓存并按有界批次上报超大行、阻止「排队中的取消」与 transcript 别名卡住活跃 turn、保持 continuation 签名对齐。Changes 段另有「迁移既有 agents 到 local Claws」、降低 Sessions-board 与 state-path 开销（服务化准备事实、按 store revision 复用卡片载荷、把生命周期变更移出主线程、保留 canonical state handles），以及 plugins/Codex/MCP、Cloud workers/Crabbox、Windows workspace 与 Playwright Chromium ARM64 自动启动等修补。

最值得架构师注意的是一条弃用时间线：该版列出多条自 **2026-10-01 起告警**的插件 API 弃用——`session-manager-sync-persistence`（改为 await 对应的 Async 后缀 SessionManager 方法）、`extension-session-sync-persistence`（await ExtensionAPI/AgentSession 持久化方法）、`provider-replay-sync-persistence`（改用异步 replay sanitizer 与 session-state API）、`memory-session-sync-inventory`（await `loadArchivedSessionsAsync`/`resolveMemorySessionTargetsAsync`）；另有 `workspace-mutation-guard-callback`、`gateway-placement-sync-results` 自 2026-10-02 告警。含义是 session/state 持久化从「同步写」全面转向「异步 await」语义——这是长时、并发 Agent runtime 的典型演进方向，也意味着插件生态需要跟随迁移。

版本时间戳（截至 2026-10-08 取数）：`v2026.10.1-beta.1` 发布于 `2026-10-05T19:47:49Z`、`v2026.9.8` 于 `2026-10-03T03:21:47Z`、`v2026.8.35` 于 `2026-10-02T14:06:34Z`、`v2026.8.34` 于 `2026-10-02T00:12:39Z`。来源：[OpenClaw releases](https://github.com/openclaw/openclaw/releases)、[v2026.9.8 release notes](https://docs.openclaw.ai/releases/2026.9.8)、[docs.openclaw.ai/releases](https://docs.openclaw.ai/releases)。

### LangGraph：编排语义稳定后，竞争转向部署与运维

LangGraph 1.2.14（2026-10-06）、langgraph-sdk 0.4.6（2026-10-06）与 langgraph-cli 0.4.33（2026-10-07）接连发布。1.2.14 为纯发版提交；sdk 0.4.6 修复 stream 请求中 thread/assistant ID 的百分号编码问题；cli 0.4.33 新增 `--image-uri`（部署已推送镜像）与 `langgraph deploy listeners list` 子命令，并新增「拒绝携带凭据的 Git 依赖」安全修复。动作集中在部署与运维体验，是「运行时商品化」阶段的典型特征：编排语义已稳定，竞争转向托管与交付。背景（非本周）：LangChain/LangGraph 1.0 于 2025-10-22 GA，LangChain 0.3 处于维护状态、支持至 2026-12。来源：[langgraph releases](https://github.com/langchain-ai/langgraph/releases)。

### Google ADK v2.11.0：开源控制层的一次性补齐

ADK Python v2.11.0 于 2026-10-01 发布，是本周窗口内少见的控制层实功能包。要点包括：可向 `Runner`、`Workflow`、节点传 `abort_signal` 优雅停止运行，`/run_sse` 在客户端断开时取消运行；工具节点现可像 `LlmAgent` 一样通过 `RequestInput` 暂停等待用户批准；`ModelConsultTool` 允许 Agent 在任务中途咨询另一模型，受每轮/每会话预算约束；以 `sqlite://` memory service URI 选择本地 SQLite 记忆库；通过新 opt-in 路径以现代协议连接 MCP server（MCP SDK 2.x）。破坏性变更：Dev UI 的 runtime config 改由服务端按请求下发，不再写入安装包。把「可取消/可中断 + 工具人工确认 + 记忆内置 + MCP 2.x」一次性补齐，等于在开源控制层里对标 Anthropic 的审批回调与 AgentCore 的 lifecycle hooks——控制层正快速同质化。来源：[google/adk-python releases](https://github.com/google/adk-python/releases)、[abort run 指南](https://github.com/google/adk-python/blob/main/docs/guides/runners/runner/abort.md)。

### 模型厂把执行工具与网络策略下放进 SDK

Anthropic 在 2026-10-07 密集发布。最结构性的一条是 SDK 内置浏览器与计算机使用工具：Python 与 TS SDK 新增 browser use 与 computer use 工具的 beta 类，开发者子类化并自写每个成员工具方法（如 `navigate`、`left_click`），SDK 负责路由调用、执行 config 策略、调用审批回调并组装 `tool_result`。官方明确 SDK **不含浏览器/桌面/驱动/URL 策略**，仅提供 `claude-quickstarts` 中的最小 CDP 示例（非生产代码），并列出 Browser Use、Browserbase、Daytona、E2B 的第三方集成。同日，Claude Managed Agents 网络策略收紧：`limited` 模式下 `allowed_hosts` 同时施加到 `web_search` 与 `web_fetch`，命中不到允许主机的 `web_fetch` 返回 `url_not_allowed`。

同日其他发布与定价：Claude Haiku 5.5（`claude-haiku-5-5`，1M 上下文、128k 最大输出、adaptive thinking + effort 参数，覆盖 API / Bedrock / Claude Platform on AWS / Google Cloud / Microsoft Foundry；官方警示 Haiku 4.5 代码可能在 5.5 报 400）；Sonnet 5.5 prompt cache 读取价从 $0.20 降至 $0.10 / 1M tokens（0.1x→0.05x 基础输入价）；Max/Team 计划纳入月度 API 额度。MCP 协议本体当前正式规范仍为 2026-07-28（stateless core + OAuth/OIDC 加固，属背景）。来源：[browser use SDK](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-sdk)、[Claude release notes](https://platform.claude.com/docs/en/release-notes/overview)。

OpenAI 本周没有动 Harness 骨骼，补的是平台治理项。API 侧窗口内变更：10-07 更新 `chat-latest` 快照（面向 ChatGPT Plus/Pro/Business/Enterprise，官方建议生产使用 GPT-6 家族）；10-06 发布 Decisions API（beta，`gpt-6-luna`，官方称把文本与图像转成类型化答案、比 Responses API 快 10 倍）；10-06 将 API 使用层级从 5 档简化为 3 档（Build/Launch/Grow）；10-05 在 API 组织设置中加入 HIPAA 合规支持流程（可签署 BAA）。属控制层谱系的背景（非本周）：2026-09-29 将 Computer Use 加入 Agents API（Agent 可在 OpenAI 托管浏览器中完成任务，网站访问审批与登录由应用处理），同日发布 GPT-6.1 Sol（$2 input / $0.10 cached input / $2.50 cache write / $10 output 每 1M tokens，≤272K 输入）并支持 Multi-agent（beta，在单次 Responses 请求内委派子 Agent）。含义是 OpenAI 正把 Agent 能力下沉为 Responses API 原语，对第三方 Harness（含 OpenClaw）形成「接口被上游吸收」的持续压力。来源：[OpenAI API changelog](https://developers.openai.com/api/docs/changelog)。

Microsoft Agent Framework 与 Databricks 的同类动态分别见「云厂控制面」一节；两者本周均以背景或边缘能力为主。

### 应用层动态池：本周无基础设施级动态

CrewAI AMP/Studio、Dify Agent Runtime、n8n/Flowise 本周均无满足「平台化 / runtime / observability / enterprise deployment」基础设施级门槛的窗口内动态。背景（非本周）：Dify 于 2026-08-27 发布「New Agent」（Agent 成为独立应用或工作流可复用资源）；CrewAI 2026-02 发布《state of agentic AI in 2026》报告。应用层工作流平台本周未在控制层范式上提出新主张，竞争集中在云厂与开源 SDK，这是本周控制层格局的一个侧面信号。

## 执行环境：真机、信任边界与会话粘滞

执行层本周最强信号来自 Modal 的 Runtime 大会（10-01）。云厂托管 runtime 与浏览器/代码沙箱集体静默，开源与托管 sandbox SDK 以可靠性补丁为主。

### Modal：把执行环境三要素做成平台原语

Modal 首届大会「Runtime」发布三项原语。**VM Sandboxes**：「给你的 agent 一整台 Linux 计算机」——官方描述 agent 越来越想住在一个像真机器的环境里：跑 Docker 栈、本地数据库与 dev server、图形环境与移动模拟器，甚至折腾 Linux 内核；已用于 Linear、Legora、Snorkel 的编码 agent 与评测。**Sandbox Sidecars（Beta）**：与主 Sandbox 跑在同一 host、但隔离级别等同于独立 sandbox 的旁车容器——agent 生成的代码在主 Sandbox 跑，而凭据/代理/harness 逻辑跑在 agent 无法直接访问的 Sidecar，两者共享 host、通信本地化，避 execution-heavy agent loop 里的网络往返。**Sticky Sessions**：客户端带上 session token 即可把请求路由回同一运行中的容器，让应用跨请求保持状态、给终端用户无缝重连，官方点名实时语音等对容器路由速度敏感的场景。同一场还发布 Modal Clusters GA（单装饰器 `@modal.clustered` 提供多节点集群，已在 Decagon、1x、Runway 使用）。来源：[Modal Runtime 产品更新](https://modal.com/blog/runtime-product-update-sandbox-endpoints)、[Modal changelog](https://modal.com/changelog)、[VM Sandboxes 条目](https://modal.com/changelog/give-agents-a-full-computer-with-vm-sandboxes)。

含义：Modal 把「真机保真度」与「凭据隔离（信任边界）」捆成一个产品，直接命中 agent 落地的两大痛点——需要完整 OS/内核的编码与评测场景，以及「不能让 agent 碰凭据」的安全要求。把会话粘滞从运维技巧变成平台原语，意味着 serverless 执行面正补齐过去只有长驻进程才有的 state 能力；「无状态函数」与「长驻有状态 session」的边界正在被托管 runtime 主动抹平。

### E2B：可靠性补丁与可复制的避坑规则

E2B 本周两个发布：`e2b@2.53.1`（2026-10-06）为重发（上个版本已 versioned 但未能推上 npm/PyPI），无新功能；`e2b@2.52.1`（10-05）含实质修复——仅在可安全重放的操作上重试 502，sandbox 创建、fork、snapshot 等资源创建型 POST 遇 502 不再重试（避免重复创建），secret 更新不再重放，`503` 仍全重试；修复 JS SDK `WatchHandle.stop()` 现在算干净结束（`onExit` 无错而非报 `TimeoutError`）。仓库 stars 14220 / forks 1091（快照）。对搭生产方案的含义是一条可直接照搬的规则：sandbox 创建/快照/fork 类调用按非幂等处理，不要盲目重试 502。来源：[E2B releases](https://github.com/e2b-dev/E2B/releases)。

### 云厂 runtime 与浏览器/代码沙箱本周静默

- **AWS AgentCore Runtime**：窗口内无 Runtime 专属发布，10 月发布说明仅一条 Gateway 私有 CA（属工具网关，见后文）。Runtime 侧最近条目均在窗口前：8 月的 Instances 计算类型支持最长 14 天持久会话、GPU 实例与多 agent 共享实例，并把数据面配额提高（`InvokeAgentRuntime` 合并为 1000 TPS/账号、新建 session 25 TPS/账号）；7 月的 BYO File System（挂载 S3 Files/EFS）与 Interactive Shells（每 session 最多 10 个持久 shell）。AgentCore 的 runtime 能力已在 7–8 月集中铺完，近两周处于功能固化期。局限：官方发布说明按月聚合、无逐条日期，10 月条目具体日不可核。
- **Google**：窗口内无 Agent Engine / Managed Agents 专属发布；10-05~10-07 条目均为 CodeMender 与 Nano Banana 2.1。其 sandbox 暂停/秒级恢复、Computer Use 与 Shell sandboxes GA 均在 2026-09-09（背景）。
- **Microsoft Foundry Hosted Agents**：未取得 10 月窗口内动态，官方 what's-new 页仍为 2026-08。其 8 月文档体系围绕长时运行 agent——长时 agent 韧性、崩溃后恢复、任务状态管理、流式重连、可转向 agent、人类审批与私有 ACR 镜像。
- **浏览器/代码沙箱**：AWS AgentCore Browser/Code Interpreter、Azure Playwright Workspaces/Code Interpreter、Google Code Execution、OpenAI Computer Use 均无窗口内发布；Browserbase changelog 最近条目为 2026-09-30（Functions Secrets），9-24 的 Pause & Resume 与平台内置的 Live view/Session replay/Logs and traces 均非本周新增；Stagehand 仓 stars 25,562 / forks 1,753，最新 release 为 stagehand-server-v3/v3.7.6（2026-08-28），均属背景。Anthropic computer use 工具集版本标识为 `computer_toolset_20260801`（背景）。
- **国产平台**：阿里云百炼、火山方舟/Coze、腾讯云 ADP 均未查到 10-01~10-07 一手运行时发布，如实标静默；腾讯云 ADP 已有「Claw 模式」与 OpenClaw 同名词，但目前无 10 月证据，仅为命名相似，不作推断。
- **Daytona**：窗口内无 release（最新 v0.190.0 为 2026-06-23），README 注明自 2026-06 起核心开发迁至私有码库、本仓不再更新（背景）。

来源：[AWS AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)、[Google Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)、[Microsoft Foundry what's new](https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry)、[Browserbase changelog](https://www.browserbase.com/changelog)、[Daytona](https://github.com/daytonaio/daytona)。

## 工具与协议：从接入面到结算面

协议层本周给的是「接入面」而非「新规范」：MCP 最新正式规范仍是 2026-07-28（背景）；窗口内实质动态集中在开源企业级 MCP Gateway/Registry 的密集迭代、A2A 的 CLI 化，以及工具层首个按用量结算的产品。

### MCP：网关化进入生产运维细节

MCP Dev Summit Toronto 于 2026-10-05~06 举行（Linux Foundation 主办），议程（Den Delimarsky 主旨演讲《MCP As The Agentic Substrate》、Angie Jones 开场）把 MCP 定位为「agentic substrate」。开源企业级 MCP Gateway & Registry 在窗口内连发两版：**1.32.0（10-04）** 引入「前置代理出口」（`EGRESS_FORWARD_PROXY_ENABLED`/`EGRESS_FORWARD_PROXY_CA_BUNDLE`，对企业前置代理网络开放受 SSRF 保护的出口，对携带密钥的请求只允许 https）、可配置注册表子域与额外 ingress 主机名，并新增环境变量 `SECURITY_BLOCK_ON_SCAN_FAILURE`（默认 true）与 `AWS_EC2_METADATA_DISABLED`；**1.32.1（10-06）** 修复前置代理为明文 HTTP 时 `proxy_ssl_context` 报错、把 `mcp` 依赖钉在 `<2.0`（因 MCP SDK 2.x 无兼容别名地重命名 `streamablehttp_client`）、去掉 otel-collector 的错误健康检查。仓库定位「企业级 MCP Gateway + Registry：集中 AI 开发工具、安全 OAuth、动态工具发现、对接 Keycloak/Entra」；快照 stars 963 / forks 243 / open_issues 132。连日修复说明 MCP 的「网关化」已从概念进入生产运维细节竞争。来源：[1.32.0](https://github.com/agentic-community/mcp-gateway-registry/releases/tags/1.32.0)、[1.32.1](https://github.com/agentic-community/mcp-gateway-registry/releases/tags/1.32.1)、[MCP Dev Summit Toronto](https://events.linuxfoundation.org/mcp-dev-summit-toronto/)、[MCP 2026-07-28 规范](https://blog.modelcontextprotocol.io/posts/2026-07-28/)（背景）。

### A2A：协议入口下沉到命令行

2026-10-01 官方发布 A2A CLI（命令名 `a2a`），定位「每个 A2A Agent 的统一命令行客户端」，基于 A2A Go SDK、讲 A2A Protocol v1.0；提供 `a2a card get`（发现 Agent Card）、发送消息、流式更新，并提供协议原生 JSON 输出与可预测退出码以嵌入 CI/流水线，同时可给编码助手当作工具。它填补两个缺口：非 Agent 系统（shell、定时任务、构建/测试、终端用户）接入 A2A，以及此前多语言社区 CLI「命名/参数/输出各异」的碎片化。仓库侧窗口内提交密集：#2283（10-02）引入 A2A CLI、#2285（10-06）改进站点 agent-readiness 信号，伙伴列表新增 Salt（10-02）与 MusedIn/Agent Commerce Gateway/ADEXTO（10-07），社区 SDK 新增 a2a-php。背景（非本周）：A2A 最新 release 为 v1.0.1（2026-05-28）、v1.0.0（2026-03-12）；Linux Foundation 口径（2026-04-09）显示支持组织 150+、核心仓 22,000+ stars、SDK 覆盖 5 种语言、AP2 支付协议 60+ 组织。协议入口下沉到「任何能跑命令的东西」，与 MCP 的网关/注册表一样都在降低接入摩擦、扩大网络效应。来源：[A2A CLI 发布](https://a2a-protocol.org/latest/blog/2026/10/01/introducing-a2a-cli/)、[a2a-cli](https://github.com/a2aproject/a2a-cli)、[a2a commits](https://github.com/a2aproject/a2a/commits)。

### Composio Instant：Agent 钱包与按用量结算

2026-10-07 发布的 Composio Instant 给 Agent 一个「自己的钱包」，可直接使用 100+ 付费工具而无需创建账号、复制 API key 或订阅；官方称已向 Agent 钱包充值超过 100 万美元供当天起消费。首批覆盖线索/联系人（Apollo、People Data Labs）、搜索与调研（Exa、Parallel）、视频生成（Higgsfield）、邮件验证（ZeroBounce）等，且只覆盖各 provider 的核心动作。计费为用多少付多少：新账号赠 $2，Pro 每月含 $29 额度。仓库横幅显示 Composio 已进入 ChatGPT Plugins Directory；官方博客口径为覆盖 1,500+ 应用、100+ 付费工具，月超 10 亿次 tool calls、用户超百万（厂商自披露，未独立核实）；快照 stars 30,464 / forks 4,846。这是工具层第一个把「Agent 自主付费」产品化的公开动作，把工具访问从「接得通」推进到「按用量结算」。来源：[Composio Instant](https://composio.dev/blog/composio-instant)、[composio releases](https://github.com/ComposioHQ/composio/releases)。

### 其他集成与工具运行时

- **AWS AgentCore Gateway**：10 月条目支持由私有 CA 签发的 TLS 证书用于 MCP server、OpenAPI 与 HTTP proxy（passthrough）目标；默认只信任公共 CA，现可注册 PEM 编码 CA 证书（存放于 S3 或 Secrets Manager）作为出站 TLS 信任锚，配合 Amazon VPC Lattice 私有端点直连。局限：该条目只标「October 2026」、未给具体日期，无法确证落在 10-01~10-07 内（日期限述）。来源：[AWS AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)。
- **Arcade（arcade-mcp）**：10-07 提交使组织要求强认证（MFA/passkey）时拒绝纯密码登录并返回 RFC 9470 `insufficient_user_authentication`，CLI 从「保存随后必然失败的 token」改为展示原因、登出被拒会话并提示重新登录（`arcade-core` 4.22.1、根包 1.16.2）；10-02 修复从工具 schema 丢失 TypedDict 字段描述的问题（`arcade-core` 4.22.0）。来源：[arcade-mcp commits](https://github.com/ArcadeAI/arcade-mcp/commits/main)。
- **Nango**：v0.71.12（10-02）新增 Azure Key Vault 作为 DEK 包裹 provider、Slack app 配置 token、Discord Bot，并修复 MCP 侧「保护凭据、确认破坏性操作」；10-06 Management MCP server 进入 Claude 的 connector 目录，同日宣布弃用 Connection MCP server、改推 scoped agent sessions，并记 9 月新增 49 个 API。来源：[Nango changelog](https://nango.dev/docs/updates/changelog)、[v0.71.12](https://github.com/NangoHQ/nango/releases/tag/v0.71.12)。
- **Pipedream Connect**：本周无窗口内新版本；官网口径为托管 3,000+ API 的 auth（长期口径，非本周）。
- **Google Agent Gateway** 与 **Microsoft Toolbox**：本周窗口内均无公开动态（Google 为 09-30 的 Cloud Trace 集成背景；Microsoft 的 Toolbox 文档为 2026-07/08 背景；仅见社区问答（2026-10-05）报「Toolbox 内 Skills 未被发现」，属用户问题、列观察）。

来源：[Google Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)、[Microsoft Toolbox](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview)、[Pipedream changelog](https://pipedream.com/docs/changelog)。

## 身份与权限：Agent 成为一等身份，MCP 网关被 IAM 厂商抢占

本周身份层最强信号是「第三方 IdP × 云厂 AgentCore」的委托模式落地。云厂自家 Identity 本周窗口内静默；生态侧（IAM 厂商 × MCP 网关）在抢标准。

### Okta：两步委托与 audience 边界

2026-10-02 Okta 与 AWS 联合发布文章，指出 AgentCore 只做入站 JWT 校验，出站工具调用的身份缺口需自行解决，并明确「简单转发用户 token 会失败」——OIDC token 是发给 Web 应用客户端的身份声明，不是给下游 resource server 的 bearer 凭据，转发等于让 MCP server 接受 audience 不符的 token、丧失边界。解法是两步委托：用 Cross-App Access（XAA）/ ID-JAG 换取带「用户 + Agent 双重归因」的短时 scoped token。文章给出两条拓扑：**Pattern A**（Agent 内用 Okta SDK 自查 XAA，改动少、密钥在 Agent 运行时）；**Pattern B**（AgentCore Gateway + AWS Lambda 拦截器集中换票，Agent 只需在允许的头里带用户 token，密钥材料放 AWS Secrets Manager 只给 Lambda 访问，策略集中可审计、无需重部署 Agent）。前提是 Agent 需在 Okta 中作为可治理身份存在（有 owner、凭据、资源访问策略），可从 AgentCore 通过 Okta Integration Network 的 AWS 应用自动导入。这是本周权限层最可操作的一手参考。背景（非本周）：XAA 已被纳入 MCP 作为授权扩展（Okta/Auth0 口径，2025-11-25）；XAA 早期采用者 25+，含 Anthropic、Cloudflare、Cursor、Keycloak、MintMCP、Scalekit、WorkOS、Zuplo 等。来源：[Okta 博文](https://www.okta.com/blog/ai/okta-amazon-bedrock-agentcore-security/)。

### WorkOS：把 MCP 网关收编进 IAM 品类

约 2026-10-02 WorkOS 发布 MCP 网关对比，以「Status (Oct 1, 2026)」为基准给出四家定位：Cloudflare MCP server portals（2026-09-24 GA，Cloudflare Access OAuth/服务 token，Code Mode 折叠工具以控上下文，Logpush 出 SIEM）；Okta Agent Gateway（Q3 计划 GA，Okta 签发 token、Agent 注册为身份、XAA/代办同意、逐工具调用策略与审计链）；Auth0 Agent Gateway（2026-09-18 beta，面向多租户 SaaS，短时 token 只在网关有效、Token Vault + token exchange）；Microsoft Entra MCP firewall（自 8 月 public preview，走 Global Secure Access 网络路径，按 server/method/tool/protocol version 允许或阻断，Generative AI Insights 进 Sentinel）。文章同时强调「网关不替代 MCP server 自身的授权」。一篇文章把「MCP 网关」从工具网关话题收编进身份/治理品类，标志 IAM 厂商正主动抢 MCP 身份层。来源：[WorkOS 对比](https://workos.com/blog/mcp-gateways-compared)、[Auth0 Agent Gateway](https://auth0.com/blog/auth0-agent-gateway-beta/)（背景）。

### 云厂自家 Identity 与集成层的权限动作

- **AWS AgentCore Identity**：本周无新发布；最近一次为 2026-09-01 的托管同意门户（Consent Portal），消除自建 OAuth callback 的负担；其需以配 JWT 入站认证的 AgentCore Gateway 为源、IdP 许可 scope 含 `openid`（背景）。本周相关可读信号来自 Okta 的第三方分析。
- **Microsoft Entra Agent ID**：本周无公开动态。既有能力为背景：Entra Agent ID 为 Agent 建立目录内一等身份（agent identity blueprint），Foundry 侧把每个 Agent 自动注册进目录、受 Conditional Access 治理；文档集中于 2026-06~08。Copilot Studio 自 2026-07 起为每个新 Agent 自动创建 Entra Agent ID。
- **Google Agent Identity / Agent Gateway**：本周无公开动态（10 月条目均为 CodeMender 与 Nano Banana）；最近相关为 2026-09-30 的 Agent Gateway 集成 Cloud Trace（Preview，背景）。
- **其他**：Auth0、Cloudflare 的强信号发生在 9 月（背景）；Permit.io、Descope、Clerk 本次未取得窗口内日期明确的发布。

权限专项观察：行业正收敛到「短时、IdP 中介、作用域化、可审计」的 token（XAA/ID-JAG、OAuth 2.1、token vault、scoped agent sessions），静态 API key 与静默长期授权被明确列为反模式。云厂自家 Identity 本周静默、生态侧在抢标准，说明权限正从「有没有 key」升级为「以谁的身份、花多少、能否审计」。

来源：[AWS what's-new 2026-09](https://aws.amazon.com/about-aws/whats-new/2026/09/amazon-bedrock-agentcore/)、[Entra Agent ID](https://learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id)（背景）、[Google Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)。

## 记忆与上下文：检索精度与治理同时下沉

本周关键词是「工程化收口 + 商业模式上移」：开源 Context DB 用检索、时序、权限加固推向可生产化，头部项目把「库」包装成「记忆 API / context 服务」。

### OpenViking：召回重写与 ACL/OIDC 治理

v0.4.23（2026-10-02）是路线级修正：检索层改为单次全局向量召回 + 统一 rerank，移除目录递归与父级分数传播、阈值在 rerank 后应用，移除热度加权与 `retrieval.hotness_alpha`，`find`/`search` 新增事件时间衰减参数 `events_time_decay_protection`，`search` 新增 `search_type="keywords"` BM25 检索。治理侧新增 MCP 工具 `list_users`/`list_groups`/`get_acl`/`set_acl`，`write`/`add_resource` 支持 `acl` 参数；账号变更缺注册表基线时拒绝写入；`ovcli.conf` 接受 `oidc_token`。记忆整理支持 `ov compile --skill memory` 就地去重/合并/规范化；`reindex` 迁移到 RFV planner、新增 `force` 参数并支持异步可恢复。窗口内 commits 另有 context-gateway（把 OpenViking memory 带回任意 API-key 客户端，10-06）、Codex 插件 usage summary、ov-usage 来源卡片与 10-05 的 Hermes Quick Local 本地嵌入。兼容性：`memory.session_auto_commit` 的 `default_enabled`/`idle_enabled` 合并为 `enabled`（默认 false）；检索评分与排序相对 v0.4.22 会变化，用 `score_threshold` 的调用方需重校准；带无效 API key 访问 `/health` 由匿名 200 改为认证错误。快照 stars 39,366。含义：把召回从「层级递归」改为「全局召回 + 统一 rerank」直接决定 Context DB 的精度天花板；一次放开 ACL + OIDC 是在补企业治理短板。来源：[OpenViking v0.4.23](https://github.com/volcengine/OpenViking/releases/tag/v0.4.23)。

### Cognee：时序检索边界与权限收紧

v1.6.3（2026-10-07，主题 "Better Temporal Search & Retrieval Accuracy"）：时间窗 `since X`/`until X` 现包含边界日并修正 off-by-one，日期锚点按与窗口的紧密度排序、扩大候选池提升边界召回；自然语言检索不再跑 "turn analysis"。权限收敛：agent 不能再创建嵌套 agent，`create_agent` 拒绝 nested agents，父账号可正确访问其 agent 数据集，公开注册不接受 `parent`。破坏性变更：移除 `temporal_cognify` 配置项、DLT 依赖钉在 `<1.31`、移除日志中的 "extraction reason"。快照 stars 31,562。时序检索是 agent memory 相对纯向量 RAG 的差异化卖点，把「时间窗边界正确性」当版本主题，说明记忆层竞争已从「能存」进入「时间语义准不准」；禁止 agent 自我复制式建 agent 是安全边界的实质收紧。来源：[Cognee v1.6.3](https://github.com/topoteretes/cognee/releases/tag/v1.6.3)。

### 从开源库到托管 Context 服务

- **supermemory**：窗口内 commits 密集，核心是 v5 API 全面迁移——10-06 补全 versioned V5 API reference 与 V3/V4→V5 migration guide，分页默认值、`attach` 改名 `include`、`search` 的 `isInference`、namespace 分页等；并发布 `@supermemory/tools` 3.0（基于 v5 API）且退役 `@supermemory/ai-sdk`（breaking）；10-01 为 LiveKit Agents 增加持久记忆；本周另升级 Better Auth 修补版、在文档披露自托管安全与 telemetry 行为、把 MCP 的 out-of-credits 错误从 error rate 中剔除，并保留旧 snake_case 工具名作 deprecated 别名。一周内完成 API 大版本切换并同步退役旧 SDK，是「Memory API 服务化」的典型动作；接入 LiveKit（实时语音 agent）说明记忆层正向实时会话延伸。来源：[supermemory commits](https://github.com/supermemoryai/supermemory/commits/main)。
- **Firecrawl**：窗口内无新 release，但 commits 集中在把爬取接入 agent 会话与扩展检索品类——10-06 一次性为 Elixir/PHP/Rust/Go/Ruby/Java 等 SDK 增补 agent exchange、`thread_id`、`mode` 选项，并暴露 `get_agent_thread`；10-06 新增 `search` 接受 `gov` 品类并迁端点至 `/search/gov`；10-06 给反馈加 20 分钟窗口并按反馈退回 1 credit。agent exchange + threadId 意味着一次性抓取 API 正升级为「有会话记忆的抓取 agent」，抓取结果可挂到 agent 长期线程，直接与记忆层竞争「外部知识入口」。来源：[Firecrawl commits](https://github.com/firecrawl/firecrawl/commit/1bf1215)。
- **Crawl4AI**：窗口内无新 tag，但 10-05 在 main 分支完成「cloud launch」软启动，README 与 banner 写入“free credit to start, no amount and no end date”（给免费额度、不公布金额与截止日）。这个高热开源爬虫项目开始转向「托管云服务 + 免费额度获客」的商业模式。快照 stars 84,918。来源：[Crawl4AI cloud launch commit](https://github.com/unclecode/crawl4ai/commit/8afd0a6)。

### 维护周与静默项

- **Mem0**：窗口内无新 release（最新 v2.2.1 发布于 2026-09-25），工作集中在安全加固与文档一致性——10-05 解决 13 个 Vanta HIGH Dependabot 漏洞、10-01 解决 7 个 Vanta MEDIUM 漏洞、10-07 停止把 GoogleMatchingEngine service account 私钥写进 DEBUG 日志。快照 stars 66,778。通用记忆层的安全面（凭证、日志、依赖）正成为企业评估门槛，评价应写「维护周」而非趋势信号。
- **Zep / Graphiti**：窗口内无新 tag，但 10-06 引入 `LLMRuntime`（PR #1778）用于 prompt 与模型路由，把「用哪个模型/prompt 做图谱抽取」抽象成可配置运行时，是 memory 引擎的模型层解耦。窗口内另有安全公告升级（urllib3/tornado/jupyterlab/fsspec/langgraph/multidict）与 FalkorDB 6.x 全文索引的 DDL 修复；多条 commit 为 CLA 签名机器人记录、不构成功能动态。快照 stars 31,529。
- **Letta**：本周完全静默（窗口内 commits 为空，pushed_at 2026-09-10，最新 release 0.16.8 为 2026-05-14）。不能据此判断项目停滞，本期结论只写「静默 + 近两周无公开增量」。
- **观察池**：LightRAG、Microsoft GraphRAG 窗口内 commits 均为空集；LlamaIndex 最新 release 为 2026-09-21；Onyx/Haystack/Jina/Unstructured 与向量库的 agent memory 产品化本次未逐一直查，列观察。`rohitg00/agentmemory`（stars 29,217、窗口内有 push）非本期基线对象，仅列热度观察。

来源：[Mem0 commits](https://github.com/mem0ai/mem0/commits/main)、[Graphiti LLMRuntime](https://github.com/getzep/graphiti/commit/689de29)、[Letta releases](https://github.com/letta-ai/letta/releases)。

## 可观测与评测：评测对象从输出转向决策过程

商用开源平台本周密集发版：Langfuse 连发 v4.52.0/v4.53.0/v4.54.0（10-06~10-07），Arize Phoenix 发 v20.17.0/v20.18.0/v20.19.0（09-30~10-01），Braintrust 发 3.36.0/3.37.0/3.37.1（10-01~10-07）——评测与追踪平台进入周级迭代的竞争节奏。

### Langfuse：评测、治理与数据基础设施三线推进

3 天内连发 v4.52.0/v4.53.0（10-06）与 v4.54.0（10-07）。v4.54.0 要点：把 trace 按桶分类、新增外部媒体存储集成、experiment-item/prompt-event 读取走 query AST、session 视图改用 trace transcripts、跟踪用户可见错误 toast。commits 另见：`feat(evals)` 支持 OpenAI decision models、`feat(scores)` 让 `POST /scores` 支持批量处理、`feat(rbac)` API-key 授权改由 SystemRoleAssignments 解析、`feat(skills)` 对比已保存版本与草稿、ingestion 遇 S3 限流返回 503+Retry-After、修「无企业许可时仍应用数据保留」与 audit log entitlement 门控。快照 stars 35,495。在评测、治理、数据基础设施三条线同时推进，是最活跃的开源可观测平台；decision models 支持意味着评测开始覆盖 agent 的决策选择而非仅输出打分。来源：[Langfuse v4.54.0](https://github.com/langfuse/langfuse/releases/tag/v4.54.0)。

### Arize Phoenix：把「决策」建成一等 span

窗口内连发 v20.17.0/v20.18.0（09-30）、v20.19.0（10-01）。v20.19.0 两个 feature：datagen 让每个被记录的应用进入独立 project；tracing 在全平台新增 **DECISION span kind**。窗口内 commits 另见：perf(pxi) 把数据问题路由到 analytics SQL、feat(mcp) 新增 GraphQL schema/query/mutation 工具、PXI 的 MCP code mode 可配置以跑 Harbor benchmarks、refactor(evals) 把 TRAIL 度量改名 turn_count/tool_count、docs(tracing) 记录 decision models 与 OpenAI Decisions API、experiments 对比网格加入 metric charts。快照 stars 11,744。DECISION span kind 是全行业首批把「agent 的决策」建模为可观测一等 span 的落地之一，与 Langfuse 的 OpenAI decision models 形成跨平台共振，标志 eval 从「输出对不对」转向「决策过程可解释」；让 PXI 通过 MCP 读图数据自诊断，是可观测平台自身 agent 化的前哨。来源：[Phoenix v20.19.0](https://github.com/Arize-ai/phoenix/releases/tag/arize-phoenix-v20.19.0)。

### 接入层迭代与静默项

- **LangSmith**：开源 SDK 窗口内发 v0.14.3（10-01）、v0.14.4（10-02），JS 0.10.7/0.10.8 同步。改动偏接入正确性与协议对齐——修正完整 OTLP traces endpoint 解析、把 agent addressing 改为 typed address object、将 OTel 的 prompt/completion 导出为 JSON 字符串、在返回的 ReadableStream 出错时结束被追踪 run。平台本体闭源，本周只有 SDK/接入层证据（另有 CI freeze guard 表明部分目录已拆到独立仓库）；typed address 与 OTel JSON 导出是「让 tracing 数据标准化、可跨平台搬运」的动作。来源：[LangSmith v0.14.4](https://github.com/langchain-ai/langsmith-sdk/releases/tag/v0.14.4)。
- **Braintrust**：开源 SDK 连发 3.36.0（10-01）、3.37.0（10-05）、3.37.1（10-07）；最新 3.37.1 仅一条 patch，支持 Vite 8 依赖优化。平台本体闭源，本周为维护型发版。来源：[Braintrust 3.37.1](https://github.com/braintrustdata/braintrust-sdk/releases/tag/braintrust@3.37.1)。
- **静默/受限**：Helicone 窗口内 commits 返回空集（releases 最新为 2025-08-21）；AgentOps 窗口内 commits 为空集、仓库自 2026-06-25 起无 push（stars 5,887）；Coze Loop 窗口内 commits 为空集、pushed_at 与 commits 空返回冲突，本项目入口未能证明窗口内有实质 commit。均只记「本次未取得窗口内动态」，不作停滞或衰退结论。
- **标准与云厂**：OpenTelemetry for Agents 本期未取得窗口内一手动态，其 GenAI 语义约定截至 2026-05 仍处 Development（背景）；云厂 observability/eval（CloudWatch Omni 09-22/23、AgentCore Evaluations 03-31、Foundry Build 2026）均为背景，本期窗口内未命中一手发布。云厂把基础可观测内嵌商品化，迫使独立平台向「跨云中立 + 开源自托管 + 决策级 eval」上移。

来源：[Helicone commits](https://github.com/Helicone/helicone/commits/main)、[AgentOps](https://github.com/AgentOps-AI/agentops)、[OTel GenAI semconv](https://opentelemetry.io/docs/specs/semconv/gen-ai/)。

## 云厂控制面：边缘补齐与 Harness 收编

云厂矩阵本周增量集中在「边缘能力补齐」，而非新平台；AWS 把 OpenAI Agents API 收编为 AWS-native 是最强信号。

### AWS：私有 PKI、企业网络边界与 Harness 收编

2026-10 AgentCore 的窗口内条目是 Gateway 私有 CA 支持（见工具一节）。近两周背景（2026-09）：Harness 支持 WebSocket 交互式 shell（同一隔离 microVM 会话内保持环境变量/工作目录/历史/进程，可重连回放至多 256KB、单会话最多 10 个 shell）；支持自定义 OpenAI 兼容端点（`apiBase`）；支持 lifecycle hooks（`before_invocation`/`before_tool_call`/`after_tool_call`/`after_invocation`，Lambda 同步 allow/deny，SNS/EventBridge 非阻塞通知）；Evaluations 增加 TypeScript 框架支持（Strands、LangGraph、OpenAI Agents、Vercel AI SDK）；Consent Portal for AgentCore Identity。10-05 周报重申 Bedrock Managed Agents powered by OpenAI（基于定制版 OpenAI Agents API、AWS-native、可跑在 AgentCore Runtime；原始发布在 2026-09，属背景）。背景（非本周）：Agent Registry 于 2026-08 GA，Memory 直写长记忆与 PrivateLink 于 8 月上线。AWS 在把企业网络边界（私有 CA/VPC Lattice）与身份同意做成 Agent 平台原语，并把 OpenAI Agents API 收编为 AWS-native，等于在 Harness 层对模型厂进行「反向整合」，议价权向掌握身份与治理的云厂倾斜。来源：[AWS AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)、[AWS 周报 10-05](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-amazon-bedrock-managed-agents-powered-by-openai-q3-service-availability-updates-kiro-workflows-and-more-october-5-2026/)。

### Google：发布节奏在安全 Agent 与模型

Vertex AI 已 2026-04 rebrand 为 Gemini Enterprise Agent Platform（背景）。窗口内（10-05~10-07）条目为 CodeMender v0.12.0（10-05）/v0.13.0（10-07）——安全 Agent CLI（`cm`），新增隐藏文件扫描 `--include-hidden`、文件大小上限 500KB→2MiB、并发扫描状态可靠性、非可重试错误立即失败、Ctrl+C 中断时干净保存会话状态；以及 Gemini Nano Banana 2.1 GA（10-06）——高速多模态图像生成/编辑，1K/2K/4K 输出。治理能力（Agent Gateway + Cloud Trace 可观测、语义治理策略自定义拒绝消息最长 1000 字符、App Topology API GA）均在 9 月底落地；同期 09-24 Gemini 3.8 Live GA 与 Meta Muse Spark 1.3 Preview（背景）。Google 的企业控制面主线是「可观测 + 可治理 + 拓扑可视化」，而非 Harness 运行时。来源：[Google Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)。

### Microsoft 与 Databricks

- **Microsoft Foundry / Copilot Studio / M365 Agent SDK**：本周未取得窗口内发布。近两周背景：2026-09-24 Foundry「Routines」GA，把监控工作、响应业务事件、跨时间持续任务从自建 scheduler/event listener/webhook/queue/run history 抽象为托管能力；2026-09-15 Foundry Dev Pack；2026-08/09 文档新增 Hosted Agent 预览能力（long-running agent 状态管理、崩溃恢复、human-in-the-loop 审批、steerable agent、stream with reconnect、private skill catalog、toolbox 网络隔离、BYO registry）；自 2026-07-01 起 Copilot Studio 与 Foundry Agent 的 AI 安全能力需 Microsoft Agent 365。微软把「长期运行 + 事件驱动 + 人审 + 恢复」做进 Foundry 平台，以 Entra Agent ID 把身份收进企业管理体系。来源：[Foundry 博客](https://devblogs.microsoft.com/foundry/)、[Foundry what's new](https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry)。
- **Databricks**：2026-10 发布说明窗口内条目含 Agent Bricks 面向代码优先 Agent 开发的文档、Genie Code CLI（Beta，10-06，终端内编码 Agent）、DeepSeek V4.1 Flash 支持 priority pay-per-token 与预留吞吐（10-07）、Metric view window measures GA（10-06）、Google Workspace connector Beta（10-09，窗口外）。其控制面围绕「治理数据（Unity Catalog）+ Agent Runtime + MLflow 追踪评测 + MCP」，差异化在治理而非 Harness 本身。来源：[Databricks 2026-10 release notes](https://docs.databricks.com/aws/en/release-notes/product/2026/october)。

### 中国云厂：窗口内无平台级一手发布

阿里云百炼、火山引擎 Ark 与 Coze、腾讯云 ADP 本周均未取得窗口内平台控制面的一手发布，可见的动作多在商业化与交付侧。近两周背景：阿里云百炼应用侧最近一批更新为 2026-09-24 的高代码应用与 2026-09-23 的 Dify 工作流导入/文件问答升级；模型下线执行日为 2026-10-10（公告早于窗口）。火山方舟 Agent Plan 文档更新于 2026-09-29，提供订阅式套餐并称新增「专属 Harness」、采用积分计费——即云厂把 Harness 作为套餐卖点，与 AWS 的逻辑一致；ArkClaw（云上 SaaS 版 OpenClaw，2026-03-09 上线，背景）说明云厂已在做「OpenClaw 类 Agent OS 的 SaaS 化」。腾讯云 ADP 窗口内可见的是 FDE（前沿部署工程师）认证活动（2026-09-11~10-31，覆盖本周）与新客套餐赠 100 元 PU；官网列出华润信托、伊利（点击率 +15.7%、订单 +26%、需求识别准确率 93%、转化率 +39%）、德邦快递等客户案例（均为官方披露口径，未独立核实）。腾讯云的信号在「交付能力标准化」，反映企业 Agent 落地瓶颈已从「能不能搭」转向「能不能交付与运维」。来源：[百炼应用动态](https://help.aliyun.com/zh/model-studio/application-release-notes)、[火山 Agent Plan](https://www.volcengine.com/docs/ark/agent-plan-personal-plan-overview)、[腾讯云 ADP](https://cloud.tencent.com/product/adp)。

## 云厂能力矩阵（第 16 期权证快照）

数据为 2026-10-08 取证快照；无证据单元写「未取得」，不编造。矩阵 7 行齐全：AWS / Google / Microsoft / 阿里云 / 火山·字节 / 腾讯云 / Databricks。

| 平台 | Runtime / Session | Memory / Context | Gateway / Tools | Identity / Auth | Sandbox / Browser / Code | Observability / Eval | 本周强信号 |
|---|---|---|---|---|---|---|---|
| AWS | AgentCore Runtime（会话 + 可配置存储）；Harness 交互式 shell（2026-09，背景）；Instances 持久会话最长 14 天（2026-08，背景） | AgentCore Memory（含 episodic memory，2025-12 re:Invent，背景） | AgentCore Gateway（MCP/OpenAPI/HTTP proxy 目标；**2026-10 私有 CA 支持**） | AgentCore Identity + Consent Portal（2026-09，背景） | AgentCore Browser / Code Interpreter（背景，本期未取证窗口细节；ActiveSessionCount 指标 2026-08） | AgentCore Evaluations（含 TypeScript 框架，2026-09 背景） | **Gateway 私有 CA（2026-10）**；Bedrock Managed Agents powered by OpenAI（10-05 重申，发布在 09） |
| Google | Gemini Enterprise Agent Platform（原 Vertex AI，2026-04 rebrand）；Agent Engine；sandbox pause/秒级恢复（2026-09-09，背景） | 未取得（本期未取证 Memory Bank 具体条目） | Agent Gateway（2026-09-30 集成 Cloud Trace，背景）+ MCP server 支持 | 语义治理策略 / 自定义拒绝消息（2026-09-29，背景）；Agent Identity API（06 月，背景） | CodeMender 安全 Agent CLI（**2026-10-05/10-07**，v0.12/v0.13）；Computer Use/Shell sandbox GA（09-09，背景） | Agent Gateway + Cloud Trace（09-30）+ App Topology API GA（09-30） | CodeMender v0.12/v0.13（10-05/10-07）、Nano Banana 2.1 GA（10-06） |
| Microsoft | Foundry Hosted Agents / 长时运行 Agent（preview，2026-08/09 文档，背景）；Routines GA（09-24，背景） | Foundry Agent Service memory（程序性/用户/会话，2026 背景） | Foundry Toolboxes（背景）；MCP 兼容端点 | Entra Agent ID（每新 Agent 自动创建，2026-07 背景）；Agent 365 | Playwright Workspaces（概览 2026-09-15，背景）/ Code Interpreter（8 月文档，背景） | Foundry 可观测与评测（Build 2026，背景，未本期取证窗口细节） | 无（本周未取得窗口动态） |
| 阿里云 | 百炼智能体/工作流应用（异步运行模式，2026-01 背景） | 长期记忆 & 用户画像 API（2026-01-31 背景） | MCP 外部调用（2025-08 背景） | 未取得 | 高代码应用（Python 后端部署，2026-09-24 背景） | 新版应用评测（2026-02 背景） | 无（模型下线执行日 2026-10-10，公告早于窗口） |
| 火山 / 字节 | Agent Plan 专属 Harness；ArkClaw（SaaS 版 OpenClaw，2026-03 背景） | 未取得（本模块未取证；OpenViking 见「记忆与上下文」一节） | 未取得 | 未取得 | 未取得 | Coze Loop（开源，2025-07 背景） | 无（Agent Plan 文档 09-29 属背景） |
| 腾讯云 | ADP 智能体运行环境（断点续跑/闲置暂停/密钥隔离托管，官网口径） | 变量与记忆（长期记忆 SYS.Memory，2025-08 背景） | 未取得（本期未取证 MCP gateway 细节） | 平台端用户权限 / 企业空间（2025-08 背景） | CloudBase AI Toolkit（未本期取证） | 全链路 Trace（官网口径）+ 应用评测（2025-08 背景） | FDE 认证活动期（2026-09-11~10-31，覆盖本周） |
| Databricks | Agent Bricks Agent Runtime（code-first 文档，2026-10） | 未取得（本期未取证 Agent memory 细节） | Unity Gateway + 自定义 MCP server（2026-09 背景） | Unity Catalog 治理 + OAuth（Google Workspace connector 用 OAuth，10-09 窗口外） | Genie Code CLI（**2026-10-06**，Beta） | MLflow trace storage in Unity Catalog（2026-09 背景）+ built-in eval | Agent Bricks code-first 文档 + Genie Code CLI（10-06） |

说明：表中「（背景，非本周）」单元格为维持平台画像完整性而保留的存量能力，不作为本周动态；标「未取得」的单元格表示本期取证未取到对应证据（未查询到 ≠ 不存在）。火山·字节行的 Memory/Context 列写「未取得」指本模块口径下未取证；其旗下 OpenViking 记忆引擎本周动态见「记忆与上下文」一节，两者不矛盾。跨模块提示：Gateway 私有 CA 在「工具与协议」（信任链）与「云厂控制面」（网络边界）两处共享同一证据，属双重归属。

## 价值链位置：价值与议价落在哪一段

沿价值链分段：模型与算法 → 上下文/记忆层 → 运行时/Harness → 协议与工具 → 平台与工具链 → 集成交付。本周各段的位置与议价变化：

- **控制层/Harness**：处「运行时/Harness」段，向上被模型厂 SDK 吸收执行能力（Anthropic），向下被云厂以 Runtime + 身份打包（AWS/火山），中间层价值重归「长时运行可靠性与运维体验」。
- **执行环境**：卡在「运行时」与「平台」之间，本周由托管专业厂商（Modal）向上吸收「有状态会话」与「凭据隔离」价值，中间层（纯沙箱）差异化空间被压缩。
- **工具/协议**：处「协议与工具生态」段，价值从「协议规范」转向「网关治理 + 用量结算」；A2A CLI 把非 Agent 端纳入网络。
- **身份/权限**：处「平台与工具链」的治理组件，IAM 厂商 × MCP 网关在抢标准，与云厂自家 Identity 形成竞争。
- **记忆/上下文**：处「模型→上下文层→Harness」中游，向上一段买模型/嵌入/推理，向下一段卖「可检索、可治理的长期上下文」；本周价值落点在检索精度（OpenViking 全局召回 + rerank、Cognee 时序边界）与治理（ACL/OIDC/反自我复制）。初始商品化信号已现：OpenViking 打通火山 Service 入口、Crawl4AI 软启动 cloud + 免费额度、supermemory v5 API 服务化——记忆正从开源库被包装为带免费额度的托管 Context 服务，纯开源库面临被商品化压力，护城河转向企业治理与检索质量。
- **可观测/评测**：横跨 Harness 与平台层，属「平台与工具链」中的治理组件；向运行时买 trace/eval 数据、向企业卖「敢上生产的可信度」。本周价值落点在决策级评测（decision models/DECISION span）与企业治理（RBAC/audit）；云厂把基础 trace/eval 内嵌商品化（背景），迫使独立平台向「跨云中立 + 开源自托管 + 决策级 eval」上移。
- **位置待明确项**：Firecrawl/Crawl4AI 的摄取层究竟独立成段还是被记忆层/runtime 吸收——本周出现「摄取 + 会话记忆合流」信号（Firecrawl agent exchange/threadId），趋势方向明确但归属未定，标「位置待明确」。

## 解决方案透镜：六个案例的五要素

以「怎么搭的 / 交付给谁 / 什么代价 / 踩了什么坑 / 能否复制」五项拆解本周有落地证据的方案。未披露项如实标注。

### Modal：真机 + 旁车

- **怎么搭的**：serverless 平台把 VM 级 Linux 环境与会话粘滞做成原语；agent 生成代码跑主 Sandbox，凭据/代理/harness 逻辑跑同一 host 但隔离级别等同独立 sandbox 的 Sidecar，两地本地通信。
- **交付给谁**：需要完整 OS/内核的编码与评测团队（Linear/Legora/Snorkel）、需实时路由的语音等场景；集群面向大模型服务/训练（Decagon/1x/Runway）。
- **什么代价**：Sidecar 仍为 Beta（此前 public alpha）；需接受 serverless 厂商的运行时生态约束（未披露定价细节）。
- **踩了什么坑**：未披露（官方未公开迁移/踩坑细节）。
- **能否复制**：「同 host 旁车 + 隔离边界」模式可复制（自建时以进程/容器分区 + 本地 gRPC）；「真机保真」需底层虚拟化能力，自建门槛高。

### 开源 MCP Gateway/Registry：网关 + 注册表

- **怎么搭的**：集中 AI 开发工具的网关，安全 OAuth、动态工具发现，对接 Keycloak/Entra；前置代理出口受 SSRF 保护、带密钥请求仅 https；依赖钉 `mcp<2.0` 兼容。
- **交付给谁**：企业平台团队（自托管、需统一工具治理）。
- **什么代价**：需运维 Keycloak/Entra 与出口代理；GitHub open_issues 132（快照）。
- **踩了什么坑**：MCP SDK 2.x 无兼容别名地重命名 `streamablehttp_client` 导致需钉版；前置代理为明文 HTTP 时 `proxy_ssl_context` 报错；otel-collector 健康检查错误。
- **能否复制**：可复制（开源可自托管）；关键在「网关统一入口 + 注册表发现 + OAuth」三件套。

### Okta + AgentCore：两步委托换票

- **怎么搭的**：Pattern A（Agent 内用 Okta SDK 查 XAA）或 Pattern B（AgentCore Gateway + AWS Lambda 拦截器集中换票，密钥放 Secrets Manager 只给 Lambda）；Agent 在 Okta 建为可治理身份。
- **交付给谁**：需让 Agent 代表用户访问下游 MCP/工具的企业。
- **什么代价**：需 Okta 与 AWS 双栈；Pattern B 需维护 Gateway/Lambda/Secrets 链路（未披露成本）。
- **踩了什么坑**：直接转发用户 OIDC token 会因 audience 不匹配而失败——必须换带「用户 + Agent 双重归因」的短时 scoped token。
- **能否复制**：可复制（任何 IdP + 网关拦截器架构同构）；关键是密钥落点与归因传递。

### Composio Instant：Agent 钱包

- **怎么搭的**：托管 auth（1,500+ 应用）上加「按调用付费」额度，预充值池供 Agent 直接调用 100+ 付费工具，无需建账号/key/订阅。
- **交付给谁**：想让 Agent 自主调用付费 API 的开发者与小团队。
- **什么代价**：用多少付多少（新赠 $2 / Pro $29 每月）；依赖厂商托管凭据与计费。
- **踩了什么坑**：未披露（官方未公开试点细节）。
- **能否复制**：需预付款/计费治理与多 provider 结算能力，自建难度高；但「预算 + 审计钩子」思路可借鉴到自建工具授权层。

### E2B / 浏览器与代码沙箱：生产可靠性

- **怎么搭的**：托管 code-interpreter sandbox SDK；本周修复重试语义与 watch 生命周期。
- **交付给谁**：需要跑不可信代码的 agent 应用。
- **什么代价**：按版本升级（非幂等调用需改代码）；stars 14,220 属小体量。
- **踩了什么坑（可复制避坑）**：sandbox 创建/fork/snapshot 类 POST 遇 502 不得盲重试（会重复创建）；secret 更新不得重放；JS SDK `WatchHandle.stop()` 语义需与 Python 对齐。
- **能否复制**：可靠性规则可直接照搬到任何自建沙箱编排（区分幂等/非幂等、生命周期语义一致）。

### OpenClaw：自托管 Agent OS 的 runtime 演进

- **怎么搭的**：开放控制层 + 本地/自托管 + 多框架（Codex/MCP/插件）；session/state 持久化改异步 await，跨 workspace/迁移语义加固。
- **交付给谁**：希望自托管、多框架、可自控的团队（对比云厂托管身份）。
- **什么代价**：需跟随插件 API 弃用迁移（多条 10-01/10-02 起告警）。
- **踩了什么坑**：过期远程执行审批污染 auth profile、跨 registry usage 丢失、transcript 别名卡住活跃 turn（均为官方 release notes 披露的已修项）。
- **能否复制**：模式可复制（异步持久化 + canonical state handles + 有界批次迁移）；是「长时运行 Agent OS」的现实参考实现。

## OpenClaw 战略参照

对照本周信号，OpenClaw 作为自托管 Agent OS 的定位如下。

**领先点**

1. 开放控制层 + 本地/自托管 + 多框架（Codex/MCP/插件）。本周云厂把 Harness 收编为 SKU（AWS Managed Agents powered by OpenAI、火山 Agent Plan 专属 Harness），身份与治理在地下；OpenClaw 的自托管与开放编排是差异化护城河。
2. session/state 持久化的异步化与迁移语义已主动推进：本周以弃用告警驱动插件生态转向异步持久化，与 Microsoft Foundry 8 月「长时 agent 韧性/恢复/转向」文档体系同题，说明 OpenClaw 在最核心的「长时运行不掉线」命题上与一线平台同代。

**补课点**

3. 浏览器/计算机执行工具与网络策略：Anthropic SDK 已以 toolset 定义 browser/computer use 并施加 `allowed_hosts`；OpenClaw 本周无同类发布。可对齐 SDK toolset 语义并接入 Browserbase/E2B/Daytona 伙伴，而非自研浏览器栈。
4. 身份/授权与工具预算：Okta 的 Pattern B（网关 + 拦截器集中换票）与 Composio Instant（Agent 钱包）提示工具授权层需支持「以谁的身份、花多少、能否审计」。可引入可插拔的 token 交换钩子与预算/计费/审计接口。

**可借鉴**

5. 旁车信任边界：Modal Sidecars 把凭据/代理/harness 逻辑放到 agent 无法直接访问的容器；OpenClaw 的凭据/代理/工具运行时亦可采用同构分区。
6. 网关 + 注册表双层结构：开源 MCP Gateway/Registry 的 OAuth、动态工具发现、出口安全与工具级审计已标准化；OpenClaw 的 plugin/tool runtime 可对标。
7. 可观测基准线与决策级评测：Browserbase 内置零插桩 session replay + 结构化日志是浏览器 agent 的现实基准线；Langfuse/Phoenix 把「决策过程」建模为可观测对象。可把 Agent 拓扑与网关级 trace、决策级 span 作为可观测治理的一等公民。
8. 风险参照：云厂身份/治理护城河——AWS Consent Portal/私有 CA、Entra Agent ID、Google IAP/Access 均已成体系；若走企业路线，身份与可观测治理是必补项。

## 覆盖与缺口：本次未取得与不确定项

本期覆盖 8 个模块与 7 家平台，矩阵 7 行齐全、无空缺行；单元级缺口以「未取得」标注。以下为影响判断的主要缺口与不确定项，供评估证据强度时参考。

**取证范围与方式**：9 个方向的 GitHub/Web 热度补漏，加上 8 个模块的逐对象核对；已读一手入口包括 GitHub releases API、OpenClaw 文档站、Claude 发布说明与 browser-use SDK 文档、OpenAI API changelog、AWS/Google/Microsoft/Databricks 官方发布说明与博客。云厂发布说明按月/周聚合、无逐条日期；中文云厂动态页分散或动态渲染，多处抽取失败或仅得旧页。

**风险导向抽查项**

1. 日期归属风险：AWS AgentCore「Gateway 私有 CA」仅标「October 2026」无具体日，存在落在 10-08 的可能，按事实保留并标「日期限述/归属待明确」，不当作窗内确定条目。
2. 聚合文当一手风险：各平台的对比与导购文、awesome-* 榜单一律不作已读来源，仅作线索。
3. 自披露风险：Composio（月 10 亿 tool calls、百万用户）、Pipedream（3,000+ API）、腾讯云客户案例（伊利数据）均为厂商自披露，未独立核实，不据以推导市场结论。
4. 静默误判风险：部分项目主仓 commits 为空或发版渠道不在主仓，只记「本次未取得窗口内动态」，不作停滞或衰退结论。
5. 冲突/不确定保留：OpenAI ChatGPT 周报（9/28–10/2）单条日期不可核，未作窗内一手主张；Daytona 已转闭源、公开仓停更；MCP 规范讨论 #804 发布于 2025-07-01（非本期）。

**主要缺口（未查询到 ≠ 不存在）**

- 控制层：OpenAI Agents SDK 本体、Microsoft Agent Framework 本体、LangSmith、CrewAI AMP/Studio与 Dify/n8n/Flowise 等应用层工作流平台本周未取得窗内独立发布；MCP 本体最近规范为 2026-07-28（背景）。
- 执行层：云厂 Agent Runtime 与浏览器/代码沙箱本周均无窗内一手发布；AWS/Azure/Google 发布说明按月聚合、无逐条日期。
- 工具与身份：云厂自家 Identity 本周静默；动态池中 Auth0/Cloudflare/Permit.io/Descope/Clerk 无窗内已确证发布。
- 记忆层：观察池多数未逐一直查；LightRAG/GraphRAG 已直查确认窗内静默；Letta 窗内完全静默。
- 可观测层：云厂 observability/eval 仅有背景；Helicone/AgentOps/Coze Loop 需换入口复核；OTel for Agents 仅得标准背景。
- 平台控制面：中国三家平台控制面本周无窗内一手发布；Microsoft Foundry what's-new 最新仅至 2026-08 页。
- 通用原因：官方发布说明按月或周聚合、无逐条日期；中文云厂动态页分散或动态渲染，抽取失败或仅得旧页；部分项目发版渠道不在主仓；本期未使用 tavily/exa/xAI 等渠道补齐，亦未登录抓取。后续可补入口包括官网 changelog、状态页、社交渠道与跨期 GitHub 快照（用于星速对比）。

## 来源

**官方发布说明与 changelog**

- [OpenClaw releases](https://github.com/openclaw/openclaw/releases)、[OpenClaw v2026.9.8 release notes](https://docs.openclaw.ai/releases/2026.9.8)、[docs.openclaw.ai/releases](https://docs.openclaw.ai/releases)
- [LangGraph releases](https://github.com/langchain-ai/langgraph/releases)
- [Google ADK releases](https://github.com/google/adk-python/releases)、[ADK abort run 指南](https://github.com/google/adk-python/blob/main/docs/guides/runners/runner/abort.md)
- [Claude release notes](https://platform.claude.com/docs/en/release-notes/overview)、[Claude browser use SDK](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-sdk)、[Claude computer use 工具](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)
- [OpenAI API changelog](https://developers.openai.com/api/docs/changelog)、[OpenAI DevDay 2026](https://openai.com/index/devday-2026-recap/)、[ChatGPT 周报 9/28–10/2](https://learn.chatgpt.com/docs/whats-new/september-28-october-2-2026)
- [AWS AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)、[AWS 周报 10-05](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-amazon-bedrock-managed-agents-powered-by-openai-q3-service-availability-updates-kiro-workflows-and-more-october-5-2026/)、[AWS what's-new 2026-09](https://aws.amazon.com/about-aws/whats-new/2026/09/amazon-bedrock-agentcore/)
- [Google Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)、[Google sandbox computer use](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sandbox/computer-use)、[Vertex AI release notes](https://docs.cloud.google.com/vertex-ai/docs/release-notes)
- [Microsoft Foundry 博客](https://devblogs.microsoft.com/foundry/)、[Foundry what's new](https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry)、[Hosted Agents](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents)、[Entra Agent ID](https://learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id)、[Playwright Workspaces](https://learn.microsoft.com/en-us/azure/app-testing/playwright-workspaces/overview-what-is-microsoft-playwright-workspaces)、[Microsoft Toolbox](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview)
- [Databricks 2026-10 release notes](https://docs.databricks.com/aws/en/release-notes/product/2026/october)
- [阿里云百炼应用动态](https://help.aliyun.com/zh/model-studio/application-release-notes)、[火山 Agent Plan](https://www.volcengine.com/docs/ark/agent-plan-personal-plan-overview)、[腾讯云 ADP](https://cloud.tencent.com/product/adp)

**协议、网关与集成**

- [MCP Gateway Registry 1.32.0](https://github.com/agentic-community/mcp-gateway-registry/releases/tags/1.32.0)、[1.32.1](https://github.com/agentic-community/mcp-gateway-registry/releases/tags/1.32.1)、[MCP Dev Summit Toronto](https://events.linuxfoundation.org/mcp-dev-summit-toronto/)、[MCP 2026-07-28 规范](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- [A2A CLI 发布](https://a2a-protocol.org/latest/blog/2026/10/01/introducing-a2a-cli/)、[a2a-cli](https://github.com/a2aproject/a2a-cli)、[a2a commits](https://github.com/a2aproject/a2a/commits)
- [Composio Instant](https://composio.dev/blog/composio-instant)、[composio releases](https://github.com/ComposioHQ/composio/releases)
- [Arcade MCP commits](https://github.com/ArcadeAI/arcade-mcp/commits/main)、[Nango changelog](https://nango.dev/docs/updates/changelog)、[Nango v0.71.12](https://github.com/NangoHQ/nango/releases/tag/v0.71.12)、[Pipedream changelog](https://pipedream.com/docs/changelog)
- [Okta × AgentCore](https://www.okta.com/blog/ai/okta-amazon-bedrock-agentcore-security/)、[WorkOS MCP gateways compared](https://workos.com/blog/mcp-gateways-compared)、[Auth0 Agent Gateway](https://auth0.com/blog/auth0-agent-gateway-beta/)、[Clerk MCP server](https://clerk.com/docs/guides/ai/mcp/clerk-mcp-server)

**执行环境与沙箱**

- [Modal Runtime 产品更新](https://modal.com/blog/runtime-product-update-sandbox-endpoints)、[Modal changelog](https://modal.com/changelog)、[VM Sandboxes](https://modal.com/changelog/give-agents-a-full-computer-with-vm-sandboxes)
- [E2B releases](https://github.com/e2b-dev/E2B/releases)、[Daytona](https://github.com/daytonaio/daytona)、[Browserbase changelog](https://www.browserbase.com/changelog)、[Browserbase observability](https://www.browserbase.com/observability)

**记忆与上下文**

- [OpenViking v0.4.23](https://github.com/volcengine/OpenViking/releases/tag/v0.4.23)、[Cognee v1.6.3](https://github.com/topoteretes/cognee/releases/tag/v1.6.3)、[Mem0 commits](https://github.com/mem0ai/mem0/commits/main)、[Mem0 v2.2.1](https://github.com/mem0ai/mem0/releases/tag/v2.2.1)
- [supermemory commits](https://github.com/supermemoryai/supermemory/commits/main)、[Graphiti LLMRuntime](https://github.com/getzep/graphiti/commit/689de29)、[Letta releases](https://github.com/letta-ai/letta/releases)、[Firecrawl commits](https://github.com/firecrawl/firecrawl/commit/1bf1215)、[Crawl4AI cloud launch](https://github.com/unclecode/crawl4ai/commit/8afd0a6)

**可观测与评测**

- [Langfuse v4.54.0](https://github.com/langfuse/langfuse/releases/tag/v4.54.0)、[Arize Phoenix v20.19.0](https://github.com/Arize-ai/phoenix/releases/tag/arize-phoenix-v20.19.0)、[LangSmith v0.14.4](https://github.com/langchain-ai/langsmith-sdk/releases/tag/v0.14.4)、[Braintrust 3.37.1](https://github.com/braintrustdata/braintrust-sdk/releases/tag/braintrust@3.37.1)
- [Helicone commits](https://github.com/Helicone/helicone/commits/main)、[AgentOps](https://github.com/AgentOps-AI/agentops)、[Coze Loop](https://github.com/coze-dev/coze-loop)、[OTel GenAI semconv](https://opentelemetry.io/docs/specs/semconv/gen-ai/)、[CloudWatch Omni](https://aws.amazon.com/about-aws/whats-new/2026/09/amazon-cloudwatch-omni-ai/)
