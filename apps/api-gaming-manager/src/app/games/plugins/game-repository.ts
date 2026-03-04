import { FastifyPluginAsync } from 'fastify';
import { Game, GameQuery } from '@warpzone/shared-schemas';
import { isNullOrEmpty, removeNullable } from '@warpzone/shared-utils';

type GameRepository = {
  findGame: (gameId: string) => Promise<Game | null>;
  filterGames: (queryOptions: GameQuery) => Promise<Game[]>;
};

const gameRepository: FastifyPluginAsync = async (app) => {
  app.decorate<GameRepository>('gameRepository', {
    findGame: async (gameId) => {
      const game = await app.knex.select('*').from('game').where('id', gameId).first();

      if (isNullOrEmpty(game)) {
        return null;
      }

      return removeNullable(game);
    },
    filterGames: async (queryOptions) => {
      const games = await app.knex
        .select('*')
        .from('game')
        .orderBy([
          { column: 'createdAt', order: 'desc' },
          { column: 'id', order: 'desc' },
        ])
        .modify((query) => {
          if (queryOptions.hasScheduledSessions !== undefined) {
            query.where('hasScheduledSessions', queryOptions.hasScheduledSessions);
          }

          if (queryOptions.hasTeams !== undefined) {
            query.where('hasTeams', queryOptions.hasTeams);
          }

          return query;
        });

      return games.map((game: Game) => removeNullable(game));
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    gameRepository: GameRepository;
  }
}

export { gameRepository };
