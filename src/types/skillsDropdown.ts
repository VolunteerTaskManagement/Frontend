export interface Skill {
  key: number;
  value: string;
}

export interface SkillsResponse {
  value: Skill[];
  isSuccess: boolean;
  isFailure: boolean;
  message: string | null;
  error: {
    code: string;
    message: string;
  };
}