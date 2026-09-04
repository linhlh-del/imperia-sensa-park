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
        // Viền "kiến bò" (marching ants) cho các zone chưa active — đúng
        // hiệu ứng stroke-dashoffset trong file SVG mặt bằng gốc bạn gửi.
        zoneMarch: {
          to: { strokeDashoffset: "-32" },
        },
      },
      animation: {
        "marker-shake": "markerShake 2s ease-in-out infinite",
        "marker-ring1": "markerRing1 2s ease-out infinite",
        "marker-ring2": "markerRing2 2s ease-out infinite 0.55s",
        // --- Thêm cho FloorPlan.jsx ---
        breathe: "breathe 2.2s ease-in-out infinite",
        "pop-in": "popIn 220ms cubic-bezier(0.2, 0.7, 0.2, 1)",
        "zone-march": "zoneMarch 1.1s linear infinite",
      },
    },
  },
  plugins: [],
};
