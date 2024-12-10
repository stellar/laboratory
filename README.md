# Lab

The Stellar Lab is a suite of tools to help one learn about exploring the
Stellar network.

The `master` branch is deployed to
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
- [Yarn Classic (v1)](https://classic.yarnpkg.com/lang/en/docs/install/)

## Developing

```sh
yarn dev
```

Testing hardware wallets requires an HTTPS connection to enable U2F. The
recommended way to do this is with [`ngrok`](https://ngrok.com/). Once
downloaded and authenticated, start ngrok, and tell the Lab to start with a
public URL.

```bash
./ngrok http 3000
# in a separate terminal
# the subdomain will appear in ngrok's output
yarn start --public randomsubdomain.ngrok.io
```

## Building for production

```sh
yarn build
```

To build and run production build locally:

```sh
yarn start
```

Production uses [Amplitude](https://amplitude.com/) to emit metrics, so to fully
emulate a production build, you’ll need to set an
`NEXT_PUBLIC_AMPLITUDE_API_KEY` variable in `.env.local` file.
