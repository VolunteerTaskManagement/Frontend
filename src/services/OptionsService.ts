import { api } from './api';
import type { ApiResponse, NeighborhoodOption, SkillOption } from '../types/task';

export const fetchNeighborhoods = async (params?: {
  Title?: string;
  CityId?: number;
  RegionId?: number;
}): Promise<ApiResponse<NeighborhoodOption[]>> => {
  const res = await api.get("/Neighborhoods/Dropdown", { params });

  return res.data;
};

export const fetchSkills = async (params?: {
  search?: string;
}): Promise<ApiResponse<SkillOption[]>> => {
  const res = await api.get("/Tasks/skills", { params });

  return res.data;
};