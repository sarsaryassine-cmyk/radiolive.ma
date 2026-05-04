import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Music2, Loader2, Play } from 'lucide-react';

import RadioIcon from '../components/RadioIcon.jsx';
import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import { useAppContext } from '../AppContext.jsx';
import { useNowPlaying, useStationHistory, youtubeSearchUrl, shareUrl } from '../hooks/useSongs.js';

const SITE_URL = (typeof window !== 'undefined' && window.location.origin) || '';

const recordingJsonLd = (radio, live) => {
  if (!radio || !live) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: live.title,
    byArtist: { '@type': 'MusicGroup', name: live.artist },
    url: `${SITE_URL}/station/${radio.id}/chanson-actuelle`,
    isPartOf: { '@type': 'RadioStation', name: radio.name },
  };
};

export default function StationNowPlayingPage() {
  const { slug } = useParams();
  const { radios, audio, playRadio } = useAppContext();
  const radio = useMemo(() => radios.find((r) => r.id === slug), [radios, slug]);
  const live = useNowPlaying(slug);
  const { data: history } = useStationHistory(slug);

  if (!radio) {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <h2 className="font-display text-2xl font-bold mb-2">Station introuvable</h2>
        <Link to="/" className="btn-primary inline-flex">Retour à l'accueil</Link>
      </div>
    );
  }

  const isPlaying = audio.current?.id === radio.id && audio.isPlaying;
  const recent = history?.songs?.slice(0, 5) || [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-6 sm:pt-10 pb-16 max-w-3xl mx-auto"
    >
      <Seo
        title={`Quelle chanson passe maintenant sur ${radio.name} ?`}
        description={
          live
            ? `En ce moment sur ${radio.name} : ${live.artist} — ${live.title}. Écoutez en direct ou retrouvez le morceau sur YouTube.`
            : `Découvrez la chanson en cours de diffusion sur ${radio.name}, mise à jour en temps réel.`
        }
        jsonLd={[
          recordingJsonLd(radio, live),
          breadcrumbJsonLd([
            { name: 'Accueil', url: '/' },
            { name: radio.name, url: `/station/${radio.id}` },
            { name: 'Chanson actuelle' },
          ]),
        ].filter(Boolean)}
      />

      <Link to={`/station/${radio.id}`}
        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6">
        <ArrowLeft className="h-4 w-4" /> Retour à {radio.name}
      </Link>

      <h1 className="font-display text-2xl sm:text-4xl font-bold leading-tight mb-8 text-balance">
        Quelle chanson passe maintenant sur{' '}
        <span className="gradient-text">{radio.name}</span> ?
      </h1>

      {/* Hero card */}
      <section className="relative glass rounded-3xl p-6 sm:p-8 overflow-hidden">
        <div
          className="absolute -inset-px rounded-3xl opacity-30 blur-2xl pointer-events-none -z-10"
          style={{
            background: `linear-gradient(135deg, ${radio.gradientFrom}, ${radio.gradientTo})`,
          }}
        />

        <div className="flex items-start gap-5">
          <RadioIcon radio={radio} size="xl" playing={isPlaying} />
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[11px] sm:text-[10px] uppercase tracking-wider text-emerald-300 font-semibold mb-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              En direct sur {radio.name}
            </div>

            {live ? (
              <>
                <p className="text-white/70 text-sm mb-1">Artiste</p>
                <p className="font-display text-2xl sm:text-3xl font-bold mb-4">
                  {live.artist}
                </p>
                <p className="text-white/70 text-sm mb-1">Chanson</p>
                <p className="font-display text-xl sm:text-2xl text-white/95 mb-6">
                  {live.title}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => playRadio(radio)}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white"
                    style={{
                      background: `linear-gradient(120deg, ${radio.gradientFrom}, ${radio.gradientTo})`,
                    }}
                  >
                    <Play className="h-4 w-4" />
                    Écouter {radio.name} en direct
                  </button>
                  <a
                    href={youtubeSearchUrl(live.artist, live.title)}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold glass hover:bg-white/10 transition-colors"
                  >
                    <Music2 className="h-4 w-4" /> Voir sur YouTube
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                  <a
                    href={shareUrl(live.artist, live.title)}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold glass hover:bg-white/10 transition-colors"
                  >
                    Partager
                  </a>
                </div>
              </>
            ) : (
              <>
                <p className="text-white/70 mb-4">
                  Aucune métadonnée n'est actuellement remontée pour {radio.name}.
                  C'est généralement le cas pour les flux HLS HD ou les radios coraniques.
                </p>
                <button
                  onClick={() => playRadio(radio)}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white"
                  style={{
                    background: `linear-gradient(120deg, ${radio.gradientFrom}, ${radio.gradientTo})`,
                  }}
                >
                  <Play className="h-4 w-4" />
                  Écouter {radio.name} en direct
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Recent tracks */}
      {recent.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold mb-4">
            Les 5 dernières chansons diffusées
          </h2>
          <ul className="space-y-2">
            {recent.map((s, i) => (
              <li key={i} className="glass rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] text-white/45 tabular-nums">{s.time}</p>
                  <p className="text-sm font-semibold truncate">{s.artist}</p>
                  <p className="text-xs text-white/65 truncate">{s.title}</p>
                </div>
                <a href={youtubeSearchUrl(s.artist, s.title)}
                   target="_blank" rel="noreferrer"
                   className="text-[11px] text-brand-300 hover:text-white whitespace-nowrap">
                  Écouter →
                </a>
              </li>
            ))}
          </ul>
          <Link to={`/station/${radio.id}/historique`}
                className="inline-flex items-center gap-2 mt-4 text-sm text-brand-300 hover:text-white">
            Voir l'historique complet de la journée →
          </Link>
        </section>
      )}

      {/* SEO body — short here since it's a thin landing page */}
      <section className="mt-10 text-white/75 leading-relaxed text-sm">
        <h2 className="font-display text-xl font-bold text-white mb-3">
          À propos de cette page
        </h2>
        <p>
          Cette page affiche en temps réel le morceau actuellement en cours de diffusion sur{' '}
          <strong>{radio.name}</strong>. Les données sont mises à jour automatiquement toutes les
          30 secondes via les métadonnées du flux audio. Vous pouvez écouter la chanson sur YouTube
          en cliquant sur le bouton, ou lancer le streaming live de {radio.name} pour suivre la
          programmation en direct.
        </p>
      </section>
    </motion.article>
  );
}
