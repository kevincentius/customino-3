# C3Client

- Install required dependencies: `npm install`
- Start the project `npm start` 

# Desktop standalone

Currently only tested on Windows (will build for Windows on Windows). Should build for Mac on Mac, or for Linux on Linux, but completely untested.

Test locally: `npm exec electron .`

Build the standalone:
- Build angular app (will build the web app in `angular-build` folder)
  - `npm run build`
- Compile electron app script:
  - `npx tsc -p tsconfig.electron.json`
- Build electron app (will build the desktop app in `dist` folder):
  - `npm exec electron-builder`

# Open API

- `npx ts-node ./src/app/main-server/download-api-spec.ts`
- `npx openapi --input ./src/app/main-server/api-spec.json --output ./src/app/main-server/generated`