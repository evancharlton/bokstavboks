#!/usr/bin/env bash

npm ci || exit $?
npm run build || exit $?

echo "bokstavboks.no" > dist/CNAME