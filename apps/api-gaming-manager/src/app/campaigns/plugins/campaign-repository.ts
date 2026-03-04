import { FastifyPluginAsync } from 'fastify';
import { Campaign, CampaignCounts, CampaignPlayer, CampaignQuery } from '@warpzone/shared-schemas';
import { isNullOrEmpty, removeNullable } from '@warpzone/shared-utils';

type CampaignRepository = {
  countCampaigns: (queryOptions: CampaignQuery) => Promise<{ count: number }>;
  createCampaign: (campaign: Campaign) => Promise<void>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  filterCampaigns: (queryOptions: CampaignQuery) => Promise<CampaignCounts[]>;
  findCampaign: (campaignId: string) => Promise<Campaign | null>;
  getCampaignPlayers: (campaignId: string) => Promise<CampaignPlayer[]>;
  setCampaignPlayers: (campaignId: string, players: CampaignPlayer[]) => Promise<void>;
  updateCampaign: (campaign: Partial<Campaign>) => Promise<void>;
};

const campaignRepository: FastifyPluginAsync = async (app) => {
  app.decorate<CampaignRepository>('campaignRepository', {
    countCampaigns: async (queryOptions) => {
      return await app.knex
        .count('* as count')
        .from('campaign')
        .modify((query) => {
          if (queryOptions.gameId) {
            query.where('campaign.gameId', queryOptions.gameId);
          }

          if (queryOptions.organizationId) {
            query.where('campaign.organizationId', queryOptions.organizationId);
          }

          return query;
        })
        .first();
    },
    createCampaign: async (campaign) => {
      await app.knex.insert(campaign).into('campaign');
    },
    deleteCampaign: async (campaignId) => {
      await app.knex.from('campaign').where('id', campaignId).del();
    },
    filterCampaigns: async (queryOptions) => {
      const [column, order] = queryOptions.order.split(' ');

      const campaigns: CampaignCounts[] = await app.knex
        .select('campaign.*')
        .from('campaign')
        .orderBy([
          { column, order },
          { column: 'id', order },
        ])
        .modify((query) => {
          if (queryOptions.include.includes('playerCount')) {
            query
              .countDistinct('cp1.playerId as playerCount')
              .leftJoin('campaignPlayer as cp1', 'campaign.id', 'cp1.campaignId');
          }

          if (queryOptions.include.includes('sessionCount')) {
            query
              .countDistinct('s1.id as sessionCount')
              .leftJoin('session as s1', 'campaign.id', 's1.campaignId');
          }

          if (queryOptions.include.includes('teamCount')) {
            query
              .countDistinct('cp2.team as teamCount')
              .leftJoin('campaignPlayer as cp2', 'campaign.id', 'cp2.campaignId');
          }

          if (queryOptions.gameId) {
            query.where('campaign.gameId', queryOptions.gameId);
          }

          if (queryOptions.organizationId) {
            query.where('campaign.organizationId', queryOptions.organizationId);
          }

          return query;
        })
        .groupBy('campaign.id')
        .offset(queryOptions.page)
        .limit(queryOptions.pageSize);

      return campaigns.map((campaign) => removeNullable(campaign));
    },
    findCampaign: async (campaignId) => {
      const campaign = await app.knex.select('*').from('campaign').where('id', campaignId).first();

      if (isNullOrEmpty(campaign)) {
        return null;
      }

      return removeNullable(campaign);
    },
    getCampaignPlayers: async (campaignId) => {
      const players = await app.knex
        .select('player.*', 'campaignPlayer.team', 'campaignPlayer.notifiedAt')
        .from('player')
        .join('campaignPlayer', 'player.id', 'campaignPlayer.playerId')
        .where('campaignPlayer.campaignId', campaignId);

      return players.map((player) => removeNullable(player));
    },
    setCampaignPlayers: async (campaignId, players) => {
      await app.knex.from('campaignPlayer').where('campaignId', campaignId).del();

      for await (const player of players) {
        await app.knex
          .insert({
            campaignId,
            playerId: player.id,
            team: player.team,
            notifiedAt: player.notifiedAt,
          })
          .into('campaignPlayer');
      }
    },
    updateCampaign: async (campaign) => {
      await app.knex.from('campaign').update(campaign).where('id', campaign.id);
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    campaignRepository: CampaignRepository;
  }
}

export { campaignRepository };
