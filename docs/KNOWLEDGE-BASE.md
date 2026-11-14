# Knowledge base — Sensa Park

Cập nhật 12/11/2026. Tham khảo quy trình Qtopia, giữ kiến trúc React/Vite/Tailwind và nhận diện Sensa.

## Nguồn nội dung

- Nội dung section: `src/cms/schema.js`, `src/cms/content.js`, dữ liệu trong `src/data`. CMS có thể ghi đè; mọi kiểm thử hiện dùng fallback vì local chưa cấu hình CMS.
- Nội dung chủ đề/FAQ: `src/data/topicContent.js`; giao diện `TopicContent.jsx`; FAQPage dùng cùng dữ liệu. Chỉ đổi CONTENT_UPDATED khi thực sự sửa nội dung.
- Metadata: `src/lib/seo.js`, `RouteSeo.jsx`. SITE_URL lấy `VITE_SITE_URL` trong môi trường build hoặc .env.production; mặc định domain Vercel hiện có. Không thêm hostname ở từng component.
- Không tự thêm giá, tiến độ, pháp lý, đơn vị quản lý, khoảng cách hoặc cam kết. Số liệu hiện có cần chủ nội dung đối chiếu hồ sơ Sensa; tài liệu Qtopia không phải nguồn cho Sensa.

## Template và routing

Trang chủ + 6 chủ đề (/tong-quan, /vi-tri, /tien-ich, /mat-bang, /bang-gia, /faq) + /tin-tuc + 6 bài = 14 URL sitemap. Thêm /cam-on, /chinh-sach-bao-mat, /dieu-khoan và 404 = 18 trang prerender. Ba trang tiện ích trên và 404 noindex. /lien-he, /tinh-tra-gop vẫn là alias section trang chủ.

Prerender là snapshot HTML qua Puppeteer, browser dùng createRoot; không phải SSR hydration. Build gate kiểm DOM HTML thực tế, không chỉ config. Không dùng build:spa để phát hành SEO. Vercel không còn catchall mọi URL về index, cần kiểm HTTP404 thực tế sau deploy.

## Nhận diện và hình ảnh

Giữ Tailwind palette, font SVN BonVoyage/Selecta, ảnh gốc. `scripts/optimize-responsive.py` tạo ảnh dẫn xuất cùng nội dung trong `public/assets/responsive`; không đổi ảnh gốc. Hero/Overview chỉ dùng srcset dẫn xuất khi CMS giữ nguồn mặc định. `Image.jsx` bổ sung width/height theo `imageDimensions.json`; cần cập nhật khi thay asset.

Hero dùng object-cover, object-position 60% top và không scale 1.1: giảm cắt phần trên ở các tỷ lệ viewport khác nhau. Object-cover vẫn có thể cắt cạnh để phủ khung. Chưa kết luận nguyên nhân độc lập trên Vercel nếu chưa so cùng viewport, CMS và build.

## Bản đồ

`Location.jsx` tải `LocationMap.jsx` khi gần viewport. `LocationMapSvg.jsx` chứa SVG; `locationMapData.js` chứa POI/nhóm; `LocationMap.css` quản lý lớp, filter và animation.

Thứ tự: nền nâu #6b4f3a → ảnh location (bản 3840 dẫn xuất từ location.webp gốc) → SVG đường/địa danh/POI → controls. Giữ màu ảnh gốc, không phủ sepia. Có 30 POI/6 nhóm, pan/zoom/reset, bộ lọc mobile, chuyển động tuyến. Dừng animation khi map khuất/tab ẩn hoặc reduced-motion.

## Form và analytics

`VITE_LEAD_ENDPOINT` phải trả HTTP thành công kèm JSON success=true. Thiếu endpoint/thất bại: thông báo lỗi, không chuyển trang cảm ơn và không ghi generate_lead. Chưa gửi lead thật trong audit này.

`attribution.js` giữ first-touch trong sessionStorage; lead nhận UTM, click IDs, referrer. Analytics không nhận tên/số điện thoại. `analytics.js` bổ sung conversion/click/scroll, không tự phát thêm page_view; GA/GTM cấu hình sẵn chịu trách nhiệm pageview. Phải kiểm DebugView để tránh trùng tracker. UTM chiến dịch dùng chữ thường, không dấu; không thêm UTM vào internal link.

## Lệnh kiểm tra

```powershell
npm run build
npm run seo:check
npm run preview:static
# cửa sổ terminal khác, static server cổng 4174
$env:AUDIT_URL='http://127.0.0.1:4174'
npm run audit:ui
```

`node scripts/audit-interactions.mjs` dùng preview cổng 4173, chỉ chạy với local chưa cấu hình endpoint (script có submit dữ liệu kiểm thử). `audit:ui` dùng Puppeteer có sẵn. Lighthouse trong đợt này dùng package cài sẵn của Qtopia, báo cáo JSON trong docs/audit; không thêm dependency mới vào Sensa. Chưa có lint script độc lập.

Sau CMS/domain/ảnh thay đổi: fetch/build lại, kiểm metadata, sitemap, UI, form và PageSpeed production. Xem [TODO-CHECKLIST.md](TODO-CHECKLIST.md) trước phát hành.


## Điều chỉnh layout theo phản hồi — 12/11/2026

Hero hiện dùng overview.webp (6000×3375), các bản dẫn xuất hero-overview-800/1600/2400. Desktop rộng đặt chữ trong vùng trời bên phải; mobile/tablet và desktop tỷ lệ hẹp tách ảnh/chữ để không che tòa nhà. Ảnh gốc được giữ nguyên. Cấu hình hero trước đây trong phần trên là lịch sử, không còn mô tả layout hiện tại.

Bỏ useSectionPaging khỏi trang chủ và bỏ min-height bắt buộc cho mọi section. Chỉ vị trí dùng --screen với khoảng cách dạng hàng, map co theo phần còn lại; màn quá thấp giữ chiều cao tối thiểu590px để điều khiển vẫn sử dụng được. Bỏ max-width17ch của tiêu đề tổng quan, giảm scale title, bỏ các trần chiều cao ảnh gây ảnh nhỏ. Ảnh giữ tỷ lệ.

TopicLink là nút CTA đến trang chi tiết; #anchor cuộn trong trang hiện tại hoặc về /#section nếu không có đích. Bổ sung chính sách bán hàng (hai lựa chọn hướng dẫn theo tiến độ/vay; chưa có số liệu ưu đãi) và FAQ accordion từ dữ liệu FAQ hiện có. Cả hai được khai báo trong HOME_SECTIONS để CMS có thể xếp/ẩn.

Bằng chứng mới: docs/audit/layout/verification.json —320/375/768/1024/1440/1920px không tràn, CTA anchor/detail route, tab chính sách, popup và FAQ đạt. Điểm Lighthouse đợt trước không đại diện cho bản hero/layout mới; chưa đo lại performance trong đợt chỉnh giao diện này.
