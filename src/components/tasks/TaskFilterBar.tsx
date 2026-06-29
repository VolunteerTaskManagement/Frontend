import { Box, HStack } from '@chakra-ui/react';
import { FiMapPin } from 'react-icons/fi';
import { LuWrench } from 'react-icons/lu';
import { NEIGHBORHOOD_OPTIONS, SKILL_OPTIONS } from '../../constants/tasks';
import type { FilterType, TaskFilters } from '../../types/task';
import FilterDropdownPanel from './FilterDropdownPanel';
import FilterTrigger from './FilterTrigger';

interface TaskFilterBarProps {
  filters: TaskFilters;
  openFilter: FilterType | null;
  onOpenFilterChange: (filter: FilterType | null) => void;
  onToggleSkill: (skill: string) => void;
  onToggleNeighborhood: (neighborhood: string) => void;
}

const FILTER_CONFIG = {
  skills: {
    label: 'مهارت‌ها',
    icon: LuWrench,
    accentColor: 'teal' as const,
    panelTitle: 'مهارت‌های من',
    searchPlaceholder: 'جستجوی مهارت...',
    options: SKILL_OPTIONS,
    footerLabel: (count: number) => `${count} مهارت انتخاب شده`,
    showLocationIcon: false,
  },
  neighborhoods: {
    label: 'مناطق',
    icon: FiMapPin,
    accentColor: 'orange' as const,
    panelTitle: 'مناطق من',
    searchPlaceholder: 'جستجوی شهر یا محله...',
    options: NEIGHBORHOOD_OPTIONS,
    footerLabel: (count: number) => `${count} منطقه انتخاب شده`,
    showLocationIcon: true,
  },
};

const TaskFilterBar = ({
  filters,
  openFilter,
  onOpenFilterChange,
  onToggleSkill,
  onToggleNeighborhood,
}: TaskFilterBarProps) => {
  const handleToggle = (filter: FilterType) => {
    onOpenFilterChange(openFilter === filter ? null : filter);
  };

  const activeConfig = openFilter ? FILTER_CONFIG[openFilter] : null;
  const activeValues = openFilter === 'skills' ? filters.skills : filters.neighborhoods;
  const activeOnSelect = openFilter === 'skills' ? onToggleSkill : onToggleNeighborhood;

  return (
    <Box position="relative" w="full">
      <HStack gap="2" w="full" align="flex-start">
        <Box flex="1" minW="0">
          <FilterTrigger
            label={FILTER_CONFIG.skills.label}
            icon={FILTER_CONFIG.skills.icon}
            selectedCount={filters.skills.length}
            isOpen={openFilter === 'skills'}
            onClick={() => handleToggle('skills')}
            accentColor={FILTER_CONFIG.skills.accentColor}
          />
        </Box>
        <Box flex="1" minW="0">
          <FilterTrigger
            label={FILTER_CONFIG.neighborhoods.label}
            icon={FILTER_CONFIG.neighborhoods.icon}
            selectedCount={filters.neighborhoods.length}
            isOpen={openFilter === 'neighborhoods'}
            onClick={() => handleToggle('neighborhoods')}
            accentColor={FILTER_CONFIG.neighborhoods.accentColor}
          />
        </Box>
      </HStack>

      {openFilter && activeConfig && (
        <Box
          position="absolute"
          top="calc(100% + 8px)"
          left="0"
          right="0"
          zIndex="popover"
        >
          <FilterDropdownPanel
            panelTitle={activeConfig.panelTitle}
            searchPlaceholder={activeConfig.searchPlaceholder}
            options={activeConfig.options}
            selectedValues={activeValues}
            onSelect={activeOnSelect}
            accentColor={activeConfig.accentColor}
            footerLabel={activeConfig.footerLabel}
            showLocationIcon={activeConfig.showLocationIcon}
            locationIcon={activeConfig.icon}
          />
        </Box>
      )}
    </Box>
  );
};

export default TaskFilterBar;
