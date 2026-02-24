export interface SmtpConfiguration {
   /**
    * SMTP server host eg. smtp.gmail.com
    * @example "smtp.gmail.com"
    */
   host: string;

   /**
    * SMTP server port eg. 587
    * @example 587
    */
   port: number;

   /**
    * SMTP secure eg. true for TLS, false for SMTP
    * @example true
    */
   secure: boolean;

   /**
    * SMTP from address eg. "your-email@example.com"
    * @example "your-email@example.com"
    */
   from: string;

   /**
    * SMTP authentication credentials
    * @example { user: "your-email@example.com", pass: "your-password" }
    */
   auth: {
      /**
       * SMTP authentication username
       */
      user: string;
      /**
       * SMTP authentication password
       */
      pass: string;
   };
}
