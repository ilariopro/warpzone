import { Array, Composite, Number, Optional, Partial, Record, Static, String } from '@sinclair/typebox';
import { IncludeQuery, PaginationQuery, SortingQuery } from '../utils/query-options';
import { Player } from './player';
import { StrictObject, StrictPick } from '../utils/schema-helpers';

const Campaign = StrictObject({
  id: Optional(String({ format: 'uuid' })),
  title: String({ minLength: 1 }),
  gameId: String({ minLength: 1 }),
  organizationId: String({ format: 'uuid' }),
  createdAt: Optional(String({ format: 'date-time' })),
  updatedAt: Optional(String({ format: 'date-time' })),
});

const CampaignCounts = Composite([
  Campaign,
  StrictObject({
    playerCount: Optional(Number()),
    sessionCount: Optional(Number()),
    teamCount: Optional(Number()),
  }),
]);

const CampaignPlayer = Composite([
  Player,
  StrictObject({
    team: Optional(String({ minLength: 1 })),
    notifiedAt: Optional(String({ format: 'date-time' })),
  }),
]);

const CampaignQuery = Composite([
  IncludeQuery,
  PaginationQuery,
  SortingQuery('createdAt'),
  Partial(StrictPick(Campaign, ['organizationId', 'gameId'])),
]);

const Teams = Record(String({ minLength: 1 }), Array(CampaignPlayer));

type Campaign = Static<typeof Campaign>;

type CampaignCounts = Static<typeof CampaignCounts>;

type CampaignPlayer = Static<typeof CampaignPlayer>;

type CampaignQuery = Static<typeof CampaignQuery>;

type Teams = Static<typeof Teams>;

export { Campaign, CampaignCounts, CampaignPlayer, CampaignQuery, Teams };
