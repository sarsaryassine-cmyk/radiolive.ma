import { motion } from 'framer-motion';
import { Moon, Sun, Heart, Sparkles, Languages } from 'lucide-react';
import useI18n from '../i18n/useI18n.js';
import RadioMarocLogo from './RadioMarocLogo.jsx';

export default function Header({
  theme,
  onToggleTheme,
  view,
  onViewChange,
  favoritesCount,
}) {
  const { t, switchLang } = useI18n();
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-30 px-4 sm:px-6 py-4"
    >
      <div className="mx-auto max-w-7xl glass-strong rounded-2xl pl-14 sm:pl-5 pr-3 sm:pr-5 py-3 flex items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo : 48 px sur mobile pour éviter overflow, 72 px à partir de sm */}
          <span className="hidden sm:block shrink-0">
            <RadioMarocLogo size={72} />
          </span>
          <span className="sm:hidden shrink-0">
            <RadioMarocLogo size={48} />
          </span>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-base sm:text-lg leading-tight">
              {t('site_name').split(' ')[0]}{' '}
              <span className="gradient-text">{t('site_name').split(' ').slice(1).join(' ') || 'Maroc'}</span>
            </h1>
            <p className="text-[11px] text-white/50 -mt-0.5 hidden sm:block">
              {t('header.brand_streaming')}
            </p>
          </div>
        </div>

        {/* Égaliseur décoratif animé — visible sur écrans larges, collé à droite du bloc Radio Maroc */}
        <div
          aria-hidden
          className="hidden lg:flex items-end gap-0.5 h-6 ml-3"
        >
          <span className="eq-bar" />
          <span className="eq-bar" />
          <span className="eq-bar" />
          <span className="eq-bar" />
          <span className="eq-bar" />
        </div>

        <nav className="ml-auto hidden sm:flex items-center gap-1 p-1 rounded-full glass">
          <NavBtn
            active={view === 'all'}
            onClick={() => onViewChange('all')}
            icon={<Sparkles className="h-3.5 w-3.5" />}
          >
            {t('nav.all_stations')}
          </NavBtn>
          <NavBtn
            active={view === 'favorites'}
            onClick={() => onViewChange('favorites')}
            icon={<Heart className="h-3.5 w-3.5" />}
            badge={favoritesCount}
          >
            {t('nav.favorites')}
          </NavBtn>
        </nav>

        <button
          onClick={switchLang}
          aria-label={t('switch_lang')}
          title={t('switch_lang')}
          className="inline-flex items-center gap-1.5 px-3 h-10 rounded-full glass text-[11px] font-semibold text-white/85 hover:bg-white/10 transition-colors"
        >
          <Languages className="h-3.5 w-3.5" />
          {t('switch_lang')}
        </button>

        <button
          onClick={onToggleTheme}
          aria-label={t('header.toggle_theme')}
          className="icon-btn"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="mx-auto max-w-7xl mt-3 sm:hidden flex items-center gap-1 p-1 rounded-full glass-strong">
        <NavBtn
          fluid
          active={view === 'all'}
          onClick={() => onViewChange('all')}
          icon={<Sparkles className="h-3.5 w-3.5" />}
        >
          {t('nav.all_stations')}
        </NavBtn>
        <NavBtn
          fluid
          active={view === 'favorites'}
          onClick={() => onViewChange('favorites')}
          icon={<Heart className="h-3.5 w-3.5" />}
          badge={favoritesCount}
        >
          {t('nav.favorites')}
        </NavBtn>
      </nav>
    </motion.header>
  );
}

function NavBtn({ children, active, onClick, icon, badge, fluid }) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
        fluid ? 'flex-1 justify-center' : ''
      } ${
        active
          ? 'bg-white text-ink-950 shadow-soft'
          : 'text-white/70 hover:text-white'
      }`}
    >
      {icon}
      {children}
      {badge ? (
        <span
          className={`ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[11px] sm:text-[10px] font-bold ${
            active ? 'bg-ink-900 text-white' : 'bg-white/15 text-white'
          }`}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}
