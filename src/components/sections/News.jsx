import SectionHeading from "../ui/SectionHeading";
export default function News({ items }) {
  return (
    <section id="tin-tuc" data-section="news" className="section-y bg-white">
      <div className="container-page">
        <SectionHeading
          title="Cập nhật mới nhất."
          subtitle="Nơi tổng hợp những thông tin mới nhất về dự án, thị trường và các chính sách bán hàng."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {items.map(([date, title], i) => (
            <article
              key={title}
              data-cms-item="news"
              className="overflow-hidden rounded-[22px] border border-imperia-primary/10 bg-imperia-cream"
            >
              <div
                data-cms-field="image"
                className="h-56 bg-gradient-to-br from-imperia-primary/15 to-imperia-beige/60"
              />
              <div className="p-6">
                <div className="text-xs font-bold tracking-widest text-imperia-secondary">
                  {date}
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold text-imperia-primary">
                  {title}
                </h3>
                <a
                  href="#"
                  className="mt-5 inline-block text-sm font-bold text-imperia-primary hover:text-imperia-secondary"
                >
                  Xem chi tiết →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
