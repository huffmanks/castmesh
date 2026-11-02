import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
  },
});

// pnpx repomix --include "AGENTS.md,pnpm-workspace.yaml,package.json,**/package.json,vite.config.ts,**/vite.config.ts,tsconfig.json,**/tsconfig.json,packages/core/src/index.ts"
// pnpx repomix --include "packages/core/src/index.ts,apps/desktop/src/App.tsx,apps/mobile-tv/App.tsx,apps/tizen-tv/src/main.ts"
