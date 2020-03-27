FROM ubuntu:16.04 as build

MAINTAINER SDF Ops Team <ops@stellar.org>

ADD . /app/src

WORKDIR /app/src

RUN apt-get update && apt-get install -y curl git apt-transport-https && \
    curl -sSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    echo "deb https://deb.nodesource.com/node_10.x xenial main" | tee /etc/apt/sources.list.d/nodesource.list && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y nodejs yarn && apt-get clean

RUN yarn install && yarn build

FROM nginx:1.17

COPY --from=build /app/src/dist/ /usr/share/nginx/html/

# We're removing /laboratory/ prefix. To allow for transition
# period we'll support /laboratory/ links using rewrites
COPY --from=build /app/src/nginx_default.conf /etc/nginx/conf.d/default.conf
