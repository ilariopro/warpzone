import { FastifyPluginAsync } from 'fastify';
import { Administrator, AdministratorQuery, Metadata } from '@warpzone/shared-schemas';
import { utcDate, uuid } from '@warpzone/shared-utils';
import { defaultPagination } from '../../config';

type AdministratorService = {
  createAdministrator: (data: Administrator) => Promise<string>;
  deleteAdministrator: (administratorId: string) => Promise<void>;
  filterAdministrators: (queryOptions: AdministratorQuery) => Promise<[Administrator[], Metadata]>;
  findAdministrator: (administratorIdOrEmail: string, findByEmail?: boolean) => Promise<Administrator>;
  updateAdministrator: (administratorId: string, data: Partial<Administrator>) => Promise<void>;
};

const administratorService: FastifyPluginAsync = async (app) => {
  app.decorate<AdministratorService>('administratorService', {
    createAdministrator: async (data) => {
      try {
        const id = uuid();

        await app.administratorRepository.createAdministrator({
          ...data,
          id,
          isVerified: false,
          password: await app.passwordHash(data.password),
          createdAt: utcDate(),
        });

        app.administratorEvents.emit('administratorCreated', {
          to: data.email,
        });

        return id;
      } catch (error) {
        if ('code' in error && error.code === 'ER_DUP_ENTRY') {
          throw app.httpErrors.conflict('Administrator already exists');
        }

        throw app.httpErrors.internalServerError(error.message);
      }
    },
    deleteAdministrator: async (administratorId: string) => {
      const administrator = await app.administratorService.findAdministrator(administratorId);

      if (administrator) {
        await app.administratorRepository.deleteAdministrator(administratorId);
      }
    },
    filterAdministrators: async (queryOptions) => {
      const order = queryOptions.order ?? 'createdAt desc';
      const pageSize = queryOptions.pageSize ?? defaultPagination;
      const page = queryOptions.page ? (queryOptions.page - 1) * pageSize : 0;
      const total = await app.administratorRepository.countAdministrators(queryOptions);
      const totalPages = Math.ceil(total.count / pageSize);

      const administrators = await app.administratorRepository.filterAdministrators({
        ...queryOptions,
        order,
        page,
        pageSize,
      });

      const meta = {
        count: administrators.length,
        page: queryOptions.page,
        pageSize,
        total: total.count,
        totalPages,
      };

      return [administrators, meta];
    },
    findAdministrator: async (administratorIdOrEmail, findByEmail = false) => {
      const administrator = findByEmail
        ? await app.administratorRepository.findAdministratorByEmail(administratorIdOrEmail)
        : await app.administratorRepository.findAdministratorById(administratorIdOrEmail);

      if (!administrator) {
        throw app.httpErrors.notFound('Administrator not found');
      }

      return administrator;
    },
    updateAdministrator: async (administratorId, data) => {
      try {
        const administrator = await app.administratorService.findAdministrator(administratorId);
        const emailChanged = data.email !== administrator.email;
        const passwordChanged = data.password !== administrator.password;

        await app.administratorRepository.updateAdministrator({
          ...administrator,
          ...data,
          id: administratorId,
          email: data.email ?? administrator.email,
          isVerified: emailChanged ? false : administrator.isVerified,
          organizationId: administrator.organizationId,
          password: passwordChanged ? await app.passwordHash(data.password) : administrator.password,
          updatedAt: utcDate(),
        });

        if (emailChanged) {
          // app.eventEmitter.publish('administrator_change_email', administratorId); TODO new email confirmation
        }

        if (passwordChanged) {
          app.administratorEvents.emit('administratorChangePassword', administratorId);
        }
      } catch (error) {
        if ('code' in error && error.code === 'ER_DUP_ENTRY') {
          throw app.httpErrors.conflict('Administrator already exists');
        }

        throw app.httpErrors.internalServerError(error.message);
      }
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    administratorService: AdministratorService;
  }
}

export { administratorService };
