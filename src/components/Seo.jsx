import { Helmet } from 'react-helmet-async';

/**
 * Per-page SEO component.
 *  - Sets <title>, meta description, canonical
 *  - Open Graph + Twitter Card tags for social sharing
 *  - Optional JSON-LD structured-data array
 *  - Optional hreflang siblings for fr/ar mirror routes (and country-targeted
 *    diaspora variants such as ar-FR, ar-BE, ar-NL, …)
 *
 * Use site-wide defaults from getSiteMeta() — overridden by props per page.
 */
const SITE_NAME_FR = 'Radio Maroc';
const SITE_NAME_AR = 'إذاعات المغرب';
const SITE_URL = (typeof window !== 'undefined' && window.location.origin) ||
  'https://radiolive.ma';

const siteName = (lang) => (lang === 'ar' ? SITE_NAME_AR : SITE_NAME_FR);

export default function Seo({
  title,
  description,
  canonical,
  image,
  type = 'website',
  jsonLd,
  noindex = false,
  lang = 'fr',
  alternates,
}) {
  const brand = siteName(lang);
  const fullTitle = title
    ? `${title} | ${brand}`
    : (lang === 'ar'
        ? `${brand} | إذاعات مغربية مباشر`
        : `${brand} en direct — Écouter toutes les radios marocaines en ligne`);

  const desc =
    description ||
    (lang === 'ar'
      ? 'استمع إلى جميع الإذاعات المغربية مباشرة وبجودة عالية. مجاناً، بدون تسجيل، من المغرب أو من الخارج.'
      : "Écoutez toutes les radios marocaines en direct gratuitement : Hit Radio, Radio Mars, Chada FM, Medi 1, Radio 2M et plus de 30 stations. Streaming HD, sans inscription, depuis n'importe où.");

  const url = canonical || (typeof window !== 'undefined' ? window.location.href : SITE_URL);
  // Prefer PNG once generated via `npm run og:png` — fall back to SVG.
  const ogImage = image || `${SITE_URL}/og-default.svg`;
  const ogLocale = lang === 'ar' ? 'ar_MA' : 'fr_MA';
  const ogLocaleAlt = lang === 'ar' ? 'fr_MA' : 'ar_MA';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* hreflang siblings — fr/ar mirrors plus optional country-targeted variants.
          Auto-expand : pour chaque entrée fr-MA, on ajoute aussi fr (ISO 639 simple),
          idem ar-MA → ar. Améliore la couverture pour les requêtes hors Maroc. */}
      {alternates && Array.isArray(alternates) &&
        alternates.flatMap((a, i) => {
          const out = [<link key={`${i}-r`} rel="alternate" hrefLang={a.hreflang} href={a.href} />];
          if (a.hreflang === 'fr-MA') {
            out.push(<link key={`${i}-fr`} rel="alternate" hrefLang="fr" href={a.href} />);
          }
          if (a.hreflang === 'ar-MA') {
            out.push(<link key={`${i}-ar`} rel="alternate" hrefLang="ar" href={a.href} />);
          }
          return out;
        })}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={brand} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={ogLocaleAlt} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLd &&
        (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((data, i) => (
          <script type="application/ld+json" key={i}>
            {JSON.stringify(data)}
          </script>
        ))}
    </Helmet>
  );
}

/* ─── JSON-LD builders ──────────────────────────────────────────────────── */

export function organizationJsonLd(lang = 'fr') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName(lang),
    alternateName: lang === 'ar' ? SITE_NAME_FR : SITE_NAME_AR,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/RADIO%20MARS.png`,
    sameAs: [
      'https://www.facebook.com/',
      'https://twitter.com/',
      'https://www.instagram.com/',
    ],
  };
}

export function websiteJsonLd(lang = 'fr') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName(lang),
    url: SITE_URL,
    inLanguage: lang === 'ar' ? 'ar-MA' : 'fr-MA',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}${lang === 'ar' ? '/ar' : ''}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Schema RadioBroadcastService — type schema.org plus précis pour les services
 * de diffusion (vs RadioStation qui est l'entité organisation). Les deux
 * coexistent, Google les comprend tous les deux. Cette version inclut
 * `potentialAction.ListenAction` qui pointe sur le flux audio direct.
 */
export function radioBroadcastServiceJsonLd(radio, lang = 'fr') {
  if (!radio) return null;
  const arPrefix = lang === 'ar' ? '/ar' : '';

  let broadcastFrequency;
  if (radio.frequency) {
    const m = String(radio.frequency).match(/(\d+(?:\.\d+)?)/);
    if (m) {
      broadcastFrequency = {
        '@type': 'BroadcastFrequencySpecification',
        broadcastFrequencyValue: parseFloat(m[1]),
        broadcastSignalModulation: 'FM',
      };
    } else {
      broadcastFrequency = radio.frequency;
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'RadioBroadcastService',
    name: radio.name,
    broadcastDisplayName: radio.name,
    url: `${SITE_URL}${arPrefix}/station/${radio.id}`,
    inLanguage: lang === 'ar' ? 'ar-MA' : 'fr-MA',
    broadcastFrequency,
    areaServed: { '@type': 'Country', name: 'Morocco', identifier: 'MA' },
    broadcaster: { '@type': 'Organization', name: radio.name },
    parentService: { '@type': 'Organization', name: siteName(lang), url: SITE_URL },
    image: radio.icon ? `${SITE_URL}${radio.icon}` : undefined,
    sameAs: Array.isArray(radio.sameAs) && radio.sameAs.length ? radio.sameAs : undefined,
    potentialAction: {
      '@type': 'ListenAction',
      target: radio.stream,
    },
  };
}

export function radioStationJsonLd(radio, lang = 'fr') {
  if (!radio) return null;
  const arPrefix = lang === 'ar' ? '/ar' : '';

  // broadcastFrequency : si la radio fournit une fréquence FM (ex. "88.0 MHz Casablanca"),
  // on l'expose en BroadcastFrequencySpecification — plus précis que la string brute.
  let broadcastFrequency;
  if (radio.frequency) {
    const m = String(radio.frequency).match(/(\d+(?:\.\d+)?)/);
    if (m) {
      broadcastFrequency = {
        '@type': 'BroadcastFrequencySpecification',
        broadcastFrequencyValue: parseFloat(m[1]),
        broadcastSignalModulation: 'FM',
      };
    } else {
      broadcastFrequency = radio.frequency;
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'RadioStation',
    name: radio.name,
    url: `${SITE_URL}${arPrefix}/station/${radio.id}`,
    description:
      radio.description ||
      (lang === 'ar' ? `استمع إلى ${radio.name} مباشرة.` : `Écoutez ${radio.name} en direct.`),
    inLanguage: lang === 'ar' ? 'ar-MA' : 'fr-MA',
    broadcastFrequency,
    // Zone de diffusion — Maroc + extension au monde via streaming.
    areaServed: [
      { '@type': 'Country', name: 'Morocco', identifier: 'MA' },
      { '@type': 'Place', name: 'Worldwide (online streaming)' },
    ],
    parentOrganization: { '@type': 'Organization', name: siteName(lang) },
    image: radio.icon ? `${SITE_URL}${radio.icon}` : undefined,
    // Réseaux sociaux / sites officiels — exposés par chaque entrée du catalogue
    // (radio.sameAs : tableau d'URLs, ex. site officiel + Facebook + YouTube).
    sameAs: Array.isArray(radio.sameAs) && radio.sameAs.length ? radio.sameAs : undefined,
    audio: {
      '@type': 'AudioObject',
      contentUrl: radio.stream,
      encodingFormat: radio.codec || 'audio/mpeg',
    },
  };
}

export function breadcrumbJsonLd(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url ? `${SITE_URL}${item.url}` : undefined,
    })),
  };
}
