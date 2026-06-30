import { useNavigate } from "react-router-dom";
import { person, time } from "../../assets";
import type { BoardGameItemProps, LibraryGamesProps } from "../../types";
import ListItems from "./ListItems";
import { useEffect, useState } from "react";

interface BoardGameCardProps {
  boardgame: BoardGameItemProps | LibraryGamesProps;
  isLibrary?: boolean;
}

const BoardGameCard = ({
  boardgame,
  isLibrary = false,
}: BoardGameCardProps) => {
  const navigate = useNavigate();
  const [game, setGame] = useState<BoardGameItemProps>();

  useEffect(() => {
    if (isLibrary) {
      setGame((boardgame as LibraryGamesProps).game);
    } else {
      setGame(boardgame as BoardGameItemProps);
    }
  }, [boardgame, isLibrary]);

  return (
    <div
      className="border-2 border-second-color rounded-lg overflow-hidden bg-second-color cursor-pointer"
      onClick={() => navigate(`/boardgames/${game?.id}`)}
    >
      <img src={game?.photo} />
      <div className="p-2">
        <div className="pb-2 border-b border-main-color text-lg font-bold flex justify-between">
          <p>{game?.name}</p>
          <p>{game?.age}+</p>
        </div>
        <div className="my-2 flex justify-between text-sm">
          <div className="flex gap-1">
            <img src={person} width={15} />
            <p>
              {game?.min_number_players}-{game?.max_number_players} игрока
            </p>
          </div>
          <div className="flex gap-1">
            <img src={time} width={17} />
            <p>{game?.time}</p>
          </div>
        </div>
        {game?.genres && <ListItems list={game.genres} />}
      </div>
    </div>
  );
};

export default BoardGameCard;
