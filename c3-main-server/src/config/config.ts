
import { Options } from "nodemailer/lib/smtp-transport";

if (process.env.DEPLOYMENT == 'LIVE') {
  if (!process.env.JWT_SECRET) {
    throw new Error('Required variable JWT_SECRET is missing.');
  } else if (!process.env.CLIENT_URL) {
    throw new Error('Required variable CLIENT_URL is missing.');
  } else if (!process.env.GAME_SERVER_URL) {
    throw new Error('Required variable GAME_SERVER_URL is missing.');
  } else if (!process.env.DATABASE_URL) {
    throw new Error('Required variable DATABASE_URL is missing.');
  } else if (!process.env.GMAIL_ADDRESS) {
    throw new Error('Required variable GMAIL_ADDRESS is missing.');
  } else if (!process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Required variable GMAIL_APP_PASSWORD is missing.');
  }
}

const mailTransportOptions: Options = {
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_APP_PASSWORD,

    // accessToken: process.env.GMAIL_APP_PASSWORD,
    // clientSecret: process.env.GMAIL_APP_PASSWORD,
  }
}

export const config = {
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:password@localhost:5432/dev-c3',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:4200',
  gameServerUrl: process.env.GAME_SERVER_URL ?? 'http://localhost:3001',
  jwtConstants: {
    secret: process.env.JWT_SECRET ?? 'ndZ0WMJ5RzZrDMxephDAK2E4wcBntAaBq33GCmMhhRXnVc3BHD2ZhmOMTWC9K6Ol',
    expiresIn: '2592000s'
  },
  backendApiSecret: process.env.JWT_SECRET ?? 'ndZ0WMJ5RzZrDMxephDAK2E4wcBntAaBq33GCmMhhRXnVc3BHD2ZhmOMTWC9K6Ol',
  mailTransportOptions: mailTransportOptions
}

console.log(config);
