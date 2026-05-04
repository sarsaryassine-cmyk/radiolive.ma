# SEO Phase 1 — Progress Tracker

> Updated as tasks complete. Single source of truth for what's done vs pending.

## Radio Data Layer ✅ COMPLET (2026-05-02)

- [x] **Étape 1.1** sync-stations.mjs (idempotent, 66 stations, Radio Browser + manuelles)
- [x] **Étape 1.2** sync-logos.mjs (favicons → public/logos/, préserve locaux)
- [x] **Étape 1.3** npm scripts `sync:stations`, `sync:logos`, `sync:all`
- [x] **Étape 1.4** Run initial OK
- [x] **Étape 2** Cloudflare Worker `radiolive-now-playing` (ICY + iTunes + KV cache 30s)
- [x] **Étape 3.1** Hook `useLiveNowPlaying(slug)` — Worker first, fallback static
- [x] **Étape 3.2** Bloc NowPlaying intégré sur StationPage existant (via player + page dédiée)
- [x] **Étape 3.3** Schema `MusicRecording` JSON-LD additionnel sur StationPage
- [x] **Étape 3.4** Pages `/now/:slug` + `/ar/now/:slug` + Cloudflare Pages Functions SSR
- [x] **Étape 3.5** Sitemap +70 URLs (35 stations × FR/AR)
- [ ] **Étape 4** GitHub Action weekly — **SKIPPED** (pas de repo git initialisé encore)
- [x] **Étape 5** Build OK + rollback doc + RADIO-LAYER-COMPLETE.md

## Phase 1 — Quick Wins ✅ COMPLET (2026-05-01)

- [x] **STEP 0** — Stack discovery (cf. `STACK.md`)
- [x] **TASK 1.1** — Bilingual setup FR + AR + RTL  *(custom hook useI18n + dictionnaire 200+ clés)*
- [x] **TASK 1.2** — Schema.org `RadioBroadcastService` (en plus de `RadioStation` existant)
- [x] **TASK 1.3** — Hreflang `fr` + `ar` simples ajoutés (en plus de `fr-MA`/`ar-MA`)
- [x] **TASK 1.4** — Sitemap (458 URLs, hreflang croisés) + robots.txt
- [x] **TASK 1.5** — Page `/emissions/conseil-psy-mamoun-dribi` (FR + AR)
- [x] **TASK 1.6** — 5 articles musique déployés *(10 articles déjà en ligne FR + AR)*
- [x] **TASK 1.7** — INDEXING.md doc + IndexNow API key + script de ping

## Stop Checkpoint validation

- [x] `npm run build` passe sans erreur (build OK 7.7s)
- [x] sitemap.xml 458 URLs avec paire Mamoun Dribi indexable
- [x] IndexNow key file accessible (`/2a6164376d871eabe6ce30e127d79d8b.txt`)
- [x] Routes ajoutées : `/emissions/conseil-psy-mamoun-dribi` + miroir `/ar/baramij/...`
- [x] Composant `EmissionPage.jsx` réutilisable pour futures émissions
- [x] Bloc "Émissions phares" sur page Med Radio
- [ ] Vérification visuelle dev server (à faire par l'utilisateur)
- [ ] Validation Schema.org via Rich Results Test (à faire en post-prod)
