"""Create responsive copies of existing brand images; originals remain untouched. Requires Pillow."""
from pathlib import Path
from PIL import Image
root = Path(__file__).resolve().parent.parent
out = root / 'public/assets/responsive'
out.mkdir(exist_ok=True)
for name, widths in [('hero2.optimized.webp', [480,800,1200]), ('overview.optimized.webp',[480,800,1200]), ('logo.webp',[128]), ('location.webp',[3840])]:
    with Image.open(root / 'public/assets' / name) as image:
        for width in widths:
            if width >= image.width: continue
            target=out / f'{name.removesuffix(".webp")}-{width}.webp'
            image.resize((width,round(image.height*width/image.width)),Image.Resampling.LANCZOS).save(target,quality=88,method=6)
            print(target.name, target.stat().st_size)

# Hero requested by the owner: same overview.webp photograph, responsive encodings.
with Image.open(root / 'public/assets/overview.webp') as image:
    for width in [800, 1600, 2400]:
        image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS).save(out / f'hero-overview-{width}.webp', quality=85)

# Ảnh của bố cục park (src/components/sections/ParkTemplate.jsx): bản 800w / 1400w để điện thoại không tải ảnh gốc
# 0,5–0,9 MB. Tên file = slug "thư-mục-tên-ảnh" (khớp hàm parkSrcSet trong ParkTemplate.jsx).
import re, unicodedata
def park_slug(rel):
    s = unicodedata.normalize('NFD', rel.replace('.optimized.webp', '')).replace('đ', 'd').replace('Đ', 'D')
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn').lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')
park_out = out / 'park'
park_out.mkdir(exist_ok=True)
for rel in ['canhquan/1.optimized.webp', 'tienich/Hồ Bơi Aura Flow.optimized.webp', 'tienich/Business Lounge.optimized.webp',
            'tienich/Gym 01.optimized.webp', 'tienich/Creative Studio 01.optimized.webp', 'tienich/Wonder Club 01.optimized.webp',
            'tienich/Đường Dạo Ven Hồ.optimized.webp']:
    with Image.open(root / 'public/assets/amenities' / rel) as image:
        for width in [800, 1400]:
            target = park_out / f'{park_slug(rel)}-{width}.webp'
            image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS).save(target, quality=82, method=6)
            print(target.name, target.stat().st_size)
