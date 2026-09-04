# Imperia Sensa Park — React + Vite + Tailwind

Landing page được tách theo section/component, sẵn sàng mở rộng thành CMS.

## Kiến trúc

```text
src/
├── App.jsx
├── main.jsx
├── index.css
├── data/
│   └── project.js              # content/config — sau này thay bằng API/CMS
├── hooks/
├── components/
│   ├── layout/
│   │   ├── Brand.jsx
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── SectionHeading.jsx
│   │   └── LeadPopup.jsx
│   └── sections/
│       ├── Hero.jsx             # 01
│       ├── Overview.jsx         # 02
│       ├── Location.jsx         # 03
│       ├── Amenities.jsx        # 04
│       ├── FloorPlan.jsx        # 05
│       ├── Apartments.jsx       # 06
│       ├── News.jsx             # 07
│       └── LeadSection.jsx      # 08
└── public/assets/               # ảnh thật đưa vào đây
```

## CMS-ready rule

Mỗi section có `id` + `data-section`. Các item có `data-cms-item`; field hình ảnh dùng `data-cms-field`.

Mục tiêu giai đoạn CMS:
- Section visibility / order / layout
- Background + spacing + typography
- Text / number / CTA
- Image / gallery / floor-plan
- Custom CSS theo section
- Content không hard-code trong component

## Chạy

```bash
npm install
npm run dev
npm run build
```
