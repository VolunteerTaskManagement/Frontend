import { Box, Button, HStack, Text } from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { brandColors } from '../../theme/tokens';

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
      px="3"
      borderRadius="full"
      border="1px solid"
      borderColor={isOpen ? accent : brandColors.border}
      bg={isOpen ? accent : brandColors.surface}
      color={isOpen ? 'white' : brandColors.textPrimary}
      fontWeight="semibold"
      fontSize="sm"
      onClick={onClick}
      _hover={{ bg: isOpen ? accent : 'gray.50' }}
    >
      <HStack w="full" justify="space-between" gap="1">
        {isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}

        <HStack gap="1.5" flex="1" justify="center" minW="0">
          <Text lineClamp={1}>{label}</Text>
          {selectedCount > 0 && (
            <Box
              as="span"
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
                isOpen
                  ? 'whiteAlpha.300'
                  : accentColor === 'orange'
                    ? '#FED7AA'
                    : brandColors.primaryLight
              }
              color={isOpen ? 'white' : accent}
            >
              {selectedCount}
            </Box>
          )}
          <Icon size={16} />
        </HStack>
      </HStack>
    </Button>
  );
};

export default FilterTrigger;
