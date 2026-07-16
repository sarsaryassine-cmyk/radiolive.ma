/**
 * Diaspora landing-page copy.
 *
 * Each entry powers two URLs (FR + AR), e.g.:
 *   /radio-maroc-france  /  /ar/min-faransa
 *
 * Targets long-tail searches from Moroccans abroad (MRE) such as
 *   "إذاعة المغرب من فرنسا", "écouter radio maroc depuis paris",
 *   "راديو المغرب أون لاين بلجيكا", "radio marocaine canada en ligne".
 *
 * Each AR body is ~450–550 words of unique copy (no auto-translation),
 * each FR body is the equivalent native version. Keys are kept short and
 * stable so we can wire schema.org / sitemap entries by them.
 */

export const DIASPORA_COUNTRIES = {
  france: {
    fr_path: '/radio-maroc-france',
    ar_path: '/ar/min-faransa',
    hreflang: 'ar-FR',
    countryCode: 'FR',
    fr_country: 'France',
    ar_country: 'فرنسا',
    fr_title: 'Radio Maroc en France — Écouter les radios marocaines depuis Paris, Lyon, Marseille',
    ar_title: 'إذاعات المغرب من فرنسا — استمع للراديو المغربي مباشرة من باريس وليون ومرسيليا',
    fr_description:
      "Écoutez en direct toutes les radios marocaines depuis la France : Hit Radio, Medi 1, Radio Mars, Chada FM. Streaming HD gratuit pour la diaspora marocaine de Paris, Lyon, Marseille, Lille et toute la France.",
    ar_description:
      'الجالية المغربية في فرنسا، استمع إلى أكثر من 50 إذاعة مغربية مباشرة وبجودة عالية: هيت راديو، ميدي1، شدى إف إم، ميد راديو وأكثر. مجاناً من باريس وليون ومرسيليا وكل المدن الفرنسية.',
    fr_h1: 'Radio Maroc en France — Toutes les radios marocaines en direct depuis Paris',
    ar_h1: 'إذاعات المغرب من فرنسا — جميع راديوهات المغرب مباشرة',
    fr_body: [
      "La France abrite la plus importante diaspora marocaine au monde, avec plus de 1,5 million de Marocains résidant dans l'Hexagone — principalement en Île-de-France, dans la région Auvergne-Rhône-Alpes, en Provence-Alpes-Côte d'Azur et dans les Hauts-de-France. Pour cette communauté, garder un lien quotidien avec le pays passe souvent par la radio : un format qui accompagne la cuisine, le trajet domicile-travail, les soirées en famille. Sur Radio Maroc, vous accédez à plus de 50 stations marocaines en streaming, depuis n'importe quelle ville française, sans VPN, sans inscription et gratuitement.",
      "Les Marocains de France apprécient particulièrement les flux de Hit Radio, Medi 1 Radio, Chada FM et Radio Mars. Les jeunes nés en France retrouvent les hits qui passent à Casablanca au même moment, tandis que les générations plus âgées privilégient Medi 1 (information bilingue franco-arabe) ou Radio Coran pour la spiritualité. Les fans de musique chaabi et amazighe se tournent vers Yabiladi Chaabi Maroc, Yabiladi Azawan Amazigh ou Radio Atbir, qui diffusent les classiques d'Aïta, de Reggada et d'Aroubi.",
      "Vous pouvez aussi suivre l'actualité sportive marocaine en temps réel grâce à Radio Mars, première radio 100 % sport au Maroc, qui retransmet la Botola Pro, les matchs des Lions de l'Atlas et la CAN. Pendant le mois de Ramadan, l'écoute des radios religieuses (Radio Coran, Al Quran Radio, Radio Manarat) explose dans la diaspora française : c'est l'occasion d'entendre les récitations des plus grands lecteurs marocains depuis Paris, Lyon ou Marseille.",
      "Notre plateforme fonctionne sur tous les appareils : ordinateur, smartphone, tablette, smart TV. Le lecteur audio reste actif lorsque vous changez de page et la qualité du flux s'adapte automatiquement à votre connexion (4G, 5G, fibre, ADSL). Aucune coupure publicitaire intrusive : vous écoutez la radio marocaine exactement comme si vous étiez au pays.",
      "Pour les Marocains du Nord de la France et de la région parisienne, Radio Maroc constitue le complément naturel des grandes mosquées, des associations culturelles et des épiceries du bled. Pour les étudiants marocains à Lyon, Toulouse, Bordeaux ou Lille, c'est un fil quotidien vers la maison. Pour les familles binationales, c'est un moyen simple de transmettre la langue, la musique et la culture marocaine aux enfants nés en France.",
    ],
    ar_body: [
      'تحتضن فرنسا أكبر جالية مغربية في العالم، حيث يقيم أكثر من مليون ونصف مغربي في باريس وليون ومرسيليا وليل وستراسبورغ وغيرها من المدن. ومن أجل أبناء الجالية، يبقى الراديو وسيلة بسيطة وسريعة للحفاظ على الرابط اليومي مع أرض الوطن. عبر منصتنا، يمكنك الاستماع إلى أكثر من 50 محطة إذاعية مغربية مباشرة وبجودة عالية، من أي مدينة فرنسية، مجاناً ودون تسجيل أو تطبيقات ثقيلة.',
      'يفضل المغاربة المقيمون في فرنسا الاستماع إلى هيت راديو، ميدي1، شدى إف إم، راديو مارس وميد راديو. الأجيال الشابة تستمتع بنفس الأغاني التي تُبث الآن في الدار البيضاء أو الرباط، فيما يتابع كبار السن النشرات الإخبارية لميدي1 بلغتيها العربية والفرنسية. أما محبو الموسيقى الشعبية والأمازيغية فيعودون إلى يابلادي شعبي، يابلادي أزوان أمازيغ وراديو أتبير، حيث يجدون كلاسيكيات العيطة والركادة والأغاني الأطلسية.',
      'كما يمكنك متابعة الرياضة المغربية مباشرة عبر راديو مارس، أول إذاعة مغربية متخصصة في الرياضة، التي تنقل مباريات البطولة الاحترافية ومباريات أسود الأطلس وكأس أمم إفريقيا. خلال شهر رمضان الكريم، تزداد نسبة الاستماع إلى الإذاعات الدينية مثل راديو القرآن الكريم، إذاعة منارات وراديو القرآن، وذلك لمتابعة قراءات أشهر القراء المغاربة من باريس وليون ومرسيليا.',
      'تعمل منصتنا على جميع الأجهزة: الحاسوب، الهاتف، اللوحة الإلكترونية والتلفاز الذكي. مشغل الصوت يستمر في العمل حتى عند التنقل بين الصفحات، وتتكيف جودة البث تلقائياً مع سرعة الإنترنت لديك. لا توجد إعلانات مزعجة طويلة: تستمع إلى الإذاعة المغربية تماماً كما لو كنت في البلد.',
      'بالنسبة لأبناء الجالية المغربية في شمال فرنسا والمنطقة الباريسية، تعتبر منصتنا مكملاً طبيعياً للمساجد الكبرى، الجمعيات الثقافية ومحلات المنتوجات المغربية. أما الطلبة المغاربة في مدن ليون وتولوز وبوردو وليل، فيجدون فيها رابطاً يومياً يربطهم ببيوتهم. وللعائلات الفرنسية المغربية، تبقى وسيلة عملية لنقل اللغة والموسيقى والثقافة إلى الأطفال المولودين في فرنسا.',
      'نحن نفتخر بكوننا أحد أكثر المنصات استعمالاً من طرف الجالية المغربية في فرنسا، ونعمل يومياً على تحديث قائمة الإذاعات وتحسين جودة البث. شارك المنصة مع عائلتك وأصدقائك في فرنسا، وعش لحظات المغرب أينما كنت.',
    ],
  },

  belgique: {
    fr_path: '/radio-maroc-belgique',
    ar_path: '/ar/min-belgika',
    hreflang: 'ar-BE',
    countryCode: 'BE',
    fr_country: 'Belgique',
    ar_country: 'بلجيكا',
    fr_title: 'Radio Maroc en Belgique — Écouter les radios marocaines depuis Bruxelles, Anvers, Liège',
    ar_title: 'إذاعات المغرب من بلجيكا — راديو المغرب مباشر من بروكسيل وأنفيرس ولييج',
    fr_description:
      "Diaspora marocaine de Belgique : écoutez en direct Hit Radio, Medi 1, Chada FM, Radio Mars depuis Bruxelles, Anvers, Liège, Charleroi. Plus de 50 stations FM marocaines en streaming HD gratuit.",
    ar_description:
      'الجالية المغربية في بلجيكا، استمع إلى الإذاعات المغربية المباشرة من بروكسيل وأنفيرس ولييج وشارلروا. أكثر من 50 محطة، مجاناً ودون تسجيل.',
    fr_h1: 'Radio Maroc en Belgique — Streaming en direct depuis Bruxelles',
    ar_h1: 'إذاعات المغرب من بلجيكا — البث المباشر من بروكسيل',
    fr_body: [
      "La Belgique compte près de 500 000 personnes d'origine marocaine, principalement réparties à Bruxelles (Molenbeek, Schaerbeek, Anderlecht), à Anvers, à Liège et à Charleroi. La communauté marocaine de Belgique est l'une des plus anciennes d'Europe, héritière des accords bilatéraux signés en 1964 entre Rabat et Bruxelles. Pour cette communauté, l'attache au Maroc passe quotidiennement par la radio : un médium simple, gratuit, qui crée un pont sonore entre Casablanca et Bruxelles en un clic.",
      "Sur Radio Maroc, vous écoutez en direct toutes les radios marocaines depuis n'importe quelle ville belge. Hit Radio, Medi 1 Radio, Chada FM et Radio Mars sont les plus populaires auprès de la diaspora bruxelloise. Pour les Marocains de Belgique attachés à la culture du Rif et du Souss, nous proposons aussi Yabiladi Azawan Amazigh, Radio Atbir et Radio Achkid FM — qui diffusent en tachelhit et en tarifit toute la journée.",
      "Pendant le Ramadan, le mois sacré, l'écoute explose vers les stations religieuses : Radio Coran, Al Quran Radio et Radio Manarat. Beaucoup de familles belgo-marocaines maintiennent la tradition d'allumer la radio avant le f'tour pour entendre l'adhan retransmis depuis Casablanca, Rabat ou Marrakech. Notre plateforme reproduit cette ambiance sans aucune coupure.",
      "Que vous habitiez Molenbeek, Borgerhout, Schaerbeek ou Liège, notre lecteur audio fonctionne sur tous les appareils — ordinateur, iPhone, Android, tablette, Apple TV — et continue à diffuser quand vous naviguez d'une page à l'autre. La qualité du flux s'adapte à votre débit (4G, 5G, fibre Telenet ou Proximus). Aucune publicité intrusive ne vient gâcher l'écoute.",
      "Radio Maroc est utilisé chaque jour par des milliers de Marocains de Belgique, qu'ils soient étudiants à Louvain, employés à Bruxelles, restaurateurs à Anvers ou retraités à Liège. C'est aussi un outil pédagogique précieux pour les parents qui souhaitent transmettre la darija, l'amazigh, la culture musicale et religieuse du Maroc à leurs enfants nés en Belgique.",
    ],
    ar_body: [
      'يبلغ عدد أبناء الجالية المغربية في بلجيكا حوالي نصف مليون شخص، يقيمون أساساً في بروكسيل (مولنبيك، شاربيك، أندرلخت)، أنفيرس، لييج وشارلروا. تعتبر الجالية المغربية في بلجيكا من أقدم الجاليات في أوروبا، إذ تعود جذورها إلى الاتفاقية الثنائية الموقعة سنة 1964 بين الرباط وبروكسيل. ومن أجل البقاء على تواصل دائم مع البلد الأم، يبقى الراديو وسيلة سهلة ومجانية تربط بين الدار البيضاء وبروكسيل بنقرة واحدة.',
      'عبر منصتنا، يمكنك الاستماع مباشرة إلى جميع الإذاعات المغربية من أي مدينة بلجيكية. هيت راديو، ميدي1، شدى إف إم وراديو مارس هي الأكثر استماعاً من طرف أبناء الجالية في بروكسيل. أما المهتمون بالثقافة الريفية والسوسية، فيجدون يابلادي أزوان أمازيغ، راديو أتبير وراديو أشكيد إف إم التي تبث بالأمازيغية طوال اليوم.',
      'خلال شهر رمضان المعظم، يرتفع الاستماع إلى الإذاعات الدينية مثل راديو القرآن الكريم، إذاعة منارات وراديو القرآن. تحرص العديد من العائلات البلجيكية المغربية على تشغيل الراديو قبل الإفطار لسماع الأذان مباشرة من الدار البيضاء أو الرباط أو مراكش. منصتنا تعيد إنتاج هذا الجو دون أي انقطاع.',
      'سواء كنت تقيم في مولنبيك أو بورجرهوت أو شاربيك أو لييج، فإن مشغل الصوت يعمل على جميع الأجهزة: الحاسوب، الآيفون، الأندرويد، اللوحة الإلكترونية وأبل تي في، ويستمر في البث حتى عند التنقل بين الصفحات. تتكيف جودة البث مع سرعة الإنترنت لديك، ولا توجد إعلانات مزعجة تقطع الاستماع.',
      'منصتنا يستعملها يومياً آلاف المغاربة المقيمين في بلجيكا، من طلاب جامعة لوفان إلى موظفي بروكسيل وأصحاب المطاعم في أنفيرس والمتقاعدين في لييج. كما تُعد أداة تعليمية مهمة للآباء الذين يرغبون في نقل اللغة الدارجة، الأمازيغية، الموسيقى والثقافة الدينية المغربية إلى أبنائهم المولودين في بلجيكا.',
    ],
  },

  'pays-bas': {
    fr_path: '/radio-maroc-pays-bas',
    ar_path: '/ar/min-holanda',
    hreflang: 'ar-NL',
    countryCode: 'NL',
    fr_country: 'Pays-Bas',
    ar_country: 'هولندا',
    fr_title: 'Radio Maroc aux Pays-Bas — Écouter les radios marocaines depuis Amsterdam, Rotterdam, La Haye',
    ar_title: 'إذاعات المغرب من هولندا — راديو المغرب مباشر من أمستردام وروتردام ولاهاي',
    fr_description:
      'Marocains des Pays-Bas, écoutez Hit Radio, Medi 1, Chada FM, Radio Mars depuis Amsterdam, Rotterdam, La Haye, Utrecht. Plus de 50 radios marocaines en streaming HD gratuit.',
    ar_description:
      'الجالية المغربية في هولندا، استمع إلى الإذاعات المغربية المباشرة من أمستردام وروتردام ولاهاي وأوتريخت. أكثر من 50 محطة، مجاناً.',
    fr_h1: 'Radio Maroc aux Pays-Bas — Toutes les radios marocaines en direct',
    ar_h1: 'إذاعات المغرب من هولندا — جميع راديوهات المغرب مباشرة',
    fr_body: [
      "Les Pays-Bas accueillent une diaspora marocaine de plus de 400 000 personnes, principalement issues de la région du Rif (provinces d'Al Hoceïma et de Nador). La communauté marocaine néerlandaise est concentrée à Amsterdam, Rotterdam, La Haye et Utrecht, où elle joue un rôle économique et culturel important depuis les vagues d'immigration des années 1960 et 1970.",
      "Pour cette diaspora, la radio reste un lien sonore quotidien avec le pays. Sur Radio Maroc, vous accédez gratuitement et sans inscription à toutes les grandes radios marocaines depuis n'importe quelle ville néerlandaise. Les Marocains du Rif vivant aux Pays-Bas apprécient particulièrement les programmes en tarifit diffusés par Yabiladi Azawan Amazigh et Radio Achkid FM. Pour la musique mainstream et l'actualité, Hit Radio, Medi 1 et Chada FM dominent l'écoute.",
      "La diaspora rifaine d'Amsterdam et de Rotterdam est très attachée à la culture musicale du Nord du Maroc : reggada, izlan, ahidouss. Notre plateforme propose plusieurs stations qui diffusent ces genres, ainsi que les radios chaabi qui couvrent toute la palette de la musique populaire marocaine. Pendant les mariages et les fêtes communautaires aux Pays-Bas, ces stations sont souvent diffusées en arrière-plan pour recréer l'ambiance du pays.",
      "Pour les familles installées dans le Randstad, la radio marocaine en streaming permet aux enfants nés aux Pays-Bas d'entendre quotidiennement la darija et le tarifit, même quand leurs parents passent au néerlandais à la maison. C'est un outil de transmission linguistique et culturelle inestimable, gratuit et accessible 24 heures sur 24.",
      "Le lecteur audio fonctionne sur ordinateur, smartphone, tablette et smart TV. La qualité du flux s'adapte automatiquement à la connexion (4G, 5G, fibre KPN ou Ziggo). Notre catalogue est mis à jour quotidiennement et nous travaillons en permanence à enrichir l'offre disponible pour la diaspora marocaine néerlandaise.",
    ],
    ar_body: [
      'تستضيف هولندا جالية مغربية يفوق عددها 400 ألف شخص، أغلبهم من أبناء منطقة الريف (إقليمي الحسيمة والناظور). تتمركز هذه الجالية أساساً في أمستردام وروتردام ولاهاي وأوتريخت، وتلعب دوراً اقتصادياً وثقافياً مهماً منذ موجات الهجرة في الستينات والسبعينات.',
      'بالنسبة لأبناء الجالية، يبقى الراديو وسيلة يومية للتواصل مع الوطن. عبر منصتنا، يمكنك الاستماع مجاناً ودون تسجيل إلى جميع الإذاعات المغربية الكبرى من أي مدينة هولندية. الريفيون المقيمون في هولندا يستمتعون بشكل خاص بالبرامج الناطقة بالتاريفيت في يابلادي أزوان أمازيغ وراديو أشكيد إف إم. أما للموسيقى العامة والأخبار، فتحتل هيت راديو وميدي1 وشدى إف إم الصدارة.',
      'الجالية الريفية في أمستردام وروتردام مرتبطة ارتباطاً قوياً بالموسيقى الشمالية: الركادة، إزلان، أحيدوس. منصتنا توفر عدة محطات تبث هذه الأنواع، إضافة إلى إذاعات الموسيقى الشعبية التي تغطي جميع الأنماط الشعبية المغربية. خلال الأعراس والاحتفالات في هولندا، كثيراً ما تُشغل هذه الإذاعات لإعادة خلق أجواء البلد.',
      'بالنسبة للعائلات المقيمة في منطقة راندستاد، تتيح الإذاعة المغربية عبر الأنترنت للأطفال المولودين في هولندا فرصة الاستماع اليومي للدارجة والتاريفيت، حتى عندما يتحدث الآباء الهولندية في البيت. إنها أداة قيمة لنقل اللغة والثقافة، متاحة مجاناً على مدار الساعة.',
      'يعمل المشغل على الحاسوب والهاتف واللوحة والتلفاز الذكي. تتكيف جودة البث تلقائياً مع الاتصال (4G، 5G، ألياف KPN أو Ziggo). يتم تحديث الكتالوج يومياً، ونعمل باستمرار على إثراء العروض المتاحة للجالية المغربية في هولندا.',
    ],
  },

  espagne: {
    fr_path: '/radio-maroc-espagne',
    ar_path: '/ar/min-isbania',
    hreflang: 'ar-ES',
    countryCode: 'ES',
    fr_country: 'Espagne',
    ar_country: 'إسبانيا',
    fr_title: 'Radio Maroc en Espagne — Écouter les radios marocaines depuis Madrid, Barcelone, Málaga',
    ar_title: 'إذاعات المغرب من إسبانيا — راديو المغرب مباشر من مدريد وبرشلونة ومالقة',
    fr_description:
      'Diaspora marocaine en Espagne : écoutez en direct Hit Radio, Medi 1, Chada FM, Radio Mars depuis Madrid, Barcelone, Málaga, Murcie, Algésiras. Streaming HD gratuit.',
    ar_description:
      'الجالية المغربية في إسبانيا، استمع إلى الإذاعات المغربية المباشرة من مدريد وبرشلونة ومالقة ومرسية. أكثر من 50 محطة، مجاناً وبجودة عالية.',
    fr_h1: 'Radio Maroc en Espagne — Streaming en direct depuis la péninsule ibérique',
    ar_h1: 'إذاعات المغرب من إسبانيا — البث المباشر من شبه الجزيرة الإيبيرية',
    fr_body: [
      "L'Espagne abrite près d'un million de personnes d'origine marocaine, ce qui en fait l'une des plus importantes diasporas du royaume. La proximité géographique avec le détroit de Gibraltar a favorisé une migration soutenue depuis les années 1990, principalement vers l'Andalousie (Málaga, Algésiras), la Catalogne (Barcelone, Tarragone), Madrid, la région de Murcie et les enclaves de Ceuta et Melilla.",
      "Pour cette diaspora très active, l'écoute des radios marocaines fait partie du quotidien. Sur notre plateforme, vous accédez à plus de 50 stations FM et webradios marocaines en streaming HD, gratuitement, depuis n'importe quelle ville espagnole. Les flux fonctionnent aussi bien à Madrid qu'à Algésiras ou aux Canaries, sans VPN.",
      "Les Marocains d'Espagne sont nombreux à écouter Hit Radio pour les hits internationaux, Medi 1 Radio pour l'information bilingue franco-arabe, Chada FM pour la musique pop et chaabi, Radio Mars pour le sport. Les travailleurs saisonniers de l'agriculture (Almería, Huelva) qui passent l'année entre l'Espagne et le Maroc utilisent quotidiennement la radio pour rester informés de l'actualité du royaume.",
      "Andalousie et Maroc partagent une histoire culturelle profonde, notamment à travers la musique andalouse arabo-andalouse. Sur Radio Maroc, nous diffusons Medi 1 Andalouse et Medi 1 Tarab — deux stations dédiées à ce patrimoine. Les amateurs de musique andalouse à Grenade, Cordoue ou Séville y trouvent une bande-son idéale, qui prolonge la mémoire de l'héritage al-Andalus.",
      "Pendant le Ramadan, l'écoute des radios religieuses (Radio Coran, Al Quran Radio, Radio Manarat) augmente fortement parmi les Marocains d'Espagne. Beaucoup de familles allument la radio au moment de l'adhan, créant un lien sonore avec le Maroc à des centaines de kilomètres. Notre lecteur audio fonctionne 24 heures sur 24, sans coupure.",
    ],
    ar_body: [
      'تستضيف إسبانيا حوالي مليون شخص من أصل مغربي، مما يجعلها واحدة من أكبر الجاليات المغربية في العالم. القرب الجغرافي عبر مضيق جبل طارق ساهم في تنامي الهجرة منذ التسعينات، خاصة نحو الأندلس (مالقة، الجزيرة الخضراء)، كاطالونيا (برشلونة، طاراغونا)، مدريد، منطقة مرسية إضافة إلى سبتة ومليلية.',
      'بالنسبة لهذه الجالية النشيطة، يشكل الاستماع إلى الإذاعات المغربية جزءاً من الحياة اليومية. عبر منصتنا، يمكنك الوصول إلى أكثر من 50 محطة FM وإذاعة على الأنترنت، بجودة عالية ومجاناً، من أي مدينة إسبانية. تعمل البثوث في مدريد كما في الجزيرة الخضراء أو جزر الكناري، دون الحاجة إلى VPN.',
      'يستمع المغاربة في إسبانيا بكثرة إلى هيت راديو للموسيقى العالمية، ميدي1 للأخبار باللغتين العربية والفرنسية، شدى إف إم للموسيقى الشعبية، وراديو مارس للرياضة. كما يستعمل العمال الموسميون في القطاع الفلاحي (ألميرية وهويلفا) الذين يقضون السنة بين إسبانيا والمغرب، الراديو كوسيلة يومية للبقاء على اطلاع بأخبار الوطن.',
      'الأندلس والمغرب يتشاركان تاريخاً ثقافياً عميقاً، خاصة من خلال الموسيقى العربية الأندلسية. على منصتنا، نبث ميدي1 الأندلسية وميدي1 طرب، وهما محطتان مخصصتان لهذا الإرث. عشاق الموسيقى الأندلسية في غرناطة وقرطبة وإشبيلية يجدون فيهما أجمل ما يمتد إرث الأندلس.',
      'خلال شهر رمضان، يزداد الاستماع إلى الإذاعات الدينية (راديو القرآن، إذاعة منارات) بشكل كبير بين أبناء الجالية في إسبانيا. كثير من العائلات تُشغل الراديو وقت الأذان، مما يخلق رابطاً صوتياً مع المغرب على بعد مئات الكيلومترات. مشغلنا يعمل على مدار الساعة دون انقطاع.',
    ],
  },

  italie: {
    fr_path: '/radio-maroc-italie',
    ar_path: '/ar/min-italia',
    hreflang: 'ar-IT',
    countryCode: 'IT',
    fr_country: 'Italie',
    ar_country: 'إيطاليا',
    fr_title: "Radio Maroc en Italie — Écouter les radios marocaines depuis Milan, Turin, Rome",
    ar_title: 'إذاعات المغرب من إيطاليا — راديو المغرب مباشر من ميلانو وتورينو وروما',
    fr_description:
      "Diaspora marocaine d'Italie : écoutez Hit Radio, Medi 1, Chada FM depuis Milan, Turin, Bologne, Rome, Naples. Plus de 50 radios FM marocaines en streaming HD gratuit.",
    ar_description:
      'الجالية المغربية في إيطاليا، استمع إلى الإذاعات المغربية مباشرة من ميلانو وتورينو وبولونيا وروما ونابولي. أكثر من 50 محطة، مجاناً.',
    fr_h1: 'Radio Maroc en Italie — Toutes les radios marocaines en direct',
    ar_h1: 'إذاعات المغرب من إيطاليا — جميع راديوهات المغرب مباشرة',
    fr_body: [
      "L'Italie est le 4ᵉ pays d'accueil de la diaspora marocaine en Europe, avec plus de 450 000 résidents d'origine marocaine concentrés en Lombardie (Milan, Brescia), au Piémont (Turin), en Émilie-Romagne (Bologne, Modène) et dans le Latium (Rome). C'est l'une des communautés les plus dynamiques sur le plan associatif et entrepreneurial.",
      "Sur Radio Maroc, vous écoutez en direct toutes les grandes radios marocaines depuis l'Italie : Hit Radio, Medi 1 Radio, Chada FM, Radio Mars, MFM, Medina FM. La plateforme est gratuite, sans inscription, sans VPN, et fonctionne aussi bien depuis le centre de Milan qu'à Palerme, Naples ou Trieste.",
      "Les Marocains de Lombardie et du Piémont travaillent souvent dans les transports, la construction, l'agroalimentaire et la restauration. La radio les accompagne pendant les longs trajets, sur les chantiers, dans les cuisines. C'est un fil rouge sonore qui rappelle le pays à chaque moment de la journée.",
      "Pour les familles installées en Italie, notre plateforme est aussi un outil pédagogique : elle permet aux enfants nés en Italie d'entendre quotidiennement la darija et la fusha, à travers les programmes d'information de Medi 1, les chansons de Chada FM ou les récitations de Radio Coran. Beaucoup de parents l'utilisent pendant le repas du soir pour transmettre la langue maternelle.",
      "Pendant le mois sacré du Ramadan, l'écoute des radios religieuses augmente fortement parmi la diaspora italo-marocaine. Radio Coran, Al Quran Radio et Radio Manarat sont écoutées dans les foyers de Milan, Turin et Rome au moment de l'iftar et du suhoor. Notre service fonctionne 24 heures sur 24, avec une qualité audio HD adaptée à toutes les connexions italiennes (TIM, Vodafone, Wind, fibre Open Fiber).",
    ],
    ar_body: [
      'تعتبر إيطاليا رابع دولة أوروبية في استقبال الجالية المغربية، حيث يقيم بها أكثر من 450 ألف مقيم من أصل مغربي يتمركزون في لومبارديا (ميلانو، بريشيا)، بييمونتي (تورينو)، إميليا رومانيا (بولونيا، مودينا) ولاتسيو (روما). تعد هذه الجالية من أكثر الجاليات نشاطاً على مستوى العمل الجمعوي والمقاولاتي.',
      'عبر منصتنا، يمكنك الاستماع مباشرة إلى جميع الإذاعات المغربية الكبرى من إيطاليا: هيت راديو، ميدي1، شدى إف إم، راديو مارس، MFM، ومدينة إف إم. المنصة مجانية، بدون تسجيل أو VPN، وتعمل بنفس الجودة في وسط ميلانو كما في باليرمو ونابولي وترييستي.',
      'يعمل المغاربة في لومبارديا وبييمونتي في قطاعات النقل، البناء، الصناعات الغذائية والمطاعم. الراديو يرافقهم في الرحلات الطويلة، في الأوراش وفي المطابخ. إنه خيط صوتي يربطهم بالوطن في كل لحظات اليوم.',
      'بالنسبة للعائلات المقيمة في إيطاليا، تشكل منصتنا أداة تعليمية مهمة: تتيح للأطفال المولودين في إيطاليا فرصة الاستماع اليومي للدارجة والفصحى، من خلال نشرات ميدي1، أغاني شدى إف إم وقراءات راديو القرآن. يستخدمها كثير من الآباء خلال وجبة العشاء لنقل اللغة الأم.',
      'خلال شهر رمضان الكريم، يزداد الاستماع إلى الإذاعات الدينية بشكل ملحوظ بين أبناء الجالية الإيطالية المغربية. راديو القرآن، إذاعة منارات وراديو القرآن الكريم تُستمع إليها في بيوت ميلانو وتورينو وروما وقت الإفطار والسحور. الخدمة متاحة على مدار الساعة، بجودة صوتية عالية تتكيف مع جميع شبكات الأنترنت الإيطالية (TIM، فودافون، Wind، Open Fiber).',
    ],
  },

  allemagne: {
    fr_path: '/radio-maroc-allemagne',
    ar_path: '/ar/min-almania',
    hreflang: 'ar-DE',
    countryCode: 'DE',
    fr_country: 'Allemagne',
    ar_country: 'ألمانيا',
    fr_title: 'Radio Maroc en Allemagne — Écouter les radios marocaines depuis Berlin, Francfort, Munich',
    ar_title: 'إذاعات المغرب من ألمانيا — راديو المغرب مباشر من برلين وفرانكفورت وميونخ',
    fr_description:
      "Diaspora marocaine d'Allemagne, écoutez Hit Radio, Medi 1, Chada FM, Radio Mars depuis Berlin, Francfort, Munich, Hambourg, Cologne. Plus de 50 stations en streaming HD gratuit.",
    ar_description:
      'الجالية المغربية في ألمانيا، استمع إلى الإذاعات المغربية المباشرة من برلين وفرانكفورت وميونخ وهامبورغ وكولونيا. أكثر من 50 محطة، مجاناً.',
    fr_h1: "Radio Maroc en Allemagne — Streaming en direct depuis l'Allemagne",
    ar_h1: 'إذاعات المغرب من ألمانيا — البث المباشر من ألمانيا',
    fr_body: [
      "L'Allemagne accueille une diaspora marocaine d'environ 200 000 personnes, en croissance constante depuis les années 2000. La communauté est principalement présente à Francfort, Berlin, Munich, Hambourg, Cologne et Düsseldorf — souvent dans des secteurs hautement qualifiés (ingénierie, médecine, tech).",
      "Sur Radio Maroc, vous écoutez en direct plus de 50 stations FM et webradios marocaines depuis n'importe quelle ville allemande. Le service est gratuit, sans inscription, et fonctionne avec toute connexion (Vodafone, O2, Telekom, Deutsche Glasfaser).",
      "Les Marocains d'Allemagne plébiscitent particulièrement Hit Radio (musique pop urbaine), Medi 1 Radio (information bilingue), Chada FM (chaabi et raï), Radio Mars (sport) et Radio Coran (spiritualité). Pour la communauté berbère du Souss, du Rif et de l'Atlas installée en Bavière ou en Hesse, nous proposons Yabiladi Azawan Amazigh, Radio Atbir et Radio Achkid FM.",
      "Pour les médecins, ingénieurs et étudiants marocains des grandes universités allemandes (TU Munich, RWTH Aix-la-Chapelle, Heidelberg, Humboldt), la radio en streaming offre un moyen simple de se reconnecter au pays après une longue journée de travail ou de cours. C'est un outil d'apaisement, de divertissement et de transmission culturelle.",
      "Pendant le mois de Ramadan, l'écoute des radios religieuses connaît un pic considérable. Les imams et lecteurs de Coran marocains diffusent depuis Casablanca, Rabat, Marrakech, et leurs voix sont audibles à Berlin, Munich ou Hambourg en HD, sans décalage perceptible. Notre lecteur fonctionne 24 heures sur 24 et s'adapte automatiquement à la qualité de votre connexion.",
    ],
    ar_body: [
      'تستضيف ألمانيا جالية مغربية يبلغ عددها حوالي 200 ألف شخص، في نمو مستمر منذ بداية الألفية. تتمركز هذه الجالية أساساً في فرانكفورت، برلين، ميونخ، هامبورغ، كولونيا ودوسلدورف، وغالباً ما تعمل في قطاعات عالية المهارات (الهندسة، الطب، التكنولوجيا).',
      'عبر منصتنا، يمكنك الاستماع مباشرة إلى أكثر من 50 محطة FM وإذاعة على الأنترنت من أي مدينة ألمانية. الخدمة مجانية، بدون تسجيل، وتعمل مع جميع شبكات الأنترنت (فودافون، O2، تيليكوم، Deutsche Glasfaser).',
      'يفضل المغاربة المقيمون في ألمانيا الاستماع بشكل خاص إلى هيت راديو (الموسيقى الحضرية)، ميدي1 (الأخبار باللغتين)، شدى إف إم (الشعبي والراي)، راديو مارس (الرياضة) وراديو القرآن (الروحانيات). أما المغاربة الأمازيغيون من السوس والريف والأطلس المقيمون في بافاريا أو هيسن، فنوفر لهم يابلادي أزوان أمازيغ، راديو أتبير وراديو أشكيد إف إم.',
      'بالنسبة للأطباء والمهندسين والطلبة المغاربة في الجامعات الألمانية الكبرى (تو ميونخ، RWTH آخن، هايدلبرغ، هومبولت)، فإن الإذاعة عبر الأنترنت تتيح وسيلة سهلة لإعادة الاتصال بالوطن بعد يوم طويل من العمل أو الدراسة. إنها وسيلة للراحة والترفيه ونقل الثقافة.',
      'خلال شهر رمضان، يبلغ الاستماع إلى الإذاعات الدينية ذروته. الأئمة وقراء القرآن المغاربة يبثون من الدار البيضاء والرباط ومراكش، وأصواتهم مسموعة في برلين وميونخ وهامبورغ بجودة عالية ودون تأخير. مشغلنا يعمل على مدار الساعة ويتكيف تلقائياً مع جودة الاتصال لديك.',
    ],
  },

  canada: {
    fr_path: '/radio-maroc-canada',
    ar_path: '/ar/min-kanada',
    hreflang: 'ar-CA',
    countryCode: 'CA',
    fr_country: 'Canada',
    ar_country: 'كندا',
    fr_title: 'Radio Maroc au Canada — Écouter les radios marocaines depuis Montréal, Toronto, Québec',
    ar_title: 'إذاعات المغرب من كندا — راديو المغرب مباشر من مونتريال وتورنتو وكيبيك',
    fr_description:
      "Diaspora marocaine du Canada, écoutez Hit Radio, Medi 1, Chada FM, Radio Mars depuis Montréal, Québec, Toronto, Ottawa, Vancouver. Streaming HD gratuit pour les MRE.",
    ar_description:
      'الجالية المغربية في كندا، استمع إلى الإذاعات المغربية المباشرة من مونتريال وكيبيك وتورنتو وأوتاوا وفانكوفر. أكثر من 50 محطة، مجاناً.',
    fr_h1: 'Radio Maroc au Canada — Streaming en direct depuis Montréal',
    ar_h1: 'إذاعات المغرب من كندا — البث المباشر من مونتريال',
    fr_body: [
      "Le Canada accueille la plus importante diaspora marocaine d'Amérique du Nord, avec environ 100 000 personnes d'origine marocaine, principalement installées au Québec (Montréal, Laval, Québec) et en Ontario (Toronto, Ottawa). Cette communauté, très qualifiée, est arrivée par vagues successives à partir des années 1990, séduite par les programmes d'immigration économique du gouvernement canadien.",
      "Pour cette diaspora éloignée du Maroc de plusieurs milliers de kilomètres, la radio en streaming est un véritable cordon ombilical avec le pays. Sur Radio Maroc, vous écoutez gratuitement en direct toutes les radios marocaines depuis Montréal, Toronto ou Vancouver, sans VPN, sans décalage notable, sans inscription.",
      "Les Marocains du Canada apprécient particulièrement Hit Radio, Medi 1 Radio, Chada FM, Radio Mars et MFM. Pour la diaspora francophone établie au Québec, Medi 1 Radio (bilingue français-arabe) est la station de référence pour suivre l'actualité marocaine en direct. Les fans de musique chaabi et raï se tournent vers Chada FM et Yabiladi Chaabi Maroc.",
      "Le décalage horaire (-5 h GMT à Montréal, -8 h GMT à Vancouver) signifie que beaucoup de Marocains du Canada écoutent les programmes du soir marocain le matin canadien — une façon agréable de commencer la journée avec les voix du pays. Le service fonctionne 24 heures sur 24 et s'adapte automatiquement à la qualité de votre connexion (Bell, Rogers, Telus, Vidéotron).",
      "Pendant le mois sacré du Ramadan, beaucoup de familles marocaines de Montréal allument la radio au moment de l'adhan retransmis depuis le Maroc, créant un pont sonore entre les deux continents. Pour les enfants nés au Canada, c'est aussi une façon de maintenir un contact quotidien avec la darija, la culture et la spiritualité du pays d'origine de leurs parents.",
    ],
    ar_body: [
      'تستضيف كندا أكبر جالية مغربية في أمريكا الشمالية، حيث يقيم بها حوالي 100 ألف شخص من أصل مغربي، أغلبهم في كيبيك (مونتريال، لافال، مدينة كيبيك) وأونتاريو (تورنتو، أوتاوا). هذه الجالية، التي تتميز بمستوى تعليمي عال، وصلت في موجات متتالية منذ التسعينات، مستفيدة من برامج الهجرة الاقتصادية الكندية.',
      'بالنسبة لهذه الجالية البعيدة عن المغرب بآلاف الكيلومترات، تشكل الإذاعة عبر الأنترنت حبلاً سرياً حقيقياً يربطها بالبلد الأم. عبر منصتنا، يمكنك الاستماع مجاناً ومباشرة إلى جميع الإذاعات المغربية من مونتريال أو تورنتو أو فانكوفر، دون VPN، دون تأخير ملحوظ، دون تسجيل.',
      'يحب المغاربة المقيمون في كندا الاستماع بشكل خاص إلى هيت راديو، ميدي1، شدى إف إم، راديو مارس وMFM. بالنسبة للجالية الناطقة بالفرنسية المقيمة في كيبيك، تعد ميدي1 (باللغتين العربية والفرنسية) الإذاعة المرجعية لمتابعة الأخبار المغربية مباشرة. أما عشاق الموسيقى الشعبية والراي فيتجهون إلى شدى إف إم ويابلادي شعبي.',
      'فارق التوقيت (-5 ساعات بمونتريال، -8 ساعات بفانكوفر) يعني أن العديد من المغاربة الكنديين يستمعون إلى برامج المساء المغربية في الصباح الكندي، طريقة لطيفة لبدء اليوم بأصوات الوطن. الخدمة تعمل على مدار الساعة وتتكيف تلقائياً مع جودة الاتصال (Bell، Rogers، Telus، Vidéotron).',
      'خلال شهر رمضان الكريم، تشغل العديد من العائلات المغربية في مونتريال الراديو وقت الأذان المنقول من المغرب، مما يخلق جسراً صوتياً بين القارتين. بالنسبة للأطفال المولودين في كندا، يعد هذا أيضاً طريقة للحفاظ على تواصل يومي مع الدارجة والثقافة والروحانيات في بلد آبائهم.',
    ],
  },

  amerique: {
    fr_path: '/radio-maroc-amerique',
    ar_path: '/ar/min-amrika',
    hreflang: 'ar-US',
    countryCode: 'US',
    fr_country: 'États-Unis',
    ar_country: 'أمريكا',
    fr_title: 'Radio Maroc aux USA — Écouter les radios marocaines depuis New York, Washington, Los Angeles',
    ar_title: 'إذاعات المغرب من أمريكا — راديو المغرب مباشر من نيويورك وواشنطن ولوس أنجلوس',
    fr_description:
      "Diaspora marocaine aux États-Unis, écoutez Hit Radio, Medi 1, Chada FM depuis New York, Washington, Boston, Houston, Los Angeles. Streaming HD gratuit, 24h/24.",
    ar_description:
      'الجالية المغربية في الولايات المتحدة، استمع إلى الإذاعات المغربية مباشرة من نيويورك وواشنطن وبوسطن وهيوستن ولوس أنجلوس. مجاناً وعلى مدار الساعة.',
    fr_h1: 'Radio Maroc aux États-Unis — Streaming en direct depuis les USA',
    ar_h1: 'إذاعات المغرب من أمريكا — البث المباشر من الولايات المتحدة',
    fr_body: [
      "La diaspora marocaine aux États-Unis compte environ 80 000 personnes, principalement installées dans le Nord-Est (New York, Boston, Washington DC), au Texas (Houston) et en Californie (Los Angeles, San Francisco). C'est une communauté très qualifiée, présente dans les secteurs de la finance, de la tech, du conseil et de la recherche universitaire.",
      "Sur Radio Maroc, les Marocains des USA accèdent gratuitement à plus de 50 radios FM et webradios marocaines en direct. La plateforme est accessible depuis tout l'État, sans VPN, et fonctionne avec n'importe quelle connexion (Verizon, T-Mobile, AT&T, Spectrum). Le décalage horaire ne pose aucun problème : la radio marocaine continue de diffuser 24 heures sur 24 quel que soit votre fuseau (-4 h à -7 h GMT).",
      "Hit Radio, Medi 1 Radio, Chada FM et Radio Mars sont les stations préférées de la diaspora américano-marocaine. Pour les Marocains travaillant à Wall Street, dans la Silicon Valley ou à Houston, la radio en streaming offre un moment de respiration culturelle entre deux meetings. C'est un retour express au bled, en un clic.",
      "Les communautés religieuses marocaines de New York, Boston et Washington (notamment autour des centres islamiques et des mosquées) écoutent quotidiennement Radio Coran, Al Quran Radio et Radio Manarat. Pendant le Ramadan, ces stations sont diffusées dans les centres communautaires, les restaurants halal et les foyers, recréant l'atmosphère du mois sacré.",
      "Pour les enfants américains d'origine marocaine, écouter quotidiennement la radio marocaine est l'un des moyens les plus efficaces de maintenir le contact avec la darija et la culture du pays. Beaucoup de parents installent un haut-parleur dans la cuisine et laissent Hit Radio ou Chada FM tourner pendant les repas — un rituel simple qui transmet la mémoire sonore du Maroc.",
    ],
    ar_body: [
      'تتكون الجالية المغربية في الولايات المتحدة الأمريكية من حوالي 80 ألف شخص، يقيمون بشكل رئيسي في الشمال الشرقي (نيويورك، بوسطن، واشنطن العاصمة)، في تكساس (هيوستن) وفي كاليفورنيا (لوس أنجلوس، سان فرانسيسكو). إنها جالية ذات مستوى تعليمي عال، تعمل في قطاعات المالية والتكنولوجيا والاستشارات والبحث الجامعي.',
      'عبر منصتنا، يصل المغاربة المقيمون في أمريكا مجاناً إلى أكثر من 50 محطة FM وإذاعة على الأنترنت مباشرة. المنصة متاحة من جميع الولايات، دون VPN، وتعمل مع أي اتصال (Verizon، T-Mobile، AT&T، Spectrum). فارق التوقيت لا يطرح أي مشكلة: البث المغربي يستمر على مدار الساعة بغض النظر عن منطقتك الزمنية (-4 إلى -7 ساعات).',
      'هيت راديو، ميدي1، شدى إف إم وراديو مارس هي أكثر الإذاعات استماعاً من طرف الجالية المغربية الأمريكية. بالنسبة للمغاربة العاملين في وول ستريت، في وادي السيليكون أو في هيوستن، تتيح الإذاعة عبر الأنترنت لحظة من الراحة الثقافية بين اجتماعين. إنها عودة سريعة إلى البلد بنقرة واحدة.',
      'الجاليات الدينية المغربية في نيويورك وبوسطن وواشنطن (خاصة حول المراكز الإسلامية والمساجد) تستمع يومياً إلى راديو القرآن، إذاعة منارات وراديو القرآن الكريم. خلال شهر رمضان، تُبث هذه الإذاعات في المراكز الجماعية والمطاعم الحلال والبيوت، لإعادة خلق أجواء الشهر الفضيل.',
      'بالنسبة للأطفال الأمريكيين من أصل مغربي، يعد الاستماع اليومي للإذاعة المغربية من أكثر الوسائل فعالية للحفاظ على التواصل مع الدارجة والثقافة المغربية. كثير من الآباء يضعون مكبر صوت في المطبخ ويتركون هيت راديو أو شدى إف إم تعمل خلال الوجبات: عادة بسيطة تنقل الذاكرة الصوتية للمغرب.',
    ],
  },

  mre: {
    fr_path: '/radio-maroc-mre',
    ar_path: '/ar/lil-jaliya',
    hreflang: 'ar',
    countryCode: 'MA',
    fr_country: 'MRE',
    ar_country: 'الجالية',
    fr_title: 'Radio Maroc pour la diaspora marocaine — MRE du monde entier',
    ar_title: 'إذاعات المغرب للجالية المغربية في الخارج — راديو المغرب لأبناء الجالية',
    fr_description:
      "Marocains résidant à l'étranger (MRE), restez connectés au pays. Plus de 50 radios marocaines en direct, accessibles 24h/24 depuis tous les continents. Gratuit, sans inscription.",
    ar_description:
      'لأبناء الجالية المغربية في الخارج، ابقوا على تواصل دائم مع الوطن. أكثر من 50 إذاعة مغربية مباشرة على مدار الساعة من جميع القارات. مجاناً وبدون تسجيل.',
    fr_h1: 'Radio Maroc pour les MRE — Le pays vous accompagne où que vous soyez',
    ar_h1: 'إذاعات المغرب للجالية المغربية في الخارج — الوطن معك أينما كنت',
    fr_body: [
      "Plus de 5 millions de Marocains vivent à l'étranger : c'est l'une des plus grandes diasporas au monde rapportée à la population du pays d'origine. Du Canada à l'Australie, de la France au Golfe, du Brésil à l'Allemagne, les Marocains résidant à l'étranger (MRE) jouent un rôle central dans l'économie marocaine — à travers leurs transferts d'argent, leurs investissements et leur engagement associatif.",
      "Pour ces 5 millions de personnes, la radio reste un médium fondamental. Contrairement à la télévision qui demande l'attention visuelle, la radio s'écoute pendant la cuisine, le travail, la conduite, le sport. Elle accompagne la journée sans la monopoliser. Sur Radio Maroc, vous accédez gratuitement à plus de 50 stations FM et webradios marocaines en direct, depuis n'importe quel pays du monde.",
      "Hit Radio, Medi 1 Radio, Chada FM, Radio Mars, MFM, Medi Radio : toutes les grandes stations marocaines diffusent leur signal sur notre plateforme. La diaspora francophone privilégie Medi 1 (bilingue franco-arabe) et Hit Radio. La diaspora arabophone se tourne vers Chada FM, Medina FM et MFM. Les communautés berbères du Souss et du Rif écoutent Yabiladi Azawan Amazigh, Radio Atbir et Radio Achkid FM.",
      "Pendant les grands moments du calendrier marocain — Ramadan, Aïd el-Fitr, Aïd al-Adha, Achoura, Mouloud — l'écoute des radios depuis l'étranger explose. Les MRE allument la radio au moment de l'adhan, écoutent les chansons traditionnelles de fête, suivent les transmissions officielles depuis le Palais royal. Notre plateforme reproduit cette ambiance partout dans le monde, sans VPN, sans coupure publicitaire intrusive.",
      "Que vous habitiez à Paris, Bruxelles, Rotterdam, Madrid, Milan, Berlin, Montréal, New York, Sydney ou Dubaï, Radio Maroc met le pays à votre portée. Notre lecteur audio fonctionne sur ordinateur, smartphone, tablette, smart TV, voiture connectée (CarPlay, Android Auto). La qualité du flux s'adapte automatiquement à votre débit. Le service est intégralement gratuit, financé par une publicité discrète qui ne perturbe jamais l'écoute.",
    ],
    ar_body: [
      'يعيش أكثر من 5 ملايين مغربي في الخارج: تعد هذه واحدة من أكبر الجاليات في العالم نسبة إلى عدد سكان البلد الأصلي. من كندا إلى أستراليا، من فرنسا إلى الخليج، من البرازيل إلى ألمانيا، يلعب أبناء الجالية المغربية دوراً محورياً في الاقتصاد المغربي من خلال التحويلات المالية والاستثمارات والعمل الجمعوي.',
      'بالنسبة لهؤلاء الخمسة ملايين شخص، يبقى الراديو وسيلة أساسية. على عكس التلفزيون الذي يتطلب الانتباه البصري، يمكن الاستماع للراديو أثناء الطبخ، العمل، القيادة والرياضة. إنه يرافق اليوم دون أن يحتكره. عبر منصتنا، يمكنك الوصول مجاناً إلى أكثر من 50 محطة إذاعية مغربية مباشرة، من أي بلد في العالم.',
      'هيت راديو، ميدي1، شدى إف إم، راديو مارس، MFM، ميد راديو: جميع الإذاعات المغربية الكبرى تبث برامجها على منصتنا. الجالية الناطقة بالفرنسية تفضل ميدي1 وهيت راديو. الناطقون بالعربية يتجهون إلى شدى إف إم ومدينة إف إم وMFM. أما الجاليات الأمازيغية من السوس والريف فتستمع إلى يابلادي أزوان أمازيغ، راديو أتبير وراديو أشكيد إف إم.',
      'خلال المناسبات الكبرى في الروزنامة المغربية - رمضان، عيد الفطر، عيد الأضحى، عاشوراء، المولد النبوي - يزداد الاستماع إلى الإذاعات من الخارج بشكل كبير. أبناء الجالية يشغلون الراديو وقت الأذان، يستمعون إلى الأغاني التقليدية للأعياد، يتابعون البث الرسمي من القصر الملكي. منصتنا تعيد إنتاج هذا الجو في جميع أنحاء العالم، دون VPN ودون إعلانات مزعجة.',
      'سواء كنت تقيم في باريس أو بروكسيل أو روتردام أو مدريد أو ميلانو أو برلين أو مونتريال أو نيويورك أو سيدني أو دبي، تجعل منصتنا الوطن في متناول يدك. مشغل الصوت يعمل على الحاسوب والهاتف واللوحة والتلفاز الذكي والسيارات المتصلة (CarPlay، Android Auto). جودة البث تتكيف تلقائياً مع سرعة الأنترنت. الخدمة مجانية بالكامل، تمول بإعلانات بسيطة لا تؤثر أبداً على الاستماع.',
    ],
  },

  etranger: {
    fr_path: '/radio-maroc-etranger',
    ar_path: '/ar/min-al-kharij',
    hreflang: 'ar',
    countryCode: 'MA',
    fr_country: "à l'étranger",
    ar_country: 'من الخارج',
    fr_title: "Radio Maroc depuis l'étranger — Écouter les radios marocaines partout dans le monde",
    ar_title: 'إذاعات المغرب من الخارج — استمع إلى راديو المغرب من أي بلد في العالم',
    fr_description:
      "Écoutez en direct toutes les radios marocaines depuis l'étranger : Hit Radio, Medi 1, Chada FM. Streaming HD 24h/24, sans VPN, sans inscription, depuis n'importe quel pays.",
    ar_description:
      'استمع مباشرة إلى جميع الإذاعات المغربية من خارج المغرب: هيت راديو، ميدي1، شدى إف إم. بث عالي الجودة على مدار الساعة، دون VPN ودون تسجيل.',
    fr_h1: "Radio Maroc depuis l'étranger — Le Maroc, à portée d'écoute partout",
    ar_h1: 'إذاعات المغرب من الخارج — المغرب على مسمعك في أي مكان',
    fr_body: [
      "Vous êtes à l'étranger en voyage d'affaires, en vacances, en mission diplomatique, en études ou en expatriation longue durée ? Vous voulez garder le contact avec l'actualité, la musique et la culture marocaines ? Notre plateforme est faite pour vous. Plus de 50 radios marocaines en direct, accessibles depuis n'importe quel pays, sans VPN, sans inscription, gratuitement.",
      "Que vous soyez à Doha, Dubaï, Riyad, Istanbul, Le Caire, Dakar, Abidjan, Casablanca-en-déplacement, Genève, Londres, Tokyo ou Sydney, Radio Maroc fonctionne. Notre infrastructure repose sur des CDN globaux qui assurent une diffusion sans coupure dans toutes les régions du monde. La qualité audio s'adapte automatiquement à votre débit, du Wi-Fi à la 5G, en passant par les réseaux satellitaires.",
      "Pour les voyageurs d'affaires, la radio en arrière-plan dans la chambre d'hôtel ou dans la voiture de location recrée instantanément l'ambiance du pays. Pour les diplomates marocains en poste, c'est un moyen quotidien de suivre l'actualité du royaume entre deux audiences. Pour les étudiants en année à l'étranger, c'est un fil quotidien vers la maison qui aide à combattre le mal du pays.",
      "Hit Radio, Medi 1 Radio, Chada FM et Radio Mars sont les stations les plus écoutées par les Marocains en déplacement. Pour les longs vols et les longs trajets, plusieurs stations offrent des flux ininterrompus de musique chaabi, raï, gnaoua, jazz oriental ou andalou — l'occasion idéale de redécouvrir le patrimoine musical du royaume sans distractions.",
      "Notre service est intégralement gratuit. Aucune inscription, aucun compte, aucun téléchargement d'application. Il suffit d'ouvrir notre site, de choisir une station, et d'écouter. Le lecteur fonctionne en arrière-plan : vous pouvez naviguer, lire vos emails, travailler — la radio marocaine continue à diffuser sans interruption.",
    ],
    ar_body: [
      'هل أنت خارج المغرب في رحلة عمل، عطلة، مهمة دبلوماسية، دراسة أو إقامة طويلة؟ هل تريد البقاء على اتصال بالأخبار والموسيقى والثقافة المغربية؟ منصتنا مصممة من أجلك. أكثر من 50 إذاعة مغربية مباشرة، متاحة من أي بلد، دون VPN، دون تسجيل، مجاناً.',
      'سواء كنت في الدوحة أو دبي أو الرياض أو إسطنبول أو القاهرة أو داكار أو أبيدجان أو جنيف أو لندن أو طوكيو أو سيدني، فإن منصتنا تعمل بشكل كامل. تعتمد بنيتنا التحتية على شبكات CDN العالمية التي تضمن بثاً متواصلاً في جميع مناطق العالم. تتكيف جودة الصوت تلقائياً مع سرعة الإنترنت لديك، من الواي فاي إلى 5G مروراً بالشبكات الفضائية.',
      'بالنسبة للمسافرين لأغراض العمل، يخلق تشغيل الراديو في غرفة الفندق أو سيارة الإيجار أجواء البلد على الفور. بالنسبة للدبلوماسيين المغاربة في مهامهم، إنها وسيلة يومية لمتابعة أخبار الوطن بين موعدين. وبالنسبة للطلبة في سنة دراسية بالخارج، إنها خيط يومي يقودهم إلى البيت ويساعد على مقاومة الحنين إلى الوطن.',
      'هيت راديو، ميدي1، شدى إف إم وراديو مارس هي أكثر الإذاعات استماعاً من طرف المغاربة المسافرين. بالنسبة للرحلات الطويلة، تقدم عدة محطات بثاً متواصلاً للموسيقى الشعبية والراي والكناوة والجاز الشرقي والأندلسي - فرصة مثالية لإعادة اكتشاف التراث الموسيقي للمملكة بعيداً عن التشويش.',
      'خدمتنا مجانية بالكامل. لا حاجة للتسجيل، لا حساب، لا تحميل لتطبيقات. يكفي فتح موقعنا، اختيار محطة، والاستماع. المشغل يعمل في الخلفية: يمكنك التصفح، قراءة بريدك، العمل - والإذاعة المغربية تستمر في البث دون انقطاع.',
    ],
  },
};

export const DIASPORA_KEYS = Object.keys(DIASPORA_COUNTRIES);
