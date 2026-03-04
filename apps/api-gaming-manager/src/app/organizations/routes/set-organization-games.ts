import { Array, FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';
import { OrganizationGame } from '@warpzone/shared-schemas';

const setOrganizationGames: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:organizationId/games',
    method: 'POST',
    schema: {
      tags: ['organization'],
      description: 'Set organization related games',
      body: Array(OrganizationGame),
      params: Object({ organizationId: String({ format: 'uuid' }) }),
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
        await app.organizationService.setOrganizationGames(request.params.organizationId, request.body);

        return reply.code(200).send({ message: 'success' });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { setOrganizationGames };
