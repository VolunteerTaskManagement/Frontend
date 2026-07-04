export interface ProfileResponse {
  value: Profile;
  isSuccess: boolean;
  isFailure: boolean;
  message: string | null;
  error: {
    code: string;
    message: string;
  };
}

export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  role: string;
  picName: string;
  picUrl: string;
  neighborhoodTitle: string;
  neighborhoodId: number; 
  skills: number[];
  skillTitles: string[];
}

export interface UpdateProfileResponse {
  value: boolean;
  isSuccess: boolean;
  isFailure: boolean;
  message: string | null;
  error: {
    code: string;
    message: string;
  };
}