import { FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';

const deletePlayer: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:playerId',
    method: 'DELETE',
    schema: {
      tags: ['player'],
      description: 'Delete player',
      params: Object({ playerId: String({ format: 'uuid' }) }),
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
        await app.playerService.deletePlayer(request.params.playerId);

        return reply.code(200).send({ message: 'success' });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { deletePlayer };
