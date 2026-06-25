import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, AlertCircle, Play, Radio as RadioIco } from 'lucide-react';

import RadioIcon from '../components/RadioIcon.jsx';
import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import { useAppContext } from '../AppContext.jsx';
import { FREQUENCIES, CITY_KEYS, FREQ_CITY_AR, FREQ_TYPE_AR } from '../data/frequencies.js';
import useI18n from '../i18n/useI18n.js';

const BASE = 'https://radiolive.ma';

const broadcastServiceJsonLd = (city, cityName) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `Fréquences Radio à ${cityName} — Liste complète des radios FM`,
  url: `${BASE}/frequence-radio-${city.key}`,
  inLanguage: ['fr-MA', 'ar-MA'],
  about: {
    '@type': 'Place',
    name: cityName,
    address: { '@type': 'PostalAddress', addressLocality: cityName, addressRegion: city.region, addressCountry: 'MA' },
    ...(city.coords && { geo: { '@type': 'GeoCoordinates', latitude: city.coords.lat, longitude: city.coords.lng } }),
  },
  mainEntity: city.stations.map((s) => ({
    '@type': 'BroadcastService',
    name: s.name,
    broadcastFrequency: {
      '@type': 'BroadcastFrequencySpecification',
      broadcastFrequencyValue: parseFloat(s.fm),
      broadcastSignalModulation: 'FM',
    },
    inLanguage: ['fr-MA', 'ar-MA'],
    broadcastDisplayName: s.name,
    ...(s.slug && { url: `${BASE}/station/${s.slug}` }),
  })),
});

export default function FrequencyCityPage({ cityKey: cityKeyProp }) {
  const params = useParams();
  const cityKey = cityKeyProp || params.city;
  const { radios } = useAppContext();
  const { lang } = useI18n();
  const isAr = lang === 'ar';
  const arPrefix = isAr ? '/ar' : '';
  const city = FREQUENCIES[cityKey];
  const ar = FREQ_CITY_AR[cityKey] || {};

  const otherCities = useMemo(
    () => CITY_KEYS.filter((k) => k !== cityKey).map((k) => ({ key: k, ...FREQUENCIES[k] })),
    [cityKey]
  );

  const radioBySlug = useMemo(() => {
    const m = new Map();
    for (const r of radios) m.set(r.id, r);
    return m;
  }, [radios]);

  if (!city) {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <h2 className="font-display text-2xl font-bold mb-2">{isAr ? 'مدينة غير معروفة' : 'Ville inconnue'}</h2>
        <Link to={`${arPrefix}/frequences-radio-maroc`} className="btn-primary inline-flex">
          {isAr ? 'كل المدن' : 'Voir toutes les villes'}
        </Link>
      </div>
    );
  }

  const cityName = isAr && ar.name ? ar.name : city.name;
  const region = isAr && ar.region ? ar.region : city.region;
  const intro = isAr && ar.intro ? ar.intro : city.intro;
  const typeLabel = (t) => (isAr && FREQ_TYPE_AR[t] ? FREQ_TYPE_AR[t] : t);
  const count = city.stations.length;

  const sorted = [
    ...city.stations.filter((s) => !s.approximate),
    ...city.stations.filter((s) => s.approximate),
  ];
  const hasApprox = city.stations.some((s) => s.approximate);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-6 sm:pt-10 pb-16 max-w-5xl mx-auto"
    >
      <Seo
        lang={lang}
        title={isAr ? `ترددات الراديو في ${cityName} — قائمة إذاعات FM الكاملة` : `Fréquences Radio à ${cityName} — Liste complète des radios FM`}
        description={isAr
          ? `اكتشف جميع ترددات الراديو FM في ${cityName}. قائمة ${count} محطة FM مع النوع والرابط نحو البث المباشر. اعثر بسرعة على تردد إذاعتك المفضّلة.`
          : `Découvrez toutes les fréquences radio FM à ${cityName}. Liste de ${count} stations FM avec format, type et lien vers le streaming en direct.`}
        canonical={`${BASE}${arPrefix}/frequence-radio-${cityKey}`}
        alternates={[
          { hreflang: 'fr-MA', href: `${BASE}/frequence-radio-${cityKey}` },
          { hreflang: 'ar-MA', href: `${BASE}/ar/frequence-radio-${cityKey}` },
          { hreflang: 'x-default', href: `${BASE}/frequence-radio-${cityKey}` },
        ]}
        jsonLd={[
          broadcastServiceJsonLd(city, cityName),
          breadcrumbJsonLd([
            { name: isAr ? 'الرئيسية' : 'Accueil', url: isAr ? '/ar' : '/' },
            { name: isAr ? 'ترددات الراديو' : 'Fréquences Radio', url: `${arPrefix}/frequences-radio-maroc` },
            { name: cityName },
          ]),
        ]}
      />

      <Link to={`${arPrefix}/frequences-radio-maroc`}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> {isAr ? 'كل المدن' : 'Toutes les villes'}
      </Link>

      <header className="mt-6 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[11px] font-medium text-white/70 mb-4">
          <MapPin className="h-3.5 w-3.5 text-brand-300" />
          {region} · {city.population} {isAr ? 'نسمة' : 'habitants'}
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-balance leading-tight">
          {isAr ? 'ترددات الراديو في ' : 'Fréquences Radio à '}<span className="gradient-text">{cityName}</span>
        </h1>
        <p className="text-white/75 text-lg leading-relaxed mt-4">
          {isAr
            ? `قائمة كاملة بترددات FM للإذاعات المغربية المتاحة في ${cityName}، مع النوع وطبيعة البرمجة ووصول مباشر إلى الاستماع عبر البث.`
            : `Liste complète des fréquences FM des radios marocaines disponibles à ${cityName}, avec format, type de programmation et accès direct à l'écoute en streaming.`}
        </p>
      </header>

      <section className="glass rounded-3xl overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-white/60 text-[11px] uppercase tracking-wider">
              <th className="text-left px-4 py-3 w-12">#</th>
              <th className="text-left px-4 py-3">{isAr ? 'الإذاعة' : 'Radio'}</th>
              <th className="text-left px-4 py-3 w-24">{isAr ? 'التردد' : 'Fréquence'}</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">{isAr ? 'النوع' : 'Type'}</th>
              <th className="text-right px-4 py-3 w-24">{isAr ? 'استماع' : 'Écouter'}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => {
              const r = s.slug ? radioBySlug.get(s.slug) : null;
              return (
                <tr key={`${s.name}-${s.fm}`}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white/45 tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {r ? (
                        <span className="shrink-0"><RadioIcon radio={r} size="sm" /></span>
                      ) : (
                        <div className="h-10 w-10 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center">
                          <RadioIco className="h-4 w-4 text-white/40" />
                        </div>
                      )}
                      <span className="font-medium truncate">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-display font-bold tabular-nums">
                    <span style={{
                      background: r ? `linear-gradient(120deg, ${r.gradientFrom}, ${r.gradientTo})` : undefined,
                      WebkitBackgroundClip: r ? 'text' : undefined,
                      WebkitTextFillColor: r ? 'transparent' : undefined,
                    }}>
                      {s.fm} FM
                    </span>
                    {s.approximate && (
                      <AlertCircle className="h-3 w-3 inline-block ml-1.5 text-amber-400"
                        title={isAr ? 'تردد تقريبي — يُرجى التأكّد محليّاً' : 'Fréquence approximative — à vérifier localement'} />
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-white/65">{typeLabel(s.type)}</td>
                  <td className="px-4 py-3 text-right">
                    {s.slug ? (
                      <Link to={`${arPrefix}/station/${s.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white"
                        style={r ? { background: `linear-gradient(120deg, ${r.gradientFrom}, ${r.gradientTo})` } : { background: 'rgba(124,77,255,0.65)' }}>
                        <Play className="h-3 w-3" /> {isAr ? 'استماع' : 'Écouter'}
                      </Link>
                    ) : (
                      <span className="text-[11px] text-white/40">{isAr ? 'FM فقط' : 'FM uniquement'}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {hasApprox && (
        <p className="text-[12px] text-amber-300/70 mb-10 inline-flex items-start gap-2">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          {isAr
            ? 'الترددات المعلَّمة بإشارة تحذير تقريبية — لا تتردّد في استعمال المسح التلقائي لـ FM في جهازك للتأكّد.'
            : "Les fréquences marquées d'une icône d'avertissement sont approximatives — n'hésitez pas à utiliser le scan FM automatique de votre récepteur pour confirmer."}
        </p>
      )}

      <section className="prose-invert max-w-none text-white/75 leading-relaxed space-y-4">
        <h2 className="font-display text-2xl font-bold text-white mt-4 mb-3">
          {isAr ? `الإذاعة في ${cityName}` : `La radio à ${cityName}`}
        </h2>
        <p>{intro}</p>

        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-3">
          {isAr ? 'تنوّع المحطات المتاحة' : 'Diversité des stations disponibles'}
        </h2>
        {isAr ? (
          <>
            <p>بـ<strong>{count} محطة FM</strong> مُحصاة، تقدّم {cityName} تنوّعاً تحريريّاً كبيراً للمستمعين المحلّيين: إذاعات موسيقية لكل الأذواق (بوب عالمي، منوّعات عربية، نجاحات، هيب هوب)، وإذاعات إخبارية متواصلة (ميدي1، أتلانتيك راديو)، وإذاعات اقتصادية (كاب راديو)، وإذاعات دينية (إذاعة القرآن الكريم للـSNRT)، وإذاعات جهوية خاصة بجهة {region}.</p>
            <p>يعكس هذا التعدّد نضج المشهد الإذاعي المغربي منذ تحرير الموجات سنة 2006. لكل محطة هوية تحريرية وموسيقية خاصة، تتيح لسكان {cityName} اختيار الإذاعة الأقرب إلى ذائقتهم.</p>
          </>
        ) : (
          <>
            <p>Avec <strong>{count} stations FM</strong> répertoriées, {cityName} offre une grande diversité éditoriale : des radios musicales pour tous les goûts (pop internationale, variétés arabes, hits, hip-hop), des radios d'information continue (Médi 1, Atlantic Radio), des radios économiques (Cap Radio), des radios religieuses (Radio Coran de la SNRT), et des radios régionales spécifiques à la région {region}.</p>
            <p>Cette pluralité reflète la maturité du paysage radiophonique marocain depuis la libéralisation des ondes en 2006. Chaque station propose une identité éditoriale et musicale propre, permettant aux habitants de {cityName} de choisir la radio qui correspond le mieux à leur sensibilité.</p>
          </>
        )}

        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-3">
          {isAr ? 'أهمية الإذاعات المحلية في الحياة اليومية' : 'Importance des radios locales dans la vie quotidienne'}
        </h2>
        {isAr ? (
          <>
            <p>بالنسبة لسكان {cityName}، تبقى الإذاعة وسيطاً مركزيّاً في الحياة اليومية: صباحاً مع تحضير الفطور والتنقّل نحو العمل، وظهراً مع النشرات الإخبارية ومجلات المجتمع، ومساءً مع الموسيقى والترفيه. التجار وسائقو سيارات الأجرة والحرفيون والموظفون وربّات البيوت — لكلٍّ محطاته المفضّلة.</p>
            <p>وأبعد من الاستماع الفردي، تؤدّي الإذاعة دوراً اجتماعيّاً مهمّاً في {cityName}: الإهداءات الموسيقية في المناسبات العائلية، والتغطيات المباشرة للأحداث المحلية، والبرامج التفاعلية عبر الهاتف — كلها لحظات تجعل الإذاعة رابطاً مجتمعيّاً حقيقيّاً.</p>
          </>
        ) : (
          <>
            <p>Pour les habitants de {cityName}, la radio reste un médium central de la vie quotidienne — le matin, la mi-journée pour les bulletins d'information, le soir pour la musique et le divertissement. Commerçants, chauffeurs de taxi, artisans, employés et femmes au foyer : tous ont leurs stations préférées.</p>
            <p>Au-delà de l'écoute individuelle, la radio joue un rôle social important à {cityName} : dédicaces musicales lors des fêtes familiales, couvertures live des grands événements locaux, talk-shows interactifs — autant de moments qui font de la radio un véritable lien communautaire.</p>
          </>
        )}

        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-3">
          {isAr ? 'كيف تستمع لهذه الإذاعات بغير FM؟' : "Comment écouter ces radios autrement qu'en FM ?"}
        </h2>
        <p>
          {isAr
            ? `إن لم تكن في ${cityName} أو أردت جودة صوتية أعلى من تشويش FM، يبقى البثّ عبر الإنترنت الحلّ المرجعي. تجمع منصّتنا التدفّقات الصوتية الرسمية لكل الإذاعات أعلاه، متاحة على مدار الساعة دون تسجيل وبجودة عالية (حتى 256 kbps بصيغة HLS لميدي1 وراديو 2M). اضغط على زر «استماع» في الجدول للوصول مباشرة إلى صفحة الإذاعة.`
            : `Si vous n'êtes pas à ${cityName} ou si vous voulez une qualité audio supérieure, le streaming en ligne est désormais la solution de référence. Notre plateforme regroupe les flux officiels de toutes les radios ci-dessus, 24 h / 24 sans inscription, en haute qualité (jusqu'à 256 kbps en HLS HD). Cliquez sur « Écouter » dans le tableau.`}
        </p>

        <h2 className="font-display text-2xl font-bold text-white mt-8 mb-3">{isAr ? 'انظر أيضاً' : 'Voir aussi'}</h2>
        <ul className="list-disc pl-6 space-y-1.5 marker:text-brand-300">
          <li><Link to={`${arPrefix}/frequences-radio-maroc`} className="text-brand-300 hover:underline">{isAr ? 'ترددات الراديو لكل المدن' : 'Fréquences radio toutes villes'}</Link></li>
          <li><Link to={`${arPrefix}/radio-${city.key}`} className="text-brand-300 hover:underline">{isAr ? `إذاعات ${cityName} (صفحة تحريرية)` : `Radios à ${cityName} (page éditoriale)`}</Link></li>
          <li><Link to={`${arPrefix}/top-radio-maroc`} className="text-brand-300 hover:underline">{isAr ? 'أفضل 10 إذاعات مغربية' : 'Top 10 des radios marocaines'}</Link></li>
          <li><Link to={isAr ? '/ar' : '/'} className="text-brand-300 hover:underline">{isAr ? 'الاستماع إلى كل الإذاعات المغربية' : 'Écouter toutes les radios marocaines'}</Link></li>
        </ul>
      </section>

      <section className="mt-12 glass rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold mb-4">
          {isAr ? 'ترددات الراديو في مدن أخرى' : 'Fréquences radio dans les autres villes'}
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
          {otherCities.map((c) => (
            <li key={c.key}>
              <Link to={`${arPrefix}/frequence-radio-${c.key}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass hover:bg-white/8 text-white/80 hover:text-white transition-colors">
                <MapPin className="h-3 w-3 text-brand-300" />
                {isAr && FREQ_CITY_AR[c.key]?.name ? FREQ_CITY_AR[c.key].name : c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </motion.article>
  );
}
