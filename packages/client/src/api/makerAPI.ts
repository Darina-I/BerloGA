import api from "./client";
import { MAKER_API_URL } from "./config";

export const makerApi = {
  getAll: async () => {
    const response = await api.get(`${MAKER_API_URL}`);
    return response.data;
  },
  post: async (name: string) => {
    const response = await api.post(`${MAKER_API_URL}`, { name });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`${MAKER_API_URL}/${id}`);
    return response.data;
  },
};
