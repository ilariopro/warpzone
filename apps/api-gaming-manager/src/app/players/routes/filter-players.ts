import { Array, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Player, PlayerQuery, Metadata } from '@warpzone/shared-schemas';

const filterPlayers: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/',
    method: 'GET',
    schema: {
      tags: ['player'],
      description: 'List and filter players',
      querystring: PlayerQuery,
      response: {
        200: { players: Array(Player), meta: Metadata },
        400: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const [players, meta] = await app.playerService.filterPlayers(request.query);

        return reply.code(200).send({ players, meta });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { filterPlayers };
