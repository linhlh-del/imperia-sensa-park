/* ============================================================
   CHÍNH SÁCH BÁN HÀNG — phương thức thanh toán Imperia Sensa Park.
   Nguồn: bảng "Phương thức thanh toán" của chủ đầu tư (public/assets/csbh-sensa-park.jpg).
   Mỗi mốc: label (tên mốc) · amount + unit (số tiền / tỉ lệ) · when (thời điểm, vd. Q.I/27) ·
   between (khoảng cách tới mốc kế tiếp) · bank (ngân hàng giải ngân) · group (cụm mốc gộp, vd. "Mỗi đợt 5%").
   ============================================================ */
export const salesPolicy = {
  label: "Chính sách bán hàng Imperia Sensa Park",
  lead: "5 phương thức thanh toán linh hoạt: vay hỗ trợ lãi suất 24 tháng hoặc thanh toán nhanh với chiết khấu đến 14%.",
  highlight: { prefix: "Chiết khấu", value: "14", unit: "%", note: "Thanh toán nhanh 95%" },
  image: "/assets/csbh-sensa-park.jpg",
  glossary: "TTKQ: thỏa thuận ký quỹ · HĐMB: hợp đồng mua bán · NHGN: ngân hàng giải ngân · VTC: vốn tự có · GCN: giấy chứng nhận · HTLS: hỗ trợ lãi suất.",
  disclaimer: "Chính sách áp dụng tại thời điểm công bố. Mốc thời gian là dự kiến; điều kiện & điều khoản áp dụng theo hồ sơ của chủ đầu tư.",
  methods: [
    {
      id: "vay",
      tab: "Thanh toán vay",
      title: "Thanh toán vay — HTLS 24 tháng",
      badges: ["HTLS 24 tháng", "Chiết khấu 1,5%"],
      note: "Chiết khấu 1,5% áp dụng cho căn 2PN trở lên.",
      milestones: [
        { label: "Booking", amount: "100", unit: "tr", between: "10 ngày" },
        { label: "TTKQ", amount: "10", unit: "%", between: "6 tháng" },
        { label: "HĐMB", amount: "10", unit: "%", when: "Q.I/27", between: "1 tháng" },
        { label: "NHGN", amount: "70", unit: "%", bank: true },
        { label: "Bàn giao (VTC)", amount: "5", unit: "%", when: "Q.IV/28" },
        { label: "GCN", amount: "5", unit: "%" },
      ],
    },
    {
      id: "chuan",
      tab: "Thanh toán chuẩn",
      title: "Thanh toán chuẩn",
      badges: ["Chiết khấu 5%"],
      milestones: [
        { label: "Booking", amount: "100", unit: "tr", between: "10 ngày" },
        { label: "TTKQ", amount: "10", unit: "%", between: "6 tháng" },
        { label: "HĐMB", amount: "10", unit: "%", when: "Q.I/27", between: "3 tháng" },
        { label: "5 đợt", amount: "5", unit: "%/đợt", group: "Mỗi đợt 5% · cách nhau 3 tháng" },
        { label: "Bàn giao", amount: "50", unit: "%", when: "Q.IV/28" },
        { label: "GCN", amount: "5", unit: "%" },
      ],
    },
    {
      id: "nhanh-70",
      tab: "Nhanh 70%",
      title: "Thanh toán nhanh 70%",
      badges: ["Chiết khấu 11%"],
      milestones: [
        { label: "Booking", amount: "100", unit: "tr", between: "10 ngày" },
        { label: "TTKQ", amount: "10", unit: "%", between: "6 tháng" },
        { label: "HĐMB", amount: "10", unit: "%", when: "Q.I/27", between: "1 tháng" },
        { label: "Đợt 3", amount: "50", unit: "%" },
        { label: "Bàn giao", amount: "25", unit: "%", when: "Q.IV/28" },
        { label: "GCN", amount: "5", unit: "%" },
      ],
    },
    {
      id: "nhanh-95",
      tab: "Nhanh 95%",
      title: "Thanh toán nhanh 95%",
      badges: ["Chiết khấu 14%"],
      milestones: [
        { label: "Booking", amount: "100", unit: "tr", between: "10 ngày" },
        { label: "TTKQ", amount: "10", unit: "%", between: "6 tháng" },
        { label: "HĐMB", amount: "10", unit: "%", when: "Q.I/27", between: "1 tháng" },
        { label: "Đợt 3", amount: "75", unit: "%" },
        { label: "Bàn giao", when: "Q.IV/28" },
        { label: "GCN", amount: "5", unit: "%" },
      ],
    },
    {
      id: "vay-dac-biet",
      tab: "Vay đặc biệt",
      title: "Thanh toán vay đặc biệt — HTLS 24 tháng",
      badges: ["HTLS 24 tháng", "Căn 2PN trở lên"],
      note: "HĐMB: mở sổ tiết kiệm tại ngân hàng số Cake by VPBank. (*) VTC 5% đã khấu trừ từ sổ tiết kiệm đáo hạn.",
      milestones: [
        { label: "Booking", amount: "100", unit: "tr", between: "10 ngày" },
        { label: "TTKQ", amount: "10", unit: "%", between: "6 tháng" },
        { label: "HĐMB", amount: "10", unit: "%", when: "Q.I/27", between: "1 tháng", sub: "Sổ tiết kiệm Cake" },
        { label: "NHGN", amount: "55", unit: "%", bank: true },
        { label: "Bàn giao", amount: "15% + 5%*", unit: "", when: "Q.IV/28", sub: "NHGN + VTC" },
        { label: "GCN", amount: "5", unit: "%" },
      ],
    },
  ],
};
