import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
export default function LeadSection({ onSubmit }) {
  return (
    <section
      id="lien-he"
      data-section="lead-form"
      className="section-y bg-imperia-beige"
    >
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              title="Nhận thông tin dự án."
              subtitle="Để lại thông tin để nhận bảng giá, chính sách ưu đãi và được chuyên viên tư vấn hỗ trợ nhanh chóng."
            />
            <ul className="mb-8 grid gap-4 text-sm text-[#64675c]">
              {[
                "Thông tin bảng giá mới nhất.",
                "Chính sách ưu đãi theo từng thời điểm.",
                "Tư vấn lựa chọn căn hộ phù hợp.",
              ].map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="text-imperia-primary">✓</span>
                  {x}
                </li>
              ))}
            </ul>
            <strong className="font-display text-3xl text-imperia-primary">
              Hotline: 1800 1234
            </strong>
          </div>
          <form
            onSubmit={onSubmit}
            className="grid gap-3 rounded-[28px] bg-white p-7 shadow-soft md:p-9"
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
            <input
              type="email"
              className="rounded-xl border border-imperia-primary/15 bg-imperia-cream px-4 py-3 text-sm outline-none focus:border-imperia-primary"
              placeholder="Email"
            />
            <select className="rounded-xl border border-imperia-primary/15 bg-imperia-cream px-4 py-3 text-sm outline-none">
              <option>Nhu cầu quan tâm</option>
              <option>Nhận bảng giá</option>
              <option>Chọn căn hộ</option>
              <option>Xem mặt bằng</option>
            </select>
            <textarea
              rows="4"
              className="rounded-xl border border-imperia-primary/15 bg-imperia-cream px-4 py-3 text-sm outline-none focus:border-imperia-primary"
              placeholder="Nội dung cần tư vấn"
            />
            <Button type="submit">Đăng ký nhận thông tin</Button>
            <small className="text-[11px] text-[#777]">
              Bằng việc gửi thông tin, bạn đồng ý để bộ phận tư vấn liên hệ.
            </small>
          </form>
        </div>
      </div>
    </section>
  );
}
