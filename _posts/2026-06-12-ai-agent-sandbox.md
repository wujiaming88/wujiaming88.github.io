---
title: "AI Agent 的沙箱战争：从 chroot 到 Firecracker，一文讲透 Agent 安全地基"
date: 2026-06-12 12:30:00 +0800
categories: [AI]
tags: [AI Agent, Sandbox, 沙箱, Codex, Claude Code, OpenClaw, Google ADK, E2B, Firecracker, gVisor, microVM, WASM, seccomp, Landlock, Seatbelt, 安全, MCP, 技术研究]
header:
  overlay_image: /assets/images/posts/2026-06-12-ai-agent-sandbox-header.png
  overlay_filter: 0.45
  caption: "Agent 在一个透明的玻璃沙盒里安全地工作——这正是沙箱的本质"
excerpt: "大模型生成的代码本质上是「不可信输出」，一次 prompt injection 就足以泄露你的 SSH 私钥、删掉主目录或向攻击者「打电话回家」。沙箱把 Agent 的「意图信任」问题转化为「边界强制」问题——你不再赌它不作恶，而是赌它越界时会被内核挡住。这是一篇写给技术决策者的沙箱全景研究：从 chroot 到 Firecracker microVM 的演进、七类隔离技术的原理与权衡、Codex/Claude Code/OpenClaw/Google ADK/E2B 等主流方案横评，以及机密计算与 MCP 时代的未来。"
toc: true
toc_sticky: true
---

> 一句话定位：**沙箱是 Agentic AI 落地的「安全地基」。** 大模型生成的代码与工具调用本质上是**不可信输出**，必须在隔离环境中执行——否则一次 prompt injection 就足以泄露 SSH 私钥、删除主目录，或向攻击者服务器「打电话回家」。

---

## 引子：为什么 Agent 一定要住进沙箱

传统软件里，代码是工程师写的，你信任写代码的人。Agentic AI 把这个前提打破了：**代码是大模型现场生成的，工具调用是模型现场决定的**。模型可能被一段藏在网页、文件或工具返回值里的 prompt injection 操纵，于是「帮我整理一下这个仓库」可能在某个环节变成「把 `~/.ssh/id_rsa` POST 到某个陌生域名」。

沙箱的价值，是把问题的性质换掉：

> 它把 Agent 的「**意图信任**」问题，转化为「**边界强制**」问题。你不再赌 Agent 不作恶，而是赌它**越界时会被内核挡住**。

这一字之差，是整个 Agent 安全工程的分水岭。下面这篇报告，就沿着「演进 → 原理 → 横评 → 权衡 → 现状 → 未来」六条线，把 AI Agent 沙箱这套技术体系彻底讲透。

---

## 一、当前格局：两条主线 + 一句选型判据

2026 年的 Agent 沙箱格局，可以干净地切成两条主线：

**主线一 · 本地 Coding Agent（Codex CLI / Claude Code / OpenClaw）走「OS 原语轻量隔离」路线。** 它们不起容器，直接用 **macOS Seatbelt（sandbox-exec）+ Linux Landlock/seccomp/bubblewrap + 网络代理白名单**，把开销压到接近零，再配合 **approval（人机审批）模型** 平衡自治与安全。核心矛盾是「减少审批疲劳」与「边界正确性」。

**主线二 · 云端沙箱即服务（E2B / Daytona / Modal / Cloudflare / Northflank）走「轻量级虚拟化」路线。** 它们以 **Firecracker microVM** 或 **gVisor 用户态内核** 为隔离边界，主打 **~150ms 冷启动 + 硬件级/内核级多租户隔离 + 弹性扩容**。核心矛盾是「安全强度（独立内核）」与「冷启动延迟/密度」。

把一切浓缩成给决策者的一句话：

> **选型先回答一个问题——我跑的是「我自己的」代码，还是「任意租户的不可信」代码？** 前者用 OS 原语沙箱就够了；后者必须上 microVM（独立内核）。容器（共享内核）在多租户不可信场景下是**已知不充分**的。

---

## 二、演进史：从 chroot 到 Agent 原生沙箱

隔离技术的演进，是一部「边界不断下沉、开销不断压缩」的历史。AI Agent 只是把这条曲线推到了一个新的工作点。

**第一代 · 进程级隔离（1979–2008）。** `chroot`（1979）只改文件系统根，不隔离进程/网络/用户，**从来不是安全边界**（root 可逃逸）。FreeBSD Jails（2000）、Solaris Zones（2004）是第一批「OS 级容器」。Linux 在 2002–2008 陆续合入 **namespaces**（mount/PID/net/user…）与 **cgroups**，为容器奠基。

**第二代 · 容器化（2013–2017）。** Docker（2013）把 namespaces + cgroups + 镜像分发包装成开发者体验革命。但关键认知是：**容器共享宿主内核**。容器隔离 = 内核里的访问控制，一旦内核有漏洞（Dirty COW 等 CVE），就可能**容器逃逸**到宿主。对「运行自己的代码」足够，对「运行任意不可信代码」不够。

**第三代 · 轻量级虚拟化 / 用户态内核（2017–2020）。**

- **gVisor**（Google，2018 开源）：用 Go 写了个**用户态内核 Sentry**，拦截容器系统调用并在用户态重新实现，宿主内核暴露面大幅缩小——「像内核一样面对工作负载，像普通用户进程一样面对宿主内核」。
- **Firecracker**（AWS，2018 开源）：用 Rust 写的极简 VMM，基于 KVM，**每个 microVM 独立 guest 内核**，启动 ~125ms、内存开销 <5MiB，单机可跑数千个。AWS Lambda / Fargate 的底座。
- **Kata Containers**（2017）：OCI 兼容的「看起来像容器、实则每个 Pod 一个轻量 VM」。

**第四代 · Agent 原生沙箱即服务（2023–2026）。** **E2B**（2023）把 Firecracker microVM 包装成「给 AI Agent 的 SDK」，~150ms 冷启动、按需创建销毁。**Daytona**、**Modal**、**Cloudflare Sandbox SDK**、**Northflank** 相继入场。同期，本地 Coding Agent 走另一条路：**OpenAI Codex CLI** 与 **Anthropic Claude Code** 不依赖容器，直接用 OS 原生沙箱 + 网络代理，2025 年底 Anthropic 把它开源为 **sandbox-runtime（srt）**。

演进的底层逻辑：边界从「文件系统视图」→「内核命名空间」→「用户态内核/独立 guest 内核」→「硬件信任根（SEV/TDX）」层层下沉；启动开销从「秒级 VM」被压到「百毫秒 microVM」乃至「零开销 OS 原语」。AI Agent 的特殊性在于：**它需要频繁、短时、大规模地创建一次性执行环境**，于是「冷启动时间」从一个边缘指标，跃升为**头等设计约束**。

---

## 三、底层技术体系：七类隔离原理详解

沙箱的本质是「在某一层架设强制边界」。下面按隔离边界所处的层次，从浅到深拆解七类技术。

### 3.1 OS 级隔离原语（进程层边界）

这是最轻量的一类：不虚拟化、不起容器，直接用内核特性约束一个进程及其子进程树。

- **seccomp-bpf**：用 BPF 程序过滤进程能发起的 **syscall**。可以把「能调用哪些系统调用」收窄到一个白名单，是 Docker 默认防线之一，也是 Codex Linux 的组成部分。局限：它只懂 syscall 号与参数，不懂「这个 open 打开的是不是敏感文件」这类应用语义。
- **Linux namespaces**：把进程对 mount / PID / network / user / UTS / IPC 的「视图」隔离开。容器的基石。
- **cgroups**：限制 CPU / 内存 / IO 等资源用量，防资源耗尽。
- **Landlock LSM**（Linux 5.13+）：让**非特权进程**为自己声明「能访问哪些文件路径」的能力边界，恰好补上 seccomp 不懂文件语义的短板。Codex Linux 用它做文件系统隔离。
- **AppArmor / SELinux**：传统强制访问控制（MAC），按 profile/label 管控，配置复杂、多由发行版预置。
- **macOS Seatbelt（`sandbox-exec`）**：苹果的进程级 MAC 沙箱，用 Scheme 风格 profile 描述允许的文件/网络/操作。Codex、Claude Code、srt 在 macOS 上都用它。短板是**网络往往是「全有或全无」**，且 profile 容易写错。

> 一句话本质：OS 原语的根本局限在于它工作在 **syscall 层，不懂应用语义**。这就是为什么所有本地沙箱最终都走向「OS 原语管文件 + 用户态代理管网络」的混合架构——光靠内核挡不住「连到哪个域名」这种应用层语义。

### 3.2 容器（Docker/OCI）与其对 Agent 的不足

容器 = namespaces + cgroups + 镜像。开发体验极好，但**共享宿主内核**这一条决定了它的安全天花板：内核一个提权漏洞，就可能从容器逃逸到宿主，进而波及**同宿主的所有其他容器**。所以在「跑任意不可信代码 + 多租户」的场景下，容器是**已知不充分**的——这也是为什么 Daytona 这类用容器换冷启动速度的方案，自己也额外提供 gVisor 选项。

### 3.3 轻量级虚拟化 / microVM

- **Firecracker**：Rust 写的极简 VMM，基于 KVM，**每个 microVM 一个独立 guest 内核**。逃逸要先攻破 guest 内核、再攻破 KVM/VMM，攻击面比共享内核小得多。~125ms 启动、<5MiB 开销、单机数千实例——它是唯一同时满足「**强隔离 + 低启动 + 高密度**」这个不可能三角的成熟方案，所以成了云端事实标准。
- **gVisor**：用户态内核 Sentry 拦截并重新实现 syscall，不需要 KVM/裸机，兼容容器生态，隔离强于容器。代价是 syscall 密集型负载有性能损耗、部分兼容性问题。Modal、Google Cloud Run、部分 Daytona 采用。
- **Kata Containers / Cloud Hypervisor**：OCI 兼容的轻量 VM 路线，「长得像容器、实则是 VM」。

### 3.4 WASM 沙箱（语言运行时边界）

WebAssembly + **WASI** 提供**能力安全（capability-based）**模型：模块默认什么都不能碰，宿主显式「捣洞」授予某个目录、某个 socket 的能力。线性内存天然隔离、**微秒级启动**、可嵌入宿主进程。wasmtime 是主流运行时。对「工具/MCP 调用粒度」的细粒度隔离极契合——这是 MCP 时代值得押注的方向（见下文 Wassette）。

### 3.5 浏览器内沙箱

- **WebContainers（StackBlitz）**：把 Node.js 运行时编译进浏览器，靠浏览器同源策略 + WASM 线性内存做隔离，对宿主机器零接触。
- **Pyodide**：CPython 编译成 WASM 跑在浏览器里。首加载偏慢（秒级），但「连服务器都不需要」。

### 3.6 网络隔离与出口控制

这是 Agent 沙箱里最容易被忽视、却最致命的一环——**数据外泄（exfiltration）几乎都走网络**。手段包括：**egress filtering（出口过滤）**、**代理白名单**（只允许连特定域名，由用户态代理仲介并处理新域名确认）、**DNS 控制**。本地 Agent 普遍用「Unix domain socket → 沙箱外代理 → 按域名 allowlist 放行」这套，正是为了补 OS 原语在网络语义上的短板。

### 3.7 文件系统隔离

**overlayfs / 写时复制（CoW）**让沙箱在一个只读基础镜像上叠加可写层，用完即弃；**只读挂载**保护宿主关键路径；**bind mount + allowlist** 精确控制可读可写目录。一次性 + CoW 是 Agent 沙箱的标配——每个任务一个干净环境，跑完丢弃。

### 3.8 七类技术权衡对比表

| 技术 | 隔离边界 | 隔离强度 | 启动/开销 | 多租户不信任 | 典型使用者 |
|---|---|---|---|---|---|
| seccomp-bpf | syscall 过滤 | 低（单独） | ~0 | 否（需叠加） | Docker 默认、Codex Linux |
| namespaces+cgroups | 内核视图/资源 | 低-中 | ~0 | 否 | 所有容器 |
| Landlock | 文件路径能力 | 中（补 seccomp） | ~0 | 否 | Codex Linux |
| macOS Seatbelt | 进程（MAC） | 中（易写错） | ~0 | 否 | Codex/Claude Code/srt macOS |
| Docker 容器 | 共享内核 | 中（有逃逸史） | 毫秒-秒 | 不推荐 | Daytona/Cloudflare 默认 |
| gVisor | 用户态内核 | 高 | ~百毫秒 | 是 | Modal/Google Cloud Run |
| Firecracker microVM | 独立内核+KVM | 最高（非 TEE） | ~125-200ms | 是 | E2B/AWS Lambda/Northflank |
| WASM/WASI | 语言运行时 | 中-高（能力） | 微秒 | 是（进程内） | Wassette/Fastly |
| 浏览器内(WASM) | 同源+线性内存 | 高（对宿主） | 秒级首加载 | 是 | WebContainers/Pyodide |
| TEE (SEV/TDX) | 硬件加密内存 | 最高（含宿主） | VM 级 | 是（含云厂商） | 机密计算场景 |

> 「隔离强度」的本质，取决于**共享了什么**：共享进程地址空间（无）< 共享内核（容器）< 共享虚拟化层（gVisor/microVM）< 共享物理 CPU 但加密内存（TEE）。共享越少，隔离越强，代价越高。

---

## 四、主流 Agent 沙箱方案横评

### 4.1 OpenAI Codex（Codex CLI / Codex cloud）

**隔离架构**：Codex 不起容器，采用**平台原生强制**，所有子进程继承边界（git、包管理器、测试运行器皆受限）：

- **macOS**：Seatbelt，通过 `sandbox-exec -p <profile>` 启动，按 `--sandbox` 模式生成 profile。源码中 `spawn_command_under_seatbelt` 硬编码 `/usr/bin/sandbox-exec`，注入 `CODEX_SANDBOX=seatbelt` 环境变量；writable roots 中的 `.git` 被特地抑为只读。禁网时直接不加网络权限（Seatbelt 默认拒绝）。
- **Linux**：默认 **bwrap（bubblewrap）+ seccomp**，文件系统用 **Landlock**。**默认即沙箱（opt-out 而非 opt-in）**。缺 `bwrap` 时回退到内置 helper（需非特权 user namespace）。
- **Windows**：PowerShell 用原生 Windows sandbox，WSL2 复用 Linux 实现。

**权限/approval 模型**（沙箱与审批是两个正交控制）：

- sandbox_mode：`read-only` / `workspace-write`（默认）/ `danger-full-access`。
- approval_policy：`untrusted` / `on-request`（默认，越界才问）/ `never`。
- 越界时触发「升级流」：检测退出码/stderr 判断是否沙箱拒绝 → 请求审批 → 放宽策略重试。2026 新增 `approvals_reviewer: auto_review`，可把审批交给一个 reviewer agent 而非人。

**隔离边界**：进程级（OS 原语）。**冷启动**：近乎零。**开源**：Codex CLI 是开源 Rust（codex-rs）。Codex cloud 则是云端隔离 VM（每任务独立环境）。

> **洞察**：Codex 是「本地 OS 沙箱」的教科书实现——默认即沙箱、跨三平台原生、沙箱与审批解耦。但它继承了 Seatbelt 的先天短板（网络全有或全无），这正是它用「禁网 + 越界审批」而非「细粒度域名白名单」的原因。

### 4.2 Claude Code（Anthropic）

**演进**：Claude Code 默认是**基于权限的模型**（默认只读，改动/跑命令前问，只自动放行 echo/cat 等安全命令）。但「不停点接受」导致审批疲劳。2025 年底推出**沙箱化 bash 工具**，内部数据显示**安全地减少 84% 的权限提示**。

**隔离架构**（与 Codex 趋同，但网络更强）：基于 OS 原语——**Linux bubblewrap + macOS Seatbelt**，覆盖 Claude 直接操作及其派生的任何脚本/子进程。两道边界：

- **文件系统隔离**：只能读写工作目录，越界写在 syscall 层报 `Operation not permitted`。
- **网络隔离**：仅允许通过 unix domain socket 连到沙箱外代理，代理按域名 allowlist 放行并处理新域名的用户确认。企业可定制代理规则。

**开源：sandbox-runtime（srt）**——`@anthropic-ai/sandbox-runtime`，Beta 研究预览，独立 CLI+库，可沙箱任意进程/agent/本地 MCP server/bash。secure-by-default：进程以最小权限启动，需要哪里才「捣洞」。

- 文件：写是 allow-only（默认全拒），读是 deny-then-allow（与写相反）。
- 网络：allow-only，空 allowlist = 无网。Linux 移除 network namespace，流量走 bind-mount 进沙箱的 Unix socket 代理；macOS 走 localhost 特定端口。HTTP 走 HTTP 代理、其他 TCP 走 SOCKS5。

**沙箱环境分层**（按 threat model 选）：内置沙箱 bash（低隔离、无需容器）→ sandbox runtime（覆盖整个 Claude Code 进程含 MCP/hooks）→ dev container/Docker → 专用 VM（跑不可信仓库）→ Claude Code on the web（Anthropic 托管的完整 OS）。

**已知局限**：`/sandbox` 是 opt-in（不开就是裸 bash）；`sandbox.denyRead` 不拦 Claude 的 Read 工具；domain fronting、Unix socket 提权、Linux 嵌套沙箱较弱；与 Docker/Watchman 不兼容。

**隔离边界**：进程级。**冷启动**：近乎零。**开源**：srt 开源，Claude Code 本体闭源。

### 4.3 OpenClaw（开源 Agent 框架）

**信任模型（最关键的设计选择）**：OpenClaw 明确自定位为**个人助理信任模型**——每个 gateway 一个受信任操作者边界。文档直言：OpenClaw **不是**面向多个互不信任用户共享一个 agent 的敌对多租户安全边界。这与 E2B/Modal 这类 SaaS 多租户沙箱是根本不同的定位：OpenClaw 解决的是「受信任操作者的 Agent 不要误伤宿主」，而非「隔离互不信任的租户」。

**沙箱后端**：

- **Docker**：默认容器沙箱，按 session/agent 范围创建。
- **SSH**：把执行放到远程主机。
- **OpenShell（remote）**：插件化远程沙箱，可配 mode/policy/from。
- `openclaw sandbox explain` 可检查生效的沙箱模式/范围/工作区访问/工具策略/elevated 门控。

**执行隔离与 approval 体系**：exec 在 gateway/node 上默认允许无提示执行（受信任单操作者场景的有意 UX 默认，可收紧）。exec 审批（allowlist + ask）是「操作者意图护栏」，文档明确声明**不是敌对多租户隔离**——强边界请用沙箱与主机隔离。`openclaw security audit` 可检测 auth 暴露、审批过宽、文件权限等 footgun。

**隔离边界**：容器（Docker）或远程主机（SSH/OpenShell）。**开源**：是。**适用**：个人/团队受信任边界内的多 Agent 助理。

> **洞察**：OpenClaw 与 Codex/Claude Code 设计哲学不同——后两者把「不信任 LLM 输出」作为威胁模型核心，用 OS 原语默认硬挡；OpenClaw 把「受信任操作者」作为前提，沙箱是可选加固。对跑不可信代码场景，应显式启用 Docker 后端 + 收紧 exec 审批。

### 4.4 Google ADK（Agent Development Kit）

**定位**：ADK 是开源多 Agent 框架，沙箱能力主要通过两条路径提供：

- **BuiltInCodeExecutor**：让 agent 写 Python 并在「安全隔离沙箱」执行。
- **Vertex AI Agent Engine Code Execution**（2026 preview）：托管服务，提供安全沙箱跑 LLM 生成代码；另有 Agent Runtime Code Execution tool（低延迟）、GKE Code Executor（自托管在 GKE 上）。可向沙箱馈送 flat files 而不经 LLM context window。

**隔离边界**：云端托管容器/沙箱（底层未完全公开，推测为 GCP 上的 gVisor/容器体系，与 Cloud Run 一脉相承，**未公开确认**）。**开源**：ADK 框架开源，沙箱后端为托管服务。

> 注：ADK 的沙箱实现细节是本报告中**最不透明**的——Google 未公开底层隔离原语，仅能从「Vertex 托管、与 Cloud Run 同源」推断，这与 Codex/srt 完全开源可查源码形成鲜明对比。

### 4.5 沙箱即服务（SaaS）玩家

**E2B**：最纯粹的「Agent 专用沙箱」。每个沙箱一个 **Firecracker microVM**（独立内核、硬件级隔离），冷启动 ~150-200ms，运行时动态定义。开源（可自托管）。宣称 88% 财富 100 已注册。**适用**：不可信代码多租户执行的事实标准。

**Daytona**：2025 年初从开发环境转型 AI 沙箱。主打 **sub-90ms 冷启动**，但默认用 **Docker 容器（共享内核，隔离弱于 microVM）**，部分采用 gVisor。**权衡**：速度换隔离强度。

**Modal**：serverless 计算平台，沙箱用 **gVisor** 隔离，可扩到 50,000-100,000+ 并发，原生 GPU，SOC 2 Type 2、HIPAA（企业）。

**Cloudflare Sandbox SDK**：基于 Cloudflare Containers（330+ 城市边缘），TypeScript API 从 Workers 起隔离 Linux 容器，集成 Workers AI/Durable Objects/R2。**适用**：边缘、与 Workers 生态紧耦合的 Agent。

**Northflank**：多后端（**Firecracker/Kata/gVisor** 可选），BYOC（自带云），SOC 2 Type 2，无强制时长限制。**适用**：合规/自控云场景。

**其他**：Devin/Cognition（每任务完整沙箱 VM）；Cursor cloud agents、OpenAI Codex cloud（独立 VM、可并行多 ticket）；Replit Agent；Morph Sandbox（VM/Infinibranch、快照+分支、~250ms、适并行探索）；Koyeb、Blaxel、CodeSandbox SDK、Fly.io Sprites。**LangChain/LangGraph 本身不提供沙箱**，而是集成 E2B/Modal/Daytona 作为代码执行工具。

### 4.6 横评对比矩阵

| 方案 | 隔离层级 | 冷启动 | 网络策略 | 开源/闭源 | 多租户不信任 | 适用场景 |
|---|---|---|---|---|---|---|
| Codex CLI | 进程(Seatbelt/Landlock+seccomp) | ~0 | 禁网+越界审批 | 开源(Rust) | 否 | 本地Coding |
| Codex cloud | 独立VM | VM级 | 可配 | 闭源 | 是 | 云端并行 |
| Claude Code(srt) | 进程(bwrap/Seatbelt) | ~0 | 代理域名白名单 | srt开源 | 否 | 本地Coding |
| OpenClaw | 容器/SSH/OpenShell | 容器级 | 随后端 | 开源 | 否(个人助理) | 受信任多Agent |
| Google ADK | 托管容器/沙箱 | 未公开 | GCP管理 | 框架开源 | 是(依GCP) | 企业Vertex |
| E2B | Firecracker microVM | ~150ms | 可配 | 开源 | 是 | 不可信代码SaaS |
| Daytona | Docker(部分gVisor) | <90ms | 可配 | 部分开源 | 中(容器) | 持久化快启动 |
| Modal | gVisor | 快 | 可配 | 闭源 | 是 | 大规模+GPU |
| Cloudflare | 容器(边缘) | 快 | Workers集成 | SDK开源 | 中 | 边缘Agent |
| Northflank | FC/Kata/gVisor | 可配 | 可配 | 闭源 | 是 | BYOC/合规 |
| Devin | 完整VM | VM级 | 可配 | 闭源 | 是 | 自主软件工程 |

---

## 五、关键权衡与设计模式

**5.1 安全 vs 延迟（冷启动是头等指标）。** Agent 需频繁创建一次性环境，冷启动决定「用户问一句要等多久」。谱系：OS 原语(~0) < WASM(微秒) < 容器(毫秒) < gVisor(~百毫秒) < Firecracker(~125-200ms) < 传统 VM(秒)。隔离越强往往启动越慢。应对手段：**预热池 + 快照/分支**（Morph Infinibranch、Firecracker snapshot 恢复）把有效冷启动压到几十毫秒。

**5.2 本地 vs 云端。** 本地（Codex/Claude Code/OpenClaw）低延迟、贴近文件、零额外基建，但隔离受限于 OS 原语且共享个人机器；云端（E2B/Modal/Daytona/Devin）强隔离、可并行扩展，但有往返延迟与成本。

**5.3 approval 人机协同。** 沙箱定技术边界，approval 决定何时停下询问。核心矛盾是**审批疲劳**。趋势是「扩大沙箱边界 + 减少审批」（Anthropic 84%、Codex 默认沙箱），以及 **auto_review（代理人审批代理人）** 新范式。

**5.4 核心设计模式总结。**

1. **默认隔离（opt-out）** 优于「记得开」——这是 Codex 的画龙点睛之笔。
2. **文件 + 网络双隔离，缺一不可**。
3. **沙箱与审批解耦**（技术边界 vs 策略决策）。
4. **一次性 + CoW 文件系统**（用完即弃）。
5. **用代理仲介网络**来补 OS 原语的语义短板。

---

## 六、现状研判（2025-2026）

**谁是赢家？**

- **云端不可信代码多租户执行：Firecracker microVM 是事实标准。** 独立 guest 内核 = 真正的隔离边界，~125ms 启动 + <5MiB 开销让「虚拟机级隔离」第一次与「容器级密度」可兼得。E2B、Northflank、AWS Lambda/Fargate 都用它。这就是「Firecracker 成为主流方向」的底层逻辑：它是唯一同时满足「强隔离 + 低启动 + 高密度」三角的成熟方案。
- **gVisor 是重要折中项**：不需 KVM/裸机、兼容容器生态、隔离强于容器，Modal/Google/部分 Daytona 采用。代价是 syscall 密集型负载的性能损耗与兼容性。
- **本地 Coding Agent：OS 原生沙箱 + 代理白名单 + approval 三件套趋同。** Codex、Claude Code 独立收敛到几乎一样的架构——这种**跨公司收敛本身，就是「这是正确路线」的最强信号**。

**为什么容器在衰落（作为不可信边界）？** 共享内核是原罪。Daytona 用容器换冷启动，但它自己也提供 gVisor 选项。

**一个清醒的认识**：没有银弹。Firecracker 仍面临微架构侧信道（Spectre 变种）；Seatbelt policy 易写错；srt 自述 domain fronting / Unix socket 提权可绕过。**沙箱是概率降低损失，不是绝对保证。**

---

## 七、未来趋势

**7.1 Confidential Computing / 硬件隔离（SEV-SNP / TDX / GPU TEE）。** 现有沙箱（含 microVM）都默认信任宿主内核与云厂商。机密计算把边界推到**硬件信任根**：AMD SEV-SNP / Intel TDX 用 CPU 加密内存，连宿主 OS / hypervisor / 云运维都看不到 guest 明文，并提供硬件 attestation。NVIDIA H100 GPU TEE 可与 CPU TEE 组合做机密 AI。对 Agent 的意义：当你跑的代码/数据连云厂商都不能信时（金融/医疗敏感），TEE 是下一道边界。局限：仍面临微架构侧信道与性能开销。

**7.2 MCP 时代的工具隔离。** MCP 让 Agent 接入大量第三方工具/server，每个都是潜在不可信代码路径。趋势是**沙箱下沉到单工具粒度**：Anthropic srt 明确支持沙箱本地 MCP server；Wassette 把 MCP server 编译为 WASM 组件跑。WASM/WASI 的能力安全模型在这里最契合「最小权限 + 微秒启动 + 嵌入宿主进程」。

**7.3 Agent 原生沙箱标准化。** 当前每家自建一套（Codex 一套、srt 一套、E2B SDK 一套）。srt 开源、E2B OSS、Cloudflare/Daytona SDK 都在推动「可复用沙箱抽象」。可预见会出现类似 OCI / MCP 的「Agent 沙箱接口标准」，统一描述文件/网络/资源策略。

**7.4 其他。** 冷启动继续压缩（snapshot/fork 比冷启快一个数量级）；GPU 沙箱成为 AI 负载刚需；「分支式沙箱」支持多 Agent 并行探索同一状态（Morph）。

---

## 结语：你只需要回答一个问题

把整篇报告浓缩成一个决策动作：

> **跑的是「我自己的」代码，还是「任意租户的不可信」代码？**

- 是**自己的**代码（本地 Coding Agent）→ OS 原语沙箱（Seatbelt / Landlock+seccomp / bubblewrap）+ 网络代理白名单 + approval，开销近零，够用。
- 是**任意不可信**代码（云端多租户）→ 必须上 **Firecracker microVM**（独立内核）。容器（共享内核）在这个场景已知不充分；gVisor 是可接受的折中。
- 连**云厂商都不能信** → 上 **TEE（SEV/TDX）**。

沙箱不是「锦上添花的安全选项」，而是 Agentic AI 能不能放心交付真实任务的**地基**。当 Agent 开始替你跑命令、改代码、连网络，决定你睡不睡得着的，不是模型多聪明，而是**它越界时，那道墙到底挡不挡得住**。

---

*本文为面向技术决策者的深度研究，数据截止 2026 年 6 月。技术机制以官方文档/源码为准（Codex / Claude Code / srt / Firecracker / gVisor / WASM 为一手源，可信度高）；冷启动等性能数据多为厂商自报/二手评测，存在营销成分；Google ADK 底层隔离原语未公开，相关描述为推断。*
