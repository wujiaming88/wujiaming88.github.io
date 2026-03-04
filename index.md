---
layout: page
title: "W.ai"
---

<style>
  .container {
    display: flex;
    gap: 2rem;
    max-width: 1600px;
    margin: 2rem auto;
    padding: 0 2rem;
  }
  
  .main-content {
    flex: 1;
    min-width: 0;
  }
  
  .sidebar {
    width: 350px;
    position: sticky;
    top: 2rem;
    height: fit-content;
    flex-shrink: 0;
  }
  
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
  
  .post-horizontal-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin: 2rem 0;
  }
  
  .post-horizontal-card {
    display: flex;
    gap: 2rem;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    min-height: 200px;
  }
  
  .post-horizontal-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    border-color: #667eea;
  }
  
  .post-horizontal-image {
    width: 300px;
    height: 200px;
    object-fit: cover;
    background: #f5f5f5;
    flex-shrink: 0;
  }
  
  .post-horizontal-content {
    flex: 1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }
  
  .post-horizontal-title {
    font-size: 1.5rem;
    margin: 0 0 0.75rem 0;
    font-weight: bold;
    line-height: 1.4;
  }
  
  .post-horizontal-title a {
    color: #333;
    text-decoration: none;
    transition: color 0.3s;
  }
  
  .post-horizontal-title a:hover {
    color: #667eea;
  }
  
  .post-horizontal-meta {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .post-horizontal-excerpt {
    color: #666;
    font-size: 1rem;
    line-height: 1.6;
    flex: 1;
    margin-bottom: 1rem;
  }
  
  .post-horizontal-readmore {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
  }
  
  .post-horizontal-readmore:hover {
    color: #5568d3;
    text-decoration: underline;
  }
  
  .sidebar-section {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .sidebar-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #333;
    border-bottom: 2px solid #667eea;
    padding-bottom: 0.5rem;
  }
  
  .search-box {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  .category-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .category-list-item {
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .category-list-item:last-child {
    border-bottom: none;
  }
  
  .category-list-item a {
    color: #333;
    text-decoration: none;
    transition: color 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .category-list-item a:hover {
    color: #667eea;
  }
  
  .category-count {
    background: #667eea;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .load-more {
    text-align: center;
    margin: 2rem 0;
  }
  
  .load-more-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .load-more-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
  
  /* 移除移动端适配，仅适配桌面端 */
</style>

<div class="hero">
  <h1>🎯 W.ai</h1>
  <p>深度学习、AI技术研究与科技资讯整理</p>
</div>

<div class="container">
  <div class="main-content">
    <h2 class="section-title">📰 最新文章</h2>
    
    <div class="post-horizontal-list" id="post-list">
      {% assign posts = site.posts | sort: 'date' | reverse %}
      {% for post in posts limit: 5 %}
        <div class="post-horizontal-card">
          {% if post.header.overlay_image %}
            <img class="post-horizontal-image" src="{{ post.header.overlay_image }}" alt="{{ post.title }}">
          {% else %}
            <img class="post-horizontal-image" src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop" alt="默认图片">
          {% endif %}
          <div class="post-horizontal-content">
            <div>
              <h3 class="post-horizontal-title">
                <a href="{{ post.url }}">{{ post.title }}</a>
              </h3>
              <div class="post-horizontal-meta">
                <span>{{ post.date | date: "%Y年%m月%d日" }}</span>
                {% if post.categories %}
                  <span>•</span>
                  <span>{{ post.categories | first }}</span>
                {% endif %}
              </div>
              {% if post.excerpt %}
              <p class="post-horizontal-excerpt">{{ post.excerpt | strip_html | truncate: 200 }}</p>
              {% endif %}
            </div>
            <a href="{{ post.url }}" class="post-horizontal-readmore">阅读更多 →</a>
          </div>
        </div>
      {% endfor %}
    </div>
    
    {% if posts.size > 5 %}
    <div class="load-more">
      <button class="load-more-btn" id="load-more-btn">加载更多文章</button>
    </div>
    {% endif %}
  </div>
  
  <div class="sidebar">
    <div class="sidebar-section">
      <h3 class="sidebar-title">🔍 搜索</h3>
      <input type="text" class="search-box" placeholder="搜索文章..." id="search-input">
    </div>
    
    <div class="sidebar-section">
      <h3 class="sidebar-title">📂 文章分类</h3>
      <ul class="category-list">
        {% assign categories = site.categories | sort %}
        {% for category in categories %}
        <li class="category-list-item">
          <a href="/categories/{{ category[0] }}/">
            <span>{{ category[0] }}</span>
            <span class="category-count">{{ category[1].size }}</span>
          </a>
        </li>
        {% endfor %}
      </ul>
    </div>
  </div>
</div>

<script>
// 无限滚动加载
let currentPage = 1;
const loadMoreBtn = document.getElementById('load-more-btn');
const postList = document.getElementById('post-list');

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', async () => {
    currentPage++;
    loadMoreBtn.textContent = '加载中...';
    loadMoreBtn.disabled = true;
    
    try {
      const response = await fetch(`/page/${currentPage}/`);
      const html = await response.text();
      
      // 解析HTML并提取文章卡片
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newPosts = doc.querySelectorAll('.post-horizontal-card');
      
      if (newPosts.length > 0) {
        newPosts.forEach(post => {
          postList.appendChild(post);
        });
      } else {
        loadMoreBtn.textContent = '没有更多文章了';
        loadMoreBtn.disabled = true;
      }
    } catch (error) {
      console.error('加载失败:', error);
      loadMoreBtn.textContent = '加载失败，请重试';
      loadMoreBtn.disabled = false;
    }
  });
}

// 搜索功能
const searchInput = document.getElementById('search-input');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const posts = document.querySelectorAll('.post-horizontal-card');
    
    posts.forEach(post => {
      const title = post.querySelector('.post-horizontal-title a').textContent.toLowerCase();
      const excerpt = post.querySelector('.post-horizontal-excerpt')?.textContent.toLowerCase() || '';
      
      if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
        post.style.display = 'flex';
      } else {
        post.style.display = 'none';
      }
    });
  });
}
</script>
