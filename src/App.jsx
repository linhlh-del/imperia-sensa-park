import { useEffect, useState } from "react";
import { project } from "./data/project";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LeadPopup from "./components/ui/LeadPopup";
import Hero from "./components/sections/Hero";
import Overview from "./components/sections/Overview";
import Location from "./components/sections/Location";
import Amenities from "./components/sections/Amenities";
import FloorPlan from "./components/sections/FloorPlan";
import News from "./components/sections/News";
import LeadSection from "./components/sections/LeadSection";

export default function App() {
  const [leadOpen, setLeadOpen] = useState(false);
  useEffect(() => {
    const handleAnchorClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    };
    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);
  const openLead = () => setLeadOpen(true);
  const submitLead = (e) => {
    e.preventDefault();
    alert("Demo template: form đã submit. Kết nối API/CMS ở bước triển khai.");
    setLeadOpen(false);
  };
  return (
    <>
      <Header onLead={openLead} />
      <main id="top">
        <Hero data={project.hero} />
        <Overview data={project.overview} />
        <Location data={project.location} />
        <Amenities items={project.amenities} />
        <FloorPlan
          images={{
            A: "/assets/layout/sensa-A.png",
            B: "/assets/layout/sensa-b.jpg",
          }}
        />

        <News items={project.news} />
        <LeadSection onSubmit={submitLead} />
      </main>
      <Footer />
      <div className="fixed bottom-5 right-5 z-[900] grid gap-2">
        <button
          onClick={openLead}
          aria-label="Nhận thông tin"
          className="grid h-12 w-12 place-items-center rounded-full bg-imperia-primary text-white shadow-lg transition hover:-translate-y-1"
        >
          ✉
        </button>
        <a
          href="tel:18001234"
          aria-label="Gọi hotline"
          className="grid h-12 w-12 place-items-center rounded-full bg-imperia-secondary text-white shadow-lg transition hover:-translate-y-1"
        >
          ☎
        </a>
        <a
          href="#top"
          aria-label="Lên đầu trang"
          className="grid h-12 w-12 place-items-center rounded-full bg-imperia-accent text-imperia-primary shadow-lg transition hover:-translate-y-1"
        >
          ↑
        </a>
      </div>
      <LeadPopup
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        onSubmit={submitLead}
      />
    </>
  );
}
