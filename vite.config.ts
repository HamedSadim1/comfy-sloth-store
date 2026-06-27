import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// React Compiler config. The Compiler is opt-in per file by default
// (every component starts memoized — no manual `React.memo` calls
// needed), but is safe-by-default: if a component violates the React
// rules (mutations, non-deterministic props, etc.) the Compiler will
// silently fall back to NOT memoizing that component rather than
// breaking the build. Per-component opt-outs use the "use no memo"
// directive at the top of the file.
//
// `target: "19"` declares the React major version so the Compiler
// emits the matching runtime helpers (React 19 exposes the
// `react-compiler-runtime` slot natively, so we don't have to
// install a separate runtime package).
const ReactCompilerConfig = {
  target: "19",
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // First: styled-components transforms (displayName for
          // nicer DevTools labels, no fileName for cleaner output).
          [
            "babel-plugin-styled-components",
            {
              displayName: true,
              fileName: false,
            },
          ],
          // Last: React Compiler. Per the official docs,
          // babel-plugin-react-compiler must run AFTER any plugin
          // that synthesises JSX or refactors component bodies,
          // so it sees the final component shape. Placing it last
          // also keeps errors here (component rule violations)
          // maximally legible — styled-components transforms
          // fire first and the Compiler's report runs on the
          // already-styled AST.
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
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
