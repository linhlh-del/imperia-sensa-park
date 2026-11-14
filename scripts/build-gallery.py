"""Tạo ảnh cho section Gallery + Tổng quan từ bộ ảnh gốc của chủ đầu tư (không sửa ảnh gốc). Cần Pillow.

    python scripts/build-gallery.py "C:/Users/REVER-IT/Downloads/IMPERIA SENSA PARK"

- Mỗi ảnh xuất 2 bản WebP giữ NGUYÊN tỉ lệ gốc: 800w và 1600w → public/assets/gallery/<nhóm>/<slug>-<w>.webp
- Ghi src/data/gallery.json: nhóm → danh sách { src, srcSet, w, h, label } (w/h = tỉ lệ thật, thẻ carousel
  co giãn theo tỉ lệ này — xem ParkGallery trong src/components/sections/ParkTemplate.jsx).
- Ảnh trùng (bản có người / có watermark), ảnh nền mờ, ảnh loading, icon menu: không dùng.
"""
import json
import sys
from pathlib import Path

from PIL import Image

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else r"C:/Users/REVER-IT/Downloads/IMPERIA SENSA PARK")
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/assets/gallery"
WIDTHS = [800, 1600]

# (file gốc, slug, nhãn) — thứ tự = thứ tự hiển thị
GROUPS = {
    "ngoai-canh": ("Ngoại cảnh", [
        ("imgi_5_ISP_-_Facade_01-ohTF5gtq.jpg", "phoi-canh-ven-song", "Phối cảnh dự án bên sông Rạch Chiếc"),
        ("imgi_8_ISP_-_Facade_04-BC75WjQQ.jpg", "phoi-canh-tong-the", "Hai tòa tháp Sensa A và Sensa B"),
        ("imgi_6_ISP_-_Facade_02-CZdtHvEl.jpg", "mat-dung-thap", "Mặt đứng tòa tháp"),
        ("imgi_7_ISP_-_Facade_03-DUKdLRI6.jpg", "phoi-canh-tren-cao", "Phối cảnh trên cao"),
        ("imgi_4_goc_topview_tong_du_an-B7XnPpDc.jpg", "goc-top-view", "Góc nhìn toàn khu"),
        ("imgi_35_C09_Final_noWM-1-WM-FA-Bs8mcQCw.jpg", "loi-vao-du-an", "Lối vào dự án"),
        ("imgi_34_C07_Final-1-WM-FA-B27GOm_X.jpg", "san-don-tieu-canh", "Sân đón và tiểu cảnh"),
        ("imgi_9_khoi_de_tm_01-q4DQnfy3.jpg", "khoi-de-thuong-mai-1", "Khối đế thương mại"),
        ("imgi_10_khoi_de_tm_02-rHVAwClb.jpg", "khoi-de-thuong-mai-2", "Khối đế thương mại góc đường"),
        ("imgi_11_1-DXMy188s.jpg", "pho-thuong-mai", "Dãy nhà phố thương mại"),
        ("imgi_12_2-HHMuiHo_.jpg", "nha-pho-ho-boi", "Nhà phố bên hồ bơi"),
        ("imgi_13_3-DO5B9wlG.jpg", "nha-pho-ven-song", "Nhà phố ven sông"),
        ("imgi_38_duong_dao_bo-DF04KwwE.jpg", "duong-dao-bo-song", "Đường dạo bờ sông"),
    ]),
    "tien-ich": ("Tiện ích", [
        ("imgi_28_Swimming_Pool_01-A4GHrlXA.jpg", "ho-boi-1", "Hồ bơi nội khu"),
        ("imgi_29_Swimming_Pool_02-wVn-n0QP.jpg", "ho-boi-2", "Hồ bơi giữa hai tòa tháp"),
        ("imgi_31_Jacuzzi-C24esmX6.jpg", "jacuzzi", "Bể sục Jacuzzi"),
        ("imgi_32_Pool_Lounge-BFrWAcFF.jpg", "pool-lounge", "Pool Lounge"),
        ("imgi_36_ho_boi_thap_tang-C1k2gLv6.jpg", "ho-boi-thap-tang", "Hồ bơi khu thấp tầng"),
        ("imgi_30_ho_boi_tre_em-C3PruXNI.jpg", "ho-boi-tre-em", "Hồ bơi trẻ em"),
        ("imgi_33_Kids_Play_Ground-BMy3yNfm.jpg", "san-choi-tre-em-1", "Sân chơi trẻ em"),
        ("imgi_37_Kids_Play_Ground-CI1ah10K.jpg", "san-choi-tre-em-2", "Sân chơi ngoài trời"),
        ("imgi_16_sanh_cu_dan_pp-DH7bdA2D.jpg", "sanh-cu-dan", "Sảnh cư dân"),
        ("imgi_15_sanh_cu_dan_02-Ck6qd-lk.jpg", "sanh-don-the-sensa", "Sảnh đón The Sensa"),
        ("imgi_17_MP_T1_Lobby_V6-S-DbHjCXXo.jpg", "lobby", "Hành lang sảnh thang máy"),
        ("imgi_18_Business_Lounge-Bm2Wp0fj.jpg", "business-lounge", "Business Lounge"),
        ("imgi_19_Creative_Studio_01--Yo3Lybv.jpg", "creative-studio-1", "Creative Studio"),
        ("imgi_20_Creative_Studio_02-B64w9Etk.jpg", "creative-studio-2", "Creative Studio — góc đọc"),
        ("imgi_23_Entertainment_Room_-_PP-B_zcTZXS.jpg", "entertainment-room", "Phòng giải trí"),
        ("imgi_25_Kids_Room_02-BVC55gfw.jpg", "kids-room-1", "Kids Room"),
        ("imgi_24_Kids_Room_01-B2dKCcMU.jpg", "kids-room-2", "Kids Room — thư viện"),
        ("imgi_26_gym_yoga-CVE8VIT3.jpg", "gym-yoga", "Gym & Yoga"),
        ("imgi_27_Himalaya_Salt_Room-vyPrSUTy.jpg", "himalaya-salt-room", "Phòng muối Himalaya"),
    ]),
    "can-ho": ("Căn hộ mẫu", [
        ("imgi_40_Phong_khach_1_PN_final-BTDUlaFC.webp", "1pn-phong-khach", "1PN — Phòng khách"),
        ("imgi_41_Pmaster_v7-fOh1KQoU.webp", "1pn-phong-ngu", "1PN — Phòng ngủ"),
        ("imgi_42_Ban_cong_v5_fix_landmark-Dp2bwwTF.webp", "1pn-ban-cong", "1PN — Ban công hướng Landmark"),
        ("imgi_43_Phong_khach_2_PN_NO_WTM-CCeDCd3m.webp", "2pn-khong-gian-chung", "2PN — Không gian chung"),
        ("imgi_45_Phong_khach_2PN_2_Final-B6-7gcT7.webp", "2pn-phong-khach", "2PN — Phòng khách"),
        ("imgi_47_Phong_Ngu_2BR-C0OT0V4N.webp", "2pn-phong-ngu-master", "2PN — Phòng ngủ master"),
        ("imgi_48_PHONG_NGU_2_final-DEfnLtPw.webp", "2pn-phong-ngu-2", "2PN — Phòng ngủ 2"),
        ("imgi_49_Ban_cong_2PN_Final-CEDYEUCo.webp", "2pn-ban-cong", "2PN — Ban công"),
        ("imgi_50_260924_MY_PHU_CAN_3PN_PHONG_KHACH_FN-cVJdAtLO.webp", "3pn-phong-khach", "3PN — Phòng khách"),
        ("imgi_51_260924_MY_PHU_CAN_3PN_PHONG_NGU_MASTER_FN-D14PcZ9-.webp", "3pn-phong-ngu-master", "3PN — Phòng ngủ master"),
        ("imgi_52_260924_MY_PHU_CAN_3PN_PHONG_NGU_NHO_FN-CBhMJqB0.webp", "3pn-phong-tre-em", "3PN — Phòng trẻ em"),
        ("imgi_53_Phong_Lam_Viec-NmMzEtjJ.webp", "3pn-phong-lam-viec", "3PN — Phòng làm việc"),
        ("imgi_55_Phong_khach_Thong_tang_F1_V6_no_wtm-BPmOylEs.webp", "duplex-thong-tang", "Duplex — Phòng khách thông tầng"),
        ("imgi_54_Phong_khach_Duplex_F1_V5-0BOb_OCQ.webp", "duplex-phong-khach", "Duplex — Phòng khách"),
        ("imgi_56_Phong_Ngu_F1_V7_k_logo-x2L52mL9.webp", "duplex-phong-ngu", "Duplex — Phòng ngủ"),
        ("imgi_57_Cambancong_Duplex_v6_no_wtm-C3AsrqYo.webp", "duplex-ban-cong", "Duplex — Ban công"),
        ("imgi_58_Khach_v7_no_wtm-CHj-AjeJ.webp", "can-goc-phong-khach", "Căn góc — Phòng khách"),
        ("imgi_59_Ngu_v7_no_wtm-EE5GLTZk.webp", "can-goc-phong-ngu", "Căn góc — Phòng ngủ"),
        ("imgi_60_Wc_v6_no_WTM-D099NzHx.webp", "phong-tam", "Phòng tắm"),
        ("imgi_61_P_KHACH_01-CqKFsrbD.webp", "studio-phong-khach", "Phòng khách phong cách ấm"),
        ("imgi_63_P_BEP-t-itXxiJ.webp", "bep-an", "Bếp và bàn ăn"),
        ("imgi_64_PNGU-ByiKQki_.webp", "phong-ngu-xanh", "Phòng ngủ tông xanh"),
        ("imgi_65_phong_khach-CHVkF-EH.webp", "phong-khach-view-pho", "Phòng khách hướng phố"),
        ("imgi_66_Phong_ngu-DxNhlizp.webp", "phong-ngu-view-pho", "Phòng ngủ hướng phố"),
    ]),
}


def main():
    data = {}
    for key, (title, items) in GROUPS.items():
        folder = OUT / key
        folder.mkdir(parents=True, exist_ok=True)
        out_items = []
        for file, slug, label in items:
            with Image.open(SRC / file) as im:
                im = im.convert("RGB")
                w, h = im.size
                for width in WIDTHS:
                    target = folder / f"{slug}-{width}.webp"
                    if not target.exists():
                        im.resize((width, round(h * width / w)), Image.Resampling.LANCZOS).save(target, quality=80, method=6)
            base = f"/assets/gallery/{key}/{slug}"
            out_items.append({
                "src": f"{base}-1600.webp",
                "srcSet": f"{base}-800.webp 800w, {base}-1600.webp 1600w",
                "w": 1600, "h": round(h * 1600 / w), "label": label,
            })
            print(key, slug, w, h)
        data[key] = {"title": title, "items": out_items}
    (ROOT / "src/data/gallery.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
