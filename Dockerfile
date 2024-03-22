FROM node:18-alpine

ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 80
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
# Run on port 80 for compatibility with laboratory v1
EXPOSE 80
CMD ["yarn", "start"]
