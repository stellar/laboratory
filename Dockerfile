FROM node:20

ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 80
WORKDIR /app
COPY . .

# Passing env var to be used on client side
ARG NEXT_PUBLIC_COMMIT_HASH

ARG NEXT_PUBLIC_AMPLITUDE_API_KEY_TEST dockerfile123
ENV NEXT_PUBLIC_AMPLITUDE_API_KEY_TEST_ENV dockerfile123ENV

RUN yarn install
RUN yarn build

# Run on port 80 for compatibility with laboratory v1
EXPOSE 80
CMD ["npm", "start"]
