import { jwtDecode } from 'jwt-decode';
import { FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';
import { Game } from '@warpzone/shared-schemas';

const findGame: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:gameId',
    method: 'GET',
    schema: {
      tags: ['game'],
      description: 'Find game',
      params: Object({ gameId: String() }),
      response: {
        200: { game: Game },
        403: { $ref: 'message' },
        404: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const gameId = request.params.gameId;
        const administratorId = jwtDecode(request.headers.authorization.split(' ').pop()).sub;
        const canAccessToGame = await app.gameService.canAccessToGame(gameId, administratorId);

        if (!canAccessToGame) {
          throw app.httpErrors.forbidden('Game access not allowed');
        }

        const game = await app.gameService.findGame(gameId);

        return reply.code(200).send({ game });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { findGame };
