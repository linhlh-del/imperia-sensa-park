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

const HeadsetIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 13a8 8 0 0 1 16 0"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <rect
      x="3"
      y="13"
      width="4"
      height="6"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <rect
      x="17"
      y="13"
      width="4"
      height="6"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>
);

export default function LeadSection({ onSubmit }) {
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
        <div className="grid gap-0 overflow-hidden rounded-[28px] bg-white/50 shadow-soft backdrop-blur-md lg:grid-cols-[60%_40%]">
          <div className="p-6 md:p-8">
            <SectionHeading
              title={t("lead.title")}
              subtitle={t("lead.subtitle")}
              className="[&_.section-subtitle]:!text-[#34362f]"
            />
            <ul className="mb-8 grid gap-3 text-sm font-medium text-[#34362f]">
              {tList("lead.highlights").map((text) => (
                <li
                  key={text}
                  className="flex items-start gap-2.5 leading-snug"
                >
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-imperia-accent/20 text-imperia-primary">
                    <CheckIcon />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <strong className="font-display text-3xl text-imperia-primary">
              Hotline: {site.contact.hotline}
            </strong>
          </div>
          <form
            onSubmit={onSubmit}
            data-form-type="register"
            className="relative grid gap-3 bg-white/35 p-7 md:p-9 lg:my-5 lg:mr-5 lg:w-[88%] lg:justify-self-end lg:rounded-[24px]"
          >
            {/* Form 3 trường: Họ tên, SĐT, nút gửi */}
            <label htmlFor="lead-name" className="sr-only">
              Họ và tên
            </label>
            <input
              id="lead-name"
              name="name"
              required
              autoComplete="name"
              className="min-h-12 rounded-xl border border-imperia-primary/15 bg-imperia-cream px-4 py-3 text-sm outline-none focus:border-imperia-primary"
              placeholder="Họ và tên *"
            />
            <label htmlFor="lead-phone" className="sr-only">
              Số điện thoại
            </label>
            <input
              id="lead-phone"
              name="phone"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              onInput={clearPhoneError}
              className="min-h-12 rounded-xl border border-imperia-primary/15 bg-imperia-cream px-4 py-3 text-sm outline-none focus:border-imperia-primary"
              placeholder="Số điện thoại *"
            />

            <FormExtras />
            <Button type="submit">{t("lead.submit")}</Button>
            <div className="mt-0.5 flex flex-col gap-2 rounded-lg border border-imperia-primary/20 bg-white/60 p-3 text-left">
              <p className="flex min-w-0 items-center gap-2 text-[0.8125rem] text-imperia-black/85">
                <span className="flex-shrink-0 text-imperia-primary">
                  <ShieldIcon />
                </span>
                {t("lead.privacy")}
              </p>
              <p className="flex min-w-0 items-center gap-2 text-[0.8125rem] text-imperia-black/85">
                <span className="flex-shrink-0 text-imperia-primary">
                  <HeadsetIcon />
                </span>
                {t("lead.support")}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
