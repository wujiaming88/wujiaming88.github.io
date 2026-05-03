#!/usr/bin/env python3
"""Split oversized flashcards into atomic cards following the minimum information principle."""

import json
import copy

with open('cards-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

original_count = len(data)
print(f"Original card count: {original_count}")

def make_card(chapter, color, tags, front, back):
    return {"chapter": chapter, "color": color, "front": front, "back": back, "tags": tags}

def split_card(idx, card):
    """Return list of replacement cards, or None if no split needed."""
    ch = card["chapter"]
    co = card["color"]
    tags = card.get("tags", [])
    back = card["back"]
    front = card["front"]
    
    # Card [0]: 五大架构风格 - 11 rows
    if idx == 0:
        return [
            make_card(ch, co, tags, "数据流风格包含哪些子风格?", "批处理序列、管道/过滤器"),
            make_card(ch, co, tags, "批处理序列风格的核心特征和适用场景?", "核心特征：每步必须前一步完成，数据以整体传递\n适用场景：数据处理流水线"),
            make_card(ch, co, tags, "管道/过滤器风格的核心特征和适用场景?", "核心特征：构件=过滤器，每个有输入输出，增量处理\n适用场景：编译器、Unix管道"),
            make_card(ch, co, tags, "调用/返回风格包含哪些子风格?", "主程序/子程序、面向对象、层次结构"),
            make_card(ch, co, tags, "主程序/子程序风格的核心特征?", "层次分解，逐步求精\n适用场景：传统结构化程序"),
            make_card(ch, co, tags, "层次结构风格的核心特征?", "每层为上层服务，作下层客户\n适用场景：网络协议、OS"),
            make_card(ch, co, tags, "独立构件风格包含哪些子风格?", "进程通信、事件驱动(隐式调用)"),
            make_card(ch, co, tags, "事件驱动(隐式调用)风格的核心特征?", "触发/广播事件，不直接调用\n适用场景：GUI、消息系统"),
            make_card(ch, co, tags, "虚拟机风格包含哪些子风格?", "解释器、基于规则的系统"),
            make_card(ch, co, tags, "解释器风格的四个组成部分?", "程序 + 解释引擎 + 程序内部状态 + 被解释程序当前状态"),
            make_card(ch, co, tags, "基于规则的系统的组成和适用场景?", "组成：规则集 + 推理引擎 + 工作内存\n适用场景：专家系统、AI推理"),
            make_card(ch, co, tags, "仓库/数据共享风格包含哪些子风格?", "数据库系统、黑板系统"),
            make_card(ch, co, tags, "黑板系统的核心特征和适用场景?", "知识源(KS)响应黑板变化，控制器决定哪个KS执行\n适用场景：语音识别、信号处理"),
        ]
    
    # Card [1]: C/S 与 B/S 架构 - 5 rows
    if idx == 1:
        return [
            make_card(ch, co, tags, "C/S与B/S在客户端方面的区别?", "C/S：需安装专用客户端\nB/S：浏览器即可"),
            make_card(ch, co, tags, "C/S与B/S在维护成本方面的区别?", "C/S：高（需更新客户端）\nB/S：低（服务端更新）"),
            make_card(ch, co, tags, "C/S与B/S在安全性和性能方面的区别?", "安全性：C/S较高，B/S较低\n性能：C/S客户端可分担计算，B/S服务器压力大"),
            make_card(ch, co, tags, "三层C/S与三层B/S的分层结构?", "三层C/S：表示层-功能层-数据层\n三层B/S：浏览器-Web服务器-数据库"),
        ]
    
    # Card [26]: 六大质量属性 - 6 rows
    if idx == 26:
        return [
            make_card(ch, co, tags, "性能(Performance)质量属性的定义和架构策略?", "定义：响应时间/吞吐量\n策略：增加计算资源、减少计算开销、引入并发、资源调度"),
            make_card(ch, co, tags, "可用性(Availability)质量属性的定义和架构策略?", "定义：系统正常运行时间比例\n策略：心跳检测、Ping/Echo、主动冗余、被动冗余、选举"),
            make_card(ch, co, tags, "安全性(Security)质量属性的定义和架构策略?", "定义：抵抗未授权访问能力\n策略：入侵检测、用户认证、用户授权、追踪审计"),
            make_card(ch, co, tags, "可修改性(Modifiability)质量属性的定义和架构策略?", "定义：修改的难易程度\n策略：接口-实现分离、信息隐藏、抽象、限制通信路径"),
            make_card(ch, co, tags, "可靠性(Reliability)与可测试性(Testability)的架构策略?", "可靠性：容错、冗余、检错\n可测试性：记录/回放、接口与实现分离、内置监控"),
        ]
    
    # Card [27]: 质量属性场景六要素 - 6 rows
    if idx == 27:
        return [
            make_card(ch, co, tags, "质量属性场景的六个要素是哪些?", "刺激源(Source)、刺激(Stimulus)、环境(Environment)、制品(Artifact)、响应(Response)、响应度量(Measure)"),
            make_card(ch, co, tags, "质量属性场景中'刺激源'和'刺激'是什么?", "刺激源：产生刺激的实体（用户、外部系统、攻击者）\n刺激：到达系统的事件（请求、故障、攻击）"),
            make_card(ch, co, tags, "质量属性场景中'环境'和'制品'是什么?", "环境：刺激发生时系统状态（正常运行、过载、启动中）\n制品：被刺激影响的部分（系统、子系统、构件）"),
            make_card(ch, co, tags, "质量属性场景中'响应'和'响应度量'是什么?", "响应：系统的反应（处理请求、记录日志、通知）\n响应度量：可度量的响应指标（延迟<2s、可用性99.99%）"),
        ]
    
    # Card [38]: 设计模式分类与高频模式 - 25 rows (biggest one)
    if idx == 38:
        return [
            # Creational
            make_card(ch, co, ["设计模式", "创建型模式"], "创建型设计模式有哪5个?", "工厂方法、抽象工厂、单例、建造者、原型"),
            make_card(ch, co, ["设计模式", "创建型模式"], "工厂方法(Factory Method)模式的意图?", "定义创建对象的接口，让子类决定实例化哪个类"),
            make_card(ch, co, ["设计模式", "创建型模式"], "抽象工厂(Abstract Factory)模式的意图?", "创建一系列相关对象，不指定具体类"),
            make_card(ch, co, ["设计模式", "创建型模式"], "建造者(Builder)与原型(Prototype)模式的意图?", "建造者：将复杂对象的构建与表示分离\n原型：通过复制原型创建新对象"),
            # Structural
            make_card(ch, co, ["设计模式", "结构型模式"], "结构型设计模式有哪7个?", "适配器、代理、外观、装饰、桥接、组合、享元"),
            make_card(ch, co, ["设计模式", "结构型模式"], "适配器(Adapter)模式的意图?", "将一个类的接口转换为客户期望的另一个接口"),
            make_card(ch, co, ["设计模式", "结构型模式"], "代理(Proxy)模式的意图?", "为其他对象提供一种代理以控制访问"),
            make_card(ch, co, ["设计模式", "结构型模式"], "外观(Facade)与装饰(Decorator)模式的意图?", "外观：为子系统提供统一的高层接口\n装饰：动态地给对象添加额外职责"),
            make_card(ch, co, ["设计模式", "结构型模式"], "桥接(Bridge)与组合(Composite)模式的意图?", "桥接：将抽象与实现分离，使二者独立变化\n组合：将对象组合成树形结构表示\"部分-整体\"层次"),
            make_card(ch, co, ["设计模式", "结构型模式"], "享元(Flyweight)模式的意图?", "运用共享技术有效支持大量细粒度对象"),
            # Behavioral
            make_card(ch, co, ["设计模式", "行为型模式"], "行为型设计模式中高频的有哪些?", "观察者、策略、模板方法、状态、命令"),
            make_card(ch, co, ["设计模式", "行为型模式"], "观察者(Observer)模式的意图?", "定义一对多依赖，状态改变时通知所有依赖者"),
            make_card(ch, co, ["设计模式", "行为型模式"], "策略(Strategy)模式的意图?", "定义一系列算法，将每一个封装起来，使它们可以互相替换"),
            make_card(ch, co, ["设计模式", "行为型模式"], "模板方法(Template Method)与状态(State)模式的意图?", "模板方法：定义算法骨架，将某些步骤延迟到子类\n状态：允许对象在内部状态改变时改变它的行为"),
            make_card(ch, co, ["设计模式", "行为型模式"], "命令(Command)与中介者(Mediator)模式的意图?", "命令：将请求封装成对象\n中介者：用一个中介对象封装一系列对象交互"),
            make_card(ch, co, ["设计模式", "行为型模式"], "迭代器、职责链、备忘录模式的意图?", "迭代器：顺序访问聚合对象中各元素\n职责链：将请求沿着处理者链传递\n备忘录：捕获对象内部状态以便恢复"),
            make_card(ch, co, ["设计模式", "行为型模式"], "访问者(Visitor)与解释器(Interpreter)模式的意图?", "访问者：在不改变类的前提下定义新操作\n解释器：给定一个语言，定义文法表示和解释器"),
        ]
    
    # Card [39]: 设计模式七大原则 - 7 rows
    if idx == 39:
        return [
            make_card(ch, co, tags, "开闭原则(OCP)的核心思想?", "对扩展开放，对修改关闭"),
            make_card(ch, co, tags, "里氏替换(LSP)与依赖倒置(DIP)的核心思想?", "里氏替换：子类必须能替换父类\n依赖倒置：依赖抽象，不依赖具体"),
            make_card(ch, co, tags, "接口隔离(ISP)与单一职责(SRP)的核心思想?", "接口隔离：使用多个专门接口而非单一总接口\n单一职责：一个类只有一个引起变化的原因"),
            make_card(ch, co, tags, "迪米特法则(LoD)与组合/聚合复用原则的核心思想?", "迪米特法则：最少知识原则，只与直接朋友通信\n组合/聚合复用：优先使用组合而非继承"),
        ]
    
    # Card [40]: 类之间的关系 - 6 rows
    if idx == 40:
        return [
            make_card(ch, co, tags, "UML类关系中'依赖'和'关联'的区别?", "依赖(- - - ->)：最弱，使用关系，临时的\n关联(———)：中等强度，结构关系，长期的"),
            make_card(ch, co, tags, "UML类关系中'聚合'和'组合'的区别?", "聚合(◇———)：整体-部分，可分离(has-a)\n组合(◆———)：整体-部分，不可分离，同生共死"),
            make_card(ch, co, tags, "UML类关系中'泛化'和'实现'的含义?", "泛化(——▷)：继承关系(is-a)\n实现(- - -▷)：接口实现"),
            make_card(ch, co, tags, "UML六种类关系的强度从弱到强排序?", "依赖 < 关联 < 聚合 < 组合 = 泛化 = 实现"),
        ]
    
    # Card [45]: 4+1 视图模型 - 5 rows
    if idx == 45:
        return [
            make_card(ch, co, tags, "4+1视图中逻辑视图和进程视图的关注点?", "逻辑视图：功能需求→类、对象（受众：最终用户）\n进程视图：并发、同步（受众：系统集成者）"),
            make_card(ch, co, tags, "4+1视图中开发视图和物理视图的关注点?", "开发视图：软件组织结构（受众：开发人员）\n物理视图：软硬件映射、部署（受众：系统工程师）"),
            make_card(ch, co, tags, "4+1视图中'+1'场景视图的作用?", "用例驱动，是其他视图的冗余验证\n受众：所有人"),
        ]
    
    # Card [50]: 软件开发模型 - 7 rows
    if idx == 50:
        return [
            make_card(ch, co, tags, "瀑布模型的特点和适用场景?", "特点：线性顺序，文档驱动，阶段结束才进入下一阶段\n适用：需求明确、变更少"),
            make_card(ch, co, tags, "原型模型与螺旋模型的区别?", "原型模型：快速构建原型→用户评估→迭代（适用：需求不明确）\n螺旋模型：瀑布+原型+风险分析，每轮迭代都有风险评估（适用：大型、高风险项目）"),
            make_card(ch, co, tags, "增量模型与迭代模型的区别?", "增量模型：分批次交付，每次增加功能（适用：需求可分解）\n迭代模型：每次迭代产出可运行版本（适用：需求渐进明确）"),
            make_card(ch, co, tags, "V模型与喷泉模型的特点?", "V模型：开发与测试对应（需求→验收，设计→集成，编码→单元），强调测试\n喷泉模型：面向对象，各阶段无明显边界"),
        ]
    
    # Card [63]: CMM/CMMI - 5 rows
    if idx == 63:
        return [
            make_card(ch, co, tags, "CMM/CMMI的5个等级名称?", "1-初始级、2-管理级/可重复级、3-已定义级、4-量化管理级、5-优化级"),
            make_card(ch, co, tags, "CMM/CMMI 1-3级的特征?", "1级(初始级)：混乱、无序\n2级(管理级)：有基本项目管理\n3级(已定义级)：组织级标准过程"),
            make_card(ch, co, tags, "CMM/CMMI 4-5级的特征?", "4级(量化管理级)：量化度量、统计分析\n5级(优化级)：持续改进"),
        ]
    
    # Card [103]: OSI 七层 - 7 rows
    if idx == 103:
        return [
            make_card(ch, co, tags, "OSI模型上三层(应用层/表示层/会话层)的功能和协议?", "应用层：用户接口（HTTP/FTP/SMTP/DNS）\n表示层：数据格式转换/加密（JPEG/ASCII）\n会话层：会话管理（RPC/NFS）\n→ 对应TCP/IP应用层"),
            make_card(ch, co, tags, "OSI传输层和网络层的功能和协议?", "传输层：端到端可靠传输（TCP/UDP）\n网络层：路由选择（IP/ICMP/ARP）"),
            make_card(ch, co, tags, "OSI数据链路层和物理层的功能和协议?", "数据链路层：帧传输/差错控制（PPP/HDLC）\n物理层：比特流传输（RS-232）"),
        ]
    
    # Card [128]: 排序算法复杂度 - 6 rows
    if idx == 128:
        return [
            make_card(ch, co, tags, "冒泡排序和插入排序的时间/空间复杂度?", "冒泡：平均O(n²)，最坏O(n²)，空间O(1)，稳定✅\n插入：平均O(n²)，最坏O(n²)，空间O(1)，稳定✅"),
            make_card(ch, co, tags, "快排和堆排的时间/空间复杂度?", "快排：平均O(nlogn)，最坏O(n²)，空间O(logn)，不稳定❌\n堆排：平均O(nlogn)，最坏O(nlogn)，空间O(1)，不稳定❌"),
            make_card(ch, co, tags, "归并排序和选择排序的时间/空间复杂度?", "归并：平均O(nlogn)，最坏O(nlogn)，空间O(n)，稳定✅\n选择：平均O(n²)，最坏O(n²)，空间O(1)，不稳定❌"),
            make_card(ch, co, tags, "哪些排序算法是稳定的?哪些不稳定?", "稳定：冒泡、插入、归并\n不稳定：快排、堆排、选择\n记忆：\"快选堆\"不稳定"),
        ]
    
    # Card [131]: 知识产权保护期限 - 6 rows
    if idx == 131:
        return [
            make_card(ch, co, tags, "著作权的保护期限?", "署名权等人身权：永久\n财产权：作者终生+死后50年（单位作品为发表后50年）"),
            make_card(ch, co, tags, "三种专利的保护期限?", "发明专利：20年（从申请日算，需审查）\n实用新型：10年（初步审查）\n外观设计：15年（2021.6.1后申请；之前为10年）"),
            make_card(ch, co, tags, "商标权的保护期限?", "10年（可续展，每次续展10年）"),
        ]
    
    # Card [158]: 选答题高频方向 - 7 rows
    if idx == 158:
        return [
            make_card(ch, co, tags, "案例分析选答题最高频方向(5/5和4/5)?", "Redis/缓存(5/5)：数据结构、分布式锁、缓存策略、主从\nUML图(4/5)：类图、顺序图、用例图、交互图类型辨析"),
            make_card(ch, co, tags, "案例分析选答题中频方向(3/5)?", "数据库设计：ER图转关系模式、范式判断、SQL\n大数据/NoSQL：MongoDB、Lambda架构、MapReduce\n云计算：云部署方案、微服务、容器化"),
            make_card(ch, co, tags, "案例分析选答题低频方向(2/5)?", "嵌入式系统：嵌入式实时系统、调度算法\n分布式系统：分布式锁、一致性"),
        ]
    
    # Card [159]: 论文热门主题趋势 - 5 rows
    if idx == 159:
        return [
            make_card(ch, co, tags, "论文必考主题(每次至少1题)?", "云原生/云计算：Serverless、K8s、云原生数据库、CloudOps\n架构设计方法：SOA、微服务、事件驱动、MDA"),
            make_card(ch, co, tags, "论文新兴主题(2025趋势)?", "\"三高\"设计(2025开始)：秒杀、高并发、高可用、高性能\n新技术应用(逐年增加)：AI测试、大数据Lambda、区块链"),
        ]
    
    # Card [160]: TOGAF - 9 rows
    if idx == 160:
        return [
            make_card(ch, co, tags, "TOGAF ADM的预备阶段和A阶段?", "预备阶段(Preliminary)：确定架构能力、原则、工具\nA(架构愿景)：确定范围、利益相关者、约束"),
            make_card(ch, co, tags, "TOGAF ADM的B/C/D阶段(架构定义)?", "B(业务架构)：描述基线和目标业务架构\nC(信息系统架构)：数据架构+应用架构\nD(技术架构)：描述支撑信息系统的技术基础设施"),
            make_card(ch, co, tags, "TOGAF ADM的E/F阶段(规划)?", "E(机会与解决方案)：识别交付手段（项目/程序）\nF(迁移规划)：制定详细实施计划和迁移路线图"),
            make_card(ch, co, tags, "TOGAF ADM的G/H阶段(治理)?", "G(实施治理)：对实施进行架构合规监督\nH(架构变更管理)：管理架构生命周期中的变更"),
        ]
    
    # Card [161]: Zachman 框架 - 5 rows
    if idx == 161:
        return [
            make_card(ch, co, tags, "TOGAF与Zachman的本质区别?", "TOGAF：方法论（How to do），有详细步骤\nZachman：分类本体（What is），只分类不指导"),
            make_card(ch, co, tags, "TOGAF与Zachman的核心和架构域?", "TOGAF：ADM 9阶段，4个架构域（BDAT）\nZachman：6×6矩阵，6列（5W1H）"),
        ]
    
    # Card [176]: 七种耦合 - 7 rows
    if idx == 176:
        return [
            make_card(ch, co, tags, "七种耦合从弱到强的顺序?", "非直接耦合 < 数据耦合 < 标记耦合 < 控制耦合 < 外部耦合 < 公共耦合 < 内容耦合"),
            make_card(ch, co, tags, "数据耦合与标记耦合(印记耦合)的区别?", "数据耦合：通过参数传递简单数据（整数、字符串）\n标记耦合：通过参数传递数据结构（记录/结构体）"),
            make_card(ch, co, tags, "控制耦合与外部耦合的含义?", "控制耦合：传递控制信息（标志、开关），决定对方行为\n外部耦合：共享外部数据格式、通信协议或设备"),
            make_card(ch, co, tags, "公共耦合与内容耦合的含义?", "公共耦合：共享全局数据区/公共变量\n内容耦合(最强)：一个模块直接访问/修改另一个模块的内部数据或代码"),
        ]
    
    # Card [177]: 七种内聚 - 7 rows
    if idx == 177:
        return [
            make_card(ch, co, tags, "七种内聚从弱到强的顺序?", "偶然内聚 < 逻辑内聚 < 时间内聚 < 过程内聚 < 通信内聚 < 顺序内聚 < 功能内聚"),
            make_card(ch, co, tags, "偶然内聚与逻辑内聚的含义?", "偶然内聚：模块内各元素无实质联系，只是碰巧放在一起\n逻辑内聚：逻辑上相关的功能放在一起，通过参数选择执行哪个"),
            make_card(ch, co, tags, "时间内聚与过程内聚的含义?", "时间内聚：需要在同一时间段执行的功能放在一起（如初始化模块）\n过程内聚：按特定次序执行的功能放在一起"),
            make_card(ch, co, tags, "通信内聚、顺序内聚与功能内聚的含义?", "通信内聚：使用相同输入/输出数据的功能\n顺序内聚：一个功能的输出是另一个功能的输入\n功能内聚(最强)：所有元素共同完成一个且仅一个功能"),
        ]
    
    # Card [179]: AOP 核心概念 - 5 rows
    if idx == 179:
        return [
            make_card(ch, co, tags, "AOP中切面(Aspect)和连接点(Join Point)的定义?", "切面：横切关注点的模块化（如日志、事务、安全）\n连接点：程序执行中的某个点（如方法调用、异常抛出）"),
            make_card(ch, co, tags, "AOP中切入点(Pointcut)和通知(Advice)的定义?", "切入点：匹配连接点的规则/表达式\n通知/增强：在连接点执行的动作（Before/After/Around）"),
            make_card(ch, co, tags, "AOP中织入(Weaving)是什么?", "将切面代码插入目标对象的过程"),
        ]
    
    # Card [183]: EDF - 5 rows
    if idx == 183:
        return [
            make_card(ch, co, tags, "RMS与EDF在优先级和最优性上的区别?", "RMS：静态优先级（固定），静态优先级最优\nEDF：动态优先级（运行时变化），动态优先级最优"),
            make_card(ch, co, tags, "RMS与EDF在CPU利用率和实现复杂度上的区别?", "RMS：利用率上界n(2^(1/n)-1)≈69.3%，实现简单\nEDF：利用率上界100%，实现较复杂"),
            make_card(ch, co, tags, "RMS与EDF在过载行为上的区别?", "RMS：过载行为可预测\nEDF：过载行为不可预测（多米诺效应）"),
        ]
    
    # Card [188]: 消息中间件 - 6 rows
    if idx == 188:
        return [
            make_card(ch, co, tags, "Kafka的模型、吞吐量和适用场景?", "模型：发布/订阅（Pull）\n吞吐量：极高（百万/秒），延迟毫秒级\n适用：日志收集、大数据流\n特点：分区内有序，ISR机制保证可靠性"),
            make_card(ch, co, tags, "RabbitMQ的模型、吞吐量和适用场景?", "模型：AMQP（Push/Pull）\n吞吐量：中（万/秒），延迟微秒级\n适用：企业集成、复杂路由\n特点：确认机制保证可靠性，不保证消息顺序"),
            make_card(ch, co, tags, "RocketMQ的模型、吞吐量和适用场景?", "模型：发布/订阅（Pull）\n吞吐量：高（十万/秒），延迟毫秒级\n适用：电商交易、金融\n特点：同步刷盘保证可靠性，支持全局顺序"),
        ]
    
    # Card [191]: DevOps 核心概念 - 7 rows
    if idx == 191:
        return [
            make_card(ch, co, tags, "CI/CD三个概念的区别?", "CI（持续集成）：频繁将代码合并到主干，每次自动构建+测试\nCD（持续交付）：CI基础上，代码随时可部署到生产（需手动触发）\nCD（持续部署）：自动部署到生产环境"),
            make_card(ch, co, tags, "Infrastructure as Code是什么?", "基础设施代码化管理（Terraform/Ansible）"),
            make_card(ch, co, tags, "蓝绿部署、金丝雀发布、滚动更新的区别?", "蓝绿部署：两套环境交替上线\n金丝雀发布：小比例流量先切新版，验证后全量\n滚动更新：逐步替换旧版本实例"),
        ]
    
    # Card [224]: DFD分层规则 - 7 list items
    if idx == 224:
        return [
            make_card(ch, co, tags if tags else ["DFD分层规则"], "DFD的三层分解结构?", "顶层图(Context Diagram)：只有一个加工，表示整个系统\n0层图：将顶层加工分解\n逐层细化：子图输入输出必须与父图对应加工的输入输出平衡"),
            make_card(ch, co, tags if tags else ["DFD分层规则"], "DFD答题的四个核心检查点?", "1. 父图与子图的数据流平衡（数量和名称一致）\n2. 加工至少有一个输入流和一个输出流\n3. 数据存储至少有一个读和一个写\n4. 外部实体之间不能有直接数据流"),
        ]
    
    return None

# Process all cards
new_data = []
split_count = 0
split_details = []

for i, card in enumerate(data):
    replacements = split_card(i, card)
    if replacements:
        new_data.extend(replacements)
        split_count += 1
        split_details.append(f"  [{i}] {card['front'][:50]} → {len(replacements)} cards")
    else:
        new_data.append(card)

print(f"\nSplit {split_count} cards")
for d in split_details:
    print(d)
print(f"\nFinal card count: {len(new_data)}")

# Write output
with open('cards-data.json', 'w', encoding='utf-8') as f:
    json.dump(new_data, f, ensure_ascii=False, indent=2)

print("\n✅ cards-data.json updated successfully")
