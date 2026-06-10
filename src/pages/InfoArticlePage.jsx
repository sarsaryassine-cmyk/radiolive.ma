import { Link, useParams } from 'react-router-dom';
import Seo, { breadcrumbJsonLd, newsArticleJsonLd } from '../components/Seo.jsx';
import RichText from '../components/RichText.jsx';
import ArticleMedia from '../components/info/ArticleMedia.jsx';
import NewsCard from '../components/info/NewsCard.jsx';
import useI18n from '../i18n/useI18n.js';
import { getArticle, getByCategory, categoryLabel, localizeArticle, slugForLang } from '../info/articles.js';

const SITE_URL = 'https://radiolive.ma';

const fmtDate = (date, lang) =>
  new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

export default function InfoArticlePage() {
  const { lang } = useI18n();
  const { slug } = useParams();
  const isAr = lang === 'ar';
  const arPrefix = isAr ? '/ar' : '';
  const infoHref = `${arPrefix}/info`;

  const raw = getArticle(slug);

  if (!raw) {
    return (
      <article className="pt-10 pb-16 max-w-3xl mx-auto text-center">
        <Seo lang={lang} noindex title={isAr ? 'مقال غير موجود' : 'Article introuvable'} />
        <h1 className="font-display text-2xl font-bold mb-3">
          {isAr ? 'لم يتم العثور على المقال' : 'Article introuvable'}
        </h1>
        <Link to={infoHref} className="text-[#FF6B7A] hover:underline">
          {isAr ? '→ العودة إلى الأخبار' : "← Retour à l'actualité"}
        </Link>
      </article>
    );
  }

  const a = localizeArticle(raw, lang);
  const related = getByCategory(raw.category).filter((x) => x.slug !== raw.slug).slice(0, 3);

  const frHref = `${SITE_URL}/info/${raw.slug}`;
  const arHref = `${SITE_URL}/ar/info/${raw.slug_ar || raw.slug}`;
  const canonical = `${SITE_URL}${arPrefix}/info/${slugForLang(raw, lang)}`;

  return (
    <article className="pt-6 sm:pt-10 pb-16 max-w-3xl mx-auto">
      <Seo
        lang={lang}
        type="article"
        title={`${a.title} | Radio Maroc`}
        description={a.excerpt}
        canonical={canonical}
        alternates={[
          { hreflang: 'fr-MA', href: frHref },
          { hreflang: 'ar-MA', href: arHref },
          { hreflang: 'x-default', href: frHref },
        ]}
        jsonLd={[
          newsArticleJsonLd(raw, lang),
          breadcrumbJsonLd([
            { name: isAr ? 'الرئيسية' : 'Accueil', url: isAr ? '/ar' : '/' },
            { name: isAr ? 'الأخبار' : 'Actualités', url: infoHref },
            { name: a.title },
          ]),
        ]}
      />

      <Link to={infoHref} className="text-sm text-white/60 hover:text-white">
        {isAr ? '→ العودة إلى الأخبار' : "← Retour à l'actualité"}
      </Link>

      <div className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-white/50">
        <span className="rounded-full bg-[#FF2A3C] px-2.5 py-1 font-semibold text-white">
          {categoryLabel(raw.category, lang)}
        </span>
        <time dateTime={raw.date}>{fmtDate(raw.date, lang)}</time>
        <span>·</span>
        <span>{a.author}</span>
        <span>·</span>
        <span>{raw.readingTime} {isAr ? 'دقائق' : 'min'}</span>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-bold mt-4 mb-6 text-balance">{a.title}</h1>

      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl mb-8">
        <ArticleMedia article={raw} lang={lang} eager />
      </div>

      <div className="text-[15px]">
        <RichText blocks={a.body} />
      </div>

      {raw.sources?.length > 0 && (
        <section className="mt-10 border-t border-white/10 pt-6">
          <h2 className="font-display text-lg font-bold mb-3 text-white/90">
            {isAr ? 'المصادر' : 'Sources'}
          </h2>
          <ul className="space-y-2">
            {raw.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#FF6B7A] hover:underline"
                >
                  {(isAr && s.label_ar) ? s.label_ar : s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold mb-5">
            <span className="gradient-text">{isAr ? 'اقرأ أيضاً' : 'À lire aussi'}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((r) => <NewsCard key={r.slug} article={r} lang={lang} />)}
          </div>
        </section>
      )}
    </article>
  );
}
