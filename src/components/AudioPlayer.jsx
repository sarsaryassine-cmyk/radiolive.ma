import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Volume,
  X,
  SkipBack,
  SkipForward,
  Heart,
  Loader2,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import RadioIcon from './RadioIcon.jsx';
import AudioVisualizer from './AudioVisualizer.jsx';
import BorderBeam from './ui/BorderBeam.jsx';
import { useNowPlaying } from '../hooks/useSongs.js';
import useI18n from '../i18n/useI18n.js';
import { stationDisplayName } from '../data/stationNamesAr.js';

function VolumeIcon({ volume, muted }) {
  if (muted || volume === 0) return <VolumeX className="h-4 w-4" />;
  if (volume < 0.34) return <Volume className="h-4 w-4" />;
  if (volume < 0.67) return <Volume1 className="h-4 w-4" />;
  return <Volume2 className="h-4 w-4" />;
}

export default function AudioPlayer({
  current,
  isPlaying,
  isLoading,
  volume,
  muted,
  error,
  isFavorite,
  onTogglePlay,
  onStop,
  onPrev,
  onNext,
  onToggleFavorite,
  onVolume,
  onToggleMute,
}) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:px-6 sm:pb-6"
        >
          <div className="mx-auto max-w-6xl">
            <div
              className="relative glass-strong neo rounded-2xl sm:rounded-3xl px-3 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-5 overflow-hidden"
              style={{
                boxShadow: current
                  ? `0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px -30px ${current.gradientFrom}55, 0 30px 80px -30px ${current.gradientTo}55`
                  : undefined,
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 opacity-70"
                style={{
                  background: `radial-gradient(80% 120% at 0% 50%, ${current.gradientFrom}22 0%, transparent 60%), radial-gradient(80% 120% at 100% 50%, ${current.gradientTo}22 0%, transparent 60%)`,
                }}
              />
              {isPlaying && !error && (
                <BorderBeam
                  size={300}
                  duration={8}
                  borderWidth={1.5}
                  colorFrom={current.gradientFrom}
                  colorTo={current.gradientTo}
                />
              )}
              <div className="pointer-events-none absolute inset-x-3 sm:inset-x-5 top-1 h-6 sm:h-7 -z-10 opacity-80">
                <AudioVisualizer
                  active={isPlaying && !error}
                  accent={[current.gradientFrom, current.gradientTo]}
                  bars={48}
                />
              </div>
              <NowPlayingInfo
                current={current}
                isPlaying={isPlaying}
                isLoading={isLoading}
                error={error}
              />

              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  className="icon-btn !h-11 !w-11 sm:!h-9 sm:!w-9"
                  onClick={onPrev}
                  aria-label={t('player.previous')}
                >
                  <SkipBack className="h-4 w-4" />
                </button>

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={onTogglePlay}
                  aria-label={isPlaying ? t('player.pause') : t('player.play')}
                  className="relative h-12 w-12 rounded-full flex items-center justify-center font-semibold text-ink-950"
                  style={{
                    background:
                      'linear-gradient(120deg, #fff 0%, #c4b5fd 100%)',
                    boxShadow: '0 12px 30px -10px rgba(124,77,255,0.6)',
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </motion.button>

                <button
                  className="icon-btn !h-11 !w-11 sm:!h-9 sm:!w-9"
                  onClick={onNext}
                  aria-label={t('player.next')}
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>

              <div className="flex sm:hidden">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={onTogglePlay}
                  aria-label={isPlaying ? t('player.pause') : t('player.play')}
                  className="h-11 w-11 rounded-full flex items-center justify-center text-ink-950"
                  style={{ background: 'linear-gradient(120deg, #fff 0%, #c4b5fd 100%)' }}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </motion.button>
              </div>

              <div className="hidden md:flex items-center gap-2 w-44">
                <button
                  onClick={onToggleMute}
                  className="icon-btn !h-11 !w-11 sm:!h-9 sm:!w-9"
                  aria-label={muted ? t('player.unmute') : t('player.mute')}
                >
                  <VolumeIcon volume={volume} muted={muted} />
                </button>
                <input
                  type="range"
                  className="slider"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => onVolume(parseFloat(e.target.value))}
                  aria-label={t('player.volume')}
                  style={{
                    background: `linear-gradient(to right, #fff ${
                      (muted ? 0 : volume) * 100
                    }%, rgba(255,255,255,0.12) ${(muted ? 0 : volume) * 100}%)`,
                  }}
                />
              </div>

              <button
                className={`icon-btn !h-11 !w-11 sm:!h-9 sm:!w-9 ${
                  isFavorite ? '!bg-rose-500/15 !border-rose-400/40' : ''
                }`}
                onClick={() => onToggleFavorite(current)}
                aria-label={t('player.favorite')}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite ? 'text-rose-400 fill-rose-400' : ''
                  }`}
                />
              </button>

              {/* Bouton expand — visible uniquement sur mobile (<sm).
                  Tap → ouvre le full-screen player avec contrôles complets. */}
              <button
                className="icon-btn !h-11 !w-11 sm:hidden"
                onClick={() => setExpanded(true)}
                aria-label={t('player.expand') || 'Agrandir le lecteur'}
              >
                <ChevronUp className="h-5 w-5" />
              </button>

              <button
                className="icon-btn !h-11 !w-11 sm:!h-9 sm:!w-9"
                onClick={onStop}
                aria-label={t('player.close')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Full-screen player mobile (overlay) ─────────────────── */}
          <AnimatePresence>
            {expanded && (
              <FullScreenPlayer
                current={current}
                isPlaying={isPlaying}
                isLoading={isLoading}
                volume={volume}
                muted={muted}
                error={error}
                isFavorite={isFavorite}
                onTogglePlay={onTogglePlay}
                onPrev={onPrev}
                onNext={onNext}
                onToggleFavorite={onToggleFavorite}
                onVolume={onVolume}
                onToggleMute={onToggleMute}
                onClose={() => setExpanded(false)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Lecteur plein écran (mobile) — bottom sheet 100vh × 100vw.
 *  - Artwork XL centré (taille xl du RadioIcon)
 *  - Nom + statut (live / track / paused)
 *  - Contrôles complets : prev, play/pause big, next
 *  - Slider volume + mute
 *  - Favori + ChevronDown pour réduire
 * Caché sur sm+ via `sm:hidden` car le mini-player desktop a déjà tout.
 */
function FullScreenPlayer({
  current, isPlaying, isLoading, volume, muted, error, isFavorite,
  onTogglePlay, onPrev, onNext, onToggleFavorite, onVolume, onToggleMute, onClose,
}) {
  const { t, lang } = useI18n();
  const np = useNowPlaying(current.id);
  const hasTrack = np && (np.artist || np.title);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 240, damping: 30 }}
      className="sm:hidden fixed inset-0 z-[60] flex flex-col bg-ink-950"
      style={{
        backgroundImage: `radial-gradient(circle at 30% 20%, ${current.gradientFrom}33 0%, transparent 60%), radial-gradient(circle at 70% 80%, ${current.gradientTo}33 0%, transparent 60%)`,
      }}
    >
      {/* Top bar : ChevronDown pour fermer */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={onClose}
          aria-label={t('player.collapse') || 'Réduire le lecteur'}
          className="icon-btn !h-11 !w-11"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
        <span className="text-[11px] uppercase tracking-wider text-white/55">
          {t('player.live_label')}
        </span>
        <button
          onClick={() => onToggleFavorite(current)}
          aria-label={t('player.favorite')}
          className={`icon-btn !h-11 !w-11 ${
            isFavorite ? '!bg-rose-500/15 !border-rose-400/40' : ''
          }`}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'text-rose-400 fill-rose-400' : ''}`} />
        </button>
      </div>

      {/* Hero : artwork XL */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
        <div className="relative">
          <div
            className="absolute -inset-8 rounded-[40%] blur-3xl opacity-50 -z-10"
            style={{
              background: `linear-gradient(135deg, ${current.gradientFrom}, ${current.gradientTo})`,
            }}
          />
          <RadioIcon radio={current} size="xl" playing={isPlaying} />
        </div>

        <div className="text-center max-w-full">
          <h2 className="font-display font-bold text-2xl mb-2 truncate">
            {stationDisplayName(current, lang)}
          </h2>
          {error ? (
            <p className="inline-flex items-center gap-1.5 text-sm text-rose-300">
              <AlertTriangle className="h-4 w-4" /> {error}
            </p>
          ) : isLoading ? (
            <p className="inline-flex items-center gap-1.5 text-sm text-white/60">
              <Loader2 className="h-4 w-4 animate-spin" /> {t('player.connecting')}
            </p>
          ) : hasTrack ? (
            <p className="text-sm text-white/75 truncate">
              <Music2 className="inline h-3.5 w-3.5 text-brand-300 mr-1" />
              <span className="font-semibold text-white/90">{np.artist}</span>
              {np.artist && np.title ? <span className="text-white/40"> — </span> : null}
              <span>{np.title}</span>
            </p>
          ) : isPlaying ? (
            <p className="inline-flex items-center gap-2 text-sm text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {t('player.live_label')}
            </p>
          ) : (
            <p className="text-sm text-white/55">{t('player.paused')}</p>
          )}
        </div>
      </div>

      {/* Volume slider */}
      <div className="px-8 mb-6 flex items-center gap-3">
        <button
          onClick={onToggleMute}
          aria-label={muted ? t('player.unmute') : t('player.mute')}
          className="icon-btn !h-11 !w-11"
        >
          <VolumeIcon volume={volume} muted={muted} />
        </button>
        <input
          type="range"
          className="slider flex-1"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => onVolume(parseFloat(e.target.value))}
          aria-label={t('player.volume')}
          style={{
            background: `linear-gradient(to right, #fff ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.12) ${(muted ? 0 : volume) * 100}%)`,
          }}
        />
      </div>

      {/* Contrôles : prev / play / next */}
      <div className="px-8 pb-12 flex items-center justify-center gap-6">
        <button
          onClick={onPrev}
          aria-label={t('player.previous')}
          className="icon-btn !h-14 !w-14"
        >
          <SkipBack className="h-5 w-5" />
        </button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onTogglePlay}
          aria-label={isPlaying ? t('player.pause') : t('player.play')}
          className="h-20 w-20 rounded-full flex items-center justify-center text-ink-950"
          style={{
            background: `linear-gradient(120deg, #fff 0%, ${current.gradientFrom} 100%)`,
            boxShadow: `0 12px 30px -10px ${current.gradientFrom}99`,
          }}
        >
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8 ml-1" />
          )}
        </motion.button>
        <button
          onClick={onNext}
          aria-label={t('player.next')}
          className="icon-btn !h-14 !w-14"
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Track + status block on the left of the player. Shows:
 *   • Radio icon
 *   • Radio name
 *   • Either: "Artist — Title" (link to /chanson-actuelle) when ICY metadata
 *     is available, OR the stream status (Connection / Live / Pause / Error).
 *
 * Auto-refreshes the now-playing info every 30 s through useNowPlaying().
 */
function NowPlayingInfo({ current, isPlaying, isLoading, error }) {
  const np = useNowPlaying(current.id);
  const hasTrack = np && (np.artist || np.title);
  const { t, lang } = useI18n();
  const arPrefix = lang === 'ar' ? '/ar' : '';

  return (
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <RadioIcon radio={current} size="sm" playing={isPlaying} />
      <div className="min-w-0">
        <p className="font-display font-semibold truncate text-sm sm:text-base">
          {stationDisplayName(current, lang)}
        </p>

        {/* Status line: error > loading > now-playing track > live/pause */}
        <div className="flex items-center gap-2 text-[11px] text-white/65">
          {error ? (
            <span className="inline-flex items-center gap-1 text-rose-300">
              <AlertTriangle className="h-3 w-3" /> {error}
            </span>
          ) : isLoading ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> {t('player.connecting')}
            </span>
          ) : hasTrack ? (
            <Link
              to={`${arPrefix}/station/${current.id}/chanson-actuelle`}
              className="inline-flex items-center gap-1.5 min-w-0 hover:text-white transition-colors group"
              title={`${np.artist} — ${np.title}`}
            >
              <Music2 className="h-3 w-3 shrink-0 text-brand-300" />
              <span className="truncate">
                <span className="font-semibold text-white/90">{np.artist}</span>
                {np.artist && np.title ? <span className="text-white/40"> — </span> : null}
                <span className="text-white/75">{np.title}</span>
              </span>
            </Link>
          ) : isPlaying ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {t('player.live_label')} · {current.streamType === 'hls' ? 'HLS' : 'Stream'}
            </span>
          ) : (
            <span>{t('player.paused')}</span>
          )}
        </div>
      </div>
    </div>
  );
}
