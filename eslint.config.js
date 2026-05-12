import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

/**
 * ESLint config — minimal mais ciblée sur les bugs critiques.
 *
 * Objectif : attraper les Rules of Hooks violations (React error #310)
 * AVANT qu'elles n'atteignent la prod. Le bug "hooks order changes between
 * renders" a déjà bloqué une page station en mai 2026 — plus jamais.
 *
 * On NE met PAS de règles cosmétiques (indent, quotes, semicolons) pour
 * éviter le bruit. On garde uniquement ce qui prévient des crashs runtime.
 */
export default [
  js.configs.recommended,

  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      // ── Rules of Hooks — CRITIQUES (prévention React error #310) ──
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ── React de base ──
      'react/jsx-key': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-unescaped-entities': 'off', // on a beaucoup de texte FR/AR

      // ── JS de base (juste les vrais bugs) ──
      'no-undef': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off', // on log volontairement
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unreachable': 'error',
      'no-dupe-keys': 'error',
      'no-prototype-builtins': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  {
    // Scripts node (build, sitemap, etc.) — globals différents
    files: ['scripts/**/*.{js,mjs}', '*.config.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  {
    // Worker Cloudflare — Web Workers + Cloudflare types
    files: ['workers/**/*.js', 'functions/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.worker, ...globals.serviceworker },
    },
  },

  {
    ignores: ['dist/**', 'node_modules/**', '.wrangler/**', 'public/**'],
  },
];
