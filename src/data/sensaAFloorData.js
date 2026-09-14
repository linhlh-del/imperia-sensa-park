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
 *  - Sensa B: ĐÃ có toạ độ polygon (ZONE_GEOMETRY_B, quy đổi từ SVG gốc mới
 *    nhất viewBox 1536×1024 sang 2444×1728) và dữ liệu căn hộ trong
 *    RAW_UNITS_B.
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
    const geometryCode = u.unit_code.toLowerCase();
    const geo =
      zoneGeometry[geometryCode] ||
      zoneGeometry[geometryCode.replace(/\.0(?=\d)/, ".")];

    let labelTop;
    let labelLeft;
    if (geo?.label) {
      // Override thủ công — dùng đúng % đã khai báo sẵn trong data.
      labelTop = geo.label.top;
      labelLeft = geo.label.left;
    } else if (geo?.points) {
      const centroid = getPolygonCentroid(geo.points);
      const [lx, ly] = u.unit_code.startsWith("B.")
        ? centroid
        : computeLabelPoint(
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
      // Với các căn có nhiều mặt bằng theo tầng (vd Duplex B.3, B.12B):
      // mảng đầy đủ [{level, color, points}], FloorPlan.jsx cần đọc field
      // này để vẽ thêm polygon phụ. Nếu FloorPlan.jsx chưa hỗ trợ, chỉ
      // `points` (tầng 1) ở trên được vẽ, `floors` bị bỏ qua vô hại.
      floors: geo?.floors || null,
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
 *  Toạ độ polygon lấy từ SVG mặt bằng Sensa B do bạn cung cấp (viewBox gốc
 *  1536×1024, bản cập nhật mới nhất — thay cho bản 1492×1054 trước đó), đã
 *  quy đổi tuyến tính (scale riêng trục X, trục Y) sang viewBox chuẩn dự án
 *  2444×1728:
 *    scaleX = 2444 / 1536 ≈ 1.591146
 *    scaleY = 1728 / 1024 = 1.6875
 *  Màu giữ nguyên theo mã hex gốc trong SVG (không ép về đúng COLOR_CODES,
 *  giống cách làm của Sensa A).
 *
 *  GHI CHÚ QUAN TRỌNG:
 *  1) B.3 và B.12B là Duplex có mặt bằng KHÁC NHAU giữa tầng dưới và tầng
 *     trên (đã xác nhận với bạn). Mỗi entry trong ZONE_GEOMETRY_B của 2
 *     căn này có thêm field `floors: [{level, color, points}, ...]` chứa
 *     đủ toạ độ cả 2 tầng, bên cạnh field `points` (= tầng 1, giữ để
 *     tương thích ngược). buildUnits() đã truyền field `floors` này ra
 *     unit object — NHƯNG FloorPlan.jsx cần được cập nhật thêm để thực sự
 *     vẽ 2 <polygon> cho unit có `floors` (hiện tại nếu chưa sửa, nó vẫn
 *     chỉ vẽ được `points` = tầng 1, không lỗi nhưng thiếu tầng 2).
 *     -> Gửi mình FloorPlan.jsx để mình sửa phần render cho khớp.
 *  2) `bedrooms` / `gfa_sqm` / `nfa_sqm` trong RAW_UNITS_B bên dưới lấy từ
 *     số liệu bạn đã cung cấp trước đó (không phải suy đoán từ màu nữa).
 *     Label của các căn B được tự động tính theo centroid polygon và
 *     chuyển sang phần trăm top/left.
 * ========================================================================== */

const ZONE_GEOMETRY_B = {
  "b.1": {
    color: "#90c7ee",
    label: { top: "37.38%", left: "60%" },
    points: "1712.7,596.5 1807.2,598.2 1809.0,695.1 1712.7,693.2",
  },
  "b.2": {
    color: "#a09f64",
    label: { top: "14%", left: "62%" },
    points:
      "1640.0,347.5 1805.6,351.2 1809.0,591.1 1695.8,593.0 1692.3,489.0 1667.0,487.2 1668.8,463.9 1643.3,465.8",
  },
  // Duplex — B.3 có 2 mặt bằng khác nhau theo tầng (tầng dưới/tầng trên).
  // `points` = tầng 1 (dùng làm hình chính, tương thích ngược với code cũ
  // chỉ đọc `points`). `floors` = đầy đủ cả 2 tầng, dùng khi FloorPlan.jsx
  // được cập nhật để vẽ nhiều polygon / 1 căn (xem ghi chú cuối file).
  "b.3": {
    color: "#84b3a7",
    label: { top: "14%", left: "85%" },
    points:
      "1871.3,347.5 2023.5,349.3 2025.1,603.6 1846.0,601.9 1844.5,431.7 1874.8,433.5",
    floors: [
      {
        level: 1,
        color: "#84b3a7",
        points:
          "1871.3,347.5 2023.5,349.3 2025.1,603.6 1846.0,601.9 1844.5,431.7 1874.8,433.5",
      },
      {
        level: 2,
        color: "#84b4a8",
        points:
          "2112.9,345.8 2278.5,349.3 2276.8,607.3 2086.0,607.3 2086.0,433.5 2116.4,433.5",
      },
    ],
  },
  "b.3a": {
    color: "#e6cfc0",
    label: { top: "40.26%", left: "88%" },
    points:
      "1849.4,607.3 1972.7,609.0 1974.5,661.0 2004.8,662.9 2003.1,768.5 1928.8,766.6 1930.5,781.0 1847.8,782.8",
  },
  "b.5": {
    color: "#e6d1c2",
    label: { top: "50.66%", left: "88%" },
    points:
      "1846.0,782.8 1927.2,782.8 1928.8,802.6 2008.2,800.7 2011.7,917.2 1979.5,917.2 1977.8,967.3 1851.1,967.3",
  },
  "b.6": {
    color: "#dfc8ba",
    label: { top: "61.45%", left: "88%" },
    points:
      "1851.1,970.8 1979.5,970.8 1977.8,1028.2 2009.9,1028.2 2009.9,1135.7 1930.5,1135.7 1930.5,1155.4 1852.9,1151.9",
  },
  "b.7": {
    color: "#e8d4c6",
    label: { top: "71.86%", left: "88%" },
    points:
      "1847.8,1155.4 1930.5,1151.9 1928.8,1171.5 2006.6,1176.9 2009.9,1279.0 1972.7,1279.0 1972.7,1329.1 1851.1,1329.1",
  },
  "b.8": {
    color: "#9e8779",
    label: { top: "82.71%", left: "88%" },
    points:
      "1852.9,1332.8 2018.4,1330.9 2023.5,1483.1 1999.8,1486.9 1999.8,1531.6 1852.9,1529.7",
  },
  "b.9": {
    color: "#e5cfc0",
    label: { top: "90%", left: "70.40%" },
    points:
      "1618.0,1359.6 1812.3,1359.6 1814.1,1499.3 1683.9,1499.3 1682.3,1468.8 1616.4,1467.1",
  },
  "b.10": {
    color: "#e7d2c4",
    label: { top: "90%", left: "62.09%" },
    points:
      "1417.1,1357.8 1612.9,1363.2 1612.9,1468.8 1592.7,1467.1 1592.7,1499.3 1476.3,1502.9 1472.8,1468.8 1418.8,1467.1",
  },
  "b.11": {
    color: "#ddc5b5",
    label: { top: "90%", left: "53.90%" },
    points:
      "1219.5,1359.6 1415.3,1356.1 1417.1,1465.3 1358.0,1468.8 1359.6,1499.3 1234.7,1497.5 1234.7,1427.6 1219.5,1425.9",
  },
  "b.12": {
    color: "#9f8778",
    label: { top: "90%", left: "44.42%" },
    points:
      "957.7,1357.8 1217.7,1359.6 1217.7,1452.8 1197.5,1452.8 1199.2,1495.8 957.7,1488.5",
  },
  "b.12a": {
    color: "#e0a050",
    label: { top: "90%", left: "32%" },
    points: "817.5,1356.1 954.4,1357.8 952.6,1495.8 817.5,1492.1",
  },
  // Duplex — B.12B cũng có 2 mặt bằng khác nhau theo tầng, xem giải thích ở
  // "b.3" phía trên (points = tầng 1, floors = đủ cả 2 tầng).
  "b.12b": {
    color: "#86b6a9",
    label: { top: "90%", left: "18%" },
    points:
      "667.2,1381.0 665.4,1357.8 810.7,1356.1 815.8,1502.9 584.4,1501.2 584.4,1381.0",
    floors: [
      {
        level: 1,
        color: "#86b6a9",
        points:
          "667.2,1381.0 665.4,1357.8 810.7,1356.1 815.8,1502.9 584.4,1501.2 584.4,1381.0",
      },
      {
        level: 2,
        color: "#86b6aa",
        points:
          "391.9,1357.8 390.1,1323.8 508.4,1322.0 506.8,1499.3 273.7,1499.3 271.9,1356.1",
      },
    ],
  },
  "b.15": {
    color: "#a2a164",
    label: { top: "60%", left: "26%" },
    points: "665.4,1176.9 879.9,1178.7 885.0,1327.4 665.4,1327.4",
  },
  "b.16": {
    color: "#e8d5c8",
    label: { top: "60%", left: "36%" },
    points:
      "883.4,1196.6 1016.7,1198.5 1015.2,1223.4 1081.0,1223.4 1082.6,1329.1 888.5,1325.5",
  },
  "b.17": {
    color: "#e6d0c1",
    label: { top: "64%", left: "50%" },
    points:
      "1221.2,1196.6 1358.0,1196.6 1356.3,1225.3 1413.7,1221.8 1413.7,1329.1 1226.3,1329.1",
  },
  "b.18": {
    color: "#d7c0b0",
    label: { top: "66%", left: "58%" },
    points:
      "1417.1,1221.8 1472.8,1221.8 1472.8,1196.6 1594.5,1194.8 1591.0,1252.1 1611.4,1255.7 1614.7,1329.1 1417.1,1329.1",
  },
  "b.19": {
    color: "#e6d1c1",
    label: { top: "64%", left: "65%" },
    points:
      "1810.6,1212.6 1734.7,1209.1 1734.7,1189.3 1680.6,1189.3 1680.6,1082.0 1707.6,1080.2 1707.6,1028.2 1810.6,1028.2",
  },
  "b.20": {
    color: "#e5cfc0",
    label: { top: "53%", left: "65%" },
    points:
      "1685.7,841.9 1810.6,838.4 1814.1,1026.3 1705.9,1028.2 1705.9,974.5 1687.3,972.7",
  },
};

// Dữ liệu thô 20 căn Sensa B.
const RAW_UNITS_B = [
  {
    unit_code: "B.01",
    type: "STUDIO",
    bedrooms: 0,
    gfa_sqm: 35.2,
    nfa_sqm: 31.9,
  },
  {
    unit_code: "B.02",
    type: "3PN",
    bedrooms: 3,
    gfa_sqm: 120.3,
    nfa_sqm: 109.6,
  },
  {
    unit_code: "B.03",
    type: "DUPLEX",
    bedrooms: null,
    gfa_sqm: 191.3,
    nfa_sqm: 173.9,
  },
  {
    unit_code: "B.03A",
    type: "2PN",
    bedrooms: 2,
    gfa_sqm: 70.1,
    nfa_sqm: 63.8,
  },
  { unit_code: "B.05", type: "2PN", bedrooms: 2, gfa_sqm: 70.1, nfa_sqm: 63.8 },
  { unit_code: "B.06", type: "2PN", bedrooms: 2, gfa_sqm: 70.1, nfa_sqm: 63.8 },
  { unit_code: "B.07", type: "2PN", bedrooms: 2, gfa_sqm: 70.1, nfa_sqm: 63.8 },
  { unit_code: "B.08", type: "3PN", bedrooms: 3, gfa_sqm: 91.3, nfa_sqm: 83.2 },
  { unit_code: "B.09", type: "2PN", bedrooms: 2, gfa_sqm: 70.2, nfa_sqm: 63.8 },
  { unit_code: "B.10", type: "2PN", bedrooms: 2, gfa_sqm: 70.1, nfa_sqm: 63.8 },
  { unit_code: "B.11", type: "2PN", bedrooms: 2, gfa_sqm: 70.1, nfa_sqm: 63.8 },
  { unit_code: "B.12", type: "2PN", bedrooms: 2, gfa_sqm: 82.4, nfa_sqm: 75.5 },
  {
    unit_code: "B.12A",
    type: "1PN+",
    bedrooms: 1,
    gfa_sqm: 52.6,
    nfa_sqm: 48.8,
  },
  {
    unit_code: "B.12B",
    type: "DUPLEX",
    bedrooms: null,
    gfa_sqm: 193.8,
    nfa_sqm: 175.5,
  },
  {
    unit_code: "B.15",
    type: "3PN",
    bedrooms: 3,
    gfa_sqm: 104.2,
    nfa_sqm: 95.4,
  },
  { unit_code: "B.16", type: "2PN", bedrooms: 2, gfa_sqm: 70.4, nfa_sqm: 63.8 },
  { unit_code: "B.17", type: "2PN", bedrooms: 2, gfa_sqm: 70.4, nfa_sqm: 63.8 },
  { unit_code: "B.18", type: "2PN", bedrooms: 2, gfa_sqm: 70.4, nfa_sqm: 63.8 },
  { unit_code: "B.19", type: "2PN", bedrooms: 2, gfa_sqm: 70.4, nfa_sqm: 63.8 },
  { unit_code: "B.20", type: "2PN", bedrooms: 2, gfa_sqm: 70.4, nfa_sqm: 63.8 },
];

export const UNITS_B = buildUnits(RAW_UNITS_B, ZONE_GEOMETRY_B);
export const ZONES_B = UNITS_B.filter((u) => u.points);
export const LABELS_B = UNITS_B.reduce((labels, unit) => {
  labels[unit.unit_code] = {
    top: unit.labelTop,
    left: unit.labelLeft,
  };
  return labels;
}, {});

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
