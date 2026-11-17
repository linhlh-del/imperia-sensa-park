/* ============================================================
   DANH SÁCH SỬA ĐƯỢC TRÊN CMS (thêm / xoá / đổi thứ tự / thay từng ảnh) — Imperia Sensa Park.
   Lõi xử lý: ./lists-core.js. section = id section trong src/cms/schema.js.
   key:
     "site.<đường dẫn>"      mảng trong src/data/project.js (đọc qua `site` của src/cms/content.js)
     "gallery.<nhóm>.items"  ảnh gallery (src/data/gallery.json) — đọc qua `cmsGallery`
     "amenities.<nhóm>"      carousel tiện ích nổi bật (src/data/dataAmenities.js) — đọc qua `cmsAmenityItems`
   File thuần ESM (prerender import bằng Node).
   ============================================================ */
const galleryImage = { key: 'src', label: 'Ảnh', ratio: '16/9', clear: ['srcSet'], size: ['w', 'h'] };

export const GALLERY_GROUPS = [
  ['ngoai-canh', 'Ngoại cảnh'],
  ['tien-ich', 'Tiện ích'],
  ['can-ho', 'Căn hộ mẫu'],
];

export const AMENITY_GROUPS_CMS = [
  ['canhquan', 'Cảnh quan'],
  ['tienich', 'Tiện ích'],
];

export const CMS_LISTS = [
  { section: 'hero', key: 'site.hero.stats', label: 'Số liệu hero', itemLabel: 'Số liệu', max: 6,
    fields: [['0', 'Số'], ['1', 'Đơn vị'], ['2', 'Nhãn']] },
  { section: 'tong-quan', key: 'site.overview.bullets', label: 'Ý chính', itemLabel: 'Ý', scalar: true, valueLabel: 'Nội dung', max: 10 },
  { section: 'tong-quan', key: 'site.overview.facts', label: 'Số liệu tổng quan', itemLabel: 'Số liệu', max: 8,
    fields: [['0', 'Số'], ['1', 'Nhãn']] },
  { section: 'vi-tri', key: 'site.location.distances', label: 'Khoảng cách', itemLabel: 'Địa điểm', max: 12,
    fields: [['0', 'Thời gian'], ['1', 'Địa điểm']] },
  ...AMENITY_GROUPS_CMS.map(([k, label]) => ({
    section: 'tien-ich', key: `amenities.${k}`, label: `Carousel tiện ích nổi bật — ${label}`, itemLabel: 'Ảnh', max: 40,
    fields: [['label', 'Chú thích']],
    images: [{ key: 'src', label: 'Ảnh', ratio: '4/3', altKey: 'alt' }],
  })),
  ...GALLERY_GROUPS.map(([k, label]) => ({
    section: 'hinhanh', key: `gallery.${k}.items`, label: `Gallery — ${label}`, itemLabel: 'Ảnh', max: 60,
    hint: k === 'can-ho' ? 'Mục "Loại căn hộ" lấy ảnh theo chú thích bắt đầu bằng tên loại căn (vd. "Studio", "1PN+").' : undefined,
    fields: [['label', 'Chú thích (cũng là alt ảnh)']],
    images: [galleryImage],
  })),
];
