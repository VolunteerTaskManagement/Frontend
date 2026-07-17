import { create } from 'zustand';
import { getProfile } from '../services/profileService';
import type { ProfileResponse } from '../types/profile';

interface ProfileState {
  profile: ProfileResponse['value'] | null;
  isLoading: boolean;
  hasFetched: boolean;
  fetchProfile: () => Promise<void>;
  setProfile: (profile: ProfileResponse['value']) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  hasFetched: false,

  fetchProfile: async () => {
    if (get().hasFetched || get().isLoading) return;

    set({ isLoading: true });

    try {
      const res = await getProfile();
      set({ profile: res.value, isLoading: false, hasFetched: true });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },

  setProfile: (profile) => set({ profile, hasFetched: true }),

  resetProfile: () => set({ profile: null, isLoading: false, hasFetched: false }),
}));