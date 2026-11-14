# Audit UI/UX trên 142 thiết bị — Imperia Sensa Park

Ngày chạy: 2026-11-14 · Bản build: `dist-audit` (production + prerender, nội dung CMS mặc định) · 142 thiết bị × 14 trang = 1988 lượt kiểm.

Công cụ: `scripts/audit-devices.mjs` (Puppeteer/Chromium giả lập viewport, DPR, cảm ứng, User-Agent iOS/Android) · danh sách thiết bị `scripts/devices.mjs` · tổng hợp `scripts/audit-report.mjs`. Ảnh chụp: `tmp/audit-devices/shots/` (màn hình đầu của mọi thiết bị + toàn trang của 14 thiết bị đại diện).

> **Giới hạn:** Chromium giả lập không thay được Safari/WebKit thật (thanh địa chỉ co giãn, `100vh`, bàn phím ảo, cuộn quán tính iOS), trình duyệt Samsung hay trình duyệt TV. Danh sách “Cần kiểm trên máy thật” ở cuối báo cáo.

| Nhóm | Số thiết bị |
|---|---|
| Apple (iPhone, iPad, Mac) | 52 |
| Android (điện thoại, tablet) | 50 |
| Laptop | 14 |
| Màn hình rời | 20 |
| TV | 6 |

## 1. Tổng hợp theo loại lỗi

| Loại lỗi | Số lượt | Số thiết bị | Trang bị ảnh hưởng |
|---|---|---|---|
| Trang không tải được | 0 | 0 | — |
| HTTP khác 200 | 0 | 0 | — |
| Tràn ngang (xuất hiện thanh cuộn ngang) | 0 | 0 | — |
| Chữ bị cắt / che | 0 | 0 | — |
| Chữ đè lên chữ | 0 | 0 | — |
| Ảnh lỗi | 71 | 71 | /tien-ich |
| Tài nguyên trả lỗi 4xx/5xx | 110 | 110 | /tien-ich |
| Lỗi JavaScript / console | 110 | 110 | /tien-ich |
| Nội dung còn ẩn sau khi cuộn hết trang | 0 | 0 | — |
| H1 không nằm trọn trong màn hình đầu | 61 | 12 | /tin-tuc/mik-group-khai-truong-house-of-mik-mien-nam, /tin-tuc/chuoi-hon-40-tien-ich-imperia-sensa-park, /tin-tuc/imperia-sensa-park-discovery-residences, /tin-tuc/imperia-sensa-park-thiet-ke-can-ho-theo-tinh-than-kham-pha, /tin-tuc/chien-luoc-mo-rong-mik-group-tai-phia-nam +1 |
| Không có CTA trong màn hình đầu | 78 | 38 | /tin-tuc, /, /tin-tuc/mik-group-khai-truong-house-of-mik-mien-nam, /tin-tuc/chuoi-hon-40-tien-ich-imperia-sensa-park, /tin-tuc/imperia-sensa-park-discovery-residences +3 |
| Header chiếm > 15% chiều cao màn hình | 0 | 0 | — |
| Nút nổi / thanh CTA che nội dung | 0 | 0 | — |
| Vùng chạm < 44px (cảm ứng) | 725 | 94 | /faq, /vi-tri, /tien-ich, /tong-quan, / +9 |
| Chữ quá nhỏ (< 12px cảm ứng, < 11px desktop) | 734 | 94 | /faq, /vi-tri, /tien-ich, /tong-quan, / +3 |
| Dòng chữ quá dài (> 110 ký tự/dòng) | 236 | 37 | /tien-ich, /, /tin-tuc, /tin-tuc/mik-group-khai-truong-house-of-mik-mien-nam, /tin-tuc/chuoi-hon-40-tien-ich-imperia-sensa-park +9 |
| Ảnh bị phóng to quá độ phân giải gốc (mờ) | 784 | 141 | /, /tong-quan, /tin-tuc/imperia-sensa-park-discovery-residences, /tin-tuc, /tin-tuc/imperia-sensa-park-thiet-ke-can-ho-theo-tinh-than-kham-pha +6 |
| Ảnh mặt bằng/bản đồ bị cắt (object-fit: cover) | 119 | 119 | /mat-bang |
| scroll-snap bật trên màn cảm ứng | 0 | 0 | — |
| Popup tự mở che màn hình đầu | 0 | 0 | — |
| Hero ẩn khi vừa tải (opacity tiêu đề = 0) | 0 | 0 | — |

## 2. Chi tiết từng lỗi (ví dụ đại diện)

### Ảnh lỗi

- **71 thiết bị** · /tien-ich — http://127.0.0.1:4191/assets/map-p.optimized.webp
  - ví dụ: iPhone 6s / 7 / 8 (375×667), iPhone SE (2nd/3rd) (375×667), iPhone XR (414×896), iPhone 12 / 12 Pro (390×844), …

### Tài nguyên trả lỗi 4xx/5xx

- **110 thiết bị** · /tien-ich — 404 /assets/map-p.optimized.webp
  - ví dụ: iPhone 6s / 7 / 8 (375×667), iPhone SE (2nd/3rd) (375×667), iPhone 8 Plus (414×736), iPhone X / XS (375×812), …

### Lỗi JavaScript / console

- **110 thiết bị** · /tien-ich — Failed to load resource: the server responded with a status of 404 (Not Found)
  - ví dụ: iPhone 6s / 7 / 8 (375×667), iPhone SE (2nd/3rd) (375×667), iPhone 8 Plus (414×736), iPhone X / XS (375×812), …

### H1 không nằm trọn trong màn hình đầu

- **12 thiết bị** · /tin-tuc/imperia-sensa-park-discovery-residences — IMPERIA SENSA PARK MỞ RA TRẢI NGHIỆM DISCOVERY RESIDENCES TI
  - ví dụ: iPhone SE (1st) (320×568), iPhone SE – Safari có thanh công cụ (375×548), iPhone SE ngang (667×375), iPhone 14 ngang (844×390), …
- **11 thiết bị** · /tin-tuc/mik-group-khai-truong-house-of-mik-mien-nam — MIK GROUP KHAI TRƯƠNG HOUSE OF MIK, ĐÁNH DẤU BƯỚC PHÁT TRIỂN
  - ví dụ: iPhone SE (1st) (320×568), iPhone SE – Safari có thanh công cụ (375×548), iPhone SE ngang (667×375), iPhone 14 ngang (844×390), …
- **10 thiết bị** · /tin-tuc/chuoi-hon-40-tien-ich-imperia-sensa-park — CHUỖI HƠN 40 TIỆN ÍCH TRONG DỰ ÁN MIK GROUP Ở KHU ĐÔNG TP HC
  - ví dụ: iPhone SE (1st) (320×568), iPhone SE – Safari có thanh công cụ (375×548), iPhone SE ngang (667×375), iPhone 14 ngang (844×390), …
- **10 thiết bị** · /tin-tuc/imperia-sensa-park-thiet-ke-can-ho-theo-tinh-than-kham-pha — IMPERIA SENSA PARK THIẾT KẾ CĂN HỘ THEO TINH THẦN KHÁM PHÁ
  - ví dụ: iPhone SE (1st) (320×568), iPhone SE – Safari có thanh công cụ (375×548), iPhone SE ngang (667×375), iPhone 14 ngang (844×390), …
- **9 thiết bị** · /tin-tuc/chien-luoc-mo-rong-mik-group-tai-phia-nam — CHIẾN LƯỢC MỞ RỘNG CỦA MIK GROUP TẠI PHÍA NAM
  - ví dụ: iPhone SE (1st) (320×568), iPhone SE – Safari có thanh công cụ (375×548), iPhone SE ngang (667×375), iPhone 14 ngang (844×390), …
- **9 thiết bị** · /tin-tuc/mik-group-khoi-cong-du-an-imperia-sensa-park — MIK GROUP KHỞI CÔNG DỰ ÁN IMPERIA SENSA PARK
  - ví dụ: iPhone SE (1st) (320×568), iPhone SE – Safari có thanh công cụ (375×548), iPhone SE ngang (667×375), iPhone 14 ngang (844×390), …

### Không có CTA trong màn hình đầu

- **38 thiết bị** · /tin-tuc — 
  - ví dụ: iPhone SE (1st) (320×568), iPhone 6s / 7 / 8 (375×667), iPhone SE (2nd/3rd) (375×667), iPhone 8 Plus (414×736), …
- **6 thiết bị** · /tin-tuc/mik-group-khai-truong-house-of-mik-mien-nam — 
  - ví dụ: iPhone SE ngang (667×375), iPhone 14 ngang (844×390), iPhone 15 Pro Max ngang (932×430), Android ngang (412×915) (915×412), …
- **6 thiết bị** · /tin-tuc/chuoi-hon-40-tien-ich-imperia-sensa-park — 
  - ví dụ: iPhone SE ngang (667×375), iPhone 14 ngang (844×390), iPhone 15 Pro Max ngang (932×430), Android ngang (412×915) (915×412), …
- **6 thiết bị** · /tin-tuc/imperia-sensa-park-discovery-residences — 
  - ví dụ: iPhone SE ngang (667×375), iPhone 14 ngang (844×390), iPhone 15 Pro Max ngang (932×430), Android ngang (412×915) (915×412), …
- **6 thiết bị** · /tin-tuc/imperia-sensa-park-thiet-ke-can-ho-theo-tinh-than-kham-pha — 
  - ví dụ: iPhone SE ngang (667×375), iPhone 14 ngang (844×390), iPhone 15 Pro Max ngang (932×430), Android ngang (412×915) (915×412), …
- **6 thiết bị** · /tin-tuc/chien-luoc-mo-rong-mik-group-tai-phia-nam — 
  - ví dụ: iPhone SE ngang (667×375), iPhone 14 ngang (844×390), iPhone 15 Pro Max ngang (932×430), Android ngang (412×915) (915×412), …
- **6 thiết bị** · /tin-tuc/mik-group-khoi-cong-du-an-imperia-sensa-park — 
  - ví dụ: iPhone SE ngang (667×375), iPhone 14 ngang (844×390), iPhone 15 Pro Max ngang (932×430), Android ngang (412×915) (915×412), …
- **4 thiết bị** · / — 
  - ví dụ: iPhone SE ngang (667×375), iPhone 14 ngang (844×390), iPhone 15 Pro Max ngang (932×430), Android ngang (412×915) (915×412)

### Vùng chạm < 44px (cảm ứng)

- **15 thiết bị** · /tong-quan — a @main-content "TRANG CHỦ" 91×17; label.mb-1.5.block @lien-he "Họ và tên *" 332×21; label.mb-1.5.block @lien-he "Số điện thoại *" 332×21
  - ví dụ: Galaxy S20 Ultra (412×915), Galaxy S24 / S25 Ultra (412×891), Galaxy A32 / A33 / A35 (412×915), Galaxy A51 / A71 (412×914), …
- **15 thiết bị** · /faq — label.mb-1.5.block @lien-he "Họ và tên *" 332×21; label.mb-1.5.block @lien-he "Số điện thoại *" 332×21
  - ví dụ: Galaxy S20 Ultra (412×915), Galaxy S24 / S25 Ultra (412×891), Galaxy A32 / A33 / A35 (412×915), Galaxy A51 / A71 (412×914), …
- **15 thiết bị** · /vi-tri — a @main-content "TRANG CHỦ" 91×17; label.mb-1.5.block @lien-he "Họ và tên *" 332×21; label.mb-1.5.block @lien-he "Số điện thoại *" 332×21
  - ví dụ: Galaxy S20 Ultra (412×915), Galaxy S24 / S25 Ultra (412×891), Galaxy A32 / A33 / A35 (412×915), Galaxy A51 / A71 (412×914), …
- **15 thiết bị** · /tien-ich — a @main-content "TRANG CHỦ" 91×17; button.flex.h-8 @tien-ich "Trang 1 / 2" 32×32; button.flex.h-8 @tien-ich "Trang 2 / 2" 32×32; label.mb-1.5.block @lien-he "Họ và tên *" 332×21; label.mb-1.5.block @lien-he "Số điện thoại *" 332×21
  - ví dụ: Galaxy S20 Ultra (412×915), Galaxy S24 / S25 Ultra (412×891), Galaxy A32 / A33 / A35 (412×915), Galaxy A51 / A71 (412×914), …
- **15 thiết bị** · /mat-bang — a @main-content "TRANG CHỦ" 91×17; polygon @mat-bang "A.01 — 2PN" 28×20; polygon @mat-bang "A.02 — 2PN" 28×19; polygon @mat-bang "A.03 — 1PN+" 20×20; polygon @mat-bang "A.03A — 2PN" 25×32; polygon @mat-bang "A.05 — 2PN" 23×33; polygon @mat-bang "A.06 — 2PN" 26×31; polygon @mat-bang "A.07 — 2PN" 30×34
  - ví dụ: Galaxy S20 Ultra (412×915), Galaxy S24 / S25 Ultra (412×891), Galaxy A32 / A33 / A35 (412×915), Galaxy A51 / A71 (412×914), …
- **12 thiết bị** · /faq — label.mb-1.5.block @lien-he "Họ và tên *" 280×21; label.mb-1.5.block @lien-he "Số điện thoại *" 280×21
  - ví dụ: Galaxy S8 / S9 (360×740), Galaxy S10 / S10e (360×760), Galaxy S20 / S21 (360×800), Galaxy S22 / S23 / S25 (360×780), …
- **12 thiết bị** · /tong-quan — a @main-content "TRANG CHỦ" 91×17; label.mb-1.5.block @lien-he "Họ và tên *" 280×21; label.mb-1.5.block @lien-he "Số điện thoại *" 280×21
  - ví dụ: Galaxy S8 / S9 (360×740), Galaxy S10 / S10e (360×760), Galaxy S20 / S21 (360×800), Galaxy S22 / S23 / S25 (360×780), …
- **12 thiết bị** · /vi-tri — a @main-content "TRANG CHỦ" 91×17; label.mb-1.5.block @lien-he "Họ và tên *" 280×21; label.mb-1.5.block @lien-he "Số điện thoại *" 280×21
  - ví dụ: Galaxy S8 / S9 (360×740), Galaxy S10 / S10e (360×760), Galaxy S20 / S21 (360×800), Galaxy S22 / S23 / S25 (360×780), …

### Chữ quá nhỏ (< 12px cảm ứng, < 11px desktop)

- **94 thiết bị** · /faq — figcaption @main-content "IMPERIA SENSA PARK / Câu hỏi thường gặp" 11px
  - ví dụ: iPhone SE (1st) (320×568), iPhone 6s / 7 / 8 (375×667), iPhone SE (2nd/3rd) (375×667), iPhone 8 Plus (414×736), …
- **94 thiết bị** · /vi-tri — figcaption @main-content "IMPERIA SENSA PARK / Vị trí" 11px
  - ví dụ: iPhone SE (1st) (320×568), iPhone 6s / 7 / 8 (375×667), iPhone SE (2nd/3rd) (375×667), iPhone 8 Plus (414×736), …
- **94 thiết bị** · /tien-ich — figcaption @main-content "IMPERIA SENSA PARK / Tiện ích" 11px
  - ví dụ: iPhone SE (1st) (320×568), iPhone 6s / 7 / 8 (375×667), iPhone SE (2nd/3rd) (375×667), iPhone 8 Plus (414×736), …
- **94 thiết bị** · /tong-quan — figcaption @main-content "IMPERIA SENSA PARK / Tổng quan" 11px
  - ví dụ: iPhone SE (1st) (320×568), iPhone 6s / 7 / 8 (375×667), iPhone SE (2nd/3rd) (375×667), iPhone 8 Plus (414×736), …
- **94 thiết bị** · /tin-tuc — span.rounded-full.bg-imperia-accent/30 @main-content "TIN TỨC" 11px; span @main-content "22/09/2026" 11px; span.rounded-full.bg-imperia-accent/30 @main-content "TIN TỨC" 11px; span @main-content "16/09/2026" 11px; span.rounded-full.bg-imperia-accent/30 @main-content "TIN TỨC" 11px; span @main-content "22/09/2026" 11px
  - ví dụ: iPhone SE (1st) (320×568), iPhone 6s / 7 / 8 (375×667), iPhone SE (2nd/3rd) (375×667), iPhone 8 Plus (414×736), …
- **94 thiết bị** · /bang-gia — figcaption @main-content "IMPERIA SENSA PARK / Bảng giá" 11px
  - ví dụ: iPhone SE (1st) (320×568), iPhone 6s / 7 / 8 (375×667), iPhone SE (2nd/3rd) (375×667), iPhone 8 Plus (414×736), …
- **76 thiết bị** · / — span.apt-tab-area @apt-tab-STUDIO "35,2 m²" 11.2px; span.apt-tab-area @apt-tab-1PN+ "52,2 – 52,6 m²" 11.2px; span.apt-tab-area @apt-tab-2PN "70,0 – 94,9 m²" 11.2px; span.apt-tab-area @apt-tab-3PN "91,3 – 120,3 m²" 11.2px; span.apt-tab-area @apt-tab-DUPLEX "167,7 – 193,8 m²" 11.2px
  - ví dụ: iPhone SE (1st) (320×568), iPhone 6s / 7 / 8 (375×667), iPhone SE (2nd/3rd) (375×667), iPhone 8 Plus (414×736), …
- **76 thiết bị** · /mat-bang — figcaption @main-content "IMPERIA SENSA PARK / Mặt bằng" 11px; span.apt-tab-area @apt-tab-STUDIO "35,2 m²" 11.2px; span.apt-tab-area @apt-tab-1PN+ "52,2 – 52,6 m²" 11.2px; span.apt-tab-area @apt-tab-2PN "70,0 – 94,9 m²" 11.2px; span.apt-tab-area @apt-tab-3PN "91,3 – 120,3 m²" 11.2px; span.apt-tab-area @apt-tab-DUPLEX "167,7 – 193,8 m²" 11.2px
  - ví dụ: iPhone SE (1st) (320×568), iPhone 6s / 7 / 8 (375×667), iPhone SE (2nd/3rd) (375×667), iPhone 8 Plus (414×736), …

### Dòng chữ quá dài (> 110 ký tự/dòng)

- **22 thiết bị** · / — p.q-concept-count @tien-ich ~121 ký tự/dòng
  - ví dụ: iMac 24 – trình duyệt (2240×1149), iMac 27 / Studio Display – trình duyệt (2560×1329), Pro Display XDR (mặc định) – trình duyệt (3008×1581), Galaxy Tab S9 Ultra ngang (1848×1176), …
- **13 thiết bị** · /tin-tuc — p.mt-3.text-imperia-black/70 @main-content ~139 ký tự/dòng
  - ví dụ: iMac 24 – trình duyệt (2240×1149), iMac 27 / Studio Display – trình duyệt (2560×1329), Pro Display XDR (mặc định) – trình duyệt (3008×1581), Màn QHD 2560×1440 (2560×1440), …
- **13 thiết bị** · /tin-tuc/mik-group-khai-truong-house-of-mik-mien-nam — p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng
  - ví dụ: iMac 24 – trình duyệt (2240×1149), iMac 27 / Studio Display – trình duyệt (2560×1329), Pro Display XDR (mặc định) – trình duyệt (3008×1581), Màn QHD 2560×1440 (2560×1440), …
- **13 thiết bị** · /tin-tuc/chuoi-hon-40-tien-ich-imperia-sensa-park — p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng
  - ví dụ: iMac 24 – trình duyệt (2240×1149), iMac 27 / Studio Display – trình duyệt (2560×1329), Pro Display XDR (mặc định) – trình duyệt (3008×1581), Màn QHD 2560×1440 (2560×1440), …
- **13 thiết bị** · /tin-tuc/imperia-sensa-park-discovery-residences — p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng
  - ví dụ: iMac 24 – trình duyệt (2240×1149), iMac 27 / Studio Display – trình duyệt (2560×1329), Pro Display XDR (mặc định) – trình duyệt (3008×1581), Màn QHD 2560×1440 (2560×1440), …
- **13 thiết bị** · /tin-tuc/imperia-sensa-park-thiet-ke-can-ho-theo-tinh-than-kham-pha — p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng
  - ví dụ: iMac 24 – trình duyệt (2240×1149), iMac 27 / Studio Display – trình duyệt (2560×1329), Pro Display XDR (mặc định) – trình duyệt (3008×1581), Màn QHD 2560×1440 (2560×1440), …
- **13 thiết bị** · /tin-tuc/chien-luoc-mo-rong-mik-group-tai-phia-nam — p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng
  - ví dụ: iMac 24 – trình duyệt (2240×1149), iMac 27 / Studio Display – trình duyệt (2560×1329), Pro Display XDR (mặc định) – trình duyệt (3008×1581), Màn QHD 2560×1440 (2560×1440), …
- **13 thiết bị** · /tin-tuc/mik-group-khoi-cong-du-an-imperia-sensa-park — p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng; p @main-content ~148 ký tự/dòng
  - ví dụ: iMac 24 – trình duyệt (2240×1149), iMac 27 / Studio Display – trình duyệt (2560×1329), Pro Display XDR (mặc định) – trình duyệt (3008×1581), Màn QHD 2560×1440 (2560×1440), …

### Ảnh bị phóng to quá độ phân giải gốc (mờ)

- **9 thiết bị** · / — hero-overview-800.webp hiển thị 412px×2.6 > gốc 412px; phoi-canh-ven-song-800.webp hiển thị 412px×2.6 > gốc 412px; imgi_3_1-BzrOqiW4-900.webp hiển thị 346px×2.6 > gốc 346px; imgi_3_2-BtIqkXkG-900.webp hiển thị 294px×2.6 > gốc 346px; himalaya-salt-room-800.webp hiển thị 294px×2.6 > gốc 346px; phoi-canh-ven-song-800.webp hiển thị 379px×2.6 > gốc 370px
  - ví dụ: Galaxy A32 / A33 / A35 (412×915), Galaxy A51 / A71 (412×914), Galaxy A52 / A53 / A55 (412×915), Galaxy Note 10 (412×869), …
- **9 thiết bị** · /tong-quan — phoi-canh-ven-song-800.webp hiển thị 412px×2.6 > gốc 412px
  - ví dụ: Galaxy A32 / A33 / A35 (412×915), Galaxy A51 / A71 (412×914), Galaxy A52 / A53 / A55 (412×915), Galaxy Note 10 (412×869), …
- **9 thiết bị** · /tin-tuc — G2F5u5oNzcWFoTw.webp hiển thị 378px×2.6 > gốc 640px
  - ví dụ: Galaxy A32 / A33 / A35 (412×915), Galaxy A51 / A71 (412×914), Galaxy A52 / A53 / A55 (412×915), Galaxy Note 10 (412×869), …
- **9 thiết bị** · /tin-tuc/imperia-sensa-park-discovery-residences — G2F5u5oNzcWFoTw.webp hiển thị 412px×2.6 > gốc 640px
  - ví dụ: Galaxy A32 / A33 / A35 (412×915), Galaxy A51 / A71 (412×914), Galaxy A52 / A53 / A55 (412×915), Galaxy Note 10 (412×869), …
- **7 thiết bị** · / — hero-overview-800.webp hiển thị 360px×3 > gốc 360px; phoi-canh-ven-song-800.webp hiển thị 360px×3 > gốc 360px; imgi_3_1-BzrOqiW4-900.webp hiển thị 302px×3 > gốc 302px; imgi_3_2-BtIqkXkG-900.webp hiển thị 257px×3 > gốc 302px; himalaya-salt-room-800.webp hiển thị 257px×3 > gốc 302px; phoi-canh-ven-song-800.webp hiển thị 331px×3 > gốc 324px
  - ví dụ: Galaxy S8 / S9 (360×740), Galaxy S10 / S10e (360×760), Galaxy S20 / S21 (360×800), Galaxy S22 / S23 / S25 (360×780), …
- **7 thiết bị** · /tong-quan — phoi-canh-ven-song-800.webp hiển thị 360px×3 > gốc 360px
  - ví dụ: Galaxy S8 / S9 (360×740), Galaxy S10 / S10e (360×760), Galaxy S20 / S21 (360×800), Galaxy S22 / S23 / S25 (360×780), …
- **7 thiết bị** · /tin-tuc/imperia-sensa-park-discovery-residences — G2F5u5oNzcWFoTw.webp hiển thị 360px×3 > gốc 640px
  - ví dụ: Galaxy S8 / S9 (360×740), Galaxy S10 / S10e (360×760), Galaxy S20 / S21 (360×800), Galaxy S22 / S23 / S25 (360×780), …
- **6 thiết bị** · /tong-quan — phoi-canh-ven-song-800.webp hiển thị 412px×3.5 > gốc 412px
  - ví dụ: Galaxy S20 Ultra (412×915), Galaxy S24 / S25 Ultra (412×891), Galaxy Note 8 (412×846), Galaxy Note 20 Ultra (412×883), …

### Ảnh mặt bằng/bản đồ bị cắt (object-fit: cover)

- **12 thiết bị** · /mat-bang — Imperia Sensa Park (khung 1013×560, ảnh 1491×1055)
  - ví dụ: iMac 24 – trình duyệt (2240×1149), iMac 27 / Studio Display – trình duyệt (2560×1329), Pro Display XDR (mặc định) – trình duyệt (3008×1581), Màn QHD 2560×1440 (2560×1440), …
- **7 thiết bị** · /mat-bang — Imperia Sensa Park (khung 328×400, ảnh 1491×1055)
  - ví dụ: Galaxy S20 / S21 (360×800), Galaxy A12 / A13 / A15 (360×800), Galaxy A22 / A23 (360×800), OPPO A54 / A57 / A78 (360×800), …
- **6 thiết bị** · /mat-bang — Imperia Sensa Park (khung 361×426, ảnh 1491×1055)
  - ví dụ: iPhone 14 Pro (393×852), iPhone 15 / 15 Pro (393×852), iPhone 16 / 16e (393×852), Pixel 5 (393×851), …
- **6 thiết bị** · /mat-bang — Imperia Sensa Park (khung 380×458, ảnh 1491×1055)
  - ví dụ: Galaxy S20 Ultra (412×915), Galaxy A32 / A33 / A35 (412×915), Galaxy A52 / A53 / A55 (412×915), Galaxy Note 20 (412×915), …
- **4 thiết bị** · /mat-bang — Imperia Sensa Park (khung 382×448, ảnh 1491×1055)
  - ví dụ: iPhone XR (414×896), iPhone XS Max (414×896), iPhone 11 (414×896), iPhone 11 Pro Max (414×896)
- **4 thiết bị** · /mat-bang — Imperia Sensa Park (khung 896×540, ảnh 1491×1055)
  - ví dụ: Màn FHD 1920×1080 (1920×1080), Màn 4K @200% (1920×1080) (1920×1080), Smart TV FHD 1920×1080 (1920×1080), Smart TV 4K (1920×1080 @2x) (1920×1080)
- **3 thiết bị** · /mat-bang — Imperia Sensa Park (khung 343×406, ảnh 1491×1055)
  - ví dụ: iPhone X / XS (375×812), iPhone 11 Pro (375×812), iPhone 12 mini / 13 mini (375×812)
- **3 thiết bị** · /mat-bang — Imperia Sensa Park (khung 358×422, ảnh 1491×1055)
  - ví dụ: iPhone 12 / 12 Pro (390×844), iPhone 13 / 13 Pro (390×844), iPhone 14 (390×844)

## 3. Kết quả theo nhóm thiết bị

### Apple (iPhone, iPad, Mac)

| Thiết bị | Viewport | Tràn ngang | Chữ cắt/đè | Vùng chạm nhỏ | Chữ nhỏ | Ảnh mờ | Lỗi JS | Che nội dung |
|---|---|---|---|---|---|---|---|---|
| iPhone SE (1st) | 320×568 @2x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 1 | ✓ | ✓ |
| iPhone 6s / 7 / 8 | 375×667 @2x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 2 | ⚠ 1 | ✓ |
| iPhone SE (2nd/3rd) | 375×667 @2x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 2 | ⚠ 1 | ✓ |
| iPhone 8 Plus | 414×736 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ⚠ 1 | ✓ |
| iPhone X / XS | 375×812 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ⚠ 1 | ✓ |
| iPhone XR | 414×896 @2x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 2 | ⚠ 1 | ✓ |
| iPhone XS Max | 414×896 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| iPhone 11 | 414×896 @2x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 1 | ✓ | ✓ |
| iPhone 11 Pro | 375×812 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ⚠ 1 | ✓ |
| iPhone 11 Pro Max | 414×896 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| iPhone 12 mini / 13 mini | 375×812 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ✓ | ✓ |
| iPhone 12 / 12 Pro | 390×844 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| iPhone 12 Pro Max | 428×926 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 5 | ⚠ 1 | ✓ |
| iPhone 13 / 13 Pro | 390×844 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ✓ | ✓ |
| iPhone 13 Pro Max | 428×926 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 5 | ✓ | ✓ |
| iPhone 14 | 390×844 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ⚠ 1 | ✓ |
| iPhone 14 Plus | 428×926 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 5 | ⚠ 1 | ✓ |
| iPhone 14 Pro | 393×852 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| iPhone 14 Pro Max | 430×932 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 5 | ✓ | ✓ |
| iPhone 15 / 15 Pro | 393×852 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ⚠ 1 | ✓ |
| iPhone 15 Plus / Pro Max | 430×932 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| iPhone 16 / 16e | 393×852 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ✓ | ✓ |
| iPhone 16 Plus | 430×932 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 5 | ⚠ 1 | ✓ |
| iPhone 16 Pro | 402×874 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| iPhone 16 Pro Max | 440×956 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 5 | ✓ | ✓ |
| iPhone 17 / 17 Pro | 402×874 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| iPhone Air | 420×912 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 5 | ⚠ 1 | ✓ |
| iPhone 17 Pro Max | 440×956 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| iPhone SE – Safari có thanh công cụ | 375×548 @2x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ⚠ 1 | ✓ |
| iPhone 14 – Safari có thanh công cụ | 390×664 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ⚠ 1 | ✓ |
| iPhone 15 Pro Max – Safari có thanh công cụ | 430×739 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 5 | ⚠ 1 | ✓ |
| iPhone SE ngang | 667×375 @2x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ⚠ 1 | ✓ |
| iPhone 14 ngang | 844×390 @3x | ✓ | ✓ | ⚠ 8 | ⚠ 7 | ⚠ 10 | ⚠ 1 | ✓ |
| iPhone 15 Pro Max ngang | 932×430 @3x | ✓ | ✓ | ⚠ 8 | ⚠ 7 | ⚠ 10 | ⚠ 1 | ✓ |
| iPad mini 5 dọc | 768×1024 @2x | ✓ | ✓ | ⚠ 8 | ⚠ 7 | ⚠ 9 | ⚠ 1 | ✓ |
| iPad mini 6 dọc | 744×1133 @2x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 7 | ⚠ 1 | ✓ |
| iPad 9th dọc | 810×1080 @2x | ✓ | ✓ | ⚠ 8 | ⚠ 7 | ⚠ 9 | ⚠ 1 | ✓ |
| iPad 10th / Air 4-5 dọc | 820×1180 @2x | ✓ | ✓ | ⚠ 8 | ⚠ 7 | ⚠ 9 | ⚠ 1 | ✓ |
| iPad Pro 11 dọc | 834×1194 @2x | ✓ | ✓ | ⚠ 8 | ⚠ 7 | ⚠ 9 | ✓ | ✓ |
| iPad Pro 12.9 / Air 13 dọc | 1024×1366 @2x | ✓ | ✓ | ⚠ 14 | ⚠ 7 | ⚠ 9 | ⚠ 1 | ✓ |
| iPad Pro 13 (M4) dọc | 1032×1376 @2x | ✓ | ✓ | ⚠ 14 | ⚠ 7 | ⚠ 9 | ⚠ 1 | ✓ |
| iPad mini 6 ngang | 1133×744 @2x | ✓ | ✓ | ⚠ 14 | ⚠ 7 | ⚠ 9 | ⚠ 1 | ✓ |
| iPad 10th ngang | 1180×820 @2x | ✓ | ✓ | ⚠ 14 | ⚠ 7 | ⚠ 9 | ⚠ 1 | ✓ |
| iPad Pro 12.9 ngang | 1366×1024 @2x | ✓ | ✓ | ⚠ 14 | ⚠ 7 | ⚠ 10 | ⚠ 1 | ✓ |
| MacBook Air 13 (M1) – trình duyệt | 1440×789 @2x | ✓ | ✓ | — | ✓ | ⚠ 9 | ✓ | ✓ |
| MacBook Air 13 (M2/M3) – trình duyệt | 1470×845 @2x | ✓ | ✓ | — | ✓ | ⚠ 10 | ⚠ 1 | ✓ |
| MacBook Air 15 – trình duyệt | 1710×1001 @2x | ✓ | ✓ | — | ✓ | ⚠ 10 | ⚠ 1 | ✓ |
| MacBook Pro 14 – trình duyệt | 1512×871 @2x | ✓ | ✓ | — | ✓ | ⚠ 10 | ⚠ 1 | ✓ |
| MacBook Pro 16 – trình duyệt | 1728×1006 @2x | ✓ | ✓ | — | ✓ | ⚠ 10 | ⚠ 1 | ✓ |
| iMac 24 – trình duyệt | 2240×1149 @2x | ✓ | ✓ | — | ✓ | ⚠ 10 | ⚠ 1 | ✓ |
| iMac 27 / Studio Display – trình duyệt | 2560×1329 @2x | ✓ | ✓ | — | ✓ | ⚠ 10 | ⚠ 1 | ✓ |
| Pro Display XDR (mặc định) – trình duyệt | 3008×1581 @2x | ✓ | ✓ | — | ✓ | ⚠ 9 | ⚠ 1 | ✓ |

### Android (điện thoại, tablet)

| Thiết bị | Viewport | Tràn ngang | Chữ cắt/đè | Vùng chạm nhỏ | Chữ nhỏ | Ảnh mờ | Lỗi JS | Che nội dung |
|---|---|---|---|---|---|---|---|---|
| Galaxy S8 / S9 | 360×740 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ⚠ 1 | ✓ |
| Galaxy S10 / S10e | 360×760 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ✓ | ✓ |
| Galaxy S20 / S21 | 360×800 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ⚠ 1 | ✓ |
| Galaxy S20 Ultra | 412×915 @3.5x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 8 | ⚠ 1 | ✓ |
| Galaxy S21 Ultra | 384×854 @3.75x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 9 | ⚠ 1 | ✓ |
| Galaxy S22 / S23 / S25 | 360×780 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ✓ | ✓ |
| Galaxy S22 / S23 Ultra | 384×824 @3.75x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 8 | ⚠ 1 | ✓ |
| Galaxy S24 | 384×832 @2.8x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ✓ | ✓ |
| Galaxy S24 / S25 Ultra | 412×891 @3.5x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 9 | ✓ | ✓ |
| Galaxy A12 / A13 / A15 | 360×800 @2x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 2 | ✓ | ✓ |
| Galaxy A14 / A54 | 384×854 @2.8x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| Galaxy A22 / A23 | 360×800 @2x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 2 | ⚠ 1 | ✓ |
| Galaxy A32 / A33 / A35 | 412×915 @2.6x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ✓ | ✓ |
| Galaxy A51 / A71 | 412×914 @2.6x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| Galaxy A52 / A53 / A55 | 412×915 @2.6x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| Galaxy Note 8 | 412×846 @3.5x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 9 | ⚠ 1 | ✓ |
| Galaxy Note 9 | 414×846 @3.5x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 9 | ⚠ 1 | ✓ |
| Galaxy Note 10 | 412×869 @2.6x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ✓ | ✓ |
| Galaxy Note 20 | 412×915 @2.6x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| Galaxy Note 20 Ultra | 412×883 @3.5x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 9 | ⚠ 1 | ✓ |
| Galaxy Z Flip 5 / 6 | 412×980 @2.6x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 5 | ⚠ 1 | ✓ |
| Galaxy Z Fold 5 – gập | 344×882 @2.6x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 2 | ⚠ 1 | ✓ |
| Galaxy Z Fold 5 – mở | 884×1104 @2.4x | ✓ | ✓ | ⚠ 8 | ⚠ 7 | ⚠ 9 | ⚠ 1 | ✓ |
| Galaxy J2 / máy cấu hình thấp | 320×570 @1.5x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 2 | ⚠ 1 | ✓ |
| Galaxy Tab A7 Lite | 600×960 @1.33x | ✓ | ✓ | ⚠ 8 | ⚠ 8 | ✓ | ⚠ 1 | ✓ |
| Galaxy Tab S7 / S8 dọc | 800×1280 @2x | ✓ | ✓ | ⚠ 8 | ⚠ 7 | ⚠ 9 | ⚠ 1 | ✓ |
| Galaxy Tab S8 ngang | 1280×800 @2x | ✓ | ✓ | ⚠ 14 | ⚠ 7 | ⚠ 9 | ✓ | ✓ |
| Galaxy Tab S9 Ultra ngang | 1848×1176 @1.6x | ✓ | ✓ | ⚠ 14 | ⚠ 7 | ⚠ 10 | ⚠ 1 | ✓ |
| Pixel 3 | 393×786 @2.75x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ⚠ 1 | ✓ |
| Pixel 4 | 353×745 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ✓ | ✓ |
| Pixel 5 | 393×851 @2.75x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| Pixel 6 / 7 / 8 | 412×915 @2.6x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ✓ | ✓ |
| Pixel 7 Pro | 412×892 @3.5x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 9 | ⚠ 1 | ✓ |
| Pixel 8 Pro / 9 Pro XL | 448×998 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 5 | ⚠ 1 | ✓ |
| Pixel 9 / 9 Pro | 412×923 @2.6x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ✓ | ✓ |
| Pixel Tablet ngang | 1280×800 @2x | ✓ | ✓ | ⚠ 14 | ⚠ 7 | ⚠ 10 | ⚠ 1 | ✓ |
| Xiaomi Redmi Note 8 / 9 | 393×851 @2.75x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| Xiaomi Redmi Note 10–13 | 393×873 @2.75x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ⚠ 1 | ✓ |
| Xiaomi 13 / 14 | 393×851 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 5 | ⚠ 1 | ✓ |
| Xiaomi Poco X3 / X5 | 393×873 @2.75x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ✓ | ✓ |
| Xiaomi Pad 6 dọc | 800×1280 @2.25x | ✓ | ✓ | ⚠ 8 | ⚠ 7 | ⚠ 9 | ✓ | ✓ |
| OPPO A54 / A57 / A78 | 360×800 @2x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 2 | ⚠ 1 | ✓ |
| OPPO Reno 8 / 10 | 360×800 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ✓ | ✓ |
| OPPO Find X5 | 412×915 @3.5x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 9 | ⚠ 1 | ✓ |
| vivo Y20 / Y36 | 360×800 @2x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 2 | ⚠ 1 | ✓ |
| realme 8 / C55 | 360×800 @2x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 2 | ⚠ 1 | ✓ |
| Huawei P30 / P30 Pro | 360×780 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ⚠ 1 | ✓ |
| OnePlus 9 / 11 | 412×919 @2.6x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 4 | ⚠ 1 | ✓ |
| Sony Xperia 5 | 360×840 @3x | ✓ | ✓ | ⚠ 7 | ⚠ 8 | ⚠ 3 | ⚠ 1 | ✓ |
| Android ngang (412×915) | 915×412 @2.6x | ✓ | ✓ | ⚠ 8 | ⚠ 7 | ⚠ 10 | ✓ | ✓ |

### Laptop

| Thiết bị | Viewport | Tràn ngang | Chữ cắt/đè | Vùng chạm nhỏ | Chữ nhỏ | Ảnh mờ | Lỗi JS | Che nội dung |
|---|---|---|---|---|---|---|---|---|
| Laptop HD 1366×768 – trình duyệt | 1366×657 @1x | ✓ | ✓ | — | ✓ | ⚠ 1 | ⚠ 1 | ✓ |
| Laptop HD 1366×768 – toàn màn hình | 1366×768 @1x | ✓ | ✓ | — | ✓ | ⚠ 1 | ⚠ 1 | ✓ |
| Laptop 1280×720 | 1280×720 @1x | ✓ | ✓ | — | ✓ | ⚠ 1 | ⚠ 1 | ✓ |
| Laptop 1280×800 (Chromebook) | 1280×800 @1x | ✓ | ✓ | — | ✓ | ⚠ 1 | ⚠ 1 | ✓ |
| Laptop 1440×900 – trình duyệt | 1440×789 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Laptop FHD @125% – trình duyệt | 1536×730 @1.25x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Laptop FHD @125% – toàn màn hình | 1536×864 @1.25x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Laptop 1600×900 – trình duyệt | 1600×789 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Laptop FHD @100% – trình duyệt | 1920×969 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Laptop FHD @150% – trình duyệt | 1280×595 @1.5x | ✓ | ✓ | — | ✓ | ⚠ 8 | ⚠ 1 | ✓ |
| Surface Laptop 13.5 – trình duyệt | 1504×893 @1.5x | ✓ | ✓ | — | ✓ | ⚠ 8 | ✓ | ✓ |
| Laptop WUXGA 1920×1200 @150% | 1280×720 @1.5x | ✓ | ✓ | — | ✓ | ⚠ 9 | ⚠ 1 | ✓ |
| Laptop 2560×1600 @200% | 1280×800 @2x | ✓ | ✓ | — | ✓ | ⚠ 9 | ✓ | ✓ |
| Laptop màn thấp 1366×600 | 1366×600 @1x | ✓ | ✓ | — | ✓ | ⚠ 1 | ⚠ 1 | ✓ |

### Màn hình rời

| Thiết bị | Viewport | Tràn ngang | Chữ cắt/đè | Vùng chạm nhỏ | Chữ nhỏ | Ảnh mờ | Lỗi JS | Che nội dung |
|---|---|---|---|---|---|---|---|---|
| Màn 1024×768 (4:3) | 1024×768 @1x | ✓ | ✓ | — | ✓ | ⚠ 1 | ⚠ 1 | ✓ |
| Màn 1280×1024 (5:4) | 1280×1024 @1x | ✓ | ✓ | — | ✓ | ⚠ 3 | ⚠ 1 | ✓ |
| Màn 1360×768 | 1360×768 @1x | ✓ | ✓ | — | ✓ | ⚠ 1 | ⚠ 1 | ✓ |
| Màn 1600×900 | 1600×900 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ✓ | ✓ |
| Màn 1680×1050 | 1680×1050 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Màn FHD 1920×1080 | 1920×1080 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Màn 1920×1200 | 1920×1200 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Màn 2048×1152 | 2048×1152 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Màn QHD 2560×1440 | 2560×1440 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Màn 2560×1600 | 2560×1600 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ✓ | ✓ |
| Màn 4K @150% (2560×1440) | 2560×1440 @1.5x | ✓ | ✓ | — | ✓ | ⚠ 9 | ⚠ 1 | ✓ |
| Màn 4K @200% (1920×1080) | 1920×1080 @2x | ✓ | ✓ | — | ✓ | ⚠ 10 | ⚠ 1 | ✓ |
| Màn 4K @100% (3840×2160) | 3840×2160 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Ultrawide 2560×1080 | 2560×1080 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Ultrawide 3440×1440 | 3440×1440 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Ultrawide 3840×1600 | 3840×1600 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Super ultrawide 5120×1440 | 5120×1440 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| Màn dọc 1080×1920 | 1080×1920 @1x | ✓ | ✓ | — | ✓ | ⚠ 3 | ⚠ 1 | ✓ |
| Màn dọc 1440×2560 | 1440×2560 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ⚠ 1 | ✓ |
| 5K 5120×2880 @200% | 2560×1440 @2x | ✓ | ✓ | — | ✓ | ⚠ 10 | ⚠ 1 | ✓ |

### TV

| Thiết bị | Viewport | Tràn ngang | Chữ cắt/đè | Vùng chạm nhỏ | Chữ nhỏ | Ảnh mờ | Lỗi JS | Che nội dung |
|---|---|---|---|---|---|---|---|---|
| Smart TV HD (720p) | 1280×720 @1x | ✓ | ✓ | — | ✓ | ⚠ 1 | ✓ | ✓ |
| Smart TV FHD (trình duyệt TV 960×540 @2x) | 960×540 @2x | ✓ | ✓ | — | ✓ | ⚠ 9 | ⚠ 1 | ✓ |
| Smart TV FHD 1920×1080 | 1920×1080 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ✓ | ✓ |
| Android TV / Google TV (960×540) | 960×540 @2x | ✓ | ✓ | — | ✓ | ⚠ 9 | ⚠ 1 | ✓ |
| Smart TV 4K (1920×1080 @2x) | 1920×1080 @2x | ✓ | ✓ | — | ✓ | ⚠ 10 | ⚠ 1 | ✓ |
| Smart TV 4K 3840×2160 | 3840×2160 @1x | ✓ | ✓ | — | ✓ | ⚠ 6 | ✓ | ✓ |

## 4. Tương tác A → B → A (tab, nút chọn, dropdown)

| Thiết bị | Trang | Khối | Các lựa chọn đã bấm | Chiều cao khối (px) | Nhảy | Ghi chú |
|---|---|---|---|---|---|---|
| iPhone SE (2nd/3rd) | / | hinhanh | Ngoại cảnh 13 → Tiện ích 19 → Căn hộ mẫu 24 → Ngoại cảnh 13 | 554 / 554 / 554 / 554 | ✓ 0 |  |
| iPhone SE (2nd/3rd) | / | mat-bang | Studio 35,2 m² → 1PN+ 52,2 – 52,6 m² → Duplex 167,7 – 193,8 m² → Studio 35,2 m² | 2195 / 2195 / 2219 / 2195 | ⚠ 24 |  |
| iPhone SE (2nd/3rd) | / | chinh-sach-ban-hang | Thanh toán vay → Thanh toán chuẩn → Vay đặc biệt → Thanh toán vay | 1025 / 946 / 1091 / 1025 | ⚠ 145 |  |
| iPhone SE (2nd/3rd) | /mat-bang | mat-bang | THÁP SENSA A → TẤT CẢ LOẠI HÌNH → Tháp Sensa A · 20 căn / tầng C → THÁP SENSA A | 661 / 661 / 661 / 661 | ✓ 0 |  |
| iPhone SE (2nd/3rd) | /mat-bang | loai-can-ho | Studio 35,2 m² → 1PN+ 52,2 – 52,6 m² → Duplex 167,7 – 193,8 m² → Studio 35,2 m² | 2461 / 2461 / 2768 / 2461 | ⚠ 307 |  |
| iPhone SE (2nd/3rd) | /tien-ich | tien-ich | 1 → 1 → 15 Điểm đỗ xe (dự kiến) → 1 | 1039 / 1039 / 1039 / 1039 | ✓ 0 | 1 ảnh lỗi |
| iPhone SE (2nd/3rd) | /tien-ich | hinhanh | Ngoại cảnh 13 → Tiện ích 19 → Căn hộ mẫu 24 → Ngoại cảnh 13 | 506 / 506 / 506 / 506 | ✓ 0 | 1 ảnh lỗi |
| iPhone 15 / 15 Pro | / | hinhanh | Ngoại cảnh 13 → Tiện ích 19 → Căn hộ mẫu 24 → Ngoại cảnh 13 | 739 / 739 / 739 / 739 | ✓ 0 |  |
| iPhone 15 / 15 Pro | / | mat-bang | Studio 35,2 m² → 1PN+ 52,2 – 52,6 m² → Duplex 167,7 – 193,8 m² → Studio 35,2 m² | 2276 / 2302 / 2326 / 2276 | ⚠ 50 |  |
| iPhone 15 / 15 Pro | / | chinh-sach-ban-hang | Thanh toán vay → Thanh toán chuẩn → Vay đặc biệt → Thanh toán vay | 1070 / 987 / 1115 / 1070 | ⚠ 128 |  |
| iPhone 15 / 15 Pro | /mat-bang | mat-bang | THÁP SENSA A → TẤT CẢ LOẠI HÌNH → Tháp Sensa A · 20 căn / tầng C → THÁP SENSA A | 642 / 642 / 642 / 642 | ✓ 0 |  |
| iPhone 15 / 15 Pro | /mat-bang | loai-can-ho | Studio 35,2 m² → 1PN+ 52,2 – 52,6 m² → Duplex 167,7 – 193,8 m² → Studio 35,2 m² | 2469 / 2494 / 2809 / 2469 | ⚠ 340 |  |
| iPhone 15 / 15 Pro | /tien-ich | tien-ich | 1 → 1 → 15 Điểm đỗ xe (dự kiến) → 1 | 965 / 965 / 965 / 965 | ✓ 0 | 1 ảnh lỗi |
| iPhone 15 / 15 Pro | /tien-ich | hinhanh | Ngoại cảnh 13 → Tiện ích 19 → Căn hộ mẫu 24 → Ngoại cảnh 13 | 595 / 595 / 595 / 595 | ✓ 0 | 1 ảnh lỗi |
| Galaxy S22 / S23 / S25 | / | hinhanh | Ngoại cảnh 13 → Tiện ích 19 → Căn hộ mẫu 24 → Ngoại cảnh 13 | 667 / 667 / 667 / 667 | ✓ 0 |  |
| Galaxy S22 / S23 / S25 | / | mat-bang | Studio 35,2 m² → 1PN+ 52,2 – 52,6 m² → Duplex 167,7 – 193,8 m² → Studio 35,2 m² | 2222 / 2247 / 2273 / 2222 | ⚠ 51 |  |
| Galaxy S22 / S23 / S25 | / | chinh-sach-ban-hang | Thanh toán vay → Thanh toán chuẩn → Vay đặc biệt → Thanh toán vay | 1095 / 1022 / 1137 / 1095 | ⚠ 115 |  |
| Galaxy S22 / S23 / S25 | /mat-bang | mat-bang | THÁP SENSA A → TẤT CẢ LOẠI HÌNH → Tháp Sensa A · 20 căn / tầng C → THÁP SENSA A | 650 / 650 / 650 / 650 | ✓ 0 |  |
| Galaxy S22 / S23 / S25 | /mat-bang | loai-can-ho | Studio 35,2 m² → 1PN+ 52,2 – 52,6 m² → Duplex 167,7 – 193,8 m² → Studio 35,2 m² | 2433 / 2458 / 2762 / 2433 | ⚠ 329 |  |
| Galaxy S22 / S23 / S25 | /tien-ich | tien-ich | 1 → 1 → 15 Điểm đỗ xe (dự kiến) → 1 | 1026 / 1026 / 1026 / 1026 | ✓ 0 | 1 ảnh lỗi |
| Galaxy S22 / S23 / S25 | /tien-ich | hinhanh | Ngoại cảnh 13 → Tiện ích 19 → Căn hộ mẫu 24 → Ngoại cảnh 13 | 561 / 561 / 561 / 561 | ✓ 0 | 1 ảnh lỗi |
| iPad 10th / Air 4-5 dọc | / | hinhanh | Ngoại cảnh 13 → Tiện ích 19 → Căn hộ mẫu 24 → Ngoại cảnh 13 | 1067 / 1067 / 1067 / 1067 | ✓ 0 |  |
| iPad 10th / Air 4-5 dọc | / | mat-bang | Studio 35,2 m² → 1PN+ 52,2 – 52,6 m² → Duplex 167,7 – 193,8 m² → Studio 35,2 m² | 2356 / 2356 / 2329 / 2356 | ⚠ 27 |  |
| iPad 10th / Air 4-5 dọc | / | chinh-sach-ban-hang | Thanh toán vay → Thanh toán chuẩn → Vay đặc biệt → Thanh toán vay | 1067 / 1067 / 1067 / 1067 | ✓ 0 |  |
| iPad 10th / Air 4-5 dọc | /mat-bang | mat-bang | THÁP SENSA A → TẤT CẢ LOẠI HÌNH → Tháp Sensa A · 20 căn / tầng C → THÁP SENSA A | 872 / 872 / 872 / 872 | ✓ 0 |  |
| iPad 10th / Air 4-5 dọc | /mat-bang | loai-can-ho | Studio 35,2 m² → 1PN+ 52,2 – 52,6 m² → Duplex 167,7 – 193,8 m² → Studio 35,2 m² | 2203 / 2203 / 2360 / 2203 | ⚠ 157 |  |
| iPad 10th / Air 4-5 dọc | /tien-ich | tien-ich | 1 → 1 → 15 Điểm đỗ xe (dự kiến) → 1 | 1383 / 1383 / 1383 / 1383 | ✓ 0 | 1 ảnh lỗi |
| iPad 10th / Air 4-5 dọc | /tien-ich | hinhanh | Ngoại cảnh 13 → Tiện ích 19 → Căn hộ mẫu 24 → Ngoại cảnh 13 | 858 / 858 / 858 / 858 | ✓ 0 | 1 ảnh lỗi |
| Laptop HD 1366×768 – trình duyệt | / | hinhanh | Ngoại cảnh 13 → Tiện ích 19 → Căn hộ mẫu 24 → Ngoại cảnh 13 | 581 / 581 / 581 / 581 | ✓ 0 |  |
| Laptop HD 1366×768 – trình duyệt | / | mat-bang | Studio 35,2 m² → 1PN+ 52,2 – 52,6 m² → Duplex 167,7 – 193,8 m² → Studio 35,2 m² | 1542 / 1517 / 1542 / 1542 | ⚠ 25 |  |
| Laptop HD 1366×768 – trình duyệt | / | chinh-sach-ban-hang | Thanh toán vay → Thanh toán chuẩn → Vay đặc biệt → Thanh toán vay | 581 / 581 / 581 / 581 | ✓ 0 |  |
| Laptop HD 1366×768 – trình duyệt | /mat-bang | mat-bang | THÁP SENSA A → TẤT CẢ LOẠI HÌNH → TẤT CẢ LOẠI HÌNH → THÁP SENSA A | 704 / 704 / 704 / 704 | ✓ 0 |  |
| Laptop HD 1366×768 – trình duyệt | /mat-bang | loai-can-ho | Studio 35,2 m² → 1PN+ 52,2 – 52,6 m² → Duplex 167,7 – 193,8 m² → Studio 35,2 m² | 1684 / 1658 / 1684 / 1684 | ⚠ 26 |  |
| Laptop HD 1366×768 – trình duyệt | /tien-ich | tien-ich | 1 → 1 → 15 Điểm đỗ xe (dự kiến) → 1 | 842 / 842 / 842 / 842 | ✓ 0 | 1 ảnh lỗi |
| Laptop HD 1366×768 – trình duyệt | /tien-ich | hinhanh | Ngoại cảnh 13 → Tiện ích 19 → Căn hộ mẫu 24 → Ngoại cảnh 13 | 581 / 581 / 581 / 581 | ✓ 0 | 1 ảnh lỗi |
| Màn FHD 1920×1080 | / | hinhanh | Ngoại cảnh 13 → Tiện ích 19 → Căn hộ mẫu 24 → Ngoại cảnh 13 | 1004 / 1004 / 1004 / 1004 | ✓ 0 |  |
| Màn FHD 1920×1080 | / | mat-bang | Studio 35,2 m² → 1PN+ 52,2 – 52,6 m² → Duplex 167,7 – 193,8 m² → Studio 35,2 m² | 1795 / 1795 / 1795 / 1795 | ✓ 0 |  |
| Màn FHD 1920×1080 | / | chinh-sach-ban-hang | Thanh toán vay → Thanh toán chuẩn → Vay đặc biệt → Thanh toán vay | 1004 / 1004 / 1004 / 1004 | ✓ 0 |  |
| Màn FHD 1920×1080 | /mat-bang | mat-bang | THÁP SENSA A → TẤT CẢ LOẠI HÌNH → TẤT CẢ LOẠI HÌNH → THÁP SENSA A | 886 / 886 / 886 / 886 | ✓ 0 |  |
| Màn FHD 1920×1080 | /mat-bang | loai-can-ho | Studio 35,2 m² → 1PN+ 52,2 – 52,6 m² → Duplex 167,7 – 193,8 m² → Studio 35,2 m² | 1716 / 1716 / 1716 / 1716 | ✓ 0 |  |
| Màn FHD 1920×1080 | /tien-ich | tien-ich | 1 → 1 → 15 Điểm đỗ xe (dự kiến) → 1 | 1070 / 1070 / 1070 / 1070 | ✓ 0 | 1 ảnh lỗi |
| Màn FHD 1920×1080 | /tien-ich | hinhanh | Ngoại cảnh 13 → Tiện ích 19 → Căn hộ mẫu 24 → Ngoại cảnh 13 | 856 / 856 / 856 / 856 | ✓ 0 | 1 ảnh lỗi |
| Màn QHD 2560×1440 | / | hinhanh | Ngoại cảnh 13 → Tiện ích 19 → Căn hộ mẫu 24 → Ngoại cảnh 13 | 1364 / 1364 / 1364 / 1364 | ✓ 0 |  |
| Màn QHD 2560×1440 | / | mat-bang | Studio 35,2 m² → 1PN+ 52,2 – 52,6 m² → Duplex 167,7 – 193,8 m² → Studio 35,2 m² | 1966 / 1966 / 1966 / 1966 | ✓ 0 |  |
| Màn QHD 2560×1440 | / | chinh-sach-ban-hang | Thanh toán vay → Thanh toán chuẩn → Vay đặc biệt → Thanh toán vay | 1364 / 1364 / 1364 / 1364 | ✓ 0 |  |
| Màn QHD 2560×1440 | /mat-bang | mat-bang | THÁP SENSA A → TẤT CẢ LOẠI HÌNH → TẤT CẢ LOẠI HÌNH → THÁP SENSA A | 977 / 977 / 977 / 977 | ✓ 0 |  |
| Màn QHD 2560×1440 | /mat-bang | loai-can-ho | Studio 35,2 m² → 1PN+ 52,2 – 52,6 m² → Duplex 167,7 – 193,8 m² → Studio 35,2 m² | 1820 / 1820 / 1820 / 1820 | ✓ 0 |  |
| Màn QHD 2560×1440 | /tien-ich | tien-ich | 1 → 1 → 15 Điểm đỗ xe (dự kiến) → 1 | 1185 / 1185 / 1185 / 1185 | ✓ 0 | 1 ảnh lỗi |
| Màn QHD 2560×1440 | /tien-ich | hinhanh | Ngoại cảnh 13 → Tiện ích 19 → Căn hộ mẫu 24 → Ngoại cảnh 13 | 887 / 887 / 887 / 887 | ✓ 0 | 1 ảnh lỗi |

## 5. Cần kiểm trên máy thật

- Safari iOS (iPhone SE, 14/15, 17 Pro Max): thanh địa chỉ co giãn khi cuộn, `svh/dvh` của hero và mặt bằng, bàn phím ảo khi nhập form/popup.
- iPad Safari (chế độ desktop mặc định từ iPadOS 13 — nhận UA Mac): kiểm tra menu và scroll-snap không bật nhầm.
- Samsung Internet và trình duyệt Zalo/Facebook in-app: nút Gọi/Zalo, popup, form.
- Smart TV (Tizen/webOS/Android TV): điều khiển bằng remote (phím mũi tên, focus rõ), chữ đủ lớn khi xem từ xa.
- Máy cấu hình yếu (Galaxy A, J): độ mượt khi cuộn, hiệu ứng coverflow, bản đồ.

## 6. Đã sửa sau audit (14–15/11/2026) và kết quả kiểm lại

Lượt kiểm lại: 12 thiết bị đại diện × 14 trang = 168 lượt (`tmp/audit-devices/results-recheck.json`): **0** tràn ngang, 0 chữ cắt/đè, 0 ảnh lỗi, 0 lỗi JS, 0 nội dung ẩn, 0 chữ quá nhỏ, 0 ảnh mặt bằng bị cắt.

| Lỗi | Phạm vi | Cách sửa |
|---|---|---|
| Hero ẩn tiêu đề/CTA 1,5–4 giây khi tải | mọi thiết bị | Hiệu ứng ngắn 0,8s, bắt đầu từ opacity 0,25 (`park-template.css`) |
| Hero bị cắt mất mô tả + CTA khi xoay ngang | điện thoại ngang | `min-height` thay `height` |
| Nút 35px, chữ ~11px do `zoom` 0,8 | 93 thiết bị cảm ứng | `fitSections.js` không thu nhỏ trên `pointer: coarse` |
| Bản đồ vị trí tràn ngang ~105px | desktop 1440 | Cố định bề rộng theo cột lưới |
| Lỗi SVG `NaN` trên bản đồ | trang chủ, /vi-tri | Sửa toạ độ đường vẽ |
| Ảnh sơ đồ tiện ích 404 (`map-p` đã xoá) | /tien-ich | Dùng ảnh mới `utility.webp` (bản 1280/1920/2880), hiện trọn 16:9 dưới header; chấm số tạm ẩn chờ toạ độ mới |
| Sơ đồ tiện ích bị cắt đáy | laptop thấp 1366×657 | Giới hạn bề rộng theo chiều cao khung nhìn |
| Vùng chạm < 44px: footer, “Xem chi tiết”, tag tin tức, breadcrumb, “Cuộn để khám phá”, chấm phân trang, link thẻ tháp | điện thoại, tablet | `min-height` 44px |
| Chữ 11px: thanh CTA đáy, nhãn số liệu, chú thích ảnh đầu trang, ngày tin, diện tích tab | điện thoại | 12px |
| Dòng > 110 ký tự | màn 1440 trở lên | Giới hạn 75ch ở trang chi tiết, bài viết, ghi chú |
| Ảnh mặt bằng đầu trang /mat-bang bị cắt | mọi thiết bị | `object-fit: contain` cho ảnh bản vẽ |
| Khối CSBH nhảy 115–145px khi đổi tab | điện thoại | Xếp chồng 5 phương thức, khung cao cố định |
| Tab CSBH phải cuộn ngang | điện thoại | Lưới 3 + 2 |

**Báo nhầm đã kiểm chứng bằng tay (không sửa):** nút có vệt sáng `::after` (scrollWidth giả); link inline xuống dòng trong đoạn văn; “ảnh mờ” do audit giả lập DPR = 1 nên trình duyệt chọn bản 800px (máy thật DPR 2–3 sẽ chọn bản 1600px); ảnh tin tức từ `media.sachicloud.io.vn` lỗi vì Chromium audit không có mạng (curl trả 200).

**Còn lại, chấp nhận:** nhãn ô form (`<label>` cao 21px; ô nhập bên dưới đã 48px); ô căn trên sơ đồ mặt bằng tương tác nhỏ hơn 44px trên điện thoại (đã có danh sách mã căn và bảng 40 căn để chọn thay); tiêu đề bài viết dài chưa vừa màn hình đầu ở iPhone SE 320px và điện thoại ngang; ảnh đại diện tin tức từ CMS chỉ có một cỡ 640px, có thể hơi mờ trên màn 3x (cần tải ảnh lớn hơn trong CMS).
