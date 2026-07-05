import { api } from './api';

export const fetchTaskImage = async (fileUrl: string): Promise<string> => {
  const res = await api.get('/MediaFiles/StramImg', {
    params: { FileUrl: fileUrl },
    responseType: 'blob',
  });

  return URL.createObjectURL(res.data as Blob);
};