import { FastifyPluginAsync } from 'fastify';
import { Campaign, CampaignCounts, CampaignPlayer, CampaignQuery, Metadata } from '@warpzone/shared-schemas';
import { utcDate, uuid } from '@warpzone/shared-utils';
import { defaultPagination } from '../../config';

type CampaignService = {
  createCampaign: (data: Campaign) => Promise<string>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  filterCampaigns: (queryOptions: CampaignQuery) => Promise<[CampaignCounts[], Metadata]>;
  findCampaign: (campaignId: string) => Promise<Campaign>;
  getCampaignPlayers: (campaignId: string) => Promise<CampaignPlayer[]>;
  setCampaignPlayers: (campaignId: string, players: CampaignPlayer[]) => Promise<void>;
  updateCampaign: (campaignId: string, data: Partial<Campaign>) => Promise<void>;
};

const campaignService: FastifyPluginAsync = async (app) => {
  app.decorate<CampaignService>('campaignService', {
    createCampaign: async (data) => {
      const campaignId = uuid();

      await app.campaignRepository.createCampaign({
        ...data,
        id: campaignId,
        createdAt: utcDate(),
      });

      return campaignId;
    },
    deleteCampaign: async (campaignId) => {
      const campaign = await app.campaignService.findCampaign(campaignId);

      if (campaign) {
        await app.campaignRepository.deleteCampaign(campaignId);
      }
    },
    filterCampaigns: async (queryOptions) => {
      const order = queryOptions.order ?? 'createdAt desc';
      const pageSize = queryOptions.pageSize ?? defaultPagination;
      const page = queryOptions.page ? (queryOptions.page - 1) * pageSize : 0;
      const total = await app.campaignRepository.countCampaigns(queryOptions);
      const totalPages = Math.ceil(total.count / pageSize);

      const campaigns = await app.campaignRepository.filterCampaigns({
        ...queryOptions,
        order,
        page,
        pageSize,
      });

      const meta = {
        count: campaigns.length,
        page: queryOptions.page,
        pageSize,
        total: total.count,
        totalPages,
      };

      return [campaigns, meta];
    },
    findCampaign: async (campaignId) => {
      const campaign = await app.campaignRepository.findCampaign(campaignId);

      if (!campaign) {
        throw app.httpErrors.notFound('Campaign not found');
      }

      return campaign;
    },
    getCampaignPlayers: async (campaignId) => {
      return await app.campaignRepository.getCampaignPlayers(campaignId);
    },
    setCampaignPlayers: async (campaignId, players) => {
      // TODO dispatch email notifications if needed
      await app.campaignRepository.setCampaignPlayers(campaignId, players);
    },
    updateCampaign: async (campaignId, data) => {
      const campaign = await app.campaignService.findCampaign(campaignId);

      await app.campaignRepository.updateCampaign({
        ...campaign,
        ...data,
        id: campaignId,
        gameId: campaign.gameId,
        organizationId: campaign.organizationId,
        createdAt: campaign.createdAt,
        updatedAt: utcDate(),
      });
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    campaignService: CampaignService;
  }
}

export { campaignService };
