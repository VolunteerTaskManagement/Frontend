import { useState } from 'react';
import { assignTask } from '../services/taskService';

export function useAssignTask() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const assign = async (taskId: number) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const res = await assignTask(taskId);

      if (!res.isSuccess) {
        setError(res.message ?? 'ثبت‌نام با خطا مواجه شد.');
      } else {
        setIsSuccess(true);
      }
    } catch {
      setError('ثبت‌نام با خطا مواجه شد.');
    } finally {
      setIsLoading(false);
    }
  };

  return { assign, isLoading, error, isSuccess };
}