import Button from "../ui/Button";
import CountUp from "../effects/CountUp";
import { img, t } from "../../cms/content";

/* variant (CMS): "left" (mặc định, chữ bên trái) | "center" (chữ giữa)

   BỐ CỤC
   - Mobile (< 768px): ảnh ở trên (~28svh), chữ + CTA + số liệu ở dưới trên nền olive đặc
     → chữ không đè lên ảnh, không còn khoảng trống lớn phía trên tiêu đề.
   - Tablet/desktop: ảnh phủ toàn khung + gradient trái; cả hero (kể cả thanh số liệu) vừa đúng
     1 màn hình (min-height 100svh) thay cho 860px cố định. */
export default function Hero({ data, variant = "left" }) {
  const centered = variant === "center";
  return (
    <section
      id="hero"
      data-section="hero"
      className="relative flex min-h-[calc(100svh-var(--bar))] flex-col bg-imperia-primary pt-[var(--header-h)] text-white"
    >
      <div className="relative h-[28svh] min-h-[160px] overflow-hidden md:absolute md:inset-0 md:h-auto">
        <img
          src={img("hero.background", "/assets/hero2.optimized.webp")}
          alt=""
          aria-hidden="true"
          width="1491"
          height="863"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[60%_center] md:origin-bottom md:scale-[1.1]"
        />
        {/* Desktop: gradient trái giữ chữ đọc rõ. Mobile: chân ảnh hoà dần vào nền chữ. */}
        <div className="hero-overlay absolute inset-0 hidden md:block" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-imperia-primary md:hidden" />
      </div>

      <div className="container-page relative z-10 flex flex-1 items-center pb-6 pt-2 md:py-[clamp(20px,6svh,64px)]">
        <div
          className={`max-w-[580px] ${centered ? "mx-auto text-center [&_.flex]:justify-center" : ""}`}
        >
          <div className="mb-4 text-[13px] font-bold uppercase tracking-[.16em] text-imperia-beige md:text-imperia-accent">
            {data.kicker}
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,88px)] font-semibold uppercase leading-[.95] tracking-[-.03em]">
            {data.title}
            <br />
            <span className="text-imperia-accent">{data.titleAccent}</span>
            <span className="sr-only"> {t("hero.h1Seo")}</span>
          </h1>
          <p className="mt-4 max-w-[540px] md:mt-6 text-[clamp(15px,1.2vw,19px)] leading-relaxed text-white/90">
            {data.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-[clamp(16px,3.5svh,32px)]">
            <Button href="#tong-quan" variant="light">
              {t("hero.ctaExplore")}
            </Button>
            <Button href="#lien-he" variant="outlineLight">
              {t("hero.ctaPrice")}
            </Button>
          </div>
        </div>
      </div>

      {/* Số liệu bán hàng: luôn nằm trong khung hình đầu tiên (không còn treo lơ lửng -62px) */}
      <div className="container-page relative z-10 pb-6 md:pb-[clamp(16px,4svh,40px)]">
        <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/15 bg-imperia-dark/75 shadow-card backdrop-blur-md md:grid-cols-4">
          {data.stats.map(([number, suffix, label]) => (
            <div
              key={label}
              className="flex flex-col-reverse border-white/10 px-4 py-3 [&:nth-child(-n+2)]:border-b md:border-r md:px-6 md:py-[clamp(12px,2.4svh,24px)] md:last:border-r-0 md:[&:nth-child(-n+2)]:border-b-0 [&:nth-child(odd)]:border-r"
            >
              <dt className="mt-1 text-[13px] uppercase leading-snug tracking-[.04em] text-white/85">
                {label}
              </dt>
              <dd className="font-display text-3xl leading-none md:text-4xl">
                {/* đếm số chỉ cho con số lớn (922, 40+); số nhỏ / số đo (~5 ha, 02 tháp) hiện tĩnh — tránh lướt qua
                    thấy số sai trong lúc đang đếm */}
                {Number(String(number).replace(/\D/g, "")) >= 10 ? <CountUp value={number} duration={900} /> : number}
                <small className="ml-1 text-base text-imperia-accent">
                  {suffix}
                </small>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
