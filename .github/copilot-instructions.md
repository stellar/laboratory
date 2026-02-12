# Copilot Instructions for Stellar Laboratory

## Repository Overview

Stellar Lab is an interactive toolkit for exploring the Stellar blockchain
network. It helps developers experiment with building, signing, simulating, and
submitting transactions, as well as making requests to both RPC and Horizon
APIs. The `main` branch is deployed to https://lab.stellar.org/.

## Tech Stack

- **Framework**: Next.js 15.5.9 (React 19.2.2) with App Router
- **Language**: TypeScript 5.8.3
- **UI Framework**: Stellar Design System, Sass
- **State Management**: Zustand (with querystring persistence via
  zustand-querystring)
- **API Data Fetching**: TanStack React Query v5
- **Blockchain SDK**: @stellar/stellar-sdk v14.3.3
- **Hardware Wallets**: Ledger (@ledgerhq/hw-app-str), Trezor
  (@trezor/connect-web)
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

The `pnpm dev` command automatically runs `pnpm fetch-limits` (via `predev`
script) to fetch Stellar network limits from RPC endpoints before starting the
dev server.

### Important Scripts

| Command             | Purpose                                                  |
| ------------------- | -------------------------------------------------------- |
| `pnpm dev`          | Start development server (includes network limits fetch) |
| `pnpm build`        | Production build (creates `build/` directory)            |
| `pnpm start`        | Run production build locally                             |
| `pnpm lint`         | ESLint code linting                                      |
| `pnpm lint:ts`      | TypeScript type checking                                 |
| `pnpm test:unit`    | Run Jest unit tests                                      |
| `pnpm test:e2e`     | Run Playwright e2e tests                                 |
| `pnpm test`         | Run all tests (unit + e2e)                               |
| `pnpm fetch-limits` | Manually fetch Stellar network limits                    |

## Key Directories

```
laboratory/
├── scripts/               # Utility scripts
│   └── fetch-network-limits.mjs  # Fetches Stellar network config automatically before dev/build
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (sidebar)/     # Route group with shared sidebar layout
│   │   │   ├── account/            # Keypair generation, funding, muxed account
│   │   │   ├── endpoints/          # API explorer (Horizon & RPC)
│   │   │   ├── network-limits/          # Display the network data from `constants/networkLimits.ts`
│   │   │   ├── r/          # Redirects to the full contract explorer page (@TODO ask Iveta)
│   │   │   ├── smart-contracts/    # Contract explorer, contract list, deploye contract, saved contracts
│   │   │   ├── transaction/        # Build, simulate, sign, submit transaction for Classic & Soroban
│   │   │   └── transactions-explorer/  # Transaction explorer page when connected to Local Network
│   │   │   ├── xdr/                # XDR viewer, XDR to JSON, Diff XDRs
│   │   ├── layout.tsx     # Root layout with providers
│   │   └── page.tsx       # Home page
│   ├── components/        # Reusable React components (50+)
│   ├── constants/         # Configuration and static data
│   │   └── endpointsPage.ts # Static config for RPC/Horizon endpoint forms: nav items, routes, params, docs URLs
│   │   └── navItems.ts  # Static config for sidebar nav items: labels, icons, routes
│   │   └── networkLimits.ts  # Auto-generated network limits from `scripts/fetch-network-limits.mjs`
│   │   └── popularSorobanContracts.ts  # Data for popular Soroban contracts. Used in `smart-contracts/contract-list`
│   │   └── routes.ts  # Centralized route definitions for the app (used in Link components and navigation)
│   │   └── settings.ts  # Misc settings (e.g. network options, local storage names, classic operations settings, stellar expert url, and etc)
│   │   └── signTransactionPage.ts  # Configuration for the sign transaction page fields
│   │   └── stellarAssetContractData.ts  # Data for Stellar Asset Contract (SAC) support
│   │   └── transactionOperations.tsx  # Configuration for Classic Operation fields
│   ├── helpers/           # Utility functions (70+ files)
│   │   ├── xdr/           # XDR-specific utilities
│   │   └── explorer/      # Explorer-specific helpers
│   ├── hooks/             # Custom React hooks
│   ├── metrics/           # GA and amplitude analytics tracking setup
│   ├── query/             # React Query hooks (20+ files)
│   │   └── external/      # External API query hooks (Stellar.Expert API)
│   ├── store/             # Zustand state stores
│   │   └── createStore.ts # Main store factory
│   ├── styles/            # Sass stylesheets
│   ├── types/             # TypeScript type definitions
│   ├── validate/          # Validation logic
│   │   └── methods/       # Field-level validators
│   ├── instrumentation.ts # Sentry setup and custom error tracking logic
│   ├── instrumentation-client.ts # configures the initialization of Sentry on the client
│   └── middleware.ts      # Next.js middleware
├── tests/
│   ├── e2e/              # Playwright e2e tests
│   └── unit/             # Jest unit tests
├── jest.config.js        # Jest configuration
├── playwright.config.ts  # Playwright configuration
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Code Patterns and Conventions

### Import Paths

- Use `@/` path alias for imports from `src/`:
  `import { helper } from "@/helpers/utils"`
- Configured in `tsconfig.json`'s `paths`

### Naming Conventions

- **Components**: PascalCase (e.g., `TransactionBuilder.tsx`, `AssetPicker.tsx`)
- **Utilities/Helpers**: camelCase (e.g., `decodeXdr.ts`, `getTxData.ts`)
- **Hooks**: `use` prefix (e.g., `useSimulateTx.ts`, `useHorizonHealthCheck.ts`)
- **Types**: PascalCase interfaces/types (e.g., `NetworkLimits`,
  `TxBuilderParams`)

### State Management

- **Global State**: Zustand with Immer middleware for immutable updates
- **URL Persistence**: State is synced to querystring using
  `zustand-querystring`
- **Server State**: React Query (`@tanstack/react-query`) for data fetching and
  caching

### Component Organization

- Features are grouped by domain (transaction, account, smart-contracts,
  endpoints, xdr)
- Reusable components are in `src/components/`
- Page-specific components can be co-located with pages
- **File organization**: Components with styles should be in their own folder:
  - ✅ `ComponentName/ComponentName.tsx` + `ComponentName/ComponentName.scss`
  - ❌ `ComponentName.tsx` + `ComponentName.scss` mixed with other components

### Form Validation

- Validation functions in `src/validate/methods/`
- Convention: `get*Error()` functions return error messages or `undefined`
- Example: `getPublicKeyError()`, `getAssetCodeError()`

### Stellar-Specific Features

- **API Preference**: When building features, always use RPC instead of Horizon
  for the most up-to-date data and functionality. Use existing React Query hooks
  (`src/query/useRpc*`, `src/query/useGetRpc*`) for fetching data from RPC
  endpoints.

## Best Practices

### Styling

Use `@stellar/design-system` components and CSS modules exclusively. Never use
inline `style={}` attributes.

### Component Development

Import existing components from the design system rather than building custom UI
elements.

### Function Writing

When writing functions, always:

- Add descriptive JSDoc comments
- Include input validation
- Use early returns for error conditions
- Add meaningful variable names
- Include at least one example usage in comments

## Common Issues and Workarounds

### Issue 1: Network Limits Fetch Failure

**Problem**: `pnpm fetch-limits` or `pnpm dev` fails with "fetch failed" when
trying to reach Stellar RPC endpoints.

**Root Cause**:

- Network restrictions blocking access to Stellar RPC endpoints

**Workaround**:

1. The repository includes a committed `src/constants/networkLimits.ts` file
   with recent values
2. If the file exists and is recent, you can skip fetching and proceed with
   development:
   ```bash
   # Skip the predev script and start dev server directly
   NEXT_PUBLIC_COMMIT_HASH=$(git rev-parse --short HEAD) NEXT_PUBLIC_ENABLE_EXPLORER=true next dev
   ```
3. If pre-push hooks fail due to network issues, use: `git push --no-verify`
4. To configure different RPC endpoints, edit `NETWORKS` array in
   `scripts/fetch-network-limits.mjs`

**Note**: CI/CD workflows also run these tests, ensure changes pass locally
before pushing.

**Prevention**: If network access is restricted, ensure
`src/constants/networkLimits.ts` is committed before attempting builds.

### Issue 2: Next.js Lint Deprecation Warning

**Problem**: `pnpm lint` shows deprecation warning for `next lint` in
Next.js 16.

**Status**: Warning only, not blocking. The command still works in Next.js 15.

**Future Action**: May need to migrate to ESLint CLI when upgrading to
Next.js 16.

## Testing Guidelines

### Unit Tests (Jest)

- **Location**: Test files co-located with source files (convention:
  `*.test.ts`)
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

### Environment Variables

- `NEXT_PUBLIC_DISABLE_GOOGLE_ANALYTICS=true` - Disable Google Analytics
  (optional)
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
- **Warning**: May fail in restricted network environments (see Issue 1 above)

### Post-Merge Hooks

- **Configured via**: Husky (`.husky/post-merge`)
- **Runs**: `pnpm install-if-package-changed` (auto-installs deps if lockfile
  changed)

### Linting Rules

- **ESLint Config**: `.eslintrc.json`
- **Extends**: `eslint:recommended`, `@typescript-eslint/recommended`,
  `next/core-web-vitals`, `prettier`
- **Ignored Patterns**: `./src/temp/stellar-xdr-web/*`
- **Known Exceptions**: `@typescript-eslint/no-explicit-any` disabled

### Code Formatting

- **Prettier Config**: `.prettierrc.json`
- **Settings**: 80 char width, 2 space tabs, semicolons, double quotes, trailing
  commas

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

## Stellar-Specific Development Notes

- **Transaction Building**: Page components in `app/(sidebar)/transaction/`
- **Smart Contracts**: Page components in
  `app/(sidebar)/smart-contracts/contract-explorer` and
  `app/(sidebar)/smart-contracts/deploy-contract`, with helpers in
  `@/helpers/sorobanUtils`
- **Network Limits**: Auto-generated `constants/networkLimits.ts` from Stellar
  RPC

### Working with XDR

- **Encoding/Decoding**: Use helpers in `src/helpers/xdr/`,
  `helpers/StellarXdr.ts`, `helpers/decodeXdr.ts`
- **JSON Conversion**: `@stellar/stellar-xdr-json` package for XDR ↔ JSON
- **Validation**: Check `src/validate/methods/validateXdr.ts`

### Working with Transactions

- **Classic Transactions**: See
  `src/app/(sidebar)/transaction/build/components/Classic*.tsx`
- **Soroban Transactions**: See
  `src/app/(sidebar)/transaction/build/components/Soroban*.tsx`
- **Fee Bumps**: See `src/app/(sidebar)/transaction/build/fee-bump/page.tsx`

### Working with Smart Contracts

- **Contract Deployment**: `src/app/(sidebar)/smart-contracts/deploy/`
- **Contract Invocation**:
  `src/app/(sidebar)/smart-contracts/contract-explorer/components/InvokeContract*.tsx`
  and helpers in `src/helpers/sorobanUtils.ts`
- **Contract Specs**: Parser in `@stellar-expert/contract-wasm-interface-parser`
- **SAC (Stellar Asset Contract)**: Special handling in
  `src/constants/stellarAssetContractData.ts` and `src/hooks/useSacXdrData.ts

### Working with Accounts

- **Keypair Generation**: Uses `stellar-hd-wallet`. See
  `src/app/(sidebar)/account/create/page.tsx`
- **Muxed Accounts**: See `src/app/(sidebar)/account/muxed*/*`
- **FriendBot**: `src/app/(sidebar)/account/fund/*` and `src/query/useFriendBot`
- **Trustline**: `src/app/(sidebar)/account/fund/*` and
  `src/query/useAddTrustline`

### Working with Network Configuration

- **Network Limits**: Auto-generated file, don't edit manually
- **RPC Endpoints**: Use existing React Query hooks (`src/query/useRpc*`,
  `src/query/useGetRpc*`) for fetching data from RPC endpoints.
- **Horizon vs RPC**: Different query hooks for each API type. New features
  should use RPC hooks.

## Additional Resources

- **Stellar Documentation**: https://developers.stellar.org/
- **Stellar SDK Docs**: https://stellar.github.io/js-stellar-sdk/
- **Next.js Docs**: https://nextjs.org/docs
- **Stellar Lab Live**: https://lab.stellar.org/
- **Design System**: https://design-system.stellar.org/
