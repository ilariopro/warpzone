import { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { organizationRepository } from './plugins/organization-repository';
import { organizationService } from './plugins/organization-service';
import { createOrganization } from './routes/create-organization';
import { deleteOrganization } from './routes/delete-organization';
import { filterOrganizations } from './routes/filter-organizations';
import { findOrganization } from './routes/find-organization';
import { getOrganizationGames } from './routes/get-organization-games';
import { setOrganizationGames } from './routes/set-organization-games';
import { updateOrganization } from './routes/update-organization';

const organizations: FastifyPluginAsync = async (app) => {
  const routePrefix = '/organizations';

  await app.register(fastifyPlugin(organizationRepository));
  await app.register(fastifyPlugin(organizationService));
  await app.register(createOrganization, { prefix: routePrefix });
  await app.register(deleteOrganization, { prefix: routePrefix });
  await app.register(filterOrganizations, { prefix: routePrefix });
  await app.register(findOrganization, { prefix: routePrefix });
  await app.register(getOrganizationGames, { prefix: routePrefix });
  await app.register(setOrganizationGames, { prefix: routePrefix });
  await app.register(updateOrganization, { prefix: routePrefix });
};

export { organizations };
