import { Spinner, Text, VStack } from '@chakra-ui/react';
import { brandColors } from '../../theme/tokens';
import type { Task } from '../../types/task';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
}

const TaskList = ({ tasks, isLoading }: TaskListProps) => {
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
    </VStack>
  );
};

export default TaskList;
