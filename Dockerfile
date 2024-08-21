FROM node:20

ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 80
WORKDIR /app
COPY . .
# Passing env var to be used on client side
ARG NEXT_PUBLIC_COMMIT_HASH
RUN yarn install
RUN yarn build

# Run on port 80 for compatibility with laboratory v1
EXPOSE 80
CMD ["npm", "start"]
