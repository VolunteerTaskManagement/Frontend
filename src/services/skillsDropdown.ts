import { api } from "./api";
import type { SkillsResponse } from "../types/skillsDropdown";

export const getSkills = async (): Promise<SkillsResponse> => {
  const res = await api.get("/Tasks/skills");
  return res.data;
};