import BoardGames from "../components/organisms/BoardGames";
import { useEffect, useState } from "react";
import { boardGameApi } from "../api/boardGameAPI";
import type { BoardGameItemProps } from "../types";

const MainPage = () => {
  const [games, setGames] = useState<BoardGameItemProps[]>([]);

  useEffect(() => {
    console.log("here");
    (async () => {
      try {
        const data = await boardGameApi.getAll();
        console.log(data);
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
