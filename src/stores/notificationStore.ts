import { create } from 'zustand';
import { fetchNotificationLogs } from '../services/notificationService';
import type { NotificationLog } from '../types/notification';

interface NotificationState {
  logs: NotificationLog[];
  isLoading: boolean;
  error: string | null;
  fetchLogs: () => Promise<void>;
  addLogFromSocket: (raw: unknown) => void;
  markAllSeenLocally: () => void;
}
function normalizeSocketPayload(raw: unknown): NotificationLog | null {
  if (typeof raw === 'string') {
    return {
      id: Date.now(),
      title: raw,
      type: 'info',
      usersId: [],
      isSeen: false,
      createDateFa: '',
    };
  }

  if (raw && typeof raw === 'object' && 'title' in raw) {
    const obj = raw as Partial<NotificationLog>;
    return {
      id: obj.id ?? Date.now(),
      title: obj.title ?? '',
      type: obj.type ?? 'info',
      usersId: obj.usersId ?? [],
      isSeen: obj.isSeen ?? false,
      createDateFa: obj.createDateFa ?? '',
    };
  }

  return null;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  logs: [],
  isLoading: false,
  error: null,

  fetchLogs: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetchNotificationLogs();

      if (!res.isSuccess) {
        set({ error: res.message ?? 'دریافت اعلان‌ها با خطا مواجه شد.', isLoading: false });
        return;
      }

      set({ logs: res.value, isLoading: false });
    } catch {
      set({ error: 'دریافت اعلان‌ها با خطا مواجه شد.', isLoading: false });
    }
  },

  addLogFromSocket: (raw) => {
    const notification = normalizeSocketPayload(raw);
    if (!notification) return;

    set((state) => ({ logs: [notification, ...state.logs] }));
  },
  markAllSeenLocally: () =>
    set((state) => ({
      logs: state.logs.map((log) => ({ ...log, isSeen: true })),
    })),
}));

export const selectUnseenCount = (state: NotificationState) =>
  state.logs.filter((log) => !log.isSeen).length;