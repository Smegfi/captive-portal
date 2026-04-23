import { SmtpConfiguration } from "@/server/configuration/smtp-configuration";
import nodemailer, { Transporter } from "nodemailer";

export class EmailService {
   private readonly smtpConfiguration: SmtpConfiguration;
   private readonly transporter: Transporter;

   constructor(smtpConfiguration: SmtpConfiguration) {
      this.smtpConfiguration = smtpConfiguration;

      this.transporter = nodemailer.createTransport({
         host: this.smtpConfiguration.host,
         port: this.smtpConfiguration.port,
         secure: this.smtpConfiguration.secure,
         auth: this.smtpConfiguration.auth,
      });
   }

   async sendEmail(to: string, subject: string, html: string) {
      try {
         await this.transporter.sendMail({
            from: this.smtpConfiguration.from,
            to,
            subject,
            html,
         });
      } catch (error) {
         throw new Error(`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
   }

   async verifyConnection() {
      var result = await this.transporter.verify();
      return result;
   }
}
