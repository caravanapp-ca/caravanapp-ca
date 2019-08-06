# Dockerfile
FROM node:10-alpine
WORKDIR /app
ADD package.json yarn.lock ./
RUN yarn install
ADD . .
RUN yarn bootstrap
RUN CI=true yarn test
RUN yarn lint
RUN yarn build
