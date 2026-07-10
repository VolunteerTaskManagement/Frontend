import { useEffect } from 'react';
import { useCoordinatorTaskStore } from '../stores/coordinatorTaskStore';

export function useCoordinatorTasks() {
  const tasks = useCoordinatorTaskStore((state) => state.tasks);
  const activeTab = useCoordinatorTaskStore((state) => state.activeTab);
  const isLoading = useCoordinatorTaskStore((state) => state.isLoading);
  const isLoadingMore = useCoordinatorTaskStore((state) => state.isLoadingMore);
  const hasNextPage = useCoordinatorTaskStore((state) => state.hasNextPage);
  const filteredCount = useCoordinatorTaskStore((state) => state.filteredCount);
  const error = useCoordinatorTaskStore((state) => state.error);
  const setActiveTab = useCoordinatorTaskStore((state) => state.setActiveTab);
  const fetchTasks = useCoordinatorTaskStore((state) => state.fetchTasks);
  const fetchNextPage = useCoordinatorTaskStore((state) => state.fetchNextPage);
  const removeTaskLocally = useCoordinatorTaskStore((state) => state.removeTaskLocally);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    removeTaskLocally,
  };
}