import type {
  GameType,
  STATE_CHOICES,
  TeamType,
  TournamentClassType,
  TournamentType,
} from './types';

import type { UserType } from '../user/types';
import type { TOURNAMENT_TYPE } from './constants';

import {
  createTournament,
  deleteTournament,
  fetchTournament,
  updateTournament,
} from '~/components/api/api';

import { getLogger } from '~/lib/logger';
const log = getLogger('tournamentClass');
export class Tournament implements TournamentClassType {
  name!: string;
  date_played!: string;
  users?: UserType[];
  user_ids?: number[];
  teams?: TeamType[];
  pk?: number;
  winning_team?: number;
  state?: STATE_CHOICES;
  tournament_type?: TOURNAMENT_TYPE;
  games?: GameType[];

  constructor(data: TournamentType) {
    Object.assign(this, data);
  }

  async dbFetch(): Promise<void> {
    if (!this.pk) {
      throw new Error('User primary key (pk) is not set.');
    }
    try {
      const data = await fetchTournament(this.pk);
      Object.assign(this, data);
    } catch (error) {
      log.error('Error fetching user data:', error);
      throw error;
    }
  }

  async dbUpdate(data: Partial<TournamentType>): Promise<void> {
    if (!this.pk) {
      throw new Error('User primary key (pk) is not set.');
    }

    try {
      const updatedData = await updateTournament(this.pk, data);
      Object.assign(this, updatedData);
    } catch (error) {
      log.error('Error fetching user data:', error);
      throw error;
    }
  }

  async dbDelete(): Promise<void> {
    if (!this.pk) {
      throw new Error('User primary key (pk) is not set.');
    }
    try {
      await deleteTournament(this.pk);
      Object.assign({});
    } catch (error) {
      log.error('Error fetching user data:', error);
      throw error;
    }
  }
  async dbCreate(): Promise<void> {
    try {
      await createTournament(this as TournamentType);
    } catch (error) {
      log.error('Error creating user data:', error);
      throw error;
    }
  }
  // Mutates the current instance with values from a GuildMember
}
