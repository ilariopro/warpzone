import { Composite, Optional, Partial, Static, String } from '@sinclair/typebox';
import { PaginationQuery, SearchQuery, SortingQuery } from '../utils/query-options';
import { StrictObject, StrictPick } from '../utils/schema-helpers';

const Player = StrictObject({
  id: Optional(String({ format: 'uuid' })),
  email: String({ format: 'email' }),
  name: Optional(String({ minLength: 1 })),
  organizationId: String({ format: 'uuid' }),
  createdAt: Optional(String({ format: 'date-time' })),
  updatedAt: Optional(String({ format: 'date-time' })),
});

const PlayerQuery = Composite([
  PaginationQuery,
  SearchQuery,
  SortingQuery('createdAt'),
  Partial(StrictPick(Player, ['organizationId'])),
]);

type Player = Static<typeof Player>;

type PlayerQuery = Static<typeof PlayerQuery>;

export { Player, PlayerQuery };
