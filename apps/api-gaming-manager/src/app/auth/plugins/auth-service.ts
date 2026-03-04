import { FastifyPluginAsync } from 'fastify';
import { AuthPayload, RefreshToken } from '@warpzone/shared-schemas';
import { addTime, randomId, utcDate } from '@warpzone/shared-utils';
import { cookieExpiration } from '../../config';

type AuthService = {
  authorize: (data: AuthPayload) => Promise<[string, string]>;
  createTokens: (userId: string, family?: string) => Promise<[string, string]>;
  findToken: (token: string) => Promise<RefreshToken>;
  deleteToken: (token: string) => Promise<void>;
  purgeToken: (userIdOrFamily: string, purgeByFamily?: boolean) => Promise<void>;
  refreshToken: (token: string) => Promise<[string, string]>;
};

// TODO forgot password, reset password, confirm account

const authService: FastifyPluginAsync = async (app) => {
  app.decorate<AuthService>('authService', {
    authorize: async (data) => {
      const user = await app.administratorService.findAdministrator(data.email, true);
      const passwordMatch = await app.passwordCompare(data.password, user.password);

      if (!passwordMatch) {
        throw app.httpErrors.unauthorized('Invalid credentials');
      }

      return await app.authService.createTokens(user.id);
    },
    createTokens: async (userId, family = null) => {
      const payload = {
        iat: utcDate(),
        sub: userId,
      };

      const accessToken = app.jwt.sign(payload);
      const refreshToken = app.jwt.sign(payload, { expiresIn: cookieExpiration });
      const expireAt = addTime(cookieExpiration, payload.iat);

      await app.authRepository.insertToken({
        userId: payload.sub,
        token: refreshToken,
        family: family || randomId(),
        issuedAt: payload.iat,
        expireAt: utcDate(expireAt),
      });

      return [accessToken, refreshToken];
    },
    deleteToken: async (token) => {
      const refreshToken = await app.authService.findToken(token);

      if (refreshToken) {
        await app.authRepository.deleteToken(token);
      }
    },
    findToken: async (token) => {
      const refreshToken = await app.authRepository.findToken(token);

      if (!refreshToken) {
        throw app.httpErrors.unauthorized('Refresh token not found');
      }

      return refreshToken;
    },
    purgeToken: async (userIdOrFamily, purgeByFamily = false) => {
      if (purgeByFamily) {
        await app.authRepository.purgeTokensByFamily(userIdOrFamily);
      } else {
        await app.authRepository.purgeTokensByUserId(userIdOrFamily);
      }
    },
    refreshToken: async (token) => {
      const refreshToken = await app.authService.findToken(token);
      const user = await app.administratorService.findAdministrator(refreshToken.userId);
      const mostRecentToken = await app.authRepository.findMostRecentTokenInFamily(refreshToken.family);

      if (refreshToken.issuedAt < mostRecentToken.issuedAt) {
        await app.authRepository.purgeTokensByFamily(refreshToken.family);

        throw app.httpErrors.unauthorized('Invalid refresh token');
      }

      return await app.authService.createTokens(user.id, refreshToken.family);
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    authService: AuthService;
  }
}

export { authService };
