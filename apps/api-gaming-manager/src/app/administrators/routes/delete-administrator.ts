import { FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';

const deleteAdministrator: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:administratorId',
    method: 'DELETE',
    schema: {
      tags: ['administrator'],
      description: 'Delete administrator',
      params: Object({ administratorId: String({ format: 'uuid' }) }),
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
        await app.administratorService.deleteAdministrator(request.params.administratorId);

        return reply.code(200).send({ message: 'success' });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { deleteAdministrator };
