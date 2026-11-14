import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function NotFoundPage({ onLead }) {
  return <><Header onLead={onLead} /><main id="main-content" tabIndex={-1} className="container-page min-h-[70svh] pb-16 pt-[calc(var(--header-h)+64px)]"><p className="eyebrow">404</p><h1 className="section-title">Không tìm thấy trang</h1><p className="section-subtitle">Đường dẫn không tồn tại hoặc nội dung đã được di chuyển.</p><div className="mt-8 flex flex-wrap gap-3"><Link className="btn-base btn-primary" to="/">Về trang chủ</Link><Link className="btn-base btn-outline" to="/tong-quan">Tổng quan Imperia Sensa Park</Link></div></main><Footer /></>;
}
