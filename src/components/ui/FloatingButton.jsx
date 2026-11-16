import Image from "./Image";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sectionForPath } from "../../lib/sections";
import { site, t } from "../../cms/content";

/* hotline / Zalo sửa trong CMS (Thông tin chung) */
const PHONE_HREF = site.contact.hotlineHref;
const PHONE_DISPLAY = site.contact.hotline;
const ZALO_URL = site.contact.zaloUrl;

/* ── Icon components (Tabler icons, inline SVG để responsive theo nút) ── */
function PhoneIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
    </svg>
  );
}

function PdfIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
      <path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" />
      <path d="M17 18h2" />
      <path d="M20 15h-3v6" />
      <path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1" />
    </svg>
  );
}

/* Nhãn chỉ hiện khi hover / focus bàn phím — mặc định không chiếm chỗ, không che nội dung */
function FbLabel({ children }) {
  return (
    <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-full bg-imperia-black/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.06em] text-imperia-cream opacity-0 shadow-soft transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
      {children}
    </span>
  );
}

/* ── Lối tắt tới các section quan trọng (nút "Khám phá" ở thanh đáy + cột icon trái trên máy tính) ── */
const SECTIONS = [
  { id: "tong-quan", label: "Tổng quan", icon: "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6", rail: false },
  { id: "vi-tri", label: "Vị trí", icon: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11zM12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z" },
  { id: "tien-ich", label: "Tiện ích", icon: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" },
  { id: "mat-bang", label: "Mặt bằng", icon: "M4 4h16v16H4zM4 12h9M13 4v16M13 9h7" },
  { id: "chinh-sach-ban-hang", label: "Chính sách bán hàng", icon: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" },
  { id: "lien-he", label: "Liên hệ", icon: "M4 6h16v12H4zM4 7l8 6 8-6", rail: false },
];
const GRID_ICON = "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z";
const SECTION_IDS = SECTIONS.map((x) => x.id);

function LineIcon({ d, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* section đang nằm giữa màn hình — tô đậm lối tắt tương ứng */
function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      const hit = ids.find((id) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        return r && r.top <= mid && r.bottom >= mid;
      });
      setActive(hit || null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ids]);
  return active;
}

/* ── Sticky bar: Khám phá | Gọi hotline | Chat Zalo | Nhận bảng giá ──
   Hiện < 1024px (điện thoại + tablet — đồng bộ với menu hamburger); body có padding-bottom
   tương ứng (xem index.css) để thanh không che nội dung cuối trang. */
function MobileStickyBar({ onLead, active }) {
  const item =
    "flex h-11 flex-1 items-center justify-center"; // chỉ icon (nhãn đọc màn hình qua aria-label), cao 44px
  /* "Khám phá": danh mục lối tắt trượt lên trên thanh. Đóng khi chọn mục, bấm ra ngoài, Esc hoặc đổi trang. */
  const [explore, setExplore] = useState(false);
  const barRef = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => setExplore(false), [pathname]);
  useEffect(() => {
    if (!explore) return undefined;
    const onDown = (e) => {
      if (!barRef.current?.contains(e.target)) setExplore(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setExplore(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [explore]);
  return (
    <nav
      ref={barRef}
      aria-label="Liên hệ nhanh"
      className="mobile-sticky-bar fixed inset-x-0 bottom-0 z-[9999] flex border-t border-white/15 bg-imperia-primary text-white shadow-[0_-6px_24px_rgba(0,0,0,.18)] lg:hidden"
    >
      <div
        id="explore-sheet"
        hidden={!explore}
        className="absolute inset-x-0 bottom-full border-t border-white/15 bg-imperia-primary px-4 pb-4 pt-3 shadow-[0_-12px_30px_rgba(0,0,0,.25)]"
      >
        <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3">
          {SECTIONS.map((it) => (
            <li key={it.id}>
              <Link
                to={`/#${it.id}`}
                onClick={() => setExplore(false)}
                aria-current={active === it.id ? "location" : undefined}
                className={`flex min-h-12 items-center gap-3 rounded-xl border px-3.5 text-[13px] font-bold ${
                  active === it.id ? "border-imperia-accent bg-imperia-accent text-imperia-black" : "border-white/20 text-white hover:bg-white/10"
                }`}
              >
                <LineIcon d={it.icon} className="h-5 w-5 shrink-0" />
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setExplore((v) => !v)}
        aria-expanded={explore}
        aria-controls="explore-sheet"
        aria-label={explore ? "Đóng danh mục" : "Khám phá dự án"}
        className={`${item} border-0 border-r border-white/15 text-white ${explore ? "bg-white/15" : "bg-transparent"}`}
      >
        <LineIcon d={GRID_ICON} className="h-[22px] w-[22px]" />
      </button>
      <a
        href={PHONE_HREF}
        className={item}
        aria-label={`Gọi hotline ${PHONE_DISPLAY}`}
      >
        <PhoneIcon className="h-[22px] w-[22px]" aria-hidden="true" />
      </a>
      <a
        href={ZALO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${item} border-x border-white/15`}
        aria-label="Chat Zalo"
      >
        <Image
          src="/assets/logo-zalo.webp"
          alt=""
          width="20"
          height="20"
          className="h-6 w-6 object-contain"
        />
      </a>
      <button
        type="button"
        onClick={onLead}
        className={`${item} cta-fx relative bg-imperia-accent text-imperia-black`}
        aria-label={t("sticky.price")}
      >
        <PdfIcon className="h-[22px] w-[22px]" aria-hidden="true" />
      </button>
    </nav>
  );
}

/* Tự ẩn cụm nút nổi khi một khối có [data-hide-floating] (form, kết quả tính vay, panel căn hộ,
   danh sách tiện ích…) đi vào góc dưới màn hình — đúng vùng cụm nút đang đứng — để nút không che
   nội dung / nút bấm. Cuộn qua là hiện lại. */
function useAvoidOverlap() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setHidden(visible.size > 0);
      },
      { rootMargin: "-55% 0px 0px 0px" }, // chỉ xét 45% dưới của màn hình
    );
    const observe = () => document.querySelectorAll("[data-hide-floating]").forEach((el) => io.observe(el));
    observe();
    // nội dung render sau (đổi route, section tải trễ) cũng được theo dõi
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return hidden;
}

/* Đã cuộn quá ngưỡng (px) chưa — dùng cho nút lên đầu trang (giống norton-park: hiện sau ~2 section) */
function useScrolledPast(px) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      setPast(window.scrollY > px);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [px]);
  return past;
}

function ArrowUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

const fbBtn =
  "group relative flex h-[52px] w-[52px] items-center justify-center rounded-full shadow-[0_6px_20px_rgba(32,35,27,.28)] transition-transform duration-200 hover:scale-[1.06] focus-visible:outline-offset-4";

export default function FloatingButtons({ onLead }) {
  const hidden = useAvoidOverlap();
  const showTop = useScrolledPast(typeof window === "undefined" ? 1400 : window.innerHeight * 1.8);
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  /* Lên đầu trang: cuộn mượt về đầu, URL section (/lien-he…) trở về "/" (như bấm logo), đưa focus về đầu nội dung
     cho người dùng bàn phím / trình đọc màn hình */
  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hash || sectionForPath(pathname)) navigate("/", { replace: true });
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("top")?.focus({ preventScroll: true });
  };

  const active = useActiveSection(SECTION_IDS);
  const pastHero = useScrolledPast(typeof window === "undefined" ? 600 : window.innerHeight * 0.6);

  return (
    <>
      <MobileStickyBar onLead={onLead} active={active} />

      {/* Máy tính (≥ 1280px): cột icon lối tắt mép trái, hiện sau hero, tô đậm section đang xem */}
      <nav
        aria-label="Lối tắt tới các phần chính"
        className={`fixed left-4 top-1/2 z-[800] hidden -translate-y-1/2 transition-all duration-500 xl:block ${
          pastHero ? "opacity-100" : "pointer-events-none -translate-x-4 opacity-0"
        }`}
      >
        <ul className="m-0 flex list-none flex-col items-start gap-1.5 p-0">
          {SECTIONS.filter((it) => it.rail !== false).map((it) => (
            <li key={it.id}>
              <Link
                to={`/#${it.id}`}
                aria-label={it.label}
                aria-current={active === it.id ? "location" : undefined}
                tabIndex={pastHero ? undefined : -1}
                className={`group relative grid h-10 w-10 place-items-center rounded-full border shadow-[0_6px_20px_rgba(32,35,27,.2)] transition-colors ${
                  active === it.id
                    ? "border-imperia-accent bg-imperia-accent text-imperia-black"
                    : "border-imperia-primary/15 bg-white/90 text-imperia-primary hover:bg-white"
                }`}
              >
                <LineIcon d={it.icon} />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-imperia-primary px-3 py-1.5 text-xs font-bold uppercase tracking-[.08em] text-white opacity-0 shadow-soft transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  {it.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Điện thoại / máy tính bảng (< 1024px): nút lên đầu trang nổi ngay trên thanh liên hệ đáy */}
      <button
        type="button"
        onClick={toTop}
        aria-label="Lên đầu trang"
        tabIndex={showTop && !hidden ? undefined : -1}
        aria-hidden={showTop && !hidden ? undefined : true}
        className={`fixed bottom-[calc(var(--bar)+0.75rem)] right-4 z-[900] grid h-11 w-11 place-items-center rounded-full border border-imperia-primary/20 bg-white/95 text-imperia-primary shadow-[0_6px_20px_rgba(32,35,27,.28)] backdrop-blur transition-[opacity,transform] duration-300 lg:hidden ${
          showTop && !hidden ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Cụm nút nổi cho desktop (≥ 1024px) — màu theo palette thương hiệu */}
      <div
        aria-hidden={hidden || undefined}
        className={`fixed bottom-6 right-5 z-[900] hidden flex-col items-center gap-3 transition-[opacity,transform] duration-300 lg:flex ${
          hidden ? "pointer-events-none translate-x-4 opacity-0" : "opacity-100"
        }`}
      >
        {/* ── Lên đầu trang: chỉ hiện sau khi đã cuộn qua ~2 section ── */}
        <button
          type="button"
          onClick={toTop}
          aria-label="Lên đầu trang"
          tabIndex={showTop && !hidden ? undefined : -1}
          aria-hidden={showTop ? undefined : true}
          className={`${fbBtn} !h-11 !w-11 border border-imperia-primary/20 bg-white/95 text-imperia-primary backdrop-blur transition-[opacity,transform] duration-300 ${
            showTop ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
          <FbLabel>Lên đầu trang</FbLabel>
        </button>

        {/* ── Gọi hotline ── */}
        <a
          href={PHONE_HREF}
          tabIndex={hidden ? -1 : undefined}
          aria-label={`Gọi hotline ${PHONE_DISPLAY}`}
          className={`${fbBtn} bg-imperia-primary text-imperia-cream`}
        >
          <PhoneIcon className="h-6 w-6" aria-hidden="true" />
          <FbLabel>Hotline {PHONE_DISPLAY}</FbLabel>
        </a>

        {/* ── Zalo ── */}
        <a
          href={ZALO_URL}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={hidden ? -1 : undefined}
          aria-label="Chat Zalo"
          className={`${fbBtn} border border-imperia-primary/15 bg-white`}
        >
          <Image
            src="/assets/logo-zalo.webp"
            alt=""
            width="30"
            height="30"
            className="h-[30px] w-[30px] object-contain"
          />
          <FbLabel>Chat Zalo</FbLabel>
        </a>

        {/* ── Nhận bảng giá (CTA chính: màu nhấn + vòng sáng nhẹ) ── */}
        <button
          type="button"
          onClick={onLead}
          tabIndex={hidden ? -1 : undefined}
          aria-label="Nhận bảng giá"
          className={`${fbBtn} bg-imperia-accent text-imperia-black`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-imperia-accent/60 animate-fb-ring-1 motion-reduce:hidden"
          />
          {/* vệt sáng lướt định kỳ (cùng hiệu ứng CTA với norton-park) — lớp phủ riêng để không
              cắt nhãn hover nằm ngoài nút */}
          <span aria-hidden="true" className="cta-fx pointer-events-none absolute inset-0 rounded-full" />
          <PdfIcon className="relative h-6 w-6" aria-hidden="true" />
          <FbLabel>Nhận bảng giá</FbLabel>
        </button>
      </div>
    </>
  );
}
