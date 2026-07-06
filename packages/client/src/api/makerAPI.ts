import api from "./client";
import { MAKER_API_URL } from "./config";

export const makerApi = {
  getAll: async () => {
    const response = await api.get(`${MAKER_API_URL}`);
    return response.data;
  },
};
