import axios from 'axios';
import type { ApiResponse } from '../types/task';

export function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiResponse<unknown>>(err)) {
    const data = err.response?.data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }

  return fallback;
}