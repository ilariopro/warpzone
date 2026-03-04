import { Composite, Optional, Static, String } from '@sinclair/typebox';
import { PaginationQuery, SearchQuery, SortingQuery } from '../utils/query-options';
import { Game } from './game';
import { StrictObject } from '../utils/schema-helpers';

const Organization = StrictObject({
  id: Optional(String({ format: 'uuid' })),
  name: String({ minLength: 1 }),
  email: Optional(String({ format: 'email' })),
  description: Optional(String()),
  createdAt: Optional(String({ format: 'date-time' })),
  updatedAt: Optional(String({ format: 'date-time' })),
});

const OrganizationGame = Composite([
  Game,
  StrictObject({ activeUntil: Optional(String({ format: 'date-time' })) }),
]);

const OrganizationQuery = Composite([PaginationQuery, SearchQuery, SortingQuery('createdAt')]);

type Organization = Static<typeof Organization>;

type OrganizationGame = Static<typeof OrganizationGame>;

type OrganizationQuery = Static<typeof OrganizationQuery>;

export { Organization, OrganizationGame, OrganizationQuery };
