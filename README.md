# Sensa Park New

Landing page dự án bất động sản Sensa Park được xây dựng bằng React + Vite + Tailwind CSS.

## Tổng quan

- Giao diện landing page cho dự án Sensa Park
- Được tổ chức theo từng section rõ ràng
- Có routing cho trang tin tức và chi tiết bài viết
- Hỗ trợ form lead, popup, floating CTA, và floor plan
- Tài nguyên hình ảnh lưu trong `public/assets`

## Stack công nghệ

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- CSS tùy biến theo design

## Cấu trúc thư mục hiện tại

```text
sensa-park-new/
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── README.md
├── dist/
│   └── (output build của Vite)
├── public/
│   └── assets/
│       ├── aparments/
│       │   ├── 1pn.png
│       │   ├── 2pn.png
│       │   ├── 3pn.png
│       │   └── studio.png
│       ├── layout/
│       │   ├── sensa-a.jpg
│       │   ├── sensa-A.png
│       │   ├── sensa-b.jpg
│       │   ├── sensa-B.png
│       │   └── sensaB.png
│       ├── services/
│       │   ├── 1.jpg
│       │   ├── 2.jpg
│       │   ├── 3.jpg
│       │   ├── 4.jpg
│       │   ├── 5.png
│       │   └── 6.png
│       ├── hero.png
│       ├── hero0.jpg
│       ├── hero1.png
│       ├── hero2.png
│       ├── lead-bg.jpg
│       ├── logo.png
│       ├── logo-zalo.webp
│       ├── map.jpg
│       ├── map-p.png
│       ├── overview.jpg
│       ├── popup.jpg
│       └── popup-hero.jpg
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Brand.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Header.jsx
│   │   ├── sections/
│   │   │   ├── Amenities.jsx
│   │   │   ├── ExclusiveSevices.jsx
│   │   │   ├── FeaturedAmenities.jsx
│   │   │   ├── FloorPlan.jsx
│   │   │   ├── GetInfor.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── LeadSection.jsx
│   │   │   ├── Location.jsx
│   │   │   ├── News.jsx
│   │   │   ├── Overview.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── ThankYouPage.jsx
│   │   │   └── ...
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── FloatingButton.jsx
│   │       ├── LeadPopup.jsx
│   │       ├── SectionHeading.jsx
│   │       └── Thankyou.jsx
│   ├── data/
│   │   ├── amenitiesMap.js
│   │   ├── dataAmenities.js
│   │   ├── newsData.js
│   │   ├── project.js
│   │   └── sensaAFloorData.js
│   ├── hooks/
│   │   └── (đang rỗng / đang phát triển)
│   ├── pages/
│   │   ├── NewsDetailPage.jsx
│   │   └── NewsPage.jsx
│   └── services/
│       └── newsService.js
└── node_modules/
    └── (dependencies cài đặt local)
```

## Thành phần chính

- `src/App.jsx`: cấu hình routing và render các section chính
- `src/data/project.js`: dữ liệu project chính
- `src/components/sections/*`: các section landing page
- `src/pages/*`: trang tin tức và chi tiết bài viết
- `public/assets/*`: hình ảnh, logo, floor plan, bnner, section media

## Chạy dự án

```bash
npm install
npm run dev
```

Mở trình duyệt tại địa chỉ được Vite hiển thị, thường là:

```text
http://localhost:5173
```

## Build production

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Ghi chú

- Tài nguyên hình ảnh nên được đặt trong `public/assets` để truy cập dễ dàng bằng đường dẫn `/assets/...`
- Dự án hiện đang có phần chức năng tin tức và lead form đã được tích hợp cơ bản
- Có thể tiếp tục mở rộng bằng CMS/API nếu muốn tách content ra khỏi code


## Audit Sensa — 12/11/2026

- [Checklist áp dụng từ Qtopia](docs/SENSA-AUDIT-CHECKLIST.md)
- [Knowledge base](docs/KNOWLEDGE-BASE.md)
- [PageSpeed local](docs/PAGESPEED-AUDIT.md)
- [Metadata từng URL](docs/SEO-METADATA.md)
- [CTA map](docs/CTA-MAP.md)
- [Mục còn cần xác minh](docs/TODO-CHECKLIST.md)

`npm run build` chạy fetch CMS, Vite, prerender và SEO gate. `npm run seo:check` kiểm lại HTML dist. `npm run preview:static` phục vụ dist với HTTP404 thật ở local; `npm run audit:ui` kiểm14 route ×4 viewport (đặt AUDIT_URL nếu dùng cổng4174). Chưa có lint script. Chi tiết lệnh và giới hạn trong knowledge base.
