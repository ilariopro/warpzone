import { Array, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Match, MatchQuery, Metadata } from '@warpzone/shared-schemas';

const filterMatches: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/',
    method: 'GET',
    schema: {
      tags: ['match'],
      description: 'List and filter matches',
      querystring: MatchQuery,
      response: {
        200: { matchs: Array(Match), meta: Metadata },
        400: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const [matches, meta] = await app.matchService.filterMatches(request.query);

        return reply.code(200).send({ matches, meta });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { filterMatches };
