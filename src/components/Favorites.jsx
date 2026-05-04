import { motion } from 'framer-motion';
import { Heart, HeartCrack } from 'lucide-react';
import useI18n from '../i18n/useI18n.js';

export function FavoriteButton({ active, onClick, size = 'sm' }) {
  const { t } = useI18n();
  const dims = size === 'lg' ? 'h-11 w-11' : size === 'md' ? 'h-10 w-10' : 'h-9 w-9';
  const iconDim = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      aria-label={active ? t('card.remove_favorite') : t('card.add_favorite')}
      className={`icon-btn ${dims} ${
        active ? '!bg-rose-500/15 !border-rose-400/40' : ''
      }`}
    >
      <Heart
        className={`${iconDim} transition-all ${
          active ? 'text-rose-400 fill-rose-400' : 'text-white/70'
        }`}
      />
    </motion.button>
  );
}

export function EmptyFavorites({ onBrowse }) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-16 text-center max-w-md mx-auto"
    >
      <div className="mx-auto h-16 w-16 rounded-2xl glass flex items-center justify-center mb-5">
        <HeartCrack className="h-7 w-7 text-rose-300" />
      </div>
      <h3 className="font-display text-xl font-semibold mb-2">
        {t('favorites.empty_title')}
      </h3>
      <p className="text-sm text-white/60 mb-5">
        {t('favorites.empty_body')}
      </p>
      <button onClick={onBrowse} className="btn-primary">
        {t('favorites.browse_button')}
      </button>
    </motion.div>
  );
}

export default { FavoriteButton, EmptyFavorites };
