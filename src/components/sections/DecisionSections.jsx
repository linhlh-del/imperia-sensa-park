import { useState } from "react";
import { Link } from "react-router-dom";
import { faqsFor } from "../../data/topicContent";
import { salesPolicy } from "../../data/salesPolicy";
import { QHeading } from "./ParkTemplate";

/* Chính sách bán hàng: bố cục theo qtopia-landing (nhãn + câu dẫn + huy hiệu, tab phương thức, timeline các mốc).
   Dữ liệu: src/data/salesPolicy.js (theo bảng CSBH của chủ đầu tư). Timeline ngang từ 640px, dọc trên điện thoại. */
function Amount({ m, size = "lg" }) {
  if (!m.amount) return <span className="csbh-amount is-empty">—</span>;
  return <span className={`csbh-amount ${size === "sm" ? "is-sm" : ""}`}>{m.amount}<small>{m.unit}</small></span>;
}
function TimelineH({ milestones }) {
  const n = milestones.length;
  const pos = milestones.map((_, i) => ((i + 0.5) / n) * 100);
  return (
    <div className="csbh-h" aria-hidden="true">
      <div className="csbh-row">{milestones.map((m, i) => <div key={i}><span className="csbh-mlabel">{m.label}</span><Amount m={m} /></div>)}</div>
      <div className="csbh-line">
        <span className="csbh-bar" style={{ left: `${pos[0]}%`, right: `${100 - pos[n - 1]}%` }} />
        {milestones.map((m, i) => <span key={i} className={`csbh-dot ${m.group ? "is-group" : ""}`} style={{ left: `${pos[i]}%` }} />)}
        {milestones.map((m, i) => m.between && i < n - 1 ? <span key={`b${i}`} className="csbh-between" style={{ left: `${(pos[i] + pos[i + 1]) / 2}%` }}>{m.between}</span> : null)}
      </div>
      <div className="csbh-row is-bottom">{milestones.map((m, i) => (
        <div key={i}>
          {m.when && <span className="csbh-when">{m.when} <em>(dự kiến)</em></span>}
          {m.group && <span className="csbh-sub">{m.group}</span>}
          {m.sub && <span className="csbh-sub">{m.sub}</span>}
          {m.bank && <span className="csbh-bank">Ngân hàng giải ngân</span>}
        </div>
      ))}</div>
    </div>
  );
}
function TimelineV({ milestones }) {
  return (
    <ol className="csbh-v" aria-hidden="true">
      {milestones.map((m, i) => (
        <li key={i}>
          <div className="csbh-v-row">
            <span className="csbh-v-text"><strong>{m.label}</strong>{[m.when && `${m.when} (dự kiến)`, m.group, m.sub, m.bank && "NH giải ngân"].filter(Boolean).map((x) => <span key={x}>{x}</span>)}{m.between && <span className="csbh-v-next">↓ {m.between}</span>}</span>
            <Amount m={m} size="sm" />
          </div>
          {m.between && <span className="csbh-v-between">↓ {m.between}</span>}
        </li>
      ))}
    </ol>
  );
}
export function SalesPolicy({ onLead }) {
  const { methods, highlight } = salesPolicy;
  const [activeId, setActiveId] = useState(methods[0].id);
  const active = methods.find((m) => m.id === activeId);
  const onKey = (e) => {
    const i = methods.findIndex((m) => m.id === activeId);
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (next == null) return;
    e.preventDefault();
    const m = methods[(next + methods.length) % methods.length];
    setActiveId(m.id);
    document.getElementById(`csbh-tab-${m.id}`)?.focus();
  };
  return (
    <section id="chinh-sach-ban-hang" className="park-section csbh">
      <div className="container-page">
        <div className="q-head-row">
          <QHeading light label={salesPolicy.label} lead={salesPolicy.lead} />
          {/* Hai cột chữ cao đúng bằng chiều cao chữ số (--num = cỡ chữ số) — xem .csbh-badge trong park-template.css */}
          <p className="csbh-badge"><span className="csbh-badge-side"><span>{highlight.prefix}</span><span>lên đến</span></span><span className="csbh-badge-num">{highlight.value}<small>{highlight.unit}</small></span></p>
        </div>
        {/* Điện thoại: chọn gói bằng dropdown (5 tab không vừa 1 hàng) */}
        <label className="csbh-select">
          <span>Phương thức thanh toán</span>
          <select value={activeId} onChange={(e) => setActiveId(e.target.value)} aria-controls="csbh-panel">
            {methods.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </label>
        <div className="csbh-tabs" role="tablist" aria-label="Phương thức thanh toán" onKeyDown={onKey}>
          {methods.map((m) => (
            <button key={m.id} id={`csbh-tab-${m.id}`} type="button" role="tab" aria-selected={m.id === activeId} aria-controls="csbh-panel" tabIndex={m.id === activeId ? 0 : -1} onClick={() => setActiveId(m.id)}>{m.tab}</button>
          ))}
        </div>
        {/* Mọi phương thức xếp chồng trong cùng 1 ô lưới, chỉ hiện phương thức đang chọn → khung luôn cao bằng
            phương thức dài nhất, đổi tab không làm cả trang "nhảy" (checklist UI/UX 2.2; audit A→B→A 14/11/2026) */}
        <div id="csbh-panel" role="tabpanel" aria-labelledby={`csbh-tab-${active.id}`} className="csbh-panel csbh-stack">
          {methods.map((item) => {
            const on = item.id === active.id;
            return (
              <div key={item.id} className="csbh-layer" aria-hidden={on ? undefined : true} inert={on ? undefined : true}>
                <div className="csbh-panel-head">{on ? <h3>{item.title}</h3> : <p className="csbh-ghost-title">{item.title}</p>}<div>{item.badges.map((b) => <span key={b} className="csbh-chip">{b}</span>)}</div></div>
                <TimelineH milestones={item.milestones} />
                <TimelineV milestones={item.milestones} />
                {on && <ul className="sr-only">{item.milestones.map((m, i) => <li key={i}>{m.label}{m.amount ? `: ${m.amount}${m.unit}` : ""}{m.when ? ` (${m.when}, dự kiến)` : ""}{m.group ? `. ${m.group}` : ""}{m.between ? `. Sau đó ${m.between}` : ""}</li>)}</ul>}
                {item.note && <p className="csbh-note">{item.note}</p>}
              </div>
            );
          })}
        </div>
        <div className="csbh-foot">
          <div className="csbh-legal"><span>{salesPolicy.glossary}</span><span>{salesPolicy.disclaimer}</span><span className="csbh-legal-short">Mốc thời gian dự kiến · điều kiện theo hồ sơ chủ đầu tư.</span></div>
          <div className="q-actions">
            <a className="btn-base btn-outline-light" href={salesPolicy.image} target="_blank" rel="noopener">Xem bảng CSBH gốc</a>
            <button type="button" className="btn-base btn-light" onClick={onLead}>Nhận chính sách & bảng giá</button>
          </div>
        </div>
      </div>
    </section>
  );
}
export function HomeFaq(){
 const [open,setOpen]=useState(null);
 const all=faqsFor('/faq');const questions=[all[0],...faqsFor('/vi-tri').slice(0,1),...faqsFor('/mat-bang').slice(0,1),...faqsFor('/bang-gia').slice(0,2)].filter(Boolean);
 return <section id="faq" className="section-y bg-imperia-cream"><div className="container-page home-faq-grid"><div><QHeading label="Câu hỏi thường gặp về Imperia Sensa Park" lead="Thông tin nhanh về vị trí, căn hộ và phương án tài chính." /><div className="q-actions"><Link to="/faq" className="btn-base btn-outline">Xem tất cả câu hỏi →</Link><a href="#lien-he" className="btn-base btn-primary">Tư vấn riêng</a></div></div><div>{questions.map(([q,a],i)=><div className="home-faq-item" key={q}><h3><button type="button" aria-expanded={open===i} aria-controls={`home-faq-answer-${i}`} onClick={()=>setOpen(open===i?null:i)}>{q}<span aria-hidden="true">{open===i?'−':'+'}</span></button></h3><div id={`home-faq-answer-${i}`} hidden={open!==i} className="pb-5 text-sm leading-7">{a}</div></div>)}</div></div></section>;
}
