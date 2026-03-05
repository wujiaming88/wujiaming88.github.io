#!/usr/bin/env python3
import os
import re
from datetime import datetime
import markdown

def extract_front_matter(markdown_content):
    front_matter = {}
    if markdown_content.startswith('---'):
        end = markdown_content.find('---', 3)
        if end != -1:
            lines = markdown_content[3:end].split('\n')
            for line in lines:
                line = line.strip()
                if ':' in line:
                    key, value = line.split(':', 1)
                    key = key.strip()
                    value = value.strip().strip('"').strip("'")
                    front_matter[key] = value
    return front_matter

def clean_markdown_excerpt(markdown_content):
    # 移除markdown标题符号
    cleaned = re.sub(r'^#{1,6}\s+', '', markdown_content, flags=re.MULTILINE)
    # 移除粗体、斜体等格式符号
    cleaned = re.sub(r'(\*\*|__|\*|_)', '', cleaned)
    # 移除链接格式
    cleaned = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', cleaned)
    # 移除代码块标记
    cleaned = re.sub(r'```.*?```', '', cleaned, flags=re.DOTALL)
    # 移除行内代码标记
    cleaned = re.sub(r'`(.*?)`', r'\1', cleaned)
    # 移除列表符号
    cleaned = re.sub(r'^(\*|-|\d+\.)\s+', '', cleaned, flags=re.MULTILINE)
    # 移除图片标记
    cleaned = re.sub(r'!\[.*?\]\(.*?\)', '', cleaned)
    # 移除HTML标签
    cleaned = re.sub(r'<.*?>', '', cleaned)
    # 移除多余空行
    cleaned = re.sub(r'\n\s*\n', '\n', cleaned)
    # 移除特殊字符
    cleaned = re.sub(r'[^\w\s\u4e00-\u9fff，。！？；：、（）【】《》“”‘’]', '', cleaned)
    return cleaned.strip()

def generate_index_html():
    posts_dir = '_posts'
    posts = []
    
    # 读取所有文章
    for filename in os.listdir(posts_dir):
        if filename.endswith('.md'):
            filepath = os.path.join(posts_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # 提取front matter
            front_matter = extract_front_matter(content)
            
            # 提取摘要
            if '---' in content:
                content_after_front_matter = content.split('---', 2)[2].strip()
                # 提取前500个字符作为摘要
                raw_excerpt = content_after_front_matter[:500]
                # 清理markdown格式
                excerpt = clean_markdown_excerpt(raw_excerpt)
                if len(content_after_front_matter) > 500:
                    excerpt += '...'
            else:
                raw_excerpt = content[:500]
                excerpt = clean_markdown_excerpt(raw_excerpt)
                if len(content) > 500:
                    excerpt += '...'
            
            # 处理日期
            date_str = front_matter.get('date', filename[:10])
            try:
                date = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S %z')
                date_display = date.strftime('%Y年%m月%d日')
                date_path = date.strftime('%Y/%m/%d')
            except:
                try:
                    date = datetime.strptime(date_str, '%Y-%m-%d')
                    date_display = date.strftime('%Y年%m月%d日')
                    date_path = date.strftime('%Y/%m/%d')
                except:
                    date_display = date_str
                    date_path = '2026/03/03'  # 默认路径
            
            # 处理分类
            categories = front_matter.get('categories', '').strip('[]').replace(' ', '').split(',')
            category = categories[0].strip() if categories else '未分类'
            
            # 生成正确的文章路径
            if category == 'OpenClaw版本更新':
                post_path = f'openclaw/版本更新/{date_path}/openclaw-2026.3.2-update.html'
            elif category == 'OpenClaw技术研究':
                post_path = f'openclaw/技术研究/{date_path}/openclaw-env-vars-research.html'
            elif category == 'TechTrends':
                post_path = f'techtrends/github/{date_path}/github-trend-analysis.html'
            elif category == 'Technology':
                post_path = f'technology/openclaw/{date_path}/openclaw-2026-3-1-update-analysis.html'
            elif category == 'AI':
                post_path = f'ai/technology/weekly/{date_path}/global-ai-tech-news-weekly.html'
            elif category == 'news' and 'us-iran' in filename:
                post_path = f'news/international/{date_path}/us-iran-news.html'
            elif category == 'news' and 'news-broadcast' in filename:
                post_path = f'news/politics/{date_path}/news-broadcast.html'
            else:
                post_path = f'posts/{date_path}/{filename[:-3]}.html'
            
            posts.append({
                'filename': post_path,
                'title': front_matter.get('title', filename[11:-3].replace('-', ' ')),
                'date': date,
                'date_display': date_display,
                'category': category,
                'excerpt': excerpt
            })
    
    # 按日期排序
    posts.sort(key=lambda x: x['date'], reverse=True)
    
    # 生成分类统计
    categories = {}
    for post in posts:
        cat = post['category']
        if cat in categories:
            categories[cat] += 1
        else:
            categories[cat] = 1
    
    # 生成HTML
    html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>W.ai</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #fafafa;
            color: #333;
        }
        
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
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
        
        .container {
            display: flex;
            gap: 2rem;
            max-width: 1800px;
            margin: 2rem auto;
            padding: 0 2rem;
        }
        
        .main-content {
            flex: 1;
        }
        
        .sidebar {
            width: 380px;
            position: sticky;
            top: 2rem;
            height: fit-content;
        }
        
        .section-title {
            font-size: 1.8rem;
            margin: 2rem 0 1.5rem 0;
            color: #333;
            font-weight: bold;
            border-bottom: 3px solid #667eea;
            padding-bottom: 0.5rem;
        }
        
        .post-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .post-card {
            display: flex;
            gap: 2rem;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .post-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            border-color: #667eea;
        }
        
        .post-card-image {
            width: 300px;
            height: 200px;
            object-fit: cover;
            background: #f5f5f5;
            flex-shrink: 0;
        }
        
        .post-card-content {
            flex: 1;
            padding: 2rem;
        }
        
        .post-card-title {
            font-size: 1.5rem;
            margin: 0 0 0.75rem 0;
            font-weight: bold;
            line-height: 1.4;
        }
        
        .post-card-title a {
            color: #333;
            text-decoration: none;
        }
        
        .post-card-title a:hover {
            color: #667eea;
        }
        
        .post-card-meta {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        
        .post-card-excerpt {
            color: #666;
            font-size: 1rem;
            line-height: 1.6;
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
        
        footer {
            background: #f5f5f5;
            padding: 1.5rem 2rem;
            text-align: center;
            border-top: 1px solid #e0e0e0;
            margin-top: 3rem;
        }
        
        footer p {
            margin: 0;
            color: #666;
            font-size: 1rem;
        }
    </style>
</head>
<body>
    <div class="hero">
        <h1>🎯 W.ai</h1>
        <p>深度学习、AI技术研究与科技资讯整理</p>
    </div>
    
    <div class="container">
        <div class="main-content">
            <h2 class="section-title">📰 最新文章</h2>
            
            <div class="post-list" id="post-list">'''    
    # 添加文章卡片
    for post in posts:
        html += f'''                <div class="post-card">
                    <img class="post-card-image" src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop" alt="{post['title']}">
                    <div class="post-card-content">
                        <h3 class="post-card-title">
                            <a href="{post['filename']}">{post['title']}</a>
                        </h3>
                        <div class="post-card-meta">
                            <span>{post['date_display']}</span>
                            <span>•</span>
                            <span>{post['category']}</span>
                        </div>
                        <p class="post-card-excerpt">{post['excerpt']}</p>
                    </div>
                </div>'''
    
    html += '''            </div>
        </div>
        
        <div class="sidebar">
            <div class="sidebar-section">
                <h3 class="sidebar-title">🔍 搜索</h3>
                <input type="text" class="search-box" placeholder="搜索文章..." id="search-input">
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-title">📂 文章分类</h3>
                <ul class="category-list">'''    
    # 添加分类
    for category, count in sorted(categories.items()):
        html += f'''                    <li class="category-list-item">
                        <a href="#">
                            <span>{category}</span>
                            <span class="category-count">{count}</span>
                        </a>
                    </li>'''
    
    html += '''                </ul>
            </div>
        </div>
    </div>
    
    <footer>
        <p>W.ai的深度技术研究博客</p>
    </footer>
    
    <script>
        // 搜索功能
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const posts = document.querySelectorAll('.post-card');
                
                posts.forEach(post => {
                    const title = post.querySelector('.post-card-title a').textContent.toLowerCase();
                    const excerpt = post.querySelector('.post-card-excerpt')?.textContent.toLowerCase() || '';
                    
                    if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                        post.style.display = 'flex';
                    } else {
                        post.style.display = 'none';
                    }
                });
            });
        }
    </script>
</body>
</html>'''
    
    # 写入index.html
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"Generated {len(posts)} posts index page")

if __name__ == '__main__':
    generate_index_html()