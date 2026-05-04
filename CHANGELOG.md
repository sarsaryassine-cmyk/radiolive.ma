# Changelog

## 2026-04-30 — Pack SEO musique marocaine (10 articles bilingues FR+AR)

### Articles ajoutés (10 paires, 20 URLs)

| # | FR slug | AR slug | Mots-clé principal |
| - | --- | --- | --- |
| 1 | `/blog/musique-chaabi-marocaine` | `/ar/blog/al-musiqa-al-chaabia-al-maghribiya` | musique chaabi marocaine |
| 2 | `/blog/musique-gnawa-maroc` | `/ar/blog/musiqa-gnawa-al-maghrib` | musique gnawa |
| 3 | `/blog/histoire-rap-marocain` | `/ar/blog/tarikh-al-rap-al-maghribi` | rap marocain |
| 4 | `/blog/elgrandetoto-rappeur-marocain` | `/ar/blog/elgrandetoto-rapper-maghribi` | ElGrandeToto |
| 5 | `/blog/saad-lamjarred-biographie` | `/ar/blog/saad-lamjarred-sira` | Saad Lamjarred |
| 6 | `/blog/nass-el-ghiwane-groupe-mythique` | `/ar/blog/nass-el-ghiwane` | Nass El Ghiwane |
| 7 | `/blog/festival-mawazine-rabat` | `/ar/blog/mahrajan-mawazine` | Festival Mawazine |
| 8 | `/blog/musique-amazighe-maroc` | `/ar/blog/al-musiqa-al-amazighiya` | musique amazighe |
| 9 | `/blog/top-10-chansons-marocaines-incontournables` | `/ar/blog/afdal-10-aghani-maghribiya` | chansons marocaines incontournables |
| 10 | `/blog/meilleures-radios-marocaines-musique-streaming` | `/ar/blog/afdal-idaat-maghribiya-musiqa` | meilleures radios marocaines musique |

### Infrastructure étendue
- **`src/blog/posts.js`** : format étendu — `slug_ar`, `title_ar`, `excerpt_ar`,
  `body_ar`, `keywords_ar`, `tags`, `relatedStations` (IDs), `relatedArticles`
  (slugs FR). Index `POST_BY_SLUG_AR` exporté + helper `slugForLang(post, lang)`.
- **`src/pages/BlogPostPage.jsx`** : bilingue, lookup `POST_BY_SLUG_AR` quand
  `lang='ar'`, hreflang croisé fr-MA/ar-MA/x-default avec slugs distincts,
  JSON-LD `Article` (avec `inLanguage`), bloc "Stations à écouter" (3 cards
  avec play instantané), bloc "Articles liés" (slugs explicites + fallback
  par tags).
- **`src/pages/BlogIndexPage.jsx`** : UI chrome bilingue, tri date desc,
  génération URL FR/AR via `slugForLang`.
- **`src/pages/StationPage.jsx`** : nouveau bloc "Articles liés" (filtre
  POSTS où `relatedStations.includes(station.id)`).
- **`src/pages/Home.jsx`** : nouvelle section "Articles récents" (3 derniers
  posts) sous la grille de stations.
- **`scripts/build-sitemap.mjs`** : nouvelle constante `BLOG_LANG_PAIRS`
  pour générer 20 URLs (10 FR + 10 AR) avec hreflang croisés
  (priorité 0.75, changefreq monthly).

### SEO par article
- Meta title 60c + meta description 155c (du markdown source)
- Canonical absolue + alternates fr-MA / ar-MA / x-default
- JSON-LD `Article` avec `headline`, `datePublished`, `dateModified`,
  `inLanguage`, `author` (Organization), `publisher`, `mainEntityOfPage`,
  `articleSection`, `keywords`
- JSON-LD `BreadcrumbList` : Accueil > Blog > [titre]
- Open Graph `og:type=article` via `<Seo type="article">`

### Maillage interne
- Cross-links explicites entre articles (ex. "Histoire du rap marocain"
  ↔ "ElGrandeToto" ↔ "Top 10 chansons")
- Liens depuis le corps des articles vers stations RÉELLES du catalogue
  (les noms placeholders type "Hit Radio Mgharba" / "Hit Radio Urban"
  pointent vers les stations existantes les plus proches)
- Bloc "Articles liés" sur chaque page station (1-3 articles maximum)
- Bloc "Articles récents" sur Home (3 derniers posts)

### Translation AR
Traduction native MSA avec phrasings marocains naturels :
- Termes techniques arabisés (الكنبري, القرقبات, البندير, الكمنجة, التعريجة)
- Noms propres : translittération arabe pour les artistes traditionnels
  (ناس الغيوان, الحسين السلاوي, الداودي, الحاجة الحمداوية), latin conservé
  pour les artistes contemporains (ElGrandeToto, Saad Lamjarred, Stormy)
- Idiomatique pour la diaspora ("بلاد المهجر", "أبناء الجالية", "البلد الأم")
- Aucun auto-translate

## 2026-04-28 — Arabic localization + diaspora SEO

### Bilingual UI (fr / ar)
- Rewrote `src/i18n/strings.js` as a namespaced two-language dictionary
  (~200 keys per language) covering meta, nav, header, sidemenu, search,
  loader, hero, card, player, station, favorites, empty, error, toast,
  ad, footer, common.
- Added `makeT(strings)` helper supporting nested keys (e.g.
  `t('player.play')`) and `{placeholder}` substitution.
- Upgraded `useI18n()`:
  - URL prefix (`/ar/*`) remains the source of truth.
  - First visit: auto-redirect Arabic browsers (`navigator.language`
    starting with `ar`) to `/ar/*` once.
  - Subsequent manual switches persist in `localStorage` under
    `preferred_locale` and become authoritative over auto-detect.
  - Sets `<html lang>` and `<html dir>` reactively.
  - Returns `{ lang, t, strings, switchLang }`.
- Wired all UI components to `t()`:
  Header, SideMenu, SearchBar, Loader, RadioCard, AudioPlayer
  (NowPlaying / connecting / paused / live), Favorites, AdBanner
  (label + placeholder), Home (CompactHero, EmptySearch, ErrorState),
  App (Footer + SyncToast).
- Added `categoryLabel(cat, lang)` + `CATEGORY_LABELS_I18N` so the
  SideMenu category headings localize. Original `CATEGORY_LABELS`
  export kept for back-compat.

### Diaspora landing pages (10 FR + 10 AR mirrors)
New `src/data/diaspora.js` holds 10 country entries (~500 words native
Arabic + ~500 words native French each, no auto-translation):

| Country     | FR URL                       | AR URL              | hreflang |
| ----------- | ---------------------------- | ------------------- | -------- |
| France      | `/radio-maroc-france`        | `/ar/min-faransa`   | `ar-FR`  |
| Belgique    | `/radio-maroc-belgique`      | `/ar/min-belgika`   | `ar-BE`  |
| Pays-Bas    | `/radio-maroc-pays-bas`      | `/ar/min-holanda`   | `ar-NL`  |
| Espagne     | `/radio-maroc-espagne`       | `/ar/min-isbania`   | `ar-ES`  |
| Italie      | `/radio-maroc-italie`        | `/ar/min-italia`    | `ar-IT`  |
| Allemagne   | `/radio-maroc-allemagne`     | `/ar/min-almania`   | `ar-DE`  |
| Canada      | `/radio-maroc-canada`        | `/ar/min-kanada`    | `ar-CA`  |
| États-Unis  | `/radio-maroc-amerique`      | `/ar/min-amrika`    | `ar-US`  |
| MRE (hub)   | `/radio-maroc-mre`           | `/ar/lil-jaliya`    | `ar`     |
| Étranger    | `/radio-maroc-etranger`      | `/ar/min-al-kharij` | `ar`     |

- `src/pages/DiasporaPage.jsx` renders the country-targeted copy with
  Schema.org WebPage (`inLanguage`, `geographicArea` country code),
  BreadcrumbList, plus a featured grid of the 8 most-listened stations.
- All 20 routes (10 FR + 10 AR) wired in `App.jsx`.
- `src/components/DiasporaBlock.jsx` renders a 10-card grid on the AR
  home page (only) so MRE visitors land directly on their country.

### Arabic home content
- `src/pages/HomeContentAr.jsx` — ~750 words of native Arabic SEO copy
  targeting "إذاعات مغربية مباشر", "راديو المغرب أون لاين",
  "إذاعة المغرب من الخارج"; rendered by `Home.jsx` when `lang === 'ar'`
  in place of the existing French `SeoCopy`.

### SEO / sitemap / robots
- `scripts/build-sitemap.mjs` adds the 10 diaspora pairs with
  country-targeted hreflang (`ar-FR`, `ar-BE`, `ar-NL`, `ar-ES`,
  `ar-IT`, `ar-DE`, `ar-CA`, `ar-US`).
- `Seo.jsx`:
  - Accepts `lang` and `alternates` props for per-page hreflang.
  - Brand name + default title/description switch to Arabic when
    `lang === 'ar'`.
  - `og:locale` reflects active language; alternate locale exposed via
    `og:locale:alternate`.
  - `organizationJsonLd(lang)`, `websiteJsonLd(lang)`,
    `radioStationJsonLd(radio, lang)` all take the active language so
    `inLanguage` matches the rendered page.
- AR titles/meta added to: Home, StationPage, TopPage,
  FrequenciesIndexPage, DiasporaPage. Each emits the fr/ar hreflang
  pair plus `x-default`.
- `public/robots.txt` explicitly allows `/ar/` and `/fr/` for Googlebot,
  Bingbot, Googlebot-Image; disallows `/songs/` (internal seed data).

### Notes
- Long-form prose (the 35 station descriptions, 30 blog articles, 6
  city pages, 3 genre pages, top page body) is **not** translated in
  this pass — those bodies remain French and will be ported by a
  professional native Arabic speaker in a later phase.
