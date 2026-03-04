import { FastifyPluginAsync } from 'fastify';
import { Session, SessionQuery } from '@warpzone/shared-schemas';
import { isNullOrEmpty, removeNullable } from '@warpzone/shared-utils';

type SessionRepository = {
  countSessions: (queryOptions: SessionQuery) => Promise<{ count: number }>;
  createSession: (data: Session) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  filterSessions: (queryOptions: SessionQuery) => Promise<Session[]>;
  findSession: (sessionId: string) => Promise<Session | null>;
  updateSession: (data: Session) => Promise<void>;
};

const sessionRepository: FastifyPluginAsync = async (app) => {
  app.decorate<SessionRepository>('sessionRepository', {
    countSessions: async (queryOptions) => {
      return await app.knex
        .count('* as count')
        .from('session')
        .modify((query) => {
          if (queryOptions.campaignId) {
            query.where('campaignId', queryOptions.campaignId);
          }

          return query;
        })
        .first();
    },
    createSession: async (data) => {
      const { ...session } = data;

      await app.knex.insert(session).into('session');
    },
    deleteSession: async (sessionId) => {
      await app.knex.from('session').where('id', sessionId).del();
    },
    filterSessions: async (queryOptions) => {
      const [column, order] = queryOptions.order.split(' ');

      const sessions = await app.knex
        .select('*')
        .from('session')
        .orderBy([
          { column, order },
          { column: 'id', order },
        ])
        .modify((query) => {
          if (queryOptions.campaignId) {
            query.where('campaignId', queryOptions.campaignId);
          }

          return query;
        })
        .offset(queryOptions.page)
        .limit(queryOptions.pageSize);

      return sessions.map((session: Session) => removeNullable(session));
    },
    findSession: async (sessionId) => {
      const session = await app.knex.select('*').from('session').where('id', sessionId).first();

      if (isNullOrEmpty(session)) {
        return null;
      }

      return removeNullable(session);
    },
    updateSession: async (data) => {
      const { ...session } = data;

      await app.knex.from('session').update(session).where('id', session.id);
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    sessionRepository: SessionRepository;
  }
}

export { sessionRepository };
