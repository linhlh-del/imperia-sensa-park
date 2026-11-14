import { useEffect, useId, useRef, useState } from "react";
import LocationMapSvg from "./LocationMapSvg";
import groups from "./locationMapData";
import "./LocationMap.css";

const places = groups.flatMap((group) => group.items);
const allIds = places.map((place) => place.id);
const initialView = () => ({ x: 0, y: 0, zoom: 1 });

export default function LocationMap({ title = "Bản đồ vị trí Imperia Sensa Park" }) {
  const filterId = useId();
  const viewport = useRef(null);
  const [selected, setSelected] = useState(allIds);
  const [active, setActive] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [expanded, setExpanded] = useState(groups[0].id);
  const [view, setView] = useState(initialView);

  useEffect(() => {
    viewport.current?.querySelectorAll("[data-id]").forEach((node) => {
      const id = node.dataset.id;
      node.style.display = selected.includes(id) ? "" : "none";
      node.classList.toggle("map-poi-active", id === active);
    });
  }, [selected, active]);

  useEffect(() => {
    const element = viewport.current;
    const svg = element?.querySelector("svg");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      const paused = !visible || document.hidden || reduced.matches;
      element?.classList.toggle("map-motion-paused", paused);
      if (paused) svg?.pauseAnimations?.(); else svg?.unpauseAnimations?.();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (element) observer.observe(element);
    reduced.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => { observer.disconnect(); reduced.removeEventListener("change", update); document.removeEventListener("visibilitychange", update); };
  }, []);

  function focus(place) {
    setActive(place.id);
    setSelected((ids) => ids.includes(place.id) ? ids : [...ids, place.id]);
    const { width, height } = viewport.current.getBoundingClientRect();
    const scale = Math.min(width / 1500, height / 903.75);
    setView({ zoom: 2, x: (750 - (place.x - 112.25)) * scale * 2, y: (903.75 / 2 - (place.y - 74.25)) * scale * 2 });
    setFilterOpen(false);
  }

  return (
    <div className="location-explorer">
      <div className="location-map-viewport" ref={viewport} aria-label={title}>
        <div className="location-map-canvas" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})` }}>
          <LocationMapSvg title={title} />
        </div>
      </div>
      <button className="location-filter-toggle" type="button" aria-expanded={filterOpen} aria-controls={filterId} onClick={() => setFilterOpen(!filterOpen)}>☷ Chú thích bản đồ</button>
      <aside id={filterId} className={`location-filter ${filterOpen ? "is-open" : ""}`} aria-label="Bộ lọc vị trí">
        <div className="location-filter-heading">❖ Bộ Lọc Vị Trí ❖<button type="button" className="location-filter-close" aria-label="Đóng danh sách" onClick={() => setFilterOpen(false)}>×</button></div>
        <div className="location-filter-count"><span>Đang Chọn: <strong>{selected.length}/30 Vị trí</strong></span><button type="button" aria-pressed={selected.length === 30} onClick={() => { setSelected(allIds); setActive(null); setView(initialView()); }}>Tất Cả</button></div>
        <div className="location-filter-list">
          {groups.map((group) => <div className="location-filter-group" key={group.id}>
            <div className="location-group-heading"><button type="button" className="location-group-preview" title={`Chỉ hiện ${group.label}`} aria-label={`Chỉ hiện ${group.label}`} onClick={() => { setSelected(group.items.map((item) => item.id)); setActive(null); setExpanded(group.id); }}>◇</button><button type="button" aria-expanded={expanded === group.id} onClick={() => setExpanded(expanded === group.id ? null : group.id)}>{group.label}<span>{expanded === group.id ? "−" : "+"}</span></button></div>
            {expanded === group.id && <ul>{group.items.map((place) => <li key={place.id}>
              <input type="checkbox" aria-label={`Hiện ${place.label}`} checked={selected.includes(place.id)} onChange={() => setSelected((ids) => ids.includes(place.id) ? ids.filter((id) => id !== place.id) : [...ids, place.id])} />
              <button type="button" className={active === place.id ? "is-active" : ""} onClick={() => focus(place)}>{place.label}</button>
            </li>)}</ul>}
          </div>)}
        </div>
      </aside>
      <div className="location-map-caption" role="status">{places.find((place) => place.id === active)?.label || "Mở chú thích để xem các vị trí"}</div>
    </div>
  );
}
