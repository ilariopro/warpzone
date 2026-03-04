import { FastifyPluginAsyncTypebox, Partial, String, Type } from '@fastify/type-provider-typebox';
import { Match } from '@warpzone/shared-schemas';

const updateMatch: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:matchId',
    method: 'PATCH',
    schema: {
      tags: ['match'],
      description: 'Update match',
      body: Partial(Match),
      params: Type.Object({ matchId: String({ format: 'uuid' }) }),
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
        await app.matchService.updateMatch(request.params.matchId, request.body);

        return reply.code(200).send({ message: 'success' });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { updateMatch };
