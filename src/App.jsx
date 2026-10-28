import { Fragment, useEffect, useState } from "react";
import { Navigate, Routes, Route, useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LeadPopup from "./components/ui/LeadPopup";
import Hero from "./components/sections/Hero";
import Overview from "./components/sections/Overview";
import Location from "./components/sections/Location";
import Amenities from "./components/sections/Amenities";
import FeaturedAmenities from "./components/sections/FeaturedAmenities";
import FloorPlan from "./components/sections/FloorPlan";
import ExclusiveServicesSection from "./components/sections/ExclusiveSevices";
import News from "./components/sections/News";
import LeadSection from "./components/sections/LeadSection";
import ThankYouPage from "./components/sections/ThankYouPage";
import FloatingButtons from "./components/ui/FloatingButton";
import NewsPage from "./pages/NewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import SubPage from "./pages/SubPage";
import LoanCalculator from "./components/sections/LoanCalculator";
import { SUBPAGES } from "./lib/seo";
import RouteSeo from "./components/seo/RouteSeo";
import ScrollEffects from "./components/effects/ScrollEffects";
import useSectionPaging from "./lib/useSectionPaging";
import { hrefForSection, sectionForPath } from "./lib/sections";
import { sendLead, validateLeadForm } from "./lib/lead";
import { cmsTrack } from "./lib/cmsTracker";
import { cmsLayout, site, t } from "./cms/content";
import { HOME_SECTIONS } from "./cms/schema";

/* id section (khớp HOME_SECTIONS trong src/cms/schema.js) → nội dung.
   News tự lấy dữ liệu (newsService) — không truyền project.news (dữ liệu cũ, sai shape). */
const SECTIONS = {
  hero: ({ variant }) => <Hero data={site.hero} variant={variant} />,
  "tong-quan": ({ variant }) => (
    <Overview data={site.overview} variant={variant} />
  ),
  "vi-tri": ({ variant }) => (
    <Location data={site.location} variant={variant} />
  ),
  "tien-ich": () => <Amenities items={site.amenities} />,
  hinhanh: () => <FeaturedAmenities />,
  "mat-bang": ({ onOpenModal }) => (
    <FloorPlan
      images={{
        A: "/assets/layout/sensa-a.optimized.webp", // tên file viết thường (Vercel phân biệt hoa/thường)
        B: "/assets/layout/sensaB.optimized.webp",
      }}
      onLead={onOpenModal}
    />
  ),
  "tin-tuc": () => <News />,
  "tinh-tra-gop": ({ onOpenModal }) => <LoanCalculator onLead={onOpenModal} />,
  "lien-he": ({ submitLead }) => <LeadSection onSubmit={submitLead} />,
};

/** Thứ tự section: theo CMS (section cố định giữ vị trí mặc định), bỏ section bị ẩn */
function homeOrder() {
  const ids = HOME_SECTIONS.map((s) => s.id);
  const locked = new Set(
    HOME_SECTIONS.filter((s) => s.locked).map((s) => s.id),
  );
  const movable = [
    ...cmsLayout.order.filter((id) => ids.includes(id) && !locked.has(id)),
    ...ids.filter((id) => !locked.has(id) && !cmsLayout.order.includes(id)),
  ];
  return ids
    .map((id) => (locked.has(id) ? id : movable.shift()))
    .filter((id) => locked.has(id) || !cmsLayout.hidden.has(id));
}

function HomePage({ onOpenModal, submitLead }) {
  const location = useLocation();
  /* máy tính: mỗi nấc lăn chuột = 1 section (xem src/lib/useSectionPaging.js) */
  useSectionPaging();

  const { section } = useParams();
  const sectionId = section ? sectionForPath(`/${section}`) : undefined;
  const navigate = useNavigate();

  // URL theo section, không dấu "#": /tong-quan, /tinh-tra-gop, /lien-he mở trang chủ và cuộn tới section.
  // Chạy khi đổi section, khi bấm lại cùng một mục (location.key đổi) và khi mở thẳng link (chia sẻ, quảng cáo).
  useEffect(() => {
    if (!sectionId) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = () => document.getElementById(sectionId);
    const frame = requestAnimationFrame(() => {
      el()?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
    /* Mở thẳng link (vd. /lien-he): phía trên còn nội dung tải sau (tin tức, ảnh) làm trang co / giãn → trong ~2,5s
       đầu, mỗi lần bố cục đổi thì căn lại section ngay dưới header. Dừng ngay khi người dùng tự cuộn / chạm / gõ phím. */
    let stop = false;
    const header = () => document.querySelector("header")?.getBoundingClientRect().height || 0;
    const realign = () => {
      const target = el();
      if (stop || !target) return;
      if (Math.abs(target.getBoundingClientRect().top - header()) > 2) target.scrollIntoView({ block: "start" });
    };
    const ro = new ResizeObserver(() => requestAnimationFrame(realign));
    const settle = window.setTimeout(() => ro.observe(document.querySelector("main") || document.body), reduce ? 0 : 900);
    const quit = () => { stop = true; ro.disconnect(); };
    const timer = window.setTimeout(quit, 2500);
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((ev) => window.addEventListener(ev, quit, { passive: true, once: true }));
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.clearTimeout(timer);
      quit();
      ["wheel", "touchstart", "keydown", "pointerdown"].forEach((ev) => window.removeEventListener(ev, quit));
    };
  }, [sectionId, location.key]);

  // Link cũ dạng "/#lien-he" (đã chia sẻ / chạy quảng cáo) → chuyển sang URL mới, thay thế mục lịch sử
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const href = hrefForSection(id);
    if (href) navigate(href, { replace: true });
    else document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, [location.hash, navigate]);

  // "/<gì đó>" không phải section → về trang chủ (không hiện trang chủ ở URL lạ)
  if (section && !sectionId) return <Navigate to="/" replace />;

  return (
    <>
      <Header onLead={onOpenModal} />
      <main id="top" tabIndex={-1} className="outline-none">
        {/* Thứ tự / ẩn / biến thể section theo CMS (Bố cục section) */}
        {homeOrder().map((id) => {
          const render = SECTIONS[id];
          return render ? (
            <Fragment key={id}>
              {render({
                onOpenModal,
                submitLead,
                variant: cmsLayout.variants[id],
              })}
            </Fragment>
          ) : null;
        })}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const [leadOpen, setLeadOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAnchorClick = (event) => {
      // giữ hành vi mặc định khi mở tab mới / chuột giữa / phím bổ trợ
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const sectionId = anchor.getAttribute("href").slice(1); // vd: "lien-he"
      event.preventDefault();

      // logo (#top): về đầu trang chủ, URL sạch "/"
      if (!sectionId || sectionId === "top") {
        if (location.pathname !== "/" || location.hash) navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      // Mục có URL riêng: trang SEO cùng chủ đề (/vi-tri…) hoặc đường dẫn section (/lien-he…) — qua router
      // (thêm 1 mục lịch sử → nút Back quay lại). Section không có URL riêng: cuộn tại chỗ, URL giữ nguyên.
      const href = hrefForSection(sectionId);
      if (href) {
        navigate(href);
        return;
      }
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else navigate("/");
    };
    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [navigate, location.pathname, location.hash]);

  const openLead = () => setLeadOpen(true);
  // Mọi form đăng ký đều đi qua đây: chặn gửi nếu SĐT không hợp lệ,
  // hợp lệ thì chuyển sang màn hình cảm ơn (thông báo gửi thành công).
  const submitLead = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validateLeadForm(form)) return;
    const button = form.querySelector('[type="submit"]');
    const errorBox = form.querySelector("[data-lead-error]");
    const label = button?.textContent;
    if (button) {
      button.disabled = true;
      button.textContent = t("form.sending");
    }
    const result = await sendLead(form);
    if (button) {
      button.disabled = false;
      button.textContent = label;
    }
    if (!result.ok) {
      if (errorBox) {
        errorBox.textContent =
          result.error || t("form.error", { phone: site.contact.hotline });
        errorBox.hidden = false;
      }
      return;
    }
    cmsTrack("lead", form.dataset.formType);
    setLeadOpen(false);
    setSubmitted(true);
  };

  if (submitted) {
    return <ThankYouPage onBack={() => setSubmitted(false)} />;
  }

  return (
    <>
      <RouteSeo />
      <ScrollEffects />
      <Routes>
        {/* "/" và "/tong-quan", "/lien-he"… dùng CHUNG một route (tham số tuỳ chọn) → chuyển section không
            dựng lại trang chủ. Trang SEO /vi-tri…, /tin-tuc khai báo tĩnh nên luôn được ưu tiên. */}
        <Route
          path="/:section?"
          element={<HomePage onOpenModal={openLead} submitLead={submitLead} />}
        />
        {SUBPAGES.map(({ path }) => (
          <Route
            key={path}
            path={path}
            element={
              <SubPage path={path} onLead={openLead} onSubmit={submitLead} />
            }
          />
        ))}
        <Route path="/tin-tuc" element={<NewsPage onLead={openLead} />} />
        <Route
          path="/tin-tuc/:articleId"
          element={<NewsDetailPage onLead={openLead} />}
        />
      </Routes>
      <FloatingButtons onLead={openLead} />
      <LeadPopup
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        onSubmit={submitLead}
      />
    </>
  );
}
