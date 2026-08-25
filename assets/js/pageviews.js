/* 文章阅读量统计 —— C1 方案（Cloudflare Worker + KV）
 * 仅在文章页运行：POST 计数+1，把结果回填到 #pv-count 徽章。
 * 列表页等只读场景可改用 GET（本脚本默认文章页 POST）。
 *
 * API 端点由 <body data-pv-api="..."> 提供（见 single.html）；未配置则静默跳过。
 */
(function () {
  var el = document.getElementById("pv-count");
  if (!el) return;
  var configuredApi = (document.body && document.body.getAttribute("data-pv-api")) || "";
  // Cloudflare 镜像通过本站 Worker 同源代理，避免浏览器跨域预检；
  // GitHub Pages 继续直连阅读量 Worker。
  var api = location.hostname === "wujiaming88.garming-wu.workers.dev"
    ? location.origin
    : configuredApi;
  if (!api) return; // 未配置 Worker 地址：徽章保持隐藏，不报错

  var path = el.getAttribute("data-pv-path") || location.pathname;

  function render(n) {
    var wrap = el.closest(".meta-badge--pv");
    if (typeof n === "number" && !isNaN(n)) {
      el.textContent = n.toLocaleString();
      if (wrap) wrap.style.display = "";
    } else if (wrap) {
      wrap.style.display = "none"; // 取数失败则隐藏徽章，不显示难看的占位
    }
  }

  fetch(api.replace(/\/$/, "") + "/api/pv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: path }),
    keepalive: true,
  })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) { render(d && typeof d.views === "number" ? d.views : null); })
    .catch(function () { render(null); });
})();
