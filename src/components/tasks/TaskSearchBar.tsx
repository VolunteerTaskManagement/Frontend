import { Box, Input } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { brandColors } from '../../theme/tokens';

interface TaskSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const TaskSearchBar = ({ value, onChange }: TaskSearchBarProps) => {
  return (
    <Box position="relative" w="full">
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="جستجوی وظایف..."
        dir="rtl"
        textAlign="right"
        h="48px"
        pl="44px"
        pr="4"
        bg={brandColors.surface}
        border="none"
        borderRadius="full"
        boxShadow="0 2px 12px rgba(0, 0, 0, 0.06)"
        _placeholder={{ color: brandColors.textMuted }}
        _focus={{
          borderColor: 'brand.500',
          boxShadow: '0 2px 12px rgba(0, 138, 143, 0.15)',
        }}
      />
      <Box
        position="absolute"
        top="50%"
        left="16px"
        transform="translateY(-50%)"
        color={brandColors.textMuted}
        pointerEvents="none"
      >
        <FiSearch size={18} />
      </Box>
    </Box>
  );
};

export default TaskSearchBar;
