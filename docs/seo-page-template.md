# Template SEO — page de cluster Radio Maroc

Ce document décrit le format standard d'une page SEO de cluster sur radiolive.ma.
Référence vivante : la page `/radio-maroc-en-direct` (FR) et son miroir
`/ar/radio-maroc-mubashir` (AR), définies dans `src/data/seoLandings.js` et
rendues par `src/pages/SeoLandingPage.jsx`.

---

## Méta SEO

| Champ | Cible | Exemple "Radio Maroc en direct" |
|---|---|---|
| `title` | ≤ 60 c, mot-clé principal en début | "Radio Maroc en direct — Écouter toutes les radios marocaines en streaming live" |
| `description` | 140-160 c, CTA implicite | "Écoutez en direct toutes les radios marocaines : Hit Radio, Medi 1, Radio Mars, Chada FM, Radio 2M, MFM et plus de 30 stations FM en streaming HD gratuit, sans inscription, 24h/24." |
| `canonical` | URL absolue avec domaine | `https://radiolive.ma/radio-maroc-en-direct` |
| `alternates` | hreflang fr-MA / ar-MA / x-default | voir Seo.jsx prop `alternates` |
| `og:type` | `website` ou `article` | `website` |
| `og:locale` | `fr_MA` ou `ar_MA` | switche selon `lang` |
| `twitter:card` | `summary_large_image` | toujours |

---

## Structure H1 → H2 → H3

```
H1 — formulé naturellement avec mot-clé principal en première moitié
  ↓
Intro (1 paragraphe, ~50 mots) — résumé éditorial qui répète le mot-clé
                                  + 2 variantes sémantiques
  ↓
H2 #1 — bénéfice / réponse principale (ex. "Toutes les radios marocaines en direct")
  ↳ 1-2 paragraphes (~80-150 mots)
  ↓
H2 #2 — angle technique / explication (ex. "Comment fonctionne l'écoute en direct ?")
  ↳ 1-2 paragraphes
  ↓
H2 #3 — angle pratique (ex. "Sur quels appareils ?")
  ↳ <ul> liste à puces (4-6 items)
  ↓
H2 #4 — comparaison / différenciation (ex. "Pourquoi en ligne plutôt qu'en FM ?")
  ↳ 1-2 paragraphes
  ↓
H2 #5 — top / sélection (ex. "Les stations les plus écoutées")
  ↳ paragraphe + lien vers page top dédiée
  ↓
H2 #6 — angle continuité / 24/7 (ex. "Sans coupure")
  ↳ 1 paragraphe
```

**Total visé : 800-1200 mots FR, 600-1000 mots AR.**

---

## Plan de contenu pour "Radio Maroc en direct" (exemple complet)

### H1
**Radio Maroc en direct — Écouter en ligne toutes les stations marocaines**

### Intro (~80 mots)
Toutes les radios du Maroc en direct, en streaming HD, gratuitement et sans inscription.
Plus de 30 stations FM et webradios diffusent leur signal 24 heures sur 24 sur notre
plateforme. Sélectionnez une station, cliquez sur écouter, et profitez du Maroc en
direct depuis n'importe où dans le monde.

### Sections H2 (chacune ~150 mots)

1. **Toutes les radios marocaines en direct, à un clic** — listing des stations
   majeures + slogan "aucun téléchargement, aucun compte, aucune limite".
2. **Comment fonctionne l'écoute en direct ?** — explication technique HLS / MP3,
   délai de buffering, adaptation automatique de la qualité.
3. **Sur quels appareils écouter la radio marocaine en ligne ?** — liste à puces :
   - Ordinateur (Windows, Mac, Linux)
   - Smartphone Android / iPhone iPad
   - Smart TV (Chromecast, Apple TV)
   - Voiture (CarPlay, Android Auto)
   - Enceintes connectées (Google Home, Echo)
4. **Pourquoi écouter la radio en ligne plutôt qu'en FM ?** — argumentaire qualité
   audio (jusqu'à 256 kbps HLS), couverture mondiale, accès aux webradios sans FM.
5. **Les stations les plus écoutées en streaming** — Hit Radio, Medi 1, Chada FM,
   Radio Mars, MFM (rotation top 10 dynamique).
6. **Écouter la radio marocaine 24h/24, sans coupure** — Ramadan, vendredi prière,
   programmes culturels week-end.

### FAQ JSON-LD (5 questions)
1. Comment écouter la radio marocaine en direct ?
2. L'écoute est-elle vraiment gratuite ?
3. Puis-je écouter la radio marocaine depuis l'étranger ?
4. Quelle qualité audio pour le streaming ?
5. L'écoute fonctionne-t-elle en arrière-plan sur smartphone ?

### Maillage interne obligatoire
- 8 cards stations (`relatedStationIds: STATION_GROUPS.flagship`)
- 7 liens cluster (Top 10, Fréquences FM, Blog, Casablanca, Hits, Chaabi, Amazigh)
- 2-3 cross-links inline dans le corps (vers `/radio-maroc`, `/radio-sport-maroc`, etc.)

---

## Mots-clés à intégrer (densité ~1.5 %)

### FR
- radio maroc en direct (mot-clé principal)
- radio en direct maroc, radio en direct au maroc
- radio maroc en ligne
- écouter la radio maroc, écouter radio maroc
- streaming radio gratuit
- FM maroc, fréquence FM
- stations radio maroc

### AR (pour la version `/ar/radio-maroc-mubashir`)
- راديو المغرب مباشر (mot-clé principal)
- إذاعات مغربية مباشر
- استماع راديو المغرب
- بث مباشر مجاني
- إذاعات FM المغرب

---

## Schema.org JSON-LD

Trois schémas obligatoires sur ce type de page :

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Radio Maroc en direct — ...",
  "description": "...",
  "url": "https://radiolive.ma/radio-maroc-en-direct",
  "inLanguage": "fr-MA",
  "isPartOf": { "@type": "WebSite", "url": "https://radiolive.ma", "name": "Radio Maroc" }
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://radiolive.ma/" },
    { "@type": "ListItem", "position": 2, "name": "Radio Maroc en direct" }
  ]
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Comment écouter la radio marocaine en direct ?",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
```

---

## Intégration dans le code

Pour ajouter une nouvelle page de cluster :

1. **Ajouter une entrée** dans `src/data/seoLandings.js` avec ce shape :
   ```js
   'mon-nouveau-slug': {
     lang: 'fr',
     path: '/mon-nouveau-slug',
     altPath: '/ar/mon-slug-ar',  // ou null si pas de mirror
     title: '...',
     description: '...',
     h1: '...',
     intro: '...',
     body: [
       { h2: '...' },
       { p: '...' },
       { ul: [...] },
       ...
     ],
     faq: [{ q: '...', a: '...' }, ...],
     relatedStationIds: [...],
     related: [...],
     cluster: 'pillar' | 'live' | 'sport' | 'national',
   }
   ```

2. **Ajouter la route** dans `src/App.jsx` :
   ```jsx
   <Route path="/mon-nouveau-slug"
          element={<SeoLandingPage landingKey="mon-nouveau-slug" />} />
   ```

3. **Ajouter le slug** au sitemap dans `scripts/build-sitemap.mjs`
   (constante `SEO_LANDING_PAIRS`).

4. Le composant `SeoLandingPage` génère automatiquement :
   - Meta SEO (title, description, canonical, hreflang)
   - JSON-LD WebPage + BreadcrumbList + FAQPage + Organization
   - Bloc "Stations à écouter" (8 cards)
   - Bloc "Articles liés" / "Écouter aussi" (7 liens)
   - Section FAQ visible (HTML `<details>` collapsible)
