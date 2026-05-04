import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Music2, TrendingUp, Loader2 } from 'lucide-react';

import RadioIcon from '../components/RadioIcon.jsx';
import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import { useAppContext } from '../AppContext.jsx';
import { useStationTopSongs, youtubeSearchUrl } from '../hooks/useSongs.js';

const SITE_URL = (typeof window !== 'undefined' && window.location.origin) || '';

const itemListJsonLd = (radio, top) => {
  if (!radio || !top?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Top chansons du moment sur ${radio.name}`,
    numberOfItems: top.length,
    url: `${SITE_URL}/station/${radio.id}/top-chansons`,
    itemListElement: top.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'MusicRecording',
        name: s.title,
        byArtist: { '@type': 'MusicGroup', name: s.artist },
      },
    })),
  };
};

export default function StationTopSongsPage() {
  const { slug } = useParams();
  const { radios } = useAppContext();
  const radio = useMemo(() => radios.find((r) => r.id === slug), [radios, slug]);
  const { data: top, loading } = useStationTopSongs(slug);

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
        title={`Top chansons du moment sur ${radio.name}`}
        description={`Le classement des 10 chansons les plus diffusées sur ${radio.name} aujourd'hui. Mise à jour automatique. Écoutez chaque morceau sur YouTube.`}
        jsonLd={[
          itemListJsonLd(radio, top),
          breadcrumbJsonLd([
            { name: 'Accueil', url: '/' },
            { name: radio.name, url: `/station/${radio.id}` },
            { name: 'Top chansons' },
          ]),
        ].filter(Boolean)}
      />

      <Link to={`/station/${radio.id}`}
        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6">
        <ArrowLeft className="h-4 w-4" /> Retour à {radio.name}
      </Link>

      <header className="flex items-start gap-5 mb-8">
        <RadioIcon radio={radio} size="lg" />
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl sm:text-4xl font-bold leading-tight text-balance">
            Top chansons du moment sur{' '}
            <span className="gradient-text">{radio.name}</span>
          </h1>
          <p className="text-white/65 text-sm mt-3">
            Classement des 10 morceaux les plus diffusés aujourd'hui sur la station, calculé en
            temps réel depuis l'historique de diffusion.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand-300" />
        </div>
      ) : !top.length ? (
        <div className="glass rounded-3xl p-10 text-center text-white/60 text-sm">
          Aucune statistique de diffusion n'est encore disponible pour {radio.name}.
          Les données sont collectées automatiquement et le classement se met à jour toutes les
          5 minutes.
        </div>
      ) : (
        <ol className="space-y-3">
          {top.map((s, i) => (
            <li key={`${s.artist}-${s.title}`}
                className="flex items-center gap-4 glass rounded-2xl p-4">
              <span className="font-display text-3xl font-bold gradient-text w-12 text-center shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold leading-tight truncate">
                  {s.artist}
                </p>
                <p className="text-sm text-white/65 truncate">{s.title}</p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-white/50 shrink-0">
                <TrendingUp className="h-3 w-3" />
                {s.plays} diffusion{s.plays > 1 ? 's' : ''}
              </span>
              <a
                href={youtubeSearchUrl(s.artist, s.title)}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold text-white shrink-0"
                style={{
                  background: `linear-gradient(120deg, ${radio.gradientFrom}, ${radio.gradientTo})`,
                }}
              >
                <Music2 className="h-3.5 w-3.5" /> Écouter
              </a>
            </li>
          ))}
        </ol>
      )}

      {/* SEO body copy ~600 mots */}
      <section className="mt-12 prose-invert max-w-none text-white/75 leading-relaxed">
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          Comment ce classement est-il calculé ?
        </h2>
        <p className="mb-4">
          Le top des chansons les plus diffusées sur {radio.name} est calculé automatiquement à
          partir de l'historique de diffusion collecté par notre plateforme. À chaque morceau joué
          en antenne, le titre est enregistré dans une base de données qui agrège les comptes par
          chanson. Le classement reflète donc directement la programmation musicale de la station,
          sans interprétation éditoriale.
        </p>
        <p className="mb-4">
          La fréquence de diffusion d'une chanson dépend de plusieurs facteurs : la popularité de
          l'artiste, la stratégie de programmation de la radio, l'actualité musicale (sortie d'album,
          concert, buzz sur les réseaux), et bien sûr la grille horaire (les morning shows et drive
          times font tourner les hits, les plages thématiques privilégient les artistes spécifiques).
        </p>
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          Le style musical de {radio.name}
        </h2>
        {radio.description ? (
          <p className="mb-4 line-clamp-6">{radio.description}</p>
        ) : (
          <p className="mb-4">
            {radio.name} fait partie du paysage radiophonique marocain et programme une sélection
            musicale qui correspond à son public cible. Le classement ci-dessus reflète les choix
            éditoriaux récents de la station.
          </p>
        )}
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          Tendances musicales et artistes populaires au Maroc
        </h2>
        <p className="mb-4">
          La scène musicale marocaine connaît depuis cinq ans une effervescence remarquable. Saad
          Lamjarred reste l'artiste marocain le plus diffusé à l'international, avec des hits comme
          « Lm3allem » et « Casablanca » qui ont dépassé le milliard de vues sur YouTube. La nouvelle
          génération du rap — ElGrande Toto, 7liwa, Stormy, Manal BK, Khtek — porte la créativité
          urbaine marocaine sur les ondes des grandes radios musicales. Côté variétés arabes, Tamer
          Hosny, Amr Diab, Nancy Ajram et Wael Kfoury continuent de dominer les playlists des
          radios populaires comme {radio.name}.
        </p>
        <p className="mb-4">
          Pour les amateurs de musique traditionnelle, Najat Aâtabou et Stati restent les piliers du
          chaabi diffusés sur les radios du soir et des week-ends. Le raï oranais — Cheb Khaled, Cheb
          Mami, Cheba Maria — fait également partie du patrimoine sonore régulièrement remis à
          l'honneur.
        </p>
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">Voir aussi</h2>
        <ul className="list-disc pl-6 space-y-2 marker:text-brand-300">
          <li>
            <Link to={`/station/${radio.id}/historique`} className="text-brand-300 hover:underline">
              Historique complet des chansons d'aujourd'hui sur {radio.name}
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
        </ul>
      </section>
    </motion.article>
  );
}
