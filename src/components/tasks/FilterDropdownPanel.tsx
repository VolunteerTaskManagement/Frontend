import { Box, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import type { IconType } from 'react-icons';
import { FiSearch } from 'react-icons/fi';
import { brandColors } from '../../theme/tokens';
import type { FilterOption } from '../../types/task';
import { filterOptionsByQuery } from '../../utils/taskFilters';

interface FilterDropdownPanelProps {
  panelTitle: string;
  searchPlaceholder: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelect: (value: string) => void;
  accentColor: 'teal' | 'orange';
  footerLabel: (count: number) => string;
  showLocationIcon?: boolean;
  locationIcon?: IconType;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

const FilterDropdownPanel = ({
  panelTitle,
  searchPlaceholder,
  options,
  selectedValues,
  onSelect,
  accentColor,
  footerLabel,
  showLocationIcon = false,
  locationIcon: LocationIcon,
  showSearch = true,
  onSearch,
}: FilterDropdownPanelProps) => {
  const [panelSearch, setPanelSearch] = useState('');

  const handleSearchChange = (value: string) => {
    setPanelSearch(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const filteredOptions = useMemo(
    () => (onSearch ? options : filterOptionsByQuery(options, panelSearch)),
    [options, panelSearch, onSearch],
  );

  const accent = accentColor === 'orange' ? brandColors.accent : brandColors.primary;
  const accentBg = accentColor === 'orange' ? brandColors.accentLight : brandColors.primaryLight;

  return (
    <Box
      w="full"
      bg={brandColors.surface}
      border="1px solid"
      borderColor={brandColors.border}
      borderRadius="20px"
      p="4"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.14)"
    >
      <Text fontSize="sm" fontWeight="bold" color={accent} mb="3" textAlign="right">
        {panelTitle}
      </Text>

      {showSearch && (
        <Box position="relative" mb="3">
          <Input
            value={panelSearch}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            dir="rtl"
            textAlign="right"
            h="40px"
            pl="40px"
            pr="3"
            bg="#F9FAFB"
            border="1px solid"
            borderColor={brandColors.border}
            borderRadius="full"
            fontSize="sm"
            _placeholder={{ color: brandColors.textMuted }}
            _focus={{ borderColor: accent, boxShadow: 'none' }}
          />
          <Box
            position="absolute"
            top="50%"
            left="12px"
            transform="translateY(-50%)"
            color={brandColors.textMuted}
            pointerEvents="none"
          >
            <FiSearch size={16} />
          </Box>
        </Box>
      )}

      <VStack
        align="stretch"
        gap="1"
        maxH="240px"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { background: '#9CA3AF', borderRadius: '4px' },
        }}
      >
        {filteredOptions.map((option) => {
          const isSelected = selectedValues.includes(option.value);

          return (
            <HStack
              key={option.value}
              px="3"
              py="2.5"
              borderRadius="12px"
              cursor="pointer"
              bg={isSelected ? accentBg : 'transparent'}
              onClick={() => onSelect(option.value)}
              _hover={{ bg: isSelected ? accentBg : 'gray.50' }}
              justify="space-between"
              dir="rtl"
            >
              <HStack gap="2" flex="1" justify="flex-start">
                <Text fontSize="sm" fontWeight={isSelected ? 'semibold' : 'medium'} textAlign="right">
                  {option.label}
                </Text>
                {showLocationIcon && isSelected && LocationIcon && (
                  <LocationIcon size={14} color={accent} />
                )}
              </HStack>

              <Box
                w="20px"
                h="20px"
                borderRadius="full"
                border="2px solid"
                borderColor={isSelected ? accent : '#D1D5DB'}
                bg={isSelected ? accent : 'transparent'}
                flexShrink={0}
              />
            </HStack>
          );
        })}
      </VStack>

      {selectedValues.length > 0 && (
        <Text mt="3" fontSize="xs" color={brandColors.textSecondary} textAlign="right">
          {footerLabel(selectedValues.length)}
        </Text>
      )}
    </Box>
  );
};

export default FilterDropdownPanel;