import { FastifyPluginAsync } from 'fastify';
import { fastifySensible } from '@fastify/sensible';

type ErrorHandlerOpts = { debug: boolean };

const errorHandler: FastifyPluginAsync<ErrorHandlerOpts> = async (app, opts) => {
  await app.register(fastifySensible);

  app.addHook('onError', async (request, reply, error) => app.log.error(error));

  app.setNotFoundHandler(async (request, reply) => reply.code(404).send({ message: 'Route not found' }));

  app.setErrorHandler(async (error, request, reply) => {
    if (error.statusCode && error.statusCode < 500) {
      return reply.code(error.statusCode).send({ message: error.message });
    }

    return reply.code(500).send({
      message: opts.debug ? error.message : 'Internal server error',
      trace: opts.debug ? error.stack : undefined,
    });
  });

  process.on('uncaughtException', async (error) => {
    app.log.fatal(error, 'Uncaught error, shutting down');

    await app.close();
    process.exit(1);
  });

  process.on('unhandledRejection', async (error) => {
    app.log.fatal(error, 'Unhandled rejection, shutting down');

    await app.close();
    process.exit(1);
  });

  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, async () => {
      await app.close();
      process.exit(0);
    });
  });
};

export { errorHandler, ErrorHandlerOpts };
