import { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { gameRepository } from './plugins/game-repository';
import { gameService } from './plugins/game-service';
import { filterGames } from './routes/filter-games';
import { findGame } from './routes/find-game';

const games: FastifyPluginAsync = async (app) => {
  const routePrefix = '/games';

  await app.register(fastifyPlugin(gameRepository));
  await app.register(fastifyPlugin(gameService));
  await app.register(filterGames, { prefix: routePrefix });
  await app.register(findGame, { prefix: routePrefix });
};

export { games };
