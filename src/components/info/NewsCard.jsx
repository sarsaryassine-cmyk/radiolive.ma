import { Link } from 'react-router-dom';
import ArticleMedia from './ArticleMedia.jsx';
import { categoryLabel, slugForLang, localizeArticle } from '../../info/articles.js';

const fmtDate = (date, lang) =>
  new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

/** Carte d'actualité — image/placeholder, catégorie, titre, résumé, date, auteur. */
export default function NewsCard({ article, lang = 'fr' }) {
  const isAr = lang === 'ar';
  const a = localizeArticle(article, lang);
  const href = `${isAr ? '/ar' : ''}/info/${slugForLang(article, lang)}`;

  return (
    <Link
      to={href}
      className="group flex flex-col glass rounded-3xl overflow-hidden hover:bg-white/8 transition-colors"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <ArticleMedia article={article} lang={lang} />
        <span className="absolute top-3 left-3 rounded-full bg-black/55 backdrop-blur px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
          {categoryLabel(article.category, lang)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display font-bold text-lg text-white group-hover:text-[#FF6B7A] transition-colors mb-2 text-balance">
          {a.title}
        </h3>
        <p className="text-sm text-white/65 line-clamp-3 mb-4">{a.excerpt}</p>

        <div className="mt-auto flex items-center gap-2 text-[11px] text-white/45 uppercase tracking-wider">
          <time dateTime={article.date}>{fmtDate(article.date, lang)}</time>
          <span>·</span>
          <span>{a.author}</span>
          <span>·</span>
          <span>{article.readingTime} {isAr ? 'د' : 'min'}</span>
        </div>

        <span className="mt-3 text-sm font-semibold text-[#FF6B7A] group-hover:underline">
          {isAr ? 'اقرأ المزيد ←' : 'Lire →'}
        </span>
      </div>
    </Link>
  );
}
