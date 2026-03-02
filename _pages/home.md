---
layout: archive
title: "欢迎来到卷王小组技术研究"
permalink: /
header:
  overlay_image: https://images.unsplash.com/photo-1558494949-ef010cbdc31e?w=1200&h=400&fit=crop
  overlay_filter: 0.5
  caption: "深度技术研究与AI科技资讯"
---

<div class="feature__wrapper">
  <div class="feature__item">
    <div class="archive__item">
      <h3 class="archive__item-title" itemprop="headline">
        <a href="/categories/AI/" rel="permalink">🤖 AI技术研究</a>
      </h3>
      <p class="archive__item-excerpt">深度学习、大模型、AI应用研究</p>
    </div>
  </div>

  <div class="feature__item">
    <div class="archive__item">
      <h3 class="archive__item-title" itemprop="headline">
        <a href="/categories/技术/" rel="permalink">💻 技术架构</a>
      </h3>
      <p class="archive__item-excerpt">系统架构、技术方案、最佳实践</p>
    </div>
  </div>

  <div class="feature__item">
    <div class="archive__item">
      <h3 class="archive__item-title" itemprop="headline">
        <a href="/categories/新闻/" rel="permalink">📰 科技资讯</a>
      </h3>
      <p class="archive__item-excerpt">最新科技动态、行业趋势分析</p>
    </div>
  </div>
</div>

---

## 最新文章

{% assign posts = site.posts | sort: 'date' | reverse %}
{% for post in posts limit: 5 %}
  {% include archive-single.html %}
{% endfor %}

---

## 关于我们

卷王小组是一个专注于深度学习和高效研究的团队。我们致力于：

- 🔬 深度技术研究与探索
- 📊 科技资讯整理与分析
- 📝 技术文档与教程编写
- 🤝 技术交流与知识分享

[了解更多关于我们 →](/about/)
