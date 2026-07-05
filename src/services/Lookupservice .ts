import { api } from './api';
import type { ApiResponse, NeighborhoodOption, SkillOption } from '../types/task';

export interface FetchNeighborhoodsParams {
  Title?: string;
  CityId?: number;
  RegionId?: number;
}

export const fetchNeighborhoods = async (
  params: FetchNeighborhoodsParams = {},
): Promise<NeighborhoodOption[]> => {
  const res = await api.get<ApiResponse<NeighborhoodOption[]>>('/Neighborhoods/Dropdown', {
    params,
  });

  return res.data.value;
};

export const fetchSkills = async (search?: string): Promise<SkillOption[]> => {
  const res = await api.get<ApiResponse<SkillOption[]>>('/Tasks/skills', {
    params: search ? { search } : undefined,
  });

  return res.data.value;
};