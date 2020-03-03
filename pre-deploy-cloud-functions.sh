#!/usr/bin/env bash
set -e
yarn workspace @caravanapp/buddy-reading-mongo lint
yarn workspace @caravanapp/buddy-reading-mongo build

mkdir -p packages/cloud-functions/functions/src/workspace/mongo
cp -r packages/mongo/dist/* packages/cloud-functions/functions/src/workspace/mongo
