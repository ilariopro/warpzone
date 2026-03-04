import { FastifyPluginAsync } from 'fastify';
import { Metadata, Organization, OrganizationGame, OrganizationQuery } from '@warpzone/shared-schemas';
import { utcDate, uuid } from '@warpzone/shared-utils';
import { defaultPagination } from '../../config';

type OrganizationService = {
  createOrganization: (data: Organization) => Promise<string>;
  deleteOrganization: (organizationId: string) => Promise<void>;
  filterOrganizations: (queryOptions: OrganizationQuery) => Promise<[Organization[], Metadata]>;
  findOrganization: (organizationId: string) => Promise<Organization>;
  getOrganizationGames: (organizationId: string) => Promise<OrganizationGame[]>;
  setOrganizationGames: (organizationId: string, games: OrganizationGame[]) => Promise<void>;
  updateOrganization: (organizationId: string, data: Partial<Organization>) => Promise<void>;
};

const organizationService: FastifyPluginAsync = async (app) => {
  app.decorate<OrganizationService>('organizationService', {
    createOrganization: async (data) => {
      try {
        const organizationId = uuid();

        await app.organizationRepository.createOrganization({
          ...data,
          id: organizationId,
          createdAt: utcDate(),
        });

        return organizationId;
      } catch (error) {
        if ('code' in error && error.code === 'ER_DUP_ENTRY') {
          throw app.httpErrors.conflict('Organization already exists');
        }

        throw app.httpErrors.internalServerError(error.message);
      }
    },
    deleteOrganization: async (organizationId) => {
      const organization = await app.organizationService.findOrganization(organizationId);

      if (organization) {
        await app.organizationRepository.deleteOrganization(organizationId);
      }
    },
    filterOrganizations: async (queryOptions) => {
      const order = queryOptions.order ?? 'createdAt desc';
      const pageSize = queryOptions.pageSize ?? defaultPagination;
      const page = queryOptions.page ? (queryOptions.page - 1) * pageSize : 0;
      const total = await app.organizationRepository.countOrganizations(queryOptions);
      const totalPages = Math.ceil(total.count / pageSize);

      const organizations = await app.organizationRepository.filterOrganizations({
        ...queryOptions,
        order,
        page,
        pageSize,
      });

      const meta = {
        count: organizations.length,
        page: queryOptions.page,
        pageSize,
        total: total.count,
        totalPages,
      };
      return [organizations, meta];
    },
    findOrganization: async (organizationId) => {
      const organization = await app.organizationRepository.findOrganization(organizationId);

      if (!organization) {
        throw app.httpErrors.notFound('Organization not found');
      }

      return organization;
    },
    getOrganizationGames: async (organizationId) => {
      return await app.organizationRepository.getOrganizationGames(organizationId);
    },
    setOrganizationGames: async (organizationId, games) => {
      await app.organizationRepository.setOrganizationGames(organizationId, games);
    },
    updateOrganization: async (organizationId, data) => {
      try {
        const organization = await app.organizationService.findOrganization(organizationId);

        await app.organizationRepository.updateOrganization({
          ...organization,
          ...data,
          id: organizationId,
          createdAt: organization.createdAt,
          updatedAt: utcDate(),
        });
      } catch (error) {
        if ('code' in error && error.code === 'ER_DUP_ENTRY') {
          throw app.httpErrors.conflict('Organization already exists');
        }

        throw app.httpErrors.internalServerError(error.message);
      }
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    organizationService: OrganizationService;
  }
}

export { organizationService };
