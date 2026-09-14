export default function ThankYouPage({ onBack }) {
  return (
    <main className="grid min-h-screen place-items-center bg-imperia-cream px-6 py-16 text-center">
      <section className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl md:p-12">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-imperia-primary text-3xl text-white">
          ✓
        </div>
        <p className="eyebrow">Imperia Sensa Park</p>
        <h1 className="section-title mt-3 text-4xl">Cảm ơn bạn đã đăng ký</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#6c6e65]">
          Thông tin của bạn đã được ghi nhận. Chuyên viên tư vấn sẽ liên hệ với
          bạn trong thời gian sớm nhất.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="btn-base btn-primary mt-8"
        >
          Quay lại trang dự án
        </button>
      </section>
    </main>
  );
}
