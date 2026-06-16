#!/usr/bin/env bash
# new-post.sh — 新建博客文章脚手架
# 自动生成符合规范的 front matter（含 difficulty）。
# 用法：
#   ./scripts/new-post.sh                      # 全交互
#   ./scripts/new-post.sh "文章标题"           # 传标题，其余交互
#   ./scripts/new-post.sh "标题" "slug-en"     # 标题 + 英文文件名
set -euo pipefail

# 切到仓库根目录（脚本在 scripts/ 下）
cd "$(dirname "$0")/.."
POSTS_DIR="_posts"
[ -d "$POSTS_DIR" ] || { echo "❌ 找不到 _posts 目录，请在博客仓库内运行"; exit 1; }

# ---------- 工具函数 ----------
ask() { # ask "提示" "默认值"
  local prompt="$1" def="${2:-}" ans
  if [ -n "$def" ]; then read -r -p "$prompt [$def]: " ans; echo "${ans:-$def}";
  else read -r -p "$prompt: " ans; echo "$ans"; fi
}

# ---------- 1. 标题 ----------
TITLE="${1:-}"
[ -z "$TITLE" ] && TITLE=$(ask "📝 文章标题")
[ -z "$TITLE" ] && { echo "❌ 标题不能为空"; exit 1; }

# ---------- 2. 英文 slug（文件名）----------
SLUG="${2:-}"
if [ -z "$SLUG" ]; then
  SLUG=$(ask "🔗 英文文件名 slug（如 openclaw-foo-bar）")
fi
[ -z "$SLUG" ] && { echo "❌ slug 不能为空（用于文件名）"; exit 1; }
SLUG=$(echo "$SLUG" | tr 'A-Z' 'a-z' | sed 's/[^a-z0-9-]/-/g; s/-\+/-/g; s/^-//; s/-$//')

# ---------- 3. 分类 ----------
CATEGORY=$(ask "📂 分类 categories" "AI")

# ---------- 4. 难度 ----------
echo ""
echo "📊 难度 difficulty：1)入门  2)进阶  3)高级  4)不设置"
DIFF_CHOICE=$(ask "选择" "2")
case "$DIFF_CHOICE" in
  1) DIFF="入门";; 2) DIFF="进阶";; 3) DIFF="高级";; *) DIFF="";;
esac
DIFF_LINE=""
[ -n "$DIFF" ] && DIFF_LINE="difficulty: $DIFF"

# ---------- 5. 标签 ----------
TAGS=$(ask "🏷️ 标签（逗号分隔，如 AI,Agent,OpenClaw）" "AI, Agent")
TAGS_FMT="[$(echo "$TAGS" | sed 's/ *, */, /g')]"

# ---------- 6. 生成文件 ----------
DATE_FULL=$(TZ=Asia/Shanghai date '+%Y-%m-%d %H:%M:%S +0800')
DATE_DAY=$(TZ=Asia/Shanghai date '+%Y-%m-%d')
FILE="$POSTS_DIR/${DATE_DAY}-${SLUG}.md"
[ -e "$FILE" ] && { echo "❌ 文件已存在: $FILE"; exit 1; }

{
  echo "---"
  echo "layout: single"
  echo "title: \"$TITLE\""
  echo "date: $DATE_FULL"
  echo "categories: [$CATEGORY]"
  [ -n "$DIFF_LINE" ] && echo "$DIFF_LINE"
  echo "tags: $TAGS_FMT"
  echo "author: W.ai"
  echo "header:"
  echo "  overlay_image: /assets/images/posts/${DATE_DAY}-${SLUG}-header.png   # TODO: 用 stable-image-ultra 生成专属配图"
  echo "  overlay_filter: 0.5"
  echo "  caption: \"\"   # TODO: 一句话配图说明"
  echo "excerpt: \"\"   # TODO: 一句话勾魂摘要"
  echo "toc: true"
  echo "toc_sticky: true"
  echo "---"
  echo ""
  echo "## 引言"
  echo ""
  echo "<!-- 正文从这里开始 -->"
  echo ""
} > "$FILE"

echo ""
echo "✅ 已创建：$FILE"
echo "   标题：$TITLE"
[ -n "$DIFF" ] && echo "   难度：$DIFF"
echo ""
echo "👉 下一步：① 写正文  ② 生成配图替换 overlay_image  ③ 填 caption/excerpt  ④ bundle exec jekyll build 预览  ⑤ git push"
