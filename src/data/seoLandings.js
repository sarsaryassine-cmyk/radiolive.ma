/**
 * Pages SEO de cluster ciblant les mots-clés à fort volume.
 *
 * Chaque entrée porte :
 *   - path / lang / hreflang sibling
 *   - meta SEO (title, description)
 *   - H1 + corps structuré (h2 / h3 / p / ul / faq)
 *   - liens stations + clusters pour le maillage interne
 *
 * Contenu rédigé manuellement (FR + AR natif), aucun auto-translate.
 * Longueur cible : 800-1200 mots FR, 600-1000 mots AR.
 */

const STATION_GROUPS = {
  flagship: ['hit-radio', 'medi-1-radio', 'chada-fm', 'radio-mars', 'medradio', 'mfm', 'radio-2m', 'medinafm'],
  sport:    ['radio-mars', 'medi-1-radio', 'radio-2m', 'cap-radio'],
  national: ['radio-2m', 'medi-1-radio', 'qoran-radio', 'medradio'],
  music:    ['hit-radio', 'mfm', 'chada-fm', 'medradio', 'radio-aswat', 'medinafm'],
};

const RELATED_FR = [
  { label: 'Top 10 des radios marocaines', href: '/top-radio-maroc' },
  { label: 'Fréquences FM par ville', href: '/frequences-radio-maroc' },
  { label: 'Radios musicales (Hits)', href: '/radio-maroc-hit' },
  { label: 'Radios chaabi', href: '/radio-maroc-chaabi' },
  { label: 'Radios amazighes', href: '/radio-maroc-amazigh' },
  { label: 'Radios à Casablanca', href: '/radio-casablanca' },
  { label: 'Blog radio Maroc', href: '/blog' },
];

const RELATED_AR = [
  { label: 'أفضل 10 إذاعات مغربية', href: '/ar/top-radio-maroc' },
  { label: 'ترددات FM حسب المدينة', href: '/ar/frequences-radio-maroc' },
  { label: 'إذاعات الموسيقى', href: '/ar/radio-maroc-hit' },
  { label: 'إذاعات الشعبي', href: '/ar/radio-maroc-chaabi' },
  { label: 'إذاعات أمازيغية', href: '/ar/radio-maroc-amazigh' },
  { label: 'إذاعات الدار البيضاء', href: '/ar/radio-casablanca' },
  { label: 'مدونة', href: '/ar/blog' },
];

export const SEO_LANDINGS = {
  // ─────────────────────────────────────────────────────────────────
  // CLUSTER A — Pilier éditorial (informationnel)
  // ─────────────────────────────────────────────────────────────────
  'radio-maroc': {
    lang: 'fr',
    path: '/radio-maroc',
    altPath: null, // pas de mirror AR (Home AR couvre déjà l'angle)
    title: 'Radio au Maroc — Le portail complet des radios marocaines en ligne',
    description: "Le guide complet des radios au Maroc : histoire, paysage radiophonique, classification des stations FM et webradios, et écoute en direct gratuite de toutes les radios marocaines.",
    h1: 'Radio au Maroc — Le paysage radiophonique marocain en un coup d\'œil',
    intro: "Le Maroc compte aujourd'hui plus de trente stations de radio actives, du service public historique aux webradios indépendantes. Cette page rassemble tout ce qu'il faut savoir sur la radio du Maroc : histoire, opérateurs, formats, fréquences, et accès direct à l'écoute en ligne.",
    body: [
      { h2: 'Le paysage radiophonique marocain' },
      { p: "La radio au Maroc occupe une place particulière dans le quotidien des familles. Présente dans 95 % des foyers selon les dernières études du HACA (Haute Autorité de la Communication Audiovisuelle), elle accompagne les trajets, le travail, la cuisine et les soirées. Le pays dispose d'un écosystème radiophonique pluriel, structuré autour de trois grandes familles : le service public (SNRT), les radios privées libéralisées depuis 2006, et les webradios pure-player apparues dans la dernière décennie." },
      { p: "Sur le plan des contenus, la grille marocaine est dominée par la musique (chaabi, raï, hits internationaux, andalou, amazigh), suivie de l'information bilingue franco-arabe, du sport (avec la Botola Pro et les Lions de l'Atlas comme moteurs d'audience) et de la spiritualité (récitations du Saint Coran, programmes religieux pendant le Ramadan)." },

      { h2: 'Les grandes familles de radios marocaines' },
      { h3: 'Les radios publiques (SNRT)' },
      { p: "La Société Nationale de Radiodiffusion et de Télévision opère plusieurs chaînes radio : Al Idha3a Al Wataniya (la Nationale), Chaîne Inter (en français), Radio Amazighe, Radio Coran, Radio Mohammed VI du Saint Coran, et plusieurs stations régionales. C'est l'opérateur historique, héritier direct de la station Radio Maroc fondée en 1928. Sa mission de service public couvre l'information, l'éducation et la culture, avec une couverture FM nationale." },
      { h3: 'Les radios privées (post-2006)' },
      { p: "Depuis la libéralisation de l'audiovisuel en 2006, des dizaines d'opérateurs privés ont obtenu des licences FM. Hit Radio, Radio Mars, Chada FM, Aswat, MFM, Medina FM, Cap Radio, Atlantic Radio, Med Radio comptent parmi les plus écoutées. Chacune cultive un format précis : pop urbaine pour Hit Radio, sport pour Radio Mars, info-services pour Cap Radio, chaabi-pop pour Chada FM." },
      { h3: 'Les webradios et radios internationales' },
      { p: "Une troisième vague émerge depuis 2015 : les webradios pure-player (Yabiladi, Rap Lbeldi Maroc, Skyrock Casablanca, Fayroz, Adwaa FM) qui n'ont pas de fréquence FM et diffusent uniquement en streaming. À leurs côtés, deux acteurs internationaux historiques jouent un rôle clé : Medi 1 Radio (bilingue franco-arabe, basée à Tanger) et Monte Carlo Doualiya. Cette diversification donne aux auditeurs un choix sans équivalent dans le Maghreb." },

      { h2: "Histoire de la radio au Maroc" },
      { p: "L'histoire commence en 1928 avec l'inauguration de Radio Maroc, alors basée à Rabat sous le protectorat français. Après l'indépendance en 1956, la station est nationalisée et devient la pierre angulaire de la radio marocaine moderne. Pendant des décennies, le service public détient le monopole, en arabe, en français et en amazigh." },
      { p: "Le tournant intervient en 2002 avec la création de la HACA, qui pose le cadre réglementaire de la libéralisation. Quatre ans plus tard, en 2006, les premières licences privées sont attribuées : Hit Radio, Aswat, Chada FM, Medi 1 (qui passe d'un statut hybride à privé), et plusieurs autres. L'année 2010 marque l'arrivée massive du streaming, et 2020 celle des podcasts marocains. Aujourd'hui, le streaming représente plus de 35 % de l'écoute totale chez les moins de 35 ans." },

      { h2: 'Comment choisir sa radio marocaine ?' },
      { p: "Le choix dépend du moment de la journée, du contexte d'écoute et du goût personnel. Pour le réveil et les trajets, les radios musicales hits (Hit Radio, MFM) ou pop-chaabi (Chada FM, Aswat) dominent. Pour s'informer, Medi 1 Radio reste la référence avec ses bulletins bilingues toutes les heures. Pour le sport, Radio Mars retransmet en direct les matchs de la Botola Pro et des Lions de l'Atlas. Pour la spiritualité, Radio Coran et Radio Manarat diffusent récitations et programmes religieux 24 heures sur 24." },
      { p: "Les Marocains expatriés, ou Marocains résidant à l'étranger (MRE), trouvent dans le streaming en ligne un moyen direct de rester connectés au pays. Hit Radio et Medi 1 sont particulièrement populaires dans la diaspora installée en France, en Belgique, en Espagne et au Canada." },

      { h2: 'Les radios marocaines incontournables' },
      { p: "Si vous découvrez le paysage radio du Maroc, voici les stations à connaître absolument : Hit Radio (n°1 audience jeune), Medi 1 Radio (info bilingue), Radio Mars (sport), Chada FM (chaabi-pop), Radio 2M (groupe public 2M), MFM (musique généraliste), Medi 1 Tarab (musique arabe classique), Radio Aswat (musique populaire), Cap Radio (économie et services), Radio Coran (programmes religieux). Chacune dispose d'une page dédiée sur notre plateforme avec lecteur intégré, programmes et historique des chansons diffusées." },
    ],
    faq: [
      {
        q: 'Quelle est la meilleure radio au Maroc ?',
        a: "Selon les études d'audience CIM (2024-2025), Hit Radio reste leader sur la cible 15-34 ans, Medi 1 domine sur l'information bilingue, et Radio Mars sur le sport. Le \"meilleur\" choix dépend de votre format préféré : musique, info, sport ou spiritualité.",
      },
      {
        q: 'Combien y a-t-il de radios au Maroc ?',
        a: "Le HACA recense aujourd'hui environ 30 stations FM autorisées, auxquelles s'ajoutent une vingtaine de webradios pure-player. Notre plateforme regroupe plus de 30 radios marocaines en streaming direct.",
      },
      {
        q: 'Comment écouter la radio marocaine en ligne ?',
        a: "Il suffit d'ouvrir notre site, de choisir une station dans le catalogue et de cliquer sur Écouter. Aucune inscription, aucun téléchargement d'application, l'écoute est gratuite depuis n'importe quel pays.",
      },
      {
        q: 'Les radios marocaines sont-elles disponibles depuis l\'étranger ?',
        a: "Oui, toutes les radios marocaines présentes sur notre plateforme sont accessibles depuis l'international, sans VPN. Particulièrement populaires auprès des MRE en France, Belgique, Pays-Bas, Espagne, Canada et États-Unis.",
      },
      {
        q: 'Quelle est la radio la plus ancienne du Maroc ?',
        a: "Radio Maroc, fondée en 1928 sous le protectorat, est l'ancêtre direct de l'actuelle SNRT. C'est la station historique du paysage radiophonique national.",
      },
    ],
    relatedStationIds: STATION_GROUPS.flagship,
    related: RELATED_FR,
    cluster: 'pillar',
  },

  // ─────────────────────────────────────────────────────────────────
  // CLUSTER B — Live streaming (FR)
  // ─────────────────────────────────────────────────────────────────
  'radio-maroc-en-direct': {
    lang: 'fr',
    path: '/radio-maroc-en-direct',
    altPath: '/ar/radio-maroc-mubashir',
    title: 'Radio Maroc en direct — Écouter toutes les radios marocaines en streaming live',
    description: "Écoutez en direct toutes les radios marocaines : Hit Radio, Medi 1, Radio Mars, Chada FM, Radio 2M, MFM et plus de 30 stations FM en streaming HD gratuit, sans inscription, 24h/24.",
    h1: 'Radio Maroc en direct — Écouter en ligne toutes les stations marocaines',
    intro: "Toutes les radios du Maroc en direct, en streaming HD, gratuitement et sans inscription. Plus de 30 stations FM et webradios diffusent leur signal 24 heures sur 24 sur notre plateforme. Sélectionnez une station, cliquez sur écouter, et profitez du Maroc en direct depuis n'importe où dans le monde.",
    body: [
      { h2: 'Toutes les radios marocaines en direct, à un clic' },
      { p: "Notre plateforme centralise plus de trente stations marocaines en streaming live. Hit Radio, Medi 1 Radio, Chada FM, Radio Mars, Radio 2M, MFM, Medina FM, Aswat, Cap Radio, Med Radio, Skyrock Casablanca, Radio Coran et bien d'autres y sont diffusées en direct, sans coupure publicitaire intrusive et avec une qualité audio adaptée à votre connexion (jusqu'à 256 kbps en HLS HD)." },
      { p: "Le principe est simple : aucun téléchargement d'application, aucune création de compte, aucune limite d'écoute. Vous ouvrez le site, vous choisissez une radio, et le lecteur audio démarre immédiatement. Le flux reste actif quand vous changez de page : pratique pour découvrir une nouvelle station tout en continuant d'écouter votre programme préféré." },

      { h2: 'Comment fonctionne l\'écoute en direct ?' },
      { p: "Chaque radio marocaine diffuse son signal sous forme d'un flux audio numérique transmis en temps réel par les serveurs de la station. Notre plateforme se connecte à ces flux officiels (HLS, AAC, MP3 selon les radios) et les relit dans votre navigateur via un lecteur Web compatible avec tous les appareils modernes : ordinateur, smartphone iOS et Android, tablette, smart TV." },
      { p: "Le décalage entre la diffusion réelle et votre écoute est généralement compris entre 5 et 30 secondes selon la radio et votre connexion. Sur la fibre, le délai est imperceptible ; sur 4G ou 5G, il reste très court. Si votre débit fluctue, le lecteur ajuste automatiquement la qualité pour éviter les coupures. Aucune installation, aucun paramétrage." },

      { h2: 'Sur quels appareils écouter la radio marocaine en ligne ?' },
      { ul: [
        "Ordinateur (Windows, Mac, Linux) : navigateur Chrome, Firefox, Edge ou Safari récent.",
        "Smartphone Android : Chrome ou navigateur d'origine, écoute possible en arrière-plan.",
        "iPhone et iPad : Safari ou Chrome, contrôle depuis le centre de contrôle iOS.",
        "Smart TV : Chromecast, Apple TV, navigateur intégré.",
        "Voiture : Apple CarPlay et Android Auto via Bluetooth ou USB.",
        "Enceintes connectées : Google Home, Amazon Echo (en lançant l'URL via le navigateur du smartphone).",
      ]},

      { h2: 'Pourquoi écouter la radio en ligne plutôt qu\'en FM ?' },
      { p: "Le streaming Internet apporte plusieurs avantages décisifs sur la diffusion FM classique. D'abord, la qualité audio : les radios marocaines diffusent généralement entre 64 kbps (mono) et 256 kbps (stéréo HD), bien supérieure à la modulation analogique parasitée par les zones d'ombre, les tunnels et les obstacles urbains. Ensuite, la couverture : depuis Casablanca, Rabat, Marrakech, Tanger ou n'importe quelle ville du monde, le signal est identique. Aucune zone blanche." },
      { p: "Le streaming permet aussi d'accéder à des webradios qui n'ont pas de fréquence FM officielle (Yabiladi Chaabi Maroc, Yabiladi Azawan Amazigh, Rap Lbeldi Maroc, Fayroz, Adwaa FM). Pour les Marocains résidant à l'étranger (MRE), c'est le seul moyen pratique d'écouter la radio nationale en temps réel." },

      { h2: 'Les stations les plus écoutées en streaming' },
      { p: "Selon nos statistiques d'utilisation, Hit Radio, Medi 1 Radio, Chada FM, Radio Mars et MFM concentrent plus de 60 % des écoutes en ligne. Ces cinq radios cumulent les avantages de la notoriété FM, d'une grille moderne et d'une qualité de stream stable. Pour l'auditeur exigeant, Medi 1 Tarab (musique arabe classique), Radio Mohammed VI du Saint Coran et Cap Radio offrent des contenus de niche très appréciés. Notre top 10 dynamique reflète les écoutes en temps réel." },

      { h2: 'Écouter la radio marocaine 24h/24, sans coupure' },
      { p: "Toutes les radios listées sur cette page diffusent en continu, sans interruption nocturne. Pendant le mois sacré du Ramadan, l'audience explose sur les radios religieuses (Radio Coran, Radio Manarat, Radio Mohammed VI). Les vendredis matins, les radios généralistes diffusent l'appel à la prière et le sermon. Les samedis et dimanches, les programmes culturels et musicaux dominent. Bref, quel que soit le moment, il y a toujours une radio marocaine à écouter en direct sur notre plateforme." },
    ],
    faq: [
      {
        q: 'Comment écouter la radio marocaine en direct ?',
        a: "Ouvrez notre page d'accueil, choisissez une radio dans le catalogue (plus de 30 stations disponibles) et cliquez sur Écouter. Le streaming démarre en quelques secondes, sans inscription ni téléchargement.",
      },
      {
        q: 'L\'écoute est-elle vraiment gratuite ?',
        a: "Oui, totalement. Aucun abonnement, aucun compte, aucune limite. Le site est financé par une publicité discrète qui ne perturbe jamais l'écoute audio.",
      },
      {
        q: 'Puis-je écouter la radio marocaine depuis l\'étranger ?',
        a: "Oui, toutes les radios sont accessibles depuis n'importe quel pays, sans VPN. Particulièrement populaire auprès des MRE en France, Belgique, Pays-Bas, Espagne, Canada et États-Unis.",
      },
      {
        q: 'Quelle qualité audio pour le streaming ?',
        a: "La qualité dépend de la station : entre 64 kbps (mono basique) et 256 kbps (stéréo HD HLS). Medi 1 Radio, Hit Radio et Radio 2M proposent les flux les plus nets.",
      },
      {
        q: 'L\'écoute fonctionne-t-elle en arrière-plan sur smartphone ?',
        a: "Oui, sur Android l'audio continue après verrouillage de l'écran. Sur iOS, lancez le lecteur puis verrouillez : la radio reste audible, contrôlable depuis le centre de contrôle.",
      },
    ],
    relatedStationIds: STATION_GROUPS.flagship,
    related: RELATED_FR,
    cluster: 'live',
  },

  // ─────────────────────────────────────────────────────────────────
  // CLUSTER C — Sport (FR)
  // ─────────────────────────────────────────────────────────────────
  'radio-sport-maroc': {
    lang: 'fr',
    path: '/radio-sport-maroc',
    altPath: '/ar/radio-riyada-maghreb',
    title: 'Radio Sport Maroc — Écouter Radio Mars et les radios sportives marocaines en direct',
    description: "Toutes les radios sport du Maroc en direct : Radio Mars, retransmissions Botola Pro, Lions de l'Atlas, CAN, programmes football, basket et athlétisme. Streaming gratuit 24h/24.",
    h1: 'Radio Sport Maroc — Le sport marocain en direct, à l\'antenne',
    intro: "Le sport occupe une place centrale dans la radio marocaine, portée par la passion du football et l'engouement national pour les Lions de l'Atlas. Notre sélection rassemble les radios sportives en direct : Radio Mars en tête, complétée par les programmes sportifs des grandes radios généralistes.",
    body: [
      { h2: 'Le paysage des radios sport au Maroc' },
      { p: "Le Maroc possède une seule radio 100 % sport, Radio Mars, lancée en 2009. Avant sa création, le sport restait cantonné à des plages horaires limitées sur les radios généralistes. L'arrivée de Radio Mars a révolutionné la couverture sportive au Maroc, en proposant 24 heures sur 24 d'antenne dédiée aux compétitions, aux interviews et aux débats." },
      { p: "Aux côtés de Radio Mars, plusieurs radios généralistes consacrent des plages horaires importantes au sport : Medi 1 Radio diffuse des bulletins sportifs réguliers et retransmet les matchs de la sélection nationale, Radio 2M propose un magazine sportif quotidien, Cap Radio couvre l'actualité économique du sport (transferts, stadia, sponsoring)." },

      { h2: 'Radio Mars — La référence du sport marocain' },
      { p: "Radio Mars est la première et la seule radio thématique sport du Royaume. Basée à Casablanca, elle diffuse en FM (88.0 à Casa, 90.6 à Rabat, et sur d'autres fréquences régionales) et en streaming HD. Sa grille couvre toutes les disciplines majeures : football (Botola Pro 1 et 2, Coupe du Trône, Ligue des Champions africaine, Coupe du Monde), basketball, athlétisme, boxe, arts martiaux, cyclisme et tennis." },
      { p: "Les retransmissions de matchs en direct constituent le cœur de l'antenne. Chaque journée de Botola Pro, Radio Mars couvre les rencontres avec un commentateur sur place. Les matchs des Lions de l'Atlas (sélection masculine) et des Lionnes (sélection féminine) drainent des audiences record, particulièrement pendant la CAN, la Coupe du Monde et les Jeux Olympiques. Les talks-shows post-match débriefent les performances avec des invités experts." },

      { h2: 'Botola Pro et compétitions nationales' },
      { p: "La Botola Pro Inwi est le championnat de football professionnel du Maroc, qui réunit 16 clubs (12 en D1, plus deux divisions inférieures). Wydad Casablanca, Raja Casablanca, FAR Rabat, FUS Rabat et MAS Fès comptent parmi les clubs historiques. Radio Mars couvre l'intégralité de la saison avec des reportages, des magazines et des retransmissions exclusives sur le streaming gratuit." },
      { p: "Les derbies casablancais (Wydad-Raja) sont parmi les rencontres les plus écoutées de l'année, suivies des affiches contre des clubs régionaux comme l'IRT Tanger ou l'AS Salé. Pendant les phases finales, Radio Mars assure des éditions spéciales en direct avec ambiance stade." },

      { h2: 'Lions de l\'Atlas — La passion nationale' },
      { p: "Les Lions de l'Atlas (sélection masculine de football) ont connu une décennie historique avec la 4ᵉ place à la Coupe du Monde 2022 au Qatar (premier pays africain et arabe à atteindre ce niveau). Cette performance a fait exploser les audiences sportives sur toutes les radios marocaines. Radio Mars a couvert chaque match en direct avec des commentaires bilingues arabe-français." },
      { p: "Pour la CAN (Coupe d'Afrique des Nations), la Coupe du Monde 2026 et les futurs JO, Radio Mars maintient une couverture intensive avec envoyés spéciaux, conférences de presse retransmises et magazines d'avant-match. Les Lionnes, vice-championnes d'Afrique en 2022, bénéficient également d'une couverture grandissante." },

      { h2: 'Programmes sportifs sur les autres radios' },
      { p: "Au-delà de Radio Mars, plusieurs radios généralistes proposent des rendez-vous sport quotidiens : Medi 1 Radio diffuse un journal des sports tous les soirs à 19 h, suivi d'un magazine. Radio 2M consacre une heure quotidienne au sport. Hit Radio et MFM intègrent des flashs sport entre les programmes musicaux. Cap Radio analyse l'économie du sport et les enjeux de gouvernance." },
    ],
    faq: [
      {
        q: 'Quelle est la meilleure radio sport au Maroc ?',
        a: "Radio Mars est la seule radio thématique sport du Maroc et la référence absolue du secteur. Elle diffuse 24h/24 en FM et en streaming, avec une couverture intégrale de la Botola Pro et des Lions de l'Atlas.",
      },
      {
        q: 'Sur quelle fréquence écouter Radio Mars ?',
        a: "Radio Mars émet sur 88.0 FM à Casablanca, 90.6 FM à Rabat, et sur diverses fréquences régionales. En streaming, elle est disponible 24h/24 gratuitement sur notre plateforme.",
      },
      {
        q: 'Radio Mars retransmet-elle tous les matchs de la Botola ?',
        a: "Radio Mars couvre l'intégralité de la saison de Botola Pro Inwi (D1 et D2) avec des commentaires en direct sur les principaux matchs et des magazines pour les autres rencontres.",
      },
      {
        q: 'Comment suivre les Lions de l\'Atlas en direct ?',
        a: "Radio Mars retransmet en direct tous les matchs des Lions de l'Atlas (CAN, Coupe du Monde, qualifications). Streaming HD gratuit sur notre plateforme, sans inscription.",
      },
      {
        q: 'Y a-t-il des radios sport en arabe et en français ?',
        a: "Radio Mars diffuse principalement en arabe (darija) avec des incursions en français. Medi 1 Radio propose un journal des sports bilingue chaque soir.",
      },
    ],
    relatedStationIds: STATION_GROUPS.sport,
    related: [
      ...RELATED_FR.slice(0, 2),
      { label: 'Page Radio Mars', href: '/station/radio-mars' },
      ...RELATED_FR.slice(2),
    ],
    cluster: 'sport',
  },

  // ─────────────────────────────────────────────────────────────────
  // CLUSTER E — Radio nationale SNRT (FR)
  // ─────────────────────────────────────────────────────────────────
  'radio-nationale-marocaine': {
    lang: 'fr',
    path: '/radio-nationale-marocaine',
    altPath: '/ar/radio-al-idha3a-al-wataniya',
    title: 'Radio Nationale Marocaine — La radio publique du Royaume du Maroc en direct',
    description: "Tout savoir sur la Radio Nationale Marocaine (Al Idha3a Al Wataniya) opérée par la SNRT : histoire, chaînes, mission de service public et écoute en direct des grandes radios publiques.",
    h1: 'Radio Nationale Marocaine — Al Idha3a Al Wataniya, la voix officielle du Royaume',
    intro: "La Radio Nationale Marocaine, ou Al Idha3a Al Wataniya, est la chaîne historique du service public radiophonique du Royaume du Maroc. Opérée par la SNRT (Société Nationale de Radiodiffusion et de Télévision), elle constitue depuis 1928 le pilier de l'information, de la culture et de l'identité marocaine.",
    body: [
      { h2: 'La SNRT — Société Nationale de Radiodiffusion et de Télévision' },
      { p: "La SNRT est l'opérateur public marocain de la radio et de la télévision. Issue de la nationalisation de Radio Maroc en 1956, elle a été restructurée en société anonyme à capitaux publics en 2005. Son siège social est à Rabat. Elle exploite plusieurs chaînes télévisées (Al Aoula, TV Tamazight, Athaqafia, Aflam, Laayoune TV, Arriadia) et un bouquet radio public couvrant l'ensemble du territoire national." },
      { p: "La mission de service public confiée à la SNRT couvre l'information, l'éducation, la culture, la diffusion des valeurs nationales et la promotion du patrimoine marocain. Le cahier des charges, validé par la HACA, impose des quotas de production nationale, des plages d'éducation et de diffusion religieuse, ainsi qu'une couverture FM intégrale du territoire." },

      { h2: 'Al Idha3a Al Wataniya — La Radio Nationale' },
      { p: "Al Idha3a Al Wataniya (الإذاعة الوطنية) est la chaîne radio principale du groupe SNRT. Diffusée en arabe (darija et arabe standard), elle propose une grille généraliste mêlant journaux d'information, débats politiques, programmes culturels, magazines de société, musique marocaine et internationale, et programmes religieux. Elle reste la radio de référence dans les zones rurales et chez les auditeurs attachés à un format institutionnel." },
      { p: "Les rendez-vous phares incluent les éditions principales du journal (matin, midi, soir), la transmission directe du Conseil des Ministres lors des grandes occasions, la couverture des fêtes nationales (Trône, Marche Verte, Aïd) et les retransmissions des prières du vendredi depuis les principales mosquées du Royaume. Pendant le mois sacré du Ramadan, des programmes spéciaux de spiritualité, d'éducation religieuse et de divertissement familial occupent une place importante de la grille." },

      { h2: 'Les chaînes du bouquet SNRT Radio' },
      { ul: [
        "Al Idha3a Al Wataniya (la Nationale) — chaîne généraliste en arabe.",
        "Chaîne Inter — programmes en français, public urbain et expatriés francophones.",
        "Radio Amazighe — diffusion en tachelhit, tamazight et tarifit.",
        "Radio Coran (Radio Mohammed VI du Saint Coran) — récitations 24h/24, programmes religieux.",
        "Radio Régionales — Casablanca, Tanger, Fès, Marrakech, Agadir, Laayoune, Oujda.",
        "Aswat Al Ouloum — chaîne éducative et culturelle.",
      ]},

      { h2: 'Histoire de la Radio Nationale Marocaine' },
      { p: "L'histoire commence en 1928 avec la création de Radio Maroc à Rabat, alors sous protectorat français. La station diffuse initialement en français, puis ajoute l'arabe et plusieurs autres langues. À l'indépendance en 1956, la radio est nationalisée et placée sous la tutelle directe de l'État. Elle devient le canal principal de communication du jeune royaume indépendant et joue un rôle majeur dans la construction de l'identité nationale post-coloniale." },
      { p: "Au fil des décennies, la Radio Nationale traverse plusieurs phases de modernisation : passage de l'AM à la FM dans les années 1970, ouverture de stations régionales dans les années 1980-1990, transition numérique au tournant des années 2000. La création de la SNRT en 2005 et l'arrivée du streaming Internet permettent à Al Idha3a Al Wataniya de toucher la diaspora marocaine dans le monde entier, notamment en Europe et en Amérique du Nord." },

      { h2: 'Comment écouter la Radio Nationale Marocaine en direct ?' },
      { p: "Al Idha3a Al Wataniya est diffusée sur l'ensemble du territoire marocain en FM (avec des fréquences locales adaptées à chaque région : 93.6 à Casablanca, 96.3 à Rabat, etc.) et en AM ondes moyennes pour les zones reculées. Pour l'écoute internationale ou en streaming, le flux officiel est accessible via le site et l'application SNRT, ainsi que sur les principales plateformes d'agrégation. Notre site donne accès aux radios publiques marocaines via un lecteur unifié, sans inscription et gratuitement." },
    ],
    faq: [
      {
        q: 'Qu\'est-ce que la Radio Nationale Marocaine ?',
        a: "C'est Al Idha3a Al Wataniya, la chaîne radio publique principale du Maroc, opérée par la SNRT. Elle remonte à Radio Maroc fondée en 1928 et constitue la radio de service public historique du Royaume.",
      },
      {
        q: 'Qui opère les radios publiques marocaines ?',
        a: "La SNRT (Société Nationale de Radiodiffusion et de Télévision), entreprise publique basée à Rabat, opère l'ensemble du bouquet radio public : Al Idha3a Al Wataniya, Chaîne Inter, Radio Amazighe, Radio Coran et plusieurs stations régionales.",
      },
      {
        q: 'Quelle différence entre la SNRT et Medi 1 ?',
        a: "La SNRT est l'opérateur public officiel. Medi 1 Radio est une radio privée à statut spécial (capital franco-marocain), basée à Tanger, indépendante de la SNRT. Les deux ont des missions et des grilles distinctes.",
      },
      {
        q: 'La Radio Nationale est-elle gratuite à écouter ?',
        a: "Oui, totalement. La radio publique marocaine est financée par la redevance audiovisuelle et le budget de l'État. L'écoute est gratuite en FM et en streaming.",
      },
      {
        q: 'Peut-on écouter la Radio Nationale depuis l\'étranger ?',
        a: "Oui, le streaming officiel SNRT est accessible depuis n'importe quel pays. Les MRE écoutent particulièrement Al Idha3a Al Wataniya pour rester connectés à l'actualité officielle marocaine.",
      },
    ],
    relatedStationIds: STATION_GROUPS.national,
    related: RELATED_FR,
    cluster: 'national',
  },

  // ─────────────────────────────────────────────────────────────────
  // CLUSTER B — Live AR
  // ─────────────────────────────────────────────────────────────────
  'radio-maroc-mubashir': {
    lang: 'ar',
    path: '/ar/radio-maroc-mubashir',
    altPath: '/radio-maroc-en-direct',
    title: 'إذاعات المغرب مباشر — استمع لجميع الإذاعات المغربية أون لاين مجاناً',
    description: 'استمع إلى جميع الإذاعات المغربية مباشرة وبجودة عالية: هيت راديو، ميدي1، شدى إف إم، راديو مارس وأكثر من 30 محطة. مجاناً، بدون تسجيل، على مدار الساعة.',
    h1: 'إذاعات المغرب مباشر — جميع راديوهات المغرب أون لاين',
    intro: 'استمع إلى أكثر من 30 إذاعة مغربية مباشرة وبجودة عالية، مجاناً ودون تسجيل. منصتنا تجمع أهم المحطات الإذاعية في المغرب: هيت راديو، ميدي1، شدى إف إم، راديو مارس، راديو 2M، ميد راديو وأكثر، متاحة على مدار الساعة من أي بلد في العالم.',
    body: [
      { h2: 'جميع الإذاعات المغربية في مكان واحد' },
      { p: 'تجمع منصتنا أكثر من ثلاثين إذاعة مغربية في بث مباشر متواصل. تحظى هيت راديو، ميدي1 راديو، شدى إف إم، راديو مارس، راديو 2M وMFM بأعلى نسب الاستماع، إلى جانب إذاعات متخصصة كراديو القرآن الكريم، إذاعة منارات، ميدي1 طرب، وراديو يابلادي. كل ذلك بدون فترات صمت، ودون إعلانات مزعجة تقطع الاستماع.' },
      { p: 'الاستماع مجاني تماماً: لا تسجيل، لا تطبيق للتحميل، لا حد لعدد الساعات. يكفيك فتح الموقع، اختيار محطة، والضغط على زر الاستماع. يستمر البث في العمل عند التنقل بين الصفحات، مما يتيح لك اكتشاف محطات جديدة دون إيقاف برنامجك المفضل.' },

      { h2: 'كيف يعمل البث المباشر؟' },
      { p: 'تبث كل إذاعة مغربية إشارتها في الوقت الفعلي عبر خوادم خاصة، بصيغ تقنية متنوعة (HLS، AAC، MP3). تتصل منصتنا بهذه الخوادم الرسمية وتعيد بث الإشارة مباشرة في متصفحك، دون الحاجة إلى أي إعدادات أو تطبيقات. يعمل المشغل على جميع الأجهزة الحديثة: حاسوب، هاتف ذكي، لوحة إلكترونية وتلفاز.' },
      { p: 'الفارق الزمني بين البث الفعلي ووصوله إليك يتراوح عادة بين 5 و30 ثانية حسب جودة اتصالك. على الألياف البصرية الفارق غير محسوس، وعلى شبكات 4G و5G يبقى قصيراً جداً. عند تذبذب السرعة، يقوم المشغل تلقائياً بتعديل جودة الصوت لتجنب الانقطاع.' },

      { h2: 'لماذا الاستماع عبر الأنترنت أفضل من FM؟' },
      { p: 'يقدم البث عبر الأنترنت عدة مزايا حاسمة على البث FM التقليدي. أولاً جودة الصوت: تبث الإذاعات المغربية بمعدلات تتراوح بين 64 كيلوبت و256 كيلوبت في الثانية، أعلى بكثير من التشكيل التماثلي الذي يعاني من التشويش في المناطق المظلمة والأنفاق والعوائق الحضرية. ثانياً التغطية: من الدار البيضاء، الرباط، مراكش، طنجة أو أي مدينة في العالم، تبقى الإشارة متطابقة. لا توجد مناطق صامتة.' },
      { p: 'يتيح البث المباشر أيضاً الوصول إلى إذاعات الأنترنت التي لا تملك ترددات FM رسمية (يابلادي شعبي، يابلادي أزوان أمازيغ، راب لبلدي، فيروز، أضواء إف إم). بالنسبة للجالية المغربية المقيمة في الخارج، يبقى الحل الوحيد العملي للاستماع للراديو الوطني في الزمن الحقيقي.' },

      { h2: 'الإذاعات الأكثر استماعاً' },
      { p: 'حسب إحصائياتنا، تستحوذ هيت راديو، ميدي1 راديو، شدى إف إم، راديو مارس وMFM على أكثر من 60% من الاستماع عبر الأنترنت. تجمع هذه المحطات الخمس بين الشهرة في FM، شبكة برامج عصرية وجودة بث ثابتة. للمستمع المهتم بالموسيقى الكلاسيكية، يقدم ميدي1 طرب وإذاعة محمد السادس للقرآن الكريم برامج مميزة.' },

      { h2: 'استماع متواصل على مدار الساعة' },
      { p: 'جميع الإذاعات المدرجة في هذه الصفحة تبث على مدار الساعة دون انقطاع ليلي. خلال شهر رمضان المعظم، يرتفع الاستماع بشكل ملحوظ إلى الإذاعات الدينية. وأيام الجمعة صباحاً، تبث الإذاعات العامة الأذان وخطبة الجمعة. أيام السبت والأحد، تتغلب البرامج الثقافية والموسيقية على الشبكة.' },
    ],
    faq: [
      {
        q: 'كيف يمكن الاستماع إلى الإذاعة المغربية مباشرة؟',
        a: 'افتح صفحتنا الرئيسية، اختر إذاعة من الكتالوج (أكثر من 30 محطة متاحة) ثم اضغط على زر الاستماع. سيبدأ البث خلال ثوان معدودة، دون تسجيل أو تحميل لأي تطبيق.',
      },
      {
        q: 'هل الاستماع مجاني فعلاً؟',
        a: 'نعم، مجاني بالكامل. لا اشتراك، لا حساب، لا حدود. يتم تمويل الموقع بإعلانات بسيطة لا تؤثر أبداً على جودة الاستماع.',
      },
      {
        q: 'هل يمكن الاستماع من خارج المغرب؟',
        a: 'نعم، جميع الإذاعات متاحة من أي بلد، دون VPN. يحظى الموقع بشعبية خاصة لدى الجالية المغربية في فرنسا وبلجيكا وهولندا وإسبانيا وكندا.',
      },
      {
        q: 'ما جودة الصوت في البث؟',
        a: 'تختلف الجودة حسب المحطة: بين 64 كيلوبت (مونو أساسي) و256 كيلوبت (ستيريو HD HLS). ميدي1، هيت راديو وراديو 2M توفر الجودة الأعلى.',
      },
      {
        q: 'هل يستمر التشغيل في الخلفية على الهاتف؟',
        a: 'نعم، على الأندرويد يستمر الصوت بعد قفل الشاشة. على iOS، شغل المشغل ثم اقفل الجهاز: ستبقى الإذاعة قيد التشغيل، قابلة للتحكم من مركز التحكم.',
      },
    ],
    relatedStationIds: STATION_GROUPS.flagship,
    related: RELATED_AR,
    cluster: 'live',
  },

  // ─────────────────────────────────────────────────────────────────
  // CLUSTER C — Sport AR
  // ─────────────────────────────────────────────────────────────────
  'radio-riyada-maghreb': {
    lang: 'ar',
    path: '/ar/radio-riyada-maghreb',
    altPath: '/radio-sport-maroc',
    title: 'راديو الرياضة المغربية — استمع إلى راديو مارس والإذاعات الرياضية مباشرة',
    description: 'استمع إلى الإذاعات الرياضية المغربية مباشرة: راديو مارس، نقل مباريات البطولة الاحترافية وأسود الأطلس، برامج كرة القدم وكرة السلة. بث مجاني على مدار الساعة.',
    h1: 'راديو الرياضة المغربية — رياضة المغرب على الهواء مباشرة',
    intro: 'تحتل الرياضة مكانة محورية في الراديو المغربي، يقودها شغف كرة القدم والحماس الوطني لأسود الأطلس. منصتنا تجمع الإذاعات الرياضية المباشرة، يتقدمها راديو مارس، إلى جانب البرامج الرياضية على الإذاعات العامة الكبرى.',
    body: [
      { h2: 'مشهد الإذاعات الرياضية في المغرب' },
      { p: 'يمتلك المغرب إذاعة واحدة متخصصة 100% في الرياضة، وهي راديو مارس، التي انطلقت سنة 2009. قبل تأسيسها كانت الرياضة محصورة في فقرات محدودة على الإذاعات العامة. أحدث إطلاق راديو مارس ثورة في التغطية الرياضية بالمغرب، حيث وفر 24 ساعة على 24 من البث المخصص للمنافسات والمقابلات والنقاشات.' },
      { p: 'إلى جانب راديو مارس، تخصص عدة إذاعات عامة فترات مهمة للرياضة: ميدي1 راديو تبث نشرات رياضية منتظمة وتنقل مباريات المنتخب الوطني، راديو 2M يقدم مجلة رياضية يومية، كاب راديو يغطي الجانب الاقتصادي للرياضة (الانتقالات، الملاعب، الرعاية).' },

      { h2: 'راديو مارس — مرجع الرياضة المغربية' },
      { p: 'راديو مارس هي أول وأكبر إذاعة رياضية متخصصة في المملكة. مقرها الدار البيضاء، تبث على FM (88.0 بالدار البيضاء، 90.6 بالرباط، وترددات أخرى جهوية) وعبر البث المباشر بجودة عالية. تغطي شبكة برامجها جميع الرياضات الكبرى: كرة القدم (البطولة الاحترافية الأولى والثانية، كأس العرش، دوري أبطال إفريقيا، كأس العالم)، كرة السلة، ألعاب القوى، الملاكمة، الفنون القتالية، الدراجات والتنس.' },
      { p: 'تشكل النقولات المباشرة للمباريات قلب الشبكة. في كل جولة من البطولة الاحترافية إنوي، يغطي راديو مارس المباريات بمعلق على عين المكان. مباريات أسود الأطلس (المنتخب الذكوري) ولبؤات الأطلس (المنتخب النسوي) تجذب أرقام استماع قياسية، خاصة خلال كأس إفريقيا وكأس العالم والألعاب الأولمبية.' },

      { h2: 'البطولة الاحترافية والمنافسات الوطنية' },
      { p: 'البطولة الاحترافية إنوي هي بطولة المغرب لكرة القدم المحترفة، تجمع 16 ناديا (12 في الدرجة الأولى وفرقا أخرى في الأقسام الأدنى). الوداد البيضاوي، الرجاء البيضاوي، الجيش الملكي، الفتح الرباطي والمغرب التطواني من أبرز الأندية التاريخية. يغطي راديو مارس الموسم بالكامل بتقارير ومجلات ونقولات حصرية مع البث المجاني.' },
      { p: 'الديربي البيضاوي (الوداد ضد الرجاء) من أكثر المباريات استماعاً في الموسم، تليه المواجهات الجهوية. خلال الأدوار النهائية، يضمن راديو مارس إصدارات خاصة مباشرة بأجواء الملاعب.' },

      { h2: 'أسود الأطلس — الشغف الوطني' },
      { p: 'عرف أسود الأطلس عقدا تاريخيا توج بالمركز الرابع في كأس العالم 2022 بقطر (أول بلد إفريقي وعربي يصل لهذا المستوى). فجر هذا الإنجاز نسب الاستماع الرياضي على جميع إذاعات المغرب. غطى راديو مارس كل مباراة مباشرة بتعليق ثنائي اللغة عربي-فرنسي.' },
      { p: 'لكأس إفريقيا، كأس العالم 2026 والألعاب الأولمبية القادمة، يحافظ راديو مارس على تغطية مكثفة بمراسلين خاصين، نقل المؤتمرات الصحفية ومجلات ما قبل المباريات. لبؤات الأطلس، وصيفات بطل إفريقيا 2022، تستفدن أيضا من تغطية متنامية.' },
    ],
    faq: [
      {
        q: 'ما هي أفضل إذاعة رياضية في المغرب؟',
        a: 'راديو مارس هي الإذاعة الرياضية الوحيدة في المغرب والمرجع المطلق للقطاع. تبث 24 ساعة على 24 في FM وعبر الأنترنت، مع تغطية شاملة للبطولة الاحترافية وأسود الأطلس.',
      },
      {
        q: 'على أي تردد تبث راديو مارس؟',
        a: 'تبث راديو مارس على 88.0 FM بالدار البيضاء، 90.6 FM بالرباط، وترددات جهوية متنوعة. عبر الأنترنت، متاحة 24 ساعة مجاناً على منصتنا.',
      },
      {
        q: 'هل ينقل راديو مارس جميع مباريات البطولة؟',
        a: 'يغطي راديو مارس كامل موسم البطولة الاحترافية إنوي (الدرجتين الأولى والثانية) بتعليقات مباشرة على المباريات الرئيسية ومجلات للمباريات الأخرى.',
      },
      {
        q: 'كيف يمكن متابعة أسود الأطلس مباشرة؟',
        a: 'ينقل راديو مارس مباشرة جميع مباريات أسود الأطلس (كأس إفريقيا، كأس العالم، التصفيات). بث HD مجاني على منصتنا، دون تسجيل.',
      },
      {
        q: 'هل توجد إذاعات رياضية بالعربية والفرنسية؟',
        a: 'يبث راديو مارس أساساً بالدارجة المغربية مع فقرات بالفرنسية. يقدم ميدي1 راديو نشرة رياضية ثنائية اللغة كل مساء.',
      },
    ],
    relatedStationIds: STATION_GROUPS.sport,
    related: [
      ...RELATED_AR.slice(0, 2),
      { label: 'صفحة راديو مارس', href: '/ar/station/radio-mars' },
      ...RELATED_AR.slice(2),
    ],
    cluster: 'sport',
  },

  // ─────────────────────────────────────────────────────────────────
  // CLUSTER E — Idha3a Wataniya AR
  // ─────────────────────────────────────────────────────────────────
  'radio-al-idha3a-al-wataniya': {
    lang: 'ar',
    path: '/ar/radio-al-idha3a-al-wataniya',
    altPath: '/radio-nationale-marocaine',
    title: 'الإذاعة الوطنية المغربية — راديو الإذاعة الوطنية المغربية مباشر',
    description: 'كل ما تريد معرفته عن الإذاعة الوطنية المغربية التابعة للشركة الوطنية للإذاعة والتلفزة (SNRT): التاريخ، الشبكات، مهمة الخدمة العمومية والاستماع المباشر.',
    h1: 'الإذاعة الوطنية المغربية — صوت المملكة المغربية الرسمي',
    intro: 'الإذاعة الوطنية المغربية هي القناة الإذاعية التاريخية للخدمة العمومية الإذاعية بالمملكة المغربية. تشغلها الشركة الوطنية للإذاعة والتلفزة (SNRT)، وتشكل منذ سنة 1928 ركيزة الإعلام والثقافة والهوية المغربية.',
    body: [
      { h2: 'الشركة الوطنية للإذاعة والتلفزة (SNRT)' },
      { p: 'الشركة الوطنية للإذاعة والتلفزة هي المشغل العمومي المغربي للإذاعة والتلفزيون. نشأت من تأميم راديو المغرب سنة 1956، وأعيدت هيكلتها كشركة مساهمة برأسمال عمومي سنة 2005. مقرها الاجتماعي بالرباط. تستغل عدة قنوات تلفزيونية (الأولى، تمازيغت، الثقافية، أفلام، العيون، الرياضية) وباقة إذاعات عمومية تغطي مجموع التراب الوطني.' },
      { p: 'تشمل مهمة الخدمة العمومية المسندة للشركة الإعلام والتعليم والثقافة ونشر القيم الوطنية وتثمين التراث المغربي. يفرض دفتر التحملات، المصادق عليه من طرف الهاكا، حصصاً للإنتاج الوطني، وفترات للتعليم والبث الديني، إضافة إلى تغطية FM شاملة للتراب الوطني.' },

      { h2: 'الإذاعة الوطنية — القناة الرئيسية' },
      { p: 'الإذاعة الوطنية هي القناة الإذاعية الرئيسية لمجموعة SNRT. تبث بالعربية (الفصحى والدارجة)، تقدم شبكة برامج عامة تجمع نشرات الأخبار، النقاشات السياسية، البرامج الثقافية، مجلات المجتمع، الموسيقى المغربية والعالمية، والبرامج الدينية. تبقى الإذاعة المرجعية في المناطق القروية ولدى المستمعين المرتبطين بصيغة مؤسساتية.' },
      { p: 'تتضمن المواعيد البارزة الإصدارات الرئيسية للنشرة الإخبارية (صباحاً، ظهراً، مساء)، النقل المباشر للمجلس الوزاري في المناسبات الكبرى، تغطية الأعياد الوطنية (عيد العرش، المسيرة الخضراء، عيد الفطر، عيد الأضحى)، ونقولات صلوات الجمعة من المساجد الكبرى للمملكة. خلال شهر رمضان المعظم، تحتل البرامج الخاصة بالروحانيات والتربية الدينية والترفيه العائلي مكانة بارزة في الشبكة.' },

      { h2: 'باقة إذاعات SNRT' },
      { ul: [
        'الإذاعة الوطنية — قناة عامة بالعربية.',
        'الشاينة الدولية — برامج بالفرنسية، جمهور حضري ومغاربة الخارج الناطقين بالفرنسية.',
        'الإذاعة الأمازيغية — بث بالشلحة وتمازيغت وتاريفيت.',
        'إذاعة محمد السادس للقرآن الكريم — تلاوات على مدار الساعة وبرامج دينية.',
        'الإذاعات الجهوية — الدار البيضاء، طنجة، فاس، مراكش، أكادير، العيون، وجدة.',
        'إذاعة أصوات العلوم — قناة تربوية وثقافية.',
      ]},

      { h2: 'تاريخ الإذاعة الوطنية المغربية' },
      { p: 'يبدأ التاريخ سنة 1928 بإحداث راديو المغرب بالرباط، آنذاك تحت الحماية الفرنسية. تبث المحطة في البداية بالفرنسية، ثم تضيف العربية وعدة لغات أخرى. عند الاستقلال سنة 1956، تؤمم الإذاعة وتوضع تحت الوصاية المباشرة للدولة. تصبح القناة الرئيسية للتواصل في المملكة الفتية المستقلة، وتلعب دوراً محورياً في بناء الهوية الوطنية بعد الاستعمار.' },
      { p: 'عبر العقود، تعرف الإذاعة الوطنية عدة مراحل تحديث: الانتقال من AM إلى FM في السبعينات، فتح محطات جهوية في الثمانينات والتسعينات، التحول الرقمي مع مطلع الألفية الثالثة. إنشاء SNRT سنة 2005 ووصول البث عبر الأنترنت يتيحان للإذاعة الوطنية الوصول للجالية المغربية حول العالم، خاصة في أوروبا وأمريكا الشمالية.' },

      { h2: 'كيف تستمع إلى الإذاعة الوطنية المغربية مباشرة؟' },
      { p: 'تبث الإذاعة الوطنية على مجموع التراب المغربي في FM (بترددات محلية تتكيف مع كل جهة: 93.6 بالدار البيضاء، 96.3 بالرباط، إلخ) وعلى الموجات المتوسطة AM للمناطق النائية. للاستماع الدولي أو عبر البث المباشر، يبقى التيار الرسمي متاحاً عبر موقع وتطبيق SNRT، إضافة إلى منصات التجميع الرئيسية. يوفر موقعنا الوصول إلى الإذاعات العمومية المغربية عبر مشغل موحد، دون تسجيل ومجاناً.' },
    ],
    faq: [
      {
        q: 'ما هي الإذاعة الوطنية المغربية؟',
        a: 'هي القناة الإذاعية العمومية الرئيسية بالمغرب، تشغلها الشركة الوطنية للإذاعة والتلفزة (SNRT). يعود تاريخها إلى راديو المغرب الذي تأسس سنة 1928 وتشكل الإذاعة العمومية التاريخية للمملكة.',
      },
      {
        q: 'من يشغل الإذاعات العمومية المغربية؟',
        a: 'الشركة الوطنية للإذاعة والتلفزة (SNRT)، مؤسسة عمومية مقرها الرباط، تشغل مجموع باقة الإذاعات العمومية: الإذاعة الوطنية، الشاينة الدولية، الإذاعة الأمازيغية، إذاعة القرآن الكريم وعدة محطات جهوية.',
      },
      {
        q: 'ما الفرق بين SNRT وميدي1؟',
        a: 'SNRT هي المشغل العمومي الرسمي. ميدي1 راديو إذاعة خاصة بوضع خاص (رأسمال فرنسي-مغربي)، مقرها طنجة، مستقلة عن SNRT. للاثنين مهام وشبكات مميزة.',
      },
      {
        q: 'هل الإذاعة الوطنية مجانية للاستماع؟',
        a: 'نعم، بالكامل. الإذاعة العمومية المغربية ممولة من الإتاوة السمعية البصرية وميزانية الدولة. الاستماع مجاني في FM وعبر الأنترنت.',
      },
      {
        q: 'هل يمكن الاستماع للإذاعة الوطنية من الخارج؟',
        a: 'نعم، البث الرسمي لـSNRT متاح من أي بلد. يستمع أبناء الجالية المغربية بشكل خاص للإذاعة الوطنية للبقاء على اتصال بالأخبار الرسمية المغربية.',
      },
    ],
    relatedStationIds: STATION_GROUPS.national,
    related: RELATED_AR,
    cluster: 'national',
  },
};

export const SEO_LANDING_KEYS = Object.keys(SEO_LANDINGS);
