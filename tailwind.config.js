/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        imperia: {
          primary: "#4D5538",
          dark: "#353C27",
          light: "#68734B",
          accent: "#A9B578",
          secondary: "#917663",
          "secondary-dark": "#6F594C",
          beige: "#D6C7BB",
          cream: "#F5F1EB",
          white: "#FFFFFF",
          black: "#20231B",
        },
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        display: ["Arial", "Helvetica", "sans-serif"],
        title: ['"Times New Roman"', "Times", "serif"], // dùng cho title "50+"
        body: ["Arial", "Helvetica", "sans-serif"], // dùng cho subtitle + text
      },
      boxShadow: {
        soft: "0 12px 40px rgba(45, 51, 34, .10)",
        card: "0 18px 60px rgba(45, 51, 34, .14)",
      },
      keyframes: {
        markerShake: {
          "0%, 80%, 100%": { transform: "translate(-50%, -50%) rotate(0deg)" },
          "10%": { transform: "translate(-50%, -50%) rotate(-6deg)" },
          "20%": { transform: "translate(-50%, -50%) rotate(6deg)" },
          "30%": { transform: "translate(-50%, -50%) rotate(-5deg)" },
          "40%": { transform: "translate(-50%, -50%) rotate(5deg)" },
          "50%": { transform: "translate(-50%, -50%) rotate(-3deg)" },
          "60%": { transform: "translate(-50%, -50%) rotate(3deg)" },
          "70%": { transform: "translate(-50%, -50%) rotate(-1deg)" },
        },
        markerRing1: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        markerRing2: {
          "0%": { transform: "scale(1)", opacity: "0.35" },
          "100%": { transform: "scale(3)", opacity: "0" },
        },
        // --- Thêm cho FloorPlan.jsx ---
        breathe: {
          "0%, 100%": { opacity: "0.78" },
          "50%": { opacity: "1" },
        },
        popIn: {
          from: { opacity: "0", transform: "translateY(6px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        // Hiệu ứng "thở" cho từng zone trên FloorPlan — cùng ngôn ngữ với
        // .mbt__zone / @keyframes mbt-breathe trong MatBangTang.css (fill-opacity
        // dao động nhẹ + halo mờ dần bằng currentColor, không cần biết trước
        // màu zone vì polygon đã set màu qua style.color -> fill-current).
        // Tốc độ CHẬM HƠN bản gốc MatBangTang (mặc định 1s) vì FloorPlan có
        // tới 20 zone nhỏ hiển thị cùng lúc, thở nhanh sẽ rối mắt.
        zoneBreathe: {
          "0%, 18%, 82%, 100%": {
            fillOpacity: "0.08",
            filter: "drop-shadow(0 0 0 transparent)",
          },
          "42%, 58%": {
            fillOpacity: "0.14",
            filter: "drop-shadow(0 0 6px currentColor)",
          },
        },
        zoneBreathPulse: {
          "0%": {
            fillOpacity: "0.12",
            strokeOpacity: "0.55",
            filter: "drop-shadow(0 0 0 transparent)",
          },
          "45%, 70%": {
            fillOpacity: "0.36",
            strokeOpacity: "1",
            filter:
              "brightness(1.3) saturate(1.18) drop-shadow(0 0 10px currentColor)",
          },
          "100%": {
            fillOpacity: "0.12",
            strokeOpacity: "0.55",
            filter: "drop-shadow(0 0 0 transparent)",
          },
        },
        // --- Thêm cho ThankYou.jsx ---
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.5)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        buttonPulse: {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
          "50%": {
            transform: "scale(1.02)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          },
        },
        // --- Thêm cho FeaturedAmenities.jsx ---
        amenityShimmer: {
          "0%": { backgroundPosition: "150% 0" },
          "100%": { backgroundPosition: "-50% 0" },
        },
        amenityFadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // --- Thêm cho FloatingButtons.jsx ---
        fbPhoneWobble: {
          "0%, 60%, 100%": { transform: "rotate(0deg) scale(1)" },
          "10%": { transform: "rotate(-15deg) scale(1.05)" },
          "20%": { transform: "rotate(12deg) scale(1.05)" },
          "30%": { transform: "rotate(-10deg) scale(1.02)" },
          "40%": { transform: "rotate(8deg) scale(1.02)" },
          "50%": { transform: "rotate(-4deg) scale(1)" },
        },
        fbPhoneGlow: {
          "0%, 100%": {
            boxShadow:
              "0 4px 20px rgba(77,85,56,0.5), 0 0 0 0 rgba(169,181,120,0.5)",
          },
          "50%": {
            boxShadow:
              "0 4px 28px rgba(77,85,56,0.7), 0 0 0 12px rgba(169,181,120,0)",
          },
        },
        fbRing: {
          "0%": { transform: "scale(1)", opacity: "0.65" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        fbZaloShake: {
          "0%, 80%, 100%": { transform: "rotate(0deg)" },
          "10%": { transform: "rotate(-6deg)" },
          "20%": { transform: "rotate(6deg)" },
          "30%": { transform: "rotate(-5deg)" },
          "40%": { transform: "rotate(5deg)" },
          "50%": { transform: "rotate(-3deg)" },
          "60%": { transform: "rotate(3deg)" },
          "70%": { transform: "rotate(-1deg)" },
        },
        fbZaloRing1: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        fbZaloRing2: {
          "0%": { transform: "scale(1)", opacity: "0.45" },
          "100%": { transform: "scale(2.8)", opacity: "0" },
        },
        fbZaloRing3: {
          "0%": { transform: "scale(1)", opacity: "0.3" },
          "100%": { transform: "scale(3.4)", opacity: "0" },
        },
        // --- Thêm cho nút Bảng Giá trong FloatingButtons.jsx ---
        fbPriceWobble: {
          "0%, 60%, 100%": { transform: "rotate(0deg) scale(1)" },
          "10%": { transform: "rotate(-15deg) scale(1.05)" },
          "20%": { transform: "rotate(12deg) scale(1.05)" },
          "30%": { transform: "rotate(-10deg) scale(1.02)" },
          "40%": { transform: "rotate(8deg) scale(1.02)" },
          "50%": { transform: "rotate(-4deg) scale(1)" },
        },
        fbPriceGlow: {
          "0%, 100%": {
            boxShadow:
              "0 4px 20px rgba(211,167,105,0.5), 0 0 0 0 rgba(211,167,105,0.5)",
          },
          "50%": {
            boxShadow:
              "0 4px 28px rgba(211,167,105,0.7), 0 0 0 12px rgba(211,167,105,0)",
          },
        },
        fbPriceRing: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
      },
      animation: {
        "marker-shake": "markerShake 2s ease-in-out infinite",
        "marker-ring1": "markerRing1 2s ease-out infinite",
        "marker-ring2": "markerRing2 2s ease-out infinite 0.55s",
        // --- Thêm cho FloorPlan.jsx ---
        breathe: "breathe 2.2s ease-in-out infinite",
        "pop-in": "popIn 220ms cubic-bezier(0.2, 0.7, 0.2, 1)",
        // Thay cho "zone-march" (kiến bò) cũ — xem zoneBreathe ở trên.
        // 3.2s gồm khoảng nghỉ ở đầu/cuối mỗi nhịp, tránh cảm giác nhấp nháy
        // liên tục khi di chuyển qua các zone.
        "zone-breathe": "zoneBreathe 2s ease-in-out infinite",
        "zone-breath-pulse": "zoneBreathPulse 2000ms ease-in-out 3",
        // --- Thêm cho ThankYou.jsx ---
        "fade-in-up": "fadeInUp 0.4s ease",
        "scale-in": "scaleIn 0.5s ease-out",
        "button-pulse": "buttonPulse 2s ease-in-out infinite",
        // --- Thêm cho FeaturedAmenities.jsx ---
        "amenity-shimmer": "amenityShimmer 1.3s ease-in-out infinite",
        "amenity-fade-in": "amenityFadeIn 0.35s ease",
        // --- Thêm cho FloatingButtons.jsx ---
        "fb-phone-wobble": "fbPhoneWobble 2.2s ease-in-out infinite",
        "fb-phone-glow": "fbPhoneGlow 2.2s ease-in-out infinite",
        "fb-ring-1": "fbRing 2.2s ease-out infinite",
        "fb-ring-2": "fbRing 2.2s ease-out infinite 0.7s",
        "fb-zalo-shake": "fbZaloShake 1.6s ease-in-out infinite",
        "fb-zalo-ring-1": "fbZaloRing1 2s ease-out infinite",
        "fb-zalo-ring-2": "fbZaloRing2 2s ease-out infinite 0.5s",
        "fb-zalo-ring-3": "fbZaloRing3 2s ease-out infinite 1s",
        // --- Thêm cho nút Bảng Giá trong FloatingButtons.jsx ---
        "fb-price-wobble": "fbPriceWobble 2.4s ease-in-out infinite",
        "fb-price-glow": "fbPriceGlow 2.4s ease-in-out infinite",
        "fb-price-ring-1": "fbPriceRing 2.4s ease-out infinite",
        "fb-price-ring-2": "fbPriceRing 2.4s ease-out infinite 0.8s",
      },
    },
  },
  plugins: [],
};
