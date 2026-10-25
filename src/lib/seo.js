// src/lib/seo.js
// Tiện ích cập nhật <head> theo từng route (SPA). Không chứa JSX, không phụ thuộc
// DOM lúc import -> có thể import từ Node (scripts/prerender.mjs) để dùng chung hằng số.

export const SITE_URL = "https://imperia-sensa-park.vercel.app";
export const SITE_NAME = "Imperia Sensa Park";
export const DEFAULT_IMAGE = `${SITE_URL}/assets/thumbnail.jpg`;
export const LOGO_URL = `${SITE_URL}/assets/logo.png`;

export const HOME_SEO = {
  title: "Imperia Sensa Park | Căn hộ MIK Group, Phước Long, TP.HCM",
  description:
    "Imperia Sensa Park của MIK Group tại phường Phước Long, TP.HCM: quy mô khoảng 5 ha, 2 tháp, 922 căn hộ và hơn 40 tiện ích. Đăng ký nhận thông tin dự án ngay!",
};

// Trang con theo nhóm từ khóa ngách. Dùng chung cho RouteSeo (client),
// prerender + sitemap (Node). Title ≤ 60, description 150–160 ký tự (đã đếm).
export const SUBPAGES = [
  {
    path: "/vi-tri",
    name: "Vị trí",
    title: "Vị trí Imperia Sensa Park | Võ Chí Công, Phước Long, TP.HCM",
    description:
      "Vị trí Imperia Sensa Park mặt tiền Võ Chí Công, phường Phước Long, TP.HCM: 5 phút đến Khu Công nghệ cao, 15 phút đến Thủ Thiêm. Nhận bản đồ vị trí ngay!",
    h1: "Vị trí căn hộ Imperia Sensa Park – mặt tiền Võ Chí Công, phường Phước Long, TP.HCM",
  },
  {
    path: "/tien-ich",
    name: "Tiện ích",
    title: "Tiện ích Imperia Sensa Park | 40+ tiện ích nội khu MIK Group",
    description:
      "Khám phá hơn 40 tiện ích nội khu Imperia Sensa Park: hồ bơi Aura Flow, gym, Himalaya Salt Room, Creative Studio, đường dạo ven hồ. Đăng ký tham quan ngay!",
    h1: "Hệ thống tiện ích nội khu Imperia Sensa Park",
  },
  {
    path: "/mat-bang",
    name: "Mặt bằng",
    title: "Mặt bằng Imperia Sensa Park | Studio, 2PN, 3PN, Duplex",
    description:
      "Mặt bằng tầng điển hình tháp Sensa A, Sensa B của Imperia Sensa Park: căn Studio, 1PN+, 2PN, 3PN, Duplex với diện tích GFA, NFA chi tiết. Nhận mặt bằng ngay!",
    h1: "Mặt bằng chi tiết căn hộ Imperia Sensa Park – tháp Sensa A và Sensa B",
  },
  {
    path: "/bang-gia",
    name: "Bảng giá",
    title: "Bảng giá Imperia Sensa Park | Tính trả góp căn hộ Phước Long",
    description:
      "Nhận bảng giá Imperia Sensa Park mới nhất và ước tính khoản vay, số tiền trả góp hàng tháng cho căn hộ Studio đến 3PN tại phường Phước Long, TP.HCM ngay.",
    h1: "Bảng giá và công cụ tính trả góp căn hộ Imperia Sensa Park",
  },
];

export function truncate(text = "", max = 158) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

function normalizeDescription(text, min = 150, max = 158) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (clean.length >= min) return truncate(clean, max);

  const suffix = ` Tìm hiểu thêm về ${SITE_NAME}.`;
  const prefixLimit = max - suffix.length - 1;
  const prefix = clean
    .slice(0, prefixLimit)
    .replace(/\s+\S*$/, "")
    .trim();
  return `${prefix}…${suffix}`;
}

export function truncateTitle(text = "", max = 60) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  const brandSuffix = ` | ${SITE_NAME}`;
  if (clean.endsWith(brandSuffix) && brandSuffix.length < max) {
    const subject = clean.slice(0, -brandSuffix.length);
    const subjectLimit = max - brandSuffix.length - 1;
    const shortened = subject
      .slice(0, subjectLimit)
      .replace(/\s+\S*$/, "")
      .trim();
    return `${shortened}…${brandSuffix}`;
  }

  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "").trim()}…`;
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
  const desc = normalizeDescription(description);

  const seoTitle = truncateTitle(title);
  document.title = seoTitle;
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
  upsertMeta("property", "og:title", seoTitle);
  upsertMeta("property", "og:description", desc);
  upsertMeta("property", "og:image", image);
  upsertMeta("property", "og:image:alt", title);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", seoTitle);
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
