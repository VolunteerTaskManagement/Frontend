import { useEffect } from 'react';
import { useTaskStore } from '../stores/taskStore';

export function useTask(taskId: number | undefined) {
  const taskDetailCache = useTaskStore((state) => state.taskDetailCache);
  const taskDetailLoadingId = useTaskStore((state) => state.taskDetailLoadingId);
  const taskDetailError = useTaskStore((state) => state.taskDetailError);
  const fetchTaskById = useTaskStore((state) => state.fetchTaskById);

  useEffect(() => {
    if (taskId === undefined) return;
    fetchTaskById(taskId);
  }, [taskId, fetchTaskById]);

  if (taskId === undefined) {
    return { task: null, isLoading: false, error: 'وظیفه یافت نشد.' };
  }

  const task = taskDetailCache[taskId] ?? null;
  const isLoading = taskDetailLoadingId === taskId && !task;

  return { task, isLoading, error: task ? null : taskDetailError };
}