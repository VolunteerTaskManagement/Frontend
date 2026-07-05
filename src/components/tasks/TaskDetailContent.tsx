import { Box, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { FiArrowRight, FiClock, FiMapPin, FiUser } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import MainButton from '../common/MainButton';
import { useAssignTask } from '../../hooks/useassigntask';
import { useTask } from '../../hooks/useTask';
import { useTaskImage } from '../../hooks/useTaskImage';
import { brandColors } from '../../theme/tokens';

interface TaskDetailContentProps {
  taskId: number;
}

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <HStack align="flex-start" gap="3" w="full">
    <Box color={brandColors.primary} mt="0.5" flexShrink={0}>
      {icon}
    </Box>
    <VStack align="flex-start" gap="0.5" flex="1">
      <Text fontSize="xs" fontWeight="bold" color={brandColors.textMuted}>
        {label}
      </Text>
      <Text fontSize="sm" color={brandColors.textPrimary} lineHeight="1.7">
        {value}
      </Text>
    </VStack>
  </HStack>
);

const TaskDetailContent = ({ taskId }: TaskDetailContentProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { task, isLoading, error } = useTask(taskId);
  const { imageSrc } = useTaskImage(task?.picUrl);
  const { assign, isLoading: isAssigning, error: assignError, isSuccess: assigned } = useAssignTask();

  // اگه از my-tasks اومدیم، بازگشت به همونجا
  const fromMyTasks = location.state?.from === 'mytasks';
  const backPath = fromMyTasks ? '/mytasks' : '/tasks';
  const backLabel = fromMyTasks ? 'بازگشت به وظایف من' : 'بازگشت به وظایف';

  if (isLoading) {
    return (
      <VStack py="16" gap="3">
        <Spinner color="brand.500" size="lg" />
        <Text color={brandColors.textSecondary} fontSize="sm">
          در حال بارگذاری...
        </Text>
      </VStack>
    );
  }

  if (error || !task) {
    return (
      <VStack py="16" gap="4" textAlign="center">
        <Text color="red.500" fontSize="sm">
          {error ?? 'وظیفه یافت نشد.'}
        </Text>
        <MainButton text="بازگشت" onClick={() => navigate(backPath)} />
      </VStack>
    );
  }

  return (
    <VStack align="stretch" gap="4" dir="rtl" w="full" pb="4">
      <Box
        as="button"
        display="flex"
        alignItems="center"
        gap="2"
        color={brandColors.primary}
        fontWeight="semibold"
        fontSize="sm"
        cursor="pointer"
        alignSelf="flex-start"
        bg="transparent"
        border="none"
        p="0"
        onClick={() => navigate(backPath)}
        _hover={{ opacity: 0.8 }}
      >
        <FiArrowRight size={18} />
        <Text>{backLabel}</Text>
      </Box>

      <Box position="relative" h="200px" borderRadius="20px" overflow="hidden" bg="gray.100">
        {imageSrc && (
          <Image src={imageSrc} alt={task.title} w="full" h="full" objectFit="cover" />
        )}
        {!fromMyTasks && (
          <Box
            position="absolute"
            bottom="3"
            left="3"
            px="3"
            py="1"
            borderRadius="full"
            bg="blackAlpha.600"
            color="white"
            fontSize="xs"
            fontWeight="medium"
          >
            {task.count - task.volunteerCount} جای خالی
          </Box>
        )}
      </Box>

      <Text fontSize="xl" fontWeight="bold" color={brandColors.primary} lineHeight="1.5">
        {task.title}
      </Text>

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

      <Box h="1px" bg="gray.100" />

      <VStack align="stretch" gap="4">
        <DetailRow icon={<FiClock size={18} />} label="زمان برگزاری" value={task.startDateFa} />
        <DetailRow icon={<FiUser size={18} />} label="مسئول" value={task.coordinatorName} />
        <DetailRow icon={<FiMapPin size={18} />} label="شماره تماس" value={task.mobile} />
        <DetailRow icon={<FiMapPin size={18} />} label="آدرس" value={task.address} />
      </VStack>

      <Box>
        <Text fontSize="sm" fontWeight="bold" color={brandColors.textPrimary} mb="2">
          توضیحات
        </Text>
        <Text fontSize="sm" color={brandColors.textSecondary} lineHeight="1.8">
          {task.description}
        </Text>
      </Box>

      {/* دکمه ثبت‌نام فقط وقتی داوطلب هنوز ثبت‌نام نکرده نشون داده می‌شه */}
      {!task.isAssigned && (
        <>
          {assignError && (
            <Text fontSize="sm" color="red.500" textAlign="center">
              {assignError}
            </Text>
          )}

          {assigned ? (
            <Box
              w="full"
              p="3"
              borderRadius="12px"
              bg={brandColors.primaryLight}
              textAlign="center"
            >
              <Text fontSize="sm" fontWeight="bold" color={brandColors.primary}>
                ثبت‌نام شما با موفقیت انجام شد
              </Text>
            </Box>
          ) : (
            <Box w="full" display="flex" justifyContent="center" pt="2">
              <MainButton
                text={isAssigning ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                w="full"
                maxW="280px"
                onClick={() => assign(taskId)}
                disabled={isAssigning}
              />
            </Box>
          )}
        </>
      )}
    </VStack>
  );
};

export default TaskDetailContent;