import { create } from 'zustand';
import { DEFAULT_TASK_FILTERS } from '../constants/tasks';
import type { FilterType, TaskFilters } from '../types/task';

interface TaskFiltersState {
  filters: TaskFilters;
  openFilter: FilterType | null;
  setSearch: (search: string) => void;
  toggleSkill: (skill: string) => void;
  toggleNeighborhood: (neighborhood: string) => void;
  setOpenFilter: (filter: FilterType | null) => void;
  resetFilters: () => void;
}

export const useTaskFiltersStore = create<TaskFiltersState>((set) => ({
  filters: DEFAULT_TASK_FILTERS,
  openFilter: null,

  setSearch: (search) =>
    set((state) => ({
      filters: { ...state.filters, search },
    })),

  toggleSkill: (skill) =>
    set((state) => ({
      filters: {
        ...state.filters,
        skills: state.filters.skills.includes(skill)
          ? state.filters.skills.filter((item) => item !== skill)
          : [...state.filters.skills, skill],
      },
    })),

  toggleNeighborhood: (neighborhood) =>
    set((state) => ({
      filters: {
        ...state.filters,
        neighborhoods: state.filters.neighborhoods.includes(neighborhood)
          ? state.filters.neighborhoods.filter((item) => item !== neighborhood)
          : [...state.filters.neighborhoods, neighborhood],
      },
    })),

  setOpenFilter: (openFilter) => set({ openFilter }),

  resetFilters: () =>
    set({
      filters: DEFAULT_TASK_FILTERS,
      openFilter: null,
    }),
}));

const arraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((item, index) => item === b[index]);

export const selectHasActiveFilters = (state: TaskFiltersState) => {
  const { filters } = state;

  return (
    filters.search.trim().length > 0 ||
    !arraysEqual(filters.skills, DEFAULT_TASK_FILTERS.skills) ||
    !arraysEqual(filters.neighborhoods, DEFAULT_TASK_FILTERS.neighborhoods)
  );
};
