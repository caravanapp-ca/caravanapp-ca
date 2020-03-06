#!/usr/bin/env bash
set -e
yarn workspace @caravanapp/mongo lint
yarn workspace @caravanapp/mongo build

mkdir -p cloud-functions/functions/src/workspace/mongo
cp -r packages/mongo/dist/* cloud-functions/functions/src/workspace/mongo
