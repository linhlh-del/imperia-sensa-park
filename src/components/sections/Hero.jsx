import Button from "../ui/Button";

export default function Hero({ data }) {
  return (
    <section
      id="hero"
      data-section="hero"
      className="relative z-20 flex min-h-[860px] items-center overflow-visible bg-imperia-dark pt-[76px] text-white"
    >
      {/* Wrapper riêng để crop ảnh, không ảnh hưởng overflow của section (cần visible cho stats bar) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/assets/hero2.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-contain object-center"
        />
        {/* Gradient overlay để chữ bên trái luôn đọc rõ trên mọi kích thước ảnh */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(53,60,39,.92) 0%, rgba(53,60,39,.75) 30%, rgba(53,60,39,.15) 60%, rgba(53,60,39,0) 80%)",
          }}
        />
      </div>

      <div className="container-page relative z-10 py-24">
        <div className="max-w-[560px]">
          <div className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-imperia-accent">
            {data.kicker}
          </div>
          <h1 className="font-display text-[clamp(3rem,6vw,88px)] font-semibold uppercase leading-[.88] tracking-[-.04em]">
            {data.title}
            <br />
            <span className="text-imperia-accent">{data.titleAccent}</span>
          </h1>
          <p className="mt-7 max-w-[560px] text-[clamp(0.75rem,1.2vw,1.25rem)] leading-7 text-white/75">
            {data.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#tong-quan" variant="light">
              Khám phá dự án
            </Button>
            <Button href="#lien-he" variant="outlineLight">
              Nhận bảng giá
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[-62px] z-30">
        <div className="container-page grid overflow-hidden rounded-2xl bg-imperia-primary shadow-card grid-cols-2 md:grid-cols-4">
          {data.stats.map(([number, suffix, label]) => (
            <div
              key={label}
              className="border-r border-white/10 p-5 last:border-0 md:p-7"
            >
              <div className="font-display text-3xl md:text-4xl">
                {number}
                <small className="ml-1 text-base text-imperia-accent">
                  {suffix}
                </small>
              </div>
              <div className="mt-1 text-xs text-white/55">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
