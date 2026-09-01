---
layout: single
bucket: agent-infra
title: "DeepSeek Harness 体验在变好，但当前仍应停在隔离 PoC"
date: 2026-09-01 14:24:00 +0800
categories: [AI]
tags: [DeepSeek Harness, AI Agent, Agent Harness, 开源生态]
header:
  overlay_image: /assets/images/2026-09-01-deepseek-harness-radar.png
---

DeepSeek Harness（DSH）在 `v0.1.2-alpha.2` 到 `v0.1.2-alpha.3` 之间，确实把一些最影响使用感受的链路往前推了一步：Remote 连接的错误更可见、重连能力更完整；运行中和排队中的图片可以可靠回显、投递；持续子代理的 follow-up 能带图片；长会话可以预览并跳到尚未加载的 turn。官方版本、Tag 与 HEAD 已对齐到 `dd6322d604e00eec1ba5e0c8541159906a21094a`，对应 `dsh-v0.1.2-alpha.3`。但这不是可以放宽采用条件的信号。alpha.3 同时移除了 SQLite Session 后端，旧内容虽不会被删除，却需要在旧版本导出；官方没有承诺自动读取、迁移或回滚。[Release 与提交记录](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.2-alpha.3) [提交](https://github.com/deepseek-ai/deepseek-harness/commit/dd6322d604e00eec1ba5e0c8541159906a21094a)

这构成了当前最重要的采用判断：**体验在变好，但 SQLite 迁移与生态治理决定 DSH 仍只能作为锁版、隔离的 PoC。**它仍处在 Developer Preview，官方明确会发生兼容性破坏、尚未安全审计，不能被当作 production-ready。连续 alpha 并不等于稳定承诺。[README](https://github.com/deepseek-ai/deepseek-harness/blob/master/README.md) [SAFETY](https://github.com/deepseek-ai/deepseek-harness/blob/master/SAFETY.md)

本次跟踪报告日期为 **2026-09-01（Asia/Shanghai）**；主增量窗为 **2026-08-28 14:23:20（不含）至 2026-09-01 14:20:51（含，UTC+8）**，另以 **2026-08-25 14:20:51 至 2026-09-01 14:20:51（UTC+8）** 作为 7 天补漏窗。以下“改善”均为官方发布声称：本轮没有安装第三方插件或二进制，也没有完成 SQLite export/import、长会话 benchmark、Remote/WS 故障注入、图片/子代理竞态、安全审计或客户侧生产核验。因此，生产性结论仍需独立测试。

## 版本在前进，默认安装却未跟上

本期最新 immutable prerelease 是 `v0.1.2-alpha.3`，Release 时间为 **2026-08-31 16:03:39 UTC**；Tag 为 `dsh-v0.1.2-alpha.3`，Release 合并提交、Tag 和 HEAD 都指向同一 SHA。该提交未签名。与上期 `v0.1.2-alpha.1` / `dsh-v0.1.2-alpha.1` / `cd5ef8148158c3a752a658978873241fdf8e2bbc` 相比，本期对象为 `v0.1.2-alpha.3` / `dsh-v0.1.2-alpha.3` / `dd6322d604e00eec1ba5e0c8541159906a21094a`。

分发面还有一个容易被忽略的分叉：npm 的 `alpha=0.1.2-alpha.3`，但 `latest=next=0.1.1-rc.2`。这意味着不带 tag 的默认 `npx` 不会取得 alpha.3；复现和测试都必须显式 pin 版本与 SHA，而不能把“默认安装成功”当作已测到本期版本。[npm 包页](https://www.npmjs.com/package/@deepseek-ai/dsh)

## SQLite 是 P0：升级前先证明可以回来

alpha.3 对 Session/Persistence 的变化，是本期最强的破坏信号。官方只承诺既有 SQLite 内容不会删除，并要求用户使用旧版本导出；没有承诺 alpha.3 自动读取、迁移或回滚。当前 shipped backend 回到按 Session 写入的 append-only JSONL，并配合 checkpoint 与 projection cache。因而 SessionPersistence provider 的变化会沿着 checkpoint、projection、query、resume，继续影响 Profile、第三方会话插件、桌面发行、Bridge 和 OpenDesign 等上层产品。

迁移的门槛应当是可验证的恢复流程，而不是一次就地升级：冻结写入，备份原始 SQLite，在旧版 export；再校验 turn、tool、attachment、title、schedule 的计数与 hash；随后在目标版本 import、resume、compact，并保留回退阅读路径。任一步失败，就不应升级。这里的 P0 不是性能优化项，而是数据可恢复性的前置条件。

事件契约同样没有冻结。`SessionEvent.ignorable` 在 alpha.1 被移除、在 alpha.2 恢复；alpha.1 到 alpha.3 的 replay 和所有 consumer 都要容忍字段存在、缺失或变化。这个事实与 SQLite 移除结合，意味着跨版本 event replay、unknown/missing field 测试不能省略。

## 体验改进集中在连接、图片与长会话

Client/Remote 增加了连接失败状态、自动 retry、立即 reconnect 和统一的 `RemoteError`；alpha.3 还修复了把 host stall 误判为断线的问题。它们提高了错误可见性与恢复体验，但官方没有公开退避策略、retry budget、幂等键、断线重放、WebSocket 半开探测或 backpressure 语义。因此，不能把“有自动重连”写成高可用证明。

更合适的验证方法是在 tool result、queued image、subagent follow-up、cancel/close 边界，注入 host stall、DNS/TCP/WS close 与代理错误，检查是否出现重复、丢失、乱序，或取消后复活。没有这类独立结果，Remote 的幂等、重放、半开连接和容量边界仍未得到证明。

图片链路正在变得完整：Client composer 追加或排队图片，图片成为 durable local attachment，经由 Session event/checkpoint 进入 active conversation 或 continuable child 的 follow-up，再经 Remote event delivery 送达 Client 回显和分页渲染；无扩展名图像会按内容识别。与此同时，解析、路径、持久化和模型外发面也被放大。验证应覆盖取消、重试、切换 Session、父子权限、无扩展名文件欺骗、解码资源上限、磁盘配额、删除，以及对模型外发的告知。

长会话的变化也值得肯定：未加载分页 turn 可以预览、跳转，配合内存下降和代码高亮响应改善，方向上是在用 outline/projection 与按需分页降低 DOM 和高亮的常驻成本。但“可以导航”不等于无限容量。建议用 1k、10k、100k event、100 images 与密集 live message，记录首次可交互时间、P50/P95 跳转、heap、CPU、掉帧、重连与 resume；在这些数据出现前，不应承诺长会话 SLA。UI 对 token/耗时的展示增强了可观测性，也没有替代容量或 P95 证据。

## 模块矩阵：开放 seam 清晰，成熟度并不均匀

DSH 的 Cordis / Loader / Profile / Bundle 提供 Context、typed events、reversible effects 和 Profile 组合，本期没有已验证的核心语义变化。但 in-process 插件仍是可信代码，且 Profile 的整块替换配置风险持续存在。Session core 使用 append-only `SessionEvent` 与 `ctx.sessions`；持久化/投影使用 `ctx.sessionPersistence`、JSONL provider、checkpoint、projection cache，正是 SQLite 移除与长历史优化发生的位置。[官方 packages map](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/README.md)

Agent / Agent Loop 负责 turn/step、模型请求、工具执行和取消，本期没有重大契约变化；waterfall、取消与持久化排序仍需压力测试。LLM / Context / Compaction 覆盖 adapter、stream、history、token/耗时；Tools / PTC / MCP 覆盖 Tool registry、`run_code` 和 MCP mounts。PTC 收窄入口不等于 OS 级隔离，MCP 仍需要 timeout、output 与 egress 控制；本期没有已验证的 PTC OS sandbox 新证明。

Attachment 使用 `ctx.attachments` 和 durable local image；Subagent 使用 `ctx.subagents`，包括 one-shot/continuable、follow-up/report。两者的图片改进不能替代对父子权限、生命周期、取消和失败归因的独立验证。Client / Remote 是 browser-host RPC、Connection 与 `@Remote` 的边界；Conversation UI 负责 pagination、outline、render/highlight。Sandbox / Approval / Credentials 的阶段声明未变，官方明确不能保证隔离，不能作为唯一安全边界。

Scheduling / Jobs / Telemetry / Eval 涵盖 timer/job、Session telemetry 和 OTel，本期没有重大高可信变化，仍缺 HA、公开产品级 eval 与企业留存/删除承诺。SDK / ACP 是 stdio JSON-RPC，覆盖 session/model/MCP/permission/cancel；trusted controller 边界以及取消、关闭的原子性仍需验证。整体看，架构 seam 清晰、体验修复快，但存储迁移、安全审计、Remote 失败语义、长会话容量、插件 ABI 与企业治理尚未闭环；这一工程成熟度判断为高确定性。

## 生态扩大了入口，也扩大了治理成本

插件评级没有因为目录更热闹而上调：**A 级为 0**，因为没有对象完成独立代码全审加隔离安装/启动；B/B- 是 Bridge 0.3.1、Vision Router 2.0.1、dsh-web 单项、pi2dsh 0.24.0、dsh-mnemon 0.4.4，它们有分发、文档、测试或 peer 证据，但仍只适合隔离评估。C 级包括 MCP connector、memory-connect、autogate 和 dsh-plugin-hub（`dsh-plugin` 1.4.1）：身份可查，权限、兼容或供应链缺口仍明显，市场不能替下游包背书。D 级为 ACN、session-export、topology、dsh-skill-mover、hooks-adapter，原因是停滞、身份/分发不闭合、旧 ABI 或高权执行面，当前应暂停采用。[dsh-plugin-hub](https://github.com/dshplugin/dsh-plugin-hub)

版本兼容迹象也不整齐。Bridge 已把关键 peer 扩到 alpha.1 并有 SLSA provenance；pi2dsh 与 mnemon 也跟随 alpha.1；Vision Router 的关键 peer 仍停在 rc.1。GitHub Topic 主窗内有 push 的 `dsh-plugin` 仓库约 **3,074**（14:20 搜索快照），这只能作为高噪声发现指标，不能当作有效插件数或增长率。

Skill Mover 会读取并复制多个 Agent 的技能文件，Hooks Adapter 会复用 shell/webhook/oracle/proxy 配置。两者是信任边界转换器，不是普通 UI 插件：命令、URL、脚本与配置复用都会扩大执行面。因而不能因为它们降低迁移摩擦，就绕过审查。

## Ollama 与衍生项目说明了什么

Ollama 的官方文档提供 `ollama launch dsh`，是本期最强的外部入口信号；但其 web search 需要 cloud access，不等于离线企业方案。[Ollama integration](https://docs.ollama.com/integrations/deepseek-harness)

衍生项目显示交付层正在承接开放边界，但也能看见版本锁的成本。OpenDesign 0.21.1 是 D1 原生垂直产品，提供 macOS/Windows 资产与实验性的 Design Harness Labs，垂直包装较强，却持续面对实验状态和版本锁摩擦。[OpenDesign](https://github.com/nexu-io/open-design/releases) DeepSeek Harness Desktop 0.10.0 是 D1 桌面发行，有多平台安装资产；分发事实可核，安全、留存与稳定尚未核验。[DeepSeek Harness Desktop](https://github.com/dsh-tauri-desk/deepseek-harness-desktop/releases)

DSH Desktop 2.0.4 是另一 D1 桌面发行，适配 alpha.1，并把 LAN 改为 HTTPS+token：它反映出对上游响应快，也坐实 breaking change 的成本。[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop/releases) dsh-launcher 0.5.0 是 D2 Windows 交付层，提供 Windows asset 与 sha256，仍需要审查更新、来源和权限。[dsh-launcher](https://github.com/Wanbinyu/dsh-launcher/releases) dsh-sev 0.3.4 是 D1 边界远程层，本窗没有新 release；“安全审计 PASS”只是项目方主张，不是独立审计。

`dsh-skill-mover` 与 `hooks-adapter` 是 D2 的迁移/兼容项目，跨 Harness 迁移资产和行为，降低迁移成本，也扩大命令/URL/脚本信任面。[dsh-skill-mover](https://github.com/mjylfz/dsh-skill-mover) [hooks-adapter](https://github.com/JohnXu22786/hooks-adapter) `dsh2opendesign` 同为 D2 适配修补，通过修改白名单绕过版本锁；它一手暴露 ABI 摩擦，因此不建议生产环境绕过供应商边界。

## 没有生产案例，也没有商业闭环

案例分级保持克制：**P1 生产为 0，P2 公开试点为 0**，本轮未发现；P3 为 **9**，P3→P4 为 **4**。P3 主要是本地 Web/Remote、ACP 互操作、Bridge 迁移、Vision Router、多项 dsh-web、MCP、pi2dsh、mnemon 与插件市场等开发者 Demo。P3→P4 包括 Skill Mover、Hooks Adapter、ACN、topology：有源码或主张，但缺持续维护、分发、独立复现或安全闭环。

没有发现客户侧 SLA、持续时长、TCO、P50/P95、并发、故障率、安全评估或业务复盘。已验证的商业相关事实只有 Ollama 官方集成页、OpenDesign、两类 Desktop 和 Launcher 的公开 release/资产，它们说明产品化和交付投入存在。插件市场的收录/精选/无遥测、dsh-sev 的“安全审计 PASS”、Skill Mover 的 14 平台、Hooks Adapter 的测试与兼容，都是项目方主张，不能升级为独立事实。

本轮也未发现 DSH 专属付费/生产客户、采购/招标/合同、DeepSeek 与生态项目双方合作公告、融资、专门招聘、监管文件、收入、SLA、TCO、留存或客户侧性能指标。因此商业阶段仍是 **P3 产品化信号，而不是交易闭环**；融资、合作、客户类结论必须保持零推断。

## 四个交叉判断：功能共振不等于可采用

**第一，开放插件与 Remote 边界已经被交付层承接，治理却落后。**Profile/Bundle、Client/Remote、Skill、Attachment/Subagent 都有清晰扩展 seam；Ollama、Desktop、Launcher、市场以及 Skill/Hook 兼容层快速出现。可得性提升是真共振，但当前缺的是制品签名、精确权限、出站目的地、撤销、迁移和审计，而不是更多市场条目。确定性高。

**第二，Session 技术路线与生态升级需求发生背离。**SQLite provider 被删除、`SessionEvent.ignorable` 移除后又恢复；Bridge、Desktop、OpenDesign、dsh2opendesign 又都依赖会话、Remote、Profile 或显式暴露版本锁。上游快速收敛正在把迁移、回滚与白名单维护成本转嫁给生态。短期最值得开发的不是新 UI，而是版本矩阵、导出/恢复验证与受管兼容层。确定性高。

**第三，长会话与图片体验形成技术共振，但没有采用数据。**分页导航、内存/高亮、排队图片和持续子代理图片都在改善；Vision Router、mnemon、pi2dsh 正好需要多模态、长期上下文与子代理链。方向与需求匹配，但 P1/P2、P95、容量、成本和安全数据仍为零，所以目前只能做受控验证。确定性中高。

**第四，商业叙事明显领先于生产证据。**README/SAFETY 仍写明 Developer Preview、未审计；npm `latest` 仍停在 rc.2。桌面资产、市场与集成增加，但没有客户、采购、SLA 或独立生产指标。关注度与产品化真实，商业转化尚未证实。确定性高。

## 对比成熟 Coding Harness，差距仍在治理与失败边界

与 OpenClaw、Claude Code、Codex、OpenCode、Gemini CLI 的本窗官方发布相比，DSH 的优势仍是 Cordis 驱动的可替换 Runtime 和开放组合。差距集中在：Claude Code 的不可被项目配置放宽的 Restricted 模式与路径/设置安全修复；Codex 的 MCP 输出上限、timeout、可信 origin/no-redirect 与 sandbox 修复；OpenClaw 的精确制品/能力审阅、目的地受限 secret proxy 与可撤销自动化授权；OpenCode 的企业身份、可恢复 subagent、权限续传和 retry storm 限制；Gemini CLI 的 eval、取消原子性、capacity/timeout 失败分类。

因此，DSH 更适合作为开放 Runtime 编排与插件实验平台，不适合无约束地替代成熟 Coding Harness。该位置判断为中高确定性。

## 现在该做什么，以及什么情况下停止

立即体验时，应显式 pin `0.1.2-alpha.3` 与 SHA，只在独立 VM、假凭据和脱敏数据上运行；不要把无 tag 的默认 `npx` 当作 alpha.3。可用一个脱敏长会话验证分页、token/耗时、重连与图片 follow-up，并记录 P50/P95、内存、重复与漏投。

72 小时内应完成三项受控 Demo。其一，SQLite 迁移恢复实验：旧版 export → alpha.3 import/resume → 回退阅读；成功标准是 turn/tool/attachment/title/schedule 全量一致，**任一丢失或不可逆即停止**。其二，Remote 故障注入：host stall、DNS/TCP/WS close、代理 502、cancel/close；成功标准是 **0 重复副作用、0 丢事件、取消不复活，否则停止**。其三，Restricted Profile 原型：禁 shell/PTC/public WebFetch，固定 workspace fence、插件 allowlist、子代理不得放宽策略；成功标准是 **30 个越权/路径/子代理用例全拒绝**。

值得投入的方向是版本/ABI/迁移兼容矩阵与 Profile semantic diff；Session export/import/verify/rollback 工具；插件精确制品、provenance、权限、网络目的地和撤销审计；以及 ACP/MCP/Remote 的 output cap、timeout、trusted origin、redirect policy 与 cancel/close 幂等。对 OpenClaw 可以借鉴 Cordis seam 与 Profile 组合，但应避免整块配置替换、trusted controller 和“市场即信任”。

合作上可跟踪 Ollama、OpenDesign、Bridge、pi2dsh、mnemon 的维护者；触发条件应是明确 alpha.3 兼容、可复现测试、制品 provenance，且至少一个独立 P2 使用方。在此之前，不建议未演练 SQLite 导出的 alpha.3 原地升级；不建议生产使用 dsh2opendesign 白名单修补、Skill Mover 自动迁移和 Hooks Adapter 高权复用；也不应把插件市场精选、Stars、下载或项目方“审计 PASS”当作安全或商业证明，更不能对外承诺多租户、企业 SLA、生产稳定性或客户采用。

## 仍待回答的问题

下期应持续核验：Developer Preview/未审计是否出现稳定版、接口冻结、迁移指南与安全审计信号；SQLite 移除是否有官方导出/导入文档、兼容读取、回滚与第三方产品处理；`ignorable` 是否稳定、跨版 replay 是否可靠；Web/Remote 的 token、SSRF、重连是否具备 TTL/原子兑换、DNS/redirect/proxy/metadata fuzz 与 retry 幂等保障。

同样需要确认 PTC worker 是否进入 OS sandbox；插件元数据、Session upload、OTel 三个数据面是否有 schema、脱敏、地域、留存、删除与独立开关；ACP/MCP trusted controller 是否有 route pin、cancel admission、rollback、close quiescence；Bridge、Vision、dsh-web、pi2dsh、mnemon 是否真正运行兼容 alpha.3；Skill/Hook 迁移是否形成新 ABI、registry、测试与默认拒绝 shell/webhook；ACN/session-export/topology 是否有 canonical release，第三窗无恢复则继续保持 D；以及是否出现首个独立客户/试点、成本、P95、并发、故障率和持续使用证据。

## 来源

1. [DeepSeek Harness Releases](https://github.com/deepseek-ai/deepseek-harness/releases)
2. [alpha.3 Release](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.2-alpha.3)
3. [alpha.3 Commit](https://github.com/deepseek-ai/deepseek-harness/commit/dd6322d604e00eec1ba5e0c8541159906a21094a)
4. [README](https://github.com/deepseek-ai/deepseek-harness/blob/master/README.md)
5. [SAFETY](https://github.com/deepseek-ai/deepseek-harness/blob/master/SAFETY.md)
6. [npm `@deepseek-ai/dsh`](https://www.npmjs.com/package/@deepseek-ai/dsh)
7. [Packages map](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/README.md)
8. [Ollama integration](https://docs.ollama.com/integrations/deepseek-harness)
9. [OpenDesign releases](https://github.com/nexu-io/open-design/releases)
10. [DeepSeek Harness Desktop releases](https://github.com/dsh-tauri-desk/deepseek-harness-desktop/releases)
11. [DSH Desktop releases](https://github.com/anywhere-labs/dsh-desktop/releases)
12. [dsh-launcher releases](https://github.com/Wanbinyu/dsh-launcher/releases)
13. [dsh-plugin-hub](https://github.com/dshplugin/dsh-plugin-hub)
14. [dsh-skill-mover](https://github.com/mjylfz/dsh-skill-mover)
15. [hooks-adapter](https://github.com/JohnXu22786/hooks-adapter)

> 信息校验：14 个对象 / 52 条事实 / 14 个数据点 / 25 条判断 / 15 个唯一链接，全部可追溯 ✅
