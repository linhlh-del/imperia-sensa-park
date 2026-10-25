import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { cmsHeadPlugin, readCms } from './scripts/cms-head.mjs'

/* Nội dung CMS (scripts/fetch-cms.mjs ghi trước khi build): thẻ head, endpoint lead.
   Giá trị trong CMS được ưu tiên hơn biến môi trường Vercel. */
const cms = readCms(fileURLToPath(new URL('./src/generated/cms-content.json', import.meta.url)))
if (/^https:\/\/\S+$/.test(cms.lead?.endpoint || '')) process.env.VITE_LEAD_ENDPOINT = cms.lead.endpoint
/* tracker analytics → Edge Function collect của Supabase CMS */
const cmsUrl = (process.env.CMS_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '')
if (cmsUrl && !process.env.VITE_CMS_COLLECT_URL) process.env.VITE_CMS_COLLECT_URL = `${cmsUrl}/functions/v1/collect`
process.env.VITE_CMS_PROJECT = 'sensa-park'

export default defineConfig({
  /* site không có trình tải GTM riêng → chèn snippet GTM chuẩn vào <head> */
  plugins: [react(), cmsHeadPlugin(cms, { gtm: true })],
})
