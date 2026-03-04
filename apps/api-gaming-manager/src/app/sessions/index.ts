import { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { sessionRepository } from './plugins/session-repository';
import { sessionService } from './plugins/session-service';
import { createSession } from './routes/create-session';
import { deleteSession } from './routes/delete-session';
import { filterSessions } from './routes/filter-sessions';
import { findSession } from './routes/find-session';
import { updateSession } from './routes/update-session';

const sessions: FastifyPluginAsync = async (app) => {
  const routePrefix = '/sessions';

  await app.register(fastifyPlugin(sessionRepository));
  await app.register(fastifyPlugin(sessionService));
  await app.register(createSession, { prefix: routePrefix });
  await app.register(deleteSession, { prefix: routePrefix });
  await app.register(filterSessions, { prefix: routePrefix });
  await app.register(findSession, { prefix: routePrefix });
  await app.register(updateSession, { prefix: routePrefix });
};

export { sessions };
