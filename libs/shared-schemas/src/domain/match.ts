import { Composite, Optional, Partial, Static, String } from '@sinclair/typebox';
import { PaginationQuery, SortingQuery } from '../utils/query-options';
import { StrictObject, StrictPick } from '../utils/schema-helpers';

const Match = StrictObject({
  id: Optional(String({ format: 'uuid' })),
  playerId: String({ format: 'uuid' }),
  sessionId: String({ format: 'uuid' }),
  createdAt: Optional(String({ format: 'date-time' })),
  updatedAt: Optional(String({ format: 'date-time' })),
});

const MatchQuery = Composite([
  PaginationQuery,
  SortingQuery('createdAt'),
  Partial(StrictPick(Match, ['playerId', 'sessionId'])),
]);

type Match = Static<typeof Match>;

type MatchQuery = Static<typeof MatchQuery>;

export { Match, MatchQuery };
