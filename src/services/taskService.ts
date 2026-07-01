import { MOCK_TASKS } from '../constants/tasks';
import type { Task } from '../types/task';

const SIMULATED_DELAY_MS = 400;

export async function fetchTasks(): Promise<Task[]> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
  return [...MOCK_TASKS];
}

export async function fetchTaskById(id: string): Promise<Task | null> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
  return MOCK_TASKS.find((task) => task.id === id) ?? null;
}
