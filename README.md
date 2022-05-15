
# Portal

Live app: https://poc-c3-client.netlify.app

Github: https://github.com/Cultris-3/monorepo

Heroku (main server): https://dashboard.heroku.com/apps/poc-c3-main-server/logs

Heroku (game server): https://dashboard.heroku.com/apps/poc-c3-game-server/logs

Netlify (client): https://app.netlify.com/sites/poc-c3-client/deploys



# Project Setup

### Steps
- Install node.js LTS version - https://nodejs.org/en/download
- Install postgres - https://www.postgresql.org/download
  - Create a database called `dev-c3`
- In each of the sub-projects, run `npm install` to download dependencies
- In each of the sub-projects, run `npm start` to start them

### Testing
- Angular client will be served at http://localhost:4200
- Main server will be served at http://localhost:3000
- Game server will be served at http://localhost:3001

### Recommendation
- Visual Studio Code - https://code.visualstudio.com/Download
- ... with the following extensions:
  - Angular Language Service
  - SonarLint



# Main Server Heroku Deployment

The `heroku-main-server` branch contains deploy config for the main server on Heroku. This branch must be pushed to the specific Heroku App's master branch for deployment.

### Deploy steps

- merge into the `heroku-main-server` branch
- `git checkout heroku-main-server`
- `git pull`
- `heroku git:remote -a poc-c3-main-server`
- `heroku stack:set container -a poc-c3-main-server`
- `git push heroku heroku-main-server:master`
- switch back to your branch (don't commit anything in the heroku branch)

These steps can be replaced with branch deployments later when Heroku fixes their github security bug...

### Required config vars in Heroku:

- DEPLOYMENT = LIVE
- GAME_SERVER_URL = (link to the game server, e.g. `https://poc-c3-game-server.herokuapp.com`)



# Game Server Heroku Deployment

Same thing as for main server. Branch is `heroku-game-server`.

### Deploy steps

- merge into the `heroku-game-server` branch
- `git checkout heroku-game-server`
- `git pull`
- `heroku git:remote -a poc-c3-game-server`
- `heroku stack:set container -a poc-c3-game-server`
- `git push heroku heroku-game-server:master`
- switch back to your branch (don't commit anything in the heroku branch)

### Required config vars in Heroku:

- DEPLOYMENT = LIVE

# Client Netlify Deployment

Netlify is setup to publish the master branch, but automatic deployment is disabled to save build quota. Deployment must be triggered manually from the Netlify website - https://app.netlify.com/sites/poc-c3-client/deploys
