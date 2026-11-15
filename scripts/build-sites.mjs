/**
 * Build thử mọi domain trên máy dev (không đụng symlink như release.mjs):
 *   npm run build:sites                         → dist-sites/<domain>/ cho mọi domain trong sites/
 *   npm run build:sites -- sensaparkmik.vn      → chỉ domain được nêu
 * Nội dung CMS lấy một lần (SKIP_CMS=1 để dùng lại bản đã lấy).
 */
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildSite, listSites, loadProductionEnv, readSiteEnv } from './sites.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
loadProductionEnv(root)
const args = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const sites = args.length ? args : listSites(root)
for (const s of sites) readSiteEnv(root, s)

if (process.env.SKIP_CMS !== '1') {
  const r = spawnSync(process.execPath, [join(root, 'scripts/fetch-cms.mjs')], { cwd: root, stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status || 1)
}
for (const site of sites) {
  console.log(`\n=== ${site} ===`)
  try {
    buildSite(root, site, join(root, 'dist-sites', site))
  } catch (e) {
    console.error(`[build-sites] ${site}: ${e.message}`)
    process.exit(1)
  }
}
console.log(`\nĐã build ${sites.length} domain vào dist-sites/: ${sites.join(', ')}`)
