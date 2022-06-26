
# Project setup

## Install required softwares

Please choose LTS versions and make sure the softwares are included in your PATH variable.

- **node.js** - https://nodejs.org/en/download (just click next, no need to select any option)
- **Postgres** - https://www.postgresql.org/download
  - During installation, please use `password` literally as your password for the postgres user!
    - otherwise you will have to define `DATABASE_URL` in your environment variable - for example `postgres://YourUsernameHere:YourPasswordHere@localhost:5432/dev-c3`
  - Create a database called `dev-c3`. You can use an SQL client or CLI as follows:
    - `psql -U postgres`
    - (enter password)
    - `create database dev-c3;`

- **Java** (required for OpenAPI, not runtime dependency) - https://www.java.com/en/download

## Recommended
- Install **Visual Studio Code** - https://code.visualstudio.com/Download
- Install these extensions from within Visual Studio Code:
  - Angular Language Service
  - SonarLint

## Next steps

- Clone the repository
- Follow the "Project Setup" section in the README in each of the subprojects in the following order:
  - c3-main-server
  - c3-game-server
  - c3-client

- When all projects are started, a debug page can be opened at http://localhost:4200/debug


# Links

Live app: https://customino.netlify.app

Github: https://github.com/kevincentius/minimino/issues

Heroku (main server): https://dashboard.heroku.com/apps/customino/logs

Heroku (game server): https://dashboard.heroku.com/apps/customino-game-server/logs

Netlify (client): https://app.netlify.com/sites/customino/deploys


