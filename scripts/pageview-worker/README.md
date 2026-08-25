# 博客阅读量统计 — C1 部署指南（Cloudflare Worker + KV）

数据 100% 存在你自己的 Cloudflare 账号里，可随时导出、防刷、不依赖任何第三方公益服务。

代码已全部就位，你只需在 Cloudflare 控制台做下面几步（约 10 分钟，全程网页点击，无需命令行）。

---

## 一、准备：注册 / 登录 Cloudflare
- 打开 https://dash.cloudflare.com 注册或登录（免费版即可，无需绑定域名）。

## 二、创建 KV 命名空间（你的"数据库"）
1. 左侧菜单 → **Storage & Databases → KV**（或 Workers & Pages → KV）
2. 点 **Create a namespace**，名字填 `blog-pageviews` → 创建。

## 三、创建 Worker 并贴代码
1. 左侧 → **Workers & Pages → Create → Create Worker**
2. 起个名字，比如 `blog-pv`（最终地址会是 `https://blog-pv.<你的子域>.workers.dev`）
3. 点 **Deploy** 先建出来，再点 **Edit code**
4. 把本仓库 `scripts/pageview-worker/worker.js` 的**全部内容**粘贴进去，覆盖默认模板 → **Deploy**

## 四、绑定 KV + 设置变量
进入这个 Worker 的 **Settings → Variables and Secrets**（或 Bindings）：
1. **KV Namespace Bindings → Add**
   - Variable name 必须填：`PAGEVIEWS`
   - Namespace 选第二步建的 `blog-pageviews`
2. **Environment Variables → Add**（可选；代码已默认允许两个正式博客域名）
   - `ALLOW_ORIGINS` = `https://wujiaming88.github.io,https://wujiaming88.garming-wu.workers.dev`
   - 旧版 `ALLOW_ORIGIN` 仍兼容，但新配置优先使用支持逗号分隔的 `ALLOW_ORIGINS`
   - `ADMIN_TOKEN` = 自己设一个随机串（用于导出数据接口，别泄露）
3. 保存后 **Deploy**。

## 五、把 Worker 地址告诉博客
1. 复制你的 Worker 地址，形如 `https://blog-pv.xxxx.workers.dev`
2. 打开博客 `_config.yml`，找到这两行，取消注释并填地址（**不要带末尾斜杠**）：
   ```yaml
   pageview_api: "https://blog-pv.xxxx.workers.dev"
   ```
3. 提交并 push → GitHub Pages 自动重建。

完成！之后每篇文章头部会出现「👁 阅读 N 次」徽章。

> 把地址发给我（小帅），第 5 步和 push 我直接帮你做。前 4 步需要你在 Cloudflare 网页里点。

---

## 验证 / 运维
- 浏览器直接打开 `https://blog-pv.xxxx.workers.dev/api/pv?path=/2026/06/17/foo.html` 应返回 JSON。
- 导出全部数据：`https://blog-pv.xxxx.workers.dev/api/pv/all?token=你的ADMIN_TOKEN`
- 免费额度：每天 10 万次读 + 1000 次写，博客流量远用不完。

## 机制说明
- **防刷**：同一访客（IP+UA 指纹哈希）对同一文章，30 分钟内只 +1 一次。
- **优雅降级**：`pageview_api` 没配 / Worker 取数失败时，徽章自动隐藏，不影响页面。
- **路径即主键**：用文章 URL（如 `/2026/06/17/foo.html`）作 KV key，文章不改 URL 计数就稳定。
