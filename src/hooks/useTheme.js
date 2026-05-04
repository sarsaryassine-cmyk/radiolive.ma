import { useCallback, useEffect, useState } from 'react';

const KEY = 'radio-maroc:theme';

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(KEY) || 'dark';
    } catch (_) {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'light') {
      root.classList.remove('dark');
      body.classList.add('light');
    } else {
      root.classList.add('dark');
      body.classList.remove('light');
    }
    try { localStorage.setItem(KEY, theme); } catch (_) {}
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    []
  );

  return { theme, toggle };
}
