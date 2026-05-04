import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe2, ChevronLeft, Radio as RadioIco, Heart } from 'lucide-react';
import Seo, { breadcrumbJsonLd, organizationJsonLd } from '../components/Seo.jsx';
import RadioCard from '../components/RadioCard.jsx';
import { useAppContext } from '../AppContext.jsx';
import useI18n from '../i18n/useI18n.js';
import { DIASPORA_COUNTRIES } from '../data/diaspora.js';

/**
 * Diaspora landing page — country-targeted SEO entry point.
 *
 *   /radio-maroc-france   ↔  /ar/min-faransa
 *   /radio-maroc-belgique ↔  /ar/min-belgika
 *   ...
 *
 * Renders ~500 words of unique copy in the active language, plus a featured
 * grid of the most-listened Moroccan stations. Schema.org WebPage with
 * inLanguage:ar (or fr) and country-targeted hreflang siblings (ar-FR,
 * ar-BE, …) so Google surfaces the right URL per region.
 */
const SITE_URL = 'https://radiolive.ma';
const FEATURED = ['hitradio', 'medi1radio', 'chadafm', 'radiomars', 'mfm', 'medradio', 'radio2m', 'qoranradio'];

export default function DiasporaPage({ countryKey }) {
  const data = DIASPORA_COUNTRIES[countryKey];
  const { radios, audio, playRadio, isFavorite, toggleFavorite } = useAppContext();
  const { t, lang } = useI18n();

  const featured = useMemo(() => {
    if (!radios?.length) return [];
    const map = new Map(radios.map((r) => [r.id, r]));
    return FEATURED.map((id) => map.get(id)).filter(Boolean);
  }, [radios]);

  if (!data) {
    return (
      <div className="mt-16 mx-auto max-w-md text-center glass rounded-3xl p-8">
        <h3 className="font-display text-xl font-semibold mb-2">404</h3>
      </div>
    );
  }

  const isAr = lang === 'ar';
  const title = isAr ? data.ar_title : data.fr_title;
  const description = isAr ? data.ar_description : data.fr_description;
  const h1 = isAr ? data.ar_h1 : data.fr_h1;
  const body = isAr ? data.ar_body : data.fr_body;
  const country = isAr ? data.ar_country : data.fr_country;

  const canonical = `${SITE_URL}${isAr ? data.ar_path : data.fr_path}`;
  const altFr = `${SITE_URL}${data.fr_path}`;
  const altAr = `${SITE_URL}${data.ar_path}`;

  const alternates = [
    { hreflang: 'fr-MA', href: altFr },
    { hreflang: 'ar-MA', href: altAr },
    { hreflang: data.hreflang, href: altAr },
    { hreflang: 'x-default', href: altFr },
  ];

  const homeHref = isAr ? '/ar' : '/';

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: canonical,
    inLanguage: isAr ? 'ar-MA' : 'fr-MA',
    isPartOf: { '@type': 'WebSite', url: SITE_URL, name: isAr ? 'إذاعات المغرب' : 'Radio Maroc' },
    about: {
      '@type': 'Audience',
      audienceType: 'Moroccan diaspora',
      geographicArea: {
        '@type': 'Country',
        name: country,
        identifier: data.countryCode,
      },
    },
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: isAr ? 'الرئيسية' : 'Accueil', url: homeHref },
    { name: country, url: isAr ? data.ar_path : data.fr_path },
  ]);

  return (
    <>
      <Seo
        lang={lang}
        title={title}
        description={description}
        canonical={canonical}
        alternates={alternates}
        jsonLd={[webPageJsonLd, breadcrumb, organizationJsonLd(lang)]}
      />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="pt-6 sm:pt-10"
      >
        <Link
          to={homeHref}
          className="inline-flex items-center gap-1.5 text-xs text-white/55 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {t('station.back_to_home')}
        </Link>

        <div className="flex items-start gap-4 flex-wrap">
          <div className="h-14 w-14 rounded-2xl glass-strong flex items-center justify-center shrink-0">
            <Globe2 className="h-6 w-6 text-brand-300" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-balance">
              {h1}
            </h1>
            <p className="text-sm text-white/60 mt-2 max-w-3xl">{description}</p>
          </div>
        </div>
      </motion.section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold mb-4">
          {isAr ? 'الإذاعات الأكثر استماعاً' : 'Les radios les plus écoutées'}
        </h2>
        {featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {featured.map((radio) => (
              <RadioCard
                key={radio.id}
                radio={radio}
                isActive={audio.current?.id === radio.id}
                isPlaying={audio.current?.id === radio.id && audio.isPlaying}
                isFavorite={isFavorite(radio.id)}
                onPlay={playRadio}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/50">{t('hero.preparing')}</p>
        )}
      </section>

      <section className="mt-12 max-w-4xl text-white/75 leading-relaxed">
        {body.map((p, i) => (
          <p key={i} className="mb-5 text-[15px]">{p}</p>
        ))}

        <div className="mt-10 flex flex-wrap gap-2">
          <Link
            to={`${isAr ? '/ar' : ''}/top-radio-maroc`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-white/85 hover:bg-white/10 transition"
          >
            <RadioIco className="h-3.5 w-3.5 text-brand-300" />
            {t('nav.top')}
          </Link>
          <Link
            to={`${isAr ? '/ar' : ''}/frequences-radio-maroc`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-white/85 hover:bg-white/10 transition"
          >
            {t('nav.frequencies')}
          </Link>
          <Link
            to={`${isAr ? '/ar' : ''}/blog`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-white/85 hover:bg-white/10 transition"
          >
            {t('nav.blog')}
          </Link>
          <Link
            to={homeHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-white/85 hover:bg-white/10 transition"
          >
            <Heart className="h-3.5 w-3.5 text-rose-300" />
            {t('nav.all_stations')}
          </Link>
        </div>
      </section>
    </>
  );
}
