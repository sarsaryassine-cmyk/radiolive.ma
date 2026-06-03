#!/usr/bin/env node
/**
 * Prerender script — VRAI prérendu statique (SSG) via Chromium headless.
 *
 * ─── Pourquoi cette réécriture ──────────────────────────────────────────
 * L'ancienne version n'injectait que 4 balises (<title>, description,
 * canonical, og:url) + le H1 du pre-hero. Le corps de page restait vide :
 * ~48 mots de HTML statique, et AUCUN bloc JSON-LD (rendu uniquement par
 * react-helmet côté client). Conséquence : Google devait exécuter le JS
 * pour voir le contenu (délai + budget de crawl), et Bing / crawlers IA /
 * aperçus sociaux / audits SEO sans JS voyaient une coquille vide.
 *
 * Cette version lance un Chromium headless, sert le build dist/ via un petit
 * serveur HTTP local (avec fallback SPA), navigue sur chaque route prioritaire,
 * attend que React ait monté + que react-helmet ait injecté ses balises +
 * son JSON-LD, puis sérialise le DOM rendu en HTML statique. Résultat :
 *   - contenu textuel complet (descriptions, FAQ, top chansons, liens) en HTML
 *   - JSON-LD (RadioStation, FAQPage, WebSite…) présent dans le HTML livré
 *   - <title>/meta/canonical/hreflang corrects, dédoublonnés
 *
 * ─── Portée (~180 routes prioritaires) ──────────────────────────────────
 *   - home FR + AR
 *   - 50 stations × 2 langues
 *   - landings SEO (pilier, live, sport, national) FR + AR
 *   - 10 pages diaspora × 2 langues
 *   - 6 villes × 2, 3 genres × 2, index fréquences + 16 villes FM × 2
 *   - hubs éditoriaux (top radios, top chansons, blog, émissions) × 2
 * Le reste (articles de blog, sous-pages station, pages chansons) reste servi
 * par le fallback SPA et rendu par Googlebot — décision produit assumée.
 *
 * ─── Robustesse ─────────────────────────────────────────────────────────
 * Si Chromium ne peut pas se lancer (env. de build sans libs), on RETOMBE
 * automatiquement sur l'ancienne injection de balises meta (fonction
 * prerenderMetaOnly) : pas de régression, le build réussit quand même.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, createReadStream } from 'node:fs';
import { resolve, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');
const SITE_URL = (process.env.SITE_URL || 'https://radiolive.ma').replace(/\/+$/, '');
const PORT = Number(process.env.PRERENDER_PORT || 45678);
// Rendu SÉQUENTIEL par défaut (concurrency 1). En headless, Chromium bride le
// requestAnimationFrame des pages non visibles ; or react-helmet-async flush
// ses balises <head> (title/meta/JSON-LD) via rAF. En parallèle, ce flush peut
// donc ne jamais aboutir avant la capture → titre générique + 0 JSON-LD. En
// séquentiel, la page active garde un rAF actif et helmet commit en <1 s.
const CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY || 1);
const BASE = `http://127.0.0.1:${PORT}`;

/* ─── Utilities ─────────────────────────────────────────────────────── */

const slugify = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const importData = (rel) =>
  import('file://' + resolve(ROOT, rel).replace(/\\/g, '/'));

/* ─── Liste des routes prioritaires (paths seuls) ───────────────────── */

async function buildPaths() {
  const paths = new Set(['/', '/ar']);

  // 1. Stations (FR + AR)
  const radios = JSON.parse(await readFile(resolve(ROOT, 'public/radios.json'), 'utf-8'));
  for (const r of radios) {
    const slug = slugify(r.name);
    if (!slug) continue;
    paths.add(`/station/${slug}`);
    paths.add(`/ar/station/${slug}`);
  }

  // 2. Landings SEO (chemins déjà fr/ar dans la data)
  try {
    const { SEO_LANDINGS } = await importData('src/data/seoLandings.js');
    for (const [, l] of Object.entries(SEO_LANDINGS)) if (l?.path) paths.add(l.path);
  } catch (e) { console.warn('[prerender] seoLandings:', e.message); }

  // 3. Diaspora (FR + AR)
  try {
    const { DIASPORA_COUNTRIES } = await importData('src/data/diaspora.js');
    for (const [, c] of Object.entries(DIASPORA_COUNTRIES)) {
      if (c?.fr_path) paths.add(c.fr_path);
      if (c?.ar_path) paths.add(c.ar_path);
    }
  } catch (e) { console.warn('[prerender] diaspora:', e.message); }

  // 4. Villes
  for (const c of ['casablanca', 'rabat', 'marrakech', 'tanger', 'fes', 'agadir']) {
    paths.add(`/radio-${c}`);
    paths.add(`/ar/radio-${c}`);
  }

  // 5. Genres
  for (const g of ['chaabi', 'hit', 'amazigh']) {
    paths.add(`/radio-maroc-${g}`);
    paths.add(`/ar/radio-maroc-${g}`);
  }

  // 6. Fréquences (index + villes FM)
  paths.add('/frequences-radio-maroc');
  paths.add('/ar/frequences-radio-maroc');
  try {
    const { CITY_KEYS } = await importData('src/data/frequencies.js');
    for (const k of CITY_KEYS) {
      paths.add(`/frequence-radio-${k}`);
      paths.add(`/ar/frequence-radio-${k}`);
    }
  } catch (e) { console.warn('[prerender] frequencies:', e.message); }

  // 7. Hubs éditoriaux
  for (const p of [
    '/top-radio-maroc', '/ar/top-radio-maroc',
    '/top-chansons-maroc', '/ar/top-chansons-maroc',
    '/blog', '/ar/blog',
    '/emissions', '/ar/baramij',
    '/emissions/conseil-psy-mamoun-dribi',
    '/ar/baramij/istichara-nafsiya-mamoun-dribi',
  ]) paths.add(p);

  return [...paths];
}

/* ─── Serveur statique local (avec fallback SPA) ────────────────────── */

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.txt': 'text/plain', '.xml': 'application/xml', '.map': 'application/json',
};

function startServer(shellHtml) {
  return new Promise((resolvePromise, reject) => {
    const srv = createServer((req, res) => {
      try {
        const { pathname } = new URL(req.url, BASE);
        const decoded = decodeURIComponent(pathname);
        const ext = extname(decoded);

        // Asset à extension connue → servir depuis le disque.
        if (ext && MIME[ext]) {
          const filePath = join(DIST, decoded);
          // Garde anti-traversal.
          if (filePath.startsWith(DIST) && existsSync(filePath)) {
            res.writeHead(200, { 'Content-Type': MIME[ext] });
            createReadStream(filePath).pipe(res);
            return;
          }
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('not found');
          return;
        }

        // Toute route sans extension → la coquille SPA (en mémoire), JAMAIS un
        // index.html déjà prérendu : garantit un rendu déterministe et frais.
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(shellHtml);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(String(err));
      }
    });
    srv.on('error', reject);
    srv.listen(PORT, '127.0.0.1', () => resolvePromise(srv));
  });
}

/* ─── Écriture d'une route ──────────────────────────────────────────── */

async function writeHtml(route, html) {
  const rel = route.replace(/^\//, '');
  const outPath = rel ? resolve(DIST, rel, 'index.html') : resolve(DIST, 'index.html');
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html, 'utf-8');
}

/* ─── Nettoyage du <head> rendu (dédoublonnage helmet vs template) ──── */
// Exécuté DANS la page. react-helmet-async ajoute ses balises à la fin du
// <head> sans supprimer celles du template index.html → doublons (2 meta
// description, 2 canonical, hreflang contradictoires). On garde la DERNIÈRE
// occurrence (celle de helmet) par clé.
function dedupeHeadInPage() {
  const keepLast = (selector, keyFn) => {
    const els = [...document.head.querySelectorAll(selector)];
    const last = new Map();
    for (const el of els) last.set(keyFn(el), el);
    for (const el of els) if (last.get(keyFn(el)) !== el) el.remove();
  };
  keepLast('meta[name="description"]', () => 'description');
  keepLast('meta[name="robots"]', () => 'robots');
  keepLast('link[rel="canonical"]', () => 'canonical');
  keepLast('meta[property]', (el) => el.getAttribute('property'));
  keepLast('meta[name^="twitter:"]', (el) => el.getAttribute('name'));
  keepLast('link[rel="alternate"]', (el) => el.getAttribute('hreflang') || el.href);

  // Un seul <title>, avec la valeur autoritaire document.title.
  const titles = [...document.head.querySelectorAll('title')];
  titles.slice(0, -1).forEach((t) => t.remove());
  const t = document.head.querySelector('title');
  if (t) t.textContent = document.title;
}

/* ─── Prérendu Puppeteer ────────────────────────────────────────────── */

async function prerenderWithChromium(paths, shellHtml) {
  const puppeteer = (await import('puppeteer')).default;

  const browser = await puppeteer.launch({
    headless: true,
    // PUPPETEER_EXECUTABLE_PATH : permet d'utiliser un Chromium déjà installé
    // (ex. Edge/Chrome système) au lieu du Chrome téléchargé par puppeteer.
    // Sur Cloudflare (Linux) la variable est absente → puppeteer utilise son
    // Chrome téléchargé au `npm install`. En local Windows on peut pointer
    // vers msedge.exe pour éviter un download.
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
      '--disable-gpu', '--no-zygote', '--disable-accelerated-2d-canvas',
      // CRITIQUE : empêche Chromium de brider rAF/timers quand la page n'est
      // pas visible (cas du headless). Sans ça, react-helmet-async (qui flush
      // ses balises <title>/meta/JSON-LD via requestAnimationFrame) peut ne
      // jamais s'appliquer avant la capture → titre générique + 0 JSON-LD.
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
    ],
  });

  // Titre de la coquille : sert de sentinelle pour détecter que react-helmet
  // a bien remplacé le <title> par celui spécifique à la page.
  const SHELL_TITLE = (shellHtml.match(/<title>([^<]*)<\/title>/) || [, ''])[1];

  const server = await startServer(shellHtml);
  console.log(`[prerender] static server on ${BASE}`);

  const queue = [...paths];
  let ok = 0;
  let failed = 0;

  async function worker(workerId) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9' });

    // Bloque tout ce qui n'est pas notre serveur local : API Radio-Browser
    // (sync catalogue en arrière-plan), Google Fonts, etc. → rendu rapide,
    // déterministe et non pollué par des données synchronisées.
    await page.setRequestInterception(true);
    page.on('request', (r) => {
      const u = r.url();
      if (u.startsWith(BASE) || u.startsWith('data:') || u.startsWith('blob:')) r.continue();
      else r.abort();
    });

    const renderOnce = async (route) => {
      await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // 1) Attend que React ait monté un vrai contenu (pas la coquille vide).
      //    Basé sur la longueur du texte rendu (robuste : certaines pages —
      //    légales, listes — n'ont pas toujours de <h1>).
      await page.waitForFunction(
        () => {
          const root = document.getElementById('root');
          return root && root.children.length > 0 && (root.textContent || '').trim().length > 200;
        },
        { timeout: 30000, polling: 200 }
      );
      // 2) Attend que react-helmet ait COMMITÉ ses balises dans le <head>.
      //    Signal fiable et universel : l'attribut `data-rh` que helmet pose
      //    sur chaque balise qu'il gère (title/meta/link/script JSON-LD). Plus
      //    robuste qu'une sentinelle sur le <title> (la home a volontairement
      //    le même titre que la coquille). Timeout généreux car le commit rAF
      //    de helmet est ralenti quand plusieurs pages rendent en parallèle.
      try {
        await page.waitForFunction(
          () => !!document.head.querySelector('[data-rh]'),
          { timeout: 25000, polling: 200 }
        );
      } catch { /* on capture quand même */ }
      // 3) Petite stabilisation (framer-motion opacity 0 → 1, derniers effets).
      await new Promise((r) => setTimeout(r, 300));
      await page.evaluate(dedupeHeadInPage);

      let html = await page.content();
      if (!/^<!doctype/i.test(html)) html = '<!doctype html>\n' + html;
      await writeHtml(route, html);
    };

    for (;;) {
      const route = queue.shift();
      if (!route) break;
      let lastErr = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          await renderOnce(route);
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
        }
      }
      if (lastErr) {
        failed++;
        console.error(`[prerender] ✗ ${route}: ${lastErr.message}`);
      } else {
        ok++;
        if (ok % 20 === 0) console.log(`[prerender] … ${ok} routes ok`);
      }
    }
    await page.close();
  }

  await Promise.all(
    Array.from({ length: Math.max(1, CONCURRENCY) }, (_, i) => worker(i))
  );

  await browser.close();
  await new Promise((r) => server.close(r));
  return { ok, failed };
}

/* ─── Fallback : injection de balises meta (ancien comportement) ────── */
// Utilisé UNIQUEMENT si Chromium ne se lance pas. Garantit qu'au pire on
// retrouve le comportement historique (meta par route) sans régression.

const htmlEscape = (s) =>
  String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function customizeMeta(template, { title, description, h1, canonical, lang = 'fr' }) {
  let html = template;
  const esc = htmlEscape;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${esc(description)}" />`
  );
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${esc(canonical)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${esc(canonical)}" />`
  );
  html = html.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${esc(h1)}</h1>`);
  if (lang === 'ar') {
    html = html.replace(
      /<html\s+lang="[^"]*"\s+class="dark"\s*>/,
      '<html lang="ar" dir="rtl" class="dark">'
    );
  }
  return html;
}

async function buildMetaRoutes() {
  const routes = [];
  const radios = JSON.parse(await readFile(resolve(ROOT, 'public/radios.json'), 'utf-8'));
  for (const r of radios) {
    const slug = slugify(r.name);
    if (!slug) continue;
    routes.push({
      path: `/station/${slug}`,
      title: `Écouter ${r.name} en direct | Radio Maroc`,
      description: `Écoutez ${r.name} en direct en streaming HD gratuit sur radiolive.ma. Sans inscription, sans téléchargement, 24h/24, depuis le Maroc ou la diaspora.`,
      h1: r.name, canonical: `${SITE_URL}/station/${slug}`, lang: 'fr',
    });
    routes.push({
      path: `/ar/station/${slug}`,
      title: `استمع إلى ${r.name} مباشرة | إذاعات المغرب`,
      description: `استمع إلى ${r.name} مباشرة بجودة عالية على radiolive.ma. مجاناً، بدون تسجيل، على مدار الساعة من المغرب أو من الخارج.`,
      h1: r.name, canonical: `${SITE_URL}/ar/station/${slug}`, lang: 'ar',
    });
  }
  try {
    const { SEO_LANDINGS } = await importData('src/data/seoLandings.js');
    for (const [, l] of Object.entries(SEO_LANDINGS)) {
      const isAr = l.lang === 'ar' || l.path.startsWith('/ar/');
      routes.push({ path: l.path, title: l.title, description: l.description, h1: l.h1, canonical: `${SITE_URL}${l.path}`, lang: isAr ? 'ar' : 'fr' });
    }
  } catch { /* ignore */ }
  try {
    const { DIASPORA_COUNTRIES } = await importData('src/data/diaspora.js');
    for (const [, c] of Object.entries(DIASPORA_COUNTRIES)) {
      routes.push({ path: c.fr_path, title: c.fr_title, description: c.fr_description, h1: c.fr_h1, canonical: `${SITE_URL}${c.fr_path}`, lang: 'fr' });
      routes.push({ path: c.ar_path, title: c.ar_title, description: c.ar_description, h1: c.ar_h1, canonical: `${SITE_URL}${c.ar_path}`, lang: 'ar' });
    }
  } catch { /* ignore */ }
  return routes;
}

async function prerenderMetaOnly(template) {
  const routes = await buildMetaRoutes();
  let ok = 0;
  for (const route of routes) {
    try {
      await writeHtml(route.path, customizeMeta(template, route));
      ok++;
    } catch (err) {
      console.error(`[prerender:meta] ✗ ${route.path}: ${err.message}`);
    }
  }
  return ok;
}

/* ─── Main ─────────────────────────────────────────────────────────── */

async function main() {
  console.log('[prerender] reading dist/index.html …');
  const template = await readFile(resolve(DIST, 'index.html'), 'utf-8');

  const paths = await buildPaths();
  console.log(`[prerender] ${paths.length} priority routes`);

  try {
    const { ok, failed } = await prerenderWithChromium(paths, template);
    console.log(`[prerender] ✓ ${ok} routes rendered (SSG)${failed ? `, ✗ ${failed} failed` : ''}`);
    if (ok === 0) throw new Error('0 route rendered — falling back to meta injection');
  } catch (err) {
    console.warn(`[prerender] Chromium unavailable (${err.message}). Falling back to meta-only injection.`);
    const ok = await prerenderMetaOnly(template);
    console.log(`[prerender] ✓ ${ok} routes meta-injected (fallback)`);
  }
}

main().catch((err) => {
  console.error('[prerender] fatal:', err);
  process.exit(1);
});
