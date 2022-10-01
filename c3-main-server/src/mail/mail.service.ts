import { Injectable } from '@nestjs/common';
import { config } from 'config/config';
import nodemailer from "nodemailer";

@Injectable()
export class MailService {
  async sendEmailConfirmation(email: string, name: string, emailConfirmCode: string) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'noreply.customino@gmail.com',
        pass: 'gsndccrdzuslqndg',
      }
    });

    const info = await transport.sendMail({
      to: email,
      subject: "Customino email confirmation",
      text: `Greetings from Customino the game! If you are ${name}, please click the following link to confirm your email address: ${config.clientUrl}/email-confirmation?emailCode=${emailConfirmCode}. Cheers!`,
    });
    console.log(info);
  }
}
