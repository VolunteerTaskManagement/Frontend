import { useEffect } from 'react';
import { useTaskFiltersStore } from '../stores/taskFiltersStore';
import { useTaskStore } from '../stores/taskStore';

export function useTasks() {
  const tasks = useTaskStore((state) => state.tasks);
  const isLoading = useTaskStore((state) => state.isLoading);
  const isLoadingMore = useTaskStore((state) => state.isLoadingMore);
  const hasNextPage = useTaskStore((state) => state.hasNextPage);
  const filteredCount = useTaskStore((state) => state.filteredCount);
  const error = useTaskStore((state) => state.error);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const fetchNextPage = useTaskStore((state) => state.fetchNextPage);

  const filters = useTaskFiltersStore((state) => state.filters);

  useEffect(() => {
    fetchTasks(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.skillIds, filters.neighborhoodIds, filters.statusIds]);

  const loadMore = () => fetchNextPage(filters);

  return {
    tasks,
    isLoading,
    isLoadingMore,
    hasNextPage,
    filteredCount,
    error,
    loadMore,
  };
}