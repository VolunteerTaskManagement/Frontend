import { useState } from 'react';
import { completeTask } from '../services/taskService';
import { useMyTaskStore } from '../stores/myTaskStore';

export function useCompleteTask() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const removeTask = useMyTaskStore((state) => state.removeTask);

  const complete = async (taskId: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await completeTask(taskId);

      if (!res.isSuccess) {
        setError(res.message ?? 'ثبت انجام تسک با خطا مواجه شد.');
        return false;
      }

      removeTask(taskId);
      return true;
    } catch {
      setError('ثبت انجام تسک با خطا مواجه شد.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { complete, isLoading, error };
}