// src/pages/NewsDetailPage.jsx
//
// Trang chi tiết "/tin-tuc/:articleId" — banner, nội dung bài viết, sidebar
// điểm nổi bật, bài viết liên quan. Tailwind, bảng màu imperia-*.

import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  fetchNewsList,
  getHref,
  getBannerSrc,
  getHighlights,
  getRelated,
  formatDate,
} from "../services/newsService";

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-imperia-cream">
      <Header />
      <main className="container-page section-y">{children}</main>
      <Footer />
    </div>
  );
}

export default function NewsDetailPage() {
  const { articleId } = useParams();
  const [articles, setArticles] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchNewsList()
      .then((data) => !cancelled && setArticles(data))
      .catch((err) => {
        console.error("Lỗi tải bài viết:", err);
        if (!cancelled)
          setFetchError("Không tải được bài viết. Vui lòng thử lại.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [articleId]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* clipboard không khả dụng — vẫn báo đã copy để không chặn UI */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleFacebookShare = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener",
    );
  }, []);

  if (!articles && !fetchError) {
    return (
      <Shell>
        <p className="text-center text-imperia-black/60">
          Đang tải bài viết...
        </p>
      </Shell>
    );
  }
  if (fetchError) {
    return (
      <Shell>
        <p className="text-center text-imperia-secondary-dark">{fetchError}</p>
      </Shell>
    );
  }

  const article = articles.find((a) => a.id === articleId);
  if (!article) {
    return (
      <Shell>
        <div className="text-center">
          <h1 className="section-title">Không tìm thấy bài viết</h1>
          <p className="section-subtitle mx-auto text-center">
            Đường dẫn không hợp lệ hoặc bài viết đã bị gỡ.
          </p>
          <Link to="/tin-tuc" className="btn-base btn-primary mt-6">
            Quay lại Tin tức
          </Link>
        </div>
      </Shell>
    );
  }

  const content =
    article.content && article.content.length > 0
      ? article.content
      : [{ type: "p", text: article.excerpt }];
  const tags =
    article.tags && article.tags.length ? article.tags : [article.tag];
  const highlights = getHighlights(articles, article.id, 2);
  const related = getRelated(articles, article.id, 3);

  return (
    <div className="min-h-screen bg-imperia-cream">
      <Header />

      {/* Banner — KHÔNG dùng `relative` ở đây: position khác static sẽ tự
          động vẽ đè lên các phần tử static phía sau trong cùng stacking
          context, dù DOM order có sau đi nữa. */}
      <div className="h-64 w-full overflow-hidden bg-imperia-primary md:h-96">
        <img
          src={getBannerSrc(article)}
          alt={article.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="container-page relative z-10">
        <div className="-mt-16 mb-16 rounded-[24px] border border-imperia-primary/10 bg-white p-6 shadow-card md:-mt-20 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[auto_1fr_320px]">
            {/* Share */}
            <div className="flex gap-3 lg:flex-col">
              <button
                type="button"
                onClick={handleFacebookShare}
                aria-label="Chia sẻ lên Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-imperia-primary/25 text-imperia-primary transition hover:bg-imperia-primary hover:text-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M19.6161 17.341L19.9947 14.8503H17.6289V13.2343C17.6289 12.5527 17.9595 11.8882 19.0187 11.8882H20.0961V9.76765C20.0961 9.76765 19.1179 9.59912 18.1846 9.59912C16.2358 9.59912 14.9622 10.7917 14.9622 12.9517V14.8503H12.7969V17.341H14.9633V23.3613C15.8462 23.5019 16.7459 23.5019 17.6289 23.3613V17.341H19.6161Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                aria-label="Sao chép liên kết"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-imperia-primary/25 text-imperia-primary transition hover:bg-imperia-primary hover:text-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5.53 12.92a3.31 3.31 0 01-4.58-.05 3.31 3.31 0 010-4.58l2.55-2.55a3.31 3.31 0 014.3-.35.63.63 0 11-.79 1 2.06 2.06 0 00-2.66.2L1.8 9.1a2.06 2.06 0 002.9 2.9l2.42-2.42a.63.63 0 11.9.9L5.53 12.9z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              {copied && (
                <span className="self-center text-[11px] font-bold text-imperia-primary lg:self-start">
                  Đã copy link
                </span>
              )}
            </div>

            {/* Article */}
            <article>
              <div className="border-b border-imperia-primary/10 pb-8">
                <Link
                  to="/tin-tuc"
                  className="inline-block rounded-full bg-imperia-accent/30 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-imperia-primary"
                >
                  {article.tag}
                </Link>
                <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-imperia-primary md:text-4xl">
                  {article.title}
                </h1>
                <p className="mt-3 text-sm text-imperia-black/50">
                  {formatDate(article.published_at)}
                </p>
              </div>

              <div className="mt-8 space-y-6 text-[17px] leading-relaxed text-imperia-black/80">
                {content.map((block, i) => {
                  if (block.type === "h2") {
                    return (
                      <h2
                        key={block.id || i}
                        id={block.id}
                        className="pt-4 font-display text-2xl font-semibold text-imperia-primary"
                      >
                        {block.text}
                      </h2>
                    );
                  }
                  if (block.type === "img") {
                    return (
                      <figure key={i} className="my-8">
                        <div className="overflow-hidden rounded-[18px] border border-imperia-primary/10">
                          <img
                            src={block.src}
                            alt={block.caption || ""}
                            loading="lazy"
                            className="w-full object-cover"
                          />
                        </div>
                        {block.caption && (
                          <figcaption className="mt-2 text-sm italic text-imperia-black/50">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }
                  if (block.type === "source") {
                    return (
                      <p
                        key={i}
                        className="text-right text-sm italic text-imperia-black/50"
                      >
                        {block.text}
                      </p>
                    );
                  }
                  return <p key={i}>{block.text}</p>;
                })}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-imperia-primary">
                  Tags:
                </span>
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-imperia-primary/20 px-3 py-1 text-xs text-imperia-black/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>

            {/* Sidebar */}
            <aside>
              <p className="mb-5 text-xs font-bold uppercase tracking-widest text-imperia-secondary">
                Điểm nổi bật
              </p>
              <div className="flex flex-col gap-4">
                {highlights.map((h) => (
                  <Link
                    key={h.id}
                    to={getHref(h.id)}
                    className="block rounded-[16px] border border-imperia-primary/10 p-4 transition hover:border-imperia-primary/40"
                  >
                    <div className="font-display text-base font-semibold text-imperia-primary">
                      {h.title}
                    </div>
                    <div className="mt-3 flex justify-between text-[11px] uppercase tracking-wide text-imperia-black/40">
                      <span>{h.tag}</span>
                      <span>{formatDate(h.published_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-imperia-primary/10 bg-white py-16 md:py-20">
          <div className="container-page">
            <div className="mx-auto mb-10 max-w-xl text-center">
              <h3 className="section-title">Bài viết liên quan</h3>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-[20px] border border-imperia-primary/10 bg-imperia-cream"
                >
                  <Link
                    to={getHref(item.id)}
                    className="block h-44 overflow-hidden"
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <h4 className="font-display text-base font-semibold text-imperia-primary">
                      <Link
                        to={getHref(item.id)}
                        className="hover:text-imperia-secondary"
                      >
                        {item.title}
                      </Link>
                    </h4>
                    <div className="mt-auto flex justify-between pt-4 text-[11px] uppercase tracking-wide text-imperia-black/40">
                      <span>{item.tag}</span>
                      <span>{formatDate(item.published_at)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
