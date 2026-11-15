/**
 * Phát hành trên VPS: mỗi domain trong sites/ build vào một thư mục release mới rồi đổi symlink `current`
 * của domain đó một lần. nginx đọc root = <base>/sites/$host/current → khách không bao giờ thấy bản build dở;
 * domain nào lỗi thì `current` của domain đó giữ nguyên bản đang chạy.
 *
 *   npm run build:release                          build TẤT CẢ domain (webhook CMS gọi lệnh này)
 *   npm run build:release -- sensaparkmik.vn       chỉ build domain được nêu
 *
 * Cấu trúc trên VPS (base mặc định: thư mục cha của mã nguồn, vd /var/www/sensa):
 *   <base>/src                                 mã nguồn (git clone) + .env.production
 *   <base>/sites/<domain>/releases/<id>        các bản build của domain
 *   <base>/sites/<domain>/current              symlink → bản đang chạy (nginx root)
 *
 * Biến môi trường (đặt trong .env.production):
 *   SENSA_BASE_DIR    thư mục gốc chứa sites/                 (mặc định: thư mục cha của mã nguồn)
 *   SENSA_SITES       danh sách domain, cách nhau dấu phẩy     (mặc định: mọi thư mục trong sites/)
 *   SENSA_KEEP        số bản release giữ lại để rollback       (mặc định 5)
 *   SENSA_GIT_PULL=1  cập nhật mã nguồn (git pull --ff-only) trước khi build
 *   SENSA_CHOWN       vd. www-data:www-data — khi build bằng root, trả quyền thư mục release cho user web
 *
 * Rollback thủ công (trong <base>/sites/<domain>): ln -sfn releases/<id> current.tmp && mv -T current.tmp current
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildSite, listSites, loadProductionEnv, readSiteEnv } from './sites.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
loadProductionEnv(root)
const base = resolve(process.env.SENSA_BASE_DIR || resolve(root, '..'))
const keep = Math.max(2, Number(process.env.SENSA_KEEP || 5))
const lock = join(base, '.release.lock')

const log = (m) => console.log(`[release] ${m}`)
const run = (cmd, args, env = {}) => {
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', env: { ...process.env, ...env } })
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} → exit ${r.status}`)
}

const fromArgs = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const fromEnv = (process.env.SENSA_SITES || '').split(',').map((s) => s.trim()).filter(Boolean)
const sites = fromArgs.length ? fromArgs : fromEnv.length ? fromEnv : listSites(root)
if (!sites.length) {
  console.error('[release] Không có domain nào trong sites/ (cần sites/<domain>/site.env).')
  process.exit(2)
}
for (const s of sites) readSiteEnv(root, s) // kiểm tra cấu hình trước khi build

mkdirSync(base, { recursive: true })
if (existsSync(lock)) {
  console.error(`[release] Đang có một bản build khác (${lock}). Xoá file lock nếu chắc chắn không còn tiến trình nào.`)
  process.exit(2)
}
writeFileSync(lock, String(process.pid))

const id = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-')
const done = []
const failed = []
try {
  if (process.env.SENSA_GIT_PULL === '1') {
    log('git pull --ff-only')
    run('git', ['pull', '--ff-only'])
  }
  const commit = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' }).stdout?.trim()
  const common = { SENSA_RELEASE: id, GIT_COMMIT: commit || '' }

  // Lấy nội dung CMS MỘT lần cho mọi domain (lỗi → dừng hết, các website giữ bản đang chạy)
  log('lấy nội dung CMS đã đăng')
  run(process.execPath, [join(root, 'scripts/fetch-cms.mjs')], common)

  log(`build ${sites.length} domain: ${sites.join(', ')}`)
  for (const site of sites) {
    const siteBase = join(base, 'sites', site)
    const releases = join(siteBase, 'releases')
    const current = join(siteBase, 'current')
    const out = join(releases, id)
    mkdirSync(releases, { recursive: true })
    try {
      log(`[${site}] build → ${out}`)
      buildSite(root, site, out, common)
      if (process.env.SENSA_CHOWN) run('chown', ['-R', process.env.SENSA_CHOWN, siteBase])

      // đổi symlink nguyên tử: tạo link tạm rồi rename đè lên `current`
      const tmp = `${current}.tmp-${process.pid}`
      if (existsSync(tmp)) unlinkSync(tmp)
      symlinkSync(out, tmp, 'dir')
      renameSync(tmp, current)
      done.push(site)
      log(`[${site}] ĐÃ PHÁT HÀNH ${id}`)

      // dọn bản cũ, giữ `keep` bản gần nhất
      const old = readdirSync(releases).filter((d) => /^\d{8}-\d{6}$/.test(d)).sort().slice(0, -keep)
      for (const d of old) rmSync(join(releases, d), { recursive: true, force: true })
      if (old.length) log(`[${site}] đã xoá ${old.length} bản cũ`)
    } catch (e) {
      failed.push(site)
      console.error(`[release] [${site}] LỖI: ${e.message} — domain này giữ nguyên bản đang chạy.`)
      rmSync(out, { recursive: true, force: true })
    }
  }
} catch (e) {
  console.error(`[release] LỖI: ${e.message} — mọi website giữ nguyên bản đang chạy.`)
  failed.push('(chung)')
} finally {
  rmSync(lock, { force: true })
}
log(`xong ${id}: ${done.length} thành công${done.length ? ` (${done.join(', ')})` : ''}${failed.length ? ` · ${failed.length} lỗi (${failed.join(', ')})` : ''}`)
process.exit(failed.length ? 1 : 0)
