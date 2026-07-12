import { useState } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { useCoordinatorTasks } from "../../hooks/useCoordinatorTasks";
import { brandColors } from "../../theme/tokens";
import { toPersianDigits } from "../../utils/formatters";
import CoordinatorTaskList from "./CoordinatorTaskList";
import CoordinatorTaskTabs from "./CoordinatorTaskTabs";
import CreateTaskModal from "../CreateTask/CreateTaskModal";
const CoordinatorTasksContent = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
    removeTaskLocally,
    refetch,
  } = useCoordinatorTasks();

  const handleTaskCreated = () => {
    if (activeTab === "open") {
      refetch();
    } else {
      setActiveTab("open");
    }
  };

  return (
    <>
      <VStack align="stretch" gap="4" dir="rtl" w="full">
        {/* هدر */}
        <HStack justify="space-between" align="flex-start">
          <VStack align="flex-start" gap="1">
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={brandColors.primary}
            >
              تسک‌های من
            </Text>

            <Text
              fontSize="sm"
              color={brandColors.textSecondary}
            >
              {toPersianDigits(filteredCount)} تسک در مجموع
            </Text>
          </VStack>

          <Box
            as="button"
            display="flex"
            alignItems="center"
            gap="1"
            px="3"
            py="2"
            borderRadius="full"
            bg={brandColors.primary}
            color="white"
            fontSize="xs"
            fontWeight="bold"
            boxShadow="0 4px 6px rgba(0, 138, 143, 0.3)"
            cursor="pointer"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <FiPlus size={14} />
            <Text>تسک جدید</Text>
          </Box>
        </HStack>

        {/* تب‌بندی */}
        <CoordinatorTaskTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

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
            <CoordinatorTaskList
              tasks={tasks}
              activeTab={activeTab}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              hasNextPage={hasNextPage}
              onLoadMore={loadMore}
              onRemoveTask={removeTaskLocally}
            />
          )}
        </Box>
      </VStack>

      <CreateTaskModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </>
  );
};

export default CoordinatorTasksContent;