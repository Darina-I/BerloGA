import type { BoardGamesProps } from "../../types";
import BoardgameCard from "../molecules/BoardGameCard";
import Search from "../molecules/Search";

const BoardGames = ({ list, isLibrary }: BoardGamesProps) => {
  return (
    <div>
      <Search />
      <div className="grid grid-cols-4 gap-4 my-4">
        {list?.map((item) => (
          <BoardgameCard key={item.id} boardgame={item} isLibrary={isLibrary} />
        ))}
      </div>
    </div>
  );
};

export default BoardGames;
