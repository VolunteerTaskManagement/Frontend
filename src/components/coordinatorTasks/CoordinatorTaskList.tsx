import { Spinner, Text, VStack } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { brandColors } from '../../theme/tokens';
import type { TaskListItem } from '../../types/task';
import type { CoordinatorTaskTab } from '../../stores/coordinatorTaskStore';
import CoordinatorTaskCard from './CoordinatorTaskCard';

interface CoordinatorTaskListProps {
  tasks: TaskListItem[];
  activeTab: CoordinatorTaskTab;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  onRemoveTask: (id: number) => void;
  onEditTask: (task: TaskListItem) => void;
}

const CoordinatorTaskList = ({
  tasks,
  activeTab,
  isLoading,
  isLoadingMore,
  hasNextPage,
  onLoadMore,
  onRemoveTask,
  onEditTask
}: CoordinatorTaskListProps) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin: '200px' },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasNextPage, onLoadMore]);

  if (isLoading) {
    return (
      <VStack py="12" gap="3">
        <Spinner color="brand.500" size="lg" />
        <Text color={brandColors.textSecondary} fontSize="sm">
          در حال بارگذاری...
        </Text>
      </VStack>
    );
  }

  if (tasks.length === 0) {
    return (
      <VStack py="12" gap="2" textAlign="center">
        <Text fontSize="md" fontWeight="bold" color={brandColors.textPrimary}>
          تسکی یافت نشد
        </Text>
        <Text fontSize="sm" color={brandColors.textSecondary}>
          در این دسته تسکی ندارید.
        </Text>
      </VStack>
    );
  }

  return (
    <VStack align="stretch" gap="4">
      {tasks.map((task) => (
        <CoordinatorTaskCard key={task.id} task={task} activeTab={activeTab} onRemove={onRemoveTask} onEdit={onEditTask} />
      ))}

      {hasNextPage && (
        <VStack ref={sentinelRef} py="4">
          {isLoadingMore && <Spinner color="brand.500" size="md" />}
        </VStack>
      )}
    </VStack>
  );
};

export default CoordinatorTaskList;