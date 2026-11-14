import { Link } from "react-router-dom";
/* Phần dùng chung cho mọi form lead: ô chống spam (honeypot, người thật không thấy) + chỗ báo lỗi gửi.
   App.submitLead ghi lỗi vào [data-lead-error] khi Worker trả lỗi. */
export default function FormExtras() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="text-xs leading-6">Thông tin được gửi để tiếp nhận nhu cầu tư vấn. Xem <Link to="/chinh-sach-bao-mat" className="underline">thông tin bảo mật</Link>.</p>
      <p
        data-lead-error
        role="alert"
        hidden
        className="m-0 text-sm text-red-700"
      />
    </>
  );
}
