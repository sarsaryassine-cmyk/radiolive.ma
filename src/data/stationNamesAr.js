/**
 * Noms de stations en arabe, indexés par slug (id).
 * Alimente `radio.name_ar` (via useCatalog.decorate) et l'affichage sur les
 * pages /ar (cartes, page station, menu, lecteur, JSON-LD).
 * Fallback sur le nom latin si une station n'y figure pas.
 */
export const STATION_NAMES_AR = {
  'radio-mars': 'راديو مارس',
  'hit-radio': 'هيت راديو',
  'medi-1-radio': 'ميدي 1 راديو',
  'mfm': 'إم إف إم',
  'aswat-fm': 'راديو أصوات',
  'med-radio': 'ميد راديو',
  'chada-fm': 'شدى إف إم',
  'u-radio': 'يو راديو',
  'atlantic-radio': 'أتلانتيك راديو',
  'radio-2m': 'راديو 2M',
  'cap-radio': 'كاب راديو',
  'radio-plus-agadir': 'راديو بلوس أكادير',
  'radio-plus': 'راديو بلوس',
  'marrakech-plus': 'مراكش بلوس',
  'qoran-radio': 'إذاعة القرآن الكريم',
  'adwaa-fm': 'أضواء إف إم',
  'medina-fm': 'مدينة إف إم',
  'radio-yabiladi': 'راديو يا بلادي',
  'abdul-basit': 'الشيخ عبد الباسط عبد الصمد',
  'achkid-fm': 'أشكيد إف إم',
  'al-quran-radio': 'راديو القرآن الكريم',
  'aziz-al-mustaphi': 'الشيخ عزيز المستغفي',
  'fayroz': 'فيروز',
  'hip-hop-soul-radio-radio-music': 'هيب هوب سول راديو',
  'maher-al-muaiqly': 'الشيخ ماهر المعيقلي',
  'medi-1-classique': 'ميدي 1 كلاسيك',
  'medi-1-dj': 'ميدي 1 دي جي',
  'medi-1-radio-andalouse': 'ميدي 1 الأندلسية',
  'medi-1-tarab': 'ميدي 1 طرب',
  'mohammed-ayyub': 'الشيخ محمد أيوب',
  'mukhtasar-tafseer': 'مختصر التفسير',
  'ness-radio': 'نَس راديو',
  'only-rai': 'أونلي راي',
  'quran-karim-radio': 'إذاعة القرآن الكريم',
  'radio-adwaa-atfal-4': 'راديو أضواء أطفال 4',
  'radio-adwaa-mazika-5': 'راديو أضواء مزيكا 5',
  'radio-adwaa-music-3': 'راديو أضواء ميوزيك 3',
  'radio-atbir': 'راديو أتبير',
  'radio-azawan': 'راديو أزوان',
  'radio-manarat': 'راديو منارات',
  'radio-monte-carlo-doualiya': 'مونت كارلو الدولية',
  'rap-lbeldi-maroc': 'راب لبلدي المغرب',
  'skyrock-casablanca': 'سكايروك كازابلانكا',
  'tafseer-ibn-othaymeen': 'تفسير ابن عثيمين',
  'yabiladi-azawan-amazigh': 'يا بلادي أزوان أمازيغ',
  'yabiladi-chaabi-maroc': 'يا بلادي شعبي المغرب',
  'zine-bladi': 'زين بلادي',
  'radio-tanger-med': 'راديو طنجة المتوسط',
  'radio-star-maroc-fm': 'راديو ستار المغرب',
  'radio-sawt-alamal': 'راديو صوت الأمل',
};

/** Nom à afficher selon la langue (AR si dispo, sinon nom latin). */
export const stationDisplayName = (radio, lang) =>
  (lang === 'ar' && radio?.name_ar) ? radio.name_ar : (radio?.name || '');
