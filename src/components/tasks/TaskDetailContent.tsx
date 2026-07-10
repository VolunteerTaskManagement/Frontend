import { Box, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { FiArrowRight, FiClock, FiMapPin, FiUser } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import MainButton from '../common/MainButton';
import { useAuth } from '../../contexts/AuthContext';
import { useAssignTask } from '../../hooks/useassigntask';
import { useTask } from '../../hooks/useTask';
import { useTaskImage } from '../../hooks/useTaskImage';
import { brandColors } from '../../theme/tokens';
import { toPersianDigits } from '../../utils/formatters';
import { toaster } from '../../utils/toaster';


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
  const { user } = useAuth();
  const { task, isLoading, error } = useTask(taskId);
  const { imageSrc } = useTaskImage(task?.picUrl);
  const { assign, isLoading: isAssigning } = useAssignTask();
  const fromMyTasks = location.state?.from === 'mytasks';
  const backPath = fromMyTasks ? '/mytasks' : '/tasks';
  const backLabel = fromMyTasks ? 'بازگشت به وظایف من' : 'بازگشت به وظایف';
  const isVolunteer = user?.role === 'Volunteer';
  const handleAssign = async () => {
  const result = await assign(taskId);

  toaster.create({
    type: result.success ? 'success' : 'error',
    title: result.success ? 'ثبت‌نام انجام شد' : 'خطا',
    description: result.message,
    meta: {
      closable: true,
    },
  });

  if (result.success) {
    // navigate(0);
  }
};

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
            {toPersianDigits(task.count - task.volunteerCount)} جای خالی
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
        <DetailRow icon={<FiClock size={18} />} label="زمان برگزاری" value={toPersianDigits(task.startDateFa)} />
        <DetailRow icon={<FiUser size={18} />} label="مسئول" value={task.coordinatorName} />
        <DetailRow icon={<FiMapPin size={18} />} label="شماره تماس"   value={task.mobile == null ? '-' : toPersianDigits(task.mobile)} />
        <DetailRow icon={<FiMapPin size={18} />} label="آدرس" value={toPersianDigits(task.address)} />
      </VStack>

      <Box>
        <Text fontSize="sm" fontWeight="bold" color={brandColors.textPrimary} mb="2">
          توضیحات
        </Text>
        <Text fontSize="sm" color={brandColors.textSecondary} lineHeight="1.8">
          {toPersianDigits(task.description)}
        </Text>
      </Box>

      {isVolunteer && !task.isAssigned && (
        <Box w="full" display="flex" justifyContent="center" pt="2">
          <MainButton
            text={isAssigning ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
            w="full"
            maxW="280px"
            onClick={handleAssign}
            disabled={isAssigning}
          />
        </Box>
      )}
    </VStack>
  );
};

export default TaskDetailContent;