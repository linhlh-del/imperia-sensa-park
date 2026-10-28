import { Link } from "react-router-dom";
import { SUBPAGES } from "../../lib/seo";
import { site } from "../../cms/content";

export default function Footer() {
  return (
    <footer data-hide-floating className="bg-imperia-background-dark text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-xl tracking-widest">
            IMPERIA <span className="text-imperia-cream">SENSA PARK</span>
          </div>
          {/* Địa chỉ thống nhất với schema (index.html) và popup đăng ký */}
          <address className="mt-4 max-w-md text-sm not-italic leading-6 text-white/90">
            {site.contact.address}.
            <br />
            Hotline:{" "}
            <a
              href={site.contact.hotlineHref}
              className="font-bold normal-case text-imperia-cream underline-offset-4 hover:underline"
            >
              {site.contact.hotline}
            </a>
          </address>
        </div>
        <div>
          <h2 className="font-bold">Dự án</h2>
          <div className="mt-4 grid gap-1 text-sm text-white/90">
            {SUBPAGES.map((p) => (
              <Link key={p.path} to={p.path} className="py-1 hover:text-imperia-cream">
                {p.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-bold">Khám phá</h2>
          <div className="mt-4 grid gap-1 text-sm text-white/90">
            {[
              ["#tong-quan", "Tổng quan"],
              ["#tien-ich", "Tiện ích"],
              ["#mat-bang", "Mặt bằng"],
              ["#tinh-tra-gop", "Tính trả góp"],
              ["#lien-he", "Nhận bảng giá"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="py-1 hover:text-imperia-cream">
                {label}
              </a>
            ))}
            <Link to="/tin-tuc" className="py-1 hover:text-imperia-cream">
              Tin tức
            </Link>
          </div>
        </div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-white/15 py-5 text-[13px] text-white/85 md:flex-row md:justify-between">
        <span>© 2026 Imperia Sensa Park. Hình ảnh và thông tin mang tính minh hoạ, có thể thay đổi theo hồ sơ pháp lý.</span>
        <span>Chính sách bảo mật · Điều khoản sử dụng</span>
      </div>
    </footer>
  );
}
