import { api } from "./api";
import type {
  ProfileResponse,
  UpdateProfileResponse,
} from "../types/profile";

export const getProfile = async (): Promise<ProfileResponse> => {
  const res = await api.get("/Profile");
  return res.data;
};

interface UpdateProfileParams {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDate?: string;
  neighborhoodId?: number;
  skills?: number[];
  profilePic?: File | null;
  nationalCode?: string;
}

export const updateProfile = async (
  data: UpdateProfileParams
): Promise<UpdateProfileResponse> => {
  const formData = new FormData();

  formData.append("FirstName", data.firstName);
  formData.append("LastName", data.lastName);
  formData.append("PhoneNumber", data.phoneNumber);

  if (data.birthDate) {
    formData.append("BirthDate", data.birthDate);
  }
  if (typeof data.neighborhoodId === "number") {
    formData.append("NeighborhoodId", data.neighborhoodId.toString());
  }
  if (data.skills && data.skills.length > 0) {
    data.skills.forEach((skill) => {
      formData.append("Skills", skill.toString());
    });
  }

  if (data.profilePic) {
    formData.append("ProfilePic", data.profilePic);
  }

  if (data.nationalCode !== undefined && data.nationalCode !== null && data.nationalCode !== "") {
    formData.append("NationalCode", data.nationalCode);
  }

  const res = await api.put("/Profile", formData);

  return res.data;
};

export interface UpdateCoordinatorProfileParams {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationalCode: string;
  profilePic?: File | null;
}

export const updateCoordinatorProfile = async (
  data: UpdateCoordinatorProfileParams
): Promise<UpdateProfileResponse> => {
  const formData = new FormData();

  formData.append("FirstName", data.firstName);
  formData.append("LastName", data.lastName);
  formData.append("PhoneNumber", data.phoneNumber);
  formData.append("NationalCode", data.nationalCode);

  if (data.profilePic) {
    formData.append("ProfilePic", data.profilePic);
  }

  const res = await api.put("/Profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
