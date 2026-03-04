import { FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';

const deleteOrganization: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:organizationId',
    method: 'DELETE',
    schema: {
      tags: ['organization'],
      description: 'Delete organization',
      params: Object({ organizationId: String({ format: 'uuid' }) }),
      response: {
        200: { $ref: 'message' },
        404: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        await app.organizationService.deleteOrganization(request.params.organizationId);

        return reply.code(200).send({ message: 'success' });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { deleteOrganization };
