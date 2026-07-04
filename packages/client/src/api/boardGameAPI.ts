import { BOARDGAME_API_URL } from "./config";
import api from "./client";

interface Filter {
  genres?: number[];
}

export const boardGameApi = {
  getAll: async (filter: Filter) => {
    const response = await api.get(`${BOARDGAME_API_URL}`, {
      params: filter,
    });
    return response.data;
  },
  getById: async (gameId: number) => {
    const response = await api.get(`${BOARDGAME_API_URL}/${gameId}`);
    return response.data;
  },
  getGenreById: (id: number) => api.get(`${BOARDGAME_API_URL}/${id}/genres`),
};
