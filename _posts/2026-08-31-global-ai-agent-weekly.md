---
layout: single
title: "全球 AI Agent 研究周报（2026-08-24 ~ 2026-08-30）"
date: 2026-08-31 10:00:00 +0800
categories: [AI]
header:
  overlay_image: /assets/images/posts/2026-08-31-global-ai-agent-weekly.png
  overlay_filter: 0.35
---

# 全球 AI Agent 研究周报 · 2026-08-24—08-30

> 核验日：2026-08-31；所有日期按 Asia/Shanghai 统计。

![全球 AI Agent 研究周报头图](/assets/images/posts/2026-08-31-global-ai-agent-weekly.png)

本周没有新的经典 Agent 榜单冠军。SWE-bench、WebArena、GAIA 与 τ-bench 都没有官方可靠性数字突破。行业真正向前走的地方，是更接近生产的五个变量：**独立身份、隔离执行、状态恢复、可归因证据和业务计费单元**。

这五个变量指向同一变化：Agent 正从“用户问一句、系统答一次”的对话功能，变成可由事件触发、跨会话运行、跨团队协作的长期数字主体。模型仍负责规划，但 filesystem、network、credential、budget、approval、resume 与 audit 越来越多地交给确定性运行时强制执行。

## 本周五个关键事件

### 本地执行与最小上云

Perplexity Portable Computer 把 orchestrator、subagents、agent harness、模型、工具、connectors 与 isolated OS sandbox 放到本地。sandbox 不可用时，工具执行直接关闭；本地能力不足时，系统先选择相关上下文、运行 PII classifier，再把将要离开设备的内容展示给用户逐步批准。云 adviser 只返回文本建议，不能接触本地工具、文件或完整会话。

产品首发支持本地模型、文件、shell、web 与 connectors。厂商自评中，两种本地模型在 Local Knowledge Work Bench 的得分分别为 **82.6%** 和 **85.4%**；Terminal Bench 2.1 从纯本地 **59.6%** 提升到混合模式 **73.0%**，约 **0.415 美元/rollout**。这些数字尚待独立复现。首发系统是 Linux，硬件至少需要 **24GB VRAM**；PII 漏检与确认疲劳仍是这条路线的边界。[官方研究](https://www.perplexity.ai/hub/blog/a-local-first-agent-for-private-and-cost-effective-knowledge-work)

### 独立 Agent 的企业身份

Glean 为 independent agent 配置独立 profile、scoped service credentials、permissions、audit trail 与 memory；Enterprise Context 由 Knowledge Graph、Personal Graph 和持久记忆组成，AI Gateway 则统一 **40+ 模型**、tools/MCP 与安全策略，并支持按组织、部门、用户和 Agent 限额。

Glean 称 **78%** 客户采用其 MCP/API；在 180+ 个自建任务中，平均查询成本为 **0.58 美元**，对照为 **2.98 美元**。这是厂商自测，任务集与第三方复现没有公开，independent agents 等多项能力也仍处于 Beta。它仍是本周最完整的企业 Agent 身份控制面样本之一。[官方发布](https://www.glean.com/blog/proactive-ai-for-enterprises)

### 低代码平台补齐生产栈

Dify **v1.17.0** 同时加入 E2B、本地/云 sandbox 切换、构建时 Home Snapshot、工作区 Skills 版本生命周期、分层上下文压缩、Loop/Iteration 内 HITL、统一 tracing、Turnstile 与 KMS，并补强所有权 scope、认证和 SSRF 边界。

这次更新把 Dify 从低代码画布进一步推向 Agent 资产、隔离执行和治理一体化平台。代价也很明确：E2B 的数据驻留和成本、Snapshot 中的密钥与陈旧依赖、压缩的信息损失，都要进入生产治理。[Release](https://github.com/langgenius/dify/releases/tag/1.17.0)

### 编码运行时收紧权限

Claude Code 在 v2.1.245—v2.1.251 间连续更新。v2.1.248 的 restricted mode 限制命令/代码执行与 WebFetch，把文件工具约束在工作目录并拒绝 bypassPermissions；v2.1.251 增加模型切换 hooks、Remote Control 的前台 subagent 工具流、prompt-cache 成本和 spend limit。

同一批更新还修复 symlink TOCTOU、插件路径穿越、Workflow 检查前越界读取、Grep/Glob symlink deny-read、MCP handshake、多 Agent 消息与沙箱输出替换等问题。GitHub API 核验快照为 **143,478 stars / 22,948 forks**；共享出口后续复核触发 rate limit，因此这里只把它视为 2026-08-31 快照。[v2.1.248](https://github.com/anthropics/claude-code/releases/tag/v2.1.248) [v2.1.251](https://github.com/anthropics/claude-code/releases/tag/v2.1.251)

### 评测从 verdict 走向 diagnosis

MalPR-Bench 包含 **89 个恶意 PR、50 个良性对照、44 个仓库和 8 个语言家族**。它不只问系统有没有阻止恶意 PR，而是要求 verdict、target identification 与 evidence 同时正确，才算 attributable block。

在 31 个 held-out 恶意 PR 上，PRGuard/DeepSeek 与 CodeRabbit 的 blocking totals 接近，但目标漏洞识别相差 **1.38 倍**；absence-type 相差 **3 倍**。在 12 个生产漏洞上，两者都阻止 10/12，但可归因阻止是 **10/12 对 4/12**，即 **2.5 倍**。样本仍较小，grader 也包含 LLM 与人工联合裁决，尚无同周独立复现；但它已经说明，相同拦截数可以掩盖显著不同的诊断质量。[论文](https://arxiv.org/html/2608.25730v1)

## Agent 开始拥有长期身份

TOP5 之外，企业产品也在把 Agent 从会话功能改造成持续运行的数字主体。这里的共同点不是模型更大，而是事件入口、身份、凭证、角色、审批和业务记录开始连成一条控制链。

OpenAI 让 Scheduled tasks 支持受支持 app 的 webhook 触发与分享；接收成员使用自己的 app 权限创建独立副本。Admin plugin 则把成员与组、访问权限、额度和支出审批映射为 permission-aware 工具。OpenAI 内部 IT 案例称，这类 Agent 约解决 **45%** 工单量；这是厂商内部案例，不能当成通用完成率。[Admin plugin](https://openai.com/index/introducing-admin-plugin/)

Anthropic 同周把 Cowork/Claude Code session endpoints 推出 Beta，并让 Compliance API 覆盖更多 Agent transcript；personal keys 与 service-account keys 绑定主体身份，可限定 workspace，主体离职后失效。computer/browser use 的 GA 是 8 月 19 日背景，不属于本周新增。[Release notes](https://platform.claude.com/docs/en/release-notes/overview)

云开发 Agent 也在扩大任务边界。Cursor Cloud Agents 现在可在没有外部 SCM 的情况下从零开始，自动建立 Origin repo、提供浏览器 preview，并可接入 Vercel。它把入口从“修改现有 repo”改成 idea→repo→preview→deploy，同时也把代码托管、运行时、预览和发布进一步绑在同一控制面上。[官方更新](https://cursor.com/changelog/start-from-scratch)

Replit 把 Auto 模型/effort 路由设为 Enterprise 默认，管理员可限制 allowed model；Growth Skills 与企业自带 OAuth client 又把工具面扩展到 CRM、支付和分析。自动路由降低选择成本，但复现性、成本归因与 OAuth scope 仍是风险。[Changelog](https://docs.replit.com/updates/2026/08/28/changelog.md)

## 企业系统把角色与计费接上 Agent

ServiceNow 的首个 L1 Service Desk AI Specialist 已 GA。它按明确角色处理 L1 Service Desk 任务；Autopilot 可以直接解决并关闭，Copilot 则由人工 fulfiller 审核。每个被分配且尝试处理的 incident 消耗 **15 assists**，官方建议激活前至少测试 **5—10** 个不同事件和边界。[官方说明](https://www.servicenow.com/community/servicenow-otto-articles/introducing-the-autonomous-workforce-ai-specialists-as-your-new/ta-p/3591289)

Salesforce in Claude 的首个插件包含 **37 skills**，已向 selected pilot customers 开放，计划 9 月进入 open beta。Headless 360 通过 MCP 暴露数据、workflow、Agent 和治理，动作沿用 Salesforce permissions/business rules，写侧可以要求确认。继承人的权限能快速上线，也会复制过宽授权。[Claudeforce](https://www.salesforce.com/claudeforce/)

Microsoft 则提出分层 Agent 架构：M365 Copilot/声明式 Agent 作为前门，Cowork 承担长任务，Copilot Studio 承担受治理的低代码流程，Fabric 做只读分析，Foundry 提供定制 runtime，Scout/Autopilots 负责持续协调。新的 Copilot Studio harness 统一 identity、instructions、knowledge、tools/skills、model、connected agents、memory 与 Evaluate/Monitor；标准 harness 和新 harness 创建后不可迁移，形成实际锁定风险。[架构说明](https://www.microsoft.com/insidetrack/blog/start-light-scale-intentionally-choosing-the-right-microsoft-agent-architecture/)

商业计费也开始离开纯 token 口径。Sierra 在 8 月 25 日宣布开设首尔办公室，并称覆盖全球领先银行的 **三分之一**和 Fortune 50 的 **40%**。官方案例包括 Singtel **10 周**上线、解决率 **70%+**，Next **6 周**上线并覆盖 **83 国/48 种语言**，以及 BBVA **30 天**上线长时 Horizon Agent。Sierra坚持结果计费，但结果单价、失败、人工兜底和多方贡献的归因规则没有公开。[官方发布](https://sierra.ai/blog/sierra-launches-in-korea)

Harvey 同日披露两项千人级全所部署：Jackson Lewis 覆盖 **1,100+ 律师**，Nelson Mullins 覆盖 **1,300+ 律师、顾问和法律专业人员**。两者都依赖 Legal Engineering/Innovation 团队共建专业流程，说明垂直壁垒来自机构知识和实施服务；活跃率、ROI、返工与合同金额仍未公开。[Jackson Lewis](https://www.harvey.ai/blog/jackson-lewis-deploys-harvey-firmwide) [Nelson Mullins](https://www.harvey.ai/blog/nelson-mullins-deploys-harvey-across-all-practices)

结果、工作单元和模型成本正在形成三种价格语言。要让它们可比较，企业还需要 attribution graph，把模型、Agent、人工、重试和失败拆开，而不是把一次“完成”全部归给单一系统。

Manus 的数据恢复事件补上了另一项采购要求。受监管拆分影响的部分用户在 8 月 25 日获得恢复入口，但官方没有公开开放备份格式、完整 tool trajectory、恢复成功率、丢失率和受影响人数。这些缺口意味着，这次恢复事件还不足以证明可迁移性与恢复质量。[官方说明](https://manus.im/blog/a-note-to-our-users)

## 运行时接管边界与恢复

编码 Agent 的更新显示，权限问题已经从“能不能执行”深入到路径、状态、时间和跨进程语义。

OpenAI Codex CLI 在 0.150.0—0.151.0 增加 task 互联、Interrupt/MCP hooks、权限模式与 MCP tool result 在进入模型前的检查或替换；同时修复不可信项目注入 `AGENTS.md`、`/cd` 弱化沙箱、stale Guardian classification、remote executor path、permission profile 恢复与 nested subagent token 预算。MCP 结果拦截可用于脱敏和策略，但也让结果进入模型前多出一个需要治理的扩展点。[Changelog](https://developers.openai.com/codex/changelog) [0.151.0](https://github.com/openai/codex/releases/tag/rust-v0.151.0)

Gemini CLI v0.57.0 与 v0.58 preview 改善 IDE/A2A handoff、Seatbelt 对 Docker sockets/binaries 的隔离、symlink ignore 与 write policy；nightly 修复 MCP OAuth metadata SSRF，并让 workspace trust fail-closed。preview 并不等于 stable，安全修复是否下沉仍需跟踪。[v0.57.0](https://github.com/google-gemini/gemini-cli/releases/tag/v0.57.0)

OpenCode v1.18.22—1.18.25 加入 Azure CLI/Entra ID 登录，并修 Cloudflare AI Gateway、Bedrock reasoning/cache 与 OpenAI-compatible 参数。GitHub API 快照为 **202,612 stars / 26,354 forks**。多云中立性给用户更多控制，也增加 provider、config 与 model slug 的兼容矩阵。[Releases](https://github.com/anomalyco/opencode/releases)

Cline 提供了本周最具体的可观测性事故：全量 transcript 被反复嵌入状态事件，导致一台 **16GB** 机器上出现 **25GB** 进程。SDK v0.0.81 改为 state-only event，messages 按需获取；v0.0.79 又把 event log 限制为 **64MiB**，并执行 prune/vacuum。可观测性不能靠复制全部上下文实现，正确方向是引用化事件、有界存储和按需展开。[v0.0.81](https://github.com/cline/cline/releases/tag/sdk/sdk/v0.0.81) [v0.0.79](https://github.com/cline/cline/releases/tag/sdk/sdk/v0.0.79)

### 恢复状态机成为框架能力

OpenClaw 在 8 月 28 日发布 `v2026.9.1-beta.1`：长任务可跨多次 Gateway 重启保留 checkpoint 并最终交付，同时修复 worker admission、dead-worker 终态和配置代际问题。release 列出 **1,520 unique PR**，其中只有 **2 个**属于当前比较区间，另外 **1,518 个**是 retained seed-only，不能算成本周增量；正式 v2026.8.1 在 8 月 31 日发布，已经越窗。跨重启恢复是生产分水岭，但 Beta 当前只适合隔离验证。[Release](https://github.com/openclaw/openclaw/releases/tag/v2026.9.1-beta.1)

OpenAI Agents SDK 本周没有正式 release，但主干连续修补 approved tools/handoff 的恢复、流式 tool call 合并与 PyPI 发布链。主干不等于稳定包，复杂恢复路径仍要用故障注入验证外部副作用“至多一次”。[窗口提交](https://github.com/openai/openai-agents-python/commits/main?since=2026-08-24&until=2026-08-30)

LangChain 的 `langchain.mcp` Alpha 把 MCP server 直接变为 `create_agent` 工具，并把 elicitation 映射为 LangGraph `interrupt()`，再通过 checkpointer 恢复。第一方、可中断的 MCP 接口价值很高，但 Alpha、协议代际与缓存语义决定了它还不适合作为生产基线。[Release](https://github.com/langchain-ai/langchain/releases/tag/langchain%3D%3D1.4.0a2)

CrewAI 1.15.18 把 conversational flows 提升为 stable，增加 router response format、自有 state shape，并修复 resume、工具结果与遥测语义。这次更新同时修复 resume、工具结果与遥测语义。[Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.18)

### 资源模型与默认权限收紧

browser-use Cloud API v4 把一次回合、多轮、持久文件和浏览器分别抽象为 run、session、workspace 与 browser，并支持 queue、interrupt 和 CDP。关闭 CDP 客户端不会自动停止计费，下载 URL 只有 60 秒有效，说明资源契约清晰以后，生命周期与计费治理反而更重要。[API v4](https://docs.browser-use.com/cloud/api-v4)

OpenHands v1.16.0 加入 Linux desktop、Automation run phase、LLM switching 与 Canvas Extensions，并把 skills 从默认全开改成显式 allow-list；自托管 Canvas 可以关闭 telemetry。分发和扩展面在扩大，默认权限同时趋紧。[Release](https://github.com/OpenHands/OpenHands/releases/tag/v1.16.0)

Google ADK v2.8.0 增加 A2A 认证、Model Armor、Data Agent、Live VIDEO、MCP OpenTelemetry、自定义评测与调用上限；v1.39.1 回补 Host/origin/path、stdio opt-in、容器隔离、凭据日志和 unpickle allow-list。能力扩张与安全回补在同一周并行推进。[v2.8.0](https://github.com/google/adk-python/releases/tag/v2.8.0)

AutoGPT beta v0.7.3 加入 expert team、Needs-You 与 tool-chain UX；本地默认 **9B Q4** 模型，context 提高到 **262,144**。release body 的日期与 GitHub tag/feed 冲突，本文按 GitHub 时间并保留争议。长 context 会提高资源与延迟成本，Beta 的遥测边界仍需审查。[Release](https://github.com/Significant-Gravitas/AutoGPT/releases/tag/autogpt-platform-beta-v0.7.3)

Hermes Agent v0.20.6 汇总约 **525 个 merged PR、1,313 commits、1,557 files**，加入真实 Chromium profile、SSH fleet、**50+ MCP**、OS keychain 与压缩。它正在从个人 Agent 走向 OS 化，但一个名为 patch 的版本同时扩张浏览器、SSH、MCP、keychain 与 cron 权限，完整说明还要等 v0.21.0；升级风险很高，宜隔离试升。[Release](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.27)

## 高权限 Agent 的安全红线

Instinct 把风险讲得最直接。它的 Terms 明确：即使断开 connector，公司仍可使用已经索引的数据，除非用户另行请求删除；服务还可以代表用户购买、共享支付信息，并进入对用户有约束力的协议。与此同时，用户报告涉及断连后的邮件摘要、OTP 读取、邮件 prompt injection 和未经确认发信。[Terms](https://instinct.co/terms) [TechCrunch 报道](https://techcrunch.com/2026/08/24/instincts-powerful-ai-assistant-is-raising-privacy-and-security-concerns/)

完成率越高，高权限误操作的代价越大。高权限 Agent 的核心安全 KPI 不应只是平均完成率，而应包含未经授权动作率。登录、OTP、支付、发信、删除和签约至少需要硬性 step-up confirmation、对象/金额/条款摘要、限额与撤销窗口。

GLM-5.3-Flash 展示了另一种能力扩张。该模型于 8 月 26 日发布，采用 **320B 总参数、18B 激活参数和 1M context**，MIT weights；原生视觉把 interface、rendering 与 interaction feedback 接入 code-browser-GUI 闭环。官方自评 Terminal Bench 2.1 为 **84.3**、DeepSWE 为 **63.4**、AutomationBench 为 **48.8**，均未独立复现。限时价格为 input **0.075 美元/MTok**、output **0.25 美元/MTok**。视觉反馈能改善自检，但不自动提供 scope、sandbox、HITL 或支付确认；这些 runtime 边界仍未说明。[Release notes](https://docs.z.ai/release-notes/new-released)

## MCP、记忆与治理层正在补课

MCP 在 8 月 29 日成立 Enterprise Interest Group，**13 名**参与者来自银行、零售、集成、身份和医疗等组织；Registry 同周进入 Cargo 生产支持。企业工作组成立并不等于标准已经解决：delegation token、on-behalf-of chain、credential rotation、audit schema、server signing 与数据驻留仍是缺口。企业工作组的成立说明这些缺口已经进入正式议程，但尚未形成标准。[Enterprise IG commit](https://github.com/modelcontextprotocol/modelcontextprotocol/commit/ca4ab3027f7c844cd3039c956438d72e8253f7f5)

LinkedIn 招聘 Agent 公开了 conversation、episodic、semantic、procedural 四层记忆。近实时 ingestion/retrieval 与离线 consolidation 处理去重、陈旧、冲突与来源，episodic memory 保留 provenance；系统没有公开规模、准确率、延迟、TTL 和删除。现有公开信息还不足以判断这套记忆在规模、准确率、TTL 和删除上的生产表现。[访谈](https://stackoverflow.blog/2026/08/25/inside-linkedin-s-cognitive-memory-agent/)

一份 Agent sandbox 指南把这套治理翻译成运行约束：短生命周期 sandbox、default-deny egress、集中 tool registry、确定性 tool-flow mediator、多租户隔离与 AIBOM。普通 Docker 共享内核，不应被视为强边界。更重要的是，audit log 只是 enforcement 已经发生的证据，不是 enforcement 本身。[指南](https://predictionguard.com/blog/ai-agent-sandbox-best-practices)

Agentic Security 的论文沿用同一分工：系统由随机 LLM policies 与 deterministic mediator 组成，模型负责规划，mediator 在执行前强制 scope、budget、severity 和 audit，原始证据写入 artifact store，短生命周期 phase agents 减少长会话中的证据丢失。它仍是 systematization 加单平台实践，部分机制处于 planned 状态。[论文](https://arxiv.org/html/2608.21423v1)

## 完整对象雷达

有些对象本周没有发布，却仍需要被显式核验；静默不是负面评价，也不能用旧新闻或无时间戳榜单补位。

### 编码与开源项目

- **Devin/Windsurf：** 最新 stable v3.8.20 为 8 月 21 日，早于窗口。[Changelog](https://docs.devin.ai/desktop/changelog)
- **Aider：** 最新 release v0.86.0 为 2025 年 8 月 9 日。[Releases](https://github.com/Aider-AI/aider/releases)
- **Roo Code：** 最新 release v3.54.0 为 2026 年 5 月 15 日。[Releases](https://github.com/RooCodeInc/Roo-Code/releases)
- **GitHub Copilot/SWE-bench 编码观察：** 窗口内无可核验显著新增，当前 leaderboard 不能证明具体上榜日期。[Copilot changelog](https://github.blog/changelog/label/copilot/) [SWE-bench](https://www.swebench.com/)
- **候选扫描：** 固定对象已覆盖窗口内主要 release、IDE 与云端动态，没有用社区传闻或无时间戳排名补造候选。
- **Microsoft AutoGen：** 窗口内无 release。[Releases](https://github.com/microsoft/autogen/releases)
- **LlamaIndex Agents：** 最新 v0.14.24 为 8 月 19 日，早于窗口。[Releases](https://github.com/run-llama/llama_index/releases)
- **OpenAI Swarm：** 无窗口内 release/main 提交。[Atom](https://github.com/openai/swarm/commits/main.atom)
- **MetaGPT：** 无窗口内 release/main 提交。[Atom](https://github.com/FoundationAgents/MetaGPT/commits/main.atom)
- **SuperAGI：** 无窗口内 release/main 提交。[Atom](https://github.com/TransformerOptimus/SuperAGI/commits/main.atom)

### 浏览器、通用与企业产品

Genspark 在 8 月 27 日发布从 Super Agent 展示转向 slides、docs、images、video、code 与 design 一体化工作空间的案例，但没有节省时长、成功率、企业客户、sandbox、权限图或 HITL 数据，因此不写成已验证的生产突破。[案例](https://www.genspark.ai/blog/from-scattered-tools-to-one-platform)

- **Project Mariner：** 本周无动态，项目已退出；后续按 Gemini/Chrome 新产品名跟踪。[Landing](https://labs.google.com/mariner/landing)
- **Kimi Agent：** 官网、blog、Kimi Work/Code/API 无窗口内 Agent 公告。[官网](https://www.kimi.com/)
- **Qwen Agent：** 无窗口内自身发布；Perplexity 采用 Qwen 不重复归因。[Repo](https://github.com/QwenLM/Qwen-Agent)
- **Coze/扣子：** 窗口命中多为用户模板或画廊，不是官方 release 或企业治理变化；公开 changelog 索引较弱。[中国站](https://www.coze.cn/)

### Benchmark 状态

- **SWE-bench：** 无官方 dataset、harness、leaderboard 或 release 更新。[Repo](https://github.com/SWE-bench/SWE-bench/commits/main)
- **OSWorld：** 只新增 Qwen-CUA 引用，不是任务或分数更新。[Commit](https://github.com/xlang-ai/OSWorld/commit/fc31a9049664292fcb35d6e501ee1dc839f2cf6d)
- **WebArena：** 无任务、镜像、脚本、榜单或 release 变化。[Repo](https://github.com/web-arena-x/webarena)
- **GAIA：** 未确认任务、评分规则或官方 leaderboard 变化。[Benchmark](https://huggingface.co/gaia-benchmark)
- **τ-bench：** 无 task、policy、user simulator 或 scorer 变化。[Repo](https://github.com/sierra-research/tau-bench)

经典 benchmark 静默不等于行业停滞。本周真正前进的是 runtime、identity、sandbox、MCP、memory 与 evaluation definition。

## 下周关注

接下来最值得验证的不是更多功能清单，而是生产证据：OpenClaw 的跨重启恢复能否进入稳定版并公开重复投递测试；Dify 的 E2B、Home Snapshot、Skills 和 KMS 是否出现迁移、安全与成本反馈；Perplexity 是否公开 benchmark、sandbox 和 PII 漏检数据，以及 Windows 版是否如期；MCP Enterprise IG 是否产出身份委托、审计、provenance 或签名草案。

企业侧还应关注 Glean、Salesforce 与 ServiceNow 是否披露客户、错误升级率、人工兜底和 ROI；Claude Code、Codex、Gemini CLI 的安全修复是否回归，nested Agent 预算是否可观测；Instinct 是否把支付、OTP、发信和断连数据删除改成硬控制；MalPR-Bench 是否公开完整数据并进入主流代码 Agent 评测。

本周最稳妥的结论是：Agent 的最小治理单元不再是一段对话，而是**身份、委托凭证、策略决策、工具调用与证据链**。控制面与 artifact plane 越来越靠近，便利性提高，平台锁定、数据驻留、审计与灾备风险也同步放大。开源 release 还需要审正文和比较区间；Hermes 的超大 patch、AutoGPT 的日期冲突与 OpenClaw 的 retained-seed 统计，都说明 tag 和 headline 可能夸大真实增量。
