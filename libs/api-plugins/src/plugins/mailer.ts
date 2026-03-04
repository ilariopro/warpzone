import { FastifyPluginAsync } from 'fastify';
import { createTransport } from 'nodemailer';
import SMTPTransport = require('nodemailer/lib/smtp-transport');

type Email = {
  subject: string;
  from: string;
  to: string;
  //   to: string[];
  bcc?: string[];
  cc?: string[];
  html?: string;
};

type MailerOpts = { config: SMTPTransport.Options };

const mailer: FastifyPluginAsync<MailerOpts> = async (app, opts) => {
  const logger = app.log.child({ _context: 'mailer' });
  const transporter = createTransport(opts.config);

  const sendMail = async (email: Email) => {
    logger.info(`Sending mail to: ${email.to}`);

    transporter.sendMail(email, (error, info) => {
      if (error) {
        logger.error(error);
      } else {
        logger.info(`Email sent: ${info.response}`);
      }
    });
  };

  app.decorate('mailer', {
    sendMail,
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    mailer: {
      sendMail: (email: Email) => Promise<void>;
    };
  }
}

export { mailer, Email, MailerOpts };
