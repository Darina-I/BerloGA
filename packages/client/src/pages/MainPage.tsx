import BoardGames from "../components/organisms/BoardGames";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { boardGameApi } from "../api/boardGameAPI";
import type { BoardGameItemProps } from "../types/boardgame.types";
import Filter from "../components/organisms/Filter";

interface Filter {
  genres?: number[];
}

const MainPage = () => {
  const [games, setGames] = useState<BoardGameItemProps[]>([]);
  const [filter, setFilter] = useState<Filter>({});

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await boardGameApi.getAll(filter);
        setGames(data);
      } catch (error) {
        console.error("Ошибка при загрузке настольных игр: ", error);
      }
    };

    fetchGames();
  }, [filter]);

  const handleFilter = (genresId: number[]) => {
    setFilter({ genres: genresId });
  };

  return (
    <div className="mt-3">
      <Filter useFilter={handleFilter} />
      <BoardGames list={games} />
    </div>
  );
};

export default MainPage;
