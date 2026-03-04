import { Array, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Metadata, Organization, OrganizationQuery } from '@warpzone/shared-schemas';

const filterOrganizations: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/',
    method: 'GET',
    schema: {
      tags: ['organization'],
      description: 'List and filter organizations',
      querystring: OrganizationQuery,
      response: {
        200: { organizations: Array(Organization), meta: Metadata },
        400: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const [organizations, meta] = await app.organizationService.filterOrganizations(request.query);

        return reply.code(200).send({ organizations, meta });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { filterOrganizations };
