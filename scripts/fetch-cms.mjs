/* ============================================================
   LẤY NỘI DUNG CMS (bản đã đăng) TRƯỚC KHI BUILD
   1. Gọi Supabase RPC cms_get_published_content(p) bằng anon key (chỉ đọc bản đã đăng).
   2. Tải mọi ảnh CMS (Supabase Storage) về public/assets/cms/ (ảnh đã được CMS nén WebP khi tải lên) —
      ảnh phục vụ từ domain website, không phụ thuộc Supabase lúc khách xem trang.
   3. Ghi src/generated/cms-content.json (đường dẫn ảnh đã đổi sang /assets/cms/…).
   Chưa cấu hình biến môi trường → dùng nội dung mặc định trong code.
   ĐÃ cấu hình mà lỗi mạng / Supabase → DỪNG build (exit 1) để Vercel giữ bản đang chạy,
   tránh đưa lên website bản thiếu nội dung CMS.
   Biến môi trường (Vercel → Settings → Environment Variables):
     CMS_SUPABASE_URL, CMS_SUPABASE_ANON_KEY   (hoặc VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
     CMS_PROJECT_ID (mặc định 'sensa-park')
   ============================================================ */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'src/generated/cms-content.json');
const IMG_DIR = join(root, 'public/assets/cms');
const PUBLIC_PREFIX = '/assets/cms/';

const url = (process.env.CMS_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const key = process.env.CMS_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const project = process.env.CMS_PROJECT_ID || 'sensa-park';

function done(msg) {
  console.log(`[cms] ${msg}`);
  if (!existsSync(OUT)) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, '{}\n');
  }
  process.exit(0);
}

function fail(msg) {
  console.error(`[cms] ${msg} — dừng build để giữ nguyên website đang chạy.`);
  process.exit(1);
}

if (!url || !key) done('Chưa cấu hình CMS_SUPABASE_URL / CMS_SUPABASE_ANON_KEY — dùng nội dung mặc định trong code.');

let content;
try {
  const res = await fetch(`${url}/rest/v1/rpc/cms_get_published_content`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p: project }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  content = (await res.json()) || {};
} catch (e) {
  fail(`Không lấy được nội dung CMS (${e.message})`);
}

/* ---------- tải ảnh về ---------- */
mkdirSync(IMG_DIR, { recursive: true });
const allowedHost = new URL(url).host;
const cacheName = (src) => {
  const ext = (src.split('?')[0].match(/\.(webp|jpe?g|png|avif|svg)$/i)?.[1] || 'webp').toLowerCase();
  return `${createHash('sha1').update(src).digest('hex').slice(0, 16)}.${ext}`;
};

async function localize(src) {
  if (typeof src !== 'string' || !/^https:\/\//.test(src)) return src;
  if (new URL(src).host !== allowedHost) return src; // chỉ tải ảnh từ Supabase của CMS
  const name = cacheName(src);
  const file = join(IMG_DIR, name);
  if (!existsSync(file)) {
    const res = await fetch(src, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`Tải ảnh lỗi ${res.status}: ${src}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return PUBLIC_PREFIX + name;
}

let count = 0;
try {
  for (const v of Object.values(content.images || {})) {
    if (v?.src) { v.src = await localize(v.src); count += 1; }
  }
  for (const v of Object.values(content.seo || {})) {
    if (v?.ogImage?.src) { v.ogImage.src = await localize(v.ogImage.src); count += 1; }
  }
} catch (e) {
  fail(e.message);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(content, null, 2) + '\n');
console.log(`[cms] Đã lấy nội dung "${project}": ${Object.keys(content.texts || {}).length} chữ, ${count} ảnh.`);
