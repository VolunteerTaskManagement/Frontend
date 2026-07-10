import { Box, Button, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import {
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiEdit2,
  FiMapPin,
  FiPhone,
  FiUser,
  FiUsers,
  FiXCircle,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCancelTask } from '../../hooks/useCancelTask';
import { useConfirmTaskCompletion } from '../../hooks/useConfirmTaskCompletion';
import { useTaskVolunteers } from '../../hooks/useTaskVolunteers';
import { useTaskImage } from '../../hooks/useTaskImage';
import { brandColors } from '../../theme/tokens';
import type { TaskListItem } from '../../types/task';
import type { CoordinatorTaskTab } from '../../stores/coordinatorTaskStore';
import { toPersianDigits } from '../../utils/formatters';
import { toaster } from '../../utils/toaster';

interface CoordinatorTaskCardProps {
  task: TaskListItem;
  activeTab: CoordinatorTaskTab;
  onRemove: (id: number) => void;
}

interface ConfirmState {
  type: 'cancel' | 'complete' | null;
}

const CoordinatorTaskCard = ({ task, activeTab, onRemove }: CoordinatorTaskCardProps) => {
  const navigate = useNavigate();
  const { imageSrc } = useTaskImage(task.picUrl);
  const { cancel, isLoading: isCancelling } = useCancelTask();
  const { confirmCompletion, isLoading: isConfirming } = useConfirmTaskCompletion();
  const {
    volunteers,
    isLoading: isLoadingVolunteers,
    error: volunteersError,
    fetchVolunteers,
  } = useTaskVolunteers();

  const [expanded, setExpanded] = useState(false);
  const [hasFetchedVolunteers, setHasFetchedVolunteers] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>({ type: null });

  const isBusy = isCancelling || isConfirming;
  const showActions = activeTab === 'open';

  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);

    if (next && !hasFetchedVolunteers) {
      setHasFetchedVolunteers(true);
      fetchVolunteers(task.id);
    }
  };

  const goToEdit = (e: MouseEvent) => {
    e.stopPropagation();
    // صفحه‌ی ویرایش هنوز ساخته نشده — فقط مسیر وصل شده تا بعداً پیاده‌سازی شود
    navigate(`/tasks/edit/${task.id}`);
  };

  const handleConfirm = async () => {
    if (confirm.type === 'cancel') {
      const result = await cancel(task.id);

      toaster.create({
        type: result.success ? 'success' : 'error',
        title: result.success ? 'لغو شد' : 'خطا',
        description: result.message,
        meta: { closable: true },
      });

      if (result.success) onRemove(task.id);
    }

    if (confirm.type === 'complete') {
      const result = await confirmCompletion(task.id);

      toaster.create({
        type: result.success ? 'success' : 'error',
        title: result.success ? 'پایان تسک ثبت شد' : 'خطا',
        description: result.message,
        meta: { closable: true },
      });

      if (result.success) onRemove(task.id);
    }

    setConfirm({ type: null });
  };

  return (
    <Box
      bg={brandColors.surface}
      borderRadius="20px"
      overflow="hidden"
      boxShadow="0 2px 16px rgba(0, 0, 0, 0.06)"
    >
      {/* تصویر */}
      <Box position="relative" h="140px" bg="gray.100">
        {imageSrc && (
          <Image src={imageSrc} alt={task.title} w="full" h="full" objectFit="cover" />
        )}
        <Box
          position="absolute"
          top="3"
          left="3"
          px="3"
          py="1"
          borderRadius="full"
          bg="blackAlpha.600"
          color="white"
          fontSize="xs"
          fontWeight="medium"
        >
          {task.statusTitle}
        </Box>
      </Box>

      <VStack align="stretch" gap="3" p="4">
        {/* عنوان */}
        <Text fontSize="md" fontWeight="bold" color={brandColors.primary} lineHeight="1.5">
          {task.title}
        </Text>

        <Box h="1px" bg="gray.100" />

        {/* زمان */}
        <HStack gap="2" color={brandColors.textSecondary}>
          <FiClock size={14} />
          <Text fontSize="sm">زمان شروع: {toPersianDigits(task.startDateFa)}</Text>
        </HStack>

        {/* محله و مهارت‌ها */}
        <HStack gap="2" flexWrap="wrap">
          <HStack
            gap="1"
            px="3"
            py="1"
            borderRadius="full"
            bg="gray.100"
            fontSize="xs"
            color={brandColors.textSecondary}
          >
            <FiMapPin size={12} />
            <Text>{task.neighborhoodTitle}</Text>
          </HStack>
          {task.skillTitles.map((skillTitle, index) => (
            <Box
              key={`${task.skills[index]}-${skillTitle}`}
              px="3"
              py="1"
              borderRadius="full"
              bg="gray.100"
              fontSize="xs"
              color={brandColors.textSecondary}
            >
              {skillTitle}
            </Box>
          ))}
        </HStack>

        {/* دکمه نمایش داوطلبان */}
        <Box
          as="button"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          w="full"
          p="2"
          borderRadius="12px"
          bg={brandColors.primaryLight}
          cursor="pointer"
          onClick={toggleExpand}
        >
          <HStack gap="2" color={brandColors.primary}>
            <FiUsers size={16} />
            <Text fontSize="sm" fontWeight="medium">
              داوطلبان ({toPersianDigits(task.volunteerCount)}/{toPersianDigits(task.count)})
            </Text>
          </HStack>
          {expanded ? (
            <FiChevronUp color={brandColors.primary} />
          ) : (
            <FiChevronDown color={brandColors.primary} />
          )}
        </Box>

        {expanded && (
          <VStack align="stretch" gap="2" pt="1">
            {isLoadingVolunteers && (
              <VStack py="4">
                <Spinner size="sm" color="brand.500" />
              </VStack>
            )}

            {!isLoadingVolunteers && volunteersError && (
              <Text fontSize="xs" color="red.500" textAlign="center" py="2">
                {volunteersError}
              </Text>
            )}

            {!isLoadingVolunteers && !volunteersError && volunteers.length === 0 && (
              <Text fontSize="xs" color={brandColors.textMuted} textAlign="center" py="2">
                هنوز داوطلبی برای این تسک ثبت‌نام نکرده است.
              </Text>
            )}

            {!isLoadingVolunteers &&
              !volunteersError &&
              volunteers.map((volunteer) => (
                <HStack
                  key={volunteer.id}
                  justify="space-between"
                  p="3"
                  borderRadius="12px"
                  bg="gray.50"
                >
                  <VStack align="flex-start" gap="0.5">
                    <HStack gap="1.5">
                      <FiUser size={13} color={brandColors.textSecondary} />
                      <Text fontSize="sm" fontWeight="medium" color={brandColors.textPrimary}>
                        {volunteer.volunteerName}
                      </Text>
                    </HStack>
                    <HStack gap="1.5">
                      <FiPhone size={13} color={brandColors.textSecondary} />
                      <Text fontSize="xs" color={brandColors.textSecondary}>
                        {toPersianDigits(volunteer.phoneNumber)}
                      </Text>
                    </HStack>
                  </VStack>

                  {volunteer.isConfirmed ? (
                    <HStack gap="1" color="green.500">
                      <FiCheckCircle size={16} />
                      <Text fontSize="xs" fontWeight="medium">
                        پایان یافته
                      </Text>
                    </HStack>
                  ) : (
                    <HStack gap="1" color={brandColors.textMuted}>
                      <FiClock size={16} />
                      <Text fontSize="xs" fontWeight="medium">
                        در انتظار
                      </Text>
                    </HStack>
                  )}
                </HStack>
              ))}
          </VStack>
        )}

        {/* دکمه‌های اکشن — فقط در تب «باز» */}
        {showActions && (
          <>
            {confirm.type ? (
              /* دیالوگ تایید */
              <Box
                p="3"
                borderRadius="12px"
                bg={confirm.type === 'cancel' ? 'red.50' : brandColors.primaryLight}
                border="1px solid"
                borderColor={confirm.type === 'cancel' ? 'red.100' : '#B3E8EA'}
              >
                <Text fontSize="sm" color={brandColors.textPrimary} mb="3" textAlign="center">
                  {confirm.type === 'cancel'
                    ? 'آیا مطمئنید که می‌خواهید این تسک را لغو کنید؟'
                    : 'آیا مطمئنید که می‌خواهید پایان این تسک را اعلام کنید؟'}
                </Text>
                <HStack gap="2" justify="center">
                  <Button
                    size="sm"
                    borderRadius="full"
                    variant="outline"
                    onClick={() => setConfirm({ type: null })}
                    disabled={isBusy}
                  >
                    انصراف
                  </Button>
                  <Button
                    size="sm"
                    borderRadius="full"
                    bg={confirm.type === 'cancel' ? 'red.500' : brandColors.primary}
                    color="white"
                    _hover={{
                      bg: confirm.type === 'cancel' ? 'red.600' : brandColors.primaryHover,
                    }}
                    onClick={handleConfirm}
                    disabled={isBusy}
                    loading={isBusy}
                  >
                    تایید
                  </Button>
                </HStack>
              </Box>
            ) : (
              /* دکمه‌های اصلی */
              <VStack gap="2" align="stretch">
                <HStack gap="2">
                  <Button
                    flex="1"
                    size="sm"
                    borderRadius="full"
                    bg={brandColors.primary}
                    color="white"
                    _hover={{ bg: brandColors.primaryHover }}
                    onClick={() => setConfirm({ type: 'complete' })}
                  >
                    پایان تسک
                    {<FiCheckCircle size={14} />}
                  </Button>
                  <Button
                    flex="1"
                    size="sm"
                    borderRadius="full"
                    variant="outline"
                    borderColor="red.300"
                    color="red.500"
                    _hover={{ bg: 'red.50' }}
                    onClick={() => setConfirm({ type: 'cancel' })}
                  >
                    لغو تسک
                    {<FiXCircle size={14} />}
                  </Button>
                </HStack>
                <Button
                  size="sm"
                  borderRadius="full"
                  variant="outline"
                  borderColor="gray.300"
                  color={brandColors.textSecondary}
                  _hover={{ bg: 'gray.50' }}
                  onClick={goToEdit}
                >
                  ویرایش اطلاعات
                  {<FiEdit2 size={14} />}
                </Button>
              </VStack>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
};

export default CoordinatorTaskCard;