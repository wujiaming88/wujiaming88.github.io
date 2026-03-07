---
layout: default
title: 解谜 Contact
permalink: /about/
---

<style>
.puzzle-container {
    max-width: 600px;
    margin: 3rem auto;
    padding: 2rem;
    text-align: center;
}

.puzzle-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #1f2937;
}

.puzzle-subtitle {
    color: #6b7280;
    margin-bottom: 2.5rem;
    font-size: 1.1rem;
}

/* 数字网格 */
.number-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 0.75rem;
    max-width: 500px;
    margin: 0 auto 2rem;
}

.number-cell {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
    padding: 1rem;
    border-radius: 12px;
    font-size: 1.5rem;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    transition: transform 0.2s ease;
}

.number-cell:hover {
    transform: scale(1.05);
}

/* 输入框 */
.answer-input {
    width: 100%;
    max-width: 400px;
    padding: 1rem 1.5rem;
    font-size: 1.2rem;
    border: 2px solid #e5e7eb;
    border-radius: 50px;
    outline: none;
    transition: all 0.3s ease;
    text-align: center;
    margin-bottom: 1.5rem;
}

.answer-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.submit-btn {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
    border: none;
    padding: 1rem 3rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

/* 结果展示 - 仪式感动画 */
.result-container {
    display: none;
    margin-top: 2rem;
    padding: 2rem;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-radius: 20px;
    border: 2px solid #22c55e;
    animation: reveal 0.8s ease-out;
}

@keyframes reveal {
    0% {
        opacity: 0;
        transform: scale(0.8) translateY(20px);
    }
    50% {
        transform: scale(1.05) translateY(-10px);
    }
    100% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.result-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 1s ease infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.result-title {
    font-size: 1.5rem;
    color: #166534;
    margin-bottom: 1rem;
    font-weight: bold;
}

.email-display {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: white;
    color: #6366f1 !important;
    padding: 1.25rem 2rem;
    border-radius: 50px;
    font-size: 1.3rem;
    font-weight: 600;
    text-decoration: none !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
    0%, 100% { box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2); }
    50% { box-shadow: 0 4px 25px rgba(99, 102, 241, 0.4); }
}

.error-message {
    color: #ef4444;
    margin-top: 1rem;
    display: none;
    animation: shake 0.5s ease;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

/* 提示 */
.hint {
    margin-top: 2rem;
    color: #9ca3af;
    font-size: 0.9rem;
    cursor: pointer;
}

.hint:hover {
    color: #6b7280;
}
</style>

<div class="puzzle-container">
    <h1 class="puzzle-title">🔐 数字谜阵</h1>
    <p class="puzzle-subtitle">每个数字对应一个字母，破解序列获取联系方式</p>
    
    <!-- 数字序列展示 -->
    <div class="number-grid">
        <div class="number-cell">7</div>
        <div class="number-cell">1</div>
        <div class="number-cell">18</div>
        <div class="number-cell">13</div>
        <div class="number-cell">9</div>
        <div class="number-cell">14</div>
        <div class="number-cell">7</div>
    </div>
    <div class="number-grid">
        <div class="number-cell">23</div>
        <div class="number-cell">21</div>
    </div>
    <div class="number-grid">
        <div class="number-cell">7</div>
        <div class="number-cell">13</div>
        <div class="number-cell">1</div>
        <div class="number-cell">9</div>
        <div class="number-cell">12</div>
        <div class="number-cell">=</div>
        <div class="number-cell">3</div>
        <div class="number-cell">15</div>
        <div class="number-cell">13</div>
    </div>
    <div class="number-grid">
        <div class="number-cell">@</div>
    </div>
    <div class="number-grid">
        <div class="number-cell">7</div>
        <div class="number-cell">13</div>
        <div class="number-cell">1</div>
        <div class="number-cell">9</div>
        <div class="number-cell">12</div>
        <div class="number-cell">3</div>
        <div class="number-cell">15</div>
        <div class="number-cell">13</div>
    </div>
    
    <input type="text" id="answer" class="answer-input" placeholder="输入破解的答案..." autocomplete="off">
    
    <br>
    
    <button class="submit-btn" onclick="checkAnswer()">🔓 解锁答案</button>
    
    <p class="error-message" id="error">❌ 再试一次，字母顺序很重要！</p>
    
    <!-- 正确答案展示 -->
    <div class="result-container" id="result">
        <div class="result-icon">🎉</div>
        <div class="result-title">✨ 恭喜破解！✨</div>
        <a href="mailto:garming.wu@gmail.com" class="email-display">
            <span>✉️</span>
            <span>garming.wu@gmail.com</span>
        </a>
    </div>
    
    <p class="hint" onclick="toggleHint()">💡 提示：26个英文字母对应1-26</p>
    <p id="hint-text" style="display:none; color: #9ca3af; margin-top: 0.5rem;">A=1, B=2, ..., Z=26</p>
</div>

<script>
function checkAnswer() {
    const answer = document.getElementById('answer').value.toLowerCase().trim();
    const correctAnswers = [
        'garming.wu@gmail.com',
        'garming.wu@gmail.com',
        'garming.wu@gmail.com',
        'garmingwu@gmail.com'
    ];
    
    if (correctAnswers.includes(answer)) {
        document.getElementById('result').style.display = 'block';
        document.getElementById('error').style.display = 'none';
        document.getElementById('answer').style.display = 'none';
        document.querySelector('.submit-btn').style.display = 'none';
        document.querySelector('.hint').style.display = 'none';
        document.getElementById('hint-text').style.display = 'none';
        
        // 添加庆祝音效（可选）
        playCelebration();
    } else {
        document.getElementById('error').style.display = 'block';
        document.getElementById('result').style.display = 'none';
    }
}

function toggleHint() {
    const hintText = document.getElementById('hint-text');
    hintText.style.display = hintText.style.display === 'none' ? 'block' : 'none';
}

// 支持回车提交
document.getElementById('answer').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

function playCelebration() {
    // 可以添加音效，这里暂时用视觉动画替代
    console.log('🎉 恭喜找到联系方式！');
}
</script>
