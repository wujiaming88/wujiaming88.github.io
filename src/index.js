const PAGEVIEW_API = "https://my-blog-worker.garming-wu.workers.dev";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/pv") {
      return proxyPageview(request, url);
    }

    return env.ASSETS.fetch(request);
  },
};

async function proxyPageview(request, sourceUrl) {
  const upstreamUrl = new URL(sourceUrl.pathname + sourceUrl.search, PAGEVIEW_API);
  const headers = new Headers(request.headers);

  // 这是 Worker 到 Worker 的服务端请求，不需要把浏览器 Origin 传给上游。
  headers.delete("Origin");
  headers.delete("Referer");

  const init = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  const upstream = await fetch(upstreamUrl, init);
  const response = new Response(upstream.body, upstream);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
