import { FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';
import { Session } from '@warpzone/shared-schemas';

const findSession: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:sessionId',
    method: 'GET',
    schema: {
      tags: ['session'],
      description: 'Find session',
      params: Object({ sessionId: String({ format: 'uuid' }) }),
      response: {
        200: { session: Session },
        404: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const session = await app.sessionService.findSession(request.params.sessionId);

        return reply.code(200).send({ session });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { findSession };
