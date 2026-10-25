/* ============================================================
   CHỮ GIAO DIỆN MẶC ĐỊNH — mọi chữ sửa được trong CMS mà không nằm trong src/data/project.js.
   Component đọc qua t('khoá') (src/cms/content.js). Khoá kết thúc bằng ".seo" là heading chứa từ khoá (ẩn, cho SEO).
   Danh sách nhiều mục: mỗi dòng một mục (đọc bằng tList).
   ============================================================ */
const UI = {
  // Hero
  'hero.h1Seo': '— căn hộ MIK Group tại phường Phước Long, TP. Hồ Chí Minh (khu vực Phước Long B cũ, trước đây thuộc TP. Thủ Đức), mặt tiền đường Võ Chí Công',
  'hero.ctaExplore': 'Khám phá dự án',
  'hero.ctaPrice': 'Nhận bảng giá',

  // Tổng quan
  'overview.seo': 'Tổng quan dự án căn hộ Imperia Sensa Park',
  'overview.cta': 'Khám phá tiện ích →',
  'overview.imageAlt': 'Không gian Imperia Sensa Park',

  // Vị trí
  'location.seo': 'Vị trí Imperia Sensa Park tại phường Phước Long, TP. Hồ Chí Minh (khu vực Phước Long B cũ, trước đây thuộc TP. Thủ Đức), mặt tiền đường Võ Chí Công',
  'location.cta': 'Xem vị trí & tư vấn',
  'location.imageAlt': 'Bản đồ vị trí Imperia Sensa Park',

  // Tiện ích (bản đồ)
  'amenities.title': 'TỔ HỢP TIỆN ÍCH ĐA CHIỀU',
  'amenities.subtitle': 'Dẫn lối đa thế hệ cư dân bước vào hành trình tận hưởng cuộc sống viên mãn toàn diện; vườn thiền, dạo bộ, thưởng trà, bi-a, lounge, sân chơi trẻ em,..',
  'amenities.mapAlt': 'Sơ đồ vị trí các tiện ích tại Imperia Sensa Park',

  // Tiện ích nổi bật (thư viện ảnh)
  'featured.title': 'Tiện ích nổi bật',

  // Mặt bằng
  'floor.title': 'Mặt bằng tầng điển hình',
  'floor.subtitle': '{n} căn hộ mỗi tầng, chia thành 5 loại hình. Di chuột hoặc chạm vào từng căn trên mặt bằng để xem diện tích chi tiết.',
  'floor.imageAlt': 'Mặt bằng tầng điển hình',

  // Tin tức
  'news.title': 'Tin tức & sự kiện',
  'news.subtitle': 'Cập nhật những thông báo mới nhất, tiến độ dự án và các sự kiện nổi bật.',

  // Ước tính khoản vay
  'loan.title': 'Ước tính khoản vay mua căn hộ Imperia Sensa Park',
  'loan.subtitle': 'Nhập giá căn hộ, tỷ lệ vay, lãi suất và thời hạn để ước tính số tiền trả hàng tháng. Kết quả chỉ mang tính tham khảo.',
  'loan.note': 'Kết quả ước tính, chưa gồm phí và ưu đãi hỗ trợ lãi suất của chủ đầu tư. Để lại thông tin để nhận bảng tính dòng tiền chi tiết theo từng căn.',
  'loan.cta': 'Nhận bảng tính chi tiết',

  // Form đăng ký (section Liên hệ)
  'lead.title': 'Nhận thông tin dự án.',
  'lead.subtitle': 'Để lại thông tin để nhận bảng giá, chính sách ưu đãi và được chuyên viên tư vấn hỗ trợ nhanh chóng.',
  'lead.highlights': 'Brochure thông tin chi tiết dự án\nBản đồ vị trí & quy hoạch hạ tầng dự án\nMặt bằng tổng thể & vị trí từng căn\nBảng tính giá gốc & dòng tiền\nChính sách bán hàng & hỗ trợ lãi suất\nHồ sơ pháp lý: Chấp thuận ĐT, GPXD, 1/500',
  'lead.submit': 'Nhận bảng giá',
  'lead.privacy': 'Tuyệt đối bảo mật thông tin cá nhân.',
  'lead.support': 'Giải đáp mọi thắc mắc của khách hàng.',

  // Popup
  'popup.title': 'Nhận thông tin dự án',
  'popup.intro': 'Đăng ký nhận tài liệu chuyên sâu & tư vấn 1:1 từ chuyên viên',
  'popup.imageAlt': 'Phối cảnh Imperia Sensa Park',

  // Header / nút
  'header.cta': 'Nhận thông tin',
  'header.ctaMobile': 'Nhận thông tin dự án',
  'sticky.call': 'Gọi hotline',
  'sticky.zalo': 'Chat Zalo',
  'sticky.price': 'Nhận bảng giá',

  // Gửi form
  'form.sending': 'Đang gửi…',
  'form.error': 'Chưa gửi được thông tin, vui lòng thử lại hoặc gọi hotline {phone}.',
};

export default UI;
