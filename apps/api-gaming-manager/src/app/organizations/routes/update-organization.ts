import { FastifyPluginAsyncTypebox, Object, Partial, String } from '@fastify/type-provider-typebox';
import { Organization } from '@warpzone/shared-schemas';

const updateOrganization: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:organizationId',
    method: 'PATCH',
    schema: {
      tags: ['organization'],
      description: 'Update organization',
      body: Partial(Organization),
      params: Object({ organizationId: String({ format: 'uuid' }) }),
      response: {
        200: { $ref: 'message' },
        400: { $ref: 'message' },
        404: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        await app.organizationService.updateOrganization(request.params.organizationId, request.body);

        return reply.code(200).send({ message: 'success' });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { updateOrganization };
