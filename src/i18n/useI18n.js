import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { STRINGS, makeT } from './strings.js';

const STORAGE_KEY = 'preferred_locale';
const SUPPORTED = ['fr', 'ar'];

/**
 * Reads the user's preferred locale from:
 *   1. localStorage (`preferred_locale`)        — explicit user choice
 *   2. navigator.language / navigator.languages — first-visit auto-detect
 *
 * Returns 'fr' or 'ar'. Falls back to 'fr' (the default).
 */
function detectPreferredLocale() {
  if (typeof window === 'undefined') return 'fr';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
  } catch (_) { /* localStorage may be unavailable */ }

  const candidates = [
    ...(navigator.languages || []),
    navigator.language,
  ].filter(Boolean);

  for (const c of candidates) {
    const tag = String(c).toLowerCase();
    if (tag.startsWith('ar')) return 'ar';
    if (tag.startsWith('fr')) return 'fr';
  }
  return 'fr';
}

/**
 * Detects the active locale from the URL prefix:
 *   /ar/*   → Arabic (RTL)
 *   /*      → French (LTR, default)
 *
 * On first visit (no localStorage preference), if the browser language is
 * Arabic and the user landed on a non-/ar URL, redirect them once. Any
 * subsequent manual switch updates localStorage and becomes authoritative.
 *
 * Side-effects:
 *   - Keeps <html lang> and <html dir> in sync.
 *   - Persists the chosen locale in localStorage on switchLang().
 */
export default function useI18n() {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  const lang = pathname.startsWith('/ar') ? 'ar' : 'fr';
  const strings = STRINGS[lang];
  const t = useMemo(() => makeT(strings), [strings]);

  // First-visit auto-redirect: only if no stored preference, browser is
  // Arabic, and we're on a French URL. Runs once on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let stored = null;
    try { stored = window.localStorage.getItem(STORAGE_KEY); } catch (_) {}
    if (stored) return; // user already chose, respect it

    const detected = detectPreferredLocale();
    if (detected === 'ar' && lang === 'fr') {
      const target = pathname === '/' ? '/ar' : `/ar${pathname}`;
      navigate(`${target}${search}${hash}`, { replace: true });
    }
    // Don't redirect ar→fr: '/ar' visitors clearly opted into Arabic.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync <html lang> and <html dir> reactively.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', strings.htmlLang);
    root.setAttribute('dir', strings.dir);
  }, [strings.htmlLang, strings.dir]);

  const switchLang = useCallback(() => {
    const next = lang === 'fr' ? 'ar' : 'fr';
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch (_) {}

    const target =
      next === 'ar'
        ? pathname === '/' ? '/ar' : `/ar${pathname}`
        : pathname.replace(/^\/ar/, '') || '/';
    navigate(`${target}${search}${hash}`);
  }, [lang, pathname, search, hash, navigate]);

  return { lang, t, strings, switchLang };
}
