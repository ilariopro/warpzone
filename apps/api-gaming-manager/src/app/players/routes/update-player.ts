import { FastifyPluginAsyncTypebox, Object, Partial, String } from '@fastify/type-provider-typebox';
import { Player } from '@warpzone/shared-schemas';

const updatePlayer: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:playerId',
    method: 'PATCH',
    schema: {
      tags: ['player'],
      description: 'Update player',
      body: Partial(Player),
      params: Object({ playerId: String({ format: 'uuid' }) }),
      response: {
        200: { $ref: 'message' },
        400: { $ref: 'message' },
        404: { $ref: 'message' },
        409: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        await app.playerService.updatePlayer(request.params.playerId, request.body);

        return reply.code(200).send({ message: 'success' });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { updatePlayer };
