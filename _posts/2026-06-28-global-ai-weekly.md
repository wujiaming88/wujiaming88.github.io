---
layout: single
title: "全球 AI 动态周报 · 第 5 期（2026-06-21~06-27）"
date: 2026-06-28 10:28:41 +0800
categories: [AI]
tags: [周报, OpenAI, Anthropic, 大模型, AI Agent, 开源, 具身智能, 国产AI]
header:
  overlay_image: /assets/images/posts/2026-06-28-global-ai-weekly-header.png
  overlay_filter: 0.5
  caption: "全球 AI 动态周报 · 第 5 期"
excerpt: "竞争主战场从单次推理切换到团队级长时自主 Agent：五大玩家同周押注多 Agent 协作，前沿模型首次因国家安全被政府限流，国产算力训练跑通里程碑。"
toc: true
toc_sticky: true
---

> **覆盖区间**：2026-06-21（周日）00:00 → 2026-06-27（周六）24:00（上海时区完整自然周）
> **覆盖范围**：38 个研究对象 · 6 大赛道 · 数十个官方与权威来源
> **时间窗声明**：本期仅记录覆盖区间内的真实公开动态；区间外重要事件以"（背景，非本周）"标注，不计入本周动态。

## 本周一句话

> **大模型竞争的主战场，本周全面从"单次推理能力"切换到"团队级长时自主 Agent + 成本/治理护城河"**——五大玩家同周押注多 Agent 协作，前沿模型首次因国家安全被政府限流，国产算力训练跑通里程碑，Agent 集体走向云端持久与多渠道遥控。

## 🔥 本周 TOP 5

### 1. OpenAI GPT-5.6：首次因高能力被政府限流 ｜ 06-26

OpenAI 预览发布 GPT-5.6 系列：旗舰 **Sol**（官方称"迄今最强模型"）、均衡款 **Terra**（对标 GPT-5.5 但便宜 2 倍）、低成本款 **Luna**。引入 **max reasoning effort**（最长深度推理）与 **ultra mode**（subagents 子代理加速复杂工作）两项新机制；Sol 在 Terminal-Bench 2.1 创下 SOTA。最关键的是：因 cyber/bio 能力被评为 Preparedness Framework 下的 **High capability**，应美国政府要求，GPT-5.6 当前仅以 limited preview 形式向少量经政府报备的受信任伙伴开放（API/Codex），**ChatGPT 内暂不可用**。OpenAI 明确表态不认为这种"政府准入流程"应成为长期默认。

↳ **为什么重要**：这是前沿大模型首次因国家安全考量而"延迟普惠"，预示发布将进入"政府报备—分阶段放开"的新常态。叠加 Anthropic 的 Fable 5/Mythos 5 出口管制暂停——前沿能力越强，发布越受政府准入约束。[OpenAI 原文](https://openai.com/index/previewing-gpt-5-6-sol/)

### 2. Anthropic Claude Tag：内部 65% 代码已由 AI 生成 ｜ 06-24

Anthropic 发布 **Claude Tag**（beta），让团队在 Slack 中把 Claude 作为"团队成员"协作：多人共享一个 Claude、沿频道持续构建上下文、开启 ambient 模式后主动跟进停滞线程、跨小时/天异步推进项目。运行于 **Opus 4.8**。官方披露其内部产品团队 **65% 的代码已由内部版 Claude Tag 生成**，并扩展到产品指标追踪、支持工单处理、疑难 bug 定位。面向 Claude Enterprise/Team 开放 beta，将取代现有"Claude in Slack"应用（30 天迁移窗口）。

↳ **为什么重要**：Anthropic 把竞争主战场从"模型能力"转向"组织级 agent 协作底座"，65% 内部代码自动化是行业天花板级 dogfooding 证据，与 OpenAI 的 subagent/ultra mode 正面对撞。[Anthropic 原文](https://www.anthropic.com/news/introducing-claude-tag)

### 3. 字节豆包 2.1：编程对标 Opus 4.7，成本仅约 2 折 ｜ 06-23

火山引擎 FORCE 大会发布**豆包大模型 2.1**（Pro/Turbo）：SciCode 科学计算 59.8 分（超 Opus 4.7 与 GPT-5.5）、NL2Repo 仓库级代码 47 分；MCP Atlas Agent 评测超 Opus 4.7。Pro 定价输入 6 元/输出 30 元（百万 tokens），综合成本较 Claude Opus 4.6-4.8 系列**降低近 80%**。截至 2026 年 6 月豆包日均 Tokens 调用量达 **180 万亿**（两年增长超 1500 倍），火山引擎公有云份额升至 **49.5%**。

↳ **为什么重要**：中国大模型"性能逼近 + 价格碾压"战略的标志性一击，将持续压缩海外旗舰在性价比敏感市场的份额；180 万亿日均调用量显示规模化飞轮已成。[智东西原文](https://36kr.com/p/3865600233395201)

### 4. 智谱 GLM-5.2：纯昇腾训练 + MIT 开源 ｜ 06-13~17（本周发酵）

**GLM-5.2**（总参 744B/激活约 40B、上下文 1M tokens）6/17 以 MIT 协议全量开源，本周进入第三方实测发酵期。**100% 华为昇腾芯片训练**（无 NVIDIA GPU）、Day0 适配 8 家国产芯片；IndexShare 技术把 1M 上下文 FLOPs 降至短上下文的 2.9 倍。性能：Code Arena 盲测"全球可用模型第一"，FrontierSWE 仅比 Claude Opus 4.8 低 1%、超 GPT-5.5。

↳ **为什么重要**："代码能力进全球第一梯队 + 纯国产算力训练跑通 + MIT 高频迭代"三重叠加，是国产算力自主的里程碑，叠加 Claude 出口管制背景被视为国产替代关键补充。[腾讯新闻](https://news.qq.com/rain/a/20260616A04LHW00) · [实测复盘](https://baijiahao.baidu.com/s?id=1868593647130735912)

### 5. 具身与资本双信号：宇树 R1 降价 ＋ SpaceX 收购 Cursor ｜ 06-24 / 06-16

宇树 6/24 宣布双足人形 **Unitree R1 官方售价由 3.99 万元下调至 2.99 万元起**、即日开放现货销售（重约 25kg、集成多模态大模型），把人形机器人压进高端消费电子价位带。同期资本侧（背景，6/16）SpaceX 宣布以约 **600 亿美元全股票收购 Cursor 母公司 Anysphere**（Cursor B2B 年化收入约 26 亿美元、运行于约 50% 财富 500 强开发机），为史上最大风投初创并购。

↳ **为什么重要**：具身侧中国厂商以性价比抢消费/开发者市场放量；资本侧最大悬念是 Cursor 的"模型中立性"存亡，若被绑定 Grok/xAI 可能动摇企业开发者信任。[宇树 R1 降价](http://finance.sina.com.cn/jjxw/2026-06-25/doc-iniepvfh1255157.shtml) · [Cursor 收购综述](https://unrot.co/blogs/today-top-10-ai-news-june-23-2026)

## 🧭 三条主线趋势

**一 · Agent 团队化成为新竞争单位。** OpenAI 的 subagent/ultra mode、Anthropic 的 Claude Tag（多人异步、内部 65% 代码自动生成）、字节豆包 2.1 演示 500+ Agent 协同、微软 MAI-Code-1-Flash 收编编码 agent——五大玩家同周押注"多 agent 协作"，2026 下半年的竞争单位已是"agent 团队"而非"单模型"。

**二 · 前沿模型监管化 + 路线大分化。** GPT-5.6 因 cyber/bio 达 High capability 被政府要求限流、Anthropic Fable 5/Mythos 5 出口管制暂停，"政府报备—分阶段放开"成新常态。同时路线分化：闭源旗舰收紧（Meta 用闭源 Muse Spark 取代开源 Llama）、性价比碾压（豆包 2.1/DeepSeek）、垂直主权（Mistral 文档 AI + 欧洲主权算力）、逆向差异化（xAI 押注成人内容，流量过半但下滑 22%、5.3 亿美元法律拨备）。

**三 · Agent 与算力集体走向"云端持久、可治理、可观测"。** OpenClaw/Codex Remote/Claude Code/OpenCode/Hermes 五大 agent 不约而同把重心放在"随处可达、云端运行、可回滚、可审计"；AWS AgentCore GA、Google ADK 企业化、NVIDIA 全栈生态绑定——算力竞争正从"卖芯片"转向"卖封装好的 Agent 平台"。暗线警示：Dify 同周曝出跨租户高危漏洞（CVSS 9.4 未修复），agent 平台多租户安全是被低估的风险。

## 📊 各赛道速查表

> 图标：🔥 重大 ｜ 🟢 一般 ｜ 🟡 边缘 ｜ ⚪️ 本周静默（深度正文见下一节）

### 🧠 大模型基座

| 对象 | 本周 | 一句话 |
|------|------|--------|
| OpenAI | 🔥 | GPT-5.6（Sol/Terra/Luna）预览，因高能力被政府限流 |
| Anthropic | 🔥 | Claude Tag 上线，内部 65% 代码已由 AI 生成 |
| Google DeepMind | 🔥 | Gemini 3.5 Flash 原生 Computer Use，OSWorld 78.4% |
| Meta AI | 🟢 | $299 智能眼镜上市搭载闭源 Muse Spark，招揽 Virtue 创始人 |
| xAI | 🔥 | 调查曝过半流量为成人内容、$530M 法律拨备、流量降 22% |
| Microsoft | 🟢 | 自研 MAI-Code-1-Flash GA，去 OpenAI 依赖 |
| DeepSeek | ⚪️ | 无新模型，API 命名向 v4-flash 迁移 |
| Databricks | 🟢 | $134B 估值 IPO 叙事 + agent 原生数据库 Lakebase |
| 字节跳动 | 🔥 | 豆包 2.1 编程对标 Opus 4.7，成本仅约 2 折 |
| Mistral AI | 🟢 | OCR 4 发布，170 语言、72% 人工偏好胜率 |

### 🤖 垂直 Agent 产品

| 对象 | 本周 | 一句话 |
|------|------|--------|
| Anysphere（Cursor） | 🟢 | 消化 SpaceX 600 亿收购，模型中立性存悬念 |
| Perplexity | 🟢 | Comet iOS + 多模态 Deep Research + Health Computer |
| Cognition（Devin） | 🟢 | 6/24、6/26 两批更新，企业治理与 PR Review 打磨 |
| Harvey | ⚪️ | 无新公告，承接嵌入 MS 365 与 DeepJudge 合作 |
| Sierra | ⚪️ | 融资与连环收购后整合期，无新公告 |
| Glean | ⚪️ | 刚完成 $150M 融资 + 5 月大版本，节奏间歇 |
| Midjourney | 🟡 | V8.1 已成默认、V8.2 训练中，V7 退居兼容备选 |

### 🇨🇳 中国公司

| 对象 | 本周 | 一句话 |
|------|------|--------|
| 阿里云 | ⚪️ | Qwen3.7（5/20 发）后商业化期，618 运营促销为主 |
| 智谱 | 🔥 | GLM-5.2 纯昇腾训练 + MIT 开源，本周实测发酵 |
| 月之暗面 | 🟢 | K2.7 Code（6/12-15）发布后开发者落地期 |
| MiniMax | ⚪️ | M3（5/31 发）后生态与资本关注期 |
| 腾讯 | 🟢 | 微信原生 AI 智能体收尾测试，美团"小美"接入元宝 |

### 🛠️ Agent 框架工具

| 对象 | 本周 | 一句话 |
|------|------|--------|
| OpenClaw | 🟢 | 2026.6.11：渠道控制 + per-agent 计费 + 插件分发安全 |
| Dify | 🔥 | 1.15.0 推 difyctl + CoT 可视化；同周曝跨租户高危漏洞 |
| Hermes Agent | 🟢 | v0.17 后高频补丁，约 20.4 万 Stars 增长最快 |
| Claude Code | 🟢 | 2.1.193/195：后台 agent 稳定性 + OTel 可观测 |
| Codex CLI | 🔥 | Codex Remote GA（手机遥控云主机 + DigitalOcean 自动 provisioning） |
| Google ADK | 🟢 | v2.3.0 企业化（mTLS/GEPA/Gemma4），仓库本周活跃 |
| OpenCode | 🟢 | v1.17.11 会话快照/回滚 + MCP 深度集成，约 18 万 Stars |
| Scale AI（SEAL） | ⚪️ | 本周无新榜单/评测公开发布 |
| Cohere | ⚪️ | 本周无 Command R+ 或新模型公告 |
| SSI | ⚪️ | "零发布"策略，本周静默符合预期 |

### ⚡ 算力云硬件

| 对象 | 本周 | 一句话 |
|------|------|--------|
| NVIDIA | 🔥 | ISC 超算榜单 81% 份额，AWS/电信/科学计算全栈绑定 |
| AWS | 🔥 | AgentCore GA + Grok 4.3 上架 + 降价三板斧 |
| Azure | ⚪️ | Build 后消化期，靠 OpenAI $250B 合约 + AKS 7.5 万节点稳底盘 |

### 🦾 具身机器人

| 对象 | 本周 | 一句话 |
|------|------|--------|
| 宇树 Unitree | 🔥 | R1 降价至 2.99 万元起 + 开放现货 |
| 优必选 UBTech | ⚪️ | Walker S2 产能爬坡执行期，无新公告 |
| Figure AI | ⚪️ | 重心转向 Figure 03 家庭量产 + Helix 软件栈 |

## 📚 各赛道深度正文

---

### 🧠 大模型基座

**OpenAI（GPT-5/ChatGPT/Codex）**

> 详见上文「本周 TOP 5」。该对象本周为重大动态，核心要点已在 TOP 5 展开。

**补充影响判断**：GPT-5.6 在 cyber/bio 上跨入"High capability"且被政府要求限流，是前沿大模型首次因国家安全考量而"延迟普惠"的标志性事件，预示前沿模型发布将进入"政府报备—分阶段放开"新常态。自研推理芯片落地则是 OpenAI 降低对 Nvidia 依赖、自建基础设施的关键一步。

---


**Anthropic（Claude Opus/Sonnet）**

> 详见上文「本周 TOP 5」。该对象本周为重大动态，核心要点已在 TOP 5 展开。

**补充影响判断**：Claude Tag 标志 Anthropic 把竞争主战场从"模型能力"转向"组织级 agent 协作底座"，65% 内部代码自动化是行业天花板级别的 dogfooding 证据；与 OpenAI 的 subagent/ultra mode 形成正面对撞，2026 下半年大模型竞争核心已从"单次推理"转向"团队级长时自主协作"。

---


**Google DeepMind（Gemini/Gemma）**

两条本周核心动态。①**6月24日正式发布 Gemini 3.5 Flash 原生"Computer Use"能力**：将原本仅在独立 Gemini 2.5 computer-use 模型上的能力直接内嵌进 3.5 Flash，让 agent 能"see, reason, and act"，跨**浏览器、移动端、桌面**三类环境执行多步任务（网页导航、软件测试、企业应用管理）。原文数据：Gemini 3.5 Flash 在 **OSWorld-Verified 上得分 78.4%**（Google 来源）。为应对安全风险，Google 做了针对性对抗训练降低 prompt injection，并引入两项企业级保护：**敏感/不可逆操作强制用户确认**、**检测到间接 prompt injection 时自动终止任务**，建议结合 sandboxing + 严格访问控制 + human-in-the-loop。能力已通过 Gemini API 与 Gemini Enterprise Agent Platform 开放，并提供 Browserbase 托管 demo。②**Gemini 3.5 Pro（下一代前沿旗舰）发布从6月推迟到7月**（Business Insider 6/25 报道）。背景：Gemma 4 12B Unified 于6月3日发布（背景，非本周）。**判断**：Google 走"Flash 先行落地 agentic 能力、Pro 旗舰稳健延后"的双轨节奏，把 Computer Use 作为企业自动化的核心抓手，与 OpenAI/Anthropic 在 agent 赛道正面竞争；Pro 延期显示前沿旗舰打磨压力增大。

**关键数据**：- Gemini 3.5 Flash Computer Use 发布 = 2026-06-24；OSWorld-Verified 78.4%（[CyberSecurityNews](https://cybersecuritynews.com/gemini-3-5-flash-released/)，已读全文；原始数据源 Google）
  - Gemini 3.5 Pro 发布从6月推迟至7月（[Business Insider](https://www.businessinsider.com/google-3-5-pro-july-release-tokens-ai-agents-model-2026-6)，2026-06-25）
  - Gemma 4 12B Unified 发布 2026-06-03（背景，[Google AI](https://ai.google.dev/gemma/docs/releases)）

**影响判断**：Computer Use 原生化是 Google 把 Gemini 从"模型"升级为"可操作数字环境的 agent 平台"的关键落子，OSWorld 78.4% 是强力 benchmark 背书；同期内置 prompt-injection 防护说明 agent 安全已成发布门槛。Pro 延期与 OpenAI GPT-5.6 抢发形成对比，反映两强节奏分化。

---


**Meta AI（Llama 4）**

Meta 本周无新模型发布，但有两条相关动态。①**6月23日 Meta AI 智能眼镜以 $299 价格上市**，原 Ray-Ban Premium 线取消，核心硬件不变；每台均搭载 **Muse Spark**——Meta Superintelligence Labs（由 Alexandr Wang 领导）的首个发布，也是 Meta **首个闭源权重（closed-weight）模型**。②**Meta 将 Virtue AI 三位创始人招入 Superintelligence Labs**（AI Weekly 6/25 报道），采用分拆汇报结构：两位向 Superintelligence Labs 的 Nat Friedman 汇报、一位向 FAIR 的 Rob Fergus 汇报。**重大背景（非本周但需点明）**：据 Wikipedia，**2026年4月 Meta Superintelligence Labs 已用 Muse Spark 取代 Llama**——即 Llama 品牌作为前沿旗舰实际已被闭源 Muse Spark 接替，标志 Meta 从"开源权重旗舰"路线转向。**判断**：Meta 的 AI 战略本周重心在硬件落地（眼镜）+人才整合，而非模型发布；Muse Spark 闭源化 + 顶尖人才持续吸纳，说明 Meta 在前沿竞赛中收紧开源、向闭源旗舰 + 消费硬件入口双线下注。

**关键数据**：- Meta AI 智能眼镜 $299 上市 = 2026-06-23，搭载 Muse Spark（Meta 首个闭源权重模型）（[TechTimes](https://www.techtimes.com/articles/318942/20260623/meta-ai-smart-glasses-299-debut-today-ray-ban-premium-gone-same-core-hardware.htm)）
  - Virtue AI 三创始人加入 Superintelligence Labs（[AI Weekly](https://aiweekly.co/alerts/meta-hires-three-virtue-ai-founders-into-superintelligence-labs)，2026-06-25）
  - Muse Spark 于 2026-04 取代 Llama（背景，[Wikipedia](https://en.wikipedia.org/wiki/Llama_(language_model))）

**影响判断**：Llama 被闭源 Muse Spark 接替是 2026 年开源大模型阵营的重要拐点——曾经的开源旗手 Meta 转向闭源，削弱了开源前沿模型的领导力；$299 眼镜则是 Meta 把 AI 入口押注在可穿戴硬件上的战略落地。

---


**xAI（Grok）**

本周 xAI 的核心新闻不是模型能力，而是 **6月25日 The Information 重磅调查**（Engadget、Forbes、TechTimes 6/24-26 二次报道）。调查披露：①Grok 流量**过半来自成人内容请求**（色情图像、露骨视频、情色角色扮演），且这是 xAI **刻意的战略选择**而非事故。②据 SpaceX IPO 文件援引，2026 年 Q1 Grok **每月生成 100 亿张图像、20 亿条视频**。③xAI 已**预留 5.3 亿美元（$530M）覆盖该策略的法律成本**，并内部承认工程师**找不到可靠技术手段在不拆掉成人内容业务的前提下阻止 CSAM（儿童性虐待материал）生成**。④成人内容需求外溢到 Grok 编码模型（用户发现走 coding 模型生成更便宜，形成"套利"）。⑤市场反噬：据 Similarweb，**2026年1-5月 Grok 整体 web 流量下降 22%**（主流 AI 平台中跌幅最大），同期 **Claude 增长 369%、Gemini 增长 40%**。分析师 Adam Crisafulli 评价此为"已进一步落后"的公司为保持相关性的挣扎。**判断**：xAI 在前沿能力 benchmark 上落后后，选择以成人内容差异化填补 OpenAI/Anthropic/Google 共同回避的市场空白，短期换来海量生成流量但长期面临严重法律/监管/品牌风险，且流量仍在下滑——这是一条高风险且未被验证的护城河。

**关键数据**：- Grok 月生成 100 亿图像 / 20 亿视频（2026 Q1，SpaceX IPO 文件，via The Information，2026-06-25）
  - xAI 预留 $530M 法律成本；过半流量为成人内容（[TechTimes](https://www.techtimes.com/articles/319142/20260626/)，已读全文）
  - Grok web 流量 2026-01→05 下降 22%；同期 Claude +369%、Gemini +40%（Similarweb，via TechTimes，已读）

**影响判断**：xAI 走向与三大主流实验室相反的"成人内容差异化"路线，是本周大模型行业最尖锐的伦理/商业分歧点；CSAM 无法技术根治 + $530M 法律拨备 + 流量持续下滑，预示该策略可能引发监管重锤，并拖累 xAI 的政府合同与企业信任。

---


**Microsoft（Copilot/Azure AI/Phi）**

本周区间内核心动态是 **6月26日 Microsoft 将自研编码模型 MAI-Code-1-Flash 正式 GA（面向 GitHub Copilot Business 与 Copilot Enterprise）**。该模型由 Microsoft AI（MAI）团队自建，主打 low-latency、high-volume 的 agentic 编码工作流，并附带 policy 控制（组织管理员可治理模型路由、成本）。分析指出：这条 changelog 看似不大，战略意义却大——微软不是简单往模型选择器里再加一个模型，而是要让 Copilot **运行更便宜、更易治理、更依赖微软自有 AI 栈**，降低对 OpenAI/第三方模型的依赖，把 token 效率（=商业模式存活）和延迟（=产品质量）握在自己手里。配套背景（紧贴窗口但略早，6/16）：**Copilot Cowork 全球 GA + 引入 Microsoft Scout + Copilot Credits 用量计费**（按 $0.01/Copilot Credit 的 pay-as-you-go，提供支出上限、用量告警、预付费计划；7月1日为相关变更生效节点）。Phi 线：Phi-4-mini-flash-reasoning 等小模型持续用于端侧/自适应学习（背景）。**判断**：微软 AI 战略本周主线是"自研模型 + 用量计费 + 治理控制平面"三合一，MAI-Code-1-Flash GA 是其"去 OpenAI 依赖、收编成本与治理"的关键落子。

**关键数据**：- MAI-Code-1-Flash GA = 2026-06-26（GitHub Copilot Business/Enterprise）（[WindowsForum](https://windowsforum.com/threads/mai-code-1-flash-ga-for-copilot-business-enterprise-speed-policy-cost-control.431081/)，已读全文）
  - Copilot Cowork 全球 GA + Microsoft Scout + Copilot Credits = 2026-06-16；$0.01/Credit pay-as-you-go（紧邻窗口前，[Neowin](https://www.neowin.net/news/microsofts-copilot-cowork-now-generally-available-with-usage-based-billing/)）

**影响判断**：MAI-Code-1-Flash GA 标志微软加速"自研模型替代外部依赖"，把编码 agent 的成本与治理收归己有，是对 OpenAI 既合作又竞争的微妙信号；叠加 Copilot Credits 用量计费，微软正把 Copilot 从"订阅制功能"重构为"可计量、可治理的 agent 平台"。

---


**DeepSeek（V3/R1）**

**本周无重大公开模型发布**。原因：DeepSeek 当前旗舰 **V4 系列（V4-Pro 1.6万亿参数 / V4-Flash 2840亿参数，均 100万 token 上下文、MIT 许可）已于 2026年4月24日发布**（背景，非本周），本周处于发布后稳定运营期。窗口内唯一相关动态是 **API 文档层面的命名弃用通知**：旧模型名 `deepseek-chat` 与 `deepseek-reasoner` 将于 **2026年7月24日 15:59 UTC 停用**，分别由 `deepseek-v4-flash` 的非思考/思考模式接替（被部分自媒体误读为"7月24日出新模型"，实为命名迁移）。DeepSeek V5 发布时间本周仍无官方确认（社区猜测）。**判断**：DeepSeek 本周维持"低调运营、按节奏迁移 API"风格，未跟随 OpenAI/字节密集发布节奏；V4-Flash 仅 13B 激活参数、单服务器可部署 + V4-Pro 永久降价（5月起）构成其"极致性价比开源"护城河延续。

**关键数据**：- V4-Pro 1.6T / V4-Flash 284B，1M 上下文，MIT 许可，发布 2026-04-24（背景，[Wikipedia](https://en.wikipedia.org/wiki/DeepSeek)）
  - `deepseek-chat`/`deepseek-reasoner` 于 2026-07-24 15:59 UTC 停用，迁移至 `deepseek-v4-flash`（[Thomas Wiegold](https://thomas-wiegold.com/blog/when-is-deepseek-v5-coming-out/)，2026-06-26）

**影响判断**：DeepSeek 本周静默期反衬其与字节、OpenAI 的节奏差异——靠"低价开源 + 稳定 API"而非高频发布维持存在感；API 命名向 v4-flash 统一是产品线收敛信号，V5 缺席使其本周前沿竞赛中暂时"隐身"，但开源权重仍是全球开发者重要底座。

---


**Databricks（DBRX/Mosaic ML）**

**本周无新模型发布**，动态集中在资本与平台层。①**IPO 进程**：Databricks 在 2025年12月 Series L 以 **$1340亿（$134B）估值**融资 $40亿，2026年1月由 JPMorgan 领投追加 $18亿债务融资，累计融资超 $70亿；CEO Ali Ghodsi 表示"不排除 2026 年 IPO"，本周仍有分析持续讨论其有望成为史上最大企业软件 IPO（年化营收约 $69亿、同比+80%，2万+客户、700+ 年付百万美元大客户；AI 产品线营收约 $14亿）。②**平台层**：紧邻窗口的 **Data+AI Summit 2026**（约一周前）发布的 Omnigent、LTAP、Lakebase（面向 AI agent 工作负载的 serverless 数据库）持续发酵；Matei Zaharia 与 Reynold Xin 本周通过播客阐述"前沿生态必须开放（Why the Frontier Ecosystem must be Open）"立场。Mosaic ML（2023年13亿美元收购）仍是其训练能力底座。**判断**：Databricks 本周主线是 IPO 叙事 + "数据库重要性在 agent 时代回归"的平台战略，模型本身非重点。

**关键数据**：- 估值 $134B（2025-12 Series L，融 $40亿）；累计融资 >$70亿；年化营收约 $69亿（+80% YoY）；AI 产品营收约 $14亿（[Tech Insider](https://tech-insider.org/databricks-134-billion-ipo-enterprise-software-2026/)，已读全文）
  - Mosaic ML 收购价 $13亿（2023，背景，[Wikipedia](https://en.wikipedia.org/wiki/Databricks)）

**影响判断**：Databricks 价值锚点已从"DBRX 开源模型"转向"数据智能平台 + agent 原生数据库（Lakebase）+ IPO 叙事"，Zaharia 的"前沿生态必须开放"表态是对闭源巨头的明确路线区隔；$134B 估值若年内 IPO 将成 AI 基础设施层标杆性资本事件。

---


**字节跳动（豆包/Coze）**

> 详见上文「本周 TOP 5」。该对象本周为重大动态，核心要点已在 TOP 5 展开。

**补充影响判断**：豆包2.1 Pro 编程对标 Opus 4.7 而成本仅2折，是中国大模型"性能逼近+价格碾压"战略的标志性一击，将持续压缩海外旗舰在中国及性价比敏感市场的份额；180万亿日均 tokens 调用量显示其已建立规模化飞轮，火山引擎公有云49.5%份额进一步巩固其国内AI云龙头地位。

---


**Mistral AI（Mistral Large/Codestral）**

本周 Mistral 有多条企业级动态。①**6月23日发布 Mistral OCR 4**（最新文档理解模型）：相比前代仅把页面转成干净文本/表格，OCR 4 返回**整份文档的结构化表示**——每个 block 用 bounding box 定位并按类型分类（标题、表格、公式、签名等），并给出**逐页/逐词置信度**。支持**170种语言**（10个语言组），可在**单容器内完全自托管**部署（满足数据驻留/合规）。接受 PDF/DOC/PPT/OpenDocument。同时被加入 Mistral 的 Search Toolkit（可组合企业搜索框架），打通"文档摄入→引用就绪的 RAG"链路。②**Vibe agent**统一发布——面向长时运行的生产力与编码工作的统一 agent。③新建 **Les Ulis 数据中心**提供安全推理产能。**关键 benchmark**：独立标注者在600+文档/12+语言的对比中，平均 **72% 胜率**偏好 OCR 4（优于所有受测系统）；OlmOCRBench 得分 **85.20**、OmniDocBench **93.07**、内部 Crawl Multilingual **0.98**。客户数据：Rogo 报告同等精度下成本约低 **8x**、延迟低 **17x**；Anaqua 测得每页快约 **4x**。**定价**：每1000页 **$4**，用 Batch-API 折扣降至 **$2**。**判断**：Mistral 把重心从通用对话模型转向"企业文档AI+自托管+主权AI"差异化——OCR 4 + Search Toolkit + 自建数据中心，主打数据驻留/合规与欧洲主权算力，是其在巨头夹缝中清晰的 B2B 定位。

**关键数据**：- OCR 4 发布 = 2026-06-23；170语言；72%人工偏好胜率；OlmOCRBench 85.20 / OmniDocBench 93.07（[MarkTechPost](https://www.marktechpost.com/2026/06/23/mistral-ocr-4/)，已读全文）
  - 定价 $4/1000页（Batch 降至 $2）；Rogo 成本低8x/延迟低17x（同上）
  - Vibe 统一 agent + Les Ulis 数据中心（[Releasebot](https://releasebot.io/updates/mistral)，约2026-06-23）

**影响判断**：Mistral 不与 OpenAI/Google 在通用旗舰上硬拼，而是用"结构化文档AI + 自托管合规 + 欧洲主权算力"切企业刚需，OCR 4 的 72% 人工胜率与8x成本优势是强力卖点；Vibe agent + 自建数据中心则补全其"全栈主权AI"叙事，定位在受监管行业与欧洲市场。

---



---

### 🤖 垂直 Agent 产品 + 🇨🇳 中国公司

**Anysphere（Cursor）**

> 详见上文「本周 TOP 5」。该对象本周为重大动态，核心要点已在 TOP 5 展开。

**补充影响判断**：这是史上最大的风投初创并购，若 Q3 完成将重塑 AI 编程工具竞争格局。核心信号是"模型中立性"存亡——若被绑定 Grok/xAI 模型，可能动摇其在企业开发者中的中立信任基础；反之若保持独立，则 SpaceX 获得稀缺的开发者遥测与训练数据入口。本周属"消化期"，真正拐点在监管审查与整合方案落地。


**Perplexity**

Perplexity 本周延续其"Computer/Comet"智能体化产品线的密集迭代节奏。官方 changelog 概述近期（"this week"）出货项包括：Comet iOS 版、面向个人与企业的多项 Computer 更新、多模态 Deep Research、以及 Health Computer。更广的近期产品矩阵（部分为前序数周铺垫，需注意时间）涵盖：①**Perplexity Computer** 全面向 Pro 订阅者（Web/iOS）开放，可调用 20+ 模型、预置/自定义技能与数百连接器；②**企业版 Computer + Slack 集成**，跨研究/编码/设计/部署运行多步工作流，路由 20 个专用模型、连接 400+ 应用（Snowflake/Salesforce/HubSpot）；③**Personal Computer**——常驻 Mac mini 的 7×24 always-on AI 数字代理，监控触发器、主动执行任务，每个敏感动作需显式批准并带审计与 kill switch（开放 waitlist）；④**Bring Your Own Connector**（MCP 自定义远程连接器）；⑤**API Platform** 升级为模型无关全栈（Agent/Search/Embeddings/Sandbox 四套 API）；⑥**Finance Computer**（Plaid 券商账户接入、可追溯层、Polymarket 数据集成）；⑦**Premium Sources**（CB Insights/PitchBook/Statista）。注意：抓取的 changelog 页底注明原始来源日期为 3/13，部分条目时间需谨慎，本周确属新出货的以官方"this week"清单（Comet iOS、多模态 Deep Research、Health Computer）为准。

**关键数据**：Computer 路由 20+ 专用模型｜连接 400+ 应用｜API 服务 MAG7 中 6/7 与数亿台三星设备——来源：Perplexity 官方 changelog/release notes [Releasebot](https://releasebot.io/updates/perplexity-ai) （原始 [Perplexity](https://www.perplexity.ai/changelog) ）

**影响判断**：Perplexity 正从"答案引擎"全面转向"通用 Agent 操作系统"——Computer（多步执行）+ Comet（AI 浏览器）+ Personal Computer（常驻数字代理）三层布局，目标是成为企业与个人的 agentic 工作中枢。always-on 数字代理 + 显式批准/审计/kill switch 的设计，是对"自主智能体安全可控"主流诉求的正面回应，也是其与 ChatGPT/Gemini 拉开差异化的关键赌注。


**Cognition（Devin / Windsurf）**

Cognition 本周保持其"产品快速迭代"节奏，官方 Devin Docs 在区间内连续发布两批更新：**6/24** 与 **6/26** 的 Recent Updates（均落在 6/21–6/27 区间内）。6/24 更新含：命令面板（Cmd+K）支持会话 Pin/Unpin、首页"后台启动会话"按钮、文件标签"查看最新版本"、PR Review 中 Ask Devin 纳入安全发现（security findings）、Lifeguard 发现新增"Repo rule"徽章、消费分析新增 Top 10 排行榜（仓库/用户/服务账户）、企业级快照构建计划、SSO 强制下添加企业成员、ACU 计费计划缺失告警等。6/26 更新含：命令面板归档/取消归档会话、自动化新增"运行一次"(run-once) 计划选项、MCP 集成"安装已过期"横幅+一键刷新、Blueprint 编辑器新增 Post-Build 区块、PR Review 标签可读配色、消费仪表盘改用柱状图并合并活跃/审阅用户图表。整体看本周无新模型/无新版本号，均为 Devin 平台工程化、企业治理与 PR Review 工作流的密集打磨。背景：Windsurf 已于 6/2 OTA 静默更名为 Devin Desktop（非本周）；Cognition 5 月底完成 10 亿美元融资、估值 260 亿美元（非本周）。

**关键数据**：本周两批更新（6/24、6/26）；融资 $1B@$26B 估值、营收一年增 13x 至 $492M（5/27，背景）——来源：Devin 官方发布说明 [Devin Docs](https://docs.devin.ai/release-notes/overview) ；TheNextWeb 5/27 [thenextweb.com](https://thenextweb.com/news/cognition-just-raised-1-billion-at-a-26-billion-valuation)

**影响判断**：Cognition 本周动作全部指向"企业级可治理的 Agent 命令中心"——安全发现入审、消费分析、MCP 管理、企业快照构建，说明其重心已从单点编码 agent 转向"管理多 agent + 满足企业合规审计"。这正面回应了行业关注的"97% 开发者用 AI 编码但仅 1/3 有治理框架"的痛点（Black Duck 报告），是 B2B 护城河的关键投入方向。


**Harvey（Legal）**

本周无 Harvey 官方独立重大产品/模型发布公告。区间内最相关的公开信息为 National Law Review 页面（页面顶部日期标注 6/27/2026）持续展示 Harvey × DeepJudge 合作，但该合作**原始发布于 5/20**（非本周），内容为 DeepJudge 的"机构智能"(institutional intelligence) 平台与 Harvey 工作流打通——把律所/法务团队的历史工作产物、决策与专业判断接入 Harvey，同时遵守既有访问权限与"伦理墙"(ethical walls)，且 Harvey 中产出的工作成果回流 DeepJudge。其他近期背景（非本周）：6/16 Harvey 宣布其法律 AI 作为 agent 进入 Microsoft 365 Copilot、并作为 Copilot Cowork 插件，把文档分析、法律研究、Vault 检索嵌入微软办公套件；6/2 与新加坡国立大学法学院（NUS Law）达成合作，成为新加坡首家与 Harvey 合作的法学院。本周属典型"无新公告的消化期"，原因是 6 月中旬已密集出货（微软集成），新周期内未见新增官方发布。

**关键数据**：客户含 A&O Shearman、PwC、Linklaters、Deutsche Telekom、Reed Smith 等数十家 Am Law 100 律所（背景）——来源：harvey.ai 官网 [Harvey](https://www.harvey.ai/) ；MS Copilot 集成 [WindowsForum](https://windowsforum.com/threads/harvey-legal-ai-joins-microsoft-365-copilot-and-copilot-cowork.427079/)

**影响判断**：Harvey 的战略主线（6 月密集体现）是"从目的地 App 转为工作场所基础设施"——通过嵌入 Microsoft 365 与打通机构知识图谱（DeepJudge），承认"工作流引力 > 独立软件"。对法律垂直 Agent 而言，决胜点不在最聪明的聊天窗口，而在律师正在阅读/起草/谈判/归档的那一刻出现的助手。本周虽无新公告，但其路线方向明确且领先。


**Sierra**

本周无 Sierra 官方重大公开动态（无新产品、无新融资、无新收购公告）。区间内仅见第三方媒体回顾性内容（如 6/27 TechShots 重提 2025 年 9 月的 $350M@$10B 旧融资），非本周新闻。Sierra 近期重要事件均在区间外（背景，非本周）：①5 月初完成约 $950M 新融资、估值升至约 $150 亿美元（领投 Tiger Global、GV）；②4/23 收购 YC 背景的法国初创 Fragment（其第三次公开收购，此前已收购日本 Opera Tech 与语音 agent 公司 Receptive AI）。Sierra 由前 Salesforce 联席 CEO、现 OpenAI 董事会主席 Bret Taylor 与前 Google 高管 Clay Bavor 联合创立，专注企业客服 AI agent，客户含 Casper、Clear、Brex。本周无官方发布，原因可能是融资与连环收购后处于整合期，且公司一贯低调、不密集发版。

**关键数据**：估值约 $15B、新融资约 $950M（5 月初，背景）；累计融资 >$630M（早期口径）；ARR 一度近 $100M（2025 口径，背景）——来源：CyberNewsCentre 5/6 [CyberNewsCentre](https://www.cybernewscentre.com/ai-startup-sierra-raises-950m/) ；TechCrunch 4/23 [TechCrunch](https://techcrunch.com/2026/04/23/bret-taylors-sierra-buys-yc-backed-ai-startup-fragment)

**影响判断**：Sierra 是企业客服 Agent 赛道头部，估值在 5 月已冲到约 $150 亿。连环收购（日本、法国、语音）显示其正用资本快速做"地域 + 能力"扩张，目标成为全球客服 AI 标准。本周静默不改其结构性领先地位；真正看点在下次产品/营收里程碑披露。


**Glean**

本周无 Glean 官方重大新发布。最近的标志性事件在区间外（背景，非本周）：**6/9** Glean 完成 $150M 融资、估值达 **$72 亿美元**，并披露 ARR 达 **$3 亿、15 个月翻三倍**，其 AI agent 系统年执行动作达 **1 亿次**（目标迈向 10 亿）。5/5 Glean 发布"企业 AI 同事"(AI coworker) 套件：主动任务管理（personal graph 驱动的活动卡片、先给初稿）、Skills（可复用执行逻辑封装）、跨企业应用委派多工作流 + 审批控制、Adaptive Reasoning（按任务匹配模型与智能等级）、语音对话、Canvas 透明修订评审、共享 Library。Glean 核心是"permissions-aware knowledge graph"（权限感知知识图谱）——连接 Slack/Docs/邮件/Jira/Confluence/Salesforce 等，既懂公司内部又严守权限边界。另：Glean:GO 2026 大会在筹备中（CEO Arvind Jain、NVIDIA、Ericsson、DaVita 等演讲者）。本周无新公告，因 6/9 刚完成大额融资 + 5 月刚发大版本，处于节奏间歇。

**关键数据**：估值 $7.2B、融资 $150M、ARR $3亿（15 个月 3 倍）、agent 年执行 1 亿次动作（均 6/9 口径，背景）——来源：aibusiness.vc 6/9 [AI Business](https://aibusiness.vc/startups/glean-7-billion-enterprise-ai-reads-your-company-2026)

**影响判断**：Glean 是"企业内部知识层 + agent 执行层"最清晰的赢家样本——不做炫酷消费聊天机器人，而做"懂公司一切、且严守权限"的隐形底座，这正是 Fortune 500 愿付费、原始大模型做不到的护城河。ARR 15 个月翻三倍、估值一年内大涨，验证企业 agent 商业化拐点已到。本周静默不改其高增长轨道。


**Midjourney（V7）**

本周无 Midjourney 官方重大新发布，主线动态集中在区间前两周（背景，非本周）：**6/11** 官方将默认模型从 V7 升级为 **V8.1**（V7 仍可手动选用）；**6/16** 为 V8.1 推出 **Draft 模式**（每次草稿生成 24 张低分辨率图、可对满意图点"Vary"出全质量渲染、草稿任务仅耗 V8.1 SD 任务一半的 fast hours），并新增 `--preview` 测试早期模型特性。V8.1 此前 4/14 alpha 上线、4/30 进入正式站与 Discord。V8.1 相比 V7：开启 HD 模式渲染尺寸翻倍、分辨率 4 倍（2048px 原生、无需单独 upscaler），SD 出图约 4 秒、HD 约 12 秒（提速约 4–5 倍），文字渲染更准。注意 V8.1 暂不支持 Omni Reference/Character Reference/multi-prompts/Quality/Niji/Turbo（需回退 V7）。V8.2 已开始训练（midjourney.com/rank-v8-1 收集评分）。本周（6/21–6/27）未见官方新公告，处于 V8.1 推默认 + Draft 模式后的稳定期。

**关键数据**：V8.1 默认日 6/11；Draft 模式 6/16（每次 24 图）；HD 2048px、4x 分辨率、出图 4–12 秒（V8.1 口径）——来源：releasebot.io/Midjourney [Releasebot](https://releasebot.io/updates/midjourney) ；blakecrosley 参考 [Blake Crosley](https://blakecrosley.com/guides/midjourney)

**影响判断**：作为 B 组唯一"对象名锁定 V7"的产品，事实是 Midjourney 已在 6/11 把主力推进到 V8.1、且 V8.2 在训练中——V7 已退居"全功能兼容备选"。这意味着本期对 Midjourney 的真实观察重点应是 V8 系列的提速与文字渲染突破（直接对标 GPT-image、Nano Banana 等）。Draft 模式是面向高频创作者的"低成本快速试错"工作流创新，强化其在专业创意生产链中的卡位。


#### 🇨🇳 中国公司


**阿里云（Qwen / 夸克AI）**

本周（6/21–6/27）阿里云无新模型重大首发，处于 5 月旗舰发布后的商业化/生态整合期。背景主线（非本周）：**5/20** 杭州阿里云峰会上，阿里云智能 CTO 周靖人发布 **Qwen3.7 全系**（含万亿参数 MoE 架构的 Qwen3.7-Max-Preview 与密集架构的 Qwen3.7-Plus-Preview），定位"面向智能体时代的新一代大模型"，官方称综合能力国内第一、编程与工具调用逼近 GPT-5.4：MMLU 89.7%、HumanEval 87.2%、工具调用准确率 92.5%、上下文窗口最高 200 万 token。Qwen3.7-Plus-Preview 以 Apache 2.0 开源可商用。6 月主线是 618 大促期间阿里云百炼 MaaS 平台对 Qwen3.7-Plus 推出按量优惠订阅方案（约 6 月上中旬，非本周）。C 端旗舰夸克（3/13 升级为"AI 超级框"超级智能体，整合 AI 对话/深度思考/深度搜索/深度研究/深度执行）继续作为集团 AI 旗舰应用运营，月活此前披露约 1.48 亿（2025/3 口径）。本周无官方新发布公告，原因是 5 月刚密集发版 + 618 周期以运营促销为主。

**关键数据**：Qwen3.7 MMLU 89.7%、HumanEval 87.2%、工具调用 92.5%、200万上下文（5/20，背景）；夸克 MAU 约1.48亿（2025/3，背景）——来源：CSDN 5/20 [CSDN](https://blog.csdn.net/xyghehehehe/article/details/161263637) ；aitoollab 5/21 [AIToolLab](https://www.aitoollab.cn/articles/qwen3-7-max-official-release-20260521/)

**影响判断**：阿里"夸克（感知入口）+ 通义千问（智能中枢）"双轮战略清晰，目标是从"工具+模型"演进为"智能体网络"。Qwen3.7 把开源（Plus）与闭源旗舰（Max）分层，既守 Hugging Face 开源生态领导地位，又用 Max 抢企业 Agent 底座。本周静默不改其国内综合能力第一的地位；真正看点在 Qwen3.7 正式版商用授权与夸克智能体的 DAU 转化。


**智谱（GLM / 清言）**

> 详见上文「本周 TOP 5」。该对象本周为重大动态，核心要点已在 TOP 5 展开。

**补充影响判断**：GLM-5.2 是国产开源的里程碑——"代码能力进全球第一梯队 + 纯国产算力训练跑通 + MIT 高频迭代"三重叠加，叠加 Claude 因出口管制对美境外暂停访问的背景，被视为国产替代关键补充。但"持续涨价"（Coding Plan 三轮调价、海外 API 涨 67%–100%）与推理速度短板，是其商业化与体验的双刃剑。本周的实测发酵正在检验其 1M 上下文的真实有效性。


**月之暗面（Kimi K2）**

月之暗面在窗口前沿（6/12–6/15，紧贴但略早于 6/21，属背景）完成 **Kimi K2.7 Code** 编程大模型的发布并开源：6/12 推出并开源，基于上一代 K2.6 优化，强化长上下文编程的指令理解、改善长任务冗余推理，整体 token 平均消耗降低 30%；专业代码评测 Kimi Code Bench v2 +21.8%、Program-Bench +11%、MLS Bench Lite +31.5%，智能体执行类测试约 +10%。计费延续前代：1M token 标准输入 6.5 元、输出 27 元，缓存命中输入降至 1.3 元；Kimi Code Plan 默认模型已切换为 K2.7 Code。官方说明 K2.7 Code 主打编程、必须开启思考模式（关闭会报错或回退 K2.6），非编程任务建议用综合更强的 K2.6。**6/15 上线 K2.7 Code 高速版**：输出速度达普通版 5–6 倍，常规约 180 token/s、短上下文最高 260 token/s，资费为普通版 2 倍。本周（6/21–6/27）无新模型公告，为 K2.7 Code 发布后的开发者落地期。背景：K2.6（4/20–21 发布开源）为万亿参数 MoE（激活 320亿）、原生多模态、最多调度 300 子 Agent 并行 4000 步、SWE-Bench Verified 80.2；Kimi 近期完成约 20 亿美元融资（背景）。

**关键数据**：K2.7 Code token 消耗-30%、Code Bench v2 +21.8%、高速版 180–260 token/s、API 输入6.5元/输出27元(每百万)——来源：腾讯新闻/PConline 6/12 [腾讯新闻](https://news.qq.com/rain/a/20260612A095TJ00) ；知乎/OpenCSG 4/29(K2.6,背景) [知乎](https://zhuanlan.zhihu.com/p/2032879542541493707)

**影响判断**：月之暗面延续"长文本+深推理+强智能体"路线，K2.7 Code 是其在 AI 编程订阅赛道（对标 Claude Code/Cursor）的专用化卡位——以"降 token 消耗 30% + 高速版 5–6 倍输出"直击编程 agent 的成本与延迟痛点。"编程用 K2.7、通用用 K2.6"的双模型分工显示其产品线开始精细化。本周静默属正常迭代间歇。


**MiniMax（海螺 / abab）**

本周无 MiniMax 新模型重大首发，处于 M3 发布后的生态与资本市场关注期。背景主线（非本周）：**5/31–6/1** MiniMax（稀宇科技，已港股上市 0100.HK）正式上线旗舰 **MiniMax M3**，宣称是国内首个"Frontier Coding & Agentic + 百万上下文 + 原生多模态"三项能力兼备的旗舰；架构为 MoE（**总参数 428B、每 token 激活 23B**），引入自研稀疏注意力 **MSA（MiniMax Sparse Attention）**，1M token 上下文下解码速度较上代提升约 15.6 倍。窗口内（6 月下旬）资本市场侧有摩根士丹利就 M3 发布的管理层交流纪要流出（大摩 0100.HK 研报）。产品矩阵当前含语言模型 M3/M2.7/M2.5、视频 Hailuo 2.3/2.3 Fast、语音 Speech 2.8、音乐 Music 2.6。海螺 AI（生产力产品）与开放平台为主要落地入口；视频模型 Hailuo 系列此前在 Artificial Analysis 全球榜位列前茅、累计生成视频超 5.9 亿个（背景）。本周无官方新发布，原因是 M3 刚于月初发布，处于推广与商用接入期。

**关键数据**：M3 总参 428B/激活 23B、MSA 稀疏注意力、1M 上下文解码提速约15.6x（5/31–6/1，背景）；Hailuo 累计生成视频 >5.9 亿（背景）——来源：新浪科技/IT之家 6/1 [新浪财经](https://finance.sina.com.cn/tech/digi/2026-06-01/doc-inhzwisw4078697.shtml) ；DataLearner [DataLearner](https://www.datalearner.com/ai-models/pretrained-models/minimax-m3)

**影响判断**：MiniMax 用 M3 把"编程/Agentic + 百万上下文 + 原生多模态"三能力首次合一，且自研 MSA 稀疏注意力直击长上下文推理成本，是其作为已上市公司向资本市场证明技术领先的关键牌。相对 GLM-5.2（纯文本代码）与 Kimi（编程专用），M3 的多模态+视频（海螺/Hailuo）矩阵是差异化优势。本周静默不改其多模态旗舰定位。


**腾讯（混元 / 元宝）**

本周无混元新模型重大首发，焦点在"微信原生 AI 智能体"的生态卡位演进。背景与近期主线：4 月混元 **Hunyuan 3.0（Hy3）** 发布，总参数 2950 亿，走"够用且便宜"的效率路线（不追万亿参数军备竞赛），后续预告更大参数模型；同期元宝以"红包封面助手"形态进入微信聊天界面，从独立 App"降格"为微信对话框里的一个联系人/内部组件。**据报道 6/2 微信原生 AI 智能体正在收尾测试**（非本周，但本周持续发酵）：钛媒体等分析称腾讯"封了自家元宝、微信 AI 亲自下场"，3 月已撤销存续十年的 AI Lab、人员并入混元体系收拢力量主攻底层模型。生态互操作信号：美团王兴宣布 AI 助手"小美"将接入腾讯元宝，用户在元宝内说需求即可调起外卖等本地生活服务——被视为超级 App 间首次 AI 层"互操作"实验。投入侧：腾讯 2025 年 AI 新产品（混元+元宝）投入约 180 亿元，刘炽平表示 2026 年投入至少翻倍；元宝日活此前披露约 1800 万（背景）。本周无官方新模型公告，原因是战略重心转向微信原生 Agent 的内测打磨与底层模型收拢。

**关键数据**：混元 3.0 总参 2950亿（4月，背景）；2026 AI 投入≥2×（2025 约180亿）；元宝 DAU 约1800万（背景）——来源：搜狐 3/22 [搜狐](https://www.sohu.com/a/999666634_122576099) ；钛媒体 [钛媒体](https://www.tmtpost.com/8014103.html)

**影响判断**：腾讯的真正杀招不是单点刷榜，而是把 AI Agent 织进微信 13 亿用户的对话流——"微信原生 AI 智能体"若上线并向外部（美团、潜在滴滴/京东/拼多多）开放互操作，将重新定义"超级 App 的 Agent 入口"竞争规则。混元 3.0 的"够用且便宜"效率路线与微信分发是其护城河组合。本周虽无新模型，但生态层动作的战略权重高于一次模型发布。

---



---

### 🛠️ Agent 框架工具 + 其他参与者

**OpenClaw（Agent OS）**

本周OpenClaw发布了 **2026.6.11**（GitHub标注 24 Jun 23:37，Pre-release，落在本期区间内）。这是一个面向运营/集成的广覆盖更新，重点在"渠道控制+操作工作流+插件分发安全"三条线。①渠道控制更强：新增 Slack relay mode、原生 Mattermost `/oc_queue`、以及 per-DM 模型覆盖（per-DM model overrides），让多渠道运营更易自动化与调优（#94707/#95546/#95120）。②运营工作流更丰富：`openclaw agent --message-file` 支持文件驱动的消息输入，RAFT CLI wake bridge 提供远程唤醒路径（#93351/#95497）。③插件分发更安全：更多官方插件被干净地外置化（externalized），并向已安装客户端提供 bundled plugin icon 元数据（#95683/#95845）。④移动端运营增强：Android 设置详情面板提升移动端配置可见性（#95148）。⑤Agent 轮次更可靠：Codex partial deltas、harness activation、长上下文 prompt-cache 稳定性减少了丢进度与运行不一致（#95404/#95652/#95624）。此外网关与插件工具链新增 channel identity hook context 与 per-agent usage-cost 报告（精确路由与计费）。修复面覆盖 Telegram 进度渲染、webhook 生命周期、reaction directives、重复 mirror 写入、WhatsApp 持久回复目标等。技术判断：OpenClaw 正从"单 agent 工具"向"多渠道 Agent 运营平台（Agent OS）"深化，本期主轴是企业级渠道治理与可观测计费，而非模型能力本身——这是 Agent OS 走向生产化的典型信号。

**关键数据**：版本 2026.6.11，发布时间 24 Jun 2026 23:37（Pre-release）— [GitHub](https://github.com/openclaw/openclaw/releases) ；上一版 2026.6.5 约 Jun 9 2026 引入并行 web 搜索

**影响判断**：per-DM 模型覆盖 + per-agent 计费 + 渠道身份 hook 这一组合，标志 OpenClaw 在为多租户/团队化运营铺路；渠道控制（Slack/Mattermost/WhatsApp/Telegram）的密集投入说明其定位是"跨渠道统一 Agent 运行时"，而非单一聊天机器人，是 Agent OS 赛道生产化的重要一步。


**Dify**

本周Dify发布 **1.15.0**（GitHub标注 25 Jun 13:16，落在区间内），是一个功能密度很高的版本。①推出 **difyctl 命令行客户端**：可直接从终端运行 apps 与 workflows，让个人 agent、脚本、CI 流水线无需打开 Web UI 即可调用 Dify 工作流；跨平台（macOS/Linux/Windows）单命令安装、无需 access token、二进制公开发布并带 checksum 校验（#37036/#37454）。②**工作流/Chatflow 中可视化 CoT**：可将模型推理流式输出到独立的实时"thinking"面板，刷新后推理仍保留，且 CLI 与 workflow run preview 中同样可见（#37460/#37828）。③更丰富的 Human-in-the-Loop 表单：暂停等待人工输入时，表单支持下拉选择与文件/多文件上传，而不仅是纯文本（#36322）。④支持慢速长耗时模型：通过轮询机制支持图像/视频生成等长耗时模型，避免超时（#37462）。⑤知识库可从 Excel 内嵌图片中抽取内容（#37104）；Phoenix 自定义 trace session id 增强可观测性（#37056/#37283）。⑥UI 大改：重设计 landing/onboarding、改进命令面板、可折叠工作流面板、删除应用前一键确认等。同时本周（6月22日）安全公司 Zafran 披露 Dify 存在四个漏洞（"DifyTap"，可跨租户窃听 AI 数据），其中 CVE-2026-41948（CVSS 9.4，Plugin Daemon）据报道仍未修复——这是本期 Dify 的重大负面信号。技术判断：difyctl + CoT 可视化代表 Dify 向"开发者/CI 友好 + 可观测"演进，但跨租户安全事件可能影响其在企业侧的信任。

**关键数据**：版本 1.15.0，发布 25 Jun 2026 13:16 — [GitHub](https://github.com/langgenius/dify/releases) ；安全披露 DifyTap，CVE-2026-41948 CVSS 9.4，2026-06-22 — [Zafran](https://www.zafran.io/resources/difytap-zafran-discovers-how-attackers-can-silently-wiretap-ai-data-across-tenants-on-a-platform-powering-1m-apps) ；称 Dify 驱动超 100 万个应用

**影响判断**：1.15.0 的 difyctl + CoT 面板把 Dify 从"低代码 Web 平台"推向"可脚本化、可观测的 agent 基础设施"，扩大了在 CI/自动化场景的适用面；但同周曝出的跨租户高危漏洞（尤其未修复的 CVSS 9.4）是企业采用的现实风险点，需密切跟踪补丁进度。


**Hermes Agent（自进化，增长最快）**

本周区间内（6月21-27日）Nous Research 的 Hermes Agent 未发布新的主版本，但其上一主版本 **v0.17.0（v2026.6.19，"The Reach Release"）于6月19日发布**（背景，非本周，紧贴区间起点），且 GitHub 仓库本周持续高频提交（pushed_at 显示 2026-06-28 仍在活跃更新），说明本周处于 v0.17 之后的密集补丁迭代期。v0.17.0 关键内容（作为本周生态背景）：①Hermes 接入 iMessage（基于 Photon Spectrum 托管线路池，无需 Mac relay，定位为 BlueBubbles 继任者）；②加入 Raft agent 网络作为 gateway channel（wake-channel bridge，隐私契约设计，wake payload 仅含元数据不含消息体）；③subagents 可后台运行；④图像生成支持编辑；⑤可通过 xAI Grok 订阅调用 Cursor 的 Composer 模型；⑥dashboard 新增完整 profile builder 与安全登录、Skills Hub 浏览器重构、memory 工具大升级。该版本自 v0.16.0 起累计约1,475 commits、约800 merged PR、235,390 行新增、245 名社区贡献者，迭代速度惊人。技术判断：Hermes 的核心差异化是"内置闭环学习"（经验中创建技能、使用中自我改进、跨会话用户建模 via Honcho），并兼容 agentskills.io 开放标准；其"增长最快"名号有 GitHub Star 数据支撑（约20.4万）。

**关键数据**：GitHub Stars ≈ 204,381（api.github.com，2026-06-28取数）；上一主版本 v0.17.0 发布于 2026-06-19（区间外背景）— [GitHub](https://github.com/nousresearch/hermes-agent/releases) ；v0.16.0→v0.17.0 约1,475 commits / 245 贡献者

**影响判断**：Hermes 以"自进化学习闭环 + 多渠道（含 iMessage/Raft）+ 模型无锁定"构成强护城河，约20万 Stars 印证其为2026增长最快的开源 agent 框架；本周虽无主版本，但仓库持续高频更新表明其迭代节奏未减，是 OpenClaw/Hermes 这类"个人 Agent OS"路线的重要标杆。


**Claude Code**

本周 Anthropic 的 Claude Code 有密集补丁发布，Releasebot 于 **6月27日首次收录 2.1.193 与 2.1.195** 两个版本（落在本期区间内）。2.1.195 关键变更：①新增 `CLAUDE_CODE_DISABLE_MOUSE_CLICKS`，可在全屏模式禁用鼠标点击/拖拽/悬停同时保留滚轮；②修复 hook matchers 对带连字符标识符（如 code-reviewer、mcp__brave-search）误作子串匹配的问题，改为精确匹配；③修复 macOS 长会话中默认输入设备切换后语音听写录到静音；④修复无空格书写语言（中/日/泰）语音听写自动提交不触发；⑤修复后台 agent daemon 控制 socket 启动失败导致不可达、阻塞重启；⑥改进 Linux 语音模式、`claude agents` 列表显示与 Remote session 启动（带 provisioning checklist）。2.1.193 关键变更：新增 `autoMode.classifyAllShell`（将所有 Bash/PowerShell 命令走 auto-mode 分类器）、auto-mode 拒绝原因写入 transcript、新增 `claude_code.assistant_response` OpenTelemetry 日志事件、bash 模式实时文件路径自动补全、空闲后台 shell 的内存压力自动回收等。技术判断：本周 Claude Code 更新集中在后台 agent 可靠性、可观测性（OTel）、auto-mode 安全分类与语音/UI 打磨，属于"生产级稳定性"打磨而非大功能跃迁。

**关键数据**：版本 2.1.193 与 2.1.195，Releasebot 首次收录 2026-06-27 — [Releasebot](https://releasebot.io/updates/anthropic) ；原始 CHANGELOG：[GitHub CHANGELOG](https://raw.githubusercontent.com/anthropics/claude-code/refs/heads/main/CHANGELOG.md) ；（背景）6月15日编程用量计费拆分原定生效但已暂停

**影响判断**：Claude Code 把重心放在后台 agent 稳定性与 OTel 可观测、auto-mode 命令安全分类，反映其正服务于企业级长时运行 agent 场景；OTel 默认会随 prompt 日志开关附带响应内容这一改动，对合规部署是需注意的信号。


**Codex CLI（SWE-bench #1）**

本周 OpenAI Codex 生态有重要更新，官方 changelog 显示 **6月25日 Codex Remote 正式 GA**（区间内）：可从 ChatGPT 手机 App 在已连接的 Mac/Windows 主机上启动或继续工作、查看进度并审批操作；Remote Control 改为每台 iOS/Android 设备与每台主机间一对一鉴权 QR 配对；新增 DigitalOcean 插件（可让 Codex 自动开 Droplet、配 SSH、接入 Codex App 作为远程工作区）。6月22日 ChatGPT for iOS 1.2026.167：新增 per-host personality（Friendly/Pragmatic）、composer 内直接编辑 goals、forked 对话回链原线程，改进 subagent/任务进度可见性等。GitHub openai/codex 仓库本周仍高频更新（pushed_at 2026-06-28），近期 release 含 0.142.x 维护补丁（formatter 成功时静默、失败仍显示诊断）。在 SWE-bench 官方榜单上，GPT-5.2 Codex 以 72.80 居首，对应"SWE-bench #1"称号。技术判断：本周 Codex 主线不在 CLI 内核能力，而在"远程/移动控制 + 云端工作区 provisioning"——把 Codex 从本地 CLI 扩展为"手机可遥控的云端编码 agent"，强化端到端可达性与运营闭环。

**关键数据**：Codex Remote GA 2026-06-25；ChatGPT iOS 1.2026.167 于 2026-06-22 — [OpenAI](https://developers.openai.com/codex/changelog) ；GitHub Stars ≈ 94,084（api.github.com，2026-06-28）；SWE-bench：GPT-5.2 Codex 72.80 居首 — [SWE-bench](https://www.swebench.com/)

**影响判断**：Codex Remote GA 标志 OpenAI 把编码 agent 推向"移动遥控 + 云主机自动 provisioning"形态，与 Anthropic Claude Code 的 Remote session、OpenClaw 的远程 wake 形成同一趋势——agent 正脱离单机，走向"随处可达、云端持久"，这是2026 coding agent 竞争的关键战线。


**Google ADK**

本期区间（6月21-27日）内 google/adk-python 未见标注落在区间内的正式 tagged release，最近一个版本为 **v2.3.0（2026-06-17，区间外背景）**，但仓库本周仍在活跃提交（pushed_at 2026-06-27）。v2.3.0 关键内容（作为生态背景）：新增 `create_http_options` 到 ContextCacheConfig（缓存创建超时）、GCS first-party toolset 接入 ADK integrations、`adk run` CLI 新增 log_level、AgentRegistry 客户端支持 mTLS、core/CLI 迁移到 enterprise parameters、新增 GEPARootAgentOptimizer、支持 Gemma4、新增 E2BEnvironment 远程沙箱工作区、实验性 Antigravity SDK agent wrapper 等。结合5月底 ADK 2.0 GA（graph-based workflows、collaborative agents、Agents CLI、Skills）与"ADK 不是工具包而是 agent 执行框架"的定位，ADK 正快速企业化。技术判断：ADK 本周虽无区间内正式发版，但 v2.3.0 的 mTLS、enterprise parameters、GCS 工具集、GEPA 优化器密集落地，显示 Google 在把 ADK 打造为 GCP 上的生产级多 agent 执行框架；GEPA 优化器与 Gemma4 支持也呼应"自进化/可优化 agent"潮流。

**关键数据**：最近版本 v2.3.0，2026-06-17（区间外背景）— [GitHub](https://github.com/google/adk-python/releases) ；GitHub Stars ≈ 20,316（api.github.com，2026-06-28）；ADK 2.0 GA 于2026年5月

**影响判断**：ADK 以 mTLS、enterprise parameters、GCS 工具集、E2B 远程沙箱等密集企业特性，明确瞄准 GCP 生产部署；虽本周无区间内正式 tag，但其 2.x 迭代节奏与 GEPA/Gemma4 集成显示 Google 正押注"框架即执行层"，与 Dify/OpenClaw 等形成差异化（云原生+企业治理）。


**OpenCode**

本周 OpenCode（anomalyco/opencode）发布密集，官方 changelog 显示 **6月25日 v1.17.11** 与 **6月24日**两批更新（均落在区间内）。6月25日 Core：新增 session snapshots 与 revert 控制（可将会话回滚到更早消息，含文件变更）、始终打印 MCP OAuth URL 以保证手动登录可用；Desktop：Chrome 风格 `mod+1`~`mod+9` 标签切换、可拖拽标签、重设计桌面布局（更好的 titlebar 标签与归档会话）、修复多项会话/标签状态问题。6月24日 Core：MCP server instructions 注入 session context、新增 Opencode-managed provider 集成、MCP resource template 列表与读取工具、新增 `--mini` CLI 模式、MCP OAuth 回调绑定到 IPv4 loopback、修复跨平台路径与 ACP resource 处理；TUI：可配置快捷键打开 diff viewer、支持与 main 分支对比 diff、防止 worker 拒绝导致 TUI 崩溃。技术判断：OpenCode 本周主轴是"会话快照/回滚 + MCP 深度集成 + 桌面/TUI 体验"，强化其作为 provider-agnostic（多模型无锁定）开源编码 agent 的工程成熟度。

**关键数据**：v1.17.11 于 2026-06-25，另有 6月24日批次更新 — [OpenCode](https://opencode.ai/changelog) ；GitHub Stars ≈ 179,784（api.github.com，2026-06-28）— [GitHub](https://github.com/anomalyco/opencode/releases) ；（对比来源）MorphLLM 6月9日称 OpenCode 161K vs Codex 91K Stars

**影响判断**：OpenCode 以约18万 Stars 领先多数同类（含 openai/codex 的约9.4万），其本周 session snapshot/revert 与 MCP 深度集成补齐了"可回滚、可扩展工具"的工程短板；provider-agnostic 定位使其成为不愿被单一模型厂商锁定团队的首选开源编码 agent。

---

#### 其他参与者


> 💤 本周静默：Scale AI（SEAL，本周无新榜单/评测公开发布）；Cohere（本周无 Command R+ 或新模型公告）；SSI（"零发布"策略，本周静默符合预期）。


---

### ⚡ 算力云硬件 + 🦾 具身机器人

**NVIDIA（GPU/CUDA/Blackwell）**

本周NVIDIA以"科学计算+企业AI落地"两条线密集发声，均落在区间内。①6月23日发布博客《NVIDIA and AWS Collaborate to Bring AI to Production at Scale》，与AWS深化合作，主打低延迟推理、快速向量检索与GPU性价比，将AI系统规模化生产化（原文：building AI systems at scale requires low-latency inference, fast vector search, strong GPU price-performance）。②6月23日同时发布企业Agent工具链博客（NVIDIA Agent Toolkit：open models + tools + skills + secure runtime），瞄准企业可信专用AI。③6月22-23日围绕德国汉堡ISC High Performance大会发布多篇：最新TOP500榜单NVIDIA技术驱动超400台/占81%，新上榜系统九成采用NVIDIA；Green500前八全部用NVIDIA GPU，榜首KAIROS用单颗Grace Hopper超芯片；376台用NVIDIA网络（多为Quantum InfiniBand）。NVIDIA称其TOP500系统AI训练吞吐>其余平台总和2倍、推理近3倍。④6月22日发布Vera Rubin超算用于科学计算博客、电信7×24 AI Agent（DTW Ignite 2026）、JUPITER欧洲首台百亿亿次超算（Grace Hopper+Quantum-X800）。⑤6月24日召开2026年度股东大会（线上，9 a.m.），投资者聚焦Blackwell产能爬坡与首款自研Vera CPU。背景(非本周)：Blackwell-Next名称6月初现身Linux 7.2内核补丁；RTX Spark超芯片Computex/GTC Taipei 6月1日发布。技术/商业判断：本周无新硬件发布，主线是"Blackwell大规模交付+生态绑定（AWS/超算/电信/Agent）"，并为下一代Rubin/Vera铺垫，巩固CUDA+网络（InfiniBand）全栈护城河。

**关键数据**：TOP500占比81%/超400台、GPU加速238台、网络376台、Grace CPU 26台（[NVIDIA Blog](https://blogs.nvidia.com/blog/top500-green500-supercomputers-isc-2026/)，2026-06-22/23）；股东大会2026-06-24 9 a.m.（[NVIDIA News](https://nvidianews.nvidia.com/news/latest)，2026-06）

**影响判断**：①超算榜单81%份额印证NVIDIA在AI+科学计算双重统治力，竞争对手难撼。②与AWS高调合作信号微妙——AWS自研Trainium在追赶，NVIDIA以"生态共存"对冲被去CUDA化风险。③Vera/Rubin爬坡是下半年估值关键变量。

---

#### 🦾 具身机器人


**宇树 Unitree（H1/G1）**

> 详见上文「本周 TOP 5」。该对象本周为重大动态，核心要点已在 TOP 5 展开。

**补充影响判断**：①降价+现货=宇树押注规模化与消费/教育市场放量，2.99万元把人形机器人压进"高端消费电子"价位带。②对G1/H1主力线形成产品矩阵下探，巩固性价比标签。③配合此前与英伟达Isaac GR00T合作，软硬生态双轮驱动，强化全球具身智能领跑地位。

---


**AWS（Bedrock/Trainium/SageMaker）**

本周AWS核心是延续6月18日纽约峰会的密集发布，区间内（6月22日周一）发布官方周报《AWS Weekly Roundup: NY Summit recap, Local Zone in Hanoi, Grok 4.3 in Bedrock, price reductions》。①Amazon Bedrock AgentCore harness在6月18日纽约峰会正式GA（Forbes 6月21日），主打"两次API调用即可构建企业Agent"，大幅降低Agent开发门槛。②Bedrock新增Fully Managed Knowledge Base（全托管知识库），提供原生数据连接器、Smart Parsing多格式自动数据准备、Agentic Retriever多步复杂查询，与AgentCore Gateway集成，简化企业RAG管线搭建（官方博客，约6月26日）。③本周xAI的Grok 4.3模型上线Bedrock；同时宣布多项降价（price reductions）；越南河内开通Local Zone。④AWS DevOps Agent新增上线前AI生成代码的验证能力，在类生产环境自动测试。背景(非本周)：6月15日周报含FinOps Agent预览、Gemma 4上Bedrock。技术/商业判断：AWS本周主线是"Agent化(AgentCore)+模型货架扩张(Grok 4.3)+降价"三板斧，靠托管服务把底层（含Trainium与NVIDIA GPU）复杂度封装起来，弱化客户对单一硬件/CUDA的依赖。Trainium本周无新芯片发布，主要以"直销自研芯片挑战NVIDIA"的产业叙事出现（背景）。

**关键数据**：AgentCore harness 6月18日GA、"两次API调用"（[Forbes](https://www.forbes.com/sites/janakirammsv/2026/06/21/why-aws-agentcore-harness-is-a-big-deal-for-enterprise-agents/)，2026-06-21）；Grok 4.3上Bedrock+降价+河内Local Zone（AWS周报，2026-06-22）

**影响判断**：①AgentCore GA标志AWS把"企业Agent生产化"作为2026主战场，与微软/谷歌正面竞争。②全托管知识库+多模型货架(含Grok 4.3)强化Bedrock"模型超市"定位。③降价是规模化信号，意在锁定企业迁移成本、对冲NVIDIA算力溢价。

---


**Azure（Azure AI / OpenAI Service）**

> 详见上文「本周 TOP 5」。该对象本周为重大动态，核心要点已在 TOP 5 展开。

**补充影响判断**：①本周静默期更多是Build发布后的消化期。②AKS 7.5万节点级运营披露，侧面印证Azure为OpenAI承载的超大规模算力底盘是其核心壁垒。③$250B采购合约把Azure云业务增长与OpenAI深度绑定，是中长期最关键变量。

---


**Figure AI（Figure 02）**

**本周无重大公开动态落在区间内（6月21-27）**，原因：Figure官方News列表最新一条为5月26日《Figure Signs Agreement with Catalyst Brands to Scale Humanoid Operations》，本周无新发布。背景(非本周，理解路线与Figure 02现状)：Figure 02为商用主力（双足、35自由度、16自由度灵巧手、搭载Helix VLA、双NVIDIA GPU、约5小时续航），已在宝马Spartanburg工厂部署，截至2025年11月累计贡献超3万辆车生产、运行1250+小时、硬件故障极少（前臂为最大故障点，经验已用于Figure 03重构腕部电子）。公司主力已转向Figure 03（面向家庭、约60kg、3克级触觉、无线充电、10Gbps毫米波数据回传、目标价约2万美元）与Helix 02全身自主（System 1统一视觉运动策略+System 0千万参数控制器，1000+小时人类动作数据，演示连续61个loco-manipulation动作）。2025年9月C轮超10亿美元、估值390亿美元；产能目标BotQ年1.2万台→中期百万台/年。

**关键数据**：估值$39B、C轮>$1B（2025-09，[Figure](https://www.figure.ai/news)，背景）；BMW累计>3万辆/1250+运行小时（2025-11-19 F.02博客，背景）；Helix 02：System 0约1000万参数/1000+小时数据/61连续动作（thomasnet 2026-03，背景）

**影响判断**：①Figure战略重心已从Figure 02(工业验证)转向Figure 03(家庭量产)与Helix软件栈，本周静默属产品换代期正常现象。②"硬件趋同、AI制胜"逻辑下，Helix 02全身自主是其对宇树/Optimus的核心差异化。③2万美元目标价若达成，将与宇树2.99万元R1在消费级市场正面相撞。

---


> 💤 本周静默：优必选 UBTech（Walker S）（本周无新型号/新订单的重大公开公告落在区间内（6月21-27））。

## 📋 关于本周报

- **数据口径**：仅统计 2026-06-21 ~ 2026-06-27 自然周内的真实公开动态；区间外事件标注"（背景，非本周）"。
- **覆盖**：38 个研究对象，6 大赛道全覆盖，全部附原文链接与数据来源。
- **图标说明**：🔥 重大 ｜ 🟢 一般 ｜ 🟡 边缘 ｜ ⚪️ 本周静默。
- **来源说明**：官方博客 / 论文 / GitHub release / 官方公告优先于二手新闻；GitHub Stars 等数据直查 API 实时取数。
- **下期预告**：下周日同一时间，继续追踪全球 AI 动态。
