import { create } from 'zustand';
import { getDraftStyleMMRs } from '~/components/api/api';
import type { DraftStyleMMRsAPIReturn } from '~/components/api/types';
export interface TournamentState {
  live: boolean;
  setLive: (live: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  liveReload: boolean;
  setLiveReload: (liveReload: boolean) => void;
  toggleLiveReload: () => void;
  draftPredictedMMRs: DraftStyleMMRsAPIReturn;
  setDraftPredictedMMRs: (data: DraftStyleMMRsAPIReturn) => void;
  updateDraftPredictedMMRs: (draft_pk: number) => Promise<void>;
}

export const useTournamentStore = create<TournamentState>((set, get) => ({
  live: false,
  setLive: (live: boolean) => set({ live }),
  activeTab: 'players',
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  liveReload: false,
  toggleLiveReload: () => get().setLiveReload(!get().liveReload),
  setLiveReload: (liveReload: boolean) => set({ liveReload }),
  draftPredictedMMRs: {} as DraftStyleMMRsAPIReturn,
  updateDraftPredictedMMRs: async (pk: number) => {
    try {
      const response = await getDraftStyleMMRs({ pk });
      set({ draftPredictedMMRs: response });
    } catch (error) {
      console.error('Failed to fetch draft predicted MMRs:', error);
    }
  },
  setDraftPredictedMMRs: (data: DraftStyleMMRsAPIReturn) =>
    set({ draftPredictedMMRs: data }),
}));
