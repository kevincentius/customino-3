# C3Client

- Install required dependencies: `npm install`
- Start the project `npm start` 

# Desktop standalone

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

# Open API

- `npx ts-node ./src/app/main-server/download-api-spec.ts`
- `npx openapi --input ./src/app/main-server/api-spec.json --output ./src/app/main-server/generated`