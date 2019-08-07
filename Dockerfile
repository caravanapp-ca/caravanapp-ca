# Dockerfile
FROM node:10-alpine
WORKDIR /app
ADD package.json yarn.lock ./
RUN yarn install --frozen-lockfile
ADD . .
RUN CI=true yarn test &&\
  yarn lint &&\
  yarn build
