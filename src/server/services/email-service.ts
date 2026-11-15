import { SmtpConfiguration } from "@/server/configuration/smtp-configuration";
import nodemailer, { Transporter } from "nodemailer";

export class EmailService {
   private readonly smtpConfiguration: SmtpConfiguration;
   private readonly transporter: Transporter;

   constructor(smtpConfiguration: SmtpConfiguration) {
      this.smtpConfiguration = smtpConfiguration;

      // Port 587 starts as plain SMTP and upgrades with STARTTLS. Implicit TLS
      // (secure: true) is for port 465. Opening TLS immediately on 587 makes
      // OpenSSL fail with "wrong version number".
      const implicitTls = this.smtpConfiguration.secure && this.smtpConfiguration.port !== 587;

      this.transporter = nodemailer.createTransport({
         host: this.smtpConfiguration.host,
         port: this.smtpConfiguration.port,
         secure: implicitTls,
         requireTLS: this.smtpConfiguration.secure && !implicitTls,
         ...(this.smtpConfiguration.anonymousAuth ? {} : { auth: this.smtpConfiguration.auth }),
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
