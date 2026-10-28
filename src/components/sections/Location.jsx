import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
import CountUp from "../effects/CountUp";
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
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="section-subtitle section-subtitle-light !mt-0 mb-7">
              {data.subtitle}
            </p>
            <div className="mb-8 grid divide-y divide-white/10 border-y border-white/10">
              {data.distances.map(([time, label]) => (
                <div key={label} className="flex items-center gap-4 py-4 md:gap-6 md:py-5">
                  <strong className="flex min-w-[64px] items-baseline gap-1 font-display text-3xl text-imperia-cream">
                    <CountUp value={String(time).replace(/['’]/g, "")} />
                    <span className="font-body text-xs font-bold uppercase tracking-[.06em] text-imperia-beige">
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
            className={`relative aspect-[1872/1248] overflow-hidden rounded-[28px] border border-white/10 ${variant === "map-left" ? "lg:order-first" : ""}`}
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
