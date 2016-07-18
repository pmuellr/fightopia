#!/usr/bin/env bash

mkdir -p tmp

echo "running browserify"
npm -s run browserify -- \
  lib/fightopia-browser.js \
  --outfile tmp/fightopia-browser-debug.js \
  --debug

echo "running cat-source-map"
npm -s run cat-source-map \
  --fixFileNames \
  tmp/fightopia-browser-debug.js \
  web/fightopia-browser.js

rm tmp/fightopia-browser-debug.js
