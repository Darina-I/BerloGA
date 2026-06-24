import axios from "axios";
import { BASE_URL } from "./config";

export const authAPI = {
  register: async (nickname: string, password: string) => {
    const response = await axios.post(`${BASE_URL}/register`, {
      nickname,
      password,
    });
    return response.data;
  },
  login: async (nickname: string, password: string) => {
    const response = await axios.post(`${BASE_URL}/login`, {
      nickname,
      password,
    });
    return response.data;
  },
};
