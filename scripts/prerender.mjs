// scripts/prerender.mjs
// Chạy SAU `vite build`:
//  1) Sinh dist/sitemap.xml (luôn chạy, không cần trình duyệt).
//  2) Prerender "/", "/tin-tuc", "/tin-tuc/:id" thành HTML tĩnh để Googlebot,
//     Bing và các crawler AI (GPTBot, ClaudeBot, PerplexityBot... không chạy JS)
//     đọc được toàn bộ nội dung. Nếu Chrome không chạy được trong môi trường build
//     thì báo lỗi rõ (log + dist/cms-status.json) nhưng KHÔNG làm hỏng build.
//  Chrome: trên Vercel dùng @sparticuz/chromium + puppeteer-core (Chrome đóng gói sẵn
//  thư viện hệ thống — Chrome của gói `puppeteer` thiếu thư viện trên máy build Vercel);
//  ở máy dev dùng `puppeteer` (tự tải Chrome).

import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const { SITE_URL, SUBPAGES } = await import(pathToFileURL(path.join(root, "src/lib/seo.js")).href);
const { default: NEWS } = await import(pathToFileURL(path.join(root, "src/data/newsData.js")).href);
const { buildCmsSchema } = await import(pathToFileURL(path.join(root, "src/cms/schema.js")).href);

const routes = [
  { url: "/", ready: "document.querySelector('#tin-tuc article')" },
  ...SUBPAGES.map((p) => ({ url: p.path, ready: "document.querySelector('main h1')" })),
  { url: "/tin-tuc", ready: "document.querySelector('h1') && document.querySelector('article')" },
  ...NEWS.map((a) => ({
    url: `/tin-tuc/${a.id}`,
    ready: "document.querySelector('article h1')",
  })),
];

/* ---------- 1) sitemap.xml ---------- */
const newestDate = NEWS.map((a) => a.published_at).sort().at(-1);
const today = new Date().toISOString().slice(0, 10);
const urlEntry = (loc, lastmod, changefreq, priority, images = []) =>
  `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${images
      .map((src) => `\n    <image:image><image:loc>${src.replace(/&/g, "&amp;")}</image:loc></image:image>`)
      .join("")}
  </url>`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[
  urlEntry(`${SITE_URL}/`, today, "weekly", "1.0", [`${SITE_URL}/assets/thumbnail.jpg`]),
  ...SUBPAGES.map((p) => urlEntry(`${SITE_URL}${p.path}`, today, "weekly", "0.9")),
  urlEntry(`${SITE_URL}/tin-tuc`, newestDate, "daily", "0.8"),
  ...NEWS.map((a) =>
    urlEntry(`${SITE_URL}/tin-tuc/${a.id}`, a.published_at, "monthly", "0.7", a.image_url ? [a.image_url] : []),
  ),
].join("\n")}
</urlset>
`;
await fs.mkdir(dist, { recursive: true });
await fs.writeFile(path.join(dist, "sitemap.xml"), sitemap);
console.log(`[seo] sitemap.xml: ${NEWS.length + SUBPAGES.length + 2} URL`);

/* ---------- 1b) schema cho CMS (sensa-park-cms đọc file này) ---------- */
await fs.writeFile(path.join(dist, "cms-schema.json"), JSON.stringify(buildCmsSchema(), null, 2));
console.log("[cms] cms-schema.json");

/* ---------- 2) prerender ---------- */

/** Ghi kết quả prerender vào dist/cms-status.json (CMS đọc để cảnh báo khi trang không có HTML tĩnh) */
async function writePrerenderStatus(prerender) {
  const file = path.join(dist, "cms-status.json");
  let status = {};
  try {
    status = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    /* chưa có (build không qua fetch-cms) */
  }
  await fs.writeFile(file, JSON.stringify({ ...status, prerender }, null, 2));
}

/** Mở Chrome: Vercel / Linux CI → @sparticuz/chromium; máy dev → puppeteer. Trả { browser, engine } */
async function launchBrowser() {
  const errors = [];
  const serverless = process.env.VERCEL || process.env.PRERENDER_CHROMIUM === "sparticuz";
  if (serverless) {
    try {
      const chromium = (await import("@sparticuz/chromium")).default;
      const puppeteer = (await import("puppeteer-core")).default;
      chromium.setGraphicsMode = false;
      const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
      return { browser, engine: "@sparticuz/chromium" };
    } catch (err) {
      errors.push(`@sparticuz/chromium: ${err.message}`);
    }
  }
  try {
    const puppeteer = (await import("puppeteer")).default;
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
    return { browser, engine: "puppeteer" };
  } catch (err) {
    errors.push(`puppeteer: ${err.message}`);
  }
  throw new Error(errors.join(" | "));
}

const template = await fs.readFile(path.join(dist, "index.html"), "utf8");
const MIME = {
  ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml",
};

const server = http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = path.join(dist, pathname);
  try {
    if (!file.startsWith(dist)) throw new Error("outside");
    const stat = await fs.stat(file);
    if (!stat.isFile()) throw new Error("not file");
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    res.end(await fs.readFile(file));
  } catch {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(template); // SPA fallback, luôn dùng template gốc
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const results = [];
let browser;
let engine = "";
let failure = "";
try {
  ({ browser, engine } = await launchBrowser());
  console.log(`[seo] Chrome: ${engine}`);
  for (const route of routes) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    // Chặn tài nguyên ngoài để build nhanh và không phụ thuộc mạng.
    await page.setRequestInterception(true);
    page.on("request", (r) =>
      r.url().startsWith(base) ? r.continue() : r.abort(),
    );
    await page.goto(`${base}${route.url}`, { waitUntil: "load", timeout: 60000 });
    await page.waitForFunction(route.ready, { timeout: 30000 });
    await new Promise((r) => setTimeout(r, 300)); // chờ useEffect RouteSeo cập nhật <head>
    let html = await page.content();
    /* bỏ thẻ script do snippet GA4 / Pixel / TikTok tự chèn lúc prerender (trình duyệt sẽ tự chèn lại khi chạy) */
    html = html.replace(/<script[^>]+src="https:\/\/(?:www\.googletagmanager\.com|connect\.facebook\.net|analytics\.tiktok\.com)[^"]*"[^>]*><\/script>/g, "");
    if (route.url !== "/") {
      html = html.replace(/<link[^>]*hero2\.[^>]*>\s*/g, ""); // preload hero chỉ cần ở trang chủ
    }
    results.push({ url: route.url, html });
    await page.close();
    console.log(`[seo] prerendered ${route.url}`);
  }
} catch (err) {
  failure = err.message;
  /* ::error:: → Vercel / GitHub Actions tô đỏ dòng log */
  console.error(`::error::[seo] PRERENDER THẤT BẠI — website chạy như SPA (HTML rỗng, ảnh hưởng SEO): ${failure}`);
  results.length = 0;
} finally {
  await browser?.close().catch(() => {});
  server.close();
}

for (const { url, html } of results) {
  const out = url === "/" ? path.join(dist, "index.html") : path.join(dist, url, "index.html");
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, "<!doctype html>" + html.replace(/^<!doctype html>/i, ""));
}
console.log(`[seo] Xong: ${results.length}/${routes.length} trang đã prerender.`);
await writePrerenderStatus({
  ok: results.length === routes.length,
  pages: results.length,
  total: routes.length,
  engine,
  error: failure ? failure.slice(0, 300) : undefined,
});
