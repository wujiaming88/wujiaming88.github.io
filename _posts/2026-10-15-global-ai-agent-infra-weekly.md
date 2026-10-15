---
layout: single
title: "全球 AI Agent 基础设施研究周报（第 17 期）：云厂能力矩阵收敛，Agent 运行时进入分层竞争"
date: 2026-10-15 06:00:00 +0800
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
  overlay_image: /assets/images/posts/2026-10-15-agent-infra-cover.png
  overlay_filter: 0.35
toc: true
toc_sticky: true
---
# 全球 AI Agent 基础设施研究周报（第 17 期）：云厂能力矩阵收敛，Agent 运行时进入分层竞争

2026-10-15 发布｜覆盖 2026-10-08 ~ 2026-10-14

本周基础设施侧的动作集中在两处：一是主流云厂的 Agent 能力矩阵从"有与没有"转向"分层与边界"，二是开放生态里围绕运行时、上下文与工具协议的补漏仍在继续。以下逐模块给出实际状态与本周信号。

## 一、本期结论速览

本周五条线各自推进，却指向同一个竞争点转移：从「能力有无」转向「边界与成本可控」。

1. **控制层在运维化。** LangGraph（10-12~10-14）、Google ADK v2.12.0（10-13）、Microsoft Agent Framework（10-08 / 10-14）在同一窗口内，各自把工具审批、工具输出闸门、状态回收、部署身份从应用层下沉为框架能力。选型标准已从「能不能编排」变成「出事时能不能拦、能不能回收、能不能审计、能不能降级」。
2. **记忆在网关化。** 火山引擎 OpenViking `v0.5.0`（10-09）以 Gateway（Beta）形态用「只改 base URL」无侵入接管上下文，并把「不破坏 provider prompt cache」当作一等设计约束；AWS AgentCore 把记忆做成可结算资源（长期记忆 TTL + 短期记忆按量计费）。采购点从「召回质量」转向 TTL／保留策略、迁移成本、私网信任与计费可预测性。
3. **工具在会话化。** MCP／A2A 本周无新规范版本（MCP 最新稳定版仍为 2026-07-28，A2A 仅文档级提交），增量落在治理章程与开源实现；Nango／Composio 把价值锚点从「接了多少 API」迁到「会话级凭据托管与逐工具授权」。
4. **三方同时抢「Agent 会话边界」。** 云厂从托管容器向状态与治理控制面上挤，工具集成商从 API 目录向会话授权上挤，记忆厂商从「库」向「网关」上挤。Google 本周走错位路线——资源投在模型与编码代理（Gemini 4 Argon GA、CodeMender 连发），控制面本身窗口内无独立条目。
5. **沙箱在硬化。** 执行环境层本周只有 E2B `e2b@2.56.0`（10-13，纯工程硬化）一条可核信号；Browserbase／Stagehand（08-28）、Daytona（06-23）窗口内无发版，能力扩张让位于规模化可靠性。
6. **观测在合规化。** Langfuse 三天连发三版（10-12／13／14），主题是 FIPS／密码学、gateway key 过期、媒体上传池与成本口径修正；Braintrust 新增 Coding agent insights 与 Trace Cursor sessions，把 coding agent 当一等被观测实体。

> 一句话概括：控制层在运维化、记忆在网关化、工具在会话化、沙箱在硬化、观测在合规化——五条线共同说明，Agent 基础设施的竞争点已从「能力有无」转到「边界与成本可控」。

## 二、8 模块实际状态

本节按 8 个模块给出本周实际状态；凡证据只到「月级」「未取得」或属窗外背景的，均按母稿标注保留。

### 模块 1｜Harness / Agent OS 控制层

**实际状态：最强信号是控制层「运维化／持久化」下沉。** LangGraph 窗口内密集发版（10-12~10-14），重心从「能跑图」转到部署与状态生命周期：CLI 0.4.34／0.4.35 加入私有 registry 部署（`--image-pull-secret`、按控制面返回的 registry 用户名登录）与失败部署构建日志保留；`checkpointpostgres==3.2.0` 新增 `prune`；`checkpoint==4.3.0` 修 delta 重放顺序与序列化保留。

**HITL 审批与工具闸门被内置为框架一等能力。** Google ADK v2.12.0 引入 `after_tool_callback`（工具输出返回模型前拦截／过滤）、工作流节点 `require_confirmation`、Agent Engine 专用自定义服务账号，并补齐会话与记忆侧（Firestore 会话／记忆服务可用化 #7192、Vertex AI `append_event` 更新 `last_update_time`、SQLite 保留会话），同时支持 Python 3.15；Microsoft Agent Framework 加入工具审批复用、超时未响应自动拒绝、工具结果 standing guidance（Python 侧 1.21.0 @10-08 另有流式响应全缓冲 Purview 策略评估、`agent-framework-openai` 支持最大 reasoning-effort、alpha Oracle 原生向量存储连接器、隔离 provider 自有 service session 状态、共享文件编辑串行化；.NET 侧 A2A 包升 `1.0.0-preview3`、Cosmos chat 元数据与 partition-key 解耦标 BREAKING）。ADK 另宣称长会话首个模型请求耗时降低 40%（官方 release 自述，未独立复测）。固定对象中，OpenAI Agents SDK 窗口内无 release（最新 v0.23.1 @10-02 已在窗外），Anthropic Claude Agent SDK 三次发版（v0.2.165／166／167）均属类型化与沙箱配置修正，Semantic Kernel 无窗口内 release，AutoGen 长期未发版；MCP SDK 侧最近为 python-sdk v2.3.0（10-02，窗外），Databricks Mosaic AI Agent Framework 本次未取得、其平台侧逐日条目见模块 8。

**价值链位置**：LangGraph／ADK／MS Agent Framework／Claude Agent SDK 均处运行时／Harness 层；把工具审批、输出过滤、状态回收、部署身份从应用层下沉到框架层，对上层编排与应用集成方议价上升，对模型与算法层无直接传导。

### 模块 2｜Runtime / Session / State 执行层

**实际状态：竞争点从「能托管」转向「会话／状态生命周期 + 计费形态」。** AWS AgentCore 十月同批上线长期记忆 TTL（`recordExpirySpecification` + 新 IAM 权限 `bedrock-agentcore:UpdateMemoryRecordExpirySpecification`）与短期记忆按量计费（摄入／检索／存储分开结算，无需配置、自动生效），Gateway 新增私有 CA 信任（VPC Lattice 私网直连、PEM 证书存 S3／Secrets Manager）；**该条为月级条目、无逐日日期，不能坐实落在 10-08~10-14 内**。

腾讯云 ADP 自 10-12 起上线新版订阅套餐（体验版免费／进阶版 1 个成员 License／企业标准版 20 个成员 License 可按需增购），计量方式由「工作空间数 + 单空间成员上限」改为成员 License，进阶与企业新增 Agent Portal；元器 10-08 更新迁移至 ADP 指引。Google Vertex AI Agent Engine 窗口内未见可定位的 runtime／session 实质更新（仅 10-12 Workbench 修复）；Microsoft Foundry Hosted Agents 最新 whats-new 为 2026-08（09-09 更新），窗口内未定位新增量。

**价值链位置**：AgentCore／Foundry Hosted Agents／Vertex Agent Engine／ADP 均处托管 runtime 层，向下绑定状态存储与身份／网关子能力；本周变化集中在记忆保留策略与计费形态、席位与门户治理。

### 模块 3｜Sandbox / Computer Use / Browser 执行环境层

**实际状态：本周只有 E2B 一条可核信号**——`e2b@2.56.0`（10-13）主攻运行时／传输层：要求 Node.js ≥22.19.0、依赖 `undici@^8`（弃用 undici 7），移除 SDK 级 in-flight 请求上限及三个相关环境变量（标 Breaking），并发改由 undici 连接池治理，服务端 `SETTINGS_MAX_CONCURRENT_STREAMS` 饱和时自动开更多连接（同批另有 `@e2b/dockerfile-utils@0.1.1`）。Browserbase／Stagehand（最近 08-28）、Daytona（最新 06-23）窗口内无 release；OpenAI／Anthropic 的 Computer Use 相邻事件属窗外背景；Modal 本次未取得窗口内动态。**价值链位置**：隔离执行环境层，本周变化属工程可靠性，议价中性偏稳。

### 模块 4｜Tool Gateway / Protocol / Integration 工具层

**实际状态：集成层由「应用数量」转向「权限会话」。** Nango 把重心从 Connection MCP 迁到 agent sessions（scoped session + 元工具），`nango_create_connection`（会话中即时连接）与 `nango_proxy`（免凭据代调用）默认关闭；Composio 在 session 上新增 `proxyExecute` 与 `session.executeMeta`。协议本体进入治理阶段：MCP 规范仓库窗口内无新 spec（最新稳定版仍为 2026-07-28），实质提交为 Governance WG charter（10-08／10-11）与 Progressive Disclosure WG charter（10-13）；A2A 仅文档级提交（10-12）；另据 Google 官方口径（经 2026-10-08 二手转述、未独立核实），A2A v1.0 已在 150 家组织投产并归入 Linux Foundation Agentic AI Foundation。Composio 同期集中发版 ≥8 个包（`@composio/core@0.24.0`、`openai-agents@0.11.2`、`langchain@0.11.2`、`claude-agent-sdk@0.12.2`、`mastra@0.10.6` 等，Python 0.27.0 制备中），owned clients 升至 `2.0.0-rc.14`、CLI 迁 Effect 4.0.3，文档侧新增「Muse」接入说明；Nango 则把远程 MCP 工具改为「会话创建时发现、会话内执行」，Connection MCP 自 10-06 弃用并迁移至 agent sessions 指南（背景）。开源网关 `mcp-gateway-registry` 密集修复 auth／虚拟路由／agent card（10-12），1.33.0 仅起草、已发布仍为 1.32.1（10-06，窗外）。Google Agent Gateway 属 Next '26 背景。

### 模块 5｜Identity / Auth / Permission 权限层

**实际状态：实质增量来自工具集成商而非云厂。** Nango（会话级凭据 + OAuth refresh 参数插值修复 + 修掉 GitHub App OAuth 回调开放重定向 + 可选跳过 TLS 校验默认关闭）与 Composio（OAuth 类型澄清、session `proxyExecute`）给出可落地的逐会话／逐工具授权。机制侧共识是 OAuth 2.1／OIDC 请求域身份：MCP 规范（2026-07-28，背景）把协议会话改写为请求域身份，官方另有 enterprise-managed authorization（组织集中管控 + 单点登录接入 MCP server，2026-06-18，背景），本周工具层的 session-scoped 令牌正是该模型的商业实现。本周未见面向 Agent／MCP 工具权限新发布的对象还包括 Pipedream Connect（官网称 managed auth 覆盖 3,000+ API，未独立核实）与 Auth0／WorkOS／Clerk／Descope／Permit.io／Aserto，仅按状态记录；Smithery、Zapier MCP 等动态池对象同样未见面向工具权限的新发布。AWS AgentCore Identity、Microsoft Entra Agent ID、Google Agent Identity 本周均未取得官方新发布，按背景记录（分别对应 managed consent portal 09-01、blueprint 派生 service principal、随 Agent Gateway 属 Next '26 且 preview）。背景中两条值得关注：AWS 出站工具调用默认用 agent 自身 principal 是越权首要风险点，其解法（workload access token 绑定 user+agent）与 Google／Entra 的非人身份路线收敛；Google 侧 Security Command Center 可自动发现 Cloud Run／GKE 上未纳管 agent 与 MCP server，跨云发现延伸至 AWS AgentCore、Azure Copilot Studio、Salesforce Agentforce（Wiz 能力扩展，均属 Next '26 背景）。多数「细粒度权限／审计」主张来自厂商文档、未做独立实测。

### 模块 6｜Context / Memory / Knowledge 记忆知识层

**实际状态：主线是「记忆从 SDK 库变成可被任意 harness 调用的服务」。** OpenViking `python-sdk@0.1.15`（10-13）补 `BatchWriteOptions.skip_conflicts` 与 `grep(level_limit)`，叠加 10-09 的 Gateway（Beta）把接入成本压到「改 base URL」。网关侧另有运维边界：`tool_max_rounds`／`tool_total_seconds`／`tool_total_tokens` 默认不限（`tool_timeout_seconds` 30s），非流式客户端断开后循环不停止、官方建议自设 `tool_total_seconds`；MCP `remember` 改为返回「已提交抽取」+ `task_id`（旧返回文本的调用方需更新），`exclude_uris` 目录改为排除整棵子树。记忆库集体转向存储／可靠性工程：cognee `v1.6.4`（10-13）修 LanceDB／pgvector 搜索返回整列向量、Turso 打开失败报 `OperationalError`、移除 LanceDB 后台 pruning（破坏性变更）、补充向量距离语义与 Turso 共享行为测试；supermemory `server-v0.0.9`（10-12）随 API v5 发本地版：新增 Linux amd64／arm64 预构建 Docker 镜像，升级前须备份 store、`WORKFLOW_ENGINE=direct` 不再支持，localhost 请求现在也要求 key，Native Windows 仍停在 0.0.8。摄取层进入安全加固：crawl4ai `v0.9.5`（10-14）一次关闭 6 个协调披露 advisory（SSRF、JS 注入、任意 HF 模型加载、ReDoS、无界 delay、TLS 校验失效）；功能面仅一项新增：Docker server 的 opt-in deep crawling（`CRAWL4AI_ALLOW_DEEP_CRAWL=true`，BFS／DFS／BestFirst，页／深预算取自 `config.yml`，默认关闭）并加 Crawl4AI Cloud 提示（`CRAWL4AI_NO_CLOUD_NOTICE=1` 可关），非可信体设该字段返回 400。Mem0／Letta／Zep／Firecrawl 窗口内无 release。

### 模块 7｜Observability / Eval / Guardrails 可观测治理层

**实际状态：本周没有新的观测范式，只有已上生产的加固。** Langfuse 三天连发 v4.57.0／4.58.0／4.59.0（10-12／13／14），主题为 FIPS 模式（PBKDF2、拒绝以 MD5 计算存储选项）、gateway API key 过期、媒体上传池与**成本口径修正**（修正 Claude Sonnet 5.5 的 cache-read 价格）；LangSmith SDK v0.14.7／0.14.8 落在 sandbox API 与 JOSE 算法，并加 multipart→batch 回退。Braintrust 十月条目（仅月份标签、未标具体日）新增 Coding agent insights、Trace Cursor sessions、Patterns 严重度（self-hosting 尚未发布）、新 thread view（preview）、SQL charts（仅 Pro／Enterprise）与 PagerDuty 通知，`bt` CLI 升至 v0.26.0（另有 v0.25.0 的 `metadata.turn_span_id` 逐轮归因、v0.23.0 pi 追踪字段破坏性重命名）、Python SDK v0.46.0 开始追踪 Google ADK workflow 节点，并逐一接 Cursor／Claude Code／Codex／pi 等 coding agent，把 coding agent 当一等被观测实体。OTel GenAI 语义约定迁至独立仓库 `semantic-conventions-genai`。同层还有 Arize Phoenix 三日三补丁（v20.21.2／3／4，10-13~10-14：experiments 延迟类型、graphql 检索计数归一、UI 与文档修复），属维护级节奏；Helicone、AgentOps 窗口内无 release，Coze Loop 本次未取得。

### 模块 8｜Managed Agent Platform / Enterprise Control Plane

**实际状态：共同发力点是「把记忆／Gateway 做成可计量、可治理、可私有互联的控制面」。** AWS AgentCore 把记忆生命周期与计费粒度、私域网关信任做成平台级能力（月级、精确日未取得）；火山引擎 OpenViking v0.5.0（10-09）以网关形态无侵入接管上下文；Google 窗口内两次可核发布落在模型与编码代理（10-13 Gemini 4 Argon GA、10-14 CodeMender v0.15.0——SARIF 2.1.0 报告标准化以兼容 GitHub Code Scanning、`cm stats --json` 增模型调用统计；10-12 v0.14.0 加 `--diff`／`--deep-max-turns`／`--enable-bash`）；Databricks 是本期唯一提供逐日官方节奏的平台（Agent memory pipelines Beta 10-12、Unity Gateway Skills API Beta 10-12、AI Runtime SDK 10-13）。Microsoft Foundry 窗口内未取得新增（classic agents 退役为 8~9 月背景）；阿里云百炼本次未取得窗口内条目。

**隔离主张（未证实）**：热度扫描称 Gemini Enterprise Agent Platform 页面出现 deprecated／2026-08-20 关停提示——已对该页正文 grep `deprecat`／`shutdown`／`retire` **无命中**，该主张未获证实，**不作结论**；后续判定为**重命名／品牌整合，非关停**。本周确认的「退役」语义在 Microsoft Foundry 侧（classic agents 2027-03-31 退役、2026-12-01 退役 workflows），均属 8~9 月背景。

## 三、云厂能力矩阵

说明：1 行为一个平台，1 列为一项能力。单元格只写**已取证事实**或「本次未取得／本周无重大公开动态」，**不留空、不猜**；窗口外内容一律标「背景，非本周」。窗口＝2026-10-08 00:00 ~ 2026-10-14 24:00（+0800）。

| 平台 | Runtime / Session | Memory / Context | Gateway / Tools | Identity / Auth | Sandbox / Browser / Code | Observability / Eval | 本周强信号 |
|---|---|---|---|---|---|---|---|
| **AWS**（Bedrock AgentCore） | Instances 计算类型、持久会话至多 14 天（8 月背景）；9 月 Harness 交互式 shell（同 microVM） | **长期记忆 TTL `recordExpirySpecification`；短期记忆按量计费（ingestion/retrieval/storage）**（10 月分区、精确日未取得） | **Gateway 支持私有 CA 签发 TLS 证书的 MCP／OpenAPI／HTTP proxy 目标（直连 VPC Lattice）**（10 月分区、精确日未取得） | 无本周新信号；Consent Portal 属 09-01 背景；出站默认 agent principal（Okta 10-02 分析，未独立核实） | 8 月 AgentCore Browser／Code Interpreter（本次未取得窗口内独立条目）；9 月交互式 shell 同 microVM | AgentCore Observability（OTEL→CloudWatch，常青文档、非窗口事件）；9 月 Evaluations 支持 TypeScript 框架 | 记忆可结算（TTL+按量）+ 私网直连（**但仅月级、无逐日日期，窗口归属未坐实**） |
| **Google**（Gemini Enterprise Agent Platform／Agent Engine） | Agent Runtime（部署／管理五种方式）+ Sessions；ADK 部署 Agent Engine 支持专用自定义服务账号（10-13） | Memory Bank（长期偏好／事实）；官方改名页将 Agent Engine Memory Bank 归入新平台（**重命名，非关停**） | Agent Gateway（拟议原生解析 MCP+A2A，Envoy/K8s，**Next '26 背景、preview**）；Cloud Trace 集成（09-30 背景） | IAM agent identity；ADK 凭证加密入 session、OIDC audience 强制、修 OAuth2 密钥泄露（10-13）；Agent Identity（非人加密 ID，Next '26 背景） | Code Execution；**CodeMender v0.14.0（10-12）／v0.15.0（10-14）** | Evaluation Service + Example Store；App Topology API GA（09-30 背景） | 窗口内发布集中在**模型与编码代理**（Gemini 4 Argon GA 10-13、CodeMender 连发）；控制面本身无独立条目 |
| **Microsoft**（Foundry Agent Service／Hosted Agents／Copilot Studio） | Hosted agents、long-running（crash-resilient、steerable、reconnect、task state、HITL）——**均 preview、8 月背景** | 本次未在该官方页取得窗口内独立 Memory 条目 | Toolbox（含 toolbox-network-isolation）、OpenAPI／web search／Code Interpreter tools、Foundry MCP Server（背景） | Entra authentication for Foundry Agent trace ingestion（preview）；Entra Agent ID（blueprint 派生 service principal，5 月背景） | Code Interpreter tool（Foundry）；Copilot Studio Computer use（2026-05 GA，背景） | cloud evaluation 系列 + Agent Monitoring Dashboard + Foundry SDK 评测（背景） | **本周无重大公开动态**：what's-new 最新 August 2026（updated 09-09）、Copilot Studio 最新 September 2026、Foundry Blog 最新 09-29 |
| **阿里云**（百炼 Model Studio／PAI） | 智能体托管运行时（06-29 上线，背景） | 记忆库 Memory 2.0（03-20）+ 记忆库商业化通知（07-21）（背景） | 网关变更通告（07-13）；官方／第三方 MCP（02-06）；数据连接模块 MySQL／语雀／OSS（06-10） | 生成临时 API Key（06-03）；API Key 加密存储与业务空间专属推理域名升级（06-29） | 知识检索服务、Coding Plan 联网搜索 MCP（06-11）；**未见独立浏览器沙箱条目** | 模型评测（06-09）、知识库日志与监控投递 SLS（04-24） | **本次未取得窗口内条目**：功能更新页 2026 年最新为 8 月；PAI 未核 |
| **火山-字节**（OpenViking／Ark／Coze） | Helm chart 0.2.0 sidecar；Docker gateway profile；Compose gateway profile（10-09） | **Working Memory 默认关闭**（#5696/#5686）；检索 quota 补位（#5679）；`python-sdk@0.1.15` 补 `skip_conflicts`／`grep(level_limit)`（10-13） | **OpenViking Gateway（Beta），默认端口 1935，原协议转发 Anth/OpenAI**（#5625，10-09） | 网关 key + context profile 默认只勾选只读工具，写类工具需管理员勾选（#5625） | 本次未取得（窗口内无独立条目） | Studio Requests 页 + OV-Usage 来源卡片（10-09） | **OpenViking Gateway(Beta) 以「改 base URL」无侵入接管上下文，并逐字节回放保 provider prompt cache** |
| **腾讯云**（ADP／元器／CloudBase） | ADP **10-12** 新版订阅（体验／进阶 1 License／企业标准 20 License）+ Agent Portal；ADP 4.0 以 AgentOps 为核心（博客，无逐日日期） | 本次未取得（未见窗口内独立 Memory 条目） | ADP 4.1.4「新增授权凭证，连接器和工具可跨空间共享、知识库支持 SAP HANA」（博客，无逐日日期） | 本次未取得 | 本次未取得 | ADP 4.0 含「治理、观测与优化」链路（博客口径，未给逐条日期／文档页） | **席位 License + Agent Portal**（10-12）；**GLM-5／5-Turbo／5.1 于 TokenHub／ADP／CloudBase 下线，生效 10-09 00:00**，ADP 自动切至 GLM-5.3 |
| **Databricks**（Mosaic AI Agent Framework／Agent Bricks） | **`databricks-sdk-air` 取代 `serverless_gpu`**（10-13，GPU env v6 起） | **Agent memory pipelines 进入 Beta**（10-12）：session store 接 memory store，LLM 蒸馏持久事实，可约每 24h 跑 | **Unity Gateway Skills API Beta**（10-12）；支持 Amazon Bedrock Mantle（10-09）；上架 Gemini 4 Argon（10-13）／Claude Haiku 5.5（10-07） | **custom service policies 支持调用方 request tags**（10-09） | Databricks Apps 工作区级 package repositories GA（10-14） | **OpenJev（Qwen3.5 4B）作 LLM-as-a-judge 评估器 Beta**（10-09） | **唯一逐日官方节奏**；记忆管道 Beta + Unity Gateway 扩模型／网关，Knowledge Assistant 与 Supervisor Agent 转 legacy（10-12） |

矩阵留白说明：上表标注「本次未取得」的单元格，均为本期实际扫描后仍未取得可核原件的项，**不代表官方无动态**；「本周无重大公开动态」仅指官方页未出现属于 10-08~10-14 的逐条条目。

## 四、本周强信号表

| 平台 | 本周最强信号（一句） |
|---|---|
| AWS | 记忆可结算（TTL + 按量）+ 私网直连，**日期仅到月级** |
| Google | 模型与编码代理双发（Gemini 4 Argon GA、CodeMender） |
| Microsoft | 本周无重大公开动态 |
| 阿里云 | 本次未取得窗口内条目 |
| 火山-字节 | OpenViking Gateway(Beta) 无侵入接管上下文 |
| 腾讯云 | 席位 License + Agent Portal；GLM-5 系列下线 |
| Databricks | 记忆管道 Beta + Unity Gateway，逐日可核 |

## 五、TOP 5 观察项与候补

排序依据：**对 Agent Harness 基础设施格局的信号价值**（控制面／入口／治理边界的变化幅度 × 证据可核度 × 对搭生产方案者的直接影响）。

1. **AWS Bedrock AgentCore：记忆 TTL + 短期记忆按量计费 + Gateway 私有 CA。** 平台把「记忆」从功能卖点变成可治理、可结算、可私网互联的资源（TTL 可配置、ingestion／retrieval／storage 分开计费、私有 CA 直连 VPC Lattice）。它定义了「记忆作为可计费基础设施」的产品形态，直接挤压下游自建记忆层的议价空间；Harness 选型从此多了一条「记忆成本可预测性」轴。**限述：仅月级归档、无逐日日期，窗口归属未坐实**，故不作为「本周新增」硬结论。
2. **火山引擎 OpenViking v0.5.0：OpenViking Gateway（Beta）。** 以「模型网关中间层」无侵入接管上下文（只改 base URL），并把「不破坏 provider prompt cache」作为一等设计约束；Working Memory 默认关闭，改由宿主自管压缩。这是本周**窗口内日期最确定、架构含义最清晰**的记忆层信号——记忆厂商从 SDK 插件升级为企业控制面切口，直接与 AWS／Google 的 Gateway 功能重叠；对自建 harness 意味着「外部记忆可后装、可拆」。
3. **LangGraph 部署／状态生命周期发版潮（CLI 0.4.34／0.4.35、checkpoint 4.3.0、checkpointpostgres 3.2.0）。** 控制层把差异化从「编排原语」转到「私域部署 + 状态回收／正确性」（`--image-pull-secret`、构建日志保留、`prune`、delta 重放正确性），是本周「控制层运维化」主线**最密集、最可核**的证据集，且直接可映射到自建 harness 的 session／cron 存储回收设计。
4. **Google：Gemini 4 Argon GA（10-13）+ ADK v2.12.0 工具闸门／HITL／部署身份（10-13）。** 同日同时推模型能力（1,048,576 token、thinking 可配、长解码、agentic video）与框架治理（`after_tool_callback` 输出过滤、`require_confirmation`、专用服务账号、OAuth2 密钥泄露修复）；首请求 -40% 为**官方自述、未独立复测**。
5. **工具层的会话级授权落地：Nango v0.71.13 + Composio 多包发版。** 价值锚点从「接了多少 API」转为「会话级凭据托管与逐工具授权」，并含 OAuth 回调开放重定向修复等真实安全收口；把「逐会话授权 + 可撤销 + 凭据不落 agent」变成可落地实现。

**候补信号**：① Databricks 十月逐日条目（记忆管道 Beta、Unity Gateway Skills API Beta、AI Runtime SDK、OpenJev 评估器、Knowledge Assistant／Supervisor Agent 转 legacy）——逐日可核且五列同时推进，但主要影响其生态内客户；② 腾讯云 ADP 席位制订阅 + Agent Portal（10-12）与 GLM-5 系列下线（10-09）；③ crawl4ai v0.9.5 安全版（10-14，6 个 advisory）与 Langfuse 三连发（10-12／13／14）；④ E2B 2.56.0（10-13，沙箱底座连接池自治、Breaking）；⑤ Microsoft Agent Framework dotnet-1.25.0（10-14，工具审批超时自动拒绝）。

## 六、OpenClaw 战略参照（6 条）

（均以本周窗口内证据支撑；外部参照仅作对照，不代表已对自有实现作出变更。）

1. **领先点：默认上下文管理被外部实现承认为「事实接口」。** OpenViking v0.5.0（10-09）把插件宿主默认行为改为宿主自管历史与压缩，其中 OpenClaw 的 `contextManagementMode` 默认即 `"native"`，需显式设 `"openviking"` 才外接；同时新增 OpenClaw 自动上下文注入用户 profile（#5676）与对 OpenClaw／pi 客户端截断按失败处理（#5790）。→「默认 native、按需外接」的边界已被生态承认，可作为 session／context 策略的对外契约继续维护。
2. **补课点一：工具输出闸门。** Google ADK v2.12.0 新增 `after_tool_callback`，可在工具输出返回模型前拦截／过滤；同周 Microsoft 加入 tool-result standing guidance。→ 自有 tool runtime 应在「工具结果进入模型上下文前」提供可插拔拦截／改写点，而非仅在工具侧校验。
3. **补课点二：审批生命周期与超时归还。** Microsoft dotnet-1.25.0 **自动拒绝永不响应的工具审批请求**，ADK 修「已确认工具每次审批只运行一次」（#7434）并支持 `require_confirmation`；LangGraph 保留失败部署的构建日志。→ 审批／确认流程需定义「超时默认拒绝」与「不重复消耗审批」两个明确语义，避免长时挂起与重复执行。
4. **补课点三：状态回收与成本可控。** LangGraph `checkpointpostgres==3.2.0` 新增 `prune`；AWS AgentCore 长期记忆 TTL；cognee v1.6.4 把 LanceDB 隐式后台 pruning 改为手动。→ 三家独立证据同向：状态存储必须提供**显式回收（prune／TTL）与可预测成本**；自有 cron／session 存储应对齐「默认保留策略 + 显式 prune」。
5. **补课点四：会话级外部凭据的企业可用性。** AWS 私有 CA／VPC Lattice 解决「不前置额外网关的私网信任」，Nango agent sessions 做到「凭据由网关注入、agent 不触明文」。→ 自有外部工具接入若要企业可用，需同时回答「私网信任锚」与「凭据不经 agent」两个问题。
6. **旁参：观测字段设计。** Braintrust 以 `session_id`／`turn_span_id` 支持逐轮归因与 coding agent 成本拆分；Langfuse 本周修正 cache-read 价格口径。→ 可作为自有 trace／成本归因字段与计价口径的对照清单。

## 七、GitHub 热度补漏（9 方向）

本期研究前先做 9 方向 GitHub／Web 热度补漏扫描（扫描于 2026-10-15 06:03~06:12 +0800，入口：`gh api` 认证直查 + serper）。

| # | 方向 | 结果要点 |
|---|---|---|
| 1 | agent memory / context database | OpenViking 仍居 topics 首位；2026 记忆对比文为二手聚合 |
| 2 | agent harness / runtime | 品类词固化；`agent-harness` topic 1,584 仓；MS Agent Framework BUILD 2026 为背景 |
| 3 | browser agent runtime / sandbox / code execution | Northflank／Modal／Firecrawl 2026 沙箱对比为聚合文；E2B 官网定位「isolated machine for every agent」 |
| 4 | MCP gateway / agent auth / OAuth / tool permission | `agentic-community/mcp-gateway-registry` 居首；Permit「OAuth on MCP」、MCP discussion #804「Gateway-Based Authorization Model」、Red Hat 网关 auth 文 |
| 5 | agent observability / eval / guardrails | `ai-observability`／`llm-observability` topics 活跃；MonteCarlo、Braintrust 指南为聚合 |
| 6 | AI agent RAG / knowledge graph / memory / skills | OpenViking 首位；serverless 单文件 memory layer；TeleAI-UAGI／Awesome-Agent-Memory 收录 |
| 7 | 云厂平台（AWS／Google／Microsoft） | AgentCore 官网；Gemini Enterprise Agent Platform release notes（⚠️ 页面曾提示 deprecated，**经逐源核实为改名而非关停**）；三方对比为二手 |
| 8 | 火山引擎 / Coze / OpenViking | 火山 OpenViking 产品页 2026/6 更新为窗外背景；marktechpost 2026-03 文为背景 |
| 9 | MCP / A2A 协议本体周讯 | ⚠️ **该方向返回被「October」歧义词污染，无有效结果**；不据此判无动态，**后由工具与协议专项逐源补齐**（结论：MCP 无窗口内新 spec 版本；A2A 仅 10-12 文档提交） |

**补漏结论**：9 方向中 8 个给出了可用线索，方向 9（MCP／A2A 协议周讯）被「October」歧义词污染而失效，**已由工具与协议研究线逐源核对官方仓库／规范补齐**（结论：协议本体本周无新规范版本，仅治理与披露 WG 章程推进），未因此方向失效而错报「协议无动态」。

## 八、价值链传导

链条：模型与算法 → 运行时/Harness → 协议与工具 → 平台与工具链 → 集成与交付 → 终端场景。

1. **模型与算法 → 运行时/Harness：能力通过框架捆绑向运行时传导，但定价权仍在模型侧。** Google 同日把 Gemini 4 Argon GA（10-13）与 ADK v2.12.0 绑定发布，形成「SDK 免费 + 平台计费」的捆绑结构；ADK 宣称长会话首请求 -40%（官方自述，未独立复测）。→ 模型侧的 context 上限与 thinking 级别已成 harness 上下文策略的直接输入。
2. **运行时/Harness → 协议与工具：授权中间件被上游吸收，工具网关被迫上移到凭据与撤销链。** ADK `after_tool_callback`、MS 工具审批超时自动拒绝把「工具输出闸门 + 审批」内建到框架。→ 单纯「代理工具调用」的网关价值被商品化；Nango／Composio 的差异化被逼向「跨框架凭据托管 + 可撤销会话」。**位置待明确**：会话级授权由谁定义标准（MCP progressive disclosure WG 尚未产出规范）。
3. **协议与工具 → 平台与工具链：标准沉默期，云厂以「协议原生网关」抢治理位。** MCP／A2A 本周无新规范版本（MCP 最新 2026-07-28；A2A 仅 10-12 文档提交）；云厂同步加码网关（Google Agent Gateway preview，Next '26；AWS 私有 CA 直连 VPC Lattice；Databricks Unity Gateway Skills API Beta）。→ 标准沉默 + 云厂收编，集成方的迁移成本被锁定在各家网关的私网／身份模型上。
4. **平台与工具链 → 集成与交付：记忆与会话变为可计量商品，报价结构从项目制转向按会话／按席位。** AWS 记忆 TTL + 按量计费、Databricks Agent memory pipelines Beta、腾讯 ADP 席位 License。→ 议价权向平台倾斜，交付方需重算「记忆保留成本 + 席位／用量」两项。
5. **集成与交付 → 终端场景：安全信任与成本可见性成为采购门槛。** crawl4ai 一周内第二个安全版（6 个 advisory）、Nango 修 OAuth 回调开放重定向、Arcade 把上游错误挡在 agent 可见消息外；观测层同步企业化（Langfuse FIPS／网关 key 过期、Braintrust coding agent 成本仪表盘）。→ 采购门槛从「能跑通」变为「能过安全与合规审查，且成本可归因」。

**本周商品化／定价权信号小结**：定价权清晰地向平台侧（计费与席位）与云厂网关（私网与身份）移动；开源侧（Nango／Composio／OpenViking）以「会话／网关」抢占集成入口，但尚未形成可复用的跨厂商标准——**该项位置待明确**。

## 九、公开局限与证据边界

**本报告全部内容为文献取证，未做任何实测或复现**；「未取得」不等于「无动态」。以下按原样保留各研究线标记的局限，未取得／限述／隔离的内容不得升格为确定事实。

- **日期粒度与窗口归属**：AWS AgentCore 十月三条（Memory TTL、短期记忆按量计费、Gateway 私有 CA）官方页仅月级分区、无逐日日期，**不能坐实落在 10-08~10-14 窗口内**，也不能据此写「本周新增」；Braintrust 仅有「October 2026」月份标签；腾讯 ADP 4.0／4.1.4 博客无逐日日期；Microsoft 最新月级条目为 August 2026（updated 09-09），**记「本周无重大公开动态」不等于「无动态」**；阿里云百炼功能更新页 9／10 月分区未出现，只能说「本次未取得窗口内条目」，PAI 未核。
- **未取得／未复核**：Gemini Enterprise Agent Platform「deprecated／2026-08-20 关停」主张经 grep **无命中、已隔离不采用**，后续判断为**重命名／品牌整合**（Vertex AI Agent Engine → Agent Runtime on Gemini Enterprise Agent Platform，Memory Bank／Sessions／Code Execution 同步改名，原 release-notes URL 现 302 跳转）；Langfuse changelog 落地页与 `/changelog.md` 均 404，未取得落地页正文与自身定价变更；Mem0／Letta／Graphiti／Firecrawl／Helicone／AgentOps 仅核到 release 端点与 `pushed_at`，未逐查窗口内 commit／PR；强观察池（LightRAG、MS GraphRAG、LlamaIndex、LangMem／LangGraph Store、Onyx、Haystack、Jina Reader、Unstructured、Chroma／Qdrant／Milvus／Weaviate）本轮未扫描，无命中即不写；Arcade 产品版本走官网而非 GitHub release，未读其 changelog；`mcp-gateway-registry` 1.33.0 仅有 notes 草稿（10-14）未发布，**提案不等于已生效**；Google Agent Gateway 官方发布日未取得且处 preview；MCP discussion #804 日期未核、未采用。
- **证据强度**：ADK 首请求 -40%、AWS 私有 CA 连通性、E2B 并发治理、Braintrust 成本拆分、Google Triage agent 处理量等均为**厂商自述／官方口径，未独立复测**；「细粒度权限／审计」主张多来自厂商文档（Nango／Composio），按 B/C 级处理；平台对比／导购／榜单类二手聚合文未作为一手来源。
- **不能作出的判断**：不能称 AWS 十月三条「发生在本周」，只能作「十月内、精确日未取得」；不能称 Microsoft／阿里云窗口内「无动态」，只能作「本次未取得窗口内条目」；不能称 Gemini Enterprise Agent Platform「关停」，只能作「重命名」；不能将 mcp-gateway-registry 1.33.0、Google Agent Gateway preview、Braintrust self-hosting 当作已生效能力。

<!-- A-END -->
