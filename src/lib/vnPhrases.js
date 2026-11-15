/* Giữ trọn cụm từ tiếng Việt khi xuống dòng.
   Trình duyệt ngắt dòng ở mọi dấu cách, nên từ ghép nhiều âm tiết có thể bị tách ("Chính / sách bán hàng").
   Nối các âm tiết trong một cụm bằng dấu cách không ngắt dòng (U+00A0) → cụm luôn nằm cùng một dòng;
   chỗ ngắt chỉ còn GIỮA các cụm ("Chính sách / bán hàng").
   Danh sách: từ ghép và tên riêng có trên website. Cụm dài hơn được ưu tiên (sắp theo độ dài). */
const PHRASES = [
  // tên riêng, địa danh, thương hiệu
  "Imperia Sensa Park", "Sensa Park", "The Sensa Villas", "The Sensa", "Sensa A", "Sensa B", "MIK Group", "Mỹ Phú",
  "TP. Hồ Chí Minh", "Hồ Chí Minh", "Phước Long", "Võ Chí Công", "Rạch Chiếc", "Một Tấn", "Thủ Thiêm", "Thảo Điền",
  "Thủ Đức", "Long Thành", "Tân Sơn Nhất", "Global City", "Liên Phường", "Đỗ Xuân Hợp", "Mai Chí Thọ", "Nguyễn Duy Trinh",
  "Vành đai 2", "Vành đai 3", "Metro số 1", "Metro số 6", "Khu Công nghệ cao", "Công nghệ cao",
  "Aura Flow", "Joy Yard", "Star Garden", "Wonder Club", "Business Lounge", "Creative Studio", "Sunset Deck",
  "Green Walk", "Fit Zone", "Vibe Court", "Sensa Lake", "Discovery Residences", "Early Bird", "Cake by VPBank",
  "Secret Box", "Smart Home",
  // bất động sản, bán hàng
  "chính sách", "bán hàng", "thanh toán", "tiện ích", "mặt bằng", "căn hộ mẫu", "căn hộ", "bảng giá", "ưu đãi",
  "tư vấn", "khám phá", "dự án", "chi tiết", "tổng quan", "vị trí", "liên hệ", "tin tức", "chủ đầu tư", "đầu tư",
  "phát triển", "pháp lý", "quy hoạch", "sở hữu", "lâu dài", "tiến độ", "khởi công", "dự kiến", "diện tích",
  "tim tường", "thông thủy", "phòng ngủ", "phòng khách", "phòng tắm", "phòng họp", "phòng tập", "nhà bếp",
  "ban công", "lô gia", "thông tầng", "căn góc", "tầng điển hình", "loại căn", "loại hình", "nhà phố", "biệt thự",
  "song lập", "liền kề", "thấp tầng", "cao tầng", "phân khu", "tòa tháp", "hợp đồng", "mua bán", "ký quỹ",
  "giữ chỗ", "vốn tự có", "giấy chứng nhận", "chiết khấu", "ngân hàng", "giải ngân", "hỗ trợ", "lãi suất",
  "bàn giao", "trả góp", "khoản vay", "ước tính", "bảng tính", "hàng tháng", "phương thức", "phương án",
  "tài chính", "cam kết", "chính thức", "tham khảo", "minh họa", "hình ảnh", "phối cảnh", "ngoại cảnh",
  "bảo mật", "điều khoản", "điều kiện", "sử dụng", "áp dụng", "cập nhật", "công bố", "đăng ký", "thông tin",
  "điện thoại", "họ và tên", "câu hỏi", "thường gặp", "trang chủ", "xem thêm", "phóng to", "thu nhỏ",
  // không gian sống
  "cư dân", "nội khu", "ngoại khu", "cảnh quan", "đa chiều", "tổng hợp", "sống xanh", "đô thị", "hiện đại",
  "tinh tế", "cân bằng", "không gian", "thiên nhiên", "kết nối", "giao thông", "hạ tầng", "cao tốc", "sân bay",
  "trường học", "bệnh viện", "mua sắm", "giải trí", "thể thao", "vui chơi", "trẻ em", "gia đình", "thư viện",
  "đường dạo", "ven sông", "mặt nước", "công viên", "sân chơi", "nhà hàng", "thư giãn", "nghỉ dưỡng", "an ninh",
  "quản lý", "vận hành", "hồ bơi", "bể sục", "xông hơi", "bãi cỏ", "khu vực", "lựa chọn", "nhu cầu", "hành trình",
  "mật độ", "xây dựng", "đài phun nước", "phun nước", "coworking space", "Business lounge", "House of MIK", "miền Nam",
  "miền Bắc", "khai trương", "đánh dấu", "bước phát triển", "khu Đông", "chiến lược", "mở rộng", "thiết kế", "tinh thần",
  "khách hàng", "đá muối", "nhịp sống", "mỗi ngày", "tận hưởng", "riêng tư", "ánh sáng", "tự nhiên", "sinh thái",
  "trải nghiệm", "viên mãn", "toàn diện", "đặc quyền", "nổi bật", "đẳng cấp", "sang trọng", "thịnh vượng",
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const sorted = [...new Set(PHRASES)].sort((a, b) => b.length - a.length);
const PHRASE_RE = new RegExp(`(?<![\\p{L}\\p{N}])(?:${sorted.map((p) => esc(p).replace(/ /g, "\\s+")).join("|")})(?![\\p{L}\\p{N}])`, "giu");
// số + đơn vị ("100 triệu", "24 tháng", "52,2 m²"); ký hiệu nối ("& bảng giá", "— căn hộ") dính vào từ kế tiếp
const NUM_UNIT_RE = /(\d[\d.,]*)\s+(tỷ|triệu|tr|ha|m²|m2|căn|tháng|ngày|phút|km|tầng|năm|người|PN|WC)(?![\p{L}])/giu;
const JOINER_RE = /(^|\s)([&+])\s+/g; // "& bảng giá": dính vào từ sau
const TRAIL_RE = /\s+([·–—/|])(?=\s)/g; // "Thấp tầng · Nhà phố": dấu phân cách dính vào từ trước → dòng mới không bắt đầu bằng dấu
const CITY_RE = /\s+(TP\.\s?HCM|TP\.\s?Hồ Chí Minh|Việt Nam)(?![\p{L}])/gu; // tên thành phố cuối câu không đứng một mình
const NBSP = " ";

/** Trả về chuỗi đã nối các âm tiết trong từng cụm bằng NBSP (không đổi nội dung đọc được) */
export function gluePhrases(text) {
  if (!text || text.length < 3 || !/\s/.test(text)) return text;
  return text
    .replace(PHRASE_RE, (m) => m.replace(/\s+/g, NBSP))
    .replace(NUM_UNIT_RE, (_, n, u) => `${n}${NBSP}${u}`)
    .replace(JOINER_RE, (_, pre, j) => `${pre}${j}${NBSP}`)
    .replace(TRAIL_RE, (_, j) => `${NBSP}${j}`)
    .replace(CITY_RE, (_, c) => `${NBSP}${c.replace(/\s+/g, NBSP)}`);
}
