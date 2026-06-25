import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radio, MapPin } from 'lucide-react';

import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import { cityList, FREQ_CITY_AR } from '../data/frequencies.js';
import useI18n from '../i18n/useI18n.js';

const BASE = 'https://radiolive.ma';

const webPageJsonLd = (cities) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Fréquences Radio Maroc — Liste complète des radios FM par ville',
  url: `${BASE}/frequences-radio-maroc`,
  inLanguage: ['fr-MA', 'ar-MA'],
  about: { '@type': 'Thing', name: 'Fréquences FM des radios marocaines' },
  hasPart: cities.map((c) => ({
    '@type': 'WebPage',
    name: `Fréquences Radio à ${c.name}`,
    url: `${BASE}/frequence-radio-${c.key}`,
  })),
});

export default function FrequenciesIndexPage() {
  const cities = cityList();
  const { t, lang } = useI18n();
  const isAr = lang === 'ar';
  const arPrefix = isAr ? '/ar' : '';
  const homeHref = isAr ? '/ar' : '/';
  const cityName = (c) => (isAr && FREQ_CITY_AR[c.key]?.name ? FREQ_CITY_AR[c.key].name : c.name);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-6 sm:pt-10 pb-16 max-w-4xl mx-auto"
    >
      <Seo
        lang={lang}
        title={isAr
          ? 'ترددات راديو المغرب — قائمة الإذاعات FM حسب المدينة'
          : 'Fréquences Radio Maroc — Liste complète des radios FM par ville'}
        description={isAr
          ? 'اطلع على جميع ترددات الراديو في المغرب مرتبة حسب المدينة: الدار البيضاء، الرباط، مراكش، فاس، طنجة، أكادير وأكثر من 16 مدينة. ابحث عن تردد FM لهيت راديو، ميدي1، شدى إف إم وراديو 2M وجميع الإذاعات المغربية.'
          : 'Consultez toutes les fréquences radio au Maroc classées par ville : Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir et plus de 16 villes. Trouvez facilement la fréquence FM de Hit Radio, Médi 1, Chada FM, Radio 2M et toutes les radios marocaines.'}
        canonical={`${BASE}${isAr ? '/ar' : ''}/frequences-radio-maroc`}
        alternates={[
          { hreflang: 'fr-MA', href: `${BASE}/frequences-radio-maroc` },
          { hreflang: 'ar-MA', href: `${BASE}/ar/frequences-radio-maroc` },
          { hreflang: 'x-default', href: `${BASE}/frequences-radio-maroc` },
        ]}
        jsonLd={[
          webPageJsonLd(cities),
          breadcrumbJsonLd([
            { name: t('nav.home'), url: homeHref },
            { name: isAr ? 'ترددات راديو المغرب' : 'Fréquences Radio Maroc' },
          ]),
        ]}
      />

      <Link to={homeHref} className="text-sm text-white/60 hover:text-white">← {t('nav.back')}</Link>

      <h1 className="font-display text-3xl sm:text-5xl font-bold mt-6 mb-6 text-balance">
        {isAr ? 'ترددات راديو ' : 'Fréquences Radio '}<span className="gradient-text">{isAr ? 'المغرب' : 'Maroc'}</span>
      </h1>
      <p className="text-white/80 text-lg leading-relaxed mb-10">
        {isAr
          ? 'القائمة الكاملة لترددات FM للإذاعات المغربية، مرتّبة حسب المدينة. اختر مدينتك أدناه لرؤية الجدول المفصّل للمحطات التي تبثّ بها، ونوعها الموسيقي، ووصول مباشر إلى الاستماع عبر البث.'
          : "La liste complète des fréquences FM des radios marocaines, organisée par ville. Choisissez votre ville ci-dessous pour voir le tableau détaillé des stations qui y diffusent, leur format musical et un accès direct à l'écoute en streaming."}
      </p>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-16">
        {cities.map((c) => (
          <Link key={c.key} to={`${arPrefix}/frequence-radio-${c.key}`}
            className="group glass rounded-2xl p-4 hover:bg-white/8 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-3.5 w-3.5 text-brand-300" />
              <span className="font-display font-semibold text-sm group-hover:text-brand-300 transition-colors">
                {cityName(c)}
              </span>
            </div>
            <p className="text-[11px] text-white/50">
              {c.stations.length} {isAr ? 'تردد FM' : 'fréquences FM'}
            </p>
          </Link>
        ))}
      </section>

      <section className="prose-invert max-w-none text-white/75 leading-relaxed space-y-5">
        {isAr ? (
          <>
            <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">كيف تشتغل ترددات الراديو FM بالمغرب؟</h2>
            <p>تستعمل <strong>إذاعة FM</strong> (التضمين الترددي) نطاقاً من <strong>87.5 إلى 108.0 ميغاهرتز</strong>، تُخصَّص فيه لكل محطة قناة محدّدة من طرف <strong>الهاكا (HACA)</strong>، الجهة المنظِّمة للمشهد السمعي-البصري المغربي. وكما في كل الدول المعتمِدة لمعيار FM الدولي، يكون الفارق الأدنى بين محطتين متجاورتين عادةً 0.4 ميغاهرتز لتفادي التشويش.</p>
            <p>يعتمد مدى الباعث FM على عدة عوامل: قدرته، وارتفاع الهوائي، والتضاريس، والطقس. لذلك <strong>تتغيّر تردد الإذاعة نفسها من مدينة لأخرى</strong> بالمغرب — لكل باعث جهوي قناته الخاصة ليبقى واضحاً محليّاً. فهيت راديو مثلاً تبثّ على <em>95.4 بالدار البيضاء</em>، و<em>92.5 بالرباط</em>، و<em>91.8 بمراكش</em>، و<em>96.7 بطنجة</em>.</p>

            <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">كيف تجد إذاعة بالمغرب؟</h2>
            <p>لإيجاد إذاعة على FM، أمامك عدة خيارات. أبسطها الاطلاع على دليلنا أعلاه: اختر مدينتك وادخل إلى الجدول الكامل للترددات. وإن توفّر جهازك على «مسح تلقائي» (متوفّر في كل أجهزة السيارات الحديثة وأغلب الأجهزة المحمولة)، يكفي تصفّح نطاق FM لتُسجَّل المحطات المكتشَفة في ذاكرة الجهاز.</p>
            <p>ولمن يريد تفادي تغيّر الترددات بين المدن، أو الاستماع من الخارج، يبقى <strong>البثّ عبر الإنترنت</strong> الحلّ الأكثر موثوقية. يجمع موقعنا التدفّقات الصوتية الرسمية لكل الإذاعات المغربية الكبرى بجودة عالية (حتى 256 kbps بصيغة HLS)، متاحة على مدار الساعة من أي جهاز.</p>

            <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">لماذا تتغيّر الترددات حسب المدينة؟</h2>
            <p>تُسنَد تخطيط ترددات FM بالمغرب إلى الهاكا، التي توزّع القنوات حسب الجغرافيا وتفادي التشويش. لذا يجب على إذاعة وطنية مثل <strong>ميدي1</strong> أو <strong>هيت راديو</strong> أو <strong>شدى إف إم</strong> استعمال تردد مختلف في كل تجمّع حضري تغطّيه. وهذا ما يفسّر التقاط الإذاعة نفسها على 88.0 بالدار البيضاء و92.5 بالرباط و91.8 بمراكش.</p>
            <p>وللمستمعين <strong>أثناء التنقّل</strong>، من المفيد حفظ ترددين أو ثلاثة محلية لإذاعاتهم المفضّلة في كل مدينة كبرى، أو الانتقال ببساطة إلى البثّ عبر 4G/5G الذي يحافظ على نفس رابط التدفّق بغضّ النظر عن المكان.</p>

            <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">أهمية الإذاعات المحلية بالمغرب</h2>
            <p>أبعد من الإذاعات الخاصة الكبرى التي تغطّي كامل المملكة، يضمّ المشهد المغربي أيضاً <strong>إذاعات جهوية</strong> تؤدّي دوراً أساسيّاً في الحياة المحلية: <em>مراكش بلوس</em>، و<em>راديو بلوس أكادير</em>، و<em>راديو أتبير</em> (بالتاشلحيت)، والإذاعات الجهوية لـSNRT بتطوان ووجدة والعيون وبني ملال والناظور — محطات تُخبر السكان بالدارجة والأمازيغية والحسانية وتغطّي الأحداث والرياضة والفلاحة والثقافة المحلية.</p>
            <p>ولمغاربة العالم، معرفة تردد FM لمدينتهم الأصلية مفيدة أيضاً عند العودة الصيفية للبلد. تتيح هذه الصفحة استعادة الخريطة الصوتية لكبرى مدن المملكة وقائمة محدَّثة لقنوات FM المستعمَلة.</p>

            <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">مصادر البيانات وموثوقيتها</h2>
            <p>تجمع قاعدة تردداتنا البيانات الرسمية المنشورة من الهاكا، ومواقع المحطات نفسها، إضافة إلى مسوحات FM من OnlineRadioBox وradio-locator. بالنسبة للمدن الأكثر تغطيةً (الدار البيضاء، الرباط، مراكش، طنجة، فاس، أكادير)، الترددات مؤكَّدة. أما المدن الأصغر، فبعض الترددات مُشار إليها كـ«تقريبية» عند تعذّر التحقّق منها عبر مصدرين مستقلّين — وستراها بوضوح في كل جدول.</p>
            <p>إذا لاحظت خطأً في تردد، لا تتردّد في إبلاغنا — نحدّث القاعدة بانتظام للحفاظ على أوثق دليل للمشهد الإذاعي المغربي.</p>
          </>
        ) : (
          <>
            <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">Comment fonctionnent les fréquences radio FM au Maroc ?</h2>
            <p>La <strong>radio FM</strong> utilise une bande allant de <strong>87.5 MHz à 108.0 MHz</strong>, dans laquelle chaque station se voit attribuer un canal précis par la <strong>HACA</strong>, l'organisme régulateur de l'audiovisuel marocain. L'écart minimal entre deux stations voisines est généralement de 0.4 MHz pour éviter les interférences.</p>
            <p>La portée d'un émetteur FM dépend de sa puissance, de la hauteur de l'antenne, du relief et de la météo. C'est pourquoi <strong>une même radio change de fréquence d'une ville à l'autre</strong> : Hit Radio émet sur <em>95.4 MHz à Casablanca</em>, <em>92.5 MHz à Rabat</em>, <em>91.8 MHz à Marrakech</em> et <em>96.7 MHz à Tanger</em>.</p>

            <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">Comment trouver une radio au Maroc ?</h2>
            <p>La plus simple : consultez notre annuaire ci-dessus, sélectionnez votre ville et accédez au tableau complet des fréquences. Si votre récepteur dispose d'un « scan automatique », parcourez la bande FM — les stations détectées s'enregistrent dans la mémoire de l'appareil.</p>
            <p>Pour éviter les variations de fréquence entre villes, ou écouter depuis l'étranger, le <strong>streaming en ligne</strong> est la solution la plus fiable. Notre site centralise les flux officiels de toutes les grandes radios marocaines en haute qualité (jusqu'à 256 kbps en HLS HD), 24 h / 24.</p>

            <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">Pourquoi les fréquences changent-elles selon la ville ?</h2>
            <p>La planification FM est confiée à la HACA, qui attribue les canaux selon la géographie et l'évitement des interférences. Une radio nationale comme <strong>Médi 1</strong>, <strong>Hit Radio</strong> ou <strong>Chada FM</strong> utilise donc une fréquence différente dans chaque agglomération.</p>
            <p>Pour les <strong>auditeurs en déplacement</strong>, il est utile de mémoriser deux ou trois fréquences locales par grande ville, ou de basculer sur le streaming via 4G/5G — qui conserve la même URL de flux indépendamment du lieu.</p>

            <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">L'importance des radios locales au Maroc</h2>
            <p>Au-delà des grandes radios privées, le paysage comprend des <strong>radios régionales</strong> essentielles : <em>Marrakech Plus</em>, <em>Radio Plus Agadir</em>, <em>Radio Atbir</em> (tachelhit), les radios régionales de la SNRT à Tétouan, Oujda, Laâyoune, Béni Mellal, Nador — qui informent en darija, amazigh et hassani selon les régions.</p>
            <p>Pour les MRE, connaître la fréquence FM de leur ville d'origine est utile lors des retours estivaux. Cette page recense la carte sonore des grandes villes et la liste à jour des canaux FM.</p>

            <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">Sources et fiabilité des données</h2>
            <p>Notre base agrège les données officielles de la HACA, les sites des stations, ainsi que des relevés FM (OnlineRadioBox, radio-locator). Pour les grandes villes, les fréquences sont confirmées ; pour les plus petites, certaines sont signalées « approximatives » lorsqu'elles n'ont pu être vérifiées sur deux sources.</p>
            <p>Si vous constatez une erreur, signalez-la-nous — nous mettons à jour la base régulièrement pour conserver l'annuaire le plus fiable du paysage radiophonique marocain.</p>
          </>
        )}
      </section>

      <section className="mt-12 glass rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold mb-4">
          {isAr ? 'كل المدن المغطّاة' : 'Toutes les villes couvertes'}
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
          {cities.map((c) => (
            <li key={c.key}>
              <Link to={`${arPrefix}/frequence-radio-${c.key}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass hover:bg-white/8 text-white/80 hover:text-white transition-colors">
                <Radio className="h-3 w-3 text-brand-300" />
                {cityName(c)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </motion.article>
  );
}
