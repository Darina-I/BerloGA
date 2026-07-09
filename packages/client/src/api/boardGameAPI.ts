import { BOARDGAME_API_URL, COMMENT_BLOCK_API } from "./config";
import api from "./client";
import type { BoardGameAttributes } from "../types/boardgame.types";

interface Filter {
  genres?: number[];
}

export const boardGameApi = {
  getAll: async (filter?: Filter) => {
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
  postGame: async (data: BoardGameAttributes) => {
    const response = await api.post(`${BOARDGAME_API_URL}`, data);
    return response.data;
  },
  postGenre: async (id: number, genreId: number) => {
    const response = await api.post(`${BOARDGAME_API_URL}/${id}/genres`, {
      genreId,
    });
    return response.data;
  },
  deleteGenre: async (id: number, genreId: number) => {
    const response = await api.delete(
      `${BOARDGAME_API_URL}/${id}/genres/${genreId}`,
    );
    return response.data;
  },
};

export const commentBlockApi = {
  getAll: async (gameId: number) => {
    const response = await api.get(
      `${BOARDGAME_API_URL}/${gameId}/comments-blocks`,
    );
    return response.data;
  },
  post: async (gameId: number, header: string) => {
    const response = await api.post(
      `${BOARDGAME_API_URL}/${gameId}/comments-blocks`,
      { header },
    );
    return response.data;
  },
  postComment: async (blockId: number, content: string) => {
    const response = await api.post(`${COMMENT_BLOCK_API}/${blockId}`, {
      content,
    });
    return response.data;
  },
};
