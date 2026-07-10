import {
  Box,
  Button,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiCheckCircle, FiClock, FiMapPin, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCompleteTask } from '../../hooks/useCompleteTask';
import { useUnassignTask } from '../../hooks/useUnassignTask';
import { useTaskImage } from '../../hooks/useTaskImage';
import { brandColors } from '../../theme/tokens';
import type { TaskListItem } from '../../types/task';
import type { MyTaskTab } from '../../stores/myTaskStore';
import { toPersianDigits } from '../../utils/formatters';
import { toaster } from '../../utils/toaster';

interface MyTaskCardProps {
  task: TaskListItem;
  activeTab: MyTaskTab;
}

interface ConfirmState {
  type: 'complete' | 'unassign' | null;
}

const MyTaskCard = ({ task, activeTab }: MyTaskCardProps) => {
  const navigate = useNavigate();
  const { imageSrc } = useTaskImage(task.picUrl);
  const { complete, isLoading: isCompleting } = useCompleteTask();
  const { unassign, isLoading: isUnassigning } = useUnassignTask();
  const [confirm, setConfirm] = useState<ConfirmState>({ type: null });

  const isBusy = isCompleting || isUnassigning;
  const showActions = activeTab === 'active';
  // کناره‌گیری فقط در status 1 (Open) مجاز است، نه status 2 (Assigned)
  const canUnassign = task.status === 1;
  const isWaitingForCoordinator = task.status === 2 && task.isConfirmedByVolunteer;

  const handleConfirm = async () => {
    if (confirm.type === 'complete') {
      const result = await complete(task.id);

      toaster.create({
        type: result.success ? 'success' : 'error',
        title: result.success ? 'ثبت شد' : 'خطا',
        description: result.message,
        meta: {
          closable: true,
        },
      });
    }

    if (confirm.type === 'unassign') {
      const result = await unassign(task.id);

      toaster.create({
        type: result.success ? 'success' : 'error',
        title: result.success ? 'کناره‌گیری انجام شد' : 'خطا',
        description: result.message,
        meta: {
          closable: true,
        },
      });
    }

    setConfirm({ type: null });
  };

  const goToDetail = () => navigate(`/tasks/${task.id}`, { state: { from: 'mytasks' } });

  return (
    <Box
      bg={brandColors.surface}
      borderRadius="20px"
      overflow="hidden"
      boxShadow="0 2px 16px rgba(0, 0, 0, 0.06)"
    >
      {/* تصویر */}
      <Box
        position="relative"
        h="140px"
        bg="gray.100"
        cursor="pointer"
        onClick={goToDetail}
      >
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
        <Text
          fontSize="md"
          fontWeight="bold"
          color={brandColors.primary}
          lineHeight="1.5"
          cursor="pointer"
          onClick={goToDetail}
        >
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

        {/* دکمه‌های اکشن — فقط در تب «در حال انجام» */}
        {showActions && (
          <>
            {confirm.type ? (
              /* دیالوگ تایید */
              <Box
                p="3"
                borderRadius="12px"
                bg={confirm.type === 'unassign' ? 'red.50' : brandColors.primaryLight}
                border="1px solid"
                borderColor={confirm.type === 'unassign' ? 'red.100' : '#B3E8EA'}
              >
                <Text fontSize="sm" color={brandColors.textPrimary} mb="3" textAlign="center">
                  {confirm.type === 'complete'
                    ? 'آیا مطمئنید که این وظیفه را انجام داده‌اید؟'
                    : 'آیا مطمئنید که می‌خواهید از این وظیفه کناره‌گیری کنید؟'}
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
                    bg={confirm.type === 'unassign' ? 'red.500' : brandColors.primary}
                    color="white"
                    _hover={{
                      bg: confirm.type === 'unassign' ? 'red.600' : brandColors.primaryHover,
                    }}
                    onClick={handleConfirm}
                    disabled={isBusy}
                    loading={isBusy}
                  >
                    تایید
                  </Button>
                </HStack>
              </Box>
            ) : isWaitingForCoordinator ? (
              <Box
                p="3"
                borderRadius="12px"
                bg={brandColors.primaryLight}
                border="1px solid"
                borderColor="#B3E8EA"
              >
                <HStack justify="center" gap="2" color={brandColors.primary}>
                  <FiCheckCircle size={18} />
                  <Text fontSize="sm" fontWeight="medium">
                    تسک انجام شد، در انتظار تایید هماهنگ‌کننده
                  </Text>
                </HStack>
              </Box>
            ) : (
              /* دکمه‌های اصلی */
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
                  انجام شد
                  <FiCheckCircle size={14} />
                </Button>

                {canUnassign && (
                  <Button
                    flex="1"
                    size="sm"
                    borderRadius="full"
                    variant="outline"
                    borderColor="red.300"
                    color="red.500"
                    _hover={{ bg: 'red.50' }}
                    onClick={() => setConfirm({ type: 'unassign' })}
                  >
                    کناره‌گیری
                    <FiXCircle size={14} />
                  </Button>
                )}
              </HStack>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
};

export default MyTaskCard;