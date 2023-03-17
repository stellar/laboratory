# laboratory

The Stellar Laboratory is a suite of tools to help one learn about exploring the
Stellar network. See it in action:
[https://www.stellar.org/laboratory/](https://www.stellar.org/laboratory/).

## Developing

```sh
yarn start
```

Testing hardware wallets requires an HTTPS connection to enable U2F. The
recommended way to do this is with [`ngrok`](https://ngrok.com/). Once
downloaded and authenticated, start ngrok, and tell the laboratory to start with
a public URL.

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

To build a production docker image using a clean docker build environment:

```sh
make docker-build
# or directly with docker
docker build -t lab:localbuild .
```

To build and run production build locally:
```sh
yarn production
# or
yarn prod:build
yarn prod:serve
```

Production uses Amplitude to emit metrics, so to fully emulate a production build, you'll need to set an `AMPLITUDE_API_KEY` variable in `/public/settings/env-config.js` file.

## Internal documentation

The [docs.md](./docs.md) file contains code documentation on the laboratory. The
docs.md is only relevant for developing the laboratory.
