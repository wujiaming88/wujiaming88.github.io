---
layout: single
bucket: agent-infra
title: "全球 AI Agent 基础设施研究周报 · 责任边界（2026-09-03—09-09）"
date: 2026-09-10 10:00:00 +0800
categories: [AI]
tags: [AI Agent, Agent Infrastructure, Harness, Runtime, Memory, Observability]
toc: true
header:
  overlay_image: /assets/images/posts/2026-09-10-agent-infra-cover.png
  overlay_filter: 0.35
  caption: "AI Agent 基础设施概念示意图。来源：本期 AI 生成配图，不代表实际系统拓扑或性能数据。"
excerpt: "异步执行、恢复、授权、记忆与评估正在形成更明确的责任边界：谁拥有状态，哪一步才算完成，失败后由谁负责？附八层基础设施观察与七平台能力矩阵。"
---

本期值得关注的变化，是异步工具、恢复、授权、网络和记忆操作开始拥有更明确的状态与失败语义。模型协议吸收了一部分Harness控制原语，却没有接管客户后台作业；云端能恢复文件或重新进入handler，也不意味着业务只执行了一次。阅读这些更新，需要始终追问：**谁拥有状态，哪一步才算完成，失败之后由谁负责？**

本期窗口为上海时间2026-09-03 00:00至09-09 24:00，对应UTC `[2026-09-02T16:00:00Z,2026-09-09T16:00:00Z)`；材料采集与核验截至9月10日。事件按发生时间而非检索时间归窗，代码合入、版本发行、文档更新、preview和托管GA分别说明。当前文档只是能力快照，不自动代表本周上线。厂商测试与收益主张均归因原文，未独立生产复现。

## 本期先看哪些变化

按对Harness基础设施格局的信号价值，而非新闻热度，TOP5是：

1. **异步工具进入模型API契约。** OpenAI的异步工具、mid-turn steering，LangChain适配和Microsoft恢复契约共同改变了provider与应用的分工。后台执行、断线重放与审批归属仍由应用负责，不是模型代管所有执行。
2. **恢复正确性成为控制层重点。** OpenClaw在停机前验证升级候选，Anthropic不再让未恢复文件的rewind返回成功，Google ADK在没有新消息时也保存state_delta，Microsoft按具体调用保存审批与OAuth。共同方向是用确定性证据验恢复，而非以回复正常代替状态正确。
3. **工具网关开始明确允许哪一步。** Google9月8日将VPC出口配置做成Connectivity Template；社区Gateway1.30.0拒绝把MCP wildcard继承为REST写权限；Arcade把授权前移，却不取消逐调用检查。身份、consent、网络和动作许可仍是不同边界。
4. **记忆层加强摄取与治理。** AWS9月8日的IngestData不创建短期event也能提取长期记忆；OpenViking、Cognee加强安全边界；Letta把常驻上下文预算变成Git提交门禁。比较维度不只召回质量，还包括租户隔离、来源回取以及写入、迁移失败语义。
5. **可观测性走向可重复评估。** Braintrust9月3日public preview的Patterns、Debugger、Loop，Langfuse回填与导出freshness，Phoenix轨迹导入和Coze Loop实验配置，分别补齐真实参数、可靠回放和修复验证。它们不代表统一标准已GA，也没有独立证据证明通用故障率改善。

Google9月9日沙箱GA、双Registry和VPC-SC增强已有官方日期条目，但没有时刻或时区，尚不能确认发生于UTC9月9日16:00之前，因此不进入严格窗内TOP5。AWS Consent Portal和TypeScript evaluation只有月级日期，以下作为能力背景，不写成本周首发。

## 接受请求不等于完成

### 模型继续，应用仍要收尾

OpenAI[官方changelog](https://platform.openai.com/docs/changelog)在9月3日列出GPT-6 Astra的Responses异步工具、mid-turn steering和会话中修改reasoning effort，9月8日又将Prompt Cache Diagnostics列为GA。

[异步工具契约](https://developers.openai.com/api/docs/guides/async-tool-calling)允许function/custom tool设置`async:true`，模型不必等待结果即可继续。工具实际由客户应用执行，OpenAI不接管客户后台作业；结果仍沿原`call_id`返回。应用提供的`wait_for_tasks`是自定义同步工具，不是内建调度器。该机制支持GPT-6 Astra及后续模型，不适用于hosted built-in tools，不应与programmatic tool calling组合；multi-agent mode也不能与parallel tool calls混用。

[mid-turn steering](https://developers.openai.com/api/docs/guides/steering)只适用于GPT-6 Astra和Responses WebSocket。客户端收到`response.created`后，在同一连接发送`response.steer`，以`previous_response_id`指向正在运行的response。`response.steer.accepted`仅表示排队：服务器要先完成当前output item和已运行的hosted工具，才会自动续答。原response可能以`incomplete_details.reason:"steered"`结束，也可能已经正常完成；token和tool限制按每个response分别计算。已启动工具不会被取消，动作不会回滚，旧输出也不会重写。

若仍缺客户端工具结果或approval，队列继续等待，`response.steer.pending.required_input`说明所需输入。结果应按原response ID回传，不要重复已accepted的steer；显式`response.create`则使用自身tools、instructions等设置。后续失败用`steer.id`关联，`response.steer.failed`意味着不会自动应用。队列只存在于当前连接，不随原response持久化；断线后要保存输入、核对事件和历史，再决定是否重放，不能盲目重发。

Python Agents SDK也在补持久化接缝。[v0.22.1](https://github.com/openai/openai-agents-python/releases/tag/v0.22.1)于9月8日09:18Z发布，新增MCP server-wide guardrails、Unix-local环境隔离配置，修复序列化审批归属、compaction期间并发写入和恢复session写失败。[v0.22.2](https://api.github.com/repos/openai/openai-agents-python/releases/tags/v0.22.2)于9月9日12:36:10Z修复UnixLocal文件API的symlink race，以及pop后compaction response chain重置。SDK发行不等于所有托管能力GA。

[Cache Diagnostics](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics)使用`prompt_cache_options.comparison_response_id`比较请求，返回`tools_changed`、`input_changed`等首个分类原因，适用于GPT-5.6及后续受支持模型。它不加载旧会话、不改变缓存行为，属于best-effort且诊断记录会短期过期。官方称功能本身无额外费用、兼容ZDR，但额外测试请求照常计费；diagnostic token估计不是账单，应以usage核对实际缓存命中和费用。本期未独立验证成本收益。

这些接口说明provider正在吸收Harness原语，同时明确了没有接管的部分。OpenClaw等控制层接入时，应共同持久化call_id、steer id、原审批归属和会话写入结果；后台执行、幂等与授权不能因provider accepted就视为完成。

### 适配器不能省略生命周期

`langchain-openai==1.6.1`承接async tools（#40208）和`configuration_update`（#40201），修复OpenAI3.8环境下Azure AD认证（#40190），并将`gpt-5.6-sol`路由到Responses。[单tag API](https://api.github.com/repos/langchain-ai/langchain/releases/tags/langchain-openai%3D%3D1.6.1)确认初发为9月8日14:20:40Z，updated为14:20:42Z；[release正文](https://github.com/langchain-ai/langchain/releases/tag/langchain-openai%3D%3D1.6.1)是能力依据。1.6.2对GPT-6 Astra reasoning effort的支持于9月9日21:22Z发布，已越窗。

[所查LangGraph发行入口](https://api.github.com/repos/langchain-ai/langgraph/releases?per_page=2)的SDK0.4.4（8月27日）和0.4.3（8月19日）均为旧版。这只能说明该入口未见窗内新版，不能推成整仓或云端静默。[LangSmith Cloud](https://docs.langchain.com/langsmith/changelog)的“August31–September7”周更跨窗，MCP连接器Client ID Metadata Documents、OAuth会话`owner_type/owner_id`与workspace owner、Gateway fallback保留认证上下文、dataset export同时要求read/download权限等，均缺单项日期，只能作为跨窗候选。`langchain.mcp`1.4.0a2 alpha缺发布日期，不纳本期。

统一adapter不等于后台生命周期、幂等、审批和trace因果已经托管。OpenClaw应把provider能力探测与运行契约分开，只在确定性事件持久化后改变状态；本期未做跨provider一致性实验，不称实测兼容性提升。

### 审批绑定一次具体调用

Microsoft Agent Framework [Python1.17.0](https://github.com/microsoft/agent-framework/releases/tag/python-1.17.0)于9月3日发布，把框架与托管接缝上的历史和授权归属写得更明确。Foundry-hosting由Agent Server或agent拥有model history，避免双重conversation replay；审批绑定稳定的function-call occurrence并保留legacy兼容；有效OAuth consent responses会持久化并在恢复中还原；workflow-as-agent恢复审批时保留client tools和request correlation。

版本还保留provider refusal在history、replay、hosting、UI中的marked text，避免并行function结果丢失，让compaction mutation跨tool loop保存，并对齐Responses续答和媒体schema。sequence-only middleware inputs恢复、删除experimental agent-hooks core extra属于BREAKING；共享chat client仅保证同event-loop并发契约，不能推定跨loop安全。

OpenAI SDK3.x支持不降低既有支持下限；Mistral客户端迁往官方SDK；即便取消掩盖了底层MCP初始化失败，也需要呈现失败。DevUI保留message边界、多模态、实测usage和stream response ID；转换过程保存falsey结果、JSON-safe参数、shell limits及replay metadata。Foundry-hosted Telegram只是sample，不证明Hosted Agents、Copilot Studio或M365 SDK同期全面GA。[Semantic Kernel推荐迁往AF](https://raw.githubusercontent.com/microsoft/semantic-kernel/main/README.md)和[AutoGen maintenance](https://raw.githubusercontent.com/microsoft/autogen/main/README.md)也只是当前README背景，不是本周迁移公告。

对OpenClaw的参照很具体：许可要绑定一次调用，而不是工具名或会话的泛授权；恢复时区分历史所有者并保留用户意图，防止重复副作用。没有独立生产故障率或采用数据，不能量化这些修复的可靠性收益。

### 没有新消息也要写状态

Google ADK的[提交补丁](https://github.com/google/adk-python/commit/6de43b05a07f8ca89909664b3a21049646d7336c.patch)修复了以`invocation_id`恢复、却不传`new_message`时忽略调用者`state_delta`的问题。完整SHA为`6de43b05a07f8ca89909664b3a21049646d7336c`；committer时间为9月9日05:56:08Z，patch作者时间05:55:22Z，两个字段并不冲突。[窗口commit元数据](https://api.github.com/repos/google/adk-python/commits?since=2026-09-02T16:00:00Z&until=2026-09-09T16:00:00Z&per_page=2)用于日期定位。

新增`_append_state_delta_event()`构造无content的`Event(author='user',actions=EventActions(state_delta=...))`，继承isolation scope、run-config metadata和branch context，再经session service的`append_event`持久化。普通Runner和workflow node runner都覆盖；`yield_user_message`只控制是否向外yield，不决定state是否写入。

补丁测试涵盖普通agent、LLM agent和workflow的两种yield设置，验证resumed_key存在，LLM无content增量事件branch为None。本期未独立运行测试，不承诺所有session后端通过。所见release v1.39.1（8月27日）、v2.8.0（8月26日）都较早，因此这是一项窗内代码合入，尚未确认进入稳定包或Vertex部署。

审批、外部状态和管理员纠偏可能没有用户消息。状态与聊天解耦，并保存scope、branch、metadata，才有事件日志驱动的恢复。OpenClaw应测试“无新消息、只有状态变化、前端不展示事件”时是否仍正确落盘，而非只看模型输出。

### 回滚报告必须对应实物

Anthropic TypeScript SDK [v0.3.259](https://api.github.com/repos/anthropics/claude-agent-sdk-typescript/releases/tags/v0.3.259)加入`permissionPrompts:'none'`：无人接收权限弹窗时自动拒绝，但不关闭auto mode分类器。`user_message_uuids`与单数UUID并存，允许一条回复关联多条合并消息。[v0.3.260](https://api.github.com/repos/anthropics/claude-agent-sdk-typescript/releases/tags/v0.3.260)修复`managedSettings`中的`disableAutoMode:"disable"`被restrictive-only过滤器丢弃；`rewindFiles()`在checkpoint备份缺失、没有文件可恢复时必须返回失败，不再虚报成功。

0.3.260还为thinking_tokens关联消息UUID，增加`first_content_frame_ms`、`first_stream_post_ms`、`first_stream_post_ack_ms`、`first_stream_post_wall_ms`远端延迟分解字段；结构化输出重试耗尽时附最后tool error，并指出key、允许值及实际长度或数量。重复429期间约每个限流窗口30秒重新发rate_limit_event，避免消费者状态陈旧。

[v0.3.265](https://api.github.com/repos/anthropics/claude-agent-sdk-typescript/releases/tags/v0.3.265)补齐synthetic turn、resume自行开始的turn和无API请求slash command成功结果的UUID。每次所回答消息改变后的首帧都会更新归属，而非每turn仅一次；Agent执行的`cd`跨turn保留，不再每条消息回到初始`cwd`。

三版初次published_at依次为2026-09-02T22:33:48Z、09-03T23:48:13Z、09-08T20:37:33Z，均在上海周窗内，不能由Atom updated反推首发。[Python0.2.152](https://github.com/anthropics/claude-agent-sdk-python/releases/tag/v0.2.152)于9月2日22:48:51Z发布，只将bundled CLI更新到2.1.259；[TS日期入口](https://api.github.com/repos/anthropics/claude-agent-sdk-typescript/releases?per_page=1&page=2)所对应0.3.266于9月8日23:55:30Z初发，仅Code parity。0.3.267于9月9日19:58:41Z越窗，其SSE追赶和systemPrompt snapshot不纳本期。

消息UUID连接UI、日志、账单及恢复归属，cwd则是显式跨轮状态。OpenClaw可建立一对多消息映射和无接收者审批策略；无人审批时的拒绝、文件回滚实物验证，比更大的自动权限更重要。这些都是SDK修复，不是托管runtime、MCP或Computer Use全面GA，也没有独立事故率或可靠性收益数据。

### 升级本身也是恢复事务

OpenClaw稳定版[v2026.9.3](https://github.com/openclaw/openclaw/releases/tag/v2026.9.3)的版本名不是发布日期。[单tag API](https://api.github.com/repos/openclaw/openclaw/releases/tags/v2026.9.3)给出的`published_at=2026-09-08T14:15:53Z`，即上海9月8日22:15:53；`updated_at=9/8 19:18:34Z`是另一个字段。发布概要包括候选环境验证、升级恢复、跨工作区agent-owned Skill Workshop、持久session和有界递归委派。以下升级机制依据[PR #138839](https://github.com/openclaw/openclaw/pull/138839)；[技能归属PR #135528](https://api.github.com/repos/openclaw/openclaw/pulls/135528)只作概要定位，不扩展能力保证，也不声称已完整读遍巨型release。

候选包或Git代码的stage、lint、配置与插件检查、隔离SQLite快照canary，均移到旧Gateway仍在服务的阶段。同版本或同SHA的no-op不停止服务；停机窗口收窄到swap、受管迁移和start。旧包和launcher会保留到验证完成，记录版本/build、插件、channel、readiness、advisory inference、停机与失败账本。激活后还要验证真实服务和ownership readiness，文件恢复成功不等于已恢复在线。

这不是零停机，也不是万能回滚。只有配置和状态schema不变时才能恢复旧代际，新schema需要候选代码负责finalization。原生包共享项目的兄弟组件若已变化，将拒绝回滚，保留候选与备份并记录`rollback-project-changed`；插件维护可能形成第二停机窗口。较旧降级目标若没有新的migration continuation worker，也不会获得新的schema-neutral回滚保证。Windows等平台专项补偿和测试不等于跨平台生产SLA，独立并发升级准入仍须审慎验证；维护者不同阶段的测试数量与耗时不能拼成统一性能结论。

Agent OS的差异化在于控制面自身也有可审计、可验证、可恢复的变更边界。验收应检查真实Gateway readiness、版本代际、失败账本与回滚条件；跨工作区技能迁移先证明归属和可恢复性，不能用LLM修复替代确定性schema检查。控制层正在标准化“恢复后属于谁、实际完成什么、权限是否仍有效”，而不是标准化万能循环；状态事件、审批归属和副作用验证，比工具数量更能形成长期可靠性。

## 恢复要恢复到哪一层

长任务的标准件正在从“异步执行”细化为计算租约、状态持久化、恢复粒度、执行所有权和投递证据；这些维度需要分别验收。文件回来、输出重放、handler重入与业务只执行一次，是四个不同验收项。本期确认的托管执行信号集中于E2B、Daytona；OpenClaw有稳定版本与代码活动。其他云端Runtime的新发并未全部证实：Google9月9日有周界问题，Microsoft只有文档更新时间，国内部分入口核验受限，不能据此说云厂没有更新。

### Worker恢复与组织权限

E2B[9月7日周更](https://docs.e2b.dev/changelog)宣布[Workspaces](https://docs.e2b.dev/workspaces)开始rollout，而非全量GA。API key仍归project，已有project ID、keys、templates、sandboxes、volumes和计费不变。workspace成员可以访问全部project；只需要单项目权限时，应把成员加到project而非workspace。当前同project成员权限相同，workspace统一账单仍在roadmap，不能称已有细粒度RBAC或统一计费。

[Cursor集成](https://docs.e2b.dev/agents/cursor)将agent loop留在Cursor云端，每个请求分配E2B独立worker sandbox。它要求Cursor Enterprise开启Self-Hosted Machines，并使用service-account API key；个人或管理员key不能启动worker。worker默认hibernate，闲置时pause、后续消息到来时resume。但dispatcher必须运行，Cursor的排队流量不能唤醒已暂停dispatcher。默认并发20个worker，更多请求在Cursor排队；私库token经egress proxy提供，不写进worker。这是工具执行面外置，不是完整推理控制面迁往客户环境。

Python SDK2.46.4将单sandbox的命令和文件流分到默认4个连接池，以缓解单连接HTTP/2流上限，不增加算力或API配额；`E2B_ENVD_POOL_SHARDS`必须在import前设置。`network.httpsPorts`在pause/resume后保留，恢复后误用root、暂停前日志丢失、pause途中进程退出误报失败也获修复。[SDK PR1793](https://github.com/e2b-dev/E2B/pull/1793)和[infra变更](https://github.com/e2b-dev/infra/commit/b5f419a2b122f8ff881497681bde0d109cbbf0fe)仅作辅助：关联PR的Draft/merged状态获取不足，截断diff不能称全文，出货依据采用9月7日周更而非9月1日开PR日期。

长期执行的可信度，不只取决于resume速度，也取决于恢复UID、最后日志、TLS端口和dispatcher真实唤醒来源。OpenClaw接入Workspaces时还需防止跨项目权限放大；这些官方版本与能力证据不构成全服务SLA。

### SDK升级会改变端点来源

Daytona[日期索引](https://www.daytona.io/changelog)将0.210.0列为9月3日，0.211.2列为9月8日。[0.210.0](https://www.daytona.io/changelog/mi355x-gpu-type-and-python-sdk-s3-upload-reliability)在API client中增加MI355X GPU类型，并改善Python SDK的S3上传可靠性；枚举字段不证明所有region都有可用GPU，也不证明资源GA。

[0.211.2](https://www.daytona.io/changelog/streamed-context-uploads-and-cli-ssh-format-fixes)为Go、Python、Ruby构建context提供multipart流式上传，修复CLI archive路径和COPY source解析，遵循文档SSH命令格式，并让TypeScript遇stale连接时重试。重试不等于exactly-once，也没有保证所有调用幂等。

其重要breaking change在配置读取：Python、Ruby和TypeScript SDK不再从`.env`或`.env.local`解析`DAYTONA_API_URL`、`DAYTONA_SERVER_URL`，必须使用进程环境或constructor的`api_url`。依赖项目dotenv切换公有、私有环境的部署，可能落到错误默认端点或连接失败。OpenClaw环境adapter应在启动诊断中显示脱敏后的实际URL、配置来源和SDK版本，在空进程环境及真实worker镜像中验证，而非只测本地shell；上传和COPY语义也应进入升级验收，不能只看create sandbox成功。

### 活性、输出和投递分账

OpenClaw9月8日发布的v2026.9.3，概要包括cold session减阻、memory检索启动优化和worker build重用。[PR #141141](https://github.com/openclaw/openclaw/pull/141141)的9月7日活动与Merged状态支持cloud runtime preparation变动。[#140730](https://github.com/openclaw/openclaw/pull/140730)减少隔离vector-search子进程重复启动，统一私有host入口，同时保留SQLite、sqlite-vec、text helpers、取消和索引发布语义。作者所称86.3%来自特定native-child对照，不是Gateway或cron整体提速。

[#140840](https://github.com/openclaw/openclaw/pull/140840)将cold durable preparation和commit reopen放进现有writer queue的异步数据库准入。排队前捕获环境、state root和物理database path，避免排队期间环境变化，把维护任务交给错误owner。schema、retention和公开RPC形状不变；作者也说明，冷操作总耗时可能增加，以换取较短的event-loop连续停顿，并非普遍低延迟。该PR页面没有合并时刻，这里只按release关联采用，不另报精确合并日。

[当前cron设计](https://docs.openclaw.ai/automation/cron-jobs/how-it-works)是Gateway进程内自动化，schedule、run state和history位于SQLite；Gateway不运行，就不能准时触发。browser、process、MCP teardown为best-effort；必需投递失败或状态不明时，保留disabled job供检查，不重新放送payload。超时先abort并清理ownership；startup catch-up和lost-task reconciliation不能以会话记录存在判断活性。

[session](https://docs.openclaw.ai/concepts/session)区分`sessionStartedAt`、`lastInteractionAt`与`updatedAt`，cron和heartbeat bookkeeping不会延长用户idle freshness。这些是现行设计背景，未将滚动文档冒充本周cron新发。执行所有权、输出完成、投递确认及外部副作用应分别落账；“有最后一条消息”不是成功信号，阻塞时长也应与完成耗时分开测。

### 云端恢复的不同含义

**AWS AgentCore Runtime**当前按session以独立microVM隔离CPU、内存和文件，最长8小时，文档给出的空闲终止时间为15分钟。终止会销毁VM、清除内存；同一`runtimeSessionId`再次调用得到新环境，而非恢复旧进程，持久上下文须另接存储。配置更新产生不可变版本，DEFAULT endpoint自动转向新版本，生产固定版本应使用受控endpoint。HTTP、MCP、A2A、双向WebSocket支持不赋予异步任务无限生命周期或持久工作流语义。本期未确认窗内产品新发。[Runtime原理](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-how-it-works.html)

**Google沙箱**的pause释放compute，保留文件系统、sandbox ID、连接metadata及PSC端点，但不保留应用内存或调用栈。STATE_PAUSED时数据面返回错误，resume完成后才可用；配置变更需要删建，管理需要`roles/aiplatform.user`。“秒级恢复”“更便宜”只是官方定性说法，无实测SLA或账单。[生命周期文档](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sandbox/manage-sandboxes)不能据此扩展为所有长任务无损续跑。

[Google Managed Agents](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/managed-agents)由Agents API配置、挂源和设置网络allowlist，Interactions API负责执行；每agent有隔离sandbox，默认没有外网、系统或凭证访问，须开发者开启并提供最小权限凭证。其GA或preview状态未从本次概述确证，不能随9月9日其他沙箱GA一并升级，也未证实其本体本周首发。

**Microsoft Hosted Agents**页面`updated_at=9/8 17:20Z`，而ms.date仍为8月19日，只能证明文档更新。[Hosted Agents](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents)支持自带容器和框架、每session VM隔离，`$HOME`与`/files`跨idle持久；Responses由平台管conversation，Invocations由应用自管。

[长任务resilience](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/long-running-agent-resilience)明确是preview、无SLA。background只解除HTTP连接生命周期限制，恢复依赖持久work/input identity、落盘、lease回收和handler从头重入，不保存局部变量或调用栈，也不是确定性回放。只有stored background responses显式resilient才有完整crash恢复，foreground不会自动重调；checkpoint、副作用幂等和清理由应用负责，流cursor回放不是workflow checkpoint。

**阿里百炼和PAI**所查入口未确认窗内runtime事件。[百炼应用日志](https://help.aliyun.com/zh/model-studio/application-release-notes)最新明列2月，1月15日工作流异步、2025年高代码均为旧动态；[PAI日志](https://help.aliyun.com/zh/pai/product-overview/feature-release-notes)最新可见7月21日DSW MCP Server化，6月30日AgentBox/Agentic Readiness V1.0、2月26日DSW部署OpenClaw也都在窗外。模型上下架、开发机和应用托管不能混成runtime升级。

**火山与Coze**的[Ark公告入口](https://www.volcengine.com/docs/82379/1159177)、[Ark另一入口](https://docs.volcengine.com/docs/82379/1099503?lang=zh)、[扣子团队文档](https://www.volcengine.com/docs/84458/1529727)正文提取失败，[Coze日志](https://www.coze.cn/open/docs/guides/changelog)仅标题壳，属于核验受限而非静默。现有证据不能承诺PAI、Ark、Coze无缝替换session、cron或browser。

**腾讯CloudBase**[概述](https://cloud.tencent.com/document/product/876/46894)更新于4月21日，提供数据库、认证、云函数、云托管和存储；云函数SSE/Streamable支持Agent应用，但AI coding、MCP、Skills并不证明逐次执行的强隔离浏览器或微VM pause/resume。[元器](https://yuanqi.tencent.com/)可读内容是分发列表，缺窗口日期和生命周期证据。同属腾讯不代表共用runtime。

**Modal**所查[SDK releases](https://modal.com/docs/sdk/py/releases)中，1.5.5（8月28日）的Sandbox.logs只存entrypoint日志，可fetch/tail而不stream；1.5.4（8月12日）的`MODAL_SANDBOX_V2=1`是新backend opt-in，与旧FileIO filesystem不兼容，计划1.6.0默认开启。它们均非本周；[changelog](https://modal.com/changelog)空页或旧日志只能支持有限渠道未发现新增，不能扩大为项目静默。

### 工具协议不是托管桌面

OpenAI9月3日发布的[gpt-6-astra模型卡](https://developers.openai.com/api/docs/models/gpt-6-astra)，在Responses列出computer_use、code_interpreter和hosted_shell。这是新模型进入工具栈，不是通用托管桌面新GA。模型卡唯一列出的alias/snapshot均为`gpt-6-astra`，不应编造日期版本。[API日志](https://developers.openai.com/api/docs/changelog)与模型卡用于这一事件判断。

[Computer Use指南](https://developers.openai.com/api/docs/guides/tools-computer-use)要求开发者提供环境，应用执行模型请求并回传截图或结果；可选Playwright/PyAutoGUI等code execution，或结构化computer工具。当前建议Astra使用前者，但仍支持后者；指南没有新发日，不能说建议本周才改变。[集成边界](https://developers.openai.com/api/docs/guides/tools-computer-use-integration)还要求区分模型与工具兼容性：模型能用Chat Completions，不意味着同样工具都可用，相关工具需要Responses。`reasoning.effort=none`、自定义temperature/top_p和logprobs不支持，旧client透传可能失败。

任务应维持同一浏览器或桌面session，隔离浏览器不继承host环境变量。async tools、steering是控制协议，不是sandbox pause/resume；模型升级不能成为放松敏感写操作确认的理由。

Anthropic当前[Computer Use指南](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)中的`computer_toolset_20260801`是17个member tools的客户端toolset，由开发者控制环境，当前不在Claude Managed Agents提供。Claude API、Google Cloud支持该toolset，其他平台仍限较早beta工具，不能全平台统称GA；版本名日期不是已证发布日期。[Claude日志](https://platform.claude.com/docs/en/release-notes/overview)9月3日可见ant CLI1.30.0 resources-as-code、Google Cloud mid-conversation effort beta，并非Computer Use新发；9月1日模型更新也不纳本周。以上长指南只采用已核有关区块，不代表整站全文核验。

对OpenClaw，应分开模型adapter与环境adapter。支持code不等于任意host shell适宜直连；UI动作、截图、会话存活和用户确认需要分别验收。

### 企业沙箱要逐项配置

Google[release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)的9月9日条目称Computer Use、Shell GA，同批包括pause/resume、VPC-SC、PSC和CMEK，但具体时区未给出，本期保留日期边界待核。[Computer Use](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sandbox/computer-use)在容器浏览器执行导航、点击、输入和截图，支持API、CDP/Playwright，以及VNC观察。

[Shell](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sandbox/shell-sandbox-quickstart)使用`/exec`，不能调用Python Code Execution的`send_command()/execute_code()`；示例helper是`client.sandboxes.execute_bash`。执行主体是无sudo的appuser，每次新建shell，cwd和shell变量不自动跨调用保持，应通过`/workspace`文件存状态。网络默认关闭，迁移还需适配stdout、stderr、returncode。

PSC私有入口仅限同consumer project；[VPC-SC](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sandbox/configure-vpc-sc)保护资源，却不提供request/response logging，出网仍需要NAT、防火墙或Secure Web Proxy。[CMEK](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sandbox/configure-cmek)只能在父Agent Platform实例创建时设置，使用同区域single-region key；可轮转同key版本，换key要重建。它覆盖根文件系统和snapshot，不覆盖resource metadata、环境变量及service-account email；撤销key权限会阻断provision、resume和snapshot写入。

配置示例使用v1beta1不推翻公告GA，但SDK中的vertexai/agentplatform命名混用需要锁版本验证。9月2日deferred tier的50%折扣也缺左边界时刻，不纳本周。云厂在争夺独立sandbox企业执行面，但网络隔离、密钥控制不是业务授权，也不意味着全部metadata由客户密钥加密；跨后端adapter应显式呈现状态粒度、网络与恢复失败条件。

### 录制和权限不是默认附赠

AWS[Browser](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html)区分默认`aws.browser.v1`与custom Browser。session默认15分钟、最长8小时；WebSocket Automation可接Playwright、Strands、Nova Act，Live View支持实时观察和人工交互。**只有custom Browser**支持把DOM变化、用户动作、控制台及网络事件记录到客户S3，不能写成所有浏览器默认录像；TTL结束即终止会话。

[Code Interpreter](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html)支持Python、JavaScript、TypeScript，同样默认15分钟、最长8小时。inline上传100MB，与终端命令至S3最高5GB是不同通道，不能合成一个API限额。网络模式、执行角色可配置；安全隔离不等于任意代码无风险或已获业务授权。本期未确认两项产品窗内新发。

Microsoft的[Browser quickstart](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/browser-automation-hosted-agent-quickstart)要求独立Playwright Workspace、resource ID、wss endpoint，再部署container Hosted Agent，并赋予Playwright Workspace Contributor角色。文中“project managed identity”与去agent Identity查看object ID的步骤存在歧义，实施时须核对实际主体，而非任意授予。preview按具体标记能力处理，不能把所有Foundry一概preview。[Browser](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/browser-automation)和[Code Interpreter](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/code-interpreter)主文档均在8月24日更新，分别描述隔离Playwright和sandbox Python；本期不扩展语言、时长或网络承诺。

### 缓存不能代替恢复
Browserbase[无可核日期的changelog](https://www.browserbase.com/changelog)可见Functions webhook的pending/running/completed/failed状态、Context命名、Stagehand v4服务端缓存控制，但不能认定本周发布。[v4缓存文档](https://docs.stagehand.dev/v4/best-practices/caching)中的act/observe/extract服务端缓存要求Browserbase browser与API key，本地browser的cache选项不生效，model config不入key。

完整[缓存博客](https://www.browserbase.com/blog/stagehand-caching)链接的却是v3：它描述project作用域、selector/prompt/action配置、DOM校验和48小时TTL，并将model config归一化哈希。因此，TTL和model config语义不能移植为v4保证。博客“最高约80%加速”来自同一动作先写、再读缓存的两次运行，不是全任务SLA或新网页普遍收益。DOM或URL漂移应miss后回退模型，不能硬复用selector；Functions webhook也不证明durability或exactly-once。

OpenClaw缓存键应隔离project、account和session，命中后仍验证页面与授权。动作缓存、模型prompt cache、conversation记忆、文件snapshot、stream replay解决不同问题。执行环境正在商品化，但可移植性仍取决于最小权限、恢复粒度、默认网络和可观测证据，不能由“支持Computer Use”替代安全验收。

## 工具接通后谁能做什么

网关从MCP工具目录扩展到推理、HTTP和A2A，难点也随之转向协议间权限语义、出口路径和升级默认值。统一endpoint不是统一业务授权；本期也没有确证MCP、A2A独立协议新版，不能从网关可转发反推协议授权等价。

### 出口路由成为控制面资源

Google9月8日发布的[Connectivity Template配置](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/set-up-vpc-connectivity)，用`agentConnectivityTemplate`中的`egressNetworkConfig.networkAttachment`引用PSC attachment，再以`vpcEgress`区分默认`PRIVATE_RANGES_ONLY`和`ALL_TRAFFIC`。默认只有指定私网地址段进入VPC，Internet流量不经过企业VPC；ALL_TRAFFIC将公网及非RFC1918流量也送进VPC，客户须负责默认路由、安全设备以及通常必要的Cloud NAT。

模板还包含`accessPath:AGENT_TO_ANYWHERE`。单Gateway子网至少/28，多实例需扩充地址池，attachment字段配置后不可变。network attachment与DNS peering目标必须在同一VPC；DNS只应配置明确域后缀，不应以根域、通配或googleapis.com兜底。Shared VPC或跨project部署要求provisioning identity、Gateway service agent分别具备network/DNS权限，给agent业务权限并不足够。

当前[Gateway overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/agent-gateway-overview)支持HTTP、MCP和A2A转发，但只有MCP具备属性解析和tool name细粒度策略。Gemini Enterprise只支持egress，ingress不受相同IAM/IAP管控。[官方日期条目](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)在9月9日另列最多两个Registry——一个global加一个regional/multi-region——及VPC-SC；当前配置要求Connectivity Template为ALL_TRAFFIC，但缺时刻和时区，不能纳为严格本周新发，更不能将全部安全套件算到9月8日。

企业竞争在转向每条出口走哪里、谁负责路由和授权，代价是跨project角色与网络配置成为发布依赖。OpenClaw应分别验工具allowlist和审批、workload身份、强制出口路径，不能以连接成功证明数据边界达标。

### 通配权限不能跨协议继承

社区项目agentic-community的[Gateway & Registry1.30.0](https://github.com/agentic-community/mcp-gateway-registry/releases/tag/1.30.0)标题为“The Gateway for Any Resource: Inference, MCP, A2A, and REST”。[单tag API](https://api.github.com/repos/agentic-community/mcp-gateway-registry/releases/tags/1.30.0)确认初发为2026-09-09T03:38:18Z，并区分created、published和updated。它将MCP入口扩展到推理、A2A和REST，但generic proxy默认关闭，不是升级后自动启用全部代理。

[PR #1732](https://github.com/agentic-community/mcp-gateway-registry/pull/1732)明确：MCP的`methods:["all"]`不能转换为HTTP DELETE、PUT等权限，两者属于不同授权命名空间。原本只有MCP wildcard的管理员会在通用代理得到403，因此registry-admins显式获得HTTP verbs，普通组则保持跨协议不提权。

[#1697](https://github.com/agentic-community/mcp-gateway-registry/pull/1697)在公网listener阻断`/api/internal/*`，隔离原先可能被public `/api/`兜底路由的egress-token等内部路径，运维改走用户JWT管理接口。这是关闭网络路径，不证明修复了新的业务授权漏洞。部分讨论发生于8月31日，属于本版收录的升级边界，不是每条代码都本周首次发生。扫描失败自动禁用还依赖toggle_service权限，有扫描器不等于失败时必然隔离。

metrics迁移同样需要验收：`target_kind`从unknown改为generic_proxy_skill、agent或custom，server持实体authz key而非gateway；success统一小写true/false，旧True查询可能返回空值而不报错；duration不再带server标签，改按target_kind分组。服务启动成功不能替代dashboard和报警验收，原文测试也只是维护者自述。

[官方MCP Registry](https://modelcontextprotocol.io/registry/about)是另一个项目，当前仍为preview，可能发生破坏性变更或数据重置。它存server.json元数据，指向npm、PyPI、Docker，不托管代码；GitHub或域名验证只证明命名空间控制，不证明代码安全，扫描交由上游包注册表和下游aggregator。官方目录不支持仅私网或私有包仓库服务，企业应实现兼容OpenAPI接口；官方代码并非面向自托管设计，fork运维自担，host宜消费策展目录。本期commit提取不足，也不能据此说没有提交。

OpenClaw的动态工具应分为发现、可安装、向模型暴露、执行写入四种状态。跨协议默认拒绝wildcard继承，让审核和注册失败可见；命名空间验证不能替代依赖安全与运行许可。

### 动态连接不等于免审执行

Composio[9月4日00:00Z的比较文章](https://composio.dev/content/composio-vs-pipedream)将自己定位为Agent action infrastructure：少数meta tools负责动态发现、读取schema、管理连接和执行；Tool Router按已连接账户路由，并统一OAuth refresh、限流退避、重试与结构化输出。`COMPOSIO_MANAGE_CONNECTIONS`可生成Connect Link，用户OAuth完成后由平台持有凭证，同用户同toolkit支持多账户；逐调用集中审计是官方主张。这是一篇本周公开竞争说明，不证明这些功能都在9月4日首发。

其将Pipedream描述为只能dashboard预授权、不能动态连接的线性工作流产品，但[Pipedream Connect Link](https://pipedream.com/docs/connect/managed-auth/connect-link)支持按终端用户生成连接链接，[MCP文档](https://pipedream.com/docs/connect/mcp)也支持应用代表用户执行，因此本期不采纳“不支持会话中授权”的说法。Composio的调用量、成功率、tool总数和价格缺独立双源，不作为胜负或采用指标，也不混合同页不同目录口径。

Pipedream当前按应用提供MCP server，既可个人连接自己账户，也可嵌入应用代表用户；本期未确认MCP或managed auth的窗内首发，以下为能力背景。凭证加密、服务器执行，官方称不直接暴露给模型或客户端，用户可撤销。Connect Link绑定特定终端用户，4小时过期，无需自建授权前端；4小时是连接链接寿命，不是第三方access/refresh token TTL。文档没有明确每次API写入是否单独批准、撤销怎样传播到在途请求或审计是否完整，不能扩展承诺。

独立执行平台外移了API、schema和OAuth维护成本，同时引入托管凭证、目录、运行记录依赖。OpenClaw应分离发现、连接与执行，让凭证留在模型外、多账户显式选择，并逐工具验证参数、scope、错误恢复、幂等键及重试关联；managed OAuth不能代替高风险写入批准。

### 私网可达仍有授权边界

OpenAI [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels)由私网主机主动发起出站HTTPS长轮询，本地client转发MCP JSON-RPC，无需让私有服务开放公网入站。它支持stdio、HTTP后端，可选控制面及后端mTLS，但OAuth授权服务器不会自动一同隧道化，仍必须可达。组织Tunnels Read、Manage、Use与ChatGPT workspace developer-mode权限独立，个人Platform组织绑定不会自动出现在企业workspace。

[tunnel-client0.0.14](https://github.com/openai/tunnel-client/releases/tag/v0.0.14)的Atom updated为9月2日00:16:48Z，早于左界，属于背景。正文说明MCP2026-07-28无会话请求能力在该tag之前已落地，本版验证的是多副本OAuth和Harpoon，不能写成无会话首发。startup HMAC一致只证明启动目录一致，不证明副本健康、同时轮询、共享状态或动态收敛。跨origin redirect和转发头收紧、support archive额外header secret脱敏均为维护者说明；Harpoon仅允许管理员配置目标与HTTP方法，不是用户任意主机代理。

Tunnel元数据创建、修改、删除有Platform audit，但传输请求、控制面鉴权、长轮询不会变成ChatGPT Compliance app事件；应用调用以及关联、解除日志仍走应用路径。“有合规日志”不等于全传输审计。

Anthropic [远程MCP connector](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector)当前带beta标识`mcp-client-2025-11-20`，支持Claude API、Claude Platform on AWS和Microsoft Foundry，不适用Amazon Bedrock或Google Cloud。它只支持tool calls，后端必须公开HTTPS，使用SSE或Streamable HTTP而非本地stdio；`mcp_servers`连接服务，`mcp_toolset`暴露工具。

默认enabled=true意味着仅使用denylist会自动允许未来新增工具。最小权限宜采用`default_config.enabled=false`后显式启用；未知工具名只warning、不error，拼错denylist不能由请求成功排除风险。`defer_loading`只是schema进入上下文的时机，不是授权。OAuth access token须调用方事先授权、自行刷新，authorization_token不等于平台代管全生命周期；connector不受ZDR覆盖，工具定义和结果遵循标准留存。SDK helpers能自行管理stdio、prompts、resources再转API，不等于平台connector也有相同范围。本周9月3日ant apply、per-message effort不能借作MCP新发。

### Skills的传输与激活分开

Arcade的[Skills Over MCP文章](https://www.arcade.dev/blog/skills-over-mcp-explained/)JSON-LD时间为9月8日16:00Z，即上海9月9日，属于本周生态观点，而非MCP核心版本发布。[固定SHA的SEP2640](https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/d6b31a03504c15677d49b922b6b6ace0ef65728d/docs/seps/2640-skills-extension.mdx)标为Accepted、Extensions Track、Created4月23日，但接受或合并时刻未核，不能宣称本周正式标准新发。文章称写作时尚未合并，与固定规范是不同证据快照，这里采用规范状态而不猜时序。[MCP release feed](https://github.com/modelcontextprotocol/modelcontextprotocol/releases.atom)所见首条为7月，[A2A release feed](https://github.com/a2aproject/A2A/releases.atom)所见v1.0.1为5月更新，均不能证明本周独立新版。

规范复用Resources传输SKILL.md目录，`skills/list`、`skills/get`用于发现和获取元数据，可选`resources/directory/read`导航、`resources/read`取文件。URI scheme本身不证明是skill，须由目录或明确引用经get确认；skills/list可以为空或只返回部分，不代表服务没有skill。嵌套SKILL.md普通读取只是内容，独立激活需要新的用户同意，父skill批准不覆盖子skill。

Arcade指出，手册随工具分发、渐进披露和manifest hash有助一致性，但远程内容仍不可信，摘要、哈希不能替代来源、用户批准或业务授权；能读取resources也不等于完整激活或信任模型。其对OpenAI8月26日提交期snapshot与实时server updates的比较，是厂商对他方实现的分析，本期未另核客户端文档，不把各家容量限制写成事实或迁移承诺。固定规范只核有关前部，不将长规范全篇计为精读。OpenClaw应区分传输、安装、激活、自动更新、allowed-tools批准，技能分发不能改变既有执行授权。

### 平台工具入口的限制

AWS [Gateway](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html)当前可由OpenAPI、Smithy、Lambda生成工具，passthrough接HTTP/A2A，并统一路由模型推理；入站验证agent，出站处理OAuth、refresh和凭证注入。语义工具选择可降低schema负担，不等于业务资源授权；“only solution”“省数周”等无独立证据，不予采用。Registry GA在8月，不算本周。[Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)的Toolbox集中MCP端点、版本和认证，仍须与实际部署及身份区分，本期未证独立新增。

阿里[AI网关MCP管理](https://help.aliyun.com/zh/api-gateway/ai-gateway/getting-started/mcp-service-management)支持原生代理、HTTP转换和Nacos同步，消费者认证默认关闭，且该授权路径仅API Key；启用后没有授权关系即不可访问。后端Basic、Bearer或API Key不能误作前端OAuth。Nacos要求MSE铂金3.0+、网关引擎2.1.6+，长连接升级可能重建。

腾讯[MCP广场文档](https://cloud.tencent.com/document/product/1212/123193)日期为8月13日，属于背景：Local在本机注入SecretId/SecretKey或token，Hosted填写KEY/TOKEN后生成用户专属SSE URL。URL路径中的token应按凭证保护，不能进入普通日志、截图或转发。“暂无第三方MCP上架与更新服务”不等于平台停服，Local样例的autoApprove空数组也不代表全平台审批保证；TTL、轮换、撤销与双主体审计未证。火山两个官方MCP入口正文提取失败，[其中可回溯入口](https://www.volcengine.com/docs/6569/1816086)导航中的API Key、HMAC、OAuth2名称，不证明适用于MCP或本周新发。

工具连接正在商品化，差异化移向协议语义、动态发现审核、凭证代理和审计覆盖。目录不是认证，网络接通不是授权，重试不是幂等。

## 预授权之后仍需逐步检查

consent前移可以减少无人值守中断，却不能免除逐动作授权。身份验证、用户consent、网络可达、工具许可和资源权限必须分开：认证证明是谁，不证明这次动作应当执行。

### 计划前聚合，运行时检查

Arcade的[bundled pre-authorization](https://www.arcade.dev/blog/pre-authorize-agent-tools/)在长任务开始前汇总预计工具scope，每个服务一个approval link，例如多个Google工具合并一次Google授权，而不是所有服务共用一条链接。页面显示美国9月2日，JSON-LD `datePublished=2026-09-02T16:00:00.000Z`恰好落在上海周窗左界，因此纳入本期。运行时仍按用户、资源和许可逐调用检查，认证、OAuth consent、动作policy不能合称“登录一次全部可用”。

它把授权从中途报错后补救前移到计划阶段，减少用户不在时的空转。但原文没有给出token TTL、撤销传播、失败回滚或计划工具集变化的精确API行为；最小权限仍受第三方OAuth粗scope限制，也没有独立攻击测试。[“approve foundation once”治理文章](https://www.arcade.dev/blog/approve-once-scale-every-agent/)强调统一runtime、policy、audit，其匿名银行案例、成功率与成本缺独立第二源，不采用数字，更不能解释为一次平台审核后永久免审新工具或高风险写入。

OpenClaw可在启动前列出授权清单、按服务聚合consent，运行中继续逐调用检查，而不是靠关闭审批或扩大长期权限来消除中断。

### 控制面日志不覆盖所有调用

Nango[9月3日Audit trail更新](https://nango.dev/docs/updates/changelog.md)增强了控制面追责。[审计文档](https://nango.dev/docs/guides/platform/audit-trail)记录connection变更、integration设置、团队角色与登录，包含actor、action、resource、outcome，覆盖所有environment。但一般读取不记，读取connection credentials、读删sync records、`/proxy`与`POST /action/trigger`不在该日志中。`connection.metadata_updated`和`sync.triggered`从dashboard发起会记，对应API则视为数据面、不记录，不能称所有Agent工具已拥有不可变全链审计。

官方称保留期内条目不可改删，默认保留1年，属于Enterprise plan；本期未独立验证不可变存储实现。CSV最多50,000条，超量时下载仍成功、但提示截断。actor包括dashboard user、api_key、connect_session终端用户、anonymous和legacy public_key；support session用via标记，但operator仅内部ID，客户需询问对应真人。剥离secret可降低二次泄露风险，却不弥补数据面盲点。

[Agent sessions](https://nango.dev/docs/guides/agent-sessions)的9月2日public beta只有日期，缺左界时刻，因此作为背景。backend设置tenant、toolset、discovery后，发独立MCP URL和session bearer token；session不可扩展，终止后返回401，但不取消在途调用。默认toolset包含已解析连接的全部工具，应显式最小化。`nango_proxy`默认关闭，开启后可访问该integration任意endpoint，不受toolset path限制；Agent不能修改自身scope，不等于绝无扩大调用面的可能。当前Agent也不能为尚未连接的integration主动请用户连接。

OpenClaw应区分连接、角色配置日志与逐次工具执行日志；导出必须展示截断标志，不能以下载成功判断证据完整。

### 云身份有组合条件

Google[Agent Identity](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/agent-identity-overview)当前为每agent提供SPIFFE唯一身份、自动轮换X.509证书，而非默认复用service account。Google API token与证书绑定，经Gateway使用DPoP。Auth Manager分别管理API key、2-legged机器OAuth、3-legged用户委托，三种权限来源不同；用户模式包含登录、consent和撤销，IAM管理谁能访问Auth Manager，审计可同时记录用户与agent。

“agent不接触原始凭证”有明确组合条件：只有与Agent Gateway、Gemini Enterprise共同使用时，终端用户凭证才由Auth Manager加密、网关解密，不能外推至任意runtime或集成。删除agent不会删除IAM binding，需清理inactive grants；同名重建产生不同resource ID，不继承旧授权。tool name/read-only policy、Model Armor和VPC-SC也要另配，不是身份认证自带，本期未经攻击复现，亦未证身份本体本周首发。

AWS [managed consent portal公告](https://aws.amazon.com/about-aws/whats-new/2026/09/amazon-bedrock-agentcore/)全文可核，但只有9月、没有具体日。[每个门户绑定一个Gateway](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-consent-portal.html)，OAuth在server端完成，浏览器不持token；管理员可在会话前分享URL，让用户自查连接，解决3LO callback及部分IDE不能展示consent或绑定session的问题。

[前置条件](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-consent-portal-prerequisites.html)仍然具体：Gateway必须JWT inbound，主IdP必须OIDC并发JWT access token，portal OAuth2 provider与authorizer须同issuer，scope包含openid。GitHub、Slack、Salesforce可以作出站OAuth目标，却不能以OAuth-only身份充当门户主IdP。execution role还需读取网关、凭证配置与OAuth client secret，并非无需身份架构。覆盖范围是Identity支持的commercial regions；撤销对在途请求的传播时限未证，不能宣称断连即取消全部动作。

### 委托主体不能被省略

Microsoft[6月15日更新的身份说明](https://learn.microsoft.com/en-us/entra/agent-id/what-are-agent-identities)将agent视为Entra独立身份，区别于人和一般workload。自主权限直接授予agent，委托访问按用户授权。兼容M365的某些场景可配一对一特殊user account，不等于复用人的密码或MFA；Copilot Studio创建者是sponsor，认证记录为AI Agent。

基础Agent ID与高级安全、跨M365能力的许可不同，后者涉及Agent365，不能推定所有条件访问和治理都免费，也不能把避免孤儿权限当作实测保证。9月Entra候选正文403，摘要中的“9月底rollout”不予采用；取证失败也不能判定静默。

阿里[OpenAPI MCP](https://help.aliyun.com/zh/openapi/user-guide/openapi-mcp-server-guide)的Core可语义发现全云API，自定义版只含选定API，发现不等于授权。程序身份采用Agent绑定RAM角色或静态AK，与提问用户无关；因此须在Agent层限制访问者。ActionTrail只记录Agent RAM主体，端到端归因要关联调用者日志；用户OAuth模式才按实际用户权限执行。

复用本地CLI凭证虽方便，却带来隐含权限。应采用最小RAM、轮换，不把AK写进版本控制；官方建议不给模型删除资源API，不能为减少consent使用主账号AK。Core宽发现与程序身份权限并集可能扩大误用面，应展示最终RAM主体，而不只显示“MCP连接成功”。

腾讯Hosted SSE URL本身是敏感访问材料，token TTL、撤销、委托用户映射、scope和双主体日志尚缺充分说明，不能由“专属URL、安全可靠”推导完整企业授权。火山MCP/AgentKit正文获取失败，导航中的API Key、HMAC、OAuth2不作能力事实，也不作静默结论。国内产品的托管GA均不能由README或连接样例推导。

### 资源端仍须接受委托

WorkOS[Cross App Access比较文章](https://workos.com/blog/cross-app-access-converged-in-eight-days)将Okta8月24日、Auth08月31日、Descope9月1日的动作归为两层模式：CIMD识别调用软件，ID-JAG exchange表达企业用户委托。这些发布日期均在窗外，文章自身首发日也未提供，不是本周三厂新发。资源authorization server仍须验证issuer、claims、scope，再决定是否签发自己的access token；不是把企业OIDC登录token直接当成任意工具access token。身份厂商收敛是WorkOS的分析，本期未独立核其客户数或安全覆盖百分比，不据此排名。

[当前AuthKit MCP Auth](https://workos.com/docs/authkit/mcp)以AuthKit为Authorization Server、MCP服务为Resource Server，使用PKCE S256及authorization_code/refresh_token。资源端验证JWT签名、JWKS、issuer、audience，401携带`WWW-Authenticate resource_metadata`供客户端发现受保护资源元数据。CIMD默认关闭，DCR保留兼容。

Resource Indicator将endpoint设为aud；未配置时aud退回环境client ID，resource被忽略。可为漏传resource的CIMD/DCR客户端设置默认Indicator，显式resource仍须验证；手工OAuth或M2M应用不用该默认，旧refresh token授权的audience也不会自动变化。

XAA处于early access，Standalone MCP Auth不支持。Standalone保留现有登录，由应用完成身份认证并调用completion API，AuthKit处理consent/token，Login URI需要external_auth_id。它不会取消资源端的工具参数policy或高风险写批准。OpenClaw接入时，应区分身份token与授权token、软件client与被代表用户，资源侧接受委托才算链路完整。

### 安全验收保留完整链路

至少分别记录：调用者—Agent—凭证主体—tool/action—资源—审批/重试关联。OAuth/OIDC认证、token托管、scope、业务写许可、网络出口和审计覆盖也应分别验收。OpenClaw可参照双主体日志、模型外token broker、Agent下线同步清grant、默认deny和审批绑定具体调用；这些设计建议不意味着已杜绝越权或泄漏，本期没有独立安全测试。

权限层的商业化不是“自动登录”，而是持续回答谁以何身份、在哪个scope、代表谁、对什么资源执行了哪一步。预授权和统一网关减少交互成本，不消除授权与撤销责任。

## 记忆的写入与回取契约

记忆层的标准化重点，正在从add/search转向宿主生命周期、租户隔离、凭证、预算和证据回取。Context Database会调度后台加工任务，也就要承担类似Harness的执行授权与恢复责任。选择性长期记忆仍不是全量无损归档。

### 长期摄取不必先存短期事件

AWS9月8日[AgentCore Memory direct ingestion公告](https://aws.amazon.com/about-aws/whats-new/2026/09/agentcore-memory-direct-ingest/)新增IngestData：不创建short-term event，也能将数据送进长期记忆提取策略。它支持USER/ASSISTANT对话和JSON格式的行为、活动、系统事件，metadata走与CreateEvent相同的pipeline。结果可用ListMemoryRecords、RetrieveMemoryRecords验证，Kinesis通知和ListMemoryExtractionJobs用于定位、redrive失败。公告称全部支持Memory的区域可用，不是新全平台GA。

自管session的Harness可以只采用AWS长期提取和检索，降低存储商绑定。但不创建短期event不等于不处理或保留数据，仍需考虑记忆对象、任务和服务政策；提交摄取也不等于记忆已经生成。OpenClaw应将短期账本与长期提取、检索、删除生命周期分开，并检查任务和检索结果。

### 任务状态不能携带执行密钥

OpenViking的[安全patch](https://github.com/volcengine/OpenViking/commit/f60a71d0030618488f5f32ccbdda56aa9b1ef0f7.patch)及[同commit说明](https://github.com/volcengine/OpenViking/commit/f60a71d0030618488f5f32ccbdda56aa9b1ef0f7)对应`f60a71d`/#4865，时间为9月9日19:47:55+08。task_tracker的过滤从仅user_key改为`SENSITIVE_TASK_KEYS=frozenset({"api_key","user_key"})`，compile_service从普通args中剥离二者，转为私密参数；任务metadata、结果中的嵌套dict/list也递归过滤。测试覆盖持久化、重启恢复、任务列表不泄密，执行仍将必要key交给真实下游，完成后get_task_auth为空。官方代码与测试同源，不是第三方安全审计。

这项变化发生在knowledge、skills异步compile上：Context Database不再只是检索存储，公开任务状态不等于可以公开执行授权。相邻[#4822缓存线索](https://github.com/volcengine/OpenViking/commit/c82ae5f66485f1fe02f1267ee039a2bd7bd9a343)以embedder实例身份而非同名模型作key，并保护共享任务免受单一等待者取消，但大HTML截断，只保留待全文补核线索，不作已验性能结论。9月10日pushed_at不能当本周发布，本期也没有新GA或许可证变化证据。

[当前README](https://raw.githubusercontent.com/volcengine/OpenViking/main/README.md)将memory、resource、skills统一到viking URI和L0/L1/L2层级，并提供检索trajectory，这是背景，不是Ark托管Memory GA。[旧版v0.4.17](https://github.com/volcengine/OpenViking/releases/tag/v0.4.17)汇总92 commits：URI从旧uid-less当前用户写法改为`viking://~`或显式user ID，旧写法返回400，旧服务不认识`~`，客户端与服务端须成组升级。它还包含session commit archive锁修复、ov-memory-doctor、按memory type/action/result的抽取指标，以及受控模型错误码和真实耗时。该页未取得首发日，不判具体周别、不计本周新发；AGPL-3.0也只是9月10日元数据背景。

这些背景支持OpenViking向Context control plane演进的判断，但session提交和后续提取要分层观察，memory/resources/skills统一命名空间也增加权限治理复杂度。OpenClaw连接此类数据库，应验恢复后仍可执行、导出状态无key、任务完成后授权清理，凭证不进入模型、日志或共享记忆。这是设计参照，不指控现有部署存在已证漏洞。

### 团队记忆的代理信任边界

[TencentDB-Agent-Memory项目](https://github.com/TencentCloud/TencentDB-Agent-Memory)在9月8日13:29:07Z的08e2442/#999中增加[OpenCode适配](https://raw.githubusercontent.com/TencentCloud/TencentDB-Agent-Memory/08e2442e16a8ddb0412c4d5c7c24661539065fbf/adapters/opencode/README.md)。路径必须是`/opencode/<spaceId>/v1/chat/completions`，不能误用`/codebuddy/`；第一路径段决定agentSource，误路由会破坏原生question工具的Team→Agent→Task选择。每轮将绑定agent的L2/L3记忆、skills、knowledge注入system prompt，并保存L0对话用于蒸馏。

客户端使用业务用户sk-mem key，而非原始admin key，模型ID须与PROXY_UPSTREAM_MODEL一致。LLM代理可以免去逐客户端安装插件，却也让模型流量和提示经过中介，“零代码”不能消除维护和注入风险。9月8日13:36:31Z的[MongoDB模式变化](https://github.com/TencentCloud/TencentDB-Agent-Memory/commit/30eda54d77b0887c8fa3cbab9e911a9b7ef4ebae)将配置持久写入环境，避免后续启动静默回SQLite；它明确experimental、off by default，切后端不迁移数据。

项目处于Team Memory Beta，默认分支为feat/server_team；Memory v3 API和v2.0.0 images不是可互换版本，也不是云发布证明。当前Chat Memory、Skill、LLM-Wiki、CodeGraph归入统一Memory Assets，先按Team/User/Agent/visibility缩小范围再检索。private归owner、连team admin也不可读，restricted使用User/Role/Agent ACL，均为项目自述。CodeGraph优先公开HTTPS仓库，私库、SSH凭证和自动路由仍在完善。PersonaMem从48%到76%、相对+59%的结果未独立复现，不作为本周性能或竞争排名。

OpenClaw可借鉴业务身份→团队→agent→任务绑定、默认私有和审核后共享，但不能把这一开源Beta直接填入腾讯元器或CloudBase生产Memory格。

### 共享插件不等于统一捕获

Mem0于9月8日18:02:25Z的#7203共享agent-plugin runtimes和原生适配，19:33:26Z的#7269对齐文档。[Python共享core](https://raw.githubusercontent.com/mem0ai/mem0/02f7a9b2c4fe38dedb96631e48c85c74ad58b605/integrations/agent-plugin-core/README.md)覆盖捕获、召回、MCP、scope、遥测；TypeScript共享生命周期、身份、格式和脱敏，但保留各宿主自己的事件工具。Python仅提供本地只读search_memories和六个skills，run_id可在repo/dir/mine scope按已知session过滤，省略则跨session。仓库身份改用Git remote哈希，检索和显式删除兼顾旧ID，但旧数据同名跨host歧义并未被重写消除。

portable Agent Plugins v1没有capture hooks或flush worker，remember skill不能独自写入记忆；能加载MCP与skills，不代表具备原生自动捕获。[OpenClaw适配](https://raw.githubusercontent.com/mem0ai/mem0/02f7a9b2c4fe38dedb96631e48c85c74ad58b605/integrations/openclaw/README.md)选择近期消息和更早工作摘要，去噪、脱敏后保留被选消息全文，不再单条截断到2,000字符。但它仍不是全会话归档，非交互触发、子代理session、已经用过记忆变更工具的turn会跳过捕获。

构建一致性检查包括生成、缺失、陈旧文件及symlink，离线conformance不证明真实宿主加载，本期未实装发行包。两份文档的searchThreshold默认值0.3/0.1冲突，[另一份文档](https://raw.githubusercontent.com/mem0ai/mem0/02f7a9b2c4fe38dedb96631e48c85c74ad58b605/docs/integrations/openclaw.mdx)未与实现核清，因此不推荐默认配置；“agent forgets everything”是营销，不采用为OpenClaw事实。

共享core减少安全漂移，但不能据此虚构统一的宿主捕获契约。记忆集成的壁垒在捕获生命周期、scope和证据保真，而不只add/search。OpenClaw应公开哪些turn捕获、子代理怎样关联、何时召回、哪些字段脱敏的宿主事件矩阵，并将selected durable memory与lossless conversation archive分开。

### 防护必须实际挂到传输层

Cognee的[PR #4994](https://github.com/topoteretes/cognee/pull/4994)对应[commit6fe95f6](https://api.github.com/repos/topoteretes/cognee/git/commits/6fe95f6a30df03b144bb7ce0f2bcfee1ce9937a5)，committer时间9月9日15:40:15Z，即上海23:40:15，仍在窗内。FastMCP streamable-http会转发Host/Origin参数，旧SSE却静默丢弃，banner仍显示enabled；本次compose改用Streamable HTTP，将`/sse`迁到`/mcp`，即使保留SSE也直接挂相同middleware。`--path`此前只打印、不生效，默认改为None以尊重各transport路径。

LAN或custom hostname要进入allowlist，否则返回421，Origin拒绝返回403；这是DNS rebinding防护，不是模型内容安全。旧client不改URL会404，但另容器的`cognee-cli -ui`仍保留`/sse`，不随本次迁移。[固定SHA说明](https://raw.githubusercontent.com/topoteretes/cognee/6fe95f6a30df03b144bb7ce0f2bcfee1ce9937a5/cognee-mcp/README.md)还区分MCP包0.5.5→0.5.6、核心1.5.4、FastMCP3.4.6，修复FastMCP版本错报，Python限制为`>=3.10,<3.14`，不能混用版本名。作者68项回归通过未独立复测，四/五工具与README三主工具的按需发现口径不同，不报工具数增长。

OpenClaw接入远程知识MCP，应验证Host/Origin负例、实际transport和路径、真实tool list，而不只看连接绿灯或启动banner。

### 预算与路由决定迁移边界

Letta Code的[PR #4185](https://github.com/letta-ai/letta-code/pull/4185)对应170a6d1，于9月8日18:29:06Z合入。MemFS v2[最终默认](https://raw.githubusercontent.com/letta-ai/letta-code/170a6d190eb70b65ebf0d4e1683f971e18633997/src/memory-constraints.ts)为单文件20,000字符、根目录核心Markdown合计65,536字符、最大目录深度2，包含frontmatter，单位不是token；早稿80,000已改为2^16，应采用最终版本。

v2根MEMORY.md是layout标记，子目录路径须有MEMORY.md索引，skills/不在该记忆集合。无配置v2仍应用默认，旧配置缺字段也补默认，并非显式opt-in才受约束。[验证器](https://raw.githubusercontent.com/letta-ai/letta-code/170a6d190eb70b65ebf0d4e1683f971e18633997/src/agent/memory-constraints.ts)检查完整暂存仓库，而非仅变更文件，旧超限仓库可能在无关提交时遭拒；报错明确未提交、暂存保留，并建议拆文件或把非核心详情移出根。`.memfs.config.json`修改另需人工批准。

[HEAD审计](https://raw.githubusercontent.com/letta-ai/letta-code/170a6d190eb70b65ebf0d4e1683f971e18633997/src/agent/memory-constraints-audit.ts)中的`validateMemoryConstraintsHead`使用临时Git index检查已提交HEAD，不动真实index或工作树。旧超限仓库应先审计、修复再release。这是治理和迁移成本，不是降低持久记忆容量，也不是算法召回提升。

9月8日20:50:23Z的[e073938/#4223补丁](https://github.com/letta-ai/letta-code/commit/e0739382c5c02af12cc5c72266f8f948e6918ac8.patch)阻止绑定本机消息渠道的会话Teleport：agent或conversation若有enabled且允许outbound的路由，就报错，并且不会开始目标sandbox连接解析，因为MessageChannel暂不能随会话迁往另一台电脑。状态迁移不只有记忆文件，还包括外部路由，不能写成渠道无缝迁移。

Letta平台核心latest0.16.8正文为5月14日，不属本周；[Code0.32.0](https://github.com/letta-ai/letta-code/releases/tag/v0.32.0)虽收录相关变更，版本提交d043d46在9月9日19:23:12Z，已越窗，本期只报道窗内合入。OpenClaw应区分常驻上下文预算与按需检索容量，让写记忆具有可解释检查及失败保留，并在迁移前同时验记忆、权限和消息路由。

### 检索命中必须能够回读

supermemory的[4d8a4eb/#1641](https://github.com/supermemoryai/supermemory/commit/4d8a4ebfddadc3430f7f59a752cd374670833f50.patch)于9月2日21:49:57Z修复MCP getDocument对active space以外文档误报not found：去掉本地resolveContainerTag/containerTags过滤，直接经API按document ID读取，说明改为任何有权space均可回读。作者称API已按org隔离，activeSpace为空时退到sm_project_default反而破坏合法跨space；同space、跨space成功、外org仍404为上游本地自测，不是本期渗透测试，更不意味着可删除所有space ACL。价值在于listDocuments发现的ID能通过getDocument取得证据。

[迁移PR #1651](https://github.com/supermemoryai/supermemory/pull/1651)的5258cb74由[Atom日期索引](https://github.com/supermemoryai/supermemory/commits/main.atom?since=2026-09-02&until=2026-09-09)绑定到9月7日19:56:46Z，确认窗内代码活动：app.supermemory.ai变为console跳转壳，plugin、OAuth、invite立即308并保留query，其他路径显示5秒提示；删除browser-extension workspace，修改中英文README和API-key链接到console，清理company-brain文档标签并重定向。它只证明提交，不证明生产部署、旧API停止、扩展全停、用户迁移完毕或新记忆引擎；巨大diff未完整，不扩大已核PR范围。

OpenClaw应验同org跨space回读、跨org拒绝和OAuth query连续性，不能以搜索可见证明授权完整；仓库删workspace也不等于远程服务关闭。

### 写入、删除和查询分别验收

Graphiti的[graphiti-core0.30.2 release](https://github.com/getzep/graphiti/releases/tag/v0.30.2)与[版本patch](https://github.com/getzep/graphiti/commit/eaa4128681bc53487138a4bbc22d58336ebe70d2.patch)对应9月8日20:37:55Z的版本提交，汇总Neo4j数据库路由/NEO4J_DATABASE、Saga清理、多group参数、并发隔离和FalkorDB全文检索。

[#1699](https://github.com/getzep/graphiti/pull/1699)指出，旧add_episode/bulk按group_id修改共享self.driver、self.clients.driver；LLM、embedding、数据库之间多个await使另一group可能改掉路由，前请求后续写进错误图。这是作者生产问题描述，不是独立事故审计。修复逐层传递请求级driver和GraphitiClients副本，相同数据库复用实例，不再共享可变状态；依赖add_episode改driver后直接search的旧调用者，须显式传group_ids。

9月8日14:12:19Z的[Saga清理补丁7db9684](https://github.com/getzep/graphiti/commit/7db96847d96b0196c1f9bc5d46a682f73b92a715.patch)，在FalkorDB、Kuzu、Neo4j、Neptune的group-scoped清理和共享maintenance中，将Saga加入Entity、Episodic、Community集合。FalkorDB测试清g1、保g2，针对选择性删除，不是所有全库删除都失败。14:22:10Z的[ef68089参数修复](https://github.com/getzep/graphiti/commit/ef68089a4f36d30689a1d7c5e3e3942fc7921413.patch)让每个task从原调用独立signature.bind，再改group/driver，避免去位置group_ids后driver位置与关键词冲突，也不共享BoundArguments。

14:29:12Z的[FalkorDB查询补丁2d96f2](https://github.com/getzep/graphiti/commit/2d96f27138d21b723d6ad4f21fc9e0422f29e94e.patch)仅针对FalkorDB关系全文检索，直接用startNode/endNode，保留Entity标签约束，避免每命中一次就全扫Entity。作者在5,665节点、20,263条RELATES_TO、3,725实体的图上，返回相同306行，从33,383ms到1.6ms；这是特定图和查询计划自测，不是通用Graphiti快两万倍，Neo4j、Kuzu未改，也未独立复现。release收录旧PR不等于全是本周首提，Zep Cloud仅有rollout提示，无窗内完整事件，不能外推云GA。

OpenClaw跨租户交错读写时，应检查每个await之后的路由，将group/database作为请求不可变上下文；删除要查Saga等辅助节点残留并保留负例，性能报告应附后端、规模和命中数。

### 摄取扇出也有配额语义

Firecrawl的[7812a4a/#4583限流patch](https://github.com/firecrawl/firecrawl/commit/7812a4a324d8ec152ffaffba47a56e02491f2ba7.patch)时间为9月10日01:30+1000，即UTC9月9日15:30、上海23:30，仍在窗内。它为可信内部agent interop设置hobby倍率下限10，并不是所有外部MCP自动10倍。存在`__agentInterop`不算可信，须恒定时间secret验证，无配置或错误key不提升；付费倍率更高时保留，团队rateLimitOverrides覆盖整个基数×倍率且优先，甚至无需查Autumn。API-key、OAuth、MCP-delegated路径统一，测试包含正负例。

作者“单任务约扇出10个子请求”是机制解释，不是行业p99或采用数据；这不代表统一涨配额、改价或质量提升，也未证生产部署。OpenClaw应同时观察父任务预算、子请求扇出、429和重试开销，遵守供应商内部标记，不能伪造提额。

9月8日14:41:05Z的[f544d06/#4575版本patch](https://github.com/firecrawl/firecrawl/commit/f544d065ef9f8c2f3218599b09aaa22f942a04e8.patch)为v2 search可选country补七种SDK的minor版本：Go1.15.0、JS4.39.0、Python4.42.0、Rust2.19.0、Java1.18.0、PHP1.16.0、Ruby1.17.0。原因是#4574先加参数而未升版，按版本触发的registry不会发布。Java同步SDK_ORIGIN，Rust同步Cargo.lock，PHP/Rust日志为9月8日；.NET、Elixir、CLI未改，不设置country就不发该字段。这里只验证版本和changelog补丁，不代表七语言全部测试、registry到货或生产部署，属于修复发布条件。地区检索需锁SDK并检查序列化请求，不能只看文档字段。

9月9日16:31:27Z的重定向后blocklist重查，以及18:03:30Z的pdf-inspector升级均越窗，本期排除。

### 预览不应丢掉全文证据

本期补入观察的[Gentleman-Programming/engram](https://github.com/Gentleman-Programming/engram)是Go单二进制、SQLite FTS5本地权威存储项目，提供CLI、HTTP、MCP、TUI，保存精选决定、约束与修复，而非原始对话倾倒。Cloud与Git Sync是不同复制方式，当前README不能证明本周云上线。

9月7日07:29:31Z的[PR #1068](https://github.com/Gentleman-Programming/engram/pull/1068)及[100398a patch](https://github.com/Gentleman-Programming/engram/commit/100398a99e3934788a8bf67ee76b731539b324b4.patch)增加可选`response_format=compact`：数据库直接`substr(content,1,300)`，并判断length>300，复用FTS/LIKE排序和过滤。compact文本只留命中数，preview、truncated、relations进入结构化结果。测试用“世界”验证300个Unicode字符边界、全文仍保留；默认详细意图不等于严格字节兼容，旧省略号可能消失并加入[preview]，依赖文本格式的client须回归。审查要求runtime、内存、payload和排序基准，但尚无独立量化token节省或加速。

OpenClaw预览应带稳定ID、截断标志、关系和全文回读通道，不能当成完整证据，也不能借此删除持久正文。9月9日22:38:31Z的mem_list_projects、22:32:53Z的Claude配置修复均越窗。

Crawl4AI在精确UTC main及默认分支历史未见可见commit，REST限流，结论只限所查渠道未核实新增，非停止维护。[latest所指v0.9.3](https://github.com/unclecode/crawl4ai/releases/tag/v0.9.3)的[固定tag CHANGELOG](https://raw.githubusercontent.com/unclecode/crawl4ai/v0.9.3/CHANGELOG.md)首节为8月31日，PDF路径、Docker Playground五项安全修复均窗外，不纳本周。[窗口历史](https://github.com/unclecode/crawl4ai/commits/main/?since=2026-09-02T16%3A00%3A00Z&until=2026-09-09T15%3A59%3A59Z)仅支持这一有限结论。release的“Docker images正在构建”是发布时文本，不证明9月10日仍未完成；既有安全版本运维也不属本周新闻。

记忆仍然碎片化，本期证据未证明通用provenance/forget契约已经形成。可靠性要同时验捕获、作用域、后台授权、预算、删除和回取，不是盲目接入更多memory API。LightRAG、GraphRAG、LlamaIndex、LangMem、Onyx、Haystack、Jina、Unstructured及向量数据库仍为强观察池，本期未逐项深验，不宣称它们静默。

## 评估先保留真实证据

可观测平台正在从dashboard扩展到证据调查、历史回填、公平调度和可追溯语义。trace接收成功不等于字段语义正确，字段正确也不等于评估可复现；未测量不能补零，离线导入不能伪造耗时。public preview、client制品、main合入、Stable维护chart和网络治理资源，更不能合称全面GA。

### 维护制品不是新评估能力

LangSmith9月5日[Stable Helm chart0.16.16](https://github.com/langchain-ai/helm/releases/tag/langsmith-0.16.16)对应app0.16.50，仅列“Internal improvements and maintenance updates”，GitHub正文只说明部署应用与依赖服务，不能宣称新增评估、轨迹或护栏。9月3日[Preview chart0.17.0-rc.22](https://github.com/langchain-ai/helm/releases/tag/langsmith-0.17.0-rc.22)仍对应app0.17.18rc1，与rc.20相同，不能将rc.20跨周功能归为9月3日首发。[自托管映射](https://docs.langchain.com/langsmith/self-hosted-changelog)说明自托管是Enterprise附加项，不证明免费或云版同步。

[Cloud日志](https://docs.langchain.com/langsmith/changelog.md)的Aug31–Sep7栏目跨窗，轨迹批读独立gRPC、dataset下载权限、变量映射等缺单项日期或完整独立正文，只作跨窗背景；RSS404不是静默。Helm Atom中的rc.24（9月9日17:21:35Z）、0.16.17（21:24:43Z）、rc.25（21:51:03Z）均越窗，而且updated不能当可靠published。OpenClaw升级外部观测时，应同时固定chart、backend app和迁移状态，不能由chart升版推定eval行为改变。

### 回填、定位与导出分开看

Langfuse [v4.32.0](https://github.com/langfuse/langfuse/releases/tag/v4.32.0)为9月8日窗内发行，entry updated9月8日12:53:51Z只是更新字段，没有拿feed总updated替代。v4.33.0的entry为9月9日16:04:02Z，已越窗。

[PR17071](https://github.com/langfuse/langfuse/pull/17071)于9月7日13:40:29Z合入main，为保存evaluator增加可选historical-backfill：预设或自定义窗口不早于六个月，最多25,000 observations，或更低的实例上限。UI分别呈现持续评估与一次回填成本，展开匹配量×sampling×单次成本；实现复用batch-evaluation，加入可选sampling/rowLimit，最新优先、流式调度。旧调用省略参数时，仍保持100%采样和原实例上限。

事件只增加hasBackfill、backfillWindow、backfillMaxItems，不采集正文、筛选值、具体日期或ID。自动审查曾指出“绑定已成、排队失败”后重试触发唯一约束，合入版本包含幂等修复，但本期未独立复测，代码也不证明Cloud全租户上线。

[PR17195](https://github.com/langfuse/langfuse/pull/17195)于9月8日15:33:27Z合入main，让评论可选objectStartTime，辅助ClickHouse的events_full.start_time分区裁剪，避免验证observation引用时扫数百至数千parts。UI从header到drawer/list传startTime，REST也能使用。它是hint、不是主键：省略就走旧无界查询，错误或过期hint造成miss时，捕获LangfuseNotFoundError再无界回查，真正不存在才404。最终修正了初稿用falsy检测、却在此前已抛异常导致回退不可达的问题。不能为了性能让已有证据消失，本期也未证百分比收益或具体发布版本。

v4.32.0收录的[PR17177](https://github.com/langfuse/langfuse/pull/17177)，为scheduled blob、PostHog、Mixpanel export记录runStart减watermark的lag分布，先建立P95 baseline再确定SLO。失败时沿不变lastSyncAt采样，stall表现为lag上升；blob水位推进就算freshness成功，后续Redis catch-up排队失败不能误报旧水位stale；Mixpanel decrypt在export try之前抛错，也要记录failure。export成功、下批排队成功、数据新鲜度是不同状态，这个指标不是已承诺SLO。

评估平台必须先是可靠作业系统。OpenClaw可建立有上限、采样预算、可幂等重试的历史工具回归集；trace引用带定位hint，但不改变正确性；导出同时观察freshness与流水线错误。

### 调查可以自动，变更仍需审批

Braintrust9月3日[Patterns、Debugger、增强Loop](https://www.braintrust.dev/blog/active-observability-loop-patterns-debugger)进入public preview，不是GA，后续定价待GA前说明。Patterns从生产traces寻找重复失败和意外成功，附描述、影响、支持trace或引用与建议，可发送Slack摘要、接受Useful/Noise反馈并追踪active状态。Debugger从代表trace的span、tool、result、model output提出可能失败模式，不等于已证根因。

Loop可用SQL、代码查反例，保持持续线程、按计划重做调查；修改prompt、scorer、classifier、dataset、dashboard或automation需要审批，由开发者、领域专家验证evaluator并决定发布。公开MCP提供同样工具，可接Codex、Claude Code、Cursor等，不只供内置agent。

[Patterns配置](https://www.braintrust.dev/docs/observe/patterns/enable)背景为默认每天本地默认时区09:00、查询近30天、启用即排一次；每次分析完整窗口而非增量，宽窗增加推理成本。它需要可付款内置credits或兼容自有provider，以及project create-automation权限，Owners/Engineers默认具备。要求data plane v2.13+，9月日志又提示自托管版本尚未发布，不能据文档推成普遍自托管可用。无证据时不写Pattern是正常静默，不等于任务失败；聊天中写出的Pattern也不会自动触发automation的Slack/webhook目标。

[Python SDK0.37.0](https://github.com/braintrustdata/braintrust-sdk-python/releases/tag/py-sdk-v0.37.0)于上海9月4日发行：早期API published为9月3日16:00:30Z，Atom updated为16:01:21Z，两者不同。[PR729](https://github.com/braintrustdata/braintrust-sdk-python/pull/729)本身发生于9月1日，随本次release交付。Pydantic AI有效model settings进入leaf LLM span的`metadata.invocation_params`，与LangGraph体验对齐，temperature、max tokens有VCR regression；本期未复跑，不称通用兼容性提升。0.36.0在窗外，0.38.0 entry为9月9日16:17:45Z、已越窗，都不挪入本期。

带证据的运维agent也增加调查费用和带写权限自动化风险。OpenClaw宜先走证据→候选模式→小回归集→审批后修改→再评估，区分无证据静默、取证失败和通知失败；观察agent发现问题不应自动修改系统。

### 离线轨迹不应制造耗时

[arize-phoenix-client3.5.0](https://github.com/Arize-ai/phoenix/releases/tag/arize-phoenix-client-v3.5.0)标9月8日，release commit为9月8日22:22:24Z，即上海9月9日06:22，属于窗内client制品，不是Phoenix服务端3.5.0。它新增MiniMax provider、Harbor ATIF tracing，Python/TypeScript get_traces支持error/latency筛选，annotation验证全部配置ID列，而非只验证首列。

[ATIF PR15715](https://github.com/Arize-ai/phoenix/pull/15715)为每个新操作步骤建立CHAIN span，复制上下文只重构prompt，不伪造执行span、轮数或耗时。ATIF时间戳是点事件，未测LLM/TOOL以零时长表示、用`_phoenix.span_order`排序，不捏造微小偏移；只有metrics.extra.latency_ms等生产者实测值才赋予LLM时长。

子Agent优先通过source_call_id连接可证父tool，否则挂到操作步骤。Harbor最低要求0.21.0，并防御缺少TrialConfig.user_agent。trace按trial命名为`harbor:<trace_id>`，恢复使用harbor_job_id/harbor_agent_digest，避免共享dataset版本变化造成重复experiment。cache-write和reasoning token只在extra存在时映射；到达verifier的步骤异常可以是可评分结果，不应全部算基础设施失败。测试和Terminal Bench覆盖仍是维护者自述。

9月9日23:47:44+08的[7d1c463键盘补丁](https://github.com/Arize-ai/phoenix/commit/7d1c463141b4ac5958c007c52f4060f062bb5306.patch)修复annotation explanation可达性：最终diff去掉按钮excludeFromTabOrder，增加Tab可达、disabled跳过、Enter打开并聚焦输入测试，同时保留annotation edit hotkey行为。不能把初稿“全移除focus manager排除”当最终实现；这是人工评审可用性，不是新评估算法。

OpenClaw应为压缩上下文、retry、subagent和重放保存独立标识。离线表示的零时长与真实测得零时长要在上层区分，不能为了时序图好看而造数据。

### 重试不能占满评估槽位

Coze Loop [PR652](https://github.com/coze-dev/coze-loop/pull/652)于9月9日03:53:15Z合入main。旧可重试错误持续保持Processing、占用slot，并发3时三项重试会饿死健康Queueing。新retry_times为unsigned、非空、默认0，按expt_run计；让位时把run_log/item_result改回Queueing并配平统计，停止旧MQ重投，由调度按retry_times asc、id asc重取，避免scheduler/MQ双跑。业务retry_yield_enabled在实验开始固定到event.Ext，旧事件缺省关闭，不能半程改变语义。

最终方案推翻早稿“先建六列复合索引”，只加列，没有交付该index定义。index_ready=false时默认不ForceIndex，可走optimizer/filesort；true才使用idx_expt_run_retry_pick，索引缺失会报错。index_ready是实时schema事实，与固定run的业务开关不同。维护者99.6M行、36.1GB热表观察用于内部取舍，不是公共benchmark，不建议照搬。

[PR654](https://github.com/coze-dev/coze-loop/pull/654)于9月8日11:59:40Z合入，将SkillDistDeclare、AgentSkillDeclare中的实验Skill传给runtime，RunModeConfig IDL field12为skills，与testcase.Skill线协议对齐；第三种skills_mode是merge_exp_first，同skill_key时实验声明获胜。OpenAPI→domain拒绝空skills[i].skill_key，CommonInvalidParamCode包含索引；非空才写入domain/OpenAPI和DO/DTO回转，保留旧无Skills配置结果。测试包含dist透传、空key、往返、新模式，不证明Coze SaaS所有空间已经启用。

PR646中心调度虽然在9月3日06:16:11Z合入，但正文过长未完整精读，本期不据前半段推成“开源完整中心调度”。OpenClaw回评应先验重试是否释放slot、重投幂等与统计守恒、同run配置稳定；A/B固定模型、prompt、Skill版本和冲突规则，避免表面只改prompt、实际依赖已经不同。

### 未知token不能补零

OpenTelemetry GenAI规范已迁往独立semantic-conventions-genai仓库，[官方迁移页](https://opentelemetry.io/docs/specs/semconv/gen-ai/)提供这一背景，旧目录Atom停在5月5日不代表社区沉寂。[PR479](https://github.com/open-telemetry/semantic-conventions-genai/pull/479)于9月3日23:30:36Z合入，为Groq参考scenario增加`gen_ai.client.token.usage`与`gen_ai.client.operation.duration`，沿用Anthropic属性集合，按gen_ai.token.type分别记录usage，并显式规范histogram bucket而非使用SDK默认。

streaming没有usage block时只记duration，规范MUST NOT要求无法取得token就不能上报usage，不能猜或补0。属性在SDK调用点构造，可追溯请求与响应来源，生成data.json不变。这是参考实现覆盖，不是Agent全套span新协议或GenAI规范Stable/GA；“28个scenario仅2个展示metrics”是维护者覆盖说明，不是生态采用率。

OpenClaw应保存scope、schema、版本和测量来源，trace完整与成本完整不是同一个信号，未知与零必须分开。

### 云评估与有限未发现

AWS[9月release notes](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)列出TypeScript支持，但没有具体日，因此保留能力背景而非静默。[支持矩阵](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks.html)支持TS Strands、LangGraph、OpenAI Agents、Vercel AI SDK，不同语言instrumentation scope不同，服务从span/event scope.name提取prompt、response和tool。推荐`@strands-agents/sdk>=1.5.0`，ADOT-native LangGraph/OpenAI/Vercel instrumentation>=0.12.0，LangGraph Traceloop>=0.27.0、OpenInference>=4.0.14；Python旧行不全算新增。必须启用observability并导入CloudWatch，只安装instrumentation或接收OTLP，不等于托管eval可读。

Google9月8日Connectivity Template是组织网络治理资源，不是新评估算法，已经在工具网关章说明，不重复计事件；9月9日VPC-SC和双Registry不计严格窗内。Azure[正确Foundry更新页](https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry)正文为August2026，ms.date为9月1日，updated9月9日22:15Z越窗，agent optimizer、autopilot、长任务新文档不能改为本周新品。[classic页](https://learn.microsoft.com/en-us/azure/foundry-classic/agents/whats-new)最新正文2025年10月、metadata2026年6月，未证本周观测评估事件。最初404路径已恢复，不能说网站整体失败，也未穷尽Azure其他渠道。

Helicone[官网changelog](https://www.helicone.ai/changelog)最新可见2025年11月26日，[main Atom](https://github.com/Helicone/helicone/commits/main.atom)最新为8月31日04:30:56Z安全hardening，均在窗外；只限定这两个渠道未见窗内新料，不外推SaaS私有或其他分支。AgentOps[文档/changelog](https://docs.agentops.ai/changelog)404属于取证失败；[main Atom](https://github.com/AgentOps-AI/agentops/commits/main.atom)和日期历史无窗内commit，最新6月25日08:25:03Z为旧OpenAI可选tool字段修复，主仓库静默证据独立成立，两类状态须分开。

可观测性已从收span扩展到运行参数、freshness、回填预算、重试公平和可审批调查。共享tool-call事件可供trace、eval、cost、policy、audit消费，但OTel并未替应用完成数据最小化与硬执行阻断。先保证字段诚实、有界回归，再考虑自动调查；模型“安全”评分不能替代权限和网络策略。

## 七平台如何组合能力

AWS9月8日长期记忆直接摄取、Google9月8日网络模板、Databricks9月8日ABAC DENY，分别将记忆、网络和授权管理切成可组合资源，不是同一场全栈GA。Foundry将agent identity与project identity、conversation与session与compute分开，是平台契约参考，文档updated却不能说明首发。国内平台也必须按产品拆分：百炼长期记忆API不等于Agent2.0已支持，Coze/OpenViking开源不等于Ark托管，腾讯元器分发、ADP托管和CloudBase工具不构成统一GA证明。

### 六类能力逐格比较

以下是截至9月10日的能力快照，不是本周新增清单。“托管”仅指官方文档说明由平台运行；“开源”表示代码可部署，不代表云上线；“待证”指材料不足，而非没有能力。除明确GA、Beta或Preview，不擅自标注整个平台成熟度。同事件跨模块出现不重复计新闻。

|平台|Runtime / Session|Memory / Context|Gateway / Tools|Identity / Auth|Sandbox / Browser / Code|Observability / Eval|
|---|---|---|---|---|---|---|
|AWS|AgentCore托管Runtime，session microVM隔离/异步；最长8h，终止非原进程恢复；overview另列managed Harness|短期/长期Memory；9/8 IngestData不建short-term event提取长期记忆|Gateway将API/Lambda/既有MCP转工具；Policy拦截；HTTP/A2A/推理路由为背景|Identity接既有IdP；JWT inbound与outbound OAuth分开；consent portal具体日待证|托管Browser/Code Interpreter；仅custom Browser有S3录制；临时session|OTel兼容Observability/Evaluations，须CloudWatch与正确scope映射|
|Google|Agent Platform托管Runtime，旧Agent Engine入口重定向；Managed Agents状态单独待证|Sessions/Memory Bank分离，长期偏好和事实|Agent Gateway9/8模板，PRIVATE_RANGES_ONLY/ALL_TRAFFIC；MCP与A2A策略粒度不同|SPIFFE agent identity、service accounts/OAuth clients；provisioner与service agent分权|Code Execution；9/9 Computer Use/Shell GA有官方条目但周界待核；网络与密钥须配置|Cloud Trace/Logging/Monitoring/Evaluation Service；网络模板是治理资源，非新eval算法|
|Microsoft|Foundry prompt/hosted agents，每session VM；Responses/Invocations history归属不同；长任务resilience preview|conversation独立于compute，session文件持久不等于长期语义记忆；overview有memory工具|Toolbox集中MCP端点/版本/认证，OpenAPI/MCP/custom工具；A2A为preview|每agent Entra与project managed identity分开；OBO/agent identity/key auth|VM session、Code Interpreter、BYO VNet；Browser需Playwright资源权限，不能全标GA|OTel/Application Insights/trace/eval；Copilot Studio analytics/evaluation|
|阿里百炼/PAI|Agent2.0托管规划/工具loop与版本；PAI仅证DSW/DLC/EAS定位，专项托管待证|Agent2.0短期0—30轮，长期记忆仍计划支持；独立长期API旧动态不自动移植|统一knowledge/MCP/app组件/Skills，不等于独立企业Tool Gateway；AI网关另产品|技能环境可注凭证，独立agent identity/委托撤销待证；OpenAPI MCP有RAM/用户OAuth不同模式|内置bash/read/write/edit/glob/grep隔离sandbox，默认关闭|卡片流展示tool入参/结果/轨迹；平台评测/OTel为旧背景|
|火山/字节|Coze Studio开源agent/app/workflow；Ark托管详情抽取失败|OpenViking开源Context DB、viking URI/L0/L1/L2，非Ark托管Memory GA|Coze插件/workflow/API；Ark专属gateway待证|Coze社区API PAT；托管独立agent身份/委托待证|Coze README提示Python code node、公网注册/SSRF风险，不能视为已证安全隔离|Coze Loop开源trace/eval/prompt版本；OpenViking检索trajectory|
|腾讯云/元器/CloudBase|ADP官网自述云端Harness/长任务；元器分发列表；CloudBase旧Agent入口壳，session契约待证|ADP自述Agentic RAG；独立长期服务待证，Team Memory Beta非元器/CloudBase内置证明|CloudBase插件MCP+Skills+Hooks操作数据库/函数/托管；ADP connectors/Skills|ADP自述RBAC/操作审核；CloudBase认证工具非独立agent identity GA|ADP自述云端coding sandbox，隔离级别/恢复/区域未证|ADP自述审计/运行可观测；CloudBase日志工具非完整agent eval|
|Databricks|任意authoring library与Apps；UC Agent Services Beta仅登记/权限，runtime invocation尚不可用|RAG/AI Search，独立长期session memory未证；9/8 generate_citations Beta|Unity Gateway文档GA，Agent Services Beta独立启用；MCP/UC functions工具|UC grants/service principals；9/8 ABAC DENY Beta仅MANAGE ACCESS CONTROL|通用code tools入口，agent专属隔离sandbox/browser GA未核|MLflow Tracing/Agent Evaluation/online monitoring|

本周强信号仍须单独读：AWS9月8日直接摄取在Memory支持区域可用，不是AgentCore整套本周GA；Google9月8日出口模板可确认，9月9日沙箱、双Registry、VPC-SC保留周界，ADK合入不是云部署；Microsoft AF Python1.17.0在窗内，但Hosted和Studio文档更新不证明功能首发。阿里所查窗内重大新发未确认，PAI导航及部分专项不足，不判全平台静默；字节有OpenViking、Coze Loop窗内代码，但stars、README或live demo不是托管GA；腾讯未证托管本周首发，Team Memory适配单列。Databricks9月8日DENY与引用chunks、9月4日模型可用分别成立，9月1日Genie定时GA则在窗外。

### 显式拒绝约束再授权

Databricks[9月产品月报](https://docs.databricks.com/aws/en/release-notes/product/2026/september)列出9月8日Unity Catalog ABAC DENY policies Beta。[DENY文档](https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac/deny-policies)用governed tags匹配、附到catalog/schema，覆盖显式授权、组继承、owner隐含权限，多条DENY取更严格者。当前只拒绝MANAGE ACCESS CONTROL，不直接拒绝SELECT/MODIFY；metastore admin隐式豁免，以保留恢复通道。SQL管理需要classic compute Databricks Runtime18 LTS+。

这是再授权职责分离，不是防外泄总开关。CTAS复制、view暴露、tag修改、OpenSharing、credential vending、group management仍需各自权限。SHOW GRANTS、GetPermissions、GetEffectivePermissions不反映DENY，要看SHOW EFFECTIVE POLICIES；只缓存grants的Agent会误判有效权限。release分阶段进行，账号可能晚于首发一周或更久，Beta不是全客户同日可用。

9月4日Unity Gateway加入GPT-6 Astra只是模型接入；9月8日AI Search的generate_citations返回引用chunks为Beta，也不是持久执行新特性。9月1日Genie Code scheduled tasks GA明确窗外。Databricks Mosaic AI/Agent Bricks的旧Agent Bricks入口重定向到[Use agents on Databricks架构](https://docs.databricks.com/aws/en/agents/custom-agents/build-agents)，当前支持任意authoring library、Apps、MCP/UC tools和MLflow tracing/evaluation，只是页面组织和能力背景，不是本周品牌合并。[Agent Services](https://docs.databricks.com/aws/en/ai-gateway/agent-services)前部EXECUTE表述与尾部“Beta runtime invocation unavailable”不一致，应采用具体限制：仅登记和权限管理。Unity Gateway GA不自动让Agent Services GA。

Databricks从已有数据资产授权进入Agent控制面，agent拥有对象不应天然拥有再授权能力。OpenClaw应将可调工具、可读数据、可转授权拆为三种权利，恢复时重查有效policy，而非只读缓存的旧grants。

### 平台来源与产品拆分

AWS [AgentCore overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)还列Harness、Payments、Optimization、Registry，但没有本周完整GA说明，不能与已确认Memory事件拼成“本周全栈新增”。Google [scale概述](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale)和Gateway配置共同支撑能力快照，旧Vertex/Agent Engine入口重定向不证明本周更名，9月9日时区缺口仍然有效。

Microsoft的[Foundry overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)、Hosted文档、[Copilot Studio概述](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio)、[M365 SDK入口](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/)及[Toolbox](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview)是不同范围的材料。Studio窗内文档updated不是功能首发，M365目录仅证明扫描过该入口。第三方工具可能在微软合规边界之外处理数据，平台托管不能自动覆盖外部数据流。

阿里[Agent2.0指南](https://help.aliyun.com/zh/model-studio/new-single-agent-application)、应用历史和[PAI定位](https://help.aliyun.com/zh/pai/)不能混成一个产品契约。独立长期API旧动态不得归入Agent2.0，沙箱工具默认关闭的条件必须保留；本期没有给出全平台GA或服务SLA结论。

字节[Coze Studio](https://github.com/coze-dev/coze-studio)、[Coze Loop](https://github.com/coze-dev/coze-loop)、OpenViking README均为开源材料。Ark两个官方正文入口获取失败，不能用这些README代证托管runtime或identity；开源安全风险也不能外推到全部商用部署。

腾讯[ADP产品页](https://cloud.tencent.com/product/adp)、[CloudBase插件](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ai-agent-plugins)、CloudBase概述与元器分发不是同一个runtime产品。ADP“7×24”等属于官网自述，尚无独立服务SLA、区域、恢复证据；AI Toolkit的MCP/Skills/Hooks也不等于元器分发的执行契约。

七家在补相近的能力图，默认取向却不同：AWS偏可组合服务，Google将Runtime、Context、Quality、Sandbox做成平台资源，Microsoft侧重企业身份、Toolbox与分发，国内云侧重模型和应用生态，Databricks侧重数据治理、UC与MLflow。可托管、可登记、可授权、可恢复、已GA是五个命题。OpenClaw不必与云比较资源规模，应保持Gateway、session、cron、tool policy的可见性和可迁移性，以标准事件、协议对接云runtime、memory和observability。

## 热度之外的实施顺序

### 九个方向只用于补漏

GitHub与Web发现扫描用于寻找漏项，扫描结果本身不构成本周发布证据。

|查询方向|发现与归类|
|---|---|
|agent memory github|TencentDB-Agent-Memory、engram、OpenViking，以及ai-memory/memanto/Hermes线索，进入记忆/控制层候选|
|agent context database github|Context Database、文件系统上下文，重点OpenViking，归记忆层|
|agent knowledge graph github|Graphiti、Cognee及代码图谱，归记忆层|
|AI agent RAG memory skills github|OpenViking、自演化记忆、通用Harness，过滤纯应用模板|
|MCP gateway github|Docker MCP Gateway、企业Registry及网关候选，归工具/权限层|
|agent auth permission OAuth MCP github|原长查询无结果，缩为MCP OAuth后命中Agent IAM、持久会话CLI、Atlassian官方MCP线索|
|browser agent runtime github|CDP runtime、WebContainer、Hermes连接器，归执行及环境候选|
|agent observability eval github|评估、回放、仿真候选，过滤awesome/tool合集|
|agent harness runtime github|Harness、durable session、凭证隔离、审计回放，归控制/执行候选|

只有识别真实仓库并核验窗内原文的对象才深写。Hermes、Docker MCP Gateway、Agent IAM、Atlassian等仍只是发现线索，未完成具体当期事实核验，不列本周新闻，也不判静默。awesome-list、教程或YouTube transcript skills合集、纯应用workflow、无原始仓库片段均被过滤。

### 快照不是采用率

|对象|2026-09-10官方API快照：stars / forks|补入决定与限制|
|---|---|---|
|TencentCloud/TencentDB-Agent-Memory|26,250 / 2,463|补入动态对象；默认feat/server_team、Beta；9/8 push仍须具体commit核验，该适配已核|
|volcengine/OpenViking|36,317 / 2,774|原固定对象，非新补入；AGPL-3.0元数据非本周许可变化，9/10 push非窗内发布|
|Gentleman-Programming/engram|6,476 / 678|不足10k但模块定位清楚，补观察池，不升级固定竞争对象；9/7 compact已核|

快照来自[TencentDB API](https://api.github.com/repos/TencentCloud/TencentDB-Agent-Memory)、[OpenViking API](https://api.github.com/repos/volcengine/OpenViking)、[engram API](https://api.github.com/repos/Gentleman-Programming/engram)。stars/forks只是该日平台数值，不是周增长、客户采用率、收入或排名；没有独立第二统计源，不据此推胜负。OpenViking、Cognee、supermemory、Crawl4AI四个易漏对象均已纳入记忆章，没有因搜索排序遗漏。

### 先验收，再扩大自动化

本期对OpenClaw的优先参照，可以按五步收束：

1. **先验完成语义。** 接受请求、输出完成、状态持久化、实际副作用、投递确认分开。升级、恢复依靠真实readiness与幂等账本，不让正常回复掩盖失败。
2. **再验权限与出口。** 用户consent、Agent身份、token代理、tool参数许可、资源ACL、网络路径分别有证据。预授权便利不替代运行时审批，目录或skill来源校验也不等于安全授权。
3. **记忆先做少而可靠。** 优先验宿主捕获矩阵、公开状态与执行密钥分离、租户并发负例、预算失败语义和预览→全文证据链，而非同时接更多产品。
4. **观测先诚实后自动。** 保存scope、schema、版本、真实call和parent ID，未知token不补零；先有小规模有界回填、重试公平和稳定Skill冲突规则，再试证据驱动调查。观察与变更须有审批隔离。
5. **保留多后端，不虚构统一。** 计算租约、文件、内存、连接身份、消息渠道是不同迁移单元。SDK、API类型、源码合入、包发布、服务部署、GA分别展示，不能承诺跨云无损恢复。

本期没有独立验证的客户采用率、收入、生产SLA，或普遍性能、成本改善。文中的规模与性能数字仅用于准确交代作者主张及其条件，不作为客观比较结论；未确证时间的内容继续保留背景或待核身份，不移入“本周新发”。
