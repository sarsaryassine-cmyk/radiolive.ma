import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Home, ChevronDown, Music, Trophy, Globe, MapPin, BookOpen, Briefcase, Sparkles, Radio as RadioIco } from 'lucide-react';
import RadioIcon from './RadioIcon.jsx';
import RadioMarocLogo from './RadioMarocLogo.jsx';
import { CATEGORY_ORDER, categoryLabel } from '../utils/categories.js';
import useI18n from '../i18n/useI18n.js';
import { stationDisplayName } from '../data/stationNamesAr.js';

const CATEGORY_ICONS = {
  musicale:       Music,
  sport:          Trophy,
  nationale:      RadioIco,
  regionale:      MapPin,
  internationale: Globe,
  religieuse:     BookOpen,
  culturelle:     Sparkles,
  business:       Briefcase,
  autre:          RadioIco,
};

/**
 * Top-left navigation menu.
 *
 *   - A small fixed hamburger button (top-3 left-3, z-40) opens the drawer.
 *   - The drawer is a full-height left panel (300 px) with the categories
 *     and their stations, expandable / collapsible per group.
 *   - Auto-closes when the route changes.
 *   - Doesn't push the existing layout — it's an overlay.
 *
 * Mobile and desktop share the exact same UI.
 */
export default function SideMenu({ radios = [] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState({}); // category key → bool
  const location = useLocation();
  const { t, lang } = useI18n();
  const arPrefix = lang === 'ar' ? '/ar' : '';

  // Auto-close when navigation happens
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Group radios by category
  const grouped = useMemo(() => {
    const map = {};
    for (const r of radios) {
      const cat = r.category || 'autre';
      (map[cat] ||= []).push(r);
    }
    // Tri intra-catégorie par popularité (Hit Radio en haut), alpha en fallback
    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => {
        const r = (a.popularity_rank ?? 999) - (b.popularity_rank ?? 999);
        if (r !== 0) return r;
        return a.name.localeCompare(b.name, 'fr');
      })
    );
    return map;
  }, [radios]);

  const orderedCategories = CATEGORY_ORDER.filter((c) => grouped[c]?.length);

  const toggleCat = (cat) =>
    setExpanded((s) => ({ ...s, [cat]: !s[cat] }));

  return (
    <>
      {/* Hamburger button — top-left, fixed */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('sidemenu.open')}
        aria-expanded={open}
        className="fixed top-3 left-3 z-40 inline-flex items-center justify-center h-10 w-10 rounded-full glass-strong shadow-card hover:scale-105 transition-transform"
      >
        <Menu className="h-5 w-5 text-white/85" />
      </button>

      {/* Drawer + backdrop */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="fixed top-0 left-0 z-50 h-[100dvh] w-[88vw] max-w-[320px] flex flex-col glass-strong border-r border-white/10"
              role="dialog"
              aria-label={t('sidemenu.drawer_label')}
            >
              <header className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                <Link to={arPrefix || '/'} className="flex items-center gap-2 min-w-0">
                  <RadioMarocLogo size={48} className="shrink-0" />
                  <span className="font-display font-bold text-sm">
                    {t('site_name').split(' ')[0]}{' '}
                    <span className="gradient-text">
                      {t('site_name').split(' ').slice(1).join(' ') || 'Maroc'}
                    </span>
                  </span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="icon-btn !h-11 !w-11 sm:!h-9 sm:!w-9"
                  aria-label={t('sidemenu.close')}
                >
                  <X className="h-4 w-4" />
                </button>
              </header>

              <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-3 scrollbar-none">
                <NavLink
                  to={arPrefix || '/'}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-white text-ink-950 font-semibold'
                        : 'text-white/85 hover:bg-white/8'
                    }`
                  }
                >
                  <Home className="h-4 w-4" />
                  <span className="text-sm">{t('nav.home')}</span>
                </NavLink>

                {/* SEO pillars — pages cluster grand volume */}
                <div className="mt-3 pt-3 border-t border-white/8 grid grid-cols-2 gap-1">
                  {lang === 'ar' ? (
                    <>
                      <SeoLink to="/ar/radio-maroc-mubashir">مباشر</SeoLink>
                      <SeoLink to="/ar/radio-riyada-maghreb">رياضة</SeoLink>
                      <SeoLink to="/ar/radio-al-idha3a-al-wataniya">الإذاعة الوطنية</SeoLink>
                    </>
                  ) : (
                    <>
                      <SeoLink to="/radio-maroc">Radio au Maroc</SeoLink>
                      <SeoLink to="/radio-maroc-en-direct">En direct</SeoLink>
                      <SeoLink to="/radio-sport-maroc">Sport</SeoLink>
                      <SeoLink to="/radio-nationale-marocaine">Radio Nationale</SeoLink>
                    </>
                  )}
                </div>

                {/* SEO landing-page shortcuts */}
                <div className="mt-2 pt-2 border-t border-white/8 grid grid-cols-2 gap-1">
                  <SeoLink to={`${arPrefix}/info`}>{lang === 'ar' ? 'الأخبار' : 'Actualités'}</SeoLink>
                  <SeoLink to={`${arPrefix}/top-radio-maroc`}>{t('nav.top')}</SeoLink>
                  <SeoLink to={`${arPrefix}/frequences-radio-maroc`}>{t('nav.frequencies')}</SeoLink>
                  <SeoLink to={`${arPrefix}/blog`}>{t('nav.blog')}</SeoLink>
                  <SeoLink to={lang === 'ar' ? '/ar/baramij' : '/emissions'}>
                    {lang === 'ar' ? 'البرامج' : 'Émissions'}
                  </SeoLink>
                  <SeoLink to={`${arPrefix}/radio-casablanca`}>Casablanca</SeoLink>
                  <SeoLink to={`${arPrefix}/radio-rabat`}>Rabat</SeoLink>
                  <SeoLink to={`${arPrefix}/radio-marrakech`}>Marrakech</SeoLink>
                  <SeoLink to={`${arPrefix}/radio-tanger`}>Tanger</SeoLink>
                  <SeoLink to={`${arPrefix}/radio-fes`}>Fès</SeoLink>
                  <SeoLink to={`${arPrefix}/radio-agadir`}>Agadir</SeoLink>
                  <SeoLink to={`${arPrefix}/radio-maroc-hit`}>Hits</SeoLink>
                  <SeoLink to={`${arPrefix}/radio-maroc-chaabi`}>Chaabi</SeoLink>
                  <SeoLink to={`${arPrefix}/radio-maroc-amazigh`}>Amazigh</SeoLink>
                </div>

                <div className="mt-4 space-y-1">
                  {orderedCategories.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat] || RadioIco;
                    const list = grouped[cat] || [];
                    const isOpen = !!expanded[cat];
                    return (
                      <div key={cat}>
                        <button
                          onClick={() => toggleCat(cat)}
                          className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-white/80 hover:bg-white/6 transition-colors"
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <Icon className="h-4 w-4 text-brand-300 shrink-0" />
                            <span className="text-[13px] font-medium uppercase tracking-wider truncate">
                              {categoryLabel(cat, lang)}
                            </span>
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="text-[11px] sm:text-[10px] text-white/40">{list.length}</span>
                            <ChevronDown
                              className={`h-4 w-4 text-white/50 transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.18 }}
                              className="overflow-hidden ml-2 pl-3 border-l border-white/8"
                            >
                              {list.map((r) => (
                                <li key={r.id}>
                                  <NavLink
                                    to={`${arPrefix}/station/${r.id}`}
                                    className={({ isActive }) =>
                                      `flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${
                                        isActive
                                          ? 'bg-white/12 text-white'
                                          : 'text-white/65 hover:text-white hover:bg-white/6'
                                      }`
                                    }
                                  >
                                    <span className="shrink-0">
                                      <RadioIcon radio={r} size="sm" />
                                    </span>
                                    <span className="text-[12.5px] truncate">{stationDisplayName(r, lang)}</span>
                                  </NavLink>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </nav>

              <footer className="px-4 py-3 border-t border-white/8 text-[11px] sm:text-[10px] text-white/40">
                {t('sidemenu.footer_count', { n: radios.length })}
              </footer>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SeoLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-[12px] px-2 py-1.5 rounded-lg transition-colors text-center ${
          isActive ? 'bg-white/12 text-white' : 'text-white/60 hover:text-white hover:bg-white/6'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

