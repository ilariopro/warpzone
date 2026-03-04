import { FastifyPluginAsyncTypebox, String } from '@fastify/type-provider-typebox';
import { Match } from '@warpzone/shared-schemas';

const createMatch: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/',
    method: 'POST',
    schema: {
      tags: ['match'],
      description: 'Create match',
      body: Match,
      response: {
        201: { matchId: String({ format: 'uuid' }) },
        400: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const matchId = await app.matchService.createMatch(request.body);

        return reply.code(201).send({ matchId });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { createMatch };
