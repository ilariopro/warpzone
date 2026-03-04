import { Array, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Game, GameQuery } from '@warpzone/shared-schemas';

const filterGames: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/',
    method: 'GET',
    schema: {
      tags: ['game'],
      description: 'List and filter games',
      querystring: GameQuery,
      response: {
        200: { games: Array(Game) },
        400: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const games = await app.gameService.filterGames(request.query);

        return reply.code(200).send({ games });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { filterGames };
