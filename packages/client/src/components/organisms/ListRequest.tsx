import { useState, useEffect } from "react";
import { requestApi } from "../../api/requestAPI";
import type { User } from "../../types/user.types";
import Button from "../atoms/Button";

interface RequestAttributes {
  id: number;
  name: string;
  details?: string;
  is_done: boolean;
  user: User;
  createdAt: Date;
}

const ListRequest = () => {
  const [requests, setRequests] = useState<RequestAttributes[]>([]);
  const [updateList, setUpdateList] = useState(0);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await requestApi.getAll();
        setRequests(data);
      } catch (error) {
        console.error("Ошибка при загрузке запросов: ", error);
      }
    };

    fetchRequests();
  }, [updateList]);

  const handleDone = async (id: number, status: boolean) => {
    try {
      const result = await requestApi.updateRequest(id, !status);
      setUpdateList((prev) => prev + 1);
    } catch (error) {
      console.error("Ошибка при обновлении статуса запроса: ", error);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-main-color bg-white">
        <table className="w-full divide-y divide-main-color">
          <thead className="bg-second-color">
            <tr>
              <th className="px-6 py-4 text-xs font-medium uppercase"></th>
              <th className="px-6 py-4 text-xs font-medium uppercase">
                Название
              </th>

              <th className="px-6 py-4 text-xs font-medium uppercase">
                Статус
              </th>
              <th className="px-6 py-4 text-xs font-medium uppercase">
                Пользователь
              </th>
              <th className="px-6 py-4 text-xs font-medium uppercase">Дата</th>
              <th className="px-6 py-4 text-xs font-medium uppercase">
                Детали запроса
              </th>
              <th className="px-6 py-4 text-xs font-medium uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-second-color">
            {requests?.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{index + 1}</td>

                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.is_done
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.is_done ? "Выполнено" : "В работе"}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item.user.nickname}
                </td>

                <td className="px-6 py-4 text-sm">
                  {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                </td>

                <td className="px-6 py-4 text-justify">
                  {item?.details || "-"}
                </td>

                <td className="px-6 py-4 text-xs border-l border-second-color whitespace-nowrap text-center">
                  <Button
                    content={item.is_done ? "Вернуть в работу" : "Выполнить"}
                    onClick={() => handleDone(item.id, item.is_done)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRequest;
