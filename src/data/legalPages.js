/**
 * Pages légales obligatoires (RGPD + loi marocaine 09-08).
 * Indispensables pour AdSense, Google Search Console, et conformité légale.
 *
 * Format : 4 pages × 2 langues (FR + AR), chacune avec :
 *   - title, description (meta SEO)
 *   - h1, intro
 *   - sections : [{ h2, p, p2?, ul? }]
 *   - lastUpdated (date ISO)
 */

export const LEGAL_PAGES = {
  'politique-confidentialite': {
    fr_path: '/politique-confidentialite',
    ar_path: '/ar/siyasa-khusousia',
    lastUpdated: '2026-05-06',

    fr: {
      title: 'Politique de confidentialité — Radio Live MA',
      description:
        "Politique de confidentialité de radiolive.ma : utilisation des cookies, AdSense, traitement des données conformément au RGPD et à la loi marocaine 09-08.",
      h1: 'Politique de confidentialité',
      intro:
        "Radio Live MA (radiolive.ma) respecte votre vie privée et s'engage à protéger vos données personnelles. Cette politique explique quelles données nous collectons, comment elles sont utilisées et vos droits, conformément au Règlement général sur la protection des données (RGPD) et à la loi marocaine 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.",
      sections: [
        {
          h2: 'Données collectées',
          p: "Lorsque vous visitez radiolive.ma, nous collectons automatiquement certaines informations techniques : adresse IP (anonymisée), type et version de navigateur, système d'exploitation, pages visitées, durée de visite, station radio écoutée, langue préférée. Ces données sont collectées via des cookies et des outils d'analyse.",
          p2: "Nous ne vous demandons aucune donnée personnelle directement (pas de formulaire d'inscription, pas de compte utilisateur). Si vous nous contactez par email, nous conservons uniquement les informations que vous nous transmettez volontairement (nom, email, message).",
        },
        {
          h2: 'Cookies et technologies similaires',
          p: "Notre site utilise des cookies pour améliorer votre expérience d'écoute et fournir certaines fonctionnalités. Les principales catégories sont :",
          ul: [
            "Cookies techniques (essentiels) : sauvegarde de vos favoris, langue préférée, dernière station écoutée — sans ces cookies, le site ne fonctionne pas correctement.",
            "Cookies de mesure d'audience (Google Analytics) : statistiques anonymisées de fréquentation pour améliorer le service.",
            "Cookies publicitaires (Google AdSense) : personnalisation des annonces affichées sur le site.",
          ],
          p2: "Vous pouvez à tout moment refuser ou supprimer les cookies non essentiels via les paramètres de votre navigateur. Le refus des cookies de mesure ou publicitaires n'empêche pas l'utilisation du site.",
        },
        {
          h2: 'Publicité Google AdSense',
          p: "Radiolive.ma utilise Google AdSense pour afficher des publicités. Google peut utiliser des cookies pour servir des annonces basées sur vos visites précédentes sur ce site et d'autres sites. Vous pouvez désactiver la publicité personnalisée à tout moment en visitant la page des paramètres publicitaires de Google : https://www.google.com/settings/ads. Pour plus d'informations sur les pratiques de Google en matière de publicité, consultez https://policies.google.com/technologies/ads.",
        },
        {
          h2: 'Streaming audio et tiers',
          p: "Radiolive.ma agrège les flux audio publics fournis par les radios marocaines (Hit Radio, Radio Mars, Medi 1, etc.). Lorsque vous écoutez une station, votre lecteur audio se connecte directement aux serveurs de la radio en question (généralement Akamai, Infomaniak, Zeno.fm, Radioking). Ces tiers peuvent collecter votre adresse IP et des données techniques selon leurs propres politiques de confidentialité, sur lesquelles nous n'avons aucun contrôle.",
        },
        {
          h2: 'Conservation des données',
          p: "Les données techniques (logs serveur, statistiques anonymisées) sont conservées pendant 12 mois maximum. Les cookies ont une durée de vie variable (de la session à 24 mois pour les cookies AdSense). Les emails reçus via le formulaire de contact sont conservés tant que nécessaire pour traiter votre demande, puis supprimés sous 12 mois.",
        },
        {
          h2: 'Vos droits',
          p: "Conformément au RGPD et à la loi 09-08, vous disposez des droits suivants concernant vos données personnelles :",
          ul: [
            "Droit d'accès : obtenir une copie des données que nous détenons sur vous.",
            "Droit de rectification : corriger des informations inexactes.",
            "Droit à l'effacement (« droit à l'oubli ») : demander la suppression de vos données.",
            "Droit à la limitation du traitement.",
            "Droit d'opposition au traitement (notamment pour la publicité ciblée).",
            "Droit à la portabilité des données.",
          ],
          p2: "Pour exercer ces droits, contactez-nous à l'adresse indiquée sur notre page Contact. Nous répondrons dans un délai d'un mois maximum. Vous pouvez également déposer une réclamation auprès de la CNDP (Commission Nationale de contrôle de la protection des Données à caractère Personnel) au Maroc, ou de l'autorité de protection des données de votre pays de résidence.",
        },
        {
          h2: 'Modifications de cette politique',
          p: "Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment pour refléter les évolutions légales ou techniques. La date de dernière mise à jour est indiquée en haut de cette page. Nous vous invitons à consulter régulièrement cette politique.",
        },
        {
          h2: 'Contact',
          p: "Pour toute question relative à cette politique de confidentialité ou au traitement de vos données personnelles, écrivez-nous à : contact@radiolive.ma",
        },
      ],
    },

    ar: {
      title: 'سياسة الخصوصية — راديو لايف المغرب',
      description:
        'سياسة الخصوصية لموقع radiolive.ma: استخدام ملفات تعريف الارتباط، إعلانات Google AdSense، معالجة البيانات وفقًا للائحة العامة لحماية البيانات والقانون المغربي 09-08.',
      h1: 'سياسة الخصوصية',
      intro:
        'يحترم موقع راديو لايف المغرب (radiolive.ma) خصوصيتك ويلتزم بحماية بياناتك الشخصية. توضح هذه السياسة البيانات التي نجمعها، وكيفية استخدامها، وحقوقك، وفقًا للائحة العامة لحماية البيانات (RGPD) والقانون المغربي 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي.',
      sections: [
        {
          h2: 'البيانات التي نجمعها',
          p: 'عند زيارتك لموقع radiolive.ma، نقوم تلقائيًا بجمع معلومات تقنية: عنوان IP (مجهول الهوية)، نوع المتصفح وإصداره، نظام التشغيل، الصفحات التي تمت زيارتها، مدة الزيارة، المحطة الإذاعية المستمع إليها، اللغة المفضلة. يتم جمع هذه البيانات عبر ملفات تعريف الارتباط وأدوات التحليل.',
          p2: 'لا نطلب منك أي بيانات شخصية مباشرة (لا يوجد نموذج تسجيل، لا حساب مستخدم). إذا اتصلت بنا عبر البريد الإلكتروني، فإننا نحتفظ فقط بالمعلومات التي ترسلها لنا طوعًا (الاسم، البريد الإلكتروني، الرسالة).',
        },
        {
          h2: 'ملفات تعريف الارتباط والتقنيات المماثلة',
          p: 'يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة الاستماع وتوفير بعض الوظائف. الفئات الرئيسية هي:',
          ul: [
            'ملفات تعريف الارتباط التقنية (الأساسية): حفظ المفضلة، اللغة المفضلة، آخر محطة تم الاستماع إليها — بدون هذه الملفات، لا يعمل الموقع بشكل صحيح.',
            'ملفات تعريف الارتباط لقياس الجمهور (Google Analytics): إحصائيات مجهولة الهوية لتحسين الخدمة.',
            'ملفات تعريف الارتباط الإعلانية (Google AdSense): تخصيص الإعلانات المعروضة.',
          ],
          p2: 'يمكنك في أي وقت رفض أو حذف ملفات تعريف الارتباط غير الأساسية عبر إعدادات متصفحك. رفض ملفات القياس أو الإعلانات لا يمنع استخدام الموقع.',
        },
        {
          h2: 'إعلانات Google AdSense',
          p: 'يستخدم radiolive.ma خدمة Google AdSense لعرض الإعلانات. قد تستخدم Google ملفات تعريف الارتباط لخدمة الإعلانات بناءً على زياراتك السابقة لهذا الموقع ومواقع أخرى. يمكنك إيقاف الإعلانات المخصصة في أي وقت بزيارة صفحة إعدادات إعلانات Google: https://www.google.com/settings/ads. لمزيد من المعلومات، راجع https://policies.google.com/technologies/ads.',
        },
        {
          h2: 'البث الصوتي والأطراف الثالثة',
          p: 'يجمع radiolive.ma التدفقات الصوتية العمومية المقدمة من الإذاعات المغربية (Hit Radio، Radio Mars، Medi 1، إلخ). عند الاستماع إلى محطة، يتصل مشغل الصوت لديك مباشرة بخوادم الإذاعة المعنية (عادة Akamai، Infomaniak، Zeno.fm، Radioking). قد تجمع هذه الأطراف الثالثة عنوان IP الخاص بك وبيانات تقنية وفقًا لسياسات الخصوصية الخاصة بها، والتي لا نملك أي تحكم فيها.',
        },
        {
          h2: 'الاحتفاظ بالبيانات',
          p: 'يتم الاحتفاظ بالبيانات التقنية (سجلات الخادم، الإحصائيات المجهولة الهوية) لمدة 12 شهرًا كحد أقصى. ملفات تعريف الارتباط لها مدة صلاحية متفاوتة (من الجلسة إلى 24 شهرًا لملفات AdSense). يتم الاحتفاظ بالرسائل المستلمة عبر نموذج الاتصال طالما كان ذلك ضروريًا لمعالجة طلبك، ثم يتم حذفها خلال 12 شهرًا.',
        },
        {
          h2: 'حقوقك',
          p: 'وفقًا للائحة العامة لحماية البيانات والقانون 09-08، تتمتع بالحقوق التالية بشأن بياناتك الشخصية:',
          ul: [
            'حق الوصول: الحصول على نسخة من البيانات التي نحتفظ بها عنك.',
            'حق التصحيح: تصحيح المعلومات غير الدقيقة.',
            'حق المحو ("الحق في النسيان"): طلب حذف بياناتك.',
            'حق تقييد المعالجة.',
            'حق الاعتراض على المعالجة (خاصة للإعلانات المستهدفة).',
            'حق نقل البيانات.',
          ],
          p2: 'لممارسة هذه الحقوق، اتصل بنا على العنوان الموجود في صفحة الاتصال. سنرد في غضون شهر على الأكثر. يمكنك أيضًا تقديم شكوى إلى اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP) في المغرب، أو إلى سلطة حماية البيانات في بلد إقامتك.',
        },
        {
          h2: 'تعديلات على هذه السياسة',
          p: 'نحتفظ بالحق في تعديل سياسة الخصوصية هذه في أي وقت لتعكس التطورات القانونية أو التقنية. تاريخ آخر تحديث مذكور في أعلى هذه الصفحة. ندعوك إلى مراجعة هذه السياسة بانتظام.',
        },
        {
          h2: 'اتصل بنا',
          p: 'لأي سؤال بخصوص سياسة الخصوصية هذه أو معالجة بياناتك الشخصية، اكتب إلينا على: contact@radiolive.ma',
        },
      ],
    },
  },

  'conditions-utilisation': {
    fr_path: '/conditions-utilisation',
    ar_path: '/ar/shoroot-isti3mal',
    lastUpdated: '2026-05-06',

    fr: {
      title: "Conditions d'utilisation — Radio Live MA",
      description:
        "Conditions générales d'utilisation de radiolive.ma : règles d'écoute, propriété intellectuelle, responsabilité, agrégation de flux radio marocains.",
      h1: "Conditions d'utilisation",
      intro:
        "Bienvenue sur Radio Live MA. En accédant et en utilisant le site radiolive.ma, vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le site.",
      sections: [
        {
          h2: 'Présentation du service',
          p: "Radio Live MA est un agrégateur gratuit de flux audio publics des radios marocaines. Le site permet d'écouter en streaming les principales stations radio du Maroc (Hit Radio, Radio Mars, Chada FM, Medi 1, Radio 2M, etc.) ainsi que des webradios spécialisées (musicales, religieuses, régionales). L'écoute est gratuite, sans inscription, sans téléchargement.",
        },
        {
          h2: "Propriété intellectuelle des contenus diffusés",
          p: "Les contenus audio diffusés sur radiolive.ma (programmes, chansons, jingles, voix d'animateurs) sont la propriété exclusive des radios qui les produisent. Radiolive.ma se contente de relayer les flux publics mis à disposition par chaque station via leurs URLs de streaming officielles. Nous ne stockons, ne réenregistrons et ne redistribuons aucun contenu audio. Nous agissons en simple agrégateur de liens.",
          p2: "Si vous êtes un ayant droit et estimez que la mise à disposition d'un flux particulier viole vos droits, contactez-nous à l'adresse indiquée sur notre page Contact. Nous traiterons votre demande dans les meilleurs délais.",
        },
        {
          h2: 'Propriété du site et marques',
          p: "Le design, les textes éditoriaux (descriptions de stations, articles de blog, pages SEO), les graphismes, le code source, et la marque « Radio Live MA » / « radiolive.ma » sont la propriété de Yassine Sarsar. Toute reproduction, distribution, modification ou utilisation commerciale sans autorisation écrite préalable est interdite.",
          p2: "Les noms et logos des radios marocaines (Hit Radio, Medi 1, Radio Mars, etc.) sont des marques déposées appartenant à leurs propriétaires respectifs et utilisés à titre informatif uniquement.",
        },
        {
          h2: 'Utilisation du site',
          p: "En utilisant radiolive.ma, vous vous engagez à :",
          ul: [
            "Ne pas tenter de contourner les mécanismes techniques du site (fragmentation des flux, scraping massif, attaques DDoS).",
            "Ne pas utiliser le site à des fins illégales ou non autorisées.",
            "Ne pas réutiliser les flux audio à des fins commerciales sans accord des radios concernées.",
            "Respecter les droits d'auteur et de propriété intellectuelle des contenus écoutés.",
          ],
        },
        {
          h2: 'Disponibilité du service',
          p: "Radio Live MA est fourni « en l'état », sans garantie de disponibilité ininterrompue. Les flux audio dépendent des serveurs des radios elles-mêmes et peuvent être indisponibles temporairement (maintenance, panne réseau, changement d'URL par la station). Nous mettons à jour le catalogue régulièrement pour maintenir les flux fonctionnels mais ne pouvons garantir une disponibilité 100%.",
        },
        {
          h2: 'Limitation de responsabilité',
          p: "Radio Live MA ne saurait être tenu responsable de :",
          ul: [
            "L'indisponibilité temporaire ou permanente d'un flux audio fournie par une station tierce.",
            "La qualité des contenus diffusés par les radios (paroles, opinions, programmes éditoriaux).",
            "Les dommages directs ou indirects résultant de l'utilisation du site (perte de données, problèmes techniques liés à votre matériel ou connexion).",
            "Les contenus des sites tiers vers lesquels nous pouvons rediriger via des liens externes.",
          ],
        },
        {
          h2: 'Publicité',
          p: "Radio Live MA finance son fonctionnement par l'affichage de publicités via Google AdSense. Les annonces sont automatiquement sélectionnées par Google et nous n'avons aucun contrôle direct sur les annonces individuelles affichées. Si une publicité vous semble inappropriée, vous pouvez la signaler via les options de Google AdSense ou nous le mentionner par email.",
        },
        {
          h2: 'Modification des conditions',
          p: "Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. La version en vigueur est toujours celle publiée sur cette page, avec la date de dernière mise à jour indiquée en haut. L'utilisation continue du site après modification vaut acceptation des nouvelles conditions.",
        },
        {
          h2: 'Droit applicable',
          p: "Les présentes conditions sont régies par le droit marocain. Tout litige relatif à l'utilisation de radiolive.ma sera soumis à la juridiction des tribunaux compétents du Maroc.",
        },
      ],
    },

    ar: {
      title: 'شروط الاستخدام — راديو لايف المغرب',
      description:
        'الشروط العامة لاستخدام radiolive.ma: قواعد الاستماع، الملكية الفكرية، المسؤولية، تجميع التدفقات الإذاعية المغربية.',
      h1: 'شروط الاستخدام',
      intro:
        'مرحبًا بك في راديو لايف المغرب. بدخولك إلى موقع radiolive.ma واستخدامه، فإنك توافق على شروط الاستخدام هذه. إذا لم توافق على هذه الشروط، يرجى عدم استخدام الموقع.',
      sections: [
        {
          h2: 'عرض الخدمة',
          p: 'راديو لايف المغرب هو مجمّع مجاني للتدفقات الصوتية العمومية للإذاعات المغربية. يتيح الموقع الاستماع المباشر للمحطات الإذاعية الرئيسية في المغرب (Hit Radio، Radio Mars، Chada FM، Medi 1، Radio 2M، إلخ) بالإضافة إلى الإذاعات الإلكترونية المتخصصة (الموسيقية، الدينية، الجهوية). الاستماع مجاني، بدون تسجيل، بدون تحميل.',
        },
        {
          h2: 'الملكية الفكرية للمحتويات المبثوثة',
          p: 'المحتويات الصوتية المبثوثة على radiolive.ma (البرامج، الأغاني، الجينغل، أصوات المنشطين) هي ملكية حصرية للإذاعات التي تنتجها. يكتفي radiolive.ma بنقل التدفقات العمومية المتاحة من قبل كل محطة عبر روابط البث الرسمية الخاصة بها. نحن لا نخزن ولا نعيد تسجيل ولا نعيد توزيع أي محتوى صوتي. نتصرف فقط كمجمّع للروابط.',
          p2: 'إذا كنت من أصحاب الحقوق وترى أن إتاحة تدفق معين تنتهك حقوقك، اتصل بنا على العنوان الموجود في صفحة الاتصال. سنعالج طلبك في أقرب وقت ممكن.',
        },
        {
          h2: 'ملكية الموقع والعلامات التجارية',
          p: 'التصميم، النصوص التحريرية (أوصاف المحطات، مقالات المدونة، صفحات SEO)، الرسوم، الكود المصدري، وعلامة «راديو لايف المغرب» / «radiolive.ma» هي ملكية ياسين سرسار. أي إعادة إنتاج أو توزيع أو تعديل أو استخدام تجاري بدون إذن كتابي مسبق ممنوع.',
          p2: 'أسماء وشعارات الإذاعات المغربية (Hit Radio، Medi 1، Radio Mars، إلخ) هي علامات تجارية مسجلة تخص أصحابها وتُستخدم لأغراض إعلامية فقط.',
        },
        {
          h2: 'استخدام الموقع',
          p: 'باستخدامك radiolive.ma، تلتزم بما يلي:',
          ul: [
            'عدم محاولة تجاوز الآليات التقنية للموقع (تجزئة التدفقات، الاستخراج الجماعي، هجمات DDoS).',
            'عدم استخدام الموقع لأغراض غير قانونية أو غير مصرح بها.',
            'عدم إعادة استخدام التدفقات الصوتية لأغراض تجارية بدون موافقة الإذاعات المعنية.',
            'احترام حقوق المؤلف والملكية الفكرية للمحتويات المستمع إليها.',
          ],
        },
        {
          h2: 'توفر الخدمة',
          p: 'يُقدم راديو لايف المغرب «كما هو»، بدون ضمان توفر متواصل. تعتمد التدفقات الصوتية على خوادم الإذاعات نفسها وقد تكون غير متوفرة مؤقتًا (صيانة، عطل شبكة، تغيير URL من قبل المحطة). نقوم بتحديث الكتالوج بانتظام للحفاظ على عمل التدفقات لكن لا يمكننا ضمان توفر بنسبة 100٪.',
        },
        {
          h2: 'تحديد المسؤولية',
          p: 'لا يمكن تحميل راديو لايف المغرب المسؤولية عن:',
          ul: [
            'عدم التوفر المؤقت أو الدائم لتدفق صوتي مقدم من محطة طرف ثالث.',
            'جودة المحتويات المبثوثة من قبل الإذاعات (الكلمات، الآراء، البرامج التحريرية).',
            'الأضرار المباشرة أو غير المباشرة الناتجة عن استخدام الموقع (فقدان البيانات، مشاكل تقنية مرتبطة بمعداتك أو اتصالك).',
            'محتويات المواقع الخارجية التي قد نوجه إليها عبر روابط خارجية.',
          ],
        },
        {
          h2: 'الإعلانات',
          p: 'يمول راديو لايف المغرب عمله من خلال عرض الإعلانات عبر Google AdSense. يتم اختيار الإعلانات تلقائيًا من قبل Google وليس لدينا تحكم مباشر في الإعلانات الفردية المعروضة. إذا بدت لك إعلانة غير مناسبة، يمكنك الإبلاغ عنها عبر خيارات Google AdSense أو إخبارنا عبر البريد الإلكتروني.',
        },
        {
          h2: 'تعديل الشروط',
          p: 'نحتفظ بالحق في تعديل شروط الاستخدام هذه في أي وقت. النسخة المعمول بها هي دائمًا تلك المنشورة على هذه الصفحة، مع تاريخ آخر تحديث مذكور في الأعلى. الاستمرار في استخدام الموقع بعد التعديل يعتبر قبولًا للشروط الجديدة.',
        },
        {
          h2: 'القانون المعمول به',
          p: 'تخضع هذه الشروط للقانون المغربي. أي نزاع يتعلق باستخدام radiolive.ma سيتم تقديمه إلى المحاكم المختصة في المغرب.',
        },
      ],
    },
  },

  'a-propos': {
    fr_path: '/a-propos',
    ar_path: '/ar/3an',
    lastUpdated: '2026-05-06',

    fr: {
      title: 'À propos — Radio Live MA, le portail des radios marocaines',
      description:
        "Radio Live MA, le portail de référence pour écouter toutes les radios marocaines en direct. Mission, équipe, valeurs du projet radiolive.ma.",
      h1: 'À propos de Radio Live MA',
      intro:
        "Radio Live MA (radiolive.ma) est le portail de référence pour écouter en direct toutes les radios marocaines, gratuitement, sans inscription, depuis n'importe quel endroit dans le monde.",
      sections: [
        {
          h2: 'Notre mission',
          p: "Centraliser sur une seule plateforme moderne et accessible toutes les stations radio marocaines en streaming. Que vous soyez à Casablanca dans votre voiture, à Bruxelles le dimanche matin, ou à Montréal en pleine journée de travail, Radio Live MA vous reconnecte instantanément à la pulsation sonore du Maroc — Hit Radio, Radio Mars, Medi 1, Chada FM, Aswat, et plus de 45 autres stations.",
          p2: "Le projet est né d'un constat simple : aucune plateforme ne réunissait l'ensemble des radios marocaines avec une interface moderne, rapide et fiable. Les listes existantes étaient dispersées, les flux souvent cassés, l'expérience utilisateur datée. Radio Live MA comble ce vide.",
        },
        {
          h2: 'Pour qui ?',
          p: 'Notre site est conçu pour trois publics principaux :',
          ul: [
            "Les Marocains du Maroc qui veulent écouter leur radio préférée sur leur ordinateur ou leur smartphone, sans installer d'application.",
            "Les Marocains du monde (MRE) en France, Belgique, Pays-Bas, Espagne, Italie, Allemagne, Canada, États-Unis qui souhaitent rester connectés à la culture, l'actualité et la musique de leur pays d'origine.",
            "Les amoureux du Maroc, expatriés ou voyageurs qui veulent découvrir la richesse du paysage radiophonique marocain.",
          ],
        },
        {
          h2: "Comment ça fonctionne",
          p: "Radio Live MA est un agrégateur de flux audio publics. Nous référençons les URLs de streaming officielles fournies par chaque station radio, et notre lecteur audio se connecte directement aux serveurs des radios — nous ne stockons aucun contenu audio. Le catalogue est mis à jour régulièrement (synchronisation quotidienne avec l'API publique Radio-Browser, plus interventions manuelles pour la qualité).",
          p2: "Le site est conçu pour être rapide même sur des connexions modestes : streaming HLS HD pour les radios qui le supportent, MP3 fallback pour les autres, mise en cache locale du catalogue pour un démarrage instantané dès la deuxième visite.",
        },
        {
          h2: 'Engagements éditoriaux',
          p: "Radio Live MA s'engage à :",
          ul: [
            "Référencer toutes les stations radio marocaines actives, sans favoritisme éditorial.",
            "Maintenir des descriptions factuelles et respectueuses de chaque station, même celles aux ligues éditoriales différentes.",
            "Respecter la propriété intellectuelle des radios — nous sommes un agrégateur de liens, pas un re-diffuseur.",
            "Garder le service totalement gratuit pour les utilisateurs (le site est financé par la publicité Google AdSense).",
            "Protéger la vie privée des visiteurs (aucune inscription, aucun tracking comportemental invasif, conformité RGPD et loi 09-08).",
          ],
        },
        {
          h2: 'Le projet et son créateur',
          p: "Radio Live MA est un projet personnel développé et maintenu par Yassine Sarsar, ingénieur passionné par le paysage médiatique marocain et l'expérience web. Le site est construit avec des technologies modernes (React, Vite, Cloudflare) pour offrir une expérience fluide et accessible. Le code est privé mais le projet a vocation à servir l'écosystème radiophonique marocain.",
          p2: "Si vous êtes une radio marocaine non encore référencée, ou si vous avez des suggestions d'amélioration, contactez-nous via la page Contact.",
        },
        {
          h2: "Le paysage radiophonique marocain en quelques chiffres",
          p: "Le Maroc possède l'un des paysages radiophoniques les plus riches du monde arabe. Depuis la libéralisation des ondes en 2006 par la HACA (Haute Autorité de la Communication Audiovisuelle), des dizaines de radios privées ont rejoint les chaînes publiques historiques (SNRT, 2M). Aujourd'hui, on compte plus de 30 radios FM nationales et régionales actives, plus une multitude de webradios spécialisées (musique amazighe, raï, religieux, sport). Radio Live MA s'efforce de toutes les couvrir.",
        },
      ],
    },

    ar: {
      title: 'حول الموقع — راديو لايف المغرب، بوابة الإذاعات المغربية',
      description: 'راديو لايف المغرب، البوابة المرجعية للاستماع المباشر لجميع الإذاعات المغربية. مهمة، فريق، قيم مشروع radiolive.ma.',
      h1: 'حول راديو لايف المغرب',
      intro:
        'راديو لايف المغرب (radiolive.ma) هو البوابة المرجعية للاستماع المباشر لجميع الإذاعات المغربية، مجانًا، بدون تسجيل، من أي مكان في العالم.',
      sections: [
        {
          h2: 'مهمتنا',
          p: 'تجميع كل المحطات الإذاعية المغربية على منصة واحدة حديثة وسهلة الوصول. سواء كنت في الدار البيضاء داخل سيارتك، أو في بروكسل صباح الأحد، أو في مونتريال في عز يوم العمل، يعيدك راديو لايف المغرب فورًا إلى نبض المغرب الصوتي — Hit Radio، Radio Mars، Medi 1، Chada FM، Aswat، وأكثر من 45 محطة أخرى.',
          p2: 'وُلد المشروع من ملاحظة بسيطة: لم تكن هناك منصة تجمع كل الإذاعات المغربية بواجهة حديثة وسريعة وموثوقة. القوائم الموجودة كانت مشتتة، التدفقات معطلة في الغالب، وتجربة المستخدم قديمة. راديو لايف المغرب يسد هذه الفجوة.',
        },
        {
          h2: 'لمن؟',
          p: 'موقعنا مصمم لثلاث جماهير رئيسية:',
          ul: [
            'المغاربة في المغرب الذين يريدون الاستماع إلى إذاعتهم المفضلة على حاسوبهم أو هاتفهم، بدون تثبيت تطبيق.',
            'مغاربة العالم في فرنسا وبلجيكا وهولندا وإسبانيا وإيطاليا وألمانيا وكندا والولايات المتحدة الذين يرغبون في البقاء على اتصال بثقافة وأخبار وموسيقى بلدهم الأصلي.',
            'محبي المغرب، المغتربين أو المسافرين الذين يريدون اكتشاف ثراء المشهد الإذاعي المغربي.',
          ],
        },
        {
          h2: 'كيف يعمل',
          p: 'راديو لايف المغرب هو مجمّع للتدفقات الصوتية العمومية. نقوم بتسجيل روابط البث الرسمية المقدمة من قبل كل محطة إذاعية، ويتصل مشغل الصوت لدينا مباشرة بخوادم الإذاعات — نحن لا نخزن أي محتوى صوتي. يتم تحديث الكتالوج بانتظام (مزامنة يومية مع API العمومي Radio-Browser، بالإضافة إلى تدخلات يدوية لضمان الجودة).',
          p2: 'الموقع مصمم ليكون سريعًا حتى على الاتصالات المتواضعة: بث HLS HD للإذاعات التي تدعمه، وMP3 كحل بديل للأخرى، وتخزين محلي للكتالوج لانطلاق فوري من الزيارة الثانية.',
        },
        {
          h2: 'الالتزامات التحريرية',
          p: 'يلتزم راديو لايف المغرب بـ:',
          ul: [
            'تسجيل جميع المحطات الإذاعية المغربية النشطة، بدون محاباة تحريرية.',
            'الحفاظ على أوصاف واقعية ومحترمة لكل محطة، حتى تلك ذات الخطوط التحريرية المختلفة.',
            'احترام الملكية الفكرية للإذاعات — نحن مجمّع روابط، وليس معيد بث.',
            'الحفاظ على الخدمة مجانية تمامًا للمستخدمين (يتم تمويل الموقع عبر إعلانات Google AdSense).',
            'حماية خصوصية الزوار (لا تسجيل، لا تتبع سلوكي تطفلي، الامتثال للائحة العامة لحماية البيانات والقانون 09-08).',
          ],
        },
        {
          h2: 'المشروع ومُنشئه',
          p: 'راديو لايف المغرب هو مشروع شخصي طوّره ويصونه ياسين سرسار، مهندس شغوف بالمشهد الإعلامي المغربي وتجربة الويب. الموقع مبني بتقنيات حديثة (React، Vite، Cloudflare) لتقديم تجربة سلسة وسهلة الوصول. الكود خاص لكن المشروع يهدف إلى خدمة منظومة الإذاعات المغربية.',
          p2: 'إذا كنت إذاعة مغربية غير مسجلة بعد، أو إذا كانت لديك اقتراحات للتحسين، اتصل بنا عبر صفحة الاتصال.',
        },
        {
          h2: 'المشهد الإذاعي المغربي بأرقام',
          p: 'يمتلك المغرب أحد أغنى المشاهد الإذاعية في العالم العربي. منذ تحرير الموجات سنة 2006 من قبل الهيئة العليا للاتصال السمعي البصري (HACA)، انضمت عشرات الإذاعات الخاصة إلى القنوات العمومية التاريخية (SNRT، 2M). اليوم، هناك أكثر من 30 إذاعة FM وطنية وجهوية نشطة، بالإضافة إلى عدد كبير من الإذاعات الإلكترونية المتخصصة (موسيقى أمازيغية، راي، ديني، رياضة). يسعى راديو لايف المغرب لتغطيتها جميعًا.',
        },
      ],
    },
  },

  'contact': {
    fr_path: '/contact',
    ar_path: '/ar/ittisal',
    lastUpdated: '2026-05-06',

    fr: {
      title: 'Contact — Radio Live MA',
      description: 'Contactez Radio Live MA : signalement de flux cassé, ajout de station, demande légale, partenariat. Réponse sous 72h.',
      h1: 'Contactez-nous',
      intro:
        "Une question, un signalement de flux cassé, une suggestion d'ajout de station, une demande de partenariat, ou une réclamation légale ? Voici comment nous joindre.",
      sections: [
        {
          h2: 'Email principal',
          p: "Pour toute demande, écrivez-nous à : contact@radiolive.ma",
          p2: "Nous traitons les emails dans l'ordre d'arrivée et répondons généralement sous 72 heures (jours ouvrables). Pour les signalements urgents (flux audio cassé, contenu inapproprié), nous essayons de répondre plus rapidement.",
        },
        {
          h2: 'Cas typiques de contact',
          p: 'Voici les motifs les plus fréquents de contact, avec une indication du délai de réponse :',
          ul: [
            "Signaler un flux audio cassé ou silencieux : précisez la station et nous mettons à jour l'URL si nécessaire (généralement sous 48h).",
            "Suggérer une nouvelle station radio à ajouter : envoyez le nom et l'URL de streaming officielle, nous vérifions et ajoutons si elle correspond à notre périmètre éditorial (radios marocaines uniquement).",
            "Signaler une erreur de description ou un contenu obsolète : merci de préciser la page concernée et la correction proposée.",
            "Demande de retrait pour atteinte aux droits d'auteur (DMCA) : envoyez la demande détaillée avec preuve d'ayant droit, nous traitons sous 7 jours ouvrés.",
            "Demande de partenariat ou collaboration éditoriale : présentez votre projet et nous étudions au cas par cas.",
            "Exercice des droits RGPD / loi 09-08 sur vos données personnelles : précisez la nature de la demande (accès, suppression, opposition), réponse sous 30 jours maximum.",
          ],
        },
        {
          h2: 'Identité du responsable',
          p: 'Le site radiolive.ma est édité et maintenu par :',
          p2: 'Yassine Sarsar — Maroc — contact@radiolive.ma',
        },
        {
          h2: 'Vous êtes une radio marocaine ?',
          p: "Si vous représentez une radio marocaine et souhaitez :",
          ul: [
            "Que nous ajoutions votre station si elle n'est pas encore référencée.",
            "Mettre à jour votre URL de streaming, votre logo, votre description.",
            "Nous transmettre une grille de programmes pour enrichir votre fiche.",
            "Discuter d'une mise en avant éditoriale ou d'un partenariat.",
          ],
          p2: "Nous sommes ouverts au dialogue et heureux de servir l'écosystème radiophonique marocain. Envoyez-nous un email avec « Radio + nom de votre station » en objet, nous prioriserons votre demande.",
        },
        {
          h2: 'Délais et exceptions',
          p: "Nous nous engageons à répondre à tout email légitime sous 72 heures ouvrées. Les emails publicitaires non sollicités, les demandes de référencement payant ou de SEO black-hat seront ignorés. Pendant les périodes de congés (Ramadan, vacances scolaires), les délais peuvent être légèrement allongés — nous l'indiquerons via un message d'absence automatique le cas échéant.",
        },
      ],
    },

    ar: {
      title: 'اتصل بنا — راديو لايف المغرب',
      description: 'اتصل براديو لايف المغرب: الإبلاغ عن تدفق معطل، إضافة محطة، طلب قانوني، شراكة. الرد خلال 72 ساعة.',
      h1: 'اتصل بنا',
      intro:
        'سؤال، إبلاغ عن تدفق معطل، اقتراح إضافة محطة، طلب شراكة، أو شكوى قانونية؟ إليك كيفية التواصل معنا.',
      sections: [
        {
          h2: 'البريد الإلكتروني الرئيسي',
          p: 'لأي طلب، اكتب إلينا على: contact@radiolive.ma',
          p2: 'نعالج الرسائل بالترتيب الذي تصلنا به ونرد عمومًا خلال 72 ساعة (أيام العمل). للإبلاغات العاجلة (تدفق صوتي معطل، محتوى غير لائق)، نحاول الرد بشكل أسرع.',
        },
        {
          h2: 'الحالات النموذجية للاتصال',
          p: 'فيما يلي الأسباب الأكثر شيوعًا للاتصال، مع إشارة إلى وقت الاستجابة:',
          ul: [
            'الإبلاغ عن تدفق صوتي معطل أو صامت: حدد المحطة ونحن نقوم بتحديث الرابط إذا لزم الأمر (عادة خلال 48 ساعة).',
            'اقتراح محطة إذاعية جديدة للإضافة: أرسل الاسم ورابط البث الرسمي، نتحقق ونضيف إذا كانت تتوافق مع نطاقنا التحريري (الإذاعات المغربية فقط).',
            'الإبلاغ عن خطأ في الوصف أو محتوى قديم: يرجى تحديد الصفحة المعنية والتصحيح المقترح.',
            'طلب إزالة بسبب انتهاك حقوق المؤلف (DMCA): أرسل الطلب التفصيلي مع إثبات الملكية، نعالج خلال 7 أيام عمل.',
            'طلب شراكة أو تعاون تحريري: قدم مشروعك وندرس كل حالة على حدة.',
            'ممارسة حقوق RGPD / القانون 09-08 على بياناتك الشخصية: حدد طبيعة الطلب (الوصول، الحذف، الاعتراض)، الرد خلال 30 يومًا كحد أقصى.',
          ],
        },
        {
          h2: 'هوية المسؤول',
          p: 'موقع radiolive.ma يحرره ويصونه:',
          p2: 'ياسين سرسار — المغرب — contact@radiolive.ma',
        },
        {
          h2: 'هل أنت إذاعة مغربية؟',
          p: 'إذا كنت تمثل إذاعة مغربية وترغب في:',
          ul: [
            'أن نضيف محطتك إذا لم تكن مسجلة بعد.',
            'تحديث رابط البث، شعارك، وصفك.',
            'إرسال جدول البرامج لإثراء صفحتك.',
            'مناقشة إبراز تحريري أو شراكة.',
          ],
          p2: 'نحن منفتحون على الحوار وسعداء بخدمة منظومة الإذاعات المغربية. أرسل لنا بريدًا إلكترونيًا بعنوان «Radio + اسم محطتك»، وسنعطي الأولوية لطلبك.',
        },
        {
          h2: 'المهلة والاستثناءات',
          p: 'نلتزم بالرد على أي بريد إلكتروني مشروع خلال 72 ساعة عمل. سيتم تجاهل الرسائل الإعلانية غير المرغوب فيها، طلبات التسجيل المدفوع، أو SEO black-hat. خلال فترات العطل (رمضان، العطل المدرسية)، قد تكون المهل أطول قليلًا — سنشير إلى ذلك عبر رسالة غياب تلقائية عند الاقتضاء.',
        },
      ],
    },
  },
};

export const LEGAL_KEYS = Object.keys(LEGAL_PAGES);
