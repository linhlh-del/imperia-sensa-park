// src/components/effects/CountUp.jsx
//
// Số liệu đếm tăng dần rồi chốt đúng giá trị gốc, chỉ chạy 1 lần khi cuộn tới.
//  - Giữ nguyên phần chữ và dấu câu; cụm chữ số đầu tiên đếm từ 0 đến giá trị đích.
//  - Văn bản cuối cùng LUÔN nằm trong DOM (tốt cho SEO / AI crawler). Số đang quay được vẽ
//    bằng ::after (data-display), nên crawler không bao giờ đọc phải số ngẫu nhiên.
//  - Không làm đổi kích thước: ô chứa luôn rộng bằng giá trị cuối cùng.
//  - Không dùng state React -> không re-render mỗi khung hình.

import { useEffect, useLayoutEffect, useRef } from "react";
import "../../styles/motion.css";
import { shouldSkipMotion } from "./motion";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function CountUp({
  value,
  duration = 1600, // ms, tổng thời gian đến khi chữ số cuối cùng chốt
  delay = 0, // ms, trễ sau khi xuất hiện trong khung nhìn
  threshold = 0.3, // phần trăm phần tử phải lọt vào khung nhìn mới bắt đầu
  tick = 55, // ms giữa hai lần đổi số ngẫu nhiên
}) {
  const text = String(value);
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || shouldSkipMotion()) return undefined;

    const numberMatch = text.match(/\d+/);
    if (!numberMatch) return undefined;
    const numberStart = numberMatch.index;
    const target = Number(numberMatch[0]);
    const numberWidth = numberMatch[0].length;
    const prefix = text.slice(0, numberStart);
    const suffix = text.slice(numberStart + numberWidth);

    let raf = 0;
    let io = null;
    let cancelled = false;

    const render = (elapsed) => {
      const progress =
        duration > 0 ? Math.min(Math.max(elapsed / duration, 0), 1) : 1;
      const easedProgress = 1 - (1 - progress) ** 3;
      const current = Math.floor(target * easedProgress);
      const displayedNumber = String(current).padStart(numberWidth, "0");
      el.dataset.display = `${prefix}${displayedNumber}${suffix}`;
    };

    const finish = () => {
      el.dataset.state = "done";
      delete el.dataset.display;
    };

    const run = () => {
      if (cancelled) return;
      const t0 = performance.now() + delay;
      let last = -Infinity;
      render(0);
      el.dataset.state = "running";
      const loop = (now) => {
        if (cancelled) return;
        const elapsed = now - t0;
        if (elapsed >= duration) return finish();
        if (elapsed >= 0 && now - last >= tick) {
          last = now;
          render(elapsed);
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    el.dataset.state = "armed"; // ẩn cho tới khi tới lượt chạy (trước lần paint đầu tiên)
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect(); // chỉ chạy 1 lần
            run();
          }
        },
        { threshold },
      );
      io.observe(el);
    } else {
      run();
    }

    return () => {
      cancelled = true;
      io?.disconnect();
      cancelAnimationFrame(raf);
      delete el.dataset.state;
      delete el.dataset.display;
    };
  }, [text, duration, delay, threshold, tick]);

  return (
    <span ref={ref} className="countup">
      <span className="countup__final">{text}</span>
    </span>
  );
}
