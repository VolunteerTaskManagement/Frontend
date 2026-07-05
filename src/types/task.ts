// ---- Generic API envelope (shared shape used across the backend) ----

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  isFailure: boolean;
  message: string | null;
  error: ApiError | null;
  value: T;
}

export interface PaginatedResult<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  totalCount: number;
  filteredCount: number;
}

// ---- Task status ----

export const TASK_STATUS = {
  Open: 1,
  Assigned: 2,
  Completed: 3,
  Cancelled: 4,
} as const;

export type TaskStatusId = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

// ---- Task list item: GET /api/Tasks ----

export interface TaskListItem {
  id: number;
  title: string;
  description: string;
  skills: number[];
  skillTitles: string[];
  count: number;
  volunteerCount: number;
  picName: string;
  picUrl: string;
  neighborhoodTitle: string;
  address: string;
  startDate: string;
  startDateFa: string;
  regionName: string;
  cityName: string;
  isAssigned: boolean;
  isConfirmedByVolunteer: boolean;
  status: number;
  statusTitle: string;
}

// ---- Task detail: GET /api/Tasks/{id} ----

export interface TaskDetail {
  id: number;
  title: string;
  skills: number[];
  skillTitles: string[];
  picName: string;
  picUrl: string;
  count: number;
  volunteerCount: number;
  coordinatorName: string;
  mobile: string;
  description: string;
  address: string;
  startDate: string;
  startDateFa: string;
  neighborhoodId: number;
  neighborhoodTitle: string;
  isAssigned: boolean;
}

// ---- Query params: GET /api/Tasks ----

export interface TaskQueryParams {
  Title?: string;
  NeighborhoodIds?: number[];
  Skills?: number[];
  Statuses?: number[];
  PageSize?: number;
  PageIndex?: number;
}

// ---- Filters used by the UI (kept separate from the raw API param shape) ----

export interface TaskFilters {
  search: string;
  skillIds: number[];
  neighborhoodIds: number[];
  statusIds: number[];
}

export type FilterType = 'skills' | 'neighborhoods' | 'statuses';

// Normalized shape every dropdown/panel component renders against,
// regardless of whether the backend returned {key, value} or {id, title}.
export interface FilterOption {
  value: string;
  label: string;
}

// ---- Lookup endpoints ----

// GET /api/Neighborhoods/Dropdown -> { value: { id, title }[] }
export interface NeighborhoodOption {
  id: number;
  title: string;
}

// GET /api/Tasks/skills -> { value: { key, value }[] }
export interface SkillOption {
  key: number;
  value: string;
}