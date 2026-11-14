import dimensions from '../../data/imageDimensions.json';

/** Reserve the image's own aspect ratio without changing its source or crop. */
export default function Image({ src, width, height, loading, fetchPriority, ...props }) {
  // src có thể đã mã hoá URL (dấu cách, tiếng Việt) trong khi bảng kích thước lưu tên gốc
  let decoded = src;
  try { decoded = decodeURIComponent(src); } catch { /* giữ nguyên */ }
  const size = dimensions[src] || dimensions[decoded];
  return <img src={src} width={width || size?.[0]} height={height || size?.[1]}
    loading={loading || (fetchPriority === 'high' ? 'eager' : 'lazy')}
    fetchPriority={fetchPriority} decoding="async" {...props} />;
}
