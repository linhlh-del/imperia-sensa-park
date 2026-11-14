# Những mục còn phải xác minh

12/11/2026. Không đánh dấu đạt chỉ vì có code.

## Trước phát hành

- [ ] Chủ nội dung đối chiếu số liệu ~5 ha, 2 tháp, 922 căn, 40+ tiện ích, địa chỉ/pháp nhân/hotline và 6 bài tin với tài liệu Sensa. Nội dung mới không xác nhận thay hồ sơ dự án.
- [ ] Xác nhận VITE_SITE_URL, build với CMS production, kiểm nội dung/metadata/schema sau CMS override.
- [ ] Cấu hình VITE_LEAD_ENDPOINT; gửi form thật từ từng vị trí, xác nhận backend nhận đúng UTM; API lỗi không được báo thành công.
- [ ] Kiểm Vercel: URL sitemap trả200, URL sai trả404 thật, alias đúng; redirect HTTP/HTTPS và hostname; cache/nén asset; không dùng build:spa.
- [ ] Kiểm GA4/GTM Preview/DebugView, page_view không trùng, generate_lead chỉ sau thành công, key events. Chuẩn hóa thêm cta_target, section_view, view_floorplan nếu dùng báo cáo chi tiết.
- [ ] Duyệt nội dung bảo mật/điều khoản, đơn vị liên hệ và lựa chọn consent phù hợp cách vận hành thực tế.
- [ ] Kiểm Facebook/Zalo preview và Rich Results Test trên URL deploy.
- [ ] Test iOS Safari, Android Chrome/Samsung Internet, Firefox; bàn phím ảo, menu, popup, map và floorplan.

## Hiệu năng và accessibility

- [ ] Chưa đạt Performance mobile90. Đo lại PageSpeed production, ít nhất3 lần/route ưu tiên; trace JS/render nếu TBT còn cao. Không dùng số lab một lần làm dữ liệu người dùng thật.
- [ ] Còn lỗi color contrast (Lighthouse A11y97). Giữ nguyên màu theo phạm vi hiện tại; xử lý trong đợt được phép điều chỉnh nhận diện/kiểu chữ.
- [ ] Bundle chính vẫn chứa nhiều section; xem xét tách gallery/floorplan sau khi đo route và kiểm không ảnh hưởng prerender.
- [ ] Chưa hoàn tất lint độc lập, chuẩn hóa mọi animation token và kiểm mọi vùng chạm48px.

## Sau phát hành

- [ ] Search Console: xác minh property, gửi sitemap, kiểm URL Inspection, Pages và Core Web Vitals.
- [ ] Đối chiếu lead theo nguồn với GA4; kiểm organic impressions/CTR sau1–2 tuần.
- [ ] Cập nhật lastmod theo sửa nội dung thật; không tạo trang tiến độ/pháp lý/bảng giá số khi chưa có nguồn.

Không triển khai Vercel, không commit/push, không thay đổi tài khoản bên ngoài trong đợt audit local này.
