# Project setup

- Install required dependencies: `npm install`
- Run the main server and the game server projects
- Generate OpenAPI: `npm run-script api:download-and-generate`
- Start the project: `npm start`
- The client will be served at http://localhost:4200

# Open API

Whenever the main server's REST API is changed (by you or someone else), the following command should be run to update the client's generated boilerplate code:

- `npm run-script api:download-and-generate`

# More information

## Client Netlify deployment

Netlify is setup to publish the master branch, but automatic deployment is disabled to save build quota. Deployment must be triggered manually from the Netlify website:

- https://app.netlify.com/sites/poc-c3-client/deploys

## Building desktop standalone app

Currently only tested on Windows (will build for Windows on Windows). Should build for Mac on Mac, or for Linux on Linux, but completely untested.

### Requirement

You have to install these packages locally, because listing them in devDependencies will cause errors on Netlify build (this may be fixable).

- `npm install -g electron`
- `npm install -g electron-builder`

### Test the electron app locally

- Build angular app (will build the web app in `angular-build` folder)
  - `npm run build`
- Run electron app locally
  - `npm exec electron .`

### Build the standalone

- Build angular app (will build the web app in `angular-build` folder)
  - `npm run build`
- Install electron temporarily (electron-builder needs to know the electron verseion, but leaving it installed will cause Netlify problem for now)
  - `npm install --save-dev electron`
- Compile electron app script:
  - `npx tsc -p tsconfig.electron.json`
- Build electron app (will build the desktop app in `dist` folder):
  - `npm exec electron-builder`
- Remove electron from devDependencies again (leaving it installed will cause Netlify problem for now)
  - `npm uninstall --save-dev electron`
