/* ============================================================
   FIT-TO-SCREEN (chuyển từ qtopia-landing/src/lib/fit-sections.js):
   mỗi section trang chủ gói gọn trong đúng 1 khung hình (màn hình − header − thanh liên hệ dưới đáy).
   CSS (src/styles/park-template.css) đã co chữ / ảnh theo chiều cao màn hình; nếu nội dung vẫn cao hơn khung
   (laptop 1280×640, iPhone SE…) thì thu nhỏ đều nội dung section bằng CSS `zoom` — giữ nguyên bố cục, chữ, ảnh.
   - Tối thiểu 0,8 để chữ vẫn dễ đọc; cần nhỏ hơn thì section cao hơn màn hình và cuộn tự nhiên.
   - Bỏ qua hero và bản đồ vị trí (đã cao đúng khung), phần tử position absolute/fixed.
   - Điện thoại xoay ngang (≤ 500px chiều cao) không ép vừa 1 màn hình.
   ============================================================ */
const MIN_ZOOM = 0.8;
// mat-bang: có thêm khối loại căn hộ nên luôn cao hơn 1 màn hình — thu nhỏ chỉ làm chữ/nút nhỏ đi mà vẫn phải cuộn
const SKIP = new Set(["hero", "vi-tri", "mat-bang", "tong-hop-tien-ich"]);

function viewportTarget() {
  const probe = document.createElement("div");
  probe.style.cssText = "position:fixed;top:0;left:0;width:1px;height:100svh;visibility:hidden;pointer-events:none";
  document.body.appendChild(probe);
  const svh = probe.offsetHeight || window.innerHeight;
  probe.remove();
  const header = document.querySelector("header")?.offsetHeight || 0;
  const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bar-h")) || 0;
  return svh - header - bar;
}

function flowChildren(section) {
  return [...section.children].filter((el) => {
    const pos = getComputedStyle(el).position;
    return pos !== "absolute" && pos !== "fixed" && el.offsetParent !== null;
  });
}

function fitOne(section, target) {
  const kids = flowChildren(section);
  if (!kids.length) return;
  kids.forEach((k) => { k.style.zoom = ""; });
  const cs = getComputedStyle(section);
  const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  const natural = kids.reduce((sum, k) => {
    const m = getComputedStyle(k);
    return sum + k.offsetHeight + parseFloat(m.marginTop) + parseFloat(m.marginBottom);
  }, 0);
  const available = target - pad;
  if (natural <= available || available <= 0) {
    section.removeAttribute("data-fit");
    return;
  }
  let z = Math.max(MIN_ZOOM, Math.floor((available / natural) * 1000) / 1000);
  kids.forEach((k) => { k.style.zoom = String(z); });
  const over = section.getBoundingClientRect().height - target;
  if (over > 1 && z > MIN_ZOOM) {
    z = Math.max(MIN_ZOOM, Math.floor(z * (1 - over / (target - pad)) * 1000) / 1000);
    kids.forEach((k) => { k.style.zoom = String(z); });
  }
  section.setAttribute("data-fit", String(z));
}

/** Bật fit-to-screen cho các section của trang chủ (main.park-home). Trả về hàm dừng. */
export function fitSections() {
  if (typeof window === "undefined") return () => {};
  let frame = 0;
  let timer = 0;
  const sections = () => [...document.querySelectorAll(".park-home > section[id]")].filter((s) => !SKIP.has(s.id));
  // Không thu nhỏ trên màn cảm ứng (điện thoại, tablet cuộn tự nhiên): zoom 0,8 làm nút 44px còn ~35px, chữ còn ~11px
  // (audit 142 thiết bị 14/11/2026). Vẫn giữ cho điện thoại xoay ngang như trước.
  const landscapePhone = () => window.matchMedia("(orientation: landscape) and (max-height: 500px), (pointer: coarse)").matches;

  const run = () => {
    frame = 0;
    const target = viewportTarget();
    for (const s of sections()) {
      if (landscapePhone()) {
        flowChildren(s).forEach((k) => { k.style.zoom = ""; });
        s.removeAttribute("data-fit");
      } else fitOne(s, target);
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(run); };
  const later = (ms) => { clearTimeout(timer); timer = setTimeout(schedule, ms); };

  const mo = new MutationObserver(() => later(150));
  const main = document.querySelector(".park-home");
  if (main) mo.observe(main, { childList: true, subtree: true });
  const onLoad = (e) => { if (e.target?.tagName === "IMG") later(150); };
  const onClick = () => later(420);
  document.addEventListener("load", onLoad, true);
  document.addEventListener("click", onClick, true);

  let lastW = window.innerWidth;
  const onResize = () => {
    if (window.innerWidth === lastW && window.matchMedia("(pointer: coarse)").matches) return;
    lastW = window.innerWidth;
    schedule();
  };
  window.addEventListener("resize", onResize);
  const onOrient = () => later(250);
  window.addEventListener("orientationchange", onOrient);
  if (document.fonts?.ready) document.fonts.ready.then(schedule);
  schedule();
  return () => {
    mo.disconnect();
    cancelAnimationFrame(frame);
    clearTimeout(timer);
    document.removeEventListener("load", onLoad, true);
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onOrient);
  };
}
