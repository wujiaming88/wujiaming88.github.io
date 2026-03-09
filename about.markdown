---
layout: default
title: 关于
permalink: /about/
---

<style>
  :root {
    --bg-primary: #fafbfc;
    --bg-secondary: #ffffff;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --accent-primary: #6366f1;
    --border-color: #e5e7eb;
    --radius-md: 12px;
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .about-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 3rem 1rem;
  }

  .hero-section {
    text-align: center;
    margin-bottom: 4rem;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--accent-primary), #4f46e5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: var(--text-secondary);
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }

  .section {
    margin-bottom: 3rem;
  }

  .section-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--border-color);
  }

  .intro-text {
    font-size: 1.1rem;
    color: var(--text-secondary);
    line-height: 1.8;
  }

  .intro-text p {
    margin-bottom: 1rem;
  }

  .directions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .direction-card {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-md);
    transition: all 0.3s ease;
  }

  .direction-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.15);
    border-color: var(--accent-primary);
  }

  .direction-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: block;
  }

  .direction-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .direction-desc {
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .contact-section {
    text-align: center;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .contact-item {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem 2rem;
    background: var(--bg-secondary);
    border-radius: 50px;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-md);
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 500;
    transition: all 0.3s ease;
    max-width: 400px;
  }

  .contact-item:hover {
    background: var(--accent-primary);
    color: white;
    border-color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px -1px rgba(99, 102, 241, 0.3);
  }

  .contact-item.github:hover {
    background: #1f2937;
    border-color: #1f2937;
  }

  .contact-icon {
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }

    .directions-grid {
      grid-template-columns: 1fr;
    }

    .contact-info {
      flex-direction: column;
    }

    .contact-item {
      width: 100%;
      justify-content: center;
    }
  }
</style>

<div class="about-page">
  <!-- Hero Section -->
  <section class="hero-section">
    <h1 class="hero-title">W.ai</h1>
    <p class="hero-subtitle">探索AI技术 · 记录深度研究 · 分享科技洞察</p>
  </section>

  <!-- 关于博客 -->
  <section class="section">
    <h2 class="section-title">关于博客</h2>
    <div class="intro-text">
      <p>这是一个专注 AI 和前沿技术的深度研究博客，由 W.ai Team 运营维护。</p>
      <p>我们致力于分享对人工智能技术的深入理解和实践经验，涵盖从理论研究到工程实践的各个环节。</p>
      <p>在这里，你可以找到关于 AI Agent、大语言模型、开源项目和工程实践的深度文章。</p>
    </div>
  </section>

  <!-- 研究方向 -->
  <section class="section">
    <h2 class="section-title">研究方向</h2>
    <div class="directions-grid">
      <div class="direction-card">
        <span class="direction-icon">🤖</span>
        <div class="direction-title">AI Agent</div>
        <div class="direction-desc">Agent 编排、多Agent协作、自动化</div>
      </div>
      <div class="direction-card">
        <span class="direction-icon">🧠</span>
        <div class="direction-title">大语言模型</div>
        <div class="direction-desc">LLM 原理、应用、评测</div>
      </div>
      <div class="direction-card">
        <span class="direction-icon">🔧</span>
        <div class="direction-title">工程实践</div>
        <div class="direction-desc">开发工具、架构设计、最佳实践</div>
      </div>
      <div class="direction-card">
        <span class="direction-icon">📊</span>
        <div class="direction-title">技术调研</div>
        <div class="direction-desc">开源项目分析、论文解读</div>
      </div>
    </div>
  </section>

  <!-- 联系方式 -->
  <section class="section contact-section">
    <h2 class="section-title">联系方式</h2>
    <div class="contact-info">
      <a href="https://github.com/wujiaming88" class="contact-item github" target="_blank">
        <span class="contact-icon">💻</span>
        <span>github.com/wujiaming88</span>
      </a>
      <a href="mailto:garming.wu@gmail.com" class="contact-item">
        <span class="contact-icon">✉️</span>
        <span>garming.wu@gmail.com</span>
      </a>
    </div>
  </section>
</div>
