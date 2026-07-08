import api from "./client";
import { GENRE_API_URL } from "./config";

export const genreApi = {
  getAll: async () => {
    const response = await api.get(`${GENRE_API_URL}`);
    return response.data;
  },
  post: async (name: string) => {
    const response = await api.post(`${GENRE_API_URL}`, { name });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`${GENRE_API_URL}/${id}`);
    return response.data;
  },
};
