import { useEffect, useState } from "react";
import Brand from "./Brand";
import Button from "../ui/Button";

export default function Header({ onLead }) {
  const [open, setOpen] = useState(false);
  const links = [
    ["tong-quan", "Tổng quan"],
    ["vi-tri", "Vị trí"],
    ["tien-ich", "Tiện ích"],
    ["mat-bang", "Mặt bằng"],
    ["tin-tuc", "Tin tức"],
    ["lien-he", "Liên hệ"],
  ];
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);
  const close = () => setOpen(false);
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[1000] h-[76px] border-b border-white/10 bg-imperia-dark/90 text-white backdrop-blur-xl">
        <div className="container-page flex h-full items-center justify-between gap-8">
          <Brand />
          <nav className="hidden items-center gap-7 text-[13px] text-white/85 lg:flex">
            {links.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="relative py-7 transition hover:text-imperia-accent"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden lg:block">
            <Button variant="light" onClick={onLead}>
              Nhận thông tin
            </Button>
          </div>
          <button
            aria-label="Mở menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5 text-xl lg:hidden"
          >
            ☰
          </button>
        </div>
      </header>
      <div
        className={`fixed inset-0 z-[1090] bg-black/60 backdrop-blur-[2px] transition ${open ? "visible opacity-100" : "invisible opacity-0"}`}
        onClick={close}
      />
      <aside
        className={`fixed right-0 top-0 z-[1100] flex h-dvh w-[min(88vw,390px)] flex-col bg-gradient-to-br from-imperia-dark to-imperia-primary p-6 text-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Brand />
          <button
            onClick={close}
            aria-label="Đóng menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/5 text-2xl"
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
              className="flex items-center gap-4 border-b border-white/10 py-4 text-white/70 hover:text-imperia-accent"
            >
              <span className="text-xs text-imperia-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base text-white">{label}</span>
            </a>
          ))}
        </nav>
        <Button
          variant="light"
          onClick={() => {
            close();
            onLead();
          }}
          className="mt-auto w-full justify-between"
        >
          Nhận thông tin dự án <span>→</span>
        </Button>
        <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-xs uppercase tracking-widest text-white/50">
          <span>Hotline</span>
          <a
            href="tel:18001234"
            className="text-base font-bold normal-case tracking-normal text-imperia-accent"
          >
            1800 1234
          </a>
        </div>
      </aside>
    </>
  );
}
