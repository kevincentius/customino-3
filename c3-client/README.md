# C3Client

- Install required dependencies: `npm install`
- Start the project `npm start` 

# Build desktop standalone

Currently only tested on Windows (will build for Windows on Windows). Should build for Mac on Mac, or for Linux on Linux, but completely untested.

Build steps:
- Build angular app (will generate `angular-build` folder)
  - `npm run build`
- Compile electron app script:
  - `npx tsc -p tsconfig.electron.json`
- Build electron app (will create `dist` folder):
  - `npm exec electron-builder`

