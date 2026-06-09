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
    slug_ar: 'mahrajan-mawazine-al-aham',
    category: 'culture',
    date: '2026-06-03',
    readingTime: 4,
    author: DEFAULT_AUTHOR,
    tags: ['Mawazine', 'festival', 'Rabat', 'concerts'],
    title: 'Festival Mawazine : l\'essentiel à savoir et où le suivre',
    excerpt: "Rythmes du monde, têtes d'affiche et ambiance de Rabat : ce qu'il faut retenir de l'un des plus grands festivals de musique, et comment le vivre à la radio.",
    keywords: ['festival mawazine', 'mawazine rabat', 'concerts maroc'],
    body: [
      p("Chaque année, Mawazine transforme Rabat en capitale mondiale de la musique. Le festival mêle stars internationales et artistes marocains sur plusieurs scènes, dans une ambiance unique."),
      h2('Pourquoi il compte'),
      p("Au-delà des concerts, Mawazine est une vitrine de la scène marocaine et un rendez-vous suivi bien au-delà des frontières — notamment par la diaspora, qui en suit les temps forts à la radio et en ligne."),
    ],
    title_ar: 'مهرجان موازين: الأهم وأين تتابعه',
    excerpt_ar: 'إيقاعات العالم ونجوم وأجواء الرباط: أهم ما يجب معرفته عن أحد أكبر المهرجانات الموسيقية وكيف تعيشه عبر الإذاعة.',
    body_ar: [
      p('كل سنة يحوّل موازين الرباط إلى عاصمة عالمية للموسيقى. يجمع المهرجان نجوماً عالميين وفنانين مغاربة على عدة منصات في أجواء فريدة.'),
      h2('لماذا هو مهم'),
      p('أبعد من الحفلات، موازين واجهة للمشهد المغربي وموعد يُتابَع خارج الحدود — خاصة من الجالية التي تتابع أبرز لحظاته عبر الإذاعة والإنترنت.'),
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
    { label: 'Olympics.com — Programme et calendrier du Maroc au Mondial 2026', url: 'https://www.olympics.com/fr/infos/coupe-du-monde-2026-programme-calendrier-maroc-horaires-matchs-adversaires-lions-atlas-mondial-2026' },
    { label: 'Afrik-Foot — Le Maroc à la Coupe du monde 2026', url: 'https://www.afrik-foot.com/maroc-coupe-du-monde-2026-liste-des-joueurs-calendrier-match' },
    { label: 'AllAfrica — Le Maroc retrouve le Brésil et l\'Écosse, 28 ans après France 98', url: 'https://fr.allafrica.com/stories/202512080610.html' },
    { label: 'Africa Radio — Préparation : le Maroc cale contre la Norvège', url: 'https://www.africaradio.com/actualite-114829-coupe-du-monde-2026-en-match-de-preparation-le-maroc-cale-contre-la-norvege-et-perd-deux-piliers-sur-blessure' },
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
    { label: 'Festival Mawazine — Wikipédia', url: 'https://fr.wikipedia.org/wiki/Festival_Mawazine' },
    { label: 'Portail officiel du Royaume du Maroc — Maroc.ma', url: 'https://www.maroc.ma' },
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
  if (!a.image) a.image = `/info/${a.slug}.png`;
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
