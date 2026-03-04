import { FastifyPluginAsyncTypebox, String } from '@fastify/type-provider-typebox';
import { SerializeOptions } from '@fastify/cookie';
import { AuthPayload } from '@warpzone/shared-schemas';

const login: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/login',
    method: 'POST',
    schema: {
      tags: ['auth'],
      description: 'Login user',
      body: AuthPayload,
      response: {
        200: {
          headers: { refreshToken: String() },
          accessToken: String(),
        },
        401: { $ref: 'message' },
        500: { $ref: 'message' },
      },
    },
    handler: async (request, reply) => {
      try {
        const [accessToken, refreshToken] = await app.authService.authorize(request.body);

        const cookieOptions: SerializeOptions = {
          path: '/auth/refresh-token',
          httpOnly: true,
          sameSite: 'lax',
          secure: true, // send cookie over HTTPS only
        };

        reply.setCookie('refreshToken', refreshToken, { ...cookieOptions });

        return reply.code(200).send({ accessToken });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { login };
