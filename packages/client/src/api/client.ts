import axios from "axios";
import { BASE_URL } from "./config";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;

//очередь отложенных запросов
let failedQueue: Array<{
  resolve: () => void; //вызов после успехного обновления токена
  reject: (err: any) => void; //вызов после провала при обновлении токена
}> = [];

//функция, которая размораживает все запросы в очереди
const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config; //сохраняет исходный запрос, который упал с 401

    if (err?.response?.status === 401 && !originalReq._retry) {
      //если токен уже в процессе обновления, то ставим запрос в очередь
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalReq))
          .catch((e) => Promise.reject(e));
      }

      originalReq._retry = true; //помечаем запрос, что он уже "был повторен", чтобы избежать цикла
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null); //сообщаем, что обновление прошла успешно и можно продолжитьь работу запросов в очереди
        return api(originalReq);
      } catch (refreshError) {
        processQueue(refreshError); //сообщаем об ошибки при обновлении токена
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err); //если это не 401 или повтор, то пробрасываем ошибку дальше
  },
);

export default api;
