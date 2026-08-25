/**
 * Cloudflare Worker — 博客文章阅读量计数器（C1 方案）
 * 数据存在你自己的 Cloudflare KV（绑定名 PAGEVIEWS），100% 自主可控、可导出。
 *
 * 路由：
 *   GET  /api/pv?path=/2026/06/17/foo.html          → 只读取，不+1（列表页/统计用）
 *   POST /api/pv  body={"path":"/2026/06/17/foo.html"} → 计数+1 并返回最新值（文章页用）
 *   GET  /api/pv/all                                  → 返回全部文章计数（管理/导出用，需 ?token=）
 *
 * 防刷：同一访客（IP+UA 指纹）对同一 path，30 分钟内只 +1 一次（KV TTL 去重锁）。
 *
 * 环境变量（在 Worker Settings → Variables 设置）：
 *   ALLOW_ORIGINS  允许的来源，逗号分隔；默认允许 GitHub Pages 与 Cloudflare 博客域名
 *   ALLOW_ORIGIN   旧版单来源变量，继续兼容
 *   ADMIN_TOKEN    /api/pv/all 导出接口的访问令牌（自己设一个随机串）
 *
 * KV 绑定：
 *   PAGEVIEWS      Namespace 绑定（在 Settings → Variables → KV Namespace Bindings 添加）
 */

const DEFAULT_ORIGINS = [
  "https://wujiaming88.github.io",
  "https://wujiaming88.garming-wu.workers.dev",
];
const DEDUP_TTL = 1800; // 30 分钟去重窗口（秒）

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const requestOrigin = request.headers.get("Origin") || "";
    const origin = allowedOrigin(requestOrigin, env);

    // CORS 预检
    if (request.method === "OPTIONS") {
      if (!origin) return json({ error: "origin not allowed" }, 403);
      return cors(new Response(null, { status: 204 }), origin);
    }

    // 导出全部数据（受 token 保护）
    if (url.pathname === "/api/pv/all") {
      if ((url.searchParams.get("token") || "") !== (env.ADMIN_TOKEN || "__unset__")) {
        return cors(json({ error: "unauthorized" }, 401), origin);
      }
      const list = await env.PAGEVIEWS.list({ prefix: "pv:" });
      const out = {};
      for (const k of list.keys) {
        const v = await env.PAGEVIEWS.get(k.name);
        out[k.name.slice(3)] = parseInt(v || "0", 10);
      }
      return cors(json({ count: list.keys.length, data: out }), origin);
    }

    if (url.pathname !== "/api/pv") {
      return cors(json({ error: "not found" }, 404), origin);
    }

    // 解析 path
    let path = url.searchParams.get("path");
    if (request.method === "POST") {
      try {
        const body = await request.json();
        path = body.path || path;
      } catch (_) {}
    }
    path = normalizePath(path);
    if (!path) return cors(json({ error: "missing path" }, 400), origin);

    const key = "pv:" + path;

    // GET = 只读
    if (request.method === "GET") {
      const cur = parseInt((await env.PAGEVIEWS.get(key)) || "0", 10);
      return cors(json({ path, views: cur }), origin);
    }

    // POST = 计数 +1（带去重）
    if (request.method === "POST") {
      const fp = await fingerprint(request, path);
      const lockKey = "lock:" + fp;
      const locked = await env.PAGEVIEWS.get(lockKey);
      let cur = parseInt((await env.PAGEVIEWS.get(key)) || "0", 10);
      if (!locked) {
        cur += 1;
        await env.PAGEVIEWS.put(key, String(cur));
        await env.PAGEVIEWS.put(lockKey, "1", { expirationTtl: DEDUP_TTL });
      }
      return cors(json({ path, views: cur }), origin);
    }

    return cors(json({ error: "method not allowed" }, 405), origin);
  },
};

function normalizePath(p) {
  if (!p) return "";
  try { p = decodeURIComponent(p); } catch (_) {}
  p = p.split("#")[0].split("?")[0].trim();
  if (!p.startsWith("/")) p = "/" + p;
  if (p.length > 256) return "";
  // 只允许博客文章路径字符，防注入
  if (!/^[\w\-./%]+$/.test(p)) return "";
  return p;
}

async function fingerprint(request, path) {
  const ip = request.headers.get("CF-Connecting-IP") || "0";
  const ua = request.headers.get("User-Agent") || "0";
  const raw = ip + "|" + ua + "|" + path;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function allowedOrigin(requestOrigin, env) {
  const configured = [env.ALLOW_ORIGINS, env.ALLOW_ORIGIN]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter(Boolean);
  const allowlist = new Set([...DEFAULT_ORIGINS, ...configured]);

  // 非浏览器调用通常没有 Origin；返回规范主站域名即可。
  if (!requestOrigin) return DEFAULT_ORIGINS[0];
  return allowlist.has(requestOrigin.replace(/\/$/, "")) ? requestOrigin : "";
}

function cors(res, origin) {
  if (origin) res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  res.headers.append("Vary", "Origin");
  res.headers.set("Cache-Control", "no-store");
  return res;
}
