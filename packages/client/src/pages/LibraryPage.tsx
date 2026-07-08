import { useEffect, useState } from "react";
import BoardGames from "../components/organisms/BoardGames";
import Profile from "../components/organisms/Profile";
import { libraryAPI, usersApi } from "../api/userAPI";
import CreateRequest from "../components/organisms/CreateRequest";
import { useParams } from "react-router-dom";
import type { UserForCard } from "../types/user.types";

const LibraryPage = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [library, setLibrary] = useState([]);
  const [user, setUser] = useState<UserForCard>();

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const data = await libraryAPI.getLibrary();
        setLibrary(data);
      } catch (error) {
        console.error("Ошибка при загрузке библиотеки: ", error);
      }
    };

    const fetchLibraryById = async () => {
      try {
        const data = await libraryAPI.getLibraryById(Number(userId));
        setLibrary(data);
      } catch (error) {
        console.error("Ошибка при загрузке библиотеки: ", error);
      }
    };

    if (userId) {
      fetchLibraryById();
    } else {
      fetchLibrary();
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await usersApi.getById(Number(userId));
        setUser(data);
      } catch (error) {
        console.error("Ошибка при загрузке библиотеки: ", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return (
    <div>
      <p className="font-bold my-3 text-xl text-center">Моя библиотека</p>
      <div className="space-y-5">
        <Profile userInfo={user ? user : undefined} />
        {!userId && <CreateRequest />}
        <BoardGames list={library} isLibrary />
      </div>
    </div>
  );
};

export default LibraryPage;
