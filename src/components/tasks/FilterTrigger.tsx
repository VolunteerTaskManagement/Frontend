import { Box, Button, HStack, Text } from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { brandColors } from '../../theme/tokens';
import { toPersianDigits } from '../../utils/formatters';

interface FilterTriggerProps {
  label: string;
  icon: IconType;
  selectedCount: number;
  isOpen: boolean;
  onClick: () => void;
  accentColor: 'teal' | 'orange';
}

const FilterTrigger = ({
  label,
  icon: Icon,
  selectedCount,
  isOpen,
  onClick,
  accentColor,
}: FilterTriggerProps) => {
  const accent = accentColor === 'orange' ? brandColors.accent : brandColors.primary;

  return (
    <Button
      w="full"
      h="44px"
      px="1"
      borderRadius="full"
      border="1px solid"
      borderColor={isOpen ? accent : brandColors.border}
      bg={isOpen ? accent : brandColors.surface}
      color={isOpen ? 'white' : brandColors.textPrimary}
      fontWeight="semibold"
      fontSize="sm"
      onClick={onClick}
      _hover={{ bg: isOpen ? accent : 'gray.50' }}
      position="relative"
    >
      {selectedCount > 0 && (
        <Box
          as="span"
          position="absolute"
          top="-6px"
          left="-4px"
          minW="20px"
          h="20px"
          px="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="full"
          fontSize="xs"
          fontWeight="bold"
          bg={
            accentColor === 'orange'
              ? '#FED7AA'
              : brandColors.primaryLight
          }
          color={accent}
          border="2px solid"
          borderColor={brandColors.surface}
          zIndex="1"
        >
          {toPersianDigits(selectedCount)}
        </Box>
      )}

      <HStack w="full" justify="space-between" gap="1">
        {isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}

        <HStack gap="1" flex="1" justify="center" minW="0">
          <Text lineClamp={1}>{label}</Text>
          <Icon size={14} />
        </HStack>
      </HStack>
    </Button>
  );
};

export default FilterTrigger;