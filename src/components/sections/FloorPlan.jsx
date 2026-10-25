import React, { useEffect, useMemo, useRef, useState } from "react";
import { img, t } from "../../cms/content";
import {
  TOWERS,
  UNIT_TYPE_LEGEND,
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
} from "../../data/sensaAFloorData";

const LAYOUT_IMAGES = {
  STUDIO: "/assets/aparments/studio.png",
  "1PN+": "/assets/aparments/1pn.png",
  "2PN": "/assets/aparments/2pn.png",
  "3PN": "/assets/aparments/3pn.png",
  // DUPLEX: chưa có ảnh — bổ sung khi có, ví dụ: "/assets/aparments/duplex.png"
};

const UNIT_LAYOUT_IMAGES = {
  "A.01": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "A.02": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "A.03": "/assets/aparments/A03.optimized.webp",
  "A.03A": "/assets/aparments/", //CHƯA CÓ ẢNH
  "A.05": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "A.06": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "A.07": "/assets/aparments/2PN-94-9m2.optimized.webp",
  "A.08": "/assets/aparments/A08.optimized.webp",
  "A.09": "/assets/aparments/2PN -70m2.optimized.webp",
  "A.10": "/assets/aparments/2PN -70m2.optimized.webp", //CHƯA CÓ ẢNH
  "A.11": "/assets/aparments/2PN -70m2.optimized.webp",
  "A.12": "/assets/aparments/2PN -70m2.optimized.webp",
  "A.12A": "/assets/aparments/A12A.optimized.webp",
  "A.12B": "/assets/aparments/2PN -70m2.optimized.webp", //CHƯA CÓ ẢNH
  "A.15": "/assets/aparments/2PN -70m2.optimized.webp",
  "A.16": "/assets/aparments/2PN -70m2.optimized.webp", //CHƯA CÓ ẢNH
  "A.17": "/assets/aparments/2PN -70m2.optimized.webp",
  "A.19": "/assets/aparments/2PN-94-9m2.optimized.webp",
  "A.20": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "B.01": "/assets/aparments/B12A.optimized.webp",
  "B.02": "/assets/aparments/B02.optimized.webp",
  "B.03": "/assets/aparments/B03-2ND.optimized.webp",
  "B.03A": "/assets/aparments/2PN-70-1m2.optimized.webp",
  "B.05": "/assets/aparments/2PN-70-1m2.optimized.webp",
  "B.06": "/assets/aparments/2PN-70-1m2.optimized.webp",
  "B.07": "/assets/aparments/2PN-70-1m2.optimized.webp", //CHƯA CÓ ẢNH
  "B.08": "/assets/aparments/A18-1ST.optimized.webp", //CHƯA CÓ ẢNH
  "B.09": "/assets/aparments/B09.optimized.webp",
  "B.10": "/assets/aparments/2PN-70-1m2.optimized.webp",
  "B.11": "/assets/aparments/2PN-70-1m2.optimized.webp",
  "B.12": "/assets/aparments/B12.optimized.webp",
  "B.12A": "/assets/aparments/B12A.optimized.webp",
  "B.12B": "/assets/aparments/B-DUPLEX.optimized.webp",
  "B.15": "/assets/aparments/B15.optimized.webp",
  "B.16": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "B.17": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "B.18": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "B.19": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "B.20": "/assets/aparments/2PN-70-4m2.optimized.webp",
};

const UNIT_FLOOR_LAYOUT_IMAGES = {
  "A.18": {
    1: "/assets/aparments/A18-1ST.optimized.webp",
    2: "/assets/aparments/A18-2ND.optimized.webp",
  },
};

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

const BREATH_ORDER_A = [
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

const BREATH_ORDER_B = [
  "b.1",
  "b.2",
  "b.3",
  "b.3a",
  "b.5",
  "b.6",
  "b.7",
  "b.8",
  "b.9",
  "b.10",
  "b.11",
  "b.12",
  "b.12a",
  "b.12b",
  "b.15",
  "b.16",
  "b.17",
  "b.18",
  "b.19",
  "b.20",
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
        className="inline-flex min-h-12 items-center gap-2 rounded-full border border-imperia-primary bg-imperia-background-dark px-4 py-2 text-xs font-bold uppercase tracking-[.08em] text-white shadow-soft transition-colors duration-300 hover:bg-imperia-background-dark"
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
                  "flex min-h-12 w-full items-center justify-between px-4 py-2.5 text-left text-xs font-bold uppercase tracking-[.06em] transition-colors duration-200",
                  t.key === value
                    ? "bg-imperia-background-dark text-white"
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
  imageAlt = t("floor.imageAlt"),
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
  const [floorPlanLightbox, setFloorPlanLightbox] = useState(false);

  const towerData = towers[activeTower] || Object.values(towers)[0];
  const units = towerData.units;
  const zones = towerData.zones;
  const meta = towerData.meta;
  /* ảnh mặt bằng thay được trong CMS: images["floor.A"], images["floor.B"] */
  const imageSrc = img(`floor.${activeTower}`, images[activeTower]);
  const breathOrder = activeTower === "B" ? BREATH_ORDER_B : BREATH_ORDER_A;

  useEffect(() => {
    setBreathIndex(0);
    const breathTimer = window.setInterval(() => {
      setBreathIndex((current) => (current + 1) % breathOrder.length);
    }, 7000);
    return () => window.clearInterval(breathTimer);
  }, [activeTower]);

  useEffect(() => {
    if (!floorPlanLightbox) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setFloorPlanLightbox(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [floorPlanLightbox]);

  const legendByKey = useMemo(
    () => Object.fromEntries(legend.map((l) => [l.key, l])),
    [legend],
  );

  // Danh sách "mục hiển thị" trên mặt bằng. Căn thường -> 1 mục (id = mã căn,
  // vd "A.05"). Căn Duplex có `floors` (A.18, B.3, B.12B) -> TÁCH THÀNH
  // TỪNG TẦNG: "B.03-F1", "B.03-F2"... mỗi mục có polygon, chip label,
  // hover/click riêng. `unit` luôn trỏ về căn gốc để lấy diện tích, loại hình.
  const items = useMemo(
    () =>
      zones.flatMap((unit) => {
        if (unit.floors?.length > 1) {
          return unit.floors.map((f) => ({
            id: f.code,
            unit,
            floor: f.level,
            color: f.color || unit.color,
            points: f.points,
            centroid: getPolygonCentroid(f.points),
            labelTop: f.labelTop,
            labelLeft: f.labelLeft,
            labelText: unit.unit_code,
          }));
        }
        return [
          {
            id: unit.unit_code,
            unit,
            floor: null,
            color: unit.color,
            points: unit.points,
            centroid: getPolygonCentroid(unit.points),
            labelTop: unit.labelTop,
            labelLeft: unit.labelLeft,
            labelText: unit.unit_code,
          },
        ];
      }),
    [zones],
  );
  const itemById = useMemo(
    () => Object.fromEntries(items.map((it) => [it.id, it])),
    [items],
  );

  // Vị trí chip label (px theo hệ viewBox) — quy đổi ngược từ labelTop/
  // labelLeft (%) — điểm ĐẦU của leader-line nối chip -> centroid từng mục.
  const labelPositions = useMemo(() => {
    const map = {};
    items.forEach((it) => {
      if (it.labelTop == null || it.labelLeft == null) return;
      map[it.id] = [
        (parseFloat(it.labelLeft) / 100) * VIEWBOX_WIDTH,
        (parseFloat(it.labelTop) / 100) * VIEWBOX_HEIGHT,
      ];
    });
    return map;
  }, [items]);

  // hoverCode = id của mục đang chọn ("A.05" hoặc "B.03-F2").
  const activeItem = hoverCode ? itemById[hoverCode] : null;
  const activeUnit = activeItem ? activeItem.unit : null;
  const activeTypeKey = activeUnit ? activeUnit.type : hoverType;
  const isSelectionActive = Boolean(hoverCode || hoverType);
  const showPanel = Boolean(activeUnit) || Boolean(hoverType);
  // Ưu tiên ảnh riêng theo mã căn; khi hover loại hình thì dùng ảnh chung.
  const activeLayoutImage = activeUnit
    ? UNIT_FLOOR_LAYOUT_IMAGES[activeUnit.unit_code]?.[activeItem?.floor] ||
      UNIT_LAYOUT_IMAGES[activeUnit.unit_code] ||
      LAYOUT_IMAGES[activeUnit.type]
    : activeTypeKey
      ? LAYOUT_IMAGES[activeTypeKey]
      : null;

  const closePanel = () => {
    setPinned(false);
    setHoverCode(null);
    setHoverType(null);
  };

  const handleTowerChange = (key) => {
    if (key === activeTower) return;
    closePanel();
    setBreathIndex(0);
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
  const handleZoneClick = (item) => (e) => {
    e.stopPropagation();
    if (pinned && hoverCode === item.id) {
      closePanel();
      return;
    }
    setHoverCode(item.id);
    setHoverType(null);
    setPinned(true);
    onSelectUnit?.(item.unit, item.floor); // floor = null nếu căn 1 tầng
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
          <h2 className="section-title">{t("floor.title")}</h2>
          <p className="section-subtitle">
            {t("floor.subtitle", { n: meta.totalLayouts })}
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
            <span className="hidden h-6 w-px bg-imperia-background-dark/15 sm:block" />
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
                    "inline-flex min-h-12 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[.08em] transition-all duration-300",
                    isActive
                      ? "border-imperia-primary bg-imperia-background-dark text-white shadow-soft"
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
              LƯU Ý: bỏ `overflow-hidden` ở wrapper này — vì chip label nằm
              NGOÀI polygon, có thể lấn ra sát mép ảnh; overflow-hidden ở đây
              sẽ cắt mất chip. Bo góc được chuyển xuống từng lớp con (ảnh +
              svg) thay vì clip cả khối. */}
          <div className="relative leading-none shadow-soft">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={`${imageAlt} — ${towerData.label}`}
                width={VIEWBOX_WIDTH}
                height={VIEWBOX_HEIGHT}
                loading="lazy"
                decoding="async"
                role="button"
                tabIndex={0}
                onClick={() => setFloorPlanLightbox(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setFloorPlanLightbox(true);
                  }
                }}
                className="block h-auto w-full cursor-zoom-in select-none rounded-2xl"
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
                {/* Leader-line: nối chip label (nằm ngoài zone) về tâm polygon
                    — vẽ trước polygon để nằm dưới nét viền. Mỗi tầng Duplex
                    có chip + leader-line riêng. */}
                {items.map((it) => {
                  const isActive =
                    hoverCode === it.id ||
                    (!hoverCode && hoverType === it.unit.type);
                  const isDimmed = isSelectionActive && !isActive;
                  const [cx, cy] = it.centroid;
                  const [lx, ly] = labelPositions[it.id] || [cx, cy];

                  return (
                    <line
                      key={`leader-${it.id}`}
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
                        stroke: it.color,
                        strokeWidth: isActive ? 2.5 : 1.5,
                        strokeDasharray: isActive ? "none" : "7 6",
                        vectorEffect: "non-scaling-stroke",
                        filter: isActive
                          ? `drop-shadow(0 0 6px ${it.color})`
                          : undefined,
                      }}
                    />
                  );
                })}

                {items.map((it) => {
                  const { unit } = it;
                  const isActive =
                    hoverCode === it.id ||
                    (!hoverCode && hoverType === unit.type);
                  const isDimmed = isSelectionActive && !isActive;
                  const borderColor = darkenHexColor(it.color);
                  const isBreathing =
                    !isSelectionActive &&
                    unit.unit_code.toLowerCase() === breathOrder[breathIndex];
                  const floorSuffix = it.floor ? ` — Floor ${it.floor}` : "";

                  return (
                    <polygon
                      key={it.id}
                      points={it.points}
                      tabIndex={0}
                      role="button"
                      aria-label={`${unit.unit_code} — ${legendByKey[unit.type]?.label || unit.type}${floorSuffix}`}
                      onMouseEnter={handleZoneEnter(it.id)}
                      onMouseLeave={handleZoneLeave}
                      onFocus={handleZoneEnter(it.id)}
                      onBlur={handleZoneLeave}
                      onClick={handleZoneClick(it)}
                      className={[
                        "cursor-pointer stroke-[1.5] [stroke-linejoin:round] [vector-effect:non-scaling-stroke] outline-none transition-[fill-opacity,opacity,filter,stroke-width] duration-300",
                        isActive
                          ? "fill-current opacity-100 [fill-opacity:.06]"
                          : "fill-current opacity-90 [fill-opacity:.12]",
                        isActive ? "[stroke-width:2.25]" : "",
                        isBreathing
                          ? activeTower === "B"
                            ? "animate-[zoneBreathPulse_2000ms_ease-in-out_infinite]"
                            : "animate-zone-breath-pulse"
                          : "",
                        isDimmed ? "!opacity-20 ![fill-opacity:.03]" : "",
                      ].join(" ")}
                      style={{
                        color: it.color,
                        stroke: isBreathing ? it.color : borderColor,
                        filter: isActive
                          ? `drop-shadow(0 0 5px ${borderColor})`
                          : undefined,
                      }}
                    >
                      <title>{`${unit.unit_code}${floorSuffix}`}</title>
                    </polygon>
                  );
                })}
              </svg>
            )}

            {/* Chip label — NỔI NGOÀI polygon. Căn thường: "A.05". Căn Duplex
                tách riêng từng tầng: "B.03-F1", "B.03-F2". Hover/click chip
                có cùng hiệu ứng active/dim với hover/click trực tiếp lên zone. */}
            {items.map((it) => {
              if (it.labelTop == null || it.labelLeft == null) return null;
              const isActive =
                hoverCode === it.id ||
                (!hoverCode && hoverType === it.unit.type);
              const isDimmed = isSelectionActive && !isActive;

              return (
                <button
                  key={`label-${it.id}`}
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  onMouseEnter={handleZoneEnter(it.id)}
                  onMouseLeave={handleZoneLeave}
                  onClick={handleZoneClick(it)}
                  style={{
                    top: it.labelTop,
                    left: it.labelLeft,
                  }}
                  className={[
                    "absolute z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.03em] backdrop-blur-sm transition-all duration-300",
                    isActive
                      ? "scale-110 border-imperia-primary bg-imperia-background-dark text-white shadow-soft"
                      : "border-imperia-primary/25 bg-white/85 text-imperia-black",
                    isDimmed ? "!opacity-25" : "opacity-100",
                  ].join(" ")}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: it.color }}
                  />
                  <span className="inline-flex items-baseline">
                    {it.labelText}
                    {it.floor ? (
                      <>
                        -{it.floor}
                        <sup className="relative -top-0.5 text-[8px] leading-none">
                          {it.floor === 1 ? "st" : it.floor === 2 ? "nd" : "th"}
                        </sup>
                        F
                      </>
                    ) : null}
                  </span>
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
                      <span className="flex items-center gap-3">
                        <span className="text-2xl font-semibold text-imperia-primary">
                          {activeUnit.unit_code}
                        </span>
                        {activeItem?.floor ? (
                          <span className="rounded-full bg-imperia-background-dark px-3 py-1 text-xs font-bold uppercase tracking-[.06em] text-white">
                            Floor {activeItem.floor}
                          </span>
                        ) : null}
                      </span>
                      <span
                        className="h-4 w-4 rounded-full ring-1 ring-black/10"
                        style={{
                          backgroundColor:
                            activeItem?.color || activeUnit.color,
                        }}
                      />
                    </div>
                    <dl className="space-y-3 text-sm">
                      <Row
                        label="Loại hình"
                        value={
                          legendByKey[activeUnit.type]?.label || activeUnit.type
                        }
                      />
                      {activeItem?.floor ? (
                        <Row
                          label="Mặt bằng"
                          value={`Floor ${activeItem.floor}`}
                        />
                      ) : null}
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
                    {activeItem?.floor ? (
                      <p className="mt-3 text-xs text-[#64675c]">
                        Căn Duplex gồm Floor 1 và Floor 2 — diện tích ở trên là
                        tổng của cả căn.
                      </p>
                    ) : null}
                    {activeLayoutImage ? (
                      <div className="mt-5 overflow-hidden rounded-xl border border-imperia-primary/10">
                        <img
                          src={activeLayoutImage}
                          alt={`Phối cảnh layout ${legendByKey[activeUnit.type]?.label || activeUnit.type}`}
                          className="block h-auto w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : null}
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
                    {activeLayoutImage ? (
                      <div className="mt-4 overflow-hidden rounded-xl border border-imperia-primary/10">
                        <img
                          src={activeLayoutImage}
                          alt={`Phối cảnh layout ${legendByKey[hoverType]?.label || hoverType}`}
                          className="block h-auto w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : null}
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

      {floorPlanLightbox && imageSrc ? (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-imperia-black/85 p-4 backdrop-blur-sm animate-[fadeInUp_0.25s_ease]"
          role="presentation"
          onClick={() => setFloorPlanLightbox(false)}
        >
          <button
            type="button"
            aria-label="Đóng ảnh mặt bằng"
            onClick={() => setFloorPlanLightbox(false)}
            className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-imperia-white/10 text-2xl text-imperia-cream transition-colors hover:bg-imperia-white/20"
          >
            ×
          </button>
          <img
            src={imageSrc}
            alt={`${imageAlt} — ${towerData.label}`}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] max-w-full animate-scale-in object-contain rounded-xl shadow-card"
          />
        </div>
      ) : null}
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
