import { FastifyPluginAsyncTypebox, String } from '@fastify/type-provider-typebox';
import { Organization } from '@warpzone/shared-schemas';

const createOrganization: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/',
    method: 'POST',
    schema: {
      tags: ['organization'],
      description: 'Create organization',
      body: Organization,
      response: {
        201: { organizationId: String({ format: 'uuid' }) },
        400: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const organizationId = await app.organizationService.createOrganization(request.body);

        return reply.code(201).send({ organizationId });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { createOrganization };
