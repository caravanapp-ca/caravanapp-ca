<p align="center">
  <a href="https://caravanapp.ca">
    <img src="./packages/web/src/resources/text-logo.svg" width="318px" alt="Caravan Clubs logo" />
  </a>
</p>
<h3 align="center">Read great books. Meet cool people. Exchange big ideas.</h3>
<p align="center">Start by browsing and joining existing clubs, or by creating your own club!</p>
<br />

Caravan Clubs helps facilitate online book clubs and communities. All communication within your clubs and other channels exist on Discord. The Caravan Clubs website helps you and your buddies manage the Discord channels.

## 📖 Getting Started

This monorepo contains all of the code for the Caravan Clubs website and services. Everything you need to develop for Caravan Clubs is available here.

### 🔨 Requirements

Use [Visual Studios Code](https://code.visualstudio.com) as an IDE.
The project contains several VSCode configurations to support development including auto-formatting with [Prettier](http://prettier.io), auto-fixing with [TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint), and launch configurations.

Open the project as a VSCode Workspace: `File -> Open Workspace... -> Select caravan.code-workspace`.

Windows, MacOS, and Linux are supported (though the core team uses Mac).

The current approach to development involves using Docker with `docker-compose` to host a MongoDB 4.x server.
Then, use your host machine to run both the Node.js Express app server and the React website.

- Docker >= 18.06.0 (support for `docker-compose v3.7`)
- Yarn >= v1 (support for Workspaces)
- Node.js >= 12.x (10.x is required for the `cloud-functions` sub-project, so we suggest to use [NVM](https://github.com/nvm-sh/nvm) if you're working with `cloud-functions`)

### ⏳ Installation

#### MongoDB with Docker

Open the terminal relative to the root of the project and run:

```bash
docker-compose up
```

#### Node.js Express app server

There's three ways to run the app server (in order of personal preference):

_With breakpoint support_

Open the terminal relative to the root of the project and run:

```bash
cd packages/web-api
yarn dev:watch
```

_Without breakpoint support_

Open the terminal relative to the root of the project and run:

```bash
cd packages/web-api
yarn dev
```

_Using docker-compose_

If you prefer to run the Express server in Docker you can un-commenting out the appropriate section in `docker-compose.yml`.
This option is not recommended if you do development on the host machine.

#### Caravan Website

Open the terminal relative to the root of the project and run:

```bash
cd packages/web
yarn start
```

Visit the website at [`http://localhost:3000`](http://localhost:3000) and voilà, you're done!

#### ❗️ Logging in while in development

There's a known inconvenience while developing.
Upon authenticating with Discord, you will be taken to `http://localhost:3001/?state=SomeRandomSecretToken=`.
You must manually change the port from `3001` to `3000` in your browser,
i.e.: `http://localhost:3000/?state=SomeRandomSecretToken=`.
You should then be logged in. If you're still not logged in, try refreshing and logging in again.

## 🤓 Community Support

For general help using or developing Caravan Clubs, you can use one of these channels to ask a question:

- [GitHub](https://github.com/caravanapp-ca/caravanapp-ca)
- [Sign up to Caravan Clubs by joining the Discord](https://discord.com/oauth2/authorize?client_id=592781980026798120&redirect_uri=https%3A%2F%2Fcaravanapp.ca%2Fapi%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=email%20identify%20guilds.join%20gdm.join&state=WzE2NiwyMjAsODAsMTEzLDgyLDE5OCwzNywyNTJd) and chat there.

## 🚓 Security

If you have found a security issue, please refer to the [security guidelines](SECURITY.md).

## 📓 License

[MIT License](LICENSE.md) Copyright (c) 2020 [1aravan Clubs](https://caravanapp.ca)
