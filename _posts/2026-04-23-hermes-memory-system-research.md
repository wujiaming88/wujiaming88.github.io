---
layout: single
title: "Hermes Agent 记忆系统深度研究：三层架构如何让 AI 不再失忆"
date: 2026-04-23
categories: [ai, research]
tags: [Hermes Agent, Memory System, AI Agent, Nous Research, OpenClaw]
author: 五岳团队
header:
  overlay_image: /assets/images/posts/2026-04-23-hermes-memory-system-research.png
  overlay_filter: 0.4
toc: true
toc_sticky: true
excerpt: "深度拆解 Hermes Agent 的多层记忆系统——从冻结快照到 FTS5 会话搜索，从辩证用户建模到 8 大外部记忆插件，一篇文章讲透 AI Agent 记忆的工程实现与设计哲学。"
---

> **研究员**：黄山（wairesearch）| **日期**：2026-04-23 | **版本**：1.0

---

## 执行摘要

Hermes Agent 是 Nous Research 开发的开源自进化 AI Agent 框架（GitHub 90k+ Stars，MIT 协议）。在[上一篇文章](/ai/research/hermes-agent-skill-creation-research/)中，我们拆解了它的自动 Skill 创建机制。今天我们深入另一个核心模块——**记忆系统**。

Hermes 的记忆架构分为**三层内建记忆 + 外部记忆提供者插件**，选择了 SQLite FTS5 而非向量数据库作为核心检索方案。这是一个务实且高效的设计选择，解决了 AI Agent 最基本的问题：**失忆**。

---

## Hermes Agent 快速回顾

| 属性 | 内容 |
|------|------|
| **开发者** | Nous Research |
| **GitHub Stars** | 90,300+（截至 2026-04） |
| **版本** | v0.9.0 |
| **协议** | MIT |
| **定位** | "The agent that grows with you" — 自进化 AI Agent |
| **支持平台** | Telegram、Discord、Slack 等 15+ 平台 |

核心理念很简单：传统 Agent 每次对话后遗忘一切，而 Hermes 通过持久化记忆 + 自动技能提炼，实现经验的累积和复用。

---

## 记忆系统架构总览

Hermes 的记忆系统是**分层 + 可插拔**的设计，我们可以把它想象成一栋楼：

```
┌──────────────────────────────────────────┐
│          Always Active（内建）             │
│                                          │
│  Layer 1: 冻结系统提示记忆                 │
│    MEMORY.md + USER.md                   │
│    → 每次会话注入 system prompt            │
│                                          │
│  Layer 2: 程序性技能记忆                   │
│    ~/.hermes/skills/*.skill              │
│    → agentskills.io 开放标准              │
│                                          │
│  Layer 3: 会话搜索                        │
│    SQLite FTS5 全文索引                    │
│    → LLM 摘要化检索结果                    │
└──────────────────────────────────────────┘
                    +
┌──────────────────────────────────────────┐
│     Optional（外部记忆提供者，8 选 1）      │
│  Honcho / OpenViking / Mem0 / Hindsight  │
│  Holographic / RetainDB / ByteRover ...  │
└──────────────────────────────────────────┘
```

三条核心设计哲学：

1. **内建记忆永远在线**，外部提供者是加法，不替代
2. **冻结快照模式**：记忆在会话开始时注入 system prompt，会话中修改立即写盘但不更新 prompt（为了保护 LLM prefix cache 性能）
3. **容量刻意有限**：memory 2,200 chars + user 1,375 chars ≈ ~1,300 tokens，逼迫 Agent 策展高质量记忆

---

## Layer 1: 冻结系统提示记忆

这是 Hermes 记忆的"基石层"，分为两个文件：

**MEMORY.md** 是 Agent 的个人笔记本（2,200 chars 上限），用来记录环境信息、项目上下文、经验教训。**USER.md** 是用户画像（1,375 chars 上限），记录你的偏好、沟通风格和常用工具。

两者在每次会话开始时冻结注入 system prompt，Agent 直接"看到"，无需主动读取。

### 操作机制

Agent 通过三个操作管理记忆：

- **add**：添加新条目
- **replace**：通过子串匹配替换（不需要完整文本，唯一子串就够了）
- **remove**：通过子串匹配删除

注意没有 `read` 操作——因为记忆已经在 system prompt 里了。

### 容量管理的艺术

超过 80% 容量时，Agent 会主动合并压缩条目。满了就返回错误，Agent 必须先清理再添加。系统还内置了自动去重和注入安全扫描（防 prompt injection）。

记忆条目用 `§` 分隔，头部显示使用百分比：

```
═══════════════════════════════════════════
MEMORY [67% — 1,474/2,200 chars]
═══════════════════════════════════════════
User's project is a Rust web service using Axum + SQLx
§
This machine runs Ubuntu 22.04, has Docker installed
§
User prefers concise responses
```

**什么该存**：用户偏好、环境事实、项目约定、经验教训、修正纠错。

**什么不该存**：琐碎信息、可搜索的通用知识、大段代码/日志、临时会话信息。

---

## Layer 2: 程序性技能记忆

技能系统是 Hermes 最核心的创新——**将任务执行经验提炼为可复用的代码单元**。关于这部分的详细分析，请参考我们的[上一篇文章](/ai/research/hermes-agent-skill-creation-research/)。

简单来说，Agent 完成复杂任务后会自动分析执行步骤，抽象为可复用模式，保存为 `.skill` 文件。后续遇到类似任务时，通过语义匹配召回最相关技能。每次执行后还会记录成功/失败，持续优化。

技能存储在 `~/.hermes/skills/`，遵循 agentskills.io 开放标准。

---

## Layer 3: 会话搜索（SQLite FTS5）

第三层是对历史会话的全文搜索能力。Hermes 用 SQLite FTS5 虚拟表索引所有过去的会话：

```sql
CREATE VIRTUAL TABLE conversation_fts USING fts5(
    content, speaker, timestamp, session_id
);
```

检索流程很直接：查询触发 → FTS5 匹配 → 结果经 LLM 摘要化 → 注入当前上下文。

### 为什么选 FTS5 而非向量数据库？

这是一个很多人会问的问题。Hermes 的选择很务实：

**FTS5 的优势**：零运维（SQLite 内建）、精确匹配出色（人名、项目名、命令不会丢）、本地部署友好（$5 VPS 就能跑）、完全免费。

**向量数据库的优势**：原生语义搜索能力更强。

**Hermes 的解法**：用 LLM 摘要层补偿 FTS5 的语义短板。搜索结果先经过全文匹配拿到高精度候选，再用 LLM（默认 Gemini Flash）做语义理解和摘要。

这个"土方法"在实际使用中效果很好——精确匹配保证不丢关键信息，LLM 摘要补偿语义理解，两者结合比纯向量检索更可靠。

---

## 外部记忆提供者：8 选 1 的插件体系

除了三层内建记忆，Hermes 还支持 8 个外部记忆提供者插件（同时只能激活一个）。

### Honcho：辩证用户建模

Honcho 是 Hermes 最深度集成的记忆提供者，由 Plastic Labs 开发。它的核心创新是**辩证用户建模**——不仅记住你说了什么，还推理你是怎么思考的。

Honcho 的上下文注入分两层：

**基础层（Base Context）** 包含会话摘要、用户表征、AI 自我表征等，按 `contextCadence` 参数控制刷新频率。

**辩证补充层（Dialectic Supplement）** 通过 LLM 多轮推理合成用户当前状态和需求：

| 推理轮次 | 内容 |
|---------|------|
| Pass 0 | 冷启动（通用事实）或暖启动（会话上下文） |
| Pass 1 | 自审计——识别初始评估的空白，综合近期证据 |
| Pass 2 | 调和——检查前几轮推理的矛盾，产出最终综合 |

三个调节旋钮让你精细控制成本和效果：`contextCadence`（基础层刷新频率）、`dialecticCadence`（辩证调用频率）、`dialecticDepth`（推理深度 1-3）。

Honcho 还支持 **Multi-Peer 架构**：同一用户可以有不同的 AI Peer（编码、写作等），每个 Peer 独立构建用户表征，互不污染。

### 其他提供者一览

| 提供者 | 特色 | 数据存储 |
|--------|------|----------|
| **OpenViking** | 文件系统式知识层级，分层读取 | 自托管（AGPL） |
| **Mem0** | 服务端事实提取 + 语义搜索 | Mem0 Cloud（付费） |
| **Hindsight** | 知识图谱 + 实体消歧 | Cloud/本地 |
| **Holographic** | 本地 SQLite + HRR 代数查询 | 本地（免费） |

其中 RetainDB、ByteRover、Supermemory 截至研究时尚无公开详细文档。

---

## 与主流记忆系统的对比

| 维度 | Hermes Agent | MemGPT (Letta) | LangChain Memory | OpenClaw |
|------|-------------|-----------------|------------------|----------|
| **记忆层级** | 3 层 + 8 外部插件 | 2 层 | 单层 | 2 层 |
| **检索方式** | FTS5 + LLM 摘要 | 向量嵌入 | 向量/关键词 | FTS5 + LLM 摘要 |
| **技能学习** | ✅ 自动提炼 | ❌ | ❌ | ❌ |
| **用户建模** | ✅ Honcho 辩证 | ❌ | ❌ | ❌ |
| **容量管理** | 严格上限 + 自动策展 | 无限分页 | 无限无策展 | 严格上限 + 自动策展 |
| **RL 训练** | ✅ Atropos | ❌ | ❌ | ❌ |

### Hermes 的五大独特创新

1. **闭环技能学习**：唯一实现"任务→技能提炼→优化→社区共享"完整闭环的框架
2. **辩证用户建模**：Honcho 不仅记住你说了什么，还推理你的思维模式
3. **刻意有限的核心记忆**：2,200+1,375 chars 硬上限是设计选择，逼迫 Agent 像人类一样策展
4. **FTS5 + LLM 摘要**：务实的检索方案，零运维，精确匹配不丢信息
5. **RL 飞轮**：Agent 执行轨迹 → 训练数据 → 更好的模型 → 更好的 Agent

---

## 实际应用场景

- **个人 AI 助手**：长期使用，Agent 越来越了解你的偏好和工作方式
- **DevOps 自动化**：部署流程自动提炼为可复用技能，越用越顺
- **多平台统一入口**：Telegram 开始任务，CLI 继续，Agent 保持上下文
- **团队技能共享**：通过 agentskills.io 标准跨团队复用 Agent 技能

---

## 已知局限性

值得注意的是，这套系统也有明显的短板：

- **核心记忆容量极小**：2,200+1,375 chars 对于复杂项目可能不够，需依赖外部提供者补充
- **FTS5 缺乏语义搜索**：同义词、概念关联搜索弱于向量数据库，LLM 摘要层是补丁而非原生方案
- **外部提供者单选**：同时只能激活一个外部记忆提供者，无法混合使用
- **Honcho 外部依赖**：辩证用户建模是最强功能，但需要 Honcho Cloud 或自托管实例
- **冻结快照延迟**：会话中更新的记忆需要下一次会话才生效

---

## 独立评价

**Hermes 的记忆系统体现了"务实工程"而非"论文驱动"的思路。** FTS5 + LLM 摘要的组合看似"土"，但解决了几个实际痛点：零运维、精确匹配、轻量部署。这是面向个人用户和小团队的正确选择。

**冻结快照模式是被低估的优秀设计。** 它牺牲实时性（记忆更新延迟一个会话），换取 LLM prefix cache 的性能收益。在高频对话场景中，这个优化非常实际。

**技能学习系统是真正的差异化壁垒。** MemGPT、LangChain、LlamaIndex 都有记忆方案，但没有人做到完整的闭环技能学习。

### 对 OpenClaw 的启示

有趣的是，Hermes 和 OpenClaw 的记忆系统高度相似（MEMORY.md、FTS5、冻结快照），这不是巧合——Hermes 官方支持从 OpenClaw 迁移。核心差异在于：

- Hermes 有**技能自动提炼**（OpenClaw 需手动编写 SKILL.md）
- Hermes 有 **Honcho 辩证用户建模**（OpenClaw 无对等方案）
- OpenClaw 有 **lossless-claw 无损压缩回忆**（Hermes 无对等方案）

两者各有取舍，共同推动着 AI Agent 记忆系统的工程实践向前发展。

---

## 参考来源

1. [Hermes Agent 官方文档 - Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)
2. [Hermes Agent 官方文档 - Memory Providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers)
3. [Hermes Agent 官方文档 - Honcho](https://hermes-agent.nousresearch.com/docs/user-guide/features/honcho)
4. [GitHub - NousResearch/hermes-agent](https://github.com/nousresearch/hermes-agent)
5. [DEV.to - Hermes Agent 深度分析](https://dev.to/wonderlab/one-open-source-project-a-day-no40-hermes-agent-nous-researchs-self-improving-ai-agent-4ale)
6. [MarkTechPost - Hermes Agent Release](https://www.marktechpost.com/2026/02/26/nous-research-releases-hermes-agent/)
7. [Vectorize.io - How Hermes Agent Memory Works](https://vectorize.io/articles/hermes-agent-memory-explained)
