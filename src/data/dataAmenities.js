export const FILTERS = [
  { key: "canhquan", label: "Cảnh quan" },
  { key: "tienich", label: "Tiện ích" },
];

export const GALLERY_ITEMS = [
  ...Array.from({ length: 5 }, (_, index) => ({
    category: "canhquan",
    src: `/assets/amenities/canhquan/${index + 1}.optimized.webp`,
    alt: `Cảnh quan Imperia Sensa Park - Hình ảnh ${index + 1}`,
    label: `Cảnh quan xanh và thư giãn ${index + 1}`,
  })),
  ...[
    "Business Lounge.webp",
    "Bể sục Jacuzzi.webp",
    "C19_Final_WM.webp",
    "Creative Studio 01.webp",
    "Creative Studio 02.webp",
    "Creative Studio 03.webp",
    "Drop Off.webp",
    "Gym 01.webp",
    "Himalaya Salt Room.webp",
    "Hồ Bơi Aura Flow.webp",
    "Hồ Bơi Trẻ Em.webp",
    "Joy Yard.webp",
    "MP_T1_Lobby_V6-S.webp",
    "Phòng Giải Trí Đa Phương Tiện.webp",
    "Phòng Khách.webp",
    "Sảnh Thang Máy.webp",
    "Wonder Club 01.webp",
    "Đường Dạo Ven Hồ.webp",
  ].map((filename) => {
    const label = filename.replace(/\.webp$/i, "");
    return {
      category: "tienich",
      src: `/assets/amenities/tienich/${encodeURIComponent(filename.replace(/\.webp$/i, ".optimized.webp"))}`,
      alt: `${label} - Tiện ích Imperia Sensa Park`,
      label,
    };
  }),
];
