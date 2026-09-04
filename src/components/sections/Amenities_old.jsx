import SectionHeading from "../ui/SectionHeading";
export default function Amenities({ items }) {
  return (
    <section
      id="tien-ich"
      data-section="amenities"
      className="section-y bg-white"
    >
      <div className="container-page">
        <SectionHeading
          center
          title="Sống xanh — Sống chất."
          subtitle="Hệ sinh thái tiện ích được quy hoạch để phục vụ trọn vẹn nhu cầu sống, nghỉ ngơi, kết nối và phát triển mỗi ngày."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {items.map(([title, desc], i) => (
            <article
              key={title}
              data-cms-item="amenity"
              className="group overflow-hidden rounded-2xl border border-imperia-primary/10 bg-imperia-cream transition duration-300 hover:-translate-y-1 hover:shadow-soft"
            >
              <div
                data-cms-field="image"
                className="grid h-40 place-items-center border-b border-dashed border-imperia-primary/15 bg-[linear-gradient(135deg,rgba(77,85,56,.12),rgba(169,181,120,.28))] text-[11px] font-bold tracking-widest text-imperia-secondary"
              >
                IMAGE 0{i + 1}
              </div>
              <div className="p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-imperia-accent/30 text-imperia-primary">
                  {["♧", "≈", "⌁", "♡", "⌂"][i]}
                </div>
                <h3 className="font-display text-xl font-semibold text-imperia-primary">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-[#777]">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
