import { FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';

const deleteSession: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:sessionId',
    method: 'DELETE',
    schema: {
      tags: ['session'],
      description: 'Delete session',
      params: Object({ sessionId: String({ format: 'uuid' }) }),
      response: {
        200: { $ref: 'message' },
        404: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        await app.sessionService.deleteSession(request.params.sessionId);

        return reply.code(200).send({ message: 'success' });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { deleteSession };
