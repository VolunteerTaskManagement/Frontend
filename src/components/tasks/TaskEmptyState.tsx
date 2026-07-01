import { Button, Text, VStack } from '@chakra-ui/react';
import { FiInbox } from 'react-icons/fi';
import { brandColors } from '../../theme/tokens';

interface TaskEmptyStateProps {
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

const TaskEmptyState = ({ hasActiveFilters, onResetFilters }: TaskEmptyStateProps) => {
  return (
    <VStack py="12" gap="4" textAlign="center">
      <FiInbox size={40} color={brandColors.textMuted} />
      <VStack gap="1">
        <Text fontSize="md" fontWeight="bold" color={brandColors.textPrimary}>
          {hasActiveFilters ? 'وظیفه‌ای با این فیلترها یافت نشد' : 'وظیفه‌ای موجود نیست'}
        </Text>
        <Text fontSize="sm" color={brandColors.textSecondary}>
          {hasActiveFilters
            ? 'فیلترها را تغییر دهید یا جستجوی دیگری امتحان کنید.'
            : 'به‌زودی وظایف جدید اضافه می‌شوند.'}
        </Text>
      </VStack>

      {hasActiveFilters && (
        <Button
          size="sm"
          bg="brand.500"
          color="white"
          borderRadius="full"
          _hover={{ bg: 'brand.600' }}
          onClick={onResetFilters}
        >
          پاک کردن فیلترها
        </Button>
      )}
    </VStack>
  );
};

export default TaskEmptyState;
