import { useState } from 'react';
import { completeTask } from '../services/taskService';
import { useMyTaskStore } from '../stores/myTaskStore';
import { extractErrorMessage } from '../utils/Extracterrormessage';

interface ActionResult {
  success: boolean;
  message: string;
}

export function useCompleteTask() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTaskConfirmation = useMyTaskStore((state) => state.updateTaskConfirmation);

  const complete = async (taskId: number): Promise<ActionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await completeTask(taskId);

      if (!res.isSuccess) {
        const message = res.message ?? 'ثبت انجام تسک با خطا مواجه شد.';
        setError(message);

        return {
          success: false,
          message,
        };
      }

      updateTaskConfirmation(taskId);

      return {
        success: true,
        message: 'وظیفه با موفقیت انجام شد.',
      };
    } catch (err) {
      const message = extractErrorMessage(err, 'ثبت انجام تسک با خطا مواجه شد.');
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
    complete,
    isLoading,
    error,
  };
}