import SectionHeading from "../ui/SectionHeading";
export default function Apartments({ items }) {
  return (
    <section
      id="can-ho"
      data-section="apartments"
      className="section-y bg-imperia-cream"
    >
      <div className="container-page">
        <SectionHeading
          title="Những không gian được thiết kế cho bạn."
          subtitle="Bộ sưu tập căn hộ với nhiều lựa chọn diện tích và công năng, phù hợp cho từng nhu cầu sống."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {items.map(([title, desc, area, price], i) => (
            <article
              key={title}
              data-cms-item="apartment"
              className="overflow-hidden rounded-[22px] bg-white shadow-soft"
            >
              <div
                data-cms-field="image"
                className="h-72 bg-gradient-to-br from-imperia-primary/20 via-imperia-accent/30 to-imperia-beige/50"
              />
              <div className="p-7">
                <h3 className="font-display text-2xl font-semibold text-imperia-primary">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-[#777]">{desc}</p>
                <div className="mt-6 flex justify-between border-t border-imperia-primary/10 pt-4 text-xs text-[#777]">
                  <span>{area}</span>
                  <span>{price}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
