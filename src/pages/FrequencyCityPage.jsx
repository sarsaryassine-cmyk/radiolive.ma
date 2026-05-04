import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, AlertCircle, Play, Radio as RadioIco } from 'lucide-react';

import RadioIcon from '../components/RadioIcon.jsx';
import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import { useAppContext } from '../AppContext.jsx';
import { FREQUENCIES, CITY_KEYS } from '../data/frequencies.js';

const SITE_URL = (typeof window !== 'undefined' && window.location.origin) || '';

const broadcastServiceJsonLd = (city) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `Fréquences Radio à ${city.name} — Liste complète des radios FM`,
  url: `${SITE_URL}/frequence-radio-${city.key}`,
  inLanguage: ['fr-MA', 'ar-MA'],
  about: {
    '@type': 'Place',
    name: city.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.region,
      addressCountry: 'MA',
    },
    ...(city.coords && {
      geo: { '@type': 'GeoCoordinates', latitude: city.coords.lat, longitude: city.coords.lng },
    }),
  },
  mainEntity: city.stations.map((s) => ({
    '@type': 'BroadcastService',
    name: s.name,
    broadcastFrequency: {
      '@type': 'BroadcastFrequencySpecification',
      broadcastFrequencyValue: parseFloat(s.fm),
      broadcastSignalModulation: 'FM',
    },
    inLanguage: ['fr-MA', 'ar-MA'],
    broadcastDisplayName: s.name,
    ...(s.slug && { url: `${SITE_URL}/station/${s.slug}` }),
  })),
});

export default function FrequencyCityPage({ cityKey: cityKeyProp }) {
  const params = useParams();
  const cityKey = cityKeyProp || params.city;
  const { radios } = useAppContext();
  const city = FREQUENCIES[cityKey];

  // Other cities for footer linking (excluding current)
  const otherCities = useMemo(
    () => CITY_KEYS.filter((k) => k !== cityKey).map((k) => ({ key: k, ...FREQUENCIES[k] })),
    [cityKey]
  );

  // Resolve station catalog entries for those that have a slug — used for the icon
  const radioBySlug = useMemo(() => {
    const m = new Map();
    for (const r of radios) m.set(r.id, r);
    return m;
  }, [radios]);

  if (!city) {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <h2 className="font-display text-2xl font-bold mb-2">Ville inconnue</h2>
        <Link to="/frequences-radio-maroc" className="btn-primary inline-flex">
          Voir toutes les villes
        </Link>
      </div>
    );
  }

  // Group stations: confirmed first, approximate at the end
  const sorted = [
    ...city.stations.filter((s) => !s.approximate),
    ...city.stations.filter((s) => s.approximate),
  ];
  const hasApprox = city.stations.some((s) => s.approximate);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-6 sm:pt-10 pb-16 max-w-5xl mx-auto"
    >
      <Seo
        title={`Fréquences Radio à ${city.name} — Liste complète des radios FM`}
        description={`Découvrez toutes les fréquences radio FM à ${city.name}. Liste de ${city.stations.length} stations FM avec format, type et lien vers le streaming en direct. Trouvez rapidement la fréquence de votre radio préférée.`}
        jsonLd={[
          broadcastServiceJsonLd(city),
          breadcrumbJsonLd([
            { name: 'Accueil', url: '/' },
            { name: 'Fréquences Radio', url: '/frequences-radio-maroc' },
            { name: city.name },
          ]),
        ]}
      />

      <Link to="/frequences-radio-maroc"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Toutes les villes
      </Link>

      <header className="mt-6 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[11px] font-medium text-white/70 mb-4">
          <MapPin className="h-3.5 w-3.5 text-brand-300" />
          {city.region} · {city.population} habitants
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-balance leading-tight">
          Fréquences Radio à <span className="gradient-text">{city.name}</span>
        </h1>
        <p className="text-white/75 text-lg leading-relaxed mt-4">
          Liste complète des fréquences FM des radios marocaines disponibles à {city.name},
          avec format, type de programmation et accès direct à l'écoute en streaming.
        </p>
      </header>

      {/* Frequency table */}
      <section className="glass rounded-3xl overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-white/60 text-[11px] uppercase tracking-wider">
              <th className="text-left px-4 py-3 w-12">#</th>
              <th className="text-left px-4 py-3">Radio</th>
              <th className="text-left px-4 py-3 w-24">Fréquence</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Type</th>
              <th className="text-right px-4 py-3 w-24">Écouter</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => {
              const r = s.slug ? radioBySlug.get(s.slug) : null;
              return (
                <tr key={`${s.name}-${s.fm}`}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white/45 tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {r ? (
                        <span className="shrink-0">
                          <RadioIcon radio={r} size="sm" />
                        </span>
                      ) : (
                        <div className="h-10 w-10 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center">
                          <RadioIco className="h-4 w-4 text-white/40" />
                        </div>
                      )}
                      <span className="font-medium truncate">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-display font-bold tabular-nums">
                    <span style={{
                      background: r ? `linear-gradient(120deg, ${r.gradientFrom}, ${r.gradientTo})` : undefined,
                      WebkitBackgroundClip: r ? 'text' : undefined,
                      WebkitTextFillColor: r ? 'transparent' : undefined,
                    }}>
                      {s.fm} FM
                    </span>
                    {s.approximate && (
                      <AlertCircle
                        className="h-3 w-3 inline-block ml-1.5 text-amber-400"
                        title="Fréquence approximative — à vérifier localement"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-white/65">
                    {s.type}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.slug ? (
                      <Link
                        to={`/station/${s.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white"
                        style={r ? {
                          background: `linear-gradient(120deg, ${r.gradientFrom}, ${r.gradientTo})`,
                        } : { background: 'rgba(124,77,255,0.65)' }}
                      >
                        <Play className="h-3 w-3" /> Écouter
                      </Link>
                    ) : (
                      <span className="text-[11px] text-white/40">FM uniquement</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {hasApprox && (
        <p className="text-[12px] text-amber-300/70 mb-10 inline-flex items-start gap-2">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          Les fréquences marquées d'un{' '}
          <AlertCircle className="h-3 w-3 inline mx-0.5 text-amber-400" />
          sont approximatives — n'hésitez pas à utiliser le scan FM automatique de votre récepteur
          pour confirmer.
        </p>
      )}

      {/* SEO body — ~700 mots par ville, intro spécifique + sections génériques */}
      <section className="prose-invert max-w-none text-white/75 leading-relaxed space-y-4">
        <h2 className="font-display text-2xl font-bold text-white mt-4 mb-3">
          La radio à {city.name}
        </h2>
        <p>{city.intro}</p>

        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-3">
          Diversité des stations disponibles
        </h2>
        <p>
          Avec <strong>{city.stations.length} stations FM</strong> répertoriées, {city.name} offre
          une grande diversité éditoriale pour les auditeurs locaux : des radios musicales pour
          tous les goûts (pop internationale, variétés arabes, hits, hip-hop), des radios
          d'information continue (Médi 1, Atlantic Radio), des radios économiques et business
          (Cap Radio, Atlantic Radio), des radios religieuses (Radio Coran de la SNRT, programmes
          spirituels), et des radios régionales spécifiques à la région {city.region}.
        </p>
        <p>
          Cette pluralité de l'offre reflète la maturité du paysage radiophonique marocain depuis
          la libéralisation des ondes en 2006. Chaque station propose une identité éditoriale et
          musicale propre, permettant aux habitants de {city.name} de choisir la radio qui
          correspond le mieux à leur sensibilité — qu'ils soient amateurs de variétés arabes,
          fans de hip-hop, ou en quête d'information de fond.
        </p>

        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-3">
          Importance des radios locales dans la vie quotidienne
        </h2>
        <p>
          Pour les habitants de {city.name}, la radio reste un médium central de la vie
          quotidienne. Le matin pendant la préparation du petit-déjeuner et les trajets vers le
          travail, la mi-journée pour les bulletins d'information et les magazines de société, le
          soir pour la musique et le divertissement : la radio accompagne tous les moments de la
          journée. Les commerçants des souks, les chauffeurs de taxi, les artisans, les employés
          de bureau, les femmes au foyer — tous ont leurs stations préférées, mémorisées dans la
          touche presets de leur récepteur.
        </p>
        <p>
          Au-delà de l'écoute individuelle, la radio joue un rôle social important à {city.name}.
          Les dédicaces musicales pendant les fêtes familiales (mariages, aïds, anniversaires),
          les couvertures live des grands événements locaux (festivals, matchs de football,
          inaugurations), les talk-shows interactifs où les auditeurs peuvent intervenir par
          téléphone : autant de moments qui font de la radio un véritable lien communautaire.
        </p>

        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-3">
          Comment écouter ces radios autrement qu'en FM ?
        </h2>
        <p>
          Si vous n'êtes pas à {city.name} ou si vous voulez une qualité audio supérieure aux
          parasites FM, le <strong>streaming en ligne</strong> est désormais la solution de
          référence. Notre plateforme regroupe les flux audio officiels de toutes les radios
          ci-dessus, accessibles 24 h / 24 sans inscription, en haute qualité (jusqu'à 256 kbps en
          HLS HD pour Médi 1 et Radio 2M, 128 kbps en MP3 pour la majorité des autres). Cliquez
          sur le bouton « Écouter » dans le tableau pour accéder directement à la page de la
          radio choisie.
        </p>

        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-3">
          Voir aussi
        </h2>
        <ul className="list-disc pl-6 space-y-1.5 marker:text-brand-300">
          <li>
            <Link to="/frequences-radio-maroc" className="text-brand-300 hover:underline">
              Fréquences radio toutes villes
            </Link>
          </li>
          <li>
            <Link to={`/radio-${city.key}`} className="text-brand-300 hover:underline">
              Radios à {city.name} (page éditoriale)
            </Link>
          </li>
          <li>
            <Link to="/top-radio-maroc" className="text-brand-300 hover:underline">
              Top 10 des radios marocaines
            </Link>
          </li>
          <li>
            <Link to="/" className="text-brand-300 hover:underline">
              Écouter toutes les radios marocaines en streaming
            </Link>
          </li>
        </ul>
      </section>

      {/* Other cities */}
      <section className="mt-12 glass rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold mb-4">
          Fréquences radio dans les autres villes
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
          {otherCities.map((c) => (
            <li key={c.key}>
              <Link
                to={`/frequence-radio-${c.key}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass hover:bg-white/8 text-white/80 hover:text-white transition-colors"
              >
                <MapPin className="h-3 w-3 text-brand-300" />
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </motion.article>
  );
}
