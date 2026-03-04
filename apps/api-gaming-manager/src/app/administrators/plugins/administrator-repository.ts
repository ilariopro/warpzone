import { FastifyPluginAsync } from 'fastify';
import { Administrator, AdministratorQuery } from '@warpzone/shared-schemas';
import { isNullOrEmpty, removeNullable } from '@warpzone/shared-utils';

type AdministratorRepository = {
  countAdministrators: (queryOptions: AdministratorQuery) => Promise<{ count: number }>;
  createAdministrator: (administrator: Administrator) => Promise<void>;
  deleteAdministrator: (administratorId: string) => Promise<void>;
  filterAdministrators: (queryOptions: AdministratorQuery) => Promise<Administrator[]>;
  findAdministratorByEmail: (administratorEmail: string) => Promise<Administrator | null>;
  findAdministratorById: (administratorId: string) => Promise<Administrator | null>;
  updateAdministrator: (administrator: Administrator) => Promise<void>;
};

const administratorRepository: FastifyPluginAsync = async (app) => {
  app.decorate<AdministratorRepository>('administratorRepository', {
    countAdministrators: async (queryOptions) => {
      return await app.knex
        .count('* as count')
        .from('administrator')
        .modify((query) => {
          if (queryOptions.organizationId) {
            query.where('organizationId', queryOptions.organizationId);
          }

          if (queryOptions.role) {
            query.whereIn('role', queryOptions.role);
          }

          return query;
        })
        .first();
    },
    createAdministrator: async (administrator) => {
      await app.knex.insert(administrator).into('administrator');
    },
    deleteAdministrator: async (administratorId) => {
      await app.knex.from('administrator').where('id', administratorId).del();
    },
    filterAdministrators: async (queryOptions) => {
      const [column, order] = queryOptions.order.split(' ');

      const administrators = await app.knex
        .select('*')
        .from('administrator')
        .orderBy([
          { column, order },
          { column: 'id', order },
        ])
        .modify((query) => {
          if (queryOptions.organizationId) {
            query.where('organizationId', queryOptions.organizationId);
          }

          if (queryOptions.role) {
            query.whereIn('role', queryOptions.role);
          }

          return query;
        })
        .offset(queryOptions.page)
        .limit(queryOptions.pageSize);

      return administrators.map((administrator: Administrator) => removeNullable(administrator));
    },
    findAdministratorByEmail: async (administratorEmail) => {
      const administrator = await app.knex
        .select('*')
        .from('administrator')
        .where('email', administratorEmail)
        .first();

      if (isNullOrEmpty(administrator)) {
        return null;
      }

      return removeNullable(administrator);
    },
    findAdministratorById: async (administratorId) => {
      const administrator = await app.knex
        .select('*')
        .from('administrator')
        .where('id', administratorId)
        .first();

      if (isNullOrEmpty(administrator)) {
        return null;
      }

      return removeNullable(administrator);
    },
    updateAdministrator: async (administrator) => {
      await app.knex.from('administrator').update(administrator).where('id', administrator.id);
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    administratorRepository: AdministratorRepository;
  }
}

export { administratorRepository };
