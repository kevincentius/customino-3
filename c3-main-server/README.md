# Project setup

- Install required dependencies: `npm install`
- Initialize database tables: `npm run-script reset-database`
- Start the project: `npm start`
- If the server is running properly, a JSON should be served here: http://localhost:3000/api/debug/test

# More information

## Database scripts

All necessary SQL scripts must be kept in `src/db-script`. In live environment, the scripts must be copied and run manually. For local development purposes, these scripts can be used to reset the database to a functioning state:

- `npm run-script reset-database`



## Heroku deployment

The `heroku-main-server` branch contains deploy config for the main server on Heroku. This branch must be pushed to the specific Heroku App's master branch for deployment.

### First time configuration

- create new app
- connect to git and enable auto deploy master branch
- set config vars (see below)
- add Heroku Postgres add-on
- run scripts in src/db-script manually on the live database
- set to container stack:
  - `heroku stack:set container -a customino-main-server`

### Required config vars in Heroku:

- DEPLOYMENT = LIVE
- GAME_SERVER_URL = (link to the game server, e.g. `https://customino-game-server.herokuapp.com`)
- CLIENT_URL = (link to the game server, e.g. `https://customino.netlify.app`)
- JWT_SECRET = a secret string that should be shared with the Game Server.
- GMAIL_ADDRESS = noreply gmail account
- GMAIL_APP_PASSWORD = noreplay gmail app password (must create one in google cloud)

### Manual deploy steps (not needed if heroku is connected to github)

- merge into the `heroku-main-server` branch
- `git checkout heroku-main-server`
- `git pull`
- `heroku git:remote -a customino-main-server`
- `heroku stack:set container -a customino-main-server`
- `git push heroku heroku-main-server:master`
- switch back to your branch (don't commit anything in the heroku branch)

These steps can be replaced with branch deployments later when Heroku fixes their github security bug...
