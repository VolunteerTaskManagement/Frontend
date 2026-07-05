import { create } from 'zustand';
import { fetchMyTasks } from '../services/taskService';
import type { TaskListItem, TaskQueryParams } from '../types/task';

const PAGE_SIZE = 10;

export type MyTaskTab = 'active' | 'completed' | 'cancelled';

export const TAB_STATUS_MAP: Record<MyTaskTab, number[]> = {
  active: [1, 2],
  completed: [3],
  cancelled: [4],
};

export const TAB_LABELS: Record<MyTaskTab, string> = {
  active: 'در حال انجام',
  completed: 'انجام شده',
  cancelled: 'لغو شده',
};

// بک‌اند PageIndex را 1-based حساب می‌کند (اولین صفحه = 1، نه 0)
const buildParams = (tab: MyTaskTab, pageIndex: number): TaskQueryParams => ({
  Statuses: TAB_STATUS_MAP[tab],
  PageIndex: pageIndex,
  PageSize: PAGE_SIZE,
});

interface MyTaskState {
  tasks: TaskListItem[];
  activeTab: MyTaskTab;
  pageIndex: number;
  hasNextPage: boolean;
  filteredCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  setActiveTab: (tab: MyTaskTab) => void;
  fetchMyTasks: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  removeTask: (id: number) => void;
}

export const useMyTaskStore = create<MyTaskState>((set, get) => ({
  tasks: [],
  activeTab: 'active',
  pageIndex: 1,
  hasNextPage: false,
  filteredCount: 0,
  isLoading: false,
  isLoadingMore: false,
  error: null,

  setActiveTab: (tab) => {
    set({ activeTab: tab, tasks: [], pageIndex: 1, hasNextPage: false });
    get().fetchMyTasks();
  },

  fetchMyTasks: async () => {
    const { activeTab } = get();
    set({ isLoading: true, error: null });

    try {
      const res = await fetchMyTasks(buildParams(activeTab, 1));

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
      set({ error: 'بارگذاری وظایف با خطا مواجه شد.', isLoading: false });
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

  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
}));