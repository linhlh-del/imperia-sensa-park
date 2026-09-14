import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ThankYou() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    window.gtag("event", "conversion", {
      send_to: "AW-18110702521/-Ew3CIv2suYcELnH7btD",
    });
  }, []);

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-imperia-primary to-imperia-dark px-4 py-6 sm:py-8">
      <div className="flex w-full max-w-[37.5rem] animate-[fadeInUp_0.4s_ease] flex-col gap-5 text-center text-white">
        {/* Success Icon */}
        <div className="flex animate-[scaleIn_0.5s_ease-out] justify-center">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="40"
              cy="40"
              r="38"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M28 42L36 50L52 30"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="m-0 text-[clamp(1.75rem,5vw,2.5rem)] font-black uppercase leading-tight tracking-wide text-white">
          CẢM ƠN BẠN!
        </h2>

        <p className="m-0 text-[clamp(0.875rem,2vw,1rem)] leading-relaxed opacity-95">
          Chúng tôi đã nhận được thông tin của bạn. Một chuyên viên sẽ liên hệ
          với bạn trong thời gian sớm nhất để tư vấn chi tiết về dự án{" "}
          <span className="inline whitespace-nowrap">
            <strong>Palm River</strong>.
          </span>
        </p>

        <div className="flex flex-col gap-2.5 rounded-lg border-l-4 border-white bg-white/10 p-4 text-left sm:p-5 md:gap-3 md:p-6">
          <p className="mb-4 font-semibold">Bạn sẽ nhận được:</p>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0 md:gap-3">
            <li className="text-[clamp(0.875rem,2vw,0.95rem)] opacity-90">
              ✓ Bảng giá chi tiết mới nhất
            </li>
            <li className="text-[clamp(0.875rem,2vw,0.95rem)] opacity-90">
              ✓ Chính sách hỗ trợ đặc biệt
            </li>
            <li className="text-[clamp(0.875rem,2vw,0.95rem)] opacity-90">
              ✓ Tư vấn miễn phí từ chuyên viên
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleBackHome}
          className="animate-[buttonPulse_2s_ease-in-out_infinite] rounded-md bg-white px-8 py-[1.125rem] font-['Montserrat',Helvetica,sans-serif] text-[clamp(0.875rem,2vw,1.125rem)] font-black uppercase tracking-wide text-imperia-primary shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
        >
          QUAY LẠI TRANG CHỦ
        </button>

        {/* Contact Info */}
        <p className="mt-2 text-[clamp(0.8rem,1.5vw,0.95rem)] opacity-85">
          Nếu bạn có thắc mắc gấp, vui lòng gọi cho chúng tôi: <br />
          <strong className="mt-2 block text-[clamp(0.95rem,2vw,1.1rem)] text-white">
            0906 757 276
          </strong>
        </p>
      </div>
    </div>
  );
}
