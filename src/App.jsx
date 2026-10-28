import { Fragment, useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
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

  // Khi đến "/" kèm state.scrollTo (được Header điều hướng từ trang khác
  // gửi qua, xem handleAnchorClick bên dưới), cuộn tới đúng section sau khi
  // HomePage đã render xong.
  useEffect(() => {
    const sectionId = location.state?.scrollTo;
    if (!sectionId) return;

    const scrollToSection = () => {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // Xóa state khỏi history entry hiện tại để reload/back không bị
      // cuộn lại lần nữa.
      window.history.replaceState({}, "");
    };

    requestAnimationFrame(scrollToSection);
  }, [location.state]);

  return (
    <>
      <Header onLead={onOpenModal} />
      <main id="top">
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
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href"); // vd: "#lien-he"
      const sectionId = hash.slice(1);
      const target = document.querySelector(hash);

      event.preventDefault();

      if (target) {
        // Section có sẵn ngay trên trang hiện tại (đang ở "/") -> cuộn tại chỗ.
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
        return;
      }

      if (location.pathname === "/") {
        // Đang ở trang chủ nhưng không thấy section (id sai) -> không làm gì.
        return;
      }

      // Đang ở trang khác (vd: /tin-tuc/:id) -> điều hướng về trang chủ
      // kèm state.scrollTo để HomePage tự cuộn tới sau khi render xong.
      navigate("/", { state: { scrollTo: sectionId } });
    };
    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [navigate, location.pathname]);

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
        <Route
          path="/"
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
