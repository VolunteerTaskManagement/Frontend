import { api } from "./api";

export interface CreateTaskDto {
  pic: File;
  title: string;
  description: string;
  neighborhoodId: number;
  address: string;
  startDate: string;
  count: number;
  skills: number[];
  lat: number;
  lng: number;
}

export const createTask = async (data: CreateTaskDto) => {
  const formData = new FormData();

  formData.append("Pic", data.pic);
  formData.append("Title", data.title);
  formData.append("Description", data.description);
  formData.append("NeighborhoodId", data.neighborhoodId.toString());
  formData.append("Address", data.address);
  formData.append("StartDate", data.startDate);
  formData.append("Count", data.count.toString());
  formData.append("Lat", data.lat.toString());
  formData.append("Lng", data.lng.toString());

  data.skills.forEach((id) => {
    formData.append("Skills", id.toString());
  });

  const res = await api.post("/Tasks", formData);

  return res.data;
};