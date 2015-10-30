#! /usr/bin/env bash
set -e

npm install

./node_modules/.bin/gulp build
