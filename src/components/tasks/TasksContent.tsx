import { Box, VStack } from '@chakra-ui/react';
import { useTaskFilters } from '../../hooks/useTaskFilters';
import { useTasks } from '../../hooks/useTasks';
import ProfileMatchBanner from './ProfileMatchBanner';
import TaskEmptyState from './TaskEmptyState';
import TaskFilterBar from './TaskFilterBar';
import TaskList from './TaskList';
import TaskResultsBar from './TaskResultsBar';
import TaskSearchBar from './TaskSearchBar';

const TasksContent = () => {
  const { isLoading, error } = useTasks();
  const {
    filters,
    filteredTasks,
    openFilter,
    setSearch,
    toggleSkill,
    toggleNeighborhood,
    setOpenFilter,
    resetFilters,
    hasActiveFilters,
  } = useTaskFilters();

  return (
    <VStack align="stretch" gap="4" dir="rtl" w="full">
      <ProfileMatchBanner />

      <TaskSearchBar value={filters.search} onChange={setSearch} />

      <Box position="relative" w="full" zIndex={openFilter ? 'popover' : 'auto'}>
        <TaskFilterBar
          filters={filters}
          openFilter={openFilter}
          onOpenFilterChange={setOpenFilter}
          onToggleSkill={toggleSkill}
          onToggleNeighborhood={toggleNeighborhood}
        />
      </Box>

      <Box position="relative" zIndex="base">
        <VStack align="stretch" gap="4" w="full">
          <TaskResultsBar count={filteredTasks.length} />

          {error ? (
            <Box
              p="4"
              borderRadius="12px"
              bg="red.50"
              color="red.600"
              border="1px solid"
              borderColor="red.100"
              textAlign="center"
              fontSize="sm"
            >
              {error}
            </Box>
          ) : filteredTasks.length === 0 && !isLoading ? (
            <TaskEmptyState hasActiveFilters={hasActiveFilters} onResetFilters={resetFilters} />
          ) : (
            <TaskList tasks={filteredTasks} isLoading={isLoading} />
          )}
        </VStack>
      </Box>
    </VStack>
  );
};

export default TasksContent;
