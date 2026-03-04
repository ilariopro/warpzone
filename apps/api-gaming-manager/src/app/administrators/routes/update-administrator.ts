import { FastifyPluginAsyncTypebox, Object, Partial, String } from '@fastify/type-provider-typebox';
import { Administrator } from '@warpzone/shared-schemas';

const updateAdministrator: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:administratorId',
    method: 'PATCH',
    schema: {
      tags: ['administrator'],
      description: 'Update administrator',
      body: Partial(Administrator),
      params: Object({ administratorId: String({ format: 'uuid' }) }),
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
        await app.administratorService.updateAdministrator(request.params.administratorId, request.body);

        return reply.code(200).send({ message: 'success' });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { updateAdministrator };
