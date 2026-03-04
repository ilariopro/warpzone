import { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { jwtAuth, errorHandler, knex, mailer, openApi, security } from '@warpzone/api-plugins';
import { knexConfig } from '../database/knexfile';
import { administrators } from './administrators';
import { auth } from './auth';
import { campaigns } from './campaigns';
import { games } from './games';
import { matches } from './matches';
import { organizations } from './organizations';
import { players } from './players';
import { sessions } from './sessions';
import {
  applicationName,
  applicationVersion,
  cookieSecret,
  corsOrigins,
  cryptoSalt,
  environment,
  jwtExpiration,
  jwtSecret,
  mailerEncryption,
  mailerHost,
  mailerPassword,
  mailerPort,
  mailerUsername,
} from './config';

const app: FastifyPluginAsync = async (app) => {
  await app.register(fastifyPlugin(errorHandler), {
    debug: environment === 'development',
  });

  await app.register(fastifyPlugin(security), {
    cookieSecret,
    corsOrigins,
    cryptoSalt,
  });

  await app.register(fastifyPlugin(jwtAuth), {
    expiration: jwtExpiration,
    secret: jwtSecret,
  });

  await app.register(fastifyPlugin(openApi), {
    title: applicationName,
    version: applicationVersion,
  });

  await app.register(fastifyPlugin(knex), {
    config: knexConfig,
  });

  await app.register(fastifyPlugin(mailer), {
    config: {
      auth: {
        user: mailerUsername,
        pass: mailerPassword,
      },
      host: mailerHost,
      port: mailerPort,
      secure: mailerEncryption,
    },
  });

  app.route({
    url: '/',
    method: 'GET',
    schema: {
      description: 'Return the application name',
      response: {
        200: { $ref: 'message' },
      },
    },
    handler: async (request, reply) => reply.code(200).send({ message: applicationName }),
  });

  await app.register(fastifyPlugin(administrators));
  await app.register(fastifyPlugin(auth));
  await app.register(fastifyPlugin(campaigns));
  await app.register(fastifyPlugin(games));
  await app.register(fastifyPlugin(matches));
  await app.register(fastifyPlugin(organizations));
  await app.register(fastifyPlugin(players));
  await app.register(fastifyPlugin(sessions));
};

export { app };
