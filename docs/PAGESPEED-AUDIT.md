# PageSpeed / Lighthouse local — 12/11/2026

> Báo cáo trước lần đổi hero sang overview.webp và chỉnh layout/CTA theo phản hồi. Không dùng điểm dưới đây làm điểm của bản giao diện mới.

Đo trang chủ `http://127.0.0.1:4173/`, build production phục vụ bằng Vite preview; Puppeteer Chrome và Lighthouse13.6.0 cài sẵn ở dự án Qtopia. Mobile mô phỏng mặc định, desktop preset desktop, throttling theo configSettings trong từng JSON. Không chạy đồng thời audit UI. CMS/lead chưa cấu hình. Đây là phép đo lab local, không phải PageSpeed Vercel, CrUX hay trải nghiệm người dùng thật.

| Bản đo | Thời điểm UTC | Performance | Accessibility | SEO | LCP (s) | TBT (ms) | CLS | Transfer (MB) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [Trước — mobile](audit/lighthouse-before.json) | 2026-11-12T07:25:23.461Z | 47 | 94 | 100 | 6.30 | 3805 | 0.0000 | 2.54 |
| [Sau — mobile](audit/lighthouse-final-mobile.json) | 2026-11-12T08:44:30.201Z | 60 | 97 | 100 | 3.89 | 1801 | 0.0034 | 0.54 |
| [Sau — desktop](audit/lighthouse-final-desktop.json) | 2026-11-12T08:44:42.145Z | 60 | 97 | 100 | 3.70 | 2390 | 0.0000 | 0.54 |

Mỗi dòng là một lần chạy, chưa phải median3 lần. Các lượt đo trung gian dao động do timing/CPU/render: mobile49–60, desktop55–74; không chọn điểm cao nhất làm kết quả cuối. Không có baseline desktop tương ứng để khẳng định cải thiện desktop. Transfer màn đầu giảm khoảng79% (2,54MB xuống0,54MB); LCP mobile lần đo cuối thấp hơn baseline nhưng vẫn chưa đạt2,5s. Performance60 chưa đạt mục tiêu90. TBT còn cao, chưa coi tối ưu hiệu năng đã hoàn tất.

## Những thay đổi có bằng chứng

- Bản đồ SVG (~427KB JS trước gzip) không còn tải lúc đứng tại hero. Test network đã xác nhận chunk/ảnh map chưa được request. Tải khi gần viewport, ảnh location3840 ~678KB thay vì bản7680 ~1,44MB.
- Hero và tổng quan có srcset480/800/1200; logo128. Hero eager/high priority. Giữ nguyên ảnh gốc và CMS override, bỏ preload ảnh cố định gây tải thừa khi srcset/CMS chọn nguồn khác.
- Ảnh nội dung có kích thước thực và lazy mặc định; giảm shift. Font gốc không thay đổi.
- Animation map/CSS dừng ngoài viewport, tab ẩn và reduced-motion; hero text không chờ hiệu ứng xuất hiện. Không giữ thử nghiệm content-visibility vì chưa chứng minh lợi ích ổn định.
- Accessibility97: sửa accessible name marker/Zalo, menu/popup focus/Escape, vùng chọn tiện ích mobile. Lỗi color-contrast vẫn còn; một subtitle vị trí từng đo khoảng4,03:1. Không thay màu nhận diện để chạy theo điểm.

## Công việc hiệu năng tiếp theo

Đo production mobile/desktop ít nhất3 lần với cùng cấu hình; ưu tiên /, /vi-tri, /mat-bang. Trace tác vụ JS, style/layout và các animation SVG/filter còn hoạt động trong viewport; cân nhắc tách floorplan/gallery theo bằng chứng. Đo cache/CDN/nén trên Vercel, không suy ra từ server local. CMS/analytics thật có thể làm kết quả khác.

INP không được kết luận từ Lighthouse load/TBT. Kiểm Core Web Vitals bằng Search Console/CrUX khi có đủ dữ liệu. Tham khảo [web.dev — Web Vitals](https://web.dev/articles/vitals). Mục tiêu tham chiếu: LCP≤2,5s, INP≤200ms, CLS≤0,1 ở percentile75 dữ liệu thực tế.

## UI và build

- Build18/18; SEO14URL, 0 lỗi/0 cảnh báo.
- UI56 tổ hợp (14URL×375/768/1024/1440): không tràn ngang, một H1, không lỗi JS/ảnh đã tải bị hỏng. Đây là kiểm đầu trang tự động, không chứng nhận mọi pixel toàn trang.
- 10 kiểm tra tương tác đạt. Bổ sung320/360px, gallery portal/focus/Escape, HTML không JS và404 local đạt.
- Screenshots đã xem: hero mobile/desktop, map desktop, FAQ mobile trong `audit/screenshots`.
- Chưa kiểm Safari/Firefox/thiết bị thật, OG preview, lead thật hay Vercel production.
