// src/components/sections/News.jsx
//
// Section "Tin tức & sự kiện" hiển thị trên trang chủ.
// - Style: Tailwind, dùng đúng bảng màu `imperia-*` khai báo trong
//   tailwind.config.js và các class dùng chung (section-title, eyebrow,
//   container-page...) khai báo trong index.css @layer components.
// - Data: lấy qua newsService (hiện là mock, sau này trỏ sang API thật
//   mà không cần sửa file này).
//
// Cần cài đặt: `npm i react-router-dom` và bọc app trong <BrowserRouter>
// (xem NEWS-MODULE-README.md) để <Link> hoạt động.

import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "../ui/SectionHeading";
import { fetchNewsList, getHref, formatDate } from "../../services/newsService";

function ChevronIcon({ direction = "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: direction === "left" ? "scaleX(-1)" : "none" }}
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function News({
  items,
  heading = "Tin tức & sự kiện",
  subtitle = "Cập nhật những thông báo mới nhất, tiến độ dự án và các sự kiện nổi bật.",
  moreHref = "/tin-tuc",
}) {
  const [fetchedItems, setFetchedItems] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    if (items) return;
    let cancelled = false;
    fetchNewsList()
      .then((data) => !cancelled && setFetchedItems(data))
      .catch((err) => {
        console.error("Lỗi tải tin tức:", err);
        if (!cancelled) setFetchError("Không tải được tin tức.");
      });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const displayItems = items ?? fetchedItems;

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    const cardWidth = el.firstChild ? el.firstChild.offsetWidth + 24 : 1;
    setActiveIndex(Math.round(el.scrollLeft / cardWidth));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateEdges, displayItems]);

  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstChild;
    const distance = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <section id="tin-tuc" data-section="news" className="section-y bg-white">
      <div className="container-page">
        <SectionHeading title={heading} subtitle={subtitle} />

        {fetchError && (
          <p className="mt-6 text-center text-sm text-imperia-secondary-dark">
            {fetchError}
          </p>
        )}

        {!displayItems && !fetchError && (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[340px] animate-pulse rounded-[22px] border border-imperia-primary/10 bg-imperia-cream"
              />
            ))}
          </div>
        )}

        {displayItems && displayItems.length > 0 && (
          <>
            {/* Controls */}
            <div className="mt-10 mb-6 flex items-center justify-between">
              <div
                className="flex gap-2"
                role="group"
                aria-label="Điều hướng tin tức"
              >
                <button
                  type="button"
                  onClick={() => scrollByCard(-1)}
                  disabled={!canPrev}
                  aria-label="Tin trước"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-imperia-primary/25 text-imperia-primary transition duration-300 hover:bg-imperia-primary hover:text-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-imperia-primary"
                >
                  <ChevronIcon direction="left" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByCard(1)}
                  disabled={!canNext}
                  aria-label="Tin tiếp theo"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-imperia-primary/25 text-imperia-primary transition duration-300 hover:bg-imperia-primary hover:text-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-imperia-primary"
                >
                  <ChevronIcon direction="right" />
                </button>
              </div>

              <Link
                to={moreHref}
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-imperia-primary hover:text-imperia-secondary"
              >
                Xem thêm <ChevronIcon />
              </Link>
            </div>

            {/* Track */}
            <div
              ref={trackRef}
              className="flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {displayItems.map((item) => {
                const href = getHref(item.id);
                return (
                  <article
                    key={item.id}
                    data-cms-item="news"
                    className="flex w-[min(360px,82vw)] flex-none flex-col overflow-hidden rounded-[22px] border border-imperia-primary/10 bg-imperia-cream"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <Link
                      to={href}
                      className="relative block h-56 overflow-hidden bg-gradient-to-br from-imperia-primary/15 to-imperia-beige/60"
                    >
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />
                      )}
                      <span className="absolute bottom-3 left-3 rounded-full bg-imperia-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                        {item.tag}
                      </span>
                    </Link>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="text-xs font-bold tracking-widest text-imperia-secondary">
                        {formatDate(item.published_at)}
                      </div>
                      <h3 className="mt-3 font-display text-xl font-semibold text-imperia-primary">
                        <Link
                          to={href}
                          className="hover:text-imperia-secondary"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm text-imperia-black/70">
                        {item.excerpt}
                      </p>
                      <Link
                        to={href}
                        className="mt-5 inline-block text-sm font-bold text-imperia-primary hover:text-imperia-secondary"
                      >
                        Xem chi tiết →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Dots */}
            <div className="mt-4 flex justify-center gap-2">
              {displayItems.map((item, i) => (
                <span
                  key={item.id}
                  className={
                    "h-1.5 rounded-full transition-all duration-300 " +
                    (i === activeIndex
                      ? "w-6 bg-imperia-primary"
                      : "w-1.5 bg-imperia-primary/25")
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
