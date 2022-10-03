
import { Options } from "nodemailer/lib/smtp-transport";

const mailTransportOptions: Options = {
  service: 'gmail',
  auth: {
    user: 'noreply.customino@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  }
}

export const config = {
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:password@localhost:5432/dev-c3',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:4200',
  gameServerUrl: process.env.GAME_SERVER_URL ?? 'http://localhost:3001',
  jwtConstants: {
    secret: process.env.JWT_SECRET ?? 'ndZ0WMJ5RzZrDMxephDAK2E4wcBntAaBq33GCmMhhRXnVc3BHD2ZhmOMTWC9K6Ol',
    expiresIn: '60s'
  },
  backendApiSecret: process.env.JWT_SECRET ?? 'ndZ0WMJ5RzZrDMxephDAK2E4wcBntAaBq33GCmMhhRXnVc3BHD2ZhmOMTWC9K6Ol',
  mailTransportOptions: mailTransportOptions
}
