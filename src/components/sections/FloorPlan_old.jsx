import { useState } from "react";
import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
export default function FloorPlan({ plans }) {
  const keys = Object.keys(plans);
  const [active, setActive] = useState("2pn");
  const p = plans[active];
  return (
    <section
      id="mat-bang"
      data-section="floor-plan"
      className="section-y bg-imperia-dark text-white"
    >
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <SectionHeading
              light
              title="Không gian tối ưu cho từng nhu cầu sống."
              subtitle="Khám phá các loại hình căn hộ và lựa chọn không gian phù hợp."
            />
            <div className="mb-8 flex flex-wrap gap-2" role="tablist">
              {keys.map((k) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={active === k}
                  onClick={() => setActive(k)}
                  className={`rounded-full border px-5 py-2.5 text-xs font-bold transition ${active === k ? "border-imperia-beige bg-imperia-beige text-imperia-primary shadow-lg" : "border-white/25 bg-transparent text-white/70 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10"}`}
                >
                  {plans[k].label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
              {[
                ["area", "Diện tích"],
                ["bedrooms", "Phòng ngủ"],
                ["bathrooms", "Phòng tắm"],
                ["balcony", "Ban công"],
              ].map(([key, label]) => (
                <div key={key} className="bg-white/[.04] p-5">
                  <strong className="font-display text-2xl text-imperia-accent">
                    {p[key]}
                  </strong>
                  <span className="mt-1 block text-xs text-white/50">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button href="#lien-he" variant="light">
                Xem chi tiết mặt bằng
              </Button>
            </div>
          </div>
          <div
            data-cms-field="floorPlanImage"
            className="grid min-h-[520px] place-items-center rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.06),rgba(169,181,120,.08))] text-xs uppercase tracking-widest text-white/30"
          >
            FLOOR PLAN IMAGE — {p.label}
          </div>
        </div>
      </div>
    </section>
  );
}
