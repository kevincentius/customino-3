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

