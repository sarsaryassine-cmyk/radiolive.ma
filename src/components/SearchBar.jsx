import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import useI18n from '../i18n/useI18n.js';

export default function SearchBar({ value, onChange, count }) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative w-full"
    >
      <div className="glass rounded-full flex items-center pl-5 pr-2 py-2 gap-3 transition-all focus-within:ring-2 focus-within:ring-brand-400/60">
        <Search className="h-5 w-5 text-white/60 flex-shrink-0" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('search.placeholder')}
          className="flex-1 bg-transparent outline-none placeholder:text-white/40 text-sm md:text-base py-1.5"
          aria-label={t('search.label')}
        />
        {value ? (
          <button
            onClick={() => onChange('')}
            aria-label={t('search.clear')}
            className="icon-btn !h-10 !w-10 sm:!h-8 sm:!w-8"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <span className="hidden sm:flex text-xs text-white/40 px-3 py-1.5 rounded-full border border-white/10">
            {t('search.stations_count', { n: count })}
          </span>
        )}
      </div>
    </motion.div>
  );
}
