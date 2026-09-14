import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { project } from "./data/project";
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

function HomePage({ onOpenModal, leadOpen, setLeadOpen, submitLead }) {
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
        <Hero data={project.hero} />
        <Overview data={project.overview} />
        <Location data={project.location} />
        <Amenities items={project.amenities} />
        <FeaturedAmenities />
        <FloorPlan
          images={{
            A: "/assets/layout/sensa-A.png",
            B: "/assets/layout/sensaB.png",
          }}
        />
        <ExclusiveServicesSection />
        {/* Không truyền `items` nữa — để News tự lấy dữ liệu (hiện là mock
            trong newsService/newsData, sau này là API thật) thay vì dùng
            project.news (dữ liệu cũ, sai shape, gây ra /tin-tuc/undefined). */}
        <News />
        <LeadSection onSubmit={submitLead} />
      </main>
      <Footer />
      <FloatingButtons />
      <LeadPopup
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        onSubmit={submitLead}
      />
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
  const submitLead = (e) => {
    e.preventDefault();
    setLeadOpen(false);
    setSubmitted(true);
  };

  if (submitted) {
    return <ThankYouPage onBack={() => setSubmitted(false)} />;
  }

  // Lưu ý: NewsPage/NewsDetailPage tự render Header/Footer riêng của chúng,
  // nên chỉ HomePage mới cần nhận onOpenModal/leadOpen ở đây.
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            onOpenModal={openLead}
            leadOpen={leadOpen}
            setLeadOpen={setLeadOpen}
            submitLead={submitLead}
          />
        }
      />
      <Route path="/tin-tuc" element={<NewsPage />} />
      <Route path="/tin-tuc/:articleId" element={<NewsDetailPage />} />
    </Routes>
  );
}
