/**
 * Pills horizontales de filtrage par catégorie. Contrôlé :
 *   items: [{ key, label }]  ·  active  ·  onChange(key)
 */
export default function CategoryFilter({ items = [], active = 'all', onChange }) {
  return (
    <nav
      className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none"
      aria-label="Catégories d'actualité"
    >
      {items.map(({ key, label }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange?.(key)}
            aria-pressed={isActive}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              isActive
                ? 'bg-[#FF2A3C] text-white'
                : 'glass text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
