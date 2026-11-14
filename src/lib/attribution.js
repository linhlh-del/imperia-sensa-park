const KEY = 'sensa_first_touch';
const FIELDS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid'];
export function rememberAttribution() {
  if (typeof window === 'undefined' || window.__PRERENDER__) return;
  try {
    if (sessionStorage.getItem(KEY)) return;
    const query = new URLSearchParams(location.search);
    const source = Object.fromEntries(FIELDS.map((key) => [key, (query.get(key) || '').slice(0,200)]));
    source.referrer = document.referrer ? new URL(document.referrer).origin : '';
    sessionStorage.setItem(KEY, JSON.stringify(source));
  } catch { /* Storage can be disabled. */ }
}
export function firstTouch() {
  try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
