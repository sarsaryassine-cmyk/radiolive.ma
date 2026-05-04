/**
 * Miroir AR de functions/now/[slug].js — même logique, copy AR du <title>
 * et de la meta description, og:locale=ar_MA, html attribute lang="ar" dir="rtl".
 */

const escapeHtml = (s) =>
  String(s || '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

async function fetchNowPlaying(host, slug, signal) {
  try {
    const r = await fetch(`https://${host}/api/now-playing/${slug}`, { signal });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export async function onRequest(context) {
  const { request, params, env } = context;
  const url = new URL(request.url);
  const slug = String(params.slug || '').toLowerCase();

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return env.ASSETS.fetch(request);
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2000);
  const np = await fetchNowPlaying(url.host, slug, ctrl.signal);
  clearTimeout(timer);

  const shellRes = await env.ASSETS.fetch(new URL('/index.html', url.origin));
  if (!shellRes.ok) return shellRes;
  let html = await shellRes.text();

  const stationName = np?.icy_metadata?.name || slug.replace(/-/g, ' ');
  const playing = np?.now_playing;

  const title = playing?.artist && playing?.title
    ? `${playing.artist} — ${playing.title} على ${stationName} الآن | إذاعات المغرب`
    : `ما هي الأغنية على ${stationName} الآن؟ | إذاعات المغرب`;

  const description = playing?.artist && playing?.title
    ? `استمع إلى ${playing.artist} — ${playing.title} مباشرة على ${stationName}. مع آخر الأغاني المُذاعة وروابط الاستماع.`
    : `اكتشف الأغنية الحالية على ${stationName}، أحدث 10 أغانٍ مُذاعة، ورابط الاستماع المباشر.`;

  const canonical = `https://${url.host}/ar/now/${slug}`;
  const frHref = `https://${url.host}/now/${slug}`;

  const musicRecording = playing?.artist && playing?.title
    ? {
        '@context': 'https://schema.org',
        '@type': 'MusicRecording',
        name: playing.title,
        byArtist: { '@type': 'MusicGroup', name: playing.artist },
        ...(playing.artwork_url ? { image: playing.artwork_url } : {}),
        isPartOf: {
          '@type': 'RadioBroadcastService',
          name: stationName,
          url: `https://${url.host}/ar/station/${slug}`,
        },
      }
    : null;

  const jsonLdTag = musicRecording
    ? `<script type="application/ld+json">${JSON.stringify(musicRecording)}</script>`
    : '';

  const injection = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <link rel="alternate" hreflang="fr-MA" href="${escapeHtml(frHref)}" />
    <link rel="alternate" hreflang="ar-MA" href="${escapeHtml(canonical)}" />
    <link rel="alternate" hreflang="fr" href="${escapeHtml(frHref)}" />
    <link rel="alternate" hreflang="ar" href="${escapeHtml(canonical)}" />
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(frHref)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="music.song" />
    <meta property="og:locale" content="ar_MA" />
    <meta property="og:locale:alternate" content="fr_MA" />
    ${playing?.artwork_url ? `<meta property="og:image" content="${escapeHtml(playing.artwork_url)}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    ${jsonLdTag}
  `.trim();

  // En AR : on switch aussi <html lang="fr" → lang="ar" dir="rtl"> au shell SSR
  html = html
    .replace(/<html lang="[^"]*"/, '<html lang="ar" dir="rtl"')
    .replace(/<title>[^<]*<\/title>/, '')
    .replace(/<\/head>/, `${injection}\n  </head>`);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=15, s-maxage=30',
      'X-Now-Playing-Source': playing ? 'worker' : 'fallback',
    },
  });
}
