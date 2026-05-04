# STACK Discovery — radiolive.ma

> Audit réalisé le 2026-05-01 avant exécution Phase 1.
> But : éviter le travail en double (cf. règle "don't redo work").

## Framework & build

| Item | Détail |
|---|---|
| Framework | **React 18.3** + **Vite 5.4** (SPA, pas Next.js, pas Astro) |
| Routing | `react-router-dom` v7 — toutes les routes déclarées dans `src/App.jsx` |
| Type | Single-Page Application client-side (pas de SSR / SSG) |
| Hydratation SEO | `react-helmet-async` injecte `<title>`, `<meta>`, `<link>` au runtime ; Googlebot exécute JS donc OK |
| CSS | **Tailwind CSS v3** (config `tailwind.config.js`) avec `darkMode: 'class'` |
| Package manager | **npm** (lockfile `package-lock.json`) |
| Node | non spécifié dans engines, mais Vite 5 nécessite Node ≥18. Recommandé : 20 LTS |
| Animations | `framer-motion` 11.x |
| 3D | `three` (custom shader, pas R3F après refacto) |
| Audio | `howler` (lazy) + `hls.js` (lazy) |
| Smooth scroll | `lenis` (lazy, désactivé sur mobile) |
| Icons | `lucide-react` |

## i18n — déjà en place

- **Custom hook maison** (`src/i18n/useI18n.js`), pas de lib externe (pas next-intl, pas react-i18next).
- Dictionnaire centralisé `src/i18n/strings.js` avec ~200 clés × 2 langues, namespacé (`meta`, `nav`, `header`, `sidemenu`, `search`, `loader`, `hero`, `card`, `player`, `station`, `favorites`, `empty`, `error`, `toast`, `ad`, `footer`, `common`).
- `makeT(strings)` helper avec substitution `{placeholder}`.
- Source de vérité = URL prefix `/ar/...`. Pas de `messages/fr.json` / `messages/ar.json`.
- **localStorage `preferred_locale`** persisté sur switch.
- **Auto-détection `navigator.language`** au premier visit (Arabic → redirect /ar).
- `<html lang>` et `<html dir>` synchronisés réactivement.
- Bouton de switch wired dans `Header.jsx` (déjà connecté au state i18n).
- **Audio playback ininterrompu** lors du switch (state stocké dans AppContext, pas reload).

## Routing & pages — déjà en place

```
/                     → Home (dashboard live)
/station/:slug        → 35 pages stations (RadioStation schema + FAQPage pour 4 stations)
/top-radio-maroc      → Top 10 stations
/top-chansons-maroc   → Top 50 chansons
/frequences-radio-maroc + /frequence-radio-:ville (×16)  → fréquences FM par ville
/radio-:ville         → 6 pages villes (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir)
/radio-maroc-:genre   → 3 pages genre (chaabi, hit, amazigh)
/radio-maroc          → pilier éditorial encyclopédique (~1100 mots)
/radio-maroc-en-direct → live hub
/radio-sport-maroc    → vertical sport
/radio-nationale-marocaine → SNRT
/radio-maroc-:pays    → 10 pages diaspora (France, Belgique, Pays-Bas, Espagne, Italie, Allemagne, Canada, USA, MRE, Étranger)
/blog + /blog/:slug   → 40 articles (30 originaux + 10 nouveaux musique)
```
Toutes ces routes ont leur miroir AR (`/ar/...`).
**Slugs AR distincts** pour les articles musique (ex. `/ar/blog/al-musiqa-al-chaabia-al-maghribiya`).

## SEO — déjà implémenté

| Item | Statut | Détail |
|---|---|---|
| `<meta viewport>` | ✅ | `index.html` |
| `<meta theme-color>` | ✅ | `#0b0a14` |
| `react-helmet-async` `<Seo>` component | ✅ | `src/components/Seo.jsx` — props `title`/`description`/`canonical`/`alternates`/`lang`/`jsonLd`/`type` |
| Open Graph | ✅ | `og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `og:locale`, `og:locale:alternate`, `og:site_name` |
| Twitter Card | ✅ | `summary_large_image` |
| Canonical absolu | ✅ | toutes les pages |
| Hreflang | ✅ partiel | `fr-MA`, `ar-MA`, `x-default` partout. **Manque** `fr` et `ar` simples (cf. tâche 1.3) |
| JSON-LD `WebSite` | ✅ | Home, avec `SearchAction` |
| JSON-LD `Organization` | ✅ | Home, avec `sameAs` placeholder (réseaux sociaux à remplir) |
| JSON-LD `RadioStation` | ✅ | toutes pages stations, avec `broadcastFrequency` (BroadcastFrequencySpecification), `areaServed` (Country MA + Worldwide), `parentOrganization`, `image`, `audio`, `inLanguage` |
| JSON-LD `RadioBroadcastService` | ❌ | **Tâche 1.2 demande ce type spécifique. À ajouter en complément.** |
| JSON-LD `BreadcrumbList` | ✅ | toutes pages secondaires |
| JSON-LD `FAQPage` | ✅ | 4 SEO landings + 4 pages stations (Radio Mars, Hit Radio, Medi 1, Chada FM) |
| JSON-LD `Article` | ✅ | 40 articles blog avec `inLanguage`, `datePublished`, `mainEntityOfPage` |
| JSON-LD `WebPage` | ✅ | SEO landings + diaspora |
| `sitemap.xml` | ✅ | 454 URLs auto-générées via `scripts/build-sitemap.mjs` (postbuild). Inclut Home, stations, fréquences, villes, genres, SEO landings, diaspora, blog. Hreflang croisés. |
| `robots.txt` | ✅ | `public/robots.txt` — Allow `/`, `/ar/`, `/fr/`, Disallow `/radioDescriptions.json`, `/radios.json`, `/songs/`. Sitemap declared. |
| `llms.txt` | ✅ | nouveau fichier IA-readable |
| `favicon.svg` | ✅ | logo officiel statique |

## Build & deploy

- **Cloudflare Pages** ciblé (fichiers `public/_redirects` + `public/_headers` présents)
- `_redirects` : SPA fallback `/* → /index.html 200` + 3 x 301 SEO consolidations
- `_headers` : cache `/assets/*` 1 an immutable, headers sécurité (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- Build commande : `npm run build` (Vite + postbuild sitemap)
- Output : `dist/`
- **Variable d'env** `SITE_URL` lue par `scripts/build-sitemap.mjs` (fallback `https://radiolive.ma`)

## Pages stations — où elles vivent

- Composant : `src/pages/StationPage.jsx`
- Route : `/station/:slug` (et miroir `/ar/station/:slug`)
- Source de données : `public/radios.json` (35 stations) → enrichi par `useCatalog()` hook avec slugs, gradients, descriptions, catégories
- JSON-LD courant : `radioStationJsonLd(radio, lang)` dans `src/components/Seo.jsx`
- Sections : Hero (logo + play), description, top songs, FAQ (si station ∈ STATION_FAQS), articles liés, related stations

## Layout components réutilisés

- `src/components/Seo.jsx` — meta SEO réutilisable (TOUJOURS utiliser, ne pas réinventer)
- `src/components/Header.jsx` — header sticky avec logo + nav + lang switch + theme toggle
- `src/components/SideMenu.jsx` — drawer left avec catégories + shortcuts SEO
- `src/components/AudioPlayer.jsx` — player bas + modal mobile fullscreen
- `src/components/RadioCard.jsx` — card station réutilisable
- `src/components/RadioMarocLogo.jsx` — logo SVG inline animé
- `src/components/SceneBackground.jsx` — background WebGL (CSS fallback mobile)

## Phase 1 — état d'avancement vis-à-vis des 7 tâches

| Tâche | État | Action requise |
|---|---|---|
| **1.1** Bilingual setup FR + AR + RTL | ✅ **DÉJÀ FAIT** | aucune (custom i18n, dir/lang réactifs, navigator detect, localStorage, dictionnaire 200 clés) |
| **1.2** Schema station pages | ⚠️ **PARTIEL** | Implémenté `RadioStation` au lieu de `RadioBroadcastService` (les deux sont valides). Tâche demande explicitement `RadioBroadcastService` → **ajouter ce type en complément** ou switcher |
| **1.3** Hreflang site-wide | ⚠️ **PARTIEL** | `fr-MA` + `ar-MA` + `x-default` partout. **Manque** `fr` et `ar` simples (rare en 2026 mais dans la spec) |
| **1.4** Sitemap + robots.txt | ✅ **DÉJÀ FAIT** | aucune (454 URLs, `<changefreq>` cohérents avec spec) |
| **1.5** Page Conseil psy Mamoun Dribi | ❌ **PAS FAIT** | À créer FR + AR (~1000 mots chacun + FAQ + schemas) |
| **1.6** 5 articles musique | ✅ **DÉJÀ FAIT (×2)** | 10 articles déjà déployés (FR + AR), dont les 5 demandés (Chaabi, ElGrandeToto, Saad Lamjarred, Histoire rap, Meilleures radios musique). |
| **1.7** INDEXING doc | ❌ **PAS FAIT** | Créer `seo-progress/INDEXING.md` |

## Blockers identifiés

- 🚩 **Fichier `/rapport-seo-radio-co-ma-vs-radiolive-ma.md` introuvable** (pas dans le projet, pas dans Downloads). Sans cette analyse compétitive, je n'ai pas le détail des keywords visés ni le positionnement actuel de radio.co.ma. Heureusement, la Tâche 1.5 cite explicitement le keyword principal ("Conseil psy Mamoun Dribi" — 8K-15K recherches/mois) qui suffit pour exécuter ce livrable.
- 🚩 **Méthode i18n non standard** : la spec demande `next-intl` / `react-i18next` selon le stack. Le projet utilise un custom hook qui fait déjà tout ce que la spec demande (RTL, persistence, auto-detect). **Switcher sur react-i18next serait un refactor lourd sans valeur ajoutée.** Recommandation : conserver l'implémentation actuelle, qui est plus légère et fait le job.
- 🚩 **Slugs AR translittérés** : la spec Tâche 1.5 demande `/ar/baramij/istichara-nafsiya-mamoun-dribi`. Mon infrastructure actuelle supporte slugs distincts par langue (`slug` + `slug_ar`), donc OK pour cette page.
