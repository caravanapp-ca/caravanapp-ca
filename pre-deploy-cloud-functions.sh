#!/usr/bin/env bash
set -e
yarn workspace @caravanapp/mongo lint
yarn workspace @caravanapp/mongo build

mkdir -p packages/cloud-functions/functions/src/workspace/mongo
cp -r packages/mongo/dist/* packages/cloud-functions/functions/src/workspace/mongo
