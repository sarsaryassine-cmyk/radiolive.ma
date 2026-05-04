#!/usr/bin/env node
/**
 * IndexNow ping — pousse une liste d'URLs à Bing/Yandex/Seznam (les moteurs
 * supportant IndexNow) en une requête. À lancer après chaque déploiement
 * pour accélérer le crawl des nouvelles pages.
 *
 * Usage :
 *   node scripts/indexnow-ping.mjs
 *
 * Ou en intégration CI / Cloudflare Pages post-deploy hook :
 *   npm run indexnow
 *
 * Spec : https://www.indexnow.org/documentation
 */

const HOST = 'radiolive.ma';
const KEY = '2a6164376d871eabe6ce30e127d79d8b';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Liste des URLs prioritaires à indexer rapidement (Phase 1).
// Pour chaque page modifiée significativement, ajoute-la ici avant push prod.
const URLS = [
  // Pilier
  `https://${HOST}/`,
  `https://${HOST}/ar`,

  // Émissions (high-volume keyword 8K-15K/mois)
  `https://${HOST}/emissions/conseil-psy-mamoun-dribi`,
  `https://${HOST}/ar/baramij/istichara-nafsiya-mamoun-dribi`,

  // SEO landings
  `https://${HOST}/radio-maroc`,
  `https://${HOST}/radio-maroc-en-direct`,
  `https://${HOST}/radio-sport-maroc`,
  `https://${HOST}/radio-nationale-marocaine`,
  `https://${HOST}/ar/radio-maroc-mubashir`,
  `https://${HOST}/ar/radio-riyada-maghreb`,
  `https://${HOST}/ar/radio-al-idha3a-al-wataniya`,

  // Articles musique (paires FR + AR)
  `https://${HOST}/blog/musique-chaabi-marocaine`,
  `https://${HOST}/ar/blog/al-musiqa-al-chaabia-al-maghribiya`,
  `https://${HOST}/blog/elgrandetoto-rappeur-marocain`,
  `https://${HOST}/ar/blog/elgrandetoto-rapper-maghribi`,
  `https://${HOST}/blog/saad-lamjarred-biographie`,
  `https://${HOST}/ar/blog/saad-lamjarred-sira`,
  `https://${HOST}/blog/histoire-rap-marocain`,
  `https://${HOST}/ar/blog/tarikh-al-rap-al-maghribi`,
  `https://${HOST}/blog/meilleures-radios-marocaines-musique-streaming`,
  `https://${HOST}/ar/blog/afdal-idaat-maghribiya-musiqa`,
  `https://${HOST}/blog/musique-gnawa-maroc`,
  `https://${HOST}/ar/blog/musiqa-gnawa-al-maghrib`,
  `https://${HOST}/blog/nass-el-ghiwane-groupe-mythique`,
  `https://${HOST}/ar/blog/nass-el-ghiwane`,
  `https://${HOST}/blog/festival-mawazine-rabat`,
  `https://${HOST}/ar/blog/mahrajan-mawazine`,
  `https://${HOST}/blog/musique-amazighe-maroc`,
  `https://${HOST}/ar/blog/al-musiqa-al-amazighiya`,
  `https://${HOST}/blog/top-10-chansons-marocaines-incontournables`,
  `https://${HOST}/ar/blog/afdal-10-aghani-maghribiya`,

  // Sitemap
  `https://${HOST}/sitemap.xml`,
];

const ENDPOINT = 'https://api.indexnow.org/indexnow';

async function main() {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS,
  };

  console.log(`[IndexNow] pushing ${URLS.length} URLs to ${ENDPOINT}`);
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  if (res.status >= 200 && res.status < 300) {
    console.log(`[IndexNow] ✓ accepted (${res.status})`);
  } else if (res.status === 422) {
    console.warn(`[IndexNow] ⚠ unprocessable — host mismatch ou clé invalide`);
  } else {
    const text = await res.text().catch(() => '');
    console.error(`[IndexNow] ✗ error ${res.status}: ${text.slice(0, 200)}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[IndexNow] fatal:', err);
  process.exit(1);
});
