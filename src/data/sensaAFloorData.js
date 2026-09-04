/**
 * ============================================================================
 *  DỮ LIỆU TẦNG ĐIỂN HÌNH — SENSA A
 *  Nguồn số liệu (diện tích, loại hình, số PN): sensa_a_typical_floor_
 *  layouts_with_color_codes_v2_PN.json
 *  Nguồn toạ độ polygon + màu chính xác từng căn: file SVG mặt bằng Sensa
 *  Tháp A do bạn cung cấp (viewBox 0 0 2444 1728, 20 zone data-name a.01…a.20).
 *
 *  Hai nguồn được gộp lại tại đây theo unit_code (không phân biệt hoa/thường:
 *  "A.08" ↔ "a.08"): JSON cho biết CĂN NÀY LÀ LOẠI GÌ / DIỆN TÍCH BAO NHIÊU,
 *  SVG cho biết CĂN NÀY NẰM Ở ĐÂU trên mặt bằng (points) và MÀU CHÍNH XÁC
 *  theo thiết kế gốc (ưu tiên màu từ SVG thay vì suy ra light/dark chung
 *  chung như trước, vì đây là màu thật designer đã set cho từng zone).
 *
 *  Cần cung cấp ảnh mặt bằng thật (đúng tỉ lệ viewBox 2444×1728) qua prop
 *  `imageSrc` khi dùng <FloorPlan />.
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

// Legend hiển thị trên section — 1 chip / loại hình (không tách light/dark
// ra chip riêng, chỉ dùng light/dark để tô từng ô lưới cho dễ phân biệt).
export const UNIT_TYPE_LEGEND = [
  { key: "STUDIO", label: "Studio", swatch: COLOR_CODES.STUDIO.hex },
  { key: "1PN+", label: "1PN+", swatch: COLOR_CODES["1PN+"].hex },
  { key: "2PN", label: "2 Phòng ngủ", swatch: COLOR_CODES["2PN"].dark },
  { key: "3PN", label: "3 Phòng ngủ", swatch: COLOR_CODES["3PN"].dark },
  { key: "DUPLEX", label: "Duplex", swatch: COLOR_CODES.DUPLEX.hex },
];

// Kích thước hệ toạ độ gốc của SVG mặt bằng (viewBox). Polygon points bên
// dưới lấy đúng theo hệ này — nếu đổi ảnh, phải export lại polygon theo
// đúng viewBox mới, không tự suy ra được.
export const VIEWBOX_WIDTH = 2444;
export const VIEWBOX_HEIGHT = 1728;

// Toạ độ polygon + màu CHÍNH XÁC từng zone, lấy trực tiếp từ file SVG mặt
// bằng gốc (data-name + style="--zone-color"). Key = unit_code viết thường.
const ZONE_GEOMETRY = {
  "a.08": {
    color: "#a1a777",
    points: "707.3,1477.9 563.3,1424.0 617.1,1264.8 764.7,1319.8",
  },
  "a.09": {
    color: "#ddc8b3",
    points:
      "764.7,1315.1 676.9,1280.0 693.3,1234.3 665.2,1222.6 702.6,1120.7 755.3,1137.1 760.0,1121.9 826.8,1144.1",
  },
  "a.10": {
    color: "#a79183",
    points:
      "829.1,1144.1 737.8,1114.9 742.5,1096.1 715.5,1083.2 772.9,921.6 892.3,963.8",
  },
  "a.11": {
    color: "#dbcbb4",
    points:
      "891.2,961.4 802.2,928.7 818.6,879.5 791.6,872.4 829.1,767.0 881.8,787.0 887.7,768.2 952.1,792.8",
  },
  "a.12": {
    color: "#dec9b6",
    points:
      "953.2,790.5 892.3,765.9 897.0,754.2 839.6,731.9 876.0,627.7 906.4,637.1 922.8,587.9 1013.0,619.5",
  },
  "a.12a": {
    color: "#a1a976",
    points:
      "1015.3,619.5 924.0,586.7 941.5,531.7 912.3,520.0 924.0,491.8 938.0,474.3 963.8,462.6 1014.1,462.6 1070.3,462.6 1071.5,480.1 1175.7,481.3 1180.4,590.2 1050.4,591.4 1022.3,589.0",
  },
  "a.07": {
    color: "#a59082",
    points:
      "891.2,1549.3 771.7,1508.3 788.1,1459.1 751.8,1442.8 794.0,1326.8 953.2,1384.2",
  },
  "a.06": {
    color: "#dfcab7",
    points:
      "890.0,1357.3 795.1,1324.5 856.0,1154.7 973.1,1196.8 929.8,1318.6 907.6,1312.8",
  },
  "a.05": {
    color: "#ddcbb5",
    points:
      "1022.3,1064.5 900.5,1024.7 963.8,851.4 1061.0,887.7 1043.4,934.5 1064.5,943.9",
  },
  "a.03a": {
    color: "#dec9b5",
    points:
      "1058.6,884.2 965.0,849.0 1024.7,676.9 1085.6,698.0 1080.9,716.7 1135.9,738.9 1099.6,840.8 1079.7,833.8",
  },
  "a.03": {
    color: "#d2ac66",
    points:
      "1215.6,740.1 1214.4,618.3 1345.5,618.3 1346.7,693.3 1328.0,692.1 1325.6,741.3",
  },
  "a.02": {
    color: "#ddc8b4",
    points:
      "1364.3,743.6 1363.1,693.3 1347.9,694.4 1349.1,618.3 1525.9,619.5 1527.1,721.4 1476.7,721.4 1476.7,744.8",
  },
  "a.01": {
    color: "#ddc9b7",
    points:
      "1529.4,617.2 1710.9,620.7 1709.7,742.5 1584.4,742.5 1582.1,720.2 1529.4,720.2",
  },
  "a.20": {
    color: "#dec9b6",
    points:
      "1851.4,743.6 1849.1,619.5 2031.8,619.5 2034.1,721.4 1981.4,722.5 1980.3,744.8",
  },
  "a.19": {
    color: "#a39081",
    points:
      "2035.3,619.5 2157.1,619.5 2158.3,659.3 2211.0,659.3 2211.0,787.0 2031.8,788.1",
  },
  "a.12b": {
    color: "#a69082",
    points:
      "1248.3,484.8 1335.0,482.5 1333.8,461.4 1449.8,461.4 1450.9,490.7 1468.5,491.8 1466.2,587.9 1250.7,587.9",
  },
  "a.15": {
    color: "#dec9b4",
    points:
      "1483.7,462.6 1596.2,461.4 1597.3,490.7 1650.0,495.4 1650.0,591.4 1468.5,589.0 1468.5,520.0 1483.7,520.0",
  },
  "a.16": {
    color: "#a79082",
    points:
      "1651.2,590.2 1646.5,462.6 1824.5,462.6 1826.9,495.4 1844.4,496.5 1846.8,590.2",
  },
  "a.17": {
    color: "#ddc9b8",
    points:
      "1857.3,462.6 1972.1,462.6 1975.6,494.2 2024.8,494.2 2025.9,587.9 1847.9,590.2 1846.8,520.0 1862.0,520.0",
  },
  "a.18": {
    color: "#78aaa9",
    points: "2024.8,429.8 2194.6,429.8 2194.6,591.4 2028.3,589.0",
  },
};

// Dữ liệu thô 20 căn (đúng thứ tự trong JSON = thứ tự xoay quanh tầng).
const RAW_UNITS = [
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

// Fallback nếu 1 mã căn nào đó chưa có trong ZONE_GEOMETRY (ví dụ thêm căn
// mới mà chưa cập nhật SVG) — vẫn tô được theo light/dark chung của loại hình
// thay vì crash hoặc để trắng.
const fallbackColor = (type, indexWithinType) => {
  const entry = COLOR_CODES[type];
  if (!entry) return "#CBCBCB";
  if (entry.hex) return entry.hex;
  return indexWithinType % 2 === 0 ? entry.light : entry.dark;
};

const typeCounters = {};
export const UNITS = RAW_UNITS.map((u) => {
  const i = typeCounters[u.type] ?? 0;
  typeCounters[u.type] = i + 1;
  const geo = ZONE_GEOMETRY[u.unit_code.toLowerCase()];
  return {
    ...u,
    color: geo?.color || fallbackColor(u.type, i),
    points: geo?.points || null, // null = chưa có toạ độ, sẽ không vẽ được zone
  };
});

// Alias tiện dùng khi chỉ cần mảng zone cho phần render SVG.
export const ZONES = UNITS.filter((u) => u.points);

export const PROJECT_META = {
  tower: "Sensa A",
  floorType: "Tầng điển hình",
  totalLayouts: UNITS.length,
};
