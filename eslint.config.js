import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // API payloads and mock data are progressively typed across the feature modules.
      '@typescript-eslint/no-explicit-any': 'off',
      // UI primitive modules intentionally export their variant helpers alongside components.
      'react-refresh/only-export-components': 'off',
      // These libraries return unstable functions by design; React Compiler safely skips them.
      'react-hooks/incompatible-library': 'off',
      'react-hooks/set-state-in-effect': 'off',
      // Error translation at service boundaries is intentional.
      'preserve-caught-error': 'off',
    },
  },
])
