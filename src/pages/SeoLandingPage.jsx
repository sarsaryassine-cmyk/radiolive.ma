import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Sparkles, ChevronRight } from 'lucide-react';

import Seo, { breadcrumbJsonLd, organizationJsonLd } from '../components/Seo.jsx';
import RadioCard from '../components/RadioCard.jsx';
import { useAppContext } from '../AppContext.jsx';
import useI18n from '../i18n/useI18n.js';
import { SEO_LANDINGS } from '../data/seoLandings.js';

const SITE_URL = 'https://radiolive.ma';

/**
 * Page SEO de cluster — pilier, live, sport, national.
 *
 * Reçoit `landingKey` (ex. 'radio-maroc-en-direct') et lit le contenu dans
 * src/data/seoLandings.js. Génère :
 *   - Meta SEO (title, description, canonical, hreflang sibling FR/AR)
 *   - JSON-LD WebPage + FAQPage + BreadcrumbList
 *   - H1, intro, body sections (h2/h3/p/ul)
 *   - Maillage interne : grille stations + liens clusters + FAQ
 */
export default function SeoLandingPage({ landingKey }) {
  const data = SEO_LANDINGS[landingKey];
  const { radios, audio, playRadio, isFavorite, toggleFavorite } = useAppContext();
  const { t, lang } = useI18n();

  const featured = useMemo(() => {
    if (!radios?.length || !data?.relatedStationIds) return [];
    const map = new Map(radios.map((r) => [r.id, r]));
    return data.relatedStationIds.map((id) => map.get(id)).filter(Boolean).slice(0, 8);
  }, [radios, data]);

  if (!data) {
    return (
      <div className="mt-16 mx-auto max-w-md text-center glass rounded-3xl p-8">
        <h3 className="font-display text-xl font-semibold mb-2">404</h3>
      </div>
    );
  }

  const isAr = data.lang === 'ar';
  const homeHref = isAr ? '/ar' : '/';
  const canonical = `${SITE_URL}${data.path}`;

  const alternates = data.altPath
    ? [
        { hreflang: 'fr-MA', href: `${SITE_URL}${isAr ? data.altPath : data.path}` },
        { hreflang: 'ar-MA', href: `${SITE_URL}${isAr ? data.path : data.altPath}` },
        { hreflang: 'x-default', href: `${SITE_URL}${isAr ? data.altPath : data.path}` },
      ]
    : [
        { hreflang: data.lang === 'ar' ? 'ar-MA' : 'fr-MA', href: canonical },
        { hreflang: 'x-default', href: canonical },
      ];

  // JSON-LD WebPage
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.title,
    description: data.description,
    url: canonical,
    inLanguage: isAr ? 'ar-MA' : 'fr-MA',
    isPartOf: {
      '@type': 'WebSite',
      url: SITE_URL,
      name: isAr ? 'إذاعات المغرب' : 'Radio Maroc',
    },
  };

  // JSON-LD FAQ — éligibilité Featured Snippet
  const faqJsonLd = data.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null;

  const breadcrumb = breadcrumbJsonLd([
    { name: isAr ? 'الرئيسية' : 'Accueil', url: homeHref },
    { name: data.h1 },
  ]);

  return (
    <>
      <Seo
        lang={data.lang}
        title={data.title}
        description={data.description}
        canonical={canonical}
        alternates={alternates}
        jsonLd={[
          webPageJsonLd,
          breadcrumb,
          organizationJsonLd(data.lang),
          faqJsonLd,
        ].filter(Boolean)}
      />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="pt-6 sm:pt-10 max-w-4xl"
      >
        <Link
          to={homeHref}
          className="inline-flex items-center gap-1.5 text-xs text-white/55 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {isAr ? 'العودة إلى الرئيسية' : "Retour à l'accueil"}
        </Link>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-balance mb-5">
          {data.h1}
        </h1>

        {data.intro && (
          <p className="text-white/80 text-lg leading-relaxed">{data.intro}</p>
        )}
      </motion.section>

      {/* Maillage interne — stations populaires en haut pour engagement */}
      {featured.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#FF6B7A]" />
            {isAr ? 'الإذاعات الأكثر استماعاً' : 'Les radios les plus écoutées'}
          </h2>
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
        </section>
      )}

      {/* Corps long format */}
      <section className="mt-12 max-w-4xl text-white/75 leading-relaxed">
        {data.body.map((block, i) => {
          if (block.h2) {
            return (
              <h2 key={i} className="font-display text-2xl font-bold text-white mt-10 mb-4">
                {block.h2}
              </h2>
            );
          }
          if (block.h3) {
            return (
              <h3 key={i} className="font-display text-lg font-semibold text-white mt-6 mb-2">
                {block.h3}
              </h3>
            );
          }
          if (block.ul) {
            return (
              <ul key={i} className="list-disc pl-6 mb-5 space-y-2 marker:text-[#FF2A3C] text-[15px] rtl:pr-6 rtl:pl-0">
                {block.ul.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} className="mb-5 text-[15px]">
              {block.p}
            </p>
          );
        })}
      </section>

      {/* FAQ — éligibilité Featured Snippet via FAQPage JSON-LD */}
      {data.faq?.length > 0 && (
        <section className="mt-14 max-w-4xl">
          <h2 className="font-display text-2xl font-bold text-white mb-6">
            {isAr ? 'أسئلة شائعة' : 'Foire aux questions'}
          </h2>
          <div className="space-y-3">
            {data.faq.map((item, i) => (
              <details
                key={i}
                className="group glass rounded-2xl px-5 py-4 cursor-pointer transition-all hover:bg-white/[0.06]"
              >
                <summary className="font-display font-semibold text-white text-[15px] flex items-center justify-between gap-4 list-none">
                  <span>{item.q}</span>
                  <ChevronRight className="h-4 w-4 text-white/50 transition-transform group-open:rotate-90 shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Maillage interne — section "Écouter aussi" */}
      <section className="mt-14 mb-8 max-w-4xl">
        <h2 className="font-display text-xl font-semibold text-white mb-4">
          {isAr ? 'استمع أيضاً' : 'Écouter aussi'}
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.related.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-white/85 hover:bg-white/10 transition"
            >
              {link.label}
              <ChevronRight className="h-3 w-3 text-white/50 rtl:rotate-180" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
