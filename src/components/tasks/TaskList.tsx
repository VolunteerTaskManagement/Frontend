import { Spinner, Text, VStack } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { brandColors } from '../../theme/tokens';
import type { TaskListItem } from '../../types/task';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: TaskListItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

const TaskList = ({ tasks, isLoading, isLoadingMore, hasNextPage, onLoadMore }: TaskListProps) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // وقتی sentinel وارد دید می‌شود، صفحه‌ی بعدی از API گرفته می‌شود (infinite scroll)
  useEffect(() => {
    if (!hasNextPage) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
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
          در حال بارگذاری وظایف...
        </Text>
      </VStack>
    );
  }

  return (
    <VStack align="stretch" gap="4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

      {hasNextPage && (
        <VStack ref={sentinelRef} py="4">
          {isLoadingMore && <Spinner color="brand.500" size="md" />}
        </VStack>
      )}
    </VStack>
  );
};

export default TaskList;