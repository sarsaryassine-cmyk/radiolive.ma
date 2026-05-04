# Radio Data Layer — Plan de rollback

> Documentation des points de désactivation rapide en cas de bug en
> production. Tous les morceaux sont conçus pour dégrader proprement et
> indépendamment ; rollback granulaire possible.

## Niveau 1 — Désactiver le Worker now-playing

**Cause typique** : Worker boucle / latence excessive / iTunes API bloquée.

**Action** :
1. Cloudflare Dashboard → Workers & Pages → `radiolive-now-playing`
2. **Triggers → Routes** : désactiver la route `radiolive.ma/api/now-playing/*`

**Effet** :
- Le frontend appelle `/api/now-playing/:slug` → 404
- `useLiveNowPlaying` détecte l'absence de réponse Worker → fallback automatique sur `/songs/now-playing.json` (cron statique)
- Aucune régression visible sur les pages stations
- Pages `/now/:slug` continuent de fonctionner mais sans iTunes artwork (le Cloudflare Pages Function dégrade aussi en fallback)

**Pas de redéploiement SPA nécessaire**. Effet immédiat (≤ 30s pour invalider les caches edge).

## Niveau 2 — Désactiver les pages /now/:slug (Cloudflare Pages Function SSR)

**Cause typique** : la fonction SSR injecte du HTML cassé / impacte LCP.

**Action** :
- Renommer `functions/now/[slug].js` → `functions/now/_[slug].js.disabled`
- Renommer `functions/ar/now/[slug].js` → idem
- Push + redeploy Cloudflare Pages

**Effet** :
- `/now/:slug` retombe sur le SPA fallback (rendu client-side via `_redirects`)
- Les meta tags sont injectés par react-helmet-async au runtime — Googlebot exécute JS donc indexation OK, juste léger délai de TTFB SEO

## Niveau 3 — Retirer le composant `NowPlayingStationPage` du SPA

**Cause typique** : la page React crash / casse la navigation.

**Action** :
1. Dans `src/App.jsx`, commenter ces 2 lignes :
   ```jsx
   // <Route path="/now/:slug" element={<NowPlayingStationPage />} />
   // <Route path="/ar/now/:slug" element={<NowPlayingStationPage />} />
   ```
2. `npm run build && deploy`

**Effet** : `/now/:slug` retombe sur le 404 SPA → `<Route path="*" element={<Home />} />`. Pas de page, mais pas de crash.

## Niveau 4 — Désactiver l'enrichissement MusicRecording schema sur StationPage

**Cause typique** : Google Rich Results Test signale un schema invalide / duplicate.

**Action** dans `src/pages/StationPage.jsx`, retirer une seule ligne du tableau `jsonLd` :

```jsx
jsonLd={[
  radioStationJsonLd(radio, lang),
  radioBroadcastServiceJsonLd(radio, lang),
  // musicRecordingJsonLd,   ← commenter celle-ci
  breadcrumbJsonLd([...]),
]}
```

**Effet** : RadioStation + RadioBroadcastService + Breadcrumb continuent à valider, plus de schema dynamique côté client.

## Niveau 5 — Feature flag globale (optionnel)

Si tu veux pouvoir désactiver le live-fetch sans redéployer : ajoute dans
`.env` (et Cloudflare Pages env vars) :

```
VITE_ENABLE_LIVE_NOW_PLAYING=true
```

Puis dans `src/hooks/useSongs.js`, gate `useLiveNowPlaying` :

```js
const ENABLED = import.meta.env.VITE_ENABLE_LIVE_NOW_PLAYING === 'true';

export function useLiveNowPlaying(slug) {
  if (!ENABLED) return null;
  // ... code existant
}
```

Mettre `false` dans Cloudflare Pages env → restart deploy → desactivé sans toucher au code.

(Pas implémenté par défaut pour ne pas alourdir, à activer si besoin.)

## Niveau 6 — Restore point complet

Si tout casse, le commit AVANT cette phase (Phase 1 SEO complete) reste
fonctionnel. Pour rollback complet :

```bash
git log --oneline | head -5  # trouver le commit avant radio-data-layer
git revert <hash>
git push origin main
```

Cloudflare Pages redéploie automatiquement la version précédente (~2 min).

## Checklist de validation post-rollback

Quel que soit le niveau de rollback :
- [ ] Home `/` charge correctement avec la grille de stations
- [ ] Une page station classique (`/station/hit-radio`) charge avec player audio fonctionnel
- [ ] L'audio playback démarre quand on clique Play
- [ ] Sitemap.xml accessible et valide
- [ ] robots.txt accessible
