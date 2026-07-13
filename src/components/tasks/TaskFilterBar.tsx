import { Box, HStack } from '@chakra-ui/react';
import { useEffect, useMemo, useRef } from 'react';
import { FiMapPin, FiSliders } from 'react-icons/fi';
import { LuWrench } from 'react-icons/lu';
import { TASK_STATUS } from '../../types/task';
import type { FilterOption, FilterType, TaskFilters } from '../../types/task';
import FilterDropdownPanel from './FilterDropdownPanel';
import FilterTrigger from './FilterTrigger';
import { toPersianDigits } from '../../utils/formatters';

interface TaskFilterBarProps {
  filters: TaskFilters;
  skillOptions: FilterOption[];
  neighborhoodOptions: FilterOption[];
  openFilter: FilterType | null;
  onOpenFilterChange: (filter: FilterType | null) => void;
  onToggleSkill: (skillId: number) => void;
  onToggleNeighborhood: (neighborhoodId: number) => void;
  onToggleStatus: (statusId: number) => void;
  onNeighborhoodSearch: (query: string) => void;
}

const STATUS_OPTIONS: FilterOption[] = [
  { value: String(TASK_STATUS.Open), label: 'باز' },
  { value: String(TASK_STATUS.Assigned), label: 'در حال انجام' },
  { value: String(TASK_STATUS.Completed), label: 'تکمیل‌شده' },
];

const TaskFilterBar = ({
  filters,
  skillOptions,
  neighborhoodOptions,
  openFilter,
  onOpenFilterChange,
  onToggleSkill,
  onToggleNeighborhood,
  onToggleStatus,
  onNeighborhoodSearch,
}: TaskFilterBarProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openFilter) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onOpenFilterChange(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openFilter, onOpenFilterChange]);

  const filterConfig = useMemo(
    () => ({
      skills: {
        label: 'مهارت‌ها',
        icon: LuWrench,
        accentColor: 'teal' as const,
        panelTitle: 'مهارت‌های من',
        searchPlaceholder: 'جستجوی مهارت...',
        options: skillOptions,
        footerLabel: (count: number) => `${toPersianDigits(count)} مهارت انتخاب شده`,
        showLocationIcon: false,
        showSearch: true,
        selectedValues: filters.skillIds.map(String),
        onSelect: (value: string) => onToggleSkill(Number(value)),
        onSearch: undefined,
      },
      neighborhoods: {
        label: 'مناطق',
        icon: FiMapPin,
        accentColor: 'orange' as const,
        panelTitle: 'مناطق من',
        searchPlaceholder: 'جستجوی محله...',
        options: neighborhoodOptions,
        footerLabel: (count: number) => `${toPersianDigits(count)} منطقه انتخاب شده`,
        showLocationIcon: true,
        showSearch: true,
        selectedValues: filters.neighborhoodIds.map(String),
        onSelect: (value: string) => onToggleNeighborhood(Number(value)),
        onSearch: onNeighborhoodSearch,
      },
      statuses: {
        label: 'وضعیت',
        icon: FiSliders,
        accentColor: 'teal' as const,
        panelTitle: 'وضعیت وظیفه',
        searchPlaceholder: 'جستجوی وضعیت...',
        options: STATUS_OPTIONS,
        footerLabel: (count: number) => `${toPersianDigits(count)} وضعیت انتخاب شده`,
        showLocationIcon: false,
        showSearch: false,
        selectedValues: filters.statusIds.map(String),
        onSelect: (value: string) => onToggleStatus(Number(value)),
        onSearch: undefined,
      },
    }),
    [
      skillOptions,
      neighborhoodOptions,
      filters.skillIds,
      filters.neighborhoodIds,
      filters.statusIds,
      onToggleSkill,
      onToggleNeighborhood,
      onToggleStatus,
      onNeighborhoodSearch,
    ],
  );

  const handleToggle = (filter: FilterType) => {
    onOpenFilterChange(openFilter === filter ? null : filter);
  };

  const activeConfig = openFilter ? filterConfig[openFilter] : null;

  return (
    <Box ref={containerRef} position="relative" w="full">
      <HStack gap="1" w="full" align="flex-start">
        <Box flex="1" minW="0">
          <FilterTrigger
            label={filterConfig.skills.label}
            icon={filterConfig.skills.icon}
            selectedCount={filters.skillIds.length}
            isOpen={openFilter === 'skills'}
            onClick={() => handleToggle('skills')}
            accentColor={filterConfig.skills.accentColor}
          />
        </Box>
        <Box flex="1" minW="0">
          <FilterTrigger
            label={filterConfig.neighborhoods.label}
            icon={filterConfig.neighborhoods.icon}
            selectedCount={filters.neighborhoodIds.length}
            isOpen={openFilter === 'neighborhoods'}
            onClick={() => handleToggle('neighborhoods')}
            accentColor={filterConfig.neighborhoods.accentColor}
          />
        </Box>
        <Box flex="1" minW="0">
          <FilterTrigger
            label={filterConfig.statuses.label}
            icon={filterConfig.statuses.icon}
            selectedCount={filters.statusIds.length}
            isOpen={openFilter === 'statuses'}
            onClick={() => handleToggle('statuses')}
            accentColor={filterConfig.statuses.accentColor}
          />
        </Box>
      </HStack>

      {openFilter && activeConfig && (
        <Box position="absolute" top="calc(100% + 8px)" left="0" right="0" zIndex="popover">
          <FilterDropdownPanel
            panelTitle={activeConfig.panelTitle}
            searchPlaceholder={activeConfig.searchPlaceholder}
            options={activeConfig.options}
            selectedValues={activeConfig.selectedValues}
            onSelect={activeConfig.onSelect}
            accentColor={activeConfig.accentColor}
            footerLabel={activeConfig.footerLabel}
            showLocationIcon={activeConfig.showLocationIcon}
            locationIcon={activeConfig.icon}
            showSearch={activeConfig.showSearch}
            onSearch={activeConfig.onSearch}
          />
        </Box>
      )}
    </Box>
  );
};

export default TaskFilterBar;