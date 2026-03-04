import { FastifyPluginAsyncTypebox, String } from '@fastify/type-provider-typebox';
import { SerializeOptions } from '@fastify/cookie';

const refreshToken: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/refresh-token',
    method: 'GET',
    schema: {
      tags: ['auth'],
      description: 'Refresh token',
      headers: {
        refreshToken: String(),
      },
      response: {
        200: {
          headers: { refreshToken: String() },
          accessToken: String(),
        },
        401: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ refreshToken: [] }],
    },
    // onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const [accessToken, refreshToken] = await app.authService.refreshToken(request.cookies.refreshToken);

        const cookieOptions: SerializeOptions = {
          path: '/auth/refresh-token',
          httpOnly: true,
          sameSite: 'lax',
          secure: true, // send cookie over HTTPS only
        };

        reply.setCookie('refreshToken', refreshToken, cookieOptions);

        return reply.code(200).send({ accessToken });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { refreshToken };
