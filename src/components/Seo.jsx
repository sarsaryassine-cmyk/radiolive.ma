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
  // Smart suffix : on n'ajoute "| Radio Maroc" que si le titre ne contient pas
  // déjà la marque. Évite des titres type "Radio Maroc en direct ... | Radio Maroc"
  // (95+ caractères tronqués par Google, look spam, perte d'espace SERP).
  const titleHasBrand = title && title.toLowerCase().includes(brand.toLowerCase());
  const fullTitle = title
    ? (titleHasBrand ? title : `${title} | ${brand}`)
    : (lang === 'ar'
        ? `${brand} | إذاعات مغربية مباشر`
        : `${brand} en direct — Écouter toutes les radios marocaines en ligne`);

  const desc =
    description ||
    (lang === 'ar'
      ? 'استمع إلى جميع الإذاعات المغربية مباشرة وبجودة عالية. مجاناً، بدون تسجيل، من المغرب أو من الخارج.'
      : "Écoutez toutes les radios marocaines en direct gratuitement : Hit Radio, Radio Mars, Chada FM, Medi 1, Radio 2M et plus de 30 stations. Streaming HD, sans inscription, depuis n'importe où.");

  const url = canonical || (typeof window !== 'undefined' ? window.location.href : SITE_URL);
  // PNG 1200×630 (généré via `npm run og:png`) — universel. Le SVG n'est pas
  // rendu par Facebook/LinkedIn/WhatsApp/X ni la plupart des aperçus.
  const ogImage = image || `${SITE_URL}/og-default.png`;
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
    logo: `${SITE_URL}/favicon.svg`,
    // sameAs : profils officiels qui prouvent à Google que c'est bien la même
    // entité. Important pour le Knowledge Panel et les sitelinks à terme.
    // Ne lister QUE les profils existants — jamais d'URL fake type
    // "facebook.com/" sans path (Google ignore + signal de faible qualité).
    sameAs: [
      'https://x.com/MarocLive123',
      'https://www.facebook.com/share/1KHqPm4R4V/',
      'https://www.youtube.com/@radiolivemaroc-u3j',
      'https://www.linkedin.com/in/radio-live-maroc-00ab2240b/',
      'https://medium.com/@radiolive.ma',
      'https://radiolivemaroc.substack.com',
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
      (lang === 'ar' ? (radio.description_ar || radio.description) : radio.description) ||
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

// Base canonique en dur (et non window.origin) : ce builder alimente du JSON-LD
// destiné au HTML PRÉRENDU — où window.origin vaut 127.0.0.1:port. On veut
// toujours l'URL de prod absolue.
const CANONICAL_BASE = 'https://radiolive.ma';

/**
 * NewsArticle — article d'actualité (page /info). Auteur Person, publisher
 * Organization avec logo, image (fallback OG par défaut), dates + section.
 */
export function newsArticleJsonLd(article, lang = 'fr') {
  if (!article) return null;
  const isAr = lang === 'ar';
  const arPrefix = isAr ? '/ar' : '';
  const slug = isAr && article.slug_ar ? article.slug_ar : article.slug;
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: isAr ? article.title_ar || article.title : article.title,
    description: isAr ? article.excerpt_ar || article.excerpt : article.excerpt,
    datePublished: article.date,
    dateModified: article.dateModified || article.date,
    inLanguage: isAr ? 'ar-MA' : 'fr-MA',
    author: { '@type': 'Person', name: article.author || 'Réda M.' },
    publisher: {
      '@type': 'Organization',
      name: isAr ? 'إذاعات المغرب' : 'Radio Maroc',
      logo: { '@type': 'ImageObject', url: `${CANONICAL_BASE}/favicon-96x96.png` },
    },
    image: [article.image ? `${CANONICAL_BASE}${article.image}` : `${CANONICAL_BASE}/og-default.png`],
    articleSection: article.category,
    keywords: (article.keywords || []).join(', '),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${CANONICAL_BASE}${arPrefix}/info/${slug}` },
    ...(article.sources && article.sources.length
      ? { citation: article.sources.map((s) => s.url) }
      : {}),
  };
}

/** WebPage générique — pour les pages d'index/hub (ex. /info). */
export function webPageJsonLd({ name, description, url, lang = 'fr' }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: url || CANONICAL_BASE,
    inLanguage: lang === 'ar' ? 'ar-MA' : 'fr-MA',
    isPartOf: { '@type': 'WebSite', name: lang === 'ar' ? 'إذاعات المغرب' : 'Radio Maroc', url: CANONICAL_BASE },
  };
}
