/**
 * ============================================================================
 *  FloorPlan.jsx — bản chuyển đổi Tailwind CSS của MatBangTang.jsx, cập nhật
 *  overlay bằng toạ độ polygon THẬT của mặt bằng Sensa A (viewBox 2444×1728)
 *  gộp với dữ liệu diện tích/loại hình từ JSON — xem sensaAFloorData.js.
 *
 *  Cần truyền ảnh mặt bằng thật qua prop `imageSrc` (đúng tỉ lệ viewBox
 *  2444×1728, preserveAspectRatio="none" nên ảnh PHẢI đúng tỉ lệ, không thì
 *  polygon sẽ lệch khỏi vị trí căn hộ thật trên ảnh).
 *
 *  Hành vi giữ nguyên bản gốc MatBangTang.jsx:
 *  - Hover/click 1 zone hoặc 1 legend chip (loại hình) → zone liên quan
 *    "sáng" lên (is-active), phần còn lại mờ đi (is-dimmed).
 *  - Panel chi tiết hiện diện tích GFA/NFA — đóng khi click ra ngoài.
 *  - Viền zone "marching ants" (stroke-dashoffset chạy) thay cho hiệu ứng
 *    "thở" (breathe) cũ — theo đúng phong cách file SVG gốc bạn gửi.
 *    Cần thêm keyframes `zoneMarch` + animation `zone-march` vào
 *    tailwind.config.js (xem file đính kèm).
 * ============================================================================
 */

import React, { useEffect, useMemo, useState } from "react";
import {
  UNITS,
  ZONES,
  UNIT_TYPE_LEGEND,
  PROJECT_META,
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
} from "../../data/sensaAFloorData";

export default function FloorPlan({
  imageSrc, // BẮT BUỘC — đường dẫn ảnh mặt bằng thật, tỉ lệ đúng 2444:1728
  imageAlt = "Mặt bằng tầng điển hình Sensa A",
  units = UNITS,
  zones = ZONES,
  legend = UNIT_TYPE_LEGEND,
  meta = PROJECT_META,
  onSelectUnit,
}) {
  const [hoverCode, setHoverCode] = useState(null);
  const [hoverType, setHoverType] = useState(null);
  const [pinned, setPinned] = useState(false);

  const unitByCode = useMemo(
    () => Object.fromEntries(units.map((u) => [u.unit_code, u])),
    [units],
  );
  const legendByKey = useMemo(
    () => Object.fromEntries(legend.map((l) => [l.key, l])),
    [legend],
  );

  const activeUnit = hoverCode ? unitByCode[hoverCode] : null;
  const activeTypeKey = activeUnit ? activeUnit.type : hoverType;
  const isSelectionActive = Boolean(hoverCode || hoverType);
  const showPanel = Boolean(activeUnit) || Boolean(hoverType);

  const closePanel = () => {
    setPinned(false);
    setHoverCode(null);
    setHoverType(null);
  };

  useEffect(() => {
    if (!pinned) return;
    const onDocClick = () => closePanel();
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [pinned]);

  const handleZoneEnter = (code) => () => {
    if (pinned) return;
    setHoverCode(code);
    setHoverType(null);
  };
  const handleZoneLeave = () => {
    if (pinned) return;
    setHoverCode(null);
  };
  const handleZoneClick = (unit) => (e) => {
    e.stopPropagation();
    if (pinned && hoverCode === unit.unit_code) {
      closePanel();
      return;
    }
    setHoverCode(unit.unit_code);
    setHoverType(null);
    setPinned(true);
    onSelectUnit?.(unit);
  };

  const handleLegendEnter = (key) => () => {
    if (pinned) return;
    setHoverType(key);
    setHoverCode(null);
  };
  const handleLegendLeave = () => {
    if (pinned) return;
    setHoverType(null);
  };
  const handleLegendClick = (key) => (e) => {
    e.stopPropagation();
    if (pinned && hoverType === key) {
      closePanel();
      return;
    }
    setHoverType(key);
    setHoverCode(null);
    setPinned(true);
  };

  return (
    <section className="section-y bg-imperia-cream">
      <div className="container-page">
        {/* Heading */}
        <div className="mb-10 max-w-3xl">
          <span className="eyebrow">
            {meta.tower} — {meta.floorType}
          </span>
          <h2 className="section-title">Mặt bằng tầng điển hình</h2>
          <p className="section-subtitle">
            {meta.totalLayouts} căn hộ mỗi tầng, chia thành 5 loại hình. Di
            chuột hoặc chạm vào từng căn trên mặt bằng để xem diện tích chi
            tiết.
          </p>
        </div>

        {/* Legend theo loại hình — lọc/soi sáng cả nhóm zone cùng loại */}
        <div className="mb-8 flex flex-wrap gap-2">
          {legend.map((l) => {
            const isActive = activeTypeKey === l.key;
            const isDimmed = isSelectionActive && !isActive;
            return (
              <button
                key={l.key}
                type="button"
                onMouseEnter={handleLegendEnter(l.key)}
                onMouseLeave={handleLegendLeave}
                onFocus={handleLegendEnter(l.key)}
                onBlur={handleLegendLeave}
                onClick={handleLegendClick(l.key)}
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[.08em] transition-all duration-300",
                  isActive
                    ? "border-imperia-primary bg-imperia-primary text-white shadow-soft"
                    : "border-imperia-primary/20 bg-white text-imperia-black",
                  isDimmed ? "opacity-35" : "opacity-100",
                ].join(" ")}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: l.swatch }}
                />
                {l.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Mặt bằng thật + overlay polygon */}
          <div className="relative overflow-hidden rounded-2xl leading-none shadow-soft">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={imageAlt}
                width={VIEWBOX_WIDTH}
                height={VIEWBOX_HEIGHT}
                className="block h-auto w-full select-none"
                draggable={false}
              />
            ) : (
              <div
                className="flex items-center justify-center bg-imperia-beige/40 text-sm text-imperia-black/60"
                style={{ aspectRatio: `${VIEWBOX_WIDTH} / ${VIEWBOX_HEIGHT}` }}
              >
                Thiếu prop <code className="mx-1 font-mono">imageSrc</code> —
                truyền ảnh mặt bằng thật (tỉ lệ {VIEWBOX_WIDTH}×{VIEWBOX_HEIGHT}
                )
              </div>
            )}

            <svg
              className="absolute inset-0 h-full w-full"
              viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
              preserveAspectRatio="none"
            >
              {zones.map((unit) => {
                const isActive =
                  hoverCode === unit.unit_code ||
                  (!hoverCode && hoverType === unit.type);
                const isDimmed = isSelectionActive && !isActive;
                return (
                  <polygon
                    key={unit.unit_code}
                    points={unit.points}
                    tabIndex={0}
                    role="button"
                    aria-label={`${unit.unit_code} — ${legendByKey[unit.type]?.label || unit.type}`}
                    onMouseEnter={handleZoneEnter(unit.unit_code)}
                    onMouseLeave={handleZoneLeave}
                    onFocus={handleZoneEnter(unit.unit_code)}
                    onBlur={handleZoneLeave}
                    onClick={handleZoneClick(unit)}
                    className={[
                      "cursor-pointer stroke-[2.5] [stroke-linejoin:round] [vector-effect:non-scaling-stroke] outline-none transition-[fill-opacity,opacity] duration-200",
                      isActive
                        ? "fill-current opacity-100 [fill-opacity:.55]"
                        : "animate-zone-march fill-current opacity-90 [fill-opacity:.3] [stroke-dasharray:10_6]",
                      isDimmed ? "!opacity-20 ![fill-opacity:.08]" : "",
                    ].join(" ")}
                    style={{
                      color: unit.color,
                      stroke: unit.color,
                    }}
                  >
                    <title>{unit.unit_code}</title>
                  </polygon>
                );
              })}
            </svg>
          </div>

          {/* Panel chi tiết */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            {showPanel ? (
              <div className="animate-pop-in rounded-2xl border border-imperia-primary/15 bg-white p-6 shadow-card">
                {activeUnit ? (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-2xl font-semibold text-imperia-primary">
                        {activeUnit.unit_code}
                      </span>
                      <span
                        className="h-4 w-4 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: activeUnit.color }}
                      />
                    </div>
                    <dl className="space-y-3 text-sm">
                      <Row
                        label="Loại hình"
                        value={
                          legendByKey[activeUnit.type]?.label || activeUnit.type
                        }
                      />
                      <Row
                        label="Số phòng ngủ"
                        value={activeUnit.bedrooms ?? "—"}
                      />
                      <Row
                        label="Diện tích tim tường (GFA)"
                        value={`${activeUnit.gfa_sqm} m²`}
                      />
                      <Row
                        label="Diện tích thông thủy (NFA)"
                        value={`${activeUnit.nfa_sqm} m²`}
                      />
                    </dl>
                    <button
                      type="button"
                      onClick={closePanel}
                      className="btn-base btn-outline mt-6 w-full"
                    >
                      Đóng
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-lg font-semibold text-imperia-primary">
                      {legendByKey[hoverType]?.label}
                    </p>
                    <p className="text-sm text-[#64675c]">
                      {units.filter((u) => u.type === hoverType).length} căn
                      thuộc loại hình này trên mỗi tầng.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-imperia-primary/20 p-6 text-sm text-[#64675c]">
                Chọn một căn hộ hoặc loại hình để xem diện tích chi tiết.
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-black/5 pb-2">
      <dt className="text-[#64675c]">{label}</dt>
      <dd className="font-semibold text-imperia-black">{value}</dd>
    </div>
  );
}
