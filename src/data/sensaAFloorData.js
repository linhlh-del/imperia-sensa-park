/**
 * ============================================================================
 *  DỮ LIỆU TẦNG ĐIỂN HÌNH — SENSA A & SENSA B
 *  Nguồn số liệu (diện tích, loại hình, số PN): sensa_a_typical_floor_
 *  layouts_with_color_codes_v2_PN.json
 *  Nguồn toạ độ polygon + màu: file SVG mặt bằng do bạn cung cấp, đã quy đổi
 *  sang hệ toạ độ chuẩn của dự án (viewBox 2444×1728).
 *
 *  Cần cung cấp ảnh mặt bằng thật (đúng tỉ lệ viewBox 2444×1728) cho từng
 *  tháp qua prop `images` khi dùng <FloorPlan /> — xem FloorPlan.jsx.
 *
 *  --------------------------------------------------------------------------
 *  CẤU TRÚC NHIỀU THÁP:
 *  - Sensa A: đã có đầy đủ toạ độ polygon (ZONE_GEOMETRY_A) + dữ liệu căn
 *    (RAW_UNITS_A).
 *  - Sensa B: đang chờ toạ độ polygon mới — ZONE_GEOMETRY_B và RAW_UNITS_B
 *    để trống (mảng/obj rỗng) làm chỗ trống sẵn. Khi có dữ liệu Sensa B,
 *    chỉ cần điền vào 2 phần đó theo đúng format của Sensa A bên dưới,
 *    KHÔNG cần sửa gì ở FloorPlan.jsx hay chỗ khác.
 *  - UNIT_TYPE_LEGEND (Studio/1PN+/2PN/3PN/Duplex) dùng chung cho cả 2 tháp.
 * ============================================================================
 */

// Mã màu gốc theo color_codes trong JSON — 1 số loại có 2 sắc độ light/dark
// để phân biệt các căn liền kề cùng loại hình trên mặt bằng thật.
export const COLOR_CODES = {
  STUDIO: { label: "Studio", hex: "#95C4D6" },
  "1PN+": { label: "1PN+", hex: "#DAB274" },
  "2PN": { label: "2PN", light: "#E2DBD3", dark: "#B0A39A" },
  "3PN": { label: "3PN", light: "#ABB47D", dark: "#8D9073" },
  DUPLEX: { label: "Duplex", hex: "#7FAEA3" },
};

// Legend hiển thị trên section — 1 chip / loại hình, DÙNG CHUNG cho Sensa A
// và Sensa B (không tách light/dark ra chip riêng, chỉ dùng light/dark để
// tô từng ô lưới cho dễ phân biệt).
export const UNIT_TYPE_LEGEND = [
  { key: "STUDIO", label: "Studio", swatch: COLOR_CODES.STUDIO.hex },
  { key: "1PN+", label: "1PN+", swatch: COLOR_CODES["1PN+"].hex },
  { key: "2PN", label: "2PN", swatch: COLOR_CODES["2PN"].dark },
  { key: "3PN", label: "3PN", swatch: COLOR_CODES["3PN"].dark },
  { key: "DUPLEX", label: "Duplex", swatch: COLOR_CODES.DUPLEX.hex },
];

// Kích thước hệ toạ độ gốc của SVG mặt bằng (viewBox) — dùng chung cho cả
// 2 tháp. Polygon points bên dưới lấy đúng theo hệ này — nếu đổi ảnh, phải
// export lại polygon theo đúng viewBox mới, không tự suy ra được.
export const VIEWBOX_WIDTH = 2444;
export const VIEWBOX_HEIGHT = 1728;

// Fallback nếu 1 mã căn nào đó chưa có toạ độ trong ZONE_GEOMETRY tương ứng
// (ví dụ thêm căn mới mà chưa cập nhật SVG) — vẫn tô được theo light/dark
// chung của loại hình thay vì crash hoặc để trắng.
const fallbackColor = (type, indexWithinType) => {
  const entry = COLOR_CODES[type];
  if (!entry) return "#CBCBCB";
  if (entry.hex) return entry.hex;
  return indexWithinType % 2 === 0 ? entry.light : entry.dark;
};

/* ----------------------------------------------------------------------
 *  LABEL CHIP — vị trí NỔI RIÊNG cho từng căn, đặt ra ngoài polygon (không
 *  đè lên layout căn hộ) và nối về đúng zone bằng leader-line, giống hệt
 *  phong cách chip trong data.js (labelTop/labelLeft dạng %, xem
 *  APARTMENT_TYPES / T3_..._CHIP / T4_..._CHIP).
 *
 *  Cách tính mặc định: lấy trọng tâm (centroid) polygon của từng căn, rồi
 *  đẩy label ra xa theo đúng hướng từ "tâm mặt bằng" (trung bình cộng
 *  centroid mọi zone của tháp) -> tâm zone đó. Nhờ vậy với 1 mặt bằng dạng
 *  vòng quanh lõi thang/hành lang, label sẽ tự động bung ra phía "mặt
 *  ngoài" của từng căn thay vì chồng lên hình khối căn hộ.
 *
 *  Muốn CHỈNH TAY 1 căn cụ thể (vd. vị trí tự động bị đè lên chip khác):
 *  thêm field `label: { top: "12%", left: "83%" }` vào đúng entry trong
 *  ZONE_GEOMETRY_* — khi có field này, hệ thống dùng đúng %, KHÔNG tự tính
 *  nữa. Có thể chỉnh riêng khoảng đẩy ra bằng field `labelOffset` (số, đơn
 *  vị px theo hệ toạ độ viewBox 2444×1728), mặc định DEFAULT_LABEL_OFFSET.
 * ---------------------------------------------------------------------- */
const DEFAULT_LABEL_OFFSET = 130;
// Biên an toàn (px, theo hệ viewBox) để label không bị dính sát mép ảnh /
// bị cắt bởi khung chứa — chừa lớn hơn theo chiều ngang vì chip nằm ngang.
const LABEL_MARGIN_X = 130;
const LABEL_MARGIN_Y = 90;

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// Trọng tâm polygon theo công thức shoelace — cùng công thức với
// getPolygonCentroid trong FloorPlan.jsx, để hướng đẩy label ra ngoài luôn
// khớp với vị trí zone thật hiển thị trên mặt bằng.
function getPolygonCentroid(pointsStr) {
  const pts = pointsStr
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(",").map(Number));
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
    const avgX = pts.reduce((s, p) => s + p[0], 0) / n;
    const avgY = pts.reduce((s, p) => s + p[1], 0) / n;
    return [avgX, avgY];
  }
  cx /= 6 * area;
  cy /= 6 * area;
  return [cx, cy];
}

// Đẩy điểm `centroid` ra xa theo hướng floorCenter -> centroid 1 khoảng
// offsetPx, rồi kẹp trong khung viewBox (chừa margin) để không tràn ảnh.
function computeLabelPoint(centroid, floorCenter, offsetPx) {
  const dx = centroid[0] - floorCenter[0];
  const dy = centroid[1] - floorCenter[1];
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const x = clamp(
    centroid[0] + ux * offsetPx,
    LABEL_MARGIN_X,
    VIEWBOX_WIDTH - LABEL_MARGIN_X,
  );
  const y = clamp(
    centroid[1] + uy * offsetPx,
    LABEL_MARGIN_Y,
    VIEWBOX_HEIGHT - LABEL_MARGIN_Y,
  );
  return [x, y];
}

// Ghép RAW_UNITS + ZONE_GEOMETRY thành mảng UNITS hoàn chỉnh (dùng chung
// logic cho mọi tháp). Đồng thời tự tính labelTop/labelLeft (%) cho từng
// căn — xem giải thích ở khối comment "LABEL CHIP" phía trên.
const buildUnits = (rawUnits, zoneGeometry) => {
  const typeCounters = {};

  // Tâm toàn mặt bằng của THÁP NÀY = trung bình cộng centroid mọi zone đã
  // có toạ độ — dùng làm điểm gốc để suy ra hướng "ra ngoài" cho mỗi zone.
  const allCentroids = Object.values(zoneGeometry)
    .filter((g) => g.points)
    .map((g) => getPolygonCentroid(g.points));
  const floorCenter = allCentroids.length
    ? [
        allCentroids.reduce((s, c) => s + c[0], 0) / allCentroids.length,
        allCentroids.reduce((s, c) => s + c[1], 0) / allCentroids.length,
      ]
    : [VIEWBOX_WIDTH / 2, VIEWBOX_HEIGHT / 2];

  return rawUnits.map((u) => {
    const i = typeCounters[u.type] ?? 0;
    typeCounters[u.type] = i + 1;
    const geo = zoneGeometry[u.unit_code.toLowerCase()];

    let labelTop;
    let labelLeft;
    if (geo?.label) {
      // Override thủ công — dùng đúng % đã khai báo sẵn trong data.
      labelTop = geo.label.top;
      labelLeft = geo.label.left;
    } else if (geo?.points) {
      const centroid = getPolygonCentroid(geo.points);
      const [lx, ly] = computeLabelPoint(
        centroid,
        floorCenter,
        geo.labelOffset ?? DEFAULT_LABEL_OFFSET,
      );
      labelTop = `${((ly / VIEWBOX_HEIGHT) * 100).toFixed(2)}%`;
      labelLeft = `${((lx / VIEWBOX_WIDTH) * 100).toFixed(2)}%`;
    }

    return {
      ...u,
      color: geo?.color || fallbackColor(u.type, i),
      points: geo?.points || null, // null = chưa có toạ độ, sẽ không vẽ được zone
      labelTop, // % — vị trí chip label, NGOÀI polygon, giống style data.js
      labelLeft,
    };
  });
};

/* ============================================================================
 *  THÁP A — SENSA A
 * ========================================================================== */

// Toạ độ polygon + màu từng zone, lấy từ SVG mặt bằng Sensa A (đã quy đổi về
// viewBox 2444×1728). Key = unit_code viết thường.
const ZONE_GEOMETRY_A = {
  "a.08": {
    color: "#9ca572",
    label: { top: "75%", left: "12%" },
    points: "387.7,1375.8 435.2,1213.7 582.7,1261.2 535.2,1425.0",
  },
  "a.09": {
    color: "#dcc6b1",
    label: { top: "64%", left: "15%" },
    points:
      "579.4,1261.2 490.9,1230.1 505.7,1182.6 476.2,1171.1 509.0,1063.0 563.1,1081.0 568.0,1072.8 627.0,1087.6",
  },
  "a.10": {
    color: "#a58e7f",
    label: { top: "53%", left: "17%" },
    points:
      "635.2,1087.6 548.3,1058.1 549.9,1041.7 518.8,1030.2 571.3,863.2 687.6,900.9",
  },
  "a.11": {
    color: "#d9c3ae",
    label: { top: "43%", left: "19.5%" },
    points:
      "692.5,904.1 600.8,869.7 615.5,823.9 582.7,814.0 617.1,709.2 672.9,722.3 674.5,705.9 740.1,725.6",
  },
  "a.12": {
    color: "#dbc5b1",
    label: { top: "32.5%", left: "23%" },
    points:
      "741.7,730.5 677.8,702.7 686.0,689.6 628.6,673.2 661.4,566.7 690.9,574.9 707.3,524.1 799.1,553.6",
  },
  "a.12a": {
    color: "#9ca471",
    label: { top: "18%", left: "33.5%" },
    points:
      "797.5,550.3 705.7,522.5 723.7,466.8 692.5,453.7 704.0,429.1 717.1,409.5 745.0,393.1 854.8,391.5 856.5,414.4 958.1,412.8 963.0,519.2 810.6,517.6",
  },
  "a.07": {
    color: "#a28b7c",
    label: { top: "81%", left: "35%" },
    points:
      "610.6,1274.3 768.0,1320.2 712.2,1490.5 594.2,1452.8 607.3,1402.1 574.5,1390.6",
  },
  "a.06": {
    color: "#dbc5b0",
    label: { top: "69%", left: "35.5%" },
    points:
      "659.8,1095.8 779.4,1135.1 743.4,1257.9 717.1,1251.4 707.3,1297.2 610.6,1267.7",
  },
  "a.05": {
    color: "#dac4ae",
    label: { top: "58%", left: "39%" },
    points:
      "702.4,959.8 751.6,786.2 848.3,819.0 833.5,868.1 853.2,877.9 822.0,999.1",
  },
  "a.03a": {
    color: "#dac3ae",
    label: { top: "48%", left: "41%" },
    points:
      "808.9,606.0 869.6,625.7 864.7,647.0 917.1,665.0 886.0,769.8 863.0,764.9 849.9,814.0 753.2,784.6",
  },
  "a.03": {
    color: "#d2a75e",
    label: { top: "43%", left: "44%" },
    points:
      "992.5,548.7 1122.0,548.7 1122.0,622.4 1107.3,622.4 1107.3,674.8 992.5,673.2",
  },
  "a.02": {
    color: "#dbc5b2",
    label: { top: "43%", left: "52%" },
    points:
      "1125.3,547.1 1251.5,547.1 1302.3,547.1 1304.0,651.9 1249.9,650.3 1249.9,671.5 1141.7,671.5 1143.3,620.8 1125.3,619.1",
  },
  "a.01": {
    color: "#d9c2ad",
    label: { top: "43%", left: "61%" },
    points:
      "1305.6,547.1 1484.3,548.7 1485.9,671.5 1358.1,673.2 1356.4,650.3 1304.0,648.6",
  },
  "a.20": {
    color: "#dbc5b0",
    label: { top: "43%", left: "69%" },
    points:
      "1620.3,550.3 1795.7,548.7 1799.0,650.3 1744.9,653.5 1748.2,673.2 1618.7,669.9",
  },
  "a.19": {
    color: "#a18b7c",
    label: { top: "43%", left: "85%" },
    points:
      "1799.0,548.7 1918.6,548.7 1918.6,588.0 1972.7,589.6 1971.1,715.8 1797.3,714.1",
  },
  "a.12b": {
    color: "#a48e7f",
    label: { top: "18%", left: "47%" },
    points:
      "1031.9,519.2 1028.6,416.0 1115.5,417.7 1115.5,393.1 1228.6,394.7 1228.6,425.9 1246.6,427.5 1248.2,522.5",
  },
  "a.15": {
    color: "#dcc5af",
    label: { top: "18%", left: "56%" },
    points:
      "1243.3,452.1 1263.0,452.1 1261.3,396.4 1371.2,398.0 1372.8,425.9 1420.3,427.5 1420.3,520.9 1244.9,519.2",
  },
  "a.16": {
    color: "#a48e7f",
    label: { top: "18%", left: "63%" },
    points:
      "1423.6,396.4 1595.7,396.4 1595.7,425.9 1613.8,425.9 1613.8,522.5 1423.6,520.9",
  },
  "a.17": {
    color: "#c4b0a0",
    label: { top: "18%", left: "71%" },
    points:
      "1631.8,396.4 1738.3,396.4 1741.6,425.9 1790.8,425.9 1792.4,522.5 1617.0,522.5 1615.4,452.1 1631.8,452.1",
  },
  "a.18": {
    color: "#77a9a8",
    label: { top: "18%", left: "80%" },
    points: "1789.2,370.2 1956.3,368.5 1958.0,520.9 1794.1,522.5",
  },
};

// Dữ liệu thô 20 căn Sensa A (đúng thứ tự trong JSON = thứ tự xoay quanh tầng).
const RAW_UNITS_A = [
  { unit_code: "A.01", type: "2PN", bedrooms: 2, gfa_sqm: 70.4, nfa_sqm: 63.8 },
  { unit_code: "A.02", type: "2PN", bedrooms: 2, gfa_sqm: 70.4, nfa_sqm: 63.8 },
  {
    unit_code: "A.03",
    type: "1PN+",
    bedrooms: 1,
    gfa_sqm: 52.2,
    nfa_sqm: 47.8,
  },
  {
    unit_code: "A.03A",
    type: "2PN",
    bedrooms: 2,
    gfa_sqm: 70.7,
    nfa_sqm: 63.8,
  },
  { unit_code: "A.05", type: "2PN", bedrooms: 2, gfa_sqm: 70.4, nfa_sqm: 63.8 },
  { unit_code: "A.06", type: "2PN", bedrooms: 2, gfa_sqm: 70.4, nfa_sqm: 63.8 },
  { unit_code: "A.07", type: "2PN", bedrooms: 2, gfa_sqm: 94.9, nfa_sqm: 86.4 },
  { unit_code: "A.08", type: "3PN", bedrooms: 3, gfa_sqm: 92.0, nfa_sqm: 83.8 },
  { unit_code: "A.09", type: "2PN", bedrooms: 2, gfa_sqm: 70.0, nfa_sqm: 63.7 },
  { unit_code: "A.10", type: "2PN", bedrooms: 2, gfa_sqm: 80.7, nfa_sqm: 74.3 },
  { unit_code: "A.11", type: "2PN", bedrooms: 2, gfa_sqm: 70.0, nfa_sqm: 63.7 },
  { unit_code: "A.12", type: "2PN", bedrooms: 2, gfa_sqm: 70.0, nfa_sqm: 63.7 },
  {
    unit_code: "A.12A",
    type: "3PN",
    bedrooms: 3,
    gfa_sqm: 104.4,
    nfa_sqm: 95.8,
  },
  {
    unit_code: "A.12B",
    type: "2PN",
    bedrooms: 2,
    gfa_sqm: 85.7,
    nfa_sqm: 77.8,
  },
  { unit_code: "A.15", type: "2PN", bedrooms: 2, gfa_sqm: 70.0, nfa_sqm: 63.7 },
  { unit_code: "A.16", type: "2PN", bedrooms: 2, gfa_sqm: 82.0, nfa_sqm: 75.1 },
  { unit_code: "A.17", type: "2PN", bedrooms: 2, gfa_sqm: 70.0, nfa_sqm: 63.7 },
  {
    unit_code: "A.18",
    type: "DUPLEX",
    bedrooms: null,
    gfa_sqm: 167.7,
    nfa_sqm: 151.5,
  },
  { unit_code: "A.19", type: "2PN", bedrooms: 2, gfa_sqm: 94.9, nfa_sqm: 86.4 },
  { unit_code: "A.20", type: "2PN", bedrooms: 2, gfa_sqm: 70.4, nfa_sqm: 63.8 },
];

export const UNITS_A = buildUnits(RAW_UNITS_A, ZONE_GEOMETRY_A);
export const ZONES_A = UNITS_A.filter((u) => u.points);

export const PROJECT_META_A = {
  tower: "Sensa A",
  floorType: "Tầng điển hình",
  totalLayouts: UNITS_A.length,
};

/* ============================================================================
 *  THÁP B — SENSA B
 *  TODO: đang chờ ảnh mặt bằng + toạ độ polygon từ bạn.
 *  Khi có dữ liệu:
 *  1) Điền toạ độ polygon (giống format ZONE_GEOMETRY_A ở trên) vào
 *     ZONE_GEOMETRY_B bên dưới.
 *  2) Điền danh sách căn (giống format RAW_UNITS_A ở trên) vào RAW_UNITS_B.
 *  Không cần sửa gì thêm — UNITS_B/ZONES_B/PROJECT_META_B/TOWERS sẽ tự cập
 *  nhật theo, và FloorPlan.jsx sẽ tự vẽ đúng khi người dùng chọn "Tháp
 *  Sensa B" trong dropdown.
 * ========================================================================== */

const ZONE_GEOMETRY_B = {
  // "b.01": { color: "#......", points: "x1,y1 x2,y2 ..." },
};

const RAW_UNITS_B = [
  // { unit_code: "B.01", type: "2PN", bedrooms: 2, gfa_sqm: 70.4, nfa_sqm: 63.8 },
];

export const UNITS_B = buildUnits(RAW_UNITS_B, ZONE_GEOMETRY_B);
export const ZONES_B = UNITS_B.filter((u) => u.points);

export const PROJECT_META_B = {
  tower: "Sensa B",
  floorType: "Tầng điển hình",
  totalLayouts: UNITS_B.length,
};

/* ============================================================================
 *  GỘP DỮ LIỆU NHIỀU THÁP — dùng bởi <FloorPlan /> để hiển thị dropdown
 *  chọn tháp và render đúng units/zones/label theo tháp đang chọn.
 * ========================================================================== */
export const TOWERS = {
  A: {
    key: "A",
    label: "Tháp Sensa A",
    units: UNITS_A,
    zones: ZONES_A,
    meta: PROJECT_META_A,
  },
  B: {
    key: "B",
    label: "Tháp Sensa B",
    units: UNITS_B,
    zones: ZONES_B,
    meta: PROJECT_META_B,
  },
};

// Alias tương thích ngược — mặc định trỏ về Sensa A, để không phá vỡ những
// chỗ khác trong code cũ (nếu có) đang import UNITS/ZONES/PROJECT_META trực
// tiếp thay vì qua TOWERS.
export const UNITS = UNITS_A;
export const ZONES = ZONES_A;
export const PROJECT_META = PROJECT_META_A;
