import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
export default function Location({ data }) {
  return (
    <section
      id="vi-tri"
      data-section="location"
      className="section-y bg-imperia-primary text-white"
    >
      <div className="container-page">
        <SectionHeading light title={data.title} />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="section-subtitle section-subtitle-light !mt-0 mb-7">
              {data.subtitle}
            </p>
            <div className="mb-8 grid divide-y divide-white/10 border-y border-white/10">
              {data.distances.map(([time, label]) => (
                <div key={label} className="flex items-center gap-6 py-5">
                  <strong className="min-w-20 font-display text-3xl text-imperia-accent">
                    {time}
                  </strong>
                  <span className="text-sm text-white/70">{label}</span>
                </div>
              ))}
            </div>
            <Button href="#lien-he" variant="light">
              Xem vị trí & tư vấn
            </Button>
          </div>
          <div className="relative aspect-[1872/1248] overflow-hidden rounded-[28px] border border-white/10">
            <img
              src="/assets/map.jpg"
              alt="Bản đồ vị trí Imperia Sensa Park"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
