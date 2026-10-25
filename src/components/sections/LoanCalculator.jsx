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
      <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
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
            className="min-h-12 w-20 rounded-lg border border-imperia-primary/20 bg-white px-2 text-right font-bold text-imperia-primary outline-none focus:border-imperia-primary"
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
        className="h-12 w-full cursor-pointer accent-imperia-primary"
      />
    </div>
  );
}

export default function LoanCalculator({ onLead }) {
  const [values, setValues] = useState(DEFAULTS);
  const set = (key) => (val) =>
    setValues((v) => ({ ...v, [key]: Number.isFinite(val) ? val : 0 }));
  const result = useMemo(() => calcLoan(values), [values]);

  return (
    <section
      id="tinh-tra-gop"
      data-section="loan-calculator"
      className="section-y bg-white"
    >
      <div className="container-page">
        <SectionHeading title={t("loan.title")} subtitle={t("loan.subtitle")} />

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Cột nhập liệu */}
          <div className="grid gap-6 rounded-[24px] border border-imperia-primary/10 bg-imperia-cream p-6 md:p-8">
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

          {/* Cột kết quả */}
          <div
            className="flex flex-col rounded-[24px] bg-imperia-background-dark p-6 text-white md:p-8"
            aria-live="polite"
          >
            <dl className="grid gap-4 text-sm">
              <div className="flex justify-between gap-4 border-b border-white/15 pb-3">
                <dt className="text-white/80">Vốn tự có cần chuẩn bị</dt>
                <dd className="font-bold">{formatBillion(result.equity)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/15 pb-3">
                <dt className="text-white/80">Số tiền vay</dt>
                <dd className="font-bold">{formatBillion(result.principal)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/15 pb-3">
                <dt className="text-white/80">
                  Trả tháng đầu (gốc đều, lãi giảm dần)
                </dt>
                <dd className="font-bold">{formatVnd(result.firstMonth)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/15 pb-3">
                <dt className="text-white/80">Trả đều mỗi tháng (niên kim)</dt>
                <dd className="font-bold">{formatVnd(result.annuity)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/80">Tổng lãi (gốc đều / niên kim)</dt>
                <dd className="text-right font-bold">
                  {formatBillion(result.decliningInterest)} /{" "}
                  {formatBillion(result.annuityInterest)}
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-xs leading-relaxed text-white/70">
              {t("loan.note")}
            </p>
            <Button variant="light" onClick={onLead} className="mt-6 w-full">
              {t("loan.cta")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
