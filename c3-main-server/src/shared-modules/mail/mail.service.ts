import { Injectable } from '@nestjs/common';
import { config } from 'config/config';
import nodemailer from "nodemailer";

@Injectable()
export class MailService {
  async sendEmailConfirmation(email: string, name: string, emailConfirmCode: string) {
    await this.sendEmail({
      to: email,
      subject: "Customino email confirmation",
      text: `Greetings from Customino the game! If you are ${name}, please open the following link to confirm your email address: ${config.clientUrl}/email-confirmation?emailCode=${emailConfirmCode}. Cheers!`,
      html: `Greetings from Customino the game! If you are <b>${name}</b>, please open the following link to confirm your email address: ${config.clientUrl}/email-confirmation?emailCode=${emailConfirmCode}. Cheers!`,
    });
  }

  async sendPasswordReset(email: string, username: string, passwordResetCode: string) {
    await this.sendEmail({
      to: email,
      subject: 'Customino password reset',
      text: `Hi ${username}, someone initiated a password reset for your account. If it was you, the following link should let you create a new password: ${config.clientUrl}?passwordResetCode=${passwordResetCode}. This link will only be valid for a limited time. Cheers!`,
      html: `Hi <b>${username}</b>, someone initiated a password reset for your account. If it was you, the following link should let you create a new password: ${config.clientUrl}?passwordResetCode=${passwordResetCode}. This link will only be valid for a limited time. Cheers!`,
    });
  }

  private async sendEmail(mail: { to: string; subject: string; text: string; html: string; }) {
    try {
      const transport = nodemailer.createTransport(config.mailTransportOptions);
      await transport.sendMail(mail);
    } catch (error: any) {
      console.error(error);
    }
  }
}
