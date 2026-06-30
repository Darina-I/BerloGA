import api from "./client";
import { CITY_API_URL } from "./config";

export const cityApi = {
  getAll: async () => {
    const response = await api.get(`${CITY_API_URL}`);
    return response.data;
  },
};
