export type DraftEventType =
  | "draft_started"
  | "draft_completed"
  | "captain_assigned"
  | "player_picked"
  | "tie_roll"
  | "pick_undone";

export interface DraftEvent {
  pk: number;
  event_type: DraftEventType;
  payload: DraftEventPayload;
  actor: {
    pk: number;
    username: string;
    avatarUrl: string | null;
  } | null;
  created_at: string;
}

export type DraftEventPayload =
  | DraftStartedPayload
  | DraftCompletedPayload
  | CaptainAssignedPayload
  | PlayerPickedPayload
  | TieRollPayload
  | PickUndonePayload;

export interface DraftStartedPayload {
  draft_id: number;
  draft_style: string;
  team_count: number;
}

export interface DraftCompletedPayload {
  draft_id: number;
  draft_style: string;
  team_count: number;
}

export interface CaptainAssignedPayload {
  round: number;
  captain_id: number;
  captain_name: string;
  team_id: number;
  was_tie: boolean;
}

export interface PlayerPickedPayload {
  round: number;
  captain_id: number;
  captain_name: string;
  picked_id: number;
  picked_name: string;
  team_id: number;
}

export interface TieRollPayload {
  tied_captains: {
    id: number;
    name: string;
    mmr: number;
  }[];
  roll_rounds: {
    captain_id: number;
    roll: number;
  }[][];
  winner_id: number;
  winner_name: string;
}

export interface PickUndonePayload {
  round: number;
  captain_name: string;
  picked_name: string;
}

export interface WebSocketMessage {
  type: "initial_events" | "draft_event";
  events?: DraftEvent[];
  event?: DraftEvent;
}
