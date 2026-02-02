# stins

## 0.2.0

### Minor Changes

- [#4](https://github.com/johnie/stins/pull/4) [`e491d5c`](https://github.com/johnie/stins/commit/e491d5c7579d567b7454297bce715f70e7ce605c) Thanks [@johnie](https://github.com/johnie)! - ## Build System Migration & Import Resolution

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

## 0.1.0

### Minor Changes

- [#2](https://github.com/johnie/stins/pull/2) [`f68fe82`](https://github.com/johnie/stins/commit/f68fe820638822ed2ac296d8f6ad2be1641a4822) Thanks [@johnie](https://github.com/johnie)! - Add type-safe validation and middleware utilities for Standard Schema

  ## Features

  ### Validation

  - `validate(schema, data)` - Async schema validation
  - `validateSync(schema, data)` - Synchronous validation
  - `formatIssues(issues)` - Format validation errors for display

  ### HTTP Status Constants

  - `stins/http-status-codes` - Numeric constants (OK, CREATED, NOT_FOUND, etc.)
  - `stins/http-status-phrases` - String phrases for status codes
  - Also available via `HTTP_STATUS_CODES` and `HTTP_STATUS_PHRASES` objects

  ### Framework Middleware

  Ready-to-use adapters with consistent error handling:

  - **Hono** - `validationHookSync`, `onError`, `notFound`
  - **Express** - `validateBody`, `onError`, `notFound`
  - **H3** - `validateBody`, `onError`, `notFound`
  - **Elysia** - `validate`, `onError`, `notFound`
  - **TanStack Start** - `validateInput`

  ### OpenAPI Helpers

  - `jsonContent(schema, description)` - Response content definition
  - `jsonContentRequired(schema, description)` - Required response content
  - `oneOf(schemas)` - Union type helper

  ### Core Utilities

  - `validateRequest(schema, data)` - Framework-agnostic validation
  - `createErrorResponse(error)` - Standardized error responses
  - `createNotFoundResponse(path)` - Not found responses

## 0.0.2

### Patch Changes

- [`426fe7d`](https://github.com/johnie/stins/commit/426fe7d71de927c074a170232d4c1fc69ec7aeeb) Thanks [@johnie](https://github.com/johnie)! - Initial version of the package
