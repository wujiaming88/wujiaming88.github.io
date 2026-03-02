---
layout: page
title: "卷王小组技术研究"
---

<style>
  .hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4rem 2rem;
    text-align: center;
    border-radius: 12px;
    margin-bottom: 3rem;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  }
  
  .hero h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }
  
  .hero p {
    font-size: 1.2rem;
    opacity: 0.95;
    margin-bottom: 0;
  }
  
  .section-title {
    font-size: 1.8rem;
    margin: 2rem 0 1.5rem 0;
    color: #333;
    font-weight: bold;
    border-bottom: 3px solid #667eea;
    padding-bottom: 0.5rem;
  }
  
  .post-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }
  
  .post-card {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .post-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    border-color: #667eea;
  }
  
  .post-card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: #f5f5f5;
  }
  
  .post-card-content {
    padding: 1.5rem;
  }
  
  .post-card-title {
    font-size: 1.2rem;
    margin: 0.5rem 0 0.75rem 0;
    font-weight: bold;
    line-height: 1.4;
  }
  
  .post-card-title a {
    color: #333;
    text-decoration: none;
    transition: color 0.3s;
  }
  
  .post-card-title a:hover {
    color: #667eea;
  }
  
  .post-card-date {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .post-card-excerpt {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin: 2rem 0;
  }
  
  .category-tag {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }
  
  .category-tag:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
  
  .about-section {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 12px;
    margin: 2rem 0;
  }
  
  .about-section h3 {
    margin-top: 0;
    color: #333;
  }
  
  .about-section ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0 0;
  }
  
  .about-section li {
    padding: 0.5rem 0;
    font-size: 1.05rem;
  }
  
  @media (max-width: 768px) {
    .hero {
      padding: 3rem 1.5rem;
    }
    
    .hero h1 {
      font-size: 2rem;
    }
    
    .post-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<div class="hero">
  <h1>🎯 卷王小组技术研究</h1>
  <p>深度学习、AI技术研究与科技资讯整理</p>
</div>

## 📰 最新文章

{% assign posts = site.posts | sort: 'date' | reverse %}
<div class="post-grid">
  {% for post in posts limit: 6 %}
    <div class="post-card">
      {% if post.header.overlay_image %}
        <img class="post-card-image" src="{{ post.header.overlay_image }}" alt="{{ post.title }}">
      {% else %}
        <img class="post-card-image" src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop" alt="默认图片">
      {% endif %}
      <div class="post-card-content">
        <h3 class="post-card-title">
          <a href="{{ post.url }}">{{ post.title }}</a>
        </h3>
        <p class="post-card-date">{{ post.date | date: "%Y年%m月%d日" }}</p>
        {% if post.excerpt %}
        <p class="post-card-excerpt">{{ post.excerpt | strip }}</p>
        {% endif %}
      </div>
    </div>
  {% endfor %}
</div>

## 📂 分类导航

<div class="categories">
  <a href="/categories/AI/" class="category-tag">🤖 AI技术</a>
  <a href="/categories/科技/" class="category-tag">💻 科技资讯</a>
  <a href="/categories/技术/" class="category-tag">🔧 技术深度</a>
  <a href="/categories/新闻/" class="category-tag">📰 新闻</a>
  <a href="/categories/时政/" class="category-tag">🏛️ 时政</a>
  <a href="/categories/国际/" class="category-tag">🌍 国际</a>
  <a href="/categories/周报/" class="category-tag">📊 周报</a>
</div>

## 关于我们

<div class="about-section">
  <h3>👋 卷王小组</h3>
  <p>卷王小组是一个专注于深度学习和高效研究的团队。我们致力于：</p>
  <ul>
    <li>🔬 深度技术研究与探索</li>
    <li>📊 科技资讯整理与分析</li>
    <li>📝 技术文档与教程编写</li>
    <li>🤝 技术交流与知识分享</li>
  </ul>
</div>
