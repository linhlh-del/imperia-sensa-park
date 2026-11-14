import Image from "../ui/Image";
import Button from "../ui/Button";
import { t } from "../../cms/content";

/* Bố cục theo hero của norton-park: ảnh tràn toàn màn hình + lớp phủ tối, chữ căn trái giữa màn hình,
   dải thông tin ở đáy. Nội dung / ảnh / nút giữ nguyên như trước.
   variant (CMS): "left" (mặc định, chữ giữa màn hình) | "center" (chữ sát đáy ảnh) */
export default function Hero({ data, variant = "left" }) {
  return <section id="hero" data-section="hero" className={`park-hero ${variant === "center" ? "is-bottom" : ""}`}>
    <div className="park-hero-media"><Image src="/assets/overview.webp" srcSet="/assets/responsive/hero-overview-800.webp 800w, /assets/responsive/hero-overview-1600.webp 1600w, /assets/responsive/hero-overview-2400.webp 2400w, /assets/overview.webp 6000w" sizes="100vw" width="6000" height="3375" alt="Phối cảnh hai tòa tháp Imperia Sensa Park" fetchPriority="high" /></div>
    <div className="container-page park-hero-copy">
      <div className="park-hero-copy-inner">
        <p className="park-eyebrow">{data.kicker}</p>
        <h1 style={{ "--i": 1 }}>{data.title}{" "}<br/><span className="whitespace-nowrap">{data.titleAccent}</span><span className="sr-only"> {t("hero.h1Seo")}</span></h1>
        <p style={{ "--i": 2 }}>{data.description}</p>
        <div className="park-actions" style={{ "--i": 3 }}><Button href="#tong-quan" variant="light">Khám phá dự án</Button><Button href="#chinh-sach-ban-hang" variant="outlineLight">Chính sách bán hàng</Button></div>
      </div>
    </div>
    <div className="container-page park-hero-bottom"><span>IMPERIA SENSA PARK · PHƯỚC LONG, TP.HCM</span><a href="#tong-quan">Cuộn để khám phá ↓</a></div>
  </section>;
}
