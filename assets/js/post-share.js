/* 文章分享：X / 微博 / 微信扫码 / 小红书 / 复制链接
   依赖 window.shareData（由文章页内联注入，含 Liquid 变量）与本地 qrcode.min.js（纯前端生成二维码，不外发 URL）。 */
(function () {
  var shareData = window.shareData || { title: document.title, url: location.href, excerpt: '', tags: [] };
  var lastTrigger = null; // 记录打开弹窗前的焦点元素，关闭时还原

  function buildQr(boxId, text) {
    var box = document.getElementById(boxId);
    if (!box) return;
    box.innerHTML = '';
    if (typeof qrcode === 'function') {
      try {
        var qr = qrcode(0, 'M');
        qr.addData(text);
        qr.make();
        // createSvgTag 纯本地生成，不请求任何第三方
        box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 4, scalable: true });
        var svg = box.querySelector('svg');
        if (svg) { svg.setAttribute('width', '180'); svg.setAttribute('height', '180'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', '文章二维码'); }
        return;
      } catch (e) { /* 落到下面的文字兜底 */ }
    }
    var p = document.createElement('p');
    p.textContent = '二维码生成失败，请直接复制链接：' + text;
    box.appendChild(p);
  }

  // 打开二维码弹窗（微信 / 小红书复用）
  function openQrModal(modalId, qrBoxId) {
    var modal = document.getElementById(modalId);
    if (!modal) return;
    lastTrigger = document.activeElement;
    buildQr(qrBoxId, shareData.url);
    modal.classList.add('show');
    var closeBtn = modal.querySelector('.wx-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
    if (lastTrigger && typeof lastTrigger.focus === 'function') { lastTrigger.focus(); lastTrigger = null; }
  }

  // === 复制链接 ===
  window.copyToClipboard = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { alert('链接已复制到剪贴板！'); }, function () { prompt('请手动复制链接：', text); });
    } else {
      prompt('请手动复制链接：', text);
    }
  };

  // === 分享到 X (Twitter) ===
  window.shareToX = function () {
    var hashtags = '';
    if (shareData.tags && shareData.tags.length > 0) {
      hashtags = shareData.tags.slice(0, 3).map(function (t) { return t.replace(/[\s\-]/g, ''); }).join(',');
    }
    var excerpt = (shareData.excerpt || '').replace(/\n/g, ' ').trim();
    var maxExcerpt = 200;
    if (excerpt.length > maxExcerpt) {
      var cut = excerpt.lastIndexOf('。', maxExcerpt);
      if (cut < 80) cut = excerpt.lastIndexOf('，', maxExcerpt);
      if (cut < 80) cut = excerpt.lastIndexOf('. ', maxExcerpt);
      if (cut < 80) cut = maxExcerpt;
      excerpt = excerpt.substring(0, cut + 1) + '...';
    }
    var tweetText = '📖 ' + shareData.title + '\n\n' + excerpt;
    var url = 'https://x.com/intent/tweet?text=' + encodeURIComponent(tweetText) + '&url=' + encodeURIComponent(shareData.url);
    if (hashtags) url += '&hashtags=' + encodeURIComponent(hashtags);
    window.open(url, '_blank', 'width=600,height=450');
  };

  // === 分享到微博（HTTPS，避免 https 页面 mixed content 被拦） ===
  window.shareToWeibo = function () {
    var title = '📖 ' + shareData.title;
    var url = 'https://service.weibo.com/share/share.php?url=' + encodeURIComponent(shareData.url) + '&title=' + encodeURIComponent(title);
    window.open(url, '_blank', 'width=600,height=450');
  };

  // === 微信 / 小红书：复用 openQrModal ===
  window.shareToWechat = function () { openQrModal('wechat-share-modal', 'wechat-qrcode'); };
  window.shareToXhs = function () { openQrModal('xhs-share-modal', 'xhs-qrcode'); };
  window.closeWechatModal = function () { closeModal('wechat-share-modal'); };
  window.closeXhsModal = function () { closeModal('xhs-share-modal'); };

  window.copyXhsContent = function () {
    var text = shareData.title + '\n' + shareData.url;
    var btn = document.getElementById('xhs-copy-btn');
    function done() {
      if (btn) {
        var orig = btn.textContent;
        btn.textContent = '✅ 已复制，去小红书粘贴发布';
        setTimeout(function () { btn.textContent = orig; }, 2200);
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { prompt('请手动复制：', text); });
    } else {
      prompt('请手动复制：', text);
    }
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal('wechat-share-modal'); closeModal('xhs-share-modal'); }
  });
})();
