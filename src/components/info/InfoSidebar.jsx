import { Link } from 'react-router-dom';
import RadioIcon from '../RadioIcon.jsx';
import { CATEGORIES, categoryLabel, slugForLang, localizeArticle } from '../../info/articles.js';

function Widget({ title, children }) {
  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="font-display font-bold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

function ArticleRow({ article, lang }) {
  const isAr = lang === 'ar';
  const a = localizeArticle(article, lang);
  return (
    <Link
      to={`${isAr ? '/ar' : ''}/info/${slugForLang(article, lang)}`}
      className="block py-2 text-sm text-white/70 hover:text-[#FF6B7A] transition-colors border-b border-white/5 last:border-0"
    >
      {a.title}
    </Link>
  );
}

/** Sidebar desktop : populaires, récents, catégories, tags, radios populaires. */
export default function InfoSidebar({ lang = 'fr', popular = [], recent = [], tags = [], radios = [], activeCategory = 'all', onCategory }) {
  const isAr = lang === 'ar';

  return (
    <aside className="space-y-6">
      {popular.length > 0 && (
        <Widget title={isAr ? 'الأكثر قراءة' : 'Articles populaires'}>
          {popular.map((a) => <ArticleRow key={a.slug} article={a} lang={lang} />)}
        </Widget>
      )}

      {recent.length > 0 && (
        <Widget title={isAr ? 'الأحدث' : 'Articles récents'}>
          {recent.map((a) => <ArticleRow key={a.slug} article={a} lang={lang} />)}
        </Widget>
      )}

      <Widget title={isAr ? 'التصنيفات' : 'Catégories'}>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => onCategory?.(c.key)}
              aria-pressed={c.key === activeCategory}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                c.key === activeCategory ? 'bg-[#FF2A3C] text-white' : 'bg-white/5 text-white/65 hover:text-white'
              }`}
            >
              {categoryLabel(c.key, lang)}
            </button>
          ))}
        </div>
      </Widget>

      {tags.length > 0 && (
        <Widget title={isAr ? 'وسوم' : 'Tags'}>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/55">#{t}</span>
            ))}
          </div>
        </Widget>
      )}

      {radios.length > 0 && (
        <Widget title={isAr ? 'إذاعات شائعة' : 'Radios populaires'}>
          <div className="space-y-2">
            {radios.slice(0, 5).map((r) => (
              <Link
                key={r.id}
                to={`${isAr ? '/ar' : ''}/station/${r.id}`}
                className="flex items-center gap-3 group"
              >
                <RadioIcon radio={r} size="sm" />
                <span className="text-sm text-white/75 group-hover:text-[#FF6B7A] transition-colors">{r.name}</span>
              </Link>
            ))}
          </div>
        </Widget>
      )}
    </aside>
  );
}
