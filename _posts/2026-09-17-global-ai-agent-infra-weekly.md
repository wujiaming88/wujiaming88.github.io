---
layout: single
title: "Agent基础设施周报：组件趋同，责任边界仍待厘清（2026-09-10 ~ 2026-09-16）"
date: 2026-09-17 10:00:00 +0800
categories:
  - AI
tags:
  - AI Agent
  - Agent Infrastructure
  - Agent Harness
  - MCP
bucket: agent-infra
header:
  overlay_image: /assets/images/posts/2026-09-17-agent-infra-cover.png
  overlay_filter: 0.35
  caption: "Agent基础设施模块示意图 · AI生成"
toc: true
toc_sticky: true
---
Agent Harness的关键模块正在被拆成可独立治理的标准件：托管会话、可替换执行环境、工具与技能分发、用户授权、上下文数据库，以及能够正确解释恢复和工具调用的trace。本周最值得关注的，不只是新增了哪些Agent产品，而是这些组件开始怎样划分责任。

组件列正在趋同，暂停与恢复、凭据撤销、memory scope、trace留存和sandbox网络边界却仍高度碎片化。判断下一代标准件，不能只问“有没有”，还要问：失败时，能否给出明确、可验证、可审计的责任边界？以下变化对应2026年9月10日00:00至9月16日24:00，时区为Asia/Shanghai；窗口外背景和日末边界观察分别标明。

## 会话与运行环境要分开

### 控制层的托管与本地路径

9月10日进入public beta的[OpenAI Agents API](https://developers.openai.com/api/docs/changelog)，把Codex harness、持久session以及compaction/recovery上移为托管服务，同时允许接入自有或伙伴sandbox。托管Harness与可替换执行环境由此成为可以分开组合的组件，但也带来了双重生命周期和凭据责任。

Session可以比执行环境活得更久；删除API侧的environment，并不等于自动停止自有compute。美国数据驻留、ZDR与自托管执行环境也必须分开理解：使用自托管sandbox，不会自动获得ZDR。

本地Agent OS的变化同样集中在状态与恢复。[OpenClaw v2026.9.4](https://github.com/openclaw/openclaw/releases/tag/v2026.9.4)的标签实际于上海时间9月11日发布，涉及配置所有权、安全重放、Codex会话与最终答复恢复。其发布验证仍有未完成或豁免项，不能理解为所有平台验证已经全部通过。Hermes Agent v0.21.2/v0.21.3则围绕`state.db`、多profile隔离和refresh并发修复展开，说明本地Agent OS的竞争也进入了数据库、凭据与后台恢复层。

控制层的授权语义尚未统一。Anthropic托管auto permissions增加了逐工具allow/ask/deny与evaluation事件，但`auto`不是人工审批点，默认也并非auto；custom tools不会自动受同一套策略治理。

恢复语义也需要逐项理解。[Google ADK 2.9.0](https://github.com/google/adk-python/releases/tag/v2.9.0)及2.9.1带来失败节点重执行、YAML graphs、FallbackModel与MCP2 opt-in。失败节点能够重新执行，不代表外部副作用只发生一次：外部写操作若没有幂等键，恢复可能再次触发副作用。

Microsoft Agent Framework .NET 1.21.0在窗口内发布，但Harness文档的更新时间只证明当前文档边界，不能证明其中相关功能本周首次上线。Semantic Kernel与AutoGen在已查release入口中，未见可核的本周重大发布。

控制层正在形成session、context、tools、approval、events与recovery的组合，却还没有统一状态和授权语义。托管路线把运维责任上移，开源Agent OS则以本地所有权、渠道和可组合性竞争。

### 执行环境的暂停与恢复

据Google Cloud相关release note，9月11日公布的GKE Agent Substrate从计算底座提供面向Agent的专用数据面，可以暂停闲置Agent并快照RAM与文件。不过，生产使用仍是limited GA allowlist；默认隔离为gVisor，microVM需要额外配置。供应商披露的性能数字不能据此视为独立验证的结论。ADK与Substrate分别处理Harness和执行数据面的恢复，但checkpoint仍不等于外部副作用的exactly-once。

火山AgentKit v0.8.7于9月15日在SDK中暴露`PauseSession`、`ResumeSession`、snapshot字段和Exclusive Gateway配置。这里可以确认的是接口与版本，不能外推为所有账号、区域或托管服务已经统一GA。

E2B在9月10日的文档型变更中提醒，旧控制面即便返回2xx，也可能忽略请求的恢复模式。9月16日的release记录还包含旧模板API移除与诊断修复。这一边界说明，成功响应不等于运行时已经按请求语义执行。

Daytona v0.214.0于9月15日聚焦构建与连接安全修复；其Container、VM和GPU sandbox的持久化语义不能互相泛化。OpenClaw本周的直接提交则修复了cron准备过程中的runtime generation竞态：长期任务的一致性从启动准备阶段就已开始，而不只是模型生成阶段的问题。

腾讯CloudBase AI Toolkit v2.34.4于9月16日修复部署规则。这是接入与部署层变化，不等于腾讯Agent Runtime在本周新上线。

因此，“有状态”需要拆开看：会话历史、文件、内存、输入输出事件和外部副作用，分别由谁保存、恢复与清理？云厂正在收编产品组合，恢复保证却仍然碎片化。

## 隔离不等于业务断点

执行环境能否隔离，与任务能否恢复，是两个问题。内核隔离、网络策略、凭据可见性、动作审批和回放证据也需要分别理解：一个`sandbox=true`不能覆盖所有威胁，浏览器视频不能替代业务断点。

AWS AgentCore Code Interpreter的本周客户案例展示了一种用法：只把最难的长尾样本交给sandbox。相关规模属于客户或供应商披露，邮件总量不能当成sandbox调用量，也不能据此外推采用规模。

agent-browser v0.38.0的窗口内release记录包含稳定refs、delta snapshot、条件截图和CDP恢复。它仍是CLI，不是自动托管sandbox。v0.38.1换算到上海时间已是9月17日，不计入本期。Browserbase / Stagehand 4.1的实际日期则是9月9日，仅作窗口外背景；云浏览器、录制与replay不能直接等同workflow checkpoint。

Databricks Sandbox Beta存在明确边界：开放egress不可配置，停止时可能清理非home数据。专用托管browser的等价证据尚未取得，这不等于产品“不具备”该能力。Anthropic Computer Use本次也未发现可核的本周toolset新发布；其client toolset仍需自备执行环境，不应称为托管桌面。

## 工具分发走向授权治理

### 技能和网关的边界

[MCP Skills正式扩展](https://github.com/modelcontextprotocol/ext-skills)把技能发现、按需读取、来源身份、manifest完整性与批准失效写进宿主契约，让工作流内容分发进入协议扩展。但正式扩展不代表所有客户端已经实现；digest能证明内容一致性，不能证明内容可信。

A2A在窗口内更新的路线图讨论了v1.1、双向流、CLI/harness接入与多轮交互。这些仍是规划，不能当作v1.1已经发布。

网关产品的可用状态也不相同。Databricks于9月10日提供受Unity Catalog与Unity Gateway治理的MCP connectors GA；9月16日官方产品记录宣布MCP service管理API和开发工具GA，但service policies与Bundles仍是Beta，且存在逐账户rollout。9月16日页面没有给出时刻和时区，严格按日末归窗时，只能将这条记录视作边界观察。

Postman Fabric Gateway于9月10日开放early access，代表Agent Gateway进入产品化方向，不能与GA等同。Nango v0.71.8增强了session日志与审计、过期key清理和MCP auth配置。Kuadrant mcp-gateway则修正了旧MCP版本与无会话HTTP的耦合假设；这一变化由可核的commit/PR支持，原先的issue未能复原，不能视为已核实该issue。

Gateway正从统一URL/schema，走向有身份、有版本、有调用前后策略的治理资产。不过，内容分发、网络策略、token托管与工具执行，仍不是同一种标准件。

### 授权必须覆盖整个生命周期

9月14日的[AWS AgentCore Consent portal](https://aws.amazon.com/blogs/machine-learning/manage-end-user-oauth-consent-for-ai-agents-with-amazon-bedrock-agentcore/)托管组织登录、终端用户同意和session binding，连接主IdP、Gateway与token vault。主IdP需要支持JWT/OIDC；删除portal，不等于已经证明所有下游token会即时撤销。

[Nango v0.71.8](https://github.com/NangoHQ/nango/releases/tag/v0.71.8)进一步将session actor、创建与终止审计纳入release。终止session会拒绝后续请求，但不会取消已经在途的操作。把授权对象删掉、拒绝新调用与撤回正在执行的动作，不能混为一谈。

pi-mcp-adapter v2.34.0增加显式opt-in的加密凭据后端、URL绑定和CIMD支持，但跨进程OAuth事务序列化仍不可用；本期未做密码学或并发实测。Google Slack集成升级则需要管理员重装，并由用户重新授权：权限扩展不能通过内容自动获得。

Microsoft Entra agent identity的OBO、application-only以及新旧Agent资源模型需要分开理解，新principal还需要重新赋予下游RBAC。网关之后也可能有旁路：Composio hosted MCP可能绕过SDK hooks；Databricks普通消费者不应直接获得底层`USE CONNECTION`。

Identity正在从“存一把token”，转向绑定用户、资源与执行路径的授权生命周期。存储安全、身份绑定、最小权限、撤销时序和审计覆盖，需要分别验收。

## 记忆数据库的治理契约

Memory的竞争点正从“多记一些”，转向谁写入、从哪里来、何时失效以及怎样删除。

上海时间9月14日发布的[OpenViking v0.4.20](https://github.com/volcengine/OpenViking/releases/tag/v0.4.20)，把Compile任务、来源与目标权限、执行记录与事件、记忆策略和宿主捕获链路纳入Context Database职责。它的队列精确目标互斥只在单实例成立，重试不保证exactly-once，事件记录也有保留限制。

上海时间9月16日的[Cognee v1.5.4rc1](https://github.com/topoteretes/cognee/releases/tag/v1.5.4rc1)将混合检索结果组织为带provenance的机器可读证据。这里必须保留rc身份，准确率或成本改善也不能视为独立实测事实。

其他记忆与知识基础设施的动态，需要区分维护、窗口外发布和证据缺口：

- **Mem0**本周只有依赖维护与文档提交；9月9日晚的插件release在窗口之前。
- **supermemory**有UI无障碍维护，没有证据支持重大Memory API新发布。
- **Letta**有旧Python server安全报告范围文档变更，新版SDK的本周增量未取得。
- **Zep/Graphiti**有MCP依赖维护；Graphiti release在窗口前，Zep商业changelog正文未取得。
- **Firecrawl**有Bigtable后端读取提交；**Crawl4AI**已查主分支的窗口内commits为空，最新release为8月31日。

ai-memory、Engram、Graphify与CodeGraph都是模块型基础设施，但缺少周增速基线，不能据此做“爆发”排名。Future AGI v1.38.0于上海时间9月11日发布，约2,022 stars只是存量，只用于说明资料扫描的优先级，不等于市场领导力；它在诊断与模拟方面的变化见下文。

Memory正在成为带有身份、版本、来源、加工任务与删除契约的Context Database。Embedding只是底层材料，不代表长期记忆治理已经完成。

## Trace先要忠实记录执行

可观测性的变化，开始触及Agent执行事实本身，而不只是展示方式。

上海时间9月15日发布的[Braintrust bt v0.20.0](https://github.com/braintrustdata/bt/releases/tag/v0.20.0)，修复多Harness的trace正确性，包括工具成功与失败、flush、子transcript与子任务，以及resume/compaction事件。[OpenTelemetry GenAI #518](https://github.com/open-telemetry/semantic-conventions-genai/pull/518)则为`execute_tool`的tool span增加conversation关联。不过，这套规范仍处于Development，不是稳定GA，也不等于所有SDK已经升级。

上海时间9月16日的[Langfuse v4.37.0](https://github.com/langfuse/langfuse/releases/tag/v4.37.0)增强gateway telemetry与敏感字段脱敏，并区分响应头时延TTFB和provider完整generation执行周期。本期未做真实provider或Datadog部署测试，不能把文档能力当成已验证部署效果。

留存契约同样决定trace能支持什么判断。[LangSmith自9月14日起](https://docs.langchain.com/langsmith/usage-and-billing)，对新SaaS extended traces设置最长180天的保留上限。旧trace、BYOC/self-hosted、dataset副本和部分metadata有不同规则，不能用“180天”覆盖全部数据。

Arize Phoenix v20.10.0与evals v3.8.0在窗口内发布，v20.13.0已越过上海时间截止，不计入本期。PII相关factory/export的最终可调用路径尚未核实，不能称在线阻断已经完备。Coze Loop本周的维护提交让自动评估标签带上evaluator name/version，但这不是新平台release。

Future AGI v1.38.0带来Daytona diagnostics、guest collector、tenancy metadata和hosted simulation。仓库仍提示nightly/early testing；release不是prerelease，不代表全平台已经达到成熟GA。

Tracing、evaluation、simulation和guardrail回答不同问题。LLM judge不能替代执行前权限，模拟成功也不是生产用户成功率。权威的run/session/turn/tool ID应先存在，再向OTel等后端导出。

## 七个平台的能力边界

企业控制面正在把runtime、tools、credentials、memory与telemetry纳入统一管理。但品牌统一，不代表单一身份、SLA或session store。

下表覆盖AWS、Google、Microsoft、阿里云、火山/字节、腾讯云和Databricks七个平台。除最后一列外，多数格子描述当前资料可支持的能力背景，并不是本周全部新发布；“未取得”或“未核”不等于产品不具备。

| 平台 | Runtime / Session | Memory / Context | Gateway / Tools | Identity / Auth | Sandbox / Browser / Code | Observability / Eval | 本周强信号 |
|---|---|---|---|---|---|---|---|
| AWS | AgentCore Runtime、session microVM、异步长任务 | 短期session＋跨session长期store | Gateway将API/Lambda/MCP统一为tools | workload identity、JWT/OIDC、3LO、Consent portal | managed Browser、Code Interpreter | OTel、Eval sessions、simulation、Guardrails | 9月14日Consent portal；客户案例为具名披露，不外推规模 |
| Google | Agent Runtime/Sessions；GKE Substrate | Memory Bank、RAG Engine分层 | Agent Gateway/Registry，ADK MCP2 opt-in | Agent Identity、mTLS/DPoP/IAM | Code Execution；Computer/Shell的9月9日变化仅作背景 | Trace、online eval、multi-turn simulation | ADK 2.9恢复语义；9月11日Substrate limited GA allowlist |
| Microsoft | Foundry hosted/prompt agents、VM隔离session | Memory Store public preview | Toolbox MCP endpoint、OpenAPI/A2A | Entra dedicated identity、OBO/app-only | Code Interpreter、Playwright Workspaces | OTel/Application Insights、评测与synthetic query preview | Framework 1.21.0与文档更新；未核平台新GA |
| 阿里云 | 百炼/PAI/AgentRun分层 | Memory库、RAG、第三方memory接入 | plugins/MCP/AgentRun聚合 | workspace key、RAM/STS，不是统一OBO | Managed sandbox、FC Agent Sandbox | 应用观测与自动评测有范围限制 | 已查列表未见可核的本周重大Agent发布，日志滞后 |
| 火山/字节 | AgentKit Runtime；Coze异步workflow | OpenViking/Coze memory | Exclusive Gateway、MCP tools | gateway permissions；独立workload identity未核 | code/browser/terminal/filesystem | Coze Loop eval/trace | AgentKit 0.8.7、OpenViking 0.4.20 |
| 腾讯云 | ADP/Claw/CloudBase分层 | 用户×应用隔离，跨模式不迁移 | connectors/tools/skills；统一managed MCP gateway未取得 | 企业/workspace角色、共享凭证引用 | 独立workspace/code；强microVM/browser未取得 | 日志/eval/monitor；OTel出口未核 | Toolkit 2.34.4；凭证/memory文档更新并非首发 |
| Databricks | Apps/AgentServer/ResponsesAgent | UC、AI Search、managed memory Beta | Unity Gateway/UC MCP services | UC grants、service principal、per-user OAuth | Sandbox Beta；专用browser未取得 | MLflow trace/eval | 9月10日connectors GA；9月16日API/工具GA为日级边界观察 |

采购时，优先需要验证四件事：资源身份是否贯穿tool execution；恢复是否会重复外部副作用；memory与trace能否按角色和保留期治理；版本或凭据变更能否展示影响范围。

## 本周TOP5结构性信号

按对基础设施格局的信号强度排序，本周五项变化分别是：

1. **OpenAI Agents API public beta。** Harness托管化与可替换sandbox分离，代表开发范式上移；驻留、ZDR和环境生命周期边界随之成为必须单独理解的问题。
2. **MCP Skills＋治理型Gateway/Consent组合。** 技能内容分发、网关资源治理和终端用户授权开始连接成控制面，而非单纯增加工具数量。
3. **Google ADK 2.9＋GKE Agent Substrate。** 从Harness恢复语义到专用执行数据面，都在处理暂停与恢复，但仍没有统一的exactly-once保证。
4. **OpenViking v0.4.20。** Context Database把记忆加工、权限、任务和事件纳入同一系统，Memory进入治理阶段。
5. **Trace真实性与保留契约。** Braintrust、OTel、Langfuse和LangSmith分别校正工具事件、会话关联、时延与脱敏、保留期，使Observability从仪表盘转为生产责任证据。

Databricks 9月16日Unity Gateway API/SDK GA、Anthropic auto permissions、火山AgentKit 0.8.7、Langfuse v4.37.0和AWS Consent portal也都是强候选。其中部分合并进了同一结构性信号，避免将跨模块事件重复计为多条新闻；Databricks的日级时间边界仍适用。

## OpenClaw可借鉴什么

这些变化对OpenClaw的参照，不是简单补齐一张功能表，而是把各类状态和证据分开管理：

1. **分别持久化业务任务、conversation/session、sandbox ID、artifact和外部副作用水位。** Session仍然存活，不代表任务已经完成；sandbox结束，也不应让业务任务凭空消失。
2. **为resume建立副作用契约。** 任务ID、执行ID、批准事件与幂等键应能关联；需要重执行的步骤显式标注，不可幂等的写操作先核实结果，再决定重试。
3. **把credential与memory作为一等治理资源。** 支持来源、引用详情、变更影响、用户/空间/agent scope、删除与过期以及审计，不把“隔离”简化成一个布尔值。
4. **先维护权威执行事件，再做OTel兼容导出。** Run/session/turn/tool的真实ID，以及resume/compaction、子任务和最终交付事件，不能从旧transcript中猜出来。
5. **分开业务完成、发布完成和投递完成。** UI重连、runner状态或消息发送结果，都不能替代产物、Git、HTTP与最终用户交付证据。

## 资料范围与证据边界

本期覆盖全球Agent基础设施的8个模块和7个平台矩阵。这里的来源记录是可定位的URL或原始记录，不等于相同数量的独立发布方或完整原文；同一机构的release、PR和commit也不构成独立二源。检索没有结果，不代表市场没有动态。

证据核查采取风险导向而非随机抽样，检查超过5项，涉及OpenAI驻留/ZDR、ADK重执行副作用、Anthropic custom tool权限、OpenClaw发布与重放、Databricks日末时间边界、AWS客户数字分母、MCP批准失效、Memory scope和trace留存。

全文不是独立生产性能、攻击、密码学、多租户隔离、客户采用或ROI实测。原始事实、具名披露与有限佐证需要区别理解，供应商benchmark和效果数字没有被当成独立验证的事实。

多个页面只给出文档更新时间、Atom `updated`或自然日，不能证明首次发布的精确时刻，因此窗口外或边界不明的事件分别作为背景、边界观察，或不计入本期。AWS个别博客、Zep商业changelog、Coze SaaS与部分国内云发布入口未能完整取得；这些缺口不应被解释为相关能力不存在。
