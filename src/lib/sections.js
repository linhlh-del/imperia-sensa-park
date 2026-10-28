// src/lib/sections.js
// URL cho các mục menu / CTA trỏ tới section trang chủ — KHÔNG dùng dấu "#".
//  - Section có trang SEO riêng cùng chủ đề (Vị trí, Tiện ích, Mặt bằng, Tin tức) → đi tới trang đó
//    (giữ trang đã index, không tạo 2 URL cùng nội dung).
//  - Section còn lại → đường dẫn riêng (/tong-quan, /tinh-tra-gop, /lien-he): mở trang chủ và cuộn tới section.
//    Các đường dẫn này dùng chung SEO của trang chủ (canonical "/"), không đưa vào sitemap.

/** đường dẫn → id section trên trang chủ */
export const SECTION_PATHS = {
  "/tong-quan": "tong-quan",
  "/tinh-tra-gop": "tinh-tra-gop",
  "/lien-he": "lien-he",
};

/** id section → trang SEO cùng chủ đề */
export const PAGE_FOR_SECTION = {
  "vi-tri": "/vi-tri",
  "tien-ich": "/tien-ich",
  "mat-bang": "/mat-bang",
  "tin-tuc": "/tin-tuc",
};

const PATH_FOR_SECTION = Object.fromEntries(Object.entries(SECTION_PATHS).map(([path, id]) => [id, path]));

/** URL của một mục (id section) — null nếu section không có URL riêng (chỉ cuộn) */
export const hrefForSection = (id) => PAGE_FOR_SECTION[id] || PATH_FOR_SECTION[id] || null;

/** id section ứng với đường dẫn hiện tại (undefined nếu không phải đường dẫn section) */
export const sectionForPath = (pathname) => SECTION_PATHS[pathname.replace(/\/+$/, "")];
