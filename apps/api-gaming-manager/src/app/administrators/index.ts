import { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { administratorEvents } from './plugins/administrator-events';
import { administratorRepository } from './plugins/administrator-repository';
import { administratorService } from './plugins/administrator-service';
import { createAdministrator } from './routes/create-administrator';
import { deleteAdministrator } from './routes/delete-administrator';
import { filterAdministrators } from './routes/filter-administrators';
import { findAdministrator } from './routes/find-administrator';
import { updateAdministrator } from './routes/update-administrator';

const administrators: FastifyPluginAsync = async (app) => {
  const routePrefix = '/administrators';

  await app.register(fastifyPlugin(administratorRepository));
  await app.register(fastifyPlugin(administratorEvents));
  await app.register(fastifyPlugin(administratorService));
  await app.register(createAdministrator, { prefix: routePrefix });
  await app.register(deleteAdministrator, { prefix: routePrefix });
  await app.register(filterAdministrators, { prefix: routePrefix });
  await app.register(findAdministrator, { prefix: routePrefix });
  await app.register(updateAdministrator, { prefix: routePrefix });
};

export { administrators };
