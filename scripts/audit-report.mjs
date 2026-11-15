/**
 * Tổng hợp tmp/audit-devices/results.json + interactions.json → docs/audit/DEVICE-UIUX-AUDIT.md
 *   node scripts/audit-report.mjs
 */
import fs from 'node:fs/promises'
import { devices } from './devices.mjs'

const R = JSON.parse(await fs.readFile('tmp/audit-devices/results.json', 'utf8'))
let I = []
try { I = JSON.parse(await fs.readFile('tmp/audit-devices/interactions.json', 'utf8')) } catch {}
const GROUP = { apple: 'Apple (iPhone, iPad, Mac)', android: 'Android (điện thoại, tablet)', laptop: 'Laptop', monitor: 'Màn hình rời', tv: 'TV' }
const routes = [...new Set(R.map((r) => r.route))]
const devs = [...new Set(R.map((r) => r.device))]

// Báo nhầm đã kiểm chứng bằng tay (14/11/2026): nút .btn-base / nút CTA dưới đáy có vệt sáng ::after làm scrollWidth gấp đôi
// (chữ không bị cắt); link inline trong cùng đoạn văn xuống dòng nên khung bao trùm nhau (không đè thật).
const FP_CLIP = /btn-base|button\.flex\.min-h-12/
const realClip = (r) => (r.clipped || []).filter((x) => !(FP_CLIP.test(x) && x.endsWith('(cắt ngang)')))
const realOverlap = (r) => (r.textOverlap || []).filter((x) => !/@a\.underline/.test(x))
const CHECKS = [
  { key: 'fatal', label: 'Trang không tải được', test: (r) => !!r.fatal, detail: (r) => r.fatal },
  { key: 'status', label: 'HTTP khác 200', test: (r) => r.status && r.status !== 200, detail: (r) => String(r.status) },
  { key: 'hOverflow', label: 'Tràn ngang (xuất hiện thanh cuộn ngang)', test: (r) => r.hOverflow, detail: (r) => (r.overflowEls || []).join('; ') },
  { key: 'clipped', label: 'Chữ bị cắt / che', test: (r) => realClip(r).length > 0, detail: (r) => realClip(r).join('; ') },
  { key: 'overlap', label: 'Chữ đè lên chữ', test: (r) => realOverlap(r).length > 0, detail: (r) => realOverlap(r).join('; ') },
  { key: 'broken', label: 'Ảnh lỗi', test: (r) => (r.brokenImages || []).length > 0, detail: (r) => r.brokenImages.join('; ') },
  { key: 'bad', label: 'Tài nguyên trả lỗi 4xx/5xx', test: (r) => (r.badResponses || []).length > 0, detail: (r) => r.badResponses.join('; ') },
  { key: 'errors', label: 'Lỗi JavaScript / console', test: (r) => (r.errors || []).length > 0, detail: (r) => r.errors.join('; ') },
  { key: 'hidden', label: 'Nội dung còn ẩn sau khi cuộn hết trang', test: (r) => r.hiddenTextCount > 0, detail: (r) => (r.hiddenText || []).join('; ') },
  { key: 'h1', label: 'H1 không nằm trọn trong màn hình đầu', test: (r) => r.first && !r.first.h1InView, detail: (r) => r.first?.h1Text },
  { key: 'cta', label: 'Không có CTA trong màn hình đầu', test: (r) => r.first && r.first.ctaInView.length === 0, detail: () => '' },
  { key: 'header', label: 'Header chiếm > 15% chiều cao màn hình', test: (r) => r.first && r.first.headerRatio > 0.15, detail: (r) => `${r.first.headerH}px = ${Math.round(r.first.headerRatio * 100)}%` },
  { key: 'cover', label: 'Nút nổi / thanh CTA che nội dung', test: (r) => (r.coverTop || []).length + (r.coverBottom || []).length > 0, detail: (r) => [...(r.coverTop || []), ...(r.coverBottom || [])].join('; ') },
  { key: 'tap', label: 'Vùng chạm < 44px (cảm ứng)', test: (r) => r.touch && r.smallTargetCount > 0, detail: (r) => (r.smallTargets || []).join('; ') },
  { key: 'orphan', label: 'Ngắt dòng mất nghĩa (dòng cuối còn 1 âm tiết)', test: (r) => r.orphanCount > 0, detail: (r) => (r.orphans || []).join('; ') },
  { key: 'tiny', label: 'Chữ quá nhỏ (< 12px cảm ứng, < 11px desktop)', test: (r) => r.tinyTextCount > 0, detail: (r) => (r.tinyText || []).join('; ') },
  { key: 'long', label: 'Dòng chữ quá dài (> 110 ký tự/dòng)', test: (r) => r.longLineCount > 0, detail: (r) => (r.longLines || []).join('; ') },
  { key: 'blurry', label: 'Ảnh bị phóng to quá độ phân giải gốc (mờ)', test: (r) => (r.blurryImages || []).length > 0, detail: (r) => r.blurryImages.join('; ') },
  { key: 'crop', label: 'Ảnh mặt bằng/bản đồ bị cắt (object-fit: cover)', test: (r) => (r.croppedKeyImages || []).length > 0, detail: (r) => r.croppedKeyImages.join('; ') },
  { key: 'snap', label: 'scroll-snap bật trên màn cảm ứng', test: (r) => r.touch && !!r.scrollSnap, detail: (r) => r.scrollSnap },
  { key: 'dialog', label: 'Popup tự mở che màn hình đầu', test: (r) => r.first?.dialogOpen, detail: () => '' },
  { key: 'slow', label: 'Hero ẩn khi vừa tải (opacity tiêu đề = 0)', test: (r) => r.route === '/' && r.early === 0, detail: () => '' },
  { key: 'heroFill', label: 'Bố cục: ảnh hero không phủ kín khung (để trống)', test: (r) => r.layout?.heroImgFill != null && r.layout.heroImgFill < 0.9, detail: (r) => `ảnh phủ ${Math.round(r.layout.heroImgFill * 100)}% khung` },
  { key: 'heroGap', label: 'Bố cục: khoảng trống lớn giữa ảnh và chữ ở hero (> 12% màn hình)', test: (r) => r.layout?.heroGapRatio > 0.12, detail: (r) => `${r.layout.heroGap}px` },
  { key: 'tall', label: 'Bố cục: section trang chủ cao hơn 1 màn hình (cần cuộn trong section)', test: (r) => r.route === '/' && (r.layout?.tallSections || []).length > 0, detail: (r) => r.layout.tallSections.join(', ') + ` (khung ${r.layout.avail}px)` },
]

const lines = []
const p = (s = '') => lines.push(s)
p('# Audit UI/UX trên 142 thiết bị — Imperia Sensa Park')
p()
p(`Ngày chạy: ${new Date().toISOString().slice(0, 10)} · Bản build: \`dist-audit\` (production + prerender, nội dung CMS mặc định) · ${devs.length} thiết bị × ${routes.length} trang = ${R.length} lượt kiểm.`)
p()
p('Công cụ: `scripts/audit-devices.mjs` (Puppeteer/Chromium giả lập viewport, DPR, cảm ứng, User-Agent iOS/Android) · danh sách thiết bị `scripts/devices.mjs` · tổng hợp `scripts/audit-report.mjs`. Ảnh chụp: `tmp/audit-devices/shots/` (màn hình đầu của mọi thiết bị + toàn trang của 14 thiết bị đại diện).')
p()
p('> **Giới hạn:** Chromium giả lập không thay được Safari/WebKit thật (thanh địa chỉ co giãn, `100vh`, bàn phím ảo, cuộn quán tính iOS), trình duyệt Samsung hay trình duyệt TV. Danh sách “Cần kiểm trên máy thật” ở cuối báo cáo.')
p()
const count = (g) => devs.filter((d) => R.find((r) => r.device === d)?.group === g).length
p('| Nhóm | Số thiết bị |'); p('|---|---|')
for (const g of Object.keys(GROUP)) p(`| ${GROUP[g]} | ${count(g)} |`)
p()
p('## 1. Tổng hợp theo loại lỗi')
p()
p('| Loại lỗi | Số lượt | Số thiết bị | Trang bị ảnh hưởng |'); p('|---|---|---|---|')
const hits = {}
for (const c of CHECKS) {
  const rs = R.filter(c.test); hits[c.key] = rs
  if (!rs.length) { p(`| ${c.label} | 0 | 0 | — |`); continue }
  const ds = new Set(rs.map((r) => r.device)), rt = [...new Set(rs.map((r) => r.route))]
  p(`| ${c.label} | ${rs.length} | ${ds.size} | ${rt.length > 5 ? rt.slice(0, 5).join(', ') + ` +${rt.length - 5}` : rt.join(', ')} |`)
}
p()
p('## 2. Chi tiết từng lỗi (ví dụ đại diện)')
for (const c of CHECKS) {
  const rs = hits[c.key]; if (!rs.length) continue
  p(); p(`### ${c.label}`); p()
  // gom theo nội dung chi tiết để thấy lỗi lặp lại trên nhiều thiết bị
  const by = new Map()
  for (const r of rs) { const k = `${r.route} — ${c.detail(r) || ''}`.slice(0, 400); if (!by.has(k)) by.set(k, []); by.get(k).push(`${r.device} (${r.w}×${r.h})`) }
  ;[...by.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 8).forEach(([k, ds]) => p(`- **${ds.length} thiết bị** · ${k}\n  - ví dụ: ${ds.slice(0, 4).join(', ')}${ds.length > 4 ? ', …' : ''}`))
}
p()
p('## 3. Kết quả theo nhóm thiết bị')
for (const g of Object.keys(GROUP)) {
  p(); p(`### ${GROUP[g]}`); p()
  p('| Thiết bị | Viewport | Tràn ngang | Chữ cắt/đè | Vùng chạm nhỏ | Chữ nhỏ | Ảnh mờ | Lỗi JS | Che nội dung |'); p('|---|---|---|---|---|---|---|---|---|')
  for (const d of devices.filter((x) => x.group === g)) {
    const rs = R.filter((r) => r.device === d.name); if (!rs.length) continue
    const n = (k) => hits[k].filter((r) => r.device === d.name).length
    const cell = (v) => (v ? `⚠ ${v}` : '✓')
    p(`| ${d.name} | ${d.w}×${d.h} @${d.dpr}x | ${cell(n('hOverflow'))} | ${cell(n('clipped') + n('overlap'))} | ${d.touch ? cell(n('tap')) : '—'} | ${cell(n('tiny'))} | ${cell(n('blurry'))} | ${cell(n('errors'))} | ${cell(n('cover'))} |`)
  }
}
if (I.length) {
  p(); p('## 4. Tương tác A → B → A (tab, nút chọn, dropdown)'); p()
  p('| Thiết bị | Trang | Khối | Các lựa chọn đã bấm | Chiều cao khối (px) | Nhảy | Ghi chú |'); p('|---|---|---|---|---|---|---|')
  for (const x of I) {
    if (x.fatal || x.errors) { p(`| ${x.device} | ${x.route} | — | — | — | — | ${x.fatal || x.errors.join('; ')} |`); continue }
    p(`| ${x.device} | ${x.route} | ${x.box} | ${x.clicks.join(' → ').replace(/\n/g, ' ')} | ${x.heights.join(' / ')} | ${x.jump > 8 ? '⚠ ' + x.jump : '✓ ' + x.jump} | ${[x.overflow && 'tràn ngang', x.broken && `${x.broken} ảnh lỗi`, x.backToStart > 4 && 'quay lại A không về đúng kích thước'].filter(Boolean).join(', ')} |`)
  }
}
p(); p('## 5. Cần kiểm trên máy thật'); p()
for (const s of ['Safari iOS (iPhone SE, 14/15, 17 Pro Max): thanh địa chỉ co giãn khi cuộn, `svh/dvh` của hero và mặt bằng, bàn phím ảo khi nhập form/popup.', 'iPad Safari (chế độ desktop mặc định từ iPadOS 13 — nhận UA Mac): kiểm tra menu và scroll-snap không bật nhầm.', 'Samsung Internet và trình duyệt Zalo/Facebook in-app: nút Gọi/Zalo, popup, form.', 'Smart TV (Tizen/webOS/Android TV): điều khiển bằng remote (phím mũi tên, focus rõ), chữ đủ lớn khi xem từ xa.', 'Máy cấu hình yếu (Galaxy A, J): độ mượt khi cuộn, hiệu ứng coverflow, bản đồ.'])
  p(`- ${s}`)
await fs.mkdir('docs/audit', { recursive: true })
await fs.writeFile('docs/audit/DEVICE-UIUX-AUDIT.md', lines.join('\n') + '\n')
console.log('docs/audit/DEVICE-UIUX-AUDIT.md', lines.length, 'dòng')
