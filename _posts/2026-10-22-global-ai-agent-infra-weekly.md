---
layout: single
title: "全球 AI Agent 基础设施研究周报（第 18 期）：平台收编调度与评测，记忆层走向上下文数据库"
date: 2026-10-22 06:00:00 +0800
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
  overlay_image: /assets/images/posts/2026-10-22-agent-infra-cover.png
  overlay_filter: 0.35
toc: true
toc_sticky: true
---
2026-10-22 发布｜覆盖 2026-10-15 ~ 2026-10-21｜第 18 期

本周的基础设施更新很少再谈“能不能跑起来”。OpenAI 修的是审批挂起与上下文压缩的冲突，LangGraph 连修四个恢复语义缺陷，AWS 给长期记忆加 TTL 并把短期记忆拆成三项计费，Arcade 把工具选择改成检索问题。把这些放在一起，指向同一件事：Agent 进入长任务和多人协作后，竞争点变成会话能否可靠中断与恢复、凭证能否收窄到确切资源、成本能否归因、工具与上下文能否被治理。

本期按软件栈的八个层次整理已取证的版本、提交与官方文档，再给出云厂能力矩阵、价值链位置和五个信号最强的变化。事实以官方 release、文档与 commit 为准；厂商自测数字保留其口径，月级归档、窗口外条目和未取得正文的材料单独标注。

## 控制层：会话与审批语义成为缺陷源

长任务进入生产后，“暂停—恢复—审批”的一致性开始主导控制层更新。OpenAI Agents SDK [v0.24.0](https://github.com/openai/openai-agents-python/releases/tag/v0.24.0) 于 10 月 15 日发布，四项变更都指向长会话治理：MCP 在转换后的工具上暴露 annotations（#5356），run-wide 工具异常统一格式化（#5326），conversation session 写入按 API 上限批量提交（#5334），并修复存在 pending approvals 时自动 compaction 被提前触发（#5363）。审批挂起、上下文压缩和写入顺序因此被视为同一组状态机问题。

Microsoft Agent Framework 的 [python-1.22.0](https://github.com/microsoft/agent-framework/releases/tag/python-1.22.0)（10 月 15 日）支持 Python 3.15，同时警告内嵌序列化的 Content/response-update 聊天历史、session store、protocol snapshot 与 workflow checkpoint 可能跨版本不兼容，普通 session metadata 不受影响。dotnet-1.25.0（北京时间 10 月 15 日 03:10）加入审批复用（#9389）、对永不响应的 tool-approval 自动拒绝（#9152）、A2A 1.0.0-preview3（#9386），并让 Purview 覆盖 citations 与 error details（#9375）。Agent 状态被当作带 schema 的资产，升级需要迁移策略。

LangGraph [1.2.16](https://github.com/langchain-ai/langgraph/releases/tag/1.2.16)（10 月 16 日）修四个 resume 语义：resume 值非法时其他 task 仍正常结束（#9265）、resumed Command 更新只应用一次（#9322）、阻止子图 resume 重跑已完成 task（#9315）、pending writes 只保存一次（#9314）。同窗口 checkpoint-postgres 3.2.0 为 PostgresSaver 增加 prune（#9290），sdk-py 0.4.8 让 thread stream 错误上抛（#9317），cli 0.4.37 把 deploy 默认切到 serverless（#9333）。checkpoint 从“能持久化”走向“能治理”，恢复正确性与存储成本同时成为竞争点。LangSmith 本周的独立发布条目本次未取得。

开源 Harness 则把沙箱、会话与观测做成同一交付物。trueforge [0.180.0-rc.1](https://github.com/truefoundry/trueforge/releases)（10 月 21 日）保留 Daytona 自定义环境的 supervisord ENTRYPOINT（否则默认 sleep infinity，NATS bridge 起不来），requestTimeoutMs 设 60s，每次 exec 施加“命令超时 + 5s”的 HTTP deadline；创建或替换 inline session 与运行 turn 时允许 x-tfg-skills、x-tfg-mcp、x-tfg-models，skill 必须是 git skill，MCP 与 model 缺名时回退 registry，其他路由拒绝；日志统一带 tenant/request/session/turn id；新增 GET /metrics Prometheus 端点。仓库 6,335 stars / 534 forks。x-tfg-* 只在会话创建或替换时校验、不落库，是“会话声明与持久规格分离”的可借鉴设计。

平台侧的动作是把调度器收进控制面。Microsoft Foundry 在 10 月 15 日的月度博文中宣布 Routines GA：一个触发器启动一个 agent，支持 timer、周期 schedule、GitHub issue 与 Teams 频道事件，配置、身份和运行历史留在项目内，官方同时明确它不替代多 agent 编排或审批流；Routines 与 OpenClaw 的 sessions 与 cron 组合属同一结构。调度、身份与运行历史因此留在平台项目内，具体能力放在平台章节展开。

Google ADK 窗口内没有 release：v2.12.0 于 10 月 13 日 16:35Z 发布，折算北京时间已越窗；其内容为长会话首个模型请求耗时降低 40%、after_tool_callback 过滤工具输出、workflow 人工确认，本期只作背景。Anthropic 的新闻页本次仅返回站点壳，列表摘要显示 10 月 21 日有 Claude Opus 5.5 条目，但正文未读，且属模型层，不写成已核实事实；窗口内 Agent SDK 与 MCP 正文本次未取得。Databricks 本周无重大公开动态，产品页与文档无发布日期可核，维持“数据治理强、Harness 原语弱”的判断。CrewAI、Dify、n8n、Flowise 本轮检索未命中基础设施级动态。

OpenClaw 没有对外版本公告，实测实例为 2026.10.5（1b58cb9），控制面由 Gateway 与 sessions_spawn（depth 1/5、runtime=subagent、runTimeoutSeconds）、策略过滤与延迟工具目录、exec 审批、isolated cron、memory-core 和两层技能组成。外部信号来自火山方舟 Agent Plan 文档，它把 OpenClaw 与 Claude Code、Codex CLI、Cursor 并列为可接入 AI 工具，并单列接入页与 1M 上下文方案。局限是缺少公开的版本化 changelog 与 schema 化持久化说明。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| OpenClaw | 无对外版本公告；实例 2026.10.5（1b58cb9）；被方舟列为接入工具 | 版本实测；方舟文档（10-22 抓取） | 是（架构观测） |
| OpenAI Agents SDK | 有动态：v0.24.0（10-15） | GitHub releases | 是 |
| Anthropic Claude Agent SDK / MCP | 获取失败：新闻页仅返回站点壳，窗口内正文未取得 | anthropic.com/news（10-22） | 否（限述） |
| LangChain / LangGraph / LangSmith | 有动态：langgraph 1.2.16、checkpoint-postgres 3.2.0、sdk-py 0.4.8、cli 0.4.37 | GitHub releases（10-16~10-19） | 是 |
| Google ADK | 窗口内无 release（v2.12.0 为 10-13T16:35Z，越窗） | GitHub releases | 是（平台侧补） |
| Microsoft Agent Framework | 有动态：python-1.22.0（10-15）、dotnet-1.25.0（10-14T19:10Z，北京 10-15 03:10） | GitHub releases | 是 |
| Databricks Mosaic AI / Agent Bricks | 本周无重大公开动态（未取得窗口内官方条目） | 产品页（无日期） | 否 |
| trueforge（热度补入） | 有动态：0.180.0-rc.1（10-21） | GitHub releases | 是 |
| CrewAI / Dify / n8n / Flowise（动态池） | 未取得基础设施级动态 | 本轮检索未命中 | 否 |

控制层正在标准化会话与审批语义，并把调度与运行历史平台化。开源项目与 SDK 同时押注恢复正确性和状态兼容，这一层已过能力演示期，进入可靠性与迁移成本竞争。

## 执行层：会话成为有生命周期与账单的资源

托管 Runtime 的竞争点从“能跑容器”转到“会话能否被中断、恢复、按用量计费”。AWS Bedrock AgentCore 的 [10 月发布说明](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html) 有四项都在运行时周边：Builtin.FailureAnalysis 失败归因评估器把跨 session 的失败聚类为 insight，结果写入 GetBatchEvaluation.insightResults；长期记忆支持 TTL（recordExpirySpecification，需 bedrock-agentcore:UpdateMemoryRecordExpirySpecification 权限）；短期记忆按 ingestion、retrieval、storage 分项计费并自动生效；Gateway 支持私有 CA TLS，PEM 证书存于 S3 或 Secrets Manager，经 VPC Lattice 直连私有端点。SDK [bedrock-agentcore 1.24.1](https://pypi.org/project/bedrock-agentcore/) 于 10 月 19 日发布。这些条目归档在“October 2026”整月说明中，未逐条标日。

Microsoft Foundry 把长任务韧性放进 public preview：客户端断开后可从只读后台报告取回结果，但 checkpointing 与幂等仍需应用自做，重连不会让重复的外部动作变安全。配套的 azure.ai.agents beta.18（9 月 30 日）要求 runtime 定义写入 azure.yaml 或显式 root $ref，长任务使用 --long-running。[9 月更新博文](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-september-2026/) 发布于 10 月 15 日，功能上线多在 9 月，属于“发布事件在窗口、功能时点在窗口前”的混合情形。

OpenClaw 的 2026.10.5 CHANGELOG 列出三项 runtime 能力：Gateway 重启后被中断的 turn、worktree 首条消息、subagent 工作与 deferred tasks 可恢复，会话数据挺过重启、并发写与发布失败；worker-local inference runtime 把 Gateway 派发、客户端放置、worker 策略与目标校验前置，并给出可读的初始化失败原因；会话定向发送不授予 transcript 读取权，设备加入后可安装后台 node service 承载 agent session（--service --session-host）。另有失败自动化先由属主会话修复的 automation repair。涉及 PR #165333、#166042、#168650、#169144、#158902、#163645、#164444、#168623、#161007。重启不再等于丢 turn，subagent 结果可穿过重启返回；差异在本地 Gateway 与多设备 node 承载，恢复边界在进程与 SQLite。CHANGELOG 未标发布日，不计为窗口内发布，仅作参照。

Google 的 [Vertex AI release notes](https://docs.cloud.google.com/vertex-ai/docs/release-notes) 在窗口内没有 Agent Engine 或 Managed Agents 的功能、区域、计费变更；最近条目是 10 月 19 日的 Agent Platform Workbench v2 20261018.00_p0，内容是升级依赖、修 Jupyter Server 终端配置覆盖 Dataproc 插件设置、以及容器启动无法应用终端禁用设置。国内三家本周以治理和迁移为主：百炼应用发布说明最新条目停在 2026-02-10；方舟检索只得到产品与历史文（ArkClaw 为 2026-04）；腾讯元器公告自 2026-10-29 起停止创建新智能体 API key 分发，存量可用，并给出迁移 ADP 指引（页面更新 10-13，早于窗口）。采购方眼下的实际成本是迁移与 API key 生命周期，不宜写成能力升级。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| AWS AgentCore Runtime | 有动态（10 月月度说明 + SDK 1.24.1，具体日不定） | AWS release notes；PyPI 1.24.1（10-19） | 是 |
| Microsoft Foundry Hosted Agents | 有动态（Routines GA、长任务韧性 preview） | Foundry 博文（10-15） | 是 |
| OpenClaw sessions / cron / Gateway | 有动态（本地版本恢复/worker 推理；发布日未标） | CHANGELOG；版本实测 | 是（限述） |
| Google Agent Engine / Managed Agents | 无 runtime 级动态（仅 Workbench v2 依赖/CVE 维护） | Vertex release notes（10-19） | 否 |
| 阿里云百炼 / PAI | 本周无重大公开动态（仅模型下线/文档更新） | 阿里云帮助中心（最新 2026-02-10） | 否 |
| 火山方舟 / Coze | 本周无重大公开动态（可核条目在窗口外） | 官方检索无窗口内公告 | 否 |
| 腾讯云元器 / ADP | 治理动作（API key 停发、迁移 ADP），日期在窗口前 | 元器页面（10-08/10-13） | 否（背景） |
| E2B / Modal / Daytona | 有动态（生命周期/GPU/指标） | 各 changelog（10-15~10-19） | 是（见执行环境章节） |

Runtime 竞争已从“能不能托管”转为“会话能否可靠中断、恢复、计量与归因”。调度原语正在标准化，差异化下沉到留存策略、成本口径与恢复保证。

## 执行环境：安全失败比多支持一个动作更重要

浏览器执行层的价格锚点被拉到“按小时几分钱”，但商业重心已经转向组合能力。browser-use [0.13.13](https://github.com/browser-use/browser-use/releases/tag/0.13.13)（10 月 15 日 23:50Z，北京 10 月 16 日 07:50）的主题是成为 OpenAI 浏览器工具的驱动层：提供 18 个默认浏览器工具与 6 个可选动作（Browser Use Actor），支持本地浏览器、Browser Use Cloud 与“借用”会话三种后端，修复 Cloud tab URL 短暂为空与缩放显示器坐标不对齐。使用需安装 openai-tools extra 与 OpenAI Python 3.31 以上。官方称 11 个 driver 测试全过，两个新回归测试在旧实现上失败，该版本取代被取消发布的 0.13.12。

定价页给出的是另一套口径：1 美元免费额度、最低充值 5 美元、按分钟向上取整、住宅代理 5 美元/GB、并发档 0/100/1,000/5,000/25,000 美元对应 10/50/250/500/1,000 会话，页面没有发布日。仓库描述与第三方文章提到的“每浏览器小时 0.02 美元”未出现在官方定价页，属未独立确认，不用于成本测算。

vercel-labs/agent-browser 窗口内没有新 release（最新 v0.39.1 为 10 月 13 日），实质变化全在 main 分支的 10 条提交里，其中至少四条是安全默认值：10 月 21 日策略文件无法加载时 fail-closed（#2179）；10 月 20 日 MCP 拒绝 schema 未声明的参数（#2175）；点击 hidden、disabled 或视口外元素直接报错（#2173）；拒绝歧义的 stale-ref 恢复（#2145）。另有修 CDP 跨后续命令保持附着（#2155）与同一事件批内的失效 target/session（#2176）。仓库 44,391 stars / 3,035 forks，pushed_at 为 10 月 21 日 19:47:45Z。一个 44k stars 的项目把工程重心放在“拒绝执行”而非多支持动作，说明痛点已从能力覆盖转向误操作与越权。

沙箱厂商则在补“状态语义”，而不是只比启动速度。[E2B 的 10 月 19 日周更](https://docs.e2b.dev/changelog) 让 GET /sandboxes/{id} 对已暂停沙箱返回 pauseMode（full 或 filesystem），并区分 not-running 与 unreachable，Dashboard 给仅保留文件系统的暂停打标；JS SDK 2.56.0 要求 Node 22.19.0 以上并跟随服务端 HTTP/2 流上限（移除三个 inflight 环境变量），Python SDK 2.56.0 要求 Python 3.11 以上，达到流上限时新建连接（E2B_MAX_CONNECTIONS 默认 200）。同版修复暂停恢复变慢、volume 挂载失败仍报成功、多 tag 连接失败、HTTP/1.1 请求体截断和指标漏点。pauseMode 是给上层编排的恢复语义字段：知道会不会丢内存，Agent 才敢在暂停后继续多步任务。

Daytona [0.225.0](https://www.daytona.io/changelog/nvidia-b200-gpu-type)（10 月 16 日）在 API client 新增 NVIDIA B200 GPU 类型，沙箱可按 B200 规格申请；此前的 0.224.0（10 月 12 日）支持逐调用指定 region，已在窗口外。Modal [Python SDK 1.6.2](https://modal.com/docs/sdk/py/releases)（10 月 15 日）新增 modal function metrics 与 modal server metrics（JSON/CSV 导出，Function.metrics 与 Server.metrics 代码查询）、Service Users 编程管理、autoscaler 的 settings()/update()、function calls 与 server requests 的 --since/--until，支持 Python 3.15、Sandbox.from_name(include_terminated=True) 与 modal run - 从 stdin 读脚本。Service Users、配置溯源与调用时间过滤，是把 serverless 当企业基础设施来管。

Browserbase 本周无重大公开动态，最近条目是 10 月 14 日的 Parallel 搜索与 10 月 12 日的 Stagehand 4.2，均在窗口外；其路线是“浏览器 + 搜索 + 函数 + 人工接管”。AWS Browser 的 OS 级交互、ActiveSessionCount，以及 Code Interpreter 作为 LangChain Deep Agents 的 sandbox provider，均未标日，只记“2026 年内已发布”，不作本周动态。OpenAI 10 月 20 日的浏览器改进本次只有搜索摘要、正文未取得，不采用；Anthropic、Azure、Google 窗口内未取得可核条目。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| browser-use | 有动态：0.13.13（10-15T23:50Z，北京 10-16 07:50） | GitHub release | 是 |
| vercel-labs/agent-browser | 有动态：窗口内 10 commits（安全默认值） | GitHub commits | 是 |
| E2B | 有动态：pauseMode、SDK 2.56.0（10-19） | E2B changelog | 是 |
| Daytona | 有动态：0.225.0 B200（10-16） | Daytona changelog | 是 |
| Modal | 有动态：Python SDK 1.6.2（10-15） | Modal release notes | 是 |
| Browserbase / Stagehand | 本周无重大公开动态（10-14/10-12 均窗口外） | Browserbase changelog | 否（背景） |
| OpenAI Computer Use / Browser | 获取失败（release notes 正文只渲染到 06-10） | OpenAI 帮助中心 | 否 |
| Anthropic Computer Use | 本周无重大公开动态（未取得窗口内条目） | 检索未命中 | 否 |
| AWS AgentCore Browser / Code Interpreter | 月档有条目但无具体日期，不能证明窗口内 | AWS release notes | 否（限述） |
| Azure Browser Automation / Playwright | 本周无重大公开动态（未取得条目） | 检索未命中 | 否 |
| Google Code Execution / sandbox | 本周无重大公开动态（同执行层） | Vertex release notes | 否 |

沙箱与浏览器执行层两极分化：E2B、Daytona、Modal 把隔离环境做成可暂停、可计量、可审计的运维对象；browser-use 与 agent-browser 用开源与安全默认值抢占模型厂工具链的默认执行位。裸算力持续商品化，定价权移到治理、凭证与集成。

## 工具层：从“接得上”转向“选得准、管得住”

Arcade 在 10 月 15 日发布 [Tool Recommendation](https://www.arcade.dev/blog/tool-recommendation)，把工具选择从 reasoning 改成 retrieval。它只保留 Arcade_ListApps、Arcade_SelectTools、Arcade_UseTool 三个内置工具，由 embedding 加 ranking 从目录里检索少量工具及 schema。官方给出的规模是 8,000 多个工具全量加载需 1.75M token（Gmail 30 个、Salesforce 17 个、GitHub 43 个、Jira 45 个）；检索在 MCP 之上实现，任何 MCP client 无需改 SDK；推荐与调用都过授权、policy hook（PII/DLP）与 OpenTelemetry 审计。

效果数字全部是厂商自测或建模口径：10 轮会话输入 token 最多降 91%（GPT-5.6 从 256,650 降至 22,164，Claude Opus 5 从 411,729 降至 38,170）；token 成本最多降 37%、典型约 20%；1,000 席位、Opus 5 一年省约 119,000 美元；408 个会话、64 个工作流的端到端账单降 7.6%（95% 区间 2.5%~12.6%），完成率不变；固定 100 工具时，约 25~28 个工具以下反而更便宜。文中 Recall@10 对比被 Microsoft 自认为 “indicative rather than exact”，不能当成独立复核结果。

凭证代理的收紧更值得架构师注意。[mcp-gateway-registry 1.33.0](https://github.com/agentic-community/mcp-gateway-registry/releases/tag/1.33.0)（10 月 16 日 03:00:48Z）把 vaulted credential 的绑定对象从 origin 改为精确出站 URL，approved destinations 在 consent 开始时快照，关闭“用户授权期间新增 server 版本继承未看过批准”的窗口。代价是破坏性的：所有已连接 egress 账号需重连（oauth_user 重新授权、pat 重新提交），EGRESS_AUTH_ENABLED=true 的部署均受影响；同版修 nginx location 命名冲突，stateful backend 重连会获得新的 Mcp-Session-Id。仓库 1,010 stars / 254 forks。企业网关的差异化落在“授权对象确切性”和“同意时机”，而不是工具数量。

MCP 进入事件化的酝酿期，但本周没有新规范版本。规范 release 仍停在 2026-07-28；[规范仓库](https://github.com/modelcontextprotocol/modelcontextprotocol/commits/main) 10 月 16 日成立 Tasks and Events WG、把 Agents WG 降为 Interest Group，10 月 20 日合并 PR #3440。MCP Events 仍是 draft extension（PR #3415），覆盖 webhook、streaming 与 polling；OpenAI 已在 ChatGPT 侧实现事件订阅。支持 tools 的 client 不等于支持事件订阅，这条不能混写。

AWS AgentCore Gateway 在 10 月说明中新增 targets 的私有 CA TLS：PEM CA 证书存于 S3 或 Secrets Manager，注册到 MCP server、OpenAPI、HTTP passthrough 三类 target，Gateway 拉取作为出站信任锚，经 VPC Lattice 直连私有端点，不必前置 ALB。它与 8 月的 rate limit（按 JWT claim、IAM principal、target、tool 限流，rate=0 可紧急隔离）拼成“私网接入 + 多租户配额”底座。条目按整月归档，不能声称是本周发布。

Composio 在 10 月 21 日准备 Python SDK/provider 0.29.0、TS SDK 0.26.0、CLI 0.5.0，同日让 Vercel、LlamaIndex、Claude Agent SDK 三个 provider 透出每个工具自己的 JSON Schema（#4940），并修 certifi 版本以应对 eMudhra 中间证书泄露。公开 changelog 最新仍为 2026-09-29，只能按 commit 与 release 写；仓库 30,674 stars / 4,888 forks。它的护城河仍是 toolkit 数量与托管 auth，但竞争点正在转向跨框架 schema 一致性，这是 Agent 换框架时最容易踩的坑。

microsoft/mcp-gateway 窗口内无 commit，最新一条是 10 月 14 日的“Verify deployment ownership for adapters and tools”（#110），pushed_at 10 月 16 日只反映分支或标签推送；无 release，定位是 K8s 下的 MCP server 反向代理与会话感知路由。Nango 的 MCP Events 文章发于 10 月 14 日，窗口外一天；Pipedream changelog 最新停在 2025-10；Google Agent Gateway 仍是 10 月 7 日 preview；A2A 窗口内无发布。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| MCP 协议/治理 | 有治理动作（Tasks & Events WG；Events draft） | 规范仓库 commits（10-16/10-20） | 是 |
| A2A | 本周无重大公开动态（v1.0 为 3 月背景） | 检索无窗口内发布 | 否 |
| Composio | 有动态：SDK 0.29.0 / TS 0.26.0 / CLI 0.5.0（10-21） | GitHub commits | 是 |
| Arcade | 有动态：Tool Recommendation（10-15） | Arcade 博客 | 是 |
| Nango | 窗口内无发布（MCP Events 文 10-14，窗口外一天） | Nango 博客 | 是（背景） |
| Pipedream Connect | 本周无重大公开动态（changelog 最新 2025-10） | Pipedream 站点 | 否 |
| AWS AgentCore Gateway | 有动态：private CA target（10 月条目） | AWS release notes | 是 |
| Google Agent Gateway | 窗口内无动态（preview 10-07，窗口外） | Google 文档 | 否（背景） |
| Microsoft Toolbox | 本周无重大公开动态（GA 于 7-8 月） | Microsoft Learn | 否 |
| microsoft/mcp-gateway | 窗口内无 commit（pushed_at 10-16 仅为分支推送） | GitHub commits | 是（限述） |
| mcp-gateway-registry | 有动态：1.33.0 凭证代理收紧（10-16） | GitHub release | 是 |

本周工具层的真实进展不是“接更多 SaaS”，而是把工具选择、凭证绑定、事件触发从应用代码收进网关治理面。谁定义这三层的默认安全语义，谁掌握工具生态的议价权。

## 权限层：把长期 token 拆成三个可审计字段

身份层的增量不在新 IdP，而在“代表用户行动时的凭证边界”。前文 mcp-gateway-registry 1.33.0 的精确 URL 绑定，针对的是一个具体越权窗口：用户跳转 provider 授权期间新增 server 版本，旧实现回调时重读目标集合，会让新目标继承未看过的批准。它把 OAuth 同意从一次点击变成有作用域、有时点的授权快照，安全收紧与运维体验仍在拉扯。

Arcade 的授权模型是另一个参照：每次 action 在“用户可做 ∩ Agent 被允许做”的交集上即时授权；用户走 provider OAuth，runtime 只申请该 action 所需的 scope；凭证存 Arcade vault，不进模型上下文。执行前后 hook 接企业 policy engine 或 IdP，做 PII 筛查与 DLP；访问过滤在推荐与调用两处都生效；所有推荐与调用统一审计，经 OpenTelemetry 进现有栈；支持云端、自建与气隙部署。把“检索”也纳入权限检查点是关键细节，否则推荐层会成为绕过 ACL 的侧信道。

Nango 的 Agent Sessions 提供了反向教训（仓库页面显示 12.7k stars）。它通过 MCP 暴露工具，模型拿不到 provider 原始凭证；后端在运行前指定连接、允许的工具与过期时间，例如把“发送回复”留到单独的授权步骤。但官方提示默认包含全部已连接集成，需要显式限制工具并关闭 generic proxy，记录级权限仍要靠工具代码实现。能力收窄靠配置、不靠模型自觉，默认值偏宽就是风险；工具授权应绑定 session 级快照，而不是长期连接。

三大云厂的 Agent Identity 本周都没有窗口内新发布：AWS Consent Portal 在 9 月，Google Agent Gateway 是 10 月 7 日 preview（窗口外），Microsoft Entra Agent Identity 本次未取得。Composio 本周也无身份侧新能力，只有 SDK 与 provider 维护。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| AWS AgentCore Identity | 本周无重大公开动态（Consent Portal 为 9 月背景） | AWS release notes | 否 |
| Microsoft Entra Agent Identity | 本次未取得窗口内官方发布 | 检索无条目 | 否 |
| Google Agent Identity / Gateway auth | 窗口内无动态（preview 10-07 窗口外） | Google 文档 | 否 |
| Arcade Auth / tool permission | 有动态（授权交集 + hook + 审计，随 10-15 发布） | Arcade 博客 | 是 |
| Composio Auth | 本周无身份侧新能力（仅 SDK/provider 维护） | GitHub commits | 否 |
| Nango OAuth / token | 窗口内无发布（Agent Sessions 文 10-14 背景） | Nango 博客 | 是（背景） |
| Pipedream managed auth | 本周无重大公开动态 | Pipedream 站点 | 否 |
| mcp-gateway-registry | 有动态：1.33.0 凭证绑定收紧（10-16） | GitHub release | 是 |

Agent 身份问题正被拆成“谁在行动、能碰哪个确切资源、这次运行允许哪些工具”三个可审计字段，而不是一张长期有效 token。

## 记忆层：从记忆 API 变成上下文数据库

OpenViking 本周的重心不在召回算法。[v0.5.1](https://github.com/volcengine/OpenViking/releases/tag/v0.5.1)（10 月 19 日，自 v0.5.0 起 151 commits）与 [v0.5.1.1](https://github.com/volcengine/OpenViking/releases/tag/v0.5.1.1)（10 月 20 日修缺陷）把 Gateway 做成可嵌入 Server，模型与管理接口走 /gateway，地址从 :1935/v1 迁到 :1933/gateway/v1，并引入独立的 gateway.management_key，root 与 admin 也不能绕过。

其余变更都指向数据库该有的运维面：隐私字段级引用与原子更新，ov privacy reference 默认只返回 owner 引用，resolve 才读明文，扫描默认 dry-run；batch_write 支持整批 processing_mode、每文件 tags/ACL、expected_sha256 与 skip_conflicts；image_url 支持有序多图，CLI 新增 ov search --mode context；Session idle auto-commit 可选 Redis 调度，Account Store 新增 MySQL 与 Redis+MySQL，多写存储升级到 V2 分区日志加 checkpoint；新增 Microsoft Agent Framework context provider；MCP 新增 download(uri)，约 10 分钟的一次性链接。

迁移代价同样明确：write(mode="create") 变为 replace 的别名且不再返回 409，POST /sessions/{id}/extract 移除，wait 的 timeout 移除，trusted 模式强制非空 root key。v0.5.1.1 修的是“后续 commit 记忆搜不到”（#6331）。仓库 40,528 stars / 3,251 forks，openviking-sdk 0.1.16、@openviking/cli 0.5.1。短期最大风险是升级破坏性，而不是功能不足。

[cognee v1.6.5](https://github.com/topoteretes/cognee/releases/tag/v1.6.5)（10 月 16 日 20:10Z，北京 10 月 17 日 04:10）的主题是蒸馏可靠性、embedding 计量与连接器加固：蒸馏只读所需 QA 轮次、按 curator 批次封存、默认逐条 curate；函数、类、模块的 docstring 存为一等图文档并链接代码符号；新增 Memify API/CLI；trace 整段 backlog 存单文档，并用单次 cognify 建 trace pass window；embedding 支持 base64、按 activity 记录 token 用量、默认 batch 从 36 降到 32；本地模型缓存统一到 ~/.cognee/models。安全侧每日 CVE 摘要推 Slack、收敛 Azure token、加固 Gmail 与 Google Calendar、Cypher 关闭时返回 403。破坏性变更是移除或弃用 triplet embedding 与 triplet memify。该版含 12 个 PR，依赖 litellm 1.102.2 至 2.0.0 以下、lancedb 0.39.x；仓库 32,632 stars / 3,382 forks。embedding token 计量把记忆成本显性化，docstring 入图则直接服务 coding agent 的召回。

supermemory 在 10 月 15 日至 18 日共 16 个 commit，主线是 MCP 授权边界与 v5 API 文档对齐：MCP 只返回调用者可用的 ID 与 space；prompts/resources 共享可访问的默认空间并优先可写空间；forget 从 LLM 匹配改为按 ID 精确删除；认证失败分级（预期拒绝记 warn、认证服务不可用记 error）。文档侧统一 billing、analytics、self-hosting、connectors 与 v5 ingestion 页面，并修 namespace 迁移与 scoped keys。仓库 31,342 stars / 2,741 forks，窗口内无 release。[commit 记录](https://github.com/supermemoryai/supermemory/commits/main) 显示最新一条为 10 月 18 日 02:37Z。把记忆当多租户数据面，授权粒度与精确 forget 已是企业采购硬条件。

Zep / Graphiti 三连发：v0.31.0（北京 10 月 15 日 07:58）、v0.31.1（10 月 15 日 23:02）、[v0.31.2](https://github.com/getzep/graphiti/releases/tag/v0.31.2)（10 月 21 日 01:25），窗口内共 23 个 commit。v0.31.0 引入 LLMRuntime 统一 prompt 与模型路由，C2 组合抽取 prompt 成为默认，新增 Jev 与 OpenAI Decisions 客户端去重，MCP server 升到 SDK 2.x 并按 group_id 路由图谱，FalkorDB 6.x 改 DDL 全文索引，默认模型从 gpt-4.1-nano 换成 gpt-6-luna（21 项 PR）。v0.31.2 因 eMudhra 被攻破紧急升 certifi，固定 graphiti-core 0.31.2 与 MCP server 1.1.3；仓库 32,113 stars / 3,280 forks。时序知识图谱的竞争已转向多图谱隔离、去重质量与供应链安全。

Mem0 窗口内只有 1 个文档 commit（10 月 21 日 01:16Z，重写 BYOK 页面 #7661），无 release，最近版本 v2.2.1 为 9 月 25 日；仓库 67,598 stars。Letta 窗口内 2 个 README commit（10 月 18 日，#3454 移除桌面应用表述），无 release；25,219 stars。单点记忆 API 的差异化正被平台内嵌能力侵蚀，Letta 的“记忆即运行时”叙事本周没有新增证据。

摄取层高度集中在 Firecrawl 与 Crawl4AI。[Firecrawl 仓库](https://github.com/firecrawl/firecrawl/commits/main) 窗口内至少 100 个 commit：provider tools 零数据留存（#5178）并补计费测试（#5304），请求错误日志脱敏（#5301），新增 PDF 索引一致性开关 INDEX_SKIP_ON_PDF_REFRESH 与 INDEX_PDF_SUPERSEDE_CHECK（#5292/#5293），v2 OpenAPI spec 替换 v1（#5303），品牌问答默认走 Jev（#5175）。193,914 stars，无窗口内 release。Crawl4AI 本周无窗口内发布，[v0.9.5](https://github.com/unclecode/crawl4ai/releases/tag/v0.9.5) 为 10 月 14 日（背景），release 页只指向 CHANGELOG；85,990 stars。摄取层的竞争已是“抓得合规、索引不脏、可计费”，零留存与日志脱敏直接对准企业法务。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| OpenViking | 有动态：v0.5.1（10-19）、v0.5.1.1（10-20） | GitHub releases | 是 |
| Cognee | 有动态：v1.6.5（10-16T20:10Z，北京 10-17 04:10） | GitHub release | 是 |
| supermemory | 有动态：16 commits，MCP 授权收紧（10-15~10-18） | GitHub commits | 是 |
| Zep / Graphiti | 有动态：v0.31.0/1/2 三连发 | GitHub releases | 是 |
| Mem0 | 近乎静默：窗口内 1 个文档 commit | GitHub commits | 是（短） |
| Letta | 静默：2 条 README commit | GitHub commits（10-18） | 是（短） |
| Firecrawl | 有动态：至少 100 commits，零留存/日志脱敏 | GitHub commits | 是 |
| Crawl4AI | 本周无窗口内发布；v0.9.5 为 10-14（背景） | GitHub release | 否 |

记忆知识层的主线不是“记得更准”，而是“像数据库一样可运维、可审计、可迁移”。多租户隔离、隐私字段、批量一致性、供应链安全决定谁能成为 Agent 上下文底座，代价是破坏性升级频繁。

## 可观测层：trace 成为网关与权限的旁路数据

发版密度本身成了竞争指标。LangSmith 在 10 月 12 日至 19 日的[周更](https://docs.langchain.com/langsmith/changelog) 包含四条主线。权限最小化：tracing-only API key 限定在单个 workspace，只能写 run、建 project，泄露后也不能读或改；Engine 权限拆成 read/manage 与 usage-controls；workspace secret 绑定 allowed hosts；部署密钥改为 DEPLOYMENT_RUNTIME（Editor 加 gateway/sandbox/agent-auth），不再默认 workspace admin。网关：LLM Gateway 接入 ScaleDown（summarize、extract、classify、compress 与 Decisions），支持 /scaledown、统一的 /v1/chat/completions 与 /v1/systemone，可按 ScaleDown 计价并 fallback，另新增 Anthropic 兼容端点。数据主权：可在自有 GCP 项目创建或删除 BYOC data plane（仅 API，限 US control plane），AWS data plane 可只存 SmithDB 而不用 ClickHouse。沙箱：AWS、GCP、Azure 的短期工作负载身份替代静态密钥，运行中可 live-migrate；OTel trace 可用 Langsmith-Agent-Id 头投递；cache token 按缓存费率计价。webhook 连续失败 3 次标记为 FAILING。

Langfuse 一周连发五版：v4.63.0（北京 10 月 16 日 22:33）、v4.64.0（10 月 20 日 01:34）、v4.65.0（10 月 20 日 21:35）、v4.66.0（10 月 21 日 01:31）、[v4.67.0](https://github.com/langfuse/langfuse/releases/tag/v4.67.0)（10 月 21 日 19:31）。三块变化：Skills 成为一等对象（public v4 preview，带 usage metrics，恢复 MCP 访问，ingestion 接受 name/version 的 skill catalog）；Topics 聚类（大批量非阻塞、按 facet 命名、trace map、成本按 run 展示、失败打 Datadog）；AI Gateway（按内存预算准入、按 origin 归因错误并度量开销、self-hosted 的 “None” ingestion、发布时同步 gateway 镜像）。Langfuse Assistant 更名为 Halo，API key 默认启用 project 权限。仓库 36,146 stars / 4,016 forks；五连发意味着升级回归成本高，生产应固定小版本。

Braintrust 在 10 月 20 日 02:44 发布 braintrust@3.38.0 与 @braintrust/otel@1.1.0，核心是 OTel span customizers：导出前定制，报错 fail closed 但不丢记录；追踪扩到 decisions API 与 media，typesafe 捕获 image 输入，并修凭据被排队登录替换的问题。3.39.0 已出窗口，stars 本次未取得。Arize Phoenix 的 v20.22.0（10 月 15 日 07:02Z）与 [v20.23.0](https://github.com/Arize-ai/phoenix/releases/tag/arize-phoenix-v20.23.0)（10 月 16 日 03:16Z）让 server 日志可 OTLP 导出（#17010）、playground 对 Bedrock 工具结果按文本转发，并在文档中加入 Atomic Agents tracing；11,940 stars，v20.24.0 已出窗口。

Helicone 窗口内只有 4 个 commit（10 月 19 日至 20 日），全为安全与上游同步：Sync security fixes（#5841/#5842/#5844）、钉 Node engines（#5843），无 release。其公开仓库是私有主干的 downstream 镜像，外部无法逐条审计，6,231 stars；这种“私有核心 + 公开外壳”会放大安全信任成本。

AgentOps 窗口内无 commit、无 release，最新 0.4.21 停在 2025 年 8 月 29 日；Coze Loop 最新 v1.5.1 为 2026 年 1 月 20 日，长期停更，评测能力更多收进 Coze/Ark 平台侧。标准层则继续收敛：[OTel semantic-conventions-genai](https://github.com/open-telemetry/semantic-conventions-genai/commits/main) 窗口内 7 个 commit，要求 execute_tool 必须用 provider 提供的 tool call ID（#489/#525）、澄清 MCP 错误属性（#452）、可选 token usage 仅非零上报（#548）、启用 strict conformance（#444），最新一条为 10 月 21 日 05:38Z。agent trace 的字段级标准从建议走向可测试的一致性，SDK 不能再自定义语义蒙混。

| 对象 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| LangSmith | 有动态：10-12~10-19 周更 | LangSmith changelog | 是 |
| Langfuse | 有动态：v4.63.0/4.64.0/4.65.0/4.66.0/4.67.0 | GitHub releases | 是 |
| Helicone | 弱动态：4 个安全/上游同步 commit（10-19~10-20） | GitHub commits | 是（短） |
| Braintrust | 有动态：braintrust@3.38.0 + @braintrust/otel@1.1.0 | GitHub releases | 是 |
| Arize Phoenix | 有动态：v20.22.0（10-15）、v20.23.0（10-16） | GitHub releases | 是 |
| AgentOps | 静默：无 commit/release（最新 0.4.21 2025-08-29） | GitHub | 否 |
| Coze Loop | 静默：最新 v1.5.1（2026-01-20） | GitHub | 否 |
| OTel for Agents | 有动态：semconv-genai 7 commits | GitHub commits | 是 |

可观测层正被“网关 + 技能/提示版本 + 最小权限”重新定义：trace 是策略执行与成本归因的旁路数据，分水岭是谁能同时做对 OTel 语义、写权限隔离与回放。

## 平台控制面：评测、留存与网络接入被打成采购组合

AWS 把 AgentCore 的评测、记忆与网关补成闭环。FailureAnalysis 在 agent session 中找失败、判根因、跨 session 聚类为 insight，每条 insight 带修复建议（改 system prompt 或 tool definition），结果在 GetBatchEvaluation.insightResults。评测从打分推进到“根因 + 修复建议”，压缩了调优人力；TTL 与分项计费解决留存合规与成本可预测；私有 CA 则是金融与政企的硬门槛。

Google 把“修漏洞 Agent”做成平台一等公民。10 月 21 日的 CodeMender v0.16.0 支持并发逐文件 deep scan、新增 cm health 预检、单轮读文件上限 256 KiB、run_command 超时 120s/300s、修沙箱写 audit.log 失败，部分失败报 INCOMPLETE；它自带沙箱、resume、audit log 与用量统计，嵌入 DevSecOps。10 月 14 日 DeepSeek-V4.1-Flash 以 MaaS 进入 Model Garden，支持文本与图像、1M 上下文，处于 Public Preview。平台用“垂直安全 Agent + 模型中立目录”扩张，模型目录中立化保住平台议价权，而 ADK 本周空窗。Google runtime 层的静默是转向 Gemini Enterprise 控制面还是节奏问题，本次无法判断。

[Microsoft Foundry 的 9 月更新博文](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-september-2026/) 发布于 10 月 15 日，汇总的功能多在 9 月上线。除前文的 Routines，Tool Search 转为 GA：Toolbox 通过 tool_search 与 call_tool 暴露工具发现和调用，不再把全量定义塞进每次请求；A2A 转入 GA；Insights 进入 preview，从 trace 找重复问题并给证据与建议；Voice 与长任务 hosted-agent 韧性为 preview；Model Router 加入 session affinity 与 routing metadata，覆盖 32 个区域；hosted agent 可同时暴露 Responses、Invocations、Activity 三种协议。agent 自助 reminder 仍为 preview。平台管生命周期、框架管逻辑的分工因此更清楚。

火山方舟走的是“订阅套餐 + Harness 打包”。[Agent Plan](https://docs.volcengine.com/docs/ark/agent-plan-personal-plan-overview) 分 Small、Medium、Large、Max 四档，40/200/500/1000 元/月，用 AFP 计量，月额度分别为 2 万、10 万、25 万、50 万，另有周、5 小时、日额度。Harness 权益含专业数据集、豆包搜索（500 次/月免费）、Agent 记忆、AI Native 应用开发底座、Agent 进化（前 50 个文件免费）、Computer Use（仅 Large/Max），Harness 类不计 5 小时与周额度，只受日、月额度约束。计费活动包括 10 月 12 日至 25 日 kimi-k3 抵扣系数 5 折，10 月 20 日至 12 月 30 日 deepseek-v4.1-flash-economy 再 5 折。接入面写明 OpenClaw、Hermes Agent、Claude Code、OpenCode。把 Harness 当套餐权益卖，用 AFP 降低预算不确定性，对独立 Harness 创业公司则是补贴压力。

阿里云百炼的应用发布说明最新仍为 2026-02-10，窗口内无条目；主线与快照模型下线在 10 月 10 日生效，属窗口外的模型生命周期。腾讯云只见到 10 月 18 日 ADP 博客的列表摘要（员工集中使用获授权智能体、团队文件跨会话复用、知识库支持企微文档导入与时效性检索），正文未读，只能作线索；元器停发 API key 的日期也在窗口前。Databricks 本周无重大公开动态，Agent Bricks 负责企业数据构建与治理，Mosaic AI Agent Framework 负责编排与评测，共用 Unity Catalog，这些是背景而非本周变化。

| 平台 | 本周状态 | 证据源 | 是否深写 |
|---|---|---|---|
| AWS Bedrock AgentCore | 有动态（10 月四项：FailureAnalysis、Memory TTL、短期记忆分项计费、Gateway 私有 CA） | AWS release notes（10-22 抓取） | 是 |
| Google Gemini Enterprise Agent Platform | 有动态（CodeMender v0.16.0 10-21；DeepSeek-V4.1-Flash 10-14） | Google release notes | 是 |
| Microsoft Foundry | 有动态（10-15：Routines/Tool Search/A2A GA、Insights preview） | Foundry 博文（10-15） | 是 |
| 阿里云百炼 / PAI | 本次未取得窗口内条目（最新 2026-02-10） | 阿里云帮助中心 | 否 |
| 火山引擎 Ark / Coze | 有动态（Agent Plan 套餐与 Harness 权益；10-20 起 economy 模型 5 折） | 方舟文档（10-22 抓取） | 是 |
| 腾讯云 ADP / 元器 | 获取失败（仅见 10-18 博客摘要） | 腾讯 ADP 博客（仅摘要） | 否（限述） |
| Databricks Mosaic AI | 本周无重大公开动态 | 产品页（无日期） | 否 |

### 云厂能力矩阵

| 平台 | Runtime / Session | Memory / Context | Gateway / Tools | Identity / Auth | Sandbox / Browser / Code | Observability / Eval | 本周强信号 |
|---|---|---|---|---|---|---|---|
| AWS | AgentCore Runtime；Instances 计算型支持最长 14 天持久会话（9 月背景） | 长期记忆 TTL（recordExpirySpecification）；短期记忆按 ingestion/retrieval/storage 计费 | Gateway 私有 CA TLS、直连 VPC Lattice；rate limit（8 月） | AgentCore Identity；Consent Portal（9 月背景） | 内置 Code Interpreter/Browser（月档未标日）；9 月交互式 shell（背景） | Builtin.FailureAnalysis 批量评测 + insight | 评测从打分到根因；记忆成本与留存可控 |
| Google | Agent Engine / Agent Platform（既有）；ADK 本周无 release | Memory Bank（既有）；DeepSeek-V4.1-Flash 1M 上下文入目录 | Agent Gateway（既有，10-07 preview 窗口外） | Agent Identity 与语义治理策略（既有） | CodeMender 沙箱会话 + audit log；256 KiB 读上限 | App Topology 与策略拒绝审计；CodeMender 用量统计 | CodeMender v0.16.0（10-21） |
| Microsoft | Foundry hosted agents；长任务韧性 preview；Routines 调度 GA | Foundry memory（既有）；session 状态由 Responses 托管 | Toolbox + Tool Search GA；A2A GA；三种协议 | Entra Agent ID（既有）；trace ingestion Entra 认证 preview | Code Interpreter / Browser Automation（既有） | Insights preview（trace 归因）；Agent Monitoring Dashboard | Routines、Tool Search、A2A 三项 GA（博文 10-15） |
| 阿里云 | 百炼智能体/工作流（既有）；本次未取得窗口内更新 | 长期记忆 2.0 API（1 月背景） | MCP 市场与自定义 MCP（背景） | RAM 子账号/分账（背景） | 代码解释器插件（背景） | 应用观测 OTel（背景） | 本次未取得 |
| 火山/字节 | 方舟 Agent Plan 托管 Harness；Coze/Coze Studio（既有） | 套餐含 Agent 记忆 Harness | 豆包搜索 Harness；MCP 兼容（既有） | 主账号/IAM 角色（文档提及 iam:CreateRole） | 套餐含 Computer Use Agent（Large/Max） | Coze Loop（既有）；AFP 用量明细 | 订阅套餐把 Harness 权益打包（10 月文档） |
| 腾讯云 | ADP 智能体/工作流（既有）；本次未取得更新 | 知识库（企微文档导入，仅摘要） | 插件/MCP（既有，未核） | 企业授权分发（仅摘要） | CloudBase AI Toolkit（既有，未核） | 本次未取得 | 仅 10-18 博客摘要，正文未读 |
| Databricks | Model Serving / Agent Bricks 部署（既有） | Unity Catalog + 向量检索（既有） | MCP/工具（既有，未核） | Unity Catalog 权限（既有） | 本次未取得 | Mosaic AI 评测（既有） | 本周无重大公开动态 |

矩阵中的“既有/背景”只用于列完整性，不作本周动态；“本次未取得”表示本轮无可核证据，不代表平台没有该能力。矩阵的实际缺口集中在 Identity 与 Observability 的跨平台可比性。

平台竞争从“有没有 Agent 服务”转为“能否把评测归因、记忆留存、私有网络接入、调度与身份打成可采购组合”。AWS 与 Microsoft 各补一块，中国云厂用订阅套餐前置打包，商品化路径出现分叉。

## 五个信号最强的变化

1. **Microsoft Foundry 把调度、工具发现、trace 归因同时收进平台。** Routines、Tool Search、A2A 转入 GA，Insights 与长任务韧性为 preview，博文发布于 2026-10-15。它一次性重画了“平台控制面与框架编排”的边界，且官方自我限定“不替代编排与审批”，为 Harness 厂商提供了可复制的职责切分。局限是功能上线多在 9 月，属于发布事件在窗口、功能时点在窗口前。
2. **AWS AgentCore 把评测、记忆留存、私有网络接入补成可采购组合。** FailureAnalysis、Memory TTL、短期记忆分项计费与 Gateway 私有 CA 同时到位。评测从打分变为“根因 + 修复建议”，记忆从功能变为可计量成本项，直指企业采购的三个硬条件。局限是发布说明按月归档，除 SDK 1.24.1（10-19）外不能逐条证明窗口内日期。
3. **OpenViking v0.5.1 与 v0.5.1.1 把 Memory 推向“上下文数据库”。** 多实例 Redis/MySQL、字段级隐私、批量写入冲突检测与 Gateway 管理密钥同时出现。模块定位发生迁移：竞争从召回效果转向数据库运维面（多租户、迁移、回滚），10 条破坏性变更也说明它已进入生产部署阶段。
4. **Arcade Tool Recommendation 把工具选择改成检索问题。** 官方称输入 token 最多降 91%、成本降 37%。它为“工具目录无限膨胀”给出可落地解，并把权限检查嵌入推荐与调用两处；工具网关的稀缺资源从连接数变为上下文预算与治理面。局限是数字为厂商自测或建模口径，未独立复核。
5. **浏览器执行层转向“安全默认值”。** vercel-labs/agent-browser 窗口内 10 条提交包含策略 fail-closed、schema 白名单、拒绝隐藏/禁用/视口外点击、拒绝歧义 stale-ref；browser-use 0.13.13 成为 OpenAI browser-tool 驱动。Agent 浏览器从“能力覆盖”进入“安全失败与误操作防控”竞争，开源项目正抢占模型厂工具链的默认执行位。

MCP 事件化（Tasks & Events WG、Events 仍为 draft）与 mcp-gateway-registry 的凭证精确绑定，因“尚未定稿/单点安全修复”列为次强观察，未进前五。

## 价值链：价值落在治理、凭证与迁移

把本周对象放回“模型与算法 → 运行时/Harness → 协议与工具生态 → 平台与工具链 → 系统集成与交付 → 终端场景”的链条，可以看到议价点正在换位置。

| 对象 | 链条位置 | 本周价值/议价信号 |
|---|---|---|
| trueforge | 运行时/Harness（自托管） | 沙箱与可观测做成产品面，议价点从“编排功能”转向“运维可信度” |
| OpenAI Agents SDK | 运行时/Harness（SDK） | 修审批与压缩冲突，巩固“SDK 即控制层”默认选项地位 |
| LangGraph | 运行时/Harness + 平台与工具链 | checkpoint prune + serverless 默认部署，向托管编排平台上移 |
| Microsoft AF / Foundry | 运行时/Harness → 平台与工具链 | 框架定状态语义、平台收调度/工具发现/归因，控制面集中 |
| AWS AgentCore | 平台与工具链 | 评测归因 + 记忆 TTL + 私有 CA，向可采购企业平台收敛 |
| Google Agent Platform | 平台与工具链 | CodeMender 嵌入安全运维；模型目录中立化保住平台位置 |
| 火山方舟 Agent Plan | 平台与工具链（订阅） | Harness 权益打包 + 兼容外部客户端，靠渠道与价格抢入口 |
| OpenViking / Cognee | 运行时/Harness（上下文存储） | 记忆数据库化，向平台内嵌存储层上移，压制单点记忆 API |
| Arcade / mcp-gateway-registry | 协议与工具 | 工具检索与凭证边界成为议价点，网关收“治理税” |
| browser-use / agent-browser | 协议与工具 → 运行时（浏览器驱动） | 开源抢占模型厂工具 schema 的默认执行位 |
| E2B / Daytona / Modal | 运行时/Harness（执行底座） | 拼 GPU 规格、生命周期字段、运营面，价格与差异化同时下压 |
| OpenClaw | 运行时/Harness（自托管客户端） | 被云厂列为接入目标，渠道价值上升；控制面标准输出不足 |

传导方向有三条值得记。上游模型厂把浏览器与工具 schema 标准化，中游开源驱动与网关受益，下游 Harness 的“连接能力”被商品化。云厂把 cron、评测、记忆留存、私有网络收进平台，自建 Harness 的剩余空间集中在“跨云、跨模型、可迁移”。火山用订阅套餐给基础 Harness 能力定价（40 元/月起），AWS 把记忆改为分项计费，两侧共同压低自建基础 Harness 的溢价。增量价值因此落在治理、凭证、迁移与可观测，而非裸算力或 DSL 表达力。

## 解决方案透镜：本周能确认的落地信息

本周材料以产品与版本发布为主，没有可完整支撑五要素的客户落地案例。按已披露内容逐项标注，未披露即写“未披露”。

| 对象 | 怎么搭的 | 交付给谁 | 什么代价 | 踩了什么坑 | 能否复制 |
|---|---|---|---|---|---|
| 火山 Agent Plan | 方舟托管 Harness + 外部客户端（OpenClaw、Claude Code 等）+ AFP 计量 | 个人开发者/小团队（订阅套餐）；规模未披露 | 40/200/500/1000 元/月；额度与超限规则已披露；TCO 未披露 | 未披露 | 可复制到“模型厂 + 订阅制 Harness 分发”，前提是自有模型与渠道；企业私有化边界未披露 |
| Microsoft Foundry Routines | 触发器 + hosted agent + 项目内身份/运行历史；编排交给 Agent Framework | 企业 Azure 客户；行业/规模未披露 | 定价未披露 | 官方明确长任务需自做 checkpoint 与幂等，“重连不会让重复外部动作变安全” | 可复制到定时/事件型 Agent；不适用于复杂多 agent 编排（官方自限定） |
| Arcade Tool Recommendation | MCP 之上加检索层 + actions runtime 授权/policy/OTel | 工具目录规模大的平台/企业；客户名未披露 | 未披露（仅给 token/成本节省模型） | 工具数少时反而更贵（约 25~28 个以下） | 可复制到工具目录膨胀场景；依赖高质量工具描述与 embedding |

演示不等于规模部署，试点不等于付费交付，采购不等于收入；上表不构成采用规模或收入判断。

## 对自建 Harness 的六条参照

1. **会话与审批状态需要 schema 版本与迁移策略。** Microsoft 1.22.0 的持久化兼容警告、OpenAI 的 pending-approval 压缩修复、LangGraph 的 resume 修复指向同一风险。把 session 与 approval 记录当作可升级资产并标注 schema 版本，可以避免“升级即失忆”，也便于企业审计与跨版本回放。
2. **turn 级硬超时，加上缺失 tool.response 的兜底。** trueforge 把 exec deadline 设为“命令超时 + 5s”，显式避免一次工具挂起吞掉整个会话；工具运行时应对每次调用设置可观测 deadline，超时写入结构化错误事件。
3. **策略与配置加载必须 fail-closed。** agent-browser 本周把“策略文件读不到就拒绝”作为修复主题；tool policy 与 exec 审批在配置缺失、解析失败时应拒绝而非降级放行，工具参数按 schema 白名单校验。
4. **调度边界保持克制，补统一运行视图。** Foundry 明确 Routines 只“一个触发器启动一个 agent”，不承担编排与审批；cron 宜维持“触发 + 隔离 run + 交接产物”，把多 agent 编排留给 sessions 与 subagents，应补的是触发器来源与运行历史的统一视图，而非再引入外部调度器。
5. **可观测对外接口与权限隔离。** trueforge 用 GET /metrics 暴露 rate、status、latency；LangSmith 把 tracing-only key 做成只写不可读。对外可核运行指标有限时，补只读指标端点或结构化 run 事件导出，并天生分离 trace 写/读权限，会显著降低企业评估成本与会话泄露风险。
6. **渠道即资产，但需版本化接入契约。** 方舟 Agent Plan 单列 OpenClaw 接入页与 1M 上下文方案，说明“被云厂支持”能直接换取用户；反向要求接入文档、版本兼容策略与 changelog 可引用、可版本化。

## 本期证据边界

覆盖面上，八个模块均有结论、状态表与洞察，其中权限层与平台控制面的深度受一手材料限制，相关判断按限述处理；七个平台完成扫描，其中 AWS、Google、Microsoft、火山/字节取得窗口内可核动态，阿里云、腾讯云、Databricks 未取得可用窗口证据。GitHub 热度查询覆盖九个方向，补入 OpenViking、cognee、trueforge、microsoft/mcp-gateway、langfuse、browser-use、mcp-gateway-registry、vercel-labs/agent-browser 八个对象，已过滤 awesome-list、教程与应用模板。

未取得项按原因列出，不用“未披露”推断“无能力”：

1. Anthropic 的新闻页只返回站点壳或登录入口，窗口内 Agent SDK 与 MCP 正文未取得；10 月 21 日 Claude Opus 5.5 仅有列表摘要，未读正文，不写成事实。
2. AWS release notes 按月归档，四项未逐条标日；只有 PyPI 与 SDK 1.24.1（10-19）可精确证明，本轮未查 RSS 或公告页。
3. OpenAI 的 ChatGPT release notes 正文只渲染到 2026-06-10，10 月 20 日浏览器改进只有搜索摘要，未采用。
4. 腾讯云 ADP 的 10 月 18 日条目只有列表摘要，正文未读；元器停服与迁移指引日期在窗口前。
5. 阿里云百炼应用功能动态最新为 2026-02-10，窗口内无条目，不推断为停滞或无能力。
6. Microsoft Entra Agent Identity、Azure Playwright、Google Code Execution 窗口内未取得官方材料，记“本次未取得”。
7. browser-use 的“每浏览器小时 0.02 美元”只出现在仓库描述与第三方文，官方定价页未列，标为未独立确认。
8. 本周主张均为官方一手材料（GitHub release、commit、AWS/Google/Microsoft/火山官方文档与博客），未做独立二源，按“单源原始事实”采用并注明口径。
9. CrewAI AMP/Studio、Dify、n8n、Flowise 未取得基础设施级动态；Pipedream、Microsoft Toolbox、A2A 窗口内无公开更新。

这些缺口限定了结论的粒度：本周能确认方向与具体版本动作，不能确认客户采用规模、实际总拥有成本与长期稳定性。
