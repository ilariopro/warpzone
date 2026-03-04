import { FastifyPluginAsyncTypebox, String } from '@fastify/type-provider-typebox';
import { Player } from '@warpzone/shared-schemas';

const createPlayer: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/',
    method: 'POST',
    schema: {
      tags: ['player'],
      description: 'Create player',
      body: Player,
      response: {
        201: { playerId: String({ format: 'uuid' }) },
        400: { $ref: 'message' },
        409: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const playerId = await app.playerService.createPlayer(request.body);

        return reply.code(201).send({ playerId });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { createPlayer };
