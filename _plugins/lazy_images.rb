# frozen_string_literal: true

# 为文章正文中的图片自动补充 loading="lazy" 与 decoding="async"。
#
# 背景：正文图片由 Markdown `![](path)` 经 kramdown 渲染为裸 <img>，缺少懒加载属性；
# 首屏会同步请求所有正文大图，拖慢 LCP。
#
# 实现要点（重要）：必须在 `:post_render` 钩子里处理——`:post_convert` 阶段
# `doc.output` 仍为 nil，直接改写会被跳过（已实测）。
#
# 范围：
#   - 只处理 posts 集合的文档最终 HTML；
#   - og:image / twitter:image 是 <meta>，不是 <img>，不受影响；
#   - 布局中已带 loading 的封面图会因已存在属性而原样跳过，不重复添加。
Jekyll::Hooks.register :documents, :post_render do |doc|
  next unless doc.respond_to?(:collection) && doc.collection&.label == "posts"
  next if doc.output.nil? || doc.output.empty?

  doc.output = doc.output.gsub(/<img\b[^>]*>/i) do |tag|
    extra = +""
    extra << ' loading="lazy"' unless tag =~ /\bloading\s*=/i
    extra << ' decoding="async"' unless tag =~ /\bdecoding\s*=/i
    extra.empty? ? tag : tag.sub(/<img/i, "<img#{extra}")
  end
end
