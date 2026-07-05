import { useEffect } from 'react';
import { useMyTaskStore } from '../stores/myTaskStore';

export function useMyTasks() {
  const tasks = useMyTaskStore((state) => state.tasks);
  const activeTab = useMyTaskStore((state) => state.activeTab);
  const isLoading = useMyTaskStore((state) => state.isLoading);
  const isLoadingMore = useMyTaskStore((state) => state.isLoadingMore);
  const hasNextPage = useMyTaskStore((state) => state.hasNextPage);
  const filteredCount = useMyTaskStore((state) => state.filteredCount);
  const error = useMyTaskStore((state) => state.error);
  const setActiveTab = useMyTaskStore((state) => state.setActiveTab);
  const fetchMyTasks = useMyTaskStore((state) => state.fetchMyTasks);
  const fetchNextPage = useMyTaskStore((state) => state.fetchNextPage);

  useEffect(() => {
    fetchMyTasks();
  }, [fetchMyTasks]);

  return {
    tasks,
    activeTab,
    isLoading,
    isLoadingMore,
    hasNextPage,
    filteredCount,
    error,
    setActiveTab,
    loadMore: fetchNextPage,
  };
}