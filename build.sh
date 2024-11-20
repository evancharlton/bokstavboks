#!/usr/bin/env bash

echo "Copying wordlists ..."
find wordlist/bokstavboks \
  -mindepth 1 \
  -maxdepth 1 \
  -type d \
  -exec cp -Rv {} public/ \; \
|| exit $?

npm ci || exit $?
npm run build || exit $?

echo "bokstavboks.no" > dist/CNAME