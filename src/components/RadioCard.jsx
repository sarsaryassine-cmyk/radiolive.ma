import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, Info } from 'lucide-react';
import RadioIcon from './RadioIcon.jsx';
import TiltCard from './TiltCard.jsx';
import BorderBeam from './ui/BorderBeam.jsx';
import useReducedMotion from '../hooks/useReducedMotion.js';
import useI18n from '../i18n/useI18n.js';

function RadioCard({ radio, isActive, isPlaying, isFavorite, onPlay, onToggleFavorite }) {
  const playingHere = isActive && isPlaying;
  const { reduced, isMobile } = useReducedMotion();
  const enableTilt = !reduced && !isMobile;
  const { t, lang } = useI18n();
  const stationHref = lang === 'ar' ? `/ar/station/${radio.id}` : `/station/${radio.id}`;

  const inner = (
    <>
      <div
        className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
        style={{
          background: `linear-gradient(135deg, ${radio.gradientFrom}, ${radio.gradientTo})`,
          opacity: isActive ? 0.55 : undefined,
        }}
      />
      <div
        className={`relative glass rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 flex flex-col gap-2 sm:gap-3 h-full transition-shadow overflow-hidden ${
          isActive ? 'ring-2 ring-brand-400/60 shadow-glow' : ''
        }`}
      >
        {isActive && (
          <BorderBeam
            size={180}
            duration={6}
            colorFrom={radio.gradientFrom}
            colorTo={radio.gradientTo}
          />
        )}
        <div className="flex items-start justify-between gap-1.5 sm:gap-3">
          <Link
            to={stationHref}
            className="rounded-xl sm:rounded-2xl"
            aria-label={t('card.view_station', { name: radio.name })}
          >
            <RadioIcon radio={radio} size="md" playing={playingHere} />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(radio);
            }}
            aria-label={isFavorite ? t('card.remove_favorite') : t('card.add_favorite')}
            className={`icon-btn !h-7 !w-7 sm:!h-9 sm:!w-9 ${
              isFavorite ? '!bg-rose-500/15 !border-rose-400/40' : ''
            }`}
          >
            <Heart
              className={`h-3 w-3 sm:h-4 sm:w-4 transition-all ${
                isFavorite ? 'text-rose-400 fill-rose-400' : 'text-white/70'
              }`}
            />
          </button>
        </div>

        <Link to={stationHref} className="flex-1 min-w-0 group/title">
          <h3 className="font-display font-semibold text-[11px] sm:text-base leading-tight truncate group-hover/title:text-white transition-colors">
            {radio.name}
          </h3>
          <p className="text-[9px] sm:text-xs text-white/50 mt-0.5 sm:mt-1 uppercase tracking-wider inline-flex items-center gap-1">
            {radio.streamType === 'hls' ? t('card.live_hd') : t('card.live_stream')}
            <Info className="hidden sm:inline-block h-3 w-3 opacity-0 group-hover/title:opacity-70 transition-opacity" />
          </p>
        </Link>

        <button
          onClick={() => onPlay(radio)}
          className="relative w-full inline-flex items-center justify-center gap-1 sm:gap-2 rounded-full px-2 py-1.5 sm:px-4 sm:py-2.5 text-[11px] sm:text-sm font-semibold text-white overflow-hidden transition-all hover:brightness-110"
          style={{
            background: `linear-gradient(120deg, ${radio.gradientFrom}, ${radio.gradientTo})`,
            boxShadow: `0 12px 30px -12px ${radio.gradientFrom}99`,
          }}
        >
          {playingHere ? (
            <>
              <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
              {t('card.now_playing')}
            </>
          ) : (
            <>
              <Play className="h-3 w-3 sm:h-4 sm:w-4 ml-0.5" />
              {t('card.listen')}
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      whileHover={{ y: -4 }}
      className="group relative h-full"
    >
      {enableTilt ? (
        <TiltCard max={8} className="h-full">
          {inner}
        </TiltCard>
      ) : (
        inner
      )}
    </motion.article>
  );
}

export default memo(RadioCard);
