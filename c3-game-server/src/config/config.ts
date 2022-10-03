
if (process.env.DEPLOYMENT == 'LIVE') {
  if (!process.env.JWT_SECRET) {
    throw new Error('Required variable JWT_SECRET is missing.');
  } else if (!process.env.CLIENT_URL) {
    throw new Error('Required variable CLIENT_URL is missing.');
  } else if (!process.env.MAIN_SERVER_URL) {
    throw new Error('Required variable MAIN_SERVER_URL is missing.');
  }
}

export const config = {
  webSocketGatewayOptions: {
    cors: {
      origin: [
        process.env.CLIENT_URL ?? 'http://localhost:4200',
      ],
      credentials: true,
    }
  },
  jwtConstants: {
    secret: process.env.JWT_SECRET ?? 'ndZ0WMJ5RzZrDMxephDAK2E4wcBntAaBq33GCmMhhRXnVc3BHD2ZhmOMTWC9K6Ol',
    expiresIn: '60s'
  },
  mainServerUrl: process.env.MAIN_SERVER_URL ?? 'http://localhost:3000',
}
