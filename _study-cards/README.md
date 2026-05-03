# 系统架构设计师闪卡学习系统

基于 Anki 的间隔重复算法 (SM-2) 的闪卡学习系统,用于 2026 年系统架构设计师考试备考。

## 功能特性

- ✅ **Anki 风格学习**: SM-2 间隔重复算法
- ✅ **智能复习队列**: 自动计算到期卡片
- ✅ **三色分级**: 红卡(必考) / 黄卡(中频) / 绿卡(了解)
- ✅ **章节筛选**: 28 个章节可选
- ✅ **进度统计**: 今日完成、待复习、掌握率
- ✅ **数据持久化**: localStorage 保存学习进度
- ✅ **响应式设计**: 适配手机和 PC
- ✅ **暗色模式**: 自动跟随系统

## 数据来源

从 [awesome-ruankao](https://github.com/wuyiying88/awesome-ruankao) 三色卡提取:
- 220 张卡片
- 106 张红卡 (高频必考)
- 89 张黄卡 (中频重点)
- 25 张绿卡 (低频了解)

## 技术架构

### 文件结构

```
_study-cards/           # 开发目录
├── sm2.js             # SM-2 算法模块
├── sm2.test.js        # SM-2 测试 (100% 覆盖)
├── queue.js           # 队列管理模块
├── queue.test.js      # 队列测试 (100% 覆盖)
├── extract-cards.js   # 数据提取脚本
├── cards-data.json    # 卡片数据
├── build.js           # 构建脚本
├── study-cards-template.html  # HTML 模板
└── html-validation.test.js    # HTML 验证测试

study-cards.html       # 最终单文件产出
```

### SM-2 算法

标准 SuperMemo SM-2 实现:
- 评分 < 3: 重置进度,1天后复习
- 第 1 次: 1 天
- 第 2 次: 6 天
- 后续: 间隔 × 容易度因子

### 卡片状态

- **New**: 新卡
- **Learning**: 学习中 (重复次数 = 0)
- **Review**: 复习中 (间隔 < 21 天)
- **Mature**: 已掌握 (间隔 ≥ 21 天)

## 开发指南

### 安装依赖

```bash
npm install
```

### 运行测试

```bash
npm test              # 运行测试 + 覆盖率
npm run test:watch    # 监听模式
```

### 重新构建

```bash
npm run extract       # 提取卡片数据
npm run build         # 构建 HTML
```

### 测试覆盖率

所有核心逻辑达到 100% 覆盖:
- SM-2 算法: 100%
- 队列管理: 100%
- HTML 结构验证: 16 项测试通过

## 使用方法

1. 访问 `https://wujiaming88.github.io/study-cards`
2. 点击卡片查看问题
3. 点击翻转查看答案
4. 根据记忆程度选择:
   - **忘了**: 1 分钟后再看
   - **困难**: 今天再复习
   - **良好**: N 天后复习
   - **简单**: 间隔 × 2.5

## 数据隐私

所有学习数据存储在浏览器 localStorage,不会上传到服务器。

清除数据:
```javascript
localStorage.removeItem('study-cards-state')
```

## 部署

单文件部署,无需服务器:
- 直接访问 HTML 即可工作
- 可托管在 GitHub Pages / Vercel / Netlify
- 删除方式: 删除 `study-cards.html`

## 维护

### 更新数据源

修改 `extract-cards.js` 中的 `SOURCE_FILE` 路径,然后运行:

```bash
npm run extract
npm run build
```

### 调整算法参数

修改 `sm2.js` 中的参数:
- 初始容易度: 2.5
- 最小容易度: 1.3
- 间隔倍数: 参考 SM-2 标准

## 许可证

MIT

## 致谢

- 数据来源: [awesome-ruankao](https://github.com/wuyiying88/awesome-ruankao)
- 算法参考: [SuperMemo SM-2](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
