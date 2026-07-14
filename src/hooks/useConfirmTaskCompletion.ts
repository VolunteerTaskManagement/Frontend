import { useState } from 'react';
import { confirmTaskCompletion } from '../services/taskService';
import { extractErrorMessage, resolveApiMessage } from '../utils/Extracterrormessage';

export function useConfirmTaskCompletion() {
  const [isLoading, setIsLoading] = useState(false);

  const confirmCompletion = async (id: number) => {
    setIsLoading(true);

    try {
      const res = await confirmTaskCompletion(id);
      setIsLoading(false);

      return {
        success: res.isSuccess,
        message: res.isSuccess
          ? res.message ?? 'پایان تسک با موفقیت ثبت شد.'
          : resolveApiMessage(res, 'ثبت پایان تسک با خطا مواجه شد.'),
      };
    } catch (err) {
      setIsLoading(false);
      return {
        success: false,
        message: extractErrorMessage(err, 'ثبت پایان تسک با خطا مواجه شد.'),
      };
    }
  };

  return { confirmCompletion, isLoading };
}