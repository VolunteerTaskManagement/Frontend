import { create } from 'zustand';
import { fetchNotificationCount, fetchNotificationLogs } from '../services/notificationService';
import type { NotificationLog } from '../types/notification';

interface NotificationState {
  // لیست کامل اعلان‌ها؛ فقط با کلیک روی زنگوله (GET /NotificationLogs) گرفته می‌شه
  logs: NotificationLog[];
  isLoadingLogs: boolean;
  logsError: string | null;

  // عدد badge؛ منبع حقیقتش API شمارش (GET /NotificationLogs/count) هست،
  // نه سوکت و نه لیست کامل. با تعویض تب/صفحه عوض نمی‌شه، فقط با کلیک روی زنگوله صفر می‌شه.
  unseenCount: number;
  hasFetchedCount: boolean;
  isLoadingCount: boolean;

  fetchLogs: () => Promise<void>;
  fetchUnseenCount: (force?: boolean) => Promise<void>;
  resetUnseenCountLocally: () => void;
  resetNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  logs: [],
  isLoadingLogs: false,
  logsError: null,

  unseenCount: 0,
  hasFetchedCount: false,
  isLoadingCount: false,

  // این فقط وقتی صدا زده می‌شه که کاربر روی آیکون زنگوله کلیک کنه
  fetchLogs: async () => {
    set({ isLoadingLogs: true, logsError: null });

    try {
      const res = await fetchNotificationLogs();

      if (!res.isSuccess) {
        set({ logsError: res.message ?? 'دریافت اعلان‌ها با خطا مواجه شد.', isLoadingLogs: false });
        return;
      }

      set({ logs: res.value, isLoadingLogs: false });
    } catch {
      set({ logsError: 'دریافت اعلان‌ها با خطا مواجه شد.', isLoadingLogs: false });
    }
  },

  // force=true یعنی حتی اگه قبلاً یک بار گرفته شده، دوباره از سرور بگیر
  // (مثلاً بعد از رسیدن یه پیام جدید از سوکت، برای به‌روز نگه‌داشتن عدد واقعی)
  fetchUnseenCount: async (force = false) => {
    if (!force && (get().hasFetchedCount || get().isLoadingCount)) return;

    set({ isLoadingCount: true });

    try {
      const res = await fetchNotificationCount();

      if (!res.isSuccess) {
        set({ isLoadingCount: false, hasFetchedCount: true });
        return;
      }

      set({ unseenCount: res.value ?? 0, isLoadingCount: false, hasFetchedCount: true });
    } catch {
      set({ isLoadingCount: false, hasFetchedCount: true });
    }
  },

  // چون endpoint واقعی برای mark-as-seen نداریم، با کلیک روی زنگوله فقط به‌صورت
  // محلی (optimistic) عدد badge رو صفر می‌کنیم.
  resetUnseenCountLocally: () => set({ unseenCount: 0 }),

  resetNotifications: () =>
    set({
      logs: [],
      isLoadingLogs: false,
      logsError: null,
      unseenCount: 0,
      hasFetchedCount: false,
      isLoadingCount: false,
    }),
}));