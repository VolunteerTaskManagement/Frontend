import { api } from "./api";
import type {
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordResponse,
  ChangeForgotPasswordRequest,
  ChangeForgotPasswordResponse,
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

export const forgotPassword = async (
  userName: string
): Promise<ForgotPasswordResponse> => {
  const res = await api.post("/Auth/ForgotPassword", {
    userName,
  });

  return res.data;
};

export const ChangeForgotPassword = async (
  data: ChangeForgotPasswordRequest
): Promise<ChangeForgotPasswordResponse> => {
  const res = await api.post(
    "/Auth/ChangeForgotPassword",
    data
  );

  return res.data;
};