# Audit và checklist Imperia Sensa Park

Cập nhật 12/11/2026. Áp dụng cho `sensa-park-new`, không sửa dự án Qtopia. Giữ màu, font và ảnh gốc của Sensa; chỉ thêm kích thước ảnh dẫn xuất, sửa template, nội dung bổ trợ, SEO, accessibility và tải trang.

Nguồn đối chiếu: `qtopia-landing/QTOPIA-SEO-AUDIT.md`, `QTOPIA-SEO-LANDING-CHECKLIST.md`, `PAGESPEED-OPTIMIZATION-CHECKLIST.md`, `docs/KNOWLEDGE-BASE.md`, `docs/QTOPIA-REVIEW-DE-XUAT-2026-11.md`, `docs/RESPONSIVE-DEVICES.md`, `docs/TODO-CHECKLIST.md`, `docs/SEO-P2-KE-HOACH-NOI-DUNG.md`. Không chuyển số liệu, pháp lý, màu/font, ảnh, GA ID hay cấu hình VPS riêng của Qtopia sang Sensa.

## Thay đổi đã áp dụng

- Trang chủ và sáu trang chủ đề: tổng quan, vị trí, tiện ích, mặt bằng, bảng giá, FAQ. Bổ sung mục lục, đoạn giải thích, bảng đọc thông tin, FAQ và liên kết nội bộ. Giá và công cụ vay được diễn đạt là thông tin cần xác nhận/ước tính.
- Prerender 18 trang; sitemap 14 URL indexable. Trang cảm ơn, chính sách, điều khoản và 404 không index. Build thất bại nếu prerender hoặc SEO gate thất bại.
- Kiểm HTML build: title/description riêng, một H1, canonical, OG, JSON-LD, ảnh có alt/kích thước. FAQ schema dùng chung nguồn với nội dung hiển thị.
- Popup và menu có Escape, quản lý focus; gallery lightbox portal lên body để không bị clipping bởi section. Sửa tràn tablet, marker tiện ích mobile và mục lục bị điều hướng nhầm về trang chủ.
- Form thiếu endpoint báo lỗi; chỉ ghi nhận chuyển đổi khi API xác nhận thành công. Có first-touch attribution, click/scroll events; không gửi tên/số điện thoại vào analytics.
- Hero ưu tiên tải đúng srcset; map SVG tải khi gần viewport, animation dừng ngoài màn hình/reduced-motion. Bản đồ giữ lớp nền nâu → ảnh nền → SVG.

## Bằng chứng và giới hạn

`npm run build`: 18/18 trang; `seo:check`: 14 URL, 0 lỗi, 0 cảnh báo. Kết quả máy đọc trong [audit/seo-results.json](audit/seo-results.json), [audit/ui-results.json](audit/ui-results.json), [audit/interaction-results.json](audit/interaction-results.json). Điểm tốc độ và giới hạn xem [PAGESPEED-AUDIT.md](PAGESPEED-AUDIT.md). Các trạng thái “Đạt local” không đồng nghĩa đã kiểm tra trên Vercel hoặc Google đã index.

## Đối chiếu từng tiêu chí Qtopia

Đạt local = đã có source/build hoặc kiểm thử cục bộ. Một phần = còn thiếu một phần tiêu chí. Cần xác minh = phụ thuộc dữ liệu, tài khoản, thiết bị hoặc production; không tự tick đạt.

| ID | Trạng thái | Tiêu chí áp dụng cho Sensa | Bằng chứng / giới hạn |
| --- | --- | --- | --- |
| 1.1 | Đạt local | `lang="vi"`, `charset="UTF-8"`, viewport, `robots` phù hợp từng route. | Đã kiểm tra source/build local. |
| 1.2 | Cần xác minh | Domain chính thức Imperia Sensa Park được cấu hình nhất quán trong canonical, OG URL, sitemap, robots và schema. | Code dùng một SITE_URL; cần chốt domain Vercel/custom domain thực tế. |
| 1.3 | Đạt local | Mỗi route có title riêng, ưu tiên từ khóa ở đầu, mục tiêu ≤ 60 ký tự. | Đã kiểm tra source/build local. |
| 1.4 | Đạt local | Mỗi route có description riêng, đúng nội dung, mục tiêu 150–160 ký tự; có thông tin cụ thể và CTA tự nhiên. | Đã kiểm tra source/build local. |
| 1.5 | Cần xác minh | Open Graph đủ `og:type`, `og:title`, `og:description`, `og:image` 1200×630, `og:url`; kiểm tra Facebook/Zalo. | Đủ metadata build; chưa kiểm tra preview Facebook/Zalo. |
| 1.6 | Đạt local | Canonical tự trỏ cho trang indexable; trang 404 noindex và không vào sitemap. | Đã kiểm tra source/build local. |
| 1.7 | Đạt local | Đếm độ dài title/description từ HTML build, không chỉ từ config. | Đã kiểm tra source/build local. |
| 2.1 | Đạt local | Mỗi route đúng một H1; H2/H3 theo thứ bậc; slogan để trong đoạn văn nếu không mô tả chủ đề. | Đã kiểm tra source/build local. |
| 2.2 | Đạt local | Dùng `header`, `nav`, `main`, `section`, `footer`; có liên kết bỏ qua menu cho bàn phím. | Đã kiểm tra source/build local. |
| 2.3 | Đạt local | Ảnh nội dung có alt mô tả đúng ảnh; ảnh trang trí dùng alt rỗng đúng cách. | Đã kiểm tra source/build local. |
| 2.4 | Cần xác minh | Tên dự án, chủ đầu tư, vị trí và số liệu nhất quán giữa nội dung, metadata, schema, form và footer. | Giữ dữ liệu Sensa hiện có; cần chủ dự án đối chiếu số liệu. |
| 2.5 | Cần xác minh | Xác minh địa chỉ Imperia Sensa Park, đơn vị hành chính hiện hành và tên địa danh cũ bằng nguồn chính thức; đối chiếu Google Business Profile nếu có. | Chưa đối chiếu đơn vị hành chính bằng hồ sơ chính thức trong đợt này. |
| 2.6 | Cần xác minh | Những thông tin giá, pháp lý, tiến độ và cam kết đầu tư chỉ xuất bản khi có tài liệu xác thực. | Nội dung mới không thêm giá/pháp lý/cam kết; dữ liệu và tin hiện có vẫn cần chủ nội dung duyệt. |
| 2.7 | Cần xác minh | Đối chiếu từng số liệu và tên pháp nhân với hồ sơ chính thức của Sensa, ghi rõ phạm vi dự án/giai đoạn nếu số liệu khác nhau. | Cần tài liệu pháp lý của Sensa, không dùng tài liệu Qtopia. |
| 2.8 | Cần xác minh | Đối chiếu loại hình sản phẩm trong nội dung và schema với hồ sơ Sensa. | Cần đối chiếu loại hình Sensa với hồ sơ; không sao chép “căn hộ du lịch” của Qtopia. |
| 3.1 | Một phần | Màu, font, thời lượng hiệu ứng gom trong CSS variables; giao diện mobile trước, lưới co giãn tốt. | Giữ nguyên token màu/font; duration còn nằm ở nhiều component. |
| 3.2 | Một phần | Chữ thân dễ đọc (`line-height` khoảng 1,6–1,8); khoảng trắng đủ thoáng; CTA đạt vùng chạm tối thiểu 48×48 px. | Đã sửa vùng chạm tiện ích mobile; chưa kiểm toán mọi control đạt 48 px. |
| 3.3 | Đạt local | Ảnh được nén và dùng WebP/AVIF khi phù hợp; có `width`/`height` hoặc aspect ratio. | Đã kiểm tra source/build local. |
| 3.4 | Đạt local | Ảnh hero được ưu tiên (`fetchpriority="high"`, không lazy); ảnh dưới màn đầu lazy. | Đã kiểm tra source/build local. |
| 3.5 | Đạt local | Không tải iframe, PDF, bảng giá hoặc mặt bằng nặng trước khi cần. | Đã kiểm tra source/build local. |
| 3.6 | Một phần | CSS/JS build thành file riêng, chia bundle theo route nếu có lợi và loại bỏ thư viện không dùng. | Đã tách chunk bản đồ; bundle ứng dụng chính còn lớn. |
| 4.1 | Đạt local | Form ngắn gồm họ tên, số điện thoại và nút gửi; có label, báo lỗi rõ và validate số Việt Nam. | Đã kiểm tra source/build local. |
| 4.2 | Cần xác minh | Form chỉ báo thành công sau khi hệ nhận lead xác nhận; kiểm tra lead thật end to end. | Đã chặn thành công giả; chưa có endpoint để gửi lead thật end-to-end. |
| 4.3 | Đạt local | Mobile có CTA cố định phù hợp: khám phá giá trị chính, gọi, Zalo, nhận thông tin/bảng giá. | Đã kiểm tra source/build local. |
| 4.4 | Đạt local | Có đường tới vị trí, tiện ích, mặt bằng, giá hoặc tư vấn, tùy dữ liệu Imperia Sensa Park thật. | Đã kiểm tra source/build local. |
| 4.5 | Đạt local | Nếu có công cụ tính vay/giá, kết quả và điều kiện tính minh bạch, không trình bày như giá chào bán chính thức khi chưa xác minh. | Đã kiểm tra source/build local. |
| 5.1 | Đạt local | Trang chủ giới thiệu tổng quan Imperia Sensa Park; các route con chỉ tạo khi có nội dung thật (ví dụ `/vi-tri`, `/tien-ich`, `/mat-bang`, `/bang-gia`, `/tin-tuc`, `/tien-do`). | Đã kiểm tra source/build local. |
| 5.2 | Đạt local | Mỗi route có title, description, H1, canonical và OG riêng. | Đã kiểm tra source/build local. |
| 5.3 | Đạt local | Tin tức chỉ index khi là bài thật; bài mẫu/lorem ipsum không đưa vào sitemap. | Đã kiểm tra source/build local. |
| 5.4 | Đạt local | Internal link dùng văn bản mô tả trang đích; không lạm dụng liên kết ra ngoài. | Đã kiểm tra source/build local. |
| 5.5 | Cần xác minh | `sitemap.xml` chỉ chứa URL 200 chính thức, có `lastmod`; `robots.txt` khai báo Sitemap và cho phép tải CSS/JS/ảnh. | 14 URL từ build, robots và lastmod; HTTP 200 production chờ deploy. |
| 5.6 | Cần xác minh | Có trang 404 trả HTTP 404 thật. | Có 404.html và bỏ catchall; HTTP 404 Vercel chờ deploy. |
| 6.1 | Đạt local | Giữ kiến trúc framework hiện có, tách component/dữ liệu/SEO/đo lường rõ ràng. | Đã kiểm tra source/build local. |
| 6.2 | Đạt local | Prerender hoặc SSR nội dung và metadata cho mọi route indexable; bot đọc được khi chưa chạy JS. | Đã kiểm tra source/build local. |
| 6.3 | Một phần | Không nhúng script hoặc style tĩnh không cần thiết vào HTML; giá trị động chỉ dùng inline khi hợp lý. | CSS/JS thành file build; SVG và inline style động còn dùng. |
| 6.4 | Một phần | Có lệnh build, lint và kiểm tra SEO build được ghi trong README. | Có build, seo:check, audit:ui; chưa có cấu hình lint độc lập. |
| 7.1 | Đạt local | Build sạch; kiểm tra HTML build của từng route: H1, title, description, alt, kích thước ảnh, canonical, OG, JSON-LD. | Đã kiểm tra source/build local. |
| 7.2 | Cần xác minh | Kiểm tra nội dung và số liệu dự án khớp tài liệu chủ đầu tư. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |
| 7.3 | Cần xác minh | Chạy Lighthouse/PageSpeed trên mobile và desktop; ghi kết quả theo URL và thời điểm. | Có Lighthouse local mobile/desktop, chưa có PageSpeed production từng route. |
| 7.4 | Cần xác minh | Kiểm tra OG preview trên Facebook/Zalo và các CTA/form trên điện thoại thật. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |
| 7.5 | Cần xác minh | Kiểm tra canonical, sitemap, robots sau khi gắn domain chính thức. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |
| 8.1 | Cần xác minh | Chốt domain Imperia Sensa Park, tạo property Domain và xác minh DNS; dùng URL prefix nếu chưa có domain riêng. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |
| 8.2 | Cần xác minh | Gửi sitemap, xác nhận trạng thái thành công; yêu cầu index các route chính. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |
| 8.3 | Cần xác minh | Kiểm tra Pages, URL Inspection, Core Web Vitals và các URL excluded ngoài ý muốn. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |
| 8.4 | Cần xác minh | Liên kết Search Console với GA4 và xem truy vấn, impressions, clicks, CTR hàng tuần. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |
| 9.1 | Cần xác minh | Cấu hình GTM và GA4 thực, test GTM Preview/GA4 DebugView; SPA gửi `page_view` đúng một lần mỗi route. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |
| 9.2 | Đạt local | Đo `generate_lead` chỉ sau gửi form thành công, có `form_location` và không gửi tên/số điện thoại vào analytics. | Đã kiểm tra source/build local. |
| 9.3 | Một phần | Đo `click_call`, `click_zalo`, `click_cta` (`cta_name`, `cta_location`, `cta_target`), `scroll_depth` 25/50/75/90 và `section_view`. | Có click_call, click_zalo, click_cta và scroll_depth; chưa chuẩn hóa đầy đủ cta_target/section_view giữa các tracker. |
| 9.4 | Một phần | Nếu có công cụ liên quan: đo `loan_calculator_use`, `view_floorplan`. | Có loan_calculator_use; chưa bổ sung view_floorplan riêng. |
| 9.5 | Cần xác minh | Đánh dấu các event chuyển đổi phù hợp là Key events trong GA4. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |
| 9.6 | Cần xác minh | Quy ước UTM viết thường, không dấu; gắn ở chiến dịch bên ngoài, không gắn internal link. | Dùng utm_source/medium/campaign/content/term viết thường, không dấu cho chiến dịch; chưa kiểm tra chiến dịch thật. |
| 9.7 | Cần xác minh | Lưu first-touch UTM và gửi kèm lead; đối chiếu nguồn lead với báo cáo GA4. | Đã kiểm tra first-touch tồn tại qua route; chờ đối chiếu lead thật với GA4. |
| 9.8 | Cần xác minh | Rà soát yêu cầu consent/cookie theo thị trường và cách triển khai thực tế. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |
| 10.1 | Cần xác minh | Lập bảng cho từng URL: URL \| từ khóa \| title \| description \| H1 \| OG image. | Có bảng metadata từ HTML build; từ khóa là chủ đề dự kiến, chưa có dữ liệu nhu cầu tìm kiếm. |
| 10.2 | Đạt local | Dưới H1/H2 có đoạn giải thích rõ, tự nhiên; section chính có ID ổn định và đoạn trả lời ngắn cho câu hỏi người tìm kiếm. | Đã kiểm tra source/build local. |
| 10.3 | Đạt local | Menu và internal link có mô tả/anchor text rõ; không dùng một loạt nhãn “Xem thêm”. | Đã kiểm tra source/build local. |
| 10.4 | Cần xác minh | JSON-LD khớp nội dung hiển thị: `WebSite`, `Organization`, loại dự án phù hợp, `BreadcrumbList`, `FAQPage` khi có FAQ thật. | JSON-LD parse/FAQ khớp build; thông tin thương mại cần đối chiếu nguồn. |
| 10.5 | Cần xác minh | Không điền địa chỉ/hotline/schema thương mại bằng dữ liệu mẫu; chạy Rich Results Test và Schema Markup Validator. | Chưa chạy Rich Results Test trên bản deploy và xác minh hotline/pháp nhân. |
| 10.6 | Một phần | OG image riêng cho các trang chính; sau index kiểm tra snippet thực tế vì Google có thể viết lại. | Giữ ảnh OG hiện có; chưa tạo ảnh riêng từng trang theo yêu cầu giữ hình. |
| 11.1 | Một phần | Thời lượng/easing tập trung trong biến CSS; hiệu ứng xuất hiện khoảng 0,8–1,2 s, hover khoảng 0,25–0,35 s khi phù hợp. | Chưa gom toàn bộ duration/easing thành token. |
| 11.2 | Một phần | Có stagger hợp lý; ưu tiên animate transform/opacity; hỗ trợ `prefers-reduced-motion`. | Có reduced-motion và pause ngoài viewport; một số SVG vẫn animate stroke/filter. |
| 11.3 | Đạt local | Nếu chọn cuộn từng section: dùng `svh/dvh`, snap phù hợp, xử lý section dài, footer và trang con cuộn tự nhiên. | Đã kiểm tra source/build local. |
| 11.4 | Cần xác minh | Anchor cuộn mượt và tránh header cố định; test chuột, bàn phím, iOS Safari, Android Chrome và desktop. | TOC/anchor local pass; iOS/Android thật chưa kiểm tra. |
| 11.5 | Đạt local | Nội dung vẫn hiện trong HTML prerender, không phụ thuộc animation để bot đọc được. | Đã kiểm tra source/build local. |
| 12.1 | Cần xác minh | Nút nổi icon ≥ 48×48 px có `aria-label`/`title`; nút lên đầu trang ẩn ở hero và hiện khi cuộn. | Có nhãn CTA nổi; chưa kiểm mọi kích thước/nút top trên thiết bị thật. |
| 12.2 | Một phần | CTA có hover, active, focus-visible, disabled phù hợp; độ tương phản chữ/nền tối thiểu 4,5:1. | Còn lỗi tương phản Lighthouse; giữ nguyên bảng màu theo yêu cầu. |
| 12.3 | Cần xác minh | Không che form/nội dung hoặc trùng với thanh CTA mobile; hiệu ứng pulse vừa phải và dừng khi giảm chuyển động. | Có reduced-motion, vùng đệm CTA mobile; cần thiết bị thật/keyboard mở. |
| 12.4 | Đạt local | Header mobile có CTA tư vấn nổi bật, không vỡ ở màn 320–360 px. | 320/360/375 px không tràn local; xem audit/additional-results.json. |
| 12.5 | Đạt local | CTA ở hero dẫn tới các giá trị chính của Imperia Sensa Park bằng link crawlable nếu là điều hướng; chốt tên nhãn và đích với nội dung thật. | Đã kiểm tra source/build local. |
| 12.6 | Một phần | Nếu có section bảng giá, có đường về các giá trị khác và giữ lựa chọn người dùng khi hợp lý. | Có liên kết chéo và công cụ ước tính; chưa lưu lựa chọn tính vay qua reload. |
| 12.7 | Một phần | Có CTA map: nhãn \| vị trí \| đích \| event; kiểm tra không bỏ sót CTA. | CTA map bên dưới là nhóm chính; chưa kiểm toán từng CTA/CMS variant. |
| 13.1 | Cần xác minh | Đo LCP, INP, CLS bằng dữ liệu thực tế; kiểm tra ảnh hero, font swap, kích thước khung, tác vụ JS dài. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |
| 13.2 | Cần xác minh | HTTPS và redirect về một hostname; cache dài cho asset có hash, gzip/brotli ở hosting. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |
| 13.3 | Cần xác minh | Favicon, manifest, theme-color, 404 đúng mã; không có redirect chain. | Có cấu hình asset và trang404; HTTP production chưa kiểm. |
| 13.4 | Cần xác minh | Điều hướng bàn phím và focus rõ; test Chrome, Safari iOS, Firefox, Samsung Internet; màn 375 px, tablet, desktop 1440 px. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |
| 13.5 | Cần xác minh | Kiểm tra lead thật, analytics thật, OG preview, schema, Lighthouse trước và sau publish. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |
| 13.6 | Cần xác minh | Sau 1–2 tuần: xem Search Console/GA4, cập nhật snippet, hiệu năng và tỷ lệ chuyển đổi. | Cần kiểm tra sau deploy, dữ liệu hoặc tài khoản/thiết bị thật. |

## Tài liệu đi kèm

[Metadata từng URL](SEO-METADATA.md) · [CTA map](CTA-MAP.md) · [Knowledge base](KNOWLEDGE-BASE.md) · [Việc cần xác minh](TODO-CHECKLIST.md).

Kiểm bổ sung: 320/360 px không tràn; lightbox portal/focus/Escape đạt; HTML vị trí có nội dung khi tắt JS; URL sai trả HTTP404 trên static server local. Xem [additional-results.json](audit/additional-results.json).
