import { api } from "./api";
import type { LoginResponse } from "../types/auth";
import type {
  RegisterRequest,
  RegisterResponse,
} from "../types/auth";

export const login = async (
  userName: string,
  password: string
): Promise<LoginResponse> => {
  const res = await api.post("/Auth/login", {
    userName,
    password,
  });

  return res.data;
};

export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const res = await api.post("/Auth/Register", data);
  return res.data;
};