/**
 * Émissions radio marocaines — pages éditoriales individuelles ciblant les
 * keywords à très fort volume autour des animateurs et programmes phares
 * (Mamoun Dribi, Soulayma, etc.). Format proche des SEO landings mais avec
 * un angle programme + horaires + animateur.
 *
 * Format d'entrée :
 *   {
 *     slug, slug_ar, station_id (lien vers /station/<id>),
 *     fr: { title, description, h1, intro, sections, faq, cta },
 *     ar: { … },
 *   }
 */

export const EMISSIONS = {
  'conseil-psy-mamoun-dribi': {
    slug: 'conseil-psy-mamoun-dribi',
    slug_ar: 'istichara-nafsiya-mamoun-dribi',
    fr_path: '/emissions/conseil-psy-mamoun-dribi',
    ar_path: '/ar/baramij/istichara-nafsiya-mamoun-dribi',
    station_id: 'med-radio',
    station_name: 'Med Radio',
    station_name_ar: 'ميد راديو',
    image: '/emissions/conseil-psy-mamoun-dribi.jpg',
    image_alt: 'Mamoun Moubarak Dribi en studio radio',
    image_alt_ar: 'مأمون مبارك دريبي في استوديو الإذاعة',
    datePublished: '2026-05-01',

    fr: {
      title: 'Conseil psy Mamoun Dribi sur Med Radio — Horaires & Émissions',
      description:
        "Tout sur Conseil psy avec Mamoun Moubarak Dribi sur Med Radio : horaires de diffusion, thèmes abordés, biographie de l'animateur. Écoutez en direct.",
      h1: 'Conseil psy avec Mamoun Moubarak Dribi sur Med Radio',
      intro:
        "Depuis plus d'une décennie, l'émission « Conseil psy » animée par Mamoun Moubarak Dribi s'est imposée comme l'une des programmes radio les plus écoutés du Maroc. Diffusée sur Med Radio, elle a brisé un tabou immense — celui de la santé mentale dans la société marocaine — en invitant chaque jour des auditeurs à parler librement de leurs souffrances, leurs doutes, leurs blessures intimes. Voici tout ce qu'il faut savoir.",
      sections: [
        {
          h2: "Qui est Mamoun Moubarak Dribi ?",
          p: "Mamoun Moubarak Dribi est psychologue clinicien et psychothérapeute, formé entre le Maroc et la France. Son parcours mêle études universitaires en psychologie, formations spécialisées en thérapie systémique et cognitive comportementale, et une longue pratique en cabinet. Il est devenu une figure incontournable du paysage médiatique marocain depuis qu'il anime « Conseil psy » sur Med Radio. Sa philosophie : rendre la parole psychologique accessible à tous, sans jargon, avec respect et pédagogie. Il intervient également dans la presse écrite et lors de conférences publiques au Maroc et dans la diaspora.",
        },
        {
          h2: "Le format de l'émission",
          p: "« Conseil psy » est un programme d'écoute et de conseil psychologique en direct. Le format est simple et redoutablement efficace : des auditeurs et auditrices appellent l'antenne pour exposer une situation personnelle (rupture, conflit familial, deuil, anxiété, problème de couple, doute existentiel) ; Mamoun Dribi écoute, reformule, pose des questions ouvertes, propose des pistes de réflexion. L'émission dure généralement entre une et deux heures, mêlant appels en direct, courriers d'auditeurs lus à l'antenne, et capsules thématiques préparées sur des questions de fond (estime de soi, parentalité, anxiété sociale, etc.).",
        },
        {
          h2: 'Horaires de diffusion',
          p: "« Conseil psy » est diffusée sur Med Radio plusieurs fois par semaine, en programmation principalement de jour. Les horaires exacts évoluent au fil des saisons radiophoniques — pour la grille en cours, consultez directement la page officielle de Med Radio ou le site medradio.ma. L'émission est généralement rediffusée et certaines séquences sont reprises en podcast. ",
          note: 'Horaire précis à confirmer auprès de Med Radio (les grilles évoluent chaque saison).',
        },
        {
          h2: 'Thèmes typiquement abordés',
          p: "Le spectre des sujets traités à l'antenne est volontairement large. Les relations de couple reviennent souvent — incompréhensions, jalousie, gestion de la rupture, démarche de divorce — tout comme la vie de famille au sens élargi : conflits parents-enfants, tensions entre frères et sœurs, rapports parfois électriques avec la belle-famille. Le deuil et la perte d'un proche occupent aussi une place importante, avec un accompagnement attentif pour traverser la culpabilité ou l'absence prolongée.",
          p2: "Sur le plan des troubles plus structurés, l'émission aborde régulièrement l'anxiété (crises de panique, phobies, troubles du sommeil) et la dépression — ses signaux discrets, son accompagnement, la sortie progressive de crise. Mamoun Dribi évoque également l'estime de soi, le manque d'affirmation, les complexes et le syndrome de l'imposteur, la pression sociale et culturelle ressentie au Maroc autour du mariage et du célibat tardif, et la traversée parfois orageuse de l'adolescence avec ses crises identitaires, ses formes de rébellion ou ses premières expérimentations à risque.",
        },
        {
          h2: "Pourquoi l'émission a un tel succès",
          p: "Au Maroc comme dans l'ensemble du monde arabe, la santé mentale reste un sujet largement tabou. Aller voir un « médecin de la tête » est encore perçu, dans certaines familles, comme un aveu de faiblesse ou un dysfonctionnement honteux. C'est précisément ce verrou que « Conseil psy » a fait sauter, en transformant la radio en espace d'écoute publique mais anonyme. L'auditeur peut appeler de chez lui, parler de ce qui le hante, et entendre Mamoun Dribi répondre avec bienveillance, sans jugement, sans cliché religieux ou moralisateur. Le succès tient aussi à l'accessibilité du langage : pas de jargon, des mots simples qui parlent à tout le monde.",
          p2: "Pour la diaspora marocaine, l'émission a joué un rôle particulier : permettre de retrouver une parole familière sur des questions intimes, dans une langue (la darija) qui touche les émotions plus directement que le français ou l'arabe classique. Beaucoup de Marocains résidant à l'étranger écoutent « Conseil psy » en streaming, comme un fil de continuité émotionnelle avec le pays.",
        },
        {
          h2: 'Autres émissions populaires sur les radios marocaines',
          p: "Le paysage radiophonique marocain offre plusieurs autres rendez-vous d'audience qui rythment la grille. Le « Momo Morning Show » sur Hit Radio installe l'humour et la pop urbaine au réveil des actifs casablancais. « Kolob Rahima » et les programmes religieux de Radio Mohammed VI accompagnent les fidèles à l'aube et avant le f'tour pendant le Ramadan. Côté info, les éditions matinales bilingues de Medi 1 Radio restent un repère ; côté sport, Radio Mars couvre la Botola Pro et les Lions de l'Atlas en direct. Enfin, plusieurs stations chaabi-pop comme Chada FM ou MFM proposent des matinales légères qui complètent l'offre.",
        },
        {
          h2: 'Comment écouter en direct',
          p_with_link: {
            before:
              "« Conseil psy » est diffusée en direct sur Med Radio, accessible gratuitement et sans inscription depuis n'importe quel pays. Vous pouvez l'écouter directement via notre lecteur intégré sur la ",
            link_text: 'page Med Radio',
            link_to: '/station/med-radio',
            after:
              ", sur ordinateur, smartphone, tablette ou enceinte connectée. Aucune application à télécharger : ouvrez le site, lancez la station, et profitez de l'émission.",
          },
        },
      ],
      faq: [
        {
          q: 'À quelle heure passe Conseil psy avec Mamoun Dribi ?',
          a: "« Conseil psy » est diffusée plusieurs fois par semaine sur Med Radio en programmation de jour. Les horaires précis varient selon les saisons radio. Consultez la grille à jour sur le site officiel de Med Radio ou écoutez en direct sur notre lecteur Med Radio pour ne pas manquer l'émission.",
        },
        {
          q: 'Sur quelle radio est diffusé Mamoun Dribi ?',
          a: "Mamoun Moubarak Dribi anime son émission « Conseil psy » sur Med Radio (groupe Hit Radio). La station est accessible en FM dans tout le Maroc et en streaming gratuit sur radiolive.ma.",
        },
        {
          q: 'Comment contacter Mamoun Dribi ?',
          a: "Pour participer à l'émission, vous pouvez appeler le standard de Med Radio pendant les heures de diffusion. Pour une consultation privée, Mamoun Dribi reçoit en cabinet — ses coordonnées professionnelles peuvent être trouvées via les annuaires de psychologues marocains et son site personnel.",
        },
        {
          q: 'Mamoun Dribi est-il psychologue ou psychiatre ?',
          a: "Mamoun Moubarak Dribi est psychologue clinicien et psychothérapeute. Il n'est pas psychiatre — il ne prescrit donc pas de médicaments. Sa pratique repose sur l'écoute, l'analyse et les approches thérapeutiques modernes (systémique, cognitive comportementale).",
        },
        {
          q: 'Peut-on écouter les anciennes émissions ?',
          a: "Med Radio met à disposition certaines séquences en podcast et en replay sur ses plateformes officielles (site, application, chaînes YouTube et SoundCloud). Toutes les émissions ne sont pas archivées publiquement, mais les meilleurs moments des dernières saisons sont régulièrement republiés.",
        },
      ],
    },

    ar: {
      title: 'استشارة نفسية مع مأمون مبارك دريبي على ميد راديو — مواعيد البث',
      description:
        'كل ما تريد معرفته عن برنامج الاستشارة النفسية مع مأمون مبارك دريبي على إذاعة ميد راديو: مواعيد البث، المواضيع، السيرة الذاتية. استمع مباشرة.',
      h1: 'الاستشارة النفسية مع مأمون مبارك دريبي على ميد راديو',
      intro:
        'منذ أكثر من عقد من الزمن، فرض برنامج "الاستشارة النفسية" الذي يقدمه مأمون مبارك دريبي نفسه كأحد أكثر البرامج الإذاعية استماعاً في المغرب. يُبث على إذاعة ميد راديو، وقد كسر حاجزاً ضخماً — حاجز الصحة النفسية في المجتمع المغربي — بدعوته يومياً للمستمعين للتحدث بحرية عن معاناتهم وشكوكهم وجراحهم الحميمة. إليك كل ما تحتاج معرفته.',
      sections: [
        {
          h2: 'من هو مأمون مبارك دريبي؟',
          p: 'مأمون مبارك دريبي هو أخصائي نفسي إكلينيكي ومعالج نفسي، تكوّن بين المغرب وفرنسا. مساره يجمع بين الدراسات الجامعية في علم النفس، التكوينات المتخصصة في العلاج الأسري والمعرفي السلوكي، وممارسة طويلة في عيادته. أصبح شخصية لا غنى عنها في المشهد الإعلامي المغربي منذ أن يقدم برنامج "الاستشارة النفسية" على ميد راديو. فلسفته: جعل الكلام النفسي في متناول الجميع، بدون مصطلحات معقدة، باحترام وتربية. يتدخل أيضاً في الصحافة المكتوبة وفي محاضرات عمومية في المغرب وفي بلاد المهجر.',
        },
        {
          h2: 'صيغة البرنامج',
          p: 'برنامج "الاستشارة النفسية" هو برنامج إنصات وإرشاد نفسي مباشر. الصيغة بسيطة وفعالة بشكل مذهل: مستمعون ومستمعات يتصلون بالأثير لطرح وضعية شخصية (انفصال، نزاع عائلي، حداد، قلق، مشكل زوجي، تساؤل وجودي)؛ يستمع مأمون دريبي، يعيد الصياغة، يطرح أسئلة مفتوحة، يقترح مسارات للتفكير. يستمر البرنامج عادة بين ساعة وساعتين، يجمع بين المكالمات المباشرة، رسائل المستمعين التي تُقرأ على الأثير، وكبسولات موضوعاتية معدة حول أسئلة جوهرية (تقدير الذات، الأبوة، القلق الاجتماعي، إلخ).',
        },
        {
          h2: 'مواعيد البث',
          p: 'يُبث برنامج "الاستشارة النفسية" على ميد راديو عدة مرات في الأسبوع، في برمجة نهارية أساساً. تتطور المواعيد الدقيقة عبر المواسم الإذاعية — للحصول على الجدول الحالي، راجع مباشرة الصفحة الرسمية لميد راديو أو موقع medradio.ma. عادة ما يُعاد بث البرنامج وتُلتقط بعض المقاطع في بودكاست.',
          note: 'الموعد الدقيق يُؤكَّد لدى ميد راديو (الجداول تتغير كل موسم).',
        },
        {
          h2: 'المواضيع المطروحة عادة',
          p: 'طيف المواضيع التي يعالجها البرنامج واسع عن قصد. تعود كثيراً العلاقات الزوجية — سوء الفهم، الغيرة، التعامل مع الانفصال، إجراءات الطلاق — وكذلك الحياة العائلية بمفهومها الواسع: نزاعات الآباء والأبناء، التوترات بين الإخوة والأخوات، والعلاقات المشحونة أحياناً مع أهل الزوج أو الزوجة. كما يحتل الحداد وفقدان العزيز مكانة مهمة، مع مرافقة دقيقة لتجاوز الشعور بالذنب أو الغياب الطويل.',
          p2: 'على مستوى الاضطرابات الأكثر تنظيماً، يطرح البرنامج بانتظام القلق (نوبات الهلع، الفوبيات، اضطرابات النوم) والاكتئاب — إشاراته الخفية، طرق مرافقته، والخروج التدريجي من الأزمة. يعرّج مأمون دريبي أيضاً على تقدير الذات، نقص الحزم، العقد ومتلازمة المحتال، الضغط الاجتماعي والثقافي الذي يعيشه المغاربة حول الزواج والعزوبة المتأخرة، وعبور المراهقة العاصف أحياناً بأزماتها الهوياتية وأشكال التمرد أو التجارب الأولى المحفوفة بالمخاطر.',
        },
        {
          h2: 'لماذا يحظى البرنامج بهذا النجاح',
          p: 'في المغرب كما في مجمل العالم العربي، تبقى الصحة النفسية موضوعاً مُحاطاً بالطابوهات. الذهاب إلى "طبيب الرأس" لا يزال يُعتبر، في بعض العائلات، اعترافاً بضعف أو خللاً مخزياً. هذا بالضبط هو القفل الذي فتحه برنامج "الاستشارة النفسية"، بتحويله الراديو إلى فضاء إنصات عمومي لكن مجهول الهوية. يستطيع المستمع الاتصال من بيته، الحديث عما يؤرقه، وسماع مأمون دريبي يجيب بلطف، بدون حكم، بدون كليشيهات دينية أو وعظية. يكمن النجاح أيضاً في سهولة اللغة: لا مصطلحات معقدة، كلمات بسيطة تخاطب الجميع.',
          p2: 'بالنسبة لأبناء الجالية المغربية، لعب البرنامج دوراً خاصاً: السماح بإيجاد كلام مألوف حول أسئلة حميمية، بلغة (الدارجة) تلامس المشاعر مباشرة أكثر من الفرنسية أو العربية الفصحى. كثير من المغاربة المقيمين في الخارج يستمعون لـ"الاستشارة النفسية" عبر البث المباشر، كخيط استمرارية عاطفية مع البلد.',
        },
        {
          h2: 'برامج إذاعية مغربية أخرى مشهورة',
          p: 'يقدم المشهد الإذاعي المغربي مواعيد أخرى ذات نسب استماع عالية تطبع شبكة البرامج اليومية. "Momo Morning Show" على هيت راديو يفتتح الصباح بالضحك والبوب الحضري لشباب الدار البيضاء. أما "قلوب رحيمة" والبرامج الدينية على إذاعة محمد السادس فترافق المؤمنين عند الفجر وقبل الإفطار خلال رمضان. على صعيد الأخبار، تبقى النشرات الصباحية الثنائية اللغة على ميدي1 مرجعاً؛ وعلى صعيد الرياضة، يغطي راديو مارس البطولة الاحترافية ومباريات أسود الأطلس مباشرة. أخيراً، تقدم محطات الشعبي والبوب مثل شدى إف إم أو إم إف إم برامج صباحية خفيفة تكمل العرض.',
        },
        {
          h2: 'كيف تستمع مباشرة',
          p_with_link: {
            before:
              'يُبث برنامج "الاستشارة النفسية" مباشرة على ميد راديو، متاحاً مجاناً وبدون تسجيل من أي بلد. يمكنك الاستماع إليه مباشرة عبر مشغلنا المدمج في ',
            link_text: 'صفحة ميد راديو',
            link_to: '/ar/station/med-radio',
            after:
              '، على الحاسوب أو الهاتف الذكي أو اللوحة أو السماعة المتصلة. لا تطبيق للتحميل: افتح الموقع، اضغط على المحطة، واستمتع بالبرنامج.',
          },
        },
      ],
      faq: [
        {
          q: 'في أي ساعة يُبث برنامج الاستشارة النفسية مع مأمون دريبي؟',
          a: 'يُبث برنامج "الاستشارة النفسية" عدة مرات في الأسبوع على ميد راديو في البرمجة النهارية. تختلف المواعيد الدقيقة حسب المواسم الإذاعية. راجع الجدول المحدّث على الموقع الرسمي لميد راديو أو استمع مباشرة عبر مشغلنا حتى لا تفوت البرنامج.',
        },
        {
          q: 'على أي إذاعة يُبث مأمون دريبي؟',
          a: 'يقدم مأمون مبارك دريبي برنامجه "الاستشارة النفسية" على ميد راديو (مجموعة هيت راديو). المحطة متاحة في FM في كل المغرب وعبر البث المباشر مجاناً على radiolive.ma.',
        },
        {
          q: 'كيف يمكن الاتصال بمأمون دريبي؟',
          a: 'للمشاركة في البرنامج، يمكنك الاتصال بمكتب الاستقبال في ميد راديو خلال ساعات البث. للاستشارة الخاصة، يستقبل مأمون دريبي في عيادته — يمكن العثور على إحداثياته المهنية عبر دلائل الأخصائيين النفسيين المغاربة وموقعه الشخصي.',
        },
        {
          q: 'هل مأمون دريبي أخصائي نفسي أم طبيب نفسي؟',
          a: 'مأمون مبارك دريبي أخصائي نفسي إكلينيكي ومعالج نفسي. ليس طبيباً نفسياً — لا يصف إذن أدوية. ممارسته تقوم على الإنصات، التحليل والمقاربات العلاجية الحديثة (الأسرية، المعرفية السلوكية).',
        },
        {
          q: 'هل يمكن الاستماع للحلقات القديمة؟',
          a: 'تتيح ميد راديو بعض المقاطع في بودكاست وفي إعادة البث على منصاتها الرسمية (الموقع، التطبيق، قنوات يوتيوب وSoundCloud). ليست كل الحلقات مؤرشفة بشكل عمومي، لكن أفضل لحظات المواسم الأخيرة تُعاد بانتظام.',
        },
      ],
    },
  },
};

export const EMISSION_KEYS = Object.keys(EMISSIONS);

/**
 * Renvoie les émissions liées à une station donnée (id slugifié).
 * Utilisé par StationPage pour afficher un bloc "Émissions phares".
 */
export function getEmissionsByStation(stationId) {
  return EMISSION_KEYS
    .map((k) => EMISSIONS[k])
    .filter((e) => e.station_id === stationId);
}
