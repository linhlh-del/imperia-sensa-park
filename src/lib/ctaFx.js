/* Quầng sáng chạy theo con trỏ trên CTA (lấy từ norton-park/src/lib/ctaFx.js):
   ghi vị trí chuột (%) vào --rx / --ry của nút đang rê. Một listener ủy quyền cho cả trang,
   không cần gắn vào từng nút. CSS: "CTA: vệt sáng + quầng sáng" trong src/index.css */
const SELECTOR = '.btn-primary, .btn-light, .cta-fx, button[type="submit"].btn-base';

export function initCtaFx() {
  if (typeof window === "undefined" || !matchMedia("(hover: hover)").matches) return;
  let frame = 0;
  document.addEventListener(
    "pointermove",
    (e) => {
      const btn = e.target.closest?.(SELECTOR);
      if (!btn || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--rx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        btn.style.setProperty("--ry", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      });
    },
    { passive: true },
  );
}
