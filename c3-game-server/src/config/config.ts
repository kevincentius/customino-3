
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
}
