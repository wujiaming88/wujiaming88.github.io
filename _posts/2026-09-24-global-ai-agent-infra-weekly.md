---
layout: single
title: "全球 AI Agent 基础设施周报：Harness 模块标准化加速（2026-09-17 ~ 2026-09-23）"
date: 2026-09-24 06:00:00 +0800
categories:
  - AI
tags:
  - AI Agent
  - Agent Infrastructure
  - Agent Harness
  - MCP
bucket: agent-infra
header:
  overlay_image: /assets/images/posts/2026-09-24-agent-infra-cover.png
  overlay_filter: 0.35
toc: true
toc_sticky: true
---
Agent Harness的各个模块本周同时发生了同一类变化：控制层把工具注册表下沉为会话状态，运行时把内存粒度与冷启动时延写成可承诺的硬指标，执行环境把沙箱变成可分支、可回滚、可回放的状态容器，工具与权限层则把凭据归属拆成三条互斥路线。最值得关注的不再是新增了哪些能力，而是「可回滚升级、会话状态寻址、凭据归属、可观测口径」这四件事正在被契约化——云厂选择把它们打包进托管服务，自托管侧则以可移植性与调度所有权对价。

以下变化对应2026年9月17日00:00至9月23日24:00，时区为Asia/Shanghai（等价UTC 2026-09-16T16:00Z—2026-09-23T16:00Z）。窗口外材料标明为背景；未能确证窗口归属的条目保留限定。全部数据来自已读官方记录与仓库元数据，本期未做独立部署、安全复现或基准复跑，厂商自述数字按未独立核实处理。

## 控制层：工具注册表下沉为会话状态

本周控制层的共同动作不是新框架，而是把已有 Harness 变成可运维的生产件：升级要可回滚、插件要免重启、调度要可审计、工具面要有版本契约。

| 对象 | 本周状态 | 证据源 |
|---|---|---|
| OpenClaw（sessions / cron / Gateway / tool runtime / plugin & skills） | 有动态（窗口内两个 release） | [GitHub releases](https://github.com/openclaw/openclaw/releases)（v2026.9.5 于 2026-09-19T01:55:23Z；v2026.7.35 于 2026-09-21T13:14:04Z）、[2026.9.5 release notes](https://docs.openclaw.ai/releases/2026.9.5) |
| OpenAI Agents SDK / Responses API | 有动态（窗口内仅模型层；Agents API 主体为 2026-09-10，背景） | [OpenAI API changelog](https://developers.openai.com/api/docs/changelog) |
| Anthropic Claude Agent SDK / MCP | 有动态（09-22、09-18） | [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview) |
| LangChain / LangGraph / LangSmith | 有动态（LangGraph 1.2.12、sdk 0.4.5、cli 0.4.32；LangSmith 周更） | [LangGraph releases](https://github.com/langchain-ai/langgraph/releases)、[LangSmith changelog](https://docs.langchain.com/langsmith/changelog) |
| Google ADK | 有动态（ADK v2.9.2 于 09-18；平台 09-17/09-18/09-21；09-22 条目源侧为空） | [adk-python releases](https://github.com/google/adk-python/releases)、[Gemini Enterprise Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes) |
| Microsoft Agent Framework / Semantic Kernel / AutoGen | 有动态（python-1.19.0 与 dotnet-1.22.0 均 2026-09-18） | [agent-framework releases](https://github.com/microsoft/agent-framework/releases) |
| Databricks Mosaic AI Agent Framework / Agent Bricks | 静默（窗口内无条目） | [Databricks product release notes](https://docs.databricks.com/aws/en/release-notes/product/)（最近校验 2026-09-11）、[Agent Bricks 产品页](https://www.databricks.com/product/artificial-intelligence/agent-bricks) |
| 动态池：CrewAI AMP / Studio、Dify、n8n / Flowise | 静默（未取得窗口内基础设施级动态） | [Dify blog](https://dify.ai/zh/blog)、[CrewAI pricing](https://crewai.com/pricing) |
| 热度补漏：truefoundry/trueforge、langchain-ai/deepagents、HKUDS/OpenHarness | trueforge 与 deepagents 有动态；OpenHarness 静默 | [trueforge releases](https://github.com/truefoundry/trueforge/releases)、[deepagents releases](https://github.com/langchain-ai/deepagents/releases)、[OpenHarness releases](https://github.com/HKUDS/OpenHarness/releases) |

### OpenClaw：把升级、插件与调度做成可审计原语

窗口内两个正式 Release。v2026.9.5（`published_at` 2026-09-19T01:55:23Z，上海 09-19 09:55）官方摘要为 Atomic Updates、插件热加载、对话分享、GPT Live、共享浏览器页面、对话归档、引导式专家团队，并记 4,179 个 PR、64 个直接提交、502 个贡献账号（同一发布页正文与致谢段分别写 502/503，属官方页面口径差异；release SHA `ec9c1a13db8938e5a3eaa51fca2e981cde2395a9`）。

控制层要点有五处。一是 Atomic Updates：更新时在当前 Gateway 持续运行的前提下，用私有候选副本校验下一版本，校验通过后再切换并验证，把「升级即中断」改为可回退的原子路径（2026.9.4 已引入回滚保留包，2026.9.5 补齐前置校验）。二是插件热加载：受支持的插件可不重启 Gateway 完成安装。三是 Scheduled work：release notes 专列 Scheduling 段落，含 `cron list --all --json`、计划任务会话被排除、计划任务保持调度器所属的摘要、计划报表回到原会话、调度完成在等待子代理后重建结果。四是共享浏览器页面与 GPT Live 扩展 Harness 输入输出面。五是 Docker 沙箱工作区可见性修复（#147276：容器内 sandbox shell/browser 能看到与宿主同一份 workspace/skill 文件，要求已验证的宿主 bind mount）。SDK 弃用节奏上，`agent-harness-credential-prompt-string-argument` 于 2026-09-09 进入弃用、旧字符串参数支持到 2026-11-30；`sdk-untrusted-context-identifier-aliases` 到期后仍为 `removal-pending`。

v2026.7.35（`published_at` 2026-09-21T13:14:04Z，上海 09-21 21:14，release SHA `aa94808cb05668cdf1c10bc8f034a8176deba483`）是 July extended-stable 维护线首个 GitHub Release（2026.7.33/7.34 因不稳定未发布），累积变更含 cron 执行通道繁忙时避免误判 agent 超时（#114512）、本地模型预检 socket 泄漏（#114540）、session-delivery 重试失败传播（#97024）、session 并发下防 stall（#114051）、gateway 关闭时保持通道停止（#104811）、取消的并行工具不再启动（#102276）、memory-host 关闭时拒绝排队 worker 请求（#102451），以及 Doctor 插件注册表保留完整内置插件清单（Browser/Canvas/pairing/file-transfer/phone-control/Talk/Bonjour）、命令解析、浏览器 origin 校验、插件 Git 安装参数注入、诊断/服务凭据/Webhook 日志加固等安全回补。两项工程风险需要记录：9.5 的 Android APK 因版本 train 不匹配被跳过、stable soak 被运营方豁免；Docker 与 70 个插件回读均通过。

关键数据：v2026.9.5 含 4,179 PR、64 直接提交、502 贡献账号（[2026.9.5 release notes](https://docs.openclaw.ai/releases/2026.9.5)）；本地安装版本号为 `OpenClaw 2026.9.4 (3a9d69d)`。取证边界：v2026.9.5 release notes 正文逾 749 KB，本次仅取得 19,819 字符（含 Highlights/Changes/Fixes 主体），未逐条读完全部 PR 记录，不声称逐项覆盖。

影响判断：OpenClaw 本周正面处理了自托管 Agent OS 最容易被诟病的两件事，并把 cron 与计划任务的会话隔离、结果归属显式定义，使其相对托管型 Harness 的差异化落在「自己掌握 Gateway 与调度面」。对同赛道，它抬高了「控制层必须可回滚、可热更新、调度可审计」的基线；对自身，多 Agent 团队与云端 worker 仍是较新能力，企业治理（身份/审计/配额）需继续补课。

### Anthropic：工具定义进入会话，工具面获得版本契约

官方 release notes 窗口内两条实质记录。2026-09-22 发布 Claude Opus 5.5（`claude-opus-5-5`），面向长时程 agentic coding 与知识工作，默认 1M token 上下文、128k 最大输出、始终开启 adaptive thinking，定价 $4 / $20 每 MTok（Opus 5 为 $5 / $25）。同日多项约束收紧：在 Opus 5.5 上 `thinking: {"type":"disabled"|"enabled"}` 返回 400（改用 `effort` 参数控制深度），`tool_choice` 的 `any`/`tool` 返回 400（须用 `auto` + strict tool use）；在 Claude API 与 Google Cloud 上 computer use 需用 `computer_toolset_20260801`，旧 `computer_20251124` 返回 400，Amazon Bedrock 上旧值仍可用。

同一条目最重要的控制层变化是 `inline-tools-2026-09-15` beta：工具可定义在对话中的 system message 里，`tool_addition` 块可携带完整工具定义，从而在不改 `tools` 字段、不破坏 prompt cache 的前提下新增工具、改 schema 或让 server tool 升版；若同时带 MCP connector 的 `mcp-client-2026-09-15`，定义可以是 MCP toolset，响应会以 `mcp_tool_listing` 块记录每个 server 拉取到的工具清单并可在回传时固定该清单。2026-09-18 的第二条记录是 Compliance API 本地会话端点新增返回 Claude in Chrome 会话记录（`product_surface` = `claude_in_chrome`，面向 Claude Enterprise 组织 beta，沿用既有 Compliance Access Key 与 `read:compliance_user_data` scope）。

影响判断：把工具定义放到会话里、并让 MCP 工具清单可固定，意味着工具注册表下沉为会话状态，直接服务长时程 agent 的上下文缓存与工具热更需求。同时对旧接口持续加硬约束，抬高迁移成本，强化自家 API 作为唯一控制面的位置。取证边界：窗口内未见 Claude Agent SDK 独立库版本公告，未逐一核 claude-code CHANGELOG，故不断言 SDK 库层的本周变化；本次读到的是 release notes 概览页前 14,000 字符（`rawLength` 110,055）。9 月条目中 09-14 的按需 compaction、09-10 的 Managed Agents permission `auto` 与 `ant beta:sessions connect` 均早于窗口，仅作背景。

### OpenAI：本周换的是底座模型，不是控制面

按官方 API changelog，窗口内唯一新增条目是 09-22 的模型层发布：`gpt-6-sol` 与 `gpt-6-luna` 两个推理模型上线，接受文本与图像输入、经 Responses 与 Chat Completions 输出文本；标准价（≤272K 输入）Sol 输入 $2、缓存输入 $0.20、输出 $10，Luna 输入 $0.10、缓存输入 $0.01、输出 $0.50（每 1M tokens）。

Harness 控制层本体在窗口内没有新条目。真正与「控制层」强相关的是 2026-09-10 发布的 Agents API（public beta）——以托管的 Codex harness 构建 agent，OpenAI 负责会话编排、上下文压缩与恢复，支持 durable sessions 跨轮续做、流式进度、接入自带工具与 MCP server，并可在 OpenAI 托管沙箱或自有/第三方沙箱中运行；该条目落在窗口之外，仅作背景。09-15 的 API key 创建治理、09-10 的 key 过期策略属平台安全面，同样在窗口外。就 Harness 语义看，OpenAI 本周的动作是给托管 harness 换更强底座模型（多步长任务推理），而非改控制面 API。取证边界：本次未取得窗口内其他 OpenAI 平台变更证据；changelog 不覆盖平台侧全部变更，也不排除文档级字段更新未入 changelog，故仅能在「changelog 已读范围」内判断。

### LangChain 阵营：小步高频，评估语义加密

窗口内三条可核证据。LangGraph 1.2.12（`published_at` 2026-09-21T14:43:40Z）的 release body 含 `feat(langgraph): add response_schema to interrupt()`（#8886）、`fix(langgraph): type undeclared v3 stream projections`（#8596）、`detect subgraphs from bytecode instead of source`（#8569）及依赖升级。`sdk==0.4.5`（2026-09-21T14:43:09Z，与 1.2.12 同批）与 `cli==0.4.32`（2026-09-23T18:02:46Z）说明 SDK/CLI 与核心库同一周持续出包。

LangSmith Cloud 周更（标签「September 14-21, 2026」）：annotation queue 内「Add to Dataset」支持线程级多轮样本、evaluator 列表 API 支持 `agent_id` 过滤、trajectory evaluation 改用根 run 的 start time 判定最新 trace、`TURN_NUMBER` 支持分页定位、thread traces API 新增 `trace_filter`/`tree_filter`；Engine 缺陷发现开始读取工具结果内容而非只看状态（能发现「返回数据少于自称」的静默缺陷），Red Team 全量扫描后改为基于 Agent Overview 的短确认扫描；Automations 支持线程分组 webhook payload、失败重试不再留下半页游标；Deployment 侧 scale-to-zero 部署拒绝回滚到 LangGraph API 0.13.0 以下或无兼容版本的修订。

影响判断：`interrupt()` 支持 `response_schema` 把人工审批/中断点从自由文本变成契约化输入，属生产化 Harness 必备件；Trajectory 评估与 Engine 静默缺陷发现则把可观测层推向「能发现没有报错的错误」。取证边界：LangSmith changelog 为周更聚合，单条无更细时间戳，故只按「周更窗口覆盖 09-21」采信，不逐条声称落在 09-17—09-23；自托管版 changelog 本次未读。

### Google：SDK 拆包迁移与跨运行时遥测保真

三条可核证据。ADK Python v2.9.2（`published_at` 2026-09-18T18:08:40Z）聚焦遥测行为修正：OpenTelemetry 事件名在 Agent Engine 之外的平台保持不变，主修复为 `telemetry: only drop the OTel event name on Agent Engine`（commit 9110770），即 ADK 的 OTel 事件命名不再被自家托管运行时吃掉；v2.9.1（09-15）与 v2.9.0（09-10）为紧邻前置版本。

Gemini Enterprise Agent Platform release notes 窗口内条目：09-21 CodeMender v0.9.0（交互式 HTML 安全报告、`--open` 标志、新增 C#/Rust/Kotlin/Ruby/PHP 漏洞扫描、per-turn 延迟指标区分模型推理与本地工具执行时间、长时程仓库扫描会话可靠性修复）；09-18 xAI Grok 4.6 GA（global 与 US multi-region 端点）+ Agent Platform SDK for Python 2.0.1（Breaking）——生成式 AI 模块迁移到 Google Gen AI SDK、agent 面从 `google-cloud-aiplatform` 拆成独立包 `google-cloud-agentplatform`、命名空间重构；09-17 Gemini Omni Flash 支持有状态（`store: true`）与 SSE 流式（`stream: true`）视频生成（Preview，Interactions API）。09-22 有一条 Feature 记录，但标题与正文经 `.md` 孪生页核验为 Google 源侧空条目（仅日期与类型标记），不作内容推断。

影响判断：SDK 拆包是「Agent Engine 是一等 runtime 产品而非 Vertex 附属能力」的组织级表态，代价是已有用户需要迁移；ADK 承认 agent 会跑在 Agent Engine 之外，对多云/自托管 Harness 是正面信号。A2A 与 Vertex 到 Gemini Enterprise 的关系本周无新协议进展（ADK 原生支持 A2A 属早前版本内容）。取证边界：平台页 09-22 条目存在但源侧为空；「Computer Use and Shell sandboxes GA」为 2026-09-09（窗口外背景）。

### Microsoft：框架补状态与暴露面治理，服务面空档

GitHub `microsoft/agent-framework` 窗口内发布两版：`python-1.19.0`（`published_at` 2026-09-18T09:14:28Z）与 `dotnet-1.22.0`（2026-09-18T18:12:17Z）；前置版本 `dotnet-1.21.0`（09-11）、`python-1.18.0`（09-10）在窗口外。`python-1.19.0` 的 Added 列表信息量很高：新增通用向量存储 provider 协议、instrumentation message-event 控制、per-tool `AgentModeProvider` 暴露控制（#8421/#8451/#8450）；新增 alpha 级 MongoDB / Azure DocumentDB / Azure Cosmos DB NoSQL 向量存储连接器（#8184/#8185/#8186）；`agent-framework-orchestrations` 为内置编排工作流加上稳定名称并注册 checkpoint 类型以支持恢复（#8384/#8258）；`agent-framework-devui` 可展示 Aspire traces（#7874）；core 增加串行调用 function calls 的选项（#8453）；CodeAct 工具参数 schema 与紧凑/JSON 描述可配置（#8459）。Changed 段涉及 a2a / ag-ui 等包。

Foundry 服务面本周无公告（[Foundry 博客](https://devblogs.microsoft.com/foundry/)列表最新为 2026-09-15 Foundry Dev Pack 与 09-09 的 July/August 汇总文），故不把 Foundry 服务面列为本周有动态。影响判断：1.19.0 把「状态与恢复」「工具暴露面治理」「多后端向量存储抽象」补上，方向与 LangGraph checkpointer、OpenAI durable session 同构——三家都在把 agent 状态持久化与恢复做成框架默认件。取证边界：release body 本次只读到前 1,800 字符，Changed/Removed 细节未读完。

### 静默与补漏：Databricks、低代码动态池与三个开源 Harness

Databricks 本周无重大公开动态：平台 release notes 页最近校验日期为 2026-09-11，窗口内未取得新的 Agent Bricks / Mosaic AI Agent Framework 条目；docs 侧「Use agents on Databricks」页最近更新标注 2026-09-15，均在窗口外。背景（非本周）：Agent Bricks 在 2026 DAIS（2026-06-16）被扩展为面向开发者的综合 agent 平台。

动态池三家本次均未取得窗口内基础设施级动态。Dify 官方博客与 EE release 索引显示最近条目为 2026-09-09 与 LTS/最新版 v3.9.11（2026-08-26）、v3.12.1（索引标注 Aug）；CrewAI 本次仅取得 Crew Studio 发布（约一个月前）与定价页；n8n/Flowise 未取得基础设施级动态。按「只有基础设施级动态才写」的规则记为本周静默，不作产品事实采用。

热度补漏三个项目分化明显。truefoundry/trueforge 有窗口内动态：`charts/trueforge@0.2.2`（2026-09-22T06:04:20Z）、`@truefoundry/trueforge@0.3.0-rc.0`（2026-09-22T15:35:28Z）、`@truefoundry/trueforge-sdk@0.2.1-rc.0`（2026-09-22T15:35:25Z）、`@truefoundry/trueforge-ui@0.4.0-rc.0`（2026-09-22T15:35:31Z）、`charts/trueforge@0.2.3-rc.0`（2026-09-22T15:47:00Z），同日推进 Helm chart 稳定版与 core/SDK/UI 候选版；仓库窗口快照 5,939★/463 fork。langchain-ai/deepagents 有窗口内动态：`deepagents==0.7.17`（09-22）、`0.7.18`（2026-09-23T03:06:42Z）、`deepagents-code==0.1.73`（09-22）、`0.1.74`（2026-09-23T03:55:56Z）、`0.1.75`（2026-09-23T16:10:17Z）；仓库 29,701★/4,171 fork。HKUDS/OpenHarness 静默：最新 release 为 `v0.1.9`（2026-05-07T11:10:46Z），远早于窗口。

影响判断：trueforge 与 deepagents 的「同日多包候选版」说明 Harness 层开源项目已进入按包拆分的产品化节奏（core/SDK/UI/chart 分版本发布），这是从框架转向可部署产品的典型信号。stars/forks 均为 2026-09-24 取得时快照，无跨期基线，不计算周增速。

### 控制层洞察

本周这一层的共同动作是「状态、工具、更新」三件事的契约化：Anthropic 把工具定义搬进会话并可固定 MCP 工具清单，OpenAI 用 durable session 托管会话编排与压缩，Microsoft 给编排工作流加稳定名与 checkpoint 恢复，LangGraph 让 `interrupt()` 有 schema，OpenClaw 用 Atomic Updates 与计划任务会话语义把自托管升级与调度做成可审计原语。这一层尚未标准化，但「可恢复状态 + 可治理工具面 + 可回滚升级」正在成为默认要求；云厂选择把它们打包进托管服务，自托管项目则以可移植性与调度所有权对价。

## 运行时：托管运行时进入代际换代

### 云厂把内存粒度与冷启动写成硬指标

AWS 发布下一代 AgentCore Runtime（serverless microVM 计算底座），核心两处变化。一是弹性内存管理：会话以小内存档位启动，按需申请追加内存，不再使用的内存会被回收而非持有到会话结束，计费口径从峰值占用改为实际使用。二是快照式冷启动：Runtime 只在首次准备一次 agent 环境并做快照，后续实例从快照恢复而不是重跑完整启动序列，使启动时间与容器镜像体积无关。开通方式为在创建或更新 runtime 时设置 `platformVersion` 为 `V2`。

关键数据：P75 冷启动 1.9—2.0 秒（镜像 200 MB—2 GB），对比上一代 5.4—30 秒；可用区域 us-east-1、us-east-2、us-west-2、eu-west-1、ap-northeast-1。来源为[AWS What's New](https://aws.amazon.com/about-aws/whats-new/2026/09/new-agentcore-runtime-generally-available/)（2026-09 页面，未内嵌显式日期，检索新鲜度约「5 天前」即 ≈2026-09-19，日期未逐字确证）与[AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)（按自然月分段、未逐条标注日）。

同时段「September 2026」发布说明披露 harness 侧能力：持久交互式 shell（WebSocket，与 harness agent 处于同一隔离 microVM 会话，保留环境变量/工作目录/命令历史/运行中进程；断连后可重连并回放最多 256 KB 缓冲输出，单个 harness 会话最多 10 个独立 shell；入口为 `InvokeAgentRuntimeCommandShell` API，AgentCore CLI 与高层 SDK 的 shell helper 暂不支持 harness 目标）、OpenAI 兼容自定义端点（OpenAI 模型配置新增可选 `apiBase`）、生命周期钩子（`before_invocation`、`before_tool_call`、`after_tool_call`、`after_invocation`；绑定 AWS Lambda 可同步返回 allow/deny 从而中断 invocation 或跳过工具调用；SNS/EventBridge 目标只做非阻塞通知；`InvokeHarness` 会为每个触发的钩子发出 `hookEvent`）。上述月级条目无逐条日期，**窗口归属未确证**。

影响判断：AWS 把 Session/State 层的竞争指标从「能不能托管容器」推进到内存计费粒度与冷启动 SLA，直接压缩 E2B/Daytona 一类第三方沙箱在 AWS 原生栈内的性价比空间；lifecycle hooks 把工具调用审批做进 runtime 边界，意味着 Runtime 正在吞并原本属于 Gateway 与 Guardrails 的策略点。取证边界：配套博客正文提取被页面框架占据，仅取到标题与摘要，其中「Suspend and resume sessions」等表述只作摘要级线索，不作独立事实采用；定价细节未读定价页正文；release notes 条目只能标注 2026 年 9 月月内。

### Google：agent SDK 独立成包，延迟归因进产品指标

Vertex AI 已整体归入 Gemini Enterprise Agent Platform，其官方 release notes 在窗口内（09-17—09-22）有三条与本模块相关：09-18 Breaking 的 `Agent Platform SDK for Python 2.0.1`（包名 `google-cloud-agentplatform`）——生成式 AI 模块迁移到 Google Gen AI SDK，agent 相关接口从 `google-cloud-aiplatform` 中拆出为独立包并重构命名空间，官方提供迁移指南；09-18 Feature 的 xAI Grok 4.6 在 global 与 US multi-region 端点 GA；09-21 Fixed 的 CodeMender v0.9.0——交互式 HTML 安全报告、扫描语言扩展、per-turn 延迟指标拆分（模型推理等待与本地工具执行）、长时扫描会话可靠性修复。窗口内还有 09-17 的 Gemini Omni Flash 有状态/流式视频生成（Preview）与 09-22 的一条空条目。

影响判断：CodeMender 的 per-turn 延迟拆分说明长时 agent 会话的成本归因（模型等待 vs 工具执行）已被云厂当作产品指标，与 AWS lifecycle hooks 属同一竞争面。取证边界：09-22 条目经 `.md` 孪生页核验为源侧空条目，不作为本周采用事实；「Computer Use and Shell sandboxes GA」为 2026-09-09（窗口外背景）；旧路径 Vertex AI generative-ai release notes 本次取得的最新条目仅为 2026-05-26，说明 Google 已把产品线更新迁到新平台页。

### 中国云厂：火山 AgentKit 是唯一实质增量

火山引擎 AgentKit 文档「新功能发布记录」窗口内有两条：2026-09-21（华北2·北京）工作台新增「DeliveryAI 助手」悬浮入口（可发起需求创建、产品设计、代码评审、缺陷修复、单测巡检、空间管理等任务），流程管理支持创建自定义流程、节点分工规则可引用节点名称/流程角色/空间成员；2026-09-16（华北2·北京）模型管理支持直接选用火山方舟模型广场已创建的 API Key、可配置思考强度（low/high/max）与默认强度，企业集成支持接入 GitHub 仓库供 Agent 在仓库内执行代码任务，服务总览新增沙箱用量统计，Skill 管理支持批量上传 Skill 包，空间管理支持创建 Demo 空间，评测中心新增「评估器 / 评测集 / 评测任务」，Skill 支持以「/」命令直接调用项目内置 Skill。来源为[AgentKit 新功能发布记录](https://docs.volcengine.com/docs/agentkit/new-feature-release-record)；页面自述该产品线首次上线于 2026-08-18（邀测，华北2）。

影响判断：火山这一波是「沙箱 + Skill + 评测 + 仓库集成」打包进统一 Agent 交付平台，其中沙箱用量统计与评测中心直接对应 Sandbox 与 Observability 模块。取证边界：该文档页标题落在 `docs/AgentKit` 路径，但正文自述服务名为 DeliveryAI，本刊按正文记录为「火山引擎 AgentKit 文档所载 DeliveryAI 服务」，未把它等同为 Coze/方舟主平台；Coze 更新动态最新条目为 2026 年 07 月，扣子云盘扩容计费条目为 2026-09-09，均在窗口外。

阿里云百炼窗口内未取得官方新发布。已查入口：模型平台「功能动态」最新条目为 2026-08-04 与 2026-08-03；应用功能动态 2026 年段落最新为 2 月 10 日，其下「9 月」条目属 2025 年段落，为一年前旧闻；检索命中「智能体托管运行时上线 + 新增智能体托管运行时 API」的条目实为 2026-06-29，属窗口外背景（百炼自 2026-06-29 起提供智能体托管运行时 API，2026-07-16 发布 Managed Agent 商业化通知）。另有「新版智能体应用（Agent 2.0）」文档页显示更新时间 2026-09-18（搜索结果元数据），本次未取该页正文，**不作为本周动态**。

腾讯云窗口内未取得官方新发布。已查入口：智能体开发平台「产品动态」正文抓取到的条目集中在 2025-08，页面响应不完整、未取到 2026 年段落；CloudBase AI Toolkit 文档仅有功能说明，未见带日期的窗口内更新。背景（非本周）：腾讯云 ADP 以 AgentOps 为核心的产品定位在售；CloudBase AI Toolkit 文档将 OpenClaw 列为可对接的 AI 开发工具之一（该页无发布日期，仅作背景线索）。取证边界：产品动态页正文不完整，只证明已读段落中最晚为 2025-08，**不能断言腾讯在窗口内零发布**，记为未取得而非静默不存在。

### Microsoft Foundry：发布节奏空档

窗口内（09-17—09-23）未取得 Microsoft 官方发布。已查入口：Foundry 官方博客索引（最新一篇为 2026-09-15 Foundry Dev Pack）、Microsoft Learn 的 what's-new 文档（当前为「What's new for August 2026」，`updated_at` 2026-09-09），以及针对「Microsoft Foundry September 2026 hosted agents」的多轮检索（仅返回 7/8 月汇总与 Build 2026 旧文）。背景（非本周）：7—8 月 Hosted Agents、Voice Live、Toolboxes 转 GA；Learn 的 8 月文档列出长时运行 agent API（preview）、崩溃恢复与可操控 turn、human-in-the-loop 审批、任务态管理、autopilot 生命周期等条目。取证边界：仅证明「本周未在已查官方索引中发现新发布」，不等同于未发布任何功能——Learn 文档按月发布汇总页且索引可能滞后（8 月页 updated 2026-09-09 即为延迟发布模式的证据），本条不得写作「无发布」。

### 运行时洞察

Runtime/Session/State 这一层本周的主战场是「会话级资源核算 + 会话续命能力」：AWS 用弹性内存与快照冷启动把会话成本与时延做成可承诺的 SLA，Google 把 agent SDK 独立成包并给出 per-turn 延迟归因，Anthropic 用 Opus 5.5 的 1M/128k 长会话组合支撑长时程，OpenClaw 则用原子升级与插件热装解决长会话不中断。该层正在标准化为三条硬指标（冷启动与恢复时延、会话内存与成本粒度、工具调用前置策略点），云厂靠托管 SLA 收编，自托管侧靠不中断升级与并发稳定性应对；中国厂商本周只在火山 AgentKit 侧有可核更新，阿里与腾讯未取得窗口内证据。
## 执行环境：沙箱从隔离走向可寻址状态

开源与第三方沙箱这一周的主线不是新能力，而是接口换代与安全收紧：E2B 把创建与连接入口切到 `/v2/sandboxes`、默认参数交给服务端，并下线 V1 模板构建通道；Daytona 把 Dockerfile 的 `COPY` 源限制在构建上下文内，同时同步生成式客户端的整型类型破坏性变更。两家都在为多 SDK、多语言、代理与集成方场景收敛接口面与攻击面，并把沙箱从「一次性执行环境」推向「可分支、可回滚、可回放的状态单元」。

需要把三种状态分开读：真正有动态的、明确静默的、以及未取得窗口内证据因而不能断言静默的。

| 对象 | 本周状态 | 证据源 |
|---|---|---|
| E2B | 有动态 | [E2B changelog](https://docs.e2b.dev/changelog)（2026-09-21） |
| Daytona | 有动态 | [Daytona changelog](https://www.daytona.io/changelog)（0.216.0 于 09-23、0.215.0 于 09-22）、[dotfiles 研究](https://www.daytona.io/dotfiles/snapshots-as-search-states-go-explore-with-daytona)（09-18） |
| Browserbase / Stagehand | 静默 | [Browserbase changelog](https://www.browserbase.com/changelog)（最新 2026-09-09） |
| Modal | 未取得，不得写作无发布 | [Modal 博客](https://modal.com/blog)（最新 09-14）、[Modal changelog](https://modal.com/changelog)（无日期字段） |
| OpenAI Computer Use / Browser / Code Interpreter | 静默（部件侧无条目，09-22 仅模型发布） | [OpenAI API changelog](https://developers.openai.com/api/docs/changelog) |
| Anthropic Computer Use | 有动态 | [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview)（09-22、09-18） |
| AWS AgentCore Browser / Code Interpreter | 静默（9 月段无对应条目） | [AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html) |
| Azure Browser Automation / Code Interpreter / Playwright Workspaces | 未取得，未能断言静默 | [Browser Automation 文档](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/how-to/tools/browser-automation)（2026-08-21）；`.md` 孪生页返回 404 |
| Google Code Execution / Managed Agents sandbox | 静默（窗口内无沙箱条目） | [Gemini Enterprise Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes) |
| vercel-labs/agent-browser | 有动态（1 个落在窗口内的 release + 3 次主分支提交） | [v0.38.1](https://github.com/vercel-labs/agent-browser/releases/tag/v0.38.1)（published 2026-09-16T20:05:12Z） |
| browser-use/browser-use | 静默 | [0.13.10](https://github.com/browser-use/browser-use/releases/tag/0.13.10)（2026-09-04）；默认分支最新提交 09-15 |
| runtime-org/runtime | 过滤，不计入本期动态池 | [仓库页](https://github.com/runtime-org/runtime)（203★、最后推送 2025-08-30） |

### E2B：把生命周期语义收回控制面

2026-09-21 的变更含两块实质内容。其一是 V2 沙箱创建与连接端点：`Sandbox.create` 与 `Sandbox.connect` 改为调用 `POST /v2/sandboxes` 与 `POST /v2/sandboxes/{id}/connect`；SDK 不再替你预置 `timeout`、`allow_internet_access`、`count`、`memory`、`cpuCount`、`memoryMB` 等参数，这些参数被忽略时由 API 默认值决定；所有沙箱均为 secured，`secure` 参数保持兼容但被忽略。该改动随 JavaScript/Python SDK 2.51.0 与 desktop-python 2.6.0 发布（#1749，runtime commit `f5dc642`）。

其二是 CLI `e2b sandbox fork`（别名 `sbx fk`）：把运行中的沙箱 fork 成一个或多个新沙箱并逐行打印新 ID，`-n/--count` 控数量、`--timeout` 控超时，随 CLI 2.20.0 发布（#1879）。同一轮还完成 V1 模板构建通道下线（JS/Python SDK 2.50.0、CLI 2.19.1，#1875），并修掉一批问题：浏览器端上传非原生 `ReadableStream` 被写成字面量、沙箱终止导致浏览器请求报 `TimeoutError`、取消 pause 导致快照不可 resume、代理关闭时丢弃在途连接等（[E2B changelog](https://docs.e2b.dev/changelog)，Updated 2026-09-21，tags: SDK/CLI/API/Self-hosted）。

把「默认值归服务端 + 全量 secured + fork 升为一级命令」三件事一起做，等于把沙箱生命周期语义（创建、暂停、fork、恢复）完全收到控制面，客户端只保留调用面。对上层 harness（包括自托管 runtime）的含义是：接入时应以 V2 端点与 fork 语义为基准重写生命周期管理，否则会继承旧参数假设，或踩到已删除的模板构建路径。取证边界：本次只读到 changelog 页面（09-21 与 09-14 两段），未逐条打开对应 PR 与 commit 正文；E2B Embed 自托管（Docker Compose/Terraform/K8s）与自动 429 重试属 2026-09-14，为窗口外背景。

### Daytona：构建面收紧，快照被当作搜索状态

窗口内两次版本发布加一篇研究博客。0.216.0（SEP 23 2026）把 Dockerfile 的 `COPY` 源限制在构建上下文内，Python/Ruby/TypeScript SDK 行为一致，属沙箱构建面收紧。0.215.0（SEP 22 2026）把 OpenAPI 中的整型类型同步到生成的 Go/Java 客户端（破坏性变更），修正 CLI 的 MCP allowlist 处理，并修复 CLI profile 传递与 Ruby SDK 归档上传。

真正值得写进趋势的是 09-18 的 dotfiles 研究（Daniel Thi Graviet）「Searching Over Sandbox States for Coding Agents」：在 Terminal-Bench 场景评估把完整沙箱快照当作搜索状态，用于 coding agent 在搜索与回溯过程中保留完整执行状态。该页还列出「Daytona sandboxes are now available through Stripe」等条目，日期未在本次抓取中确认，不采用（[dotfiles](https://www.daytona.io/dotfiles)、[Daytona changelog](https://www.daytona.io/changelog)）。

Daytona 的同步节奏是每周 1—2 个 0.x 版本，方向是构建安全与多语言一致性，没有新原语；0.214.0（09-15，Java SDK 构建上下文上传）属窗口外。把快照当成 agent 的搜索与回溯状态，与 E2B 的 fork 命令、Modal 的 Directory Snapshots GA（背景）指向同一模式：沙箱状态可寻址化。取证边界：changelog 详情页与 Go/Java 破坏性变更的迁移说明未逐页打开；「生产代码库 2026-06 转闭源」等第三方说法来自 northflank 文章，未采用。

### Computer Use：工具集版本与模型版本开始绑定

Computer Use 侧的窗口内信号来自模型工具集版本迁移：Anthropic 在 09-22 随 Claude Opus 5.5（`claude-opus-5-5`）发布，官方明确 computer use 在 Claude API 与 Google Cloud 上必须使用 `computer_toolset_20260801`，旧 `computer_20251124` 返回 400；在 Amazon Bedrock 上 `computer_20251124` 继续可用（迁移指南见 opus-5-5/migration-guide）。同一模型条目还给出：默认 1M token 上下文窗口、128k 最大输出、always-on adaptive thinking，定价 $4 / $20 per MTok（Opus 5 为 $5 / $25）；`thinking` 不能禁用（`disabled`/`enabled` 均返回 400），思考深度改由 effort 参数控制；`tool_choice` 的 `any`/`tool` 返回 400，需用 `auto` + strict tool use。

窗口内另一条（09-18）补的是 Computer Use 的审计面：Compliance API 本地会话端点新增返回 Claude in Chrome 会话的 transcript（`product_surface` 值为 `claude_in_chrome`），面向 Claude Enterprise 组织 beta，沿用既有 Compliance Access Key 与 `read:compliance_user_data` scope。另有一条把工具定义放进对话中 system message 的 beta（`inline-tools-2026-09-15`，`tool_addition` 块携带完整定义，可增删改工具而不使 prompt cache 失效），与 MCP connector 的 `mcp-client-2026-09-15` 配合时定义可为 MCP toolset，响应以 `mcp_tool_listing` 块固定工具清单（[Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview)，2026-09-22 / 2026-09-18）。

判断：沙箱与桌面控制接口的版本绑定开始与模型版本联动——升级模型会强制迁移工具集，且同一工具集在不同云上兼容性不一致（Bedrock 保留旧版），这会让跨云跑同一 computer-use harness 变成需要按云分支的处理；而把 Chrome 会话 transcript 纳入 Compliance API，等于承认浏览器代理的用户侧行为必须可审计，与 E2B、Daytona 的「沙箱状态可寻址」在同一路线（可回放）。

取证边界：本次读到的是 release notes 概览页（`rawLength` 110,055 字符，读前 14,000 字符，已覆盖 2026-09-22—09-01 条目），未逐段读取 opus-5-5「What's new」与 computer-use-tool 文档正文，故工具集的功能差异（如坐标空间、动作集变化）不作描述（[computer use tool 文档](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)）。

### 托管浏览器与云厂沙箱：四种不同的静默写法

Browserbase 与 Stagehand 窗口内无重大公开动态。官方 changelog 最新条目为 2026-09-09「Webhooks in Functions」（可为 Browserbase Functions 配置 webhook，订阅 pending/running/completed/failed 事件）；其后依次为 08-21 Search 进入控制台、08-21 Stagehand 可配置缓存（`cache.threshold` 命中阈值、结果携带 `metadata.cache` 的 HIT/MISS/DISABLED 与节省 token 数、模型配置不进缓存键）、08-19 Context 命名与仪表盘管理、08-17 BYOS 支持 CDP 日志、08-10 Stagehand v4（框架核心 CDP 调度与状态移入浏览器扩展；官方称比 Playwright 快 2 倍、token 效率高约 80%）——均属窗口外背景。该家在 v4 之后进入控制台化与企业数据面（BYOS/CDP 日志）的收尾节奏，本周无新信号；这与其在 v4 中把执行面搬进浏览器扩展、把缓存放到服务端的经济学一致——该赛道本周没有新的隔离与回放原语，注意力被 E2B、Daytona 的状态分支叙事占据（[Browserbase changelog](https://www.browserbase.com/changelog)）。取证边界：changelog 列表页只读到 07-28 之前条目（页面截断），已覆盖 08-06 至 09-09，未发现窗口内条目；不排除有未抓取条目。

Modal 未取得窗口内（09-17—09-23）带日期的官方条目，因此不得写作无发布。已查入口：Modal 博客列表最新为 2026-09-14「Product updates: Sandbox Sidecars, new models, a refreshed dashboard」（覆盖 8 月更新）；Modal Changelog 条目列表可读但抓取结果不含日期字段，其中与 Sandbox 相关条目为：Sandbox Sidecars 进入 public alpha（同一 worker 上与沙箱同生命周期的伴随容器，官方推荐用于 secrets 注入与网络代理、多容器拆分）、`MODAL_SANDBOX_V2=1` opt-in V2 Sandboxes、Sandbox Filesystem API GA（旧 API 弃用）、Directory Snapshots GA、per-Sandbox CPU/内存/CPU 压力图表、Exit Reasons 图表（区分内存上限 OOM 与 memory-manager OOM）。Sidecars 公开 alpha 已在 09-14 的 8 月产品更新中被公告，属窗口外背景；另有一条事件性风险记录——2026-07-29 有第三方报道称 Modal Labs 披露有 OpenAI agent 波及其客户（第三方报道 + 公司声明，仅作背景）。方向判断：Modal 的沙箱演进在伴随容器化、快照与文件系统 API 稳定化、沙箱级可观测，Sidecars 明确把「把 agent harness 与它的工具调用分开跑」列为用例，正好落在 Runtime 与 Sandbox 的接缝上；但本周无窗口内证据，不写入本周动态（[Modal changelog](https://modal.com/changelog)、[09-14 产品更新](https://modal.com/blog/product-updates-sidecars-models-dashboard)）。取证边界：changelog 页无日期字段（抓取器未提取），无法据该页判定期次；本次未逐条打开 changelog 详情页取日期，属取证缺口。

OpenAI 窗口内部件侧无新条目。OpenAI API changelog 经 `.md` 孪生页读取，`## September, 2026` 段按时间倒序，最新条目即 2026-09-22，其后依次为 09-15、09-10（三条）、09-08（三条）、09-03（两条）、09-02、09-01——即窗口内仅 09-22 一条，内容是 GPT-6 Sol（`gpt-6-sol`）与 GPT-6 Luna（`gpt-6-luna`）两个推理模型发布（文本 + 图像输入、经 Responses 与 Chat Completions 输出文本；Sol $2 / $0.20 cached / $10、Luna $0.10 / $0.01 / $0.50 per 1M tokens，适用于 ≤272K 输入），未涉及 computer use、browser、code interpreter 工具层面的任何字段、工具版本或沙箱变更。窗口外背景：2026-09-10 Agents API 进入 public beta——托管 Codex harness，OpenAI 负责 session 编排、上下文压缩与恢复，durable sessions 跨轮续做、可接自建工具与 MCP server，agent 可跑在 OpenAI 托管沙箱，也可接入自有基础设施或受支持供应商的沙箱；2026-09-03 GPT-6 Astra 发布并在文档中把 computer use 列为目标场景（browser 与 desktop 工作流），同批加入 async tool calling、mid-turn steering、会话中改 thinking effort 等长任务控制。判断：OpenAI 这一周把动作放在模型侧（Sol/Luna 双档降价）而非执行环境侧，说明其沙箱与浏览器能力的本周变化集中在 9 月上旬之后进入消化期；托管沙箱的差异化已被各家在 9 月上旬同时写进各自 agent API，窗口内不再有新原语，注意力回到模型价格与推理成本。取证边界：changelog 按自然月分段且已读窗口内全部条目，故「窗口内部件侧无条目」成立；但 changelog 不覆盖平台侧全部变更，也不能排除文档级字段更新未入 changelog，能力面判断以此为界（[OpenAI API changelog](https://developers.openai.com/api/docs/changelog)）。

AWS AgentCore 的 Browser 与 Code Interpreter 本周无公开动态。依据：AgentCore devguide release notes 的「September 2026」段无 Browser 与 Code Interpreter 相关条目，该段披露的是 harness 侧 Runtime 能力（持久交互式 shell、`apiBase`、四个生命周期钩子、`hookEvent`）与 `platformVersion=V2` 计算底座，均属 Runtime 议题。这两个工具此前已随平台提供，本周未见其版本、区域或定价条目更新；同月 AWS 的强信号集中在 Runtime V2（P75 冷启动 1.9—2.0 秒，区域 us-east-1、us-east-2、us-west-2、eu-west-1、ap-northeast-1）。判断：AWS 把本月的执行力全押在 Runtime 底座与工具调用策略钩子上，沙箱与浏览器侧本周无动作——这与「Runtime 正在吞并策略点、而 Browser/Code Interpreter 已成标准件」一致：当沙箱成为默认配置项后，云厂的新增投入转向会话成本与调用拦截。取证边界：release notes 页按自然月分段、未逐条标注发布日，故只能记「2026 年 9 月月内无该两类条目」；不排除有未入 release notes 的文档级变更（[AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)）。

Azure 侧未取得窗口内条目（静默记录，非无发布断言）。已有已读证据：Browser Automation 文档页标注日期 2026-08-21，早于窗口；窗口内（09-17—09-23）未取得任何带日期的官方更新。本次补证尝试 `learn.microsoft.com/.../browser-automation.md` 的 Markdown 孪生页返回 404，未能从该路径取到正文（属路径不可用，非来源不存在）。窗口外背景：Azure 的 agent 侧沙箱与浏览器能力在 8 月文档批次中成型，Browser Automation、Code Interpreter、Playwright Workspaces 三件套作为工具形态；同期 Microsoft Foundry 的发布节奏按 7—8 月汇总页批量发布。判断：Microsoft 的沙箱与浏览器能力目前是「随 Foundry 文档批量更新」的形态，缺少独立的按周 changelog 入口，这使外部跟踪成本显著高于 AWS 与 Google；对照意义在于——没有按周 release notes 的产品，其动态在周报尺度上天然不可见，这不等于停滞，需按月度批次回看。取证边界：本次仅证明在已查入口未取得窗口内带日期条目，不能断言 Azure 窗口内零发布；Learn 文档的 `updated_at` 反映文档修订而非功能发布日（[Browser Automation 文档](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/how-to/tools/browser-automation)）。

Google 在代码执行与托管沙箱侧本周无重大公开动态，但澄清了一处原有取证缺口。经 `.md` 孪生页读取 Gemini Enterprise Agent Platform release notes 2026-09-14 至 09-22 全部条目，窗口内共 4 条：09-22「Feature」（该条目在官方源中仅有序号标题与类型标签，正文为空，故不以任何内容填充）、09-21 CodeMender v0.9.0（Fixed）、09-18 xAI Grok 4.6 GA + Agent Platform SDK for Python 2.0.1（Breaking）、09-17 Gemini Omni Flash 有状态与流式视频生成（Preview）。四条均不涉及 Code Execution 沙箱或 Managed Agents 沙箱的版本、区域或定价。窗口外背景：2026-09-14 CodeMender v0.7.0 含加固沙箱命令策略（阻止目录穿越与仓库根目录外的文件检查）与修复沙箱权限拒绝错误，是该平台窗口外最近的沙箱侧动作；更早的 Computer Use 与 Shell sandboxes GA 为 2026-09-09；09-16 CodeMender v0.8.0 加入工具载荷护栏（文件读 2 MiB、grep 512 KiB 上限）。判断：Google 的沙箱侧投入本周体现在 CodeMender 这类自有产品内嵌沙箱的加固（载荷上限、命令策略、会话可靠性），而非对外沙箱原语的发布——沙箱正从平台级商品分化为「产品内建部件 + 平台级 API」两层，前者更新频繁但不构成跨平台信号；09-22 的空条目提示依赖 release notes 做周度信号采集时，源侧条目质量本身会造成噪声，需如实标注而非推断。取证边界：本次已读该页 09-14 至 09-23 全部条目，故「沙箱侧窗口内无条目」在已读范围内成立；页面响应仍提示不完整（约 75 万字节截断），但 09 月段落已完整覆盖（[Gemini Enterprise Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)）。

### 热度补漏候选：一个标准件、一个框架、一个停更仓库

vercel-labs/agent-browser 窗口内有 1 个正式版本与 3 次主分支提交，且版本发布卡在窗口边界上。v0.38.1（published 2026-09-16T20:05:12Z）换算北京时间 2026-09-17 04:05，落在冻结窗口内；release body 仅两项：修复录制光标与鼠标移动的时序同步（拖动与定时鼠标移动时，光标渲染与页面内容保持同步，#1869），README 增加 Vercel Labs 产品与项目状态徽章（#1868），贡献者 @ctate、@Railly；同页更早的 v0.38.0（2026-09-16T13:24:39Z 即 09-16 21:24 北京时间）落在窗口前，按规则不写入本周动态，仅作边界说明。窗口内主分支提交为：09-18「fix: detect undersized shared memory mounts (#1890)」（检测共享内存挂载过小，属容器与沙箱运行可靠性）、09-21「Upgrade eve integration to 0.57.0 (#1945)」与「docs: update contact sheet example (#1871)」、09-22「fix(browser-use): use Cloud V4 with bounded session cleanup (#1879)」。仓库元数据快照为 43,122★ / 2,895 forks、创建 2026-01-11、`pushed_at` 2026-09-23T17:34:06Z（[v0.38.1](https://github.com/vercel-labs/agent-browser/releases/tag/v0.38.1)、[项目主页](https://agent-browser.dev)）。

agent-browser 已从 Vercel Labs 的实验 CLI 长成 43k stars 的浏览器执行层默认选项，其本周修复项集中在录制的时序保真（回放与取证可用性）与共享内存、会话清理（沙箱资源边界）——正是可隔离、可回放、可观测三条指标；对自建 browser 工具链的含义是：浏览器执行层正在被一个外部 CLI 标准件占据，需要评估与它的兼容，而不是重复造轮子。取证边界：仅读取 releases 列表页字段与 v0.38.1 release body、commits 列表（近 8 条），未打开 PR 正文、README 或产品文档，故其架构与定价不作判断；无跳期快照，故不计算周增速；v0.38.0 及更早版本属窗口外。

browser-use/browser-use 本周无重大公开动态，属静默记录。最新 release 为 `0.13.10`（published 2026-09-04T03:28:53Z），内容为工程化收口——Browser Harness 升到 0.1.13、全量精确锁依赖、迁移到 MCP Python SDK 2.1.1、显式加入 `pydantic-settings 2.15.0`、锁 `Pydantic 2.13.5` 与 `Hatchling 1.32.0`、升 `pypdf 6.16.2` 修三个 Dependabot 告警、把未知 MCP 工具调用报为应用错误而非成功结果；主分支近 6 条提交日期止于 2026-09-15（docs 类），窗口内无主分支提交；元数据为 116,079★ / 12,781 forks、`pushed_at` 2026-09-23T22:19:03Z（仓库有推送，但默认分支最新提交为 09-15，分支级推送不构成本周动态）。browser-use 是库形态（嵌入式浏览器 agent harness）而非托管执行环境，其 116k stars 说明「浏览器 agent 框架」这一层已高度商品化；与 agent-browser 的 CLI 与托管形态形成互补，上层框架与执行层 CLI 正在分工，本刊将其保留为执行环境层观察项而非固定对象（[0.13.10](https://github.com/browser-use/browser-use/releases/tag/0.13.10)）。取证边界：未打开 0.13.10 之后的分支、PR 与 issue；`pushed_at` 与默认分支提交日期不一致，本次以默认分支为准。

runtime-org/runtime 被过滤，不计入本期动态池。元数据（快照 2026-09-24）：203 stars / 5 forks、创建 2025-07-12、`pushed_at` 2025-08-30T23:26:58Z——近 13 个月无推送，既无窗口内提交也无窗口内 release，按热度补漏规则的门槛均不满足。热度扫描把该仓库与 agent-browser、browser-use 并列为候选属搜索噪声（名称含 runtime），实际是停更的早期实验项目；记录以说明补漏过滤理由，避免下期重复核查（[仓库页](https://github.com/runtime-org/runtime)）。取证边界：仅读取仓库元数据，未读代码或 issue。

### 执行环境层的本周判断

执行环境层本周的真实主线是状态可寻址加接口换代，而非新能力：E2B 把创建与连接切到 `/v2/sandboxes` 并把 `fork` 升为 CLI 一级命令、Daytona 把完整沙箱快照当成 coding agent 的 search state、Modal 侧 Directory Snapshots 与 Filesystem API 相继 GA（背景）、agent-browser 本周在修录制时序（回放保真）——四条动作指向同一结论：沙箱与浏览器的价值正从隔离执行迁移到可分支、可回滚、可回放的状态容器。

Computer Use 的接口开始与模型版本强绑定：Anthropic 在 Opus 5.5 上强制 `computer_toolset_20260801`（旧 `computer_20251124` 在 Claude API 与 Google Cloud 返回 400，Amazon Bedrock 例外），是首个把 computer-use 工具集版本与模型版本绑死的实例；跨云、跨模型的 harness 必须做显式版本矩阵，否则升级模型即断。

云厂托管沙箱本周集体静默，能力差异转向上层：AWS AgentCore Browser/Code Interpreter、Azure Browser Automation/Code Interpreter/Playwright Workspaces、Google Code Execution/Managed Agents sandbox 窗口内均无条目（Google 09-22 那条经 `.md` 孪生页核验为源侧空条目，不作推断）。云厂本周的投入在 Runtime 底座与策略钩子，沙箱作为已标准化的部件被降级为配置项。

自托管与第三方侧在抢可观测与可审计的定义权：Anthropic 把 Claude in Chrome 会话 transcript 纳入 Compliance API，agent-browser 的修复聚焦录制保真，Browserbase v4 早已把执行搬进扩展并做服务端缓存（背景）——浏览器代理的审计与回放正在成为合规入口，而非可选功能。本层仍碎片化但接口在收敛（创建与连接、fork、快照、录制四条接口逐渐统一），并出现商品化分层：托管沙箱（E2B/Daytona/Modal/云厂）与开发框架（browser-use）分离，CLI 执行层（agent-browser）成为事实标准件；云厂收编的是成本与策略，开源与第三方守住的是状态语义与回放保真。

## 工具网关与协议：授权下沉到单个工具

工具层的竞争轴已经从「能连多少工具」转到「凭据归谁、能不能逐工具授权、能不能审计」。协议本体本周推进有限而落地在加速，最硬的信号来自开源网关：它们把网关等同于数据面加授权策略执行点。商业工具网关则出现路线分裂，云厂本周没有新网关能力，增量全部来自第三方与开源。

| 对象 | 本周状态 | 证据源 |
|---|---|---|
| MCP（协议仓库与采用侧） | 轻量动态（draft 授权示例提交 + 治理 charter；采用侧 Google SecOps） | [协议仓库 commits](https://github.com/modelcontextprotocol/modelcontextprotocol/commits)、[Google SecOps 更新帖](https://security.googlecloudcommunity.com/what-s-new-in-secops-91/what-s-new-in-google-secops-2026-09-21-8255)（2026-09-21）、[Ruby SDK releases](https://github.com/modelcontextprotocol/ruby-sdk/releases) |
| A2A（Google / 跨 Agent 协议） | 静默（窗口内 1 条伙伴清单提交） | [A2A releases](https://github.com/a2aproject/A2A/releases)（v1.0.1 = 2026-05-28） |
| Composio | 有动态（Instant Tools 文档落盘） | [composio commits](https://github.com/ComposioHQ/composio/commits)（2026-09-23T14:10:30Z，sha 9832c09c） |
| Arcade | 内容层有动态、产品层静默 | [arcade.dev/blog](https://www.arcade.dev/blog/)（2026-09-17 两篇） |
| Nango | 有动态（BYOC 09-21、MCP OAuth scopes 09-17） | [Nango changelog](https://nango.dev/docs/updates/changelog) |
| Pipedream Connect | 静默（获取受限） | [Pipedream changelog](https://pipedream.com/docs/changelog)（最新条目 2025-10-01） |
| AWS AgentCore Gateway / Google Agent Gateway / Microsoft Toolbox | 静默或仅文档演进 | [AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)、[set-up-agent-gateway](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/set-up-agent-gateway)、[Learn what's-new](https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry) |
| agentgateway | 有动态 | [agentgateway releases](https://github.com/agentgateway/agentgateway/releases)（v1.6.0-alpha.2，2026-09-22T21:27:49Z） |
| mcp-gateway-registry | 有动态（窗口内密集提交） | [仓库 commits](https://github.com/agentic-community/mcp-gateway-registry/commits)、[releases](https://github.com/agentic-community/mcp-gateway-registry/releases)（1.30.0 = 2026-09-09） |
| microsoft/mcp-gateway | 静默（仓库 09-11 后无推送） | [仓库页](https://github.com/microsoft/mcp-gateway)（pushed_at 2026-09-11，无 release） |
| Zuplo MCP Gateway | 有动态（具名客户案例） | [Zuplo 博客](https://zuplo.com/blog/why-blockdaemon-chose-zuplo-mcp-gateway)（2026-09-22） |
| Smithery / Zapier MCP | 静默（未取得厂商侧窗口内材料） | [Zapier MCP](https://zapier.com/mcp)、[Zapier 工具说明](https://docs.zapier.com/mcp/overview/how-tools-work) |

### MCP：规范只动示例，采用侧已经切到 stateless

规范侧本周无新版本、无 RC；官方博客列表页最新三条依次为「更新路线图」（2026-08-22）、「2026-07-28 规范正式发布」、「官方 Ruby SDK 1.0」，均属窗口外，只能作背景。窗口内推进分两处。

其一在协议仓库，其中一项提交落在授权规范草案正文——`#3384 Use loopback IP literals in the CIMD redirect_uris example`（sha `00c3f2e7`，2026-09-22T13:08:33Z）修改 `docs/specification/draft/basic/authorization/client-registration.mdx`（+2/−2）：依据 RFC 8252 §8.3，原生应用重定向 URI 应优先使用 loopback IP 字面量而非 `localhost`，本次把 `localhost` 换成 IPv6 回环 `[::1]` 并同步更新时序图，明确仅触及草案中的非规范性示例。同期还有治理侧提交 `docs: add Infrastructure Working Group charter`（sha `0c230285`，2026-09-22T15:53:59Z，新增 112 行）与文档、依赖类提交；授权路径直查显示窗口内该目录仅上述 1 条提交。

其二在采用侧：Google Cloud 在 2026-09-21 的 SecOps 周更中明确其托管 MCP 服务器已支持 Stateless MCP Protocol（版本 2026-07-28），并同步更新文档；官方 SDK 继续迭代，`modelcontextprotocol/ruby-sdk` 的 `v1.6.0` 于 2026-09-21T04:05:31Z 发布（前一版 v1.5.1 为 2026-09-09），仓库 `pushed_at` 2026-09-23T15:21Z、918 stars。Google SecOps 更新区间标为「September 13th through September 20th, 2026」；协议仓最新 release 仍为 2026-07-28（published_at 2026-07-28T16:47:49Z）（[协议仓库 commits](https://github.com/modelcontextprotocol/modelcontextprotocol/commits)、[SecOps 周更](https://security.googlecloudcommunity.com/what-s-new-in-secops-91/what-s-new-in-google-secops-2026-09-21-8255)、[Ruby SDK releases](https://github.com/modelcontextprotocol/ruby-sdk/releases)）。

判断：这是规范仍在动的硬证据，但份量要准确称重——改动是非规范性示例的合规性修正（贴近 RFC 8252），不是新机制；真正值得记的是 Infrastructure Working Group charter 落地，它对应 8 月路线图里的治理成熟化，意味着协议下一步的重心在部署与运维侧（网关、注册表、基础设施）而非再改核心。对企业买方来说：授权模型的实现分歧（DCR 与 CIMD 并存）短期不会由规范强制收敛。取证边界：CIMD（OAuth Client ID Metadata Document）在 2026-07-28 规范中列为 client registration 的可选机制，本次仅见检索摘要未逐字读该规范页；窗口内引用的事实以仓库提交记录为据（[2026-07-28 client registration 规范页（背景）](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/client-registration)）。

### A2A：治理先行，工程节奏放缓

A2A 本周无重大公开动态。结构化直查显示窗口内唯一提交为 `docs: add MolTrust to partners (#2252)`（2026-09-22T13:27:09Z，sha 43e0c874），属伙伴清单维护；最新 release 仍为 `v1.0.1`（2026-05-28），版本序列为 v1.0.1 = 2026-05-28、v1.0.0 = 2026-03-12、v0.3.0 = 2025-07-30，窗口内提交数为 1。与 MCP 的高频落地形成对比，A2A 在窗口内无协议或产品级推进；结合 8 月 A2A 迁入基金会的治理动作（背景，非本周），其当前状态更像「治理先行、工程节奏放缓」，本周不宜写成进展（[A2A releases](https://github.com/a2aproject/A2A/releases)）。

### 开源网关：把授权下沉到单个工具

agentgateway 在窗口内发布 `v1.6.0-alpha.2`（2026-09-22T21:27:49Z，即北京时间 09-23 05:27，落在窗口内）；上一版 `v1.6.0-alpha.1` 为 2026-09-14T22:03:44Z（窗口外），稳定线仍是 `v1.5.0`（2026-08-27）。项目定位为「AI 流量统一数据面」：LLM、MCP、A2A、HTTP 同一平面，官网文档当前展示版本线 1.5.x，并强调成本可见与消费限额（consumption limits）。把 LLM 用量治理、MCP 与 A2A 代理、HTTP 出口放进同一数据面，是网关商品化的典型路径；1.6.0 仍处 alpha，说明其企业治理能力（配额、多租户）尚未定型，本周只能记为方向性信号（[agentgateway releases](https://github.com/agentgateway/agentgateway/releases)、[agentgateway 文档站](https://agentgateway.dev/)）。

mcp-gateway-registry 窗口内密集提交，主题全部集中在授权与凭据边界。一是 `feat(auth): OAuth 2.1 discovery identity for backend-authenticated MCP servers`（7275a29a，2026-09-21T18:41:19Z）——为需要后端认证的 MCP 服务器引入独立的 discovery 身份，并新增 UI 表单字段与 Helm 侧 `ENTRA_LOGIN_BASE_URL` 配置。二是 2026-09-22 连续三条围绕 per-tool block（`feat(security): surface and control per-tool blocks in the UI`、`feat(api): expose the per-tool block toggle to the client and CLI`、`fix(security): apply per-tool blocks to every read projection`）——把「禁掉某个工具」从服务级下沉到工具级，并要求所有读路径一致生效。三是 2026-09-21 密钥侧修 `purpose` 语义：`fix(vault): honour purpose in the Secrets Manager read-repair`、`fix(discovery): revoke on server delete, bind purpose into the AEAD`。

关键数据：仓库 939★ / 241 forks（热度扫描快照）；最新 GitHub release 为 `1.30.0`（published_at 2026-09-09，主题「Gateway for Any Resource: Inference, MCP, A2A, and REST」）；1.31.0 的 release notes 提交出现在 2026-09-23 UTC 21:49，已越出上海窗口，不记为本周边界内事实。这是本周最能代表「网关 = 策略执行点」的样本：把 OAuth 2.1 discovery、密钥 purpose 绑定、per-tool 阻断做成网关默认能力，直接对手是商业工具网关（Composio/Arcade/Nango）与云厂网关；对企业买方意味着逐工具授权与凭据撤销开始成为可自建的基线，而非付费差异点（[mcp-gateway-registry commits](https://github.com/agentic-community/mcp-gateway-registry/commits)、[releases](https://github.com/agentic-community/mcp-gateway-registry/releases)）。

microsoft/mcp-gateway 本周无重大公开动态。`gh api repos/microsoft/mcp-gateway` 返回 stars 850、forks 92、MIT、`archived:false`、`pushed_at 2026-09-11T18:05:12Z`（窗口前）；`/releases` 返回空数组（从未发 release）；窗口内 `/commits?since=2026-09-16T16:00Z` 为空。项目自述为 Kubernetes 环境的 MCP 反向代理与管理层（会话感知的有状态路由与生命周期管理）。仓库静默但其能力定位与本周开源网关的无状态化方向存在张力；本期不能把文档站存在写成产品发布，仅记静默与定位（[microsoft/mcp-gateway](https://github.com/microsoft/mcp-gateway)）。

### 凭据归谁：Composio 托管账号与 Nango 客户云内 BYOC

Composio 窗口内落盘一项新的实验性凭据模型——`Instant Tools`（`docs/content/docs/instant-tools.mdx`，front matter 标 `experimental: true`，由提交 `docs: document experimental Instant Tools for developers (#4604)`，9832c09c，2026-09-23T14:10:30Z 即北京时间 09-23 22:10 写入）。已读文档要点：Instant Tools 允许一个 Session 在终端用户未连接任何 provider 账号的情况下运行受支持工具，访问能力由 Composio hosted account 提供；此类调用的 premium 费用从组织的可用余额扣；该能力需项目级开关且尚未自助（需邮件联系开通并确认可用工具与费率），Session 配置无法覆盖被关闭的项目设置。API 字段：`premium_usage`（Python）/`premiumUsage`（TypeScript），其 `toolkits.enable` 单独限定可产生 premium 费用的工具，`return_premium_charge`（默认 `false`）只控制是否在工具响应里返回实际费用；文档明确警告 listing API 的 `no_auth` 与 `composio_managed_auth_schemes` 字段含义不同、不得当作 instant 可用性替代，且 instant 覆盖粒度是 per tool 而非 per toolkit。同日 2026-09-23T10:17Z 该仓库出现一批自动打标的示例包 release（如 `versioning-example@0.1.4`、`vercel-example@0.1.13`），属 monorepo 示例版本，非产品级发布。窗口外背景：Composio 于 2026-09-16 更新了 5 月安全事件说明（「Updated September 16, 2026」）。

判断：这是本周工具层里方向性最强、也最有争议的一条——把「每用户 OAuth」降级为可选路径，用平台托管账号代持访问权，换取零接入成本。代价是最小权限原则被绕过，企业买方只能靠项目开关、tool 级准入与计费侧控制兜底，而文档明确说 listing API 目前不返回 instant 可用性，等于准入信息只能靠厂商人工确认。对自持工具运行时的系统，这是「不要走这条路」的反面参照（[Composio commits](https://github.com/ComposioHQ/composio/commits)，2026-09-24 取得）。

### Arcade：产品侧静默，内容押在凭据不落地

Arcade 内容层有动态、产品层无窗口内 release。已读博客列表页显示两条 2026-09-17 帖子：教程《How to connect GitHub Copilot to MCP servers and tools with Arcade.dev》与观点文《We Built an AIO Tool to Track Citations. Now It's Yours.》。教程的列表摘要直指权限痛点：「Connecting Copilot to these tools locally is trivial. Doing it securely, without leaving raw tokens sitting in a config file, is not.」，并点名 Slack、Jira、Google Workspace、Linear、GitHub 等场景。列表页其余条目为 2026-09-14（AI Agent Governance Playbook，引用「81% 团队已让 agent 进入落地、仅 14% 完成完整安全签核」）与 2026-09-11（六阶段治理生命周期框架），均属窗口外背景；其中 81% 与 14% 的研究口径未独立核实。Arcade 本周把火力放在治理与凭据不落地的叙事上，与它既有的「MCP runtime 层持有 auth 与 per-user 权限」定位一致。取证边界：本次只读列表页与文章摘要，未逐字读取两篇全文正文，故不对其技术细节或新增能力作断言；产品侧本周无 `PRODUCT RELEASE` 类目新帖，只能记为静默偏营销输出（[arcade.dev/blog](https://www.arcade.dev/blog/)、[Copilot 接入教程](https://www.arcade.dev/blog/connect-copilot-mcp-arcade)）。

Nango 窗口内有两条明确的 changelog 条目。2026-09-21「BYOC self-hosting」：Bring Your Own Cloud 成为 Nango 推荐的自托管方式——Nango 把一套专用实例部署并运维在客户自己的云账号内，终端用户凭据、同步记录与日志都不离开该账号；Nango 承担部署、升级、扩缩容、事件响应与支持，同时提供 Nango Cloud 的全部功能；支持 AWS、GCP、Azure；BYOC 与 Self-Managed 两条路径都要求 Enterprise 计划。2026-09-17「Smaller improvements」：对使用通用 MCP OAuth provider 的集成，可在集成设置或创建集成时自行设定 Nango 请求的 OAuth scopes，而此前 scopes 只能来自 MCP server 自身的 metadata；同条还含 `nango compile/dryrun/deploy --sourcemap false`、`nango.getVariant()`，以及新增 Zoom、Gong、Granola、Outlook webhook 转发。窗口外背景（同页、不记本周）：09-16 停止接受 `nango.yaml` 部署，agent sessions 新增 `nango_proxy` 元工具与 `DELETE /sessions/{session_id}`（会话终止即吊销 token）；09-14 宣布支持 API 数超过 1,000 并加强 webhook 验签。

判断：Nango 的两条动作组合起来是一条清晰的主权叙事——凭据与日志留在客户云账号，OAuth scope 的请求范围由集成方而非第三方 server metadata 决定。这与 Composio 本周的 hosted-account 代持路线正好相反，说明工具层凭据由谁持有正在分裂为两种互斥架构，企业选型将按合规边界而非功能量决定（[Nango changelog](https://nango.dev/docs/updates/changelog)，2026-09-24 取得）。

Pipedream Connect 本周无重大公开动态，且获取受限。公开 Product Changelog 页最新条目为 2025-10-01（OAuth for Pipedream MCP + ChatGPT 支持，含静态端点 [mcp.pipedream.net/v2](https://mcp.pipedream.net/v2)、为 10,000+ 工具补 `toolAnnotations` 标注读写与破坏性），其下一条为 2025-09-09，窗口内没有任何新条目；首页当前自述为「Managed auth and 10000+ tools across 3000+ APIs」，并宣传面向企业 AI 工具的网关（SSO、access policies、per-user permissions、full audit trail），该页未标注日期。本次仅核对公开 changelog 页、首页与检索结果；changelog 可能落后于实际发布，因此只能判「本周未见公开动态」，不能断言其产品未更新（[Pipedream changelog](https://pipedream.com/docs/changelog)、[Pipedream 首页](https://pipedream.com/)）。

Zuplo 在 2026-09-22 发布客户案例《Why Blockdaemon Chose Zuplo to Connect AI Agents to Financial Tools》（作者 nate，tags: Customer Stories / Model Context Protocol）。已读要点：Blockdaemon 的 DeFi MCP Server 对外开放 180+ 金融工具（代币兑换比价、借贷仓位查询、staking 奖励核对），供 Claude Code、Cursor、VS Code、Codex 等客户端调用；Zuplo MCP Gateway 前置，把认证、工具访问控制（curation）、限流与每次调用的日志统一放在网关执行，使应用侧工程团队只专注工具实现。文中引用 Blockdaemon 工程总监 Varun Gyanchandani 原话：「Our customers adopt what they can audit, so agent access had to ship with authentication, curation, and logging enforced at the gateway from the first request.」。

这是本周少见的生产级落地佐证（具名客户加具名工程负责人加具体控制项），说明传统 API 网关厂商正把 MCP 网关当作既有产品线的延伸而非新赛道；买方话术从「能不能连」转向「能不能审计」，与开源网关本周补的 per-tool 阻断形成同一需求的两端供给（[Zuplo 客户案例](https://zuplo.com/blog/why-blockdaemon-chose-zuplo-mcp-gateway)）。

### 动态池与观察项：两个 SaaS 入口静默，一条提案待定

Smithery 与 Zapier MCP 本周无重大公开动态，未取得厂商侧窗口内材料。Smithery 一侧，检索仅得第三方对比文（称其相当于 MCP 生态的 Docker Hub、7,000+ 服务器，属第三方口径且为 2026-08-21，窗口外），未取得官方窗口内公告或 release。Zapier MCP 一侧，官方 docs `mcp/overview/how-tools-work`（无明确发布日）与介绍页均未标注窗口内更新；官方博客两篇相关文最近更新为 2026-08，均属窗口前。对比类页面（Obot 2026-09-09 更新、Speakeasy「Last updated: September 2026」、Composio 2026-07-28）为第三方营销与评测内容，不作为产品事实证据。两大 SaaS 系 MCP 入口本周未见公开动作，结合 Composio、Nango 与开源网关的可查动作，可判本层注意力已从「接更多 SaaS」转向「接的时候怎么授权」。取证边界：Zapier 与 Smithery 更新多走产品内改动或社区渠道，公开页未更新不等于未发布，本期不作反向断言（[Zapier MCP](https://zapier.com/mcp)、[Zapier 工具说明](https://docs.zapier.com/mcp/overview/how-tools-work)、[truefoundry 对比文](https://www.truefoundry.com/blog/best-mcp-registries)）。

另有一条只作观察、不作本周事实的提案：协议仓库 Discussion #234（Multi-user Authorization）未证实窗口内有实质进展。其正文提出为 MCP 增加工具级授权——由 server 声明每个工具所需的 OAuth scope、client 在调用时传入用户 token，从而支持 MCP server 多用户；并援引 #193（多租户 client 支持）、#205（把 MCP server 当作 OAuth Resource Server）、#214（On-Behalf-Of token exchange）作为背景，提案人称可提正式 PR、先收社区反馈。该讨论的评论时间线本次未取得（GitHub REST 不提供 discussions 接口，网页渲染未产出日期），故不能判定其在本周有新评论或进入规范流程。工具级授权（per-tool scope 加调用时传用户 token）正是本周产业侧（开源网关 per-tool block、Composio 托管账号、Nango 自定 scopes）各自打补丁要解决的问题；若该提案进入规范，网关层的现有私有实现将面临一次重构（[Discussion #234](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/234)）。

### 工具层的本周判断

- 竞争轴已经从「工具数量」转到「凭据归属 + 逐工具授权 + 可审计」：Composio 走平台托管账号（牺牲最小权限换零接入成本），Nango 走客户云内 BYOC 与集成方自定 OAuth scope，开源网关 mcp-gateway-registry 直接把 per-tool block 与 OAuth 2.1 discovery 做成默认能力，Zuplo 用客户案例证明「网关执行认证、限流、日志」可交付。
- 云厂侧本周无新网关能力：AWS AgentCore 9 月说明只有 Harness、Evaluations、Identity 与 Runtime V2 条目，Google Agent Gateway 仅文档演进，Microsoft 最新月度为 8 月页；本层本周增量全部来自第三方与开源。
- 协议层：MCP 本体推进有限但采用侧已开始按 stateless 的 2026-07-28 协议重写（Google SecOps 已切），A2A 无实质推进——工具层标准件实际由 MCP 单极主导。
## 身份与权限：凭据归属的三条路线

### 本周结论

- 云厂本周在 agent identity 上零新增：AWS AgentCore Identity 的 Consent Portal 实际披露日为 2026-09-14（窗口前，只能作背景）；Microsoft Entra Agent ID 相关文档 `updated_at` 停在 2026-08-13，9 月月度博客发在 09-01（窗口前）；Google 侧只有文档演进。即：权限层本周的增量全部来自集成商与开源。
- 凭据归属出现两条互斥路线（本周新证据）：Composio `Instant Tools` 用 hosted account 代持取代每用户 OAuth；Nango 用 BYOC（实例与凭据留在客户自有云账号）加可配置的 MCP OAuth scopes 反向强调主权。这是本模块本周最重要的结构性信号。
- tool permission 粒度从 server 级下沉到 tool 级：`mcp-gateway-registry` 本周把 per-tool block 做成 UI/CLI/API 三处一致可执行，并要求所有读投影一致生效；AWS Harness 生命周期钩子（`before_tool_call` 返回同步 allow/deny）属同一方向但披露期不明，仅作背景。
- 对 agent 平台的参照：若要与工具生态对企业交付，本周证据指向三点必备能力——凭据不落地到 agent 侧（可参照 OAuth 流程服务端化、浏览器不持 token）；授权粒度必须到单个工具且可撤销；每次工具调用须可审计（Zuplo 案例把可审计当作客户采用前提）。

### 固定对象状态表

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| AWS AgentCore Identity | 有动态但披露在窗口前（限述为背景） | [Consent Portal 文档](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-consent-portal.html)、[AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)；ML 博客 2026-09-14 | 是（含日期限定） |
| Microsoft Entra Agent ID / Foundry agent identity | 静默 | [agent-id what's-new](https://learn.microsoft.com/en-us/entra/agent-id/whats-new-agent-id)（updated_at 2026-08-13）、[Entra what's-new](https://learn.microsoft.com/en-us/entra/fundamentals/whats-new)（updated_at 2026-06-30） | 是（背景一句） |
| Google Agent Identity / Gateway / Gemini Enterprise auth | 静默（仅文档演进） | [set-up-agent-gateway](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/set-up-agent-gateway) | 是（限述） |
| Arcade Auth | 静默偏内容输出 | [arcade.dev/blog](https://www.arcade.dev/blog/)（2026-09-17） | 否（见集成商章节） |
| Composio Auth | 有动态（Instant Tools） | [composio commits](https://github.com/ComposioHQ/composio/commits)（2026-09-23） | 是（权限视角见下） |
| Nango OAuth / token management | 有动态（BYOC 09-21、MCP OAuth scopes 09-17） | [Nango changelog](https://nango.dev/docs/updates/changelog) | 是 |
| Pipedream Connect managed auth | 静默（获取受限） | [Pipedream changelog](https://pipedream.com/docs/changelog)（最新条目 2025-10-01） | 否 |
| 动态池：Auth0 / WorkOS / Descope | 窗口前（不写本周） | [Descope 对比文](https://www.descope.com/blog)（2026-09-03）等 | 否 |
| 动态池：Clerk / Permit.io / Aserto | 未取得窗口内面向 agent 的公开动态 | — | 否 |

### 深度笔记

#### AWS AgentCore Identity（Consent Portal）

- 本周动态：官方 AgentCore release notes 的「September 2026」段新增 Consent Portal for AgentCore Identity，但已读的 AWS ML 博客《Manage end-user OAuth consent for AI agents with Amazon Bedrock AgentCore》标注 Sep 14, 2026，索引同为 2026-09-14——按冻结窗口规则，本项记为背景（非本周），不写入本周动态；发布说明按月度归档、无日粒度，**不能证明本周新增**。已读文档要点：Consent Portal 是托管的、AWS 运营的门户，负责把终端用户认证到 OIDC IdP 并在 agent 代表其访问下游资源前收集同意；每个门户只绑定一个 AgentCore Gateway（作为其 source），并通过 OAuth2 credential provider 引用与 Gateway 入站 JWT authorizer 信任的同一个 IdP；关键设计是 OAuth 流程保持在服务端，浏览器不持有 token；管理面提供创建/查询/列表/更新/删除 consent-portal 五类操作，另有前置条件、执行角色与 target 配置等文档页。
- 关键数据：博客日期 2026-09-14（窗口前）；门户与 Gateway 关系 1:1；`openid` scope 为 IdP 必需项；门户 CRUD 操作名 create/get/list/update/delete consent-portal（[Consent Portal 文档](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-consent-portal.html)、[release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)）。
- 原文链接：[Consent Portal 文档](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-consent-portal.html)、[release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)。
- 影响判断：它把「用户同意」从各集成商自己搭的回调页收编成云厂托管件，并把同意对象锚定到具体网关而非全局账号，这是云厂把 identity 做成控制面资产的一步。对集成商（Composio/Nango/Arcade）是直接挤压：同意页与 token 边界一旦由网关托管，工具层的差异化只剩工具覆盖与延迟。
- 取证边界：窗口归属未确证（发布说明无逐条日期，只能以已读博客日期作窗口前限定）。

#### Microsoft Entra Agent ID / Foundry agent identity

- 本周动态：本周无重大公开动态。`entra/agent-id/whats-new-agent-id` 页 `updated_at` 为 2026-08-13（`ms.date` 2026-05-01），内容为 GA 后能力汇总，无 9 月条目：sidecar 模式 Auth SDK 认证与本地开发、下游 API 校验 agent token、非微软 agent 集成（AWS/GCP/n8n）、blueprint 与 agent identity 向导、删除级联清理与软删除、自定义 app 注册与 Copilot Studio 迁移等；`entra/fundamentals/whats-new` 页 `updated_at` 2026-06-30，最新段落停在 June 2026，其中「Public Preview - Extended Conditional Access protections for Agent's user accounts」（按 Agent Risk 策略、Custom Security Attributes 动态分组 agent、要求合规设备/受信网络）属 6 月背景。技术社区月度博客《What's new in Microsoft Entra: September 2026》发布于 2026-09-01（窗口前）。
- 关键数据：agent-id 页 updated_at 2026-08-13；Entra 总页 updated_at 2026-06-30、最新月度为 June 2026；9 月博客 2026-09-01（均在窗口外）。
- 原文链接：[agent-id what's-new](https://learn.microsoft.com/en-us/entra/agent-id/whats-new-agent-id)、[Entra what's-new](https://learn.microsoft.com/en-us/entra/fundamentals/whats-new)。
- 影响判断：Entra 的「blueprint → agent identity → sidecar 取 token → 下游校验」仍是企业侧最完整的 agent 权限模型，但本周无新增；其把 agent 纳入既有 Conditional Access 体系的路线与 Google「agent 为一等主体」不同，买方评估应以半年维度看而不是本周。

#### Google Agent Identity / Agent Gateway / Gemini Enterprise auth

- 本周动态：本周无重大公开动态（仅文档演进）。已读 `set-up-agent-gateway`（Gemini Enterprise Agent Platform → Govern → Gateways）页出现版本分界表述「Agent Gateway deployments created after September 8, …」，但该条件句在本次抓取中被截断，未取得完整条件与后果，故不作具体断言；同页导航可见 Agent Runtime 侧并列「Agent Identity with Agent Runtime」与「Route traffic through Agent Gateway」两条能力线，并区分 3-legged OAuth、2-legged OAuth 与 API key 三种 auth manager 认证方式。Gemini Enterprise Agent Platform release notes 为动态渲染，本次未取到窗口内的 agent identity 条目。
- 关键数据：文档提及分界日「September 8」（条件未取得）；auth manager 支持 3LO / 2LO / API key；Google Agent Identity 与 Agent Gateway ISV 生态（含 Saviynt）的公开宣布为 2026 年 5 月（背景）。
- 原文链接：[set-up-agent-gateway](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/set-up-agent-gateway)。
- 影响判断：本次未取得任何窗口内发布或 changelog 条目，因此只能判「静默 + 文档在演进」，不能判其能力未变；方向判断仍是「每 agent 一个一等主体 + 网关作为策略点」。

### 权限层专项：OAuth/OIDC/MCP auth、token 托管、用户授权、tool permission、审计、越权与泄露防护

- token 托管出现路线分裂：Composio 用 hosted account 代持（用户不连接 provider 也能跑工具，费用走组织余额，开关非自助）；Nango 用 BYOC（实例部署在客户云账号内，凭据/同步记录/日志不出域，AWS/GCP/Azure，需 Enterprise）；AWS 用托管门户把 OAuth 流程留在服务端（浏览器不持 token）。三者对「token 放在哪」给出三种互斥答案。
- 用户授权：AWS Consent Portal 明确在 agent 访问下游资源前收集用户同意，并绑定单个 Gateway；MCP 侧的授权基线仍是 OAuth 2.1 + PKCE + dynamic client registration（相关规范解读帖为 2026-09-03，属窗口前背景）。
- tool permission：`mcp-gateway-registry` 本周把 per-tool block 暴露到 UI/CLI/API 并强制所有读投影一致（2026-09-22）；AWS Harness 生命周期钩子 `before_tool_call` 支持 Lambda 返回同步 allow/deny 并可跳过工具调用（披露期不明，背景）。
- 审计日志：Zuplo 案例把每次调用的日志与认证、curation、限流并列为网关职责，客户原话把可审计当作采用前提；Nango 的 Agent session 日志过滤器为 2026-09-16（窗口外背景）。
- 越权与数据泄露防护：开源网关本周修 `purpose` 绑定（AEAD 内绑定用途）并在 server 删除时撤销借用凭据（2026-09-21）；Nango 于 09-14 扩大 webhook 验签、默认拒绝未签名推送（窗口外背景）。
- 不能作出的判断：无窗口内云厂 agent identity 新能力证据（AWS 为窗口前、MS/Google 静默）；A2A 的授权侧本周无任何进展；Clerk / Permit.io / Aserto 本周未取得面向 agent 的公开动态，不等于其无动作。

### 动态池与观察线索（未取得正文者不作本周事实采用）

- Auth0：Cross App Access 的 requesting-app 半侧于 2026-08-31 由 beta 进入 early access（据第三方博文 2026-09-04）——窗口前，不写本周；WorkOS：2026-09-03 发布 MCP 授权解读与 agent 授权博文——窗口前；Descope：2026-09-03 发布产品对比文，其中称某厂商 agent identity 模型截至 2026-09 仍处 Early Access（竞品对比文口径，未独立核实）——窗口前。
- 仅具搜索摘要、正文未取得（本次不作事实采用，仅列观察项）：行业通讯 2026-09-23 多条线索（某身份厂商融资并发布 Agent Identity Suite 题名、某厂商支持 Okta Cross App Access 但抓取超时、某企业与 IBM 将 IDTrust 上架 IBM Cloud catalog、Okta Oktane 2026 于 09-23 开幕），均未取得正文或官方材料，不写入本周动态。
- 已读且可用的相关条目：一份 2026-09-23 的身份行业通讯已读段落载有「Proof × Superfluid 将 agent 钱包交易绑定到已验证真人」——采用 Human-Factor Authentication 架构（agent 提议、人按策略批准），以经审计的 CA 与 NIST IAL2 做身份证明，并用 x401 开放 HTTP 协议双向质询 agent 与收款组织；该条属支付/身份交叉，仅作「agent 需可验证人类主体」的旁证。

### 模块洞察

- 本层本周的关键词是凭据归属而不是更细的 scope：Composio（平台代持）、Nango（客户云内 BYOC）、AWS（网关服务端持 token）三条路线同时出现，意味着企业选型的第一个问题会变成「token 存在哪、谁能看到」。最先被商品化的将不是工具数量，而是用户同意页与 token broker——AWS 已把它做成免费托管的控制面件。
- 云厂本周缺位、开源补位：per-tool 阻断、purpose 绑定、OAuth 2.1 discovery identity 都在社区网关里先落地，云厂（除 AWS 窗口前动作外）本周没有新授权能力，企业若现在要 tool 级最小权限，实际可得供给来自开源。
- 叙事与事实的差距：本周行业出现多起「agent identity」命名的新产品/合作条目，但本次多数只取到摘要；本期只把可读正文者（Proof × Superfluid、Zuplo 审计诉求、AWS 门户文档）纳入判断，其余留观察，避免把行业热度当成能力成熟度。

## 记忆与知识：从功能竞赛到可采购、可审计

### 本周结论

- 外部知识获取层本周出现「知识市场 + 融资」级信号：Firecrawl 于 09-22 发布 Alexandria 知识库并公布 7500 万美元 B 轮，把搜索/抓取 API 升级为「向数据提供方付费、由 Agent 查询的官方知识索引」，是本模块本周最强商业化信号。
- 记忆产品的竞争焦点从「存什么」转向「画像与评估」：Mem0 在窗口内发布动作型记忆基准 DolphinBench（09-22，把成本与延迟与准确率并列），并完成 User Profiles v1 的代码合并（PR#7340，合并时刻已越出冻结窗口）；supermemory 的 Console 同期加入 2FA、Memory Graph 渐进加载与连接器治理。
- 开源记忆库仍以可靠性 + 接入面打底：OpenViking 窗口内连发 `python-sdk@0.1.12`（09-18）与 `v0.4.21`（09-20），重点在存储/队列/路径锁与 MCP 参数校验；Cognee `v1.6.0`（09-18）主打无云 LLM Key 也能跑通与管线恢复。
- 静默面同样重要：Letta 窗口内默认分支无提交（最新 release 仍为 0.16.8，2026-05-14），Zep/Graphiti 窗口内无 release（最新 v0.30.2，09-08，窗口外），说明记忆层内部已明显分层，头部项目与长尾项目的发布节奏差在拉大。

### 固定对象状态表

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| OpenViking | 有动态（2 个 release + 20+ 窗口内提交） | [v0.4.21](https://github.com/volcengine/OpenViking/releases/tag/v0.4.21)（2026-09-20T08:45:08Z）；python-sdk@0.1.12（2026-09-18T10:17:32Z） | 是 |
| Mem0 | 有动态（DolphinBench 09-22；SDK v2.2.0 在窗口后） | [DolphinBench 博客](https://mem0.ai/blog/introducing-dolphinbench-mapping-the-pareto-frontier-of-agent-memory)、[PR#7340](https://github.com/mem0ai/mem0/pull/7340)（merged 2026-09-23T18:41:22Z，窗口后） | 是 |
| Cognee | 有动态（v1.6.0，2026-09-18T21:53:00Z） | [cognee v1.6.0](https://github.com/topoteretes/cognee/releases/tag/v1.6.0) | 是 |
| supermemory | 有动态（Console 更新 09-21；memory graph 0.2.4 提交 09-18） | [supermemory changelog](https://supermemory.ai/changelog/)、[09-21 条目](https://supermemory.ai/changelog/2026-09-21-console-updates) | 是 |
| Letta | 静默（窗口内提交为空） | 仓库 pushed 2026-09-10；最新 release 0.16.8 = 2026-05-14 | 是（静默记录） |
| Zep / Graphiti | 静默（合并追踪；窗口内仅 CLA 记录 + 治理 PR#1902） | [graphiti releases](https://github.com/getzep/graphiti/releases)（最新 v0.30.2 = 2026-09-08）、[blog.getzep.com](https://blog.getzep.com/) | 是（静默记录） |
| Firecrawl | 有动态（Alexandria + 7500 万美元 B 轮，09-22） | [Firecrawl changelog](https://www.firecrawl.dev/changelog)、[Alexandria 博客](https://www.firecrawl.dev/blog/introducing-alexandria-series-b) | 是 |
| Crawl4AI | 有动态（v0.9.4，2026-09-23T12:14:55Z） | [v0.9.4](https://github.com/unclecode/crawl4ai/releases/tag/v0.9.4)、[CHANGELOG](https://raw.githubusercontent.com/unclecode/crawl4ai/main/CHANGELOG.md) | 是 |
| 观察池：rohitg00/agentmemory、zilliztech/claude-context | 均无窗口内动态（未进正文） | gh api 元数据与 commits | 否 |

### 深度笔记

#### OpenViking（Context Database for AI Agents；火山引擎）

- 本周动态：窗口内 OpenViking 发布两次：`python-sdk@0.1.12`（2026-09-18T10:17:32Z）与主仓 `v0.4.21`（2026-09-20T08:45:08Z）。已读 release 正文显示 v0.4.21 改动集中在四条线：① 可靠性——修复 cp/mv 索引读取、空白资源导入、文件目标被误当目录、PathLock 接管、缺失目标锁定、QueueFS 后台队列隔离、completion 状态归属、本地向量存储进程锁；② Agent/记忆接入面扩张——新增 Hermes、MiMo/MiMoCode、WorkBuddy 日志源，新增独立 Hermes OpenViking memory provider，支持私有网关 header，改进插件 hook 与 MCP proxy 连接管理；③ 检索/MCP 行为——新增远程 VikingDB glob，修复 MCP grep 误报，并让 MCP `search` 在默认 `mode="list"` 下对 `query_expansion`/`max_tokens`/`quotas`/`purpose`/`detail`/`exclude_uris`/`rewrite` 等 context-only 参数直接报错而不是静默忽略（文档给出显式 `mode="context"` 的调用示例）；④ 体验与部署——Studio 新增 VikingBot 会话与飞书接入，Docker 相对工作区默认落入 `/app/.openviking` 持久化挂载，Tree-sitter 解析依赖固定版本，Codex 默认模型由退役的 `gpt-5.4` 改为 `gpt-5.6-terra`，Python SDK `requires-python` 从 `>=3.10` 降到 `>=3.8`。release 还给出回滚指引（P0 时回退 `v0.4.20`，hotfix 从 tag 拉 `release/v0.4.21-hotfix`）。窗口内提交（截止 2026-09-23T14:56Z，≥20 条）另显示：ACL 默认继承全员管理权限并支持创建时授权（#5266）、Hermes 网关记忆预设与发送者归属（#5293）、新增 Kimi Code CLI memory plugin（#4787）、web-studio 资源权限管理（#5329）、可观测性持久化最终 HTTP 检索结果计数（#5294）、tags 显式清空模式（#5327）、dsh-plugin 0.5.2 等。
- 关键数据：GitHub `volcengine/OpenViking` 38,554★ / 3,004 forks / created 2026-01-05 / pushed 2026-09-23T20:20:13Z / open issues 686 / 许可 AGPL-3.0（gh api，2026-09-24 取得，快照非增速）；release：v0.4.21 = 2026-09-20T08:45:08Z，python-sdk@0.1.12 = 2026-09-18T10:17:32Z（[releases](https://github.com/volcengine/OpenViking/releases)）。
- 原文链接：[v0.4.21](https://github.com/volcengine/OpenViking/releases/tag/v0.4.21)、[OpenViking 仓库](https://github.com/volcengine/OpenViking)。
- 影响判断：OpenViking 正在把 Context Database 做成 Agent 记忆的收编接口层——它同时向上兼容多种 coding/harness 客户端（Codex、Hermes、Kimi Code、WorkBuddy、MiMo），向下自己管存储/队列/向量库与 ACL。MCP `search` 参数校验与 ACL 默认继承这两条尤其可参照：前者是参数语义显式化，后者是默认权限收敛。同一条 release 里既有 SDK 降到 Python 3.8 这种扩装机量动作，也有 PathLock/QueueFS 这类并发正确性修复，说明它已进入生产可用度打磨期。

#### Mem0（The Memory Layer for AI Agents）

- 本周动态：窗口内两条主线。① 评估基准：Mem0 于 2026-09-22 发布开源基准 DolphinBench（「Mapping the Pareto Frontier of Agent Memory」），主张用真实动作任务而非问答式回忆来衡量记忆：三个知识工作者画像（Morgan = 创业 CEO、Alex = 基础设施工程师、Riley = 产品经理），每个画像有跨越数年的模拟历史，3,400—5,128 条用户消息、约 50 万 token（tiktoken `o200k_base`），共 600 个动作测试；要求所有结果同时报告总成本与任务延迟中位数，并用「有历史必通过 / 无历史必失败」的 with/without-history 双跑做可解性认证。官方入口为 dolphinbench.ai（leaderboard/dataset/run）、仓库 `mem0ai/dolphinbench` 与论文 arXiv:2609.24971。② SDK/产品：PR#7340「feat(profiles): User Profiles v1 — SDK methods + docs」于 2026-09-23T18:41:22Z 合并（上海 09-24 02:41，已越出冻结窗口），对应 release `v2.2.0`（Python SDK，2026-09-23T19:03:48Z = 上海 09-24 03:03，窗口后），新增 `get_profile()` / `generate_profile()` / `get_profile_settings()` / `update_profile_settings()` / `sample_profiles()` / `get_profile_job()`，画像为按项目自定义 JSON Schema、由 LLM 从该用户记忆填充的始终最新结构化 JSON，生成异步、每个 job POST 带 `Idempotency-Key` 便于安全重试。窗口内其余提交以插件遥测与接入面治理为主（09-18 一串 plugin telemetry 修复 #7322—#7325、#7358、集成面声明 #7326，09-17 安全升级 next 15.5.24 修 GHSA-p293-qw3h-jr36，#7420 agent-plugins 0.3.3），另有 Company Brain + Supabase cookbook（#7309）与 Copilot 指南（#7337）；同期还有 `ts-v3.3.0`、`pi-agent-v0.3.2`、`opencode-v0.4.1` 三个插件/SDK 版本（均为窗口后发布）。
- 关键数据：GitHub `mem0ai/mem0` 65,905★ / 7,748 forks / open issues 753 / Apache-2.0 / pushed 2026-09-23T19:13:42Z（gh api）；`mem0ai/dolphinbench` created 2026-09-22T03:34:02Z、26★、pushed 2026-09-23T16:39:13Z；DolphinBench 规模：3 画像、约 50 万 token/画像、600 动作测试、3,400—5,128 条消息/画像（[DolphinBench 博客](https://mem0.ai/blog/introducing-dolphinbench-mapping-the-pareto-frontier-of-agent-memory)，2026-09-22）；[v2.2.0 release](https://github.com/mem0ai/mem0/releases/tag/v2.2.0)（发布时刻在冻结窗口后）。
- 原文链接：[DolphinBench 博客](https://mem0.ai/blog/introducing-dolphinbench-mapping-the-pareto-frontier-of-agent-memory)、[v2.2.0 release](https://github.com/mem0ai/mem0/releases/tag/v2.2.0)、[PR#7340](https://github.com/mem0ai/mem0/pull/7340)。
- 影响判断：Mem0 本周最有价值的不是又一次 SDK 发版，而是把记忆变成可被采购方验证的指标问题：动作型任务 + 成本/延迟 + 可解性认证，直接瞄准「记忆系统 ROI 说不清」这一采购障碍，也把竞争从「谁功能多」推向「谁在同等成本下准确率更高」。User Profiles 则把记忆的产物从事实条目升级为用户级结构化画像，意味着记忆层开始承担用户建模职责；对应的工程启示是：session/memory 之上需要一层可审计、可 schema 化的 profile，且异步生成必须带幂等键，否则重试会造成画像抖动。
- 取证边界：User Profiles v1 合并与 v2.2.0 发布均越过 UTC 窗口边界，已按邻期信号处理、未计入本周动态。

#### Cognee（开源 AI memory platform / 自托管知识图引擎）

- 本周动态：窗口内发布 `v1.6.0`（2026-09-18T21:53:00Z，release 标题「Keyless workflows & pipeline reliability」）。已读 release 正文，变更主线为：① 无云 Key 优先体验——没有云 LLM Key 时系统会主动提示需要下载本地模型文件并解释行为，避免静默阻塞；需要 LLM 的管线阶段在缺 Key 时干净跳过而非半途失败；`add()` 不再为了探测 LLM 可用性去打云请求；② 管线可靠性——pipeline run 在启动时打上 origin 戳，崩溃后可可靠恢复并保留已完成文档；③ 模型接线补齐——`IMAGE_TRANSCRIBE_MODEL` 端到端透传到图像处理适配器，音视频/图像模型选择也接到 legacy adapter 层，且每个 dataset 记录其 embedding 模型，复用/更新向量时强制同模型，防止静默不一致导致检索质量下降；④ 开发工具与隐私——新增 `cognee-mcp` 客户端/服务端包，CLI 接入 Enola；遥测侧 dataset 名出主机前先做指纹化，错误遥测上报完整路由便于诊断。破坏性变更两条：默认 Docker 镜像移除 GLiNER（依赖它的部署须自行加装）；内部数据库与向量存储适配器（含 Postgres/hybrid）重构，自托管与自定义适配器需复核兼容性。窗口内另有配套提交（≤2026-09-19）：README 改为以 v1.6.0 本地记忆 quickstart 打头（#5141）、sdist 打包补 Ladybug 二进制（#5139）、dataset 权限拒绝契约对齐（#5133）、Docker 移除 GLiNER（#5124）。
- 关键数据：GitHub `topoteretes/cognee` 30,945★ / 3,094 forks / open issues 445 / Apache-2.0 / pushed 2026-09-23T21:37:33Z（gh api，2026-09-24）；release v1.6.0 = 2026-09-18，变更区间 v1.5.4rc1 到 v1.6.0，PR #4920 / #4994 / #5106（release 正文）；前一版 v1.5.4 = 2026-09-04（窗口外）。
- 原文链接：[cognee v1.6.0](https://github.com/topoteretes/cognee/releases/tag/v1.6.0)。
- 影响判断：Cognee 本周押注的是能不能脱云跑——这不只是成本优化，而是把自托管记忆从演示级推到可运维级（崩溃恢复、模型选择可追溯、无 Key 可用）。「每个 dataset 记录 embedding 模型」是一条容易被忽略但很关键的可复现性设计，直接对应「换了 embedding 后检索结果悄悄变差」这类生产事故。移除 GLiNER 说明它在做依赖瘦身，代价是既有自托管用户的升级摩擦。

#### supermemory（memory and context engine / Memory API）

- 本周动态：窗口内以 Console 与集成面为主，无新服务端 release。官方 changelog 条目 Supermemory Console updates（URL 路径 `/changelog/2026-09-21-console-updates`，即 2026-09-21）已读正文，含：① 双因素认证——Scale 与 Enterprise 计划可用 2FA，管理员可要求全组织启用，成员必须先开启 2FA 才能访问组织；② 改进——Memory Graph 改为渐进加载（连接关系不必等全图加载完即可浏览）、Console 新侧边栏（Data / Developer tools / Settings）；③ 修复——连接器可「连文档一起删」或「只删连接保留文档」，Notion 页面属性与数据库行编辑自动同步无需手动 re-sync，容器合并时 customId 重叠不再报错（并入方加 `_merge` 后缀）。同期 changelog 另含 Muse Code（Meta）与 Vercel Eve 框架的记忆集成条目；`@supermemory/tools` 的 `withSupermemory` 新增 `apiKey` 选项（不再只读环境变量，便于 secrets manager / edge runtime / 按请求密钥），MCP `get_document` 限定只读当前 space、search/graph 工具对 page/limit 做上界约束、`whoAmI` 不再回传传输层 session id。窗口内提交（gh api，≤2026-09-23）：`fix(mcp): treat full-scope read grants as read-only`（09-23）、`release memory graph 0.2.4`（09-18）、`feat(mcp): add get_profile and use snake_case for public tools`（09-17）、Muse Code 插件文档（09-17）、billing/Gmail 文档对齐当前计划权益（09-18）。
- 关键数据：GitHub `supermemoryai/supermemory` 30,844★ / 2,702 forks / open issues 119 / MIT / pushed 2026-09-23T06:42:04Z（gh api）；最新 release 仍为 `server-v0.0.8`（2026-08-17，窗口外）；`memory graph 0.2.4` 提交 2026-09-18T21:44Z。背景（非本周）：supermemory 于 2026-09-10 公告停止 company brain 与 Nova 产品线并退款（[公告](https://supermemory.ai/blog/an-update-to-supermemory)，窗口外）。
- 原文链接：[supermemory changelog](https://supermemory.ai/changelog/)、[09-21 Console 更新](https://supermemory.ai/changelog/2026-09-21-console-updates)。
- 影响判断：supermemory 本周做的是记忆平台的治理面——2FA + 组织强制 + MCP 只读语义 + page/limit 上界，说明记忆库一旦承载企业用户画像，安全与权限就从附加项变成准入门槛。注意其产品线收缩（停 company brain/Nova）与本次 Console 加固同时发生，可解读为从多产品铺开转向记忆引擎 + 集成面的收敛策略；相对 Mem0 的基准叙事，supermemory 选的是集成广度（Claude Code / Muse Code / Eve / MCP）路线。

#### Letta（Platform for stateful agents）

- 本周动态：本周无重大公开动态。gh api 显示 `letta-ai/letta` pushed_at = 2026-09-10T17:59:08Z（早于窗口起点 09-17），窗口内 `commits?since=2026-09-16T16:00Z` 查询返回空数组；最新 release 仍为 `0.16.8`（2026-05-14T17:14:24Z）。近两周背景一句：Letta 作为 MemGPT 谱系的状态化 Agent 平台，本期在开源侧进入低发布节奏，最新可见 release 已距今 4 个月以上。
- 关键数据：GitHub `letta-ai/letta` 24,861★ / 2,628 forks / Apache-2.0 / pushed 2026-09-10 / open issues 0（gh api，2026-09-24；open issues 计数为 0 与项目规模不符，疑为 issue 功能状态或 API 口径差异，本次不据此推论社区活跃度）；最新 release 0.16.8 = 2026-05-14。
- 原文链接：[letta releases](https://github.com/letta-ai/letta/releases)。
- 影响判断：在 Mem0/Cognee/supermemory 同期密集发版的对照下，Letta 的静默本身就是信号——状态化 Agent 平台与记忆 API/引擎两条路线正在分化，前者的迭代节奏明显慢于后者。
- 取证边界：仅完成 GitHub 元数据与 release/commit 直查，未取得企业侧公告或文档变更记录，不能断言产品停更。

#### Zep / Graphiti（agent memory server + temporal knowledge graph，合并追踪）

- 本周动态：本周无重大公开动态。`getzep/graphiti` 窗口内提交仅有 CLA 机器人签名记录（09-17 / 09-19 / 09-21 / 09-23）与一条实质 PR：#1902「Add contributor guidelines and an intake bot for issues and pull requests」（2026-09-21T19:48:51Z，属治理/流程而非产品功能）；窗口内无新 release，最新为 `v0.30.2 - FalkorDB updates`（2026-09-08T20:38:41Z，窗口外），再前为 v0.30.0 / mcp-v1.1.0（09-01，窗口外）。`getzep/zep`（示例与集成仓）pushed_at = 2026-09-18T01:35:08Z，但窗口内 commits 查询返回空。背景（非本周）：Zep 官方博客最近一篇与安全直接相关的文章《Defending Agent Memory Against Poisoning》发布于 2026-09-02（窗口外）；8 月另有关于其为 agent memory 构建图数据库服务 Konig 与 Memory MCP Server GA 的文章（均窗口外）。
- 关键数据：GitHub `getzep/graphiti` 31,108★ / 3,173 forks / open issues 511 / Apache-2.0 / pushed 2026-09-23T13:17:40Z（pushed 由 CLA 机器人产生，不代表代码变更）；最新 release v0.30.2 = 2026-09-08；`getzep/zep` 4,929★，pushed 2026-09-18。
- 原文链接：[graphiti releases](https://github.com/getzep/graphiti/releases)、[blog.getzep.com](https://blog.getzep.com/)。
- 影响判断：Zep/Graphiti 本期处于 release 间隔期 + 社区治理补课（贡献指南与 issue/PR intake bot），窗口内没有产品级变化。其 9 月初的记忆投毒议题值得记入观察，因为它是本模块少数把记忆层安全正面提出的厂商声音，与 supermemory 的 2FA、Crawl4AI 的 SSRF 修复在主题上共振：记忆与知识摄取层正在成为新的攻击面。
- 合并追踪说明：本笔记合并 Zep（托管平台）与 Graphiti（开源时序知识图引擎）两个仓，避免重复计数。

#### Firecrawl（外部知识获取入口：search / extract / crawl API）

- 本周动态：窗口内最强动作是 Firecrawl Alexandria + 7500 万美元 B 轮，官方 changelog 条目日期为 Sep 22, 2026，博客正文《Introducing Alexandria and our $75M Series B》已读。① Alexandria 被定义为给超级智能用的知识库，把官方数据提供方、站点专用连接器、Firecrawl 自有索引与实时网页聚合为一条统一入口，让 Agent 用同一种方式发现来源、查看来源内容并抽取；Agent 可查其 Research / Developer / Government 索引、查询数据提供方、并用专门工具拿到单页之外的信息。② 自报效果：在测过的垂直领域里，使用 Alexandria 的 Agent 答题质量比使用内置网页工具高 21%；口径为同一模型、同一 prompt、845 个任务、盲评 AI 打分（厂商自测，未独立复核）。③ 融资：B 轮 7500 万美元，领投 Smash Capital，参投 Altos Ventures、Nexus Venture Partners、Y Combinator、Freestyle、Offline Ventures。④ 商业模式主张——明确要为知识付费：让贡献知识的人（含个人）在 AI 使用其知识时获得报酬，已与包括 Wikimedia Enterprise 在内的多家数据提供方签有协议。⑤ 背景规模自报：Firecrawl 现有 150 万+ 用户，前身为文档 AI 产品 Mendable。窗口内 GitHub 侧提交（09-17—09-23，≥12 条）集中在 API 计费与浏览器能力：把调用方 external request id 带到每一笔 charge 与 extract/llms.txt/deep-research 计费（#4735/#4736）、`GET /v2/agent` 返回 `threadId`/`threadTurn`（#4744/#4746）、浏览器 profile 的保存/删除（`DELETE /v2/browser/profiles/:name`，#4730/#4733/#4734）、PDF 结果走 fire-pdf 缓存服务（#4727）、prompt injection guard 失败开放（fail open）时不再计费（#4747）。
- 关键数据：GitHub `firecrawl/firecrawl` 183,834★ / 9,903 forks / open issues 642 / pushed 2026-09-23T20:14:06Z（gh api，2026-09-24；注：仓库已从 mendableai/ 迁移至 firecrawl/ 组织）；最新 GitHub release 仍为 `v2.11.0`（2026-06-19，窗口外）；Alexandria 提升 21% 与 845 任务为厂商自测口径；B 轮金额与投资方名单来自公司自述（未独立核实到账）。
- 原文链接：[Firecrawl changelog](https://www.firecrawl.dev/changelog)、[Alexandria 与 B 轮博客](https://www.firecrawl.dev/blog/introducing-alexandria-series-b)。
- 影响判断：Firecrawl 把抓网页升级为知识供应 + 知识结算，这对本模块是路线级信号：知识层的竞争不再只是检索质量，而是谁能拿到官方/第一方数据并建立付费通道。若「按知识使用付费」成立，Agent 知识摄取将从免费爬取转向授权数据市场，直接影响企业 Agent 的数据合规与成本结构。同一周它在 API 侧补 `threadId`/`threadTurn`、浏览器 profile 生命周期与「守卫失败不计费」，说明它同时在做 Agent 原生 API 语义而非简单爬虫接口。

#### Crawl4AI（LLM-friendly crawler / scraper）

- 本周动态：窗口内发布 v0.9.4（2026-09-23T12:14:55Z），作者在 CHANGELOG.md 中直接定调为安全版本（security release），一次关闭三条协调披露的 advisory，并无破坏性变更，明确建议自托管 Docker server 的用户升级。已读 CHANGELOG 正文，三条安全修复为：① robots.txt 抓取导致的盲 SSRF（CWE-918，medium）——`RobotsParser.can_fetch()` 用裸 `aiohttp` 客户端抓 `/robots.txt`，会跟随重定向并重新解析主机，使不可信请求体里的 `check_robots_txt` 能让 Docker server 访问内网、回环与云元数据地址；现改为走服务端 pinning egress proxy，逐跳校验并只拨号已固定 IP（GHSA-f77g-77vp-r96v，致谢 arpe1618）。② `link_preview_config` 的 SSRF + 响应泄露（CWE-918，high）——URL seeder 用自有 `httpx` 客户端抓取页面上每个链接、绕开 egress 控制，并把每页解析后的 `<head>` 返回调用方；现同样走 pinning egress proxy，且 `LinkPreviewConfig` 对不可信请求体加 `max_links`/`concurrency`/`timeout` 上界（GHSA-wh5w-hmj3-vgg7，致谢 Ibrahim AlJaafreh、Cystack RedTeam）。③ 不可信配置闸门绕过 via dict-wrapper laundering（CWE-501，high）——把 `LLMConfig` 之类禁用的类型对象包成 `{"type": "dict", "value": {...}}` 可绕过 `UNTRUSTED_ALLOWED_TYPES`，`from_kwargs` 再重建对象（CHANGELOG 截断于此，完整影响范围未读完）。此外 0.9.4 把内容裁剪换成 lxml 原生 `PruningContentFilterLXML` 并设为默认，官方称裁剪性能约提升 10 倍。窗口内提交另含：安全修复合并（09-23）、`fix(robots): don't patch robotparser on Python 3.14+`（#2278，09-22）、池化 context 回收修复（#2232）、移除失效 Google Apps Script 星标步骤（#2279）、补 `docs(security)` 逐版本列出已修问题（至 v0.9.3）。
- 关键数据：GitHub `unclecode/crawl4ai` 84,159★ / 8,697 forks / open issues 190 / pushed 2026-09-23T15:10:21Z（gh api）；release v0.9.4 = 2026-09-23T12:14:55Z，前一版 v0.9.3 = 2026-08-31（亦为安全版本，窗口外）；裁剪性能约 10x 与三条 advisory 等级均为官方 CHANGELOG 自述，未独立复测；相关第三方条目 CVE-2026-91940（路径穿越）与 CVE-2026-91941（PDF 抓取 DoS）在搜索结果中可见（约 09-18 前后），本次未读取 NVD/厂商 advisory 原文，不对其与 v0.9.4 的对应关系下结论。
- 原文链接：[v0.9.4 release](https://github.com/unclecode/crawl4ai/releases/tag/v0.9.4)、[CHANGELOG 原文](https://raw.githubusercontent.com/unclecode/crawl4ai/main/CHANGELOG.md)、[安全策略与 advisory 索引](https://github.com/unclecode/crawl4ai/security)。
- 影响判断：Crawl4AI 这一版把本模块最被低估的风险摆上台面：知识摄取组件本身是 SSRF 与信任边界绕过的载体。robots.txt 与 link preview 这类看起来无害的抓取动作一旦跑在能访问云元数据的容器里，就是内网横向入口；这与 Zep 的记忆投毒、supermemory 的 2FA 是同一主题的不同切面。对 agent 平台：任何把抓取/解析组件放进 Agent 执行环境的方案，都必须默认走带 egress 白名单的代理，而不是依赖组件自律。

### 观察池速记

- `rohitg00/agentmemory`（热度补漏候选）：28,770★ / 2,497 forks / created 2026-02-25 / pushed 2026-09-21T06:13:05Z / open issues 608（gh api）；窗口内 commits 查询返回空，最新 release `v0.9.29` 为 2026-08-16（窗口外）。结论：高热度但本期无窗口内可核实的代码/发布增量，不构成本周动态。
- `zilliztech/claude-context`（候选）：12,565★ / 931 forks / pushed 2026-07-14（近 2 个月无推送），定位为给 coding agent 的代码检索 MCP，非记忆层基础设施，本期不写。

### 模块洞察

- 记忆与知识层本周同时出现三种收敛压力：一是可验证性（Mem0 用动作型基准 + 成本/延迟把「记忆好不好」变成可采购指标）；二是治理与安全（supermemory 组织级 2FA、Zep 记忆投毒议题、Crawl4AI 三条 SSRF/信任边界 advisory）；三是知识侧的商业结算化（Firecrawl Alexandria 提出为知识付费）。开源侧（OpenViking/Cognee）则在可靠性、脱云与可复现性上做工程补课。整体判断：记忆层已从功能竞赛进入可采购、可审计、可结算阶段，尚未标准化，但采购语言正在被头部厂商定义。

## 可观测：平台收编与标准分家

### 本周结论

- 平台级收编与标准层分家同时发生：AWS 用 Amazon CloudWatch Omni 正式可用把 agent 遥测、跨云遥测、自然语言排障与评测驱动开发流合进云控制台，并明确列出 LangGraph、CrewAI、OpenAI Agents SDK、Vercel AI SDK、Strands；同一周 OpenTelemetry 的 GenAI 语义约定独立成仓并修正 usage 指标口径（按模态、推理、缓存拆分）。
- 开源侧的发布几乎都落在成本核算、trace 边界正确性、模型网关接入三件事上：Langfuse 窗口内至少 6 个发布，Arize Phoenix v20.16.0 加入三个新模型价表与 `phoenix-evals` 3.9.0，Coze Loop 把轨迹列表改为单次 ClickHouse 查询；商业侧 LangSmith 专注评估结果的可复现口径。共认是：agent eval 的难点已从采集转向语义定义。
- 安全与治理成为本周硬信号：Helicone 修复平台管理员接管与跨租户 SQL 绕过（可观测平台自身即越权入口），AWS 在 AgentCore 上加 `before_tool_call` 级 allow/deny 与用户同意门户，Crawl4AI（见记忆与知识一节）连修三条 SSRF/信任边界。可观测与治理层正在被要求同时承担「看得见」与「拦得住」。
- 取证面需注意：Google 本周在该层无专门条目，Azure 官方 what's-new 仍停在 August 2026，属取证缺口而非事实性静默。

### 固定对象状态表

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| LangSmith | 有动态（周更「September 14-21, 2026」） | [LangSmith changelog](https://docs.langchain.com/langsmith/changelog) | 是 |
| Langfuse | 有动态（窗口内至少 6 个发布） | [v4.43.0](https://github.com/langfuse/langfuse/releases/tag/v4.43.0)、[v4.42.0](https://github.com/langfuse/langfuse/releases/tag/v4.42.0)、gh api releases | 是 |
| Helicone | 有动态（安全修复 PR#5816） | [PR#5816](https://github.com/Helicone/helicone/pull/5816)（merged 2026-09-16T19:28:17Z，落在窗口内） | 是 |
| AgentOps | 静默 | gh api：pushed 2026-06-25；最新 release 0.4.21 = 2025-08-29 | 是（静默记录） |
| Braintrust | 有动态（Python SDK v0.42.0，09-22） | [braintrust-sdk-python commits](https://github.com/braintrustdata/braintrust-sdk-python/commits)、[官网博客](https://www.braintrust.dev/blog) | 是 |
| Arize Phoenix | 有动态（v20.16.0，2026-09-23T15:41:54Z） | [v20.16.0](https://github.com/Arize-ai/phoenix/releases/tag/arize-phoenix-v20.16.0) | 是 |
| Coze Loop | 有动态（窗口内 5 条提交） | [coze-loop 仓库](https://github.com/coze-dev/coze-loop)（gh api commits） | 是 |
| OpenTelemetry for Agents / tracing 标准 | 有动态（semconv 迁移 + GenAI 指标提交） | [semantic-conventions-genai](https://github.com/open-telemetry/semantic-conventions-genai)、[迁移提示页](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/) | 是 |
| AWS agent observability / eval / guardrails | 有动态（CloudWatch Omni GA 09-23；AgentCore 9 月段） | [AWS What's New RSS](https://aws.amazon.com/about-aws/whats-new/recent/feed/)、[AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html) | 是 |
| Google（Vertex / Gemini Enterprise Agent Platform） | 弱动态 / 无专门条目 | [Gemini Enterprise Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes) | 是（记局限） |
| Azure（Microsoft Foundry） | 未取得（官方 what's-new 仍停在 August 2026） | [Foundry what's-new](https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry) | 是（记局限） |

### 深度笔记

#### LangSmith（LangChain 的 agent engineering / observability 平台）

- 本周动态：LangSmith Cloud 官方 changelog 存在覆盖「September 14-21, 2026」的周更条目（已读正文；该周窗口与本期窗口部分重叠，只采用其中与本期窗口语义一致且属该周更条目的内容）。可核条目集中在三块：① 轨迹与评估——trajectory evaluation 改为按 trace 根 run 的 start time 选取最新 trace（此前取子 LLM run 的 start time），trajectory 元数据上报每条 trace 的真实 root start time，根时间戳缺失的 scope 标记为 incomplete；evaluators list API 新增 `agent_id` 过滤；评估器侧栏在 run evaluator 使用 thread/trajectory 来源、或 thread/trajectory evaluator 使用 run 来源时阻止保存并显示映射错误；评估器配置无效时禁用 Save 并给出原因；organization 级模型配置用 API Key 认证时不再尝试按模型做 OAuth token 交换（Amazon Bedrock 这类配置不再被判为不支持）。② 数据与标注——annotation queue 的 completed items 列表支持「Add to Dataset」把选中 thread 条目按多轮 example 导入；experiment 结果下载勾选「含标注人名与评论」时保留每个 feedback 列里的自动 evaluator 分数；annotation queue 大小端点把 run 已删除的队列条目也计入；header 计数与删除确认改为按当前时间范围而非整个队列统计（计数端点新增 `min_start_time`/`max_start_time`）。③ 追踪与可用性——Insights 报告作业在 trace 扫描超时时改用更小分页重试而非整份报告失败；alerts 用输入/输出/错误文本过滤时不再受 blob storage 与 ClickHouse search 开关影响；tracing 批次上传超时改返回 408 Request Timeout（此前 503）。
- 关键数据：changelog 周更标签「September 14-21, 2026」（[LangSmith changelog](https://docs.langchain.com/langsmith/changelog)，2026-09-24 取得）；背景（非本周）：自 2026-09-14 起带扩展保留期的 SaaS trace 最多保留 180 天。本次未取得独立的 LangSmith 产品 release 号或客户端版本号（LangSmith 为 SaaS，未直查版本）。
- 原文链接：[LangSmith changelog](https://docs.langchain.com/langsmith/changelog)。
- 影响判断：LangSmith 本周的改动几乎全是结果可信度工程——trajectory 取根 run 时间、跨来源评估器直接禁止保存、自动分与人工标注并列保留。这说明 agent 评估的痛点已从「有没有 trace」转到「同一份 trace 用不同口径算会不会得出不同结论」。对 agent 平台：若未来做 session 级 eval，必须先在语义上固定以哪条 run 作为轨迹锚点，否则指标不可比。
- 取证边界：周更聚合无更细时间戳，不能逐条声称落在 09-17—09-23；自托管版 changelog 本次未读。

#### Langfuse（开源 agent evals & observability）

- 本周动态：窗口内发布节奏很密，gh api releases 显示 v4.38.0（2026-09-17）、v4.39.0 / v4.40.0 / v4.41.0（均 2026-09-21）、v4.42.0 与 v4.43.0（均 2026-09-23），另有 v3.225.9（09-22）/v3.225.10（09-23）维护线。已读 v4.42.0 与 v4.43.0 release 正文，可取的功能项包括：AI Gateway 接受 Anthropic 连接（resolution contract，v4.42.0）、evals 的 decision-model evaluators + TypeSafe Jev（实验性，v4.42.0）并把 TypeSafe decision-model 连接路由到 OpenRouter 或 Vercel AI Gateway（v4.43.0）、worker 抽出 OTEL 事件处理（v4.42.0，遥测侧结构重构）、成员列表支持按角色过滤（v4.43.0）、SCIM `Users/{id}` 读写限定到调用者所属组织（安全修复，v4.43.0）、trace 页与 observation 属性面板、树形指标热力图等 UI 一致性改造，以及 FTS 分词预过滤改在构建期决定（性能）。同批还含 `chore(assistant): switch to opus 5.5` 等内部升级。
- 关键数据：GitHub `langfuse/langfuse` 34,979★ / 3,837 forks / open issues 922 / pushed 2026-09-23T22:03:34Z（gh api，2026-09-24）；release 时间点 v4.38.0 = 09-17T15:26Z、v4.39.0 = 09-21T11:21Z、v4.40.0 = 09-21T14:32Z、v4.41.0 = 09-21T17:53Z、v4.42.0 = 09-23T07:19Z、v4.43.0 = 09-23T13:06Z。
- 原文链接：[v4.43.0](https://github.com/langfuse/langfuse/releases/tag/v4.43.0)、[v4.42.0](https://github.com/langfuse/langfuse/releases/tag/v4.42.0)。
- 影响判断：Langfuse 保持高频小步 + 自托管与云双轨（v3.225.x 维护线与 v4.x 主线并行），本周两个信号值得记：一是把 eval 的决策模型接到 OpenRouter / Vercel AI Gateway，即评估器本身开始依赖第三方模型网关，评估链路也进入模型无关架构；二是 AI Gateway 接受 Anthropic 连接，等于把网关层也纳入可观测平台，与 LangSmith 的平台内闭环形成对照。安全侧（SCIM 组织隔离）说明多租户隔离仍是这类平台的常态修补点。

#### Helicone（开源 LLM observability platform）

- 本周动态：窗口内合并了一条安全修复 PR#5816「fix(jawn): close platform-admin takeover and HQL cross-tenant bypass」，由 chitalian 于 2026-09-16T19:27:21Z 创建、2026-09-16T19:28:17Z 合并（= 上海 2026-09-17 03:27 / 03:28，落在本期窗口内；仓库 pushed_at = 2026-09-16T19:29:27Z）。已读 PR 正文，修复两个经负责任披露计划上报的授权问题：① 伪造 API Key 取得平台管理员权限——`add_member` 在检查调用者权限前就解析邮箱并返回账户 id；`update_owner` 只校验当前 owner 而未校验新 owner 是否为成员；新建 API Key 被打上 `organization.owner` 而非已认证调用者，导致临时换 owner 被永久写进 key 行；`/v1/admin` 仅 JWT 守卫用小写路径前缀比较，而 Express 路由大小写不敏感，于是 `/V1/ADMIN/...` 可绕过守卫到达控制器。修复：`middleware/auth.ts` 比较前统一小写并记录 `authParams.authType`；`adminController.authCheckThrow` 除 admins 表成员身份外额外要求 `authType === "jwt"`；`KeyManager.ts` 改用已认证用户戳记新 key；`OrganizationStore.updateOrganizationOwner` 要求新 owner 已是成员；`OrganizationManager.addMember` 先鉴权且控制器不再返回 `userId`。② HQL 租户隔离绕过——HQL 校验器用正则匹配原始查询文本，反引号包裹的表函数可绕过 `FROM`/`JOIN` 允许列表，转义标识符可让查询级 `SETTINGS` 覆盖 ClickHouse 行策略所依赖的会话设置。修复：`HeliconeSqlManager.ts` 改用一个小型词法器按 ClickHouse 的读法清空字符串字面量与注释，然后全面拒绍引号标识符、heredoc、`#` 注释、`SET`/`SETTINGS`、多语句、库限定名与 ClickHouse 表函数，`FROM`/`JOIN` 目标必须是带括号子查询或恰好为 `request_response_rmt`；`ClickhouseWrapper.hqlQueryWithContext` 再拒绍 `SETTINGS` 与反引号作为纵深防御；新增 `HeliconeSqlManager.validateSql.test.ts`。行为变更：用反引号/双引号标识符、`SETTINGS`、`numbers()` 之类表函数或库限定表名的 HQL 现被拒绍（官方称 UI 已发布示例仍全部通过）；非 owner 成员创建的 API Key 现在携带该成员 `user_id`，该成员离开组织后其 key 会因成员校验失败而失效。
- 关键数据：GitHub `Helicone/helicone` 6,176★ / 674 forks / pushed 2026-09-16T19:29:27Z（gh api，2026-09-24）；PR#5816 created 2026-09-16T19:27:21Z、merged 2026-09-16T19:28:17Z、作者 chitalian；窗口内该仓无其他提交（09-16T16:00Z 之后仅 3 条，含一次 revert 与一次 fallback 修复）。
- 原文链接：[PR#5816](https://github.com/Helicone/helicone/pull/5816)。
- 影响判断：这是一个可观测平台自身成为越权入口的典型案例：可观测系统同时持有跨租户请求数据与组织管理能力，一旦鉴权与 SQL 隔离失守，越权拿到的不只是日志，而是全租户请求内容。两条修复也给出通用教训——路径大小写归一化，以及不要用正则校验 SQL（应改用词法级解析并显式拒绍危险构造）。对自建 observability / 日志层是直接可迁移的检查项。

#### AgentOps（Python SDK for AI agent monitoring）

- 本周动态：本周无重大公开动态。gh api 显示 `AgentOps-AI/agentops` pushed_at = 2026-06-25T08:25:03Z（已近 3 个月无推送），最新 release 为 `0.4.21`（2025-08-29T06:36:28Z），窗口内无 release、无可见提交。近两周背景一句：AgentOps 定位为接入 CrewAI、Agno、OpenAI Agents SDK、LangChain、Autogen、AG2、CamelAI 等框架的 agent 监控与成本跟踪 SDK，本期在开源侧处于停滞状态。
- 关键数据：GitHub `AgentOps-AI/agentops` 5,837★ / 631 forks / pushed 2026-06-25；最新 release 0.4.21 = 2025-08-29。
- 原文链接：[AgentOps 仓库](https://github.com/AgentOps-AI/agentops)。
- 影响判断：在 Langfuse/LangSmith 高频迭代的对照下，独立 agent 监控 SDK 的窗口内静默说明单点 SDK 型 observability 正在被「平台 + 框架内置」挤压：框架自带 tracing 与开源平台双向夹击，独立 SDK 的差异化空间收窄。
- 取证边界：仅核 GitHub 公开数据，未核证其商业侧（是否有未在 GitHub 体现的产品动作）。

#### Braintrust（AI evals & observability）

- 本周动态：窗口内没有面向公众的发布公告（官网博客可见的最新融资条目为 2026-02-17 的 8000 万美元 B 轮，窗口外），动态集中在 SDK 迭代。gh api 显示 `braintrustdata/braintrust-sdk-python` 窗口内提交含：`chore: release Python SDK v0.42.0`（2026-09-22T19:26:13Z）、`feat: add span customizers (SDK-316)`（2026-09-23T21:48:33Z，窗口后）、`fix(anthropic): capture usage and refusal metadata`（2026-09-23T18:18:50Z，窗口后）、`chore: Update platform types`（多次，09-23）。JS SDK 仓 2026-09-23T21:54:07Z 仍有推送（窗口后）。可确认落在窗口内的实质项是 Python SDK v0.42.0（09-22）。
- 关键数据：`braintrustdata/braintrust-sdk-python` pushed 2026-09-23T21:48:34Z；`braintrustdata/braintrust-sdk-javascript` open issues 70、pushed 2026-09-23T21:54:07Z（gh api，2026-09-24）；**Braintrust 官方 SDK 仓 stars 极低（19★ / 28★）**，说明其分发不在 GitHub 星标维度，本次不据星标判断其市场地位。本次未取得 Braintrust 平台侧（SaaS）窗口内的官方发布说明或定价变更。
- 原文链接：[braintrust-sdk-python commits](https://github.com/braintrustdata/braintrust-sdk-python/commits)、[官网博客](https://www.braintrust.dev/blog)。
- 影响判断：Braintrust 本期是无公告、纯 SDK 迭代的节奏，且其最新改动（span customizers、Anthropic usage/refusal 元数据）正好落在窗口外一两天，属典型的错窗信号。值得注意的是其从 Anthropic 响应中采集 usage 与 refusal 元数据——这是把模型拒答纳入可观测/可评估维度，对企业合规审查有用。

#### Arize Phoenix（AI observability & evaluation，开源）

- 本周动态：窗口内发布 `arize-phoenix` v20.16.0（2026-09-23T15:41:54Z，落在窗口内），另有 `@arizeai/phoenix-mcp@4.3.12`（09-22）与 4.3.13（09-22）。已读 v20.16.0 release 正文，可见：成本表与 Playground 新增 `gpt-6-sol`、`gpt-6-luna`、`claude-opus-5-5` 三个模型；JS 侧新增 dataset split 写入助手与密钥管理助手；span 列表端点改为按 `start_time` 排序；修复 PXI turn trace 在服务端工具抛错时未正常收尾；内置模型 token 价格更新；依赖 `arize-phoenix-evals` 升到 3.9.0；文档新增 Cloudflare AI Gateway 追踪集成。
- 关键数据：GitHub `Arize-ai/phoenix` 11,591★ / 1,151 forks / pushed 2026-09-23T21:12:27Z（gh api，2026-09-24）；release `arize-phoenix-v20.16.0` = 2026-09-23T15:41:54Z、`@arizeai/phoenix-mcp@4.3.13` = 2026-09-22T14:25:11Z。
- 原文链接：[v20.16.0](https://github.com/Arize-ai/phoenix/releases/tag/arize-phoenix-v20.16.0)。
- 影响判断：Phoenix 的发布内容显示其重心在成本核算与 eval 库的持续同步（新模型价表、phoenix-evals 3.9.0）以及 MCP 化访问（phoenix-mcp 连发小版本）。「PXI turn trace 未收尾」这类修复与 LangSmith 的 trajectory/根 run 修正同源：agent trace 的边界定义仍是各家共同的 bug 集中区。Cloudflare AI Gateway 集成说明可观测平台正主动接入模型网关层，与 Langfuse 的 AI Gateway 动作同向。

#### Coze Loop（字节 / 火山引擎 Coze Loop，AI Agent 全生命周期平台）

- 本周动态：gh api 显示 `coze-dev/coze-loop` 窗口内 5 条提交，全部围绕评测与 Trace 的数据正确性：`[feat][evaluation] expose sandbox domain suffix on sandbox scheduler Run response`（2026-09-23T08:07:20Z）——在沙箱调度器 Run 响应中暴露 sandbox 域名后缀，便于评测运行时访问沙箱；`[fix][trace] check trajectory-node spans size instead of capping all spans in getTrajectoriesSingleQuery`（09-22）；`[feat][trace] optimize ListTrajectoryOApi to single CK query`（09-17，轨迹列表改为单次 ClickHouse 查询）；`[feat][trace] support logid in trace tree search`（09-17）；`[fix][evaluation] fix occasional missing top-level root_step in eval trajectory`（09-17）。周内无新 release。
- 关键数据：GitHub `coze-dev/coze-loop` 5,745★ / pushed 2026-09-23T08:07:22Z（gh api）；仓库说明自述定位为「Next-generation AI Agent Optimization Platform」，覆盖开发、调试、评测到监控的全生命周期。本次未取得窗口内 Coze Loop 官方中文产品公告或版本号（火山引擎文档站的更新记录未逐一核对），故本条以仓库级证据为主。
- 原文链接：[coze-loop 仓库](https://github.com/coze-dev/coze-loop)。
- 影响判断：Coze Loop 本周做的是大规模 trace 存储与检索的工程化（单 CK 查询、按节点体量校验、logid 检索），与其作为字节系 Agent 平台配套观测面的定位一致：观测平台的瓶颈已从「采得到」转到「存得起、查得快」。其「评测轨迹缺 root_step」的修复再次印证跨厂商共性问题。

#### OpenTelemetry for Agents / tracing 标准

- 本周动态：GenAI 语义约定已迁出主仓——官方文档页明确提示「GenAI 语义约定已迁至 OpenTelemetry GenAI semantic conventions 仓库，本页不再维护」；对应新仓 `open-telemetry/semantic-conventions-genai`（pushed 2026-09-23T04:53:59Z，388★）。窗口内该仓有实质提交：`Fix usage metrics to provide meaningful aggregation and break down by modality, reasoning, cache usage`（#374，2026-09-22T06:40:29Z）——即修正 GenAI usage 指标的聚合口径，并按模态、推理（reasoning）、缓存使用拆分。该仓窗口内无 release（gh api releases 返回空），最新语义约定版本仍为主线仓 v1.44.0 = 2026-08-04（窗口外）。
- 关键数据：`open-telemetry/semantic-conventions-genai` pushed 2026-09-23T04:53:59Z、388★、无 release（gh api，2026-09-24）；主线仓 `open-telemetry/semantic-conventions` 653★、pushed 2026-09-22T18:12:40Z、最新 release v1.44.0 = 2026-08-04。
- 原文链接：[semantic-conventions-genai](https://github.com/open-telemetry/semantic-conventions-genai)、[官方迁移提示页](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/)。
- 影响判断：GenAI 语义约定独立成仓是本周最容易被忽略但影响面最广的标准层动作：它意味着 agent/LLM 遥测从通用语义约定下的一个子域升级为独立演进的规范产品，跨厂商 trace 互操作（AWS CloudWatch Omni 亦宣称 OTel 互操作）将以此为准。usage 指标按 reasoning/cache 拆分这一条尤其关键——推理模型时代的成本口径必须区分 reasoning token 与缓存命中，否则各家面板不可比。

#### AWS（agent observability / evaluation / guardrails）

- 本周动态：窗口内有两条重量级动作。① Amazon CloudWatch Omni 正式可用（GA），官方 What's New 条目 `Amazon CloudWatch Omni: AI-first observability for agents and applications`，`<pubDate>` = Wed, 23 Sep 2026 00:06:00 GMT（上海 2026-09-23 08:06，窗口内），已读条目正文：Omni 是 CloudWatch 的演进形态，围绕团队与其运行的应用组织，把应用与 agent 的观测排障合到一处，结合 OpenTelemetry 互操作与 CloudWatch 的规模/可靠性；交付形态包括面向团队的独立 Web 体验（含 SSO）与本地 IDE 扩展；用户可在中心账号建 space，跨 AWS 账号/区域乃至其他云（含 Azure 工作负载）查看遥测；自动发现服务、绘制依赖、呈现 golden metrics；交互方式含自然语言问答、控制台点选，或经 Agent Toolkit for AWS 从自选工具驱动，自然语言提问后由 AWS DevOps Agent 辅助定位根因；专门提供 agent 可观测体验与评测驱动的开发工作流，覆盖 LangGraph、CrewAI、OpenAI Agents SDK、Vercel AI SDK、Strands 等框架，对每个 prompt、模型调用与工具调用帮助评估质量并跑实验验证修复；开发者可安装免费的 VS Code 扩展（`AmazonWebServices.amazon-cloudwatch-omni`）。② AgentCore 官方 release notes 的「September 2026」段（按月分组、条目未标注具体日）：Harness 持久交互式 shell（WebSocket、同一 microVM 会话、可重连并回放最多 256 KB、单会话最多 10 个 shell、须经 `InvokeAgentRuntimeCommandShell`）；Harness 生命周期钩子（`before_invocation`、`before_tool_call`、`after_tool_call`、`after_invocation`，Lambda 同步 allow/deny，SNS/EventBridge 非阻塞通知，`InvokeHarness` 发 `hookEvent`）；Evaluations 支持 TypeScript 框架（在 Python 之外新增 Strands Agents、LangGraph、OpenAI Agents 与 Vercel AI SDK 的 TS 版本评测）；AgentCore Identity 新增 Consent Portal（`portalUrl`，需 Gateway 配 JWT 入站认证且 IdP scope 含 `openid`）。窗口外邻期信号：Managed Knowledge Base 新增 Salesforce/Zendesk 原生连接器的 What's New 条目 pubDate = 2026-09-23T17:41Z（上海 09-24 01:41），越出窗口，不计入本周。
- 关键数据：CloudWatch Omni GA 条目 pubDate = Wed, 23 Sep 2026 00:06:00 GMT（[AWS What's New RSS](https://aws.amazon.com/about-aws/whats-new/recent/feed/)，已读原始条目）；AgentCore 月级条目细节（256 KB 回放缓冲、最多 10 个 shell、`InvokeAgentRuntimeCommandShell`、hook 边界名、Lambda allow/deny、TS 框架清单、`portalUrl` 与 `openid` 要求）（[AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)，2026-09-24 取得）；该文档未给逐条日期，故 AgentCore 各条不能断言具体发布日，**窗口归属未确证**。
- 原文链接：[AWS What's New RSS](https://aws.amazon.com/about-aws/whats-new/recent/feed/)、[AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)。
- 影响判断：AWS 本周把可观测层做成了平台级入口：CloudWatch Omni 不再只是给 agent 用的另一个面板，而是以 OTel 为互操作底座、把 agent 遥测与基础设施遥测合并、并让 agent 自己成为查日志的操作者。它明确列出 LangGraph/CrewAI/OpenAI Agents SDK/Vercel AI SDK/Strands，等于把开源可观测平台的核心卖点收编进云控制台；同一周 AgentCore 用 `before_tool_call` 的 Lambda allow/deny 把工具级拦截变成平台原语，并用 Consent Portal 补上代用户行动的同意这一环。对 agent 平台：hook 级（工具调用前后）+ 会话级（shell 回放）的可观测原语是可直接对标的缺口项。

#### Google（Vertex / Gemini Enterprise Agent Platform 的 agent observability / eval）

- 本周动态（弱）：官方 release notes 目前以 Gemini Enterprise Agent Platform 为主入口。窗口内条目为：09-22 一条 Feature（本次提取未取得其正文内容，不作任何描述）、09-21 CodeMender v0.9.0、09-18 xAI Grok 4.6 GA 与 Agent Platform SDK for Python 2.0.1（Breaking）、09-17 Gemini Omni Flash 有状态/流式视频生成（Preview）。其中与可观测/评测最相关的仅是 CodeMender v0.9.0 的 per-turn latency metrics（在 `cm stats` 与会话导出中拆分「等待模型推理」与「本地工具执行」耗时）；窗口内未见面向 agent observability / evaluation / guardrails 的专门功能条目。旧路径 Vertex AI generative-ai release notes 本次取得的最新条目仅为 2026-05-26，明显滞后于新平台页。
- 关键数据：窗口内条目日期 09-17 / 09-18 / 09-21 / 09-22（[官方页](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)，已读）；[旧路径 release notes](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/release-notes) 最新条目 2026-05-26。
- 原文链接：[Gemini Enterprise Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)。
- 影响判断：Google 本周在可观测层没有可核的专门动作，属于平台更新换代期（Vertex 文档入口被 Agent Platform 取代、Python SDK 2.0.1 破坏性迁移）。本次未取得 09-22 那条 Feature 的正文（提取为空，未改用浏览器补取），仅读官方 release notes，不能据此断言 Google 在观测层无进展。

#### Azure（Microsoft Foundry 的 agent observability / evaluation / guardrails）

- 本周动态：获取受限。官方 What's New 页本次取得的是「Microsoft Foundry docs: What's new for August 2026」（front matter `ms.date: 2026-09-01`、`updated_at: 2026-09-09`），未见 September 2026 条目；页面列出的新文档中与可观测/评测相关的是「Observability and evaluation」分类下的「Evaluate conversations with the Microsoft Foundry SDK」，但属 8 月批次。另 `/azure/ai-foundry/whats-new` 返回 404（路径不存在），说明该栏目当前使用 `azure/foundry/whats-new-foundry` 路径。
- 关键数据：Foundry What's New 页标题月份 = August 2026，`ms.date` 2026-09-01、`updated_at` 2026-09-09；`/azure/ai-foundry/whats-new` = HTTP 404（本次观测）。
- 原文链接：[Foundry what's-new](https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry)、[Foundry observability 概念页](https://learn.microsoft.com/en-us/azure/foundry/concepts/observability)（搜索可见，本次未读正文）。
- 影响判断：不能作出 Microsoft 本周在 agent 可观测/评测层无动态的判断——本次仅证明官方 What's New 页尚未发布 9 月条目。这是取证缺口而非事实性静默，需下游按限述处理。

### 模块洞察

- 本模块本周出现平台级收编与标准层分家同时发生：AWS 用 CloudWatch Omni GA 把 agent 遥测、跨云遥测、自然语言排障与评测驱动开发流合进云控制台（并明确列出 LangGraph/CrewAI/OpenAI Agents SDK/Vercel AI SDK/Strands）；与此同时 OTel 的 GenAI 语义约定独立成仓并开始修正 usage 指标口径（按 reasoning/cache/模态拆分）。开放标准与云平台互为依赖——云厂以 OTel 做互操作底座，标准侧则成为跨厂商可比性的唯一出路。
- 开源侧（Langfuse、Phoenix）本周的发布几乎都落在成本核算、trace 边界正确性、模型网关接入三件事上；商业侧（LangSmith）则专注评估结果的可复现口径（轨迹锚点、来源互斥校验、自动分与人工标注并列）。两类厂商的共识是：agent eval 的难点已从采集转向语义定义。
- 安全与治理成为本周硬信号：Helicone 修复平台管理员接管与跨租户 SQL 绕过（可观测平台自身即越权入口，建议路径大小写归一化 + 放弃正则校验 SQL），AWS 在 AgentCore 上加 `before_tool_call` 级 allow/deny 与用户同意门户，Crawl4AI（见记忆与知识一节）连修三条 SSRF/信任边界。可观测与治理层正在被要求同时承担看得见与拦得住。
## 企业平台控制面：云厂与字节系的实际增量

本周企业控制面的能力增量集中在运行时治理（AWS 交互式 shell、生命周期钩子与 Consent Portal）与 SDK 边界重划（Google 拆包迁移、Microsoft 编排状态恢复、OpenClaw 原子更新与计划任务）；中国云厂以大会叙事（阿里云云栖）与模型生命周期公告（腾讯云 ADP）为主，缺少可核的新组件级增量，火山 AgentKit 是唯一例外。

### AWS Bedrock AgentCore

本周最强的信号来自 AWS Bedrock AgentCore，文档侧与控制面同时有动作。AWS 文档在 2026 年 9 月一口气补上 Harness 的持久交互式 shell、生命周期钩子（Lambda 同步 allow/deny）、OpenAI 兼容自定义端点（`apiBase`）、Evaluations 的 TypeScript 支持与 AgentCore Identity 的 Consent Portal。这里有一条重要取证边界：AWS 文档按月分组且不给逐条日期，只能确认这些条目属 2026 年 9 月，无法确证落在 09-17—09-23 窗口内，因此按「9 月月度事实 + 窗口归属未确证」采用。唯一带硬指标且大概率落在窗口内的是新一代 Runtime，P75 冷启动 1.9—2.0 秒。

具体参数如下。持久交互式 shell 走 WebSocket，与 harness agent 共用同一个隔离 microVM 会话，保留环境变量、工作目录、命令历史与运行中进程，可重连并回放不超过 256 KB 的缓冲，单会话最多 10 个 shell，入口为 `InvokeAgentRuntimeCommandShell`（CLI 与高层 SDK 的 shell helper 暂不支持 harness 目标）。生命周期钩子覆盖四个边界，`InvokeHarness` 为每个触发的钩子发出 `hookEvent`，Lambda 可同步返回 allow/deny 以中断调用或跳过工具调用，SNS/EventBridge 负责通知。Consent Portal 是托管同意门户，`portalUrl` 让终端用户授权，要求 Gateway 以 JWT 入站认证为来源、IdP scope 含 `openid`，提供 create/get/list/update/delete 五类操作。新一代 Runtime 以弹性内存按实际用量计费，快照式冷启动使启动时间与镜像体积无关，`platformVersion=V2` 提供原地切换，覆盖 us-east-1、us-east-2、us-west-2、eu-west-1、ap-northeast-1 五个区域。9 月段还包含 8 月分组的 AWS Agent Registry（Organizations 自动发现、KMS CMK 加密、PrivateLink 双端点、RAM 跨账号四种权限）与 Memory 的 IngestData API、Flexible Namespaces，这些属窗口外背景，不计入本周。

来源：[release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)、[新一代 Runtime 公告](https://aws.amazon.com/about-aws/whats-new/2026/09/new-agentcore-runtime-generally-available/)、[生命周期钩子](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-lifecycle-hooks.html)、[Consent Portal](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-consent-portal.html)（2026-09-24 取得）。

从影响看，交互式 shell 把 agent 会话从黑盒调用变成可长期驻留的终端环境（状态跨输入保留、可重连、可回放），生命周期钩子则在每个关键边界给出企业做同步裁决的位置，等价于把 guardrail 下沉到运行时而非 prompt；两者叠加后 AgentCore 在运行时治理这一维明显领先，Consent Portal 补上终端用户同意这一身份环节。对自托管 Harness 而言，这三项分别对应 sandbox bind mount、工具策略审批与配对审批，若要对企业讲清楚「谁在何时批准了什么」，需要统一的事件模型与审计出口。

证据边界上，9 月月级条目窗口归属未确证（文档按自然月分组、无逐条日期）；新一代 Runtime 页面未内嵌显式日期，按 URL 月份与索引新鲜度（约 5 天前）判为大概率落在窗口内（≈09-19），日期未逐字确证，下游引用需保留此界限。

### Google Vertex AI / Gemini Enterprise Agent Platform

Google 本周的动作落在平台更名后的 SDK 迁移与跨运行时遥测保真上。Agent Platform SDK for Python 2.0.1（2026-09-18，Breaking）把生成式 AI 模块迁到 Google Gen AI SDK，agent 面从 `google-cloud-aiplatform` 拆为独立包 `google-cloud-agentplatform`，并做命名空间重构、附迁移指南；ADK Python v2.9.2（2026-09-18）只做一处遥测修正：OTel 事件名不再于 Agent Engine 之外被丢弃。

窗口内的平台条目有三条明确日期加一条空条目：09-21（Fixed）CodeMender v0.9.0，含交互式 HTML 安全报告、`--open`、新增 C#/Rust/Kotlin/Ruby/PHP 扫描、per-turn 延迟分解，以及长时程仓库扫描会话的可靠性修复与旧 CLI 升级工作区状态兼容；09-18（Feature + Breaking）xAI Grok 4.6 GA 在 global 与 US multi-region 端点可用；09-17（Feature）Gemini Omni Flash 在 Interactions API 支持有状态（`store: true`）与 SSE 流式（`stream: true`）视频生成（Preview）；09-22 存在一条 Feature 条目，但源侧为空条目，内容未取得。ADK v2.9.2 的 published_at 为 2026-09-18T18:08:40Z。来源：[Gemini Enterprise Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)、[adk-python releases](https://github.com/google/adk-python/releases)。

从影响看，SDK 2.0.1 的拆包与迁 Gen AI SDK 意味着 Google 把 agent 面从基础设施 SDK 中独立出来，这是平台化控制面的常见动作；ADK 承认 agent 会跑在 Agent Engine 之外，遥测不再被自家运行时垄断，对多云 Harness 友好。9 月其余条目（CodeMender、视频状态化）更多是工具链与多模态补强，未直接触碰企业控制面的 Runtime/Identity 维度。证据边界上，09-22 条目在官方源侧为空，不作内容推断；Memory、Gateway、Identity 三个维度本周未取得条目。

### Microsoft Foundry Agent Service / Copilot Studio / M365 Agent SDK

Microsoft 的服务面本周无已读公告，可核的是 `microsoft/agent-framework` 于 09-18 发布 `python-1.19.0` 与 `dotnet-1.22.0`，内容为编排工作流稳定名加 checkpoint 恢复、per-tool 暴露控制。近两周背景（非本周）：Foundry Hosted Agents、Voice Live、Toolboxes 于 7—8 月转 GA；Entra 保护的 MCP 加用户级委托属 2026-07 背景；Learn 8 月页列出长时运行 agent API（preview）、崩溃恢复与可操控 turn、human-in-the-loop 审批等。数据面：Foundry 博客最新帖 2026-09-15，Learn what's-new 页 `ms.date` 为 2026-09-01、`updated_at` 为 2026-09-09。来源：[Foundry 博客](https://devblogs.microsoft.com/foundry/)、[agent-framework releases](https://github.com/microsoft/agent-framework/releases)、[Learn what's-new](https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry)。

从影响看，Microsoft 的企业控制面优势仍在身份与委托（Entra + Toolboxes）一侧，Runtime、Sandbox、Eval 面本周无新信号，其发布节奏偏月度汇总，在周报尺度上天然存在盲区。证据边界上，服务面与可观测层均为取证缺口，不得写作 Microsoft 本周无发布。

### 阿里云百炼 / Model Studio / PAI

窗口内最明确的信号是 2026 云栖大会于 09-22 开幕（会期 09-22—24，杭州国际博览中心），主题「智以致用」；大会设 3 大主论坛共 4 场，其中「技术主论坛·Agentic Cloud」与「技术主论坛·MaaS＆Agent」直接对应 Agent 基础设施与模型服务平台。直播页显示 09-22 09:30-12:00 一场的主题为「阿里云面向智能体时代的基础设施布局」，摘要提到「以 AI Native 加速模型训练与推理，以 Agent Native 支撑智能体的构建与运行，以 Data Plane 承载模型训推所需的数据」，并出现「为亿万智能体提供身份」的表述。另有第三方文章指出龙蜥社区于 09-23 在云栖设「AI Agent 原生操作系统」分论坛（含阿里云等企业专家的分享）。百炼产品文档「应用功能动态」页 2026 年仅 1—2 月有条目。来源：[云栖议程](https://yunqi.aliyun.com/2026/agenda)、[直播页](https://yunqi.aliyun.com/2026/live)、[开发者文章](https://developer.aliyun.com/article/1764944)、[百炼应用功能动态](https://help.aliyun.com/zh/model-studio/application-release-notes)。

从影响看，阿里云正把 Agent 基础设施提到主论坛级别（Agentic Cloud 与 MaaS＆Agent 双主论坛加 Agent 原生 OS 分论坛），控制面叙事与 AWS、Google 同频；但本周可核的产品级增量本次未取得，只能作为战略姿态与议题设置信号使用，不能替代产品事实。对自托管方案的参照：若「为亿万智能体提供身份」成为主线，身份与权限层的标准化会从云厂侧推动，自托管方案需要提前对齐可验证凭证与审计出口。

证据边界上，本线只取到日程与直播页摘要加第三方预告，未取得 09-22、09-23 的正式发布稿或产品清单，故不使用「发布了某产品、某能力」这类主张；检索中出现的百炼「9月23日智能体应用回复功能升级、多函数调用」等条目，经核对位于该页 2025 年段落，属旧闻，已排除。

### 火山引擎 Ark / Coze / Coze Studio / Coze Loop / OpenViking

字节系主平台文档级本周无重大公开动态。扣子官方文档「更新动态」页最新条目为 2026 年 07 月（豆包渠道下架说明），2026 年 03 月的三方知识库、2025 年 11 月的 MCP 插件、Responses API、异步工作流等均为更早内容；检索到的扣子云盘扩容计费条目发布日期为 2026-09-09，在窗口之外。火山方舟（Ark）侧本次未取得窗口内发布条目。近两周背景（非本周）：扣子已具备 MCP 插件接入、Responses API 协议切换、异步工作流、企业商店与记忆库等能力；火山引擎 AgentKit 文档所载 DeliveryAI 服务自 2026-08-18 起邀测，并在窗口内有两条更新。来源：[Coze 更新动态](https://docs.coze.cn/recent-updates)、[AgentKit 新功能发布记录](https://docs.volcengine.com/docs/agentkit/new-feature-release-record)。

从影响看，字节系本周在 Agent 平台层与基础设施发布面保持静默，与 AWS、Google 的密集更新形成对比；但同一集团的 AgentKit（交付、沙箱、评测）、Coze Loop（评测、Trace）与 OpenViking（Context Database）三条产品线在窗口内均有可核更新，说明其重心在配套能力而非主平台文档。证据边界上，本次仅核 Coze 文档更新动态页与 AgentKit 文档，未逐一核对 Ark 主平台与 Coze Studio 开源仓库的全部变更入口。

### 腾讯云智能体平台 / 元器 / CloudBase AI Toolkit

腾讯云侧本周可核的事实是平台公告：腾讯云服务公告列表显示 2026-09-18 12:05:52 发布《【产品公告】【智能体开发平台 ADP】关于腾讯云 DeepSeek-V4-Flash 模型下线及切换升级的通知》。ADP 产品动态文档最新条目为 2025-08。来源：[腾讯云服务公告](https://www.tencentcloud.com/announce/zh)（2026-09-24 取得）、[ADP 产品动态](https://cloud.tencent.com/document/product/1759/104191)。

从影响看，模型生命周期公告说明 ADP 的应用层已与模型版本强耦合，模型下线即需切换，对企业客户是运维负担信号：控制面若不能提供「模型可替换、可回滚」的抽象，平台升级会持续向客户传导变更成本。本周未取得任何 Runtime、Memory、Identity 维度的能力增量。证据边界上，本次仅取得公告列表中的时间戳与标题，未取得公告正文，因此不采用任何关于下线具体日期、切换目标模型、计费变化的主张（检索另见计费文档摘要含「将于 2026 年 9 月 27 日 00:00 下线」字样，但同为摘要级片段，未读正文，不作事实采用）。产品动态页响应不完整，已读段落止于 2025-08，不得写作零发布。

### Databricks Mosaic AI Agent Framework / Agent Bricks

Databricks 本周无重大公开动态。平台 release notes 页本次校验日期为 2026-09-11（窗口外），窗口内无 Agent Bricks 与 Mosaic AI Agent Framework 新条目；docs 的「Use agents on Databricks」页最近更新 2026-09-15（窗口外）。近两周背景（非本周）：Agent Bricks 在 2026 DAIS（2026-06-16）扩展为面向开发者的综合 agent 平台，并定位为「企业内全部 AI agent 的统一治理、管理、监控与可观测控制面」；Mosaic AI Agent Framework 与 Agent Evaluation 已 GA。来源：[Databricks release notes](https://docs.databricks.com/aws/en/release-notes/product/)、[Agent Bricks 产品页](https://www.databricks.com/product/artificial-intelligence/agent-bricks)。

从影响看，Databricks 本周静默，但其「数据治理即控制面」的定位与云厂 Runtime、Identity 路线不同源——若企业把 agent 可信度押在数据血缘与评估上，Databricks 仍是独立选项；本周无证据显示其推进或退步。

本周控制面能力正从「能跑起来」转向「能被审计、被裁决、可回滚」。这一转向被云厂收编的速度快于标准化速度，协议层（MCP、A2A）本周无重大进展，意味着互操作性短期仍要靠各平台自建的网关与身份体系。

## 七个平台的能力边界

下表按七个维度逐格对照本周可核的云厂平台能力。

| 平台 | Runtime / Session | Memory / Context | Gateway / Tools | Identity / Auth | Sandbox / Browser / Code | Observability / Eval | 本周强信号 |
|---|---|---|---|---|---|---|---|
| **AWS Bedrock AgentCore** | AgentCore Harness + Runtime；**新一代 Runtime**：弹性内存按实际用量计费，快照式冷启动使启动时间与镜像体积无关，`platformVersion=V2`，5 区域；9 月月级新增**持久交互式 shell（WebSocket）**：与 harness agent 同一隔离 microVM 会话，保留环境变量/工作目录/命令历史/运行中进程，可重连并回放 ≤256 KB 缓冲，单会话最多 10 个 shell，入口 `InvokeAgentRuntimeCommandShell`（CLI 与高层 SDK 的 shell helper 暂不支持 harness 目标） | AgentCore Memory；8 月新增 IngestData API 直接写入长期记忆与 Flexible Namespaces（9 月未见新的 memory 条目） | AgentCore Gateway；AWS Agent Registry（8 月 GA：Organizations 自动发现、KMS CMK 加密、PrivateLink 双端点、RAM 跨账号四种权限）；Harness 新增 OpenAI 兼容自定义端点 `apiBase` | AgentCore Identity：9 月新增 Consent Portal（托管同意门户，`portalUrl` 让终端用户授权，需 Gateway 以 JWT 入站认证为来源且 IdP scope 含 `openid`；提供 create/get/list/update/delete 五类操作）。**月级条目，窗口归属未确证**；已读博客日期为 2026-09-14（窗口前） | 与 harness 同 microVM 的隔离会话；Harness 支持自定义容器；AgentCore Browser / Code Interpreter 在 9 月段无条目（本次未取得窗口内条目） | **Amazon CloudWatch Omni GA（09-23 00:06 GMT）**：OTel 互操作、跨账号/区域与其他云遥测、自然语言排障、评测驱动开发流，覆盖 LangGraph/CrewAI/OpenAI Agents SDK/Vercel AI SDK/Strands；**AgentCore Evaluations 新增 TypeScript 框架支持**（与 Python 版并列） | 新一代 Runtime（P75 冷启动 1.9—2.0 秒 vs 上一代 5.4—30 秒）+ 交互式 shell + 生命周期钩子（Lambda 同步 allow/deny、SNS/EventBridge 通知、`InvokeHarness` 发 `hookEvent`）+ Consent Portal + Evaluations TS + CloudWatch Omni GA；**月级条目窗口归属未确证** |
| **Google Vertex AI / Gemini Enterprise Agent Platform** | Agent Engine（托管运行时）；**Agent Platform SDK for Python 2.0.1**（2026-09-18，Breaking）：生成式 AI 模块迁至 Google Gen AI SDK，agent 面自 `google-cloud-aiplatform` 拆为独立包 `google-cloud-agentplatform`，命名空间重构 | 本次未取得（窗口内无 Memory Bank 条目） | 本次未取得（窗口内无 Gateway/A2A 条目） | 本次未取得（窗口内无 agent identity 条目；文档仅出现「deployments created after September 8」条件句且被截断） | CodeMender CLI（v0.9.0，09-21）属代码安全扫描工具链（交互式 HTML 报告、per-turn 延迟指标）；09-14 CodeMender v0.7.0 加固沙箱命令策略属窗口外；对外沙箱/浏览器条目本次未取得 | ADK v2.9.2（2026-09-18）：OTel 事件名在 Agent Engine 之外不再被丢弃；平台侧 09-17 记录 Gemini Omni Flash 有状态 + SSE 流式视频；窗口内无专门的 agent observability/eval 条目 | SDK 2.0.1 拆包迁移（Breaking）+ ADK 跨运行时遥测保真 + Grok 4.6 GA；**09-22 有一条 Feature 条目源侧为空、内容未取得** |
| **Microsoft Foundry Agent Service / Copilot Studio / M365 Agent SDK** | Foundry Hosted Agents（Build 2026 引入，属背景）；Foundry 博客最新帖 2026-09-15，窗口内无新帖；`microsoft/agent-framework` 于 09-18 发布 `python-1.19.0` / `dotnet-1.22.0` | 本次未取得（窗口内无 Foundry memory 条目） | Foundry Toolboxes、Work IQ MCP（属 2026-07 背景）；窗口内无新条目 | Entra 保护的 MCP + 用户级委派（2026-07 背景）；Entra Agent ID 文档 updated_at 2026-08-13；窗口内无新条目 | 本次未取得（Browser Automation 文档 2026-08-21；`.md` 孪生页 404） | 本次未取得（Learn what's-new 仍为 August 2026，`updated_at` 2026-09-09；不得写作无动态） | **服务面与可观测层为取证缺口**；`microsoft/agent-framework` 两版 release（编排工作流稳定名 + checkpoint 恢复、per-tool 暴露控制） |
| **阿里云百炼 / Model Studio / PAI** | 云栖大会 2026（09-22 开幕）设「技术主论坛·Agentic Cloud」与「技术主论坛·MaaS＆Agent」，09-22 09:30 首场为「面向智能体时代的基础设施布局」（**仅取得直播页日程摘要，正式发布清单与正文本次未取得**）；百炼应用文档「应用功能动态」页 2026 年条目仅到 2 月；托管运行时 API 上线为 2026-06-29（背景） | 本次未取得（应用功能动态页 2026 年仅 1—2 月有记录） | 本次未取得 | 本次未取得 | 本次未取得 | 本次未取得 | 云栖大会开幕与 Agentic Cloud / MaaS＆Agent 主论坛（正式发布内容本次未取得）；**注意**：流传的百炼「9月23日」应用更新条目经核属 2025 年段落，已排除 |
| **火山 / 字节（Ark / Coze / Coze Studio / Coze Loop / OpenViking）** | 平台文档级无窗口内更新（Coze「更新动态」最新为 2026-07）；**AgentKit 文档所载 DeliveryAI 有两条更新**（09-21 DeliveryAI 助手/自定义流程；09-16 沙箱用量统计、评测中心、Skill 批量上传、思考强度 low/high/max） | OpenViking（Context Database）：窗口内 `python-sdk@0.1.12`（09-18）与 `v0.4.21`（09-20），含 ACL 默认继承、MCP `search` 参数校验、Kimi Code CLI memory plugin | Skill 支持「/」命令调用内置 Skill（09-16）；企业集成支持接入 GitHub 仓库 | 本次未取得（未见 agent identity 条目） | AgentKit 沙箱用量统计（09-16）；Coze Loop 在沙箱调度器 Run 响应暴露 sandbox 域名后缀（09-23） | **评测中心**（评估器/评测集/评测任务，09-16）；Coze Loop 窗口内 5 条提交（轨迹单 CK 查询、logid 检索、root_step 修复） | AgentKit 两条更新 + Coze Loop 轨迹工程化 + OpenViking 两版；**主平台（Ark/Coze）无窗口内文档级动态** |
| **腾讯云智能体平台 / 元器 / CloudBase AI Toolkit** | ADP 产品动态文档最新条目为 2025-08，窗口内无产品动态更新；**服务公告：2026-09-18 12:05:52 发布《关于腾讯云 DeepSeek-V4-Flash 模型下线及切换升级的通知》**（仅时间戳与标题，正文未取得） | 本次未取得 | 本次未取得 | 本次未取得 | 本次未取得 | 本次未取得 | 模型生命周期公告（2026-09-18 12:05:52）；产品动态页响应不完整，已读段落止于 2025-08，**不得写作零发布** |
| **Databricks** | 本次未取得（窗口内无条目） | 本次未取得 | 本次未取得 | 本次未取得 | 本次未取得 | Mosaic AI Agent Evaluation 已 GA（背景）；窗口内无条目 | **本周无重大公开动态**（平台 release notes 最近校验 2026-09-11，窗口外；docs agent 页最近更新 2026-09-15） |

矩阵中的「本次未取得」均指已按官方文档、release notes、博客入口检索，窗口内未取得对应条目或该维度本周无新增，并非判断该能力不存在。AWS 的 9 月月级条目与「本周强信号」列保留了「窗口归属未确证」这一限定。

## 本周 TOP 5

排序依据是对 Agent Harness 基础设施格局的信号价值：是否改变能力基线、是否可被多个主题引用、是否有硬数据，而不按单条新闻热度。

1. **AWS 发布新一代 AgentCore Runtime（托管运行时代际升级）**。依据：弹性内存按实际用量计费（不再按峰值）与快照式冷启动把 P75 启动压到 1.9—2.0 秒（镜像 200 MB—2 GB），对比上一代 5.4—30 秒，并以 `platformVersion=V2` 提供原地切换、5 个区域可用；它同时把「会话内存粒度 + 启动一致性」写成可对标硬指标，挤压第三方沙箱在 AWS 原生栈内的性价比空间。来源：[新一代 Runtime 公告](https://aws.amazon.com/about-aws/whats-new/2026/09/new-agentcore-runtime-generally-available/)、[平台版本说明](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-how-it-works.html#runtime-platform-versions)；**限定：页面无显式日期，按 URL 月份与索引新鲜度（约 5 天前）判为大概率落在窗口内（≈2026-09-19），日期未逐字确证**。
2. **Anthropic 把工具注册表下沉为会话状态，并把 computer use 工具集与模型版本强绑定**。依据：`inline-tools-2026-09-15` beta 允许在对话中的 system message 定义工具（不破坏 prompt cache），配合 `mcp-client-2026-09-15` 可将定义声明为 MCP toolset 并以 `mcp_tool_listing` 固定清单；同日 Opus 5.5 上 computer use 必须用 `computer_toolset_20260801`（旧 `computer_20251124` 在 Claude API 与 Google Cloud 返回 400，Amazon Bedrock 例外）。这使工具面首次拥有版本契约，且跨云兼容性并不一致。来源：[Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview)、[computer use tool 文档](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)。
3. **工具与权限层的凭据归属分裂为三条互斥路线**。依据：Composio Instant Tools（2026-09-23，hosted account 代持，用户不连 provider 也能跑工具，开关非自助、覆盖粒度 per tool）；Nango 在 09-21 把 BYOC（实例与凭据留在客户 AWS/GCP/Azure 账号）设为主推自托管方式，并于 09-17 允许集成方自定 MCP OAuth scopes；AWS 以托管 Consent Portal 把 OAuth 流程留在服务端（浏览器不持 token，披露日 2026-09-14，窗口前）。三条路线直接决定企业选型的合规边界。来源：[Composio commits](https://github.com/ComposioHQ/composio/commits)、[Nango changelog](https://nango.dev/docs/updates/changelog)、[Consent Portal 文档](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-consent-portal.html)。
4. **可观测层同周发生「平台收编」与「标准分家」**。依据：Amazon CloudWatch Omni 正式可用（`pubDate` = 2026-09-23 00:06:00 GMT），以 OTel 互操作把 agent 遥测与基础设施、跨云遥测合并，内置评测驱动开发流并明确支持 LangGraph、CrewAI、OpenAI Agents SDK、Vercel AI SDK、Strands；同一周 GenAI 语义约定迁出主仓独立为 `semantic-conventions-genai` 并修正 usage 指标聚合（按模态、推理、缓存拆分，2026-09-22）。两者共同定义未来跨厂商 agent 遥测的可比口径。来源：[AWS What's New RSS](https://aws.amazon.com/about-aws/whats-new/recent/feed/)、[semantic-conventions-genai](https://github.com/open-telemetry/semantic-conventions-genai)。
5. **沙箱从隔离执行转为可分支、可回滚、可回放的状态容器**。依据：E2B 把创建、连接切到 `/v2/sandboxes`、默认参数收归服务端，并新增 `e2b sandbox fork`（CLI 2.20.0，2026-09-21）；Daytona 在 09-18 的研究把完整沙箱快照当作 coding agent 的 search state；agent-browser v0.38.1（published 2026-09-16T20:05:12Z，北京时间落在窗口内）修的正是录制光标时序保真。四条动作指向同一接口收敛方向。来源：[E2B changelog](https://docs.e2b.dev/changelog)、[Daytona dotfiles](https://www.daytona.io/dotfiles/snapshots-as-search-states-go-explore-with-daytona)、[agent-browser v0.38.1](https://github.com/vercel-labs/agent-browser/releases/tag/v0.38.1)。

次强信号（未入 TOP 5，但具备独立信息价值）：Mem0 DolphinBench 把记忆变成可采购指标（2026-09-22）；Firecrawl Alexandria 与 7500 万美元 B 轮提出知识结算（2026-09-22，厂商自述未独立核实）；OpenClaw 窗口内两发（v2026.9.5 / v2026.7.35）；Crawl4AI v0.9.4 一次修三条 SSRF、信任边界 advisory（2026-09-23）；Helicone PR#5816 修复平台管理员接管与跨租户 HQL 绕过（2026-09-16T19:28Z，落在窗口内）；Langfuse 窗口内至少 6 个发布。

## 对 OpenClaw 的参考

- **领先点：不中断的升级与调度所有权**。OpenClaw 用 Atomic Updates（切换前校验目标版本）、插件不重启 Gateway 即可安装、Scheduled work 的计划任务会话语义（`cron list --all --json`、计划任务会话被排除、计划报表回到原会话、结果在等待子代理后重建），以及 v2026.7.35 的 cron/session 并发回补（误判超时、session stall、取消的并行工具不再启动、gateway 关闭保持通道停止），正面回答了云厂侧本周用 SLA 讲的同一问题；这类能力目前只能以托管服务形式从云厂获得，自托管掌握 Gateway 与调度面是差异化所在。
- **补课点：控制面缺少统一的钩子事件模型**。AWS AgentCore 已在 `before_invocation`/`before_tool_call`/`after_tool_call`/`after_invocation` 四个边界提供钩子，并允许 Lambda 同步返回 allow/deny 中断调用或跳过工具调用，`InvokeHarness` 为每个触发的钩子发 `hookEvent`。OpenClaw 侧对应能力分散在沙箱 bind mount、工具策略审批与配对审批上，若要对企业说明「谁在何时批准了什么」，需要等价的事件模型与审计出口。
- **补课点：工具授权粒度与凭据托管仍以 server 为单位**。本周开源网关 `mcp-gateway-registry` 把 per-tool block 做到 UI、CLI、API 三处一致并强制所有读投影生效，并修密钥 `purpose` 绑定与 server 删除时撤销借用凭据（2026-09-21、09-22）；Nango 允许集成方自定 MCP OAuth scopes。OpenClaw 若要接企业工具生态，需要把授权下沉到单个工具，并支持不落地到 agent 侧的凭据托管。
- **可借鉴：参数语义显式化与默认权限收敛**。OpenViking v0.4.21 让 MCP `search` 在默认 `mode="list"` 下对 context-only 参数直接报错而非静默忽略，并把 ACL 默认继承设为全员管理权限且支持创建时授权（#5266）；这两条分别对应「不确定就报错」与「默认最小权限」两个可直接对标的模式。
- **可借鉴：session 级 eval 的轨迹锚点必须先定义**。LangSmith 本周把 trajectory evaluation 改为按 trace 根 run 的 start time 取最新 trace，并在跨来源评估器上直接阻止保存；Arize Phoenix 与 Coze Loop 同周修的都是「turn trace 未收尾」「评测轨迹缺 root_step」这类边界问题。若未来做 session 级评估，需先固定以哪条 run 作为轨迹锚点，否则指标不可比。
- **可迁移的安全检查项与工程纪律**。Helicone 越权修复给出两条通用教训（路径大小写归一化、不要用正则校验 SQL，改用词法级解析并显式拒绝危险构造）；Crawl4AI 的三条 advisory 提醒任何把抓取、解析组件放进 Agent 执行环境的方案都应默认走带 egress 白名单的代理；Anthropic 同日把工具集与模型版本绑死则要求自托管侧在接多家模型时维护显式的工具集版本与云差异矩阵。

本期事实的冻结窗口为 2026-09-17 00:00:00—2026-09-23 24:00:00（Asia/Shanghai），等价于 UTC 2026-09-16T16:00Z—2026-09-23T16:00Z；发布时刻跨过 UTC 边界的条目按邻期信号处理，不计入本周。证据边界上有几点需并读：表中的「本次未取得」不等于能力缺失或未发布；AWS AgentCore 的 9 月月级条目与新一代 Runtime 的日期均未逐字确证；Microsoft Foundry 服务面与可观测层属取证缺口，腾讯云 ADP 仅取到公告标题与时间戳，Google 平台 09-22 条目在源侧为空，均不作内容推断。版本号、发布时刻、API 字段、配额与区域参数、钩子边界名、公告时间戳与 GitHub release 元数据均取自官方 release notes、changelog 或 API 直查；Firecrawl 的融资与质量对比、Mem0 DolphinBench 的规模与设计、Crawl4AI 的裁剪性能均为厂商自述、未独立复核；阿里云云栖与腾讯云 ADP 仅取到日程或标题层面。GitHub stars 与 forks 为 2026-09-24 取得时快照，无跳期基线，故不计算周增速。
