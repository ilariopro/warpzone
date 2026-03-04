import { FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';
import { Administrator } from '@warpzone/shared-schemas';

const findAdministrator: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:administratorId',
    method: 'GET',
    schema: {
      tags: ['administrator'],
      description: 'Find administrator',
      params: Object({ administratorId: String({ format: 'uuid' }) }),
      response: {
        200: { administrator: Administrator },
        404: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const administrator = await app.administratorService.findAdministrator(
          request.params.administratorId
        );

        return reply.code(200).send({ administrator });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { findAdministrator };
