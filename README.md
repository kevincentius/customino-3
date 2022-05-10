
Hint: on VS Code, press Ctrl+Shift+V to open this README in Preview Mode.

# Portal

Live app: 

Github: https://github.com/Cultris-3/monorepo

Main Server Heroku: https://dashboard.heroku.com/apps/poc-c3-main-server

Game Server Heroku: https://dashboard.heroku.com/apps/poc-c3-game-server

Web Client Netlify: https://app.netlify.com/sites/poc-c3-client/deploys

# Main Server Heroku Deployment

The `heroku-main-server` branch contains deploy config for the main server on Heroku. This branch must be pushed to the specific Heroku App's master branch for deployment.

- `git checkout heroku-main-server`
- `heroku git:remote -a poc-c3-main-server`
- `heroku stack:set container -a poc-c3-main-server`
- `git push heroku heroku-main-server:master`
- switch back to your branch (don't commit anything in the heroku branch)

This step can be replaced with branch deployments later when Heroku fixes their github security bug...

Required config vars in Heroku:

- DEPLOYMENT = LIVE
- GAME_SERVER_URL = (link to the game server, e.g. `https://poc-c3-game-server.herokuapp.com`)

# Game Server Heroku Deployment

Same thing as for main server. Branch is `heroku-game-server`.

- `git checkout heroku-game-server`
- `heroku git:remote -a poc-c3-game-server`
- `heroku stack:set container -a poc-c3-game-server`
- `git push heroku heroku-game-server:master`
- switch back to your branch (don't commit anything in the heroku branch)

Required config vars in Heroku:

- DEPLOYMENT = LIVE
