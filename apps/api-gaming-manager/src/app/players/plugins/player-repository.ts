import { FastifyPluginAsync } from 'fastify';
import { Player, PlayerQuery } from '@warpzone/shared-schemas';
import { isNullOrEmpty, removeNullable } from '@warpzone/shared-utils';

type PlayerRepository = {
  countPlayers: (queryOptions: PlayerQuery) => Promise<{ count: number }>;
  createPlayer: (player: Player) => Promise<void>;
  deletePlayer: (playerId: string) => Promise<void>;
  filterPlayers: (queryOptions: PlayerQuery) => Promise<Player[]>;
  findPlayer: (playerId: string) => Promise<Player | null>;
  updatePlayer: (player: Player) => Promise<void>;
};

const playerRepository: FastifyPluginAsync = async (app) => {
  app.decorate<PlayerRepository>('playerRepository', {
    countPlayers: async (queryOptions) => {
      return await app.knex
        .count('* as count')
        .from('player')
        .modify((query) => {
          if (queryOptions.organizationId) {
            query.where('organizationId', queryOptions.organizationId);
          }

          return query;
        })
        .first();
    },
    createPlayer: async (player) => {
      await app.knex.insert(player).into('player');
    },
    deletePlayer: async (playerId) => {
      await app.knex.from('player').where('id', playerId).del();
    },
    filterPlayers: async (queryOptions) => {
      const [column, order] = queryOptions.order.split(' ');

      const players = await app.knex
        .select('*')
        .from('player')
        .orderBy([
          { column, order },
          { column: 'id', order },
        ])
        .modify((query) => {
          if (queryOptions.organizationId) {
            query.where('organizationId', queryOptions.organizationId);
          }

          if (queryOptions.search) {
            query.whereILike('email', `%${queryOptions.search}%`);
          }

          return query;
        })
        .offset(queryOptions.page)
        .limit(queryOptions.pageSize);

      return players.map((player: Player) => removeNullable(player));
    },
    findPlayer: async (playerId) => {
      const organization = await app.knex.select('*').from('player').where('id', playerId).first();

      if (isNullOrEmpty(organization)) {
        return null;
      }

      return removeNullable(organization);
    },
    updatePlayer: async (player) => {
      await app.knex.from('player').update(player).where('id', player.id);
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    playerRepository: PlayerRepository;
  }
}

export { playerRepository };
