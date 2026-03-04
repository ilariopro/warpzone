import { FastifyPluginAsync } from 'fastify';
import { Game, GameQuery } from '@warpzone/shared-schemas';
import { utcDate } from '@warpzone/shared-utils';

type GameService = {
  canAccessToGame: (gameId: string, administratorId: string) => Promise<boolean>;
  findGame: (gameId: string) => Promise<Game>;
  filterGames: (queryOptions: GameQuery) => Promise<Game[]>;
};

const gameService: FastifyPluginAsync = async (app) => {
  app.decorate<GameService>('gameService', {
    canAccessToGame: async (gameId, administratorId) => {
      const administrator = await app.administratorService.findAdministrator(administratorId);
      const organizationGames = await app.organizationService.getOrganizationGames(
        administrator.organizationId
      );

      return organizationGames.some(
        (og) => og.id === gameId && (og.activeUntil ? og.activeUntil >= utcDate() : true)
      );
    },
    findGame: async (gameId) => {
      const game = await app.gameRepository.findGame(gameId);

      if (!game) {
        throw app.httpErrors.notFound('Game not found');
      }

      return game;
    },
    filterGames: async (queryOptions) => {
      return await app.gameRepository.filterGames(queryOptions);
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    gameService: GameService;
  }
}

export { gameService };
