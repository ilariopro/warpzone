import { Boolean, Composite, Optional, Partial, Static, String } from '@sinclair/typebox';
import { SortingQuery } from '../utils/query-options';
import { StrictObject, StrictPick } from '../utils/schema-helpers';

const Game = StrictObject({
  id: String({ minLength: 1 }),
  title: String({ minLength: 1 }),
  hasScheduledSessions: Boolean(),
  hasTeams: Boolean(),
  createdAt: Optional(String({ format: 'date-time' })),
  updatedAt: Optional(String({ format: 'date-time' })),
});

const GameQuery = Composite([
  SortingQuery('createdAt'),
  Partial(StrictPick(Game, ['hasScheduledSessions', 'hasTeams'])),
]);

type Game = Static<typeof Game>;

type GameQuery = Static<typeof GameQuery>;

export { Game, GameQuery };
