import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RadioIcon as RadioBig, Sparkles, RefreshCw } from 'lucide-react';

import SearchBar from '../components/SearchBar.jsx';
import RadioCard from '../components/RadioCard.jsx';
import AdBanner from '../components/AdBanner.jsx';
import SlidingNumber from '../components/ui/SlidingNumber.jsx';
import Seo, { websiteJsonLd, organizationJsonLd } from '../components/Seo.jsx';
import { EmptyFavorites } from '../components/Favorites.jsx';
import { useAppContext } from '../AppContext.jsx';
import useI18n from '../i18n/useI18n.js';
import HomeContentAr from './HomeContentAr.jsx';
import DiasporaBlock from '../components/DiasporaBlock.jsx';
import { POSTS, slugForLang } from '../blog/posts.js';
import { EMISSIONS, EMISSION_KEYS } from '../data/emissions.js';
import { ChevronRight, Mic2 } from 'lucide-react';

/**
 * Home page — exact same layout the user already validated.
 * Pulls all shared state (catalog, audio, favorites, view) from AppContext
 * so audio playback and favorites persist when navigating to a station page.
 */
export default function Home() {
  const {
    radios, syncStatus, resync, error,
    audio, playRadio,
    favorites, isFavorite, toggleFavorite,
    view, setView,
  } = useAppContext();

  const [query, setQuery] = useState('');
  const { t, lang } = useI18n();

  // Autoplay Hit Radio on first user interaction.
  // Browsers block autoplay without user gesture (Chrome/Safari/Firefox policy
  // since 2018), so we listen for the first click/touch/keypress on the page
  // and trigger play() at that exact moment — that counts as a user gesture
  // and bypasses the autoplay block. Only fires once per session and only if
  // the user hasn't manually picked another station first.
  useEffect(() => {
    if (!radios?.length) return;
    if (audio.current) return;
    const hitRadio = radios.find((r) => r.name === 'Hit Radio');
    if (!hitRadio) return;

    let fired = false;
    const triggerPlay = () => {
      if (fired) return;
      fired = true;
      // Re-check audio.current at fire-time — user may have clicked a station
      // card between effect setup and this event.
      if (!audio.current) playRadio(hitRadio);
      cleanup();
    };
    const events = ['pointerdown', 'keydown', 'touchstart'];
    const cleanup = () => {
      events.forEach((e) => document.removeEventListener(e, triggerPlay));
    };
    events.forEach((e) =>
      document.addEventListener(e, triggerPlay, { once: true, passive: true })
    );
    return cleanup;
  }, [radios, audio.current, playRadio]);

  const filtered = useMemo(() => {
    const list =
      view === 'favorites'
        ? radios.filter((r) => favorites.includes(r.id))
        : radios;
    // Tri par popularité (Hit Radio en tête) — fallback de sécurité au cas
    // où la liste viendrait d'un cache stale qui n'aurait pas trié à la
    // source via decorateAll(). Idempotent si déjà trié.
    const sorted = [...list].sort((a, b) => {
      const r = (a.popularity_rank ?? 999) - (b.popularity_rank ?? 999);
      if (r !== 0) return r;
      return a.name.localeCompare(b.name, 'fr');
    });
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((r) => r.name.toLowerCase().includes(q));
  }, [radios, favorites, query, view]);

  return (
    <>
      <Seo
        lang={lang}
        title={t('meta.home_title')}
        description={t('meta.home_description')}
        canonical={lang === 'ar' ? 'https://radiolive.ma/ar' : 'https://radiolive.ma/'}
        alternates={[
          { hreflang: 'fr-MA', href: 'https://radiolive.ma/' },
          { hreflang: 'ar-MA', href: 'https://radiolive.ma/ar' },
          { hreflang: 'ar-FR', href: 'https://radiolive.ma/ar/min-faransa' },
          { hreflang: 'ar-BE', href: 'https://radiolive.ma/ar/min-belgika' },
          { hreflang: 'ar-NL', href: 'https://radiolive.ma/ar/min-holanda' },
          { hreflang: 'ar-ES', href: 'https://radiolive.ma/ar/min-isbania' },
          { hreflang: 'ar-IT', href: 'https://radiolive.ma/ar/min-italia' },
          { hreflang: 'ar-DE', href: 'https://radiolive.ma/ar/min-almania' },
          { hreflang: 'ar-CA', href: 'https://radiolive.ma/ar/min-kanada' },
          { hreflang: 'ar-US', href: 'https://radiolive.ma/ar/min-amrika' },
          { hreflang: 'x-default', href: 'https://radiolive.ma/' },
        ]}
        jsonLd={[websiteJsonLd(lang), organizationJsonLd(lang)]}
      />

      <CompactHero count={radios.length} syncStatus={syncStatus} onResync={resync} />

      <div id="grid" className="mt-5 sm:mt-6 scroll-mt-24">
        <SearchBar value={query} onChange={setQuery} count={filtered.length} />
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : view === 'favorites' && favorites.length === 0 ? (
        <EmptyFavorites onBrowse={() => setView('all')} />
      ) : filtered.length === 0 ? (
        <EmptySearch query={query} />
      ) : (
        <motion.div
          layout
          className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((radio) => (
              <RadioCard
                key={radio.id}
                radio={radio}
                isActive={audio.current?.id === radio.id}
                isPlaying={audio.current?.id === radio.id && audio.isPlaying}
                isFavorite={isFavorite(radio.id)}
                onPlay={playRadio}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Two stacked horizontal billboards (970×250) below the stations grid */}
      {!error && filtered.length > 0 && (
        <div className="mt-12 sm:mt-16 flex flex-col items-center gap-8">
          <AdBanner inline width={970} height={250}
            slot={import.meta.env.VITE_ADSENSE_SLOT_BOTTOM || ''} />
          <AdBanner inline width={970} height={250}
            slot={import.meta.env.VITE_ADSENSE_SLOT_BOTTOM_2 || ''} />
        </div>
      )}

      <RecentArticles lang={lang} />

      <EmissionsSection lang={lang} />

      {lang === 'ar' && <DiasporaBlock />}
      {lang === 'ar' ? <HomeContentAr /> : <SeoCopy />}
    </>
  );
}

/**
 * Articles récents — 3 derniers posts du blog, affichés sous la grille
 * de stations. Sert de maillage interne et de découvrabilité du blog.
 */
function RecentArticles({ lang }) {
  const isAr = lang === 'ar';
  const arPrefix = isAr ? '/ar' : '';
  const recent = useMemo(
    () => [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3),
    []
  );
  return (
    <section className="mt-16 sm:mt-20 max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-5 flex-wrap">
        <h2 className="font-display text-2xl font-bold">
          {isAr ? 'مقالات حديثة' : 'Articles récents'}
        </h2>
        <Link
          to={`${arPrefix}/blog`}
          className="inline-flex items-center gap-1 text-sm text-[#FF6B7A] hover:text-[#FF2A3C] transition"
        >
          {isAr ? 'كل المقالات' : 'Tous les articles'}
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {recent.map((post) => {
          const title = isAr && post.title_ar ? post.title_ar : post.title;
          const excerpt = isAr && post.excerpt_ar ? post.excerpt_ar : post.excerpt;
          return (
            <Link
              key={post.slug}
              to={`${arPrefix}/blog/${slugForLang(post, lang)}`}
              className="glass rounded-2xl p-5 hover:bg-white/8 transition-colors group"
            >
              <p className="text-[11px] sm:text-[10px] uppercase tracking-wider text-white/40 mb-2">
                {new Date(post.date).toLocaleDateString(isAr ? 'ar-MA' : 'fr-FR', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
                {' · '}
                {post.readingTime} {isAr ? 'دقائق' : 'min'}
              </p>
              <h3 className="font-display font-semibold text-base leading-tight mb-2 line-clamp-2 group-hover:text-[#FF6B7A] transition">
                {title}
              </h3>
              <p className="text-xs text-white/55 line-clamp-3 leading-relaxed">
                {excerpt}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Émissions phares des radios marocaines — bloc cards qui liste les pages
 * éditoriales par animateur/programme (Mamoun Dribi, etc.). Les pages cibles
 * sont définies dans src/data/emissions.js. Affiché entre les articles
 * récents et le bloc SEO long-form.
 */
function EmissionsSection({ lang }) {
  const isAr = lang === 'ar';
  if (EMISSION_KEYS.length === 0) return null;
  return (
    <section className="mt-16 sm:mt-20 max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-5 flex-wrap">
        <h2 className="font-display text-2xl font-bold inline-flex items-center gap-2">
          <Mic2 className="h-5 w-5 text-[#FF6B7A]" />
          {isAr ? 'برامج الإذاعات المغربية' : 'Émissions des radios marocaines'}
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EMISSION_KEYS.map((key) => {
          const e = EMISSIONS[key];
          const c = isAr ? e.ar : e.fr;
          const path = isAr ? e.ar_path : e.fr_path;
          const stationName = isAr ? e.station_name_ar : e.station_name;
          return (
            <Link
              key={e.slug}
              to={path}
              className="glass rounded-2xl p-5 hover:bg-white/8 transition-colors group"
            >
              <p className="text-[11px] sm:text-[10px] uppercase tracking-wider text-[#FF6B7A] mb-2">
                {isAr ? 'برنامج' : 'Émission'} · {stationName}
              </p>
              <h3 className="font-display font-semibold text-base leading-tight mb-2 line-clamp-2 group-hover:text-[#FF6B7A] transition">
                {c.h1}
              </h3>
              <p className="text-xs text-white/55 line-clamp-3 leading-relaxed">
                {c.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Long-form SEO content block — pure HTML (no animations) targeting:
 *   "radio maroc", "radio marocaine", "radio maroc en direct",
 *   "écouter radio maroc", "radio maroc online", "radio fm maroc"
 *
 * ~850 words. Includes the (semantic) H1, internal links to city + genre
 * pages, and natural keyword density (~1.5%).
 */
function SeoCopy() {
  return (
    <section className="mt-16 sm:mt-24 max-w-4xl mx-auto text-white/75 leading-relaxed">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6 text-balance">
        Radio Maroc en direct — Écouter toutes les radios marocaines en ligne
      </h1>

      <p className="mb-5">
        Bienvenue sur <strong>Radio Maroc</strong>, le portail de référence
        pour écouter <strong>la radio au Maroc</strong> en direct et{' '}
        <strong>en ligne</strong>. Plus de 49 stations FM, AM et webradios
        du royaume diffusent leur signal sur notre plateforme :{' '}
        <Link to="/station/hit-radio" className="text-white hover:text-brand-300 underline-offset-2 hover:underline">Hit Radio Maroc</Link>,{' '}
        <Link to="/station/radio-mars" className="text-white hover:text-brand-300 underline-offset-2 hover:underline">Radio Mars Maroc</Link>,{' '}
        <Link to="/station/mfm" className="text-white hover:text-brand-300 underline-offset-2 hover:underline">MFM Radio Maroc</Link>,{' '}
        <em>Chada FM</em>, <em>Medi 1 Radio</em>, <em>Radio 2M</em>,{' '}
        <em>Medina FM</em>, <em>Cap Radio</em>, <em>Atlantic Radio</em>,{' '}
        <em>Radio Aswat</em>, <em>Skyrock Casablanca</em>, <em>Radio Coran</em>{' '}
        et bien d'autres. <strong>L'écoute est gratuite, sans inscription,
        sans téléchargement</strong>, et fonctionne sur ordinateur, tablette
        ou smartphone, partout dans le monde.
      </p>

      <p className="mb-5">
        Que vous cherchiez à écouter <strong>la radio du Maroc</strong> depuis
        Casablanca, à profiter de la <strong>radio en direct au Maroc</strong>{' '}
        pendant vos trajets, ou à suivre <strong>Radio Maroc en ligne</strong>{' '}
        depuis l'étranger, notre lecteur de streaming HD vous reconnecte
        instantanément à la pulsation sonore du royaume.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        Toutes les radios marocaines réunies sur une seule plateforme
      </h2>
      <p className="mb-5">
        Le paysage radiophonique marocain est l'un des plus riches du monde
        arabe. Depuis la libéralisation des ondes en 2006, des dizaines de
        nouvelles radios privées ont rejoint les chaînes historiques de la{' '}
        <strong>SNRT</strong> et du groupe public 2M. Notre site centralise
        ces stations pour vous permettre d'<strong>écouter la radio
        marocaine</strong> en direct, en haute qualité, où que vous soyez.
        Chaque station dispose de sa propre <Link to="/" className="text-brand-300 hover:underline">page dédiée</Link>{' '}
        avec une présentation détaillée, son histoire, son format musical et
        son lecteur audio embarqué — tout en restant connecté à la grille
        principale grâce à notre lecteur global qui suit votre navigation.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        Radios marocaines par catégorie
      </h2>
      <p className="mb-3">
        Pour vous orienter dans les <strong>radios FM marocaines</strong>{' '}
        disponibles, nous les classons en grandes familles :
      </p>
      <ul className="list-disc pl-6 mb-5 space-y-2 marker:text-brand-300">
        <li>
          <Link to="/radio-maroc-hit" className="text-white hover:text-brand-300 underline-offset-2 hover:underline font-semibold">Radios musicales et hits</Link> — Hit Radio, MFM, Medradio, Aswat,
          Chada FM : musique pop, R&B, hits internationaux et arabes pour un
          public jeune et adulte.
        </li>
        <li>
          <Link to="/radio-maroc-chaabi" className="text-white hover:text-brand-300 underline-offset-2 hover:underline font-semibold">Radio chaabi du Maroc</Link> — la musique populaire urbaine, l'aïta,
          la hayha et le mawal, présentes sur Zine Bladi et Yabiladi Chaabi
          Maroc.
        </li>
        <li>
          <Link to="/radio-maroc-amazigh" className="text-white hover:text-brand-300 underline-offset-2 hover:underline font-semibold">Radios amazighes</Link> — Yabiladi Azawan Amazigh, Radio Atbir, Radio
          Achkid FM, qui célèbrent la richesse de la culture berbère et les
          rythmes du Souss, du Rif et de l'Atlas.
        </li>
        <li>
          <strong>Radios sport</strong> — Radio Mars, première radio 100 %
          sport au Maroc, avec retransmissions de la Botola Pro et de la CAN.
        </li>
        <li>
          <strong>Radios religieuses</strong> — Radio Coran, Al Quran Radio,
          Radio Manarat : récitations 24 h / 24 par les plus grands lecteurs
          du monde musulman.
        </li>
        <li>
          <strong>Radios internationales</strong> — Medi 1 Radio (bilingue
          franco-arabe), Monte Carlo Doualiya (France Médias Monde), Radio
          Yabiladi pour la diaspora marocaine.
        </li>
      </ul>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        Les 3 radios marocaines les plus écoutées
      </h2>
      <p className="mb-5">
        Trois stations dominent l'audience nationale et concentrent l'essentiel
        des recherches sur Google. <Link to="/station/hit-radio" className="text-white font-semibold hover:text-brand-300 underline-offset-2 hover:underline">Hit Radio Maroc</Link>,
        lancée en 2006 par Younes Boumehdi, est la 1ʳᵉ radio musicale privée
        du royaume, leader sur le segment 15-35 ans avec son format pop /
        R&B / hits internationaux et arabes. <Link to="/station/radio-mars" className="text-white font-semibold hover:text-brand-300 underline-offset-2 hover:underline">Radio Mars Maroc</Link> —
        ou <strong>Mars Radio Maroc</strong> selon les recherches — est la 1ʳᵉ
        radio sportive 100 % marocaine, indispensable pour suivre la Botola
        Pro et les Lions de l'Atlas. Enfin, <Link to="/station/mfm" className="text-white font-semibold hover:text-brand-300 underline-offset-2 hover:underline">MFM Radio Maroc</Link>{' '}
        s'impose comme la référence sur les musiques afro-orientales
        (raï, chaabi, gnawa, amazigh) et la grande chanson maghrébine.
      </p>
      <p className="mb-5">
        Ces trois stations — <strong>Radio Maroc Mars</strong>, Hit Radio et
        MFM — couvrent les principaux segments d'audience (sport, jeunes urbains,
        adultes amateurs de musiques traditionnelles) et sont accessibles 24 h /
        24 sur notre lecteur, en streaming HD, sans inscription ni publicité
        intrusive. Que vous écoutiez depuis le Maroc ou depuis l'étranger,
        l'expérience reste identique.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        Écouter la radio marocaine partout dans le monde
      </h2>
      <p className="mb-5">
        Que vous soyez à <Link to="/radio-casablanca" className="text-brand-300 hover:underline">Casablanca</Link>,{' '}
        <Link to="/radio-rabat" className="text-brand-300 hover:underline">Rabat</Link>,{' '}
        <Link to="/radio-marrakech" className="text-brand-300 hover:underline">Marrakech</Link>,{' '}
        <Link to="/radio-tanger" className="text-brand-300 hover:underline">Tanger</Link>,{' '}
        <Link to="/radio-fes" className="text-brand-300 hover:underline">Fès</Link>,{' '}
        <Link to="/radio-agadir" className="text-brand-300 hover:underline">Agadir</Link> ou
        à l'étranger, notre plateforme vous donne accès à votre radio préférée
        sans coupure et sans publicité intrusive. <strong>Radio Maroc en
        direct</strong> est particulièrement utilisée par les{' '}
        <strong>Marocains du monde (MRE)</strong> qui souhaitent rester
        connectés à la culture, à l'actualité et à la musique de leur pays
        d'origine. La diaspora marocaine — en France, en Belgique, aux
        Pays-Bas, au Canada ou aux États-Unis — peut écouter Hit Radio,
        Medi 1 ou Chada FM exactement comme s'ils étaient à la maison.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        Pourquoi écouter la radio en streaming plutôt qu'en FM ?
      </h2>
      <p className="mb-5">
        Le <strong>streaming radio</strong> apporte plusieurs avantages par
        rapport à la diffusion FM classique : qualité audio supérieure
        (jusqu'à 256 kbps en HLS HD pour Radio 2M ou Medi 1), absence de
        parasitage, écoute simultanée sur plusieurs appareils, accès à des
        webradios qui n'ont pas de fréquence FM (Yabiladi, Rap Lbeldi Maroc,
        Fayroz). De plus, la plupart des grandes radios marocaines diffusent
        désormais leur signal en {' '}
        <a href="https://en.wikipedia.org/wiki/HTTP_Live_Streaming" target="_blank" rel="noopener" className="text-brand-300 hover:underline">HLS</a>{' '}
        ou en MP3, ce qui garantit un son net et une faible consommation de
        données mobiles.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        Une plateforme moderne, rapide et 100 % gratuite
      </h2>
      <p className="mb-5">
        Notre site s'efforce d'offrir l'une des meilleures expériences
        d'écoute du marché marocain : design soigné, lecteur audio Spotify-like
        qui suit votre navigation, mode sombre, recherche instantanée,
        favoris persistants, mise à jour automatique du catalogue. Le tout
        100 % gratuit, financé par une publicité discrète qui ne perturbe
        jamais l'écoute. Découvrez aussi notre{' '}
        <Link to="/blog" className="text-brand-300 hover:underline">blog dédié au paysage radiophonique marocain</Link>,{' '}
        avec des dossiers sur l'histoire des radios, des classements des
        meilleures stations et des guides pratiques.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        Live radio Maroc, FM gratuite et stations radio en ligne
      </h2>
      <p className="mb-5">
        Que vous cherchiez la <strong>radio Maroc en direct</strong>, la{' '}
        <strong>radio en ligne du Maroc</strong>, ou simplement à{' '}
        <Link to="/ecouter-radio-maroc" className="text-brand-300 hover:underline">écouter la radio marocaine</Link>{' '}
        depuis n'importe où, notre plateforme regroupe tout sur une seule
        page. Plus de trente <strong>stations radio Maroc</strong> couvrant
        chaque format : <Link to="/radio-sport-maroc" className="text-brand-300 hover:underline">radio sport Maroc</Link>{' '}
        (Radio Mars retransmet la Botola Pro et les Lions de l'Atlas en live),{' '}
        radios musicales (Hit Radio, MFM, Chada FM), spirituelles (Radio
        Coran, Radio Manarat), nationales et institutionnelles avec la{' '}
        <Link to="/radio-nationale-marocaine" className="text-brand-300 hover:underline">Radio Nationale Marocaine</Link>{' '}
        opérée par la SNRT (Al Idha3a Al Wataniya).
      </p>
      <p className="mb-5">
        La <strong>FM Maroc</strong> reste accessible dans toutes les villes
        — consultez nos pages dédiées aux{' '}
        <Link to="/frequences-radio-maroc" className="text-brand-300 hover:underline">fréquences FM par ville</Link>{' '}
        (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, Oujda, Tétouan,
        Nador, Laâyoune et 6 autres) — mais le <strong>streaming live</strong>{' '}
        offre la meilleure qualité audio sur smartphone, ordinateur, smart
        speaker et voiture connectée. Pour un panorama complet du paysage
        radio au Maroc, consultez notre{' '}
        <Link to="/radio-maroc" className="text-brand-300 hover:underline">guide pilier Radio au Maroc</Link>{' '}
        qui retrace l'histoire, les opérateurs et les grands formats.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        Foire aux questions
      </h2>
      <h3 className="font-display text-lg font-semibold text-white mt-5 mb-2">L'écoute est-elle vraiment gratuite ?</h3>
      <p className="mb-3">Oui, totalement. Aucun compte, aucun abonnement, aucune limite d'écoute.</p>
      <h3 className="font-display text-lg font-semibold text-white mt-5 mb-2">Puis-je écouter depuis l'étranger ?</h3>
      <p className="mb-3">Oui, toutes les radios marocaines présentes sur le site sont accessibles depuis l'international, sans VPN.</p>
      <h3 className="font-display text-lg font-semibold text-white mt-5 mb-2">La qualité audio est-elle bonne ?</h3>
      <p className="mb-3">Nous diffusons les flux officiels des radios. La qualité dépend du flux fourni par la station — entre 64 et 256 kbps selon la radio.</p>
      <h3 className="font-display text-lg font-semibold text-white mt-5 mb-2">Comment ajouter une radio manquante ?</h3>
      <p className="mb-3">Notre catalogue se synchronise automatiquement chaque jour avec l'API publique Radio-Browser. Les nouvelles stations apparaissent automatiquement.</p>
    </section>
  );
}

function CompactHero({ count, syncStatus, onResync }) {
  const { t } = useI18n();
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pt-6 sm:pt-10 pb-2"
    >
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-balance">
            {t('hero.h1_part1')}{' '}
            <span className="gradient-text">{t('hero.h1_part2')}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[11px] font-medium text-white/80">
            <Sparkles className="h-3.5 w-3.5 text-brand-300" />
            {count > 0 ? (
              <>
                <SlidingNumber value={count} fontSize={12} /> {t('hero.stations_in_live')}
              </>
            ) : (
              t('hero.preparing')
            )}
          </span>
          <button
            onClick={onResync}
            disabled={syncStatus.state === 'syncing'}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[11px] font-medium text-white/70 hover:text-white transition-colors disabled:opacity-50"
            title={t('hero.refresh')}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                syncStatus.state === 'syncing' ? 'animate-spin' : ''
              }`}
            />
            {syncStatus.state === 'syncing' ? t('hero.syncing') : t('hero.refresh')}
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function EmptySearch({ query }) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-16 text-center max-w-md mx-auto"
    >
      <div className="mx-auto h-16 w-16 rounded-2xl glass flex items-center justify-center mb-5">
        <RadioBig className="h-7 w-7 text-white/70" />
      </div>
      <h3 className="font-display text-xl font-semibold mb-2">
        {t('empty.no_radios_title')}
      </h3>
      <p className="text-sm text-white/60">
        {t('empty.no_radios_body')}
        {query ? <span className="text-white"> « {query} »</span> : null}.{' '}
        {t('empty.no_radios_try')}
      </p>
    </motion.div>
  );
}

function ErrorState({ message }) {
  const { t } = useI18n();
  return (
    <div className="mt-16 mx-auto max-w-md text-center glass rounded-3xl p-8">
      <h3 className="font-display text-xl font-semibold mb-2 text-rose-300">
        {t('error.load_title')}
      </h3>
      <p className="text-sm text-white/70">{message}</p>
      <p className="text-xs text-white/40 mt-3">
        {t('error.load_check')}
      </p>
    </div>
  );
}
