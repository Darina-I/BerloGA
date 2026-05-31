import { useNavigate } from "react-router-dom";
import { person, time } from "../../assets";
import type { BoardGameItemProps } from "../../types";
import ListItems from "./ListItems";

interface BoardGameCardProps {
  game: BoardGameItemProps;
}

const BoardGameCard = ({ game }: BoardGameCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="border-2 border-second-color rounded-lg overflow-hidden bg-second-color cursor-pointer"
      onClick={() => navigate(`/boardgames/${game.id}`)}
    >
      <img src={game.photo} />
      <div className="p-2">
        <div className="pb-2 border-b border-main-color text-lg font-bold flex justify-between">
          <p>{game.name}</p>
          <p>{game.age}+</p>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <div className="flex gap-1">
            <img src={person} width={15} />
            <p>
              {game.min_number_players}-{game.max_number_players} игрока
            </p>
          </div>
          <div className="flex gap-1">
            <img src={time} width={17} />
            <p>{game.time}</p>
          </div>
        </div>
        <ListItems list={game.genres} />
      </div>
    </div>
  );
};

export default BoardGameCard;
