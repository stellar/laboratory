FROM node:22.22.0

ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 80
# Set keep-alive timeout to prevent 502 errors from connection timeouts
ENV KEEP_ALIVE_TIMEOUT 65000

WORKDIR /app
COPY . .

# Passing env var to be used on client side
ARG NEXT_PUBLIC_COMMIT_HASH
# Reown (WalletConnect) project id. WalletConnect is left out of the Connect
# Wallet modal when this is empty.
ARG NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
ENV NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=$NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

RUN corepack enable
RUN pnpm install
RUN pnpm build

# Run on port 80 for compatibility with laboratory v1
EXPOSE 80
CMD ["npm", "start"]
