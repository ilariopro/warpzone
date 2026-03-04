import fastify from 'fastify';
import { configDotenv } from 'dotenv';
import { loggerConfig } from '@warpzone/shared-utils';
import { app } from './app/app';
import { environment, applicationHost, applicationPort, corsOrigins } from './app/config';

configDotenv();

const server = fastify({
  ajv: {
    customOptions: { coerceTypes: 'array' },
  },
  disableRequestLogging: true, // false for debugging
  ignoreTrailingSlash: true,
  logger: loggerConfig({ environment }),
});

const main = async () => {
  try {
    await server.register(app);
    await server.ready();

    await server.listen({
      host: applicationHost,
      port: applicationPort,
    });
  } catch (err) {
    server.log.fatal(err);

    process.exit(1);
  }
};

main();
