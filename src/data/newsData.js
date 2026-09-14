// src/data/newsData.js
//
// ⚠️ MOCK DATA — chưa có database / CMS thật.
// Cấu trúc mỗi item được thiết kế giống hệt shape mà API thật sẽ trả về
// (xem README-NEWS-MODULE.md), để khi backend xong chỉ cần thay phần
// fetchNewsList() trong newsService.js, KHÔNG cần sửa bất kỳ component nào.
//
// Ảnh dùng placehold.co (đúng bảng màu imperia) để không phụ thuộc asset
// thật — thay bằng ảnh dự án khi có nội dung chính thức.

const ph = (label, bg = "4D5538", fg = "F5F1EB") =>
  `https://placehold.co/1200x750/${bg}/${fg}?font=roboto&text=${encodeURIComponent(
    label,
  )}`;

const NEWS_DATA = [
  {
    id: "khoi-cong-giai-doan-2",
    title: "Chính thức khởi công giai đoạn 2 của dự án",
    excerpt:
      "Giai đoạn 2 đánh dấu bước chuyển mình quan trọng, mở rộng quy mô tiện ích và nâng cấp cảnh quan toàn khu.",
    tag: "Tin tức",
    published_at: "2026-08-20",
    image_url: ph("Khởi công giai đoạn 2"),
    tags: ["Tiến độ", "Tin tức"],
    content: [
      {
        type: "p",
        text: "Nội dung chi tiết của bài viết sẽ được cập nhật khi có dữ liệu chính thức từ chủ đầu tư. Đây là đoạn văn bản mẫu (placeholder) dùng để kiểm tra bố cục trang chi tiết.",
      },
      {
        type: "h2",
        text: "Điểm nhấn của giai đoạn mới",
        id: "diem-nhan",
      },
      {
        type: "p",
        text: "Đoạn văn bản mẫu thứ hai, mô tả các hạng mục tiện ích, tiến độ pháp lý hoặc chính sách bán hàng liên quan. Thay thế bằng nội dung thật khi bài viết được biên tập.",
      },
      {
        type: "img",
        src: ph("Phối cảnh minh họa", "68734B", "F5F1EB"),
        caption: "Ảnh minh họa — sẽ thay bằng ảnh thật của dự án.",
      },
      {
        type: "p",
        text: "Đoạn kết bài viết mẫu, có thể chứa lời kêu gọi hành động hoặc thông tin liên hệ.",
      },
    ],
  },
  {
    id: "ra-mat-nha-mau",
    title: "Ra mắt nhà mẫu — trải nghiệm không gian sống thực tế",
    excerpt:
      "Nhà mẫu được hoàn thiện với nội thất cao cấp, tái hiện đầy đủ không gian sống mà khách hàng sẽ sở hữu.",
    tag: "Sự kiện",
    published_at: "2026-08-05",
    image_url: ph("Ra mắt nhà mẫu"),
    tags: ["Sự kiện", "Nhà mẫu"],
    content: [{ type: "p", text: "Nội dung mẫu — chờ dữ liệu thật." }],
  },
  {
    id: "chinh-sach-ban-hang-quy-3",
    title: "Cập nhật chính sách bán hàng quý 3",
    excerpt:
      "Nhiều ưu đãi hấp dẫn dành cho khách hàng đặt cọc sớm, bao gồm chiết khấu và hỗ trợ lãi suất.",
    tag: "Tin tức",
    published_at: "2026-07-18",
    image_url: ph("Chính sách bán hàng"),
    tags: ["Chính sách", "Ưu đãi"],
    content: [{ type: "p", text: "Nội dung mẫu — chờ dữ liệu thật." }],
  },
  {
    id: "tien-do-ha-tang-khu-vuc",
    title: "Hạ tầng khu vực tăng tốc, kết nối liên vùng thuận lợi hơn",
    excerpt:
      "Các tuyến đường huyết mạch quanh dự án đang được đẩy nhanh tiến độ thi công, rút ngắn thời gian di chuyển.",
    tag: "Sự kiện",
    published_at: "2026-07-02",
    image_url: ph("Hạ tầng khu vực"),
    tags: ["Hạ tầng", "Sự kiện"],
    content: [{ type: "p", text: "Nội dung mẫu — chờ dữ liệu thật." }],
  },
  {
    id: "ban-giao-tien-ich-noi-khu",
    title: "Bàn giao cụm tiện ích nội khu đầu tiên",
    excerpt:
      "Hồ bơi, công viên trung tâm và khu thể thao ngoài trời chính thức đi vào hoạt động, phục vụ cư dân.",
    tag: "Tin tức",
    published_at: "2026-06-15",
    image_url: ph("Tiện ích nội khu"),
    tags: ["Tiện ích", "Tin tức"],
    content: [{ type: "p", text: "Nội dung mẫu — chờ dữ liệu thật." }],
  },
  {
    id: "danh-gia-thi-truong-khu-dong",
    title: "Đánh giá thị trường bất động sản khu vực trong 6 tháng đầu năm",
    excerpt:
      "Báo cáo từ các đơn vị nghiên cứu cho thấy tín hiệu phục hồi tích cực về thanh khoản và giá bán sơ cấp.",
    tag: "Sự kiện",
    published_at: "2026-05-28",
    image_url: ph("Thị trường BĐS"),
    tags: ["Thị trường", "Phân tích"],
    content: [{ type: "p", text: "Nội dung mẫu — chờ dữ liệu thật." }],
  },
];

export default NEWS_DATA;
