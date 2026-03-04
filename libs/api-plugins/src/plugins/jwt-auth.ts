import { FastifyPluginAsync, RouteHandler } from 'fastify';
import { fastifyJwt, JWT } from '@fastify/jwt';

type JwtAuthOpts = {
  secret: string;
  expiration: string;
};

const jwtAuth: FastifyPluginAsync<JwtAuthOpts> = async (app, opts) => {
  if (!opts.secret) {
    throw new Error(`Auth plugin error: 'secret' is required`);
  }

  await app.register(fastifyJwt, {
    cookie: {
      cookieName: 'refreshToken',
      signed: true,
    },
    secret: opts.secret,
    sign: {
      expiresIn: opts.expiration,
    },
  });

  app.decorate<RouteHandler>('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      error.message = 'Unauthorized';

      reply.send(error);
    }
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authenticate: any;
    jwt: JWT;
  }
}

export { jwtAuth, JwtAuthOpts };
