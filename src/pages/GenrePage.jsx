import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import RadioCard from '../components/RadioCard.jsx';
import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import { useAppContext } from '../AppContext.jsx';

const GENRE_DATA = {
  chaabi: {
    name: 'Chaabi',
    title: 'Radio Maroc Chaabi en direct — Musique populaire marocaine',
    intro:
      "Le chaabi est l'âme musicale populaire du Maroc. Né dans les rues de Casablanca, Fès et Marrakech au XXᵉ siècle, ce genre puise dans le mawal, la aïta, la hayha et les rythmes des fêtes de mariage pour offrir une musique festive, dansante et profondément ancrée dans la culture marocaine.",
    keyStations: ['zine-bladi', 'yabiladi-chaabi-maroc', 'medi-1-tarab', 'mfm', 'radio-aswat'],
    blocks: [
      {
        h2: 'Qu\'est-ce que le chaabi marocain ?',
        p: "Le chaabi (de l'arabe sha'bī, « populaire ») désigne la musique populaire urbaine du Maroc. Il se distingue par ses rythmes entraînants, ses textes accessibles, ses thèmes proches du quotidien et sa fonction festive — c'est par excellence la musique des mariages, des fêtes de famille et des célébrations. On distingue plusieurs sous-genres : le chaabi des grandes villes, l'aïta du Doukkala-Abda, la hayha du Tafilalet, le rwais soussi, le malhoun de Meknès et Fès. Chaque région a ses maîtres et son répertoire.",
      },
      {
        h2: 'Les radios chaabi marocaines en streaming',
        p: "Plusieurs radios marocaines diffusent du chaabi 24 h / 24. Zine Bladi est la radio chaabi par excellence : sa programmation met à l'honneur les grands maîtres comme Stati, Daoudi, Najat Aâtabou, Senhaji, ainsi que les nouvelles générations qui modernisent ce patrimoine vivant. Yabiladi Chaabi Maroc, programme de la radio Yabiladi, diffuse sans interruption les classiques et nouveautés de la musique populaire urbaine. Medi 1 Tarab propose un programme plus orienté vers la grande chanson arabe classique, mais inclut régulièrement des plages de chaabi marocain.",
      },
      {
        h2: 'L\'aïta et la hayha, racines du chaabi',
        p: "L'aïta (« cri ») est une forme de chaabi rural propre aux régions de Doukkala, Abda, Chaouia et Rehamna. Chantée par des troupes (les chioukhs et chikhates), elle traite de l'amour, du deuil, de la satire sociale ou des grands événements historiques. La hayha, plus présente dans le sud-est, est un chant collectif sur des rythmes hypnotiques. Ces musiques racines, longtemps dévalorisées, sont aujourd'hui célébrées comme un patrimoine immatériel précieux et diffusées sur plusieurs radios marocaines en ligne.",
      },
      {
        h2: 'Pourquoi écouter le chaabi en streaming',
        p: "Pour la diaspora marocaine, le chaabi est un lien direct avec le pays d'origine — la musique des mariages familiaux, des aïds, des moments de vie. Le streaming permet d'accéder en HD à toutes ces stations depuis n'importe où dans le monde. Notre catalogue regroupe plus de 30 radios marocaines, dont les principales radios chaabi, dans une expérience moderne et fluide.",
      },
    ],
  },
  hit: {
    name: 'Hit',
    title: 'Radio Maroc Hit en direct — Musique pop et hits internationaux',
    intro:
      "Les radios musicales marocaines de format « hits » sont devenues le rendez-vous incontournable du jeune public. Elles diffusent les tubes du moment, mêlent pop internationale, R&B, hip-hop et grandes voix marocaines, et accompagnent des millions d'auditeurs au quotidien.",
    keyStations: ['hit-radio', 'mfm', 'medradio', 'chada-fm', 'medina-fm', 'radio-aswat', 'skyrock-casablanca'],
    blocks: [
      {
        h2: 'Hit Radio, leader du format jeune au Maroc',
        p: "Hit Radio est la radio musicale n° 1 du Maroc, lancée en 2006 par Younes Boumehdi. Avec son slogan « Ma vie, ma radio », elle s'adresse aux 15-35 ans avec une programmation 100 % hits internationaux pop, R&B, hip-hop, dance et grands artistes marocains contemporains. Diffusée sur plus de 25 fréquences FM (95.4 à Casablanca, 92.5 à Rabat, etc.), elle est désormais leader d'audience grâce à ses morning shows cultes (« Momo Show »), ses découvertes musicales et son fort engagement digital.",
      },
      {
        h2: 'MFM, Medradio et le Hit Radio Group',
        p: "Hit Radio fait partie du Hit Radio Group, qui édite également MFM (radio musicale dédiée aux musiques afro-orientales : raï, chaabi, gnaoua, musique amazighe, pop arabe) et Medradio (variétés arabes et marocaines grand public). Ce groupe est devenu le premier acteur radio privé du pays, avec une couverture FM exceptionnelle et une présence digitale forte.",
      },
      {
        h2: 'Les autres radios hits marocaines',
        p: "Aux côtés du Hit Radio Group, d'autres stations occupent le segment des hits : Chada FM (variétés arabes pop), Aswat (variétés arabes et libano-égyptiennes), Medina FM (variétés et musique marocaine moderne), et Skyrock Casablanca (filiale de Skyrock France, format 100 % hip-hop / R&B). Ensemble, ces radios couvrent tous les goûts musicaux du jeune public marocain.",
      },
      {
        h2: 'Écouter les hits en direct gratuitement',
        p: "Notre site permet d'écouter en streaming HD toutes ces radios musicales marocaines, sans coupure publicitaire intrusive et sans inscription. Le lecteur audio Spotify-like suit votre navigation et vous donne accès à 30+ stations en un clic. Découvrez aussi notre page dédiée aux radios marocaines amazighes pour explorer une autre facette du paysage musical.",
      },
    ],
  },
  amazigh: {
    name: 'Amazigh',
    title: 'Radio Maroc Amazigh en direct — Musique et culture berbère',
    intro:
      "La culture amazighe (berbère) est l'une des composantes fondatrices de l'identité marocaine. Plusieurs radios diffusent en tachelhit, tamazight ou tarifit, et mettent à l'honneur la richesse musicale et culturelle des régions du Souss, du Rif et de l'Atlas.",
    keyStations: ['yabiladi-azawan-amazigh', 'radio-atbir', 'radio-achkid-fm', 'radio-plus-agadir'],
    blocks: [
      {
        h2: 'Les radios amazighes marocaines',
        p: "Le Maroc, dont la Constitution de 2011 a officialisé la langue amazighe, dispose d'un paysage radiophonique amazigh en plein développement. Yabiladi Azawan Amazigh est le flux musical amazigh de la radio Yabiladi : il diffuse en continu les musiques traditionnelles et modernes du Rif, du Souss et de l'Atlas — ahidous, ahouach, izlan, rwais, ainsi que les nouvelles générations. Radio Atbir (« la colombe ») et Radio Achkid FM, principalement en tachelhit, sont des radios régionales très populaires dans le Souss et au sud du royaume. Radio Plus Agadir, basée dans la capitale du Souss, propose également une part importante de programmes amazighs.",
      },
      {
        h2: 'Les genres musicaux amazighs',
        p: "La musique amazighe marocaine est extraordinairement diverse : ahidous (Atlas central, danses collectives), ahouach (Atlas et Souss, festivités collectives), izlan (chants poétiques), rwais (troupes de musiciens errants du Souss, depuis le XIXᵉ siècle), reggada (Rif oriental, danse collective). Cette pluralité reflète la diversité des trois grands groupes linguistiques amazighs marocains : les Tachelhitophones (sud), les Tamazighophones (centre) et les Tarifitophones (nord-est).",
      },
      {
        h2: 'Une scène musicale moderne et engagée',
        p: "Au-delà du patrimoine, la musique amazighe s'est profondément modernisée avec des artistes comme Najat Aâtabou, Khalid Bouchnak, Massa Bouchafa, le groupe Imanaren, ou encore les nouvelles voix électro-pop. Les radios marocaines amazighes accompagnent cette modernisation et offrent une vitrine unique à ces artistes, qui ne trouvent pas toujours leur place sur les médias mainstream arabophones.",
      },
      {
        h2: 'Pour la diaspora amazighe',
        p: "La diaspora amazighe — particulièrement importante en Belgique, en France et aux Pays-Bas — utilise massivement le streaming pour rester connectée à sa culture d'origine. Notre site centralise les principales radios amazighes du Maroc, accessibles 24 h / 24 sans inscription depuis n'importe quel pays.",
      },
    ],
  },
};

export default function GenrePage({ genreKey: genreKeyProp }) {
  const params = useParams();
  const genreKey = genreKeyProp || params.genre;
  const { radios, audio, playRadio, favorites, isFavorite, toggleFavorite } = useAppContext();
  const data = GENRE_DATA[genreKey];

  const stations = useMemo(() => {
    if (!data) return [];
    return data.keyStations
      .map((id) => radios.find((r) => r.id === id))
      .filter(Boolean);
  }, [radios, data]);

  if (!data) {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <h2 className="font-display text-2xl font-bold mb-2">Genre inconnu</h2>
        <Link to="/" className="btn-primary inline-flex">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <article className="pt-6 sm:pt-10 pb-16 max-w-5xl mx-auto">
      <Seo
        title={data.title}
        description={`Écoutez les meilleures radios marocaines de ${data.name.toLowerCase()} en direct. ${data.intro.slice(0, 120)}…`}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Radios par genre', url: '/' },
          { name: data.name },
        ])}
      />

      <Link to="/" className="text-sm text-white/60 hover:text-white">← Retour</Link>

      <h1 className="font-display text-3xl sm:text-5xl font-bold mt-6 mb-6 text-balance">
        Radio Maroc <span className="gradient-text">{data.name}</span>
      </h1>

      <p className="text-white/80 text-lg leading-relaxed mb-10">{data.intro}</p>

      {stations.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-5">
            Stations à écouter
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
        <h2 className="font-display text-xl font-semibold mb-4">Autres genres musicaux</h2>
        <div className="flex flex-wrap gap-2">
          {Object.keys(GENRE_DATA)
            .filter((k) => k !== genreKey)
            .map((k) => (
              <Link key={k} to={`/radio-maroc-${k}`}
                className="px-4 py-2 rounded-full glass text-sm hover:bg-white/10 transition-colors">
                Radio Maroc {GENRE_DATA[k].name}
              </Link>
            ))}
        </div>
      </section>
    </article>
  );
}
