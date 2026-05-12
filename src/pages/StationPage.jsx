import { useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, Heart, Share2, Loader2, AlertTriangle, Radio as RadioIco, Music2, ExternalLink, TrendingUp } from 'lucide-react';

import RadioIcon from '../components/RadioIcon.jsx';
import Seo, { radioStationJsonLd, radioBroadcastServiceJsonLd, breadcrumbJsonLd } from '../components/Seo.jsx';
import { useAppContext } from '../AppContext.jsx';
import { categoryLabel as resolveCategoryLabel } from '../utils/categories.js';
import { useStationTopSongs, useLiveNowPlaying, youtubeSearchUrl } from '../hooks/useSongs.js';
import useI18n from '../i18n/useI18n.js';
import { POSTS, slugForLang } from '../blog/posts.js';
import { getStationFaqs } from '../data/stationFaqs.js';
import { getEmissionsByStation } from '../data/emissions.js';

/**
 * Dedicated page for a single station: hero with logo, big play button,
 * full description paragraph, technical infos, related stations.
 *
 * Pulls the active radio from the catalog by `:slug` URL param.
 */
export default function StationPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    radios, audio, playRadio,
    favorites, isFavorite, toggleFavorite,
    loading,
  } = useAppContext();
  const { t, lang } = useI18n();
  const isAr = lang === 'ar';
  const homeHref = isAr ? '/ar' : '/';

  // ─── ALL HOOKS FIRST (CRITICAL: hooks must NEVER be conditional) ───
  // React error #310 = "Rendered more hooks than during the previous render."
  // Si on fait `if (!radio) return …` AVANT certains hooks, et que radio
  // passe d'undefined à défini entre deux renders, le nombre de hooks change
  // → crash. Tous les hooks doivent donc être appelés dans le même ordre,
  // que `radio` soit défini ou non. Les useMemo gèrent radio === undefined
  // via optional chaining + fallback.

  const radio = useMemo(() => radios.find((r) => r.id === slug), [radios, slug]);
  const { data: topSongs } = useStationTopSongs(slug);

  // Scroll to top whenever we enter a station page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  const related = useMemo(
    () =>
      radio
        ? radios
            .filter((r) => r.id !== radio.id && r.category === radio.category)
            .slice(0, 6)
        : [],
    [radios, radio]
  );

  // Articles de blog mentionnant cette station (champ relatedStations)
  const linkedArticles = useMemo(
    () => (radio ? POSTS.filter((p) => p.relatedStations?.includes(radio.id)).slice(0, 3) : []),
    [radio?.id]
  );

  // FAQ station-spécifique pour Featured Snippets (Radio Mars, Hit Radio, Medi 1, Chada FM)
  const stationFaqs = useMemo(
    () => (radio ? getStationFaqs(radio.id, lang) : []),
    [radio?.id, lang]
  );

  // Émissions phares de cette station (Conseil psy Mamoun Dribi pour Med Radio, etc.)
  const stationEmissions = useMemo(
    () => (radio ? getEmissionsByStation(radio.id) : []),
    [radio?.id]
  );

  // Live now-playing (Worker → fallback static JSON) pour MusicRecording schema
  const livePlaying = useLiveNowPlaying(radio?.id);
  const musicRecordingJsonLd = useMemo(() => {
    if (!radio) return null;
    if (!livePlaying?.artist && !livePlaying?.title) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'MusicRecording',
      name: livePlaying.title,
      byArtist: { '@type': 'MusicGroup', name: livePlaying.artist },
      ...(livePlaying.artwork ? { image: livePlaying.artwork } : {}),
      isPartOf: {
        '@type': 'RadioBroadcastService',
        name: radio.name,
        url: `https://radiolive.ma${isAr ? '/ar' : ''}/station/${radio.id}`,
      },
    };
  }, [livePlaying, radio, isAr]);

  // ─── EARLY RETURNS AFTER ALL HOOKS ───
  if (loading && !radio) {
    return (
      <div className="py-24 flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand-300" />
        <p className="text-white/60 text-sm">{t('common.loading')}</p>
      </div>
    );
  }

  if (!radio) {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl glass flex items-center justify-center mb-5">
          <AlertTriangle className="h-7 w-7 text-amber-300" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">{t('station.not_found_title')}</h2>
        <p className="text-sm text-white/60 mb-6">
          {t('station.not_found_body', { slug })}
        </p>
        <Link to={homeHref} className="btn-primary inline-flex">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('station.back_to_home')}
        </Link>
      </div>
    );
  }

  // ─── NON-HOOK COMPUTATIONS (radio is guaranteed defined past here) ───
  const playingHere = audio.current?.id === radio.id && audio.isPlaying;
  const loadingHere = audio.current?.id === radio.id && audio.isLoading;
  const fav = isFavorite(radio.id);
  const categoryLabel = resolveCategoryLabel(radio.category, lang) || (isAr ? 'إذاعة' : 'Radio');

  const faqJsonLd = stationFaqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: stationFaqs.map((it) => ({
          '@type': 'Question',
          name: it.q,
          acceptedAnswer: { '@type': 'Answer', text: it.a },
        })),
      }
    : null;

  const onShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: radio.name, url }); } catch (_) {}
    } else {
      try { await navigator.clipboard.writeText(url); } catch (_) {}
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-6 sm:pt-10 pb-12"
    >
      <Seo
        lang={lang}
        title={isAr ? `استمع إلى ${radio.name} مباشرة` : `Écouter ${radio.name} en direct`}
        description={
          radio.description
            ? `${radio.name} — ${radio.description.slice(0, 145)}…`
            : (isAr
                ? `استمع إلى ${radio.name} مباشرة وبجودة عالية، مجاناً وبدون تسجيل. جميع الإذاعات المغربية في منصة واحدة.`
                : `Écoutez ${radio.name} en direct gratuitement, en streaming HD, sans inscription. Toutes les radios marocaines sur Radio Maroc.`)
        }
        canonical={`https://radiolive.ma${isAr ? '/ar' : ''}/station/${radio.id}`}
        alternates={[
          { hreflang: 'fr-MA', href: `https://radiolive.ma/station/${radio.id}` },
          { hreflang: 'ar-MA', href: `https://radiolive.ma/ar/station/${radio.id}` },
          { hreflang: 'x-default', href: `https://radiolive.ma/station/${radio.id}` },
        ]}
        image={radio.icon ? window.location.origin + radio.icon : undefined}
        type="music.radio_station"
        jsonLd={[
          radioStationJsonLd(radio, lang),
          radioBroadcastServiceJsonLd(radio, lang),
          musicRecordingJsonLd,
          breadcrumbJsonLd([
            { name: t('nav.home'), url: homeHref },
            { name: categoryLabel, url: homeHref },
            { name: radio.name },
          ]),
          faqJsonLd,
        ].filter(Boolean)}
      />

      <Link
        to={homeHref}
        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('nav.back')}
      </Link>

      {/* Hero: big logo + name + actions */}
      <header className="relative glass rounded-3xl p-6 sm:p-10 overflow-hidden">
        <div
          className="absolute -inset-px rounded-3xl opacity-30 blur-2xl pointer-events-none -z-10"
          style={{
            background: `linear-gradient(135deg, ${radio.gradientFrom}, ${radio.gradientTo})`,
          }}
        />
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          <div className="shrink-0">
            <RadioIcon radio={radio} size="xl" playing={playingHere} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass text-[11px] sm:text-[10px] uppercase tracking-wider text-white/70">
                <RadioIco className="h-3 w-3" />
                {categoryLabel}
              </span>
              {radio.streamType === 'hls' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[11px] sm:text-[10px] font-semibold text-emerald-300">
                  HLS · HD
                </span>
              )}
              {radio.codec && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full glass text-[11px] sm:text-[10px] text-white/60">
                  {radio.codec.toUpperCase()}{radio.bitrate ? ` · ${radio.bitrate} kbps` : ''}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-balance mb-4">
              {radio.name}
            </h1>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => playRadio(radio)}
                className="relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white overflow-hidden transition-all hover:brightness-110 shadow-glow"
                style={{
                  background: `linear-gradient(120deg, ${radio.gradientFrom}, ${radio.gradientTo})`,
                  boxShadow: `0 16px 40px -12px ${radio.gradientFrom}99`,
                }}
              >
                {loadingHere ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Connexion…</>
                ) : playingHere ? (
                  <><Pause className="h-4 w-4" /> Mettre en pause</>
                ) : (
                  <><Play className="h-4 w-4 ml-0.5" /> Écouter en direct</>
                )}
              </button>

              <button
                onClick={() => toggleFavorite(radio)}
                className={`icon-btn !h-11 !w-11 ${fav ? '!bg-rose-500/15 !border-rose-400/40' : ''}`}
                aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Heart className={`h-5 w-5 ${fav ? 'text-rose-400 fill-rose-400' : 'text-white/80'}`} />
              </button>

              <button
                onClick={onShare}
                className="icon-btn !h-11 !w-11"
                aria-label="Partager"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick links to song pages */}
      <nav className="mt-6 flex flex-wrap gap-2">
        <Link to={`/station/${radio.id}/chanson-actuelle`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-[12px] font-semibold hover:bg-white/10 transition-colors">
          🎵 Chanson actuelle
        </Link>
        <Link to={`/station/${radio.id}/historique`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-[12px] font-semibold hover:bg-white/10 transition-colors">
          📜 Historique du jour
        </Link>
        <Link to={`/station/${radio.id}/top-chansons`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-[12px] font-semibold hover:bg-white/10 transition-colors">
          🔥 Top chansons
        </Link>
      </nav>

      {/* Description */}
      <section className="mt-10 grid lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 glass rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold mb-4">À propos de {radio.name}</h2>
          {radio.description ? (
            <p className="text-white/75 leading-relaxed text-[15px] whitespace-pre-line">
              {radio.description}
            </p>
          ) : (
            <p className="text-white/55 leading-relaxed text-sm italic">
              Aucune description détaillée n'est disponible pour cette station pour le moment.
              Vous pouvez l'écouter en direct ci-dessus.
            </p>
          )}
        </div>

        <aside className="glass rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
          {/* Top chansons section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold text-white/90 inline-flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-300" />
                Top chansons
              </h3>
              {topSongs.length > 0 && (
                <Link
                  to={`/station/${radio.id}/top-chansons`}
                  className="text-[11px] text-brand-300 hover:text-white"
                >
                  Voir tout →
                </Link>
              )}
            </div>

            {topSongs.length > 0 ? (
              <ol className="space-y-2.5">
                {topSongs.slice(0, 5).map((s, i) => (
                  <li
                    key={`${s.artist}-${s.title}`}
                    className="flex items-center gap-3 group"
                  >
                    <span
                      className="font-display font-bold text-lg w-6 text-center shrink-0 tabular-nums"
                      style={{
                        background: `linear-gradient(120deg, ${radio.gradientFrom}, ${radio.gradientTo})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold truncate leading-tight">
                        {s.artist}
                      </p>
                      <p className="text-[11px] text-white/55 truncate">
                        {s.title}
                      </p>
                    </div>
                    <a
                      href={youtubeSearchUrl(s.artist, s.title)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Écouter ${s.artist} ${s.title} sur YouTube`}
                      className="opacity-50 group-hover:opacity-100 hover:text-brand-300 transition-all shrink-0"
                    >
                      <Music2 className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-[12px] text-white/40 italic leading-relaxed">
                Le classement n'est pas encore disponible pour cette station —
                il sera calculé dès que l'historique de diffusion aura été collecté.
              </p>
            )}
          </div>

          {/* Informations techniques — placées en bas */}
          <div className="pt-5 border-t border-white/10">
            <h3 className="font-display text-base font-semibold mb-4 text-white/90 inline-flex items-center gap-2">
              <RadioIco className="h-4 w-4 text-brand-300" />
              Informations
            </h3>
            <dl className="space-y-3 text-sm">
              <Info label="Catégorie" value={categoryLabel} />
              <Info label="Type de flux" value={radio.streamType?.toUpperCase() || 'Stream'} />
              {radio.codec && <Info label="Codec" value={radio.codec.toUpperCase()} />}
              {radio.bitrate ? (
                <Info label="Bitrate" value={`${radio.bitrate} kbps`} />
              ) : null}
              <Info label="Source" value={radio.source === 'manual' ? 'Sélection manuelle' : 'Radio-Browser'} />
            </dl>
          </div>
        </aside>
      </section>

      {/* Related stations */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold mb-5">
            Autres radios <span className="text-white/50">{categoryLabel.toLowerCase()}</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/station/${r.id}`}
                className="group glass rounded-2xl p-3 flex flex-col items-center gap-2 hover:scale-[1.03] transition-transform"
              >
                <RadioIcon radio={r} size="sm" playing={audio.current?.id === r.id && audio.isPlaying} />
                <span className="text-[11px] text-white/75 text-center line-clamp-2 leading-tight">
                  {r.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ station-spécifique — éligibilité Featured Snippet via FAQPage JSON-LD */}
      {stationFaqs.length > 0 && (
        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-xl font-semibold mb-5">
            {isAr ? 'أسئلة شائعة' : 'Foire aux questions'}
          </h2>
          <div className="space-y-3">
            {stationFaqs.map((item, i) => (
              <details
                key={i}
                className="group glass rounded-2xl px-5 py-4 cursor-pointer transition-all hover:bg-white/[0.06]"
              >
                <summary className="font-display font-semibold text-white text-[15px] flex items-center justify-between gap-4 list-none">
                  <span>{item.q}</span>
                  <span className="text-white/40 group-open:rotate-90 transition-transform shrink-0">›</span>
                </summary>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Émissions phares de cette station — page dédiée animateur/programme */}
      {stationEmissions.length > 0 && (
        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-xl font-semibold mb-5">
            {isAr ? 'البرامج الإذاعية' : 'Émissions phares'}
          </h2>
          <div className="space-y-3">
            {stationEmissions.map((emission) => {
              const c = isAr ? emission.ar : emission.fr;
              const path = isAr ? emission.ar_path : emission.fr_path;
              return (
                <Link
                  key={emission.slug}
                  to={path}
                  className="group block glass rounded-2xl px-5 py-4 hover:bg-white/[0.06] transition-all"
                >
                  <p className="text-[11px] sm:text-[10px] uppercase tracking-wider text-[#FF6B7A] mb-1">
                    {isAr ? 'برنامج' : 'Émission'}
                  </p>
                  <p className="font-display font-semibold text-white text-[15px] group-hover:text-[#FF6B7A] transition mb-1">
                    {c.h1}
                  </p>
                  <p className="text-sm text-white/65 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Articles de blog liés à cette station */}
      {linkedArticles.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold mb-5">
            {isAr ? 'مقالات مرتبطة' : 'Articles liés'}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {linkedArticles.map((article) => {
              const articleSlug = slugForLang(article, lang);
              const articleTitle = lang === 'ar' && article.title_ar ? article.title_ar : article.title;
              const articleExcerpt = lang === 'ar' && article.excerpt_ar ? article.excerpt_ar : article.excerpt;
              return (
                <Link
                  key={article.slug}
                  to={`${isAr ? '/ar' : ''}/blog/${articleSlug}`}
                  className="glass rounded-2xl p-4 hover:bg-white/8 transition-colors group"
                >
                  <p className="text-[11px] sm:text-[10px] uppercase tracking-wider text-[#FF6B7A] mb-2">
                    {isAr ? 'مقال' : 'Article'}
                  </p>
                  <p className="font-display font-semibold text-sm leading-tight line-clamp-3 group-hover:text-[#FF6B7A] transition mb-2">
                    {articleTitle}
                  </p>
                  <p className="text-[11px] text-white/55 line-clamp-2 leading-relaxed">
                    {articleExcerpt}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </motion.article>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-3">
      <dt className="text-white/45 text-[12px] uppercase tracking-wider">{label}</dt>
      <dd className="text-white/90 text-right">{value}</dd>
    </div>
  );
}
