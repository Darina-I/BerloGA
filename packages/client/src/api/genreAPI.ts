import api from "./client";
import { GENRE_API_URL } from "./config";

export const genreApi = {
  getAll: async () => {
    const response = await api.get(`${GENRE_API_URL}`);
    return response.data;
  },
};
