import type { FilterOption } from '../types/task';

export function filterOptionsByQuery(options: FilterOption[], query: string): FilterOption[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return options;

  return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
}