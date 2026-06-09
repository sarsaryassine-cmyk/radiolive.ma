import { categoryLabel, categoryAccent } from '../../info/articles.js';

/**
 * Visuel d'un article : image si disponible, sinon placeholder dégradé coloré
 * par catégorie (évite toute image manquante / cassée). `eager` pour le hero.
 */
export default function ArticleMedia({ article, lang = 'fr', eager = false }) {
  // ALT descriptif : champ dédié si fourni, sinon le titre (localisé).
  const alt = lang === 'ar'
    ? article.imageAlt_ar || article.title_ar || article.title
    : article.imageAlt || article.title;

  if (article.image) {
    return (
      <img
        src={article.image}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  const [from, to] = categoryAccent(article.category);
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      <span className="font-display font-bold uppercase tracking-[0.2em] text-white/90 text-sm">
        {categoryLabel(article.category, lang)}
      </span>
    </div>
  );
}
