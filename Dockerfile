FROM ubuntu:16.04 as build

MAINTAINER SDF Ops Team <ops@stellar.org>

WORKDIR /app/src

RUN apt-get update && apt-get install -y curl git make apt-transport-https && \
    curl -sSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    echo "deb https://deb.nodesource.com/node_10.x xenial main" | tee /etc/apt/sources.list.d/nodesource.list && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y nodejs yarn && apt-get clean

COPY package.json yarn.lock /app/src/
RUN yarn install

ADD .babelrc webpack.config.base.js webpack.config.prod.js /app/src/
ADD src /app/src/src

ARG AMPLITUDE_KEY
RUN yarn build

FROM nginx:1.17

COPY --from=build /app/src/dist/ /usr/share/nginx/html/

# We're removing /laboratory/ prefix. To allow for transition
# period we'll support /laboratory/ links using rewrites
COPY nginx_default.conf /etc/nginx/conf.d/default.conf
