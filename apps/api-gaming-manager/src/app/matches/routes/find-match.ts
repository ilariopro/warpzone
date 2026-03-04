import { FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';
import { Match } from '@warpzone/shared-schemas';

const findMatch: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:matchId',
    method: 'GET',
    schema: {
      tags: ['match'],
      description: 'Find match',
      params: Object({ matchId: String({ format: 'uuid' }) }),
      response: {
        200: { match: Match },
        404: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const match = await app.matchService.findMatch(request.params.matchId);

        return reply.code(200).send({ match });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { findMatch };
