---
title: "Claude Code 动态工作流：当 AI 学会为每个任务现场组建团队"
date: 2026-06-04
categories: [AI]
tags: [Claude Code, Anthropic, AI Agent, 动态工作流, 多智能体, 编排]
header:
  overlay_image: /assets/images/posts/2026-06-04-claude-code-dynamic-workflows-header.png
  overlay_filter: 0.3
toc: true
toc_sticky: true
---

> Anthropic Claude Code 团队最近放出一个新能力：Dynamic Workflows。它的本质不是"又加了个功能"，而是宣告了一个范式转变——让 AI 不再在一个脑子里硬扛复杂任务，而是**自己写一套分工协作的组织架构**。这篇文章带你把它讲透。

## 摘要（TL;DR）

1. **Dynamic Workflows 让 Claude 自己写"脚手架（harness）"**——执行一个 JavaScript 文件，现场 spawn 并协调多个子智能体，为当前任务量身定制一套编排逻辑。触发词：让 Claude "make a workflow"，或直接说魔法词 `ultracode`。
2. **它要解决的是单上下文窗口的三大顽疾**：智能体偷懒（Agentic Laziness）、自我偏好偏见（Self-preferential Bias）、目标漂移（Goal Drift）。这三个词是全文最值钱的洞察——把"现象"上升成了"机制命名"。
3. **六大编排模式**：Classify-and-act、Fan-out-and-synthesize、Adversarial Verification、Generate-and-filter、Tournament、Loop-until-done。可组合，可复用。
4. **核心原理**：用多个**独立上下文窗口**的 Claude，从架构上**结构性杜绝**单窗口的失败模式，而不是靠 prompt 哀求模型"别偷懒"。
5. **代价**：Token 消耗显著增加。不是所有任务都需要——常规编码任务大多不需要五个审查员组成的陪审团。

---

## 一、问题的本质：单个脑子扛不住的三类任务

先用第一性原理把事情说透。

传统的 Claude Code 是"单上下文窗口"工作模式——**规划和执行挤在同一个脑子里**。对绝大多数编码任务，这高效又自然。但碰到三类任务，它会崩：

- **超长时程任务**（long-running）
- **大规模并行任务**（massively parallel）
- **高结构化的对抗性任务**（highly structured adversarial）

为什么会崩？因为 Claude 在单个上下文窗口里干得越久，越容易掉进三个具体的失败模式。这三个模式，是这篇文章最硬的认知贡献：

| 失败模式 | 本质 | 典型场景 |
|---------|------|----------|
| **Agentic Laziness（智能体偷懒）** | 干到一半就宣布完工 | 50 项安全审查只做了 20 项就说"搞定了" |
| **Self-preferential Bias（自我偏好偏见）** | 倾向于认可自己的产出 | 让它按 rubric 自查自纠时，它觉得自己哪儿都对 |
| **Goal Drift（目标漂移）** | 多轮之后逐渐偏离初衷，尤其在上下文压缩之后 | "不要做 X"这类约束，在一次次摘要里悄悄丢了 |

最后一条尤其值得划重点：**每一次 summarization 都是有损的**。边缘 case 的要求、"别做某事"的约束，会在压缩中蒸发。这是所有长程 Agent 系统的通病，不只是 Claude Code。

**解法**：用 workflow 编排多个独立的 Claude，每个有**自己干净的上下文窗口** + **聚焦且隔离的目标**。从架构上结构性地杜绝这三个失败模式。

这是关键的思维跃迁——**不要试图把一个模型调教得永不偷懒，而是设计一个让偷懒不可能发生的组织结构。**

---

## 二、它到底怎么跑：技术实现

Dynamic Workflows 的底层很朴素，但设计得很聪明：

- 本质是**执行一个 JavaScript 文件**，里面有几个特殊函数用来 spawn 和协调子智能体；
- 可以调用标准 JS（`JSON`、`Math`、`Array`）来处理数据；
- workflow 能**决定每个 agent 用哪个模型**（Sonnet / Opus）、**是否在独立 worktree 中运行**（隔离）——让 Claude 自己选择需要的智能水平和隔离程度；
- **可中断、可恢复**：被用户打断或退出终端后，重开 session 能从断点接着跑；
- **触发方式**：直接让 Claude "make a workflow"，或者用魔法词 `ultracode` 强制它创建一个。

和过去的"静态工作流"（用 Claude Agent SDK 或 `claude -p` 手工编排）相比，区别在于：静态工作流要覆盖所有边缘 case，所以往往写得很通用、很笨重；而**动态工作流是 Claude 现场为你这个具体场景量身定制的脚手架**。

---

## 三、六大编排模式（方法论精华）

这部分是整篇文章可迁移性最强的干货。无论你用不用 Claude Code，这六个模式都是多智能体系统设计的通用积木。

### 1. Classify-and-act（分类后行动）
用一个分类器 agent 先判断任务类型，再路由到不同的 agent 或行为。也可以把分类器放在末尾，用来决定最终输出形态。

### 2. Fan-out-and-synthesize（扇出后合成）
把任务拆成多个小步，每步跑一个 agent，最后合成结果。特别适合"步骤多"或"每步都需要干净独立上下文、避免互相污染"的场景。**synthesize 是一道同步屏障**——它会等所有 fan-out 的 agent 都完成，再把结构化输出合并成一个结果。

### 3. Adversarial Verification（对抗验证）
为每个产出 agent，再配一个独立的"对抗验证 agent"，按 rubric 或标准去挑刺。这是对抗 Self-preferential Bias 的直接武器。

### 4. Generate-and-filter（生成后过滤）
先就某个主题生成一堆想法，再按 rubric 或验证过滤、去重，最后只留下最高质量、经过检验的那些。

### 5. Tournament（锦标赛）
不分工，而是**让 agent 们竞争**。Spawn N 个 agent，各自用不同方法做同一个任务，然后用 prompt 或模型做**两两 PK（pairwise）评判**，一路淘汰到出冠军。

> 这里藏着一条认知科学的硬道理：**comparative judgment is more reliable than absolute scoring**——两两比较比绝对打分更可靠。人类和模型都更擅长回答"A 和 B 谁更好"，而不是"给 A 打几分"。Tournament 模式就建立在这个原理上。

### 6. Loop-until-done（循环直到完成）
工作量未知时，不要设固定的 pass 次数，而是**循环 spawn agent，直到满足停止条件**（不再有新发现，或日志里不再有报错）。

这六个模式不是互斥的——真正强大的 workflow 往往是它们的**组合**。

---

## 四、八大应用场景：远不止写代码

作者特别强调一句话：**workflow 对非技术工作往往更有用。** 下面这八个场景，技术与非技术各占一半。

**1. 深度研究** — Anthropic 已经在 Claude Code 里发布了 `/deep-research` skill，它就是用动态工作流实现的：扇出网络搜索 → 抓取来源 → 对抗验证每条声明 → 合成一份带引用的报告。这个套路不止用于网络搜索，也能用来从 Slack 上下文里编状态报告，或深入探索代码库去搞懂一个特性怎么实现的。

**2. 事实核查** — 想给一份报告里每一条引用的事实都核对来源？让一个 agent 找出所有事实声明，每条 spin off 一个子 agent 去逐条核实，甚至再加一个验证 agent 检查来源质量够不够高。

**3. 海量排序** — 1000+ 条数据按某个定性标准排序（比如支持工单按 bug 严重程度），单 prompt 必然质量崩坏、装不进上下文。解法是跑一个 tournament，或一条两两比较的流水线，或并行分桶排名再合并。每次比较都是独立 agent，确定性循环 hold 住整个赛程，只有当前的对阵顺序留在上下文里。

**4. 规则强制检查** — 有些规则你塞进 CLAUDE.md 它还是会漏。那就建一个 workflow，列出必须检查的规则清单，**每条规则配一个 verifier agent**。再加一个“怀疑论者”persona 子 agent 去复审这些规则，避免误报太多。反方向也成立：从你最近的会话和 code review 评论里挖出你反复做的修正，并行聚类、对抗验证（“这条规则真能防住一次真实错误吗？”），然后把幸存者蒸馏回 CLAUDE.md。

**5. 调试** — 调试的最佳实践是提出多个独立假设并逐个测试。但单上下文窗口会让 Claude 陷入自我偏好偏见。Workflow 能从结构上防止这点：让不同 agent 从**互不重叠的证据**（logs、files、data 各一个 agent）生成假设，每个假设再面对一组“验证者 + 反驳者”陪审团。这套不止能调代码——销售复盘（三月销量为什么掉？）、数据工程（管线为什么挂？）、任何 post-mortem 都适用。

**6. Triage（队列分诊）** — 每个团队都有处理不完的支持队列、bug 报告或 backlog。Triage workflow 给每一项分类、对已跟踪的去重、然后行动（尝试修复或升级给人类）。这里有个有用的安全模式叫 **Quarantine（隔离）**：禁止那些读取不可信公开内容的 agent 执行高权限动作，高权限动作交给专门负责行动的 agent。配上 `/loop` 就能让 Claude 持续干。

**7. 设计 / 命名探索** — 这类 taste-based 任务（设计、命名）最适合给一个 review agent 配 rubric。让 Claude 探索一堆方案，review agent 觉得满足标准了就算完成；也可以基于 rubric 用 tournament 排序或选择。

**8. 动态选模型** — 建一个为你的任务调优过的分类器 agent，让它先调研任务复杂度，再决定路由到 Sonnet 还是 Opus。比如“解释 auth 模块怎么工作”这个任务，最佳模型取决于 auth 模块有多少文件、代码库形态如何——分类器先做这个研究，再路由。这是省钱的关键一招。

---

## 五、安全亮点：Quarantine 隔离模式

在所有场景里，有一个设计值得单独拎出来讲——**Quarantine（隔离）模式**。

在 triage 这类要处理外部不可信内容的工作流里，Anthropic 的设计是：**读取不可信公开内容的 agent，禁止执行高权限动作**；高权限动作只能由专门的执行 agent 来做。

这其实是经典的安全分层思想在 Agent 时代的再现——把“接触不可信输入”和“拥有高权限”这两件事**在不同的 agent 上物理隔离**，从而切断 prompt injection 的攻击链。一个被注入的 agent，手里没有可以被滥用的权限；一个有权限的 agent，根本不直接接触不可信内容。

这条对任何做 Agent 安全的人都是范式级的启发：**信任边界不应该画在模型内部，而应该画在 agent 之间。**

---

## 六、关键警示与实战技巧

作者难得地诚实，专门留了一节讲“什么时候别用”和“怎么用得省”。

- ⚠️ **Token 消耗会大增**。Workflow 不是每个任务都需要。常规编码任务先问自己一句：**它真的需要更多算力吗？** 大多数传统编码任务不需要五个审查员组成的陪审团。
- ✅ **支持“快速工作流”**。Workflow 不只为大任务而生——你可以 prompt 它做一个“quick workflow”，比如对某个假设做一次轻量级的对抗审查。
- ✅ **Token 预算可控**。可以显式设上限，prompt 一句“use 10k tokens”就会把这个任务的 token 封顶。
- ✅ **可保存可分享**。在 workflow 菜单里按 `s` 保存到 `~/.claude/workflows`，或打包进一个 skill 来分发。分享时建议提示 Claude 把 skill 里的 workflow 当成**模板**而非必须逐字运行的死脚本。
- ✅ **组合 `/goal` 和 `/loop`**。对可重复的 workflow（triage、研究、验证），配 `/loop` 定时跑，配 `/goal` 设一个硬性完成标准。
- ✅ **详细 prompt 出最好结果**。用上面那些具体技巧去写 prompt，效果最好。

一个真实案例：作者提到某个项目从 Zig 重写到 Rust，就是用 workflow 干的——把任务拆成一系列要处理的单元（调用点、失败的测试、模块等），为每个修复 spin off 一个 worktree 里的子 agent 去改，再让另一个 agent 对抗审查、合并。还有个小贴士：告诉 agent 别用资源密集的命令，这样才能最大化并行而不会把机器跑爆。

---

## 七、它意味着什么：从超级个体到项目经理

把视角拉高。

这篇文章的核心不是“Claude Code 又加了个功能”，而是一个范式转变的信号：

> **从“让模型在一个脑子里硬扛复杂任务”，转向“让模型自己设计一套分工协作的组织架构”。**

过去我们优化 Agent 的思路，是把单个模型调得更强、上下文更长、prompt 更精巧——本质是在打造一个**超级个体**。而 Dynamic Workflows 走的是另一条路：承认单个上下文窗口有结构性的天花板，转而让模型**自己当项目经理**，现场组建一支临时团队，分工、并行、互相验证、最后合成。

这背后是一个深刻的工程哲学：

- **可靠性来自结构，而非祈祷。** 你没法 prompt 一个模型“永远不要偷懒、永远不要偏袒自己、永远不要忘记目标”——但你可以设计一个让这些失败无处发生的结构。
- **比较优于打分。** 对抗验证和锦标赛模式，都在用“相对判断”替代“绝对判断”，这是对 LLM 评估能力边界的清醒认识。
- **隔离即安全。** Quarantine 模式把信任边界画在 agent 之间，而不是模型内部。

Workflow 还很新，最佳实践仍在演化。但方向已经清楚了：**未来强大的 AI Agent，不会是一个无所不能的巨脑，而是一个懂得在合适的时候，为合适的任务，组建合适团队的协调者。**

而这，恰恰是组织协作这门古老学问，在 AI 时代的回响。

---

*原文作者：Thariq Shihipar & Sid Bidasaria，Anthropic Claude Code 技术团队成员。本文为深度解读与延伸思考。*
