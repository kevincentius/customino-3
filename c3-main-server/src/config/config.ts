
export const config = {
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:password@localhost:5432/dev-c3',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:4200',
  gameServerUrl: process.env.GAME_SERVER_URL ?? 'http://localhost:3001',
}
