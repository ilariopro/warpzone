import { FastifyPluginAsync } from 'fastify';
import { Metadata, Player, PlayerQuery } from '@warpzone/shared-schemas';
import { utcDate, uuid } from '@warpzone/shared-utils';
import { defaultPagination } from '../../config';

type PlayerService = {
  createPlayer: (data: Player) => Promise<string>;
  deletePlayer: (playerId: string) => Promise<void>;
  filterPlayers: (queryOptions: PlayerQuery) => Promise<[Player[], Metadata]>;
  findPlayer: (playerId: string) => Promise<Player>;
  updatePlayer: (playerId: string, data: Partial<Player>) => Promise<void>;
};

const playerService: FastifyPluginAsync = async (app) => {
  app.decorate<PlayerService>('playerService', {
    createPlayer: async (data) => {
      try {
        const playerId = uuid();

        await app.playerRepository.createPlayer({
          ...data,
          id: playerId,
          createdAt: utcDate(),
        });

        return playerId;
      } catch (error) {
        if ('code' in error && error.code === 'ER_DUP_ENTRY') {
          throw app.httpErrors.conflict('Player already exists');
        }

        throw app.httpErrors.internalServerError(error.message);
      }
    },
    deletePlayer: async (playerId) => {
      const player = await app.playerService.findPlayer(playerId);

      if (player) {
        await app.playerRepository.deletePlayer(playerId);
      }
    },
    filterPlayers: async (queryOptions) => {
      const order = queryOptions.order ?? 'createdAt desc';
      const pageSize = queryOptions.pageSize ?? defaultPagination;
      const page = queryOptions.page ? (queryOptions.page - 1) * pageSize : 0;
      const total = await app.playerRepository.countPlayers(queryOptions);
      const totalPages = Math.ceil(total.count / pageSize);

      const players = await app.playerRepository.filterPlayers({ ...queryOptions, order, page, pageSize });

      const meta = {
        count: players.length,
        page: queryOptions.page,
        pageSize,
        total: total.count,
        totalPages,
      };

      return [players, meta];
    },
    findPlayer: async (playerId) => {
      const player = await app.playerRepository.findPlayer(playerId);

      if (!player) {
        throw app.httpErrors.notFound('Player not found');
      }

      return player;
    },
    updatePlayer: async (playerId, data) => {
      try {
        const player = await app.playerService.findPlayer(playerId);

        await app.playerRepository.updatePlayer({
          ...player,
          ...data,
          id: playerId,
          organizationId: player.organizationId,
          createdAt: player.createdAt,
          updatedAt: utcDate(),
        });
      } catch (error) {
        if ('code' in error && error.code === 'ER_DUP_ENTRY') {
          throw app.httpErrors.conflict('Player already exists');
        }

        throw app.httpErrors.internalServerError(error.message);
      }
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    playerService: PlayerService;
  }
}

export { playerService };
