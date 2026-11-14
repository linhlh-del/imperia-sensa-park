/** Conversion/interaction events only. Pageviews remain owned by configured GA/GTM. */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || window.__PRERENDER__) return;
  const payload = { page_path: location.pathname, ...params };
  if (typeof window.gtag === 'function') window.gtag('event', name, payload);
  else { window.dataLayer ||= []; window.dataLayer.push({ event: name, ...payload }); }
}
let initialized = false;
export function initInteractionAnalytics() {
  if (initialized || window.__PRERENDER__) return;
  initialized = true;
  document.addEventListener('click', (event) => {
    const el = event.target.closest?.('a, button');
    if (!el) return;
    const href = el.getAttribute('href') || '';
    if (href.startsWith('tel:')) trackEvent('click_call');
    else if (/^https:\/\/zalo\.me\//.test(href)) trackEvent('click_zalo');
    else if (el.matches('.btn-base')) trackEvent('click_cta', { cta_location: el.closest('section')?.id || 'navigation', cta_name: el.textContent.trim().slice(0,80) });
  }, { passive: true });
  let frame = 0, lastPath = '', seen = new Set();
  addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (lastPath !== location.pathname) { lastPath = location.pathname; seen = new Set(); }
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max <= 0) return;
      const percent = scrollY / max * 100;
      for (const threshold of [25,50,75,90]) if (percent >= threshold && !seen.has(threshold)) { seen.add(threshold); trackEvent('scroll_depth', { percent_scrolled: threshold }); }
    });
  }, { passive: true });
}
