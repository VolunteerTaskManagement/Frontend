import { Box, Text, VStack } from '@chakra-ui/react';
import { useMyTasks } from '../../hooks/useMyTasks';
import { brandColors } from '../../theme/tokens';
import MyTaskList from './MyTaskList';
import MyTaskTabs from './MyTaskTabs';

const MyTasksContent = () => {
  const {
    tasks,
    activeTab,
    isLoading,
    isLoadingMore,
    hasNextPage,
    filteredCount,
    error,
    setActiveTab,
    loadMore,
  } = useMyTasks();

  return (
    <VStack align="stretch" gap="4" dir="rtl" w="full">
      {/* هدر */}
      <VStack align="stretch" gap="1">
        <Text fontSize="xl" fontWeight="bold" color={brandColors.primary}>
          وظایف من
        </Text>
        <Text fontSize="sm" color={brandColors.textSecondary}>
          {filteredCount} وظیفه در مجموع
        </Text>
      </VStack>

      {/* تب‌بندی */}
      <MyTaskTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* محتوا */}
      <Box>
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
        ) : (
          <MyTaskList
            tasks={tasks}
            activeTab={activeTab}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            hasNextPage={hasNextPage}
            onLoadMore={loadMore}
          />
        )}
      </Box>
    </VStack>
  );
};

export default MyTasksContent;