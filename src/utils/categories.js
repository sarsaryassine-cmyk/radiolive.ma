/**
 * Category resolution for the Moroccan radio catalog.
 *
 * Strategy:
 *   1. Explicit lookup by normalized name (covers all 35 known stations).
 *   2. Keyword-based fallback for any future radio not in the table.
 *
 * Returned key matches one of CATEGORY_ORDER below — used by SideMenu and
 * StationPage. Update CATEGORY_LABELS if you want different display names.
 */

export const CATEGORY_ORDER = [
  'musicale',
  'sport',
  'nationale',
  'regionale',
  'internationale',
  'religieuse',
  'culturelle',
  'business',
  'autre',
];

export const CATEGORY_LABELS = {
  musicale:       'Musicales',
  sport:          'Sport',
  nationale:      'Nationales',
  regionale:      'Régionales',
  internationale: 'Internationales',
  religieuse:     'Religieuses',
  culturelle:     'Culturelles',
  business:       'Économie & Business',
  autre:          'Autres',
};

/** Localized category labels — keep aligned with CATEGORY_ORDER. */
export const CATEGORY_LABELS_I18N = {
  fr: CATEGORY_LABELS,
  ar: {
    musicale:       'موسيقية',
    sport:          'رياضية',
    nationale:      'وطنية',
    regionale:      'جهوية',
    internationale: 'دولية',
    religieuse:     'دينية',
    culturelle:     'ثقافية',
    business:       'اقتصاد وأعمال',
    autre:          'أخرى',
  },
};

/** Returns the localized label for a category key. Defaults to French. */
export function categoryLabel(cat, lang = 'fr') {
  return CATEGORY_LABELS_I18N[lang]?.[cat] || CATEGORY_LABELS[cat] || cat;
}

const norm = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '');

const EXPLICIT = {
  hitradio:                 'musicale',
  radiomars:                'sport',
  radioaswat:               'musicale',
  medi1radio:               'internationale',
  medradio:                 'musicale',
  mfm:                      'musicale',
  medinafm:                 'musicale',
  chadafm:                  'musicale',
  capradio:                 'business',
  qoranradio:               'religieuse',
  zinebladi:                'musicale',
  skyrockcasablanca:        'musicale',
  atlanticradio:            'business',
  radioyabiladi:            'internationale',
  radio2m:                  'nationale',
  radiomontecarlodoualiya:  'internationale',
  radioplusagadir:          'regionale',
  medi1tarab:               'musicale',
  yabiladichaabimaroc:      'musicale',
  yabiladiazawanamazigh:    'culturelle',
  adwaafm:                  'musicale',
  medi1classique:           'musicale',
  fayroz:                   'musicale',
  raplbeldimaroc:           'musicale',
  marrakechplus:            'regionale',
  medi1radioandalouse:      'musicale',
  radiomanarat:             'religieuse',
  medi1dj:                  'musicale',
  radioatbir:               'regionale',
  radioachkidfm:            'regionale',
  onlyrai:                  'musicale',
  alquranradio:             'religieuse',
  nessradio:                'musicale',
  azizalmustaphi:           'religieuse',
  abdulbasit:               'religieuse',
  radioazawan:              'culturelle',
  radiotangermed:           'regionale',
  radiostarmarocfm:         'musicale',
  radiosawtalamal:          'culturelle',
  uradio:                   'musicale',
};

/**
 * Resolve a category key for any given radio name.
 * Falls back to keyword inference, then `'autre'`.
 */
export function resolveCategory(name) {
  const k = norm(name);
  if (EXPLICIT[k]) return EXPLICIT[k];

  const n = (name || '').toLowerCase();
  if (/coran|qoran|qur'?an|islam|reciter|recitation|abdul|sheikh|cheikh|imam/.test(n)) return 'religieuse';
  if (/sport|foot|mars/.test(n)) return 'sport';
  if (/(amazigh|tachelhit|kabyle|berber|chaabi|andalou|tarab)/.test(n)) return 'culturelle';
  if (/(rai|rap|hip.?hop|dj|electro|pop|hits?|musique|music|fm|rock|jazz)/.test(n)) return 'musicale';
  if (/(business|economie|cap)/.test(n)) return 'business';
  if (/(international|monde|world|france|paris|monte.?carlo)/.test(n)) return 'internationale';
  if (/(agadir|marrakech|tanger|fes|fes|rabat|casa|tetouan|oujda|nador|laayoune)/.test(n)) return 'regionale';
  if (/(national|2m|snrt|wataniya|wataniyah)/.test(n)) return 'nationale';
  return 'autre';
}
