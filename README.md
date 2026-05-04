# Radio Maroc — Streaming Premium

Plateforme moderne d'écoute en direct des radios marocaines.
Inspiration : Spotify Web Player, Apple Music, Radio Garden.

Stack : **React 18 + Vite + Tailwind CSS + Framer Motion + Howler.js + hls.js**.

Catalogue **auto-maintenu** : les radios sont synchronisées toutes les 24 h
depuis l'API publique [Radio-Browser](https://www.radio-browser.info)
(50 000+ stations indexées). Aucune intervention manuelle requise.

---

## 1. Installation

Ouvrez un terminal dans VS Code, placez-vous dans le dossier `radio-maroc`, puis :

```bash
npm install
npm run dev
```

Le site se lance sur `http://localhost:5173`.

> Premier lancement : `npm install` peut prendre 1 à 2 minutes (téléchargement
> de Vite, React, Tailwind, Framer Motion, etc.).

### Build de production

```bash
npm run build      # génère le dossier dist/
npm run preview    # prévisualise le build localement
```

---

## 2. Comment fonctionne le catalogue

Le site est **auto-maintenu**. Au démarrage :

1. Affichage instantané depuis le **cache localStorage** (ou `public/radios.json` au premier lancement).
2. En arrière-plan, l'app interroge l'API Radio-Browser, fusionne les nouveautés et met à jour la grille **sans recharger la page**.
3. Une nouvelle synchronisation est tentée toutes les 24 h pendant que l'onglet reste ouvert.

Toute la logique vit dans :

- [`src/services/radioService.js`](src/services/radioService.js) — fetch API, dedup, merge, cache localStorage.
- [`src/hooks/useCatalog.js`](src/hooks/useCatalog.js) — orchestration React (chargement, sync auto, refresh manuel).

### Ajouter manuellement une radio (cas rare)

Si vous voulez forcer l'ajout d'une radio absente de Radio-Browser, éditez
`public/radios.json` :

```json
{
  "name": "Ma Radio",
  "stream": "https://example.com/stream.mp3",
  "icon": "/icons/Ma Radio.png"
}
```

Placez l'icône correspondante dans `public/icons/`. Au prochain
chargement, **videz d'abord le cache** (DevTools → Application → Local
Storage → supprimer les clés `radio-maroc:*`), sinon le cache prévaut.

### Types de flux supportés

| Type   | Exemple d'URL                      | Lecteur utilisé |
| ------ | ---------------------------------- | --------------- |
| MP3    | `https://…/radio.mp3`              | Howler.js       |
| AAC    | `https://…/casa_aac_64k`           | Howler.js       |
| HLS    | `https://…/playlist.m3u8`          | hls.js          |

---

## 3. Comment ajouter une icône

1. Placez l'image dans `public/icons/`.
2. **Le nom du fichier doit correspondre EXACTEMENT au nom de la radio**
   tel qu'écrit dans la colonne A du fichier Excel.
3. Extensions supportées : `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`
   (la casse n'a pas d'importance — `.PNG`, `.JPG` fonctionnent aussi).

### Exemples

| Radio (Excel) | Fichier icône                  |
| ------------- | ------------------------------ |
| `RADIO MARS`  | `public/icons/RADIO MARS.png`  |
| `Hit Radio`   | `public/icons/Hit Radio.png`   |
| `CHADA FM`    | `public/icons/CHADA FM.jpg`    |

> Si une icône est manquante, l'app affiche automatiquement un dégradé
> coloré avec les initiales de la radio — aucune erreur visible.

---

## 4. Déploiement

### Vercel (recommandé — gratuit)

1. Installez la CLI : `npm i -g vercel`
2. Dans le dossier du projet : `vercel`
3. Suivez les instructions — déploiement en moins d'une minute.

### Netlify

1. `npm run build`
2. Glissez-déposez le dossier `dist/` sur https://app.netlify.com/drop

### GitHub Pages

```bash
npm run build
# Configurez vite.config.js avec base: '/<nom-du-repo>/'
# Puis poussez le contenu de dist/ sur la branche gh-pages
```

### Hébergement classique (FTP/SSH)

```bash
npm run build
# Uploadez tout le contenu de dist/ vers votre serveur web.
```

---

## 5. Architecture

```
radio-maroc/
├── index.html               # Point d'entrée HTML + polices Google Fonts
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
│
├── public/
│   ├── radios.xlsx          # Source de vérité : nom + URL de chaque radio
│   └── icons/               # Icônes des radios (nom = nom radio)
│
└── src/
    ├── main.jsx             # Bootstrap React
    ├── App.jsx              # Composant racine + état global
    │
    ├── components/
    │   ├── Header.jsx       # Barre supérieure + nav (Toutes / Favoris)
    │   ├── SearchBar.jsx    # Recherche temps réel
    │   ├── RadioCard.jsx    # Carte radio (animée, glassmorphism)
    │   ├── RadioIcon.jsx    # Icône avec fallback initiales
    │   ├── AudioPlayer.jsx  # Lecteur global (style Spotify)
    │   ├── Favorites.jsx    # Vue favoris + bouton coeur
    │   ├── Loader.jsx       # Animation de chargement
    │   └── BackgroundFX.jsx # Aurora/blobs animés en arrière-plan
    │
    ├── hooks/
    │   ├── useAudioEngine.js  # Moteur audio unifié (Howler + hls.js)
    │   ├── useFavorites.js    # Persistance localStorage des favoris
    │   └── useTheme.js        # Bascule clair/sombre persistée
    │
    ├── utils/
    │   └── excelReader.js     # Lecture xlsx → liste de radios
    │
    └── styles/
        └── globals.css        # Tailwind + classes glass / neo / sliders
```

---

## 6. Fonctionnalités implémentées

- Lecture du fichier `radios.xlsx` au chargement (xlsx.js)
- Association automatique radio ↔ icône (multi-extensions, fallback initiales)
- Lecteur audio global Spotify-like : play/pause, prev/next, volume, mute, fermeture
- Support MP3 / AAC (Howler.js) **et** HLS .m3u8 (hls.js, multi-bitrate live)
- Recherche en temps réel
- Favoris persistés (localStorage)
- Mode sombre / clair (toggle, persisté)
- Animations Framer Motion : entrée des cartes, lecteur, header, blobs aurora
- Loader animé moderne au chargement
- Gestion d'erreurs élégante (flux indisponible, fichier manquant)
- Responsive mobile + desktop
- Glassmorphism, néomorphisme léger, gradients, micro-interactions

---

## 7. Enrichir automatiquement la liste

Un script Python alimente automatiquement la base depuis l'API publique
[Radio-Browser](https://www.radio-browser.info) (≈ 50 000 stations indexées).

```bash
python scripts/enrich_radios.py
python scripts/polish_names.py   # nettoyage cosmétique optionnel
```

Ce que fait le script :

- Lit les radios déjà présentes dans `public/radios.xlsx`
- Récupère les stations marocaines depuis Radio-Browser (`bycountrycodeexact/MA`)
- Filtre : flux vérifiés OK, doublons exclus, noms valides
- Teste la réponse HTTP de chaque flux (Range bytes 0-2047)
- Télécharge les logos officiels (`favicon`) dans `public/icons/`
- Écrit `public/radios.json` (source de vérité utilisée par l'app)

Le fichier `radios.xlsx` reste comme **fallback** si `radios.json` est
absent ou corrompu. La résolution est gérée dans
`src/utils/excelReader.js`.

---

## 8. Monétisation Google AdSense

**Quatre bannières** sont en place :

- **2 verticales 120 × 300** dans la gouttière droite (une en haut de page,
  une en bas), cachées sous 1536 px (`2xl`) pour préserver la grille des
  stations sur les laptops.
- **2 horizontales 970 × 250 (billboard)** empilées sous la grille des
  stations (espacées de 32 px), cachées sous 768 px (`md`). Sur les écrans
  plus étroits que 970 px, elles se rétrécissent automatiquement
  (`maxWidth: 100%` + AdSense responsive) — AdSense sert alors un format
  adapté.

Tant qu'AdSense n'est pas configuré, des placeholders discrets « Publicité »
s'affichent à la place — aucun layout shift au moment où les vraies pubs
chargent.

### Étapes pour activer la monétisation

1. **Créez un compte AdSense** : https://adsense.google.com → ajoutez le
   domaine sur lequel vous déployez le site (ex : `radiomaroc.ma`).
2. Une fois votre compte **approuvé** (24 h à 14 j selon Google), récupérez
   votre **publisher ID** (format `ca-pub-XXXXXXXXXXXXXXXX`).
3. Dans [index.html](index.html), remplacez `ca-pub-XXXXXXXXXXXXXXXX` par votre
   vrai publisher ID dans la balise `<script async ... adsbygoogle.js?client=...>`.
4. Dans AdSense, créez **quatre unités d'annonces** display :
   - **2 × 120 × 300** verticales (skyscraper)
   - **2 × 970 × 250** horizontales (billboard) — ou « Auto-format
     responsive » si vous voulez qu'AdSense pousse le format optimal selon
     la largeur disponible

   Notez le `data-ad-slot` (10 chiffres) de chacune.
5. Dupliquez le fichier `.env.example` en `.env.local` et collez vos 4 slot IDs :
   ```bash
   VITE_ADSENSE_SLOT_RIGHT_TOP=1234567890
   VITE_ADSENSE_SLOT_RIGHT_BOTTOM=0987654321
   VITE_ADSENSE_SLOT_BOTTOM=2468013579
   VITE_ADSENSE_SLOT_BOTTOM_2=1357902468
   ```
6. Relancez `npm run dev` — les vraies bannières AdSense apparaîtront sur les
   écrans larges, le placeholder reste sur les écrans étroits.

### Important

- Ne cliquez **jamais** sur vos propres pubs (ban AdSense immédiat).
- Le déploiement doit se faire en **HTTPS** sur un domaine validé par Google.
- Respectez les [politiques AdSense](https://support.google.com/adsense/answer/48182) :
  pas de contenu interdit, pas de pubs trompeuses, pas de pubs sur fond
  d'images ou en pop-up.
- Les emplacements latéraux 160×600 sont conservateurs et acceptés
  partout. Si vous voulez plus de revenus, vous pouvez ajouter une bannière
  horizontale dans le footer — le composant `AdBanner` accepte des `width` /
  `height` custom.

---

## 9. Astuces

- **Pause clavier** : implémentable facilement en ajoutant un listener
  `keydown` sur la touche Espace dans `App.jsx`.
- **Modifier la palette** : éditez `tailwind.config.js` (section `colors.brand`).
- **Ajouter un genre/catégorie** : ajoutez une colonne C dans Excel et lisez-la
  dans `src/utils/excelReader.js`.
