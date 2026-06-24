import type { FilterOption, Task, TaskFilters } from '../types/task';

export function getOptionLabel(options: FilterOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const query = filters.search.trim().toLowerCase();

  return tasks.filter((task) => {
    // فقط روی title جستجو کن
    const matchesSearch = query.length === 0 || task.title.toLowerCase().includes(query);

    const matchesSkills =
      filters.skills.length === 0 ||
      filters.skills.some((skill) => task.skills.includes(skill));

    const matchesNeighborhoods =
      filters.neighborhoods.length === 0 ||
      filters.neighborhoods.includes(task.neighborhood);

    return matchesSearch && matchesSkills && matchesNeighborhoods;
  });
}

export function filterOptionsByQuery(options: FilterOption[], query: string): FilterOption[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return options;

  return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
}