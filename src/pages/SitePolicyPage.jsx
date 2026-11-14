import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { applySeo } from '../lib/seo';
import { site } from '../cms/content';

export default function SitePolicyPage({ type, onLead }) {
  const privacy = type === 'privacy';
  const title = privacy ? 'Thông tin bảo mật' : 'Điều kiện sử dụng thông tin';
  useEffect(() => { applySeo({ title: `${title} | Imperia Sensa Park`, description: privacy ? 'Thông tin về dữ liệu gửi qua biểu mẫu tư vấn Imperia Sensa Park và cách liên hệ khi cần hỗ trợ về dữ liệu đã cung cấp.' : 'Phạm vi sử dụng thông tin, ảnh phối cảnh, sơ đồ và công cụ ước tính trên website Imperia Sensa Park.', path: privacy ? '/chinh-sach-bao-mat' : '/dieu-khoan', noindex: true }); }, [privacy, title]);
  return <><Header onLead={onLead} /><main id="main-content" tabIndex={-1} className="container-page max-w-4xl pb-16 pt-[calc(var(--header-h)+48px)]"><nav aria-label="Breadcrumb" className="mb-6"><Link to="/">Trang chủ</Link> / <span aria-current="page">{title}</span></nav><h1 className="section-title">{title}</h1>
    {privacy ? <><h2 className="mt-8 font-display text-2xl">Dữ liệu trong yêu cầu tư vấn</h2><p className="mt-4 leading-8">Khi gửi biểu mẫu, bạn cung cấp họ tên, số điện thoại và có thể chọn loại căn, ngân sách dự kiến. Yêu cầu còn kèm thời điểm gửi, trang đăng ký và thông tin nguồn truy cập để hỗ trợ tiếp nhận và tư vấn.</p><h2 className="mt-8 font-display text-2xl">Dữ liệu sử dụng website</h2><p className="mt-4 leading-8">Website có thể sử dụng mã phiên, mã trình duyệt và các thông tin tương tác để thống kê lượt truy cập khi hệ thống đo lường được bật. Trình duyệt có thể lưu thông tin nguồn chiến dịch để liên kết với yêu cầu tư vấn.</p><h2 className="mt-8 font-display text-2xl">Liên hệ về thông tin đã cung cấp</h2><p className="mt-4 leading-8">Nếu cần sửa thông tin liên hệ hoặc đề nghị ngừng liên hệ tư vấn, vui lòng gọi hotline <a className="underline" href={site.contact.hotlineHref}>{site.contact.hotline}</a> và nêu yêu cầu để được hỗ trợ.</p></> : <><h2 className="mt-8 font-display text-2xl">Thông tin giới thiệu dự án</h2><p className="mt-4 leading-8">Nội dung trên website phục vụ tìm hiểu và gửi nhu cầu tư vấn. Giá bán, lịch thanh toán, tiêu chuẩn bàn giao và các điều kiện áp dụng cần đối chiếu tài liệu có hiệu lực cho đúng căn hộ.</p><h2 className="mt-8 font-display text-2xl">Ảnh, sơ đồ và công cụ tính</h2><p className="mt-4 leading-8">Ảnh phối cảnh và sơ đồ mang tính minh họa; thời gian di chuyển là tham khảo. Kết quả tính trả góp dựa trên giả định người dùng nhập và không phải báo giá hay phê duyệt khoản vay.</p></>}
    <Link to="/lien-he" className="btn-base btn-primary mt-8">Liên hệ tư vấn</Link>
  </main><Footer /></>;
}
