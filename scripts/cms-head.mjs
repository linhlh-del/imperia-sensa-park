/* ============================================================
   THẺ HEAD TỪ CMS — dùng trong vite.config.js (transformIndexHtml) lúc build.
   Mọi mã ID được kiểm tra định dạng trước khi ghép vào script (chống chèn mã qua ô ID).
   Script bên thứ ba được nạp bằng một đoạn inline (prerender băm hash vào CSP; 'strict-dynamic' cho phép script nó tạo).
   customHead / customBodyStart: chèn nguyên văn — chỉ owner sửa được trong CMS.
   ============================================================ */
import { existsSync, readFileSync } from 'node:fs';

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

/** Đọc src/generated/cms-content.json (không có → {}) */
export function readCms(file) {
  try {
    return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
  } catch {
    console.warn('[cms] cms-content.json hỏng — bỏ qua nội dung CMS');
    return {};
  }
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
 * Chuỗi HTML chèn vào <head> và đầu <body>.
 * opts.gtm: true → chèn snippet GTM (site không có trình tải GTM riêng). Norton tự tải GTM qua VITE_GTM_ID.
 * opts.nonce: thuộc tính nonce cho script inline (Nginx thay __CSP_NONCE__ mỗi lượt tải).
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
    head.push(`<script${n}>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':Date.now(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${h.gtmId}');</script>`);
    body.push(`<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${h.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`);
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

  if (h.customHead) head.push(`<!-- CMS: mã tuỳ chỉnh -->\n${h.customHead}`);
  if (h.customBodyStart) body.unshift(`<!-- CMS: mã tuỳ chỉnh -->\n${h.customBodyStart}`);

  return { head: head.join('\n    '), bodyStart: body.join('\n    '), gtmId: h.gtmId || '' };
}

/** Vite plugin: chèn thẻ head từ CMS vào index.html */
export function cmsHeadPlugin(cms, opts) {
  return {
    name: 'cms-head',
    transformIndexHtml(html) {
      const { head, bodyStart } = headHtml(cms.head, opts);
      let out = html;
      if (head) out = out.replace('</head>', `    ${head}\n  </head>`);
      if (bodyStart) out = out.replace(/<body([^>]*)>/, `<body$1>\n    ${bodyStart}`);
      return out;
    },
  };
}
