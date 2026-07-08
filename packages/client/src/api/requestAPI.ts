import api from "./client";
import { REQUEST_API_URL } from "./config";

export const requestApi = {
  getAll: async () => {
    const response = await api.get(`${REQUEST_API_URL}`);
    return response.data;
  },
  updateRequest: async (id: number, status: boolean) => {
    const response = await api.patch(`${REQUEST_API_URL}/${id}`, { status });
    return response.data;
  },
};
