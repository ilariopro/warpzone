import { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { matchRepository } from './plugins/match-repository';
import { matchService } from './plugins/match-service';
import { createMatch } from './routes/create-match';
import { filterMatches } from './routes/filter-matches';
import { findMatch } from './routes/find-match';

const matches: FastifyPluginAsync = async (app) => {
  const routePrefix = '/matches';

  await app.register(fastifyPlugin(matchRepository));
  await app.register(fastifyPlugin(matchService));
  await app.register(createMatch, { prefix: routePrefix });
  await app.register(filterMatches, { prefix: routePrefix });
  await app.register(findMatch, { prefix: routePrefix });
};

export { matches };
