/**
 * Two-language i18n dictionary (fr / ar).
 *
 * Structure: namespaced — `t.<namespace>.<key>`
 * Used by useI18n() to render all UI controls in either French or Arabic.
 * Long-form prose (station descriptions, blog posts, page bodies) stays in
 * its source files for now and will be translated by a professional native
 * Arabic speaker in a later pass — see CHANGELOG.
 */

export const STRINGS = {
  fr: {
    locale: 'fr-MA',
    htmlLang: 'fr',
    dir: 'ltr',
    site_name: 'Radio Maroc',
    switch_lang: '🇲🇦 العربية',

    meta: {
      home_title: "Radio Maroc en direct & en ligne — Hit Radio, Mars, MFM, Medi 1",
      home_description: "Radio Maroc en direct et en ligne. Écoutez Hit Radio Maroc, Radio Mars Maroc, MFM Radio Maroc, Medi 1, Chada FM et 49 radios marocaines en streaming HD gratuit, sans inscription, depuis le Maroc ou l'étranger.",
      og_locale: 'fr_MA',
    },

    nav: {
      home: 'Accueil',
      blog: 'Blog',
      top: 'Top 10',
      frequencies: 'Fréquences FM',
      back: 'Retour',
      menu: 'Menu',
      stations: 'Stations',
      categories: 'Catégories',
      favorites: 'Favoris',
      all_stations: 'Toutes',
    },

    header: {
      brand_streaming: 'Streaming premium · 100% en direct',
      open_menu: 'Ouvrir le menu',
      toggle_theme: 'Basculer le thème',
      open_search: 'Ouvrir la recherche',
    },

    sidemenu: {
      open: 'Ouvrir le menu',
      close: 'Fermer le menu',
      drawer_label: 'Menu de navigation',
      footer_count: '{n} stations · auto-sync 24 h',
    },

    search: {
      placeholder: 'Rechercher une radio…',
      label: 'Rechercher une radio',
      clear: 'Effacer la recherche',
      stations_count: '{n} stations',
    },

    hero: {
      h1: 'Radio Maroc en direct, à portée d\'écoute.',
      h1_part1: 'Radio Maroc en direct,',
      h1_part2: 'à portée d\'écoute.',
      stations_in_live: 'stations en direct',
      preparing: 'Préparation…',
      refresh: 'Rafraîchir',
      syncing: 'Sync…',
    },

    card: {
      live_hd: 'Live · HD',
      live_stream: 'Live · Stream',
      listen: 'Écouter',
      now_playing: 'En cours',
      add_favorite: 'Ajouter aux favoris',
      remove_favorite: 'Retirer des favoris',
      view_station: 'Voir la page de {name}',
    },

    player: {
      play: 'Lecture',
      pause: 'Pause',
      previous: 'Précédent',
      next: 'Suivant',
      mute: 'Couper le son',
      unmute: 'Activer le son',
      volume: 'Volume',
      close: 'Fermer le lecteur',
      favorite: 'Favori',
      connecting: 'Connexion…',
      live_label: 'En direct',
      paused: 'En pause',
      stream_unavailable: 'Flux indisponible',
      stream_failed: 'Lecture impossible',
      hls_unsupported: 'HLS non supporté sur ce navigateur',
    },

    station: {
      back_to_home: 'Retour à l\'accueil',
      back_to_station: 'Retour à {name}',
      not_found_title: 'Station introuvable',
      not_found_body: 'La radio « {slug} » n\'existe pas dans le catalogue actuel.',
      listen_live: 'Écouter en direct',
      pause_live: 'Mettre en pause',
      share: 'Partager',
      about: 'À propos de {name}',
      no_description: 'Aucune description détaillée n\'est disponible pour cette station pour le moment. Vous pouvez l\'écouter en direct ci-dessus.',
      info_heading: 'Informations',
      info_category: 'Catégorie',
      info_stream_type: 'Type de flux',
      info_codec: 'Codec',
      info_bitrate: 'Bitrate',
      info_source: 'Source',
      source_manual: 'Sélection manuelle',
      source_api: 'Radio-Browser',
      top_songs: 'Top chansons',
      see_all: 'Voir tout',
      empty_top: 'Le classement n\'est pas encore disponible pour cette station — il sera calculé dès que l\'historique de diffusion aura été collecté.',
      related_heading: 'Autres radios {category}',
      quick_now_playing: '🎵 Chanson actuelle',
      quick_history: '📜 Historique du jour',
      quick_top_songs: '🔥 Top chansons',
    },

    favorites: {
      empty_title: 'Aucun favori pour le moment',
      empty_body: 'Ajoutez une radio à vos favoris en cliquant sur le cœur.',
      browse_button: 'Découvrir les stations',
    },

    empty: {
      no_radios_title: 'Aucune radio trouvée',
      no_radios_body: 'Aucun résultat pour',
      no_radios_try: 'Essayez avec d\'autres mots-clés.',
    },

    error: {
      load_title: 'Chargement impossible',
      load_check: 'Vérifiez que public/radios.json est accessible.',
      retry: 'Réessayer',
    },

    toast: {
      catalog_updated: 'Catalogue mis à jour',
      added_updated: '+{added} ajoutée(s) · {updated} mise(s) à jour',
      sync_failed: 'Synchronisation impossible',
      sync_fallback: 'Le catalogue local reste utilisé.',
    },

    ad: {
      label: 'Publicité',
      placeholder: 'Espace publicitaire',
    },

    footer: {
      copyright: 'Radio Maroc · Catalogue auto-maintenu via Radio-Browser · {year}',
    },

    common: {
      live: 'En direct',
      offline: 'Hors ligne',
      reconnecting: 'Reconnexion…',
      loading: 'Chargement…',
      see_more: 'Voir plus',
      see_all: 'Voir tout',
      free: 'Gratuit',
      streaming_hd: 'Streaming HD',
      no_signup: 'Sans inscription',
    },
  },

  ar: {
    locale: 'ar-MA',
    htmlLang: 'ar',
    dir: 'rtl',
    site_name: 'إذاعات المغرب',
    switch_lang: '🇫🇷 Français',

    meta: {
      home_title: 'إذاعات مغربية مباشر | استمع لجميع راديوهات المغرب أون لاين مجاناً',
      home_description: 'استمع إلى جميع الإذاعات المغربية مباشرة وبجودة عالية: هيت راديو، ميدي1، شدى إف إم، ميد راديو، أصوات، راديو مارس وأكثر من 30 محطة. مجاناً من المغرب أو من الخارج.',
      og_locale: 'ar_MA',
    },

    nav: {
      home: 'الرئيسية',
      blog: 'المدونة',
      top: 'أفضل 10',
      frequencies: 'ترددات FM',
      back: 'رجوع',
      menu: 'القائمة',
      stations: 'الإذاعات',
      categories: 'الفئات',
      favorites: 'المفضلة',
      all_stations: 'الكل',
    },

    header: {
      brand_streaming: 'بث مباشر بجودة عالية · ٢٤/٢٤',
      open_menu: 'فتح القائمة',
      toggle_theme: 'تبديل النمط',
      open_search: 'فتح البحث',
    },

    sidemenu: {
      open: 'فتح القائمة',
      close: 'إغلاق القائمة',
      drawer_label: 'قائمة التنقل',
      footer_count: '{n} محطة · مزامنة تلقائية كل ٢٤ ساعة',
    },

    search: {
      placeholder: 'ابحث عن إذاعة…',
      label: 'ابحث عن إذاعة',
      clear: 'مسح البحث',
      stations_count: '{n} محطة',
    },

    hero: {
      h1: 'استمع إلى المغرب مباشرة',
      h1_part1: 'استمع إلى المغرب مباشرة،',
      h1_part2: 'في كل لحظة',
      stations_in_live: 'محطة مباشرة',
      preparing: 'جاري التحضير…',
      refresh: 'تحديث',
      syncing: 'جاري المزامنة…',
    },

    card: {
      live_hd: 'مباشر · HD',
      live_stream: 'مباشر · بث',
      listen: 'استمع',
      now_playing: 'قيد التشغيل',
      add_favorite: 'أضف إلى المفضلة',
      remove_favorite: 'إزالة من المفضلة',
      view_station: 'عرض صفحة {name}',
    },

    player: {
      play: 'تشغيل',
      pause: 'إيقاف مؤقت',
      previous: 'السابق',
      next: 'التالي',
      mute: 'كتم الصوت',
      unmute: 'تشغيل الصوت',
      volume: 'الصوت',
      close: 'إغلاق المشغل',
      favorite: 'المفضلة',
      connecting: 'جاري الاتصال…',
      live_label: 'مباشر',
      paused: 'متوقف مؤقتاً',
      stream_unavailable: 'البث غير متاح',
      stream_failed: 'تعذر التشغيل',
      hls_unsupported: 'تنسيق HLS غير مدعوم في هذا المتصفح',
    },

    station: {
      back_to_home: 'العودة إلى الرئيسية',
      back_to_station: 'العودة إلى {name}',
      not_found_title: 'الإذاعة غير موجودة',
      not_found_body: 'الإذاعة « {slug} » غير موجودة في الكتالوج الحالي.',
      listen_live: 'استمع مباشرة',
      pause_live: 'إيقاف مؤقت',
      share: 'مشاركة',
      about: 'حول {name}',
      no_description: 'لا يوجد وصف تفصيلي لهذه المحطة في الوقت الحالي. يمكنك الاستماع إليها مباشرة أعلاه.',
      info_heading: 'المعلومات',
      info_category: 'الفئة',
      info_stream_type: 'نوع البث',
      info_codec: 'التشفير',
      info_bitrate: 'معدل البت',
      info_source: 'المصدر',
      source_manual: 'اختيار يدوي',
      source_api: 'Radio-Browser',
      top_songs: 'أفضل الأغاني',
      see_all: 'عرض الكل',
      empty_top: 'الترتيب غير متاح بعد لهذه المحطة — سيتم حسابه بمجرد تجميع سجل البث.',
      related_heading: 'إذاعات أخرى من فئة {category}',
      quick_now_playing: '🎵 الأغنية الحالية',
      quick_history: '📜 سجل اليوم',
      quick_top_songs: '🔥 أفضل الأغاني',
    },

    favorites: {
      empty_title: 'لا توجد مفضلات حالياً',
      empty_body: 'أضف إذاعة إلى المفضلة بالضغط على القلب.',
      browse_button: 'استكشف الإذاعات',
    },

    empty: {
      no_radios_title: 'لم يتم العثور على أي إذاعة',
      no_radios_body: 'لا نتائج لـ',
      no_radios_try: 'حاول بكلمات مفتاحية أخرى.',
    },

    error: {
      load_title: 'تعذر التحميل',
      load_check: 'تأكد من أن public/radios.json متاح.',
      retry: 'إعادة المحاولة',
    },

    toast: {
      catalog_updated: 'تم تحديث الكتالوج',
      added_updated: '+{added} مضافة · {updated} محدثة',
      sync_failed: 'تعذرت المزامنة',
      sync_fallback: 'سيتم استخدام الكتالوج المحلي.',
    },

    ad: {
      label: 'إعلان',
      placeholder: 'مساحة إعلانية',
    },

    footer: {
      copyright: 'إذاعات المغرب · كتالوج محدّث تلقائياً عبر Radio-Browser · {year}',
    },

    common: {
      live: 'مباشر',
      offline: 'غير متصل',
      reconnecting: 'جاري إعادة الاتصال…',
      loading: 'جاري التحميل…',
      see_more: 'عرض المزيد',
      see_all: 'عرض الكل',
      free: 'مجاني',
      streaming_hd: 'بث عالي الجودة',
      no_signup: 'بدون تسجيل',
    },
  },
};

/**
 * Returns t(key, params) given a strings tree.
 * Supports nested namespaces ('player.play') and {placeholder} substitution.
 *
 *   t('hero.stations_in_live')                      → "stations en direct"
 *   t('search.stations_count', { n: 35 })           → "35 stations"
 *   t('toast.added_updated', { added: 2, updated: 5 })
 */
export function makeT(strings) {
  return function t(key, params) {
    const path = String(key).split('.');
    let val = strings;
    for (const p of path) {
      if (val == null) break;
      val = val[p];
    }
    if (typeof val !== 'string') return key; // missing key — return path as-is
    if (!params) return val;
    return val.replace(/\{(\w+)\}/g, (_, k) => (k in params ? params[k] : `{${k}}`));
  };
}
