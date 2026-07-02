import { BOARDGAME_API_URL } from "./config";
import api from "./client";

export const boardGameApi = {
  getAll: async () => {
    const response = await api.get(`${BOARDGAME_API_URL}`);
    return response.data;
  },
  getById: async (gameId: number) => {
    const response = await api.get(`${BOARDGAME_API_URL}/${gameId}`);
    return response.data;
  },
  getGenreById: (id: number) => api.get(`${BOARDGAME_API_URL}/${id}/genres`),
};
