import React, { useEffect, useMemo, useRef, useState } from "react";
import { img, t } from "../../cms/content";
import {
  TOWERS,
  UNIT_TYPE_LEGEND,
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
} from "../../data/sensaAFloorData";

/* Ảnh đại diện mỗi LOẠI HÌNH (hiện khi hover/bấm chip loại hình, chưa chọn căn cụ thể) — trước trỏ tới
   studio.png/1pn.png/2pn.png/3pn.png, các file này không tồn tại trong public/assets/aparments (ảnh vỡ).
   Lấy lại từ ảnh căn cụ thể đã có sẵn (UNIT_LAYOUT_IMAGES bên dưới), chọn 1 căn tiêu biểu mỗi loại hình. */
const LAYOUT_IMAGES = {
  STUDIO: "/assets/aparments/B01.optimized.webp", // B.01 — căn Studio
  "1PN+": "/assets/aparments/A03.optimized.webp", // A.03 — căn 1PN+
  "2PN": "/assets/aparments/2PN-70-4m2.optimized.webp", // tiêu biểu 2PN
  "3PN": "/assets/aparments/A08.optimized.webp", // A.08 — căn 3PN
  DUPLEX: "/assets/aparments/B-DUPLEX.optimized.webp",
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

// --- Dropdown chọn loại hình (thay cho dải chip trước đây) — cùng hàng với TowerSelect,
// gộp lại để nhường chỗ cho panel chi tiết ở ngay bên dưới. ---
function TypeSelect({ types, value, onChange }) {
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

  const current = types.find((l) => l.key === value);

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
        className="inline-flex min-h-12 items-center gap-2 rounded-full border border-imperia-primary/25 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[.08em] text-imperia-black shadow-soft transition-colors duration-300 hover:border-imperia-primary/50"
      >
        {current ? (
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10"
            style={{ backgroundColor: current.swatch }}
          />
        ) : null}
        {current?.label || "Tất cả loại hình"}
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
          className="absolute left-0 top-full z-20 mt-2 min-w-[220px] overflow-hidden rounded-2xl border border-imperia-primary/15 bg-white py-1.5 shadow-card"
        >
          <li role="option" aria-selected={!value}>
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className={[
                "flex min-h-12 w-full items-center px-4 py-2.5 text-left text-xs font-bold uppercase tracking-[.06em] transition-colors duration-200",
                !value
                  ? "bg-imperia-background-dark text-white"
                  : "text-imperia-black hover:bg-imperia-cream",
              ].join(" ")}
            >
              Tất cả loại hình
            </button>
          </li>
          {types.map((l) => (
            <li key={l.key} role="option" aria-selected={l.key === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(l.key);
                  setOpen(false);
                }}
                className={[
                  "flex min-h-12 w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-[.06em] transition-colors duration-200",
                  l.key === value
                    ? "bg-imperia-background-dark text-white"
                    : "text-imperia-black hover:bg-imperia-cream",
                ].join(" ")}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: l.swatch }}
                  />
                  {l.label}
                </span>
                <span className="whitespace-nowrap font-normal normal-case tracking-normal text-current/70">
                  {l.count} căn
                </span>
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
  onLead, // mở popup đăng ký — CTA "Nhận báo giá" trong panel chi tiết
}) {
  const mapRef = useRef(null);
  const panelRef = useRef(null);
  const sheetRef = useRef(null); // bottom-sheet chi tiết (điện thoại)
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
  /* khung hiển thị theo tỉ lệ ẢNH THẬT của tháp đang xem (xem ghi chú ở TOWERS trong sensaAFloorData.js) —
     không phải tỉ lệ toạ độ zone dùng chung, để ảnh luôn lấp đầy khung (không letterbox) và zone không lệch. */
  const imgW = towerData.imageWidth || VIEWBOX_WIDTH;
  const imgH = towerData.imageHeight || VIEWBOX_HEIGHT;
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

  // Bảng tóm tắt loại hình của tháp đang xem (hiện khi chưa chọn căn): số căn/tầng + khoảng diện tích
  const typeSummary = useMemo(
    () =>
      legend
        .map((l) => {
          const list = units.filter((u) => u.type === l.key);
          const gfa = list.map((u) => u.gfa_sqm).filter(Number.isFinite);
          return {
            ...l,
            count: list.length,
            min: gfa.length ? Math.min(...gfa) : null,
            max: gfa.length ? Math.max(...gfa) : null,
          };
        })
        .filter((row) => row.count > 0),
    [legend, units],
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
    // bottom-sheet vừa mở che lên căn → trình duyệt bắn mouseleave; không được bỏ chọn căn đang xem
    if (pinned || sheetRef.current?.open) return;
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
    revealPanel();
  };

  /* Hiện chi tiết sau khi chạm căn / loại hình:
     - điện thoại / máy tính bảng (< 1024px): mở bottom-sheet (mặt bằng giữ nguyên khung, section vừa 1 màn hình)
     - máy tính: panel ở cột phải, không cần làm gì */
  const revealPanel = () => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      if (!sheetRef.current?.open) sheetRef.current?.showModal();
      return;
    }
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
    revealPanel();
  };
  /* Dropdown loại hình ở đầu section (TypeSelect) — key=null ("Tất cả loại hình") đóng panel về
     bảng tóm tắt; khác handleLegendClick (dùng cho dòng trong bảng tóm tắt) ở chỗ không toggle-off
     khi bấm lại cùng loại, vì dropdown đã tự đóng và hiện rõ lựa chọn đang chọn. */
  const handleTypeSelect = (key) => {
    if (key == null) {
      closePanel();
      return;
    }
    setHoverType(key);
    setHoverCode(null);
    setPinned(true);
    revealPanel();
  };

  const floorLabel = (floor) => `Tầng ${floor}`;

  /* Nội dung panel bên cạnh / bên dưới mặt bằng.
     3 trạng thái: chi tiết 1 căn · tổng quan 1 loại hình · (mặc định) bảng tóm tắt các loại hình.
     Mặc định không còn ô trống — khách thấy ngay số căn & diện tích từng loại. */
  const cardClass =
    "rounded-2xl border border-imperia-primary/15 bg-white p-4 shadow-card md:p-5";
  const ctaLabel = activeUnit
    ? `Nhận báo giá căn ${activeUnit.unit_code}`
    : "Nhận bảng giá & chính sách";
  const cta = onLead ? (
    <button
      type="button"
      onClick={() => {
        closePanel();
        sheetRef.current?.close();
        onLead();
      }}
      className="btn-base btn-primary mt-3 w-full"
    >
      {ctaLabel}
    </button>
  ) : null;

  const renderPanel = () => {
    if (activeUnit) {
      const typeLabel = legendByKey[activeUnit.type]?.label || activeUnit.type;
      return (
        <div key="unit" className={`${cardClass} animate-pop-in`}>
          {/* Bỏ dòng "Tháp Sensa X" (lặp lại TowerSelect) và dòng "Loại hình" (lặp lại TypeSelect)
              phía trên — cả hai dropdown đầu section đã cho biết đang xem tháp/loại hình nào. */}
          <div className="mb-2.5 flex items-start justify-between gap-3">
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-2xl font-semibold leading-tight text-imperia-primary">
                {activeUnit.unit_code}
              </span>
              {activeItem?.floor ? (
                <span className="rounded-full bg-imperia-background-dark px-2.5 py-1 text-xs font-bold uppercase tracking-[.06em] text-white">
                  {floorLabel(activeItem.floor)}
                </span>
              ) : null}
            </p>
            {pinned ? (
              <button
                type="button"
                onClick={closePanel}
                aria-label="Bỏ chọn căn"
                className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-xl text-[#64675c] transition-colors hover:bg-imperia-cream"
              >
                ×
              </button>
            ) : (
              <span
                className="mt-1 h-4 w-4 shrink-0 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: activeItem?.color || activeUnit.color }}
              />
            )}
          </div>
          <dl className="space-y-1.5 text-sm">
            <Row label="Số phòng ngủ" value={activeUnit.bedrooms ?? "—"} />
            <Row label="Diện tích tim tường (GFA)" value={`${activeUnit.gfa_sqm} m²`} />
            <Row label="Diện tích thông thủy (NFA)" value={`${activeUnit.nfa_sqm} m²`} />
          </dl>
          {activeItem?.floor ? (
            <p className="mt-2 text-xs leading-relaxed text-[#64675c]">
              Căn Duplex gồm Tầng 1 và Tầng 2 — diện tích trên là tổng của cả căn.
            </p>
          ) : null}
          {activeLayoutImage ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-imperia-primary/10 bg-imperia-cream/40">
              <img
                key={activeLayoutImage}
                src={activeLayoutImage}
                alt={`Phối cảnh layout căn ${activeUnit.unit_code} (${typeLabel})${activeItem?.floor ? ` — ${floorLabel(activeItem.floor)}` : ""}`}
                className="mx-auto block aspect-[4/3] max-h-[420px] w-full object-contain"
                loading="lazy"
              />
            </div>
          ) : null}
          {cta}
        </div>
      );
    }

    if (hoverType) {
      const row = typeSummary.find((r) => r.key === hoverType);
      return (
        <div key="type" className={`${cardClass} animate-pop-in`}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-lg font-semibold text-imperia-primary">
              {legendByKey[hoverType]?.label}
            </p>
            {pinned ? (
              <button
                type="button"
                onClick={closePanel}
                aria-label="Bỏ chọn loại hình"
                className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-xl text-[#64675c] transition-colors hover:bg-imperia-cream"
              >
                ×
              </button>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-[#64675c]">
            {row?.count || 0} căn mỗi tầng · {towerData.label}
            {row?.min != null
              ? ` · ${row.min === row.max ? row.min : `${row.min}–${row.max}`} m² GFA`
              : ""}
          </p>
          {activeLayoutImage ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-imperia-primary/10 bg-imperia-cream/40">
              <img
                key={activeLayoutImage}
                src={activeLayoutImage}
                alt={`Phối cảnh layout ${legendByKey[hoverType]?.label || hoverType}`}
                className="mx-auto block aspect-[4/3] max-h-[420px] w-full object-contain"
                loading="lazy"
              />
            </div>
          ) : null}
          {cta}
        </div>
      );
    }

    return (
      <div key="summary" className={cardClass}>
        <p className="text-xs font-bold uppercase tracking-[.12em] text-[#64675c]">
          {towerData.label} · {meta.totalLayouts} căn / tầng
        </p>
        <table className="mt-3 w-full text-sm">
          <thead className="sr-only">
            <tr>
              <th>Loại hình</th>
              <th>Số căn mỗi tầng</th>
              <th>Diện tích GFA</th>
            </tr>
          </thead>
          <tbody>
            {typeSummary.map((row) => (
              <tr key={row.key} className="border-b border-black/5 last:border-0">
                <td className="py-2.5">
                  <button
                    type="button"
                    onClick={handleLegendClick(row.key)}
                    className="inline-flex min-h-8 items-center gap-2 font-semibold text-imperia-black hover:text-imperia-primary"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                      style={{ backgroundColor: row.swatch }}
                    />
                    {row.label}
                  </button>
                </td>
                <td className="py-2.5 text-right tabular-nums text-[#64675c]">
                  {row.count} căn
                </td>
                <td className="whitespace-nowrap py-2.5 pl-3 text-right tabular-nums font-semibold text-imperia-black">
                  {row.min == null
                    ? "—"
                    : row.min === row.max
                      ? `${row.min} m²`
                      : `${row.min}–${row.max} m²`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs leading-relaxed text-[#64675c]">
          <span className="lg:hidden">Chạm vào một căn trên mặt bằng để xem chi tiết.</span>
          <span className="hidden lg:inline">Di chuột hoặc bấm vào một căn trên mặt bằng để xem chi tiết.</span>
        </p>
        {cta}
      </div>
    );
  };

  return (
    <section id="mat-bang" className="section-y bg-imperia-cream">
      <div className="container-page">
        {/* BỐ CỤC
            < 1024px: tiêu đề → bộ lọc → mặt bằng → panel (xếp dọc).
            ≥ 1024px: mặt bằng bên trái (khung CỐ ĐỊNH theo tỉ lệ ảnh), cột phải TỰ CAO theo đúng
            nội dung (tiêu đề, bộ lọc, panel) — không ép bằng chiều cao ảnh nữa: khi chọn 1 căn, panel
            có thêm ảnh layout nên cần nhiều chỗ hơn hẳn bảng tóm tắt mặc định; ép bằng chiều cao ảnh
            từng làm ảnh layout + thông số bị cắt, phải cuộn mới thấy hết trong khi ảnh mặt bằng bên
            trái (self-start, không giãn theo hàng grid) còn dư rất nhiều khoảng trắng.
            Cột phải dùng `contents` dưới 1024px để các khối con tự xếp theo `order`. */}
        <div className="floor-grid grid grid-cols-1 gap-6 lg:items-start lg:gap-10">
        <div className="contents lg:flex lg:flex-col lg:gap-5">
        {/* Heading — bỏ subtitle (đã dư thừa khi loại hình chuyển qua dropdown bên dưới) để panel
            chi tiết được đẩy lên sát ngay dưới, đỡ phí chỗ so với ảnh mặt bằng bên trái. */}
        <div className="order-1 lg:order-none">
          <h2 className="section-title lg:!text-[clamp(30px,2.6vw,44px)]">
            {t("floor.title")}
          </h2>
        </div>

        {/* Dropdown chọn tháp + dropdown chọn loại hình — NGANG HÀNG, cùng kiểu với nhau (trước là
            dải chip loại hình chiếm nguyên 1-2 hàng riêng, nay gộp vào 1 dropdown cho gọn). */}
        <div className="order-2 flex flex-wrap items-center gap-3 lg:order-none">
          <TowerSelect
            towers={towers}
            value={activeTower}
            onChange={handleTowerChange}
          />
          <TypeSelect types={typeSummary} value={activeTypeKey} onChange={handleTypeSelect} />
        </div>

          {/* Panel chi tiết — desktop: chiếm phần còn lại của cột phải, cuộn bên trong.
              Bấm trong panel không đóng panel (chặn click lan ra document). */}
          <aside
            ref={panelRef}
            data-hide-floating
            onClick={(e) => e.stopPropagation()}
            /* Khoá cứng khung này — bảng tóm tắt / loại hình / 1 căn cụ thể cao khác nhau, nhưng
               khung luôn giữ nguyên 1 chiều cao (đủ cho trạng thái cao nhất) để đổi qua lại không
               làm cả khối nhảy theo, chỉ nội dung bên trong đổi. lg:max-h là lưới an toàn cho màn
               rất thấp (hiếm khi cần cuộn). */
            className="order-4 max-lg:hidden lg:order-none lg:flex lg:h-[600px] lg:max-h-[85vh] lg:flex-col lg:overflow-y-auto lg:overscroll-contain lg:pr-1 [scrollbar-width:thin]"
          >
            {renderPanel()}
          </aside>
          {/* điện thoại / máy tính bảng: thanh 1 dòng mở bottom-sheet bảng tổng hợp / chi tiết căn */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sheetRef.current?.showModal();
            }}
            aria-haspopup="dialog"
            className="order-4 flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border border-imperia-primary/15 bg-white px-4 text-left shadow-soft lg:hidden"
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-imperia-primary">
                {activeUnit ? `${activeUnit.unit_code} · ${legendByKey[activeUnit.type]?.label || activeUnit.type}` : `${towerData.label} · ${meta.totalLayouts} căn / tầng`}
              </span>
              <span className="block truncate text-xs text-[#5c5f53]">Chạm vào căn trên mặt bằng để xem chi tiết</span>
            </span>
            <span className="shrink-0 text-xs font-bold uppercase tracking-[.08em] text-imperia-primary">Bảng tổng hợp ↑</span>
          </button>
        </div>

          {/* Mặt bằng thật + overlay polygon.
              KHUNG CỐ ĐỊNH: aspect-ratio đúng bằng ẢNH THẬT của tháp đang xem (imgW/imgH, có thể khác nhau
              giữa Sensa A và B) + self-start → không bao giờ bị hàng grid kéo giãn, ảnh luôn lấp đầy khung
              (không letterbox). SVG viewBox vẫn theo hệ toạ độ zone dùng chung (VIEWBOX_WIDTH×HEIGHT) —
              preserveAspectRatio="none" kéo giãn đều để khớp đúng khung ảnh thật này.
              Không dùng overflow-hidden: chip label có thể lấn sát mép ảnh. */}
          <div
            ref={mapRef}
            /* Tailwind biên dịch class tĩnh lúc build → không thể nhúng imgW/imgH (biến runtime) thẳng vào
               arbitrary value. Truyền qua 2 custom property (--fmap-ratio-w/h) rồi dùng trong calc() tĩnh. */
            className="relative order-3 self-start leading-none shadow-soft max-lg:mx-auto max-lg:w-full max-lg:max-w-[calc(var(--fmap-h)*var(--fmap-ratio-w)/var(--fmap-ratio-h))] [--fmap-h:32svh] md:[--fmap-h:40svh] lg:order-first"
            style={{ aspectRatio: `${imgW} / ${imgH}`, '--fmap-ratio-w': imgW, '--fmap-ratio-h': imgH }}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={`${imageAlt} — ${towerData.label}`}
                width={imgW}
                height={imgH}
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
                className="block h-full w-full cursor-zoom-in select-none rounded-2xl bg-white object-contain"
                draggable={false}
              />
            ) : (
              <div
                className="flex items-center justify-center rounded-2xl bg-imperia-beige/40 text-sm text-imperia-black/60"
                style={{ aspectRatio: `${imgW} / ${imgH}` }}
              >
                Thiếu ảnh mặt bằng cho{" "}
                <strong className="mx-1">{towerData.label}</strong>— truyền qua
                prop{" "}
                <code className="mx-1 font-mono">images.{activeTower}</code>
                (tỉ lệ {imgW}×{imgH})
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
                  const floorSuffix = it.floor ? ` — Tầng ${it.floor}` : "";

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

            {/* Chip label — NỔI NGOÀI polygon. Căn thường: "A.05". Căn Duplex tách từng tầng:
                "A.18 · T1", "A.18 · T2". Ẩn dưới 640px: nhãn quá dày sẽ chồng lên nhau — trên mobile
                chạm thẳng vào căn (vùng polygon) hoặc bấm "Phóng to". Chip chỉ đổi màu + scale từ tâm
                (transform), không đổi kích thước layout → không đẩy phần tử nào. */}
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
                    "absolute inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-[''] whitespace-nowrap rounded-full border px-2 py-1 text-xs font-bold uppercase leading-none lg:px-2.5 tracking-[.03em] backdrop-blur-sm transition-[transform,background-color,color,opacity,box-shadow] duration-300 max-sm:hidden",
                    isActive
                      ? "z-20 scale-110 border-imperia-primary bg-imperia-background-dark text-white shadow-soft"
                      : "z-10 border-imperia-primary/25 bg-white/90 text-imperia-black",
                    isDimmed ? "!opacity-25" : "opacity-100",
                  ].join(" ")}
                >
                  <span
                    className="h-2 w-2 shrink-0 max-lg:hidden rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: it.color }}
                  />
                  {it.labelText}
                  {it.floor ? ` · T${it.floor}` : null}
                </button>
              );
            })}

            {/* Phóng to — luôn có (mobile không còn nhãn, desktop muốn xem rõ chi tiết) */}
            {imageSrc ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFloorPlanLightbox(true);
                }}
                aria-label={`Phóng to mặt bằng ${towerData.label}`}
                className="absolute right-3 top-3 z-30 inline-flex min-h-11 items-center gap-2 rounded-full bg-imperia-black/70 px-3.5 text-xs font-bold uppercase tracking-[.06em] text-white backdrop-blur-sm transition-colors hover:bg-imperia-black/85"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Phóng to
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom-sheet (< 1024px): <dialog> gốc — Esc / chạm nền / nút Đóng để đóng; đóng thì bỏ chọn căn */}
      <dialog
        ref={sheetRef}
        aria-label={`Chi tiết mặt bằng — ${towerData.label}`}
        onClose={closePanel}
        onClick={(e) => {
          e.stopPropagation(); // không để click lan ra document (đang ghim chọn căn)
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="imp-sheet m-0 mt-auto max-h-[85svh] w-full max-w-none overflow-y-auto rounded-t-[24px] border-0 bg-imperia-cream p-0 pb-[env(safe-area-inset-bottom)] backdrop:bg-imperia-black/50 md:mx-auto md:max-w-[640px] lg:hidden"
      >
        <div className="sticky top-0 z-10 flex justify-end bg-imperia-cream px-4 pt-3">
          <button
            type="button"
            onClick={() => sheetRef.current?.close()}
            className="btn-base btn-outline min-h-11 px-4"
          >
            Đóng
          </button>
        </div>
        <div className="px-4 pb-5 pt-2">{renderPanel()}</div>
      </dialog>

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
    <div className="flex items-center justify-between border-b border-black/5 pb-1.5">
      <dt className="text-[#64675c]">{label}</dt>
      <dd className="font-semibold text-imperia-black">{value}</dd>
    </div>
  );
}
