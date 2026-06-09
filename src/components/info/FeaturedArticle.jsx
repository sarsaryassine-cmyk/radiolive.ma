import { Link } from 'react-router-dom';
import ArticleMedia from './ArticleMedia.jsx';
import { categoryLabel, slugForLang, localizeArticle } from '../../info/articles.js';

const fmtDate = (date, lang) =>
  new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

/** Bloc « À la une » — grand article hero, image large + overlay éditorial. */
export default function FeaturedArticle({ article, lang = 'fr' }) {
  if (!article) return null;
  const isAr = lang === 'ar';
  const a = localizeArticle(article, lang);
  const href = `${isAr ? '/ar' : ''}/info/${slugForLang(article, lang)}`;

  return (
    <Link
      to={href}
      className="group relative block overflow-hidden rounded-3xl glass min-h-[20rem] sm:min-h-[24rem]"
    >
      <div className="absolute inset-0">
        <ArticleMedia article={article} lang={lang} eager />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-transparent" />
      </div>

      <div className="relative flex h-full flex-col justify-end p-6 sm:p-9">
        <div className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-wider text-white/70">
          <span className="rounded-full bg-[#FF2A3C] px-2.5 py-1 font-semibold text-white">
            {categoryLabel(article.category, lang)}
          </span>
          <time dateTime={article.date}>{fmtDate(article.date, lang)}</time>
          <span>·</span>
          <span>{article.readingTime} {isAr ? 'دقائق' : 'min'}</span>
        </div>

        <h2 className="font-display text-2xl sm:text-4xl font-bold text-white text-balance max-w-3xl group-hover:text-[#FF6B7A] transition-colors">
          {a.title}
        </h2>
        <p className="mt-3 max-w-2xl text-white/75 text-sm sm:text-base line-clamp-2">
          {a.excerpt}
        </p>
      </div>
    </Link>
  );
}
