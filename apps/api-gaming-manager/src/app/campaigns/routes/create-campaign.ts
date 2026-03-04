import { FastifyPluginAsyncTypebox, String } from '@fastify/type-provider-typebox';
import { Campaign } from '@warpzone/shared-schemas';

const createCampaign: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/',
    method: 'POST',
    schema: {
      tags: ['campaign'],
      description: 'Create campaign',
      body: Campaign,
      response: {
        201: { campaignId: String({ format: 'uuid' }) },
        400: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const campaignId = await app.campaignService.createCampaign(request.body);

        return reply.code(201).send({ campaignId });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { createCampaign };
