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
import useReducedMotion from '../hooks/useReducedMotion.js';
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
    radios, loading, syncStatus, resync, error,
    audio, playRadio,
    favorites, isFavorite, toggleFavorite,
    view, setView,
  } = useAppContext();

  const [query, setQuery] = useState('');
  const { t, lang } = useI18n();
  const { isMobile } = useReducedMotion();

  // Autoplay Hit Radio on first user interaction.
  // Browsers block autoplay without user gesture (Chrome/Safari/Firefox policy
  // since 2018), so we listen for the first click/touch/keypress on the page
  // and trigger play() at that exact moment — that counts as a user gesture
  // and bypasses the autoplay block. Only fires once per session and only if
  // the user hasn't manually picked another station first.
  //
  // Désactivé sur mobile : Chrome Android et Safari iOS sont encore plus
  // stricts et exigent que le play() vienne d'un clic DIRECTEMENT sur un
  // bouton play, pas d'un clic ailleurs sur la page. Le first-interaction
  // trigger fait juste apparaître une bannière d'erreur "Playback was unable
  // to start". Mieux vaut ne pas tenter du tout sur mobile.
  useEffect(() => {
    if (isMobile) return;
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
  }, [radios, audio.current, playRadio, isMobile]);

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
        jsonLd={
          lang === 'ar'
            ? [websiteJsonLd(lang), organizationJsonLd(lang)]
            : [websiteJsonLd(lang), organizationJsonLd(lang), homeFaqJsonLd()]
        }
      />

      <CompactHero count={radios.length} syncStatus={syncStatus} onResync={resync} />

      <div id="grid" className="mt-5 sm:mt-6 scroll-mt-24">
        <SearchBar value={query} onChange={setQuery} count={filtered.length} />
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : view === 'favorites' && favorites.length === 0 ? (
        <EmptyFavorites onBrowse={() => setView('all')} />
      ) : filtered.length === 0 && !loading && (query || radios.length > 0) ? (
        <EmptySearch query={query} />
      ) : (
        <motion.div
          layout
          className="mt-8 grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-5"
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
      {/* Note : le H2 d'ouverture "Radio Maroc en direct — Écouter en ligne…"
          et son paragraphe d'intro sont maintenant rendus en HAUT de la page
          (juste sous le hero) pour maximiser leur visibilité crawl + UX. */}
      <h2 className="font-display text-2xl font-bold text-white mb-4">
        Toutes les radios marocaines en direct, à un clic
      </h2>
      <p className="mb-5">
        Notre plateforme centralise plus de trente stations marocaines en direct.{' '}
        <Link to="/station/hit-radio" className="text-white hover:text-brand-300 underline-offset-2 hover:underline">Hit Radio</Link>,{' '}
        <Link to="/station/medi-1-radio" className="text-white hover:text-brand-300 underline-offset-2 hover:underline">Medi 1 Radio</Link>,{' '}
        <Link to="/station/chada-fm" className="text-white hover:text-brand-300 underline-offset-2 hover:underline">Chada FM</Link>,{' '}
        <Link to="/station/radio-mars" className="text-white hover:text-brand-300 underline-offset-2 hover:underline">Radio Mars</Link>,{' '}
        <Link to="/station/radio-2m" className="text-white hover:text-brand-300 underline-offset-2 hover:underline">Radio 2M</Link>,{' '}
        <Link to="/station/mfm" className="text-white hover:text-brand-300 underline-offset-2 hover:underline">MFM</Link>,
        Medina FM, Aswat, Cap Radio, Med Radio, Skyrock Casablanca, Radio Coran
        et bien d'autres y sont diffusées en direct, sans coupure publicitaire
        intrusive et avec une qualité audio adaptée à votre connexion (jusqu'à
        256 kbps en HLS HD).
      </p>
      <p className="mb-5">
        Le principe est simple : aucun téléchargement d'application, aucune
        création de compte, aucune limite d'écoute. Vous ouvrez le site, vous
        choisissez une radio, et le lecteur audio démarre immédiatement. Le
        flux reste actif quand vous changez de page : pratique pour découvrir
        une nouvelle station tout en continuant d'écouter votre programme
        préféré.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        Comment fonctionne l'écoute en direct ?
      </h2>
      <p className="mb-5">
        Chaque radio marocaine diffuse son signal sous forme d'un flux audio
        numérique transmis en temps réel par les serveurs de la station. Notre
        plateforme se connecte à ces flux officiels (HLS, AAC, MP3 selon les
        radios) et les relit dans votre navigateur via un lecteur Web compatible
        avec tous les appareils modernes : ordinateur, smartphone iOS et
        Android, tablette, smart TV.
      </p>
      <p className="mb-5">
        Le décalage entre la diffusion réelle et votre écoute est généralement
        compris entre 5 et 30 secondes selon la radio et votre connexion. Sur
        la fibre, le délai est imperceptible ; sur 4G ou 5G, il reste très
        court. Si votre débit fluctue, le lecteur ajuste automatiquement la
        qualité pour éviter les coupures. Aucune installation, aucun
        paramétrage.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        Sur quels appareils écouter la radio marocaine en ligne ?
      </h2>
      <ul className="list-disc pl-6 mb-5 space-y-2 marker:text-brand-300">
        <li>Ordinateur (Windows, Mac, Linux) : navigateur Chrome, Firefox, Edge ou Safari récent.</li>
        <li>Smartphone Android : Chrome ou navigateur d'origine, écoute possible en arrière-plan.</li>
        <li>iPhone et iPad : Safari ou Chrome, contrôle depuis le centre de contrôle iOS.</li>
        <li>Smart TV : Chromecast, Apple TV, navigateur intégré.</li>
        <li>Voiture : Apple CarPlay et Android Auto via Bluetooth ou USB.</li>
        <li>Enceintes connectées : Google Home, Amazon Echo (en lançant l'URL via le navigateur du smartphone).</li>
      </ul>

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
        Pourquoi écouter la radio en ligne plutôt qu'en FM ?
      </h2>
      <p className="mb-5">
        L'écoute en ligne via Internet apporte plusieurs avantages décisifs
        sur la diffusion FM classique. D'abord, la qualité audio : les radios
        marocaines diffusent généralement entre 64 kbps (mono) et 256 kbps
        (stéréo HD), bien supérieure à la modulation analogique parasitée par
        les zones d'ombre, les tunnels et les obstacles urbains. Ensuite, la
        couverture : depuis Casablanca, Rabat, Marrakech, Tanger ou n'importe
        quelle ville du monde, le signal est identique. Aucune zone blanche.
      </p>
      <p className="mb-5">
        L'écoute en ligne permet aussi d'accéder à des webradios qui n'ont
        pas de fréquence FM officielle (Yabiladi Chaabi Maroc, Yabiladi
        Azawan Amazigh, Rap Lbeldi Maroc, Fayroz, Adwaa FM). Pour les
        Marocains résidant à l'étranger (MRE), c'est le seul moyen pratique
        d'écouter la radio nationale en temps réel.
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
        à l'étranger, notre plateforme vous donne accès à votre radio
        préférée sans coupure et sans publicité intrusive.{' '}
        <strong>Radio Maroc en direct</strong> est particulièrement utilisée
        par les <strong>Marocains du monde (MRE)</strong> qui souhaitent
        rester connectés à la culture, à l'actualité et à la musique de leur
        pays d'origine. La diaspora marocaine — en France, en Belgique, aux
        Pays-Bas, au Canada ou aux États-Unis — peut écouter Hit Radio,
        Medi 1 ou Chada FM exactement comme s'ils étaient à la maison.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        Les stations les plus écoutées en ligne
      </h2>
      <p className="mb-5">
        Selon nos statistiques d'utilisation,{' '}
        <Link to="/station/hit-radio" className="text-white font-semibold hover:text-brand-300 underline-offset-2 hover:underline">Hit Radio</Link>,{' '}
        <Link to="/station/medi-1-radio" className="text-white font-semibold hover:text-brand-300 underline-offset-2 hover:underline">Medi 1 Radio</Link>,{' '}
        <Link to="/station/chada-fm" className="text-white font-semibold hover:text-brand-300 underline-offset-2 hover:underline">Chada FM</Link>,{' '}
        <Link to="/station/radio-mars" className="text-white font-semibold hover:text-brand-300 underline-offset-2 hover:underline">Radio Mars</Link>{' '}
        et MFM concentrent plus de 60 % des écoutes en ligne. Ces cinq radios
        cumulent les avantages de la notoriété FM, d'une grille moderne et
        d'une qualité de flux stable. Pour l'auditeur exigeant, Medi 1 Tarab
        (musique arabe classique), Radio Mohammed VI du Saint Coran et Cap
        Radio offrent des contenus de niche très appréciés. Notre{' '}
        <Link to="/top-radio-maroc" className="text-brand-300 hover:underline">top 10 dynamique</Link>{' '}
        reflète les écoutes en temps réel.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        Écouter la radio marocaine 24h/24, sans coupure
      </h2>
      <p className="mb-5">
        Toutes les radios listées sur cette page diffusent en continu, sans
        interruption nocturne. Pendant le mois sacré du Ramadan, l'audience
        explose sur les radios religieuses (Radio Coran, Radio Manarat,
        Radio Mohammed VI). Les vendredis matins, les radios généralistes
        diffusent l'appel à la prière et le sermon. Les samedis et dimanches,
        les programmes culturels et musicaux dominent. Bref, quel que soit le
        moment, il y a toujours une radio marocaine à écouter en direct sur
        notre plateforme. Pour aller plus loin, consultez nos pages dédiées
        aux{' '}
        <Link to="/frequences-radio-maroc" className="text-brand-300 hover:underline">fréquences FM par ville</Link>{' '}
        (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, Oujda, Tétouan,
        Nador, Laâyoune et 6 autres), au panorama complet du{' '}
        <Link to="/radio-maroc" className="text-brand-300 hover:underline">paysage radio au Maroc</Link>, à la{' '}
        <Link to="/radio-sport-maroc" className="text-brand-300 hover:underline">radio sport marocaine</Link>{' '}
        (Radio Mars retransmet la Botola Pro et les Lions de l'Atlas) ou à la{' '}
        <Link to="/radio-nationale-marocaine" className="text-brand-300 hover:underline">Radio Nationale Marocaine</Link>{' '}
        opérée par la SNRT.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-6">
        Foire aux questions
      </h2>
      <div className="space-y-3">
        {HOME_FAQS.map((item, i) => (
          <details
            key={i}
            className="group glass rounded-2xl px-5 py-4 cursor-pointer transition-all hover:bg-white/[0.06]"
          >
            <summary className="font-display font-semibold text-white text-[15px] flex items-center justify-between gap-4 list-none">
              <span>{item.q}</span>
              <ChevronRight className="h-4 w-4 text-white/50 transition-transform group-open:rotate-90 shrink-0" />
            </summary>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/**
 * FAQ home (FR) — questions affichées dans SeoCopy + JSON-LD FAQPage pour
 * éligibilité au Featured Snippet Google. Le contenu correspond exactement
 * à ce qui était sur /radio-maroc-en-direct avant fusion.
 */
const HOME_FAQS = [
  {
    q: 'Comment écouter la radio marocaine en direct ?',
    a: "Ouvrez notre page d'accueil, choisissez une radio dans le catalogue (plus de 30 stations disponibles) et cliquez sur Écouter. L'écoute démarre en quelques secondes, sans inscription ni téléchargement.",
  },
  {
    q: "L'écoute est-elle vraiment gratuite ?",
    a: "Oui, totalement. Aucun abonnement, aucun compte, aucune limite. Le site est financé par une publicité discrète qui ne perturbe jamais l'écoute audio.",
  },
  {
    q: "Puis-je écouter la radio marocaine depuis l'étranger ?",
    a: "Oui, toutes les radios sont accessibles depuis n'importe quel pays, sans VPN. Particulièrement populaire auprès des MRE en France, Belgique, Pays-Bas, Espagne, Canada et États-Unis.",
  },
  {
    q: "Quelle qualité audio pour l'écoute en ligne ?",
    a: "La qualité dépend de la station : entre 64 kbps (mono basique) et 256 kbps (stéréo HD HLS). Medi 1 Radio, Hit Radio et Radio 2M proposent les flux les plus nets.",
  },
  {
    q: "L'écoute fonctionne-t-elle en arrière-plan sur smartphone ?",
    a: "Oui, sur Android l'audio continue après verrouillage de l'écran. Sur iOS, lancez le lecteur puis verrouillez : la radio reste audible, contrôlable depuis le centre de contrôle.",
  },
];

export function homeFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
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
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1 max-w-4xl">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-balance">
            Radio Maroc en direct —{' '}
            <span className="gradient-text">Écouter en ligne toutes les stations marocaines</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-[13px] sm:text-[15px] text-white/70 leading-relaxed max-w-3xl">
            Écoutez les radios du Maroc en direct, gratuitement et sans
            inscription. Plus de 30 stations FM et webradios diffusent leur
            signal 24 heures sur 24 sur notre plateforme. Sélectionnez une
            station, cliquez sur écouter, et profitez du Maroc en direct
            depuis n'importe où dans le monde.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
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
