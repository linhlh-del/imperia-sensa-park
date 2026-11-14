// Danh sách bài viết dùng chung cho trang chủ, trang tin và trang chi tiết.
import NEWS_DATA from "../data/newsData.js";

/** Dữ liệu bài viết tĩnh, không tạo độ trễ giả cho nội dung đã có sẵn. */
export function fetchNewsList() {
  return Promise.resolve([...NEWS_DATA].sort((a, b) => new Date(b.published_at) - new Date(a.published_at)));
}

/** Bài viết nổi bật (mới nhất). */
export function getFeatured(list) {
  return list[0];
}

/** N bài viết kế tiếp sau bài featured/hiện tại, dùng cho sidebar "Điểm nổi bật". */
export function getHighlights(list, excludeId, count = 2) {
  return list.filter((item) => item.id !== excludeId).slice(0, count);
}

/** N bài viết liên quan — ưu tiên cùng tag, sau đó bổ sung bài khác nếu thiếu. */
export function getRelated(list, excludeId, count = 3) {
  const others = list.filter((item) => item.id !== excludeId);
  const current = list.find((item) => item.id === excludeId);
  if (!current) return others.slice(0, count);

  const sameTag = others.filter((item) => item.tag === current.tag);
  const rest = others.filter((item) => item.tag !== current.tag);
  return [...sameTag, ...rest].slice(0, count);
}

/** Đường dẫn tới trang chi tiết bài viết. */
export function getHref(id) {
  return `/tin-tuc/${id}`;
}

/** Ảnh banner cho trang chi tiết, fallback về ảnh thumbnail nếu chưa có. */
export function getBannerSrc(article) {
  return article.banner_url || article.image_url;
}

/** "2026-08-20" -> "20/08/2026" */
export function formatDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
