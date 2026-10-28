// src/lib/useSectionPaging.js
//
// Lăn chuột trên máy tính: mỗi nấc / mỗi cú vuốt trackpad đi đúng 1 section (giống norton-park).
// Vì sao cần JS khi đã có CSS scroll-snap mandatory: Chrome chỉ chuyển section khi lượng lăn đủ lớn — một nấc chuột
// nhỏ (100–120px, chuột thường trên Windows) bị snap kéo về chỗ cũ → người dùng tưởng trang bị kẹt.
//
// Quy tắc:
//  - Điểm đến = đầu section kế tiếp NGAY DƯỚI header cố định (trùng điểm snap CSS: scroll-padding-top = header).
//  - Section dài hơn khung hình: cho cuộn tự nhiên tới hết rồi mới chuyển section.
//  - Không can thiệp khi: phím Ctrl (zoom), lăn ngang, con trỏ trong ô nhập, hoặc trong vùng tự cuộn được theo hướng đó
//    (danh sách tiện ích, panel mặt bằng, popup…), hoặc người dùng bật "giảm chuyển động".
//  - Trackpad: quán tính bắn thêm hàng chục sự kiện sau cú vuốt → khoá cho tới khi hết chuỗi sự kiện (200ms yên lặng).
import { useEffect } from "react";

const DURATION = 900;
const QUIET_MS = 200;

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** phần tử (hoặc tổ tiên) tự cuộn dọc được theo hướng deltaY → nhường cho nó */
function scrollableAncestor(el, deltaY) {
  for (let node = el; node && node !== document.body; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (!/(auto|scroll)/.test(style.overflowY) || node.scrollHeight <= node.clientHeight + 1) continue;
    if (deltaY > 0 ? node.scrollTop + node.clientHeight < node.scrollHeight - 1 : node.scrollTop > 0) return node;
  }
  return null;
}

export default function useSectionPaging() {
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const root = document.documentElement;
    let frame = 0;
    let animating = false;
    let cooling = false; // vừa chuyển section xong, còn sự kiện quán tính của cùng cú vuốt
    let lastWheel = 0;

    const onWheel = (event) => {
      const now = performance.now();
      const sinceLast = now - lastWheel;
      lastWheel = now;
      if (event.ctrlKey || !event.cancelable || Math.abs(event.deltaX) > Math.abs(event.deltaY) || Math.abs(event.deltaY) < 1) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input, textarea, select, [contenteditable='true'], dialog")) return;
      if (target && scrollableAncestor(target, event.deltaY)) return;

      // đang chuyển section, hoặc còn quán tính của cú vuốt trước → nuốt sự kiện (không chuyển thêm section)
      if (animating) {
        event.preventDefault();
        return;
      }
      if (cooling) {
        if (sinceLast < QUIET_MS) {
          event.preventDefault();
          return;
        }
        cooling = false;
      }

      const headerH = document.querySelector("header")?.getBoundingClientRect().height || 0;
      const viewTop = headerH;
      const viewBottom = window.innerHeight;
      const sections = [...document.querySelectorAll("main > section")];
      const footer = document.querySelector("footer");
      const maxScroll = root.scrollHeight - window.innerHeight;
      const targets = sections.map((el) => ({
        el,
        // hero nằm dưới header (header đè lên hero) → điểm dừng là 0
        top: el.id === "hero" ? 0 : el.getBoundingClientRect().top + window.scrollY - headerH,
      }));
      if (footer) targets.push({ el: footer, top: maxScroll });
      if (!targets.length) return;

      const mid = (viewTop + viewBottom) / 2;
      let index = targets.findIndex(({ el }) => {
        const r = el.getBoundingClientRect();
        return r.top <= mid && r.bottom > mid;
      });
      if (index < 0) index = targets.length - 1;

      // section dài hơn khung: cuộn tự nhiên cho tới khi thấy hết mép dưới / mép trên
      const r = targets[index].el.getBoundingClientRect();
      if ((event.deltaY > 0 && r.bottom > viewBottom + 2) || (event.deltaY < 0 && r.top < viewTop - 2 && targets[index].el.id !== "hero")) return;

      const next = index + (event.deltaY > 0 ? 1 : -1);
      if (next < 0 || next >= targets.length) return;
      event.preventDefault();

      const from = window.scrollY;
      const to = Math.max(0, Math.min(targets[next].top, maxScroll));
      if (Math.abs(to - from) < 2) return;
      const start = performance.now();
      const prevSnap = root.style.scrollSnapType;
      const prevBehavior = root.style.scrollBehavior;
      root.style.scrollSnapType = "none"; // không để snap CSS giành vị trí giữa chừng
      root.style.scrollBehavior = "auto";
      animating = true;
      const step = (t) => {
        const k = Math.min((t - start) / DURATION, 1);
        window.scrollTo(0, from + (to - from) * ease(k));
        if (k < 1) {
          frame = requestAnimationFrame(step);
          return;
        }
        root.style.scrollSnapType = prevSnap;
        root.style.scrollBehavior = prevBehavior;
        animating = false;
        cooling = true;
        frame = 0;
      };
      frame = requestAnimationFrame(step);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}
