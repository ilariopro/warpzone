import { FastifyPluginAsync } from 'fastify';
import { Match, MatchQuery } from '@warpzone/shared-schemas';
import { isNullOrEmpty, removeNullable } from '@warpzone/shared-utils';

type MatchRepository = {
  countMatches: (queryOptions: MatchQuery) => Promise<{ count: number }>;
  createMatch: (match: Match) => Promise<void>;
  filterMatches: (queryOptions: MatchQuery) => Promise<Match[]>;
  findMatch: (matchId: string) => Promise<Match | null>;
  updateMatch: (match: Match) => Promise<void>;
};

const matchRepository: FastifyPluginAsync = async (app) => {
  app.decorate<MatchRepository>('matchRepository', {
    countMatches: async (queryOptions) => {
      return await app.knex
        .count('* as count')
        .from('match')
        .modify((query) => {
          if (queryOptions.playerId) {
            query.where('playerId', queryOptions.playerId);
          }

          if (queryOptions.sessionId) {
            query.where('sessionId', queryOptions.sessionId);
          }

          return query;
        })
        .first();
    },
    createMatch: async (match) => {
      await app.knex.insert(match).into('match');
    },
    filterMatches: async (queryOptions) => {
      const [column, order] = queryOptions.order.split(' ');

      const matches = await app.knex
        .select('*')
        .from('match')
        .orderBy([
          { column, order },
          { column: 'id', order },
        ])
        .modify((query) => {
          if (queryOptions.playerId) {
            query.where('playerId', queryOptions.playerId);
          }

          if (queryOptions.sessionId) {
            query.where('sessionId', queryOptions.sessionId);
          }

          return query;
        })
        .offset(queryOptions.page)
        .limit(queryOptions.pageSize);

      return matches.map((match: Match) => removeNullable(match));
    },
    findMatch: async (matchId) => {
      const match = await app.knex.select('*').from('match').where('id', matchId).first();

      if (isNullOrEmpty(match)) {
        return null;
      }

      return removeNullable(match);
    },
    updateMatch: async (match) => {
      await app.knex.from('match').update(match).where('id', match.id);
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    matchRepository: MatchRepository;
  }
}

export { matchRepository };
