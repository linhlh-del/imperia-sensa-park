// FeaturedAmenities.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { FILTERS, GALLERY_ITEMS } from "../../data/dataAmenities";

function ChevronIcon({ direction = "left", className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-5 w-5 ${direction === "right" ? "rotate-180" : ""} ${className}`}
    >
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Mẫu span lặp lại theo chu kỳ 6 ảnh: 1 ô lớn 2x2, 4 ô vuông nhỏ, 1 ô ngang dài.
// Cho phép hiển thị đẹp mắt với category có 5-10 ảnh mà không cần biết trước số lượng.
function getSpanClass(indexInCycle) {
  switch (indexInCycle) {
    case 0:
      return "col-span-2 row-span-2";
    case 5:
      return "col-span-2 row-span-1";
    default:
      return "col-span-1 row-span-1";
  }
}

export default function FeaturedAmenities() {
  const [activeCategory, setActiveCategory] = useState(FILTERS[0]?.key);
  const [loadedImages, setLoadedImages] = useState(() => new Set());
  const [lightbox, setLightbox] = useState(null); // { index }

  const gallery = useMemo(
    () => GALLERY_ITEMS.filter((item) => item.category === activeCategory),
    [activeCategory],
  );

  const handleImageLoad = useCallback((src) => {
    setLoadedImages((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;
    setActiveCategory(category);
  };

  const openLightbox = (index) => setLightbox({ index });
  const closeLightbox = () => setLightbox(null);

  const showPrev = useCallback(() => {
    setLightbox((prev) =>
      prev
        ? { index: prev.index === 0 ? gallery.length - 1 : prev.index - 1 }
        : prev,
    );
  }, [gallery.length]);

  const showNext = useCallback(() => {
    setLightbox((prev) =>
      prev
        ? { index: prev.index === gallery.length - 1 ? 0 : prev.index + 1 }
        : prev,
    );
  }, [gallery.length]);

  // Điều hướng bàn phím trong lightbox
  useEffect(() => {
    if (!lightbox) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox, showPrev, showNext]);

  const activeLightboxItem = lightbox != null ? gallery[lightbox.index] : null;

  return (
    <section id="hinhanh" className="bg-imperia-primary py-16 font-body">
      <div className="mx-auto w-full max-w-[1400px] px-5">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="text-left">
            <h2 className="section-title section-title-light">
              Tiện ích nổi bật
            </h2>
            <div className="mt-4 h-[3px] w-16 rounded-full bg-imperia-accent" />
          </div>
        </div>

        {/* FILTER BUTTONS */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => handleCategoryChange(filter.key)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 max-[576px]:px-4 max-[576px]:py-2 max-[576px]:text-[0.8rem] ${
                activeCategory === filter.key
                  ? "bg-gradient-to-r from-imperia-accent to-imperia-light text-imperia-dark shadow-soft"
                  : "border border-imperia-light/30 bg-imperia-white/5 text-imperia-cream/70 hover:border-imperia-accent hover:text-imperia-accent"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* BENTO GRID */}
        <div
          key={activeCategory}
          className="grid auto-rows-[130px] grid-cols-2 gap-2 sm:grid-cols-4 sm:auto-rows-[150px] sm:gap-3 lg:auto-rows-[170px]"
        >
          {gallery.map((item, index) => (
            <button
              type="button"
              onClick={() => openLightbox(index)}
              key={`${item.category}-${index}`}
              style={{ animationDelay: `${Math.min(index, 10) * 60}ms` }}
              className={`group relative animate-pop-in overflow-hidden rounded-xl opacity-0 shadow-card [animation-fill-mode:forwards] ring-1 ring-imperia-white/10 transition-shadow duration-300 hover:ring-imperia-accent/50 ${getSpanClass(
                index % 6,
              )}`}
            >
              {!loadedImages.has(item.src) && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 animate-amenity-shimmer bg-imperia-secondary-dark/40 bg-[length:200%_100%] motion-reduce:animate-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(100deg, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0.09) 45%, rgba(255,255,255,0.02) 60%)",
                  }}
                />
              )}
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                onLoad={() => handleImageLoad(item.src)}
                className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
                  loadedImages.has(item.src) ? "opacity-100" : "opacity-0"
                }`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-imperia-black/70 via-imperia-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {/* Icon phóng to gợi ý có thể click */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-imperia-cream/95 text-imperia-dark shadow-soft">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                      d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* LIGHTBOX */}
      {activeLightboxItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-imperia-black/90 p-4 backdrop-blur-sm animate-[fadeInUp_0.25s_ease]"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Đóng"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-imperia-white/10 text-imperia-cream transition-colors duration-200 hover:bg-imperia-white/20"
          >
            <CloseIcon />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Ảnh trước"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-imperia-white/10 text-imperia-cream transition-colors duration-200 hover:bg-imperia-white/20 sm:left-6"
          >
            <ChevronIcon direction="left" />
          </button>

          <div
            key={lightbox.index}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] w-full max-w-[1100px] animate-scale-in overflow-hidden rounded-2xl shadow-card"
          >
            <img
              src={activeLightboxItem.src}
              alt={activeLightboxItem.alt}
              className="max-h-[85vh] w-full object-contain bg-imperia-black"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-imperia-black/85 to-transparent px-6 py-4">
              <span className="text-sm font-semibold text-imperia-cream">
                {activeLightboxItem.label}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Ảnh tiếp theo"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-imperia-white/10 text-imperia-cream transition-colors duration-200 hover:bg-imperia-white/20 sm:right-6"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
