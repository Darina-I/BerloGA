import { useParams } from "react-router-dom";
import { boardgames } from "../constants/boardgames";
import ListItems from "../components/molecules/ListItems";

const BoardGamePage = () => {
  const { gameId } = useParams();
  const game = boardgames.find((item) => String(item.id) === gameId);
  return (
    <div className="bg-second-color rounded-lg p-5 space-y-5 relative mt-5">
      <div className="flex gap-10 w-full">
        <img className="rounded-lg" src={game?.photo} width={200} />
        <div className="w-1/2">
          <p className="text-2xl font-bold">{game?.name}</p>
          <div className="mt-3 text-lg">
            <div className="flex items-center gap-2">
              <p>Время:</p>
              <div className="flex-1 h-[0.5px] bg-main-color" />
              <p>{game?.time}</p>
            </div>
            <div className="flex items-center gap-2">
              <p>Количество игроков:</p>
              <div className="flex-1 h-[0.5px] bg-main-color" />
              <p>
                {game?.min_number_players}-{game?.max_number_players} игрока
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p>Возрастное ограничение:</p>
              <div className="flex-1 h-[0.5px] bg-main-color" />
              <p>{game?.age}+</p>
            </div>
          </div>
        </div>
      </div>
      {game?.genres && <ListItems list={game?.genres} />}
      <div className="flex-1 h-[0.5px] bg-main-color" />
      <div className="text-justify">{game?.content}</div>
    </div>
  );
};

export default BoardGamePage;
