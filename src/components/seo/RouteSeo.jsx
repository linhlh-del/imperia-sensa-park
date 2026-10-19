// src/components/seo/RouteSeo.jsx
// Cập nhật <title>, meta, canonical, Open Graph, JSON-LD theo route hiện tại.
// Không render gì ra giao diện -> KHÔNG thay đổi nội dung hiển thị của website.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NEWS_DATA from "../../data/newsData.js";
import {
  HOME_SEO,
  LOGO_URL,
  SITE_NAME,
  SITE_URL,
  applySeo,
  toAbsoluteUrl,
} from "../../lib/seo";

const toIso = (date) => (date ? `${date}T08:00:00+07:00` : undefined);

function breadcrumb(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: toAbsoluteUrl(path),
    })),
  };
}

const publisher = {
  "@type": "Organization",
  name: SITE_NAME,
  logo: { "@type": "ImageObject", url: LOGO_URL },
};

export default function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

    if (path === "/") {
      applySeo({ ...HOME_SEO, path: "/", isHome: true });
      return;
    }

    if (path === "/tin-tuc") {
      const sorted = [...NEWS_DATA].sort(
        (a, b) => new Date(b.published_at) - new Date(a.published_at),
      );
      applySeo({
        title: `Tin tức & sự kiện ${SITE_NAME} | MIK Group`,
        description:
          "Theo dõi các thông báo mới nhất, tiến độ xây dựng và sự kiện nổi bật của dự án Imperia Sensa Park do MIK Group phát triển tại Khu Đông TP.HCM.",
        path,
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${toAbsoluteUrl(path)}#page`,
              url: toAbsoluteUrl(path),
              name: `Tin tức & sự kiện ${SITE_NAME}`,
              inLanguage: "vi-VN",
              isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: sorted.map((a, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: toAbsoluteUrl(`/tin-tuc/${a.id}`),
                  name: a.title,
                })),
              },
            },
            breadcrumb([
              ["Trang chủ", "/"],
              ["Tin tức", "/tin-tuc"],
            ]),
          ],
        },
      });
      return;
    }

    const match = path.match(/^\/tin-tuc\/([^/]+)$/);
    if (match) {
      const article = NEWS_DATA.find((a) => a.id === match[1]);
      if (!article) {
        applySeo({
          title: `Không tìm thấy bài viết | ${SITE_NAME}`,
          description: "Đường dẫn không hợp lệ hoặc bài viết đã bị gỡ.",
          path,
          noindex: true,
        });
        return;
      }
      const url = toAbsoluteUrl(path);
      const images = [
        article.banner_url || article.image_url,
        ...article.content.filter((b) => b.type === "img").map((b) => b.src),
      ].filter(Boolean);

      applySeo({
        title: `${article.title} | ${SITE_NAME}`,
        description: article.excerpt,
        path,
        image: article.image_url,
        type: "article",
        publishedTime: toIso(article.published_at),
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "NewsArticle",
              "@id": `${url}#article`,
              mainEntityOfPage: { "@type": "WebPage", "@id": url },
              headline: article.title.slice(0, 110),
              description: article.excerpt,
              image: [...new Set(images)].slice(0, 5),
              datePublished: toIso(article.published_at),
              dateModified: toIso(article.published_at),
              inLanguage: "vi-VN",
              articleSection: article.tag,
              keywords: (article.tags || []).join(", "),
              author: publisher,
              publisher,
            },
            breadcrumb([
              ["Trang chủ", "/"],
              ["Tin tức", "/tin-tuc"],
              [article.title, path],
            ]),
          ],
        },
      });
    }
  }, [pathname]);

  return null;
}
