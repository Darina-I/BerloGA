import { useEffect, useState } from "react";
import BoardGames from "../components/organisms/BoardGames";
import Profile from "../components/organisms/Profile";
import { libraryAPI } from "../api/userAPI";

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
      <Profile />
      <BoardGames list={library} isLibrary />
    </div>
  );
};

export default LibraryPage;
