import { FastifyPluginAsync } from 'fastify';
import { Organization, OrganizationGame, OrganizationQuery } from '@warpzone/shared-schemas';
import { isNullOrEmpty, removeNullable, utcDate } from '@warpzone/shared-utils';

type OrganizationRepository = {
  countOrganizations: (queryOptions: OrganizationQuery) => Promise<{ count: number }>;
  createOrganization: (organization: Organization) => Promise<void>;
  deleteOrganization: (organizationId: string) => Promise<void>;
  filterOrganizations: (queryOptions: OrganizationQuery) => Promise<Organization[]>;
  findOrganization: (organizationId: string) => Promise<Organization | null>;
  getOrganizationGames: (organizationId: string) => Promise<OrganizationGame[]>;
  setOrganizationGames: (organizationId: string, games: OrganizationGame[]) => Promise<void>;
  updateOrganization: (organization: Organization) => Promise<void>;
};

const welcomeToWarpZoneId = '64329730-22f4-47ce-aeef-69531cdb3db9';

const organizationRepository: FastifyPluginAsync = async (app) => {
  app.decorate<OrganizationRepository>('organizationRepository', {
    countOrganizations: async () => {
      return await app.knex
        .count('* as count')
        .from('organization')
        .whereNot('id', welcomeToWarpZoneId)
        .first();
    },
    createOrganization: async (organization) => {
      await app.knex.insert(organization).into('organization');
    },
    deleteOrganization: async (organizationId) => {
      await app.knex.from('organization').where('id', organizationId).del();
    },
    filterOrganizations: async (queryOptions) => {
      const [column, order] = queryOptions.order.split(' ');

      const organizations = await app.knex
        .select('*')
        .from('organization')
        .whereNot('id', welcomeToWarpZoneId)
        .orderBy([
          { column, order },
          { column: 'id', order },
        ])
        .modify((query) => {
          if (queryOptions.search) {
            query
              .whereILike('name', `%${queryOptions.search}%`)
              .orWhereILike('email', `%${queryOptions.search}%`);
          }

          return query;
        })
        .offset(queryOptions.page)
        .limit(queryOptions.pageSize);

      return organizations.map((organization: Organization) => removeNullable(organization));
    },
    findOrganization: async (organizationId) => {
      const organization = await app.knex
        .select('*')
        .from('organization')
        .where('id', organizationId)
        .first();

      if (isNullOrEmpty(organization)) {
        return null;
      }

      return removeNullable(organization);
    },
    getOrganizationGames: async (organizationId) => {
      const games = await app.knex
        .select('game.*', 'organizationGame.activeUntil')
        .from('game')
        .join('organizationGame', 'game.id', 'organizationGame.gameId')
        .where('organizationGame.organizationId', organizationId)
        .where((builder) => {
          builder
            .where('organizationGame.activeUntil', '>=', utcDate())
            .orWhereNull('organizationGame.activeUntil');
        });

      return games.map((game: OrganizationGame) => removeNullable(game));
    },
    setOrganizationGames: async (organizationId, games) => {
      await app.knex.from('organizationGame').where('organizationId', organizationId).del();

      for await (const game of games) {
        await app.knex
          .insert({
            organizationId,
            gameId: game.id,
            activeUntil: game.activeUntil && utcDate(game.activeUntil),
          })
          .into('organizationGame');
      }
    },
    updateOrganization: async (organization) => {
      await app.knex.from('organization').update(organization).where('id', organization.id);
    },
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    organizationRepository: OrganizationRepository;
  }
}

export { organizationRepository };
