import { Link } from 'react-router-dom';
import { CONTENT_UPDATED, TOPIC_CONTENT, faqsFor } from '../../data/topicContent';

export default function TopicContent({ path }) {
  const sections = TOPIC_CONTENT[path]?.sections || [];
  const faqs = faqsFor(path);
  return <section className="section-y bg-imperia-cream topic-content" aria-label="Thông tin chi tiết">
    <div className="container-page max-w-5xl">
      <p className="mb-6 text-sm">Cập nhật nội dung: <time dateTime={CONTENT_UPDATED}>{CONTENT_UPDATED.split('-').reverse().join('/')}</time></p>
      {sections.length > 0 && <nav aria-label="Mục lục" className="mb-10 rounded-2xl border border-imperia-primary/20 p-5"><h2 className="font-display text-2xl">Nội dung trang</h2><ul className="mt-3 grid gap-2">{sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="inline-flex min-h-11 items-center underline underline-offset-4">{section.title}</a></li>)}<li><a href="#cau-hoi-thuong-gap" className="inline-flex min-h-11 items-center underline underline-offset-4">Câu hỏi thường gặp</a></li></ul></nav>}
      {sections.map((section) => <section key={section.id} id={section.id} className="mb-10 scroll-mt-28">
        <h2 className="font-display text-2xl md:text-3xl">{section.title}</h2>
        {section.paragraphs?.map((text) => <p key={text} className="mt-4 leading-8">{text}</p>)}
        {section.items && <ul className="mt-4 list-disc space-y-3 pl-6 leading-7">{section.items.map((text) => <li key={text}>{text}</li>)}</ul>}
        {section.table && <div className="mt-5 overflow-x-auto" role="region" aria-label={section.title} tabIndex={0}><table className="w-full border-collapse text-left text-sm"><caption className="sr-only">{section.title}</caption><thead><tr>{section.table.headers.map((h) => <th scope="col" className="border border-imperia-primary/20 p-3" key={h}>{h}</th>)}</tr></thead><tbody>{section.table.rows.map(([name, ...cells]) => <tr key={name}><th scope="row" className="border border-imperia-primary/20 p-3">{name}</th>{cells.map((value, i) => <td key={i} className="border border-imperia-primary/20 p-3 leading-6">{value}</td>)}</tr>)}</tbody></table></div>}
        {section.note && <p className="mt-3 text-sm leading-6 opacity-80">{section.note}</p>}
      </section>)}
      <section id="cau-hoi-thuong-gap" className="scroll-mt-28"><h2 className="font-display text-2xl md:text-3xl">Câu hỏi thường gặp</h2><div className="mt-5 divide-y divide-imperia-primary/20">{faqs.map(([question, answer]) => <details key={question} className="py-4"><summary className="min-h-11 cursor-pointer font-semibold leading-7">{question}</summary><p className="py-3 leading-7">{answer}</p></details>)}</div></section>
      <p className="mt-8 leading-7">Bạn có thể <Link to="/mat-bang" className="underline">xem mặt bằng căn hộ</Link>, <Link to="/bang-gia" className="underline">tìm hiểu bảng giá và phương án tài chính</Link> hoặc <Link to="/lien-he" className="underline">gửi nhu cầu tư vấn</Link>.</p>
    </div>
  </section>;
}
