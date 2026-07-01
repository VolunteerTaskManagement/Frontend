export interface Task {
  id: string;
  title: string;
  creatorName: string;
  description: string;
  address: string;
  creatorPhone: string;
  imageUrl: string;
  skills: string[];
  neighborhood: string;
  schedule: string;
  vacancies: number;
}

export interface TaskFilters {
  search: string;
  skills: string[];
  neighborhoods: string[];
}

export type FilterType = 'skills' | 'neighborhoods';

export interface FilterOption {
  value: string;
  label: string;
}
