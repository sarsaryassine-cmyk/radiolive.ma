/**
 * Cloudflare Pages Function — SSR meta injection pour /now/:slug
 *
 * Sans cette fonction, le SPA Vite rend la page client-side et react-helmet
 * injecte les meta tags après hydratation (Googlebot exécute JS, donc OK).
 * Avec cette fonction, on précharge le HTML avec :
 *  - <title> dynamique (artiste — titre sur station)
 *  - <meta description> dynamique
 *  - <link rel="canonical"> + hreflang
 *  - JSON-LD MusicRecording inline (si chanson identifiée)
 *  - Cache edge 30s (s-maxage) pour servir vite + revalidation rapide
 *
 * Améliore TTFB SEO sur les requêtes type "quelle chanson passe sur Hit Radio".
 *
 * Comment ça marche :
 *  1. Cloudflare Pages prend la requête /now/<slug>
 *  2. Si <slug> match cette function → on hijacke
 *  3. On call l'API Worker pour la now-playing data
 *  4. On read le shell index.html des assets statiques (env.ASSETS)
 *  5. On inject les meta dans <head> + on retourne
 *  6. Le SPA hydrate normalement après chargement
 *
 * Limites :
 *  - Si le Worker now-playing répond > 2s → on retourne le shell sans inject
 *    (graceful degradation, le SPA prend le relais).
 *  - On ne traite QUE /now/:slug. /ar/now/:slug est traité par
 *    functions/ar/now/[slug].js (copie miroir).
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

  // Fetch now-playing avec timeout 2s (sinon shell sans inject)
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2000);
  const np = await fetchNowPlaying(url.host, slug, ctrl.signal);
  clearTimeout(timer);

  // Read static index.html from Pages assets bundle
  const shellRes = await env.ASSETS.fetch(new URL('/index.html', url.origin));
  if (!shellRes.ok) return shellRes;
  let html = await shellRes.text();

  const stationName = np?.icy_metadata?.name || slug.replace(/-/g, ' ');
  const playing = np?.now_playing;

  const title = playing?.artist && playing?.title
    ? `${playing.artist} — ${playing.title} sur ${stationName} en ce moment | Radio Maroc`
    : `Quelle chanson passe sur ${stationName} en ce moment ? | Radio Maroc`;

  const description = playing?.artist && playing?.title
    ? `Écoutez en direct ${playing.artist} — ${playing.title} sur ${stationName}. Programme actuel, dix dernières chansons et streaming gratuit sur Radio Maroc.`
    : `Découvrez la chanson actuellement diffusée sur ${stationName}, l'historique des 10 derniers titres et le streaming en direct gratuit.`;

  const canonical = `https://${url.host}/now/${slug}`;
  const arHref = `https://${url.host}/ar/now/${slug}`;

  // JSON-LD MusicRecording (additionnel, ne remplace pas RadioBroadcastService
  // qui reste sur la page station classique).
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
          url: `https://${url.host}/station/${slug}`,
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
    <link rel="alternate" hreflang="fr-MA" href="${escapeHtml(canonical)}" />
    <link rel="alternate" hreflang="ar-MA" href="${escapeHtml(arHref)}" />
    <link rel="alternate" hreflang="fr" href="${escapeHtml(canonical)}" />
    <link rel="alternate" hreflang="ar" href="${escapeHtml(arHref)}" />
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(canonical)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="music.song" />
    <meta property="og:locale" content="fr_MA" />
    ${playing?.artwork_url ? `<meta property="og:image" content="${escapeHtml(playing.artwork_url)}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    ${jsonLdTag}
  `.trim();

  // On remplace le <title> existant + on injecte le reste avant </head>.
  // Le SPA prendra le relais via react-helmet-async qui peut écraser ces tags
  // au runtime client — c'est OK, Googlebot a déjà lu la version SSR.
  html = html
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
