import { FastifyPluginAsyncTypebox, String } from '@fastify/type-provider-typebox';
import { Session } from '@warpzone/shared-schemas';

const createSession: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/',
    method: 'POST',
    schema: {
      tags: ['session'],
      description: 'Create session',
      body: Session,
      response: {
        201: { sessionId: String({ format: 'uuid' }) },
        400: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const sessionId = await app.sessionService.createSession(request.body);

        return reply.code(201).send({ sessionId });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { createSession };
