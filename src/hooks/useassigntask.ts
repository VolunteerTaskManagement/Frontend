import { useState } from 'react';
import { assignTask } from '../services/taskService';
import { useTaskStore } from '../stores/taskStore';
import { extractErrorMessage } from '../utils/Extracterrormessage';

interface ActionResult {
  success: boolean;
  message: string;
}

export function useAssignTask() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const invalidateTaskCache = useTaskStore(
    (state) => state.invalidateTaskCache,
  );

  const assign = async (taskId: number): Promise<ActionResult> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const res = await assignTask(taskId);

      if (!res.isSuccess) {
        const message = res.message ?? 'ثبت‌نام با خطا مواجه شد.';
        setError(message);

        return {
          success: false,
          message,
        };
      }

      setIsSuccess(true);
      invalidateTaskCache(taskId);

      return {
        success: true,
        message: 'ثبت‌نام شما با موفقیت انجام شد.',
      };
    } catch (err) {
      const message = extractErrorMessage(err, 'ثبت‌نام با خطا مواجه شد.');
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
    assign,
    isLoading,
    error,
    isSuccess,
  };
}