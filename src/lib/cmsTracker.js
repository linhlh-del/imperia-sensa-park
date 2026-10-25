/* ============================================================
   TRACKER ANALYTICS CHO CMS (dashboard realtime) — gửi về Supabase Edge Function `collect`.
   - Không gửi dữ liệu cá nhân: chỉ id ngẫu nhiên của trình duyệt (visitor) và phiên (30 phút không hoạt động).
   - Sự kiện: pageview · heartbeat (30 giây khi tab đang mở, để biết ai đang online) · section_view · cta_click · lead · leave
   - Gom theo lô, gửi bằng sendBeacon (text/plain, không preflight CORS), không chặn hiển thị.
   Bật khi có VITE_CMS_COLLECT_URL (vite.config.js tự đặt từ CMS_SUPABASE_URL lúc build).
   ============================================================ */
const URL_ = import.meta.env?.VITE_CMS_COLLECT_URL || '';
const PROJECT = import.meta.env?.VITE_CMS_PROJECT || 'norton-park';
const SESSION_MS = 30 * 60 * 1000;
const HEARTBEAT_MS = 30 * 1000;

let queue = [];
let ctx = null;
let timer = 0;

const rand = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`);
const read = (s, k) => { try { return s.getItem(k); } catch { return null; } };
const write = (s, k, v) => { try { s.setItem(k, v); } catch { /* chế độ riêng tư */ } };

/* kênh truy cập từ UTM / click id / referrer (khớp cột channel trong Supabase) */
function channelOf(q, ref) {
  const medium = (q.get('utm_medium') || '').toLowerCase();
  const source = (q.get('utm_source') || '').toLowerCase();
  if (q.get('gclid') || q.get('fbclid') || q.get('ttclid') || q.get('msclkid') || /cpc|ppc|paid|ads?$|display/.test(medium)) return 'paid';
  if (/email|newsletter/.test(medium)) return 'email';
  if (/zalo/.test(source) || /(^|\.)zalo\.(me|vn)$/.test(ref)) return 'zalo';
  if (/social/.test(medium) || /(facebook|fb|instagram|tiktok|youtube|linkedin|twitter|x)\b/.test(source)) return 'social';
  if (/(^|\.)(google|bing|coccoc|yahoo|duckduckgo)\./.test(ref)) return 'organic';
  if (/(^|\.)(facebook|fb|instagram|tiktok|youtube|linkedin|t)\.(com|co|me)$/.test(ref) || /(^|\.)m\.me$/.test(ref)) return 'social';
  if (source) return 'referral';
  return ref ? 'referral' : 'direct';
}

function session() {
  let visitor = read(localStorage, 'cms_vid');
  if (!visitor) { visitor = rand(); write(localStorage, 'cms_vid', visitor); }
  const last = Number(read(sessionStorage, 'cms_last') || 0);
  let sid = read(sessionStorage, 'cms_sid');
  let src = null;
  try { src = JSON.parse(read(sessionStorage, 'cms_src') || 'null'); } catch { /* bỏ qua */ }
  /* phiên mới: lần đầu mở tab, quá 30 phút không hoạt động, hoặc vào lại bằng link có UTM */
  const q = new URLSearchParams(location.search);
  if (!sid || Date.now() - last > SESSION_MS || q.get('utm_source') || q.get('gclid') || q.get('fbclid')) {
    sid = rand();
    let ref = '';
    try { ref = document.referrer ? new URL(document.referrer).hostname : ''; } catch { /* referrer lạ */ }
    if (ref === location.hostname) ref = '';
    src = {
      channel: channelOf(q, ref),
      utm_source: q.get('utm_source') || undefined,
      utm_medium: q.get('utm_medium') || undefined,
      utm_campaign: q.get('utm_campaign') || undefined,
      referrer: ref || undefined,
    };
    write(sessionStorage, 'cms_sid', sid);
    write(sessionStorage, 'cms_src', JSON.stringify(src));
  }
  write(sessionStorage, 'cms_last', String(Date.now()));
  const w = innerWidth;
  return { visitor_id: visitor, session_id: sid, device: w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop', ...src };
}

function flush() {
  clearTimeout(timer);
  timer = 0;
  if (!queue.length || !URL_) return;
  const body = JSON.stringify({ project: PROJECT, ...ctx, events: queue.splice(0, 30) });
  const blob = new Blob([body], { type: 'text/plain' });
  if (!(navigator.sendBeacon && navigator.sendBeacon(URL_, blob))) {
    fetch(URL_, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
  }
  if (queue.length) flush();
}

/** Ghi 1 sự kiện (gửi theo lô sau ~2 giây hoặc ngay khi rời trang) */
export function cmsTrack(type, label = '') {
  if (!URL_ || typeof window === 'undefined' || !ctx) return;
  ctx = { ...ctx, ...session() };
  queue.push({ type, label: String(label).slice(0, 120), path: location.pathname, ts: Date.now() });
  if (type === 'lead' || type === 'leave') flush();
  else if (!timer) timer = setTimeout(flush, 2000);
}

/* bấm gọi / Zalo / link ngoài / phần tử data-track → cta_click (khi site không có lớp analytics riêng) */
function onClick(e) {
  const el = e.target.closest?.('a, button, [data-track]');
  if (!el) return;
  const href = el.getAttribute('href') || '';
  if (el.dataset.track) cmsTrack('cta_click', `${el.dataset.track}:${el.dataset.trackLabel || ''}`);
  else if (href.startsWith('tel:')) cmsTrack('cta_click', 'call');
  else if (/zalo\.me/.test(href)) cmsTrack('cta_click', 'zalo');
  else if (/^https?:/.test(href) && !href.includes(location.hostname)) cmsTrack('cta_click', `outbound:${new URL(href).hostname}`);
  else if (el.tagName === 'BUTTON' && el.type !== 'submit') cmsTrack('cta_click', el.textContent.trim().slice(0, 60));
}

/** Khởi động tracker: heartbeat + section_view + leave. clicks: tự ghi nhận bấm nút / gọi / Zalo */
export function initCmsTracker({ clicks = false } = {}) {
  if (!URL_ || typeof window === 'undefined' || ctx) return;
  ctx = session();
  if (clicks) document.addEventListener('click', onClick, { capture: true, passive: true });

  setInterval(() => { if (document.visibilityState === 'visible') cmsTrack('heartbeat'); }, HEARTBEAT_MS);
  addEventListener('pagehide', () => { cmsTrack('leave'); flush(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });

  /* section khách đã xem tới (mỗi section 1 lần / trang) */
  const seen = new Set();
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    const id = e.target.id;
    if (e.isIntersecting && id && !seen.has(location.pathname + id)) { seen.add(location.pathname + id); cmsTrack('section_view', id); }
  }), { threshold: 0.4 });
  const observe = () => document.querySelectorAll('main section[id]').forEach((s) => io.observe(s));
  observe();
  new MutationObserver(observe).observe(document.getElementById('main') || document.body, { childList: true, subtree: true });
}

/** Lượt xem trang (gọi khi đổi route) */
let lastPath = '';
export function cmsPageView(path) {
  if (path === lastPath) return;
  lastPath = path;
  cmsTrack('pageview');
}
