# SEO Audit — Imperia Sensa Park (bản build local)

- **Ngày:** 13/11/2026
- **Đối tượng:** bản build production local (`dist-local/`, HTML prerender tĩnh), phục vụ tại `http://127.0.0.1:4174`. Domain canonical trong HTML: `https://imperia-sensa-park.vercel.app`.
- **Công cụ:** quy trình skill `seo-audit` (claude-seo v2.6.0), quét 18 file HTML prerender, `scripts/seo-check.mjs` của dự án, Lighthouse 13 (mobile + desktop, giả lập throttling).
- **Giới hạn:** fetcher của claude-seo chặn địa chỉ nội bộ (chống SSRF), nên trang được phân tích trực tiếp từ HTML đã prerender (giống hệt nội dung bot nhận được). Không có dữ liệu thực (CrUX / Search Console / backlink) cho bản local. Server tĩnh local không nén gzip/brotli, nên số đo mobile **bi quan hơn** so với khi chạy trên Vercel.

## Tóm tắt

| | |
|---|---|
| **SEO Health Score** | **83 / 100** |
| Loại hình | Landing page dự án bất động sản (căn hộ, MIK Group), có trang chủ đề và tin tức |
| Lighthouse mobile | Performance 73 · Accessibility 97 · Best Practices 100 · SEO 100 · Agentic Browsing 100 |
| Lighthouse desktop | Performance 95 · Accessibility 97 · Best Practices 100 · SEO 100 |

| Hạng mục | Trọng số | Điểm |
|---|---|---|
| Technical SEO | 22% | 88 |
| Content Quality | 23% | 78 |
| On-Page SEO | 20% | 90 |
| Schema | 10% | 75 |
| Performance (CWV, lab) | 10% | 70 |
| AI Search Readiness | 10% | 85 |
| Images | 5% | 85 |

### Đã sửa trong lượt audit này (lỗi do bố cục Norton mới gây ra)

| Vấn đề | Trước | Sau |
|---|---|---|
| Ảnh carousel / thẻ tiện ích tải bản gốc 0,5–0,9 MB, tranh băng thông với ảnh hero | Trang chủ 5,0 MB, LCP mobile 11,2 s, Perf 66 | 1,4 MB, LCP mobile 7,4 s, Perf 73 |
| H1 trang chủ dính chữ do `<br/>` không có khoảng trắng | "IMPERIASENSA PARK — …" | "IMPERIA SENSA PARK — …" |
| H2 "Chủ động kế hoạch.Sẵn sàng tổ ấm." dính chữ | dính | có khoảng trắng |
| 5 ảnh carousel không có width/height (`Image.jsx` tra bảng kích thước bằng src đã mã hoá URL) | 5 ảnh/trang | 0 (seo-check: còn 4 cảnh báo ở trang con, có từ trước) |
| Chữ beige / trắng 80% trên nền olive #646A44 (section tiện ích) không đạt tương phản | fail | nền đổi sang imperia-primary #4D5538 (màu Sensa có sẵn) |

## Technical SEO — 88

**Ổn:** robots.txt cho phép toàn bộ + khai báo sitemap; sitemap 14 URL, đủ `lastmod`, khớp đúng các trang `index`; trang pháp lý / cảm ơn / 404 đều `noindex, follow`; mỗi trang có canonical tuyệt đối; route lạ trả mã 404 thật; HTML prerender đầy đủ nội dung (bot không cần chạy JS); `vercel.json` có X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy, CSP, COOP; cache dài cho asset.

**Vấn đề:**
- **High — `main.jsx` dùng `createRoot` thay vì `hydrateRoot`.** React vẽ lại toàn bộ DOM đã prerender sau khi tải xong JS. Lighthouse mobile ghi nhận LCP có ~620 ms "element render delay" chủ yếu từ việc này, và nội dung có thể nháy khi thay DOM.
- **Medium — bundle chính 437 KB (≈134 KB gzip), Lighthouse ước tính 174 KB JS không dùng ở trang chủ.** Bản đồ vị trí đã tách chunk; có thể tách tiếp FloorPlan / LoanCalculator / News.
- **Low —** CSS 80 KB chặn render (ước tính tiết kiệm ~20 ms, ưu tiên thấp).

## Content Quality — 78

**Ổn:** trang chủ ~1.800 từ, các trang chủ đề 1.000–1.300 từ, bài tin 900–1.400 từ; mỗi trang chủ đề có mục lục + FAQ; ghi chú "thông tin tham khảo" rõ ràng (tín hiệu tin cậy cho YMYL bất động sản); có ngày cập nhật nội dung.

**Vấn đề:**
- **Medium — E-E-A-T:** tác giả bài tin là Organization "Imperia Sensa Park". Nên ghi rõ đơn vị phân phối / người biên tập (tên, vai trò) và nguồn thông tin gốc (văn bản chủ đầu tư, giấy phép).
- **Medium —** chưa có trang / khối về pháp lý dự án (giấy phép xây dựng, chủ đầu tư pháp nhân), một tín hiệu quan trọng với truy vấn BĐS.
- **Low —** ảnh bài tin lấy từ domain ngoài (`media.sachicloud.io.vn`); nếu domain này đổi thì mất ảnh và mất `og:image`.

## On-Page SEO — 90

**Ổn:** 14 trang index đều có title 48–60 ký tự và description 152–157 ký tự (đúng khuyến nghị); mỗi trang đúng 1 H1 chứa từ khoá + địa danh; đủ 12 thẻ Open Graph + Twitter card; liên kết nội bộ 11–16 URL/trang, footer liên kết đủ trang chủ đề.

**Vấn đề:**
- **Low —** footer dùng `<h2>` cho "Dự án" / "Khám phá", làm phân cấp heading của mọi trang có thêm 2 H2 không mang nội dung.
- **Low —** trang chủ có 25 H3 (tên tiện ích, bước chính sách, tiêu đề tin); chấp nhận được nhưng nên giữ H3 cho tiêu đề có giá trị tìm kiếm.

## Schema — 75

**Có:** Organization, WebSite, WebPage, ApartmentComplex (trang chủ); FAQPage + WebPage + BreadcrumbList (trang chủ đề); NewsArticle + BreadcrumbList (bài tin); CollectionPage (tin tức). JSON-LD đều hợp lệ.

**Thiếu:**
- **Medium —** `ApartmentComplex` chưa có `geo` (GeoCoordinates) và `numberOfAccommodationUnits` / `containsPlace` (loại căn).
- **Medium —** `Organization` (MIK Group) chưa có `url` và `sameAs` (website, Facebook, LinkedIn chính thức), làm yếu nhận diện thực thể (entity).
- **Low —** `NewsArticle.author` nên là Person hoặc Organization phân phối có `url`.

## Performance — 70 (lab)

| | Mobile (lần 1) | Mobile (sau sửa) | Desktop |
|---|---|---|---|
| FCP | 1,4 s | 1,4 s | 0,3 s |
| LCP | 11,2 s | 7,4 s | 1,5 s |
| TBT | 130 ms | 120 ms | 0 ms |
| CLS | 0 | 0 | 0,001 |
| Tổng tải | 5,0 MB | 1,4 MB | 1,5 MB |

Phần LCP mobile còn lại chủ yếu do render lại sau khi JS chạy (`createRoot`) và JS chưa nén ở server local. Trên Vercel (có brotli) số liệu sẽ tốt hơn; nên đo lại bằng PageSpeed Insights sau khi deploy.

## AI Search Readiness — 85

**Ổn:** có `llms.txt` mô tả dự án, chủ đầu tư, vị trí, loại căn; robots không chặn bot AI; Lighthouse Agentic Browsing 100; nhiều FAQ dạng câu hỏi–trả lời ngắn, dễ trích dẫn.

**Nên làm:** bổ sung số liệu định lượng có nguồn (diện tích đất, số căn, số tầng, mật độ xây dựng) vào đoạn mở đầu của `/tong-quan` và `llms.txt`; liệt kê `/tong-quan`, `/vi-tri`, `/tien-ich`, `/mat-bang`, `/bang-gia`, `/faq` trong mục "Trang chính" của `llms.txt` (hiện mới có trang chủ + tin tức).

## Images — 85

Không có ảnh thiếu `alt` (ảnh trang trí dùng `alt=""` đúng chuẩn); ảnh dưới màn hình đầu đều `loading="lazy"`; hero dùng `fetchpriority="high"` + srcset. Còn 4 trang con có 1 ảnh thiếu width/height (seo-check cảnh báo, có từ trước).

## Accessibility (ảnh hưởng gián tiếp)

Lighthouse vẫn báo một số chữ chưa đủ tương phản ở các section có sẵn từ trước, dùng nền olive #646A44 (`bg-imperia-background-dark`): ghi chú vị trí (`.location-note`, chữ trắng 75%), chính sách bán hàng (`.decision-heading`, `.policy-steps`). Đây là màu thương hiệu, nên chưa sửa; xem ACTION-PLAN.md.
