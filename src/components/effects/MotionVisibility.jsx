import { useEffect } from 'react';

/** Pause decorative CSS motion outside the viewport, including SSR snapshots. */
export default function MotionVisibility() {
  useEffect(() => {
    const seen = new WeakSet();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.dataset.motionVisible = String(entry.isIntersecting);
    }, { rootMargin: '60px' });
    const scan = () => document.querySelectorAll('main > section').forEach((section) => {
      if (!seen.has(section)) { seen.add(section); observer.observe(section); }
    });
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.getElementById('root'), { childList: true, subtree: true });
    const visibility = () => { document.documentElement.dataset.pageHidden = String(document.hidden); };
    document.addEventListener('visibilitychange', visibility);
    visibility();
    return () => { observer.disconnect(); mutations.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  return null;
}
