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
header:
  overlay_image: /assets/images/posts/2026-10-29-agent-infra-cover.png
  overlay_filter: 0.35
toc: true
toc_sticky: true
---
2026-10-29 发布｜覆盖 2026-10-22 ~ 2026-10-28｜第 19 期

上一期的关键词是"会话能否可靠中断与恢复"。这一周，问题往前推了一步：**恢复和重试的时候，已经发生过的副作用会不会再发生一次**。OpenClaw 连续两个版本把 replay-safe 会话恢复放在头条，E2B 把"要不要重试"交给服务端声明并给沙箱创建加上幂等键，AWS AgentCore Gateway 给模型流量加了有序 fallback 和默认熔断。与此同时，Dify、Microsoft Agent Framework、Google ADK、OpenViking 在同一周发出需要迁移的破坏性变更，升级本身成了运维成本的一部分。

第二条线是**策略执行点往工具网关和 SDK 契约里下沉**。Composio 的 session hooks 能在工具执行前、以及结果回到 Agent 之前把调用拦下；Claude Code 把安全事件写进遥测；Google 把语义治理里的意图匹配做成可审计开关；agent-browser 第二周继续 fail-closed，这次收紧的是项目配置的信任边界。

本期按软件栈的八个层次整理窗口内可核的版本、PR 与官方公告，再给出云厂能力矩阵、五个信号最强的变化、与上一期的对比，以及对自建与采购团队的编辑建议。事实以官方 release、文档与公告为准；厂商自述数字保留其口径；月级归档、窗口外条目与未取得正文的材料单独标注，不当作本周事件。

## 本周 TOP 5

### 1. OpenClaw：replay-safe 会话恢复成为头条，同时开出 LTS 轨

[2026.10.7](https://github.com/openclaw/openclaw/releases/tag/v2026.10.7)（10 月 25 日）的第一条 Highlight 是 Replay-safe session recovery：被中断的会话会保留恢复溯源（recovery provenance）和未完成的工具结果；已停止的会话在接收下一条消息前，先清掉终态恢复留下的残留；大批量子会话的完成结果被控制在请求方上下文之内。这一组改动涉及 #153728、#168764、#172068、#177716 等 9 个 PR。同版还处理了数据库与 worker 连续性（维护被拒时保留 peer readers/borrowers，不兼容的保留 agent 数据库被隔离），以及备份恢复的可中断续做。

三天后的 [2026.10.8](https://github.com/openclaw/openclaw/releases/tag/v2026.10.8)（10 月 28 日）接着处理"恢复之后还能不能继续收消息"：被 kill 的 run 会释放 restart-recovery fence，中断的子会话和刚被接受的子会话在重启后恢复，回复运行时无法发布时入站消息不再无限重试。更新后的 Doctor 普通失败改为重启 Gateway 而不是停机，孤儿维护 worker 不再阻塞所有 CLI/Gateway 启动。安全加固方面，沙箱内派生的子进程不能再运行宿主 CLI 后端（#178742），secret egress proxy 拒绝不受信的 eMudhra 证书链（#179249）。

另一条结构性变化是发布节奏。[2026.9.34](https://github.com/openclaw/openclaw/releases/tag/v2026.9.34)（10 月 24 日）与 [2026.9.35](https://github.com/openclaw/openclaw/releases/tag/v2026.9.35)（10 月 27 日）被官方定义为 gateway-only extended-stable release，原文称其为 "our current equivalent to LTS"：基于 9 月底的代码线，只叠加关键安全、可靠性修复与新模型支持。9.35 里有不少运维者会在意的条目，比如 `test -v` 这类 exec 操作数在 allowlist 模式下需要审批（#180880），`openclaw mcp list/show` 与日志对凭证脱敏（#183193 等），Claude CLI 输出达上限时快速失败，不再卡 15 分钟。

为什么排第一：上一期 OpenClaw 的 CHANGELOG 没有发布日，只能作为本机观测；本期公开 release 完整计入窗口，证据等级是 A。更重要的是，"恢复不重放"和"主线 + LTS 双轨"两件事合在一起，回答的是同一个采购问题：一个自托管 Harness 能不能被长期持有，而不是每周追着升级。

### 2. AWS AgentCore Gateway：模型流量进入 Agent 网关

AWS What's New 在 10 月 22 日 16:00（北京时间）发布了 [AgentCore Gateway 的 InvokeModel 与模型 fallback](https://aws.amazon.com/about-aws/whats-new/2026/10/agentcore-gateway-invokemodel-fallback/)。Gateway 原本面向工具（MCP 目标、Lambda、OpenAPI）；这次它开始接收模型调用：InvokeModel 请求可以和 OpenAI、Anthropic 方言双向翻译，流式响应会重新分帧；用 `matchModels` 选目标后按有序 fallback 链切换，每个目标可以设首字节超时，熔断默认开启。

同月的 [AgentCore release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html) 还列出 CLI v1.0（含 identity 命令）、Step Functions 到 MCP 的连接器、Runtime 的 FUSE 挂载。这几条是月级归档，没有逐条标日，本文只写"10 月"，不算作本周确定事件。窗口内能精确定日的另一条是 Web Search 工具的域名过滤与用户位置参数（10 月 23 日）。SDK 侧，[bedrock-agentcore-sdk-python v1.25.0](https://github.com/aws/bedrock-agentcore-sdk-python/releases/tag/v1.25.0)（10 月 24 日）支持对已有 session 做评估，并加入 RecommendationClient。

为什么重要：多模型容灾和成本路由过去写在应用代码里，现在可以在控制面配置；工具和模型共用同一个策略点、计量点和审计点。上一期 AWS 的重点是失败分析、记忆 TTL 和私有 CA，这一期它把"流量"收进来，Agent 网关的边界因此明显变大。

### 3. E2B：重试与幂等写进沙箱协议

E2B SDK 一周三个版本，方向一致。2.59.0（10 月 23 日）新增 `dnsServers`，可以把沙箱的 DNS 出站闭合到指定解析器；2.60.0（10 月 26 日）改为按服务端返回的 `Should-Retry` 头决定是否重试，请求已经发出后遇到的网络错误不再自动重试；[2.61.0](https://github.com/e2b-dev/E2B/releases/tag/e2b%402.61.0)（10 月 27 日）给 `Sandbox.create` 加上 `Idempotency-Key`。

这三条拼起来是一套完整的契约：客户端不再自行猜测"失败了没有"，服务端告诉它能不能重来；就算重来，同一个键也不会创建出第二个沙箱。过去这类重复创建、重复计费、重复副作用通常靠应用层兜底，现在由基础设施承担。

为什么进 TOP5：它和 OpenClaw 的 replay-safe 恢复正好构成链条的两端。Harness 记录哪些工具调用已经完成，下游执行环境保证同一请求只生效一次，"只执行一次"才有可能端到端成立。

### 4. Composio session hooks：工具网关成为策略执行点

Composio core 0.27.0（10 月 22 日）引入 session hooks，可以在两个位置拦截：工具执行之前，以及工具结果到达 Agent 之前。条件可以用自然语言写，被拦下的调用返回 `resultType: 'blocked'`。这也带来一处行为变化：`proxyExecute` 的权限闸和返回结构跟着改了，依赖旧返回值的代码需要检查。

同一周，Arcade 1.12.0 Preview 让工具响应自动脱敏本次调用使用的凭证，并拒绝解析到内网地址的出站主机；Claude Code 新增 `claude_code.safety_event` 遥测事件；pydantic-ai 关闭了 `InputGuardrail` 的 fail-open 行为。

为什么重要：工具治理过去主要是"连接器有没有权限"，现在开始按调用内容和结果内容裁决。结果侧的拦截点尤其关键，因为提示注入和凭证回显往往出现在工具返回的数据里，而不是调用参数里。

### 5. MCP TypeScript SDK v2.4.0：Skills over MCP 落地

[MCP TS SDK v2.4.0](https://github.com/modelcontextprotocol/typescript-sdk/releases/tag/v2.4.0)（10 月 24 日）实现 SEP-2640：技能以 MCP 资源的形式发布，客户端会校验大小、摘要和 SKILL.md 的 frontmatter；在 2026-07-28 版规范下，资源还带 `ttlMs`、`cacheScope` 等缓存字段。同一版本里，`x-mcp-header` 的数字参数按规范返回 -32020 错误码，并为 Entra 加入 `scopeForRefresh`，处理刷新时的 AADSTS90009 问题。

[MCP Registry](https://github.com/modelcontextprotocol/registry/releases) 在 v1.8.2 到 v1.8.6 之间集中做生产容量与诊断。规范本身本周没有新版本，最新仍是 `2026-07-28`。

为什么重要：工具和技能的分发第一次走同一条协议通道，技能供应链也第一次有了协议级的完整性校验。对维护内部技能库的团队，这意味着技能可以像 MCP server 一样被注册、缓存和审计，不必各家 Harness 各搞一套格式。

**次强观察**（未进 TOP5）：OpenViking v0.5.2 上线 Session 隐私自动识别，4 天后的 v0.5.2.1 因误判暂时关闭（记忆层的反例）；Dify 1.18.0 的 Agent run protocol v2 不向后兼容；Google 语义治理的意图匹配开关（10 月 26 日）；Browserbase 与 1Password 的人批填充（10 月 22 日）；4 个独立项目在同一周适配 Microsoft Entra。

## 控制层：恢复语义与升级成本

Harness 层本周的共同主题是两件事：中断之后能不能安全地重放，以及升级本身要付出多少迁移成本。

OpenClaw 已在 TOP5 展开。另外值得记一笔的是 [2026.10.10-beta.4](https://github.com/openclaw/openclaw/releases/tag/v2026.10.10-beta.4)（10 月 27 日）：同一会话内的显式定时跟进（包括 one-shot `next_check` 重新挂载）会保留已认证 operator 的权限，同时保留角色、会话、取消、目标和工具策略的撤销边界（#176422）；通过环境变量引用的 `hooks.token` 不再进入 agent host-exec 与 CLI 子进程的环境（#179199）。前者解决"定时任务一醒来就没权限"，后者防止钩子令牌被子进程顺手带走。

Anthropic 本周第一次有完整一手数据。Claude Agent SDK TypeScript v0.3.307 到 v0.3.312、Python v0.2.171 到 v0.2.174、Claude Code v2.1.307 到 v2.1.312 都在窗口内。值得关注的是两类字段：一是遥测里的 `claude_code.safety_event`，二是成本归因——SDK 按 5 分钟与 1 小时两档缓存寿命拆分 token 统计。平台侧，[Claude release notes](https://docs.claude.com/en/release-notes/overview) 记录 10 月 22 日在 Google Cloud 上的托管可用。

LangGraph [1.2.18](https://github.com/langchain-ai/langgraph/releases/tag/1.2.18) 一类的版本把 DeltaChannel 快照频率的默认值从 1000 调到 100：读取更快，存储更多，长线程的成本曲线会变。[langchain-core 1.7.0](https://github.com/langchain-ai/langchain/releases/tag/langchain-core%3D%3D1.7.0) 修改了流式工具参数事件，依赖旧事件结构的前端需要检查。LangSmith 本周没有取到独立条目。

Google [ADK v2.13.0](https://github.com/google/adk-python/releases/tag/v2.13.0)（版本自注 10 月 22 日）是上期空窗后的大版本：默认遥测切到 OTel GenAI 语义约定 v2（`otel_semconv_1_44`）并移除 `call_llm` span，这是破坏性变化；同时加入 `MongoDbSessionService`、实验性的 `MongoDbMemoryService`、`delete_memory`、OpenSandbox 与 Gemini 3.x 的 computer use schema。官方称部分路径"最高快 8 倍"，属于厂商自述，未复核。

Microsoft Agent Framework [python-1.23.0](https://github.com/microsoft/agent-framework/releases/tag/python-1.23.0) 有三项 BREAKING，包括 MCP 迁移到 2.x、`unsafe_extra_run_args` 更名、AG-UI 授权 scope 显式化；dotnet-1.26.0 补上 toolbox 的 OAuth consent。Semantic Kernel 最新版本在 10 月 6 日，AutoGen 最新仍在 2025 年 9 月，两者本周都没有动静。

OpenAI Agents SDK 本周空窗：Python 最新 v0.24.0 是 10 月 15 日，JS 最新 v0.21.0 是 10 月 21 日，都在窗口外。平台侧 [OpenAI changelog](https://platform.openai.com/docs/changelog) 10 月 24 日上线 Enterprise Key Management 与英国数据驻留，这是企业采购条件，不改变 Harness 语义。

动态池里，[Dify 1.18.0](https://github.com/langgenius/dify/releases/tag/1.18.0) 的 Agent run protocol v2 不向后兼容，嵌套 workflow 的暂停、恢复、停止由上层协调，本地 sandbox 的认证 token 改为必填；CrewAI 1.15.29 到 1.15.32 修复了私有记忆泄漏；pydantic-ai v2.60 到 v2.63 加入 `PostgresSpendStore` 做跨进程共享预算。

控制层小结：上一期修的是 resume 本身的缺陷，这一期修的是 resume 的副作用与升级的代价。选型时，"有没有 LTS 轨"和"破坏性变更是否带迁移说明"值得放进评估表。

## 运行层：恢复不重放成为新门槛

Runtime 的竞争正在从"会话能否恢复"推进到"恢复和重试时副作用是否只发生一次"。这要求运行时记录的不只是对话历史，还有**每个工具调用的完成状态**；也要求下游的沙箱创建和外部 API 提供幂等语义。本周 OpenClaw 与 E2B 从两端补上了这条链；Dify 1.18.0 协调嵌套 workflow 的暂停、恢复和停止；[a2a-python 1.3.0](https://github.com/a2aproject/a2a-python/releases/tag/v1.3.0) 让挂起的中断任务在超时后被释放，避免资源长期占用。

会话状态的存储面也在外延：AgentCore Runtime 支持 FUSE 挂载（10 月档），ADK 加入 `MongoDbSessionService`，OpenViking 加入 durable content write task。状态不再只放在框架自带的 checkpoint 里，而是落到文件系统和通用数据库，这让备份、迁移和审计可以复用企业已有工具。

托管 runtime 的大厂本周比较安静：Google Agent Engine、Microsoft Foundry Hosted Agents 没有窗内条目；国内的百炼、方舟、腾讯 ADP 也没有窗内 runtime 条目。腾讯 ADP 的上下文超时清空与群聊共享出现在 10 月的公告里，但没有标日，只作背景。Modal 与 trueforge 有常规版本，Daytona 的 GitHub 主仓已在 10 月 3 日归档，官网 changelog 最新一条是 10 月 16 日，本周无动态。

## 执行环境层：可安全重试，凭证不可见

执行环境层的差异化正在从"隔离有多强"转向两项协议能力：**能不能安全地重试**，以及**Agent 能不能用凭证却看不到凭证**。

E2B 的重试与幂等已在 TOP5 展开。浏览器这边，[Browserbase changelog](https://www.browserbase.com/changelog) 记录了两条：10 月 22 日与 1Password 集成，人工批准后由扩展直接填充凭证，密码不经过模型；10 月 27 日的 Authenticated Fetch 可以复用浏览器 Context 里的 cookie 发请求，但不回写。[agent-browser](https://github.com/vercel-labs/agent-browser/releases) v0.40.0 修复了存储恢复时把 token 暴露给页面脚本的问题；v0.39.3 禁止自动发现的项目配置设置可执行路径、浏览器参数和插件，MCP 参数也不能覆盖服务端访问设置。这是它连续第二周走 fail-closed。

本地沙箱的漏洞面在本周被具体化。[Claude Code v2.1.309](https://github.com/anthropics/claude-code/releases/tag/v2.1.309) 一次修了三处：沙箱外执行 shell 启动文件、symlink 绕过 `denyWrite`、沙箱内命令能改写 `--mcp-config`。三处都属于"沙箱边界之外还有可写入口"的类别，自建本地沙箱的团队可以拿来当检查清单。

[browser-use 0.13.14](https://github.com/browser-use/browser-use/releases/tag/0.13.14) 继续常规加固；microsoft/playwright-mcp 本周无版本。云厂一侧，AWS 的 Web Search 工具在 10 月 23 日加了域名过滤与用户位置；Microsoft 的 Browser automation GA 在 10 月 19 日，属于窗口外。OpenAI 10 月 26 日发布的 `gpt-6.1-terra` 官方描述含 "precise computer use"，这是模型层能力，不是执行环境本身的变化。

## 工具层：网关同时管工具、模型与技能

MCP 本周的变化发生在分发层而不是规范层：TS SDK 实现 Skills over MCP，Registry 做生产容量，规范仍停在 `2026-07-28`。A2A 规范本周同样没有新版本，只有 Python SDK 补了中断任务的回收。

工具网关的定位更清楚了。Composio 的 session hooks 让网关可以按内容裁决，Arcade 的响应脱敏让网关负责"凭证不回流"，AWS 让网关同时承载模型流量。[agentic-community/mcp-gateway-registry 1.34.0](https://github.com/agentic-community/mcp-gateway-registry/releases/tag/1.34.0) 则在开源侧补上 Entra 组恢复（OBO 到 Graph）和证书链处理。

把这三条放在一起看：**"工具"与"技能"的分发通道在合流到 MCP，"工具调用"与"模型调用"的流量在合流到同一个网关**。谁掌握网关，谁就掌握策略执行点、成本计量点和审计点。AWS 从模型流量、Composio 和 Arcade 从工具策略、MCP 从技能分发，三个方向都在逼近同一个位置。

Nango 与 Pipedream Connect 本周没有取到可核内容：Nango 两个托管版本标签没有说明，changelog 重定向后 404；Pipedream 的 releases 最新停在 2025 年 11 月，changelog 同样 404。

## 权限层：凭证最小暴露与 Entra 兼容

本周身份层的实际进展不在"给 Agent 发身份"，而在两件更具体的事。

第一是**凭证使用路径的最小暴露**，本周至少出现四种具体机制：Browserbase 的 1Password 人批填充、Arcade 的响应脱敏、OpenClaw 的 `hooks.token` 不下放子进程、agent-browser 的存储恢复绑定 origin。它们的共同点是 Agent 可以使用凭证完成动作，但凭证本身不进入模型上下文，也不进入子进程环境。

第二是**企业 IdP 的 token 语义兼容**。Claude apps gateway 加入 `oidc.user_id_claim`（可取 `oid`），MCP TS SDK 加入 `scopeForRefresh` 处理 AADSTS90009，mcp-gateway-registry 恢复 Entra 组，MAF dotnet 补 toolbox OAuth consent。四个互不相关的项目在同一周适配 Entra，说明它已经是生态事实上的兼容目标；但 Entra 官方的 what's new 本周没有 Agent ID 条目，最新内容停在 6 月。

Google 在 10 月 26 日的 [Gemini Enterprise Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes) 里，为语义治理加入 `sgpUserIntentMatching` 开关，日志会报告所用的匹配模式。这把"按用户意图放行"从黑箱变成了可审计的配置项。

权限显式化也是本周破坏性升级的主要来源：MAF 的 AG-UI scope、Composio 的 proxy 权限闸与 `blocked` 结果、Dify 本地 sandbox 的认证 token 必填，都要求调用方显式声明原本默认放行的东西。AWS AgentCore Identity 只有 CLI v1.0 的 identity 命令（10 月档）；阿里云与火山的身份条目本次未取得。

## 记忆层：从召回效果转向删除与隐私

记忆层本周的主题从"召回准不准"切到了"能不能删干净、会不会存错"。

最有价值的是一个反例。[OpenViking v0.5.2](https://github.com/volcengine/OpenViking/releases/tag/v0.5.2) 上线 Session 隐私自动识别，自动识别并改写会话里的敏感值；4 天后的 v0.5.2.1 因误判暂时关闭新值识别，而且不清理已经产生的记录。自动改写记忆内容一旦误判，污染的是数据本身，回收很难。同期 OpenViking 把 Working Memory 改为默认关闭。

删除语义在多处被收紧。[Cognee v1.6.6rc1](https://github.com/topoteretes/cognee/releases/tag/v1.6.6rc1) 规定 history purge 不成功则整个操作失败，删除 dataset 时连带清理检索与会话历史；ADK 2.13.0 加入 `delete_memory`；CrewAI 修复私有记忆泄漏。[Zep](https://help.getzep.com/changelog) 让 HIPAA 账户的 Graph Assistant 默认关闭，并推出边类型层级（closed beta），记忆 schema 开始类型化。

Mem0、supermemory、Letta、Crawl4AI、Graphiti 本周没有窗内版本；Firecrawl 有 10 个镜像标签但没有说明，且 Atom 只返回最近 10 条，可能有遗漏。

记忆基础设施的成熟度标志正在变成：能不能可靠地不存、少存、删干净，并且说清楚删了什么。

## 可观测层：安全事件与成本进同一条 trace

可观测层本周有五个方向的信号。

一是**安全事件进入遥测**：Claude Code 的 `claude_code.safety_event`，Databricks 的 MCP 调用越狱筛查（Beta，10 月档），pydantic-ai 关闭 `InputGuardrail` 的 fail-open。二是**OTel GenAI v2 从规范进入框架默认值**：ADK 2.13.0 默认 `otel_semconv_1_44` 并移除 `call_llm` span，依赖旧 span 的仪表盘会失效。三是**观测平台向网关与技能注册扩张**：[Langfuse](https://github.com/langfuse/langfuse/releases) v4.68.0 到 v4.71.0 加入 AI Gateway 以及 Skills 的追踪与版本管理，[Phoenix](https://github.com/Arize-ai/phoenix/releases) 20.25 做了 issue-to-PR factory。四是**评测转向回放已有 session**：AgentCore SDK 1.25.0 与 Langfuse 的 `runBatchEvaluation` MCP 工具都支持对真实会话做评测。五是**供应链**：Phoenix evals 3.9.3 排除被入侵的 litellm 1.107.0，并要求 certifi 2026.10.18。

可观测层正在把"被拦截了什么、为什么"与"花了多少、花在哪"放进同一条 trace。Langfuse 做网关，AWS 在网关里做评测和熔断，观测与控制正在合并。对企业来说，观测供应商的选择会反过来约束网关和策略引擎的选择。Helicone、AgentOps、Coze Loop 本周无动态，LangSmith 未取得独立条目。

## 平台层：一家动结构，多家动策略，国内动兼容

AWS 是本周唯一有窗内精确日期、并且改变控制面结构的云厂（见 TOP5 第 2 条）。Google 的动作在策略层，即 10 月 26 日的意图匹配开关。Microsoft Foundry 本周静默：devblog RSS 没有窗内条目，Foundry what's new 页面 404；上一期它刚发完 Routines、Tool Search 与 A2A。[Databricks](https://docs.databricks.com/aws/en/release-notes/product/) 10 月的月档条目补的是身份与 MCP 安全：外部 Agent 默认 OAuth 应用 GA、OAuth 自定义声明按用户过滤、`ai_enrich` 接外部 MCP 做 grounding（Beta）、MCP 调用越狱筛查（Beta）。

国内方面，火山方舟在 10 月 22 日更新了 [API 兼容性公告](https://ark.volcengine.com/region:cn-beijing/docs/api-schema-upgrade-notice)，Responses API 兼容 `apply_patch`、`namespace`/`defer_loading`，以及 Anthropic 的错误格式，并提供原生 web_search 工具。这是用协议细节兼容外部 Harness 来换接入量。阿里云百炼与腾讯 ADP 窗口内没有可核的功能条目，主要动作在窗外：10 月 13 日的 Agent Studio 手册、10 月 19 日的 ADP 4.2.1、10 月 21 日的轨迹评测。阿里云 10 月 26 日的周报称上新 11 款 MCP 服务，本次只读到摘要，证据级 B。

![2026-10-29 AI Agent 基础设施模块×厂商状态热力矩阵：AWS、Google、Anthropic 与 OpenClaw 覆盖面最广，Microsoft 与国内云厂多为空白或背景](/assets/images/posts/2026-10-29-agent-infra-fig1-matrix.png)

*图 1：八个模块 × 十个厂商/项目的本周状态。2=窗内有可核动态，1=月档未标日、窗外背景或限述，0=本周无动态，-1=本次未取得。数据来源：本期研究母稿的状态矩阵（官方 release notes、GitHub releases、厂商公告，读取截至 2026-10-28）。*

### 云厂能力矩阵

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

## 覆盖与局限

- 八个模块全部覆盖，63 个固定对象行均给出状态；GitHub 一手扫描 62 个仓库，窗内条目 157 条。
- AWS（Gateway 除外）、Databricks、腾讯 ADP 的 10 月条目为月级归档，未计为确定的本周事件。
- 阿里云百炼、腾讯 ADP 窗内无可核功能条目；Google Agent Gateway 与部分国内身份条目本次未取得。
- Nango、Pipedream Connect、LangSmith、Firecrawl 未取得可核正文；发布源只返回最近 10 条，高频仓库可能有遗漏。
- 厂商性能数字（如 ADK"最高快 8 倍"）保留原口径，未独立复核。

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
