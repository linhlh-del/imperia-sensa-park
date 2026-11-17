/* ============================================================
   SCHEMA CHO CMS — website tự mô tả: section nào, trường chữ / ảnh nào sửa được, giá trị mặc định, biến thể layout.
   scripts/prerender.mjs ghi ra dist/cms-schema.json; sensa-park-cms đọc file này.
   Giá trị mặc định lấy thẳng từ code (src/cms/ui.js, src/data/project.js) — không qua lớp đè CMS.
   File thuần ESM (không dùng import.meta.glob) để Node import được lúc prerender.
   ============================================================ */
import UI from './ui.js';
import { project } from '../data/project.js';
import { HOME_SEO, SUBPAGES, DEFAULT_IMAGE } from '../lib/seo.js';
import { GALLERY_ITEMS } from '../data/dataAmenities.js';
import { listSchema } from './lists-core.js';
import { CMS_LISTS } from './lists.js';
/* import attributes: Node (prerender) bắt buộc `with { type: 'json' }`; Vite cũng hiểu */
import gallery from '../data/gallery.json' with { type: 'json' };

/* Section trang chủ theo thứ tự mặc định. locked: luôn hiển thị, giữ vị trí. variants: phần tử đầu là mặc định. */
export const HOME_SECTIONS = [
  { id: 'hero', label: 'Hero (màn hình đầu)', locked: true, ui: ['hero'],
    site: ['hero.kicker', 'hero.title', 'hero.titleAccent', 'hero.description'],
    images: [['hero.background', 'Ảnh nền hero', '/assets/overview.webp', null, '16/9']],
    variants: [['left', 'Chữ bên trái'], ['center', 'Chữ ở giữa']] },
  { id: 'tong-quan', label: 'Tổng quan', ui: ['overview'],
    site: ['overview.title', 'overview.subtitle'],
    images: [['overview.image', 'Ảnh tổng quan', '/assets/overview.optimized.webp', 'overview.imageAlt', '1619/972']],
    variants: [['image-right', 'Ảnh bên phải'], ['image-left', 'Ảnh bên trái']] },
  { id: 'vi-tri', label: 'Vị trí', ui: ['location'],
    site: ['location.title', 'location.subtitle'],
    variants: [['map-right', 'Bản đồ bên phải'], ['map-left', 'Bản đồ bên trái']] },
  { id: 'tien-ich', label: 'Tiện ích: carousel “Sống trọn” + sơ đồ tổng hợp tiện ích', ui: ['amenities'],
    images: [['amenities.map', 'Sơ đồ tiện ích', '/assets/responsive/utility-1920.webp', 'amenities.mapAlt', '16/9']] },
  { id: 'hinhanh', label: 'Gallery (ngoại cảnh · tiện ích · căn hộ mẫu)', ui: ['featured'] },
  { id: 'mat-bang', label: 'Mặt bằng tầng điển hình', ui: ['floor'],
    // tên file viết thường: Vercel (Linux) phân biệt hoa/thường, "sensa-A..." 404 dù macOS (dev) không báo lỗi
    images: [['floor.A', 'Mặt bằng tháp Sensa A', '/assets/layout/sensa-a.optimized.webp', null, '2444/1728'],
      ['floor.B', 'Mặt bằng tháp Sensa B', '/assets/layout/sensaB.optimized.webp', null, '2444/1728']] },
  { id: 'chinh-sach-ban-hang', label: 'Chính sách bán hàng', ui: [] },
  { id: 'tin-tuc', label: 'Tin tức', ui: ['news'] },
  { id: 'faq', label: 'Câu hỏi thường gặp', ui: [] },
  { id: 'lien-he', label: 'Form đăng ký', locked: true, ui: ['lead'],
    images: [['lead.background', 'Ảnh nền section', '/assets/lead-bg.optimized.webp', null, '16/9']] },
];

const OTHER_SECTIONS = [
  { id: 'popup', label: 'Popup đăng ký', ui: ['popup'],
    images: [['popup.image', 'Ảnh popup', '/assets/popup.optimized.webp', 'popup.imageAlt', '1/1']] },
  { id: 'header', label: 'Header & nút liên hệ nhanh', ui: ['header', 'sticky', 'form'] },
];

const LABELS = {
  title: 'Tiêu đề', subtitle: 'Mô tả', kicker: 'Dòng nhỏ phía trên', titleAccent: 'Tiêu đề dòng 2 (màu nhấn)', description: 'Đoạn mô tả',
  seo: 'Tiêu đề SEO (thẻ heading ẩn chứa từ khoá)', h1Seo: 'Phần H1 ẩn (từ khoá + địa danh)', cta: 'Chữ trên nút', note: 'Ghi chú',
  highlights: 'Danh sách quyền lợi (mỗi dòng một mục)', imageAlt: 'Alt ảnh', mapAlt: 'Alt sơ đồ',
  ctaExplore: 'Nút khám phá', ctaPrice: 'Nút nhận bảng giá', ctaMobile: 'Nút (menu điện thoại)', submit: 'Chữ nút gửi',
  privacy: 'Dòng cam kết bảo mật', support: 'Dòng hỗ trợ', intro: 'Đoạn dẫn', call: 'Nút gọi', zalo: 'Nút Zalo', price: 'Nút bảng giá',
  sending: 'Chữ khi đang gửi', error: 'Thông báo lỗi gửi ({phone} = hotline)',
};
const SKIP = /\.(imageAlt|mapAlt)$/; // alt sửa ngay cạnh ảnh

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

function field(key, label, def) {
  const len = String(def ?? '').length;
  return { key, label, default: def ?? '', type: len > 90 || String(def).includes('\n') ? 'textarea' : 'text', rows: String(def).includes('\n') ? 7 : 3 };
}

function build(s) {
  const fields = [];
  for (const prefix of s.ui || []) {
    for (const key of Object.keys(UI).filter((k) => k.startsWith(`${prefix}.`) && !SKIP.test(k))) {
      const suffix = key.slice(prefix.length + 1);
      fields.push(field(key, `${LABELS[suffix] || suffix}  ·  ${key}`, UI[key]));
    }
  }
  for (const path of s.site || []) {
    const suffix = path.split('.').pop();
    fields.push(field(`site.${path}`, `${LABELS[suffix] || suffix}  ·  ${path}`, get(project, path)));
  }
  for (const [path, label, parts] of s.lists || []) {
    (get(project, path) || []).forEach((item, i) => {
      if (Array.isArray(item)) {
        item.forEach((v, j) => fields.push(field(`site.${path}.${i}.${j}`, `${label} ${i + 1} — ${parts?.[j] || j + 1}`, v)));
      } else {
        fields.push(field(`site.${path}.${i}`, `${label} ${i + 1}`, item));
      }
    });
  }
  const images = (s.images || []).map(([key, label, def, altKey, ratio]) => ({
    key, label, default: def, altKey: altKey || undefined, altDefault: altKey ? UI[altKey] : undefined, ratio,
  }));
  /* danh sách thêm/bớt được (src/cms/lists.js) */
  const lists = CMS_LISTS.filter((l) => l.section === s.id).map((l) => listSchema(l, { vi: listDefaults(l.key) }));
  return {
    id: s.id, label: s.label, locked: Boolean(s.locked), inLayout: true,
    variants: s.variants?.map(([id, label]) => ({ id, label })), fields, images, lists,
  };
}

/** Mảng mặc định của một danh sách CMS */
function listDefaults(key) {
  if (key.startsWith('site.')) return get(project, key.slice(5)) || [];
  if (key.startsWith('gallery.')) return gallery[key.split('.')[1]]?.items || [];
  if (key.startsWith('amenities.')) return GALLERY_ITEMS.filter((i) => i.category === key.split('.')[1]);
  return [];
}

const SETTINGS = [
  ['hotline', 'Hotline hiển thị', 'vd. 093 448 3138'],
  ['hotlineHref', 'Link gọi (tel:)', 'vd. tel:0934483138'],
  ['zaloUrl', 'Link Zalo OA'],
  ['address', 'Địa chỉ dự án (đơn vị hành chính hiện hành)', 'Hiện ở footer, popup, trang Vị trí'],
];

/** Toàn bộ schema cho CMS */
export function buildCmsSchema({ domains = [] } = {}) {
  return {
    version: 1,
    project: 'sensa-park',
    /* domain của dự án (sites/<domain>) — CMS dùng cho "Thẻ head & tracking" theo domain */
    domains,
    langs: ['vi'],
    sections: [...HOME_SECTIONS.map(build), ...OTHER_SECTIONS.map((s) => ({ ...build(s), inLayout: false }))],
    seo: [
      { path: '/', label: 'Trang chủ', default: HOME_SEO, defaultOgImage: DEFAULT_IMAGE },
      ...SUBPAGES.map((p) => ({ path: p.path, label: p.name, default: { title: p.title, description: p.description }, defaultOgImage: DEFAULT_IMAGE })),
    ],
    settings: SETTINGS.map(([k, label, hint]) => ({ key: `site.contact.${k}`, label, hint, default: project.contact[k] })),
    lead: { defaultEndpoint: '' },
  };
}
