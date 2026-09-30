---
layout: single
title: "全球 AI Agent 基础设施周报 · 第 15 期：Harness 托管化与技能治理（2026-09-24 ~ 2026-09-30）"
date: 2026-10-01 06:00:00 +0800
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
  overlay_image: /assets/images/posts/2026-10-01-agent-infra-cover.png
  overlay_filter: 0.35
toc: true
toc_sticky: true
---
本期为 2026-10-01 发布的第 15 期全球 AI Agent 基础设施周报，报道窗口为 2026-09-24 至 2026-09-30。一周之内，控制层的竞争方式变了：三家以上厂商同时把 Harness 做成托管服务，技能（skill）被抬升为治理与遥测的公共维度，Agent 身份第一次被当成与人类用户并列的第一类主体。与此同时，一条 OAuth 凭据窃取漏洞提醒所有人：连接层的标准化越快，信任链的集中风险就越硬。

以下按控制层、执行层、执行环境、工具层、权限层、记忆知识层、观测治理层、平台层八段展开，随后是云厂能力矩阵、五个最强信号、对自托管方案（以 OpenClaw 为参照）的含义，以及本次取证的范围与局限。

## 本周总览：六条跨模块判断

1. **托管 Harness 正面开战，控制层价值从「框架库」迁到「托管 runtime + 治理 + 观测」。** OpenAI 9/10 公测 Agents API（托管 Codex harness：会话编排、上下文自动压缩、恢复、自选沙箱），9/29 再把 computer use 接进 Agents API 并发布 always-on 产品 Dots；LangChain 9/24 推出 Managed Deep Agents（`/v1/deepagents` 托管 runtime）与 Sandboxes GA；AWS 9 月为 AgentCore harness 补交互式 shell 与 lifecycle hooks，并上线由 OpenAI 驱动、跑在 AWS 治理边界内的 Bedrock Managed Agents（预览，9/29）；Databricks 9/29 用 `databricks-agentbricks` CLI 把脚手架、本地运行、部署、托管 memory / sessions / tools、MLflow tracing 串成一条已认证命令。

2. **skill 升为一等控制面，且正成为治理与遥测的公共维度。** LangSmith 新 Context Hub 对 AGENTS.md / skills / policies 做版本化；AWS 把 agent skills 做成可批量版本治理的资产（9/30）并在 Marketplace 支持技能计量计费（9/30）；Langfuse 上线 skills 基础管理与草稿变更追踪；OpenTelemetry GenAI 语义约定新增 `gen_ai.skill.*` 工具 span 属性（9/29）；OpenViking v0.4.22 把 Skill 整包纳入 context database 索引并在会话开始注入 Skill 目录。跨厂商同时把「skill」从产品概念抬为标识与遥测维度。

3. **Memory 从「向量检索 API」走向「Context Database」。** 火山引擎 OpenViking v0.4.22（9/28）把「Memory + Knowledge RAG + Skills」收进一个文件系统式 context database；Mem0 v2.2.1（9/25）与 Cognee v1.6.2（9/29）同期收敛到同一主题——不许静默丢数据、不许错打分；Graphiti 把知识图谱接到 MCP SDK 2.x 并按 `group_id` 做多租户路由（9/25）；MCP 正成为记忆、知识、技能的统一接入协议，`.agents/skills` 目录约定在多个项目间趋同。

4. **工具授权下移到「网关 + 目录 + 逐 agent 身份」，并暴露委派链的信任根风险。** Postman Fabric Gateway 正式 GA（9/29）做协议无关的 agentic 控制面；AWS、微软、Google 三云路线趋同（协议无关网关 + 注册目录 + 逐 agent 身份）；微软把 agent 当成有 owner、有生命周期、可 block / 删除 / 恢复的第一类主体；同周 MCP 官方 Python SDK 被披露 OAuth 凭据窃取高危漏洞（GHSA-qx49-fqc8-xw99，9/28 公告），说明「授权服务器发现」这一跳不校验即全链失守。

5. **观测治理落到共同硬指标：成本与 token 口径、策略执行对用户可见。** Langfuse 连续修 Anthropic 1 小时缓存写计费、OpenAI cache-write token 计费、失败或取消的生成不再推断 usage；Firecrawl 把 cached 与 reasoning token 纳入遥测；Google 9/29 给语义治理策略加自定义拒绝消息（≤1000 字符）；AWS 用 lifecycle hooks 提供同步 allow / deny 与 Consent Portal；Arize Phoenix 把 bash 工具非零退出标为 span error；CodeMender v0.10.0 增加 SARIF 导出与按严重度 CI 门禁。同时 OTel 导出器 `otlp-proto-http 1.45` 兼容问题被 Langfuse、Braintrust、Phoenix 同期撞上，标准版本漂移已成全行业集成风险。

6. **执行体商品化与自托管供给，同一个问题出现两种答案。** OpenAI Dots（9/29）把「自带云电脑 + 自带浏览器 + 24/7 生命周期 + 身份」打包为产品；开源侧 trueforge、ZCode、hermes-agent v2026.9.24 在同一窗口发布，OpenClaw 则以 v2026.9.6 / v2026.9.7 把外部 harness 接成可选 runtime、并补齐备份回滚与重启恢复。差异点收敛为「状态所有权与数据主权」，而非能力有无。

## 控制层：托管 Harness 正面开战

这一层的本周结论有四条。托管 Harness 正面开战：OpenAI 9/10 公测 Agents API（把 Codex harness 变成托管服务：会话编排、上下文自动压缩、恢复，自选沙箱），9/29 再把 computer use 接进 Agents API；LangChain 9/24 推出 Managed Deep Agents 与 Sandboxes GA；AWS 9 月给 AgentCore harness 加交互式 shell 与 lifecycle hooks。控制层的价值正从「框架库」迁到「托管 runtime + 治理 + 观测」。其次，AGENTS.md 与 skills 升为一等控制面，LangSmith 新 Context Hub 专门对其做版本化；OpenClaw 的 workspace / skills 抽象与之一致。第三，编排层趋同，差异移到「长时执行三件套」——持久会话与检查点、沙箱代码执行、评估与观测成为共同卖点，纯编排图已非护城河。第四，OpenClaw 本周 72 小时内连发 9.6 / 9.7，9.7 接入 OpenAI Agents API 与 Sign in with ChatGPT（Beta），9.6 给 remote workspace 补 Files / Memory / Skills 与 restart recovery；其差异点是自托管、多渠道、本地模型，而非托管沙箱。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| OpenClaw | v2026.9.6（9/24 07:21+0800）、v2026.8.33（9/29）、v2026.9.7（9/30 12:44+0800）连发；9.7 接 OpenAI Agents API | 官方发布说明 / GitHub Releases | 是 |
| OpenAI Agents SDK / Responses / Agents API | 9/25 图像编码修复；9/29 Agents API 加 computer use，同日 GPT-6.1 Sol + Ultrafast | OpenAI API Changelog | 是 |
| Anthropic Claude Agent SDK / MCP / Managed Agents | 9/24 拒答计费恢复、合规 API 调整；9/28 Claude Sonnet 5.5；9/30 Sonnet 4.5 弃用 | Claude Platform release notes | 是 |
| LangChain / LangGraph / LangSmith | 9/24 Interrupt NYC：LangSmith Engine、SmithDB、Managed Deep Agents、Sandboxes GA、Context Hub、LLM Gateway | LangChain 官方博客 | 是 |
| Google ADK / A2A | 本周无重大公开动态（背景：ADK 2.0 于 2026-06-30，平台已更名 Gemini Enterprise Agent Platform） | adk.dev / Google Cloud release notes | 否（背景） |
| Microsoft Agent Framework / Semantic Kernel / AutoGen | 本周未取得重大动态（背景：1.0 GA 2026-04-02） | Microsoft Learn agent-framework 文档 | 否（背景） |
| Databricks Mosaic AI Agent Framework / Agent Bricks | 本周未取得重大动态（背景：DAIS 2026 于 6 月发布 Agent Bricks） | Databricks Agent Bricks 产品页 | 否（背景） |
| 动态池 CrewAI AMP/Studio、Dify、n8n/Flowise | 本周未取证到平台化 / runtime / observability 级动态，暂不写 | — | 否 |

**OpenClaw** 72 小时内连发三版。v2026.9.6（北京时间 9/24 07:21，落在窗口内）引入托管更新结果可视化、重启恢复（未完成对话从已保存进度继续）、完整 30 天 Usage 报表、remote workspace 新增 Files / Memory / Skills、GitHub reader、实时会议纪要，并新增 Claude Opus 5.5、GPT-6 Sol / Luna、Grok 4.7 模型支持，规模 2,614 PR + 178 direct commits + 350 contributors。v2026.8.33（9/29）为旧线维护发版（gateway-only extended-stable，含安全汇总与模型目录更新）。v2026.9.7（9/30）是重头：接入 OpenAI Agents API 作为可选 runtime——在持久托管 Linux workspace 中跑 chat，支持 web search、OpenClaw 工具、文件传输；自托管 Agents API 执行需自有 controller 与匹配 workspace 路径、不支持文件传输；另有 60 秒提交截止、token usage 上报、临时服务器错误重试、live web search，同时上线 Sign in with ChatGPT（Beta），并更新备份 / 回滚保护与繁忙对话响应优化，规模 2,818 PR + 518 direct commits + 344 contributors。安全侧明确提示：多 agent 共用一个 Gateway 时，省略的可见性设置会让带 session 工具的 agent 读取其他 agent（含其他用户）的对话，需显式收窄；互不信任用户应分 Gateway。（[v2026.9.7 发布说明](https://docs.openclaw.ai/releases/2026.9.7)、[v2026.9.6 发布说明](https://docs.openclaw.ai/releases/2026.9.6)、[GitHub Releases](https://github.com/openclaw/openclaw/releases)）

**OpenAI Agents SDK / Responses / Agents API** 9 月动作密集。9/10 Agents API 进公测——托管 Codex harness，OpenAI 负责会话编排、上下文自动压缩与恢复；durable sessions、流式进度、自带工具与 MCP；沙箱可选 OpenAI 托管、自有基础设施或合作方（Blaxel、Cloudflare、Daytona、DigitalOcean、E2B、Modal、Oracle、Runloop、Vercel）；官方称使用 Agents API 无额外费用，仅按 token 与工具付费；harness 由开源 Codex 代码库驱动。9/25 修复 GPT-6 Sol / Luna 图像编码 bug。9/29 同日三连：给 Agents API 加 computer use、发布 GPT-6.1 Sol（`gpt-6.1-sol`，≤272K 输入 $2 in / $0.10 cached / $2.50 cache write / $10 out，支持 Multi-agent beta，可在单次 Responses 请求中委派子 agent）、GPT-6 Astra 加 Ultrafast mode（全局处理 + 美国数据驻留，EU 不支持）。早期 9/3 已给 Responses API 加 async tool calling、mid-turn steering、mid-conversation reasoning effort；9/15 加 API key 创建治理。（[API Changelog](https://developers.openai.com/api/docs/changelog)、[Introducing the Agents API](https://openai.com/index/introducing-the-agents-api/)、[Introducing GPT-6 Sol and Luna](https://openai.com/index/introducing-gpt-6-sol-and-luna/)）

**Anthropic** 窗口内的平台级动作集中在模型与治理，而非策略面。9/28 发布 Claude Sonnet 5.5，同日公布 5 处破坏性变更：关掉前置思考要用 `thinking:{"type":"between_tools"}`；强制工具调用（`tool_choice` 为 `any` / `tool`）返回 400；thinking block 与模型 / 会话绑定且只在该账号或关联账号内生效，跨账号传输时 API 会在模型看到前丢弃该 block 而请求仍成功，早期模型 block 不受影响。9/30 宣布弃用 Claude Sonnet 4.5，API 退休日 2026-11-30，建议迁移到 Sonnet 5.5。9/24 恢复对部分低误报类别零输出前拒答的计费，同日 Compliance API 本地会话端点对 Microsoft 365 转正式版，且 Activity Feed 不再返回文件名、项目文档名与产物标题（历史记录同样被清空），需持 scope 的 Compliance Access Key 才能按 ID 反查。Claude Code 客户端本周仍在连发（v2.1.283→286）。（[Claude Platform Release Notes](https://platform.claude.com/docs/en/release-notes/overview)）

**LangChain / LangGraph / LangSmith** 9/24 Interrupt NYC 落地一批发布。LangSmith Engine v2 在平台内自动跑 agent 改进闭环——新增 Red Teaming、扩展问题类型（错误率 / 延迟 / 成本趋势、重复工具调用、过长轨迹），并可在 LangSmith Deployment 上自动测试候选修复（先复现再在更广评测集上找补丁，人工一键开 PR）；官方称 5 月上线以来 Engine 已分析超 6000 万条 trace。Managed Deep Agents v0.8 新增用户级记忆（与 agent 级记忆分层、运行时不跨层复制、可分层设访问策略）与 agent / 用户双形态凭据，Slack 通道支持文件传输，新增 HTTP 通道，内置由 Parallel 提供的 web search。（[Interrupt 2026 概览](https://www.langchain.com/blog/interrupt-2026-overview)、[LangSmith Engine 等更新](https://www.langchain.com/blog/langsmith-engine-agents-fine-tuning-trajectories)）

**Google ADK / A2A** 本周无重大公开动态。背景（非本周）：ADK 2.0 于 2026-06-30 发布，平台侧 Vertex AI 已更名 Gemini Enterprise Agent Platform，ADK 作为其开源开发框架，A2A 为 agent 间协议。ADK 的重心已并入平台的开发框架位，本周无新编排能力发布；未在本周取得 ADK 仓库或文档的具体 release，故不写本周主张。

**Microsoft Agent Framework** 本周未取得重大公开动态。背景：Microsoft Agent Framework（Semantic Kernel + AutoGen 合并）已于 2026-04-02 达 1.0 GA；本窗口前最近的官方汇总为 2026-09-09 发布的《What's new in Microsoft Foundry: July and August 2026》，其中 Hosted Agents、Voice Live 集成、Toolboxes 均转 GA。窗口内未取得 9 月下半月官方条目，按「本周无重大公开动态」处理。背景另含：Claude 托管部署在 Azure 侧新增结构化输出、Web search、Web fetch、MCP connector、Tool search；Model Router 扩充区域与模型池；Python / JS SDK 稳定在 2.5.0、Java 2.4.0，.NET 3.0.0 仍为预览。

**Databricks（本模块口径）** 本周未取得重大公开动态；Agent Bricks 于 2026-06 DAIS 发布为统一 agent 平台。注意：平台层在本窗口内实有 9/29 发布，详见平台层一节。

**开源自托管 harness 供给** 本周三例。truefoundry/trueforge 自述为「开源 agent harness」，仓建 2026-07-23，9/30 同批发布 3 个包（核心 0.3.1 仅一行说明：修 Chat History 不可变会话与 `mcp.auth_required` 重复消息），属 patch 级，能力信号弱，真正可读的是其定位主张。zai-org/ZCode（Z.ai 官方，Apache-2.0）仓建 2026-09-20，唯一 release v3.14.3 于 9/24 发布，走「模型厂开源自家 harness 绑定自家模型」路径；第三方称其含多 agent 编排与 1M token 上下文，本次未在官方 release body 中核实，仅作线索不采信。NousResearch/hermes-agent 的 v2026.9.24（tag 时间 9/24 10:09Z）为 patch 汇总版：自 v0.21.4 起窗口含 1,610 个非合并提交、4,828 个变更文件、460 个已合并 PR、475 个已关闭 issue，完整 curated notes 推迟到 v0.22.0；body 列出插件 SDK 波次（含沙箱化 embed 原语）、Connectors 页取代 MCP tab、主机多路复用下按 profile 独立 stop / start / restart 与 `gateway.standalone`、CLI / TUI live dock 展示常驻 `/goal` 与排队 prompt、webhook 投递镜像进目标聊天会话、catalog 加入 GPT-6 Sol / Terra / Luna 与 Claude Opus 5.5。需注意：热度补漏线索称该版含「桌面浏览器驱动」，本次在 release body 中未见该表述，故不据此写浏览器 / computer-use 主张。

这一层正在被云厂收编：本周最强信号不是新框架，而是多家同时把「harness 变成托管服务」；编排框架退居第二，竞争点移到持久会话与检查点、沙箱代码执行、技能与上下文治理、观测评测。自托管与开源自托管侧（OpenClaw、hermes-agent、trueforge、ZCode）与云托管 harness 同框。OpenClaw 的对照价值在于以自托管方式提供同构能力（重启恢复、remote workspace Memory / Skills、接入外部 harness 作可选 runtime），但在托管沙箱与评估体系上仍需外部件补位。

## 执行层：从「跑得起来」到「断得了、接得回、管得住」

本周执行层最强信号（修订后）是 **OpenAI Dots（9/29）把「always-on + 自带云电脑 + 自带浏览器 + 24/7 生命周期 + 身份」做成产品级打包**，这是 runtime 层最强的商品化信号；其次才是三云厂的运行时治理能力（AgentCore harness shell / hooks、Foundry long-running agent 套件、OpenClaw v2026.9.7 备份回滚与重启恢复）。竞争焦点已从「能否拉起容器」转向长时 / 有状态会话的生命周期与故障恢复：Anthropic 9/28 发布 Sonnet 5.5 并把 thinking 块绑定到会话与账号；Microsoft Foundry 9 月文档把 long-running agent 的崩溃恢复、状态管理、steer 做成成套 how-to。格局上，云厂卖「托管控制面 + 治理」，模型厂开始直接卖「常驻执行体」，开源侧在补多 profile 生命周期与状态恢复；阿里云百炼 9/24 上线「高代码应用」是本周国内最明确的 runtime 侧动作，腾讯云 ADP 侧仅模型下线切换。对 OpenClaw，其 session / cron / Gateway 与 Dots 的「常驻云电脑」是同构问题，差异价值仍在自托管与数据主权。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| AWS Bedrock AgentCore Runtime | 9 月 release notes 新增 harness 交互式 shell（WebSocket）、lifecycle hooks、自定义 OpenAI 兼容端点、Consent Portal；新版 Runtime GA 在 09-18（窗口外） | AWS AgentCore 官方 release notes | 是 |
| Google Vertex AI Agent Engine | 09-28 release notes 仅 Workbench 容器补丁；本周无 Agent Engine / Managed Agents 重大动态 | Google Cloud 官方 release notes | 限述 |
| Microsoft Foundry Hosted Agents | 9 月文档集齐 long-running agent 预览（任务状态、崩溃恢复、steer、断线重连）；GA 预告在 9 月下旬 | Microsoft Learn Foundry 文档 | 是 |
| 阿里云百炼 Model Studio | 09-24 上线高代码应用；09-23 工作流 Dify 导入 / 文件问答升级（窗口边界一天之差） | 阿里云百炼应用功能动态页 | 是 |
| 火山方舟 Ark / Coze | 本周无重大公开动态（coze-studio 最新 release v0.5.1，2026-02-05） | gh api coze-dev/coze-studio | 否 |
| 腾讯云智能体平台 ADP | 09-27 生效 DeepSeek-V4-Flash 0731 下线切换通知；无 runtime 级新品 | 腾讯云官方公告页 | 限述 |
| OpenClaw sessions / cron / Gateway | v2026.9.7（09-30，Agents API runtime + 更新备份回滚 + 重启恢复）；v2026.8.33（09-29）；v2026.9.6（09-24 07:21+0800） | OpenClaw GitHub Releases | 是 |
| E2B / Modal / Daytona | 本周未见官方 runtime / 长任务发布动态 | 搜索（serper） | 否 |
| OpenAI Dots（always-on agent） | 09-29 发布；自带云电脑与浏览器、24/7、4,000+ 应用集成、Pro / Enterprise 滚动 | OpenAI 官方博文 | 是 |
| NousResearch/hermes-agent | v2026.9.24（09-24，窗口内）；460 PR rollup、profile stop / start / restart、沙箱化嵌入原语 | GitHub Releases | 是 |

**OpenClaw sessions / cron / Gateway** 官方摘要明确四项与执行层直接相关的能力：新增 OpenAI Agents API 运行时与 Sign in with ChatGPT（Beta）；更新安全（升级前备份每份状态与 agent 数据库、回滚时恢复）；高负载下响应更快、长对话更稳；「重启后继续手上的活」的恢复帮助。它把「更新可回滚 + 重启可续接 + 接入 OpenAI Agents API runtime」三件事同时补齐，等于把自托管 gateway 的可靠性叙事向云厂 hosted runtime 收敛。连带意义：多 runtime 混跑（本地 gateway + 云托管 Agents API）的会话与状态一致性将成为选型比较点。未披露：Agents API 运行时的具体托管区域与计费。

**AWS Bedrock AgentCore Runtime** 9 月 release notes 列出两项关键能力。持久交互式 shell：在 harness 同一隔离 microVM 内以 WebSocket 运行，保留环境变量、工作目录、命令历史与运行进程，可重连 detached shell 并回放最多 256 KB 输出，单会话最多 10 个 shell，入口为 `InvokeAgentRuntimeCommandShell`。lifecycle hooks：在 before_invocation / before_tool_call / after_tool_call / after_invocation 挂 AWS Lambda（同步 allow / deny，可中断调用或跳过工具）或 SNS / EventBridge（非阻塞通知）。此外新增自定义 OpenAI 兼容端点（模型配置新增 `apiBase`）、AgentCore Identity Consent Portal，Evaluations 支持 TypeScript 框架。需注意：窗口内确切发布日未见标注，release notes 仅按月归组；新一代 AgentCore Runtime 的 GA 公告为 09-18（窗口外），其卖点是弹性内存回收与快照式冷启动，P75 冷启动 1.9–2.0 秒（镜像 200MB–2GB）对比 V1 的 5.4–30 秒，覆盖 us-east-1 / us-east-2 / us-west-2 / eu-west-1 / ap-northeast-1。更正：AgentCore Evaluations 的两个 skill 级评估器官方列在 8 月（背景，非本周）。

**阿里云百炼高代码应用** 百炼应用功能动态页 09-24 新增「高代码应用」：支持基于 Python 项目结构直接部署 AI 后端服务，平台内置自动化运维、可观测性与日志服务。技术含义是从「零代码智能体编排」延伸到「可托管的自定义代码后端」，把 runtime 抽象成能承接任意 Python 服务的宿主；商业上对应把客户从「调模型 API」锁到「代码 + 运维 + 可观测」整套平台。这是本周国内平台在 runtime 侧最实的一步，直接对标 Foundry / AWS 的托管 agent 后端。未披露：计费方式、资源规格上限、冷启动指标。

**Microsoft Foundry Hosted Agents** 官方 what's-new 与 agents 文档在 8—9 月集中上线 long-running agent（预览）一整套：long-running agent API 参考、崩溃弹性、任务状态管理、崩溃后恢复、断线重连流式输出、对进行中回合的 steer、human-in-the-loop 审批。另有 agent optimizer、autopilot lifecycle、私有 skill catalog、toolbox 网络隔离、hosted agents 的 BYO registry 等文档；模型侧新增 Grok、MAI-Thinking-1，并有 Model Router 评测指引与 Azure OpenAI Responses API 的多 agent 编排文档。第三方汇总（Medium，作者 Dave Rendon，约 2026-09-30）称 rubric evaluator、trace / 合成数据集生成与 agent optimizer 的 GA 定在 2026 年 9 月下旬——该 GA 时间点属二手转述，本次未取得微软方 GA 原文（记为局限）。Foundry 把「长时 agent 的状态与恢复」做成第一批公民 API，这会把自建 runtime 的隐性成本显性化；其与 AWS 本周的 lifecycle hooks / Consent Portal 同构竞争。

**OpenAI Dots（always-on agent）** OpenAI 于 2026-09-29（DevDay 2026）发布官方博文《Introducing dots》。Dots 被定义为「always-on agents」：自带云电脑与自带浏览器，由 GPT-6 Astra 驱动，可 24/7 朝用户目标持续工作；用户可随时打开其电脑「检视工作」；可多项目并行推进；可通过插件生态连接 4,000+ 应用；入口覆盖 ChatGPT、Slack、Teams；先向 Pro / Business Premium / Enterprise 分市场滚动，并预告「specialist dots」带独立身份用于访问管理、IT 配发硬件、与企业系统对接。多家外媒同日报道（Reuters / NYT / TechCrunch / The Guardian）。这是本周最强「runtime 商品化」信号——模型厂直接把「持久云电脑 + 持久浏览器 + 24h 生命周期 + 身份」打包成消费级产品，等于把 E2B / Modal / Browserbase 的能力收进自家套餐；对自托管 session / state / cron 方案，差异点只剩「数据主权与自托管」。未披露：云电脑的隔离技术、区域、配额与计费。（[Introducing dots](https://openai.com/index/introducing-dots/)、[Reuters 报道](https://www.reuters.com/business/openai-takes-meta-with-always-on-dots-agent-enterprise-ai-push-2026-09-29/)、[DevDay 2026 Recap](https://openai.com/index/devday-2026-recap/)）

**hermes-agent v2026.9.24（执行层交叉）** 执行层相关内容包括：Desktop 插件 SDK 波次含沙箱化嵌入原语与插件后端公共事件桥；host multiplexer 下按 profile 的 stop / start / restart，并有 `gateway.standalone` 让某 profile 退出多路复用；CLI / TUI 的 live dock 显示常驻 `/goal` 与排队提示；webhook 投递镜像到目标 chat 会话；新增 GPT-6 Sol / Terra / Luna 与 Claude Opus 5.5 目录支持。官方称该窗口的完整整理笔记推迟到 v0.22.0，本条按 release notes 实际披露范围限述。

**解决方案五要素（未披露写未披露）**。OpenClaw v2026.9.7：怎么搭＝自托管 gateway，升级前自动备份每份状态与 agent 数据库，失败可回滚；交付给谁＝个人 / 团队自托管用户；什么代价＝未披露（开源 / 自托管，本期未取得计费口径）；踩了什么坑＝从 2026.9.5 升级路径有专门修复，说明跨版本迁移曾出问题；能否复制＝开源可复制。AWS AgentCore harness：怎么搭＝在隔离 microVM 内以 `InvokeAgentRuntimeCommandShell` over WebSocket 开交互式 shell，或挂 Lambda / SNS / EventBridge lifecycle hooks；交付给谁＝企业 agent 团队（可挂 Consent Portal 面向终端用户）；什么代价＝未披露；踩了什么坑＝官方注明 AgentCore CLI 与高层 SDK shell helpers 当时不支持 harness target，且 2026-06-05 前部署的 agent 需重新部署才能用 shell；能否复制＝平台托管，不可自托管复制。阿里云百炼高代码应用：怎么搭＝按 Python 项目结构部署 AI 后端服务，平台内置自动化运维、可观测性、日志；交付给谁＝需自定义代码逻辑的企业开发者；什么代价＝未披露；踩了什么坑＝未披露；能否复制＝平台托管，不可复制。

Runtime 层的分水岭已从「跑得起来」转为「断得了、接得回、管得住」——备份回滚、崩溃恢复、会话 / 状态绑定与 lifecycle 治理成为本周四个平台的共同动作，自托管 gateway 与云托管 runtime 的差异正被压缩到「状态所有权」这一项；而 OpenAI Dots 显示模型厂正把常驻执行体直接做成产品。本模块缺口：AWS AgentCore 9 月条目未标确切日期，已按「本月」限述；Foundry 评估 / optimizer 的 GA 时间为第三方转述；火山方舟 / Coze、E2B、Modal、Daytona、Browserbase / Stagehand、Google Agent sandbox 本周未见窗口内官方动态，未编造；OpenAI DevDay Recap 页为动态渲染，computer use 的隔离技术、配额与定价未披露。

## 执行环境：computer use 被模型厂收进托管栈

本周最强信号来自模型厂而非沙箱厂：OpenAI 在 DevDay 2026（9/29–9/30）把 computer use 收进 Agents API，让「托管 agent 直接操作软件」成为 API 级能力；Anthropic 于 09-28 发布 Claude Sonnet 5.5，明确弃用旧 computer use 工具版本 `computer_20251124`，改用 `computer_toolset_20260801`。两家在同周把「计算机操作」从演示推向版本化接口，且都以「工具集版本 + 会话绑定」控制执行边界。专业浏览器 / 沙箱厂商本周无窗口内发布，话语权明显向模型厂与云厂整包倾斜；hermes-agent 的沙箱化嵌入原语是开源侧少数相关动作。对 OpenClaw 的提示是：computer use 的接口版本化要求执行环境按「可回放、可观测、可治理」设计，并建立模型侧 toolset 版本探测与降级。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| OpenAI Computer Use / Agents API | DevDay 2026：Agents API 新增 computer use；同场发布 Dots agent 产品、GPT-6.1 Sol | OpenAI 官方 Recap / The Verge / CNBC | 是 |
| Anthropic Computer Use | 09-28 Sonnet 5.5 弃用 `computer_20251124`，需 `computer_toolset_20260801`；09-22 Opus 5.5 同类变更（窗口外） | Claude Platform release notes | 是 |
| Azure Browser Automation / Playwright Workspaces | Remote MCP Server 公告为 09-17（窗口外）；本周无新增 | Microsoft Tech Community | 限述 |
| AWS AgentCore Browser / Code Interpreter | 本周无窗口内独立发布；9 月 runtime 侧新增见执行层 | AWS 官方文档 | 否 |
| Google Code Execution / Agent sandbox | 窗口内 release notes 仅 Workbench 补丁；Code Execution on Agent Engine 首发为 2025-09 | Google Cloud 文档 | 否 |
| Browserbase / Stagehand | 最新 release 停在 2026-08-28；本周无动态 | gh api browserbase/stagehand | 否 |
| E2B / Daytona / Modal | 本周未见官方发布 / 新版动态 | 搜索（serper） | 否 |

**OpenAI Computer Use（Agents API）** DevDay 2026 官方 Recap 称「超过 20 项重大发布」，核心之一是 Agents API 现支持 computer use，开发者可构建直接与软件交互完成任务的 agent；同场还有可承担「持续职责」的 agent、把 ChatGPT 开放为人类与 agent 协作的共享界面（面向 12 亿周活，官方披露，未独立核实），以及 GPT-6.1 Sol（OpenAI 称在 agentic coding 与 computer use 上显著增强，token 价约为 Astra 的 1/5）。另外 09-29 更新的 GPT-6 Sol / Luna 页给出 API 降价 50%（Sol $4→$2 / $20→$10；Luna $0.20→$0.10 / $1.20→$0.50 每百万 token）。computer use 进入 Agents API 意味着「浏览器 / 桌面操作」从第三方 SDK 转入模型厂托管栈，专业浏览器厂商的差异化被压缩到合规、可观测与反爬细分；若上游把计算机操作连带会话状态一起托管，自托管 agent 的接口兼容成本上升。未披露：computer use 的具体沙箱隔离技术、配额与定价。

**Anthropic Computer Use（Claude Sonnet 5.5）** release notes 记载 09-28 发布 Sonnet 5.5，同时公布五处兼容性破坏点，其中与执行环境直接相关的是：在 Claude API 与 Google Cloud 上，旧 `computer_20251124` 不再被接受（Opus 5.5 于 09-22 已要求改用 `computer_toolset_20260801`，Amazon Bedrock 上旧版仍可用）。Anthropic 用「toolset 版本 + 账号绑定 thinking」把 computer use 的执行语义收紧，减少跨会话重放与提示注入面；代价是旧集成需迁移。模型侧工具版本迁移会周期性地打破自托管 agent 的工具兼容，需建立版本探测与降级路径。局限：computer use 的官方技术白皮书细节本周未取得。

本周执行环境层的竞争主导权进一步向模型厂集中——computer use 被「工具集版本化 + Agents API 托管」，专业沙箱 / 浏览器厂商进入跟随期；hermes-agent 的沙箱化嵌入原语与 Dots 的内置浏览器，分别代表开源侧与模型厂侧对「执行环境边界」的两种回答。

## 工具层：网关从协议概念变成 GA 产品与安全边界

本周最强信号是标准化工具网关从「协议层」进入「产品化 GA + 安全欠账清算」阶段：Postman 以 Fabric Gateway 正式 GA（9/29），把 agent 访问 API / MCP server / 工具的发现、策略与审计收敛到一个协议无关控制面；同时官方 MCP Python SDK 被披露高危 OAuth 凭据窃取漏洞（9/28 公告），说明标准化网关在收敛连接的同时，把认证信任边界变成新的集中风险点。竞争格局上，云厂把「网关 + 目录 + 身份」三件套一次性打包：微软 Toolbox 用单一托管 MCP 端点，Google 用 Agent Gateway + Agent Registry + Agent Identity，AWS 用 Gateway + 跨账户平台账号模式；三家路线趋同，独立网关厂商（Postman、truefoundry、Speakeasy、MintMCP）抢「跨云统一治理」空位。对自建方案的三条含义：工具接入应收敛为「单一网关端点 + 目录」；MCP SDK 必须核到 1.30.0 / 2.2.0 并补 `issuer=` 校验；Google 文档明确「A2A 直连 Gemini Enterprise 不经 Agent Gateway」，说明网关策略有旁路，多入口工具治理需显式登记「哪些路径不受策略约束」。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| MCP 协议本身 | 2026-07-28 规范进入 9 月生态消化期；官方 Python SDK 曝 OAuth 凭据窃取高危漏洞，9/28 发布安全公告 | MCP 官方博客 / GHSA 公告 / The Hacker News | 是 |
| MCP server/client/gateway | 安全与 auth 进展为主；恶意 server 指向伪造授权端点成为实证攻击面 | cycode / truefoundry 等 | 是 |
| A2A | 已归 Linux Foundation AAIF（2026-08 中旬，窗口外）；本周无新规范版本；Google 文档澄清 A2A 直连不走 Agent Gateway | GitHub API / Google 文档 | 是 |
| Google Agent Gateway | 文档更新为 Agent Platform 治理主组件；Scale AI 参考架构（09-22）与三方报道（09-30）确认其位置与旁路限制 | Google Cloud 文档 / dataphoenix | 是 |
| Composio | 本周无重大公开动态；9 月上旬内容营销 | composio.dev（窗口外） | 否（状态记录） |
| Arcade | 本周无重大公开动态；定位为带逐用户 auth 与 MCP gateway 的 actions runtime | mintmcp / nango（窗口外） | 否（状态记录） |
| Nango | 本周无重大公开动态；持续输出 agent API 集成对比文 | nango.dev（窗口外） | 否（状态记录） |
| Pipedream Connect | 本周无重大公开动态；被列为托管 auth + 预建工具集成层 | nango / zapier（窗口外） | 否（状态记录） |
| AWS AgentCore Gateway | 官方博客「多账户 Agent + Gateway + MCP」（约 09-24/25）；Netskope 联合治理文章（约 09-27，页面被拦截未取全文） | AWS 官方博客 | 是 |
| Microsoft Toolbox / MCP-compatible endpoint | Foundry 文档确立工具箱 = 单一托管 MCP 端点；09-29 更新工具箱鉴权文档（OAuth 身份透传） | Microsoft Learn | 是 |

**MCP 协议与官方 Python SDK 安全缺陷** 在生态层面，2026-07-28 规范把核心从有状态握手改为无状态核心（删除 initialize / initialized 与 `Mcp-Session-Id`，每次 JSON-RPC 请求自包含，能力查询改为按需 `server/discover` RPC；新增 `Mcp-Method` / `Mcp-Name` 头供网关按操作路由；长任务改为 Tasks 扩展（`CreateTaskResult` + `taskId` + `tasks/get` / `tasks/update`，状态含 working / input_required / completed / failed / cancelled）；对话内富 UI 改为 MCP Apps 扩展（`_meta.ui.resourceUri` → `ui://` 资源、沙箱 iframe + postMessage JSON-RPC）；授权侧 RC 引入 OAuth 2.1 + OIDC 要求及 Enterprise-Managed Authorization 扩展；Roots / Sampling / Logging 拟弃用并配 SEP-2596 最短 12 个月弃用窗口）。真正在窗口内落地的硬事件是安全侧：官方 Python SDK 被披露授权服务器校验缺失——攻击者控制的 MCP server 可把 client secret、authorization code 与 PKCE 验证值诱导发送到攻击者 token 端点，进而换取真实服务访问令牌；影响 1.x 的 1.9.1–1.29.1 与 2.x 的 2.0.0–2.1.1，修复于 1.30.0 / 2.2.0（2026-09-07 发布，但当时仅以「行为变更」列入 release notes，09-28 才发布安全公告）；评分高危 7.5（无人值守的机器对机器 provider）/ 6.5（交互式 provider），截至 09-29 未分配 CVE。修复不够彻底：`ClientCredentialsOAuthProvider`、`PrivateKeyJWTOAuthProvider` 还须显式传 `issuer=` 才真正生效，被弃用的 `RFC7523OAuthClientProvider` 无此选项须迁移。任何自建 OAuth 客户端都要把「期望 issuer 白名单 + 拒绝重定向」作为强制校验，并把升级 SDK 与轮换凭据、清理旧注册当作一套动作同时执行。

**A2A（Google / Gemini Enterprise / 跨 Agent 协议）** 协议本体本周无新规范版本（最新 v1.0.1，2026-05-28，窗口外）。可核的新动态集中在治理层与注册路径：Google 文档明确「策略随注册路径而异」——直接注册到 Gemini Enterprise 的 A2A agent 流量不经 Agent Gateway，网关策略不生效；从 Agent Registry 导入的 agent，治理策略只对与已配置网关关联的注册表内 agent 生效；Gemini Enterprise agent 之间、以及 agent 与 MCP 数据连接器之间的直连通信也不触发网关策略执行。最重要的不是新增协议能力，而是「治理覆盖不齐」这一被文档化的事实——多入口注册会让同一组织内的 agent 流量一部分受策略约束、一部分旁路，审计与越权防护存在结构性盲区。参考架构侧，Scale AI 于 2026-09-22（窗口外）发布与 Google Cloud 的方案：以 A2A + MCP 作互操作接口、Google Agent Registry 做发现，工作负载跑在客户自己的 GCP 项目 / VPC / 加密密钥内；该文未给出客户部署、定价或 benchmark。

**AWS AgentCore Gateway + Identity** 官方博客「多账户 Agent + Gateway + MCP」（约 09-24/25）给出「中心平台账号 + 业务线账号」模式：各业务线把自身数据与工具以 MCP server 暴露，平台账号的 Gateway 为 agent 提供统一端点做工具发现与调用。入门指南文（约 09-27）概述 AgentCore Identity 的职责：控制「谁可调用 agent」与「agent 可代表用户访问什么」，经 IAM 或 OAuth 实现，可与 Cognito 配合。coding-agents 示例仓（约 09-28）显示用户经 Cognito 登录后身份随工作流进入 OpenTelemetry，CloudWatch 可按人 / 按 agent 展示用量。AWS 的路线是「网关承担入站授权 + 出站凭据」的托管中间人模型，把凭据从 agent 代码挑到平台层；接入时应走 Gateway 托管凭据而非在 agent 内直存密钥，同时「凭据集中」意味着网关本身成为高价值攻击目标。局限：博客正文 HTML 取得时 Response body incomplete，仅得到导航层，本对象只能采用标题 / 摘要层可核对的定位表述。（[AWS 官方博客](https://aws.amazon.com/blogs/machine-learning/build-a-multi-account-ai-agent-with-agentcore-gateway-and-mcp/)、[AgentCore 初学者指南](https://builder.aws.com/content/3JuZJFm3sOphgJS2oFHu1xq7D3b/amazon-bedrock-agentcore-a-beginners-guide)、[coding agents 示例仓](https://github.com/aws-samples/sample-amazon-bedrock-agentcore-coding-agents)）

**Google Agent Gateway（Gemini Enterprise Agent Platform）** 官方文档把 Agent Gateway 定位为 Agent Platform 的关键执行组件，是所有 agentic 交互（用户↔agent、agent↔工具、agent↔agent）的网络出入口。治理四件套：Agent Identity（为每个 agent 分配唯一 SPIFFE ID 作数字签名，用于认证 / 访问控制 / 审计；默认由 Context-Aware Access 以 mTLS + DPoP 做端到端加密认证）、Agent Registry（已批准 agent / 工具 / MCP server / 端点目录）、Policies（IAM Unified Access Policies 默认全拒、需显式授权；Model Armor 实时扫描用户 prompt 与工具响应；Semantic Governance Policies 用自然语言规则阻止不安全工具组合；自定义授权引擎经 Service Extensions 委派三方决策）、Agent Gateway（mTLS 终止、协议转换 MCP / REST / gRPC、策略执行），并输出 Agent Observability 遥测到 Cloud Logging / Trace。这是本周云厂中治理要素最完整的一套，把零信任（mTLS / DPoP / SPIFFE）直接落到 agent 运行时；但其对 A2A 直连的旁路说明该闭环并非全覆盖。（[Agent Gateway 概览](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/agent-gateway-overview)、[Agent Identity 概览](https://docs.cloud.google.com/iam/docs/agent-identity-overview)）

**Microsoft Toolbox** Foundry Agent Service 概览（ms.date 2026-09-25，属窗口内文档更新）把 Toolboxes 确立为核心组件：把 web search、file search、code interpreter、MCP servers、自定义函数等工具「一次性策管」，经单一托管 MCP 端点共享给任意 agent / 运行时，集中处理认证、治理与版本；发布侧可经 Teams、Copilot 与 Entra Agent Registry。工具箱鉴权文档（updated_at 2026-09-29）给出「两个身份」模型：agent→toolbox 边界用 agent 自身身份，tool→data 边界由 Foundry 提供代表登录用户的凭据；认证类型含匿名、共享凭据、服务身份、登录用户身份四类；Foundry 负责 token 获取 / 交换 / 刷新 / 注入与逐用户 token 隔离、consent 生命周期与 401/403 重试。微软把「逐用户令牌隔离」这一最易自建出错的安全管道收进平台，对多用户 SaaS 型 agent 是强卖点。（[Toolbox 鉴权文档](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/tool-authentication)、[Foundry Agent Service 概览](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)）

**Postman Fabric Gateway（强信号，补入）** Postman 于 2026-09-29 宣布 Fabric Gateway 正式 GA，定位为「协议无关的 agentic 世界控制面」，统一治理 AI agent、LLM 与 MCP server 如何发现并访问 API、工具及其他 agent。API 工具厂商切入 agent 治理层，说明「网关」正从协议实现变成独立产品品类。局限：新闻稿被 403 拦截、报道正文抽取失败，仅取得标题 / 摘要级信息，定价、配额、支持的协议清单等未披露或本次未取得，不做数值推断。（[Help Net Security 报道](https://www.helpnetsecurity.com/2026/09/29/postman-fabric-gateway/)、[Business Wire 新闻稿](https://www.businesswire.com/news/home/20260929329910/en/)）

**集成商与社区开源** Arcade、Composio、Nango、Pipedream Connect 本周无重大公开动态，定位稳定（Nango 编码 agent 跨 1000+ API 生成自定义工具 + 内建 MCP server + 白标逐用户 auth；Composio 托管 tool-calling + 1000+ 应用认证 + 远程沙箱；Arcade 逐用户 auth + MCP gateway + 身份集成；Pipedream Connect 托管 auth 集成层），与云厂网关 GA 形成「平台化 vs 长尾连接」分工，本周不做趋势外推。开源侧，agentic-community/mcp-gateway-registry（自述企业级 MCP Gateway & Registry，安全 OAuth、动态工具发现、Keycloak / Entra 集成）9/29 有代码推送，说明「受治理的工具访问」已从厂商叙事变成社区默认预期。另需注意：MCP 规范仓 discussion #804（Gateway-Based Authorization Model）为一次已关闭提案的窗口内后续更新（updated_at 9/25），不构成 MCP 新规范动向；正式授权方向以 2026-07-28 的 OAuth 2.1 / OIDC 要求与 EMA 扩展为准。（[mcp-gateway-registry](https://github.com/agentic-community/mcp-gateway-registry)、[MCP discussions #804](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/804)）

一句话趋势判断：工具网关本周完成「从协议概念到 GA 产品、从连接功能到安全信任边界」的双重跃迁——云厂以「网关 + 目录 + 逐 agent 身份」三件套收口，平台商以协议无关控制面抢跨云治理；而 MCP Python SDK 的 OAuth 漏洞提醒：网关在收敛连接的同时也集中了信任风险，「实现可信度」成为新的议价与准入门槛。

## 权限层：Agent 成为与人类并列的第一类身份

本周最强信号是 Agent 身份从「应用注册的附属物」正式升格为独立可治理对象。微软本周把 agent 当成有 owner、有生命周期、可被 block / 删除 / 恢复的第一类主体——Foundry 为每个 Hosted agent 自动创建专属 Entra 身份，M365 admin center 的 Agent Registry 提供 install / activate / block / delete / 恢复窗口 30 天 / 指派新 owner 等治理动作，并新增 Agent ID Administrator 角色。三云在身份层收敛到同一套要素：独立身份 + 短时凭据 + 逐用户委派 + 审计；差异在治理落点（微软强在 owner / 生命周期，Google 强在零信任密码学，AWS 强在云内 IAM 集成）。对自建方案：必须在架构上分成两个身份（agent 自身身份 vs 代表用户的委派身份），并把逐用户 token 隔离做成平台能力而非 agent 代码；越权防护的实证风险已量化；委派链的每一跳都必须校验，缺一跳即全链失守。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| Microsoft Entra Agent ID / Foundry agent identity | 窗口内密集更新：Foundry 概览（09-25）、Toolbox 鉴权（09-29）、M365 admin center agent 治理动作（09-23/26）、Entra Agent ID 生命周期策略、Agent ID Administrator 角色 | Microsoft Learn | 是 |
| Microsoft Agent 365 / Agent Registry | 中央注册表 + 生命周期 + 条件访问；第三方称 Copilot Autopilot 集成 Entra 身份治理于 09-25 发布 | Microsoft Learn / Yahoo（NIST 稿） | 是 |
| Google Agent Identity / Gateway / Gemini Enterprise auth | Agent Identity 为每 agent 配 SPIFFE ID（mTLS+DPoP），与 Registry / Gateway 协同；网关默认拒绝 IAM UAP、Model Armor、语义策略 | Google Cloud 文档 | 是 |
| AWS AgentCore Identity | IAM / OAuth 控制「谁可调用 agent / agent 可访问什么」，可配 Cognito；身份进入 OpenTelemetry 供 CloudWatch 按人 / 按 agent 计量 | AWS Builder / aws-samples | 是 |
| Arcade Auth / tool permission | 本周无重大公开动态；定位为逐用户 auth + MCP gateway + 身份集成 | mintmcp / nango（窗口外） | 否 |
| Composio Auth | 本周无重大公开动态；管理 1000+ 应用认证 + token 自动刷新 | composio.dev（窗口外） | 否 |
| Nango OAuth / token management | 本周无重大公开动态；白标逐用户 auth + token 管理 | nango.dev（窗口外） | 否 |
| Pipedream Connect managed auth | 本周无重大公开动态；托管 auth 集成层 | nango / zapier（窗口外） | 否 |

**Microsoft Entra Agent ID / Foundry / Agent 365** 微软在窗口内把「agent 身份治理」补成完整链路。Foundry 侧：每个部署到 Foundry 项目的 Hosted agent 自动获得专属 Entra ID 与专属端点，无需共享凭据；Identity & Security 列为一级组件。权限层：M365 admin center 的 Agent Registry 提供 install / uninstall、activate、block / unblock、delete / restore / permanently delete（30 天恢复窗口）、start / stop、assign / add / remove owner（处理无主 agent）、publish to store / reject submission 等动作，并配合 Entra ID Governance 的生命周期策略在规模上治理 Entra Agent IDs。角色层：Entra 内置角色新增 / 强化 Agent ID Administrator。第三方（yahoo 稿，约 09-27）称微软于 2026-09-25 发布 Copilot Autopilot 并集成 Entra 身份治理。微软把 agent 当成与人类用户并列的第一类身份纳入既有 IAM 治理面，使「撤销 / 停用 / 交接」成为可操作动作；「无主 agent」是与「无主服务账号」同级的治理风险。（[M365 agent 治理动作](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/agent-actions)、[Foundry Agent Service 概览](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)）

**Google Agent Identity / Gateway** 把身份做成零信任密码学基座：Agent Identity 为每个 agent 分配唯一 SPIFFE ID，默认由 Context-Aware Access 以 mTLS + DPoP 做端到端加密认证；与 Agent Registry、Agent Gateway 协同（网关先校验权限，再执行 IAM UAP 默认全拒、Model Armor、语义治理策略，经 Service Extensions 委派三方决策），Agent Identity Auth Manager 简化 agent 与工具间的 OAuth 2.0 握手，全部交互经 Agent Observability + Cloud Audit Logs 留痕。关键旁路：直接注册到 Gemini Enterprise 的 A2A agent 不经 Agent Gateway，其策略与审计不生效。把 agent 身份做成「密码学可验证 + 默认拒绝 + 全量审计」是企业最严格的姿态，但审计完整性取决于注册路径的纪律。

**AWS AgentCore Identity（含 Gateway 凭据托管）** 其职责被公开定位为「控制谁可调用 agent、以及 agent 可代表用户访问什么」，通过 IAM 或 OAuth 实现，并可与 Cognito 等身份 provider 配合；身份随工作负载进入 OpenTelemetry，CloudWatch 可按人、按 agent 展示用量；Gateway 作为托管 MCP tool server 同时承担入站授权与出站凭据处理。差异是「用现成 IAM / OAuth / Cognito 生态承接 agent 身份」，对企业已有 AWS 治理栈最省迁移；但本周公开材料多为教程 / 示例级，缺少正式产品公告支撑强结论。本对象本周未取得可核的具体数字，具体参数（支持的身份类型清单、token 有效期、审计字段）未取得，不作数值推断。

**MCP 授权与委派链** 本周权限层最硬的事件是 MCP Python SDK 授权服务器校验缺失漏洞，其本质是「委派链上的一跳未校验」。机制：MCP client 登录时先向所连 server 询问其授权服务器地址，受影响版本未始终校验该答案，恶意 server 可把 client secret、authorization code 与 PKCE 验证值诱导发往攻击者控制的 token 端点；PKCE 本是防止授权码被复用的保护，交出其 proof key 即同时失效。影响面按 provider 分层；仅当应用以 SDK 作 HTTP MCP client、连接受不完全控制的 server、且持有真实服务凭据时受影响；用 SDK 建的 MCP server、本地 stdio client、自带 token 的 client 不受影响。修复版本 1.30.0 / 2.2.0 改为「先算出期望的授权服务器，再拒绝任何命名不同者」。协议方向：MCP 2026-07-28 RC 已把 OAuth 2.1 + OIDC 列为要求，并引入 Enterprise-Managed Authorization 扩展，把授权从「每用户交互式同意」扩到「企业集中托管」。这起事件的普遍教训是：授权服务器发现是委派链的信任根，缺校验即等于把所有下游令牌的获取权交给对手；任何自建 OAuth 客户端都要把「期望 issuer 白名单 + 拒绝重定向」作为强制校验。（[GHSA-qx49-fqc8-xw99](https://github.com/modelcontextprotocol/python-sdk/security/advisories/GHSA-qx49-fqc8-xw99)、[The Hacker News 报道](https://thehackernews.com/2026/09/official-mcp-python-sdk-flaw-can-let.html)、[Aembit：MCP OAuth 2.1 / PKCE 与 AI 授权](https://aembit.io/blog/mcp-oauth-2-1-pkce-and-the-future-of-ai-authorization/)）

**集成商托管 Auth与监管责任** Arcade、Composio、Nango、Pipedream Connect 本周无重大公开动态，其权限层共性（逐用户 OAuth、token 托管与自动刷新、白标授权界面）与云厂平台化的逐用户 token 隔离正面重叠，长期看平台商可能吃掉中长尾；若需快速覆盖大量 SaaS，可借集成商托管 auth 起步，但要把「凭据所有权与可迁移性」作为选型硬指标。规则侧，指定的动态池厂商（Auth0、WorkOS、Clerk、Descope、Permit.io、Aserto）本周未见面向 AI Agent / MCP / tool permission 的明确发布，按规则不写其通用 IAM 新闻；权限层的规则侧动态来自监管与责任：NIST 的 AI Agent Standards Initiative（2026-02-17 启动）以 agent security、agent identity and authorization、open-source agent protocols 三支柱推进，但 agent 专项 overlay 原计划 2026 H2 且尚未正式承诺，第三方分析（Cloud Security Alliance，2026-03）认为成型标准最早 2027；FTC 主席 Andrew Ferguson 于 2026-09-25 明确「开发者对 agent 行为负全责」，并驳斥「自主行动者」免责抗辩。第三方调研（AvePoint 委托 Osterman，750 名 IT 负责人）称 88.4% 企业在过去 12 个月遭遇 AI agent 相关安全事件，最常见为数据泄露 50.1% 与恶意 / 不可信输入操纵 49.6%，而 82.7% 管理者对防未授权访问有信心——该数据为厂商委托、存在利好其治理产品的动机，仅作方向性参考。责任在向开发者 / 部署者收拢，而可依据的技术标准尚未落地，形成「高合规压力 + 低标准供给」的窗口期；「审计可追溯（谁批准了这次行动）」因此成为本期的实际刚需。（[Yahoo News：NIST 标准进展](https://www.yahoo.com/news/politics/articles/three-months-nist-federal-ai-154844664.html)）

权限层本周从「给 agent 发个令牌」升级为「把 agent 当作与人类并列、可登记 / 可撤销 / 可追责的第一类身份来治理」——三云在「独立身份 + 短时凭据 + 逐用户委派 + 审计」上收敛；同时 MCP SDK 委派链漏洞与「开发者负全责」的监管表态共同指向同一结论：授权与审计必须逐跳可验证，任何一跳缺失都会把整个委派链变成攻击面。

## 记忆知识层：Context Database 成型与「失败可见化」

本周四条主线。其一，「Context Database」概念被头部玩家坐实为产品形态：火山引擎 OpenViking v0.4.22（09-28）把「Memory + Knowledge RAG + Skills」收进一个文件系统式 context database，记忆层不再只是「向量检索 API」，而是同时承载上下文、知识、技能库的持久层。其二，竞争焦点从「能不能记住」转向「失败是否可见、结果是否可验证」：Mem0 v2.2.1（09-25）修的是「向量库拒收却被当作 ADD 成功」与打分口径；Cognee v1.6.2（09-29）修的是 embedding 静默截断、按模型 token 上限切块、错误暴露真实原因；两家同期收敛到同一主题——不许静默丢数据。其三，外部知识摄取层从「抓取工具」升级为「知识资产 + 资本叙事」：Firecrawl 的 Alexandria 与 7500 万美元 B 轮仍是本模块窗口内最强商业信号（属邻期，按窗口规则处理），其窗口内动作集中在安全边界与成本遥测。其四，OpenViking 的「会话开始注入 Skill 目录 + 整包索引 + skills/find 返回单条最佳命中」是一套可直接对标的技能库承载范式，且其明确把 `peer_role: "person"` 迁移为 `sender`，是依赖方升级时必须处理的迁移点。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| OpenViking | 有窗口内动态（v0.4.22 09-28；sdk/go/v0.0.4 09-29） | GitHub release + 全文 | 是 |
| Mem0 | 有窗口内动态（v2.2.1 / ts-v3.3.1 09-25；v2.2.0 等 09-23 晚在窗内） | GitHub release + commits | 是 |
| Cognee | 有窗口内动态（v1.6.1 09-24；v1.6.2 09-29） | GitHub release + 全文 | 是 |
| supermemory | 有窗口内动态（09-25~09-30 多条提交；无新 release） | GitHub commits | 是 |
| Letta | 本周无重大公开动态（窗口内 0 提交，最新 push 09-10） | GitHub commits | 是（限述） |
| Zep / Graphiti | Graphiti 有动态（MCP SDK 2.x 等）；Zep 主仓窗口内 0 提交 | GitHub commits | 是 |
| Firecrawl | 有窗口内动态（安全修复 + 遥测，密集提交） | GitHub commits + 官方 blog | 是 |
| Crawl4AI | 弱动态（窗口内仅 1 条 README / cloud 提交；v0.9.4 在窗口前） | GitHub commits / releases | 是（限述） |

**OpenViking（volcengine，Context Database for AI Agents）** 窗口内两个正式发布：v0.4.22（2026-09-28）与 sdk/go/v0.0.4（09-29），并伴随 09-29、09-30 高频提交（keywords 搜索类型、事件时间衰减排序、全局召回统一候选精排、installer 默认安装 CLI、`feat(mcp) 补齐 ACL 操作与安全的用户目录查询`）。已读 release 正文：①运行时配置与 Account 隔离——新增 Cluster / Account 两级配置 API，无需改 `ov.conf` 或重启，Account 可独立配置 VLM / Query Planner / Embedding / 远端 VectorDB / 飞书凭证；②Skill 检索与分发——Skill 整包参与索引，`skills/find` 与 `search(mode="context")` 每个 Skill 只返回一条最佳命中，MCP 新增 `add_skill`，各 memory 插件在会话开始注入 Skill 目录；③检索存储——本地向量 cosine 分数归一化到 [0,1]，新增 openGauss DataVec 向量后端与 Jev rerank provider；④可观测——新增 QueueFS 处理耗时与 asyncio executor 指标、observer API 支持 JSON 格式。破坏性变更中与自托管方案直接相关的是 #5355：`--peer-role person` 报错，须改用 `sender`。定位意义：记忆层的边界从「记住用户」扩张到「分发 Agent 能力」，Memory API 与 Skill registry 正在合流为一个 Context / Skill Datastore；议价落点在于用「统一文件系统 + 技能分发」制造迁移成本。（[OpenViking v0.4.22](https://github.com/volcengine/OpenViking/releases/tag/v0.4.22)、[sdk/go/v0.0.4](https://github.com/volcengine/OpenViking/releases/tag/sdk/go/v0.0.4)）

**Mem0** 窗口内两个发布批次（09-23 一批含 v2.2.0、ts-v3.3.0、openclaw-v1.2.1、opencode-v0.4.1、pi-agent-v0.3.2、deepseek-plugin-v0.3.2；09-25 的 v2.2.1 + ts-v3.3.1）。v2.2.1 正文清一色是「不许静默丢数据 / 错打分」：`add()` 不再把被向量库拒收的记录当作成功 ADD 上报，只有真正写入的记录才进 history、实体链接与返回值，全部落空则抛 `VectorStoreError`；恢复 `Memory` / `AsyncMemory` 的 context-manager 协议；Bedrock 的 Anthropic 路径改为取第一个含文本的 Converse content block；Turbopuffer 过滤器改为应用全部算子；`euclidean_squared` 分数改 `1/(1+distance)`；S3 Vectors 打分改为 metric-aware。窗口内还含 User Profiles v1 SDK 方法与 Hermes Mem0 插件迁移。其发布矩阵里存在 `openclaw-v1.2.1` 集成包，说明 Mem0 已把 OpenClaw 作为一类分发目标；这份改动也是一份现成的「记忆故障模式清单」。（[Mem0 v2.2.1](https://github.com/mem0ai/mem0/releases/tag/v2.2.1)）

**Cognee** 窗口内两连发：v1.6.1「Google Sync & Visualization」（09-24）新增 Google Drive OAuth 连接器、Gmail 与共享盘同步、`/visualize/json` 分块流式返回、chunk 携带文档 external_metadata 并在 hybrid（语义 + 关键词）检索中回传，dlt 升为核心依赖；v1.6.2「Embedding reliability & Slack history」（09-29）新增 Slack 会话历史导入与持续同步、按各 embedding 模型的 token 上限切块消除静默截断、token 计数改用各 provider 的 tokenizer 并计入模型自身 special tokens、Skills 目录迁移到 `.agents/skills`、embedding 错误暴露真实原因并快速失败。两周连续做「外部知识摄取 + 摄取正确性」；Skills 目录迁到 `.agents/skills` 与 OpenViking、OpenClaw 的 skill 目录趋同，说明该目录正成为跨工具技能存放的事实约定。（[Cognee v1.6.1](https://github.com/topoteretes/cognee/releases/tag/v1.6.1)、[v1.6.2](https://github.com/topoteretes/cognee/releases/tag/v1.6.2)）

**supermemory** 窗口内无新 release（最新 server-v0.0.8，2026-08-17，窗口外）；11 条提交集中在供应链安全与 MCP 可观测：移除脆弱 ZIP extractor 并 patchtar（#1727）、连续多条 patch 高严重度传递依赖（09-29）、MCP server 仅元数据 PostHog 埋点与按 conversation id 分组工具调用、memory-graph 区分 document link 与 derives 关系、说明高级 PDF 提取可用性。本周是维护周，本周内无面向公众的产品发布公告。本次未取得窗口内官方 blog / changelog 的产品级公告。解决方案透镜（未披露写未披露）：能力 / 形态＝记忆与上下文引擎，含本地 console 与记忆图谱；定价＝自托管 lite 许可上限 10,000 文档（据 0.0.8 release 正文），云端未在本次取证范围内；SLA / 交付 / 支持未披露。

**Letta 与 Zep / Graphiti** Letta（原 MemGPT）本周无重大公开动态，窗口内 0 提交，最新 push 2026-09-10，最新 release 0.16.8（2026-05-14）；其 open_issues_count 返回 0 与项目规模不符，疑为接口口径问题，不据此判断社区活跃度。其「有状态 agent + 自编辑记忆」路线本周无新证据，记忆层头部叙事正从「agent 自省式记忆」转向「可运维的 context datastore」。Graphiti 窗口内有实质提交：把 `mcp_server` 升到 MCP SDK 2.x（#1921，09-25），并按请求的 `group_id` 路由到对应图谱（#1926，09-25），实现多租户 / 多图谱隔离的 MCP 化；Zep 主仓窗口内 commits 为空。与 OpenViking 的 `add_skill` MCP 化、supermemory 的 MCP 埋点同向：MCP 正在成为记忆 / 知识层的统一接入协议，而隔离（group_id / ACL / 账号）成为其头等工程问题。

**Firecrawl** 窗口内无新 release（最新 v2.11.0，2026-06-19），动态集中在两条主线。安全 / 信任边界：Python SDK 停止向跨域 next URL 发送 API key（#4861），并把分页 next URL pin 到 api_url origin（Elixir / Java / Rust / Go / JS 五语言 SDK 同步）；safeFetch 在代理派发前拒绝私有目标（SSRF 防护前置）；报告浏览器实际着陆的 URL。成本与遥测：在 AI SDK generate span 上记录 cached 与 reasoning token；把 branding / prompt-injection-guard / crawl-prompt 的 LLM span 打上 job id；为 branding LLM 调用计费并补齐所有在用模型定价；prompt injection guard 失败时不计费（09-23，窗内）；零数据保留抓取下禁用 LLM 遥测。官方 blog 窗口内有一篇 09-24 的免费 web search API 对比文，推 keyless（零配置、1,000 免费 credits / 月，官方口径）。抓取层正被要求同时充当安全执行面与成本可计量面，keyless 与每身份 opaque 链接则把匿名流量做成可归因对象。

**Crawl4AI** 弱动态限述：窗口内仅 1 条提交（09-25），把 README 改为「库 and 云（Crawl4AI Cloud with one key）」两条使用路径并挂发布横幅。v0.9.4 的发布时间为 09-23，早于窗口起点，属窗口外，不以它表述本周动态。信号是商业形态而非技术能力——开源抓取库正把托管云作为主变现路径。

一句话趋势判断：记忆 / 知识层本周的竞争主线是「把 context 做成可运维的持久层」——OpenViking 用运行时配置 + 账号隔离 + 技能整包索引把 Context Database 产品化，Mem0 / Cognee 用「失败可见化 + 按模型 token 上限切块」消除静默丢数据，Firecrawl / Crawl4AI 把 web 摄取层推成安全可计量的云 API；而 MCP 正成为记忆 / 知识 / 技能的统一接入协议，叠加 `.agents/skills` 目录约定趋同，预示「记忆 + 技能」正在合流为 Agent 的基础上下文资产。

## 观测治理层：skill 成为治理与遥测的一等对象

本周四条主线。其一，LLM / Agent 可观测平台开始接管「技能与治理」：Langfuse v4.46.0（09-25）新增 skills 基础管理、v4.48.0（09-30）支持技能草稿变更与按 hash 取文件内容；AWS 在同周上线 Agent Toolkit 批量技能更新 / 版本检查（09-30）与 Marketplace 计量 agent skill（09-30）。其二，成本与 token 口径成为本周共同战场：Langfuse 连续修 Anthropic 1 小时缓存写、OpenAI cache-write token 定价与失败 / 取消生成的 usage 推断；Phoenix 修 bash 工具 span 非零退出；Firecrawl 记录 cached / reasoning token。其三，平台级 guardrails / 评测出现明确新动作：Google 09-29 新增语义治理策略自定义拒绝消息，代码安全工具 CodeMender v0.10.0 增加 SARIF 导出与按严重度 CI 门禁；AWS 09-29 上线 Bedrock Managed Agents（预览，在 AWS 身份 / 权限 / 治理控制下运行）。其四，对自建方案的提示：LangSmith 的 agent addressing 与 OTel 导出补全是 trace 可回放 / 可追责的基础原语，而 Langfuse 移除 trace playback 提示回放尚未稳定，不宜过度承诺。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| LangSmith | 有窗口内动态（py-sdk 0.14.1 09-25、0.14.2 09-30） | GitHub release + body | 是 |
| Langfuse | 有窗口内动态（v4.44.0~v4.48.0，≥6 个发布） | GitHub release + body | 是 |
| Helicone | 本周无重大公开动态（窗口内 0 提交，最新 push 09-16） | GitHub commits | 是（限述） |
| AgentOps | 本周无重大公开动态（窗口内 0 提交，最新 push 06-25） | GitHub commits | 是（限述） |
| Braintrust | 有窗口内动态（py-sdk v0.43.0 09-28 + 多集成提交） | GitHub commits / releases | 是 |
| Arize Phoenix | 有窗口内动态（phoenix-otel 0.17.2 09-28；phoenix-mcp 4.3.14 09-29） | GitHub release / commits | 是 |
| Coze Loop | 弱动态（窗口内 1 条提交 09-28；无新 release） | GitHub commits | 是（限述） |
| OTel for Agents / tracing 标准 | 有窗口内动态（genai 仓 `gen_ai.skill.*` 属性提交 09-29） | GitHub commits | 是 |
| AWS（可观测 / 评测 / 治理） | 有窗口内动态（Agent Toolkit 技能批量更新 09-30；Bedrock Managed Agents 09-29；S3 Vectors pre-filter 09-30） | AWS What's New RSS | 是 |
| Google（可观测 / 评测 / 治理） | 有窗口内动态（09-29 语义治理自定义拒绝消息；09-24 CodeMender v0.10.0） | Google Cloud release notes | 是 |
| Azure（Foundry 可观测 / 评测） | 取证受限（What's New 仍为 August 2026） | Microsoft Learn | 是（记缺口） |

**LangSmith SDK** v0.14.1（09-25）与 v0.14.2（09-30）两条主线：「可寻址」与「可复现」。v0.14.2 新增 `ls.address` 句柄用于 agent addressing、MCP 补齐 OTel 导出中缺失的 tool name / call_id / tool definitions、只有主写副本保留原始 run id（跨副本 trace 一致性）、包装型 HTTP 错误时保留响应体。把 agent 做成可寻址对象，是 Agent 从「一次调用」变成「可长期跟踪实体」的前提。**Langfuse** 窗口内至少 6 个正式发布（v4.44.0~v4.48.0），主线：AI Gateway 收编 Anthropic 遥测与 full mode 输入；ClickHouse Native 写入提升吞吐；缓存写 / 推理计费口径修正与 Sonnet 5.5 / GPT-6.1 Sol / GPT-6 Astra Ultrafast 定价；skills 管理进平台；主动移除 trace playback。。**Braintrust** py-sdk v0.43.0（09-28）采集 Anthropic 用量与拒答元数据，窗口内其余工作是框架集成广度（同时覆盖 AgentScope、Pipecat、Agno、DSPy、Claude Agent SDK、LiveKit STT 等，含语音 STT 用量）；拒答与部分模式用量从此可被评估与计费核对。**Arize Phoenix** arize-phoenix-otel v0.17.2（09-28）修 `register()` 在 OTel 导出器 1.45 下的崩溃；把 bash 工具非零退出标为 span error；评测沙箱镜像内置 Claude Code 与 Codex（仅 root 权限）；与 Langfuse、Braintrust 同期撞到同一 OTel 兼容问题，说明标准版本漂移是全行业共同的集成风险。**Coze Loop** 弱动态限述：窗口内仅 1 条提交（09-28，清理派发前被拒绝的评测 run 残留），仍是评测生命周期一致性问题，本周无新增能力信号。**Helicone / AgentOps** 本周静默（窗口内 0 提交），仅记录事实，不推断是否停止运营；在 Langfuse 密集发版的对照下，两者产品节奏明显偏慢。

**OpenTelemetry for Agents / tracing 标准** `open-telemetry/semantic-conventions-genai` 窗口内有实质提交：把 `gen_ai.skill.*` 属性加入工具执行 span（#498，09-29），即把「技能」作为语义约定的一等遥测维度。这是本周最容易被忽略但跨厂商影响最大的标准动作——当 skill 成为 span 属性，观测平台、agent 平台与 context database 就能在同一语义下对齐「技能级」遥测。**AWS** 窗口内多条 What's New：AWS CLI 支持 Agent Toolkit 技能的批量更新与版本检查（09-30，覆盖 Kiro / Claude Code / Codex / Cursor）；Amazon Bedrock Managed Agents 预览（09-29，基于定制版 OpenAI Agents API，AWS-native，复用既有身份 / 权限 / 治理控制）；AWS Marketplace 计量 agent skill 正式可用（09-30）；S3 Vectors 新增元数据预过滤（09-30，宣称选择性过滤下召回提升至多 5x，厂商口径未独立核实）；CloudWatch Logs 自动索引高频查询字段（09-29）；End User Messaging 与 SES 提供 AWS MCP Server 的 AI agent skills（09-25）。AWS 正把 harness + skills + observability + governance 整体平台化。**Google** 09-29 语义治理策略的自定义拒绝消息（≤1000 字符，多策略同时拒绝时合并去重、无配置者回退通用消息）让策略拒绝对终端用户可解释；09-28 Provisioned Throughput 支持变更订单范围或续期、Gemini 3 经 Interactions API 预览支持；09-24 Gemini 3.8 Live GA 与 CodeMender v0.10.0（SARIF v2.1.0 导出与按严重度 CI 门禁）把 agentic 安全修复接进 CI/CD（此前 09-21 的 v0.9.0 已含交互式 HTML 安全报告、扩展 C#/Rust/Kotlin/Ruby/PHP 扫描与按轮延迟指标）。**Azure** 为取证受限而非静默：官方 What's New 当前取得的是「What's new for August 2026」，未见 9 月条目；不能据此判断 Microsoft 本周在可观测 / 评测层无动态。（[LangSmith v0.14.2](https://github.com/langchain-ai/langsmith-sdk/releases/tag/v0.14.2)、[Langfuse v4.48.0](https://github.com/langfuse/langfuse/releases/tag/v4.48.0)、[Braintrust py-sdk v0.43.0](https://github.com/braintrustdata/braintrust-sdk-python/releases/tag/py-sdk-v0.43.0)、[Phoenix otel v0.17.2](https://github.com/Arize-ai/phoenix/releases/tag/arize-phoenix-otel-v0.17.2)、[OTel genai 仓提交](https://github.com/open-telemetry/semantic-conventions-genai/commits)、[AWS CLI Agent Toolkit 技能更新](https://aws.amazon.com/about-aws/whats-new/2026/09/aws-cli-agent-toolkit-update-skill/)、[S3 Vectors 元数据预过滤](https://aws.amazon.com/about-aws/whats-new/2026/09/s3-vectors-introduces-metadata-pre-filtering/)、[Gemini Enterprise Agent Platform Release Notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)、[Foundry What's New](https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry)）

可观测治理层本周出现「skill 成为治理与遥测一等对象」的跨厂商共振；与此同时成本口径（缓存写 / 推理 token）与治理可见性（自定义拒绝理由、工具失败记 error、CI severity 门禁）成为共同硬指标，而 OTel 导出器 1.45 兼容问题被三家同期撞上，暴露出标准版本漂移已是全行业集成风险。

## 平台层：一条命令的交付完整度

AWS 在运行效率上给出本周最硬的数字：新一代 AgentCore Runtime 已可用，弹性内存回收（按实际用量而非峰值计费）+ 快照式冷启动，P75 冷启动 1.9–2.0 秒（镜像 200MB–2GB），对比 V1 的 5.4–30 秒；覆盖五个区域；另有 9 月新增交互式 shell、生命周期钩子、Consent Portal、TypeScript 评估。平台层拼的是「七个面」而非模型：Runtime / Session、Memory / Context、Gateway / Tools、Identity / Auth、Sandbox / Browser / Code、Observability / Eval——AWS 本周在 Harness / Identity / Evaluations 三条同时补齐，Google 补治理策略与模型货架，Microsoft 维持 Hosted Agents GA 后的平台面。国内三家的窗口内公开动态偏少：阿里云百炼未见产品级发布（仅 9/24 上架决策模型预览）、火山方舟 Agent Plan 文档更新（文档更新不等于产品发布）、腾讯云 ADP 未取得窗口内条目；三家仍以低代码平台 + 知识库 + 渠道分发为主，但国内本周更强的是开源底座与模型货架。对 OpenClaw 的对照结论不变：Runtime / Session 与 Gateway / Tools 是强项，Identity / Auth 与 Observability / Eval 是薄弱面。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| AWS Bedrock AgentCore | Runtime V2 GA（9/18，窗口前）；9 月新增交互式 shell / 生命周期钩子 / Consent Portal / TS 评估 | AWS What's New / AgentCore release notes | 是 |
| Google Vertex AI / Gemini Enterprise Agent Platform | 9/28 拒绝消息定制、Interactions API 支持 Gemini 3（预览）；9/24 Gemini 3.8 Live GA；9/22 Muse Spark 1.3 预览 | Google Cloud release notes | 是 |
| Microsoft Foundry Agent Service / Copilot Studio / M365 Agent SDK | 窗口内未取得官方条目；背景：Hosted Agents / Voice Live / Toolboxes GA | Microsoft Foundry 博客 | 限述 |
| 阿里云百炼 / Model Studio / PAI | 窗口内未取得产品级发布；9/24 上架 decision-model-preview；记忆库文档 9/28 更新 | 阿里云帮助中心 | 限述 |
| 火山引擎 Ark / Coze / OpenViking | Agent Plan 文档 ~9/28 更新；窗口内未取得发布级公告；开源侧 OpenViking v0.4.22（9/28）、sdk/go/v0.0.4（9/29） | 火山方舟文档 / GitHub | 限述 |
| 腾讯云智能体平台 / 元器 / CloudBase AI Toolkit | 本周未取得窗口内条目（检索命中页为 2025-08 / 2026-06 内容） | 腾讯云官方文档 | 否 |
| Databricks Mosaic AI Agent Framework / Agent Bricks | 推翻「本周未取得」初判：9/29 Agent Bricks CLI Beta；同日 GPT-6.1 Sol 上 Unity Gateway、Databricks Apps 水平扩展 GA | Databricks release notes | 是 |

**Databricks Agent Bricks CLI** 9/29 进 Beta：`databricks-agentbricks` 命令行工具用于在 Databricks 上构建并部署自定义代码 agent——从内置框架模板脚手架建项目、本地运行、再部署到 Databricks agent runtime，托管 memory、sessions、tools，并预接 MLflow tracing，全部在一条已认证命令内完成。这是平台层竞争落到「能否一条命令交付可观测的长时 agent」的直接证据；其差异点仍是数据与治理（Unity Gateway / MLflow / 权限），而不是运行时性能。同期还有两项配套发布：9/30 Lakeflow Jobs 表更新触发器支持 OpenSharing 对象与 system tables GA、Query tags GA；9/28 Workday Activity Logging connector（Beta）。**阿里云百炼** 窗口内未见平台级功能发布，只有 9/24 上架 `decision-model-preview`（面向高频业务判断的结构化决策模型，可依文本或业务状态并行完成分类、是非判断与评分，并返回概率分布与置信度，官方列出的场景含工单分流、内容审核、智能体路由与结果校验）；背景是智能体托管运行时 API 早在 6 月 29 日已上线，本周无增量。**火山引擎** 窗口内未见发布级产品公告，方舟 Agent Plan 文档页有更新但不作本周动态；真正可核实的增量在开源侧 OpenViking。**腾讯云 ADP** 本周无重大公开动态，产品动态页最新可见条目仍为 2025-08；其能力面早已铺开，但公开更新节奏明显慢于 AWS / Google，渠道分发（微信生态）是相对差异化。

托管 agent 平台的本周分水岭在「一条命令的交付完整度」：AWS 给 Harness 补交互 shell、生命周期钩子与 Consent Portal；Databricks 用 CLI 把脚手架到托管 memory / sessions / tools 与 MLflow tracing 串成一条认证命令；Microsoft 的长时 agent 韧性 / 状态 / HITL 已在 7–8 月成体系、本周间歇；Google 加码策略治理的用户可见性与模型货架。相比之下国内三家本周更强的是开源底座与模型货架，平台治理面更新较少。

## 云厂能力矩阵

说明：仅按本次已取证内容填写；无证据的单元格写「本次未取证」，不编造。单元格内「（背景）」表示来源为窗口前资料，仅作能力位置参照，不算本周动态。

| 平台 | Runtime/Session | Memory/Context | Gateway/Tools | Identity/Auth | Sandbox/Browser/Code | Observability/Eval | 本周强信号 |
|---|---|---|---|---|---|---|
| AWS Bedrock AgentCore | microVM 隔离会话 + 持久交互 shell（回放 256KB、每会话≤10 shell）；Runtime V2 快照冷启动（背景+9月条目） | 本次已读条目未取证（本次未取证） | AgentCore Gateway（JWT 入站）；生命周期钩子 before/after_tool_call 可 allow/deny；自定义 OpenAI 兼容 `apiBase` | AgentCore Identity + Consent Portal（终端用户审批 `portalUrl`，需 `openid` scope） | 托管默认环境与自定义容器；交互式 shell 执行（浏览器未取证） | AgentCore Evaluations 支持 TS 框架（Strands/LangGraph/OpenAI Agents/Vercel AI SDK） | 9 月条目：交互 shell、生命周期钩子、Consent Portal、TS 评估（按月归档，未标日期） |
| Google Vertex AI / Gemini Enterprise Agent Platform | Interactions API 预览支持 Gemini 3（9/28）；runtime 细节本次未取证 | Muse Spark 1.3 内置 1M token 上下文（9/24，预览） | Muse Spark 1.3 内置 MCP 工具调用（9/24） | Agent Identity（SPIFFE ID + mTLS + DPoP）、默认拒绝 IAM UAP、Agent Registry | CodeMender v0.10.0（增量扫描、SARIF、CI 门禁） | Agent Gateway + Model Armor + 语义治理遥测湖 | 9/29 语义治理支持自定义拒绝消息（≤1000 字符，多条策略合并去重） |
| Microsoft Foundry Agent Service / Copilot Studio / M365 Agent SDK | long-running agent API、resilience、状态管理、stream with reconnect、steer turn（背景 8 月刊） | 长时 agent 任务状态管理（背景） | Toolboxes（含网络隔离）、Tool search、MCP connector、OpenAPI/web search/code interpreter（背景） | Entra Agent ID + Toolbox 逐用户 token 隔离 + Agent Registry 治理动作（窗口内文档） | Code Interpreter、hosted agent 本地运行（背景） | Agent optimizer（成本/token）、合成评测集（背景） | 窗口内密集身份 / 工具箱文档，官方月刊最新为 2026 年 8 月 |
| 阿里云百炼 / Model Studio / PAI | 智能体托管运行时 API（背景 6/29） | 记忆库商业化（背景 7/21）、长期记忆 2.0 API（背景 1/31） | 知识库/MCP 统一为工具（背景） | API Key 加密存储、业务空间专属域名、分账（背景） | 本次未取证 | 新版应用评测（背景） | 9/24 上架 `decision-model-preview`（返回概率分布/置信度，列明智能体路由场景） |
| 火山·字节 Ark / Coze / OpenViking | 方舟 Agent Plan（全模态 + 专属 Harness + 积分计费，文档 ~9/28 更新，非发布公告） | OpenViking 上下文数据库（记忆+RAG+技能，窗口内发版） | OpenViking 补 MCP ACL 操作与安全用户目录查询（9/30 提交） | 本次未取证 | 本次未取证 | Coze Loop 本次未取得窗口内条目 | OpenViking v0.4.22（9/28）、sdk/go/v0.0.4（9/29） |
| 腾讯云智能体平台 / 元器 / CloudBase AI Toolkit | Multi-Agent 模式与工作流编排（背景 2025-08；托管 runtime 未取证） | 「变量与记忆」含 `SYS.Memory` 长期记忆（背景） | 工作流工具节点、模型广场第三方模型接入（背景） | 企业管理 + 工作空间权限分层（背景） | 本次未取证 | 应用评测升级：裁判模型/规则/代码三种评分（背景） | 本周无重大公开动态（产品动态页最新可见条目为 2025-08） |
| Databricks Mosaic AI Agent Framework / Agent Bricks | Databricks agent runtime，**托管 sessions**（9/29 CLI 一条命令接入） | **托管 memory**（9/29） | **托管 tools**（9/29）；Unity Gateway 供模型 | 本次未取证（Unity Gateway 模型访问已取证，身份面未取证） | 自定义代码 agent 脚手架/本地运行；Databricks Apps 水平扩展 GA（9/29） | **MLflow tracing 预接**（9/29） | 9/29 Agent Bricks CLI Beta + GPT-6.1 Sol 上 Unity Gateway |

矩阵缺口与原因：AWS 条目按整月归档且未标具体日；Microsoft / 阿里 / 腾讯三家官方页为动态渲染或有分页，以已读页面范围为准；Google 的 runtime 与观测面本周无窗口内条目；阿里 PAI、腾讯 CloudBase AI Toolkit、火山 Coze Studio / Loop 本次未取得窗口内独立条目，故未单列判断。

## 五个最强信号

按「对 Agent Harness 基础设施格局的信号价值」排序。

1. **OpenAI Agents API 加 computer use + always-on 产品 Dots（9/29，DevDay 2026）。** 同周把「托管 harness」从运行 agent 推到操作软件与常驻执行体（Dots 自带云电脑 + 自带浏览器 + 4,000+ 应用集成 + 未来 specialist dots 带独立身份），同时给出 GPT-6.1 Sol 与 GPT-6 Sol / Luna 降价 50% 的定价面。模型厂一次性占住模型、harness、沙箱编排与身份四层，把 E2B / Modal / Browserbase 等第三方沙箱 / 浏览器厂商降为供给方。局限：Recap 页动态渲染，隔离技术 / 配额 / 计费未披露。
2. **MCP 官方 Python SDK OAuth 凭据窃取漏洞（GHSA-qx49-fqc8-xw99，9/28 公告）。** 影响 1.x 的 1.9.1–1.29.1 与 2.x 的 2.0.0–2.1.1，修复于 1.30.0 / 2.2.0（9/7），评分 7.5 / 6.5；根因是「授权服务器发现」这一跳未校验。叠加同期的 MCP 2026-07-28 无状态化，工具连接层在快速收敛的同时，把信任链的集中风险暴露在 SDK 实现层，「实现可信度」直接变成治理采购的准入门槛。
3. **AWS AgentCore Harness 交互式 shell + lifecycle hooks + Consent Portal（9 月条目；新版 Runtime GA 9/18）。** 把「同步 allow / deny 的策略闸门」与「终端用户同意门户」做成托管 runtime 原语，并给出 P75 冷启动 1.9–2.0s vs V1 5.4–30s 的硬数字；对自托管工具策略 / 审批模型是最直接的对标对象。局限：9 月条目未标具体日，按「本月」限述。
4. **Microsoft Entra Agent ID / Agent 365 把 agent 做成第一类身份（9/23—9/29 密集文档）。** Foundry 为每个 Hosted agent 自动创建专属 Entra 身份与端点；M365 Agent Registry 提供 install / activate / block / delete / restore（30 天）/ 指派 owner 等治理动作；Entra 新增 / 强化 Agent ID Administrator 角色与生命周期策略。权限层从「给人设计」转向「给非人类主体设计」。
5. **火山引擎 OpenViking v0.4.22：Context Database 把「记忆 + 知识 RAG + 技能」收进同一存储语义（9/28）。** Skill 整包参与索引、`skills/find` 每条只回一条最佳命中、MCP 新增 `add_skill`、会话开始注入 Skill 目录；叠加 OTel `gen_ai.skill.*`、Langfuse skills 管理、AWS Agent Toolkit 技能治理，形成「skill 升为一等控制面」的跨模块共振。

备选与说明：LangChain Managed Deep Agents v0.8、Databricks Agent Bricks CLI Beta、Google Agent Gateway、Postman Fabric Gateway GA 均具强信号价值，但论「对 Harness 基础设施格局」的阻断性弱于上五条；本周另无「重大无源 / 虚假内容」或「核心矛盾」触发，TOP 5 足额。

## 对自托管方案的参照意义（以 OpenClaw 为对照）

1. **外部 harness 已成为可切换的一等 runtime，会话 / 状态一致性是新的选型比较点。** OpenClaw v2026.9.7 把 OpenAI Agents API 接成可选 runtime（持久托管 Linux workspace、60 秒提交截止、token usage 上报、临时错误重试），与自托管 harness 形成可切换设计；而 Agents API 自托管执行需自有 controller 与匹配 workspace 路径、且不支持文件传输。多 runtime 混跑时的会话与状态归属需作为明确设计约束。
2. **「断得了、接得回」已是平台基线。** OpenClaw 的更新前备份 + 回滚、重启后续接、remote workspace Memory / Skills，与 AWS lifecycle hooks / Consent Portal、Foundry long-running agent 韧性套件、Databricks 一条命令托管 memory / sessions / tools 同框；差异点集中在自托管与数据主权。
3. **MCP client 安全必须立即核到 1.30.0 / 2.2.0，且连做「升级 + 轮换凭据 + 清理旧 OAuth 注册」。** 若自建 MCP client 连接受不完全控制的 server，需补 `issuer=` 校验，并将「期望 issuer 白名单 + 拒绝重定向」作为强制校验。
4. **工具策略与审批已有可直接对标的外部形态。** AgentCore `before_tool_call` / `after_tool_call` 的同步 allow / deny、Consent Portal 的终端用户审批、Google 语义治理的默认拒绝 IAM UAP 与自定义拒绝消息（≤1000 字符），与自托管工具策略 / 审批模型属同一语义层；显式登记「哪些入口不当策略 / 审计」是必要动作（Google 的 A2A 直连旁路是反面例证）。
5. **记忆与索引层建议按「失败可见化」自查。** Mem0 v2.2.1（拒收即抛 `VectorStoreError`、打分随 distance_metric 变化、推理模型 content block 顺序）与 Cognee v1.6.2（按模型 token 上限切块、错误暴露真实原因）提供了一份现成清单；且 Mem0 发布矩阵中存在 `openclaw-v1.2.1` 集成包，说明外部记忆层已把 OpenClaw 作为分发目标。
6. **技能库承载范式可直接对标，且存在一个强制迁移点。** OpenViking 的「会话开始注入 Skill 目录 + 整包索引 + 每 Skill 单条最佳命中」可与 OpenClaw 的 skills 抽象对照；同时 OpenViking v0.4.22 已把 `peer_role: "person"` 迁移为 `sender`（#5355），属依赖方升级时必须处理的破坏性变更；`.agents/skills` 目录约定正在趋同。
7. **成本口径需与平台对齐：缓存写 / 推理 token 分列计费、失败 / 取消的生成不计 usage。** Langfuse v4.44–4.48 连续修 Anthropic 1 小时缓存写、OpenAI cache-write token 定价与失败 / 取消生成的 usage 推断；Braintrust 把拒答与部分模式用量纳入采集；Firecrawl 记录 cached / reasoning token。
8. **computer use 的 toolset 版本化需要探测与降级路径。** Anthropic Sonnet 5.5（9/28）在 Claude API 与 Google Cloud 上停用 `computer_20251124`、需改 `computer_toolset_20260801`，与 OpenAI 把 computer use 收进 Agents API，同属「模型侧接口版本会周期性打破自托管 agent 兼容」的风险。
9. **矩阵中的短板与环境安全默认值需正视。** Identity / Auth 与 Observability / Eval 是相对薄弱面（无托管身份编排、无内置评估器体系，而 AWS 已有 Agent Toolkit 技能治理、OTel 已有 `gen_ai.skill.*`）；另外 OpenClaw 原文明确提示：多 agent 共用 Gateway 时省略的可见性设置会让带 session 工具的 agent 读取其他 agent（含其他用户）的对话，需显式收窄；互不信任用户应分 Gateway。

## 覆盖审计与局限

**覆盖度。** 模块覆盖 8/8（Harness 控制层、Runtime / Session / State、Sandbox / Computer Use / Browser、Tool Gateway / Protocol / Integration、Identity / Auth / Permission、Context / Memory / Knowledge、Observability / Eval / Guardrails、Managed Agent Platform / Enterprise Control Plane），均含模块结论、固定对象状态表、深度笔记与模块洞察；平台覆盖 7/7；热度补漏 9 个方向全部执行完成。固定对象扫描结果：模块 6 为 8/8 逐一扫描（有窗口内动态并深写 5：OpenViking、Mem0、Cognee、supermemory、Firecrawl；弱动态限述 1：Crawl4AI；无动态限述记录 2：Letta、Zep 主仓，Graphiti 有动态）；模块 7 为 9/9 项逐一扫描（含 AWS / Google / Azure 三个子对象，共 11 子对象；有窗口内动态并深写 7；弱动态限述 1：Coze Loop；无动态限述 2：Helicone、AgentOps；取证受限记缺口 1：Azure）；模块 4 为 12 项；模块 5 为 8 项（含状态记录项）；模块 1 本周深写 7 + 背景限述 3；模块 8 深写 7；模块 2 深写 5 + 补遗 1；模块 3 深写 2 + 交叉 1。去重后固定对象总数 14。

**缺口与原因（汇总）。** AWS AgentCore 9 月 release notes 未标逐条日期，仅按月归组，除新版 Runtime GA（9/18，窗口外）外其余条目能否计入本期窗口存疑，已按「本月」限述；AWS 相关正文获取受限（多账户博客正文不完整、部分页面被 403 或 Cloudflare 拦截），相关对象仅用标题 / 摘要层可核对信息。Microsoft Foundry 官方月刊最新为 2026 年 8 月，窗口内无条目，评估 / optimizer 的「late September GA」为第三方转述，未取得微软一手原文。Azure 可观测 / 评测面为取证缺口而非静默。Google release notes 09-25 条目正文提取为空，本次不作描述。阿里云帮助中心为动态渲染，应用功能动态页最新可见为 2026 年 2 月；腾讯云 ADP 产品动态页本次 rawLength 偏小，不能完全排除渲染未取全，故按「窗口内未取得条目」限述，不据此断言无动作。火山方舟 Agent Plan 文档页提取失败（仅搜索线索，未采用为动态）。OpenAI DevDay Recap 页动态渲染，Dots 云电脑隔离 / 区域 / 配额 / 计费未披露，computer use 的隔离技术、配额与定价未披露。MCP 2026-07-28 规范细节经二次文章取得，未逐条读规范原文，规范发布日在窗口外，作背景而非本周动态。

**厂商自述未独立核实类。** AWS S3 Vectors「选择性过滤下至多 5x 召回」为官方自述；Firecrawl 免费额度与 token 效率为其官方 blog 口径；OpenAI 12 亿周活为官方披露未独立核实；AvePoint 调研（88.4% / 50.1% / 49.6% / 82.7%）为厂商委托调研（750 人），存在利好其治理产品的动机，仅作方向性参考。

**本次未取得与静默的区分。** 上述「未取得」仅表示本次未读得支撑证据，不作「未公开」「无动作」或「零宗」的断言；取证失败已在各章节显式标注。GitHub stars / forks / open issues 与 release 时间戳均为 2026-10-01 取得时快照，无跨期基线，不计算周增速，不代表市场地位。本轮未触发任何必要阻断：未出现仍拟发布的重大无源 / 虚假或误导内容，未出现无法透明限述或隔离的核心矛盾，无隐私 / 保密 / 发布授权未决，且已有可用可信内容形成真实、明确局限的报告；因此研究内容准出为可进入编辑的 PASS，上述局限计入 WARNING。

## 来源与延伸阅读

以下链接按主题归档，正文中对应的具体引用处已在各段就近标注。

**官方文档与发布页**：[OpenClaw v2026.9.7](https://docs.openclaw.ai/releases/2026.9.7)、[OpenClaw v2026.9.6](https://docs.openclaw.ai/releases/2026.9.6)、[OpenClaw GitHub Releases](https://github.com/openclaw/openclaw/releases)、[OpenAI API Changelog](https://developers.openai.com/api/docs/changelog)、[Introducing the Agents API](https://openai.com/index/introducing-the-agents-api/)、[Introducing GPT-6 Sol and Luna](https://openai.com/index/introducing-gpt-6-sol-and-luna/)、[DevDay 2026 Recap](https://openai.com/index/devday-2026-recap/)、[Introducing dots](https://openai.com/index/introducing-dots/)、[Claude Platform Release Notes](https://platform.claude.com/docs/en/release-notes/overview)、[LangChain Interrupt 2026 概览](https://www.langchain.com/blog/interrupt-2026-overview)、[LangSmith Engine / agents / fine-tuning / trajectories](https://www.langchain.com/blog/langsmith-engine-agents-fine-tuning-trajectories)、[Google ADK](https://adk.dev/)、[Foundry What's New](https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry)、[Foundry Agent Service 概览](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)、[Toolbox 鉴权文档](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/tool-authentication)、[M365 Agent 治理动作](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/agent-actions)、[Foundry 7–8 月刊](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-july-august-2026/)、[AgentCore Release Notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)、[新一代 AgentCore Runtime GA](https://aws.amazon.com/about-aws/whats-new/2026/09/new-agentcore-runtime-generally-available/)、[Gemini Enterprise Agent Platform Release Notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)、[Agent Gateway 概览](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/agent-gateway-overview)、[Google IAM Agent Identity 概览](https://docs.cloud.google.com/iam/docs/agent-identity-overview)、[阿里云百炼应用功能动态](https://help.aliyun.com/zh/model-studio/application-release-notes)、[百炼高代码应用文档](https://help.aliyun.com/zh/model-studio/rich-code-application)、[腾讯云 ADP 产品动态](https://cloud.tencent.com/document/product/1759/104191)、[Databricks September 2026 Release Notes](https://docs.databricks.com/aws/en/release-notes/product/2026/september)、[Databricks Agent Bricks CLI](https://docs.databricks.com/aws/en/agents/custom-agents/agent-bricks-cli)。

**安全、协议与网关**：[MCP Python SDK 安全公告 GHSA-qx49-fqc8-xw99](https://github.com/modelcontextprotocol/python-sdk/security/advisories/GHSA-qx49-fqc8-xw99)、[The Hacker News：MCP SDK 缺陷](https://thehackernews.com/2026/09/official-mcp-python-sdk-flaw-can-let.html)、[MCP 2026-07-28 规范发布](https://github.com/modelcontextprotocol/modelcontextprotocol/releases/tag/2026-07-28)、[AAIF：MCP 2026-07-28 变更与迁移](https://aaif.io/blog/mcp-2026-07-28-whats-changing-and-how-to-migrate)、[Aembit：MCP OAuth 2.1 / PKCE 与 AI 授权](https://aembit.io/blog/mcp-oauth-2-1-pkce-and-the-future-of-ai-authorization/)、[MCP discussions #804](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/804)、[AWS 博客：多账户 Agent + Gateway + MCP](https://aws.amazon.com/blogs/machine-learning/build-a-multi-account-ai-agent-with-agentcore-gateway-and-mcp/)、[AWS Builder：AgentCore 入门指南](https://builder.aws.com/content/3JuZJFm3sOphgJS2oFHu1xq7D3b/amazon-bedrock-agentcore-a-beginners-guide)、[aws-samples：AgentCore coding agents 示例](https://github.com/aws-samples/sample-amazon-bedrock-agentcore-coding-agents)、[agentic-community/mcp-gateway-registry](https://github.com/agentic-community/mcp-gateway-registry)、[docker/mcp-gateway v0.44.1](https://github.com/docker/mcp-gateway/releases/tag/v0.44.1)、[Help Net Security：Postman Fabric Gateway GA](https://www.helpnetsecurity.com/2026/09/29/postman-fabric-gateway/)、[Business Wire：Postman 新闻稿](https://www.businesswire.com/news/home/20260929329910/en/)、[DataPhoenix：Scale 与 Google Cloud 参考架构](https://dataphoenix.info/news/scale-google-cloud-enterprise-agent-architecture)、[Yahoo News：NIST AI agent 标准进展](https://www.yahoo.com/news/politics/articles/three-months-nist-federal-ai-154844664.html)。

**GitHub API 直查（release / commit / 仓元数据）**：[truefoundry/trueforge](https://github.com/truefoundry/trueforge)、[zai-org/ZCode](https://github.com/zai-org/ZCode)、[hermes-agent v2026.9.24](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24)、[OpenViking v0.4.22](https://github.com/volcengine/OpenViking/releases/tag/v0.4.22)、[OpenViking sdk/go/v0.0.4](https://github.com/volcengine/OpenViking/releases/tag/sdk/go/v0.0.4)、[Mem0 v2.2.1](https://github.com/mem0ai/mem0/releases/tag/v2.2.1)、[Cognee v1.6.1](https://github.com/topoteretes/cognee/releases/tag/v1.6.1)、[Cognee v1.6.2](https://github.com/topoteretes/cognee/releases/tag/v1.6.2)、[supermemory commits](https://github.com/supermemoryai/supermemory/commits)、[Graphiti commits](https://github.com/getzep/graphiti/commits)、[Letta](https://github.com/letta-ai/letta)、[Firecrawl commits](https://github.com/firecrawl/firecrawl/commits)、[Firecrawl 官方 blog（09-24）](https://www.firecrawl.dev/blog/best-free-web-search-apis)、[Crawl4AI commits](https://github.com/unclecode/crawl4ai/commits/main)、[LangSmith SDK v0.14.2](https://github.com/langchain-ai/langsmith-sdk/releases/tag/v0.14.2)、[Langfuse v4.48.0](https://github.com/langfuse/langfuse/releases/tag/v4.48.0)、[Braintrust py-sdk v0.43.0](https://github.com/braintrustdata/braintrust-sdk-python/releases/tag/py-sdk-v0.43.0)、[Arize Phoenix otel v0.17.2](https://github.com/Arize-ai/phoenix/releases/tag/arize-phoenix-otel-v0.17.2)、[Coze Loop commits](https://github.com/coze-dev/coze-loop/commits)、[OTel semantic-conventions-genai commits](https://github.com/open-telemetry/semantic-conventions-genai/commits)、[Helicone](https://github.com/Helicone/helicone)、[AgentOps](https://github.com/AgentOps-AI/agentops)、[Browserbase/Stagehand](https://github.com/browserbase/stagehand)、[AWS CLI Agent Toolkit 技能批量更新](https://aws.amazon.com/about-aws/whats-new/2026/09/aws-cli-agent-toolkit-update-skill/)、[S3 Vectors 元数据预过滤](https://aws.amazon.com/about-aws/whats-new/2026/09/s3-vectors-introduces-metadata-pre-filtering/)。

**具名媒体 / 第三方**：[Reuters：OpenAI 发布 always-on Dots](https://www.reuters.com/business/openai-takes-meta-with-always-on-dots-agent-enterprise-ai-push-2026-09-29/)、[The Verge：DevDay 2026 发布汇总](https://www.theverge.com/2026/9/29/openai-devday-2026-biggest-news-announcements)、[Nango：agent API 集成对比（窗口外）](https://nango.dev/blog/best-mcp-servers-for-agent-api-integrations/)。

本期的报道窗口为 2026-09-24 至 2026-09-30；所有 release 与 commit 时间戳已按 UTC 边界逐个判定，越窗项已在正文显式标注为背景。产品宣布、文档更新与实测效果、客户采用之间存在区别，预览与正式可用（GA）亦已在正文区分。
