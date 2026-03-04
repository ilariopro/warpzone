import { FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';
import { Campaign } from '@warpzone/shared-schemas';

const findCampaign: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:campaignId',
    method: 'GET',
    schema: {
      tags: ['campaign'],
      description: 'Find campaign',
      params: Object({ campaignId: String({ format: 'uuid' }) }),
      response: {
        200: { campaign: Campaign },
        404: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const campaign = await app.campaignService.findCampaign(request.params.campaignId);

        return reply.code(200).send({ campaign });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { findCampaign };
