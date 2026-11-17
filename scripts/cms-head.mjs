/* ============================================================
   THẺ HEAD TỪ CMS — dùng trong vite.config.js (transformIndexHtml) lúc build.
   File này giống hệt nhau ở mọi landing page (norton-park, sensa-park-new, qtopia-landing) — sửa thì chép sang cả 3.

   Phạm vi (CMS → "Thẻ head & tracking"):
     cms.head[k]               áp dụng MỌI domain của dự án
     cms.head.sites[host][k]   chỉ domain `host` (vd. "canho-nortonpark.vn")
   Gộp khi build domain X (resolveHead):
     - mã ID (GTM, GA4, Ads, Pixel, xác minh…): domain X → tất cả domain → biến môi trường của domain (site.env)
     - customHead / customBodyStart: mã chung rồi NỐI THÊM mã riêng của domain X
   Domain đang build lấy từ VITE_SITE_URL (scripts/sites.mjs gán từ sites/<domain>/site.env).

   Mọi mã ID được kiểm tra định dạng trước khi ghép vào script (chống chèn mã qua ô ID).
   customHead / customBodyStart: chèn nguyên văn — chỉ owner sửa được trong CMS.
   ============================================================ */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const ID_RULES = {
  gtmId: /^GTM-[A-Z0-9]{4,10}$/,
  ga4Id: /^G-[A-Z0-9]{4,12}$/,
  googleAdsId: /^AW-\d{6,12}$/,
  fbPixelId: /^\d{10,20}$/,
  tiktokPixelId: /^[A-Z0-9]{15,25}$/,
  googleVerification: /^[\w-]{20,80}$/,
  facebookVerification: /^[a-z0-9]{20,40}$/,
  zaloVerification: /^[\w-]{6,80}$/,
  bingVerification: /^[A-F0-9]{20,40}$/i,
};

/* biến môi trường (site.env / .env.production) tương ứng từng mã — dự phòng khi CMS để trống */
export const ENV_KEYS = { gtmId: 'VITE_GTM_ID', ga4Id: 'VITE_GA4_ID', googleVerification: 'VITE_GSC_VERIFICATION' };

/** Đọc src/generated/cms-content.json (không có → {}) */
export function readCms(file) {
  try {
    return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
  } catch {
    console.warn('[cms] cms-content.json hỏng — bỏ qua nội dung CMS');
    return {};
  }
}

/** host của một URL ("https://a.vn/" → "a.vn"); sai → '' */
export const hostOf = (url) => {
  try { return new URL(url).host.toLowerCase(); } catch { return ''; }
};

/** Mã dự phòng từ biến môi trường của domain (process.env sau khi nạp site.env) */
export function envHead(env = process.env) {
  const out = {};
  for (const [k, name] of Object.entries(ENV_KEYS)) if (String(env[name] || '').trim()) out[k] = String(env[name]).trim();
  return out;
}

/**
 * Thẻ head có hiệu lực cho 1 domain.
 * head: cms.head · host: domain đang build · fallback: mã từ biến môi trường (envHead) — ưu tiên thấp nhất.
 */
export function resolveHead(head = {}, host = '', fallback = {}) {
  const site = (host && head.sites && typeof head.sites === 'object' && head.sites[host.toLowerCase()]) || {};
  const out = {};
  for (const k of Object.keys(ID_RULES)) {
    const v = [site[k], head[k], fallback[k]].map((x) => String(x || '').trim()).find(Boolean);
    if (v) out[k] = v;
  }
  out.customHead = [head.customHead, site.customHead].filter(Boolean).join('\n');
  out.customBodyStart = [head.customBodyStart, site.customBodyStart].filter(Boolean).join('\n');
  return out;
}

/** Giá trị head hợp lệ (bỏ mã sai định dạng, có cảnh báo) */
export function cleanHead(head = {}) {
  const out = { customHead: head.customHead || '', customBodyStart: head.customBodyStart || '' };
  for (const [k, re] of Object.entries(ID_RULES)) {
    const v = String(head[k] || '').trim();
    if (!v) continue;
    if (re.test(v)) out[k] = v;
    else console.warn(`[cms] Bỏ qua ${k} sai định dạng: ${v.slice(0, 40)}`);
  }
  return out;
}

const meta = (name, content) => `<meta name="${name}" content="${content}" />`;

/**
 * Chuỗi HTML chèn vào <head> và đầu <body>. rawHead = kết quả resolveHead (đã gộp theo domain).
 * opts.gtm: true → chèn snippet GTM (site không có trình tải GTM riêng). Norton tự tải GTM qua VITE_GTM_ID.
 * opts.nonce: thuộc tính nonce cho script inline (Nginx thay __CSP_NONCE__ mỗi lượt tải).
 * Trả { tags (verification + tracking), custom (customHead), bodyStart, gtmId }.
 */
export function headHtml(rawHead, { gtm = false, nonce = '' } = {}) {
  const h = cleanHead(rawHead);
  const n = nonce ? ` nonce="${nonce}"` : '';
  const head = [];
  const body = [];

  if (h.googleVerification) head.push(meta('google-site-verification', h.googleVerification));
  if (h.facebookVerification) head.push(meta('facebook-domain-verification', h.facebookVerification));
  if (h.zaloVerification) head.push(meta('zalo-platform-site-verification', h.zaloVerification));
  if (h.bingVerification) head.push(meta('msvalidate.01', h.bingVerification));

  if (gtm && h.gtmId) {
    head.push(`<!-- Google Tag Manager -->\n    <script${n}>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${h.gtmId}');</script>\n    <!-- End Google Tag Manager -->`);
    body.push(`<!-- Google Tag Manager (noscript) -->\n    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${h.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n    <!-- End Google Tag Manager (noscript) -->`);
  }

  /* GA4 + Google Ads dùng chung gtag.js */
  const gtagIds = [h.ga4Id, h.googleAdsId].filter(Boolean);
  if (gtagIds.length) {
    head.push(`<script${n}>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${gtagIds.map((id) => `gtag('config','${id}');`).join('')}(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${gtagIds[0]}';document.head.appendChild(s);})();</script>`);
  }

  if (h.fbPixelId) {
    head.push(`<script${n}>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${h.fbPixelId}');fbq('track','PageView');</script>`);
    body.push(`<noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${h.fbPixelId}&ev=PageView&noscript=1" /></noscript>`);
  }

  if (h.tiktokPixelId) {
    head.push(`<script${n}>!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e){var n="https://analytics.tiktok.com/i18n/pixel/events.js",o=d.createElement("script");o.type="text/javascript";o.async=!0;o.src=n+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${h.tiktokPixelId}');ttq.page();}(window,document,'ttq');</script>`);
  }

  const custom = h.customHead ? `<!-- CMS: mã tuỳ chỉnh -->\n${h.customHead}` : '';
  if (h.customBodyStart) body.unshift(`<!-- CMS: mã tuỳ chỉnh -->\n${h.customBodyStart}`);

  return { tags: head.join('\n    '), custom, head: [head.join('\n    '), custom].filter(Boolean).join('\n    '), bodyStart: body.join('\n    '), gtmId: h.gtmId || '' };
}

/**
 * Vite plugin: chèn thẻ head từ CMS vào index.html cho domain đang build.
 * opts.host: domain (mặc định lấy từ VITE_SITE_URL lúc build) · opts.fallback: mã dự phòng (mặc định envHead())
 * opts.omit: mã website tự chèn bằng cách khác (vd. norton: googleVerification qua src/seo/head.js) → không chèn lại
 * opts.position: 'end' (trước </head>, mặc định) | 'top' (thẻ tracking ngay sau <meta viewport>, GTM khuyến nghị đặt cao trong head)
 * customHead luôn ở cuối <head>; customBodyStart + noscript ngay sau <body>.
 */
export function cmsHeadPlugin(cms, opts = {}) {
  return {
    name: 'cms-head',
    transformIndexHtml(html) {
      const host = opts.host ?? hostOf(process.env.VITE_SITE_URL || '');
      const resolved = resolveHead(cms.head, host, opts.fallback ?? envHead());
      for (const k of opts.omit || []) delete resolved[k];
      const { tags, custom, bodyStart } = headHtml(resolved, opts);
      let out = html;
      const anchor = /(<meta name="viewport"[^>]*>)/;
      if (tags && opts.position === 'top' && anchor.test(out)) out = out.replace(anchor, `$1\n    ${tags}`);
      else if (tags) out = out.replace('</head>', `    ${tags}\n  </head>`);
      if (custom) out = out.replace('</head>', `    ${custom}\n  </head>`);
      if (bodyStart) out = out.replace(/<body([^>]*)>/, `<body$1>\n    ${bodyStart}`);
      return out;
    },
  };
}

/**
 * Danh sách domain cho CMS (schema.domains): đọc sites/<domain>/site.env của website.
 * env = mã đang cấu hình bằng biến môi trường của domain — CMS hiện làm giá trị "kế thừa".
 * Website một domain (không có sites/) → [{ host của VITE_SITE_URL }].
 */
export function cmsDomains(root, fallbackUrl = process.env.VITE_SITE_URL) {
  const dir = join(root, 'sites');
  const out = [];
  if (existsSync(dir)) {
    for (const d of readdirSync(dir, { withFileTypes: true }).filter((x) => x.isDirectory()).map((x) => x.name).sort()) {
      const file = join(dir, d, 'site.env');
      if (!existsSync(file)) continue;
      const env = {};
      for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
        if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
      }
      const host = hostOf(env.VITE_SITE_URL || `https://${d}`) || d;
      out.push({ host, env: envHead(env) });
    }
  }
  if (!out.length && hostOf(fallbackUrl || '')) out.push({ host: hostOf(fallbackUrl), env: envHead() });
  return out;
}
