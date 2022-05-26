# Project setup

- Install required dependencies: `npm install`
- Start the project: `npm start`



# More information

## Game server Heroku deployment

Same thing as for main server (see the README there for more info). Branch is `heroku-game-server`.

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
