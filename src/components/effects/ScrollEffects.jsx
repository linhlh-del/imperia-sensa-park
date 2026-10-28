// src/components/effects/ScrollEffects.jsx
//
// Fade-in từ dưới lên khi cuộn tới, mỗi phần tử CHỈ 1 lần (cuộn lên rồi xuống lại không chạy lại).
// Không bọc thêm thẻ, không đổi layout/nội dung: chỉ gắn thuộc tính data-reveal lúc chạy
// (hiệu ứng dùng thuộc tính CSS `translate` + `opacity` nên không đụng tới `transform` có sẵn).
// Component này không render gì ra giao diện.

import { useEffect } from "react";
import "../../styles/motion.css";
import { shouldSkipMotion } from "./motion";

// Nhóm phần tử được fade-in. `step` = độ trễ (ms) giữa các phần tử anh em (hiệu ứng lần lượt).
const GROUPS = [
  // Mọi khối cấp 1 trong các section của trang chủ (trừ Hero và khối số liệu có hiệu ứng riêng)
  { selector: "main section:not(#hero) .container-page > *:not(.mt-16)", step: 0 },
  // Ô số liệu ở Overview: hiện lần lượt
  { selector: "#tong-quan .mt-16 > div", step: 110 },
  // Thư viện ảnh "Tiện ích nổi bật" (không có .container-page)
  { selector: "#hinhanh > div:first-child > *", step: 0 },
  // Hero: tiêu đề, mô tả, nút hiện lần lượt; thanh số liệu hiện lần lượt
  { selector: "#hero .container-page.z-10 > div > *", step: 130 },
  { selector: "#hero dl > div", step: 110 },
  // Trang /tin-tuc
  { selector: "section.container-page > *", step: 0 },
];

const MAX_STAGGER_STEPS = 5;

export default function ScrollEffects() {
  useEffect(() => {
    if (shouldSkipMotion() || !("IntersectionObserver" in window)) return undefined;

    document.documentElement.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-revealed", ""); // 1 lần, không bao giờ gỡ
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    const seen = new WeakSet();

    const scan = () => {
      GROUPS.forEach(({ selector, step }) => {
        document.querySelectorAll(selector).forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);
          // bỏ qua phần tử đã có animation riêng (animate-*) để không ghi đè
          if (typeof el.className === "string" && /\banimate-/.test(el.className)) return;
          if (step) {
            const index = Array.prototype.indexOf.call(el.parentElement.children, el);
            const delay = Math.min(index, MAX_STAGGER_STEPS) * step;
            el.style.setProperty("--reveal-delay", `${delay}ms`);
          }
          el.setAttribute("data-reveal", "");
          io.observe(el);
        });
      });
    };

    scan();

    // Nội dung tải sau (tin tức, đổi route...) cũng được tự động nhận hiệu ứng.
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
