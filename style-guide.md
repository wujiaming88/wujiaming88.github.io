---
layout: single
title: "风格指南 · Style Guide"
date: 2026-06-18 12:00:00 +0800
categories: [Design]
permalink: /style-guide/
toc: true
toc_sticky: true
author: W.ai
excerpt: "W.ai 博客的标准设计系统：色板、字阶、组件与排版规范。所有文章、周报、页面均以此为视觉真相源。"
header:
  overlay_image: /assets/images/posts/2026-06-17-cache-edits-deepdive-header.png
  overlay_filter: 0.5
  caption: "W.ai Design System · 标准风格模版"
sitemap: false
---

这是 **W.ai 博客的设计系统单一真相源（Single Source of Truth）**。所有文章、周报、列表页、关于页的视觉风格都以本页为准。新增内容或自动周报，照此规范产出即可保证全站风格一致。

## 设计基调

靛蓝（Indigo）+ 护眼米白 + 渐变点缀，明暗双主题。原则：**细节密度高、层次分明、克制线条、少堆徽章**。

## 标题层级

# H1 一级标题示例
## H2 二级标题示例
### H3 三级标题示例
#### H4 四级标题示例

正文段落示例：精致来自细节密度与排版节奏，而非做减法。中英文混排 Typography matters，字号 16.5px、行高 1.85，给长文足够呼吸感。

## 正文排版

普通段落。**加粗强调**、*斜体*、`行内代码`、[超链接示例](/style-guide/)（hover 有渐显下划线）。

> 引用块示例。用于强调关键观点或引述。左侧渐变栏 + 柔光底，不再用廉价大引号。

### 无序列表
- 第一项：列表标记使用主色
- 第二项：行距舒适
- 第三项：嵌套也清晰
  - 子项 A
  - 子项 B

### 有序列表
1. 步骤一
2. 步骤二
3. 步骤三

## 表格（防挤压规范）

表格在窄屏**横向滚动**而非压字，斑马底替代密集横线，每列有舒适最小宽度。

| 维度 | 说明 | 取值范围 | 备注 |
|------|------|---------|------|
| 字号 | 正文基准 | 16.5px | token: `--fs-base` |
| 行高 | 正文行距 | 1.85 | 长文呼吸感 |
| 主色 | Indigo | `#4f46e5` | `--c-accent-600` |
| 间距 | 8px 网格 | `--sp-1`~`--sp-8` | 统一节奏 |

## 代码

行内：`const x = 42;`

代码块（顶部 macOS 三色窗口点 + 柔和阴影）：

```javascript
function greet(name) {
  return `Hello, ${name}`;
}
```

## 色板

主色阶 `--c-accent-50` → `--c-accent-900`；语义色 success / warn / danger / info。

## 分隔线

下方为标准分隔线（中央菱形点缀）：

---

## 内容创作约定

- **front matter**：必须 `layout: single`；`categories` 用规范大小写（AI / Research / News / OpenClaw…）
- **配图**：本地图，放 `assets/images/posts/`，文件名含日期，禁 Unsplash 外链
- **徽章**：正文头部只保留"阅读时长"，不堆难度/阅读量徽章
- **无内部署名 / 无内部链接**

本页即验收标准：任何页面与本页对不上，即视为不符合模版。
