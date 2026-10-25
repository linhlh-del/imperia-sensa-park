---
name: seo-landing-page-bds
description: Checklist và quy tắc khi tạo/kiểm tra landing page bất động sản (HTML/CSS/JS thuần) chuẩn SEO, tốc độ và chuyển đổi. Dùng khi dựng trang mới hoặc audit trang dự án.
---

# CHECKLIST LANDING PAGE BẤT ĐỘNG SẢN CHUẨN SEO (Vanilla HTML/CSS/JS)

**Vai trò:** Front-end Developer + Technical SEO Specialist. Chỉ dùng HTML5, CSS3, JavaScript ES6+. Không framework nặng, không thư viện không cần thiết.

---

## 1. Thẻ `<head>` và metadata

- [x] `<meta charset="UTF-8">`
- [x] `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [x] `<meta name="robots" content="index, follow">`
- [x] **Title (tối đa 60 ký tự)** theo công thức: `[Tên dự án] + [Chủ đầu tư/Vị trí] + [Giá trị/Từ khóa chính]`
- [x] **Meta description (150-160 ký tự)**: có từ khóa địa phương, số liệu (quy mô, mật độ, tiện ích), và CTA rõ ràng
- [x] **Open Graph đầy đủ**: `og:type`, `og:title`, `og:description`, `og:image` (ảnh tuyệt đối, khoảng 1200x630), `og:url` (để chia sẻ đẹp trên Zalo/Facebook)
- [x] `<link rel="canonical"
  > Có canonical cho trang chủ, 4 trang con và trang tin tức (RouteSeo + prerender). Domain hiện dùng `imperia-sensa-park.vercel.app` — đổi `SITE_URL` trong `src/lib/seo.js` + `index.html` khi có tên miền chính thức. href="https://tenmien.com/...">` (URL thật của trang)
- [x] Đếm ký tự title/description bằng công cụ trước khi chốt (không đoán)

**Mẫu head:**

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index, follow">
<title>[Tên dự án] [Chủ đầu tư] | [Loại hình + Vị trí] [Từ khóa]</title>
<meta name="description" content="[Tên dự án] từ [CĐT]. [Quy mô, mật độ, vị trí]. Đăng ký nhận bảng giá và ưu đãi ngay!">
<link rel="canonical" href="https://tenmien.com/">
<meta property="og:type" content="website">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://tenmien.com/og-image.webp">
<meta property="og:url" content="https://tenmien.com/">
```

---

## 2. HTML ngữ nghĩa và cấu trúc nội dung

- [x] **Đúng 1 thẻ `<h1>`**: từ khóa chính + địa danh hành chính (vd: "Căn hộ Norton Park Gamuda Land - Đại lộ Bình Dương")
- [x] `<h2>` cho mục chính: Vị trí, Tiện ích, Mặt bằng, Bảng giá, Tiến độ. `<h3>` cho mục con. **Không nhảy từ h2 xuống h4**
- [x] **Không đặt câu văn nghệ/slogan vào thẻ heading.** Slogan để trong `<p>` hoặc `<span>`; heading dành cho từ khóa tìm kiếm
  - Sai: `<h2>Vũ khúc hoa trong gió</h2>`
  - Đúng: `<h2>Hệ thống tiện ích nội khu Norton Park</h2>` + `<p>Vũ khúc hoa trong gió...</p>`
- [x] Mọi `<img>` có `alt` mô tả, chứa từ khóa (vd: `alt="Phối cảnh hồ bơi tràn bờ dự án Norton Park"`)
- [x] Dùng thẻ semantic: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- [x] Địa chỉ/địa giới hành chính nhất quán ở mọi nơi (liên hệ, FAQ, footer, schema)

### ⚠️ Kiểm tra địa giới hành chính (Local SEO)

- [x] Đối chiếu phường/xã
  > Đã đối chiếu (10/2026): phường Phước Long, TP.HCM (gộp từ Phước Long B cũ, TP. Thủ Đức) theo sắp xếp ĐVHC 2025., quận/thành phố, tỉnh/thành với **danh mục đơn vị hành chính hiện hành** trước khi publish
- [x] Lưu ý: Việt Nam đã sắp xếp lại đơn vị hành chính năm 2025 (có sáp nhập tỉnh, bỏ cấp huyện). Một số góp ý cũ cho rằng "Phường Thuận Giao thuộc Bình Dương, không phải TP.HCM" có thể **đã lỗi thời**. Cần kiểm tra lại nguồn chính thống thay vì tự sửa theo cảm tính
- [x] Nếu dùng tên cũ làm từ khóa tìm kiếm (Quận 9, Thuận An, Thủ Đức...), đặt trong nội dung dạng "(trước đây là...)" và vẫn ghi địa chỉ chính thức hiện hành
- [x] Địa chỉ trên trang khớp với Google Business Profile
  > Khớp giữa schema `ApartmentComplex`, popup, footer (thêm `<address>`), trang /vi-tri. Chưa có Google Business Profile để đối chiếu. / Schema (nếu có)

---

## 3. UI/UX, thẩm mỹ cao cấp, tốc độ

- [x] CSS Variables trong `:root` cho màu, font, khoảng cách, transition
- [x] Font sans-serif sạch (Inter, Montserrat), `line-height` 1.6-1.8
- [x] Section có padding dọc tối thiểu 80px trên desktop; layout bằng CSS Grid/Flexbox
- [x] Ảnh nội dung dùng **.webp** đã nén; khai báo `width`/`height` hoặc giữ tỉ lệ bằng khung aspect-ratio để tránh nhảy layout (CLS)
- [x] `loading="lazy"` cho ảnh nội dung từ giữa trang trở xuống (ảnh hero/above-the-fold **không** lazy)
- [x] Mobile-first: `@media (max-width: 768px)`, vùng chạm tối thiểu **48x48px**, chữ dễ đọc
- [x] **Không nhúng iframe nặng** (tour 360°, Google Maps) vào DOM ban đầu. Dùng ảnh preview + nút CTA mở tab mới (`target="_blank" rel="noopener"`)
- [x] File bảng giá/mặt bằng nặng
  > Ảnh layout từng căn chỉ tải khi chọn căn/loại hình; mặt bằng tổng `loading="lazy"`; các layout .png còn lại đã chuyển sang bản `.optimized.webp`. (vd: 63 mặt bằng) chỉ tải khi người dùng bấm xem
- [x] CSS/JS tách file riêng
  > Đã gỡ inline style tĩnh (gradient hero, nền form, scroll-snap tin tức) sang class CSS. Chỉ còn `style` cho giá trị tính động (toạ độ polygon, màu loại căn, animation delay) — không tách được trong React.; không inline style, không inline script

> Đã tạo 63 bản WebP tối ưu, giảm tổng dung lượng ảnh từ khoảng 89 MiB xuống 23 MiB; giữ nguyên file gốc. Chưa chuyển mặt bằng chính sang click-to-load để không đổi cách tương tác hiện tại. Còn một số inline style phục vụ vị trí/animation động nên không đánh dấu tiêu chí inline CSS/JS.

---

## 4. Chuyển đổi (CRO) và tương tác

- [x] **Form 3 trường**
  > Form #lien-he và popup chỉ còn Họ tên + SĐT + nút "Nhận bảng giá".: Họ tên, Số điện thoại, nút gửi (vd: "Nhận bảng giá"). Không form nhiều bước ở các section chính
- [x] Form khảo sát chi tiết
  > Form chọn loại căn + ngân sách chỉ có ở trang /bang-gia. (loại căn, layout, ngân sách) chỉ đặt ở trang/mục "Bảng tính giá"
- [x] Validate số điện thoại Việt Nam
  > `src/lib/lead.js`: chấp nhận 0/+84, đầu số 03/05/07/08/09; báo lỗi native; gửi hợp lệ chuyển sang màn hình "Cảm ơn bạn đã đăng ký". phía client; có thông báo gửi thành công
- [x] **Sticky bar mobile**
  > `MobileStickyBar` trong `FloatingButton.jsx` (< 768px, nút cao 48px); `body` có `padding-bottom` + safe-area; cụm nút nổi chỉ hiện từ tablet trở lên. cố định đáy màn hình với 3 nút: **Gọi hotline | Chat Zalo | Nhận bảng giá**; đảm bảo không che nội dung quan trọng (thêm `padding-bottom` cho `body`)
- [x] **Công cụ tương tác**
  > `LoanCalculator.jsx`: ước tính vốn tự có, khoản vay, trả tháng đầu (gốc đều) và trả đều (niên kim). Có ở trang chủ và /bang-gia. bằng JS thuần (ước tính vay/giá, tính trả góp) để tăng thời gian trên trang

---

## 5. Cấu trúc site và chiến lược nội dung (tùy chọn, nâng cao)

- [x] Trang chủ giữ vai trò landing page tổng quan (tốt cho chạy ads)
- [x] Muốn SEO nhiều từ khóa
  > Đã tạo /vi-tri, /tien-ich, /mat-bang, /bang-gia (+ /tin-tuc sẵn có). Chưa làm /tien-do vì chưa có dữ liệu tiến độ thật.: tách thành trang con có URL riêng (`/vi-tri`, `/tien-ich`, `/mat-bang`, `/bang-gia`, `/tien-do`, `/tin-tuc`), mỗi trang tối ưu một nhóm từ khóa ngách (vd: "Mặt bằng chi tiết căn hộ Norton Park")
- [x] Mỗi trang con có title
  > Cấu hình tại `SUBPAGES` (`src/lib/seo.js`), prerender ra HTML tĩnh và có trong sitemap.xml., description, h1, canonical riêng
- [x] Có mục Blog/Tin tức viết trực tiếp trên site (vd: "Đánh giá tiềm năng đầu tư căn hộ khu vực X năm 2026"), **internal link** về trang bảng giá/đăng ký
- [x] Hạn chế dẫn link ra báo ngoài
  > Không có link báo ngoài; link Zalo/Facebook share mở tab mới với `noopener`. ở vị trí nổi bật; nếu cần thì mở tab mới và thêm `rel="noopener"` (có thể thêm `nofollow` tùy mục tiêu)
- [x] Có `sitemap.xml` và `robots.txt`
- [x] Cân nhắc JSON-LD schema (`RealEstateListing`/`Organization`/`FAQPage`) cho FAQ và thông tin liên hệ

---

## 6. Quy tắc xuất code (cho AI)

> Không áp dụng nguyên văn: dự án dùng React + Vite + Tailwind (đã có từ trước), không viết lại sang HTML/CSS/JS thuần. Bù lại: build prerender HTML tĩnh cho mọi route để crawler đọc được nội dung không cần JS; code mới có comment theo khối.

- [ ] Xuất 3 file tách biệt: `index.html`, `style.css`, `script.js` (hoặc một file thống nhất có chú thích rõ)
- [ ] Code có comment rõ từng khối
- [ ] Không CSS/JS inline trong thẻ HTML
- [ ] Nhẹ, nhanh, không phụ thuộc framework

---

## 7. Kiểm tra trước khi publish

- [x] Đúng 1 `<h1>`
  > Đã kiểm tra 12 trang prerender: mỗi trang đúng 1 h1, không nhảy cấp heading, 0 ảnh thiếu alt., thứ tự heading hợp lệ
- [x] Title ≤ 60 ký tự, description 150-160 ký tự (đã đếm thực tế)
- [x] Tất cả ảnh có alt; ảnh dưới màn hình đầu có lazy
- [x] Địa chỉ/địa giới nhất quán và đúng theo đơn vị hành chính hiện hành
- [ ] Test OG preview (Facebook Sharing Debugger, Zalo)
- [ ] Test Lighthouse/PageSpeed trên mobile (mục tiêu điểm Performance và SEO cao)
- [ ] Test sticky bar, form, nút gọi/Zalo trên điện thoại thật
- [ ] Canonical, sitemap, robots đã đúng domain thật
  > Đang thống nhất theo `imperia-sensa-park.vercel.app`. Các mục Test OG / Lighthouse / điện thoại thật cần làm thủ công sau khi deploy.
