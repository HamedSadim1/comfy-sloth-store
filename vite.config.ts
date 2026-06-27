import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// React Compiler integration for @vitejs/plugin-react v6+.
//
// The v5 config that relied on `react({ babel: { plugins: [...] } })`
// is gone in v6 — the plugin now exports a `reactCompilerPreset`
// helper that pairs with the standalone `@rolldown/plugin-babel`
// plugin. We mount the Compiler as a *preset* (not a raw plugin) so
// the helper's pre-configured filter is reused; `target: "19"` keeps
// it pointed at the React 19 runtime slot.
//
// Order is enforced by Babel itself: `presets` run before `plugins`,
// meaning `babel-plugin-react-compiler` (inside the preset) runs
// after `babel-plugin-styled-components` (in `plugins`) — exactly
// the "Compiler last" rule from the official docs.
//
// Compiler behaviour recap (safe-by-default):
// - Every function component is auto-memoized. Manual `React.memo`
//   / `useMemo` / `useCallback` stops being necessary in most cases.
// - Components that violate the React rules (mutations, non-
//   deterministic props, etc.) silently fall back to NOT being
//   memoized — the build never breaks because of the Compiler.
// - Per-file escape hatch: add `"use no memo"` at the top of a file
//   to opt that file out entirely.
export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [
        reactCompilerPreset({
          target: "19",
        }),
      ],
      plugins: [
        [
          "babel-plugin-styled-components",
          {
            displayName: true,
            fileName: false,
          },
        ],
      ],
    }),
  ],
  server: {
    proxy: {
      "/.netlify": {
        target: "http://localhost:4173",
        changeOrigin: true,
      },
    },
  },
});
