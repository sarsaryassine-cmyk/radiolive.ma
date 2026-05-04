import { motion } from 'framer-motion';
import useI18n from '../i18n/useI18n.js';
import RadioMarocLogo from './RadioMarocLogo.jsx';

export default function Loader() {
  const { t } = useI18n();
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950">
      <div className="absolute inset-0 bg-mesh-dark opacity-60" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        <RadioMarocLogo size={280} />

        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-semibold tracking-wide gradient-text">
            {t('site_name')}
          </h1>
        </div>

        <div className="flex items-end gap-1.5 h-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="w-1 bg-gradient-to-t from-[#E60E1F] via-[#FF2A3C] to-[#FF6B7A] rounded-full"
              animate={{ height: ['20%', '100%', '40%', '80%', '30%'] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.12,
                ease: 'easeInOut',
              }}
              style={{ height: '40%' }}
            />
          ))}
        </div>

        <p className="text-sm text-white/50 font-medium tracking-wider">
          {t('loader.tagline')}
        </p>
      </motion.div>
    </div>
  );
}
