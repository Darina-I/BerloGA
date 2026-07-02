import BoardGames from "../components/organisms/BoardGames";
import { useEffect, useState } from "react";
import { boardGameApi } from "../api/boardGameAPI";
import type { BoardGameItemProps } from "../types/boardgame.types";

const MainPage = () => {
  const [games, setGames] = useState<BoardGameItemProps[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await boardGameApi.getAll();
        setGames(data);
      } catch (error) {
        console.error("Ошибка при загрузке настольных игр: ", error);
      }
    })();
  }, []);

  return (
    <div className="mt-7">
      <BoardGames list={games} />
    </div>
  );
};

export default MainPage;
