/**
 * FAQ station-spécifiques utilisées par StationPage.jsx pour générer un
 * JSON-LD FAQPage par station — éligibilité Featured Snippets sur les
 * requêtes type "fréquence Radio Mars Casablanca", "comment écouter Hit Radio".
 *
 * Chaque clé = id slugifié de la station (ex. 'radio-mars').
 * Chaque entrée FAQ contient { q, a } en FR ET AR.
 */
export const STATION_FAQS = {
  'radio-mars': {
    fr: [
      {
        q: 'Quelle fréquence pour Radio Mars ?',
        a: "Radio Mars émet sur 88.0 FM à Casablanca, 90.6 FM à Rabat, 92.3 FM à Marrakech et sur diverses fréquences régionales selon les villes. En streaming, elle est disponible 24h/24 gratuitement sur radiolive.ma.",
      },
      {
        q: 'Radio Mars retransmet-elle les matchs des Lions de l\'Atlas ?',
        a: "Oui, Radio Mars retransmet en direct tous les matchs de la sélection nationale marocaine (CAN, Coupe du Monde, qualifications) avec des commentaires bilingues arabe-français.",
      },
      {
        q: 'Comment écouter Radio Mars en streaming gratuit ?',
        a: "Il suffit d'ouvrir notre site, d'aller sur la page Radio Mars et de cliquer sur Écouter. Aucune inscription ni téléchargement d'application. Le streaming fonctionne depuis n'importe quel pays.",
      },
      {
        q: 'Quel est le format de Radio Mars ?',
        a: "Radio Mars est la première et la seule radio thématique 100% sport au Maroc. Elle diffuse 24h/24 des programmes dédiés au football (Botola Pro), basket, athlétisme, boxe et autres disciplines.",
      },
    ],
    ar: [
      {
        q: 'ما هو تردد راديو مارس؟',
        a: 'تبث راديو مارس على 88.0 FM بالدار البيضاء، 90.6 FM بالرباط، 92.3 FM بمراكش وعلى ترددات جهوية مختلفة حسب المدن. عبر الأنترنت، متاحة 24 ساعة على 24 مجاناً في radiolive.ma.',
      },
      {
        q: 'هل ينقل راديو مارس مباريات أسود الأطلس؟',
        a: 'نعم، ينقل راديو مارس مباشرة جميع مباريات المنتخب المغربي (كأس إفريقيا، كأس العالم، التصفيات) بتعليقات ثنائية اللغة عربية وفرنسية.',
      },
      {
        q: 'كيف يمكن الاستماع إلى راديو مارس عبر البث المباشر مجاناً؟',
        a: 'يكفي فتح موقعنا، الذهاب إلى صفحة راديو مارس والضغط على زر الاستماع. دون تسجيل أو تحميل لأي تطبيق. يعمل البث من أي بلد.',
      },
      {
        q: 'ما هو تنسيق راديو مارس؟',
        a: 'راديو مارس هي أول وأكبر إذاعة متخصصة 100% في الرياضة بالمغرب. تبث على مدار الساعة برامج مخصصة لكرة القدم (البطولة الاحترافية)، كرة السلة، ألعاب القوى، الملاكمة والرياضات الأخرى.',
      },
    ],
  },

  'hit-radio': {
    fr: [
      {
        q: 'Quelle fréquence pour Hit Radio au Maroc ?',
        a: "Hit Radio dispose de 25 fréquences FM réparties dans tout le Maroc. À Casablanca elle émet sur 87.7 FM, à Rabat sur 89.5 FM, à Marrakech sur 95.5 FM, à Tanger sur 90.5 FM, à Fès sur 96.5 FM et à Agadir sur 97.5 FM.",
      },
      {
        q: 'Quel est le slogan de Hit Radio ?',
        a: "Le slogan de Hit Radio est « Ma vie, ma radio ». La station cible le public 15-35 ans avec une programmation pop, R&B, hip-hop et hits internationaux.",
      },
      {
        q: 'Comment écouter Hit Radio en direct gratuitement ?',
        a: "Hit Radio est diffusée en streaming HD gratuit sur radiolive.ma. Aucune inscription, aucun téléchargement. Fonctionne sur ordinateur, smartphone, tablette et voiture connectée.",
      },
    ],
    ar: [
      {
        q: 'ما هو تردد هيت راديو في المغرب؟',
        a: 'تتوفر هيت راديو على 25 تردداً FM موزعة في كل المغرب. في الدار البيضاء تبث على 87.7 FM، في الرباط 89.5 FM، في مراكش 95.5 FM، في طنجة 90.5 FM، في فاس 96.5 FM وفي أكادير 97.5 FM.',
      },
      {
        q: 'ما هو شعار هيت راديو؟',
        a: 'شعار هيت راديو هو "حياتي، راديوهي". تستهدف المحطة الجمهور من 15 إلى 35 سنة ببرمجة بوب، R&B، هيب هوب وهيتس عالمية.',
      },
      {
        q: 'كيف يمكن الاستماع لهيت راديو مباشرة مجاناً؟',
        a: 'تبث هيت راديو عبر البث المباشر بجودة عالية مجاناً على radiolive.ma. لا تسجيل، لا تحميل. تعمل على الحاسوب والهاتف واللوحة والسيارة المتصلة.',
      },
    ],
  },

  'medi-1-radio': {
    fr: [
      {
        q: 'Quelle fréquence pour Medi 1 Radio ?',
        a: "Medi 1 Radio (Méditerranée Internationale), basée à Tanger depuis 1980, émet sur 88.2 FM à Casablanca, 88.6 FM à Rabat, 100.6 FM à Marrakech et 101.0 FM à Tanger. Elle couvre tout le Maghreb et le sud de l'Europe.",
      },
      {
        q: 'Medi 1 est-elle une radio publique ?',
        a: "Non. Medi 1 Radio est une station privée à statut spécial, à capital franco-marocain. Elle est indépendante de la SNRT (Société Nationale de Radiodiffusion). Sa mission est l'information bilingue franco-arabe pour le Maghreb et la diaspora.",
      },
      {
        q: 'Comment écouter Medi 1 depuis l\'étranger ?',
        a: "Medi 1 Radio est accessible en streaming HD gratuit depuis n'importe quel pays sur radiolive.ma. Particulièrement écoutée par la diaspora marocaine en France, Belgique, Pays-Bas, Espagne et Canada.",
      },
    ],
    ar: [
      {
        q: 'ما هو تردد ميدي 1 راديو؟',
        a: 'تبث ميدي 1 راديو (المتوسط الدولية)، ومقرها طنجة منذ 1980، على 88.2 FM بالدار البيضاء، 88.6 FM بالرباط، 100.6 FM بمراكش و101.0 FM بطنجة. تغطي كل المغرب الكبير وجنوب أوروبا.',
      },
      {
        q: 'هل ميدي 1 إذاعة عمومية؟',
        a: 'لا. ميدي 1 راديو محطة خاصة بوضع خاص، برأسمال فرنسي-مغربي. مستقلة عن الشركة الوطنية للإذاعة والتلفزة (SNRT). مهمتها الإعلام ثنائي اللغة عربية-فرنسية للمغرب الكبير وأبناء الجالية.',
      },
      {
        q: 'كيف يمكن الاستماع لميدي 1 من الخارج؟',
        a: 'ميدي 1 راديو متاحة عبر البث المباشر بجودة عالية مجاناً من أي بلد على radiolive.ma. يستمع لها بشكل خاص أبناء الجالية المغربية في فرنسا وبلجيكا وهولندا وإسبانيا وكندا.',
      },
    ],
  },

  'chada-fm': {
    fr: [
      {
        q: 'Quelle fréquence pour Chada FM ?',
        a: "Chada FM émet sur 87.6 FM à Casablanca, 89.0 FM à Rabat, 96.0 FM à Marrakech, 91.5 FM à Tanger, 94.0 FM à Fès et 95.0 FM à Agadir.",
      },
      {
        q: 'Quel est le format de Chada FM ?',
        a: "Chada FM, lancée en 2009, est la grande radio des variétés arabes au Maroc. Programmation à 80 % chaabi marocain, complétée par la pop libanaise, le tarab égyptien, le raï algérien et la chanson marocaine.",
      },
      {
        q: 'Pourquoi Chada FM est-elle si populaire au Maroc ?',
        a: "Chada FM est la radio des mariages, des taxis et des soirées familiales. Elle programme les grands classiques du chaabi (Daoudi, Stati, Senhaji) et les hits du moment, avec un ton chaleureux qui parle à toutes les générations.",
      },
    ],
    ar: [
      {
        q: 'ما هو تردد شدى إف إم؟',
        a: 'تبث شدى إف إم على 87.6 FM بالدار البيضاء، 89.0 FM بالرباط، 96.0 FM بمراكش، 91.5 FM بطنجة، 94.0 FM بفاس و95.0 FM بأكادير.',
      },
      {
        q: 'ما هو تنسيق شدى إف إم؟',
        a: 'شدى إف إم، التي انطلقت سنة 2009، هي الإذاعة الكبرى للمنوعات العربية بالمغرب. برمجة بنسبة 80% شعبي مغربي، تكملها البوب اللبناني والطرب المصري والراي الجزائري والأغنية المغربية.',
      },
      {
        q: 'لماذا شدى إف إم تحظى بشعبية كبيرة في المغرب؟',
        a: 'شدى إف إم هي إذاعة الأعراس والطاكسيات والسهرات العائلية. تبرمج الكلاسيكيات الكبرى للشعبي (الداودي، السطاتي، الصنهاجي) وهيتس اللحظة، بنبرة دافئة تخاطب كل الأجيال.',
      },
    ],
  },
};

/**
 * Renvoie la liste de FAQs pour une station + une langue, ou un tableau vide
 * si la station n'a pas de FAQ définie.
 */
export function getStationFaqs(stationId, lang = 'fr') {
  const entry = STATION_FAQS[stationId];
  if (!entry) return [];
  return entry[lang === 'ar' ? 'ar' : 'fr'] || [];
}
