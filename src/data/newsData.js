// src/data/newsData.js
//
// ⚠️ MOCK DATA — chưa có database / CMS thật.
// Cấu trúc mỗi item được thiết kế giống hệt shape mà API thật sẽ trả về
// (xem README-NEWS-MODULE.md), để khi backend xong chỉ cần thay phần
// fetchNewsList() trong newsService.js, KHÔNG cần sửa bất kỳ component nào.
//
// Ảnh dùng placehold.co (đúng bảng màu imperia) để không phụ thuộc asset
// thật — thay bằng ảnh dự án khi có nội dung chính thức.

const ph = (label, bg = "4D5538", fg = "F5F1EB") =>
  `https://placehold.co/1200x750/${bg}/${fg}?font=roboto&text=${encodeURIComponent(
    label,
  )}`;

const NEWS_DATA = [
  {
    id: "mik-group-khai-truong-house-of-mik-mien-nam",
    title:
      "MIK Group khai trương House of MIK, đánh dấu bước phát triển mới tại miền Nam",
    excerpt:
      "MIK Group ra mắt House of MIK, không gian thương hiệu kết hợp Sales Gallery tại trung tâm TP.HCM, đánh dấu bước tiến mới trong chiến lược mở rộng hiện diện và phát triển lâu dài tại miền Nam.",
    tag: "Tin tức",
    published_at: "2026-10-03",
    image_url:
      "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/1a0HFBeFpbciOQO.webp",
    tags: ["Tin tức", "MIK Group", "Imperia Sensa Park"],
    content: [
      {
        type: "p",
        text: "MIK Group vừa ra mắt House of MIK - không gian thương hiệu kết hợp Sales Gallery tại khu vực phía Nam, đánh dấu bước tiến mới trong hành trình mở rộng hiện diện trên toàn quốc và khẳng định định hướng phát triển lâu dài của tập đoàn tại miền Nam.",
      },
      {
        type: "p",
        text: "Sau hơn một thập kỷ phát triển, MIK Group giới thiệu House of MIK như một điểm chạm - nơi khách hàng và đối tác có thể khám phá toàn diện hơn về tập đoàn, hệ thống dự án và hành trình kiến tạo những không gian sống chất lượng, cộng đồng thịnh vượng.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/1a0HFBeFpbciOQO.webp",
        caption:
          "Lễ khai trương House of MIK tại tầng 25 tòa nhà Riverfront Financial Centre, số 3A 3B Tôn Đức Thắng, phường Sài Gòn, TP.HCM (Ảnh: MIK Group).",
      },

      {
        type: "p",
        text: "Tên gọi House of MIK thể hiện tinh thần đó. “House” gợi cảm giác gần gũi, thân thuộc, đồng thời liên tưởng đến “nhà” và đời sống - những giá trị cốt lõi trong lĩnh vực MIK Group phát triển. Đây cũng là điểm đến mang dấu ấn riêng của thương hiệu, đồng hành cùng các hoạt động quan trọng của tập đoàn tại miền Nam trong thời gian tới.",
      },
      {
        type: "p",
        text: "Tọa lạc ngay trung tâm TP.HCM, House of MIK sở hữu tầm nhìn bao quát khu vực trung tâm thành phố và sông Sài Gòn. Không gian được tổ chức theo tinh thần gần gũi, cởi mở nhưng vẫn đảm bảo sự riêng tư và chỉn chu, gồm các khu vực tiếp đón, tư vấn, trưng bày và lounge, đáp ứng nhu cầu tìm hiểu thông tin, trao đổi và gặp gỡ của khách hàng, đối tác.",
      },
      {
        type: "p",
        text: "Tại House of MIK, khách hàng không chỉ tìm hiểu về từng dự án mà còn có thể cảm nhận cách thương hiệu tiếp cận bất động sản, từ chất lượng không gian, trải nghiệm đến những giá trị sống mà MIK theo đuổi. Việc đưa House of MIK vào hoạt động thể hiện sự đầu tư bài bản của MIK Group trong việc nâng cao chất lượng các điểm chạm thương hiệu và xây dựng không gian phù hợp với định hướng phát triển dài hạn tại miền Nam.",
      },
      {
        type: "p",
        text: "Phát biểu tại sự kiện, ông Nhân Hữu Học, Tổng giám đốc MIK Miền Nam, chia sẻ: “Miền Nam là một thị trường quan trọng trong chiến lược phát triển dài hạn của MIK Group. Với House of MIK, chúng tôi mong muốn tạo nên một không gian để khách hàng và đối tác có thể hiểu rõ hơn về cách MIK phát triển dự án, những giá trị chúng tôi theo đuổi và những chuẩn mực mà MIK muốn tiếp tục kiến tạo tại thị trường này. Những kinh nghiệm đã tích lũy trong nhiều năm qua sẽ là nền tảng để MIK Group bước vào giai đoạn tiếp theo tại miền Nam với những yêu cầu ngày càng cao hơn về chất lượng và trải nghiệm”.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/XxFGMTLFFFmU81a.webp",
        caption:
          "Ông Nhân Hữu Học, Tổng giám đốc MIK Miền Nam, phát biểu tại sự kiện (Ảnh: MIK Group).",
      },
      {
        type: "p",
        text: "Dịp này, MIK Group cũng giới thiệu triển lãm và trải nghiệm với chủ đề “Living in Motion by the South - Sống động một miền Nam”, lấy cảm hứng từ những dòng nước góp phần định hình vùng đất phương Nam. Chương trình dẫn dắt khách tham quan qua câu chuyện về vùng đất, con người và những dấu ấn MIK Group đã tạo dựng trong hơn một thập kỷ.",
      },
      {
        type: "p",
        text: "Mở đầu hành trình là tác phẩm sắp đặt “Sống động một miền Nam” do đội ngũ nghệ sĩ trẻ ENOD thực hiện, với hình tượng con thuyền làm ngôn ngữ tạo hình chủ đạo. Gợi nhắc nếp sống gắn với sông nước, tác phẩm khắc họa một dòng chảy không ngừng, nơi phù sa, con người và văn hóa cùng hội tụ, tạo nên bản sắc của miền Nam.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/Crh1zOqsa3jTa61.webp",
        caption:
          "Tác phẩm sắp đặt “Sống động một miền Nam” tại lối vào House of MIK (Ảnh: MIK Group).",
      },
      {
        type: "p",
        text: "Tiếp nối là “Living in Motion by the South” - khu vực tương tác nơi thiên nhiên, đô thị và con người cùng hiện diện trong những chuyển động theo thời gian thực. Hình ảnh của khách tham quan trở thành một phần của cảnh quan trên màn hình, tạo nên sự giao thoa giữa con người, thiên nhiên và nhịp sống đô thị.",
      },
      {
        type: "p",
        text: "Tại khu vực “MIK in Motion”- các dự án tiêu biểu từ Bắc vào Nam được giới thiệu dưới lăng kính nghệ thuật, phản ánh hành trình MIK Group hoàn thiện tư duy phát triển và tích lũy nội lực qua từng giai đoạn. Các cụm trưng bày được bố trí cùng hệ thống lounge và khu tiếp khách, tạo nên mạch trải nghiệm liền lạc, đồng thời đáp ứng nhu cầu tư vấn và gặp gỡ khách hàng.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/9IfGuWkIEJY26xg.webp",
        caption:
          "Khu MIK in Motion giới thiệu các dự án tiêu biểu của MIK Group trong hành trình phát triển hơn một thập kỷ (Ảnh: MIK Group).",
      },
      {
        type: "p",
        text: "Khép lại mạch trải nghiệm là “Humans of MIK” - nơi hành trình hơn một thập kỷ được nhìn lại qua góc nhìn của cư dân, đối tác và đội ngũ MIK. Những câu chuyện và trải nghiệm thực tế từ các cộng đồng hiện hữu giúp MIK thấy rõ những giá trị đã được vun đắp, đồng thời tiếp nối nền tảng ấy cho chặng đường phát triển mới tại miền Nam.",
      },
      {
        type: "p",
        text: "Trong hành trình tại House of MIK, sa bàn Imperia Sensa Park giúp khách tham quan hình dung dấu ấn phát triển mới của MIK Group tại miền Nam. Là dự án đầu tiên thuộc dòng sản phẩm I series tại thị trường phía Nam, Imperia Sensa Park được định hướng trở thành dự án kiểu mẫu, mở đầu chương phát triển mới với những yêu cầu cao về chất lượng sản phẩm, tiêu chuẩn bàn giao và trải nghiệm sống.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/PwHw2O2P7HAyJVj.webp",
        caption:
          "Sa bàn dự án Imperia Sensa Park tại House of MIK (Ảnh: MIK Group).",
      },
      {
        type: "p",
        text: "Việc đưa House of MIK vào hoạt động đánh dấu một cột mốc quan trọng trong chiến lược của MIK Group tại miền Nam, thể hiện cam kết hiện diện lâu dài và tiếp tục nâng cao các chuẩn mực về sản phẩm, trải nghiệm cho cộng đồng.",
      },
    ],
  },

  {
    id: "chuoi-hon-40-tien-ich-imperia-sensa-park",
    title: "Chuỗi hơn 40 tiện ích trong dự án MIK Group ở khu Đông TP HCM",
    excerpt:
      "Imperia Sensa Park do MIK Group phát triển, quy mô 5 ha với hơn 40 tiện ích chia làm ba nhóm, phục vụ nhu cầu làm việc, vận động, thư giãn, gặp gỡ cho cư dân đô thị.",
    tag: "Tin tức",
    published_at: "2026-09-22",
    image_url:
      "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/cB6Gn6v9oDFy77q.webp",
    tags: ["Tiện ích", "Imperia Sensa Park", "MIK Group"],
    content: [
      {
        type: "p",
        text: "Dự án gồm hai tháp với hơn 900 căn hộ cùng các sản phẩm thấp tầng, nằm trên đường Võ Chí Công. Thay vì lấy số lượng tiện ích làm lợi thế, chủ đầu tư tập trung vào hiệu quả sử dụng. Trong đó mỗi không gian được tính toán về công năng và khả năng tiếp cận, để thuận tiện cho sinh hoạt thường ngày và đáp ứng nhu cầu sử dụng lâu dài của cư dân.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/cB6Gn6v9oDFy77q.webp",
        caption: "Khu vui chơi ngoài trời. Ảnh: MIK Group",
      },
      {
        type: "p",
        text: "Với sự tham gia của studioMilou trong thiết kế kiến trúc, cảnh quan và Ong&Ong trong thiết kế nội thất, hệ tiện ích được phát triển trong một tổng thể thống nhất, từ cách tổ chức không gian, kết nối đến lựa chọn công năng.",
      },
      {
        type: "p",
        text: "Thay vì phân khu dàn trải, các tiện ích tại đây được sắp xếp thành ba nhóm chức năng: Creative Hub (không gian sáng tạo), Vitality Sanctuary (không gian vận động, tái tạo) và Social Club (không gian kết nối).",
      },
      {
        type: "p",
        text: 'Theo chủ đầu tư, cách tổ chức này được xây dựng xoay quanh nhịp sinh hoạt thường nhật của các cư dân, từ nhu cầu làm việc, học tập vào ban ngày, vận động và thư giãn sau giờ làm, đến vui chơi và kết nối giữa các thành viên vào cuối ngày. "Mỗi nhóm tiện ích tuy đảm nhiệm vai trò khác nhau nhưng được liên kết liền mạch, giúp việc trải nghiệm trở nên thuận tiện hơn trong nhịp sống hàng ngày", đại diện MIK Group cho biết.',
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/dd7uL5P3VaDfq9v.webp",
        caption:
          "Phối cảnh không gian làm việc, đọc sách và trao đổi dành cho cư dân. Ảnh: MIK Group",
      },
      {
        type: "p",
        text: "Với Creative Hub, không gian sáng tạo đáp ứng trực tiếp nhu cầu làm việc và học tập. Các hạng mục như Business Lounge, Co-working Space, phòng họp, thư viện và phòng giải trí đa phương tiện giúp cư dân có thêm không gian vừa tập trung vừa thư giãn. Đây cũng là cách dự án thích ứng với những thay đổi trong nhịp sống đô thị, khi ranh giới giữa nơi ở, nơi làm việc và không gian nghỉ ngơi ngày càng linh hoạt hơn.",
      },
      {
        type: "p",
        text: 'Nhóm Vitality Sanctuary được thiết kế như không gian tái tạo năng lượng, hướng tới nhu cầu chăm sóc sức khỏe của cư dân, với phòng gym, yoga, sân thể thao đa năng Vibe Court, hồ bơi Aura Flow, đường dạo Green Walk và phòng xông hơi đá muối Himalaya. Việc tích hợp chuỗi tiện ích về thể chất ngay "dưới thềm nhà" giúp cư dân duy trì thói quen rèn luyện hàng ngày, không mất thời gian di chuyển ra bên ngoài.',
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/MbsllpVlVaYq6R5.webp",
        caption: "Cụm hồ bơi Aura Flow và bể sục Jacuzzi. Ảnh: MIK Group",
      },
      {
        type: "p",
        text: "Trong khi đó, Social Club tập trung vào không gian sinh hoạt chung và kết nối cộng đồng. Bãi cỏ đa năng, khu BBQ ngoài trời, sân chơi trẻ em, Pavilion hay Sunset Deck được xây dựng đan xen giữa các khu vực trong nhà và ngoài trời, đảm bảo các hoạt động gia đình không bị phụ thuộc vào điều kiện thời tiết.",
      },
      {
        type: "p",
        text: "Trong quá trình lên ý tưởng dự án, chủ đầu tư nhìn nhận hệ tiện ích chỉ thực sự phát huy giá trị khi được cư dân sử dụng thường xuyên. Do đó, tại Imperia Sensa Park, thay vì cư dân phải chủ động tìm đến từng khu chức năng riêng biệt, cảnh quan và tiện ích được sắp xếp kết nối với hành trình di chuyển hàng ngày. Sau giờ làm việc tại khu co-working, cư dân có thể xuống phòng tập hoặc đi bộ. Trẻ nhỏ vui chơi trong khi cha mẹ dành thời gian thư giãn ở không gian chung. Cuối tuần những khoảng ngoài trời có thể trở thành nơi gặp gỡ của gia đình và bạn bè.",
      },
      {
        type: "p",
        text: '"Bên cạnh vị trí, thiết kế căn hộ hay chất lượng bàn giao, một môi trường sống được tổ chức đồng bộ và thuận tiện có thể góp phần nâng cao trải nghiệm sống trong dài hạn", vị đại diện lý giải.',
      },
      {
        type: "p",
        text: "Imperia Sensa Park là sản phẩm đầu tiên thuộc dòng I Series của MIK Group tại khu Đông TP HCM. Dự án khởi công từ tháng 8/2026, dự kiến bàn giao quý IV/2028.",
      },
    ],
  },
  {
    id: "imperia-sensa-park-discovery-residences",
    title:
      "Imperia Sensa Park mở ra trải nghiệm Discovery Residences tiên phong tại TP.HCM",
    excerpt:
      "Khởi công vào đầu tháng 8 năm 2026, Imperia Sensa Park - dự án mới nhất thuộc dòng sản phẩm I Series (Imperia) - đánh dấu một chương phát triển mới của MIK Group tại thị trường phía Nam.",
    tag: "Tin tức",
    published_at: "2026-09-16",
    image_url:
      "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/G2F5u5oNzcWFoTw.webp",
    tags: ["Imperia Sensa Park", "Discovery Residences", "MIK Group"],
    content: [
      {
        type: "p",
        text: "Đây cũng là lần tiên phong ý tưởng phát triển Discovery Residences được đưa vào một dự án căn hộ mang thương hiệu Imperia, mở ra một không gian sống giàu trải nghiệm dành cho thế hệ trẻ năng động, đề cao gu sống riêng và giá trị sống trọn vẹn.",
      },
      {
        type: "p",
        text: "Tinh thần sống khám phá hiện diện trong từng nhịp sống",
      },
      {
        type: "p",
        text: "Imperia Sensa Park là dự án được nhà phát triển MIK Group dành nhiều tâm huyết để tạo nên một không gian đa tầng tiện ích, đa sắc trải nghiệm. Dự án tọa lạc tại vị trí tâm điểm của Khu Đông trên mặt đường Võ Chí Công kết nối trực tiếp với trục Liên Phường, bao bọc bởi 2 mặt sông, đồng thời bố trí các dải đệm mặt nước cùng nhiều cảnh quan xanh thiên nhiên.",
      },
      {
        type: "p",
        text: "Tại Imperia Sensa Park, Discovery Residences được thiết kế để truyền cảm hứng khám phá bản thân và tận hưởng cuộc sống. Mỗi cá nhân có thể dễ dàng cảm nhận từng nhịp chuyển động êm ái qua cấu trúc không gian tách lớp thông minh: từ nhịp sống đô thị sôi động, tới sự thư thái và mát lành của không gian nội khu, cho tới trạng thái riêng tư bên trong căn hộ.",
      },
      {
        type: "p",
        text: "Imperia Sensa Park còn sở hữu hệ tiện ích đa dạng và tinh tế, được MIK Group cẩn trọng lựa chọn để mang đến những trải nghiệm kết nối sâu sắc cùng nhịp điệu cân bằng cho từng cá nhân.",
      },
      {
        type: "p",
        text: "Đó có thể là một buổi sáng đầy hứng khởi khi sáng tạo nội dung video tại Creative Studio, hay cùng nhau chia sẻ những ý tưởng mới tại khu vực Co-working Space. Cư dân cũng có thể tận hưởng những giờ phút chăm dưỡng thân – tâm, tái tạo năng lượng qua các hoạt động thể thao, hay trải nghiệm trị liệu tại phòng xông hơi đá muối Himalaya sau một ngày dài làm việc. Đặc biệt, cư dân tại Imperia Sensa Park cũng có thể cùng với bạn bè và gia đình thân yêu cùng nhau trò chuyện tại sàn ngắm hoàng hôn Sunset Deck, vườn BBQ ngoài trời hay đường dạo cảnh quan Green Walk.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/G2F5u5oNzcWFoTw.webp",
        caption:
          "Không gian phòng xông đá muối Himalaya, nơi thư giãn thân – tâm sau ngày dài làm việc.",
      },
      {
        type: "p",
        text: "Trải nghiệm trong không gian sống tinh tế đậm chất cá nhân",
      },
      {
        type: "p",
        text: "Căn hộ chính là khoảng không gian trân quý nhất của mỗi cá nhân, khi Discovery Residences lan tỏa và đồng điệu trong từng thiết kế tinh tế. Imperia Sensa Park mang tới những căn hộ vuông vức với hệ cửa kính kịch trần lớn, ưu tiên ánh sáng tự nhiên cùng gió trời, cùng tầm nhìn khoáng đạt.",
      },
      {
        type: "p",
        text: "Cách tổ chức này giúp phòng khách, phòng ngủ và các khu vực chức năng trở nên linh hoạt hơn, phù hợp với nhiều trạng thái sinh hoạt khác nhau trong ngày. Đó có thể là một khoảng yên tĩnh để nghỉ ngơi sau giờ làm việc, một góc đọc sách bên cửa sổ hay một không gian được chủ nhân tự do biến đổi theo sở thích cá nhân. Discovery Residences vì thế không chỉ nằm ở những tiện ích bên ngoài, mà còn được tiếp nối ngay trong chính căn nhà của mỗi người.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/91Diw4NWGTZ9cSs.webp",
        caption:
          "Không gian căn hộ dành riêng cho những trải nghiệm cá nhân tại Imperia Sensa Park, ưu tiên ánh sáng và lưu thông gió tự nhiên.",
      },
      {
        type: "p",
        text: "Để hiện thực hóa định hướng này, MIK Group hợp tác cùng nhiều đối tác quốc tế uy tín và giàu kinh nghiệm. Tư duy kiến trúc và cảnh quan của studioMilou kết hợp cùng thiết kế nội thất từ ONG&ONG tạo nên một tổng thể không gian đồng điệu, đánh thức cảm quan ngay từ những bước chân khởi đầu. Trong khi đó, tổng thầu Ricons và đơn vị tư vấn giám sát CORE chuyển hóa các ý tưởng thiết kế thành chất lượng công trình thực tế, từ vật liệu, hoàn thiện đến tiêu chuẩn thi công.",
      },
      {
        type: "p",
        text: "Từng mảnh ghép tại Imperia Sensa Park hòa quyện hài hòa để truyền cảm hứng cho hành trình khám phá cuộc sống đậm chất riêng của mỗi cá nhân. Kinh nghiệm phát triển cùng sự thấu hiểu khí hậu, nhịp sống và bản sắc địa phương được chuyển hoá thành những cải tiến trong bộ sản phẩm Discovery Residences. Đây chính là bước đi chiến lược của MIK Group tại thị trường phía Nam, khẳng định tầm nhìn cùng tâm huyết không ngừng nghỉ trong việc nâng tầm những giá trị sống thực và trải nghiệm cho khách hàng.",
      },
    ],
  },
  {
    id: "imperia-sensa-park-thiet-ke-can-ho-theo-tinh-than-kham-pha",
    title: "Imperia Sensa Park thiết kế căn hộ theo tinh thần khám phá",
    excerpt:
      'MIK Group cung cấp hơn 900 căn hộ tại Imperia Sensa Park với không gian sống linh hoạt, nhiều trải nghiệm, hướng đến cư dân trẻ, theo tinh thần "Discovery Residences".',
    tag: "Tin tức",
    published_at: "2026-09-16",
    image_url:
      "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/ES6bMqpXWgDJ44u.webp",
    tags: ["Imperia Sensa Park", "Discovery Residences", "MIK Group"],
    content: [
      {
        type: "p",
        text: "Khởi công đầu tháng 8, Imperia Sensa Park quy mô 5 ha, gồm hai tháp với hơn 900 căn hộ cùng các sản phẩm thấp tầng. Dự án tọa lạc trên đường Võ Chí Công, kết nối với Liên Phường, đánh dấu chiến lược mở rộng của MIK Group tại khu vực TP HCM. Khu căn hộ này được quy hoạch với mật độ xây dựng 28%, dành phần lớn diện tích cho mảng xanh và không gian mở, hài hòa với thiên nhiên.",
      },
      {
        type: "p",
        text: "Theo MIK Group, tinh thần Discovery Residences (không gian sống khám phá) được phát triển bằng cách tổ chức không gian thành nhiều lớp, từ khu vực kết nối với nhịp sống đô thị, không gian nội khu yên tĩnh đến không gian riêng tư bên trong căn hộ. Cách tổ chức này nhằm tạo sự chuyển tiếp giữa các khu vực sinh hoạt, phục vụ nhiều nhu cầu sử dụng khác nhau.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/ES6bMqpXWgDJ44u.webp",
        caption:
          "Không gian Creative Studio tại Imperia Sensa Park dành cho các hoạt động sáng tạo nội dung như podcast, livestream của giới trẻ. Ảnh: MIK Group",
      },
      {
        type: "p",
        text: "Imperia Sensa Park sở hữu hệ tiện ích đa dạng được MIK Group lựa chọn để mang đến những trải nghiệm kết nối, cân bằng cho mỗi cư dân.",
      },
      {
        type: "p",
        text: "Chẳng hạn, cư dân có thể khởi đầu buổi sáng bằng cách sáng tạo nội dung video tại Creative Studio, chia sẻ những ý tưởng mới tại khu vực Co-working Space. Cư dân cũng có thể tái tạo năng lượng qua các hoạt động thể thao, hay trải nghiệm trị liệu tại phòng xông hơi đá muối Himalaya sau một ngày làm việc. Các khu vực khác như ngắm hoàng hôn tại Sunset Deck, vườn BBQ ngoài trời hay đường dạo cảnh quan Green Walk.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/wRLUvBrJy0tBZWd.webp",
        caption: "Không gian phòng xông đá muối Himalaya. Ảnh: MIK Group",
      },
      {
        type: "p",
        text: "Với từng căn hộ, thiết kế cũng góp phần thể hiện tinh thần khám phá. Imperia Sensa Park mang tới những căn hộ vuông vức với hệ cửa kính kịch trần lớn, ưu tiên ánh sáng tự nhiên cùng gió trời, cùng tầm nhìn khoáng đạt.",
      },
      {
        type: "p",
        text: "Cách tổ chức này giúp phòng khách, phòng ngủ và các khu vực chức năng trở nên linh hoạt hơn, phù hợp với nhiều trạng thái sinh hoạt khác nhau trong ngày. Đó có thể là một khoảng yên tĩnh để nghỉ ngơi sau giờ làm việc, góc đọc sách bên cửa sổ hay một không gian được chủ nhân tùy biến theo sở thích.",
      },
      {
        type: "p",
        text: "Để hiện thực hóa định hướng này, MIK Group hợp tác cùng nhiều đối tác quốc tế. Tư duy kiến trúc và cảnh quan của studioMilou kết hợp cùng thiết kế nội thất từ Ong&Ong tạo nên một tổng thể không gian đồng điệu. Trong khi đó, tổng thầu Ricons và đơn vị tư vấn giám sát Core chuyển hóa các ý tưởng thiết kế thành công trình thực tế, từ vật liệu, hoàn thiện đến tiêu chuẩn thi công.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/XVChiTNgJ5JuhgH.webp",
        caption:
          "Không gian căn hộ ưu tiên ánh sáng và lưu thông gió tự nhiên. Ảnh: MIK Group",
      },
      {
        type: "p",
        text: "Theo MIK Group, từng cấu phần tại dự án đều phục vụ cho mục tiêu truyền cảm hứng khám phá cuộc sống. Đây cũng là chiến lược của đơn vị tại thị trường phía Nam, hướng đến nâng cấp những giá trị sống thực và trải nghiệm cho khách hàng.",
      },
    ],
  },
  {
    id: "chien-luoc-mo-rong-mik-group-tai-phia-nam",
    title: "Chiến lược mở rộng của MIK Group tại phía Nam",
    excerpt:
      "MIK Group ra mắt Imperia Sensa Park quy mô 1.000 sản phẩm, đánh dấu bước mở rộng tại thị trường miền Nam sau hơn 10 năm.",
    tag: "Tin tức",
    published_at: "2026-08-19",
    image_url:
      "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/Tux3yyfH9YoxwEg.webp",
    tags: ["MIK Group", "Imperia Sensa Park", "Thị trường bất động sản"],
    content: [
      {
        type: "p",
        text: "Giai đoạn 2012-2014, MIK Group bắt đầu hành trình phát triển tại phía Nam với các dự án thấp tầng như Park Riverside, Villa Park, River Park và Rio Vista. Từ 2014, đơn vị chuyển hướng ra phía Bắc, lựa chọn Hà Nội để phát triển dòng căn hộ cao tầng với khoảng 20.000 sản phẩm.",
      },
      {
        type: "p",
        text: "Năm 2026, chủ đầu tư khởi công đô thị cao cấp Imperia Sensa Park ngày 6/8 tại TP HCM, đánh dấu bước mở đầu cho giai đoạn đẩy mạnh hiện diện tại khu vực phía Nam.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/Tux3yyfH9YoxwEg.webp",
        caption:
          "Phối cảnh sảnh đón thương mại tại dự án Imperia Sensa Park. Ảnh: MIK Group",
      },
      {
        type: "p",
        text: "Tọa lạc trên mặt tiền đường Võ Chí Công, tiếp giáp sông Rạch Chiếc và kết nối trực tiếp với trục Liên Phường, Imperia Sensa Park nằm giữa khu vực đang chuyển mình về hạ tầng và đô thị. Từ dự án, cư dân có thể kết nối tới Vành đai 2, cao tốc TP HCM - Long Thành - Dầu Giây cùng hệ thống tiện ích hiện hữu đang được mở rộng. Trong khi đó, cảnh quan sông nước tạo nên khoảng lùi cho đời sống.",
      },
      {
        type: "p",
        text: "Trên quy mô gần 5 ha, dự án gồm hai tòa tháp với 922 căn hộ cao cấp cùng 93 căn biệt thự và nhà phố thấp tầng. Với mật độ xây dựng 30,5%, phần lớn diện tích được dành cho cảnh quan, mặt nước, không gian mở và hệ tiện ích nội khu. Đây cũng là cách Imperia Sensa Park tiếp nối bốn yếu tố cốt lõi của dòng sản phẩm I Series gồm quy hoạch, thiết kế, môi trường sống và tiện ích, cùng được tổ chức trong một tổng thể đồng bộ.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/cEnxtKn4E2eRAeB.webp",
        caption: "Phối cảnh hồ bơi tại dự án. Ảnh: MIK Group",
      },
      {
        type: "p",
        text: "Từ Imperia Sensa Park, MIK Group cho biết đang chuẩn bị những kế hoạch phát triển tại Cần Giờ và Hóc Môn, từng bước mở rộng hiện diện tại phía Nam theo cách phù hợp với tiềm năng và bản sắc riêng của từng vùng đất. Tính chung toàn thị trường hai miền, đơn vị dự kiến triển khai hơn 250.000 sản phẩm với khoảng 30 dự án trọng điểm từ nay đến 2035.",
      },
      {
        type: "p",
        text: "Các dự án trong tương lai tại khu vực phía Nam thừa hưởng năng lực triển khai, tiêu chuẩn được đơn vị tích lũy quy hơn một thập kỷ hoạt động tại miền Bắc.",
      },
      {
        type: "p",
        text: "Trong đó, MIK Group đã xây dựng được hệ sinh thái sản phẩm nhiều phân khúc với các dòng M, I, K Series. Từ những dự án hạng sang như The Matrix One Premium, The Magnolia Private Residences tới dòng căn hộ cao cấp như The Parkland, Imperia Sky Park hay các khu đô thị mang thương hiệu Forestia, mỗi sản phẩm có cách phát triển riêng nhưng cùng hướng tới chất lượng và trải nghiệm sống nhất quán.",
      },
      {
        type: "p",
        text: 'Đơn vị cho biết các tiêu chuẩn sống đều được xây dựng từ những yêu cầu chung đó, xuyên suốt từ quy hoạch, thiết kế, môi trường sống đến tiện ích. "Các tiêu chuẩn được triển khai đồng bộ, đồng thời có sự linh hoạt để phù hợp với từng dòng sản phẩm và từng địa phương nơi dự án hiện diện", đại diện cho hay.',
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/ZRJq6uvZjbPrTOt.webp",
        caption: "The Matrix One tại khu vực phía Tây Hà Nội. Ảnh: MIK Group",
      },
      {
        type: "p",
        text: "Bên cạnh triển khai những dự án quy mô lớn, doanh nghiệp cũng chú trọng hiệu quả trong từng sản phẩm thông qua việc chọn lọc, bắt tay những tên tuổi quốc tế. Trong đó, Gensler, Turner và Coen tham gia cùng MIK Group ở các khâu từ quy hoạch, kiến trúc, thiết kế đến quản lý xây dựng, góp phần đưa những tiêu chuẩn quốc tế vào quá trình hình thành và hoàn thiện sản phẩm.",
      },
      {
        type: "p",
        text: 'MIK Group cho biết những giá trị đã được kiểm chứng tại phía Bắc sẽ tiếp tục được hoàn thiện trong chặng phát triển tiếp theo. "Tại phía Nam, nơi ghi dấu những dự án đầu tiên, chúng tôi sẽ tăng cường hiện diện với những sản phẩm kế thừa hệ tiêu chuẩn đồng bộ, xuyên suốt, hướng tới những không gian sống có chất lượng và giá trị lâu dài cho cộng đồng", đại diện này nói thêm.',
      },
    ],
  },
  {
    id: "mik-group-khoi-cong-du-an-imperia-sensa-park",
    title: "MIK Group khởi công dự án Imperia Sensa Park",
    excerpt:
      "MIK Group khởi công dự án Imperia Sensa Park quy mô 5 ha, gần 1.000 căn hộ cùng sản phẩm thấp tầng, nằm trên trục Võ Chí Công, kết nối trực tiếp với đường Liên Phường.",
    tag: "Tin tức",
    published_at: "2026-08-06",
    image_url:
      "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/DpXOpVTwNjHzRnW.webp",
    tags: [
      "MIK Group",
      "Imperia Sensa Park",
      "Khởi công dự án",
      "Bất động sản TP HCM",
    ],
    content: [
      {
        type: "p",
        text: "Sở hữu hai mặt giáp sông Rạch Chiếc và kênh Một Tấn với quy mô lên tới 5 ha, Imperia Sensa Park bao gồm hai tòa tháp cao tầng với 922 căn hộ cao cấp, cùng 93 căn biệt thự và nhà phố thấp tầng. Dự án được quy hoạch với mật độ xây dựng 30,5%, dành phần lớn diện tích cho mảng xanh và không gian mở, hài hòa với thiên nhiên.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/DpXOpVTwNjHzRnW.webp",
        caption: "Nghi thức khởi công dự án Imperia Sensa Park. Ảnh: MIK Group",
      },
      {
        type: "p",
        text: "Theo MIK Group, khu Đông TP HCM đang trở thành cực tăng trưởng mới của thị trường bất động sản với hạ tầng giao thông đồng bộ. Do đó, Imperia Sensa Park được đánh giá là dự án trọng điểm, hiện diện tại lõi đô thị hiện hữu, đánh dấu một chương mới trong hành trình phát triển của MIK Group tại miền Nam. Khu căn hộ tọa lạc tại tâm điểm kết nối các trục giao thông chiến lược như cao tốc Long Thành - Dầu Giây, hệ thống đường Vành đai 2 cùng các trục đường Liên Phường và Võ Chí Công.",
      },
      {
        type: "p",
        text: "Trong cấu trúc sản phẩm cao tầng của MIK Group, I Series là dòng căn hộ cao cấp, tập trung vào bốn yếu tố gồm quy hoạch, thiết kế, môi trường sống và tiện ích được tổ chức đồng bộ và cân bằng. Tại Imperia Sensa Park, những giá trị cốt lõi và hệ tiêu chuẩn này tiếp tục được kế thừa, phát triển với những cải tiến phù hợp hơn với điều kiện khí hậu, nhịp sống đô thị và bản sắc của mảnh đất, con người TP HCM.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/Ff0uLJMt6Jg4H3u.webp",
        caption: "Phối cảnh không gian tại dự án. Ảnh: MIK Group",
      },
      {
        type: "p",
        text: 'Phát biểu tại sự kiện, ông Nhân Hữu Học, Tổng giám đốc MIK Miền Nam, cho biết năm 2026 đánh dấu bước chuyển mình chiến lược của tập đoàn tại thị trường phía Nam. Đơn vị hướng tới các dự án trọng điểm tại các khu vực có hạ tầng phát triển, nhu cầu thực và giàu dư địa tăng trưởng. "Imperia Sensa Park là nền tảng đầu tiên trong chiến lược dài hạn nhằm đồng hành cùng quá trình phát triển không gian đô thị và nâng cao chuẩn mực sống tại TP HCM trong giai đoạn phát triển mới", ông Học cho hay.',
      },
      {
        type: "p",
        text: "Cũng tại lễ khởi công, nhà phát triển bất động sản đã công bố những đối tác quốc tế đồng hành dự án: Tổng thầu xây dựng Ricons từng thành công với dự án The Matrix One và Imperia Smart City tại Hà Nội; StudioMilou từ Singapore là đối tác thiết kế kiến trúc và cảnh quan, ghi dấu với dự án Bảo tàng quốc gia Singapore hay Bảo tàng Đà Nẵng; Ong&Ong từ Singapore là đối tác thiết kế nội thất với nhiều dự án ghi dấu ấn tại châu Á; và CORE Asia đảm nhiệm công tác tư vấn giám sát dự án.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/WE0mODx9oobfvHQ.webp",
        caption: "Phối cảnh hồ bơi tại dự án. Ảnh: MIK Group",
      },
      {
        type: "p",
        text: "Phát biểu tại lễ khởi công, ông Trần Quang Quân, Chủ tịch Hội đồng chiến lược, Công ty cổ phần xây dựng Ricons, cho biết đơn vị đánh giá cao cơ hội được đồng hành trong vai trò tổng thầu xây dựng dự án Imperia Sensa Park. Qua nhiều năm hợp tác, hai bên đã cùng triển khai thành công nhiều dự án với hàng nghìn căn hộ chất lượng cao.",
      },
      {
        type: "p",
        text: '"Với kinh nghiệm cùng sự phối hợp chặt chẽ giữa các bên, tôi tin tưởng Imperia Sensa Park sẽ trở thành một dấu ấn mới, tiếp nối hành trình phát triển của MIK Group tại thị trường miền Nam", ông Quân nói.',
      },
      {
        type: "p",
        text: "MIK Group là nhà phát triển bất động sản với tổng quỹ đất đầu tư 10.000 ha, trong đó có hơn 20.000 căn hộ đã bàn giao, phục vụ hơn 30.000 khách hàng. Kể từ năm 2014, doanh nghiệp đã ghi dấu ấn tại khu Đông TP HCM qua các dự án Park Riverside, Villa Park, Riovista và khu nghỉ dưỡng Sol by Meliá, Movenpick Resort Waverly tại Phú Quốc.",
      },
      {
        type: "img",
        src: "https://media.sachicloud.io.vn/store/1080/uploads/2026/10/hT3wep7eeQUsjgJ.webp",
        caption: "Ông Nhân Hữu Học phát biểu tại sự kiện. Ảnh: MIK Group",
      },
      {
        type: "p",
        text: "Nền tảng kinh nghiệm và sự thấu hiểu địa phương này tạo tiền đề để MIK Group giới thiệu Imperia Sensa Park thuộc dòng Imperia (I Series). Dự án dự kiến ra mắt thị trường vào tháng 9/2026 và bàn giao căn hộ vào quý IV/2028.",
      },
      {
        type: "p",
        text: "Bên cạnh Imperia Sensa Park, I Series còn các dự án Imperia Signature Cổ Loa, Imperia Smart City, Imperia Sky Garden.",
      },
    ],
  },
];

export default NEWS_DATA;
