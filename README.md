# Stellar Lab (Lab)

[![Apache 2.0 licensed](https://img.shields.io/badge/license-apache%202.0-blue.svg)](LICENSE)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/stellar/laboratory)

The Stellar Lab is an interactive toolkit for exploring the Stellar network. It
helps developers and builders experiment with building, signing, simulating, and
submitting transactions, as well as making requests to both RPC and Horizon
APIs. With built-in tools for saving and sharing transactions, converting
between XDR and JSON, and exploring smart contracts on Stellar, the Stellar Lab
is ideal for testing, learning, and exploring on Stellar.

## Overview

The `main` branch is deployed to
[https://lab.stellar.org/](https://lab.stellar.org/). On the landing page at the
bottom right, you can reference a commit hash of the web app version you're
viewing.

## Tech stack

- [Next.js](https://nextjs.org/) framework (React)
- [TypeScript](https://www.typescriptlang.org/)
- [Stellar Design System](https://design-system.stellar.org/) for UI
- [Sass](https://sass-lang.com/) for CSS styling
- [TanStack (React) Query](https://tanstack.com/query/latest) for API queries
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) for state
  management
- [Playwright](https://playwright.dev/) for e2e tests
- [pnpm](https://pnpm.io/installation)

## Developing

```sh
pnpm dev
```

### Network Limits

The Lab automatically fetches Stellar network limits (Mainnet, Testnet, and
Futurenet) before every `dev` run.

To configure RPC endpoints, edit the
`NETWORKS` array in `scripts/fetch-network-limits.js`:

```javascript
const NETWORKS = [
  { name: "mainnet", rpcUrl: "MAINNET_RPC_URL" },
  { name: "testnet", rpcUrl: "TESTNET_RPC_URL" },
  { name: "futurenet", rpcUrl: "FUTURENET_RPC_URL" },
];
```

The script generates `src/constants/networkLimits.ts` with type-safe exports:

```typescript
import { MAINNET_LIMITS, NETWORK_LIMITS } from "@/constants/networkLimits";
```

To manually fetch limits: `pnpm fetch-limits`.

### Hardware Wallets

Testing hardware wallets requires an HTTPS connection to enable U2F. The
recommended way to do this is with [`ngrok`](https://ngrok.com/). Once
downloaded and authenticated, start ngrok, and tell the Lab to start with a
public URL.

```bash
./ngrok http 3000
# in a separate terminal
# the subdomain will appear in ngrok's output
pnpm start --public randomsubdomain.ngrok.io
```

## Building for production

```sh
pnpm build
```

The app will be built into the `build` directory in Next.js' standalone output
format.

To run production build locally this command can be used conveniently:

```sh
pnpm start
```

To distribute and deploy the production build you need to copy the
`build/static` directory to the `build/standalone/public/_next/static` location,
and then the files and directories inside the `build/standalone` directory are
the only files needed for production and can be distributed to the deployment
location.

In the deployment location the following command will run the app:

```sh
node server.js
```

## Tracking

To improve Lab, we use [Amplitude](https://amplitude.com/) and
[Google Analytics](https://developers.google.com/analytics) tracking in
production.

If you are running your version of Lab (for Quickstart, for example), you can
disable the Google Analytics by setting this `env` variable:

```
NEXT_PUBLIC_DISABLE_GOOGLE_ANALYTICS=true
```

No need to disable Amplitude as it runs only on `lab.stellar.org`.
