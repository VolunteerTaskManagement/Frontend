import { create } from 'zustand';
import { fetchTasks as fetchTasksService } from '../services/taskService';
import type { Task } from '../types/task';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });

    try {
      const tasks = await fetchTasksService();
      set({ tasks, isLoading: false });
    } catch {
      set({
        error: 'بارگذاری وظایف با خطا مواجه شد.',
        isLoading: false,
      });
    }
  },
}));
