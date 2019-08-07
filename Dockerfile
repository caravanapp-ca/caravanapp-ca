# Dockerfile
FROM node:10-alpine
WORKDIR /app
COPY ./package.json yarn.lock .
COPY ./packages/cloud-functions/functions/package.json ./packages/cloud-functions/functions
COPY ./packages/mongo/package.json ./packages/mongo/
COPY ./packages/mongo/package.json ./packages/mongo/
COPY ./packages/types/package.json ./packages/types/
COPY ./packages/web/package.json ./packages/web/
COPY ./packages/web-api/package.json ./packages/web-api/
RUN yarn install --frozen-lockfile
ADD . .
RUN CI=true yarn test &&\
  yarn lint &&\
  yarn build
