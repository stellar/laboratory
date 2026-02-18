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

## Common Issues and Solutions

### Issue 1: Network Limits Fetch Failure

**Problem**: `pnpm fetch-limits` or `pnpm dev` fails with "fetch failed" when
trying to reach Stellar RPC endpoints.

**Root Cause**: Network restrictions blocking access to Stellar RPC endpoints

**Workaround**:

1. The repository includes a committed `src/constants/networkLimits.ts` file
   with recent values
2. If the file exists and is recent, skip fetching and start dev server directly
3. If pre-push hooks fail due to network issues: `git push --no-verify`
4. To configure different RPC endpoints, edit `NETWORKS` array in
   `scripts/fetch-network-limits.mjs`

**Prevention**: Ensure `src/constants/networkLimits.ts` is committed before
attempting builds.

### Issue 2: Next.js Lint Deprecation Warning

**Problem**: `pnpm lint` shows deprecation warning for `next lint` in
Next.js 16.

**Status**: Warning only, not blocking. The command still works in Next.js 15.

**Future Action**: May need to migrate to ESLint CLI when upgrading to
Next.js 16.

### Issue 3: Husky Hooks Failing

**Problem**: Git hooks fail in restricted network environments or when tests are
failing.

**Solutions**:

- Skip pre-push hooks: `git push --no-verify`
- Disable Husky temporarily: `HUSKY=0 git push`
- Fix tests before pushing (preferred)

### Issue 4: Module Resolution Errors

**Problem**: TypeScript can't find imports using `@/` alias.

**Solution**: Ensure `tsconfig.json` has correct path mapping:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue 5: React Query Stale Data

**Problem**: UI shows outdated data after mutations.

**Solution**: Use query invalidation after mutations:

```typescript
const queryClient = useQueryClient();
await mutation.mutateAsync(data);
queryClient.invalidateQueries({ queryKey: ["relevant-key"] });
```

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
│   │   │   ├── network-limits/     # Display network data from `constants/networkLimits.ts`
│   │   │   ├── r/                  # Redirects to full contract explorer page
│   │   │   ├── smart-contracts/    # Contract explorer, list, deploy, saved contracts
│   │   │   ├── transaction/        # Build, simulate, sign, submit (Classic & Soroban)
│   │   │   ├── transactions-explorer/  # Transaction explorer for Local Network
│   │   │   ├── xdr/                # XDR viewer, XDR to JSON, Diff XDRs
│   │   ├── layout.tsx     # Root layout with providers
│   │   └── page.tsx       # Home page
│   ├── components/        # Reusable React components (50+)
│   ├── constants/         # Configuration and static data
│   │   ├── endpointsPage.ts        # RPC/Horizon endpoint forms config
│   │   ├── navItems.ts             # Sidebar navigation config
│   │   ├── networkLimits.ts        # Auto-generated network limits (DO NOT EDIT MANUALLY)
│   │   ├── popularSorobanContracts.ts  # Popular contracts data
│   │   ├── routes.ts               # Centralized route definitions
│   │   ├── settings.ts             # Misc settings (networks, storage keys, etc.)
│   │   ├── signTransactionPage.ts  # Sign transaction page config
│   │   ├── stellarAssetContractData.ts  # Stellar Asset Contract (SAC) support
│   │   └── transactionOperations.tsx    # Classic Operation field config
│   ├── helpers/           # Utility functions (70+ files)
│   │   ├── xdr/           # XDR-specific utilities
│   │   └── explorer/      # Explorer-specific helpers
│   ├── hooks/             # Custom React hooks
│   ├── metrics/           # GA and Amplitude analytics tracking
│   ├── query/             # React Query hooks (20+ files)
│   │   └── external/      # External API query hooks (Stellar.Expert)
│   ├── store/             # Zustand state stores
│   │   └── createStore.ts # Main store factory
│   ├── styles/            # Sass stylesheets
│   ├── types/             # TypeScript type definitions
│   ├── validate/          # Validation logic
│   │   └── methods/       # Field-level validators
│   ├── instrumentation.ts # Sentry setup and custom error tracking
│   ├── instrumentation-client.ts # Sentry client initialization
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
  ```typescript
  import { helper } from "@/helpers/utils";
  import { useStore } from "@/store/createStore";
  ```
- Configured in `tsconfig.json`'s `paths`

### Naming Conventions

- **Components**: PascalCase (e.g., `TransactionBuilder.tsx`, `AssetPicker.tsx`)
- **Utilities/Helpers**: camelCase (e.g., `decodeXdr.ts`, `getTxData.ts`)
- **Hooks**: `use` prefix (e.g., `useSimulateTx.ts`, `useHorizonHealthCheck.ts`)
- **Types**: PascalCase interfaces/types (e.g., `NetworkLimits`,
  `TxBuilderParams`)
- **Constants**: SCREAMING_SNAKE_CASE for true constants, camelCase for config
  objects

### State Management

- **Global State**: Zustand with Immer middleware for immutable updates
  ```typescript
  // Example store pattern
  const useMyStore = create<MyState>()(
    immer((set) => ({
      data: null,
      setData: (newData) =>
        set((state) => {
          state.data = newData;
        }),
    })),
  );
  ```
- **URL Persistence**: State synced to querystring using `zustand-querystring`
- **Server State**: React Query (`@tanstack/react-query`) for data fetching and
  caching
  ```typescript
  // Example query pattern
  const { data, isLoading, error } = useQuery({
    queryKey: ["key", param],
    queryFn: () => fetchData(param),
  });
  ```

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
- Example pattern:
  ```typescript
  /**
   * Validates a Stellar public key
   * @param value - The public key to validate
   * @returns Error message or undefined if valid
   */
  export const getPublicKeyError = (value: string): string | undefined => {
    if (!value) return "Public key is required";
    if (!StrKey.isValidEd25519PublicKey(value)) {
      return "Invalid Stellar public key";
    }
    return undefined;
  };
  ```

### Stellar-Specific Features

- **API Preference**: Always use RPC instead of Horizon for new features (most
  up-to-date data and functionality)
- **Existing React Query Hooks**: Use `src/query/useRpc*` and
  `src/query/useGetRpc*` for fetching from RPC endpoints
- **Network Configuration**: Never edit `src/constants/networkLimits.ts`
  manually (auto-generated)

## Best Practices

### Styling

- Use `@stellar/design-system` components and SCSS exclusively
- Never use inline `style={}` attributes
- Example:

  ```typescript
  import { Button, Input } from "@stellar/design-system";
  import "./styles.scss";

  <div className="container">
    <Button>Click me</Button>
  </div>
  ```

### Component Development

- Import existing components from the design system rather than building custom
  UI elements
- Check the [Design System](https://design-system.stellar.org/) for available
  components
- Common components: Button, Input, Select, Card, Modal, Notification, CopyText,
  etc.

### Function Writing

When writing functions, always:

- Add descriptive JSDoc comments
- Include input validation
- Use early returns for error conditions
- Add meaningful variable names
- Include at least one example usage in comments

Example:

```typescript
/**
 * Decodes a base64-encoded XDR string into a Stellar SDK object
 *
 * @param xdr - Base64-encoded XDR string
 * @param type - XDR type to decode (e.g., 'TransactionEnvelope')
 * @returns Decoded XDR object
 * @throws Error if XDR is invalid or decoding fails
 *
 * @example
 * const tx = decodeXdr('AAAAAA...', 'TransactionEnvelope');
 */
export const decodeXdr = (xdr: string, type: string) => {
  if (!xdr) throw new Error("XDR string is required");
  // implementation
};
```

### Error Handling

- Use try-catch for async operations
- Provide meaningful error messages to users
- Log errors to console in development
- Use Sentry for production error tracking (already configured)

### TypeScript Best Practices

- Avoid `any` unless absolutely necessary (use `unknown` instead)
- Define explicit return types for functions
- Use type guards for runtime type checking
- Leverage union types and discriminated unions
- Use `const` assertions for literal types

## Testing Guidelines

### Unit Tests (Jest)

- **Location**: `tests/unit` (convention: `*.test.ts`)
- **Configuration**: `jest.config.js`
- **Run**: `pnpm test:unit`
- **Coverage**: Collects from `src/**/*.ts`
- **Path Aliases**: `@/` imports work via `moduleNameMapper`

**Example Test Pattern**:

```typescript
import { myFunction } from "./myFunction";

describe("myFunction", () => {
  it("should return expected value for valid input", () => {
    const result = myFunction("input");
    expect(result).toBe("expected");
  });

  it("should throw error for invalid input", () => {
    expect(() => myFunction("")).toThrow("Error message");
  });
});
```

### E2E Tests (Playwright)

- **Location**: `tests/e2e/`
- **Configuration**: `playwright.config.ts`
- **Run**: `pnpm test:e2e`
- **Browser**: Chromium only (Firefox and Safari commented out)
- **Dev Server**: Automatically started via `webServer` config
- **Timeout**: 20s per test, 60s for dev server startup
- **Retries**: 2 retries on failure
- **Workers**: 2 parallel workers

**Example E2E Test Pattern**:

```typescript
import { test, expect } from "@playwright/test";

test("user can create keypair", async ({ page }) => {
  await page.goto("/account/create");
  await page.click('button:has-text("Generate Keypair")');
  await expect(page.locator('[data-testid="public-key"]')).toBeVisible();
});
```

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

# Run specific test file
pnpm test:unit src/helpers/xdr/decodeXdr.test.ts
```

## Stellar-Specific Development Notes

### Working with XDR

- **Encoding/Decoding**: Use helpers in `src/helpers/xdr/`,
  `helpers/StellarXdr.ts`, `helpers/decodeXdr.ts`
- **JSON Conversion**: `@stellar/stellar-xdr-json` package for XDR ↔ JSON
- **Validation**: Check `src/validate/methods/validateXdr.ts`

**Common XDR Operations**:

```typescript
import { decodeXdr } from "@/helpers/xdr/decodeXdr";
import { StellarXdr } from "@/helpers/StellarXdr";

// Decode XDR
const decoded = StellarXdr.decode("TransactionEnvelope", xdrString);

// Encode to XDR
const encoded = StellarXdr.encode("TransactionEnvelope", txObject);
```

### Working with Transactions

- **Classic Transactions**: See
  `src/app/(sidebar)/transaction/build/components/Classic*.tsx`
- **Soroban Transactions**: See
  `src/app/(sidebar)/transaction/build/components/Soroban*.tsx`
- **Fee Bumps**: See `src/app/(sidebar)/transaction/build/fee-bump/page.tsx`
- **Simulation**: Use `useSimulateTx` hook from `src/query/useSimulateTx.ts`

**Key Transaction Helpers**:

- `src/helpers/getTxData.ts` - Extract transaction data
- `src/helpers/txHelper.ts` - Transaction related helper functions

### Working with Smart Contracts

- **Contract Deployment**: `src/app/(sidebar)/smart-contracts/deploy/`
- **Contract Invocation**:
  `src/app/(sidebar)/smart-contracts/contract-explorer/components/InvokeContract*.tsx`
- **Contract Helpers**: `src/helpers/sorobanUtils.ts`
- **Contract Specs**: Parser in `@stellar-expert/contract-wasm-interface-parser`
- **SAC (Stellar Asset Contract)**: Special handling in
  `src/constants/stellarAssetContractData.ts` and `src/hooks/useSacXdrData.ts`

### Working with Network Configuration

- **Network Limits**: Auto-generated file at `src/constants/networkLimits.ts` -
  DO NOT EDIT MANUALLY
- **Horizon vs RPC**: Different query hooks for each API type. **New features
  should use RPC hooks**

## Build and Deployment

### Production Build

```bash
# Build for production
pnpm build

# Output location: build/ directory (standalone format)
```

### Environment Variables

- `NEXT_PUBLIC_STELLAR_LAB_BACKEND_URL` - Backend API URL (set in `.env.local`
  and `.env.production`)
- `NEXT_PUBLIC_DISABLE_GOOGLE_ANALYTICS=true` - Disable Google Analytics
  (optional)
- `NEXT_PUBLIC_COMMIT_HASH` - Auto-set from git in dev/build
- `NEXT_PUBLIC_ENABLE_EXPLORER=true` - Enable explorer features (dev mode)

## Code Quality

Husky runs lint + tests on push; use `--no-verify` to skip

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

## Additional Resources

- **Stellar Documentation**: https://developers.stellar.org/
- **Stellar SDK Docs**: https://stellar.github.io/js-stellar-sdk/
- **Next.js Docs**: https://nextjs.org/docs
- **Stellar Lab Live**: https://lab.stellar.org/
- **Design System**: https://design-system.stellar.org/
- **React Query Docs**: https://tanstack.com/query/latest
- **Zustand Docs**: https://zustand-demo.pmnd.rs/

## Task Completion Checklist

When Claude Code completes a task, verify:

- [ ] All requested functionality is implemented
- [ ] Code follows existing patterns and conventions
- [ ] TypeScript types are properly defined (no `any` unless absolutely
      necessary)
- [ ] JSDoc comments added for new functions
- [ ] Unit tests written/updated for new logic
- [ ] No TypeScript errors (`pnpm lint:ts`)
- [ ] No ESLint errors (`pnpm lint`)
- [ ] Tests pass (`pnpm test:unit` at minimum)
- [ ] Manual testing performed in browser
- [ ] No console errors or warnings
- [ ] Changes work with existing features
- [ ] Documentation updated if needed (this file, inline comments)
