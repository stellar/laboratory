# Multi-stage build: the runtime image only contains Next.js standalone output,
# not dev dependencies or the full Debian build tooling of the `node` image.

# ---- Build stage ----
FROM node:22.23.4-slim AS builder

ENV NEXT_TELEMETRY_DISABLED=1
# Emit build/standalone (see next.config.js)
ENV NEXT_PUBLIC_ENABLE_STANDALONE_OUTPUT=true

WORKDIR /app

RUN corepack enable

# Install deps first so this layer is cached when only source changes
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Passing env var to be used on client side
ARG NEXT_PUBLIC_COMMIT_HASH

RUN pnpm build

# ---- Runtime stage ----
FROM node:22.23.4-slim AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=80
ENV HOSTNAME=0.0.0.0
# Set keep-alive timeout to prevent 502 errors from connection timeouts
ENV KEEP_ALIVE_TIMEOUT=65000

WORKDIR /app

# The runtime doesn't need npm/corepack (server.js runs on plain node).
# Removing them also removes the JS packages they bundle from the scan surface.
RUN rm -rf /usr/local/lib/node_modules /usr/local/bin/npm /usr/local/bin/npx \
  /usr/local/bin/corepack /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg

COPY --from=builder /app/build/standalone ./
COPY --from=builder /app/build/static ./build/static
COPY --from=builder /app/public ./public

# Run on port 80 for compatibility with laboratory v1
EXPOSE 80
CMD ["node", "server.js"]
