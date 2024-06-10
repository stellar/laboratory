FROM node:20-alpine

ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 80
WORKDIR /app
COPY . .

# Install Python, build tools, Linux headers, and libudev
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev

# Set npm to use the installed Python
RUN yarn config set python /usr/bin/python3

RUN yarn install
RUN yarn build

# Run on port 80 for compatibility with laboratory v1
EXPOSE 80
CMD ["npm", "start"]
