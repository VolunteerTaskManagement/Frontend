import { HStack, Text } from '@chakra-ui/react';
import { FiSliders } from 'react-icons/fi';
import { brandColors } from '../../theme/tokens';

interface TaskResultsBarProps {
  count: number;
}

const TaskResultsBar = ({ count }: TaskResultsBarProps) => {
  return (
    <HStack justify="space-between" w="full" py="1">
      <HStack gap="1.5" color={brandColors.textSecondary}>
        <FiSliders size={14} />
        <Text fontSize="sm" fontWeight="medium">
          بهترین تطابق
        </Text>
      </HStack>

      <Text fontSize="sm" color={brandColors.textSecondary}>
        {count} وظیفه یافت شد
      </Text>
    </HStack>
  );
};

export default TaskResultsBar;
