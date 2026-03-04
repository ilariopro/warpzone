import { FastifyPluginAsyncTypebox, String } from '@fastify/type-provider-typebox';
import { Administrator } from '@warpzone/shared-schemas';

const createAdministrator: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/',
    method: 'POST',
    schema: {
      tags: ['administrator'],
      description: 'Create administrator',
      body: Administrator,
      response: {
        201: { administratorId: String({ format: 'uuid' }) },
        400: { $ref: 'message' },
        409: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const administratorId = await app.administratorService.createAdministrator(request.body);

        return reply.code(201).send({ administratorId });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { createAdministrator };
