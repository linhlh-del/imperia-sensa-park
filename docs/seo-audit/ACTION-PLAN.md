# SEO Action Plan — Imperia Sensa Park

Xem chi tiết và bằng chứng trong [FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md). Health score hiện tại: **83/100**.

## Đã xong (13/11/2026)
- [x] Ảnh responsive 800w/1400w cho carousel + thẻ tiện ích (`scripts/optimize-responsive.py` → `public/assets/responsive/park/`)
- [x] Sửa H1 trang chủ và H2 "Chủ động kế hoạch" bị dính chữ
- [x] `Image.jsx` tra kích thước ảnh với src đã mã hoá URL (hết thiếu width/height ở carousel)
- [x] Tương phản chữ section tiện ích (nền imperia-primary)

## High (trong 1 tuần)
1. **Chuyển `createRoot` → `hydrateRoot` trong `src/main.jsx`** cho các trang đã prerender, để React tận dụng DOM sẵn có thay vì vẽ lại (giảm LCP mobile). Cần kiểm tra hydration mismatch, vì các phần đọc `window` / ngày giờ phải chạy trong `useEffect`.
2. **Đo lại trên Vercel** bằng PageSpeed Insights sau khi deploy (server local không nén), làm mốc so sánh.

## Medium (trong 1 tháng)
3. Schema `ApartmentComplex`: thêm `geo`, `numberOfAccommodationUnits`, loại căn.
4. Schema `Organization` MIK Group: thêm `url`, `sameAs` (kênh chính thức).
5. Tác giả bài tin: Person / đơn vị phân phối có trang giới thiệu; dẫn nguồn văn bản chủ đầu tư.
6. Khối / trang pháp lý dự án (giấy phép, pháp nhân chủ đầu tư).
7. Tách bundle: lazy-load FloorPlan, LoanCalculator, News (ước tính bỏ 174 KB JS khỏi trang chủ).
8. Tương phản chữ trên nền #646A44 ở section Vị trí và Chính sách bán hàng: đổi chữ phụ sang trắng ≥ 88% hoặc nền sang #4D5538 (cùng bảng màu Sensa). Cần duyệt vì là màu thương hiệu.
9. `llms.txt`: liệt kê đủ 6 trang chủ đề + số liệu định lượng có nguồn.

## Low (backlog)
10. Đổi `<h2>` ở footer thành `<p>` / `<h3>` dạng nhãn.
11. Tự lưu ảnh bài tin (đang lấy từ `media.sachicloud.io.vn`).
12. Bổ sung width/height cho 4 ảnh trang con mà seo-check còn cảnh báo.

## Theo dõi
- Chạy `npm run seo:check` sau mỗi build (đã có trong `npm run build`).
- Sau deploy: Search Console (index coverage, Core Web Vitals field data) khi có quyền truy cập.
