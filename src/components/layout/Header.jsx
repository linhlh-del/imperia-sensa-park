import { useEffect, useState } from "react";
import Brand from "./Brand";
import Button from "../ui/Button";
import { site, t } from "../../cms/content";

/* Scroll-spy: section nào đang chiếm vùng giữa màn hình → mục menu tương ứng sáng lên */
function useScrollSpy(ids) {
  const [active, setActive] = useState("");
  const key = ids.join();
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }, // dải mỏng giữa màn hình
    );
    key.split(",").forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [key]);
  return active;
}

export default function Header({ onLead }) {
  const [open, setOpen] = useState(false);
  const links = [
    ["tong-quan", "Tổng quan"],
    ["vi-tri", "Vị trí"],
    ["tien-ich", "Tiện ích"],
    ["mat-bang", "Mặt bằng"],
    ["tinh-tra-gop", "Tính trả góp"],
    ["tin-tuc", "Tin tức"],
    ["lien-he", "Liên hệ"],
  ];
  const active = useScrollSpy(links.map(([id]) => id));
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);
  const close = () => setOpen(false);
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[1000] h-[var(--header-h)] border-b border-white/10 bg-imperia-background-dark/95 text-white backdrop-blur-xl">
        <div className="container-page flex h-full items-center justify-between gap-8">
          <Brand />
          <nav
            aria-label="Điều hướng chính"
            className="hidden items-center gap-6 text-sm text-white lg:flex xl:gap-7"
          >
            {links.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "location" : undefined}
                className={`relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-imperia-accent after:transition-transform after:duration-300 hover:text-imperia-cream ${
                  active === id ? "after:scale-x-100" : "text-white/90 after:scale-x-0"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden lg:block">
            <Button variant="light" onClick={onLead}>
              {t("header.cta")}
            </Button>
          </div>
          <button
            aria-label="Mở menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/5 lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>
      <div
        className={`fixed inset-0 z-[1090] bg-black/60 backdrop-blur-[2px] transition ${open ? "visible opacity-100" : "invisible opacity-0"}`}
        onClick={close}
      />
      <aside
        className={`fixed right-0 top-0 z-[1100] flex h-dvh w-[min(88vw,390px)] flex-col bg-gradient-to-br from-imperia-background-dark to-imperia-background-light p-6 text-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Brand />
          <button
            onClick={close}
            aria-label="Đóng menu"
            className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/5 text-2xl"
          >
            ×
          </button>
        </div>
        <nav className="mt-5 grid">
          {links.map(([id, label], i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={close}
              aria-current={active === id ? "location" : undefined}
              className="flex min-h-12 items-center gap-4 border-b border-white/10 py-3 text-white hover:text-imperia-cream"
            >
              <span className="w-6 text-[13px] tabular-nums text-imperia-beige">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-base ${active === id ? "font-bold" : ""}`}>{label}</span>
            </a>
          ))}
        </nav>
        {/* Liên hệ nhanh trong menu — lấp khoảng trống giữa danh sách và nút CTA */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <a
            href={site.contact.hotlineHref}
            className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 text-sm font-bold"
          >
            Gọi hotline
          </a>
          <a
            href={site.contact.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 text-sm font-bold"
          >
            <img src="/assets/logo-zalo.webp" alt="" width="20" height="20" className="h-5 w-5 object-contain" />
            Chat Zalo
          </a>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-white/85">{site.contact.address}</p>
        <Button
          variant="light"
          onClick={() => {
            close();
            onLead();
          }}
          className="mt-auto w-full justify-between"
        >
          {t("header.ctaMobile")} <span>→</span>
        </Button>
        <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-xs uppercase tracking-widest text-white/85">
          <span>Hotline</span>
          <a
            href={site.contact.hotlineHref}
            className="text-base font-bold normal-case tracking-normal text-imperia-accent"
          >
            {site.contact.hotline}
          </a>
        </div>
      </aside>
    </>
  );
}
