
export const config = {
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:password@localhost:5432/dev-c3',
  clientUrl: process.env.DEPLOYMENT == 'LIVE' ? 'https://customino.netlify.app' : 'http://localhost:4200',
  gameServerUrl: process.env.DEPLOYMENT == 'LIVE' ? 'https://customino-game-server.herokuapp.com' : 'http://localhost:3001',
}
