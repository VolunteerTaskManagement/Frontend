import { useState } from 'react';
import { fetchTaskVolunteerConfirmations } from '../services/taskService';
import type { TaskVolunteerConfirmation } from '../types/task';

export function useTaskVolunteers() {
  const [volunteers, setVolunteers] = useState<TaskVolunteerConfirmation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVolunteers = async (taskId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchTaskVolunteerConfirmations(taskId);

      if (!res.isSuccess) {
        setError(res.message ?? 'دریافت اطلاعات داوطلبان با خطا مواجه شد.');
        setIsLoading(false);
        return;
      }

      setVolunteers(res.value);
      setIsLoading(false);
    } catch {
      setError('دریافت اطلاعات داوطلبان با خطا مواجه شد.');
      setIsLoading(false);
    }
  };

  return { volunteers, isLoading, error, fetchVolunteers };
}