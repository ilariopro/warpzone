import { FastifyPluginAsync } from 'fastify';
import { RefreshToken } from '@warpzone/shared-schemas';

type AuthRepository = {
  deleteToken: (token: string) => Promise<void>;
  findToken: (token: string) => Promise<RefreshToken | null>;
  findMostRecentTokenInFamily: (family: string) => Promise<RefreshToken | null>;
  insertToken: (refreshToken: RefreshToken) => Promise<void>;
  purgeTokensByFamily: (family: string) => Promise<void>;
  purgeTokensByUserId: (userId: string) => Promise<void>;
};

const authRepository: FastifyPluginAsync = async (app) => {
  app.decorate<AuthRepository>('authRepository', {
    deleteToken: async (token) => {
      await app.knex.from('refreshToken').where('token', token).del();
    },
    findToken: async (token) => {
      const refreshToken = await app.knex.select('*').from('refreshToken').where('token', token).first();

      return refreshToken ?? null;
    },
    findMostRecentTokenInFamily: async (family) => {
      const refreshToken = await app.knex
        .select('*')
        .from('refreshToken')
        .where('family', family)
        .orderBy('id', 'desc')
        .first();

      return refreshToken ?? null;
    },
    insertToken: async (refreshToken) => {
      await app.knex.insert(refreshToken).into('refreshToken');
    },
    purgeTokensByFamily: async (family) => {
      await app.knex.from('refreshToken').where('family', family).del();
    },
    purgeTokensByUserId: async (userId) => {
      await app.knex.from('refreshToken').where('userId', userId).del();
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    authRepository: AuthRepository;
  }
}

export { authRepository };
