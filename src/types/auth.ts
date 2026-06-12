export interface LoginResponse {
  value: {
    id: number;
    userName: string;
    role: string;
    email: string | null;
    accessToken: string;
    refreshToken: string;
    isProfileComplete: boolean;
  };
  isSuccess: boolean;
  isFailure: boolean;
  message: string | null;
}