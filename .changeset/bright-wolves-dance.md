---
"stins": minor
---

## Build System Migration & Import Resolution

This release migrates the build system from `tsc` to `bunup` and fixes path alias resolution for better compatibility with bundlers and npm consumers.

### Build System Changes

- **Migrated from `tsc` to `bunup`**: The build now uses [bunup](https://www.npmjs.com/package/bunup), a Bun-native bundler that provides significantly faster builds with automatic `.d.ts` generation (~50x faster than tsup).

- **Added `isolatedDeclarations`**: Enabled TypeScript's `isolatedDeclarations` compiler option for faster and more reliable type generation.

- **Updated package exports**: All exports now properly specify both `types` and `import` conditions, pointing to the built `dist/src/*` structure. This ensures proper TypeScript type resolution for consumers.

- **Configured tsconfig for npm publishing**: Added `outDir`, `rootDir`, `declaration`, and `declarationMap` settings to support proper npm package publishing.

### Import Resolution Fixes

- **Replaced path aliases with relative imports**: Changed all internal `@/*` path alias imports to relative imports (e.g., `@/constants` → `./constants/index.js`). This improves compatibility with:
  - External bundlers (Webpack, Rollup, esbuild)
  - Direct npm package consumption
  - Environments that don't support tsconfig path aliases

### Commits

- `refactor: replace path aliases with relative imports`
- `chore: migrate build from tsc to bunup`
