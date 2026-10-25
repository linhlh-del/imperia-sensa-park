/* ============================================================
   NỘI DUNG TỪ CMS (bản đã đăng) — đè lên nội dung mặc định trong code.
   src/generated/cms-content.json do scripts/fetch-cms.mjs tải từ Supabase lúc build (không có file → dùng mặc định).
   Quy ước khoá (khớp src/cms/schema.js và sensa-park-cms):
   - texts["lead.title"]              → chữ giao diện (mặc định ở src/cms/ui.js) — đọc bằng t()
   - texts["site.hero.description"]   → dữ liệu src/data/project.js theo đường dẫn — đọc qua `site`
   - images["hero.background"]        → { src } ảnh (đã tải về public/assets/cms/) — đọc bằng img()
   - settings["site.contact.hotline"] → thông tin chung
   ============================================================ */
import { project } from '../data/project';
import UI from './ui';

const files = import.meta.glob('../generated/cms-content.json', { eager: true, import: 'default' });
export const cms = Object.values(files)[0] || {};

/* site chỉ có tiếng Việt: giá trị là chuỗi (hoặc { vi }) */
const pick = (v) => (v == null ? undefined : typeof v === 'string' ? v : v.vi || undefined);

/** Chữ giao diện: CMS → mặc định (ui.js). t('loan.title') hoặc t('floor.subtitle', { n: 20 }) */
export function t(key, vars) {
  let s = pick(cms.texts?.[key]) ?? UI[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
  return s;
}

/** Danh sách nhiều dòng (mỗi dòng một mục) */
export const tList = (key) => t(key).split('\n').map((x) => x.trim()).filter(Boolean);

/** Ảnh: CMS → mặc định */
export const img = (key, fallback) => cms.images?.[key]?.src || fallback;

/* gán giá trị theo đường dẫn "a.0.b", sao chép nông từng tầng để không sửa dữ liệu gốc */
function setPath(root, path, value) {
  const keys = path.split('.');
  const out = Array.isArray(root) ? [...root] : { ...root };
  let cur = out;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const next = cur[keys[i]];
    if (next == null || typeof next !== 'object') return out; // đường dẫn không tồn tại → bỏ qua
    cur[keys[i]] = Array.isArray(next) ? [...next] : { ...next };
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return out;
}

function applySiteOverrides(data) {
  let s = data;
  for (const [key, v] of Object.entries(cms.texts || {})) {
    if (key.startsWith('site.') && pick(v) !== undefined) s = setPath(s, key.slice(5), pick(v));
  }
  for (const [key, v] of Object.entries(cms.settings || {})) {
    if (key.startsWith('site.') && v) s = setPath(s, key.slice(5), v);
  }
  return s;
}

/** Dữ liệu dự án (project.js) đã áp CMS — dùng thay cho `project` trong component */
export const site = applySiteOverrides(project);

/** Bố cục trang chủ: thứ tự, section ẩn, biến thể */
export const cmsLayout = {
  order: cms.layout?.order || [],
  hidden: new Set(cms.layout?.hidden || []),
  variants: cms.layout?.variants || {},
};

/** SEO 1 trang: { title, description, ogImage } — mọi trường đều tuỳ chọn */
export function cmsSeo(path) {
  const p = cms.seo?.[path];
  if (!p) return {};
  const v = p.vi && typeof p.vi === 'object' ? p.vi : p;
  return { title: v.title, description: v.description, ogImage: p.ogImage?.src };
}
