import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { submitLead } from "../../services/leadService";

const APARTMENT_TYPES = [
  "Studio",
  "Căn hộ 1 PN",
  "Căn hộ 2 PN",
  "Căn hộ 3 PN",
  "Duplex",
  "Penthouse",
  "Shophouse",
];

export default function GetInfor({
  showTitle = true,
  title,
  embedded = false,
  formType = "getinfor",
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    apartmentType: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { name: "", phone: "" };

    if (!form.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{9,11}$/.test(form.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ (9-11 chữ số)";
    }

    setErrors(newErrors);

    if (newErrors.name || newErrors.phone) {
      return;
    }

    setLoading(true);

    const { success } = await submitLead({
      name: form.name,
      phone: form.phone,
      apartmentTypes: form.apartmentType,
      formType,
    });

    if (success) {
      toast.success("Gửi thông tin thành công!");
      setForm({ name: "", apartmentType: "", phone: "" });
      setErrors({ name: "", phone: "" });
      setTimeout(() => {
        navigate("/thank-you");
      }, 1000);
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }

    setLoading(false);
  };

  return (
    <div
      className={
        embedded
          ? "bg-transparent"
          : "border-t border-imperia-primary/20 bg-imperia-dark bg-[url('../../assets/images/bg-web.jpg')] bg-cover bg-center"
      }
    >
      <div
        className={
          embedded
            ? "flex justify-start p-0"
            : "flex justify-center px-6 py-10 md:px-[100px] md:py-10"
        }
      >
        <div
          className={`flex w-full flex-col gap-8 ${
            embedded ? "max-w-full" : "max-w-[1400px]"
          }`}
        >
          {showTitle && (
            <div
              className={`font-display italic text-imperia-accent ${
                embedded ? "text-left" : "text-center"
              } text-lg md:text-2xl`}
            >
              {title || "Đăng ký nhận báo giá và chính sách ưu đãi mới nhất"}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-wrap items-stretch gap-4 md:flex-row md:items-end md:gap-[30px]"
          >
            <div className="relative flex min-w-[200px] flex-1 flex-col gap-2 md:min-w-[250px] md:gap-3">
              <label className="text-sm text-imperia-accent md:text-base">
                Họ và tên*
              </label>
              <input
                type="text"
                name="name"
                placeholder="Vui lòng nhập họ và tên"
                value={form.name}
                onChange={handleChange}
                required
                className="h-10 border-0 border-b border-imperia-secondary bg-white px-2.5 py-1 text-sm text-imperia-black outline-none md:text-base"
              />
              {errors.name && (
                <span className="absolute -bottom-5 left-0 text-xs text-imperia-primary">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="relative flex min-w-[200px] flex-1 flex-col gap-2 md:min-w-[250px] md:gap-3">
              <label className="text-sm text-imperia-accent md:text-base">
                Số điện thoại*
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Vui lòng nhập số điện thoại"
                value={form.phone}
                onChange={handleChange}
                required
                className="h-10 border-0 border-b border-imperia-secondary bg-white px-2.5 py-1 text-sm text-imperia-black outline-none md:text-base"
              />
              {errors.phone && (
                <span className="absolute -bottom-5 left-0 text-xs text-imperia-primary">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="relative flex min-w-[200px] flex-1 flex-col gap-2 md:min-w-[250px] md:gap-3">
              <label className="text-sm text-imperia-accent md:text-base">
                Nhu cầu
              </label>
              <select
                name="apartmentType"
                value={form.apartmentType}
                onChange={handleChange}
                className="h-10 cursor-pointer appearance-none border-0 border-b border-imperia-secondary bg-white bg-[right_0.625rem_center] bg-no-repeat px-2.5 py-1 pr-8 text-sm text-imperia-black outline-none [background-image:url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%228%22%20viewBox=%220%200%2012%208%22%3E%3Cpath%20d=%22M1%201l5%205%205-5%22%20stroke=%22%2320231b%22%20stroke-width=%222%22%20fill=%22none%22/%3E%3C/svg%3E')] md:text-base"
              >
                <option value="" disabled hidden className="text-gray-400">
                  Chọn loại hình căn hộ (không bắt buộc)
                </option>
                {APARTMENT_TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                    className="text-imperia-black"
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-[42px] rounded-md bg-imperia-primary px-8 font-semibold text-white transition-colors duration-300 hover:bg-imperia-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "ĐANG GỬI..." : "NHẬN THÔNG TIN"}
            </button>
          </form>

          <div className="text-center font-display text-base italic text-imperia-accent md:text-xl">
            {/* Hotline phòng kinh doanh: 0869 702 321 */}
          </div>
        </div>
      </div>
    </div>
  );
}
