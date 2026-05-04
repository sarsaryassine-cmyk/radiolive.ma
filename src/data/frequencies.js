/**
 * Moroccan FM frequencies grouped by city.
 *
 * Sources for the major cities (Casablanca, Rabat, Marrakech, Tanger, Fès,
 * Agadir): public broadcasting data from the HACA (Haute Autorité de la
 * Communication Audiovisuelle), official station websites and FM-scan reports
 * compiled from radio-locator and onlineradiobox.
 *
 * For mid-size cities (Oujda, Meknès, Kenitra, Tétouan, El Jadida, Safi,
 * Béni Mellal, Khouribga, Nador, Laâyoune), the frequencies marked
 * `approximate: true` should be checked locally — antenna repeaters can
 * change without national publicity. The page UI flags these clearly.
 *
 * Each station references its slug (matching public/radios.json) so the
 * frequency table on each city page can deep-link to /station/<slug>.
 */

export const CITY_KEYS = [
  'casablanca', 'rabat', 'marrakech', 'fes', 'tanger', 'agadir',
  'oujda', 'meknes', 'kenitra', 'tetouan', 'el-jadida', 'safi',
  'beni-mellal', 'khouribga', 'nador', 'laayoune',
];

const radio = (name, slug, fm, type, approximate = false) =>
  ({ name, slug, fm, type, approximate });

const COMMON_NATIONAL = (city) => [
  // SNRT public stations — same identifiers, different FM per city
];

export const FREQUENCIES = {
  casablanca: {
    name: 'Casablanca',
    region: 'Casablanca-Settat',
    population: '3 750 000',
    intro:
      "Casablanca est la capitale économique du Maroc et le cœur battant du paysage radiophonique national. La majorité des grandes radios privées ont leurs studios principaux dans la métropole et y diffusent leurs fréquences les plus puissantes, captées dans tout le Grand Casablanca, de Mohammedia à Bouskoura.",
    coords: { lat: 33.5731, lng: -7.5898 },
    stations: [
      radio('Radio Mars',          'radio-mars',          '88.0', 'Sport'),
      radio('Medina FM',           'medinafm',            '88.5', 'Musique / Variétés'),
      radio('Skyrock Casablanca',  'skyrock-casablanca',  '90.5', 'Hip-Hop / R&B'),
      radio('SNRT Chaîne Inter',   null,                  '92.0', 'Service public'),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge'),
      radio('Radio 2M',            'radio-2m',            '93.5', 'Généraliste'),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '93.3', 'Religieuse'),
      radio('Hit Radio',           'hit-radio',           '95.4', 'Hits / Pop'),
      radio('Radio Aswat',         'radio-aswat',         '95.7', 'Variétés arabes'),
      radio('Cap Radio',           'cap-radio',           '96.5', 'Économie / Business'),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Chada FM',            'chada-fm',            '98.0', 'Variétés arabes'),
      radio('Medradio',            'medradio',            '101.6', 'Variétés grand public'),
      radio('MFM',                 'mfm',                 '102.5', 'Afro-orientale'),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.7', 'Service public'),
    ],
  },

  rabat: {
    name: 'Rabat',
    region: 'Rabat-Salé-Kénitra',
    population: '580 000',
    intro:
      "Rabat est la capitale politique et administrative du Maroc, et son paysage radiophonique reflète son rôle institutionnel. C'est ici que se trouvent les sièges historiques de la SNRT (Société Nationale de Radiodiffusion et de Télévision) et de la HACA, ainsi que les studios principaux de plusieurs radios publiques.",
    coords: { lat: 34.0209, lng: -6.8416 },
    stations: [
      radio('SNRT Al Idaâ Al Wataniya', null,            '88.7', 'Service public'),
      radio('Hit Radio',           'hit-radio',           '92.5', 'Hits / Pop'),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge'),
      radio('Radio Aswat',         'radio-aswat',         '96.0', 'Variétés arabes'),
      radio('SNRT Chaîne Inter',   null,                  '96.0', 'Service public'),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Chada FM',            'chada-fm',            '99.5', 'Variétés arabes'),
      radio('Cap Radio',           'cap-radio',           '99.4', 'Économie / Business'),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '102.9', 'Religieuse'),
      radio('Radio 2M',            'radio-2m',            '102.7', 'Généraliste'),
      radio('Medradio',            'medradio',            '104.4', 'Variétés grand public'),
      radio('MFM',                 'mfm',                 '94.6', 'Afro-orientale'),
    ],
  },

  marrakech: {
    name: 'Marrakech',
    region: 'Marrakech-Safi',
    population: '930 000',
    intro:
      "Marrakech, la cité ocre, accueille des millions de touristes chaque année et dispose d'un paysage radiophonique propre où la radio régionale Marrakech Plus côtoie les grandes chaînes nationales. La ville rouge vit aussi au rythme des grands festivals (Festival International du Film de Marrakech, Marrakech du Rire) qui mobilisent les radios.",
    coords: { lat: 31.6295, lng: -7.9811 },
    stations: [
      radio('Marrakech Plus',      'marrakech-plus',      '90.4', 'Régionale'),
      radio('Hit Radio',           'hit-radio',           '91.8', 'Hits / Pop'),
      radio('MFM',                 'mfm',                 '94.0', 'Afro-orientale'),
      radio('Chada FM',            'chada-fm',            '95.4', 'Variétés arabes'),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge'),
      radio('Radio Aswat',         'radio-aswat',         '96.5', 'Variétés arabes'),
      radio('Radio 2M',            'radio-2m',            '99.0', 'Généraliste'),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.5', 'Service public'),
      radio('SNRT Chaîne Inter',   null,                  '99.6', 'Service public'),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '90.8', 'Religieuse'),
      radio('Medradio',            'medradio',            '103.6', 'Variétés grand public'),
    ],
  },

  fes: {
    name: 'Fès',
    region: 'Fès-Meknès',
    population: '1 250 000',
    intro:
      "Fès, capitale spirituelle et culturelle du Maroc, fondée en 789 et abritant l'une des plus anciennes universités du monde — la Quaraouiyine — vit au rythme d'une radiophonie marquée par la dimension religieuse, andalouse et académique de la ville. Les radios coraniques y sont particulièrement écoutées, ainsi que les programmes consacrés au patrimoine musical arabo-andalou.",
    coords: { lat: 34.0181, lng: -5.0078 },
    stations: [
      radio('Hit Radio',           'hit-radio',           '91.5', 'Hits / Pop'),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Chada FM',            'chada-fm',            '99.4', 'Variétés arabes'),
      radio('Radio Aswat',         'radio-aswat',         '95.0', 'Variétés arabes'),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge'),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '94.3', 'Religieuse'),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.5', 'Service public'),
      radio('SNRT Chaîne Inter',   null,                  '92.6', 'Service public'),
      radio('MFM',                 'mfm',                 '93.5', 'Afro-orientale'),
      radio('Medradio',            'medradio',            '102.4', 'Variétés grand public'),
      radio('Radio Manarat',       'radio-manarat',       '90.8', 'Religieuse / Culturelle', true),
    ],
  },

  tanger: {
    name: 'Tanger',
    region: 'Tanger-Tétouan-Al Hoceïma',
    population: '1 065 000',
    intro:
      "Tanger est intimement liée à l'histoire de la radio marocaine — c'est dans cette ville-monde du nord, carrefour entre l'Afrique et l'Europe, que Médi 1 Radio a été créée en 1980 et a depuis son siège historique. Tanger est également l'une des seules villes du Maroc à capter facilement les radios espagnoles depuis le détroit de Gibraltar.",
    coords: { lat: 35.7595, lng: -5.8340 },
    stations: [
      radio('Hit Radio',           'hit-radio',           '96.7', 'Hits / Pop'),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Chada FM',            'chada-fm',            '99.1', 'Variétés arabes'),
      radio('Radio Aswat',         'radio-aswat',         '95.4', 'Variétés arabes'),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge'),
      radio('Cap Radio',           'cap-radio',           '94.0', 'Économie / Business'),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.7', 'Service public'),
      radio('SNRT Chaîne Inter',   null,                  '90.0', 'Service public'),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '93.0', 'Religieuse'),
      radio('Medradio',            'medradio',            '102.0', 'Variétés grand public'),
      radio('MFM',                 'mfm',                 '93.5', 'Afro-orientale'),
    ],
  },

  agadir: {
    name: 'Agadir',
    region: 'Souss-Massa',
    population: '930 000',
    intro:
      "Agadir, capitale du Souss et grande ville balnéaire, dispose d'une scène radiophonique régionale forte avec une identité amazighe-tachelhit marquée. Plusieurs radios y diffusent en tachelhit aux côtés des grandes chaînes nationales. Le Festival Timitar des musiques amazighes, organisé chaque été, mobilise toutes les antennes.",
    coords: { lat: 30.4278, lng: -9.5981 },
    stations: [
      radio('Hit Radio',           'hit-radio',           '92.4', 'Hits / Pop'),
      radio('Radio Plus Agadir',   'radio-plus-agadir',   '93.4', 'Régionale / Amazigh'),
      radio('Chada FM',            'chada-fm',            '91.7', 'Variétés arabes'),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Radio Atbir',         'radio-atbir',         '94.3', 'Régionale amazighe', true),
      radio('Radio Achkid FM',     'radio-achkid-fm',     '95.7', 'Régionale amazighe', true),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge'),
      radio('Radio Aswat',         'radio-aswat',         '99.0', 'Variétés arabes'),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.6', 'Service public'),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '90.7', 'Religieuse'),
      radio('Medradio',            'medradio',            '103.4', 'Variétés grand public'),
      radio('MFM',                 'mfm',                 '95.0', 'Afro-orientale', true),
    ],
  },

  oujda: {
    name: 'Oujda',
    region: 'Oriental',
    population: '500 000',
    intro:
      "Oujda, capitale de la région orientale, est traversée par les ondes marocaines mais aussi algériennes — une particularité géographique unique au Maroc. Sa population, partagée entre les cultures arabe et amazighe-rifaine, écoute aussi bien les radios marocaines nationales que les programmes francophones de Médi 1 et les fréquences raï emblématiques.",
    coords: { lat: 34.6814, lng: -1.9086 },
    stations: [
      radio('Hit Radio',           'hit-radio',           '95.0', 'Hits / Pop'),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Chada FM',            'chada-fm',            '95.4', 'Variétés arabes', true),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.7', 'Service public'),
      radio('SNRT Radio régionale Oujda', null,           '94.4', 'Régionale', true),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '93.0', 'Religieuse'),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge'),
      radio('Radio Aswat',         'radio-aswat',         '96.0', 'Variétés arabes', true),
      radio('Medradio',            'medradio',            '101.5', 'Variétés grand public', true),
      radio('MFM',                 'mfm',                 '93.5', 'Afro-orientale', true),
    ],
  },

  meknes: {
    name: 'Meknès',
    region: 'Fès-Meknès',
    population: '630 000',
    intro:
      "Meknès, l'une des quatre villes impériales du Maroc, partage son paysage radio avec sa proche voisine Fès. La ville bénéficie d'une bonne couverture FM des grandes radios nationales et privées, ainsi que des fréquences régionales du nord-est marocain.",
    coords: { lat: 33.8935, lng: -5.5547 },
    stations: [
      radio('Hit Radio',           'hit-radio',           '91.5', 'Hits / Pop', true),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Chada FM',            'chada-fm',            '99.4', 'Variétés arabes', true),
      radio('Radio Aswat',         'radio-aswat',         '95.4', 'Variétés arabes', true),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.5', 'Service public'),
      radio('SNRT Chaîne Inter',   null,                  '92.6', 'Service public', true),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '94.3', 'Religieuse', true),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge', true),
      radio('Medradio',            'medradio',            '102.4', 'Variétés grand public', true),
      radio('MFM',                 'mfm',                 '93.5', 'Afro-orientale', true),
    ],
  },

  kenitra: {
    name: 'Kénitra',
    region: 'Rabat-Salé-Kénitra',
    population: '430 000',
    intro:
      "Kénitra, port atlantique au nord de Rabat, capte la majorité des fréquences de la capitale grâce à sa proximité géographique. La ville dispose néanmoins de relais locaux pour certaines radios nationales et écoute majoritairement les programmes en darija et arabe standard.",
    coords: { lat: 34.2610, lng: -6.5802 },
    stations: [
      radio('Hit Radio',           'hit-radio',           '92.5', 'Hits / Pop', true),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Chada FM',            'chada-fm',            '99.5', 'Variétés arabes', true),
      radio('Radio Aswat',         'radio-aswat',         '96.0', 'Variétés arabes', true),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge', true),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.7', 'Service public'),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '102.9', 'Religieuse', true),
      radio('Radio 2M',            'radio-2m',            '102.7', 'Généraliste', true),
      radio('Medradio',            'medradio',            '104.4', 'Variétés grand public', true),
      radio('MFM',                 'mfm',                 '94.6', 'Afro-orientale', true),
    ],
  },

  tetouan: {
    name: 'Tétouan',
    region: 'Tanger-Tétouan-Al Hoceïma',
    population: '380 000',
    intro:
      "Tétouan, l'une des grandes villes andalouses du Maroc et capitale historique de la musique arabo-andalouse, vit dans l'orbite radiophonique de Tanger. Le conservatoire de musique andalouse de Tétouan reste l'une des références mondiales et plusieurs radios y consacrent des plages spéciales.",
    coords: { lat: 35.5785, lng: -5.3684 },
    stations: [
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Hit Radio',           'hit-radio',           '88.4', 'Hits / Pop'),
      radio('Chada FM',            'chada-fm',            '99.1', 'Variétés arabes', true),
      radio('Radio Aswat',         'radio-aswat',         '95.4', 'Variétés arabes', true),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.7', 'Service public'),
      radio('SNRT Radio régionale Tétouan', null,         '93.5', 'Régionale', true),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '93.0', 'Religieuse', true),
      radio('Médi 1 Radio Andalouse', 'medi-1-radio-andalouse', '102.0', 'Andalouse', true),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge', true),
      radio('Medradio',            'medradio',            '102.0', 'Variétés grand public', true),
    ],
  },

  'el-jadida': {
    name: 'El Jadida',
    region: 'Casablanca-Settat',
    population: '195 000',
    intro:
      "El Jadida, port atlantique au sud de Casablanca, capte la majorité des fréquences de la métropole grâce à sa proximité. Ville historique inscrite au patrimoine mondial de l'UNESCO pour sa cité portugaise, elle accueille chaque année le Festival Jawhara qui mobilise les radios marocaines.",
    coords: { lat: 33.2316, lng: -8.5007 },
    stations: [
      radio('Hit Radio',           'hit-radio',           '93.6', 'Hits / Pop'),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Chada FM',            'chada-fm',            '98.0', 'Variétés arabes', true),
      radio('Radio Aswat',         'radio-aswat',         '95.7', 'Variétés arabes', true),
      radio('Radio 2M',            'radio-2m',            '93.5', 'Généraliste'),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge', true),
      radio('Radio Mars',          'radio-mars',          '88.0', 'Sport', true),
      radio('Cap Radio',           'cap-radio',           '96.5', 'Économie / Business', true),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.7', 'Service public'),
      radio('Medradio',            'medradio',            '101.6', 'Variétés grand public', true),
    ],
  },

  safi: {
    name: 'Safi',
    region: 'Marrakech-Safi',
    population: '310 000',
    intro:
      "Safi, port atlantique connu pour sa poterie traditionnelle et son industrie phosphatière, dispose d'un paysage radio assez complet, avec une bonne couverture des grandes chaînes nationales et plusieurs relais régionaux. La région de Doukkala-Abda, dont Safi fait partie, est aussi le berceau de l'aïta — un genre musical chaabi traditionnel.",
    coords: { lat: 32.2994, lng: -9.2372 },
    stations: [
      radio('Hit Radio',           'hit-radio',           '93.6', 'Hits / Pop', true),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Chada FM',            'chada-fm',            '95.4', 'Variétés arabes', true),
      radio('Radio Aswat',         'radio-aswat',         '95.7', 'Variétés arabes', true),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge', true),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.7', 'Service public'),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '102.9', 'Religieuse', true),
      radio('Medradio',            'medradio',            '101.6', 'Variétés grand public', true),
      radio('MFM',                 'mfm',                 '94.4', 'Afro-orientale', true),
    ],
  },

  'beni-mellal': {
    name: 'Béni Mellal',
    region: 'Béni Mellal-Khénifra',
    population: '195 000',
    intro:
      "Béni Mellal, capitale de la région agricole du Tadla-Azilal, est entourée de villages amazighophones du Moyen Atlas. Le paysage radio reflète cette dualité linguistique — darija dans la ville, tamazight dans les villages alentour. Plusieurs radios locales émettent en variantes amazighes du Moyen Atlas.",
    coords: { lat: 32.3373, lng: -6.3498 },
    stations: [
      radio('Hit Radio',           'hit-radio',           '91.3', 'Hits / Pop'),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Chada FM',            'chada-fm',            '95.4', 'Variétés arabes', true),
      radio('Radio Aswat',         'radio-aswat',         '95.7', 'Variétés arabes', true),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.5', 'Service public'),
      radio('SNRT Radio régionale Béni Mellal', null,     '94.0', 'Régionale', true),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge', true),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '93.0', 'Religieuse', true),
      radio('Medradio',            'medradio',            '101.6', 'Variétés grand public', true),
    ],
  },

  khouribga: {
    name: 'Khouribga',
    region: 'Béni Mellal-Khénifra',
    population: '200 000',
    intro:
      "Khouribga, capitale mondiale du phosphate et siège historique de l'OCP (Office Chérifien des Phosphates), dispose d'un paysage radio influencé par sa population ouvrière et industrielle. Le Festival International du Cinéma Africain de Khouribga, qui se tient chaque année, mobilise les antennes locales.",
    coords: { lat: 32.8811, lng: -6.9063 },
    stations: [
      radio('Hit Radio',           'hit-radio',           '95.0', 'Hits / Pop', true),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Chada FM',            'chada-fm',            '99.4', 'Variétés arabes', true),
      radio('Radio Aswat',         'radio-aswat',         '95.7', 'Variétés arabes', true),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.7', 'Service public'),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge', true),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '93.0', 'Religieuse', true),
      radio('Medradio',            'medradio',            '101.6', 'Variétés grand public', true),
      radio('Radio 2M',            'radio-2m',            '93.5', 'Généraliste', true),
    ],
  },

  nador: {
    name: 'Nador',
    region: 'Oriental',
    population: '160 000',
    intro:
      "Nador, ville rifaine du nord-est marocain, est le grand pôle régional de la culture berbère-rifaine (tarifit). Sa population entretient des liens forts avec la diaspora marocaine de Belgique, des Pays-Bas et d'Allemagne. Plusieurs radios diffusent en tarifit et en arabe, et la ville capte également les radios espagnoles de Melilla voisine.",
    coords: { lat: 35.1681, lng: -2.9335 },
    stations: [
      radio('Hit Radio',           'hit-radio',           '95.0', 'Hits / Pop', true),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Chada FM',            'chada-fm',            '95.4', 'Variétés arabes', true),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.7', 'Service public'),
      radio('SNRT Radio régionale Nador (tarifit)', null, '94.4', 'Régionale rifaine', true),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge', true),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '93.0', 'Religieuse', true),
      radio('Medradio',            'medradio',            '101.5', 'Variétés grand public', true),
      radio('MFM',                 'mfm',                 '93.5', 'Afro-orientale', true),
    ],
  },

  laayoune: {
    name: 'Laâyoune',
    region: 'Laâyoune-Sakia El Hamra',
    population: '230 000',
    intro:
      "Laâyoune, capitale des Provinces du Sud du Maroc, dispose d'un paysage radio spécifique qui reflète l'identité hassanie de la région. La SNRT y exploite une radio régionale dédiée en hassani et arabe, et les grandes chaînes nationales couvrent la ville par relais hertzien.",
    coords: { lat: 27.1418, lng: -13.1873 },
    stations: [
      radio('SNRT Radio Laâyoune (hassani)', null,        '95.0', 'Régionale hassanie'),
      radio('Médi 1 Radio',        'medi-1-radio',        '97.5', 'Internationale FR/AR'),
      radio('Hit Radio',           'hit-radio',           '92.4', 'Hits / Pop', true),
      radio('Chada FM',            'chada-fm',            '99.4', 'Variétés arabes', true),
      radio('SNRT Al Idaâ Al Wataniya', null,             '88.7', 'Service public'),
      radio('Radio Coran (SNRT)',  'qoran-radio',         '93.0', 'Religieuse', true),
      radio('SNRT Chaîne Inter',   null,                  '96.0', 'Service public', true),
      radio('Atlantic Radio',      'atlantic-radio',      '92.5', 'Économie / Lounge', true),
      radio('Medradio',            'medradio',            '101.6', 'Variétés grand public', true),
    ],
  },
};

export const cityList = () => CITY_KEYS.map((key) => ({
  key,
  ...FREQUENCIES[key],
}));
