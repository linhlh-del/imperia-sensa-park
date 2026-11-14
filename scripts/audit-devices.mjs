/**
 * Audit UI/UX tự động trên nhiều thiết bị (scripts/devices.mjs) × mọi route trong sitemap.
 *   AUDIT_URL=http://127.0.0.1:4191 DIST_DIR=dist-audit node scripts/audit-devices.mjs
 * Kết quả: tmp/audit-devices/results.json, interactions.json, ảnh trong tmp/audit-devices/shots/.
 * Giới hạn: chạy bằng Chromium (Puppeteer) giả lập kích thước, DPR, cảm ứng, UA — KHÔNG thay được Safari/WebKit thật.
 */
import puppeteer from 'puppeteer'
import fs from 'node:fs/promises'
import path from 'node:path'
import { devices } from './devices.mjs'

const base = (process.env.AUDIT_URL || 'http://127.0.0.1:4191').replace(/\/$/, '')
const dist = process.env.DIST_DIR || 'dist-audit'
const out = path.resolve('tmp/audit-devices')
const shots = path.join(out, 'shots')
await fs.mkdir(shots, { recursive: true })
const only = (process.env.AUDIT_DEVICES || '').split(',').filter(Boolean)
const list = only.length ? devices.filter((d) => only.some((o) => d.name.includes(o))) : devices
const routes = [...(await fs.readFile(path.join(dist, 'sitemap.xml'), 'utf8')).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
const CONC = Number(process.env.AUDIT_CONCURRENCY || 6)

const UA = {
  apple: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  ipad: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  android: 'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
  androidTab: 'Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
}
const uaFor = (d) => !d.touch ? null : d.group === 'apple' ? (/iPad/.test(d.name) ? UA.ipad : UA.apple) : (Math.min(d.w, d.h) >= 600 ? UA.androidTab : UA.android)
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()

/* ------------- đo trong trang (chạy trong trình duyệt) ------------- */
function measure({ touch, dpr }) {
  const W = innerWidth, H = innerHeight
  const txt = (e) => String(e.getAttribute('aria-label') || e.innerText || e.textContent || e.getAttribute('alt') || e.getAttribute('title') || e.tagName).replace(/\s+/g, ' ').trim().slice(0, 60)
  const sel = (e) => {
    const id = e.id ? '#' + e.id : ''
    const cls = typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : ''
    const sec = e.closest('section[id],header,footer,[id]')
    return `${e.tagName.toLowerCase()}${id}${cls}`.slice(0, 70) + (sec && sec !== e ? ` @${sec.id || sec.tagName.toLowerCase()}` : '')
  }
  const opac = (e) => { let o = 1; for (let n = e; n && n !== document.documentElement; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.display === 'none' || cs.visibility === 'hidden' && n === e) return 0; o *= parseFloat(cs.opacity) } return o }
  const visible = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && opac(e) > 0.05 && !e.closest('[aria-hidden="true"],[inert]') }
  const ownText = (e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
  const fixedOf = (e) => { for (let n = e; n; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === 'fixed' || p === 'sticky') return n } return null }
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
  const srOnly = (e) => !!e.closest('.sr-only,.visually-hidden') || (getComputedStyle(e).position === 'absolute' && e.getBoundingClientRect().width <= 2)
  const clampAnc = (e) => { for (let n = e; n && n !== document.body; n = n.parentElement) { const v = getComputedStyle(n).webkitLineClamp; if (v && v !== 'none') return n } return null }
  const all = [...document.querySelectorAll('body *')].filter((e) => e instanceof HTMLElement && !['SCRIPT', 'STYLE', 'NOSCRIPT', 'BR'].includes(e.tagName))
  const res = {}

  // 1. tràn ngang
  res.docW = document.documentElement.scrollWidth
  res.hOverflow = res.docW > W + 1
  if (res.hOverflow) res.overflowEls = all.filter((e) => { const r = e.getBoundingClientRect(); if (!(r.width > 0 && r.right > W + 1)) return false; for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.overflowX !== 'visible') return false } return true }).slice(0, 6).map((e) => `${sel(e)} → right ${Math.round(e.getBoundingClientRect().right)}px`)

  // 2. chữ bị cắt
  const clipped = []
  for (const e of all) {
    if (!ownText(e) || !visible(e) || srOnly(e) || clampAnc(e)) continue
    const cs = getComputedStyle(e)
    const lc = cs.webkitLineClamp && cs.webkitLineClamp !== 'none'
    // đo phạm vi CHỮ thật (Range) thay vì scrollWidth: pseudo-element trang trí (vd. vệt sáng chạy ngang nút) làm scrollWidth lớn giả
    const tr = (() => { const rg = document.createRange(); rg.selectNodeContents(e); return rg.getBoundingClientRect() })(), er = e.getBoundingClientRect()
    if (['hidden', 'clip'].includes(cs.overflowX) && (tr.right > er.right + 2 || tr.left < er.left - 2) && cs.textOverflow !== 'ellipsis') clipped.push(`${sel(e)} "${txt(e)}" (cắt ngang)`)
    else if (['hidden', 'clip'].includes(cs.overflowY) && (tr.bottom > er.bottom + 3 || tr.top < er.top - 3) && !lc) clipped.push(`${sel(e)} "${txt(e)}" (cắt dọc)`)
    else {
      const r = e.getBoundingClientRect()
      for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
        const ps = getComputedStyle(n)
        if (ps.overflowX === 'visible' && ps.overflowY === 'visible') continue
        if (/auto|scroll/.test(ps.overflowX + ps.overflowY)) break
        const pr = n.getBoundingClientRect(), a = inter(r, pr), full = r.width * r.height
        if (a > 0 && a < full * 0.97 && full > 40) clipped.push(`${sel(e)} "${txt(e)}" (bị khung ${sel(n)} che ${Math.round(100 - a / full * 100)}%)`)
        break
      }
    }
  }
  res.clipped = clipped.slice(0, 8); res.clippedCount = clipped.length

  // 3. chữ đè chữ
  const clipRect = (e) => { let r = e.getBoundingClientRect(); r = { left: r.left, top: r.top, right: r.right, bottom: r.bottom }; for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) { const ps = getComputedStyle(n); if (ps.overflowX !== 'visible' || ps.overflowY !== 'visible') { const q = n.getBoundingClientRect(); r = { left: Math.max(r.left, q.left), top: Math.max(r.top, q.top), right: Math.min(r.right, q.right), bottom: Math.min(r.bottom, q.bottom) } } } r.width = Math.max(0, r.right - r.left); r.height = Math.max(0, r.bottom - r.top); return r }
  const texts = all.filter((e) => ownText(e) && visible(e) && !fixedOf(e) && !srOnly(e) && getComputedStyle(e).display !== 'inline' && e.innerText.trim().length > 1).slice(0, 700).map((e) => ({ e, r: clipRect(e) })).filter((x) => x.r.width > 0 && x.r.height > 0)
  const overlaps = []
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
    const A = texts[i], B = texts[j]
    if (A.e.contains(B.e) || B.e.contains(A.e)) continue
    const a = inter(A.r, B.r); if (!a) continue
    const m = Math.min(A.r.width * A.r.height, B.r.width * B.r.height)
    if (a > m * 0.25 && m > 60) overlaps.push(`"${txt(A.e)}" ↔ "${txt(B.e)}" @${sel(A.e)}`)
  }
  res.textOverlap = overlaps.slice(0, 6); res.textOverlapCount = overlaps.length

  // 4. vùng chạm nhỏ (thiết bị cảm ứng)
  if (touch) {
    const small = []
    for (const e of document.querySelectorAll('a[href],button,[role=button],[role=tab],input:not([type=hidden]),select,textarea,summary,label[for]')) {
      if (!visible(e)) continue
      const r = e.getBoundingClientRect()
      const inline = getComputedStyle(e).display === 'inline' && e.parentElement && String(e.parentElement.innerText || '').trim().length > String(e.innerText || '').trim().length + 15
      if (inline) continue
      if (Math.min(r.width, r.height) < 44) small.push(`${sel(e)} "${txt(e)}" ${Math.round(r.width)}×${Math.round(r.height)}`)
    }
    res.smallTargets = small.slice(0, 8); res.smallTargetCount = small.length
  }

  // 5. chữ quá nhỏ
  const minFs = touch ? 12 : 11
  const tiny = all.filter((e) => ownText(e) && visible(e) && !srOnly(e) && parseFloat(getComputedStyle(e).fontSize) < minFs)
  res.tinyText = tiny.slice(0, 6).map((e) => `${sel(e)} "${txt(e)}" ${getComputedStyle(e).fontSize}`); res.tinyTextCount = tiny.length

  // 6. dòng chữ quá dài (khó đọc)
  const longLines = [...document.querySelectorAll('main p, main li')].filter((e) => visible(e) && e.innerText.length > 120).filter((e) => e.getBoundingClientRect().width / (parseFloat(getComputedStyle(e).fontSize) * 0.5) > 110)
  res.longLines = longLines.slice(0, 4).map((e) => `${sel(e)} ~${Math.round(e.getBoundingClientRect().width / (parseFloat(getComputedStyle(e).fontSize) * 0.5))} ký tự/dòng`); res.longLineCount = longLines.length

  // 7. ảnh
  const imgs = [...document.images]
  res.brokenImages = imgs.filter((i) => i.complete && !i.naturalWidth && (i.currentSrc || i.src)).map((i) => i.currentSrc || i.src).slice(0, 6)
  res.blurryImages = imgs.filter((i) => visible(i) && i.naturalWidth && i.getBoundingClientRect().width > 240 && getComputedStyle(i).objectFit !== 'contain' && i.getBoundingClientRect().width * dpr > i.naturalWidth * 1.4).slice(0, 6).map((i) => `${(i.currentSrc || i.src).split('/').pop()} hiển thị ${Math.round(i.getBoundingClientRect().width)}px×${dpr} > gốc ${i.naturalWidth}px`)
  res.croppedKeyImages = imgs.filter((i) => visible(i) && i.naturalWidth && getComputedStyle(i).objectFit === 'cover' && /mặt bằng|mat-bang|bản đồ|ban-do|vị trí|vi-tri|layout|map|sơ đồ|floor/i.test((i.alt || '') + (i.currentSrc || i.src))).filter((i) => { const r = i.getBoundingClientRect(); const ra = r.width / r.height, na = i.naturalWidth / i.naturalHeight; return Math.abs(ra - na) / na > 0.15 }).slice(0, 5).map((i) => `${(i.alt || i.src).slice(0, 60)} (khung ${Math.round(i.getBoundingClientRect().width)}×${Math.round(i.getBoundingClientRect().height)}, ảnh ${i.naturalWidth}×${i.naturalHeight})`)

  // 8. vùng cuộn ngang trên điện thoại
  if (touch && W < 768) res.hScrollers = all.filter((e) => { const cs = getComputedStyle(e); return /auto|scroll/.test(cs.overflowX) && e.scrollWidth > e.clientWidth + 8 && visible(e) }).slice(0, 5).map((e) => `${sel(e)} (${e.clientWidth}/${e.scrollWidth}px)`)

  // 9. scroll-snap trên cảm ứng
  if (touch) res.scrollSnap = [document.documentElement, document.body].map((e) => getComputedStyle(e).scrollSnapType).find((v) => v && v !== 'none') || null

  // 10. nội dung còn ẩn sau khi đã cuộn hết trang (animation không chạy)
  const hidden = [...document.querySelectorAll('main *')].filter((e) => e instanceof HTMLElement && ownText(e) && !srOnly(e) && e.getBoundingClientRect().width > 0 && !e.closest('[aria-hidden="true"],[role=dialog],[hidden],[inert]') && opac(e) <= 0.05)
  res.hiddenText = hidden.slice(0, 6).map((e) => `${sel(e)} "${txt(e)}"`); res.hiddenTextCount = hidden.length
  return res
}

function firstScreen({ touch }) {
  const W = innerWidth, H = innerHeight
  const inView = (r) => r.bottom > 0 && r.top < H && r.width > 0 && r.right > 0 && r.left < W
  const header = document.querySelector('header')
  const hr = header?.getBoundingClientRect()
  const h1 = document.querySelector('main h1') || document.querySelector('h1')
  const h1r = h1?.getBoundingClientRect()
  const cta = [...document.querySelectorAll('main a[href], main button')].filter((e) => { const r = e.getBoundingClientRect(); return inView(r) && r.bottom <= H && e.innerText.trim() })
  const dialogs = [...document.querySelectorAll('[role=dialog],[aria-modal=true]')].filter((e) => { const r = e.getBoundingClientRect(); return !e.closest('[inert]') && r.width > 0 && r.height > 0 && r.left < W - 4 && r.right > 4 && r.top < H && getComputedStyle(e).visibility !== 'hidden' })
  return {
    headerH: hr ? Math.round(hr.height) : 0,
    headerRatio: hr ? +(hr.height / H).toFixed(2) : 0,
    h1InView: !!(h1r && h1r.top >= 0 && h1r.bottom <= H),
    h1Text: h1?.innerText.trim().slice(0, 60),
    ctaInView: cta.slice(0, 3).map((e) => e.innerText.trim().slice(0, 30)),
    dialogOpen: dialogs.length > 0,
  }
}

function fixedCover() {
  // phần tử cố định (nút nổi, thanh CTA) che link/nút của nội dung trang tại vị trí cuộn hiện tại
  const W = innerWidth, H = innerHeight
  const fixed = [...document.querySelectorAll('body *')].filter((e) => { const cs = getComputedStyle(e); if (cs.position !== 'fixed') return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= H + 1 && r.width < W * 0.98 && parseFloat(cs.opacity) > 0.05 && cs.visibility !== 'hidden' && !e.closest('header') && r.height < H * 0.6 })
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
  const targets = [...document.querySelectorAll('main a[href], main button, footer a[href], footer button, main input, main select')].filter((e) => !fixed.some((f) => f.contains(e)) && e.getBoundingClientRect().width > 0)
  const covered = []
  for (const t of targets) {
    const r = t.getBoundingClientRect(); if (r.bottom <= 0 || r.top >= H) continue
    for (const f of fixed) { const a = inter(r, f.getBoundingClientRect()); if (a > r.width * r.height * 0.3) { covered.push(`"${(t.innerText || t.getAttribute('aria-label') || t.tagName).trim().slice(0, 40)}" bị che bởi ${f.tagName.toLowerCase()}${f.className && typeof f.className === 'string' ? '.' + f.className.split(' ')[0] : ''}`); break } }
  }
  return [...new Set(covered)].slice(0, 5)
}

/* ------------- chạy ------------- */
let browser = await puppeteer.launch({ headless: true, protocolTimeout: 120000, args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'] })
// AUDIT_RESUME=1: giữ kết quả đã có trong results.json, chỉ chạy các lượt còn thiếu (khi lần trước bị dừng giữa chừng)
const results = process.env.AUDIT_RESUME === '1' ? JSON.parse(await fs.readFile(path.join(out, 'results.json'), 'utf8').catch(() => '[]')).filter((r) => !r.fatal) : []
const doneKeys = new Set(results.map((r) => r.device + '|' + r.route))
const jobs = []
for (const dev of list) for (const route of routes) if (!doneKeys.has(dev.name + '|' + route)) jobs.push({ dev, route })
let done = 0
const t0 = Date.now()

async function run(job) {
  try { await runOne(job) } catch (e) {
    // lỗi giao thức Chromium (treo): ghi lại, khởi động lại trình duyệt nếu cần rồi đi tiếp
    results.push({ device: job.dev.name, group: job.dev.group, w: job.dev.w, h: job.dev.h, route: job.route, fatal: 'audit: ' + String(e.message).slice(0, 160) })
    if (!browser.connected) browser = await puppeteer.launch({ headless: true, protocolTimeout: 120000, args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'] })
  }
}
async function runOne({ dev, route }) {
  const page = await browser.newPage()
  const errors = [], bad = []
  page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 160)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)) })
  page.on('response', (r) => { const u = r.url(); if (r.status() >= 400 && u.startsWith(base)) bad.push(`${r.status()} ${u.replace(base, '')}`) })
  await page.setRequestInterception(true)
  page.on('request', (r) => (/googletagmanager|google-analytics|supabase|facebook|doubleclick|workers\.dev/.test(r.url()) ? r.abort() : r.continue()))
  const ua = uaFor(dev); if (ua) await page.setUserAgent(ua)
  await page.setViewport({ width: dev.w, height: dev.h, deviceScaleFactor: 1, isMobile: dev.touch && Math.min(dev.w, dev.h) < 1100, hasTouch: dev.touch })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  const r = { device: dev.name, group: dev.group, w: dev.w, h: dev.h, dpr: dev.dpr, touch: dev.touch, route }
  try {
    const t = Date.now()
    const resp = await page.goto(base + route, { waitUntil: 'networkidle2', timeout: 45000 })
    r.status = resp?.status(); r.loadMs = Date.now() - t
    r.early = await page.evaluate(() => { const h = document.querySelector('main h1'); let o = 1; for (let n = h; n; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity); return h ? +o.toFixed(2) : null })
    await new Promise((s) => setTimeout(s, 4500))
    r.first = await page.evaluate(firstScreen, { touch: dev.touch })
    if (route === '/') await page.screenshot({ path: path.join(shots, `first-${slug(dev.group + '-' + dev.name)}-${dev.w}x${dev.h}.jpg`), type: 'jpeg', quality: 62 })
    if (r.first.dialogOpen) { await page.keyboard.press('Escape'); await new Promise((s) => setTimeout(s, 300)) }
    r.coverTop = await page.evaluate(fixedCover)
    // cuộn hết trang để kích hoạt lazy-load và hiệu ứng xuất hiện
    const total = await page.evaluate(() => document.documentElement.scrollHeight)
    r.pageH = total
    for (let y = 0; y < total; y += Math.round(dev.h * 0.85)) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await new Promise((s) => setTimeout(s, 140)) }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await new Promise((s) => setTimeout(s, 700))
    r.coverBottom = await page.evaluate(fixedCover)
    await page.evaluate(() => window.scrollTo(0, 0)); await new Promise((s) => setTimeout(s, 2500))
    r.dialogAfterScroll = await page.evaluate(() => [...document.querySelectorAll('[role=dialog],[aria-modal=true]')].some((e) => { const r = e.getBoundingClientRect(); return !e.closest('[inert]') && r.height > 0 && r.left < innerWidth - 4 && r.right > 4 && getComputedStyle(e).visibility !== 'hidden' }))
    if (r.dialogAfterScroll) { await page.keyboard.press('Escape'); await new Promise((s) => setTimeout(s, 300)) }
    Object.assign(r, await page.evaluate(measure, { touch: dev.touch, dpr: dev.dpr }))
  } catch (e) { r.fatal = String(e.message).slice(0, 200) }
  r.errors = [...new Set(errors)].slice(0, 5); r.badResponses = [...new Set(bad)].slice(0, 5)
  await page.close().catch(() => {})
  results.push(r)
  if (++done % 50 === 0) { console.log(`${done}/${jobs.length} · ${Math.round((Date.now() - t0) / 1000)}s`); await fs.writeFile(path.join(out, 'results.json'), JSON.stringify(results)) }
}

const queue = [...jobs]
await Promise.all(Array.from({ length: CONC }, async () => { while (queue.length) await run(queue.shift()) }))
await fs.writeFile(path.join(out, 'results.json'), JSON.stringify(results, null, 1))
console.log(`Xong ${results.length} lượt kiểm (${list.length} thiết bị × ${routes.length} route) trong ${Math.round((Date.now() - t0) / 1000)}s`)

/* ------------- ảnh toàn trang cho thiết bị đại diện ------------- */
const reps = ['iPhone SE (2nd/3rd)', 'iPhone 15 / 15 Pro', 'iPhone 17 Pro Max', 'Galaxy S22 / S23 / S25', 'Galaxy Z Fold 5 – gập', 'iPad mini 6 dọc', 'iPad Pro 12.9 ngang', 'Laptop HD 1366×768 – trình duyệt', 'Laptop FHD @125% – trình duyệt', 'Màn FHD 1920×1080', 'Màn QHD 2560×1440', 'Smart TV 4K 3840×2160', 'Màn 1024×768 (4:3)', 'iPhone 14 ngang']
const repRoutes = ['/', '/mat-bang', '/vi-tri', '/tien-ich', '/bang-gia', '/tin-tuc', routes.find((x) => x.startsWith('/tin-tuc/'))]
if (process.env.AUDIT_FULLSHOTS !== '0') for (const name of reps) {
  const dev = devices.find((d) => d.name === name); if (!dev) continue
  for (const route of repRoutes) {
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    page.on('request', (rq) => (/googletagmanager|google-analytics|supabase|facebook|workers\.dev/.test(rq.url()) ? rq.abort() : rq.continue()))
    const ua = uaFor(dev); if (ua) await page.setUserAgent(ua)
    await page.setViewport({ width: dev.w, height: dev.h, deviceScaleFactor: 1, isMobile: dev.touch && Math.min(dev.w, dev.h) < 1100, hasTouch: dev.touch })
    try {
      await page.goto(base + route, { waitUntil: 'networkidle2', timeout: 45000 })
      await page.keyboard.press('Escape')
      const total = await page.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y < total; y += Math.round(dev.h * 0.85)) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await new Promise((s) => setTimeout(s, 160)) }
      await page.evaluate(() => window.scrollTo(0, 0)); await new Promise((s) => setTimeout(s, 4000))
      await page.keyboard.press('Escape')
      await page.screenshot({ path: path.join(shots, `full-${slug(dev.name)}-${slug(route) || 'home'}.jpg`), type: 'jpeg', quality: 55, fullPage: true, captureBeyondViewport: true })
    } catch (e) { console.log('shot fail', name, route, e.message) }
    await page.close()
  }
}

/* ------------- tương tác A→B→A: tab, nút chọn, dropdown ------------- */
const interDevices = ['iPhone SE (2nd/3rd)', 'iPhone 15 / 15 Pro', 'Galaxy S22 / S23 / S25', 'iPad 10th / Air 4-5 dọc', 'Laptop HD 1366×768 – trình duyệt', 'Màn FHD 1920×1080', 'Màn QHD 2560×1440']
const interactions = []
for (const name of interDevices) {
  const dev = devices.find((d) => d.name === name)
  for (const route of ['/', '/mat-bang', '/tien-ich', '/bang-gia', '/vi-tri']) {
    const page = await browser.newPage()
    const errors = []; page.on('pageerror', (e) => errors.push(e.message.slice(0, 140)))
    await page.setRequestInterception(true)
    page.on('request', (rq) => (/googletagmanager|google-analytics|supabase|facebook|workers\.dev/.test(rq.url()) ? rq.abort() : rq.continue()))
    const ua = uaFor(dev); if (ua) await page.setUserAgent(ua)
    await page.setViewport({ width: dev.w, height: dev.h, deviceScaleFactor: 1, isMobile: dev.touch && Math.min(dev.w, dev.h) < 1100, hasTouch: dev.touch })
    try {
      await page.goto(base + route, { waitUntil: 'networkidle2', timeout: 45000 })
      await page.keyboard.press('Escape')
      const total = await page.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y < total; y += dev.h) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await new Promise((s) => setTimeout(s, 100)) }
      const n = await page.evaluate(() => { const c = [...document.querySelectorAll('main [role=tab], main [aria-pressed], main [aria-haspopup], main [role=option]')].filter((e) => e.getBoundingClientRect().width > 0); c.forEach((e, i) => e.setAttribute('data-audit-i', i)); return c.length })
      const groups = await page.evaluate(() => { const g = {}; for (const e of document.querySelectorAll('[data-audit-i]')) { const box = e.closest('section') || e.parentElement; const k = box.id || box.className.toString().slice(0, 30); (g[k] ||= []).push(+e.dataset.auditI) } return g })
      for (const [box, idx] of Object.entries(groups)) {
        const seq = idx.length > 1 ? [idx[0], idx[1], idx[idx.length - 1], idx[0]] : [idx[0]]
        const sizes = []
        for (const i of seq) {
          const info = await page.evaluate(async (i) => {
            const e = document.querySelector(`[data-audit-i="${i}"]`); if (!e || !e.getBoundingClientRect().width) return null
            e.scrollIntoView({ block: 'center' }); await new Promise((s) => setTimeout(s, 150)); e.click(); await new Promise((s) => setTimeout(s, 650))
            const box = e.closest('section') || e.parentElement; const r = box.getBoundingClientRect()
            return { label: (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 30), h: Math.round(r.height), w: Math.round(r.width), overflow: document.documentElement.scrollWidth > innerWidth + 1, broken: [...document.images].filter((im) => im.complete && !im.naturalWidth && im.currentSrc).length }
          }, i)
          if (info) sizes.push(info)
          await page.keyboard.press('Escape')
        }
        if (sizes.length > 1) {
          const hs = sizes.map((s) => s.h)
          interactions.push({ device: name, route, box, clicks: sizes.map((s) => s.label), heights: hs, jump: Math.max(...hs) - Math.min(...hs), backToStart: Math.abs(hs[0] - hs[hs.length - 1]), overflow: sizes.some((s) => s.overflow), broken: Math.max(...sizes.map((s) => s.broken)), controls: n })
        }
      }
    } catch (e) { interactions.push({ device: name, route, fatal: e.message.slice(0, 160) }) }
    if (errors.length) interactions.push({ device: name, route, errors: [...new Set(errors)].slice(0, 3) })
    await page.close()
  }
}
await fs.writeFile(path.join(out, 'interactions.json'), JSON.stringify(interactions, null, 1))
await browser.close()
console.log('Xong ảnh và tương tác.')
