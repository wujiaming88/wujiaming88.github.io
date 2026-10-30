---
layout: single
title: "全球 AI 动态周报 · 第 23 期 · 账单到期：谁出钱谁供硅谁分发"
date: 2026-10-30 15:00:00 +0800
categories: [AI]
tags: [周报, AI企业研究, Alphabet, Meta, Anthropic, Oracle, OpenAI, AI基建, AI融资]
header:
  overlay_image: /assets/images/posts/2026-10-30-global-ai-weekly.png
  overlay_filter: 0.45
  caption: "全球 AI 企业研究周报 · 第 23 期"
excerpt: "窗口 2026-10-24 ~ 10-29；AI 基建账单到期——巨头发股与负 FCF、实验室 IPO 与 SPV、云侧多架构供硅同周落地。"
toc: true
toc_sticky: true
toc_label: "本期目录"
bucket: global-ai
---

账单到期之后，市场追问的不再是「谁的模型更好」，而是谁能以可持续资本结构，把硅、电力与分发同时交付到 2027。

上期三条主线——分发/云承诺/治理、Agent 系统级执行、资本从股权叙事转向债务与现金流——本周都没有消失，但主轴升级为**融资与算力供给重组**：已上市巨头用经营性现金加发债/发股续写 CapEx，前沿实验室用 IPO 与残值担保型 SPV 补账单，云商把加速器做成可替换菜单，芯片商以角石股权与残值支持锁定出货；Samsung 称 2027 HBM 售罄，则是所有 MW/GPU/XPU/TPU 叙事共同撞上的物理闸门。

## 本期要点

### Alphabet：Cloud 翻倍与 Search 承压同周定价

Alphabet 把「查询涨、广告慢」与「Cloud + TPU 外售翻倍」同周交给市场，二级市场以约 12–13% 跌幅、市值蒸发约 5000 亿美元量级定价——AI 搜索故事从流量切到单位广告收入，云故事从自用加速器切到可售货架。据 SEC Exhibit 99.1（10-28）：营收 1276 亿美元（+25%）；Google Cloud 307 亿美元（**+103%**），Cloud 营业利润 111 亿美元；Search & other 约 633–634 亿美元（+12%）；当季 PPE 采购 514 亿美元；自由现金流 **-91 亿美元**（连续第二季负）；9 月末长期债务 **1251 亿美元**（对比 2025 年末 465 亿美元）；ATM 季内净募约 124 亿美元、剩余约 276 亿美元；Gemini App **10 亿**用户，first-party model APIs 约 **320 亿 tokens/分钟**。同日 Gemini 4 Carbon 以网安 SOTA 叙事上线，先限 Fairwind 网络防御方；入门价同 Argon **2/10 美元**，之后 **4/20 美元**。它是唯一把自研加速器产品收入写进 Cloud 增长解释的一家，并与同周 Oracle 上架 TPU、OpenAI 购 TPU 传闻共振——后两者或未确认、或 2027 才爬坡。

### Meta：~$950 亿股权计划把循环资本写成条款

超大规模训练/推理基建进入「发股续命」阶段；Nvidia、AMD、Broadcom 向最大客户注资，卖铲人变成客户股东——循环资本从市场担忧变为可核条款。Meta IR（10-26）：约 **350 亿美元**承销（约 225 亿 Class A 远期售股 + 约 125 亿 Series A 强制转优先存托）；约 **600 亿美元** ATM（Class C，预期约 2027 Q1，**尚未签署、不保证设立**）；2026 CapEx 指引 **1350–1450 亿美元**；三家芯片商分别非连带有意合计最多 **50 亿美元** Class A（非约束意向）。媒体后续称普通股最终约 250 亿美元、认购约 5×；Nvidia 公开落袋 **30 亿美元**并扩大 Muse/Vera Rubin/Spectrum-X/BlueField-4/OpenShell 全栈绑定，AMD 公开 **10 亿美元**且 Helios 机柜已在 Meta 装机测试。与 Alphabet 负 FCF、Anthropic S-1、Broadcom 630 亿美元 SPV 同框，定义「谁为 2027 算力账单签字」。

### Anthropic：Form S-1（ANT）把算力账单搬上招股书

首家冲击万亿级估值预期的纯前沿实验室进入公开定价机，把「AI 资本开支能否兑付」从私有融资叙事搬上招股书。约 10-26 提交 Form S-1，拟 Nasdaq Global Select、代码 **ANT**；股数与价格区间未定。据主流媒体对 S-1 的转述：2026 上半年营收约 **163 亿美元**（同比约 +1,300% 量级），Q2 约 116 亿美元；上半年净亏约 **807 亿美元**（含大额非经营/估值相关项，口径需读风险因素）；企业客户 14,000+，约 250 家年贡献 ≥1000 万美元；净收入留存约 900% 量级；算力/基建多年承诺报道约 **6000 亿美元+**；估值市场预期约 1.5–2 万亿美元、路演或 11 月中——后两项日程与估值**尚未确定**。同周 10-27 红队研究展示真实软件攻击链（含 Chrome RCE 等，协调披露）——一边上市融资，一边展示模型已能打穿浏览器/操作系统。收入高度依赖 token 消费，对降价与用量弹性敏感；Amazon/Google 作为既有金主，上市后利益与治理更透明也更敏感。

### Oracle×Google TPU + Broadcom $630 亿 SPV：供给与信用同周改写

本周最强的云侧多架构供给与芯片商结构化融资同周落地——竞争变量从「Nvidia 配额」变为「加速器可替换性 + 谁能把算力订单做成可信贷资产」。双方 10-27 公告：OCI 将成为 **Google 之外首个提供 TPU 的 hyperscaler**，**日历年 2027** 起多年爬坡；TPU **8t**（训练）/ **8i**（推理）；OCI 供电力冷却与租户网，芯片间走 Google ICI+OCS。同日多架构菜单还包括 Vera Rubin NVL72 GA on OCI、计划部署 OpenAI **Jalapeño**（与 Broadcom）、Cerebras 2027、SambaNova SN50；FY2027 Q1 云基建收入 **74 亿美元**（+121%），当季新增容量 **850MW**。Broadcom 10-26：**630 亿美元**交易，BofA/Blackstone/Citi/MS 与 Broadcom；SPV 购 Broadcom XPU 与网络方案再租赁给 Anthropic，交付预期 **2027** 起；Broadcom 提供与一优先债权**等额 residual value 支持**（一优先金额媒体有约 435 亿美元说法，官方未拆分，本稿不采用）。Google 把十年 TPU 工程借 Oracle 企业客户与机房对外变现；若 Anthropic 或二手加速器弱于预期，残值担保可能显性化。Samsung 称 **2027 HBM 供给已在约定目标价售罄**、紧供给或延续至 2028，是共同物理闸门。

### OpenAI GPT-6.1 Terra：computer-use 半价 + Oracle 企业栈

中档 computer-use 价格腰斩，把「看屏→操作应用」从旗舰专属推到工作日默认档；同周 Oracle 应用层分发再建 Azure 之外的企业入口。OpenAI（10-26）：相对 GPT-5.6 Terra / GPT-6.1 Sol **低 50%**，定价 **1 / 0.05 / 5 美元** per M input / cached / output；ChatGPT Work 与 Codex 对 Plus/Pro/Enterprise/Edu 开放；API `gpt-6.1-terra`。厂商自测：Agents’ Last Exam 中档相对 5.6 Terra 高约 15 个百分点、成本约 1/3；Terminal-Bench 4.0 最大推理档 50.3% vs 5.6 Terra 21.5%。Oracle×OpenAI（10-27）：AI Workspace（ChatGPT 插件打通 Fusion/NetSuite/AI Database/OCI）、AI Security Mesh、App Composer（Codex→OCI）、SMB Bundle（每年 12,000 美元 OCI 积分 + ChatGPT Business 等，有条款）。这直接压 Anthropic/Gemini 同档 API 性价比，并对 Salesforce/ServiceNow/SAP 类应用层 AI 施压。同日 OpenAI 购 Google TPU 的 Reuters←The Information 传闻双方未确认，**不作确定事实**。

## 三云同周：需求确认，定价看现金消耗

AI 基础设施需求被三朵云同周增速确认，但**增长质量 vs 现金消耗**成为定价主轴——Alphabet/Amazon/Meta 更「烧」，Microsoft 相对「控」。

| 主体 | 窗内关键信号 | 资本姿态 |
|---|---|---|
| Alphabet | Cloud +103%；FCF -91 亿美元；长期债 1251 亿美元；ATM 剩余约 276 亿美元 | 负 FCF 第二季；用 ATM/债务撑 PPE |
| Meta | ~350 亿承销 + ~600 亿 ATM 意向；CapEx 1350–1450 亿美元；芯片商角石 | 创纪录股权；循环资本坐实 |
| Microsoft | Azure 首次披露约 332 亿美元（+48%）；季度 CapEx+融资租赁约 452 亿美元；FCF 仍正约 186 亿美元（同比 -27%）；VEO 自愿离职（媒体称约 6 万 eligible） | 「可控扩张」：加码基建同时组织瘦身 |
| Amazon | AWS 约 460 亿美元（+39%）；2026 现金 CapEx 仍约 2200 亿美元；TTM FCF 约 -424 亿美元；指引 27/28 增速 >40%；Trainium 考虑约 2027 年末起对外提供 | 用 backlog（约 5780 亿美元）换取市场耐心 |

Amazon 同周上线 TorchNeuron 公开测试，降低 `.to('neuron')` 迁移摩擦；Bedrock 含 OpenAI 用量上升。Microsoft 首次把 Azure 体量单列，Agents and Infra 768 亿美元（+25%），商业 RPO 6770 亿美元（+73%）——三云加速中唯一保持较「可控」正 FCF。采购合同需显式拆开「模型 SLA / 加速器世代 / 残值与提前终止」：Google 可同时做 Gemini 对手、TPU 供应商与 Cloud 房东；Oracle 可同时分发 OpenAI 应用层与出租 Google TPU。

![时间线](/assets/images/posts/2026-10-30-global-ai-weekly-fig1.png)

*图 1：本期主线事件时间线（10-24 ~ 10-29）。主控生成；数字与日期以母稿为准。*

## 中国平台：多模型货架与办公 OS 并行

国内增量不在又一次旗舰对决，而在**工作台默认哪几家模型、记忆与积分是否统一**。

字节 10-24 在火山方舟上架 `kimi-k3-1-pro-261024`；10-29 豆包工作默认开放 Kimi 3.1 Pro / GLM 5.3 / DeepSeek V4.1 Flash，按既有 AI 点数结算——工作台多模型优先于单模型绑死。IDC 披露 2026H1 中国 MaaS 市场规模 106.3 亿元，火山份额 **45.1%** 居首。腾讯 10-29 全球数字生态大会则押「Agent 办公 OS」：Hy4 正式版将发（首次视觉理解）与 Hy4 Flash；Buddy One 统一账号/积分/数据池；正式发布「腾讯网盘」作 Agent 记忆；WorkBuddy 累计约 **90 亿次**任务、覆盖中国 500 强约 50%（经营数字为公司口径）。

独立实验室侧，月之暗面 10-24 发布 **Kimi K3.1 Pro**（约 3 万亿参数、1M 上下文）+ Highspeed（约 2–3× 输出速），**完整权重计划 11 月 4 日前开源**，当日进火山方舟，10-29 上线 Google 邮件/日历/Drive 插件。阿里窗内无 Qwen 旗舰大版本，增量在千问×夸克网盘、百炼 `qwen-audio-3.1-realtime-flash` 与上架蚂蚁 `Ling-3.1-flash`。DeepSeek 本周信号转为 OpenRouter 周榜：V4.1-Flash-1017 约 **33.6 万亿 Token** 登顶（环比约 +801%），千亿融资落在 10-22 窗外。昇腾侧，武汉点亮全国首个 **950DT 1024 卡**液冷超节点（FP8 约 1 EFLOPS 等规格为大会报道）；盘古无公司级模型大版本。智谱、MiniMax 窗内无官方新品，可读信号偏情绪与流量榜。

## 垂直并购、合规入场与主权资本

Agent 收入开始被写进核心系统并购价签与公共部门认证管道。Guidewire 10-27 以 **17 亿美元现金**（另最高 4 亿美元或有）收购 Hyperexponential，押 agentic 核保，预计 FY2027 Q2 交割——垂直 Agent 被核心系统内化。Cognition 将 Corridor 并入并发布 Devin Security 2.0，编码 Agent 付费扩展转向安全。Serval 完成 1.5 亿美元 Series C、估值 30 亿美元（Sequoia 领投，媒体披露）。

合规与预算池同步成为分发入口：Perplexity 获 FedRAMP Class C (Moderate)，自称唯一带 live web search 的 Moderate SI；Harvey 获 FedRAMP Class D，并上线 Intake×Claude（业务侧 Claude 提问、法务 Harvey 控制面）；Glean 在 Claude Marketplace 可用 Anthropic 承诺 spend 购买。Sierra 冻结 PAP/Poppy v0.2 并推出 Compliance Console，管主动触达合规。主权叙事同周出现双路径：Cohere Series E 首关，目标最高 **CAD 70 亿美元**、估值 CAD 357 亿美元，加拿大政府最高 **C$16 亿**股权，并承诺 2030 前 ≥1000 加国技术岗、≥C$17 亿算力；Mistral 发布 Large 4（Le Chonk）开源权重（约 1T/52B MoE；API 0.70/2.10 美元；MaaS 商用需另许可）。NVIDIA 对 Hugging Face 约 **129.3 亿美元**收购引发 DOJ 问询（媒体，预计 2027 H1 完成）——开源分发入口所有权进入监管视野。

## 具身：扩站点与费用结构，头部窗内静默

海外具身本周唯一可核的「多站点扩部署」来自 Agility×GXO（10-26）：Digit 扩至北卡 Statesville 与田纳西 Lebanon；佐治亚已转运超过 10 万箱；2027 年初先上 Digit 4——计量尺从演示视频换成「第 N 个商业仓」。Tesla Optimus 量产确认落在 10-21 窗外，Figure design lock 约 10-22 窗外，二者窗内无新官方节点。

中国侧镜像海外 CapEx 叙事的是费用结构：宇树三季报（媒体转述）显示 Q3 营收 6.65 亿元（+69.93%），归母净利 1.13 亿元（-17.37%），扣非下滑，Q3 研发 1.27 亿元（**+249.58%**），前三季度经营现金流净额同比 -54.69%，货币资金约 73.54 亿元——收入高增、扣非与现金流承压、研发暴增。优必选与中欧数字协会签署 MoU（披露级，MoU≠订单）。Scale 同周在 UAE DIFC 设实体、签 Qatar Pearl 长租，并开源 FineART 机器人数据/模型，把数据与中东交付绑在一起。

## 强信号速览

| 公司 | 事件类型 | 日期 | 要点 | 竞争含义 |
|---|---|---|---|---|
| Alphabet | 财报 | 10-28 | 营收 1276 亿美元；Cloud +103%；Search +12%；FCF -91 亿美元；债 1251 亿美元 | Cloud+TPU 外售 vs AI Mode 单位广告承压 |
| Meta | 股权融资 | 10-26 | ~350 亿承销 + ~600 亿 ATM 意向；角石至多 50 亿 | 发股续命；循环资本坐实 |
| Anthropic | IPO 申报 | ~10-26 | Form S-1，代码 ANT；H1 收约 163 亿、亏约 807 亿（媒体） | 实验室进入公开定价机 |
| Broadcom | 结构化融资 | 10-26 | 630 亿美元 SPV 购 XPU 租给 Anthropic；残值支持 | 芯片商变信用担保人 |
| Oracle | 云供给+伙伴 | 10-27 | Google TPU→OCI（2027）；多架构；×OpenAI 企业栈 | 加速器可替换 + Azure 外应用分发 |
| OpenAI | 产品+分发 | 10-26/27 | GPT-6.1 Terra 半价 computer-use；Oracle Workspace 等 | 中档 agent 性价比下沉 |
| Microsoft | 组织+财报 | 10-26/28 | VEO；Azure +48% 首披露约 332 亿美元 | 加码基建与自愿减员并行 |
| Amazon | 财报+产品 | 10-26/29 | AWS +39%；CapEx 2200 亿美元；Trainium 或 2027 末外售 | 三云需求确认；自研硅外售意向 |
| Samsung | 供给 | 10-28/29 | 2027 HBM 售罄；紧供给或至 2028 | 全行业物理闸门 |
| 月之暗面 | 产品 | 10-24 | K3.1 Pro + 计划 ≤11/4 开源；进方舟与豆包工作 | 独立实验室旗舰+开源节奏 |
| 字节跳动 | 平台 | 10-24/29 | 方舟上架 Kimi；豆包工作默认三方模型；IDC MaaS 45.1% | 工作台多模型 > 单模型绑死 |
| Guidewire | 并购 | 10-27 | 17 亿美元现金购 Hyperexponential | 垂直 Agent 被核心系统内化 |

![三云营收同比增速](/assets/images/posts/2026-10-30-global-ai-weekly-fig2.png)

*图 2：Google Cloud / Azure / AWS 窗内披露的营收同比增速（%）。数据来源：各公司财报公告。*

## 本周 vs 上周

| 主线 | 上周（10-16~10-22） | 本周（10-24~10-29） | 走向 |
|---|---|---|---|
| 分发 / 云承诺 / 治理 | OpenAI 旗舰上架 Google Cloud；Muse 开放权重多云分发 | Oracle×OpenAI 企业栈；Oracle 上架 TPU（2027）；豆包工作默认三方模型；Buddy One；Claude Marketplace / Harvey Intake | 延续，入口更多元 |
| Agent 系统级执行 | Sierra×Stripe 同电话收款；Harvey 连接器；豆包拒绝清单 | GPT-6.1 Terra computer-use 半价；Gemini 4 Carbon 网安限放；Anthropic 红队；Sierra PAP v0.2；Devin Security 2.0；Kimi K3.1 Pro | 延续，价格与安全并进 |
| AI 资本结构 | CoreWeave/Oracle 信用重定价；Anthropic 亏损与估值下修（草案口径） | Alphabet 负 FCF；Meta ~950 亿股权+角石；Anthropic S-1；Broadcom 630 亿残值 SPV；三云财报同周 | **升级为主轴** |
| 算力供给架构 | 信用危机叙事压制订单兑现预期 | 多架构菜单（TPU/Vera/Jalapeño/Cerebras）；Samsung 2027 HBM 售罄 | 新出现 |
| 中国对照 | DeepSeek 千亿融资（消息口径）；字节 SAEP；腾讯元宝搜索开放 | Kimi 旗舰+限时开源；豆包多模型默认；腾讯 Buddy One；昇腾 950DT 点亮；DeepSeek 改看流量榜 | 转向平台与开源节奏 |
| 具身交付 | Tesla Optimus 确认量产；中国收入前五 | Agility×GXO 扩至第 2/3 仓；Optimus/Figure 窗内静默；宇树收入高增、扣非与研发 | 降温（头部）/ 计量尺切换 |

上期重心是「模型商品化之后，价值迁往分发、执行授权与债务定价」。本期重心迁到**账单本身**：谁用股权与负 FCF 砸机房，谁用 IPO 与 SPV 租赁补算力承诺，谁用多架构菜单抢客户，谁用角石与残值担保锁出货。信用担忧并未消失，但叙事从「能否融资」切到「融资结构 + 交付多样性」；HBM 售罄则把一切乐观外推按回物理分母。

## 对你意味着什么

*以下为编辑建议，面向公司战略观察者与投资人，均由本期母稿事实推导。*

1. **把尽调清单改成「资本结构 + 供硅合同」两栏。** 残值担保条款、角石是否最终交割、ATM 是否设立、TPU/Trainium 外售 SLA、加速器世代与提前终止——与模型榜单并列，缺一不投/不签多年期大单。
2. **拆开分发权与供硅权。** 同一家公司可能同时是模型对手、加速器供应商与云房东；采购合同显式分拆模型 SLA、机柜/加速器世代、残值与退出，避免「一套条款绑死三条风险」。
3. **用单位经济而非用户数定价搜索与 Agent。** Alphabet 同周 Cloud 暴增与 Search 承压被市场拆开定价，是教学样本；评估 AI Mode/computer-use 产品时，优先看单位广告收入、token 毛利能否覆盖算力账单，而非只看 DAU。
4. **跟踪循环资本的披露密度。** Nvidia/AMD 已公开落袋金额，Broadcom 角石仍为非约束意向；关注芯片商持股客户 ↔ 客户采购芯片的关联交易披露，以及 2027 交付与二手加速器价格是否触发残值担保显性化。
5. **中国工作台选型看默认模型集与积分池。** 豆包工作「三方模型 + 既有点数」与腾讯 Buddy One「统一账号/积分/记忆」是两种绑定方式；独立实验室（如 Kimi）的限时开源节奏决定是否可做可替换底座。
6. **具身投资改用交付地理学与费用结构。** 优先问第几个商业站点、箱/件吞吐、扣非与研发占比，少问演示视频；Optimus/Figure 窗内静默不等于叙事结束，但本期可读信号在 Agility 扩仓与宇树费用表。
7. **勿升格未确认项。** OpenAI 购 TPU、Anthropic 万亿估值与 11 月上市日、GLM-5.5「即将发布」、DeepSeek V5——一律保持未确认或窗外，不写入投资备忘录的确定事实句。

## 来源

### 一手 / 官方

- [Alphabet SEC Exhibit 99.1 Q3 2026](https://www.sec.gov/Archives/edgar/data/1652044/000165204426000080/googexhibit991q32026.htm)（10-28）
- [Gemini 4 Carbon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)（10-28）
- Meta IR 股权发行｜[investor.atmeta.com](https://investor.atmeta.com)（10-26）
- NVIDIA×Meta｜[nvidianews.nvidia.com](https://nvidianews.nvidia.com)（10-26）；AMD×Meta / AMD×Oracle｜[newsroom.amd.com](https://newsroom.amd.com)（10-27）
- [Anthropic S-1 公告](https://www.anthropic.com/news/s1-sec)；[Anthropic 红队研究](https://www.anthropic.com/research/discovering-vulnerabilities-with-claude)
- [OpenAI GPT-6.1 Terra](https://openai.com/index/introducing-gpt-6-1-terra/)（10-26）
- Oracle×Google TPU｜oracle.com（10-27）；Google Cloud TPU on OCI｜cloud.google.com/blog（10-27）
- Oracle×OpenAI 企业栈｜oracle.com（10-27）
- [Broadcom $63B](https://www.broadcom.com/company/news/financial-releases/64786)（10-26）
- [Microsoft VEO](https://blogs.microsoft.com/blog/2026/10/26/introducing-a-voluntary-exit-offer/)（10-26）；Microsoft FY27 Q1｜microsoft.com/investor（10-28）
- AWS Weekly Roundup｜aws.amazon.com/blogs（10-26）；Amazon Q3 业绩披露（10-29）
- CoreWeave｜investors.coreweave.com（10-27）；Samsung Q3｜news.samsung.com（10-29）
- GXO×Agility｜investors.gxo.com（10-26）
- Cohere Series E｜cohere.com/blog；pm.gc.ca（10-29）
- [Mistral Large 4 OSS](https://mistral.ai/news/mistral-large-4-oss/)（10-29）
- Harvey / Runway / Glean / Databricks / Scale / Cognition / Sierra PAP 等｜见母稿分片 C
- 火山方舟模型发布公告｜docs.volcengine.com（更新 10-24）；阿里云百炼｜help.aliyun.com

### 权威媒体交叉

- CNBC：Meta 融资、Microsoft/Amazon 财报、Nvidia 投 Meta
- Reuters：OpenAI-TPU 传闻、DOJ×Hugging Face、Anthropic S-1 风险因素、VEO 规模
- 科技日报 / 智东西：腾讯数字生态大会；新华网：百度 Unlimited OCR 2
- 第一财经 / 新浪科技 / IT之家：Kimi K3.1 Pro、昇腾集群
- 界面 / 每经：OpenRouter 周榜、豆包工作、IDC MaaS；华尔街见闻 / 每经：宇树三季报
- SiliconANGLE：Serval Series C；Guidewire 新闻稿：Hyperexponential 收购
