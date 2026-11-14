export const ITEMS_PER_COL = 5;

export const COLS_PER_SLIDE = 2;

export const AUTO_SLIDE_MS = 10000;

/* ============================================================
   44 tiện ích nội khu trên sơ đồ tổng mặt bằng mới (public/assets/utility.webp, 16:9).
   Nhóm, thứ tự và tên theo trang tiện ích của chủ đầu tư (discovery.imperiasensapark.vn/utility).
   Toạ độ % tính trên ảnh gốc (left = từ mép trái, top = từ mép trên):
   - Cao tầng ngoài trời + trong nhà: lấy nguyên từ element trang chủ đầu tư (ảnh 1920×1080, object-cover → % trùng ảnh gốc).
   - Thấp tầng + cảnh quan chung: đo trên ảnh chụp trang đó (khớp ảnh gốc, tương quan 0,93; quy đổi x/1915,2 · (y−4)/1077,3).
   `no` = số hiển thị trong nhóm (01, 02…); `id` = khoá duy nhất cho trạng thái chọn.
   ============================================================ */
export const AMENITY_GROUPS = [
  { key: "ngoai-troi", label: "Ngoài trời · cao tầng", short: "Ngoài trời", color: "#15803d" },
  { key: "trong-nha", label: "Trong nhà · cao tầng", short: "Trong nhà", color: "#e8701a" },
  { key: "thap-tang", label: "Phân khu thấp tầng", short: "Thấp tầng", color: "#c98a06" },
  { key: "canh-quan", label: "Cảnh quan chung", short: "Cảnh quan", color: "#0e93ad" },
];

const p = (left, top) => ({ left: `${left}%`, top: `${top}%` });

const RAW = {
  "ngoai-troi": [
    ["Tiểu cảnh điểm nhấn", [p(32, 54.3)]],
    ["Điểm dừng đón thương mại", [p(30.2, 52.5)]],
    ["Đài phun nước Sensa", [p(30.8, 46.8)]],
    ["Sân chơi trẻ em Joy Yard", [p(28.6, 41.5)]],
    ["Nhà hàng", [p(33.6, 39.7)]],
    ["Phòng sauna", [p(32.2, 40.3)]],
    ["Phòng thay đồ", [p(30.7, 41.3)]],
    ["Hồ bơi Aura Flow", [p(38.4, 36.2)]],
    ["Khu ghế nghỉ bên hồ bơi", [p(36.8, 40)]],
    ["Bể nông thư giãn", [p(40.9, 37.2)]],
    ["Bể sục Jacuzzi", [p(40.6, 33.2)]],
    ["Hồ bơi trẻ em", [p(37.7, 31.8)]],
    ["Bãi cỏ cảnh quan", [p(20.8, 50.8), p(48.7, 33.9)]],
    ["Vườn khám phá Star Garden", [p(20, 47.5)]],
    ["Vườn rau xanh", [p(19.6, 43.1)]],
    ["Sảnh dừng đón cư dân", [p(39, 25.5)]],
    ["Lối vào hầm đậu xe", [p(41.7, 21.9)]],
    ["Lối ra hầm đậu xe", [p(35, 25.3)]],
  ],
  "trong-nha": [
    ["Sảnh lobby", [p(43.7, 30.9), p(36.8, 44), p(26.5, 47.8), p(30, 35.1)]],
    ["Hộp thư cư dân", [p(37.1, 49.4), p(23.9, 50.4), p(46.3, 31.8), p(29.6, 31.7)]],
    ["Phòng gym & yoga", [p(33.8, 33.4)]],
    ["Phòng xông hơi đá muối Himalaya", [p(31.8, 33.6)]],
    ["Creative Studio", [p(33.2, 30.5)]],
    ["Phòng trẻ em Wonder Club", [p(32.1, 27.8)]],
    ["Phòng giải trí đa phương tiện", [p(30.5, 29.5)]],
    ["Business lounge & coworking space", [p(27.2, 33.8)]],
    ["Phòng họp", [p(28.1, 31.3)]],
    ["Thư viện", [p(25.5, 35.1)]],
  ],
  "thap-tang": [
    ["Sân bóng rổ", [p(57.2, 28.8)]],
    ["Hồ bơi", [p(61.2, 28.5)]],
    ["Khu thư giãn bên hồ bơi", [p(63.3, 30.4)]],
    ["Phòng thay đồ", [p(65.4, 28.5)]],
    ["Sân chơi trẻ em", [p(46.7, 75.3)]],
    ["Sân thể thao đa năng Vibe Court", [p(42.9, 75.6)]],
    ["Đường dạo cảnh quan", [p(44.4, 78.7)]],
  ],
  "canh-quan": [
    ["Hồ điều hòa Sensa Lake", [p(73.3, 54.2)]],
    ["Sàn ngắm hoàng hôn Sunset Deck", [p(72.2, 30.6), p(72.7, 46.6), p(72.8, 63.5)]],
    ["Đường dạo bộ ven hồ", [p(71.2, 41.4)]],
    ["Khu BBQ ngoài trời", [p(70.6, 25.9)]],
    ["Khu thể dục ngoài trời Fit Zone", [p(56.6, 73.8)]],
    ["Bãi cỏ đa năng", [p(69.6, 19.9)]],
    ["Đường dạo Green Walk", [p(64.5, 71.9)]],
    ["Chòi nghỉ Pavilion", [p(70.3, 22.7), p(69.3, 70.2)]],
    ["Nhà trẻ", [p(31.4, 72.3)]],
  ],
};

let nextId = 1;
export const AMENITIES = AMENITY_GROUPS.flatMap((g) =>
  RAW[g.key].map(([name, position], i) => ({ id: nextId++, no: i + 1, group: g.key, color: g.color, name: [name], position })),
);
