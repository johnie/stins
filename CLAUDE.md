# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**stins** is a TypeScript library using `@standard-schema/spec`. It uses Bun as the runtime and package manager.

## Commands

```bash
bun install              # Install dependencies
bun run src/index.ts     # Run the main entry point
bun test                 # Run tests
bun run check            # Check for lint/format issues
bun run fix              # Auto-fix lint/format issues
```

## Releasing

Uses Changesets for versioning and publishing to npm:
- `bunx changeset` to create a changeset for your changes
- CI handles versioning and publishing on merge to main

## Runtime & Tooling

**Always use Bun, not Node.js:**
- `bun <file>` instead of `node`/`ts-node`
- `bun test` instead of jest/vitest
- `bun install` instead of npm/yarn/pnpm
- `bunx <pkg>` instead of npx
- Bun auto-loads `.env` files

**Bun APIs to prefer:**
- `Bun.serve()` for HTTP/WebSocket servers (not express)
- `Bun.file()` for file I/O (not node:fs)
- `bun:sqlite` for SQLite
- `Bun.$\`cmd\`` for shell commands (not execa)

## Code Quality

Uses **Ultracite** (Biome-based) for linting/formatting. Pre-commit hook auto-fixes staged files.

Run `bun run fix` before committing if hooks don't auto-fix.

## TypeScript Config

Strict mode enabled with:
- `noUncheckedIndexedAccess: true` - indexed access returns `T | undefined`
- `verbatimModuleSyntax: true` - use `import type` for type-only imports
- `noEmit: true` - bundler mode, no JS output
