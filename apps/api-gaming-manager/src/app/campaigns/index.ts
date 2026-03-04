import { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { campaignRepository } from './plugins/campaign-repository';
import { campaignService } from './plugins/campaign-service';
import { createCampaign } from './routes/create-campaign';
import { deleteCampaign } from './routes/delete-campaign';
import { filterCampaigns } from './routes/filter-campaigns';
import { findCampaign } from './routes/find-campaign';
import { getCampaignPlayers } from './routes/get-campaign-players';
import { setCampaignPlayers } from './routes/set-campaign-players';
import { updateCampaign } from './routes/update-campaign';

const campaigns: FastifyPluginAsync = async (app) => {
  const routePrefix = '/campaigns';

  await app.register(fastifyPlugin(campaignRepository));
  await app.register(fastifyPlugin(campaignService));
  await app.register(createCampaign, { prefix: routePrefix });
  await app.register(deleteCampaign, { prefix: routePrefix });
  await app.register(filterCampaigns, { prefix: routePrefix });
  await app.register(findCampaign, { prefix: routePrefix });
  await app.register(getCampaignPlayers, { prefix: routePrefix });
  await app.register(setCampaignPlayers, { prefix: routePrefix });
  await app.register(updateCampaign, { prefix: routePrefix });
};

export { campaigns };
