import TopicLink from "../ui/TopicLink";
import Image from "../ui/Image";
// src/components/sections/Amenities.jsx
import { useState, useEffect, useRef } from "react";
import { img, t } from "../../cms/content";
import {
  AMENITIES,
  AMENITY_GROUPS,
  ITEMS_PER_COL,
  COLS_PER_SLIDE,
  AUTO_SLIDE_MS,
} from "../../data/amenitiesMap";

/* Sơ đồ tổng mặt bằng mới (public/assets/utility.webp 7680×4320, 16:9) — bản nhẹ trong assets/responsive/utility-*.webp.
   Toạ độ chấm số (data/amenitiesMap.js) đặt theo ảnh mới, 44 tiện ích chia 4 nhóm màu như trang chủ đầu tư. */
const MAP_DEFAULT = "/assets/responsive/utility-1920.webp";
const mapNgoaiKhu = img("amenities.map", MAP_DEFAULT);
const MAP_SRCSET = mapNgoaiKhu === MAP_DEFAULT
  ? "/assets/responsive/utility-1280.webp 1280w, /assets/responsive/utility-1920.webp 1920w, /assets/responsive/utility-2880.webp 2880w"
  : undefined;
const MAP_MARKERS = true;
const pad2 = (n) => String(n).padStart(2, "0");

export default function Amenities({ id = "tien-ich" }) {
  const [activeId, setActiveId] = useState(null);
  const [group, setGroup] = useState("all");
  const [compactMap, setCompactMap] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 600px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 600px)");
    const update = () => setCompactMap(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const [mobileSlide, setMobileSlide] = useState(0);
  const [mapHeight, setMapHeight] = useState(null);

  const timerRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const mapRef = useRef(null);
  const visibleRef = useRef(false);

  // Đo chiều cao map (gồm viền) để cột phải desktop cao đúng bằng sơ đồ
  useEffect(() => {
    if (!mapRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setMapHeight(Math.round(entry.target.getBoundingClientRect().height));
    });
    ro.observe(mapRef.current);
    return () => ro.disconnect();
  }, []);

  const filtered = group === "all" ? AMENITIES : AMENITIES.filter((a) => a.group === group);
  useEffect(() => { setMobileSlide(0); setActiveId(null); }, [group]);

  // Tính slides cho mobile
  const totalCols = Math.ceil(filtered.length / ITEMS_PER_COL);
  const totalSlides = Math.ceil(totalCols / COLS_PER_SLIDE);

  const slides = Array.from({ length: totalSlides }, (_, slideIdx) => {
    const cols = [];
    for (let c = 0; c < COLS_PER_SLIDE; c++) {
      const colIdx = slideIdx * COLS_PER_SLIDE + c;
      if (colIdx >= totalCols) break;
      const start = colIdx * ITEMS_PER_COL;
      cols.push(filtered.slice(start, start + ITEMS_PER_COL));
    }
    return cols;
  });

  const startTimer = () => {
    clearInterval(timerRef.current);
    if (visibleRef.current && !document.hidden && totalSlides > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timerRef.current = setInterval(() => {
        setMobileSlide((prev) => (prev + 1) % totalSlides);
      }, AUTO_SLIDE_MS);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) setMobileSlide((prev) => Math.min(prev + 1, totalSlides - 1));
    else setMobileSlide((prev) => Math.max(prev - 1, 0));
    startTimer();
    touchStartX.current = null;
    touchStartY.current = null;
  };

  useEffect(() => setMobileSlide(0), []);

  useEffect(() => {
    const section = mapRef.current?.closest("section");
    const observer = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting; startTimer(); });
    if (section) observer.observe(section);
    const update = () => startTimer();
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); clearInterval(timerRef.current); };
  }, [totalSlides]); // eslint-disable-line

  return (
    <section
      id={id}
      data-section="amenities-map"
      className="section-y overflow-hidden bg-imperia-cream"
    >
      <div className="container-page">
        {/* Mobile/tablet: tiêu đề → sơ đồ → danh sách.
            Desktop (≥1024): sơ đồ bên trái (cao vừa 1 màn hình), cột phải gồm tiêu đề + danh sách.
            Cột phải dùng `contents` dưới 1024px để tiêu đề và danh sách tự xếp theo `order`
            quanh sơ đồ mà không phải render tiêu đề 2 lần. */}
        <div className="amenities-grid grid grid-cols-1 gap-6 lg:items-start lg:gap-10">
          {/* MAP */}
          <div
            ref={mapRef}
            className="amenities-map-box relative order-2 overflow-hidden rounded-[28px] border border-imperia-primary/10 bg-imperia-cream shadow-soft max-lg:mx-auto max-lg:w-full max-lg:max-w-[calc(var(--amap-h)*16/9)] [--amap-h:38svh] md:[--amap-h:38svh] lg:order-none"
          >
            <Image
              src={mapNgoaiKhu}
              srcSet={MAP_SRCSET}
              sizes="(min-width: 1024px) 62vw, 100vw"
              alt={t("amenities.mapAlt")}
              width="1920"
              height="1080"
              loading="lazy"
              decoding="async"
              className="block w-full"
            />

            {MAP_MARKERS && filtered.flatMap((item) => {
              const positions = Array.isArray(item.position)
                ? item.position
                : [item.position];
              const isActive = activeId === item.id;

              /* 3 lớp, mỗi lớp 1 việc — transform không bao giờ ghi đè lên nhau:
                 1. <button>: định vị + căn tâm (translate -50%), vùng chạm 48px, không đổi khi chọn.
                 2. span phóng to: chỉ scale, transition mượt từ tâm (origin-center).
                 3. span số: chỉ animation lắc (rotate) khi chưa chọn. */
              return positions.map((position, positionIndex) => (
                <button
                  type="button"
                  key={`${item.id}-${positionIndex}`}
                  onMouseEnter={() => setActiveId(item.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(item.id)}
                  onBlur={() => setActiveId(null)}
                  onClick={() => setActiveId(item.id)}
                  aria-label={`${pad2(item.no)}. ${item.name.join(" ")}`}
                  aria-hidden={compactMap ? true : undefined}
                  tabIndex={compactMap ? -1 : 0}
                  aria-pressed={isActive}
                  style={{ top: position.top, left: position.left }}
                  className={[
                    "max-[600px]:pointer-events-none absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-imperia-primary",
                    isActive ? "z-20" : "z-10",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex origin-center items-center justify-center rounded-full transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none",
                      isActive
                        ? "scale-[1.55] shadow-[0_0_0_5px_rgba(245,241,235,.45),0_6px_18px_rgba(32,35,27,.35)] max-[600px]:scale-[1.45]"
                        : "scale-100 shadow-none",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "amenity-dot relative flex items-center justify-center rounded-full border border-imperia-cream font-body font-semibold leading-none transition-colors duration-500",
                        "before:absolute before:inset-0 before:rounded-full before:content-['']",
                        "after:absolute after:inset-0 after:rounded-full after:content-['']",
                        "motion-reduce:before:hidden motion-reduce:after:hidden",
                        isActive
                          ? "bg-imperia-cream text-imperia-secondary-dark before:hidden after:hidden"
                          : "animate-marker-shake text-white before:animate-marker-ring1 after:animate-marker-ring2 before:bg-imperia-cream/50 after:bg-imperia-cream/30 motion-reduce:animate-none motion-reduce:before:animate-none motion-reduce:after:animate-none",
                      ].join(" ")}
                      style={isActive ? undefined : { backgroundColor: item.color }}
                    >
                      {pad2(item.no)}
                    </span>
                  </span>
                </button>
              ));
            })}
          </div>

          {/* CỘT PHẢI (desktop): tiêu đề + danh sách, cao đúng bằng sơ đồ (đo bằng ResizeObserver).
              Dưới 1024px: `contents` → tiêu đề (order-1) lên trên sơ đồ, danh sách (order-3) xuống dưới. */}
          <div
            className="contents lg:flex lg:h-[var(--map-h)] lg:min-h-0 lg:flex-col lg:gap-6"
            style={mapHeight ? { "--map-h": `${mapHeight}px` } : undefined}
          >
            <div className="order-1 grid gap-3 lg:order-none lg:gap-4">
              <h2 className="section-title m-0 lg:!text-[clamp(30px,2.6vw,44px)]">
                {t("amenities.title")}
              </h2>
              <p className="section-subtitle !mt-0 max-w-full">
                {t("amenities.subtitle")}
              </p>
            </div>

          {MAP_MARKERS && <p className="order-3 text-sm min-[601px]:hidden">Chọn tên tiện ích trong danh sách bên dưới để làm nổi bật vị trí trên sơ đồ.</p>}
          {/* LIST WRAPPER */}
          <div
            data-hide-floating
            className="order-3 flex flex-col overflow-hidden rounded-[28px] border border-imperia-primary/10 bg-imperia-background-dark shadow-soft lg:order-none lg:min-h-0 lg:flex-1"
          >
            {/* Lọc theo nhóm tiện ích (màu chấm trên sơ đồ) */}
            <div className="amenity-groups" role="group" aria-label="Lọc nhóm tiện ích">
              <button type="button" aria-pressed={group === "all"} onClick={() => setGroup("all")}>Tất cả <span>{AMENITIES.length}</span></button>
              {AMENITY_GROUPS.map((g) => (
                <button key={g.key} type="button" aria-pressed={group === g.key} onClick={() => setGroup(g.key)} title={g.label}>
                  <i style={{ backgroundColor: g.color }} aria-hidden="true" />{g.short} <span>{AMENITIES.filter((a) => a.group === g.key).length}</span>
                </button>
              ))}
            </div>
            {/* Danh sách (> 600px): tablet 2 cột, desktop 1 cột cuộn dọc */}
            <div
              className="grid min-h-0 flex-1 grid-cols-2 gap-x-4 overflow-y-auto bg-imperia-background-dark p-4 text-white lg:flex lg:flex-col
                         [scrollbar-color:rgba(255,255,255,0.35)_transparent] [scrollbar-width:thin]
                         [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full
                         [&::-webkit-scrollbar-thumb]:bg-white/35 [&::-webkit-scrollbar-track]:bg-transparent
                         max-[600px]:hidden"
            >
              {filtered.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onMouseEnter={() => setActiveId(item.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(item.id)}
                  onBlur={() => setActiveId(null)}
                  onClick={() => setActiveId(item.id)}
                  aria-pressed={activeId === item.id}
                  className={`flex min-h-12 w-full shrink-0 items-center gap-3 rounded-xl px-2.5 py-1.5 text-left font-body cursor-pointer transition-colors duration-300 ${
                    activeId === item.id
                      ? "bg-imperia-background-light"
                      : "hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-imperia-cream text-xs transition-colors duration-300 ${activeId === item.id ? "bg-imperia-cream text-imperia-secondary-dark" : "text-white"}`}
                    style={activeId === item.id ? undefined : { backgroundColor: item.color }}
                  >
                    {pad2(item.no)}
                  </span>
                  <span className="flex flex-col justify-center">
                    {item.name.map((t, i) => (
                      <span key={i} className="text-sm leading-snug text-white">
                        {t}
                      </span>
                    ))}
                  </span>
                </button>
              ))}
            </div>

            {/* Mobile list (<= 600px): slide + swipe */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="hidden flex-col overflow-hidden bg-imperia-background-dark max-[600px]:flex"
            >
              <div
                className="flex transition-transform duration-500 ease-in-out will-change-transform"
                style={{ transform: `translateX(-${mobileSlide * 100}%)` }}
              >
                {slides.map((cols, slideIdx) => (
                  <div
                    key={slideIdx}
                    className={`grid w-full flex-shrink-0 bg-imperia-background-dark ${
                      cols.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    }`}
                  >
                    {cols.map((colItems, colIdx) => (
                      <div
                        key={colIdx}
                        className="flex flex-col border-r border-white/10 last:border-r-0"
                      >
                        {colItems.map((item) => (
                          <button
                            type="button"
                            key={item.id}
                            onMouseEnter={() => setActiveId(item.id)}
                            onMouseLeave={() => setActiveId(null)}
                            onClick={() => setActiveId(item.id)}
                            aria-pressed={activeId === item.id}
                            className={`box-border flex min-h-12 w-full items-center gap-2.5 border-b border-white/10 bg-transparent px-2 py-1.5 text-left font-body cursor-pointer transition-colors duration-300 ${
                              activeId === item.id
                                ? "bg-imperia-background-light"
                                : ""
                            }`}
                          >
                            <span
                              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-imperia-cream text-xs ${activeId === item.id ? "bg-imperia-cream text-imperia-secondary-dark" : "text-white"}`}
                              style={activeId === item.id ? undefined : { backgroundColor: item.color }}
                            >
                              {pad2(item.no)}
                            </span>
                            <span className="flex flex-col justify-center">
                              {item.name.map((t, i) => (
                                <span key={i} className="text-[13px] leading-snug text-white">
                                  {t}
                                </span>
                              ))}
                            </span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Phân trang: chấm bấm được (vùng chạm 32px) + số trang để biết còn trang sau */}
              {totalSlides > 1 && (
                <div className="hidden items-center justify-center gap-1 bg-imperia-background-dark py-1.5 max-[600px]:flex">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setMobileSlide(idx);
                        startTimer();
                      }}
                      aria-label={`Trang ${idx + 1} / ${totalSlides}`}
                      aria-current={mobileSlide === idx}
                      className="flex h-11 min-w-11 items-center justify-center"
                    >
                      <span
                        className={`block h-2 rounded-full transition-all duration-300 ${
                          mobileSlide === idx
                            ? "w-6 bg-imperia-accent"
                            : "w-2 bg-white/50"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-1 text-xs tabular-nums text-white/90">
                    {mobileSlide + 1}/{totalSlides}
                  </span>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
      <div className="container-page section-actions mt-4"><TopicLink to="/tien-ich">Chi tiết hệ tiện ích</TopicLink><a href="#hinhanh" className="btn-base btn-outline">Xem ảnh tiện ích</a><a href="#mat-bang" className="btn-base btn-outline">Khám phá mặt bằng</a></div>
    </section>
  );
}
