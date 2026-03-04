#!/usr/bin/env python3
import os
import re
from datetime import datetime

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
                # 提取前300个字符作为摘要
                excerpt = content_after_front_matter[:300].replace('\n', ' ').replace('\r', '')
                if len(content_after_front_matter) > 300:
                    excerpt += '...'
            else:
                excerpt = content[:300].replace('\n', ' ').replace('\r', '')
                if len(content) > 300:
                    excerpt += '...'
            
            # 处理日期
            date_str = front_matter.get('date', filename[:10])
            try:
                date = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S %z')
                date_display = date.strftime('%Y年%m月%d日')
            except:
                try:
                    date = datetime.strptime(date_str, '%Y-%m-%d')
                    date_display = date.strftime('%Y年%m月%d日')
                except:
                    date_display = date_str
            
            # 处理分类
            categories = front_matter.get('categories', '').strip('[]').replace(' ', '').split(',')
            category = categories[0].strip() if categories else '未分类'
            
            posts.append({
'filename': filename[:-3] + '.html',
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
    </divdiv>
    
    <div class="container">
        <div class="main-content">
            <h2 class="section-title">📰 最新文章</h2>
            
            <div class="post-list" id="post-list">'''
    
    # 添加文章卡片
    for post in posts:
        html += f'''
                <div class="post-card">
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
    
    html += '''
            </div>
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
        html += f'''
                    <li class="category-list-item">
                        <a href="#">
                            <span>{category}</span>
                            <span class="category-count">{count}</span>
                        </a>
                    </li>'''
    
    html += '''
                </ul>
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
    
    # 生成单篇文章页面
    for post in posts:
        filepath = os.path.join(posts_dir, post['filename'][:-3] + '.md')
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 生成文章页面HTML
            post_html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{post['title']} - W.ai</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #fafafa;
            color: #333;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 2rem;
        }}
        
        .post-header {{
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }}
        
        .post-title {{
            font-size: 2.5rem;
            margin: 0 0 1rem 0;
            font-weight: bold;
        }}
        
        .post-meta {{
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }}
        
        .post-content {{
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            line-height: 1.8;
        }}
        
        .post-content h2 {{
            font-size: 1.8rem;
            margin: 1.5rem 0 1rem 0;
        }}
        
        .post-content p {{
            margin-bottom: 1rem;
        }}
        
        .post-content pre {{
            background: #f5f5f5;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
        }}
        
        .back-link {{
            display: inline-block;
            margin-top: 2rem;
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }}
        
        .back-link:hover {{
            text-decoration: underline;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="post-header">
            <h1 class="post-title">{post['title']}</h1>
            <div class="post-meta">
                <span>{post['date_display']}</span>
                <span> • </span>
                <span>{post['category']}</span>
            </div>
        </div>
        
        <div class="post-content">
            {content}
        </div>
        
        <a href="index.html" class="back-link">← 返回首页</a>
    </div>
</body>
</html>'''
            
            with open(post['filename'], 'w', encoding='utf-8') as f:
                f.write(post_html)
    
    print(f"Generated {len(posts)} posts and {len(posts)} post pages")

if __name__ == '__main__':
    generate_index_html()
