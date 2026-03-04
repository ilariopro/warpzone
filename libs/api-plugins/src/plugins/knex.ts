import { FastifyPluginAsync } from 'fastify';
import knexLib, { Knex } from 'knex';

type KnexOpts = {
  config: Knex.Config;
  name?: string;
};

const knex: FastifyPluginAsync<KnexOpts> = async (app, opts) => {
  const knex = knexLib(opts.config);
  const name = opts.name;

  if (!name) {
    if (app.knex && app.knex.client) {
      throw new Error('Knex plugin error: unnamed connection already registered');
    }

    app.decorate('knex', knex);

    app.addHook('onClose', async (app) => {
      if (app.knex === knex) {
        await app.knex.destroy();
      }
    });
  }

  if (name) {
    if (app.knex && app.knex[name].client) {
      throw new Error(`Knex plugin error: connection named '${name}' already registered`);
    }

    if (!app.knex) {
      app.decorate('knex', {});
    }

    app.knex[name] = knex;

    app.addHook('onClose', async (app) => {
      if (app.knex[name] === knex) {
        await app.knex[name].destroy();
      }
    });
  }
};

declare module 'fastify' {
  interface FastifyInstance {
    knex: Knex & Record<string, Knex>;
  }
}

declare module 'knex/types/result' {
  interface Registry {
    Count: number;
  }
}

export { knex, KnexOpts };
