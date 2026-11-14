/** Ảnh layout căn hộ dùng chung cho FloorPlan (mặt bằng tương tác) và ApartmentTypes (loại căn + bảng từng căn). */

/* Ảnh đại diện mỗi LOẠI HÌNH (hiện khi hover/bấm chip loại hình, chưa chọn căn cụ thể) — trước trỏ tới
   studio.png/1pn.png/2pn.png/3pn.png, các file này không tồn tại trong public/assets/aparments (ảnh vỡ).
   Lấy lại từ ảnh căn cụ thể đã có sẵn (UNIT_LAYOUT_IMAGES bên dưới), chọn 1 căn tiêu biểu mỗi loại hình. */
export const LAYOUT_IMAGES = {
  STUDIO: "/assets/aparments/B01.optimized.webp", // B.01 — căn Studio
  "1PN+": "/assets/aparments/A03.optimized.webp", // A.03 — căn 1PN+
  "2PN": "/assets/aparments/2PN-70-4m2.optimized.webp", // tiêu biểu 2PN
  "3PN": "/assets/aparments/A08.optimized.webp", // A.08 — căn 3PN
  DUPLEX: "/assets/aparments/B-DUPLEX.optimized.webp",
};

export const UNIT_LAYOUT_IMAGES = {
  "A.01": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "A.02": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "A.03": "/assets/aparments/A03.optimized.webp",
  "A.03A": "/assets/aparments/2PN -70m2.optimized.webp", //CHƯA CÓ ẢNH
  "A.05": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "A.06": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "A.07": "/assets/aparments/2PN-94-9m2.optimized.webp",
  "A.08": "/assets/aparments/A08.optimized.webp",
  "A.09": "/assets/aparments/2PN -70m2.optimized.webp",
  "A.10": "/assets/aparments/2PN -70m2.optimized.webp", //CHƯA CÓ ẢNH
  "A.11": "/assets/aparments/2PN -70m2.optimized.webp",
  "A.12": "/assets/aparments/2PN -70m2.optimized.webp",
  "A.12A": "/assets/aparments/A12A.optimized.webp",
  "A.12B": "/assets/aparments/2PN -70m2.optimized.webp", //CHƯA CÓ ẢNH
  "A.15": "/assets/aparments/2PN -70m2.optimized.webp",
  "A.16": "/assets/aparments/2PN -70m2.optimized.webp", //CHƯA CÓ ẢNH
  "A.17": "/assets/aparments/2PN -70m2.optimized.webp",
  "A.19": "/assets/aparments/2PN-94-9m2.optimized.webp",
  "A.20": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "B.01": "/assets/aparments/B01.optimized.webp", // Studio (trước gán nhầm ảnh 1PN+ B12A)
  "B.02": "/assets/aparments/B02.optimized.webp",
  "B.03": "/assets/aparments/B03-2ND.optimized.webp",
  "B.03A": "/assets/aparments/2PN-70-1m2.optimized.webp",
  "B.05": "/assets/aparments/2PN-70-1m2.optimized.webp",
  "B.06": "/assets/aparments/2PN-70-1m2.optimized.webp",
  "B.07": "/assets/aparments/2PN-70-1m2.optimized.webp", //CHƯA CÓ ẢNH
  "B.08": "/assets/aparments/A08.optimized.webp", //CHƯA CÓ ẢNH — tạm dùng 3PN A.08 (~92 m²); trước gán nhầm ảnh Duplex
  "B.09": "/assets/aparments/B09.optimized.webp",
  "B.10": "/assets/aparments/2PN-70-1m2.optimized.webp",
  "B.11": "/assets/aparments/2PN-70-1m2.optimized.webp",
  "B.12": "/assets/aparments/B12.optimized.webp",
  "B.12A": "/assets/aparments/B12A.optimized.webp",
  "B.12B": "/assets/aparments/B-DUPLEX.optimized.webp",
  "B.15": "/assets/aparments/B15.optimized.webp",
  "B.16": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "B.17": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "B.18": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "B.19": "/assets/aparments/2PN-70-4m2.optimized.webp",
  "B.20": "/assets/aparments/2PN-70-4m2.optimized.webp",
};

export const UNIT_FLOOR_LAYOUT_IMAGES = {
  "A.18": {
    1: "/assets/aparments/A18-1ST.optimized.webp",
    2: "/assets/aparments/A18-2ND.optimized.webp",
  },
};

/** Căn chưa có bản vẽ riêng: đang hiển thị layout của căn cùng loại/diện tích gần nhất → ghi chú "layout tham khảo". */
export const PENDING_LAYOUT_UNITS = new Set(["A.03A", "A.10", "A.12B", "A.16", "B.07", "B.08"]);
