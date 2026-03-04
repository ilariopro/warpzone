import { FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';

const deleteCampaign: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:campaignId',
    method: 'DELETE',
    schema: {
      tags: ['campaign'],
      description: 'Delete campaign',
      params: Object({ campaignId: String({ format: 'uuid' }) }),
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
        await app.campaignService.deleteCampaign(request.params.campaignId);

        return reply.code(200).send({ message: 'success' });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { deleteCampaign };
