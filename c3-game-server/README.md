# Project setup

- Install required dependencies: `npm install`
- Start the project: `npm start`

# Open API

Whenever the Backend API in the main server is changed, the following command should be run to update the client's generated boilerplate code:

- `npm run-script api:download-and-generate`

I have not figure out how to put the API Key header in each request done through the generated code, hence the workaround in AppGateway: here in the constructor, all generated services must be injected to set its defaultHeaders with the Api Key!.

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
- CLIENT_URL = (link to the game server, e.g. `https://customino.netlify.app`)
- JWT_SECRET = a secret string that should be shared with the Main Server.


### Manual deploy steps (not needed if heroku is connected to github)

- merge into the `heroku-game-server` branch
- `git checkout heroku-game-server`
- `git pull`
- `heroku git:remote -a customino-game-server`
- `heroku stack:set container -a customino-game-server`
- `git push heroku heroku-game-server:master`
- switch back to your branch (don't commit anything in the heroku branch)
