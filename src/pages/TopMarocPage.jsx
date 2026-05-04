import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music2, ExternalLink, Loader2, TrendingUp } from 'lucide-react';

import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import { useGlobalTopSongs, youtubeSearchUrl } from '../hooks/useSongs.js';

const SITE_URL = (typeof window !== 'undefined' && window.location.origin) || '';

const itemListJsonLd = (top) => {
  if (!top?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top 50 des chansons diffusées au Maroc',
    numberOfItems: top.length,
    url: `${SITE_URL}/top-chansons-maroc`,
    itemListElement: top.slice(0, 50).map((s, i) => ({
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

export default function TopMarocPage() {
  const { data: top, updatedAt, loading } = useGlobalTopSongs();

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-6 sm:pt-10 pb-16 max-w-4xl mx-auto"
    >
      <Seo
        title="Top 50 chansons au Maroc — chansons les plus diffusées sur les radios marocaines"
        description="Le classement des 50 chansons les plus diffusées sur l'ensemble des radios marocaines en streaming. Mise à jour automatique. Hits arabes, marocains et internationaux."
        jsonLd={[
          itemListJsonLd(top),
          breadcrumbJsonLd([
            { name: 'Accueil', url: '/' },
            { name: 'Top chansons Maroc' },
          ]),
        ].filter(Boolean)}
      />

      <Link to="/" className="text-sm text-white/60 hover:text-white">← Retour</Link>

      <h1 className="font-display text-3xl sm:text-5xl font-bold mt-6 mb-4 text-balance">
        Top 50 des <span className="gradient-text">chansons diffusées au Maroc</span>
      </h1>

      <p className="text-white/75 text-lg leading-relaxed mb-2">
        Le classement des morceaux les plus diffusés en ce moment sur l'ensemble des radios
        marocaines de notre catalogue. Le calcul agrège l'historique de diffusion de plus de 30
        stations FM et webradios, avec un bonus pour les morceaux qui tournent sur plusieurs
        antennes.
      </p>
      {updatedAt && (
        <p className="text-[11px] text-white/40 uppercase tracking-wider mb-10">
          Dernière mise à jour : {new Date(updatedAt).toLocaleString('fr-FR')}
        </p>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-brand-300" />
        </div>
      ) : !top.length ? (
        <div className="glass rounded-3xl p-10 text-center text-white/60">
          Pas encore de classement disponible. Le top est calculé à partir de l'historique de
          diffusion qui se remplit au fil des heures.
        </div>
      ) : (
        <ol className="space-y-2">
          {top.slice(0, 50).map((s, i) => (
            <li key={`${s.artist}-${s.title}`}
                className="flex items-center gap-4 glass rounded-2xl px-4 py-3 hover:bg-white/8 transition-colors">
              <span className="font-display text-2xl sm:text-3xl font-bold gradient-text w-12 text-center shrink-0 tabular-nums">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold leading-tight truncate">
                  {s.artist}
                </p>
                <p className="text-sm text-white/65 truncate">{s.title}</p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-white/45 shrink-0">
                <TrendingUp className="h-3 w-3" />
                {s.plays} plays · {s.radios} radio{s.radios > 1 ? 's' : ''}
              </span>
              <a
                href={youtubeSearchUrl(s.artist, s.title)}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-brand-300 hover:text-white transition-colors shrink-0"
              >
                <Music2 className="h-3.5 w-3.5" /> YouTube
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </li>
          ))}
        </ol>
      )}

      {/* SEO body */}
      <section className="mt-16 prose-invert max-w-none text-white/75 leading-relaxed">
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          Le top des chansons les plus écoutées au Maroc
        </h2>
        <p className="mb-4">
          Cette page agrège la programmation musicale de l'ensemble des radios marocaines présentes
          sur notre plateforme — Hit Radio, Radio Mars, Chada FM, Médi 1, Radio 2M, MFM, Medina FM,
          Cap Radio, Atlantic Radio, Skyrock Casablanca, Aswat, Medradio, Yabiladi, et plus de 20
          autres stations. Le classement reflète donc les goûts musicaux dominants des Marocains à
          travers le pays, et constitue un indicateur précieux des tendances musicales actuelles.
        </p>
        <p className="mb-4">
          Notre algorithme compte chaque diffusion individuelle d'une chanson, puis applique un
          bonus de 10 % pour chaque radio supplémentaire sur laquelle le morceau tourne. Une
          chanson diffusée 10 fois sur une seule radio aura un score de 10. Une chanson diffusée 6
          fois sur trois radios différentes aura un score de 6 × (1 + 0.2) = 7.2 — ce qui valorise
          les morceaux qui font consensus à travers le paysage radio marocain.
        </p>
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          Tendances musicales 2026 au Maroc
        </h2>
        <p className="mb-4">
          La scène musicale marocaine continue d'être l'une des plus créatives du monde arabe.
          <strong> Saad Lamjarred</strong> reste le leader incontesté du pop marocain à
          l'international, avec des hits comme « Lm3allem » et « Casablanca ». La nouvelle
          génération du rap — <strong>ElGrande Toto</strong>, <strong>7liwa</strong>,{' '}
          <strong>Stormy</strong>, <strong>Manal BK</strong>, <strong>Khtek</strong> — porte la
          créativité urbaine marocaine bien au-delà des frontières.
        </p>
        <p className="mb-4">
          Côté variétés arabes, <strong>Tamer Hosny</strong>, <strong>Amr Diab</strong>,{' '}
          <strong>Nancy Ajram</strong> et <strong>Wael Kfoury</strong> dominent les playlists des
          radios populaires. Pour le chaabi, <strong>Najat Aâtabou</strong> et{' '}
          <strong>Stati</strong> restent les piliers diffusés sur les radios du soir et des
          week-ends. Le raï oranais — <strong>Cheb Khaled</strong>, <strong>Cheb Mami</strong>,{' '}
          <strong>Cheba Maria</strong> — fait également partie du patrimoine régulièrement remis à
          l'honneur.
        </p>
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          Comment écouter ces chansons ?
        </h2>
        <p className="mb-4">
          Pour chaque morceau du classement, nous proposons un lien direct vers une recherche
          YouTube, qui permet de retrouver immédiatement le clip officiel ou les versions
          audio. Vous pouvez aussi écouter en direct la radio qui diffuse actuellement le plus
          souvent ce morceau via notre <Link to="/" className="text-brand-300 hover:underline">page d'accueil</Link>{' '}
          qui regroupe toutes les radios marocaines en streaming gratuit.
        </p>
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          Voir aussi
        </h2>
        <ul className="list-disc pl-6 space-y-2 marker:text-brand-300">
          <li><Link to="/top-radio-maroc" className="text-brand-300 hover:underline">Top 10 des radios marocaines</Link></li>
          <li><Link to="/radio-maroc-hit" className="text-brand-300 hover:underline">Radios musicales marocaines (hits)</Link></li>
          <li><Link to="/radio-maroc-chaabi" className="text-brand-300 hover:underline">Radios marocaines chaabi</Link></li>
          <li><Link to="/radio-maroc-amazigh" className="text-brand-300 hover:underline">Radios marocaines amazighes</Link></li>
          <li><Link to="/blog" className="text-brand-300 hover:underline">Blog Radio Maroc — actualités, dossiers, classements</Link></li>
        </ul>
      </section>
    </motion.article>
  );
}
