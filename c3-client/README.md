# C3Client

- Install required dependencies: `npm install`
- Start the project `npm start` 

# Build desktop standalone

Currently only Windows build on Windows machine

Build steps (to do: wrap this in an npm script):
- Build angular app (will generate `angular-build` folder)
  - `npm run build`
- Compile electron app script:
  - `npx tsc -p tsconfig.electron.json`
- Build electron app (will create `dist` folder):
  - `npm exec electron-builder`

