# Copilot Instructions for Stellar Laboratory

## Repository Overview

Stellar Lab is an interactive toolkit for exploring the Stellar blockchain network. It helps developers experiment with building, signing, simulating, and submitting transactions, as well as making requests to both RPC and Horizon APIs. The `main` branch is deployed to https://lab.stellar.org/.

## Tech Stack

- **Framework**: Next.js 15.5.9 (React 19.2.2) with App Router
- **Language**: TypeScript 5.8.3
- **UI Framework**: Stellar Design System, Sass
- **State Management**: Zustand (with querystring persistence via zustand-querystring)
- **API Data Fetching**: TanStack React Query v5
- **Blockchain SDK**: @stellar/stellar-sdk v14.3.3
- **Hardware Wallets**: Ledger (@ledgerhq/hw-app-str), Trezor (@trezor/connect-web)
- **Testing**: Jest (unit tests), Playwright (e2e tests)
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Package Manager**: pnpm 10.15.1
- **Deployment**: Docker, Next.js standalone output, Sentry error tracking

## Prerequisites

- **Node.js**: >= 22.22.0 (specified in `.nvmrc` and `package.json`)
- **pnpm**: >= 10.15.1 (managed via Corepack)

## Development Setup

### Initial Setup

```bash
# Enable Corepack (for pnpm)
corepack enable

# Install dependencies
pnpm install --frozen-lockfile

# Start development server
pnpm dev
```

The `pnpm dev` command automatically runs `pnpm fetch-limits` (via `predev` script) to fetch Stellar network limits from RPC endpoints before starting the dev server.

### Important Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server (includes network limits fetch) |
| `pnpm build` | Production build (creates `build/` directory) |
| `pnpm start` | Run production build locally |
| `pnpm lint` | ESLint code linting |
| `pnpm lint:ts` | TypeScript type checking |
| `pnpm test:unit` | Run Jest unit tests |
| `pnpm test:e2e` | Run Playwright e2e tests |
| `pnpm test` | Run all tests (unit + e2e) |
| `pnpm fetch-limits` | Manually fetch Stellar network limits |

## Project Structure

```
stellar-laboratory/
├── .github/               # GitHub workflows and configuration
├── .husky/                # Git hooks (pre-commit, pre-push, post-merge)
├── public/                # Static assets
├── scripts/               # Build and utility scripts
│   └── fetch-network-limits.mjs  # Fetches Stellar network config
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (sidebar)/     # Route group with shared sidebar layout
│   │   │   ├── transaction/        # Classic & Soroban transactions
│   │   │   ├── smart-contracts/    # Contract explorer, deployer
│   │   │   ├── account/            # Keypair generation, funding
│   │   │   ├── endpoints/          # API explorer (Horizon & RPC)
│   │   │   ├── xdr/                # XDR viewer, converter
│   │   │   └── transactions-explorer/  # Transaction search
│   │   ├── layout.tsx     # Root layout with providers
│   │   └── page.tsx       # Home page
│   ├── components/        # Reusable React components (50+)
│   ├── constants/         # Configuration and static data
│   │   └── networkLimits.ts  # Auto-generated network limits
│   ├── helpers/           # Utility functions (70+ files)
│   │   ├── xdr/           # XDR-specific utilities
│   │   └── explorer/      # Explorer-specific helpers
│   ├── hooks/             # Custom React hooks
│   ├── query/             # React Query hooks
│   │   └── external/      # External API query hooks
│   ├── store/             # Zustand state stores
│   │   └── createStore.ts # Main store factory
│   ├── styles/            # Sass stylesheets
│   ├── types/             # TypeScript type definitions
│   ├── validate/          # Validation logic
│   │   └── methods/       # Field-level validators
│   └── middleware.ts      # Next.js middleware
├── tests/
│   └── e2e/              # Playwright e2e tests
├── jest.config.js        # Jest configuration
├── playwright.config.ts  # Playwright configuration
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Code Patterns and Conventions

### Import Paths

- Use `@/` path alias for imports from `src/`: `import { helper } from "@/helpers/utils"`
- Configured in `tsconfig.json` and `jest.config.js`

### Naming Conventions

- **Components**: PascalCase (e.g., `TransactionBuilder.tsx`, `AssetPicker.tsx`)
- **Utilities/Helpers**: camelCase (e.g., `decodeXdr.ts`, `getTxData.ts`)
- **Hooks**: `use` prefix (e.g., `useSimulateTx.ts`, `useHorizonHealthCheck.ts`)
- **Types**: PascalCase interfaces/types (e.g., `NetworkLimits`, `TxBuilderParams`)

### State Management

- **Global State**: Zustand with Immer middleware for immutable updates
- **URL Persistence**: State is synced to querystring using `zustand-querystring`
- **Server State**: React Query (`@tanstack/react-query`) for data fetching and caching

### Component Organization

- Features are grouped by domain (transaction, account, smart-contracts, endpoints, xdr)
- Reusable components are in `src/components/`
- Page-specific components can be co-located with pages

### Form Validation

- Validation functions in `src/validate/methods/`
- Convention: `get*Error()` functions return error messages or `undefined`
- Example: `getPublicKeyError()`, `getAssetCodeError()`

### Stellar-Specific Features

- **XDR Handling**: `helpers/StellarXdr.ts`, `helpers/decodeXdr.ts`
- **Transaction Building**: Page components in `app/(sidebar)/transaction/`
- **Smart Contracts**: `InvokeContractForm`, `DeployContract`, contract spec parsing
- **RPC Methods**: React Query hooks in `query/external/` (e.g., `useRpcSimulateTx`)
- **Network Limits**: Auto-generated `constants/networkLimits.ts` from Stellar RPC

## Common Issues and Workarounds

### Issue 1: Network Limits Fetch Failure

**Problem**: `pnpm fetch-limits` or `pnpm dev` fails with "fetch failed" when trying to reach Stellar RPC endpoints.

**Root Cause**: 
- Network restrictions blocking access to Stellar RPC endpoints
- RPC endpoints temporarily unavailable

**Workaround**:
1. The repository includes a committed `src/constants/networkLimits.ts` file with recent values
2. If the file exists and is recent, you can skip fetching and proceed with development:
   ```bash
   # Skip the predev script and start dev server directly
   pnpm dev --no-verify  # This won't work, use next command instead
   NEXT_PUBLIC_COMMIT_HASH=$(git rev-parse --short HEAD) NEXT_PUBLIC_ENABLE_EXPLORER=true next dev
   ```
3. To configure different RPC endpoints, edit `NETWORKS` array in `scripts/fetch-network-limits.mjs`

**Prevention**: If network access is restricted, ensure `src/constants/networkLimits.ts` is committed before attempting builds.

### Issue 2: Git Pre-Push Hook Failures

**Problem**: Git push fails due to pre-push hook running `pnpm test:e2e`, which requires the dev server, which requires network limits fetch.

**Root Cause**: 
- Pre-push hook (`.husky/pre-push`) runs `pnpm lint:ts && pnpm test:e2e && pnpm test:unit`
- E2e tests start a dev server via Playwright's `webServer` config
- Dev server runs `predev` script which fetches network limits
- Network fetch fails in restricted environments

**Workaround**:
```bash
# Option 1: Skip pre-push hook (use with caution)
git push --no-verify

# Option 2: Ensure networkLimits.ts is committed and use report_progress tool
# The tool handles commits appropriately
```

**Note**: CI/CD workflows (`.github/workflows/build.yml`) also run these tests, so ensure changes pass locally before pushing.

### Issue 3: Hardware Wallet Testing

**Problem**: Hardware wallet features (Ledger, Trezor) require HTTPS for U2F.

**Solution**: Use ngrok for local HTTPS testing:
```bash
# Start ngrok
./ngrok http 3000

# In separate terminal, start dev with public URL
pnpm start --public randomsubdomain.ngrok.io
```

### Issue 4: Next.js Lint Deprecation Warning

**Problem**: `pnpm lint` shows deprecation warning for `next lint` in Next.js 16.

**Status**: Warning only, not blocking. The command still works in Next.js 15.

**Future Action**: May need to migrate to ESLint CLI when upgrading to Next.js 16.

## Testing Guidelines

### Unit Tests (Jest)

- **Location**: Test files co-located with source files (convention: `*.test.ts`)
- **Configuration**: `jest.config.js`
- **Run**: `pnpm test:unit`
- **Coverage**: Collects from `src/**/*.ts`
- **Path Aliases**: `@/` imports work via `moduleNameMapper`

### E2E Tests (Playwright)

- **Location**: `tests/e2e/`
- **Configuration**: `playwright.config.ts`
- **Run**: `pnpm test:e2e`
- **Browser**: Chromium only (Firefox and Safari commented out)
- **Dev Server**: Automatically started via `webServer` config
- **Timeout**: 20s per test, 60s for dev server startup
- **Retries**: 2 retries on failure
- **Workers**: 2 parallel workers

### Running Tests

```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run e2e tests only
pnpm test:e2e

# Run e2e tests in UI mode (interactive)
pnpm playwright-ui
```

## Build and Deployment

### Production Build

```bash
# Build for production
pnpm build

# Output location: build/ directory (standalone format)
```

### Deployment Steps

1. Run `pnpm build`
2. Copy `build/static/` to `build/standalone/public/_next/static/`
3. Deploy files from `build/standalone/` directory
4. Run with: `node server.js`

### Docker Build

```bash
# Build Docker image
make docker-build

# Push Docker image
make docker-push
```

### Environment Variables

- `NEXT_PUBLIC_DISABLE_GOOGLE_ANALYTICS=true` - Disable Google Analytics (optional)
- `NEXT_PUBLIC_COMMIT_HASH` - Auto-set from git in dev/build
- `NEXT_PUBLIC_ENABLE_EXPLORER=true` - Enable explorer features (dev mode)

## Code Quality

### Pre-Commit Hooks

- **Configured via**: Husky (`.husky/pre-commit`)
- **Runs**: `pnpm pre-commit` → `lint-staged`
- **Actions**: ESLint auto-fix on staged files

### Pre-Push Hooks

- **Configured via**: Husky (`.husky/pre-push`)
- **Runs**: `pnpm lint:ts && pnpm test:e2e && pnpm test:unit`
- **Warning**: May fail in restricted network environments (see Issue 2 above)

### Post-Merge Hooks

- **Configured via**: Husky (`.husky/post-merge`)
- **Runs**: `pnpm install-if-package-changed` (auto-installs deps if lockfile changed)

### Linting Rules

- **ESLint Config**: `.eslintrc.json`
- **Extends**: `eslint:recommended`, `@typescript-eslint/recommended`, `next/core-web-vitals`, `prettier`
- **Ignored Patterns**: `./src/temp/stellar-xdr-web/*`
- **Known Exceptions**: `@typescript-eslint/no-explicit-any` disabled

### Code Formatting

- **Prettier Config**: `.prettierrc.json`
- **Settings**: 80 char width, 2 space tabs, semicolons, double quotes, trailing commas

## CI/CD

### GitHub Actions Workflow

**File**: `.github/workflows/build.yml`

**Triggers**:
- Push to `main` branch
- All pull requests

**Steps**:
1. Checkout code
2. Setup Node.js 22.22.0
3. Enable Corepack
4. Install dependencies (`pnpm install --frozen-lockfile`)
5. Install Playwright browsers
6. Build app (`pnpm build`)
7. Run Playwright tests (`pnpm test:e2e`)
8. Run unit tests (`pnpm test:unit`)

**Timeout**: 60 minutes

## Making Changes

### Before Making Changes

1. **Understand the feature area**: Check relevant files in `src/app/(sidebar)/` for the page you're modifying
2. **Check existing patterns**: Look at similar components for patterns to follow
3. **Review state management**: Check if state is in Zustand store or local component state
4. **Verify types**: TypeScript is strict mode, ensure types are correct

### Making Code Changes

1. **Minimal modifications**: Make the smallest changes necessary
2. **Follow existing patterns**: Match naming, structure, and organization of existing code
3. **Update types**: If changing data structures, update TypeScript types
4. **Validate imports**: Use `@/` path alias for src imports
5. **Test locally**: Run linting and tests before committing

### Testing Your Changes

```bash
# Type check
pnpm lint:ts

# Lint code
pnpm lint

# Run unit tests (if you changed helper functions)
pnpm test:unit

# Run e2e tests (if you changed UI/pages)
pnpm test:e2e

# Manual testing: Start dev server and verify in browser
pnpm dev
```

### Committing Changes

The pre-commit hook will automatically:
- Run ESLint with auto-fix on staged files
- Block commit if linting fails

### Pushing Changes

The pre-push hook will automatically:
- Run TypeScript type checking
- Run e2e tests
- Run unit tests

**Note**: Use `--no-verify` to skip hooks if needed (e.g., in restricted network environments).

## Stellar-Specific Development Notes

### Working with XDR

- **Encoding/Decoding**: Use helpers in `src/helpers/xdr/`
- **JSON Conversion**: `@stellar/stellar-xdr-json` package for XDR ↔ JSON
- **Validation**: Check `src/validate/methods/validateXdr.ts`

### Working with Transactions

- **Classic Transactions**: See `src/app/(sidebar)/transaction/build/page.tsx`
- **Soroban Transactions**: See `src/app/(sidebar)/transaction/build-soroban/page.tsx`
- **Fee Bumps**: Separate page for fee bump transactions

### Working with Smart Contracts

- **Contract Deployment**: `src/app/(sidebar)/smart-contracts/deploy/`
- **Contract Invocation**: Form components for invoking contract methods
- **Contract Specs**: Parser in `@stellar-expert/contract-wasm-interface-parser`
- **SAC (Stellar Asset Contract)**: Special handling in `src/constants/stellarAssetContractData.ts`

### Working with Accounts

- **Keypair Generation**: Uses `stellar-sdk` Keypair.random()
- **Muxed Accounts**: Separate handling for muxed account format
- **FriendBot**: Testnet funding via `src/components/FriendBot/`

### Working with Network Configuration

- **Network Limits**: Auto-generated file, don't edit manually
- **RPC Endpoints**: Configure in `scripts/fetch-network-limits.mjs`
- **Horizon vs RPC**: Different query hooks for each API type

## Additional Resources

- **Stellar Documentation**: https://developers.stellar.org/
- **Stellar SDK Docs**: https://stellar.github.io/js-stellar-sdk/
- **Next.js Docs**: https://nextjs.org/docs
- **Stellar Lab Live**: https://lab.stellar.org/
- **Design System**: https://design-system.stellar.org/

## Summary for AI Agents

When working on this repository:

1. **Always enable Corepack first**: `corepack enable`
2. **Install with frozen lockfile**: `pnpm install --frozen-lockfile`
3. **Check if network limits file exists** before trying to fetch
4. **Use `--no-verify` for git operations** if in restricted network environment
5. **Follow TypeScript strict mode** - fix all type errors
6. **Use `@/` imports** for src files
7. **Match existing patterns** in similar components
8. **Test thoroughly** with `pnpm lint:ts && pnpm test:unit`
9. **Document Stellar-specific changes** in commit messages
10. **Be aware of pre-push hooks** that run tests (may need `--no-verify`)

### Most Common Errors and Solutions

| Error | Solution |
|-------|----------|
| `pnpm: command not found` | Run `corepack enable` |
| `fetch failed` for network limits | File already exists in repo, skip fetch |
| Pre-push hook fails with network error | Use `git push --no-verify` or ensure `networkLimits.ts` exists |
| TypeScript errors | Run `pnpm lint:ts` and fix all type issues |
| ESLint errors | Run `pnpm lint` to see issues, `pnpm lint --fix` to auto-fix |
| E2E tests fail to start | Network limits issue, ensure file exists or skip fetch |
