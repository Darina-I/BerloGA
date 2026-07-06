import { useEffect, useState } from "react";
import BoardGames from "../components/organisms/BoardGames";
import Profile from "../components/organisms/Profile";
import { libraryAPI } from "../api/userAPI";
import CreateRequest from "../components/organisms/CreateRequest";

const LibraryPage = () => {
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const data = await libraryAPI.getLibrary();
        setLibrary(data);
      } catch (error) {
        console.error("Ошибка при загрузке библиотеки: ", error);
      }
    };

    fetchLibrary();
  }, []);

  return (
    <div>
      <p className="font-bold my-3 text-xl text-center">Моя библиотека</p>
      <div className="space-y-5">
        <Profile />
        <CreateRequest />
        <BoardGames list={library} isLibrary />
      </div>
    </div>
  );
};

export default LibraryPage;
