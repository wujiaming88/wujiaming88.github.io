---
layout: single
bucket: agent-infra
title: "DeepSeek Harness 走到 rc.1：能力契约、生态产品化与生产边界"
date: 2026-09-04 14:36:00 +0800
categories: [AI]
tags: [DeepSeek, DeepSeek Harness, Agent Harness, AI Agent, Cordis, 插件生态, 开源生态, OpenClaw]
header:
  overlay_image: /assets/images/posts/2026-09-04-deepseek-harness-radar-header.png
---

> **观察范围**：检索截止 2026-09-04 14:18:00（Asia/Shanghai）；主增量时间窗为 `(2026-09-01 14:20:51+08:00, 2026-09-04 14:18:00+08:00]`。最近 7 天补漏窗自 `2026-08-28 14:20:51+08:00` 起，补录信息仍按“上期补录/回溯”处理，不作为主窗新事件。

DeepSeek Harness（dsh）在本期从 `v0.1.2-alpha.3` 连续推进到 `alpha.4`、`alpha.5`，最后抵达 **`v0.1.2-rc.1`**。该 release 标记为 immutable/prerelease。Release、Tag 与 Commit 已交叉核对：tag `dsh-v0.1.2-rc.1` 指向 SHA `a66e4702047846cdaa10c66c9d3df3951f5ea70d`。npm 默认分发也从 `0.1.1-rc.2` 切换到 `latest=0.1.2-rc.1`，`next` 同步为 rc.1，`alpha=0.1.2-alpha.5`。

这一步降低了试用者发现正确版本的成本，却没有改变项目的正式阶段。官方 README 仍将其标为 worldwide Developer Preview，并提示可能发生兼容性破坏；SAFETY 仍明确表示项目没有经过安全审计，不能视为 secure 或 production-ready。

## RC 把分发推近一步

rc.1 所呈现的技术方向，是把可替换能力进一步收敛为更细的 package、service 与 event 契约。最明显的变化集中在 Session 按需读取与投影缓存、Remote/ACP、父子 Agent 双向消息，以及 profile/bundle 组合。与此同时，迁移、远程鉴权、公网 WebFetch、同内核 sandbox 和客户端构建仍缺少生产级证据。

生态侧也出现了更强的产品化信号：市场、桌面、移动远控、即时通信、视觉、记忆与交易研究等供给增加。不过，高质量案例仍停留在可复现的开发活动。本期没有发现独立 P1 生产或 P2 公开试点，也没有核验到客户、采购、收入或 SLA。插件连续主台账口径为 **A=0、B/B-=5、C=4、D=5**；案例为 **P1=0、P2=0、P3=9、P3→P4=4、P4=1、P5=1**，商业转化未核实。

三组关系尤其值得作为全文的阅读线索：

1. **技术与生态形成响应，但兼容合同落后。** Session API 的变化已经促使 `@xmanrui/dsh-im` 适配 `snapshotEvents()`，Bridge、Mnemon 和 Pi 桥也面临升级压力；然而，多数兼容声明仍停在 alpha.1、rc.1 或 rc.2，技术演进速度快于生态兼容合同。
2. **分发产品化与治理能力出现背离。** `dsh-market`、`dsh-web`、Pocket 和桌面发行把安装、更新、远控、SSH、隧道、导出与 cron 等能力聚合到入口，也同步放大了包级 provenance、权限 manifest、token 生命周期、回滚与审计尚未闭合的问题。
3. **垂直产品方法并不等于商业转化。** `dsh-trading` 的 typed seam、只读风险门和 `NOT PROVEN` 回测结论展示了一条垂直产品路径，但本窗仍没有独立客户、持续运行、成本/可靠性指标或付费信号，不能把产品化包装写成商业采用。

版本之外，本期还有几项需一起看：`Session.events` 转向 `seq`、`eventAt()` 与 `snapshotEvents()` 的按需读取，并用强类型区分 `SessionSeq` 与 `SessionLogOffset`；父 Agent 与可持续子 Agent 可以用 `send_message` 双向发送后续消息；ACP、模型选择、取消与 Remote 的统一面继续扩大。alpha.5 还修复了从旧 RC/alpha.3 升级后应用无法启动或 Session title 消失的问题，但上一期移除 SQLite Session backend 带来的迁移风险仍被列为 P0。

官方包图已按当期源码覆盖 **49/49 package groups**，并补入 apps、native、vendor、website 和 python workspace 层。生态侧则新增 `dsh-market`、`dsh-trading`、`dataelement/dsh-desktop` 等产品化信号。接下来需要分别看清：这些能力怎样组成系统，关键机制究竟改变了什么，以及生态为何仍不足以支持生产或商业结论。

## 49 组能力如何拼成系统

`dsh-v0.1.2-rc.1` 的 `packages/README.md` 不采用任意历史分类，而是把每个 `@deepseek-ai/dsh-*` package 归入一个官方 group，并由各 group README 定义 Service 或接口边界。全量地图可按读者关心的系统职责整理如下。

| 系统层面 | 官方 package groups | 能力边界与本期状态 |
|---|---|---|
| 产品 API 与会话主干 | `core`、`goal`、`schedule`、`feedback`、`identity`、`todo`、`plan`、`session`、`session-query`、`workspace` | 提供 `ctx.sessions`、Agent/Loop、append-only SessionEvent、Goal/Plan、定时 follow-up、检索与 Workspace。本期重点是 Session 读取、投影和迁移；其余经 rc.1 package tree 核验，没有本期独立重大破坏信号，但依赖 Session/Remote 时仍需回归。 |
| 模型、上下文与编排 | `llm`、`context`、`compaction`、`subagent`、`preset`、`guard`、`jobs`、`workflow`、`experimental` | 覆盖 LLM provider、model-visible context、压缩、子代理 provider registry、preset、deadline/guard、jobs/workflow。本期重点为 ACP、Remote、双向子代理和 PTC 入口收窄；provider/context/compaction seam 延续，长会话和 token 统计增强，但无公开容量 SLA。 |
| 执行、文件与隔离 | `subprocess`、`shell`、`terminal`、`code-runtime`、`sandbox`、`fs`、`lsp`、`skill`、`e2b` | 覆盖可替换的持久 subprocess、Bash、PTY、code worker、文件、LSP、Skill，以及 bwrap、Landlock、Seatbelt、Windows ACL 与 E2B POC。sandbox 明确是 same-world；PTC 不是 OS sandbox；E2B 仍为 POC。 |
| Web、事件与数据载荷 | `web`、`webhook`、`attachment`、`spill`、`storage` | 提供 search/fetch、可信外部事件、附件 durable identity、tool-result spill 和非 Session storage domain。公网 WebFetch、附件/Session 上传与数据平面需要单独治理。 |
| 交互、安全配置与扩展 | `interaction`、`credentials`、`settings`、`extensions`、`hooks` | 包括 approval、ask-user、permission preset、凭据引用、settings、运行时 mount/unmount，以及 Claude/Codex hooks。扩展面权力上升，但审计与撤销合同仍不足。 |
| RPC、SDK、前后端与启动 | `api`、`typert`、`sdk`、`acp`、`boot`、`host`、`client`、`bundle` | 覆盖 Remote BFF/Typert、JSON-RPC SDK、ACP、应用启动、Web host/client 和 profile patch/bundle。APIProxy 已移除并统一到 Remote；rc.1 的客户端构建报告应进入 smoke gate。 |
| 工程支撑 | `test-support`、`runtime-diagnostics`、`util` | 提供 testkit、invariant、replay、loader smoke、诊断报告与路径、超时、保留等工具；工程闸门存在，但尚未转为公开生产基准。 |

合计为 **49/49 package groups**。package 之外，workspace 还包括 `vendor/*`、`native/landlock-run`、`apps/*`、`website` 与 `python/sdk-runtime`。当前应用层核验到 `apps/cli` 和 `apps/web`，其中 CLI 提供 `dsh` bin。`bundle` 层提供 `web`、`headless`、`sdk`、`sdk-minimal`、`acp` 等 profile；`dsh-base` 被多个 profile 共享，而 `sdk-minimal` 拥有独立完整树。

### 装配不是简单合并

Cordis Context 承载 services、typed events 与可逆 effects。实际装配依次经过 bundles、profile 的 `cordis.patch.yml`、home-level patch 和 `--patch` overlay。这里有一个容易被忽略的语义：patch 按 row id 定位并替换该 row 的**完整 config**，而不是字段级 merge。

因此，扩展插件应依赖 Service Definition，例如 `ctx.sessions`、`ctx.subagents`、`ctx.sessionProjections`，而不是依赖某个 concrete provider；升级前也必须检查配置语义差异，不能只看字段是否还存在。

从请求进入到结果返回，核心链路可以读成：

| 顺序 | 调用链节点 |
|---|---|
| 1 | 用户或外部事件 → host/client/Remote 或 ACP |
| 2 | Agent / Session service → SessionEvent append-only log |
| 3 | projection/cache/title/telemetry 等 domain consumers → context/compaction |
| 4 | LLM adapter stream → tools / shell / fs / web / subagent |
| 5 | tool/model events 回写 Session log → Remote/session-controller 推送 projection、状态和结果 |

这条链的每一层承担不同故障边界：Remote/ACP 处理连接、取消和异常分发；Session 保持事实源和顺序；projection 提供客户端可见的整体值；LLM 与 Tool 承担外部副作用；sandbox 只约束其自身 provider 的能力。因而，把整条链直接称作“安全隔离”或“可靠重试”，都超过现有证据。

## 四个工程焦点

### Session：事实源、投影与迁移要分开看

官方仍把 Session 定义为 append-only `SessionEvent` log，模型消息历史由日志重建，而不是另行存储。rc.1 不再鼓励直接读取 `Session.events`，而改用 `seq`、`eventAt()` 和 `snapshotEvents()`；同时以强类型区分 `SessionSeq` 与 `SessionLogOffset`。这是一次重要 ABI 变化，方向是按需读取，并减少长会话要求全部历史事件持续驻留内存的问题。

Session group 当前包括 persistence service/JSONL、checkpoint policy、projection、projection cache、stats、turn outline、title、telemetry/OTel 等包。框架监听 committed event，并将其折叠为 domain state；客户端接收的是完成后的 whole value。projection cache 只是一条 fold shortcut，它带有明确的 `seq` 用来说明陈旧程度，不能反过来充当事实源。

这里还要区分两个同为 SQLite 的概念：SQLite Session persistence 已在 alpha.3 移除，但 `session-query` 仍可使用 SQLite FTS。旧 SQLite 内容不会被自动删除，却需要通过旧版本导出；rc.1 并没有证明已经提供第一方 import、verify、rollback 闭环。因此，迁移风险仍是 P0。

这套变化的正面效果，是长历史不必全部常驻，projection/cache 可能改善列表和冷启动读取，session log、projection、telemetry 与 query index 也可以形成相对分离的数据平面。负面影响则是：仍直接读取旧数组的插件，以及混淆 seq 与 byte offset 的实现，可能在编译或 replay 阶段暴露问题；title、projection 或 migration 任一层失败，都可能呈现为“应用启动了，但历史不完整”。

相应的验收不能止于启动成功。需要备份旧 home，并依次完成 export/hash/count/import/resume/rollback；还要分别验证 log、projection、title、attachment、schedule、query index、OTel 与官方请求 metadata 的 retention/deletion。

> 配图方案
> - 位置：本节末尾
> - 类型：流程图（示意图）
> - 阅读目的：区分 Session 事实源、投影缓存、查询索引和客户端可见状态，避免把 cache 当事实源。
> - 内容：SessionEvent append-only log → committed event → projection/whole value；旁路标出 projection cache+seq、query index、title、telemetry/OTel，以及迁移的 export/hash/count/import/resume/rollback 检查链。
> - 图题与图注：**“Session 数据平面与迁移验收（示意图）”**；仅展示原报告明确给出的组件与关系，不代表已有自动化闭环。
> - 来源：原报告 Session、Persistence、Projection 小节；官方 Session group 链接见文末。
> - 替代文本：Session 日志是事实源，projection 折叠已提交事件并向客户端提供整体值，缓存与查询索引均不是事实源；迁移需逐项验证导出、计数、恢复和回滚。

### Subagent：双向消息带来更完整的状态机

subagent group 通过 `ctx.subagents` 注册多种 provider，包括 in-process fresh/fork、ACP、Codex、Claude Code 和 dsh SDK；模型侧由 `tool-subagent` 与 control 工具消费这些能力。alpha.4/rc.1 新增父子 Agent 双向 `send_message`，并允许在授权范围内选择 provider、model、reasoning 和 max output。ACP 也补齐 Session、model、MCP、permission 与 cancel 控制；旧 APIProxy 已迁移并移除，统一进入 Remote。

这使“子代理可以继续工作”更接近一等编排能力，但状态机也更复杂。消息 idempotency、父子权限继承、断线重连、取消后拒绝新消息、父会话关闭后的 child quiescence 都需要测试。Release notes 没有给出重复投递、重放、乱序或 HA 的证明。

### Sandbox、PTC 与 WebFetch：工具面缩小不等于隔离成立

sandbox group 包括 contract、Linux/macOS/Windows provider 与 policy；read-only、workspace-write、danger-full-access 等模式可以通过用户批准的 escalation 改变。官方 SAFETY 说明，项目可以执行模型生成的代码和命令、加载第三方插件，并访问网络、进程、凭据与文件；sandbox、approval、permission 只能降低风险，不能保证隔离。

当前 sandbox 是 same-world，仍与宿主共享 kernel/filesystem。只有容器、microVM 或 remote executor 这类外层边界，才是替换整个 capability family。PTC Mode 的 SDK 工具面已经收窄到 `run_code`，Web PTC 默认不再向模型提供通用 workflow tool，这是最小化工具面的一步；但 worker thread 依旧不是 OS sandbox。

rc.1 还把公网 `web_fetch` 默认带入 Python SDK、Headless、ACP 与 custom profiles，并声称内置 SSRF 防护。本期没有对此做动态 fuzz，因此“有防护”仍是项目方主张。部署时应默认验证或关闭 redirect、DNS rebinding、IPv4/IPv6 私网、metadata endpoint、代理变量、响应大小/时间和 content-type。

### Profile、Client 与供应链：组合能力扩大了安装边界

profile/bundle 让 dsh 的差异化更多体现在装配，而不是单一内置 Agent。与此同时，pnpm `allowBuilds` 显式放行 `esbuild`、`lefthook`、`node-pty`、`koffi` 和 SDK runtime postinstall 等项目，并为部分新鲜依赖设置 release-age exclusion。显式允许生命周期脚本优于默认全部允许，但仍不能替代版本锁定、provenance 校验、平台二进制 hash 与安装时网络行为检查。

rc.1 还有一条单一、但可复述的社区风险报告：Discussion #5544 描述 Windows + Node 24 下，client bundles 引用未物化的 client packages，造成 `client-modules` build-time externals drift，可能使前端 plugin tree 无法启动。这不是普遍统计，也没有证明官方已经修复；它仍适合作为升级前的 P0 clean-install smoke gate。Discussion #5519 同列于社区风险来源，具体证据边界以原报告为限。

## 生态供给变多，准入仍为空

### 插件数量增长，可信准入条件无人闭合

本期继续采用保守的连续台账口径：**A=0、B/B-=5、C=4、D=5**。A=0 并不是说生态没有项目，而是没有任何重点插件同时满足一级来源、兼容契约、安装/运行验证以及权限/供应链闭环。各对象的信号与边界如下。

- **`dsh-plugin-bridge` 0.3.2（B）**：具备 npm integrity、SLSA、OIDC trusted publisher、tests/typecheck/dataset/package smoke，能力涉及 Session migration、Remote/UI 与 preset；peer 仍未明确覆盖 alpha.3。建议隔离运行、使用假会话并锁 digest。
- **`dsh-vision-router` 2.1.1（B-）**：MIT，支持 Node 22/24，提供较多兼容、资源、对抗与压力测试以及 SLSA；能力包含图片、OCR、截图、Puppeteer、HTTP、native sharp 和模型凭据。需要限制网络目的地与资源，不能凭作者测试直接升为生产准入。
- **`dsh-mnemon` 0.5.0（B-）**：MIT，具备 vitest、headless、deterministic build、package/attw/publint 和 SLSA，已经发布 composable memory plugins，覆盖 Source、Strategy、Provider 与多 provider。应先用假数据试验，并审查 poisoning、留存、删除与恢复。
- **`pi2dsh` 0.24.0（B-）**：MIT，具有 E2E/seams/community/live scripts 与 registry signature，桥接 Pi Host ABI、MCP、OAuth、扩展、子进程和文件。canonical 直抓与 alpha.3 兼容仍缺。
- **`dsh-pocket` 2.10.3（C）**：GPL-2.0、Node≥22、`node:test`、npm signature；本期修复 `0.0.0.0` 默认密码问题。它提供 LAN/公网 QR、cloudflared、实时同步和 session export，属于高权远程面，不应直接面向公网采用。
- **`@xmanrui/dsh-im` 4.9.1（C）**：MIT、18MB，覆盖 9 个 IM 渠道，有 test/build/check 与 registry signature；同时承载机器人凭据、双向审批、第三方 SDK 和公网 AI Office。每个渠道应使用独立 principal 与假凭据，现有信号不能推出兼容或生产结论。
- **`@dsh-market/plugin` 0.4.5（C）**：有 build/typecheck，但 test 只是 echo 转到 core；它的一键安装与下游管理会放大供应链风险，市场自身与下游都要逐包准入。
- **`dsh-web` 家族（C）**：分包持续发布，但聚合包身份不闭合。SSH、SFTP、tunnel、cron、视觉、Git、救援与删除等能力不能被聚合成一个统一可信对象。
- **未 scoped `dsh-im` 1.0.5（D）**：与 scoped 包身份不同，peer 仍指向旧 rc.6，当前 ABI 不兼容或尚未证明兼容。
- **`dsh-skill-mover`、`hooks-adapter`（D）**：仍没有当前 ABI、分发与测试闭环，前者涉及文件/instructions/scripts 迁移，后者涉及 shell/webhook，不应自动采用。

`dsh-market` README 所称的 2300+ catalog、curated registry、host-aware filter、build scripts 默认阻断及安装/备份能力，都属于项目方主张。可以核实的是，`dsh-market` v1.41.0 release 记录了 npm 更新说明、主机版本过滤、favorites、Git 插件迁移等产品演进。即便如此，市场仍只是分发基础设施，不是信任根：包级 immutable digest、权限 manifest、SBOM、provenance、撤回/回滚与恶意包通知仍未闭合。

### 可复现开发活动仍不是 P1/P2

本期案例分级为 **P1=0、P2=0、P3=9、P3→P4=4、P4=1、P5=1**。

**BotFleet × DSH driver（P3）**来自独立仓 PR #189，已经合并。作者报告定向 56 tests、全套 2,583 pass，同时说明两个无关 suite 在本地启动失败；改动修复 fallback error 分类、`DSH_HOME` credentials precedence 和 model-set 错误，并明确 ACP resume、MCP、usage 仍有缺口。这是可核的开发集成，不是生产案例。

**OpenDesign/Aurora gateway（P3）**的 PR #29 仍是 open/unmerged。作者称有 85 个 control-plane tests、4 个 e2e，以及 Docker/PostgreSQL smoke；但它是作者的 feature task，而且明确不是 DSH-only，不能被写成公开试点。

Pocket、`@xmanrui/dsh-im`、Vision Router、Bridge、Mnemon、pi2dsh 与 dsh-web 家族都有可核代码、包或 release，但最多只能归到 P3。作者测试、stars、下载量和市场目录数不能替代主体、周期、业务结果、SLA、成本、P50/P95、故障率或安全审计。GitHub 对 `production`、`deployment` 的宽搜命中主要是自动阅读清单、通用 agent 文章、未合并 PR 和代码集成，因此没有发现同时具备生产/试点范围、持续周期与可靠性/成本/安全指标的独立主体。

### 衍生项目形成产品形态，但没有采用闭环

本轮衍生候选 24 个，精读/直接抓取 17 个，采用/更新 14 个；分布为 **D1=5、D2=3、D3=3、D4=3**。这里的 D1—D4 是衍生项目口径，不能与插件 A/B/C/D 混用。

- **D1：`maddogfinance/dsh-trading`**。它不是 fork，仍是 early scaffold；采用 typed market-data seam、CSV/Futu provider、只读分析工具、risk guard 和回测 verdict，明确拒绝 execution-shaped tool names，并允许结果为 `NOT PROVEN`。这是本期最清晰的垂直产品方法，但不连接实盘。
- **D1：`dataelement/dsh-desktop`**。它基于 `@deepseek-ai/dsh@0.1.2-rc.1` 提供 macOS/Windows 桌面发行，声称具备签名、更新确认、安全模式、手机配对和 quick tunnel。版本滞后及上游 ABI 仍需矩阵化披露。
- **D1 边界：`dsh-web`**。它把任务/cron、移动远控、SSH/SFTP/隧道/集群执行、视觉、Git/worktree、救援和会话归档聚合为工作台；由于实现仍是多插件组合，安全边界必须按子包审计。
- **D2：Ollama 集成**。Ollama 官方文档提供 `ollama launch dsh`，可按需安装 `@deepseek-ai/dsh` 并配置模型；它仍被标为 developer preview，web search 需要 Ollama cloud access 和支持工具的模型。这是平台接入或获客入口，不是联合销售或收入证据。
- **D3：`dsh-market`**。它在 Web profile 内提供发现、安装、更新、主题、备份/恢复和诊断，产品化很强，也把供应链权力集中到市场入口。
- **D4：Fairy-DSH、普通 Fork、旧 ACN/session-export/topology、未恢复 Bridge canonical**。这些对象缺少足够的 canonical repo、release、差异说明与维护证据，不能因名称、Fork 活动或第三方描述升级。

### 商业证据只到接入、主张和判断

商业层按 L1 原始证据、L2 项目方主张、L3 媒体/咨询判断、L4 传闻/弱线索分层。本窗结果为 **L1=2、L2=3、L3=1、L4=1（排除）**。

L1 包括两项。第一，DeepSeek 官方仍只给 worldwide Developer Preview/source included，没有价格、企业版、SLA、客户或采购入口。第二，Ollama 官方集成是真实的启动与配置接入，能够改善可得性，却没有联合销售、分成、认证伙伴或付费客户证据。

L2 是 Desktop、dsh-market 和 dsh-trading 各自关于签名桌面发行、2300+ catalog/更新能力、交易研究工作台的主张；它们都没有下载活跃、付费、客户、合同或独立指标闭环。L3 是 Wavect 企业评测：其判断是适合 contained engineering pilot，不应把 stars 当成 production control plane；这是一项独立风险判断，不是客户案例或审计。L4 则是泛 DeepSeek 公司融资等错配线索，与 dsh 项目的收入或融资没有直接关系，因此排除。

由此能成立的表述只有：平台接入、桌面发行、市场与垂直包装提升了可获得性，**商业转化仍未被原始证据验证**。不能据此写成“DeepSeek Harness 已商业化”。

## 技术供给为何没有自动变成采用

### Session seam 已被消费，兼容矩阵却没有跟上

这条命题的确定性为**高**。技术侧，rc.1 把 `Session.events` 改为按需的 `seq/eventAt/snapshotEvents`，移除 SQLite Session backend，同时保留 JSONL、persistence 与 projection seam。生态侧，`@xmanrui/dsh-im` 4.9.1 明确适配 `snapshotEvents()`，也保留旧路径，使 9 类 IM 中的问题与审批可以继续原 Turn；Bridge、Mnemon 与 Pi 桥也在快速迭代。

背离点在于，多数对象的 peer 或开发基线仍停留在 alpha.1、rc.1、rc.2，未 scoped 的旧 `dsh-im` 甚至仍指向 rc.6。由此只能得出：官方 seam 的可用性正在吸引开发者，但“包版本新”不能替代 host×plugin ABI 兼容矩阵。

### 可组合性同时制造产品与集中风险

这一判断的确定性同样为**高**。技术上，profile/bundle 会按 row id 完整替换配置，`bundle` 能叠加 Web、Remote、Session、tool 与 hook 等能力，官方 `allowBuilds` 只对部分安装脚本做显式许可。生态上，market、web、Pocket 与 desktop 又把一键安装、自更新、远控、SSH/SFTP、隧道、cron、导出和删除集中到用户入口。

这说明 `Everything is a Plugin` 具有很强的产品与创业价值；但市场若要承担这种权力，就必须成为权限、来源和撤回的治理层，而不能只是一份目录与一个安装按钮。

> 配图方案
> - 位置：本节末尾
> - 类型：双向关系示意图
> - 阅读目的：展示“可组合能力”如何同时扩展产品入口与治理责任。
> - 内容：左侧为 profile/bundle、Web、Remote、Session、tool、hook；中间为 market/web/Pocket/desktop 入口；右侧为 manifest、provenance、token TTL、审计、撤回、回滚。关系只采用本报告明确列出的能力与缺口。
> - 图题与图注：**“组合能力与治理责任（示意图）”**；不是风险概率图，也不暗示已发生安全事件。
> - 来源：原报告 Profile/Client、插件市场及交叉命题二；相关官方和生态链接见文末。
> - 替代文本：插件与 profile 组合将安装、更新、远控和高权工具汇聚到入口，同时要求权限、来源、撤回、回滚与审计形成对应治理层。

### 技术成熟度高于案例证据

这一命题的确定性为**高**。49/49 官方 package groups 已经形成较完整的 Service Definition、事件与装配边界，Session projection、subagent、sandbox、ACP 等也组成了可识别的 runtime 结构。但官方仍未提供 P50/P95、100k-event、multi-image 或 reconnect benchmark，SAFETY 也仍否定 production-ready。

生态侧的 P3 对象数量增加，dsh-trading、BotFleet、Aurora、Ollama、桌面与市场项目都可以核验；可是 P1/P2 仍为 0，商业原始证据只到平台接入。因此它目前可以支持受控 Demo 或垂直试验，不能凭“生态活跃”承诺企业 SLA、商业采用或投资级成熟度。商业叙事仍只能是包装与入口的叙事。

### 竞争差距落在组合治理

这条判断的确定性为**中高**。对照对象展示的是各自已有的长期治理产品面：OpenClaw 有跨端 Gateway、Doctor 回滚、坏 cron 隔离和来源频道审批；Claude 有 enterprise scanning、managed settings、Trusted Devices/Remote Control；Codex 有 marketplace/source policy、重连时对不确定提交的暂停，以及账户级审批证据；OpenCode 有多 provider 兼容修复与数据库兼容；Gemini CLI 则对 Docker/container sockets/binaries 做 Seatbelt 隔离，并提供 write safety checker。

相比之下，dsh 的优势仍是插件可组合性与快速构建垂直 runtime；短板集中在 OS 级隔离、升级回滚、账户/设备/审批域、市场治理和容量证明。竞争差距因而不只是“有没有某个功能”，而是这些功能怎样被组合、约束、恢复和审计。

## 现在可以怎样行动

### 先做低风险体验

1. 在一次性 VM 或独立 OS 用户下，用假凭据锁定 `0.1.2-rc.1` 与对应 SHA，分别测试 Web、headless、SDK、ACP 冷启动。先做 clean install，不覆盖旧 home。
2. 只读体验 dsh-trading 的 typed seam/risk-guard 思路，以及 dsh-mnemon 的 composable memory 设计；不连接真实券商，不导入敏感文档，也不启用公网隧道。
3. 把 `snapshotEvents()`、projection cache 与父子 `send_message` 作为 OpenClaw 架构参照，先在本地验证 replay、取消和恢复，不直接引入第三方插件。

### 用 1—2 周做三类 Demo

**兼容与迁移闸门**：构建 host×plugin×profile×storage schema 矩阵，自动检查 manifest、peer 与 integrity，并执行 Session export/hash/count、旧版本回读和 rollback。成功指标是升级后 session、title、attachment、schedule 全量一致，任何失败都应阻断升级。

**只读垂直评测台**：参考 dsh-trading 使用固定数据集、纯函数指标、risk guard 与 `NOT PROVEN` verdict。成功指标包括 P50/P95、token/cost、重试、回放率和错误拒绝率；不连接真实执行工具。这些数字是建议采集的指标，不是已有成绩。

**市场安全预检**：只读解析插件包的权限、scripts、依赖、网络目的地、provenance、SBOM 和 immutable digest；默认 deny shell、SSH、tunnel、restart、delete，并提供审计日志与离线 allowlist。

### 优先建设治理能力

与其再做一个 UI，更值得优先补齐 host ABI、版本/迁移/回滚、审批事件不可变记录、token TTL、设备绑定与撤销，以及市场撤回通知。OpenClaw 可以借鉴 dsh 的 capability seam、profile/bundle 装配、Session projection 与 service-definition 依赖方向，同时保留自身的 gateway trust boundary、security audit、故障恢复和审批来源语义。

若要集成 dsh，应只把它作为受控的外部 runtime/adapter，并隔离 credentials、网络与文件。不能把 dsh 的 sandbox 或 Developer Preview 状态当作 OpenClaw 的安全边界。

### 明确暂缓项与停止条件

暂不直接采用 dsh-market 聚合安装、Pocket 公网 tunnel、dsh-web 的 SSH/SFTP/cron、IM 公网 AI Office、hooks-adapter、skill-mover 和未 scoped `dsh-im`。

出现以下任一情况，应停止扩大试点：Session/storage schema 发生变化却没有可验证的导出与回滚；高权插件缺少权限 manifest 或 provenance；断线、compaction、fork、subagent 后审批证据丢失。若连续两窗仍没有独立 P1/P2、成本/可靠性指标或商业转化证据，也不能把生态热度升级为企业合作或投资判断。

### 下期需要回答的十个问题

1. rc.1 之后是否出现首个稳定版，或接口/Schema freeze/迁移合同？
2. SQLite/JSONL/export 是否出现官方 import、verify、rollback 工具？
3. 49 个 package groups 中，哪些第三方包明确声明并实际测试 alpha.3/rc.1 兼容？
4. `Session.events` 迁移是否有编译、replay、100k-event 基准？
5. Remote/`send_message` 是否公布幂等、cancel/close 与父子 quiescence 语义？
6. WebFetch SSRF 是否有 redirect、DNS rebinding、IPv6 和 metadata 的测试证据？
7. dsh-market 是否出现签名索引、SBOM、权限声明、撤回与回滚机制？
8. Pocket/IM 是否公开 token TTL、重放拒绝、凭据留存与公网威胁模型？
9. 是否出现具备主体、范围、周期及成本/可靠性/安全指标的独立 P2/P1？
10. Ollama 接入是否产生官方联合销售、认证或付费支持证据？

## 证据边界与来源

这份跟踪覆盖 **10/10 个研究域**：版本代码、官方模块、插件、社区健康、案例、衍生、商业、Issue/风险、竞争与行动建议。官方模块按 **49/49 package groups** 覆盖，并另行核验 apps、native、vendor、website 与 python workspace 层。版本的 Release、Tag 和 SHA 已核；README 的 Developer Preview 与 SAFETY 的未审计状态也已核。

原文精读口径为技术 18 个候选、18 个深读、15 个采用来源，技术重点事实 12+；插件、案例、衍生、商业的抽查门槛分别达到 3、2、3、3。插件已做 A/B/C/D 分级且没有 A；案例已做 P1—P5 分级且 P1/P2 为 0，没有把 Demo 或作者 PR 写成生产；衍生已做 D1—D4 分级，没有把弱关联、未恢复 canonical 或普通 Fork 纳入强结论；商业信息区分事实、项目方主张、媒体判断与传闻，未发现客户、采购、收入、融资、SLA、监管或独立生产指标。

本期没有执行本地安装、隔离运行、迁移、故障注入、动态 SSRF/权限审计或独立安全审计。Brave 首批请求出现 429 后，核心事实改由 GitHub Release/Tag/API、npm registry、官方项目页和仓库原文补足；搜索的负面结果不作为穷尽声明。

因此，最终门控仍是：**研究门控通过，生产采用门控不通过。** rc.1、细粒度能力契约和生态产品化让试用与组合更容易，但没有消除迁移、安全、兼容、治理、容量与商业采用方面的证据缺口。

### 官方与技术来源

- [Release](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.2-rc.1)
- [Release API](https://api.github.com/repos/deepseek-ai/deepseek-harness/releases/tags/dsh-v0.1.2-rc.1)
- [Tag ref](https://api.github.com/repos/deepseek-ai/deepseek-harness/git/ref/tags/dsh-v0.1.2-rc.1)
- [README](https://github.com/deepseek-ai/deepseek-harness)
- [SAFETY](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/dsh-v0.1.2-rc.1/SAFETY.md)
- [Package map](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/dsh-v0.1.2-rc.1/packages/README.md)
- [Architecture](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/dsh-v0.1.2-rc.1/docs/architecture.md)
- [Session group](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/dsh-v0.1.2-rc.1/packages/session/README.md)
- [Sandbox group](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/dsh-v0.1.2-rc.1/packages/sandbox/README.md)
- [npm metadata](https://registry.npmjs.org/@deepseek-ai%2Fdsh/latest)
- [Ollama 集成](https://docs.ollama.com/integrations/deepseek-harness)
- 社区风险：[Discussion #5544](https://github.com/deepseek-ai/deepseek-harness/discussions/5544)、[Discussion #5519](https://github.com/deepseek-ai/deepseek-harness/discussions/5519)

### 生态、案例与商业来源

- [dsh-market](https://github.com/dsh-market/dsh-market)
- [dsh-web](https://github.com/zhu1090093659/dsh-web)
- [dsh-trading](https://github.com/maddogfinance/dsh-trading)
- [dsh-desktop](https://github.com/dataelement/dsh-desktop)
- [dsh-pocket](https://github.com/shaobeichen/dsh-pocket)
- [@xmanrui/dsh-im](https://github.com/xmanrui/dsh-im)
- [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon)
- [BotFleet PR #189](https://github.com/jaywedgeworth22/BotFleet/pulls/189)
- [OpenDesign PR #29](https://github.com/eanfs/open-design/pulls/29)
- [dsh-market v1.41.0](https://github.com/dsh-market/dsh-market/releases/tag/v1.41.0)
- [dsh-pocket v2.10.3](https://github.com/shaobeichen/dsh-pocket/releases/tag/v2.10.3)
- [dsh-im v4.9.1](https://github.com/xmanrui/dsh-im/releases/tag/v4.9.1)
- [dsh-web v0.3.14](https://github.com/zhu1090093659/dsh-web/releases/tag/v0.3.14)
- [dsh-mnemon v0.5.0](https://github.com/omdsh-dev/dsh-mnemon/releases/tag/v0.5.0)
- [Wavect 企业准备度评测](https://wavect.io/blog/deepseek-harness-enterprise-review/)

### 竞争对照来源

- [OpenClaw Releases](https://github.com/openclaw/openclaw/releases)
- [Claude Code Releases](https://github.com/anthropics/claude-code/releases)
- [Codex Releases](https://github.com/openai/codex/releases)
- [OpenCode Releases](https://github.com/anomalyco/opencode/releases)
- [Gemini CLI Releases](https://github.com/google-gemini/gemini-cli/releases)
- [Claude 产品发布说明](https://support.claude.com/en/articles/12138966-release-notes)

---

**信息校验：23 个对象 / 74 条事实 / 34 个数据点 / 34 条判断 / 34 个唯一链接，全部可追溯。**
