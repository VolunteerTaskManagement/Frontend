import { api } from './api';
import type { ApiResponse } from '../types/task';
import type { NotificationLog } from '../types/notification';

export const fetchNotificationLogs = async (): Promise<ApiResponse<NotificationLog[]>> => {
  const res = await api.get('/NotificationLogs');

  return res.data;
};

export const fetchNotificationCount = async (): Promise<ApiResponse<number>> => {
  const res = await api.get('/NotificationLogs/count');

  return res.data;
};