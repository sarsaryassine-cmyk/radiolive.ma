import { Search } from 'lucide-react';

/** Header hero de /info : titre, sous-titre, recherche instantanée. */
export default function InfoHero({ lang = 'fr', query = '', onQuery }) {
  const isAr = lang === 'ar';
  return (
    <header className="pt-6 sm:pt-10 mb-8">
      <h1 className="font-display text-3xl sm:text-5xl font-bold text-balance">
        {isAr ? 'الأخبار' : 'Actualités'}{' '}
        <span className="gradient-text">{isAr ? 'مباشرة' : 'en direct'}</span>
      </h1>
      <p className="mt-4 max-w-2xl text-white/75 text-base sm:text-lg leading-relaxed">
        {isAr
          ? 'آخر المستجدات، الاتجاهات الموسيقية، الأخبار الرياضية وأحداث عالم الإذاعة في المغرب.'
          : "Retrouvez les dernières informations, tendances musicales, actualités sportives et événements radio du moment."}
      </p>

      <div className="mt-6 relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery?.(e.target.value)}
          placeholder={isAr ? 'ابحث في الأخبار…' : "Rechercher dans l'actualité…"}
          aria-label={isAr ? 'بحث' : 'Rechercher'}
          className="w-full rounded-full glass py-3 pl-12 pr-4 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#FF2A3C]/50"
        />
      </div>
    </header>
  );
}
