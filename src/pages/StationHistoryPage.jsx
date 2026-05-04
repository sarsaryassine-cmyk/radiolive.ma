import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Share2, Music2, Clock, Loader2 } from 'lucide-react';

import RadioIcon from '../components/RadioIcon.jsx';
import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import { useAppContext } from '../AppContext.jsx';
import { useStationHistory, useNowPlaying, youtubeSearchUrl } from '../hooks/useSongs.js';

const SITE_URL = (typeof window !== 'undefined' && window.location.origin) || '';

const musicPlaylistJsonLd = (radio, history) => {
  if (!radio || !history?.songs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicPlaylist',
    name: `Historique des chansons diffusées sur ${radio.name} aujourd'hui`,
    numTracks: history.songs.length,
    inLanguage: ['fr-MA', 'ar-MA'],
    url: `${SITE_URL}/station/${radio.id}/historique`,
    track: history.songs.slice(0, 30).map((s, i) => ({
      '@type': 'MusicRecording',
      position: i + 1,
      name: s.title,
      byArtist: { '@type': 'MusicGroup', name: s.artist },
    })),
  };
};

export default function StationHistoryPage() {
  const { slug } = useParams();
  const { radios } = useAppContext();
  const radio = useMemo(() => radios.find((r) => r.id === slug), [radios, slug]);
  const { data: history, loading } = useStationHistory(slug);
  const live = useNowPlaying(slug);

  if (!radio) {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <h2 className="font-display text-2xl font-bold mb-2">Station introuvable</h2>
        <Link to="/" className="btn-primary inline-flex">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-6 sm:pt-10 pb-16 max-w-4xl mx-auto"
    >
      <Seo
        title={`Historique des chansons diffusées sur ${radio.name} aujourd'hui`}
        description={`Liste mise à jour en direct des chansons et artistes diffusés sur ${radio.name} aujourd'hui. Heures de diffusion, écoute YouTube, partage. Catalogue automatique 24h/24.`}
        jsonLd={[
          musicPlaylistJsonLd(radio, history),
          breadcrumbJsonLd([
            { name: 'Accueil', url: '/' },
            { name: radio.name, url: `/station/${radio.id}` },
            { name: 'Historique' },
          ]),
        ].filter(Boolean)}
      />

      <Link to={`/station/${radio.id}`}
        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6">
        <ArrowLeft className="h-4 w-4" /> Retour à {radio.name}
      </Link>

      {/* Header */}
      <header className="flex items-start gap-5 mb-8">
        <RadioIcon radio={radio} size="lg" />
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl sm:text-4xl font-bold leading-tight text-balance">
            Historique des chansons diffusées sur{' '}
            <span className="gradient-text">{radio.name}</span> aujourd'hui
          </h1>
          {live && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[12px]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <strong className="text-white">En direct :</strong>
              <span className="text-white/80">{live.artist} — {live.title}</span>
            </div>
          )}
        </div>
      </header>

      {/* Table */}
      <section className="glass rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-brand-300" />
          </div>
        ) : !history?.songs?.length ? (
          <div className="p-10 text-center text-white/60 text-sm">
            Aucun historique disponible pour le moment. Les données sont collectées automatiquement
            via les métadonnées ICY du flux audio. Pour les flux qui n'exposent pas leurs métadonnées
            (HLS, Coran), l'historique reste vide.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-white/60 text-[11px] uppercase tracking-wider">
                <th className="text-left px-4 py-3 w-20"><Clock className="h-3.5 w-3.5 inline mr-1" /> Heure</th>
                <th className="text-left px-4 py-3">Artiste</th>
                <th className="text-left px-4 py-3">Chanson</th>
                <th className="text-right px-4 py-3 w-32">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.songs.map((s, i) => (
                <tr key={`${i}-${s.time}`}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white/60 tabular-nums">{s.time}</td>
                  <td className="px-4 py-3 font-medium">{s.artist}</td>
                  <td className="px-4 py-3 text-white/85">{s.title}</td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={youtubeSearchUrl(s.artist, s.title)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[12px] text-brand-300 hover:text-white transition-colors"
                    >
                      <Music2 className="h-3.5 w-3.5" /> Écouter
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* SEO body copy ~600 mots */}
      <section className="mt-12 prose-invert max-w-none text-white/75 leading-relaxed">
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          Quelle musique passe sur {radio.name} ?
        </h2>
        <p className="mb-4">
          Cette page recense en temps réel les chansons et artistes diffusés sur{' '}
          <strong>{radio.name}</strong>, l'une des stations marocaines populaires en streaming. Les
          données sont collectées automatiquement à partir des métadonnées du flux audio et mises à
          jour à chaque nouveau morceau diffusé. Vous y trouverez l'historique complet de la journée
          avec heure de diffusion, nom de l'artiste, titre de la chanson, et un lien direct pour
          retrouver chaque morceau sur YouTube.
        </p>
        <p className="mb-4">
          Le format musical de {radio.name} reflète l'identité éditoriale propre à la station.
          Selon la grille du jour, vous y entendrez aussi bien des hits internationaux que des
          artistes marocains et arabes contemporains. La rotation des chansons varie selon les
          tranches horaires : matinée énergique pour démarrer la journée, plages plus posées en
          après-midi, soirée festive ou contemplative selon les soirs.
        </p>
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          Comment l'historique est-il calculé ?
        </h2>
        <p className="mb-4">
          Notre plateforme lit les <em>métadonnées ICY</em> que la radio embarque dans son flux
          audio MP3 ou AAC. À chaque nouveau morceau, le titre apparaît sur cette page sous quelques
          secondes. Pour les flux HLS HD (Radio 2M, Médi 1, Chada FM en HD) ou les radios spécialisées
          (récitations coraniques, programmes parlés), les métadonnées ne sont pas toujours
          disponibles — l'historique peut alors être vide ou incomplet.
        </p>
        <p className="mb-4">
          Vous pouvez écouter en direct chaque morceau en cliquant sur le bouton « Écouter » qui
          ouvre une recherche YouTube préformatée. C'est la solution la plus universelle pour
          retrouver n'importe quelle chanson, indépendamment de sa disponibilité sur les plateformes
          de streaming musical.
        </p>
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          Voir aussi
        </h2>
        <ul className="list-disc pl-6 space-y-2 marker:text-brand-300">
          <li>
            <Link to={`/station/${radio.id}/top-chansons`} className="text-brand-300 hover:underline">
              Top 10 des chansons les plus diffusées sur {radio.name}
            </Link>
          </li>
          <li>
            <Link to={`/station/${radio.id}/chanson-actuelle`} className="text-brand-300 hover:underline">
              Quelle chanson passe maintenant sur {radio.name} ?
            </Link>
          </li>
          <li>
            <Link to="/top-chansons-maroc" className="text-brand-300 hover:underline">
              Top 50 des chansons diffusées au Maroc — toutes radios confondues
            </Link>
          </li>
          <li>
            <Link to={`/station/${radio.id}`} className="text-brand-300 hover:underline">
              Page principale de {radio.name} — biographie, fréquences, lecteur live
            </Link>
          </li>
        </ul>
      </section>
    </motion.article>
  );
}
