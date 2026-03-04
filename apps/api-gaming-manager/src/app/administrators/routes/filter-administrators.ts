import { Array, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Administrator, AdministratorQuery, Metadata } from '@warpzone/shared-schemas';

const filterAdministrators: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/',
    method: 'GET',
    schema: {
      tags: ['administrator'],
      description: 'List and filter administrators',
      querystring: AdministratorQuery,
      response: {
        200: { administrators: Array(Administrator), meta: Metadata },
        400: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const [administrators, meta] = await app.administratorService.filterAdministrators(request.query);

        return reply.code(200).send({ administrators, meta });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { filterAdministrators };
