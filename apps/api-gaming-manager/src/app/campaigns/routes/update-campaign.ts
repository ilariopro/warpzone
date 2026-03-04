import { FastifyPluginAsyncTypebox, Object, Partial, String } from '@fastify/type-provider-typebox';
import { Campaign } from '@warpzone/shared-schemas';

const updateCampaign: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:campaignId',
    method: 'PATCH',
    schema: {
      tags: ['campaign'],
      description: 'Update campaign',
      body: Partial(Campaign),
      params: Object({ campaignId: String({ format: 'uuid' }) }),
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
        await app.campaignService.updateCampaign(request.params.campaignId, request.body);

        return reply.code(200).send({ message: 'success' });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { updateCampaign };
