import { create } from 'zustand';
import { fetchNeighborhoods, fetchSkills } from '../services/OptionsService';
import type { NeighborhoodOption, SkillOption } from '../types/task';

interface OptionsState {
  skills: SkillOption[];
  neighborhoods: NeighborhoodOption[];
  isLoading: boolean;
  isSearchingNeighborhoods: boolean;
  error: string | null;
  fetchOptions: () => Promise<void>;
  searchNeighborhoods: (title: string) => Promise<void>;
}

let neighborhoodSearchTimer: ReturnType<typeof setTimeout> | null = null;

export const useOptionsStore = create<OptionsState>((set) => ({
  skills: [],
  neighborhoods: [],
  isLoading: false,
  isSearchingNeighborhoods: false,
  error: null,

  fetchOptions: async () => {
    set({ isLoading: true, error: null });

    try {
      const [skillsRes, neighborhoodsRes] = await Promise.all([
        fetchSkills(),
        fetchNeighborhoods(),
      ]);

      set({
        skills: skillsRes.value,
        neighborhoods: neighborhoodsRes.value,
        isLoading: false,
      });
    } catch {
      set({
        error: 'بارگذاری فیلترها با خطا مواجه شد.',
        isLoading: false,
      });
    }
  },

  searchNeighborhoods: (title) => {
    return new Promise((resolve) => {
      if (neighborhoodSearchTimer) clearTimeout(neighborhoodSearchTimer);

      neighborhoodSearchTimer = setTimeout(async () => {
        set({ isSearchingNeighborhoods: true });

        try {
          const res = await fetchNeighborhoods(title ? { Title: title } : undefined);
          set({ neighborhoods: res.value, isSearchingNeighborhoods: false });
        } catch {
          set({ isSearchingNeighborhoods: false });
        }

        resolve();
      }, 400);
    });
  },
}));