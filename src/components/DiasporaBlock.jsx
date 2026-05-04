import { Link } from 'react-router-dom';
import { Globe2 } from 'lucide-react';
import { DIASPORA_COUNTRIES, DIASPORA_KEYS } from '../data/diaspora.js';
import useI18n from '../i18n/useI18n.js';

/**
 * Country shortcuts shown only on the Arabic home page.
 *
 * Each card links to the AR diaspora landing (e.g. /ar/min-faransa) which
 * contains ~500 words of unique, country-targeted SEO copy plus a featured
 * grid of stations. Surfaces the diaspora hub right after the live
 * stations grid where MRE visitors are most likely to look.
 */
export default function DiasporaBlock() {
  const { lang } = useI18n();
  if (lang !== 'ar') return null;

  return (
    <section className="mt-12 sm:mt-16">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl glass-strong flex items-center justify-center">
          <Globe2 className="h-5 w-5 text-brand-300" />
        </div>
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold">
            للجالية المغربية في الخارج
          </h2>
          <p className="text-xs text-white/55 mt-0.5">
            استمع إلى الإذاعات المغربية من بلدك
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {DIASPORA_KEYS.map((key) => {
          const c = DIASPORA_COUNTRIES[key];
          return (
            <Link
              key={key}
              to={c.ar_path}
              className="glass rounded-2xl p-4 text-center hover:bg-white/8 hover:scale-[1.02] transition-all"
            >
              <p className="text-sm font-semibold text-white">
                {c.ar_country}
              </p>
              <p className="text-[11px] sm:text-[10px] text-white/45 mt-1 truncate">
                {c.ar_path}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
