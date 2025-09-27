export interface CreateTeamFromCaptainAPI {
  tournament_pk: number;
  user_pk: number;
  draft_order?: number;
}

export interface InitDraftRoundsAPI {
  tournament_pk: number;
}

export interface RebuildDraftRoundsAPI {
  tournament_pk: number;
}

export interface PickPlayerForRoundAPI {
  draft_round_pk: number;
  user_pk: number;
}

export interface GetDraftStyleMMRsAPI {
  draft_pk: number;
}

export interface DraftStyleMMRsAPIReturn {
  draft_pk: number;
  snake_first_pick_mmr: number;
  snake_last_pick_mmr: number;
  normal_first_pick_mmr: number;
  normal_last_pick_mmr: number;
}
