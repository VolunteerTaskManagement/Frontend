import { api } from './api';
import type { ApiResponse, PaginatedResult, TaskDetail, TaskListItem, TaskQueryParams , TaskVolunteerConfirmation } from '../types/task';

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

export const fetchTaskImage = async (fileUrl: string, signal?: AbortSignal): Promise<Blob> => {
  const res = await api.get("/MediaFiles/StramImg", {
    params: { FileUrl: fileUrl },
    responseType: "blob",
    signal,
  });
  return res.data;
};
 

export const assignTask = async (
  id: number
): Promise<ApiResponse<null>> => {
  const res = await api.post("/Tasks/assign", { id });

  return res.data;
};

export const fetchMyTasks = async (
  params: TaskQueryParams
): Promise<ApiResponse<PaginatedResult<TaskListItem>>> => {
  const queryString = buildTaskQueryString(params);
  const res = await api.get(`/Tasks/my?${queryString}`);
 
  return res.data;
};
 
export const unassignTask = async (
  id: number
): Promise<ApiResponse<null>> => {
  const res = await api.post("/Tasks/unassign", { id });
 
  return res.data;
};
 
export const completeTask = async (
  id: number
): Promise<ApiResponse<null>> => {
  const res = await api.post("/Tasks/complete-by-volunteer", { id });
 
  return res.data;
};
 
export const fetchTaskVolunteerConfirmations = async (
  id: number
): Promise<ApiResponse<TaskVolunteerConfirmation[]>> => {
  const res = await api.get(`/Tasks/${id}/volunteer-confirmations`);

  return res.data;
};

export const cancelTask = async (id: number): Promise<ApiResponse<null>> => {
  const res = await api.delete(`/Tasks/${id}`);

  return res.data;
};

export const confirmTaskCompletion = async (id: number): Promise<ApiResponse<null>> => {
  const res = await api.post('/Tasks/confirm', { id });

  return res.data;
};

export const startTask = async (id: number): Promise<ApiResponse<null>> => {
  const res = await api.post('/Tasks/start', { id });

  return res.data;
};