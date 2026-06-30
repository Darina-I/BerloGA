import { BOARDGAME_API_URL } from "./config";
import api from "./client";

export const boardGameApi = {
  getAll: async () => {
    const response = api.get(`${BOARDGAME_API_URL}`);
    return (await response).data;
  },
  getById: (id: number) => api.get(`${BOARDGAME_API_URL}/${id}`),
  getGenreById: (id: number) => api.get(`${BOARDGAME_API_URL}/${id}/genres`),
};
