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
  birthDate: string;
  neighborhoodId: number;
  skills: number[];
  profilePic?: File | null;
}

export const updateProfile = async (
  data: UpdateProfileParams
): Promise<UpdateProfileResponse> => {
  const formData = new FormData();

  formData.append("FirstName", data.firstName);
  formData.append("LastName", data.lastName);
  formData.append("PhoneNumber", data.phoneNumber);
  formData.append("BirthDate", data.birthDate);
  formData.append("NeighborhoodId", data.neighborhoodId.toString());

  data.skills.forEach((skill) => {
    formData.append("Skills", skill.toString());
  });

  if (data.profilePic) {
    formData.append("ProfilePic", data.profilePic);
  }

  const res = await api.put("/Profile", formData);

  return res.data;
};