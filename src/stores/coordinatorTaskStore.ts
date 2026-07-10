import { create } from 'zustand';
import { fetchMyTasks } from '../services/taskService';
import type { TaskListItem, TaskQueryParams } from '../types/task';

const PAGE_SIZE = 10;

export type CoordinatorTaskTab = 'open' | 'completed' | 'cancelled';

export const COORDINATOR_TAB_STATUS_MAP: Record<CoordinatorTaskTab, number[]> = {
  open: [1, 2],
  completed: [3],
  cancelled: [4],
};

export const COORDINATOR_TAB_LABELS: Record<CoordinatorTaskTab, string> = {
  open: 'باز',
  completed: 'پایان‌یافته',
  cancelled: 'لغوشده',
};

// بک‌اند PageIndex را 1-based حساب می‌کند (اولین صفحه = 1، نه 0)
const buildParams = (tab: CoordinatorTaskTab, pageIndex: number): TaskQueryParams => ({
  Statuses: COORDINATOR_TAB_STATUS_MAP[tab],
  PageIndex: pageIndex,
  PageSize: PAGE_SIZE,
});

interface CoordinatorTaskState {
  tasks: TaskListItem[];
  activeTab: CoordinatorTaskTab;
  pageIndex: number;
  hasNextPage: boolean;
  filteredCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  setActiveTab: (tab: CoordinatorTaskTab) => void;
  fetchTasks: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  removeTaskLocally: (id: number) => void;
}

export const useCoordinatorTaskStore = create<CoordinatorTaskState>((set, get) => ({
  tasks: [],
  activeTab: 'open',
  pageIndex: 1,
  hasNextPage: false,
  filteredCount: 0,
  isLoading: false,
  isLoadingMore: false,
  error: null,

  setActiveTab: (tab) => {
    set({ activeTab: tab, tasks: [], pageIndex: 1, hasNextPage: false });
    get().fetchTasks();
  },

  fetchTasks: async () => {
    const { activeTab } = get();
    set({ isLoading: true, error: null });

    try {
      const res = await fetchMyTasks(buildParams(activeTab, 1));

      if (!res.isSuccess) {
        set({ error: res.message ?? 'بارگذاری تسک‌ها با خطا مواجه شد.', isLoading: false });
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
      set({ error: 'بارگذاری تسک‌ها با خطا مواجه شد.', isLoading: false });
    }
  },

  fetchNextPage: async () => {
    const { activeTab, hasNextPage, isLoadingMore, pageIndex, tasks } = get();
    if (!hasNextPage || isLoadingMore) return;

    set({ isLoadingMore: true });

    try {
      const res = await fetchMyTasks(buildParams(activeTab, pageIndex + 1));

      if (!res.isSuccess) {
        set({ isLoadingMore: false });
        return;
      }

      set({
        tasks: [...tasks, ...res.value.items],
        pageIndex: res.value.pageIndex,
        hasNextPage: res.value.hasNextPage,
        isLoadingMore: false,
      });
    } catch {
      set({ isLoadingMore: false });
    }
  },

  // بعد از لغو یا تایید پایان تسک، آیتم از لیست تب فعلی حذف می‌شود
  // (چون وضعیتش عوض شده و دیگر متعلق به این تب نیست)
  removeTaskLocally: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
}));