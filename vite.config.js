import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { cmsHeadPlugin, hostOf, readCms } from './scripts/cms-head.mjs'

/* Nội dung CMS (scripts/fetch-cms.mjs ghi trước khi build): thẻ head, endpoint lead.
   Giá trị trong CMS được ưu tiên hơn biến môi trường Vercel. */
const cms = readCms(fileURLToPath(new URL('./src/generated/cms-content.json', import.meta.url)))
if (/^https:\/\/\S+$/.test(cms.lead?.endpoint || '')) process.env.VITE_LEAD_ENDPOINT = cms.lead.endpoint
/* tracker analytics → Edge Function collect của Supabase CMS */
const cmsUrl = (process.env.CMS_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '')
if (cmsUrl && !process.env.VITE_CMS_COLLECT_URL) process.env.VITE_CMS_COLLECT_URL = `${cmsUrl}/functions/v1/collect`
process.env.VITE_CMS_PROJECT = 'sensa-park'

const siteUrl = new URL(process.env.VITE_SITE_URL || loadEnv('production', process.cwd(), 'VITE_').VITE_SITE_URL || 'https://sensaparkmik.vn').origin;
export default defineConfig({
  // USERNAME có thể được kế thừa từ tài khoản mở sandbox. whoami đọc tài khoản thực chạy Vite.
  cacheDir: process.platform === 'win32'
    ? 'node_modules/.vite-cache/' + execFileSync(join(process.env.SystemRoot, 'System32', 'whoami.exe'), {
        encoding: 'utf8', windowsHide: true,
      }).trim().replace(/[^\w.-]/g, '_')
    : 'node_modules/.vite',
  /* site không có trình tải GTM riêng → chèn snippet GTM chuẩn vào <head>.
     Thẻ theo domain đang build: CMS "Thẻ head & tracking" (riêng domain → tất cả domain → site.env). */
  plugins: [react(), cmsHeadPlugin(cms, { gtm: true, host: hostOf(siteUrl) }), {
    name: 'sensa-site-origin',
    transformIndexHtml: { order: 'pre', handler: (html) => html.replaceAll('https://sensaparkmik.vn', siteUrl) },
  }],
})
