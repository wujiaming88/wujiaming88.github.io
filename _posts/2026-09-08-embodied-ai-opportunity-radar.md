---
layout: single
bucket: embodied
title: "具身智能机会雷达周报 · 第 2 期（2026-09-01—2026-09-07）"
date: 2026-09-08 12:00:00 +0800
categories: [AI]
tags: [具身智能, 人形机器人, 机器人, AI Agent, VLA, Sim2Real, 机器人基础模型, 产业观察, AI投资, 政策]
header:
  overlay_image: /assets/images/posts/2026-09-08-embodied-ai-weekly-header.png
---

本期覆盖 **2026 年 9 月 1 日 00:00 至 9 月 7 日 24:00（Asia/Shanghai）**，阅读日为 9 月 8 日。最值得追踪的变化，不是哪一台机器人又完成了一次演示，而是**具身智能的竞争重心正在从“单次成功演示”转向可验证的运行系统**。数据开始纳入失败与人工干预；任务规划开始引入结构化里程碑和技能契约；执行系统开始专门评测恢复；商业部署则越来越需要用客户工序、人工介入和持续运行指标验收。

这条主线也决定了判断一条新闻的方式：论文结果、公司主张、客户试点、生产部署和可审计商业结果不能混在一起。下面依次看技术如何补上失败与反馈，产品如何跨过演示到运行的门槛，资本和政策在给哪些层定价，以及软件与 AI Agent 团队可以从哪里进入。

## 技术：让失败、计划与反馈可测

**LIBERO-Recover** 把恢复能力单独做成 benchmark。论文和项目页于 2026 年 9 月 4 日发布，从多个模型在 LIBERO 仿真中的自然执行失败形成 **2,178 个恢复场景、16 个评测维度**；4 名遥操作员又在 413 个失败场景中采集 **3,184 条恢复示范、625,731 帧**。六个代表模型进入这些失败状态后，性能均下降超过 50%；动作 chunk 从 4 增至 32 时，恢复率持续下降。[论文](https://arxiv.org/abs/2609.05178)、[HTML 正文](https://arxiv.org/html/2609.05178v1)与[项目页](https://liulin815.github.io/LIBERO-Recovery/)共同支撑这一结论。

边界同样重要：这里的“真实失败”是模型在仿真中自然产生的失败，并非真机事故；截至阅读日，项目页也没有明确下载入口。因此，生产验收不能只看干净初态成功率，还应同时报告恢复成功率 RSR、失败前后退化 RD 和跨失败状态一致性 RC。对软件团队，直接机会是把失败 trace 编译为恢复态回归集，保留初始状态快照，按 retry、adapt、state repair、environment repair 分级，再用短 chunk、高频状态重读和补偿事务改善恢复。

**AnyWorld v2** 则尝试把人类视频编译为机器人原生经验。9 月 1 日发布的 v2 将第一视角交互拆成动作、相机几何和执行体上下文，再通过 latent video diffusion/DiT 重组为目标机器人视觉经验，并与语言和标定动作组成训练数据。作者报告 world-model 可控性 **0.778**；RoboCasa GR1 的 18 个任务成功率从 **49.8% 提升到 54.6%**；IRON 真机 20 次抓取从 **20% 提升到 55%**。[arXiv](https://arxiv.org/abs/2608.29242)、[HTML 正文](https://arxiv.org/html/2608.29242)和[项目页](https://xpeng-robotics.github.io/anyworld/)给出了原始材料。

这意味着 world model 开始针对策略缺口生成经验，**可能**降低跨本体真实数据成本；但接触物理和动力学仍是近似的，真机只有 20 次，论文页也没有可直接下载的代码或权重。更稳妥的工程用法，是把失败日志拆成动作、视角、执行体和上下文，生成“同观察、不同指令和动作”的反事实回归集。

结构化计划是另一条线。**REFACTOR-VLA** 于 9 月 1 日提出 wake/sleep 技能归纳：用 latent world model 和行为等价核判断动作片段能否替换，再用 typed program induction 抽象技能。188M world model 配合监督对比目标，在 LIBERO 四套件上的技能聚类优于所比较基线，扩大到 430M 反而变差。但它没有真机实验，LIBERO 又缺少 reward 字段，论文中的 return-preservation gate 未真正受测。近期它更适合离线技能挖掘、压缩与审计，不适合直接替换生产控制器。来源见[论文](https://arxiv.org/abs/2609.01215)和[Apple Research](https://machinelearning.apple.com/research/refactor-vla-motor-programs)。

**NS-VLA v2** 在 9 月 2 日加入 primitive plan、单调 pointer 与分层奖励，把高层里程碑和低层连续动作的信用分配拆开。作者结果为 LIBERO 1-shot 平均 **69.1**、LIBERO-Plus **49.8**；[论文](https://arxiv.org/abs/2603.09542v2)、[GitHub](https://github.com/Zuzuzzy/NS-VLA)及 Apache-2.0 许可、模型和数据入口较完整。单调 pointer 能限制乱序和跳步，却不容易表达回退、循环和动态重规划，而且未见真机结果。

**EmbodiedSkills** 更接近 Agent 工程：高层选择不是直接下发动作，而是 execution proposal；运行时检查 precondition、参数、artifact freshness、状态迁移和 postcondition，并记录恢复。任务适配后的低层 VLA 在 RoboTwin 2.0 平均 **86.20%**、LIBERO 平均 **97.40%**，但 RMBench 记忆依赖任务只有 **12.5%**，说明长时持久状态仍是瓶颈。实验主要在仿真中，完整 AgentLoop 不能直接继承低层成功率。来源：[论文](https://arxiv.org/abs/2609.01281)。

评测资产也在变复杂。**RoboSPA** 沿空间推理和长程序规划两条难度轴构造 10 类任务、56 个基础任务、280 个难度变体和 **527K 轨迹**；截至 9 月 8 日，[官方仓库](https://github.com/fanzhenxuan/RoboSPA)仍写明代码和数据准备中，所以只能说[论文](https://arxiv.org/abs/2609.05324)承诺开放，不能说资产已经可复现。

**GigaBrain-0.7** 的论文和模型主体在窗口外，本周新增训练、benchmark 与 ROS server/client workflow。它以行动控制、理解规划、预测评估组织 3.5B 多本体 VLA，以 LeRobot 为数据交换层，提供 PiPER/H01 真机客户端和默认 dry-run 安全门。需要区分两点：公开资源不等于 **37.3k 小时**训练数据全部公开，GPU inference server + ROS client 也不等于完全端侧。材料包括[GitHub](https://github.com/open-gigaai/giga-brain-0)、[论文](https://arxiv.org/abs/2608.15875)和[模型卡](https://huggingface.co/open-gigaai/GigaBrain-0.7-3.5B-Base)。

**World Labs Atlas** 于 9 月 1 日向选定伙伴开放 early access。它用多模态自回归扩散 Transformer 原生处理文本、图像、视频、相机位姿和深度，支持新视角、3D/4D 世界及 real-to-sim。但[官方技术博客](https://www.worldlabs.ai/blog/atlas)没有公开参数、训练数据、可审计数值、机器人闭环成功率、SLA 或成本；少视图补全还可能产生物理幻觉，不能单独承担安全验证。

把这些对象放在一起，world model 已从“预测未来”扩展到经验生成、行为等价判定、subgoal/value 条件和恢复一致性；LeRobot 趋向数据交换层，ROS、Isaac、MuJoCo 仍承担执行与仿真，现实部署更接近 GPU server 加边缘感知/控制。对 Agent 工程，能直接迁移的不是“再做一个大模型”，而是 typed skill、preflight、postcondition、短 chunk、恢复态回归与 trace provenance。生成式世界也不等于可信数字孪生，必须对生成区域做标注和物理负控，并与确定性引擎、真机回放对齐。

## 产品：先分清成熟度，再谈规模

本周 7 个重点产品和部署对象，覆盖预售、概念机、展会演示、客户试点、小规模生产部署和平台多 OEM 采用。最强的客户侧证据来自 **CJ Logistics × Olive Young**：9 月 3 日，两台双臂人形机器人进入 Olive Young 龙仁物流中心，在真实订单包装线上放入缓冲纸。这是**两台、单工序的小规模生产部署**，高于受控测试，但远非规模部署。[Seoul Economic Daily](https://en.sedaily.com/finance/2026/09/03/cj-logistics-deploys-humanoid-robots-at-warehouse-in-korean)、[The Korea Times](https://www.koreatimes.co.kr/business/companies/20260903/cj-logistics-deploys-humanoid-robots-at-warehouses-in-korea)和[Humanoid Guide](https://humanoid.guide/cj-logistics-deploys-two-humanoids-on-olive-young-packing-line/)均有报道。

这套系统由 Robotis 本体、Aidin Robotics 机器人手、CJ 控制技术和 RealWorld AI 的 Robot Foundation Model 组成，公开描述为融合视觉、传感器和仿真数据。它的价值不在“像人”，而在复用为人设计的工位，并以真实包装数据迭代跨 SKU 泛化。不过，节拍、吞吐、成功率、在线率、人工介入、MTBF、售价、租赁和单位订单成本全部未披露。适合的软件产品，是按工序计费的验收与运维平台，把每小时合格箱数、每千箱介入次数、重试率、占线时间与版本回滚关联起来。

其余对象必须按阶段看：

- **Galbot ET1/G1**：ET1 于 9 月 3 日开订，公司称 24 小时获得 200+ 预订，这只能证明预售兴趣；ET1 还出现 **1,230mm/30kg** 与 **173cm/65kg** 两套冲突参数，本文保留警示。G1 在 IFA 完成取货演示，另有公司所称 170+ 无人零售单元、40+ 城市和药房背景，成熟度高于 ET1，但仍需区分公司口径。来源：[开订信息](https://post.smzdm.com/p/avgwzmvn/)、[官方 X](https://x.com/GalbotRobotics/status/2095983489673810356)、[IFA 报道](https://www.techtimes.com/articles/326666/20260904/galbot-g1-ifa-2026-robot-working-real-pharmacy-shifts-brings-china-spy-law-europe.htm)。
- **Tuya Doova**：9 月 4—5 日在 IFA 发布，面向独居老人，提供移动感知、对话、告警与 AIoT 联动；呼救后 60 秒无响应，就向家属发起双向视频告警，由家属或照护者判断救援。没有价格、上市、家庭试点或长期运行数据，阶段仍是展会发布/受控展示。来源：[Tuya](https://www.tuya.com/news-details/tuya-smart-brings-full-stack-ai-into-everyday-life-at-ifa-2026-Kfxbtt88aw2t0)、[PRNewswire](https://www.prnewswire.com/news-releases/tuya-smart-unveils-doova-at-ifa-2026-an-ai-home-companion-robot-designed-to-support-independently-living-seniors-302870623.html)。
- **iRobot Roomba Duo**：主机携带并投放超薄子机，共享地图与维护基站。官方明确称其为 prototype/concept；记者不能触摸或查看内部，设备还需两人搬运。它只能算受控展台概念验证，没有价格、发售日和长期耐久数据。来源：[iRobot](https://media.irobot.com/2026-09-04-iRobot-Unveils-Roomba-R-Duo-at-IFA-2026,-Proving-the-Future-of-Floor-Care-Has-a-Familiar-Name)、[The Verge](https://www.theverge.com/tech/990045/irobot-roomba-duo-concept-robot-vacuum)。
- **Realbotix × 欧洲电信公司**：未具名客户试点人形演讲、活动支持和多人互动，但客户名、数量、地点、周期、合同额和转采购条件全部缺失。企业现场的真正成本可能是内容审核、提词、敏感问题拦截、现场安全员与后台接管，而非硬件本身。来源：[GlobeNewswire](https://www.globenewswire.com/news-release/2026/09/03/3355897/0/en/onconetix-acquisition-target-realbotix-launches-pilot-with-leading-european-telecommunications-company-to-deploy-humanoid-robots-in-live-presentations-and-events.html)。
- **MagicLab**：X1 与 D1 在 IFA 共享模拟生产环境，属于受控 Demo；D1 在追觅工厂执行抓取、跨区运输和上料，是更强的真实部署证据；AliExpress Brand+ 则是渠道商业化。订单簿 11 亿元、累计交付 12,000 台、90%+ 长流程成功率都是公司口径，缺少独立审计。来源：[深度报道](https://www.techtimes.com/articles/326650/20260904/magiclab-humanoid-robots-reach-ifa-2026-vla-models-deployed-spy-law-applies.htm)、[渠道公告](https://www.prnewswire.com/news-releases/aliexpress-brand-emerges-as-a-global-launchpad-for-cutting-edge-innovation-at-ifa-2026-302869997.html)。
- **D-Robotics Sunrise/RDK**：从 5 到 560 TOPS 的芯片、开发板、OS 和软件栈，已被 TCL hey AiMe、Vbot SuperDog、xLean TR1 等多个 OEM 采用。终端采用比单纯发芯片更有意义，但稿件没有给出板卡、功耗、价格、软件 SLA 和出货拆分。来源：[IFA 发布](https://www.prnewswire.com/news-releases/d-robotics-at-ifa-2026-the-computing-platform-powering-the-next-generation-of-home-robots-302869818.html)、[产品页](https://en.d-robotics.cc/)。

判断标准由此更清晰：展会 Demo 看机械耐久、异常恢复和人在环；客户试点看转采购标准；生产部署看节拍、在线率、接管率与单位任务成本。预订、渠道合作和公司订单口径都不能替代交付与客户验收。

## 标准与政策：分层架构进入公共语言

9 月 1 日实施的 **GB/T 47245—2026《机器人智能控制系统总体架构》**，从硬件层、操作系统层、中间层到算法层规定了逻辑架构和主要功能。[市场监管总局](https://www.samr.gov.cn/xw/zj/art/2026/art_26c874532f4c4f318d3dcaf04e7cdfac.html)与[上海市药监局转载清单](https://yjj.sh.gov.cn/zjyw/20260901/4eafb0cb26424fdfa60955a00a.html)提供官方依据。它是推荐性国标，不等于立即强制认证；但项目规范、接口适配、测试验收和招投标语言可能逐步采用分层表达。软件机会包括分层接口一致性测试、能力描述、时延预算、版本兼容、仿真模型、SBOM 与合规证据生成。

中国还有两条政策线。9 月 4 日公开的工信部《人工智能中小企业创业支持计划（2026—2028年）》提出新培育科技和创新型中小企业 **1 万家以上**、专精特新“小巨人”突破 **2,000 家**，并各建设 10 个孵化器、公共服务平台和特色产业集群。与具身智能直接相关的是普惠算力、工业数据、链主场景、孵化空间、耐心资本和安全合规服务，而不是全国统一的单企现金补贴。来源：[工信部](https://www.miit.gov.cn/jgsj/qyj/wjfb/art/2026/art_86c400b4473849818629663a94a6d44b.html)。

深圳《推动人工智能与应用发展行动计划（2026—2028年）》提出，到 2028 年智能终端/智能体应用普及率超过 90%、AI 核心产业超过 3,000 亿元、企业超过 3,000 家，并点名人形与服务机器人、养老设备、具身数据平台、世界模型、产业基金和国际标准；文件没有披露单项补贴上限或新增基金规模。来源：[深圳市政府](https://www.sz.gov.cn/cn/xxgk/zfxxgj/tzgg/content/post_12966979.html)。

海外严格时间窗内，没有检出与中国三项政策/标准同量级的专项新政，这不能外推为“绝对没有”。欧盟 9 月 2 日在欧洲议会举行 AI 机器人战略讨论并展示 20—30 台机器人，属于议程和协调信号，不是正式立法或新增拨款；美国本周 G20 声明不是机器人专项；日本、韩国、新加坡未检出新增专项政策。韩国 2026 年 Physical AI 预算、日本 AI Robotics Strategy、新加坡 Punggol Digital District 测试场和 NIST 数字孪生标准研究只能作为窗口外背景。

## 资本与市场：给模型、感知和部署分别定价

本周的大额信号并不都能计作收入或已部署产能。**Figure × Nscale** 9 月 3 日宣布多年度算力合作，潜在最多 100,000 枚 NVIDIA GPU，初始计算承诺 **35 亿美元**、可扩至超过 **60 亿美元**，首批目标为 2027 年下半年。这是未来承诺，不是现金融资或已安装算力。来源：[Nscale](https://www.nscale.com/press-releases/nscale-and-figure)、[Reuters](https://www.reuters.com/technology/ai-cloud-firm-nscale-commits-compute-worth-35-billion-figures-robotics-ambitions-2026-09-03/)。

**PlusAI** 拟通过 SPAC 上市，投前股权估值约 **8 亿美元**、潜在资本约 **3 亿美元**；HyperFoundry 公司披露已产生 **2,500 万美元收入**。交易仍受赎回、监管与交割条件影响。来源：[交易公告](https://www.cohencm.com/news/plusai-a-leader-in-physical-ai-pioneering-ai-based-virtual-driver-software-to-become-publicly-listed-through-business-combination-with-texas-ventures-acquisition-iii-corp)、[CNA/Reuters](https://www.channelnewsasia.com/business/autonomous-trucking-software-firm-plusai-go-public-in-800-million-spac-deal-6360441)。**Lyte** 完成 **1.65 亿美元 C 轮**、投后估值 **16 亿美元**，资金投向同步感知芯片、4D coherent vision 与空间软件。来源：[Globes](https://en.globes.co.il/en/article-physical-ai-perception-co-lyte-raises-165m-at-16b-valuation-1001554229)、[Pulse 2.0](https://pulse2.com/lyte-raises-165-million-series-c-at-1-6-billion-valuation/)。

窄场景也在获得资金。**Hivebotics** 获 600 万美元 A 轮；公司称 Abluo 已在 20 个站点累计约 10,000 小时，用 5 分钟人工检查替代约 30 分钟人工清洁，但这些运行数字尚未得到客户侧运维记录支持。任务边界和质量验收清晰，使它比开放通用人形更接近商业闭环。来源：[The Business Times](https://www.businesstimes.com.sg/companies-markets/robotics-startup-hivebotics-raises-us6-million-series-round-led-vertex-ventures)。

**WorldMind** 成立当月获元生资本“数千万元”种子轮，资金投向世界模型训练基础设施、多模态数据和团队；金额与赛事成绩报道高度同源，仍是单源待验证。来源：[创业邦](https://www.cyzone.cn/article/845618.html)、[智东西](https://zhidx.com/p/591288.html)。**Locus Robotics** 据报 G 轮已募 4,160 万美元，但未找到公司公告或 SEC Form D，估值、规模和用途都应降级为单源。来源：[FinSMEs](https://www.finsmes.com/2026/09/locus-robotics-raises-41-6m-in-series-g-funding.html)。

窗口外仍有结构性参照：Motion 以 200 万美元 pre-seed 做 Humanoids-as-a-Service，承担选型、融资、数据、IT 集成、保险、合规与车队管理；Reframe Systems 以机器人微工厂和制造软件切入住宅建造。它们提示，部署运营商和垂直生产系统可能比通用本体更快形成收费入口。总体上，资本不再只押本体，也押模型、感知、数据、仿真、算力和部署；对软件团队，更现实的路径是先用工具收入、RaaS/HaaS 或运维服务验证价值。

需求侧也开始购买“工作系统”。**美国 ARM Institute** 获近 9,000 万美元，为 10 个项目在两年内向 12 个军事制造基地交付可运行方案，每个方案还必须包含 workforce readiness。这不是某家机器人的订单，却说明买方要求机器人/physical AI、培训和组织准备共同交付。来源：[ARM Institute](https://arminstitute.org/news/oib-2026/)。

**Wandercraft Calvin-40** 公司称已有 12 家蓝筹客户，Renault 计划未来 18 个月部署 350 台。350 台是计划，不是已交付或已验收订单；客户合同额、成功率、接管率和每小时成本未披露。来源：[公司稿](https://www.globenewswire.com/news-release/2026/09/04/3356576/0/en/wandercraft-secures-12-calvin-40-customers-as-it-accelerates-commercial-dominance-in-industrial-humanoids.html)。

韩国 2027 年预算草案把半导体、physical AI 和 AI 数据中心列为三大项目，合计 **21.3 万亿韩元**；媒体对 physical AI 子项给出 **5,000 亿**和 **2.6 万亿韩元**两种口径，不能相加，需等官方预算书。预算仍待国会审议，不能视作已拨款合同。来源：[Korea Times](https://www.koreatimes.co.kr/economy/policy/20260901/govt-bets-big-on-ai-chips-for-2027-budget-to-compete-in-global-tech-race)、[Seoul Economic Daily](https://en.sedaily.com/finance/2026/09/01/korea-earmarks-44-trillion-won-for-housing-213-trillion-for)。

**AGIBOT WORLD 第三期**据两家媒体报道开放 11,430 条真机交互轨迹、14 类任务，包含成功、失败和人工介入，并有 98,000+ 细粒度状态标注的公司口径。数据产品正在从“成功示范”走向失败、干预和奖励信号，但仍需审计实际下载、许可和传感器完整性。来源：[Interesting Engineering](https://interestingengineering.com/ai-robotics/video-chinese-firm-releases-11430-robot-trajectories-to-advance-research)、[钛媒体](https://www.tmtpost.com/8129653.html)。

新华网 9 月 7 日援引业内数据称，2026 年中国人形机器人累计交付客户约 **1.5 万台**、市场规模 **20 余亿元**，但未附统计方法，应按单源待验证。更具操作意义的是报道中的客户要求：工业客户通常希望 **2—3 年回本**；重复任务里，99% 成功率仍可能频繁产生失败。来源：[新华网](https://www.news.cn/tech/20260907/91eff00212a84c0bba1ca6894b460a61/c.html)。

## 用户验收：失败责任与数据治理进入合同

客户侧证据可以归纳为六个条件。第一，任务边界要窄且可验收，清洁、包装、搬运、导览、实验器具操作更容易定义成功。第二，连续运行和人工接管优先于单次 Demo，至少披露成功率、在线率、接管分钟/运行小时、MTTR 与恢复率。

第三，数据与隐私进入合同。Osaka Metro 的 Gemini 人形站员实证明示 RGBD、麦克风、眼球相机用途和部分数据处理，并提醒生成式回答不保证准确完整；它是客户侧实验，不是正式采购。来源：[Osaka Metro](https://www.osakametro.co.jp/page/20260821_humanoid_ekiin.php)。

第四，养老必须保留责任升级链。Doova 和 Donut Robotics 的 cinnamon 都应优先承担对话、巡逻、告警与护士呼叫分级，不能在 VLA 和安全体系不成熟时承担身体护理。高风险养老与公共空间也不能只靠免责声明，还要有数据目的限制、错误路由、人工接管、责任升级与离线降级。

第五，本地集成、融资和售后不可缺。GMO AIR 在日本代理 Unitree 时，同时提供软件开发、租赁与运维，说明渠道层本身也能形成利润池。来源：[GMO AIR](https://prtimes.jp/main/html/rd/p/000005506.000000136.html)。第六，**99% 仍不够**：重复 100 次可能失败 1 次，必须建立安全降级、失败证据链和可撤销操作。与此同时，遥操作、内容审核、安全员、人工复位、维护和异常处理都是后台人力；不计入 TCO，会高估 ROI。

## 入局路径：优先做控制平面

对拥有软件工程与 AI Agent 背景的团队，更可行的路线不是立刻造通用人形本体，而是先掌握运行系统的控制平面。

**立即学习**可以分三组：一是 ROS2、LeRobot 与一套仿真环境，跑通数据采集、策略评测、server/client 和 dry-run，而不是先买昂贵本体；二是 typed skill、precondition、postcondition、artifact freshness、补偿事务和单调 workflow pointer；三是机器人 SRE 与安全，包括日志/视频/轨迹关联、SBOM、签名 OTA、最小权限、安全急停、HIL 回归和事故复现。

**可做的 Demo**也应围绕可验证性：

1. **VLA Runtime + Replay Debugger**：高层模型只提出技能，运行时负责前置检查、权限/空间约束、结果验证和恢复；首版只接 RoboTwin/LIBERO。
2. **Failure Recovery Bench**：把失败 trace 生成恢复态用例，输出 RSR、RD、RC、接管率和版本差异。
3. **Real-to-Sim 可信编排层**：连接 Atlas/生成式重建与 Isaac、MuJoCo、ROS、LeRobot，对生成区域做标注、物理负控、批量回放和差异报告。

**合作方向**包括三类：与有真实窄工序的物流、清洁、工业系统集成商合作，先取得失败日志和接管数据做验收工具；与本体厂及多 OEM 平台定义跨本体能力描述、动作 schema、标定与驱动兼容测试；与数据/遥操作团队共建失败、干预、恢复和奖励标签闭环，而不只出售成功示范。

**投资观察**则包括六维力/力矩、触觉阵列、微型执行器和一体化关节等高壁垒部件；任务编排、车队运维、仿真回归、合规证据与远程接管平台；以及能够公开客户侧持续运行、复购、接管率和单位任务成本的窄任务机器人公司。

相反，三条路线暂不建议：没有供应链、客户工序和长期资本就从零造通用人形本体；没有独家数据、客户或硬件渠道就做通用 VLA 包装层；把展会 Demo、预订、框架合作、计划部署和算力承诺直接当成收入或规模化证明。

## 八层技术栈：软件机会在哪里

| 环节 | 本周证据与边界 | 软件 / Agent 切入 |
|---|---|---|
| 上游硬件与供应链 | 力觉、触觉、关节、灵巧手与边缘计算决定接触能力、寿命和成本；D-Robotics 出现多 OEM 采用 | 标定自动化、驱动/BSP、热与功耗观测、兼容测试、数字模型、SBOM |
| 本体与运动控制 | 双足、轮式、双臂、清洁双机各有工序；工厂仍依赖控制器、ROS 与安全门 | 动作 mask、限位、坐标/维度适配、HIL、dry-run、停机和恢复 |
| 数据层 | AnyWorld 做跨本体生成，AGIBOT 与 Recover 强调失败、干预和恢复 | 轨迹评分、失败聚类、数据血缘、许可、LeRobot 转换、反事实集 |
| 仿真与训练 | Atlas 降低捕获门槛但存在物理幻觉；RoboSPA/Recover 推动复杂度和失败态评测 | 场景版本化、物理负控、回放回归、sim-real 差异、ROI 模拟 |
| 模型与算法 | world model 用于经验、等价、预测/价值条件，层级计划与短反馈受重视 | planner/predictor/executor、typed workflow、置信度路由、memory provenance |
| 开发工具链 | GigaBrain 呈现模型仓、训练评测、server/client 和 dry-run；EmbodiedSkills 呈现契约 | Robotics CI/CD、技能 SDK、replay debugger、可观测、灰度、回滚 |
| 系统集成与应用 | CJ 包装、Hivebotics 清洁、MagicLab 工厂说明窄任务先落地；养老/公共空间需人在环 | WMS/MES/SAP/AIoT、SLA、工单、接管调度、隐私、内容安全 |
| 商业生态 | 大算力承诺与小场景融资并存；Motion/GMO 显示运营、租赁和售后可独立收费 | 多 OEM 控制、按任务计费、合规证据、资产监控、客户 ROI 仪表盘 |

供应链的优先级也不能只按“国产零件数量”判断，而要看成本、技术控制权、关键失效点、工具链、测试与生命周期服务。

1. **力觉/触觉**：六维力/力矩传感器、触觉阵列和电子皮肤需要量产一致性、温漂补偿、封装耐久与自动标定。窗口外材料称，2025 年中国灵巧手销量约 1.92 万只，2026 年预计 7.02 万只，带触觉产品占比超过 60%；这些数字只作背景。
2. **执行器与关节**：无框力矩/空心杯电机、谐波/行星/RV 减速器、行星滚柱丝杠、编码器、伺服驱动和一体化关节，决定功率密度、背隙、寿命、热和维修成本。
3. **灵巧手**：不能只比自由度，还要看负载、速度、寿命、触觉、可换指尖、故障诊断与成本。窗口外材料称主流产品单只价格从 2023 年约 5 万元降至约 2 万元，多数寿命在 30 万次以上，但仍未普遍满足工业长期使用。
4. **边缘芯片/实时软件**：重点不是峰值 TOPS，而是确定性时延、功耗、内存带宽、多传感同步、ROS/中间件适配、OTA 和长期供货。
5. **工控安全**：联网、学习与远程更新后，传感欺骗、策略篡改、固件供应链和工业网络横向移动会与机械伤害耦合。设备身份、可信启动、签名固件、VEX/SBOM、异常检测和安全降级将进入采购清单。
6. **数字孪生接口**：国产关节、夹爪和传感器若同时交付数字模型、标定文件、寿命数据与仿真接口，更容易进入主机厂和海外供应链。

## 收束：用运行证据替代演示叙事

本期信息共同指向八个风险边界：恢复能力比干净初态成功率更接近生产价值；长任务问题不等于模型不够大，任务结构、目标函数和反馈频率可能更关键；后台人是隐藏成本；生成式世界不是可信数字孪生；计划、承诺和预订不是交付；养老与公共空间不能只靠免责声明；国产化不能按零件数统计；逐厂定制 WMS/MES/PLC/SAP 和安全适配还可能吞掉软件毛利，使出货增长不等于利润增长。

下周应继续核验八件事：LIBERO-Recover、RoboSPA 是否真正开放数据、代码、许可证并出现第三方复现；AnyWorld 是否增加大样本真机、接触物理过滤与跨本体泛化；CJ 是否披露节拍、介入率、在线率、持续运行和工序扩展；Figure-Nscale 的最低采购、付款义务、GPU 里程碑与融资；PlusAI 的 S-4、赎回、净现金和 HyperFoundry 收入确认；Wandercraft 350 台计划能否转成合同、交付与验收；韩国预算两种 physical AI 口径的官方拆分；AGIBOT 数据集的下载、许可、传感器字段、任务分布与失败标签质量。

真正值得跟踪的，不是机器人能否在镜头前完成一次动作，而是它能否在失败、恢复、人在环、数据治理、版本回滚和客户成本约束下持续工作。对软件与 Agent 团队，这正是控制平面、回归评测、运维和合规工具开始形成机会的地方。
