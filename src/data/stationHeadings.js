/**
 * H1 + H2 optimisés pour l'intention de recherche, par station (slug = radio.id).
 *
 * - h1 : remplace le H1 du hero (était le simple nom de la station).
 * - h2 : devient le PREMIER H2 de la page (remplace l'ancien titre auto
 *        « ## Écouter … » généré par buildEcouterFallback) → zéro doublon H1/H2.
 *
 * Appliqué uniquement aux pages FR (les pages /ar gardent le nom + le H2 par
 * défaut). Slug non présent ici → repli sur le comportement par défaut.
 *
 * Source : tableau éditorial validé. H1 = « Écouter X en direct & en ligne
 * gratuitement », H2 = « X à écouter en live : … » (angle différenciant).
 */
export const STATION_HEADINGS = {
  'radio-mars': { h1: "Écouter Radio Mars en direct & en ligne gratuitement", h2: "Radio Mars à écouter en live : toute l'actualité du football marocain et international" },
  'hit-radio': { h1: "Écouter Hit Radio en direct & en ligne gratuitement", h2: "Hit Radio à écouter en live : les meilleurs hits et émissions tendances 24h/24" },
  'medi-1-radio': { h1: "Écouter Medi 1 Radio en direct & en ligne gratuitement", h2: "Medi 1 Radio à écouter en live : information et débats en continu" },
  'mfm': { h1: "Écouter MFM Radio en direct & en ligne gratuitement", h2: "MFM à écouter en live : musique marocaine et divertissement quotidien" },
  'aswat-fm': { h1: "Écouter Aswat FM en direct & en ligne gratuitement", h2: "Aswat FM à écouter en live : émissions populaires et musique variée" },
  'med-radio': { h1: "Écouter Med Radio en direct & en ligne gratuitement", h2: "Med Radio à écouter en live : actualités, société et culture en continu" },
  'chada-fm': { h1: "Écouter Chada FM en direct & en ligne gratuitement", h2: "Chada FM à écouter en live : musique marocaine et talk-shows" },
  'u-radio': { h1: "Écouter U Radio en direct & en ligne gratuitement", h2: "U Radio à écouter en live : hits internationaux et lifestyle" },
  'atlantic-radio': { h1: "Écouter Atlantic Radio en direct & en ligne gratuitement", h2: "Atlantic Radio à écouter en live : économie et actualité nationale" },
  'radio-2m': { h1: "Écouter Radio 2M en direct & en ligne gratuitement", h2: "Radio 2M à écouter en live : émissions, info et musique marocaine" },
  'cap-radio': { h1: "Écouter Cap Radio en direct & en ligne gratuitement", h2: "Cap Radio à écouter en live : actualité régionale et musique" },
  'radio-plus-agadir': { h1: "Écouter Radio Plus Agadir en direct & en ligne gratuitement", h2: "Radio Plus Agadir à écouter en live : infos locales et musique du Sud" },
  'marrakech-plus': { h1: "Écouter Marrakech Plus en direct & en ligne gratuitement", h2: "Marrakech Plus à écouter en live : actualité et culture de Marrakech" },
  'qoran-radio': { h1: "Écouter Qoran Radio en direct & en ligne gratuitement", h2: "Qoran Radio à écouter en live : récitations du Saint Coran 24h/24" },
  'adwaa-fm': { h1: "Écouter Adwaa FM en direct & en ligne gratuitement", h2: "Adwaa FM à écouter en live : musique arabe et divertissement" },
  'medina-fm': { h1: "Écouter Medina FM en direct & en ligne gratuitement", h2: "Medina FM à écouter en live : culture marocaine et patrimoine musical" },
  'radio-yabiladi': { h1: "Écouter Radio Yabiladi en direct & en ligne gratuitement", h2: "Radio Yabiladi à écouter en live : radio de la diaspora marocaine" },
  'abdul-basit': { h1: "Écouter Abdul Basit en direct & en ligne gratuitement", h2: "Abdul Basit à écouter en live : récitations coraniques apaisantes" },
  'achkid-fm': { h1: "Écouter Achkid FM en direct & en ligne gratuitement", h2: "Achkid FM à écouter en live : musique amazighe et culture berbère" },
  'al-quran-radio': { h1: "Écouter Al Quran Radio en direct & en ligne gratuitement", h2: "Al Quran Radio à écouter en live : Coran et enseignements islamiques" },
  'aziz-al-mustaphi': { h1: "Écouter Aziz Al Mustaphi en direct & en ligne gratuitement", h2: "Aziz Al Mustaphi à écouter en live : récitations coraniques" },
  'fayroz': { h1: "Écouter Fayroz Radio en direct & en ligne gratuitement", h2: "Fayroz à écouter en live : classiques de Fairuz et musique arabe" },
  'hip-hop-soul-radio-radio-music': { h1: "Écouter Hip Hop Soul Radio en direct & en ligne gratuitement", h2: "Hip Hop Soul Radio à écouter en live : hip-hop, R&B et soul" },
  'maher-al-muaiqly': { h1: "Écouter Maher Al Muaiqly en direct & en ligne gratuitement", h2: "Maher Al Muaiqly à écouter en live : récitations du Saint Coran" },
  'medi-1-classique': { h1: "Écouter Medi 1 Classique en direct & en ligne gratuitement", h2: "Medi 1 Classique à écouter en live : musique classique et œuvres" },
  'medi-1-dj': { h1: "Écouter Medi 1 DJ en direct & en ligne gratuitement", h2: "Medi 1 DJ à écouter en live : électro et DJ sets exclusifs" },
  'medi-1-radio-andalouse': { h1: "Écouter Medi 1 Radio Andalouse en direct & en ligne gratuitement", h2: "Medi 1 Andalouse à écouter en live : musique andalouse marocaine" },
  'medi-1-tarab': { h1: "Écouter Medi 1 Tarab en direct & en ligne gratuitement", h2: "Medi 1 Tarab à écouter en live : les plus belles voix du tarab arabe" },
  'mohammed-ayyub': { h1: "Écouter Mohammed Ayyub en direct & en ligne gratuitement", h2: "Mohammed Ayyub à écouter en live : récitations coraniques" },
  'mukhtasar-tafseer': { h1: "Écouter Mukhtasar Tafseer en direct & en ligne gratuitement", h2: "Mukhtasar Tafseer à écouter en live : explication du Coran" },
  'ness-radio': { h1: "Écouter Ness Radio en direct & en ligne gratuitement", h2: "Ness Radio à écouter en live : actualité, culture et musique" },
  'only-rai': { h1: "Écouter Only Rai en direct & en ligne gratuitement", h2: "Only Rai à écouter en live : raï maghrébin non-stop" },
  'quran-karim-radio': { h1: "Écouter Quran Karim Radio en direct & en ligne gratuitement", h2: "Quran Karim Radio à écouter en live : Coran et invocations" },
  'radio-adwaa-atfal-4': { h1: "Écouter Radio Adwaa Atfal 4 en direct & en ligne gratuitement", h2: "Radio Adwaa Atfal à écouter en live : programmes éducatifs pour enfants" },
  'radio-adwaa-mazika-5': { h1: "Écouter Radio Adwaa Mazika 5 en direct & en ligne gratuitement", h2: "Radio Adwaa Mazika à écouter en live : musique arabe populaire" },
  'radio-adwaa-music-3': { h1: "Écouter Radio Adwaa Music 3 en direct & en ligne gratuitement", h2: "Radio Adwaa Music à écouter en live : hits arabes et internationaux" },
  'radio-atbir': { h1: "Écouter Radio Atbir en direct & en ligne gratuitement", h2: "Radio Atbir à écouter en live : contenus religieux et récitations" },
  'radio-azawan': { h1: "Écouter Radio Azawan en direct & en ligne gratuitement", h2: "Radio Azawan à écouter en live : musique amazighe marocaine" },
  'radio-manarat': { h1: "Écouter Radio Manarat en direct & en ligne gratuitement", h2: "Radio Manarat à écouter en live : spiritualité et programmes religieux" },
  'radio-monte-carlo-doualiya': { h1: "Écouter Monte Carlo Doualiya en direct & en ligne gratuitement", h2: "Monte Carlo Doualiya à écouter en live : actualité internationale arabe" },
  'radio-plus': { h1: "Écouter Radio Plus en direct & en ligne gratuitement", h2: "Radio Plus à écouter en live : info régionale et divertissement" },
  'radio-sawt-alamal': { h1: "Écouter Radio Sawt Alamal en direct & en ligne gratuitement", h2: "Radio Sawt Alamal à écouter en live : programmes sociaux et culturels" },
  'radio-star-maroc-fm': { h1: "Écouter Radio Star Maroc FM en direct & en ligne gratuitement", h2: "Radio Star Maroc FM à écouter en live : musique marocaine et internationale" },
  'radio-tanger-med': { h1: "Écouter Radio Tanger Med en direct & en ligne gratuitement", h2: "Radio Tanger Med à écouter en live : actualité du nord du Maroc" },
  'rap-lbeldi-maroc': { h1: "Écouter Rap Lbeldi Maroc en direct & en ligne gratuitement", h2: "Rap Lbeldi à écouter en live : rap marocain underground et authentique" },
  'skyrock-casablanca': { h1: "Écouter Skyrock Casablanca en direct & en ligne gratuitement", h2: "Skyrock Casablanca à écouter en live : rap, R&B et culture urbaine" },
  'tafseer-ibn-othaymeen': { h1: "Écouter Tafseer Ibn Othaymeen en direct & en ligne gratuitement", h2: "Tafseer Ibn Othaymeen à écouter en live : explications du Coran" },
  'yabiladi-azawan-amazigh': { h1: "Écouter Yabiladi Azawan Amazigh en direct & en ligne gratuitement", h2: "Yabiladi Azawan Amazigh à écouter en live : musique amazighe" },
  'yabiladi-chaabi-maroc': { h1: "Écouter Yabiladi Chaabi Maroc en direct & en ligne gratuitement", h2: "Yabiladi Chaabi Maroc à écouter en live : chaâbi marocain traditionnel" },
  'zine-bladi': { h1: "Écouter Zine Bladi en direct & en ligne gratuitement", h2: "Zine Bladi à écouter en live : musique populaire marocaine" },
};
