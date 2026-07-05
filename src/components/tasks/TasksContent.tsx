import { Box, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useOptions } from '../../hooks/useOptions';
import { useTaskFilters } from '../../hooks/useTaskFilters';
import { useTasks } from '../../hooks/useTasks';
import type { FilterOption } from '../../types/task';
import ProfileMatchBanner from './ProfileMatchBanner';
import TaskEmptyState from './TaskEmptyState';
import TaskFilterBar from './TaskFilterBar';
import TaskList from './TaskList';
import TaskResultsBar from './TaskResultsBar';
import TaskSearchBar from './TaskSearchBar';

const TasksContent = () => {
  const { tasks, isLoading, isLoadingMore, hasNextPage, filteredCount, error, loadMore } =
    useTasks();
  const { skills, neighborhoods, searchNeighborhoods } = useOptions();
  const {
    filters,
    openFilter,
    setSearch,
    toggleSkill,
    toggleNeighborhood,
    toggleStatus,
    setOpenFilter,
    resetFilters,
    hasActiveFilters,
  } = useTaskFilters();

  const skillOptions: FilterOption[] = useMemo(
    () => skills.map((skill) => ({ value: String(skill.key), label: skill.value })),
    [skills],
  );

  const neighborhoodOptions: FilterOption[] = useMemo(
    () => neighborhoods.map((n) => ({ value: String(n.id), label: n.title })),
    [neighborhoods],
  );

  return (
    <VStack align="stretch" gap="4" dir="rtl" w="full">
      <ProfileMatchBanner />

      <TaskSearchBar value={filters.search} onChange={setSearch} />

      <Box position="relative" w="full" zIndex={openFilter ? 'popover' : 'auto'}>
        <TaskFilterBar
          filters={filters}
          skillOptions={skillOptions}
          neighborhoodOptions={neighborhoodOptions}
          openFilter={openFilter}
          onOpenFilterChange={setOpenFilter}
          onToggleSkill={toggleSkill}
          onToggleNeighborhood={toggleNeighborhood}
          onToggleStatus={toggleStatus}
          onNeighborhoodSearch={searchNeighborhoods}
        />
      </Box>

      <Box position="relative" zIndex="base">
        <VStack align="stretch" gap="4" w="full">
          <TaskResultsBar count={filteredCount} />

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
          ) : tasks.length === 0 && !isLoading ? (
            <TaskEmptyState hasActiveFilters={hasActiveFilters} onResetFilters={resetFilters} />
          ) : (
            <TaskList
              tasks={tasks}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              hasNextPage={hasNextPage}
              onLoadMore={loadMore}
            />
          )}
        </VStack>
      </Box>
    </VStack>
  );
};

export default TasksContent;