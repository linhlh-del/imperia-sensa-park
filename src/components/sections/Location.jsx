import TopicLink from "../ui/TopicLink";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { t } from "../../cms/content";
import { QHeading } from "./ParkTemplate";

const LocationMap = lazy(() => import("./LocationMap"));

/* Bố cục gọn theo qtopia-landing: cột chữ (nhãn + câu dẫn + danh sách phút di chuyển + ghi chú + 2 nút) ·
   cột bản đồ tương tác. variant (CMS): "map-right" (mặc định) | "map-left" */
export default function Location({ data, variant = "map-right" }) {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  useEffect(() => {
    if (window.__PRERENDER__) return;
    if (!("IntersectionObserver" in window)) { setMapReady(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setMapReady(true); observer.disconnect(); }
    }, { rootMargin: "250px" });
    if (mapRef.current) observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);
  return <section id="vi-tri" data-section="location" className={`park-section q-location ${variant === "map-left" ? "is-map-left" : ""}`}>
    <div className="container-page q-location-grid">
      <div className="q-location-copy">
        <QHeading light label="Vị trí Imperia Sensa Park" title={data.title} lead={data.subtitle}>
          <span className="sr-only">{t("location.seo")}</span>
        </QHeading>
        <ul className="q-distances">{data.distances.map(([time, label]) => (
          <li key={label}><strong>{String(time).replace(/['’]/g, "")}<small>phút</small></strong><span>{label}</span></li>
        ))}</ul>
        <p className="q-note">Thời gian di chuyển tham khảo, tùy giao thông. Sơ đồ không xác nhận trạng thái khai thác hạ tầng.</p>
        <div className="q-actions"><a href="#lien-he" className="btn-base btn-light">Nhận tư vấn vị trí</a><TopicLink to="/vi-tri" light>Xem chi tiết</TopicLink></div>
      </div>
      <div ref={mapRef} className="location-map-shell q-location-map">
        {mapReady ? <Suspense fallback={<p className="p-6" role="status">Đang tải bản đồ vị trí…</p>}><LocationMap title={t("location.imageAlt")} /></Suspense> : <div className="flex h-full items-center justify-center p-4"><button type="button" className="btn-base btn-outline-light" onClick={() => setMapReady(true)}>Mở bản đồ liên kết vùng</button></div>}
      </div>
    </div>
  </section>;
}
