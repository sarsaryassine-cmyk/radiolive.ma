# INDEXING — Setup Search Console + Bing Webmaster + IndexNow

> Procédure étape par étape pour soumettre `radiolive.ma` aux moteurs de
> recherche après le déploiement Phase 1.
>
> Pré-requis : domaine `radiolive.ma` actif, DNS pointant sur Cloudflare
> Pages, sitemap accessible à `https://radiolive.ma/sitemap.xml`.

---

## 1. Google Search Console

### 1.1 Ajouter la propriété

1. Connecte-toi sur https://search.google.com/search-console (compte Google).
2. Clique **"Ajouter une propriété"** → choisis le type **"Domaine"** (recommandé,
   couvre tous les sous-domaines + http/https).
3. Saisis : `radiolive.ma`
4. Google te donne un enregistrement TXT à ajouter au DNS, format :
   ```
   Nom (host)  : @
   Type        : TXT
   Valeur      : google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   TTL         : 3600 (ou Auto)
   ```
5. Va dans Cloudflare DNS (puisque tu as délégué les nameservers à Cloudflare) :
   **Cloudflare Dashboard → radiolive.ma → DNS → Records → Add record**
   → Type: **TXT**, Name: **@**, Content: la valeur fournie par Google → Save.
6. Reviens sur Search Console, clique **"Vérifier"**. Propagation 5-30 min,
   parfois plus selon le TTL.

### 1.2 Soumettre le sitemap

1. Une fois la propriété vérifiée → menu gauche **Sitemaps**
2. Sous "Ajouter un sitemap", saisis : `sitemap.xml`
3. Submit. Statut attendu : "Réussite — XXX URLs détectées".

### 1.3 Demander l'indexation manuelle (URLs prioritaires Phase 1)

Search Console → **Inspection d'URL** (barre du haut) → coller l'URL → "Demander
l'indexation". Limite ~10 demandes/jour, prioriser :

**Tier 1 — High priority (mots-clés forts)**
1. https://radiolive.ma/
2. https://radiolive.ma/ar
3. https://radiolive.ma/emissions/conseil-psy-mamoun-dribi
4. https://radiolive.ma/ar/baramij/istichara-nafsiya-mamoun-dribi
5. https://radiolive.ma/radio-maroc-en-direct
6. https://radiolive.ma/ar/radio-maroc-mubashir
7. https://radiolive.ma/radio-sport-maroc
8. https://radiolive.ma/radio-nationale-marocaine
9. https://radiolive.ma/radio-maroc
10. https://radiolive.ma/top-radio-maroc

**Tier 2 — Articles musique (à soumettre J+1)**
11. https://radiolive.ma/blog/musique-chaabi-marocaine
12. https://radiolive.ma/blog/elgrandetoto-rappeur-marocain
13. https://radiolive.ma/blog/saad-lamjarred-biographie
14. https://radiolive.ma/blog/histoire-rap-marocain
15. https://radiolive.ma/blog/meilleures-radios-marocaines-musique-streaming
16. https://radiolive.ma/blog/musique-gnawa-maroc
17. https://radiolive.ma/blog/nass-el-ghiwane-groupe-mythique
18. https://radiolive.ma/blog/festival-mawazine-rabat
19. https://radiolive.ma/blog/musique-amazighe-maroc
20. https://radiolive.ma/blog/top-10-chansons-marocaines-incontournables

**Tier 3 — Mirrors AR + autres (à soumettre J+2 et J+3)**
- AR equivalents pour les 20 ci-dessus
- Pages diaspora (10 FR + 10 AR)
- Pages stations majeures (`/station/hit-radio`, `/station/medi-1-radio`,
  `/station/radio-mars`, `/station/chada-fm`, `/station/medradio`)
- Pages fréquences ville (`/frequence-radio-casablanca`, `/frequence-radio-rabat`, …)

### 1.4 Configuration ciblage géographique

Search Console → **Paramètres** → **Ciblage international** :
- **Pays cible** : Maroc (mais avec `.ma` ccTLD, c'est déjà implicite)
- **Hreflang** : déjà géré par le sitemap (rien à faire ici)

---

## 2. Bing Webmaster Tools

### 2.1 Ajouter le site

1. Connecte-toi sur https://www.bing.com/webmasters (compte Microsoft ou Google).
2. Option recommandée : **"Importer depuis Google Search Console"** — gain de
   temps énorme, importe propriété + sitemap + verif en 1 clic.
3. Si import non disponible : **"Ajouter un site"** → `https://radiolive.ma` →
   méthode de vérification au choix :
   - Meta tag dans `<head>` (à ajouter dans `index.html`)
   - Fichier XML à la racine
   - DNS CNAME

### 2.2 Soumettre le sitemap

Bing Webmaster → **Sitemaps** → Submit → `https://radiolive.ma/sitemap.xml`

### 2.3 Configurer IndexNow (auto-ping)

Bing supporte nativement IndexNow (cf. section 3 ci-dessous). Aucune action
supplémentaire requise — Bing reçoit les pings automatiquement après le premier
push.

---

## 3. IndexNow API (auto-ping Bing + Yandex + Seznam)

### 3.1 Clé API générée

- **Clé** : `2a6164376d871eabe6ce30e127d79d8b`
- **Fichier de validation** : `public/2a6164376d871eabe6ce30e127d79d8b.txt`
  → accessible à `https://radiolive.ma/2a6164376d871eabe6ce30e127d79d8b.txt`
- **Contenu du fichier** : la clé brute (32 caractères hex)

### 3.2 Lancer un ping manuel

```bash
npm run indexnow
```

Le script `scripts/indexnow-ping.mjs` pousse 30+ URLs prioritaires en une
requête à `https://api.indexnow.org/indexnow`. Réponse attendue : `200 OK`
ou `202 Accepted`.

### 3.3 Intégration deploy hook (Cloudflare Pages)

**Option recommandée — déclenchement post-deploy via GitHub Actions** :

Créer `.github/workflows/indexnow.yml` :

```yaml
name: IndexNow ping
on:
  push:
    branches: [main]
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: |
          # Attend 5 min que Cloudflare Pages déploie d'abord
          sleep 300
          npm run indexnow
```

Ou, plus simple : lance `npm run indexnow` manuellement après chaque déploiement
significatif.

### 3.4 Mise à jour de la liste d'URLs

Quand tu ajoutes des pages importantes, édite la constante `URLS` dans
`scripts/indexnow-ping.mjs`. Ne jamais dépasser **10 000 URLs/jour** (limite
IndexNow par hôte).

---

## 4. Vérifications avant submit

### 4.1 Sitemap

- [ ] `https://radiolive.ma/sitemap.xml` accessible (200 OK)
- [ ] Valide XML — `xmllint --noout sitemap.xml`
- [ ] 470+ URLs (Phase 1 ajoute 2 émissions + maintien des 454 existantes)
- [ ] Hreflang croisés présents pour chaque paire fr/ar

### 4.2 robots.txt

- [ ] `https://radiolive.ma/robots.txt` accessible (200 OK)
- [ ] Contient `Sitemap: https://radiolive.ma/sitemap.xml`
- [ ] Allow `/`, `/ar/`, `/fr/`
- [ ] Disallow `/songs/`, `/radioDescriptions.json`, `/radios.json`

### 4.3 Hreflang validator

- Tester avec https://hreflang.org/checker
- Coller `https://radiolive.ma/` → vérifier qu'il trouve `fr-MA`, `ar-MA`,
  `fr`, `ar`, `x-default` retournant chacun les bonnes URLs

### 4.4 Schema validator

Tester sur https://search.google.com/test/rich-results :
- [ ] `https://radiolive.ma/` — devrait afficher : WebSite + Organization + SearchAction
- [ ] `https://radiolive.ma/station/medradio` — RadioStation + RadioBroadcastService + BreadcrumbList
- [ ] `https://radiolive.ma/station/radio-mars` — RadioStation + RadioBroadcastService + FAQPage
- [ ] `https://radiolive.ma/station/hit-radio` — RadioStation + RadioBroadcastService + FAQPage
- [ ] `https://radiolive.ma/emissions/conseil-psy-mamoun-dribi` — Article + FAQPage + BreadcrumbList
- [ ] `https://radiolive.ma/blog/elgrandetoto-rappeur-marocain` — Article + BreadcrumbList

Tous doivent passer **sans erreur** ; les warnings sur `image` (si la page
n'a pas de hero image) sont acceptables.

### 4.5 Test mobile-friendly

https://search.google.com/test/mobile-friendly → coller `https://radiolive.ma/` →
doit afficher "La page est adaptée aux mobiles". Si erreur, vérifier viewport
meta + touch targets ≥44px (déjà fixé Phase mobile).

---

## 5. Timeline d'attente après submit

| Étape | Délai typique |
|---|---|
| Vérification DNS Search Console | 5-30 min |
| Premier crawl Googlebot après submit | 1-3 jours |
| Indexation des 20 URLs Tier 1 | 7-14 jours |
| Apparition Featured Snippets (FAQPage) | 14-30 jours |
| Stabilisation rankings | 8-12 semaines |
| IndexNow → Bing crawl | 24-72 h |

---

## 6. Checklist post-submit hebdomadaire (semaines 1-4)

Chaque vendredi :
- [ ] Search Console → Couverture → noter le nombre d'URLs indexées (vs 454 totales)
- [ ] Search Console → Performances → noter impressions + clics + position moyenne
- [ ] Vérifier les requêtes émergentes — note les nouveaux keywords trouvés
- [ ] Si pages bloquées : inspecter, corriger, redemander l'indexation
- [ ] Mettre à jour `seo-progress/PHASE-1-METRICS.md` (à créer après le 1er rapport)

---

## 7. Actions manuelles requises de ta part

**Avant de soumettre** :
1. Déployer le code Phase 1 sur Cloudflare Pages (push main + auto-deploy)
2. Vérifier `https://radiolive.ma/sitemap.xml` retourne bien le XML mis à jour
3. Vérifier que `https://radiolive.ma/2a6164376d871eabe6ce30e127d79d8b.txt`
   retourne `2a6164376d871eabe6ce30e127d79d8b\n`
4. Configurer la variable d'env Cloudflare Pages : `SITE_URL=https://radiolive.ma`
5. Tester un play audio dans le navigateur — confirmer streaming OK

**Après submit** :
1. Lancer `npm run indexnow` une fois pour pousser à Bing/Yandex
2. Patienter 24-48h, vérifier via Bing Webmaster que les URLs apparaissent en "Discovered"
3. Démarrer la routine hebdomadaire de monitoring
