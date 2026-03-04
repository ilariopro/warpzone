import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

const logout: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/refresh-token',
    method: 'DELETE',
    schema: {
      tags: ['auth'],
      description: 'Logout user',
      response: {
        200: { $ref: 'message' },
        401: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [], refreshToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        await app.authService.deleteToken(request.cookies.refreshToken);

        return reply.code(200).send({ message: 'success' });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { logout };
