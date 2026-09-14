import React from "react";

/**
 * Dữ liệu dịch vụ — lấy từ extracted-content.json
 * Đổi đường dẫn `image` cho khớp với thư mục ảnh thật của dự án.
 */
const SERVICES = [
  {
    order: 1,
    title: "VIP CONCIERGE SERVICE",
    vi: "Ngay từ khoảnh khắc bước vào sảnh đón, đội ngũ nhân viên cùng dịch vụ xe đẩy đặc trưng sẽ mang đến sự thoải mái trọn vẹn cho từng cư dân.",
    en: "From the very first moment of arrival, residents are welcomed with personalised comfort through signature valet trolley service and a dedicated hospitality team.",
    image: "/assets/services/1.jpg",
  },
  {
    order: 2,
    title: "PREMIUM HOME-CARE SERVICE",
    vi: "Dịch vụ dọn dẹp nhà cửa cá nhân hóa, mang đến một không gian sống tận hưởng và thoải mái.",
    en: "Tailored housekeeping services ensure a pristine, relaxing living space designed for effortless enjoyment.",
    image: "/assets/services/2.jpg",
  },
  {
    order: 3,
    title: "EXCLUSIVE GREENERY-CARE SERVICE",
    vi: "Dịch vụ chăm sóc cây xanh chuyên nghiệp, duy trì không gian trong lành.",
    en: "Professional landscape care maintains a fresh, verdant environment throughout the property.",
    image: "/assets/services/3.jpg",
  },
  {
    order: 4,
    title: "ELITE PROPERTY LEASING & MANAGEMENT",
    vi: "Giải pháp quản lý và cho thuê căn hộ cao cấp, đảm bảo sự vận hành chuyên nghiệp.",
    en: "Premium property management and leasing solutions ensure seamless, professional operation of every residence.",
    image: "/assets/services/4.jpg",
  },
  {
    order: 5,
    title: "TECHNICAL SUPPORT",
    vi: "Xử lý nhanh chóng các sự cố nhỏ trong căn hộ, đảm bảo mọi thiết bị luôn vận hành ổn định.",
    en: "Quickly handle minor problems in the apartment, ensuring that all equipment always operates stably.",
    image: "/assets/services/5.png",
  },
  {
    order: 6,
    title: "PREMIUM FACILITY RESERVATION",
    vi: "Đặt chỗ tiện ích cao cấp: Trải nghiệm trọn vẹn những tiện ích đẳng cấp ngay tại tòa nhà với dịch vụ đặt chỗ nhanh chóng, thuận tiện.",
    en: "Fully experience high-class facilities in the building with a fast and convenient reservation service.",
    image: "/assets/services/6.png",
  },
];

function ServiceCopy({ service, className = "" }) {
  return (
    <div data-cms-item className={className}>
      <span className="mb-3 block h-px w-7 bg-imperia-primary/40" />
      <h3 className="text-[15px] font-bold tracking-[0.01em] text-imperia-black">
        {service.title}
      </h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-imperia-black/70">
        {service.vi}
      </p>
      <p className="mt-2 text-[12.5px] leading-relaxed text-imperia-black/45">
        {service.en}
      </p>
    </div>
  );
}

function ServiceBlock({ service, aspect = "aspect-[4/5]" }) {
  return (
    <div className="flex flex-col">
      <div className={`w-full overflow-hidden bg-imperia-beige/40 ${aspect}`}>
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <ServiceCopy service={service} className="mt-5" />
    </div>
  );
}

export default function ExclusiveServicesSection() {
  const [concierge, homeCare, greenery, leasing, techSupport, reservation] =
    SERVICES;

  return (
    <section className="section-y bg-imperia-cream">
      <div className="container-page">
        <div className="flex items-stretch gap-6 md:gap-10">
          {/* Vertical rail — page furniture, mirrors the print-spread reference */}
          <div className="hidden w-6 shrink-0 flex-col items-center lg:flex">
            <span className="mt-16 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.25em] text-imperia-primary/55 [writing-mode:vertical-rl] rotate-180">
              The Matrix One Premium
            </span>
            <span className="my-4 h-8 w-px bg-imperia-primary/30" />
            <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.25em] text-imperia-primary/55 [writing-mode:vertical-rl] rotate-180">
              The Luxe
            </span>
            <span className="mt-auto pb-1 text-[12px] font-semibold text-imperia-primary/70">
              14
            </span>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1 — heading + VIP concierge */}
            <div className="flex flex-col">
              <div className="mb-8">
                <span className="mb-4 block h-10 w-px bg-imperia-primary/50" />
                <h2 className="font-title text-[30px] leading-[1.15] text-imperia-primary sm:text-[34px]">
                  Dịch vụ đặc quyền
                  <br />
                  cho giới tinh hoa
                </h2>
                <p className="mt-4 text-[12px] font-medium uppercase tracking-[0.15em] text-imperia-black/55">
                  &quot;Exclusive Hospitality Experience&quot;
                </p>
              </div>
              <ServiceBlock service={concierge} aspect="aspect-[4/5]" />
            </div>

            {/* Column 2 — home-care + greenery-care */}
            <div className="flex flex-col gap-14">
              <ServiceBlock service={homeCare} aspect="aspect-[4/5]" />
              <ServiceBlock service={greenery} aspect="aspect-[4/5]" />
            </div>

            {/* Column 3 — home-care copy repeated (matches reference layout) + leasing */}
            <div className="flex flex-col gap-14">
              <ServiceCopy service={homeCare} className="lg:mt-16" />
              <ServiceBlock service={leasing} aspect="aspect-[4/3]" />
            </div>

            {/* Column 4 — technical support + facility reservation */}
            <div className="flex flex-col gap-14">
              <ServiceBlock service={techSupport} aspect="aspect-[4/3]" />
              <ServiceBlock service={reservation} aspect="aspect-[4/3]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
