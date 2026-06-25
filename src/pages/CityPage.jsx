import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import RadioCard from '../components/RadioCard.jsx';
import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import { useAppContext } from '../AppContext.jsx';
import useI18n from '../i18n/useI18n.js';

const SITE_URL = 'https://radiolive.ma';

/**
 * Page ville générique (copie SEO + stations taggées par ville), bilingue FR/AR.
 * Routes : /radio-<ville> et /ar/radio-<ville> (App.jsx).
 */
const CITY_DATA = {
  casablanca: {
    name: 'Casablanca',
    name_ar: 'الدار البيضاء',
    title: 'Radio Casablanca en direct — Toutes les radios FM de Casa',
    title_ar: 'راديو الدار البيضاء مباشر — كل إذاعات FM بكازا',
    intro:
      "Casablanca, capitale économique du Maroc, est aussi le cœur battant du paysage radiophonique national. La majorité des grandes radios privées y ont leurs studios et y diffusent leurs principales fréquences FM.",
    intro_ar:
      'الدار البيضاء، العاصمة الاقتصادية للمغرب، هي أيضاً القلب النابض للمشهد الإذاعي الوطني. تتّخذ أغلب كبرى الإذاعات الخاصة منها مقرّاً لأستوديوهاتها وتبثّ بها تردداتها FM الرئيسية.',
    keyStations: ['hit-radio', 'radio-mars', 'medradio', 'cap-radio', 'atlantic-radio', 'skyrock-casablanca', 'medinafm', 'mfm', 'chada-fm'],
    blocks: [
      {
        h2: 'Les radios FM les plus écoutées à Casablanca',
        h2_ar: 'أكثر إذاعات FM استماعاً بالدار البيضاء',
        p: "À Casablanca, les ondes FM sont densément peuplées. Hit Radio (95.4 MHz) reste la première radio musicale auprès des 15-35 ans avec son slogan « Ma vie, ma radio ». Radio Mars (88.0 MHz) domine le créneau sportif avec ses retransmissions live des matchs de la Botola Pro et des grands rendez-vous internationaux. Chada FM, MFM et Medradio se partagent l'audience musicale grand public avec leurs sélections variétés arabes et hits internationaux. Côté économie, Cap Radio et Atlantic Radio offrent un programme premium destiné aux décideurs et aux entrepreneurs.",
        p_ar: 'بالدار البيضاء، موجات FM مكتظّة. تبقى هيت راديو (95.4) الإذاعة الموسيقية الأولى لدى الفئة 15-35 سنة بشعارها «حياتي، راديوي». وتتصدّر راديو مارس (88.0) الخانة الرياضية بنقلها المباشر لمباريات البطولة الاحترافية والمواعيد الدولية الكبرى. وتتقاسم شدى إف إم وMFM وMedradio الجمهور الموسيقي العريض بمنوّعاتها العربية ونجاحاتها الدولية. أما اقتصاديّاً، فتقدّم كاب راديو وأتلانتيك راديو برمجة متميّزة موجَّهة لصنّاع القرار والمقاولين.',
      },
      {
        h2: 'Pourquoi écouter la radio de Casablanca en streaming ?',
        h2_ar: 'لماذا الاستماع إلى إذاعة الدار البيضاء عبر البث؟',
        p: "Pour les Casablancais en déplacement, les expatriés ou les visiteurs, le streaming permet de garder le lien avec sa ville. Les radios casablancaises diffusent toute la journée des informations locales (trafic urbain, événements culturels, programmation des stades), de la musique marocaine et internationale, des débats sur l'actualité économique et politique. La qualité du flux internet est généralement supérieure à la FM grâce aux encodages MP3 128 kbps et HLS HD pour les diffuseurs publics comme Radio 2M.",
        p_ar: 'بالنسبة للبيضاويين المتنقّلين والمغتربين والزوار، يتيح البثّ الحفاظ على الصلة بالمدينة. تبثّ إذاعات كازا طيلة اليوم أخباراً محلية (حركة السير، الأحداث الثقافية، برمجة الملاعب) وموسيقى مغربية وعالمية ونقاشات حول الشأن الاقتصادي والسياسي. وغالباً ما تكون جودة التدفّق عبر الإنترنت أعلى من FM بفضل ترميز MP3 وHLS عالي الجودة لدى المؤسّسات العمومية مثل راديو 2M.',
      },
      {
        h2: 'Histoire radio à Casablanca',
        h2_ar: 'تاريخ الإذاعة بالدار البيضاء',
        p: "Casablanca a été le berceau de la radio commerciale au Maroc. La libéralisation des ondes en 2006 a permis à des entrepreneurs locaux comme Younes Boumehdi (Hit Radio Group) de lancer des radios privées qui ont profondément modernisé le paysage médiatique. Aujourd'hui, la ville compte plus de 15 fréquences FM actives, dont une majorité ont leur siège dans les quartiers de Maârif, Ain Diab ou les zones d'affaires de Sidi Maârouf.",
        p_ar: 'كانت الدار البيضاء مهد الإذاعة التجارية بالمغرب. وقد أتاح تحرير الموجات سنة 2006 لمقاولين محلّيين مثل يونس بومهدي (Hit Radio Group) إطلاق إذاعات خاصة جدّدت بعمق المشهد الإعلامي. واليوم تضمّ المدينة أكثر من 15 تردد FM نشطاً، أغلب مقرّاتها بأحياء المعاريف وعين الذئاب ومناطق الأعمال بسيدي معروف.',
      },
    ],
  },
  rabat: {
    name: 'Rabat',
    name_ar: 'الرباط',
    title: 'Radio Rabat en direct — Stations FM de la capitale',
    title_ar: 'راديو الرباط مباشر — إذاعات FM بالعاصمة',
    intro:
      "Rabat, capitale politique et administrative du Maroc, abrite les sièges des grandes institutions médiatiques publiques : la SNRT, le groupe 2M, ainsi que des radios institutionnelles et culturelles. Le paysage radiophonique de Rabat est plus institutionnel, plus posé, avec une forte présence des chaînes nationales.",
    intro_ar:
      'الرباط، العاصمة السياسية والإدارية للمغرب، تحتضن مقرّات كبرى المؤسّسات الإعلامية العمومية: SNRT ومجموعة 2M، إضافة إلى إذاعات مؤسّساتية وثقافية. مشهدها الإذاعي أكثر مؤسّساتيةً ورزانةً، بحضور قوي للقنوات الوطنية.',
    keyStations: ['radio-2m', 'medi-1-radio', 'medi-1-classique', 'medi-1-radio-andalouse', 'qoran-radio'],
    blocks: [
      {
        h2: 'Les radios publiques et institutionnelles à Rabat',
        h2_ar: 'الإذاعات العمومية والمؤسّساتية بالرباط',
        p: "Radio 2M, adossée à la deuxième chaîne télévisée du royaume, diffuse depuis Aïn Sebaâ et est captée à Rabat sur la FM. La radio publique SNRT (Al Idaâ Al Wataniya, Chaîne Inter, Mohammed VI du Saint Coran) a ses studios historiques à Rabat. Médi 1 Radio, dont les bureaux principaux sont à Tanger, dispose également d'antennes à Rabat. Pour la musique classique, Médi 1 Classique est un programme thématique très apprécié des auditeurs urbains de la capitale.",
        p_ar: 'راديو 2M، المرتبطة بالقناة الثانية، تُلتقط بالرباط على FM. وللإذاعة العمومية SNRT (الإذاعة الوطنية، القناة الدولية، محمد السادس للقرآن الكريم) أستوديوهاتها التاريخية بالرباط. كما تتوفّر ميدي1 راديو، التي يوجد مقرّها الرئيسي بطنجة، على هوائيات بالرباط. ولعشّاق الموسيقى الكلاسيكية، تُعدّ ميدي 1 كلاسيك برنامجاً موضوعاتيّاً محبوباً لدى جمهور العاصمة الحضري.',
      },
      {
        h2: 'Une radio marocaine à l\'écoute de la capitale',
        h2_ar: 'إذاعة مغربية على إيقاع العاصمة',
        p: "L'auditeur de Rabat trouve dans le streaming l'occasion d'accéder à des radios spécialisées qui ne sont pas toujours sur la FM locale : Médi 1 Radio Andalouse pour les amateurs de nouba marocaine, Yabiladi Chaabi Maroc pour la musique populaire, ou Radio Coran pour les programmes religieux. Les ministères, les universités, les administrations sont des auditeurs réguliers des radios économiques et d'information continue.",
        p_ar: 'يجد مستمع الرباط في البثّ فرصة للوصول إلى إذاعات متخصّصة لا تتوفّر دائماً على FM المحلية: ميدي 1 الأندلسية لعشّاق النوبة المغربية، ويا بلادي شعبي المغرب للموسيقى الشعبية، وإذاعة القرآن الكريم للبرامج الدينية. والوزارات والجامعات والإدارات مستمعون منتظمون للإذاعات الاقتصادية والإخبارية.',
      },
      {
        h2: 'Vivre Rabat en musique',
        h2_ar: 'عِش الرباط على إيقاع الموسيقى',
        p: "Rabat est aussi une ville culturelle, hôte du Festival Mawazine — Rythmes du Monde, l'un des plus grands festivals d'Afrique. Pendant ce festival, toutes les radios musicales du pays diffusent en direct depuis l'OLM Souissi et les autres scènes. Notre site permet de retrouver ces grandes émissions toute l'année en streaming.",
        p_ar: 'الرباط مدينة ثقافية أيضاً، تحتضن مهرجان موازين – إيقاعات العالم، أحد أكبر مهرجانات إفريقيا. وخلال هذا المهرجان، تبثّ كل الإذاعات الموسيقية الوطنية مباشرة من أولمب السويسي والمنصات الأخرى. ويتيح موقعنا استعادة هذه الحصص الكبرى طيلة السنة عبر البثّ.',
      },
    ],
  },
  marrakech: {
    name: 'Marrakech',
    name_ar: 'مراكش',
    title: 'Radio Marrakech en direct — Toutes les FM de la ville ocre',
    title_ar: 'راديو مراكش مباشر — كل إذاعات المدينة الحمراء',
    intro:
      "Marrakech, capitale touristique du Maroc, dispose d'un paysage radiophonique propre, où la radio régionale Marrakech Plus côtoie les grandes chaînes nationales captées en FM. La ville ocre attire des millions de visiteurs et possède une scène musicale vivante (gnaoua, andalouse, festivals).",
    intro_ar:
      'مراكش، العاصمة السياحية للمغرب، تتوفّر على مشهد إذاعي خاص، حيث تتجاور الإذاعة الجهوية مراكش بلوس مع كبرى القنوات الوطنية المُلتقطة على FM. تجذب المدينة الحمراء ملايين الزوار وتملك مشهداً موسيقيّاً حيّاً (كناوة، أندلسي، مهرجانات).',
    keyStations: ['marrakech-plus', 'medi-1-radio-andalouse', 'medi-1-tarab', 'chada-fm', 'hit-radio'],
    blocks: [
      {
        h2: 'Marrakech Plus, la radio locale de la ville rouge',
        h2_ar: 'مراكش بلوس، الإذاعة المحلية للمدينة الحمراء',
        p: "Marrakech Plus est la principale radio régionale de Marrakech. Sa programmation conjugue actualité locale (vie de la ville, événements culturels, festivals comme le Festival International du Film de Marrakech), musique marocaine et orientale, et magazines de proximité. Une radio essentielle pour les Marrakchis et les visiteurs de la cité impériale, à écouter facilement en streaming depuis notre site.",
        p_ar: 'مراكش بلوس هي الإذاعة الجهوية الرئيسية بمراكش. تجمع برمجتها بين الأخبار المحلية (حياة المدينة، الأحداث الثقافية، مهرجانات مثل المهرجان الدولي للفيلم بمراكش)، والموسيقى المغربية والشرقية، والمجلات القريبة. إذاعة أساسية للمراكشيين وزوّار المدينة، يسهل الاستماع إليها عبر البثّ من موقعنا.',
      },
      {
        h2: 'Musique gnaoua et radios à Marrakech',
        h2_ar: 'موسيقى كناوة والإذاعات بمراكش',
        p: "Marrakech est l'un des hauts lieux de la musique gnaoua, héritière du syncrétisme africain. Si aucune radio ne se consacre exclusivement à ce genre, plusieurs programmes (Médi 1 Tarab, MFM) lui font régulièrement la part belle. Notre catalogue de radios marocaines en ligne permet de découvrir toutes ces musiques traditionnelles depuis n'importe quel point du globe.",
        p_ar: 'مراكش من أبرز معاقل موسيقى كناوة، وريثة التمازج الإفريقي. ورغم غياب إذاعة مخصّصة حصريّاً لهذا النوع، تفسح عدة برامج (ميدي 1 طرب، MFM) له مكانة منتظمة. ويتيح كتالوجنا للإذاعات المغربية على الإنترنت اكتشاف كل هذه الموسيقى التقليدية من أي مكان في العالم.',
      },
      {
        h2: 'Pourquoi le streaming est idéal à Marrakech',
        h2_ar: 'لماذا البثّ مثالي بمراكش',
        p: "Avec un afflux touristique permanent et une couverture FM parfois inégale dans certains riads ou hôtels, le streaming offre une alternative fiable pour les locaux comme pour les visiteurs. Les grandes chaînes nationales (Hit Radio, Chada FM, Medi 1) sont accessibles en haute qualité, et nos pages dédiées par radio fournissent une présentation complète de chaque station.",
        p_ar: 'مع تدفّق سياحي دائم وتغطية FM متفاوتة أحياناً في بعض الرياضات والفنادق، يوفّر البثّ بديلاً موثوقاً للسكان والزوار. تتاح كبرى القنوات الوطنية (هيت راديو، شدى إف إم، ميدي1) بجودة عالية، وتقدّم صفحاتنا المخصّصة لكل إذاعة عرضاً كاملاً لكل محطة.',
      },
    ],
  },
  tanger: {
    name: 'Tanger',
    name_ar: 'طنجة',
    title: 'Radio Tanger en direct — La radio du nord du Maroc',
    title_ar: 'راديو طنجة مباشر — إذاعة شمال المغرب',
    intro:
      "Tanger, ville-monde du nord marocain, est historiquement liée à la radio. C'est en effet à Tanger, en 1980, qu'a été créée Médi 1 Radio, la grande radio bilingue franco-arabe du Maghreb. La ville vit au rythme des ondes méditerranéennes et bénéficie de sa proximité avec l'Espagne et l'Europe.",
    intro_ar:
      'طنجة، مدينة-العالم بشمال المغرب، مرتبطة تاريخيّاً بالإذاعة. فبها تأسست سنة 1980 ميدي1 راديو، الإذاعة الكبرى الثنائية اللغة عربية-فرنسية بالمغرب الكبير. تعيش المدينة على إيقاع الموجات المتوسطية وتستفيد من قربها من إسبانيا وأوروبا.',
    keyStations: ['medi-1-radio', 'medi-1-tarab', 'medi-1-classique', 'medi-1-radio-andalouse', 'medi-1-dj', 'hit-radio'],
    blocks: [
      {
        h2: 'Médi 1 Radio, la voix méditerranéenne de Tanger',
        h2_ar: 'ميدي1 راديو، الصوت المتوسطي لطنجة',
        p: "Médi 1 (Méditerranée Internationale) est probablement la radio la plus emblématique de Tanger. Créée en 1980 et basée dans la zone de Tanger Méditerranée, elle diffuse en grandes ondes et en FM sur tout le Maghreb (Maroc, Algérie, Tunisie, Libye, Mauritanie) et le sud de l'Europe. Sa grille combine éditions d'information toutes les heures, magazines politiques et économiques, débats culturels, et plusieurs flux musicaux thématiques (Tarab, Andalouse, Classique, DJ).",
        p_ar: 'ميدي1 (البحر الأبيض المتوسط الدولية) أيقونة طنجة الإذاعية. تأسست سنة 1980 ومقرّها بمنطقة طنجة المتوسط، تبثّ على الموجة الطويلة وعلى FM في كامل المغرب الكبير (المغرب، الجزائر، تونس، ليبيا، موريتانيا) وجنوب أوروبا. تجمع شبكتها بين نشرات إخبارية كل ساعة ومجلات سياسية واقتصادية ونقاشات ثقافية وعدة تدفّقات موسيقية (طرب، أندلسية، كلاسيك، دي جي).',
      },
      {
        h2: 'Tanger, ville d\'écoute multiculturelle',
        h2_ar: 'طنجة، مدينة استماع متعدّدة الثقافات',
        p: "Tanger est une ville carrefour, où se croisent les influences arabes, berbères, africaines et européennes. Cette diversité se retrouve dans les habitudes d'écoute de ses habitants : on y écoute autant Médi 1 en français qu'Hit Radio en darija ou Radio Coran en arabe classique. Notre catalogue regroupe l'ensemble de ces radios pour une écoute fluide et continue, avec un lecteur audio qui suit votre navigation sur le site.",
        p_ar: 'طنجة مدينة ملتقى تتقاطع فيها التأثيرات العربية والأمازيغية والإفريقية والأوروبية. وينعكس هذا التنوّع في عادات استماع سكانها: يستمعون إلى ميدي1 بالفرنسية كما إلى هيت راديو بالدارجة أو إذاعة القرآن بالعربية الفصحى. ويجمع كتالوجنا كل هذه الإذاعات لاستماع سلس ومتواصل، بمشغّل صوت يرافق تصفّحك للموقع.',
      },
      {
        h2: 'Tanger sur les ondes, du local à l\'international',
        h2_ar: 'طنجة على الموجات، من المحلي إلى الدولي',
        p: "Les Tangérois ont la particularité d'avoir accès aux radios espagnoles et françaises captées depuis l'autre rive. En complément, le streaming offre les radios marocaines et internationales arabes (Monte Carlo Doualiya) en haute qualité. C'est cette double appartenance qui rend Tanger unique dans le paysage radiophonique national.",
        p_ar: 'يتميّز الطنجاويون بإمكانية الوصول إلى الإذاعات الإسبانية والفرنسية المُلتقطة من الضفة الأخرى. وبالإضافة، يوفّر البثّ الإذاعات المغربية والعربية الدولية (مونت كارلو الدولية) بجودة عالية. وهذا الانتماء المزدوج هو ما يجعل طنجة فريدة في المشهد الإذاعي الوطني.',
      },
    ],
  },
  fes: {
    name: 'Fès',
    name_ar: 'فاس',
    title: 'Radio Fès en direct — Stations FM de la capitale spirituelle',
    title_ar: 'راديو فاس مباشر — إذاعات FM للعاصمة الروحية',
    intro:
      "Fès, capitale spirituelle et culturelle du Maroc, fondée en 789, abrite l'une des plus anciennes universités du monde (la Quaraouiyine). Cette ville millénaire vit au rythme des radios marocaines, avec une part importante de programmes religieux et culturels reflétant son héritage.",
    intro_ar:
      'فاس، العاصمة الروحية والثقافية للمغرب، المؤسَّسة سنة 789، تحتضن إحدى أقدم الجامعات في العالم (القرويين). تعيش هذه المدينة الألفية على إيقاع الإذاعات المغربية، بحصّة مهمّة من البرامج الدينية والثقافية تعكس إرثها.',
    keyStations: ['qoran-radio', 'al-quran-radio', 'radio-manarat', 'medi-1-radio-andalouse', 'medi-1-tarab', 'hit-radio'],
    blocks: [
      {
        h2: 'Radios religieuses et programmes coraniques à Fès',
        h2_ar: 'الإذاعات الدينية والبرامج القرآنية بفاس',
        p: "Fès, berceau de l'enseignement religieux malékite, est l'un des publics les plus attentifs aux radios coraniques. Radio Coran (Idaât Al Qor'an Al Karim), Al Quran Radio et Radio Manarat sont écoutées quotidiennement. Notre plateforme propose ces stations en streaming continu, avec récitations psalmodiées des plus grands lecteurs (Sudais, Shuraim, Mishary Al-Afasy, Maher Al-Mu'aiqly), leçons de tafsir et conférences d'oulémas.",
        p_ar: 'فاس، مهد التعليم الديني المالكي، من أكثر الجماهير إنصاتاً للإذاعات القرآنية. تُستمع يوميّاً إذاعة القرآن الكريم وراديو القرآن الكريم وراديو منارات. وتقدّم منصّتنا هذه المحطات بثّاً متواصلاً، بتلاوات مرتّلة لأكبر القرّاء (السديس، الشريم، مشاري العفاسي، ماهر المعيقلي)، ودروس تفسير ومحاضرات علماء.',
      },
      {
        h2: 'La musique andalouse, patrimoine fassi sur les ondes',
        h2_ar: 'الموسيقى الأندلسية، تراث فاسي على الموجات',
        p: "Fès est l'une des grandes capitales de la musique arabo-andalouse, héritage de la chute de Grenade. La nouba marocaine y a été préservée par des conservatoires comme celui de la Quaraouiyine. Médi 1 Radio Andalouse, programme musical de Médi 1, diffuse en continu ce répertoire raffiné. Une radio essentielle pour tous les amateurs de la grande tradition musicale savante du Maghreb.",
        p_ar: 'فاس من كبرى عواصم الموسيقى العربية الأندلسية، إرث سقوط غرناطة. حُفظت النوبة المغربية بها في معاهد كمعهد القرويين. وتبثّ ميدي 1 الأندلسية باستمرار هذه الذخيرة الرفيعة. إذاعة أساسية لكل عشّاق التقليد الموسيقي العالِم بالمغرب الكبير.',
      },
      {
        h2: 'Une ville d\'auditeurs en quête de sens',
        h2_ar: 'مدينة مستمعين باحثين عن المعنى',
        p: "Le public fassi cherche dans la radio à la fois la spiritualité, la culture et la modernité. C'est pourquoi notre site propose un large spectre allant des radios religieuses aux stations musicales contemporaines en passant par les chaînes d'information. La sticky-search sur la page d'accueil permet de filtrer instantanément parmi les 35 stations disponibles.",
        p_ar: 'يبحث الجمهور الفاسي في الإذاعة عن الروحانية والثقافة والحداثة معاً. لذا يقدّم موقعنا طيفاً واسعاً من الإذاعات الدينية إلى المحطات الموسيقية المعاصرة مروراً بالقنوات الإخبارية. ويتيح البحث الفوري في الصفحة الرئيسية التصفية لحظيّاً بين المحطات المتاحة.',
      },
    ],
  },
  agadir: {
    name: 'Agadir',
    name_ar: 'أكادير',
    title: 'Radio Agadir en direct — Stations FM du Souss',
    title_ar: 'راديو أكادير مباشر — إذاعات FM بسوس',
    intro:
      "Agadir, capitale du Souss et grande ville balnéaire du Maroc, dispose de plusieurs radios régionales reflétant la culture amazighe et l'identité du sud du royaume. Radio Plus Agadir, Radio Atbir et Radio Achkid FM diffusent une programmation ancrée dans la vie locale, en darija et en tachelhit.",
    intro_ar:
      'أكادير، عاصمة سوس والمدينة الشاطئية الكبرى بالمغرب، تتوفّر على عدة إذاعات جهوية تعكس الثقافة الأمازيغية وهوية جنوب المملكة. تبثّ راديو بلوس أكادير وراديو أتبير وراديو أشكيد إف إم برمجة متجذّرة في الحياة المحلية، بالدارجة والتاشلحيت.',
    keyStations: ['radio-plus-agadir', 'radio-atbir', 'radio-achkid-fm', 'yabiladi-azawan-amazigh', 'medi-1-radio'],
    blocks: [
      {
        h2: 'Les radios amazighes du Souss',
        h2_ar: 'الإذاعات الأمازيغية بسوس',
        p: "La région d'Agadir est un haut lieu de la culture amazighe au Maroc. Plusieurs radios — Radio Atbir, Radio Achkid FM, Yabiladi Azawan Amazigh — diffusent en tachelhit et mettent à l'honneur la musique amazighe traditionnelle (ahidous, ahouach, izlan, raïs) ainsi que les nouvelles générations d'artistes. Le streaming permet à la diaspora soussie en Europe d'accéder à ces programmes en direct.",
        p_ar: 'جهة أكادير معقل كبير للثقافة الأمازيغية بالمغرب. تبثّ عدة إذاعات — راديو أتبير، راديو أشكيد إف إم، يا بلادي أزوان أمازيغ — بالتاشلحيت وتُبرز الموسيقى الأمازيغية التقليدية (أحيدوس، أحواش، إزلان، رّوايس) والأجيال الجديدة من الفنانين. ويتيح البثّ للجالية السوسية بأوروبا الوصول إلى هذه البرامج مباشرة.',
      },
      {
        h2: 'Radio Plus Agadir, la radio régionale du sud',
        h2_ar: 'راديو بلوس أكادير، الإذاعة الجهوية للجنوب',
        p: "Radio Plus Agadir est la radio régionale de référence du Souss et diffuse principalement dans le sud du royaume (Agadir, Inezgane, Taroudant, Tiznit). Sa programmation combine variétés arabes, musique amazighe, informations régionales et magazines culturels. Très ancrée dans la vie locale, c'est l'une des radios les plus écoutées d'Agadir et de sa région.",
        p_ar: 'راديو بلوس أكادير هي الإذاعة الجهوية المرجعية بسوس، تبثّ أساساً في جنوب المملكة (أكادير، إنزكان، تارودانت، تزنيت). تجمع برمجتها بين المنوّعات العربية والموسيقى الأمازيغية والأخبار الجهوية والمجلات الثقافية. متجذّرة في الحياة المحلية، وهي من أكثر الإذاعات استماعاً بأكادير وجهتها.',
      },
      {
        h2: 'Pourquoi écouter la radio d\'Agadir en streaming',
        h2_ar: 'لماذا الاستماع إلى إذاعة أكادير عبر البث',
        p: "Pour les Soussis en déplacement, les MRE originaires du sud, ou les visiteurs de la station balnéaire, le streaming offre la possibilité de rester en lien avec la culture du Souss. Les radios marocaines en ligne — qu'elles soient régionales ou nationales — sont accessibles 24 h / 24, sans inscription, et la qualité audio est généralement supérieure à la FM grâce aux flux MP3 et HLS.",
        p_ar: 'بالنسبة للسوسيين المتنقّلين، ومغاربة الجنوب بالمهجر، وزوّار المدينة الشاطئية، يتيح البثّ البقاء على صلة بثقافة سوس. والإذاعات المغربية على الإنترنت — جهوية كانت أو وطنية — متاحة على مدار الساعة دون تسجيل، وجودتها الصوتية غالباً أعلى من FM بفضل تدفّقات MP3 وHLS.',
      },
    ],
  },
};

export default function CityPage({ cityKey: cityKeyProp }) {
  const params = useParams();
  const cityKey = cityKeyProp || params.city;
  const { radios, audio, playRadio, isFavorite, toggleFavorite } = useAppContext();
  const { lang } = useI18n();
  const isAr = lang === 'ar';
  const arPrefix = isAr ? '/ar' : '';
  const data = CITY_DATA[cityKey];
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
        <h2 className="font-display text-2xl font-bold mb-2">{isAr ? 'مدينة غير معروفة' : 'Ville inconnue'}</h2>
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
          ? `كل إذاعات ${name} مباشرة ومجاناً. ${data.intro_ar.slice(0, 130)}…`
          : `Toutes les radios de ${data.name} en direct gratuitement. ${data.intro.slice(0, 130)}…`}
        canonical={`${SITE_URL}${arPrefix}/radio-${cityKey}`}
        alternates={[
          { hreflang: 'fr-MA', href: `${SITE_URL}/radio-${cityKey}` },
          { hreflang: 'ar-MA', href: `${SITE_URL}/ar/radio-${cityKey}` },
          { hreflang: 'x-default', href: `${SITE_URL}/radio-${cityKey}` },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: isAr ? 'الرئيسية' : 'Accueil', url: isAr ? '/ar' : '/' },
          { name: isAr ? 'إذاعات حسب المدينة' : 'Radios par ville', url: isAr ? '/ar' : '/' },
          { name },
        ])}
      />

      <Link to={isAr ? '/ar' : '/'} className="text-sm text-white/60 hover:text-white">{isAr ? '→ العودة' : '← Retour'}</Link>

      <h1 className="font-display text-3xl sm:text-5xl font-bold mt-6 mb-6 text-balance">
        {isAr ? 'راديو' : 'Radio'} <span className="gradient-text">{name}</span> {isAr ? 'مباشر' : 'en direct'}
      </h1>

      <p className="text-white/80 text-lg leading-relaxed mb-10">{tx(data.intro, data.intro_ar)}</p>

      {stations.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-5">
            {isAr ? `إذاعات للاستماع في ${name}` : `Les radios à écouter à ${data.name}`}
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
        <h2 className="font-display text-xl font-semibold mb-4">{isAr ? 'اكتشف مدناً أخرى' : "Découvrir d'autres villes"}</h2>
        <div className="flex flex-wrap gap-2">
          {Object.keys(CITY_DATA)
            .filter((k) => k !== cityKey)
            .map((k) => (
              <Link
                key={k}
                to={`${arPrefix}/radio-${k}`}
                className="px-4 py-2 rounded-full glass text-sm hover:bg-white/10 transition-colors"
              >
                {isAr ? `راديو ${CITY_DATA[k].name_ar}` : `Radio ${CITY_DATA[k].name}`}
              </Link>
            ))}
        </div>
      </section>
    </article>
  );
}
