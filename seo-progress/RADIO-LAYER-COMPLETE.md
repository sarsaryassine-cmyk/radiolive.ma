# Radio Data Layer — Complete (2026-05-02)

## Architecture livrée

```
                        ┌──────────────────────────────┐
                        │  Radio Browser API           │
                        │  (mirrors de1/nl1/fr1/at1)   │
                        └───────────────┬──────────────┘
                                        │ npm run sync:all (idempotent)
                                        ▼
                        ┌──────────────────────────────┐
                        │ data/stations-source.json    │  ← 66 stations enrichies
                        │  + public/logos/<slug>.<ext> │     (radio-browser + manuelles)
                        └───────────────┬──────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
┌─────────────────┐          ┌─────────────────────┐         ┌─────────────────────┐
│  Cloudflare     │          │ Cloudflare Pages    │         │  React SPA           │
│  Worker         │ ──────▶  │ Function /now/:slug │ ──────▶ │  /now/:slug          │
│  /api/now-      │   GET    │  (SSR meta)         │ HTML+   │  hydrate + display   │
│  playing/:slug  │          │                     │  meta   │                      │
└─────────────────┘          └─────────────────────┘         └─────────────────────┘
        │                                                              ▲
        │ KV cache 30s + iTunes Search artwork                        │
        ▼                                                              │
┌─────────────────────┐                                                │
│ ICY metadata fetch  │       fallback                                 │
│ (Icy-MetaData: 1,   │ ──────────────────────────────────────────────┘
│  parse StreamTitle) │       static cron JSON
└─────────────────────┘       /songs/now-playing.json
```

## Files créés

| Path | Rôle |
|---|---|
| `scripts/sync-stations.mjs` | Sync Radio Browser → `data/stations-source.json`. Idempotent. Préserve overrides manuels. |
| `scripts/sync-logos.mjs` | Download favicons → `public/logos/<slug>.<ext>`. N'écrase pas les logos locaux. |
| `data/stations-source.json` | **NEW** Catalogue enrichi 66 stations (slug, names FR/AR, stream_url, codec, bitrate, logo, tags, language, homepage, frequencies, stationuuid, geo, _source, _last_synced, _manual_overrides). |
| `workers/now-playing/wrangler.toml` | Config Worker Cloudflare (KV namespace, route, env vars CORS + rate limit). |
| `workers/now-playing/src/index.js` | Worker JS — endpoint `GET /api/now-playing/:slug`. ICY + iTunes + KV cache 30s. |
| `workers/now-playing/package.json` | Deps wrangler. |
| `workers/now-playing/README.md` | Procédure complète : login Cloudflare, créer KV, dev local, deploy, tests. |
| `functions/now/[slug].js` | Cloudflare Pages Function — SSR meta injection sur `/now/:slug` FR. |
| `functions/ar/now/[slug].js` | Idem en miroir AR (lang="ar" dir="rtl"). |
| `src/pages/NowPlayingStationPage.jsx` | Page React `/now/:slug` — hero artwork + history 10 derniers titres + maillage. |
| `seo-progress/RADIO-LAYER-ROLLBACK.md` | Plan de rollback granulaire (6 niveaux). |
| `seo-progress/RADIO-LAYER-COMPLETE.md` | Ce rapport. |

## Files modifiés

| Path | Changement |
|---|---|
| `package.json` | +scripts `sync:stations`, `sync:logos`, `sync:all` |
| `src/hooks/useSongs.js` | +`useLiveNowPlaying(slug)` (Worker first, fallback static). `useAutoRefresh` accepte URL nulle |
| `src/pages/StationPage.jsx` | Import `useLiveNowPlaying`, +schema `MusicRecording` JSON-LD dynamique (additionnel) |
| `src/App.jsx` | +2 routes `/now/:slug` (FR + AR) |
| `scripts/build-sitemap.mjs` | +entrée `/now/<slug>` par station (priority 0.6, changefreq hourly) |

## Stations détectées par Radio Browser

- **Total enrichi** : 66 stations
  - 48 reçues de Radio Browser (Maroc, hidebroken=true)
  - 13 manuelles préservées du catalogue runtime existant
  - 5 manuelles préservées via `_manual_overrides`
- Sync idempotent vérifié : 2e run → 0 added, 48 updated, 18 preserved

## Pages /now/:slug ajoutées au sitemap

- 35 stations × 2 langues = **70 nouvelles URLs** (FR + AR)
- Total sitemap : 458 → **528 URLs** (+70)
- changefreq: hourly, priority: 0.6
- hreflang fr-MA / ar-MA / fr / ar / x-default appliqués

## Stations sans ICY metadata (limitations)

Le Worker retourne `info: "no_icy_metadata"` pour les stations qui ne supportent
pas le header Icy-MetaData ou qui diffusent en HLS pur. Ces stations restent
indexables via `/now/:slug` mais sans titre/artiste dynamique :

- Stations HLS-only (Radio 2M HLS, Medi 1 HLS) — pas d'ICY dans le manifest
- Stations dont le serveur strip les headers ICY
- Webradios sur certaines plateformes tierces

Liste exacte à observer une fois le Worker déployé via :
```bash
for slug in hit-radio medi-1-radio chada-fm radio-mars qoran-radio; do
  echo "=== $slug ==="
  curl -s https://radiolive.ma/api/now-playing/$slug | jq '.now_playing, .info, .error'
done
```

## Validation effectuée

- [x] `npm run build` passe sans erreur (30s, 532 KB JS gzip 181 KB)
- [x] `npm run sync:stations` idempotent (2e run = 0 added)
- [x] `npm run sync:logos` n'écrase pas les logos locaux (preserved=19)
- [x] Sitemap incrémenté de +70 URLs `/now/<slug>` paires fr/ar
- [x] Aucune route existante modifiée (`/station/:slug`, `/blog/:slug`, `/ar/blog/:slug`, etc.)
- [x] Schema `RadioBroadcastService` initial préservé sur les pages stations
- [x] `MusicRecording` ajouté en complément, ne duplique pas
- [x] Hook `useLiveNowPlaying` graceful fallback si Worker répond null/404
- [x] Pages Function 2s timeout — fallback shell SPA si Worker lent

## Trafic SEO potentiel des nouvelles pages

D'après le rapport SEO compétitif (5K+ recherches/mois sur "quelle chanson
passe sur X" non capturées par radio.co.ma) :

| Page type | Recherches/mois Maroc estimées |
|---|---|
| `/now/hit-radio` | 1.5K-2K |
| `/now/medi-1-radio` | 1K-1.5K |
| `/now/chada-fm` | 800-1K |
| `/now/radio-mars` | 500-700 |
| Autres stations | 200-400 chacune |
| **Total addressable** | **5-8K recherches/mois** |

Avec un CTR conservateur de 5% et un taux de bounce maîtrisé, gain estimé :
**~250-400 visiteurs/mois additionnels** une fois indexé (typiquement 4-8
semaines après push prod).

## Action manuelle requise de ta part

### 🔴 Avant de pouvoir tester en prod

1. **Init git si pas déjà fait + push** :
   ```bash
   cd "C:\...\radio-maroc"
   git init
   git add .
   git commit -m "feat(radio): add data layer with Radio Browser sync + ICY metadata worker + now-playing pages"
   ```

2. **Cloudflare KV namespace pour le Worker** :
   ```bash
   cd workers/now-playing
   npm install
   npx wrangler login
   npx wrangler kv namespace create METADATA_CACHE
   ```
   Copier l'ID retourné dans `wrangler.toml` (remplace `TO_BE_CREATED`).

3. **Déployer le Worker** :
   ```bash
   npx wrangler deploy
   ```
   La route `radiolive.ma/api/now-playing/*` est déclarée dans `wrangler.toml`,
   wrangler la configure automatiquement.

4. **Tester en local le Worker** :
   ```bash
   npx wrangler dev
   curl http://localhost:8787/api/now-playing/hit-radio | jq
   ```

5. **Déployer le SPA** (Cloudflare Pages) avec les nouvelles fonctions et le
   nouveau sitemap. Push GitHub → auto-build.

### 🟡 Post-deploy validation

- [ ] `https://radiolive.ma/api/now-playing/hit-radio` retourne du JSON
- [ ] `https://radiolive.ma/now/hit-radio` charge avec hero artwork (si chanson identifiée)
- [ ] `https://radiolive.ma/ar/now/hit-radio` charge en RTL avec lang="ar"
- [ ] Schema validator https://search.google.com/test/rich-results sur `/now/hit-radio` → MusicRecording présent
- [ ] Lighthouse mobile ≥85 sur `/now/hit-radio`
- [ ] `https://radiolive.ma/sitemap.xml` contient les 70 entrées `/now/...`

### 🟢 Indexation (3-4 semaines)

- IndexNow ping (déjà câblé via `npm run indexnow` — la liste des URLs prioritaires
  ne contient pas encore les `/now/<slug>` ; les ajouter manuellement dans
  `scripts/indexnow-ping.mjs` après validation post-deploy)
- Search Console → Demander l'indexation des `/now/hit-radio`, `/now/medi-1-radio`,
  `/now/chada-fm`, `/now/radio-mars` en priorité (les 4 stations à plus fort volume)
- Bing Webmaster → soumettre la nouvelle version du sitemap

## Issues connues / limitations

| Issue | Impact | Mitigation |
|---|---|---|
| Stations HLS-only sans ICY | `now_playing: null` sur ~5-8 stations | Pages `/now/:slug` dégradent proprement avec fallback "Vérification de la chanson en cours" |
| iTunes Search rate limit (~20 req/min/IP) | Artwork manquant sur pic de trafic | Worker retourne données sans artwork, page reste fonctionnelle |
| Cloudflare Pages Function timeout 2s | Si Worker lent, fallback shell SPA | Acceptable, le SPA hydrate le contenu en ~500ms |
| Radio Browser API down | `npm run sync:stations` plante | Idempotent : la version précédente de `stations-source.json` reste en place |
| Cron statique `/songs/now-playing.json` | Latence 5-15 min vs Worker temps réel | Acceptable comme fallback, pas comme primary |

## GitHub Action sync hebdomadaire (Étape 4 — skipped)

Tu m'as dit "skip git init", donc pas créé pour l'instant. Quand tu pousseras
le repo sur GitHub, créer `.github/workflows/sync-stations.yml` :

```yaml
name: Sync stations weekly
on:
  schedule: [{ cron: '0 3 * * 1' }]  # Lundi 3h UTC
  workflow_dispatch:
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm install --omit=dev
      - run: npm run sync:all
      - uses: peter-evans/create-pull-request@v6
        with:
          title: 'chore(stations): weekly sync from Radio Browser'
          commit-message: 'chore(stations): weekly sync from Radio Browser'
          branch: 'auto/stations-sync'
          delete-branch: true
```

À adapter quand tu init git.

## Recommandations Phase 3+

- **Suivre les pages `/now/<slug>` dans Search Console** après 4 semaines
  d'indexation. Identifier les stations qui drainent le plus de trafic
  pour prioriser l'optimisation par station.
- **Ajouter une "history page" dédiée** `/now/<slug>/historique` (FR + AR)
  qui montre les 100 derniers titres avec recherche/filtre. Cluster SEO
  longue traîne supplémentaire.
- **Twitter Card preview** : tester que le partage `/now/<slug>` montre
  bien l'artwork iTunes en summary_large_image.
- **PWA / Web Audio API** : continuer la lecture en arrière-plan sur
  mobile + persistent notification (Phase 4).
