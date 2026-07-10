import { useState } from 'react';
import { confirmTaskCompletion } from '../services/taskService';

export function useConfirmTaskCompletion() {
  const [isLoading, setIsLoading] = useState(false);

  const confirmCompletion = async (id: number) => {
    setIsLoading(true);

    try {
      const res = await confirmTaskCompletion(id);
      setIsLoading(false);

      return {
        success: res.isSuccess,
        message:
          res.message ??
          (res.isSuccess ? 'پایان تسک با موفقیت ثبت شد.' : 'ثبت پایان تسک با خطا مواجه شد.'),
      };
    } catch {
      setIsLoading(false);
      return { success: false, message: 'ثبت پایان تسک با خطا مواجه شد.' };
    }
  };

  return { confirmCompletion, isLoading };
}