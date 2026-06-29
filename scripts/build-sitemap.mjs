/**
 * Generates dist/sitemap.xml with hreflang annotations from radios.json + the
 * static SEO routes. Each public URL ships in two languages (fr + ar), and
 * the diaspora landing pages additionally carry country-targeted hreflang
 * (ar-FR, ar-BE, ar-NL, ar-ES, ar-IT, ar-DE, ar-CA, ar-US).
 *
 *   SITE_URL=https://radiomaroc.ma npm run build
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SITE_URL = (process.env.SITE_URL || 'https://radiolive.ma').replace(/\/+$/, '');

const FREQUENCY_CITIES = [
  'casablanca', 'rabat', 'marrakech', 'fes', 'tanger', 'agadir',
  'oujda', 'meknes', 'kenitra', 'tetouan', 'el-jadida', 'safi',
  'beni-mellal', 'khouribga', 'nador', 'laayoune',
];

const STATIC_ROUTES = [
  { path: '/',                          changefreq: 'daily',   priority: '1.0' },
  { path: '/top-chansons-maroc',        changefreq: 'hourly',  priority: '0.95' },
  { path: '/frequences-radio-maroc',    changefreq: 'weekly',  priority: '0.92' },
  ...FREQUENCY_CITIES.map((c) => ({
    path: `/frequence-radio-${c}`,
    changefreq: 'weekly',
    priority: '0.88',
  })),
  { path: '/top-radio-maroc',           changefreq: 'weekly',  priority: '0.9' },
  { path: '/radio-casablanca',          changefreq: 'weekly',  priority: '0.85' },
  { path: '/radio-rabat',               changefreq: 'weekly',  priority: '0.85' },
  { path: '/radio-marrakech',           changefreq: 'weekly',  priority: '0.85' },
  { path: '/radio-tanger',              changefreq: 'weekly',  priority: '0.85' },
  { path: '/radio-fes',                 changefreq: 'weekly',  priority: '0.85' },
  { path: '/radio-agadir',              changefreq: 'weekly',  priority: '0.85' },
  { path: '/radio-maroc-chaabi',        changefreq: 'weekly',  priority: '0.8' },
  { path: '/radio-maroc-hit',           changefreq: 'weekly',  priority: '0.8' },
  { path: '/radio-maroc-amazigh',       changefreq: 'weekly',  priority: '0.8' },
  { path: '/blog',                      changefreq: 'weekly',  priority: '0.7' },
  { path: '/info',                      changefreq: 'daily',   priority: '0.9' },
];

/**
 * Pack SEO musique marocaine — paires FR + AR avec slugs distincts.
 * Chaque entrée génère 2 URLs (fr + ar) avec hreflang croisé.
 */
const BLOG_LANG_PAIRS = [
  { fr: 'musique-chaabi-marocaine',                 ar: 'al-musiqa-al-chaabia-al-maghribiya' },
  { fr: 'musique-gnawa-maroc',                      ar: 'musiqa-gnawa-al-maghrib' },
  { fr: 'histoire-rap-marocain',                    ar: 'tarikh-al-rap-al-maghribi' },
  { fr: 'elgrandetoto-rappeur-marocain',            ar: 'elgrandetoto-rapper-maghribi' },
  { fr: 'saad-lamjarred-biographie',                ar: 'saad-lamjarred-sira' },
  { fr: 'nass-el-ghiwane-groupe-mythique',          ar: 'nass-el-ghiwane' },
  { fr: 'festival-mawazine-rabat',                  ar: 'mahrajan-mawazine' },
  { fr: 'musique-amazighe-maroc',                   ar: 'al-musiqa-al-amazighiya' },
  { fr: 'top-10-chansons-marocaines-incontournables', ar: 'afdal-10-aghani-maghribiya' },
  { fr: 'meilleures-radios-marocaines-musique-streaming', ar: 'afdal-idaat-maghribiya-musiqa' },
];

const BLOG_SLUGS = [
  // ─── posts originaux (slug FR identique pour AR) ────
  'top-radios-marocaines-2026',
  'quelle-radio-ecouter-au-maroc',
  'histoire-radio-maroc',
  'radio-fm-vs-streaming-maroc',
  'meilleures-radios-musicales-maroc',
  'radio-coran-maroc-guide',
  'radios-amazighes-maroc',
  'radios-sport-maroc',
  'radio-mre-diaspora',
  'radio-2m-vs-medi-1',
  'radio-mawazine-festival',
  'radio-darija-langue',
  'gnaoua-radios-maroc',
  'monetisation-webradio-adsense',
  'radio-streaming-hls',
  'top-animateurs-radio-maroc',
  'radios-feminines-maroc',
  'radio-maroc-podcast',
  'radio-jazz-maroc',
  'radio-classique-maroc',
];

/**
 * Émissions radio — pages dédiées aux animateurs phares.
 * High-volume keywords (8K-15K/mois) — priorité 0.85, weekly.
 */
const EMISSIONS_PAIRS = [
  { fr: '/emissions',                          ar: '/ar/baramij' },
  { fr: '/emissions/conseil-psy-mamoun-dribi', ar: '/ar/baramij/istichara-nafsiya-mamoun-dribi' },
];

/**
 * Pages légales — Privacy, Terms, About, Contact (FR + AR).
 * Indispensables pour AdSense + conformité RGPD/loi 09-08.
 * Priorité basse (0.4), changefreq yearly.
 */
const LEGAL_PAIRS = [
  { fr: '/politique-confidentialite', ar: '/ar/siyasa-khusousia' },
  { fr: '/conditions-utilisation',    ar: '/ar/shoroot-isti3mal' },
  { fr: '/a-propos',                  ar: '/ar/3an' },
  { fr: '/contact',                   ar: '/ar/ittisal' },
];

/**
 * SEO landings — pilier, live, sport, national. FR + AR siblings via hreflang.
 * altPath:null pour les pages sans miroir (pilier FR seul).
 */
const SEO_LANDING_PAIRS = [
  { fr: '/radio-maroc',                ar: null },
  { fr: '/radio-maroc-en-direct',      ar: '/ar/radio-maroc-mubashir' },
  { fr: '/radio-sport-maroc',          ar: '/ar/radio-riyada-maghreb' },
  { fr: '/radio-nationale-marocaine',  ar: '/ar/radio-al-idha3a-al-wataniya' },
];

/**
 * Diaspora URL pairs. Each entry yields 2 sitemap URLs (fr + ar) but with
 * extra hreflang for the country-targeted variant (e.g. ar-FR for /min-faransa).
 */
const DIASPORA = [
  { fr: '/radio-maroc-france',     ar: '/ar/min-faransa',   country: 'ar-FR' },
  { fr: '/radio-maroc-belgique',   ar: '/ar/min-belgika',   country: 'ar-BE' },
  { fr: '/radio-maroc-pays-bas',   ar: '/ar/min-holanda',   country: 'ar-NL' },
  { fr: '/radio-maroc-espagne',    ar: '/ar/min-isbania',   country: 'ar-ES' },
  { fr: '/radio-maroc-italie',     ar: '/ar/min-italia',    country: 'ar-IT' },
  { fr: '/radio-maroc-allemagne',  ar: '/ar/min-almania',   country: 'ar-DE' },
  { fr: '/radio-maroc-canada',     ar: '/ar/min-kanada',    country: 'ar-CA' },
  { fr: '/radio-maroc-amerique',   ar: '/ar/min-amrika',    country: 'ar-US' },
  { fr: '/radio-maroc-mre',        ar: '/ar/lil-jaliya',    country: null },
  { fr: '/radio-maroc-etranger',   ar: '/ar/min-al-kharij', country: null },
];

const escape = (s) =>
  String(s).replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c])
  );

const slugify = (str) =>
  String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Build a <url> entry with fr + ar hreflang siblings. */
function buildUrl(path, today, changefreq, priority, imageLoc) {
  const fr = `${SITE_URL}${path}`;
  const ar = `${SITE_URL}/ar${path === '/' ? '' : path}`;
  const img = imageLoc ? `\n    <image:image><image:loc>${escape(imageLoc)}</image:loc></image:image>` : '';
  return [fr, ar].map((loc) => `  <url>
    <loc>${escape(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${img}
    <xhtml:link rel="alternate" hreflang="fr-MA" href="${escape(fr)}"/>
    <xhtml:link rel="alternate" hreflang="ar-MA" href="${escape(ar)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(fr)}"/>
  </url>`).join('\n');
}

/**
 * Diaspora variant: emits two URLs (fr + ar) with custom paths, plus an
 * extra country-specific hreflang (e.g. ar-FR) when present so Google
 * surfaces the right URL per region.
 */
function buildDiasporaUrl({ fr, ar, country }, today) {
  const frUrl = `${SITE_URL}${fr}`;
  const arUrl = `${SITE_URL}${ar}`;
  const extra = country
    ? `\n    <xhtml:link rel="alternate" hreflang="${country}" href="${escape(arUrl)}"/>`
    : '';

  return [frUrl, arUrl].map((loc) => `  <url>
    <loc>${escape(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.78</priority>
    <xhtml:link rel="alternate" hreflang="fr-MA" href="${escape(frUrl)}"/>
    <xhtml:link rel="alternate" hreflang="ar-MA" href="${escape(arUrl)}"/>${extra}
    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(frUrl)}"/>
  </url>`).join('\n');
}

async function main() {
  const radios = JSON.parse(
    await readFile(resolve(ROOT, 'public/radios.json'), 'utf8')
  );

  const today = new Date().toISOString().split('T')[0];
  const out = [];

  for (const r of STATIC_ROUTES) {
    out.push(buildUrl(r.path, today, r.changefreq, r.priority));
  }
  for (const e of EMISSIONS_PAIRS) {
    const frUrl = `${SITE_URL}${e.fr}`;
    const arUrl = `${SITE_URL}${e.ar}`;
    for (const loc of [frUrl, arUrl]) {
      out.push(`  <url>
    <loc>${escape(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
    <xhtml:link rel="alternate" hreflang="fr-MA" href="${escape(frUrl)}"/>
    <xhtml:link rel="alternate" hreflang="ar-MA" href="${escape(arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${escape(frUrl)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${escape(arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(frUrl)}"/>
  </url>`);
    }
  }
  for (const l of LEGAL_PAIRS) {
    const frUrl = `${SITE_URL}${l.fr}`;
    const arUrl = `${SITE_URL}${l.ar}`;
    for (const loc of [frUrl, arUrl]) {
      out.push(`  <url>
    <loc>${escape(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
    <xhtml:link rel="alternate" hreflang="fr-MA" href="${escape(frUrl)}"/>
    <xhtml:link rel="alternate" hreflang="ar-MA" href="${escape(arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(frUrl)}"/>
  </url>`);
    }
  }
  for (const p of SEO_LANDING_PAIRS) {
    if (p.ar) {
      // Paire FR + AR avec hreflang croisé
      const frUrl = `${SITE_URL}${p.fr}`;
      const arUrl = `${SITE_URL}${p.ar}`;
      for (const loc of [frUrl, arUrl]) {
        out.push(`  <url>
    <loc>${escape(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="fr-MA" href="${escape(frUrl)}"/>
    <xhtml:link rel="alternate" hreflang="ar-MA" href="${escape(arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(frUrl)}"/>
  </url>`);
      }
    } else {
      // Pilier FR seul (pas de miroir AR direct)
      const url = `${SITE_URL}${p.fr}`;
      out.push(`  <url>
    <loc>${escape(url)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <xhtml:link rel="alternate" hreflang="fr-MA" href="${escape(url)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(url)}"/>
  </url>`);
    }
  }
  for (const d of DIASPORA) {
    out.push(buildDiasporaUrl(d, today));
  }
  for (const slug of BLOG_SLUGS) {
    out.push(buildUrl(`/blog/${slug}`, today, 'monthly', '0.7'));
  }
  // Paires FR + AR avec slugs distincts (pack musique marocaine)
  for (const pair of BLOG_LANG_PAIRS) {
    const frUrl = `${SITE_URL}/blog/${pair.fr}`;
    const arUrl = `${SITE_URL}/ar/blog/${pair.ar}`;
    for (const loc of [frUrl, arUrl]) {
      out.push(`  <url>
    <loc>${escape(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
    <xhtml:link rel="alternate" hreflang="fr-MA" href="${escape(frUrl)}"/>
    <xhtml:link rel="alternate" hreflang="ar-MA" href="${escape(arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(frUrl)}"/>
  </url>`);
    }
  }
  // Articles d'actualité (/info) — paires FR + AR avec slugs distincts.
  try {
    const infoMod = await import(
      'file://' + resolve(ROOT, 'src/info/articles.js').replace(/\\/g, '/')
    );
    for (const a of infoMod.ARTICLES || []) {
      const frUrl = `${SITE_URL}/info/${a.slug}`;
      const arUrl = `${SITE_URL}/ar/info/${a.slug_ar || a.slug}`;
      for (const loc of [frUrl, arUrl]) {
        out.push(`  <url>
    <loc>${escape(loc)}</loc>
    <lastmod>${a.dateModified || a.date || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
    <image:image><image:loc>${escape(`${SITE_URL}/info/${a.slug}.webp`)}</image:loc></image:image>
    <xhtml:link rel="alternate" hreflang="fr-MA" href="${escape(frUrl)}"/>
    <xhtml:link rel="alternate" hreflang="ar-MA" href="${escape(arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(frUrl)}"/>
  </url>`);
      }
    }
  } catch (e) { console.warn('sitemap info:', e.message); }

  for (const r of radios) {
    if (!r.name) continue;
    const id = slugify(r.name);
    if (!id) continue;
    // Logo de la station pour l'image sitemap (Google Images).
    const icon = !r.icon
      ? null
      : (/^https?:\/\//i.test(r.icon) ? r.icon : `${SITE_URL}${r.icon.startsWith('/') ? '' : '/'}${r.icon}`);
    out.push(buildUrl(`/station/${id}`,                  today, 'weekly', '0.8', icon));
    out.push(buildUrl(`/station/${id}/historique`,       today, 'hourly', '0.75'));
    out.push(buildUrl(`/station/${id}/top-chansons`,     today, 'daily',  '0.75'));
    out.push(buildUrl(`/station/${id}/chanson-actuelle`, today, 'always', '0.7'));
    // /now/<slug> pages — cluster SEO "quelle chanson passe sur X"
    out.push(buildUrl(`/now/${id}`,                      today, 'hourly', '0.6'));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${out.join('\n')}
</urlset>
`;

  const outDist = resolve(ROOT, 'dist/sitemap.xml');
  const outPublic = resolve(ROOT, 'public/sitemap.xml');
  let target = outPublic;
  try {
    await writeFile(outDist, xml);
    target = outDist;
  } catch (_) {
    await writeFile(outPublic, xml);
  }

  try {
    const robotsPath = resolve(
      target.includes('dist/') ? ROOT + '/dist/robots.txt' : ROOT + '/public/robots.txt'
    );
    let robots = await readFile(robotsPath, 'utf8');
    robots = robots.replace(/^Sitemap:.*$/m, `Sitemap: ${SITE_URL}/sitemap.xml`);
    await writeFile(robotsPath, robots);
  } catch (_) { /* noop */ }

  // Sitemap entries are 2 URLs each (fr + ar), plus an optional extra
  // country-targeted hreflang link (which doesn't add a separate <url>).
  const total = out.length * 2;
  console.log(`✓ sitemap.xml — ${total} URLs (fr + ar + diaspora) → ${target}`);
}

main().catch((err) => {
  console.error('sitemap build failed:', err);
  process.exit(1);
});
