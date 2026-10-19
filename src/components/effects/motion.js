// src/components/effects/motion.js
// Khi nào KHÔNG chạy hiệu ứng:
//  - người dùng bật "giảm chuyển động" trong hệ điều hành (accessibility)
//  - trình duyệt tự động hoá (puppeteer lúc prerender) -> HTML tĩnh luôn có số liệu cuối cùng
export function shouldSkipMotion() {
  if (typeof window === "undefined") return true;
  if (navigator.webdriver) return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}
