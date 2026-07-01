import { useMemo } from 'react';
import { selectHasActiveFilters, useTaskFiltersStore } from '../stores/taskFiltersStore';
import { useTaskStore } from '../stores/taskStore';
import { filterTasks } from '../utils/taskFilters';

export function useTaskFilters() {
  const tasks = useTaskStore((state) => state.tasks);
  const filters = useTaskFiltersStore((state) => state.filters);
  const openFilter = useTaskFiltersStore((state) => state.openFilter);
  const setSearch = useTaskFiltersStore((state) => state.setSearch);
  const toggleSkill = useTaskFiltersStore((state) => state.toggleSkill);
  const toggleNeighborhood = useTaskFiltersStore((state) => state.toggleNeighborhood);
  const setOpenFilter = useTaskFiltersStore((state) => state.setOpenFilter);
  const resetFilters = useTaskFiltersStore((state) => state.resetFilters);
  const hasActiveFilters = useTaskFiltersStore(selectHasActiveFilters);

  const filteredTasks = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);

  return {
    filters,
    filteredTasks,
    openFilter,
    setSearch,
    toggleSkill,
    toggleNeighborhood,
    setOpenFilter,
    resetFilters,
    hasActiveFilters,
  };
}
