import { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { playerRepository } from './plugins/player-repository';
import { playerService } from './plugins/player-service';
import { createPlayer } from './routes/create-player';
import { deletePlayer } from './routes/delete-player';
import { filterPlayers } from './routes/filter-players';
import { findPlayer } from './routes/find-player';
import { updatePlayer } from './routes/update-player';

const players: FastifyPluginAsync = async (app) => {
  const routePrefix = '/players';

  await app.register(fastifyPlugin(playerRepository));
  await app.register(fastifyPlugin(playerService));
  await app.register(createPlayer, { prefix: routePrefix });
  await app.register(deletePlayer, { prefix: routePrefix });
  await app.register(filterPlayers, { prefix: routePrefix });
  await app.register(findPlayer, { prefix: routePrefix });
  await app.register(updatePlayer, { prefix: routePrefix });
};

export { players };
