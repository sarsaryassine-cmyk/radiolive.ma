# Worker `radiolive-now-playing`

Cloudflare Worker qui récupère en temps réel les métadonnées ICY (artiste/titre)
des stations radiolive.ma + enrichit avec l'artwork iTunes Search API.

**Endpoint** : `GET https://radiolive.ma/api/now-playing/:slug`

## Architecture

```
   GET /api/now-playing/hit-radio
            │
            ▼
   ┌────────────────────┐
   │ KV cache (TTL 30s) │ ── HIT ──▶ return cached
   └────────────────────┘
            │ miss
            ▼
   ┌────────────────────┐
   │ Rate limit check   │ (60 req/min/slug)
   └────────────────────┘
            │ ok
            ▼
   ┌──────────────────────────────────┐
   │ fetch stream avec Icy-MetaData:1 │
   │  → parse icy-metaint             │
   │  → extrait StreamTitle           │
   └──────────────────────────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ iTunes Search artwork  │ (best-effort, 3s timeout)
   └────────────────────────┘
            │
            ▼
   ┌──────────────────┐
   │ KV put + return  │
   └──────────────────┘
```

## Installation

### 1. Login Cloudflare

```bash
cd workers/now-playing
npm install
npx wrangler login
```

### 2. Créer le KV namespace

```bash
npx wrangler kv namespace create METADATA_CACHE
```

Cloudflare retourne un ID type `id = "abcd1234..."`. **Copier-le dans `wrangler.toml`** ligne `id = "TO_BE_CREATED"` et remplacer par le vrai ID.

### 3. Tester en local

```bash
npm run dev
```

Wrangler ouvre un endpoint local (ex. `http://localhost:8787`). Tester :

```bash
curl http://localhost:8787/api/now-playing/hit-radio
curl http://localhost:8787/api/now-playing/medi-1-radio
curl http://localhost:8787/api/now-playing/inexistante  # 404 unknown_station
```

### 4. Déployer

```bash
npm run deploy
```

### 5. Lier la route à `radiolive.ma/api/now-playing/*`

La route est déclarée dans `wrangler.toml` (`[[routes]]`). Wrangler la configure
automatiquement au premier `deploy` si la zone `radiolive.ma` est déjà sous
ton compte Cloudflare. Vérifier dans **Cloudflare Dashboard → Workers & Pages
→ radiolive-now-playing → Triggers**.

## Tests manuels

```bash
# Station avec ICY supportée — devrait retourner now_playing rempli
curl https://radiolive.ma/api/now-playing/hit-radio | jq

# Station sans ICY — retourne now_playing:null avec info:no_icy_metadata
curl https://radiolive.ma/api/now-playing/qoran-radio | jq

# Cache hit (relancer dans les 30s) — "cached":true
curl https://radiolive.ma/api/now-playing/hit-radio | jq .cached

# CORS depuis le browser (Chrome DevTools → Network)
fetch('https://radiolive.ma/api/now-playing/hit-radio')
  .then(r => r.json())
  .then(console.log)
```

## Format de réponse

```json
{
  "station": "hit-radio",
  "now_playing": {
    "artist": "ElGrandeToto",
    "title": "Mghribi Sah",
    "artwork_url": "https://is1-ssl.mzstatic.com/.../600x600bb.jpg",
    "started_at": "2026-05-01T14:23:45.123Z"
  },
  "icy_metadata": {
    "name": "Hit Radio",
    "genre": "Top 40",
    "bitrate": 128
  },
  "cached": false
}
```

### Cas d'erreur — toujours HTTP 200, jamais de crash

| Situation | Réponse |
|---|---|
| Stream injoignable | `{ "now_playing": null, "error": "stream_unreachable", "icy_metadata": null }` |
| Pas de ICY metadata dans le flux | `{ "now_playing": null, "info": "no_icy_metadata", "icy_metadata": {…} }` |
| Format StreamTitle cassé | `{ "now_playing": null, "error": "parse_error" }` |
| Rate limit dépassé (60/min) | `{ "now_playing": null, "info": "rate_limited" }` |
| Station inconnue | HTTP 404 `{ "error": "unknown_station", "slug": "..." }` |

## Mise à jour des stations

Le Worker embarque `data/stations-source.json` au build (esbuild bundle). Pour
mettre à jour la liste après un `npm run sync:stations` :

```bash
cd workers/now-playing
npm run deploy
```

Wrangler rebundle automatiquement avec le nouveau JSON.

## Limites connues

- **iTunes Search API** est gratuite mais rate-limitée (~20 req/min/IP).
  Cloudflare Workers tournent depuis plein de POPs, donc la limite globale est
  rarement atteinte ; mais en cas de pic, l'artwork peut manquer (le rest des
  données reste).
- **Icy-MetaData support** dépend du serveur de streaming. ~70% des radios
  marocaines supportent. Pour les autres (souvent HLS pur ou serveurs custom),
  le Worker retourne `info: "no_icy_metadata"` proprement.
- **HLS streams** ne supportent pas Icy-MetaData (header HTTP only). Le Worker
  retournera `error: "stream_unreachable"` ou `info: "no_icy_metadata"` selon
  le serveur.

## Désactivation rapide (rollback)

Si bug en prod :

1. **Cloudflare Dashboard → Workers & Pages → radiolive-now-playing → Triggers**
2. Désactiver le route handler `radiolive.ma/api/now-playing/*`
3. Le frontend continue de marcher en fallback (dégrade gracefully sur les
   anciennes données `public/songs/now-playing.json` du cron)

Aucun redéploiement du SPA n'est nécessaire pour rollback.
