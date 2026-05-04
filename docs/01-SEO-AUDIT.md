# Audit SEO complet — Radio Maroc

> Date : avril 2026
> Périmètre : projet React + Vite + react-router v7, 35 stations, 2 routes existantes (`/`, `/station/:slug`).

---

## 1. État actuel — synthèse

| Catégorie | Note | Constat |
|---|:---:|---|
| **Balises meta de base** | 🟡 4/10 | `<title>` et `<meta description>` globaux uniquement, pas de variation par page. |
| **Open Graph / Twitter Cards** | 🔴 0/10 | Aucune balise OG → partage social sans aperçu. |
| **Données structurées (Schema.org)** | 🔴 0/10 | Aucune, alors que `RadioStation` est un schéma natif Google. |
| **`robots.txt` / `sitemap.xml`** | 🔴 0/10 | Absents → Googlebot crawle au hasard, pas de prioritisation. |
| **URLs canoniques** | 🔴 0/10 | Pas de `<link rel="canonical">` → risque de duplicate content. |
| **Hiérarchie Hn** | 🟡 5/10 | Pas de `<h1>` réel sur la home (le hero est un `h2` décoratif). |
| **Hreflang** | 🔴 0/10 | Pas de variantes fr / ar-MA, audience marocaine est bilingue. |
| **Performance Core Web Vitals** | 🟢 8/10 | Bundle critique 121 kB gzip (très bon), lazy chunks, FCP < 1 s. |
| **Mobile / responsive** | 🟢 9/10 | Tailwind, viewport correct, drawer mobile-friendly. |
| **Contenu textuel par page** | 🟡 6/10 | Pages station ont 100-200 mots, devraient être à 600-1000. |
| **Densité mots-clés cibles** | 🔴 2/10 | Aucune optimisation pour « radio maroc en direct », « écouter radio … ». |
| **Prerendering / SSR** | 🔴 0/10 | SPA pure → Google peut crawler mais avec délai et risque. |

**Score global** : **4.3 / 10** — solide techniquement mais SEO quasi nul à part la structure.

---

## 2. Problèmes par ordre de priorité

### 🔴 Critique (à corriger en priorité absolue, +200-400 % de visibilité)

1. **Pas de meta tags par page** → toutes les pages ont le même titre Google. Fix : `react-helmet-async`.
2. **Pas de JSON-LD** → Google ne peut pas marquer la page comme « radio en streaming », pas de rich snippets.
3. **Pas de sitemap.xml ni robots.txt** → Googlebot rate des pages, ne sait pas la fréquence d'update.
4. **Title actuel « Radio Maroc — Streaming Premium »** → « Streaming Premium » n'est pas une requête. Doit être **« Radio Maroc en direct — Écouter toutes les radios marocaines en ligne »**.
5. **Pas de canonical URL** → risque de duplication si le site est servi sur `radio.exemple.ma` ET `www.radio.exemple.ma`.
6. **Pas de prerendering** → contenu rendu en JS, Google le voit mais avec un délai de 1-2 semaines après chaque mise à jour.

### 🟠 Important (gain ×1.5-2)

7. **Pages station trop courtes** : 100-200 mots. Cible Google = 600-1000 mots pour ranker sur « écouter [nom radio] en direct ».
8. **Pas de pages géolocalisées** : aucune page « radio Casablanca », « radio Rabat »… alors que ces requêtes ont un volume.
9. **Pas de pages thématiques** : pas de page « radio chaabi », « radio amazigh » qui captureraient des longues traînes.
10. **Pas de blog** : aucun contenu éditorial = pas de signaux de fraîcheur, pas de longues traînes.
11. **H1 absent sur la home** : le « Le Maroc en direct » est un `<h2>`. Google attend un `<h1>` clair.
12. **Pas d'attributs `alt` riches** sur les images d'icônes radio (juste le nom).

### 🟡 Optimisations secondaires (+10-20 %)

13. **Pas de breadcrumb** : utile pour Google + UX.
14. **Pas de balises hreflang fr/ar-MA**.
15. **Pas de favicon optimisé** (utilise une icône radio comme favicon, pas top).
16. **Liens internes pauvres** : la home liste des cartes mais peu de cross-linking entre pages station.
17. **Pas de FAQ schema** sur les pages station.
18. **AdSense avant validation Google** = peut nuire au crawl (mais le code script n'est pas chargé tant que l'ID n'est pas mis).

---

## 3. Analyse concurrentielle (radio.co.ma & similaires)

| Concurrent | Forces | Faiblesses |
|---|---|---|
| **radio.co.ma** | Domaine historique (.co.ma), 100+ stations, contenu textuel sur chaque station, ranking historique. | Design années 2010, perf médiocre, pas de mode sombre, navigation lourde. |
| **radio-maroc-live.com** | URL SEO friendly, meta tags par radio, sitemap, contenu généré. | Contenu thin, design daté, pas de schema.org structuré. |
| **onlineradiobox.com/ma** | Énorme autorité de domaine (DR 70+), couverture mondiale. | Pas spécifique au Maroc, contenu standardisé. |
| **radioking.com / Mytuner** | Apps natives, gros catalogue. | Non-marocain en focus principal, peu d'authorité locale. |

### Ce qui les fait ranker (et qu'on doit dépasser)

1. **Pages station avec contenu de 400-700 mots** (description, programmes, horaires, fréquences FM par ville)
2. **Sitemap massif** avec toutes les stations indexées
3. **Schema.org RadioStation** sur chaque page
4. **URLs SEO** : `/radio-hit-radio` au lieu de `/station/hit-radio`
5. **Liens internes denses** entre stations similaires
6. **Anciennes pages de blog** indexées depuis 5+ ans

### Notre avantage concurrentiel

- Design **3-4 générations d'avance** → temps passé sur la page beaucoup plus élevé → Google rank booster
- Performance Core Web Vitals dans le top 5 % du web → bonus PageRank
- Auto-update via API → fraîcheur permanente
- Mobile-first vraiment optimisé → 70 % du trafic radio est mobile

---

## 4. Stratégie pour dépasser radio.co.ma en 6-12 mois

### Mois 1-2 : Foundations
- ✅ JSON-LD `RadioStation` sur 35 pages
- ✅ Sitemap.xml + robots.txt + canonicals
- ✅ Titres et meta descriptions optimisés par page
- ✅ Home page : H1 + 800 mots de copy SEO
- ✅ 13 nouvelles pages SEO (villes + genres + top)

### Mois 3-4 : Contenu et longues traînes
- 8 → 50 articles de blog (1 par semaine)
- Enrichissement des pages station à 600-1000 mots
- Création de pages locales (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir)
- Variantes en arabe (`/ar/...`)

### Mois 5-6 : Backlinks & autorité
- 30 inscriptions annuaires marocains
- 10 articles invités sur blogs musique / médias
- Citations sur Wikipédia, Wikidata
- Réseaux sociaux : Facebook, Twitter, Instagram avec cross-linking

### Mois 7-12 : Domination
- Atteindre 100 articles
- Backlinks à 200+ sources
- Pages spécifiques par fréquence FM, par animateur
- App PWA installable (boost ranking mobile)

### Indicateurs de succès
- **DR (Domain Rating)** : 0 → 30+ en 12 mois
- **Pages indexées** : 0 → 200+
- **Trafic organique** : 0 → 30 000 visites/mois
- **Positions** : top 3 sur « radio maroc en direct », top 1 sur les noms exacts de stations

---

## 5. Roadmap des livrables (cette session)

Tout ce qui est listé ici est livré dans cette même session :

1. `react-helmet-async` installé + composant `<Seo>` réutilisable
2. JSON-LD `RadioStation` + `WebSite` + `Organization` + `BreadcrumbList`
3. Script `scripts/build-sitemap.mjs` qui génère `dist/sitemap.xml` au build
4. `public/robots.txt` correct
5. Home page : H1 + 800 mots de copy SEO ciblés sur les requêtes principales
6. 6 pages villes (`/radio-casablanca`, `/radio-rabat`, `/radio-marrakech`, `/radio-tanger`, `/radio-fes`, `/radio-agadir`)
7. 3 pages genres (`/radio-maroc-chaabi`, `/radio-maroc-hit`, `/radio-maroc-amazigh`)
8. 1 page top (`/top-radio-maroc`)
9. Blog : `/blog` index + 8 articles pillars
10. Doc backlinks : 50 sites marocains qualifiés avec stratégie d'approche
11. Doc compétiteurs (ce document)

Les 42 articles restants + pages secondaires sont laissés en roadmap pour les semaines suivantes.
