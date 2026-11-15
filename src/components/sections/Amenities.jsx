// src/components/sections/Amenities.jsx
// "Tổng hợp tiện ích đa chiều": sơ đồ tổng mặt bằng (utility.webp) + 44 tiện ích / 4 nhóm màu.
//  - Desktop ≥1024: sơ đồ lớn trong khung viền đồng mảnh, danh sách là tấm kính mờ nổi trên phần sông bên phải
//    (vùng không có chấm), như trang tiện ích của chủ đầu tư.
//  - Tablet 768–1023: danh sách là thẻ dưới sơ đồ, 2 cột.
//  - Điện thoại: gọn trong 1 màn hình — sơ đồ, 1 hàng lọc, danh sách 2 cột chia trang (số dòng tính theo chiều cao màn hình).
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../ui/Image";
import { img, t } from "../../cms/content";
import { AMENITIES, AMENITY_GROUPS } from "../../data/amenitiesMap";

const MAP_DEFAULT = "/assets/responsive/utility-1920.webp";
const mapSrc = img("amenities.map", MAP_DEFAULT);
const MAP_SRCSET = mapSrc === MAP_DEFAULT
  ? "/assets/responsive/utility-1280.webp 1280w, /assets/responsive/utility-1920.webp 1920w, /assets/responsive/utility-2880.webp 2880w"
  : undefined;
const pad2 = (n) => String(n).padStart(2, "0");
const COUNT = Object.fromEntries(AMENITY_GROUPS.map((g) => [g.key, AMENITIES.filter((a) => a.group === g.key).length]));

/** Điện thoại: số dòng danh sách vừa phần màn hình còn lại dưới sơ đồ (tối thiểu 2, tối đa 5) */
function useCompactRows() {
  const [state, setState] = useState({ compact: false, rows: 4 });
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const calc = () => {
      const compact = mq.matches;
      const header = document.querySelector("header")?.offsetHeight || 64;
      const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bar-h")) || 0; // thanh liên hệ dưới đáy
      const mapH = Math.min(window.innerWidth - 32, 720) * 9 / 16;
      const short = window.innerHeight <= 740; // màn thấp: ẩn dòng phụ + nút (CSS) → còn nhiều chỗ cho danh sách
      const rest = window.innerHeight - header - bar - mapH - (short ? 240 : 320); // tiêu đề, lọc, phân trang, nút, khoảng đệm
      setState({ compact, rows: Math.max(2, Math.min(5, Math.floor(rest / 46))) });
    };
    calc();
    window.addEventListener("resize", calc);
    mq.addEventListener("change", calc);
    return () => { window.removeEventListener("resize", calc); mq.removeEventListener("change", calc); };
  }, []);
  return state;
}

export default function Amenities({ id = "tien-ich" }) {
  const [activeId, setActiveId] = useState(null);
  const [group, setGroup] = useState("all");
  const [page, setPage] = useState(0);
  const { compact, rows } = useCompactRows();
  const listRef = useRef(null);
  const swipe = useRef(null);

  const items = useMemo(() => (group === "all" ? AMENITIES : AMENITIES.filter((a) => a.group === group)), [group]);
  const perPage = rows * 2;
  const pages = compact ? Math.max(1, Math.ceil(items.length / perPage)) : 1;
  const shown = compact ? items.slice(page * perPage, page * perPage + perPage) : items;
  useEffect(() => { setPage(0); setActiveId(null); }, [group, perPage]);

  // chấm trên sơ đồ được chọn → cuộn tên tương ứng trong danh sách vào tầm nhìn (desktop)
  const pick = (itemId, fromMap = false) => {
    setActiveId(itemId);
    if (fromMap && !compact) listRef.current?.querySelector(`[data-amx="${itemId}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  return (
    <section id={id} data-section="amenities-map" className="amx">
      <div className="container-page">
        <header className="amx-head">
          <p className="amx-eyebrow">Hệ tiện ích nội khu · {AMENITIES.length} tiện ích</p>
          <h2 className="amx-title">{t("amenities.title")}</h2>
          <p className="amx-lead">{t("amenities.subtitle")}</p>
        </header>

        <div className="amx-stage">
          <div className="amx-frame">
            <div className="amx-map">
              <Image src={mapSrc} srcSet={MAP_SRCSET} sizes="(min-width: 1024px) 80vw, 100vw" alt={t("amenities.mapAlt")} width="1920" height="1080" loading="lazy" decoding="async" />
              {items.flatMap((item) =>
                item.position.map((pos, i) => {
                  const on = activeId === item.id;
                  return (
                    <button
                      key={`${item.id}-${i}`}
                      type="button"
                      className={`amx-pin ${on ? "is-active" : ""}`}
                      style={{ left: pos.left, top: pos.top, "--c": item.color }}
                      aria-label={`${pad2(item.no)}. ${item.name.join(" ")}`}
                      aria-hidden={compact || undefined}
                      tabIndex={compact ? -1 : 0}
                      aria-pressed={on}
                      onMouseEnter={() => pick(item.id, true)}
                      onMouseLeave={() => setActiveId(null)}
                      onFocus={() => pick(item.id, true)}
                      onBlur={() => setActiveId(null)}
                      onClick={() => pick(item.id, true)}
                    >
                      <span className="amx-dot">{pad2(item.no)}</span>
                      {on && i === 0 && <span className="amx-tip">{item.name.join(" ")}</span>}
                    </button>
                  );
                }),
              )}
            </div>
          </div>

          <aside className="amx-panel" aria-label="Danh sách tiện ích">
            <p className="amx-panel-title"><span>Danh sách tiện ích</span><span>{items.length}</span></p>
            <div className="amx-filter" role="group" aria-label="Lọc nhóm tiện ích">
              <button type="button" aria-pressed={group === "all"} onClick={() => setGroup("all")}>
                <i className="is-all" aria-hidden="true" />Tất cả
              </button>
              {AMENITY_GROUPS.map((g) => (
                <button key={g.key} type="button" aria-pressed={group === g.key} onClick={() => setGroup(g.key)} title={`${g.label} · ${COUNT[g.key]} tiện ích`}>
                  <i style={{ background: g.color }} aria-hidden="true" />{g.short}
                </button>
              ))}
            </div>

            <ul
              ref={listRef}
              className="amx-list"
              style={compact ? { "--rows": rows } : undefined}
              onTouchStart={(e) => { swipe.current = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                if (swipe.current == null || pages < 2) return;
                const dx = e.changedTouches[0].clientX - swipe.current; swipe.current = null;
                if (Math.abs(dx) > 40) setPage((p) => Math.min(pages - 1, Math.max(0, p + (dx < 0 ? 1 : -1))));
              }}
            >
              {shown.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    data-amx={item.id}
                    className={`amx-item ${activeId === item.id ? "is-active" : ""}`}
                    style={{ "--c": item.color }}
                    aria-pressed={activeId === item.id}
                    onMouseEnter={() => setActiveId(item.id)}
                    onMouseLeave={() => setActiveId(null)}
                    onFocus={() => setActiveId(item.id)}
                    onBlur={() => setActiveId(null)}
                    onClick={() => setActiveId(activeId === item.id ? null : item.id)}
                  >
                    <span className="amx-num">{pad2(item.no)}</span>
                    <span className="amx-name">{item.name.join(" ")}</span>
                  </button>
                </li>
              ))}
            </ul>

            {compact && pages > 1 && (
              <div className="amx-pager">
                <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} aria-label="Trang trước">←</button>
                <span aria-live="polite">{page + 1} / {pages}</span>
                <button type="button" onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={page === pages - 1} aria-label="Trang sau">→</button>
              </div>
            )}
          </aside>
        </div>

        <div className="amx-actions">
          <Link to="/tien-ich" className="btn-base btn-primary">Chi tiết hệ tiện ích →</Link>
          <a href="#hinhanh" className="btn-base btn-outline">Xem ảnh tiện ích</a>
        </div>
      </div>
    </section>
  );
}
