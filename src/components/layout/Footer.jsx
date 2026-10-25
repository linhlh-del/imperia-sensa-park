import { Link } from "react-router-dom";
import { SUBPAGES } from "../../lib/seo";
import { site } from "../../cms/content";

export default function Footer() {
  return (
    <footer className="bg-imperia-background-dark text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-xl tracking-widest">
            IMPERIA <span className="text-imperia-accent">SENSA PARK</span>
          </div>
          {/* Địa chỉ thống nhất với schema (index.html) và popup đăng ký */}
          <address className="mt-4 max-w-md text-sm not-italic leading-6 text-white/60">
            {site.contact.address}.
            <br />
            Hotline:{" "}
            <a
              href={site.contact.hotlineHref}
              className="normal-case text-imperia-accent"
            >
              {site.contact.hotline}
            </a>
          </address>
        </div>
        <div>
          <h2 className="font-bold">Dự án</h2>
          <div className="mt-4 grid gap-2 text-sm text-white/60">
            {SUBPAGES.map((p) => (
              <Link key={p.path} to={p.path}>
                {p.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-bold">Liên hệ</h2>
          <div className="mt-4 grid gap-2 text-sm text-white/60">
            <Link to="/tin-tuc">Tin tức</Link>
            <a href="#lien-he">Nhận bảng giá</a>
          </div>
        </div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-white/10 py-5 text-[11px] text-white/40 md:flex-row md:justify-between">
        <span>© 2026 Imperia Sensa Park.</span>
        <span>Chính sách bảo mật · Điều khoản sử dụng</span>
      </div>
    </footer>
  );
}
