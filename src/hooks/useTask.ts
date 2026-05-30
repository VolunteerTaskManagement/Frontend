import { useEffect, useState } from 'react';
import { fetchTaskById } from '../services/taskService';
import type { Task } from '../types/task';

export function useTask(taskId: string | undefined) {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) {
      setTask(null);
      setIsLoading(false);
      setError('وظیفه یافت نشد.');
      return;
    }

    const loadTask = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchTaskById(taskId);
        if (!data) {
          setError('وظیفه یافت نشد.');
          setTask(null);
        } else {
          setTask(data);
        }
      } catch {
        setError('بارگذاری وظیفه با خطا مواجه شد.');
        setTask(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  return { task, isLoading, error };
}
