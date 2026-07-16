import { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

import Header from './components/Header.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import SceneBackground from './components/SceneBackground.jsx';
import SideMenu from './components/SideMenu.jsx';
import AdBanner from './components/AdBanner.jsx';
import RadioMarocLogo from './components/RadioMarocLogo.jsx';

import Home from './pages/Home.jsx';
import StationPage from './pages/StationPage.jsx';
import StationHistoryPage from './pages/StationHistoryPage.jsx';
import StationTopSongsPage from './pages/StationTopSongsPage.jsx';
import StationNowPlayingPage from './pages/StationNowPlayingPage.jsx';
import TopMarocPage from './pages/TopMarocPage.jsx';
import CityPage from './pages/CityPage.jsx';
import GenrePage from './pages/GenrePage.jsx';
import TopPage from './pages/TopPage.jsx';
import BlogIndexPage from './pages/BlogIndexPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
import FrequenciesIndexPage from './pages/FrequenciesIndexPage.jsx';
import FrequencyCityPage from './pages/FrequencyCityPage.jsx';
import { CITY_KEYS as FREQ_CITIES } from './data/frequencies.js';

import useCatalog from './hooks/useCatalog.js';
import useAudioEngine from './hooks/useAudioEngine.js';
import useFavorites from './hooks/useFavorites.js';
import useTheme from './hooks/useTheme.js';
import useLenis from './hooks/useLenis.js';
import useReducedMotion from './hooks/useReducedMotion.js';
import { AppProvider } from './AppContext.jsx';
import useI18n from './i18n/useI18n.js';
import DiasporaPage from './pages/DiasporaPage.jsx';
import SeoLandingPage from './pages/SeoLandingPage.jsx';
import EmissionPage from './pages/EmissionPage.jsx';
import EmissionsIndexPage from './pages/EmissionsIndexPage.jsx';
import LegalPage from './pages/LegalPage.jsx';
import NowPlayingStationPage from './pages/NowPlayingStationPage.jsx';
import InfoPage from './pages/InfoPage.jsx';
import InfoArticlePage from './pages/InfoArticlePage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

function AppShell() {
  const { radios, loading, error, syncStatus, resync } = useCatalog();
  const [view, setView] = useState('all');

  const { theme, toggle: toggleTheme } = useTheme();
  const { favorites, isFavorite, toggle: toggleFavorite } = useFavorites();
  const audio = useAudioEngine();
  const { reduced, isMobile } = useReducedMotion();
  useLenis({ enabled: !reduced && !isMobile });

  const playRadio = useCallback((radio) => audio.play(radio), [audio]);

  const playRelative = useCallback(
    (delta) => {
      if (!audio.current) return;
      const idx = radios.findIndex((r) => r.id === audio.current.id);
      if (idx === -1) return;
      const next = radios[(idx + delta + radios.length) % radios.length];
      audio.play(next);
    },
    [audio, radios]
  );

  const accent = audio.current
    ? [audio.current.gradientFrom, audio.current.gradientTo]
    : ['#7c4dff', '#38bdf8'];

  const ctxValue = {
    radios, loading, error, syncStatus, resync,
    audio, playRadio, playRelative,
    favorites, isFavorite, toggleFavorite,
    theme, toggleTheme,
    view, setView,
  };

  return (
    <AppProvider value={ctxValue}>
      <SceneBackground accent={accent} />

      <SideMenu radios={radios} />

      {/* Logo animé décoratif sur l'espace vide à gauche (≥ 1536px) */}
      <div
        aria-hidden
        className="hidden 2xl:block fixed left-6 top-28 z-20 pointer-events-none"
      >
        <RadioMarocLogo size={220} />
      </div>

      <AdBanner position="right-top"
        slot={import.meta.env.VITE_ADSENSE_SLOT_RIGHT_TOP || ''} />
      <AdBanner position="right-bottom"
        slot={import.meta.env.VITE_ADSENSE_SLOT_RIGHT_BOTTOM || ''} />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          view={view}
          onViewChange={setView}
          favoritesCount={favorites.length}
        />

        <main className="flex-1 px-4 sm:px-6 pb-24 sm:pb-40">
          <div className="mx-auto max-w-7xl">
            <Routes>
              {/* French (default) routes */}
              <Route path="/" element={<Home />} />
              <Route path="/station/:slug" element={<StationPage />} />
              <Route path="/station/:slug/historique"      element={<StationHistoryPage />} />
              <Route path="/station/:slug/top-chansons"    element={<StationTopSongsPage />} />
              <Route path="/station/:slug/chanson-actuelle" element={<StationNowPlayingPage />} />
              <Route path="/top-chansons-maroc"            element={<TopMarocPage />} />

              {/* Frequencies index + 16 city pages */}
              <Route path="/frequences-radio-maroc" element={<FrequenciesIndexPage />} />
              {FREQ_CITIES.map((key) => (
                <Route key={`fr-${key}`} path={`/frequence-radio-${key}`}
                       element={<FrequencyCityPage cityKey={key} />} />
              ))}

              <Route path="/top-radio-maroc" element={<TopPage />} />
              <Route path="/radio-maroc-chaabi"  element={<GenrePage genreKey="chaabi" />} />
              <Route path="/radio-maroc-hit"     element={<GenrePage genreKey="hit" />} />
              <Route path="/radio-maroc-amazigh" element={<GenrePage genreKey="amazigh" />} />
              <Route path="/radio-casablanca"    element={<CityPage cityKey="casablanca" />} />
              <Route path="/radio-rabat"         element={<CityPage cityKey="rabat" />} />
              <Route path="/radio-marrakech"     element={<CityPage cityKey="marrakech" />} />
              <Route path="/radio-tanger"        element={<CityPage cityKey="tanger" />} />
              <Route path="/radio-fes"           element={<CityPage cityKey="fes" />} />
              <Route path="/radio-agadir"        element={<CityPage cityKey="agadir" />} />
              <Route path="/blog"           element={<BlogIndexPage />} />
              <Route path="/blog/:slug"     element={<BlogPostPage />} />

              {/* Actualité / Info — hub éditorial (FR + AR) */}
              <Route path="/info"            element={<InfoPage />} />
              <Route path="/info/:slug"      element={<InfoArticlePage />} />
              <Route path="/ar/info"         element={<InfoPage />} />
              <Route path="/ar/info/:slug"   element={<InfoArticlePage />} />

              {/* Pages SEO de cluster — pilier, live, sport, national */}
              <Route path="/radio-maroc"                element={<SeoLandingPage landingKey="radio-maroc" />} />
              <Route path="/radio-maroc-en-direct"      element={<SeoLandingPage landingKey="radio-maroc-en-direct" />} />
              <Route path="/radio-sport-maroc"          element={<SeoLandingPage landingKey="radio-sport-maroc" />} />
              <Route path="/radio-nationale-marocaine"  element={<SeoLandingPage landingKey="radio-nationale-marocaine" />} />

              {/* "Currently playing" pages — cible le cluster SEO "quelle chanson passe sur X" */}
              <Route path="/now/:slug" element={<NowPlayingStationPage />} />

              {/* Émissions — pages dédiées aux animateurs et programmes phares */}
              <Route path="/emissions"                          element={<EmissionsIndexPage />} />
              <Route path="/emissions/conseil-psy-mamoun-dribi" element={<EmissionPage emissionKey="conseil-psy-mamoun-dribi" />} />

              {/* Pages légales (RGPD + loi 09-08, AdSense compliance) */}
              <Route path="/politique-confidentialite" element={<LegalPage pageKey="politique-confidentialite" />} />
              <Route path="/conditions-utilisation"    element={<LegalPage pageKey="conditions-utilisation" />} />
              <Route path="/a-propos"                  element={<LegalPage pageKey="a-propos" />} />
              <Route path="/contact"                   element={<LegalPage pageKey="contact" />} />

              {/* Redirects 301 — mots-clés cousins consolidés sur la page principale */}
              <Route path="/radio-maroc-en-ligne" element={<Navigate to="/radio-maroc-en-direct" replace />} />
              <Route path="/ecouter-radio-maroc"  element={<Navigate to="/radio-maroc-en-direct" replace />} />
              <Route path="/radio-mars-maroc"     element={<Navigate to="/station/radio-mars" replace />} />

              {/* Diaspora landing pages — French mirrors */}
              <Route path="/radio-maroc-france"     element={<DiasporaPage countryKey="france" />} />
              <Route path="/radio-maroc-belgique"   element={<DiasporaPage countryKey="belgique" />} />
              <Route path="/radio-maroc-pays-bas"   element={<DiasporaPage countryKey="pays-bas" />} />
              <Route path="/radio-maroc-espagne"    element={<DiasporaPage countryKey="espagne" />} />
              <Route path="/radio-maroc-italie"     element={<DiasporaPage countryKey="italie" />} />
              <Route path="/radio-maroc-allemagne"  element={<DiasporaPage countryKey="allemagne" />} />
              <Route path="/radio-maroc-canada"     element={<DiasporaPage countryKey="canada" />} />
              <Route path="/radio-maroc-amerique"   element={<DiasporaPage countryKey="amerique" />} />
              <Route path="/radio-maroc-mre"        element={<DiasporaPage countryKey="mre" />} />
              <Route path="/radio-maroc-etranger"   element={<DiasporaPage countryKey="etranger" />} />

              {/* Arabic mirror routes — same components, locale switched via <html lang> */}
              <Route path="/ar"                       element={<Home />} />
              <Route path="/ar/station/:slug"         element={<StationPage />} />
              <Route path="/ar/station/:slug/historique"        element={<StationHistoryPage />} />
              <Route path="/ar/station/:slug/top-chansons"      element={<StationTopSongsPage />} />
              <Route path="/ar/station/:slug/chanson-actuelle"  element={<StationNowPlayingPage />} />
              <Route path="/ar/top-chansons-maroc"              element={<TopMarocPage />} />

              {/* Frequencies — Arabic mirror */}
              <Route path="/ar/frequences-radio-maroc" element={<FrequenciesIndexPage />} />
              {FREQ_CITIES.map((key) => (
                <Route key={`ar-fr-${key}`} path={`/ar/frequence-radio-${key}`}
                       element={<FrequencyCityPage cityKey={key} />} />
              ))}

              <Route path="/ar/top-radio-maroc"       element={<TopPage />} />
              <Route path="/ar/radio-maroc-chaabi"    element={<GenrePage genreKey="chaabi" />} />
              <Route path="/ar/radio-maroc-hit"       element={<GenrePage genreKey="hit" />} />
              <Route path="/ar/radio-maroc-amazigh"   element={<GenrePage genreKey="amazigh" />} />
              <Route path="/ar/radio-casablanca"      element={<CityPage cityKey="casablanca" />} />
              <Route path="/ar/radio-rabat"           element={<CityPage cityKey="rabat" />} />
              <Route path="/ar/radio-marrakech"       element={<CityPage cityKey="marrakech" />} />
              <Route path="/ar/radio-tanger"          element={<CityPage cityKey="tanger" />} />
              <Route path="/ar/radio-fes"             element={<CityPage cityKey="fes" />} />
              <Route path="/ar/radio-agadir"          element={<CityPage cityKey="agadir" />} />
              <Route path="/ar/blog"                  element={<BlogIndexPage />} />
              <Route path="/ar/blog/:slug"            element={<BlogPostPage />} />

              {/* "Currently playing" pages — miroir AR */}
              <Route path="/ar/now/:slug" element={<NowPlayingStationPage />} />

              {/* Émissions — miroir AR */}
              <Route path="/ar/baramij"                                element={<EmissionsIndexPage />} />
              <Route path="/ar/baramij/istichara-nafsiya-mamoun-dribi" element={<EmissionPage emissionKey="conseil-psy-mamoun-dribi" />} />

              {/* Pages légales — miroir AR */}
              <Route path="/ar/siyasa-khusousia"  element={<LegalPage pageKey="politique-confidentialite" />} />
              <Route path="/ar/shoroot-isti3mal"  element={<LegalPage pageKey="conditions-utilisation" />} />
              <Route path="/ar/3an"               element={<LegalPage pageKey="a-propos" />} />
              <Route path="/ar/ittisal"           element={<LegalPage pageKey="contact" />} />

              {/* Pages SEO arabes — live, sport, Idha3a Wataniya */}
              <Route path="/ar/radio-maroc-mubashir"        element={<SeoLandingPage landingKey="radio-maroc-mubashir" />} />
              <Route path="/ar/radio-riyada-maghreb"        element={<SeoLandingPage landingKey="radio-riyada-maghreb" />} />
              <Route path="/ar/radio-al-idha3a-al-wataniya" element={<SeoLandingPage landingKey="radio-al-idha3a-al-wataniya" />} />

              {/* Diaspora landing pages — Arabic primary URLs */}
              <Route path="/ar/min-faransa"  element={<DiasporaPage countryKey="france" />} />
              <Route path="/ar/min-belgika"  element={<DiasporaPage countryKey="belgique" />} />
              <Route path="/ar/min-holanda"  element={<DiasporaPage countryKey="pays-bas" />} />
              <Route path="/ar/min-isbania"  element={<DiasporaPage countryKey="espagne" />} />
              <Route path="/ar/min-italia"   element={<DiasporaPage countryKey="italie" />} />
              <Route path="/ar/min-almania"  element={<DiasporaPage countryKey="allemagne" />} />
              <Route path="/ar/min-kanada"   element={<DiasporaPage countryKey="canada" />} />
              <Route path="/ar/min-amrika"   element={<DiasporaPage countryKey="amerique" />} />
              <Route path="/ar/lil-jaliya"   element={<DiasporaPage countryKey="mre" />} />
              <Route path="/ar/min-al-kharij" element={<DiasporaPage countryKey="etranger" />} />

              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>

      <AudioPlayer
        current={audio.current}
        isPlaying={audio.isPlaying}
        isLoading={audio.isLoading}
        volume={audio.volume}
        muted={audio.muted}
        error={audio.error}
        isFavorite={audio.current ? isFavorite(audio.current.id) : false}
        onTogglePlay={audio.togglePlay}
        onStop={audio.stop}
        onPrev={() => playRelative(-1)}
        onNext={() => playRelative(1)}
        onToggleFavorite={toggleFavorite}
        onVolume={audio.setVolume}
        onToggleMute={audio.toggleMute}
      />

      <SyncToast status={syncStatus} hasPlayer={!!audio.current} />
    </AppProvider>
  );
}

/** Bottom-left toast — only renders when something noteworthy happens. */
function SyncToast({ status, hasPlayer }) {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState(null);
  const { t } = useI18n();

  useEffect(() => {
    if (status.state === 'ok' && (status.added > 0 || status.updated > 0)) {
      setContent({
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
        title: t('toast.catalog_updated'),
        body: t('toast.added_updated', { added: status.added, updated: status.updated }),
      });
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
    if (status.state === 'error') {
      setContent({
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        title: t('toast.sync_failed'),
        body: t('toast.sync_fallback'),
      });
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [status, t]);

  return (
    <AnimatePresence>
      {visible && content && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          className={`fixed left-3 sm:left-6 z-40 ${
            hasPlayer ? 'bottom-24 sm:bottom-28' : 'bottom-4 sm:bottom-6'
          }`}
        >
          <div className="glass-strong rounded-2xl px-4 py-3 shadow-card flex items-center gap-3 max-w-xs">
            {content.icon}
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">{content.title}</p>
              <p className="text-[11px] text-white/60 leading-tight mt-0.5">
                {content.body}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Footer() {
  const { t, lang } = useI18n();
  const isAr = lang === 'ar';
  const home = isAr ? '/ar' : '/';

  // Colonnes de maillage interne : draine le jus vers la home + les pages
  // piliers + villes + genres + hubs, sur CHAQUE page (footer site-wide).
  const cols = isAr
    ? [
        { title: 'استكشف', links: [
          { to: '/ar', label: 'الرئيسية' },
          { to: '/ar/radio-maroc-mubashir', label: 'راديو المغرب مباشر' },
          { to: '/ar/radio-riyada-maghreb', label: 'راديو الرياضة' },
          { to: '/ar/radio-al-idha3a-al-wataniya', label: 'الإذاعة الوطنية' },
          { to: '/ar/top-radio-maroc', label: 'أفضل الإذاعات' },
        ] },
        { title: 'مدن', links: [
          { to: '/ar/radio-casablanca', label: 'الدار البيضاء' },
          { to: '/ar/radio-rabat', label: 'الرباط' },
          { to: '/ar/radio-marrakech', label: 'مراكش' },
          { to: '/ar/radio-tanger', label: 'طنجة' },
          { to: '/ar/radio-fes', label: 'فاس' },
          { to: '/ar/radio-agadir', label: 'أكادير' },
        ] },
        { title: 'أنواع والمزيد', links: [
          { to: '/ar/radio-maroc-chaabi', label: 'شعبي' },
          { to: '/ar/radio-maroc-hit', label: 'هيت' },
          { to: '/ar/radio-maroc-amazigh', label: 'أمازيغي' },
          { to: '/ar/frequences-radio-maroc', label: 'الترددات FM' },
          { to: '/ar/info', label: 'الأخبار' },
          { to: '/ar/blog', label: 'المدونة' },
          { to: '/ar/baramij', label: 'البرامج' },
        ] },
        { title: 'معلومات', links: [
          { to: '/ar/3an', label: 'حول الموقع' },
          { to: '/ar/ittisal', label: 'اتصل بنا' },
          { to: '/ar/siyasa-khusousia', label: 'سياسة الخصوصية' },
          { to: '/ar/shoroot-isti3mal', label: 'شروط الاستخدام' },
        ] },
      ]
    : [
        { title: 'Explorer', links: [
          { to: '/', label: 'Accueil' },
          { to: '/radio-maroc', label: 'Radio au Maroc' },
          { to: '/radio-maroc-en-direct', label: 'Radio Maroc en direct' },
          { to: '/radio-sport-maroc', label: 'Radio sport' },
          { to: '/radio-nationale-marocaine', label: 'Radio Nationale' },
          { to: '/top-radio-maroc', label: 'Top radios' },
        ] },
        { title: 'Villes', links: [
          { to: '/radio-casablanca', label: 'Casablanca' },
          { to: '/radio-rabat', label: 'Rabat' },
          { to: '/radio-marrakech', label: 'Marrakech' },
          { to: '/radio-tanger', label: 'Tanger' },
          { to: '/radio-fes', label: 'Fès' },
          { to: '/radio-agadir', label: 'Agadir' },
        ] },
        { title: 'Genres & plus', links: [
          { to: '/radio-maroc-chaabi', label: 'Chaabi' },
          { to: '/radio-maroc-hit', label: 'Hits' },
          { to: '/radio-maroc-amazigh', label: 'Amazigh' },
          { to: '/frequences-radio-maroc', label: 'Fréquences FM' },
          { to: '/info', label: 'Actualités' },
          { to: '/blog', label: 'Blog' },
          { to: '/emissions', label: 'Émissions' },
        ] },
        { title: 'Infos', links: [
          { to: '/a-propos', label: 'À propos' },
          { to: '/contact', label: 'Contact' },
          { to: '/politique-confidentialite', label: 'Confidentialité' },
          { to: '/conditions-utilisation', label: "Conditions d'utilisation" },
        ] },
      ];

  return (
    <footer className="mt-20 px-4 sm:px-6 pb-28 border-t border-white/8">
      <div className="mx-auto max-w-7xl pt-10">
        <div className="flex items-center gap-3 mb-8">
          <Link to={home} aria-label={isAr ? 'الرئيسية — إذاعات المغرب' : 'Accueil — Radio Maroc'} className="shrink-0">
            <RadioMarocLogo size={44} />
          </Link>
          <div className="leading-tight">
            <Link to={home} className="font-display font-bold text-white hover:text-[#FF6B7A] transition-colors">
              {isAr ? 'إذاعات المغرب' : 'Radio Maroc'}
            </Link>
            <p className="text-[11px] text-white/45">
              {isAr ? 'كل الإذاعات المغربية مباشرة' : 'Toutes les radios marocaines en direct'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 mb-8">
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-[12.5px] text-white/55 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/40 text-center border-t border-white/5 pt-6">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
