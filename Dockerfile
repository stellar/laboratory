FROM ubuntu:20.04 as build

MAINTAINER SDF Ops Team <ops@stellar.org>

RUN mkdir -p /app
WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive
# https://create-react-app.dev/docs/advanced-configuration/
ENV INLINE_RUNTIME_CHUNK=false
RUN apt-get update && apt-get install --no-install-recommends -y gpg curl git make ca-certificates apt-transport-https && \
    curl -sSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key|gpg --dearmor >/etc/apt/trusted.gpg.d/nodesource.gpg && \
    echo "deb https://deb.nodesource.com/node_14.x focal main" | tee /etc/apt/sources.list.d/nodesource.list && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg |gpg --dearmor >/etc/apt/trusted.gpg.d/yarnpkg.gpg && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y nodejs yarn && apt-get clean

COPY . /app/
RUN yarn install

ARG AMPLITUDE_KEY
RUN yarn build

FROM nginx:1.17

COPY --from=build /app/build/ /usr/share/nginx/html/

# We're removing /laboratory/ prefix. To allow for transition
# period we'll support /laboratory/ links using rewrites
COPY nginx_default.conf /etc/nginx/conf.d/default.conf
