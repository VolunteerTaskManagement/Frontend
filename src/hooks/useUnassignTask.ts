import { useState } from 'react';
import { unassignTask } from '../services/taskService';
import { useMyTaskStore } from '../stores/myTaskStore';

interface ActionResult {
  success: boolean;
  message: string;
}

export function useUnassignTask() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeTask = useMyTaskStore((state) => state.removeTask);

  const unassign = async (taskId: number): Promise<ActionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await unassignTask(taskId);

      if (!res.isSuccess) {
        const message = res.message ?? 'کناره‌گیری با خطا مواجه شد.';
        setError(message);

        return {
          success: false,
          message,
        };
      }

      removeTask(taskId);

      return {
        success: true,
        message: 'با موفقیت از وظیفه کناره‌گیری کردید.',
      };
    } catch {
      const message = 'کناره‌گیری با خطا مواجه شد.';
      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    unassign,
    isLoading,
    error,
  };
}