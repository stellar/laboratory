# Claude Code Instructions for Stellar Laboratory

## Quick Reference

```bash
# Development
pnpm dev                    # Start dev server (auto-fetches network limits)
pnpm build                  # Production build
pnpm lint                   # ESLint
pnpm lint:ts                # TypeScript check
pnpm test                   # Run all tests
pnpm test:unit              # Jest unit tests
pnpm test:e2e               # Playwright e2e tests

# Common Workflows
pnpm fetch-limits           # Manually fetch Stellar network limits
git push --no-verify        # Skip pre-push hooks (network issues)
```

## Repository Overview

Stellar Lab is an interactive toolkit for exploring the Stellar blockchain
network. It helps developers experiment with building, signing, simulating, and
submitting transactions, as well as making requests to both RPC and Horizon
APIs. The `main` branch is deployed to https://lab.stellar.org/.

## Tech Stack

> See `package.json` for exact dependency versions.

- **Framework**: Next.js 15 (React 19) with App Router
- **Language**: TypeScript 5
- **UI Framework**: Stellar Design System, Sass
- **State Management**: Zustand (with querystring persistence via
  zustand-querystring)
- **API Data Fetching**: TanStack React Query v5
- **Stellar SDK**: @stellar/stellar-sdk v14
- **Hardware Wallets**: Ledger (@ledgerhq/hw-app-str), Trezor
  (@trezor/connect-web)
- **Testing**: Jest (unit tests), Playwright (e2e tests)
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Package Manager**: pnpm 10
- **Deployment**: Docker, Next.js standalone output, Sentry error tracking

## Architecture Constraints

- **All pages are client components**: Every `page.tsx` under `(sidebar)/` has
  `"use client"`. The root layout (`app/layout.tsx`) is the only server
  component — it wraps the app in `StoreProvider`, `QueryProvider`,
  `WalletKitContextProvider`, and `LayoutContextProvider`.
- **Zustand state syncs to the URL querystring** via `zustand-querystring`.
  Avoid using `useState` or `useSearchParams` for values that should persist
  across navigation — use the Zustand store instead. The store is initialized
  once from the URL in `StoreProvider`.
- **CSP middleware**: `src/middleware.ts` generates a nonce-based Content
  Security Policy on every request. When adding new external script/font/image
  sources, update the CSP directives there.
- **No Horizon for new features**: Always use RPC endpoints
  (`src/query/useRpc*`, `src/query/useGetRpc*`). Horizon hooks exist for legacy
  features only.

## Prerequisites

> See `package.json` for exact dependency versions.

- **Node.js**: >= 22.22.0 (specified in `.nvmrc` and `package.json`)
- **pnpm**: >= 10.15.1 (managed via Corepack)

## Development Setup

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

The `pnpm dev` command automatically runs `pnpm fetch-limits` (via `predev`
script) to fetch Stellar network limits from RPC endpoints before starting the
dev server.

## Common Issues and Solutions

### Network Limits Fetch Failure

`pnpm fetch-limits` or `pnpm dev` fails with "fetch failed" — network
restrictions blocking Stellar RPC endpoints. The repo includes a committed
`src/constants/networkLimits.ts` with recent values; if it exists, skip
fetching. If pre-push hooks fail due to network: `git push --no-verify`.

### Next.js Lint Deprecation Warning

`pnpm lint` shows deprecation warning for `next lint` in Next.js 16. Warning
only, not blocking. May need ESLint CLI migration when upgrading to Next.js 16.

### Husky Hooks Failing

Skip pre-push hooks: `git push --no-verify` or `HUSKY=0 git push`. Fix tests
before pushing (preferred).

### Issue 6: E2E Tests Fail After Switching Branches

**Problem**: Playwright e2e tests fail on one branch but pass on another, even
though the code is correct.

**Root Cause**: Playwright reuses a running dev server on the configured
`PORT` (default 3000). If you switch branches without restarting the dev
server, tests run against the old branch's code.

**Solution**:

1. Kill any stale dev server on the configured port: `PORT="${PORT:-3000}"; lsof -i :"$PORT"` and kill the process
2. Clear the Next.js cache: `rm -rf .next`
3. Restart the dev server: `pnpm dev`
4. Then run tests: `pnpm test:e2e`

## Key Directories

```
src/
├── app/               # Next.js App Router pages
│   ├── (sidebar)/     # Route group: account, endpoints, smart-contracts,
│   │                  #   transaction, xdr, network-limits, etc.
│   └── layout.tsx     # Root layout with providers
├── components/        # Reusable React components
├── constants/         # Configuration and static data
├── helpers/           # Utility functions (including xdr/, explorer/)
├── hooks/             # Custom React hooks
├── metrics/           # GA and Amplitude analytics tracking
├── query/             # React Query hooks (useRpc*, useGetRpc*)
├── store/             # Zustand state stores
├── types/             # TypeScript type definitions
├── validate/          # Validation logic (get*Error() convention)
└── middleware.ts      # CSP middleware
tests/
├── e2e/               # Playwright e2e tests
└── unit/              # Jest unit tests
```

## Code Patterns and Conventions

### Import Paths

Use `@/` path alias for imports from `src/`:

```typescript
import { helper } from "@/helpers/utils";
import { useStore } from "@/store/createStore";
```

### Naming Conventions

- **Components**: PascalCase (e.g., `TransactionBuilder.tsx`)
- **Utilities/Helpers**: camelCase (e.g., `decodeXdr.ts`)
- **Hooks**: `use` prefix (e.g., `useSimulateTx.ts`)
- **Types**: PascalCase (e.g., `NetworkLimits`)
- **Constants**: SCREAMING_SNAKE_CASE for true constants, camelCase for config
- **HTML Data Attributes**: dashes (e.g., `data-is-active`)
- **CSS Class Names**: BEM-ish PascalCase block with dashes for elements (e.g.,
  `ComponentName__element`)
- **File/Folder Names**: dashes over underscores (e.g., `smart-contracts/`)

### Form Validation

- Validation functions in `src/validate/methods/`
- Convention: `get*Error()` returns error message or `undefined`

### Stellar-Specific Rules

- Never edit `src/constants/networkLimits.ts` manually (auto-generated)
- Store XDR as base64 strings; parse lazily at point of use

## Build and Deployment

```bash
pnpm build  # Output: build/ directory (standalone format)
```

### Environment Variables

- `NEXT_PUBLIC_STELLAR_LAB_BACKEND_URL` - Backend API URL
- `NEXT_PUBLIC_DISABLE_GOOGLE_ANALYTICS=true` - Disable GA (optional)
- `NEXT_PUBLIC_COMMIT_HASH` - Auto-set from git
- `NEXT_PUBLIC_ENABLE_EXPLORER=true` - Enable explorer features (dev mode)

## Code Quality

Husky runs lint + tests on push; use `--no-verify` to skip.

- **ESLint**: `.eslintrc.json` — extends `eslint:recommended`,
  `@typescript-eslint/recommended`, `next/core-web-vitals`, `prettier`
- **Prettier**: `.prettierrc.json` — 80 chars, 2 spaces, semicolons, double
  quotes, trailing commas
- **Known exception**: `@typescript-eslint/no-explicit-any` disabled

## Skills

Detailed patterns are in on-demand skills (`.claude/skills/`). Use these for
deep context when working in specific areas:

- `/zustand-store-patterns` — store selection, hydration, cross-store reads
- `/figma-to-code` — translating Figma MCP output to project conventions
- `/component-guide` — UI component catalog (SDS + local) and SCSS conventions
- `/commit-progress` — commit logical units of work

## Task Completion Checklist

- [ ] All requested functionality is implemented
- [ ] Code follows existing patterns and conventions
- [ ] TypeScript types are properly defined (no `any` unless necessary)
- [ ] JSDoc comments added for new functions
- [ ] Unit tests written/updated for new logic
- [ ] No TypeScript errors (`pnpm lint:ts`)
- [ ] No ESLint errors (`pnpm lint`)
- [ ] Tests pass (`pnpm test:unit` at minimum)
- [ ] Changes work with existing features
