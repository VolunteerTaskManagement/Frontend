import { useState } from 'react';
import { startTask } from '../services/taskService';
import { extractErrorMessage } from '../utils/Extracterrormessage';

export function useStartTask() {
  const [isLoading, setIsLoading] = useState(false);
  const start = async (id: number) => {
    setIsLoading(true);

    try {
      const res = await startTask(id);
      setIsLoading(false);

      return {
        success: res.isSuccess,
        message:
          res.message ?? (res.isSuccess ? 'تسک با موفقیت شروع شد.' : 'شروع تسک با خطا مواجه شد.'),
      };
    } catch (err) {
      setIsLoading(false);
      return { success: false, message: extractErrorMessage(err, 'شروع تسک با خطا مواجه شد.') };
    }
  };

  return { start, isLoading };
}