import TopicLink from "../ui/TopicLink";
import Image from "../ui/Image";
import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
import { img, t } from "../../cms/content";

/* variant (CMS): "image-right" (mặc định) | "image-left" */
export default function Overview({ data, variant = "image-right" }) {
  return (
    <section
      id="tong-quan"
      data-section="overview"
      className="section-y bg-imperia-cream"
    >
      <div className="container-page">
        <SectionHeading title={data.title} semanticTitle={t("overview.seo")} />
        <div
          className={`grid items-center gap-[clamp(16px,4svh,48px)] ${variant === "image-left" ? "lg:grid-cols-[1.32fr_0.68fr] [&>img]:lg:order-first" : "lg:grid-cols-[0.68fr_1.32fr]"}`}
        >
          <div>
            <p className="section-subtitle !mt-0 mb-[clamp(12px,2.6svh,28px)]">{data.subtitle}</p>
            <ul className="mb-[clamp(16px,3svh,32px)] grid gap-[clamp(8px,1.6svh,16px)]">
              {data.bullets.map((x) => (
                <li key={x} className="flex gap-3 text-sm text-[#64675c]">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-imperia-accent/30 text-imperia-primary">
                    ✓
                  </span>
                  {x}
                </li>
              ))}
            </ul>
            <div className="section-actions"><TopicLink to="/tong-quan">Chi tiết tổng quan</TopicLink><Button href="#tien-ich" variant="outline">Hệ tiện ích</Button></div>
          </div>
          <Image
            src={img("overview.image", "/assets/overview.optimized.webp")}
            srcSet={img("overview.image", "/assets/overview.optimized.webp") === "/assets/overview.optimized.webp" ? "/assets/responsive/overview.optimized-480.webp 480w, /assets/responsive/overview.optimized-800.webp 800w, /assets/responsive/overview.optimized-1200.webp 1200w, /assets/overview.optimized.webp 1619w" : undefined}
            sizes="(min-width: 1024px) 65vw, 100vw"
            alt={t("overview.imageAlt")}
            width="1619" height="972"
            loading="lazy"
            decoding="async"
            /* ảnh bản đồ Metro có chữ: điện thoại/tablet (không có paging JS, không cần vừa đúng 1 màn hình) → ưu
               tiên hiện TRỌN bề rộng màn hình, cao theo tỉ lệ 1619:972. Desktop (≥1024px, có paging 1 section/màn
               hình) mới thu bề rộng theo chiều cao màn hình để không tràn khỏi khung nhìn. */
            className="max-lg:-order-1 mx-auto aspect-[1619/972] w-full rounded-[28px] border border-imperia-primary/10 object-contain shadow-soft"
          />
        </div>
        <div data-stats className="mt-[clamp(12px,3svh,64px)] grid grid-cols-2 md:grid-cols-4">
          {data.facts.map(([n, l]) => (
            <div key={l} className="flex flex-col justify-center border border-imperia-primary/10 px-3 py-[clamp(6px,1.4svh,24px)] md:px-4">
              <strong className="whitespace-nowrap font-display text-[clamp(20px,2.4vw,30px)] leading-tight text-imperia-primary">
                {/* số đo / mốc thời gian hiện tĩnh, không đếm */}
                {n}
              </strong>
              <span className="mt-1 block text-[13px] uppercase leading-snug tracking-[.04em] text-[#5c5f53]">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
