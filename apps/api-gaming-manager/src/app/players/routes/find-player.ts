import { FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';
import { Player } from '@warpzone/shared-schemas';

const findPlayer: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:playerId',
    method: 'GET',
    schema: {
      tags: ['player'],
      description: 'Find player',
      params: Object({ playerId: String({ format: 'uuid' }) }),
      response: {
        200: { player: Player },
        404: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const player = await app.playerService.findPlayer(request.params.playerId);

        return reply.code(200).send({ player });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { findPlayer };
