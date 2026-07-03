import { useEffect, useState } from "react";
import type {
  BoardGameItemProps,
  BoardGamesProps,
  LibraryGamesProps,
} from "../../types/boardgame.types";
import BoardgameCard from "../molecules/BoardGameCard";
import Search from "../molecules/Search";

const BoardGames = ({ list, isLibrary }: BoardGamesProps) => {
  const [searchList, setSearchList] = useState<BoardGameItemProps[]>([]);

  const getValueForSearch = (item: BoardGameItemProps | LibraryGamesProps) => {
    if (isLibrary) {
      return (item as LibraryGamesProps).game.name;
    } else {
      return (item as BoardGameItemProps).name;
    }
  };

  return (
    <div>
      <Search
        oldList={list}
        setList={setSearchList}
        getValue={getValueForSearch}
      />
      <div className="grid grid-cols-4 gap-4 my-4">
        {searchList?.map((item) => (
          <BoardgameCard key={item.id} boardgame={item} isLibrary={isLibrary} />
        ))}
      </div>
    </div>
  );
};

export default BoardGames;
