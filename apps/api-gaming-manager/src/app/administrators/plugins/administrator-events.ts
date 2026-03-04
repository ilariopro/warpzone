import { FastifyPluginAsync } from 'fastify';
import { Email } from '@warpzone/api-plugins';
import { createEventEmitter, TypedEventEmitter } from '@warpzone/shared-utils';
import { defaultBcc, defaultFrom } from '../../config';

type AdministratorEvents = {
  administratorCreated: (data: Partial<Email>) => Promise<void>;
  administratorChangePassword: (userId: string) => Promise<void>;
};

const administratorEvents: FastifyPluginAsync = async (app) => {
  const logger = app.log.child({ _context: 'administratorEvents' });

  app.decorate('administratorEvents', createEventEmitter<AdministratorEvents>());

  app.administratorEvents.on('administratorCreated', async (data: Partial<Email>) => {
    try {
      await app.mailer.sendMail({
        bcc: [...defaultBcc],
        from: defaultFrom,
        to: data.to,
        subject: 'Welcome to Warp Zone!',
      });
    } catch (error) {
      logger.error({ error });
    }
  });

  app.administratorEvents.on('administratorChangePassword', async (userId: string) => {
    try {
      await app.authService.purgeToken(userId);

      await app.authService.createTokens(userId);
    } catch (error) {
      logger.error({ error });
    }
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    administratorEvents: TypedEventEmitter<AdministratorEvents>;
  }
}

export { administratorEvents };
