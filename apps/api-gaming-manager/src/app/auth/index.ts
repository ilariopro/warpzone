import { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { authRepository } from './plugins/auth-repository';
import { authService } from './plugins/auth-service';
import { login } from './routes/login';
import { logout } from './routes/logout';
import { refreshToken } from './routes/refresh-token';

const auth: FastifyPluginAsync = async (app) => {
  const routePrefix = '/auth';

  await app.register(fastifyPlugin(authRepository));
  await app.register(fastifyPlugin(authService));
  await app.register(login, { prefix: routePrefix });
  await app.register(logout, { prefix: routePrefix });
  await app.register(refreshToken, { prefix: routePrefix });
};

export { auth };
