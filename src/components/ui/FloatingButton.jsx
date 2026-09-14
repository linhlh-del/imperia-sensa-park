const PHONE_NUMBER = "0877191940";
const PHONE_DISPLAY = "0877 191 940";
const ZALO_URL = "https://zalo.me/1717736678695240623";
const PRICE_URL = "/bang-gia"; // TODO: đổi thành link Bảng Giá thực tế

/* ── Icon components (Tabler icons, inline SVG để responsive theo nút) ── */
function PhoneIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
    </svg>
  );
}

function PdfIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
      <path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" />
      <path d="M17 18h2" />
      <path d="M20 15h-3v6" />
      <path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1" />
    </svg>
  );
}

function FbLabel({ children }) {
  return (
    <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-black/75 px-2.5 py-1 text-xs font-semibold text-imperia-accent max-[480px]:mr-2 max-[480px]:px-2 max-[480px]:py-1 max-[480px]:text-[10px]">
      {children}
    </span>
  );
}

export default function FloatingButtons({ onOpenModal }) {
  return (
    <div className="fixed bottom-6 right-5 z-[9999] flex flex-col items-center gap-3.5 max-[480px]:bottom-4 max-[480px]:right-3 max-[480px]:gap-2.5">
      {/* ── Phone ── */}
      <a
        href={`tel:${PHONE_NUMBER}`}
        title={`Gọi ngay ${PHONE_DISPLAY}`}
        aria-label={`Gọi ${PHONE_DISPLAY}`}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0068FF] text-white shadow-[0_4px_20px_rgba(0,104,255,0.5)] transition-transform duration-200 animate-fb-phone-glow hover:scale-[1.12] hover:[animation-play-state:paused] hover:shadow-[0_6px_28px_rgba(0,104,255,0.65)] max-[480px]:h-12 max-[480px]:w-12"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-full border-2 border-[#0068FF]/55 animate-fb-ring-1"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-full border-2 border-[#0068FF]/35 animate-fb-ring-2"
        />
        <span className="relative z-[2] flex h-full w-full animate-fb-phone-wobble items-center justify-center rounded-full group-hover:[animation-play-state:paused]">
          <PhoneIcon className="h-1/2 w-1/2 shrink-0" aria-hidden="true" />
        </span>
        <FbLabel>Tư Vấn</FbLabel>
      </a>

      {/* ── Zalo ── */}
      <a
        href={ZALO_URL}
        target="_blank"
        rel="noreferrer"
        title="Chat Zalo"
        aria-label="Chat qua Zalo"
        className="group relative flex h-[50px] w-[50px] items-center justify-center rounded-full text-imperia-accent transition-transform duration-200 [filter:drop-shadow(0_3px_10px_rgba(0,104,255,0.4))] hover:scale-[1.08] hover:[filter:drop-shadow(0_5px_16px_rgba(0,104,255,0.65))] max-[480px]:h-11 max-[480px]:w-11"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-full bg-[#0068FF]/25 animate-fb-zalo-ring-1 group-hover:[animation-play-state:paused]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-full bg-[#0068FF]/15 animate-fb-zalo-ring-2 group-hover:[animation-play-state:paused]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-full bg-[#0068FF]/10 animate-fb-zalo-ring-3 group-hover:[animation-play-state:paused]"
        />
        <span className="relative z-[2] flex h-full w-full animate-fb-zalo-shake items-center justify-center rounded-full group-hover:[animation-play-state:paused]">
          <img
            src="/assets/logo-zalo.webp"
            alt="Zalo"
            className="h-[85%] w-[85%] object-contain"
          />
        </span>
        <FbLabel>Chat Zalo</FbLabel>
      </a>

      {/* ── Bảng Giá ── */}
      <button
        type="button"
        onClick={onOpenModal}
        title="Bảng Giá"
        aria-label="Xem Bảng Giá"
        className="group relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#0068FF] text-white shadow-[0_4px_20px_rgba(0,104,255,0.5)] transition-transform duration-200 animate-fb-price-glow hover:scale-[1.12] hover:[animation-play-state:paused] hover:shadow-[0_6px_28px_rgba(0,104,255,0.65)] max-[480px]:h-11 max-[480px]:w-11"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-full border-2 border-[#0068FF]/50 animate-fb-price-ring-1"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-full border-2 border-[#0068FF]/30 animate-fb-price-ring-2"
        />
        <span className="relative z-[2] flex h-full w-full animate-fb-price-wobble items-center justify-center rounded-full group-hover:[animation-play-state:paused]">
          <PdfIcon className="h-1/2 w-1/2 shrink-0" aria-hidden="true" />
        </span>
        <FbLabel>Bảng Giá</FbLabel>
      </button>
    </div>
  );
}
