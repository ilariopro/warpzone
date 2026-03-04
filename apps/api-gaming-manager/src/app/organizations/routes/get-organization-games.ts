import { Array, FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';
import { OrganizationGame } from '@warpzone/shared-schemas';

const getOrganizationGames: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:organizationId/games',
    method: 'GET',
    schema: {
      tags: ['organization'],
      description: 'Find organization related games',
      params: Object({ organizationId: String({ format: 'uuid' }) }),
      response: {
        200: { games: Array(OrganizationGame) },
        404: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const games = await app.organizationService.getOrganizationGames(request.params.organizationId);

        return reply.code(200).send({ games });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { getOrganizationGames };
