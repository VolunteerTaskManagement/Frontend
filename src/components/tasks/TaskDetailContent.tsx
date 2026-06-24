import { Box, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { FiArrowRight, FiClock, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import MainButton from '../common/MainButton';
import { NEIGHBORHOOD_OPTIONS, SKILL_OPTIONS } from '../../constants/tasks';
import { useTask } from '../../hooks/useTask';
import { brandColors } from '../../theme/tokens';
import { getOptionLabel } from '../../utils/taskFilters';

interface TaskDetailContentProps {
  taskId: string;
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
  const { task, isLoading, error } = useTask(taskId);

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
        <MainButton text="بازگشت" onClick={() => navigate('/tasks')} />
      </VStack>
    );
  }

  const neighborhoodLabel = getOptionLabel(NEIGHBORHOOD_OPTIONS, task.neighborhood);

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
        onClick={() => navigate('/tasks')}
        _hover={{ opacity: 0.8 }}
      >
        <FiArrowRight size={18} />
        <Text>بازگشت به وظایف</Text>
      </Box>

      <Box position="relative" h="200px" borderRadius="20px" overflow="hidden">
        <Image src={task.imageUrl} alt={task.title} w="full" h="full" objectFit="cover" />
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
          {task.vacancies} جای خالی
        </Box>
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
          <Text>{neighborhoodLabel}</Text>
        </HStack>
        {task.skills.map((skill) => (
          <Box
            key={skill}
            px="3"
            py="1"
            borderRadius="full"
            bg="gray.100"
            fontSize="xs"
            color={brandColors.textSecondary}
          >
            {getOptionLabel(SKILL_OPTIONS, skill)}
          </Box>
        ))}
      </HStack>

      <Box h="1px" bg="gray.100" />

      <VStack align="stretch" gap="4">
        <DetailRow icon={<FiClock size={18} />} label="زمان برگزاری" value={task.schedule} />
        <DetailRow icon={<FiUser size={18} />} label="ایجادکننده" value={task.creatorName} />
        <DetailRow icon={<FiMapPin size={18} />} label="آدرس" value={task.address} />
        <DetailRow icon={<FiPhone size={18} />} label="شماره تماس" value={task.creatorPhone} />
      </VStack>

      <Box>
        <Text fontSize="sm" fontWeight="bold" color={brandColors.textPrimary} mb="2">
          توضیحات
        </Text>
        <Text fontSize="sm" color={brandColors.textSecondary} lineHeight="1.8">
          {task.description}
        </Text>
      </Box>

      <Box w="full" display="flex" justifyContent="center" pt="2">
        <MainButton text="ثبت‌نام" w="full" maxW="280px" />
      </Box>
    </VStack>
  );
};

export default TaskDetailContent;
