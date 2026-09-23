import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";

const HIGHLIGHTS = [
  "Brochure thông tin chi tiết dự án",
  "Bản đồ vị trí & quy hoạch hạ tầng dự án",
  "Mặt bằng tổng thể & vị trí từng căn",
  "Bảng tính giá gốc & dòng tiền",
  "Chính sách bán hàng & hỗ trợ lãi suất",
  "Hồ sơ pháp lý: Chấp thuận ĐT, GPXD, 1/500",
];

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
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/lead-bg.jpg')" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-white/25"
        aria-hidden="true"
      />
      <div className="container-page relative z-10">
        <div className="grid gap-0 overflow-hidden rounded-[28px] bg-white/50 shadow-soft backdrop-blur-md lg:grid-cols-[60%_40%]">
          <div className="p-6 md:p-8">
            <SectionHeading
              title="Nhận thông tin dự án."
              subtitle="Để lại thông tin để nhận bảng giá, chính sách ưu đãi và được chuyên viên tư vấn hỗ trợ nhanh chóng."
              className="[&_.section-subtitle]:!text-[#34362f]"
            />
            <ul className="mb-8 grid gap-3 text-sm font-medium text-[#34362f]">
              {HIGHLIGHTS.map((text) => (
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
              Hotline: 093 448 3138
            </strong>
          </div>
          <form
            onSubmit={onSubmit}
            className="grid gap-3 bg-white/35 p-7 md:p-9 lg:my-5 lg:mr-5 lg:w-[88%] lg:justify-self-end lg:rounded-[24px]"
          >
            <input
              required
              className="rounded-xl border border-imperia-primary/15 bg-imperia-cream px-4 py-3 text-sm outline-none focus:border-imperia-primary"
              placeholder="Họ và tên *"
            />
            <input
              required
              type="tel"
              className="rounded-xl border border-imperia-primary/15 bg-imperia-cream px-4 py-3 text-sm outline-none focus:border-imperia-primary"
              placeholder="Số điện thoại *"
            />
            <select className="rounded-xl border border-imperia-primary/15 bg-imperia-cream px-4 py-3 text-sm outline-none">
              <option>Nhu cầu quan tâm</option>
              <option>Nhận bảng giá</option>
              <option>Chọn căn hộ</option>
              <option>Xem mặt bằng</option>
            </select>

            <Button type="submit">Đăng ký nhận thông tin</Button>
            <div className="mt-0.5 flex flex-col gap-2 rounded-lg border border-imperia-primary/20 bg-white/60 p-3 text-left">
              <p className="flex min-w-0 items-center gap-2 text-[0.8125rem] text-imperia-black/85">
                <span className="flex-shrink-0 text-imperia-primary">
                  <ShieldIcon />
                </span>
                Tuyệt đối <strong>bảo mật</strong> thông tin cá nhân.
              </p>
              <p className="flex min-w-0 items-center gap-2 text-[0.8125rem] text-imperia-black/85">
                <span className="flex-shrink-0 text-imperia-primary">
                  <HeadsetIcon />
                </span>
                <strong>Giải đáp mọi thắc mắc</strong> của khách hàng.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
