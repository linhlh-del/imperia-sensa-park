/**
 * Nhiều domain, mỗi domain một bản build riêng (cùng mã nguồn).
 *
 *   sites/<domain>/site.env   cấu hình riêng của domain:
 *     VITE_SITE_URL   bắt buộc — canonical, sitemap, robots, JSON-LD của domain
 *     SITE_TEMPLATE   giao diện dùng cho domain (mặc định "park" — template hiện tại)
 *     (thêm được VITE_GTM_ID, VITE_LEAD_ENDPOINT… riêng cho từng domain)
 *
 * Các biến trong site.env được gán vào process.env nên ghi đè .env.production
 * (Vite và prerender đều ưu tiên process.env hơn file .env).
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/** Template có sẵn. Khi làm xong template mới, thêm tên vào đây rồi đổi SITE_TEMPLATE trong site.env của domain. */
export const TEMPLATES = ['park']

export const sitesDir = (root) => join(root, 'sites')

/** Danh sách domain có file sites/<domain>/site.env, sắp theo tên. */
export function listSites(root) {
  const dir = sitesDir(root)
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, 'site.env')))
    .map((d) => d.name)
    .sort()
}

/** Đọc sites/<domain>/site.env (KEY=VALUE, bỏ dòng trống và dòng #). */
export function readSiteEnv(root, site) {
  if (!/^[a-z0-9.-]+$/i.test(site)) throw new Error(`Tên site không hợp lệ: ${site}`)
  const file = join(sitesDir(root), site, 'site.env')
  if (!existsSync(file)) throw new Error(`Không có ${file}`)
  const env = {}
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i)
    if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2')
  }
  if (!env.VITE_SITE_URL) throw new Error(`${file}: thiếu VITE_SITE_URL`)
  env.VITE_SITE_URL = env.VITE_SITE_URL.replace(/\/+$/, '')
  env.SITE_TEMPLATE = env.SITE_TEMPLATE || 'park'
  if (!TEMPLATES.includes(env.SITE_TEMPLATE)) {
    throw new Error(`${file}: SITE_TEMPLATE="${env.SITE_TEMPLATE}" chưa có (đang có: ${TEMPLATES.join(', ')})`)
  }
  return env
}

/** Nạp .env.production (mọi biến, không chỉ VITE_) vào process.env; biến đã có trong môi trường được giữ nguyên. */
export function loadProductionEnv(root) {
  const file = join(root, '.env.production')
  if (!existsSync(file)) return
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i)
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2')
  }
}

/**
 * Build một domain vào thư mục `out`: vite build → prerender (HTML tĩnh + sitemap/robots) → seo-check.
 * Nội dung CMS phải được lấy trước (scripts/fetch-cms.mjs) — hàm này không gọi lại.
 * Lỗi ở bước nào thì ném lỗi; người gọi quyết định giữ bản đang chạy.
 */
export function buildSite(root, site, out, extraEnv = {}) {
  const env = { ...process.env, ...extraEnv, ...readSiteEnv(root, site), DIST_DIR: out }
  const steps = [
    [join(root, 'node_modules/vite/bin/vite.js'), 'build', '--outDir', out, '--emptyOutDir'],
    [join(root, 'scripts/prerender.mjs')],
    [join(root, 'scripts/seo-check.mjs')],
  ]
  for (const args of steps) {
    const r = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit', env })
    if (r.status !== 0) throw new Error(`${args[0].split(/[\\/]/).pop()} ${args.slice(1).join(' ')} → exit ${r.status}`)
  }
}
