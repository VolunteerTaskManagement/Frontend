import { api } from "./api";

export interface UpdateTaskRequest {
  id: number;
  title: string;
  description: string;
  neighborhoodId: number;
  address: string;
  startDate: string;
  count: number;
  skills: number[];
  lat: number;
  lng: number;
  pic?: File;
}

export const updateTask = async (data: UpdateTaskRequest) => {
  const formData = new FormData();

  formData.append("Id", data.id.toString());
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

  if (data.pic) {
    formData.append("Pic", data.pic);
  }

  const response = await api.put("/Tasks", formData);

  return response.data;
};