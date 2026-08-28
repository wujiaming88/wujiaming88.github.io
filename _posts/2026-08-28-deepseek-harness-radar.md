---
layout: single
bucket: agent-infra
title: "DeepSeek Harness 全景跟踪 · 0.1.2-alpha.1 与开放 Runtime（2026-08-25—08-28）"
date: 2026-08-28 14:48:00 +0800
categories: [AI]
tags: [DeepSeek, DeepSeek Harness, Agent Harness, AI Agent, Cordis, 插件生态, 开源生态, OpenClaw]
header:
  overlay_image: /assets/images/posts/2026-08-28-deepseek-harness-radar-header.png
  overlay_filter: 0.20
  caption: "DeepSeek Harness：开放 Runtime 加速成形，治理、恢复与生产证据仍待补齐"
excerpt: "DeepSeek Harness 进入 0.1.2-alpha.1：Profile、ACP、Remote 与子代理路由加速收敛，桌面发行和远程 worker 开始出现，但安全审计、兼容治理与真实生产采用仍明显滞后。"
toc: true
toc_sticky: true
---

# DeepSeek Harness 0.1.2-alpha.1：开放 Runtime 加速成形，生产证据仍缺席

- **观察窗口**：2026-08-25 14:10—2026-08-28 14:23（UTC+8）
- **补漏窗口**：2026-08-21 14:00—2026-08-28 14:23（UTC+8）
- **当前版本**：`v0.1.2-alpha.1` / `dsh-v0.1.2-alpha.1` / `cd5ef8148158c3a752a658978873241fdf8e2bbc`

DeepSeek Harness（下文简称 dsh）本期最重要的变化，不是又多了几个工具，而是它开始从“Everything is a Plugin”的内核主张，收敛成一套更清楚的开放 Runtime：应用统一通过 Profile 启动，SDK 与 ACP 有了正式的应用 Bundle，旧 ApiProxy 被 `@Remote` 替代，子代理的模型选择进入授权控制，桌面发行、垂直工作流和远程 worker 也开始出现在社区。

但这并不意味着 dsh 已经跨过生产门槛。版本从 `0.1.1-rc.2` 进入了新一轮 `0.1.2-alpha.1`；官方仍明确标注 Developer Preview，警告未来会有兼容性破坏，并在 [SAFETY](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/cd5ef8148158c3a752a658978873241fdf8e2bbc/SAFETY.md) 中写明：项目尚未接受安全审计，不应被视为安全或 production-ready，sandbox、approval 和 permission 也不能保证隔离。

因此，本期的准确判断是：**架构和分发能力正在快速成形，治理、恢复和真实采用证据仍明显滞后。** 适合锁定版本、放进隔离环境做受控 PoC；不适合直接承诺企业 SLA。

## 新版本先解决“怎么组成一个 dsh”

[`v0.1.2-alpha.1`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.2-alpha.1) 于 2026 年 8 月 27 日 17:06:37 UTC 发布，Release、Tag 与仓库 HEAD 均指向 `cd5ef8148158c3a752a658978873241fdf8e2bbc`。合并提交时间为 16:57:43 UTC。官方 [README](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/cd5ef8148158c3a752a658978873241fdf8e2bbc/README.md) 仍保留 Developer Preview 与 breaking changes 警告。需要注意的是，截至 8 月 28 日 14:23（UTC+8），npm 的 [`@deepseek-ai/dsh` latest](https://registry.npmjs.org/@deepseek-ai%2Fdsh/latest) 仍是 `0.1.1-rc.2`。GitHub 已有 alpha Release，不等于默认 `npx` 路径已经拿到同一版本。

本期的架构收敛集中在 Profile 与 Bundle。按照官方 [Architecture](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/cd5ef8148158c3a752a658978873241fdf8e2bbc/docs/architecture.md)，正式模板有五个：

```text
dsh CLI + app-boot
├─ web        = dsh-base → dsh-web-app
├─ headless   = dsh-base → dsh-headless
├─ sdk        = dsh-base → dsh-sdk-app
├─ acp        = dsh-base → dsh-acp-app
└─ sdk-minimal = dsh-sdk-minimal
```

`web`、`headless`、`sdk` 和 `acp` 共享 `dsh-base`，因而复用模型适配器、工具、持久化、sandbox/approval、settings、credentials 与 telemetry。`sdk-minimal` 是明确的例外：它不加载 base，只保留两项工具与未压缩 JSONL，并使用 `danger-full-access`。这里的“minimal”表示能力树更小，不表示安全边界更强。

配置按 bundle、Profile patch、Home patch、命令行 patch 的顺序叠加。风险在于：patch 按 row id **整块替换 config**，不是字段级深合并。旧环境中的 override 可能在升级后静默遮掉新增默认值。采用方需要保留 `--dump-config` 快照，并在每次升级时做语义 diff，而不是只看进程能否启动。

不同入口的生命周期也更明确。Headless 没有 server，stderr 输出进度，stdout 只保留最终结果；SDK 和 ACP 使用 stdio JSON-RPC，stdout 只能出现协议数据。私有 executable 或 direct-config 入口不再属于受支持路径，这提高了应用架构的一致性，也把兼容检查集中到了 Profile、Bundle 与 patch。

## Session 仍是整套系统的事实源

在 dsh 中，Session 不是聊天记录的附属品。官方架构要求：任何模型可见内容都必须能从日志重构。UI、fork、resume、transcript、telemetry、compaction 与 persistence 都从同一事件流派生。

本期优化了 Session 初始化和磁盘占用，并为日志尾部截断加入自动修复、警告和受影响会话标识。这些改动能改善大日志场景，却也提高了 snapshot 与增量事件边界的重要性。修复逻辑必须证明只删除不完整的尾记录，不会吞掉最后一条合法事件；重连时也要验证是否发生重复、遗漏或乱序。

SQLite 的迁移和回滚风险仍未得到通用解决承诺。上期已经出现过不兼容数据格式，本期 Release 没有宣布关闭这一问题。任何从 rc.2 到 alpha.1 的升级，都应先做离线备份、导出、恢复、旧库拒绝路径和回滚演练。

图片链路也更偏产品化：图片先显示，再在后台压缩上传；压缩后的图片占用进入预算，Trajectory 可以展示用户、助手与工具结果中的图片。这是明显的体验提升，但属于 optimistic UI，需要处理上传失败、取消、重复发送、切换会话和本地路径泄漏。若模型拿到本地图片路径，必须确认它只能读取允许范围，不能借此枚举 DSH_HOME 其他内容。

## Agent 主链没有变，控制面变得更清楚

核心调用链仍然是：Profile 解析出 Cordis 插件树，Agent 从 inbox 领取输入，组装 prompt 与工具 schema，写入持久 Session 事件，再进入 `agent/request → llm/stream`；工具调用依次经过 `tools/pre-execute`、execute 和 `tools/post-execute`，随后继续下一步或结束 turn。

本期真正变化的是协议和能力控制。

### ACP 从接口占位走向可用控制面

ACP 现在覆盖标准 Session 新建、列表、恢复、关闭，模型与 reasoning effort 设置，MCP，permission，prompt、cancel 与 update。一次 prompt 内的 provider、model 和 effort 会被固定；并发配置变化只影响下一轮。关闭会话时，系统应先阻止新工作，再取消 admission 与 Agent，等待 update 和 descendant 收敛，最后刷新持久化。

这使 ACP 足以支撑受控自动化，但不能把它误写成身份系统。官方边界是：ACP client 被视为 trusted controller，`authenticate` 立即成功；MCP 的 command、env、URL 和 header 都由这个控制者授权。ACP 目前也缺少 deletion、fork、load、terminal 等表面，远程子代理主要仍是 one-shot。对企业集成而言，必须测试同 Session 重入、prompt/cancel 竞态、MCP 部分失败回滚、close 幂等和断连后的 quiescence。

### 子代理能选模型，但只能在授权内选

子代理启动现在可以指定 provider、model、reasoning effort 和最大输出。Agent 可以在预先配置的授权范围内选择；provider 不支持某项能力时，正确行为是启动即失败，而不是静默忽略。

in-process 与 dsh SDK provider 支持这组 agentOptions；ACP、Codex、Claude Code provider 当前不接受每次调用的 route override，不过 Codex 与 Claude Code 的 Bundle 可以配置模型。这一设计优于“任何子代理都能随意换路由”，但父级策略能否在 resume、fork、ACP、插件和外部 CLI 路径中保持不降级，仍需要单独证明。

### PTC 收窄了调用面

Code Mode 已更名为 PTC，旧会话记录仍可读取。PTC SDK 功能不再作为普通 model-callable tools 暴露，只能在 `run_code` 内调用。这能减少工具 schema 污染和双重入口，但不代表 worker 沙箱已经安全。旧日志 replay、fork/resume、compaction，以及 `run_code` 内部调用是否继续受到相同的 permission、timeout、network、filesystem 和 output 限制，都要回归。

## Web 安全一进一退

本期对网络 Web UI 加入了 launch URL 一次性 token。这比裸露控制面向前走了一步，但它是一张启动票据，不是完整 IAM。采用方仍需验证 token 熵、TTL、第一次使用是否原子失效、并发重放、browser history、Referer、proxy/access log、shell history，以及兑换后 WebSocket 是否绑定正确会话。多用户、RBAC、SSO、审计、CSRF 和 TLS 并不会因为有 token 自动出现。

与此同时，public WebFetch 默认启用，公网请求不再逐次审批，官方称带 SSRF 防护。体验改善的代价是：风险从“人工看每个 URL”转移给地址分类与连接实现。测试至少要覆盖十进制/八进制/十六进制 IPv4、IPv4-mapped IPv6、link-local、ULA、DNS rebinding、CNAME、每跳重定向、代理环境变量、URL userinfo、云 metadata、Kubernetes service 与校验后连接的竞态。

ApiProxy 则完成了硬迁移：旧接口已经删除，Web/SDK 统一改为 `@Remote` gateway 和 controllers。插件与客户端不能继续依赖隐式 fallback；需要扫描旧 imports、生成类型、API hooks 和 mocks，并验证重连后的 snapshot+incremental 顺序、幂等、backpressure 与 heartbeat timeout。

## 数据外发现在有三套开关

官方 DeepSeek adapter 默认随请求附带启用插件的包名和版本，部署方可以关闭；Session 日志增量上传是 opt-in、默认关闭。它们与 OTel telemetry 是三个独立数据面，不能用一个“遥测开关”概括。

插件名和版本可能暴露内部软件资产与漏洞面；Session 日志可能包含用户输入、工具参数与结果、路径、附件、模型输出和操作轨迹。企业基线应明确配置三者，并在 adapter 边界做字段级抓包、allowlist、脱敏、重试去重、跨 Session 隔离、留存与删除验证。

Settings 还允许插件注册 provider 登录控件。这能扩展模型接入，也给凭证钓鱼和插件劫持增加了入口。登录控件应带清晰来源标识，凭证服务需要能力隔离，未经信任的插件不能直接进入真实凭证环境。

## 跨平台能力在进步，实机门槛仍在

本期修复了持久 PowerShell 过早启动或输出不全、Linux Bash 管道提前返回空结果、macOS 多子进程卡顿和 Windows 特殊路径截断。Python SDK runtime 也新增 Windows x64 发行物。

这些变化说明跨平台工作持续推进，也说明 PTY 生命周期仍处于高变动区。Windows 发行物存在，不等于 Windows 已全面生产就绪。至少需要覆盖 Windows 10/11/Server、PowerShell 5/7、Unicode/长路径/UNC、ConPTY resize、CTRL_C/CTRL_BREAK、stdin EOF、node-pty 原生闭包、ACL restricted token、临时目录、进程树与 wheel 完整性。

## 插件生态：供给快于兼容治理

截至 8 月 28 日 14:23，GitHub 搜索 `topic:dsh-plugin pushed:>2026-08-25T06:10:00Z` 约返回 2,792 个仓库。这只表示仓库贴了 Topic 且在主窗口有 push，不能当作有效插件数量，更不能与上期 11,432 个全 Topic 总量直接计算增长率。

本期复核了 11 个重点对象，没有一个达到 A 级。原因并非它们都不可用，而是本次没有安装未知包，也没有完成“代码全审 + 隔离启动”双门槛。可进入隔离评估的 B/B- 候选只有五个：

| 候选 | 当前状态 | 采用边界 |
|---|---|---|
| [Bridge](https://github.com/Totoro-qaq/dsh-plugin-bridge) | 0.3.0；OIDC provenance；verify较完整 | 读写和迁移跨 preset Session，需验证alpha.1 Remote与会话兼容 |
| [Vision Router](https://github.com/ysr666/dsh-vision-router) | 2.0.1；测试丰富 | 图片外传、截图、HTTP、Puppeteer、自更新面大；官方视觉增强后先确认是否仍有缺口 |
| [dsh-web](https://github.com/zhu1090093659/dsh-web) 单项 | 聚合版0.3.6；多个可分装包 | SSH、remote UI、launcher、doctor、market权限差异巨大；全家桶只给C级 |
| [pi2dsh](https://registry.npmjs.org/pi2dsh/latest) | npm 0.21.0；118 files、约17MB；强verify | 运行未修改Pi扩展，文件/进程/网络/凭证风险不能整生态继承信任 |
| [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) | 新增0.3.4；显式peer alpha.1 | 三层记忆读取会话与项目文档，需测试poisoning、删除、迁移和provider数据出境 |

其他对象更适合缺口驱动或暂停：

- [dsh-mcp-connector](https://github.com/duhu2000/dsh-mcp-connector) 为 0.2.26，支持 stdio/HTTP/OAuth/API key，但 peer 中仍有旧版本和通配；优先用官方 MCP client。
- [dsh-memory-connect](https://github.com/Asher-2000/dsh-memory-connect) manifest 为 0.6.1并改用 scoped 名，常见非 scoped registry 仍 404，peer 锁旧 RC，不应从 Git 直装。
- [autogate](https://github.com/wangxing-git/dsh-autogate) 为 0.2.0，把模糊操作交给外部 LLM，处于 approval 关键链，却没有误放/误拒和独立红队数据。它只能提供建议，不能成为安全边界。
- [ACN](https://github.com/acnlabs/dsh-plugin-acn)、session-export 与 [topology](https://github.com/qidiai/dsh-contrib-topology) 出现停止、不可分发或身份不清信号。session-export 的 canonical 仓库与 npm maintainer 对不上，三者暂不建议采用。

社区正在加速发布，兼容压力也同步增加。Bridge、Vision、MCP connector、memory-connect、dsh-web 与 pi2dsh 在三天内快速迭代；不少 peer 仍锁 rc.6/rc.7/rc.8，或者直接使用 `*`。alpha.1 已经删除 ApiProxy、重构 Remote，能编译或能安装都不能代表语义兼容。

## 案例仍停留在开发者验证

本期依然没有找到由真实使用方独立确认、带连续运行、业务指标和安全范围的 P1 生产案例，也没有具名团队公开范围、周期与复盘的 P2 试点。

官方本地 Web harness、ACP 互操作、Claude Code/Codex 子代理、Bridge、Vision、pi2dsh、mnemon 和 autogate 最多属于 P3 可复现 Demo；ACN 与 topology 已向 P4 概念观察降级。公开材料仍缺 TCO、P50/P95、并发、长跑、故障率和客户侧持续使用数据。

若要判断“能否持续使用”，每个候选至少应在假数据和独立凭证环境运行 7 天，记录崩溃率、会话可续率、升级/回滚、token/美元、P50/P95、内存/磁盘、网络目的地与敏感日志。没有使用方对等确认前，对外只能称为开发者平台或插件 Demo。

## 衍生项目开始补齐交付层

插件之外，社区已经出现五个值得持续跟踪的交付对象。

### OpenDesign：最明确的垂直 Runtime

[OpenDesign](https://github.com/nexu-io/open-design) 含原生 `@open-design/dsh-runtime` Bundle，直接使用官方 CLI、Session 与 LLM 能力，而不是只在 README 里写“支持 MCP”。0.21.0 修复了 DSH release-line 兼容，并提供跨平台安装包。它是本期最强的垂直衍生信号，但 OpenDesign 总下载不能归因成 dsh 用户。

OpenDesign Cloud 还存在付费入口与 DeepSeek 模型促销，说明 dsh 被接入了一个可收费产品漏斗；公开材料没有 DSH 专属收入、转化、留存或客户数据，因此只能算 P3 产品化信号。

### 两类 Desktop：分发成立，企业边界未成立

[DeepSeek Harness Desktop](https://github.com/dsh-tauri-desk/deepseek-harness-desktop) 用 Tauri 管理 Web、Profile、plugin、runtime 和 update，v0.9.1 提供多平台资产。它已经超过概念外壳，但许可证附加条款、首次下载 runtime/Harness、自动更新与预设插件都需要法律和供应链审计。

[DSH Desktop](https://github.com/anywhere-labs/dsh-desktop) 在 v2.0.3 中形成官网、安装包、社区市场与 LAN 访问选项。项目文档明确说明 LAN 模式没有鉴权，同一网络的用户可能操作电脑，这在企业和共享网络中属于阻断项。下载量证明有人获取发行物，不证明安装成功、活跃、留存或付费。

### Windows 安装与远程 Worker

[dsh-launcher](https://github.com/Wanbinyu/dsh-launcher) 0.4.0 管理 Windows 上的官方 npm 安装、Node/pnpm、更新、修复和卸载。量级仍小，但它准确击中了首次安装和恢复摩擦。

[dsh-sev](https://github.com/Buzzso/dsh-sev) 在本窗新建并发布到 0.3.4，通过 SSH tunnel 把远程 headless/web dsh、Session API 和 one-shot task 接入本地 GUI。长任务脱离笔记本运行是有价值的方向，但项目仍过新，没有独立用户；复制 SSH/DSH credentials、iframe 和远程 control-plane 都需单独审计。

普通 TUI、Telegram、皮肤、桌宠、计费和探针插件没有重复计入这五个核心衍生项目。

## 产品化信号还没有变成商业闭环

本轮可以确认“有人在产品化”，不能确认“企业已经采购”。

已验证的只是 P3 信号：OpenDesign 把 dsh 接进有付费入口的产品，两类 Desktop 和 Launcher 提供二进制分发，dsh-sev 探索远程 worker。未发现 DSH 专属付费客户、收入、留存、SLA、TCO、采购/招标/合同、双方对等确认合作、完成融资、明确招聘或针对 Harness 的监管动作。

DeepSeek 公司融资、模型 API 销售、OpenDesign 总付费、Desktop 总下载、Stars 和单边赞助 Logo 都不能写成 Harness 商业采用。

现阶段最值得验证的商业机会，反而集中在治理层：Enterprise Restricted Profile、Profile Registry 与 SBOM/签名、可恢复升级、Windows 管理安装、远程隔离 worker、统一观测和成本路由。它们是高概率痛点，但在客户对等确认之前仍是待验证假设。

## 生态真正验证了什么

把官方供给与外部采用对在一起，可以看到一条清晰边界：

- Profile/Bundle 已被 OpenDesign、Desktop、dsh-sev 与插件广泛采用，证明可组合性成立，也使它成为 ABI 漂移主战场。
- Session/Event 被 Bridge、export、memory 和 Desktop resume 采用，证明事件源有外部价值；隐私、迁移和损坏恢复没有生产验证。
- ACP/MCP/Subagent 的外部供给活跃，但 conformance、取消一致性和 policy 继承不足。
- Web/Remote 已有桌面和远程 UI 采用，一次性 token 仍没有补上 SSO、RBAC 与多租户。
- mnemon 与 memory-connect 证明长期记忆需求强烈，召回质量、poisoning、删除和租户隔离仍未证。
- Jobs/Schedule 与远程长任务只有单机原型，跨节点 lease、HA 和 SLA 仍缺。

因此，dsh 的差异化不是“功能最多的 coding agent”，而是 Cordis、Profile/Bundle 和 Session 事件流组成的开放、可替换 Runtime。生态已经验证了**可组合性**，还没有验证**可治理性、可恢复性和生产经济性**。

## 与固定竞品相比，差距转向治理闭环

本窗内，[OpenClaw](https://github.com/openclaw/openclaw/releases) 继续推进 secret egress host binding、SQLite 备份恢复、plugin provenance、浏览器 relay 与外部 supervision；[Claude Code](https://github.com/anthropics/claude-code/releases) 强化 restricted 模式、managed settings 诊断和 marketplace hardening；[Codex](https://github.com/openai/codex/releases) 推进任务互引、多 agent、权限保持、不信任项目指令、凭据脱敏和 Windows sandbox。

[OpenCode](https://github.com/anomalyco/opencode/releases) 在企业云身份、多 provider、gateway passthrough 与可恢复 subagent task 上继续积累；[Gemini CLI](https://github.com/google-gemini/gemini-cli/releases) 则推进企业工作站 OAuth、eval failure summary、容量重试、取消 rollback 和 subagent 修复。

这些变化说明，竞争焦点已经不只是工具数量。OpenClaw在补恢复、秘密与插件来源，Claude Code在补集中管理，Codex在补策略保持，OpenCode在补 provider 和企业身份，Gemini CLI在补 rollback 与评测。dsh 最合理的位置不是正面替代 Claude Code 或 Codex，而是把它们作为可编排对象，并补齐自己的治理闭环。

## 下一步：先设停止条件，再做 PoC

### 72 小时硬门槛

1. 固定 `dsh-v0.1.2-alpha.1` 与 SHA，只在隔离 VM 和测试仓库运行；若走 npm，先确认默认 latest 仍是 rc.2。
2. 测一次性 token 的重放、history/Referer/log、跨 Profile、WebSocket、iframe、LAN proxy、Origin 与 Host。
3. 抓包确认插件包名/版本上报能关闭，Session 增量上传在所有 Profile 与升级路径中保持默认关闭。
4. 复测 PTC、approval、subagent、ACP/MCP 的 policy 继承。任何子路径能够放宽父策略，都应立即停止 PoC。
5. 完成 rc.2→alpha.1 的 Session、JSONL、SQLite 备份恢复、回滚和 Remote/API smoke。

### 一周内沉淀三项资产

- **Enterprise Restricted Profile**：默认无 PTC、shell 和 public WebFetch，工作区 fence、插件 allowlist、策略签名，且不能被 UI 或子代理放宽。
- **Profile Registry + Conformance**：记录 SBOM、来源、lockfile、ABI、兼容矩阵、灰度与回滚；首批覆盖 OpenDesign runtime、两类 Desktop 与 pi2dsh。
- **Recovery / Eval Pack**：覆盖会话尾修复、可校验备份恢复、取消原子性、tool-call 故障分类，以及 100-case ACP/MCP/subagent 回归。

### 两周内只争取一个 P2

找一个真实团队，以隔离 worker 形态接入，不开放公网 Web UI。记录运行天数、任务成功率、人工接管率、成本、越权与故障、RTO/RPO。只有使用方公开确认后，才能从 P3 升级为 P2。

暂不在含生产密钥的员工主机安装未经审计的 Desktop 或插件，不开放无鉴权 LAN，不宣称企业多租户、生产隔离、成熟 Browser/Computer Use 或安全审计，也不把公司融资、模型收入、下载和 Stars 当成 Harness 商业化。

## 下期观察点

下一期最值得追踪十件事：npm 是否与 alpha Release 对齐；一次性 token 的 TTL 与全 Remote/WS 覆盖；WebFetch 的 SSRF 实现；adapter 插件元数据与 Session 上传的配置键、wire schema、脱敏和留存；PTC 是否真正进入 OS sandbox；Bridge/Vision/dsh-web/pi2dsh/mnemon 的 alpha.1 运行兼容；SQLite/JSONL 迁移回滚；ACP route pin、cancel admission、MCP rollback 与 close quiescence；ACN/session-export/topology 是否连续第二窗停滞；以及首个独立 P2/P1 是否终于出现成本、P95、并发、稳定和安全数据。

本报告基于 2026 年 8 月 25 日 14:10 至 8 月 28 日 14:23 的公开代码、文档、Release、registry 与项目方证据，并回溯最近 7 天补漏。研究没有安装第三方插件或二进制，也没有执行 Windows 实机矩阵、动态 SSRF/token fuzz 或客户侧生产验证。结论是公开证据审查，不是安全认证、法律意见或生产背书。
