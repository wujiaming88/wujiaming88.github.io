---
layout: single
title: "全球 AI 动态周报 · 第 15 期（2026-08-31 ~ 2026-09-06）"
date: 2026-09-07 16:10:00 +0800
categories: [AI]
tags: [周报, AI企业研究, OpenAI, NVIDIA, Anthropic, Broadcom, Sierra, 企业Agent, AI算力]
header:
  overlay_image: /assets/images/posts/2026-09-07-global-ai-weekly-header.png
  overlay_filter: 0.45
  caption: "全球 AI 企业研究周报 · 第 15 期"
excerpt: "前沿能力开始与安全边界一起出售，企业 Agent 继续深入执行层，算力竞争则延伸到园区、融资信用与长期客户联盟。"
toc: true
toc_sticky: true
---

# 全球AI企业周报：能力边界、企业执行与算力联盟

**观察期：2026年8月31日至9月6日**

这一周，企业竞争的共同变化并不只在模型分数或单次产品发布。前沿能力开始与访问控制、实时监控和数据边界一起出售；企业Agent的价值继续向上下文、执行位置、可观测性与垂直交付移动；算力供给则越来越依赖芯片、网络、园区、融资信用和长期客户组成的联盟。与此同时，匿名信源、公司自报、远期规划与公开信息静默仍需严格区分。

## 本周先看五件事

1. **NVIDIA同意以129.303亿美元收购Hugging Face。** 交易尚未完成，监管、交割与平台中立承诺仍待验证；详见[开发者入口与算力融资](#开发者入口与算力融资)。
2. **Broadcom公布高增长财务数据与GW级定制XPU路线。** 当期数字来自公司财务公告，远期项目与收入展望仍是前瞻口径；详见[定制芯片进入多年容量路线](#定制芯片进入多年容量路线)。
3. **OpenAI发布GPT-6 Astra。** 它把高端代理能力、双云分发、分级准入和实时监控放进同一企业产品，但受限能力不能等同于普通客户可用；详见[高危能力怎样交付](#高危能力怎样交付)。
4. **Anthropic—Lambda约350亿美元、350MW云合同见诸报道。** 核心金额与容量来自匿名信源，各方当时未回应，必须保留“据报道、若属实”；详见[园区级合同仍待确认](#园区级合同仍待确认)。
5. **Sierra任命CFO并披露两亿美元ARR阶段。** ARR与客户覆盖均为公司自报，部署覆盖也不等于全组织高频使用；详见[垂直交付如何建立壁垒](#垂直交付如何建立壁垒)。

## 三条竞争主线

### 安全边界成为产品边界

OpenAI以Critical分级、Daybreak计划和实时监控发布Astra；Google通过Fairwind Program把Cyber能力限量提供给可信政府、关键基础设施运营者和软件维护者；Anthropic让Enterprise Frontier Safeguards（EFS）的活动数据留在客户自己的云账户；Perplexity把敏感步骤放到Mac本地；Cursor则把执行环境放进客户网络，但推理、规划和agent loop仍留在云端。

这些方案都可能被称为“私有”或“受控”，含义却不同：有的是模型访问名单，有的是日志归属，有的是本地敏感步骤，有的是客户执行面。采购方需要分别确认推理、执行、日志、轨迹、密钥和控制面的位置。谁能在高危能力、数据主权与误拦截之间给出可审计的权衡，谁就更可能进入金融、政府、医疗和关键基础设施；但不能把营销中的同一个词当成相同安全能力。

### 算力竞争延伸到资本信用

NVIDIA既向开发者分发入口上移，又据报道以租约参与Lambda园区合同链；AMD与Cisco、HUMAIN组成开放机架样板；Broadcom以定制XPU和网络获得GW级客户项目可见性；Oracle通过客户预付、BYOH、债务和股权支持超长RPO；Lambda若落实报道中的合同，将neocloud竞争抬到园区级。

母稿的判断是，算力供应商正在用资产负债表、开发者分发或客户预付锁定未来需求，竞争不再只看每卡性能。相应风险也从芯片性能扩展到循环交易、残值担保、客户集中、建设延期，以及远期GW计划无法兑现。资本信用可能成为护城河，也可能成为系统脆弱点。

### Agent利润池转向企业深处

Glean争夺权限感知的企业上下文，Databricks把Unity治理、Genie与Gateway trace串联起来，Cursor争夺客户执行面，Microsoft把代理放入确定性工作流和人工审批；Harvey与Sierra则分别用法律工程、Voice运营和组织级部署进入垂直流程。

母稿据此判断，通用模型逐渐成为可替换供给后，更难替换的是企业记录、权限、执行位置、故障成本与领域责任。平台公司可以借已有数据和治理体系吸收Agent预算；垂直公司能够以高接触交付建立深度，却要承担长销售周期和毛利压力。接下来，仅看“部署客户数”已经不够，还要看活跃使用、净留存、任务成功率、人工接管率和交付成本。

## 高危能力怎样交付

OpenAI的GPT-6 Astra在9月3日进入ChatGPT付费档、API、Azure和AWS Bedrock，API价格为每百万输入/输出token 10/50美元。公司称，Astra在内部20个近期V8高危漏洞测试中利用了两个零日漏洞，因此达到Preparedness Framework网络安全Critical阈值；Critical能力只向可信测试者和Daybreak计划逐步开放。公司自报OSWorld 2.0为72.6%、ExploitBench为100%。这些benchmark和漏洞测试均非独立评测，受限能力也不能写成普通客户已经可用。

这次发布延续了OpenAI同周的价格分层。9月1日预览的GPT-5.6 Sol、Terra、Luna分别对应旗舰、均衡与低成本档，价格依次为每百万输入/输出token 5/30、2.5/15、1/6美元；自动红队投入超过70万A100等效GPU小时。8月31日，公司还自报ChatGPT Ads上线不足200天即达到10亿美元年化收入运行率，覆盖40多个国家，ChatGPT周活跃用户超过10亿，并扩展自助广告购买区域。由此形成广告、订阅、企业服务和API并行的经营架构：低价层维持开发者规模，高价Astra承接复杂任务，广告补贴免费流量。风险包括网络误用、实时监控误拦截、企业隐私和广告独立性。

来源：[ChatGPT Ads里程碑](https://openai.com/index/expanding-access-to-ai-with-chatgpt-ads/)、[GPT-5.6预览](https://openai.com/index/previewing-gpt-5-6-sol/)、[Path to Astra](https://openai.com/index/path-to-astra/)、[GPT-6 Astra](https://openai.com/index/gpt-6-astra/)。

Google在9月2日发布六周内第三个Flash版本Gemini 3.8 Flash，并推出Cyber版。Cyber通过Fairwind Program限量提供给可信政府、关键基础设施运营者和软件维护者。3.8 Flash定价为每百万token 0.75/3.75美元；公司自报HLE-Verified 54.9%、内部漏洞基准成功率超过70%，CWE-Bench补丁pass@1为47.2%。Google以低价模型、Workspace入口和Cloud治理进行组合销售，单位任务成本可能比单一benchmark更重要；Cyber误用、版本碎片化仍是风险。

同周，Vids支持从Docs、PDF和Word生成视频摘要；持久指令扩展到Drive、Chat、Slides、Sheets和Gmail；Workspace Studio增加跨应用动作；Notebook增加审计日志和BigQuery导出。CNBC称企业版新增按量计价、最高20% token折扣、代理月度开支上限和零美元基础订阅，并称近四分之三Google Cloud客户使用AI产品，相关支出约比原承诺高50%。Notebook数据全球存储且不支持区域化，是政企采用的明确风险。来源：[Gemini 3.8 Flash/Cyber](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/)、[CNBC分析](https://www.cnbc.com/2026/09/02/google-starts-september-with-ai-momentum-after-long-losing-streak.html)、[Workspace Updates](https://workspaceupdates.googleblog.com/2026/)。

Anthropic的EFS把安全与数据主权做成企业产品。活动数据保存在客户自有AWS、Azure或Google Cloud账户，客户控制密钥、访问和审计；自动检测不要求员工人工查看，风险标记交还客户。公司称EFS由100多家客户共创，覆盖约四分之一财富100强和所有美国全球系统重要性银行，但这不能推导合同规模。

EFS的产品化发生在更复杂的运营背景中。Anthropic披露，过去一个月曾暂停外部网络评测、部分内部评测和较高风险RL环境；4月生产RL环境曾冻结约一个月重构，超过10%的生产RL环境组合被标记存在奖励作弊、任务损坏或配置问题。9月3日，CNBC报道暗网生态批量账号蒸馏Claude输出；同日Claude发生多模型停机并恢复。训练环境缺陷、越权评测、蒸馏与停机，使竞争焦点进入运营安全和IP防御。来源：[Enterprise Frontier Safeguards](https://www.anthropic.com/news/enterprise-frontier-safeguards)、[安全实践整改](https://www.anthropic.com/news/improving-alignment-security-efforts)、[CNBC蒸馏调查](https://www.cnbc.com/2026/09/03/anthropic-distillation-battle-turns-to-dark-web-china-concerns-swell.html)。

## “本地”和“自托管”的边界

Perplexity在Mac版Computer中推出Hybrid Compute：同一任务可拆给云端前沿模型与Mac本地模型，私密文件或敏感信息步骤在本机完成；信息离机前可以保持本地、掩码、拒绝或请求同意，姓名、地址和账号等以占位替换。公司还开放了相关PII分类器。支持环境为Apple Silicon、macOS 15+，至少24GB统一内存、建议32GB。PII-TRACE的13,148段合成对话、13种语言和37,431个标识符提及仅有技术媒体复述，应按单源警示看待。

这让Perplexity从答案引擎走向可执行Computer，并把数据边界放进任务编排。不过，本地步骤仍由云端代理编排，用户仍需审计输出、轨迹和哪些信息离机；高内存门槛会限制设备基数，PII识别也不能保证零漏检。官方原页访问受限，事实由两篇媒体交叉。来源：[官方公告入口](https://www.perplexity.ai/hub/blog/introducing-hybrid-compute-on-mac)、[9to5Mac](https://9to5mac.com/2026/09/01/perplexity-launches-privacy-minded-hybrid-compute-ai-feature-for-mac/)、[MarkTechPost](https://www.marktechpost.com/2026/09/01/perplexity-releases-hybrid-compute-on-mac-cloud-agents-orchestrate-down-to-a-local-model-gated-on-device/)。

Cursor的Self-Hosted Machines则把工具执行、代码编辑和命令运行放在客户自管网络与机器，但推理、规划和agent loop仍在Cursor云端。机器通过长期出站HTTPS连接worker，并支持单机和弹性Pools。因此，“自托管”只迁移执行环境，不等于完全本地；工具输出、代码和轨迹的回传边界仍需审计。来源：[Self-Hosted Machines](https://cursor.com/blog/self-hosted-machines)。

## 平台聚合与生命周期信号

AWS本周没有可确认的同量级自研前沿模型、重大AI合同、GPU/Trainium容量投产或CapEx公告。可见变化在Bedrock渠道：Astra进入Bedrock，Anthropic EFS支持Bedrock并允许活动数据留在客户自有S3；Amazon Linux 2027预览支持Neuron和AI/ML工作负载，但只属于基础系统预览。Bedrock定价页显示部分模型批量推理较按需低50%，这只是当前价格状态，未证实为本周新增。AWS本周的价值在模型中立采购、计费、权限和服务等级聚合，而非自研能力跃迁；模型越多，治理价值越高，政策、版本、审批和渠道支持责任也越复杂。静默只限公开渠道，不能排除未公开项目。来源：[Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)、[AWS Weekly Roundup](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-welcome-ducklabs-to-the-team-agentic-resource-discovery-ard-and-more-august-31-2026/)、[Amazon Linux 2027](https://aws.amazon.com/about-aws/whats-new/2026/09/announcing-amazon-linux-2027/)。

xAI可核验的主要是生命周期和运营可靠性。文档在9月新增`grok-imagine-image-quality`退役计划，11月2日后将路由到2.0低质量档，价格更低、接口不变。官方Release Notes仅把Grok 4.6与Grok Bot列在“August”，没有具体日期；Grok Build 0.1的搜索摘要与官方月份归类冲突，因此不能记作本周首发。9月3日Grok与ChatGPT、Claude同日中断并恢复；媒体猜测Azure原因，但Microsoft否认，根因不能归因。Grok 4.6的50万上下文与2/0.5/6、4/1/12美元价格只作8月背景。企业客户需要多模型回退和故障降级；Grok 4.7若下周发布，应进入下一时间窗。来源：[xAI Release Notes](https://docs.x.ai/developers/release-notes)、[xAI News](https://x.ai/news)、[停机报道](https://9to5google.com/2026/09/03/chatgpt-claude-grok-outages/)。

Meta则把开放权重叙事部分转向收费API。媒体9月3日报道Muse Spark 1.3通过Meta Model API收费，随后计划进入Instagram、Facebook和Meta AI；它重点提升编码和代理任务，支持并行工作流、长指令保持、局限性认知及不可逆动作前确认。Meta尚未决定是否开放1.3权重，但仍计划开放1.2。标准价为每百万输入/输出token 1.25/4.25美元；允许提示和输出用于未来训练的客户可获0.10/0.20美元贡献者价，平均折扣约95%。相较1.2，所需token减少25%；部分开发者每周数万亿token调用是媒体口径，1450亿美元2026 CapEx也只是背景。

低价既是获客，也是在购买真实代理轨迹。企业若不隔离可贡献与不可贡献数据，折扣可能转化为机密、IP和合规风险。来源：[Bloomberg转载](https://www.mercurynews.com/2026/09/03/meta-releases-more-powerful-ai-model-edging-closer-to-rivals/)、[TechCrunch定价分析](https://techcrunch.com/2026/09/03/meta-is-paying-to-peek-at-how-you-use-their-latest-ai-model/)、[CNBC法律与CapEx背景](https://www.cnbc.com/2026/09/02/meta-18-billion-settlement-ai-products.html)。

## 中国企业争夺模型、终端和日常入口

DeepSeek在8月31日开放V4系列首个实验性多模态版本V4-Flash-Vision-Exp，采用MIT许可，融合视觉、文本推理与Agent能力。模型总参数约305B，每token激活13B，约占4.6%；模型卡自报DeepSWE 59.3%、ZeroBench 35.0、Agents’ Last Exam 27.3，部分榜项领先对照模型，但NL2Repo、DSBench-Hard仍落后。完整权重和推理实现降低了私有化门槛，也把DeepSeek从低价文本推理带向“看界面、操作软件”；不过模型仍是实验版，稳定性、生产成本与稀疏路由在长尾任务上的表现没有验证，跑分也缺少独立生产评测。来源：[官方模型卡](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-Vision-Exp)、[网易转述](https://www.163.com/dy/article/L5NTS4080556OXHR.html)、[腾讯研究院转载](https://www.sohu.com/a/1070192038_455313)、[新浪交叉来源](https://k.sina.cn/article_7879777297_1d5abdc1106801lyw2.html)。

智谱AI把Token直接放到天猫零售。9月2日上线的GLM Coding Plan包括个人Lite、Pro、Max及团队席位，基于GLM-5.3并适配20余款编程Agent；个人月费分别为118、538、1078元，团队版598元/席且至少两席。报道结合中报指出，2026年上半年收入9.54亿元、同比增长399.7%，毛利2.52亿元、增长163.7%，归母净亏损20.7亿元、收窄12.1%；开放平台及API收入8.25亿元，占86.5%，同比约增2736%。这些中报数字是本周报道引用，不是9月2日首次披露。Token商品化可以触达个人开发者和中小团队，并测试固定月费的价格接受度；但Pro从149元升到538元、约3.6倍，报道时又缺可见销量，单位经济与高亏损仍未闭合。来源：[新浪科技](https://finance.sina.com.cn/tech/roll/2026-09-02/doc-iniqmfta7809871.shtml)、[观察者网](https://www.guancha.cn/economy/2026_09_02_829711.shtml)、[东方财富/上证报转载](https://finance.eastmoney.com/a/202609023862763890.html)。

月之暗面/Kimi的动态必须留在传闻层。9月2日至3日，多家媒体称公司以保密形式向港交所递交A1并推进Pre-IPO融资；公司回应“不予置评，暂无可披露信息”。媒体或知情人士还给出投前估值约500亿美元、7月F轮超过35亿美元且投后估值350亿美元、ARR从3月1亿美元升至6月中旬3亿美元、K3后日销售额增长超过6倍等数字。没有招股书或公司正式文件前，这些都不能写成已确认递表、估值或经营数据。若递表属实，竞争才可能进入财报、算力开支和资本效率透明化阶段；高估值、VIE、审核、ARR真实性与递表状态均是重大不确定性。来源：[澎湃](https://www.thepaper.cn/newsDetail_forward_34000023)、[腾讯新闻](https://news.qq.com/rain/a/20260903A056P500)、[香港商报](https://www.hkcd.com.hk/hkcdweb/content/2026/09/03/content_8773028.html)。

MiniMax把H3 Max 768P、480P接入官方开放平台和MiniMax Design。该版本由fal基于开放权重H3优化，开发者随后搭建互动频道、24小时AI直播站、状态化虚拟世界与数字人直播。公开演示称，5秒768p带声音视频生成少于3秒，吞吐约为原H3的35倍；H3三周下载超过2400万次，衍生模型超过300个，小样本4条视频成本4.95元。这里的场景仍是社区实验，不是客户订单。竞争轴正在从画质转向“延迟、成本与连续性”，但审核、版权、角色一致性、稳定性和持续调用成本决定它能否成为商业基础设施。来源：[腾讯研究院转载](https://www.sohu.com/a/1070192038_455313)、[AI TNT](https://m.aitntnews.com/newDetail.html?newId=28828)。

## 手机与校园成为低门槛入口

字节跳动与中兴/努比亚把豆包手机助手推进量产旗舰的合规链路。9月1日，努比亚NaviX Ultra获得工信部入网许可，计划9月上市；北京日报称，该机完成从端侧大模型备案到终端入网的链路。同期豆包向大学生提供3个月订阅权益和一次额度重置。工程测试机M153定价3499元、3万台售罄只是背景，本周核心是量产机许可与上市计划。若量产顺利，跨应用Agent的系统级入口将直接触及手机厂商的入口控制、隐私授权、系统权限和第三方应用兼容；合作方式也降低了字节自造硬件风险。来源：[每日经济新闻](https://www.nbd.com.cn/articles/2026-09-01/4569224.html)、[北京日报](https://news.bjd.com.cn/2026/09/01/11941684.shtml)、[新浪财经](https://finance.sina.com.cn/roll/2026-09-01/doc-iniqipiw3595519.shtml)。

阿里与腾讯本周更多是校园拉新。夸克在9月1日活动中向认证大学生和教师各提供3个月扫描王VIP与网盘VIP，权益持续至9月30日；Qwen本周没有新基座模型，8月发布的Qwen3.8等只作背景。阿里把AI搜索、扫描和云盘组成校园资料工作流，短期不是高收入事件，但可能沉淀资料资产、搜索习惯和网盘留存；免费转付费、学生数据合规与促销同质化仍待观察。来源：[开学季Token战](https://finance.sina.com.cn/stock/t/2026-09-02/doc-iniqmfta2981602.shtml)、[IT之家背景核对](https://www.ithome.com/0/995/648.htm)。

腾讯WorkBuddy则向认证大学生和教师各发放1000积分：大学生权益至10月31日，教师至9月30日，可用于资料查询、备考、就业咨询和教学办公。Hy4 preview在8月28日发布，仅属背景。腾讯正把模型升级转成高校生产力使用，但促销活跃不等于留存；WorkBuddy、元宝和ima入口分散，效果取决于与微信、腾讯文档的协同。来源：[校园权益报道](https://finance.sina.com.cn/stock/t/2026-09-02/doc-iniqmfta2981602.shtml)、[Hy4背景](https://www.tencent.com/zh-cn/tencent-releases-and-open-sources-tencent-hy4-preview/)。

百度本周保持静默。百度新闻、文心与千帆入口及主流媒体的定向核验，权威结果主要仍是1月文心5.0和5月文心5.1等旧闻；窗口内没有发现新的基座模型、千帆定价或客户、重大资本或组织变化。公开声量相对竞品偏弱，但静默不等于业务停滞，也不能排除未公开客户项目。后续需要可量化调用、收入、客户或新品重新建立节奏。来源：[文心模型入口](https://yiyan.baidu.com/model/intro?lang=zh)、[文心5.1背景，非本周](https://www.qbitai.com/2026/05/414496.html)。

## 硬件路线的外溢不能跨级推断

9月4日公开的ChinaXiv预印本更新经媒体转述，介绍麒麟2026量产芯片的“韬定律/逻辑折叠”实测：以3D混合键合和短垂直互连减少数据搬运，而不只是缩小制程。晶体管密度从1.55亿/mm²升至2.38亿/mm²、增55%；同等性能下NPU、GPU、CPU大核功耗分别下降66%、58%、41%；NPU在29 TOPS下频率下降63%，电压从0.85V降至0.55V，功率密度下降73%；键合间距1.5μm，垂直互连5000万。

这些结果为国产AI硬件提供了从线宽转向互连、封装、EDA和软硬协同的路线证据，但直接对象是移动SoC，不是昇腾或盘古新品；“未来可能优先在昇腾验证”是媒体判断，不能升格为事实，更不能把移动SoC结果等同于数据中心规模验证。DSP功率密度、晶圆翘曲、对准精度、EDA适配和第三方复刻仍是风险。原始论文入口访问受限。来源：[IT之家](https://www.ithome.com/0/998/598.htm)、[科创板日报转载](https://www.163.com/dy/article/L65I8IO10550B1DU.html)、[ChinaXiv原始入口](https://chinaxiv.org/abs/202609.00031)。

## 企业Agent预算流向哪里

### 垂直交付如何建立壁垒

Sierra在8月31日任命Julia Brau Donnelly为CFO，她带来投行、私募股权、Wayfair运营与Pinterest CFO经验。公司自报成立约两年半，第7季度ARR达到1亿美元、第9季度达到2亿美元，并覆盖超过40%的Fortune 50、约三分之一头部银行、全球十大医疗公司中的5家和25%的IBEX 35。这些ARR与覆盖数字没有独立审计，“覆盖”也不等于全组织部署或高频使用。

9月1日和4日，Sierra还发布Voice AI评估与呼叫中心上线指南，要求测试时延、打断、听辨、上下文、行动、护栏和转人工，并把队列、人员、故障恢复、成本和回滚纳入运营；tau-voice包含278项客服任务。公司正在把Voice定义为完整客户运营系统，而非语音合成点产品。CFO到位同时释放组织成熟信号，但误操作、身份、监管、高风险转人工以及净留存、使用量和交付成本仍需验证。来源：[CFO公告](https://sierra.ai/blog/julia-brau-donnelly-joins-sierra)、[Voice AI指南](https://sierra.ai/blog/what-is-voice-ai)、[呼叫中心上线指南](https://sierra.ai/blog/ai-for-call-centers)。

Harvey披露两项机构级部署。9月1日，GE Aerospace在整个Legal & Compliance组织部署Harvey，并成为Contract Intelligence设计伙伴；9月2日，拥有121年历史、8个业务组的澳大利亚商业律所Macpherson Kelley在全部律师和业务组全面部署，决定建立在持续一年的试点与多平台评估上。Harvey的Customer Success和Legal Engineering团队曾现场识别高价值工作流。由此形成“试点—现场法律工程—全组织铺开—共同设计”的路径，同时进入律所与企业法务。高接触交付和长销售周期可以提升切换成本，也可能压缩毛利和复制速度；公告未披露席位、合同额或效率基线，部署同样不等于高频使用。来源：[GE Aerospace部署](https://www.harvey.ai/blog/ge-aerospace-deploys-harvey-across-its-legal-and-compliance-organization)、[Macpherson Kelley全所部署](https://www.harvey.ai/blog/macpherson-kelley-rolls-out-harvey-firmwide)、[Harvey Newsroom](https://www.harvey.ai/newsroom)。

### 上下文、治理和可观测性

Glean把自身从enterprise search重新定义为enterprise context。9月2日，公司强调Agent需要权威来源、实时索引、混合检索、知识图谱、逐次权限执行和多步骤上下文交付，并将MCP或联邦连接定义为“可达性”，而不是上下文质量。本周没有新合同或价格。自有评测称，在复杂企业查询中，偏好评审将基于Glean上下文层的答案判为正确的频率，是基于ChatGPT company knowledge答案的1.9倍；这个自评不能外推。母稿判断，其护城河正从搜索UI迁到权限、知识图谱和索引层，企业采购也可能从连接器数量转向深度、时效、权限和关系理解；Databricks与办公套件巨头都能向这一层竞争。来源：[Glean原文](https://www.glean.com/blog/from-enterprise-search-to-enterprise-context-what-ai-agents-actually-need)、[Glean Blog](https://www.glean.com/blog)。

Databricks把数据治理、Agent分析、可观测性与推理效率串成闭环。9月2日，Agent mode向全部Genie Agents开放多步研究；API支持SSE、连续对话、监控与可视化附件。Agent可同时分析Unity Catalog表和Volumes内的文档、PDF、幻灯片与图像，并继承权限，每个agent最多挂载10个Volumes。

9月1日的内部案例使用Gateway trace配合Genie One，约一小时定位7个工具服务bug。公司估算这些bug每天造成1409次错误、每年49.9万美元token浪费和12023小时等待，合计约120万美元生产力损失。9月4日，Proteus又在Qwen 3.5 122B的部分kernel上相对vLLM取得1.8至5.2倍性能提升。120万美元是内部估算，不是经审计客户ROI；kernel结果也不能外推所有工作负载。平台可以把湖仓预算吸收到Agent运行层，却会增加锁定和复杂分析错误风险。来源：[Genie Agents](https://www.databricks.com/blog/expanding-genie-agents-deep-analysis-file-reasoning-and-more)、[AgentOps案例](https://www.databricks.com/blog/how-we-eliminated-1-million-year-wasted-ai-agent-spend-one-hour)、[Proteus](https://www.databricks.com/blog/achieving-extreme-efficiency-through-specialized-gpu-kernel-generation)。

### 执行控制与工作流入口

Cursor除Self-Hosted Machines外，还用Nokia和Basis案例展示企业执行。公司自报内部合并PR超过60%由Cloud Agents创建。Nokia称，两名工程师用两周分析超过5000万行代码；另一工具约80%自动化了原本需要6至10名管理人员协调的流程。Basis称Form 1065从人类30至40小时缩短到Agent 6至7小时，并服务40%的Top 25 firms。这些均为供应商或客户自报，缺少独立验证，但产品方向明确从IDE席位走向企业Agent执行控制面，也直接压迫Cognition/Devin和传统开发平台。来源：[Nokia案例](https://cursor.com/blog/nokia)、[Basis案例](https://cursor.com/blog/basis)。

Microsoft提出的路径是“代理推理、确定性自动化、人工审批、数据治理”组合。9月3日，公司以采购为例，将Copilot、Work IQ、应用、Dataverse和工作流连接起来；8月31日更新伙伴技能体系，两项旧认证被AI导向认证替代，并规划200多场活动、24场工作坊。竞争优势不依赖单一模型，而在Microsoft 365入口、上下文、Power Platform与Azure闭环；相应风险是集成锁定、治理复杂度和不可预测推理账单。来源：[PPCC 2026](https://www.microsoft.com/en-us/microsoft-365/blog/2026/09/03/ppcc-2026-bringing-ai-and-your-business-processes-together/)、[Partner Center](https://learn.microsoft.com/en-us/partner-center/announcements/2026-august)、[Azure端到端平台](https://azure.microsoft.com/en-us/blog/enterprise-ai-transformation-relies-on-the-end-to-end-platform-azure-was-built-for-this-moment/)。

在中东和非洲，Microsoft与HUMAIN的联合稿称，HUMAIN ONE拟与Microsoft 365（含Copilot、Microsoft IQ）打包并托管于Azure，ALLAM模型计划接入Microsoft Foundry，前线部署工程师支持生产落地，HUMAIN AI PC采用Windows。初始目标覆盖100万企业用户；AI PC计划9月20日企业开售，并以2030年100万台为目标。这些是目标，不是收入。合作显示主权AI客户可以把应用和云交给Microsoft、底层算力拆给AMD与Cisco；但目标用户向付费使用转化仍未知。来源：[Microsoft—HUMAIN](https://www.prnewswire.com/news-releases/microsoft-and-humain-expand-strategic-collaboration-at-leap-2026-with-new-enterprise-ai-offering-and-ai-pc-302865157.html)。

### 创意工具向团队与交互环境扩展

Runway一端展示Solaris交互世界模型：逐帧实时渲染可交互数字环境，以点击、拖拽等作为条件信号继续生成，并由语言模型决定界面演化；公司没有说明客户可用时间。另一端，9月4日上线面向2至9人的Team自助套餐，提供共享credits、项目、存储、评论、agent skills与连接器；每席每月6900 credits、100个共享项目、1TB存储、最多20项共享skills，月付69美元/席，年付折合55美元/月席。8月31日，Ruby调色模型作为独立Tool Mode向付费用户开放。

Solaris仍是研究能力展示，规模化时延、推理成本和交付日期未知；Team则把个人订阅升级为组织席位和共享资产，能否提高ARPU与团队留存仍待数据。来源：[Team Plan](https://runway.com/news/company-news/introducing-team-plan)、[Changelog](https://runway.com/changelog)、[CNET Solaris报道](https://www.cnet.com/tech/services-and-software/runways-new-ai-model-creates-digital-worlds-without-code/)。

## 算力竞争如何锁定未来需求

### 开发者入口与算力融资

NVIDIA在9月3日同意以129.303亿美元收购Hugging Face，并承诺继续支持多云、多加速器和各家开放模型。Hugging Face拥有1800万以上用户、300万以上模型、50万数据集、100万应用，并被20万以上企业使用；NVIDIA此前已贡献500多个模型和250多个数据集。交易让NVIDIA从芯片、网络与系统软件继续向模型分发和开发者入口上移。如果平台维持中立，开发者网络可转化为优化、推理和算力需求；如果排序或服务被认为偏向自家硬件，生态信任会反向成为风险。必须注意，当前只是“同意收购”，不是已完成；监管、交割、员工留任和中立措施仍待验证。媒体提到的约1.5亿美元年化收入是历史背景，不能当成本周公司披露或确定交易倍数。来源：[NVIDIA收购公告](https://blogs.nvidia.com/blog/nvidia-to-acquire-hugging-face/)、[CNBC](https://www.cnbc.com/2026/09/03/nvidia-agrees-to-buy-hugging-face-for-almost-13-billion-ai-expansion.html)、[TechCrunch](https://techcrunch.com/2026/09/03/nvidia-confirms-it-will-buy-hugging-face-for-12-9-billion/)。

NVIDIA还出现在园区融资与专业卡价格两条线索中。Reuters称，NVIDIA据称持有Anthropic—Lambda—Hut 8得州项目的数据中心租约。另一项9月4日的行业价单研究认为，GDDR7紧缺推动RTX PRO 6000 Blackwell工作站版价格上涨：官方价1.6万美元，较2025年3月8565美元MSRP高约87%；云价约为CoreWeave 2.50、AWS 3.36、Google/Oracle 4.50、Azure 5.50美元/GPU小时。专业卡价格不能外推所有训练GPU供需，但显示高显存和内存约束。租约、供芯与投资形成的循环依赖则带来或有责任。来源：[Reuters合同报道](https://www.reuters.com/technology/anthropic-signs-35-billion-cloud-deal-with-nvidia-backed-lambda-source-says-2026-08-31/)、[Reuters授权转载](https://www.aol.com/articles/anthropic-signs-35-billion-cloud-235939000.html)、[RTX PRO价格研究](https://www.thundercompute.com/blog/nvidia-rtx-pro-6000-pricing)。

### 园区级合同仍待确认

Reuters 8月31日援引匿名信源称，Anthropic与Lambda签署约350亿美元、约350MW云协议，项目使用Hut 8在得州Nueces County开发的园区，为Claude提供算力；NVIDIA据称持租约。由此形成芯片商信用支持、数据中心建设、云运营和模型消费的合同链。Bloomberg与WSJ同期交叉，但核心金额、容量仍来自匿名信源，各方报道时未回应；期限、付款、取消和实际投产条款均未知。Hut 8此前15年、196亿美元租约只是窗口外背景。

若合同结构与规模属实，Lambda将从GPU租赁升级为承接前沿实验室园区级长期合同的neocloud，直接挑战CoreWeave，并显示模型公司继续用专用云分散容量风险。但客户集中、建设、电力、芯片交付、利用率和循环交易是核心风险。来源：[Reuters](https://www.reuters.com/technology/anthropic-signs-35-billion-cloud-deal-with-nvidia-backed-lambda-source-says-2026-08-31/)、[AOL授权转载](https://www.aol.com/articles/anthropic-signs-35-billion-cloud-235939000.html)、[Bloomberg](https://www.bloomberg.com/news/articles/2026-08-31/anthropic-seals-35-billion-cloud-deal-with-nvidia-backed-lambda)。

CoreWeave本周没有可确认的新合同、融资、并购、订单或产能投产公告；IR入口受限，核验结果主要仍是二级市场分析与旧交易回顾。静默不代表业务转弱，但Lambda报道中的大单提高了neocloud的客户与融资竞争强度。CoreWeave长期仍面临客户集中、高杠杆、设备残值和代际切换风险；页面受限也意味着小型更新可能漏报。来源：[CoreWeave IR](https://investors.coreweave.com/)。

### 定制芯片进入多年容量路线

Broadcom 9月2日公布FY2026第三财季：总收入295.91亿美元、同比增长86%；AI半导体收入167亿美元、同比增长221%、环比增长54%；第四财季AI半导体收入指引217亿美元、同比增长236%，总收入348亿美元，非GAAP营业利润率约66%。管理层还称，2027年Anthropic TPU 8i约5GW、另有10GW可见性；OpenAI Jalapeno约1.3GW、另有超过5GW可见性，并预计FY2027与FY2028 AI收入分别达到1150亿、2300亿美元。CNBC称公司可能为AI实验室提供残值担保。

当期财务数字是公司公告口径，远期GW路线与收入展望则是前瞻，不能写成订单收入；兑现会受到客户集中、流片、先进封装、建设、融资担保与高估值影响。母稿判断，定制ASIC/XPU与网络已经成为通用GPU的互补与替代，头部模型客户正在把自研芯片写进多年容量路线。来源：[财务公告](https://www.prnewswire.com/news-releases/broadcom-inc-announces-third-quarter-fiscal-year-2026-financial-results-and-quarterly-dividend-302868129.html)、[CNBC](https://www.cnbc.com/2026/09/02/broadcom-avgo-q3-earnings-report-2026.html)。

AMD则以开放软硬栈争取第二供应源。8月31日，AMD、Cisco和HUMAIN宣布生产级AI设施已上线并服务客户，采用Instinct MI355X、EPYC、Cisco Silicon One与800G光学互连；下一阶段计划从2027年开始部署最高250MW的MI400/ROCm设施，并维持2030年最高1GW目标。MI430X和第六代EPYC还将用于欧洲LUMI-AI超算；AMD与沙特通信部、DCO启动开发者生态项目。

MI355X已经上线，但250MW和1GW只是规划，不是收入或已交付容量。开放以太网样板能否扩张，仍取决于建设、电力、出口、HBM与封装，以及ROCm生态。来源：[HUMAIN设施](https://newsroom.amd.com/news/amd-cisco-humain-expand-saudi-arabia-ai-infrastructure/)、[LUMI-AI](https://newsroom.amd.com/news/amd-instinct-gpus-epyc-cpus-power-lumi-ai-supercomputer/)、[开发者生态](https://newsroom.amd.com/news/amd-saudi-arabia-digital-cooperation-organization-open-developer-ecosystem/)。

### 云平台同时处理资金与分发

8月31日，Trefis更新对Oracle AI云资本结构的复盘，核心是收入转化节奏慢于建设与融资需求，客户预付和BYOH降低部分自有资本负担；Oracle Newsroom未见本周重大新公告。复盘引用的背景财务包括：FY2026收入首次超过670亿美元；RPO 6380亿美元、同比增长363%；从FY2026第四财季起未来12个月预计仅12%转为收入，随后两年再转34%；FY2027净现金CapEx指引约700亿美元，已扣除预计200亿至250亿美元客户预付款；拟筹约400亿美元债务与股权，其中200亿美元为ATM；BYOH或预付合同约750亿美元。

Oracle的关键问题由需求验证转向融资和建设日历。CapEx高于全年收入、RPO久期又长，会放大容量延迟、客户集中、债务、摊薄和利润率压力。不过，单篇财经研究不能替代公司新披露，因此这些数字不能升格为本周新经营事实。来源：[Trefis复盘](https://www.trefis.com/stock/orcl/articles/613728/the-bill-for-oracles-ai-build-arrived-before-the-revenue/2026-08-31)、[Oracle Newsroom](https://www.oracle.com/news/)。

Google Cloud的官方月度更新聚焦Agent工作负载的灵活计费与成本控制，推出Gemini Enterprise for Financial Services与Gemini Enterprise for Legal；Antigravity纳入符合条件的Gemini Enterprise订阅，并提供管理和支出控制。9月4日，Google Gen AI SDK for Kotlin 1.0发布，用统一接口连接Gemini Developer API与Enterprise Agent Platform。本周没有合同金额、使用量、CapEx或重大新增云合同；月度汇总页持续更新且部分段落没有明确发布日期，只有Kotlin SDK有清晰的9月4日日期。Google Cloud正从模型API走向受治理的垂直行业代理平台，但行业版和成本治理能否转成付费扩张，仍缺合同与用量证据。来源：[Google Cloud月度AI更新](https://cloud.google.com/blog/products/ai-machine-learning/what-google-cloud-announced-in-ai-this-month)、[Kotlin SDK 1.0](https://cloud.google.com/blog/topics/developers-practitioners/announcing-the-google-gen-ai-sdk-for-kotlin-10-idiomatic-multiplatform-access-to-gemini)。

## 具身智能：收入、预订与估值要分开

宇树本周的事件不是IPO，而是上市后的估值重定价。9月2日，其股价盘中跌破550元，较8月19日上市首日1100元开盘高点约减半，市值跌破2230亿元人民币。报道同时引用背景财务：2026年上半年收入11.52亿元、同比增长48.54%，归母净利润2.74亿元，扣非净利润2.44亿元、同比下降19.34%；创始人称具身智能的“ChatGPT时刻”可能尚需2至3年、甚至5至10年。

这些信号说明公开市场正在重新定价估值与商业成熟度，而不是发生了新的IPO。展示能力、规模收入和合理估值之间仍有距离；低成本、高机动与开发者生态还需转化为收入质量、售后与安全责任能力。来源：[Gasgoo](https://autonews.gasgoo.com/articles/news/unitree-stock-price-halves-2095127594570960896)。

优必选的量化收入证据更强，但必须拆开收入、销量和预订。9月1日的报道完整拆解了8月28日中报：2026年上半年收入12.69亿元、同比增长104.2%；毛利5.67亿元、增长160.9%，毛利率44.7%、提升9.7个百分点；净亏损3.39亿元、收窄23%。全尺寸具身智能人形机器人收入5.90亿元、增长1445%，占46.5%，销量921台、增长1946.7%；所有人形品类合计16123台。U1累计订单13361台属于预订，不是确认收入；研发费用3.03亿元、增长38.9%，研发人员1103人。

这是本周具身智能中较强的量化商业化证据，但工业定制收入、消费数量和预订不可混为一谈。项目化交付、售后成本、消费持续性与亏损仍是下一阶段门槛。中报原始发布时间在窗口外，本周事件是市场消化。来源：[Gasgoo中报拆解](https://autonews.gasgoo.com/articles/market-industry/ubtech-reports-127-billion-yuan-in-first-half-revenue-sells-921-full-size-humanoid-robots-2094660109459607553)、[优必选IR](https://www.ubtrobot.com/investor-relations)。

Tesla Optimus本周没有发现新订单、量产数字、客户部署或融资。Fremont产线和2026生产预期是旧背景，不纳入本周；接下来仍需量产、良率、灵巧手可靠性、外部付费客户和审计数字，不能用演示或旧计划替代商业化证据。来源：[Tesla IR](https://ir.tesla.com/)、[Tesla AI](https://www.tesla.com/AI)。

Figure AI同样没有发现窗口内新融资、订单、量产或部署；旧融资估值、BMW贡献和BotQ规划均已排除。“贡献汽车产量”不能替代利用率、收入、单位经济和外部客户验证，公开披露有限本身也是核验风险。来源：[Figure News](https://www.figure.ai/news)。

## 其余静默对象与残余风险

以下静默结论只表示公开信息空档，不等于业务停滞；页面受限、动态渲染与日期缺失也可能造成有限漏报。

| 对象 | 本周公开结论 | 核验边界与残余风险 |
|---|---|---|
| Midjourney | 未确认本周公司战略、产品、商业化、资本或组织事件 | 官方Updates受Cloudflare 403；公开结果主要是V8.1教程、价格盘点和背景页。Runway推进团队协作和世界模型时，Midjourney若长期缺席企业工作流，入口可能承压，但这不能替代新事实。[Updates](https://www.midjourney.com/updates) |
| Cohere | 未发现日期明确落在窗口内的新产品、客户、融资或组织公告 | 主权AI报告约两周前发布，调查在4至5月；9月8日活动在未来。动态渲染可能造成列表提取不完整。主权AI和私有部署是持续定位，不是本周变化。[Blog](https://cohere.com/blog)｜[Newsroom](https://cohere.com/newsroom)｜[Events](https://cohere.com/events)｜[主权AI背景](https://cohere.com/blog/state-of-sovereign-ai-adoption-2026) |
| Mistral AI | 官方News可见Agentic Search、Shieldstral、OCR 4等条目，但没有可确认本周日期 | 搜索把Agentic Search标为约三周前；第三方September聚合不能替代原始发布日期。欧洲主权AI与开放模型是背景。[News](https://mistral.ai/news/)｜[Agentic Search背景](https://mistral.ai/news/agentic-search/) |
| Scale AI | 未发现窗口内新融资、重大客户、产品或组织公告 | Francis deSouza于8月10日生效，属窗口外背景。公共部门、评估/数据和主权AI是持续定位；Meta交易后仍需证明客户中立性和高端评估价值。Blog日期不足。[Blog](https://scale.com/blog)｜[Events](https://scale.com/events) |
| Cognition / Devin / Windsurf | 未发现窗口内公司原始公告 | 2026年5月融资、6月品牌动作和8月融资谈判都在窗口外，二手收入和估值不采用。Cursor在企业执行控制和案例披露上更积极，Cognition仍需披露Windsurf整合、可验证ROI与企业部署控制；官方信息稀少。[Cognition Blog](https://cognition.com/blog) |

AWS、xAI、百度和CoreWeave的静默或轻动态已分别放在模型平台、中国企业与算力章节；Tesla和Figure已在本章展开。这样集中呈现，是为了保留每个固定对象的公开结论与风险，而不是用一张表把不同状态压成同一个“无事发生”。

## 企业竞争雷达

这张雷达用于把分散事实放回同一组观察维度，不替代前文的证据等级和限定条件。

| 维度 | 领先信号 | 本周变化 | 主要风险 | 下周验证指标 |
|---|---|---|---|---|
| 模型/平台 | OpenAI以高低价分层和Astra建立高端能力；Google以低价Flash与Workspace形成单位任务成本组合；Anthropic以客户托管安全切入受监管市场 | Meta用约95%折扣交换工作流数据；DeepSeek进入开放多模态Agent | benchmark多为公司自报；高危能力误用；价格竞争牺牲毛利；数据换折扣产生IP风险 | Astra实际开放范围与企业接入；Flash独立复测；EFS上线客户；Muse贡献者价采用率；DeepSeek稳定性和推理成本 |
| 应用/垂直 | Sierra给出ARR与组织成熟度信号；Harvey获得企业法务和全所部署；Runway建立团队席位 | Perplexity把隐私边界编入任务；智谱把Token零售化；MiniMax把视频推向实时连续运行 | 公司自报覆盖不等于使用；现场交付压缩毛利；社区实验不等于订单 | 席位与使用量、净留存、任务成功率、转人工率、Team付费升级、天猫销量与复购、实时视频单位成本 |
| 企业数据与Agent基础设施 | Databricks、Glean、Cursor形成上下文—可观测—执行控制三层；Microsoft拥有办公与流程入口 | 自托管和混合架构进一步细分；平台从连接器数量转向权限、语义和运行控制 | 数据回传边界模糊；平台锁定；自有ROI评测偏差；复杂任务错误 | 轨迹和代码回传政策；第三方ROI；Gateway/Genie使用量；Glean上下文独立评测；Cursor企业定价与安全证明 |
| 算力/云 | NVIDIA兼有硬件、生态入口和融资信用；Broadcom定制XPU增速强；AMD形成开放第二供应源 | Lambda据报获得超大合同；Azure以应用席位分发，AWS维持模型中立聚合，Google Cloud推进行业代理 | GW规划与合同不等于投产；循环交易、客户集中、内存与封装、电力和融资成本 | Lambda各方确认与条款；Broadcom第四财季兑现；AMD上线利用率；Hugging Face交割与中立措施；云合同金额、容量投产和价格变化 |
| 具身/硬件 | 优必选披露921台全尺寸与5.9亿元收入；字节推进手机Agent量产入口；华为相关研究展示NPU能效路线 | 宇树上市后估值重定价；Tesla、Figure没有新硬证据 | 预订不等于收入；项目化交付、良率、售后与安全；移动SoC不可外推数据中心 | 优必选预订转交付与毛利；宇树新订单和收入质量；豆包手机上市与激活；Tesla/Figure外部订单；华为第三方复刻与昇腾验证 |
| 中国企业 | DeepSeek、智谱、MiniMax分别代表开放模型、MaaS零售和实时视频；Kimi代表潜在资本化路径 | 阿里、腾讯用校园权益争入口；百度静默；字节争夺系统级入口 | 传闻估值、促销留存、亏损、模型自评、数据与终端权限合规 | Kimi港交所文件；智谱单位经济；校园福利转付费；DeepSeek独立评测；MiniMax订单；百度可量化新品或调用 |

> 图表建议（示意，不生成文件）
> - 类型：五层企业AI竞争栈示意图
> - 内容：能力与准入、企业上下文、执行与可观测性、云与算力、资本信用；只采用本文已列企业与关系。
> - 图注：示意图，节点关系来自本周企业公告、财务披露与降级媒体报道，不表示企业间已形成直接因果或完整市场份额。
> - 来源：本文各章节所列原始链接与交叉来源。
> - 替代文本：企业AI竞争从模型能力向安全准入、企业数据与执行、云基础设施和资本信用逐层扩展；不同公司的“私有”“自托管”和“长期容量”口径并不相同。

## 下周看什么

1. **Astra能否真正放量。** 只接受OpenAI产品页、状态页、Azure或AWS正式上架页及可核验客户公告；重点看普通企业可用范围、Daybreak准入、误拦截和监控数据政策，不用转载跑分替代产品可用性。
2. **NVIDIA—Hugging Face交易如何推进。** 以双方公告、监管文件和正式交割信息为主，验证平台治理、排序、硬件中立、模型托管与员工留任；继续区分“宣布收购”和“完成收购”。
3. **Anthropic—Lambda合同是否获确认。** 等待Anthropic、Lambda、NVIDIA、Hut 8或可核验监管与融资文件；匿名信源金额继续降级，重点查期限、预付、取消、租约和投产时间。
4. **Broadcom第四财季与GW路线能否兑现。** 财务数字以公司IR、公告和法定文件为准，媒体只作交叉；区分已确认收入、季度指引、客户项目可见性和多年预测。
5. **Sierra的商业化质量。** 公司公告只能证明自报ARR；进一步寻找客户侧使用量、净留存、席位、语音任务成功率、人工接管与交付成本。
6. **Databricks AgentOps能否复现。** 关注产品文档、客户案例和第三方实践，继续分开内部估算与外部客户ROI，验证trace覆盖、工具错误率、token节省和修复时间。
7. **Kimi递表传闻能否升级。** 只有港交所文件或公司正式确认才可升级；媒体的500亿美元估值、ARR和融资数字继续保留传闻标签。
8. **豆包手机是否实际上市和激活。** 以工信部、厂商上市公告、销售或激活数据与权限说明为主；关注应用兼容、隐私授权、退货和活跃使用，不以工程机售罄推导量产成功。
9. **具身智能能否从预订转成收入。** 优必选需以财报或交付公告验证U1订单；宇树、Tesla和Figure需提供外部客户、量产、利用率和收入硬证据，演示视频不计商业化。
10. **静默对象是否出现可核验更新。** Midjourney、Cohere、Mistral、Scale、Cognition和CoreWeave存在页面403、动态渲染或日期缺失，下周仍应以官网、IR、Newsroom、状态页和权威媒体交叉，不用聚合站发布日期替代原始日期。

## 来源怎么读

全文采用三类证据边界。第一类是公司公告、财报或可定位原始文件；第二类是权威媒体或多源交叉；第三类包括单一行业媒体、公司自报案例、匿名信源以及原始页受限后的替代证据。公司benchmark、客户覆盖和内部ROI都按自报处理；匿名信源不升格为已确认事实；窗口外数字只用于解释本周事件。

需要特别保留四组缺口：OpenAI Astra、Google Flash/Cyber、DeepSeek模型卡、Sierra ARR、Glean自评、Databricks内部节省、Cursor客户ROI和MiniMax速度都不是独立审计；Kimi递表与Anthropic—Lambda合同仍含传闻或匿名信源；Meta CapEx、xAI规格、宇树IPO与上半年财务、优必选中报原始发布、Oracle底层财务、智谱中报、工程机M153和Hut 8旧租约都属于背景而非本周首次发布；Perplexity、Midjourney、Broadcom IR、CoreWeave IR、ChinaXiv及部分媒体页面曾受访问限制，静默对象仍有有限漏报风险。

跨章节重复出现的NVIDIA、AWS、Google Cloud和Microsoft Azure保留了各自不同的独立事实，链接则按同一URL去重理解。研究范围只覆盖企业及企业级业务，模型卡、SDK、开放权重和工具只作为相应企业事件的证据，不把项目或代码仓库另算成企业。

本周最清楚的变化，不是某一家企业已经赢得某条赛道，而是竞争单元正在变长：能力要连到访问控制与数据边界，Agent要连到上下文、执行和责任，算力要连到园区、融资与长期客户。也正因为链条更长，判断时更需要把已发生、公司自报、远期目标、匿名信源与公开静默逐层拆开。
