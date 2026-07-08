import { AUTH_API_URL } from "./config";
import api from "./client";

export const authAPI = {
  register: async (nickname: string, password: string) => {
    const response = await api.post(`${AUTH_API_URL}/register`, {
      nickname,
      password,
    });
    return response.data;
  },
  login: async (nickname: string, password: string) => {
    const response = await api.post(`${AUTH_API_URL}/login`, {
      nickname,
      password,
    });
    return response.data;
  },
  logout: async () => {
    const response = await api.post(`${AUTH_API_URL}/logout`);
    return response.data;
  },
};
