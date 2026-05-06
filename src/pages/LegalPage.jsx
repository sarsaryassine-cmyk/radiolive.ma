import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Shield } from 'lucide-react';

import Seo, { breadcrumbJsonLd, organizationJsonLd } from '../components/Seo.jsx';
import useI18n from '../i18n/useI18n.js';
import { LEGAL_PAGES } from '../data/legalPages.js';

const SITE_URL = 'https://radiolive.ma';

/**
 * Page éditoriale légale (Privacy, Terms, Contact, About).
 *
 * Reçoit `pageKey` (ex. 'politique-confidentialite') et lit le contenu dans
 * src/data/legalPages.js. Auto-bilingue FR/AR via useI18n. Génère :
 *   - Meta SEO + canonical + hreflang
 *   - JSON-LD WebPage + BreadcrumbList
 *   - H1, intro, body sections (h2/p/p2/ul)
 */
export default function LegalPage({ pageKey }) {
  const data = LEGAL_PAGES[pageKey];
  const { lang } = useI18n();

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
  const canonical = `${SITE_URL}${isAr ? data.ar_path : data.fr_path}`;
  const frHref = `${SITE_URL}${data.fr_path}`;
  const arHref = `${SITE_URL}${data.ar_path}`;

  const breadcrumb = breadcrumbJsonLd([
    { name: isAr ? 'الرئيسية' : 'Accueil', url: `${SITE_URL}${homeHref}` },
    { name: content.h1, url: canonical },
  ]);

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: content.title,
    description: content.description,
    url: canonical,
    inLanguage: isAr ? 'ar-MA' : 'fr-MA',
    datePublished: data.lastUpdated,
    dateModified: data.lastUpdated,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Radio Maroc',
      url: SITE_URL,
    },
  };

  return (
    <>
      <Seo
        lang={lang}
        title={content.title}
        description={content.description}
        canonical={canonical}
        alternates={[
          { hreflang: 'fr-MA', href: frHref },
          { hreflang: 'ar-MA', href: arHref },
          { hreflang: 'x-default', href: frHref },
        ]}
        jsonLd={[webPageJsonLd, breadcrumb, organizationJsonLd(lang)]}
      />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-6 sm:pt-10 max-w-3xl mx-auto pb-8"
      >
        <Link
          to={homeHref}
          className="inline-flex items-center gap-1.5 text-xs text-white/55 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
          {isAr ? 'العودة إلى الرئيسية' : "Retour à l'accueil"}
        </Link>

        <div className="flex items-center gap-2 text-[11px] sm:text-[10px] uppercase tracking-wider text-white/55 mb-3">
          <Shield className="h-3 w-3 text-[#FF6B7A]" />
          {isAr ? 'مستندات قانونية' : 'Documents légaux'}
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-balance mb-4">
          {content.h1}
        </h1>

        <p className="text-[12px] text-white/45 mb-6">
          {isAr ? 'آخر تحديث:' : 'Dernière mise à jour :'} {data.lastUpdated}
        </p>

        <p className="text-white/80 text-base leading-relaxed">{content.intro}</p>
      </motion.section>

      <section className="max-w-3xl mx-auto text-white/80 leading-relaxed">
        {content.sections.map((sec, i) => (
          <div key={i}>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-10 mb-4">
              {sec.h2}
            </h2>

            {sec.p && <p className="mb-4 text-[15px]">{sec.p}</p>}
            {sec.p2 && <p className="mb-4 text-[15px]">{sec.p2}</p>}

            {sec.ul && (
              <ul className="list-disc pl-6 rtl:pr-6 rtl:pl-0 mb-4 space-y-2 marker:text-[#FF6B7A] text-[15px]">
                {sec.ul.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    </>
  );
}
