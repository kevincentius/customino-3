
Hint: on VS Code, press Ctrl+Shift+V to open this README in Preview Mode.

# Portal

Live app: 

Github: https://github.com/Cultris-3/monorepo

Main Server Heroku: https://dashboard.heroku.com/apps/poc-c3-main-server

Game Server Heroku: https://dashboard.heroku.com/apps/poc-c3-game-server

Web Client Netlify: https://app.netlify.com/sites/poc-c3-client/deploys

# Project Setup

## Hints
- Suggested IDE - Visual Studio Code - https://code.visualstudio.com/Download
- If using VS Code, install the following extensions:
  - Angular Language Service
  - SonarLint
- Find out early how to open terminal using the IDE (Ctrl+` for VS Code on Windows)
- I recommend opening each sub-project in a separate IDE window

## Actual setup steps
- Install node.js LTS version - https://nodejs.org/en/download
- Install postgres - https://www.postgresql.org/download
- In each of the sub-projects, run `npm install` (this will download required libraries)
- Run `npm start` in each sub-project to start them

## Additional tools
- SQL client may be needed for backend devs, e.g. pgAdmin: https://www.pgadmin.org
  - Hint: production database credentials will be periodically changed by Heroku

# Main Server Heroku Deployment

The `heroku-main-server` branch contains deploy config for the main server on Heroku. This branch must be pushed to the specific Heroku App's master branch for deployment.

## Deploy steps

- merge into the `heroku-main-server` branch
- `git checkout heroku-main-server`
- `heroku git:remote -a poc-c3-main-server`
- `heroku stack:set container -a poc-c3-main-server`
- `git push heroku heroku-main-server:master`
- switch back to your branch (don't commit anything in the heroku branch)

These steps can be replaced with branch deployments later when Heroku fixes their github security bug...

## Required config vars in Heroku:

- DEPLOYMENT = LIVE
- GAME_SERVER_URL = (link to the game server, e.g. `https://poc-c3-game-server.herokuapp.com`)

# Game Server Heroku Deployment

Same thing as for main server. Branch is `heroku-game-server`.

## Deploy steps

- merge into the `heroku-game-server` branch
- `git checkout heroku-game-server`
- `heroku git:remote -a poc-c3-game-server`
- `heroku stack:set container -a poc-c3-game-server`
- `git push heroku heroku-game-server:master`
- switch back to your branch (don't commit anything in the heroku branch)

## Required config vars in Heroku:

- DEPLOYMENT = LIVE

# Client Netlify Deployment

Netlify is setup to publish the master branch, but automatic deployment is disabled to save build quota. Deployment must be triggered manually from the Netlify website.
