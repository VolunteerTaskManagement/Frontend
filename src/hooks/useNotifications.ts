import { useEffect } from 'react';
import { selectUnseenCount, useNotificationStore } from '../stores/notificationStore';
import { connectNotificationSocket, onReceiveNotification } from '../services/notificationSocket';
import { toaster } from '../utils/toaster';

export function useNotifications() {
  const logs = useNotificationStore((state) => state.logs);
  const isLoading = useNotificationStore((state) => state.isLoading);
  const error = useNotificationStore((state) => state.error);
  const fetchLogs = useNotificationStore((state) => state.fetchLogs);
  const addLogFromSocket = useNotificationStore((state) => state.addLogFromSocket);
  const markAllSeenLocally = useNotificationStore((state) => state.markAllSeenLocally);
  const unseenCount = useNotificationStore(selectUnseenCount);

  // لود اولیه‌ی لیست از API
  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // اتصال زنده به SignalR + نمایش توست برای پیام‌های جدید
  useEffect(() => {
    connectNotificationSocket().catch(() => {
      // اتصال زنده برقرار نشد؛ لیست همچنان از طریق فراخوانی API نمایش داده می‌شود
    });

    const unsubscribe = onReceiveNotification((raw) => {
      addLogFromSocket(raw);

      const title = typeof raw === 'string' ? raw : (raw as { title?: string })?.title;

      toaster.create({
        type: 'info',
        title: 'اعلان جدید',
        description: title ?? '',
        meta: { closable: true },
      });
    });

    // توجه: عمداً سوکت را قطع نمی‌کنیم، فقط شنونده را لغو می‌کنیم؛
    // اتصال باید در طول کل عمر برنامه زنده بماند.
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { logs, isLoading, error, unseenCount, refetch: fetchLogs, markAllSeenLocally };
}