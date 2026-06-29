/**
 * Source de vérité des articles d'actualité (page /info).
 *
 * RÈGLES ÉDITORIALES (câblées) :
 *   - Contenu 100% ORIGINAL — jamais de scraping/agrégation d'autres médias
 *     (pénalité « scaled content », droit d'auteur, refus AdSense).
 *   - Périmètre niche-adjacent UNIQUEMENT : radio, musique, sport, culture,
 *     tech audio, artistes, Maroc, international (angle musique/sport/médias).
 *   - INTERDIT : politique, religion, sujets sensibles/sexe.
 *
 * BRANCHER UNE SOURCE DYNAMIQUE PLUS TARD :
 *   La page consomme uniquement les sélecteurs ci-dessous (getRecent, etc.).
 *   Pour alimenter via RSS officiel ou génération IA éditée, il suffit de
 *   produire des objets au même schéma et de les concaténer à ARTICLES —
 *   aucun composant à modifier.
 *
 * Schéma article :
 *   { slug, slug_ar?, category, date, dateModified?, readingTime, author,
 *     image?, featured?, popular?, tags?,
 *     title, excerpt, body[],  title_ar?, excerpt_ar?, body_ar? }
 *
 * Blocs (mêmes helpers que le blog) :
 *   p(...kids) | h2(text) | h3(text) | ul(items) ; kids: string | b(text) | lnk(text,to)
 */

export const p = (...kids) => ({ type: 'p', kids });
export const h2 = (text) => ({ type: 'h2', text });
export const h3 = (text) => ({ type: 'h3', text });
export const ul = (items) => ({ type: 'ul', items });
export const b = (text) => ({ type: 'b', text });
export const lnk = (text, to) => ({ type: 'link', text, to });

/**
 * Catégories autorisées (sûres, non sensibles). `accent` = dégradé de
 * placeholder/pill, cohérent avec la palette du site.
 */
export const CATEGORIES = [
  { key: 'actualites',    fr: 'Actualités',    ar: 'أخبار',    accent: ['#7c4dff', '#38bdf8'] },
  { key: 'sport',         fr: 'Sport',         ar: 'رياضة',    accent: ['#10b981', '#06b6d4'] },
  { key: 'musique',       fr: 'Musique',       ar: 'موسيقى',   accent: ['#f43f5e', '#f59e0b'] },
  { key: 'radio',         fr: 'Radio',         ar: 'إذاعة',    accent: ['#FF2A3C', '#FF6B7A'] },
  { key: 'culture',       fr: 'Culture',       ar: 'ثقافة',    accent: ['#a855f7', '#ec4899'] },
  { key: 'tech',          fr: 'Tech',          ar: 'تقنية',    accent: ['#3b82f6', '#8b5cf6'] },
  { key: 'artistes',      fr: 'Artistes',      ar: 'فنانون',   accent: ['#f97316', '#eab308'] },
  { key: 'maroc',         fr: 'Maroc',         ar: 'المغرب',   accent: ['#14b8a6', '#22d3ee'] },
  { key: 'international', fr: 'International',  ar: 'دولي',     accent: ['#ef4444', '#a855f7'] },
];

const CAT_BY_KEY = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

export function categoryLabel(key, lang = 'fr') {
  const c = CAT_BY_KEY[key];
  if (!c) return key;
  return lang === 'ar' ? c.ar : c.fr;
}

export function categoryAccent(key) {
  return (CAT_BY_KEY[key] || CATEGORIES[0]).accent;
}

const DEFAULT_AUTHOR = 'Réda M.';

/* ─── Articles seed (originaux, FR + AR) ──────────────────────────────── */

export const ARTICLES = [
  {
    slug: 'mondial-2026-lions-atlas-bresil',
    category: 'sport',
    date: '2026-06-09',
    readingTime: 6,
    author: DEFAULT_AUTHOR,
    popular: true,
    tags: ['Mondial 2026', 'Lions de l\'Atlas', 'Brésil', 'Coupe du monde', 'football'],
    title: "Mondial 2026 : les Lions de l'Atlas entament leur campagne face au Brésil",
    excerpt: "Calendrier, groupe, sélectionneur et diffusion : tout sur le parcours du Maroc à la Coupe du monde 2026, qui débute le 11 juin aux États-Unis, au Canada et au Mexique.",
    keywords: ['mondial 2026 maroc', 'lions de l\'atlas brésil', 'coupe du monde 2026 maroc', 'maroc brésil mondial'],
    body: [
      p("La Coupe du monde 2026 s'ouvre le 11 juin et se prolonge jusqu'au 19 juillet, répartie pour la première fois entre trois pays hôtes : les États-Unis, le Canada et le Mexique. Pour le Maroc, ce rendez-vous planétaire représente une nouvelle étape attendue après le parcours historique de l'édition qatarie, où les Lions de l'Atlas étaient devenus la première sélection africaine et arabe à atteindre le dernier carré d'un Mondial. Cette septième participation à une phase finale arrive donc avec un statut nouveau : celui d'une équipe que les grandes nations regardent désormais avec respect, et même avec une certaine méfiance."),
      h2("Groupe C : le calendrier des Lions de l'Atlas"),
      p("Le tirage a placé le Maroc dans le groupe C, aux côtés du Brésil, de l'Écosse et d'Haïti. Le calendrier de la phase de poules est désormais connu. Les hommes d'Achraf Hakimi débuteront par un choc face à la Seleção, quintuple championne du monde, le samedi 13 juin dans la région de New York/New Jersey. Ils enchaîneront contre l'Écosse le vendredi 19 juin à Boston, avant de boucler le premier tour face à Haïti le mercredi 24 juin à Atlanta. Les trois rencontres sont programmées en soirée à 23h, heure de Rabat, un horaire favorable aux supporters au Maroc comme à la diaspora installée en Europe."),
      h2("Brésil : un air de France 98"),
      p("Cette affiche d'ouverture face au Brésil ravive de vieux souvenirs. En 1998, lors du Mondial français, le Maroc s'était déjà retrouvé dans la même poule que le Brésil et l'Écosse. Près de trois décennies plus tard, le contexte a profondément changé : le football marocain s'est structuré, professionnalisé et hisse régulièrement ses joueurs au plus haut niveau des championnats européens. Le sélectionneur de la Seleção lui-même a reconnu, à l'approche de la compétition, que le Maroc constituait l'adversaire le plus redoutable du groupe."),
      h2('Ouahbi et une préparation en demi-teinte'),
      p("Sur le banc, c'est Mohamed Ouahbi qui dirige cette campagne, sa première grande compétition à la tête de la sélection A. Le technicien a procédé à plusieurs choix forts dans la constitution de son groupe et a misé sur une préparation dense. Lors de leurs derniers matchs amicaux, les Lions de l'Atlas ont alterné démonstration et signaux d'alerte : large victoire face à Madagascar (4-0) début juin, puis un match nul plus laborieux contre la Norvège (1-1) le 7 juin. Cette dernière rencontre a laissé un goût amer, deux cadres ayant quitté la pelouse sur blessure, ce qui suscite l'inquiétude du staff à quelques jours de l'entrée en lice."),
      p("Côté brésilien aussi, l'incertitude plane sur certaines individualités, des examens médicaux étant scrutés de près pour évaluer la disponibilité de joueurs majeurs avant le choc inaugural. Cette zone de flou pourrait rééquilibrer un rapport de force que beaucoup voyaient déséquilibré sur le papier. Le Maroc, lui, pourra s'appuyer sur une ossature expérimentée, un capitaine emblématique et une dynamique collective forgée lors des dernières grandes échéances continentales et mondiales."),
      h2('Où suivre le Mondial au Maroc et dans la diaspora'),
      p("Pour les téléspectateurs et auditeurs au Maroc, la compétition sera accessible à la fois sur les chaînes du bouquet sportif régional détenteur des droits et sur la chaîne publique nationale dédiée au sport. Cette double diffusion garantit une large couverture, et la radio jouera comme toujours un rôle d'accompagnement : commentaires en direct, débriefs d'après-match et émissions spéciales rythmeront le quotidien des supporters tout au long du tournoi. Pour la diaspora, les plateformes en ligne et les radios marocaines accessibles en streaming resteront un lien direct avec l'ambiance du pays."),
      p("Au-delà du résultat sportif, ce Mondial nord-américain s'inscrit dans une trajectoire plus large pour le football marocain, qui se projette déjà vers la co-organisation de la Coupe du monde 2030. L'enjeu de 2026 dépasse donc le simple cadre des résultats : il s'agit de confirmer un statut, de consolider une génération talentueuse et d'entretenir la ferveur populaire qui accompagne désormais chaque sortie des Lions de l'Atlas. Le premier acte sera donné le 13 juin, et tout un pays retiendra son souffle."),
    ],
    slug_ar: 'kas-al-alam-2026-usud-atlas-brazil',
    title_ar: 'كأس العالم 2026: أسود الأطلس يستهلّون مشوارهم أمام البرازيل',
    excerpt_ar: 'البرنامج والمجموعة والمدرب وقنوات البث: كل ما تحتاج معرفته عن مشوار المغرب في كأس العالم 2026 التي تنطلق يوم 11 يونيو بالولايات المتحدة وكندا والمكسيك.',
    body_ar: [
      p('تنطلق كأس العالم 2026 يوم 11 يونيو وتتواصل حتى 19 يوليوز، موزَّعة لأول مرة على ثلاث دول مُستضيفة: الولايات المتحدة وكندا والمكسيك. ويمثّل هذا الموعد العالمي بالنسبة للمغرب محطة جديدة طال انتظارها بعد المشوار التاريخي في نسخة قطر، حين أصبح أسود الأطلس أول منتخب إفريقي وعربي يبلغ المربّع الذهبي في مونديال. وهكذا تأتي هذه المشاركة السابعة في نهائيات كأس العالم بمكانة جديدة: مكانة منتخب باتت كبرى المنتخبات تنظر إليه باحترام، بل وبشيء من الحذر.'),
      h2('المجموعة الثالثة: برنامج أسود الأطلس'),
      p('أوقعت القرعة المغرب في المجموعة الثالثة إلى جانب البرازيل واسكتلندا وهايتي. وقد بات برنامج دور المجموعات معروفًا. سيستهلّ رفاق أشرف حكيمي مشوارهم بمواجهة قوية أمام «السيليساو»، حاملة اللقب خمس مرات، يوم السبت 13 يونيو بمنطقة نيويورك/نيوجيرسي. ثم يواجهون اسكتلندا يوم الجمعة 19 يونيو ببوسطن، قبل أن يُسدلوا الستار على الدور الأول أمام هايتي يوم الأربعاء 24 يونيو بأطلانطا. وستُقام المباريات الثلاث مساءً على الساعة الحادية عشرة ليلاً بتوقيت الرباط، وهو توقيت مناسب للجماهير داخل المغرب وللجالية المقيمة بأوروبا على حدّ سواء.'),
      h2('البرازيل: نكهة فرنسا 98'),
      p('وتُعيد مواجهة الافتتاح أمام البرازيل إلى الأذهان ذكريات قديمة. ففي عام 1998، خلال مونديال فرنسا، سبق أن وُضع المغرب في المجموعة نفسها رفقة البرازيل واسكتلندا. وبعد نحو ثلاثة عقود، تبدّل السياق تمامًا: فقد تطوّرت كرة القدم المغربية واحترفت، وباتت تدفع بلاعبيها بانتظام إلى أعلى مستويات البطولات الأوروبية. حتى مدرب «السيليساو» نفسه اعترف، مع اقتراب المنافسة، بأن المغرب يمثّل أخطر منافس في المجموعة.'),
      h2('وهبي وإعداد متفاوت'),
      p('على رأس الجهاز الفني، يقود محمد وهبي هذه الحملة في أول منافسة كبرى له مع المنتخب الأول. وقد اتخذ المدرب عدة قرارات جريئة في تشكيل مجموعته، ورهَن على إعداد مكثّف. وفي آخر مبارياته الودية، تأرجح أسود الأطلس بين الاستعراض وإشارات التنبيه: فوز عريض على مدغشقر (4-0) مطلع يونيو، ثم تعادل أكثر صعوبة أمام النرويج (1-1) يوم 7 يونيو. وقد خلّفت هذه المباراة الأخيرة طعمًا مرًّا، إذ غادر عنصران أساسيان أرضية الميدان مصابَين، ما يثير قلق الطاقم قبيل بدء المشوار.'),
      p('ومن الجانب البرازيلي أيضًا، يخيّم الغموض على بعض الأسماء، إذ تخضع فحوص طبية لمتابعة دقيقة لتقييم جاهزية لاعبين بارزين قبل صدام الافتتاح. وقد يُعيد هذا الغموض شيئًا من التوازن إلى موازين قوى كان كثيرون يرونها مائلة على الورق. أما المغرب، فيمكنه الاعتماد على هيكل خبير وقائد رمزي ودينامية جماعية صُقلت خلال أكبر المواعيد القارية والعالمية الأخيرة.'),
      h2('أين تتابع المونديال بالمغرب والمهجر'),
      p('بالنسبة للمشاهدين والمستمعين بالمغرب، ستكون المنافسة متاحة على القنوات الرياضية الإقليمية المالكة للحقوق، وكذلك على القناة العمومية الوطنية المخصّصة للرياضة. ويضمن هذا البث المزدوج تغطية واسعة، فيما تؤدّي الإذاعة كعادتها دور المرافِق: تعليق مباشر، وتحليلات بعد المباريات، وبرامج خاصة ستطبع يوميات الجماهير طيلة البطولة. أما الجالية، فستظلّ المنصات الرقمية والإذاعات المغربية المتاحة عبر البثّ المباشر صلة وصلٍ مباشرة بأجواء الوطن.'),
      p('وأبعد من النتيجة الرياضية، تندرج هذه النسخة الأمريكية الشمالية ضمن مسار أوسع لكرة القدم المغربية التي تتطلّع بالفعل إلى تنظيم كأس العالم 2030 بشكل مشترك. لذا يتجاوز رهان 2026 مجرد إطار النتائج: فالأمر يتعلق بتأكيد مكانة، وترسيخ جيل موهوب، وإذكاء الحماس الشعبي الذي بات يرافق كل خرجة لأسود الأطلس. الفصل الأول سيُكتب يوم 13 يونيو، وستحبس بلاد بأكملها أنفاسها.'),
    ],
  },
  {
    slug: 'lions-atlas-prochains-matchs-radio',
    slug_ar: 'usud-al-atlas-mubarayat-mubashir',
    category: 'sport',
    date: '2026-06-06',
    readingTime: 4,
    author: DEFAULT_AUTHOR,
    featured: true,
    popular: true,
    tags: ['Lions de l\'Atlas', 'Botola', 'football', 'CAN'],
    title: "Lions de l'Atlas : comment suivre les prochains matchs en direct à la radio",
    excerpt: "Calendrier, fréquences et radios sportives marocaines pour ne rien manquer des prochaines rencontres de la sélection nationale, commentées en direct.",
    keywords: ['lions de l\'atlas direct', 'match maroc radio', 'radio sport maroc direct'],
    body: [
      p("La sélection marocaine continue d'enflammer les ondes. Entre éliminatoires, matchs amicaux et grandes compétitions, suivre les Lions de l'Atlas en direct à la radio reste le moyen le plus simple et le plus vivant de vivre chaque rencontre, où que vous soyez."),
      h2('Sur quelles radios écouter les matchs ?'),
      p("Plusieurs stations marocaines retransmettent les matchs avec commentaires en arabe et en français. ", b('Radio Mars'), ", première radio 100% sport du Maroc, en est la référence — disponible en direct et en streaming gratuit."),
      ul([
        'Radio Mars — commentaires sportifs en continu',
        'Radio nationale (SNRT) — grandes affiches de la sélection',
        'Stations régionales FM selon les villes',
      ]),
      h2('Écouter sans rien manquer'),
      p("Pour ne pas dépendre de la couverture FM, le streaming en direct permet de suivre la radio sportive depuis n'importe quel pays — pratique pour la diaspora marocaine. Lancez la station, et le coup d'envoi est à vous."),
    ],
    title_ar: 'أسود الأطلس: كيف تتابع المباريات القادمة مباشرة عبر الإذاعة',
    excerpt_ar: 'الرزنامة، الترددات والإذاعات الرياضية المغربية لمتابعة مباريات المنتخب الوطني مباشرة وبتعليق حي.',
    body_ar: [
      p('يواصل المنتخب المغربي إشعال الأثير. بين التصفيات والمباريات الودية والمنافسات الكبرى، تبقى متابعة أسود الأطلس مباشرة عبر الإذاعة أبسط وأمتع وسيلة لعيش كل مباراة أينما كنت.'),
      h2('على أي إذاعة تستمع للمباريات؟'),
      p('تنقل عدة إذاعات مغربية المباريات بتعليق بالعربية والفرنسية. ', b('راديو مارس'), '، أول إذاعة رياضية 100% بالمغرب، هي المرجع — متاحة مباشرة وبالبث المجاني.'),
      h2('استمع دون أن يفوتك شيء'),
      p('يتيح البث المباشر متابعة الإذاعة الرياضية من أي بلد — وهو أمر عملي للجالية المغربية. شغّل المحطة، وصافرة البداية بين يديك.'),
    ],
  },
  {
    slug: 'nouveautes-musique-marocaine-tendances',
    slug_ar: 'jadid-al-musiqa-al-maghribiya',
    category: 'musique',
    date: '2026-06-05',
    readingTime: 5,
    author: DEFAULT_AUTHOR,
    popular: true,
    tags: ['musique marocaine', 'sorties', 'rap', 'pop'],
    title: 'Nouveautés musique marocaine : les tendances du moment',
    excerpt: "Sorties, artistes qui montent et genres qui cartonnent : tour d'horizon de la scène musicale marocaine à écouter dès maintenant en streaming.",
    keywords: ['nouveautés musique marocaine', 'sorties rap maroc', 'tendances musique maroc'],
    body: [
      p("La scène musicale marocaine n'a jamais été aussi vivante. Du rap qui domine les écoutes aux artistes pop qui s'exportent, en passant par le chaabi et l'amazigh toujours bien ancrés, les radios marocaines sont aux premières loges des nouveautés."),
      h2('Ce qui tourne en boucle'),
      ul([
        'Le rap marocain (rap lbeldi) confirme sa domination chez les jeunes',
        'La pop urbaine franco-arabe séduit le Maroc et la diaspora',
        'Le chaabi et l\'amazigh restent les piliers des fêtes et des familles',
      ]),
      h2('Où découvrir les nouveautés ?'),
      p("Les radios musicales marocaines en streaming sont la meilleure porte d'entrée pour découvrir les titres du moment sans algorithme payant. Hit Radio, MFM, Chada FM et les webradios spécialisées renouvellent leurs playlists en continu."),
    ],
    title_ar: 'جديد الموسيقى المغربية: اتجاهات اللحظة',
    excerpt_ar: 'إصدارات وفنانون صاعدون وأنواع رائجة: جولة في المشهد الموسيقي المغربي للاستماع الآن عبر البث المباشر.',
    body_ar: [
      p('لم يكن المشهد الموسيقي المغربي بهذه الحيوية من قبل. من الراب الذي يتصدر الاستماع إلى فناني البوب الذين يصدّرون أعمالهم، مروراً بالشعبي والأمازيغي الراسخين، تبقى الإذاعات المغربية في الصفوف الأولى للجديد.'),
      h2('ما يتردد كثيراً'),
      h2('أين تكتشف الجديد؟'),
      p('الإذاعات الموسيقية المغربية عبر البث المباشر هي أفضل بوابة لاكتشاف أغاني اللحظة. هيت راديو، MFM، شدى إف إم والإذاعات المتخصصة تجدد قوائمها باستمرار.'),
    ],
  },
  {
    slug: 'ecouter-radio-marocaine-streaming-2026',
    slug_ar: 'istima3-idaa-maghribiya-bath-2026',
    category: 'radio',
    date: '2026-06-04',
    readingTime: 4,
    author: DEFAULT_AUTHOR,
    popular: true,
    tags: ['streaming', 'radio en ligne', 'FM'],
    title: 'Écouter la radio marocaine en streaming en 2026 : le guide simple',
    excerpt: "FM, application, navigateur : toutes les façons d'écouter vos radios marocaines en direct, gratuitement et sans inscription, depuis le Maroc ou l'étranger.",
    keywords: ['écouter radio maroc en ligne', 'radio marocaine streaming', 'radio maroc direct'],
    body: [
      p("Écouter la radio marocaine n'a jamais été aussi accessible. Plus besoin d'un poste FM ni d'être au Maroc : un navigateur suffit pour capter en direct des dizaines de stations, en qualité numérique."),
      h2('Les 3 façons d\'écouter'),
      ul([
        'FM classique — au Maroc, selon la fréquence de votre ville',
        'Streaming web — n\'importe quel pays, sans installation',
        'Applications mobiles — pour écouter en déplacement',
      ]),
      p("Le streaming a un avantage décisif pour la diaspora : il abolit la distance. Où que vous soyez, vous retrouvez instantanément le son du pays."),
    ],
    title_ar: 'الاستماع إلى الإذاعة المغربية عبر البث في 2026: الدليل البسيط',
    excerpt_ar: 'FM، تطبيق، متصفح: كل طرق الاستماع إلى إذاعاتك المغربية مباشرة، مجاناً وبدون تسجيل، من المغرب أو الخارج.',
    body_ar: [
      p('لم يكن الاستماع إلى الإذاعة المغربية بهذه السهولة. لم تعد بحاجة إلى جهاز FM ولا إلى التواجد بالمغرب: يكفي متصفح لالتقاط عشرات المحطات مباشرة وبجودة رقمية.'),
      h2('ثلاث طرق للاستماع'),
      p('للبث ميزة حاسمة للجالية: يلغي المسافة. أينما كنت، تستعيد فوراً صوت البلد.'),
    ],
  },
  {
    slug: 'festival-mawazine-essentiel',
    slug_ar: 'mawazine-2026-programmation-rabat',
    category: 'culture',
    date: '2026-06-03',
    readingTime: 6,
    author: DEFAULT_AUTHOR,
    tags: ['Mawazine', 'festival', 'Rabat', 'concerts'],
    title: 'Mawazine 2026 : Rabat se prépare à neuf jours de musiques du monde',
    excerpt: "Stars internationales, légendes du chaâbi, rap marocain et patrimoine amazigh : tour d'horizon de la 21e édition du festival Mawazine, attendue à Rabat fin juin 2026.",
    keywords: ['mawazine 2026', 'festival mawazine rabat', 'programmation mawazine', 'concerts rabat 2026', 'mawazine rythmes du monde'],
    body: [
      p("Chaque été, la capitale marocaine se transforme en une immense scène à ciel ouvert. La 21e édition du festival Mawazine – Rythmes du Monde se tiendra à Rabat sur neuf jours, à partir du 19 juin 2026, et s'annonce une nouvelle fois comme l'un des plus grands rassemblements musicaux de la planète. Organisé depuis 2001, l'événement s'est imposé au fil des années comme un rendez-vous incontournable, porté par un principe rare à cette échelle : la très grande majorité de ses concerts sont gratuits et ouverts au public. L'édition précédente avait attiré plusieurs millions de festivaliers sur l'ensemble de ses scènes, confirmant son statut de festival musical le plus fréquenté au monde."),
      h2('Une programmation qui fait dialoguer continents et générations'),
      p("La force de Mawazine tient à son éclectisme assumé. La programmation 2026 fait dialoguer les générations, les continents et les genres, des têtes d'affiche internationales aux artistes du terroir marocain. Sur la scène électro de l'OLM Souissi, le collectif américain Major Lazer, emmené par Diplo, est attendu pour transformer le site en immense piste de danse. Au Théâtre National Mohammed V, le public retrouvera des voix de légende de la soul et du R&B américain, dans un registre plus intimiste, tandis que la scène orientale accueillera l'une des grandes figures de la chanson arabe, dont le répertoire traverse les décennies et fédère un public bien au-delà des frontières marocaines."),
      h2("Scène de Salé : la création nationale à l'honneur"),
      p("Mais l'identité du festival se joue aussi, et peut-être surtout, dans la place qu'il accorde à la création nationale. La scène de Salé est traditionnellement dédiée aux grandes voix de la musique populaire marocaine. Cette année encore, elle déroulera une succession de concerts mêlant chaâbi, aïta, musique amazighe et rythmes hassanis. Des artistes confirmés du chaâbi y défileront tout au long de la semaine, aux côtés de figures emblématiques de la chanson saharienne et amazighe, dont des voix féminines majeures de ce patrimoine. Le festival met ainsi en avant la diversité régionale du Royaume, en faisant cohabiter sur une même scène les répertoires du Nord, du Souss, du Sahara et du Moyen Atlas."),
      p("La nouvelle génération n'est pas en reste. Le rap et la pop urbaine, devenus des moteurs essentiels de la scène marocaine contemporaine, disposent de leurs propres rendez-vous, avec la présence d'artistes qui rassemblent des millions d'auditeurs sur les plateformes de streaming. Cette ouverture aux musiques actuelles traduit la volonté du festival de rester en phase avec les goûts d'un public jeune et connecté, tout en préservant son ancrage patrimonial. Le site historique du Chellah, de son côté, accueille des formations internationales aux sonorités méditerranéennes et néo-traditionnelles, dans un cadre archéologique unique qui fait partie intégrante de l'expérience."),
      h2('Un levier économique et médiatique'),
      p("Au-delà de l'événement culturel, Mawazine constitue un puissant levier économique et touristique pour Rabat et sa région. Pendant la durée du festival, l'hôtellerie, la restauration et le commerce local profitent d'un afflux considérable de visiteurs nationaux et étrangers. Pour les médias, c'est également une période de forte activité : couvertures en direct, interviews d'artistes, retransmissions et contenus numériques se multiplient. Les radios marocaines y trouvent une matière éditoriale dense, qu'il s'agisse de programmer les titres des artistes à l'affiche, de relayer l'ambiance des concerts ou d'accompagner les auditeurs dans la préparation de leurs soirées."),
      p("Pour les amateurs de musique, qu'ils soient sur place ou à distance, Mawazine 2026 promet donc un voyage sonore qui balaie un spectre exceptionnellement large : de l'électro mondiale aux traditions de l'aïta, de la soul américaine aux rythmes amazighs, en passant par le tarab oriental et le rap en darija. C'est cette capacité à faire coexister le populaire et le prestigieux, le local et l'international, qui explique la longévité du festival et son rayonnement. À l'approche de l'été, Rabat se prépare une fois encore à vibrer, et l'événement s'annonce comme l'un des temps forts culturels de la saison."),
    ],
    title_ar: 'موازين 2026: الرباط تستعدّ لتسعة أيام من موسيقى العالم',
    excerpt_ar: 'نجوم عالميون وأساطير الشعبي والراب المغربي والتراث الأمازيغي: جولة في النسخة الحادية والعشرين من مهرجان موازين المرتقَب بالرباط أواخر يونيو 2026.',
    body_ar: [
      p('في كل صيف، تتحوّل العاصمة المغربية إلى مسرح ضخم في الهواء الطلق. وستُقام النسخة الحادية والعشرون من مهرجان موازين – إيقاعات العالم بالرباط على مدى تسعة أيام، ابتداءً من 19 يونيو 2026، ويُنتظر أن تكون مرة أخرى واحدًا من أكبر التجمّعات الموسيقية على وجه الأرض. ومنذ تنظيمه عام 2001، فرض الحدث نفسه على مرّ السنين موعدًا لا غنى عنه، يقوم على مبدأ نادر بهذا الحجم: الغالبية العظمى من حفلاته مجانية ومفتوحة للجمهور. وقد استقطبت النسخة السابقة ملايين المتفرجين على مختلف منصّاتها، مؤكّدةً مكانتها كأكثر مهرجان موسيقي حضورًا في العالم.'),
      h2('برمجة تحاور القارات والأجيال'),
      p('تكمن قوة موازين في تنوّعه المُعلَن. فبرمجة 2026 تُحاور الأجيال والقارات والأنماط، من نجوم عالميين كبار إلى فنانين من عمق التراب المغربي. على ركح الموسيقى الإلكترونية بـ«أولمب السويسي»، يُنتظر الفريق الأمريكي ميجور لايزر بقيادة ديبلو لتحويل الموقع إلى حلبة رقص ضخمة. وفي المسرح الوطني محمد الخامس، سيلتقي الجمهور بأصوات أسطورية من السول والآر أند بي الأمريكي في أجواء أكثر حميمية، فيما يستقبل الركح الشرقي إحدى كبريات قامات الأغنية العربية، التي يعبُر رصيدُها العقود ويوحّد جمهورًا يتجاوز حدود المغرب بكثير.'),
      h2('ركح سلا: الإبداع الوطني في الواجهة'),
      p('غير أن هوية المهرجان تتجلّى أيضًا، وربما قبل كل شيء، في المكانة التي يمنحها للإبداع الوطني. فركح سلا مخصّص تقليديًا لكبار أصوات الموسيقى الشعبية المغربية. وهذه السنة أيضًا، سيشهد سلسلة حفلات تمزج الشعبي والعيطة والموسيقى الأمازيغية والإيقاعات الحسّانية. وسيتعاقب عليه فنانون راسخون في الطرب الشعبي طيلة الأسبوع، إلى جانب وجوه رمزية من الأغنية الصحراوية والأمازيغية، من بينها أصوات نسائية بارزة في هذا التراث. وهكذا يُبرز المهرجان التنوّع الجهوي للمملكة، بجمعه على ركح واحد بين روافد الشمال والسوس والصحراء والأطلس المتوسط.'),
      p('ولا يغيب الجيل الجديد عن الموعد. فالراب والبوب الحضري، اللذان أصبحا محرّكين أساسيين للمشهد المغربي المعاصر، يحظيان بمواعيدهما الخاصة، بحضور فنانين يجمعون ملايين المستمعين على منصات البثّ. وتعكس هذه الانفتاحة على الموسيقى الراهنة إرادة المهرجان في البقاء على تماسٍّ مع أذواق جمهور شاب ومتصل، مع الحفاظ على تجذّره التراثي. أما موقع شالة التاريخي، فيحتضن تشكيلات دولية ذات نفَس متوسطي وتقليدي مُجدَّد، في إطار أثري فريد يشكّل جزءًا لا يتجزأ من التجربة.'),
      h2('رافعة اقتصادية وموعد إعلامي'),
      p('وأبعد من البُعد الثقافي، يشكّل موازين رافعة اقتصادية وسياحية قوية للرباط وجهتها. فخلال أيام المهرجان، تستفيد الفنادق والمطاعم والتجارة المحلية من توافد كبير للزوار الوطنيين والأجانب. وبالنسبة للإعلام، تُعدّ هذه الفترة موسمًا من النشاط المكثّف: تغطيات مباشرة، وحوارات مع الفنانين، وبثّ، ومحتويات رقمية تتكاثر. وتجد فيها الإذاعات المغربية مادّة تحريرية غزيرة، سواء ببرمجة أغاني الفنانين المشاركين، أو بنقل أجواء الحفلات، أو بمرافقة المستمعين في التحضير لسهراتهم.'),
      p('وهكذا يَعِد موازين 2026 عشّاق الموسيقى، حاضرين كانوا أو عن بُعد، برحلة صوتية تكتسح طيفًا واسعًا بشكل استثنائي: من الإلكترو العالمي إلى تقاليد العيطة، ومن السول الأمريكي إلى الإيقاعات الأمازيغية، مرورًا بالطرب الشرقي والراب بالدارجة. وهذه القدرة على المزج بين الشعبي والمرموق، بين المحلي والعالمي، هي ما يفسّر طول عُمر المهرجان وإشعاعه. ومع اقتراب الصيف، تستعدّ الرباط مرة أخرى للنبض، ويُنتظر أن يكون الحدث من أبرز المحطات الثقافية للموسم.'),
    ],
  },
  {
    slug: 'streaming-audio-hls-vs-mp3',
    slug_ar: 'bath-sawti-hls-vs-mp3',
    category: 'tech',
    date: '2026-06-02',
    readingTime: 5,
    author: DEFAULT_AUTHOR,
    tags: ['streaming', 'HLS', 'audio', 'tech'],
    title: 'Streaming audio : HLS vs MP3, ce qui change pour écouter la radio',
    excerpt: "Pourquoi certaines radios coupent moins, démarrent plus vite ou consomment moins de data : on vous explique simplement les technologies derrière le direct.",
    keywords: ['streaming hls', 'radio streaming technologie', 'écouter radio sans coupure'],
    body: [
      p("Vous avez peut-être remarqué que certaines radios démarrent instantanément et ne coupent jamais, alors que d'autres rament. La différence tient souvent à la technologie de diffusion."),
      h2('MP3 (ICY) vs HLS'),
      ul([
        'MP3/ICY — flux continu simple, léger, mais sensible aux coupures réseau',
        'HLS — flux découpé en segments, plus robuste et adaptatif (idéal mobile)',
      ]),
      p("Pour l'auditeur, l'essentiel est invisible : une lecture fluide. Notre lecteur gère automatiquement les deux, pour que vous n'ayez qu'à cliquer sur Écouter."),
    ],
    title_ar: 'البث الصوتي: HLS مقابل MP3 وما الذي يتغير للاستماع للإذاعة',
    excerpt_ar: 'لماذا تنقطع بعض الإذاعات أقل أو تنطلق أسرع أو تستهلك بيانات أقل: نشرح ببساطة التقنيات وراء البث المباشر.',
    body_ar: [
      p('ربما لاحظت أن بعض الإذاعات تنطلق فوراً ولا تنقطع، بينما تتعثر أخرى. الفرق غالباً في تقنية البث.'),
      h2('MP3 مقابل HLS'),
      p('بالنسبة للمستمع، الأهم غير مرئي: تشغيل سلس. مشغّلنا يدير الاثنين تلقائياً، فلا عليك سوى الضغط على استماع.'),
    ],
  },
  {
    slug: 'botola-pro-suivre-journee-direct',
    slug_ar: 'botola-pro-mutaba3a-mubashir',
    category: 'sport',
    date: '2026-06-01',
    readingTime: 3,
    author: DEFAULT_AUTHOR,
    tags: ['Botola', 'football', 'championnat'],
    title: 'Botola Pro : où suivre la journée de championnat en direct',
    excerpt: "Le championnat marocain passionne. Voici comment suivre les matchs de la Botola Pro en direct à la radio, multiplex et commentaires inclus.",
    keywords: ['botola pro direct', 'championnat maroc radio', 'football marocain direct'],
    body: [
      p("La Botola Pro rythme les week-ends des supporters marocains. Pour suivre les matchs en simultané, la radio reste imbattable : multiplex, buts en direct et analyses d'après-match."),
      h2('Le réflexe radio'),
      p("Les radios sportives proposent des multiplex qui basculent d'un stade à l'autre dès qu'un but tombe. Idéal pour ne rien rater de la journée, même loin des terrains."),
    ],
    title_ar: 'البطولة الاحترافية: أين تتابع دورة البطولة مباشرة',
    excerpt_ar: 'البطولة المغربية تثير الشغف. إليك كيف تتابع مباريات البطولة الاحترافية مباشرة عبر الإذاعة، بالملتيبلكس والتعليق.',
    body_ar: [
      p('تنظّم البطولة الاحترافية عطل نهاية الأسبوع للمشجعين المغاربة. لمتابعة المباريات في آن واحد، تبقى الإذاعة بلا منافس: ملتيبلكس وأهداف مباشرة وتحليلات.'),
      h2('عادة الإذاعة'),
      p('تقدّم الإذاعات الرياضية ملتيبلكس ينتقل من ملعب لآخر فور تسجيل هدف. مثالي لعدم تفويت أي شيء من الدورة.'),
    ],
  },
  {
    slug: 'artistes-marocains-qui-montent',
    slug_ar: 'fananoun-maghariba-sa3idoun',
    category: 'artistes',
    date: '2026-05-31',
    readingTime: 4,
    author: DEFAULT_AUTHOR,
    tags: ['artistes', 'rap', 'pop', 'révélations'],
    title: 'Ces artistes marocains qui montent à écouter en radio',
    excerpt: "Nouvelles voix, talents confirmés et révélations : un coup de projecteur sur les artistes marocains qui font vibrer les ondes en ce moment.",
    keywords: ['artistes marocains 2026', 'révélations musique maroc', 'talents marocains'],
    body: [
      p("Le Maroc regorge de talents qui s'imposent sur les plateformes et les radios. De la nouvelle scène rap aux voix pop qui s'exportent, ces artistes redéfinissent le son marocain."),
      h2('À suivre de près'),
      p("Les radios musicales jouent un rôle clé pour révéler ces artistes au grand public : elles testent les titres, créent les tubes et accompagnent les carrières. Tendez l'oreille."),
    ],
    title_ar: 'فنانون مغاربة صاعدون تستمع لهم عبر الإذاعة',
    excerpt_ar: 'أصوات جديدة ومواهب مؤكدة واكتشافات: تسليط الضوء على الفنانين المغاربة الذين يُطربون الأثير حالياً.',
    body_ar: [
      p('يزخر المغرب بمواهب تفرض نفسها على المنصات والإذاعات. من مشهد الراب الجديد إلى أصوات البوب التي تُصدَّر، يعيد هؤلاء الفنانون تعريف الصوت المغربي.'),
      h2('للمتابعة عن قرب'),
      p('تلعب الإذاعات الموسيقية دوراً أساسياً في كشف هؤلاء الفنانين للجمهور: تختبر الأغاني وتصنع النجاحات وترافق المسارات.'),
    ],
  },
  {
    slug: 'radios-marocaines-podcasts-essor',
    slug_ar: 'idaat-maghribiya-podcast',
    category: 'radio',
    date: '2026-05-30',
    readingTime: 4,
    author: DEFAULT_AUTHOR,
    tags: ['podcast', 'radio', 'replay'],
    title: 'Podcasts et replay : la nouvelle vie des radios marocaines',
    excerpt: "Les radios marocaines ne se contentent plus du direct : podcasts, rediffusions et émissions à la demande prolongent l'écoute. Tour d'horizon.",
    keywords: ['podcast maroc', 'replay radio marocaine', 'émissions à la demande'],
    body: [
      p("Le direct reste roi, mais les radios marocaines investissent de plus en plus le podcast et le replay. Résultat : on écoute son émission préférée quand on veut, et plus seulement à l'heure de diffusion."),
      h2("Pourquoi c'est utile"),
      p("Pour la diaspora notamment, le décalage horaire n'est plus un obstacle : les rediffusions et podcasts permettent de rattraper les meilleurs moments à tout moment de la journée."),
    ],
    title_ar: 'البودكاست وإعادة البث: الحياة الجديدة للإذاعات المغربية',
    excerpt_ar: 'لم تعد الإذاعات المغربية تكتفي بالبث المباشر: البودكاست وإعادة البث والبرامج عند الطلب تمدّد الاستماع.',
    body_ar: [
      p('يبقى المباشر ملكاً، لكن الإذاعات المغربية تستثمر أكثر فأكثر في البودكاست وإعادة البث. النتيجة: تستمع لبرنامجك المفضل وقتما شئت.'),
      h2('لماذا هذا مفيد'),
      p('بالنسبة للجالية خصوصاً، لم يعد فارق التوقيت عائقاً: تتيح إعادات البث والبودكاست تدارك أفضل اللحظات في أي وقت.'),
    ],
  },
];

// Sources externes autoritaires par article → liens sortants (citations).
// Renforce l'E-E-A-T et la pertinence thématique. URLs VÉRIFIÉES uniquement
// (Wikipédia + sites officiels). Liens dofollow : ce sont de vraies citations.
const SOURCES_BY_SLUG = {
  'mondial-2026-lions-atlas-bresil': [
    { label: 'Olympics.com — Programme et calendrier du Maroc au Mondial 2026', label_ar: 'Olympics.com — برنامج وروزنامة المغرب في مونديال 2026', url: 'https://www.olympics.com/fr/infos/coupe-du-monde-2026-programme-calendrier-maroc-horaires-matchs-adversaires-lions-atlas-mondial-2026' },
    { label: 'Afrik-Foot — Le Maroc à la Coupe du monde 2026', label_ar: 'Afrik-Foot — المغرب في كأس العالم 2026', url: 'https://www.afrik-foot.com/maroc-coupe-du-monde-2026-liste-des-joueurs-calendrier-match' },
    { label: 'AllAfrica — Le Maroc retrouve le Brésil et l\'Écosse, 28 ans après France 98', label_ar: 'AllAfrica — المغرب يلتقي البرازيل واسكتلندا بعد 28 سنة من فرنسا 98', url: 'https://fr.allafrica.com/stories/202512080610.html' },
    { label: 'Africa Radio — Préparation : le Maroc cale contre la Norvège', label_ar: 'Africa Radio — في الإعداد: المغرب يتعثر أمام النرويج', url: 'https://www.africaradio.com/actualite-114829-coupe-du-monde-2026-en-match-de-preparation-le-maroc-cale-contre-la-norvege-et-perd-deux-piliers-sur-blessure' },
  ],
  'lions-atlas-prochains-matchs-radio': [
    { label: 'Fédération Royale Marocaine de Football (FRMF)', url: 'https://www.frmf.ma' },
    { label: 'Radio Mars — Wikipédia', url: 'https://fr.wikipedia.org/wiki/Radio_Mars' },
  ],
  'nouveautes-musique-marocaine-tendances': [
    { label: 'Musique marocaine — Wikipédia', url: 'https://fr.wikipedia.org/wiki/Musique_marocaine' },
    { label: 'Hit Radio — Wikipédia', url: 'https://fr.wikipedia.org/wiki/Hit_Radio' },
  ],
  'ecouter-radio-marocaine-streaming-2026': [
    { label: 'HACA — Haute Autorité de la Communication Audiovisuelle', url: 'https://www.haca.ma' },
    { label: 'SNRT — Société Nationale de Radiodiffusion et de Télévision', url: 'https://www.snrt.ma' },
  ],
  'festival-mawazine-essentiel': [
    { label: 'Le Desk — Mawazine 2026 annonce cinq nouveaux noms', label_ar: 'Le Desk — موازين 2026 يعلن خمسة أسماء جديدة', url: 'https://ledesk.ma/culture/mawazine-2026-le-festival-annonce-cinq-nouveaux-noms-pour-juin/' },
    { label: 'Yabiladi — Du chaâbi à Salé et des concerts internationaux au Chellah', label_ar: 'Yabiladi — من الشعبي بسلا إلى الحفلات الدولية بشالة', url: 'https://www.yabiladi.com/articles/details/195795/mawazine-2026-chaabi-sale-concerts.html' },
    { label: "L'Observateur — Une traversée musicale entre soul, traditions africaines et patrimoine", label_ar: 'L\'Observateur — رحلة موسيقية بين السول والتقاليد الإفريقية والتراث', url: 'https://lobservateur.info/ampArticle/118477' },
    { label: 'SNRT News — Aminux, Dizzy Dros et Wael Kfoury rejoignent la programmation', label_ar: 'SNRT News — أمينوكس وديزي دروس ووائل كفوري ينضمّون للبرمجة', url: 'https://snrtnews.com/fr/article/mawazine-2026-aminux-dizzy-dros-et-wael-kfoury-rejoignent-la-programmation-153127' },
    { label: 'VH Magazine — Mawazine 2026 dévoile ses premières têtes d\'affiche', label_ar: 'VH Magazine — موازين 2026 يكشف أولى نجومه', url: 'https://www.vh.ma/actualite-news-express-maroc/rabat-en-mode-festival-mawazine-2026-devoile-ses-premieres-tetes-daffiche/' },
  ],
  'streaming-audio-hls-vs-mp3': [
    { label: 'HTTP Live Streaming — Wikipedia', url: 'https://en.wikipedia.org/wiki/HTTP_Live_Streaming' },
    { label: 'MP3 — Wikipédia', url: 'https://fr.wikipedia.org/wiki/MP3' },
  ],
  'botola-pro-suivre-journee-direct': [
    { label: 'Championnat du Maroc de football — Wikipédia', url: 'https://fr.wikipedia.org/wiki/Championnat_du_Maroc_de_football' },
    { label: 'Fédération Royale Marocaine de Football (FRMF)', url: 'https://www.frmf.ma' },
  ],
  'artistes-marocains-qui-montent': [
    { label: 'Musique marocaine — Wikipédia', url: 'https://fr.wikipedia.org/wiki/Musique_marocaine' },
    { label: 'ElGrandeToto — Wikipedia', url: 'https://en.wikipedia.org/wiki/ElGrandeToto' },
  ],
  'radios-marocaines-podcasts-essor': [
    { label: 'SNRT — Société Nationale de Radiodiffusion et de Télévision', url: 'https://www.snrt.ma' },
    { label: 'Podcasting — Wikipédia', url: 'https://fr.wikipedia.org/wiki/Podcasting' },
  ],
};

// Chaque article reçoit : une image de couverture générée (npm run info:covers
// → public/info/<slug>.png) si aucune image explicite, et ses sources externes.
// Pour une vraie photo : renseigner `image` (+ `imageAlt` / `imageAlt_ar`).
for (const a of ARTICLES) {
  if (!a.image) a.image = `/info/${a.slug}.webp`;
  if (!a.sources) a.sources = SOURCES_BY_SLUG[a.slug] || [];
}

/* ─── Sélecteurs ──────────────────────────────────────────────────────── */

const byDateDesc = (a, b) => (a.date < b.date ? 1 : -1);

/** Slug selon la langue (slug_ar si dispo, sinon slug FR). */
export const slugForLang = (article, lang) =>
  lang === 'ar' && article.slug_ar ? article.slug_ar : article.slug;

/** Applique les champs *_ar quand lang === 'ar'. */
export function localizeArticle(article, lang) {
  if (lang !== 'ar') return article;
  return {
    ...article,
    title: article.title_ar || article.title,
    excerpt: article.excerpt_ar || article.excerpt,
    body: article.body_ar || article.body,
  };
}

export const getRecent = (limit) => {
  const sorted = [...ARTICLES].sort(byDateDesc);
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
};

export const getFeatured = () =>
  ARTICLES.find((a) => a.featured) || getRecent(1)[0];

export const getByCategory = (key, limit) => {
  const list = [...ARTICLES].filter((a) => a.category === key).sort(byDateDesc);
  return typeof limit === 'number' ? list.slice(0, limit) : list;
};

export const getPopular = (limit = 5) =>
  [...ARTICLES].filter((a) => a.popular).sort(byDateDesc).slice(0, limit);

/** Recherche un article par slug FR ou AR. */
export function getArticle(slug) {
  return ARTICLES.find((a) => a.slug === slug || a.slug_ar === slug) || null;
}

/** Tous les tags uniques (pour le widget sidebar). */
export const getAllTags = (limit = 12) => {
  const seen = new Map();
  for (const a of ARTICLES) for (const t of a.tags || []) {
    seen.set(t, (seen.get(t) || 0) + 1);
  }
  return [...seen.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([t]) => t);
};
