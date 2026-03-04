import {
  Administrator,
  Campaign,
  Game,
  Match,
  Organization,
  Player,
  RefreshToken,
  Session,
} from '@warpzone/shared-schemas';

declare module 'knex/types/tables' {
  interface Tables {
    administrator: Administrator;
    campaign: Campaign;
    game: Game;
    match: Match;
    organization: Organization;
    player: Player;
    refreshToken: RefreshToken;
    session: Session;
  }
}
