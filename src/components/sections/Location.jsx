import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
import { img, t } from "../../cms/content";

/* variant (CMS): "map-right" (mặc định) | "map-left" */
export default function Location({ data, variant = "map-right" }) {
  return (
    <section
      id="vi-tri"
      data-section="location"
      className="section-y bg-imperia-background-dark text-white"
    >
      <div className="container-page">
        <SectionHeading
          light
          title={data.title}
          semanticTitle={t("location.seo")}
        />
        <div className="grid items-center gap-[clamp(16px,4svh,48px)] md:grid-cols-2">
          <div>
            <p className="section-subtitle section-subtitle-light !mt-0 mb-[clamp(12px,2.6svh,28px)]">
              {data.subtitle}
            </p>
            <div className="mb-[clamp(16px,3svh,32px)] grid divide-y divide-white/10 border-y border-white/10">
              {data.distances.map(([time, label]) => (
                <div key={label} className="flex items-center gap-4 py-[clamp(6px,1.3svh,20px)] md:gap-6">
                  <strong className="flex min-w-[64px] items-baseline gap-1 font-display text-3xl text-imperia-cream">
                    {/* thời gian di chuyển: số tĩnh (không đếm) để luôn đúng */}
                    {String(time).replace(/['’]/g, "")}
                    <span className="font-body text-xs font-bold uppercase tracking-[.06em] text-imperia-cream">
                      phút
                    </span>
                  </strong>
                  <span className="text-[15px] leading-snug text-white/90">{label}</span>
                </div>
              ))}
            </div>
            <Button href="#lien-he" variant="light">
              {t("location.cta")}
            </Button>
          </div>
          <div
            /* bản đồ có ghim, tỉ lệ 1872:1248. Điện thoại (1 cột, không paging JS) → ưu tiên hiện TRỌN bề rộng màn
               hình; từ md trở lên (2 cột cạnh text, có thể cần vừa 1 khung hình) mới thu bề rộng theo chiều cao. */
            className={`relative mx-auto aspect-[1872/1248] w-full overflow-hidden rounded-[28px] border border-white/10 md:max-w-[calc(var(--map-h)*1872/1248)] md:[--map-h:clamp(220px,46svh,620px)] ${variant === "map-left" ? "md:order-first" : ""}`}
          >
            <img
              src={img("location.map", "/assets/map.optimized.webp")}
              alt={t("location.imageAlt")}
              width="1872"
              height="1248"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
