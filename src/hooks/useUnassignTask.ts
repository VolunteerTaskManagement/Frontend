import { useState } from 'react';
import { unassignTask } from '../services/taskService';
import { useMyTaskStore } from '../stores/myTaskStore';

export function useUnassignTask() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const removeTask = useMyTaskStore((state) => state.removeTask);

  const unassign = async (taskId: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await unassignTask(taskId);

      if (!res.isSuccess) {
        setError(res.message ?? 'کناره‌گیری با خطا مواجه شد.');
        return false;
      }

      removeTask(taskId);
      return true;
    } catch {
      setError('کناره‌گیری با خطا مواجه شد.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { unassign, isLoading, error };
}