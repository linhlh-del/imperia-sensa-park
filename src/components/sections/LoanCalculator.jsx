import { useMemo, useState } from "react";
import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
import { t } from "../../cms/content";

/* ------------------------------------------------------------------
   Công cụ ước tính khoản vay mua căn hộ (tính toán thuần JS, không gọi API).
   Hai cách trả phổ biến của ngân hàng:
   - Gốc đều, lãi giảm dần: kỳ đầu trả nhiều nhất, giảm dần theo dư nợ.
   - Trả góp đều (niên kim): số tiền mỗi tháng cố định.
   Số liệu chỉ để tham khảo; lãi suất thực tế theo chính sách từng thời điểm.
------------------------------------------------------------------- */

const DEFAULTS = { price: 3, loanPercent: 70, rate: 9, years: 20 };

const formatVnd = (value) => `${Math.round(value).toLocaleString("vi-VN")} đ`;

const formatBillion = (value) =>
  `${(value / 1e9).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} tỷ`;

function calcLoan({ price, loanPercent, rate, years }) {
  const priceVnd = price * 1e9;
  const principal = (priceVnd * loanPercent) / 100;
  const months = Math.max(1, Math.round(years * 12));
  const monthlyRate = rate / 100 / 12;

  // Gốc đều, lãi giảm dần
  const principalPerMonth = principal / months;
  const firstMonth = principalPerMonth + principal * monthlyRate;
  const decliningInterest = (principal * monthlyRate * (months + 1)) / 2;

  // Trả góp đều (niên kim)
  const annuity =
    monthlyRate === 0
      ? principalPerMonth
      : (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months);

  return {
    equity: priceVnd - principal,
    principal,
    firstMonth,
    decliningInterest,
    annuity,
    annuityInterest: annuity * months - principal,
  };
}

function Field({ id, label, unit, min, max, step, value, onChange }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <label htmlFor={id} className="font-semibold text-imperia-black">
          {label}
        </label>
        <span className="flex items-baseline gap-1">
          <input
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label={`${label} (${unit})`}
            className="h-11 w-20 rounded-lg border border-imperia-primary/20 bg-white px-2 text-right font-bold text-imperia-primary outline-none focus:border-imperia-primary"
          />
          <span className="text-xs text-[#64675c]">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${value} ${unit}`}
        className="h-8 w-full cursor-pointer accent-imperia-primary md:h-9"
      />
      {/* thang min/max: chỉ hiện trên màn đủ cao (ít giá trị thông tin, tốn 1 dòng mỗi thanh) */}
      <div className="-mt-1 flex justify-between text-xs text-[#5c5f53] max-md:hidden [@media(max-height:51.25rem)]:hidden" aria-hidden="true">
        <span>
          {min} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </div>
    </div>
  );
}

/* secondary: dòng phụ — trên điện thoại ẩn cho tới khi bấm "Xem chi tiết" (chỉ 2 con số trả hằng tháng hiện sẵn) */
function ResultRow({ label, hint, value, strong = false, last = false, secondary = false, open = true }) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 ${last ? "" : "border-b border-white/15 pb-[clamp(8px,1.4svh,12px)]"} ${secondary && !open ? "max-md:hidden" : ""}`}
    >
      <dt className="text-white/90">
        {label}
        {hint ? <span className="block text-xs text-white/90">{hint}</span> : null}
      </dt>
      <dd
        className={`shrink-0 whitespace-nowrap text-right font-bold tabular-nums ${strong ? "text-lg text-imperia-cream" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

export default function LoanCalculator({ onLead }) {
  const [values, setValues] = useState(DEFAULTS);
  const set = (key) => (val) =>
    setValues((v) => ({ ...v, [key]: Number.isFinite(val) ? val : 0 }));
  const result = useMemo(() => calcLoan(values), [values]);
  /* điện thoại: chi tiết khoản vay thu gọn — nhập liệu + 2 con số chính + CTA vừa 1 màn hình */
  const [detail, setDetail] = useState(false);

  return (
    <section
      id="tinh-tra-gop"
      data-section="loan-calculator"
      className="section-y bg-white"
    >
      <div className="container-page">
        <SectionHeading title={t("loan.title")} subtitle={t("loan.subtitle")} className="max-md:[&_.section-subtitle]:line-clamp-2" />

        {/* 2 cột từ 768px (máy tính bảng không còn xếp chồng 2 khối dài) */}
        <div className="grid gap-[clamp(12px,2.6svh,32px)] md:grid-cols-2">
          {/* Cột nhập liệu */}
          <div className="grid gap-[clamp(6px,1.4svh,20px)] rounded-[24px] border border-imperia-primary/10 bg-imperia-cream p-[clamp(16px,2.8svh,32px)]">
            <Field
              id="calc-price"
              label="Giá căn hộ"
              unit="tỷ"
              min={1}
              max={15}
              step={0.1}
              value={values.price}
              onChange={set("price")}
            />
            <Field
              id="calc-loan"
              label="Tỷ lệ vay"
              unit="%"
              min={0}
              max={80}
              step={5}
              value={values.loanPercent}
              onChange={set("loanPercent")}
            />
            <Field
              id="calc-rate"
              label="Lãi suất"
              unit="%/năm"
              min={0}
              max={20}
              step={0.1}
              value={values.rate}
              onChange={set("rate")}
            />
            <Field
              id="calc-years"
              label="Thời hạn vay"
              unit="năm"
              min={1}
              max={35}
              step={1}
              value={values.years}
              onChange={set("years")}
            />
          </div>

          {/* Cột kết quả — số tiền không xuống dòng ("đ" không bị rớt), nhãn ngắn + chú thích nhỏ;
              ghi chú và CTA neo đáy card để không còn khoảng trống ở nửa dưới. */}
          <div
            data-hide-floating
            className="flex flex-col rounded-[24px] bg-imperia-background-dark p-[clamp(16px,2.8svh,32px)] text-white"
            aria-live="polite"
          >
            <dl className="grid flex-1 content-evenly gap-[clamp(8px,1.4svh,16px)] text-sm md:text-[15px]">
              <ResultRow label="Vốn tự có cần chuẩn bị" value={formatBillion(result.equity)} secondary open={detail} />
              <ResultRow label="Số tiền vay" value={formatBillion(result.principal)} secondary open={detail} />
              <ResultRow
                label="Trả tháng đầu"
                hint="Gốc đều, lãi giảm dần"
                value={formatVnd(result.firstMonth)}
                strong
              />
              <ResultRow
                label="Trả đều mỗi tháng"
                hint="Niên kim — cố định cả kỳ"
                value={formatVnd(result.annuity)}
                strong
              />
              <ResultRow
                label="Tổng lãi"
                hint="Gốc đều / niên kim"
                value={`${formatBillion(result.decliningInterest)} / ${formatBillion(result.annuityInterest)}`}
                last
                secondary
                open={detail}
              />
            </dl>
            <button
              type="button"
              onClick={() => setDetail((v) => !v)}
              aria-expanded={detail}
              className="mt-2 inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-bold text-imperia-cream underline-offset-4 hover:underline md:hidden"
            >
              {detail ? "Thu gọn" : "Xem chi tiết khoản vay"}
              <span aria-hidden="true" className={`transition-transform ${detail ? "rotate-180" : ""}`}>⌄</span>
            </button>
            <div className="mt-auto pt-[clamp(10px,2svh,24px)]">
              <p className={`text-[13px] leading-relaxed text-white/90 ${detail ? "" : "max-md:hidden"}`}>
                {t("loan.note")}
              </p>
              <Button variant="light" onClick={onLead} className="mt-[clamp(10px,2svh,20px)] w-full">
                {t("loan.cta")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
