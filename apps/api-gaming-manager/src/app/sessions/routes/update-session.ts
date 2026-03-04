import { FastifyPluginAsyncTypebox, Object, Partial, String } from '@fastify/type-provider-typebox';
import { Session } from '@warpzone/shared-schemas';

const updateSession: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:sessionId',
    method: 'PATCH',
    schema: {
      tags: ['session'],
      description: 'Update session',
      body: Partial(Session),
      params: Object({ sessionId: String({ format: 'uuid' }) }),
      response: {
        200: { $ref: 'message' },
        400: { $ref: 'message' },
        404: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        await app.sessionService.updateSession(request.params.sessionId, request.body);

        return reply.code(200).send({ message: 'success' });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { updateSession };
