import axios from "axios";
import { BASE_URL } from "./config";

export const boardGameApi = {
  getAll: async () => {
    const response = axios.get(`${BASE_URL}/boardgames`);
    return (await response).data;
  },
  getById: (id: number) => axios.get(`${BASE_URL}/boardgames/${id}`),
};
