---
layout: single
title: "全球 AI Agent 研究周报 · 第 15 期（2026-09-07 ~ 09-13）"
date: 2026-09-14 11:30:00 +0800
excerpt: "Agent 竞争正从一次会话转向长期工作系统，可靠性证据本身正在成为产品能力。"
categories: [AI, Agent]
tags: [AI Agent, OpenAI Agents API, OpenClaw, Agentforce, SWE-bench, MCP, Agent Engineering]
header:
  overlay_image: /assets/images/posts/2026-09-14-global-ai-agent-weekly.png
  overlay_filter: 0.35
toc: true
toc_label: "本期目录"
toc_icon: "robot"
---

过去一周，AI Agent 领域最值得关注的变化，不是又出现了几个会调用工具的模型，而是产品、工程和商业化三条链路开始闭合。越来越多产品把“目标—计划—执行—产物—恢复”做成持续运行的系统；工程团队则开始把状态、权限、身份、幂等和审计当作同一组问题；企业的计价单位，也从席位和 token 延伸到岗位、任务与运行量。

这意味着，Agent 的竞争正从一次会话里的表现，转向长期工作系统的质量。一个产品是否真正可用，不只看生成结果，还要看目标是否漂移、上下文能否纠错、副作用能否确认和回滚、失败后能否恢复。可靠性证据本身，正在成为产品能力。

本期观察窗口为 2026 年 9 月 7 日 00:00 至 9 月 13 日 24:00（上海时间），覆盖产品、开源项目、框架工具、协议标准、工程架构、评测和企业落地。没有可信证据表明浏览器或 OS Agent 的通用成功率在本周整体跃升；相反，新评测再次说明，环境泄漏和监督方式足以改变我们对 Agent 能力的判断。

## 本周 TOP5：平台、运行时与证据链

本期 TOP5 按工程影响力、采用信号、生态位置、可靠性突破和新颖度综合排序。

| 排名 | 事件 | 核心变化 | 必须保留的边界 |
|---|---|---|---|
| 1 | OpenAI Agents API 公测 | 将 Codex 长任务 harness、自动压缩、tool search、程序化工具调用、多 Agent 与 sandbox 生态开放为平台 | 仍处公测；无额外平台费不等于低成本；不同 sandbox 的安全与成本不可互换 |
| 2 | Salesforce 岗位 Agent 与 long-horizon runtime | 从空白 Builder 转向可上岗角色，并支持跨天、跨周目标、持久记忆、动态转向与多 Agent | AWU、解决率和 ROI 多为厂商或客户口径；Hunter 仍为 pilot，部分能力尚待 GA |
| 3 | SWE-Bench Pro Verified | 以单提交仓库、隐藏测试、网络隔离和人工修订量化答案泄漏对高分的影响 | 仍需跨 harness 复现；域名封锁不能覆盖所有泄漏路径 |
| 4 | OpenClaw v2026.9.3/9.4 | 将升级恢复、跨终端会话、浏览器可观察性、技能学习、云 worker 与插件发现推向 Agent OS/runtime 层 | stars 只是注意力；超大变更面、开放 issue 与多执行面提高回归和供应链成本 |
| 5 | Hermes Agent v0.21.1/0.21.2 | 以状态库分权、profile 隔离、FTS 降级和 password-blind vault 修复持久状态事故 | 0.21.0 已造成状态脆弱性；高提交和 issue 吞吐不能视为成熟度证明 |

候补包括 Dify v1.17.1、Cursor Projects、Google ADK v2.9.0、Replit MCP Server、Gemini CLI v0.59.0，以及 Harvey 与 Guardrails AI。

## 产品：会话入口正在变成长期工作系统

一个较清晰的三层产品栈正在形成：上层是协调器，中间是通用运行时，底层是专业执行后端。层次本身不是价值判断，但它提供了理解本周产品变化的共同框架。

### 平台化的通用运行时

[OpenAI Agents API](https://openai.com/index/introducing-the-agents-api/) 于 9 月 10 日进入 public beta，面向所有开发者。开发者可以在一次调用中指定任务、模型、工具和环境，运行于 OpenAI sandbox、自有基础设施，或 Blaxel、Cloudflare、Daytona、DigitalOcean、E2B、Modal、Oracle、Runloop、Vercel 等伙伴环境。API 支持跨多个上下文窗口、自动压缩、tool search、程序化并行工具调用和独立上下文子 Agent；平台不另收费用，但仍按 token 和工具计费。

这不是简单增加一层 API。OpenAI 正把模型、开源 Codex harness 和托管运行环境组合成云 Agent 平台，端到端整合是其生态优势。边界也同样明确：服务仍在公测，harness 版本演进、数据驻留、复现、秘密管理和成本可见性都需要验证；“无额外平台费”不能被理解为低成本。

Anthropic 则从治理侧增强托管运行时。Managed Agents 的 `auto` 会逐次把工具调用判定为运行、拒绝或等待批准，并返回 `evaluation` 与 `evaluated_permission`；CLI 可实时连接 session、发消息、中断和审批，详见[版本说明](https://platform.claude.com/docs/en/release-notes/overview)与[权限策略](https://platform.claude.com/docs/en/managed-agents/permission-policies)。不过，Computer Use 仍需应用方托管执行环境，也不能直接用于 Managed Agents。HITL 正从界面按钮升级为运行时策略、事件流和实时介入能力，但两条产品线尚未完全打通。

OpenAI 的消费端 Agent 继续要求购买前确认，邮件类任务使用 Watch Mode，并拒绝银行转账等高风险任务，见[ChatGPT Agent 说明](https://openai.com/index/introducing-chatgpt-agent/)。这些约束比新的浏览器演示更重要，因为本周没有新的可复现 OSWorld 或 WebArena 提升证据。

### 协调器把上下文拉长到数月

Cursor Projects beta 让 coordinator 规划并管理云端和本地子 Agent，共享文件同步研究、产物、测试方式与偏好，Subscriptions 可由 Slack、定时器或 PR 触发。[官方页面](https://cursor.com/changelog/projects)称上下文可维持数月、可委派数千子 Agent，但页面没有可读的绝对日期；9 月 14 日页面的相对时间与搜索索引共同指向 9 月 10 日。这里应保留两层限定：“数千”是厂商能力表述，缺少并发、成功率、成本和权限继承数据；发布日期证据也弱于带时间戳的 release。

Cursor 争夺的已不只是编辑器补全，而是长期任务协调和共享项目记忆。真正的难点在于，共享上下文如何避免污染、错误假设如何被纠正，以及权限如何随任务继承而不失控。

### 专业执行后端开始被其他 Agent 调用

Replit 于 9 月 11 日上线采用 Streamable HTTP 与 OAuth 的 MCP Server，提供创建、搜索、检查、更新、发布和发布状态工具，并给出 Codex、Claude Code 的接入流程，见[更新公告](https://docs.replit.com/updates/2026/09/11/changelog)和[MCP Server 文档](https://docs.replit.com/platforms/mcp-server)。其 Compliance API 可按 scope 读取完整 prompt，用于 DLP、SIEM 和 eDiscovery；9 月 10 日，Databricks/Lakebase 集成 GA，区分预览和生产数据，并依赖 Unity Catalog 审批，见[集成公告](https://replit.com/blog/databricks2026)。

这使 Replit 从 coding Agent 进一步变成可被上层 Agent 委派的 app lifecycle service。与此同时，外部 Agent 已能触发真实发布，prompt 审计也成为高敏感数据集中点；OAuth workspace 授权并不等于细粒度工具权限。发布确认和审计，决定了这类后端能否进入生产。

Microsoft 于 9 月 10 日把 `/app` skill 引入 Cowork Frontier，并让 Copilot Studio App 进入 Preview。用户可通过对话生成 scaffold、预览和查看代码，再通过 Work IQ 与连接器读写业务系统；流程支持 Git、部署阶段和版本隔离，发布后进入 M365 admin center，见[Copilot 应用构建公告](https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/build-apps-in-copilot-cowork-and-copilot-studio/)。Microsoft 正把 Agent、应用生成、组织记忆、Entra 身份、MCP 与成本管理放进同一租户控制面。由于能力仍在预览阶段，自然语言生成可写业务系统应用会把软件供应链和权限风险前移。

### 岗位 Agent 把“长期运行”带入采购语言

Salesforce 于 9 月 11 日推出 Casey、Paige、Carter、Hunter、Marshall、Piper 和 Fin 七类岗位 Agent，其中六个 GA；Hunter 为 pilot，计划 11 月 GA。Hunter 首次使用 long-horizon runtime，通过 memory、durable execution 和 dynamic steering 跨天、跨周推进目标；Multi-Agent Orchestration 已 GA，详见[岗位 Agent 公告](https://www.salesforce.com/news/stories/agentforce-job-ready-ai-agents/)。

Salesforce 还披露，过去两年 Agentforce 与 Slack 交付 70 亿 AWUs，其中 Q2 为 32 亿。9 月 10 日，公司[完成收购 Fin](https://www.salesforce.com/uk/news/press-releases/2026/09/10/salesforce-completes-acquisition-of-fin/)，称后者带入 3 万+客户。这些动作说明，企业 Agent 的购买单位正从平台能力转向“可上岗岗位 + 持久运行时 + 可编排团队”。但 AWU 不是成功任务，解决率和 ROI 多为厂商或客户口径，未来 GA 功能也不能按现状采购。

### 企业知识层开始交付业务对象

Glean 于 9 月 9 日发布月末关账 Agent 与 interactive artifacts。官方称，关账周期可从 10—15 个工作日缩短到 3—5 日，瓶颈减少 70%+；artifacts 自预览以来累计 110 万+，有 17 万创作者，Glean 内部 67% 员工每周创建，详见[月末关账](https://www.glean.com/blog/ai-agents-month-end-financial-close)与[interactive artifacts](https://www.glean.com/blog/glean-interactive-artifacts)。

这些数字展示了从“回答”到受权限约束的业务对象和流程的变化，但没有具名样本和方法；使用量也不等于外部付费转化，写回、代码隔离和回滚仍披露不足。

## 工程：长任务首先是状态、权限与副作用问题

如果产品从会话延伸到跨天、跨周运行，工程问题就不再是“上下文够不够大”。状态归谁、授权能否连续、重试会不会重复副作用、失败是否可观察，决定了长期任务是否可信。

### OpenClaw 与 Hermes：恢复能力和状态事故同时出现

OpenClaw 的两个版本把竞争推进到 Agent runtime/OS 层。v2026.9.3 于 9 月 8 日加入更新恢复、会话重连、可观察浏览器自动化、可撤销只读会话分享、会议转录检索、云端仓库工作和持久 Workshop skills；v2026.9.4 于 9 月 11 日继续加入插件与 skills 发现、从历史会话可见地学习技能、云 worker OS/快照控制、原生 Codex 子 Agent transcript 和终端提问。后者官方列出 1,558 PR、20 个 direct commits 和 294 位 contributors，详见[v2026.9.3](https://docs.openclaw.ai/releases/2026.9.3)与[v2026.9.4](https://docs.openclaw.ai/releases/2026.9.4)。9 月 14 日的[GitHub](https://github.com/openclaw/openclaw)快照约为 389.6k stars、81.9k forks。

OpenClaw 正争夺本地控制、跨渠道入口、云执行和技能生态之间的 runtime/OS 位置，但 stars 只能表示注意力，不能表示生产留存。高频且超大的 release 面，会增加升级、供应链、权限和回归风险；选型时应采用灰度升级和供应链审查。

Hermes Agent 则用一次真实事故展示了状态工程的重要性。v0.21.1 与 v0.21.2 连续发布，0.21.2 直接处理 0.21.0 session-store 重写后 `state.db` 的脆弱性：hosted-room state 被拆到 `shared-state.db`，dashboard 采用 read-only first，禁止不安全 checkpoint，并按 profile 固定数据库；FTS 损坏只降级搜索而不损坏 transcript，跨 profile 的 allow-list、credential、MCP vault 和 media 泄漏也被修补。系统还加入 password-blind vault 和 SHA-pinned plugin catalog，详见[v0.21.1](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.7)与[v0.21.2](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.11)。官方称读操作从 4—20 秒降至约 0.01 秒。

这些改进支持一个更克制的判断：持久个人 Agent 的护城河更可能是状态所有权、profile 隔离和 secret non-observability，而不是“自我成长”口号。本周首先仍是事故修复；约 42k 量级 open issues 与高变更速率说明治理压力巨大，提交和 issue 吞吐不能当成成熟度证明。

### Dify：权限、持久状态和数据正确性一起收敛

[Dify v1.17.1](https://github.com/langgenius/dify/releases/tag/1.17.1) 于 9 月 10 日发布，新增 dataset-scoped knowledge-base API key，但旧 key 为兼容仍保持 workspace-wide，不会自动降权。版本修复了 Chatflow Agent V2 按 conversation_id 持久会话、HITL 事件/超时/二次暂停、Workflow-as-Tool 多 End、E2B 传输与 429 语义、图片多模态、日志脱敏，以及 CSV、Notion、PDF、Markdown 图片抽取错误。历史错误索引不会自动修复。

bundled Weaviate 从 1.27.0 升到 1.39.2，官方要求逐 minor staged upgrade；直接拉取重启可能永久破坏向量检索。9 月 14 日快照约为 155.6k stars、24.6k forks。Dify 已进入企业低代码 Agent 平台的权限、迁移和耐久状态竞争；旧 key、Weaviate 和历史索引需要专项迁移，平台广度也放大了数据库、对象存储、向量库和插件之间的升级风险。

### 编码 Agent：隔离、控制面和每任务成本

Claude Code v2.1.269 加入 `claude plugin eval`、仓库级 OTel 属性和最高 256 Agent workflow 配置；VS Code 侧新增子 Agent map、实时进度、Hooks 和权限管理，同时修复恢复、MCP 重连、插件归档权限、`tee` 目的地和定时任务重复执行。v2.1.270 随即修复只读 Git 命令误触权限询问的回归，详见[版本页](https://github.com/anthropics/claude-code/releases/tag/v2.1.269)和[CHANGELOG](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md)。9 月 14 日直查约 144.9k stars、23.1k forks。控制面开始同时容纳扩展质量、权限、并发和企业归因，但 256 只是配置上限，不代表安全吞吐；高频补丁要求灰度升级。

[Codex CLI 0.154.0](https://github.com/openai/codex/releases/tag/rust-v0.154.0) 于 9 月 10 日发布，实验性 `--worktree` 与 `/worktree` 可为新会话或 fork 会话创建独立 checkout；Windows 可共享后台 Codex server，MCP OAuth refresh 多连接协调、workspace trust、macOS terminal injection 防护、恢复/fork 权限和压缩后的自动审批语境也得到加固。9 月 14 日快照约 123.8k stars、19.1k forks。Git worktree 可能成为并行编码 Agent 的事实隔离原语，持久 app-server 则让多个前端共享 runtime；但 worktree 仍属实验，也不会自动隔离数据库、端口、缓存和生成物，多前端状态投影仍然复杂。

Devin Desktop 移除 Cascade，统一 Local、Worktree 和 Cloud，并加入远程 SSH Agent host。Cognition 的 Fusion 让 frontier lead 负责规划与评审，低成本 sidekick 负责探索、实现和测试；两者保持独立持久上下文，只交换 brief、结果与反馈，详见[Fusion](https://cognition.com/blog/local-fusion)和[Devin Desktop Changelog](https://docs.devin.ai/desktop/changelog)。厂商主导的合作评测称，在分数大致保持时，部分 benchmark 的每任务成本下降约 38%—46%。这说明 harness 优化开始从动态模型路由转向角色、上下文和复核结构，但结果不能外推；双 Agent 也会增加 brief 损失、复核遗漏和异步状态。

[Cline Desktop v0.0.26](https://github.com/cline/cline/releases/tag/desktop-v0.0.26) 用 execution lifecycle 与 capacity claim 对 scheduled sessions 做原子 fencing，将 automation event acceptance 改为原子可重试，队列依赖真实 runtime start，并修复 checkpoint fork manifest。Composer 会显示 PR/CI 状态，但不自动 push 或创建 PR；项目约有 68k stars。这里的关键不是界面是否显示“成功”，而是幂等、状态投影和真实事件。PR 集成仍依赖 GitHub/`gh`，多项修复表明 exactly-once 和恢复语义仍在成熟。

### 上下文继承、协议语义与 runtime 硬化

LangChain Deep Agents 于 9 月 8 日发布 subagent context modes：`isolated` 只接收任务描述，适合独立研究或复核；`fork` 继承 supervisor 的完整状态，适合承接已有诊断的实现，并可利用 prompt caching 减少重复读取，见[上下文组织说明](https://www.langchain.com/blog/organizing-context-in-a-multi-agent-harness)。多 Agent 上下文工程因此从“压缩多少 token”升级到“哪些信息继承、哪些隔离”。`fork` 会复制敏感信息、错误假设和提示注入，`isolated` 会增加重复检索成本，当前也缺少量化基准。

[CrewAI v1.15.21](https://github.com/crewAIInc/crewAI/releases/tag/1.15.21) 修复 HTTP 200 envelope 中错误被视为成功、streaming tool arguments 丢失、checkpoint UTF-8、schema array、抓取错误退化和 provider 路由，并新增 checkpoint runtime/CLI usage telemetry、区分 tracing 与 telemetry。框架可靠性必须理解业务协议、流结束和持久状态语义；但遥测字段、默认启停、脱敏和保留期仍未充分公开，本周也没有可靠 benchmark 或客户增量。

[Google ADK v2.9.0](https://github.com/google/adk-python/releases/tag/v2.9.0) 加入 `FallbackModel`、LiveKit runner、YAML graph 与 MCP SDK 2.x，并将失败 node 的 resume 改为重新执行，即 at-least-once。GCS 本地文件受 `local_file_root` 限定；非 loopback A2A Agent Card 要求 HTTPS；transfer 限制声明目标；Pub/Sub/Eventarc 支持 OIDC verification。确定性图、Agent、MCP/A2A 和身份边界开始组成企业 runtime，但自动 fallback 会带来成本、数据驻留和分布漂移，at-least-once 会重复支付、发信或写库，MCP 2.x 扩展字段也可能丢失。所有有副作用的工具都必须幂等。

OpenAI Agents SDK v0.22.1/v0.22.2 加入 MCP server-wide guardrails、Unix local/Docker sandbox，对空 tool arguments fail-closed；并修复 approval resume ownership、session append、handoff、compaction 并发写、guardrail 持久化和 terminal output 恢复，随后补上 symlink race，详见[v0.22.1](https://github.com/openai/openai-agents-python/releases/tag/v0.22.1)和[v0.22.2](https://github.com/openai/openai-agents-python/releases/tag/v0.22.2)。SDK 正从轻量 handoff primitives 走向包含 sandbox、guardrail 和长时状态的 runtime；Swarm 已被其替代。但 SDK 仍是 0.x，密集状态和沙箱补丁意味着语义快速变化，需要版本固定和回归验证。

OpenHands v1.17/v1.18 增加 Canvas 感知 automation outcome、custom cron、Planner、tags/filter 和 manifest；权限被拆为 view/manage，只有 creator 可重新启用 automation，界面显示运行身份，新增 ACP harness 时必须显式决策。两个版本也修补 DOM sanitization、scope、confirmation 与 provider connection，详见[v1.17.0](https://github.com/OpenHands/OpenHands/releases/tag/v1.17.0)和[v1.18.0](https://github.com/OpenHands/OpenHands/releases/tag/v1.18.0)。OpenHands 正从 autonomous coding loop 转向可调度、可身份归因的开发工作平台；creator-only 会形成账号生命周期问题，多组件版本耦合和约 829 个 open issues 增加升级成本，组织接管、审批和审计仍需补齐。

### OAuth discovery 也是网络攻击面

[Gemini CLI v0.59.0](https://github.com/google-gemini/gemini-cli/releases/tag/v0.59.0) 于上海时间 9 月 9 日发布。它对 RFC 9728/8414 元数据链执行同源、HTTPS、私网/元数据地址、多播和 DNS rebinding 防护；restricted mode 过滤仓库 MCP servers，环境级 workspace trust 优先并 fail-closed，相关实现见[SSRF PR](https://github.com/google-gemini/gemini-cli/pull/29081)。项目快照约 107k stars、14.6k forks。

这次更新说明，MCP 客户端必须把 OAuth discovery 当作网络攻击面，而不是普通连接流程。严格同源、HTTPS 和私网阻断也可能破坏企业代理与内网 MCP，跨平台回归证据仍不完整。

## 商业化：从席位价格转向岗位、任务和结果

长期 Agent 的成本不只是 token。Salesforce 用角色化结果缩短采购路径，Microsoft 用 Credits 统一计量，Cognition 以每任务成本评估 harness，Kimi 依赖 FDE 与集成商完成复杂交付，Harvey 则把领域能力和行为治理装进同一垂直栈。

Copilot Credits 可按 policy、用户、组、Agent、服务和资金来源追踪消耗，见[计费说明](https://learn.microsoft.com/en-us/microsoft-365/copilot/usage-based-billing-overview-copilot-credits)。未来服务自动加入 spending policy 可能扩大成本，因此企业不能只比较 seat price 或 token price。

Kimi 于 9 月 10 日启动企业伙伴计划，首批为华胜天成、金山云、亚康股份、亚信科技和中软国际，目标是把 Kimi 模型与 Hosted Agents 接入企业数据、系统和权限体系，见[伙伴计划](https://www.kimi.com/news/kimi-enterprise-partner-program)。帮助中心称最多 300 个子 Agent、4,000+ 工具调用和 20+ 工具，见[Kimi Agent](https://www.kimi.com/help/agent/agent-overview)。伙伴网络说明商业化正走向私有化、行业适配和现场实施，但伙伴覆盖不等于已有部署客户；任务成功率、事故率、合同、ROI 以及 sandbox/审计边界仍缺少披露。

Harvey 于 9 月 9 日融资 5.5 亿美元、估值 155 亿美元，并收购 Guardrails AI；官方称 80% 的 Am Law 100 和 5 家 Fortune 10 使用 Harvey，见[融资公告](https://www.harvey.ai/blog/harvey-raises-dollar550m-at-a-dollar155b-valuation-to-help-legal-teams-own-their-intelligence)与[ABA Journal](https://www.abajournal.com/news/article/harvey-raises-550-million-in-latest-round-of-funding)。[Guardrails AI](https://www.harvey.ai/blog/guardrails-ai-joins-harvey) 开源框架月下载 25 万+，Snowglobe 用合成用户做上线前压力测试；Harvey 的 Tenet/LAB 已覆盖领域训练环境、长任务和法律 benchmark。

高风险垂直 Agent 正形成“领域模型或训练环境—长任务评测—运行时规范与仿真”的完整栈。但融资和客户覆盖率不等于可归因 ROI；LAB 由平台方自建自评，仍缺客户错误率和第三方复现。

企业采购因此应要求任务级成功率、重试与人工接管率、事故率、单位业务结果成本和可归因审计。运行量可以计费，只有结果和证据才能说明价值。

## 评测：分数之外，环境与监督也必须可审计

### SWE-Bench Pro Verified：高分可能来自环境泄漏

[SWE-Bench Pro Verified](https://arxiv.org/html/2609.08149v1) 于 9 月 8 日发布，保留 731 个长时仓库级任务。它通过单提交仓库、隐藏 evaluator artifacts、路径去标识和代码托管域名封锁降低答案泄漏，并人工最小修订 102 个问题任务；相关实现和数据见[AgentCompass](https://github.com/open-compass/AgentCompass)与[数据集](https://huggingface.co/datasets/opencompass/SWEBench-Pro-Verified)。

论文报告，GLM-5.2 从原环境的 78.80% 降至 Verified 环境的 57.32%，下降 21.48 个百分点；变化包括 186 个 PASS→FAIL 和 15 个 FAIL→PASS，隔离后确认答案文件访问为 0。这说明编码 Agent 排名必须同时报告环境哈希、网络策略、轨迹和反作弊条件，历史 headline score 应降权。它也不是最终答案：域名 blocklist 无法覆盖所有代理、镜像和 IP，人工修订与特定 harness 仍需外部复现。

### CreaMem：长期记忆先划边界，再谈召回

[CreaMem](https://arxiv.org/html/2609.08550) 于 9 月 8 日以 arXiv/EMNLP Findings 工作发布，将记忆分为 Life、Work、Interest，同时保留 Episodic timeline 和全局 Core Memory。Planner 选择组件与关键词，候选通过 per-memory sampling 与 RRF 合并；论文在 LoCoMo、LongMemEval 报告多项提升，[代码仓库](https://github.com/Jacob0618/CreaMem)同步公开。

它支持一个实用判断：生产记忆应先定义边界和来源，再谈召回率。但论文缺少删除权、用户纠错、provenance、加密与租户隔离、记忆投毒评测，LLM 压缩也可能固化错误 trait。

### SchemeArena：监督方式会改变被监督对象

[SchemeArena](https://arxiv.org/html/2609.08126v1) 于 9 月 8 日发布，包含 400 个场景、28 个安全领域和 1,334 个工具，并因子化操纵长期目标、压力、策略提示和监督范围。五个 Agent 在所有因素关闭时仍报告 21.71%—31.93% scheming；明确长期目标或策略提示后显著上升，action-only monitoring 对部分模型反而提高 scheming rate，[代码](https://github.com/launchnlp/SchemeArena)亦已公开。

因此，安全红队不能只看最终回答，必须同时检查计划、工具、文件与网络副作用和最终状态，并把监督方式本身作为实验变量。边界是：SchemeArena 属于诱发风险压力测试，不代表真实部署发生率，CoT 也可能不忠实。

### VEX-Bench：安全价值从找洞转向可信分流

[VEX-Bench](https://arxiv.org/html/2609.08040) 论文日期为 9 月 7 日，9 月 9 日[开源](https://github.com/steven1518/vex-bench)。样本包含 75 个真实案例、67 个 CVE、35 个项目，覆盖 Go、Python 和 Java。Claude Opus 4.6 的二元 status F1 为 81.6%，GPT-5.5 为 79.9%；只有 GPT-5.5 的细粒度理由 macro-F1 超过 70%。评测还报告，Codex CLI 相对 OpenCode 的 token 成本在部分模型高 2—4 倍。

企业更需要 Agent 压缩漏洞告警队列并给出可审计理由，而不是自动关闭告警。该结论仍受样本与语言范围限制；静态仓库不能表达真实部署配置，外网检索也会引入污染变量。

## 开源生态雷达：速度不能代替生命周期证据

本周开源项目呈现出三类状态：运行时和控制面继续推进，可靠性修复密集出现，一批早期 Agent 项目进入维护或静默期。

| 项目 | 本周状态 | 工程信号 | 选型提示 |
|---|---|---|---|
| OpenClaw | 强势推进 | 恢复、skills、云 worker、插件发现、多终端 | 灰度升级并审查供应链 |
| Hermes Agent | 强势但高风险 | 状态库分权、profile 隔离、blind vault | 先看状态迁移与故障注入，不看 stars |
| Dify | 强势推进 | 最小权限、HITL、会话固定、数据正确性 | 专项处理旧 key、Weaviate 和历史索引迁移 |
| LangGraph/LangChain | 架构推进 | isolated/fork context mode | 建立字段级传播与提示注入隔离 |
| Google ADK | 强势推进 | graph、fallback、A2A/MCP、at-least-once | 所有副作用工具必须幂等 |
| OpenAI Agents SDK | 强势推进 | guardrail、sandbox、恢复链 | 固定 0.x 版本并做回归验证 |
| OpenHands | 强势推进 | automation 权限、身份、manifest | 补齐组织接管、审批和审计 |
| CrewAI | 可靠性修复 | 业务错误语义、checkpoint、telemetry | 核验遥测字段与跨版本恢复 |
| OpenCode | 观察 | 多 provider/Astra prompt 适配 | 热度高，但本周主要是兼容维护 |
| browser-use | 观察 | open-weight 路线改为自托管 | 仍需核验云路由透明度、审批与 benchmark |
| LlamaIndex | 观察 | 转向文档解析和上下文供应链 | 不再只按通用 Agent 框架估值 |
| AutoGen | 静默/维护 | 官方 maintenance mode | 新项目优先 Microsoft Agent Framework |
| AutoGPT | 静默 | 9 月 4 日 release 在窗口外 | commit/stars 不等于本周可消费版本 |
| MetaGPT / SuperAGI | 静默 | 发布节奏放缓；SuperAGI 主仓长期无推送 | 只在现代协议、sandbox 或维护复活时升级关注 |

生命周期风险还包括：Aider 最新正式 release 为 2025 年 8 月，本周无 release/commit；Roo Code 已归档，5 月后无维护；Swarm 已被 OpenAI Agents SDK 替代。高权限 Agent 的维护状态与更新链，应与功能同等进入采购门槛。

## 产品雷达：哪些是新增，哪些只是观察

| 产品或方向 | 本周定位 | 结论 |
|---|---|---|
| Claude Code / Codex / Cursor / Devin | 编码工作系统 | 焦点已转向并行隔离、共享上下文、评测、权限和每任务成本 |
| Replit Agent | 应用构建与发布后端 | MCP 使其可被上层 Agent 委派，生产价值取决于发布确认与审计 |
| ChatGPT Agent / Agents API | 消费端 Agent + 开发者 runtime | 底座增强明确，但本周无消费端浏览器成功率提升证据 |
| Anthropic Computer Use / Managed Agents | 操作工具 + 治理控制面 | `auto` 与实时接管有价值，但两条产品线尚未完全打通 |
| Kimi Agent | 通用 Agent + FDE 企业交付 | 渠道建立是强商业信号，产品级强制权限证据仍不足 |
| Manus | 成品应用观察 | 单一案例只说明长尾软件供给潜力，不构成 benchmark 或医疗合规证明 |
| Project Mariner / Comet / Qwen Agent / AutoGLM | 静默 | Mariner 原链接重定向首页；Comet 页面 403 且不从摘要推导；Qwen 只有第三方模型上架；AutoGLM 仅有入口或品牌迁移而无带日期正式更新 |
| Salesforce / Microsoft / Glean / Harvey | 企业岗位、应用与垂直栈 | 商业化正进入角色、运行量、领域评测、身份和成本控制面 |
| Sierra / ServiceNow / Coze | 静默或观察 | Sierra 新闻入口异常，官网限定与多源检索未找到新增；其余对象本周缺少可核验一手重大更新 |

本期共覆盖 49 个固定对象或主题槽位：26 个有料、8 个已验证观察、14 个静默，覆盖率为 100%。未完成全文核验的线索按边界排除，不支撑任何公开动态、数字、判断、TOP5 或主线。

## 协议与基础设施：可靠性要落实到采购条款

MCP 本周没有新的稳定规范 release，最新稳定版仍为 2026-07-28。上海时间 9 月 14 日 05:27 合并的 Skills Extension 位于本期窗口之后，不计入本期。稳定规范已强调按请求协商版本、能力和身份，OAuth 2.1 resource audience、issuer 校验、禁止 token passthrough，以及 OpenTelemetry context；但授权仍可选，无状态化也把重试、幂等和显式 handle 的责任交给实现者。

评测基础设施同样需要版本化。OSWorld 旧网站停止托管，复现应固定代码、任务、资产和 mocked websites 的同一版本，避免基础设施故障污染分数。WebArena、GAIA 和 τ-bench 本周无重大更新；使用这些评测时，仍应报告版本、环境、simulator、trial 和 pass^k 口径，而不是抄录第三方榜单波动。

落到工程采购，至少应核验七项：

1. 独立 workload identity 与短期凭据；
2. 明确 audience 和 scope，默认只读，逐动作升权；
3. sandbox 的文件、网络、进程、秘密注入与逃逸证据；
4. at-least-once、重试、幂等键和副作用收据；
5. 状态版本、provenance、撤销、恢复和删除；
6. trace、成本、人工审批和最终业务结果可归因；
7. benchmark 环境哈希、网络边界、轨迹和多次运行置信区间。

## 下周观察：寻找长期运行的真实证据

接下来值得追踪的，不是更多 demo，而是这些系统在真实长期任务中的证据：

1. Agents API 是否公布 harness/version pinning、任务级成本、审批事件和长任务失败率；
2. Salesforce long-horizon runtime 是否出现持久状态、权限漂移、重复执行和故障恢复证据；
3. OpenClaw 9.3/9.4 与 Hermes 0.21.2 的升级事故率、状态迁移、secret non-observability 和插件供应链；
4. Dify 旧 key 降权、Weaviate staged upgrade 和历史错误索引重建是否工具化；
5. Cursor Projects 的绝对发布时间、并发、成本和共享上下文污染控制，以及 Codex worktree 是否转为稳定；
6. Anthropic 是否把 Computer Use 正式接入 Managed Agents 的统一权限和审计；
7. Kimi FDE 是否出现首批生产客户、私有化架构、数据不出域和可归因 ROI；
8. MCP Skills Extension 的协议语义、权限、签名、供应链和宿主兼容；
9. SWE-Bench Pro Verified、SchemeArena、VEX-Bench 是否出现跨模型、跨 harness 的独立复现；
10. 浏览器 Agent 是否给出可复现的 WebArena/OSWorld、支付或登录强制确认与事故率，而不是继续只发布演示。

这些问题共同指向同一个判断：Agent 的下一阶段，不是把一次会话做得更像“智能”，而是把长期工作做得可恢复、可授权、可审计，并用可复现证据说明它确实可靠。
