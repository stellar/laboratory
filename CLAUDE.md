# Claude Code Instructions for Stellar Laboratory

@AGENTS.md

## Repository Overview

Stellar Lab is an interactive toolkit for exploring the Stellar blockchain
network. It helps developers experiment with building, signing, simulating, and
submitting transactions, as well as making requests to both RPC and Horizon
APIs. The `main` branch is deployed to https://lab.stellar.org/.

## Architecture Constraints

- **All pages are client components**: Every `page.tsx` under `(sidebar)/` has
  `"use client"`. The root layout (`app/layout.tsx`) is the only server
  component — it wraps the app in `StoreProvider`, `QueryProvider`,
  `WalletKitContextProvider`, and `LayoutContextProvider`.
- **Zustand state syncs to the URL querystring** via `zustand-querystring`.
  Avoid using `useState` or `useSearchParams` for values that should persist
  across navigation — use the Zustand store instead. The store is initialized
  once from the URL in `StoreProvider`.
- **CSP proxy**: `src/proxy.ts` (Next.js 16 proxy, formerly middleware)
  generates a nonce-based Content Security Policy on every request. When
  adding new external script/font/image sources, update the CSP directives
  there.
- **No Horizon for new features**: Always use RPC endpoints
  (`src/query/useRpc*`, `src/query/useGetRpc*`). Horizon hooks exist for legacy
  features only.

## Common Issues and Solutions

### Network Limits Fetch Failure

`pnpm fetch-limits` or `pnpm dev` fails with "fetch failed" — network
restrictions blocking Stellar RPC endpoints. The repo includes a committed
`src/constants/networkLimits.ts` with recent values; if it exists, skip
fetching. If pre-push hooks fail due to network: `git push --no-verify`.

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

## Code Patterns and Conventions

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
- Never edit `src/constants/stellarAssetContractSpec.ts` manually. Regenerate it
  with `pnpm fetch-sac-spec` (needs the stellar CLI) after a protocol or stellar
  CLI release that changes the SAC interface
- Store XDR as base64 strings; parse lazily at point of use
- When updating `@stellar/stellar-sdk` or `@stellar/stellar-xdr-json`, also
  check whether `@stellar-expert/contract-wasm-interface-parser` needs to be
  bumped — it depends on matching XDR definitions to parse contract wasm
  correctly, and an outdated version will silently fail to decode XDR.

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

## Skills

Detailed patterns are in on-demand skills (`.claude/skills/`). Use these for
deep context when working in specific areas:

- `/zustand-store-patterns` — store selection, hydration, cross-store reads
- `/figma-to-code` — translating Figma MCP output to project conventions
- `/component-guide` — UI component catalog (SDS + local) and SCSS conventions

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
