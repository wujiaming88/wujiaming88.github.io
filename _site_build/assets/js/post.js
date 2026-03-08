/**
 * 文章页面 JavaScript - 代码复制功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 为每个代码块添加复制按钮
    const codeBlocks = document.querySelectorAll('.post-content pre');
    
    codeBlocks.forEach((pre, index) => {
        // 创建代码块头部
        const header = document.createElement('div');
        header.className = 'code-header';
        
        // 检测代码语言
        let language = 'code';
        const codeElement = pre.querySelector('code');
        if (codeElement && codeElement.className) {
            const langMatch = codeElement.className.match(/language-(\w+)/);
            if (langMatch) {
                language = langMatch[1];
            }
        }
        
        // 语言标签
        const langSpan = document.createElement('span');
        langSpan.className = 'code-language';
        langSpan.textContent = language;
        
        // 复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-button';
        copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> 复制';
        copyBtn.setAttribute('data-clipboard-target', '#code-' + index);
        
        header.appendChild(langSpan);
        header.appendChild(copyBtn);
        
        // 将头部插入到代码块前面
        pre.insertBefore(header, pre.firstChild);
        
        // 为代码元素添加ID以便复制
        if (codeElement) {
            codeElement.id = 'code-' + index;
        }
        
        // 添加复制事件
        copyBtn.addEventListener('click', async function() {
            const code = codeElement ? codeElement.textContent : pre.textContent;
            
            try {
                await navigator.clipboard.writeText(code);
                
                // 显示复制成功状态
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> 已复制';
                
                // 2秒后恢复原状
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> 复制';
                }, 2000);
            } catch (err) {
                console.error('复制失败:', err);
                copyBtn.textContent = '复制失败';
            }
        });
    });
});
