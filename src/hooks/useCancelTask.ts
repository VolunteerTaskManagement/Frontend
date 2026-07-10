import { useState } from 'react';
import { cancelTask } from '../services/taskService';

export function useCancelTask() {
  const [isLoading, setIsLoading] = useState(false);

  const cancel = async (id: number) => {
    setIsLoading(true);

    try {
      const res = await cancelTask(id);
      setIsLoading(false);

      return {
        success: res.isSuccess,
        message:
          res.message ?? (res.isSuccess ? 'تسک با موفقیت لغو شد.' : 'لغو تسک با خطا مواجه شد.'),
      };
    } catch {
      setIsLoading(false);
      return { success: false, message: 'لغو تسک با خطا مواجه شد.' };
    }
  };

  return { cancel, isLoading };
}