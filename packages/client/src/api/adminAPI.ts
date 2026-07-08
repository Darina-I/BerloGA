import api from "./client";
import { ADMIN_API_URL } from "./config";

export const adminApi = {
  getCountGames: async () => {
    const response = await api.get(`${ADMIN_API_URL}/countgames`);
    return response.data;
  },
  getTopGames: async () => {
    const response = await api.get(`${ADMIN_API_URL}/topgames`);
    return response.data;
  },
  getAllUsers: async () => {
    const response = await api.get(`${ADMIN_API_URL}/users`);
    return response.data;
  },
};
