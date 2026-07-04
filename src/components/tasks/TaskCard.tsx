import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { FiClock, FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTaskImage } from '../../hooks/useTaskImage';
import { brandColors } from '../../theme/tokens';
import type { TaskListItem } from '../../types/task';

interface TaskCardProps {
  task: TaskListItem;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const navigate = useNavigate();
  const { imageSrc } = useTaskImage(task.picUrl);

  return (
    <Box
      bg={brandColors.surface}
      borderRadius="20px"
      overflow="hidden"
      boxShadow="0 2px 16px rgba(0, 0, 0, 0.06)"
      cursor="pointer"
      onClick={() => navigate(`/tasks/${task.id}`)}
      transition="all 0.2s ease"
      _hover={{
        boxShadow: '0 8px 24px rgba(0, 138, 143, 0.12)',
        transform: 'translateY(-2px)',
      }}
      _active={{ transform: 'translateY(0)' }}
    >
      <Box position="relative" h="160px" bg="gray.100">
        {imageSrc && (
          <Image src={imageSrc} alt={task.title} w="full" h="full" objectFit="cover" />
        )}

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
          {task.count} جای خالی
        </Box>
      </Box>

      <VStack align="stretch" gap="3" p="4">
        <Text fontSize="md" fontWeight="bold" color={brandColors.primary} lineHeight="1.5">
          {task.title}
        </Text>

        <Box h="1px" bg="gray.100" />

        <HStack gap="2" color={brandColors.textSecondary}>
          <FiClock size={14} />
          <Text fontSize="sm">زمان شروع: {task.startDateFa}</Text>
        </HStack>

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
      </VStack>
    </Box>
  );
};

export default TaskCard;


