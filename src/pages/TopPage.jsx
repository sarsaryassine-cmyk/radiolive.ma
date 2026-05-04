import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import RadioCard from '../components/RadioCard.jsx';
import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import { useAppContext } from '../AppContext.jsx';
import useI18n from '../i18n/useI18n.js';

const TOP_ORDER = [
  'hit-radio',
  'radio-mars',
  'medi-1-radio',
  'chada-fm',
  'radio-2m',
  'mfm',
  'radio-aswat',
  'medradio',
  'medina-fm',
  'cap-radio',
];

export default function TopPage() {
  const { radios, audio, playRadio, favorites, isFavorite, toggleFavorite } = useAppContext();
  const { t, lang } = useI18n();
  const isAr = lang === 'ar';
  const homeHref = isAr ? '/ar' : '/';

  const top = useMemo(
    () => TOP_ORDER.map((id) => radios.find((r) => r.id === id)).filter(Boolean),
    [radios]
  );

  return (
    <article className="pt-6 sm:pt-10 pb-16 max-w-5xl mx-auto">
      <Seo
        lang={lang}
        title={isAr
          ? 'أفضل 10 إذاعات مغربية — أحسن راديوهات المغرب 2026'
          : 'Top 10 des radios marocaines — Meilleures radios du Maroc'}
        description={isAr
          ? 'ترتيب أفضل 10 إذاعات مغربية للاستماع المباشر: هيت راديو، راديو مارس، ميدي1، شدى إف إم، راديو 2M والمزيد. بث مجاني وبجودة عالية.'
          : "Le classement des 10 meilleures radios marocaines à écouter en direct : Hit Radio, Radio Mars, Medi 1, Chada FM, Radio 2M et plus. Streaming gratuit et HD."}
        canonical={`https://radiolive.ma${isAr ? '/ar' : ''}/top-radio-maroc`}
        alternates={[
          { hreflang: 'fr-MA', href: 'https://radiolive.ma/top-radio-maroc' },
          { hreflang: 'ar-MA', href: 'https://radiolive.ma/ar/top-radio-maroc' },
          { hreflang: 'x-default', href: 'https://radiolive.ma/top-radio-maroc' },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: t('nav.home'), url: homeHref },
          { name: isAr ? 'أفضل الإذاعات المغربية' : 'Top radios marocaines' },
        ])}
      />

      <Link to={homeHref} className="text-sm text-white/60 hover:text-white">← {t('nav.back')}</Link>

      <h1 className="font-display text-3xl sm:text-5xl font-bold mt-6 mb-6 text-balance">
        Top 10 des <span className="gradient-text">radios marocaines</span>
      </h1>

      <p className="text-white/80 text-lg leading-relaxed mb-10">
        Découvrez le classement des dix radios marocaines les plus écoutées en
        2026, sélectionnées d'après leur audience FM, leur popularité en
        streaming, leur fraîcheur de programmation et leur impact culturel.
        Toutes ces stations sont accessibles en direct, gratuitement et sans
        inscription depuis notre plateforme.
      </p>

      {top.length > 0 && (
        <ol className="space-y-4 mb-12">
          {top.map((r, i) => (
            <li key={r.id} className="flex items-start gap-5 glass rounded-3xl p-4 sm:p-5">
              <div className="font-display text-3xl sm:text-4xl font-bold gradient-text shrink-0 w-12 text-center">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/station/${r.id}`} className="font-display font-bold text-lg hover:text-brand-300 transition-colors">
                  {r.name}
                </Link>
                {r.description && (
                  <p className="text-sm text-white/70 mt-1 line-clamp-2">{r.description}</p>
                )}
                <div className="mt-3">
                  <button
                    onClick={() => playRadio(r)}
                    className="text-xs px-4 py-1.5 rounded-full text-white font-semibold transition-all"
                    style={{
                      background: `linear-gradient(120deg, ${r.gradientFrom}, ${r.gradientTo})`,
                    }}
                  >
                    {audio.current?.id === r.id && audio.isPlaying ? 'En cours' : 'Écouter'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="prose-invert max-w-none text-white/75 leading-relaxed space-y-6">
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">Critères du classement</h2>
        <p>
          Notre classement se base sur plusieurs critères croisés : l'audience
          mesurée par CIRAD (l'organisme officiel de mesure d'audience radio
          au Maroc), la popularité en streaming via les API publiques (clics
          Radio-Browser, votes), la couverture FM nationale, l'innovation
          éditoriale et la modernité du dispositif numérique. Les résultats
          peuvent varier d'une mesure à l'autre — ce top reflète une vue
          synthétique du paysage radiophonique marocain en 2026.
        </p>
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">Hit Radio, leader incontesté</h2>
        <p>
          Hit Radio domine depuis plusieurs années le classement des radios
          privées marocaines. Son format pop / hits, son ancrage chez les
          jeunes, ses morning shows cultes et son réseau FM dense lui assurent
          une première place stable. La radio fait partie du Hit Radio Group,
          qui édite également MFM et Medradio — propulsant ce groupe en tête
          du marché privé radio au Maroc.
        </p>
        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">Le top des radios par catégorie</h2>
        <p>
          Pour explorer les radios marocaines par thématique, consultez nos
          pages dédiées aux <Link to="/radio-maroc-hit" className="text-brand-300 hover:underline">radios musicales</Link>,{' '}
          <Link to="/radio-maroc-chaabi" className="text-brand-300 hover:underline">au chaabi</Link>{' '}
          et aux <Link to="/radio-maroc-amazigh" className="text-brand-300 hover:underline">radios amazighes</Link>.{' '}
          Et pour découvrir les radios par ville, suivez nos guides{' '}
          <Link to="/radio-casablanca" className="text-brand-300 hover:underline">Casablanca</Link>,{' '}
          <Link to="/radio-rabat" className="text-brand-300 hover:underline">Rabat</Link>,{' '}
          <Link to="/radio-marrakech" className="text-brand-300 hover:underline">Marrakech</Link>,{' '}
          <Link to="/radio-tanger" className="text-brand-300 hover:underline">Tanger</Link>,{' '}
          <Link to="/radio-fes" className="text-brand-300 hover:underline">Fès</Link>{' '}
          et <Link to="/radio-agadir" className="text-brand-300 hover:underline">Agadir</Link>.
        </p>
      </div>
    </article>
  );
}
