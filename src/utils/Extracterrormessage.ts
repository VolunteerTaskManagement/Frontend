import axios from 'axios';
import type { ApiResponse } from '../types/task';
interface ApiMessageShape {
  message?: string | null;
  error?: { message?: string | null } | null;
}


export function resolveApiMessage(res: ApiMessageShape | undefined | null, fallback: string): string {
  if (res?.message) return res.message;
  if (res?.error?.message) return res.error.message;
  return fallback;
}

export function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiResponse<unknown>>(err)) {
    return resolveApiMessage(err.response?.data, fallback);
  }

  return fallback;
}