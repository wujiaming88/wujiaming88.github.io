/* 文章阅读量统计 —— C1 方案（Cloudflare Worker + KV）
 * 仅在文章页运行：POST 计数+1，把结果回填到 #pv-count 徽章。
 * 列表页等只读场景可改用 GET（本脚本默认文章页 POST）。
 *
 * API 端点由 <body data-pv-api="..."> 提供（见 single.html）；未配置则静默跳过。
 */
(function () {
  var el = document.getElementById("pv-count");
  if (!el) return;
  var api = (document.body && document.body.getAttribute("data-pv-api")) || "";
  if (!api) return; // 未配置 Worker 地址：徽章保持隐藏，不报错
  var isCloudflareMirror = location.hostname === "wujiaming88.garming-wu.workers.dev";

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

  var options = {
    method: "POST",
    body: JSON.stringify({ path: path }),
    keepalive: true,
  };

  if (isCloudflareMirror) {
    // PV Worker 当前只给 GitHub Pages 返回 CORS 读权限。镜像站使用 no-cors
    // 简单请求继续写入计数，避免预检失败和控制台 CORS 报错；响应不可读，故隐藏徽章。
    options.mode = "no-cors";
  } else {
    options.headers = { "Content-Type": "application/json" };
  }

  fetch(api.replace(/\/$/, "") + "/api/pv", options)
    .then(function (r) { return isCloudflareMirror ? null : (r.ok ? r.json() : null); })
    .then(function (d) { render(d && typeof d.views === "number" ? d.views : null); })
    .catch(function () { render(null); });
})();
