import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import RadioCard from '../components/RadioCard.jsx';
import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import { useAppContext } from '../AppContext.jsx';
import useI18n from '../i18n/useI18n.js';

const SITE_URL = 'https://radiolive.ma';

const GENRE_DATA = {
  chaabi: {
    name: 'Chaabi',
    name_ar: 'الشعبي',
    title: 'Radio Maroc Chaabi en direct — Musique populaire marocaine',
    title_ar: 'راديو المغرب شعبي مباشر — الموسيقى الشعبية المغربية',
    intro:
      "Le chaabi est l'âme musicale populaire du Maroc. Né dans les rues de Casablanca, Fès et Marrakech au XXᵉ siècle, ce genre puise dans le mawal, la aïta, la hayha et les rythmes des fêtes de mariage pour offrir une musique festive, dansante et profondément ancrée dans la culture marocaine.",
    intro_ar:
      'الشعبي هو الروح الموسيقية الشعبية للمغرب. وُلد في شوارع الدار البيضاء وفاس ومراكش في القرن العشرين، ويستلهم من المواويل والعيطة والحايحة وإيقاعات الأعراس ليقدّم موسيقى احتفالية راقصة متجذّرة في الثقافة المغربية.',
    keyStations: ['zine-bladi', 'yabiladi-chaabi-maroc', 'medi-1-tarab', 'mfm', 'radio-aswat'],
    blocks: [
      {
        h2: 'Qu\'est-ce que le chaabi marocain ?',
        h2_ar: 'ما هو الشعبي المغربي؟',
        p: "Le chaabi (de l'arabe sha'bī, « populaire ») désigne la musique populaire urbaine du Maroc. Il se distingue par ses rythmes entraînants, ses textes accessibles, ses thèmes proches du quotidien et sa fonction festive — c'est par excellence la musique des mariages, des fêtes de famille et des célébrations. On distingue plusieurs sous-genres : le chaabi des grandes villes, l'aïta du Doukkala-Abda, la hayha du Tafilalet, le rwais soussi, le malhoun de Meknès et Fès. Chaque région a ses maîtres et son répertoire.",
        p_ar: 'الشعبي (من «شعبي») يدلّ على الموسيقى الشعبية الحضرية بالمغرب. يتميّز بإيقاعاته الحماسية ونصوصه القريبة ووظيفته الاحتفالية — فهو بامتياز موسيقى الأعراس والحفلات العائلية. وتتفرّع منه أنواع: شعبي المدن الكبرى، والعيطة بدكالة-عبدة، والحايحة بتافيلالت، والرّوايس بسوس، والملحون بمكناس وفاس. لكل جهة معلّموها وذخيرتها.',
      },
      {
        h2: 'Les radios chaabi marocaines en streaming',
        h2_ar: 'إذاعات الشعبي المغربية عبر البث',
        p: "Plusieurs radios marocaines diffusent du chaabi 24 h / 24. Zine Bladi est la radio chaabi par excellence : sa programmation met à l'honneur les grands maîtres comme Stati, Daoudi, Najat Aâtabou, Senhaji, ainsi que les nouvelles générations qui modernisent ce patrimoine vivant. Yabiladi Chaabi Maroc, programme de la radio Yabiladi, diffuse sans interruption les classiques et nouveautés de la musique populaire urbaine. Medi 1 Tarab propose un programme plus orienté vers la grande chanson arabe classique, mais inclut régulièrement des plages de chaabi marocain.",
        p_ar: 'تبثّ عدة إذاعات مغربية الشعبي على مدار الساعة. زين بلادي هي إذاعة الشعبي بامتياز، تُبرز كبار المعلّمين مثل الستاتي والداودي ونجاة عتابو والصنهاجي، إلى جانب الأجيال الجديدة التي تجدّد هذا التراث الحيّ. ويا بلادي شعبي المغرب تبثّ دون انقطاع كلاسيكيات ونجاحات الموسيقى الشعبية الحضرية. كما تخصّص ميدي 1 طرب فقرات للشعبي إلى جانب الطرب العربي الكلاسيكي.',
      },
      {
        h2: 'L\'aïta et la hayha, racines du chaabi',
        h2_ar: 'العيطة والحايحة، جذور الشعبي',
        p: "L'aïta (« cri ») est une forme de chaabi rural propre aux régions de Doukkala, Abda, Chaouia et Rehamna. Chantée par des troupes (les chioukhs et chikhates), elle traite de l'amour, du deuil, de la satire sociale ou des grands événements historiques. La hayha, plus présente dans le sud-est, est un chant collectif sur des rythmes hypnotiques. Ces musiques racines, longtemps dévalorisées, sont aujourd'hui célébrées comme un patrimoine immatériel précieux et diffusées sur plusieurs radios marocaines en ligne.",
        p_ar: 'العيطة («الصرخة») شكل من الشعبي القروي خاص بمناطق دكالة وعبدة والشاوية والرحامنة. تؤدّيها فرق (الشيوخ والشيخات) وتتناول الحب والفقد والنقد الاجتماعي والأحداث التاريخية الكبرى. أما الحايحة، الأكثر حضوراً بالجنوب الشرقي، فهي غناء جماعي على إيقاعات منوّمة. هذه الموسيقى الجذور، التي طال تهميشها، تُحتفى بها اليوم كتراث لا مادي ثمين وتُبثّ على عدة إذاعات مغربية على الإنترنت.',
      },
      {
        h2: 'Pourquoi écouter le chaabi en streaming',
        h2_ar: 'لماذا الاستماع إلى الشعبي عبر البث',
        p: "Pour la diaspora marocaine, le chaabi est un lien direct avec le pays d'origine — la musique des mariages familiaux, des aïds, des moments de vie. Le streaming permet d'accéder en HD à toutes ces stations depuis n'importe où dans le monde. Notre catalogue regroupe plus de 50 radios marocaines, dont les principales radios chaabi, dans une expérience moderne et fluide.",
        p_ar: 'بالنسبة للجالية المغربية، الشعبي صلة مباشرة ببلد الأصل — موسيقى الأعراس العائلية والأعياد ولحظات الحياة. ويُتيح البثّ الوصول بجودة عالية إلى كل هذه المحطات من أي مكان في العالم. يجمع كتالوجنا أزيد من 50 إذاعة مغربية، ومنها أبرز إذاعات الشعبي، في تجربة عصرية وسلسة.',
      },
    ],
  },
  hit: {
    name: 'Hit',
    name_ar: 'هيت',
    title: 'Radio Maroc Hit en direct — Musique pop et hits internationaux',
    title_ar: 'راديو المغرب هيت مباشر — بوب ونجاحات عالمية',
    intro:
      "Les radios musicales marocaines de format « hits » sont devenues le rendez-vous incontournable du jeune public. Elles diffusent les tubes du moment, mêlent pop internationale, R&B, hip-hop et grandes voix marocaines, et accompagnent des millions d'auditeurs au quotidien.",
    intro_ar:
      'صارت الإذاعات الموسيقية المغربية ذات صيغة «النجاحات» الموعد المفضّل للجمهور الشاب. تبثّ نجاحات اللحظة، وتمزج البوب العالمي والـR&B والهيب هوب وكبار الأصوات المغربية، وترافق ملايين المستمعين يومياً.',
    keyStations: ['hit-radio', 'mfm', 'medradio', 'chada-fm', 'medina-fm', 'radio-aswat', 'skyrock-casablanca'],
    blocks: [
      {
        h2: 'Hit Radio, leader du format jeune au Maroc',
        h2_ar: 'هيت راديو، رائدة الصيغة الشابة بالمغرب',
        p: "Hit Radio est la radio musicale n° 1 du Maroc, lancée en 2006 par Younes Boumehdi. Avec son slogan « Ma vie, ma radio », elle s'adresse aux 15-35 ans avec une programmation 100 % hits internationaux pop, R&B, hip-hop, dance et grands artistes marocains contemporains. Diffusée sur plus de 25 fréquences FM (95.4 à Casablanca, 92.5 à Rabat, etc.), elle est désormais leader d'audience grâce à ses morning shows cultes (« Momo Show »), ses découvertes musicales et son fort engagement digital.",
        p_ar: 'هيت راديو هي الإذاعة الموسيقية رقم 1 بالمغرب، أُطلقت سنة 2006 على يد يونس بومهدي. بشعارها «حياتي، راديوي»، تخاطب الفئة 15-35 سنة ببرمجة 100% نجاحات عالمية بوب وR&B وهيب هوب ودانس وكبار الفنانين المغاربة المعاصرين. تبثّ على أكثر من 25 تردد FM (95.4 بالدار البيضاء، 92.5 بالرباط…) وهي اليوم رائدة الاستماع بفضل برامجها الصباحية (Momo Show) واكتشافاتها الموسيقية وحضورها الرقمي القوي.',
      },
      {
        h2: 'MFM, Medradio et le Hit Radio Group',
        h2_ar: 'MFM وMedradio ومجموعة Hit Radio Group',
        p: "Hit Radio fait partie du Hit Radio Group, qui édite également MFM (radio musicale dédiée aux musiques afro-orientales : raï, chaabi, gnaoua, musique amazighe, pop arabe) et Medradio (variétés arabes et marocaines grand public). Ce groupe est devenu le premier acteur radio privé du pays, avec une couverture FM exceptionnelle et une présence digitale forte.",
        p_ar: 'تنتمي هيت راديو إلى مجموعة Hit Radio Group التي تضمّ كذلك MFM (مخصّصة للموسيقى الإفريقية-الشرقية: راي، شعبي، كناوة، أمازيغية، بوب عربي) وMedradio (منوّعات عربية ومغربية للجمهور العريض). صارت هذه المجموعة أول فاعل إذاعي خاص بالبلاد، بتغطية FM استثنائية وحضور رقمي قوي.',
      },
      {
        h2: 'Les autres radios hits marocaines',
        h2_ar: 'باقي إذاعات النجاحات المغربية',
        p: "Aux côtés du Hit Radio Group, d'autres stations occupent le segment des hits : Chada FM (variétés arabes pop), Aswat (variétés arabes et libano-égyptiennes), Medina FM (variétés et musique marocaine moderne), et Skyrock Casablanca (filiale de Skyrock France, format 100 % hip-hop / R&B). Ensemble, ces radios couvrent tous les goûts musicaux du jeune public marocain.",
        p_ar: 'إلى جانب المجموعة، تشغل محطات أخرى خانة النجاحات: شدى إف إم (منوّعات عربية بوب)، وأصوات (منوّعات عربية ولبنانية-مصرية)، ومدينة إف إم (منوّعات وأغنية مغربية حديثة)، وسكايروك كازابلانكا (فرع سكايروك فرنسا، صيغة 100% هيب هوب/R&B). معاً تغطّي هذه الإذاعات كل أذواق الجمهور الشاب المغربي.',
      },
      {
        h2: 'Écouter les hits en direct gratuitement',
        h2_ar: 'الاستماع إلى النجاحات مباشرة ومجاناً',
        p: "Notre site permet d'écouter en streaming HD toutes ces radios musicales marocaines, sans coupure publicitaire intrusive et sans inscription. Le lecteur audio Spotify-like suit votre navigation et vous donne accès à 30+ stations en un clic. Découvrez aussi notre page dédiée aux radios marocaines amazighes pour explorer une autre facette du paysage musical.",
        p_ar: 'يتيح موقعنا الاستماع بجودة عالية إلى كل هذه الإذاعات الموسيقية المغربية، دون فواصل إشهارية مزعجة ودون تسجيل. ويرافق مشغّل الصوت تصفّحك ويمنحك أكثر من 50 محطة بنقرة واحدة. اكتشف أيضاً صفحتنا المخصّصة للإذاعات المغربية الأمازيغية.',
      },
    ],
  },
  amazigh: {
    name: 'Amazigh',
    name_ar: 'أمازيغ',
    title: 'Radio Maroc Amazigh en direct — Musique et culture berbère',
    title_ar: 'راديو المغرب أمازيغي مباشر — موسيقى وثقافة أمازيغية',
    intro:
      "La culture amazighe (berbère) est l'une des composantes fondatrices de l'identité marocaine. Plusieurs radios diffusent en tachelhit, tamazight ou tarifit, et mettent à l'honneur la richesse musicale et culturelle des régions du Souss, du Rif et de l'Atlas.",
    intro_ar:
      'الثقافة الأمازيغية من المكوّنات المؤسِّسة للهوية المغربية. تبثّ عدة إذاعات بالتاشلحيت والتمازيغت والتاريفيت، وتُبرز الغنى الموسيقي والثقافي لجهات سوس والريف والأطلس.',
    keyStations: ['yabiladi-azawan-amazigh', 'radio-atbir', 'radio-achkid-fm', 'radio-plus-agadir'],
    blocks: [
      {
        h2: 'Les radios amazighes marocaines',
        h2_ar: 'الإذاعات الأمازيغية المغربية',
        p: "Le Maroc, dont la Constitution de 2011 a officialisé la langue amazighe, dispose d'un paysage radiophonique amazigh en plein développement. Yabiladi Azawan Amazigh est le flux musical amazigh de la radio Yabiladi : il diffuse en continu les musiques traditionnelles et modernes du Rif, du Souss et de l'Atlas — ahidous, ahouach, izlan, rwais, ainsi que les nouvelles générations. Radio Atbir (« la colombe ») et Radio Achkid FM, principalement en tachelhit, sont des radios régionales très populaires dans le Souss et au sud du royaume. Radio Plus Agadir, basée dans la capitale du Souss, propose également une part importante de programmes amazighs.",
        p_ar: 'يتوفّر المغرب، الذي رسّم دستوره سنة 2011 اللغة الأمازيغية، على مشهد إذاعي أمازيغي في تطوّر متواصل. يا بلادي أزوان أمازيغ هو التدفّق الموسيقي الأمازيغي لراديو يا بلادي، يبثّ باستمرار موسيقى الريف وسوس والأطلس التقليدية والحديثة — أحيدوس، أحواش، إزلان، رّوايس — إلى جانب الأجيال الجديدة. وراديو أتبير («الحمامة») وراديو أشكيد إف إم، أساساً بالتاشلحيت، إذاعتان جهويتان شعبيتان بسوس وجنوب المملكة. كما تقدّم راديو بلوس أكادير حيّزاً مهمّاً للبرامج الأمازيغية.',
      },
      {
        h2: 'Les genres musicaux amazighs',
        h2_ar: 'الأنواع الموسيقية الأمازيغية',
        p: "La musique amazighe marocaine est extraordinairement diverse : ahidous (Atlas central, danses collectives), ahouach (Atlas et Souss, festivités collectives), izlan (chants poétiques), rwais (troupes de musiciens errants du Souss, depuis le XIXᵉ siècle), reggada (Rif oriental, danse collective). Cette pluralité reflète la diversité des trois grands groupes linguistiques amazighs marocains : les Tachelhitophones (sud), les Tamazighophones (centre) et les Tarifitophones (nord-est).",
        p_ar: 'الموسيقى الأمازيغية المغربية متنوّعة للغاية: أحيدوس (الأطلس المتوسط، رقصات جماعية)، وأحواش (الأطلس وسوس، احتفالات جماعية)، وإزلان (أغانٍ شعرية)، ورّوايس (فرق موسيقيين متنقّلين بسوس منذ القرن التاسع عشر)، والركادة (الريف الشرقي). يعكس هذا التنوّع تعدّد المجموعات اللغوية الأمازيغية المغربية الثلاث: الناطقون بالتاشلحيت (الجنوب)، والتمازيغت (الوسط)، والتاريفيت (الشمال الشرقي).',
      },
      {
        h2: 'Une scène musicale moderne et engagée',
        h2_ar: 'مشهد موسيقي عصري وملتزم',
        p: "Au-delà du patrimoine, la musique amazighe s'est profondément modernisée avec des artistes comme Najat Aâtabou, Khalid Bouchnak, Massa Bouchafa, le groupe Imanaren, ou encore les nouvelles voix électro-pop. Les radios marocaines amazighes accompagnent cette modernisation et offrent une vitrine unique à ces artistes, qui ne trouvent pas toujours leur place sur les médias mainstream arabophones.",
        p_ar: 'أبعد من التراث، تطوّرت الموسيقى الأمازيغية بعمق مع فنانين مثل نجاة عتابو والمجموعات الجديدة وأصوات الإلكترو-بوب. وترافق الإذاعات المغربية الأمازيغية هذا التحديث وتمنح واجهة فريدة لهؤلاء الفنانين الذين لا يجدون دائماً مكانهم في الإعلام السائد الناطق بالعربية.',
      },
      {
        h2: 'Pour la diaspora amazighe',
        h2_ar: 'للجالية الأمازيغية',
        p: "La diaspora amazighe — particulièrement importante en Belgique, en France et aux Pays-Bas — utilise massivement le streaming pour rester connectée à sa culture d'origine. Notre site centralise les principales radios amazighes du Maroc, accessibles 24 h / 24 sans inscription depuis n'importe quel pays.",
        p_ar: 'تستعمل الجالية الأمازيغية — الكبيرة خاصة ببلجيكا وفرنسا وهولندا — البثّ بكثافة للبقاء على صلة بثقافتها الأصلية. يجمع موقعنا أبرز الإذاعات الأمازيغية المغربية، متاحة على مدار الساعة دون تسجيل ومن أي بلد.',
      },
    ],
  },
};

export default function GenrePage({ genreKey: genreKeyProp }) {
  const params = useParams();
  const genreKey = genreKeyProp || params.genre;
  const { radios, audio, playRadio, isFavorite, toggleFavorite } = useAppContext();
  const { lang } = useI18n();
  const isAr = lang === 'ar';
  const arPrefix = isAr ? '/ar' : '';
  const data = GENRE_DATA[genreKey];
  const tx = (fr, ar) => (isAr && ar ? ar : fr);

  const stations = useMemo(() => {
    if (!data) return [];
    return data.keyStations
      .map((id) => radios.find((r) => r.id === id))
      .filter(Boolean);
  }, [radios, data]);

  if (!data) {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <h2 className="font-display text-2xl font-bold mb-2">{isAr ? 'نوع غير معروف' : 'Genre inconnu'}</h2>
        <Link to={isAr ? '/ar' : '/'} className="btn-primary inline-flex">{isAr ? 'العودة إلى الرئيسية' : "Retour à l'accueil"}</Link>
      </div>
    );
  }

  const name = tx(data.name, data.name_ar);

  return (
    <article className="pt-6 sm:pt-10 pb-16 max-w-5xl mx-auto">
      <Seo
        lang={lang}
        title={tx(data.title, data.title_ar)}
        description={isAr
          ? `استمع إلى أفضل الإذاعات المغربية لموسيقى ${name} مباشرة. ${data.intro_ar.slice(0, 120)}…`
          : `Écoutez les meilleures radios marocaines de ${data.name.toLowerCase()} en direct. ${data.intro.slice(0, 120)}…`}
        canonical={`${SITE_URL}${arPrefix}/radio-maroc-${genreKey}`}
        alternates={[
          { hreflang: 'fr-MA', href: `${SITE_URL}/radio-maroc-${genreKey}` },
          { hreflang: 'ar-MA', href: `${SITE_URL}/ar/radio-maroc-${genreKey}` },
          { hreflang: 'x-default', href: `${SITE_URL}/radio-maroc-${genreKey}` },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: isAr ? 'الرئيسية' : 'Accueil', url: isAr ? '/ar' : '/' },
          { name: isAr ? 'إذاعات حسب النوع' : 'Radios par genre', url: isAr ? '/ar' : '/' },
          { name },
        ])}
      />

      <Link to={isAr ? '/ar' : '/'} className="text-sm text-white/60 hover:text-white">
        {isAr ? '→ العودة' : '← Retour'}
      </Link>

      <h1 className="font-display text-3xl sm:text-5xl font-bold mt-6 mb-6 text-balance">
        {isAr ? 'راديو المغرب' : 'Radio Maroc'} <span className="gradient-text">{name}</span>
      </h1>

      <p className="text-white/80 text-lg leading-relaxed mb-10">{tx(data.intro, data.intro_ar)}</p>

      {stations.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-5">
            {isAr ? 'محطات للاستماع' : 'Stations à écouter'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {stations.map((r) => (
              <RadioCard
                key={r.id}
                radio={r}
                isActive={audio.current?.id === r.id}
                isPlaying={audio.current?.id === r.id && audio.isPlaying}
                isFavorite={isFavorite(r.id)}
                onPlay={playRadio}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      <div className="prose-invert max-w-none text-white/75 leading-relaxed space-y-6">
        {data.blocks.map((b, i) => (
          <section key={i}>
            <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">{tx(b.h2, b.h2_ar)}</h2>
            <p>{tx(b.p, b.p_ar)}</p>
          </section>
        ))}
      </div>

      <section className="mt-12 glass rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold mb-4">{isAr ? 'أنواع موسيقية أخرى' : 'Autres genres musicaux'}</h2>
        <div className="flex flex-wrap gap-2">
          {Object.keys(GENRE_DATA)
            .filter((k) => k !== genreKey)
            .map((k) => (
              <Link key={k} to={`${arPrefix}/radio-maroc-${k}`}
                className="px-4 py-2 rounded-full glass text-sm hover:bg-white/10 transition-colors">
                {isAr ? `راديو المغرب ${GENRE_DATA[k].name_ar}` : `Radio Maroc ${GENRE_DATA[k].name}`}
              </Link>
            ))}
        </div>
      </section>
    </article>
  );
}
