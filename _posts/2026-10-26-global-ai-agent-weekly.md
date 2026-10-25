---
layout: single
title: "全球 AI Agent 研究周报 · 第 21 期（2026-10-19 ~ 10-25）：自治等级尚未标准化，权限、恢复与身份成为新战场"
date: 2026-10-26 06:30:00 +0800
excerpt: "本期（第 21 期）覆盖 2026-10-19 至 10-25：Anthropic 开放 Claude Duet 让 Agent 默认先开口，Harvey Graph 把法律 Agent 的上下文做成图，ServiceNow Arc 与 NVIDIA OpenShell 把治理压到运行时与硬件；同一周编码 Agent 一侧仍在密集收紧沙箱与权限。"
categories: [AI, Agent]
tags: [AI Agent, MCP, Claude Code, Codex, Agent 治理, 沙箱隔离, 记忆与审计]
header:
  overlay_image: /assets/images/posts/2026-10-26-global-ai-agent-weekly.png
  overlay_filter: 0.35
toc: true
toc_label: "本期目录"
toc_icon: "robot"
---
本期为全球 AI Agent 研究周报第 21 期，覆盖 2026-10-19 至 10-25 的完整自然周。

本周的增量不在模型能力，而在边界：谁批准 Agent 的动作、出错后能否恢复、凭据放在哪、记忆删掉后是否真的消失。编码 Agent 一侧在密集收紧沙箱与权限判定，通用与生产侧却在反向放开自治——同一周里，Claude Code 连发六个版本几乎全在补权限漏洞，Replit 则让 Agent 自动修改并发布生产环境。行业还没有统一的自治等级标准，这种相反方向的同时出现，是本周最值得架构师注意的信号。

## 一边收紧，一边放开：自治等级还没有标准

收紧的证据来自发布说明本身。Claude Code 在窗口内从 2.1.304 走到 2.1.310，2.1.309 集中修掉一串提权面：沙箱在执行每条命令前于沙箱外读取 shell 启动文件、`denyWrite` glob 经符号链接失效、沙箱命令可改写 `--mcp-config` 指定文件、Bash 权限检查信任可能重定向失败的变量、`cd` 包裹绕过复合命令确认，以及 worktree 隔离会话接受 locale 前缀命令。单周六个补丁版本、changelog 里大量“Fixed … bypass/permission”条目，说明权限判定仍在高频打补丁。

Codex 的 rust-v0.164.0 把企业 MCP 授权、远程会话凭据遮蔽、Bedrock 配置向导放进同一版，并修掉“排队 prompt 越过未决权限选择继续执行”。这条修复的含义比功能项更重：并发交互下，人工确认仍可能被绕过，企业需要把它列入回归测试。Antigravity CLI 1.4.7 则给 hook 的 stdin JSON 增加 `lastUserInput`，让 hook 能在 Agent 行动前审查用户最新指令，等于把提示词审查下放到可审计的治理点。

放开的一侧更直接。Replit 在 10 月 22 日发布 Monitoring Agent，把上半年上线的 App Monitoring 闭成环：生产事故发生时，Agent 读取生产日志与指标定位原因、验证修复，并经 `auto-publish` 直接部署到生产，随后邮件回报发生了什么、改了什么；是否自动发布由用户开关决定。这是本周见到的最高自治等级。官方博客没有披露验证机制细节、失败率或回滚策略，效果主张本次未取得独立证据。

Claude Duet 走了另一条路。它把不可逆动作（发消息、付款、签约、删除）全部拦在审批卡后面，即使批准也不允许证券交易或账户间转账；AutoClaw 则把长期记忆的写入做成“进化请求卡片”，必须由人审批。AutoGPT 的 beta v0.9.0 给出了更细的切法：每个 block 声明自身 effect，Auto 对廉价的外向动作直接判断，对昂贵动作先询问，并按 Expert 设置默认审批模式。三条路线指向同一个工程问题：审批粒度应该由动作代价决定，而不是一个全局开关。

对方案架构师的含义是，自治等级不能只看“能不能自动完成”，而要拆成四个可验收的维度：动作是否可逆、失败后能否回滚、审批由谁承担、审计能否还原决策依据。本周没有厂商把这四项做成完整公开材料，采购时应按已 GA 的策略执行验收，而不是按发布会上的最高能力验收。

## 编码 Agent：从写代码到对运行中的系统负责

Claude Code 的 2.1.310 新增 Monitor 工具与 plugin monitors，并明确在 Bedrock、Vertex、Foundry 以及遥测/非必要流量被禁用的环境中同样可用，同时禁止长时间前台 sleep。这等于把“后台盯任务”从交互式终端能力下推到企业私有云通道。Cloud sessions 与 Remote Control 也被纳入 Enterprise 自定义角色权限，管理员开启时需确认并列出受影响角色。产品形态仍是终端、VS Code 扩展、桌面/云会话并行，但主线已从“更会写代码”转为把长时任务接进企业权限模型。另外，2.1.307 把 `/claude-api` 的 api-version 迁到 `2026-10-21`，2.1.310 把 Managed Agents 子代理团队切到 `multiagent_20261001` 契约、动态 workflow 默认开启；`sed -i` 改为标准 Bash 且不再被 `/rewind` 还原，属于行为变更，依赖回滚的工作流需重测。

Codex 的 rust-v0.164.0 在 10 月 23 日发布，同日还发了 0.165.0-alpha.1，窗口内另有一串预发布。功能项指向可复用工作流与企业接入：10 个编号 `/presets` 槽位保存 prompt 与 slash command，`/model`、`/permissions` 支持内联参数，Kitty/Sixel 终端可全屏预览图片，企业 MCP 可用 Codex 账号授权或专用登录，远程 Bash/Zsh 会话遮蔽凭据。架构上，MCP 认证、Guardian 安全审查线程、app-server daemon、subagent threads 都已存在，CLI 只是其中一个前端。修复侧还覆盖 Windows 代理认证（Negotiate/NTLM）、多级 `-c/--config` 覆盖丢失、macOS 大小写变体元数据路径与可替换符号链接的沙箱校验。它的差异化正从模型转向“企业身份 + 云账号 + 守护式审查”的工程外壳，与 Claude Code 的企业权限路线正面撞车。

Google 的动作是结构性的。迁移公告在 5 月 19 日、属背景（非本周）：Gemini CLI 与 Gemini Code Assist IDE 扩展自 2026 年 6 月 18 日起停止为个人免费版及 AI Pro/Ultra 提供服务，消费线统一迁往 Antigravity（桌面 2.0 与 Go 编写的 CLI 共享同一 harness）；持 Code Assist Standard/Enterprise 或经 Google Cloud 使用 GitHub 版的客户继续获得 Gemini CLI 更新。窗口内 Gemini CLI v0.65.0（10 月 20 日）仍以安全与状态机修复为主：不可信目录强制只读 workspace 设置、OAuth 回调按 RFC 9207 校验 iss、快速 Ctrl-C 导致 session poisoning、恢复会话重复 tool response、退出时误删 resumed 会话历史、重选登录未清缓存凭据，Antigravity CLI 则从 10 月 20 日的 1.4.3 连发到 10 月 24 日的 1.4.7，修 ADC 登录下扩展不加载、单条超大消息反复压缩、macOS/Windows keychain 存不下大 token、同机不同用户共用 OAuth token 的隔离缺陷。迁移并非 1:1 功能对等，企业短期“还能用”成立，但新能力会优先落在 Antigravity，采购应按平台绑定而非单 CLI 评估。官方披露 Gemini CLI 累计 10 万+ GitHub stars、6,000+ 合并 PR，形成“消费迁移、企业留守”的双轨。

Cursor 本周没有重大公开更新。最新三条更新是 10 月 16 日的 Cloud Agent Canvases、10 月 13 日的 Origin App Marketplace 与 10 月 6 日的本地 Agent 远程控制，均在窗口外，只作背景。背景（非本周）：9 月 10 日上线的 Projects 让协调者 Agent 只规划与分派、可并行上千 subagent，Project 级共享上下文跨云/本地同步；9 月 2 日的 self-hosted machines 让工具执行完全留在客户网络。它已把产品重心转向 Agents Window、Cloud Agents 与 iOS 远程控制，Projects 把交互单位从一次会话提升为持续数月的工作体，coordinator 可并行上千 subagent，支持 Slack 频道订阅与定时触发，最多管理 300 个仓库；Marketplace 首批 20+ 集成。10 月仅 3 条更新，月均 5.6 条；但 Projects 仍是 beta，大规模并行的成本与失败恢复没有公开数据。Remote Control 默认开启（Enterprise 除外），本机需保持开机联网，等于把本地 Agent 暴露为可远程下指令的执行端。

Devin Desktop 在 10 月 23 日的 v3.11.212 把 Agent Window 与 app.devin.ai 合并：同一界面里有 sessions 侧栏、Automations、Review、Wiki、⌘K 命令面板，支持把会话拖到另一会话上最多 8 个并排、按 workspace 分组、从任意会话派生子会话；每个会话新增 Files 树、逐文件 diff、⌘L 引用代码进对话、会话机器上的 Terminal，已配置 MCP 可 @ 提及，云会话可开 Remote SSH 与 Preview。交互改为 Enter 是“steer 当前回合”、⌘/Ctrl+Enter 才排队，把人类插话做成一等语义。它保留 Windsurf 插件市场与 JetBrains 插件线，兼容 `.windsurfignore`/`.devinignore`，ACP 已默认开启，可接第三方 Agent。10 月 24 日的 v3.11.216 修权限与安装：无 Devin Cloud session 权限的成员恢复可见/可开 Devin Local 会话。背景（非本周）：Windsurf 已于 2026 年 6 月 2 日更名 Devin Desktop，9 月 5 日移除 Cascade。对企业而言，“买 IDE”正在变成“买 Agent 平台席位”。

OpenCode 在 10 月 23 日发布 v2.1.4，两个 Highlight 都指向长会话：MCP server 在 tool call 中请求输入时，客户端直接弹表单（text/number/choice/multiselect/boolean/URL），而不是让调用等到超时；实验性后台压缩在会话接近阈值时预生成摘要，但官方提醒“从未被使用的摘要仍消耗 token”。更关键的是 2.1 的公开契约变更：SDK、HTTP message/event、plugin 三处把 provider replay 字段统一为 `native`，tool call 与 result 合并为单一 `tool.native`，压缩摘要不再复制扁平文本，而改用 `metadata.keepID` 引用首条保留消息，`providerContext` 迁入 `native.messages`，并删除过渡事件 `session.compacted`。官方称旧会话/凭据/导入仍可读，无需数据库迁移。

这套改动的本质是上下文与回放模型重构：把摘要从“复制一份扁平历史”改成“引用原消息 ID”，把 provider 私有回放态收进单一命名空间。它直接降低长会话的存储与 token 冗余，也让 compaction hook 能覆盖 keepID，属于可编程上下文管理。它是 MIT 许可、75+ provider 路线的开源编码 Agent，stars 221,485、forks 29,614，是本期开源编码 Agent 中体量最大者。代价是破坏性 SDK/event 变更，自建集成的团队必须锁版本；3,813 个 open issues 也说明迭代速度与缺陷积压并存。

Replit 把这条路线推到生产运维。Monitoring Agent 需要三段权限打通：读取生产日志/指标、修改代码并验证修复、调用发布流水线。它依托 Replit 自有托管环境，这也是它能在同一环境替用户打补丁的前提；企业侧的隔离需求由 Bring Your Own Cloud（10 月 16 日）与治理工具承接。风险面很具体：误判根因、修复引入回归，以及 Agent 拥有生产写权限后的审计与回滚要求。客户数与采用数据未公开。下一步应看它是否公开事故拦截率与回滚数据。

同一周还有一条反面对照。Aider 没有任何版本、架构或 benchmark 变化：最新 PyPI 版本仍是 2026 年 2 月 12 日的 0.86.2，GitHub 最后一个 release 是 2025 年 8 月 9 日的 v0.86.0，仓库最后推送 2026 年 5 月 22 日。它当前 stars 49,750、forks 5,107、open issues 1,943。它仍坚持单会话、单机、git 原生提交与 repo map 的编辑循环，但没有 sandbox、没有 MCP 一等支持、没有云端会话，与本期的工程方向相反。第三方页面曾称 Aider 在 10 月 22 日发布 V2 并支持 75+ provider，这与 PyPI/GitHub 原始记录直接矛盾，版本号实际对应 OpenCode 的发布序列，不采用。

Cline 窗口内没有新版本，最新 v4.1.25 停在 10 月 16 日，同日另有 CLI v3.0.73、Desktop v0.0.48、SDK v0.0.95；stars 70,836、forks 7,748；仓库仍有推送，因此记为“观察”而非“静默”。它已形成扩展、CLI、桌面端、SDK 四条线，是开源 IDE Agent 中体量第二（次于 OpenCode），以 MCP 市场、plan/act 双模式、checkpoint 回滚为核心，但版本号体系分裂，企业选型时难以判断哪条是长期主线。Roo Code 则已经归档，最后推送 2026 年 5 月 15 日，官方在扩展内提示关停并指向 Cline/ZooCode；归档后没有安全修复，继续使用等于把未修补的权限与执行面留在开发机上。Roo 的“模式即角色”本质是把 prompt 与工具白名单打包成可切换 profile，该思路已被 Cursor modes、Claude Code subagent、Devin subagent 吸收；它是本期一条明确的供应链风险证据。

SWE-bench 本周没有可核验的新增榜单。官方榜历史上更新频率低，2026 年 2 月曾做一次全量重跑，“本周无新条目”是常态而非异动。官方榜当前可见 Gemini 3 Pro Preview + live-SWE-agent 77.40、Claude 4 Sonnet + EPAM AI/Run 76.80，但页面未标更新时间；第三方榜称 Claude Opus 5 达 96%，口径混杂“模型自报”与“Agent 系统分”，且覆盖 115 个模型、没有可复现运行信息，不采用。SWE-bench Verified 测的是“给定 issue 能否产出通过测试的 patch”，不覆盖长时任务、多轮交互与生产部署；分数由模型与 harness 共同决定。本周没有可用新信号，反而说明竞争已从刷榜转向工程可用性，评估供应商应要求给出 harness 版本与可复现配置，而不是单一百分比。

## 开源生态：迁移成本成为竞争武器

### 运行时与迁移

OpenClaw 在窗口内于 10 月 22 日与 10 月 24 日发了 v2026.10.6 与 v2026.10.7，另有维护线回补与两个 beta。10.6 的核心是运行时安全基线：强制 Node 24.22.1+/26.12.1+，理由是 2026 年 10 月的 Node.js 安全版本修复了“被攻陷证书密钥签发的 TLS 链”，Docker 镜像与安装器同步换装，`openclaw update` 在旧 Node 上直接拒绝安装并给恢复指引，而不是装完再坏；源码构建锁 pnpm 12.15.0。

10.7 的主题是可回放的会话恢复：中断会话保留 recovery provenance 与未完成工具结果，已停止会话在接受下一条消息前清退终态残留，大包子任务的结果被约束在请求方上下文内；备份与状态持久化做到“截断写入时保留 last-known-good 配置快照”“多文件补丁失败保留先前文件”“Memory Wiki 重导入保留人工笔记”。同版还为 Google 模型加入 Gemini 4 Argon 支持。这些改动集中在状态机与持久化层，恰好是自建 Agent 平台最容易翻车的地方。它当前 stars 393,049、forks 82,614，release 贡献者名单里出现大量社区 ID，说明外部 PR 已成主力。

Hermes 在 10 月 21 日与 23 日三连发 v0.22.3、v0.22.4、v0.22.5。v0.22.5 的量化是：自 v0.22.4 以来 231 个非合并提交、804 个改动文件（+35,212/−17,885）、81 个已合并 PR、30 个关闭 issue。内容上最值得记的不是修 bug，而是核心减负与迁移能力：`hermes mcp serve` 与 Singularity 后端移出 core 改为插件；新增 `hermes import-agent` 与 OpenClaw 迁移路径，检测到其他 Agent 时安装流程主动提供导入；委派后端可插拔，可按 model map 或 profile 路由子 Agent 并逐会话切换。它用“兼容 OpenClaw 资产 + 插件化 + 可切换委派”抢同一批自托管用户，迁移成本被主动降到接近零。真实考验不在功能表，而在 51,071 个 open issues 的积压，以及“自进化”能否给出可复核的效果基准；本周 release 没有给出任何评测数字。依赖侧升 Electron 44、Pillow 13 并批量修安全告警；Nous 登录统一为设备登录、免费访客可移交账号，新增基于用量窗口的套餐计量。它当前 stars 257,040、forks 56,301，同时存在 awesome-hermes-agent（5,897 stars）与中文橙皮书（5,021 stars）等第三方生态仓。

开源侧最重的结构性事实是 AutoGen 退场。归档声明发生在 10 月 16 日、属窗口外背景，本周仍无维护动作：README 顶部挂 `status-archived` 徽章，写明项目已归档、微软不再维护、不提供 bug 修复/安全修复/新功能/支持，建议不要用于生产，新用户转向 Microsoft Agent Framework。GitHub API 返回 `archived=false`，即仓库并未真正置为归档只读，只有声明层面归档；准确表述应是“官方宣布归档，仓库标志未同步”。最新 release 仍是 2025 年 9 月 30 日的 python-v0.7.5，1,121 个 open issues 将不再处理。仍在 AutoGen 上跑生产的企业面对的是“无安全补丁”敞口，迁移是被迫而非选择。

继任者 Agent Framework 在窗口内给出迁移落点：python-1.23.0 与 dotnet-1.26.0 落地 MCP 2.x 兼容基座，传输、错误、schema 与生命周期整体迁移；AG-UI 端点注册必须显式声明授权 scope 或单用户模式；Docker shell 参数 `extra_run_args` 更名 `unsafe_extra_run_args`，把信任要求写进命名；MCP 客户端生命周期区分 caller-owned 与 framework-owned；A2A 支持按白名单从请求元数据转发函数调用与客户端参数。迁移不是改 import，而是 MCP 生命周期与授权模型同时变。Agent Framework 当前 stars 14,314、forks 2,512。

### 框架与平台

LangGraph 在 10 月 24 日发布 1.2.17，走小步高频补丁线。它当前 stars 43,883、forks 7,539、open issues 513，issue 存量相对 stars 很低，维护响应较好。1.2.17 的实质改动只有三条：显式传入等于默认值的 `recursion_limit` 时按显式值生效（此前会被内部默认覆盖，长任务容易莫名中断）；`RemoteGraph.stream(subgraphs=True)` 保留调用方的 namespace（分布式部署下子图事件归属错乱的根因）；移除预防性的第三方依赖上界。LangChain 主仓窗口内 82 次默认分支提交几乎全是依赖与安全补丁，同日线发 langchain 1.4.7 与 langchain-core 1.7.0。两条改动都指向分布式与递归语义的正确性：namespace 决定多进程/远程图的事件与检查点写到哪，recursion_limit 决定失控循环何时被掐断。这类修复不产生新 API，但直接决定线上故障率。

Google ADK 在 10 月 23 日发布 v2.13.0（release 正文标 10 月 22 日，列表与正文差异保留），是一次“转正 + 扩容”：12 个实验特性转 stable；新增 `TypesafeClassifier` 与 `ClassifierNode`，用 TypeSafe 的 Jev 模型做工作流路由，官方称单次前向即返回校准概率、比 LLM 分类快得多；Live Audio 支持实时语音与 barge-in；内存侧新增实验性 `MongoDbSessionService` 与 `MongoDbMemoryService`，后者走关键词召回长期记忆，不需要 embedding 模型与向量索引；`MongoDbToolset` 可部署到 Agent Engine 而不打包连接串。破坏性变更是遥测默认切到 OpenTelemetry GenAI v2（`otel_semconv_1_44`，移除 `call_llm` span），需设 `ADK_TELEMETRY_SCHEMA_VERSION_OPT_IN=otel_semconv_1_36` 才保留旧 schema。官方称字符串模型 Agent 的执行回合最高快 8 倍，但该数字只适用于这一场景，不能外推到多工具或多 Agent。它当前 stars 22,004、forks 4,246。

Dify 在 10 月 23 日发布 v1.18.0，距上一版 v1.17.1 已隔 6 周，主题是“Agent 决定下一步”。它当前 stars 159,522、forks 25,214。Output Routes 让 Agent 节点输出带选择条件并接到不同分支，只读 `switch` 输出暴露所选路由；可移植 `.ifpkg` 把应用连同内联 Agent、Skills 与文件打进单包；同时 Agent v2 节点改为流式输出文本，结构化结果与路由结果仍缓冲；嵌套工作流可视化可从运行历史点进 Workflow Tool 调用、协同 pause/resume/stop，并带源应用访问校验；Agent Knowledge Base（Beta）是独立知识空间，需要独立服务与数据库。开发者侧新增 OpenAPI 与 `difyctl`，支持 Workflow/Chatflow 创建、DSL 导入导出、发布与版本恢复，`draft hash` 防并发覆盖，还可用 `difyctl install skills <dir>` 装内置 skill。Agent Knowledge Base 的云版“即将上线”。

Dify 的真正门槛在协议。`/runs` 只接受 composition v2 并拒绝 v1，旧 Agent 专用 AskHuman 工具与延迟恢复路径被删除，旧运行时读不了新快照；本地 Agent sandbox 必须配高熵认证 token（`--require-auth-token`，1.17.1 镜像不支持），源码安装要求 Python 3.13。升级必须 API、workers、Agent Backend、Agent runtime 一起换，回滚窗口很窄。官方自承嵌套运行的用量与步数统计在暂停/停止后仍可能近似；若团队仍用 1.17 运行时，混版会直接读不了 v2 快照。准备升级的团队应先在隔离环境用新镜像跑完快照转换。

OpenHands 在 10 月 20 日至 23 日的 4 天内连发 5 个版本，核心是 Agent Profile 成为一等配置对象。它当前 stars 91,819、forks 12,194：可按 profile 从服务端目录选 skills、编辑 condenser 与 verification、选 Model Router，并按 id 直接启动 `default`，profile 自己持有设置；公共 skills 改从随包 extensions 读取。平台侧补了自动化集成连接态、canvas 服务端会话标签、云端会话保存已连接仓库，以及可选的 Mars web bridge；README 移除 beta 徽章。v1.33.0 修了一处安全问题：请求表单与 Settings 表单中的 secret 值改为掩码显示。这把“Agent 质量主要由上下文压缩策略 + 校验环节 + 路由模型决定”写进了产品结构。macOS 构建尚未签名/公证，Gatekeeper 会报“已损坏”，企业分发仍是缺口。

CrewAI 1.15.29 于 10 月 23 日把 AgentExecutor 从 experimental 转正。它当前 stars 60,095、forks 8,881，单个补丁版贡献者 24 人；新增离线 jev routing 与 guardrail evaluation runner，集成应用动作可直接以 `call: tool` 调用，`crewai eval` 支持把评估全量数据留在项目内、一条命令跑 crew 拿判决。修复面向长期运行：工具动作遵守 failure policy、每次 kickoff 重取用量预算、无来源的私有记忆不再泄漏进每次召回、LanceDB 检索顺序与过滤器转义、重规划失败时恢复任务描述、阻止 Agent 重复同一工具调用。上下文压缩改为 BaseLLM 能力，是“压缩策略随模型走”的路线。一次补丁版塞进十余项特性，回归面偏大；它与 ADK 的 Jev 分类器同名，但本次未取得统一说明，不能推断为同一产品化能力。次日 1.15.30 仅修文档与 AGENTS.md 登录流程。

AutoGPT 的 beta v0.9.0 给出一个值得单独记的权限模型：每个 block 声明自身 effect，Auto 对廉价的外向动作直接判断，对昂贵动作先询问，并按 Expert 设置新网页会话的默认审批模式。平台侧同版补了 Docker Hub 镜像自托管与 Windows 安装器、管理员用户页的查/封禁/代登录与限流、浏览器工具走 egress 代理、swap proxy 后放占位符而非 token；AutoPilot 触限暂停而非死掉、预算重置后可恢复；计划任务因同类失败会暂停并告知 owner；多账号滥用治理与度量、管理员限流；“dreaming” 过程蒸馏私有账号与 Expert 技能，并加 DreamPass 记录与重叠守卫。模型目录新增 Claude Haiku 5.5 与 Meta Muse Spark。一次发布含 30+ 变更，升级风险高；“Auto 判断廉价动作”的边界由平台定义，企业需核对自身合规是否接受自动外向动作。它的贡献不在自主性，而在“按代价分级审批 + 动作 effect 声明”这套可移植的权限语义；若被其他框架采纳，“哪些动作必须问人”将首次有可比较的标准。当前仍是 beta，适合观察而非生产押注。它当前 stars 187,749、forks 45,895。

OpenAI Agents SDK 窗口内没有新 release，最近 v0.24.0 停在 10 月 15 日；11 次提交的方向是收窄 sandbox 供应商面并加固沙箱：10 月 19 日移除 Runloop provider 并删除文档指引，10 月 22 日的 `[sandbox-hardening] Avoid loading startup files during workspace operations` 让工作区操作不再加载启动脚本（shell rc 类文件是典型的持久化与提权入口）。provider 移除只在 commit 中体现、无 release note 承载，已接入 Runloop 的用户是破坏性变更且容易漏读。它当前 stars 30,274、forks 4,935。

browser-use 同样没有新 release，最近 0.13.13 停在 10 月 15 日，窗口内仅 3 次 README 提交，但主题有工程含义：保存的运行记录可在不逐步调用模型的情况下重放，并补了重放 FAQ——快照仍可能含密钥，重放需要相同的 `sensitive_data`，官方没有内建脱敏。这把一次浏览器任务固化成可复现轨迹，模型只在必要时介入，对回归测试、审计与成本控制都有直接价值；企业用于生产需自建快照清理。它当前 stars 119,117、forks 13,241。

### 观察池与星标

观察池里的项目需要分开记。LlamaIndex 没有新 release，最新仍是 2026 年 9 月 21 日的 v0.14.25；默认分支提交 API 返回 0 条，但仓库 `pushed_at` 为 10 月 23 日，两者矛盾，本次未取得解释，只能记“未见默认分支公开提交”，不推断它在改什么。MetaGPT 最新 release 停在 2025 年 3 月 9 日，SuperAGI 最后推送 2025 年 1 月 22 日，均属长期停滞或休眠，作为背景（非本周）记录。Swarm 本期未单独扫描，不声称其状态。

开源侧的活跃度分层比星标更能预测可用性。下表为 2026 年 10 月 26 日取得时快照，本期没有跨期快照，因此不报周增速，热度也不作为价值判断。

| 项目 | stars（2026-10-26 快照） | 本周信号 |
|---|---:|---|
| OpenClaw | 393,049 | 运行时安全基线、可回放恢复 |
| Hermes Agent | 257,040 | core→plugin 剥离、迁移 OpenClaw、可切换委派 |
| OpenCode | 221,485 | `native` 契约合并、keepID 引用式压缩 |
| AutoGPT | 187,749 | block 级 effect、按代价分级审批 |
| browser-use | 119,117 | 运行记录可重放 |
| OpenHands | 91,819 | Agent Profile 成一等配置 |
| MetaGPT | 71,013 | 长期停滞（背景，非本周） |
| Cline | 70,836 | 窗口内无发版（观察） |
| Microsoft AutoGen | 61,559 | 官方宣布归档，标志未同步 |
| CrewAI | 60,095 | Executor 转正、离线路由与本地评估 |
| LlamaIndex | 52,662 | 文档级提交或零提交 |
| Aider | 49,750 | 长期无新版（静默） |
| LangGraph | 43,883 | namespace 与 recursion_limit 修复 |
| Roo Code | 24,262 | 已归档（2026-05-15） |
| SuperAGI | 17,715 | 休眠（背景，非本周） |

## 通用 Agent：默认发起权转向 Agent

Claude Duet 在 10 月 21 日开放研究预览，形态是 iOS/Android 独立 app 加 claude.ai，本阶段仅限美国 Pro/Max 订阅者、按 waitlist 放量，额度与其余 Claude 共用、不额外计费，底座是 Claude Opus 5.5。它每天早上推送跨已连接应用的短简报，白天每隔几小时巡检一次已连接账号，只在“需要你”时发消息。工作方式的关键变化是它有一个带自有浏览器的虚拟机，不依赖用户手机或电脑开机；交互是单一持续线程，可打字或语音，短回复与周级项目在同一处起步。10 月 23 日另发安全、隐私与安全专文。任务面从安排会议，到用数十个工具搭 dashboard、做财务/销售预测、做原型、搭 web app；同日还有 Claude Cowork 与 chat 在 Enterprise 合并的公告。

它的工具面接 Claude Marketplace 的 6,000+ connectors/plugins，覆盖 Gmail、Slack、QuickBooks、Stripe、Gusto、LinkedIn、Docusign、HubSpot、Canva、Shopify。凭据按 Claude Managed Agents 的设计处理，不直接看到密码与登录 token；动作经 auto mode classifier 审批；防 hidden instruction 与 prompt injection 沿用其 browser-use 研究，另设专用分类器与安全 system prompt，默认拒发信用卡号、政府证件号，健康/个人财务信息仅在明确指示下放行。支付走 Stripe Link 数字钱包（虚拟卡，不暴露真实卡号）与 Shopify Shop Pay，1Password 保存的登录是“即将支持”。

这套设计的边界同样清楚。发消息、付款、签文件、删除前必须展示待执行动作并等待批准；即使批准，也不允许证券交易或账户间转账。官方自认可能误读线程、误判紧急度，后台巡检会计入套餐额度、重任务更耗模型轮次，额度经济学尚未解。当前不能展示浏览器画面，排障与审计只能靠日志与审批卡，对企业合规仍是缺口；与主 Claude app 分离，个人琐事场景较弱。早期用户是房产经纪、餐厅老板、品牌策略等具名证言，不是规模化采用数据。真正的分水岭是默认发起权从人转向 Agent：一旦用户接受“每天一份简报 + 随时被打断”，竞争维度就从任务成功率变成“判断什么值得打扰你”与审批粒度。

智谱在 10 月 21 日介绍 AutoClaw（澳龙），把高权限本地 Agent 做成消费级安装包。它基于开源 OpenClaw 封装，支持 macOS/Windows，下载后约一分钟完成部署，无需命令行；预置 50 余项技能，覆盖内容创作、办公自动化、编程、数据分析、金融投研；浏览器自动化官方称基于 AutoGLM，可跨页面、多步骤执行信息采集、表单填写、数据导出。默认模型是面向 OpenClaw 场景优化的 Pony-Alpha-2，可切 DeepSeek/Kimi/MiniMax 或本地 Ollama；周边有飞书集成、Skill 商店与 10 月 26 日至 11 月 1 日的登录送 1 亿 Tokens 拉新活动；Skill 商店里的自研 GLM Office Skills 覆盖 PPT/DOCX/XLSX/PDF/Charts。

AutoClaw 的工程取舍值得细看。它本地执行、本地存储，官方称文件、会话、数据留在设备，仅传输必要任务描述；但继承 OpenClaw 的浏览器控制、文件读写、命令执行能力，权限面本质上仍是“本机高权限”。“本地执行更安全”是架构属性，不等于沙箱隔离或权限最小化，同机文件与浏览器会话仍然暴露。自进化机制在每轮对话后复盘，生成“进化请求卡片”，用户审批后写入长期记忆，等于把记忆写入做成人工审批的写操作；如果没有回滚与审计视图，偏好污染会累积。官方通篇是产品介绍，没有任务完成率、benchmark 或第三方评测；GLM-5.3“内部评测较前代提升约 50%”是厂商口径，未独立核实；客户数、付费转化、企业版定价本次未取得。它的意义不在功能表，而在本地 Agent 的落地摩擦从“配环境”降到“装软件”，这也是开源框架第一次被大模型厂商当作分发渠道。

其余通用 Agent 本周多为观察。OpenAI 未取得窗口内经原文确认的 Operator/ChatGPT Agent 重大动态：官方 release notes 正文在 750KB 处截断，10 月条目不可得，不以搜索摘要替代。背景（非本周）：Atlas 浏览器已于 2026 年 7 月 9 日宣布弃用、8 月 9 日停止服务，能力并入 ChatGPT 主应用与 Chrome 扩展；主动助手 dots 于 9 月 29 日发布。产品线从浏览器退到扩展与主动助手，能力与权限口径并不连续，同一“帮我在网页上办事”的诉求落在三个入口，审计与数据留存策略不一致。

Google 的 Project Mariner 本周无重大动态；Gemini at Work 的 10 月 8 日发布在窗口外，只作背景。第三方资料称 Mariner 作为独立产品已于 2026 年 5 月 4 日关停、能力并入 Gemini Agent 与 Chrome，但未取得 Google 原文，仅记录线索不作主张。Perplexity Comet 同样没有经原文确认的产品动态，官方 changelog 本次返回 403，只看到 Privacy Notice 页面标注 10 月 23 日更新，正文未读，不作条款主张。

Manus 窗口内没有新条目，最新产品文是 10 月 13 日与 OPPO 的合作；背景（非本周）是 Manus 2.0 于 9 月 28 日发布，带 Cascade harness、Cloud Computer、Automations 与 Studio，9 月 1 日恢复独立运营；9 月 29 日增 Manus Flex（自带 API key），10 月 1 日增 Video Editor 与 Game Dev。它处在 2.0 发布后的消化期，Cascade harness 与 Cloud Computer 正是与 Duet 正面对撞的部位。Genspark 窗口内无重大动态，差异化仍是一体化 workspace（Agent + slides/sheets/docs + 构建套件），本周没有新证据改变判断。Kimi 窗口内没有产品发布，只有 10 月 24 日线下活动；最新产品条目仍是 9 月 21 日的 Kimi Code Desktop，叙事转向企业版、行业方案与伙伴 FDE 队伍，官方称 Kimi Work 可连续工作 24 小时，华胜天成、金山云、亚康股份、亚信科技、中软国际已签约；站内已列“Kimi Claw”，但未取得发布日与能力原文，不作主张。Qwen 窗口内没有 agent 产品发布，能力主线仍是 Qwen3.7-Plus 的模型层统一 GUI/CLI 操作与自验证，产品化入口本周无新证据。

## 企业垂直 Agent：上下文结构与治理下沉

Sierra 与 Glean 本周都静默，但静默本身需要区分。Sierra 最新官方博客是 10 月 6 日的 Summit 回顾，10 月 19 日至 25 日没有新发布；背景（非本周）是它在 Summit 上与 Meta 联合发布 Personal Agent Protocol（PAP），9 月 30 日成为 OpenAI Marketplace 首发伙伴，主打 results-based 计费，Ghostwriter 让业务方用自然语言生成并持续优化 Agent。它的 Agent OS 与 Agent Data Platform 承载跨渠道会话与记忆，PAP 试图让企业侧 Agent 与个人 Agent 在用户授权下互通，把身份、授权、上下文交换做成协议层问题；但目前只有公告级材料，没有规范正文与实现细节。公司自述 ARR 超 1.5 亿美元（2026 年 2 月 6 日），未独立核实；更新的客户数、留存、毛利率本次未取得。结果计费对“结果”定义高度敏感，跨企业—个人 Agent 的协议若无强制身份校验，会放大钓鱼与越权面。

Glean 最新新闻稿停在 10 月 13 日的人事任命，窗口内没有新发布。背景（非本周）是 8 月 26 日 Glean:GO 发布 Tau 桌面工作区与“上下文优于模型”路线，9 月起铺全球伙伴网络。它的底座是连接器、权限镜像、混合检索与自建上下文/记忆层，向上暴露 Agent 生命周期管理与远程 MCP server；架构选择等于把“谁能看到什么”做成平台底座，而不是交给每个 Agent 自己处理。据 TechCrunch 2026 年 5 月 28 日报道，ARR 超 3 亿美元、15 个月增两倍，属媒体援引公司披露，未独立核实。风险在于权限镜像一旦与源系统漂移，就会出现“检索到了但本不该看到”的越权；上下文层越厚，Agent 行为越难归因到具体文档版本。它的静默期正落在 MCP 推进 agent identity 的同一周，说明上下文层竞争已从检索质量转向身份与治理。

Harvey 在 10 月 19 日前后发布 Harvey Graph，在法律垂直 Agent 里给出了本周最具体的工程答案。Harvey Graph 不是单一产物，而是多个专用图的集合。知识图谱覆盖全美判例，包括所有联邦地区/上诉法院与 50 州，官方称数百万份判决，抽取“谁引用谁、案件被如何对待、哪条推理线仍成立”；上下文图谱按 Space 组织私有关系，把 matter、文档、Vault 与集成连起来，包括“某文件是后来的第 4 稿且已被取代”“另一个 matter 里同名主体是同一实体”这类隐性关系。两者都自动继承 Space 的治理与伦理隔离设置，用户无需启用或管理。同一周 Artificial Lawyer 还披露 Mary Technology 的事实调查能力以 connector 形式接入 Harvey；Harvey 与 Artificial Lawyer 将于 11 月 2 日办“Agents in Legal”实操 webinar。

怎么搭的：离线推断关系，对源校验，随业务变化持续维护；运行时把图交给 Agent 做多跳检索——取权威、顺引用外扩、查案件被对待情况、回检自身答案。它明确否定纯向量检索：flat retrieval 只找段落不找关系，Agent 每次任务都要重新发现实体与交叉引用，白烧 token。治理上图跟随 Space 权限，而不是另建一套，这是企业可用性的关键设计。

代价与效果：官方披露 LAB 实验，带上下文图的 Agent rubric 通过率最高 +30%，任务成本下降约 50%；某 firm-knowledge 任务中，无图版本挑错先例（0% rubric），有图版本直接命中（75%）。用户侧调研称 93% 认为记忆让 Harvey 更有用、50% 表示重复交代上下文变少，均为公司自述，样本与方法未披露，未独立核实；客户数、席位与单价本次未取得。这些数字属厂商自建评测，按 B 级披露。

能否复制：这套方法可迁移到审计、投行尽调、医药注册等强关系型文档场景；不成立的前提是企业没有稳定的 matter、版本与主体主数据。图的正确性风险高于检索——一旦把“哪一版有效”“是否已被推翻”推断错，错误会随图扩散到所有下游任务且更难发现。维护成本也不低：数百万文档的关系要持续更新，权限继承若与源系统漂移即为越权。

ServiceNow 在 10 月 21 日的 GTC Berlin 宣布个人常驻 Agent Arc 正式 GA。用户给目标而非步骤，Arc 自行规划、跨企业系统执行、自检并调整，跨度可以是几分钟到几天；它会主动从待办、收件箱、会议与对话中捞出待办、待审批、需跟进项；缺少集成时能自己现搭连接器，但限定在同一 OpenShell 边界内运行；带记忆与技能累积。推理上“本地优先”：日常任务用 NVIDIA RTX Spark 上的本地模型，难任务再调前沿模型。定价上 Arc 不单独收费，随 EmployeeWorks 的 Foundation/Advanced/Prime 三档 SKU 提供；平台先 Mac，Windows 在数周内。

交付给谁与什么代价：Arc 面向企业员工个人，卖的是“目标常驻 + 主动发现工作 + 自建集成 + 跨会话记忆”，采购入口是已有的 EmployeeWorks SKU，而不是单独一张 Agent 账单。风险与价值同源——它能用真实凭据走每一步，还能长出新行为。自建连接器是策略绕过面，官方只承诺“在同一边界内跑”，未说明构建期如何防越权取数；记忆本身是敏感数据，留存与删除策略未披露。Control Tower 不可达时的失败模式（停机、用缓存策略、无限制运行）也没有公开。

NVIDIA 同日发布 OpenShell 参考架构，企业可在软件与硬件层于数秒内撤销 Agent 访问权。治理叙事是“一次定义、处处执行”：IT 在 Super Intelligence Control Tower 定策略，OpenShell 在运行时执行，可细到“禁止写生产系统但允许 Agent 继续其余工作”。三层结构是 Control Tower 的动作级策略、OpenShell 软件层 sandbox 执行与审计、BlueField DPU 上 Sentry 的硬件信任根。AI Passport 则是“网关凭证”：官方描述它是签发给每个 Agent、MCP server 等受管资产的背书记录，携带决策逻辑、供应商风险、风险容忍度、可访问外部服务等业务上下文，供编排与执行时校验。

关键限定必须紧邻这条主张：承载“1 秒级撤销”“硅上执行”“精确隔离”的 AI Passport 属未来版本，官方可用性段落明确写“expected to be available in a future release”；已发布材料未给测试条件、Agent 数量、网络假设与测量方法，也无第三方复现。采购应按“已 GA 的 OpenShell 策略执行”验收，不能按 1 秒撤销验收。生态侧，NVIDIA 称 Anthropic、AWS、Cisco、CrowdStrike、Dell、Google Cloud、HPE、IBM、Meta、Microsoft、OpenAI、Palo Alto、Perplexity、SAP、ServiceNow、Siemens 等“正在合作”，1Password、Okta、Zscaler 等在集成；“合作”不等于部署。Arc 的真实装机量、活跃率、留存本次未取得。

本周企业 Agent 的分水岭不是“又多了个个人 Agent”，而是治理下沉到运行时与硬件：身份凭证、执行边界、可撤销性正在成为独立产品品类（Workday 收购 ConductorOne 同向）。它也与 MCP 的 DPoP、Workload Identity Federation 属同一问题域的两条路径——专有凭证与开放协议，短期并存，长期看谁被非发起方实现。采购判断应盯“今天能强制什么”，而不是发布会上的撤销时延。

Salesforce Agentforce 与 Microsoft Copilot Agents 本周都没有重大公开动态。Salesforce 窗口内没有 Agentforce 新稿，最近的 ROI 争议在 8 月；Microsoft 侧只有 Partner Center 月度公告与 10 月 1 日的计费类更新，未见 Agent 治理或运行时能力发布。两家静默，恰好把话语权让给 ServiceNow 的治理叙事。字节 Coze 的更新日志则停在 2026 年 7 月 1 日的“豆包渠道下架”，窗口内没有产品发布；背景（非本周）是 6 月扣子 3.0 支持 OpenClaw 等外部运行形态。它的企业治理面已有企业商店、插件商店、多组织、积分额度、SSO、私网连接、记忆库等；MCP 双向使用（内置 client 把外部服务包成插件，也把付费插件封装成 MCP 工具给 Cursor/Trae/Claude 调用），记忆库按 UID+渠道 ID 隔离，采用“统一写入 + 多库隔离 + 可绑定多智能体共享”，异步工作流支撑长任务，但文档显示自定义模型接入曾支持明文存储鉴权密钥，采购需确认是否强制 KMS/密文。

## 协议与身份：MCP 的安静长骨架

MCP 协议本体本周没有新规范发布，工程侧只有可核活动：规范仓库在 10 月 20 日合并 Tasks/Events 工作组范围与 Agents IG 名册修订，10 月 23 日修订维护者信息。真正决定本周所有企业 Agent 讨论的坐标系，是窗口外的两次发布：2026 年 7 月 28 日的规范（SEP-2575/2567）取消了协议级 session 与初始化握手，改为 server/discover 先探能力、list 结果可缓存；Tasks 退为官方扩展，以 Multi Round-Trip Requests（SEP-2322）替代服务端发起请求；授权侧引入 issuer 校验、issuer-bound client credentials、CIMD，企业托管授权成为稳定扩展。8 月 22 日的新路线图把“Agent 身份与企业级安全”列为五大优先域之一，明确要做 DPoP、Workload Identity Federation、ID-JAG 与标准 token exchange。

无状态化是分水岭：服务端可水平扩展、可被当普通 HTTP 负载托管；代价是原本靠 session 承载的 elicitation、进度、长任务必须改造成 MRTR + Tasks + subscriptions/listen，客户端实现复杂度上升。下一阶段两个硬点是结果类型统一契约与渐进式发现——tools/call 同一输出多种形态会让客户端行为不可预期，百工具服务器在提问前就吃掉上下文且选择质量下降。授权仍以“人在浏览器里点同意”为默认，云上无人值守 Agent 与子 Agent 委派是缺口；无状态化后重放与幂等也需要应用层自建。

生态上出现分叉：ServiceNow 用专有 AI Passport 做 Agent/MCP server 的背书记录，与 MCP 的开放身份路线并行。官方称 Tier 1 SDK 月下载近 5 亿、TS/Python SDK 各自累计破 10 亿，这是 8 月博客自述，未独立核实。对平台厂商的含义很直接：2027 年前若不接 MCP 授权扩展，就得自建一套等价的凭证与撤销体系；判断标准不是它发了什么版本，而是有没有非发起方在生产里实现 agent identity。

## 评测与论文：判断质量、信息缺口与记忆残留

10 月 23 日披露的 Ivo × micro1 ContractBench，用 350 个真实合同审查任务测 7 个前沿模型“能否做出与资深律师相同的判断”，评估维度包括问题优先级、修改是否恰当、是否识别出必须转人工的情形。结果是 7 个模型在律师定义加权标准上全部低于 60%，最高仅 58.3%（Grok 4.7），其后 Opus 5.5 58.1%、Kimi K3 57.1%。更关键的差异不在分数而在完成率与成本：Opus 完成率 80.8%，Grok 99.5%，Kimi 100%；Kimi 每次完成 rollout 的成本比 Grok 低 38%、速度快 13%。

这组数字的工程含义比排名重要。完成率 80.8% 与 100% 的差距说明，部分模型的失败是“压根没交付”，等于 Agent 的终止与自检环节缺失；成本按“完成一次”而非“每 token”计算，才是企业口径。Artificial Lawyer 的判断是，复杂法律工作想超过中等成功率，必须有贴合事项的参考数据、规则手册与先例，以及能纠正首轮输出的细致监督。该评测由商业法律 AI 厂商与数据实验室共建，属厂商自建评测，未见第三方复现；样本 350 且任务分布未公开，律师加权标准的权重与标注者一致性也未披露，单轮结果不能外推为生产可用率。

法律 Agent 的真实天花板是“判断质量 × 交付完整性 × 单件成本”的乘积，不是 rubric 分数。这也解释了 Harvey 为何转向图与记忆，而不是换一个更强的底座。对垂直 Agent 的 ROI 叙事，含义是从“替代人力”转为“减少重复交代与返工”。

## 安全、删除与审计：三条原理性结论

EpiSEM-Bench（10 月 22 日预印本）测的是一种被忽视的失效：工具返回的每条陈述都是真的，但遗漏了与安全相关的关键事实，Agent 于是执行了本应被禁止的动作，而用户请求本身无害。数据集含 6 个领域、300 组“不安全/安全”配对任务，通过系统性屏蔽关键事实测量不安全执行率，并给出“最小观测失败基数”；配套审计工具检验 Agent 是否会主动追问缺失事实，并在补齐后既拒绝禁止动作又完成允许部分。这把 Agent 安全从“防注入”扩到“防信息缺口”：权限判定不能只依赖工具返回值，需要“缺字段即拒绝/追问”的 fail-closed 默认策略，并在 harness 层记录决策所依赖的证据是否齐全。对“策略在网关执行”的架构，这是补强也是挑战——网关看到的是动作，未必知道模型缺了什么事实。

AfterDeleteBench（10 月 22 日预印本）针对“Agent 有外部持久记忆并派生摘要”的场景：删除原始记录不等于删除其派生信息。方法是对每个合成秘密做对照——一组 Agent 先接触再删除，另一组从未接触，其余条件匹配，从而把“删除后仍能恢复”归因于原始暴露。主实验中，单次提问即可从 Qwen2.5-7B-Instruct 恢复约三分之二的已删秘密，而从未接触的对照组恢复率为零；更严重的是，恢复不依赖逐字副本，即使完整秘密串已不存在，仅剩分别存储的组件也能被重组。这是企业“记忆删除权/被遗忘权”合规的直接技术反驳：删除 API 返回 200 不等于数据消失。工程上需要派生血缘（summary、embedding、结构化字段都登记来源）、级联删除，以及删除后的对抗性探测。对统一记忆池产品，这是采购问卷里必须问的项。

同窗口还有三篇值得连读的论文。“When Is a Memory Safe Enough to Act On?”把“记忆是否要复核”定义为动作条件：同一条记住的地址，普通发货可直接用，贵重发货必须先确认；形式化为序贯停止问题，只有当复核能改变下一步动作时才值得付费。对长生命周期 Agent 的含义是，记忆条目应带“动作敏感度”，而不是统一 TTL。“Post-Audit Mirage”给出可执行的下界结论：存在“验证器可见证据完全相同、但部署后安全性相反”的配对生命周期，因此离线审计无法区分某些更新；它提出 IdentifiedRangeMonitor 输出 deploy/hold/cannot determine/unsupported 四态。Agent 上线评审不能只交离线通过率，必须留“无法判定”这一档，并配在线监控。“AgentPhishing”则是邮件 Agent 的自适应钓鱼 benchmark，用 PhishOpt 在固定约束与真实性约束下优化可复用邮件生成技能，测的是“是否被说服去执行恶意请求”，而非单纯识别钓鱼；邮件权限应按读、草拟、发送、付款分级，单靠内容分类器不够。

三条结论合起来，对企业采购的要求很清楚：派生数据血缘、级联删除、上线后在线监控、“无法判定”状态。本周没有任何一家企业 Agent 厂商在这三项上给出完整公开材料，本次未取得。

## 本周五条候选主线

1. **Claude Duet 研究预览（10 月 21 日）**：通用 Agent 的默认发起权从人转向 Agent，独立 app 加云 VM 自带浏览器，晨间简报加周期性巡检；不可逆动作必须审批，证券交易是硬红线。
2. **Harvey Graph（窗口内）**：法律垂直 Agent 从“模型多强”转向“开工前知道多少”，知识图谱加按 Space 组织的上下文图谱，运行时多跳检索；公司自建实验称 rubric +30%、成本 −50%。
3. **ServiceNow Arc GA 加 NVIDIA OpenShell（10 月 21 日）**：企业治理下沉到运行时与硬件，Arc 给目标不给步骤、本地优先推理、随 EmployeeWorks 三档 SKU 不单独收费；1 秒级撤销与硅上执行所依赖的 AI Passport 属未来版本。
4. **编码 Agent 的权限与自治边界周**：Claude Code 六个版本密集修沙箱/权限，Codex 把企业 MCP 授权与凭据遮蔽放进同一版，Antigravity 给 hook 增加最新指令审查；Replit 反向把自治推到自动改生产并发布。
5. **OpenClaw 运行时基线与 Hermes 迁移**：OpenClaw 把“Agent 运行时 = 有状态服务”做实，Hermes 用 `import-agent` 与 core→plugin 剥离降低迁移成本；AutoGen 官方归档，开源框架的迁移成本正被当竞争武器。

候选但未入五条主线的生态信号：OpenCode 的 `metadata.keepID` 引用式压缩、AutoGen 归档后转向 Agent Framework、ContractBench 的 7 个模型全部低于 60%、AfterDeleteBench 与 Post-Audit Mirage 对记忆删除与离线审计的原理性结论。

## 产品雷达与观察名单

有本周实质增量的产品包括 Claude Duet、智谱 AutoClaw、Claude Code、Codex、OpenCode、Devin Desktop、Replit Agent、Gemini CLI→Antigravity CLI、Harvey Graph 与 ServiceNow Arc。结构性事件有 Gemini CLI 消费线迁往 Antigravity（企业线保留）、Windsurf 更名 Devin Desktop、Roo Code 归档、AutoGen 归档。

观察名单里，Cursor 窗口内无更新、10 月发布节奏放缓；Cline 无发版；OpenAI Operator/ChatGPT Agent 的 release notes 正文截断，未取得 10 月条目；Google Mariner/Gemini Agent 与 Salesforce Agentforce 没有窗口内增量。静默名单包括 Aider、Sierra、Glean、Microsoft Copilot Agents、字节 Coze、Perplexity Comet、Manus、Genspark、Kimi、Qwen、LlamaIndex、MetaGPT、SuperAGI，以及 SWE-bench、OSWorld、WebArena、GAIA、τ-bench 等评测面——未见窗口内新纪录。静默不等于需求转弱，但也不把热度当进展。

## 生态位：四段价值链同时位移

把本周对象放回链条看，四段同时在动。编码 Agent 段从“补全质量”转向“对运行中的系统负责”：Claude Code 的 Monitor、Cursor 的 Cloud Agents、Replit 的 Monitoring Agent 都在把执行位置往云端与生产推，价值从编辑器席位转向可审计的后台执行与托管运维。上下文层从检索转向“结构 + 权限”：Harvey 用图与伦理隔离替代 flat retrieval，Glean 用权限镜像与记忆层做底座，OpenCode 用 keepID 引用式压缩降低长会话冗余；增量价值落在“开工前知道多少”，而不是一次回答多聪明。

协议身份段从工具调用转向凭证与撤销：MCP 把 agent identity 列为首要域，ServiceNow 用 AI Passport 做专有背书记录，Sierra 的 PAP 试图连接企业 Agent 与个人 Agent。这一段尚未定局，但对下游的影响最直接——谁的凭证被非发起方实现，谁就掌握企业 Agent 的准入权。企业治理段则从流程审批转向运行时与硬件执行：Control Tower 定策略、OpenShell 在运行时拦截、DPU 提供硬件信任根，可撤销性成为可采购的产品属性。

商业化形态同步变化。Sierra 的 results-based 计费、Replit 的托管运维、ServiceNow 把身份凭证/执行边界/可撤销性做成产品，说明计费单位正从“席位”转向“托管生产”与“治理品类”。开源框架被大模型厂商当作分发渠道：AutoClaw 基于 OpenClaw 封装，本地 Agent 的落地摩擦从“配环境”降到“装软件”，这会同时扩大需求侧与供应链风险。

## 下周观察点

1. 自治等级是否会标准化：Duet 的“不可逆动作必须审批 + 证券交易硬红线”与 AutoGPT 的“按动作代价分级”是否被其他框架抄成通用语义；Replit auto-publish 是否公开拦截率与回滚数据。
2. 身份凭证的两条路线谁被非发起方实现：MCP 的 DPoP、Workload Identity Federation、ID-JAG，与 ServiceNow AI Passport 专有凭证；Workday 收购 ConductorOne 的后续整合。
3. MCP Tasks 扩展是否进规范：无状态化后 MRTR + Tasks + subscriptions/listen 的客户端成熟度，以及工具面膨胀下的渐进式发现。
4. Hermes v0.23.0 是否给出自进化评测口径；Agent Framework 的 MCP 2.x 迁移指南与 AutoGen 用户迁移路径。
5. Dify 1.18 的 v2 快照转换在真实自建环境的反馈；browser-use 重放是否落为稳定 API。
6. 企业侧可核数字：ServiceNow 10 月 28 日 Q3 财报的 AI ACV 与 Arc 采用；Harvey、Glean、Sierra 的客户数与单价是否披露。
7. 记忆删除与审计的工程化：是否出现供应商提供“派生数据血缘 + 级联删除 + 在线监控 + 无法判定状态”的完整公开材料。

## 本周覆盖与取证边界

本周固定对象覆盖情况：编码 Agent 与 CLI/IDE 侧 9 个对象加 1 个评测面全部核验，其中本周有实质增量 5 个、结构性有料 2 个、观察 2 个、静默 1 个；开源框架侧共扫描 15 个，有料 9 个、观察 2 个、静默 4 个；通用 Agent 侧 7 类全部过一遍，但只有 2 类有本周增量，实质覆盖约 2/7（≈29%）；企业、协议与评测侧 12 项，有料 6 个、观察 1 个、静默 5 个。通用 Agent 侧未达 80% 目标，原因是本周确为发布淡季，多数厂商动作集中在 9 月末至 10 月上旬的 2.0 大版本，落在窗口之外，不是检索放弃。

主要缺口按对象记在对应段落：Cursor 官方 changelog 不含条目日期，本周判定依赖第三方聚合；OpenAI release notes 正文在 750KB 处截断；Perplexity changelog 返回 403；ServiceNow 官方新闻稿页 Cloudflare 403，正文经镜像与摘要双处核对；Replit 的效果主张、各产品完成率、客户数与定价多数未公开；LlamaIndex 的提交数与 `pushed_at` 矛盾未取得解释；ADK 版本日期列表与正文不一致；CrewAI 与 ADK 的“jev”未取得统一说明。已隔离、不采用的三条矛盾是：第三方“Aider 10 月 22 日发布 V2”、第三方“Claude Opus 5 达 96%”、第三方“Mariner 已关停”的转述。

## 主要来源

编码 Agent：[Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)、[claude-code npm](https://registry.npmjs.org/@anthropic-ai/claude-code)、[Codex Releases](https://github.com/openai/codex/releases)、[Cursor changelog](https://cursor.com/changelog)、[Cursor Projects](https://cursor.com/changelog/projects)。

[Gemini CLI Releases](https://github.com/google-gemini/gemini-cli/releases)、[Antigravity CLI Releases](https://github.com/google-antigravity/antigravity-cli/releases)、[Google 迁移公告](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)、[OpenCode changelog](https://opencode.ai/changelog)、[OpenCode 仓库](https://github.com/anomalyco/opencode)。

[Devin Desktop changelog](https://docs.devin.ai/desktop/changelog)、[Aider PyPI](https://pypi.org/pypi/aider-chat/json)、[Cline Releases](https://github.com/cline/cline/releases)、[Roo Code 仓库](https://github.com/RooCodeInc/Roo-Code)、[Replit Monitoring Agent](https://replit.com/blog/replit-monitoring-agent)、[SWE-bench](https://www.swebench.com/)。

开源生态：[OpenClaw v2026.10.7](https://github.com/openclaw/openclaw/releases/tag/v2026.10.7)、[OpenClaw 仓库](https://github.com/openclaw/openclaw)、[Hermes v0.22.5](https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.5)、[Hermes README](https://github.com/NousResearch/hermes-agent)、[LangGraph 1.2.17](https://github.com/langchain-ai/langgraph/releases/tag/1.2.17)。

[ADK v2.13.0](https://github.com/google/adk-python/releases/tag/v2.13.0)、[Dify 1.18.0](https://github.com/langgenius/dify/releases/tag/1.18.0)、[OpenHands v1.29.0](https://github.com/OpenHands/OpenHands/releases/tag/v1.29.0)、[AutoGen README](https://github.com/microsoft/autogen)、[Agent Framework 1.23.0](https://github.com/microsoft/agent-framework/releases/tag/python-1.23.0)。

[CrewAI 1.15.29](https://github.com/crewAIInc/crewAI/releases/tag/1.15.29)、[AutoGPT beta v0.9.0](https://github.com/Significant-Gravitas/AutoGPT/releases/tag/autogpt-platform-beta-v0.9.0)、[OpenAI Agents SDK commit](https://github.com/openai/openai-agents-python/commit/12ce34d)、[browser-use commit](https://github.com/browser-use/browser-use/commit/3df5806)、[LlamaIndex 仓库](https://github.com/run-llama/llama_index)。

通用与企业 Agent：[Claude Duet](https://claude.com/resources/articles/claude-duet)、[Claude Release notes](https://support.claude.com/en/articles/12138966-release-notes)、[AutoClaw 产品介绍](https://autoclaw.zhipuai.cn/blog/news/autoclaw-product-introduction/)、[ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)、[dots](https://openai.com/index/introducing-dots/)。

[Perplexity changelog](https://www.perplexity.ai/changelog)、[Manus 博客](https://manus.im/blog)、[Kimi 资讯](https://www.kimi.com/news)、[Sierra PAP](https://sierra.ai/blog/introducing-personal-agent-protocol)、[Glean 新闻室](https://www.glean.com/press)、[Harvey Graph](https://www.harvey.ai/blog/improving-agent-accuracy-with-harvey-graph)。

[Artificial Lawyer 2026-10-23](https://www.artificiallawyer.com/2026/10/23/grok-top-for-contracts-al-on-hols-harvey-agents/)、[ServiceNow Arc 全文核对](https://explainx.ai/blog/servicenow-arc-ga-personal-enterprise-agent-nvidia-openshell-ai-passport-revocation-one-second-2026)、[ServiceNow 新闻稿](https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-delivers-industry-first-personal-enterprise-agent-and-policy-enforcement-with-NVIDIA-extending-AI-governance-across-software-and-silicon/)、[Coze 更新日志](https://docs.coze.cn/recent-updates)。

协议与评测：[MCP 路线图](https://blog.modelcontextprotocol.io/posts/mcp-roadmap/)、[MCP 仓库 commits](https://github.com/modelcontextprotocol/modelcontextprotocol/commits)、[ContractBench](https://www.ivo.ai/research/ivo-micro1-contractbench)、[EpiSEM-Bench](http://arxiv.org/abs/2610.31650v1)、[AfterDeleteBench](http://arxiv.org/abs/2610.31366v1)。

[When Is a Memory Safe Enough to Act On](http://arxiv.org/abs/2610.31446v1)、[Post-Audit Mirage](http://arxiv.org/abs/2610.31130v1)、[AgentPhishing](http://arxiv.org/abs/2610.31404v1)。
