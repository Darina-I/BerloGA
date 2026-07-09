import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ListItems from "../components/molecules/ListItems";
import { boardGameApi } from "../api/boardGameAPI";
import type { BoardGameItemProps } from "../types/boardgame.types";
import { StarRating } from "../components/molecules/StarRating";
import Favourite from "../components/atoms/Favourite";
import Comments from "../components/organisms/Comments";
import Link from "../components/atoms/Link";

const BoardGamePage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState<BoardGameItemProps>();

  useEffect(() => {
    const loadGame = async () => {
      try {
        const result = await boardGameApi.getById(Number(gameId));
        setGame(result);
      } catch (error) {
        console.error("Ошибка при загрузке настольной игры: ", error);
      }
    };

    if (gameId) {
      loadGame();
    }
  }, [gameId]);

  return (
    <>
      <div className="bg-second-color rounded-lg p-5 space-y-5 relative mt-5">
        {game && (
          <div className="flex gap-10 w-full">
            <img className="rounded-lg" src={game?.photo} width={250} />
            <div className="w-1/2">
              <p className="text-2xl font-bold">{game?.name}</p>
              <div className="mt-3 text-lg">
                <div className="flex items-center gap-2">
                  <p>Время:</p>
                  <div className="flex-1 h-[0.5px] bg-main-color" />
                  <p>{game?.time} мин</p>
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
                <div className="flex items-center gap-2">
                  <p>Издательство:</p>
                  <div className="flex-1 h-[0.5px] bg-main-color" />
                  <p>{game?.maker.name}</p>
                </div>
              </div>
            </div>
            <StarRating
              rating={game?.rating}
              readonly
              position="top-5 right-5"
            />
          </div>
        )}
        {game?.genres && (
          <div className="flex justify-between items-center mb-3">
            <ListItems list={game?.genres} />
            <Favourite gameId={game.id} isInCard />
          </div>
        )}
        <div className="flex-1 h-[0.5px] bg-main-color" />
        <div className="text-justify">{game?.content}</div>
        {game?.pdf && <Link link={game?.pdf} content="Правила игры" isOut />}
      </div>
      {game && <Comments gameId={game.id} />}
    </>
  );
};

export default BoardGamePage;
