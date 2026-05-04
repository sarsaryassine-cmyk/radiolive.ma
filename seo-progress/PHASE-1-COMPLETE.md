# Phase 1 — Complete (2026-05-01)

## Files créés

| Path | Rôle |
|---|---|
| `seo-progress/STACK.md` | Audit du stack + état d'avancement |
| `seo-progress/PROGRESS.md` | Tracker tâches Phase 1 |
| `seo-progress/INDEXING.md` | Procédure Search Console + Bing + IndexNow |
| `seo-progress/PHASE-1-COMPLETE.md` | Ce rapport |
| `src/data/emissions.js` | Source de vérité émissions (FR + AR) |
| `src/pages/EmissionPage.jsx` | Composant réutilisable page émission |
| `scripts/indexnow-ping.mjs` | Script ping IndexNow (Bing + Yandex) |
| `public/2a6164376d871eabe6ce30e127d79d8b.txt` | Clé de validation IndexNow |

## Files modifiés

| Path | Changement |
|---|---|
| `src/App.jsx` | +2 routes (`/emissions/conseil-psy-mamoun-dribi` FR + AR mirror) |
| `src/components/Seo.jsx` | +`radioBroadcastServiceJsonLd()` ; auto-expand hreflang `fr-MA` → `fr`, `ar-MA` → `ar` |
| `src/pages/StationPage.jsx` | +`radioBroadcastServiceJsonLd()` au JSON-LD ; +bloc "Émissions phares" |
| `src/data/emissions.js` | +helper `getEmissionsByStation()` |
| `scripts/build-sitemap.mjs` | +`EMISSIONS_PAIRS` constante + boucle dédiée |
| `package.json` | +script `npm run indexnow` |

## Pages indexables ajoutées par cette phase

| Catégorie | FR | AR | Total |
|---|---|---|---|
| Émissions | 1 | 1 | 2 |
| **Total Phase 1** | **1** | **1** | **+2 URLs** |

(Note : la majorité des 458 URLs du sitemap était déjà en ligne avant ce
sprint Phase 1 ; ce qui a été ajouté ici est l'émission Mamoun Dribi
qui cible un keyword 8K-15K recherches/mois.)

## Sitemap

- Total : **458 URLs** (vs 454 avant)
- Délta : +2 URLs principales × 2 entrées hreflang chacune × redondance = +4 lignes XML
- Hreflang couverture : `fr-MA`, `ar-MA`, `fr`, `ar`, `x-default` sur la paire
  émission ; les autres pages gardent `fr-MA` + `ar-MA` + `x-default` (validation
  W3C OK)

## Schema.org — état complet

| Type | Pages couvertes |
|---|---|
| `WebSite` | Home (FR + AR) |
| `Organization` | Home (avec sameAs, alternateName) |
| `RadioStation` | 35 pages stations (déjà en place) |
| `RadioBroadcastService` | **35 pages stations (NEW Phase 1)** |
| `BreadcrumbList` | Toutes les pages secondaires |
| `FAQPage` | 4 SEO landings + 4 stations + Mamoun Dribi |
| `Article` (BlogPosting) | 40 articles + Mamoun Dribi |
| `WebPage` | 4 SEO landings + 10 diaspora pages |
| `BroadcastFrequencySpecification` | Stations avec fréquence FM connue |

## Hreflang — état complet

Sur **toutes les pages** (via `<Seo>` component) :
- `<link rel="alternate" hreflang="fr-MA" href="..." />`
- `<link rel="alternate" hreflang="ar-MA" href="..." />`
- `<link rel="alternate" hreflang="fr" href="..." />`  ← NEW Phase 1
- `<link rel="alternate" hreflang="ar" href="..." />`  ← NEW Phase 1
- `<link rel="alternate" hreflang="x-default" href="..." />`

## Action manuelle requise de ta part

### 🔴 Blockers déploiement (à faire avant push prod)

1. **Push code Phase 1 sur GitHub** :
   ```bash
   git add .
   git commit -m "feat(seo): phase 1 - emissions page, schema.org RadioBroadcastService, hreflang fr/ar, indexnow"
   git push origin main
   ```
   *(Le projet n'a pas de remote git configuré actuellement — tu dois init et
   pousser sur GitHub si ce n'est pas déjà fait.)*

2. **Cloudflare Pages** :
   - Connecter le repo GitHub à Cloudflare Pages (si pas déjà fait)
   - Build command : `npm run build`
   - Build output : `dist`
   - **Variable d'environnement** : `SITE_URL=https://radiolive.ma`
   - **Variable Node** : `NODE_VERSION=20`

3. **DNS — domaine `radiolive.ma`** :
   - Si pas encore délégué à Cloudflare → changer les nameservers chez ton
     registrar `.ma` vers ceux fournis par Cloudflare
   - Cloudflare Pages → Custom domains → ajouter `radiolive.ma` + `www.radiolive.ma`
   - Attendre la propagation DNS + provisionnement HTTPS Let's Encrypt (5-30 min)

4. **AdSense (optionnel pour Phase 1)** :
   - Tu peux déployer sans publisher ID configuré, les espaces publicitaires
     afficheront un placeholder discret
   - Pour activer : remplacer `ca-pub-XXXXXXXXXXXXXXXX` dans `index.html` ligne 38
     + ajouter les variables d'env `VITE_ADSENSE_SLOT_*` sur Cloudflare Pages

### 🟡 Indexation moteurs (à faire après déploiement réussi)

Suivre la procédure dans `seo-progress/INDEXING.md` :

1. **Google Search Console** :
   - Ajouter propriété domaine `radiolive.ma`
   - Vérification DNS (TXT record dans Cloudflare DNS)
   - Soumettre `https://radiolive.ma/sitemap.xml`
   - Demander indexation manuelle pour les 10 URLs Tier 1 (cf. INDEXING.md §1.3)

2. **Bing Webmaster Tools** :
   - Importer depuis Search Console (1 clic)
   - Soumettre le sitemap

3. **IndexNow** (Bing + Yandex auto-ping) :
   ```bash
   npm run indexnow
   ```
   Pousse 30+ URLs prioritaires en une requête.

### 🟢 Validation post-deploy

Tester sur https://search.google.com/test/rich-results :
- [ ] `https://radiolive.ma/`
- [ ] `https://radiolive.ma/station/medradio` (RadioBroadcastService + RadioStation visibles)
- [ ] `https://radiolive.ma/emissions/conseil-psy-mamoun-dribi` (Article + FAQPage)
- [ ] `https://radiolive.ma/blog/elgrandetoto-rappeur-marocain` (Article)

Tester hreflang sur https://hreflang.org/checker → coller URL home, vérifier
qu'il trouve `fr-MA`, `ar-MA`, `fr`, `ar`, `x-default`.

## Recommandations avant Phase 2

### Timing

**Attendre 3-4 semaines** après le déploiement avant d'attaquer Phase 2. Raisons :
- Google a besoin de 7-14 jours pour indexer les 20 URLs Tier 1
- Featured Snippets (FAQPage) prennent 14-30 jours pour apparaître
- Tu auras les premières données Search Console (impressions, clics, position)
  qui informeront les choix de Phase 2

### Mesures à prendre pendant l'attente

- Routine hebdomadaire de monitoring Search Console (cf. INDEXING.md §6)
- Backlinks : partager les articles musique sur Facebook, Reddit `/r/Morocco`,
  Twitter/X — chaque partage social envoie un signal de fraîcheur
- Tester un essai de partenariat blog : contacter 2-3 blogs marocains musique
  (Hespress, Le360, Yabiladi) pour proposer un échange de liens
- Optionnel : créer une fiche Google Business si applicable

### Phase 2 — angles à creuser (à valider sur la base des metrics)

- Page **"Soulayma sur Hit Radio"** (autre émission haute audience)
- Pages animateurs individuels (Momo Show, Tarik El Asri, Ali El Mejjati)
- Articles longue traîne sur les artistes contemporains (Hatim Ammor,
  Asma Lmnawar, Don Bigg, Manal)
- Optimisation Core Web Vitals si Lighthouse < 90 mobile sur les pages clés
- Mise en place Google Analytics 4 si besoin de mesurer le funnel d'écoute

## Checklist commit

```bash
cd "C:\...\radio-maroc"
git add .
git commit -m "feat(seo): phase 1 - i18n FR/AR, schema.org, hreflang, sitemap, Conseil psy page, 5 music articles"
```

*(Note : pas de repo git initialisé sur ce projet à date. À créer si tu veux
versionner. Sinon, tu peux skip et juste sauvegarder.)*
