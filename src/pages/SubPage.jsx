// src/pages/SubPage.jsx
// Trang con theo nhóm từ khóa ngách (/vi-tri, /tien-ich, /mat-bang, /bang-gia).
// Mỗi trang có 1 thẻ <h1> riêng + đoạn giới thiệu riêng, tái sử dụng section
// của trang chủ. Title/description/canonical lấy từ SUBPAGES (src/lib/seo.js).

import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Location from "../components/sections/Location";
import Amenities from "../components/sections/Amenities";
import FeaturedAmenities from "../components/sections/FeaturedAmenities";
import FloorPlan from "../components/sections/FloorPlan";
import LoanCalculator from "../components/sections/LoanCalculator";
import LeadSection from "../components/sections/LeadSection";
import Button from "../components/ui/Button";

import { SUBPAGES } from "../lib/seo";
import { clearPhoneError } from "../lib/lead";
import FormExtras from "../components/ui/FormExtras";
import { site, t } from "../cms/content";

const FLOOR_PLAN_IMAGES = {
  A: "/assets/layout/sensa-A.optimized.webp",
  B: "/assets/layout/sensaB.optimized.webp",
};

const inputClass =
  "min-h-12 rounded-xl border border-imperia-primary/15 bg-imperia-cream px-4 py-3 text-sm outline-none focus:border-imperia-primary";

/* ---------- Form khảo sát chi tiết: chỉ đặt ở trang Bảng giá ---------- */
function PriceSurveyForm({ onSubmit }) {
  return (
    <section id="dang-ky-bang-gia" className="section-y bg-imperia-cream">
      <div className="container-page grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="section-title">Nhận bảng tính giá theo nhu cầu</h2>
          <p className="section-subtitle">
            Chọn loại căn và ngân sách dự kiến, chuyên viên sẽ gửi bảng giá,
            phương án thanh toán và dòng tiền phù hợp nhất cho bạn.
          </p>
        </div>
        <form
          onSubmit={onSubmit}
          data-form-type="quote"
          className="relative grid gap-3 rounded-[24px] bg-white p-6 shadow-soft md:p-8"
        >
          <label htmlFor="survey-name" className="sr-only">
            Họ và tên
          </label>
          <input
            id="survey-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Họ và tên *"
            className={inputClass}
          />
          <label htmlFor="survey-phone" className="sr-only">
            Số điện thoại
          </label>
          <input
            id="survey-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            onInput={clearPhoneError}
            placeholder="Số điện thoại *"
            className={inputClass}
          />
          <label htmlFor="survey-type" className="sr-only">
            Loại căn quan tâm
          </label>
          <select id="survey-type" name="apartmentType" className={inputClass}>
            <option value="">Loại căn quan tâm</option>
            <option>Studio</option>
            <option>1PN+</option>
            <option>2PN</option>
            <option>3PN</option>
            <option>Duplex</option>
          </select>
          <label htmlFor="survey-budget" className="sr-only">
            Ngân sách dự kiến
          </label>
          <select id="survey-budget" name="budget" className={inputClass}>
            <option value="">Ngân sách dự kiến</option>
            <option>Dưới 3 tỷ</option>
            <option>3 – 5 tỷ</option>
            <option>5 – 8 tỷ</option>
            <option>Trên 8 tỷ</option>
          </select>
          <FormExtras />
          <Button type="submit">{t("lead.submit")}</Button>
        </form>
      </div>
    </section>
  );
}

/* ---------- Nội dung riêng từng trang ---------- */
const CONTENT = {
  "/vi-tri": {
    intro: [
      `Imperia Sensa Park nằm ${site.contact.address.charAt(0).toLowerCase()}${site.contact.address.slice(1)}, kết nối trực tiếp đường Liên Phường.`,
      "Từ dự án, cư dân di chuyển nhanh đến Khu Công nghệ cao TP.HCM, Khu liên hợp Thể dục Thể thao Quốc gia Rạch Chiếc, Trung tâm Hành chính Thủ Thiêm và hai sân bay quốc tế Tân Sơn Nhất, Long Thành.",
    ],
    render: () => <Location data={site.location} />,
  },
  "/tien-ich": {
    intro: [
      "Imperia Sensa Park sở hữu hơn 40 tiện ích nội khu trải trên quy mô khoảng 5 ha: hồ bơi Aura Flow, hồ bơi trẻ em, bể sục Jacuzzi, phòng gym, Himalaya Salt Room, Creative Studio, Business Lounge, Wonder Club và đường dạo ven hồ.",
      "Hệ tiện ích được thiết kế cho nhịp sống cân bằng giữa nghỉ dưỡng, vận động, làm việc và kết nối cộng đồng ngay trong khuôn viên dự án.",
    ],
    render: () => (
      <>
        <Amenities items={site.amenities} />
        <FeaturedAmenities />
      </>
    ),
  },
  "/mat-bang": {
    intro: [
      "Mặt bằng tầng điển hình hai tháp Sensa A và Sensa B của Imperia Sensa Park gồm 5 loại hình: Studio, 1PN+, 2PN, 3PN và Duplex.",
      "Chọn từng căn trên mặt bằng để xem loại hình, số phòng ngủ, diện tích tim tường (GFA), diện tích thông thủy (NFA) và layout chi tiết.",
    ],
    render: () => <FloorPlan images={FLOOR_PLAN_IMAGES} />,
  },
  "/bang-gia": {
    intro: [
      "Bảng giá Imperia Sensa Park được chủ đầu tư MIK Group cập nhật theo từng đợt mở bán, kèm chính sách thanh toán và hỗ trợ lãi suất.",
      "Dùng công cụ bên dưới để ước tính khoản vay và số tiền trả góp hàng tháng, sau đó để lại thông tin để nhận bảng giá chính thức theo loại căn bạn quan tâm.",
    ],
    render: ({ onLead, onSubmit }) => (
      <>
        <LoanCalculator onLead={onLead} />
        <PriceSurveyForm onSubmit={onSubmit} />
      </>
    ),
    hideLead: true,
  },
};

export default function SubPage({ path, onLead, onSubmit }) {
  const page = SUBPAGES.find((p) => p.path === path);
  const content = CONTENT[path];

  return (
    <>
      <Header onLead={onLead} />
      <main>
        {/* Khối mở đầu: breadcrumb + H1 + giới thiệu */}
        <section className="bg-imperia-background-dark pb-14 pt-[calc(76px+48px)] text-white">
          <div className="container-page max-w-4xl">
            <nav aria-label="Breadcrumb" className="mb-5 text-xs text-white/75">
              <Link to="/" className="hover:text-white">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <span aria-current="page">{page.name}</span>
            </nav>
            <h1 className="font-display text-[clamp(1.9rem,4vw,3.25rem)] font-semibold uppercase leading-tight">
              {page.h1}
            </h1>
            {content.intro.map((text) => (
              <p
                key={text}
                className="mt-5 max-w-3xl text-[15px] leading-7 text-white/85"
              >
                {text}
              </p>
            ))}
          </div>
        </section>

        {content.render({ onLead, onSubmit })}

        {!content.hideLead && <LeadSection onSubmit={onSubmit} />}

        {/* Liên kết nội bộ sang các trang con khác */}
        <nav
          aria-label="Thông tin dự án khác"
          className="container-page flex flex-wrap gap-3 py-10"
        >
          {SUBPAGES.filter((p) => p.path !== path).map((p) => (
            <Link key={p.path} to={p.path} className="btn-base btn-outline">
              {p.name} Imperia Sensa Park
            </Link>
          ))}
          <Link to="/tin-tuc" className="btn-base btn-outline">
            Tin tức dự án
          </Link>
        </nav>
      </main>
      <Footer />
    </>
  );
}
