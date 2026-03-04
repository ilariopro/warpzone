import { Array, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Session, SessionQuery, Metadata } from '@warpzone/shared-schemas';

const filterSessions: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/',
    method: 'GET',
    schema: {
      tags: ['session'],
      description: 'List and filter sessions',
      querystring: SessionQuery,
      response: {
        200: { sessions: Array(Session), meta: Metadata },
        400: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const [sessions, meta] = await app.sessionService.filterSessions(request.query);

        return reply.code(200).send({ sessions, meta });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { filterSessions };
