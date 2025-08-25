import { TeamType } from '../tournament/types';
export declare interface GameType {
  [key: string]: any;
  pk?: number;
  tournament?: number;
  round?: number;
  date_played?: string;
  radiant_team?: TeamType;
  radiant_team_id?: Number; // For write
  dire_team?: TeamType;
  dire_team_id?: Number; // For Write
  winning_team?: TeamType;
  winning_team_id?: Number; // for write
  gameid?: Number; //SteamId for the game if it exists
}
export type GamesType = GameType[];
