import { createContext, useContext } from 'react';

/**
 * Single source of shared state across pages (Home + StationPage).
 * Provider lives in App.jsx — it wraps the app with all the hook results so
 * audio playback / favorites / theme persist across route changes.
 */
const AppContext = createContext(null);

export function AppProvider({ value, children }) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>');
  return ctx;
}
