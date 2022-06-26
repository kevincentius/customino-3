# Project setup

- Install required dependencies: `npm install`
- Start the project: `npm start`



# More information

## Game server Heroku deployment

Same thing as for main server (see the README there for more info). Branch is `heroku-game-server`.

### First time configuration

- create new app
- connect to git and enable auto deploy `master-game-server` branch
- set config vars (see below)
- set to container stack:
  - `heroku stack:set container -a customino-game-server`

### Required config vars in Heroku:

- DEPLOYMENT = LIVE
- MAIN_SERVER_URL = (link to the game server, e.g. `https://customino-main-server.herokuapp.com`)
- CLIENT_SERVER_URL = (link to the game server, e.g. `https://customino.netlify.app`)


### Manual deploy steps (not needed if heroku is connected to github)

- merge into the `heroku-game-server` branch
- `git checkout heroku-game-server`
- `git pull`
- `heroku git:remote -a customino-game-server`
- `heroku stack:set container -a customino-game-server`
- `git push heroku heroku-game-server:master`
- switch back to your branch (don't commit anything in the heroku branch)

### Required config vars in Heroku:
