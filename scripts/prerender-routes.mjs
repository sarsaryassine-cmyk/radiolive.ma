#!/usr/bin/env node
/**
 * Prerender script — génère un index.html statique par route avec title,
 * meta description, canonical et pre-hero h1 spécifiques à chaque page.
 *
 * Pourquoi : sans ce script, le SPA fallback "/* /index.html 200" sert le
 * même HTML (avec le title de la home) pour TOUTES les URLs. Conséquence :
 *   - Bingbot sans JS rendering voit "Radio Maroc en direct & en ligne…" sur
 *     /station/radio-mars au lieu de "Écouter Radio Mars en direct"
 *   - Les link previews (WhatsApp, Twitter, Facebook, LinkedIn) qui ne
 *     parsent que le HTML statique affichent le titre de la home pour
 *     chaque station partagée
 *   - SemRush / Ahrefs / autres audits avec JS off voient un site uniforme
 *
 * Solution : à chaque build, on génère dist/{path}/index.html avec les
 * vrais tags méta pour chaque route. Le pre-hero h1 statique est aussi
 * customisé (il sera supprimé par le MutationObserver dès que React monte,
 * donc 0 conflit visuel).
 *
 * Routes couvertes (~140) :
 *   - 50 stations × 2 langues (FR + AR)        = 100 routes
 *   - 4 SEO landings × 2 langues               = 8 routes
 *   - 10 diaspora landings × 2 langues         = 20 routes
 *
 * Routes non couvertes (servies par SPA fallback générique) :
 *   - Sous-pages station (historique, top-chansons, chanson-actuelle)
 *   - Pages city (Casablanca, Rabat…), genre, fréquences, blog, émissions
 *   - Pages légales (déjà bien titrées via React Helmet)
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');
const SITE_URL = (process.env.SITE_URL || 'https://radiolive.ma').replace(/\/+$/, '');

/* ─── Utilities ─────────────────────────────────────────────────────── */

const slugify = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const htmlEscape = (s) =>
  String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/* ─── Customize the base HTML for a single route ────────────────────── */

function customize(template, { title, description, h1, canonical, lang = 'fr' }) {
  let html = template;

  const esc = htmlEscape;

  // <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${esc(title)}</title>`
  );

  // <meta name="description">
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${esc(description)}" />`
  );

  // <link rel="canonical">
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${esc(canonical)}" />`
  );

  // <meta property="og:url">
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${esc(canonical)}" />`
  );

  // Pre-hero h1 — le texte visuel rendu avant que React monte. Sera
  // remplacé par le H1 React via MutationObserver dans index.html.
  // Pour les pages AR, on retire le span "accent" et on injecte le texte AR brut.
  if (lang === 'ar') {
    html = html.replace(
      /<h1>[\s\S]*?<\/h1>/,
      `<h1>${esc(h1)}</h1>`
    );
  } else {
    html = html.replace(
      /<h1>[\s\S]*?<\/h1>/,
      `<h1>${esc(h1)}</h1>`
    );
  }

  // <html lang="…" + dir="…"> — pour les pages AR
  if (lang === 'ar') {
    html = html.replace(
      /<html\s+lang="[^"]*"\s+class="dark"\s*>/,
      '<html lang="ar" dir="rtl" class="dark">'
    );
  }

  return html;
}

/* ─── Write a single route ─────────────────────────────────────────── */

async function writeRoute(template, route) {
  const html = customize(template, route);
  const relPath = route.path.replace(/^\//, '');
  const outPath = resolve(DIST, relPath, 'index.html');
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html, 'utf-8');
}

/* ─── Build the routes list ────────────────────────────────────────── */

async function buildRoutes() {
  const routes = [];

  // 1. Stations (FR + AR mirror)
  const radiosRaw = await readFile(resolve(ROOT, 'public/radios.json'), 'utf-8');
  const radios = JSON.parse(radiosRaw);
  for (const r of radios) {
    const slug = slugify(r.name);
    if (!slug) continue;

    // FR /station/:slug
    routes.push({
      path: `/station/${slug}`,
      title: `Écouter ${r.name} en direct | Radio Maroc`,
      description: `Écoutez ${r.name} en direct en streaming HD gratuit sur radiolive.ma. Sans inscription, sans téléchargement, 24h/24, depuis le Maroc ou la diaspora.`,
      h1: r.name,
      canonical: `${SITE_URL}/station/${slug}`,
      lang: 'fr',
    });

    // AR /ar/station/:slug
    routes.push({
      path: `/ar/station/${slug}`,
      title: `استمع إلى ${r.name} مباشرة | إذاعات المغرب`,
      description: `استمع إلى ${r.name} مباشرة بجودة عالية على radiolive.ma. مجاناً، بدون تسجيل، على مدار الساعة من المغرب أو من الخارج.`,
      h1: r.name,
      canonical: `${SITE_URL}/ar/station/${slug}`,
      lang: 'ar',
    });
  }

  // 2. SEO landings (depuis seoLandings.js)
  const { SEO_LANDINGS } = await import(
    'file://' + resolve(ROOT, 'src/data/seoLandings.js').replace(/\\/g, '/')
  );
  for (const [, landing] of Object.entries(SEO_LANDINGS)) {
    const isAr = landing.lang === 'ar' || landing.path.startsWith('/ar/');
    routes.push({
      path: landing.path,
      title: landing.title,
      description: landing.description,
      h1: landing.h1,
      canonical: `${SITE_URL}${landing.path}`,
      lang: isAr ? 'ar' : 'fr',
    });
  }

  // 3. Diaspora pages (FR + AR)
  const { DIASPORA_COUNTRIES } = await import(
    'file://' + resolve(ROOT, 'src/data/diaspora.js').replace(/\\/g, '/')
  );
  for (const [, country] of Object.entries(DIASPORA_COUNTRIES)) {
    // FR
    routes.push({
      path: country.fr_path,
      title: country.fr_title,
      description: country.fr_description,
      h1: country.fr_h1,
      canonical: `${SITE_URL}${country.fr_path}`,
      lang: 'fr',
    });
    // AR
    routes.push({
      path: country.ar_path,
      title: country.ar_title,
      description: country.ar_description,
      h1: country.ar_h1,
      canonical: `${SITE_URL}${country.ar_path}`,
      lang: 'ar',
    });
  }

  return routes;
}

/* ─── Main ─────────────────────────────────────────────────────────── */

async function main() {
  console.log('[prerender] reading dist/index.html …');
  const template = await readFile(resolve(DIST, 'index.html'), 'utf-8');

  console.log('[prerender] building routes list …');
  const routes = await buildRoutes();
  console.log(`[prerender] ${routes.length} routes to generate`);

  let ok = 0;
  let failed = 0;
  for (const route of routes) {
    try {
      await writeRoute(template, route);
      ok++;
    } catch (err) {
      console.error(`[prerender] ✗ ${route.path}: ${err.message}`);
      failed++;
    }
  }

  console.log(`[prerender] ✓ ${ok} routes generated`);
  if (failed > 0) {
    console.error(`[prerender] ✗ ${failed} failed`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[prerender] fatal:', err);
  process.exit(1);
});
