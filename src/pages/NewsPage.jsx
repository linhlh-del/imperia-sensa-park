// src/pages/NewsPage.jsx
//
// Trang danh sách đầy đủ "/tin-tuc" — hero + bài nổi bật + 2 bài điểm nhấn
// + lưới toàn bộ bài viết còn lại. Tailwind, bảng màu imperia-*.

import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  fetchNewsList,
  getFeatured,
  getHighlights,
  getHref,
  formatDate,
} from "../services/newsService";
import { useEffect, useState } from "react";

function StateShell({ children }) {
  return (
    <div className="min-h-screen bg-imperia-cream">
      <Header />
      <main className="container-page section-y">{children}</main>
      <Footer />
    </div>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchNewsList()
      .then((data) => !cancelled && setArticles(data))
      .catch((err) => {
        console.error("Lỗi tải danh sách tin tức:", err);
        if (!cancelled)
          setFetchError(
            "Không tải được danh sách tin tức. Vui lòng thử lại sau.",
          );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!articles && !fetchError) {
    return (
      <StateShell>
        <p className="text-center text-imperia-black/60">Đang tải tin tức...</p>
      </StateShell>
    );
  }
  if (fetchError) {
    return (
      <StateShell>
        <p className="text-center text-imperia-secondary-dark">{fetchError}</p>
      </StateShell>
    );
  }
  if (articles.length === 0) {
    return (
      <StateShell>
        <p className="text-center text-imperia-black/60">
          Chưa có bài viết nào.
        </p>
      </StateShell>
    );
  }

  const featured = getFeatured(articles);
  const highlights = getHighlights(articles, featured.id, 2);
  const grid = articles.filter((item) => item.id !== featured.id);

  return (
    <div className="min-h-screen bg-imperia-cream">
      <Header />

      {/* Hero */}
      <section className="bg-imperia-primary py-16 text-center text-white md:py-20">
        <div className="container-page">
          <span className="eyebrow justify-center text-imperia-accent before:bg-imperia-accent">
            Cập nhật dự án
          </span>
          <h1 className="section-title section-title-light">
            Tin tức &amp; sự kiện
          </h1>
          <p className="section-subtitle section-subtitle-light mx-auto text-center">
            Theo dõi các thông báo mới nhất, tiến độ xây dựng và sự kiện nổi bật
            của dự án.
          </p>
        </div>
      </section>

      {/* Featured + highlights */}
      <section className="container-page section-y">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <article className="overflow-hidden rounded-[24px] border border-imperia-primary/10 bg-white shadow-soft">
            <Link
              to={getHref(featured.id)}
              className="block h-72 overflow-hidden md:h-96"
            >
              <img
                src={featured.image_url}
                alt={featured.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </Link>
            <div className="p-7 md:p-9">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-imperia-secondary">
                <span className="rounded-full bg-imperia-accent/30 px-3 py-1 text-imperia-primary">
                  {featured.tag}
                </span>
                <span>{formatDate(featured.published_at)}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold text-imperia-primary md:text-3xl">
                <Link
                  to={getHref(featured.id)}
                  className="hover:text-imperia-secondary"
                >
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-3 text-imperia-black/70">{featured.excerpt}</p>
              <Link
                to={getHref(featured.id)}
                className="btn-base btn-primary mt-6 w-fit"
              >
                Đọc bài viết
              </Link>
            </div>
          </article>

          <div className="flex flex-col gap-6">
            {highlights.map((item) => (
              <article
                key={item.id}
                className="rounded-[20px] border border-imperia-primary/10 bg-white p-6 shadow-soft"
              >
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-imperia-secondary">
                  <span className="rounded-full bg-imperia-accent/30 px-2.5 py-0.5 text-imperia-primary">
                    {item.tag}
                  </span>
                  <span>{formatDate(item.published_at)}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-imperia-primary">
                  <Link
                    to={getHref(item.id)}
                    className="hover:text-imperia-secondary"
                  >
                    {item.title}
                  </Link>
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container-page pb-24">
        <p className="eyebrow justify-center before:hidden">Tất cả bài viết</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-[22px] border border-imperia-primary/10 bg-white shadow-soft"
            >
              <Link
                to={getHref(item.id)}
                className="block h-48 overflow-hidden"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-imperia-secondary">
                  <span className="rounded-full bg-imperia-accent/30 px-2.5 py-0.5 text-imperia-primary">
                    {item.tag}
                  </span>
                  <span>{formatDate(item.published_at)}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-imperia-primary">
                  <Link
                    to={getHref(item.id)}
                    className="hover:text-imperia-secondary"
                  >
                    {item.title}
                  </Link>
                </h3>
                {item.excerpt && (
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-imperia-black/70">
                    {item.excerpt}
                  </p>
                )}
                <Link
                  to={getHref(item.id)}
                  className="mt-4 inline-block text-sm font-bold text-imperia-primary hover:text-imperia-secondary"
                >
                  Xem chi tiết →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
