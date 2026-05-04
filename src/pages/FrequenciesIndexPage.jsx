import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radio, MapPin } from 'lucide-react';

import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import { cityList } from '../data/frequencies.js';
import useI18n from '../i18n/useI18n.js';

const SITE_URL = (typeof window !== 'undefined' && window.location.origin) || '';

const webPageJsonLd = (cities) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Fréquences Radio Maroc — Liste complète des radios FM par ville',
  url: `${SITE_URL}/frequences-radio-maroc`,
  inLanguage: ['fr-MA', 'ar-MA'],
  about: { '@type': 'Thing', name: 'Fréquences FM des radios marocaines' },
  hasPart: cities.map((c) => ({
    '@type': 'WebPage',
    name: `Fréquences Radio à ${c.name}`,
    url: `${SITE_URL}/frequence-radio-${c.key}`,
  })),
});

export default function FrequenciesIndexPage() {
  const cities = cityList();
  const { t, lang } = useI18n();
  const isAr = lang === 'ar';
  const homeHref = isAr ? '/ar' : '/';

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-6 sm:pt-10 pb-16 max-w-4xl mx-auto"
    >
      <Seo
        lang={lang}
        title={isAr
          ? 'ترددات راديو المغرب — قائمة الإذاعات FM حسب المدينة'
          : 'Fréquences Radio Maroc — Liste complète des radios FM par ville'}
        description={isAr
          ? 'اطلع على جميع ترددات الراديو في المغرب مرتبة حسب المدينة: الدار البيضاء، الرباط، مراكش، فاس، طنجة، أكادير وأكثر من 16 مدينة. ابحث عن تردد FM لهيت راديو، ميدي1، شدى إف إم وراديو 2M وجميع الإذاعات المغربية.'
          : 'Consultez toutes les fréquences radio au Maroc classées par ville : Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir et plus de 16 villes. Trouvez facilement la fréquence FM de Hit Radio, Médi 1, Chada FM, Radio 2M et toutes les radios marocaines.'}
        canonical={`https://radiolive.ma${isAr ? '/ar' : ''}/frequences-radio-maroc`}
        alternates={[
          { hreflang: 'fr-MA', href: 'https://radiolive.ma/frequences-radio-maroc' },
          { hreflang: 'ar-MA', href: 'https://radiolive.ma/ar/frequences-radio-maroc' },
          { hreflang: 'x-default', href: 'https://radiolive.ma/frequences-radio-maroc' },
        ]}
        jsonLd={[
          webPageJsonLd(cities),
          breadcrumbJsonLd([
            { name: t('nav.home'), url: homeHref },
            { name: isAr ? 'ترددات راديو المغرب' : 'Fréquences Radio Maroc' },
          ]),
        ]}
      />

      <Link to={homeHref} className="text-sm text-white/60 hover:text-white">← {t('nav.back')}</Link>

      <h1 className="font-display text-3xl sm:text-5xl font-bold mt-6 mb-6 text-balance">
        Fréquences Radio <span className="gradient-text">Maroc</span>
      </h1>
      <p className="text-white/80 text-lg leading-relaxed mb-10">
        La liste complète des fréquences FM des radios marocaines, organisée par ville.
        Choisissez votre ville ci-dessous pour voir le tableau détaillé des stations qui y
        diffusent, leur format musical et un accès direct à l'écoute en streaming.
      </p>

      {/* Grid of cities */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-16">
        {cities.map((c) => (
          <Link
            key={c.key}
            to={`/frequence-radio-${c.key}`}
            className="group glass rounded-2xl p-4 hover:bg-white/8 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-3.5 w-3.5 text-brand-300" />
              <span className="font-display font-semibold text-sm group-hover:text-brand-300 transition-colors">
                {c.name}
              </span>
            </div>
            <p className="text-[11px] text-white/50">
              {c.stations.length} fréquences FM
            </p>
          </Link>
        ))}
      </section>

      {/* Long-form SEO body — ~ 850 mots */}
      <section className="prose-invert max-w-none text-white/75 leading-relaxed space-y-5">
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          Comment fonctionnent les fréquences radio FM au Maroc ?
        </h2>
        <p>
          La <strong>radio FM</strong> (modulation de fréquence) utilise une bande de fréquences
          allant de <strong>87.5 MHz à 108.0 MHz</strong>, dans laquelle chaque station se voit
          attribuer un canal précis par la <strong>HACA (Haute Autorité de la Communication
          Audiovisuelle)</strong>, l'organisme régulateur du paysage audiovisuel marocain. Au Maroc,
          comme dans tous les pays utilisant la norme FM internationale, l'écart minimal entre deux
          stations voisines est généralement de 0.4 MHz pour éviter les interférences.
        </p>
        <p>
          La portée d'un émetteur FM dépend de plusieurs paramètres : sa puissance (quelques
          dizaines à plusieurs milliers de watts), la hauteur de l'antenne, le relief géographique
          environnant et la météo. C'est pourquoi <strong>une même radio change de fréquence d'une
          ville à l'autre</strong> au Maroc — chaque émetteur régional dispose de son propre canal
          attribué pour rester intelligible localement sans empiéter sur les zones voisines. Hit
          Radio, par exemple, émet sur <em>95.4 MHz à Casablanca</em>, <em>92.5 MHz à Rabat</em>,
          <em> 91.8 MHz à Marrakech</em> et <em>96.7 MHz à Tanger</em>.
        </p>

        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          Comment trouver une radio au Maroc ?
        </h2>
        <p>
          Pour trouver une radio en FM, vous avez plusieurs options. La plus simple est de consulter
          notre annuaire ci-dessus : sélectionnez votre ville et accédez au tableau complet des
          fréquences. Si votre récepteur dispose d'une fonction « scan automatique » (présente sur
          tous les autoradios modernes et la plupart des récepteurs portables), il suffit de
          parcourir la bande FM — les stations détectées s'enregistrent dans la mémoire de
          l'appareil.
        </p>
        <p>
          Pour ceux qui veulent éviter les variations de fréquence entre villes, ou écouter une
          radio depuis l'étranger, le <strong>streaming en ligne</strong> est désormais la solution
          la plus fiable. Notre site centralise les flux audio officiels de toutes les grandes
          radios marocaines en haute qualité (jusqu'à 256 kbps en HLS HD), accessibles 24 h / 24
          depuis n'importe quel appareil.
        </p>

        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          Pourquoi les fréquences changent-elles selon la ville ?
        </h2>
        <p>
          La planification des fréquences FM au Maroc est confiée à la HACA, qui attribue les canaux
          en fonction de la géographie et de l'évitement des interférences. Une radio nationale
          comme <strong>Médi 1 Radio</strong>, <strong>Hit Radio</strong> ou{' '}
          <strong>Chada FM</strong> doit donc utiliser une fréquence différente dans chaque
          agglomération qu'elle couvre. C'est ce qui explique que la même radio puisse être captée
          sur 88.0 MHz à Casablanca, 92.5 MHz à Rabat et 91.8 MHz à Marrakech.
        </p>
        <p>
          Pour les <strong>auditeurs en déplacement</strong>, il est utile de mémoriser au moins
          deux ou trois fréquences locales de leurs radios préférées dans chaque grande ville
          marocaine, ou de basculer simplement sur le streaming via une connexion 4G/5G — qui
          conserve la même URL de flux indépendamment du lieu.
        </p>

        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          L'importance des radios locales au Maroc
        </h2>
        <p>
          Au-delà des grandes radios privées qui couvrent l'ensemble du royaume, le paysage
          marocain comprend aussi des <strong>radios régionales</strong> qui jouent un rôle
          essentiel dans la vie locale. <em>Marrakech Plus</em> (Marrakech), <em>Radio Plus
          Agadir</em> (Souss), <em>Radio Atbir</em> (sud, en tachelhit), les radios régionales de
          la SNRT à Tétouan, Oujda, Laâyoune, Béni Mellal, Nador : autant de stations qui
          informent les populations locales en darija, en amazigh, en hassani — selon les régions
          — et qui couvrent les événements, le sport, l'agriculture et la culture de proximité.
        </p>
        <p>
          Pour les Marocains du monde (MRE), connaître la fréquence FM de leur ville d'origine
          peut aussi servir lors des retours estivaux au bled. Cette page permet de retrouver la
          carte sonore des grandes villes du royaume, et la liste à jour des canaux FM utilisés.
        </p>

        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">
          Sources et fiabilité des données
        </h2>
        <p>
          Notre base de fréquences agrège les données officielles publiées par la HACA, les sites
          des stations elles-mêmes, ainsi que des relevés FM compilés par OnlineRadioBox et
          radio-locator. Pour les villes les plus desservies (Casablanca, Rabat, Marrakech,
          Tanger, Fès, Agadir), les fréquences sont confirmées. Pour les villes plus petites,
          certaines fréquences sont signalées comme « approximatives » lorsque nous n'avons pas
          pu les vérifier sur deux sources indépendantes — vous le verrez clairement dans chaque
          tableau, avec une icône d'avertissement et une note explicative.
        </p>
        <p>
          Si vous constatez une erreur sur une fréquence, n'hésitez pas à nous le signaler — nous
          mettons à jour la base régulièrement pour conserver l'annuaire le plus fiable du
          paysage radiophonique marocain.
        </p>
      </section>

      {/* Cities listing again, prominently */}
      <section className="mt-12 glass rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold mb-4">
          Toutes les villes couvertes
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
          {cities.map((c) => (
            <li key={c.key}>
              <Link
                to={`/frequence-radio-${c.key}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass hover:bg-white/8 text-white/80 hover:text-white transition-colors"
              >
                <Radio className="h-3 w-3 text-brand-300" />
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </motion.article>
  );
}
