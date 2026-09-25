---
layout: single
title: "全球 AI 动态周报 · 第 18 期（2026-09-18 ~ 2026-09-24）"
date: 2026-09-25 15:00:00 +0800
categories: [AI]
tags: [周报, AI企业研究, OpenAI, Google, Anthropic, 企业Agent, AI算力, 具身智能]
header:
  overlay_image: /assets/images/posts/2026-09-25-global-ai-weekly.png
  overlay_filter: 0.45
  caption: "全球 AI 企业研究周报 · 第 18 期"
excerpt: "本期以企业动作与兑现证据为主：谁把模型能力变成可收费任务，谁在算力与资本上承压。"
toc: true
toc_sticky: true
---
2026 年 9 月 18 日至 24 日这一周，AI 行业的三条线同时发生了变化：前沿模型的计价方式、企业入口的归属，以及算力合约与现金之间的落差。

最重的一条落在基建侧。据 2026-09-24 报道，Oracle 就 Blue Owl 旗下 Stack Infrastructure 的 Project Jupiter（新墨西哥州、投资上限 1,650 亿美元）向开发商发出不可抗力（force majeure）通知，以期在项目未按 2028 年如期启用时延迟或豁免自身付款义务；触发背景是输气管道许可两度被拒、投运推迟至 2027-02-01，项目 180 亿美元建设贷款已跌破面值 90 美分，ORCL 当日盘中跌约 4%，Bloom Energy 跌近 6%。三天前的 2026-09-18，算力新供应商 Nscale 向 SEC 提交 Form S-1 拟在 NYSE 上市（代码 NSCL），披露 TCV 1,034 亿美元、RPO 564 亿美元、Anthropic 一家占 TCV 约 44%，而 2026 上半年已确认收入仅 1.406 亿美元、净亏损 10.2 亿美元。两条消息指向同一个问题：签约金额与现金流入不是一回事。

同周，三家前沿模型公司改变了价格结构。2026-09-21，SpaceXAI 上线 Grok 4.7，沿用 Grok 4.6 的 $2/$6 定价但换用更大的基座模型；09-22，Anthropic 发布 Claude Opus 5.5，输入 $4、输出 $20、缓存读 $0.20，官方称典型工作负载成本较 Opus 5 低 40%；09-23，OpenAI 把 GPT-6 Sol / Luna 相对 GPT-5.6 促销价下调 50%（Sol $2/$10、Luna $0.10/$0.50），并把缓存命中输入的折扣提到 90%。三家都在用「每任务成本」而不是「每百万 token 单价」讲故事，而各自的 benchmark 也多是厂商自评口径。渠道侧同步动作：GitHub 把 Grok 4.7 放进 Copilot 全部付费 SKU，AWS 把 GPT-6 Sol / Luna 上架 Bedrock 并沿用 AWS 的治理与审计。同一家的模型同时出现在对手的 IDE 与云里，模型供应方的议价被渠道稀释。

中国侧的主轴同样是系统与成本，而不是分数：华为在 09-19 的 AI DC 创新峰会给出昇腾 960 超节点（NPO 光互联、单节点 4096 卡、训练 MFU 为上一代 1.1 倍、推理单卡吞吐 2.5 倍）的官方口径；智谱推出 glm-5.3-flashx 提速档（最高 200 tokens/s、价格为 GLM-5.3-Flash 的 2.5 倍）；阿里在云栖把叙事抬到「模型—芯片—云—Agent 平台」，并给出 5–10 万亿参数与 20GW 数据中心的口径。应用与垂直侧则从能力竞赛转向可运维交付：Liberty Global 与 Sierra 签下三年框架协议、覆盖约 8,000 万条固定与移动连接；Harvey 的融资在第二交割中升至 6 亿美元、ARR 突破 4 亿美元；Databricks 收购云电子表格 Row Zero，把表格界面做成人与 agent 读写受治理数据的入口。具身与硬件侧则遭遇二级市场与交付现实的双重校正：宇树上市满月市值较首日盘中高点蒸发约 2,475 亿元，优必选全渠道订单 13,361 台而全年可交付预期降至 1,500–2,000 台。

本文覆盖 38 个对象（固定 37 家 + 动态新增 Nscale），全部数字与限定词按母稿来源分层标注：正式文件与官方公告按可核事实呈现，融资额、估值、经营数据按具名披露保留并标注「未独立核实」，benchmark 除注明第三方者外均为厂商自评口径。范围、来源与口径的集中说明在文末。

## 三条企业竞争主线

本周 38 个对象中，有两条以上的独立事件共同指向三条变化中的主线。以下归纳只做结构化，不新增事实。

### 主线一：竞争单位从模型能力切换为每任务成本

支撑事件集中在同一周内发生。OpenAI 把 GPT-6 Sol/Luna 相对 GPT-5.6 促销价永久下调 50%（Sol $2/$10、Luna $0.10/$0.50）；Anthropic 以 $4/$20 发布 Opus 5.5，官方称典型负载成本较 Opus 5 低 40%、缓存读 $0.20；SpaceXAI 保持 Grok 4.6 的 $2/$6 价格不变，上线基座更大的 Grok 4.7。中国侧的三条证据同向：智谱推出 glm-5.3-flashx 提速档（最高 200 tokens/s、价格为 GLM-5.3-Flash 的 2.5 倍），并在第三方 SWE-Serve 基准上以 GLM-5.2 取得 64% Pass@1、对应成本 0.95 美元，与领先者并列；DeepSeek 的旗舰 V4-Pro 自 9 月 14 日起把请求自动路由到更便宜的 Flash 档（背景口径，非本周）；华为以超节点系统工程主张 Token 效率（训练 MFU 为上一代 1.1 倍、推理单卡吞吐 2.5 倍）。

需要注意的是口径问题：双方都以「每任务成本」而非「每百万 token 单价」叙事，且 benchmark 多为厂商自评口径或第三方速览转述，横向可比性因此下降。

### 主线二：渠道与治理层成为主战场，模型被货架化

支撑事件包括：微软/GitHub 把 Grok 4.7 上架到 Copilot 全部付费 SKU；AWS 把 OpenAI GPT-6 Sol/Luna 上架 Bedrock，支持 1M 上下文并沿用 AWS 的治理与审计能力；Oracle 把 Meta Model API 与 Muse Code 接入 Oracle Marketplace；Scale AI 与 Google Cloud 发布联合参考架构，绑定 Gemini Enterprise 且部署在客户自有 VPC 与密钥中；Glean 扩展金融服务业 MCP 生态，主打上下文与权限层；Databricks 收购 Row Zero，把表格界面变成「人与 agent 读写受治理数据」的入口；阿里把主线抬到「模型—芯片—云—Agent 平台」，并宣布千问 AI 平台全面升级。

结果是：同一模型可以同时出现在对手的 IDE、云与平台里，价值捕获向治理、合规与工程服务迁移。

### 主线三：合约金额不等于现金流入

本周这一条被两个不同市场同时放大，且约束条件从芯片转向电力、许可与信用。Oracle 就 1,650 亿美元的 Project Jupiter 发出不可抗力通知（管道许可两度被拒、项目债务跌破面值 90 美分、ORCL 当日跌约 4%）；Nscale 的 S-1 显示 TCV 1,034 亿美元对应 2026 上半年仅 1.406 亿美元已确认收入，并自述后续建设融资尚未锁定；CoreWeave 以 37 亿美元可转债加最高 3,500 万股 ATM 补充资金，并被 JPMorgan 以「转向短期限合同」为由上调评级；优必选全渠道订单 13,361 台，而全年可交付预期降至 1,500–2,000 台，应收账款 22.25 亿元、坏账准备近 25%；宇树上市满月市值较首日盘中高点蒸发约 2,475 亿元。

「能下单」不等于「有真实需求」，「合约总额」不等于「现金流入」——这是本周被公开重新定价的一组关系。

另有两条方向出现了多点信号，但尚未构成主线，作为补充观察列示：安全与评估方面，Anthropic 的验证计划与反蒸馏、NVIDIA 把安全做成可采购的基础设施层、OpenAI 强化缓存与推理效率叙事；供应商自主权方面，有报道称 Cursor 面临 OpenAI 拟于 2026-11-12 切断模型访问（单一二手来源），以及 Harvey 自训开放权重模型 Tenet。

## 本周 TOP5

排序口径为「战略影响力 × 商业化信号 × 资本/组织信号 × 市场格局影响 × 新颖度」，每条附「必须保留的边界」。

### TOP1｜Oracle 就 Project Jupiter 发出不可抗力通知

2026-09-24 报道，Oracle 就 Blue Owl 旗下 Stack Infrastructure 的 Project Jupiter（新墨西哥州、投资上限 1,650 亿美元）发出 force majeure 通知，以期在项目未于 2028 年如期启用时延迟或豁免自身付款义务；触发背景是输气管道许可两度被拒、投运推迟至 2027-02-01，项目 180 亿美元建设贷款已跌破面值 90 美分，ORCL 当日盘中跌约 4%、Bloom Energy 跌近 6%。

入选理由是它同时命中五项：把 AI 基建约束从「芯片」改写为「电力/许可/信用」，且是具名合同动作而非分析判断，对 Stargate 体系、neocloud 融资成本与 OpenAI 交付节奏都有外溢。

必须保留的边界：Oracle 未提供不可抗力通知的官方书面说明，仅有对 CNBC 的口头声明转述（「remains on our planned schedule」）；Bloomberg 首报后为多家二手转述链；项目债务具体发行条款与持有人结构未知；「跌 4%」与「跌 5%」两种口径并存；Oracle 约 1,253 亿美元债务与 2,880 亿美元未起始租约为二级来源，且未取得一手确认。

### TOP2｜OpenAI 发布 GPT-6 Sol / Luna，相对 GPT-5.6 促销价 API 价格直降 50%

2026-09-23，OpenAI 把 Astra 能力沿成本—智能曲线下放（Sol $2/$10、Luna $0.10/$0.50），并强化 prompt caching（缓存命中输入折扣 90%）；同日 AWS 将两者在 Bedrock 正式可用，微软同期把 Grok 4.7 上架 Copilot。

入选理由是它是本周商业化信号最直接的一条：直接改变企业 agent 的每任务成本与选型变量，并与 Anthropic、SpaceXAI 的同周动作构成价格战事实。

必须保留的边界：benchmark（AutomationBench、Agents' Last Exam、DeepSWE v1.1、OSWorld 2.0）均为厂商自评口径，对比对象也来自竞品公开报告（OpenAI 自述 Claude Fable 5.1 低估其真实成本）；「50%」是相对 GPT-5.6 促销价的对比；本周未取得融资/估值/高管变动一手披露；服务尚未进入 Chat，当日为分批灰度。

### TOP3｜Nscale 向 SEC 提交 Form S-1，拟在 NYSE 上市（代码 NSCL）

2026-09-18 递表，披露 TCV 1,034 亿美元、RPO 564 亿美元、Anthropic 一家占 TCV 约 44%，而 2026 上半年已确认收入仅 1.406 亿美元、净亏损 10.2 亿美元。

入选理由是它是本期 AI 基建赛道最重的资本与组织信号，且首次公开 NVIDIA 以「担保 + 可转换票据」深度参与客户融资的结构（与供应链回填证据互证）。

必须保留的边界：S-1 原文为转述（SEC EDGAR 原文本轮未直接调取）；「已签约 GPU 数」存在 461,000（pulse2 转述 S-1）与约 289,000（valueaddvc）两个口径冲突，本刊采用前者并标注；IPO 目标估值近 300 亿为报道口径，发行股数与价格区间尚未确定；内控重大缺陷为公司自述。

### TOP4｜Anthropic 发布 Claude Opus 5.5，典型负载成本较 Opus 5 低 40%

2026-09-22 发布新 5.5 家族首款模型（输入 $4 / 输出 $20、缓存读 $0.20、Fast 模式 $8/$40），并把「可验证安全」（验证计划、可审计沙箱、反蒸馏）与降价捆绑。

入选理由是它把「准入流程与审计能力」从成本项变成采购标准，并开创以「每小时 agent 成本」而非单价的竞争口径，与 TOP2 共同构成同周前沿模型双层降价。

必须保留的边界：benchmark 为厂商口径，且官方自述护栏可能低估实际表现；「IPO 前」仅为 Bloomberg 媒体用语，未取得招股文件或官方时间表；「通过 Amazon Bedrock、Claude Platform 等渠道即刻可用」为第三方报道口径；Sonnet 5.5 / Haiku 5.5 为「数周内跟进」的计划表述，非已发生事实。

### TOP5｜报道称 OpenAI 拟于 2026-11-12 切断 Cursor 的模型访问

2026-09-23 行业简报 Renascence 报道，OpenAI 以「与 Musk 关联实体的合同违约模式」为由通知 SpaceX 拟终止 Cursor 的模型访问；Cursor 母公司 Anysphere 已于 2026-08 被 SpaceX 以 $60B 全股票并购（背景）。

入选理由是新颖度与格局影响最高：它把「模型访问是合同、不是资产」变成落到数十万企业客户身上的可见风险，直接改变多模型产品设计的默认假设。

必须保留的边界：单一二手来源（renascence.io），未读 OpenAI 原始公告，未见 Cursor/Anysphere 或 SpaceX 公开回应；「拟于 2026-11-12 切断」为报道口径而非已发生事实；$60B 交易完成日（2026-08-14）为多方报道口径；约 $4B ARR 为媒体激进口径、未经公司确认。

## 企业竞争雷达

按下表五个细分方向记录本周格局位移与相应边界。

| 细分方向 | 本周格局位移 | 支撑事件（公司 · 事件 ID） | 边界提示 |
|---|---|---|---|
| 算力 / 云 | 约束从「芯片供给」转向「电力、许可与信用」；neocloud 内部开始分层（能拿到长期 take-or-pay 与电力的被追捧，拿不到的债务被重新定价）；AI 加速器「第二供应商」被定价 | Oracle 不可抗力、Nscale 提交 S-1、CoreWeave 可转债+ATM 与短约高价、AMD 市值破万亿、Broadcom 被中国国资委排查 | Oracle 未给书面说明；AMD 被引用订单均为 2025-10 旧公告；Broadcom 一条为 FT 报道且 Reuters 无法独立核实；Nscale 内控缺陷为公司自述 |
| 前沿模型 | 三家（OpenAI、Anthropic、SpaceXAI）同周改定价或上新模型，竞争单位转为每任务成本与缓存经济性；Google 是唯一以「未来产品」参战的一方；模型被平台「货架化」 | OpenAI Sol/Luna 降价 50%、Anthropic Opus 5.5、SpaceXAI Grok 4.7、Gemini 4 进入早期 post-training、Copilot 上架 Grok 4.7、Bedrock 上架 Sol/Luna | 各 benchmark 多为厂商口径；Gemini 4 未披露架构/参数/定价/benchmark；Copilot 与 Bedrock 两条为官方 changelog / what's new |
| 中国模型 | 竞争主轴从「模型分数」转向「系统与成本」（超节点、参数规模、速度档、路由压价）；开源权重成为分发武器；海外第三方 Agent 产品成为新分发渠道 | 阿里云栖（Qwen4 训练中、5–10T 路线、千问 AI 平台升级）、华为昇腾 960 超节点与 AI DC 峰会、智谱 flashx 与 SWE-Serve、DeepSeek 向 Flash 收敛、Kimi K3 与 MiniMax H3 被海外产品集成 | 云栖口径多为未审计官方自评；字节/百度窗口内一手发布本次未取得；智谱/月之暗面/MiniMax 窗口内事件多为第三方速览记载；BBC 蒸馏指控为争议延续、无新增官方回应 |
| AI 应用与垂直 | 从「能力竞赛」切换到「可运维、可审计、可计价」的交付竞赛；采购主体上移到集团/机构级；下游应用开始把「模型自主权」当战略项 | Harvey 第二交割与自训 Tenet、Sierra×Liberty Global 框架协议、Databricks 收 Row Zero、Glean 金融 MCP、Scale AI×Google Cloud 参考架构、Cursor 模型访问风险、Cohere×TD、Cognition 拉美扩张 | Cursor 一条为单一二手来源；Scale AI 官方页未标注发布日；Cohere×TD 最高 $25M 为三年合计的初期投入；Perplexity 本周静默（不可核验） |
| 具身与硬件 | 中国具身遭二级市场重估与交付现实校正双击，同期美国具身订单向中国供应链迁移；技术叙事出现可对照实验高点 | 宇树上市满月市值大幅回落、优必选交付预期缩水八成与应收/坏账、Tesla Optimus 中国供应链量产审核并已下单、Figure Helix 2.5 零样本 56% vs 9%、中国国资委排查 Broadcom 交换机 | Tesla 一条的产能与订单为供应链单方口径、公司未给产量/价格/客户；Figure 为自报数据且发布日属窗口边界；宇树的监管消息未获官方确认；优必选大量数据属公司口径与中报 |

## 全球巨头与平台公司

本组八家公司的本周动作分布在定价、分发、安全与资本四个层面，其中四家直接参与了同周的价格与渠道变化。

### OpenAI

2026-09-23，OpenAI 发布 GPT-6 Sol 与 GPT-6 Luna，把本月初 GPT-6 Astra 的能力沿「成本—智能曲线」下放，并宣布相对 GPT-5.6 促销价的 API 价格直降 50%：GPT-6 Sol 由 $4/$20 降至 $2/$10（每百万 token 输入/输出），GPT-6 Luna 由 $0.20/$1.20 降至 $0.10/$0.50。官方称两款模型沿用 Astra 的训练方法，把专业工作、事实性、编码、computer use 与对齐方面的进展带到更快更便宜的档位；同时改进 GPT-6 的 prompt caching——缓存命中输入 token 折扣 90%、默认更高命中率、新增 Prompt Caching Dashboard 与 diagnostics 工具、支持显式缓存断点，并可在不破坏缓存的前提下调整推理强度与工具开关。OpenAI 引用 GitHub 数据称，过去数月这些改进使需重新处理的 prompt token 占比下降 50% 以上（涉及数十亿次请求），并让 Copilot 响应更快。

可用性上，Sol/Luna 首发进入 ChatGPT Work 与 Codex（Plus/Pro/Business/Enterprise/Edu），Free 与 Go 用户可在桌面端使用 Luna，暂不进入 Chat；API 名为 gpt-6-sol / gpt-6-luna，当日为分批灰度。

厂商自评与公开报告口径的关键数字：AutomationBench 1.0.6（47 个工具，覆盖销售、市场、运营、支持、财务、HR 的端到端工作流）上，GPT-6 Sol（xhigh）33.2%、$0.27/任务，高于 Claude Opus 5（max）26.9% 且成本约为其 1/11；Agents' Last Exam 上 GPT-6 Sol（max）56.4%，超过 Claude Opus 5 在该评测中的最高分且每任务成本低 60%；DeepSWE v1.1 上 GPT-6 Sol（max）68.8%，逼近 Claude Fable 5（xhigh）69.9%，成本低约 80%；OSWorld 2.0 offline 上 Sol（xhigh）60.5% 与 Opus 5（medium）60.3% 相当，成本低约 80%。产品侧的配套动作是 ChatGPT Work 的事件触发式自动化：Gmail 新邮件、Slack 频道消息、GitHub PR 变更均可唤醒 Work 响应，把 agent 从「被叫才动」推向「常驻监听」。

战略上，这延续了「Astra 立标杆 + Sol/Luna 铺量」的双层产品线，主线已从「谁的模型最强」转为用推理与缓存的经济性把 frontier 能力商品化，直接瞄准企业级 agent 工作负载（Codex、ChatGPT Work）；价格腰斩与缓存折扣是对 Claude Opus 5.5、Grok 4.7 同周动作的正面回击。分发入口集中在 ChatGPT Work、Codex 与 API，Free/Go 用户可触达 Luna，意味着低价档也在抢开发者心智与自建 agent 的默认底座。资本与组织侧，本次未取得本周新增融资、估值或高管变动的一手披露。

风险有三点：一是价格战压缩单位经济性，能否靠缓存与推理优化真正降本仍需观察；二是官方 benchmark 多为自评或以竞品公开报告拼口径（OpenAI 自述 Claude Fable 5.1 的数据点低估其真实成本，因其省略了约 40% 任务上的 Opus 5 回退成本），横向比较存在解释空间；三是算力资本开支与电力约束仍是规模化的硬边界。

价格、benchmark 与缓存折扣均出自 [OpenAI 官方博客 · Introducing GPT-6 Sol and Luna](https://openai.com/index/introducing-gpt-6-sol-and-luna/)（2026-09-23）；另见 [Releasebot · OpenAI updates](https://releasebot.io/updates/openai)（聚合页，2026-09-23 条目，用作交叉线索）。

影响判断：OpenAI 用「同级更便宜」而非「同级更强」打这一轮，意味着企业选型的主要变量从能力上限转向每任务成本与缓存命中率。对搭方案的人，Sol/Luna 让长上下文、多轮、常驻触发的 agent 架构第一次在成本上算得过账，但也把可移植性风险（benchmark 为厂商自评、缓存策略与厂商实现绑定）推到台前。下一步看 ChatGPT Work 触发式自动化的企业可用性与配额、99 DevDay（2026-09-29）的产品补齐，以及 Anthropic 与 Grok 后续是否继续跟价。

### Google（含 DeepMind / Gemini / Google Cloud）

本周 Google 有两个方向的动态。其一，2026-09-23 官方博客发布 Gemini 3.8 Flash TTS 与 Gemini 3.8 Flash-Lite TTS，把语音生成从固定预设变成「可导演的语音工作室」：用自然语言提示从零创建全新声音，覆盖 100 多种语言与方言（含 Mexican Spanish、Quebec French、Scots English 等区域变体），音库从 30 个原始声音扩到 2,000+ 成品音库；支持基于 30 秒样本的声音复刻，并内置同意验证（需声音所有者的口头同意录音匹配）、SynthID 水印与 C2PA 凭证；支持逐行表演控制（舞台指示、非语言发声如 <laughs>/<sigh>、应和词 |mhm|）、小时级长音频低音色漂移与原生双说话人同场对白。

性能口径方面：Gemini 3.8 Flash TTS 在 Hume AI Voice Design Benchmark 总体第一（71.4）、口音建模第一（60.8）；Flash 与 Flash-Lite 分别在 Hume AI Overall Quality Index 排第一、第二；Voice Arena 盲测在日语、巴西葡语、越南语、现代标准阿拉伯语、墨西哥西语、印地语等语种位列前列；Flash-Lite 面向高吞吐配音与语音 agent。渠道上，开发者走 Gemini API 与 Google AI Studio（含音频 playground），企业侧即将通过 API 进入 Gemini Enterprise，消费者侧进入 Gemini Notebook（Flash）与 Google Vids（Flash-Lite）；生态侧点名 Agora、LiveKit、Pipecat、Vercel 等开发平台，以及 Figma、HeyGen、Linguana、Wondercraft、99.co、Ollang 等集成方。

其二，2026-09-23/24 于 The Information AI Agenda Live Summit，2026-08-12 升任 Google DeepMind 高级副总裁的 Koray Kavukcuoglu 在其首次公开亮相中确认：Gemini 4 已进入早期 post-training 阶段，计划「尽快」推出早期 post-training 版本，目标明显早于年底；官方指向的能力重点是编码、自主 agent 与长时程 agentic 工作流，并称 Gemini 4「显著大于」此前模型，但未披露架构、参数、定价与 benchmark。

背景（非本周或第三方口径）：Gemini 4 的最大规模预训练于 2026-07-21 官方启动，约两个月即进入 post-training；在第三方 Intelligence Index v4.3.2 上，Google 当前前沿模型 Gemini 3.6 Flash 得分 34.0，落后 Anthropic Opus 5.5（57.6）、GPT-6 Astra（52.7）、GPT-6 Sol（47.5）；另有第三方报道称 Gemini-first 笔记本线 Googlebook 于 2026-09-21 在美国开启预售（OEM 含 Acer、Asus、Dell、HP、Lenovo，$999 起），本次未取得 Google 官方确认；聚合页线索显示 Gemini Enterprise Agent Platform 曾将 xAI 的 Grok 4.6 列为 GA、并推迟移除 Gemini 3.5 Flash（未读一手发布说明，仅记录线索）。

战略上，Google 双轨并行：用 TTS/音频与 Gemini Enterprise 把「多模态能力 + 企业管道」做实，同时在模型竞赛上把 Gemini 4 的节奏从「年底」提前，直接回应同周三家降价带来的份额压力；领导层交接后（Kavukcuoglu 上台）以「压缩 post-training 周期」展示执行力。产品与市场层面，语音是本周最实的可交付能力：企业可用 30 秒样本做品牌音色、用逐行控制做本地化配音与语音 agent，且同意验证、SynthID 与 C2PA 把合规做进了产品，这对受监管行业（金融、医疗、媒体）是准入门槛的正面回应；Gemini 4 目前仍是「路线图事件」而非可采购产品。资本与组织侧，本周未取得 Alphabet 或 Google Cloud 的融资、并购一手披露；组织信号是 DeepMind 领导层更替（Kavukcuoglu 于 2026-08-12 升任 SVP，属背景）后其首次公开定调与 Gemini 4 时间表加速。

风险有四条：一是 Gemini 4 未披露任何架构、定价与 benchmark，压缩 post-training 周期有「赶工」风险，若落点低于市场阈值，Google 在 agent 经济中的位置会进一步承压；二是语音复刻的滥用风险与区域监管差异（即便有水印与同意验证）；三是 Gemini 3.5 Flash 的退役安排反复（推迟移除）说明企业侧版本管理仍有摩擦；四是 Googlebook 等硬件分发的商业成效未经官方数据验证。

音库、语言、复刻与合规机制的来源为 [Google 官方博客 · Gemini 3.8 Flash TTS](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-text-to-speech/)（2026-09-23）；Gemini 4 进入早期 post-training、「显著更大」、目标早于年底等口径出自 Koray Kavukcuoglu 在 The Information AI Summit 的发言（第三方报道，2026-09-24），连同 Intelligence Index v4.3.2 的对比数字，来源为 [Forkast](https://forkast.news/googles-gemini-4-enters-post-training-and-the-three-way-frontier-race-just-compressed/)；另见 [Releasebot · Google updates](https://releasebot.io/updates/google)（聚合页，2026-09-21 条目，用于交叉线索）。

影响判断（面向搭方案与做解决方案的从业者）：本周 Google 交付的是可立即用于方案的语音能力——30 秒复刻、逐行导演、水印与凭证合规链，这对语音 agent、跨国本地化配音是最直接的可采购增量；而 Gemini 4 只是时间表信号，它决定了未来一至两个季度「用哪家前沿模型搭 agent」的选项集。下一步看 Gemini Enterprise 上 TTS 的定价与区域可用性、Gemini 4 的发布时间与是否披露定价与 benchmark，以及 Gemini 3.5 Flash 退役的最终时间表。

### Anthropic

2026-09-22（周二）Anthropic 发布 Claude Opus 5.5，为新的 Claude 5.5 家族首款模型，官方称其在多数工作上达到 Claude Fable 5.1 水平，但典型工作负载成本比 Opus 5 低 40%。定价为输入 $4、输出 $20（每百万 token，较 Opus 5 的 $5/$25 降 20%），缓存读取 $0.20（较 Opus 5 的 $0.50 降 60%，官方称缓存读取占 agentic 与编码工作成本的大头），缓存写入 $5；Claude Code 与 Claude Platform 另提供 Fast 模式（最高 2.5 倍速，$8/$40），输出速度较 Opus 5 快 30% 以上，并上调 Pro/Max/Team 及按席位计费的 Enterprise 计划五小时用量上限、提供可自行决定何时使用的额度重置。

官方 benchmark（厂商口径）：Terminal-Bench 4.0 为 66.4%（Fable 5.1 55.8%、GPT-6 Astra 57.9%）、FrontierCode v1.1 Main 为 54.4%（Fable 5.1 50.3%）、CursorBench 4.0 为 57.8%（Fable 5.1 51.8%）、AutomationBench 为 40.0%（Zapier 执行，Opus 5 26.9%、GPT-6 Astra 41.4%）、Humanity's Last Exam 带工具为 67.7%、OSWorld 2.0 为 81.8%（partial）、Terminal-Bench-Science 0.1 为 58.7%。

安全与合规侧：这是 Anthropic 提出「pacing the frontier」主张后的首个发布，发布前经 Frontier Design、METR 等外部评估；在自家 automated behavioral audit 上为迄今最强，对 prompt injection 的抵抗力不低于 Opus 5，并沿用 Fable 5.1 起的反蒸馏保护（preserved thinking）；因生物与网络安全能力接近 Claude Mythos 5.1，采用与 Fable 5.1 类似的部署护栏（生命科学验证计划当日开放申请，网络验证计划数周内扩容）。同期 Anthropic 发布 2026 年 9 月威胁情报报告，详述已发现并处置的非法蒸馏活动。产品定位上，官方强调「企业内自主运行数小时的编码 agent」需要可审计性：Opus 5.5 带逐动作分类器、开源沙箱（安全团队可审计）与合并前漏洞代码审查；Gray Swan 的 prompt injection 基准中与 Fable 5.1 并列最低成功率；GitHub 首席产品官 Mario Rodriguez 具名评价其 token 与步数效率。资本侧，Bloomberg 报道将此次发布放在 IPO 前的语境中；NYT 强调这是其 CEO 呼吁行业「放慢」后的首个模型发布。Claude Sonnet 5.5 与 Haiku 5.5 官方称将在数周内跟进。

官方另给出两个效率样本：早期测试者口径的 680,000 行代码迁移与 20 万行代码审计 3 小时；HAProxy C→Rust 迁移 9.5 小时（Fable 5.1 为 12 小时）、成本低 51%（官方内部测试口径）。

战略上，Anthropic 以「同价位更强 / 同能力更便宜」配合安全与合规叙事打企业市场：把 frontier 能力下压到 Opus 价位，同时用验证计划、可审计沙箱、反蒸馏把「可信部署」做成差异化护城河；在对手集体降价的同一周抢先定价，抢的是企业续约与 agent 平台的默认模型位。产品与市场层面，Opus 5.5 覆盖 API、Claude Code、Claude Platform，并通过 Amazon Bedrock、Claude Platform 等渠道即刻可用（第三方报道口径）；Fast 模式与更高用量上限直指编码 agent 的持续运行成本，这是把「每小时 agent 成本」而非「每百万 token 单价」当作竞争单位的做法。资本与组织侧，本周未取得资本结构变动的一手文件；Bloomberg 以「IPO 前」框定本次发布（媒体口径，未取得招股文件或官方时间表），属分析性背景而非已披露事实。

风险有四条：一是同周 OpenAI、SpaceXAI 同步降价，40% 成本优势的窗口期可能很短；二是生物与网络安全护栏（验证计划、降级回退到 Opus 4.8/Opus 5）会拉低部分基准成绩，官方自述「可能低估实际表现」，同时也意味着企业客户在敏感场景会遇到能力降级与准入流程摩擦；三是蒸馏与模型窃取风险，威胁情报报告本身即是这一风险仍在升级的证据；四是 IPO 语境下，商业化速度与「放慢前沿」主张之间存在叙事冲突。

价格、benchmark、Fast 模式与迁移样本的来源为 [Anthropic 官方 · Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)（2026-09-22）；发布日期与存在性另经 [TechCrunch](https://techcrunch.com/2026/09/22/anthropic-releases-opus-5-5-with-lower-prices-and-fable-level-performance/)（2026-09-22）交叉核对；「IPO 前」语境出自 [Bloomberg](https://www.bloomberg.com/news/articles/2026-09-22/anthropic-unveils-more-cost-efficient-opus-5-5-model-before-ipo)（2026-09-22，标题与摘要级，付费墙未读全文）。

影响判断：Anthropic 把降价与「可验证安全」绑在一起卖，等于提出一个新的企业采购标准：不只看 benchmark 分数和单价，而看敏感场景下的准入流程、审计能力与回退行为。对搭方案的人，这意味着选型清单里要多三项：验证计划准入、护栏触发时的能力降级路径，以及长时自主运行的审计留痕——这些恰是 demo 阶段看不出来、上线后才爆的坑。

### Meta AI

Meta Connect 2026 主题演讲（媒体在 2026-09-23 报道；Meta 官方汇总页抓取于 2026-09-24）把全部重心压在 **Muse**（Meta 的「personal superintelligence」个人 agent）上，CEO Mark Zuckerberg 开场即以「the future is for everyone」定调，并称 Muse 有朝一日会成为被数十亿人使用的超级智能；官方称今年主题演讲几乎未提元宇宙（对比 2021 年更名时的赌注，媒体估算 Reality Labs 累计亏损约 800 亿美元，属背景非本周）。

功能与生态方面的关键披露：Muse 即日起可操作用户的 Mac（授权后可在用户不在电脑前时于后台运行任意程序），并将逐步支持邮件；推出 connectors 与 Connector Platform，让第三方应用接入并允许开发者自建集成，零售侧已列 Walmart、Best Buy、Gap、Sephora，支付与电商与 Stripe、Shopify 合作，旅行侧 Expedia、Instacart 即将加入，Box、GitHub、Granola 也在名单内；硬件侧发布第三代 Meta Ray-Ban（超过 51 种款式，标准款 $449 起，Lisa from Blackpink 版 $399，未来 Adventurer 款 $249 起）、首款无摄像头音频眼镜（续航最长、最薄的 Ray-Ban），以及 Meta Superintelligence Labs 的 Muse Realtime Avatar（把 Muse Realtime Voice 变成可交互形象）；Muse Voice 支持自定义助手声音。商业模式上，Zuckerberg 明确表示 Muse 当前免费，「长期会通过交易抽成赚一点」（媒体转述口径）。组织侧，首席 AI 官 Alexandr Wang 上台演示用例（找花瓶替代品、规划并改期旅行、压低保险账单），是 Meta Superintelligence Labs 人事重组后对外展示产品化能力的关键场合。

战略上，Meta 把「个人 superintelligence」从模型叙事落成分发加交易闭环：眼镜与设备是入口，Muse 是常驻 agent，connector 与抽成是把流量变成收入的结构；Metaverse 叙事实质性退场，资源向可穿戴 AI 与个人 agent 集中。产品与市场层，Muse 的 computer use（Mac 后台操作）与第三方连接器让 Meta 直接进入「个人级 agent 平台」竞争，与 OpenAI 的 ChatGPT Work 触发式自动化、Anthropic 的编码/agent 栈在同一周正面相遇；零售与旅行连接器是其独有的「交易型」落点，但抽成模式尚未有价格细节。资本与组织侧，本周未取得 Meta 新的融资或并购披露；关键人事信号是首席 AI 官 Alexandr Wang 的公开发布角色（背景，非本周：Meta 对 Scale AI 的约 143 亿美元投资与其团队重组发生于更早）。

风险有四条：一是隐私与安全——允许 agent 在后台操作个人电脑并接入邮箱与支付，权限模型与「越权代买」的责任边界尚未公开；二是抽成商业模式与零售商、支付伙伴的利益分配未披露，存在执行风险；三是无摄像头音频眼镜看似缓解早期隐私批评，但设备侧 agent 的持续监听感知能力仍会引发监管与舆论审查；四是与 Apple（Siri/可穿戴）和 Amazon（Echo Frames）在音频眼镜与可穿戴入口上的正面竞争加剧。

款式与价格、连接器伙伴名单、Muse 免费与抽成口径均出自 [Mashable 现场报道](https://mashable.com/tech/everything-announced-meta-connect-2026)（2026-09-23）；Meta 官方汇总页见 [Meta 官方博客 · Meta Connect 2026 everything we announced](https://www.meta.com/blog/meta-connect-2026-everything-we-announced/)（直接抓取返回 400，仅由搜索摘要取得 Realtime Avatar 一条）。

影响判断：Meta 选择用「个人设备 + 常驻个人 agent + 交易抽成」这条与 OpenAI、Anthropic 不同的路径进入 agent 商业入口之争，短期看更像分发战而非能力战。对搭方案的人，Connector Platform 是本周最值得盯的一环：若它真开放可用，Meta 会把「接第三方系统」的门槛从企业项目变成消费级授权，企业方案的边界（谁拥有用户上下文）将被重新划线。下一步看 Connector Platform 的审核与权限细则、Muse 的计费与区域可用性，以及无摄像头眼镜对音频入口竞争的冲击。

### Microsoft（含 Azure / Copilot / GitHub）

2026-09-21，GitHub 官方 Changelog 宣布 Grok 4.7 在 GitHub Copilot 中陆续上线。要点：该模型按供应商目录价走用量计费（usage-based billing），面向 Copilot Pro、Pro+、Max、Business、Enterprise 各 SKU；可在 VS Code、Visual Studio、Copilot CLI、GitHub Copilot cloud agent、Copilot app、JetBrains、Xcode、Eclipse 的模型选择器中选用；上线为渐进式；Copilot Enterprise/Business 管理员可通过 Copilot 设置中的 model policy 管控该模型访问权，而在「默认模型启用」策略下新模型会自动启用，除非管理员关掉全局默认或显式禁用该模型。

这条动作本身不大，但方向清楚：微软把第三方前沿模型（此处为 SpaceXAI 的 Grok 4.7）当作 Copilot 货架上的常规 SKU 分发，与自家 MAI 系列、OpenAI 模型并列（7 月已以同样方式上线 Grok 4.5，属背景，非本周）。同期微软侧的 agent 化进展——Copilot Cowork（多模型 agentic harness，官方称较单模型方案便宜 30%–40%）、autopilot agent Microsoft Scout、Work IQ 上下文层、Agent 365，以及「Microsoft 365 Copilot 超过 3,000 万付费席位、5 万席以上客户同比增 7 倍以上、Azure 年收入首破 1,000 亿美元」等经营数据——均出自 FY26 Q4 财报与 2026-07-30 官方博客，属背景，非本周，此处仅作为微软 agent 战略的既有基座；本周未取得微软关于 Azure 或 Copilot 新功能的一手发布。

战略上，微软继续走「不押单一模型、做多模型分发 + 治理层」的路线：模型是货架商品，价值捕获在 Copilot、Agent 365、Work IQ 与企业的身份、权限、审计体系，这与 OpenAI 靠模型本身定价、Anthropic 靠可验证安全差异化形成对照。产品与市场层面，模型选择器覆盖 IDE、CLI、云端 agent 与移动端，意味着企业开发者不必自建路由层就能切换前沿模型；用量计费把「选哪个模型」直接变成客户账单变量，也把模型成本波动传导给客户。资本与组织侧，本周未取得微软新的人力或资本动作；背景数据见上（FY26 Q4：Copilot 3,000 万付费席位、Azure 年收入破 $100B）。

风险有四条：一是治理默认值风险——「新模型默认自动启用」在企业合规敏感场景可能带来影子模型使用，需要管理员主动收紧；二是成本可预测性——用量计费加多模型选择把成本控制责任推给客户；三是伙伴即对手的结构性张力（SpaceXAI 与 OpenAI 既是模型供应方，也在终端与 coding agent 市场与微软竞争）；四是 Grok 系列此前的安全与内容争议可能进入企业采购审查流程。

Grok 4.7 覆盖的 SKU 与 IDE/CLI 清单、用量计费、model policy 与默认启用规则出自 [GitHub Changelog](https://github.blog/changelog/2026-09-21-grok-4-7-is-now-available-in-github-copilot/)（2026-09-21）；背景数据来源为 [微软 FY26 Q4 投资者关系页面](https://www.microsoft.com/en-us/investor/earnings/fy-2026-q4/press-release-webcast)（属背景非本周），另见 [GitHub Changelog · Grok 4.5 is now available in GitHub Copilot](https://github.blog/changelog/2026-07-28-grok-4-5-is-now-available-in-github-copilot/)（2026-07-28，用于确认多模型上架为既有做法）。

影响判断（面向搭方案与做解决方案的从业者）：对方案方而言，「多模型路由」正从自建能力变成平台内置服务——Copilot 已把模型切换、用量计费与管理员策略打包，自建路由器只有在需要跨厂商私有化、成本优化或合规隔离时才有独立价值；同时方案必须回应两个新问题：管理员策略如何与客户合规基线对齐，以及按用量计费下如何给客户做成本护栏。

### Amazon / AWS AI

2026-09-22（AWS What's New 页面时间戳 2026-09-22T16:24Z，折合上海时间 2026-09-23 00:24，落于本期窗口内），AWS 宣布 OpenAI GPT-6 Sol 与 GPT-6 Luna 在 Amazon Bedrock 正式可用（GA），与已在 Bedrock 的 GPT-6 Astra 共同构成 GPT-6 家族梯队。原文要点：Sol 定位为「重复性复杂任务与软件开发」的日常模型，可在 Bedrock 上实现功能开发、缺陷调试、代码评审与重构、数据分析以及跨工具多步工作流，官方引 OpenAI 内部事实性评测称其错误量约为 GPT-5.6 Sol 的一半；Luna 定位为聚焦型高吞吐任务的最高效模型（摘要、抽取、分类、路由），支持可调推理强度以平衡质量、速度与单次请求成本；两者均支持最高 1M token 上下文；通过 Bedrock 控制台或受支持的 Bedrock API 调用，并沿用既有 AWS 安全控制、访问治理与模型调用审计能力。此举把 OpenAI 最新一代模型的「更便宜档位」直接放进 AWS 的企业采购与治理通道，与 OpenAI 自家 API 的同周降价形成叠加效应。

背景（非本周）：AWS 与 OpenAI 的战略合作（含在 Bedrock 上提供 Stateful Runtime Environment）为 2026-02-27 官方公告；第三方报道曾以约 500 亿美元规模描述该合作，本次未取得一手金额条款，仅作观察不作事实引用。

战略上，AWS 继续做「模型中立货架 + 治理通道」，用最快速度把各前沿实验室的新档位模型搬进 Bedrock，让客户在 AWS 的合规、计费与审计体系内选模型；它的议价来自分发与治理，而非模型本身。产品与市场层面，GPT-6 Sol/Luna 的 1M 上下文与「编码 + 高频抽取/分类/路由」双定位，正好覆盖 Bedrock 客户最高频的两类负载；OpenAI 同日官宣降价 50%，等于 AWS 渠道价与企业自建 API 价同时下探。资本与组织侧，本周未取得 Amazon/AWS 新增资本或组织动作的一手披露。

风险有三条：一是「上架即同质化」——当 OpenAI 模型同时出现在 OpenAI API、Azure、Bedrock、Copilot 等通道，云厂商难以靠模型差异化，竞争回到价格、区域合规与工程服务；二是算力与电力约束（Bedrock 新增模型会进一步吃紧推理产能）；三是模型治理链条变长（模型方安全策略、云方策略、企业策略三层叠加），审计口径与责任边界需要客户自行厘清。

关键数据与梯队信息出自 [AWS 官方 · OpenAI GPT-6 Sol / Luna on Amazon Bedrock](https://aws.amazon.com/about-aws/whats-new/2026/09/openai-gpt-6-sol-luna-on-amazon-bedrock/)（2026-09-22）；产品页见 [AWS · OpenAI models on Bedrock](https://aws.amazon.com/bedrock/openai/)（2026-09-22 更新，用于交叉确认梯队）；战略合作背景为 [OpenAI 官方](https://openai.com/index/amazon-partnership/)（2026-02-27）。

影响判断：Bedrock 上同时出现 Astra、Sol、Luna 三档，意味着企业可以在同一云内按「任务难度→档位」做路由与成本分层，不必跨云拼栈；但模型中立也意味着方案方的差异化被挤到上层——工作流编排、数据治理与行业知识，而非「接哪家模型」。下一步看 Bedrock 上 Sol/Luna 的区域可用性与定价梯度，以及 OpenAI 与 AWS 的 Stateful Runtime 是否进入 GA。

### xAI（现名 SpaceXAI）

2026-09-21，Grok 4.7 发布（官方公告页已读）。官方要点：这是其「面向编码与知识工作最强」的模型，沿用 Grok 4.6 的价格与速度不变（起步 $2/百万输入 token、$6/百万输出 token），并使用全新更大的基座模型（非复用 Grok 4.6 基座）、更长的强化学习训练（任务组合偏向「需要数小时完成」的难题）、更强的自校验与长上下文管理能力，且原生理解 Grok Bot harness（面向对话与通用知识工作）。

API 规格（第三方整理的开发者文档口径）：模型名 grok-4.7，50 万 token 上下文，知识截止 2026 年 5 月，文本加图像输入与文本输出，推理强度 low/medium/high（默认）/xhigh，支持 Responses API 与 Chat Completions，工具含 function calling、web search、X search、code execution；定价分档为 20 万 prompt token 以内 $2/$0.50（缓存输入）/$6，超出后 $4/$1/$12；另有 Grok 4.7 Fast（输出速度翻倍、价格翻倍，仅限 Cursor 与 Grok Build，不含公开 API，也不在 Grok Build 免费档）；美国区域端点 us.api.x.ai 溢价 10%。可用渠道：xAI API、Cursor（所有计划）、Grok Build（默认模型）、OpenRouter、Vercel、Cloudflare，以及同日上线的 GitHub Copilot。

公司层面（背景，非本周）：xAI 已是 SpaceX 的全资子公司（2026 年 2 月），并于 2026-07-06 完成向 SpaceXAI 的品牌更名，产品名 Grok 与 API 不变；本次检索中多数来源（含 MarkTechPost、Releasebot）已统一使用 SpaceXAI 名称，一手公告页仍位于 x.ai 域名。

官方 benchmark（厂商口径）：CursorBench 4.0 为 46.3%（Grok 4.6 40.4%、GPT-5.6 Sol Max 41.7%、Fable 5.1 Max 51.8%）、DeepSWE v1.1 为 71.0%（high effort；GPT-5.6 Sol Max 72.7%）、EEBench 64.0%（表内最高）、AA Briefcase v1.1 1,657、Terminal-Bench 4.0 为 37.6%（Fable 5.1 Max 57.9%）、Harvey Legal Agent Benchmark 19.6%（Fable 5.1 Max 6.7%）、HealthBench Professional 56.7%。安全侧：采用全新 safeguard stack，官方称是其在拒答与越狱抵抗上测过最强的模型，双用途领域「既有用又懂拒绝」，在 LatchBio 生物安全基准以 62.4% 居首；在其自建 HackerBench v0.3 上仅 3.3% 高风险双用途提示被放行，并开始向选定网络安全伙伴发放红队能力的邀请制访问。

战略上，SpaceXAI 不跟降价、跟「性能/价格比」：在 OpenAI 与 Anthropic 同周降价的背景下，Grok 4.7 选择维持 $2/$6 并用更大基座加更长 RL 提升能力，把竞争点放在同等价格下的能力与特定场景（法律、电气工程）领先；同时把「免费档 + 自家 harness（Grok Build）」作为获客漏斗。产品与市场层，分发面铺得极宽（API、第三方路由 OpenRouter/Vercel/Cloudflare、Cursor、GitHub Copilot），意味着它把自己定位成可被任意渠道嵌入的模型供应商，而不是靠自有终端收口；Harvey 法律 agent 基准与 HealthBench 分数显示其在垂直专业场景寻找差异化。资本与组织侧，本周未取得融资、估值或高管变动的一手披露；可确认的组织事实是 SpaceXAI 作为 SpaceX 子公司的结构（背景，非本周），合并入 SpaceX 后的资本路径（含 IPO 相关传闻）本次未取得一手文件，不作表述。

风险有四条：一是「价格不变 + 能力提升」靠的是训练与推理效率，若对手持续降价，其价格位置会被压缩（Fable 5.1 Max 虽贵 5–8 倍但在其主打的 Terminal-Bench 上仍大幅领先）；二是安全叙事主要建立在自建基准（HackerBench、拒答测试）之上，缺少独立第三方复核；三是 Fast 档与区域端点溢价增加了方案侧的计费复杂度；四是与 X 平台数据、Musk 个人言论绑定的品牌风险仍会进入企业采购评估。

定价、基座、RL、benchmark 与安全数据均出自 [xAI 官方公告 · Grok 4.7](https://x.ai/news/grok-4-7)（2026-09-21）；API 规格（上下文、知识截止、四档推理强度、超 20 万 token 后 $4/$1/$12、Fast 档、区域溢价）出自开发者文档的第三方整理 [MarkTechPost](https://www.marktechpost.com/2026/09/21/spacexai-releases-grok-4-7/)（2026-09-21）；分发渠道另经 [GitHub Changelog](https://github.blog/changelog/2026-09-21-grok-4-7-is-now-available-in-github-copilot/)（2026-09-21）交叉核对。更名为 SpaceXAI 与子公司结构为背景（[Wikipedia · SpaceXAI](https://en.wikipedia.org/wiki/SpaceXAI)，2026-07-06）。

影响判断（面向搭方案与做解决方案的从业者）：Grok 4.7 的价值不在「最强」，而在同价位的能力密度加极易嵌入：50 万上下文、四档推理强度、可路由到 Cursor/Copilot/OpenRouter，使它在「成本敏感的多步 agent」里成为可替换的一档。对资本观察者，真正的变量是 SpaceXAI 作为 SpaceX 子公司的资本路径（本次未取得一手披露），这会决定它是长期独立供给方，还是被并入更大实体的算力与模型部门。

### NVIDIA

2026-09-21，NVIDIA 官方博客发布《Why Deploying Physical AI at Scale Demands Safety at Every Layer》（全文主体已读）。核心主张是：物理 AI 正从研究走向大规模部署，安全必须覆盖硬件、软件、AI 行为、运行环境与部署全生命周期，而非部署前的一次性检查；文中引用第三方预测——ABI Research 预计 2035 年 L3–L5 自动驾驶车保有量约 4,900 万辆，Omdia 估算 2026–2035 年间约 6,000 万台工业机器人将部署（均为第三方研究口径）。

它提出四项范式变化：动态环境需要上下文感知安全（静态围栏不足）；AI 行为需要独立的 assurance（设计时、运行时、验证时护栏，提及 ISO/IEC TS 22440 等新兴标准）；部署是持续过程（模型与软件更新可能触发追加安全测试）；规模化验证必须结合仿真与合成数据。同时系统展示其安全栈：NVIDIA Halos（自称首个也是唯一面向物理 AI 的全栈安全系统）、DRIVE AGX Thor（安全工程化算力）、Hyperion（L4 全栈整车平台与参考架构）、Halos OS（构建于 ASIL-D 认证 DriveOS 之上）、Halos Core/Middleware（系统隔离、监控、确定性通信）、Alpamayo（面向长尾场景可解释性的开源推理 VLA 模型）、Halos Safety Evaluation Framework（安全证据生成工具与指南）。同日另发《5 Companies Using NVIDIA AI for Clean Energy》（纽约气候周相关，企业级 AI 用于清洁能源的场景叙事）。

本周未发现 NVIDIA 新闻稿级重大事件：官方 Newsroom 的 09-22 至 09-24 条目为博客、科研与生活类内容；与澳大利亚 NCP / DSX AI 工厂扩容（目标 2027 年 2GW）相关的新闻稿发布于 2026-09-09/10，属窗口外背景。

战略上，NVIDIA 把「卖算力」升级为「卖可认证的安全基础设施」：在机器人/自动驾驶进入受监管与诉讼敏感阶段时，Halos 加标准话语权（ISO/IEC TS 22440 等）是把开发者锁进其全栈的关键抓手；开源 VLA 模型（Alpamayo）用于扩大生态采用面。产品与市场层，Halos 覆盖 AV 与机器人两条线（原则共享、平台与证据按域独立），叠加「物理 AI 规模化」的客户教育内容，指向机器人与 robotaxi 客户的部署前合规需求；本周无新产品 GA 或订单披露。资本与组织侧，本周未取得资本或组织一手披露；背景方面，DGX 十周年（GTC 2016 首发 DGX-1）为其官方主页当期主打内容，属品牌叙事。

风险有三条：一是安全主张的自证性——全栈安全系统由芯片/平台提供方自己定义与评测，独立验证与责任划分仍待行业标准落地；二是机器人/AV 客户部署节奏若慢于预期，安全栈的溢价变现会滞后；三是算力与电力供给约束，以及客户自研芯片与开放互联（如第三方推理芯片采用其 NVLink Fusion）带来的长期议价变化。

第三方数据与安全栈构成出自 [NVIDIA 官方博客 · Physical AI Halos safety](https://blogs.nvidia.com/blog/physical-ai-halos-safety/)（2026-09-21）；窗口内条目类型的核对见 [NVIDIA Newsroom · Latest](https://nvidianews.nvidia.com/news/latest)（2026-09-25 抓取）；澳大利亚 AI 工厂 2GW 目标为背景，见 [NVIDIA Newsroom](https://nvidianews.nvidia.com/news/nvidia-expands-ai-infrastructure-capacity-in-partnership-with-australias-data-center-ecosystem)（2026-09-09/10）。

影响判断（面向机器人/自主系统方案与价值链判断）：本周信号是合规成为交付物的一部分——安全栈与评估框架（含仿真、合成数据、证据生成）会像云的安全控制一样进入采购清单，方案方需要提前规划「安全证据如何生成与归档」；对价值链，NVIDIA 正用标准与认证把自身从部件供应商推向物理 AI 的治理层，这会抬高其溢价能力，也让下游客户的切换成本继续上升。下一步看 Halos 在具体机器人/AV 客户上的公开采用案例、ISO/IEC TS 22440 的落地节奏，以及下述供应链与订单证据的后续。

#### 供应链与订单证据

下列证据由算力组的公司研究中顺带取得，不构成完整公司条目；无证据的也已逐项明示，可核验度标注原样保留。

| 证据 | 事实 | 来源 / 日期 | 备注 |
|---|---|---|---|
| 中国国资数据中心 | NVIDIA 产品已被禁止进入中国国家控股数据中心，而 Broadcom 交换机仍在大量使用（部分设施占比高达 90%）；中国国资委（SASAC）正在排查并要求国资数据中心减少使用 Broadcom 交换机 | [FT via Reuters / 《经济时报》](https://m.economictimes.com/tech/technology/china-surveys-broadcom-switch-use-in-state-data-centers-ft-reports/articleshow/134426619.cms)，2026-09-23 | 窗口内。可核验度：中（FT 原报，Reuters 未能独立核实；可作为「NVIDIA 在中国国资体系已被清晰隔离」的佐证，但不宜写成本周新增政策） |
| NVIDIA 对客户融资的介入 | Nscale 于 2026-09-15 签署最低 31 亿美元认购协议，其中含 21 亿美元无担保可转换贷款票据，及最多 10 亿美元可转换票据/无投票权股份拟发行予 NVIDIA；Nscale 另披露 NVIDIA 为其一份德州数据中心租约提供最高 8.6 亿美元履约担保 | Nscale S-1 转述：[Dealroom](https://app.dealroom.co/news/note/nscale-files-for-nyse-ipo-as-net-loss-widens-to-1-02b)、[TechTimes](https://www.techtimes.com/articles/327754/20260920/nscale-files-30b-nyse-ipo-1b-nvidia-note-45b-anthropic-deal.htm)，2026-09-19 / 09-20 | 窗口内（S-1 于 2026-09-18 提交）。强证据：NVIDIA 以「可转换票据 + 租约担保」形式深度参与客户资产负债表，是 GPU 需求侧金融化的新样本 |
| NVIDIA GPU 订单与部署规模（经 Nscale 客户侧披露） | Anthropic 在 Nscale Monarch Compute Campus 采用 NVIDIA Vera Rubin NVL72，合同总额最高约 446 亿美元（460MW）；Microsoft 在葡萄牙 SINES 园区 200MW 场地计划部署 66,000+ 块 Vera Rubin NVL72，自 2027 年末开始；Figure AI 与 Nscale 的多年期合作涉及最高 100,000 块 Vera Rubin GPU 选择权，初始部署目标 2027 下半年 | [Pulse2（全文已读）](https://pulse2.com/nscale-ipo-filing-reveals-103-4-billion-in-active-and-contracted-ai-infrastructure-agreements)；[Nscale 官方新闻稿](https://www.nscale.com/press-releases/nscale-files-initial-public-offering)，2026-09-18 | 窗口内。可用于说明 Vera Rubin 世代在 2027 年的在手需求 |
| 竞争格局参照（背景，非本周） | Broadcom 在 FY26 Q3 电话会（2026-09-02）称 Anthropic 将于 2027 年成为其最大 XPU 客户，Anthropic 今年部署 1GW “Ironwood” TPU7、2027 年 5GW TPU 8i、2028 年 10GW TPU 9 | [The Next Platform](https://www.nextplatform.com/connect/2026/09/10/broadcom-rides-rocketing-trend-for-custom-ai-accelerators/5295681)，2026-09-10 | 窗口外（背景），但对「NVIDIA 面临自研 ASIC 竞争」的论述直接有用 |
| 未能核实的线索（不建议采用） | 二手来源出现「CoreWeave becomes first to deploy Vera Rubin」标题 | Investing.com CRWV 新闻页转述 Benzinga，日期与正文本轮未取得 | 本次未取得可读原文，仅作线索，不作为证据 |

上述证据还给出三条跨议题的联动线索：一是 NVIDIA 金融化——Nscale S-1 中 NVIDIA 的 31 亿美元认购协议（含最多 10 亿美元票据/股份）与 8.6 亿美元租约担保，是本轮「芯片厂商为算力客户提供信用支持」最清晰的一手披露；二是中国国资体系对 NVIDIA 的隔离已成既定事实（FT，2026-09-23），但不建议写成 9 月新政；三是 Oracle 的不可抗力通知对 NVIDIA 有间接含义——Project Jupiter 是 Stargate 体系站点之一，其建设延期会影响 NVIDIA 在该站点的 GPU 交付节奏，**该推断属分析判断，未有来源直接证实**。

#### 云计算三家的窗口内硬件与合同证据

- **Google Cloud：本次未取得窗口内（2026-09-18~09-24）硬件、订单或企业合同级证据。** 已扫描但落在窗口外、仅供背景参考：Broadcom 与 Google 的 TPU 定制与 AI 机架长期协议（2026-04-06，覆盖至 2031 年）；Anthropic 部署 Google TPU 的规模表述来自 Broadcom FY26 Q3（2026-09-02）。检索采用一般搜索与多提供商组合检索（含 NVIDIA、AWS、Azure、Google Cloud 的 GPU 容量与交易类关键词，以及 Oracle OCI AI 基建类关键词），未命中窗口内 Google Cloud 硬件或合同事件。
- **AWS：本次未取得窗口内硬件、订单或企业合同级证据。** 已扫描但窗口外的背景：Qualcomm 与 AWS 的 AI 芯片协议（最高 600 亿美元上限、约 40 亿美元认股权证，2026-09-08）；Marvell 与 AWS 的 Trainium 设计合作（2024-12 扩展）。检索动作同上；本周主责对象（CoreWeave、Oracle、AMD、Broadcom）的公开事件中未出现 AWS 相关的硬件或采购合同。
- **Azure / Microsoft：本次未取得窗口内硬件、订单或企业合同级证据。** 有一条无法确认日期归属的线索，暂不作为本周证据：一篇 2026-09-22 的 Yahoo Finance 文章称「AMD 表示 Microsoft 将在 2026 年下半年起在 Azure AI 服务部署 Helios」，但该表述与 AMD 于 2025 年 Advancing AI 时发布的 Helios 客户口径高度重合，本轮未取得可确认的窗口内公告来源，故不采用为本周事实。已扫描但窗口外的背景：Microsoft 与 Nscale 在葡萄牙 SINES 的 200MW 部署（Nscale 于 2026-04 收购场地，66,000+ Vera Rubin NVL72 自 2027 年末开始；该合作关系本身早于本期）。
- 上述回填的检索与取证细节已记录在审计材料中，不进入正文。

#### 本组格局变化

1. **竞争单位从「模型能力」切换到「每任务成本」，且发生在同一周内。** 2026-09-21 SpaceXAI 保持 $2/$6 上线 Grok 4.7；09-22 Anthropic 以 $4/$20 发布 Opus 5.5（典型负载较 Opus 5 便宜 40%、缓存读 $0.20）；09-23 OpenAI 把 GPT-6 Sol/Luna 相对 GPT-5.6 促销价永久下调 50%（Sol $2/$10、Luna $0.10/$0.50）并强化缓存。三方口径都在比「每任务成本」而非「每百万 token 单价」，且都以自家或指定 harness 上的 cost-per-task 作图，这意味着选型的主要变量已从能力上限转为工作负载经济性，同时各家 benchmark 均为厂商口径，横向可比性下降。
2. **前沿阵营分层，Google 的位置是本周最大变量。** OpenAI 形成 Astra（天花板）、Sol（主力）、Luna（高频）三层；Anthropic 以 Opus 5.5 开启 5.5 家族并预告 Sonnet/Haiku；SpaceXAI 用「同价更强」维持单点。Google 在第三方 Intelligence Index 上（Gemini 3.6 Flash 34.0）落后 Opus 5.5（57.6）约 24 分，本周以「Gemini 4 已进入早期 post-training、目标早于年底」回应，但未披露架构、定价与 benchmark——它是本轮唯一以「未来产品」而非「当下价格」参战的一方，风险与弹性都最高。
3. **渠道成了主战场：模型正在被货架化。** 微软/GitHub 把 Grok 4.7 上架到 Copilot 全部付费 SKU（含 VS Code、CLI、云 agent、JetBrains、Xcode、Eclipse）；AWS 把 OpenAI GPT-6 Sol/Luna 上架 Bedrock（1M 上下文、沿用 AWS 治理与审计）；Google Cloud 侧亦出现把 xAI 模型纳入 Gemini Enterprise Agent Platform 的线索。当同一模型同时出现在对手的 IDE、云与平台里，模型厂商的议价被渠道稀释，云与平台的价值回到治理、合规与工程服务，这与「谁掌握分发谁定义默认模型」的旧格局相反。
4. **Agent 入口之争出现三种商业模式。** OpenAI 走「常驻触发式 agent + 订阅/席位」（ChatGPT Work 可被 Gmail、Slack、GitHub 事件唤醒）；Meta 走「设备 + 个人 agent + 交易抽成」（Muse 免费，长期向交易抽成，Connector Platform 开放第三方接入）；Anthropic 走「企业内可审计长时编码 agent + 验证计划准入」。三者分别押注时间、交易与信任，而三者的落地成本结构完全不同，这决定了企业采购谈判的杠杆点也不同。
5. **安全与评估从「成本项」变成「准入与定价工具」。** Anthropic 用验证计划、可审计沙箱、反蒸馏与威胁情报报告做差异化；OpenAI 强化对齐评估与缓存/推理效率叙事；SpaceXAI 以自建 HackerBench、LatchBio 分数主张安全性；NVIDIA 以 Halos 与 ISO/IEC TS 22440 把安全做成可采购的基础设施层。「能否通过评估」正在成为比「跑分多高」更硬的商业门槛，同时也因多为厂商自评而带来新的可比性缺口。

本组遗留的取证缺口一并列明：Meta 官方 Connect 2026 汇总页返回 HTTP 400，官方一手细节缺失，改用 Mashable 现场报道（已标注）；Dynamics 365 agentic ERP 发布日期无法确认，未写入本周动态（仅背景）；Googlebook 预售与 OEM 清单、Gemini Enterprise 收录 Grok 4.6 GA 均为第三方与聚合页口径，未取得一手确认；SpaceXAI 与 Anthropic 的资本及 IPO 相关表述仅限媒体口径，未取得一手文件。此外，本次检索中并行搜索曾触发限流（两个查询未返回，已由替代查询覆盖）。

## 中国头部企业

本部分九家公司的主轴同为「系统与成本」，但落地方式各不相同：从参数规模与数据中心口径，到超节点光互联、速度档与路由压价。

### 阿里巴巴 / Qwen / 夸克

2026 云栖大会 9 月 22—24 日在杭州举行，阿里在开幕日集中释放「AI 模型、AI 芯片、AI 云」三大方向进展。据新浪财经与新浪香港（TechWeb）9 月 22 日报道，阿里 ATH 事业群 Token Foundry、Qwen LLM 项目负责人刘大一恒披露：大语言模型侧 Qwen3.8-Max 在 Coding 与 Cowork 场景表现强劲，发布后取得 Artificial Analysis Agentic 智能体第一、CodeArena 前端编程第一；基于下一代架构的 Qwen4 已投入训练，Qwen4.5、Qwen5 等后续版本参数将扩展至 5 万亿—10 万亿规模；大模型递归自我改进（RSI）已初步进入模型训练、推理及芯模协同环节；多模态矩阵全面升级，Qwen-Image-3.1 性能有望逼近最强 GPT-Image 系列，Qwen-Audio-3.1 在 ASR、TTS、Realtime 三条语音赛道位列国际第一梯队、国内第一，下一代视频生成模型将于 11 月发布。

云栖 MaaS 与 Agent 技术主论坛上，集团战略副总裁、ATH MaaS 业务线总裁文征宣布「千问 AI 平台全面升级」，主线是推动 Agent 落地。科创板日报 9 月 22 日报道，阿里同期围绕「10 万亿参数模型、20GW 数据中心」等口径公布 AI 投入方向。产品侧，Qwen 团队 9 月 20—21 日发布并开放权重 Qwen-Image-2.1（7B 原生图像生成与编辑、最多支持 10 张参考图、自带提示增强 LLM、已集成 diffusers 与 ComfyUI）。

C 端硬件方面有一条传闻：晚点 LatePost 9 月 22 日称无影团队正研发「QwenBook」AI 设备，定位原生智能体电脑，形态接近「千问平板」——属具名媒体线索，公司未公开确认，本次未取得官方口径。

战略上，阿里把竞争主线从「单模型性能」抬到「模型—芯片—云—Agent 平台」的系统战：Qwen4、Qwen5 用 5–10T 参数与 RSI 讲长期上限，MaaS 与 Agent 平台讲当期变现，同时用芯片与数据中心（20GW 口径）绑定算力自给。路线未反转，重心明显向「可交付的 Agent 能力和云消耗」倾斜。产品与市场层，Qwen-Image-2.1 走轻量加开放权重（7B，diffusers、ComfyUI、HF Spaces 可直接用），是把图像生成推向「低成本、可本地化」的普惠位；Qwen-Audio 声称语音三赛道国内第一，属能力层对外竞争力主张。B 端收入与客户数本周未取得新披露。资本与组织侧，AI 相关资本开支口径（20GW 数据中心）为本周新增公开信号；组织上 ATH 事业群 MaaS 业务线为对外发布主体，未见本周人事变动披露。

风险有三条：一是 RSI（递归自我改进）表述在海外安全议程下可能招致「自我进化」类监管与安全质疑；二是云栖口径多为未审计的官方自评（榜单排名、对手对标），需按具名披露处理；三是平台全面升级后的 Agent 稳定性与 ROI 转化未披露。

关键数据来源：5–10T 参数为 [新浪财经](https://finance.sina.com.cn/stock/t/2026-09-22/doc-inissitf7078850.shtml)（2026-09-22）；Qwen-Image-2.1 的 7B 与 10 张参考图为 [iaipie](https://iaipie.com/2026%E5%B9%B49%E6%9C%8822%E6%97%A5ai%E8%A1%8C%E4%B8%9A%E8%B5%84%E8%AE%AF%E9%80%9F%E8%A7%88/)（2026-09-22）；20GW 数据中心与 10 万亿参数口径为 [科创板日报](https://m.chinastarmarket.cn/detail/2489879)（2026-09-22）；云栖定档 9 月 22—24 日为 [新华网浙江](http://zj.news.cn/20260806/8c33b588f1584af9bc57c2cc2d57a675/c.html)（2026-08-06）。另见 [新浪香港（TechWeb）](https://portal.sina.com.hk/technology/sina/2026/09/22/1932688/) 与 [doit.com.cn](https://www.doit.com.cn/ai/851698724200517.html)（2026-09-22）；[iaipie 2026-09-21 速览](https://iaipie.com/2026%E5%B9%B49%E6%9C%8821%E6%97%A5ai%E8%A1%8C%E4%B8%9A%E8%B5%84%E8%AE%AF%E9%80%9F%E8%A7%88/)（qbitai 原文 403 打不开，同事件以新浪、凤凰、chinaz 多源交叉）。

影响判断：Qwen4 训练中加 5–10T 路线若成立，会把中国头部厂商的参数竞赛重新拉高一个量级，并强化「开源权重 + 低价 API」对中国生态的锁定；对全球竞争而言，阿里的关键不在于榜单，而在于 Agent 平台能否把云的算力消耗变成可复购的企业支出。下一步看 11 月新一代视频模型与 Qwen4 实际发布节奏。

对搭方案与做解决方案的从业者：图像与语音侧能力以开放权重加 diffusers、ComfyUI、HF 集成方式给出，意味着多模态能力可以低成本自建、私有部署路径清晰；但 Agent 平台级能力（MaaS 与 Agent 主论坛升级）仍是云端绑定式供给，方案商需评估「能力可自托管、编排留在云上」的混合架构成本。

### 字节跳动 / 豆包 / 火山引擎

窗口内未检索到字节跳动官方（Seed 团队或火山引擎）就模型与平台发布的新公告；可核实的本周相关事实是生态外溢：据第三方已读速览（2026-09-22），Perplexity 的 Computer 产品已支持调用字节跳动 Seedance 2.5 与 MiniMax H3 生成视频，用户可在同一线程内产出广告短片、产品演示等成品视频，功能面向 Pro 与 Max 订阅用户开放。这意味着字节的视频生成模型已通过海外第三方 Agent 产品获得分发出口。

但需注意主体：该事件的主体为 Perplexity，字节侧未同步发布声明，因此属行业外溢而非字节本周的公司级动态。背景（非本周）：字节 2026-08-31 将「豆包股」价格由 6 月的 14.85 美元/股上调至 17.02 美元/股并增加发放；Seedance 2.5 于 2026-07-31 由 Seed 正式发布（一镜成片、多主体参考）；豆包大模型 2.0 于 2 月 14 日发布。

取证边界也需说明：本次对字节的定向检索（以豆包、火山引擎、Seed 加 2026 年 9 月为主题的多组查询）未命中窗口内公司侧一手发布，火山引擎 FORCE 大会与豆包 2.1、Seedance 2.5 均为窗口外；这不能据此判定公司静默，只能记「本次未取得窗口内官方事件」。

从可核实信号看，字节本周的角色是「模型供应方被第三方 Agent 平台集成」，即继续用开放 API 换取海外分发；自建 C 端（豆包 App）与 B 端（火山方舟、AgentKit）双轨不变，未见本周路线调整证据。Seedance 2.5 被 Perplexity Computer 采纳，说明其视频生成在海外创作工作流中具备可嵌入性（第三方集成不等于规模化付费，按原证据边界保留）；豆包 C 端月活、Token 调用量等本周未取得新披露。资本与组织侧，本周未见并购、上市或高管变动披露；豆包股定价上调属 8 月信号（背景，非本周）。

风险方面：对第三方海外平台的依赖放大了政策与合规不确定性（中国模型进入美国产品链的管制风险）；本组未取得本周新增监管事件证据。

相关来源：[iaipie 2026-09-22 速览](https://iaipie.com/2026%E5%B9%B49%E6%9C%8822%E6%97%A5ai%E8%A1%8C%E4%B8%9A%E8%B5%84%E8%AE%AF%E9%80%9F%E8%A7%88/)；背景见 [Seed 官方博客 · Seedance 2.5](https://seed.bytedance.com/zh/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5)（2026-07-31）与 [财联社 · 豆包股专题](https://www.cls.cn/subject/2254)（2026-08-31）。本周窗口内无新增数字（本次未取得）。

影响判断：本周字节的信号是「模型出口」而非「模型发布」——视频模型成为第三方 Agent 产品的可调用组件，价值落在分发而非能力领先。下一步看火山引擎秋季发布会与豆包侧商业化（订阅与 API 定价）是否有窗口内动作。对搭方案的人：Seedance 2.5 可作为视频生成候选组件接入自有 Agent 编排（已有第三方集成先例），但需注意中国模型经海外平台调用的合规与配额不确定性，企业方案的稳定供给仍应保留双供应商。

### 腾讯 / 混元 / 元宝

腾讯本周有三条窗口内线索。其一，据读佳（myzaker 转载）与百度百科条目记载，腾讯混元于 2026 年 9 月 21 日推出面向外部行业人才的专家平台「混元智囊团」，Slogan 为「聚智为谋，引领未来」，通过连接金融、法律、医疗等垂直领域资深专家，以线上接单、任务付费模式为真实 AI 任务供给专家经验——该线索来源为二手转载与百科，未见腾讯官方公告，按「具名媒体披露」限述。其二，混元官方研究页 9 月 21 日发布 RL Team 技术进展：在固定硬件上增大 batch 使生成吞吐量最高提升 2.29 倍，最佳 GRPO 配置在不增加 GPU 的情况下将达到同一验证目标所需时间缩短 29%。其三，Hugging Face 于 2026 年 9 月 20 日上架腾讯 OCR 模型 tencent/WeVisDoc，含 2B 与 4B 两版、Apache 2.0 许可，据 OmniDocBench v1.6 结果 WeVisDoc-4B 以 95.38 总分领先（经第三方已读速览记载，HF 页面本次未直接打开）。

背景（非本周）：混元 Hy4 preview（总参数 770B、激活 49B、上下文 1M）研究页存在，但本次未取得其发布日；元宝 C 端与混元组织调整（2026 年 7 月「改造腾讯混元的 300 天」报道）均为窗口外背景。

战略上，专家平台意味着混元尝试把行业知识与数据以人机协同方式并网到模型侧，属于用外部专家供给绕开「自建数据飞轮」的路径；同时通过开源 OCR 模型在开发者侧刷生态存在感。路线仍是「跟随投入 + 场景侧找差异化」。产品与市场层，WeVisDoc 走 Apache 2.0 开源（宽松商用许可）加榜单领先的打法，目标是文档理解这一企业刚需入口；「混元智囊团」面向金融、法律、医疗等付费意愿高的垂直场景，但订单量、专家数、收入均未披露。资本与组织侧，未见本周新增融资或并购披露；专家平台本身可视为组织能力的「外部化」（把行业人才变为可交易的供给），非雇员变动。

风险：专家接单模式涉及数据保密、专家责任与行业合规（医疗、法律建议资质边界），目前未见腾讯公布治理规则；「混元智囊团」一条来源为二手转载，存在信息不准确风险，已限述。

可核实数字来源为 [腾讯混元官方研究页](https://hunyuan.tencent.com/)（2026-09-21 条目）与 [iaipie 2026-09-21 速览](https://iaipie.com/2026%E5%B9%B49%E6%9C%8821%E6%97%A5ai%E8%A1%8C%E4%B8%9A%E8%B5%84%E8%AE%AF%E9%80%9F%E8%A7%88/)（WeVisDoc 榜单与许可）；「混元智囊团」线索见 [读佳（myzaker 转载）](https://app.myzaker.com/news/article.php?pk=6ab092a38e9f0942fc5b4a4f) 与 [百度百科 · 腾讯混元大模型](https://baike.baidu.com/item/%E8%85%BE%E8%AE%AF%E6%B7%B7%E5%85%83%E5%A4%A7%E6%A8%A1%E5%9E%8B/63600993)。起售价与订单：未公开。

影响判断：腾讯本周的动作都在「补生态位」而非「抢性能位」——开源 OCR 抢占文档理解入口，专家平台探索高价值垂类的数据与服务变现。若专家网络能形成规模，混元的差异化可能来自「行业专家 × 模型」的服务形态，而非模型本身。对搭方案的人：WeVisDoc 以 Apache 2.0 开放，文档解析（合同、报表、票据）可低成本自建进流程方案，混合精度与长文档场景建议做与现有 OCR 的对照评测；「混元智囊团」目前供给与定价未公开，方案商暂不宜把它写进交付清单。

### 百度 / 文心 / 千帆

百度本周可核实事件集中在智能体平台侧。其一，百度智能云 2026 年 9 月 20 日在深圳举办「超级智能体大会·深圳站」（10:00—17:00）。其二，央广网 9 月 21 日报道，百度「搭子」在深圳发布智能体开发平台「灵玑 OS」，可向下调度模型、数据、算力与各类工具，向上为智能体提供运行、协同调度与安全治理支撑。

背景（非本周）：9 月 16 日 2026 智能经济论坛上，百度智能云首次提出「产业智能体操作系统」理念（把通用、专业与定制智能体组织成可协同闭环的系统），由百度集团执行副总裁沈抖主讲；百度 9 月 1 日完成港股双重主要上市转换（8 月 27 日公告）；2026 上半年 AI 云基础设施收入 161 亿元、同比 +65%（公司财报口径，第三方转述）。

取证边界：文心大模型与千帆平台在窗口内（9 月 18—24 日）的具体版本或定价更新本次未取得；百度千帆「模型更新记录」页面已定位（含文心 X1.1 上下文 64K 等条目）但未逐条核对日期，故不写入本周动态。

战略上，百度把叙事统合到「产业智能体操作系统」——用 OS 与调度层概念把模型、算力、工具与行业智能体打包，避免在模型单点与阿里、字节正面对撞；灵玑 OS 是该叙事下落到开发者工具层的一步。产品与市场层，会议与平台发布密度高（深圳站、开发平台），但本周未见客户数、Agent 调用量或千帆 ARR 新披露；公司此前 AI 云收入高增速为 2026 上半年口径，非本周。资本与组织侧，9 月 1 日完成双重主要上市（背景，非本周），本周无新增资本动作披露。

风险：平台层概念（操作系统、OS）多，可验证的落地指标少，存在「叙事领先于交付」的执行风险；智能体安全治理责任边界尚未见细则。

关键数据：活动时间 2026-09-20（[百度智能云活动页](https://cloud.baidu.com/summit/super-agent-summit)）；灵玑 OS 功能描述（[央广网](https://www.cnr.cn/szfw/wqyq/20260921/t20260921_527820670.shtml)，2026-09-21）；背景见 [证券时报](https://www.stcn.com/article/detail/4187381.html)（百度智能云 2026 上半年 AI 云基础设施收入 161 亿元、GPU 云 +230%，公司财报口径、第三方转述）。客户数与 ARR：本次未取得。

影响判断：百度正把「智能体」从应用叙事升级为平台与系统层叙事，试图以调度层（OS）锁定企业 Agent 的运行入口。能否成立取决于灵玑 OS 的第三方采用与千帆的开发者留存，而非会议声量。下一步看是否有客户案例与用量数据。对搭方案的人：此类「智能体 OS」若真提供统一调度、工具治理与安全边界，可减少方案商自建编排的工作量；但当前公开信息只有能力描述、缺少开放接口与计费口径，建议先按试点评估，不写入长期架构依赖。

### 华为 / 昇腾 / 盘古

华为全联接大会 2026（HC2026）9 月 17—19 日在上海举办，落在窗口内的关键节点是 9 月 19 日的「AI DC 创新峰会」。会上华为发布或联合发布：《AI DC 白皮书 2026》（与中国建设银行联合）、面向金融行业的《金融数据中心网络高可用性技术规范》、企业 AI 算力运营解决方案，并与联通（广东）发布莞深国家人工智能应用中试基地样板点、与山东港口青岛港发布全球样板点。

技术侧的官方口径：昇腾 960 超节点是业界首个采用 NPO 技术的超节点，单节点 4096 卡规模，在 10T 大模型训练场景 MFU 为上一代 1.1 倍、推理场景单卡吞吐为上一代 2.5 倍；鲲鹏超节点液冷单柜密度提升至 128 CPU；数据存储已在科研、自动驾驶、医疗、具身智能等领域落地超 100 个 AI 应用案例；数据通信侧首发灵衢网络交换机 CloudEngine SF9000 系列与全自研 NPO 交换机 CloudEngine XH9000 系列。

背景（非本周，窗口前 1 天）：9 月 17 日汪涛主题演讲发布业界首个采用 NPO 的昇腾 960 超节点，并宣布昇腾 960DT 提前三个季度至 2027Q1 就绪、960PR 提前一个季度至 2027Q3 就绪，2028 与 2029 年推昇腾 970、980；昇腾 910C 超节点已部署超 1000 套、950 超节点规模商用；CANN 外部开发者占比首超内部达 61%、社区月活开发者超 5200 名；昇腾成为 PyTorch 官网可直接安装的算力平台（首个中国算力平台）；鲲鹏全球开发者超 416 万。该 9 月 17 日事件因日期在窗口起始之前，只作背景，不计入本周动态。

战略上，「超节点加集群」的系统架构路线被进一步固化：用 NPO 光互联、灵衢统一互联把 4096 卡与百万卡集群做成「一台计算机」，并在芯片节奏上给出一年一代、提前量较大的时间表，把竞争从单芯片制程转向系统互联与规模工程。产品与市场层，窗口内以「行业样板点 + 白皮书 + 规范」推进 B 端落地（建行、青岛港、港大课程规划智能体、中科院高能所等已读案例），卖点是 Token 效率与运维可用度（99.8% 可用度、5500 个 Hi-ONE 替代 4.8 万颗 800G 光模块、降超 550 千瓦功耗），属官方自述口径；盘古大模型本周未见新版本披露（本次未取得）。资本与组织侧，本周无融资、并购或上市动作（华为为非上市公众公司，AI 相关投入未在本周以金额披露）。

风险有三条：昇腾核心算力供给仍受制程与供应链约束（提前量产时间表存在执行风险）；生态层面「PyTorch 官方支持/CANN 开源」是长期投入项，短期开发者迁移成本仍然存在；官方性能口径（MFU 1.1 倍、吞吐 2.5 倍）为自测，未见第三方复现。

关键数据：昇腾 960 超节点 4096 卡、8E FP8、1PB HBM、5500 个 Hi-ONE、可用度 99.8%（[华为官网 · AI DC 创新峰会](https://www.huawei.com/cn/news/2026/9/hc-ai-dc-innovation-summit)，2026-09-19）；鲲鹏超节点最大 4096 节点、256TB 统一内存池、Agent 沙箱启动提升 30 倍（同上）；集群上限 51.2 万卡、多轨道拓扑可达 100 万卡（9 月 17 日演讲）；CANN 外部开发者 61%、月活 5200+、原生训练模型超 40 个、覆盖 90+ 三方社区（同上）。背景来源为 [华为官网 · 汪涛主题演讲](https://www.huawei.com/cn/news/2026/9/hc-wang-keynote)（2026-09-17，本次按窗口要求作背景）。

影响判断：华为把 NPO 与光互联提前一年落地，等于在中国算力侧把「互联密度」变成差异化武器——对无法获得最先进制程的一方，系统级工程是唯一可拉开性能差距的杠杆。对全球竞争的含义是：超节点架构（NVL 类、UBB 类）的工程标准之争将同步发生在互联与功耗维度，而非只比芯片。

对搭方案与做解决方案的从业者：昇腾已成为 PyTorch 可直接安装的算力平台、CANN 进入常态化开源，意味着国产算力上的方案移植成本在下降；做私有化与信创交付时可把昇腾超节点纳入规划，但需注意 MFU、吞吐等官方口径未有第三方复现，建议先做同模型同精度实测。PB 级 KV 缓存（OceanStor M900）与鲲鹏超节点对 Agent 沙箱、向量检索的加速，对高并发 Agent 方案有直接价值。

### DeepSeek

本周最明确的事实是治理与安全议程的曝光度骤升。据观察者网转引路透社 9 月 22 日独家报道，DeepSeek 将与其他公司一道，在当周向联合国安理会介绍 AI 带来的风险；安理会定于 9 月 23 日开会讨论 AI 与国际安全问题，OpenAI 首席执行官计划发言，Anthropic 高层代表预计出席。该条的实际可读文本为新浪 AI 热点小时报 9 月 22 日全文条目，路透原文未直接打开。第三方评测侧另有一条：Artificial Analysis 9 月 19 日发布的 Coding Agent Index v1.5（由 DeepSWE v1.1、Terminal-Bench 4.0、SWE-Atlas-QnA 等权复合）参评的 15 个模型中包含 DeepSeek，但本次未取得 DeepSeek 在该指数中的具体排名与成本数据。产品与价格侧，窗口内未见新的官方发布。

背景（非本周）：DeepSeek V4.1 Flash（552B MoE、Causal KV Cache）于 2026-09-10 发布并开源，9 月 14 日起旗舰 V4-Pro 的所有请求自动路由到 Flash、按 Flash 价格计费，Flash 系列同步调价（空闲时段缓存命中输入 0.02 元/百万 Token 等口径）；融资侧，2026 年 7 月市场报道第二轮融资投前估值约 710 亿美元（约 4800 亿元人民币），累计两轮规模超千亿元，属媒体口径、未独立核实。取证边界：DeepSeek 官方 api-docs 新闻索引页本次抓取返回的是 API 首调文档（重定向），故 9/10 条目仅以检索摘要与第三方转载佐证，未按全文读取采用于本周动态。

战略上，把旗舰流量向更便宜的 Flash 收敛（9 月 14 日起 V4-Pro 请求路由到 Flash），显示其战略从「堆旗舰能力」转向「用极低单位成本换调用规模」；活跃参与国际 AI 安全议程则是在监管话语权上主动占位。产品与市场层，低价与路由收敛会直接压低中国 API 市场的价格锚，第三方 Agent 编码评测已把 DeepSeek 纳入常规对比集，说明其默认进入评测与工具链生态；本周未取得 API 调用量、客户数或收入披露。资本与组织侧，本周无新增融资、上市或人事官方披露；此前估值与融资报道均为媒体口径（背景，非本周）。

风险：价格战压缩自身毛利与研发投入弹性；安全议程上的高曝光既带来政策影响力，也可能在美国管制语境下强化对中国模型的使用限制（本周未见新增管制动作证据）。

关键数据来源：安理会 9 月 23 日会议与路透 9 月 22 日报道见 [新浪](http://finance.sina.com.cn/roll/2026-09-22/doc-inissyqx6872193.shtml) 与 [新浪 AI 热点小时报](https://k.sina.com.cn/article_7857201856_1d45362c001908oeww.html)（2026-09-22）；Coding Agent Index v1.5 参评 15 模型含 DeepSeek 见 [iaipie](https://iaipie.com/2026%E5%B9%B49%E6%9C%8819%E6%97%A5ai%E8%A1%8C%E4%B8%9A%E8%B5%84%E8%AE%AF%E9%80%9F%E8%A7%88/)（2026-09-19）；背景数字见 [DeepSeek api-docs](https://api-docs.deepseek.com/zh-cn/news/news260910/)（V4.1 Flash 552B，2026-09-10）。窗口内营收与客户数：未公开。

影响判断：DeepSeek 本周的价值不在新模型，而在于两点：一是它把自己放进「AI 风险国际通报」的名单里，成为治理议题上的中国代表样本；二是它的低价路由继续压低行业推理价格锚，迫使阿里、字节、腾讯在定价上跟防。下一步看是否有窗口内的新产品或定价动作，以及安理会会议后的实际政策效果。

对搭方案与做解决方案的从业者：把旗舰流量按 Flash 价计费意味着单位推理成本可显著下降，适合高并发、低单价的产品化方案；但「自动路由」会带来能力上限与版本行为变化（同一 model 名背后的实际模型变化），方案商应在评测基线里锁定快照版本，避免因静默切换导致质量回归。

资本信号的从业者含义：DeepSeek 的媒体口径估值（约 710 亿美元投前）与千亿级累计融资若属实，意味着中国基座模型融资门槛已抬到「百亿人民币级单轮」，直接推高同赛道创业公司的估值参照与并购整合压力；本轮未取得公司确认口径，不作为估值定价依据。

### 智谱 AI

窗口内两条可核实事件。其一，据已读第三方行业速览（9 月 22 日），智谱推出 GLM-5.3-Flash 提速版，模型代码为 glm-5.3-flashx，推理速度最高可达 200 tokens/s；定价上该提速版在 Coding Plan 与 API 上均为 GLM-5.3-Flash 的 2.5 倍，即一个速度换价格的明确档位。该模型面向所有 API 用户开放，Coding Plan 用户可通过专门链接申请。其二，NVIDIA 团队 9 月 24 日发布 SWE-Serve 基准（面向生产级推理服务的 53 个编码任务），智谱 GLM-5.2 以 64% Pass@1 与领先者并列、对应成本仅 0.95 美元；榜单中 Claude Opus 5/Sonnet 5 以 75% 领先（成本 17 与 12 美元）、Kimi K3 为 46%（成本 0.33 美元）、Laguna S 2.1 垫底 35%。该条来源为第三方基准转述，未取得 NVIDIA 原始榜单页。

背景（非本周）：智谱 2026 年 1 月 8 日已在港交所主板上市，为「全球大模型第一股」；2026 年 9 月 10—13 日前后约 50 亿美元再融资落定（媒体口径，窗口外）；GLM-5.3 与 GLM-5.3-Flash 分别于 2026-08-14、08-26 发布。取证边界：智谱官方研究页本次抓取「响应体不完整」但已读到研究列表（含日期），窗口内未出现新基座模型条目，故本周动态以第三方速览记载的提速版与基准表现为主。

战略上，这是典型的分层变现策略——用同一基座切出速度档（flashx）与价格档，把延迟敏感场景（实时交互、代码生成）单独定价，同时保持开源与低价口碑以扩大开发者基数。产品与市场层，GLM-5.2 在 SWE-Serve 上以不到 1 美元成本达到 64% Pass@1，是本周最有力的性价比证据（第三方口径）；Coding Plan 订阅与 API 双轨，说明其收入重心在企业开发者与编程工具生态。资本与组织侧，本周无新增披露；上市主体身份使其具备公开市场再融资能力（窗口外已有约 50 亿美元融资报道，公司未在本周确认细节）。

风险：与 Anthropic、OpenAI 的成本—能力差距仍存在（75% 对 64%）；基座模型窗口内无新版本，存在被 Qwen 与 DeepSeek 迭代节奏压制的风险；提速档 2.5 倍价格可能抑制部分价格敏感客户采用。

关键数据来源：glm-5.3-flashx 最高 200 tokens/s 与 2.5 倍定价见 [iaipie 2026-09-22 速览](https://iaipie.com/2026%E5%B9%B49%E6%9C%8822%E6%97%A5ai%E8%A1%8C%E4%B8%9A%E8%B5%84%E8%AE%AF%E9%80%9F%E8%A7%88/)；SWE-Serve 分数与成本对比见 [iaipie 2026-09-24 速览](https://iaipie.com/2026%E5%B9%B49%E6%9C%8824%E6%97%A5ai%E8%A1%8C%E4%B8%9A%E8%B5%84%E8%AE%AF%E9%80%9F%E8%A7%88/)；官方研究列表见 [智谱 AI 研究页](https://www.zhipuai.cn/zh/research)。ARR 与客户数：未公开（本次未取得）。

影响判断：智谱本周把竞争焦点从「能力追平」转为「单位成本下的可用性」——在第三方生产级基准上，GLM-5.2 的性价比位置比绝对分数更醒目。这会给中国模型在海外 Agent 工具链（编码与服务工程场景）中争取默认位。下一步看 flashx 档的实际采用率与是否出现新基座版本。

对搭方案的人：若方案对延迟敏感（交互式编码、实时客服），glm-5.3-flashx 提供了「用 2.5 倍价格换 200 tokens/s」的明确档位，可直接做 A/B 成本核算；GLM 系列在第三方编码工具中支持较广，移植成本低，适合作为国产模型的主选或备份。

资本信号的从业者含义：窗口外约 50 亿美元级再融资（媒体口径）叠加已上市身份，说明中国基座模型公司已进入「上市公司持续融资 + 二级市场定价」阶段，未上市竞品的融资议价能力会被相对削弱。

### 月之暗面 / Kimi

窗口内可核实的直接事实为第三方基准表现与治理争议的延续。NVIDIA 9 月 24 日 SWE-Serve 基准中，Kimi K3 以 46% Pass@1 对应全场最低成本 0.33 美元，即「能力不领先但单位成本最优」的位置。争议侧：Anthropic 于 2026 年 9 月发布报告指控月之暗面通过蒸馏其模型能力开发 K3，海外媒体在窗口内仍有相关报道与讨论延续（DW 9 月 12 日报道为窗口外，属背景；窗口内仅见第三方平台，如 BBC 中文页显示 9 月 23 日时间戳，继续引用该指控，本次未取得窗口内新的官方回应原文，故仅记为「争议延续、无新增事实」）。

背景（非本周）：Kimi K3 于 7 月 17 日发布、2.8 万亿参数、100 万 Token 上下文，为当时全球最大开源权重模型；月之暗面 7 月向投资者发出股东决议寻求支持赴港上市，并据报道洽谈 K3 进入美国三大云平台；融资仍在磋商、未宣布完成（媒体口径）。本周未取得公司侧新模型、新定价或新客户披露。

战略上，公司以「开源权重 + 极低成本」作为全球分发策略，用成本优势进入海外 Agent 工具链与云平台谈判，同时推进港股上市以解决算力资金缺口。产品与市场层，Kimi K3 的高知名度使其成为海外评测与创作工具的常见组件（SWE-Serve 已纳入），说明开源策略在分发端有效；但商业侧收入、付费客户与 API 调用量本周均未取得。资本与组织侧，上市进程与融资仍在进行中，本周无新增确认信息（未披露）；创始人杨植麟为对外沟通主体。

风险：知识产权指控（蒸馏）带来的法律与合规风险，以及中国模型进入美国云平台的管制风险，是本周最突出的两项；算力供给与巨额资本需求未解决。

关键数据来源：K3 的 46% Pass@1 与 0.33 美元见 [iaipie 2026-09-24 速览](https://iaipie.com/2026%E5%B9%B49%E6%9C%8824%E6%97%A5ai%E8%A1%8C%E4%B8%9A%E8%B5%84%E8%AE%AF%E9%80%9F%E8%A7%88/)；背景见 [DW 中文 · 全球最大规模开源模型](https://www.dw.com/zh/%E4%B8%AD%E5%9B%BDai%E5%85%AC%E5%8F%B8%E6%9C%88%E4%B9%8B%E6%9A%97%E9%9D%A2%E5%8F%91%E5%B8%83%E5%85%A8%E7%90%83%E6%9C%80%E5%A4%A7%E8%A7%84%E6%A8%A1%E5%BC%80%E6%BA%90%E6%A8%A1%E5%9E%8B/a-78011216) 与 [VOA 中文 · 与美国云厂洽谈](https://www.voachinese.com/a/chinese-ai-firm-is-negotiating-with-us-cloud-giants-raises-security-concerns-20260826/8190647.html)。估值与融资额：本次未取得公司确认口径（媒体称融资磋商中）。

影响判断：Kimi 本周的存在感来自「成本曲线」而非能力曲线——用最低单价换取进入海外工程评测与工具链的默认位，是开源权重战略的直接回报。风险侧，蒸馏指控若升级为正式法律或管制动作，会直接影响其海外云分发路径。下一步看上市聆讯进展与是否有窗口内新版本。

对搭方案与做解决方案的从业者：编码与长上下文批量任务可用 K3 做「低价大容量」层，复杂推理再上更强模型，形成成本分层架构；但涉美业务需预留合规审查（模型来源争议），不建议单点依赖。资本信号方面：「开源权重 + 赴港上市 + 洽谈美国云分发」三条线并行，说明中国模型公司正把资本市场与分发渠道同时证券化；若上市落地将抬升同类公司退出预期，若受指控发酵则反之。

### MiniMax

窗口内可核实的是「被第三方 Agent 产品集成」与社区生态外溢两类事实。其一，据已读第三方速览（9 月 22 日），Perplexity 的 Computer 产品已支持使用 MiniMax H3（与字节 Seedance 2.5 并列）生成视频，用户可在同一线程中产出广告短片、产品演示与社交素材，功能面向 Pro 与 Max 订阅用户。该集成使 MiniMax 的视频模型获得海外付费产品的分发出口，而非公司自行落地。其二，同源记载的社区生态信号：Jev 与 MiniMax H3 视频加速（Attention 稀疏化，RTX 4070 上生成时间由 6 分 7 秒降至 3 分 34 秒、提速 41.7%）、MiniMax H3 CrossView-Warp LoRA（可改变既有视频运镜，社区评价较高）。

背景（非本周）：MiniMax 2026 年 1 月 9 日于港交所上市（代码 0100.HK，发行价 165 港元）；2026 年 5 月 29 日提交 A 股 IPO 辅导、冲刺「A+H」；2026 中期业绩（8 月 26 日披露）显示 Q2 收入环比 +81.8%，截至 2026 年 7 月平台 Token 消耗量达当年 1 月的 20 倍，2025 年营收同比增长 158.9%，2026 年 2 月 ARR 突破 1.5 亿美元。取证边界：MiniMax 官方新闻页本次抓取仅返回站点跳转（JS 渲染），公司新闻页未取得；H3 的官方发布日与许可条款本次未取得，故只写第三方已读记载。

战略上，公司以开源与低成本多模态模型换取全球开发者与第三方产品集成（视频生成加视频编辑 LoRA 生态），同时用「港股 + 科创板」双平台解决资金与估值锚定问题。产品与市场层，H3 已被海外 Agent 产品与社区工具链采纳（Perplexity Computer、Jev 加速、CrossView-Warp LoRA），表明其视频模型在推理成本与可编辑性上具备竞争力；收入结构上，此前披露的 ARR 与 Token 增长为 2026 上半年口径，非本周。资本与组织侧，A+H 双上市推进中（5 月启动 A 股辅导，窗口内无新增节点披露）；上市公司身份使其融资与信息披露更规范。

风险：视频生成赛道竞争激烈（Seedance、Qwen 视频模型 11 月上线、Runway 等），单靠低成本可能陷入价格战；社区 LoRA 生态虽活跃但变现链路不清晰；窗口内公司侧无新披露，信息不对称风险较高。

关键数据：RTX 4070 上 H3 生成时间 6 分 7 秒降至 3 分 34 秒（−41.7%）见 [iaipie 2026-09-22 速览](https://iaipie.com/2026%E5%B9%B49%E6%9C%8822%E6%97%A5ai%E8%A1%8C%E4%B8%9A%E8%B5%84%E8%AE%AF%E9%80%9F%E8%A7%88/)；背景见 [PR Newswire APAC · MiniMax 2026 中期业绩](https://www.prnewswire.com/apac/zh/news-releases/minimax2026-302860486.html)（2026-08-26）与 [MiniMax 公司新闻页](https://www.minimax.cn/news)（本次抓取失败，仅记缺口）。窗口内收入与客户数：未公开。

影响判断：MiniMax 本周的位置是「视频模型供应方」——被海外 Agent 产品接入并衍生社区工具，说明其能力已进入可组合层；但缺少公司级商业披露，价值兑现仍需观察。下一步看 A 股辅导进展与 H3 是否走向开源加定价体系化。

对搭方案与做解决方案的从业者：视频生成类方案可把 H3 作为低成本候选组件（已有第三方集成与社区加速先例，RTX 4070 级硬件即可跑出可用时延），适合原型与小规模生产；但许可与商用条款本次未取得，正式交付前须核对模型许可。资本信号方面，港股与科创板双平台路径若走通，将为中国 AI 公司提供「先港股融资、再回 A 股估值」的标准范式，抬高未上市公司的上市预期与投行服务需求。

#### 本组格局变化

1. **竞争主轴从「模型分数」转向「系统与成本」**：阿里把叙事抬到「模型—芯片—云—Agent 平台 + 10 万亿参数/20GW 数据中心」；华为把差异化压在 NPO 光互联与超节点系统（4096 卡、百万卡集群）；DeepSeek 用旗舰流量向 Flash 收敛压价；智谱用 flashx 速度档与 GLM-5.2 的「不到 1 美元 64% Pass@1」抢性价比位。三方（阿里、华为、DeepSeek）从不同层面同时指向单位推理成本与系统效率，而非单点能力。
2. **开源权重成为分发武器，商业化留在云与订阅**：Qwen-Image-2.1（开放权重、7B、集成 diffusers/ComfyUI）、腾讯 WeVisDoc（Apache 2.0）、Kimi K3、MiniMax H3 都通过开源或第三方集成获得分发；而收入抓手（千问 AI 平台与 MaaS、GLM Coding Plan、火山方舟）仍留在云侧。
3. **海外第三方 Agent 产品成为中国模型的新分发渠道**：Perplexity Computer 同时接入字节 Seedance 2.5 与 MiniMax H3；Artificial Analysis、NVIDIA SWE-Serve 等第三方基准把 GLM-5.2、Kimi K3、DeepSeek 纳入常规对比集。中国模型正从「被评测」变成「被默认调用」，但这也放大了合规与管制风险（蒸馏指控、入美云平台谈判）。
4. **治理与安全议程成为中国头部企业的必答题**：DeepSeek 被曝将在联合国安理会通报 AI 风险、微软与斯坦福在美推「安全刹车」、Anthropic 的指控延续——中国企业在国际安全议题上的能见度与合规成本同时上升。
5. **资本面：上市与双平台、巨额再融资并行**：智谱（已上市，窗口外约 50 亿美元级融资报道）、MiniMax（A+H 双平台推进）、DeepSeek（媒体口径 710 亿美元投前估值）、月之暗面（赴港上市推进）共同说明中国基座模型已进入「二级市场定价 + 大额持续融资」阶段，未上市公司的融资议价与并购整合压力上升。

本组局限一并说明：字节跳动、百度在窗口内公司侧一手发布证据稀薄（字节仅取得第三方集成事实，百度仅取得 9 月 20—21 日会议与平台发布），已按「本次未取得」标注而非判为静默；腾讯「混元智囊团」为二手转载线索；DeepSeek 安理会条目基于新浪转述路透（路透原文未直接打开）；智谱、月之暗面、MiniMax 的窗口内事件多为第三方速览记载，未逐一到公司官网一次性核验（MiniMax 新闻页、混元研究页、智谱研究页抓取受限已记）。

## AI 应用与垂直头部企业

本部分十二家公司的主线是从「能力竞赛」切换到「可运维、可审计、可计价」的交付竞赛；其中一家本周静默，已如实记录核验范围。

### Harvey

Harvey 现有融资轮出现「第二次交割」：加拿大安大略省教师退休金计划旗下的后期成长投资平台 Teachers' Venture Growth（TVG）于 2026-09-24 公告参与该轮第二交割，融资总额由此从 5.5 亿美元升至 US$600M；TVG 称本轮资金将主要加速 Harvey 在加拿大市场的扩张，用于在本地扩充工程、客户成功、销售与「法律创新」团队。TVG 高级董事总经理 Rick Prostko 在公告中点名 Harvey Tenet（公司自研 post-trained 开放权重模型）是其差异化来源：「Harvey 自己后训练了模型，因此控制了产品背后更多的智能，这是可持续优势」。

同一公告披露的运营口径：Harvey 服务超过 3,000 家客户、覆盖 70 多个国家，在成立仅四年后年化经常性收入（ARR）突破 US$400M；加拿大多伦多设有办公室，已有 100 多家加拿大律所与法务团队在平台上。该融资事实的背景是 2026-09-09 Harvey 官宣 $550M、$15.5B 估值（Diffusion、Lightspeed 联合领投，Sequoia、Kleiner Perkins、a16z、Coatue、Goldman Sachs Alternatives、GIC 等老股东参与），并同期收购 AI agent 安全平台 Guardrails AI（2026 年内第 4 起收购）。本周新增信息量集中在「轮次总额上修 + 加拿大本地化扩张 + 收入与客户口径再确认」三点，而非新一轮估值。背景补充：$550M 与 $15.5B 主轮官宣日为 2026-09-09，早于本窗口；该轮与此前的 $11B 估值轮形成 5 个月内约 41% 的估值上修。

战略上，Harvey 从「法律 LLM 应用集成商」转向「自有模型 + 自有评测 + 安全底座」的垂直全栈。证据链是：post-trained 开放权重模型 Harvey Tenet、自建 Legal Agent Benchmark（Harvey LAB）、收购 Guardrails AI 补 agent 运行期安全、再用新资金继续投资自研模型与并购（公告称后续支持「专有法律模型、专项招聘与更多收购」）。投资人叙事也从「渗透率」转向「对智能层的控制权」。

产品与市场层，客户口径是本轮最值得注意的位移：从「80% Am Law 100 律所」扩展到区域所与精品所，并进一步渗入大企业法务之外的合规、采购、税务职能；此类横向职能扩张意味着 Harvey 的 TAM 故事从「法务部门预算」扩到「企业通用专业工作流」，同时也把它推进到与横向 agent 平台潜在重叠的地带。付费形态与单客价（ACV 与席位单价）本次未取得。

资本与组织侧：TVG 属于第二交割的新增出资方，交易条款未披露；Guardrails AI 联合创始人 Shreya Rajpal、Zayd Simjee 及团队并入 Harvey 产品与工程组织（人才并购性质明显）。估值口径存在媒体差异：$15.5B（Harvey 官博、Reuters、SiliconANGLE）与 $15.6B（Bloomberg、citybiz），本篇以公司口径 $15.5B 为准并记录该差异。

风险有三条：一是「ARR 与估值倍率」风险——$400M ARR 对 $15.5B 估值约 39 倍，属私募市场定价而非审计口径，且披露来自公司自身与投资方公告；二是竞争风险——OpenAI 已于 2026-09-17 推出面向 Am Law 200 的法律专用配置（GPT-6 Astra for Law，与 Sullivan & Cromwell、Ropes & Gray、Skadden、Cooley 合作），基础模型厂商直接下沉垂直场景，Harvey 的自研模型与工作流护城河需要被持续证明；三是渗透深度风险——「覆盖 80% Am Law 100」是机构触达指标，不等于座位数、活跃使用或生产化工作流，公开信息未披露续约率与实际用量。

关键数据与客户口径均出自 [OTPP 官方公告 · Teachers' Venture Growth invests in Harvey](https://www.otpp.com/en-ca/about-us/news-and-insights/2026/teachers-venture-growth-invests-in-harvey-ai-legal-platform)（2026-09-24，含总额 US$600M、ARR 超 US$400M、3000+ 客户、70+ 国家、加拿大 100+ 律所）；主轮与估值背景见 [Harvey 官方博客](https://www.harvey.ai/blog/harvey-raises-dollar550m-at-a-dollar155b-valuation-to-help-legal-teams-own-their-intelligence)（2026-09-09）、[Bloomberg 的另一口径](https://www.bloomberg.com/news/articles/2026-09-09/legal-ai-startup-harvey-hits-15-6-billion-value-with-550-million-round)（2026-09-09，背景）、[Artificial Lawyer](https://www.artificiallawyer.com/2026/09/09/harvey-raises-550m-at-15-5bn-val-buys-guardrails-ai)（80% Am Law 100 与 Fortune 10 中的 5 家，背景）与 [citybiz](https://www.citybiz.co/article/900345/harvey-raises-550-million-at-15-6-billion-valuation-as-legal-ai-demand-surges)（本轮资金用途，背景）。

影响判断：本轮「第二交割」的价值不在金额，而在于加拿大养老金类长线资金入场——这类 LP 通常以更长期限换取更稳的估值锚，说明垂直法律 AI 已从 VC 故事进入机构配置阶段。对垂直 SaaS 的启示是：当基础模型厂商（OpenAI Astra for Law）开始下沉，垂直玩家的防御位只能是「自有模型 + 自有评测 + 客户数据闭环」，Harvey 本周正是沿着这条线补强。下一步看 Harvey Tenet 相对基础模型的成本与质量曲线是否被第三方复现，以及区域所与合规、采购职能的扩张能否转化为可披露的 ACV 与续约数据。

### Sierra

2026-09-23，Liberty Global（Nasdaq: LBTYA）与 Sierra 签署三年期战略框架协议，在其欧洲电信业务中规模化部署 Sierra 的对话式 AI agent，覆盖约 8,000 万条固定与移动连接；部署已开始并分阶段推进，先在聊天、语音、短信渠道承接常规交互（如密码重置、账单查询类高频场景），把人工坐席释放到复杂工单。协议把「各运营公司如何上线 Sierra agent」标准化，用例按市场与品牌定制。

另一条背景性关联事件：2026-09-10 Figure Technology Solutions 公告成为 Sierra 新推出的 Horizon 长周期 agent 平台在美国的首个用例，把「被放弃的房屋净值贷款申请」转为完成放款，由 AI 与人类信贷员协同执行多日金融任务。该公告日本身早于本窗口，但其作为 Horizon 首个落地案例在本窗口被行业报道持续引用，且与 9 月 23 日电信大单共同构成「从客服走向营收流程」的证据，故按背景、非本周处理。

综合口径显示：Sierra 的 ARR 已在 2026 年 2 月前后达到约 $150M（发布 7 个季度破 1 亿美元 ARR 为公司自述最快纪录），客户覆盖 Fortune 50 中 40% 以上；2026-05 完成 $950M 融资、估值超 $150B 的十分之一量级（$15B），累计融资超 $10 亿美元；本周窗口内未见新融资官宣。

战略上，Sierra 从「客服 deflection 工具」转向「面向营收的长周期 agent 运行时」。产品分层已清晰：Agent OS 2.0（运行时与治理）、Agent Data Platform（上下文）、Workspaces（跨 CX、运营、工程的版本化发布与灰度）、Horizon（Takeoff 团队带来的长周期运行时，任务是天到周级）。Liberty Global 这类框架协议的意义在于把 Sierra 从「单点用例供应商」变成运营商集团的标准接入层。

产品与市场层，已披露落地样本横跨零售、电信、医疗、金融：Nordstrom 语音 agent「Nora」5 周上线；Singtel 10 周部署、解决率超 70%；Cigna 8 周上线、患者身份验证时间降 80%；Figure 的首个 Horizon 用例（房屋净值转化）。商业模式为按结果计费（收入与实际产出结果挂钩，而非按推理量），这是当前企业 agent 里较少见的收费结构，也意味着毛利与交付成本强绑定。资本与组织侧：2026-05 完成 $950M 融资、估值超 $15B，Tiger Global 与 GV 领投，累计融资超 $1B，资金用于国际化（欧洲、亚洲）与向销售、CV 类营收场景延伸（背景，非本周）；收购方面 2026-04-22 收 Fragment（法国 YC 系，多语言对话）、2026-07-23 收 Takeoff（长周期 agent，属 Horizon 班底）；本周无新披露的组织动作。

风险有三条：一是交付集中度——Liberty Global 这类框架协议的商业价值取决于各国运营公司实际上线多少用例，公告口径为「分阶段」，尚无席位、工单量或单价披露；二是结果计费的定价与成本风险——长周期任务（如贷款流程）越深入，Sierra 承担的推理与人工兜底成本越高，收入确认也可能随结果确认而延后；三是竞争——Salesforce Agentforce、OpenAI 及 CX 原生厂商（Intercom、Decagon 等）在同一预算口径内竞争。

关键数据与来源：Liberty Global 三年框架协议、覆盖约 8,000 万固定与移动连接，见 [StockTitan 转述 Liberty Global 新闻稿](https://www.stocktitan.net/news/LBTYA/liberty-global-signs-strategic-partnership-with-sierra-to-rollout-ai-jphc56znl7em.html)（2026-09-23）；Horizon 首个美国用例见 [MarketScreener](https://www.marketscreener.com/news/figure-partners-with-sierra-to-supercharge-loan-officers-with-ai-agents-that-turn-abandoned-home-ce785bdede81f62d)（2026-09-10，背景）；融资、估值与客户覆盖见 [TechCrunch](https://techcrunch.com/2026/05/04/sierra-raises-950m-as-the-race-to-own-enterprise-ai-gets-serious)（2026-05-04，背景）；ARR 与客户案例（公司自述口径）另见 [Pulse2](https://pulse2.com/sierra-950-million-raised-at-15-billion-valuation-for-ai-customer-experience-platform)（背景）。公司单客价与 ACV：未公开；本周无新融资官宣。

影响判断：Liberty Global 单子把「企业 agent 平台」的采购主体从单个业务部门推到集团级框架协议，这是 agent 供应商从试点走向标准化的关键台阶，也意味着销售周期、法务与安全审查的门槛被抬高，小玩家的机会窗口收窄。对搭方案者的直接含义是：跨国多品牌部署要求 agent 平台具备多语言与多品牌隔离、集中治理与用量可追溯能力（Sierra Workspaces 正是在卖这一点）。下一步看框架协议能否披露实际接通量、结果计费的单价区间，以及 Horizon 在受监管金融流程中的合规举证。

### Runway

2026-09-18，Runway 发布「统一计费（Unified Pricing）」：原先 web app 与 Runway Dev（API 与开发者侧）各自独立的 credit 池、独立合同被合并为单一 credit 池加单一发票，额度在企业内可跨产品流动，管理员可在统一的工作区分析视图里查看用量、在 web app 与 Dev 工作区之间转移额度、管理用户。官方给出的企业权益包括：面向 Runway Dev 客户扩充支持与赋能（含 Applied AI Architects 上门协作）；把 web app 里搭好的 workflow 通过 API Recipes 直接暴露为 API，供性能团队批量生成变体（换钩子、背景、产品角度、比例、本地化文案）。促销条款为：新企业客户在 2026-12-31 前签约可多获 10% credit（最少相当于 130+ 分钟视频或 12k+ 张图，按 Gen-4.5 与 Gen-4 Image 1080p 成本折算）；存量企业客户转介对应产品负责人可获得 5,000 免费 credit 加 1 天免费 Applied AI Architect 支持（自述价值 $6,000+）。

2026-09-22，Runway 上线 DIFFUSE（diffuse.runway.com）：一个连接「AI 原生创意人才」与品牌、代理商、工作室的开放人才平台，创意方建档案与作品集，需求方直接搜索与雇佣。Runway 披露其内部研究了近 400 家公司、1,000+ 条开放创意岗位，其中 17% 提及 AI 技能或生成式工具，且 Runway 是这些岗位中「被点名最多的视频类工具」。另有背景条目：Runway 官网显示 Runway AI Summit 定于 2026-09-30 在旧金山举行（DeepMind、NVIDIA、Physical Intelligence 等将出席），且站点同时挂出「Introducing Runway Media Router」「The AI Media Report」等内容，属窗口外或未确证日期的信息。

战略上，Runway 从「模型能力供给」转向「企业创意工作流的账务与治理层」：统一 credit 池解决的是企业客户最现实的采购摩擦（多合同、多预算池、无法向管理员回传用量），本质是把计费单位从「产品」改成「席位与额度」，为跨 web 与 API 的规模化消费铺路；DIFFUSE 则是把生态依赖从工具侧延伸到人才供给侧——当企业问「谁会整合这些工具」时，Runway 想成为答案的分发方。

产品与市场层，产品面已在做「生成模型、编辑与工作流、企业治理」的纵深：Aleph 2.0（重打光与换背景）、workflow、API Recipes、Gen-4.5 与 Gen-4 Image。定价结构本周变化明确（单池、可转移、可集中采购），但单位定价（每秒视频、每张图的价格）本次未取得，官方仅以「credit 折算分钟与张数」的口径出现；DIFFUSE 的商业化方式（是否抽成）未公开。资本与组织侧，本周未见融资、估值、并购或高管变动披露。

风险有三条：一是竞争强度——AI 视频赛道已收敛到少数资金充裕的玩家（Google Veo 3.1 系列、OpenAI Sora 线，后者的独立 Sora API 据报于 2026-09-24 关停），Runway 需要用企业工作流与治理差异化，而非仅拼模型排名；二是生态与人才平台的非技术风险——DIFFUSE 面向创意就业市场，会与既有经纪与人才生态产生摩擦，且其成功依赖供给端规模，短期难验证；三是企业计费集中在单池后，用量与收入的透明承诺会被客户更严格审视（管理员可见用量意味着客户更容易做成本优化与供应商比价）。

关键数据与来源：统一计费与促销条款见 [Runway 官方新闻 · Working smarter with Runway Unified Pricing](https://runway.com/news/company-news/working-smarter-with-runway-unified-pricing)（2026-09-18）；DIFFUSE 与抽样口径见 [Runway 官方新闻 · Introducing DIFFUSE](https://runway.com/news/company-news/introducing-diffuse)（2026-09-22）；Summit 预告见 [Runway 官网新闻页](https://runway.com/news)（窗口外预告）。企业客户数、ARR、融资额与单位定价：均未公开或本次未取得。

影响判断：Runway 本周两件事指向同一逻辑——当模型能力被快速商品化，创意 AI 的护城河前移到「工作流标准化 + 企业采购体验 + 供给侧生态」。对搭方案者意味着：如果企业要同时用网页工具和 API 批量产出媒体，供应商是否支持单一额度池、集中用量视图与可复用 Recipes，会直接影响落地方案的成本结构与合规审计路径，Runway 正试图把这个摩擦点做成卖点。下一步看 DIFFUSE 的供给端规模与抽成模式，以及 Summit 是否发布新模型或企业级治理能力。

### Databricks

2026-09-24（周四），Databricks 宣布收购云电子表格初创 Row Zero（西雅图，2021 年成立，创始人为前 AWS 工程师 Breck Fresen 与 Nick End），交易对价未披露。官方叙事是：Databricks 财务团队原本用 Row Zero 处理超过 100 万行的实时表格，并与自家 AI agent Genie 组合使用；由此决定把电子表格做成「人与 agent 读写企业治理数据」的界面——数据仍在 Databricks 云端受治理（权限、审计可追溯），前端用分析师熟悉的表格与公式，而不是把数据导出到不受管的表格中流转。CEO Ali Ghodsi 称「电子表格是每个业务分析师都爱的界面，把 BI、agent 与电子表格嫁在一起非常合理」，并明确表示「未来会做更多类似收购」。Row Zero 的独立产品对现有用户继续可用，团队重心转向把其引擎嵌入 Databricks。

并购管线背景（非本周）：2026 年内 Databricks 已收购 Quotient AI（agent 评测与 RL）、SiftD.ai（交互式 notebook）、Panther（AI SOC 安全）、Electric（PGlite，便于 agent 在本设备运行）；2026-08 完成 $5B 融资、估值约 $190B、年化收入跑率 $7B（同比增长 80% 以上），资金投向 Lakebase Genie、Unity AI Gateway 等「企业 agent 部署基础设施」。

战略上，Databricks 用「agent 的可信数据面」占据企业 AI 的中间层：Row Zero 的定位不是表格产品，而是让 agent 与人在同一份受治理数据上协作的交互面——这与 Unity AI Gateway（模型与工具治理入口）、Lakebase（Postgres 型运行态）形成一套「数据 + 权限 + 运行 + 交互」的组合拳；Ghodsi 明说继续并购，说明其扩张路径是「买能力、补栈位」而非纯自研。产品与市场层，Genie 从「自然语言问数」扩展到「可执行的表格工作台」，目标用户从数据工程师扩到财务、运营、GTM 等业务团队，这会向 Salesforce 与 Excel 的腹地推进，也把 Databricks 与 BI 工具（如 Power BI、Tableau 生态）的关系复杂化；收入口径为年化跑率 $7B（非 ARR 审计值，公司口径），未披露分产品收入或收购金额。资本与组织侧，$5B 新融资与约 $190B 估值（Coatue 领投，Blackstone、MGX、T. Rowe Price 顾问账户、Sixth Street Growth 参与）；Ghodsi 对媒体表示 IPO「可能在明年或更早」，公司持续以私募融资加老股转让延后上市（背景，非本周）；Row Zero 为小团队并购（2025 年 5 月 A 轮 $10M、当时估值约 $40M），属人才与引擎型交易。

风险有三条：一是并购整合与叙事稀释——2026 年已至少 4 起收购，能力拼接可能造成产品边界模糊与成本上升；二是表格化 agent 的安全与正确性风险——让 agent 在敏感财务数据上「按公式操作」，一旦出错影响面大，需要强审计与沙箱（Databricks 以治理为卖点，但公开材料未给出具体审计与回滚机制细节）；三是竞争与定价压力——Snowflake 等同层厂商与新兴 agent 数据平台在同一预算池竞争，估值 $190B 对应 $7B 年化收入约 27 倍，需持续兑现增速。

来源：收购公告与背景见 [TechCrunch](https://techcrunch.com/2026/09/24/databricks-buys-row-zero-and-is-scouting-for-more-startups-to-acquire)（2026-09-24，全文已读）；官方新闻稿见 [Databricks 新闻室](https://www.databricks.com/company/newsroom/press-releases/databricks-acquires-row-zero-bringing-live-governed-spreadsheets)（2026-09-24，标题与链接经 TechCrunch 正文确认，未逐字读取全文）；$5B 融资与 $190B 估值见 [TechCrunch](https://techcrunch.com/2026/08/13/databricks-wanted-to-raise-1b-investors-wanted-15b-it-settled-on-5b-at-a-190b-valuation/)（2026-08-13，背景）；并购序列另见 [mezha.net](https://mezha.net/eng/news/fc931ea1_databricks_acquires_row/)（2026-09-24）。客户数、ARPU 与 Row Zero 交易对价：未公开。

影响判断：Databricks 正在把「agent 落地的最后一百米」——业务人员实际操作的界面——纳入自家栈，这比再发一个模型更能锁定企业钱包：谁掌握受治理数据与交互界面，谁就掌握 agent 工作流的议价权。对做解决方案的从业者：agent 项目的数据治理与审计会成为采购硬指标，方案里「是否能把 agent 输出限制在受管数据面内」比模型选择更早决定是否过审。下一步看 Genie 与 Row Zero 的定价是否进入现有 SKU 或单独计费，以及 IPO 时间表披露是否带来财务口径透明化。

### Midjourney

2026-09-23（页面署名日期，搜索索引显示发布时间为 2026-09-24）Midjourney 发布 alpha 更新日志「Alpha Changelog - 9/23/26」，集中更新 alpha.midjourney.com。要点包括：一是样式预览（Live previews）——Styles 侧栏可用快速模型在你浏览样式时，用当前提示词实时预览效果，点击样式即把提示词与该样式一起提交；二是默认参数——在 Settings → Advanced → Your defaults，或直接「Set current pills as default」，把提示词栏中的当前参数存为默认（官方称此需求「上过两次 up next，终于来了」）；三是 Create Feed 大改版——全宽 masonry 瀑布流，提示词与按钮改为 hover 显示，视频恢复 hover 播放，项目 feed 可切换 Grid/List 视图、就地 Organize 模式，Archive 展示跨项目完整库；四是编辑——方向键在编辑历史中平滑移动，参考图上传失败会说明原因，编辑器支持 v8.1 与 v8.2 的 edit 类型，编辑画布可跑 HD；五是多语言——上周进入 alpha 的韩语支持现已对 midjourney.com 全量用户上线，并开放登记以扩展到更多语言；六是 UP NEXT 明示下一步是「更好的协作方式」与「更多移动端改进」。

配套的行业口径（同窗口内可读来源）：截至 2026 年 9 月，Midjourney 仍无通用 iOS/Android 独立 app（仅有动画向 niji・journey），仍无第一方生成 API，且 Discord 免费试用自 2023 年起未恢复。上述三条均为第三方指南类来源，非公司披露。

战略上，Midjourney 继续走「封闭式产品体验 + 无 API」路线，把价值锁在自家 Web 与 Discord 前端与订阅制内。本周更新几乎全部是可用性、工作流打磨（样式预览、默认参数、Feed 与 Archive 导航、编辑器历史），而非模型能力跃迁——此前 v8.1 与 v8.2 alpha 已在 2026 年上线。这说明其竞争策略是提高创作留存与迭代速度，而不是对外做平台化集成。产品与市场层，产品面持续向「专业创作者工作台」靠拢（Styles 体系、Profile/Featured 标签、样式详情页、项目自命名、跨项目 Archive）；渠道面则明显收缩：无独立移动 app、无生成 API，意味着企业侧批量生产与自动化集成基本被让给 Runway、OpenAI、Google 等有 API 的对手；本周新增韩语全量支持是这类公司少见的「增长型」动作，指向非英语市场的订阅扩张。资本与组织侧，本周未见融资、估值、并购或高管变动披露。

风险有三条：一是分发与集成风险——无第一方 API 使 Midjourney 难以进入企业软件流水线（如营销自动化、CMS 批量出图），在「AI 媒体进入企业工作流」的大趋势下，这部分预算会被有 API 与治理能力的供应商拿走；二是竞争加剧——图片与视频生成赛道被 Google（Nano Banana Pro 等）与 xAI（Grok Imagine）等通用厂商的模型直接冲击，第三方对比内容本周集中出现；三是合规与版权——第三方指南强调其团队版与企业合规能力是其增长瓶颈之一（第三方观点，非公司披露）。

来源：更新日志见 [Midjourney 官方更新日志](https://updates.midjourney.com/alpha-changelog-9-23-26/)（2026-09-23/24，全文已读）；无通用移动 app 与 Discord 免费试用未恢复见 [krea.ai 指南](https://www.krea.ai/blog/is-midjourney-free-pricing-video-and-free-alternatives-in-2026)（2026-09-21，第三方指南）；仍无第一方生成 API 见 [tech-insider.org 对比](https://tech-insider.org/au/midjourney-vs-nano-banana-pro-vs-grok-imagine-2026/)（2026-09-22，第三方对比）。营收、订阅用户数与估值：未公开。

影响判断：Midjourney 本周展示的是一种「不集成也能活」的路径依赖：靠产品手感与社区留存做订阅生意。对做解决方案的从业者意味着，凡是需要把生成能力嵌入企业流程（批量素材、审核链、权限与审计）的场景，Midjourney 目前基本不在候选内，除非其未来开放 API。下一步看 UP NEXT 提到的「协作」是否意味着团队级权限与工作区能力，以及是否终于推出移动端或 API。

### Perplexity

本周窗口内未取得可核实的新增动态，按静默记录并附完整核验范围。核验过程与结果如下：一是官方博客索引可读的最新条目为 2026-09-09（Q2D-Web 检索基准）、09-07、09-04、09-01（Hybrid Compute on Mac 与 Apple Silicon 端侧推理），均早于本窗口；直接抓取该页返回 403（Cloudflare），改用第三方检索取得索引内容。二是开发者论坛 Announcements 板块最新条目为 2026-09-16（Search SDK cookbook），亦在窗口外。三是多提供商检索（含新闻主题、周时间范围与起始日期过滤）未返回 9 月 18—24 日的权威新增事件。

保留以下背景（非本周）：Nvidia 洽谈投资、估值超 $30B——The Information 于 2026-08-23 报道，Reuters 与 Business Times 于 2026-08-24 跟进，公司拒绝评论，截至本窗口仍未见完成的官方公告；年化收入超 $750M（2026 年初低于 $250M），增长主要由 Perplexity Computer 驱动，同源为 The Information 转述；基础设施合作——2026-09-15 与 Crusoe 的多年度合作（训练用 GB300 NVL72 集群加托管推理，Crusoe 采购 1,800 席 Enterprise Pro/Max），早于窗口 3 天；Perplexity Computer 企业化与 Comet Enterprise 安全集成（CrowdStrike Falcon 可选安全层，2026-03 公布）；CEO Aravind Srinivas 表示计划 2028 年 IPO。

战略上，主线仍是「从答案引擎转向 agent 平台」——Perplexity Computer 作为跨工具的编排层、Comet 作为分发入口、Local/Portable Computer 作为本地化与成本对冲（背景，非本周）；企业侧靠 MCP 连接器（Intuit、Apollo 等）把外部 SaaS 拉进自己的编排层。产品与市场层，企业产品线已有清晰价格梯度（Enterprise Pro 约 $40/席/月、Enterprise Max 约 $325/席/月，第三方定价整理）；客户包括 Tech Mahindra 销售组织、CoreWeave、Crusoe 等（多为互为客户或生态型合作）；月提问量披露为 15 亿以上（公司口径）。本周无新客户或产品披露。资本与组织侧，本轮窗口内未见新融资或条款更新；估值锚仍为 2026-01 的约 $22.6B（Series E-6）与市场流传的 $30B+ 洽谈口径；Nvidia 若入股被解读为「生态锁定 + 算力变现」双重动机（第三方分析）。

风险有三条：一是模型依赖与议价风险——自身无前沿模型，收入增长依赖第三方模型成本曲线与供应条款；二是内容版权与法律风险——面对 Amazon、Reddit 等主体的诉讼与停止访问要求（背景，非本周），Comet agent 的内容获取方式是持续争议点；三是估值与收入倍率偏高——$750M 年化对 $30B 约为 40 倍销售额，公开市场容忍度更低（第三方测算）。

来源与关键数据：年化收入与 Nvidia 投资洽谈见 [Reuters](https://www.reuters.com/technology/nvidia-discusses-perplexity-investment-30-billion-plus-valuation-information-2026-08-24)（2026-08-24，背景）；Crusoe 合作见 [Crusoe 新闻室](https://www.crusoe.ai/resources/newsroom/crusoe-perplexity-partnership)（2026-09-15，背景）；官方博客条目日期见 [Perplexity 官方博客](https://www.perplexity.ai/hub/blog)（索引经第三方检索取得，直连 403）；企业定价见 [tech-insider.org](https://tech-insider.org/perplexity-vs-chatgpt-vs-gemini-2026)（第三方整理）；估值锚见 [Tracxn](https://tracxn.com/d/companies/perplexity/__V2BE-5ihMWJ1hNb2_u1W7Gry25JzPFCBg-iNWi94XI8)（背景）。本周窗口内官方发布、融资与客户动态：本次未取得。

影响判断：Perplexity 的静默本身是一个信号：在 Nvidia 投资窗口与 $30B 估值叙事悬而未决时，公开动作节奏明显放缓。对方案从业者的含义是，Perplexity 作为「多模型编排 + 本地化执行」的双轨供应商仍值得跟踪，但其供应链（模型与算力）不是自有，任何企业方案都应准备第二路线。下一步看 Nvidia 入股是否官宣、IPO 时间表是否更新，以及 Comet 与 Computer 在企业安全与审计能力上是否给出可验证材料。

### Mistral AI

2026-09-23，法国 Mistral AI 确认收购巴黎生成式 AI 广告视觉初创 Pimento，这使其 2026 年收购数达到三起（另两起分别指向云基础设施与工业工程方向）。L'Informé 当日首发、AFP 随后证实；Mistral 对价格仅表述为「数百万欧元」，未给精确数字，两家媒体在对价口径上存在分歧；Pimento 现有广告工具与客户关系如何处置尚未明确。

同日另一条：欧洲空间局（ESA）与 Mistral 加强合作。ESA 公告称，双方合作意向书由 ESA 总干事 Josef Aschbacher 与 Mistral CEO Arthur Mensch 于 2026-09-16 在巴黎签署，ESA 于 9 月 23 日对外发布；合作建立在既有项目之上，包括面向工程活动的安全 AI 助手 Orbit 与由 ESA Φ-lab 与欧洲伙伴开发的 EVE（Earth Virtual Expert）地球观测专用能力。该条标注为「签署窗口前、公告窗口内」。

背景（非本周，均为窗口外，用于判断节奏）：9 月 8 日 Samsung Electronics 领投 €3B 融资、Mistral 投后估值超 €21B（约 $24B），并同步与三星建立战略合作，把 Mistral Large 等部署到三星半导体业务的本地化与私有 AI 栈；9 月 10 日与 Cloudera 合作，把 Mistral 前沿模型接入 Cloudera 混合数据平台，支持公有云、私有、本地与完全气隙（air-gapped）部署；9 月 13 日 Le Chat 修复一个「混淆提示词」导致的数据外泄漏洞（Mistral 变更日志称无用户受影响、无数据外泄）；9 月 15 日与 TotalEnergies 启动三年、超 €100M（约 $115M）的前沿模型联合项目，面向油气勘探与储层工程，结合近 10 petaflops 数据与「近一个世纪」的地质专业积累。

战略上，Mistral 在走「欧洲主权 AI 全栈」路线：一手抓主权算力与部署形态（与 Cloudera 的气隙部署、与 Samsung 的私有栈、Schwarz 与 STACKIT 类生态），一手抓垂直行业模型（能源地质、航天对地观测），并用小额收购补营销、广告与工程能力。Pimento 属于面向消费与品牌侧的生成式内容补位，是其从「企业模型供应商」向「行业应用加内容生产」延伸的信号。

产品与市场层，商业化主要靠大额联合开发与平台合作（TotalEnergies 的 €100M+、Samsung 领投并采购、Cloudera 渠道），而非纯 API 订阅；这使收入更依赖少数大客户与政府、国企关系，合同期长但集中度高。主权部署能力（本地、私有、气隙）是其对美系云厂商的主要差异化。资本与组织侧，9 月 8 日 €3B（Samsung 领投，投后超 €21B）已完成，估值与 2025 年 9 月 Series C 约 €11.7B 相比接近翻倍；本周无新融资披露。Pimento 为小额并购（对价「数百万欧元」），组织影响面小，但收购数累积到三起，显示其以并购补产品线的节奏在加快。

风险有三条：一是安全与信任风险——Le Chat 的提示词注入导致外泄漏洞（已修复）会直接影响其面向政府、航天与能源的「主权可信」叙事，客户会追问修补时效与审计证据；二是客户集中与交付风险——长周期联合研发项目（如油气地质模型）价值确认慢，成果可控性差；三是合规与出口——主权定位使其必须在欧盟 AI 法案与美国出口管制之间同时合规。

来源与关键数据：Pimento 收购与对价口径见 [cryptonomist.ch](https://en.cryptonomist.ch/2026/09/23/mistral-ai-acquisition-pimento)（2026-09-23）；ESA 合作签署与公告日及 Orbit、EVE 项目见 [aeromorning.com](https://aeromorning.com/en/esa-and-mistral-boost-cooperation-on-artificial-intelligence)（2026-09-23）；€3B 融资（Samsung 领投）与投后超 €21B 见 [Samsung 官方新闻室](https://news.samsung.com/global/samsung-and-mistral-ai-announce-strategic-partnership-for-intelligence-driven-semiconductor-infrastructure)（2026-09-09，背景）；TotalEnergies 三年项目超 €100M 与近 10 petaflops 数据见 [TotalEnergies 新闻室](https://totalenergies.com/newsroom/totalenergies-annonce-un-partenariat-avec-mistral-en-vue-de-developper-des-modeles-de-frontiere-dintelligence-artificielle-dediees-a-lexploration-et-a-lingenierie-des-reservoirs-498514?lang=eng)（2026-09-15，背景）；Cloudera 合作（含气隙部署）见 [Mistral 官网](https://mistral.ai/news/mistral-x-cloudera)（2026-09-10，背景）；Le Chat 漏洞修复见第三方整理（2026-09-13）。ARR、营收与 Pimento 精确对价：未公开或本次未取得。

影响判断：Mistral 本周两个动作（收购广告视觉团队与航天合作扩大）说明欧洲主权 AI 正在从模型层往下沉到行业应用与内容生产，并进一步依赖国家与国企级客户背书。对搭方案从业者意味着：如果项目需要数据不出境、气隙部署，Mistral 目前是少数给出完整部署形态（公有云、私有、本地、气隙）的模型供应商；但安全事件响应能力需在采购流程中明确验证。下一步看 Pimento 的整合方向（是否形成自有广告内容产品线）与 €3B 的实际投向披露。

### Glean

2026-09-22，Futurum Group 发布分析：Glean 宣布扩展金融服务业 MCP 生态，突出 Glean Assistant 借助企业上下文在受监管行业落地的能力——目标是让金融机构把 AI agent 与 AI 原生工作流用于真实运营场景（合规、风控、生产力），而不是停在试点。Futurum 的解读重点是「AI 助手能否从风险项变成合规资产」，并指出微软、Google 与行业垂直厂商都在同一空间发力，但少有针对受监管环境的深度上下文整合。

背景（非本周，用于估值与收入锚）：Glean 2026-05-28 宣布 ARR 突破 $300M，距其达到 $100M ARR 仅 15 个月；最近一次一级市场估值为 $7.2B（2025-06 的 $150M Series F，Wellington 领投）；2026 年内已完成首起收购（Aryn），并披露平台累计 2.5 亿次 agentic action（2026-01 口径）；销售叙事已从「企业搜索」转向「为 AI 提供上下文、并借此压低客户的 AI token 账单」。

战略上，Glean 的定位阐述已明确转向语境或上下文层：先做 Enterprise Graph 与权限感知检索，再在其上做 Assistant 与 Agents，并新增 AI Gateway（2026-07 上线）做模型入口治理、Glean Protect 做受限话题策略，以及上下文感知的 AI 威胁检测（标注即将推出）。这等于把自己放在「企业 AI 的中枢网关」位置，与模型厂商形成互补而非替代。产品与市场层，已披露客户包括 Databricks、Reddit、Pinterest、Samsung；定价强调 SaaS 订阅而非按 token 计费（管理层表述），并以「减少 AI 账单」作为卖点——在客户普遍压缩 AI 预算的环境下，这是一个较强的采购理由。本周金融服务业生态扩展把 MCP 连接器路线继续推向受监管行业。资本与组织侧，本周无融资或估值更新；历史锚点为 $7.2B 估值、累计融资约 $765M、二级市场有活跃交易、尚未递交 IPO。

风险有三条：一是平台型竞争——Microsoft 365 Copilot、Google Gemini for Workspace、Amazon Quick Suite 把类似能力打包进既有办公套件，独立厂商必须持续证明「跨平台、模型中立、上下文更深」的价值；二是变现结构风险——强调「帮客户省 token」在为客户省钱的同时，也可能限制自身随用量增长的收入弹性；三是企业级安全期望——金融客户要求可审计、可解释的权限边界，而 Glean 的威胁检测仍处于即将推出状态，能力尚未完全交付。

来源与关键数据：金融服务 MCP 生态扩展见 [Futurum Group](https://futurumgroup.com/insights/can-gleans-financial-services-push-make-ai-assistants-a-compliance-asset-not-a-risk)（2026-09-22）；ARR 超 $300M 见 [BusinessWire](https://www.businesswire.com/news/home/20260528505530/en/Glean-Surpasses-%24300M-ARR-Unrivaled-Enterprise-Context-Fuels-AI-Adoption)（2026-05-28，背景）；估值与 Series F 见 [CNBC](https://www.cnbc.com/2025/06/10/glean-gen-ai-search-startup-raises-150-million-at-7-billion-value.html)（背景）；2.5 亿次 agentic action、累计融资与首起收购见 [biggo 财经](https://finance.biggo.com/news/qwucaZ4B6tLPsnrZ9TnB)（背景）。本周客户数、单价与新增融资：本次未取得或未公开。

影响判断：Glean 本周的动作是把「上下文」卖给受监管行业——这是企业 agent 竞争中最不易被模型能力直接吞掉的位置，因为权限、图谱与治理需要长期集成积累。对做解决方案的从业者意味着：在金融、保险、医疗客户处，agent 项目的门槛已从模型选型前移到权限感知检索与可审计执行，与客户既有 IAM/DRM 打通的能力，往往决定方案能否过合规评审。下一步看 MCP 生态的金融连接器名单与上线节奏、AI Gateway 的正式 GA 时间，以及是否出现与其 $7.2B 估值相匹配的新融资。

### Scale AI

2026-09-22（Google Cloud Summit Doha 当天），Scale AI 与 Google Cloud 联合发布参考架构：在 Google Cloud 上运行 Scale 生成式 AI 产品组合（SGP），并与 Gemini Enterprise 集成。架构要点：agent 在 SGP 中开发与评估，部署在客户自己的 Google Cloud 项目内、使用客户的 VPC 与自有加密密钥；同一 agent 既可经专用业务应用暴露，也可在 Gemini Enterprise 中被员工发现与使用，无需重建底层逻辑；互操作采用 A2A 与 MCP，配 Agent Registry 做发现；prompt 安全、网络安全、审计与支出控制交由 Google Cloud 既有治理框架，Scale 提供开发、编排、部署、评估、tracing 与人工复核，并强调其行业专家、阿拉伯语等语言支持与「上线后仍在场」的交付团队；官方给出的落地方法学是「先选一个有明确 owner、有可衡量结果的用例」。Scale 官方页未直接标注发布日，日期由同页「Today, at the Google Cloud Doha Summit」与同窗口内多方日程（Doha Summit 于 2026-09-22 举行）确认为 2026-09-22。

背景（非本周，用于判断公司现状）：Scale 2025-06 获 Meta 投资（估值超 $29B，Meta 持少数股权），创始人 Alexandr Wang 转任 Meta 首席 AI 官；其后经历裁员（约 14%）与客户侧「中立性」担忧（Google 计划转移主要数据标注合同）；2026-05 报道称 Scale 拿到五角大楼 $500M 合同（为 2025-09 的 $100M 的数倍），公共部门成为其增长支点；2025-11 曾在 NGA「SEQUOIA」数据标注（上限 $708M）竞标中输给 Enabled Intelligence 并提出抗议，未获支持。

战略上，Scale 的叙事已从「数据标注」转向「企业/政府 agent 的生产化交付」——参考架构加评估、人工复核与交付团队，卖的是「把试点变成可运维系统」的方法与人员，而不是算力或模型。选择与 Google Cloud 联合发布并绑定 Gemini Enterprise，是在自身模型能力缺位的情况下借渠道与治理栈进入企业 agent 采购。产品与市场层，SGP 覆盖 agent 开发、编排、部署、评估、tracing 与人工复核；差异化点是沙箱与私有部署加领域与语言纵深（阿拉伯语、中东北非交付经验），很适配中东与受监管行业；收入结构上，公共部门（美国国防部与 NGA 体系）与私营大客户并行，但单一客户流失风险此前已显现。资本与组织侧，本周无新融资、估值或人事披露；Meta 投资后的一级市场估值锚仍为 $29B+，而二级市场交易曾出现 $9B–$15B 区间的折价（媒体引述平台方，背景，非本周）。

风险有三条：一是战略独立性风险——Meta 持股使其在竞品（尤其 Google、OpenAI 等）处的「数据中立」疑虑难以彻底消除，本周与 Google Cloud 的深度合作与 Google 此前「计划切走 Scale」的报道并存，说明关系正在被重新建立但仍脆弱；二是合规与安全——为政府与情报客户做数据标注与 agent 部署，需持续承担安全与出口合规责任；三是竞争——数据标注侧被 Surge、Mercor 等低价高质对手侵蚀，agent 交付侧又要与系统集成商和模型厂商直销正面竞争。

来源：参考架构与架构要点见 [Scale AI 官方博客](https://scale.com/blog/deploying-enterprise-ai-agents-with-scale-and-google-cloud)（发布日 2026-09-22，全文已读）；日期佐证见 [Google Cloud 活动页](https://cloud.google.com/events/)；Meta 投资与估值见 [Scale AI 官方博客](https://scale.com/blog/scale-ai-announces-next-phase-of-company-evolution)（背景）；五角大楼合同与 NGA 竞标见 [Forbes](https://www.forbes.com/sites/aliciapark/2026/05/06/pentagon-hands-meta-backed-scale-ai-500-million-contract-5-times-last-years-deal-report-says) 与 [Washington Technology](https://www.washingtontechnology.com/contracts/2025/11/enabled-intelligence-books-708m-data-labeling-contract/409781)（背景）。本周新客户、合同金额与营收：未公开或本次未取得。

影响判断：Scale 本周交出的不是模型而是部署模式，这反映出 agent 生意的瓶颈已从「能力」转到「能不能被企业运维与审计」。对做解决方案的从业者意味着：可复用的资产正在变成参考架构、评估集与人工复核流程这类工程化交付物，绑定云厂商治理栈（VPC、密钥、审计、支出控制）比自己造一套更易过审。下一步看该架构是否有公开的客户落地案例与可量化结果，以及 Scale 在 Google 与 Meta 双重关系下的客户结构是否继续分化。

### Anysphere / Cursor

2026-09-23，行业简报 Renascence 报道：OpenAI 已通知 SpaceX，拟终止让 Cursor 访问 OpenAI 模型的合同，拟定切断日期为 2026-11-12。该报道称 OpenAI 在解释性博客中援引的理由是「与 Musk 关联实体的合同违约模式」（列举 Twitter 被收购后的条款争议，以及 Musk 在宣誓证词中承认 xAI 违反 OpenAI 服务条款），并将其定性为直接后果，而非围绕 Cursor 产品本身的技术或商业争议；同时提到这是在 Musk 与 OpenAI 长期诉讼的更大背景下发生的。取证边界需强调：本刊未直接读取 OpenAI 官方博客全文，该主张目前为单一二手来源，按证据分级限述为「据该报道」，且未见 Cursor/Anysphere 或 SpaceX 的公开回应。

背景（非本周）：Cursor 母公司 Anysphere 的 $60B 全股票被 SpaceX 收购于 2026-06-16 宣布、据多方报道 2026-08-14 完成交割（此前曾洽谈 $50B 估值新轮，被并购取代）；公司此前为 $29.3B 估值（2025-11 Series D，$2.3B，Accel、Coatue 等）；收入口径为 ARR 超 $1B（2025-11 披露）、约 $2B（2026-02），媒体转述更激进口径达约 $4B（引述 Reuters，未经公司确认）；企业侧此前披露超过半数 Fortune 500、50,000+ 企业客户（2026-03）与 100 万+ 付费用户。

战略上，公司已从「独立多模型 AI 编辑器」变为巨型企业子部门。模型供应多元化（自研 Composer 系列加多家前沿模型 API）是其过去的核心卖点，而本周事件直接冲击这一卖点；对 SpaceX 而言，Cursor 是「企业 AI 工具 + 分发」资产，如何与自家 xAI 模型协同将成为后续战略主线（尚无公开方案）。产品与市场层，需求侧仍然强（企业客户占比过半、付费用户规模大），但供应侧可选性收窄意味着成本与路线选择权减少；对客户而言，多模型可切换从「产品能力」变成「需被重新谈判的风险项」。资本与组织侧，本周无新增融资或组织披露；$60B 并购是 AI 应用层迄今最大交易之一，估值对标约 $2B ARR 约 30 倍（若按 $4B 口径约 15 倍），远高于公开市场同类软件公司倍数。

风险有四条：一是供应商集中与合同风险（本周核心）——模型访问是合约权利而非永久能力，所有权变更即可触发退出条款，客户被动承受迁移成本；二是关联方与治理风险——被并入 SpaceX 后，其模型供应关系被卷入 OpenAI 与 Musk 之争，商业决策不再仅由产品指标决定；三是竞争——GitHub Copilot（微软生态捆绑）、Claude Code（Anthropic 自有模型加终端形态）与 Devin 等同时挤压；四是估值与整合风险——$60B 全股票对价依赖母公司股价，交割后整合与人才留存的执行力待观察。

来源：模型访问报道见 [Renascence](https://www.renascence.io/news/77027/openai-ends-cursors-model-access-after-spacex-acquisition)（2026-09-23，二手来源，限述）；SpaceX 收购与估值背景见 [valueaddvc.com](https://valueaddvc.com/blog/cursor-ai-valuation-how-a-code-editor-became-a-9b-company)（第三方整理，背景）；Series D 与 ARR 超 $1B 见 [CNBC](https://www.cnbc.com/2025/11/13/cursor-ai-startup-funding-round-valuation.html)（背景）；ARR 约 $2B 与企业客户占比见 [Inc.](https://www.inc.com/chloe-aiello/this-vibe-coding-startup-just-hit-2-billion-in-annualized-revenue-can-it-keep-up-the-growth/91311249)（背景）；企业客户与付费用户规模见 [The Next Web](https://thenextweb.com/news/cursor-anysphere-2-billion-funding-50-billion-valuation-ai-coding)（背景）。Cursor 或 SpaceX 对本周事件的官方回应：本次未取得。

影响判断：本周事件把「模型访问是合同、不是资产」这件事变成了可见的企业风险，且直接落在拥有数十万企业用户的头部应用上——对搭方案者意味着，任何依赖单一模型供应商的产品设计都需要在第一版就内置切换能力与合规替代路径。对 AI 应用层的更广泛启示是：当上游既是供应商又是竞争对手时，所有权变动会迅速转化为供应链事件。下一步看 OpenAI 是否发布正式公告、Cursor 如何回填模型缺口（自研 Composer、xAI 或其他厂商），以及企业客户是否因此启动多工具并行策略。

### Cohere

2026-09-22，加拿大 TD 银行集团公告：向 AI 研发与采用投入三年最高 $25M 的初期投资，具体由 TD 旗下 AI 研究机构 Layer 6 与 Cohere 开展战略协作——把 Cohere 的安全企业级模型与技术专长，与 Layer 6 的应用研究与对 TD 业务的深度理解结合，探索在银行内落地高价值 AI 应用；重点方向为知识管理（强调实用价值、安全与负责任采用）。Cohere 将派专职专家团队与 Layer 6 在 MaRS Discovery District 同址工作，靠近业务团队识别与开发用例。TD 方面由执行副总裁兼副董事长（战略增长、创新与合作）Rizwan Khafan 表态；Cohere 首席财务官 François Chadwick 出席表态。该投入属于 TD 对加拿大经济关键领域五年 $150B 承诺框架内的一部分。

背景（非本周，用于融资与估值锚）：2026-09-16 Cohere 与德国 Aleph Alpha 签署最终合并协议（比本窗口早 2 天），合并后以 Cohere 名义运营、多伦多与柏林双总部，Aleph Alpha 海德堡办公室转为研究中心，员工总数超 1,000 人；合并实体估值约 $20B（约 €17.34B），Lidl 母公司 Schwarz Group 出资 €500M（约 $600M）并推进其 STACKIT 主权云承载；交易仍需监管批准，预计年内完成。Cohere 2026-02 前后披露 ARR $240M；官网口径累计融资约 $1.6B（Nvidia、AMD Ventures、Salesforce Ventures、Oracle、Cisco 等战略投资方）。

战略上，Cohere 押注主权 AI：模型可部署在公有云、私有本地乃至完全气隙环境，客户保留数据与智能控制权；并购 Aleph Alpha 补齐欧洲语言与政府及 Mittelstand 关系，Schwarz 与 STACKIT 提供算力与锚定客户。TD 类合作则是「银行内联合实验室」模式——用少量资金换真实场景与内部推广路径。产品与市场层，产品线包括 Command 系列基础模型（Command A+ 为 218B MoE、单步激活约 25B，Apache 2.0 许可；第三方平台标价约 $0.30/百万输入、$1.50/百万输出 token）、North agentic 平台（含 North Mini Code，可在单张 H100 上运行），以及面向政府与受监管行业的部署方案；客户与渠道集中在金融、公共部门与电信，且以「数据不出境」为采购前提。资本与组织侧，本周无新融资披露；组织上本周对外可见的是 TD 项目投入的专职团队配置。合并后治理安排：Aidan Gomez 任 CEO，Aleph Alpha 联合 CEO Ilhan Scheer 任 COO，Aleph Alpha 联合首席研究官 Samuel Weinbach 任 CRO（均在交易完成后生效）。

风险有四条：一是合并执行与监管风险——交易尚待批准，两国政府背书不等于无摩擦；二是规模差距——$20B 估值与美系前沿实验室差距显著，需靠可控部署与行业纵深而非通用能力取胜；三是收入体量与集中度——ARR $240M（2026-02 口径）支撑 $20B 估值倍数很高，客户以政府与大企业为主，单个项目延期对收入曲线影响明显；四是竞争——微软与 Google 的政府与主权云方案、Mistral 等欧洲同行在同一标的内竞争。

来源：TD 项目与金额见 [TD Stories 官方新闻](https://stories.td.com/ca/en/news/2026-09-22-td-announces-2425-million-strategic-relationship-with-cohere)（2026-09-22，全文已读）；合并协议与估值背景见 [Reuters](https://www.reuters.com/legal/transactional/cohere-aleph-alpha-combine-target-enterprise-ai-market-2026-09-16)（2026-09-16，背景）；治理安排见 [PR Newswire](https://www.prnewswire.com/news-releases/cohere-and-aleph-alpha-sign-agreement-to-become-the-first-transatlantic-sovereign-ai-solution-302880732.html)（背景）；Command A+ 定价见 [OpenRouter](https://openrouter.ai/cohere/command-a-plus)（第三方平台标价）。本周新增融资与估值更新：未公开或本次未取得。

影响判断：Cohere 本周拿到的是一家北美前六大银行的三年期合作，金额不大（最高 $25M）但性质重要——它把「主权 AI」从政府与零售集团延伸到大型银行的知识管理与负责任采用场景，并以「专职团队驻场」换取场景话语权。对做解决方案的从业者意味着：金融机构的 AI 采购正在通过研究与业务联合体推进，供应商能否派团队进入客户场内、并接受客户自持密钥与气隙约束，比模型排名更能决定中标。下一步看合并交易的监管批准与 STACKIT 上首个生产级客户案例，以及 North 平台在银行场景的付费扩容迹象。

### Cognition / Devin / Windsurf

2026-09-22，Cognition 官方博客发布《Building the Future of Software Engineering in Latin America》：公司在拉丁美洲扩张，首站圣保罗（São Paulo），官方称此举建立在其与拉美最大银行、消费品牌与科技公司多年的合作基础上。这是本期窗口内该公司的唯一条目——官方博客时间线显示 9 月 18—24 日仅此一条对外发布。

背景（非本周，构成估值与能力基线）：2026-09-08 Cognition 宣布 Series E：融资超 $2B、估值 $48B，由 Andreessen Horowitz 与 Accel 领投（对比 2026-05 Series D 的 $1B、$26B 估值，四个月内估值近乎翻倍）；9 月 10 日发布 SWE-2 编程模型（公司称在 FrontierCode 1.1 上达到 50.0%，推动能力与成本前沿）并同日宣布 Dioxus 团队加入；9 月 15 日与 AWS 签署多年战略合作协议，目标是把自主工程 agent 推进生产环境、加速遗留工作负载迁移上 AWS。其他背景：2025-07 收购 Windsurf（约 $3B 报道口径；带来约 $82M ARR、350+ 企业客户与数十万日活），2026-06-02 将 Windsurf 更名 Devin Desktop（IDE 品牌退场），此前 Devin 累计收入口径为约 $492M 年化（2026-05 报道），公司称其自有代码提交中 89% 由 Devin 完成；产品进入 FedRAMP High In-Process，并与 Palantir FedStart 合作面向 IL4/IL5/ITAR 客户，合规面在同类中较强。

战略上，Cognition 的路径是「自研模型 + 自有 harness + 自有 IDE 与桌面 + 全球本地化」的垂直整合，用自训模型（SWE 系列）压低单位成本以支撑按结果与按席位混合的定价，并把销售与交付团队铺到区域市场（新加坡、伦敦、日本、圣保罗）。拉美扩张是「跟随客户与人才」的典型动作——其新客户中有大型银行，圣保罗布局同时服务交付与招聘。产品与市场层，产品面已形成四层：Devin Cloud（自主 agent）、Devin Desktop（原 Windsurf IDE）、CLI、Review；并有「AI Productivity Guarantee」（若 Devin 交付价值低于客户付费，公司补足用量，上限 $10M，2026-06 推出）这类结果承诺式定价，对采购方降低试错成本。资本与组织侧，Series E 为 $2B+、$48B 估值（2026-09-08），四个月估值翻近一倍；2026 年内并购与人才吸收频繁（Windsurf、The Interaction Company、TierZero、Dioxus 团队）；本周无新增资本或人事披露。

风险有四条：一是估值与兑现速度——$48B 对约 $492M 年化收入（2026-05 口径）约 100 倍，需持续数倍增长兑现；二是产品品牌与客户迁移成本——Windsurf 品牌在一年内两度更名（Codeium→Windsurf→Devin Desktop），企业与开发者的长期采购稳定性需要重新建立（第三方企业迁移类内容已开始讨论合规认证连续性）；三是竞争——Cursor（已并入 SpaceX）、Claude Code、GitHub Copilot 在同一预算池；四是区域扩张的执行风险——多地同时开设实体团队会推高成本，而拉美银行客户的合规与数据本地化要求可能延长交付周期。

来源：拉美扩张见 [Cognition 官方博客 · Devin comes to São Paulo](https://cognition.com/blog/devin-comes-to-sao-paulo)（条目日期 2026-09-22）；Series E 见 [Cognition 官方博客 · Series E](https://cognition.com/blog/series-e)（背景）；SWE-2 与 Dioxus 见 [Cognition · SWE-2](https://cognition.com/blog/swe-2) 与 [Cognition · Welcoming Dioxus](https://cognition.com/blog/welcoming-dioxus)（背景）；AWS 合作见 [Cognition · AWS SCA](https://cognition.com/blog/aws-sca)（背景）；收入与 89% 代码比例见 [Tech Funding News](https://techfundingnews.com/the-ai-startup-replacing-software-engineers-just-raised-1b-at-26b-valuation-and-it-is-already-writing-89-of-cognitions-own-code)（背景）；Windsurf 收购与更名见 [TechCrunch](https://techcrunch.com/2025/07/14/cognition-maker-of-the-ai-coding-agent-devin-acquires-windsurf) 与 [Cognition · Introducing Devin Desktop](https://cognition.com/blog/introducing-devin-desktop)（背景）。圣保罗团队规模、当地签约客户数与投入金额：未公开或本次未取得。

影响判断：Cognition 本周的动作说明 AI 编程 agent 的竞争已从「模型跑分」转向「区域交付能力 + 资本厚度」：在四个月内把估值从 $26B 抬到 $48B 之后，它必须用地理扩张与云厂商合作（AWS）把收入曲线撑住。对做解决方案的从业者意味着：选择自主编程 agent 时，除能力外应重点看合规路径（FedRAMP、IL 级别、数据驻留）与区域支持实体，因为这类项目的失败原因通常是交付与合规而非模型质量。下一步看圣保罗之后的下一个区域落点、$48B 估值对应的新收入披露，以及 Devin Desktop 在更名后企业续约率的间接信号。

#### 本组格局变化

1. **共同主线：从「能力竞赛」切换到「可运维、可审计、可计价」的交付竞赛。** 本周有明确动作的企业中，真正的产品能力发布极少，绝大多数动作集中在计费结构（Runway 单池、Cognition 结果承诺、Sierra 结果计费）、治理与部署形态（Scale 与 Google Cloud 参考架构、Cohere 气隙部署、Glean 上下文与权限层）、资本与渠道（Harvey 第二交割、Cohere 与 TD、Sierra 与 Liberty Global、Cognition 与圣保罗）。应用层的差异化正从模型质量迁移到「谁能把 agent 送进企业生产环境并算清账」。
2. **资本层面出现两种极端并存的定价：垂直应用的高倍率与大平台的绝对规模同时被推高。** 一边是 Harvey（$400M ARR 对 $15.5B，约 39 倍）、Perplexity（$750M 年化对传闻 $30B+，约 40 倍）、Cognition（约 $492M 对 $48B，约 100 倍）这类 40—100 倍的私市场定价；一边是 Databricks（$7B 年化对约 $190B，约 27 倍）这类规模型平台。私募资金仍在为「垂直场景的确定性」与「平台级的可预测现金流」分别付费，但倍率差异意味着一旦增长斜率回落，垂直标的的估值调整空间更大。
3. **供应链与所有权风险第一次以「合同级事件」出现在头部应用身上。** Anysphere/Cursor 因被 SpaceX 收购而面临 OpenAI 于 2026-11-12 切断模型访问的报道（单一来源、需限述），叠加 Harvey 选择自训开放权重模型（Tenet）、Cognition 自研 SWE 系列、Mistral 走主权自部署——本周多条证据指向同一转向：下游应用正在把「模型自主权」当作与产品能力同级的战略项。对从业者的含义是：方案设计需默认「上游可能变成对手或断供」，多模型切换与自有小模型兜底将从加分项变成基础项。
4. **企业 agent 的采购主体正在上移，交付要求随之抬高。** Sierra 与 Liberty Global（集团级三年框架、覆盖约 8,000 万连接）、Cohere 与 TD（银行内联合团队、三年最高 $25M）、Scale 与 Google Cloud（客户自持 VPC 与密钥，加审计与支出控制）、Glean 的金融 MCP 生态，都指向同一模式：决策从部门级升到集团与机构级，标书里出现权限、审计、数据驻留、结果承诺等条款。这意味着中小型 agent 供应商的销售半径被压缩，而能与云厂商治理栈（Google、AWS、Azure）对接的能力成为准入条件。
5. **静默与缺口（诚实边界）**：Perplexity 本周窗口内未取得可核实的官方新增动态（官方博客最新为 9 月 9 日；论坛最新 9 月 16 日；多 provider 检索无窗口内权威事件），其最大变量（Nvidia 洽谈投资、超 $30B 估值）仍停留在 2026-08-23 的媒体报道状态；Midjourney 的可核验信息仅来自官方 changelog 与第三方指南，营收、用户与估值均未公开；Anysphere/Cursor 的模型断供主张仅有单一二手来源且未读原始公告；Scale AI 官方页未标注发布日，日期由同页活动表述与第三方日程交叉确认。以上均已在各条目标注，不影响其余条目成立。

## 算力、云、硬件与具身企业

本部分九家公司的动态集中在三个层面：资本市场对算力与具身的重新定价、交付与现金流的现实校正，以及供应链的迁移。

### AMD

2026-09-21（美东周一）AMD 股价收涨 8.4% 至 606.98 美元创历史新高，市值首次突破 1 万亿美元，成为继 NVIDIA、Broadcom、SK hynix 之后又一家进入万亿美元俱乐部的半导体公司，2026 年内累计涨幅约 187%（均来自二手行情与财经媒体）。

市场把涨幅主要归因于两条被反复引用的「订单」——OpenAI 最高 6 吉瓦 Instinct GPU 部署协议、Oracle 公开可用 5 万块 MI450 超算集群。但经核验，这两条均为 2025 年 10 月已公布事项，属背景、非本周；部分媒体在 9 月 21 日前后把它们写成本周新交易，属重复包装，本刊不予采用为本周交易。

AMD 官方新闻室可确证的窗口内动作均在技术与生态侧：9 月 21 日发布 ROSCon 2026 媒体预告（以高性能计算加开源软件支持机器人系统从云到边端的训练、仿真、部署）；9 月 18 日发布 EPYC 在 Agentic AI 栈各层定位的文章；9 月 24 日发布 Perplexity 基于 Ryzen AI Max 系列（含 Ryzen AI Halo 开发者平台）的 agentic PC 合作。另有两条边界信息：9 月 22 日有媒体称 AMD RX 系列 GPU 将导入 GDDR7 显存（转述，一线原文未读）；9 月 24 日股价在连续急涨后休整。信息边界：AMD 本周无财报或产品发布级官方公告落在窗口内，市值里程碑与订单独由行情与财经媒体承载，本次未取得公司公告原文。

战略上，AMD 的路线是从「卖单颗 GPU」转向卖整柜系统 Helios（72-GPU 液冷机架，MI450 系列加 Venice EPYC 与 Pensando「Vulcano」网络，UALink over UALoE，scale-out 对齐 UEC）；本周 ROSCon 预告把「物理 AI 与机器人」纳入其开放软件栈叙事，显示 AMD 想把 ROCm 生态从训练推理扩到具身训练、仿真、部署全链路。产品与市场层，本周无新品发布；叙事集中在 EPYC 在 agentic 栈各层的角色与 Ryzen AI Max 端侧 agentic PC 落地（Perplexity）。竞争位置仍是 AI 加速器的挑战者，资本市场本周用万亿美元市值给「第二供应商」定价。资本与组织侧，市值首破 1 万亿美元（2026-09-21）；本周无新增融资、并购、上市或高管变动披露。

风险有三条：一是里程碑由行情驱动，公司未披露任何本周新增订单或资本开支级合同；二是市场把 2025 年旧公告当本周新增，存在事件日期误读与预期透支；三是中国区 MI308 出货与出口管制仍是变量（背景，非本周）。

关键数据：股价 606.98 美元、单日 +8.4%、市值超 1 万亿美元、年内约 +187%（二手行情与财经媒体）；Oracle 5 万块 MI450 公开超算集群、MI450 单卡 432GB HBM4 与 20TB/s、Helios 单柜 72 GPU 与 1.4 exaFLOPS FP8、31TB HBM4（AMD 官方公告，2025-10-14，背景，非本周）；OpenAI 6 吉瓦（起步 1GW Helios，2026Q4 起）为 2025 年 10 月公布（背景，非本周）；本次未取得 AMD 本周任何官方订单金额、CapEx 与出货量。

来源：[AMD 官方新闻室](https://newsroom.amd.com/)（列表，2026-09-25 读取，含 9/18、9/21、9/24 三条窗口内条目）；[AMD ROSCon 2026 媒体预告](https://newsroom.amd.com/news/media-alert-amd-roscon-2026/)（9/21，正文被商标条款页遮挡，仅标题与摘要可读）；[whatledto.com](https://whatledto.com/events/amd-instinct-ai-gpus)（对 AMD 官方声明日期的逐条引用，用于纠正 Oracle 5 万卡订单的原始日期）。未能读到全文：CNBC 9/21、Benzinga 9/21、Yahoo Finance 与 TrendSpider 等（403 或 Cloudflare 拦截）。

影响判断：AMD 进入万亿美元俱乐部，说明市场已把「AI 加速器第二供应商」当成可定价的确定性而非概念；但本周它的官方动作全在软件、生态与机器人边缘侧，意味着 2027 年的增量叙事押在「整柜系统加开放软件栈」。下一步看 MI450 与 Helios 的实际交付节奏、Oracle 之外是否出现第二个公开超算客户、ROCm 在具身与机器人开发者社区的采用是否成形。

对搭方案与做解决方案的从业者：AMD 官方本周把「物理 AI」写进 ROSCon 议程，等于公开宣告机器人训练、仿真、部署这条链会有 ROCm 侧的官方支持路径；对今天被 NVIDIA 栈锁定的团队，这是两年尺度上值得提前评估的替代方案，但本周边界内没有可用的交付数据（无出货量、无客户名单、无价格），短期采购决策不应建立在本周的市值信号上。

### Broadcom

本周 Broadcom 唯一的实质事件在监管侧。2026-09-23（周三），Financial Times 报道并经 Reuters 与《经济时报》转述：中国国资委（SASAC）近数周在国家控股数据中心排查 Broadcom 交换机的部署规模，初步结论是部分设施中 Broadcom 交换机占比可高达 90%；SASAC 可能据此发出非正式指导，要求国资数据中心减少使用 Broadcom 交换机，作为北京「国产芯片国产用」行动的一部分。报道指出，NVIDIA 产品已被挡在国资数据中心门外，而 Broadcom 交换机仍大量在场；Broadcom 与 SASAC 均未回应，Reuters 表示无法独立核实该报道。

市场侧：9 月 22 日 Broadcom 收于 364.54 美元、+0.52%，同日 CNBC 出现 Outperform、575 美元目标价的卖方观点（二手转述）；CEO Hock Tan 上周接受 CNBC 采访反驳「AI 需求放缓」说法后股价盘后走强。

背景，非本周：Broadcom FY2026 Q3 财报发布日为 2026-09-02（公司 IR 公告确认），AI 相关收入 16.74B 美元、同比约 3.22 倍、环比 +54%（其中 AI 计算 12.22B、AI 网络 4.52B），管理层在电话会上称已锁定 FY2027 AI 半导体收入翻倍至 115B、FY2028 再翻倍至 230B，并称 Anthropic 将在 2027 年成为其最大 XPU 客户、OpenAI「Jalapeño」2027 年计划部署 1.3GW。这些均为窗口前已发生事实，不计入本周动态。本次未取得：中国区收入占比口径（Reuters 指出 Broadcom 无法识别其中国收入对应的设备去向）。

战略上，Broadcom 仍为「定制 XPU（ASIC）加以太网交换」双轮。本周无新增战略动作，但 SASAC 排查直指其在 AI 数据中心网络层的准垄断位置，中国业务从「默认选项」变为需要重新论证的选项。产品与市场层，交换机是它在中国最稳的一块；据报道中国国资数据中心里其交换机占比可达 90%。若非正式指导落地，受影响的是量而非单点产品。资本与组织侧，本周无融资、并购、上市或高管变动披露；股价 9 月 22 日收盘 364.54 美元、+0.52%。

风险三条：一是中国国产替代与监管风险显著上升（非正式指导即可改变采购默认值）；二是客户集中于 Google、Anthropic、OpenAI、Meta，四大客户资本开支节奏直接决定其 115B 与 230B 指引能否兑现（管理层指引，非本周）；三是中国区收入口径不透明，风险量化困难。

关键数据与来源：9 月 22 日收盘 US$364.54、+0.52% 为二手转述；CNBC Outperform 与 575 美元目标价为二手（2026-09-22）；SASAC 排查与占比可达 90% 见 [FT via Reuters 与《经济时报》](https://m.economictimes.com/tech/technology/china-surveys-broadcom-switch-use-in-state-data-centers-ft-reports/articleshow/134426619.cms)（2026-09-23，全文已读）；FY2026 Q3 财务背景见 [Broadcom 投资者关系](https://investors.broadcom.com/)（IR 页面，确认财报日 2026-09-02，背景）。未能读到全文：FT 原文（付费墙）与 investing.com 等。中国区收入占比：本次未取得。

影响判断：本周 Broadcom 的重点不是订单，而是「网络层国产替代」被官方排查坐实。交换机是它在中国最稳固的阵地，一旦 SASAC 发出非正式指导，损失不只在于收入，还在于它与国资数据中心绑定的生态位置；叠加 NVIDIA 已被禁入，中国 AI 数据中心的网络侧「双轨化」（国产交换加 UEC 或自研，对海外 Broadcom 以太网）会加速。下一步看 SASAC 是否发出成文指导、Broadcom 是否在 FY26 Q4 给出中国区口径。

对搭方案与做解决方案的从业者：交换层是本周被点名的环节——如果客户的交付地点涉及中国国资体系，交换机选型会率先被政策打断，方案里应预留国产交换与网卡的等价替换路径；海外侧 Broadcom 以太网仍是事实标准，UEC 生态的兼容性投入本周未发生变化。资本信号方面：Broadcom 本周股价近乎走平（+0.52%），说明市场把它当成「可控但需跟踪」的风险而非当期冲击；与 AMD 靠行情叙事冲到万亿美元相比，资金正在从确定性 ASIC 与网络龙头向 AI 加速器第二供应商的弹性轮动。

### CoreWeave

本周 CoreWeave 的核心是资本运作与定价权叙事两条线。融资方面：9 月 17 日公告拟私募发行 30 亿美元 2033 年到期可转换优先票据（初始购买人另有 5 亿美元选择权），9 月 18 日定价时上调至 37 亿美元，票面 2.875%、2033-04-01 到期；转股价按 9 月 17 日收盘价 79.88 美元溢价约 22.50% 设定（约 97.85 美元/股），上限看涨期权（capped call）价格上限 199.70 美元/股（较 9 月 17 日收盘溢价 150%）；预计 9 月 22 日交割，净募资约 36.4 亿美元（若选择权全额行使约 41.4 亿美元），其中约 4.988 亿美元用于 capped call 交易，余额用于一般公司用途。同一轮还设立了最高 3,500 万股 A 类普通股的 ATM 增发计划（9 月 17 日）。

运营与市场方面：9 月 23 日宣布第三次获 SemiAnalysis ClusterMAX 白金评级，为唯一在三轮评估中均获白金级的云厂商；同日另发布 Harell Data 选用 CoreWeave 为其生物科技数据集做安全训练与微调的公告。资本市场方面：9 月 24 日 JPMorgan 将 CoreWeave 上调至 Overweight（自 Neutral），理由是公司转向短期限合同后 GPU 算力定价能力更有利、可缓解市场对其重资产投入的担忧。另需注明：官方新闻室另有「新计算容量以更高价格签约」（9 月 17 日）与 Physical AI Field Engineering 服务（9 月 11 日前后）两条，均落在窗口外，作为背景不写入本周动态。本次未取得：公司就转股资金是否用于特定资本开支项目的逐项说明，以及三季度业绩（预计约 11 月 9 日发布）。

战略上，公司一边用可转债与 ATM 双通道补充长期资金，一边把合同结构往短期限、高单价方向调——JPMorgan 的升级逻辑正是「短约提高单位算力收入与议价能力」，这与它长期被质疑的「长约锁死加重资产折旧」叙事相反。产品与市场层，第三方独立基准（SemiAnalysis ClusterMAX 白金三连、MLPerf、Artificial Analysis 对 Kimi K2.6 推理速度与性价比的第一名）被用作差异化证据；客户侧本周新增 Harell Data。资本与组织侧，本周无高管变动披露。

风险三条：一是债务与稀释——一年多来可转债、ATM、设备融资叠加，转股价 97.85 美元与上限 199.70 美元的结构说明公司也在对冲稀释；二是算力价格周期——JPMorgan 的乐观前提是「短约仍能卖出高价」，一旦 GPU 供给放宽，价格第一个下行；三是客户集中与电力交付仍是结构性风险。

关键数据：可转债 37 亿美元、票面 2.875%、2033-04-01 到期、转股价约 97.85 美元（溢价 22.5%）、capped call 上限 199.70 美元、净募资约 36.4 亿美元（含选择权约 41.4 亿）、capped call 支出 4.988 亿美元、交割 9 月 22 日，均见 [CoreWeave IR · Prices Upsized $3.7 Billion Convertible Senior Notes Offering](https://investors.coreweave.com/news/news-details/2026/CoreWeave-Prices-Upsized-3-7-Billion-Convertible-Senior-Notes-Offering/default.aspx)（2026-09-18，全文已读）；白金三连见 [CoreWeave 官方新闻](https://www.coreweave.com/news/coreweave-becomes-the-only-provider-to-earn-semianalysis-platinum-clustermax-tm-rating-three-consecutive-times)（2026-09-23，全文已读）；评级上调见 [CNBC](https://www.cnbc.com/2026/09/24/buy-coreweave-as-it-leans-into-short-term-contracts-jpmorgan-says-.html)（2026-09-24，仅标题与摘要）；另见 [CoreWeave 官方新闻室](https://www.coreweave.com/newsroom)（列表，2026-09-25 读取）与 [longyield 复盘](https://longyield.substack.com/p/ai-compute-prices-are-soaring-why)（2026-09-19）。本次未取得：三季度营收与指引、具体资本开支与电力合约规模。

影响判断：本周 CoreWeave 把「AI 云值多少钱」从需求侧拉到资金成本侧：转股价 22.5% 溢价、capped call 上限 150% 溢价，并同时开 ATM，等于承认它需要持续融资但要把稀释锁在可承受区间。若「短约高价」被后续季度数据证实，neocloud 的重资产模型第一次有了定价权证据；若不能，这会反过来成为算力价格见顶的先行指标。下一步看约 11 月 9 日的三季度报告（合同期限结构、单 GW 收入）与后续可转债选择权是否被行使。

对搭方案与做解决方案的从业者：CoreWeave 主动把长约换成短约，意味着企业客户以后更容易签 1—3 年期的算力合同、但也更难拿到超低价——这降低了长期锁定的风险，代价是单位成本上升；若「短约高单价」成为行业惯例，方案里把推理成本按长期降价曲线来估算的做法需要重新校准。资本信号方面：可转债被超额认购至 37 亿（原计划 30 亿），说明公开市场对 neocloud 债务仍有承接力；但 4.988 亿美元的 capped call 支出与 ATM 计划并存，是「既要钱又怕稀释」的典型信号，算力租赁赛道的资金门槛本周被再次抬高。

### Oracle Cloud（OCI）

本周 Oracle 出现自 2025 年 Stargate 叙事以来最具冲击力的项目执行级事件。9 月 24 日，Bloomberg 首报并经 CNBC、Reuters、DataCenterDynamics 等转述：Oracle 向 Blue Owl Capital 旗下 Stack Infrastructure（Project Jupiter 开发商）发出 force majeure（不可抗力）通知，以期在项目未能于 2028 年如期启用时延迟或豁免自身付款义务；Oracle 对 CNBC 声明「Project Jupiter remains on our planned schedule」「我们完全致力于新墨西哥州并对前进路径有信心」，Blue Owl 拒评。

项目细节：位于新墨西哥州 Doña Ana 县，约 1,400 英亩、投资上限 1,650 亿美元、首期约 2.45GW 算力（远期设计约 4.5GW）；Oracle 是主要租户、OpenAI 是最终客户，Stack 与 BorderPlex Digital Assets 为开发方，约 20 家银行提供 180 亿美元建设贷款，该债务已跌至面值 90 美分以下；触发原因是新墨西哥州土地办公室两次拒绝 Energy Transfer 的天然气管道许可，把管道投运时间推迟近六个月至 2027-02-01。

市场反应直接：ORCL 当日盘中下跌约 4%（CNBC 收盘快讯口径，另有报道称跌 5%），为该项目供应最高 2.45GW 燃料电池的 Bloom Energy 同日跌近 6%。

第二条线是生态分发：9 月 24 日 Oracle 官方博客宣布把 Meta Model API 与 Muse Code 接入 Oracle Marketplace，让 Oracle 客户按既有采购流程获取 Meta 的 AI 能力；9 月 23 日 Oracle 官方发布澳大利亚幼教软件商 OWNA 基于 OCI Enterprise AI 构建 AI 日托智能平台的客户案例。

背景，非本周：Oracle Q1 FY27 财报于 2026-09-10 发布，总营收 193 亿美元（+30%）、云收入 116 亿美元（+62%）、单季新增 AI 云合同超 300 亿美元、RPO 达 6,640 亿美元，OCI 增速 121%（该稿本次仅经搜索摘要取得要点，未逐行读取原文）；九月版「What's New in Oracle AI」列出 OCI Enterprise AI 新增 Moonshot AI Kimi K3 导入、模型导入扩容（AI Singapore、Mistral、Google、阿里、NVIDIA、DeepSeek、Z.ai、小米等）、OCI Enterprise AI 进入美国政府云与国防云（Phoenix 区，B300 硬件）、NL2SQL 新增模型选择与后台 SQL 生成（官方博客，月度汇总，无单一日）。

战略上，Oracle 以自建的 GPU 云容量换取超大模型公司的长约（RPO 6,640 亿美元、Q1 新增 AI 合同超 300 亿），Project Jupiter 是这一模式最重的物理载体；本周发不可抗力通知，说明它开始为执行风险明牌定价，而不是无条件承接建设风险。产品与市场层，OCI 走「企业 AI 平台 + Marketplace 分发」路线：模型侧用 Kimi K3、Meta Model API 等多模型导入降低单供应商依赖，政企侧靠政府与国防云（B300）打开合规市场；OWNA 案例说明其客户在长尾行业软件商。资本与组织侧：180 亿美元建设贷款、债务跌破 90 美分、1,650 亿美元项目总投资（开发商口径，30 年）；Q1 FY27 的经营数据为背景；本周无新增融资与高管变动披露。

风险四条：一是项目执行与电力、许可——管道许可两度被拒、投运推迟至 2027-02；二是融资链条——项目债务跌破面值 90 美分，若 Stargate 体系内其他四个站点出现同类问题，风险会从 Oracle 溢出至 Blue Owl、SoftBank 与 OpenAI；三是资产负债表——据二级来源，Oracle 背负约 1,253 亿美元债务与 2,880 亿美元未起始数据中心租约（二级引用，未取得一手确认）；四是客户集中——OpenAI 既是最终客户又是信用风险源。

关键数据：Project Jupiter 约 1,400 英亩、投资上限 1,650 亿美元（30 年）、首期 2.45GW、远期约 4.5GW、180 亿美元建设贷款、债务跌破 90 美分、管道投运推迟至 2027-02-01、目标 2028 年启用（Bloomberg 经 CNBC、Reuters、DCD、El Paso Matters 等转述，2026-09-24 及历史报道）；ORCL 当日跌约 4%（[CNBC](https://www.cnbc.com/2026/09/24/stocks-making-the-biggest-moves-midday-orcl-p-meta-nbis-be.html)，2026-09-24，全文已读）；Bloom Energy 跌近 6% 与供货上限 2.45GW（同上）；Q1 FY27 经营数据见 [Oracle 官方财报发布页](https://www.oracle.com/news/announcement/q1fy27-earnings-release-2026-09-10/)（2026-09-10，背景，仅摘要）。本次未取得：Oracle 对不可抗力通知本身的官方书面说明（仅有对 CNBC 的口头声明转述）、项目债务具体发行条款与持有人结构。

影响判断：这是本周 AI 基建链条上分量最重的单条：它把「AI 数据中心不缺需求、缺的是电、许可和融资」从分析判断变成了具名合同动作。Oracle 主动发不可抗力通知，本质是在 6,640 亿美元 RPO 的资产负债表上给自己留一个免责窗口；一旦成例，其他 Stargate 站点与 neocloud 的融资成本都会被重估。下一步看新墨西哥州管道许可是否反转、项目能否在 2028 年前投产，以及 Oracle 后续季度是否披露该项目的减值或延期成本。

对搭方案与做解决方案的从业者：如果你在方案中把 OCI 的区域可用性或特定超大集群当作交付底座，本周提醒要把电力与许可类的物理风险写进交付假设与备选区域；Oracle 的政府与国防云（B300）与 Marketplace 多模型导入则是可用性上更稳的一条线。资本信号方面：AI 基建正从「信用扩张」进入「信用分层」阶段——同一批项目里，能拿到许可和电的资产仍被追捧，拿不到的项目债务已跌破面值 90 美分；对做数据中心与算力创业的团队，能否证明「电力与许可已锁定」已与团队、模型能力同等重要。

### Tesla Optimus

本周 Optimus 的两条消息都指向「从发布会走向产线」。一是中国供应链量产审核：据《21 世纪经济报道》与澎湃新闻转述，特斯拉机器人团队 9 月 16 日抵达宁波，9 月 17 日起启动新一轮 Optimus 量产审核；审核核心是验证量产排他性与一致性、协助供应商调试设备、把制造能力从美国工厂迁移到中国供应商，且特斯拉已向供应链下单，报道称部分供应商在审核开始前就已收到 Optimus 项目订单。报道同时给出产能指引：9 月内周产约 1,000 台、年底 2,000–2,500 台/周、2026 年约 5 万台并部署到全球超级工厂（上述数字均来自供应链与报道口径，特斯拉官方 7 月 22 日文件未披露任何年度产量或单价）。市场侧反应：A 股特斯拉供应链走强，均胜电子涨停，拓普集团 +4.36%、三花智控 +2.70%。

二是 Gen 3 外观泄露：9 月 22 至 23 日期间，特斯拉自家 Android App 资源包中的三张 Gen 3 机器人图片被公开，验证者称可在 App 版本 4.60.5-4573 中复现；报道称文件约 8 月 27 日首现、9 月 5 日被上采样、9 月 22 日仍在包内，公开讨论在 9 月 22—23 日集中爆发；截至 9 月 24 日特斯拉未作任何回应，且有报道指出文件位于 assets/mock 类目录（可能只是占位素材）。背景，非本周：Fremont 工厂 Model S/X 产线改造为 Optimus 产能（Q2 2026 财报确认施工中）；AWE 2026 上海展出 Gen 3 并提及 2026 年底量产目标；9 月 7 日前后有报道称特斯拉为 2026 年约 15,000 台 Optimus 下单零件。

战略上，把制造能力向中国供应商迁移，是用中国供应链的成本结构去压 Optimus 的 BOM——量产审核强调排他性与一致性，说明它要的是可复制的工艺而非单点样品。产品与市场层，Gen 3 被定位为首款面向大规模量产设计的一代；但报道一致指出普通消费者仍无购买渠道，短期仍是特斯拉自有工厂的工业用途。资本与组织侧，本周无融资、并购或高管变动披露；产能投入体现在尚未发布的 Q3 财报。

风险四条：一是量产承诺的历史反复——2025 年 5,000 台目标被搁置、转向 Gen 3，年初至今的指引已多次修正；二是泄露图可能只是 App 占位素材，把它当作产品定稿会高估进展；三是「周产 1,000 台」的产能指引无公司确认、无客户与价格，属供应链口径；四是中国供应链迁移带来地缘与关税变量。

关键数据：审核起始 2026-09-16 抵宁波、9-17 启动（见 [eletric-vehicles.com 引 The Paper](https://eletric-vehicles.com/tesla/tesla-audits-chinese-suppliers-ahead-of-optimus-production-report)，2026-09-21，全文已读）；产能指引与 A 股反应见 [BigGo Finance](https://finance.biggo.com/news/fac74b48-d94a-4511-9404-025c05deac9a)（全文已读）；泄露图验证 App 版本 4.60.5-4573 与 9-22 仍在包内见 [ubergizmo](https://www.ubergizmo.com/2026/09/leaked-tesla-optimus-humanoid-robot-gen-3-cleaner-look)（2026-09-24，全文已读）；供应链报道与官方文件的对照见 [xenospectrum](https://xenospectrum.com/en/tesla-optimus-gen3-china-supplier-audit)（2026-09-21，全文已读）。未公开：Optimus 售价（媒体报道的约 2 万美元目标价非公司披露）、官方年度产量、已确认订单金额与客户名单。

影响判断：本周真正重要的不是泄露图，而是中国供应链审核加已下单这一组合——它把 Optimus 从「演示」推到了「采购动作」，而特斯拉官方至今不给产量、价格与客户口径，意味着这批订单能否兑现仍是单方供应链说法。对全球竞争格局：如果中国供应商被要求量产排他性，人形机器人零部件的产能会先被特斯拉锁定，国内整机厂的成本曲线会被动上移。下一步看特斯拉是否在 Q3 财报（10 月）给出 Optimus 产量口径、Gen 3 正式发布时点，以及供应商侧的产能兑现。

对搭方案与做解决方案的从业者：对人形机器人集成与交付方向的从业者，本周信号是关键零部件正在被单一客户锁定——减速器、丝杆、灵巧手等环节的交期与价格会先受影响；如果你在做人形项目，应尽早评估替代供应商与库存策略，而不是等报价上涨。

### Figure AI

Figure 发布 Helix 2.5，并给出迄今人形机器人领域较严谨的一次家居零样本泛化评测。需先标注边界：官方页发布日为 2026-09-17（美东与太平洋时段），换算至上海时区落在本窗口起点的边界上，存在跨时区归属不确定，本节按边界事件收录。

已读来源显示：评测在 30 个从未采集过数据、机器人从未进过的旧金山湾区住宅中进行，机器人完成 237/420 次尝试（成功率 56%），共三类全身任务：客厅收玩具（13—15 个玩具全部入篮，单个超时 1 分钟）、折毛巾（四角对齐一度以内为最高等级，单条超时 3 分钟）、铺床（两枕加被角需达床铺上 1/3）。对照组是任务指定数据相同、其余完全固定的从零训练策略，盲测成功率仅 9%；两级差距 6 倍以上，且唯一变量就是 Index 预训练。

评测设计的关键约束：使用单一固定 checkpoint、不对评测环境与物体做权重适配、无部分得分（完整完成才计成功）、人工介入即判失败。效率侧：与在目标环境直接采集数据训练的 Helix 02 策略相比，Helix 2.5 以一半的适配数据达到同水平成功率，并首次实现跨 30 个未见住宅的零样本迁移；公司另报告随 Index 预训练数据每翻倍、held-out 动作预测损失可预测下降，且没有任何单个评测任务占 Index 预训练数据集超过 1.90%。资源侧：Index 当前每秒生成约 35 分钟人类经验数据，Figure 已为 Helix 训练承诺 35 亿美元算力。

背景（非本周）：Index 数据集于 2026-08-25 出窟（264,000 次 App 下载、108 国、44,000+ 周活、1,600 万条上传视频、向贡献者支付 1,500 万美元）；Nscale 于 2026 年 8 月宣布与 Figure 多年期合作（最高 10 万块 NVIDIA Vera Rubin GPU、初始 35 亿美元算力承诺、可扩至 60 亿美元以上，并战略投资 Figure、成为其首选 AI 基础设施供应商）。

战略上，Figure 押注「通用人类行为预训练大于任务专用训练」——先把数据规模做成护城河（Index 众包采集加算力承诺），再用零样本泛化证明数据本身的效用，而不是堆演示视频。产品与市场层，本周无商用订单披露；但把评测设在真实住宅、真实家具而非实验室，实质是在为家用机器人场景的可信度铺路。另据背景：累计融资约 23.4 亿美元、估值 390 亿美元（2025 年 9 月 Series C 超 10 亿美元）；自建 BotQ 工厂目标年产 12,000 台、约 500 名员工、已在 BMW Spartanburg 部署。资本与组织侧，本周无新增融资与估值披露；Helix 训练所需的算力由 Nscale 以战略投资加算力承诺方式绑定（背景，2026-08）。

风险四条：一是自报数据——成功率、对比基准、评分细则全部来自 Figure 自查，无第三方复现；二是试错仍多——56% 成功率意味着近一半任务失败，且零样本定义限于评测环境与物体（任务指定数据仍来自别处采集）；三是家用场景的商业化路径仍未公开（无定价、无交付时间）；四是预训练数据来自众包视频，涉隐私与数据授权的长期风险。

关键数据：零样本成功率 56%（237/420）对从零训练 9%（盲测，2026-09-17）、30 个未见住宅、三类全身任务、适配数据减少 50%、单任务占 Index 数据集上限低于 1.90%、Index 每秒约 35 分钟人类经验数据、Helix 算力承诺 35 亿美元，均出自官方页与已读转述；Index 背景数据（264,000 下载、108 国、44,000 周活、1,600 万视频、向贡献者支付 1,500 万美元，2026-08-25）；累计融资约 23.4 亿美元与估值 390 亿美元（2025-09，背景）；Nscale 合作最高 10 万块 Vera Rubin GPU、初始 35 亿美元（2026-08，背景）。未公开：家用产品定价与上市时间、外部客户订单。

来源：[Figure 官方页 · Helix 2.5 zero-shot 30-home generalization](https://www.figure.ai/news/helix-2-5-zero-shot-30-home-generalization)（URL 由转述正文链接确证，官网 /news 页为 JS 渲染、本轮未能直接读取正文）；评测设计与评分细则见 [Unite.AI](https://www.unite.ai/figure-introduces-helix-2-5-tested-zero-shot-in-30-unseen-homes)（2026-09-17，全文已读）；另见 [Startup Fortune](https://startupfortune.com/figure-ais-helix-25-robot-made-beds-in-30-homes-it-had-never-seen)（2026-09-18）与 [theaiinsider.tech](https://theaiinsider.tech/2026/09/17/figure-unveils-helix-2-5-with-zero-shot-humanoid-generalization-across-30-homes)（2026-09-17）；Nscale 与 Figure 合作条款见 [Pulse2](https://pulse2.com/nscale-ipo-filing-reveals-103-4-billion-in-active-and-contracted-ai-infrastructure-agreements)（2026 年 9 月下旬）。

影响判断：Helix 2.5 是本周具身智能领域证据质量最高的一项技术发布：它把「预训练大于任务专用训练」变成了可复现的对照实验（唯一变量、盲测、固定 checkpoint、无部分得分），而不是演示剪辑。若该结论成立，人形机器人的竞争焦点会从本体与控制转向数据采集规模与算力——这正是 Figure 用 Index 众包加 35 亿美元算力押注的方向。下一步看是否有第三方独立复现、Index 的数据授权与隐私处理，以及家用场景的商业化时点。

对搭方案与做解决方案的从业者：零样本泛化能力把「每上一个月新场景就要重新采集数据与调参」的集成门槛拉低了一个量级——如果 56% 是真的，方案侧的成本结构将从「场景定制」转向「基础模型加少量适配」；但 56% 远不够交付级可靠性，落地仍需人工兜底与安全中止机制。本周不宜把它当成可交付产品，而应把它当成估算 12—24 个月后集成成本的依据。

### Unitree 宇树

宇树科技（688539，科创板）本周是「上市满月即回落」的完整叙事。股价方面：9 月 18 日上市满月当日收 514.98 元/股、+2.33%，市值 2,082.89 亿元；9 月 21 日开盘后持续下挫，午市收 499.73 元、-2.96%，市值 2,017.1 亿元，再度跌破 500 元；截至 9 月 24 日收盘报 488 元，市值约 1,974 亿元，较上市首日盘中最高点（约 4,449 亿元）蒸发约 2,475 亿元。上市路径与首日表现：采用科创板预先审阅机制，3 月 20 日受理、6 月 2 日提交注册、8 月 19 日上市，发行价 150.80 元、首日收 845 元（+460.34%）、盘中最高 1,100 元、发行市盈率 219.23 倍。

监管方面：9 月 21 日前后市场聚焦「人形机器人 IPO 审核门槛收紧」——观察者网引财联社报道，多家投行人士称已收到公司提醒，涉及包括机器人在内的硬科技 IPO，「若行业地位不够突出，上市进程可能受影响」，但并非以窗口指导方式接到通知，更多是压实保荐机构前端把关责任；同期有外媒报道称内地自 9 月起放缓部分人形机器人企业上市节奏，重点审视高估值及政府相关收入能否代表真实需求，若剔除数采中心相关收入，部分企业估值或降 60%–70%。上述监管消息均未获官方确认，本刊按「具名媒体转述的监管传闻」处理，不作事实断言。

基本面：宇树 2026 Q1 营收 4.23 亿元，同比增速从上年度的 332.64% 回落至 68.49%；科创板上市公告书口径显示截至 2026 年 6 月营收 11.52 亿元、应收账款仅 1.2 亿元（占营收 10.4%），客户结构以教育科研为主（2025 前三季度约 73.6% 的人形机器人收入来自高校、科研院所与 AI 科技企业，多为预付款或现款现货）。行业面：截至 2026 年 8 月，国内至少 28 家具身智能相关企业正在推进或筹划上市（7 家受理、5 家辅导或递表、16 家拟 IPO）；2026 上半年国内具身智能及机器人领域 288 起融资、涉及 226 家企业、披露融资额超 460 亿元。

战略上，宇树的路线是「低价放量加现金流优先」——R1 双足人形起售价从 3.99 万元下调至 2.99 万元（2026-06-24 官方公告），客户以科研教育为主、回款快，这在监管开始追问「收入是否指向真实需求」的当口成了相对优势。产品与市场层，公司以中小尺寸、消费与科教型产品为主，全球全尺寸工业人形交付排名第二（IDC 2026：智元 1,300 台居首、优必选 1,079 台次之，宇树以中小尺寸为主）；Counterpoint 2026-08 报告称 2026 上半年全球人形机器人出货突破 2.2 万台，科教文娱类小尺寸产品仍占 60% 以上市场。资本与组织侧，8 月 19 日上市、发行市盈率 219.23 倍、市值一度 4,449 亿元；本周无新增融资、并购或人事披露。

风险四条：一是估值回归——一个月内市值大幅回落，二级市场给整个赛道的「讲故事溢价」在坍缩；二是监管不确定性（虽然传闻未获确认，但趋严已是行业共识）；三是增速回落（Q1 同比 +68.49% vs 上年度 +332.64%）；四是一旦「数采中心」类政府相关收入被从严审视，行业性估值重估会波及宇树所在的整条供应链（宇树自身客户结构以科研教育为主，受影响程度需后续财报验证）。

关键数据：9 月 18 日收盘 514.98 元、市值 2,082.89 亿元；9 月 21 日午市 499.73 元、市值 2,017.1 亿元；9 月 24 日收盘 488 元、市值约 1,974 亿元、较首日盘中高点蒸发约 2,475 亿元；发行价 150.80 元、首日 +460.34%、最高 1,100 元、发行市盈率 219.23 倍、上市日 2026-08-19；2026 Q1 营收 4.23 亿元、增速 68.49%；截至 2026 年 6 月营收 11.52 亿元、应收账款 1.2 亿元；2025 前三季度人形机器人收入约 73.6% 来自教育科研；行业数据（28 家拟上市、上半年 288 起融资与超 460 亿元）均来自 2026-09-18 至 24 的报道。未公开：公司对监管传言的回应、2026 全年出货指引。

来源：[观察者网](https://www.guancha.cn/CaiJing/2026_09_21_901547.shtml)（2026-09-21，全文已读）；[界面新闻](https://www.jiemian.com/article/15125957.html)（2026-09-23，全文已读，含上市公告书与优必选财报对照）；[钛媒体](https://www.tmtpost.com/8145787.html)（上市满月，仅摘要）；[新浪财经](https://finance.sina.com.cn/jjxw/2026-09-24/doc-inisxxkr5071624.shtml)（2026-09-24，仅摘要）；[钜亨号](https://hao.cnyes.com/post/269834)（2026-09-24，仅摘要）；[环球网财经行情](https://news.qq.com/rain/a/20260919A05FZ700)（2026-09-18，仅摘要）。

影响判断：宇树本周的双重意义在于——它是「具身智能第一股」，其上市后回落与随后的 IPO 门槛收紧传导，等于给一级市场重新定价：能上市不等于能持续融资，能下单不等于有真实需求。行业融资节奏（上半年 288 起、超 460 亿元）与二级市场表现的反差说明，下半年具身赛道的资金会更集中到有真实客户与现金流的公司。下一步看 9 月及 Q3 财报的收入质量（政府相关收入占比）、监管是否给出成文口径，以及后续 28 家拟上市企业里有多少被劝退。

对搭方案与做解决方案的从业者：宇树的降价（R1 起售价 2.99 万元）加客户以科研教育为主，意味着实验与教学场景的机器人采购门槛本周继续下探，做科研与教育方案、数据采集外包的团队会先受益；但工业交付场景的价格战会把集成商的毛利压薄。资本信号方面：这是本期最明确的赛道降温信号——二级市场给具身智能的溢价一个月内腰斩，叠加监管对高估值与政府类收入的追问，一级市场估值锚会向下移；对创业者而言，「能持续赚钱」开始比「会不会做」更被定价。

### UBTech 优必选

优必选本周同时出现「C 端交付开启」与「交付预期缩水八成」两个相反方向的事实。其一，U1 交付：9 月 16 日超仿生人形机器人 U1 系列正式开启交付，首批进入上海永达集团、北京波士集团与韩国 Galaxy 机器人乐园。首批场景与产品定位错位：U1 被定义为家庭情感陪伴产品，首批却在 4S 店与机器人乐园承担导览、接待、招客流角色；永达与波士均为汽车经销与服务集团，与波士的合作明确定义为「面向高端客群开放零售与租赁服务」，即渠道商角色而非终端采购方。

其二，交付量下修：6 月 30 日发布会官方宣布全渠道订单 13,361 台，董事长兼 CEO 周剑当时称「力争年内完成全部订单交付」；8 月底财报电话会上 CFO 张钜改口为 U1 今年实际可交付约 1,500–2,000 台，交付预期缩水超八成。公司解释为产能挑战：U1 需建立适配仿生硅胶皮肤、微型舵机的新型制造流程，仅头部就需在有限空间集成 19 个自由度以实现 30 多种微表情，部分细节仍需人工。价格：U1 Lite（半身版）11.98 万元、U1 Pro（全尺寸）16.98 万元、U1 Ultra 男款 99 万元与女款 88 万元；低价两档不支持自主行走与家务劳作。

其三，产业与订单侧：据证券时报，优必选接连与欧洲、日韩主要市场客户签约，斩获超 5,000 万元海外订单，产品含商用服务人形机器人 Walker C1 与超仿真人形优世界 U1；同期优必选等还成立了智造机器人合资公司。

其四，基本面（2026 年中报，为本周报道广泛引用的口径）：H1 营收 12.69 亿元、同比 +104.2%；全尺寸人形机器人销量 921 台、收入 5.9 亿元（占总收入 46.5%），其中 Walker S2 交付约 600 台；期内亏损 3.39 亿元；应收账款账面余额 22.25 亿元（为 H1 营收的 1.75 倍，一年以上账龄占比 34.45%、三年以上 2.47 亿元），坏账准备 5.45 亿元（计提比例近 25%）；存货 9.85 亿元（较 2025 年底 5.77 亿元增长 70.9%）；教育智能机器人收入 1.22 亿元、同比 -49.1%。毛利率侧，据大和证券 2026-09-09 报告，Walker S2 的 BOM 成本已从约 35 万元降至约 18 万元（降约 50%），平均售价从 70–80 万元降至 60 万元（降约 20%），上半年毛利率逾 75%。9 月 12 日，与西门子联合打造的柳州工业人形机器人超级智慧工厂投产，宣称每 10 分钟下线一台 Walker S2、满产年产能约 5.2 万台（公司口径）。盈利时间表：CFO 张钜称原定 2027Q4 单季盈亏平衡，争取提前到 2026Q4 单季经调整 EBITDA「有机会转正」（背景）。

战略上，优必选用 RaaS（机器人即服务）替代买断销售，副总裁焦继超称「卖的是含定制软件与交付服务的整套解决方案，单价可控制在 50 万元以内」；这在客户端降低了技术验证风险，但把一次性资本支出变成持续运营支出，现场调试、故障维护、版本迭代成本刚性且前置，收入后置。产品与市场层，工业侧靠 Walker S2（空客首批采购 100 台，与比亚迪、吉利、奥迪一汽、蔚来签署超 5 亿元长期供货协议，来源为券商研报，二手）；C 端靠 U1。但公司首席品牌官谭旻公开承认「Walker S2 在工厂实际作业中效率最多仅达人类的 30–50%，且仅限于堆叠箱子、品质检查等高度标准化任务」；中报披露 VLA 技术在实验室全流程成功率 75%。资本与组织侧，2026-06-30 货币资金从 2025 年底 48.88 亿元降至 23.26 亿元，其中 16.65 亿元用于收购锋龙股份，扣除后现金净减少约 8.73 亿元；本周无新增融资与高管变动披露。

风险四条：一是交付与产能——U1 交付预期缩水超八成，跨行业共性（供应链协同、制造标准缺失、核心零部件成本）并非优必选独资问题，但它是第一家用自己的数字公开承认的；二是应收账款与坏账——22.25 亿元应收、5.45 亿元坏账准备、计提近 25%，2026H1 信用减值损失 9,107 万元（2025 同期仅 130 万元，公司解释为会计政策变更）；三是收入质量——2025 年近 14 亿元订单中近六成来自各地数采中心（防城港 2.64 亿、自贡 1.59 亿、九江 1.43 亿、惠州大湾区 5,926 万），正是监管正在追问的那类收入；四是监管与信任——业内公开指控部分企业通过数采中心与关联交易制造虚假收入；人形机器人百人会与中国机械工业联合会已于 7 月 4 日就情感陪伴机器人发布规范倡议。

关键数据：U1 交付开始 2026-09-16；全渠道订单 13,361 台（2026-06-30 发布）；全年可交付预期 1,500–2,000 台（2026 年 8 月底财报电话会）；售价 11.98/16.98/99/88 万元；H1 营收 12.69 亿元 +104.2%、全尺寸销量 921 台与收入 5.9 亿元、Walker S2 约 600 台、亏损 3.39 亿元、应收账款 22.25 亿元、坏账准备 5.45 亿元（计提近 25%）、存货 9.85 亿元、教育机器人 1.22 亿元 -49.1%；Walker S2 BOM 约 35 万降至约 18 万元、ASP 70–80 万降至 60 万元、上半年毛利率逾 75%（大和证券 2026-09-09）；柳州工厂每 10 分钟一台、满产年约 5.2 万台（2026-09-12 投产，公司口径）；海外订单超 5,000 万元（证券时报，2026-09-23 前后）；累计采集约 1,100 万条机器人本体数据、超 80% 来自工业（业绩会）。未公开：尾款支付比例（预售 3,000 元定金、7 月 15 日前无条件退款）、机器人在客户现场的实际运行时长。

来源：[钛媒体](https://www.tmtpost.com/8150766.html)（2026-09-24，全文已读）；[界面新闻](https://www.jiemian.com/article/15125957.html)（2026-09-23，全文已读）；[电子工程专辑](https://www.eet-china.com/mp/a527270.html)、[证券时报](https://www.stcn.com/article/detail/4194454.html) 与 [IT 之家](https://www.ithome.com/1/006/635.htm)（仅摘要）。

影响判断：优必选本周给出了具身智能商业化最完整的一份「冷水报告」：订单 1.3 万台、交付实际 1,500–2,000 台、毛利率逾 75% 却仍亏损 3.39 亿元、应收账款是营收的 1.75 倍。这说明人形机器人的瓶颈已经从「能不能造」变成「造得出但卖不动、卖出也收不回钱」。与宇树的估值回落叠加看，本周中国具身赛道同时遭遇二级市场重估与交付现实校正双击。下一步看 2026Q4 经调整 EBITDA 能否转正、U1 实际交付数，以及数采中心类收入在后续财报中的占比变化。

对搭方案与做解决方案的从业者：RaaS 模式是本周最值得借鉴也最需警惕的一条——它把客户的采购决策门槛降到「按时间与任务付费」，利于方案落地，但要求交付方承担现场调试与维护的刚性成本；如果要复制，必须先把「机器人有效作业时长」写进合同与定价模型，因为公司自己披露的工厂效率仅人类的 30–50%。资本信号方面：预售价不到百万元、交付缩水超八成、应收账款占比 1.75 倍——这对一级市场是估值方法的修正信号：按订单额估值的方法本周被公开证伪，此后应转向按已验收收入及回款率估值；客户结构的「含金量」（是否政府或关联方）将直接影响下一轮融资估值。

### Nscale（动态新增对象）

2026-09-18，伦敦 AI 云与数据中心公司 Nscale Limited 向 SEC 提交 Form S-1，拟在 NYSE 上市、代码 NSCL，由 Goldman Sachs、J.P. Morgan、Morgan Stanley 领衔（共 23 家承销商）；发行股数与价格区间尚未确定。S-1 披露：截至 2026-08-31，活跃与已签约合同总值（TCV）1,034 亿美元（约为 2025 年末 380 亿的 2.7 倍），其中活跃 TCV 约 26 亿美元；剩余履约义务（RPO）564 亿美元；合同以长期 take-or-pay 为主，加权平均合约期约 5.7 年；其中 Anthropic 一家占 TCV 约 44%（2026-08-25 签署、总额最高约 446 亿美元、460MW，采用 NVIDIA Vera Rubin NVL72）。

运营规模：活跃 GPU 约 25,000 卡，活跃加已签约 GPU 约 461,000 卡（另有二手来源给出「已签约约 289,000 卡」口径，两者不一致，本刊采用 S-1 转述的 461,000 并标注冲突）；数据中心 5 个活跃加 12 个已签约，活跃与已签约电力容量约 1.37GW，另有约 10GW 潜在开发容量。财务：2026 上半年营收 1.406 亿美元（同比 +1,252%）、净亏损 10.2 亿美元（2025 同期亏损 3.689 亿）；2025 全年营收 3,300 万美元、净亏损 7.618 亿美元；季度收入刚越过 1 亿美元。资本侧：2026-09-15 签署最低 31 亿美元认购协议（含 21 亿美元无担保可转换贷款票据，及最多 10 亿美元可转换票据或无投票权股份拟发行予 NVIDIA）；NVIDIA 还为 Nscale 一份德州数据中心租约提供最高 8.6 亿美元履约担保；公司 2026 年 3 月轮估值 146 亿美元，报道称 IPO 目标估值接近 300 亿美元；负债超 80 亿美元。S-1 自述四大风险：客户集中（2026H1 单一客户占营收 52%）、资金需求（尚未锁定后续建设的约束性融资）、硬件依赖（全部基础设施基于 NVIDIA GPU）、以及财务报告内控存在重大缺陷（可能至 2027 年仍未完全整改）。

它作为动态新增对象的代表性体现在三点：它是本期唯一一家实际踏上 IPO 流程的头部 neocloud，与已上市的 CoreWeave、上市传闻中的同类公司共同决定算力租赁赛道的估值锚；它的合同以 OpenAI、Anthropic、Microsoft 为对手方，是超大规模 AI 实验室算力需求从自建转向外购的直接证据；它把具身智能客户（Figure AI，最高 10 万块 Vera Rubin GPU 选择权）写进招股书，是本期少见的「算力—具身」资本联动链条。它改变的是 neocloud 的竞争定义：从「谁有 GPU」转向「谁能拿到长期 take-or-pay 合同、锁定电力并撑住建起来的资金缺口」，并首次把 NVIDIA 以「担保加可转换票据」方式深度参与客户融资的结构公开化。它值得持续追踪——S-1 已公开，定价、募资额、后续 RPO 兑现率与内控整改进展都会持续成为 AI 基建信用周期的观测指标。

战略上，Nscale 提前建产能、以长期 take-or-pay 合同锁客，再以 IPO 加 NVIDIA 关联融资补资金缺口；同时并购 Anyscale（2026-07 宣布，约 200 名员工）向 Ray 分布式软件层延伸。产品与市场层，业务为专用 GPU 集群、云算力、训练与推理、自建数据中心；客户含 Anthropic、Microsoft、OpenAI 与 Figure AI。资本与组织侧：S-1 于 2026-09-18 提交，31 亿美元认购协议于 9 月 15 日签署，NVIDIA 担保上限 8.6 亿美元；估值从 146 亿（2026-03）到报道称 IPO 目标近 300 亿；员工从初创时的 40 人增至 1,000 人以上。

风险除 S-1 自述的四项（客户集中 52%、后续融资未锁定、硬件唯一供应商、内控重大缺陷）外，还有一项收入确认的时间差：1,034 亿美元 TCV 对 1.406 亿美元已确认收入。

关键数据：TCV 1,034 亿美元、RPO 564 亿美元、Anthropic 占 44%（最高约 446 亿美元、460MW）、合同均期 5.7 年；活跃 GPU 25,000、活跃加签约 461,000；5 加 12 个数据中心、1.37GW 活跃与签约、约 10GW 潜在；2026H1 营收 1.406 亿（+1,252%）、净亏 10.2 亿；2025 营收 3,300 万、净亏 7.618 亿；单一客户占 H1 营收 52%；负债超 80 亿美元；认购协议最低 31 亿美元（9 月 15 日）；NVIDIA 担保上限 8.6 亿美元。来源：[Nscale 官方新闻稿 · Nscale files initial public offering](https://www.nscale.com/press-releases/nscale-files-initial-public-offering)（2026-09-18）；[Dealroom](https://app.dealroom.co/news/note/nscale-files-for-nyse-ipo-as-net-loss-widens-to-1-02b)（2026-09-19，全文已读）；[TechTimes](https://www.techtimes.com/articles/327754/20260920/nscale-files-30b-nyse-ipo-1b-nvidia-note-45b-anthropic-deal.htm)（2026-09-20，全文已读）；[Pulse2（含 Figure AI 条款）](https://pulse2.com/nscale-ipo-filing-reveals-103-4-billion-in-active-and-contracted-ai-infrastructure-agreements)（全文已读）；[valueaddvc](https://valueaddvc.com/pulse/nscale-nyse-ipo-103b-backlog-2026)。未读：SEC EDGAR S-1 原文（本轮未直接调取）。

影响判断：Nscale 的 S-1 把 neocloud 模式的真实轮廓摊开了：1,034 亿美元合约对应 1.4 亿美元确认收入，靠的是 NVIDIA 的可转换票据与租约担保在背后顶着。它的 IPO 如果定价成功，会给同类 neocloud 一个上限参考；如果失败或缩量，则意味着市场开始给「合约价值不等于现金流入」的 neocloud 打折。下一步看 IPO 定价与募资额、Anthropic 和 Microsoft 合同的 RPO 兑现进度、内控缺陷整改进展。

对搭方案与做解决方案的从业者：如果把 neocloud 当作长期算力底座，本周多了一个尽调指标——看 RPO 与已确认收入的差距，而不是看宣布的合约总额；同时 Nscale 的模式高度依赖单一硬件供应商，方案侧仍需保留跨云、跨芯片的可移植性（Anyscale 与 Ray 层的价值正在于此）。资本信号方面：这是本期 AI 基建赛道最大的上市信号——一家成立不久的公司以 1.4 亿美元营收支撑 10.2 亿美元半年亏损去申请上市，说明公开市场对 AI 基建的融资窗口仍然开着；但 S-1 把「内控重大缺陷」与「单一客户 52%」都写进去了，意味着窗口开着但门槛在抬高。对创业者的含义：能否拿到长期 take-or-pay 合同，比技术指标更能决定融资能力。

#### 本组格局变化

1. **本周算力链条的分水岭不在需求，而在「电、许可与资金」，而且第一次以合同动作的形式出现。** Oracle 对 1,650 亿美元的 Project Jupiter 发出不可抗力通知，背后是新墨西哥州两度拒绝输气管道许可、项目债务跌破面值 90 美分；同一周 Nscale 在 S-1 里承认「后续建设融资尚未锁定」。这说明 2026 年下半年 AI 基建的约束已从芯片供给转向物理与信用约束：能证明「电力与许可已锁定」的资产仍被追捧，拿不到的项目已被公开重新定价。
2. **「合约金额」与「现金流入」的差距本周被两个不同市场同时放大。** Nscale 1,034 亿美元 TCV 对 1.4 亿美元半年收入，核心问题是收入确认只在交付后发生；而优必选 1.3 万台订单实际只能交 1,500–2,000 台、应收账款 22.25 亿元且坏账准备近 25%。两个案例跨越算力与具身两个赛道，却指向同一个投资与经营教训：按订单或合约总额估值的方法本周被公开证伪。
3. **二级市场对具身智能的态度本周从「热情」转为「重估」。** 宇树上市满月即回落、9 月 24 日市值较首日高点蒸发约 2,475 亿元，叠加监管部门对高估值与政府类收入的追问（外媒口径：若剔除数采中心相关收入，部分企业估值或降 60%–70%，该传闻未获官方确认），国内至少 28 家拟上市具身企业会直接受影响；同期特斯拉却在中国做量产审核并已下单——同一周里，中国具身公司在被去估值，美国的具身订单在往中国供应商迁移。
4. **技术叙事本周出现一个罕见的可对照实验高点。** Figure Helix 2.5 用相同任务数据、固定 checkpoint、无部分得分的盲测，得出 Index 预训练 56% 对从零训练 9%（发布 9 月 17 日属窗口边界，已标注）。若被第三方复现，竞争焦点会从本体与控制转向数据采集规模与算力，而本轮算力承诺（35 亿美元）来自一家正在 IPO 的 neocloud（Nscale），把两个主题编在同一条链上。
5. **供应侧同时出现「向中国迁移」与「从中国撤出」两个方向。** 特斯拉把 Optimus 制造能力从美国工厂迁向中国供应商并已下单；而中国国资委正在排查国资数据中心中占比可达 90% 的 Broadcom 交换机。产业转移的方向取决于「成本」还是「自主可控」，两者在同一个国家同时发生。
6. **算力第二供应商的定价权本周被资本市场正式确认。** AMD 市值首破 1 万亿美元，但它本周被引用的两条「订单」全部是 2025 年 10 月的旧公告——说明市场在为「第二供应商」这件事付钱，而不是为本周的新交易付钱。周内 Broadcom 仅 +0.52%、且被中国监管点名，资金在从确定性 ASIC 与网络龙头向弹性更大的替代方案轮动。

## 下周观察点

以下观察点都提炼自各条已有的「下一步看」表述，不新增推测性事实。

**全球巨头与平台**

- ChatGPT Work 触发式自动化的企业可用性与配额；99 DevDay（2026-09-29）的产品补齐；Anthropic 与 Grok 是否会继续跟价。
- Gemini Enterprise 上 TTS 的定价与区域可用性；Gemini 4 的发布时间与是否披露定价、benchmark；Gemini 3.5 Flash 退役的最终时间表。
- NVIDIA Halos 在具体机器人、自动驾驶客户上的公开采用案例，以及 ISO/IEC TS 22440 的落地节奏。
- Meta Connector Platform 的审核与权限细则、Muse 的计费与区域可用性。
- Bedrock 上 Sol/Luna 的区域可用性与定价梯度，以及 OpenAI 与 AWS 的 Stateful Runtime 是否进入 GA。

**中国头部企业**

- 11 月新一代视频模型与 Qwen4 的实际发布节奏。
- 火山引擎秋季发布会与豆包侧商业化（订阅与 API 定价）是否有窗口内动作。
- 百度灵玑 OS 的第三方采用与千帆开发者留存，是否有客户案例与用量数据。
- 腾讯「混元智囊团」的供给与定价是否公开、WeVisDoc 的实际采用。
- 智谱 flashx 档的实际采用率与是否出现新基座版本；月之暗面上市聆讯进展与是否有新版本。
- MiniMax 的 A 股辅导进展与 H3 是否走向开源加定价体系化；DeepSeek 安理会会议后的实际政策效果。

**应用与垂直头部**

- Runway：DIFFUSE 的供给端规模与抽成模式；AI Summit（2026-09-30）是否发布新模型或企业级治理能力。
- Databricks：Genie 与 Row Zero 的定价是否进入现有 SKU；IPO 时间表披露是否带来财务口径透明化。
- Mistral：Pimento 的整合方向与 €3B 的实际投向披露。
- Glean：金融 MCP 连接器名单与上线节奏、AI Gateway 正式 GA 时间、是否出现与 $7.2B 估值相匹配的新融资。
- Scale AI：参考架构是否有公开客户落地案例与可量化结果；Google 与 Meta 双重关系下客户结构是否继续分化。
- Cursor：OpenAI 是否发布正式公告、Cursor 如何回填模型缺口（自研 Composer、xAI 或其他厂商）、企业客户是否启动多工具并行。
- Cohere：与 Aleph Alpha 合并交易的监管批准与 STACKIT 上首个生产级客户案例、North 在银行场景的付费扩容迹象。
- Cognition：圣保罗之后的下一个区域落点、$48B 估值对应的新收入披露、Devin Desktop 更名后企业续约率的间接信号。
- Perplexity：Nvidia 入股是否官宣、IPO 时间表是否更新、Comet 与 Computer 在企业安全与审计能力上是否给出可验证材料（本周静默）。

**算力、云、硬件与具身**

- AMD：MI450 与 Helios 的实际交付节奏、Oracle 之外是否出现第二个公开超算客户、ROCm 在具身与机器人开发者社区的采用是否成形。
- Broadcom：SASAC 是否发出成文指导、是否在 FY26 Q4 给出中国区口径。
- CoreWeave：约 11 月 9 日的三季度报告（合同期限结构、单 GW 收入）、可转债选择权是否被行使。
- Oracle：新墨西哥州管道许可是否反转、项目能否在 2028 年前投产、后续季度是否披露减值或延期成本。
- Tesla：Q3 财报（10 月）是否给出 Optimus 产量口径、Gen 3 正式发布时点、供应商侧产能兑现。
- Figure：是否有第三方独立复现 Helix 2.5、Index 的数据授权与隐私处理、家用场景商业化时点。
- 宇树：9 月及 Q3 财报的收入质量（政府相关收入占比）、监管是否给出成文口径、28 家拟上市企业里有多少被劝退。
- 优必选：2026Q4 经调整 EBITDA 能否转正、U1 实际交付数、数采中心类收入在后续财报中的占比变化。
- Nscale：IPO 定价与募资额、Anthropic 和 Microsoft 合同的 RPO 兑现进度、内控缺陷整改进展。

## 关键数据来源与口径说明

本期覆盖 2026 年 9 月 18 日 00:00 至 9 月 25 日 00:00（Asia/Shanghai）的窗口，共 38 个对象（固定 37 家加动态新增 Nscale）。文中不对任何数字做四舍五入之外的重算，所有口径限定词均保留在对应主张附近；以下是集中说明。

**一、披露口径分类**

- 据公司披露、公司口径、官方公告：OpenAI 定价与 benchmark、Anthropic 定价与 benchmark、GitHub Changelog、AWS What's New、xAI 公告、NVIDIA 官方博客、华为官网、Harvey 主轮估值、Runway 统一计费、Databricks 收购、Midjourney 更新日志、Scale 官方博客、Cohere 与 TD 官方新闻稿、Cognition 官方博客、CoreWeave 与 SemiAnalysis、Oracle 官方博客与财报页、Nscale 官方新闻稿。均属公司自述，未逐一手审计。
- 据媒体报道、具名媒体披露：The Information 与 Reuters 关于 Perplexity 的估值与投资洽谈、Bloomberg 关于 Oracle 不可抗力、FT via Reuters 关于 SASAC 排查、澎湃与 21 世纪经济报道关于特斯拉供应链审核、Bloomberg 的「IPO 前」语境、Reuters 关于 Cohere 与 Aleph Alpha。
- 第三方速览、第三方指南与对比页：中国侧多条（第三方速览转述的 glm-5.3-flashx、SWE-Serve、Coding Agent Index v1.5）与应用侧部分（Midjourney 无移动 app 与无 API、Perplexity 企业定价）属此类，未逐一到原始榜单与公司页核验。
- 未独立核实：DeepSeek 的融资估值媒体口径、Perplexity 的 Nvidia 投资、中国监管收紧人形机器人 IPO（属未获官方确认的媒体表述，按「传闻」限述）、Scale AI 的二级市场折价区间、Oracle 的资产负债表数字。
- 背景，非本周：Gemini 4 预训练启动（2026-07-21）、OpenAI 与 Oracle 的 2025 年 10 月订单公告、Broadcom FY26 Q3 财报（2026-09-02）、Cohere 与 Aleph Alpha（2026-09-16）、Perplexity 与 Crusoe（2026-09-15）等，均在原文处标注，不计入本周动态。
- 计划、拟、目标（非已发生事实）：OpenAI 的下一步产品补齐、Anthropic 的 Sonnet 5.5 与 Haiku 5.5「数周内跟进」、Nscale 的 IPO 价格区间尚未确定、Cohere 合并交易仍需监管批准、SASAC 可能发出非正式指导、Optimus 的产能指引（供应链口径）。

- 未公开或本次未取得：大量关键商业指标本周无披露，逐条已标在各条目，典型如：Harvey 的 ACV 与付费形态；Sierra 的单价与框架协议金额；Runway 的单位定价与客户数、ARR；Databricks 的收购对价与客户数、ARPU；Mistral 的 ARR 与 Pimento 精确对价；Glean 的客户数与新增融资；Scale AI 的本周合同金额与营收；Cognition 的圣保罗投入与当地客户数；Perplexity 的本周可核实新增动态；AMD 的本周官方订单金额、资本开支与出货量；Broadcom 的中国区收入占比；CoreWeave 的三季度营收指引与资本开支、电力合约规模；Oracle 对不可抗力通知的书面说明与项目债务条款；Optimus 的售价、官方产量与客户名单；Figure 的家用定价与外部订单；宇树对监管传言的回应与全年出货指引；优必选的尾款支付比例与现场运行时长；Nscale 的 SEC EDGAR S-1 原文（本轮未直接调取）。

**二、工具与取证局限**

- 内置搜索并行调用多次触发限流，已改用串行与已授权适配器覆盖。
- 部分官方站点不可读：qbitai 403、智谱研究页响应不完整、MiniMax 与腾讯混元研究页为 JS 渲染、DeepSeek api-docs 新闻索引重定向、Meta 官方 Connect 汇总页 HTTP 400、Perplexity 官方博客直连 403（Cloudflare）、Figure 官方 /news 页 JS 渲染返回空、xenospectrum 403、AWS 博客分类页响应不完整。
- 付费墙与拦截导致仅能取得标题或摘要：FT 原文、CNBC 部分页面、Bloomberg、investing.com 等，均已在条目内逐条标记。
- 部分检索工具的新闻检索返回空结果，或日期过滤不严格；均记为工具行为限制，不得据此判为「无动态」。
- 不可达与不可核验是缺口，不等于公司静默；对 Perplexity 的「静默」判定附有完整核验范围。

**三、计数与口径**

- 本期覆盖固定对象 37 家加动态新增 1 家（Nscale），合计 38 个对象，逐一扫描、无空白；实质覆盖努力达到 80% 以上的目标。
- 有动态条目均按完整模板撰写（本周动态、企业维度、关键数据带链接与日期、原文链接、影响判断），未达篇幅处均说明取证边界。
- 静默项均记录核验范围、检索查询与可读来源日期；「未取得」与「静默」在文中严格区分。
- 跨议题回填证据保留原有的可核验度标注（例如中国市场国资数据中心一条标注为「可核验度：中」）。
