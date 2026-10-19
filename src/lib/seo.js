// src/lib/seo.js
// Tiện ích cập nhật <head> theo từng route (SPA). Không chứa JSX, không phụ thuộc
// DOM lúc import -> có thể import từ Node (scripts/prerender.mjs) để dùng chung hằng số.

export const SITE_URL = "https://imperia-sensa-park.vercel.app";
export const SITE_NAME = "Imperia Sensa Park";
export const DEFAULT_IMAGE = `${SITE_URL}/assets/thumbnail.jpg`;
export const LOGO_URL = `${SITE_URL}/assets/logo.png`;

export const HOME_SEO = {
  title:
    "Imperia Sensa Park – Căn hộ MIK Group đường Võ Chí Công, Khu Đông TP.HCM",
  description:
    "Imperia Sensa Park – dự án căn hộ I Series của MIK Group trên đường Võ Chí Công, Khu Đông TP.HCM. Hành trình sống đa trải nghiệm cho cư dân trẻ ưu tú, có gu.",
};

export function truncate(text = "", max = 158) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export function toAbsoluteUrl(path = "/") {
  const normalized =
    path.length > 1 ? path.replace(/\/+$/, "") : path;
  return `${SITE_URL}${normalized === "/" ? "/" : normalized}`;
}

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(attr, key) {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]:not([hreflang])`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setHreflang(url) {
  document.head
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach((el) => el.setAttribute("href", url));
}

function setHomeJsonLd(enabled) {
  const el = document.getElementById("ld-home");
  if (!el) return;
  el.setAttribute("type", enabled ? "application/ld+json" : "application/x-disabled");
}

function setRouteJsonLd(data) {
  document.getElementById("ld-route")?.remove();
  if (!data) return;
  const el = document.createElement("script");
  el.id = "ld-route";
  el.type = "application/ld+json";
  el.textContent = JSON.stringify(data);
  document.head.appendChild(el);
}

/**
 * Áp dụng toàn bộ metadata cho 1 route.
 * @param {{title:string, description:string, path:string, image?:string,
 *   type?:"website"|"article", noindex?:boolean, publishedTime?:string,
 *   jsonLd?:object|null, isHome?:boolean}} opts
 */
export function applySeo({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  publishedTime,
  jsonLd = null,
  isHome = false,
}) {
  const url = toAbsoluteUrl(path);
  const desc = truncate(description);

  document.title = title;
  upsertMeta("name", "description", desc);
  upsertMeta(
    "name",
    "robots",
    noindex
      ? "noindex, follow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  );
  upsertLink("canonical", url);
  setHreflang(url);

  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", desc);
  upsertMeta("property", "og:image", image);
  upsertMeta("property", "og:image:alt", title);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", desc);
  upsertMeta("name", "twitter:image", image);

  if (type === "article" && publishedTime) {
    upsertMeta("property", "article:published_time", publishedTime);
  } else {
    removeMeta("property", "article:published_time");
  }

  setHomeJsonLd(isHome);
  setRouteJsonLd(isHome ? null : jsonLd);
}
