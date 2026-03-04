import { Array, FastifyPluginAsyncTypebox, Object, String } from '@fastify/type-provider-typebox';
import { CampaignPlayer } from '@warpzone/shared-schemas';

const getCampaignPlayers: FastifyPluginAsyncTypebox = async (app) => {
  app.route({
    url: '/:campaignId/players',
    method: 'GET',
    schema: {
      tags: ['campaign'],
      description: 'Find campaign related players',
      params: Object({ campaignId: String({ format: 'uuid' }) }),
      response: {
        200: { players: Array(CampaignPlayer) },
        404: { $ref: 'message' },
        500: { $ref: 'message' },
      },
      security: [{ accessToken: [] }],
    },
    onRequest: [app.authenticate],
    handler: async (request, reply) => {
      try {
        const players = await app.campaignService.getCampaignPlayers(request.params.campaignId);

        return reply.code(200).send({ players });
      } catch (error) {
        app.log.error({ error });

        return error;
      }
    },
  });
};

export { getCampaignPlayers };
