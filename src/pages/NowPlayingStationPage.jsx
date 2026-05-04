import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, Music2, ArrowLeft, RefreshCw } from 'lucide-react';

import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import RadioIcon from '../components/RadioIcon.jsx';
import { useAppContext } from '../AppContext.jsx';
import { useLiveNowPlaying, useStationHistory } from '../hooks/useSongs.js';
import useI18n from '../i18n/useI18n.js';

const SITE_URL = 'https://radiolive.ma';

/**
 * /now/:slug (FR) et /ar/now/:slug (AR) — pages "currently playing" qui
 * cible le cluster SEO "quelle chanson passe sur X" (5K+ recherches/mois).
 *
 * Différent de /station/:slug/chanson-actuelle (existant, plus discret).
 * Cette page :
 *  - H1 dynamique avec la chanson en cours
 *  - Big artwork (iTunes 600×600) si dispo
 *  - 10 dernières chansons (history)
 *  - Schema.org MusicRecording mis à jour côté client
 *  - Liens vers la page station classique + grand bouton Play
 *
 * Si SSR via Cloudflare Pages Function activé (functions/now/[slug].js),
 * le <title> et la meta description sont pré-rendus avec les valeurs
 * actuelles. Sinon, react-helmet-async les gère côté client (Googlebot
 * exécute JS, donc indexation OK).
 */
export default function NowPlayingStationPage() {
  const { slug } = useParams();
  const { radios, audio, playRadio } = useAppContext();
  const { t, lang } = useI18n();
  const isAr = lang === 'ar';
  const arPrefix = isAr ? '/ar' : '';

  const radio = useMemo(() => radios?.find((r) => r.id === slug), [radios, slug]);
  const np = useLiveNowPlaying(slug);
  const { data: history } = useStationHistory(slug);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);

  if (!radio) {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <Seo title={isAr ? 'محطة غير موجودة' : 'Station introuvable'} noindex />
        <h2 className="font-display text-2xl font-bold mb-2">
          {isAr ? 'محطة غير موجودة' : 'Station introuvable'}
        </h2>
        <Link to={`${arPrefix}/`} className="btn-primary inline-flex">
          {isAr ? 'كل الإذاعات' : 'Toutes les radios'}
        </Link>
      </div>
    );
  }

  const isPlayingHere = audio?.current?.id === radio.id && audio?.isPlaying;
  const stationLink = `${arPrefix}/station/${radio.id}`;

  // Titre + meta dynamiques selon ce qui passe
  const title = np
    ? isAr
      ? `${np.artist || ''} — ${np.title || ''} على ${radio.name} الآن`
      : `${np.artist || ''} — ${np.title || ''} sur ${radio.name} en ce moment`
    : isAr
      ? `ما هي الأغنية على ${radio.name} الآن؟`
      : `Quelle chanson passe sur ${radio.name} en ce moment ?`;

  const description = np
    ? isAr
      ? `استمع إلى ${np.artist} — ${np.title} مباشرة على ${radio.name}. مع آخر الأغاني المُذاعة وروابط الاستماع.`
      : `Écoutez en direct ${np.artist} — ${np.title} sur ${radio.name}. Programme actuel, dix dernières chansons et écoute en streaming gratuit.`
    : isAr
      ? `اكتشف الأغنية الحالية على ${radio.name}، أحدث 10 أغانٍ مُذاعة، ورابط الاستماع المباشر.`
      : `Découvrez la chanson actuellement diffusée sur ${radio.name}, l'historique des 10 derniers titres et le lien d'écoute en direct.`;

  const canonical = `${SITE_URL}${arPrefix}/now/${radio.id}`;
  const frHref = `${SITE_URL}/now/${radio.id}`;
  const arHref = `${SITE_URL}/ar/now/${radio.id}`;

  // MusicRecording schema dynamique — additionnel au RadioBroadcastService
  // déjà présent sur la page station classique. Ne s'affiche que quand on
  // a une chanson identifiée.
  const musicRecordingJsonLd = np?.artist && np?.title
    ? {
        '@context': 'https://schema.org',
        '@type': 'MusicRecording',
        name: np.title,
        byArtist: { '@type': 'MusicGroup', name: np.artist },
        ...(np.artwork ? { image: np.artwork } : {}),
        isPartOf: {
          '@type': 'RadioBroadcastService',
          name: radio.name,
          url: `${SITE_URL}${arPrefix}/station/${radio.id}`,
        },
      }
    : null;

  const breadcrumb = breadcrumbJsonLd([
    { name: isAr ? 'الرئيسية' : 'Accueil', url: arPrefix || '/' },
    { name: radio.name, url: stationLink },
    { name: isAr ? 'الأغنية الحالية' : 'En cours' },
  ]);

  return (
    <article className="pt-6 sm:pt-10 pb-12 max-w-4xl mx-auto">
      <Seo
        lang={lang}
        title={title}
        description={description}
        canonical={canonical}
        alternates={[
          { hreflang: 'fr-MA', href: frHref },
          { hreflang: 'ar-MA', href: arHref },
          { hreflang: 'x-default', href: frHref },
        ]}
        jsonLd={[breadcrumb, musicRecordingJsonLd].filter(Boolean)}
      />

      <Link
        to={stationLink}
        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {isAr ? `العودة إلى ${radio.name}` : `Retour à ${radio.name}`}
      </Link>

      {/* Hero : artwork XL + artiste/titre */}
      <header className="relative glass rounded-3xl p-6 sm:p-10 overflow-hidden">
        <div
          aria-hidden
          className="absolute -inset-1 rounded-3xl opacity-25 blur-2xl pointer-events-none -z-10"
          style={{
            background: `linear-gradient(135deg, ${radio.gradientFrom}, ${radio.gradientTo})`,
          }}
        />
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          {/* Artwork — iTunes si dispo, sinon icon de la radio */}
          <div className="shrink-0">
            {np?.artwork ? (
              <img
                src={np.artwork}
                alt={np.title ? `${np.artist} — ${np.title}` : radio.name}
                loading="eager"
                decoding="async"
                width={240}
                height={240}
                className="w-40 h-40 sm:w-60 sm:h-60 rounded-3xl object-cover shadow-card"
              />
            ) : (
              <div className="w-40 h-40 sm:w-60 sm:h-60">
                <RadioIcon radio={radio} size="xl" playing={isPlayingHere} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[11px] sm:text-[10px] uppercase tracking-wider text-white/55 mb-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                {isAr ? 'مباشر الآن' : 'En direct maintenant'}
              </span>
              <span>·</span>
              <Link to={stationLink} className="hover:text-white transition-colors">
                {radio.name}
              </Link>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-balance mb-4">
              {title}
            </h1>

            {np?.artist && np?.title ? (
              <p className="text-white/75 leading-relaxed mb-5">
                <Music2 className="inline h-4 w-4 text-[#FF6B7A] mr-1 rtl:ml-1 rtl:mr-0" />
                {isAr
                  ? `أغنية ${np.title} للفنان ${np.artist}، تُبث الآن على إذاعة ${radio.name}.`
                  : `Le morceau ${np.title} de ${np.artist} est actuellement diffusé sur ${radio.name}.`}
                {np.source === 'static' && (
                  <span className="text-[11px] sm:text-[10px] text-white/40 ml-2">
                    {isAr ? '(قد يتأخر بضع دقائق)' : '(peut être en léger différé)'}
                  </span>
                )}
              </p>
            ) : (
              <p className="text-white/65 leading-relaxed mb-5 inline-flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-white/40" />
                {isAr
                  ? `جارٍ التحقق من الأغنية الحالية على ${radio.name}...`
                  : `Vérification de la chanson en cours sur ${radio.name}…`}
              </p>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => playRadio(radio)}
                aria-label={isAr ? `استمع إلى ${radio.name}` : `Écouter ${radio.name}`}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full font-semibold text-white shadow-card"
                style={{
                  background: `linear-gradient(120deg, ${radio.gradientFrom}, ${radio.gradientTo})`,
                  boxShadow: `0 12px 30px -12px ${radio.gradientFrom}99`,
                }}
              >
                {isPlayingHere ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlayingHere
                  ? isAr ? 'إيقاف مؤقت' : 'En pause'
                  : isAr ? 'استمع مباشرة' : 'Écouter en direct'}
              </button>
              <Link
                to={stationLink}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass text-sm font-semibold text-white/85 hover:bg-white/10 transition"
              >
                {isAr ? 'صفحة المحطة' : 'Page station'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Historique 10 dernières chansons */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold mb-5">
          {isAr ? 'آخر 10 أغاني مُذاعة' : 'Les 10 dernières chansons diffusées'}
        </h2>
        {Array.isArray(history?.tracks) && history.tracks.length > 0 ? (
          <ol className="space-y-2">
            {history.tracks.slice(0, 10).map((tr, i) => (
              <li
                key={`${tr.artist}-${tr.title}-${i}`}
                className="flex items-center gap-3 glass rounded-2xl px-4 py-3"
              >
                <span className="font-display font-bold text-white/40 text-lg w-7 text-center shrink-0 tabular-nums">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white truncate">
                    {tr.artist || (isAr ? 'فنان غير معروف' : 'Artiste inconnu')}
                  </p>
                  <p className="text-xs text-white/55 truncate">
                    {tr.title || (isAr ? 'عنوان غير معروف' : 'Titre inconnu')}
                  </p>
                </div>
                {tr.startedAt && (
                  <time
                    dateTime={tr.startedAt}
                    className="text-[11px] sm:text-[10px] text-white/40 tabular-nums shrink-0"
                  >
                    {new Date(tr.startedAt).toLocaleTimeString(isAr ? 'ar-MA' : 'fr-FR', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </time>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-white/55 italic">
            {isAr
              ? 'لا تتوفر سجلات أغانٍ لهذه المحطة بعد. يتم جمع البيانات تلقائياً.'
              : "L'historique n'est pas encore disponible pour cette station. Les données sont collectées automatiquement."}
          </p>
        )}
      </section>

      {/* Maillage interne */}
      <section className="mt-12">
        <h2 className="font-display text-lg font-semibold text-white mb-3">
          {isAr ? 'استمع أيضاً' : 'Écouter aussi'}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`${arPrefix}/top-chansons-maroc`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-white/85 hover:bg-white/10 transition"
          >
            {isAr ? 'أفضل 50 أغنية مغربية' : 'Top 50 chansons Maroc'}
          </Link>
          <Link
            to={`${arPrefix}/top-radio-maroc`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-white/85 hover:bg-white/10 transition"
          >
            {isAr ? 'أفضل 10 إذاعات' : 'Top 10 radios'}
          </Link>
          <Link
            to={`${arPrefix}/`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-white/85 hover:bg-white/10 transition"
          >
            {isAr ? 'كل الإذاعات' : 'Toutes les radios'}
          </Link>
        </div>
      </section>
    </article>
  );
}
