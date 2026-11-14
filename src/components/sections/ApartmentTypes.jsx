import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UNITS_A, UNITS_B } from "../../data/sensaAFloorData";
import { LAYOUT_IMAGES, PENDING_LAYOUT_UNITS, UNIT_FLOOR_LAYOUT_IMAGES, UNIT_LAYOUT_IMAGES } from "../../data/apartmentLayouts";
import gallery from "../../data/gallery.json";

/* ============================================================
   Loại căn hộ + thông tin từng căn tầng điển hình (Sensa A, Sensa B).
   Diện tích, số căn/tầng tính từ dữ liệu mặt bằng (sensaAFloorData.js) — không gõ tay.
   Đặc điểm từng loại tổng hợp từ tài liệu giới thiệu dự án đã công bố; số liệu chính thức theo bảng hàng.
   ============================================================ */

const ALL_UNITS = [...UNITS_A.map((u) => ({ ...u, tower: "A" })), ...UNITS_B.map((u) => ({ ...u, tower: "B" }))];
const fmt = (n) => n.toLocaleString("vi-VN", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const range = (xs) => { const a = Math.min(...xs), b = Math.max(...xs); return a === b ? `${fmt(a)} m²` : `${fmt(a)} – ${fmt(b)} m²`; };
const photos = (prefixes) => gallery["can-ho"].items.filter((x) => prefixes.some((p) => x.label.startsWith(p)));

const TYPE_INFO = [
  {
    key: "STUDIO", name: "Studio", rooms: "1 không gian mở · 1 WC",
    summary: "Căn hộ nhỏ gọn, khu ngủ – tiếp khách – bếp liền một khối, tối ưu cho người độc thân hoặc nhu cầu cho thuê.",
    highlights: ["Không gian mở, dễ bố trí nội thất linh hoạt", "Bếp và khu ăn nhỏ gọn gần cửa sổ", "Phù hợp người trẻ, chuyên gia Khu Công nghệ cao, khách thuê ngắn hạn"],
    fit: "1 – 2 người",
    photos: photos(["Phòng khách phong cách ấm", "Bếp và bàn ăn", "Phòng tắm"]),
  },
  {
    key: "1PN+", name: "1PN+", rooms: "1 phòng ngủ + 1 phòng linh hoạt · 1 WC",
    summary: "Một phòng ngủ chính cùng góc “+” linh hoạt — làm phòng làm việc, phòng em bé hoặc phòng khách nhỏ.",
    highlights: ["Mặt tiền rộng khoảng 7,75 m, nhiều cửa đón sáng", "Lô gia giặt phơi tách riêng khỏi ban công", "Phòng “+” đổi công năng theo từng giai đoạn gia đình"],
    fit: "Vợ chồng trẻ, người làm việc tại nhà",
    photos: photos(["1PN —"]),
  },
  {
    key: "2PN", name: "2PN", rooms: "2 phòng ngủ · 2 WC",
    summary: "Dòng căn chủ đạo của dự án (16/20 căn mỗi tầng Sensa A), cân bằng giữa diện tích và ngân sách.",
    highlights: ["Hai phòng ngủ tách hai phía phòng khách, riêng tư cho từng thành viên", "Mặt tiền tới khoảng 10,5 m ở các căn lớn", "Biến thể từ 70 m² đến gần 95 m² — có căn góc nhiều mặt thoáng"],
    fit: "Gia đình 3 – 4 người",
    photos: photos(["2PN —"]),
  },
  {
    key: "3PN", name: "3PN", rooms: "3 phòng ngủ · 2 WC",
    summary: "Căn hộ cho gia đình đông thành viên, nhiều căn ở vị trí góc với ban công rộng nhìn hai hướng.",
    highlights: ["Khu phòng ngủ vuông vức, dễ kê nội thất", "Căn góc có ban công panorama nhìn sông và nội khu", "Đủ chỗ cho phòng trẻ em, phòng làm việc hoặc phòng ông bà"],
    fit: "Gia đình 4 – 6 người, nhiều thế hệ",
    photos: photos(["3PN —", "Căn góc —"]),
  },
  {
    key: "DUPLEX", name: "Duplex", rooms: "2 tầng thông nhau · tới 4 phòng ngủ",
    summary: "Căn hộ hai tầng với phòng khách thông tầng trần cao, bố trí ở các tầng cao của hai tháp.",
    highlights: ["Phòng khách thông tầng, trần cao khoảng 6,6 m", "Tách khu sinh hoạt chung (tầng dưới) và khu nghỉ riêng tư (tầng trên)", "Số lượng ít, vị trí tầng cao — dòng sản phẩm hiếm của dự án"],
    fit: "Gia đình lớn, khách hàng cần không gian riêng biệt",
    photos: photos(["Duplex —"]),
  },
].map((t) => {
  const units = ALL_UNITS.filter((u) => u.type === t.key);
  return {
    ...t,
    units,
    gfa: range(units.map((u) => u.gfa_sqm)),
    nfa: range(units.map((u) => u.nfa_sqm)),
    perFloor: { A: units.filter((u) => u.tower === "A").length, B: units.filter((u) => u.tower === "B").length },
    image: LAYOUT_IMAGES[t.key],
  };
});

const typeName = (key) => TYPE_INFO.find((t) => t.key === key)?.name || key;
const unitImages = (u) => {
  const floors = UNIT_FLOOR_LAYOUT_IMAGES[u.unit_code];
  if (floors) return Object.entries(floors).map(([lv, src]) => ({ src, label: `${u.unit_code} · tầng ${lv} của căn` }));
  return [{ src: UNIT_LAYOUT_IMAGES[u.unit_code] || LAYOUT_IMAGES[u.type], label: u.unit_code }];
};

/** Hộp thoại xem layout lớn (dialog gốc: Esc / bấm nền để đóng) */
function LayoutDialog({ data, onClose, onLead }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (data && !d.open) d.showModal();
    if (!data && d.open) d.close();
  }, [data]);
  return (
    <dialog ref={ref} className="apt-dialog" aria-label={data ? `Layout ${data.title}` : "Layout căn hộ"} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      {data && (
        <div className="apt-dialog-body">
          <div className="apt-dialog-media">
            {data.images.map((im) => (
              <figure key={im.src}>
                <img src={im.src} alt={`Layout ${im.label}`} width="1200" height="900" loading="lazy" decoding="async" />
                {data.images.length > 1 && <figcaption>{im.label}</figcaption>}
              </figure>
            ))}
          </div>
          <div className="apt-dialog-info">
            <p className="park-eyebrow">{data.eyebrow}</p>
            <h3>{data.title}</h3>
            <dl className="apt-specs">{data.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            {data.note && <p className="apt-note">{data.note}</p>}
            <button type="button" className="btn-base btn-primary" onClick={() => { onClose(); onLead?.(); }}>Nhận báo giá {data.title.replace(/^Căn/, "căn")}</button>
          </div>
        </div>
      )}
      <button type="button" className="apt-dialog-close" onClick={onClose} aria-label="Đóng">×</button>
    </dialog>
  );
}

const unitDialog = (u) => ({
  eyebrow: `Tháp Sensa ${u.tower} · Tầng điển hình`,
  title: `Căn ${u.unit_code}`,
  images: unitImages(u),
  specs: [
    ["Loại căn", typeName(u.type)],
    ["Phòng ngủ", u.bedrooms == null ? "Duplex 2 tầng" : u.bedrooms === 0 ? "Studio" : `${u.bedrooms} PN`],
    ["Diện tích tim tường (GFA)", `${fmt(u.gfa_sqm)} m²`],
    ["Diện tích thông thủy (NFA)", `${fmt(u.nfa_sqm)} m²`],
  ],
  note: PENDING_LAYOUT_UNITS.has(u.unit_code)
    ? "Bản vẽ riêng của căn này đang cập nhật — hình trên là layout tham khảo của căn cùng loại, diện tích gần nhất."
    : "Layout minh họa bố trí nội thất. Kích thước, hướng và tiêu chuẩn bàn giao theo bảng hàng và hợp đồng.",
});

/** Thẻ loại căn: tab chọn loại → layout + thông số + ảnh nội thất. compact: dùng ở trang chủ (ít ảnh hơn). */
export default function ApartmentTypes({ onLead, compact = false, showUnits = !compact }) {
  const [active, setActive] = useState(TYPE_INFO[2].key);
  const [dialog, setDialog] = useState(null);
  const info = TYPE_INFO.find((t) => t.key === active);
  return (
    <div className={`apt ${compact ? "is-compact" : ""}`}>
      <div className="apt-tabs" role="tablist" aria-label="Chọn loại căn hộ">
        {TYPE_INFO.map((t) => (
          <button key={t.key} id={`apt-tab-${t.key}`} type="button" role="tab" aria-selected={t.key === active} aria-controls="apt-panel" onClick={() => setActive(t.key)}>
            <span className="apt-tab-name">{t.name}</span>
            <span className="apt-tab-area">{t.gfa}</span>
          </button>
        ))}
      </div>

      <div id="apt-panel" className="apt-panel" role="tabpanel" aria-labelledby={`apt-tab-${active}`}>
        <button type="button" className="apt-layout" onClick={() => setDialog({ eyebrow: "Layout tiêu biểu", title: `Căn ${info.name}`, images: [{ src: info.image, label: info.name }], specs: [["Diện tích tim tường", info.gfa], ["Diện tích thông thủy", info.nfa], ["Công năng", info.rooms]], note: "Layout tiêu biểu của loại căn; mỗi mã căn có biến thể riêng — xem bảng từng căn." })} aria-label={`Xem layout lớn căn ${info.name}`}>
          <img key={info.image} src={info.image} alt={`Layout căn hộ ${info.name} Imperia Sensa Park`} width="1200" height="900" loading="lazy" decoding="async" />
          <span className="apt-zoom">Phóng to layout ↗</span>
        </button>
        <div className="apt-info">
          <p className="park-eyebrow">Căn hộ The Sensa</p>
          <h3>Căn hộ {info.name}</h3>
          <p className="apt-summary">{info.summary}</p>
          <dl className="apt-specs">
            <div><dt>Diện tích tim tường</dt><dd>{info.gfa}</dd></div>
            <div><dt>Diện tích thông thủy</dt><dd>{info.nfa}</dd></div>
            <div><dt>Công năng</dt><dd>{info.rooms}</dd></div>
            <div><dt>Số căn / tầng điển hình</dt><dd>Sensa A: {info.perFloor.A || "—"} · Sensa B: {info.perFloor.B || "—"}</dd></div>
            <div><dt>Phù hợp</dt><dd>{info.fit}</dd></div>
          </dl>
          <ul className="apt-highlights">{info.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
          <div className="q-actions">
            <button type="button" className="btn-base btn-primary" onClick={() => onLead?.()}>Nhận bảng giá căn {info.name}</button>
            {compact ? <Link to="/mat-bang#can-ho-chi-tiet" className="btn-base btn-outline">Xem từng căn {info.name} →</Link> : <a href="#can-ho-chi-tiet" className="btn-base btn-outline">Xem từng căn {info.name} ↓</a>}
          </div>
        </div>
        {info.photos.length > 0 && (
          <ul className="apt-photos" aria-label={`Ảnh nội thất căn hộ mẫu ${info.name}`}>
            {info.photos.slice(0, compact ? 3 : 5).map((p) => (
              <li key={p.src}><img src={p.src} srcSet={p.srcSet} sizes="(min-width: 1024px) 20vw, 45vw" width={p.w} height={p.h} alt={p.label} loading="lazy" decoding="async" /><span>{p.label}</span></li>
            ))}
          </ul>
        )}
      </div>
      <p className="apt-disclaimer">Thông số theo dữ liệu mặt bằng tầng điển hình và tài liệu giới thiệu dự án; ảnh nội thất là căn hộ mẫu minh họa. Diện tích, hướng và tiêu chuẩn bàn giao chính thức theo bảng hàng và hợp đồng mua bán.</p>

      {showUnits && <UnitTable focusType={active} onOpen={(u) => setDialog(unitDialog(u))} />}
      <LayoutDialog data={dialog} onClose={() => setDialog(null)} onLead={onLead} />
    </div>
  );
}

/** Bảng 40 căn tầng điển hình: lọc tháp / loại, bấm để xem layout từng căn. */
function UnitTable({ focusType, onOpen }) {
  const [tower, setTower] = useState("ALL");
  const [type, setType] = useState("ALL");
  useEffect(() => { setType(focusType); }, [focusType]);
  const rows = useMemo(() => ALL_UNITS.filter((u) => (tower === "ALL" || u.tower === tower) && (type === "ALL" || u.type === type)), [tower, type]);
  return (
    <section id="can-ho-chi-tiet" className="apt-units scroll-mt-28" aria-labelledby="apt-units-title">
      <div className="apt-units-head">
        <div>
          <h3 id="apt-units-title">Thông tin từng căn hộ tầng điển hình</h3>
          <p>{ALL_UNITS.length} mã căn của hai tháp Sensa A và Sensa B. Bấm vào một căn để xem layout và diện tích.</p>
        </div>
        <div className="apt-filters">
          <label>Tháp
            <select value={tower} onChange={(e) => setTower(e.target.value)}>
              <option value="ALL">Cả hai tháp</option><option value="A">Sensa A</option><option value="B">Sensa B</option>
            </select>
          </label>
          <label>Loại căn
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="ALL">Tất cả loại</option>{TYPE_INFO.map((t) => <option key={t.key} value={t.key}>{t.name}</option>)}
            </select>
          </label>
        </div>
      </div>
      <p className="apt-count" aria-live="polite">{rows.length} căn phù hợp</p>
      <ul className="apt-unit-list">
        {rows.map((u) => (
          <li key={u.tower + u.unit_code}>
            <button type="button" onClick={() => onOpen(u)} aria-label={`Xem layout căn ${u.unit_code}, ${typeName(u.type)}, ${fmt(u.gfa_sqm)} m²`}>
              <img src={unitImages(u)[0].src} alt="" width="400" height="300" loading="lazy" decoding="async" />
              <span className="apt-unit-code">{u.unit_code}</span>
              <span className="apt-unit-type">{typeName(u.type)} · Sensa {u.tower}</span>
              <span className="apt-unit-area">GFA {fmt(u.gfa_sqm)} m² · NFA {fmt(u.nfa_sqm)} m²</span>
              <span className="apt-unit-more">Xem layout →</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
