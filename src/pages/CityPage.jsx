import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import RadioCard from '../components/RadioCard.jsx';
import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import { useAppContext } from '../AppContext.jsx';

/**
 * Generic city landing page (~900 words SEO copy + city-tagged stations).
 * Powered by CITY_DATA below — same component handles all 6 cities.
 *
 * Routes mounted in App.jsx:
 *   /radio-casablanca, /radio-rabat, /radio-marrakech,
 *   /radio-tanger, /radio-fes, /radio-agadir
 */

const CITY_DATA = {
  casablanca: {
    name: 'Casablanca',
    title: 'Radio Casablanca en direct — Toutes les radios FM de Casa',
    intro:
      "Casablanca, capitale économique du Maroc, est aussi le cœur battant du paysage radiophonique national. La majorité des grandes radios privées y ont leurs studios et y diffusent leurs principales fréquences FM.",
    keyStations: ['hit-radio', 'radio-mars', 'medradio', 'cap-radio', 'atlantic-radio', 'skyrock-casablanca', 'medinafm', 'mfm', 'chada-fm'],
    blocks: [
      {
        h2: 'Les radios FM les plus écoutées à Casablanca',
        p: "À Casablanca, les ondes FM sont densément peuplées. Hit Radio (95.4 MHz) reste la première radio musicale auprès des 15-35 ans avec son slogan « Ma vie, ma radio ». Radio Mars (88.0 MHz) domine le créneau sportif avec ses retransmissions live des matchs de la Botola Pro et des grands rendez-vous internationaux. Chada FM, MFM et Medradio se partagent l'audience musicale grand public avec leurs sélections variétés arabes et hits internationaux. Côté économie, Cap Radio et Atlantic Radio offrent un programme premium destiné aux décideurs et aux entrepreneurs.",
      },
      {
        h2: 'Pourquoi écouter la radio de Casablanca en streaming ?',
        p: "Pour les Casablancais en déplacement, les expatriés ou les visiteurs, le streaming permet de garder le lien avec sa ville. Les radios casablancaises diffusent toute la journée des informations locales (trafic urbain, événements culturels, programmation des stades), de la musique marocaine et internationale, des débats sur l'actualité économique et politique. La qualité du flux internet est généralement supérieure à la FM grâce aux encodages MP3 128 kbps et HLS HD pour les diffuseurs publics comme Radio 2M.",
      },
      {
        h2: 'Histoire radio à Casablanca',
        p: "Casablanca a été le berceau de la radio commerciale au Maroc. La libéralisation des ondes en 2006 a permis à des entrepreneurs locaux comme Younes Boumehdi (Hit Radio Group) de lancer des radios privées qui ont profondément modernisé le paysage médiatique. Aujourd'hui, la ville compte plus de 15 fréquences FM actives, dont une majorité ont leur siège dans les quartiers de Maârif, Ain Diab ou les zones d'affaires de Sidi Maârouf.",
      },
    ],
  },
  rabat: {
    name: 'Rabat',
    title: 'Radio Rabat en direct — Stations FM de la capitale',
    intro:
      "Rabat, capitale politique et administrative du Maroc, abrite les sièges des grandes institutions médiatiques publiques : la SNRT, le groupe 2M, ainsi que des radios institutionnelles et culturelles. Le paysage radiophonique de Rabat est plus institutionnel, plus posé, avec une forte présence des chaînes nationales.",
    keyStations: ['radio-2m', 'medi-1-radio', 'medi-1-classique', 'medi-1-radio-andalouse', 'qoran-radio'],
    blocks: [
      {
        h2: 'Les radios publiques et institutionnelles à Rabat',
        p: "Radio 2M, adossée à la deuxième chaîne télévisée du royaume, diffuse depuis Aïn Sebaâ et est captée à Rabat sur la FM. La radio publique SNRT (Al Idaâ Al Wataniya, Chaîne Inter, Mohammed VI du Saint Coran) a ses studios historiques à Rabat. Médi 1 Radio, dont les bureaux principaux sont à Tanger, dispose également d'antennes à Rabat. Pour la musique classique, Médi 1 Classique est un programme thématique très apprécié des auditeurs urbains de la capitale.",
      },
      {
        h2: 'Une radio marocaine à l\'écoute de la capitale',
        p: "L'auditeur de Rabat trouve dans le streaming l'occasion d'accéder à des radios spécialisées qui ne sont pas toujours sur la FM locale : Médi 1 Radio Andalouse pour les amateurs de nouba marocaine, Yabiladi Chaabi Maroc pour la musique populaire, ou Radio Coran pour les programmes religieux. Les ministères, les universités, les administrations sont des auditeurs réguliers des radios économiques et d'information continue.",
      },
      {
        h2: 'Vivre Rabat en musique',
        p: "Rabat est aussi une ville culturelle, hôte du Festival Mawazine — Rythmes du Monde, l'un des plus grands festivals d'Afrique. Pendant ce festival, toutes les radios musicales du pays diffusent en direct depuis l'OLM Souissi et les autres scènes. Notre site permet de retrouver ces grandes émissions toute l'année en streaming.",
      },
    ],
  },
  marrakech: {
    name: 'Marrakech',
    title: 'Radio Marrakech en direct — Toutes les FM de la ville ocre',
    intro:
      "Marrakech, capitale touristique du Maroc, dispose d'un paysage radiophonique propre, où la radio régionale Marrakech Plus côtoie les grandes chaînes nationales captées en FM. La ville ocre attire des millions de visiteurs et possède une scène musicale vivante (gnaoua, andalouse, festivals).",
    keyStations: ['marrakech-plus', 'medi-1-radio-andalouse', 'medi-1-tarab', 'chada-fm', 'hit-radio'],
    blocks: [
      {
        h2: 'Marrakech Plus, la radio locale de la ville rouge',
        p: "Marrakech Plus est la principale radio régionale de Marrakech. Sa programmation conjugue actualité locale (vie de la ville, événements culturels, festivals comme le Festival International du Film de Marrakech), musique marocaine et orientale, et magazines de proximité. Une radio essentielle pour les Marrakchis et les visiteurs de la cité impériale, à écouter facilement en streaming depuis notre site.",
      },
      {
        h2: 'Musique gnaoua et radios à Marrakech',
        p: "Marrakech est l'un des hauts lieux de la musique gnaoua, héritière du syncrétisme africain. Si aucune radio ne se consacre exclusivement à ce genre, plusieurs programmes (Médi 1 Tarab, MFM) lui font régulièrement la part belle. Notre catalogue de radios marocaines en ligne permet de découvrir toutes ces musiques traditionnelles depuis n'importe quel point du globe.",
      },
      {
        h2: 'Pourquoi le streaming est idéal à Marrakech',
        p: "Avec un afflux touristique permanent et une couverture FM parfois inégale dans certains riads ou hôtels, le streaming offre une alternative fiable pour les locaux comme pour les visiteurs. Les grandes chaînes nationales (Hit Radio, Chada FM, Medi 1) sont accessibles en haute qualité, et nos pages dédiées par radio fournissent une présentation complète de chaque station.",
      },
    ],
  },
  tanger: {
    name: 'Tanger',
    title: 'Radio Tanger en direct — La radio du nord du Maroc',
    intro:
      "Tanger, ville-monde du nord marocain, est historiquement liée à la radio. C'est en effet à Tanger, en 1980, qu'a été créée Médi 1 Radio, la grande radio bilingue franco-arabe du Maghreb. La ville vit au rythme des ondes méditerranéennes et bénéficie de sa proximité avec l'Espagne et l'Europe.",
    keyStations: ['medi-1-radio', 'medi-1-tarab', 'medi-1-classique', 'medi-1-radio-andalouse', 'medi-1-dj', 'hit-radio'],
    blocks: [
      {
        h2: 'Médi 1 Radio, la voix méditerranéenne de Tanger',
        p: "Médi 1 (Méditerranée Internationale) est probablement la radio la plus emblématique de Tanger. Créée en 1980 et basée dans la zone de Tanger Méditerranée, elle diffuse en grandes ondes et en FM sur tout le Maghreb (Maroc, Algérie, Tunisie, Libye, Mauritanie) et le sud de l'Europe. Sa grille combine éditions d'information toutes les heures, magazines politiques et économiques, débats culturels, et plusieurs flux musicaux thématiques (Tarab, Andalouse, Classique, DJ).",
      },
      {
        h2: 'Tanger, ville d\'écoute multiculturelle',
        p: "Tanger est une ville carrefour, où se croisent les influences arabes, berbères, africaines et européennes. Cette diversité se retrouve dans les habitudes d'écoute de ses habitants : on y écoute autant Médi 1 en français qu'Hit Radio en darija ou Radio Coran en arabe classique. Notre catalogue regroupe l'ensemble de ces radios pour une écoute fluide et continue, avec un lecteur audio qui suit votre navigation sur le site.",
      },
      {
        h2: 'Tanger sur les ondes, du local à l\'international',
        p: "Les Tangérois ont la particularité d'avoir accès aux radios espagnoles et françaises captées depuis l'autre rive. En complément, le streaming offre les radios marocaines et internationales arabes (Monte Carlo Doualiya) en haute qualité. C'est cette double appartenance qui rend Tanger unique dans le paysage radiophonique national.",
      },
    ],
  },
  fes: {
    name: 'Fès',
    title: 'Radio Fès en direct — Stations FM de la capitale spirituelle',
    intro:
      "Fès, capitale spirituelle et culturelle du Maroc, fondée en 789, abrite l'une des plus anciennes universités du monde (la Quaraouiyine). Cette ville millénaire vit au rythme des radios marocaines, avec une part importante de programmes religieux et culturels reflétant son héritage.",
    keyStations: ['qoran-radio', 'al-quran-radio', 'radio-manarat', 'medi-1-radio-andalouse', 'medi-1-tarab', 'hit-radio'],
    blocks: [
      {
        h2: 'Radios religieuses et programmes coraniques à Fès',
        p: "Fès, berceau de l'enseignement religieux malékite, est l'un des publics les plus attentifs aux radios coraniques. Radio Coran (Idaât Al Qor'an Al Karim), Al Quran Radio et Radio Manarat sont écoutées quotidiennement. Notre plateforme propose ces stations en streaming continu, avec récitations psalmodiées des plus grands lecteurs (Sudais, Shuraim, Mishary Al-Afasy, Maher Al-Mu'aiqly), leçons de tafsir et conférences d'oulémas.",
      },
      {
        h2: 'La musique andalouse, patrimoine fassi sur les ondes',
        p: "Fès est l'une des grandes capitales de la musique arabo-andalouse, héritage de la chute de Grenade. La nouba marocaine y a été préservée par des conservatoires comme celui de la Quaraouiyine. Médi 1 Radio Andalouse, programme musical de Médi 1, diffuse en continu ce répertoire raffiné. Une radio essentielle pour tous les amateurs de la grande tradition musicale savante du Maghreb.",
      },
      {
        h2: 'Une ville d\'auditeurs en quête de sens',
        p: "Le public fassi cherche dans la radio à la fois la spiritualité, la culture et la modernité. C'est pourquoi notre site propose un large spectre allant des radios religieuses aux stations musicales contemporaines en passant par les chaînes d'information. La sticky-search sur la page d'accueil permet de filtrer instantanément parmi les 35 stations disponibles.",
      },
    ],
  },
  agadir: {
    name: 'Agadir',
    title: 'Radio Agadir en direct — Stations FM du Souss',
    intro:
      "Agadir, capitale du Souss et grande ville balnéaire du Maroc, dispose de plusieurs radios régionales reflétant la culture amazighe et l'identité du sud du royaume. Radio Plus Agadir, Radio Atbir et Radio Achkid FM diffusent une programmation ancrée dans la vie locale, en darija et en tachelhit.",
    keyStations: ['radio-plus-agadir', 'radio-atbir', 'radio-achkid-fm', 'yabiladi-azawan-amazigh', 'medi-1-radio'],
    blocks: [
      {
        h2: 'Les radios amazighes du Souss',
        p: "La région d'Agadir est un haut lieu de la culture amazighe au Maroc. Plusieurs radios — Radio Atbir, Radio Achkid FM, Yabiladi Azawan Amazigh — diffusent en tachelhit et mettent à l'honneur la musique amazighe traditionnelle (ahidous, ahouach, izlan, raïs) ainsi que les nouvelles générations d'artistes. Le streaming permet à la diaspora soussie en Europe d'accéder à ces programmes en direct.",
      },
      {
        h2: 'Radio Plus Agadir, la radio régionale du sud',
        p: "Radio Plus Agadir est la radio régionale de référence du Souss et diffuse principalement dans le sud du royaume (Agadir, Inezgane, Taroudant, Tiznit). Sa programmation combine variétés arabes, musique amazighe, informations régionales et magazines culturels. Très ancrée dans la vie locale, c'est l'une des radios les plus écoutées d'Agadir et de sa région.",
      },
      {
        h2: 'Pourquoi écouter la radio d\'Agadir en streaming',
        p: "Pour les Soussis en déplacement, les MRE originaires du sud, ou les visiteurs de la station balnéaire, le streaming offre la possibilité de rester en lien avec la culture du Souss. Les radios marocaines en ligne — qu'elles soient régionales ou nationales — sont accessibles 24 h / 24, sans inscription, et la qualité audio est généralement supérieure à la FM grâce aux flux MP3 et HLS.",
      },
    ],
  },
};

export default function CityPage({ cityKey: cityKeyProp }) {
  const params = useParams();
  const cityKey = cityKeyProp || params.city;
  const { radios, audio, playRadio, favorites, isFavorite, toggleFavorite } = useAppContext();
  const data = CITY_DATA[cityKey];

  const stations = useMemo(() => {
    if (!data) return [];
    return data.keyStations
      .map((id) => radios.find((r) => r.id === id))
      .filter(Boolean);
  }, [radios, data]);

  if (!data) {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <h2 className="font-display text-2xl font-bold mb-2">Ville inconnue</h2>
        <Link to="/" className="btn-primary inline-flex">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <article className="pt-6 sm:pt-10 pb-16 max-w-5xl mx-auto">
      <Seo
        title={data.title}
        description={`Toutes les radios de ${data.name} en direct gratuitement. ${data.intro.slice(0, 130)}…`}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Radios par ville', url: '/' },
          { name: data.name },
        ])}
      />

      <Link to="/" className="text-sm text-white/60 hover:text-white">← Retour</Link>

      <h1 className="font-display text-3xl sm:text-5xl font-bold mt-6 mb-6 text-balance">
        Radio <span className="gradient-text">{data.name}</span> en direct
      </h1>

      <p className="text-white/80 text-lg leading-relaxed mb-10">{data.intro}</p>

      {stations.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-5">
            Les radios à écouter à {data.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {stations.map((r) => (
              <RadioCard
                key={r.id}
                radio={r}
                isActive={audio.current?.id === r.id}
                isPlaying={audio.current?.id === r.id && audio.isPlaying}
                isFavorite={isFavorite(r.id)}
                onPlay={playRadio}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      <div className="prose-invert max-w-none text-white/75 leading-relaxed space-y-6">
        {data.blocks.map((b, i) => (
          <section key={i}>
            <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">{b.h2}</h2>
            <p>{b.p}</p>
          </section>
        ))}
      </div>

      <section className="mt-12 glass rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold mb-4">Découvrir d'autres villes</h2>
        <div className="flex flex-wrap gap-2">
          {Object.keys(CITY_DATA)
            .filter((k) => k !== cityKey)
            .map((k) => (
              <Link
                key={k}
                to={`/radio-${k}`}
                className="px-4 py-2 rounded-full glass text-sm hover:bg-white/10 transition-colors"
              >
                Radio {CITY_DATA[k].name}
              </Link>
            ))}
        </div>
      </section>
    </article>
  );
}
