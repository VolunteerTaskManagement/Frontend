import axios from "axios";
import { authStorage } from "../services/authStorage";

export const api = axios.create({
  baseURL: "http://89.42.199.196:5213/api",
});

api.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    return Promise.reject(error);
  }
);