import { create } from 'zustand';
import { fetchTaskById as fetchTaskByIdService, fetchTasks as fetchTasksService } from '../services/taskService';
import type { TaskDetail, TaskFilters, TaskListItem, TaskQueryParams } from '../types/task';

const PAGE_SIZE = 10;

const buildQueryParams = (filters: TaskFilters, pageIndex: number): TaskQueryParams => ({
  Title: filters.search.trim() || undefined,
  Skills: filters.skillIds.length > 0 ? filters.skillIds : undefined,
  NeighborhoodIds: filters.neighborhoodIds.length > 0 ? filters.neighborhoodIds : undefined,
  Statuses: filters.statusIds.length > 0 ? filters.statusIds : undefined,
  PageIndex: pageIndex,
  PageSize: PAGE_SIZE,
});

interface TaskState {
  tasks: TaskListItem[];
  pageIndex: number;
  hasNextPage: boolean;
  filteredCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  taskDetailCache: Record<number, TaskDetail>;
  taskDetailLoadingId: number | null;
  taskDetailError: string | null;
  fetchTasks: (filters: TaskFilters) => Promise<void>;
  fetchNextPage: (filters: TaskFilters) => Promise<void>;
  fetchTaskById: (id: number) => Promise<void>;
  invalidateTaskCache: (id: number) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  pageIndex: 0,
  hasNextPage: false,
  filteredCount: 0,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  taskDetailCache: {},
  taskDetailLoadingId: null,
  taskDetailError: null,

  // فیلتر تغییر کرده یا اولین لود -> از صفحه‌ی صفر شروع می‌شود
  fetchTasks: async (filters) => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetchTasksService(buildQueryParams(filters, 1));

      if (!res.isSuccess) {
        set({ error: res.message ?? 'بارگذاری وظایف با خطا مواجه شد.', isLoading: false });
        return;
      }

      set({
        tasks: res.value.items,
        pageIndex: res.value.pageIndex,
        hasNextPage: res.value.hasNextPage,
        filteredCount: res.value.filteredCount,
        isLoading: false,
      });
    } catch {
      set({
        error: 'بارگذاری وظایف با خطا مواجه شد.',
        isLoading: false,
      });
    }
  },

  // اسکرول به انتها -> صفحه‌ی بعدی به لیست فعلی اضافه می‌شود
  fetchNextPage: async (filters) => {
    const { hasNextPage, isLoadingMore, pageIndex, tasks } = get();
    if (!hasNextPage || isLoadingMore) return;

    set({ isLoadingMore: true });

    try {
      const res = await fetchTasksService(buildQueryParams(filters, pageIndex + 1));

      if (!res.isSuccess) {
        set({ isLoadingMore: false });
        return;
      }

      set({
        tasks: [...tasks, ...res.value.items],
        pageIndex: res.value.pageIndex,
        hasNextPage: res.value.hasNextPage,
        filteredCount: res.value.filteredCount,
        isLoadingMore: false,
      });
    } catch {
      set({ isLoadingMore: false });
    }
  },

  // جزئیات تسک با کش -> در صورت وجود در کش، دوباره فراخوانی API نمی‌شود
  fetchTaskById: async (id) => {
    const cached = get().taskDetailCache[id];
    if (cached) return;

    set({ taskDetailLoadingId: id, taskDetailError: null });

    try {
      const res = await fetchTaskByIdService(id);

      if (!res.isSuccess) {
        set({
          taskDetailError: res.message ?? 'وظیفه یافت نشد.',
          taskDetailLoadingId: null,
        });
        return;
      }

      set((state) => ({
        taskDetailCache: { ...state.taskDetailCache, [id]: res.value },
        taskDetailLoadingId: null,
      }));
    } catch {
      set({
        taskDetailError: 'بارگذاری وظیفه با خطا مواجه شد.',
        taskDetailLoadingId: null,
      });
    }
  },

  // آپدیت isAssigned در cache بدون پاک کردن کل داده
  invalidateTaskCache: (id) =>
    set((state) => {
      const cached = state.taskDetailCache[id];
      if (!cached) return {};
      return {
        taskDetailCache: {
          ...state.taskDetailCache,
          [id]: { ...cached, isAssigned: true },
        },
      };
    }),
}));