# GitHub Pages配置指南

## 一、启用GitHub Pages

1. 访问你的GitHub仓库：`https://github.com/wujiaming88/wujiaming88.github.io`
2. 点击顶部导航栏的「Settings」（设置）
3. 在左侧菜单中找到「Pages」选项
4. 在「Source」部分：
   - 选择「Deploy from a branch」
   - 分支选择「main」
   - 文件夹选择「/(root)」
   - 点击「Save」保存

## 二、配置自定义域名

1. 在GitHub Pages设置页面中，找到「Custom domain」部分
2. 输入你的自定义域名：`blog.juanwang.tech`
3. 勾选「Enforce HTTPS」选项（启用HTTPS加密）
4. 点击「Save」保存

## 三、验证配置

1. 保存后，GitHub会自动验证域名所有权
2. 等待几分钟后，页面会显示「Your site is live at https://blog.juanwang.tech」
3. 访问`https://blog.juanwang.tech`验证博客是否正常访问

## 四、常见问题

### 1. 域名验证失败
- 请确保DNS记录已正确配置（参考DNS配置指南.md）
- 等待DNS解析生效（通常需要10-30分钟）
- 检查CNAME文件是否已正确提交到GitHub仓库

### 2. HTTPS证书未生效
- GitHub会自动为自定义域名颁发HTTPS证书，通常需要24小时内生效
- 如果24小时后仍未生效，请尝试重新保存GitHub Pages设置

### 3. 博客无法访问
- 检查GitHub Pages是否已启用
- 检查DNS记录是否正确
- 检查CNAME文件是否存在
- 等待DNS解析生效

## 五、联系我们
如果在配置过程中遇到问题，请联系博客研发小组。