import {
  USER_API_URL,
  USER_GENRE_API_URL,
  USER_LIBRARY_API_URL,
} from "./config";
import api from "./client";
import type { UpdateUser } from "../types/user.types";

export const libraryAPI = {
  getLibrary: async () => {
    const response = await api.get(`${USER_LIBRARY_API_URL}`);
    return response.data;
  },
  postGameToLibrary: async (gameId: number, rate: number) => {
    const response = await api.post(`${USER_LIBRARY_API_URL}/${gameId}`, {
      rate,
    });
    return response.data;
  },
  deleteGameLibrary: async (gameId: number) => {
    const response = await api.delete(`${USER_LIBRARY_API_URL}/${gameId}`);
    return response.data;
  },
};

export const profileAPI = {
  updateUser: async (data: UpdateUser) => {
    const response = await api.put(`${USER_API_URL}/me`, { data });
    return response.data;
  },
  getFavouriteGenres: async () => {
    const response = await api.get(`${USER_GENRE_API_URL}`);
    return response.data;
  },
  postFavouriteGenres: async (genreId: number) => {
    const response = await api.post(`${USER_GENRE_API_URL}`, { genreId });
    return response.data;
  },
  deleteFavouriteGenres: async (genreId: number) => {
    const response = await api.delete(`${USER_GENRE_API_URL}/${genreId}`);
    return response.data;
  },
};
