import { selectHasActiveFilters, useTaskFiltersStore } from '../stores/taskFiltersStore';

export function useTaskFilters() {
  const filters = useTaskFiltersStore((state) => state.filters);
  const openFilter = useTaskFiltersStore((state) => state.openFilter);
  const setSearch = useTaskFiltersStore((state) => state.setSearch);
  const toggleSkill = useTaskFiltersStore((state) => state.toggleSkill);
  const toggleNeighborhood = useTaskFiltersStore((state) => state.toggleNeighborhood);
  const toggleStatus = useTaskFiltersStore((state) => state.toggleStatus);
  const setOpenFilter = useTaskFiltersStore((state) => state.setOpenFilter);
  const resetFilters = useTaskFiltersStore((state) => state.resetFilters);
  const hasActiveFilters = useTaskFiltersStore(selectHasActiveFilters);

  return {
    filters,
    openFilter,
    setSearch,
    toggleSkill,
    toggleNeighborhood,
    toggleStatus,
    setOpenFilter,
    resetFilters,
    hasActiveFilters,
  };
}