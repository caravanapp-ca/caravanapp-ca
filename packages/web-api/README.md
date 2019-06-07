# @caravan/reading-buddy-web-api

## Requirements

- Node
- Yarn

For the best experience, it is strongly recommended open the workspace with VS Code.

## Setup

First, run `yarn` to download the NPM dependencies.

Next, make a copy of `env.sample` and name the copy `.env`. This will define the environment variables for the Node runtime. Modify the values of each key if necessary. For example, you can change the port to run on by specifying `PORT=5555`. The `.env` file is in the `.gitignore`, it should not be committed to Git. No secret key values should be added to `.env.sample`, as no secrets should be maintained in a Git history. If you introduce a new environment variable make sure to add it to both `.env.sample` and `.env` and communicate the change with the team to that they can modify their local `.env` accordingly.

## Running

## Development

With VS Code, you can use breakpoints in your code to enhance your debugging experience.

If you want to run with breakpoints:

```sh
yarn dev:watch
```

Then start the debugger (F5) and attach to the process: `node --require ts-node/register --inspect src/index.ts`

For more info including how to attach to a Google Chrome inspector: https://dev.to/oieduardorabelo/nodejs-with-typescript-debug-inside-vscode-and-nodemon-23o7


If you do not want to run with breakpoints:

```sh
yarn dev
```

### Production

You will typically not run these commands while you develop, this is for the production server to run.

First, you build the project with

```sh
npm run build
```

This will basically perform `rm -rf ./dist && tsc`, which cleans the `dist` directory and builds the TypeScript project, outputting to `dist`.

Next, to run the built JavaScript, run:

```sh
npm start
```
