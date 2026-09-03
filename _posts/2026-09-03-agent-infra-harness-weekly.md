---
layout: single
bucket: agent-infra
title: "全球 AI Agent 基础设施研究周报 · 可恢复边界（2026-08-27—09-02）"
date: 2026-09-03 20:00:00 +0800
categories: [AI]
tags: [AI Agent, Agent Infrastructure, Harness, Runtime]
header:
  overlay_image: /assets/images/posts/2026-09-03-agent-infra-weekly-header.png
  overlay_filter: 0.35
excerpt: "从 OpenClaw、OpenViking、Langfuse 与 Crawl4AI 的窗口内信号，看 Agent Harness 如何从工具循环走向可恢复、可治理的长期进程。"
---

![AI Agent 基础设施控制面示意图](/assets/images/posts/2026-09-03-agent-infra-weekly-header.png)

*图：AI Agent 基础设施控制面概念示意图。来源：本期头图生成稿；不承载额外事实。*

# AI Agent 基础设施周报：竞争转向可恢复边界（2026-08-27—09-02）

本期观察窗口为 **2026-08-27 00:00—2026-09-02 24:00（Asia/Shanghai）**，研究截止 2026-09-03。窗口外信息只作为能力基线；GitHub stars 是 2026-09-03 抓取快照，不代表周增量。

本周没有出现覆盖全行业的新协议发布，却有四个彼此呼应的信号：OpenClaw v2026.8.2 把后台 session、Gateway、浏览器 relay、cloud workspace、升级恢复、权限与 MCP 资源限制拉进一个维护面；OpenViking v0.4.17 让 Context Database 获得跨 SDK、URI、Session、Skill、凭证边界与可观测性；Langfuse 将 evaluator trace 与摄入安全放进同一质量链；Crawl4AI 则用一组安全修复说明，外部知识摄取本身就是高风险执行环境。

这组变化共同指向一个问题：Agent Harness 的竞争焦点，正在由“谁有更多工具”转向**谁能让一次长任务在正确的身份、正确的边界和正确的证据链内恢复**。Agent 也由聊天界面进一步变为可迁移、可恢复、可治理的长期进程。

本文沿八个模块推进：先看控制层与 Runtime 如何定义恢复，再看执行环境、工具与身份如何收紧边界，随后进入 Context 与 Observability 的证据链，最后用七家平台矩阵和 OpenClaw 参照收束。

## 一、控制层：恢复成为产品边界

控制层正在从 `prompt + tool loop` 变为 **session lifecycle + placement + policy + state migration + recovery** 的组合契约。主流 SDK、ADK 和编排框架仍提供 graph、checkpoint、tool call 与 tracing，但跨供应商可迁移的 Harness ABI 尚未形成。

### OpenClaw 把长期任务放进统一控制面

[OpenClaw v2026.8.2](https://github.com/openclaw/openclaw/releases/tag/v2026.8.2) 发布于 **2026-09-01**。它允许用户从 New Session 启动后台 session，而不离开当前页面；启动时保留 local、cloud 或 paired-device placement，完成后可从通知打开。session 因而不再只是 transcript，而成为有执行位置、生命周期和可见性的运行实体。

Cloud workspace 可复用 prepared project snapshot，启动前验证 workspace hash，并保留 Daytona-backed project 的 stop、snapshot、restart 周期。支持的 macOS/Linux Chrome extension 还能在 Gateway 断开时唤醒配对的本地 relay；standalone relay 即使脱离 Gateway，也可继续为其他认证 CDP client 提供浏览器。这使 browser session、Gateway 控制面与 CDP transport 被拆开，提升恢复性，但也提出 relay ownership、origin、tab scope、cookie boundary 和断线后撤权问题。

状态与权限边界同步变化。unsandboxed session 默认可与同一 agent 的其他 session 互见，包括 retained cron session；共享部署可用 `tools.sessions.visibility=tree|self` 收窄，sandbox 与 cross-agent 限制仍然有效。workspace permission 变更会作用于 active run，同时保留 cloud worker 的 session tool policy，避免 placement 改变时扩大权限。

升级流程保留更新前配置；session migration 未完成时不再声称成功；`openclaw update cleanup --dry-run` 可预览迁移备份清理。MCP HTTP/SSE oversized response 则在解析前被拒绝，避免超大响应成为内存与上下文攻击。插件可展示外部验证选项，但 approval identity、authorization、timeout 和最终决定仍由 OpenClaw 保留。release 还记录了私有诊断脱敏、session migration、SQLite/agent database owner 协调等修复。[OpenClaw 仓库](https://github.com/openclaw/openclaw)把 Gateway 定义为 sessions、tools、events、channels 的本地 control plane。

OpenClaw 的领先点，是把 Gateway、session、cron、browser relay、workspace、plugin 和 policy 放进一个可操作控制面；短板则是部分 contract 仍主要存在于 release note，而非跨版本稳定 ABI。后台 placement、权限不扩张与可恢复升级可能成为企业验收项；OpenClaw 还需把 session visibility、checkpoint、TTL、迁移回滚和审计事件正式化为可查询契约。

### 静默对象仍构成竞争基线

本期未核到 OpenAI Responses/Agents、Claude Agent SDK、LangGraph、Google ADK、Microsoft Agent Framework、Databricks Agent Bricks 足以改变格局的窗口内 release，不能用窗口外版本凑数。它们的存量能力仍分别代表统一 tool loop 与托管工具、background task 与 tool schema、graph checkpoint/store、Agent 与 workflow 节点和 A2A task、托管 toolbox/identity/observability，以及治理数据与评测部署闭环。

相关基线来源包括 [OpenAI Agents SDK](https://github.com/openai/openai-agents-python/releases)、[Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk-typescript/releases)、[LangGraph](https://github.com/langchain-ai/langgraphjs/releases)、[Google ADK](https://github.com/google/adk-python/releases)、[A2A](https://a2a-protocol.org/latest/specification/)、[Microsoft Agent Framework](https://github.com/microsoft/agent-framework/releases) 与 [Databricks 文档](https://docs.databricks.com/)。CrewAI、Dify、n8n、Flowise 有持续维护，但未核到本周基础设施级强信号。

## 二、Runtime：运行单位不再是一次调用

生产 Runtime 的最小单位已从一次 API 调用扩展为 session、workspace、identity、文件系统和 endpoint 的联合生命周期。一个平台若无法说明 idle、TTL、checkpoint、恢复、取消、跨 turn 文件与审计语义，就仍更接近托管 API，而不是完整 Agent Runtime。

OpenClaw 将 background session 的启动、placement、completion notice 和 session tabs/windows/splits 统一起来；prepared cloud project 在 hash 验证后启动，并保留 stop/snapshot/restart。Gateway recovery、session migration、active-run tool policy 和 relay wake-up 又把断线恢复、执行边界及外部设备整合进 runtime contract。它可用本地 Gateway/cron 的透明度对抗云黑盒，但仍需补齐可声明的 TTL、checkpoint 和跨 placement ABI。

Microsoft 的 [Foundry overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview) 在 **2026-08-27** 更新。这是文档能力基线，不是新 release。页面将 Foundry Agent Service 定义为用于构建、部署和扩展 agents 的 managed platform：Agent Runtime host/scale prompt agent 与 hosted agent，管理 conversation、tool call 和 lifecycle；prompt agent 由配置驱动，hosted agent 把用户代码作为 container 交给托管 endpoint。Toolbox 提供 MCP endpoint、集中认证、治理与版本化；Observability 覆盖 tracing、metrics、evaluation、Application Insights；Identity & Security 包含 Entra identity、RBAC、content filters 与 VNet isolation。

[AWS AgentCore](https://aws.amazon.com/bedrock/agentcore/) 强调 any framework、any model 与 security built in；Google 的 [Agent Platform scale](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale) 把 Agent Runtime、Sessions、Memory Bank、Evaluation Service、Code Execution/Computer Use、IAM agent identity、Cloud Trace/Logging/Monitoring 放在同一 managed platform，并列出 VPC Service Controls、CMEK、data residency、HIPAA 等企业边界。两者同样是本期矩阵基线，并非窗口内新闻。

Runtime 因而正在商品化为 **session + identity + filesystem + endpoint + observability** 的生命周期服务。

## 三、执行环境：浏览器、代码与知识摄取都要隔离

Sandbox 已不再只是“隔离容器”。它正分化为 browser、code、workspace、knowledge-ingestion 四类 execution substrate；下一代标准件需要同时说明网络、凭证、文件、回放、TTL、fork 与审计契约。

### Crawl4AI：知识摄取暴露执行风险

[Crawl4AI v0.9.3](https://github.com/unclecode/crawl4ai/releases/tag/v0.9.3) 的安装方式是 `pip install crawl4ai==0.9.3`，Docker tag 为 `unclecode/crawl4ai:0.9.3`。这是一次 security release：它修复 **5 项** coordinated-disclosure advisories，包括 PDF 路径任意文件写入、SSRF、DoS，以及 Docker Playground 的两项 XSS；同时包含 **33 个** Docker server、crawler 和 PDF 处理 bug fixes，无新 feature、无 breaking change。

[Crawl4AI 仓库](https://github.com/unclecode/crawl4ai)显示其定位是为 RAG、agents、data pipelines 生成 LLM-ready Markdown 的开源 crawler，公开社区规模 **50k+ stars**，但这只是 2026-09-03 快照。其早期版本已经强调 Docker API 默认 auth、loopback bind 和 request body 是不可信边界。v0.9.3 的意义因此不只在修 bug：网页、PDF、Docker API 与用户请求 body 都可能把外部内容转化为 SSRF、文件写入、脚本执行或上下文污染。

对 OpenClaw，Firecrawl/Crawl4AI 类工具应置于独立 sandbox 与 egress policy 中；输出需保留来源 URL、抓取时间、内容 hash 和清洗状态，不应直接成为高信任 memory。

### 托管与专业 substrate 的基线

Google 将 [Code Execution](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sandbox/code-execution-overview) 定义为 secure、isolated、managed sandbox，并与 Runtime、Memory Bank、IAM identity 组合；Microsoft 将 code interpreter、MCP、web search 和 browser automation 放入可版本化 [Toolbox](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/tool-catalog)；AWS 则组合 runtime、browser、code interpreter、gateway、identity、memory、observability。

专业 substrate 中，[E2B](https://e2b.dev/docs)偏代码解释器，[Modal](https://modal.com/docs/guide/sandbox)偏 serverless container/GPU，[Daytona](https://www.daytona.io/)偏开发 workspace，[Browserbase](https://www.browserbase.com/)偏云浏览器。OpenAI [tools](https://platform.openai.com/docs/guides/tools)与 Anthropic [computer use](https://docs.anthropic.com/en/docs/agents-and-tools/computer-use)同样构成基线。本期均未核到同量级强发布；“静默”只表示无窗口内强信号，不表示没有存量能力。

## 四、工具与身份：连接数量让位于治理质量

工具层的核心问题已从 discovery 转向长任务、异步事件、身份传递、progress/cancel 和 schema context budget。Tool Gateway 也在从 function-calling 目录变为 **protocol + discovery + token exchange + policy + audit**。

### MCP 与 A2A 只解决部分互操作

[MCP 2025-06-18 规范](https://modelcontextprotocol.io/specification/2025-06-18)定义 Host、Client、Server 三种角色，使用 JSON-RPC 2.0，提供 resources、prompts、tools，以及 sampling、roots、elicitation。规范明确：tools 可以代表任意代码执行，tool annotation 不应被无条件信任，Host 在调用前应获得用户 consent。MCP 自身无法强制 authorization 与 privacy，access control、数据保护和清晰授权 UI 仍由实现层承担。

[A2A 1.0.0](https://a2a-protocol.org/latest/specification/)以 AgentCard、Task、Message、Artifact 为核心，支持同步、streaming、异步 push、cancel/list/get task 和多种 binding，强调 opaque execution 与 enterprise security。MCP 与 A2A 本周均无新正式版本，只能作为互操作基线，不能冒充动态。

OpenClaw v2026.8.2 在 parse 前拒绝 oversized HTTP response 与 SSE event，同时保留健康的 long-lived stream 和 keepalive。资源限制若太晚，会让恶意大 JSON 或长 SSE 拖垮 Gateway；若太早，又会误伤正常连接。此次修复把上限置于协议适配层，并结合 source-file fidelity、plugin approval verification 与 private diagnostics redaction，形成 tool gateway trust boundary。

AWS 把 Gateway、Identity、Runtime、Memory、Browser、Code Interpreter、Observability 组成平台；Microsoft Toolbox 可把 web search、file search、code interpreter、MCP server、custom function 统一为 managed MCP endpoint，并提供 centralized authentication、governance、versioning；[Google Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/)组合 Agent Gateway、IAM identity、tool access 与 monitoring。集成厂商 [Composio](https://composio.dev/)、[Arcade](https://www.arcade.dev/)、[Nango](https://nango.dev/)和 [Pipedream Connect](https://pipedream.com/connect)则从 integration/auth broker 角度补 SaaS 连接与用户 token。

平台差异不在支持多少 tools，而在第二跳 token 如何 exchange、谁能看 tool schema、失败与撤销如何进入审计。MCP/A2A 不会自动解决用户同意、越权和数据泄露。

### 身份必须覆盖一次具体动作

本窗口没有核到身份动态池的强发布，不能用通用 IAM 新闻补位。但 AWS、Google、Microsoft 已把 Agent identity、OAuth/OIDC、RBAC、MCP endpoint auth 与审计放入默认架构。

身份层至少分四段：workload/agent identity、用户委托、credential broker/token vault、调用级 action policy。标准 OAuth 能证明“谁登录”，却不能单独证明“这次 tool action 是否获准”。实际检查还需覆盖 issuer/audience allowlist、OBO/token exchange、raw credential 是否只在 broker/vault 解密、tool schema/call/resource 是否按 user/agent/workspace/action 限制，以及审批、拒绝、撤销、异常和 policy decision 是否可审计。还要防止 prompt injection 把 read 提升为 delete/send/pay，并避免 transcript、memory、trace 泄露 token。

OpenClaw 已有 session visibility、workspace tool policy、plugin approval 和 MCP response limit，但下一步应把 approval、token scope、audit event 与撤销统一成 permission contract。Identity/Permission 仍是 Harness 最明显的短板之一，治理会继续从 token 管理走向 agent identity、delegation、action policy 与可撤销审计。

## 五、Context：Memory 变成可治理的数据库

Memory 的标准件不应只是 `embedding + top-k`。它还需 provenance、scope、write policy、forget/delete、token budget、source freshness、ACL 与可重建索引。

### OpenViking 进入跨 SDK 与协议阶段

[OpenViking v0.4.17](https://github.com/volcengine/OpenViking/releases/tag/v0.4.17)包含 **92 个 commits**，并欢迎 **14 位首次贡献者**。它对齐 Python、Go、TypeScript SDK，覆盖 find/search、context search、recall、resources、content、Session、Skill、reindex 与 administration。

`find` 与 list-mode `search` 新增 `read_content`，可把命中 URI 的可见全文放入 `content` 字段，CLI 对应 `--read-content`。MCP read 可返回标准 image/audio content block，`mode=download` 导出原始 bytes，视频走 download。

数据导入边界也更清晰：`add_resource` 支持一次性的 `args.tos_signature` 或 `args.tos_access` 发起 HEAD/GET，凭证不进入 resource metadata 或 async queue。mkdir 即使没有 description 也创建最小 L0 并排队向量化；content write 的 replace/append 在目标不存在时创建文件和父目录；accounts/users list 的 name 支持 `*`、`?`。

公开 URI 有 breaking change：uid-less 的 `viking://user/resources`、`viking://user/memories` 要迁移到 `viking://~/resources`、`viking://~/memories`，或显式 `viking://user/{user_id}/...`，否则返回 **400**。升级脚本、prompt、plugin 与服务端需要成组迁移。

可靠性修复覆盖连续 Session commit 的 archive lock contention、memory multi-block patch、replace 字段丢失、目录 overview 未进入 L1、query planner 返回 array 崩溃。Claude Code/Codex memory plugin 新增 `ov-memory-doctor`；DSH 可排除 delegated subagent session，避免污染用户记忆；系统还新增按 memory type/action/result 的抽取指标，并记录受控错误码与真实耗时。

[OpenViking 仓库](https://github.com/volcengine/OpenViking)将其定位为统一 Agent Memory、Knowledge RAG、Skills 的 self-evolving Context Database；公开 stars 约 **35,200**，同样只是 2026-09-03 快照。

这些变化说明 OpenViking 正从 RAG backend 走向带 URI namespace、Session、Skill、MCP content、异步 job、凭证边界和 observability 的 Context control plane。对 OpenClaw，值得吸收的是 session commit 与 memory extraction 的异步分离、`viking://~` 形式的当前主体 namespace、memory doctor 和 outcome 指标；风险则是 breaking URI、AGPL 许可，以及把 user memory、resources、skills 放入同一权限域后的治理复杂度。

### 摄取端与记忆端必须共享信任边界

外部网页、PDF、browser session 和 Docker server 输出不能直接写入长期 memory。至少应保存 source URL、抓取时间、content hash、parser version、授权/robots 结果、清洗与人工复核状态；高风险内容先进入 quarantine namespace，再由 policy 决定是否写入 user/project memory。

Cognee 最近可核实的 `v1.5.3.dev1` 发布于 **2026-08-26**，supermemory `server-v0.0.8` 发布于 **2026-08-17**，MCP 公开 RC 也在窗口外。Mem0、Letta、Zep/Graphiti、Firecrawl、LightRAG、GraphRAG、LlamaIndex、LangMem/Store 等候选经筛选，未核到足以写成窗口内强新闻的官方原文。相关入口包括 [Mem0](https://github.com/mem0ai/mem0/releases)、[Cognee](https://github.com/topoteretes/cognee/releases)、[supermemory](https://github.com/supermemoryai/supermemory/releases)、[Letta](https://github.com/letta-ai/letta)、[Graphiti](https://github.com/getzep/graphiti/releases)与 [Firecrawl](https://github.com/firecrawl/firecrawl/releases)。

Memory 正从检索组件标准化为 **context database + lifecycle policy + evidence + skills**，但行业仍缺通用的 memory provenance/forget ABI。

## 六、Observability：评测成为生产证据链

Agent eval 不再只是离线报表，而在变成生产 trace 的可追溯分支。Observability/Eval/Guardrails 也从 dashboard 竞争走向共享事件平面：同一个 tool-call event 需要同时被 trace、eval、cost、policy 和审计消费。

### Langfuse 把质量与摄入安全接在一起

[Langfuse v4.26.0](https://github.com/langfuse/langfuse/releases/tag/v4.26.0)增加两项 feature：pull request 的 API spec preview，以及将 evaluator execution trace 与被评估 trace 关联。它还修复 structured output 的 reasoning collision、OpenAI Responses in-app-agent stateless call、OTel prompt version attribute 解析为 integer，并为 `metadata_dropped` 增加 projectId、SDK/attributeKey/parse-failure-kind 等标签。

同周的 [Langfuse v3.225.7](https://github.com/langfuse/langfuse/releases/tag/v3.225.7)是一组安全与稳定回补：防止 OTel prototype-chain clobbering；API key creation 受 admin-api entitlement 控制；默认 JWT session max age 降到 **14 天**；worker 拒绝日志脱敏 credentials；补回 attribute-path reconstruction hardening。

两版交叉说明：observability ingest 面越开放，越需要 tenant boundary、属性路径安全、session expiration 与凭证不落日志。对 OpenClaw，评测事件应沿用 session/turn/tool/identity correlation，并在进入 trace 前执行 secret redaction 与 cardinality 控制；“能观测”不能以凭证安全为代价。

### OTel 提供方向，但还未冻结

[OTel GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)逐步覆盖 agent、workflow、LLM、tool execution、evaluation，但字段与状态仍标记为 **Development**，不能写成冻结标准。实现必须避免重复 span、无限 cardinality，以及默认把完整 prompt 或 tool schema 写入 telemetry。

Agent eval 还需区分 attempt、logical turn、retry、cancel、zombie 与 final outcome；只记录 HTTP 200/500 会遗漏 JSON-RPC error、policy deny 和 async completion。OTel 给出互操作方向，但并未替开发者定义数据最小化与执行阻断。

[LangSmith](https://smith.langchain.com/)、[Helicone](https://github.com/Helicone/helicone/releases)、[AgentOps](https://github.com/agentops-ai/agentops/releases)、[Braintrust](https://www.braintrust.dev/)、[Arize Phoenix](https://github.com/Arize-ai/phoenix/releases)与 [Coze Loop](https://github.com/coze-dev/coze-loop)本期未核到窗口内强 release。Google、Microsoft、AWS 已把 observability/evaluation、identity 与 runtime 放进统一 managed control plane，但本周也未核到更强的平台 release。

## 七、七家平台：同一能力图，不同默认哲学

云厂与数据平台已经把 Runtime、Session、Memory、Identity、Sandbox、Tool Gateway、Observability 组合为平台能力。下表保持母稿的完整 **7×7** 比较口径；“本周强信号”只描述窗口内强动态或明确的能力基线。

| 平台 | Runtime / Session | Memory / Context | Gateway / Tools | Identity / Auth | Sandbox / Browser / Code | Observability / Eval | 本周强信号 |
|---|---|---|---|---|---|---|---|
| AWS | AgentCore Runtime、Sessions、长期任务/托管运行 | AgentCore Memory、事件/记忆策略 | AgentCore Gateway、MCP/OpenAPI/tool access | AgentCore Identity、IAM/STS/委托 | Browser、Code Interpreter | AgentCore observability、Policy、Bedrock Guardrails | 未核到新平台级 release；基线见 [AgentCore](https://aws.amazon.com/bedrock/agentcore/) |
| Google | Agent Platform Runtime、Sessions、managed agents | Memory Bank、context/session 管理 | Agent Gateway、MCP/A2A/工具治理 | IAM agent identity、service accounts、OAuth clients | Code Execution、Computer Use、secure sandbox | Cloud Trace/Logging/Monitoring、Evaluation、Example Store | 统一平台文档持续完善；见 [scale](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale) |
| Microsoft | Foundry Agent Runtime、prompt/hosted agents、conversations | Foundry memory/context 与项目数据能力 | Toolboxes、managed MCP endpoint、OpenAPI/MCP | Entra identity、RBAC、content filters、VNet | Code interpreter、browser automation、hosted container | tracing、metrics、evaluations、Application Insights、optimizer | overview 于 2026-08-27 更新；见 [Foundry](https://learn.microsoft.com/en-us/azure/foundry/agents/overview) |
| 阿里云 | 百炼/Model Studio/PAI 模型与 Agent 托管 | 知识库、RAG、记忆组件 | 工具/插件/API 集成 | RAM/STS；Agent 权限按产品配置 | PAI/代码与应用运行环境 | Model Studio/PAI 评测监控 | 未核到窗口内平台级强信号；[Model Studio](https://help.aliyun.com/zh/model-studio/) |
| 火山/字节 | Ark/Coze/Coze Studio/Loop 运行与应用平台 | **OpenViking**：Memory/Knowledge/Skills Context Database | Coze/Ark tools、MCP/插件生态 | 云账号/应用侧 auth；action policy 公开细节不一 | Coze/Ark 执行与外部工具；OpenViking ingestion | Coze Loop、OpenViking memory metrics | **OpenViking v0.4.17：92 commits，SDK/MCP/memory reliability**；[Ark](https://www.volcengine.com/product/ark) |
| 腾讯云 | 智能体平台/元器/CloudBase AI Toolkit/Serverless runtime | 知识库、RAG、Agent memory 组件 | 插件/API/MCP 类工具接入 | CAM/子账号/应用侧授权 | CloudBase/代码运行与工具执行 | TI/智能体平台评估监控 | 未核到窗口内平台级强信号；[TI](https://cloud.tencent.com/product/ti) 为基线 |
| Databricks | Mosaic AI Agent Framework/Agent Bricks、部署与 serving | Unity Catalog、Vector Search、知识与数据治理 | tools/UC functions/外部连接 | Workspace/IAM、Unity Catalog 权限 | serverless/模型与数据执行环境 | MLflow tracing/evaluation、质量闭环 | 未核到窗口内强 release；治理数据协同是差异化；[文档](https://docs.databricks.com/) |

七家都在补同一张能力图，但默认哲学不同：AWS 强调模块化和 any framework/model；Google 将 Runtime、Context、Quality、Sandbox 直接产品化；Microsoft 以企业身份、Toolbox 与发布渠道形成 lifecycle；阿里云、火山/字节、腾讯更强调本土云、模型与应用生态协同；Databricks 从数据治理、Unity Catalog 和 MLflow 进入控制面。

差异因此主要落在默认边界、跨云可迁移性、数据治理和开发者自由度。OpenClaw 的参照点不是与云厂比较资源规模，而是保留 Gateway、session、cron、tool policy 的可见性和可迁移性，再以标准事件与协议接入云 runtime、memory 和 observability。

## 八、本期 TOP 5

1. **OpenViking v0.4.17：Context Database 从概念走向生产 contract。** 92 commits、跨语言 SDK、`read_content`、MCP media、request-scoped TOS credential、URI breaking change、Session/memory 修复和抽取指标同时出现，说明 Memory、Knowledge、Skills 正合成可操作的上下文控制面。
2. **OpenClaw v2026.8.2：恢复与权限边界进入同一 release。** 后台 session placement、prepared workspace、standalone browser relay、visibility、升级迁移、active-run policy 与 MCP size limit 跨 Runtime、Sandbox、Identity、Gateway 联动。
3. **Langfuse v4.26.0 + v3.225.7：Eval trace 与安全摄入闭环。** evaluator trace linkage、OTel attribute handling、JWT 14 天、API-key entitlement 与凭证脱敏说明，观测系统本身也需要身份和安全治理。
4. **Crawl4AI v0.9.3：知识摄取成为 Sandbox/Memory 安全边界。** PDF/Docker 漏洞不是外围问题；当 Agent 把 web/PDF 直接变成 context，SSRF、文件写入、DoS、XSS 都会转化为工具与记忆风险。
5. **七家平台的统一控制面收敛。** 本周没有七家同步发布的新 GA，但 AWS、Google、Microsoft 等官方平台文档已把 Runtime、Session、Memory、Gateway、Identity、Sandbox、Eval 组合起来；竞争进入默认安全边界与可迁移性层面。

## 九、OpenClaw 的五条参照

- **机会：公开 lifecycle ABI。** 把 sessions/cron/Gateway 的能力抽象为 session owner、visibility、placement、TTL、checkpoint、cancel、resume、tool policy、audit event，使其接入云 Runtime 时仍保留本地可解释性。
- **补课：完善 Context contract。** 吸收 OpenViking 的 namespace、memory doctor、异步抽取 outcome 与 `read_content`/MCP content；memory 写入区分 user fact、runtime metadata、tool output、skill candidate，并支持 evidence/forget。
- **补课：统一 policy event。** 建立 PreToolUse/PostToolUse 事件，至少包含 allow、deny、instruct、review 四态，把 secret redaction、MCP response limit、session visibility、plugin verification 接入同一审计流。
- **威胁：一站式控制面挤压采购空间。** 云厂预集成 Runtime、Memory、Identity、Sandbox、Eval 后，企业采购会偏向一站式；OpenClaw 若只以“本地能跑”竞争，会在治理、SLA、证据与撤销上承压。
- **差异化：可迁移且可导出。** 坚持 Gateway trusted control plane + untrusted execution + deterministic policy，提供跨供应商 placement 和可导出的 session、memory、trace，而不是锁定单一模型或云。

## 结语：可恢复性需要一整条契约

本周的四个强信号分别落在控制、Context、Observability 与知识摄取，却指向同一条边界：恢复不是“任务重新跑起来”这一单点能力，而是 session、placement、identity、tool policy、memory provenance 与 trace evidence 能否一起延续。

控制面定义任务如何存在，Runtime 定义任务在哪里继续，Sandbox 与 Gateway 限制它能触碰什么，Identity 判断具体动作是否获准，Context 保存可治理的状态，Observability 留下可追责的证据。云厂已把这些模块预集成为平台；开源项目的机会，则仍在可组合性、开发者可见性和跨供应商迁移。真正的竞争，不再只是组件数量，而是这条恢复链是否明确、可审计、可撤销。

## 来源索引

- OpenClaw：[release](https://github.com/openclaw/openclaw/releases/tag/v2026.8.2)｜[repository](https://github.com/openclaw/openclaw)
- OpenViking：[release](https://github.com/volcengine/OpenViking/releases/tag/v0.4.17)｜[repository](https://github.com/volcengine/OpenViking)
- Crawl4AI：[release](https://github.com/unclecode/crawl4ai/releases/tag/v0.9.3)｜[repository](https://github.com/unclecode/crawl4ai)
- Langfuse：[v4.26.0](https://github.com/langfuse/langfuse/releases/tag/v4.26.0)｜[v3.225.7](https://github.com/langfuse/langfuse/releases/tag/v3.225.7)
- 协议：[MCP](https://modelcontextprotocol.io/specification/2025-06-18)｜[A2A](https://a2a-protocol.org/latest/specification/)
- 云平台：[AWS AgentCore](https://aws.amazon.com/bedrock/agentcore/)｜[Google scale](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale)｜[Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)｜[腾讯云 TI](https://cloud.tencent.com/product/ti)
