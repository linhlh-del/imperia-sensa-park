#!/usr/bin/env bash
# Cài Imperia Sensa Park lên VPS (chạy bằng root, chạy lại nhiều lần không sao):
#   curl -fsSLo /root/setup-sensa.sh https://raw.githubusercontent.com/linhlh-del/imperia-sensa-park/main/deploy/setup-vps.sh
#   bash /root/setup-sensa.sh
#
# Script làm:
#   1. Tạo /var/www/sensa/src và /var/www/sensa/sites/<domain>/releases cho 3 domain
#   2. Clone (hoặc git pull) mã nguồn, npm ci, cài Chrome cho prerender
#   3. Tạo /var/www/sensa/src/.env.production nếu chưa có (chmod 600)
#   4. Build 3 domain (npm run build:release) → sites/<domain>/current
#   5. Cài cấu hình nginx; chỉ bật khi đã có chứng chỉ Origin của sensaparkmik.vn
#      (nginx -t lỗi thì tự gỡ ra, không làm hỏng QTOPIA)
# Không đụng tới cloudflared, QTOPIA hay deploy hook.
set -euo pipefail

BASE=/var/www/sensa
SRC=$BASE/src
REPO=${REPO:-https://github.com/linhlh-del/imperia-sensa-park.git}
DOMAINS=(sensaparkmik.vn canhoimperiasensa.vn sensapark-residences.vn)
CERT=/etc/ssl/cloudflare/sensaparkmik.vn.pem
KEY=/etc/ssl/cloudflare/sensaparkmik.vn.key

step() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m[!] %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m[ok] %s\033[0m\n' "$*"; }

[ "$(id -u)" = 0 ] || { echo "Chạy bằng root: sudo -i rồi bash $0"; exit 1; }

# Node cài qua nvm trong /root giống QTOPIA
export NVM_DIR="${NVM_DIR:-/root/.nvm}"
# shellcheck disable=SC1091
if [ -s "$NVM_DIR/nvm.sh" ]; then set +eu; . "$NVM_DIR/nvm.sh"; set -eu; fi
command -v node >/dev/null || { echo "Không thấy node. Cài nvm + node như QTOPIA rồi chạy lại."; exit 1; }
command -v git >/dev/null || { echo "Không thấy git: apt install -y git"; exit 1; }
command -v nginx >/dev/null || { echo "Không thấy nginx: apt install -y nginx"; exit 1; }
ok "node $(node -v), npm $(npm -v)"

step "1. Thư mục"
mkdir -p "$BASE"
for d in "${DOMAINS[@]}"; do mkdir -p "$BASE/sites/$d/releases"; done
ls -d "$BASE"/sites/*/

step "2. Mã nguồn"
if [ -d "$SRC/.git" ]; then
  git -C "$SRC" pull --ff-only
else
  [ -e "$SRC" ] && [ -n "$(ls -A "$SRC" 2>/dev/null)" ] && { echo "$SRC đã có file nhưng không phải git repo. Kiểm tra rồi xoá thư mục này."; exit 1; }
  git clone "$REPO" "$SRC"
fi
git -C "$SRC" log --oneline -1
cd "$SRC"
npm ci --no-audit --no-fund
npx --yes puppeteer browsers install chrome --install-deps

step "3. .env.production"
ENV_FILE=$SRC/.env.production
if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" <<'EOF'
# Chép từ Vercel → project imperia-sensa-park → Settings → Environment Variables (môi trường Production).
# KHÔNG đặt VITE_SITE_URL ở đây: mỗi domain lấy từ sites/<domain>/site.env.
CMS_SUPABASE_URL=https://ocbsfqgqukhaixskzwdz.supabase.co
CMS_SUPABASE_ANON_KEY=
# Để trống thì dùng endpoint lead cấu hình trong CMS
VITE_LEAD_ENDPOINT=
SENSA_BASE_DIR=/var/www/sensa
# Bỏ dấu # nếu prerender báo không mở được Chrome
#PRERENDER_CHROMIUM=sparticuz
EOF
  ok "Đã tạo $ENV_FILE"
fi
chmod 600 "$ENV_FILE"
if ! grep -qE '^CMS_SUPABASE_ANON_KEY=.+' "$ENV_FILE"; then
  warn "CMS_SUPABASE_ANON_KEY còn trống → build sẽ dùng nội dung mặc định trong code, không có nội dung CMS."
  warn "Điền vào: nano $ENV_FILE  rồi chạy lại script này."
fi

step "4. Build 3 domain"
if [ "${SKIP_BUILD:-0}" = 1 ]; then
  warn "SKIP_BUILD=1 → bỏ qua build"
else
  npm run build:release || warn "Có domain build lỗi (xem log phía trên). Domain lỗi giữ bản cũ / chưa có bản build."
fi
for d in "${DOMAINS[@]}"; do
  if [ -L "$BASE/sites/$d/current" ]; then ok "$d → $(readlink "$BASE/sites/$d/current")"; else warn "$d chưa có bản build (current)"; fi
done

step "5. nginx"
cp deploy/sensa-security.conf /etc/nginx/snippets/sensa-security.conf
cp deploy/nginx-sensa.conf /etc/nginx/sites-available/sensa
NGINX_VER=$(nginx -v 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
if [ "$(printf '%s\n1.25.1\n' "$NGINX_VER" | sort -V | head -1)" != "1.25.1" ]; then
  # nginx cũ (vd. 1.18 trên Ubuntu 22.04) chưa có "http2 on;"
  sed -i -e '/^\s*http2 on;/d' -e 's/listen \(\[::\]:\)\?443 ssl;/listen \1443 ssl http2;/' /etc/nginx/sites-available/sensa
  ok "nginx $NGINX_VER: dùng 'listen 443 ssl http2'"
fi
mkdir -p /etc/ssl/cloudflare
NGINX_ON=0
if [ -s "$CERT" ] && [ -s "$KEY" ]; then
  chmod 600 "$KEY"
  ln -sfn ../sites-available/sensa /etc/nginx/sites-enabled/sensa
  if nginx -t; then
    systemctl reload nginx
    NGINX_ON=1
    ok "nginx đã bật site sensa"
  else
    rm -f /etc/nginx/sites-enabled/sensa
    warn "nginx -t lỗi → đã gỡ site sensa ra, nginx đang chạy giữ nguyên. Gửi lỗi phía trên để xử lý."
  fi
else
  rm -f /etc/nginx/sites-enabled/sensa
  warn "Chưa có chứng chỉ Origin → chưa bật nginx cho Sensa. Tạo trên Cloudflare (zone sensaparkmik.vn → SSL/TLS → Origin Server),"
  warn "  hostnames sensaparkmik.vn, *.sensaparkmik.vn, rồi dán vào:"
  warn "    nano $CERT   (Origin Certificate)"
  warn "    nano $KEY    (Private Key)"
  warn "  rồi chạy lại: SKIP_BUILD=1 bash $0"
fi

step "Kiểm tra"
if [ "$NGINX_ON" = 1 ]; then
  for d in "${DOMAINS[@]}"; do
    printf '%-26s ' "$d"
    curl -sk --resolve "$d:443:127.0.0.1" "https://$d/" | grep -o '<link rel="canonical"[^>]*>' || echo "(không đọc được trang)"
  done
fi
echo
echo "Việc còn lại (DEPLOY.md): route Cloudflare Tunnel (bước 5), lead worker + SQL Supabase (bước 6), deploy hook nút Đăng (bước 7)."
