import { useEffect } from 'react';
import { useNotificationStore } from '../stores/notificationStore';
import { connectNotificationSocket, onReceiveNotification } from '../services/notificationSocket';
import { toaster } from '../utils/toaster';
import { playNotificationSound } from '../utils/playNotificationSound';

export function useNotifications() {
  const logs = useNotificationStore((state) => state.logs);
  const isLoadingLogs = useNotificationStore((state) => state.isLoadingLogs);
  const logsError = useNotificationStore((state) => state.logsError);
  const fetchLogs = useNotificationStore((state) => state.fetchLogs);

  const unseenCount = useNotificationStore((state) => state.unseenCount);
  const fetchUnseenCount = useNotificationStore((state) => state.fetchUnseenCount);
  const resetUnseenCountLocally = useNotificationStore((state) => state.resetUnseenCountLocally);

  // شمارش اولیه‌ی badge (مثلاً زمان لاگین/اولین لود برنامه).
  // fetchUnseenCount خودش guard داره، پس با remount شدن هدر روی هر صفحه دوباره صدا زده نمی‌شه.
  useEffect(() => {
    fetchUnseenCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // اتصال زنده به SignalR: فقط برای toast + صدا + رفرش عدد badge از سرور.
  // توجه: خود پیام سوکت مستقیماً به لیست یا عدد اضافه نمی‌شه؛ فقط باعث یک fetchUnseenCount(force) جدید می‌شه
  // تا badge همیشه از API (منبع حقیقت) خونده بشه، نه از محتوای پیام سوکت.
  useEffect(() => {
    connectNotificationSocket().catch(() => {
      // اتصال زنده برقرار نشد؛ badge و لیست همچنان از طریق API قابل دریافت هستن
    });

    const unsubscribe = onReceiveNotification((raw) => {
      playNotificationSound();

      const title = typeof raw === 'string' ? raw : (raw as { title?: string })?.title;

      toaster.create({
        type: 'info',
        title: 'اعلان جدید',
        description: title ?? '',
        meta: { closable: true },
      });

      fetchUnseenCount(true);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // با کلیک روی زنگوله صدا زده می‌شه: لیست کامل رو می‌گیره + عدد badge رو محلی صفر می‌کنه
  const openNotificationPanel = () => {
    fetchLogs();
    resetUnseenCountLocally();
  };

  return {
    logs,
    isLoadingLogs,
    logsError,
    unseenCount,
    openNotificationPanel,
  };
}