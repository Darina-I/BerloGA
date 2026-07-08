import { useEffect, useState } from "react";
import { usersApi } from "../../../api/userAPI";
import Button from "../../atoms/Button";

interface UserAttributes {
  id: number;
  nickname: string;
  email?: string;
  city: {
    id: number;
    name: string;
  };
  social_network: string;
  role: "admin" | "user";
}

const UsersTable = () => {
  const [users, setUsers] = useState<UserAttributes[]>([]);
  const [updateList, setUpdateList] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersApi.getAll();
        setUsers(data);
      } catch (error) {
        console.error("Ошибка при загрузке городов: ", error);
      }
    };

    fetchUsers();
  }, [updateList]);

  const handleChangeRole = async (id: number, role: "user" | "admin") => {
    try {
      const newRole = role === "user" ? "admin" : "user";
      const result = await usersApi.patchRole(id, newRole);
      setUpdateList((prev) => prev + 1);
    } catch (error) {
      console.error("Ошибка при обновлении роли пользователя: ", error);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-main-color bg-white">
      <table className="w-full divide-y divide-main-color table-auto">
        <thead className="bg-second-color">
          <tr>
            <th className="px-6 py-4 text-xs font-medium uppercase"></th>
            <th className="px-6 py-4 text-xs font-medium uppercase">Ник</th>

            <th className="px-6 py-4 text-xs font-medium uppercase">Почта</th>
            <th className="px-6 py-4 text-xs font-medium uppercase">Город</th>
            <th className="px-6 py-4 text-xs font-medium uppercase">Роль</th>
            <th className="px-6 py-4 text-xs font-medium uppercase">
              Социальные сети
            </th>
            <th className="px-6 py-4 text-xs font-medium uppercase"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-second-color">
          {users?.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium">{index + 1}</td>
              <td className="px-6 py-4">{item.nickname}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {item.email}
              </td>

              <td className="px-6 py-4 text-center">{item.city?.name}</td>

              <td className="px-6 py-4 text-center bg-third-color">
                {item.role}
              </td>

              <td className="px-6 py-4 text-center">{item.social_network}</td>
              <td className="px-6 py-4 text-center text-xs whitespace-nowrap border-l border-second-color">
                <Button
                  content="Изменить роль"
                  onClick={() => handleChangeRole(item.id, item.role)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
