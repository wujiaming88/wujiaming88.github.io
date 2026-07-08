---
bucket: agent-infra
layout: single
title: "全球 AI Agent 基础设施研究周报 · 第 3 期（2026-06-25 ~ 07-01）"
date: 2026-07-02 10:15:00 +0800
categories: [AI]
tags: [AIAgent, Agent基础设施, 云计算, AgentCore, Vertex AI, Foundry, Anthropic, Databricks, Coze, 行业观察]
header:
  overlay_image: /assets/images/posts/2026-07-02-global-ai-agent-infra-weekly-header.png
  overlay_filter: 0.5
  caption: "全球 AI Agent 基础设施赛道 · 2026 第 27 周"
excerpt: "三大云厂同周把托管 Agent 平台推进到生产 GA 下半场：AWS 一次性 GA 一整排组件、Google 把 Vertex 收编进 Gemini Enterprise Agent Platform、微软 Hosted Agents 临门一脚；模型层把子代理做进运行时，治理、评测与协议互操作成为新主战场。"
toc: true
toc_sticky: true
---

本期聚焦 AI Agent **基础设施赛道**（运行时 / 编排层 / 框架托管），覆盖区间为 **2026-06-25 00:00 → 2026-07-01 24:00（上海时区）** 的完整一周。

如果说上一周是「Agent 生产化治理」的引爆点，这一周就是三大云厂同步跨进「生产 GA 下半场」的分水岭——托管运行时、治理、运营闭环三件套集体补全，竞争焦点从「能不能托管 Agent」转向「谁的治理更可信、谁的分发更近业务、谁的变现更顺」。与此同时，模型厂商把「子代理」做进模型运行时，通用框架退回稳定内核、把商业价值上移到平台层，中国与开源阵营则押注「评测、可观测、协议互操作」。

---

## 本周主线

**一、三大云厂集体跨进生产 GA 下半场。** AWS 一次性把 Web Search、Managed Knowledge Base、Harness、评估三件套转 GA，并把 Gateway 强化为统一治理面；Google 把 Vertex AI 与 Agent Builder 收编进「Gemini Enterprise Agent Platform（GEAP）」并推出语义治理；微软 Hosted Agents 临近 GA、Microsoft Agent Framework 统一 Semantic Kernel 与 AutoGen。三家的托管运行时都进入了生产可用阶段，但打法分化明显。

**二、多代理下沉，「子代理」范式成跨厂商共识。** OpenAI GPT-5.6 的 ultra mode 把子代理能力做进模型运行时，LangChain 同周推出 Deep Agents 的「动态子代理」，「运行时按需生成子代理」正从框架特性变为共识，通用编排框架的部分价值被模型层与参考架构双向挤压。

**三、竞争焦点从框架转向平台层。** LangGraph、CrewAI 的开源核心均进入稳定或预发布打磨期，真正的商业动作全在可观测、评测、部署与治理——LangSmith、CrewAI AMP 的成本上限、MCP 的连接器可观测都是同一趋势。

**四、安全与合规成为一等约束。** Anthropic 因模型的网络攻击能力遭美出口管制、一度全球下线，OpenAI GPT-5.6 分阶段放量同样受政府审查；LangChain 研究「无沙箱安全运行不可信代理代码」，CrewAI 修复 SSRF、上线成本上限——生产级 Agent 的定义正在变成「安全执行 + 成本治理 + 政府合规」。

---

## 三大云厂：托管平台成型

### AWS：一整排组件同周 GA

本周 AWS 在 Bedrock AgentCore 上持续高密度发布，堪称「GA 大爆发周 + 开发者体验重构周」。

产品与 GA 层面，AgentCore 官方 release notes 的「June 2026」条目集中释放多项 GA：**Web Search Tool 转 GA**——一个全托管、零数据外泄（zero data egress）、数据驻留在客户 AWS 环境内的搜索工具，构建于亚马逊自有搜索基础设施（专有 web 索引 + 结构化知识图谱），以 MCP 内置连接器 target 形式暴露在 Gateway 上，返回带 snippet / 源 URL / 标题 / 发布日期的排序结果；**AgentCore Harness 转 GA**（全支持区域）——用 CreateHarness / InvokeHarness 声明式定义并运行 agent，无需编排代码、无需构建容器，GA 新增默认内置 Memory、通过 LiteLLM 与 Bedrock Mantle（解锁 OpenAI GPT-5.5 / GPT-5.4 等模型上 Bedrock）扩展模型商、AWS 策展 skills 目录一键开关、评估与优化、统一可观测性、版本与端点、导出为 Strands 代码；**Managed Knowledge Base 转 GA**——全托管 RAG 管线，6 个原生连接器（S3、SharePoint、Confluence、Google Drive、OneDrive、Web Crawler），支持混合检索 / 文档排序 / 文本视频音频图像多模态；**Recommendations / Batch Evaluations / A/B Testing 三件套转 GA**——构成「agent performance loop」，可在 AgentCore Runtime、Lambda、EKS 乃至非 AWS 环境运行；**Failure Insights 转 Public Preview**——跨数百会话发现复发性失败模式（含无错误信号的静默行为失败）、解释根因并按影响面排序。

Gateway 侧大量增强：AgentCore Runtime targets 转 GA（网关直连 runtime agent，可加 API schema 让策略引擎施加 guardrails、支持请求 / 响应 interceptor Lambda）、新增 HTTP passthrough targets（可 front A2A agent / 外部 MCP server / 自定义推理端点，统一鉴权 + 策略 + 可观测性）、Inference targets（front 模型商，自动处理模型发现 / ID 翻译 / 路径重写）、可强制入站流量仅来自网关（SigV4 用 aws:SourceArn，OAuth 用 allowedWorkloadConfiguration）。

安全合规方面，AgentCore 通过 SOC 合规（纳入 SOC 1/2/3 报告范围）；AWS WAF 对 AgentCore Gateway 的保护转 GA（可挂 WAF protection pack 做 IP 访问控制、限速、AWS 托管规则组含 Bot Control，网关级一次配置全 target 生效）。

Runtime 扩容显著：默认服务配额大幅提升——活跃会话 us-east-1 / us-west-2 由 1000 提到 5000、其他区 500 提到 2500；InvokeAgentRuntime 由 25 TPS 提到 200 TPS / agent / 账户；容器部署新会话创建率 100 提到 400 TPM / 端点；新增交互式 Shell（Terminals），每会话最多 10 个并发 shell，跨命令保持环境变量 / 工作目录 / 进程状态。

开发者体验重构：AWS 推出全新 `@aws/agentcore` npm CLI（Node.js 20+），取代旧的 Python `bedrock-agentcore-starter-toolkit`（两者命令名都叫 agentcore，会提示卸载旧版），提供 TUI 交互式向导 + create / dev / deploy / invoke 命令，支持 harness / memory / credentials / gateway / evaluators / knowledge-base / policy-engine（Cedar）/ payments（x402 协议 pay-per-call）等海量资源声明；同期 AgentCore CLI v0.19.0 + CDK constructs v0.1.0-alpha.36 加入 Payments 支持；Step Functions 原生集成 AgentCore harness（可视化 builder 内联建 harness、并行 / 串行编排 + 人工审批）。

关键数据：Runtime 活跃会话配额 1000→5000（us-east-1/us-west-2）、500→2500（其他区），InvokeAgentRuntime 25→200 TPS/agent，容器新会话 100→400 TPM/端点，均来自 [AgentCore release notes「June 2026」](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)（读取于 2026-07-02）；新 CLI 包名 `@aws/agentcore`（npm，需 Node.js 20.x+），见 [aws/agentcore-cli](https://github.com/aws/agentcore-cli)（读取于 2026-07-02）；AgentCore CLI v0.19.0 / CDK v0.1.0-alpha.36 加入 Payments（同 release notes）。背景（非本周）：AgentCore 2025-10 GA，覆盖 9 个 AWS 区域，消费型定价含 12 组件。

原文链接：[AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)、[AWS WAF for AgentCore（约 2026-06-30 GA）](https://aws.amazon.com/about-aws/whats-new/2026/06/aws-waf-amazon-bedrock-agentcore/)、[在 AgentCore 上托管编码 agent（Claude Code/Codex/Kiro/Cursor）](https://aws.amazon.com/blogs/machine-learning/its-safe-to-close-your-laptop-now-hosting-coding-agents-on-amazon-bedrock-agentcore/)、[基于 AG-UI 协议构建 generative UI（约 2026-07-01）](https://aws.amazon.com/blogs/machine-learning/build-generative-ui-for-ai-agents-on-amazon-bedrock-agentcore-with-the-ag-ui-protocol/)、[aws/agentcore-cli](https://github.com/aws/agentcore-cli)。

影响判断：AWS 本周的信号极强——不是单点更新而是「平台成型」。Web Search / KB / Harness / 评估三件套一次性转 GA，意味着 AgentCore 的托管运行时 + RAG + 运营闭环已进入生产可用阶段；Gateway 演进为跨 A2A / MCP / 推理 / 工具的统一治理入口，加上 WAF / Guardrails / SOC 合规，直接瞄准企业采购门槛。新 Node CLI 取代 Python toolkit、支持 Claude Code / Codex / Cursor 托管，是在抢「编码 agent 运行基座」这一高价值场景。三大云厂中，AWS 本周动作最密、最偏「平台完备度」。

---

### Google：Vertex 收编进 Gemini Enterprise

本周 Google 侧最重磅的是品牌与架构大整合——官方文档明确「Vertex AI is now part of Gemini Enterprise Agent Platform」，且「Agent Builder is now part of Gemini Enterprise Agent Platform」，模型支持信息也迁入 GEAP > Models（读取于 2026-07-02，文档条目标注为「2 days ago」）。即 Google 把原 Vertex AI Agent Engine、Agent Builder、模型服务统一收编进「Gemini Enterprise Agent Platform（GEAP）」顶层品牌，与面向业务终端的「Gemini Enterprise」应用层形成「平台层 + 应用层」双层结构。

GEAP 平台层本周更新（精确落窗内）：07-01「Provisioned Throughput: Multiple pending new orders」转 GA——同一模型同一区域最多提交 7 个待处理订单；06-29 Memory Bank 默认生成模型由 Gemini 2.5 Flash 升级为 Gemini 3.5 Flash；06-29「Semantic Governance Policies（SGP）」进 Public Preview——运行时对 agent 拟发起的工具调用做「意图对齐」评估的智能安全 / 合规层，核心能力含自然语言约束（NLC，用英文写声明式业务规则，无需改代码重部署）、分层意图门控（拦截运行时工具调用，防越权 / 流氓工具 / 数据外泄）、细粒度作用域（对特定工具 / 参数施加财务额度或地理限制）、Agent Skills 生命周期治理（防上下文投毒与供应链攻击）、Dry Run 模式（在 Log Explorer 观察裁决后再启用）；06-29 PT 事件邮件通知转 GA。

Gemini Enterprise 应用层本周更新：06-25「Agent Registry 治理」GA——可从 Agent Registry 目录选 A2A agent 或自定义 MCP server 加入 Gemini Enterprise 应用，并经 Agent Gateway egress 策略对流量设 allow / deny；06-25「View agent identity」GA——管理员可在 Agent 详情页查看 agent 身份（通常是 SPIFFE ID，未发布则回退 Agent Registry 资源 ID）；06-25 Lovable 数据存储进 Preview，新增 Airtable / Freshservice / Google Stitch / Zoho 动作；06-26 Confluence Data Center 联邦数据存储 GA；06-29 Jira Data Center + HubSpot 联邦数据存储 GA；06-30 SharePoint 过滤器 GA，印度（IN）/ 新加坡（SG）区域以 at-rest 数据驻留（DRZ）+ 机器学习处理（MLP）在区 GA（allowlist）。

模型侧：Google Cloud「What's New」Jun29–Jul3 宣布 Claude Sonnet 5 上线 Agent Platform（作为 Sonnet 4.6 drop-in 替换，强化推理 / 代码生成 / computer use）；Gemini 3.1 Pro 在 Vertex AI / Gemini Enterprise 预览（约 6 天前）。背景锚点（近 2 周非窗内但构成语境）：06-18 Agent Gateway、Agent Observability、Agent Registry 三件套均转 GA，Agent Identity API 进 Preview，是本周 06-25 应用层「消费」Agent Registry 与 SPIFFE 身份的底座。

关键数据：Memory Bank 默认模型 Gemini 2.5 Flash → Gemini 3.5 Flash（2026-06-29）、PT 单模型单区域最多 7 个待处理订单（2026-07-01 GA），来源 [GEAP release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)；印度 / 新加坡区域 GA（allowlist），支持 in-region DRZ+MLP 与 Gemini 3.5 Flash（2026-06-30），来源 [Gemini Enterprise release notes](https://docs.cloud.google.com/gemini/enterprise/docs/release-notes)；Claude Sonnet 5 上线 Agent Platform（Jun29–Jul3，drop-in 替换 Sonnet 4.6），来源 [Google Cloud What's New](https://cloud.google.com/blog/topics/inside-google-cloud/whats-new-google-cloud)；Agent Registry 支持 A2A v1.0（06-18 GA 背景，同 GEAP release notes）。

原文链接：[GEAP release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)、[Gemini Enterprise release notes](https://docs.cloud.google.com/gemini/enterprise/docs/release-notes)、[Google Cloud What's New](https://cloud.google.com/blog/topics/inside-google-cloud/whats-new-google-cloud)。

影响判断：本周 Google 最强信号是「平台收编 + 语义治理」——把 Vertex AI / Agent Builder 统一为 GEAP，降低产品线认知碎片；SGP（运行时意图门控 + 自然语言约束）是对企业最担心的「agent 越权 / 数据外泄」痛点的高阶回应，比 AWS Cedar 更偏语义 / 自然语言，差异化明显。Agent Registry 治理 + SPIFFE 身份 + A2A v1.0 落到应用层，说明 Google 的 A2A 生态从「协议」走向「可治理的生产落地」。Claude Sonnet 5 drop-in 上线延续 Google 多前沿模型托管开放叙事，直接与 AWS Bedrock Mantle（托管 GPT-5.5）打对台。

---

### 微软：Hosted Agents 临门一脚

本周微软处于「Build 2026（6 月 2 日）+ Foundry 门户 GA（6 月 19 日）」两大节点后的密集落地期，窗口内（6-25 → 7-1）最关键的信号是 Foundry Agent Service 的「Hosted Agents（托管 agent）」预计「by early July 2026 / 未来 30 天内」转 GA——即本周正是其 GA 目标窗口。官方 Build 版「What's New in Foundry」明确：Hosted Agents 是生产级 agent 的托管运行时，每个会话跑在独立 sandbox（专属 compute / memory / filesystem），运行时框架无关（用 Microsoft Agent Framework、GitHub Copilot SDK、LangGraph、Claude Agent SDK 构建的 agent 无需重写即可部署），支持两种协议：Responses API（OpenAI 兼容的有状态交互）与 Invocations protocol（无 schema 的 pass-through）。

产品与技术更新：Hosted Agents 临近 GA（本周窗口）；发布 Foundry agent 到 Microsoft Teams + Microsoft 365 Copilot 计划 2026 年 6 月 GA（身份 / 权限 / 策略自动流转）；Foundry Toolkit for VS Code 转 GA；Memory in Foundry Agent Service 公开预览，含 procedural / user / session 三类记忆；Toolboxes（意图式工具箱）公开预览、Voice Live 实时语音、Agent Optimizer（预览）、Routines（预览）、incoming A2A endpoint（预览）、Managed MCP servers via connector namespaces（预览）、Fabric IQ / Work IQ 连接（预览）。

框架层——Microsoft Agent Framework（MAF）是本组「harness」维度的核心：它统一了 Semantic Kernel 的企业基础与 AutoGen 的多 agent 编排（GitHub semantic-kernel 仓库首页已置顶「Semantic Kernel is now Microsoft Agent Framework」，MAF 1.0 为生产就绪版：稳定 API + 长期支持承诺，经 A2A 与 MCP 实现跨运行时互操作）。背景锚点：MAF 1.0 GA 于 2026-04-02/03（.NET + Python 双语言，统一 SK + AutoGen；AutoGen 已于 Q1 2026 进入维护模式，社区 fork AG2 延续 AutoGen 血脉）。Build 版更新含 agent harness（skills / memory / middleware 稳定版）、与 GitHub Copilot SDK 及 Claude Agent SDK 集成（稳定）、Magentic-One 多 agent 编排（稳定）、文件系统 / 记忆工具与 deep research agent（预览）；MAF 仓库新增「Foundry Hosted Agents：2 行代码部署到 Foundry 托管基础设施」。

商业化与生态：微软 6 月 Partner Center 公告——Microsoft 365 Copilot 新增 Copilot Cowork（GA，面向复杂长时多工具任务的 agentic 系统）与 Microsoft Scout，采用 Copilot Credits 用量计费（统一消费货币，覆盖 Copilot Studio、Foundry、Work IQ API）；自 6-1 起 Microsoft 365 E5 成为新购 Microsoft Agent 365 的许可前置；Work IQ（经 A2A 让 agent 情境化访问 M365 数据）GA。认证体系也重构：APL-7008（Copilot Studio 自定义 agent）6 月底退役，新增 AB-100（Agentic AI Business Solutions Architect）与 AB-620（AI Agent Builder Associate）。客户案例：Telefónica Spain（Jaime Lluch）证言用 Foundry Agent Service + MAF 在移动网络内嵌入 AI，面向 6G 网络优化。

关键数据：MAF 1.0 GA 日期 2026-04-02/03（.NET + Python，统一 SK + AutoGen），来源 [MAF at Build 2026（2026-06-03）](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-at-build-2026-announce/) 与 [MAF v1.0（2026-04-03）](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/)；AutoGen 于 Q1 2026 进入维护模式、AG2 为社区 fork（交叉见 [semantic-kernel 首页 MAF 迁移说明](https://github.com/microsoft/semantic-kernel)）；Hosted Agents 预计 early July 2026 / 未来 30 天 GA、发布到 Teams+M365 Copilot 计划 2026-06 GA，来源 [What's New in Foundry（Build 2026）](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-build-2026) 与 [Agent Service Build 2026](https://devblogs.microsoft.com/foundry/agent-service-build2026)；Foundry 门户 GA 2026-06-19、AzureML SDK v1 EOL 2026-06-30（背景，窗前）；MAF 环境要求 .NET 10.0+ / Python 3.10+ / Java JDK 17+（读取于 2026-07-02）。

原文链接：[What's New in Foundry（Build 2026）](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-build-2026)、[Agent Service Build 2026](https://devblogs.microsoft.com/foundry/agent-service-build2026)、[microsoft/agent-framework](https://github.com/microsoft/agent-framework)、[microsoft/semantic-kernel](https://github.com/microsoft/semantic-kernel)、[Partner Center 2026 年 6 月公告](https://learn.microsoft.com/en-us/partner-center/announcements/2026-june)。

影响判断：本周微软的关键在于 Hosted Agents GA 临门一脚——若如期落地，则三大云厂的「托管 agent 运行时」在 2026 年中全部进入生产 GA 阶段，竞争进入「治理 + 分发 + 变现」的下半场。微软独有的杀手锏是把 agent 直接发布进 Teams / M365 Copilot 并用 Copilot Credits 统一计费，把「agent 建好后卖给谁、怎么收钱」这一环补齐，这是 AWS / Google 目前的短板。MAF 统一 SK + AutoGen（AutoGen 退居维护、AG2 社区接棒）标志微软开源框架战略收敛，framework-agnostic 的 Hosted Agents 则同时向 LangGraph / Claude SDK / Copilot SDK 生态张开怀抱，兼顾开放与锁定。

---

### 三大云厂：格局正在怎么变

本周三大云厂在 Agent 托管平台上呈现「同步进入生产 GA 下半场、但打法分化」的清晰格局。

其一，全部完成「托管运行时 + 治理 + 运营闭环」的补全：AWS 一次性把 Web Search / Managed KB / Harness / 评估三件套转 GA 并强化 Gateway 为统一治理面（加 WAF / Guardrails / SOC）；Google 把 Vertex AI / Agent Builder 收编为 GEAP 并推出语义治理 SGP（运行时意图门控）；微软 Hosted Agents 临 GA、MAF 统一 SK + AutoGen。

其二，差异化主轴各不相同：AWS 是平台完备度 + 编码 agent 基座（托管 Claude Code / Codex / Cursor）+ 新 Node CLI；Google 是统一品牌 + A2A / SPIFFE 身份 + 最「AI 原生」的语义治理；微软是 framework-agnostic 托管 + 独有的 Teams / M365 Copilot 分发渠道 + Copilot Credits 变现闭环。

其三，协议与模型开放趋同：三家都押 MCP + A2A 互操作；模型侧互相「抢托管」——AWS Bedrock Mantle 托管 GPT-5.5、Google Agent Platform drop-in Claude Sonnet 5，多前沿模型托管成为标配。核心信号是：竞争焦点已从「能不能托管 agent」转向「谁的治理更可信、谁的分发更近业务、谁的变现更顺」——微软在分发 / 变现领先，Google 在语义治理领先，AWS 在平台工程完备度与开发者基座领先。

---

## 模型厂商与通用框架

### OpenAI：子代理做进模型运行时

本周 OpenAI 侧重点集中在模型层而非 Agent 平台层的独立公告，但两者高度耦合。核心事件是 GPT-5.6 系列（旗舰 Sol、均衡 Terra、高性价比 Luna）于本周进入「有限预览（limited preview）」（OpenAI 官方发布说明，releasebot 收录，1 天前）。

对 Agent 平台的直接意义在于：GPT-5.6 引入两项面向 Agent 的新推理能力——新增「max reasoning effort」档位（给 Sol 最长的深度推理时间）与全新「ultra mode」（「beyond the capabilities of a single agent by leveraging subagents to accelerate complex work」，即原生子代理 / 多代理编排）。这标志 OpenAI 把 multi-agent（Swarm → Agents SDK 谱系的核心理念）下沉进模型运行时本身。官方说明明确「models are available via the Responses API and our Client SDKs」，即 Responses API 仍是所有新模型的统一入口。预览期模型仅通过 API 与 Codex 面向「select group of trusted partners」开放，因涉美政府 cyber 审查而采分阶段放量，「generally available in the coming weeks」。

数据细节：GPT-5.6 Sol 在 Terminal-Bench 2.1（命令行 Agent 工作流）刷新 SOTA；在 GeneBench v1、ExploitBench²（约用 Mythos Preview 1/3 output tokens 达到相当水平）、ExploitGym（UC Berkeley 与 OpenAI 等合作）上均展示更强 agentic 能力；Terra 性能对标 GPT-5.5 但便宜 2 倍。

GitHub 侧：`openai/openai-agents-python`（Python Agents SDK）本周持续高频合并 PR，含 websocket max_size 可配置、Chat Completions 工具调用缓冲流式、E2B / Blaxel 沙箱超时修复、Realtime 多 Agent 工具分发歧义修复、重复 MCP server 工具名报错提示等（GitHub releases 页，本周多条 PR #3645 / #3506 / #3642 / #3678），显示 SDK 已进入以稳定性、沙箱运行时、Realtime 与 MCP 集成打磨为主的成熟期，而非大版本能力跃迁。

关键数据：GPT-5.6 三档（Sol / Terra / Luna）limited preview、Terra 较 GPT-5.5 便宜 2x，Terminal-Bench 2.1 SOTA、ExploitBench² 约 1/3 output tokens，来源 [releasebot OpenAI](https://releasebot.io/updates/openai)（2026-07-01 前后）；Agents SDK 本周 PR #3645 / #3506 / #3642 / #3678，来源 [openai-agents-python releases](https://github.com/openai/openai-agents-python/releases)（2026-07-02 读取）。

原文链接：[releasebot OpenAI](https://releasebot.io/updates/openai)、[openai-agents-python releases](https://github.com/openai/openai-agents-python/releases)、[OpenAI 模型文档](https://developers.openai.com/api/docs/models)。

影响判断：ultra mode 把「子代理加速复杂工作」做进模型运行时，是对 LangGraph / CrewAI 等外部多代理编排框架的正面竞争信号；Responses API 继续作为唯一模型入口，强化 OpenAI 平台锁定。GPT-5.6 因 cyber 能力被美政府要求分阶段放量，说明前沿 Agent 能力已进入国家安全审查范畴，将影响所有依赖 OpenAI 后端的 Agent 平台的可用性节奏。

---

### Anthropic：模型下线又复活，MCP 升级为企业连接层

本周 Anthropic 的核心事件是出口管制解除与模型恢复上线，直接关系到所有基于 Claude Agent SDK 的应用可用性。据 Anthropic 官方发布说明（releasebot 收录），6 月 12 日美政府对 Anthropic 最新模型 Claude Fable 5 与 Claude Mythos 5 施加出口管制（因 Amazon 研究者报告了绕过 Fable 5 安全护栏、令其识别并演示利用软件漏洞的方法），Anthropic 一度对全体用户暂停两款模型。6 月 30 日出口管制解除；Fable 5 自 7 月 1 日（周三）起面向全球用户重新上线 Claude Platform、Claude.ai、Claude Code 与 Claude Cowork——Pro / Max / Team 及部分 Enterprise 计划在 7 月 7 日前可用至每周用量上限的 50%，之后转为按 usage credits 计费；AWS、Google Cloud、Microsoft Foundry 将「尽快」重新启用。Mythos 5 已于 6 月 26 日经美政府批准，向一组美国组织恢复（Glasswing 计划）。

安全细节：Anthropic 训练了新的 safety classifier，被拦截的 Fable 5 请求会通知用户并改由 Opus 4.8 处理；新分类器对报告技术的拦截率大于 99%，但代价是提高了常规编码 / 调试的误报率。Anthropic 联合 Amazon、Microsoft、Google 等 Glasswing 伙伴启动「共享 jailbreak 严重性评估框架」。

MCP 与生态：本周 MCP 侧动态集中在生态化——Claude 上线 connector 可观测性公测（管理员可跨 Claude 产品监控 connector 的采用率、错误、延迟、用量）并支持从 Claude 内直接提交 MCP connector 到目录（releasebot，2 天前）；社区维护的 Claude Connectors Directory 已记录 511 个验证过的 MCP 集成、30 个类别（GitHub awesome-claude-connectors，更新于 2026-06-26）。Claude Code 本周多次迭代：新增 sandbox 凭据拦截、组织级模型限制、全屏控制，修复 remote MCP hang、resume、结构化输出等。

关键数据：Fable 5 出口管制 6 月 30 日解除、7 月 1 日全球恢复，7 月 7 日前含至每周用量 50%；新 classifier 拦截率大于 99%、拦截请求改由 Opus 4.8 处理；Mythos 5 于 6 月 26 日经美政府批准恢复给美国组织，来源 [releasebot Anthropic](https://releasebot.io/updates/anthropic)（2026-06-30）；MCP connectors 目录 511 个集成 / 30 类，更新 2026-06-26，来源 [awesome-claude-connectors](https://github.com/rdmgator12/awesome-claude-connectors)。

原文链接：[releasebot Anthropic](https://releasebot.io/updates/anthropic)、[releasebot Claude](https://releasebot.io/updates/anthropic/claude)、[releasebot Claude Code](https://releasebot.io/updates/anthropic/claude-code)。

影响判断：本周事件揭示前沿模型的 Agent / cyber 能力已成国家安全监管对象，Claude Agent SDK 生态的可用性首次因政府管制中断——这对企业选型是重大可用性风险信号。MCP connector 可观测性 + 目录提交把 MCP 推向企业治理层，强化 Anthropic 作为「Agent 连接标准制定者」的护城河，也为 MCP 对抗 A2A、OpenAI 私有生态提供治理差异化。

---

### LangChain：Deep Agents 与可观测双轮

LangChain 本周产出极为密集，主线是 Deep Agents（深度代理）架构 + LangSmith 可观测双轮驱动，而非底层框架大改。

开源与框架：`langchain-ai/langgraph` 本周内发布 1.2.7（2026-06-29），为纯稳定性 / 修复版——修复 snapshot DeltaChannel overwrite supersteps、Overwrite 的 JSON roundtrip 存活、为 langgraph-api 的 exit-mode delta task_ids 生成合法 UUID（GitHub releases，PR #8223 / #8125 / #8127 / #8165），并同步 CLI 0.4.30（新增「支持兼容 API 版本区间」feat #8023）与大量依赖升级（langsmith 0.8.0 → 0.8.18、cryptography 46 → 48 等）。截至本周 LangGraph 约 36.1k GitHub Stars（decisioncrafters，2 天前，属二手需交叉验证）。

Deep Agents 成为本周官方博客绝对主角：6 月 29 日《Introducing Dynamic Subagents in Deep Agents》（动态子代理，运行时按需生成子代理，直接对标 OpenAI ultra mode 的子代理思路）；7 月 1 日《How to Use RLMs in Deep Agents》《Introducing OpenWiki, an open source agent for repo documentation》（开源仓库文档代理）；6 月 30 日《Running Untrusted Agent Code Without a Sandbox》（无沙箱运行不可信代理代码，安全执行方向）、Harrison Chase 亲撰《Wiki Memory》（代理记忆新范式）。

LangSmith 可观测与部署：7 月 1 日案例《How Pendo used LangSmith to trace Novus from user behavior to code fixes》、6 月 29 日《How Candidly Built State-Aware Agent Harnesses with LangSmith》，6 月 30 日《Harbor x LangChain: A Unified Stack for Evaluating Agents》（与 Harbor 合作统一评测栈）；背景（非本周）：LangSmith Engine 已于 5 月 13 日发布。

关键数据：LangGraph 1.2.7 发布于 2026-06-29、CLI 0.4.30、langsmith 依赖升至 0.8.18，来源 [langgraph releases](https://github.com/langchain-ai/langgraph/releases)（2026-07-02 读取）；约 36.1k Stars 为二手待验证，来源 [decisioncrafters](https://www.decisioncrafters.com/langgraph-build-resilient-agents/)（2 天前）；本周博客密集（Dynamic Subagents 6-29、OpenWiki / RLMs / Pendo 案例 7-1、无沙箱执行 6-30），来源 [LangChain Blog](https://www.langchain.com/blog)。

原文链接：[langgraph releases](https://github.com/langchain-ai/langgraph/releases)、[LangChain Blog](https://www.langchain.com/blog)、[releasebot langchain-ai](https://releasebot.io/updates/langchain-ai)。

影响判断：Deep Agents 的「动态子代理」与 OpenAI GPT-5.6 ultra mode 撞车，说明「运行时按需生成子代理」正成为多代理编排的共识范式；LangChain 抢先以开源参考架构 + 商业可观测（LangSmith）卡位。「无沙箱安全运行不可信代理代码」直指企业最痛的 Agent 安全执行问题，若成熟将显著降低生产部署门槛。LangGraph 进入稳定内核期，意味着竞争焦点已从框架转向平台层（部署 + 可观测 + 评测）。

---

### CrewAI：Flows 与 AMP 成本治理

CrewAI 本周动态集中在开源框架迭代 + AMP / Agent Control Plane 企业控制面的双线推进，核心版本进入 v1.15.x 预发布序列（1.15.1a1 / 1.15.2a1）。

开源框架（GitHub releases，本周多条预发布）：新增 Flow（事件驱动流）能力——为 flows 定义 stream frame 协议（流式帧协议）、支持内联 skill 定义（inline skill definitions）、在 CrewDefinition 中新增 type tool 与 app、生成 Flow Definition 授权 skill，并新增流式文档；修复「拒绝 self-listening flow 方法」、SSRF 重定向绕过（#6331，安全修复）。CLI 侧：要求显式 CrewAI 项目定义（#6358）、为生成项目初始化 Git 仓库（#6364）、CLI deploy 后自动打开部署页（#6343）——显示 CrewAI 正强化「从 CLI 到云端一键部署」的开发者体验闭环。

AMP 与企业化：官方定位 CrewAI AMP Suite 为「commercial control plane around CrewAI」，提供 managed deployment、observability、governance、security 与企业支持；本周文档新增 Agent Control Plane 的 Cost Limit（成本上限）规则类型（GitHub release notes），是企业级成本治理的直接信号；免费入口为 Crew Control Plane（app.crewai.com）。

生态：Databricks Data + AI Summit 2026（本周，1 天前报道）宣布 Agent Bricks / Omnigent 继续兼容 CrewAI、LangGraph、OpenAI Agent SDK、Claude Code SDK 等 harness，CrewAI 作为受支持编排框架被纳入 Databricks 托管代理生态。社区侧：CrewAI 宣称已通过社区课程认证超 10 万名开发者（GitHub README）。

关键数据：v1.15.1a1 / 1.15.2a1 预发布（本周）、Flow stream frame 协议、内联 skill、SSRF 修复 #6331、CLI 显式项目定义 #6358、Agent Control Plane 新增 Cost Limit 规则类型，来源 [crewai releases](https://github.com/crewaiinc/crewai/releases)（2026-07-02 读取）；社区认证开发者超 100,000，来源 [crewai README](https://github.com/crewaiinc/crewai)；Databricks DAIS 2026 兼容 CrewAI（5 天前，属背景边界），来源 [Qubika DAIS 2026 综述](https://qubika.com/blog/everything-databricks-announced-dais-data-ai-summit-2026/)。

原文链接：[crewai releases](https://github.com/crewaiinc/crewai/releases)、[crewaiinc/crewai](https://github.com/crewaiinc/crewai)、[CrewAI Enterprise](https://www.crewai.com/enterprise)。

影响判断：Cost Limit 规则类型是 Agent 平台「FinOps 化」的明确信号——企业开始把 Agent 运行成本纳入治理，谁先把成本护栏做进控制面谁就更贴近企业采购。CrewAI 用 Flows 流式协议 + 一键部署 + AMP 控制面构建从原型到生产的闭环，与 LangGraph（图执行内核）形成「事件驱动 vs 状态图」的路线分野。被 Databricks 纳入托管生态，说明框架层已被数据平台巨头「harness 中立化」收编，框架厂商的价值正加速向控制面 / 可观测迁移。

---

### 模型与框架：三条主线

本周四对象呈现三条清晰主线。

其一，多代理下沉与「子代理」范式共识化：OpenAI GPT-5.6 ultra mode 把子代理做进模型运行时，LangChain 同周推出 Deep Agents「动态子代理」，「运行时按需生成子代理」正从框架特性变为跨厂商共识，通用编排框架的部分价值被模型层与参考架构双向挤压。

其二，竞争焦点从框架转向平台层（部署 + 可观测 + 评测 + 治理）：LangGraph / CrewAI 开源核心均进入稳定 / 预发布打磨期，真正的商业动作全在 LangSmith（评测 / trace / 一键部署）、CrewAI AMP（Cost Limit 成本治理、控制面）；MCP 也从协议升级为「可观测 + 目录」的企业连接层。谁掌握平台层谁掌握变现。

其三，安全与合规成为一等约束：Anthropic 因 cyber 能力遭美出口管制、模型一度全球下线，OpenAI GPT-5.6 分阶段放量同样受政府审查；同时 LangChain「无沙箱安全运行不可信代理代码」、CrewAI SSRF 修复与 Cost Limit 均指向「生产级 Agent = 安全执行 + 成本治理 + 政府合规」。选型建议：企业应把「可用性受监管中断风险」和「成本 / 安全治理能力」提到与功能同等权重。（注：本组 x_search 全程 403 额度耗尽，以官方 releasebot / GitHub / 官方博客一手来源为主；LangGraph Stars 为二手数据待交叉验证。）

---

## 数据平台、开源与中国阵营

### Databricks：数据平台变身 Agent 运行时

Databricks 在 2026 Data + AI Summit（6/15–18，属背景，非本周）密集发布 Agent Bricks、Genie 家族（Genie One / Genie Agents / Genie Ontology）、Unity AI Gateway、Omnigent（Apache 2.0 的「harness of harnesses」编码 agent 元框架，包裹 Claude Code、Codex）等。落在本期时间窗（6/25–7/1）内的是官方产品 Release Notes 的滚动 GA / Beta 上线，含多项与 Agent 强相关能力。

6/30 Anthropic Claude Sonnet 5 登陆 Model Serving，作为 Databricks 托管模型经 Foundation Model APIs 调用，官方定位「面向 coding、agentic workflows 与大规模专业工作，近 Opus 级智能 + Sonnet 的成本与速度」——这直接强化 Agent Bricks / AI Runtime 的底层模型选项；6/29 Unity Catalog 中以 model services（Beta）治理 Databricks 托管 LLM：model service 是 UC securable，代表受治理的 LLM endpoint，一次定义跨 workspace 共享、免每 workspace 重复建 endpoint，system.ai schema 提供开箱即用服务，可经 Unity AI Gateway UI / Catalog Explorer / UC REST API 自建；6/29 AI Runtime CLI（air）工作负载支持自带 Docker 镜像（Beta），用于特定系统库版本 / 复杂依赖 / 可复现环境；6/29 Genie Code 移除 Chat / Agent 模式选择器，Genie Code 现仅以 Agent 模式运行（想要纯对话需在 prompt 里显式说明），是从「对话」向「自主执行 agent」收敛的明确信号；6/30 Lakehouse//RT（Beta）serverless SQL 仓库，亚秒级读、面向数百到数千并发，服务应用 / 运营分析 / 仪表盘，是 agentic 数据访问的实时底座。

技术与商业路线判断：Databricks 把「治理」作为 agentic 时代主轴（Unity AI Gateway：从「谁能访问数据」到「agent 实际能做什么」，含 Contextual Service Policies Beta、PII / prompt injection 防护、跨 provider 预算硬上限），并把 Genie 从产品升级为家族，以 Omnigent 拥抱外部 coding agent（Claude Code / Codex），路线是「数据 + 治理为地基、模型可插拔、Agent 编排层开放」。

关键数据：Claude Sonnet 5 上线 Model Serving 6/30/2026，model services Beta 6/29、AI Runtime 自带 Docker Beta 6/29、Genie Code 仅 Agent 模式 6/29、Lakehouse//RT Beta 6/30、Lakebase Autoscaling 登陆 AWS 东京 ap-northeast-1 6/30、Parquet v2 GA 6/29，来源 [Databricks June 2026 release notes](https://docs.databricks.com/aws/en/release-notes/product/2026/june)；Unity Catalog 治理组织数超 14,000（DAIS 2026 背景），来源 [Unity Catalog at DAIS 2026](https://www.databricks.com/blog/whats-new-unity-catalog-data-ai-summit-2026)（6/16/2026）；Omnigent 采用 Apache 2.0，来源 [Atlan DAIS 2026 综述](https://atlan.com/know/ai-agent/databricks/databricks-data-ai-summit-2026-announcements/)（6/19/2026）。

原文链接：[Databricks June 2026 release notes](https://docs.databricks.com/aws/en/release-notes/product/2026/june)、[Unity Catalog at DAIS 2026](https://www.databricks.com/blog/whats-new-unity-catalog-data-ai-summit-2026)。

影响判断：本周的滚动 GA 表明 DAIS 上的 agent 愿景正快速落地为可用产品，Claude Sonnet 5 即时可用 + Genie Code 强制 Agent 模式是把「数据平台」变「agent 运行时」的实操信号；对企业客户，UC 治理 + 模型可插拔的组合是它对抗云厂商原生 agent 平台的核心差异化。

---

### Dify：从 UI 优先走向 CLI 优先

Dify（langgenius/dify）于 6/25/2026 发布 1.15.0（正处本期窗口）。这是一次面向「CLI 化 + agentic 工作流深化」的实质更新。

核心新特性：difyctl 命令行客户端首发（docs.dify.ai/en/cli/overview），可直接从终端运行 apps 与 workflows，让个人 agent、脚本、CI 流水线免开 Web UI 调用 Dify workflow；全平台（macOS / Linux / Windows）一条命令安装、无需 access token，二进制以带 checksum 校验的公开 release 发布（PR #37036、#37454）；可向 CLI 工具运行传递 scoped 环境变量，并在 difyctl 与 /openapi/v1 API 上统一友好的错误信息含限流处理（#37324 / #37285 / #37313 / #36896）。Workflow / Chatflow / CLI 可见 CoT（思维链）：把模型推理流式送入专用「thinking」实时面板，最终答案保持干净，刷新后推理仍保留，CLI 与 workflow 预览同样可见（#37460 / #37828）。更丰富的 Human-in-the-Loop 表单：workflow 暂停向人求输入时，表单可含下拉选择与单 / 多文件上传，不再只有自由文本（#36322）。支持慢 / 长耗时模型：workflow 可用图像 / 视频生成等长耗时生成模型，节点经轮询机制耐心等待最终结果不超时（#37462）。知识导入从 Excel 内嵌图片提取（#37104）；可为 Phoenix 设自定义 trace session id、追踪文档检索步骤深化 observability（#37056 / #37283）；start / output 节点重做、恶意 app / workspace ID 更友好报错。

技术与商业路线判断：Dify 正从「可视化 no-code Agent 编排」向「可脚本化 / 工程化 / CI 可集成」演进（difyctl 是关键落子），并强化 agentic 长任务（长耗时模型轮询）与人机协作（结构化 HITL 表单），对标企业级生产可用性。

关键数据：Dify 1.15.0 发布 6/25/2026，来源 [Dify 1.15.0 release](https://github.com/langgenius/dify/releases/tag/1.15.0)；GitHub Stars 147,292、Forks 23,197、Open Issues 862、最近 push 2026-07-02（GitHub API repos/langgenius/dify，实时查于 2026-07-02）；此前部署量 1M+ apps、5M+ downloads（as of May 2026，二手来源待官方交叉验证）。

原文链接：[Dify 1.15.0 release](https://github.com/langgenius/dify/releases/tag/1.15.0)、[langgenius/dify](https://github.com/langgenius/dify)。

影响判断：difyctl 把 Dify 从「UI 优先」扩展到「CLI / CI 优先」，直击开发者与自动化管线场景，与 n8n / Flowise 的差异化在于 LLMOps + RAG + Agent 一体；147k+ Stars 稳居开源 LLM 应用平台第一梯队，CLI + 长任务支持是它守住企业自托管市场的关键动作。

---

### 字节 Coze / 扣子：开源押注评测，企业版提价

本期时间窗（6/25–7/1）内，Coze 的一手动态集中在开源仓库 coze-loop 的持续迭代与企业版定价调整的落地临近两条线。

开源侧：coze-dev/coze-loop（下一代 AI Agent 优化 / 评测平台）在窗口内有 5 次 commit（6/25–6/30），含 [feat][evaluation] 新增 failed evaluator 记录创建与处理（#563）、[fix][evaluation] 新增 OpenAPI extra_output 字段并修复两处水平越权（6/25）、[docs][all] 初始化「AI coding harness」文档（#566，6/29）、[fix][evaluation] 实验名格式校验（#567）、[fix][backend] 给 ListSpansRepeat 加 MaxBytes 限制防止过大响应（#568，6/30）——方向是评测能力增强 + 安全越权修复 + 为「AI coding harness」铺文档；而 coze-studio 本窗口 0 commit（最近 push 2026-04-20，最新 release 仍是 v0.5.1，2026-02-05），开源主战场已明显转向 coze-loop。

商业化 / 企业版：扣子官方于 2026 年 6 月 2 日（背景，非本周）发布《企业版套餐定价调整》公告，但新价格于 2026 年 7 月 13 日 12:00 AM 起生效，恰是本期窗口后的临界事件——企业标准版 ¥498/月 → ¥980/月（默认席位 2 → 5，超出席位 ¥29/个/月；月度积分 13.8 万 → 34.5 万；版本费 ¥360 → ¥490），企业旗舰版 ¥5,980/月 → ¥8,980/月（默认席位 20 → 30；月度积分 138 万 → 207 万；版本费 ¥4,600 → ¥6,040）；旧团队版 / 企业版即日起不再支持按年续费，12 月 31 日下线。企业版权益绑定扣子 3.0：接入自定义模型、Seedance2.0 视频创作、云手机 / 云电脑、多 Agent 与项目协作（连接本地 Agent 数量不限，每项目最多 50 协作者）、行业技能包（自媒体 / 金融 / 法律 / 科研 / 电商）。

背景（非本周）：扣子 Coze 3.0 于 2026-06-01 全端上线（iOS / Android / Mac / Windows / coze.cn），核心是「项目空间」+ 多人多 Agent 协作，并支持一键接入本地 Claude Code / Codex CLI / OpenClaw，及云端 Agent（云电脑常驻）。技术与商业路线判断：字节走「上层扣子空间聚合 Agent 生态 + 底层 Studio / Loop 开源立标准」的双层策略；本周信号是它把开源重心押在 Coze Loop（Agent 评测 / 可观测 / 优化）——这是 agent 工程化最缺的一环，同时用企业版大幅提价（近翻倍）为扣子 3.0 的企业级能力变现。

关键数据：coze-loop GitHub Stars 5,569 / Forks 769 / 最近 push 2026-07-01、窗口内 5 次 commit（GitHub API repos/coze-dev/coze-loop，查于 2026-07-02）；coze-studio Stars 21,079 / Forks 3,067 / 最新 release v0.5.1（2026-02-05）/ 窗口内 0 commit（GitHub API repos/coze-dev/coze-studio）；企业版定价标准版 ¥498 → ¥980、旗舰版 ¥5,980 → ¥8,980，生效 2026-07-13、公告日 2026-06-02，来源 [扣子企业版定价调整公告](https://docs.coze.cn/guides_enterprise_plan_pricing_adjustment)；扣子 3.0 上线 2026-06-01，来源 [IT之家报道](https://www.ithome.com/0/958/372.htm)。

原文链接：[coze-loop releases](https://github.com/coze-dev/coze-loop/releases)、[扣子企业版定价调整公告](https://docs.coze.cn/guides_enterprise_plan_pricing_adjustment)、[IT之家报道](https://www.ithome.com/0/958/372.htm)。

影响判断：企业版近翻倍提价（标准版 +97%、旗舰版 +50%）是字节把扣子 3.0 从「引流免费」转向「企业级变现」的明确拐点，7/13 生效前会催生一波续费抢闸。开源侧押注 Coze Loop（评测 / 可观测）而非 Studio，说明字节判断「agent 质量与优化」是差异化护城河，与 Databricks 的 Agent Bricks 评测 / 调优、Dify 的 observability 强化形成同一赛道正面竞争。

---

### n8n 与 Flowise：都在拥抱 MCP

本期窗口（6/25–7/1）n8n 与 Flowise 均有版本发布落在窗口内，纳入本期。

n8n：稳定版 n8n@2.28.4 于 2026-07-01 发布，同日还推进多个 pre-release（2.29.1 / 2.29.2）。2.28.4 的 Agent 相关要点：AI Agent Node 修复「在 chat memory 中保留并行 tool call 结构」（#33307）、「在预执行权限检查中跳过 AI Gateway 托管凭证」（#33278）、新增 N8N_RUNNERS_ALLOW_TRANSITIVE_IMPORTS 供 Python task runner 使用（#33266）、editor 在 add-node 搜索里浮出 Human review 节点（#33317）；2.29.2 把 AIA v3（AI Agent 新版体验）设为默认空状态（#33361）——n8n 正持续加固其「原生 AI / AI Gateway + Human-in-the-loop」能力。

Flowise：flowise@3.1.3 于 2026-06-25 发布（正好窗口首日）。最亮点是 feat: turn chatflow into MCP server（#5930）——把 Flowise 的 chatflow 直接暴露为 MCP 服务器，接入 MCP 生态；此外 agentflow 增加 client-specific knowledge fields for agent nodes（#6226）、Start 节点表单输入的 client 过滤（#6212）、FlowConfigDialog UI 重设计（#6229）、修复 clickjacking（#6185）、修 chatflow MCP schema 生成中畸形 form option 元数据（#6233）。值得注意：3.1.3 大量 PR 来自带 -wd / -workday 后缀的贡献者（jocelynlin-wd、abdullah-workday、jchui-wd 等），印证 Workday 已于 2025-08-14 收购 Flowise（背景，非本周），开源仓库现由 Workday 团队主导维护。

技术与商业路线判断：两者都在窗口内把重心压到「agent + MCP 协议 + 治理凭证」——n8n 走「AI Gateway 托管凭证 + AIA v3」的企业治理路线，Flowise 走「chatflow 变 MCP server」的协议互操作路线，反映开源 Agent IDE 正从「可视化编排工具」升级为「可被更大 agent 生态调用 / 治理的节点」。

关键数据：n8n GitHub Stars 194,830 / 最近 push 2026-07-02 / 最新稳定版 n8n@2.28.4 发布 2026-07-01（GitHub API repos/n8n-io/n8n 与 releases，查于 2026-07-02）；n8n 融资 Series C 1.8 亿美元、累计 2.4 亿美元、估值 25 亿美元（2025-10 背景）；Flowise GitHub Stars 54,176 / 最新版 flowise@3.1.3 发布 2026-06-25（GitHub API repos/FlowiseAI/Flowise）；Workday 收购 Flowise 公告 2025-08-14（背景，客户含 Accenture / AWS / Deloitte / Publicis / Thermo Fisher）。

原文链接：[n8n releases](https://github.com/n8n-io/n8n/releases)、[flowise@3.1.3 release](https://github.com/FlowiseAI/Flowise/releases/tag/flowise@3.1.3)、[diginomica: Workday acquires Flowise](https://diginomica.com/workday-acquires-flowise-build-ai-agents-people-dont-want-ai-bosses)。

影响判断：Flowise「chatflow → MCP server」把开源 Agent IDE 变成 MCP 生态的可复用节点，是 MCP 从「客户端接工具」扩展到「编排平台自身即工具」的信号；叠加 Workday 背书，Flowise 正从社区玩具走向企业级 agent builder。n8n 194k Stars 稳居开源自动化第一，AIA v3 设为默认体现其 all-in AI Agent 的战略决心，与 Dify / Coze 在开源 Agent 编排赛道三足鼎立。

---

### 数据、开源与中国：三条主线

本周 C 组四大对象呈现高度一致的三条主线。

其一，「治理与评测」成为 Agent 工程化的新主战场：Databricks 用 Unity AI Gateway 把治理从「谁能访问数据」推进到「agent 能做什么」（Contextual Service Policies、PII / prompt injection 防护、跨 provider 预算硬上限），字节把开源重心从 Coze Studio 转向 Coze Loop（评测 / 可观测 / 优化），Dify 深化 Phoenix trace 与文档检索可观测——三家不约而同押注「agent 质量与可控性」，说明行业已过「能不能做 agent」阶段、进入「如何让 agent 可信可治理」深水区。

其二，MCP 协议成为开源 Agent IDE 的标配互操作层：Flowise 3.1.3 直接把 chatflow 变 MCP server，n8n 加固 AI Gateway 托管凭证，Databricks 提供 Google Drive / Jira / Slack / GitHub 托管 MCP 服务，MCP 正从「客户端接工具」扩展到「平台即工具」。

其三，中国 Agent 平台走「开源立标准 + 企业版变现」双轨：字节扣子 3.0 用免费全端引流、企业版 7/13 近翻倍提价（标准版 +97%）收割企业级能力，同时用 Coze Loop / Studio 开源吸引生态；这与 Dify（147k Stars，difyctl CLI 化打企业自托管）的开源商业化路径同频。总体判断：2026 年中，Agent 基础设施竞争焦点已从「编排能力」转向「治理、评测、协议互操作」三位一体，谁能同时提供开放生态 + 企业级可控性，谁就掌握下一阶段话语权。

---

## 本周 TOP 5 信号

按对基础设施格局的信号价值排序：

1. **AWS AgentCore 一整排组件同周 GA**——Web Search / Managed KB / Harness / 评估三件套一次性转 GA + Gateway 统一治理面 + WAF / SOC 合规，标志托管 Agent 平台从「预览拼装」正式进入「生产平台」阶段，是本周对格局影响最大的单一事件。
2. **三大云厂同步跨进生产 GA 下半场**——AWS、Google（Vertex 收编进 GEAP + 语义治理 SGP）、微软（Hosted Agents 临 GA + MAF 统一 SK/AutoGen）三线并进，竞争正式转入「治理 + 分发 + 变现」下半场。
3. **Anthropic 模型因 cyber 能力遭出口管制、一度全球下线又复活**——前沿 Agent 能力首次因政府管制导致企业级可用性中断，把「监管中断风险」推成 Agent 选型的一等考量。
4. **「子代理」范式跨厂商共识化**——OpenAI GPT-5.6 ultra mode 与 LangChain Deep Agents 动态子代理同周撞车，「运行时按需生成子代理」从框架特性变为行业共识，挤压通用编排框架价值。
5. **字节扣子企业版近翻倍提价 + 开源押注 Coze Loop**——标准版 +97%、旗舰版 +50%（7/13 生效），配合开源重心从 Studio 转向评测平台 Coze Loop，是中国 Agent 平台「开源立标准 + 企业变现」双轨策略的清晰拐点。
