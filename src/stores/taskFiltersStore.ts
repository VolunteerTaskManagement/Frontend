import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FilterType, TaskFilters } from '../types/task';

export const DEFAULT_TASK_FILTERS: TaskFilters = {
  search: '',
  skillIds: [],
  neighborhoodIds: [],
  statusIds: [1],
};

interface TaskFiltersState {
  filters: TaskFilters;
  openFilter: FilterType | null;
  setSearch: (search: string) => void;
  toggleSkill: (skillId: number) => void;
  toggleNeighborhood: (neighborhoodId: number) => void;
  toggleStatus: (statusId: number) => void;
  setOpenFilter: (filter: FilterType | null) => void;
  resetFilters: () => void;
  initFromProfile: (skillIds: number[], neighborhoodId: number | null) => void;
}

export const useTaskFiltersStore = create<TaskFiltersState>()(
  persist(
    (set) => ({
      filters: DEFAULT_TASK_FILTERS,
      openFilter: null,

      setSearch: (search) =>
        set((state) => ({
          filters: { ...state.filters, search },
        })),

      toggleSkill: (skillId) =>
        set((state) => ({
          filters: {
            ...state.filters,
            skillIds: state.filters.skillIds.includes(skillId)
              ? state.filters.skillIds.filter((item) => item !== skillId)
              : [...state.filters.skillIds, skillId],
          },
        })),

      toggleNeighborhood: (neighborhoodId) =>
        set((state) => ({
          filters: {
            ...state.filters,
            neighborhoodIds: state.filters.neighborhoodIds.includes(neighborhoodId)
              ? state.filters.neighborhoodIds.filter((item) => item !== neighborhoodId)
              : [...state.filters.neighborhoodIds, neighborhoodId],
          },
        })),

      toggleStatus: (statusId) =>
        set((state) => ({
          filters: {
            ...state.filters,
            statusIds: state.filters.statusIds.includes(statusId)
              ? state.filters.statusIds.filter((item) => item !== statusId)
              : [...state.filters.statusIds, statusId],
          },
        })),

      setOpenFilter: (openFilter) => set({ openFilter }),
      resetFilters: () =>
        set({
          filters: DEFAULT_TASK_FILTERS,
          openFilter: null,
        }),

      // تنظیم فیلترهای اولیه بر اساس پروفایل داوطلب بعد از لاگین
      initFromProfile: (skillIds, neighborhoodId) =>
        set({
          filters: {
            ...DEFAULT_TASK_FILTERS,
            skillIds,
            neighborhoodIds: neighborhoodId ? [neighborhoodId] : [],
          },
        }),
    }),
    {
      // فیلترها توی localStorage ذخیره می‌شن تا با رفرش صفحه از بین نرن
      // (چون initFromProfile فقط لحظه‌ی لاگین صدا زده می‌شه، نه با هر رفرش)
      name: 'narm-task-filters',
      storage: createJSONStorage(() => localStorage),
      // openFilter یک state موقتیه (کدوم پنل فیلتر همین الان بازه)؛ نیازی به ذخیره‌ش نیست
      partialize: (state) => ({ filters: state.filters }),
    },
  ),
);

const arraysEqual = (a: number[], b: number[]) =>
  a.length === b.length && a.every((item, index) => item === b[index]);

export const selectHasActiveFilters = (state: TaskFiltersState) => {
  const { filters } = state;

  return (
    filters.search.trim().length > 0 ||
    !arraysEqual(filters.skillIds, DEFAULT_TASK_FILTERS.skillIds) ||
    !arraysEqual(filters.neighborhoodIds, DEFAULT_TASK_FILTERS.neighborhoodIds) ||
    !arraysEqual(filters.statusIds, DEFAULT_TASK_FILTERS.statusIds)
  );
};