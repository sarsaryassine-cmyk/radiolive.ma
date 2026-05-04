import { useCallback, useEffect, useState } from 'react';

const KEY = 'radio-maroc:favorites';

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(favorites));
    } catch (_) {}
  }, [favorites]);

  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites]
  );

  const toggle = useCallback((radio) => {
    setFavorites((prev) =>
      prev.includes(radio.id)
        ? prev.filter((x) => x !== radio.id)
        : [...prev, radio.id]
    );
  }, []);

  return { favorites, isFavorite, toggle };
}
