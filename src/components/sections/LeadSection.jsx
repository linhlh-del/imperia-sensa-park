import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
import { clearPhoneError } from "../../lib/lead";
import FormExtras from "../ui/FormExtras";
import { img, site, t, tList } from "../../cms/content";

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M13.5 4.5L6.5 11.5L2.5 7.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 3l7 3v6c0 4.5-3 8.2-7 9-4-.8-7-4.5-7-9V6l7-3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="m9 12 2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

function HighlightList({ items, className = "" }) {
  return (
    <ul className={`grid gap-3 text-sm font-medium text-[#34362f] ${className}`}>
      {items.map((text) => (
        <li key={text} className="flex items-start gap-2.5 leading-snug">
          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-imperia-accent/30 text-imperia-primary">
            <CheckIcon />
          </span>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

const fieldClass =
  "min-h-12 w-full rounded-xl border border-imperia-primary/25 bg-white px-4 py-3 text-[15px] text-imperia-black outline-none transition-colors placeholder:text-[#7a7d70] focus:border-imperia-primary focus:ring-2 focus:ring-imperia-primary/15";
const labelClass = "mb-1.5 block text-[13px] font-semibold text-[#34362f]";

export default function LeadSection({ onSubmit }) {
  const highlights = tList("lead.highlights");
  return (
    <section
      id="lien-he"
      data-section="lead-form"
      className="section-y relative overflow-hidden bg-imperia-beige"
    >
      {/* ảnh nền (đổi được trong CMS), tải lười vì nằm cuối trang */}
      <img
        src={img("lead.background", "/assets/lead-bg.optimized.webp")}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-white/25"
        aria-hidden="true"
      />
      <div className="container-page relative z-10">
        <div className="grid gap-0 overflow-hidden rounded-[28px] bg-white/75 shadow-soft backdrop-blur-md lg:grid-cols-[58%_42%]">
          <div className="p-6 pb-2 md:p-8 lg:pb-8">
            <SectionHeading
              title={t("lead.title")}
              subtitle={t("lead.subtitle")}
              className="!mb-6 lg:!mb-10 [&_.section-subtitle]:!text-[#34362f]"
            />
            {/* Mobile: quyền lợi thu gọn (accordion) để form hiện ngay dưới tiêu đề. Desktop: danh sách đầy đủ. */}
            <details className="group mb-2 rounded-xl border border-imperia-primary/15 bg-white/70 lg:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-bold text-imperia-primary [&::-webkit-details-marker]:hidden">
                Bạn sẽ nhận được ({highlights.length} tài liệu)
                <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <HighlightList items={highlights} className="px-4 pb-4" />
            </details>
            <HighlightList items={highlights} className="mb-8 hidden lg:grid" />
            <a
              href={site.contact.hotlineHref}
              className="hidden font-display text-3xl normal-case text-imperia-primary hover:underline lg:inline-block"
            >
              Hotline: {site.contact.hotline}
            </a>
          </div>
          {/* Form nền đặc (không còn kính mờ trên ảnh bận) + nhãn hiển thị (không chỉ dùng placeholder) */}
          <form
            onSubmit={onSubmit}
            data-form-type="register"
            data-hide-floating
            className="relative grid content-center gap-4 bg-white/95 p-6 md:p-8 lg:my-5 lg:mr-5 lg:w-[90%] lg:justify-self-end lg:rounded-[24px] lg:shadow-soft"
          >
            <div>
              <label htmlFor="lead-name" className={labelClass}>
                Họ và tên <span className="text-red-700">*</span>
              </label>
              <input
                id="lead-name"
                name="name"
                required
                autoComplete="name"
                className={fieldClass}
                placeholder="vd. Nguyễn Văn An"
              />
            </div>
            <div>
              <label htmlFor="lead-phone" className={labelClass}>
                Số điện thoại <span className="text-red-700">*</span>
              </label>
              <input
                id="lead-phone"
                name="phone"
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                onInput={clearPhoneError}
                aria-describedby="lead-phone-hint"
                className={fieldClass}
                placeholder="vd. 0912 345 678"
              />
              <p id="lead-phone-hint" className="mt-1 text-xs text-[#5c5f53]">
                Số di động Việt Nam 10 số — chuyên viên gọi lại trong giờ hành chính.
              </p>
            </div>

            <FormExtras />
            <Button type="submit" className="mt-1 w-full">
              {t("lead.submit")}
            </Button>
            <p className="flex items-start gap-2 text-[13px] leading-snug text-[#34362f]">
              <span className="mt-px flex-shrink-0 text-imperia-primary">
                <ShieldIcon />
              </span>
              <span>
                {t("lead.privacy")} {t("lead.support")}
              </span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
