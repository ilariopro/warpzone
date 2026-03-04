import { FastifyPluginAsync } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { fastifyCookie } from '@fastify/cookie';
import { fastifyHelmet } from '@fastify/helmet';
import * as bcrypt from 'bcryptjs';

type SecurityOpts = {
  cookieSecret: string;
  corsCredentials?: boolean;
  corsOrigins: string | string[];
  cryptoSalt?: number;
};

const security: FastifyPluginAsync<SecurityOpts> = async (app, opts) => {
  await app.register(fastifyHelmet);

  await app.register(fastifyCookie, {
    secret: opts.cookieSecret,
  });

  await app.register(fastifyCors, {
    credentials: opts.corsCredentials ?? true,
    origin: opts.corsOrigins,
  });

  app.decorate('passwordCompare', async (password: string, hashed: string) => {
    return await bcrypt.compare(password, hashed);
  });

  app.decorate('passwordHash', async (password: string) => {
    return await bcrypt.hash(password, opts.cryptoSalt ?? 10);
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    passwordCompare: (password: string, hashed: string) => Promise<boolean>;
    passwordHash: (password: string) => Promise<string>;
  }
}

export { security, SecurityOpts };
