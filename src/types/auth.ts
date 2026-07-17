export interface LoginResponse {
  value: {
    id: number;
    userName: string;
    role: string;
    email: string | null;
    accessToken: string;
    refreshToken: string;
    isProfileComplete: boolean;
    neighborhoodId: number | null;
    skills: number[];
  };
  isSuccess: boolean;
  isFailure: boolean;
  message: string | null;
}

export interface RegisterRequest {
  userName: string;
  firstName: string;
  lastName: string;
  role: number;
  password: string;
  confirmedPassword: string;
}

export interface RegisterResponse {
  value: boolean;
  isSuccess: boolean;
  isFailure: boolean;
  message: string | null;
  error: {
    code: string;
    message: string;
  };
}

export interface ForgotPasswordResponse {
  value: boolean;
  isSuccess: boolean;
  isFailure: boolean;
  message: string | null;
  error: {
    code: string;
    message: string;
  } | null;
}

export interface ChangeForgotPasswordRequest {
  userName: string;
  newPassword: string;
  confirmedNewPassword: string;
}

export interface ChangeForgotPasswordResponse {
  isSuccess: boolean;
  isFailure: boolean;
  message: string | null;
  error: {
    code: string;
    message: string;
  } | null;
}