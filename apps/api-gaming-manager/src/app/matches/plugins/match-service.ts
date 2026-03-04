import { FastifyPluginAsync } from 'fastify';
import { Match, MatchQuery, Metadata } from '@warpzone/shared-schemas';
import { utcDate, uuid } from '@warpzone/shared-utils';
import { defaultPagination } from '../../config';

type MatchService = {
  createMatch: (data: Match) => Promise<string>;
  filterMatches: (queryOptions: MatchQuery) => Promise<[Match[], Metadata]>;
  findMatch: (matchId: string) => Promise<Match>;
  updateMatch: (matchId: string, data: Partial<Match>) => Promise<void>;
};

const matchService: FastifyPluginAsync = async (app) => {
  app.decorate<MatchService>('matchService', {
    createMatch: async (data) => {
      const matchId = uuid();

      await app.matchRepository.createMatch({
        ...data,
        id: matchId,
        createdAt: utcDate(),
      });

      return matchId;
    },
    filterMatches: async (queryOptions) => {
      const order = queryOptions.order ?? 'createdAt desc';
      const pageSize = queryOptions.pageSize ?? defaultPagination;
      const page = queryOptions.page ? (queryOptions.page - 1) * pageSize : 0;
      const total = await app.matchRepository.countMatches(queryOptions);
      const totalPages = Math.ceil(total.count / pageSize);

      const matches = await app.matchRepository.filterMatches({ ...queryOptions, order, page, pageSize });

      const meta = {
        count: matches.length,
        page: queryOptions.page,
        pageSize,
        total: total.count,
        totalPages,
      };

      return [matches, meta];
    },
    findMatch: async (matchId) => {
      const match = await app.matchRepository.findMatch(matchId);

      if (!match) {
        throw app.httpErrors.notFound('Match not found');
      }

      return match;
    },
    updateMatch: async (matchId, data) => {
      const match = await app.matchService.findMatch(matchId);

      await app.matchRepository.updateMatch({
        ...match,
        ...data,
        id: matchId,
        playerId: match.playerId,
        sessionId: match.sessionId,
        createdAt: match.createdAt,
        updatedAt: utcDate(),
      });
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    matchService: MatchService;
  }
}

export { matchService };
