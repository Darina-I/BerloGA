import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { person, time } from "../../assets";
import type {
  BoardGameItemProps,
  LibraryGamesProps,
} from "../../types/boardgame.types";
import ListItems from "./ListItems";
import Favourite from "../atoms/Favourite";
import { StarRating } from "./StarRating";

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

  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (isLibrary) {
      setGame((boardgame as LibraryGamesProps).game);
      setRating(Number((boardgame as LibraryGamesProps).rate));
    } else {
      setGame(boardgame as BoardGameItemProps);
    }
  }, [boardgame, isLibrary]);

  useEffect(() => {
    if (game) {
      setRating((prev) => (!isLibrary ? Math.floor(game.rating) : prev));
    }
  }, [game]);

  return (
    <>
      <div className="border-2 border-second-color rounded-lg overflow-hidden bg-second-color cursor-pointer">
        {game && (
          <>
            <div className="h-87.5 bg-white overflow-hidden relative">
              <StarRating rating={rating} />
              <Favourite gameId={game.id} />
              <img
                src={game?.photo}
                className="w-full h-full object-contain"
                onClick={() => navigate(`/boardgames/${game?.id}`)}
              />
            </div>
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
                  <p>{game?.time} мин</p>
                </div>
              </div>
              {game?.genres && <ListItems list={game.genres} />}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BoardGameCard;
