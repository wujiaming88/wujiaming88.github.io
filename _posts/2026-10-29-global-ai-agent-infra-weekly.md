---
layout: single
title: "AI Agent 基础设施周报（第19期）：恢复不重放"
date: 2026-10-29 06:00:00 +0800
categories:
  - AI
tags:
  - AI Agent
  - Agent Infrastructure
  - Agent Harness
  - MCP
  - Agent Memory
bucket: agent-infra
excerpt: "窗口 2026-10-22 ~ 10-28｜第 19 期：恢复和重试时，已发生的副作用不再发生第二次；策略执行点下沉到工具网关。"
header:
  overlay_image: /assets/images/posts/2026-10-29-agent-infra-cover.png
  overlay_filter: 0.35
toc: true
toc_sticky: true
toc_label: "本期目录"
---
**本周主线：Agent 基础设施的门槛从"会话能否恢复"推进到"恢复和重试时，已经发生过的副作用不会再发生一次"。**

上一期解决的是会话能否可靠中断与恢复。本周 OpenClaw 把 replay-safe 会话恢复放上头条，E2B 让服务端声明能否重试并给沙箱创建加幂等键，AWS AgentCore Gateway 给模型流量加了有序 fallback 和默认熔断。第二条线是策略执行点正下沉到工具网关和 SDK 契约；代价是 Dify、Microsoft Agent Framework、Google ADK、OpenViking 同周发出需要迁移的变更，升级本身成了运维成本。

## 本周 TOP 5

### 1. OpenClaw：replay-safe 会话恢复，并开出 LTS 轨

- **事实**：[2026.10.7](https://github.com/openclaw/openclaw/releases/tag/v2026.10.7)（10 月 25 日）头条为 Replay-safe session recovery：中断的会话保留恢复溯源（recovery provenance）与未完成的工具结果，已停止的会话在接收下一条消息前先清掉终态恢复残留（涉及 #153728、#168764、#172068、#177716 等 9 个 PR）。[2026.10.8](https://github.com/openclaw/openclaw/releases/tag/v2026.10.8)（10 月 28 日）让被 kill 的 run 释放 restart-recovery fence，回复运行时无法发布时入站消息不再无限重试；沙箱内子进程不能再运行宿主 CLI 后端（#178742）。[2026.9.34](https://github.com/openclaw/openclaw/releases/tag/v2026.9.34) / [2026.9.35](https://github.com/openclaw/openclaw/releases/tag/v2026.9.35)（10 月 24 / 27 日）被官方定义为 gateway-only extended-stable，原文称 "our current equivalent to LTS"，只叠加关键安全、可靠性修复与新模型支持。
- **为什么重要**："恢复不重放"加"主线 + LTS 双轨"，回答同一个采购问题：自托管 Harness 能否被长期持有，而不必每周追升级。
- **证据级**：A（上期 CHANGELOG 无发布日只能作本机观测，本期公开 release 完整计入窗口）。

### 2. AWS AgentCore Gateway：模型流量进入 Agent 网关

- **事实**：10 月 22 日 16:00（北京时间）发布 [InvokeModel 与模型 fallback](https://aws.amazon.com/about-aws/whats-new/2026/10/agentcore-gateway-invokemodel-fallback/)。原本面向工具（MCP 目标、Lambda、OpenAPI）的 Gateway 开始接收模型调用：InvokeModel 与 OpenAI、Anthropic 方言双向翻译，流式响应重新分帧；`matchModels` 选目标后按有序 fallback 链切换，每个目标可设首字节超时，熔断默认开启。
- **为什么重要**：多模型容灾与成本路由从应用代码移到控制面，工具与模型共用同一个策略点、计量点和审计点。上期 AWS 的重点是失败分析、记忆 TTL 与私有 CA，本期它把"流量"收进网关。
- **证据级**：A。

### 3. E2B：重试与幂等写进沙箱协议

- **事实**：2.59.0（10 月 23 日）新增 `dnsServers` 闭合 DNS 出站；2.60.0（10 月 26 日）按服务端 `Should-Retry` 头决定是否重试，请求发出后的网络错误不再自动重试；[2.61.0](https://github.com/e2b-dev/E2B/releases/tag/e2b%402.61.0)（10 月 27 日）给 `Sandbox.create` 加 `Idempotency-Key`。
- **为什么重要**：客户端不再猜"失败了没有"，重来也不会创建第二个沙箱；重复创建、重复计费、重复副作用从应用层兜底变为基础设施承担。它与 OpenClaw 构成链条两端：Harness 记录哪些调用已完成，执行环境保证同一请求只生效一次。
- **证据级**：A。

### 4. Composio session hooks：工具网关成为策略执行点

- **事实**：core 0.27.0（10 月 22 日）可在工具执行前、以及结果到达 Agent 前拦截，条件可用自然语言写，被拦调用返回 `resultType: 'blocked'`；`proxyExecute` 的权限闸与返回结构随之变化，依赖旧返回值的代码需检查。
- **为什么重要**：工具治理从"连接器有没有权限"转向按调用与结果内容裁决。结果侧拦截尤其关键，因为提示注入和凭证回显往往出现在工具返回的数据里。
- **证据级**：A。

### 5. MCP TypeScript SDK v2.4.0：Skills over MCP 落地

- **事实**：[v2.4.0](https://github.com/modelcontextprotocol/typescript-sdk/releases/tag/v2.4.0)（10 月 24 日）实现 SEP-2640：技能以 MCP 资源发布，客户端校验大小、摘要与 SKILL.md frontmatter；在 2026-07-28 版规范下资源带 `ttlMs`、`cacheScope` 缓存字段。规范本身本周无新版。
- **为什么重要**：工具与技能首次走同一条协议通道，技能供应链有了协议级完整性校验；内部技能库可以像 MCP server 一样被注册、缓存和审计。
- **证据级**：A。

## 恢复与重试：副作用只发生一次成为新门槛

**结论：Runtime 竞争的焦点从"能否恢复"转向"恢复和重试时副作用是否只发生一次"。** 这要求运行时记录每个工具调用的完成状态，也要求下游提供幂等语义——OpenClaw 与 E2B 本周从两端补上了这条链（见 TOP5 第 1、3 条）。

其他证据指向同一方向：[a2a-python 1.3.0](https://github.com/a2aproject/a2a-python/releases/tag/v1.3.0) 让挂起的中断任务超时后被释放；Dify 1.18.0 由上层协调嵌套 workflow 的暂停、恢复与停止；OpenClaw [2026.10.10-beta.4](https://github.com/openclaw/openclaw/releases/tag/v2026.10.10-beta.4)（10 月 27 日）让同会话内的定时跟进保留已认证 operator 的权限，同时保留撤销边界（#176422）。

会话状态也在离开框架自带的 checkpoint：AgentCore Runtime 支持 FUSE 挂载（10 月月级归档，未标日），ADK 加入 `MongoDbSessionService`，OpenViking 加入 durable content write task。状态落到文件系统与通用数据库后，备份、迁移和审计可以复用企业已有工具。

**它改变了什么**：上一期修的是 resume 本身的缺陷，这一期修的是 resume 的副作用。评估 Harness 时，"工具调用完成状态是否一等记录"应成为必问项。

## 网关合流：工具、模型与技能共用一个策略点

**结论：工具与技能的分发在合流到 MCP，工具调用与模型调用的流量在合流到同一个网关；谁掌握网关，谁就掌握策略、计量与审计点。**

三个方向同时逼近这个位置：AWS 从模型流量（TOP5 第 2 条），Composio 与 Arcade 从工具策略——Arcade 1.12.0 Preview 让工具响应自动脱敏本次调用的凭证，并拒绝解析到内网地址的出站主机；MCP 从技能分发（TOP5 第 5 条），[Registry](https://github.com/modelcontextprotocol/registry/releases) v1.8.2–v1.8.6 集中做生产容量。开源侧 [mcp-gateway-registry 1.34.0](https://github.com/agentic-community/mcp-gateway-registry/releases/tag/1.34.0) 补上 Entra 组恢复与证书链处理。

**它改变了什么**：MCP 本周的变化在分发层而非规范层（规范仍停在 `2026-07-28`，A2A 规范同样无新版）。网关的选型分量因此上升，它不再只是连接器目录。

## 凭证：Agent 可以使用，但看不到

**结论：执行环境与身份层的差异化正从"隔离有多强"转向"凭证最小暴露"——Agent 用凭证完成动作，但凭证不进入模型上下文和子进程环境。**

- **四种具体机制**：[Browserbase](https://www.browserbase.com/changelog) 与 1Password 集成（10 月 22 日），人工批准后由扩展填充，密码不经过模型；10 月 27 日的 Authenticated Fetch 复用 Context 内 cookie 但不回写。Arcade 响应脱敏。OpenClaw beta.4 让环境变量引用的 `hooks.token` 不再进入子进程环境（#179199）。[agent-browser](https://github.com/vercel-labs/agent-browser/releases) v0.40.0 修复存储恢复时向页面脚本暴露 token，v0.39.3 禁止自动发现的项目配置设置可执行路径、浏览器参数和插件——连续第二周 fail-closed。
- **本地沙箱的边界清单**：[Claude Code v2.1.309](https://github.com/anthropics/claude-code/releases/tag/v2.1.309) 修复沙箱外执行 shell 启动文件、symlink 绕过 `denyWrite`、沙箱内改写 `--mcp-config` 三处，都属于"边界之外仍有可写入口"。
- **Entra 成为事实兼容目标**：Claude apps gateway 加入 `oidc.user_id_claim`（可取 `oid`），MCP TS SDK 加入 `scopeForRefresh` 处理 AADSTS90009，mcp-gateway-registry 恢复 Entra 组，MAF dotnet 补 toolbox OAuth consent；但 Entra 官方 what's new 本周无 Agent ID 条目。

Google 10 月 26 日在 [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes) 为语义治理加入 `sgpUserIntentMatching` 开关，日志报告所用匹配模式，"按用户意图放行"由此变成可审计的配置项。

**它改变了什么**：凭证安全从"存在哪里"变成"走哪条路径"。自建本地沙箱的团队可以直接把上述机制和 Claude Code 的三处修复当检查清单。

## 升级成本：权限显式化带来集中的破坏性变更

**结论：本周破坏性变更的主要来源是权限与契约显式化——原本默认放行的东西，现在要调用方显式声明。**

| 项目 | 版本 | 需迁移的变化 |
|---|---|---|
| [Dify](https://github.com/langgenius/dify/releases/tag/1.18.0) | 1.18.0 | Agent run protocol v2 不向后兼容；本地 sandbox 认证 token 必填 |
| [Microsoft Agent Framework](https://github.com/microsoft/agent-framework/releases/tag/python-1.23.0) | python-1.23.0 | 三项 BREAKING：MCP 2.x、`unsafe_extra_run_args` 更名、AG-UI 授权 scope 显式化 |
| [Google ADK](https://github.com/google/adk-python/releases/tag/v2.13.0) | v2.13.0（版本自注 10 月 22 日） | 默认遥测切到 OTel GenAI v2（`otel_semconv_1_44`），移除 `call_llm` span |
| [langchain-core](https://github.com/langchain-ai/langchain/releases/tag/langchain-core%3D%3D1.7.0) | 1.7.0 | 流式工具参数事件结构变化 |
| Composio | core 0.27.0 | `proxyExecute` 权限闸与返回结构 |

非破坏但改变成本曲线的：[LangGraph 1.2.18](https://github.com/langchain-ai/langgraph/releases/tag/1.2.18) 一类版本把 DeltaChannel 快照频率默认值从 1000 调到 100，读取更快、存储更多。ADK 2.13.0 官方称部分路径"最高快 8 倍"，属厂商自述，未复核。

**它改变了什么**：选型评估表里，"有没有 LTS 轨"（OpenClaw 已开）和"破坏性变更是否带迁移说明"应与功能并列。

## 记忆：从召回效果转向删除与隐私

**结论：记忆层的成熟度标志正在变成能否可靠地不存、少存、删干净，并说清楚删了什么。**

最强证据是一个反例：[OpenViking v0.5.2](https://github.com/volcengine/OpenViking/releases/tag/v0.5.2) 上线 Session 隐私自动识别并改写会话中的敏感值，4 天后的 v0.5.2.1 因误判暂时关闭新值识别，且不清理已产生的记录；同期 Working Memory 改为默认关闭。自动改写一旦误判，污染的是数据本身。

删除语义同时收紧：[Cognee v1.6.6rc1](https://github.com/topoteretes/cognee/releases/tag/v1.6.6rc1) 规定 history purge 不成功则整体失败，删 dataset 时连带清理检索与会话历史；ADK 2.13.0 加入 `delete_memory`；CrewAI 1.15.29–1.15.32 修复私有记忆泄漏；[Zep](https://help.getzep.com/changelog) 让 HIPAA 账户默认关闭 Graph Assistant，并推出边类型层级（closed beta）。

## 可观测：安全事件与成本进入同一条 trace

**结论：可观测层正把"拦截了什么、为什么"与"花了多少、花在哪"放进同一条 trace，观测与控制在合并。**

- **安全事件进遥测**：Claude Code 新增 `claude_code.safety_event`；Databricks MCP 调用越狱筛查（Beta，10 月月级归档）；pydantic-ai 关闭 `InputGuardrail` 的 fail-open。
- **成本归因细化**：Claude Agent SDK 按 5 分钟与 1 小时两档缓存寿命拆分 token 统计；pydantic-ai 加入 `PostgresSpendStore` 做跨进程共享预算。
- **观测平台向网关扩张**：[Langfuse](https://github.com/langfuse/langfuse/releases) v4.68.0–v4.71.0 加入 AI Gateway 与 Skills 追踪和版本管理；评测转向回放真实会话（[AgentCore SDK v1.25.0](https://github.com/aws/bedrock-agentcore-sdk-python/releases/tag/v1.25.0) 评估已有 session，Langfuse `runBatchEvaluation` MCP 工具）。
- **供应链**：[Phoenix](https://github.com/Arize-ai/phoenix/releases) evals 3.9.3 排除被入侵的 litellm 1.107.0。

**它改变了什么**：ADK 默认 OTel GenAI v2 说明规范已进入框架默认值，依赖旧 span 的仪表盘会失效；观测供应商的选择也会反过来约束网关与策略引擎的选择。

## 平台格局：一家动结构，一家动策略，国内动兼容

**结论：AWS 是本周唯一有窗内精确日期、并改变控制面结构的云厂；Google 动在策略层；国内云厂以协议兼容换接入量。**

Google 的动作是 10 月 26 日的意图匹配开关。Microsoft Foundry 在上期发完 Routines、Tool Search 与 A2A 后本周静默。[Databricks](https://docs.databricks.com/aws/en/release-notes/product/) 10 月条目（月级归档）补的是身份与 MCP 安全：外部 Agent 默认 OAuth 应用 GA、`ai_enrich` 接外部 MCP 做 grounding（Beta）。火山方舟 10 月 22 日的 [API 兼容性公告](https://ark.volcengine.com/region:cn-beijing/docs/api-schema-upgrade-notice) 让 Responses API 兼容 `apply_patch`、`namespace`/`defer_loading` 与 Anthropic 错误格式，并提供原生 web_search。阿里云 10 月 26 日周报称上新 11 款 MCP 服务（仅读到摘要，证据级 B）。

![2026-10-29 AI Agent 基础设施模块×厂商状态热力矩阵：AWS、Google、Anthropic 与 OpenClaw 覆盖面最广，Microsoft 与国内云厂多为空白或背景](/assets/images/posts/2026-10-29-agent-infra-fig1-matrix.png)

*图 1：八个模块 × 十个厂商/项目的本周状态。2=窗内有可核动态，1=月档未标日、窗外背景或限述，0=本周无动态，-1=本次未取得。数据来源：本期研究母稿的状态矩阵（官方 release notes、GitHub releases、厂商公告，读取截至 2026-10-28）。*

## 云厂能力矩阵

| 平台 | Runtime / Session | Memory | Gateway / Tools | Identity | Sandbox / Browser | Observability / Eval | 本周强信号 |
|---|---|---|---|---|---|---|---|
| AWS | Runtime FUSE 挂载（10 月档） | Memory TTL（10 月档，上期已报） | InvokeModel 方言翻译 + 有序 fallback + 熔断（10-22） | CLI v1.0 identity 命令（10 月档） | Web Search 域名过滤（10-23） | SDK 1.25.0 评估已有 session（10-24） | Gateway 吞并模型流量 |
| Google | Agent Engine 无条目 | ADK MongoDbMemoryService（实验） | Agent Gateway 未取得 | 意图匹配开关（10-26） | ADK OpenSandbox、computer use schema | ADK 默认 OTel GenAI v2 | 策略层治理 |
| Microsoft | Hosted Agents 无条目 | 无条目 | MAF MCP 2.x、toolbox OAuth consent | Entra 官方无窗内条目 | Browser automation GA（10-19 窗外） | 无条目 | 本周静默 |
| 阿里云 | Managed Agent（10-13，窗外） | 手册背景 | 11 款 MCP 服务（10-26 摘要，B） | 未取得 | 手册背景 | 轨迹评测（10-21，窗外） | 窗内无可核条目 |
| 火山/字节 | 无条目 | OpenViking v0.5.2/0.5.2.1 | Responses API 兼容（10-22） | 未取得 | 原生 web_search | Coze Loop 无条目 | 协议兼容外部 Harness |
| 腾讯云 | 上下文超时清空（10 月，未标日） | 记忆库（9 月背景） | MCP Apps（9 月背景） | AgentPortal（10-19，窗外） | Claw 云盘（窗外） | 无条目 | 窗内无日期条目 |
| Databricks | 未取得 | 无条目 | ai_enrich 外部 MCP（Beta，10 月档） | 外部 Agent 默认 OAuth GA（10 月档） | 未取得 | MCP 越狱筛查（Beta，10 月档） | 数据平台补 Agent 安全 |

## 对比表

| 模块 | 产品/厂商 | 版本或日期 | 变化 | 是否破坏性 | 证据级 |
|---|---|---|---|---|---|
| Harness | OpenClaw | 2026.10.7（10-25） | replay-safe 会话恢复，保留恢复溯源与未完成工具结果 | 否 | A |
| Harness | OpenClaw | 2026.10.8（10-28） | 被 kill 的 run 释放恢复 fence；沙箱子进程不能跑宿主 CLI | 否 | A |
| Harness | OpenClaw | 2026.9.34 / 9.35（10-24 / 10-27） | extended-stable（LTS 等价）轨道，安全修复下放 | 否 | A |
| Harness | OpenClaw | 2026.10.10-beta.4（10-27） | 定时跟进保留 operator 权限；hooks.token 不下放子进程 | 否 | A |
| Harness | Anthropic Claude Agent SDK / Claude Code | TS v0.3.307–312、Py v0.2.171–174、v2.1.307–312 | safety_event 遥测；按缓存寿命拆 token | 否 | A |
| Harness | Dify | 1.18.0 | Agent run protocol v2；本地 sandbox token 必填 | 是 | A |
| Harness | Microsoft Agent Framework | python-1.23.0 / dotnet-1.26.0 | MCP 2.x、参数更名、AG-UI scope 显式化 | 是 | A |
| Harness | Google ADK | v2.13.0（10-22） | 默认 OTel GenAI v2，移除 call_llm span；Mongo 会话/记忆 | 是 | A |
| Harness | LangGraph / langchain-core | 1.2.17–1.2.18 / 1.7.0 | 快照频率默认 1000→100；流式工具参数事件变化 | 是（core） | A |
| Harness | pydantic-ai | v2.60–v2.63 | PostgresSpendStore 共享预算；护栏关闭 fail-open | 否 | A |
| Runtime | a2a-python | 1.3.0 | 超时释放挂起的中断任务 | 否 | A |
| Runtime | AWS AgentCore Runtime | 10 月档 | FUSE 挂载 | 否 | A（日期限述） |
| Sandbox | E2B | 2.59.0（10-23） | dnsServers 闭合 DNS 出站 | 否 | A |
| Sandbox | E2B | 2.60.0（10-26） | 按 Should-Retry 头重试，发送后网络错误不重试 | 行为变化 | A |
| Sandbox | E2B | 2.61.0（10-27） | Sandbox.create 幂等键 | 否 | A |
| Sandbox | Browserbase | 10-22 / 10-27 | 1Password 人批填充；Authenticated Fetch | 否 | A |
| Sandbox | Claude Code | v2.1.309 | 修复沙箱外 shell 启动文件、symlink 绕过 denyWrite、改写 --mcp-config | 否 | A |
| Sandbox | agent-browser | v0.39.3 / v0.40.0 | 项目配置信任边界；存储恢复不暴露 token | 是（配置） | A |
| Sandbox | AWS AgentCore | 10-23 | Web Search 域名过滤与用户位置 | 否 | A |
| Gateway | AWS AgentCore Gateway | 10-22 | InvokeModel 方言翻译、有序 fallback、默认熔断 | 否 | A |
| Gateway | MCP TS SDK | v2.4.0（10-24） | Skills over MCP（SEP-2640）；-32020；scopeForRefresh | 否 | A |
| Gateway | MCP Registry | v1.8.2–v1.8.6 | 生产容量与诊断 | 否 | A |
| Gateway | Composio | core 0.27.0（10-22） | session hooks，blocked 结果 | 是（proxyExecute） | A |
| Gateway | Arcade | 1.12.0 Preview | 响应凭证脱敏；拒绝内网出站 | 否 | A |
| Gateway | mcp-gateway-registry | 1.34.0 | Entra 组恢复；证书链处理 | 否 | A |
| Identity | Google 语义治理 | 10-26 | sgpUserIntentMatching 开关 | 否 | A |
| Identity | Claude apps gateway | 窗内 | oidc.user_id_claim | 否 | A |
| Identity | Databricks | 10 月档 | 外部 Agent 默认 OAuth GA | 否 | A（日期限述） |
| Memory | OpenViking | v0.5.2 → v0.5.2.1 | 隐私自动识别上线 4 天后关闭；Working Memory 默认关 | 行为回滚 | A |
| Memory | Cognee | v1.6.6rc1 | history purge 失败即失败；删 dataset 连带清理 | 行为变化 | A |
| Memory | Zep | 10 月 | HIPAA 默认关 Graph Assistant；边类型层级 | 否 | A |
| Observability | Langfuse | v4.68.0–v4.71.0 | AI Gateway；Skills 追踪与版本 | 否 | A |
| Observability | Phoenix | 20.25 / evals 3.9.3 | issue-to-PR factory；排除被入侵 litellm 1.107.0 | 否 | A |
| Observability | AgentCore SDK | 1.25.0（10-24） | 评估已有 session；RecommendationClient | 否 | A |
| Platform | 火山方舟 | 10-22 | Responses API 兼容 apply_patch、namespace/defer_loading | 否 | A |
| Platform | OpenAI API | 10-24 | Enterprise Key Management；英国数据驻留 | 否 | A |
| Platform | Anthropic | 10-22 | Google Cloud 托管 | 否 | A |
| Platform | 阿里云百炼 | 10-26 摘要 | 上新 11 款 MCP 服务 | 否 | B |

## 对你意味着什么

> 以下为编辑建议，基于本期事实的推断，不是厂商承诺。

- **自建 Harness 的团队**：把"工具调用完成状态"作为一等数据记录，而不只是对话历史。下游如果支持幂等键（E2B 已经支持），在调用时带上；没有的，至少在 Harness 层记录调用 id，避免恢复时重复执行。
- **评估 OpenClaw 的团队**：生产环境可以考虑 9.x extended-stable 轨道，降低升级频率；但要向社区确认支持期限和回移范围，官方说明里目前没有这两项。
- **准备升级的团队**：本周 Dify 1.18.0、MAF python-1.23.0、ADK 2.13.0、langchain-core 1.7.0 都有需要迁移的变更。ADK 的遥测 schema 切换会让依赖 `call_llm` span 的仪表盘失效，升级前先核对告警规则。
- **采购云厂 Agent 平台的团队**：AWS 把模型 fallback 放进网关后，评估问题从"支不支持多模型"变成"策略、计量和审计是否在同一点"。和其他云厂对比时，可以直接问这三件事是否共用一个控制面。
- **做工具接入的团队**：结果侧的拦截点（工具返回在进入模型前被检查）比调用侧更容易被忽略。Composio 和 Arcade 本周都补了这一侧，自建网关可以照此补齐。
- **用 Entra 的企业**：生态正在主动适配 Entra 的 token 语义（oid 声明、刷新 scope、组恢复），但 Entra 官方的 Agent ID 本周没有新条目。落地 MCP 网关时，优先选已显式支持这些细节的组件。
- **做记忆层的团队**：OpenViking 的回滚说明，"自动改写记忆内容"需要先在影子模式验证。删除接口应当失败即失败，并能报告删了什么。
- **安全团队**：本周 eMudhra/emSign 根证书撤信、litellm 1.107.0 被入侵分别被多个项目独立处理，建议把这两项加入依赖与证书基线检查。

## 周环比

对比第 18 期（10-22）：

- **延续**：OpenClaw 从本机观测变成公开 release，恢复主题延续并深化；AWS AgentCore 从失败分析、记忆 TTL、私有 CA 推进到 Gateway 模型流量；LangGraph 从 resume 修复推进到快照频率与线程优先级；Microsoft Agent Framework 从持久化兼容警告推进到三项 BREAKING；OpenViking 从 v0.5.1 到 v0.5.2/0.5.2.1；agent-browser 连续第二周 fail-closed；E2B 从生命周期参数推进到重试与幂等；Arcade 从工具推荐转向自托管安全基线。
- **新出现**：Anthropic 一手 releases（上期未取得）；Composio session hooks；MCP Skills over MCP；Dify 1.18.0；Google ADK 2.13.0（上期空窗）；Browserbase 与 1Password；Google 意图匹配开关；方舟 API 兼容公告；OpenClaw LTS 轨。
- **降温**：OpenAI Agents SDK 本周无版本；Microsoft Foundry 在 Routines 等 GA 之后静默；Daytona 本周无动态，GitHub 主仓已归档；supermemory、Graphiti 本周无窗内版本。

上一期 TOP5 是 Foundry Routines/Tool Search/A2A、AWS 失败分析与 TTL、OpenViking 上下文数据库、Arcade 工具推荐、浏览器 fail-closed。本期只有 AWS 和浏览器安全两条线延续进前列，重心从"平台收编调度与评测"转到"恢复、重试与策略执行点"。
## 来源

- OpenClaw releases：[v2026.10.8](https://github.com/openclaw/openclaw/releases/tag/v2026.10.8)、[v2026.10.7](https://github.com/openclaw/openclaw/releases/tag/v2026.10.7)、[v2026.9.35](https://github.com/openclaw/openclaw/releases/tag/v2026.9.35)、[v2026.9.34](https://github.com/openclaw/openclaw/releases/tag/v2026.9.34)、[v2026.10.10-beta.4](https://github.com/openclaw/openclaw/releases/tag/v2026.10.10-beta.4)
- AWS：[AgentCore Gateway InvokeModel 与 fallback](https://aws.amazon.com/about-aws/whats-new/2026/10/agentcore-gateway-invokemodel-fallback/)、[AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)、[AgentCore SDK v1.25.0](https://github.com/aws/bedrock-agentcore-sdk-python/releases/tag/v1.25.0)
- Google：[Gemini Enterprise Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)、[ADK v2.13.0](https://github.com/google/adk-python/releases/tag/v2.13.0)
- Microsoft：[Agent Framework python-1.23.0](https://github.com/microsoft/agent-framework/releases/tag/python-1.23.0)、[Foundry devblog](https://devblogs.microsoft.com/foundry/feed/)
- Anthropic：[Claude Code releases](https://github.com/anthropics/claude-code/releases)、[Claude Agent SDK Python](https://github.com/anthropics/claude-agent-sdk-python/releases)、[Claude release notes](https://docs.claude.com/en/release-notes/overview)
- OpenAI：[API changelog](https://platform.openai.com/docs/changelog)、[Agents SDK Python](https://github.com/openai/openai-agents-python/releases)
- LangChain：[LangGraph 1.2.18](https://github.com/langchain-ai/langgraph/releases/tag/1.2.18)、[langchain-core 1.7.0](https://github.com/langchain-ai/langchain/releases/tag/langchain-core%3D%3D1.7.0)
- 沙箱与浏览器：[E2B 2.61.0](https://github.com/e2b-dev/E2B/releases/tag/e2b%402.61.0)、[Browserbase changelog](https://www.browserbase.com/changelog)、[agent-browser](https://github.com/vercel-labs/agent-browser/releases)、[browser-use 0.13.14](https://github.com/browser-use/browser-use/releases/tag/0.13.14)、[Claude Code v2.1.309](https://github.com/anthropics/claude-code/releases/tag/v2.1.309)
- 工具与协议：[MCP TS SDK v2.4.0](https://github.com/modelcontextprotocol/typescript-sdk/releases/tag/v2.4.0)、[MCP Registry](https://github.com/modelcontextprotocol/registry/releases)、[a2a-python 1.3.0](https://github.com/a2aproject/a2a-python/releases/tag/v1.3.0)、[Composio releases](https://github.com/ComposioHQ/composio/releases)、[Arcade changelog](https://docs.arcade.dev/en/home/changelog)、[mcp-gateway-registry 1.34.0](https://github.com/agentic-community/mcp-gateway-registry/releases/tag/1.34.0)
- 记忆：[OpenViking v0.5.2](https://github.com/volcengine/OpenViking/releases/tag/v0.5.2)、[Cognee v1.6.6rc1](https://github.com/topoteretes/cognee/releases/tag/v1.6.6rc1)、[Zep changelog](https://help.getzep.com/changelog)
- 观测：[Langfuse releases](https://github.com/langfuse/langfuse/releases)、[Phoenix releases](https://github.com/Arize-ai/phoenix/releases)
- 编排平台：[Dify 1.18.0](https://github.com/langgenius/dify/releases/tag/1.18.0)、[CrewAI](https://github.com/crewAIInc/crewAI/releases)、[pydantic-ai](https://github.com/pydantic/pydantic-ai/releases)
- 国内：[火山方舟 API 兼容公告](https://ark.volcengine.com/region:cn-beijing/docs/api-schema-upgrade-notice)、[百炼应用发布记录](https://help.aliyun.com/zh/model-studio/application-release-notes)、[腾讯云 ADP 4.2.1](https://adp.tencent.com/zh/blog/tencent-cloud-adp-4-1-5-to-4-2-1-update)、[Databricks release notes](https://docs.databricks.com/aws/en/release-notes/product/)
