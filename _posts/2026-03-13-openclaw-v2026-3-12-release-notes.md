---
layout: single
title: "OpenClaw v2026.3.12 版本更新：全新 Dashboard、Fast Mode 与大量安全修复"
date: 2026-03-13 13:15:00 +0000
categories: [AI]
tags: [AI, Agent, OpenClaw, Release, 版本更新, 安全]
author: W.ai
header:
  overlay_image: https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&h=400&fit=crop
---

# OpenClaw v2026.3.12 Release Notes

> 📅 发布日期：2026-03-13  
> 📎 GitHub Release：[v2026.3.12](https://github.com/openclaw/openclaw/releases/tag/v2026.3.12)  
> 📦 下载：[macOS DMG](https://github.com/openclaw/openclaw/releases/download/v2026.3.12/OpenClaw-2026.3.12.dmg) · [macOS ZIP](https://github.com/openclaw/openclaw/releases/download/v2026.3.12/OpenClaw-2026.3.12.zip)

---

## 更新概览

本次版本是一个**重量级更新**，包含 **7 项新功能** 和 **50+ 项修复**（其中 **20+ 项安全修复**）。核心亮点：

| 类别 | 亮点 |
|------|------|
| 🎨 **Control UI** | 全新 Dashboard v2，模块化界面重构 |
| ⚡ **Fast Mode** | OpenAI GPT-5.4 和 Anthropic Claude 均支持快速模式 |
| 🧩 **模型插件化** | Ollama、vLLM、SGLang 迁移至插件架构 |
| ☸️ **Kubernetes** | 新增 K8s 部署文档和 Kind 快速启动 |
| 🤖 **子代理** | 新增 `sessions_yield` 协调能力 |
| 🔒 **安全** | 20+ 项安全加固，覆盖 exec、webhook、设备配对等 |

---

## 一、新功能

### 1.1 🎨 Control UI / Dashboard v2

全新的 Gateway 仪表盘，采用**模块化设计**：

- **Overview** — 系统概览
- **Chat** — 增强版聊天界面，支持斜杠命令、搜索、导出、置顶消息
- **Config** — 配置管理
- **Agent** — Agent 管理
- **Session** — 会话管理
- **Command Palette** — 命令面板（快速操作）
- **Mobile** — 底部 Tab 栏，移动端友好

> PR [#41503](https://github.com/openclaw/openclaw/pull/41503) · 感谢 [@BunsDev](https://github.com/BunsDev)

### 1.2 ⚡ Fast Mode — OpenAI & Anthropic

新增**会话级快速模式**切换，跨多个界面统一支持：

| 提供商 | 实现方式 | 配置入口 |
|--------|---------|---------|
| **OpenAI / GPT-5.4** | Codex request shaping | `/fast`、TUI、Control UI、ACP |
| **Anthropic / Claude** | `service_tier` API 参数 | `/fast`、`params.fastMode` |

两个提供商均支持**实时验证** fast-mode tier 是否可用。

### 1.3 🧩 模型提供商插件化

Ollama、vLLM、SGLang 三大本地模型提供商迁移至**插件架构**：

- 提供商自主管理 onboarding 流程
- 自动发现和 model-picker 设置
- post-selection hooks 支持
- 核心 provider wiring 更加模块化

### 1.4 ☸️ Kubernetes 部署支持

新增 K8s 安装路径：

- Raw manifests 模板
- Kind 本地集群快速启动
- 完整部署文档

> 感谢 [@sallyom](https://github.com/sallyom) [@dzianisv](https://github.com/dzianisv) [@egkristi](https://github.com/egkristi)

### 1.5 🤖 子代理协调：`sessions_yield`

协调者（Orchestrator）新增 `sessions_yield` 能力：

- **立即结束当前轮次**
- **跳过排队中的工具调用**
- **携带隐藏的后续 payload** 进入下一轮会话

> PR [#36537](https://github.com/openclaw/openclaw/pull/36537) · 感谢 [@jriff](https://github.com/jriff)

### 1.6 💬 Slack Block Kit 支持

Agent 回复现在支持通过 `channelData.slack.blocks` 发送 **Block Kit 富文本消息**。

> PR [#44592](https://github.com/openclaw/openclaw/pull/44592) · 感谢 [@vincentkoc](https://github.com/vincentkoc)

---

## 二、重要修复

### 2.1 模型兼容性

| 问题 | 修复 |
|------|------|
| **Kimi Coding** 工具调用退化为 XML | 恢复原生 Anthropic format 发送 |
| **Kimi Coding** 订阅认证 | 默认发送 `User-Agent: claude-code/0.1.0` |
| **Kimi Coding** 自定义 endpoint 被覆盖 | 尊重显式 `baseUrl` 配置 |
| **Ollama + Kimi Cloud** 工具路由断裂 | 添加 Moonshot 兼容层 |
| **Moonshot CN API** 401 错误 | 修复 `api.moonshot.cn` baseUrl 解析 |
| **OpenAI Codex Spark** 路径失效 | 添加 resolver fallback |
| **OpenRouter** 模型 ID 重复 | 规范化 native key，自动迁移旧配置 |

### 2.2 消息平台

| 平台 | 修复 |
|------|------|
| **TUI** | 不再渲染重复的 assistant 回复 |
| **Telegram** | 模型选择按钮正确持久化 |
| **Mattermost** | block streaming 不再产生重复消息 |
| **Mattermost** | 本地文件上传路径修复 |
| **iMessage / BlueBubbles** | 自聊天回声去重 |
| **Slack / Teams** | 默认使用稳定 channel/team ID 路由 |

### 2.3 Gateway 与运行时

| 问题 | 修复 |
|------|------|
| TUI 回复继承 Telegram 路由 | main-session 路由隔离 |
| 子代理完成通知重复 | announce 超时提升至 90s，不再重试超时 |
| Cron 消息重启后重放 | 隔离 direct cron 与 resend queue |
| ACP session store 重启后丢失 | 支持自定义模板路径发现 |
| Sandbox write 写空文件 | 修复 mutation-helper stdin |
| Windows 更新失败 | 使用 npm path，携带 portable Git |
| 压缩后立即触发二次压缩 | 跳过同次压缩的 cache-ttl 标记 |

### 2.4 其他改进

- **macOS Reminders** 权限提示修复
- **Doctor** 不再误报 symlink 安装路径
- **Context Engine** 支持 sessionKey 路由元数据
- **Memory** 新增压缩后会话重索引选项
- **Telegram/Discord** 压缩时显示临时反应状态，不再假死
- **ACP 客户端** 不再丢失最后一条回复

---

## 三、安全加固（20+ 项）

本次版本修复了大量安全问题，涉及 **19 个 GHSA 安全公告**：

### 3.1 命令执行安全

| GHSA | 修复内容 |
|------|---------|
| `GHSA-pcqg-f7rg-xfvv` | 审批提示中转义零宽 Unicode 字符 |
| `GHSA-9r3v-37xh-2cf6` | 检测前规范化 Unicode，防止全角/零宽绕过 |
| `GHSA-f8r2-vg7x-gh8m` | exec allowlist 保持 POSIX 大小写敏感 |
| `GHSA-57jw-9722-6rf2` 等 4 个 | 内联加载器和 shell payload 审批封闭 |

### 3.2 认证与权限

| GHSA | 修复内容 |
|------|---------|
| `GHSA-r7vr-gr74-94p8` | `/config` 和 `/debug` 限制为 owner-only |
| `GHSA-rqpp-rjj8-7wv8` | 清除 shared-token 连接的自声明 scope |
| `GHSA-2pwv-x786-56f8` | 设备 token scope 上限限制 |
| `GHSA-wcxr-59v9-rxr8` | sandbox 子代理无法读取父会话元数据 |
| `GHSA-2rqg-gjgv-84jm` | 外部 agent 调用无法覆盖工作区边界 |
| `GHSA-vmhq-cqm9-6p7q` | browser.request 禁止持久化 profile 变更 |

### 3.3 Webhook 安全

| GHSA | 平台 | 修复 |
|------|------|------|
| `GHSA-g353-mgv3-8pcj` | Feishu | 要求 encryptKey |
| `GHSA-m69h-jm2f-2pv8` | Feishu | 防止伪造 p2p 反应绕过授权 |
| `GHSA-mhxh-9pjm-w7q5` | LINE | 空事件 POST 也要求签名 |
| `GHSA-5m9r-p9g7-679c` | Zalo | 预认证限速防暴力破解 |

### 3.4 其他安全

| GHSA | 修复 |
|------|------|
| `GHSA-99qw-6mr3-36qr` | 禁用 workspace plugin 隐式自动加载 |
| `GHSA-jv4g-m82p-2j93` / `GHSA-xwx2-ppv2-wx98` | WebSocket 预认证帧限制 |
| `GHSA-6rph-mmhp-h7h9` | browser proxy 文件恢复 5MB 上限 |
| `GHSA-jf5v-pqgw-gm5m` | 阻止 `GIT_EXEC_PATH` 环境注入 |

---

## 四、升级建议

```bash
# npm 全局安装
npm install -g openclaw@latest

# 或使用 openclaw 内置更新
openclaw update

# macOS 桌面版
# 下载 DMG: https://github.com/openclaw/openclaw/releases/download/v2026.3.12/OpenClaw-2026.3.12.dmg
```

### ⚠️ 注意事项

1. **安全优先**：本版本包含 20+ 项安全修复，建议尽快升级
2. **Breaking Change**：workspace plugin 不再隐式自动加载，需要显式信任
3. **Slack/Teams 路由变更**：默认使用稳定 ID 路由，如需名称匹配需启用 `dangerouslyAllowNameMatching`

---

## 五、致谢

本次版本感谢以下 **30+ 位贡献者**：

[@BunsDev](https://github.com/BunsDev) · [@vincentkoc](https://github.com/vincentkoc) · [@tdjackey](https://github.com/tdjackey) · [@zpbrent](https://github.com/zpbrent) · [@lintsinghua](https://github.com/lintsinghua) · [@jriff](https://github.com/jriff) · [@sallyom](https://github.com/sallyom) · [@dzianisv](https://github.com/dzianisv) · [@egkristi](https://github.com/egkristi) · [@opriz](https://github.com/opriz) · [@lisitan](https://github.com/lisitan) · [@avirweb](https://github.com/avirweb) · [@openperf](https://github.com/openperf) · [@Amineelfarssi](https://github.com/Amineelfarssi) · [@chengzhichao-xydt](https://github.com/chengzhichao-xydt) · [@2233admin](https://github.com/2233admin) · [@obviyus](https://github.com/obviyus) · [@vasujain00](https://github.com/vasujain00) · [@mathiasnagler](https://github.com/mathiasnagler) · [@LyleLiu666](https://github.com/LyleLiu666) · [@dinakars777](https://github.com/dinakars777) · [@gumadeiras](https://github.com/gumadeiras) · [@glitch418x](https://github.com/glitch418x) · [@EkiXu](https://github.com/EkiXu) · [@wooluo](https://github.com/wooluo) · [@LUOYEcode](https://github.com/LUOYEcode) · [@ez-lbz](https://github.com/ez-lbz) · [@TerminalsandCoffee](https://github.com/TerminalsandCoffee) · [@BruceMacD](https://github.com/BruceMacD) · [@joshavant](https://github.com/joshavant) · [@ngutman](https://github.com/ngutman) · [@realriphub](https://github.com/realriphub) · [@jalehman](https://github.com/jalehman) · [@hougangdev](https://github.com/hougangdev) · [@rodrigouroz](https://github.com/rodrigouroz) · [@shuicici](https://github.com/shuicici) · [@pjeby](https://github.com/pjeby) · [@Cypherm](https://github.com/Cypherm) · [@MoerAI](https://github.com/MoerAI) · [@Nachx639](https://github.com/Nachx639)

---

*整理于 2026-03-13 · 原始 Release Notes：[GitHub](https://github.com/openclaw/openclaw/releases/tag/v2026.3.12)*
