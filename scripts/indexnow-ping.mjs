#!/usr/bin/env node
/**
 * IndexNow ping — pousse toutes les URLs du sitemap à Bing/Yandex/Seznam
 * (moteurs supportant IndexNow) en une seule requête.
 *
 * Stratégie : lit dist/sitemap.xml (généré par build-sitemap.mjs) et extrait
 * toutes les <loc> pour les soumettre à l'endpoint IndexNow. Fallback sur
 * une liste minimale si le sitemap est introuvable (pas encore buildé).
 *
 * Usage :
 *   npm run indexnow                    # ping toutes les URLs du sitemap
 *   node scripts/indexnow-ping.mjs      # idem
 *
 * Intégré au postbuild : se déclenche automatiquement après chaque
 * `npm run build` (= chaque déploiement Cloudflare Pages).
 *
 * Spec : https://www.indexnow.org/documentation
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const HOST = 'radiolive.ma';
const KEY = '2a6164376d871eabe6ce30e127d79d8b';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITEMAP_PATH = join(ROOT, 'dist', 'sitemap.xml');

// Fallback : URLs minimales si dist/sitemap.xml n'existe pas encore
// (premier build ou exécution avant build).
const FALLBACK_URLS = [
  `https://${HOST}/`,
  `https://${HOST}/ar`,
  `https://${HOST}/sitemap.xml`,
];

function extractUrlsFromSitemap(xml) {
  // Regex simple — suffisant pour un sitemap standard avec <loc>URL</loc>
  const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
  const urls = [];
  for (const m of matches) {
    const url = m[1].trim();
    // Garde uniquement les URLs du host (ignore les sitemaps imbriqués
    // qui pourraient pointer ailleurs)
    if (url.startsWith(`https://${HOST}/`) || url === `https://${HOST}`) {
      urls.push(url);
    }
  }
  return urls;
}

function loadUrls() {
  if (!existsSync(SITEMAP_PATH)) {
    console.warn(`[IndexNow] ⚠ dist/sitemap.xml introuvable — fallback (${FALLBACK_URLS.length} URLs)`);
    console.warn(`[IndexNow] Lance d'abord 'npm run build' pour générer le sitemap complet.`);
    return FALLBACK_URLS;
  }
  const xml = readFileSync(SITEMAP_PATH, 'utf-8');
  const urls = extractUrlsFromSitemap(xml);
  if (urls.length === 0) {
    console.warn(`[IndexNow] ⚠ sitemap.xml vide ou format inattendu — fallback`);
    return FALLBACK_URLS;
  }
  return urls;
}

async function pingBatch(urls) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  return res;
}

async function main() {
  const urls = loadUrls();
  console.log(`[IndexNow] pushing ${urls.length} URLs to ${ENDPOINT}`);

  // IndexNow limite à 10 000 URLs par requête — split par batchs de 10k
  const BATCH_SIZE = 10000;
  const batches = [];
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    batches.push(urls.slice(i, i + BATCH_SIZE));
  }

  let okCount = 0;
  let failCount = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const label = batches.length > 1 ? ` (batch ${i + 1}/${batches.length}, ${batch.length} URLs)` : '';

    try {
      const res = await pingBatch(batch);
      if (res.status >= 200 && res.status < 300) {
        console.log(`[IndexNow] ✓ accepted${label} (${res.status})`);
        okCount += batch.length;
      } else if (res.status === 422) {
        const text = await res.text().catch(() => '');
        console.warn(`[IndexNow] ⚠ unprocessable${label} — clé invalide ou host mismatch : ${text.slice(0, 200)}`);
        failCount += batch.length;
      } else if (res.status === 429) {
        console.warn(`[IndexNow] ⚠ rate-limited${label} (429) — réessaye dans quelques heures`);
        failCount += batch.length;
      } else {
        const text = await res.text().catch(() => '');
        console.error(`[IndexNow] ✗ error${label} ${res.status}: ${text.slice(0, 200)}`);
        failCount += batch.length;
      }
    } catch (err) {
      console.error(`[IndexNow] ✗ network error${label}:`, err.message || err);
      failCount += batch.length;
    }
  }

  console.log(`[IndexNow] done — ${okCount} accepted, ${failCount} failed`);
  // NB : on ne fait JAMAIS échouer le build sur un ping IndexNow raté. Un 429
  // (rate-limit) ou une erreur réseau transitoire ne doit pas bloquer un
  // déploiement Cloudflare ni faire perdre le prérendu déjà généré. Le ping
  // est best-effort : Bing re-crawlera de toute façon via le sitemap.
  if (failCount > 0 && okCount === 0) {
    console.warn('[IndexNow] ⚠ aucun ping accepté — ignoré (non bloquant pour le build).');
  }
}

main().catch((err) => {
  console.error('[IndexNow] non-fatal:', err);
  // best-effort : ne bloque pas le build.
});
