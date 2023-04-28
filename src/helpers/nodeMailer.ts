import { MailerService } from '@nestjs-modules/mailer';
import { RecuperarCuenta } from 'src/auth/class/RecuperarCuenta';

export class NodeMailer {

  constructor(private mailService: MailerService) {}

  async sendEmailResetPassword( toEmail:string, data:RecuperarCuenta) {
    const response = await this.mailService.sendMail({
      to:toEmail,
      from: process.env.SMTP_FROM,
      subject: 'Solicitud de recuperación de contraseña',
      template: 'reset-pass',
      context: {
        data
      } 
    });
    return response;
  }
  
}