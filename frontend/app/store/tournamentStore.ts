import { create } from 'zustand';

interface TournamentState {
  live: boolean;
  setLive: (live: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useTournamentStore = create<TournamentState>((set) => ({
  live: false,
  setLive: (live) => set({ live }),
  activeTab: 'players',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
