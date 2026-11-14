import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../ui/Image";
import { img, site, t } from "../../cms/content";
import gallery from "../../data/gallery.json";

/* ============================================================
   Các section trang chủ theo cách sắp xếp của qtopia-landing:
   - Tiêu đề = nhãn nhỏ chứa từ khoá (<h2>) + một câu dẫn ngắn, không còn tiêu đề lớn nhiều chữ.
   - Ảnh làm chủ: Tổng quan là ảnh tràn khung + khối chữ một bên; Concept 4 ảnh; Gallery carousel theo tỉ lệ ảnh.
   Nội dung chữ giữ nguyên như trước; màu / font của Sensa.
   ============================================================ */

/** Nhãn section (h2 chứa từ khoá) + câu dẫn. light: trên nền tối. */
export function QHeading({ label, title, lead, light = false, align = "left", className = "", children }) {
  return (
    <div className={`q-heading ${light ? "is-light" : ""} ${align === "center" ? "is-center" : ""} ${className}`}>
      <h2 className="q-label">{label}</h2>
      {title && <p className="q-title">{title}</p>}
      {lead && <p className="q-lead">{lead}</p>}
      {children}
    </div>
  );
}

/** Xem ảnh lớn (dialog gốc của trình duyệt: Esc / bấm nền để đóng, giữ focus đúng chuẩn) */
function Lightbox({ items, index, onClose, onMove }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index != null && !d.open) d.showModal();
    if (index == null && d.open) d.close();
  }, [index]);
  useEffect(() => {
    if (index == null) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, onMove]);
  const item = index != null ? items[index] : null;
  return (
    <dialog ref={ref} className="q-lightbox" aria-label="Xem ảnh lớn" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      {item && (
        <figure>
          <img src={item.src} srcSet={item.srcSet} sizes="92vw" width={item.w} height={item.h} alt={item.label} />
          <figcaption>{item.label}{items.length > 1 && <span> · {index + 1}/{items.length}</span>}</figcaption>
        </figure>
      )}
      {items.length > 1 && <>
        <button type="button" className="q-lightbox-nav is-prev" onClick={() => onMove(-1)} aria-label="Ảnh trước">←</button>
        <button type="button" className="q-lightbox-nav is-next" onClick={() => onMove(1)} aria-label="Ảnh tiếp theo">→</button>
      </>}
      <button type="button" className="q-lightbox-close" onClick={onClose} aria-label="Đóng">×</button>
    </dialog>
  );
}

function useLightbox(items) {
  const [index, setIndex] = useState(null);
  const move = (dir) => setIndex((i) => (i == null ? i : (i + dir + items.length) % items.length));
  return { index, open: setIndex, close: () => setIndex(null), move };
}

/* ---------- Tổng quan: ảnh tràn khung, khối chữ bên trái (như Story của qtopia) ---------- */
const OVERVIEW_BG = {
  src: "/assets/gallery/ngoai-canh/phoi-canh-ven-song-1600.webp",
  srcSet: "/assets/gallery/ngoai-canh/phoi-canh-ven-song-800.webp 800w, /assets/gallery/ngoai-canh/phoi-canh-ven-song-1600.webp 1600w",
};
export function ParkOverview({ data = site.overview }) {
  const custom = img("overview.image", "/assets/overview.optimized.webp");
  const bg = custom !== "/assets/overview.optimized.webp" ? { src: custom } : OVERVIEW_BG;
  return (
    <section id="tong-quan" className="q-story">
      <div className="q-story-media"><Image src={bg.src} srcSet={bg.srcSet} sizes="100vw" alt={t("overview.imageAlt")} /></div>
      <div className="container-page q-story-inner">
        <div className="q-panel">
          <QHeading light label={t("overview.seo")} title={data.title} lead={data.subtitle} />
          <ul className="q-points">{data.bullets.map((x) => <li key={x}>{x}</li>)}</ul>
          <dl className="q-stats">{data.facts.map(([n, l]) => <div key={l}><dt>{l}</dt><dd>{n}</dd></div>)}</dl>
          <div className="q-actions"><Link className="btn-base btn-light" to="/tong-quan">Khám phá tổng quan →</Link></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Tiện ích: carousel coverflow — ảnh giữa lớn kèm chú thích, các ảnh hai bên xếp lớp lùi dần ---------- */
const CONCEPT = [
  { src: "/assets/concept/imgi_3_1-BzrOqiW4.webp", w: 3000, h: 1869, label: "Tiên phong bộ sản phẩm Discovery Residences", desc: "Không gian sống được thiết kế quanh tinh thần khám phá: mảng xanh, mặt nước và tiện ích nối liền từ sảnh đến khu nghỉ dưỡng." },
  { src: "/assets/concept/imgi_3_2-BtIqkXkG.webp", w: 6033, h: 3757, label: "Nhịp riêng tỏa sáng", desc: "Mỗi cư dân chọn nhịp sống của mình — tập luyện buổi sáng, làm việc linh hoạt, thư giãn cuối ngày bên hồ bơi." },
  { src: "/assets/concept/imgi_3_3-DqCOerpg.webp", w: 6033, h: 3754, label: "Khởi mở tinh thần khám phá", desc: "Đường dạo ven sông Rạch Chiếc, vườn cảnh quan và sân chơi giúp mỗi ngày ở nhà vẫn có điều mới để trải nghiệm." },
  { src: "/assets/concept/imgi_3_4-CYClnPd5.webp", w: 3017, h: 1864, label: "Nền tảng cho một chuẩn sống mới", desc: "Hơn 40 tiện ích nội khu trên quy mô khoảng 5 ha, chia theo ba nhịp sống: sáng tạo, cân bằng và kết nối." },
].map((c) => {
  const base = c.src.replace("/assets/concept/", "/assets/concept/responsive/").replace(".webp", "");
  // ảnh concept đã in sẵn tiêu đề trong ảnh → không phủ chú thích lên (tránh chữ chồng chữ)
  return { ...c, baked: true, srcSet: `${base}-900.webp 900w, ${base}-1800.webp 1800w` };
});
const AMENITY_DESC = {
  "Hồ bơi nội khu": "Hồ bơi Aura Flow nằm giữa hai tòa tháp, có khu ghế nghỉ, bể nông thư giãn và sàn tắm nắng.",
  "Bể sục Jacuzzi": "Bể sục cạnh hồ bơi chính — góc thư giãn sau giờ làm hoặc sau buổi tập.",
  "Hồ bơi trẻ em": "Hồ bơi riêng cho trẻ nhỏ, tách khỏi hồ chính để bố mẹ dễ quan sát.",
  "Sân chơi trẻ em": "Sân chơi Joy Yard ngoài trời với các trò chơi vận động an toàn cho trẻ.",
  "Sảnh đón The Sensa": "Sảnh đón riêng cho từng tòa, có khu chờ và hòm thư cư dân.",
  "Business Lounge": "Business Lounge & Coworking Space cùng phòng họp cho người làm việc linh hoạt.",
  "Gym & Yoga": "Phòng Gym & Yoga trong nhà, mở cho cư dân theo khung giờ của ban quản lý.",
  "Phòng muối Himalaya": "Phòng xông hơi đá muối Himalaya — tiện ích chăm sóc sức khỏe hiếm có ở căn hộ.",
  "Kids Room": "Phòng trẻ em Wonder Club kết hợp góc đọc sách cho những ngày mưa.",
};
const SHOWCASE = [
  ...CONCEPT,
  ...gallery["tien-ich"].items.filter((x) => AMENITY_DESC[x.label]).map((x) => ({ ...x, desc: AMENITY_DESC[x.label] })),
];
export function ParkAmenities() {
  const lb = useLightbox(SHOWCASE);
  const [current, setCurrent] = useState(0);
  const total = SHOWCASE.length;
  const move = (step) => setCurrent((index) => (index + step + total) % total);
  const swipe = useRef(null);
  // khoảng cách ngắn nhất (theo vòng) từ ảnh i tới ảnh đang chọn: -2..2 hiện ra, còn lại ẩn
  const offsetOf = (i) => { let d = i - current; if (d > total / 2) d -= total; if (d < -total / 2) d += total; return d; };
  const slide = SHOWCASE[current];
  return (
    <section id="tien-ich" className="park-section q-concept">
      <div className="container-page">
        <div className="q-head-row">
          <QHeading label="Sống trọn những điều yêu thích" lead="Từ cảnh quan xanh đến tiện ích nghỉ dưỡng, vận động và kết nối — khám phá những không gian dành cho mỗi ngày tại Sensa." />
          <div className="q-actions"><Link to="/tien-ich" className="btn-base btn-primary">Khám phá toàn bộ tiện ích →</Link></div>
        </div>
      </div>
      <div
        className="q-flow"
        role="region"
        aria-roledescription="carousel"
        aria-label="Không gian sống và tiện ích Imperia Sensa Park"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowRight") move(1); if (e.key === "ArrowLeft") move(-1); }}
        onPointerDown={(e) => { swipe.current = e.clientX; }}
        onPointerUp={(e) => { if (swipe.current == null) return; const dx = e.clientX - swipe.current; swipe.current = null; if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1); }}
      >
        <div className="q-flow-stage">
          {SHOWCASE.map((s, i) => {
            const d = offsetOf(i);
            const hidden = Math.abs(d) > 2;
            return (
              <button
                key={s.src}
                type="button"
                className={`q-flow-card ${d === 0 ? "is-active" : ""}`}
                style={{ "--d": d, "--ad": Math.abs(d), zIndex: 10 - Math.abs(d) }}
                aria-hidden={hidden || undefined}
                tabIndex={d === 0 ? 0 : -1}
                aria-label={d === 0 ? `Xem ảnh lớn: ${s.label}` : `Chuyển tới: ${s.label}`}
                onClick={() => (d === 0 ? lb.open(i) : setCurrent(i))}
              >
                {!hidden && <img src={s.src} srcSet={s.srcSet} sizes="(min-width: 1024px) 60vw, 84vw" width={s.w} height={s.h} alt={d === 0 ? s.label : ""} loading={Math.abs(d) <= 1 ? "eager" : "lazy"} decoding="async" draggable="false" />}
                {d === 0 && !s.baked && (
                  <span className="q-flow-caption">
                    <span className="q-flow-title">{s.label}</span>
                    <span className="q-flow-desc">{s.desc}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="container-page q-flow-controls">
          <p className="q-concept-count" aria-live="polite"><span>{String(current + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")} <span className="q-concept-label">{slide.baked ? slide.desc : slide.label}</span></p>
          <div className="q-flow-dots" role="group" aria-label="Chọn ảnh">
            {SHOWCASE.map((s, i) => <button key={s.src} type="button" aria-label={`Ảnh ${i + 1}: ${s.label}`} aria-current={i === current || undefined} onClick={() => setCurrent(i)} />)}
          </div>
          <div className="q-concept-navigation">
            <button type="button" onClick={() => move(-1)} aria-label="Ảnh trước">←</button>
            <button type="button" onClick={() => move(1)} aria-label="Ảnh tiếp theo">→</button>
          </div>
        </div>
      </div>
      <Lightbox items={SHOWCASE} index={lb.index} onClose={lb.close} onMove={lb.move} />
    </section>
  );
}

/* ---------- Gallery: 3 nhóm ảnh, mỗi thẻ carousel rộng theo đúng tỉ lệ ảnh (cùng chiều cao) ---------- */
const GROUP_KEYS = Object.keys(gallery);
export function ParkGallery() {
  const [key, setKey] = useState(GROUP_KEYS[0]);
  const items = gallery[key].items;
  const track = useRef(null);
  const lb = useLightbox(items);
  const [edge, setEdge] = useState({ start: true, end: false });
  const update = () => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4 });
  };
  useEffect(() => {
    track.current?.scrollTo({ left: 0 });
    update();
  }, [key]);
  const move = (dir) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return (
    <section id="hinhanh" className="park-section q-gallery" aria-roledescription="carousel" aria-label="Gallery Imperia Sensa Park">
      <div className="container-page">
        <div className="q-head-row">
          <QHeading label="Gallery Imperia Sensa Park" lead="Phối cảnh ngoại cảnh, tiện ích nội khu và căn hộ mẫu — bấm vào ảnh để xem lớn." />
          <div className="q-carousel-nav">
            <button type="button" onClick={() => move(-1)} disabled={edge.start} aria-label="Ảnh trước">←</button>
            <button type="button" onClick={() => move(1)} disabled={edge.end} aria-label="Ảnh tiếp theo">→</button>
          </div>
        </div>
        <div className="q-tabs" role="tablist" aria-label="Nhóm ảnh">
          {GROUP_KEYS.map((k) => (
            <button key={k} type="button" role="tab" aria-selected={k === key} aria-controls="gallery-track" onClick={() => setKey(k)}>
              {gallery[k].title} <span>{gallery[k].items.length}</span>
            </button>
          ))}
        </div>
        <div id="gallery-track" ref={track} className="q-track" role="tabpanel" tabIndex={0} onScroll={update} aria-label={`Ảnh ${gallery[key].title}`}>
          {items.map((it, i) => (
            <button key={it.src} type="button" className="q-slide" style={{ aspectRatio: `${it.w} / ${it.h}` }} onClick={() => lb.open(i)}
              aria-roledescription="slide" aria-label={`${it.label} (${i + 1}/${items.length}) — xem ảnh lớn`}>
              <img src={it.src} srcSet={it.srcSet} sizes="(min-width: 1024px) 50vw, 90vw" width={it.w} height={it.h} alt={it.label} loading="lazy" decoding="async" />
              <span className="q-slide-label">{it.label}</span>
            </button>
          ))}
        </div>
        <p className="q-note">Hình ảnh phối cảnh mang tính minh hoạ, có thể thay đổi theo thiết kế thực tế.</p>
      </div>
      <Lightbox items={items} index={lb.index} onClose={lb.close} onMove={lb.move} />
    </section>
  );
}

/* ---------- Mặt bằng: 2 tháp ---------- */
export function ParkResidences() {
  return (
    <section id="mat-bang" className="park-section q-residences">
      <div className="container-page">
        <div className="q-head-row">
          <QHeading label="Mặt bằng căn hộ Imperia Sensa Park" lead="Khám phá mặt bằng hai tháp Sensa A và Sensa B. Chọn loại căn và đối chiếu bản vẽ chi tiết theo nhu cầu sử dụng." />
          <div className="q-actions"><Link to="/mat-bang" className="btn-base btn-primary">Khám phá mặt bằng tương tác →</Link></div>
        </div>
        <div className="park-residences">
          {[["A", "sensa-a.optimized.webp"], ["B", "sensaB.optimized.webp"]].map(([tower, file]) => (
            <article key={tower}>
              <div className="park-residence-title"><p className="park-eyebrow">The Sensa</p><h3>Tháp Sensa {tower}</h3></div>
              <Link to="/mat-bang" aria-label={`Xem mặt bằng tháp Sensa ${tower}`}><Image src={"/assets/layout/" + file} alt={`Mặt bằng tầng điển hình tháp Sensa ${tower}`} /></Link>
              <Link to="/mat-bang" className="park-text-link">Chọn căn & xem thông số <span>↗</span></Link>
            </article>
          ))}
        </div>
        <div className="q-actions q-residences-cta"><Link to="/mat-bang#loai-can-ho" className="btn-base btn-primary">Xem chi tiết các loại căn hộ →</Link></div>
      </div>
    </section>
  );
}

/* ---------- Tính khoản vay (teaser) ---------- */
export function ParkCalculator() {
  return (
    <section id="tinh-tra-gop" className="park-section park-calc">
      <div className="container-page park-calc-grid">
        <QHeading label="Dự trù tài chính" title="Chủ động kế hoạch. Sẵn sàng tổ ấm." />
        <div>
          <p className="q-lead">Ước tính khoản vay theo vốn tự có, kỳ hạn và lãi suất bạn lựa chọn. So sánh phương án trước khi nhận tư vấn cho căn hộ cụ thể.</p>
          <div className="q-actions"><Link className="btn-base btn-primary" to="/bang-gia">Mở công cụ tính khoản vay →</Link><a href="#lien-he" className="btn-base btn-outline">Nhận tư vấn</a></div>
          <p className="park-small">Kết quả tính mang tính tham khảo, không phải báo giá hay chấp thuận tín dụng.</p>
        </div>
      </div>
    </section>
  );
}
