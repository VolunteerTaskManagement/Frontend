import { api } from './api';
import type { ApiResponse, PaginatedResult, TaskDetail, TaskListItem, TaskQueryParams } from '../types/task';

const buildTaskQueryString = (params: TaskQueryParams): string => {
  const parts: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => parts.push(`${key}=${encodeURIComponent(String(item))}`));
    } else {
      parts.push(`${key}=${encodeURIComponent(String(value))}`);
    }
  });

  return parts.join('&');
};

export const fetchTasks = async (
  params: TaskQueryParams
): Promise<ApiResponse<PaginatedResult<TaskListItem>>> => {
  const queryString = buildTaskQueryString(params);
  const res = await api.get(`/Tasks?${queryString}`);

  return res.data;
};

export const fetchTaskById = async (
  id: number
): Promise<ApiResponse<TaskDetail>> => {
  const res = await api.get(`/Tasks/${id}`);

  return res.data;
};

export const fetchTaskImage = async (fileUrl: string): Promise<Blob> => {
  const res = await api.get("/MediaFiles/StramImg", {
    params: { FileUrl: fileUrl },
    responseType: "blob",
  });

  return res.data;
};

export const assignTask = async (
  id: number
): Promise<ApiResponse<null>> => {
  const res = await api.post("/Tasks/assign", { id });

  return res.data;
};