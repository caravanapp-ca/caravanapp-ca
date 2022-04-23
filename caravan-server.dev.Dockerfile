# Build with: `docker build -f ./caravan-server.Dockerfile -t "caravan-server" .`
# Run with: `docker run -d -p 3001:3001 -p 27017:27017 --name caravan-server caravan-server:latest`
FROM node:16-alpine as caravan-server-base

# All node-based packages have the node user "disabled" by default. We will want to run
# our node process with that user instead of the root user (which has elevated privileges).
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app
WORKDIR /usr/src/app

# Now that we have changed the user, we cannot run root-level privileges.
# If you need root-level privileges for a command, run them before this line.
# For example, npm i -g <package_name> will require root privileges.
USER node

COPY --chown=node:node lerna.json package.json yarn.lock ./
COPY --chown=node:node ./packages/types/package.json ./packages/types/
COPY --chown=node:node ./packages/mongo/package.json ./packages/mongo/
COPY --chown=node:node ./packages/web-api/package.json ./packages/web-api/
RUN yarn install

FROM caravan-server-base as caravan-server-build

# Bundle the source code.
# Note, this can be improved by reducing the amount that's copied to increase caching and reduce layer size.
COPY --chown=node:node ./packages/types/ ./packages/types/
COPY --chown=node:node ./packages/mongo/ ./packages/mongo/
COPY --chown=node:node ./packages/web-api/ ./packages/web-api/

WORKDIR /usr/src/app/packages/web-api

EXPOSE 3001

CMD ["yarn", "dev"]
