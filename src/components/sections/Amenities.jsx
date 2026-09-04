// src/components/sections/Amenities.jsx
import { useState, useEffect, useRef } from "react";
import {
  AMENITIES,
  ITEMS_PER_COL,
  COLS_PER_SLIDE,
  AUTO_SLIDE_MS,
} from "../../data/amenitiesMap";

const mapNgoaiKhu = "/assets/map-p.png";

export default function Amenities() {
  const [activeId, setActiveId] = useState(null);
  const [mobileSlide, setMobileSlide] = useState(0);
  const [mapHeight, setMapHeight] = useState(null);

  const timerRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const mapRef = useRef(null);

  // Đo chiều cao map để giới hạn listWrapper (desktop)
  useEffect(() => {
    if (!mapRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setMapHeight(entry.contentRect.height);
    });
    ro.observe(mapRef.current);
    return () => ro.disconnect();
  }, []);

  const filtered = AMENITIES;

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
    if (totalSlides > 1) {
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
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [totalSlides]); // eslint-disable-line

  return (
    <section
      id="tien-ich"
      data-section="amenities-map"
      className="section-y overflow-hidden bg-white"
    >
      <div className="container-page">
        {/* HEADER */}
        <div className="mb-12 grid grid-cols-1 gap-6 max-[600px]:mb-8 max-[600px]:gap-3">
          <h2 className="section-title m-0">TỔ HỢP TIỆN ÍCH ĐA CHIỀU</h2>
          <p className="section-subtitle !mt-0 max-w-full text-justify">
            Dẫn lối đa thế hệ cư dân bước vào hành trình tạn hưởng cuộc sống
            viên mãn toàn diện; vườn thiền, dạo bộ, thưởng trả, bi-a, lounge,
            sân chơi trẻ en,..
          </p>
        </div>

        {/* MAP + LIST */}
        <div className="grid items-start gap-8 [grid-template-columns:2.75fr_1fr] max-[1084px]:grid-cols-1">
          {/* MAP */}
          <div
            ref={mapRef}
            className="relative overflow-hidden rounded-[28px] border border-imperia-primary/10 bg-imperia-cream shadow-soft"
          >
            <img
              src={mapNgoaiKhu}
              alt="Sơ đồ tiện ích"
              className="block w-full"
            />

            {filtered.flatMap((item) => {
              const positions = Array.isArray(item.position)
                ? item.position
                : [item.position];
              const isActive = activeId === item.id;

              return positions.map((position, positionIndex) => (
                <div
                  key={`${item.id}-${positionIndex}`}
                  onMouseEnter={() => setActiveId(item.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onClick={() => setActiveId(item.id)}
                  style={{ top: position.top, left: position.left }}
                  className={[
                    "absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-imperia-cream font-body text-base font-semibold",
                    "before:absolute before:inset-0 before:rounded-full before:content-['']",
                    "after:absolute after:inset-0 after:rounded-full after:content-['']",
                    "max-[600px]:h-4 max-[600px]:w-4 max-[600px]:text-[0.6rem]",
                    isActive
                      ? "scale-[1.4] bg-imperia-cream text-imperia-secondary-dark before:hidden after:hidden"
                      : "animate-marker-shake bg-imperia-secondary-dark text-imperia-cream before:animate-marker-ring1 after:animate-marker-ring2 before:bg-imperia-cream/50 after:bg-imperia-cream/30",
                  ].join(" ")}
                >
                  {item.id}
                </div>
              ));
            })}
          </div>

          {/* LIST WRAPPER — maxHeight = chiều cao map, đo bằng ResizeObserver */}
          <div
            className="flex h-full flex-col overflow-hidden rounded-[28px] border border-imperia-primary/10 bg-imperia-dark shadow-soft max-[1084px]:!max-h-none"
            style={mapHeight ? { maxHeight: mapHeight } : undefined}
          >
            {/* Desktop list (> 600px): scroll dọc */}
            <div
              className="flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto bg-imperia-dark p-4 text-white
                         [scrollbar-color:rgba(255,255,255,0.35)_transparent] [scrollbar-width:thin]
                         [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full
                         [&::-webkit-scrollbar-thumb]:bg-white/35 [&::-webkit-scrollbar-track]:bg-transparent
                         max-[600px]:hidden"
            >
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveId(item.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onClick={() => setActiveId(item.id)}
                  className={`flex items-center gap-2.5 p-1.5 font-body cursor-pointer transition duration-300 ${
                    activeId === item.id
                      ? "bg-imperia-light"
                      : "hover:bg-imperia-primary"
                  }`}
                >
                  <span
                    className={`flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border border-imperia-cream text-[11px] ${activeId === item.id ? "bg-imperia-cream text-imperia-secondary-dark" : "bg-imperia-secondary-dark text-imperia-cream"}`}
                  >
                    {item.id}
                  </span>
                  <div className="flex flex-col justify-center">
                    {item.name.map((t, i) => (
                      <p key={i} className="m-0 text-xs text-white">
                        {t}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile list (<= 600px): slide + swipe */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="hidden flex-col overflow-hidden bg-imperia-dark max-[600px]:flex"
            >
              <div
                className="flex transition-transform duration-500 ease-in-out will-change-transform"
                style={{ transform: `translateX(-${mobileSlide * 100}%)` }}
              >
                {slides.map((cols, slideIdx) => (
                  <div
                    key={slideIdx}
                    className={`grid w-full flex-shrink-0 bg-imperia-dark ${
                      cols.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    }`}
                  >
                    {cols.map((colItems, colIdx) => (
                      <div
                        key={colIdx}
                        className="flex flex-col border-r border-white/10 last:border-r-0"
                      >
                        {colItems.map((item) => (
                          <div
                            key={item.id}
                            onMouseEnter={() => setActiveId(item.id)}
                            onMouseLeave={() => setActiveId(null)}
                            onClick={() => setActiveId(item.id)}
                            className={`box-border flex min-h-[56px] items-center gap-2.5 border-b border-white/10 p-2 font-body cursor-pointer transition duration-300 ${
                              activeId === item.id
                                ? "bg-imperia-light"
                                : "hover:bg-imperia-primary"
                            }`}
                          >
                            <span
                              className={`flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border border-imperia-cream text-[11px] ${activeId === item.id ? "bg-imperia-cream text-imperia-secondary-dark" : "bg-imperia-secondary-dark text-imperia-cream"}`}
                            >
                              {item.id}
                            </span>
                            <div className="flex flex-col justify-center">
                              {item.name.map((t, i) => (
                                <p key={i} className="m-0 text-xs text-white">
                                  {t}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {totalSlides > 1 && (
                <div className="hidden justify-center gap-1.5 bg-imperia-dark pt-[6px] pb-1 max-[600px]:flex">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        mobileSlide === idx
                          ? "scale-[1.3] bg-imperia-accent"
                          : "bg-white/35"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
