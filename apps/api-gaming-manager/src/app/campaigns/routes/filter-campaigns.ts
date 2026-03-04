import { Array, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Metadata, CampaignQuery, CampaignCounts } from '@warpzone/shared-schemas';

const filterCampaigns: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/',
    method: 'GET',
    schema: {
      tags: ['campaign'],
      description: 'List and filter campaigns',
      querystring: CampaignQuery,
      response: {
        200: { campaigns: Array(CampaignCounts), meta: Metadata },
        400: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const [campaigns, meta] = await app.campaignService.filterCampaigns(request.query);

        return reply.code(200).send({ campaigns, meta });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { filterCampaigns };
