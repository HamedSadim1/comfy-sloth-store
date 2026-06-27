import js from "@eslint/js";
import tseslintParser from "@typescript-eslint/parser";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...tseslintPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // TypeScript handles type checking, so disable ESLint's no-undef
      "no-undef": "off",
      // Skip the new strict react-hooks v7 rules that weren't enforced previously
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      // Allow unused catch params and underscore-prefixed variables (e.g. `catch (_error) {}`)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-unused-vars": "off",
      // Styling/Fast-Refresh warnings – pre-existing tolerance, not functional issues
      "react-refresh/only-export-components": "off",
      // Codebase already uses `any` legitimately in a few places, treat as a hint
      "@typescript-eslint/no-explicit-any": "off",
      // Enforce `import type` discipline so the bundler can safely drop
      // type-only imports on a `npm run lint --fix` run.
      // `prefer: "type-imports"` makes the autofix split a mixed
      // value+type import (e.g. `import React, { useCallback } from "react"`)
      // into a value import + a separate `import type { ... }` line - which
      // works cleanly with our `isolatedModules: true` tsconfig flag.
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
    },
  },
];
