---
layout: single
title: "全球 AI Agent 周报：竞争转向长时、可恢复、可授权与可采购"
date: 2026-09-07 10:44:00 +0800
categories: [AI]
header:
  overlay_image: /assets/images/posts/2026-09-07-global-ai-agent-weekly.png
  overlay_filter: 0.35
---

> **观察窗口：** 2026-08-31 00:00—2026-09-06 24:00（Asia/Shanghai）  
> **证据口径：** A=官方 release/spec/docs；B=厂商 benchmark、经营披露或项目自测；C=可靠媒体、官方社媒、合作方或近似快照；D=preprint/未双源线索。partial、strict、binary 以及不同 harness、预算和 scaffold 不混比；stars 不是用户数，ARR 不是客户 ROI。

这一周最值得关注的，不是 Agent 又多会了一项工具，而是它开始被当作一种要长期运行、能够恢复、接受授权并进入采购体系的工作单元。OpenClaw 和 Dify 把恢复、制品、上下文、升级与权限默认值推到平台层；Astra 和 Fable 把 computer use 收进通用工作台；Salesforce 则把多 Agent、席位、credits、数据安全和支持计划装进标准采购包。

这构成了全文的读者主线：**Agent 竞争正在从“会不会做”转向“能否长时、可恢复、可授权、可采购地做”。** 工程能力、产品体验和商业模式并不是三件分开的事——后台运行降低实时可见度，远程执行带来新的数据边界，credits 和 token 价格也必须与重试、人工接管和事故成本一起计算。

## 本周 TOP5

本期排序综合“工程影响力 × 采用信号 × 生态位置 × 可靠性突破 × 新颖度”，沿用预设重点：

| 排名 | 事件 | 本周核心变化 | 必须保留的边界 |
|---|---|---|---|
| 1 | OpenClaw v2026.9.1/9.2 | 恢复、协作、升级、权限进入 Agent OS 层 | stars 仅近似热度；升级后重做权限评审 |
| 2 | Dify v1.17.0 | 可发布 Skills、暂停恢复、分级压缩、企业治理 | 迁移与秘密泄露风险，不宜无评审滚动升级 |
| 3 | GPT-6 Astra | computer use 与搜索、shell、MCP、skills 合栈 | 72.6% 是厂商 partial，不与 strict 混比 |
| 4 | Claude Fable 5.1 | macOS 后台 computer use | benchmark/降本为厂商估计，隔离未完整披露 |
| 5 | Salesforce 2026 Editions | 席位、credits、安全与多 Agent 合并采购 | “价值增加”及 7-subagent 阈值为厂商口径 |

OpenClaw、Dify 排在模型发布之前，是因为二者对恢复、制品、上下文、升级和权限默认值的改动具有更广的工程外溢。Astra、Fable 的新颖度更高，但 benchmark 仍主要来自厂商披露。Salesforce 的生态位置与采购信号最强，独立 ROI 证据却最弱。

### 1. OpenClaw：恢复与协作进入系统层

OpenClaw 9.1 引入共享 Gateway 个人技能库、升级失败回滚、配置 CAS 和 per-agent worktree；9.2 又把长 transcript 处理移出 Gateway event loop，使 active、queued、delegated reply 可跨重启恢复，并加入热配置、Swarm、connected accounts 和跨 Agent session access。研究母稿据此判断，它正从助手框架转向可恢复、可协作、可升级的 Agent OS。

页面快照显示，OpenClaw 在 2026 年 9 月 7 日约有 **389k stars、81.7k forks**。这只能视为近似热度，不能当作用户数。Swarm 默认开启，session visibility 和 agent-to-agent access 也扩大，因此升级后需要重新做权限评审。来源：[v2026.9.1](https://github.com/openclaw/openclaw/releases/tag/v2026.9.1)、[v2026.9.2](https://github.com/openclaw/openclaw/releases/tag/v2026.9.2)（A/B）。

### 2. Dify：低代码画布变成运行平台

Dify v1.17.0 加入 E2B 云沙箱、Home Snapshot、workspace Skills 的 draft→publish→version、按有效窗口分级压缩、Loop/Iteration 内 Human Input 暂停恢复和 provider-neutral tracing；同时接入 Phoenix/LangSmith、Azure Key Vault/KMS、Turnstile 与 TiDB hybrid search。母稿的判断是：Dify 已从低代码画布进入“可发布制品 + 长时恢复 + 企业运行治理”的平台阶段。

其仓库约有 **154k stars、24.4k forks**，stars 同样不是部署数。数据库迁移、env 改名、compose 合并、执行上限变化以及 Snapshot 秘密泄露风险，使这一版本不适合无评审滚动升级。来源：[Dify v1.17.0](https://github.com/langgenius/dify/releases/tag/1.17.0)（A/B）。

### 3. Astra：浏览器 Agent 并入通用执行栈

OpenAI GPT-6 Astra 于 9 月 3 日进入 ChatGPT、Codex、Responses API、Azure 和 AWS Bedrock。它把 computer use、web/file search、hosted shell、code interpreter、apply patch、MCP、skills，以及跨窗口检索旧工具输出放进统一执行栈。

Astra 提供 **1.05M context**，最大 **922K 输入、128K 输出**；标准 API 每百万 token 为 **10 美元输入、50 美元输出**。厂商报告 OSWorld 2.0 为 **72.6% partial、约 40 分钟/任务**，前代为 **65.7%、约 75 分钟**；内部安全集“不期望结果”为 **2.4%**，加入 AutoReview 后为 **1.8%**。这些 benchmark 和安全集缺少本周独立复现，且 **72.6% partial 不能与 strict 成绩比较**。Enterprise 发布时默认关闭，复杂桌面任务仍不能无监督运行。

研究判断是：独立浏览器 Agent 正被吸收进通用工作模型与工作台，竞争随之转向长任务目标保持、审计、恢复和成功任务总成本。来源：[OpenAI 发布页](https://openai.com/index/gpt-6-astra/)、[API 文档](https://developers.openai.com/api/docs/models/gpt-6-astra)、[CNBC](https://www.cnbc.com/2026/09/03/open-ai-astra-gpt-6-cyber.html)（A/B/C）。

### 4. Fable：后台执行提高并行性，也提高治理要求

Anthropic 于 9 月 1 日发布 Fable/Mythos 5.1，9 月 2 日宣布 macOS Cowork/Claude Code 可以在后台点击、键入和打开应用，用户仍可在前台工作。后台执行是并行工作台的体验突破，也让动作日志、暂停、撤销、白名单和确认成为一等能力。

厂商报告 OSWorld 2.0 为 **77.9% partial、41.7% strict**，AutomationBench 为 **31.4%**；典型 token 负载估计便宜 **25%**，高 agentic 负载最多约 **45%**。partial 与 strict 只能分别陈列，不能据此与 Astra 或其他 harness 排榜；降本与 benchmark 均是厂商估计。Anthropic 还明确提示，系统仍可能绕过 approvals/auto-mode classifiers，后台隔离实现也未完整披露。来源：[Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-1)、[release notes](https://support.claude.com/en/articles/12138966-release-notes)、[官方 X](https://x.com/claudeai/status/2095226833293685100)、[9to5Mac](https://9to5mac.com/2026/09/02/anthropic-upgrades-claude-codes-computer-use-to-run-in-the-background-on-mac/)（A/B/C）。

### 5. Salesforce：Agent 进入席位与 credits

Salesforce 于 9 月 3 日推出 Core、Advanced、Max，将 Agentforce、Slack/Slackbot、Tableau Next、数据安全和 Premier Success Plan 合并采购；native multi-agent orchestration 已 GA，包含 Superagent、Connected Subagents 以及 MCP/A2A 边界。

三个档位为每用户每月 **195/395/550 美元**，Flex Credits 分别为 **50 万/100 万/275 万**。官方称 Max 的价值增加近 **60%**；内部测试称超过 **7 个 subagents** 时更常出现 intent collision 和结果劣化。两项都是厂商口径。credits 会让 TCO 随行为变化，目前也没有独立客户 ROI 或事故率证据。

母稿据此判断，Agent 正进入标准席位、credits、数据安全和采购体系；多 Agent 的关键不只是数量，而是身份、上下文交接和归因链。来源：[2026 Editions](https://www.salesforce.com/news/stories/salesforce-simplifies-editions-2026/)、[多 Agent 架构](https://www.salesforce.com/blog/3-signs-youve-outgrown-a-single-agent/)、[档位交叉确认](https://www.salesforceben.com/salesforce-announces-3-replacement-editions-bundling-ai-slack-and-security/)（A/B/C）。

## 一、产品入口变成工作台

产品主线关联 Astra、Fable、OpenClaw、Devin 和 Cursor。Astra 把 Browser、OS、shell、Office 相关能力纳入 ChatGPT、Codex 与 API；Fable 把 computer use 移到 macOS 后台；OpenClaw 汇入协作、恢复与 connected accounts。变化并不只是“工具更多”，而是入口开始承载模型、状态、权限、工具和产物。

Devin Desktop Next v3.9.1018 移除 Cascade，让 Devin Local 成为唯一的本地形态，并把 Local、Worktree、Cloud 顶层化。稳定版仍停留在 **8 月 21 日 v3.8.20**，所以这只能写成 Next 变化，不能说已在稳定版全量上线。它支持“IDE 正收敛为 Agent 运行位置与审阅控制台”这一判断。来源：[Devin Next](https://docs.devin.ai/desktop/changelog-next)、[Devin Stable](https://docs.devin.ai/desktop/changelog)。

Cursor 的企业部署则把控制面与执行面分开：云端仍保留 loop/planning，客户 worker 执行文件、终端、computer use 与 MCP。容量口径为**每用户 200、每团队 1000 workers**。这被视为控制面/执行面拆分的企业部署范式，但并非零数据出网；artifact 默认放在 Cursor S3，客户仍要负责镜像、密钥和隔离。来源：[公告](https://cursor.com/changelog/self-hosted-machines)、[文档](https://cursor.com/docs/cloud-agent/self-hosted)。

后台并行和远程执行提高可用性，却减少了实时可见度。因此，回放、暂停、差异预览、审批和数据流声明应成为产品门槛，而不是上线后的附加项。

Replit Agent 的边界又向上线后延伸：它可增加 custom events 并分析 funnel，数据库每日生成 full restore point。研究判断是 coding Agent 正延伸至上线后的增长闭环。不过访客数只是近似值，恢复也没有连续 PITR；启用功能需要重发，部分 artifact 不支持，同时要处理 PII、secret 和 event schema 风险。来源：[changelog](https://docs.replit.com/updates/2026/09/04/changelog)、[Analytics](https://docs.replit.com/features/publishing/project-analytics)。

## 二、工程核心是让任务持续且可追溯

工程主线关联 OpenClaw、Dify、ADK Go、Manus、Mem0/OpenViking、Microsoft/Google 控制面、Gemini CLI 与 context-mode。reply recovery、Snapshot/HITL resume、durable facts、context compaction、数据恢复、memory scope/provenance、模型外 gateway/identity/sandbox/audit、sandbox 负向修复以及 MCP context 隔离，都在处理同一个问题：任务如何跨故障、压缩、会话和组织边界继续运行，同时保持可追溯。

### 恢复与来源绑定进入 SDK

Google ADK Go v2.3.0 修复 HITL resume、confirmation source、A2A metadata/card source，并加入 durable facts、compaction 与 OTel。仓库约 **8.6k stars**。这说明长时恢复与来源绑定正在进入 SDK 基础层，但更新只适用于 Go，不能泛化到 Python/JS；压缩结果还需要回放验证。来源：[ADK Go v2.3.0](https://github.com/google/adk-go/releases/tag/v2.3.0)。

Manus 于 9 月 1 日恢复独立运营，部分用户需要通过备份恢复；产品已有云 sandbox、My Computer、Browser、connectors、Plan 和 Branch。母稿认为，长期上下文、凭据和任务状态的连续性正在成为护城河。现有信息仍很有限：没有恢复成功率、SLA、用户数与价格，合同主体和 RTO/RPO 未披露，独立运营也只有官方一手信息。来源：[公告](https://manus.im/blog/manus-resumes-independent-operations)、[My Computer](https://manus.im/desktop)。

### memory 成为独立安全域

Mem0 支持多 scope、actor attribution 和异步写；OpenViking 用统一的 `viking://` 与分层召回组织上下文。两者都报告了多项 memory 分数以及 token/latency 降幅，但这些是项目自测；旧 **26k** 与当前 **6.7k—6.96k token** 的单位不同，不能比较。研究判断是 memory 正成为独立数据库和安全域。来源：[Mem0](https://mem0.ai/blog/state-of-ai-agent-memory-2026)、[OpenViking](https://github.com/volcengine/OpenViking)。

### 授权与追责移到模型之外

Microsoft Agent Governance Toolkit（AGT）与 Google Agent Platform 提供模型外的 policy、identity、sandbox、audit 和 eval。AGT 处于 public preview，Google 平台本周没有明确 GA 或价格；“覆盖 OWASP”也是项目自报，preview 仍可能 breaking。母稿的结论很直接：生产授权与追责必须放在模型之外。来源：[Microsoft AGT](https://github.com/microsoft/agent-governance-toolkit)、[Google Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview)。

MCP/A2A 解决的是“怎么接”，外部控制面解决的是“谁可以用什么权限接”。policy 是否真的加载，不能只看配置文件存在，而要靠启动断言和负向测试。

Gemini CLI v0.58.0 正好给出了这类负向修复的实例：它堵住容器 socket/CLI、Mach/XPC 与共享内存逃逸面，并修复 AllowedPathChecker 未加载和 A2A 残留。仓库约 **106,837 stars**。这表明安全正在从“有 sandbox”进入“验证策略已生效”；但 sandbox 仍不能消除网络、密钥和宿主挂载风险。来源：[release](https://github.com/google-gemini/gemini-cli/releases/tag/v0.58.0)、[PR28935](https://github.com/google-gemini/gemini-cli/pull/28935)。

MCP core specification 本周没有更新。context-mode 的做法是把原始工具结果放入 sandbox，只把摘要返回上下文；作者自报可从 **315KB 降至 5.4KB（98%）**。这个数字尚未复现，hook 与规则漂移也仍是弱点。研究判断保持克制：MCP 负责互操作，不负责强制授权。来源：[MCP specification](https://modelcontextprotocol.io/specification/2026-07-28)、[context-mode](https://github.com/mksglu/context-mode)。

## 三、商业化进入席位、额度与结果

商业化主线关联 Salesforce、Sierra、Harvey、Astra、Fable、Microsoft 与 ServiceNow。Salesforce 用席位和 credits 套餐化，Sierra 自报 ARR，Harvey 进入持续监管工作流，OpenAI/Anthropic 公布 token/cache 价格，Microsoft/ServiceNow 则把 Agent 嵌入流程、权限和治理平台。市场正从购买模型访问，转向购买工作席位、行为额度和业务结果。但两个换算不能省略：**ARR 是厂商收入，不是客户 ROI；token 价格也不是成功任务总成本。** 独立可复现的净节省、错误返工、人工接管、事故与组织变更成本仍普遍缺失。

Sierra 在 8 月 31 日任命 CFO，并自报企业覆盖；其披露为 **7 个季度达到 1 亿美元、9 个季度达到 2 亿美元 ARR**。这为长程 revenue Agent 提供了强商业信号，但数据来自公司和创始人同源披露，未经审计，也没有客户名单、净留存或客户 ROI。来源：[Sierra](https://sierra.ai/blog/julia-brau-donnelly-joins-sierra)。

Harvey Horizon Scanning 处于 EA，接入 Fable 5.1 与 DeepL，覆盖 **12,000+ 来源、100+ 司法辖区**；采用与翻译量由合作方报告。它支持“法律 Agent 从一次分析走向持续监测—判断—行动”的判断。与此同时，数据全部在美国处理，没有 regional processing，数字是厂商/合作方口径，政策建议仍须律师审批。来源：[Horizon Scanning](https://www.harvey.ai/blog/horizon-scanning-in-harvey)、[Fable 5.1 in Harvey](https://www.harvey.ai/blog/fable-5-1-in-harvey)。

Microsoft 用应用保存规则、workflow 确定性迁移、Agent 推理和高风险人审组合混合流程。NFL 是案例，但未披露成本、事故率或 ROI，许可与部署复杂度还分散在多个产品中。研究判断是：路线在走向治理平台化，而不是最大自治。来源：[Microsoft](https://www.microsoft.com/en-us/microsoft-365/blog/2026/09/03/ppcc-2026-bringing-ai-and-your-business-processes-together/)。

Experian/ServiceNow 采用 gateway、IAM、日志、adversarial compliance test 和 deterministic+HITL 运行，没有量化 ROI。本周材料是工程深访，正式合作本身是旧闻，架构也主要来自自述。因此这里只能得出有限判断：受监管 Agent 的采用依赖模型外控制与测试晋级。来源：[深访](https://siliconangle.com/2026/09/04/experian-expands-into-ai-agents-with-servicenow-partnership/)。

## 四、开源生态雷达

### 高频推进

除 OpenClaw、Dify 与 ADK Go 外，CrewAI、browser-use、AutoGPT beta 和 Hermes 都在推进，但它们的变化更多集中在可靠性、权限与运行形态，而非单一能力展示。

- **CrewAI 1.15.19/20** 增加 client 与遥测，修复 provider、memory、structured output，让 hook deny 在全路径传播，并升级安全依赖；约 **58k stars**。研究判断是企业 guardrail 与运行可靠性增强。遥测需要合规评审，紧随补丁也提示回归风险。来源：[1.15.19](https://github.com/crewAIInc/crewAI/releases/tag/1.15.19)、[1.15.20](https://github.com/crewAIInc/crewAI/releases/tag/1.15.20)。
- **browser-use 0.13.9/10** 修复浏览器、WebSocket、标签、文件、Cloud API、MCP 错误语义与供应链问题；约 **112k stars**。它显示浏览器工程正转向可复现发布与真实失败语义，但 exact pin 可能与宿主依赖冲突。来源：[0.13.9](https://github.com/browser-use/browser-use/releases/tag/0.13.9)、[0.13.10](https://github.com/browser-use/browser-use/releases/tag/0.13.10)。
- **AutoGPT beta v0.7.4** 增加 expert 隔离、activity、连接/套餐边界和 library agent 安装；约 **186k stars**。平台身份与连接权限更可见，但版本仍是 beta，计费耦合，自装 Agent 也扩大供应链面。来源：[v0.7.4](https://github.com/Significant-Gravitas/AutoGPT/releases/tag/autogpt-platform-beta-v0.7.4)。
- **Hermes v0.21.0** 增加群聊/peer、durable cron/notepad、可纠偏委派和 MCP 控制台；默认 **250 iterations/10 并发**，约 **238k stars**。多 Agent 由隐形管线变成可见协作，但“大变更量”是项目口径，并发、记忆和 MCP 会放大权限与成本。来源：[v0.21.0](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31)。

### CLI 与宿主可靠性

- **OpenCode v1.18.29** 修复 GPT/Codex OAuth 模型过滤、Astra 可见性和 quota reset；约 **205,289 stars**。provider 能力协商不能依赖版本字符串。stars 是近似值，更新下载还可能被轮询放大。来源：[v1.18.29](https://github.com/anomalyco/opencode/releases/tag/v1.18.29)。
- **Cline Desktop v0.0.23** 用 shared Hub 托管 Skills/MCP 生命周期，并忽略 workspace 插件目录；约 **67,587 stars**。跨客户端插件控制面正在成形，但集中化也扩大插件供应链风险。来源：[v0.0.23](https://github.com/cline/cline/releases/tag/desktop-v0.0.23)。
- **Claude Code v2.1.263** 只说明 bug fixes/reliability，并提供 **12 个签名/校验资产**；约 **144,275 stars**。交付可靠性有信号，但透明度不足，不能据模糊说明推断未写明的新功能。来源：[v2.1.263](https://github.com/anthropics/claude-code/releases/tag/v2.1.263)。
- **Codex CLI 0.153.4** 把 Astra 设为 bundled default，并按异步工具是否存在启用 guidance；约 **121,979 stars**。模型、工具和订阅权限需要运行时握手；默认模型变化会影响质量、延迟和成本。来源：[release](https://github.com/openai/codex/releases/tag/rust-v0.153.4)、[PR42874](https://github.com/openai/codex/pull/42874)。

### 静默与生命周期风险

LangGraph、LlamaIndex、OpenAI Agents SDK 和 OpenHands 本周静默；AutoGen 处于 maintenance；MetaGPT、SuperAGI、Aider、Roo Code 长期或阶段性没有正式版。已知最新正式版时间分别包括：AutoGen **2025-09**、MetaGPT **2025-03**、SuperAGI **2024-01**、Aider **2025-08**、Roo **2026-05**。

单周静默不等于停止开发，但 maintenance 或长期停版风险更高。生命周期状态必须进入采购评分，维护状态与依赖适配权重不能被累计 stars 覆盖。来源：[AutoGen](https://github.com/microsoft/autogen)、[MetaGPT](https://github.com/FoundationAgents/MetaGPT/releases)、[SuperAGI](https://github.com/TransformerOptimus/SuperAGI/releases)、[Aider](https://api.github.com/repos/Aider-AI/aider/releases?per_page=5)、[Roo Code](https://api.github.com/repos/RooCodeInc/Roo-Code/releases?per_page=5)。

## 五、Agent 产品雷达

强动态对象包括 Astra、Fable 后台执行、Manus、Cursor、Replit 和 Devin Next，前文已分别展开。另有一条只宜保留为研究线索：Qwen 官方 X 索引出现 CommerceAgentBench，Qwen-Agent 框架支持 Browser、Code、RAG、MCP，但没有论文/仓库正文与第二来源，因此不采用具体分数，“最强”也未验证；框架本周没有版本。商业任务评测值得继续跟踪。来源：[Qwen 官方 X](https://x.com/Alibaba_Qwen)、[Qwen-Agent](https://github.com/QwenLM/Qwen-Agent)。

Comet、Genspark、Kimi、AutoGLM 本周静默；没有本周价格、客户或任务成功率。Project Mariner 已于 **2026 年 5 月**关闭独立入口，后续只放入 Gemini Agent/Chrome auto-browse 迁移雷达。固定观察对象需要保留静默与终止状态，不能用旧能力拼成本周动态。由于 Comet、Genspark 返回 403，仍不能完全排除未索引小版本。来源：[Comet](https://www.perplexity.ai/comet)、[Genspark](https://www.genspark.ai/)、[Kimi](https://www.kimi.com/)、[AutoGLM](https://github.com/zai-org/Open-AutoGLM)、[Mariner](https://labs.google.com/mariner/landing)。

## 六、企业、协议、评测与安全雷达

### 企业：动态之外也要保留静默

企业侧的主要动态包括 Salesforce 套餐与多 Agent、Microsoft 混合流程、Harvey 持续法律扫描、Sierra ARR 自报，以及 ServiceNow/Experian 的受监管工程。Glean 和 Coze 本周静默。Glean 的 **81% token 降幅、78% preference** 来自 8 月 26 日旧闻与厂商自测，不能重新包装成本周动态；其旧 benchmark 没有独立复现，Glean/Coze 的 changelog 索引也较弱。企业雷达不能用窗口外营销填补空白。来源：[Glean 旧闻](https://www.glean.com/press/glean-takes-on-enterprise-ais-biggest-bottlenecks-context-gaps-rising-costs-and-ai-sprawl)、[Coze](https://www.coze.cn/)。

### 协议与工程：连接不等于授权

MCP core 本周静默，但生态继续扩张；memory/context、模型外控制面和 context-mode 分别处理状态、授权和上下文隔离。它们共同指向同一个边界：互操作协议能定义如何接入，却不自动提供强制授权、身份隔离或不可抵赖审计。

### 评测：成绩必须带配置

OSWorld 2.0 包含 **108 workflows、31 个环境、平均 300+ steps、27 checkpoints**。原论文最强结果为 **binary 20.6%、partial 54.8%**；本周作者谈话中的新数字仍待配置复核。研究判断是，评测开始覆盖小时级动态状态与安全副作用，但版本、harness、binary 与 partial 不能混比。来源：[精读](https://snorkel.ai/blog/osworld-2-0-why-computer-use-agents-fail-most-tasks/)、[代码](https://github.com/xlang-ai/OSWorld-V2)。

SWE-bench Multimodal v2 从 **517** 个候选筛为 **480** 个可复现视觉任务，并重建 grading；普通本地评测建议约 **120GB/16GB/8CPU**。它为 UI coding/computer use 提供了更接近真实的基础评测，但单个分数不代表权限、安全或采用情况，mini-SWE-agent 1.x 与 2.x 也不必然可比。来源：[Multimodal](https://swebench.com/multimodal)、[仓库](https://github.com/SWE-bench/SWE-bench)。

SWE-bench 普通榜、WebArena、GAIA、τ-bench 本周没有可审计的正式更新，因此不采用第三方“96%”或 τ→τ³ 摘要。高分必须同时携带 scaffold、budget、pass@k、污染与版本信息，不能跨 benchmark 代际或运行配置比较。来源：[SWE-bench](https://www.swebench.com/)、[WebArena](https://webarena.dev/)、[GAIA](https://huggingface.co/gaia-benchmark)、[τ-bench](https://github.com/sierra-research/tau-bench)。

### 安全：从单次注入到累计风险

本周安全研究覆盖多 Agent、memory poisoning、hooks、累计不可逆预算和 collusion。报告中的实验数字包括 CAPTURE adaptive **24.7%**、HookPry **1,000 runs 全 compromise**、风险预算最多超 **48 倍**等。它们支持的判断是：威胁范围正从单次注入扩到 hooks、memory、跨 principal 与 fleet 累计风险。

这些研究多数是 preprint、under review、workshop 或窄实验，实验攻击率不能外推为生产发生率，只能用于威胁建模。来源：[SoK](https://arxiv.org/abs/2609.00595)、[CAPTURE](https://arxiv.org/abs/2609.02265)、[HookPry](https://arxiv.org/abs/2609.03884)、[Budget](https://arxiv.org/abs/2609.00275)、[Monitoring](https://arxiv.org/abs/2609.03035)。

## 七、采购与工程检查表

把本周变化落到采购和工程决策，可以形成七项检查。

1. **能力协商。** 模型、工具、宿主和订阅权限做运行时握手，拒绝版本正则和隐式工具假设。
2. **长时任务。** 验证 checkpoint、跨重启恢复、幂等、部分结果保存、上下文来源和失败后的状态损坏率。
3. **sandbox。** 要求“注册断言 + 负向测试 + 逃逸面清单”，覆盖 socket、daemon CLI、IPC、共享内存、symlink、网络和宿主挂载。
4. **外部控制面。** 每个 Agent 使用独立 identity、短时 scoped credentials、参数级 policy、不可绕过 HITL 和 tamper-evident audit；记录 delegating human、policy version、verdict、tool result 和 memory write。
5. **不可逆动作。** 按主体做跨时间累计预算，而不是只逐动作确认；发送、删除、支付前显示对象、身份、金额/内容和差异。
6. **benchmark。** 固定模型快照、Agent/scaffold、容器、成本、rollout/retry、轨迹和安全干预；同时报告 strict/binary、partial、HITL、恢复、状态损坏与成本。
7. **商业采购。** 将 seat、credits、token/cache、工具调用、截图、重试、人工和事故成本合成“成功任务总成本”；要求客户级净收益，而不是 ARR 或厂商“价值增加”。

## 八、证据边界与未决问题

本期研究共记录**候选观察点 54、固定/实质对象主题覆盖 52、有料 30、静默 21、背景 1**。C 组 12 个候选观察点并入 10 个固定对象，因此两种合计不同。正文精读约 **119 篇/页**，采用来源 **96**；这个 96 是四组口径相加，跨组未全局去重。A/B/C/D 分别精读约 **35/42/16/26**，采用来源 **7/60/20/9**。

研究过程对 [OpenClaw v2026.9.2](https://github.com/openclaw/openclaw/releases/tag/v2026.9.2)、[Dify v1.17.0](https://github.com/langgenius/dify/releases/tag/1.17.0)、[Gemini CLI v0.58.0](https://github.com/google-gemini/gemini-cli/releases/tag/v0.58.0)、[GPT-6 Astra](https://openai.com/index/gpt-6-astra/) 和 [Salesforce 2026 Editions](https://www.salesforce.com/news/stories/salesforce-simplifies-editions-2026/) 做了五项 URL 抽检，均返回 HTTP 200，关键版本与数据吻合。

仍有六类缺口没有关闭：

1. OpenAI/Anthropic、Mem0/OpenViking、Salesforce、Sierra 等关键数字缺少独立复现或审计。
2. 企业客户级 ROI、人工接管率、失败恢复成本、生产 SLA 和提示注入成功率普遍缺失。
3. Qwen CommerceAgentBench 缺论文/仓库正文与第二来源，因此不报分数。
4. Comet/Genspark 遭遇 403，Coze/Glean 索引弱，不能完全排除未索引小版本。
5. GitHub 匿名 API 限流使部分 stars/forks 只能作为近似；Aider/Roo 当期计数未引用。
6. 安全论文多为 preprint，实验数字只用于威胁建模，不能直接改写成现实事故概率。

本周的采购含义因此不是“选一个最高分的 Agent”。更可靠的落点是：先确认任务能否跨故障恢复、状态与来源能否追溯、权限能否在模型外强制执行，再把席位、额度、重试、人工与事故成本放进同一套成功任务总成本中。这个收束没有越过研究边界，也仍然保留了最重要的不确定性：现阶段，客户级 ROI 与生产事故数据远没有产品和厂商 benchmark 那样充分。
