# Stations Cleanup — Audit (avant modification)

> Audit du 2026-05-02 sur `public/radios.json`. **Aucune modification effectuée.**
> J'attends ton "go" avant l'étape 1 (déduplication).

## État actuel

- **Total stations** : 50 dans `public/radios.json`
- **Source** : `data/stations-source.json` (66 entrées) + apply-stations dedup → 50
- **Tri actuel** : alphabétique par nom (`localeCompare`) — utilisé par `useCatalog.js` puis SideMenu
- **Pas de doublon par stream URL** (déjà géré par `apply-stations.mjs`)

## 1. Stations à supprimer (doublons confirmés à 95%+)

| # | À supprimer | À garder | Raison |
|---|---|---|---|
| 1 | **`ma-hit-radio-maroc`** ("MA:-Hit Radio Maroc") | `hit-radio` ("HIT RADIO") | Même station Hit Radio. L'entrée "MA:-..." est un artefact préfixé Radio Browser. La principale a logo + données enrichies. |
| 2 | **`ma-radio-sawt-alamal`** ("MA:-Radio Sawt Alamal") | `mrc-sawt-al-amal` ("MRC:-Sawt Al Amal") OU l'inverse | Doublon évident "Sawt Al Amal" / "Sawt Alamal". Au final on en garde UN, à renommer "Sawt Al Amal" proprement. À ta validation — les deux sont égaux en données. |
| 3 | **`mrc-radio-plus`** ("MRC:-Radio plus") | `radio-plus-agadir` ("Radio Plus Agadir") | "MRC:-Radio plus" est probablement l'entrée générique du même groupe que Radio Plus Agadir. Ambigu — voir ci-dessous. |

## 2. Stations purement arabes sans slug latin (slug vide → routes cassées)

Ces 6 entrées ont un `slug` vide après slugify (caractères arabes uniquement). **Les routes `/station/<slug>` ne fonctionnent pas pour elles.**

| Nom | Stream URL | Recommandation |
|---|---|---|
| إذاعة طريق السلف | airtime.salafwayfm.ly | **Supprimer** — radio libyenne, pas marocaine, hors scope |
| إذاعة ماهر المعيقلي | qurango.net/maher | Renommer slug "maher-al-muaiqly" — récitateur Coran |
| اذاعة القرآن الكريم | radiojar.com/...kxtzuv | Probable doublon de `al-quran-radio` ou `qoran-radio` — supprimer |
| القارئ محمد أيوب | qurango.net/mohammed_ayyub | Renommer slug "mohammed-ayyub" |
| تفسير بن عثيمين | qurango.net/tafseer | Renommer slug "tafseer-ibn-othaymeen" |
| مختصر التفسير | qurango.net/mukhtasartafsir | Renommer slug "mukhtasar-tafseer" |

**Recommandation par défaut** : supprimer les 6 (ce sont des sous-canaux Coran de Qurango.net, déjà couverts par les stations Coran principales). À ta validation.

## 3. Stations ambiguës — TON ARBITRAGE NÉCESSAIRE

| Cas | Détail | Question pour toi |
|---|---|---|
| **Adwaa multi-canaux** | `adwaa-fm` (principal) + 3 sous-canaux MRC:-Radio Adwaa : ATFAL 4 (kids), MaZika 5, Music 3 | Garder les 4 (variantes éditoriales) ou supprimer les 3 sous-canaux et ne garder que `adwaa-fm` ? |
| **Coran/Quran multiples** | `qoran-radio`, `al-quran-radio`, plus l'entrée arabe `اذاعة القرآن الكريم` | Combien de stations Coran réelles ? Probablement 2 : Mohammed VI Coran + Al Quran Radio. Confirmer ? |
| **`bldi`** | Stream depuis... ? Nom incomplet probable | Supprimer (donnée corrompue) ou tu sais ce que c'est ? |
| **MA:- / MRC:- préfixes** | 6 entrées au total commencent par "MA:-" ou "MRC:-" (artefacts API) | Renommer en supprimant le préfixe + recalcul slug, ou supprimer toutes ces entrées si elles sont des doublons ? |
| **`Hit Radio Mgharba`** spec | Mentionné dans la spec du classement de popularité (#11) | **Pas présent dans le catalogue actuel** — c'était une mention générique dans les articles SEO mais ce n'est pas une vraie station distincte de Hit Radio. À ignorer dans le tri. |

## 4. Stations du classement de popularité spec — état dans le catalogue

Tu as fourni un classement de 25 stations. Voici l'état :

| Rank | Spec | Présent dans catalogue ? | Slug |
|---|---|---|---|
| 1 | Hit Radio | ✅ | `hit-radio` |
| 2 | Médi 1 | ✅ | `medi-1-radio` |
| 3 | MFM Radio | ✅ | `mfm` |
| 4 | Aswat | ✅ | `aswat-fm` |
| 5 | Med Radio | ✅ | `medradio` |
| 6 | Chada FM | ✅ | `chada-fm` |
| 7 | Atlantic Radio | ✅ | `atlantic-radio` |
| 8 | Radio 2M | ✅ | `radio-2m` |
| 9 | Radio Mars | ✅ | `radio-mars` |
| 10 | Cap Radio | ✅ | `cap-radio` |
| 11 | Hit Radio Mgharba | ❌ Pas de station distincte (= Hit Radio) | — |
| 12 | MFM Saghir | ❌ Pas dans Radio Browser | — |
| 13 | Luxe Radio | ❌ Pas dans Radio Browser | — |
| 14 | Radio Plus Agadir | ✅ | `radio-plus-agadir` |
| 15 | Marrakech Plus FM | ✅ | `marrakech-plus` |
| 16 | Radio Coran (Mohammed VI) | ⚠️ Probable `qoran-radio` ou `al-quran-radio` | À identifier |
| 17 | Radio Idaa Al Watania | ❌ Pas dans Radio Browser pour le Maroc | — |
| 18 | Al Amazighia | ❌ Pas dans Radio Browser | — |
| 19 | Adwaa FM | ✅ | `adwaa-fm` |
| 20 | Radio Assadisa FM | ❌ Pas dans Radio Browser | — |
| 21 | Medina FM | ✅ | `medinafm` |
| 22 | Radio Sawa Maroc | ❌ Pas dans Radio Browser pour le Maroc | — |
| 23 | Radio Tanger | ❌ Pas dans Radio Browser | — |
| 24 | Radio Plus | ⚠️ Probable `radio-plus-agadir` | — |
| 25 | Yabiladi Radio | ✅ | `radio-yabiladi` |

→ **15 stations sur 25 du spec sont présentes dans le catalogue.** 10 manquantes (radios non référencées par Radio Browser API). Pour le tri par popularité, je propose : ranks 1-25 = stations spec présentes (avec gaps), puis ranks 26+ = autres stations dans l'ordre alphabétique.

## 5. Casse des noms — à uniformiser

Plusieurs entrées ont une casse incohérente venant de l'API. Recommandation : normaliser proprement.

| Actuel | Proposé |
|---|---|
| HIT RADIO | Hit Radio |
| MEDI 1 RADIO | Medi 1 Radio |
| MEDRADIO | Med Radio |
| CHADA FM | Chada FM |
| MEDINAFM | Medina FM |
| CAP RADIO | Cap Radio |
| QORAN RADIO | Qoran Radio |
| RADIO MARS | Radio Mars |
| SKYROCK CASABLANCA | Skyrock Casablanca |
| ZINE BLADI | Zine Bladi |
| achkid fm | Achkid FM |

**⚠️ Important** : si on change le `name`, le **slug recalculé reste le même** (déjà en kebab-case). Donc **aucune URL ne casse**. Seul l'affichage change.

## 6. Estimation finale

| Métrique | Avant | Estimé après |
|---|---|---|
| Total stations | 50 | **~38-40** |
| Doublons confirmés supprimés | — | -3 |
| Stations Arabe-only à supprimer | — | -6 (ou renommer si tu veux les garder) |
| Préfixes MA:-/MRC:- problématiques | — | -3 à -6 selon ton arbitrage |
| Tri | Alphabétique | Par `popularity_rank` (1-25 spec, puis 26+ alpha) |

## 7. Code à modifier

| Fichier | Changement |
|---|---|
| `public/radios.json` | Suppression entrées + ajout `popularity_rank` + normalisation casse |
| `data/stations-source.json` | Idem (source de vérité enrichie) |
| `scripts/apply-stations.mjs` | Étendre pour appliquer popularity_rank + filtrer arabic-only par défaut + uniformiser casse |
| `src/hooks/useCatalog.js` | Tri par `popularity_rank` au lieu de `localeCompare` |
| `src/components/SideMenu.jsx` | Tri intra-catégorie : passer de `localeCompare` à `popularity_rank` |
| `public/_redirects` | Redirections 301 si on supprime des slugs qui ont des routes (ex. les 3 entrées MA:-/MRC:-) |

---

# ❓ Questions à valider avant l'étape 1

**Q1.** Pour les **3 doublons confirmés** (#1-3 du tableau §1), je supprime tels quels ? Confirme.

**Q2.** Pour les **6 stations purement arabes** (§2) :
- (a) toutes supprimer (recommandé — sous-canaux Coran déjà couverts)
- (b) garder en renommant les slugs (Maher Al Muaiqly, Mohammed Ayyub, etc.)
- (c) au cas par cas — dis-moi lesquelles garder

**Q3.** Pour **Adwaa multi-canaux** (§3) :
- (a) garder les 4 (Adwaa FM + 3 sous-canaux ATFAL/MaZika/Music)
- (b) garder uniquement `adwaa-fm` principal

**Q4.** Pour **`bldi`** : tu sais ce que c'est ou je supprime ?

**Q5.** Pour les **6 entrées préfixées MA:-/MRC:-** restantes (autres que les 3 doublons confirmés) :
- (a) renommer en supprimant le préfixe (ex. "MRC:-Sawt Al Amal" → "Sawt Al Amal")
- (b) supprimer toutes

**Q6.** Pour la **normalisation de casse** (HIT RADIO → Hit Radio, etc.) : OK pour appliquer ?

**Q7.** Pour les **10 stations du classement spec absentes** du catalogue (Luxe Radio, Radio Sawa Maroc, etc.) : on les ignore (popularity_rank assigné aux 15 présentes seulement) ou tu veux que je les ajoute manuellement avec leurs URLs de stream ?

---

**🛑 STOP — j'attends ton retour sur Q1-Q7 avant de toucher quoi que ce soit.**
