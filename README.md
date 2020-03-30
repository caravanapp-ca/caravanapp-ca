<p align="center">
  <a href="https://caravanapp.ca">
    <img src="./packages/web/src/resources/text-logo.svg" width="318px" alt="Caravan Clubs logo" />
  </a>
</p>
<h3 align="center">Find your perfect reading buddies.</h3>
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

There are two approaches for local development, Docker or a manual installation. The Docker approach is strongly recommended due to isolation from your host environment and ease of configuration. If you are using Docker, that's all you need for development.

If you are installing all of the software manually:

- Yarn >= v1 (support for Workspaces)
- NodeJS >= 12.x (10 could work as well, but the engine in `package.json` is set as 12 for Google Cloud)
- MongoDB >= 4.x

### ⏳ Installation (docker-compose)

Using [Docker](https://www.docker.com/products/docker-desktop) with `docker-compose` is the recommended approach for local development.

```bash
docker-compose up
```

Visit [`http://localhost:3000`](http://localhost:3000) and voilà, you're done!

Underneath the hood, Docker will spin up three servers:

- MongoDB v4 with seed data
- [`create-react-app`](https://create-react-app.dev) development server with hot reloading for website development
- [`Express`](https://expressjs.com) Node.js web framework with hot reloading for the app server

#### ❗️ Logging in while in development

There's a known inconvenience while developing.
Upon authenticating with Discord, you will be taken to `http://localhost:3001/?state=SomeRandomSecretToken=`.
You must manually change the port from `3001` to `3000` in your browser,
i.e.: `http://localhost:3000/?state=SomeRandomSecretToken=`.
You should then be logged in. If you're still not logged in, try refreshing and logging in again.

### Installation (manual)

_To be completed upon request._

## 🙌 Contributing

Please read our [Contributing Guide](./CONTRIBUTING.md) before submitting a Pull Request to the project.

## 🤓 Community Support

For general help using or developing Caravan Clubs, you can use one of these channels to ask a question:

- [GitHub](https://github.com/caravanapp-ca/caravanapp-ca)
- [Sign up to Caravan Clubs by joining the Discord](https://discordapp.com/oauth2/authorize?client_id=592781980026798120&redirect_uri=https%3A%2F%2Fcaravanapp.ca%2Fapi%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=email%20identify%20guilds.join%20gdm.join&state=WzE2NiwyMjAsODAsMTEzLDgyLDE5OCwzNywyNTJd) and chat there.

## 🚓 Security

If you have found a security issue, please refer to the [security guidelines](SECURITY.md).

## 📓 License

[MIT License](LICENSE.md) Copyright (c) 2020 [Caravan Clubs](https://caravanapp.ca)
