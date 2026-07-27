---
layout: single
title: "AI 代码迁移的真正方法：别修代码，修循环"
date: 2026-07-27 23:16:00 +0800
categories: [AI]
tags: [Claude Code, AI Agent, 代码迁移, 软件工程, Dynamic Workflows, Agent工程, 技术债]
header:
  overlay_image: /assets/images/posts/2026-07-27-ai-code-migration-claude-code-header.png
  caption: "AI-assisted large-scale code migration"
excerpt: "Anthropic 复盘了如何用 Claude Code 完成大规模代码迁移：Bun 从 Zig 迁到 Rust，百万行代码两周内产出；另一个 Python 项目周末迁到 16.5 万行 TypeScript。真正的关键不是让 AI 翻译文件，而是设计规则、队列、裁判和反馈循环。"
toc: true
toc_sticky: true
---

Anthropic 新发的《How Anthropic runs large-scale code migrations with Claude Code》比上一篇上下文工程文章更硬核。它不再讨论“怎么提示模型”，而是直接进入一个长期困扰工程团队的问题：**大规模代码迁移，是否还能被视为多年级别的高风险工程？**

文章给了两个案例：

- Jarred Sumner 用 Claude Code 把 Bun 从 Zig 迁到 Rust，两周内产出约百万行代码，合并前现有测试套件 100% 通过 CI；合并后暴露 19 个回归，后来全部修复；Rust port 已在 6 月进入 Claude Code。
- Mike Krieger 把一个 Python 代码库迁到 16.5 万行 TypeScript，用了一个周末；过程包括数百个 agents、8 个 phase gates、3 轮对抗审查，以及最终把每个命令输出与 Python 原版做 diff 的 parity check。

这些数字很刺激，但最值得深入看的不是“AI 终于能写百万行代码”。真正的核心句是文章里的这句话：

> You don’t fix the code. You fix the process loop that produced the code.

别修代码，修产生代码的循环。

这句话基本定义了 AI 代码迁移的新范式。

## 一、AI 迁移不是“翻译文件”，而是“构造迁移机器”

传统语言迁移是工程组织里最难推进的一类项目。它成本高、周期长、业务价值间接，而且职业风险极大：你可能维护两套代码几年，最后只拿到 90% parity，结果比不迁还糟。

AI 改变的不是迁移本身的复杂度，而是迁移的经济账。

过去百万行迁移可能意味着 3-4 百万美元、4 年工程资源。现在仍然不便宜：Bun 迁移消耗 59 亿 uncached input tokens 和 6.9 亿 output tokens，按 API 价格约 16.5 万美元；Mike 的主要迁移部分用了 2700 万 tokens。

所以它不是“免费”。但它把迁移从“公司级豪赌”压缩成“可重新计算 ROI 的工程项目”。

这会改变很多旧决策：

- 以前不值得修的历史技术债，现在可能值得重算；
- 以前无法承担的语言生态切换，现在可能变成数周项目；
- 以前只能长期忍受的慢编译、内存 bug、部署链复杂度，现在可能成为迁移触发点。

Mike 的案例就很典型：他的内部工具要打包成单一二进制。Python 工具链每个平台构建约 8 分钟，整个 build matrix 每次 release 要等 30 分钟。迁移后，编译约 2 秒，二进制启动快 6 倍，还能退掉一条单独部署管线。

这不是“喜欢 TypeScript”，而是迁移后系统约束变了。

## 二、为什么大迁移特别适合 Agent？

文章列了几个原因，本质上都指向同一件事：**迁移任务天然适合被拆成可验证、可并行、可排队的工作。**

第一，工作可并行。  
语言迁移可以按文件、模块、crate、package 拆成大量独立单元。Agent 不需要一个等另一个，可以并发推进。

第二，旧代码就是规格。  
相比从零开发，迁移任务有天然 spec：旧代码的行为。模型不需要猜产品意图，它可以用旧实现、测试、命令输出作为 ground truth。

第三，有内置裁判。  
编译器、测试套件、diff、smoke test、parity harness 都能当裁判。Agent 最擅长的不是一次写对，而是在客观反馈下反复修正。

第四，队列会自己长出来。  
编译失败就是下一批任务；测试失败就是下一批任务；行为 diff 就是下一批任务。人不需要手动拆每个 bug。

第五，规则能滚动强化。  
当 reviewer 多次发现同类错误，正确做法不是逐文件 patch，而是把规则写回 rulebook，然后重新生成受影响批次。

这就是“修循环”的含义：不要盯着单个文件质量，而要盯着产生这些文件的规则、队列和验证机制。

## 三、前置条件：必须先有一个强 judge

文章把 judge 放在迁移前置条件，这是最关键也最容易被忽视的一点。

没有 judge，就没有退出条件；没有退出条件，AI 迁移就会变成“看起来差不多”的幻觉工程。

judge 必须能在旧代码和新代码上以同等条件评估行为。这里有个现实问题：旧语言里的测试经常依赖内部函数，而目标语言不会有同样的内部结构。那就不能简单把旧测试搬过去。

Anthropic 给了三步：

1. **分类现有测试**：哪些可以表达成外部调用，哪些依赖内部实现；
2. **重写为可移植断言**：把面向外部行为的测试改成同时能跑旧实现和新实现的形式；
3. **验证 judge 本身**：它必须在旧代码上通过，在故意破坏的代码上失败。

最后一句很重要：**抓不住破坏的 judge，不是 judge。**

Bun 的优势是有大量 TypeScript 测试，天然可以作为第三方行为裁判。但多数项目没有这么幸运。Mike 的做法是让 Claude 创建一个 parity harness：选 7 个真实世界场景，同时跑 Python 原版和 TypeScript 新版，对输出做 diff。任何行为变化都算 bug。

这给了一个非常实用的结论：没有完整测试套件也不等于不能迁移。你可以先让 Claude 构建裁判。原代码就是 ground truth。

## 四、六步流程：从规则手册到行为匹配

文章总结了一个六步流程。我把它重新组织成工程视角来看。

### Step 1：建立 rulebook、dependency map 和 gap inventory

迁移一开始不是写代码，而是做三份资产。

**第一份是 rulebook。**

rulebook 定义从旧语言到新语言的翻译原则：类型怎么映射，错误处理怎么映射，内存管理怎么映射，模块边界怎么处理，哪些 idiom 要保留，哪些要重构。

如果迁移是结构保持型，比如 Bun 从 Zig 到 Rust，rulebook 更像查表和惯例翻译。  
如果迁移是重设计型，比如 Python 到 TypeScript，rulebook 更像设计文档。

关键是：rulebook 必须先于 gap inventory。因为 gap 是“默认规则覆盖不了的地方”。没有规则，就不知道什么算 gap。

**第二份是 dependency map。**

大迁移要并行，必须知道依赖顺序。哪些文件可以先迁，哪些必须放同一批，哪些模块需要先稳定接口。现代语言有 manifest 还好，C/C++、Python、老项目经常要靠脚本和静态分析自己发现依赖。

这里 Claude Code 的角色不是“凭感觉画图”，而是部署 agent 写确定性脚本，生成可复现的依赖图。

**第三份是 gap inventory。**

gap inventory 记录那些不能机械翻译的地方。

Zig 到 Rust 的 gap 是内存管理：Zig 里 caller 必须记得 free，注释说了才知道；Rust 里所有权和 borrow checker 会把这类错误变成编译错误。

Python 到 TypeScript 的 gap 是接口和契约：Python 允许 duck typing，一个 handler 有 `.setup()` 和 `.run()` 就能传进去；TypeScript 必须明确写 interface，返回值也要有类型。

这些隐性知识如果不先捕获，迁移后会变成大量局部 bug。

### Step 2：压力测试规则，而不是积累进度

这一步非常反直觉：做一个 mini-migration，但最后把产出的翻译文件扔掉。

目的不是进度，而是验证 rulebook。

Jarred 的做法是：

- 一个 agent 按 rulebook 翻译 3 个文件；
- 一个 agent 像资深 Rust 工程师一样翻译同样 3 个文件；
- 第三个 agent 比较 diff，并从差异中提炼新规则。

这一小步抓到了两个如果全量 fan-out 会造成大面积问题的关键错误。

这其实是大型迁移最值钱的阶段。因为 rulebook 的一个小漏洞，在 1448 个文件上并发展开，就会变成几千个相同 bug。

所以压力测试阶段要故意攻击规则、攻击设计、攻击假设。结构保持型迁移可以用同文件双译对比；重设计型迁移则要用对抗 reviewer 攻击设计文档，甚至做一次 disposable end-to-end run，跑完直接丢弃输出。

这个阶段的产物不是代码，是更强的规则。

### Step 3：全量翻译，队列必须机械且可恢复

到这一步才开始大规模翻译。

文章强调一个细节：工作队列应该机械化。脚本根据磁盘上是否存在目标文件判断完成状态，然后把 pending 文件切成 batch 分给 implementer agents。

这句很工程：**Done should mean “the output file exists on disk.”**

为什么重要？因为它让迁移天然可恢复。进程挂了、agent 失败了、机器重启了，都不影响队列重建。磁盘就是状态源。

这和很多 AI workflow 的失败模式正好相反：如果状态只存在对话上下文里，任务一断就全没了。

这个阶段还要分模型用法：高频 implementer 可以用较小模型，reviewer 和写规则的 agent 用最大模型。因为 token 消耗集中在循环里，不能所有事情都拿大模型硬烧。

翻译过程中，agent 不能确定的地方用 `TODO(port): <reason>` 标出来，交给后续编译和测试阶段处理。之后的队列会自然出现：编译器列错误，smoke test 找 crash，测试套件报 failure。

最重要的一条：reviewer 发现同类错误，不要逐个改文件，要把规则写回 rulebook，再重生成受影响批次。

### Step 4：编译循环，让错误列表驱动 fixer agents

编译阶段是否进内层循环，取决于语言和成本。

Mike 的 TypeScript 编译很快，所以每个循环都跑。  
Jarred 的 Rust cargo 编译要几分钟，所以禁止 translator 循环里跑 compiler，把编译放到下一阶段统一处理。

这背后是一个普适原则：**昂贵裁判要集中调度，便宜裁判可以内嵌循环。**

Jarred 后来用 orchestrator script 统一跑编译，再把错误列表分发给 fixer agents 并行修。构建再跑，循环往复。

当错误呈现系统性模式，比如 Rust module 错误成千上万出现，正确动作不是让 fixer 一个个补，而是分类依赖该删、该移、还是该重构边界，把逻辑写进规则。

### Step 5：运行 smoke test，按根因归类崩溃

编译过了不代表能运行。smoke test 提供第二层机械裁判。

这一阶段的错误通常从“类型/模块不对”变成“运行时行为不对”：初始化顺序、资源释放、边界条件、I/O 行为、平台差异。

Anthropic 的做法仍然不是手工 debug 每个 crash，而是把 crash 按 root cause 分组，再让对抗 subagents 审查分类和修复。

这和传统工程管理很像：单个 bug 交给 loop，人的注意力放在模式和根因上。

### Step 6：行为匹配，最终裁判是旧代码

最后一步是把旧代码和新代码放在同一把尺子下比较。

如果有可移植测试套件，就 shard 后跑全量测试。失败交给 fixer agents，修完让 adversarial reviewers 检查。

如果构建很贵，就引入 build daemon：只有它能重建二进制。fixers 只写 patch，daemon 批量重建、重跑受影响测试，再把结果反馈回来。这样避免多个 agent 同时触发昂贵构建，造成资源浪费和状态混乱。

如果没有测试套件，就像 Mike 那样让 Claude 创建 parity harness：真实场景同时跑新旧实现，逐项 diff。然后让 Claude 自己设计 end-to-end 测试，连续几晚自主运行、修复、重跑。

这里的原则很清楚：**旧代码是 ground truth，测试只是读取 ground truth 的仪器。**

没有仪器，就先造仪器。

## 五、最佳实践：人的工作前置，AI 的工作循环化

文章最后总结了一组经验，我认为可以压缩成五条。

### 1. 不要盲目套流程

每个迁移都不同。结构保持迁移和重设计迁移完全不同；有测试套件和没测试套件也完全不同。通用流程只能当 starter kit，真正的迁移计划应该先让 Claude 参与设计。

### 2. 不要盯单点失败

单个失败是 loop 的工作。fixer agents 会烧掉它们。人要看的是模式：为什么这个错误反复出现？规则哪里漏了？裁判哪里弱了？队列哪里不可恢复？

### 3. 审查要对抗，验证要机械

对抗审查很耗 token，但值得。因为长任务里，模型自己很容易合理化自己的输出。独立 reviewer、不同上下文、甚至第三方仲裁 agent，可以把隐藏漂移暴露出来。

但最终裁判必须机械：编译器、diff、测试、脚本。不要让“看起来对”成为退出条件。

### 4. 不要所有事都用最大模型

实施 fan-out 是高量任务，适合小模型或中模型；规则制定、review、架构判断、失败模式归纳才应该用最大模型。迁移项目的 token 账非常集中，模型分层会直接决定成本。

### 5. 前置人类时间

最耗人的不是后面修几万个错误，而是前面 rulebook 和 stress test。人类应该把经验、直觉、风险、架构边界前置进规则和裁判里。之后就让队列燃烧。

这与传统项目管理相反：以前是越到后面越靠人救火；AI 迁移应该是前面人多投入，后面机器按循环消化。

## 六、Bun 迁移的价值不只是“迁完了”

文章最后给了 Bun Rust port 的结果：

- 约 4% Rust 代码在 `unsafe` blocks 里，主要是 C/C++ 边界处的单行指针操作；
- tooling 能检测到的内存泄漏全部修复；
- 一个 2000 次重复 build 的 benchmark，内存从 6745 MB 降到 609 MB；
- Linux 和 Windows 二进制体积小 19%；
- HTTP serving、`next build`、`tsc` 等真实负载快 2–5%。

这些结果说明迁移不是“语言洁癖”。它带来了可测的运行时收益、内存收益、二进制收益和维护收益。

当然也有 trade-off。Rust 代码里仍有 unsafe，迁移后也曾出现 19 个回归。AI 迁移不是魔法，不是一次性完美替换。

但重点是：过去这类迁移的失败成本太高，导致团队只能忍。现在失败成本变成“删掉分支，再跑一次”。这就是经济账改变的地方。

## 七、对工程团队的真正启发

我认为这篇文章对团队最大的启发，不是“赶紧把所有代码迁到 Rust/TypeScript”。而是下面几个判断。

第一，很多长期技术债需要重新估价。  
以前因为迁移成本太高而搁置的项目，现在应该重新做 ROI。比如慢编译、老框架、类型系统缺失、生态萎缩、内存安全问题、部署链复杂，这些都可能被 AI migration 改写成本结构。

第二，测试和验证资产会变得更值钱。  
AI 能降低改代码成本，但不能替代裁判。未来工程组织的核心资产之一，是可移植测试、parity harness、benchmark、diff 工具和 rubric。谁有强 judge，谁就能更大胆地让 agent 改系统。

第三，Agent 工程要从“会写代码”升级到“会组织循环”。  
真正的壁垒不是让模型翻译一个文件，而是构造 rulebook、依赖图、gap inventory、机械队列、reviewer、fixer、build daemon、parity harness。这是一个工程系统，而不是一次聊天。

第四，代码迁移会从一次性项目变成可重复能力。  
当你有 starter kit、有工作队列、有 reviewer、有裁判、有成本分层，迁移就不再是英雄项目，而是组织能力。今天迁语言，明天迁框架，后天迁 API、数据库、权限系统。

第五，人类工程师的价值位置会前移。  
人不再主要负责手工改 1000 个文件，而是负责定义规则、识别风险、设计裁判、判断 trade-off、审查模式。工程师从“文件作者”变成“迁移系统设计者”。

## 八、我会怎么落地这套方法

如果把这篇文章转化成一个真实团队流程，我会这样做：

1. **先做迁移商业 case**：为什么迁？慢在哪里？风险是什么？成功后指标怎么变？
2. **冻结 ground truth**：旧代码版本、测试、命令输出、benchmark、用户可见行为。
3. **建立 judge**：能同时跑新旧系统的测试或 parity harness，先验证 judge 能抓坏代码。
4. **写 rulebook v0**：类型、错误、资源管理、模块边界、命名、API 兼容策略。
5. **生成 dependency map**：用确定性脚本，而不是模型主观总结。
6. **做 mini-migration 并丢弃输出**：目标是打磨规则，不是积累代码。
7. **机械队列 fan-out**：以文件存在、编译结果、测试结果作为队列状态。
8. **对抗审查**：reviewer 必须引用 rulebook 条款，发现重复问题就更新规则。
9. **集中昂贵构建**：build daemon 串行处理重建，避免 agent 混乱抢资源。
10. **行为 parity gate**：最终只看旧代码和新代码行为是否一致，以及迁移目标指标是否达成。

如果一个团队没有这 10 步，而只是对 Claude Code 说“帮我把项目迁到 X”，那大概率是在赌模型，不是在做迁移。

## 九、结论：AI 代码迁移不是更快的外包，而是新的工程组织方式

这篇文章最重要的价值，是把 AI 代码迁移从“模型能力展示”拉回到“工程系统设计”。

Anthropic 的核心经验可以概括成一句话：

> 大规模迁移的关键，不是让 Agent 写对每一行代码，而是让 Agent 处在一个写错也会被发现、发现后能自动排队、排队后能更新规则、更新规则后能重新生成的循环里。

这就是为什么他们说“别修代码，修循环”。

未来工程团队会越来越多地拥有这种能力：把长期技术债转化成一个机械队列，把旧系统变成 ground truth，把测试和 diff 变成裁判，把模型变成并行工人，把高级模型用在规则和审查上。

代码迁移的风险没有消失，但风险结构变了。

以前风险在于人力烧几年仍然不到 100% parity。  
现在风险在于你有没有设计出足够强的裁判、足够好的规则、足够可恢复的队列。

这对工程管理者是一个提醒：以后不要只问“AI 能不能迁这个项目”。更应该问：

**我们有没有把这个迁移设计成一个可验证、可恢复、可迭代的循环？**

原文：Anthropic Claude Blog《[How Anthropic runs large-scale code migrations with Claude Code](https://claude.com/blog/ai-code-migration)》。