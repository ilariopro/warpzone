import { Array, FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';
import { CampaignPlayer } from '@warpzone/shared-schemas';

const setCampaignPlayers: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:campaignId/players',
    method: 'POST',
    schema: {
      tags: ['campaign'],
      description: 'Set campaign related players',
      body: Array(CampaignPlayer),
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
        await app.campaignService.setCampaignPlayers(request.params.campaignId, request.body);

        return reply.code(200).send({ message: 'success' });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { setCampaignPlayers };
