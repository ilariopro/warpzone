import { FastifyPluginAsync } from 'fastify';
import { Session, SessionQuery, Metadata } from '@warpzone/shared-schemas';
import { utcDate, uuid } from '@warpzone/shared-utils';
import { defaultPagination } from '../../config';

type SessionService = {
  createSession: (data: Session) => Promise<string>;
  deleteSession: (sessionId: string) => Promise<void>;
  filterSessions: (queryOptions: SessionQuery) => Promise<[Session[], Metadata]>;
  findSession: (sessionId: string) => Promise<Session>;
  updateSession: (sessionId: string, data: Partial<Session>) => Promise<void>;
};

const sessionService: FastifyPluginAsync = async (app) => {
  app.decorate<SessionService>('sessionService', {
    createSession: async (data) => {
      const sessionId = uuid();

      await app.sessionRepository.createSession({
        ...data,
        id: sessionId,
        startAt: utcDate(data.startAt),
        endAt: data.endAt && utcDate(data.endAt),
        createdAt: utcDate(),
      });

      return sessionId;
    },
    deleteSession: async (sessionId) => {
      const session = await app.sessionService.findSession(sessionId);

      if (session) {
        await app.sessionRepository.deleteSession(sessionId);
      }
    },
    filterSessions: async (queryOptions) => {
      const order = queryOptions.order ?? 'createdAt desc';
      const pageSize = queryOptions.pageSize ?? defaultPagination;
      const page = queryOptions.page ? (queryOptions.page - 1) * pageSize : 0;
      const total = await app.sessionRepository.countSessions(queryOptions);
      const totalPages = Math.ceil(total.count / pageSize);

      const sessions = await app.sessionRepository.filterSessions({ ...queryOptions, order, page, pageSize });

      const meta = {
        count: sessions.length,
        page: queryOptions.page,
        pageSize,
        total: total.count,
        totalPages,
      };

      return [sessions, meta];
    },
    findSession: async (sessionId) => {
      const session = await app.sessionRepository.findSession(sessionId);

      if (!session) {
        throw app.httpErrors.notFound('Session not found');
      }

      return session;
    },
    updateSession: async (sessionId, data) => {
      const session = await app.sessionService.findSession(sessionId);

      await app.sessionRepository.updateSession({
        ...session,
        ...data,
        id: sessionId,
        campaignId: session.campaignId,
        startAt: utcDate(data.startAt ?? session.startAt),
        endAt: data.endAt && utcDate(),
        createdAt: session.createdAt,
        updatedAt: utcDate(),
      });
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    sessionService: SessionService;
  }
}

export { sessionService };
