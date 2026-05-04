import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Radio as RadioIco, Play, Calendar, Clock } from 'lucide-react';

import Seo, { breadcrumbJsonLd, organizationJsonLd } from '../components/Seo.jsx';
import RadioIcon from '../components/RadioIcon.jsx';
import { useAppContext } from '../AppContext.jsx';
import useI18n from '../i18n/useI18n.js';
import { EMISSIONS } from '../data/emissions.js';

const SITE_URL = 'https://radiolive.ma';

/**
 * Page éditoriale dédiée à une émission radio (animateur + programme).
 * Cible des keywords longue traîne très forts : "Conseil psy Mamoun Dribi"
 * (8K-15K recherches/mois), "Soulayma Med Radio", "Nass El Ghiwane Show"...
 *
 * Schemas exposés :
 *  - Article (avec inLanguage, datePublished, mainEntityOfPage)
 *  - BreadcrumbList (Accueil > Émissions > Titre)
 *  - FAQPage (5 Q/A par émission)
 *  - Le composant RadioStation reste sur la page station, pas ici.
 */
export default function EmissionPage({ emissionKey }) {
  const data = EMISSIONS[emissionKey];
  const { radios, audio, playRadio } = useAppContext();
  const { t, lang } = useI18n();

  if (!data) {
    return (
      <div className="mt-16 mx-auto max-w-md text-center glass rounded-3xl p-8">
        <h3 className="font-display text-xl font-semibold mb-2">404</h3>
      </div>
    );
  }

  const isAr = lang === 'ar';
  const content = isAr ? data.ar : data.fr;
  const homeHref = isAr ? '/ar' : '/';
  const emissionsHref = isAr ? '/ar/baramij' : '/emissions';
  const stationHref = `${isAr ? '/ar' : ''}/station/${data.station_id}`;
  const stationName = isAr ? data.station_name_ar : data.station_name;

  const station = useMemo(
    () => radios?.find((r) => r.id === data.station_id),
    [radios, data.station_id]
  );

  const canonical = `${SITE_URL}${isAr ? data.ar_path : data.fr_path}`;
  const frHref = `${SITE_URL}${data.fr_path}`;
  const arHref = `${SITE_URL}${data.ar_path}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.title,
    description: content.description,
    datePublished: data.datePublished,
    dateModified: data.datePublished,
    inLanguage: isAr ? 'ar-MA' : 'fr-MA',
    author: { '@type': 'Organization', name: isAr ? 'إذاعات المغرب' : 'Radio Maroc' },
    publisher: {
      '@type': 'Organization',
      name: isAr ? 'إذاعات المغرب' : 'Radio Maroc',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    articleSection: isAr ? 'برامج إذاعية' : 'Émissions',
    keywords: isAr
      ? 'مأمون دريبي, ميد راديو, الاستشارة النفسية, استماع راديو'
      : 'Mamoun Dribi, Med Radio, Conseil psy, psychologie, radio Maroc',
    image: `${SITE_URL}${data.image}`,
    // Lie l'article à la série radio + au service de diffusion (Med Radio).
    // Aide Google à comprendre que c'est une page éditoriale au sujet d'un
    // programme radio précis, pas un article générique.
    about: {
      '@type': 'RadioSeries',
      name: isAr ? 'الاستشارة النفسية مع مأمون مبارك دريبي' : 'Conseil psy avec Mamoun Moubarak Dribi',
      broadcastService: {
        '@type': 'RadioBroadcastService',
        name: stationName,
        url: `${SITE_URL}${stationHref}`,
      },
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: isAr ? 'الرئيسية' : 'Accueil', url: homeHref },
    { name: isAr ? 'البرامج' : 'Émissions', url: emissionsHref },
    { name: content.h1 },
  ]);

  return (
    <>
      <Seo
        lang={lang}
        title={content.title}
        description={content.description}
        type="article"
        canonical={canonical}
        image={data.image ? `${SITE_URL}${data.image}` : undefined}
        alternates={[
          { hreflang: 'fr-MA', href: frHref },
          { hreflang: 'ar-MA', href: arHref },
          { hreflang: 'fr', href: frHref },
          { hreflang: 'ar', href: arHref },
          { hreflang: 'x-default', href: frHref },
        ]}
        jsonLd={[articleJsonLd, breadcrumb, faqJsonLd, organizationJsonLd(lang)]}
      />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-6 sm:pt-10 max-w-4xl mx-auto pb-8"
      >
        <Link
          to={homeHref}
          className="inline-flex items-center gap-1.5 text-xs text-white/55 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
          {isAr ? 'العودة إلى الرئيسية' : "Retour à l'accueil"}
        </Link>

        <div className="flex items-center gap-2 text-[11px] sm:text-[10px] uppercase tracking-wider text-white/55 mb-3">
          <span className="inline-flex items-center gap-1">
            <RadioIco className="h-3 w-3 text-[#FF6B7A]" />
            {isAr ? 'برنامج إذاعي' : 'Émission radio'}
          </span>
          <span>·</span>
          <Link
            to={stationHref}
            className="hover:text-white transition-colors"
          >
            {stationName}
          </Link>
        </div>

        {/* Portrait éditorial — flotté à droite (gauche en RTL) avant le H1
            pour que le titre et l'intro s'enroulent autour, comme dans un
            article de presse magazine. Taille augmentée pour remplir le bloc
            visuel du H1+intro. */}
        {data.image && !data.image.endsWith('.svg') && (
          <figure className="float-right ml-6 mb-4 w-48 sm:w-64 md:w-80 lg:w-96 rtl:float-left rtl:mr-6 rtl:ml-0">
            <div className="rounded-2xl overflow-hidden bg-ink-900">
              <img
                src={data.image}
                alt={(isAr && data.image_alt_ar) ? data.image_alt_ar : (data.image_alt || content.h1)}
                className="w-full h-auto block"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </figure>
        )}

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-balance mb-5">
          {content.h1}
        </h1>

        <p className="text-white/80 text-lg leading-relaxed">{content.intro}</p>
        <div className="clear-both" />
      </motion.section>

      {/* CTA Station — bloc visuel en haut pour engagement immédiat */}
      {station && (
        <section className="max-w-4xl mx-auto mb-10">
          <div className="glass rounded-3xl p-5 sm:p-6 flex items-center gap-4 sm:gap-5">
            <RadioIcon radio={station} size="md" playing={audio.current?.id === station.id && audio.isPlaying} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] sm:text-[10px] uppercase tracking-wider text-white/55 mb-1">
                {isAr ? 'استمع مباشرة على' : 'Écouter en direct sur'}
              </p>
              <Link
                to={stationHref}
                className="font-display font-bold text-lg sm:text-xl hover:text-[#FF6B7A] transition-colors"
              >
                {station.name}
              </Link>
            </div>
            <button
              onClick={() => playRadio(station)}
              aria-label={isAr ? 'استمع مباشرة' : 'Écouter en direct'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white text-sm shrink-0"
              style={{
                background: `linear-gradient(120deg, ${station.gradientFrom}, ${station.gradientTo})`,
                boxShadow: `0 12px 30px -12px ${station.gradientFrom}99`,
              }}
            >
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">{isAr ? 'استمع' : 'Écouter'}</span>
            </button>
          </div>
        </section>
      )}

      {/* Corps article — sections h2 + paragraphes / listes */}
      <section className="max-w-4xl mx-auto text-white/80 leading-relaxed">
        {content.sections.map((sec, i) => (
          <div key={i}>
            <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
              {sec.h2}
            </h2>

            {sec.p && <p className="mb-5 text-[15px]">{sec.p}</p>}
            {sec.p2 && <p className="mb-5 text-[15px]">{sec.p2}</p>}

            {sec.note && (
              <p className="text-[13px] text-white/55 italic mb-5 inline-flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                {sec.note}
              </p>
            )}

            {sec.ul && (
              <ul className="list-disc pl-6 rtl:pr-6 rtl:pl-0 mb-5 space-y-2 marker:text-[#FF2A3C] text-[15px]">
                {sec.ul.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            )}

            {sec.p_with_link && (
              <p className="mb-5 text-[15px]">
                {sec.p_with_link.before}
                <Link to={sec.p_with_link.link_to} className="text-[#FF6B7A] hover:underline">
                  {sec.p_with_link.link_text}
                </Link>
                {sec.p_with_link.after}
              </p>
            )}

          </div>
        ))}
      </section>

      {/* FAQ accordéon */}
      <section className="mt-14 max-w-4xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-white mb-6">
          {isAr ? 'أسئلة شائعة' : 'Foire aux questions'}
        </h2>
        <div className="space-y-3">
          {content.faq.map((item, i) => (
            <details
              key={i}
              className="group glass rounded-2xl px-5 py-4 cursor-pointer transition-all hover:bg-white/[0.06]"
            >
              <summary className="font-display font-semibold text-white text-[15px] flex items-center justify-between gap-4 list-none">
                <span>{item.q}</span>
                <ChevronRight className="h-4 w-4 text-white/50 transition-transform group-open:rotate-90 shrink-0 rtl:rotate-180 rtl:group-open:rotate-[270deg]" />
              </summary>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Maillage interne — liens transversaux */}
      <section className="mt-14 mb-12 max-w-4xl mx-auto">
        <h2 className="font-display text-xl font-semibold text-white mb-4">
          {isAr ? 'استمع أيضاً' : 'Écouter aussi'}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            to={stationHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-white/85 hover:bg-white/10 transition"
          >
            <Play className="h-3 w-3 text-[#FF6B7A]" />
            {stationName}
          </Link>
          <Link
            to={`${isAr ? '/ar' : ''}/top-radio-maroc`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-white/85 hover:bg-white/10 transition"
          >
            {isAr ? 'أفضل 10 إذاعات' : 'Top 10 radios'}
          </Link>
          <Link
            to={`${isAr ? '/ar' : ''}/blog`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-white/85 hover:bg-white/10 transition"
          >
            {isAr ? 'المدونة' : 'Blog'}
          </Link>
          <Link
            to={homeHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-white/85 hover:bg-white/10 transition"
          >
            {isAr ? 'كل الإذاعات' : 'Toutes les radios'}
          </Link>
        </div>
      </section>
    </>
  );
}
