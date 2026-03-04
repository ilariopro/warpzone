import { Composite, Optional, Partial, Static, String } from '@sinclair/typebox';
import { PaginationQuery, SortingQuery } from '../utils/query-options';
import { StrictObject, StrictPick } from '../utils/schema-helpers';

const Session = StrictObject({
  id: Optional(String({ format: 'uuid' })),
  startAt: String({ format: 'date-time' }),
  endAt: Optional(String({ format: 'date-time' })),
  campaignId: String({ format: 'uuid' }),
  createdAt: Optional(String({ format: 'date-time' })),
  updatedAt: Optional(String({ format: 'date-time' })),
});

const SessionQuery = Composite([
  PaginationQuery,
  SortingQuery('createdAt', 'startAt', 'endAt'),
  Partial(StrictPick(Session, ['campaignId'])),
]);

type Session = Static<typeof Session>;

type SessionQuery = Static<typeof SessionQuery>;

export { Session, SessionQuery };
