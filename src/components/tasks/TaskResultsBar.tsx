import { HStack, Text } from '@chakra-ui/react';
import { FiSliders } from 'react-icons/fi';
import { selectHasActiveFilters, useTaskFiltersStore } from '../../stores/taskFiltersStore';
import { brandColors } from '../../theme/tokens';
import { toPersianDigits } from '../../utils/formatters';

interface TaskResultsBarProps {
  count: number;
}

const TaskResultsBar = ({ count }: TaskResultsBarProps) => {
  const resetFilters = useTaskFiltersStore((state) => state.resetFilters);
  const hasActiveFilters = useTaskFiltersStore(selectHasActiveFilters);

  return (
    <HStack justify="space-between" w="full" py="1">
      <HStack
        as="button"
        gap="1.5"
        color={hasActiveFilters ? brandColors.primary : brandColors.textMuted}
        cursor={hasActiveFilters ? 'pointer' : 'default'}
        opacity={hasActiveFilters ? 1 : 0.6}
        pointerEvents={hasActiveFilters ? 'auto' : 'none'}
        aria-disabled={!hasActiveFilters}
        onClick={() => {
          if (hasActiveFilters) resetFilters();
        }}
      >
        <FiSliders size={14} />
        <Text fontSize="sm" fontWeight="medium">
          پاک کردن فیلترها
        </Text>
      </HStack>

      <Text fontSize="sm" color={brandColors.textSecondary}>
        {toPersianDigits(count)} وظیفه یافت شد
      </Text>
    </HStack>
  );
};

export default TaskResultsBar;