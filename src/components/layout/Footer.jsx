export default function Footer() {
  return (
    <footer className="bg-imperia-background-dark text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-xl tracking-widest">
            IMPERIA <span className="text-imperia-accent">SENSA PARK</span>
          </div>
        </div>
        <div>
          <h4 className="font-bold">Dự án</h4>
          <div className="mt-4 grid gap-2 text-sm text-white/60">
            <a href="#tong-quan">Tổng quan</a>
            <a href="#vi-tri">Vị trí</a>
            <a href="#tien-ich">Tiện ích</a>
            <a href="#mat-bang">Mặt bằng</a>
          </div>
        </div>
        <div>
          <h4 className="font-bold">Liên hệ</h4>
          <div className="mt-4 grid gap-2 text-sm text-white/60">
            <a href="#tin-tuc">Tin tức</a>
            <a href="#lien-he">Nhận bảng giá</a>
          </div>
        </div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-white/10 py-5 text-[11px] text-white/40 md:flex-row md:justify-between">
        <span>© 2026 Imperia Sensa Park.</span>
        <span>Chính sách bảo mật · Điều khoản sử dụng</span>
      </div>
    </footer>
  );
}
