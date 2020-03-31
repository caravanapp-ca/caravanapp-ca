# Build with: `docker build -f ./caravan-web.Dockerfile -t "caravan-web" .`
# Run with: `docker run -d -p 3000:3000--name caravan-web caravan-web:latest`
FROM node:12-alpine as caravan-web-base

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
COPY --chown=node:node ./packages/web/package.json ./packages/web/
RUN CI=true yarn install --frozen-lockfile

FROM caravan-web-base as caravan-web-build

WORKDIR /usr/src/app

# Bundle the source code.
# Note, this can be improved by reducing the amount that's copied to increase caching and reduce layer size.
COPY --chown=node:node ./packages/types/ ./packages/types/
COPY --chown=node:node ./packages/web/ ./packages/web/

WORKDIR /usr/src/app/packages/web

EXPOSE 3000

CMD ["yarn", "start"]
