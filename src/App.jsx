import { ParkOverview, ParkAmenities, ParkGallery, ParkResidences } from "./components/sections/ParkTemplate";
import { trackEvent } from "./lib/analytics";
import MotionVisibility from "./components/effects/MotionVisibility";
import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate, useParams } from "react-router-dom";
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
import SitePolicyPage from "./pages/SitePolicyPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoanCalculator from "./components/sections/LoanCalculator";
import { SUBPAGES } from "./lib/seo";
import RouteSeo from "./components/seo/RouteSeo";
import ScrollEffects from "./components/effects/ScrollEffects";
import PhraseGlue from "./components/effects/PhraseGlue";
import { SalesPolicy, HomeFaq } from "./components/sections/DecisionSections";
import { hrefForSection, sectionForPath } from "./lib/sections";
import { sendLead, validateLeadForm } from "./lib/lead";
import { cmsTrack } from "./lib/cmsTracker";
import { cmsLayout, site, t } from "./cms/content";
import { HOME_SECTIONS } from "./cms/schema";
import useSectionPaging from "./lib/useSectionPaging";
import { fitSections } from "./lib/fitSections";

/* id section (khớp HOME_SECTIONS trong src/cms/schema.js) → nội dung.
   News tự lấy dữ liệu (newsService) — không truyền project.news (dữ liệu cũ, sai shape). */
const SECTIONS = {
  hero: ({ variant }) => <Hero data={site.hero} variant={variant} />,
  "tong-quan": ({ variant }) => (
    <ParkOverview data={site.overview} />
  ),
  "vi-tri": ({ variant }) => (
    <Location data={site.location} variant={variant} />
  ),
  "tien-ich": () => (
    <>
      <ParkAmenities />
      <Amenities id="tong-hop-tien-ich" />
    </>
  ),
  hinhanh: () => <ParkGallery />,
  "mat-bang": () => <ParkResidences />,
  "chinh-sach-ban-hang": ({ onOpenModal }) => <SalesPolicy onLead={onOpenModal} />,
  faq: () => <HomeFaq />,
  "tin-tuc": () => <News />,
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
  /* bố cục norton-park: máy tính lăn chuột mỗi nấc = 1 section (src/lib/useSectionPaging.js);
     section nào cao hơn 1 khung hình thì thu nhỏ đều nội dung cho vừa (src/lib/fitSections.js, như qtopia-landing) */
  useSectionPaging();
  useEffect(() => fitSections(), []);
  const { section } = useParams();
  const sectionId = section ? sectionForPath(`/${section}`) : undefined;
  const navigate = useNavigate();

  // URL theo section, không dấu "#": /chinh-sach-ban-hang, /lien-he mở trang chủ và cuộn tới section.
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

  // Liên kết header dạng "/#section": cuộn tới section trên trang chủ ở mọi kích thước màn hình.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const frame = requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.hash, location.key]);

  // "/<gì đó>" không phải section → về trang chủ (không hiện trang chủ ở URL lạ)
  if (section && !sectionId) return <NotFoundPage onLead={onOpenModal} />;

  return (
    <>
      <Header onLead={onOpenModal} />
      <main id="main-content" tabIndex={-1} className="park-home outline-none">
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

const POPUP_SEEN_KEY = "sensa_popup_seen";
const popupSeen = () => {
  try { return sessionStorage.getItem(POPUP_SEEN_KEY) === "1"; } catch { return true; }
};
const markPopupSeen = () => {
  try { sessionStorage.setItem(POPUP_SEEN_KEY, "1"); } catch { /* chế độ riêng tư: bỏ qua */ }
};

export default function App() {
  const [leadOpen, setLeadOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleAnchorClick = (event) => {
      // giữ hành vi mặc định khi mở tab mới / chuột giữa / phím bổ trợ
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const sectionId = anchor.getAttribute("href").slice(1); // vd: "lien-he"
      const localTarget = document.getElementById(sectionId);
      if (localTarget && !hrefForSection(sectionId)) {
        if (sectionId === "main-content") localTarget.focus();
        return;
      }
      event.preventDefault();

      // logo (#top): về đầu trang chủ, URL sạch "/"
      if (!sectionId || sectionId === "top") {
        if (location.pathname !== "/" || location.hash) navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (localTarget) {
        localTarget.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      } else {
        navigate(`/#${sectionId}`);
      }
    };
    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [navigate, location.pathname, location.hash]);

  /* form_type trên Sheet: "popup" (khách bấm nút) hoặc "popup_auto" (tự mở) */
  const [leadSource, setLeadSource] = useState("popup");
  const openLead = (from) => {
    setLeadSource(typeof from === "string" ? from : "popup");
    setLeadOpen(true);
    markPopupSeen();
  };

  /* Popup tự mở MỘT lần mỗi phiên, KHÔNG mở khi vừa vào trang: chỉ khi khách đã lướt qua section "Tổng quan"
     (#tong-quan: đáy section lên tới 30% trên của màn hình). Trang không có section này: khi đã cuộn quá nửa trang.
     Không mở trên trang cảm ơn, không cắt ngang khi khách đang gõ vào form khác (thử lại ở lần cuộn sau). */
  useEffect(() => {
    if (popupSeen()) return undefined;
    const passed = () => {
      const el = document.getElementById("tong-quan");
      if (el) return el.getBoundingClientRect().bottom <= window.innerHeight * 0.3;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 && window.scrollY / max >= 0.5;
    };
    const onScroll = () => {
      if (popupSeen()) { window.removeEventListener("scroll", onScroll); return; }
      if (window.location.pathname.includes("/cam-on") || document.activeElement?.closest?.("form") || !passed()) return;
      window.removeEventListener("scroll", onScroll);
      openLead("popup_auto");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Mọi form đăng ký đều đi qua đây: chặn gửi nếu SĐT không hợp lệ,
  // hợp lệ thì chuyển sang màn hình cảm ơn (thông báo gửi thành công).
  const submitLead = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validateLeadForm(form)) return;
    const button = form.querySelector('[type="submit"]');
    const errorBox = form.querySelector("[data-lead-error]");
    if (errorBox) { errorBox.hidden = true; errorBox.textContent = ""; }
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
    trackEvent("generate_lead", { form_location: form.dataset.formType || "unknown" });
    setLeadOpen(false);
    navigate("/cam-on");
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Bỏ qua menu, đến nội dung chính</a>
      <RouteSeo />
      <ScrollEffects />
      <PhraseGlue />
      <MotionVisibility />
      <Routes>
        <Route path="/chinh-sach-bao-mat" element={<SitePolicyPage type="privacy" onLead={openLead} />} />
        <Route path="/dieu-khoan" element={<SitePolicyPage type="terms" onLead={openLead} />} />
        <Route path="/cam-on" element={<ThankYouPage onBack={() => navigate("/")} />} />
        <Route path="/404" element={<NotFoundPage onLead={openLead} />} />
        <Route path="*" element={<NotFoundPage onLead={openLead} />} />
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
        formType={leadSource}
      />
    </>
  );
}
