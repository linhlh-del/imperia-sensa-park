import { useEffect, useRef } from "react";
import Button from "./Button";

const APARTMENT_TYPES = ["Studio", "1PN+", "2PN", "3PN", "Duplex"];

const HIGHLIGHTS = [
  "Brochure thông tin chi tiết dự án",
  "Bản đồ vị trí & quy hoạch hạ tầng dự án",
  "Mặt bằng tổng thể & vị trí từng căn",
  "Bảng tính giá gốc & dòng tiền",
  "Chính sách bán hàng & hỗ trợ lãi suất",
  "Hồ sơ pháp lý: Chấp thuận ĐT, GPXD, 1/500",
];

/* ------------------------- Icon set (inline SVG) ------------------------- */
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

const PinIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
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
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
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
    <path
      d="M20 19v1a3 3 0 0 1-3 3h-3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export default function LeadPopup({
  open,
  onClose,
  onSubmit,
  address = "Imperia Sensa Park, TP. Thủ Đức",
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => ref.current?.focus(), 50);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] grid place-items-center p-5"
      role="presentation"
    >
      <button
        aria-label="Đóng popup"
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-title"
        className="relative z-10 grid max-h-[calc(100dvh-2rem)] w-full max-w-[1120px] grid-cols-1 items-start overflow-y-auto rounded-3xl bg-imperia-cream shadow-2xl md:max-h-[90vh] md:overflow-hidden md:grid-cols-[60%_40%]"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-imperia-primary/15 bg-white text-2xl text-imperia-primary"
        >
          ×
        </button>

        {/* Cột trái: ảnh dự án — tỉ lệ đúng ảnh gốc 1536x1043 trên mobile,
            phủ full chiều cao cột (object-cover) trên desktop */}
        <div className="relative aspect-square min-h-0 w-full overflow-hidden bg-[rgb(145,118,99)]">
          <img
            src="/assets/popup.jpg"
            alt="Phối cảnh Imperia Sensa Park"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-imperia-black/75 via-imperia-black/10 to-transparent" />
          <div className="absolute inset-x-5 bottom-4 flex items-center gap-1.5 text-[13px] font-medium text-imperia-white">
            <span className="flex-shrink-0 text-imperia-accent">
              <PinIcon />
            </span>
            <span className="min-w-0 break-words">{address}</span>
          </div>
        </div>

        {/* Cột phải: nội dung + form */}
        <div className="flex flex-col gap-2.5 overflow-y-auto p-6 md:p-8">
          <h2 id="lead-title" className="section-title text-3xl md:text-3xl">
            Nhận thông tin dự án
          </h2>
          <p className="text-sm text-[#6c6e65]">
            Đăng ký nhận tài liệu chuyên sâu & tư vấn 1:1 từ chuyên viên
          </p>

          <ul className="mt-1 flex flex-col gap-1.5">
            {HIGHLIGHTS.map((text) => (
              <li
                key={text}
                className="flex items-start gap-2.5 text-[0.875rem] leading-snug text-imperia-black/85"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-imperia-accent/20 text-imperia-primary">
                  <CheckIcon />
                </span>
                <span className="min-w-0 break-words">{text}</span>
              </li>
            ))}
          </ul>

          <form onSubmit={onSubmit} className="mt-1 grid gap-2.5">
            <div className="grid gap-2.5 md:grid-cols-2">
              <input
                ref={ref}
                required
                name="name"
                className="min-w-0 rounded-xl border border-imperia-primary/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-imperia-primary"
                placeholder="Họ và tên *"
              />
              <input
                required
                type="tel"
                name="phone"
                className="min-w-0 rounded-xl border border-imperia-primary/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-imperia-primary"
                placeholder="Số điện thoại *"
              />
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 md:grid-cols-3">
              {APARTMENT_TYPES.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-1.5 text-[0.83rem] text-imperia-black/85"
                >
                  <input
                    type="checkbox"
                    name="apartmentTypes"
                    value={type}
                    className="h-[1.05rem] w-[1.05rem] flex-shrink-0 rounded border-imperia-primary accent-imperia-primary"
                  />
                  <span className="min-w-0 break-words">{type}</span>
                </label>
              ))}
            </div>

            <Button type="submit">Nhận thông tin</Button>

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
    </div>
  );
}
