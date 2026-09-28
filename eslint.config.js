import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

/* react-hooks plugin-এর flat-config shape version-ভেদে আলাদা — দুটোই handle করা */
const reactHooksRules =
  (reactHooks.configs["recommended-latest"] || reactHooks.configs.recommended)
    ?.rules ?? {};

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      ".kilo/**",
      "supabase/functions/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    /* service worker (public/sw.js) — browser + serviceworker globals */
    files: ["public/**/*.js"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.serviceworker },
    },
  },
  {
    /* node scripts (fonts download ইত্যাদি) */
    files: ["scripts/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooksRules,
      // TypeScript নিজেই undefined identifier ধরে — no-undef TS ফাইলে false positive দেয়
      "no-undef": "off",
      /* react-hooks v7-এর React-Compiler-grade rules — এই (legacy) codebase-এ refactor-level
         follow-up, তাই warn: lint আটকাবে না কিন্তু রিপোর্টে থাকবে */
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
);
