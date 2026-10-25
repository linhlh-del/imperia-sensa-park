import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
import CountUp from "../effects/CountUp";
import { img, t } from "../../cms/content";

/* variant (CMS): "image-right" (mặc định) | "image-left" */
export default function Overview({ data, variant = "image-right" }) {
  return (
    <section
      id="tong-quan"
      data-section="overview"
      className="section-y bg-imperia-cream pt-[calc(var(--section-y)+76px)]"
    >
      <div className="container-page">
        <SectionHeading title={data.title} semanticTitle={t("overview.seo")} />
        <div
          className={`grid items-center gap-12 ${variant === "image-left" ? "lg:grid-cols-[1.32fr_0.68fr] [&>img]:lg:order-first" : "lg:grid-cols-[0.68fr_1.32fr]"}`}
        >
          <div>
            <p className="section-subtitle !mt-0 mb-7">{data.subtitle}</p>
            <ul className="mb-8 grid gap-4">
              {data.bullets.map((x) => (
                <li key={x} className="flex gap-3 text-sm text-[#64675c]">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-imperia-accent/30 text-imperia-primary">
                    ✓
                  </span>
                  {x}
                </li>
              ))}
            </ul>
            <Button href="#tien-ich">{t("overview.cta")}</Button>
          </div>
          <img
            src={img("overview.image", "/assets/overview.optimized.webp")}
            alt={t("overview.imageAlt")}
            loading="lazy"
            decoding="async"
            className="aspect-[1619/972] w-full rounded-[28px] border border-imperia-primary/10 object-contain shadow-soft"
          />
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4">
          {data.facts.map(([n, l]) => (
            <div key={l} className="border border-imperia-primary/10 px-4 py-7">
              <strong className="font-display text-3xl text-imperia-primary">
                <CountUp value={n} />
              </strong>
              <span className="mt-1 block text-xs text-[#777]">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
