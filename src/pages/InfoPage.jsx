import { useEffect, useMemo, useState } from 'react';
import Seo, { breadcrumbJsonLd, webPageJsonLd } from '../components/Seo.jsx';
import useI18n from '../i18n/useI18n.js';
import { useAppContext } from '../AppContext.jsx';
import InfoHero from '../components/info/InfoHero.jsx';
import CategoryFilter from '../components/info/CategoryFilter.jsx';
import FeaturedArticle from '../components/info/FeaturedArticle.jsx';
import ThemedSection from '../components/info/ThemedSection.jsx';
import NewsCard from '../components/info/NewsCard.jsx';
import InfoSidebar from '../components/info/InfoSidebar.jsx';
import {
  CATEGORIES, categoryLabel, localizeArticle,
  getRecent, getFeatured, getByCategory, getPopular, getAllTags,
} from '../info/articles.js';

const SITE_URL = 'https://radiolive.ma';
const PAGE = 6;

export default function InfoPage() {
  const { lang } = useI18n();
  const { radios = [] } = useAppContext();
  const isAr = lang === 'ar';
  const arPrefix = isAr ? '/ar' : '';

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [visible, setVisible] = useState(PAGE);

  // Reset la pagination quand le filtre ou la recherche change.
  useEffect(() => { setVisible(PAGE); }, [query, activeCategory]);

  const all = useMemo(() => getRecent(), []);
  const isDefault = activeCategory === 'all' && !query.trim();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((a) => {
      if (activeCategory !== 'all' && a.category !== activeCategory) return false;
      if (!q) return true;
      const loc = localizeArticle(a, lang);
      const hay = `${loc.title} ${loc.excerpt} ${(a.tags || []).join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [all, activeCategory, query, lang]);

  const featured = isDefault ? getFeatured() : null;
  const grid = featured ? filtered.filter((a) => a.slug !== featured.slug) : filtered;
  const shown = grid.slice(0, visible);

  const pillItems = [
    { key: 'all', label: isAr ? 'الكل' : 'Tous' },
    ...CATEGORIES.map((c) => ({ key: c.key, label: categoryLabel(c.key, lang) })),
  ];

  return (
    <div className="pb-16 max-w-6xl mx-auto px-1">
      <Seo
        lang={lang}
        title={isAr
          ? 'أخبار إذاعات المغرب | رياضة وموسيقى وإذاعة مباشرة'
          : 'Actualités Radio Maroc | Infos Sport, Musique et Radio en Direct'}
        description={isAr
          ? 'تابع آخر الأخبار والمستجدات الرياضية والاتجاهات الموسيقية وجديد الإذاعة على radiolive.ma.'
          : "Suivez les dernières actualités, informations sportives, tendances musicales et nouveautés radio sur Radiolive.ma."}
        canonical={`${SITE_URL}${arPrefix}/info`}
        alternates={[
          { hreflang: 'fr-MA', href: `${SITE_URL}/info` },
          { hreflang: 'ar-MA', href: `${SITE_URL}/ar/info` },
          { hreflang: 'x-default', href: `${SITE_URL}/info` },
        ]}
        jsonLd={[
          webPageJsonLd({
            name: isAr ? 'الأخبار' : 'Actualités',
            description: isAr ? 'أخبار رياضة وموسيقى وإذاعة' : 'Actualités sport, musique et radio',
            url: `${SITE_URL}${arPrefix}/info`,
            lang,
          }),
          breadcrumbJsonLd([
            { name: isAr ? 'الرئيسية' : 'Accueil', url: isAr ? '/ar' : '/' },
            { name: isAr ? 'الأخبار' : 'Actualités' },
          ]),
        ]}
      />

      <InfoHero lang={lang} query={query} onQuery={setQuery} />

      <div className="mb-8">
        <CategoryFilter items={pillItems} active={activeCategory} onChange={setActiveCategory} />
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <main className="lg:col-span-8">
          {featured && <FeaturedArticle article={featured} lang={lang} />}

          <section className="mt-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
              <span className="gradient-text">{isAr ? 'آخر الأخبار' : 'Dernières actualités'}</span>
            </h2>

            {shown.length === 0 ? (
              <p className="text-white/60">{isAr ? 'لا توجد نتائج.' : 'Aucun résultat.'}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {shown.map((a) => <NewsCard key={a.slug} article={a} lang={lang} />)}
              </div>
            )}

            {visible < grid.length && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE)}
                  className="rounded-full glass px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  {isAr ? 'تحميل المزيد' : 'Charger plus'}
                </button>
              </div>
            )}
          </section>

          {/* Sections thématiques — uniquement en vue par défaut (pas en recherche/filtre) */}
          {isDefault && (
            <>
              <ThemedSection
                title={isAr ? 'رياضة اللحظة' : 'Sport du moment'}
                articles={getByCategory('sport', 3)}
                lang={lang}
              />
              <ThemedSection
                title={isAr ? 'اتجاهات موسيقية' : 'Tendances musicales'}
                articles={getByCategory('musique', 3)}
                lang={lang}
              />
              <ThemedSection
                title={isAr ? 'عالم الإذاعة' : 'Univers Radio'}
                articles={getByCategory('radio', 3)}
                lang={lang}
              />
            </>
          )}
        </main>

        <div className="mt-12 lg:mt-0 lg:col-span-4">
          <InfoSidebar
            lang={lang}
            popular={getPopular(5)}
            recent={getRecent(5)}
            tags={getAllTags(10)}
            radios={radios}
            activeCategory={activeCategory}
            onCategory={setActiveCategory}
          />
        </div>
      </div>
    </div>
  );
}
