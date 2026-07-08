import { useEffect, useState } from "react";
import { usersApi } from "../api/userAPI";
import UserCard from "../components/molecules/UserCard";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await usersApi.getAll();
        setUsers(result);
      } catch (error) {
        console.error("Ошибка при загрузке списка пользователей: ", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 my-4">
      {users?.map((u) => (
        <UserCard user={u} />
      ))}
    </div>
  );
};

export default UsersPage;
