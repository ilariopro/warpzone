import { FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';
import { Organization } from '@warpzone/shared-schemas';

const findOrganization: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:organizationId',
    method: 'GET',
    schema: {
      tags: ['organization'],
      description: 'Find organization',
      params: Object({ organizationId: String({ format: 'uuid' }) }),
      response: {
        200: { organization: Organization },
        404: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const organization = await app.organizationService.findOrganization(request.params.organizationId);

        return reply.code(200).send({ organization });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { findOrganization };
