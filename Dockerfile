# Dockerfile
FROM node:10-alpine
WORKDIR /app
ADD . .
RUN yarn bootstrap
RUN CI=true yarn test
RUN yarn lint
RUN yarn build
