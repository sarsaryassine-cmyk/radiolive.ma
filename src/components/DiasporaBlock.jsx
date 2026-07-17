import { Link } from 'react-router-dom';
import { Globe2 } from 'lucide-react';
import { DIASPORA_COUNTRIES, DIASPORA_KEYS } from '../data/diaspora.js';
import useI18n from '../i18n/useI18n.js';

/**
 * Country shortcuts shown on the home page (FR + AR).
 *
 * Each card links to the matching diaspora landing — FR (/radio-maroc-france)
 * on the French home, AR (/ar/min-faransa) on the Arabic home — each carrying
 * ~500 words of unique, country-targeted SEO copy plus a featured grid of
 * stations. Surfaces the diaspora hub right after the live stations grid where
 * MRE visitors are most likely to look, and — côté maillage — donne à chaque
 * page diaspora un lien entrant depuis l'accueil (sinon orphelines).
 */
export default function DiasporaBlock() {
  const { lang } = useI18n();
  const isAr = lang === 'ar';

  return (
    <section className="mt-12 sm:mt-16">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl glass-strong flex items-center justify-center">
          <Globe2 className="h-5 w-5 text-brand-300" />
        </div>
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold">
            {isAr ? 'للجالية المغربية في الخارج' : 'Pour la diaspora marocaine (MRE)'}
          </h2>
          <p className="text-xs text-white/55 mt-0.5">
            {isAr
              ? 'استمع إلى الإذاعات المغربية من بلدك'
              : 'Écoutez les radios du Maroc en direct depuis votre pays'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {DIASPORA_KEYS.map((key) => {
          const c = DIASPORA_COUNTRIES[key];
          const to = isAr ? c.ar_path : c.fr_path;
          const label = isAr ? c.ar_country : c.fr_country;
          return (
            <Link
              key={key}
              to={to}
              className="glass rounded-2xl p-4 text-center hover:bg-white/8 hover:scale-[1.02] transition-all"
            >
              <p className="text-sm font-semibold text-white">
                {label}
              </p>
              <p className="text-[11px] sm:text-[10px] text-white/45 mt-1 truncate">
                {to}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
