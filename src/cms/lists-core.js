/* ============================================================
   DANH SÁCH THÊM / BỚT ĐƯỢC TỪ CMS (gallery, tiện ích, tin, FAQ…) — lõi dùng chung.
   File này giống hệt nhau ở mọi landing page (norton-park, sensa-park-new, qtopia-landing) — sửa thì chép sang cả 3.
   File thuần ESM (không import.meta) để Node import được lúc prerender.

   Nội dung CMS:  cms.lists["<khoá>"] = [{ _id, _from, <trường chữ>: "…" | { vi, en }, <trường ảnh>: { src, width, height } }]
     _from = chỉ số phần tử mặc định gốc (giữ các khoá kỹ thuật của nó: id, span, link…); null = phần tử mới.
     Có cms.lists[khoá] → website THAY CẢ DANH SÁCH (thứ tự, thêm, xoá); khoá phẳng cũ "<khoá>.0.title" bị bỏ qua.
   Khai báo danh sách (mỗi landing, file lists.js):
     { key, path?, label, itemLabel, fields: [[khoá, nhãn, 'textarea'?]], images: [{ key, label, ratio?, altKey?, clear?: [...], size?: [w, h] }],
       scalar?: true (mảng chuỗi — trường "value"), min?, max? }
     clear: khoá ảnh đáp ứng (srcSet…) bỏ khi ảnh bị thay · size: khoá kích thước nhận width/height của ảnh mới
   ============================================================ */

const clone = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)));
const fieldKeys = (spec) => (spec.fields || []).map((f) => (Array.isArray(f) ? f[0] : f.key));

/** Phần tử trống làm khuôn cho phần tử mới: chép phần tử đầu, xoá chữ / ảnh khai báo, đổi id để không trùng */
function blank(template, spec, n) {
  if (template == null || typeof template !== 'object') return '';
  const out = clone(template);
  for (const k of fieldKeys(spec)) out[k] = '';
  for (const img of spec.images || []) {
    out[img.key] = '';
    for (const c of img.clear || []) delete out[c];
  }
  for (const k of spec.blank || []) delete out[k];
  if (typeof out.id === 'string' || typeof out.id === 'number') out.id = `cms-${n}`;
  return out;
}

/**
 * Áp danh sách CMS lên mảng mặc định (đã theo ngôn ngữ). Không có danh sách hợp lệ → trả lại mặc định.
 * pick(v) → chuỗi theo ngôn ngữ đang render (hoặc undefined).
 * Phần tử MỚI thiếu ảnh bị bỏ qua (gallery không hiện ô ảnh trống).
 */
export function applyList(defaults, items, spec, pick) {
  if (!Array.isArray(items) || !Array.isArray(defaults)) return defaults;
  const out = [];
  items.forEach((it, n) => {
    if (!it || typeof it !== 'object') return;
    const from = Number.isInteger(it._from) && it._from >= 0 && it._from < defaults.length ? it._from : null;
    if (spec.scalar) {
      const v = pick(it.value);
      const next = v !== undefined && v !== '' ? v : from != null ? defaults[from] : '';
      if (next !== '') out.push(next);
      return;
    }
    const next = from != null ? clone(defaults[from]) : blank(defaults[0], spec, n);
    if (next == null || typeof next !== 'object') return;
    for (const k of fieldKeys(spec)) {
      const v = pick(it[k]);
      if (v !== undefined && v !== '') next[k] = v;
    }
    for (const img of spec.images || []) {
      const v = it[img.key];
      if (v?.src) {
        next[img.key] = v.src;
        for (const c of img.clear || []) delete next[c];
        if (img.size) {
          if (v.width) next[img.size[0]] = v.width; else delete next[img.size[0]];
          if (v.height) next[img.size[1]] = v.height; else delete next[img.size[1]];
        }
      }
      if (img.altKey) {
        const a = pick(it[img.altKey]);
        if (a !== undefined && a !== '') next[img.altKey] = a;
      }
    }
    if (from == null && (spec.images || []).some((img) => !next[img.key])) return;
    out.push(next);
  });
  return out;
}

/** Khoá phẳng cũ thuộc một danh sách CMS đã có (bỏ qua khi áp texts / images) */
export function inLists(key, lists) {
  for (const k of Object.keys(lists || {})) if (key.startsWith(`${k}.`)) return true;
  return false;
}

/**
 * Schema cho CMS của 1 danh sách. defaultsByLang: { vi: [...], en?: [...] } (mảng mặc định theo ngôn ngữ).
 * Giá trị mặc định một ngôn ngữ → chuỗi; nhiều ngôn ngữ → { vi, en }.
 */
export function listSchema(spec, defaultsByLang) {
  const langs = Object.keys(defaultsByLang);
  const base = defaultsByLang[langs[0]] || [];
  const text = (i, k) => {
    if (langs.length === 1) return spec.scalar ? base[i] : base[i]?.[k];
    return Object.fromEntries(langs.map((l) => [l, (spec.scalar ? defaultsByLang[l]?.[i] : defaultsByLang[l]?.[i]?.[k]) ?? (spec.scalar ? base[i] : base[i]?.[k]) ?? '']));
  };
  const fields = spec.scalar
    ? [{ key: 'value', label: spec.valueLabel || 'Nội dung', type: 'text' }]
    : (spec.fields || []).map((f) => {
      const [key, label, type] = Array.isArray(f) ? f : [f.key, f.label, f.type];
      return { key, label: label || key, type: type || 'text', rows: type === 'textarea' ? 4 : undefined };
    });
  return {
    key: spec.key,
    label: spec.label,
    itemLabel: spec.itemLabel || 'Mục',
    hint: spec.hint,
    min: spec.min,
    max: spec.max,
    fields,
    images: (spec.images || []).map(({ key, label, ratio, altKey, hint }) => ({ key, label: label || 'Ảnh', ratio, altKey, hint })),
    items: base.map((_, i) => {
      const item = {};
      for (const f of fields) item[f.key] = text(i, spec.scalar ? undefined : f.key);
      for (const img of spec.images || []) {
        item[img.key] = base[i]?.[img.key];
        if (img.altKey) item[img.altKey] = text(i, img.altKey);
      }
      return item;
    }),
  };
}
