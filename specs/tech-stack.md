# Tech Stack

> `package.json` is the source of truth for exact versions. This file records
> what we use, why, and the rules that apply to it.

## Runtime and tooling

| Area            | Choice                                       |
| --------------- | -------------------------------------------- |
| Node.js         | >= 22.22.0 (`.nvmrc`)                        |
| Package manager | pnpm 10 (via Corepack)                       |
| Language        | TypeScript 5                                 |
| Framework       | Next.js 15, App Router, React 19             |
| Output          | Next.js standalone build, Docker, nginx      |
| CI              | GitHub Actions (incl. per-PR preview builds) |
| Error tracking  | Sentry                                       |
| Analytics       | Google Analytics, Amplitude (`src/metrics/`) |

## UI

- **Stellar Design System** (`@stellar/design-system`) is the first choice for
  components. Local components in `src/components/` fill the gaps.
- **Sass** for styles. Class names use a BEM-like pattern:
  `ComponentName__element`.
- **Monaco** (`@monaco-editor/react`) for code and JSON editors.
- All pages under `src/app/(sidebar)/` are client components (`"use client"`).
  The root `app/layout.tsx` is the only server component.

## State

| Store                                                     | Persistence           | Use for                                                                  |
| --------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------ |
| Main store (`src/store/createStore.ts`)                   | URL querystring (legacy) | Network selection and a few lookup inputs. Not a way to save work; do not add new URL state. |
| Transaction flow store (`createTransactionFlowStore.ts`)  | `sessionStorage`         | Work in progress, kept for the current session (tab).                                  |
| `localStorage`                                            | Browser only             | Items the user saves: keypairs, transactions, contracts.                               |

Rules:

- Session state lives in `sessionStorage`. Saved state lives in
  `localStorage`. Lab does not save or share state through URLs.
- Do not use `useState` or `useSearchParams` for values that must persist
  across navigation. Use the right store.

## Data fetching

- **TanStack React Query v5** for all network requests (`src/query/`).
- **RPC first.** All new features use Stellar RPC (`useRpc*`, `useGetRpc*`).
- **No Horizon for new features.** Existing Horizon hooks (for example,
  account info, sequence number, Friendbot, Horizon submit) are legacy. Do not
  add new ones.

## Backend

[`stellar/laboratory-backend`](https://github.com/stellar/laboratory-backend)
(`NEXT_PUBLIC_STELLAR_LAB_BACKEND_URL`) serves data the browser cannot get
cheaply from RPC:

- **Contract storage**: storage entries for a contract.
- **Network limits**: `/{network}/api/network_limits`, derived from the
  current network setting.

## Stellar libraries

| Library                                         | Purpose                                  |
| ----------------------------------------------- | ---------------------------------------- |
| `@stellar/stellar-sdk`                          | Build, sign, simulate, submit; RPC client |
| `@stellar/stellar-xdr-json`                     | XDR ⇄ JSON conversion (wasm)             |
| `@stellar-expert/contract-wasm-interface-parser`| Parse contract wasm specs                |
| `@creit.tech/stellar-wallets-kit`               | Browser and mobile wallet connections    |
| `@ledgerhq/hw-app-str`, `@trezor/connect-web`   | Hardware wallet signing                  |
| `stellar-hd-wallet`                             | Mnemonic / HD key derivation             |
| `bignumber.js`, `lossless-json`                 | Precise amounts and large integers       |

Data conventions:

- Store XDR as base64 strings. Parse at the point of use.

## Protocol upgrade policy

Lab must support each protocol release on or before testnet launch day.

1. When a new protocol is announced, open a tracking issue that lists the
   new operations, XDR types, host functions, and limit changes.
2. Bump `@stellar/stellar-sdk` and `@stellar/stellar-xdr-json` to versions
   that support the new XDR.
3. In the same change, check whether
   `@stellar-expert/contract-wasm-interface-parser` must also be bumped. An
   outdated parser fails silently on new XDR.
4. Make sure the backend network limits endpoint returns new or renamed
   fields, and update the Network Limits page.
5. Add UI for new operations and types, then e2e tests against testnet.
6. Before mainnet activation, check that both old and new protocol versions
   work while networks are on different versions.

## Security

- `src/middleware.ts` sets a nonce-based Content Security Policy on every
  request. Add every new external script, font, image, or connect source
  there.
- Secret keys never leave the browser.
- Sanitize user-provided HTML (`dompurify`) and validate URLs (`isValidUrl`).

## Quality

| Tool       | Use                                                  |
| ---------- | ---------------------------------------------------- |
| ESLint     | `pnpm lint` (incl. `@tanstack/eslint-plugin-query`)  |
| TypeScript | `pnpm lint:ts`                                       |
| Prettier   | 80 chars, 2 spaces, semicolons, double quotes        |
| Jest       | Unit tests in `tests/unit/`                          |
| Playwright | E2E tests in `tests/e2e/`                            |
| Husky      | lint-staged on commit; lint:ts + tests on push       |

Validation functions live in `src/validate/methods/` and follow the
`get*Error()` convention: they return an error message or `undefined`.
