import { Link } from 'react-router-dom';
import NewsCard from './NewsCard.jsx';

/**
 * Section thématique titrée (Sport du moment, Tendances musicales, Univers
 * Radio…) : titre + grille de cartes. `viewAll` = lien optionnel « voir tout ».
 */
export default function ThemedSection({ title, articles = [], lang = 'fr', viewAll }) {
  if (!articles.length) return null;
  return (
    <section className="mt-14">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl sm:text-3xl font-bold">
          <span className="gradient-text">{title}</span>
        </h2>
        {viewAll && (
          <Link to={viewAll.href} className="text-sm text-white/55 hover:text-white shrink-0">
            {viewAll.label}
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((a) => <NewsCard key={a.slug} article={a} lang={lang} />)}
      </div>
    </section>
  );
}
