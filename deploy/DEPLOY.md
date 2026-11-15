# Triển khai Imperia Sensa Park lên VPS — 3 domain, mỗi domain một bản build

| Domain | Vai trò | Template |
|---|---|---|
| `sensaparkmik.vn` | Domain chính | `park` (giao diện hiện tại) |
| `canhoimperiasensa.vn` | Vệ tinh | tạm dùng `park` |
| `sensapark-residences.vn` | Vệ tinh | tạm dùng `park` |

Chạy chung VPS và Cloudflare Tunnel với QTOPIA. Cách làm giống QTOPIA, chỉ khác thư mục (`/var/www/sensa`) và chứng chỉ (`sensaparkmik.vn`).

```
Khách ──► Cloudflare (3 zone) ──► Tunnel qtopia-vps ──► nginx :443 (SNI sensaparkmik.vn)
                                                         root = /var/www/sensa/sites/$host/current
CMS "Đăng" ──► Supabase cms-admin ──► https://sensaparkmik.vn/cms-deploy ──► deploy hook :8790
                                         └─ npm run build:release (/var/www/sensa/src)
                                              1. fetch-cms (một lần)
                                              2. mỗi domain: vite build → prerender → seo-check → releases/<id>
                                              3. đạt → đổi symlink current; lỗi → domain đó giữ bản cũ
```

Thư mục trên VPS:

```
/var/www/sensa/src                              mã nguồn (git clone) + .env.production
/var/www/sensa/sites/<domain>/releases/<id>     các bản build (giữ 5 bản để rollback)
/var/www/sensa/sites/<domain>/current           symlink → bản đang chạy (nginx đọc ở đây)
```

Cấu hình riêng từng domain nằm trong repo: `sites/<domain>/site.env` (`VITE_SITE_URL`, `SITE_TEMPLATE`).

---

## Bước 1. Đưa 3 domain vào Cloudflare

Dùng **cùng tài khoản Cloudflare có tunnel `qtopia-vps`**. Route của tunnel chỉ gắn được domain trong cùng tài khoản.

Với từng domain (`sensaparkmik.vn`, `canhoimperiasensa.vn`, `sensapark-residences.vn`):

1. Cloudflare → **Add a domain** → nhập domain → gói Free.
2. Cloudflare có thể tự quét và tạo bản ghi DNS cũ. **Xoá các bản ghi A/AAAA/CNAME của `@` và `www`**, vì tunnel sẽ tự tạo lại ở bước 5.
3. Vào trang quản lý domain ở nhà đăng ký (PA Vietnam hoặc nơi bạn mua), đổi **nameserver** sang 2 nameserver Cloudflare hiển thị.
4. Chờ domain chuyển sang **Active** (thường 5–30 phút, tối đa 24 giờ).
5. **SSL/TLS → Overview:** chọn **Full (strict)**.
6. **SSL/TLS → Edge Certificates:** bật **Always Use HTTPS**.

## Bước 2. Chứng chỉ Origin (chỉ cần cho `sensaparkmik.vn`)

Zone `sensaparkmik.vn` → **SSL/TLS → Origin Server → Create Certificate**:

- Hostnames: `sensaparkmik.vn`, `*.sensaparkmik.vn`
- Thời hạn 15 năm, định dạng PEM

Lưu lên VPS. Không dán private key vào chat hay commit vào git.

```bash
sudo nano /etc/ssl/cloudflare/sensaparkmik.vn.pem   # dán "Origin Certificate"
sudo nano /etc/ssl/cloudflare/sensaparkmik.vn.key   # dán "Private Key"
sudo chmod 600 /etc/ssl/cloudflare/sensaparkmik.vn.key
```

2 domain vệ tinh không cần chứng chỉ riêng. Tunnel luôn kết nối vào nginx bằng tên `sensaparkmik.vn` (Origin Server Name ở bước 5), nginx trả đúng chứng chỉ này rồi chọn thư mục theo domain khách gõ.

## Bước 3. Mã nguồn và build lần đầu trên VPS

Chạy bằng root như QTOPIA (Node cài qua nvm trong `/root`).

```bash
sudo -i
mkdir -p /var/www/sensa && cd /var/www/sensa
git clone https://github.com/linhlh-del/imperia-sensa-park.git src
cd src && npm ci
# Chrome cho bước prerender (HTML tĩnh cho SEO) + thư viện hệ thống
npx puppeteer browsers install chrome --install-deps
```

Repo private thì clone giống cách đã làm với QTOPIA (Personal Access Token hoặc deploy key).

Tạo `/var/www/sensa/src/.env.production` (`nano`, sau đó `chmod 600`). **Không** đặt `VITE_SITE_URL` ở đây; mỗi domain lấy từ `sites/<domain>/site.env`.

```ini
# Chép từ Vercel → project imperia-sensa-park → Settings → Environment Variables
CMS_SUPABASE_URL=https://<project>.supabase.co
CMS_SUPABASE_ANON_KEY=<anon key>
VITE_LEAD_ENDPOINT=<URL worker sensa-park-lead-worker>
# Phát hành
SENSA_BASE_DIR=/var/www/sensa
```

Mọi biến khác đang có trên Vercel (GTM…) cũng chép sang, trừ `VITE_SITE_URL`.

Build lần đầu (khoảng 2–3 phút cho 3 domain):

```bash
cd /var/www/sensa/src && npm run build:release
ls -l /var/www/sensa/sites/*/current      # mỗi domain → releases/<id>
```

Cuối log phải có `xong <id>: 3 thành công`.

Nếu prerender báo không mở được Chrome, thêm `PRERENDER_CHROMIUM=sparticuz` vào `.env.production` (dùng Chrome đóng gói sẵn) rồi build lại.

## Bước 4. nginx

Từ thư mục mã nguồn:

```bash
cd /var/www/sensa/src
cp deploy/sensa-security.conf /etc/nginx/snippets/sensa-security.conf
cp deploy/nginx-sensa.conf /etc/nginx/sites-available/sensa
ln -s ../sites-available/sensa /etc/nginx/sites-enabled/sensa
nginx -t && systemctl reload nginx
```

Nếu `nginx -t` báo lỗi ở `http2 on;` (nginx cũ), sửa giống file QTOPIA: xoá dòng `http2 on;` và đổi `listen 443 ssl;` thành `listen 443 ssl http2;`.

Kiểm tra ngay trên VPS (chưa cần DNS):

```bash
for d in sensaparkmik.vn canhoimperiasensa.vn sensapark-residences.vn; do
  curl -sk --resolve $d:443:127.0.0.1 https://$d/ | grep -o '<link rel="canonical"[^>]*>'
done
```

Mỗi dòng phải ra canonical đúng domain của nó.

## Bước 5. Route trên Cloudflare Tunnel

Cloudflare **Zero Trust → Networks → Tunnels → `qtopia-vps` → Public hostnames** (hoặc *Published application routes*) → **Add**. Tạo 6 route:

| Subdomain | Domain | Service |
|---|---|---|
| *(trống)* | `sensaparkmik.vn` | `HTTPS` · `localhost:443` |
| `www` | `sensaparkmik.vn` | `HTTPS` · `localhost:443` |
| *(trống)* | `canhoimperiasensa.vn` | `HTTPS` · `localhost:443` |
| `www` | `canhoimperiasensa.vn` | `HTTPS` · `localhost:443` |
| *(trống)* | `sensapark-residences.vn` | `HTTPS` · `localhost:443` |
| `www` | `sensapark-residences.vn` | `HTTPS` · `localhost:443` |

Mỗi route: **Additional application settings → TLS → Origin Server Name = `sensaparkmik.vn`** (cả 6 route đều ghi `sensaparkmik.vn`, kể cả route của 2 domain vệ tinh).

Lưu route là Cloudflare tự tạo bản ghi CNAME. Nếu báo "record already exists", xoá bản ghi `@`/`www` cũ trong DNS của domain đó rồi lưu lại.

Kiểm tra từ máy bất kỳ:

```bash
curl -sI https://sensaparkmik.vn | head -1                 # HTTP/2 200
curl -sI https://www.canhoimperiasensa.vn | grep -i location # → https://canhoimperiasensa.vn/
curl -s https://sensapark-residences.vn/robots.txt          # Sitemap: https://sensapark-residences.vn/sitemap.xml
```

## Bước 6. Form lead và analytics nhận domain mới

1. **Lead worker** (domain mới đã được thêm vào `ALLOWED_ORIGINS` trong `be/sensa-park/wrangler.jsonc`):
   ```bash
   cd be/sensa-park && npx wrangler deploy
   ```
   Nếu bạn sửa worker trên dashboard Cloudflare: Workers → `sensa-park-lead-worker` → Settings → Variables → `ALLOWED_ORIGINS`, thêm `https://sensaparkmik.vn,https://canhoimperiasensa.vn,https://sensapark-residences.vn`.
2. **Supabase → SQL Editor:** chạy nội dung `cms-supabase/supabase/migrations/20261115000000_sensa_multi_domain.sql`. Lệnh này đặt domain chính cho CMS và cho phép analytics từ 2 domain vệ tinh. Chỉ chạy **sau khi** `https://sensaparkmik.vn/cms-status.json` đã mở được.
3. Gửi thử form trên cả 3 domain, kiểm tra lead về Google Sheet và trang Lead của CMS.

## Bước 7. Nút "Đăng" của CMS build trên VPS

Dùng lại service deploy hook của QTOPIA (`qtopia-deploy-hook`). `server.mjs` mới đã có thêm project `sensa-park`.

```bash
# chép server.mjs mới (cms-supabase/vps-deploy-hook/server.mjs) lên VPS
nano /opt/qtopia-deploy-hook/server.mjs        # dán nội dung mới (hoặc scp)
openssl rand -hex 32                            # token mới cho Sensa
nano /etc/qtopia-deploy-hook.env               # thêm 2 dòng:
#   DEPLOY_HOOK_TOKEN_SENSA_PARK=<token vừa tạo>
#   SENSA_DIR=/var/www/sensa/src
systemctl restart qtopia-deploy-hook
journalctl -u qtopia-deploy-hook -n 5          # phải thấy "projects: qtopia, sensa-park"
```

**Supabase → Edge Functions → Secrets** (sửa trên dashboard):

- `DEPLOY_HOOK_SENSA_PARK` = `https://sensaparkmik.vn/cms-deploy` (thay URL Deploy Hook của Vercel)
- `DEPLOY_HOOK_TOKEN_SENSA_PARK` = token vừa tạo

**CMS trên Vercel** (project `sensa-park-cms` → Settings → Environment Variables), rồi Redeploy:

- `VITE_SCHEMA_URL` = `https://sensaparkmik.vn/cms-schema.json`
- `VITE_STATUS_URL` = `https://sensaparkmik.vn/cms-status.json`

Thử: sửa một chữ trong CMS → **Đăng** → `journalctl -u qtopia-deploy-hook -f` thấy build 3 domain → khoảng 3 phút sau cả 3 website có nội dung mới.

## Bước 8. Bản Vercel và Google

- **Bản Vercel** (`imperia-sensa-park.vercel.app`) đang có cùng nội dung. Khi 3 domain đã chạy ổn, chọn một trong hai: chặn index (thêm header `X-Robots-Tag: noindex` trong `vercel.json`) để giữ làm bản xem thử, hoặc xoá project trên Vercel.
- **Google Search Console:** thêm 3 property dạng *Domain* (xác minh bằng bản ghi TXT trong Cloudflare DNS), gửi `https://<domain>/sitemap.xml` cho từng domain.

> **SEO:** khi 2 domain vệ tinh còn chung template và nội dung với domain chính, Google dễ coi là trùng lặp và chỉ xếp hạng một domain. Ưu tiên làm template/nội dung riêng cho vệ tinh. Nếu muốn dồn hết sức mạnh SEO về domain chính trong lúc chờ, có thể cho vệ tinh 301 về `sensaparkmik.vn`.

---

## Vận hành

| Việc | Lệnh (trên VPS, quyền root) |
|---|---|
| Phát hành code mới | `cd /var/www/sensa/src && git pull && npm ci && npm run build:release` |
| Chỉ một domain | `npm run build:release -- canhoimperiasensa.vn` |
| Rollback một domain | `cd /var/www/sensa/sites/<domain> && ls releases && ln -sfn releases/<id> current.tmp && mv -T current.tmp current` |
| Bản đang chạy | `curl -s https://sensaparkmik.vn/cms-status.json` |
| Log nút Đăng | `journalctl -u qtopia-deploy-hook -f` |
| Build thử trên máy dev | `npm run build:sites` → `dist-sites/<domain>/` |

## Khi có template thứ 2, thứ 3

1. Làm template mới, cho build chọn giao diện theo biến `SITE_TEMPLATE` (hiện mới có `park` nên build chưa cần đọc biến này), rồi thêm tên template vào `TEMPLATES` trong `scripts/sites.mjs`.
2. Đổi `SITE_TEMPLATE=<tên>` trong `sites/<domain>/site.env` của domain vệ tinh.
3. Commit, push, chạy `git pull && npm run build:release` trên VPS. nginx, tunnel và Cloudflare không phải sửa gì.

## Thêm domain thứ 4

Tạo `sites/<domain>/site.env`, thêm tên vào 3 chỗ `server_name` trong `deploy/nginx-sensa.conf` (khối 80, khối www, khối chính), thêm domain vào `ALLOWED_ORIGINS` của lead worker và `site_origins` trong Supabase, thêm 2 route tunnel (Origin Server Name `sensaparkmik.vn`), rồi build lại.
