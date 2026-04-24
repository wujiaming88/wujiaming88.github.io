---
layout: default
title: 关于
permalink: /about/
---

<style>
.about-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 0;
}

.about-hero {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 0;
}

.about-hero h1 {
    font-size: 3rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent-light), var(--accent-cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 0.5rem;
    border: none;
    padding: 0;
}

.about-hero p {
    font-size: 1.1rem;
    color: var(--text-secondary);
}

.about-section {
    margin-bottom: 2.5rem;
}

.about-section-title {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 1rem;
}

.about-text {
    font-size: 1rem;
    color: var(--text-primary);
    line-height: 1.8;
    margin-bottom: 0.75rem;
}

/* 研究方向卡片 */
.direction-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
}

.dir-card {
    display: flex;
    gap: 12px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 16px;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
}

.dir-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.dir-emoji {
    font-size: 1.5rem;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--tag-bg);
    border-radius: var(--radius-md);
    flex-shrink: 0;
}

.dir-body h4 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 2px;
    color: var(--text-heading);
}

.dir-body p {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
}

/* 统计 */
.stats-row {
    display: flex;
    justify-content: center;
    gap: 2.5rem;
    padding: 2.5rem 0;
    margin: 2rem 0;
    text-align: center;
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
}

.stats-row .num {
    font-size: 2.25rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 4px;
}

.stats-row .label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    font-weight: 500;
}

/* 联系方式 */
.about-section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-heading);
    margin-bottom: 1.25rem;
    text-align: center;
    position: relative;
    padding-bottom: 0.75rem;
}

.about-section-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(135deg, var(--accent), var(--accent-light));
}

.contact-btns {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
    padding: 2rem;
}

.contact-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    min-width: 240px;
    justify-content: center;
}

.contact-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.contact-btn-primary {
    background: linear-gradient(135deg, var(--accent), var(--accent-light));
    color: #fff;
}

.contact-btn-outline {
    background: var(--bg-card);
    color: var(--text-heading);
    border: 1px solid var(--border-color);
}

.contact-btn-outline:hover {
    border-color: var(--accent);
    color: var(--accent);
}

@media (max-width: 768px) {
    .about-hero h1 { font-size: 2.25rem; }
    .direction-list { grid-template-columns: 1fr; }
    .stats-row { gap: 1.5rem; }
    .contact-btn { min-width: 100%; }
}
</style>

<div class="about-page">
    <section class="about-hero">
        <h1>W.ai</h1>
        <p>探索 AI 技术 · 记录深度研究</p>
    </section>

    <section class="about-section">
        <div class="about-section-title">关于博客</div>
        <p class="about-text">这是一个专注 AI 和前沿技术的深度研究博客，由 W.ai Team 运营维护。</p>
        <p class="about-text">我们致力于分享对人工智能技术的深入理解和实践经验，涵盖从理论研究到工程实践的各个环节。</p>
        <p class="about-text">在这里，你可以找到关于 AI Agent、大语言模型、开源项目和工程实践的深度文章。每一篇文章都经过深入调研与实验验证，力求为读者提供真正有价值的技术洞见。</p>
    </section>

    <section class="about-section">
        <div class="about-section-title">研究方向</div>
        <div class="direction-list">
            <div class="dir-card">
                <div class="dir-emoji">🤖</div>
                <div class="dir-body"><h4>AI Agent</h4><p>Agent 编排、多Agent协作、自动化工作流</p></div>
            </div>
            <div class="dir-card">
                <div class="dir-emoji">🧠</div>
                <div class="dir-body"><h4>大语言模型</h4><p>LLM 原理、应用场景、性能评测</p></div>
            </div>
            <div class="dir-card">
                <div class="dir-emoji">🔧</div>
                <div class="dir-body"><h4>工程实践</h4><p>开发工具、架构设计、最佳实践</p></div>
            </div>
            <div class="dir-card">
                <div class="dir-emoji">📊</div>
                <div class="dir-body"><h4>技术调研</h4><p>开源项目分析、论文解读、选型对比</p></div>
            </div>
        </div>
    </section>

    <div class="stats-row">
        <div class="stat-item"><div class="num">{{ site.posts.size }}</div><div class="label">篇文章</div></div>
        <div class="stat-item"><div class="num">{{ site.categories.size }}</div><div class="label">个分类</div></div>
        <div class="stat-item"><div class="num">{{ site.tags.size }}</div><div class="label">个标签</div></div>
    </div>

    <section class="about-section">
        <div class="about-section-title">联系方式</div>
        <div class="contact-btns">
            <a class="contact-btn contact-btn-primary" href="https://github.com/wujiaming88" target="_blank">💻 GitHub →</a>
            <a class="contact-btn contact-btn-outline" href="mailto:garming.wu@gmail.com">✉️ garming.wu@gmail.com</a>
        </div>
    </section>
</div>
