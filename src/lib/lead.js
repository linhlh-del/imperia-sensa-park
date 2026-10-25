// src/lib/lead.js
// Tiện ích dùng chung cho các form đăng ký: chuẩn hoá + kiểm tra số điện thoại
// Việt Nam phía client (di động 10 số đầu 03/05/07/08/09, chấp nhận +84/84).

export const PHONE_ERROR =
  "Vui lòng nhập số điện thoại Việt Nam hợp lệ (10 số, vd: 0912 345 678).";

/** Bỏ khoảng trắng, dấu chấm, gạch; đổi +84/84 về 0. */
export function normalizeVnPhone(value = "") {
  const digits = String(value).replace(/[\s.\-()]/g, "");
  return digits.replace(/^(\+?84)(?=\d{9}$)/, "0");
}

export function isValidVnPhone(value = "") {
  return /^0(3|5|7|8|9)\d{8}$/.test(normalizeVnPhone(value));
}

/**
 * Gắn vào onSubmit của <form>: kiểm tra ô name="phone", báo lỗi bằng
 * thông báo native của trình duyệt. Trả về true nếu hợp lệ.
 */
export function validateLeadForm(form) {
  const phone = form.elements.namedItem("phone");
  if (!phone) return true;
  const ok = isValidVnPhone(phone.value);
  phone.setCustomValidity(ok ? "" : PHONE_ERROR);
  if (!ok) {
    phone.reportValidity();
    return false;
  }
  phone.value = normalizeVnPhone(phone.value);
  return true;
}

/** Gắn vào onInput của ô số điện thoại để xoá lỗi khi người dùng sửa. */
export function clearPhoneError(event) {
  event.currentTarget.setCustomValidity("");
}

/* ---------------- Gửi lead về Worker (be/sensa-park) ---------------- */
const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || "";

/** Nguồn truy cập của phiên (tracker CMS lưu trong sessionStorage) + UTM trên URL hiện tại */
function attribution() {
  let src = {};
  try {
    src = JSON.parse(sessionStorage.getItem("cms_src") || "{}") || {};
  } catch {
    /* chế độ riêng tư */
  }
  const q = new URLSearchParams(location.search);
  return {
    utm_source: q.get("utm_source") || src.utm_source || "",
    utm_medium: q.get("utm_medium") || src.utm_medium || "",
    utm_campaign: q.get("utm_campaign") || src.utm_campaign || "",
    utm_content: q.get("utm_content") || "",
    utm_term: q.get("utm_term") || "",
    gclid: q.get("gclid") || "",
    fbclid: q.get("fbclid") || "",
    referrer: src.referrer || "",
  };
}

/**
 * Gửi lead của 1 form. form_type lấy từ data-form-type của <form>.
 * Trả { ok: true } hoặc { ok: false, error }. Chưa cấu hình VITE_LEAD_ENDPOINT → chỉ ghi console (dev).
 */
export async function sendLead(form) {
  const fd = new FormData(form);
  const body = {
    name: String(fd.get("name") || "").trim(),
    phone: normalizeVnPhone(fd.get("phone") || ""),
    apartment_types: [
      fd.get("apartmentType"),
      fd.get("budget") && `Ngân sách: ${fd.get("budget")}`,
    ]
      .filter(Boolean)
      .join(" · "),
    form_type: form.dataset.formType || "unknown",
    page_url: location.href.slice(0, 500),
    submitted_at: new Date().toISOString(),
    website: fd.get("website") || "", // honeypot
    ...attribution(),
  };
  if (!ENDPOINT) {
    console.info("[lead] Chưa cấu hình VITE_LEAD_ENDPOINT — dữ liệu:", body);
    return { ok: true };
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
    const out = await res.json().catch(() => null);
    if (!res.ok || !out?.success) return { ok: false, error: out?.error };
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
