/**
 * ============================================================================
 *  FloorPlan.jsx — bản chuyển đổi Tailwind CSS của MatBangTang.jsx, cập nhật
 *  overlay bằng toạ độ polygon THẬT của mặt bằng (viewBox 2444×1728) gộp với
 *  dữ liệu diện tích/loại hình từ JSON — xem sensaAFloorData.js.
 *
 *  Hỗ trợ NHIỀU THÁP (Sensa A / Sensa B) qua export `TOWERS` trong
 *  sensaAFloorData.js — dropdown ở đầu section cho phép chuyển tháp, khi đổi
 *  tháp thì units/zones/ảnh mặt bằng đổi theo, còn legend loại hình
 *  (Studio/1PN+/2PN/3PN/Duplex) dùng chung cho cả 2 tháp nên không đổi.
 *
 *  Cần truyền ảnh mặt bằng thật qua prop `images` — object dạng
 *  { A: "url-anh-sensa-a.jpg", B: "url-anh-sensa-b.jpg" } — đúng tỉ lệ
 *  viewBox 2444×1728, preserveAspectRatio="none" nên ảnh PHẢI đúng tỉ lệ,
 *  không thì polygon sẽ lệch khỏi vị trí căn hộ thật trên ảnh.
 *
 *  Hành vi giữ nguyên bản gốc MatBangTang.jsx:
 *  - Hover/click 1 zone, 1 chip label, hoặc 1 legend chip (loại hình) → zone
 *    liên quan "sáng" lên (is-active), phần còn lại mờ đi (is-dimmed).
 *  - Panel chi tiết hiện diện tích GFA/NFA — đóng khi click ra ngoài.
 *  - Zone "thở" nhẹ (fill-opacity + halo mờ dao động) khi chưa active — cùng
 *    ngôn ngữ với .mbt__zone / @keyframes mbt-breathe trong MatBangTang.css,
 *    chỉ chậm hơn (xem animation `zone-breathe` trong tailwind.config.js).
 *
 *  MỚI:
 *  - Label mã căn (unit_code) giờ là 1 CHIP nổi NGOÀI polygon (không đè lên
 *    layout căn hộ nữa) — vị trí lấy từ labelTop/labelLeft đã tính sẵn trong
 *    sensaAFloorData.js (đẩy ra xa tâm mặt bằng theo hướng của từng zone,
 *    có thể override thủ công per-unit). 1 leader-line mảnh, cùng màu zone,
 *    nối chip về đúng tâm zone để không bị nhầm căn — giống hệt cơ chế
 *    leader-line trong MatBangTang.jsx.
 *  - Dropdown chọn tháp (Sensa A / Sensa B) đặt trước hàng legend loại hình.
 *  - Text "Tháp Sensa A" / "Tháp Sensa B" hiện ở góc trái trên của ảnh mặt
 *    bằng, đổi theo tháp đang chọn.
 * ============================================================================
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  TOWERS,
  UNIT_TYPE_LEGEND,
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
} from "../../data/sensaAFloorData";

// --- Helper: tính trọng tâm (centroid) của 1 polygon từ chuỗi "x1,y1 x2,y2 ..."
// Dùng công thức centroid chuẩn theo diện tích (shoelace) để label luôn nằm
// đúng giữa polygon, kể cả với các polygon lõm nhiều cạnh (không chỉ là
// trung bình cộng đơn giản của các đỉnh).
function parsePolygonPoints(pointsStr) {
  return pointsStr
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(",").map(Number);
      return [x, y];
    });
}

function getPolygonCentroid(pointsStr) {
  const pts = parsePolygonPoints(pointsStr);
  const n = pts.length;
  let area = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0; i < n; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % n];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }

  area *= 0.5;

  if (area === 0) {
    const avgX = pts.reduce((sum, point) => sum + point[0], 0) / n;
    const avgY = pts.reduce((sum, point) => sum + point[1], 0) / n;
    return [avgX, avgY];
  }

  cx /= 6 * area;
  cy /= 6 * area;
  return [cx, cy];
}

function darkenHexColor(color, amount = 0.65) {
  const hex = color.replace("#", "");
  if (!/^[\da-f]{6}$/i.test(hex)) return color;

  return `#${[0, 2, 4]
    .map((offset) => {
      const channel = parseInt(hex.slice(offset, offset + 2), 16);
      return Math.round(channel * (1 - amount))
        .toString(16)
        .padStart(2, "0");
    })
    .join("")}`;
}

const BREATH_ORDER = [
  "a.08",
  "a.07",
  "a.09",
  "a.06",
  "a.10",
  "a.05",
  "a.11",
  "a.03a",
  "a.12",
  "a.12a",
  "a.03",
  "a.12b",
  "a.02",
  "a.15",
  "a.01",
  "a.16",
  "a.17",
  "a.20",
  "a.18",
  "a.19",
];

// --- Dropdown chọn tháp (Sensa A / Sensa B) ---
function TowerSelect({ towers, value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const towerList = Object.values(towers);
  const current = towers[value] || towerList[0];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-imperia-primary bg-imperia-primary px-4 py-2 text-xs font-bold uppercase tracking-[.08em] text-white shadow-soft transition-colors duration-300 hover:bg-imperia-dark"
      >
        {current?.label}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-20 mt-2 min-w-[180px] overflow-hidden rounded-2xl border border-imperia-primary/15 bg-white py-1.5 shadow-card"
        >
          {towerList.map((t) => (
            <li key={t.key} role="option" aria-selected={t.key === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(t.key);
                  setOpen(false);
                }}
                className={[
                  "flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-bold uppercase tracking-[.06em] transition-colors duration-200",
                  t.key === value
                    ? "bg-imperia-primary text-white"
                    : "text-imperia-black hover:bg-imperia-cream",
                ].join(" ")}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function FloorPlan({
  images = {}, // BẮT BUỘC — { A: "url-anh-sensa-a.jpg", B: "url-anh-sensa-b.jpg" }, tỉ lệ đúng 2444:1728
  imageAlt = "Mặt bằng tầng điển hình",
  towers = TOWERS,
  defaultTower = "A",
  legend = UNIT_TYPE_LEGEND,
  onSelectUnit,
}) {
  const [activeTower, setActiveTower] = useState(defaultTower);
  const [hoverCode, setHoverCode] = useState(null);
  const [hoverType, setHoverType] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [breathIndex, setBreathIndex] = useState(0);

  const towerData = towers[activeTower] || Object.values(towers)[0];
  const units = towerData.units;
  const zones = towerData.zones;
  const meta = towerData.meta;
  const imageSrc = images[activeTower];

  useEffect(() => {
    setBreathIndex(0);
    const breathTimer = window.setInterval(() => {
      setBreathIndex((current) => (current + 1) % BREATH_ORDER.length);
    }, 7000);
    return () => window.clearInterval(breathTimer);
  }, [activeTower]);

  const unitByCode = useMemo(
    () => Object.fromEntries(units.map((u) => [u.unit_code, u])),
    [units],
  );
  const legendByKey = useMemo(
    () => Object.fromEntries(legend.map((l) => [l.key, l])),
    [legend],
  );
  // Trọng tâm từng polygon — dùng làm điểm ĐẦU CUỐI (đích) cho leader-line,
  // vì label giờ không còn nằm giữa zone nữa (xem labelPositions bên dưới).
  const centroids = useMemo(() => {
    const map = {};
    zones.forEach((z) => {
      map[z.unit_code] = getPolygonCentroid(z.points);
    });
    return map;
  }, [zones]);

  // Vị trí chip label (px theo hệ viewBox) — quy đổi ngược từ labelTop/
  // labelLeft (%) đã tính sẵn trong sensaAFloorData.js, dùng làm điểm ĐẦU
  // cho leader-line nối chip -> centroid zone.
  const labelPositions = useMemo(() => {
    const map = {};
    zones.forEach((z) => {
      if (z.labelTop == null || z.labelLeft == null) return;
      map[z.unit_code] = [
        (parseFloat(z.labelLeft) / 100) * VIEWBOX_WIDTH,
        (parseFloat(z.labelTop) / 100) * VIEWBOX_HEIGHT,
      ];
    });
    return map;
  }, [zones]);

  const activeUnit = hoverCode ? unitByCode[hoverCode] : null;
  const activeTypeKey = activeUnit ? activeUnit.type : hoverType;
  const isSelectionActive = Boolean(hoverCode || hoverType);
  const showPanel = Boolean(activeUnit) || Boolean(hoverType);

  const closePanel = () => {
    setPinned(false);
    setHoverCode(null);
    setHoverType(null);
  };

  const handleTowerChange = (key) => {
    if (key === activeTower) return;
    closePanel();
    setActiveTower(key);
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
    <section id="mat-bang" className="section-y bg-imperia-cream">
      <div className="container-page">
        {/* Heading */}
        <div className="mb-10 max-w-4xl">
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

        {/* Dropdown chọn tháp + Legend theo loại hình — lọc/soi sáng cả nhóm
            zone cùng loại. Legend dùng chung cho mọi tháp nên không đổi khi
            chuyển tháp. */}
        <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="w-full sm:w-auto">
            <TowerSelect
              towers={towers}
              value={activeTower}
              onChange={handleTowerChange}
            />
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <span className="hidden h-6 w-px bg-imperia-primary/15 sm:block" />
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
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Mặt bằng thật + overlay polygon.
              LƯU Ý: bỏ `overflow-hidden` ở wrapper này (khác bản cũ) — vì
              chip label giờ nằm NGOÀI polygon, có thể lấn ra sát mép ảnh;
              overflow-hidden ở đây sẽ cắt mất chip. Bo góc được chuyển
              xuống từng lớp con (ảnh + svg) thay vì clip cả khối. */}
          <div className="relative leading-none shadow-soft">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={`${imageAlt} — ${towerData.label}`}
                width={VIEWBOX_WIDTH}
                height={VIEWBOX_HEIGHT}
                className="block h-auto w-full select-none rounded-2xl"
                draggable={false}
              />
            ) : (
              <div
                className="flex items-center justify-center rounded-2xl bg-imperia-beige/40 text-sm text-imperia-black/60"
                style={{ aspectRatio: `${VIEWBOX_WIDTH} / ${VIEWBOX_HEIGHT}` }}
              >
                Thiếu ảnh mặt bằng cho{" "}
                <strong className="mx-1">{towerData.label}</strong>— truyền qua
                prop{" "}
                <code className="mx-1 font-mono">images.{activeTower}</code>
                (tỉ lệ {VIEWBOX_WIDTH}×{VIEWBOX_HEIGHT})
              </div>
            )}

            {zones.length === 0 ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-imperia-black/10 text-center text-sm font-semibold text-imperia-black/70">
                Dữ liệu mặt bằng {towerData.label} đang được cập nhật.
              </div>
            ) : (
              <svg
                className="absolute inset-0 h-full w-full rounded-2xl"
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                preserveAspectRatio="none"
              >
                {/* Leader-line: nối chip label (nằm ngoài zone) về đúng tâm
                    zone — vẽ trước polygon để nằm dưới, không đè lên nét
                    viền zone. Cùng ngôn ngữ với .mbt__leader-line trong
                    MatBangTang, chỉ khác là màu lấy trực tiếp theo từng căn. */}
                {zones.map((unit) => {
                  const isActive =
                    hoverCode === unit.unit_code ||
                    (!hoverCode && hoverType === unit.type);
                  const isDimmed = isSelectionActive && !isActive;
                  const [cx, cy] = centroids[unit.unit_code] || [0, 0];
                  const [lx, ly] = labelPositions[unit.unit_code] || [cx, cy];

                  return (
                    <line
                      key={`leader-${unit.unit_code}`}
                      x1={lx}
                      y1={ly}
                      x2={cx}
                      y2={cy}
                      className={[
                        "pointer-events-none transition-[opacity,stroke-width] duration-300",
                        isActive ? "opacity-100" : "opacity-45",
                        isDimmed ? "!opacity-10" : "",
                      ].join(" ")}
                      style={{
                        stroke: unit.color,
                        strokeWidth: isActive ? 2.5 : 1.5,
                        strokeDasharray: isActive ? "none" : "7 6",
                        vectorEffect: "non-scaling-stroke",
                        filter: isActive
                          ? `drop-shadow(0 0 6px ${unit.color})`
                          : undefined,
                      }}
                    />
                  );
                })}

                {zones.map((unit) => {
                  const isActive =
                    hoverCode === unit.unit_code ||
                    (!hoverCode && hoverType === unit.type);
                  const isDimmed = isSelectionActive && !isActive;
                  const borderColor = darkenHexColor(unit.color);
                  const isBreathing =
                    !isSelectionActive &&
                    unit.unit_code.toLowerCase() === BREATH_ORDER[breathIndex];

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
                        "cursor-pointer stroke-[1.5] [stroke-linejoin:round] [vector-effect:non-scaling-stroke] outline-none transition-[fill-opacity,opacity,filter,stroke-width] duration-300",
                        isActive
                          ? "fill-current opacity-100 [fill-opacity:.06]"
                          : "fill-current opacity-90 [fill-opacity:.12]",
                        isActive ? "[stroke-width:2.25]" : "",
                        isBreathing ? "animate-zone-breath-pulse" : "",
                        isDimmed ? "!opacity-20 ![fill-opacity:.03]" : "",
                      ].join(" ")}
                      style={{
                        color: unit.color,
                        stroke: isBreathing ? unit.color : borderColor,
                        filter: isActive
                          ? `drop-shadow(0 0 5px ${borderColor})`
                          : undefined,
                      }}
                    >
                      <title>{unit.unit_code}</title>
                    </polygon>
                  );
                })}
              </svg>
            )}

            {/* Chip label mã căn — NỔI NGOÀI polygon (không đè lên layout
                căn hộ nữa), vị trí lấy từ labelTop/labelLeft đã tính sẵn
                trong sensaAFloorData.js. Phong cách chip mượn từ legend
                chip của MatBangTang (chấm màu + pill mờ), đổi sang tông
                imperia cho khớp theme FloorPlan. Hover/click chip có cùng
                hiệu ứng active/dim với hover/click trực tiếp lên zone. */}
            {zones.map((unit) => {
              if (unit.labelTop == null || unit.labelLeft == null) return null;
              const isActive =
                hoverCode === unit.unit_code ||
                (!hoverCode && hoverType === unit.type);
              const isDimmed = isSelectionActive && !isActive;

              return (
                <button
                  key={`label-${unit.unit_code}`}
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  onMouseEnter={handleZoneEnter(unit.unit_code)}
                  onMouseLeave={handleZoneLeave}
                  onClick={handleZoneClick(unit)}
                  style={{
                    top: unit.labelTop,
                    left: unit.labelLeft,
                  }}
                  className={[
                    "absolute z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.03em] backdrop-blur-sm transition-all duration-300",
                    isActive
                      ? "scale-110 border-imperia-primary bg-imperia-primary text-white shadow-soft"
                      : "border-imperia-primary/25 bg-white/85 text-imperia-black",
                    isDimmed ? "!opacity-25" : "opacity-100",
                  ].join(" ")}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: unit.color }}
                  />
                  {unit.unit_code}
                </button>
              );
            })}
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
