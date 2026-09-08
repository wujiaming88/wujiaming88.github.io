---
layout: single
bucket: agent-infra
title: "DeepSeek Harness 0.1.3：Session v2 重写升级合同，生态仍在追赶"
date: 2026-09-08 14:25:00 +0800
categories: [AI]
tags: [DeepSeek, DeepSeek Harness, Agent Harness, AI Agent, Cordis, 插件生态, 开源生态, OpenClaw]
header:
  overlay_image: /assets/images/posts/2026-09-08-deepseek-harness-radar-header.png
---


> **观察范围**：检索截止 2026-09-08 14:20:27（Asia/Shanghai）；主增量时间窗为 `(2026-09-01 14:20:51+08:00, 2026-09-08 14:20:27+08:00]`，最近 7 天回溯窗与主窗基本重合。

DeepSeek Harness（dsh）本期连续发布 `v0.1.3-alpha.1` 与 `v0.1.3-alpha.2`。前者的 tag 指向 `d347e703908d0406b7a7ef80e3a0e594d86b2215`，后者指向 `82a5fd61a7cf5c293cec4bdff68f455398d685e9`，并被标记为 immutable prerelease。与此同时，npm 的 `alpha` 已是 `0.1.3-alpha.2`，但 `latest` 和 `next` 仍停在 `0.1.2-rc.1`；检索截止时，master HEAD 已前进到 `c389f96bf3a9b6807cb71ed6bdad5849be0df6d8`。

这组指针说明，当前至少并存三条不同基线：默认分发、alpha 预发布与未发布主干。试用者如果只说“装最新版”，很容易得到不同结果。更稳妥的做法是锁定 tag 与 SHA，并用独立 home 验证，而不是跟随 master 或直接覆盖旧环境。

本期最重要的变化也不是 Web 增加了多少按钮，而是 Session 的持久化与恢复合同被重写：生命周期作用域的 `SessionHandle`、异步 `agentLoop.create()`、单 Session 进程锁，以及 v2 generation 迁移链一并到来。alpha.1 随即暴露历史 Session 加载性能回退，alpha.2 又集中改善长会话打开、恢复和继续对话时的卡顿与内存占用。可以确认的是官方在快速修复；不能确认的是容量问题已经关闭，因为没有公开 100k-event、P50/P95、内存峰值或跨版本 rollback 基准。

项目阶段也没有改变。官方 README 仍将 DeepSeek Harness 标为 Developer Preview，并明确提示会有兼容性破坏；SAFETY 仍说明项目未经过安全审计，不可视为 secure 或 production-ready。模型生成的命令、第三方插件、网络、进程、凭据与文件仍属于可达风险面，sandbox、approval 和 permission 只能降低风险，不能保证隔离。

## Session v2 改变了什么

alpha.2 的官方 package map 仍有 **49 个 package groups**，没有发现 group 级新增、删除或更名。本期变化发生在组内合同，主链路可以概括为：

```text
Web / SDK / ACP 输入
  → core Agent Loop（create 异步）
  → SessionHandle（生命周期持有）+ 单进程锁
  → JSONL canonical generation
  → v0 → v1 → v2 相邻迁移
  → Assistant attempt settlement
  → projection / cache / query / title / client
```

| 系统层面 | 官方 package groups | 本期变化 |
|---|---|---|
| 产品 API 与 Session 主干 | `core`、`goal`、`schedule`、`feedback`、`identity`、`todo`、`plan`、`session`、`session-query`、`workspace` | `SessionHandle`、异步 loop、进程锁、v2 migration 与 settlement 是 P0 |
| 模型、上下文与编排 | `llm`、`context`、`compaction`、`subagent`、`preset`、`guard`、`jobs`、`workflow`、`experimental` | pi-ai 0.85.1、长会话按需读取、continuable subagent 控制扩展 |
| 执行、文件与隔离 | `subprocess`、`shell`、`terminal`、`code-runtime`、`sandbox`、`fs`、`lsp`、`skill`、`e2b` | SDK/Headless/ACP 默认 read/write/edit；普通 subprocess handle 移除 pid |
| Web、事件与数据载荷 | `web`、`webhook`、`attachment`、`spill`、`storage` | 任意文件上传、图片工具卡、代理变量、断线恢复 |
| 交互、安全配置与扩展 | `interaction`、`credentials`、`settings`、`extensions`、`hooks` | persona 拆为 prefix/suffix，旧配置需适配 |
| RPC、SDK、前后端与启动 | `api`、`typert`、`sdk`、`acp`、`boot`、`host`、`client`、`bundle` | Intel Mac runtime、Windows SDK 修复与 Web “Open in” |
| 工程支撑 | `test-support`、`runtime-diagnostics`、`util` | 测试与诊断设施继续存在，但没有公开生产容量承诺 |

### 从原地状态到相邻 generation

Session v2 不再把升级理解为对一个日志文件原地改写。历史 v0/v1 generation 由静态、相邻的迁移链解码；写入路径在编码与校验后发布 successor，原 source 保留。Assistant 的完整 compact timed stream 进入 `assistant/message`；失败、重试、取消和 stream error 则落入 `assistant/attempt`，Web 仍可以消费进程内 live stream。

这种设计的价值在于，Session 事实源、迁移、projection 与实时 UI 的边界更清楚。失败与重试不再只是运行时瞬态，immutable generation 也有利于回溯和离线校验。但升级成本因此从“改几个 API”扩大为三层：谁持有生命周期、谁能并发打开、历史格式怎样迁移。

风险首先落在第三方插件和运维工具上。同步调用 `agentLoop.create()`、绕过 `SessionHandle`，或者让两个进程同时持有同一 Session 的实现，都可能不兼容。Session lock 也会影响多实例、后台任务、恢复工具和自建索引器。更重要的是，migration 发布成功不等于 title、projection、attachment、schedule、query index 和 telemetry 已全部一致。

因此，升级闸门不能只检查“应用是否启动”。至少应包含：

1. 用脱敏 v0/v1 样本执行只读 open 与 write migration；
2. 核对 generation、hash、事件计数与旧 source 保留；
3. 验证并发锁拒绝、进程崩溃尾部修复、resume 与 fork；
4. 逐项检查 title、projection、attachment、schedule、query 与 telemetry；
5. 保留旧版本只读回滚路径。

在这套闸门通过前，不应让 alpha.2 覆盖现有 home。

> **配图方案｜Session v2 的迁移与恢复链（示意图）**  
> 位置：本节末尾。内容：左侧为 v0/v1 immutable generations，中间为 adjacent migration、SessionHandle 与 lock，右侧为 v2 settlement、projection/title/query/client；下方列出 hash/count、crash recovery、resume/fork 与 rollback 检查。图注应明确：这是基于本报告组件关系绘制的验收示意，不代表官方已提供自动化闭环。替代文本：SessionHandle 和进程锁控制写入生命周期，旧 generation 经相邻迁移生成 v2，迁移后仍需验证 projection、标题、查询与回滚。

## 子代理进入队列控制阶段

alpha.1 将 Agent Team 的 `send_message` 统一为 steer 语义，并在跨 Agent 与冷恢复投递中保留发送者归属和顺序。alpha.2 又让 continuable subagents 支持消息排队、编辑、删除、单条或全部 Steer，以及 Stop。排队消息在 sending 完成前不能被编辑、删除或 steer。

这使子代理从“能继续对话”走向“可以控制队列”，但状态机并没有因此自动可靠。仍需故障注入验证：重复投递、编辑与发送竞争、stop 后拒绝新消息、父会话关闭后的 child quiescence、断线恢复后的队列重放，以及权限继承与 durable attribution。Release notes 没有给出幂等或高可用证明。

对 OpenClaw 而言，值得借鉴的不是某个按钮，而是 durable attempt、sender/order 保留与可控制队列的组合；真正的采用门槛仍是断线、取消、关闭和重放语义能否被测试固定下来。

## 文件、网络与默认工具面

alpha.1 让 Web 支持任意文件上传。文件与图片可以在同一预览区混排，后台上传提供进度和取消，并在会话切换后继续显示；模型通过保存路径调用既有文件工具按需读取。`read_image` 的顶层和 PTC 嵌套调用也能直接在 Web 工具卡渲染图片。

出站请求开始遵循 `HTTP_PROXY`、`HTTPS_PROXY`、`ALL_PROXY` 与 `NO_PROXY`，Python SDK 增加 Intel macOS runtime，模型发现支持自定义 provider 的 `models` 对象和 Anthropic 原生模型列表。alpha.1 还修复了 DeepSeek 流式工具调用续传时 ID 或名称被空值覆盖、Session cache 读取、Windows 盘符根目录和手动暂停目标等问题。

alpha.2 继续升级 pi-ai 到 0.85.1，并增加 Web “Open in”入口与 PTC 命令/输出展开；同时修复 Web 断线恢复、聊天滚动、Windows Python SDK 启动崩溃和部分 Windows/Linux 的进程清理。

这些变化提升了企业网络和跨平台可用性，也扩大了治理范围：上传文件的类型、大小、保留与路径权限，代理信任和 `NO_PROXY` 绕过，模型可读内容与外发目标，都需要独立审查。

另一个兼容点是默认工具变化。SDK、Headless 和 ACP 的文件编辑工具改为 read/write/edit，Web minimal 与 sdk-minimal 保持不变；persona 配置被拆成 prefix/suffix，普通 subprocess handle 移除 pid。read/write/edit 的统一是工具面收敛，不是 sandbox；persona 和 pid 变化则可能让依赖旧常量或进程句柄的插件出现静默退化。

## 插件供给继续加速

本期插件连续台账为 **A=0、B/B-=6、C=5、D=5**。A 仍为 0，并非生态没有代码，而是没有对象同时完成本期宿主实机兼容、权限与数据流审计、断线恢复、供应链闭环和独立生产验证。

| 对象 | 本期证据 | 评级与边界 |
|---|---|---|
| dshmarket 1.45.0 | OIDC trusted publisher、SLSA provenance、signature/integrity、vitest/compat/restart smoke；修复私有 Git 更新识别 | B；市场自身更成熟，但仍不是下游包的信任根 |
| `@xmanrui/dsh-im` 4.15.0 | 九种 IM 与公网 AI Office；签名、build/test/check；显式兼容 alpha.1，未列 alpha.2 | B-；约 18MB，机器人凭据和公网通道构成高权数据面 |
| dsh-cost-meter 1.7.14 | 将 alpha.2 标为 compatible、alpha.1 标为 unknown；公开多供应商网络权限 | B-；兼容矩阵有价值，但余额、API 与凭据需要端点和日志审计 |
| dsh-univer-office 0.2.14 | Apache-2.0；host/integration/client/skills/telemetry tests；协作 Gateway 与 Viewer | B-；产品和测试面清晰，但约 180MB，包含浏览器、libsql、原生与 insiders 依赖 |
| Bridge、Vision Router、Mnemon、pi2dsh | 上期 B/B- 台账延续，未出现可升 A 的独立证据 | B/B-；需要补 alpha.2 实机兼容矩阵 |
| Pocket、dsh-web、旧 unscoped dsh-im、skill-mover、hooks-adapter | 高权远程、身份、兼容或测试闭环仍不足 | C/D；继续暂缓公网与自动采用 |

其中，dshmarket 的 OIDC、SLSA、签名和 restart smoke 是积极信号，但市场只能证明“分发器自身如何构建”，不能替每个下游插件完成权限、来源和撤回审查。`@xmanrui/dsh-im` 已快速跟进 alpha.1，却未列 alpha.2；dsh-cost-meter 则反过来将 alpha.2 标为 compatible、alpha.1 标为 unknown。这种差异正说明，生态兼容不能用一个宽泛 peer range代替，必须具体到 host、plugin、profile 与 Session format。

Univer Office 是本期产品形态最清晰的新对象。它把 inline preview、浮动 Worktree、session-end review、协作 Gateway 与 Viewer 组合起来，说明 client、Session 与工具 seam 已能承载办公工作台。与此同时，约 180MB 包体、Puppeteer、libsql、原生绑定、insiders 依赖和 telemetry 也让它成为更重的 trust boundary，而不是普通 UI 皮肤。

## 工程活动仍未升级为生产采用

案例分级为 **P1=0、P2=0、P3=11、P3→P4=4、P4=1、P5=1**。cost-meter 与 Univer Office 增加了两项 P3：代码、包、测试和集成形态可以核验，但没有客户侧持续运行证据，不能升级为 P1 或 P2。

官方仓在 2026-09-08 14:04+08 的快照为 **215,430 stars、25,417 forks、929 subscribers**。这些数字证明关注度极高，也说明开发者仍在流入；它们不证明 SLA、采购或生产规模。GitHub `dsh-plugin` topic 的宽搜索还混入插件、工具和衍生项目，因此搜索匹配数也不能作为插件总量。

把 P3 升为 P2/P1，至少需要明确使用主体、持续周期、请求或会话规模、P50/P95、故障率、成本、数据处理边界、安全审计或 SLA。当前没有对象同时满足这些条件。

## 垂直产品出现，商业证据没有同步

本期衍生项目分布为 **D1=6、D2=3、D3=3、D4=3**。D1 新增的主要对象是 Univer Office；`dsh-trading`、`dataelement/dsh-desktop` 与 `dsh-web` 继续保持“可复现产品形态、无采用闭环”的边界。Ollama 集成仍是 D2 平台入口，dshmarket 是 D3 市场/开发工具，普通 Fork、旧桥接、拓扑和导出候选仍停在 D4。

商业分层为 **L1=2、L2=4、L3=1、L4=1（排除）**。L1 仍只有官方 Developer Preview/安全状态与 Ollama 官方接入；L2 是 market、desktop、trading 和 Univer Office 的项目方主张；L3 是 Wavect 关于 contained engineering pilot 的独立判断；L4 是与 dsh 项目收入无直接关系的泛 DeepSeek 商业新闻，因此排除。

本期没有发现客户公告、采购合同、收入、融资、SLA 或独立生产指标。可以说产品入口和垂直形态增加，不能说 DeepSeek Harness 已完成商业化。

## 四个判断连在一起

**第一，Session 合同正在成为生态的版本税，确定性高。** 一周内出现 `SessionHandle`、异步 loop、进程锁和 v2 migration；生态中 IM 明确到 alpha.1，cost-meter 明确到 alpha.2，market 的部分 peer 仍在 0.1.2 系列。技术 seam 已被消费，兼容速度却不一致。任何生态评估都应建立 host×plugin×profile×session-format 四维矩阵。

**第二，长会话恢复既是竞争力，也是当前最大的回归面，确定性高。** durable settlement 与 immutable generation 让重试、取消和恢复有更清楚的事实模型；alpha.1 的回退与 alpha.2 的紧急优化又证明该路径仍在高频变化。值得借鉴的是设计，必须先补的是迁移与容量门控。

**第三，市场、IM 与 Office 正把插件体系推向平台，治理没有同步平台化，确定性高。** market 管安装与更新，IM 管公网和机器人凭据，Office 管文档、浏览器、Gateway 和 telemetry。它们都是新的 trust boundary，需要 permission manifest、provenance、端点与数据保留、撤回、rollback 和审计，而不能只依赖官方 sandbox。

**第四，关注度远高于采用证据，确定性高。** stars、发布频率和产品型项目均在上升，P1/P2、客户、采购、收入与 SLA 仍为 0。最合理的策略仍是受控试验与治理工具开发，而不是企业 production 承诺。

> **配图方案｜组合能力与治理责任（示意图）**  
> 位置：本节末尾。左侧绘制 Session、subagent、file/network、profile/bundle，中央放 market、IM、Office 三类入口，右侧对应 permission manifest、provenance、数据保留、撤回、rollback、审计。图注需说明：能力关系来自本报告，右侧为采用所需治理项，不表示官方已经实现。替代文本：插件将安装、消息、文档和网络能力汇聚成平台入口，也同步扩大权限、来源、数据与回滚责任。

## 现在怎么试

### 立即体验

1. 在一次性 VM、容器或独立 OS 用户中，锁 `dsh-v0.1.3-alpha.2` 与 SHA，使用全新 home 和假凭据，不覆盖 rc.1 数据。
2. 准备脱敏 v0/v1 Session 样本，验证只读 open、write migration、generation/hash/count、并发锁、崩溃恢复、resume/fork 与旧版本只读回滚。
3. 只读体验 dsh-cost-meter 的权限 manifest 方法和 Univer Office 的产品形态；不使用真实 API key、敏感文档、远程隧道，也不从市场自动安装未知包。

### 一至两周 Demo

- **Session v2 迁移闸门**：建立 host×profile×format×plugin 矩阵，覆盖 lock、async create、attempt settlement、title、projection、attachment、schedule 与 query。
- **子代理队列故障注入**：对 queue/edit/delete/steer/stop 注入重复、乱序、断线、父会话关闭和恢复。
- **插件权限与数据流预检**：解析 network destinations、credentials、browser/native dependencies、telemetry、retention、scripts、provenance 与 uninstall 残留。

### 值得开发

优先做 migration verifier、兼容矩阵和 rollback，而不是再做一个 UI。架构上可以借鉴 immutable adjacent generations、durable attempts、capability seam 与 profile/bundle；控制面上仍应保留 OpenClaw 更明确的 gateway trust boundary、审批来源语义和故障恢复。

对 dsh 的集成边界也应保持清楚：把它当作受控的外部 runtime 或 adapter，隔离文件、网络、凭据与 Session 数据，不让 Developer Preview runtime 成为 OpenClaw 主控制面的安全根。

### 暂缓与停止条件

继续暂缓 Pocket 公网、IM AI Office、dsh-web SSH/SFTP/tunnel/cron、market 一键安装未知包，以及没有 alpha.2 兼容矩阵的高权插件。

如果 Session migration 无法校验或回滚，进程锁让后台任务死锁，队列断线恢复产生重复副作用，或者 persona/default-tool 变化造成审批或工具面漂移，应停止扩大试点。在出现独立 P2/P1、至少 30 天持续运行、规模、成本、P50/P95、故障与安全边界之前，也不应将其升级为企业选型。

## 下期看什么

1. alpha.2 之后是否进入 rc/stable，npm `latest` 是否切换；
2. Session v2 是否公开 migration verifier、rollback 与 100k-event 基准；
3. Session lock 的多进程、HA 与后台任务语义是否形成正式合同；
4. subagent queue 的幂等、断线重放、stop/close 是否有公开测试；
5. 哪些重点插件显式并实测 alpha.2，而不只是宽 peer range；
6. dshmarket 是否把 permission manifest、撤回、恶意包通知和离线 allowlist 变成强制门禁；
7. Univer Office 是否披露 telemetry、数据保留、Gateway 威胁模型、包体和原生依赖审计；
8. 是否首次出现独立 P2/P1、客户、采购、收入或 SLA。

## 主要来源

### 官方

- [v0.1.3-alpha.1 Release](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.3-alpha.1)
- [v0.1.3-alpha.2 Release](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.3-alpha.2)
- [alpha.1 Tag ref](https://api.github.com/repos/deepseek-ai/deepseek-harness/git/ref/tags/dsh-v0.1.3-alpha.1)
- [alpha.2 Tag ref](https://api.github.com/repos/deepseek-ai/deepseek-harness/git/ref/tags/dsh-v0.1.3-alpha.2)
- [npm metadata](https://registry.npmjs.org/@deepseek-ai%2Fdsh)
- [Package map](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/dsh-v0.1.3-alpha.2/packages/README.md)
- [Architecture](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/dsh-v0.1.3-alpha.2/docs/architecture.md)
- [Session group](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/dsh-v0.1.3-alpha.2/packages/session/README.md)
- [README](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/dsh-v0.1.3-alpha.2/README.md)
- [SAFETY](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/dsh-v0.1.3-alpha.2/SAFETY.md)

### 生态与商业

- [dshmarket v1.45.0](https://github.com/dsh-market/dsh-market/releases/tag/v1.45.0)
- [dshmarket npm](https://registry.npmjs.org/dshmarket/latest)
- [dsh-im npm](https://registry.npmjs.org/@xmanrui%2Fdsh-im/latest)
- [dsh-cost-meter npm](https://registry.npmjs.org/dsh-cost-meter/latest)
- [dsh-univer-office npm](https://registry.npmjs.org/dsh-univer-office/latest)
- [dsh-pocket latest release](https://api.github.com/repos/shaobeichen/dsh-pocket/releases/latest)
- [Ollama integration](https://docs.ollama.com/integrations/deepseek-harness)
- [Wavect enterprise-readiness review](https://wavect.io/blog/deepseek-harness-enterprise-review/)
- [DeepSeek Harness product page](https://deepseek.com/harness/en/)
- [Official repository API](https://api.github.com/repos/deepseek-ai/deepseek-harness)
